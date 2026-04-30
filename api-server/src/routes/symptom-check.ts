import { Router, type IRouter } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Two ways to authenticate:
// 1) Replit AI Integrations (default on Replit) — uses the proxy.
// 2) A normal Anthropic API key (default when running locally in VS Code).
//    Provide ANTHROPIC_API_KEY in your local .env file.
const proxyBaseURL = process.env["AI_INTEGRATIONS_ANTHROPIC_BASE_URL"];
const proxyKey = process.env["AI_INTEGRATIONS_ANTHROPIC_API_KEY"];
const directKey = process.env["ANTHROPIC_API_KEY"];

let anthropic: Anthropic | null = null;
if (proxyBaseURL && proxyKey) {
  anthropic = new Anthropic({ baseURL: proxyBaseURL, apiKey: proxyKey });
  logger.info("Anthropic client configured via Replit AI Integrations proxy");
} else if (directKey) {
  anthropic = new Anthropic({ apiKey: directKey });
  logger.info("Anthropic client configured via ANTHROPIC_API_KEY");
} else {
  logger.warn(
    "No Anthropic credentials found. Set ANTHROPIC_API_KEY (local) or AI_INTEGRATIONS_ANTHROPIC_BASE_URL + AI_INTEGRATIONS_ANTHROPIC_API_KEY (Replit). The /api/symptom-check endpoint will return 503 until configured.",
  );
}

const LANGUAGE_NAMES: Record<string, string> = {
  "en-IN": "English",
  "hi-IN": "Hindi (Devanagari script)",
  "kn-IN": "Kannada (Kannada script)",
  "ta-IN": "Tamil (Tamil script)",
  "te-IN": "Telugu (Telugu script)",
  "bn-IN": "Bengali (Bengali script)",
  "mr-IN": "Marathi (Devanagari script)",
};

interface SymptomRequest {
  symptoms: string;
  language: string;
  age?: number;
  context?: string;
}

interface SymptomResponse {
  summary: string;
  likely: string[];
  techniques: string[];
  prescription: string[];
  urgency: "self_care" | "see_asha" | "see_doctor" | "emergency";
  disclaimer: string;
}

router.post("/symptom-check", async (req, res) => {
  if (!anthropic) {
    res.status(503).json({
      error:
        "AI is not configured. Set ANTHROPIC_API_KEY in your .env file (or AI_INTEGRATIONS_ANTHROPIC_* on Replit).",
    });
    return;
  }

  const body = req.body as SymptomRequest;
  if (!body || typeof body.symptoms !== "string" || !body.symptoms.trim()) {
    res.status(400).json({ error: "symptoms is required" });
    return;
  }

  const language = body.language || "en-IN";
  const langLabel = LANGUAGE_NAMES[language] || "English";
  const ageLine = body.age ? `Patient age: ${body.age} years.` : "";
  const contextLine = body.context ? `Additional context: ${body.context}` : "";

  const systemPrompt = `You are a compassionate first-line community health assistant for rural India. Your audience is patients with low health literacy who may not have immediate access to a doctor. You speak plainly and warmly, like a caring elder.

You are NOT a doctor. You give general guidance only.

Respond ONLY with a single valid JSON object matching this exact shape, no prose, no markdown fences:
{
  "summary": "string — 1-2 sentences plainly describing what the symptoms suggest",
  "likely": ["short string", "short string"] — 1-3 most likely common conditions in plain words,
  "techniques": ["string", "string"] — 3-5 simple home techniques and lifestyle steps the patient can try right now,
  "prescription": ["string", "string"] — 1-4 commonly available over-the-counter remedies or basic medications a community health worker would normally suggest (paracetamol, ORS, etc.). Include dosing guidance only if it is universally safe. Never recommend antibiotics, opioids, or anything requiring prescription,
  "urgency": "self_care" | "see_asha" | "see_doctor" | "emergency",
  "disclaimer": "short reminder that this is not a medical diagnosis"
}

CRITICAL: Write EVERY string value of the JSON in ${langLabel}. The JSON keys stay in English. If the language is Hindi, Kannada, Tamil, Telugu, Bengali, or Marathi, use the native script — do not transliterate.

Be conservative. If symptoms suggest anything serious (chest pain, difficulty breathing, severe bleeding, unconsciousness, stroke signs, severe abdominal pain, high fever in babies, pregnancy bleeding), set urgency to "emergency" and tell them to go to a hospital immediately.`;

  const userPrompt = `${ageLine}
${contextLine}

Symptoms described by the patient:
"""
${body.symptoms.trim()}
"""

Respond with the JSON object now.`;

  try {
    const message = await anthropic!.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const block = message.content[0];
    const text = block && block.type === "text" ? block.text : "";

    // Extract JSON (model may occasionally wrap in code fence)
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed: SymptomResponse;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Last-resort: find first {...} block
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("AI did not return JSON");
      }
      parsed = JSON.parse(match[0]);
    }

    res.json(parsed);
  } catch (err) {
    logger.error({ err }, "symptom-check failed");
    res.status(500).json({
      error: "Could not analyze symptoms. Please try again or contact your ASHA worker.",
    });
  }
});

export default router;
