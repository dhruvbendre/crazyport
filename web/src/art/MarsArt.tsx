import { useMemo } from "react";
import type { CelestialArtProps } from "./CelestialArtProps";
import { hatch, pressure, roughDisc, scribble, type Mark } from "./crayon";
import { Marks } from "./CrayonMarks";
import { useArtId } from "./useArtId";

/**
 * Mars. viewBox 0 0 160 160, centre (80, 80), radius 66.
 * Red-orange body with broad diagonal strokes and five rough crater marks.
 */
const CX = 80;
const CY = 80;
const R = 66;

const CRATERS: { x: number; y: number; r: number; seed: number }[] = [
  { x: 50, y: 50, r: 9, seed: 1101 },
  { x: 112, y: 110, r: 7, seed: 1102 },
  { x: 118, y: 58, r: 5, seed: 1103 },
  { x: 44, y: 108, r: 5.5, seed: 1104 },
  { x: 92, y: 132, r: 4, seed: 1105 }
];

function buildMarks() {
  const broad = hatch({
    cx: CX, cy: CY, r: R, angle: -38, count: 14, seed: 1106,
    colors: ["#d95b43", "#a7352e", "#e17654", "#c74436"],
    width: [5, 11], opacity: [0.22, 0.42], length: [0.5, 1.05], bend: 0.07
  });
  const lights = pressure({
    cx: CX, cy: CY, r: R, seed: 1107, color: "#f0a084", count: 8, angle: -38,
    region: { x: [-0.85, 0.15], y: [-0.85, 0.1] }, width: [2.4, 4.5], opacity: [0.3, 0.5]
  });
  const shade = pressure({
    cx: CX, cy: CY, r: R, seed: 1108, color: "#8a2a24", count: 7, angle: -34,
    region: { x: [0.15, 0.85], y: [0.25, 0.85] }, width: [2.4, 4.5], opacity: [0.25, 0.4]
  });
  const fine: Mark[] = [
    scribble({ cx: CX, cy: CY, r: R, seed: 1109, color: "#a7352e", width: 1.4, opacity: 0.25, legs: 10, angle: -40, spread: 0.35, at: [0.3, 0.3] })
  ];
  return { broad, lights, shade, fine };
}

export function MarsArt({ className }: CelestialArtProps) {
  const id = useArtId("mars");
  const disc = useMemo(() => roughDisc(CX, CY, R, 1100, 16, 0.02), []);
  const marks = useMemo(buildMarks, []);
  const craters = useMemo(
    () => CRATERS.map((c) => ({ outer: roughDisc(c.x, c.y, c.r, c.seed, 8, 0.16), inner: roughDisc(c.x + c.r * 0.15, c.y + c.r * 0.2, c.r * 0.55, c.seed + 1, 7, 0.2) })),
    []
  );
  const clip = `url(#${id}-clip)`;

  return (
    <svg viewBox="0 0 160 160" width={160} height={160} className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={disc} />
        </clipPath>
      </defs>
      <path d={disc} fill="#c74436" />
      <Marks marks={marks.broad} clipPath={clip} />
      <Marks marks={marks.fine} clipPath={clip} />
      <g clipPath={clip}>
        {craters.map((c, i) => (
          <g key={i}>
            <path d={c.outer} fill="#a7352e" opacity="0.85" />
            <path d={c.inner} fill="#8a2a24" opacity="0.6" />
          </g>
        ))}
      </g>
      <Marks marks={marks.shade} clipPath={clip} />
      <Marks marks={marks.lights} clipPath={clip} />
      <path d={disc} fill="url(#crayon-tooth)" opacity="0.4" />
      <path d={disc} fill="none" stroke="#8a2a24" strokeWidth="1.3" opacity="0.4" />
    </svg>
  );
}
