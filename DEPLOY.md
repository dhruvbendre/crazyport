# Deploying

The site is the Vite app in `web/`. `dhruv-rag/` is the archive API behind Mnemora's chat; it is optional (the chat says it is offline when the API is not reachable).

## Vercel

Import the repo. The root `vercel.json` already sets the install/build commands, the output folder (`web/dist`) and the SPA rewrite, so no settings need changing. If you prefer, set **Root Directory** to `web` instead and remove `vercel.json`.

## Netlify

Import the repo. The root `netlify.toml` sets base `web`, publish `dist`, Node 22 and the SPA redirect.

## Anything else

Build with Node 22 or newer:

```bash
cd web
npm ci
npm run build   # output in web/dist
```

Serve `web/dist` as a static site with every unknown path rewritten to `index.html` (React Router).

## Environment

Optional build-time variables (see `web/.env.example`):

- `VITE_ARCHIVE_API_URL` — where `dhruv-rag/api.py` is hosted, if you deploy the archive. Also set `ARCHIVE_ALLOWED_ORIGINS` on the API to the site's origin.
- `VITE_ARCHIVE_URL` — the Streamlit archive, if used.

The four songs under `web/public/festival/sonara/audio/` are not in the repo (copyrighted). Add them to the host separately if you want the discs to play.
