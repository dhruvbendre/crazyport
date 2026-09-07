/**
 * A runtime quality governor.
 *
 * Watches the animation-frame cadence and reports a tier: "full" while the
 * display keeps its rhythm, "reduced" when frames are dropping *sustainedly*
 * (never from a single slow frame). Consumers use it to trim decorative
 * work only: the companion holds its pose while a struggling page scrolls,
 * for example. Core interaction is never gated on it.
 *
 * Cost: one requestAnimationFrame callback per frame doing a subtraction and
 * an array push; the decision runs once per window of frames. Refresh-rate
 * aware: the base interval is learnt from the fastest frames seen, so a
 * 120 Hz display is not mistaken for a fast 60 Hz one.
 */
export type FrameTier = "full" | "reduced";

const WINDOW = 45; // frames per decision
const SLOW_RATIO_ENTER = 0.4; // 40% of a window missed a refresh, twice in a row
const SLOW_RATIO_EXIT = 0.1; // and back only after three calm windows
const ENTER_WINDOWS = 2;
const EXIT_WINDOWS = 3;

type Listener = (tier: FrameTier) => void;

let tier: FrameTier = "full";
const listeners = new Set<Listener>();
let running = false;
let raf = 0;
let last = 0;
let base = 16.7; // learnt display interval
let frames: number[] = [];
let slowWindows = 0;
let calmWindows = 0;

const setTier = (next: FrameTier) => {
  if (tier === next) return;
  tier = next;
  for (const l of listeners) l(tier);
};

const tick = (t: number) => {
  if (!running) return;
  raf = requestAnimationFrame(tick);
  if (document.hidden) {
    last = 0;
    return;
  }
  if (last) {
    const d = t - last;
    // Track the fastest plausible interval as the display's base rate.
    if (d >= 4 && d < base) base = Math.max(4, d);
    frames.push(d);
    if (frames.length >= WINDOW) {
      const slow = frames.filter((x) => x > base * 1.6).length / frames.length;
      frames = [];
      if (slow >= SLOW_RATIO_ENTER) {
        slowWindows++;
        calmWindows = 0;
        if (slowWindows >= ENTER_WINDOWS) setTier("reduced");
      } else {
        slowWindows = 0;
        if (slow <= SLOW_RATIO_EXIT) {
          calmWindows++;
          if (calmWindows >= EXIT_WINDOWS) setTier("full");
        } else calmWindows = 0;
      }
    }
  }
  last = t;
};

const start = () => {
  if (running) return;
  running = true;
  last = 0;
  raf = requestAnimationFrame(tick);
};

const stop = () => {
  running = false;
  cancelAnimationFrame(raf);
  frames = [];
};

/** Current tier (no subscription). */
export function currentFrameTier(): FrameTier {
  return tier;
}

/** Subscribe to tier changes; the sampler runs only while someone listens. */
export function subscribeFrameTier(listener: Listener): () => void {
  listeners.add(listener);
  start();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stop();
  };
}
