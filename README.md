# Abu Arshid P � Portfolio and Knowledge Chatbot

A React and Vite portfolio featuring a Gemini-powered chatbot that retrieves information from a local knowledge base about my CV, projects, and professional background.

## Requirements

- Node.js and npm
- A Google Gemini API key for chatbot responses and embedding generation
- Vercel CLI for local serverless API testing

## Run locally

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root and add your key:

```text
GEMINI_API_KEY=your_gemini_api_key
```

Never commit `.env.local` or share your API key publicly.

Generate the knowledge index:

```bash
npm run ingest
```

Start the Vercel development environment:

```bash
npx vercel dev
```

Open the local URL printed by Vercel. The chatbot API is available at `/api/chat`.

## Build

```bash
npm run build
```

The Vite production build is generated in `dist/`.

## Knowledge base and retrieval

- `knowledge/` � source documents used by the chatbot
- `scripts/ingest.js` � generates chunks and embeddings
- `data/chunks.json` � generated retrieval index
- `api/chat.js` � chatbot API and retrieval-augmented generation
- `src/components/ChatWidget.jsx` � chatbot interface
- `evaluation/` � chatbot evaluation files and results

Run ingestion again after changing the knowledge documents:

## Retrieval and model choices

- **Embedding model:** `gemini-embedding-001` converts knowledge documents and user questions into embeddings for semantic retrieval.
- **Chunking:** The ingestion script splits the knowledge documents into smaller chunks and saves the resulting index in `data/chunks.json`.
- **Retrieval:** The chatbot retrieves the four most relevant chunks and uses them as context for the response.
- **Answer generation:** The server-side API sends the retrieved context and the user's question to the Gemini model.
- **Grounding:** The chatbot is intended to answer using the available portfolio documents and avoid inventing unsupported personal or employment details.

## Known limitations and testing status

- Gemini API requests can fail when the available quota is exhausted. The chatbot may temporarily return an error until the quota becomes available again.
- The evaluation script is provided to test supported questions and questions that should be refused. Run it when the Gemini API is available, then review the actual results.
- The deployed chatbot and its API configuration must be tested before submission. Do not claim all evaluation tests pass unless the results confirm this.



```bash
npm run ingest
```

## Evaluation

Run the evaluation suite with:

```bash
npm run evaluate
```

Evaluation requires a working Gemini API quota. Results may vary with API availability and quota limits; check the saved evaluation results rather than assuming all tests pass.

## Deploy to Vercel

1. Import the repository into Vercel.
2. Configure `GEMINI_API_KEY` in the Vercel project environment variables.
3. Deploy the project.
4. Test the deployed portfolio and `/api/chat` endpoint.

Keep API keys in environment variables, not in source code or committed files.

## Security

- Do not commit `.env.local` or other files containing secrets.
- Do not expose API keys in frontend code.
- Review evaluation outputs and knowledge documents before publishing the repository.

## Author

Abu Arshid P
Dubai, UAE

Portfolio: https://abu-arshid-portfolio-uo2g.vercel.app/
LinkedIn: https://linkedin.com/in/abu-arshid
GitHub: https://github.com/Arshid920
