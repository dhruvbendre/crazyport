/**
 * Planet hover interactions: one entry per world.
 *
 * The scene renders every hover reaction from this table, so nothing about a
 * planet's personality is hardcoded in a component.
 *
 *   doodles      the small hand-drawn marks that escape from behind the body
 *                while it is hovered (art/HoverDoodleGlyph.tsx draws them)
 *
 * Doodle geometry is expressed in fractions of the planet's body radius so the
 * same composition fits a 24-unit Ferrin and a 100-unit Magnara.
 *
 * Final artwork is coming later. Any doodle can point at an SVG under
 * public/festival/<slug>/hover/ through `asset`; until then the code-drawn
 * glyph of the same `kind` is used. See HOVER_ASSET_ROOT below.
 */
import type { PlanetId } from "./planets";

export type HoverEffect = "music" | "tools" | "growth" | "trail" | "proof" | "story" | "archive" | "signal" | "play";

/** The code-drawn glyph vocabulary (art/HoverDoodleGlyph.tsx). */
export type DoodleKind =
  | "note"
  | "note-double"
  | "wave"
  | "vinyl"
  | "sparkle"
  | "spark"
  | "bracket"
  | "gear"
  | "wrench"
  | "sprout"
  | "leaf"
  | "ember"
  | "trail"
  | "medal"
  | "star"
  | "page"
  | "path"
  | "question"
  | "bubble"
  | "ring"
  | "signal-arc"
  | "envelope"
  | "plane"
  | "spiral";

export type DoodleTint = "chalk" | "accent" | "warm";

export type DoodleSpec = {
  kind: DoodleKind;
  /** Where on the perimeter it emerges, in degrees: 0 = right, -90 = straight up. */
  angle: number;
  /** How far it drifts once it has escaped, in body radii (x right, y down). */
  drift: { x: number; y: number };
  /** Rotation at emergence and at rest, in degrees. */
  rotate: [number, number];
  /** Size relative to the default doodle size for the body (1 = default). */
  size?: number;
  /** Delay after the hover begins, in ms. */
  delay: number;
  /** Keeps a gentle motion loop after the entrance (at most three per planet). */
  ambient?: boolean;
  /** Shows faintly while the pointer is merely near the body. */
  ambientNear?: boolean;
  tint?: DoodleTint;
  /** Final asset, relative to HOVER_ASSET_ROOT/<slug>/hover/. Replaces the code glyph. */
  asset?: string;
};

export type PlanetInteraction = {
  category: string;
  hoverEffect: HoverEffect;
  /** Sonara pulses to an implied beat; other worlds only breathe once. */
  pulse?: "beat" | "breath";
  doodles: DoodleSpec[];
};

/** Where per-world hover artwork will live once it exists. */
export const HOVER_ASSET_ROOT = "/festival";

export function hoverAssetUrl(slug: string, file: string): string {
  return `${HOVER_ASSET_ROOT}/${slug}/hover/${file}`;
}

/** The pointer counts as "near" a world inside this many hit radii. */
export const PROXIMITY_FACTOR = 1.45;

export const planetInteractions: Record<PlanetId, PlanetInteraction> = {
  /* ---- Sonara: music. The richest reaction: sound escaping the record. ---- */
  pluto: {
    category: "Music",
    hoverEffect: "music",
    pulse: "beat",
    doodles: [
      { kind: "note", angle: -125, drift: { x: -0.22, y: -0.62 }, rotate: [-8, 4], delay: 100, ambient: true, ambientNear: true, tint: "chalk" },
      { kind: "note-double", angle: -55, drift: { x: 0.34, y: -0.7 }, rotate: [10, -3], delay: 170, ambient: true, tint: "accent", size: 1.1 },
      { kind: "wave", angle: 8, drift: { x: 0.5, y: -0.05 }, rotate: [0, 0], delay: 240, ambient: true, tint: "chalk", size: 1.25 },
      { kind: "note", angle: -85, drift: { x: 0.02, y: -0.9 }, rotate: [6, -6], delay: 300, tint: "warm", size: 0.85 },
      { kind: "note", angle: 160, drift: { x: -0.55, y: -0.22 }, rotate: [-12, 2], delay: 360, tint: "chalk", size: 0.8 },
      { kind: "vinyl", angle: 35, drift: { x: 0.42, y: 0.32 }, rotate: [0, 140], delay: 420, ambient: true, tint: "accent", size: 0.9 },
      { kind: "sparkle", angle: -30, drift: { x: 0.36, y: -0.4 }, rotate: [0, 20], delay: 480, tint: "warm", size: 0.6 },
      { kind: "sparkle", angle: -150, drift: { x: -0.42, y: -0.36 }, rotate: [0, -25], delay: 560, tint: "chalk", size: 0.5 }
    ]
  },

  /* ---- Ferrin: skills & tools. --------------------------------------------- */
  mercury: {
    category: "Skills & Tools",
    hoverEffect: "tools",
    pulse: "breath",
    doodles: [
      { kind: "bracket", angle: -120, drift: { x: -0.3, y: -0.7 }, rotate: [-10, 0], delay: 110, ambient: true, ambientNear: true, tint: "chalk" },
      { kind: "wrench", angle: -50, drift: { x: 0.4, y: -0.66 }, rotate: [30, 12], delay: 190, tint: "accent" },
      { kind: "gear", angle: 20, drift: { x: 0.62, y: -0.1 }, rotate: [0, 90], delay: 270, ambient: true, tint: "chalk", size: 0.9 },
      { kind: "spark", angle: -85, drift: { x: 0.08, y: -0.95 }, rotate: [0, 30], delay: 340, tint: "warm", size: 0.6 },
      { kind: "spark", angle: 165, drift: { x: -0.6, y: -0.15 }, rotate: [0, -30], delay: 420, tint: "warm", size: 0.5 }
    ]
  },

  /* ---- Verdance: projects & research. -------------------------------------- */
  earth: {
    category: "Projects & Research",
    hoverEffect: "growth",
    pulse: "breath",
    doodles: [
      { kind: "sprout", angle: -100, drift: { x: -0.08, y: -0.62 }, rotate: [-6, 0], delay: 100, ambient: true, ambientNear: true, tint: "chalk" },
      { kind: "leaf", angle: -40, drift: { x: 0.4, y: -0.55 }, rotate: [20, -4], delay: 190, ambient: true, tint: "accent", size: 0.8 },
      { kind: "bracket", angle: 15, drift: { x: 0.55, y: -0.08 }, rotate: [0, 0], delay: 270, tint: "chalk", size: 0.8 },
      { kind: "leaf", angle: 195, drift: { x: -0.55, y: -0.18 }, rotate: [-30, -12], delay: 340, tint: "accent", size: 0.7 },
      { kind: "sparkle", angle: -140, drift: { x: -0.4, y: -0.42 }, rotate: [0, 15], delay: 430, tint: "warm", size: 0.5 }
    ]
  },

  /* ---- Emberline: experience. ---------------------------------------------- */
  venus: {
    category: "Experience",
    hoverEffect: "trail",
    pulse: "breath",
    doodles: [
      { kind: "ember", angle: -110, drift: { x: -0.2, y: -0.7 }, rotate: [0, 10], delay: 100, ambient: true, ambientNear: true, tint: "warm" },
      { kind: "ember", angle: -70, drift: { x: 0.2, y: -0.85 }, rotate: [0, -10], delay: 180, ambient: true, tint: "accent", size: 0.7 },
      { kind: "trail", angle: 10, drift: { x: 0.6, y: -0.15 }, rotate: [0, 0], delay: 260, tint: "chalk", size: 1.2 },
      { kind: "ember", angle: 160, drift: { x: -0.55, y: -0.3 }, rotate: [0, 15], delay: 340, tint: "warm", size: 0.55 },
      { kind: "spark", angle: -30, drift: { x: 0.45, y: -0.45 }, rotate: [0, 20], delay: 420, tint: "warm", size: 0.5 }
    ]
  },

  /* ---- Theoria: certificates & achievements. ------------------------------- */
  mars: {
    category: "Certificates & Achievements",
    hoverEffect: "proof",
    pulse: "breath",
    doodles: [
      { kind: "star", angle: -115, drift: { x: -0.25, y: -0.68 }, rotate: [-15, 5], delay: 100, ambient: true, ambientNear: true, tint: "warm" },
      { kind: "medal", angle: -45, drift: { x: 0.42, y: -0.62 }, rotate: [12, 0], delay: 190, tint: "accent", size: 1.05 },
      { kind: "page", angle: 15, drift: { x: 0.6, y: -0.1 }, rotate: [8, -4], delay: 270, ambient: true, tint: "chalk", size: 0.9 },
      { kind: "star", angle: 170, drift: { x: -0.6, y: -0.2 }, rotate: [0, 20], delay: 350, tint: "warm", size: 0.55 },
      { kind: "sparkle", angle: -80, drift: { x: 0.05, y: -0.95 }, rotate: [0, 30], delay: 440, tint: "chalk", size: 0.5 }
    ]
  },

  /* ---- Magnara: my story. -------------------------------------------------- */
  jupiter: {
    category: "My Story",
    hoverEffect: "story",
    pulse: "breath",
    doodles: [
      // Signal sits just up-left of Magnara, so nothing is thrown that way.
      { kind: "page", angle: -75, drift: { x: -0.1, y: -0.55 }, rotate: [-10, -3], delay: 100, ambient: true, ambientNear: true, tint: "chalk" },
      { kind: "star", angle: -40, drift: { x: 0.3, y: -0.5 }, rotate: [0, 25], delay: 190, tint: "warm", size: 0.6 },
      { kind: "path", angle: 15, drift: { x: 0.45, y: -0.12 }, rotate: [0, 0], delay: 270, ambient: true, tint: "chalk", size: 1.1 },
      { kind: "page", angle: 190, drift: { x: -0.5, y: 0.05 }, rotate: [8, 4], delay: 350, tint: "accent", size: 0.7 },
      { kind: "sparkle", angle: -10, drift: { x: 0.4, y: -0.3 }, rotate: [0, 15], delay: 440, tint: "warm", size: 0.45 }
    ]
  },

  /* ---- Mnemora: ask me (the archive that talks back). ---------------------- */
  neptune: {
    category: "Ask Me",
    hoverEffect: "archive",
    pulse: "breath",
    doodles: [
      { kind: "question", angle: -110, drift: { x: -0.22, y: -0.7 }, rotate: [-10, 4], delay: 100, ambient: true, ambientNear: true, tint: "chalk", size: 1.1 },
      { kind: "bubble", angle: -45, drift: { x: 0.45, y: -0.6 }, rotate: [6, -2], delay: 190, ambient: true, tint: "accent" },
      { kind: "ring", angle: 15, drift: { x: 0.55, y: -0.05 }, rotate: [0, 40], delay: 270, ambient: true, tint: "chalk", size: 0.9 },
      { kind: "question", angle: 165, drift: { x: -0.58, y: -0.2 }, rotate: [12, 6], delay: 350, tint: "accent", size: 0.7 },
      { kind: "spark", angle: -75, drift: { x: 0.1, y: -0.95 }, rotate: [0, 0], delay: 440, tint: "chalk", size: 0.4 }
    ]
  },

  /* ---- Signal: about & contact. -------------------------------------------- */
  saturn: {
    category: "About & Contact",
    hoverEffect: "signal",
    pulse: "breath",
    doodles: [
      { kind: "signal-arc", angle: -110, drift: { x: -0.25, y: -0.72 }, rotate: [-20, -10], delay: 100, ambient: true, ambientNear: true, tint: "chalk" },
      { kind: "envelope", angle: -50, drift: { x: 0.4, y: -0.75 }, rotate: [10, -4], delay: 190, ambient: true, tint: "accent" },
      { kind: "plane", angle: 5, drift: { x: 0.7, y: -0.35 }, rotate: [-20, -28], delay: 270, tint: "chalk", size: 1.05 },
      { kind: "signal-arc", angle: 170, drift: { x: -0.6, y: -0.3 }, rotate: [160, 170], delay: 350, tint: "accent", size: 0.7 },
      { kind: "spark", angle: -80, drift: { x: 0.05, y: -1.05 }, rotate: [0, 20], delay: 440, tint: "warm", size: 0.5 }
    ]
  },

  /* ---- Whimsel: the playground. -------------------------------------------- */
  uranus: {
    category: "Playground",
    hoverEffect: "play",
    pulse: "breath",
    doodles: [
      { kind: "spiral", angle: -115, drift: { x: -0.25, y: -0.68 }, rotate: [0, 60], delay: 100, ambient: true, ambientNear: true, tint: "chalk" },
      { kind: "star", angle: -50, drift: { x: 0.4, y: -0.65 }, rotate: [0, 35], delay: 190, ambient: true, tint: "accent", size: 0.7 },
      { kind: "ring", angle: 15, drift: { x: 0.58, y: -0.08 }, rotate: [0, -50], delay: 270, tint: "chalk", size: 0.9 },
      { kind: "sparkle", angle: 165, drift: { x: -0.6, y: -0.2 }, rotate: [0, 20], delay: 350, tint: "warm", size: 0.55 },
      { kind: "spark", angle: -80, drift: { x: 0.05, y: -0.98 }, rotate: [0, 0], delay: 440, tint: "chalk", size: 0.45 }
    ]
  }
};
