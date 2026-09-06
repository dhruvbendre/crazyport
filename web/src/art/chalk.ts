/**
 * Chalk toolkit
 * ---------------------------------------------------------------------------
 * Generates the hand-drawn white chalk perimeter that circles every celestial
 * body (art.md §4). A perimeter is never one stroke: it is three imperfect
 * rings of different weight, each broken in a few places, plus a handful of
 * dust specks where the chalk skipped off the paper. A fourth, heavier ring is
 * drawn in on hover / focus.
 *
 * Everything is seeded so the same body always carries the same marks.
 */
import { createRng } from "../utils/seededRandom";
import { round, TAU } from "../utils/math";

export type ChalkStroke = {
  d: string;
  width: number;
  opacity: number;
  /** Dash pattern in user units; the gaps are the "breaks" in the chalk. */
  dasharray: string;
  dashoffset: number;
  /** Small offset so the layered rings do not sit exactly on each other. */
  dx: number;
  dy: number;
};

export type ChalkDust = { x: number; y: number; r: number; opacity: number };

export type ChalkRing = {
  strokes: ChalkStroke[];
  /** Drawn only while the body is active; animated with stroke-dashoffset. */
  emphasis: { d: string; width: number; length: number };
  dust: ChalkDust[];
  /** Approximate circumference, handy for draw-in animations. */
  circumference: number;
};

type Rng = ReturnType<typeof createRng>;

/**
 * A closed, slightly wobbly circle as a cubic path. Anchors wobble radially
 * and the handles are jittered so the stroke pressure reads as uneven.
 */
export function chalkCircle(r: number, rng: Rng, points = 20, wobble = 0.028): string {
  const step = TAU / points;
  const kappa = (4 / 3) * Math.tan(step / 4);
  const pts: { x: number; y: number; tx: number; ty: number }[] = [];
  // A slow "lean" so the ring is not centred perfectly on the body.
  const lean = rng.range(0, TAU);
  const leanAmount = r * rng.range(0.004, 0.012);
  for (let i = 0; i < points; i++) {
    const a = i * step;
    const rr = r * (1 + (rng.next() * 2 - 1) * wobble + Math.sin(a * 2 + lean) * wobble * 0.5);
    pts.push({
      x: Math.cos(a) * rr + Math.cos(lean) * leanAmount,
      y: Math.sin(a) * rr + Math.sin(lean) * leanAmount,
      tx: -Math.sin(a) * rr * kappa * rng.range(0.9, 1.1),
      ty: Math.cos(a) * rr * kappa * rng.range(0.9, 1.1)
    });
  }
  let d = `M${round(pts[0].x)} ${round(pts[0].y)}`;
  for (let i = 0; i < points; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % points];
    d += `C${round(a.x + a.tx)} ${round(a.y + a.ty)} ${round(b.x - b.tx)} ${round(b.y - b.ty)} ${round(b.x)} ${round(b.y)}`;
  }
  return d + "Z";
}

/**
 * Dash pattern with `breaks` gaps spread unevenly around the circumference.
 * Runs are long; gaps are short (2–7% of the circumference), so the ring still
 * reads as one line that skipped in a few places.
 */
function breaks(circumference: number, count: number, rng: Rng, gapRange: [number, number]): string {
  const parts: number[] = [];
  let remaining = circumference;
  for (let i = 0; i < count; i++) {
    const gap = circumference * rng.range(gapRange[0], gapRange[1]);
    const share = remaining / (count - i);
    const run = Math.max(4, share * rng.range(0.65, 1.15) - gap);
    parts.push(run, gap);
    remaining -= run + gap;
  }
  // Absorb any leftover into the last run so the pattern tiles cleanly.
  if (remaining > 0) parts[parts.length - 2] += remaining;
  return parts.map((v) => round(Math.max(0.5, v))).join(" ");
}

type RingOptions = {
  /** Base stroke width in the ring's own units (scene units for planets). */
  weight?: number;
  /** Number of dust specks. */
  dust?: number;
  /** Anchors per ring; more for large bodies. */
  points?: number;
};

/**
 * The full chalk perimeter for a body of radius `r`. The rings sit just
 * outside the body so the crayon edge stays visible inside the chalk.
 */
export function chalkRing(r: number, seed: number, options: RingOptions = {}): ChalkRing {
  const rng = createRng(seed);
  const weight = options.weight ?? Math.max(1.4, 1.6 + r * 0.006);
  const points = options.points ?? Math.round(Math.min(30, Math.max(16, r / 4)));
  const circumference = TAU * r;

  const outer = r * 1.075;
  const strokes: ChalkStroke[] = [
    // The main line: confident, a couple of skips.
    {
      d: chalkCircle(outer, rng, points, 0.022),
      width: weight,
      opacity: 0.86,
      dasharray: breaks(TAU * outer, rng.int(2, 3), rng, [0.015, 0.045]),
      dashoffset: rng.range(0, circumference),
      dx: 0,
      dy: 0
    },
    // A second pass, lighter and offset: the hand went round twice.
    {
      d: chalkCircle(outer * 1.012, rng, points - 2, 0.03),
      width: weight * 0.55,
      opacity: 0.42,
      dasharray: breaks(TAU * outer * 1.012, rng.int(3, 5), rng, [0.03, 0.08]),
      dashoffset: rng.range(0, circumference),
      dx: rng.range(-1.2, 1.2),
      dy: rng.range(-1.2, 1.2)
    },
    // A faint inner halo where the chalk dust settled.
    {
      d: chalkCircle(outer * 0.985, rng, points - 4, 0.035),
      width: weight * 1.7,
      opacity: 0.12,
      dasharray: breaks(TAU * outer * 0.985, rng.int(2, 4), rng, [0.05, 0.12]),
      dashoffset: rng.range(0, circumference),
      dx: rng.range(-0.8, 0.8),
      dy: rng.range(-0.8, 0.8)
    }
  ];

  const emphasisRadius = outer * 1.02;
  const emphasis = {
    d: chalkCircle(emphasisRadius, rng, points, 0.02),
    width: weight * 1.35,
    length: TAU * emphasisRadius * 1.03
  };

  const dust: ChalkDust[] = [];
  const dustCount = options.dust ?? Math.round(Math.min(16, 6 + r / 10));
  for (let i = 0; i < dustCount; i++) {
    const a = rng.range(0, TAU);
    const rr = outer * rng.range(0.96, 1.12);
    dust.push({
      x: round(Math.cos(a) * rr),
      y: round(Math.sin(a) * rr),
      r: round(rng.range(0.35, 1.1) * Math.max(0.8, weight * 0.45), 2),
      opacity: round(rng.range(0.18, 0.5), 2)
    });
  }

  return { strokes, emphasis, dust, circumference };
}

/**
 * A short leader line from a body's perimeter toward its annotation. Slightly
 * bowed, like a quick chalk tick, ending in a tiny hook.
 */
export function chalkLeader(from: { x: number; y: number }, to: { x: number; y: number }, seed: number): string {
  const rng = createRng(seed);
  const mx = (from.x + to.x) / 2 + rng.range(-4, 4);
  const my = (from.y + to.y) / 2 + rng.range(-5, 5);
  return `M${round(from.x)} ${round(from.y)}Q${round(mx)} ${round(my)} ${round(to.x)} ${round(to.y)}`;
}

/** A wavy horizontal chalk rule used by interior pages. */
export function chalkRule(width: number, seed: number, amplitude = 1.6): string {
  const rng = createRng(seed);
  const n = 6;
  let d = `M0 ${round(rng.range(-amplitude, amplitude))}`;
  for (let i = 1; i <= n; i++) {
    const x = (i / n) * width;
    const cx = x - width / n / 2 + rng.range(-6, 6);
    d += `Q${round(cx)} ${round(rng.range(-amplitude * 1.6, amplitude * 1.6))} ${round(x)} ${round(rng.range(-amplitude, amplitude))}`;
  }
  return d;
}

/**
 * A hand-drawn rectangle with slightly bowed sides and overshooting corners,
 * for the few boxes an interior page needs (inputs, placeholder panels).
 */
export function chalkBox(width: number, height: number, seed: number, overshoot = 3): string {
  const rng = createRng(seed);
  const j = (v: number) => round(v + rng.range(-1.2, 1.2));
  const bow = (len: number) => rng.range(-len * 0.012, len * 0.012);
  const w = width;
  const h = height;
  return [
    `M${j(-overshoot)} ${j(0)}Q${round(w / 2)} ${round(bow(w))} ${j(w + overshoot * 0.6)} ${j(0)}`,
    `M${j(w)} ${j(-overshoot * 0.7)}Q${round(w + bow(h))} ${round(h / 2)} ${j(w)} ${j(h + overshoot)}`,
    `M${j(w + overshoot)} ${j(h)}Q${round(w / 2)} ${round(h + bow(w))} ${j(-overshoot * 0.5)} ${j(h)}`,
    `M${j(0)} ${j(h + overshoot * 0.8)}Q${round(bow(h))} ${round(h / 2)} ${j(0)} ${j(-overshoot)}`
  ].join("");
}
