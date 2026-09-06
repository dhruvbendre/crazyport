import { createContext, useContext } from "react";
import type { PlanetConfig, PlanetId } from "../../data/planets";
import type { SceneLayout } from "../../data/sceneLayouts";
import type { ResolvedScene } from "../../data/orbitPaths";

export type SceneContextValue = {
  layout: SceneLayout;
  scene: ResolvedScene;
  reducedMotion: boolean;
  /** Rendered CSS px per scene unit. */
  unitScale: number;
  /** True on touch layouts: every world label stays visible (no hover). */
  persistentLabels: boolean;
  debug: boolean;
  onPlanetHover: (id: PlanetId, active: boolean) => void;
  onPlanetFocus: (id: PlanetId, active: boolean) => void;
  /** A touch press: a short self-clearing version of the hover reaction. */
  onPlanetTap: (id: PlanetId) => void;
  /** The moment of a click: the active marks lift outward once. */
  onPlanetBurst: (id: PlanetId) => void;
  navigateToPlanet: (planet: PlanetConfig) => void;
};

export const SceneContext = createContext<SceneContextValue | null>(null);

export function useScene(): SceneContextValue {
  const value = useContext(SceneContext);
  if (!value) throw new Error("useScene must be used inside SolarSystemScene");
  return value;
}
