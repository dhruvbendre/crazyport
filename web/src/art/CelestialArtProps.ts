import type { ComponentType } from "react";

export type CelestialArtProps = {
  className?: string;
  /** Interaction state, used only for tiny expression differences. */
  state?: "default" | "hover" | "focus";
  /** Optional accessible title. Art is decorative by default. */
  title?: string;
};

/**
 * Metadata the scene needs to place any piece of artwork without knowing how
 * it is drawn: its viewBox, where the planet body sits inside it, its body
 * radius and the maximum extents (rings, corona) from that body centre.
 */
export type ArtMeta = {
  Component: ComponentType<CelestialArtProps>;
  viewBox: { width: number; height: number };
  /** Centre of the planet body inside the viewBox. */
  center: { x: number; y: number };
  /** Body radius inside the viewBox (rings excluded). */
  bodyRadius: number;
  /** Extents from the body centre, including rings / corona. */
  extent: { left: number; right: number; top: number; bottom: number };
};
