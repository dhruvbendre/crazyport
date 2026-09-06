import { planets } from "../../data/planets";
import { PlanetNode } from "./PlanetNode";
import { Satellite } from "./Satellite";

/**
 * Maps the central planet configuration into interactive nodes. DOM order is
 * the z-order inside the planet layer, so planets are sorted by zIndex.
 * Tab order follows the same sequence (Mercury first would be more "correct"
 * astronomically, but visual depth order keeps focus travel predictable).
 */
export function PlanetNavigator() {
  const ordered = [...planets].sort((a, b) => a.zIndex - b.zIndex);
  return (
    <g data-layer="planets" role="list" aria-label="Portfolio destinations">
      {ordered.map((planet) => (
        <PlanetNode key={planet.id} planet={planet}>
          {planet.id === "earth" ? <Satellite /> : null}
        </PlanetNode>
      ))}
    </g>
  );
}
