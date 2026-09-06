import { createRng } from "./seededRandom";
import { round, TAU } from "./math";

/**
 * A hand-drawn circle: a closed cubic path whose anchors wobble by a small
 * fraction of the radius. Used for focus rings and small decorative marks.
 */
export function roughCirclePath(r: number, seed = 1, points = 14, wobble = 0.05): string {
  const rng = createRng(seed);
  const step = TAU / points;
  const kappa = (4 / 3) * Math.tan(step / 4);
  const pts: { x: number; y: number; tx: number; ty: number }[] = [];
  for (let i = 0; i < points; i++) {
    const a = i * step;
    const rr = r * (1 + (rng.next() * 2 - 1) * wobble);
    pts.push({
      x: Math.cos(a) * rr,
      y: Math.sin(a) * rr,
      tx: -Math.sin(a) * rr * kappa,
      ty: Math.cos(a) * rr * kappa
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
