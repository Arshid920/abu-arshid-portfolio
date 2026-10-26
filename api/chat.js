
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

try {
  process.loadEnvFile(path.resolve(process.cwd(), ".env.local"));
} catch {
  // Environment variables may already be loaded.
}

const REFUSAL =
  "The portfolio documents do not provide enough information to confirm that.";

const SYSTEM_INSTRUCTION = `
You are the assistant for Abu Arshid P's portfolio.

Answer using only the portfolio context provided.
Be friendly, concise, and accurate.
Use complete sentences and answer the specific question.
Do not invent employment, qualifications, skills, or project details.
If the context does not contain the answer, say:
"The portfolio documents do not provide enough information to confirm that."
`;

function getApiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY.trim();
  }

  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    const envText = fs.readFileSync(envPath, "utf8");
    const match = envText.match(
      /^\s*GEMINI_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?\s*$/m
    );

    return match ? match[1].trim() : "";
  } catch {
    return "";
  }
}

function loadIndex() {
  const indexPath = path.resolve(
    process.cwd(),
    "data",
    "chunks.json"
  );

  if (!fs.existsSync(indexPath)) {
    throw new Error(`Knowledge index not found: ${indexPath}`);
  }

  const parsed = JSON.parse(
    fs.readFileSync(indexPath, "utf8")
  );

  if (!Array.isArray(parsed)) {
    throw new Error("The knowledge index must contain a JSON array.");
  }

  return parsed;
}

function cosineSimilarity(a, b) {
  if (
    !Array.isArray(a) ||
    !Array.isArray(b) ||
    a.length !== b.length
  ) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function geminiRequest(apiKey, model, action, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);

    const request = https.request(
      {
        hostname: "generativelanguage.googleapis.com",
        path:
          `/v1beta/models/${model}:${action}` +
          `?key=${encodeURIComponent(apiKey)}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
        timeout: 30000,
      },
      (response) => {
        let data = "";

        response.setEncoding("utf8");

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          let parsed;

          try {
            parsed = JSON.parse(data);
          } catch {
            reject(
              new Error(
                `Gemini returned invalid JSON (HTTP ${response.statusCode}).`
              )
            );
            return;
          }

          if (
            response.statusCode < 200 ||
            response.statusCode >= 300
          ) {
            reject(
              new Error(
                parsed?.error?.message ||
                  `Gemini returned HTTP ${response.statusCode}.`
              )
            );
            return;
          }

          resolve(parsed);
        });
      }
    );

    request.on("timeout", () => {
      request.destroy(new Error("Gemini request timed out."));
    });

    request.on("error", reject);

    request.end(payload);
  });
}

async function embedQuestion(apiKey, question) {
  const result = await geminiRequest(
    apiKey,
    "gemini-embedding-001",
    "embedContent",
    {
      content: {
        parts: [{ text: question }],
      },
    }
  );

  const embedding = result?.embedding?.values;

  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error("Gemini did not return a question embedding.");
  }

  return embedding;
}

async function retrieveKnowledge(apiKey, question) {
  const documents = loadIndex();
  const queryEmbedding = await embedQuestion(apiKey, question);

  return documents
    .filter(
      (doc) =>
        typeof doc.content === "string" &&
        Array.isArray(doc.embedding)
    )
    .map((doc) => ({
      ...doc,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }))
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Use POST to send a message.",
    });
  }

  try {
    const message = req.body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Please enter a question.",
      });
    }

    const question = message.trim();

    if (question.length > 1000) {
      return res.status(400).json({
        error: "Your question is too long.",
      });
    }

    const apiKey = getApiKey();

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing.");
    }

    const retrieved = await retrieveKnowledge(apiKey, question);

    if (retrieved.length === 0) {
      return res.status(200).json({
        reply: REFUSAL,
        sources: [],
      });
    }

    const context = retrieved
      .map(
        (item) =>
          `[Source: ${item.source || "Portfolio document"}]\n${item.content}`
      )
      .join("\n\n");

    const result = await geminiRequest(
      apiKey,
      "gemini-3.5-flash",
      "generateContent",
      {
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  `Portfolio context:\n${context}\n\n` +
                  `Question: ${question}\n\n` +
                  "Answer directly in complete sentences.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 600,
        },
      }
    );

    const reply = result?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      throw new Error(
        result?.promptFeedback?.blockReason ||
          "Gemini returned an empty answer."
      );
    }

    const sources = [
      ...new Set(
        retrieved.map((item) => item.source).filter(Boolean)
      ),
    ];

    return res.status(200).json({
      reply,
      sources,
    });
  } catch (error) {
    const message = String(error?.message || "");

    console.error(
      "Chat API error:",
      error?.stack || message || "Unknown error"
    );

    const quotaExceeded =
      /quota|rate.?limit|resource_exhausted|free_tier_requests/i.test(
        message
      );

    if (quotaExceeded) {
      return res.status(503).json({
        error:
          "The chatbot has temporarily reached its AI service usage limit. Please try again later.",
        code: "AI_QUOTA_EXCEEDED",
      });
    }

    return res.status(500).json({
      error:
        "The chatbot is temporarily unavailable. Please try again later.",
      code: "CHAT_API_ERROR",
    });
  }
}
