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
