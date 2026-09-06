import type { PlanetId } from "../data/planets";

/**
 * What the UFO is paying attention to.
 *
 * The solar-system scene and the cursor UFO live in different parts of the
 * tree (the UFO is mounted by App so it survives route changes), so the scene
 * publishes its planet-zone state here and the UFO reads it: the lean toward
 * the planet and the slower chase derive from this one record. No React state is involved; everything runs on the GSAP ticker.
 */
export type AttentionZone = "near" | "active";

export type Attention = {
  planetId: PlanetId | null;
  zone: AttentionZone | null;
  /** The planet's centre on screen, in CSS px. */
  center: { x: number; y: number } | null;
  /** The planet's visible radius on screen, in CSS px. */
  radius: number;
};

const EMPTY: Attention = { planetId: null, zone: null, center: null, radius: 0 };

let current: Attention = EMPTY;
const listeners = new Set<(a: Attention) => void>();

export function getAttention(): Attention {
  return current;
}

export function setAttention(next: Partial<Attention>): void {
  current = { ...current, ...next };
  listeners.forEach((fn) => fn(current));
}

export function clearAttention(): void {
  setAttention(EMPTY);
}

export function subscribeAttention(fn: (a: Attention) => void): () => void {
  listeners.add(fn);
  fn(current);
  return () => {
    listeners.delete(fn);
  };
}
