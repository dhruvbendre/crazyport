import { useEffect, useRef, useState } from "react";
import type { AvatarDefinition } from "@bible-strong/avatar-core";
import type { AvatarController } from "@bible-strong/avatar-react";
import { subscribeFrameTier, type FrameTier } from "../../motion/frameGovernor";
import { gsap, useGSAP } from "../../motion/gsapSetup";
import { createCompanionMotion, type CompanionMotionState } from "../../motion/companionMotion";
import { getChatMood, subscribeChatMood } from "../../motion/companionState";
import { companions } from "../../data/companions";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { CompanionAvatar } from "./CompanionAvatar";

type Props = { slug: string };

/** How long the greeting stays up once it has appeared, in ms. */
const GREETING_MS = 5500;
/** Delay before the greeting appears, so the page's own entrance goes first. */
const GREETING_DELAY_MS = 900;
/** How long an "arrived" reaction holds before the companion settles again. */
const ARRIVE_MS = 3000;

/**
 * The world's resident companion (data/companions.ts): greets the visitor
 * when the page opens, then follows them down the page. Motion lives in
 * motion/companionMotion.ts; this component only decides the mood and shows
 * the greeting bubble. Nothing here catches pointer events.
 */
export function ScrollCompanion({ slug }: Props) {
  const companion = companions[slug];
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [definition, setDefinition] = useState<AvatarDefinition | null>(null);
  const [motion, setMotion] = useState<CompanionMotionState>({ pace: "idle", docked: false, arrived: false });
  const [greeting, setGreeting] = useState(true);
  const [arriving, setArriving] = useState(false);
  const [chatMood, setChatMood] = useState<string | null>(() => getChatMood());
  const [size, setSize] = useState(() => (typeof window !== "undefined" && window.innerWidth < 640 ? 58 : 104));
  const controllerRef = useRef<AvatarController | null>(null);
  const [tier, setTier] = useState<FrameTier>("full");

  // Frame governor: the avatar recomputes its whole body every frame, which is
  // the single largest script cost on a world page. When the display is
  // provably dropping frames, the companion holds its pose while the page is
  // scrolling and breathes again the moment it settles. On a capable device
  // this never engages.
  useEffect(() => subscribeFrameTier(setTier), []);
  useEffect(() => {
    const c = controllerRef.current;
    if (!c) return;
    const hold = tier === "reduced" && motion.pace !== "idle" && !motion.docked;
    if (hold) c.pause();
    else if (c.getState().status === "paused") c.play(c.getState().activeAnimation ?? mood);
  });

  // Load this world's body only when its page opens.
  useEffect(() => {
    if (!companion) return;
    let alive = true;
    setDefinition(null);
    companion.load().then((d) => {
      if (alive) setDefinition(d);
    });
    return () => {
      alive = false;
    };
  }, [companion]);

  useEffect(() => subscribeChatMood(setChatMood), []);

  useEffect(() => {
    const onResize = () => setSize(window.innerWidth < 640 ? 58 : 104);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // The greeting: in after the page has entered, out after a while, or as
  // soon as the visitor scrolls on (they have moved past the welcome).
  useEffect(() => {
    setGreeting(true);
    const hide = setTimeout(() => setGreeting(false), GREETING_DELAY_MS + GREETING_MS);
    const start = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - start) > 140) setGreeting(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(hide);
      window.removeEventListener("scroll", onScroll);
    };
  }, [companion]);

  useGSAP(
    () => {
      const bubble = bubbleRef.current;
      if (!bubble) return;
      if (greeting) {
        gsap.fromTo(
          bubble,
          { opacity: 0, scale: 0.9, y: 6 },
          { opacity: 1, scale: 1, y: 0, duration: reducedMotion ? 0.15 : 0.4, ease: "power3.out", delay: GREETING_DELAY_MS / 1000, overwrite: "auto" }
        );
      } else {
        gsap.to(bubble, { opacity: 0, scale: 0.94, y: 4, duration: reducedMotion ? 0.1 : 0.3, ease: "power2.in", overwrite: "auto" });
      }
    },
    { dependencies: [greeting, reducedMotion] }
  );

  // One reaction on reaching the foot of the page.
  useEffect(() => {
    if (!motion.arrived) return;
    setArriving(true);
    const t = setTimeout(() => setArriving(false), ARRIVE_MS);
    return () => clearTimeout(t);
  }, [motion.arrived]);

  // A plain effect, not useGSAP: its context would try to revert the quickTo
  // tweens on cleanup, which GSAP cannot do and warns about.
  useEffect(() => {
    const root = rootRef.current;
    const body = bodyRef.current;
    if (!root || !body || !definition) return;
    const m = createCompanionMotion({ root, body, size, reducedMotion, onState: setMotion });
    return () => m.kill();
  }, [definition, size, reducedMotion]);

  if (!companion) return null;

  const moods = companion.moods;
  const mood = motion.docked
    ? (chatMood ?? moods.idle)
    : greeting
      ? moods.greet
      : arriving
        ? moods.arrive
        : motion.pace === "rush"
          ? moods.rush
          : motion.pace === "scroll"
            ? moods.scroll
            : moods.idle;

  return (
    <div ref={rootRef} className="companion" data-companion={companion.id} data-docked={motion.docked ? "true" : undefined} aria-hidden="true">
      <div ref={bubbleRef} className="companion__bubble" style={{ opacity: 0 }}>
        <p className="companion__name">{companion.name}</p>
        <p className="companion__text">{companion.greeting}</p>
      </div>
      <div ref={bodyRef} className="companion__body" style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}>
        {definition && (
          <CompanionAvatar controller={controllerRef} definition={definition} mood={mood} name={companion.name} size="100%" className="companion__avatar" />
        )}
      </div>
    </div>
  );
}
