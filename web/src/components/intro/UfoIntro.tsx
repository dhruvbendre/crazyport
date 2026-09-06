import { Fragment, useEffect, useRef } from "react";
import { useGSAP } from "../../motion/gsapSetup";
import { createIntroFlight, type IntroFlight } from "../../motion/introFlight";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { hasVisitedUniverse } from "../../motion/orbitState";

const SEEN_KEY = "solar:intro-seen";

/** True when the opening flight should play: first visit in this tab. */
export function shouldPlayIntro(): boolean {
  if (typeof window === "undefined") return false;
  if (hasVisitedUniverse()) return false;
  try {
    return window.sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}

function markIntroSeen(): void {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* private mode: the intro simply plays again next time */
  }
}

type Segment = { text: string; accent?: boolean };
type Line = { className: string; segments: Segment[] };

const LINES: Line[] = [
  { className: "intro__line--hello", segments: [{ text: "Hii, I am " }, { text: "Dhruv Bendre", accent: true }] },
  { className: "intro__line--roles", segments: [{ text: "AI Engineer · Web Developer · avg artist" }] },
  { className: "intro__line--invite", segments: [{ text: "This is my portfolio, enjoy exploring my space" }] }
];

function lineText(line: Line): string {
  return line.segments.map((s) => s.text).join("");
}

/**
 * One line split into words of single-character spans. Words never break
 * internally; spaces stay ordinary text so lines can wrap on small screens.
 * Every character carries its real value in `data-char` for the reveal.
 */
function LineGlyphs({ line }: { line: Line }) {
  return (
    <>
      {line.segments.map((seg, s) => {
        const words = seg.text.split(" ");
        return (
          <Fragment key={s}>
            {words.map((word, w) => (
              <Fragment key={w}>
                {w > 0 && " "}
                {word.length > 0 && (
                  <span className={seg.accent ? "intro__word intro__word--accent" : "intro__word"}>
                    {Array.from(word).map((ch, c) => (
                      <span key={c} className="intro__char" data-char={ch}>
                        {ch}
                      </span>
                    ))}
                  </span>
                )}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </>
  );
}

type Props = {
  /** The text is fully revealed; mount the page underneath. */
  onReveal: () => void;
  /** The overlay has faded out; unmount it. */
  onDone: () => void;
};

/**
 * Opening splash: a crayon saucer (Magnific artwork) makes one flight from
 * left to right and the greeting decodes itself in its wake, letter by
 * letter, from random foreign glyphs into the real words. Plays once per
 * tab; click, key press or the Skip button ends it.
 */
export function UfoIntro({ onReveal, onDone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ufoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<IntroFlight | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const ufo = ufoRef.current;
      const text = textRef.current;
      if (!root || !ufo || !text) return;
      const flight = createIntroFlight({
        root,
        ufo,
        text,
        reducedMotion,
        onReveal: () => {
          markIntroSeen();
          onReveal();
        },
        onDone
      });
      flightRef.current = flight;
      return () => {
        flight.kill();
        flightRef.current = null;
      };
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Escape") flightRef.current?.skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={rootRef} className="intro" data-intro onClick={() => flightRef.current?.skip()}>
      <div className="intro__stars" aria-hidden="true" />
      <div ref={textRef} className="intro__text">
        {LINES.map((line) => (
          <p key={line.className} className={`intro__line ${line.className}`} aria-label={lineText(line)}>
            <span aria-hidden="true">
              <LineGlyphs line={line} />
            </span>
          </p>
        ))}
      </div>
      <div ref={ufoRef} className="intro__ufo" aria-hidden="true">
        <div className="intro__beam" />
        <img
          className="intro__saucer"
          src="/ufo-intro.png"
          alt=""
          draggable={false}
          onError={(e) => {
            // Fall back to the cursor saucer if the intro artwork is missing.
            const img = e.currentTarget;
            if (!img.src.endsWith("/ufo.svg")) img.src = "/ufo.svg";
          }}
        />
      </div>
      <button
        type="button"
        className="intro__skip"
        onClick={(e) => {
          e.stopPropagation();
          flightRef.current?.skip();
        }}
      >
        Skip intro
      </button>
    </div>
  );
}
