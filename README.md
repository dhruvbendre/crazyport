# Dhruv Bendre · a solar system

An immersive personal portfolio structured as a fictional solar system. The visitor arrives in front of a hand-drawn crayon universe; every planet is a world holding one part of Dhruv Bendre's work and story, circled in white chalk and annotated like a find on an astronomer's plate. One world, **Mnemora**, can be spoken to: it is an archive that answers questions about Dhruv, grounded only in what it holds.

This is Phase 1: the artistic and technical foundation. No biographical information about Dhruv is present yet; every world holds explicit placeholders, and the archive says so when asked.

```
/
├── art.md                  the visual constitution (colour, type, chalk, motion, components, rules)
├── plot.md                 the narrative: premise, the Sun, the world registry, Mnemora, progression
├── README.md               this file
│
├── web/                    the solar system (Vite + React + TypeScript + GSAP, pure SVG art)
│   ├── src/data/planets.ts      the world registry (names, colours, glyphs, routes)
│   ├── src/art/                 crayon planets, the chalk toolkit, world glyphs
│   ├── src/components/          scene, chalk outlines, annotations, interior shell, horizon
│   ├── src/motion/              GSAP: hover, entry transition, page enter/exit
│   ├── src/pages/               Home, WorldPage (by slug), MnemoraPage, SignalPage
│   └── .env.example             VITE_ARCHIVE_URL and friends
│
└── dhruv-rag/              the archive (Streamlit + a modular RAG pipeline)
    ├── app.py                   the conversation
    ├── rag/                     loader, chunker, embeddings, vector store, retriever, prompts, llm, pipeline
    ├── knowledge/               placeholder documents to replace with real information
    ├── ui/ · styles/            Mnemora's interior: horizon art, components, theme
    ├── tests/                   retrieval and refusal tests (no keys needed)
    ├── .env.example · .gitignore · requirements.txt
    └── README.md                setup, ingestion, deployment, troubleshooting
```

## Concept

- **Hearth**, the Sun, is Dhruv: identity and origin. It carries the greeting and is the way home from every world.
- Eight worlds on nested chalk orbits: **Ferrin** (skills), **Emberline** (experience), **Verdance** (projects), **Theoria** (research), **Magnara** (case studies), **Cadence** (process), **Whimsel** (playground), **Mnemora** (the archive).
- **Signal** is contact: not a world, a message sent out of the system.
- Every celestial body wears a generated chalk perimeter. Hovering strengthens it and reveals a handwritten annotation. Clicking is a descent: the universe falls back, the planet grows, its field colour floods the screen, and the interior opens with the same planet risen as a horizon.
- Interiors are not web pages. They inherit their world's field, texture motif, chalk and horizon. Placeholder sections render as "Not yet catalogued" panels until Round 2.
- Mnemora's threshold hands the visitor into the Streamlit archive, which is dressed as the same room: same field, chalk, fonts and horizon. The question typed on the threshold travels across as `?q=`.

World names are provisional and documented, with reasoning, in `plot.md`. Real planet names exist only as internal art-slot ids.

## Architecture

**Web.** One master SVG scene (`SolarSystemScene`) composed from responsive layouts (`sceneLayouts.ts`); orbits are solved to pass through each planet's authored position. Art lives in a registry, geometry in layouts, each motion concern in its own module. The world identity layer (`planets.ts`) sits on top of the art slots. Chalk perimeters (`art/chalk.ts`, `ChalkOutline`) and annotations (`PlanetLabels`) are generated and seeded. Routes are `/:slug` for worlds, `/signal`, and `/art-test` for QA. Deployment-specific values come from `VITE_*` env vars.

**Archive.** `Archive(settings)` loads markdown documents with frontmatter metadata, skips placeholders, chunks by heading, embeds (OpenAI or a keyless local fallback), stores vectors in a small persisted numpy index, retrieves top-k with a grounding threshold, and only then asks a chat model (OpenAI-compatible, Anthropic, or none). Ungrounded questions are refused without any model call. Conversation history is used to resolve follow-ups but never to source facts.

## Run locally

### The solar system

```bash
cd web
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build into web/dist
npm run preview
```

Optional: copy `web/.env.example` to `web/.env.local` and set `VITE_ARCHIVE_URL` to the deployed archive so Mnemora's threshold can open it.

### The archive

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
copy .env.example .env       # macOS/Linux: cp .env.example .env
streamlit run app.py         # http://localhost:8501
```

Without keys the archive runs in no-model mode (retrieves and quotes; refuses what it cannot ground). Add `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` to `.env` for generated answers. See `dhruv-rag/README.md` for every variable.

## Environment variables

| Where | Variable | Purpose |
|---|---|---|
| web | `VITE_ARCHIVE_URL` | Public URL of the archive (e.g. `https://ask.dhruvbendre.com` or a `*.streamlit.app` URL). Empty = threshold says the archive is not connected. |
| web | `VITE_ARCHIVE_AUTO_ENTER` | `false` keeps visitors on the threshold with a link only. |
| web | `VITE_DEBUG_SOLAR` | `true` draws the coordinate grid and hit areas. |
| archive | `LLM_PROVIDER`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `MODEL_NAME` | Which model answers. |
| archive | `EMBEDDING_PROVIDER`, `EMBEDDING_MODEL` | How documents are embedded. |
| archive | `RETRIEVAL_TOP_K`, `RETRIEVAL_MIN_SCORE` | Retrieval depth and the refusal threshold. |
| archive | `PORTFOLIO_URL` | Where "Back to the system" leads from the archive. |

Secrets live in `.env` files that are git-ignored, or in Streamlit Cloud's Secrets. Nothing is hard-coded.

## Replacing the placeholders (Round 2)

1. **Knowledge.** Fill in `dhruv-rag/knowledge/*.md` with verified information, one `##` per project / role / paper, and remove `status: placeholder` from each file's frontmatter. Run `python ingest.py --check` to see what will be indexed. Details in `dhruv-rag/knowledge/README.md`.
2. **Interior worlds.** Replace the placeholder sections in `web/src/data/portfolio.ts` with real content. Sections with `placeholder: true` render as uncatalogued panels; delete the flag when the content is real.
3. **Category prompts.** Replace the five abstract prompts in `dhruv-rag/app.py` (`CATEGORIES`) and `web/src/data/portfolio.ts` (`archivePromptCategories`) with real questions worth asking.
4. **World names.** Rename in `web/src/data/planets.ts` if the real story suggests better names; update `plot.md`.
5. **The Sun.** The greeting text lives in `web/src/components/solar-system/SunNode.tsx`.

## Deployment

- **Web**: `npm run build` produces a static site in `web/dist`. Host it anywhere static (the intended domain is the main portfolio domain, e.g. `dhruvbendre.com`). Set `VITE_ARCHIVE_URL` at build time.
- **Archive**: Streamlit Community Cloud with `dhruv-rag/app.py` as the entry file and secrets pasted into the app's Secrets. Step-by-step in `dhruv-rag/README.md` → *Deploy to Streamlit Community Cloud*. A custom domain such as `ask.dhruvbendre.com` can point at it; the web app only needs the URL.

## Testing

```bash
cd web && npm run typecheck && npm run build
cd dhruv-rag && pip install -r requirements-dev.txt && python -m pytest
```

Visual QA: `/art-test` shows every asset at several sizes; the home scene, interiors and archive were checked at 1440×900, 820×1180 and 390×844.

## Troubleshooting

- **A world's annotation crosses a neighbour on some viewport**: adjust `label: { side, vertical }` for that layout in `web/src/data/sceneLayouts.ts`.
- **The threshold says the archive is not connected**: set `VITE_ARCHIVE_URL` and rebuild.
- **The archive refuses everything**: the knowledge folder is still placeholders, or `RETRIEVAL_MIN_SCORE` is too high for the embedding provider in use.
- **Streamlit shows its default look for a moment**: expected; the theme CSS hides the chrome as soon as it loads.
- **Running Vite from Git Bash on Windows fails on `npx`**: use `node node_modules/vite/bin/vite.js` directly.
# crazyport
