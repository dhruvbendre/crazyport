import { useCallback, type RefObject } from "react";
import { useNavigate } from "react-router-dom";
import type { PlanetConfig } from "../data/planets";
import { isTransitionLocked, playPlanetExit } from "../motion/routeTransitions";

type Options = {
  svgRef: RefObject<SVGSVGElement | null>;
  reducedMotion: boolean;
  onBeforeLeave?: (planet: PlanetConfig) => void;
};

/**
 * navigateToPlanet(config):
 *   lock interaction → GSAP exit → navigate → page entrance → unlock
 * Double clicks and concurrent transitions are rejected by the lock.
 */
export function usePlanetNavigation({ svgRef, reducedMotion, onBeforeLeave }: Options) {
  const navigate = useNavigate();

  return useCallback(
    (planet: PlanetConfig) => {
      if (isTransitionLocked()) return;
      const svg = svgRef.current;
      if (!svg) {
        navigate(planet.route);
        return;
      }
      onBeforeLeave?.(planet);
      void playPlanetExit({
        svg,
        planet,
        reducedMotion,
        onCovered: () => navigate(planet.route)
      });
    },
    [navigate, onBeforeLeave, reducedMotion, svgRef]
  );
}
