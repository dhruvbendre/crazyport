import { useMemo } from "react";
import type { CelestialArtProps } from "./CelestialArtProps";
import { hatch, pressure, roughDisc } from "./crayon";
import { Marks } from "./CrayonMarks";
import { useArtId } from "./useArtId";

/**
 * Mercury. viewBox 0 0 120 120, centre (60, 60), radius 50.
 * Tiny uneven grey-green body, four small crater marks, a shy sleepy face
 * with strokes heavy enough to stay legible at 45–55 px.
 */
const CX = 60;
const CY = 60;
const R = 50;

const CRATERS = [
  { x: 40, y: 42, r: 6, seed: 1301 },
  { x: 78, y: 80, r: 5, seed: 1302 },
  { x: 82, y: 40, r: 3.5, seed: 1303 },
  { x: 36, y: 84, r: 3.5, seed: 1304 }
];

function buildMarks() {
  const broad = hatch({
    cx: CX, cy: CY, r: R, angle: -45, count: 12, seed: 1305,
    colors: ["#9a9d91", "#61675f", "#bbb9a9", "#7d847a"],
    width: [4, 9], opacity: [0.24, 0.45], length: [0.5, 1.05], bend: 0.07
  });
  const lights = pressure({
    cx: CX, cy: CY, r: R, seed: 1306, color: "#d6d3c4", count: 7, angle: -45,
    region: { x: [-0.85, 0.1], y: [-0.85, 0.1] }, width: [2, 4], opacity: [0.35, 0.55]
  });
  const shade = pressure({
    cx: CX, cy: CY, r: R, seed: 1307, color: "#4c524a", count: 6, angle: -40,
    region: { x: [0.15, 0.85], y: [0.25, 0.85] }, width: [2, 4], opacity: [0.28, 0.45]
  });
  return { broad, lights, shade };
}

export function MercuryArt({ className }: CelestialArtProps) {
  const id = useArtId("mercury");
  const disc = useMemo(() => roughDisc(CX, CY, R, 1300, 14, 0.024), []);
  const marks = useMemo(buildMarks, []);
  const craters = useMemo(() => CRATERS.map((c) => roughDisc(c.x, c.y, c.r, c.seed, 7, 0.18)), []);
  const clip = `url(#${id}-clip)`;

  return (
    <svg viewBox="0 0 120 120" width={120} height={120} className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={disc} />
        </clipPath>
      </defs>
      <path d={disc} fill="#7d847a" />
      <Marks marks={marks.broad} clipPath={clip} />
      <g clipPath={clip}>
        {craters.map((d, i) => (
          <path key={i} d={d} fill="#61675f" opacity="0.85" />
        ))}
      </g>
      <Marks marks={marks.shade} clipPath={clip} />
      <Marks marks={marks.lights} clipPath={clip} />
      <path d={disc} fill="url(#crayon-tooth)" opacity="0.4" />
      <path d={disc} fill="none" stroke="#4c524a" strokeWidth="1.2" opacity="0.45" />
    </svg>
  );
}
