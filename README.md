# Abu Arshid P — Portfolio and Knowledge Chatbot

A React and Vite portfolio featuring a Gemini-powered chatbot that retrieves information from a local knowledge base about my CV, projects, and professional background.

## Requirements

- Node.js and npm
- Google Gemini API key for embedding generation and AI responses
- Vercel CLI for local serverless API testing

## Run locally

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```text
GEMINI_API_KEY=your_gemini_api_key
```

Keep your API key private and never commit `.env.local`.

Generate the knowledge index:

```bash
npm run ingest
```

Start the application and API locally:

```bash
npx vercel dev
```

Open the local URL printed by Vercel. The chatbot API is available at `/api/chat`.

## Build and evaluation

Build the frontend:

```bash
npm run build
```

Run the evaluation suite:

```bash
npm run evaluate
```

Evaluation requires a working Gemini API quota. Review the actual evaluation results before drawing conclusions.

## Project structure

- `knowledge/` — source documents used by the chatbot
- `scripts/ingest.js` — creates text chunks and embeddings
- `data/chunks.json` — generated retrieval index
- `api/chat.js` — chatbot API, retrieval, and response generation
- `src/components/ChatWidget.jsx` — chatbot interface
- `evaluation/` — chatbot evaluation files and results

Run `npm run ingest` again after changing the knowledge documents.

## Retrieval and model choices

- **Embedding model:** `gemini-embedding-001` converts knowledge chunks and user questions into vectors for semantic retrieval.
- **Chunking:** Documents are split at paragraph boundaries where possible, with a maximum target length of 900 characters per chunk. Longer paragraphs are split into 900-character segments. There is no overlap between chunks.
- **Retrieval:** The API ranks stored document embeddings by cosine similarity and selects up to six relevant chunks.
- **Answer generation:** The API sends retrieved portfolio context and the user's question to the configured Gemini generation model.
- **Grounding:** The system instruction directs the chatbot to use the supplied portfolio context and avoid inventing unsupported qualifications, employment, skills, or project details.
- **Quota fallback:** When a recognized Gemini quota error occurs, the API can return predefined portfolio answers or search the local knowledge documents without generating a new AI response.

## Known limitations

- Gemini requests can fail when the configured API quota is exhausted.
- The local fallback supports predefined question categories and keyword search; it may not answer every question as flexibly as the AI response.
- Evaluation results depend on API availability and quota. Check the saved results rather than assuming all tests pass.
- Test the deployed website and chatbot API before submission.

## Deployment

1. Import the repository into Vercel.
2. Configure `GEMINI_API_KEY` in the Vercel project environment variables.
3. Deploy the project.
4. Test the live portfolio and chatbot API.

## Security

- Do not commit `.env.local` or other files containing secrets.
- Do not expose API keys in frontend code.
- Review knowledge documents and evaluation outputs before publishing the repository.

## Author

Abu Arshid P  
Dubai, UAE

- Portfolio: https://abu-arshid-portfolio-uo2g.vercel.app/
- LinkedIn: https://linkedin.com/in/abu-arshid
- GitHub: https://github.com/Arshid920