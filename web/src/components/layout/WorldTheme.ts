import type { CSSProperties } from "react";
import type { PlanetConfig, PlanetId, WorldGlyph, WorldTexture } from "../../data/planets";

/**
 * Everything an interior page needs to dress itself in a world's identity.
 * PlanetConfig satisfies this structurally; Signal (no planet) builds one.
 */
export type WorldTheme = {
  name: string;
  slug: string;
  catalog: string;
  descriptor: string;
  section: string;
  intro: string;
  accent: string;
  accentSoft: string;
  field: string;
  glyph: WorldGlyph;
  texture: WorldTexture;
  /** Which crayon body rises as the horizon; none for Signal. */
  horizon?: PlanetId;
  /** Seed for the page's chalk marks so each world's rules differ. */
  seed: number;
};

export function themeForPlanet(planet: PlanetConfig): WorldTheme {
  return {
    name: planet.name,
    slug: planet.slug,
    catalog: planet.catalog,
    descriptor: planet.descriptor,
    section: planet.section,
    intro: planet.intro,
    accent: planet.accent,
    accentSoft: planet.accentSoft,
    field: planet.field,
    glyph: planet.glyph,
    texture: planet.texture,
    horizon: planet.id,
    seed: planet.orbitDuration * 13
  };
}

export const SIGNAL_THEME: WorldTheme = {
  name: "Signal",
  slug: "signal",
  catalog: "·",
  descriptor: "a message sent out into the dark",
  section: "Contact",
  intro: "Not a world to explore. A short message, sent out of the system toward a person who can read it.",
  accent: "#f1f1e8",
  accentSoft: "rgba(241, 241, 232, 0.12)",
  field: "#070707",
  glyph: "signal",
  texture: "dust",
  seed: 909
};

/** CSS custom properties that scope the world's colours to its page. */
export function themeStyle(theme: WorldTheme): CSSProperties {
  return {
    "--planet-accent": theme.accent,
    "--planet-accent-soft": theme.accentSoft,
    "--planet-field": theme.field
  } as CSSProperties;
}
