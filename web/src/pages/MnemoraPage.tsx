import { useCallback, useId, useRef, useState, type FormEvent } from "react";
import type { PlanetConfig } from "../data/planets";
import { archivePromptCategories } from "../data/portfolio";
import { archiveUrlFor, site } from "../config/site";
import { WorldPageShell } from "../components/layout/WorldPageShell";
import { themeForPlanet } from "../components/layout/WorldTheme";
import { WorldGlyph } from "../art/WorldGlyph";
import { playExternalExit } from "../motion/routeTransitions";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * The threshold of Mnemora. The archive itself is a separate application
 * (dhruv-rag, Streamlit) dressed in the same field, chalk and type, so
 * crossing from here into it should feel like walking further into the same
 * room. A question typed here is carried across as `?q=`.
 *
 * When the archive is not connected (no VITE_ARCHIVE_URL), the threshold
 * says so plainly instead of pretending.
 */
export function MnemoraPage({ planet }: { planet: PlanetConfig }) {
  const theme = themeForPlanet(planet);
  const reducedMotion = useReducedMotion();
  const [question, setQuestion] = useState("");
  const [leaving, setLeaving] = useState(false);
  const inputId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const connected = Boolean(site.archiveUrl);

  const enter = useCallback(
    (q: string) => {
      const url = archiveUrlFor(q);
      if (!url || leaving) return;
      setLeaving(true);
      const page = formRef.current?.closest<HTMLElement>("main") ?? null;
      void playExternalExit(page, theme.field, reducedMotion, () => window.location.assign(url));
    },
    [leaving, reducedMotion, theme.field]
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!connected) return;
    if (site.archiveAutoEnter) enter(question);
  };

  const pick = (q: string) => {
    setQuestion(q);
    if (connected && site.archiveAutoEnter) enter(q);
  };

  const enterUrl = archiveUrlFor(question);

  return (
    <WorldPageShell theme={theme} hideNext className="world--threshold" title={`Mnemora · Ask the archive about Dhruv · ${site.titleSuffix}`}>
      <form ref={formRef} className="threshold" onSubmit={onSubmit} data-enter aria-labelledby={`${inputId}-prompt`}>
        <p className="threshold__prompt" id={`${inputId}-prompt`}>
          Ask the archive about Dhruv.
        </p>
        <div className="threshold__field">
          <label className="visually-hidden" htmlFor={inputId}>
            Your question for the archive
          </label>
          <input
            id={inputId}
            className="threshold__input"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything about Dhruv."
            autoComplete="off"
            spellCheck={false}
            disabled={leaving}
          />
          <button className="threshold__ask" type="submit" disabled={!connected || leaving}>
            <span>Ask</span>
            <WorldGlyph glyph="memory" size={18} />
          </button>
        </div>

        <ul className="threshold__prompts" aria-label="Start from a category">
          {archivePromptCategories.map((c) => (
            <li key={c.label}>
              <button type="button" className="threshold__chip" onClick={() => pick(c.question)} disabled={leaving}>
                {c.label}
              </button>
            </li>
          ))}
        </ul>

        {connected ? (
          <p className="threshold__note">
            <a className="threshold__enter" href={enterUrl ?? site.archiveUrl} onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              enter(question);
            }}>
              Enter the archive
            </a>
            <span className="threshold__aside"> · it answers only from what it holds.</span>
          </p>
        ) : (
          <p className="threshold__note threshold__note--offline">
            The archive is not connected in this build. Set <code>VITE_ARCHIVE_URL</code> to the deployed archive to open it from here.
          </p>
        )}
      </form>
    </WorldPageShell>
  );
}
