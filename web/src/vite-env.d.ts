/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public URL of the Mnemora archive (the Streamlit app). Optional. */
  readonly VITE_ARCHIVE_URL?: string;
  /** Base URL of the archive API (dhruv-rag/api.py). Empty = /api/archive (the dev proxy). */
  readonly VITE_ARCHIVE_API_URL?: string;
  /** "false" to keep visitors on the threshold instead of entering the archive. */
  readonly VITE_ARCHIVE_AUTO_ENTER?: string;
  /** "true" renders the coordinate grid and hit areas on the home scene. */
  readonly VITE_DEBUG_SOLAR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
