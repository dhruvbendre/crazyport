import { planets } from "../../data/planets";
import type { ResolvedScene } from "../../data/orbitPaths";
import { OrbitPath } from "./OrbitPath";

export function OrbitLayer({ scene }: { scene: ResolvedScene }) {
  return (
    <g data-layer="orbits" data-dimmable filter="url(#crayon-roughness)">
      {planets.map((p) => (
        <OrbitPath key={p.id} orbit={scene.orbits[p.id]} planetId={p.id} />
      ))}
    </g>
  );
}
