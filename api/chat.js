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
Answer using only the supplied portfolio context.
Be friendly, concise, and accurate.
Never invent employment, qualifications, skills, or project details.
If the answer is not supported by the context, say:
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

  if (normA === 0 || normB === 0) return 0;

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

// Local keyword search for when the AI generation quota is exhausted.
function searchLocalKnowledge(question) {
  const documents = loadIndex();

  const stopWords = new Set([
    "what", "who", "where", "when", "which", "how",
    "tell", "about", "your", "you", "are", "is", "the",
    "and", "for", "his", "him", "with", "does", "did",
    "have", "has", "can", "could", "please", "main",
    "arshid", "portfolio", "experience", "me",
  ]);

  const tokens = question
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !stopWords.has(word));

  if (tokens.length === 0) return [];

  return documents
    .filter((doc) => typeof doc.content === "string")
    .map((doc) => {
      const content = doc.content.toLowerCase();

      const score = tokens.reduce((total, token) => {
        return total + (content.includes(token) ? 1 : 0);
      }, 0);

      return { ...doc, score };
    })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function fallbackAnswer(question) {
  const q = question.toLowerCase();

  // These answers use the portfolio facts supplied for this project.
  if (/\b(education|educational|degree|degrees|mca|bca|university|studied|study|college)\b/.test(q)) {
    return "Abu Arshid P completed an MCA specializing in Artificial Intelligence and Machine Learning at Jain Deemed-to-be University in 2026. He completed his BCA at the University of Calicut in 2024.";
  }

  if (/\b(internship|internships|intern|interned)\b/.test(q)) {
    return "Abu Arshid completed a React.js internship at ERE Business Solutions, where he worked on reusable components and REST API integration. He also completed a Python Technology internship at Acura Software Solutions.";
  }

  if (/\b(skill|skills|technology|technologies|tech stack|programming|languages|tools)\b/.test(q)) {
    return "Abu Arshid's skills include Python, JavaScript, React.js, SQL, REST APIs, HTML, CSS, and AI/ML technologies such as OpenCV and YOLOv8. He also has foundational knowledge of Windows, Linux, and networking.";
  }

  if (/\b(project|projects|built|developed|portfolio|medsched|boat|passenger|safety|vision)\b/.test(q)) {
    return "Abu Arshid's projects include a Vision-Enabled AI-Based Safety and Passenger Monitoring System using Python, computer vision, and YOLOv8, and MedSched, a medicine scheduling application built with React, TypeScript, and Tailwind CSS. You can explore the source code through his GitHub profile: https://github.com/Arshid920.";
  }

  if (/\b(google|company|companies|employer|employers|employment|worked at|work history|job history)\b/.test(q)) {
    return "The portfolio documents list internships at ERE Business Solutions and Acura Software Solutions. They do not confirm employment at Google or other companies beyond the experience described in the portfolio.";
  }

  if (/\b(hello|hi|hey|hlo|good morning|good afternoon|good evening)\b/.test(q.trim())) {
    return "Hi! I'm Arshid's portfolio assistant. You can ask me about his education, skills, internships, projects, or technologies.";
  }

  // Search the actual portfolio documents when no predefined answer fits.
  const matches = searchLocalKnowledge(question);

  if (matches.length > 0) {
    return (
      "Here is relevant information from the portfolio:\n\n" +
      matches
        .map((item) => item.content.trim())
        .join("\n\n")
    );
  }

  return REFUSAL;
}

function isQuotaError(error) {
  return /quota|rate.?limit|resource_exhausted|free_tier_requests|429/i.test(
    String(error?.message || "")
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Use POST to send a message.",
    });
  }

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

  try {
    const apiKey = getApiKey();

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing.");
    }

    const retrieved = await retrieveKnowledge(apiKey, question);

    if (retrieved.length === 0) {
      return res.status(200).json({
        reply: fallbackAnswer(question),
        sources: [],
        mode: "fallback",
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

    return res.status(200).json({
      reply,
      sources: [
        ...new Set(
          retrieved.map((item) => item.source).filter(Boolean)
        ),
      ],
      mode: "ai",
    });
  } catch (error) {
    console.error(
      "Chat API error:",
      error?.stack || error?.message || "Unknown error"
    );

    if (isQuotaError(error)) {
      try {
        return res.status(200).json({
          reply: fallbackAnswer(question),
          sources: [],
          mode: "fallback",
        });
      } catch (fallbackError) {
        console.error("Local fallback error:", fallbackError);

        return res.status(200).json({
          reply: fallbackAnswer(question),
          sources: [],
          mode: "fallback",
        });
      }
    }

    return res.status(500).json({
      error:
        "The chatbot is temporarily unavailable. Please try again later.",
      code: "CHAT_API_ERROR",
    });
  }
}
