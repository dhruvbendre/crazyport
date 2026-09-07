import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { FestivalContent } from "../../data/festival/types";
import { archiveHealth, ArchiveUnavailable, askArchive, type ArchiveHealth, type ArchiveMeta, type ChatTurn } from "../../lib/archiveClient";
import { ChalkFrame } from "../solar-system/ChalkFrame";
import { setChatMood } from "../../motion/companionState";

/** Moods the chat asks its companion for (animation keys, see data/companions.ts). */
type RoroMood = "idle" | "listening" | "thinking" | "happy" | "confused" | "sad" | "surprised" | "sleeping";

type ChatBlock = NonNullable<FestivalContent["chat"]>;

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  meta?: ArchiveMeta;
  /** Still streaming in. */
  pending?: boolean;
  /** The archive could not be reached. */
  failed?: boolean;
};

type Props = { chat: ChatBlock; seed: number };

/**
 * The conversation with Roro, the keeper of Mnemora's archive, inline on
 * its page.
 *
 * Roro, the page's scroll companion (ScrollCompanion), docks into the seat
 * beside the transcript while the chat is on screen and reacts to the
 * conversation through companionState: listening while the visitor types,
 * thinking while the archive works, pleased with a grounded answer, puzzled
 * by a refusal. Every answer streams from the archive API
 * (lib/archiveClient) with the previous turns sent along so follow-ups work.
 * When the API is unreachable the panel says so instead of pretending.
 */
/** How long a reaction (happy, confused, sad) holds before Roro settles. */
const REACTION_MS = 3600;
export function ArchiveChat({ chat, seed }: Props) {
  const inputId = useId();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState<ArchiveHealth | null | "offline">(null);
  const [focused, setFocused] = useState(false);
  const [reaction, setReaction] = useState<RoroMood | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A reaction holds for a moment, then Roro goes back to whatever the
  // conversation is doing.
  const react = useCallback((next: RoroMood) => {
    if (reactionTimer.current) clearTimeout(reactionTimer.current);
    setReaction(next);
    reactionTimer.current = setTimeout(() => {
      reactionTimer.current = null;
      setReaction(null);
    }, REACTION_MS);
  }, []);
  useEffect(
    () => () => {
      if (reactionTimer.current) clearTimeout(reactionTimer.current);
    },
    []
  );

  const mood: RoroMood = busy ? "thinking" : (reaction ?? (health === "offline" ? "sleeping" : focused || draft.trim() ? "listening" : "idle"));
  useEffect(() => {
    setChatMood(mood);
  }, [mood]);
  useEffect(() => () => setChatMood(null), []);

  useEffect(() => {
    const controller = new AbortController();
    archiveHealth(controller.signal)
      .then(setHealth)
      .catch((error: Error) => {
        if (error.name !== "AbortError") setHealth("offline");
      });
    return () => controller.abort();
  }, []);

  // Keep the newest turn in view as it streams. While tokens arrive the
  // scroll is instant (a smooth scroll restarted on every frame never lands);
  // the finished turn gets one smooth settle. Reads of scrollHeight happen
  // once per committed render, never per token.
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const last = messages[messages.length - 1];
    log.scrollTo({ top: log.scrollHeight, behavior: last?.pending ? "auto" : "smooth" });
  }, [messages]);

  const send = useCallback(
    async (raw: string) => {
      const question = raw.trim();
      if (!question || busy) return;
      const history: ChatTurn[] = messages.filter((m) => !m.failed && !m.pending).map((m) => ({ role: m.role, content: m.content }));
      const userId = nextId.current++;
      const answerId = nextId.current++;
      setMessages((prev) => [...prev, { id: userId, role: "user", content: question }, { id: answerId, role: "assistant", content: "", pending: true }]);
      setDraft("");
      setBusy(true);

      const patch = (update: Partial<Message>) => setMessages((prev) => prev.map((m) => (m.id === answerId ? { ...m, ...update } : m)));

      try {
        const outcome: { meta: ArchiveMeta | null } = { meta: null };
        // Tokens are gathered and committed once per animation frame instead
        // of one React render per token.
        let buffered = "";
        let flush = 0;
        const commit = () => {
          flush = 0;
          const chunk = buffered;
          buffered = "";
          if (chunk) setMessages((prev) => prev.map((m) => (m.id === answerId ? { ...m, content: m.content + chunk } : m)));
        };
        const text = await askArchive(question, history, {
          onMeta: (meta) => {
            outcome.meta = meta;
            patch({ meta });
          },
          onDelta: (delta) => {
            buffered += delta;
            if (!flush) flush = requestAnimationFrame(commit);
          }
        });
        cancelAnimationFrame(flush);
        flush = 0;
        buffered = "";
        patch({ content: text, pending: false });
        if (health === "offline") setHealth(null);
        const result = outcome.meta;
        react(result === null || result.mode === "error" ? "surprised" : result.grounded ? "happy" : "confused");
      } catch (error) {
        const offline = error instanceof ArchiveUnavailable;
        patch({ content: offline ? chat.offline : "Something went wrong while asking the archive. Try again.", pending: false, failed: true });
        if (offline) setHealth("offline");
        react("sad");
      } finally {
        setBusy(false);
        inputRef.current?.focus();
      }
    },
    [busy, chat.offline, health, messages, react]
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void send(draft);
  };

  const empty = messages.length === 0;

  return (
    <section className="fest-chat" id="ask" aria-labelledby="fest-chat-title">
      <div className="fest-chat__inner">
        <h2 id="fest-chat-title" className="fest-sticker" data-enter>
          <span className="fest-sticker__wide">{chat.title[0]}</span> <span>{chat.title[1]}</span>
        </h2>

        <div className="fest-chat__panel" data-enter data-mood={mood}>
          <ChalkFrame seed={seed} weight={2.2} inset={7} dust={14} />

          <aside className="fest-chat__roro">
            <div className="fest-chat__seat" data-companion-seat />
            <p className="fest-chat__roro-name">{chat.bot.name}</p>
            <p className="fest-chat__roro-tagline">{chat.bot.tagline}</p>
          </aside>

          <div className="fest-chat__log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions text">
            {empty && (
              <div className="fest-chat__empty">
                <p>{chat.intro}</p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`fest-chat__turn fest-chat__turn--${m.role}`} data-pending={m.pending ? "true" : undefined} data-failed={m.failed ? "true" : undefined}>
                <p className="fest-chat__who">{m.role === "user" ? "You" : chat.bot.name}</p>
                <div className="fest-chat__bubble">
                  {m.pending && !m.content ? (
                    <span className="fest-chat__thinking" aria-label={`${chat.bot.name} is thinking`}>
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    <RichText text={m.content} />
                  )}
                </div>
                {m.role === "assistant" && m.meta && m.meta.sources.length > 0 && !m.pending && (
                  <p className="fest-chat__sources">
                    From the archive · {m.meta.sources.map((s) => s.label).join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="fest-chat__starters" role="group" aria-label="Questions to start with">
            {chat.starters.map((s) => (
              <button key={s.question} type="button" className="fest-chip" onClick={() => void send(s.question)} disabled={busy}>
                {s.label}
              </button>
            ))}
          </div>

          <form className="fest-chat__form" onSubmit={onSubmit}>
            <label className="visually-hidden" htmlFor={inputId}>
              Your question for {chat.bot.name}
            </label>
            <input
              id={inputId}
              ref={inputRef}
              className="fest-chat__input"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={chat.placeholder}
              autoComplete="off"
              spellCheck={false}
              maxLength={600}
              disabled={busy}
            />
            <button className="fest-chat__send" type="submit" disabled={busy || !draft.trim()}>
              Ask
            </button>
          </form>

          <p className="fest-chat__status">
            {health === "offline"
              ? chat.offline
              : health
                ? `The archive holds ${health.documents} document${health.documents === 1 ? "" : "s"} · ${health.generates ? "answers in its own words" : "returns its passages verbatim (no model connected)"}`
                : "Opening the archive…"}
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * The archive answers in light markdown: paragraphs, **bold** and simple
 * "- " lists. Rendered as elements, never as HTML.
 */
function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).filter((b) => b.trim());
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-*] /.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-*] /, ""))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <span key={j}>
                {inline(l)}
                {j < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

function inline(line: string): ReactNode[] {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => (part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>));
}
