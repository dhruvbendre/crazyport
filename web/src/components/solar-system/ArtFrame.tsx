import type { ArtMeta } from "../../art/CelestialArtProps";

type Props = {
  art: ArtMeta;
  /** Scene units per artwork unit. */
  scale: number;
  state?: "default" | "hover" | "focus";
};

/**
 * Places any piece of artwork so that its body centre sits exactly on the
 * origin of the parent group. The artwork's own viewBox is preserved, so the
 * final crayon SVGs drop in without changing any positioning code.
 */
export function ArtFrame({ art, scale, state = "default" }: Props) {
  const { Component, viewBox, center } = art;
  const w = viewBox.width * scale;
  const h = viewBox.height * scale;
  return (
    <svg
      x={-center.x * scale}
      y={-center.y * scale}
      width={w}
      height={h}
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      overflow="visible"
      className="planet-art"
      aria-hidden="true"
    >
      <Component state={state} />
    </svg>
  );
}
