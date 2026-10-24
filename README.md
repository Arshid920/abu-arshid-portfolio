# Abu Arshid P — Portfolio and Knowledge Chatbot

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

- `knowledge/` — source documents used by the chatbot
- `scripts/ingest.js` — generates chunks and embeddings
- `data/chunks.json` — generated retrieval index
- `api/chat.js` — chatbot API and retrieval-augmented generation
- `src/components/ChatWidget.jsx` — chatbot interface
- `evaluation/` — chatbot evaluation files and results

Run ingestion again after changing the knowledge documents:

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
