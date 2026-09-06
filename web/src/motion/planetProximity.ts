import { gsap } from "./gsapSetup";
import { planets, type PlanetId } from "../data/planets";
import { PROXIMITY_FACTOR } from "../data/planetInteractions";

type Options = {
  stage: HTMLElement;
  svg: SVGSVGElement;
  onNear: (id: PlanetId | null) => void;
};

export type PlanetProximity = { kill: () => void };

/**
 * Zone 1 of the planet interaction: is the pointer *near* a body without
 * being on it? Hover itself comes from the link's own pointer events; this
 * only watches the ring just outside each hit area (PROXIMITY_FACTOR × the
 * hit radius) and reports the nearest body, or null. Mouse pointers only, one
 * rAF per frame, no React state.
 */
export function createPlanetProximity({ stage, svg, onNear }: Options): PlanetProximity {
  const bodies = planets
    .map((p) => {
      const wrapper = svg.querySelector<SVGGElement>(`[data-orbit-wrapper="${p.id}"]`);
      const hit = wrapper?.querySelector<SVGCircleElement>(".planet-hit");
      if (!wrapper || !hit) return null;
      return {
        id: p.id,
        // Bodies hold their composed positions (STATIC_ORBITS), read once.
        x: Number(gsap.getProperty(wrapper, "x")) || 0,
        y: Number(gsap.getProperty(wrapper, "y")) || 0,
        reach: (Number(hit.getAttribute("r")) || 0) * PROXIMITY_FACTOR
      };
    })
    .filter(Boolean) as { id: PlanetId; x: number; y: number; reach: number }[];

  let raf = 0;
  let px = 0;
  let py = 0;
  let current: PlanetId | null = null;

  const report = (id: PlanetId | null) => {
    if (id === current) return;
    current = id;
    onNear(id);
  };

  const update = () => {
    raf = 0;
    if (stage.dataset.locked === "true") {
      report(null);
      return;
    }
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const point = new DOMPoint(px, py).matrixTransform(ctm.inverse());
    let best: PlanetId | null = null;
    let bestScore = Infinity;
    for (const b of bodies) {
      const d = Math.hypot(point.x - b.x, point.y - b.y);
      // Normalised so a small body's ring competes fairly with a large one's.
      const score = d / b.reach;
      if (score < 1 && score < bestScore) {
        bestScore = score;
        best = b.id;
      }
    }
    report(best);
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    px = event.clientX;
    py = event.clientY;
    if (!raf) raf = requestAnimationFrame(update);
  };
  const onLeave = () => report(null);

  stage.addEventListener("pointermove", onMove, { passive: true });
  stage.addEventListener("pointerleave", onLeave);

  return {
    kill() {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    }
  };
}
