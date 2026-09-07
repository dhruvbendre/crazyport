/**
 * A tiny quality governor for the intro.
 *
 * The intro pushes a live WebGL canvas through an SVG displacement filter,
 * which the browser has to run on the CPU every frame. Capable machines carry
 * it; weaker ones drop to ~20 fps, which looks worse than the plain posterised
 * treatment phones already get. So the frame cadence is watched for a short
 * window and the caller is told which tier to draw. It decides once, from a
 * run of frames rather than a single slow one, and never touches the
 * choreography itself.
 */
export type IntroQuality = "full" | "lite";

/** Frames shorter than this are ignored (a 120 Hz display is not "faster"). */
const MIN_FRAME_MS = 4;
/** A frame this long means the display missed at least one 60 Hz refresh. */
const SLOW_FRAME_MS = 28;
/** How many frames to watch before deciding. */
const SAMPLE_FRAMES = 30;
/** Give up waiting for frames after this long (e.g. a throttled background tab). */
const SAMPLE_TIMEOUT_MS = 1200;

export function measureIntroQuality(decide: (tier: IntroQuality) => void): () => void {
  // Obvious low-end signals decide immediately.
  const nav = navigator as Navigator & { deviceMemory?: number };
  if ((nav.deviceMemory ?? 8) <= 2) {
    decide("lite");
    return () => {};
  }

  const samples: number[] = [];
  let last = 0;
  let raf = 0;
  let done = false;
  const started = performance.now();

  const finish = (tier: IntroQuality) => {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    decide(tier);
  };

  const tick = (t: number) => {
    if (done) return;
    if (last) {
      const d = t - last;
      if (d >= MIN_FRAME_MS) samples.push(d);
    }
    last = t;
    if (samples.length >= SAMPLE_FRAMES || t - started > SAMPLE_TIMEOUT_MS) {
      if (samples.length < 8) return finish("full");
      const sorted = [...samples].sort((a, b) => a - b);
      const median = sorted[sorted.length >> 1];
      const slow = samples.filter((d) => d >= SLOW_FRAME_MS).length / samples.length;
      // Sustained: half the frames are slow, or the typical frame is.
      finish(median >= SLOW_FRAME_MS || slow >= 0.5 ? "lite" : "full");
      return;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    done = true;
    cancelAnimationFrame(raf);
  };
}
