import { gsap } from "./gsapSetup";
import { getTransformProxy } from "./transformProxy";
import { clearAttention, setAttention } from "./ufoAttention";
import { planetById, type PlanetId } from "../data/planets";
import { planetInteractions } from "../data/planetInteractions";
import { createRng } from "../utils/seededRandom";

type Options = {
  svg: SVGSVGElement;
  reducedMotion: boolean;
};

export type InteractionSource = "pointer" | "focus";

export type PlanetInteractionController = {
  /** The pointer is on the body (or it has keyboard focus). */
  setActive: (id: PlanetId, active: boolean, source: InteractionSource) => void;
  /** The pointer is near a body without touching it; null clears. */
  setNear: (id: PlanetId | null) => void;
  /** A tap on a touch screen: a short, self-clearing reaction. */
  tap: (id: PlanetId) => void;
  /** The body was clicked: a quick outward flourish. Never delays navigation. */
  burst: (id: PlanetId) => void;
  kill: () => void;
};

type Doodle = {
  el: SVGGElement;
  inner: SVGGElement;
  dx: number;
  dy: number;
  rotFrom: number;
  rotTo: number;
  delay: number;
  ambient: boolean;
  near: boolean;
};

type Rig = {
  id: PlanetId;
  wrapper: SVGGElement;
  doodles: Doodle[];
  reaction: ReturnType<typeof getTransformProxy> | null;
  entrance: gsap.core.Timeline | null;
  ambient: gsap.core.Tween[];
  pulse: gsap.core.Tween | null;
};

/**
 * Planet zone reactions (the layer above hoverMotion's scale / chalk work).
 *
 *   near    the pointer is within reach: the body takes a small breath and
 *           one ambient mark shows faintly; the UFO starts paying attention
 *   active  the pointer is on the body: the marks escape from behind it in
 *           sequence, the body pulses (Sonara to a beat, the others once) and
 *           the UFO leans in
 *
 * Every reaction is built from data/planetInteractions.ts and the doodle
 * groups PlanetHoverDoodles renders. Reduced motion collapses everything to
 * short fades with no loops.
 */
export function createPlanetInteraction({ svg, reducedMotion }: Options): PlanetInteractionController {
  const rigs = new Map<PlanetId, Rig>();
  let active: PlanetId | null = null;
  let near: PlanetId | null = null;
  let tapTimer: ReturnType<typeof setTimeout> | null = null;

  const rigFor = (id: PlanetId): Rig | null => {
    const cached = rigs.get(id);
    if (cached) return cached;
    const wrapper = svg.querySelector<SVGGElement>(`[data-orbit-wrapper="${id}"]`);
    if (!wrapper) return null;
    const doodles = Array.from(wrapper.querySelectorAll<SVGGElement>(`[data-hover-doodles="${id}"] [data-doodle]`)).map((el) => {
      const inner = el.querySelector<SVGGElement>("[data-doodle-inner]")!;
      return {
        el,
        inner,
        dx: Number(el.dataset.dx) || 0,
        dy: Number(el.dataset.dy) || 0,
        rotFrom: Number(el.dataset.rotFrom) || 0,
        rotTo: Number(el.dataset.rotTo) || 0,
        delay: Number(el.dataset.delay) || 0,
        ambient: el.dataset.ambient === "true",
        near: el.dataset.near === "true"
      };
    });
    doodles.forEach((d) => gsap.set(d.inner, { x: 0, y: 0, rotation: d.rotFrom, scale: 0.7, opacity: 0, transformOrigin: "50% 50%" }));
    const reactionEl = wrapper.querySelector<SVGGElement>("[data-reaction-wrapper]");
    const rig: Rig = {
      id,
      wrapper,
      doodles,
      reaction: reactionEl ? getTransformProxy(reactionEl) : null,
      entrance: null,
      ambient: [],
      pulse: null
    };
    rigs.set(id, rig);
    return rig;
  };

  /* ---- planet geometry on screen (for the UFO's thought placement) -------- */
  const screenGeometry = (rig: Rig) => {
    const ctm = rig.wrapper.getScreenCTM();
    if (!ctm) return { center: null, radius: 0 };
    const p = new DOMPoint(0, 0).matrixTransform(ctm);
    const hit = rig.wrapper.querySelector<SVGCircleElement>(".planet-hit");
    const r = Number(hit?.getAttribute("r")) || 0;
    return { center: { x: p.x, y: p.y }, radius: r * Math.hypot(ctm.a, ctm.b) };
  };

  /* ---- doodles --------------------------------------------------------------- */
  const stopLoops = (rig: Rig) => {
    rig.entrance?.kill();
    rig.entrance = null;
    rig.ambient.forEach((t) => t.kill());
    rig.ambient = [];
  };

  const startAmbient = (rig: Rig, d: Doodle, rng: ReturnType<typeof createRng>) => {
    if (!d.ambient || reducedMotion) return;
    const isSparkle = d.el.dataset.kind === "sparkle";
    const sway = rng.range(2.5, 4.5) * (rng.chance(0.5) ? 1 : -1);
    const lift = rng.range(2.5, 5);
    rig.ambient.push(
      gsap.to(d.inner, {
        x: d.dx + sway,
        y: d.dy - lift,
        rotation: d.rotTo + rng.range(3, 7) * Math.sign(sway || 1),
        duration: rng.range(1.5, 2.4),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      })
    );
    if (isSparkle) {
      rig.ambient.push(gsap.to(d.inner, { opacity: 0.35, duration: rng.range(0.6, 1), ease: "sine.inOut", yoyo: true, repeat: -1 }));
    }
  };

  const enterDoodles = (rig: Rig, speed = 1) => {
    stopLoops(rig);
    const rng = createRng(planetById[rig.id].orbitDuration * 17 + 3);
    const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
    rig.doodles.forEach((d) => {
      if (reducedMotion) {
        tl.to(d.inner, { x: d.dx, y: d.dy, rotation: d.rotTo, scale: 1, opacity: 0.85, duration: 0.2 }, 0.05);
        return;
      }
      tl.fromTo(
        d.inner,
        { x: 0, y: 0, rotation: d.rotFrom, scale: 0.7, opacity: 0 },
        {
          x: d.dx,
          y: d.dy,
          rotation: d.rotTo,
          scale: 1,
          opacity: 0.92,
          duration: rng.range(0.65, 0.9) / speed,
          ease: "power2.out",
          onComplete: () => startAmbient(rig, d, rng)
        },
        d.delay / 1000 / speed
      );
    });
    rig.entrance = tl;
  };

  const exitDoodles = (rig: Rig) => {
    stopLoops(rig);
    rig.doodles.forEach((d) => {
      gsap.to(d.inner, {
        x: d.dx * 1.12,
        y: d.dy * 1.12 - (reducedMotion ? 0 : 5),
        opacity: 0,
        duration: reducedMotion ? 0.15 : 0.45,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => gsap.set(d.inner, { x: 0, y: 0, rotation: d.rotFrom, scale: 0.7 })
      });
    });
  };

  const showNearDoodles = (rig: Rig, on: boolean) => {
    if (reducedMotion) return;
    rig.doodles
      .filter((d) => d.near)
      .forEach((d) => {
        gsap.to(d.inner, {
          x: on ? d.dx * 0.55 : 0,
          y: on ? d.dy * 0.55 : 0,
          rotation: on ? (d.rotFrom + d.rotTo) / 2 : d.rotFrom,
          scale: on ? 0.9 : 0.7,
          opacity: on ? 0.4 : 0,
          duration: on ? 0.6 : 0.35,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
  };

  /* ---- the body's own reaction ------------------------------------------------ */
  const pulse = (rig: Rig, mode: "near" | "active" | "off") => {
    const proxy = rig.reaction;
    if (!proxy) return;
    rig.pulse?.kill();
    rig.pulse = null;
    if (reducedMotion || mode === "off") {
      rig.pulse = gsap.to(proxy, { scale: 1, duration: 0.4, ease: "power2.inOut", overwrite: "auto", onUpdate: proxy.apply });
      return;
    }
    if (mode === "near") {
      rig.pulse = gsap.to(proxy, { scale: 1.012, duration: 0.5, ease: "power2.out", overwrite: "auto", onUpdate: proxy.apply });
      return;
    }
    const kind = planetInteractions[rig.id].pulse ?? "breath";
    if (kind === "beat") {
      // An implied rhythm: two uneven beats every 1.4 s, barely there.
      rig.pulse = gsap.to(proxy, {
        keyframes: [
          { scale: 1.02, duration: 0.3, ease: "sine.out" },
          { scale: 1.0, duration: 0.3, ease: "sine.in" },
          { scale: 1.012, duration: 0.35, ease: "sine.out" },
          { scale: 1.0, duration: 0.45, ease: "sine.inOut" }
        ],
        repeat: -1,
        overwrite: "auto",
        onUpdate: proxy.apply
      });
    } else {
      rig.pulse = gsap.to(proxy, {
        keyframes: [
          { scale: 1.022, duration: 0.5, ease: "sine.out" },
          { scale: 1.0, duration: 0.7, ease: "sine.inOut" }
        ],
        overwrite: "auto",
        onUpdate: proxy.apply
      });
    }
  };

  /* ---- what the UFO is looking at ---------------------------------------------- */
  const publishActive = (rig: Rig) => {
    const geometry = screenGeometry(rig);
    setAttention({ planetId: rig.id, zone: "active", center: geometry.center, radius: geometry.radius });
  };

  const publishNear = () => {
    if (active) return;
    if (!near) {
      clearAttention();
      return;
    }
    const rig = rigFor(near);
    if (!rig) return;
    const geometry = screenGeometry(rig);
    setAttention({ planetId: near, zone: "near", center: geometry.center, radius: geometry.radius });
  };

  /* ---- public ---------------------------------------------------------------------- */
  const setActive = (id: PlanetId, on: boolean, source: InteractionSource) => {
    const rig = rigFor(id);
    if (!rig) return;
    if (on) {
      if (active && active !== id) {
        const previous = rigFor(active);
        if (previous) {
          exitDoodles(previous);
          pulse(previous, "off");
        }
      }
      active = id;
      if (tapTimer) clearTimeout(tapTimer);
      enterDoodles(rig);
      pulse(rig, "active");
      if (source === "pointer") publishActive(rig);
      return;
    }
    if (active !== id) return;
    active = null;
    exitDoodles(rig);
    pulse(rig, near === id ? "near" : "off");
    if (near === id) showNearDoodles(rig, true);
    if (source === "pointer") publishNear();
  };

  const setNear = (id: PlanetId | null) => {
    if (id === near) return;
    if (near && near !== active) {
      const previous = rigFor(near);
      if (previous) {
        showNearDoodles(previous, false);
        pulse(previous, "off");
      }
    }
    near = id;
    if (id && id !== active) {
      const rig = rigFor(id);
      if (rig) {
        showNearDoodles(rig, true);
        pulse(rig, "near");
      }
    }
    publishNear();
  };

  const tap = (id: PlanetId) => {
    const rig = rigFor(id);
    if (!rig) return;
    if (tapTimer) clearTimeout(tapTimer);
    enterDoodles(rig, 1.8);
    pulse(rig, "active");
    tapTimer = setTimeout(() => {
      tapTimer = null;
      if (active !== id) {
        exitDoodles(rig);
        pulse(rig, "off");
      }
    }, 900);
  };

  const burst = (id: PlanetId) => {
    const rig = rigFor(id);
    if (!rig || reducedMotion) return;
    stopLoops(rig);
    rig.doodles.forEach((d) => {
      gsap.to(d.inner, {
        x: d.dx * 1.5,
        y: d.dy * 1.5 - 8,
        opacity: 0,
        scale: 1.1,
        duration: 0.25,
        ease: "power2.in",
        overwrite: "auto"
      });
    });
  };

  return {
    setActive,
    setNear,
    tap,
    burst,
    kill() {
      if (tapTimer) clearTimeout(tapTimer);
      rigs.forEach((rig) => {
        stopLoops(rig);
        rig.pulse?.kill();
        gsap.killTweensOf(rig.doodles.map((d) => d.inner));
      });
      rigs.clear();
      clearAttention();
    }
  };
}
