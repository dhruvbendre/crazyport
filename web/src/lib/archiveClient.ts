import { site } from "../config/site";

/**
 * The Mnemora page's line to the archive API (dhruv-rag/api.py).
 *
 * In development Vite proxies /api/archive to the API on port 8000; in a
 * deployment VITE_ARCHIVE_API_URL points at wherever it runs.
 */
export type ChatTurn = { role: "user" | "assistant"; content: string };

export type ArchiveSource = { label: string; score: number; breadcrumb: string };

export type ArchiveMeta = { grounded: boolean; mode: "generated" | "extractive" | "refusal" | "error"; sources: ArchiveSource[] };

export type ArchiveHealth = {
  name: string;
  owner: string;
  documents: number;
  chunks: number;
  llm: string;
  generates: boolean;
  empty: boolean;
};

type AskHandlers = {
  onMeta?: (meta: ArchiveMeta) => void;
  onDelta?: (text: string) => void;
};

export class ArchiveUnavailable extends Error {}

const base = () => site.archiveApiUrl.replace(/\/$/, "");

export async function archiveHealth(signal?: AbortSignal): Promise<ArchiveHealth> {
  const response = await fetch(`${base()}/health`, { signal });
  if (!response.ok) throw new ArchiveUnavailable(`health ${response.status}`);
  return (await response.json()) as ArchiveHealth;
}

/**
 * Ask a question. Streams the answer through `onDelta` and resolves with the
 * full text once the archive is done.
 */
export async function askArchive(question: string, history: ChatTurn[], handlers: AskHandlers = {}, signal?: AbortSignal): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${base()}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
      signal
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new ArchiveUnavailable("The archive is not reachable right now.");
  }
  if (!response.ok || !response.body) throw new ArchiveUnavailable(`ask ${response.status}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  let done = false;

  const handle = (line: string) => {
    if (!line.startsWith("data:")) return;
    const payload = JSON.parse(line.slice(5).trim()) as Record<string, unknown>;
    switch (payload.type) {
      case "meta":
        handlers.onMeta?.({
          grounded: Boolean(payload.grounded),
          mode: payload.mode as ArchiveMeta["mode"],
          sources: (payload.sources as ArchiveSource[]) ?? []
        });
        break;
      case "delta":
        full += String(payload.text ?? "");
        handlers.onDelta?.(String(payload.text ?? ""));
        break;
      case "error":
        handlers.onMeta?.({ grounded: true, mode: "error", sources: [] });
        break;
      case "done":
        full = String(payload.text ?? full);
        done = true;
        break;
    }
  };

  while (!done) {
    const { value, done: streamDone } = await reader.read();
    if (streamDone) break;
    buffer += decoder.decode(value, { stream: true });
    let index: number;
    while ((index = buffer.indexOf("\n\n")) >= 0) {
      const chunk = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      chunk.split("\n").forEach(handle);
    }
  }
  return full;
}
