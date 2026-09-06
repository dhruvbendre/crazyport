import { useMemo } from "react";
import type { CelestialArtProps } from "./CelestialArtProps";
import { band, hatch, pressure, roughDisc, roughEllipse, rngFor, scribble, type Mark } from "./crayon";
import { Marks } from "./CrayonMarks";
import { useArtId } from "./useArtId";

/**
 * Jupiter. viewBox 0 0 300 300, centre (150, 150), radius 128.
 * Ten hand-drawn bands of uneven thickness that bend imperfectly, layered
 * wax strokes, a quiet great red spot and a broad cheerful face.
 */
const CX = 150;
const CY = 150;
const R = 128;

type Band = { d: string; fill: string; opacity: number };

function buildBands(): Band[] {
  const rng = rngFor(601);
  const colors = ["#e7682c", "#f5a03b", "#d34c2d", "#f1b052", "#e7682c", "#f5a03b", "#d34c2d", "#f1b052", "#e7682c", "#f5a03b"];
  const bands: Band[] = [];
  const n = 10;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const y = CY - R * 0.9 + t * R * 1.8 + rng.range(-4, 4);
    const thickness = rng.range(9, 24);
    bands.push({ d: band(CX, y, R + 10, thickness, 610 + i, 0.35), fill: colors[i], opacity: rng.range(0.7, 0.92) });
  }
  return bands;
}

function buildMarks() {
  const broad = hatch({
    cx: CX, cy: CY, r: R, angle: 4, count: 18, seed: 602,
    colors: ["#f5a03b", "#f1b052", "#e7682c"],
    width: [5, 11], opacity: [0.2, 0.4], length: [0.6, 1.1], bend: 0.05
  });
  const lights = pressure({
    cx: CX, cy: CY, r: R, seed: 603, color: "#ffd08a", count: 12, angle: 2,
    region: { x: [-0.85, 0.3], y: [-0.85, 0.2] }, width: [3, 6], opacity: [0.3, 0.5]
  });
  const shade = pressure({
    cx: CX, cy: CY, r: R, seed: 604, color: "#b53f24", count: 9, angle: 6,
    region: { x: [0.1, 0.85], y: [0.2, 0.85] }, width: [3, 6], opacity: [0.2, 0.4]
  });
  const fine: Mark[] = [
    scribble({ cx: CX, cy: CY, r: R, seed: 605, color: "#d34c2d", width: 1.8, opacity: 0.22, legs: 16, angle: 5, spread: 0.55, at: [-0.1, -0.45] }),
    scribble({ cx: CX, cy: CY, r: R, seed: 606, color: "#f1b052", width: 1.8, opacity: 0.25, legs: 14, angle: -4, spread: 0.5, at: [0.15, 0.5] })
  ];
  return { broad, lights, shade, fine };
}

export function JupiterArt({ className }: CelestialArtProps) {
  const id = useArtId("jupiter");
  const disc = useMemo(() => roughDisc(CX, CY, R, 600, 20, 0.016), []);
  const bands = useMemo(buildBands, []);
  const marks = useMemo(buildMarks, []);
  const spot = useMemo(() => roughEllipse(198, 194, 22, 12, -8, 607, 0.08), []);
  const spotInner = useMemo(() => roughEllipse(198, 194, 13, 6.5, -8, 608, 0.1), []);
  const clip = `url(#${id}-clip)`;

  return (
    <svg viewBox="0 0 300 300" width={300} height={300} className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={disc} />
        </clipPath>
      </defs>
      <path d={disc} fill="#f1852d" />
      <g clipPath={clip}>
        {bands.map((b, i) => (
          <path key={i} d={b.d} fill={b.fill} opacity={b.opacity.toFixed(2)} />
        ))}
        <path d={spot} fill="#d34c2d" opacity="0.85" />
        <path d={spotInner} fill="#b53f24" opacity="0.6" />
      </g>
      <Marks marks={marks.broad} clipPath={clip} />
      <Marks marks={marks.fine} clipPath={clip} />
      <Marks marks={marks.shade} clipPath={clip} />
      <Marks marks={marks.lights} clipPath={clip} />
      <path d={disc} fill="url(#crayon-tooth)" opacity="0.45" />
      <path d={disc} fill="none" stroke="#b53f24" strokeWidth="1.6" opacity="0.35" />
    </svg>
  );
}
