import { useMemo } from "react";
import type { CelestialArtProps } from "./CelestialArtProps";
import { hatch, pressure, ringHalf, roughDisc, scribble, type Mark } from "./crayon";
import { Marks } from "./CrayonMarks";
import { useArtId } from "./useArtId";

/**
 * Uranus. viewBox 0 0 260 260, centre (130, 130), radius 88.
 * Turquoise diagonal crayon body with a thin bright blue-cyan ring tilted
 * steeply, drawn as a crayon line rather than clean geometry.
 */
const CX = 130;
const CY = 130;
const R = 88;
const TILT = 68;

const RINGS = [
  { rx: 132, ry: 24, color: "#2ba9df", width: 5, opacity: 0.9, seed: 901 },
  { rx: 124, ry: 20, color: "#57c2eb", width: 2.6, opacity: 0.8, seed: 902 }
];

function buildMarks() {
  const broad = hatch({
    cx: CX, cy: CY, r: R, angle: -50, count: 18, seed: 903,
    colors: ["#5ec7ac", "#2b9b88", "#76d2b8", "#42b69d"],
    width: [5, 11], opacity: [0.22, 0.42], length: [0.5, 1.05], bend: 0.07
  });
  const lights = pressure({
    cx: CX, cy: CY, r: R, seed: 904, color: "#a6e6d2", count: 10, angle: -50,
    region: { x: [-0.85, 0.15], y: [-0.85, 0.1] }, width: [2.5, 5], opacity: [0.3, 0.5]
  });
  const shade = pressure({
    cx: CX, cy: CY, r: R, seed: 905, color: "#1f7f6e", count: 8, angle: -46,
    region: { x: [0.15, 0.85], y: [0.25, 0.85] }, width: [2.5, 5], opacity: [0.25, 0.4]
  });
  const fine: Mark[] = [
    scribble({ cx: CX, cy: CY, r: R, seed: 906, color: "#2b9b88", width: 1.6, opacity: 0.25, legs: 12, angle: -48, spread: 0.4, at: [0.25, 0.4] }),
    scribble({ cx: CX, cy: CY, r: R, seed: 907, color: "#3a9bd6", width: 1.5, opacity: 0.2, legs: 10, angle: -55, spread: 0.32, at: [-0.4, -0.3] })
  ];
  return { broad, lights, shade, fine };
}

export function UranusArt({ className }: CelestialArtProps) {
  const id = useArtId("uranus");
  const disc = useMemo(() => roughDisc(CX, CY, R, 900, 18, 0.018), []);
  const marks = useMemo(buildMarks, []);
  const back = useMemo(() => RINGS.map((r) => ({ ...r, d: ringHalf(CX, CY, r.rx, r.ry, TILT, r.seed, "back", 0.035) })), []);
  const front = useMemo(() => RINGS.map((r) => ({ ...r, d: ringHalf(CX, CY, r.rx, r.ry, TILT, r.seed + 10, "front", 0.035) })), []);
  const clip = `url(#${id}-clip)`;

  return (
    <svg viewBox="0 0 260 260" width={260} height={260} className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={disc} />
        </clipPath>
      </defs>
      <g data-ring="back" fill="none" strokeLinecap="round">
        {back.map((r, i) => (
          <path key={i} d={r.d} stroke={r.color} strokeWidth={r.width} opacity={r.opacity} />
        ))}
      </g>
      <path d={disc} fill="#42b69d" />
      <Marks marks={marks.broad} clipPath={clip} />
      <Marks marks={marks.fine} clipPath={clip} />
      <Marks marks={marks.shade} clipPath={clip} />
      <Marks marks={marks.lights} clipPath={clip} />
      <path d={disc} fill="url(#crayon-tooth)" opacity="0.45" />
      <path d={disc} fill="none" stroke="#1f7f6e" strokeWidth="1.4" opacity="0.35" />
      <g data-ring="front" fill="none" strokeLinecap="round">
        {front.map((r, i) => (
          <path key={i} d={r.d} stroke={r.color} strokeWidth={r.width} opacity={r.opacity} />
        ))}
      </g>
    </svg>
  );
}
