
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const questionsFile = path.join(root, "evaluation", "questions.json");
const endpoint = "http://localhost:3005/api/chat";

if (!fs.existsSync(questionsFile)) {
  console.error("Missing evaluation/questions.json");
  process.exit(1);
}

const questions = JSON.parse(
  fs.readFileSync(questionsFile, "utf8")
);

const refusalPhrases = [
  "not enough information",
  "does not provide enough information",
  "do not provide enough information",
  "cannot confirm",
  "can't confirm",
  "unable to confirm",
  "not listed in",
  "not documented",
  "don't have enough information",
  "do not have enough information",
];

async function evaluateQuestion(item) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: item.question,
      }),
    });

    const raw = await response.text();

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return {
        id: item.id,
        question: item.question,
        status: "FAIL",
        reason: `API returned invalid JSON (HTTP ${response.status})`,
      };
    }

    const reply =
      typeof data.reply === "string" ? data.reply.trim() : "";

    const sources = Array.isArray(data.sources)
      ? data.sources
      : [];

    if (!response.ok || !reply) {
      return {
        id: item.id,
        question: item.question,
        status: "FAIL",
        reason: `HTTP ${response.status}: ${reply || raw}`,
      };
    }

    if (item.type === "unsupported") {
      const lowerReply = reply.toLowerCase();

      const refused = refusalPhrases.some((phrase) =>
        lowerReply.includes(phrase)
      );

      return {
        id: item.id,
        question: item.question,
        status: refused ? "PASS" : "REVIEW",
        reason: refused
          ? "Refusal wording detected"
          : "Check whether the answer avoids inventing facts",
        reply,
        sources,
      };
    }

    const hasSources = sources.length > 0;

    return {
      id: item.id,
      question: item.question,
      status: hasSources ? "REVIEW" : "FAIL",
      reason: hasSources
        ? "Response and sources returned; check factual accuracy manually"
        : "No source documents returned",
      reply,
      sources,
    };
  } catch (error) {
    return {
      id: item.id,
      question: item.question,
      status: "FAIL",
      reason: `Could not reach the API: ${error.message}`,
    };
  }
}

async function main() {
  console.log("\nRAG CHATBOT EVALUATION");
  console.log("======================\n");

  const results = [];

  for (const item of questions) {
    console.log(`Testing ${item.id}: ${item.question}`);

    const result = await evaluateQuestion(item);
    results.push(result);

    console.log(`Status: ${result.status}`);
    console.log(`Reason: ${result.reason}`);

    if (result.reply) {
      console.log(`Answer: ${result.reply}`);
    }

    if (result.sources?.length) {
      console.log(`Sources: ${result.sources.join(", ")}`);
    }

    console.log("");
  }

  const passed = results.filter(
    (result) => result.status === "PASS"
  ).length;

  const review = results.filter(
    (result) => result.status === "REVIEW"
  ).length;

  const failed = results.filter(
    (result) => result.status === "FAIL"
  ).length;

  console.log("======================");
  console.log("EVALUATION SUMMARY");
  console.log(`Total questions: ${results.length}`);
  console.log(`PASS: ${passed}`);
  console.log(`REVIEW: ${review}`);
  console.log(`FAIL: ${failed}`);
  console.log(
    "Note: Supported answers marked REVIEW need manual fact-checking."
  );

  const outputDir = path.join(root, "evaluation");
  fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(
    path.join(outputDir, "results.json"),
    JSON.stringify(results, null, 2),
    "utf8"
  );

  console.log("\nDetailed results saved to evaluation/results.json");
}

main().catch((error) => {
  console.error("Evaluation failed:", error.message);
  process.exitCode = 1;
});