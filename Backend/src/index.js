import "dotenv/config";
import express from "express";
import cors from "cors";
import { geminiResponse } from "./responces/gemini.js";
import { gemmaResponse } from "./responces/gemini-2.js";
import { openaiResponse } from "./responces/openai.js";
import { judgeResponses } from "./responces/judgeResponse.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// Model registry — maps a model key to its handler function
const MODEL_HANDLERS = {
  "gemini-2.5-flash-lite": geminiResponse,
  "gemma-4-31b-it": gemmaResponse,
  "o3-mini": openaiResponse,
};

// ─── POST /api/query ──────────────────────────────────────────────────────────
// Body: { model: string, question: string }
// Returns: { model, response }
app.post("/api/query", async (req, res) => {
  const { model, question } = req.body;

  if (!question || typeof question !== "string" || question.trim() === "") {
    return res.status(400).json({ error: "question is required" });
  }

  if (!model || !MODEL_HANDLERS[model]) {
    return res.status(400).json({
      error: `model is required. Valid values: ${Object.keys(MODEL_HANDLERS).join(", ")}`,
    });
  }

  try {
    const response = await MODEL_HANDLERS[model](question);
    return res.json({ model, response });
  } catch (error) {
    console.error(`[/api/query] Error for model ${model}:`, error);
    return res.status(500).json({ model, response: null, error: "Model call failed" });
  }
});

// ─── POST /api/judge ──────────────────────────────────────────────────────────
// Body: { question: string, responses: [{ model: string, response: string }] }
// Returns: { judgment }
app.post("/api/judge", async (req, res) => {
  const { question, responses } = req.body;

  if (!question || typeof question !== "string" || question.trim() === "") {
    return res.status(400).json({ error: "question is required" });
  }

  if (!Array.isArray(responses) || responses.length === 0) {
    return res.status(400).json({ error: "responses array is required" });
  }

  try {
    const judgment = await judgeResponses(question, responses);
    return res.json({ judgment });
  } catch (error) {
    console.error("[/api/judge] Error:", error);
    return res.status(500).json({ error: "Judgment failed" });
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
