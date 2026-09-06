# Mnemora · the archive that answers

The chatbot world of Dhruv Bendre's solar-system portfolio. A visitor asks about Dhruv; the archive answers only from what it holds, and says plainly when it does not hold the answer.

Under the hood it is a small retrieval-augmented generation (RAG) pipeline behind a Streamlit interface dressed as the interior of World VIII. RAG is never mentioned to the visitor.

```
dhruv-rag/
  app.py                 Streamlit entry point (the conversation)
  ingest.py              build / inspect the index from the command line
  config/settings.py     every setting, read from env / st.secrets
  rag/
    loader.py            markdown + frontmatter -> Document (placeholders excluded)
    chunker.py           heading-aware chunks with breadcrumbs
    embeddings.py        OpenAI embeddings, or a keyless local fallback
    vector_store.py      numpy cosine index, persisted to .index/
    retriever.py         top-k with a grounding threshold
    prompts.py           the archive's voice and rules
    llm.py               openai | anthropic | none
    pipeline.py          Archive.ask(question, history) -> Answer
  ui/                    the world's look: horizon art, components
  styles/streamlit.css   the theme (hides default Streamlit chrome)
  knowledge/             the documents the archive answers from
  tests/                 retrieval + refusal tests, no keys needed
```

## Run locally

```bash
cd dhruv-rag
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

macOS / Linux:

```bash
source .venv/bin/activate
```

Then:

```bash
pip install -r requirements.txt
copy .env.example .env        # macOS/Linux: cp .env.example .env
streamlit run app.py
```

Open http://localhost:8501. With no keys in `.env` the archive runs in **no-model mode**: it still retrieves, returns matching passages verbatim, and refuses what it cannot ground. That is enough to see the interface and test the knowledge folder.

## The API (what the portfolio's Mnemora page talks to)

Since 2026-09-06 the Mnemora page in `../web` chats with the archive inline instead of handing off to Streamlit. `api.py` exposes the same `Archive` over HTTP:

```bash
uvicorn api:app --port 8000
```

| Route | What it does |
|---|---|
| `GET /health` | What the archive holds and which model answers. |
| `POST /ask` | `{"question": "...", "history": [{"role": "user" \| "assistant", "content": "..."}]}` → a `text/event-stream` of JSON events: `meta` (grounded, mode, sources), `delta` (text fragments), `done` (the full answer). |

In development the Vite server proxies `/api/archive` to port 8000, so nothing else is needed. In production set `ARCHIVE_ALLOWED_ORIGINS` (comma separated) to the portfolio's origin and point the web build's `VITE_ARCHIVE_API_URL` at the API. The Streamlit app still works as before.

Retrieval is hybrid: embedding similarity plus an IDF-weighted exact-word match (`rag/retriever.py`), so a single project name finds its section even with the keyless local embeddings.

## Environment

| Variable | Purpose |
|---|---|
| `LLM_PROVIDER` | `openai`, `anthropic` or `none`. Blank auto-detects from the keys below. |
| `OPENAI_API_KEY` | For OpenAI chat and embeddings. `OPENAI_BASE_URL` points at any OpenAI-compatible endpoint. |
| `ANTHROPIC_API_KEY` | For Anthropic chat (default model `claude-opus-5`). |
| `MODEL_NAME` | Chat model override. |
| `EMBEDDING_PROVIDER` | `openai` (needs the OpenAI key) or `local` (keyless hashed fallback for development). |
| `EMBEDDING_MODEL` | Default `text-embedding-3-small`. |
| `RETRIEVAL_TOP_K`, `RETRIEVAL_MIN_SCORE` | How many chunks to consider and the cosine floor below which the archive refuses. |
| `PORTFOLIO_URL` | Where "Back to the system" leads. |
| `INCLUDE_TEST_DATA` | `true` loads `knowledge/_test_data` (fictional, TEST_DATA_ONLY). Keep `false` in production. |

See `.env.example` for the full list. Never commit `.env`; it is ignored by git.

### Using Groq, xAI Grok or another OpenAI-compatible model

These APIs speak the OpenAI protocol, so the `openai` provider works with a different base URL. Groq (keys start with `gsk_`):

```
LLM_PROVIDER=openai
OPENAI_API_KEY=gsk_your-key
OPENAI_BASE_URL=https://api.groq.com/openai/v1
MODEL_NAME=openai/gpt-oss-120b
EMBEDDING_PROVIDER=local
```

For xAI Grok use `OPENAI_BASE_URL=https://api.x.ai/v1` and `MODEL_NAME=grok-4`. To see which model ids your key can use, list them with the OpenAI SDK against the same base URL (`client.models.list()`); a wrong id shows up as a 404 "model not found".

Neither service has an embeddings endpoint, so retrieval uses the built-in `local` embeddings (a hashed keyword index). It works, but it matches on words rather than meaning: write knowledge sections with the terms people will actually ask about. The same pattern works for Together, OpenRouter or Ollama by changing the URL and model name.

A note on embeddings: the `local` provider is a deterministic hashed bag-of-words. It makes the pipeline runnable and testable without a key, but it is not a semantic model. For real answers use `EMBEDDING_PROVIDER=openai`.

## Adding Dhruv's real information

1. Open `knowledge/`. Each file is one category with a frontmatter block and markdown body. `knowledge/README.md` describes the format.
2. Replace the `TODO:` bodies with verified content. One `##` heading per project, role, paper or topic.
3. Remove `status: placeholder` from the frontmatter of every file you filled in.
4. Check what will be indexed:

   ```bash
   python ingest.py --check
   ```

5. Start the app (the index rebuilds automatically when the folder changes) or rebuild explicitly:

   ```bash
   python ingest.py
   ```

6. Replace the five category prompts at the top of `app.py` with real questions worth asking.

Nothing else changes. Placeholder documents are never indexed, so the archive cannot read a TODO back as a fact.

## Testing retrieval and refusal

```bash
pip install -r requirements-dev.txt
python -m pytest
```

The tests run with the local embeddings, no model, and a temporary index. They check that placeholders are excluded, that headings become chunk boundaries, that a grounded question returns sources, that an unrelated question is refused, and that conversation history cannot override retrieval.

To try the refusal path by hand, run the app with `INCLUDE_TEST_DATA=true` and ask about the fictional "Lantern Kite"; then ask something unrelated.

## Deploy to Streamlit Community Cloud

1. **Create a GitHub repository** and push the project. The Streamlit app lives in the `dhruv-rag/` folder of the portfolio repo; that is fine, Streamlit lets you pick the entry file.
2. **Make sure `dhruv-rag/requirements.txt` exists** (it does) and pins nothing you do not use.
3. Go to https://share.streamlit.io, sign in with GitHub, and click **New app**.
4. Choose the repository and branch, and set **Main file path** to `dhruv-rag/app.py`.
5. Open **Advanced settings → Secrets** and paste the values from your `.env`, in TOML form:

   ```toml
   LLM_PROVIDER = "openai"
   OPENAI_API_KEY = "sk-..."
   MODEL_NAME = "gpt-4o-mini"
   EMBEDDING_PROVIDER = "openai"
   PORTFOLIO_URL = "https://dhruvbendre.com"
   ```

   Secrets are read through `st.secrets`; the app never needs a `.env` on the server.
6. **Never commit `.env`** or `.streamlit/secrets.toml`. Both are in `.gitignore`.
7. Click **Deploy**. The first start builds the index from `knowledge/`; later starts reuse it until the folder changes.
8. **Test retrieval**: open the deployed URL, pick a category, and confirm you get either a grounded answer with a "from the archive" line or a plain refusal.
9. **Test the environment**: the footer line says which mode the archive is in ("answers in its own words" needs a model; "returns passages verbatim" means no key was found). Check the app logs in the Streamlit dashboard if a key is refused.
10. Set `VITE_ARCHIVE_URL` in the web app to the deployed URL (or a custom domain such as `ask.dhruvbendre.com`) so the portfolio's Mnemora threshold carries visitors here.

The Streamlit app reads `?q=` from the URL. The portfolio passes the visitor's question that way, so the conversation starts the moment they arrive.

## Troubleshooting

- **"The archive holds 0 live documents"**: every file in `knowledge/` is still a placeholder. Fill in a file and remove `status: placeholder`.
- **"returns passages verbatim"** in the footer: no chat key was found. Set `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` (in `.env` locally, in Secrets on Streamlit Cloud).
- **Answers are vague or refused too often**: lower `RETRIEVAL_MIN_SCORE` a little, or write shorter sections with one idea each so retrieval lands on the right chunk. Make sure you are using `EMBEDDING_PROVIDER=openai`, not `local`.
- **The index looks stale**: delete `.index/` and restart, or run `python ingest.py`.
- **Streamlit chrome shows for a moment on load**: normal; `styles/streamlit.css` hides it as soon as it is injected.
- **Fonts fall back**: the theme loads Manrope and Caveat from Google Fonts; offline it falls back to system fonts.
