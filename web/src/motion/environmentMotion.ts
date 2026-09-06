import { gsap } from "./gsapSetup";
import type { SceneLayout } from "../data/sceneLayouts";
import { createRng } from "../utils/seededRandom";
import { getTransformProxy } from "./transformProxy";

type Options = {
  svg: SVGSVGElement;
  layout: SceneLayout;
  reducedMotion: boolean;
};

export type EnvironmentMotion = {
  kill: () => void;
};

/**
 * Secondary life: sparse star twinkle, the occasional meteor, the satellite
 * looping around Earth, a few drifting asteroids and gentle blinks. All loops
 * are owned here and torn down together.
 */
export function createEnvironmentMotion({ svg, layout, reducedMotion }: Options): EnvironmentMotion {
  const tweens: (gsap.core.Tween | gsap.core.Timeline)[] = [];
  const calls: gsap.core.Tween[] = [];
  const rng = createRng(layout.stars.seed + 99);

  /* ---- star twinkle: only the stars flagged at build time ---------------- */
  if (!reducedMotion) {
    const twinklers = svg.querySelectorAll<SVGElement>("[data-twinkle]");
    twinklers.forEach((star) => {
      tweens.push(
        gsap.to(star, {
          opacity: rng.range(0.35, 0.6),
          scale: rng.range(0.85, 1.15),
          transformOrigin: "50% 50%",
          duration: rng.range(2.8, 6.5),
          delay: rng.range(0, 5),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        })
      );
    });
  } else {
    // Minimal twinkle in reduced motion: a very slow opacity breath on a handful.
    const few = Array.from(svg.querySelectorAll<SVGElement>("[data-twinkle]")).slice(0, 4);
    few.forEach((star) => {
      tweens.push(
        gsap.to(star, { opacity: 0.5, duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1 })
      );
    });
  }

  /* ---- satellite: slow local loop around Earth --------------------------- */
  const satellite = svg.querySelector<SVGGElement>("[data-satellite]");
  if (satellite && !reducedMotion) {
    const { rx, ry, rotation, duration } = layout.satellite;
    const rot = (rotation * Math.PI) / 180;
    const body = satellite.querySelector<SVGGElement>("[data-satellite-body]");
    const proxy = getTransformProxy(satellite);
    const state = { t: 0 };
    tweens.push(
      gsap.to(state, {
        t: 1,
        duration,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          const a = state.t * Math.PI * 2;
          const ex = rx * Math.cos(a);
          const ey = ry * Math.sin(a);
          proxy.x = ex * Math.cos(rot) - ey * Math.sin(rot);
          proxy.y = ex * Math.sin(rot) + ey * Math.cos(rot);
          proxy.apply();
        }
      })
    );
    if (body) {
      const bp = getTransformProxy(body);
      bp.rotation = -7;
      bp.apply();
      tweens.push(
        gsap.to(bp, { rotation: 7, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1, onUpdate: bp.apply })
      );
    }
  }

  /* ---- meteor: occasional surprise ---------------------------------------- */
  const meteor = svg.querySelector<SVGGElement>("[data-meteor]");
  let meteorCall: gsap.core.Tween | null = null;
  if (meteor && !reducedMotion) {
    const mrng = createRng(layout.stars.seed + 7);
    const mp = getTransformProxy(meteor);
    const { width: W, height: H } = layout.viewBox;
    const runMeteor = () => {
      const { from, travel } = layout.meteor;
      const sx = mrng.range(from.x[0], from.x[1]);
      const sy = mrng.range(from.y[0], from.y[1]);
      // Direction from the authored travel range; length extended until the
      // meteor has fully left the frame so it never dies mid-screen.
      const ddx = mrng.range(travel.x[0], travel.x[1]);
      const ddy = mrng.range(travel.y[0], travel.y[1]);
      const len0 = Math.hypot(ddx, ddy) || 1;
      const ux = ddx / len0;
      const uy = ddy / len0;
      const margin = 140;
      const toRight = ux > 0 ? (W + margin - sx) / ux : Infinity;
      const toBottom = uy > 0 ? (H + margin - sy) / uy : Infinity;
      const len = Math.min(toRight, toBottom);
      const dx = ux * len;
      const dy = uy * len;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + mrng.range(-4, 4);
      const dur = len / mrng.range(380, 520);
      mp.x = sx;
      mp.y = sy;
      mp.rotation = angle;
      mp.apply();
      const tl = gsap.timeline({
        onComplete: () => {
          meteorCall = gsap.delayedCall(mrng.range(9, 18), runMeteor);
          calls.push(meteorCall);
        }
      });
      tl.set(meteor, { opacity: 0 }, 0);
      tl.to(meteor, { opacity: 1, duration: dur * 0.2, ease: "power1.out" }, 0);
      tl.to(mp, { x: sx + dx, y: sy + dy, duration: dur, ease: "none", onUpdate: mp.apply }, 0);
      tl.set(meteor, { opacity: 0 }, dur);
      tweens.push(tl);
    };
    meteorCall = gsap.delayedCall(1.1, runMeteor);
    calls.push(meteorCall);
  } else if (meteor) {
    // Reduced motion: a single meteor frozen mid-flight as part of the drawing.
    const { from, travel } = layout.meteor;
    const mp = getTransformProxy(meteor);
    mp.x = (from.x[0] + from.x[1]) / 2 + travel.x[0] * 0.5;
    mp.y = (from.y[0] + from.y[1]) / 2 + travel.y[0] * 0.5;
    mp.rotation = (Math.atan2(travel.y[0], travel.x[0]) * 180) / Math.PI;
    mp.apply();
    gsap.set(meteor, { opacity: 0.9 });
  }

  /* ---- asteroid drift: 15-25% of the belt -------------------------------- */
  if (!reducedMotion) {
    const drifters = svg.querySelectorAll<SVGElement>("[data-drift]");
    const arng = createRng(layout.asteroids.seed + 3);
    drifters.forEach((rock) => {
      const baseTransform = rock.getAttribute("transform") ?? "";
      // Keep the authored placement and add a tiny motion on top via a wrapper.
      const dx = arng.range(2, 8) * (arng.chance(0.5) ? 1 : -1);
      const dy = arng.range(1, 4) * (arng.chance(0.5) ? 1 : -1);
      const rot = arng.range(-14, 14);
      const state = { p: 0 };
      tweens.push(
        gsap.to(state, {
          p: 1,
          duration: arng.range(8, 20),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: arng.range(0, 4),
          onUpdate: () => {
            rock.setAttribute(
              "transform",
              `${baseTransform} translate(${(dx * state.p).toFixed(2)} ${(dy * state.p).toFixed(2)}) rotate(${(rot * state.p).toFixed(2)})`
            );
          }
        })
      );
    });
  }

  /* ---- blinks: eyes groups in final artwork ------------------------------- */
  if (!reducedMotion) {
    const eyes = svg.querySelectorAll<SVGGElement>('[data-face="eyes"]');
    const brng = createRng(4242);
    eyes.forEach((group) => {
      let box: DOMRect | null = null;
      try {
        box = group.getBBox();
      } catch {
        box = null;
      }
      if (!box) return;
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      const state = { sy: 1 };
      const blink = () => {
        const tl = gsap.timeline({
          onUpdate: () => {
            group.setAttribute("transform", `translate(${cx} ${cy}) scale(1 ${state.sy.toFixed(3)}) translate(${-cx} ${-cy})`);
          },
          onComplete: () => {
            const call = gsap.delayedCall(brng.range(5, 12), blink);
            calls.push(call);
          }
        });
        tl.to(state, { sy: 0.12, duration: 0.09, ease: "power2.in" });
        tl.to(state, { sy: 1, duration: 0.14, ease: "power2.out" });
        tweens.push(tl);
      };
      calls.push(gsap.delayedCall(brng.range(3, 10), blink));
    });
  }

  return {
    kill() {
      for (const t of tweens) t.kill();
      for (const c of calls) c.kill();
      meteorCall?.kill();
    }
  };
}
