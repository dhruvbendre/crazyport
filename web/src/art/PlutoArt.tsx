import type { CelestialArtProps } from "./CelestialArtProps";
import { DISC_PALETTES, DiscArt } from "./DiscArt";

/**
 * Pluto slot (Sonara). viewBox 0 0 200 200, centre (100, 100), radius 82.
 * The hot-pink crayon record; the drawing itself lives in DiscArt so the
 * top-song discs on Sonara's page can share it.
 */
export function PlutoArt({ className, state }: CelestialArtProps) {
  return <DiscArt className={className} state={state} palette={DISC_PALETTES.pink} seed={1900} name="pluto" />;
}
