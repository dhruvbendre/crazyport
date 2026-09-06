import { gsap } from "./gsapSetup";
import { planets, type PlanetId } from "../data/planets";
import type { SceneLayout } from "../data/sceneLayouts";
import { getTransformProxy } from "./transformProxy";

type IntroOptions = {
  svg: SVGSVGElement;
  stage: HTMLElement;
  layout: SceneLayout;
  mode: "first" | "return";
  reducedMotion: boolean;
  onOrbitsStart: () => void;
  onInteractive: () => void;
  onHintTime: () => void;
};

/**
 * "A drawing waking up." Paper first, then the orbit lines are drawn in with a
 * stagger, the Sun settles, planets appear in spatial order, and the
 * environment follows. Interaction is unlocked around the one second mark.
 */
export function playSceneIntro(o: IntroOptions): gsap.core.Timeline {
  const { svg, stage, mode, reducedMotion } = o;
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  const window_ = stage.querySelector<HTMLElement>("[data-space-window]");
  const orbits = Array.from(svg.querySelectorAll<SVGPathElement>("[data-orbit-path]"));
  const sun = svg.querySelector<SVGGElement>("[data-sun]");
  const sunIntro = svg.querySelector<SVGGElement>("[data-sun-intro]");
  const stars = svg.querySelector<SVGGElement>('[data-layer="stars"]');
  const asteroids = svg.querySelector<SVGGElement>('[data-layer="asteroids"]');
  const environment = svg.querySelector<SVGGElement>('[data-layer="environment"]');

  // Planets in spatial order (left to right) so the reveal reads like a hand
  // moving across the page rather than DOM order.
  const planetWrappers = planets
    .map((p) => ({
      id: p.id as PlanetId,
      el: svg.querySelector<SVGGElement>(`[data-orbit-wrapper="${p.id}"] [data-hover-wrapper]`),
      x: o.layout.planets[p.id].through.x
    }))
    .filter((p): p is { id: PlanetId; el: SVGGElement; x: number } => Boolean(p.el))
    .sort((a, b) => a.x - b.x);

  if (reducedMotion || mode === "return") {
    // Short, calm return: everything already composed, just breathe in.
    tl.fromTo(window_ ?? svg, { opacity: 0.2 }, { opacity: 1, duration: reducedMotion ? 0.2 : 0.45 }, 0);
    if (!reducedMotion) {
      tl.fromTo(svg, { scale: 0.985, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.55 }, 0);
    }
    tl.call(o.onOrbitsStart, undefined, 0.05);
    tl.call(o.onInteractive, undefined, 0.15);
    tl.call(o.onHintTime, undefined, 0.6);
    return tl;
  }

  // 0.00 paper + space window
  if (window_) tl.fromTo(window_, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);
  if (stars) tl.fromTo(stars, { opacity: 0 }, { opacity: 1, duration: 0.9 }, 0.15);

  // 0.15 orbit drawing, staggered and at different speeds
  orbits.forEach((path, i) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    tl.to(
      path,
      {
        strokeDashoffset: 0,
        duration: 0.7 + (i % 3) * 0.18,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(path, { clearProps: "strokeDasharray,strokeDashoffset" });
        }
      },
      0.15 + i * 0.07
    );
  });

  // 0.35 Sun settles in from the left
  if (sun && sunIntro) {
    const sp = getTransformProxy(sunIntro);
    sp.x = -60;
    sp.apply();
    tl.fromTo(sun, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.3);
    tl.to(sp, { x: 0, duration: 0.85, ease: "power3.out", onUpdate: sp.apply }, 0.35);
  }

  // 0.55 planets appear progressively
  planetWrappers.forEach((p, i) => {
    const proxy = getTransformProxy(p.el);
    proxy.scale = 0.88;
    proxy.apply();
    gsap.set(p.el, { opacity: 0 });
    const at = 0.55 + i * 0.09;
    tl.to(p.el, { opacity: 1, duration: 0.4 }, at);
    tl.to(proxy, { scale: 1, duration: 0.55, ease: "power3.out", onUpdate: proxy.apply }, at);
  });

  // 0.90 satellite / meteor / asteroids
  if (asteroids) tl.fromTo(asteroids, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.9);
  if (environment) tl.fromTo(environment, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.95);

  // ~1.0 interaction allowed, 1.4 orbits ramp up, 1.8 hint
  tl.call(o.onInteractive, undefined, 1.0);
  tl.call(o.onOrbitsStart, undefined, 1.3);
  tl.call(o.onHintTime, undefined, 1.8);

  return tl;
}
