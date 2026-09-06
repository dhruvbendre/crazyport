import { createRng } from "./seededRandom";
import { cubicAt, degToRad, round, TAU, type Point } from "./math";

/**
 * Parametric description of a hand-drawn orbit.
 *
 * The orbit is an ellipse defined by a centre, an aspect ratio (ry / rx) and a
 * rotation. Its size is *derived* so that the curve passes exactly through the
 * `through` point, which is the planet's intended first-frame position. That
 * keeps the composition authored in one place: move the planet target and the
 * orbit follows, while the planet still starts precisely on its line.
 */
export type OrbitSpec = {
  id: string;
  center: Point;
  /** ry / rx. Below 1 = wide, above 1 = tall. */
  aspect: number;
  /** Rotation in degrees. Negative lifts the right-hand side of the ellipse. */
  rotation: number;
  /** A point the orbit must pass through. */
  through: Point;
  /** Hand-drawn wobble amplitude in scene units. */
  wobble?: number;
  /** Seed for the wobble. */
  seed?: number;
  /** Number of cubic segments. */
  segments?: number;
};

export type ResolvedOrbit = {
  id: string;
  d: string;
  center: Point;
  rx: number;
  ry: number;
  rotation: number;
  length: number;
  /** Arc-length progress (0..1) at which the orbit passes the `through` point. */
  startProgress: number;
  /** The exact point on the drawn curve closest to `through`. */
  start: Point;
  /** Sample the curve at an arc-length progress. */
  pointAt: (progress: number) => Point;
};

type Segment = { p0: Point; c1: Point; c2: Point; p3: Point };

const SAMPLES_PER_SEGMENT = 24;

function ellipsePoint(cx: number, cy: number, rx: number, ry: number, rot: number, t: number): Point {
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const ex = rx * Math.cos(t);
  const ey = ry * Math.sin(t);
  return { x: cx + ex * cos - ey * sin, y: cy + ex * sin + ey * cos };
}

function ellipseTangent(rx: number, ry: number, rot: number, t: number): Point {
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const dx = -rx * Math.sin(t);
  const dy = ry * Math.cos(t);
  return { x: dx * cos - dy * sin, y: dx * sin + dy * cos };
}

export function resolveOrbit(spec: OrbitSpec): ResolvedOrbit {
  const { center, aspect, through } = spec;
  const rot = degToRad(spec.rotation);
  const segments = spec.segments ?? 18;
  const wobble = spec.wobble ?? 0;
  const rng = createRng(spec.seed ?? 1);

  // Un-rotate the through point into ellipse-local space and solve for rx.
  const dx = through.x - center.x;
  const dy = through.y - center.y;
  const u = dx * Math.cos(rot) + dy * Math.sin(rot);
  const v = -dx * Math.sin(rot) + dy * Math.cos(rot);
  const rx = Math.sqrt(u * u + (v / aspect) * (v / aspect));
  const ry = rx * aspect;

  // Anchor points with a gentle radial wobble. The last anchor equals the
  // first so the loop closes seamlessly (no jump after a full revolution).
  const step = TAU / segments;
  const kappa = (4 / 3) * Math.tan(step / 4);
  const anchors: Point[] = [];
  const tangents: Point[] = [];
  const offsets: number[] = [];

  for (let i = 0; i < segments; i++) {
    const noise = (rng.next() * 2 - 1) * 0.55 + Math.sin(i * 1.9 + (spec.seed ?? 0)) * 0.45;
    offsets.push(noise * wobble);
  }

  for (let i = 0; i < segments; i++) {
    const t = i * step;
    const base = ellipsePoint(center.x, center.y, rx, ry, rot, t);
    // Push along the local outward direction.
    const outward = { x: base.x - center.x, y: base.y - center.y };
    const len = Math.hypot(outward.x, outward.y) || 1;
    anchors.push({
      x: base.x + (outward.x / len) * offsets[i],
      y: base.y + (outward.y / len) * offsets[i]
    });
    tangents.push(ellipseTangent(rx, ry, rot, t));
  }

  const segs: Segment[] = [];
  for (let i = 0; i < segments; i++) {
    const j = (i + 1) % segments;
    const handleJitterA = 1 + (rng.next() * 2 - 1) * (wobble ? 0.06 : 0);
    const handleJitterB = 1 + (rng.next() * 2 - 1) * (wobble ? 0.06 : 0);
    segs.push({
      p0: anchors[i],
      c1: {
        x: anchors[i].x + tangents[i].x * kappa * handleJitterA,
        y: anchors[i].y + tangents[i].y * kappa * handleJitterA
      },
      c2: {
        x: anchors[j].x - tangents[j].x * kappa * handleJitterB,
        y: anchors[j].y - tangents[j].y * kappa * handleJitterB
      },
      p3: anchors[j]
    });
  }

  // Arc-length table.
  const samples: Point[] = [];
  const cumulative: number[] = [0];
  let total = 0;
  let prev = segs[0].p0;
  samples.push(prev);
  for (const seg of segs) {
    for (let k = 1; k <= SAMPLES_PER_SEGMENT; k++) {
      const pt = cubicAt(seg.p0, seg.c1, seg.c2, seg.p3, k / SAMPLES_PER_SEGMENT);
      total += Math.hypot(pt.x - prev.x, pt.y - prev.y);
      cumulative.push(total);
      samples.push(pt);
      prev = pt;
    }
  }

  // Closest sample to the target = start progress.
  let bestIndex = 0;
  let bestDist = Infinity;
  for (let i = 0; i < samples.length; i++) {
    const d = Math.hypot(samples[i].x - through.x, samples[i].y - through.y);
    if (d < bestDist) {
      bestDist = d;
      bestIndex = i;
    }
  }

  const startProgress = cumulative[bestIndex] / total;
  const start = samples[bestIndex];

  const pointAt = (progress: number): Point => {
    const p = ((progress % 1) + 1) % 1;
    const target = p * total;
    let lo = 0;
    let hi = cumulative.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumulative[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const i = Math.max(1, lo);
    const span = cumulative[i] - cumulative[i - 1] || 1;
    const f = (target - cumulative[i - 1]) / span;
    return {
      x: samples[i - 1].x + (samples[i].x - samples[i - 1].x) * f,
      y: samples[i - 1].y + (samples[i].y - samples[i - 1].y) * f
    };
  };

  const d =
    `M${round(segs[0].p0.x)} ${round(segs[0].p0.y)}` +
    segs
      .map(
        (s) =>
          `C${round(s.c1.x)} ${round(s.c1.y)} ${round(s.c2.x)} ${round(s.c2.y)} ${round(s.p3.x)} ${round(s.p3.y)}`
      )
      .join("") +
    "Z";

  return {
    id: spec.id,
    d,
    center,
    rx,
    ry,
    rotation: spec.rotation,
    length: total,
    startProgress,
    start,
    pointAt
  };
}
