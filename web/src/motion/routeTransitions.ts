import { gsap } from "./gsapSetup";
import type { PlanetConfig } from "../data/planets";
import { getTransformProxy } from "./transformProxy";

/* ---------------------------------------------------------------------------
   Interaction lock: prevents double clicks and concurrent route animations.
   --------------------------------------------------------------------------- */

let locked = false;
const lockListeners = new Set<(locked: boolean) => void>();

export function isTransitionLocked(): boolean {
  return locked;
}

function setLocked(value: boolean) {
  locked = value;
  lockListeners.forEach((fn) => fn(value));
}

export function subscribeTransitionLock(fn: (locked: boolean) => void): () => void {
  lockListeners.add(fn);
  return () => lockListeners.delete(fn);
}

/* ---------------------------------------------------------------------------
   Overlay registry: the overlay component registers its nodes once.
   --------------------------------------------------------------------------- */

type OverlayNodes = { root: HTMLElement; disc: HTMLElement; veil: HTMLElement };

/** The black paper of the home scene; the veil returns to it on the way back. */
const SPACE = "#050505";
let overlay: OverlayNodes | null = null;

export function registerRouteOverlay(nodes: OverlayNodes | null): void {
  overlay = nodes;
}

/* ---------------------------------------------------------------------------
   Planet → page
   --------------------------------------------------------------------------- */

type PlanetExitOptions = {
  svg: SVGSVGElement;
  planet: PlanetConfig;
  reducedMotion: boolean;
  /** Called at the moment the overlay covers the viewport: navigate here. */
  onCovered: () => void;
};

/**
 * Entering a world (plot.md section 6). The selected planet's chalk is
 * reinforced, it rises above its neighbours and grows toward the viewport
 * centre while the universe falls back, and its *field* colour (the deep tint
 * of its interior) spreads from the planet until it covers the screen. About
 * 720 ms in total; the route changes as soon as the screen is covered, and the
 * interior opens with the same planet as its horizon.
 */
export function playPlanetExit(o: PlanetExitOptions): Promise<void> {
  return new Promise((resolve) => {
    if (locked) {
      resolve();
      return;
    }
    setLocked(true);

    const { svg, planet, reducedMotion } = o;
    const wrapper = svg.querySelector<SVGGElement>(`[data-orbit-wrapper="${planet.id}"]`);
    const hoverWrapper = wrapper?.querySelector<SVGGElement>("[data-hover-wrapper]") ?? null;
    const chalkEmphasis = hoverWrapper?.querySelector<SVGPathElement>("[data-chalk-emphasis]") ?? null;
    const label = svg.querySelector<SVGGElement>(`[data-planet-label="${planet.id}"] [data-label-inner]`);
    const dimTargets = Array.from(
      svg.querySelectorAll<SVGElement>(`[data-dimmable]:not([data-orbit-wrapper="${planet.id}"])`)
    );

    const finish = () => {
      o.onCovered();
      // Give the new page a frame to mount, then release the overlay.
      requestAnimationFrame(() => {
        revealPage(reducedMotion).then(() => {
          setLocked(false);
          resolve();
        });
      });
    };

    if (reducedMotion || !wrapper || !hoverWrapper || !overlay) {
      if (overlay) {
        overlay.root.style.setProperty("--planet-field", planet.field);
        overlay.root.dataset.active = "true";
        gsap.set(overlay.disc, { scale: 0 });
        gsap.set(overlay.veil, { background: planet.field });
        gsap.to(overlay.veil, { opacity: 1, duration: 0.18, onComplete: finish });
      } else {
        finish();
      }
      return;
    }

    // Raise the selected planet above its neighbours (DOM order = z-order).
    wrapper.parentNode?.appendChild(wrapper);

    // Where is the viewport centre in scene space, relative to the planet?
    const ctm = svg.getScreenCTM();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let targetX = 0;
    let targetY = 0;
    let screenX = vw / 2;
    let screenY = vh / 2;
    if (ctm) {
      const centre = new DOMPoint(vw / 2, vh / 2).matrixTransform(ctm.inverse());
      const wx = Number(gsap.getProperty(wrapper, "x")) || 0;
      const wy = Number(gsap.getProperty(wrapper, "y")) || 0;
      targetX = centre.x - wx;
      targetY = centre.y - wy;
      const planetScreen = new DOMPoint(wx, wy).matrixTransform(ctm);
      screenX = planetScreen.x;
      screenY = planetScreen.y;
    }

    const proxy = getTransformProxy(hoverWrapper);
    const { root, disc, veil } = overlay;
    root.style.setProperty("--planet-field", planet.field);
    root.dataset.active = "true";

    const coverScale = (2.3 * Math.hypot(vw, vh)) / 100;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    // 1. chalk reinforced, annotation lets go
    if (chalkEmphasis) tl.to(chalkEmphasis, { strokeDashoffset: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, 0);
    if (label) tl.to(label, { opacity: 0, duration: 0.2 }, 0);

    // 2. the rest of the universe falls back; 3. the planet rises and grows
    tl.to(dimTargets, { opacity: 0.28, duration: 0.5, ease: "power2.out" }, 0);
    tl.to(proxy, { scale: 2.6, x: targetX, y: targetY, duration: 0.66, onUpdate: proxy.apply }, 0.04);

    // 4. the world's field spreads from the planet until it covers the screen
    // The disc starts on the planet and travels to the viewport centre as a
    // translation (compositor-only), never by animating left/top.
    tl.set(disc, { left: screenX, top: screenY, x: 0, y: 0, scale: 0, opacity: 1 }, 0);
    tl.to(disc, { x: vw / 2 - screenX, y: vh / 2 - screenY, duration: 0.52, ease: "power3.inOut" }, 0.12);
    tl.to(disc, { scale: coverScale, duration: 0.5, ease: "power3.in" }, 0.22);
    tl.set(veil, { opacity: 0, background: planet.field }, 0);
    tl.call(finish, undefined, 0.72);
  });
}

/**
 * Release the overlay after the new page mounted. The page itself animates in
 * (see playPageEnter); the accent field simply lets go.
 */
function revealPage(reducedMotion: boolean): Promise<void> {
  return new Promise((resolve) => {
    if (!overlay) {
      resolve();
      return;
    }
    const { root, disc, veil } = overlay;
    const tl = gsap.timeline({
      onComplete: () => {
        root.dataset.active = "false";
        gsap.set(disc, { scale: 0, opacity: 1 });
        gsap.set(veil, { opacity: 0 });
        resolve();
      }
    });
    tl.to([disc, veil], { opacity: 0, duration: reducedMotion ? 0.15 : 0.42, ease: "power2.out" }, 0.05);
  });
}

/* ---------------------------------------------------------------------------
   Page entrances / exits
   --------------------------------------------------------------------------- */

export function playPageEnter(container: HTMLElement, reducedMotion: boolean): gsap.core.Timeline {
  const tl = gsap.timeline();
  const items = container.querySelectorAll<HTMLElement>("[data-enter]");
  if (reducedMotion) {
    tl.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.15 });
    return tl;
  }
  tl.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0);
  tl.fromTo(
    items,
    { y: 18, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.06 },
    0.12
  );
  return tl;
}

/**
 * Page → universe. Short (≈350–450 ms): the page lifts away, the paper veil
 * covers the screen and the universe scene resumes where it was.
 */
export function playPageExit(container: HTMLElement, reducedMotion: boolean, onCovered: () => void): Promise<void> {
  return new Promise((resolve) => {
    if (locked) {
      resolve();
      return;
    }
    setLocked(true);

    const finish = () => {
      onCovered();
      requestAnimationFrame(() => {
        if (!overlay) {
          setLocked(false);
          resolve();
          return;
        }
        const { root, veil } = overlay;
        gsap.to(veil, {
          opacity: 0,
          duration: reducedMotion ? 0.15 : 0.32,
          ease: "power2.out",
          delay: 0.05,
          onComplete: () => {
            root.dataset.active = "false";
            setLocked(false);
            resolve();
          }
        });
      });
    };

    if (!overlay || reducedMotion) {
      if (overlay) {
        overlay.root.dataset.active = "true";
        gsap.set(overlay.disc, { scale: 0 });
        gsap.set(overlay.veil, { background: SPACE });
        gsap.to(overlay.veil, { opacity: 1, duration: 0.15, onComplete: finish });
      } else {
        finish();
      }
      return;
    }

    const { root, veil, disc } = overlay;
    root.dataset.active = "true";
    gsap.set(disc, { scale: 0 });
    gsap.set(veil, { background: SPACE });
    const tl = gsap.timeline();
    tl.to(container, { opacity: 0, y: -12, duration: 0.28, ease: "power2.in" }, 0);
    tl.to(veil, { opacity: 1, duration: 0.24, ease: "power2.inOut" }, 0.1);
    tl.call(finish, undefined, 0.34);
  });
}

/* ---------------------------------------------------------------------------
   World → the archive (a separate application)
   --------------------------------------------------------------------------- */

/**
 * Leaving the site for the archive. The page settles, the world's field
 * colour covers the screen, and only then does the browser navigate, so the
 * first frame of the archive (same field colour) continues the same room.
 * The lock is intentionally never released: the document is about to unload.
 */
export function playExternalExit(
  container: HTMLElement | null,
  field: string,
  reducedMotion: boolean,
  onCovered: () => void
): Promise<void> {
  return new Promise((resolve) => {
    if (locked) {
      resolve();
      return;
    }
    setLocked(true);
    const finish = () => {
      onCovered();
      resolve();
    };
    if (!overlay) {
      finish();
      return;
    }
    const { root, veil, disc } = overlay;
    root.dataset.active = "true";
    gsap.set(disc, { scale: 0 });
    gsap.set(veil, { background: field, opacity: 0 });
    const tl = gsap.timeline();
    if (container && !reducedMotion) {
      tl.to(container, { opacity: 0.35, y: -10, duration: 0.42, ease: "power2.in" }, 0);
    }
    tl.to(veil, { opacity: 1, duration: reducedMotion ? 0.15 : 0.4, ease: "power2.inOut" }, reducedMotion ? 0 : 0.12);
    tl.call(finish, undefined, reducedMotion ? 0.18 : 0.55);
  });
}
