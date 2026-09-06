import { useCallback, useMemo, type MouseEvent, type ReactNode } from "react";
import type { PlanetConfig } from "../../data/planets";
import { PLANET_ART } from "../../art/PlanetArtRegistry";
import { ArtFrame } from "./ArtFrame";
import { ChalkOutline } from "./ChalkOutline";
import { PlanetHoverDoodles } from "./PlanetHoverDoodles";
import { useScene } from "./SceneContext";
import { roughCirclePath } from "../../utils/roughShapes";
import { round } from "../../utils/math";

type Props = {
  planet: PlanetConfig;
  /** Extra nodes that travel with the planet (the satellite rides with Verdance). */
  children?: ReactNode;
};

/**
 * One navigable planet.
 *
 *   <g data-orbit-wrapper>        MotionPath translation (GSAP)
 *     <a>                         semantic link + hit target + focus ring
 *       <PlanetHoverDoodles/>     marks that escape from *behind* the body on hover
 *       <g data-hover-wrapper>    interaction scale / route transition
 *         <g data-cursor-wrapper> pointer lean
 *           <g data-micro-wrapper> tiny upright wobble / hover lean
 *             <g data-reaction-wrapper> hover pulse / proximity breath
 *               <ArtFrame/>       the artwork, centred on the origin
 *         <ChalkOutline/>         the chalk perimeter, scales with the body
 *
 * No two wrappers animate the same transform, so nothing ever conflicts.
 * The hover label lives in the PlanetLabels layer above every planet.
 */
export function PlanetNode({ planet, children }: Props) {
  const { layout, scene, unitScale, debug, onPlanetHover, onPlanetFocus, onPlanetTap, onPlanetBurst, navigateToPlanet } = useScene();
  const placement = layout.planets[planet.id];
  const orbit = scene.orbits[planet.id];
  const art = PLANET_ART[planet.id];

  const artScale = placement.radius / art.bodyRadius;

  // Hit target: never smaller than the layout's minimum in CSS px.
  const minUnits = layout.minHitPx / 2 / Math.max(unitScale, 0.0001);
  const hitRadius = Math.max(placement.radius + 10, minUnits);

  const focusOuter = useMemo(() => roughCirclePath(hitRadius + 3, planet.orbitDuration, 16, 0.04), [hitRadius, planet.orbitDuration]);
  const focusInner = useMemo(() => roughCirclePath(hitRadius - 3, planet.orbitDuration + 3, 16, 0.05), [hitRadius, planet.orbitDuration]);

  const onClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      // Let modifier clicks open in a new tab like a normal link.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      onPlanetBurst(planet.id);
      navigateToPlanet(planet);
    },
    [navigateToPlanet, onPlanetBurst, planet]
  );

  return (
    <g
      data-orbit-wrapper={planet.id}
      data-dimmable
      transform={`translate(${round(orbit.start.x)} ${round(orbit.start.y)})`}
    >
      {children}
      <a
        href={planet.route}
        className="planet-link"
        aria-label={planet.ariaLabel}
        data-planet={planet.id}
        onClick={onClick}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") onPlanetHover(planet.id, true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") onPlanetHover(planet.id, false);
        }}
        onPointerDown={(e) => {
          // Touch has no hover: the press itself is the reaction, the click still navigates.
          if (e.pointerType === "touch") onPlanetTap(planet.id);
        }}
        onFocus={() => onPlanetFocus(planet.id, true)}
        onBlur={() => onPlanetFocus(planet.id, false)}
      >
        <title>{`${planet.catalog} · ${planet.name} · ${planet.section}`}</title>
        <circle className={debug ? "planet-hit debug-hit" : "planet-hit"} r={round(hitRadius)} />
        <path className="planet-focus" d={focusOuter} />
        <path className="planet-focus planet-focus--inner" d={focusInner} />
        <PlanetHoverDoodles planet={planet} radius={placement.radius} />
        <g data-hover-wrapper>
          <g data-cursor-wrapper>
            <g data-micro-wrapper>
              <g data-reaction-wrapper>
                <ArtFrame art={art} scale={artScale} />
              </g>
            </g>
          </g>
          <ChalkOutline radius={placement.radius} seed={planet.orbitDuration * 31 + 7} />
        </g>
      </a>
      {debug && (
        <text x={-hitRadius} y={-hitRadius - 6} fill="#ff4fa3" fontSize="11" fontFamily="monospace">
          {planet.id} p={orbit.startProgress.toFixed(3)} z={planet.zIndex}
        </text>
      )}
    </g>
  );
}
