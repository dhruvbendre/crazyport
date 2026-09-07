/**
 * Site configuration. Every deployment-specific value is read from Vite env
 * variables (see .env.example); nothing here is hard-coded to a domain.
 */
const env = import.meta.env;

function read(key: keyof ImportMetaEnv, fallback = ""): string {
  const value = env[key];
  return typeof value === "string" ? value.trim() : fallback;
}

export const site = {
  /** Owner name used in titles. */
  owner: "Dhruv Bendre",
  /** Title suffix for every page. */
  titleSuffix: "Dhruv Bendre",
  /**
   * Where the archive (the Streamlit app behind Mnemora) lives. Empty means
   * the archive is not connected in this build and the threshold page says so.
   * Examples: https://ask.dhruvbendre.com or a *.streamlit.app URL.
   */
  archiveUrl: read("VITE_ARCHIVE_URL"),
  /**
   * Where the archive API lives (dhruv-rag/api.py). The Mnemora page chats
   * with it directly. Empty means the Vite dev proxy at /api/archive.
   */
  archiveApiUrl: read("VITE_ARCHIVE_API_URL", "/api/archive"),
  /**
   * When true and an archive URL exists, submitting a question on the
   * threshold carries the visitor straight into the archive. When false the
   * threshold only shows the link (useful while the archive is being built).
   */
  archiveAutoEnter: read("VITE_ARCHIVE_AUTO_ENTER", "true") !== "false"
} as const;

/** Build the archive URL for a question, or null when not connected. */
export function archiveUrlFor(question?: string): string | null {
  if (!site.archiveUrl) return null;
  const url = new URL(site.archiveUrl);
  if (question && question.trim()) url.searchParams.set("q", question.trim());
  return url.toString();
}
