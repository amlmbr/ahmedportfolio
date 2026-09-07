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

const SYSTEM_PROMPT = `You are Ahmed AI, an assistant representing the professional portfolio of Ahmed Moubarak Lahlyal.

Answer questions about Ahmed's education, experience, AI projects, technical skills and engineering approach using ONLY the provided portfolio context.

Be concise, technically precise and professional.

When describing a project:
1. explain the problem;
2. explain Ahmed's contribution;
3. mention relevant technologies;
4. mention measured results when available;
5. explain what Ahmed learned.

Never invent information. Never claim knowledge of confidential Thales systems or projects.

When asked why Ahmed could fit Thales, connect his verified experience in trustworthy AI, secure RAG, knowledge graphs, agents, data engineering, multimodal AI and experimental evaluation with the general challenges of reliable industrial AI, without pretending knowledge of confidential Thales work.

If the context does not contain the answer, say so clearly.`;

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
  console.log(`\n  Portfolio dev server  →  http://localhost:${PORT}`);
  console.log(`  Ollama (${OLLAMA_BASE_URL}, ${OLLAMA_MODEL}): ${ok ? 'reachable ✓  — assistant runs on Llama 3.2' : 'not reachable — assistant runs in knowledge-base mode'}`);
  if (!ok) console.log(`  Tip: run "ollama serve" and "ollama pull ${OLLAMA_MODEL}" to enable the live model.\n`);
  else console.log('');
});
