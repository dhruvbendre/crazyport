import { gsap } from "./gsapSetup";
import { clamp } from "../utils/clamp";
import { lerp } from "../utils/math";
import { SEAT_SELECTOR } from "./companionState";

type Options = {
  /** The fixed layer that is moved. Its top-left is the companion's centre. */
  root: HTMLElement;
  /** Tilted and bobbed. */
  body: HTMLElement;
  /** Rendered size of the avatar in CSS px. */
  size: number;
  reducedMotion: boolean;
  /** Called whenever the companion's motion-driven state changes. */
  onState: (state: CompanionMotionState) => void;
};

export type CompanionMotionState = {
  /** idle | scroll | rush, from how fast the page is moving. */
  pace: "idle" | "scroll" | "rush";
  /** True while the companion sits in a page's seat (the chat on Mnemora). */
  docked: boolean;
  /** True once the visitor has reached the foot of the page. */
  arrived: boolean;
};

export type CompanionMotion = { kill: () => void };

/**
 * A companion that follows the visitor down the page.
 *
 * It lives near the right edge of the viewport. At the top of the page it
 * floats high; as the visitor scrolls it drifts down toward the foot of the
 * viewport, swaying gently across the margin, always a beat behind the
 * scroll. Fast scrolling tips it into its "rush" mood; reaching the end of
 * the page earns one "arrive". When the page offers a seat (Mnemora's chat)
 * and that seat is on screen, the companion flies over and settles into it.
 *
 * Everything is transform-only on the GSAP ticker; nothing here touches
 * React until the pace or docking actually changes.
 */
export function createCompanionMotion(o: Options): CompanionMotion {
  const toX = gsap.quickTo(o.root, "x", { duration: 0.85, ease: "power3.out" });
  const toY = gsap.quickTo(o.root, "y", { duration: 0.85, ease: "power3.out" });
  const toRot = gsap.quickTo(o.body, "rotation", { duration: 0.5, ease: "power2.out" });
  const toScaleX = gsap.quickTo(o.body, "scaleX", { duration: 0.5, ease: "power2.out" });
  const toScaleY = gsap.quickTo(o.body, "scaleY", { duration: 0.5, ease: "power2.out" });

  const state: CompanionMotionState = { pace: "idle", docked: false, arrived: false };
  const emit = (next: Partial<CompanionMotionState>) => {
    let changed = false;
    for (const key of Object.keys(next) as (keyof CompanionMotionState)[]) {
      if (state[key] !== next[key]) {
        (state as Record<string, unknown>)[key] = next[key];
        changed = true;
      }
    }
    if (changed) o.onState({ ...state });
  };

  const margin = () => (window.innerWidth < 640 ? 14 : 28);
  // Where the companion floats at the top and the foot of the page, as
  // fractions of the viewport height. Phones keep it in the lower half so the
  // greeting never sits on the page title.
  const range = () => (window.innerWidth < 640 ? [0.56, 0.86] : [0.3, 0.8]);

  const place = (immediate: boolean) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = vw - margin() - o.size / 2;
    const y = vh * range()[0];
    if (immediate) gsap.set(o.root, { x, y });
    else {
      toX(x);
      toY(y);
    }
  };

  if (o.reducedMotion) {
    // No following: a still companion at the top-right corner of the viewport.
    place(true);
    const onResize = () => place(true);
    window.addEventListener("resize", onResize);
    return {
      kill() {
        window.removeEventListener("resize", onResize);
      }
    };
  }

  let lastScroll = window.scrollY;
  let velocity = 0;
  let calm = 0;
  let t = 0;
  let seated = false;
  let placed = false;

  // Geometry the tick needs, measured outside the frame loop. The viewport,
  // the document height and the seat's position only change on resize or when
  // the page reflows, so they are cached and refreshed by observers instead of
  // read back from layout on every frame (scrollHeight and
  // getBoundingClientRect both force a synchronous layout).
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let maxScroll = 1;
  let marginPx = margin();
  let [rangeTop, rangeFoot] = range();
  let seat: HTMLElement | null = null;
  let seatTop = 0; // document-space
  let seatLeft = 0;
  let seatWidth = 0;
  let seatHeight = 0;
  let measureQueued = 0;

  const measure = () => {
    measureQueued = 0;
    vw = window.innerWidth;
    vh = window.innerHeight;
    marginPx = margin();
    [rangeTop, rangeFoot] = range();
    maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    seat = document.querySelector<HTMLElement>(SEAT_SELECTOR);
    if (seat) {
      const r = seat.getBoundingClientRect();
      seatTop = r.top + window.scrollY;
      seatLeft = r.left;
      seatWidth = r.width;
      seatHeight = r.height;
    }
  };
  // Batch the many reflow notifications a page can fire while it settles.
  const queueMeasure = () => {
    if (!measureQueued) measureQueued = requestAnimationFrame(measure);
  };
  measure();
  window.addEventListener("resize", queueMeasure, { passive: true });
  window.addEventListener("orientationchange", queueMeasure, { passive: true });
  // Content settling (fonts, images, chat transcript growing) changes the
  // document height and the seat's place.
  const bodyObserver = new ResizeObserver(queueMeasure);
  bodyObserver.observe(document.body);
  if (seat) bodyObserver.observe(seat);
  // Late-arriving seat (the page mounts the chat after the companion).
  const seatWatch = window.setInterval(() => {
    const now = document.querySelector<HTMLElement>(SEAT_SELECTOR);
    if (now !== seat) {
      if (now) bodyObserver.observe(now);
      queueMeasure();
    }
  }, 1000);

  const tick = (_time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs / 1000, 0.05);
    t += dt;
    const scroll = window.scrollY;
    const progress = clamp(scroll / maxScroll, 0, 1);

    // Scroll velocity, smoothed, in px/s.
    const v = (scroll - lastScroll) / Math.max(dt, 0.001);
    lastScroll = scroll;
    velocity += (v - velocity) * 0.2;
    const speed = Math.abs(velocity);

    // Is there a seat on screen? Then that is where the companion belongs.
    // Its viewport position is the cached document position minus the scroll.
    let targetX: number;
    let targetY: number;
    let docked = false;
    if (seat) {
      const top = seatTop - scroll;
      const bottom = top + seatHeight;
      const visible = top < vh * 0.9 && bottom > vh * 0.1;
      if (visible) {
        docked = true;
        targetX = seatLeft + seatWidth / 2;
        targetY = top + seatHeight / 2;
      }
    }
    if (!docked) {
      // Down the right margin, swaying a little across it, with a slow
      // idle drift so it never sits perfectly still.
      const half = o.size / 2;
      const sway = Math.sin(progress * Math.PI * 2.5) * Math.min(vw * 0.035, 46);
      const drift = { x: Math.sin(t * 0.7) * 3, y: Math.cos(t * 0.5) * 4 };
      targetX = vw - marginPx - half - Math.abs(sway) * 0.5 - sway * 0.5 + drift.x;
      targetY = lerp(vh * rangeTop, vh * rangeFoot, progress) + drift.y;
    }
    if (!placed) {
      placed = true;
      gsap.set(o.root, { x: targetX!, y: targetY! });
    } else {
      toX(targetX!);
      toY(targetY!);
    }

    // Bank into the scroll, breathe while idle, sit up straight when seated.
    const bank = docked ? 0 : clamp(-velocity * 0.008, -9, 9);
    toRot(bank + (docked ? 0 : Math.sin(t * 1.3) * 1.5));
    const breath = docked ? 1 : 1 + Math.sin(t * 2.1) * 0.015;
    toScaleX(breath);
    toScaleY(breath);

    // Pace: settle back to idle only after the scroll has been calm a moment.
    if (speed > 1400) calm = 0;
    else if (speed > 220) calm = Math.min(calm, 0.2);
    else calm += dt;
    const pace: CompanionMotionState["pace"] = speed > 1400 ? "rush" : speed > 220 || calm < 0.6 ? "scroll" : "idle";

    if (seated !== docked) seated = docked;
    emit({ pace, docked, arrived: state.arrived || progress > 0.985 });
  };

  gsap.ticker.add(tick);

  return {
    kill() {
      // The quickTo tweens die with their elements; killing them here only
      // makes GSAP warn about resetting x / y.
      gsap.ticker.remove(tick);
      cancelAnimationFrame(measureQueued);
      window.removeEventListener("resize", queueMeasure);
      window.removeEventListener("orientationchange", queueMeasure);
      bodyObserver.disconnect();
      window.clearInterval(seatWatch);
    }
  };
}
