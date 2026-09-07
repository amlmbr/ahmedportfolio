// Vercel serverless function: POST /api/chat  and  GET /api/chat (health probe).
//
// Design (see README):
//   Browser --> /api/chat (same origin) --> Ollama (llama3.2)
//
// The browser NEVER calls Ollama/localhost directly. It calls this same-origin
// route. On a public Vercel deployment, OLLAMA_BASE_URL (http://localhost:11434)
// points at the visitor-less server and is unreachable, so this route honestly
// reports { available: false } and the client falls back to grounded
// knowledge-base mode. If you later configure OLLAMA_BASE_URL to a reachable,
// secured Ollama-compatible endpoint, the same code streams Llama answers.

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

const SYSTEM_PROMPT = `You are Ahmed AI, the professional portfolio assistant of Ahmed Moubarak Lahlyal.

You have access to structured, verified information covering Ahmed's complete profile: education, research, publications, professional experience, AI projects, data engineering, machine learning, deep learning, generative AI, knowledge graphs, technical skills, soft skills, engineering mindset, awards, certifications, languages and apprenticeship.

Answer the user's actual question using the most relevant parts of the retrieved context. Be concise, technically precise and professional.

Do NOT automatically redirect answers toward SecureDocAI. SecureDocAI is Ahmed's flagship trustworthy-AI research project, but it is only one part of his profile. When a broad question is asked (e.g. "who is Ahmed?"), give a balanced overview across education, experience, research and skills. When a specific project is asked about, focus deeply on that project.

When research or publications are asked about, clearly distinguish PUBLISHED work (CityEcoScout, IJCEDS 2025, co-author) from work IN PREPARATION (the SecureDocAI manuscript at LISTIC).

Never invent facts, metrics, employers, publications or technologies. Never claim knowledge of confidential Thales information.

If the retrieved context does not contain the answer, say: "I don't have verified information about that in Ahmed's portfolio."`;

async function reachOllama(signalMs = 1500) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), signalMs);
  try {
    const r = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: ctrl.signal });
    clearTimeout(timer);
    return r.ok;
  } catch {
    clearTimeout(timer);
    return false;
  }
}

export default async function handler(req, res) {
  // Health probe — the client calls this on load to pick a mode.
  if (req.method === 'GET') {
    const available = await reachOllama();
    return res.status(200).json({
      available,
      model: OLLAMA_MODEL,
      mode: available ? 'ollama' : 'knowledge-base'
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const question = (body && body.question ? String(body.question) : '').slice(0, 2000);
  const context = (body && body.context ? String(body.context) : '').slice(0, 8000);
  const history = Array.isArray(body && body.history) ? body.history.slice(-6)
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 1200) })) : [];

  if (!question.trim()) {
    return res.status(400).json({ error: 'Missing question' });
  }

  const available = await reachOllama();
  if (!available) {
    // Do NOT fabricate a Llama answer. Tell the client to use its grounded
    // knowledge-base fallback (retrieval + curated answers).
    return res.status(200).json({ available: false, mode: 'knowledge-base' });
  }

  const userPrompt =
    `Portfolio context:\n${context || '(no specific section retrieved)'}\n\n` +
    `Question: ${question}\n\n` +
    `Answer using only the portfolio context above.`;

  try {
    const ollamaRes = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
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

    if (!ollamaRes.ok) {
      return res.status(200).json({ available: false, mode: 'knowledge-base' });
    }

    const data = await ollamaRes.json();
    const answer = (data && data.message && data.message.content) ? data.message.content.trim() : '';
    if (!answer) return res.status(200).json({ available: false, mode: 'knowledge-base' });

    return res.status(200).json({ available: true, mode: 'ollama', model: OLLAMA_MODEL, answer });
  } catch {
    return res.status(200).json({ available: false, mode: 'knowledge-base' });
  }
}
