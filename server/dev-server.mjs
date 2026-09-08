// Zero-dependency local dev server for the portfolio.
//
//   node server/dev-server.mjs   ->   http://localhost:5173
//
// It serves the static site AND exposes a same-origin /api/chat route that
// proxies to a locally running Ollama (llama3.2). This is what makes the
// LOCAL INTERVIEW DEMO of the AI assistant work end to end:
//
//   Browser --> http://localhost:5173/api/chat --> Ollama --> llama3.2
//
// The browser only ever talks to this same-origin server, never to Ollama
// directly. Requires Node 18+ (uses the built-in fetch). No npm install needed.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = normalize(join(fileURLToPath(new URL('.', import.meta.url)), '..'));
const PORT = process.env.PORT || 5173;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

const SYSTEM_PROMPT = `You are Ahmed AI, the professional portfolio assistant of Ahmed Moubarak Lahlyal.

You have access to structured, verified information covering Ahmed's complete profile: education, research, publications, professional experience, AI projects, data engineering, machine learning, deep learning, generative AI, knowledge graphs, technical skills, soft skills, engineering mindset, awards, certifications, languages and apprenticeship.

Answer the user's actual question using the most relevant parts of the retrieved context. Be concise, technically precise and professional.

Do NOT automatically redirect answers toward SecureDocAI. SecureDocAI is Ahmed's flagship trustworthy-AI research project, but it is only one part of his profile. When a broad question is asked (e.g. "who is Ahmed?"), give a balanced overview across education, experience, research and skills. When a specific project is asked about, focus deeply on that project.

When research or publications are asked about, clearly distinguish PUBLISHED work (CityEcoScout, IJCEDS 2025, co-author) from work IN PREPARATION (the SecureDocAI manuscript at LISTIC).

Never invent facts, metrics, employers, publications or technologies. Never claim knowledge of confidential Thales information.

If the retrieved context does not contain the answer, say: "I don't have verified information about that in Ahmed's portfolio."`;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2'
};

async function reachOllama(ms = 1500) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: ctrl.signal });
    clearTimeout(t);
    return r.ok;
  } catch {
    clearTimeout(t);
    return false;
  }
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 1e6) req.destroy(); });
    req.on('end', () => resolve(data));
  });
}

async function handleChat(req, res) {
  if (req.method === 'GET') {
    const available = await reachOllama();
    return json(res, 200, { available, model: OLLAMA_MODEL, mode: available ? 'ollama' : 'knowledge-base' });
  }
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  let body = {};
  try { body = JSON.parse(await readBody(req) || '{}'); } catch { body = {}; }
  const question = String(body.question || '').slice(0, 2000);
  const context = String(body.context || '').slice(0, 8000);
  const history = Array.isArray(body.history) ? body.history.slice(-6)
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 1200) })) : [];
  if (!question.trim()) return json(res, 400, { error: 'Missing question' });

  if (!(await reachOllama())) return json(res, 200, { available: false, mode: 'knowledge-base' });

  const userPrompt =
    `Portfolio context:\n${context || '(no specific section retrieved)'}\n\n` +
    `Question: ${question}\n\nAnswer using only the portfolio context above.`;

  try {
    const r = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        options: { temperature: 0.2 },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history,
          { role: 'user', content: userPrompt }
        ]
      })
    });
    if (!r.ok) return json(res, 200, { available: false, mode: 'knowledge-base' });
    const data = await r.json();
    const answer = data?.message?.content?.trim() || '';
    if (!answer) return json(res, 200, { available: false, mode: 'knowledge-base' });
    return json(res, 200, { available: true, mode: 'ollama', model: OLLAMA_MODEL, answer });
  } catch {
    return json(res, 200, { available: false, mode: 'knowledge-base' });
  }
}

function json(res, code, obj) {
  const s = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(s) });
  res.end(s);
}

async function serveStatic(req, res) {
  let urlPath = decodeURIComponent(new URL(req.url, `http://localhost`).pathname);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = normalize(join(ROOT, urlPath));
  // prevent path traversal outside ROOT
  if (!filePath.startsWith(ROOT + sep) && filePath !== ROOT) {
    res.writeHead(403); return res.end('Forbidden');
  }
  try {
    const info = await stat(filePath);
    if (info.isDirectory()) throw new Error('dir');
    const buf = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  if (pathname === '/api/chat') return handleChat(req, res);
  return serveStatic(req, res);
});

server.listen(PORT, async () => {
  const ok = await reachOllama();
  console.log(`\n  Portfolio            →  http://localhost:${PORT}`);
  console.log(`  Interview mode       →  http://localhost:${PORT}/presentation`);
  console.log(`  Ahmed AI · Ollama    →  ${ok ? '● Llama 3.2 — Local (reachable ✓)' : '○ Web knowledge mode (Ollama not reachable)'}`);
  if (!ok) console.log(`  Tip: run "ollama serve" and "ollama pull ${OLLAMA_MODEL}" to enable the live model.\n`);
  else console.log('');
});
