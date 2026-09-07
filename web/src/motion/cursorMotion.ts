import { gsap } from "./gsapSetup";
import { clamp } from "../utils/clamp";
import type { StageGeometry } from "./stageGeometry";

type Options = {
  stage: HTMLElement;
  svg: SVGSVGElement;
  geometry: StageGeometry;
};

export type CursorMotion = { kill: () => void };

/**
 * Desktop-only pointer response. A whisper, not a magnet: stars and the belt
 * shift a few units, the Sun barely at all, and each planet leans a couple of
 * units toward the cursor. Everything runs through quickTo with no React state.
 */
export function createCursorMotion({ stage, svg, geometry }: Options): CursorMotion {
  const stars = svg.querySelector<SVGGElement>('[data-layer="stars"]');
  const asteroids = svg.querySelector<SVGGElement>('[data-layer="asteroids"]');
  const sun = svg.querySelector<SVGGElement>('[data-parallax="sun"]');
  const cursorWrappers = Array.from(svg.querySelectorAll<SVGGElement>("[data-cursor-wrapper]"));

  const quick = (el: Element | null, max: number) => {
    if (!el) return null;
    return {
      x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
      max
    };
  };

  const layers = [quick(stars, 4), quick(asteroids, 6), quick(sun, 1.5)].filter(Boolean) as {
    x: (v: number) => void;
    y: (v: number) => void;
    max: number;
  }[];

  // Planet centres in scene space are the orbit wrappers' translations. The
  // bodies hold their composed positions (STATIC_ORBITS), so read them once
  // here instead of walking the DOM and querying GSAP on every frame.
  const planetLayers = cursorWrappers.map((el) => {
    const wrapper = el.closest("[data-orbit-wrapper]") as SVGGraphicsElement | null;
    return {
      wx: wrapper ? Number(gsap.getProperty(wrapper, "x")) || 0 : 0,
      wy: wrapper ? Number(gsap.getProperty(wrapper, "y")) || 0 : 0,
      x: gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" })
    };
  });

  let raf = 0;
  let px = 0;
  let py = 0;

  const update = () => {
    raf = 0;
    // Cached geometry: no layout flush on the pointer path.
    const rect = geometry.rect();
    const nx = clamp(((px - rect.left) / rect.width) * 2 - 1, -1, 1);
    const ny = clamp(((py - rect.top) / rect.height) * 2 - 1, -1, 1);

    for (const layer of layers) {
      layer.x(nx * layer.max);
      layer.y(ny * layer.max);
    }

    // Planets lean toward the cursor by up to 3 units.
    const point = geometry.toScene(px, py);
    for (const p of planetLayers) {
      const dx = point.x - p.wx;
      const dy = point.y - p.wy;
      const dist = Math.hypot(dx, dy) || 1;
      const influence = clamp(1 - dist / 260, 0, 1);
      p.x((dx / dist) * 3 * influence);
      p.y((dy / dist) * 3 * influence);
    }
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    px = event.clientX;
    py = event.clientY;
    if (!raf) raf = requestAnimationFrame(update);
  };

  const onLeave = () => {
    for (const layer of layers) {
      layer.x(0);
      layer.y(0);
    }
    for (const p of planetLayers) {
      p.x(0);
      p.y(0);
    }
  };

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
