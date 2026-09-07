import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "../../motion/gsapSetup";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { hasVisitedUniverse } from "../../motion/orbitState";
import { chalkRing, chalkRule } from "../../art/chalk";
import { measureIntroQuality } from "../../motion/introQuality";

/**
 * The Unicorn Studio scene carries its whole WebGL SDK (~1.2 MB) inside the
 * package, so it is loaded on demand: only a first visit ever fetches or
 * compiles it, and it lands in its own chunk instead of the main bundle.
 */
const BloimBackground = lazy(() =>
  import("@/components/ui/bloim-animation-background").then((m) => ({ default: m.BloimBackground }))
);

export type PortfolioIntroProps = {
  name: string;
  onComplete?: () => void;
  /**
   * Where the camera pushes in and where the solar system opens from, in
   * viewport fractions. The bloim scene is a burst of light with a dark core
   * at the centre of the frame, so the camera flies into that core and the
   * solar system opens out of it.
   */
  focal?: { x: number; y: number };
};

const SEEN_KEY = "portfolio-intro-seen";
/** The previous opening flight's key; kept in step so nothing else regresses. */
const LEGACY_SEEN_KEY = "solar:intro-seen";
/** If the Unicorn scene has not reported in by then, the intro runs over the dark paper anyway. */
const SCENE_WAIT_MS = 2500;
/** The dark core of the bloim burst. */
const SCENE_CORE = { x: 0.5, y: 0.5 };
/** The chalk ring is drawn at this fraction of the shorter viewport side: just around the burst. */
const RING_FRACTION = 0.3;

/** True on the first visit in this tab (never on the way back from a world). */
export function shouldPlayPortfolioIntro(): boolean {
  if (typeof window === "undefined") return false;
  if (hasVisitedUniverse()) return false;
  try {
    return window.sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}

function markSeen(): void {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
    window.sessionStorage.setItem(LEGACY_SEEN_KEY, "1");
  } catch {
    /* private mode: it simply plays again next time */
  }
}

/**
 * The portfolio intro, drawn in the same hand as the solar system.
 *
 * Black paper, chalk and crayon: the Unicorn scene fills the viewport but is
 * pushed through a crayon treatment (posterised colour, wobbled edges, paper
 * grain) so it reads as a burst scribbled on the same board the planets are
 * drawn on. A chalk ring is drawn around the burst, the name is written in
 * chalk in front, holds, then the camera pushes into the burst's dark core
 * and the solar system (already mounted underneath) opens out through the
 * chalk ring.
 *
 * One GSAP timeline drives everything. Reduced motion keeps the same beats as
 * plain fades. Escape, Enter, Space or a tap ends it early.
 */
export function PortfolioIntro({ name, onComplete, focal }: PortfolioIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const unicornRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGGElement>(null);
  const ringStrokesRef = useRef<SVGGElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<SVGPathElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const doneRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const [sceneState, setSceneState] = useState<"loading" | "ready" | "failed">("loading");
  const [viewport, setViewport] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  // "full" keeps the crayon displacement over the live scene; "lite" is the
  // phone treatment (posterised colour only), chosen when the frames prove
  // the device cannot carry the filter. Never changes the choreography.
  const [quality, setQuality] = useState<"full" | "lite">("full");

  // Quality governor: while the ring draws and the name writes (a quiet
  // stretch before the push), watch the frame cadence. Sustained slow frames
  // mean the displacement filter is fighting the WebGL canvas, so drop to the
  // lite treatment before the camera moves. Decides once.
  useEffect(() => {
    if (sceneState !== "ready" || reducedMotion) return;
    return measureIntroQuality((tier) => setQuality(tier));
  }, [sceneState, reducedMotion]);

  useEffect(() => {
    const onResize = () =>
      setViewport((v) => (v.w === window.innerWidth && v.h === window.innerHeight ? v : { w: window.innerWidth, h: window.innerHeight }));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // The chalk ring around the burst and the rule under the name: the same
  // generators the planets use (art/chalk.ts), seeded so they never change.
  const ringRadius = Math.min(viewport.w, viewport.h) * RING_FRACTION;
  const ring = useMemo(() => chalkRing(ringRadius, 4242, { points: 28, dust: 14 }), [ringRadius]);
  const ruleWidth = Math.min(viewport.w * 0.5, 520);
  const rule = useMemo(() => chalkRule(ruleWidth, 77, 2.2), [ruleWidth]);

  // Lock the page underneath while the intro owns the viewport.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    markSeen();
    onComplete?.();
  }, [onComplete]);

  // Start once the scene is drawing, or after a short grace period so a
  // blocked script never leaves the visitor on a blank screen.
  useEffect(() => {
    if (sceneState !== "loading") return;
    const t = setTimeout(() => setSceneState("failed"), SCENE_WAIT_MS);
    return () => clearTimeout(t);
  }, [sceneState]);

  useEffect(() => {
    if (sceneState === "loading") return;
    const root = rootRef.current;
    const unicorn = unicornRef.current;
    const atmosphere = atmosphereRef.current;
    const ringEl = ringRef.current;
    const strokes = ringStrokesRef.current;
    const title = nameRef.current;
    const ruleEl = ruleRef.current;
    if (!root || !unicorn || !atmosphere || !ringEl || !strokes || !title || !ruleEl) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      timelineRef.current = tl;
      if (import.meta.env.DEV) {
        // Dev-only handle, like __solar.engine: lets QA scripts scrub the intro.
        const w = window as unknown as { __solar?: Record<string, unknown> };
        w.__solar = { ...w.__solar, intro: tl };
      }

      const ringPaths = Array.from(strokes.querySelectorAll<SVGPathElement>("path"));
      const ruleLength = ruleEl.getTotalLength();
      gsap.set(ruleEl, { strokeDasharray: ruleLength, strokeDashoffset: ruleLength });

      if (reducedMotion) {
        gsap.set(ringPaths, { opacity: 1 });
        tl.fromTo(title, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.1);
        tl.to(ruleEl, { strokeDashoffset: 0, duration: 0.5 }, 0.3);
        tl.to(root, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, 1.6);
        return;
      }

      const point = focal ?? SCENE_CORE;
      const fx = `${(point.x * 100).toFixed(1)}%`;
      const fy = `${(point.y * 100).toFixed(1)}%`;
      // Explicit starting filter: tweening from "none" would start brightness
      // and saturation at 0 and the scene would go black mid-push.
      gsap.set(unicorn, { transformOrigin: `${fx} ${fy}`, filter: "blur(0px) brightness(1) saturate(1)" });
      gsap.set(ringEl, { scale: 1 });

      // The portal: a hole in the intro that opens from the focal point, with
      // the chalk ring riding on its rim. The mask itself is declared once in
      // CSS (.portfolio-intro[data-portal]) and only its radius custom
      // properties change per frame. (gsap.getProperty reads GSAP's own
      // transform cache, not the DOM, so it is not a layout read.)
      const vmax = Math.max(window.innerWidth, window.innerHeight) / 100;
      const portal = { r: 0 };
      root.style.setProperty("--portal-x", fx);
      root.style.setProperty("--portal-y", fy);
      const applyPortal = () => {
        if (portal.r <= 0) {
          root.removeAttribute("data-portal");
          return;
        }
        root.setAttribute("data-portal", "");
        root.style.setProperty("--portal-edge", `${portal.r.toFixed(2)}vmax`);
        root.style.setProperty("--portal-soft", `${Math.max(0, portal.r - 14).toFixed(2)}vmax`);
        const rim = (portal.r * vmax) / ringRadius;
        if (rim > Number(gsap.getProperty(ringEl, "scale"))) gsap.set(ringEl, { scale: rim });
      };

      // 1 · the chalk ring is drawn around the burst, stroke by stroke.
      ringPaths.forEach((path, i) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
        tl.to(path, { strokeDashoffset: 0, duration: 0.9 - i * 0.15, ease: "power2.out" }, 0.05 + i * 0.12);
      });

      // 2 · the name is written in front of it.
      tl.fromTo(
        title,
        { opacity: 0, scale: 0.88, filter: "blur(12px)", rotation: -3.5 },
        { opacity: 1, scale: 1, filter: "blur(0px)", rotation: -2, duration: 1.0, ease: "expo.out" },
        0.25
      );
      tl.to(ruleEl, { strokeDashoffset: 0, duration: 0.55, ease: "power2.out" }, 0.75);

      // 3 · cinematic hold, then the camera starts to move.
      tl.addLabel("enter", 1.95);

      // 4 · the name passes the camera and dissolves.
      tl.to(title, { scale: 1.06, duration: 0.3, ease: "power1.inOut" }, "enter-=0.15");
      tl.to([title, ruleEl], { scale: 1.32, opacity: 0, filter: "blur(9px)", duration: 0.5, ease: "power3.in" }, "enter+=0.1");

      // 5 · push into the burst: a slow lean, then the acceleration. The ring
      //     grows with the scene so it stays around the core.
      tl.to([unicorn, ringEl], { scale: 1.15, duration: 0.4, ease: "power2.in" }, "enter");
      tl.to(unicorn, { scale: 2.1, filter: "blur(4px) brightness(1.25) saturate(1.15)", duration: 0.75, ease: "power2.in" }, "enter+=0.4");
      tl.to(ringEl, { scale: 2.1, duration: 0.75, ease: "power2.in" }, "enter+=0.4");
      // The edge darkening lifts as the world brightens.
      tl.to(atmosphere, { opacity: 0, duration: 0.5, ease: "power2.in" }, "enter+=0.5");

      // 6 · the threshold: the solar system opens out of the core, through the chalk ring.
      tl.to(portal, { r: 160, duration: 0.6, ease: "power2.inOut", onUpdate: applyPortal }, "enter+=0.7");

      // 7 · cleanup fade during the last fraction of the push.
      tl.to(root, { opacity: 0, duration: 0.24, ease: "power2.out" }, "enter+=1.08");
    }, root);

    return () => {
      ctx.revert();
      timelineRef.current = null;
    };
  }, [sceneState, reducedMotion, finish, focal, ringRadius]);

  // Skip: end the intro quickly rather than jumping.
  const skip = useCallback(() => {
    const root = rootRef.current;
    const tl = timelineRef.current;
    if (doneRef.current) return;
    tl?.kill();
    timelineRef.current = null;
    if (!root) {
      finish();
      return;
    }
    gsap.to(root, { opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto", onComplete: finish });
  }, [finish]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  const cx = viewport.w / 2;
  const cy = viewport.h / 2;

  return (
    <div ref={rootRef} className="portfolio-intro" data-scene={sceneState} data-quality={quality} onClick={skip}>
      {/* The crayon treatment for the scene: posterised colour with wobbled edges. */}
      <svg className="portfolio-intro__filters" aria-hidden="true" focusable="false">
        <defs>
          <filter id="intro-crayon" x="-4%" y="-4%" width="108%" height="108%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="9" result="grain" />
            <feDisplacementMap in="SourceGraphic" in2="grain" scale="9" xChannelSelector="R" yChannelSelector="G" result="wobble" />
            <feComponentTransfer in="wobble">
              <feFuncR type="discrete" tableValues="0 0.18 0.36 0.55 0.75 0.9 1" />
              <feFuncG type="discrete" tableValues="0 0.18 0.36 0.55 0.75 0.9 1" />
              <feFuncB type="discrete" tableValues="0 0.2 0.4 0.6 0.8 1" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* 1 · the scene, drawn in crayon */}
      <div ref={unicornRef} className="portfolio-intro__unicorn">
        <Suspense fallback={null}>
          <BloimBackground
            className="portfolio-intro__scene"
            onLoad={() => setSceneState("ready")}
            onError={() => setSceneState((s) => (s === "loading" ? "failed" : s))}
          />
        </Suspense>
      </div>

      {/* 2 · paper: the tooth of the board, over everything the crayon touches */}
      <div className="portfolio-intro__paper" aria-hidden="true" />
      <div ref={atmosphereRef} className="portfolio-intro__atmosphere" aria-hidden="true" />

      {/* 3 · the chalk ring around the burst; it becomes the rim of the portal */}
      <svg className="portfolio-intro__chalk" width={viewport.w} height={viewport.h} viewBox={`0 0 ${viewport.w} ${viewport.h}`} aria-hidden="true">
        <g ref={ringRef} className="portfolio-intro__ring" transform={`translate(${cx} ${cy})`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <g ref={ringStrokesRef} className="chalk" filter="url(#chalk-soft)">
            {ring.strokes.map((s, i) => (
              <path
                key={i}
                className="chalk__stroke"
                d={s.d}
                strokeWidth={(s.width * 1.6).toFixed(2)}
                opacity={0}
                transform={s.dx || s.dy ? `translate(${s.dx.toFixed(2)} ${s.dy.toFixed(2)})` : undefined}
              />
            ))}
          </g>
          <g className="chalk__dust">
            {ring.dust.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={d.r * 1.6} opacity={d.opacity} />
            ))}
          </g>
        </g>
      </svg>

      {/* 5 · the name, in chalk */}
      <div className="portfolio-intro__title">
        <p ref={nameRef} className="portfolio-intro__name">
          {name}
        </p>
        <svg className="portfolio-intro__rule" width={ruleWidth} height="12" viewBox={`-2 -6 ${ruleWidth + 4} 12`} aria-hidden="true">
          <path ref={ruleRef} d={rule} />
        </svg>
      </div>
    </div>
  );
}
