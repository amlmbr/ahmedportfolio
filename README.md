# Ahmed Moubarak Lahlyal — AI Engineer Portfolio & Interview Presentation

A premium, interactive single-page portfolio that doubles as a **screen-share interview presentation**. Dark, aerospace / critical-systems inspired, fully in English, with a built-in AI assistant grounded in a local knowledge base.

- **Live:** https://ahmedportfolio2-sigma.vercel.app/
- **Positioning:** AI Engineer with a strong Data Engineering foundation — trustworthy AI, generative AI, knowledge graphs, agentic systems and industrial AI.

---

## What's inside

| Path | Purpose |
|------|---------|
| `index.html` | The whole site (static, zero build step). Sections double as presentation steps. |
| `assets/portfolio.js` | All behavior: animations, presentation mode, the Ahmed AI assistant (retrieval + generation). |
| `assets/portrait.jpg` | Hero portrait. |
| `photos/` | Innov'Boost 2025 photos. |
| `assets/ahmed-profile.js` | **Single source of truth** — Ahmed's complete structured profile (`window.AHMED_PROFILE`): sections, curated answers and grouped suggested questions. Grounds the assistant. |
| `api/chat.js` | Vercel serverless function: same-origin `/api/chat` → Ollama (with honest fallback). |
| `server/dev-server.mjs` | Zero-dependency local server (static + `/api/chat` proxy to Ollama). |
| `.env.example` | `OLLAMA_BASE_URL`, `OLLAMA_MODEL`. |

> The assistant is **profile-grounded**: `assets/ahmed-profile.js` is the single canonical profile. The browser loads it as a global, runs intent-aware retrieval over Ahmed's whole profile, and sends the relevant sections to `/api/chat` (Llama 3.2) — or answers from curated profile answers on the web. Editing one file updates both the site's chatbot and the model context. It is deliberately **not** SecureDocAI-only.

---

## Presentation mode

Click **▶ Interview Presentation** (nav or hero). The site becomes a guided, one-viewport-per-step deck while staying a live website.

- **→ / Space** next step · **←** previous step · **Esc** exit
- Left progress rail: `01 Intro · 02 Profile · 03 Journey · 04 SecureDocAI · 05 AI Projects · 06 Engineering Mindset · 07 Why Thales · 08 AI Assistant · 09 Let's Talk`
- Toggle **Hints** for concise presenter notes (off-screen for the audience; you keep them short and oral).

---

## The AI assistant — two modes

The assistant (**Ahmed AI**) always **retrieves** relevant context in the browser from the local knowledge base, then **generates** an answer one of two ways. It never invents experience, technologies, metrics, publications or confidential Thales information.

### Mode A — Local interview demo (Llama 3.2 via Ollama)
Status shows **● Llama 3.2 · Local**. The browser calls the **same-origin** `/api/chat` route (never `localhost:11434` directly); the server proxies to Ollama.

```bash
# 1. Install Ollama  →  https://ollama.com/download
# 2. Pull the model
ollama pull llama3.2
# 3. Start Ollama (usually already running as a service)
ollama serve
# 4. Start the portfolio with its local API server (Node 18+, no npm install needed)
npm run dev
# 5. Open the local URL
#    http://localhost:5173
# 6. Ask the AI assistant a question — it now runs on Llama 3.2
```

### Mode B — Web deployment (Vercel)
Status shows **○ Knowledge-base mode · Web**. On Vercel, `localhost:11434` is unreachable, so `/api/chat` honestly reports `available:false` and the assistant answers from the **grounded knowledge base** (retrieval + curated interview answers). Fallback answers are **never** presented as Llama output.

If you later expose a **secured, reachable** Ollama-compatible endpoint, set `OLLAMA_BASE_URL` in the Vercel project environment variables — the same backend then streams Llama answers, no code change.

---

## Local development

Requires **Node 18+** (built-in `fetch`; no dependencies to install).

```bash
npm run dev      # serves the site + /api/chat at http://localhost:5173
```

You can also open `index.html` on any static host — the assistant simply stays in knowledge-base mode (there is no `/api/chat` without the dev server).

Environment (optional locally; defaults already work):

```bash
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

---

## Deploying on Vercel

Static site + one serverless function — no framework, no build.

1. Push the repo; import it on Vercel (Framework preset: **Other**).
2. `api/chat.js` is auto-detected as a serverless function; the rest is served statically.
3. (Optional) set `OLLAMA_MODEL` / `OLLAMA_BASE_URL` env vars if you have a reachable endpoint.

`vercel.json` only sets `cleanUrls` and the function `maxDuration`.

---

## Data accuracy

All metrics and facts are verified and centralized in `assets/ahmed-profile.js`. Notable figures (SecureDocAI): 500 documents, 6,000 scenarios, 97.8% RBAC compliance, 95% authorized utility, unauthorized leakage 15.39% → 0.21% (98.6% relative reduction), PII/PHI micro-F1 0.96, risk classifier ROC-AUC 0.98. NeurologiqueTWIN: ≈92% internal accuracy, 2nd Prize Innov'Boost 2025. Publication: CityEcoScout (IJCEDS, Vol. 4 Issue 1, 2025, pp. 41–54, co-author). SecureDocAI manuscript: **in preparation** (LISTIC, with Faiza Loukil and Hervé Verjus).

---

## Limitations

- The public Vercel deployment cannot reach a laptop's local Ollama; that's by design (Mode B). The Llama demo is meant to be shown from the local server during the interview.
- The client-side knowledge base is a mirror of the JSON file — edit both when changing facts.
- No analytics, tracking or external fonts/CDNs — the page is self-contained for reliable offline screen-sharing.
