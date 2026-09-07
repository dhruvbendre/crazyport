import { memo } from "react";
import { planets } from "../../data/planets";
import type { ResolvedScene } from "../../data/orbitPaths";
import { OrbitPath } from "./OrbitPath";

function OrbitLayerInner({ scene }: { scene: ResolvedScene }) {
  return (
    <g data-layer="orbits" data-dimmable filter="url(#crayon-roughness)">
      {planets.map((p) => (
        <OrbitPath key={p.id} orbit={scene.orbits[p.id]} planetId={p.id} />
      ))}
    </g>
  );
}

/**
 * Static once built for a layout: memoised so the scene's own state changes
 * (hint, interactivity, unit scale) never re-diff these hundreds of nodes.
 */
export const OrbitLayer = memo(OrbitLayerInner);
