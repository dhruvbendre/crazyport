import type { PlanetId } from "../data/planets";
import type { ArtMeta } from "./CelestialArtProps";
import { SunArt } from "./SunArt";
import { JupiterArt } from "./JupiterArt";
import { SaturnArt } from "./SaturnArt";
import { EarthArt } from "./EarthArt";
import { UranusArt } from "./UranusArt";
import { NeptuneArt } from "./NeptuneArt";
import { MarsArt } from "./MarsArt";
import { VenusArt } from "./VenusArt";
import { MercuryArt } from "./MercuryArt";
import { PlutoArt } from "./PlutoArt";
import { SatelliteArt } from "./SatelliteArt";
import { MeteorArt } from "./MeteorArt";

/**
 * Single source of truth for which artwork renders each celestial body.
 * Replace an entry here to swap a placeholder for final art without touching
 * the motion or navigation code.
 */
export const PLANET_ART: Record<PlanetId, ArtMeta> = {
  mercury: {
    Component: MercuryArt,
    viewBox: { width: 120, height: 120 },
    center: { x: 60, y: 60 },
    bodyRadius: 50,
    extent: { left: 52, right: 52, top: 52, bottom: 52 }
  },
  venus: {
    Component: VenusArt,
    viewBox: { width: 150, height: 150 },
    center: { x: 75, y: 75 },
    bodyRadius: 62,
    extent: { left: 64, right: 64, top: 64, bottom: 64 }
  },
  earth: {
    Component: EarthArt,
    viewBox: { width: 220, height: 220 },
    center: { x: 110, y: 110 },
    bodyRadius: 92,
    extent: { left: 94, right: 94, top: 94, bottom: 94 }
  },
  mars: {
    Component: MarsArt,
    viewBox: { width: 160, height: 160 },
    center: { x: 80, y: 80 },
    bodyRadius: 66,
    extent: { left: 68, right: 68, top: 68, bottom: 68 }
  },
  jupiter: {
    Component: JupiterArt,
    viewBox: { width: 300, height: 300 },
    center: { x: 150, y: 150 },
    bodyRadius: 128,
    extent: { left: 132, right: 132, top: 132, bottom: 132 }
  },
  saturn: {
    Component: SaturnArt,
    viewBox: { width: 360, height: 260 },
    center: { x: 180, y: 130 },
    bodyRadius: 72,
    extent: { left: 178, right: 178, top: 92, bottom: 92 }
  },
  uranus: {
    Component: UranusArt,
    viewBox: { width: 260, height: 260 },
    center: { x: 130, y: 130 },
    bodyRadius: 88,
    extent: { left: 92, right: 92, top: 128, bottom: 128 }
  },
  neptune: {
    Component: NeptuneArt,
    viewBox: { width: 220, height: 220 },
    center: { x: 110, y: 110 },
    bodyRadius: 90,
    extent: { left: 92, right: 92, top: 92, bottom: 92 }
  },
  pluto: {
    Component: PlutoArt,
    viewBox: { width: 200, height: 200 },
    center: { x: 100, y: 100 },
    bodyRadius: 82,
    extent: { left: 84, right: 84, top: 84, bottom: 84 }
  }
};

export const SUN_ART: ArtMeta = {
  Component: SunArt,
  viewBox: { width: 700, height: 850 },
  center: { x: 330, y: 425 },
  bodyRadius: 280,
  extent: { left: 330, right: 345, top: 345, bottom: 345 }
};

export const SATELLITE_ART: ArtMeta = {
  Component: SatelliteArt,
  viewBox: { width: 180, height: 130 },
  center: { x: 90, y: 65 },
  bodyRadius: 30,
  extent: { left: 88, right: 88, top: 55, bottom: 45 }
};

export const METEOR_ART: ArtMeta = {
  Component: MeteorArt,
  viewBox: { width: 220, height: 90 },
  center: { x: 190, y: 46 },
  bodyRadius: 22,
  extent: { left: 190, right: 30, top: 40, bottom: 40 }
};
