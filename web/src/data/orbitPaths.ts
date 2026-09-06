import { planets, type PlanetId } from "./planets";
import type { SceneLayout } from "./sceneLayouts";
import { resolveOrbit, type ResolvedOrbit } from "../utils/orbitGeometry";

export type ResolvedScene = {
  layout: SceneLayout;
  orbits: Record<PlanetId, ResolvedOrbit>;
};

const cache = new Map<string, ResolvedScene>();

/**
 * Resolve every orbit path for a layout. Pure and memoised: the same layout
 * always yields the same eight unique path strings and start progresses.
 */
export function resolveScene(layout: SceneLayout): ResolvedScene {
  const cached = cache.get(layout.id);
  if (cached) return cached;

  const orbits = {} as Record<PlanetId, ResolvedOrbit>;
  for (const planet of planets) {
    const placement = layout.planets[planet.id];
    orbits[planet.id] = resolveOrbit({
      id: planet.orbitId,
      through: placement.through,
      ...placement.orbit
    });
  }

  const scene = { layout, orbits };
  cache.set(layout.id, scene);
  return scene;
}
