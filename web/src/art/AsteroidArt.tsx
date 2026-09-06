import { createRng } from "../utils/seededRandom";
import { round } from "../utils/math";

/**
 * Ten reusable asteroid variants, instanced by the belt with <use>.
 * Each is an irregular 7–11 point pebble with one to three internal marks.
 */
export type AsteroidVariant = { body: string; marks?: string };

function pebble(seed: number): AsteroidVariant {
  const rng = createRng(seed);
  const n = rng.int(7, 11);
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rng.range(-0.15, 0.15);
    const r = 10 * rng.range(0.72, 1.12) * (rng.chance(0.5) ? 1 : rng.range(0.85, 1));
    pts.push(`${round(Math.cos(a) * r)} ${round(Math.sin(a) * r)}`);
  }
  const marksCount = rng.int(1, 3);
  const marks: string[] = [];
  for (let i = 0; i < marksCount; i++) {
    const x = rng.range(-5, 4);
    const y = rng.range(-5, 4);
    marks.push(`M${round(x)} ${round(y)} l${round(rng.range(1.5, 4))} ${round(rng.range(-2, 2))}`);
  }
  return { body: `M${pts.join("L")}Z`, marks: marks.join(" ") };
}

export const asteroidVariants: AsteroidVariant[] = Array.from({ length: 10 }, (_, i) => pebble(1600 + i * 7));
