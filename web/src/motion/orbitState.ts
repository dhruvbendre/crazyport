import type { PlanetId } from "../data/planets";

/**
 * Module-level memory of the universe between route changes so returning from
 * an inner page continues the orbits instead of restarting the poster.
 */
type OrbitSnapshot = {
  progress: Partial<Record<PlanetId, number>>;
  layoutId: string;
  savedAt: number;
};

let snapshot: OrbitSnapshot | null = null;
let returning = false;

const MAX_AGE_MS = 30 * 60 * 1000;

export function saveOrbitSnapshot(progress: Partial<Record<PlanetId, number>>, layoutId: string): void {
  snapshot = { progress, layoutId, savedAt: Date.now() };
}

export function loadOrbitSnapshot(layoutId: string): Partial<Record<PlanetId, number>> | null {
  if (!snapshot) return null;
  if (snapshot.layoutId !== layoutId) return null;
  if (Date.now() - snapshot.savedAt > MAX_AGE_MS) return null;
  return snapshot.progress;
}

export function hasVisitedUniverse(): boolean {
  return snapshot !== null;
}

/** Set right before navigating back to "/" so the scene plays a short return intro. */
export function markReturning(): void {
  returning = true;
}

export function consumeReturning(): boolean {
  const value = returning;
  returning = false;
  return value;
}
