import { gsap } from "./gsapSetup";
import { getTransformProxy } from "./transformProxy";

export const HOVER_SCALE = 1.1;

export type PlanetHoverTargets = {
  hoverWrapper: SVGGElement;
  /** The tiny wrapper inside the art: gets a slight lean while active. */
  microWrapper: SVGGElement | null;
  orbitPath: SVGPathElement | null;
  chalk: SVGGElement | null;
  chalkEmphasis: SVGPathElement | null;
  chalkDust: SVGGElement | null;
  label: SVGGElement | null;
  /** Labels on touch layouts are always visible and never animated. */
  persistentLabel: boolean;
  reducedMotion: boolean;
};

const jitters = new WeakMap<SVGGElement, gsap.core.Tween>();

/**
 * Planet interaction feedback (art.md §6.1).
 *
 *   - the body scales up a touch around its true centre
 *   - the chalk perimeter is reinforced: a heavier ring draws itself in, the
 *     dust brightens and the whole perimeter jitters by a fraction of a degree
 *   - the art leans a couple of degrees, as if turning toward the visitor
 *   - the orbit line brightens a little
 *   - the annotation fades in
 *
 * Everything uses overwrite so rapid hover changes never fight.
 */
export function planetHoverIn(t: PlanetHoverTargets): void {
  const proxy = getTransformProxy(t.hoverWrapper);
  const fast = t.reducedMotion;

  gsap.to(proxy, {
    scale: fast ? 1.04 : HOVER_SCALE,
    duration: fast ? 0.12 : 0.32,
    ease: "power2.out",
    overwrite: "auto",
    onUpdate: proxy.apply
  });

  if (t.microWrapper && !fast) {
    const mp = getTransformProxy(t.microWrapper);
    gsap.to(mp, { rotation: -2.4, duration: 0.5, ease: "power2.out", overwrite: "auto", onUpdate: mp.apply });
  }

  if (t.orbitPath) {
    gsap.to(t.orbitPath, { opacity: 1, strokeWidth: 2.4, duration: 0.35, overwrite: "auto" });
  }

  if (t.chalkEmphasis) {
    gsap.to(t.chalkEmphasis, {
      strokeDashoffset: 0,
      opacity: 0.8,
      duration: fast ? 0.15 : 0.55,
      ease: "power2.out",
      overwrite: "auto"
    });
  }
  if (t.chalkDust) {
    gsap.to(t.chalkDust, { opacity: 1.6, duration: 0.4, overwrite: "auto" });
  }
  if (t.chalk && !fast) {
    // A fraction of a degree, back and forth: chalk that is still being drawn.
    const cp = getTransformProxy(t.chalk);
    jitters.get(t.chalk)?.kill();
    cp.rotation = -0.5;
    cp.apply();
    jitters.set(
      t.chalk,
      gsap.to(cp, { rotation: 0.5, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1, onUpdate: cp.apply })
    );
  }

  if (t.label && !t.persistentLabel) {
    gsap.fromTo(
      t.label,
      { opacity: 0, y: 4 },
      { opacity: 1, y: 0, duration: fast ? 0.12 : 0.36, ease: "power2.out", overwrite: "auto", delay: fast ? 0 : 0.05 }
    );
  }
}

export function planetHoverOut(t: PlanetHoverTargets): void {
  const proxy = getTransformProxy(t.hoverWrapper);
  const fast = t.reducedMotion;

  gsap.to(proxy, {
    scale: 1,
    duration: fast ? 0.12 : 0.42,
    ease: "power2.inOut",
    overwrite: "auto",
    onUpdate: proxy.apply
  });

  if (t.microWrapper) {
    const mp = getTransformProxy(t.microWrapper);
    gsap.to(mp, { rotation: 0, duration: fast ? 0.1 : 0.55, ease: "power2.inOut", overwrite: "auto", onUpdate: mp.apply });
  }

  if (t.orbitPath) {
    gsap.to(t.orbitPath, { opacity: 0.88, strokeWidth: 2, duration: 0.5, overwrite: "auto" });
  }

  if (t.chalkEmphasis) {
    const length = Number(t.chalkEmphasis.getAttribute("stroke-dasharray")) || 0;
    gsap.to(t.chalkEmphasis, {
      opacity: 0,
      duration: fast ? 0.1 : 0.3,
      ease: "power2.in",
      overwrite: "auto",
      onComplete: () => gsap.set(t.chalkEmphasis, { strokeDashoffset: length })
    });
  }
  if (t.chalkDust) {
    gsap.to(t.chalkDust, { opacity: 1, duration: 0.4, overwrite: "auto" });
  }
  if (t.chalk) {
    jitters.get(t.chalk)?.kill();
    jitters.delete(t.chalk);
    const cp = getTransformProxy(t.chalk);
    gsap.to(cp, { rotation: 0, duration: 0.3, ease: "power2.out", overwrite: "auto", onUpdate: cp.apply });
  }

  if (t.label && !t.persistentLabel) {
    gsap.to(t.label, { opacity: 0, duration: fast ? 0.1 : 0.22, ease: "power2.in", overwrite: "auto" });
  }
}
