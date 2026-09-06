/**
 * Crayon toolkit
 * ---------------------------------------------------------------------------
 * Deterministic generators for the marks every planet is built from:
 *
 *   - roughDisc     hand-adjusted silhouette (12–24 anchors, 1–2.5% wobble)
 *   - hatch         broad directional fill streaks that follow one angle
 *   - scribble      thin wandering lines with uneven spacing and opacity
 *   - pressure      short lighter marks where wax catches the paper tooth
 *   - band          wavy horizontal band with uneven thickness (Jupiter)
 *   - roughEllipse  imperfect ring paths, split into back / front halves
 *   - arc / smile   sparse charcoal face strokes with tiny irregularity
 *
 * Everything is seeded so the "same illustrator, same box of crayons"
 * consistency holds and nothing changes between renders.
 */
import { createRng, type Rng } from "../utils/seededRandom";
import { round, TAU } from "../utils/math";

export type Mark = { d: string; stroke: string; width: number; opacity: number };

const R = (v: number) => round(v, 1);

/* ---- silhouettes --------------------------------------------------------- */

export function roughDisc(cx: number, cy: number, r: number, seed: number, points = 18, wobble = 0.018): string {
  const rng = createRng(seed);
  const step = TAU / points;
  const kappa = (4 / 3) * Math.tan(step / 4);
  const pts = [];
  for (let i = 0; i < points; i++) {
    const a = i * step;
    const rr = r * (1 + (rng.next() * 2 - 1) * wobble + Math.sin(a * 3 + seed) * wobble * 0.4);
    pts.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr, tx: -Math.sin(a) * rr * kappa, ty: Math.cos(a) * rr * kappa });
  }
  let d = `M${R(pts[0].x)} ${R(pts[0].y)}`;
  for (let i = 0; i < points; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % points];
    d += `C${R(a.x + a.tx)} ${R(a.y + a.ty)} ${R(b.x - b.tx)} ${R(b.y - b.ty)} ${R(b.x)} ${R(b.y)}`;
  }
  return d + "Z";
}

export function roughEllipse(cx: number, cy: number, rx: number, ry: number, rotation: number, seed: number, wobble = 0.03): string {
  const rng = createRng(seed);
  const points = 20;
  const step = TAU / points;
  const kappa = (4 / 3) * Math.tan(step / 4);
  const rot = (rotation * Math.PI) / 180;
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const pts = [];
  for (let i = 0; i < points; i++) {
    const a = i * step;
    const w = 1 + (rng.next() * 2 - 1) * wobble;
    const ex = rx * Math.cos(a) * w;
    const ey = ry * Math.sin(a) * w;
    const dx = -rx * Math.sin(a) * kappa;
    const dy = ry * Math.cos(a) * kappa;
    pts.push({
      x: cx + ex * cos - ey * sin,
      y: cy + ex * sin + ey * cos,
      tx: dx * cos - dy * sin,
      ty: dx * sin + dy * cos
    });
  }
  let d = `M${R(pts[0].x)} ${R(pts[0].y)}`;
  for (let i = 0; i < points; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % points];
    d += `C${R(a.x + a.tx)} ${R(a.y + a.ty)} ${R(b.x - b.tx)} ${R(b.y - b.ty)} ${R(b.x)} ${R(b.y)}`;
  }
  return d + "Z";
}

/**
 * Half of a rough ellipse as an open stroke. `half` = "back" (upper arc, drawn
 * behind the body) or "front" (lower arc, drawn in front).
 */
export function ringHalf(cx: number, cy: number, rx: number, ry: number, rotation: number, seed: number, half: "back" | "front", wobble = 0.025): string {
  const rng = createRng(seed);
  const segments = 14;
  const start = half === "back" ? Math.PI : 0;
  const rot = (rotation * Math.PI) / 180;
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  let d = "";
  for (let i = 0; i <= segments; i++) {
    const a = start + (i / segments) * Math.PI;
    const w = 1 + (rng.next() * 2 - 1) * wobble;
    const ex = rx * Math.cos(a) * w;
    const ey = ry * Math.sin(a) * w;
    const x = cx + ex * cos - ey * sin;
    const y = cy + ex * sin + ey * cos;
    d += i === 0 ? `M${R(x)} ${R(y)}` : `L${R(x)} ${R(y)}`;
  }
  return d;
}

/* ---- texture marks ------------------------------------------------------- */

type HatchOptions = {
  cx: number;
  cy: number;
  r: number;
  /** Stroke angle in degrees (0 = horizontal). */
  angle: number;
  count: number;
  seed: number;
  colors: string[];
  width: [number, number];
  opacity: [number, number];
  /** Fraction of the disc diameter each stroke spans. */
  length?: [number, number];
  /** Curvature amplitude as a fraction of r. */
  bend?: number;
};

/** Broad, semi-transparent streaks following one dominant direction. */
export function hatch(o: HatchOptions): Mark[] {
  const rng = createRng(o.seed);
  const marks: Mark[] = [];
  const a = (o.angle * Math.PI) / 180;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const nx = -uy;
  const ny = ux;
  const len = o.length ?? [0.5, 1.1];
  const bend = (o.bend ?? 0.08) * o.r;
  for (let i = 0; i < o.count; i++) {
    // Offset across the disc, denser toward the middle.
    const t = (i + 0.5) / o.count - 0.5 + (rng.next() - 0.5) * 0.15;
    const off = t * 2 * o.r * 0.95;
    const halfLen = o.r * rng.range(len[0], len[1]) * Math.sqrt(Math.max(0.05, 1 - (off / o.r) ** 2));
    const shift = (rng.next() - 0.5) * o.r * 0.3;
    const sx = o.cx + nx * off - ux * halfLen + ux * shift;
    const sy = o.cy + ny * off - uy * halfLen + uy * shift;
    const ex = o.cx + nx * off + ux * halfLen + ux * shift;
    const ey = o.cy + ny * off + uy * halfLen + uy * shift;
    const b = (rng.next() - 0.5) * 2 * bend;
    const mx = (sx + ex) / 2 + nx * b;
    const my = (sy + ey) / 2 + ny * b;
    marks.push({
      d: `M${R(sx)} ${R(sy)}Q${R(mx)} ${R(my)} ${R(ex)} ${R(ey)}`,
      stroke: rng.pick(o.colors),
      width: rng.range(o.width[0], o.width[1]),
      opacity: rng.range(o.opacity[0], o.opacity[1])
    });
  }
  return marks;
}

type ScribbleOptions = {
  cx: number;
  cy: number;
  r: number;
  seed: number;
  color: string;
  width: number;
  opacity: number;
  /** Number of zig-zag legs. */
  legs: number;
  /** Direction in degrees. */
  angle: number;
  /** Region radius as a fraction of r. */
  spread?: number;
  /** Centre offset as fractions of r. */
  at?: [number, number];
};

/** A thin wandering zig-zag: the fine scribble class of marks. */
export function scribble(o: ScribbleOptions): Mark {
  const rng = createRng(o.seed);
  const a = (o.angle * Math.PI) / 180;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const nx = -uy;
  const ny = ux;
  const spread = (o.spread ?? 0.45) * o.r;
  const ox = o.cx + (o.at?.[0] ?? 0) * o.r;
  const oy = o.cy + (o.at?.[1] ?? 0) * o.r;
  let d = "";
  for (let i = 0; i <= o.legs; i++) {
    const along = (i / o.legs - 0.5) * 2 * spread;
    const across = (i % 2 === 0 ? -1 : 1) * spread * rng.range(0.25, 0.6);
    const x = ox + ux * along + nx * across + (rng.next() - 0.5) * 2;
    const y = oy + uy * along + ny * across + (rng.next() - 0.5) * 2;
    d += i === 0 ? `M${R(x)} ${R(y)}` : `L${R(x)} ${R(y)}`;
  }
  return { d, stroke: o.color, width: o.width, opacity: o.opacity };
}

type PressureOptions = {
  cx: number;
  cy: number;
  r: number;
  seed: number;
  color: string;
  count: number;
  angle: number;
  /** Region of the disc: -1..1 in x and y, as fractions of r. */
  region?: { x: [number, number]; y: [number, number] };
  width?: [number, number];
  opacity?: [number, number];
};

/** Short lighter marks: wax catching the paper grain. */
export function pressure(o: PressureOptions): Mark[] {
  const rng = createRng(o.seed);
  const a = (o.angle * Math.PI) / 180;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const region = o.region ?? { x: [-0.9, 0.9], y: [-0.9, 0.9] };
  const marks: Mark[] = [];
  for (let i = 0; i < o.count; i++) {
    const px = o.cx + rng.range(region.x[0], region.x[1]) * o.r;
    const py = o.cy + rng.range(region.y[0], region.y[1]) * o.r;
    const len = o.r * rng.range(0.08, 0.22);
    const wob = (rng.next() - 0.5) * len * 0.3;
    marks.push({
      d: `M${R(px - ux * len)} ${R(py - uy * len)}q${R(wob * -uy)} ${R(wob * ux)} ${R(ux * len * 2)} ${R(uy * len * 2)}`,
      stroke: o.color,
      width: rng.range(o.width?.[0] ?? 2, o.width?.[1] ?? 4),
      opacity: rng.range(o.opacity?.[0] ?? 0.25, o.opacity?.[1] ?? 0.5)
    });
  }
  return marks;
}

/**
 * A wavy horizontal band with uneven thickness, as a closed filled path.
 * `y` is the band centre, `thickness` its nominal height.
 */
export function band(cx: number, y: number, halfWidth: number, thickness: number, seed: number, waviness = 0.35): string {
  const rng = createRng(seed);
  const n = 7;
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = cx - halfWidth + t * halfWidth * 2;
    const wave = Math.sin(t * Math.PI * rng.range(1.2, 2.2) + seed) * thickness * waviness;
    const th = thickness * rng.range(0.7, 1.3);
    top.push(`${R(x)} ${R(y - th / 2 + wave)}`);
    bottom.unshift(`${R(x + (rng.next() - 0.5) * 6)} ${R(y + th / 2 + wave + (rng.next() - 0.5) * thickness * 0.2)}`);
  }
  return `M${top[0]}L${top.slice(1).join("L")}L${bottom.join("L")}Z`;
}

/* ---- faces ----------------------------------------------------------------- */

/** A closed-eye arc (upward curve) with a tiny hand wobble. */
export function eyeArc(x: number, y: number, w: number, seed: number, lift = 0.5): string {
  const rng = createRng(seed);
  const j = (v: number) => v + (rng.next() - 0.5) * w * 0.08;
  return `M${R(x - w / 2)} ${R(j(y))}Q${R(x)} ${R(y - w * lift)} ${R(x + w / 2)} ${R(j(y))}`;
}

/** A small smile (downward-opening curve). */
export function smile(x: number, y: number, w: number, seed: number, depth = 0.45): string {
  const rng = createRng(seed);
  const j = (v: number) => v + (rng.next() - 0.5) * w * 0.06;
  return `M${R(x - w / 2)} ${R(j(y))}Q${R(x + (rng.next() - 0.5) * w * 0.1)} ${R(y + w * depth)} ${R(x + w / 2)} ${R(j(y - w * 0.04))}`;
}

/** A dot eye as a tiny rough blob. */
export function dotEye(x: number, y: number, r: number, seed: number): string {
  return roughDisc(x, y, r, seed, 8, 0.12);
}

/** A tiny nose stroke. */
export function nose(x: number, y: number, h: number, seed: number): string {
  const rng = createRng(seed);
  return `M${R(x)} ${R(y)}q${R(h * 0.35 + rng.range(-1, 1))} ${R(h * 0.55)} ${R(-h * 0.25)} ${R(h)}`;
}

/* ---- helpers --------------------------------------------------------------- */

export function rngFor(seed: number): Rng {
  return createRng(seed);
}

export const CHARCOAL = "#2a2724";
export const CLOUD = "#f4efde";
