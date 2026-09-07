import { useCallback, type RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { planetHref, type PlanetConfig } from "../data/planets";
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
 * An external world (Mnemora) leaves the site for its own app once the
 * exit animation has covered the stage.
 */
export function usePlanetNavigation({ svgRef, reducedMotion, onBeforeLeave }: Options) {
  const navigate = useNavigate();

  return useCallback(
    (planet: PlanetConfig) => {
      if (isTransitionLocked()) return;
      const href = planetHref(planet);
      const go = () => {
        if (/^https?:/.test(href)) window.location.assign(href);
        else navigate(href);
      };
      const svg = svgRef.current;
      if (!svg) {
        go();
        return;
      }
      onBeforeLeave?.(planet);
      void playPlanetExit({
        svg,
        planet,
        reducedMotion,
        onCovered: go
      });
    },
    [navigate, onBeforeLeave, reducedMotion, svgRef]
  );
}
