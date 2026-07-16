# Self-Consistency Engine

A multi-model AI reasoning engine that fans out a prompt to multiple LLMs simultaneously, then uses a judge model to synthesise the best answer.

**Stack:** React + TypeScript + Vite (Frontend) · Node.js + Express (Backend)  
**Models used:** Gemini 2.5 Flash Lite · Gemma 4 31B · OpenAI o3-mini

---

## Project Structure

```
self-consistency-engine/
├── Backend/          # Express API server
│   ├── src/
│   │   ├── index.js
│   │   └── responces/   # Model handler files
│   ├── .env          ← you create this (see below)
│   └── package.json
└── Frontend/         # React + Vite app
    ├── src/
    │   └── services/api.ts
    ├── .env          ← you create this (see below)
    └── package.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher
- API keys for:
  - [Google AI Studio](https://aistudio.google.com/) → Gemini API key
  - [OpenAI Platform](https://platform.openai.com/) → OpenAI API key

---

## 1 · Clone the Repository

```bash
git clone https://github.com/your-username/self-consistency-engine.git
cd self-consistency-engine
```

---

## 2 · Set Up Environment Variables

> ⚠️ **Never commit `.env` files.** Both are already listed in `.gitignore`.

### Backend — `Backend/.env`

Create the file `Backend/.env` and add the following:

```env
# ── API Keys ──────────────────────────────────────────────
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# ── Server config ─────────────────────────────────────────
PORT=3000
BACKEND_URL=http://localhost:3000

# ── CORS — comma-separated list of allowed frontend origins ─
# Add your deployed frontend URL here when deploying
FRONTEND_URL=http://localhost:5173
```

### Frontend — `Frontend/.env`

Create the file `Frontend/.env` and add the following:

```env
# URL of the backend API server
# Change this to your deployed backend URL when deploying
VITE_BACKEND_URL=http://localhost:3000
```

> **Why `VITE_` prefix?** Vite only exposes variables prefixed with `VITE_` to the browser bundle. Any variable without this prefix stays server-side only.

---

## 3 · Install Dependencies

Open **two terminals** — one for the backend and one for the frontend.

**Terminal 1 — Backend:**
```bash
cd Backend
npm install
```

**Terminal 2 — Frontend:**
```bash
cd Frontend
npm install
```

---

## 4 · Run Locally

**Terminal 1 — Start the backend:**
```bash
cd Backend
npm run dev
```
The API server starts at `http://localhost:3000`

**Terminal 2 — Start the frontend:**
```bash
cd Frontend
npm run dev
```
The app opens at `http://localhost:5173`

---

## 5 · Verify It's Working

Visit `http://localhost:3000/health` in your browser. You should see:
```json
{ "ok": true }
```

Then open `http://localhost:5173`, enter a prompt, and the engine will query all three models simultaneously.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/query` | Query a single model |
| `POST` | `/api/judge` | Judge a set of model responses |

### `POST /api/query`
```json
// Request body
{ "model": "gemini-2.5-flash-lite", "question": "What is recursion?" }

// Response
{ "model": "gemini-2.5-flash-lite", "response": "..." }
```
Valid model values: `gemini-2.5-flash-lite`, `gemma-4-31b-it`, `o3-mini`

### `POST /api/judge`
```json
// Request body
{
  "question": "What is recursion?",
  "responses": [
    { "model": "gemini-2.5-flash-lite", "response": "..." },
    { "model": "o3-mini", "response": "..." }
  ]
}

// Response
{ "judgment": "..." }
```

---

## Deploying to Production

When deploying (e.g. Render for backend, Vercel for frontend), set environment variables **directly in your hosting platform's dashboard** — do **not** upload `.env` files.

| Service | Variable | Value |
|---------|----------|-------|
| **Backend** (Render / Railway) | `OPENAI_API_KEY` | your OpenAI key |
| | `GEMINI_API_KEY` | your Gemini key |
| | `PORT` | `3000` (or platform default) |
| | `FRONTEND_URL` | `https://your-app.vercel.app` |
| **Frontend** (Vercel / Netlify) | `VITE_BACKEND_URL` | `https://your-backend.onrender.com` |

> **CORS tip:** `FRONTEND_URL` supports a comma-separated list of origins, so you can allow both localhost and your production URL during testing:
> ```
> FRONTEND_URL=http://localhost:5173,https://your-app.vercel.app
> ```

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| `CORS error` in browser | `FRONTEND_URL` on backend doesn't include your frontend's origin | Add your frontend URL to `FRONTEND_URL` |
| `404` on API calls | `VITE_BACKEND_URL` points to wrong URL | Check the value in `Frontend/.env` and redeploy |
| `401 Unauthorized` from model | API key missing or invalid | Double-check `OPENAI_API_KEY` / `GEMINI_API_KEY` in `Backend/.env` |
| Backend won't start | Missing `.env` file | Make sure `Backend/.env` exists with all required keys |
