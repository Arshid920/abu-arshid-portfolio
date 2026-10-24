
import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";

// Project folders
const root = process.cwd();
const envFile = path.join(root, ".env.local");
const knowledgeDir = path.join(root, "knowledge");
const outputDir = path.join(root, "data");
const outputFile = path.join(outputDir, "chunks.json");

// Load GEMINI_API_KEY from .env.local if not already set
if (!process.env.GEMINI_API_KEY && fs.existsSync(envFile)) {
  const envText = fs.readFileSync(envFile, "utf8");

  const keyLine = envText
    .split(/\r?\n/)
    .find((line) => /^\s*GEMINI_API_KEY\s*=/.test(line));

  if (keyLine) {
    process.env.GEMINI_API_KEY = keyLine
      .slice(keyLine.indexOf("=") + 1)
      .trim()
      .replace(/^(['"])(.*)\1$/, "$2");
  }
}

// Check API key before creating the client
const apiKey = process.env.GEMINI_API_KEY?.trim();

if (!apiKey) {
  console.error(
    "GEMINI_API_KEY was not found. Check your .env.local file."
  );
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Knowledge files to process
const files = [
  "cv.md",
  "project-ai-monitoring.md",
  "project-medshed.md",
  "faq.md",
];

// Split documents into manageable text chunks
function splitIntoChunks(text, maxLength = 900) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxLength) {
      if (current) {
        chunks.push(current);
        current = "";
      }

      for (let i = 0; i < paragraph.length; i += maxLength) {
        chunks.push(paragraph.slice(i, i + maxLength));
      }

      continue;
    }

    if (
      current &&
      current.length + paragraph.length + 2 > maxLength
    ) {
      chunks.push(current);
      current = paragraph;
    } else {
      current = current
        ? `${current}\n\n${paragraph}`
        : paragraph;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

// Generate a real vector embedding for a text chunk
async function embedText(text) {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  const values = result.embeddings?.[0]?.values;

  if (!values || values.length === 0) {
    throw new Error("Google returned an empty embedding.");
  }

  return values;
}

// Read files, embed chunks, and rebuild the saved index
async function main() {
  const documents = [];

  for (const file of files) {
    const filePath = path.join(knowledgeDir, file);

    if (!fs.existsSync(filePath)) {
      console.warn(`Skipping missing file: ${file}`);
      continue;
    }

    const content = fs.readFileSync(filePath, "utf8").trim();

    if (!content) {
      console.warn(`Skipping empty file: ${file}`);
      continue;
    }

    const chunks = splitIntoChunks(content);

    console.log(`Processing ${file}: ${chunks.length} chunks`);

    for (let index = 0; index < chunks.length; index++) {
      console.log(
        `Embedding ${file}, chunk ${index + 1}/${chunks.length}...`
      );

      const embedding = await embedText(chunks[index]);

      documents.push({
        id: `${file}-${index + 1}`,
        source: file,
        chunkIndex: index,
        content: chunks[index],
        embedding,
      });
    }
  }

  if (documents.length === 0) {
    throw new Error(
      "No knowledge chunks were created. Check your knowledge folder."
    );
  }

  fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(
    outputFile,
    JSON.stringify(documents),
    "utf8"
  );

  console.log("");
  console.log(`Created ${documents.length} embedded chunks.`);
  console.log(`Saved index to: ${outputFile}`);
}

main().catch((error) => {
  console.error("Ingestion failed:", error.message);
  process.exitCode = 1;
});
