import { useMemo } from "react";
import type { CelestialArtProps } from "./CelestialArtProps";
import { hatch, pressure, roughDisc } from "./crayon";
import { Marks } from "./CrayonMarks";
import { useArtId } from "./useArtId";

/**
 * Venus. viewBox 0 0 150 150, centre (75, 75), radius 62.
 * Orange / burnt sienna body with six curved horizontal strokes and a soft
 * lighter upper-left edge. One dot eye, one relaxed wink, a small cheek mark.
 * Deliberately not a small Jupiter: fewer, longer, curved strokes.
 */
const CX = 75;
const CY = 75;
const R = 62;

function buildMarks() {
  const curves = hatch({
    cx: CX, cy: CY, r: R, angle: 4, count: 7, seed: 1201,
    colors: ["#e28a3d", "#b85d2c", "#f0a44e", "#b85d2c", "#e28a3d"],
    width: [5, 9], opacity: [0.35, 0.6], length: [0.6, 1.1], bend: 0.28
  });
  const soft = hatch({
    cx: CX, cy: CY, r: R, angle: -30, count: 10, seed: 1202,
    colors: ["#e28a3d", "#d16f33"],
    width: [6, 12], opacity: [0.14, 0.26], length: [0.4, 0.9], bend: 0.05
  });
  const lights = pressure({
    cx: CX, cy: CY, r: R, seed: 1203, color: "#f7c98a", count: 9, angle: -32,
    region: { x: [-0.9, 0.05], y: [-0.9, 0.05] }, width: [2.4, 4.5], opacity: [0.35, 0.55]
  });
  const shade = pressure({
    cx: CX, cy: CY, r: R, seed: 1204, color: "#9c4a22", count: 6, angle: 0,
    region: { x: [0.2, 0.85], y: [0.3, 0.85] }, width: [2.4, 4.5], opacity: [0.22, 0.38]
  });
  return { curves, soft, lights, shade };
}

export function VenusArt({ className }: CelestialArtProps) {
  const id = useArtId("venus");
  const disc = useMemo(() => roughDisc(CX, CY, R, 1200, 16, 0.02), []);
  const marks = useMemo(buildMarks, []);
  const clip = `url(#${id}-clip)`;

  return (
    <svg viewBox="0 0 150 150" width={150} height={150} className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={disc} />
        </clipPath>
      </defs>
      <path d={disc} fill="#d16f33" />
      <Marks marks={marks.soft} clipPath={clip} />
      <Marks marks={marks.curves} clipPath={clip} />
      <Marks marks={marks.shade} clipPath={clip} />
      <Marks marks={marks.lights} clipPath={clip} />
      <path d={disc} fill="url(#crayon-tooth)" opacity="0.4" />
      <path d={disc} fill="none" stroke="#9c4a22" strokeWidth="1.3" opacity="0.4" />
    </svg>
  );
}
