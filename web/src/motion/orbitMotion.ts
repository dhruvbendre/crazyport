import { gsap } from "./gsapSetup";
import { planets, type PlanetId } from "../data/planets";
import type { ResolvedScene } from "../data/orbitPaths";
import { getTransformProxy } from "./transformProxy";

export type OrbitEngine = {
  tweens: Partial<Record<PlanetId, gsap.core.Tween>>;
  /** True once the orbits have been asked to move (used to decide whether a snapshot is meaningful). */
  started: boolean;
  /** Ramp every orbit from standstill to full speed. */
  start: (delay?: number, duration?: number) => void;
  /** Slow (or restore) one planet's orbit. Never resets the orbit. */
  setSlow: (id: PlanetId, slow: boolean) => void;
  getProgress: () => Partial<Record<PlanetId, number>>;
  kill: () => void;
};

/**
 * When true the planets hold their composed positions: the orbit lines are
 * drawn, but nothing travels along them. Flip to false to restore the loops.
 */
export const STATIC_ORBITS = true;

export const HOVER_SPEED = 0.15;
/** Orbit speed multiplier while a planet is visible. */
export const VISIBLE_SPEED = 0.4;
/** Orbit speed multiplier while a planet is hidden behind the Sun. */
export const HIDDEN_SPEED = 4;
/** Seconds for the speed change to settle (exponential smoothing). */
const SPEED_SMOOTHING = 0.45;

type Options = {
  svg: SVGSVGElement;
  scene: ResolvedScene;
  initialProgress?: Partial<Record<PlanetId, number>> | null;
  reducedMotion: boolean;
};

/**
 * Owns every orbital loop. One infinitely repeating MotionPath tween per
 * planet, each with its own duration and start progress so the system never
 * looks synchronised and the first frame matches the composed poster.
 *
 * Speed is the product of three factors applied every tick:
 *   base  – 0 during the intro, ramped to 1 when the orbits start
 *   hover – 0.15 while the planet is hovered / focused
 *   sun   – VISIBLE_SPEED in the open, HIDDEN_SPEED behind the Sun, smoothed
 */
export function createOrbitEngine({ svg, scene, initialProgress, reducedMotion }: Options): OrbitEngine {
  const tweens: Partial<Record<PlanetId, gsap.core.Tween>> = {};
  const wrappers: Partial<Record<PlanetId, SVGGElement>> = {};
  const speed: Record<PlanetId, { base: number; hover: number; sun: number }> = {} as never;
  const factorTweens: Partial<Record<string, gsap.core.Tween>> = {};
  const microTweens: gsap.core.Tween[] = [];
  const sun = scene.layout.sun;
  // Planets travel only when both motion preferences allow it.
  const moving = !reducedMotion && !STATIC_ORBITS;

  const tweenFactor = (id: PlanetId, key: "base" | "hover", value: number, duration: number, ease: string) => {
    const k = id + key;
    factorTweens[k]?.kill();
    factorTweens[k] = gsap.to(speed[id], { [key]: value, duration, ease, overwrite: false });
  };

  // Per-frame: detect Sun occlusion, smooth the factor, apply the product.
  const tick = (_time: number, deltaTime: number) => {
    const dt = Math.min(deltaTime / 1000, 0.1);
    const k = 1 - Math.exp(-dt / SPEED_SMOOTHING);
    for (const planet of planets) {
      const tween = tweens[planet.id];
      const wrapper = wrappers[planet.id];
      if (!tween || !wrapper) continue;
      const x = Number(gsap.getProperty(wrapper, "x")) || 0;
      const y = Number(gsap.getProperty(wrapper, "y")) || 0;
      const radius = scene.layout.planets[planet.id].radius;
      const hidden = Math.hypot(x - sun.x, y - sun.y) < sun.radius - radius * 0.35;
      const target = hidden ? HIDDEN_SPEED : VISIBLE_SPEED;
      const s = speed[planet.id];
      s.sun += (target - s.sun) * k;
      tween.timeScale(s.base * s.hover * s.sun);
    }
  };

  for (const planet of planets) {
    const wrapper = svg.querySelector<SVGGElement>(`[data-orbit-wrapper="${planet.id}"]`);
    if (!wrapper) continue;

    const orbit = scene.orbits[planet.id];
    // A remembered position only matters when the planets actually travel.
    const progress = (moving && initialProgress?.[planet.id]) || orbit.startProgress;

    if (!moving) {
      // Static orbits: the body simply sits at its composed point (the same
      // point the MotionPath tween would render at startProgress, to within
      // 0.01 unit). Skipping the nine path parses and tweens saves a chunk of
      // mount time on every visit and return.
      gsap.set(wrapper, { x: orbit.start.x, y: orbit.start.y });
      wrappers[planet.id] = wrapper;
      speed[planet.id] = { base: 0, hover: 1, sun: VISIBLE_SPEED };
      continue;
    }

    const tween = gsap.to(wrapper, {
      motionPath: { path: orbit.d, autoRotate: false },
      duration: planet.orbitDuration,
      ease: "none",
      repeat: -1,
      paused: true,
      immediateRender: true
    });
    tween.progress(progress);
    tweens[planet.id] = tween;
    wrappers[planet.id] = wrapper;
    speed[planet.id] = { base: 0, hover: 1, sun: VISIBLE_SPEED };

    if (moving) {
      tween.timeScale(0);
      tween.play();

      // Tiny upright wobble: the face stays readable, the planet feels alive.
      const micro = wrapper.querySelector<SVGGElement>("[data-micro-wrapper]");
      if (micro) {
        const proxy = getTransformProxy(micro);
        proxy.rotation = -1.4;
        proxy.apply();
        microTweens.push(
          gsap.to(proxy, {
            rotation: 1.4,
            duration: 3.2 + (planet.orbitDuration % 5) * 0.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            onUpdate: proxy.apply
          })
        );
      }
    }
  }

  if (moving) gsap.ticker.add(tick);

  const engine: OrbitEngine = {
    tweens,
    started: false,
    start(delay = 0, duration = 1.2) {
      engine.started = true;
      if (!moving) return;
      for (const planet of planets) {
        if (!tweens[planet.id]) continue;
        gsap.delayedCall(delay, () => tweenFactor(planet.id, "base", 1, duration, "power2.inOut"));
      }
    },
    setSlow(id, slow) {
      if (!speed[id]) return;
      tweenFactor(id, "hover", slow ? HOVER_SPEED : 1, slow ? 0.45 : 0.7, slow ? "power2.out" : "power2.inOut");
    },
    getProgress() {
      const out: Partial<Record<PlanetId, number>> = {};
      for (const planet of planets) {
        const t = tweens[planet.id];
        if (t) out[planet.id] = t.progress();
      }
      return out;
    },
    kill() {
      gsap.ticker.remove(tick);
      for (const t of Object.values(tweens)) t?.kill();
      for (const t of Object.values(factorTweens)) t?.kill();
      for (const t of microTweens) t.kill();
    }
  };
  return engine;
}
