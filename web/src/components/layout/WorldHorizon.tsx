import { PLANET_ART } from "../../art/PlanetArtRegistry";
import type { PlanetId } from "../../data/planets";
import { ArtFrame } from "../solar-system/ArtFrame";
import { ChalkOutline } from "../solar-system/ChalkOutline";

const W = 1000;
const H = 420;
const RADIUS = 480;
const TOP = 48;

/**
 * The world's own crayon body, risen as a horizon at the foot of the page.
 * The same artwork the visitor clicked on the home scene, now large enough
 * that only its upper arc is visible, with its chalk perimeter intact.
 */
export function WorldHorizon({ planetId }: { planetId: PlanetId }) {
  const art = PLANET_ART[planetId];
  const scale = RADIUS / art.bodyRadius;
  const cy = TOP + RADIUS;
  return (
    <div className="world__horizon" aria-hidden="true">
      <svg className="world__horizon-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMin slice">
        <g transform={`translate(${W / 2} ${cy})`}>
          <ArtFrame art={art} scale={scale} />
          {/* Slightly inside the usual offset so the chalk hugs the horizon. */}
          <ChalkOutline radius={RADIUS * 0.965} seed={41} weight={3} points={40} dust={22} />
        </g>
      </svg>
    </div>
  );
}
