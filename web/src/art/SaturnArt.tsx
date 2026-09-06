import { useMemo } from "react";
import type { CelestialArtProps } from "./CelestialArtProps";
import { hatch, pressure, ringHalf, roughDisc, scribble, type Mark } from "./crayon";
import { Marks } from "./CrayonMarks";
import { useArtId } from "./useArtId";

/**
 * Saturn. viewBox 0 0 360 260, body centre (180, 130), radius 72.
 * Rings are four broad hand-drawn strokes that pass behind the body on the
 * upper half and in front on the lower half (two separate groups).
 */
const CX = 180;
const CY = 130;
const R = 72;
const TILT = -18;

type Ring = { rx: number; ry: number; color: string; width: number; opacity: number; seed: number };

const RINGS: Ring[] = [
  { rx: 174, ry: 46, color: "#9c4c3a", width: 10, opacity: 0.92, seed: 701 },
  { rx: 160, ry: 40, color: "#b15a43", width: 8, opacity: 0.85, seed: 702 },
  { rx: 148, ry: 35, color: "#d47758", width: 5, opacity: 0.8, seed: 703 },
  { rx: 182, ry: 50, color: "#774234", width: 3.5, opacity: 0.7, seed: 704 }
];

function buildMarks() {
  const broad = hatch({
    cx: CX, cy: CY, r: R, angle: -32, count: 14, seed: 705,
    colors: ["#ef8d6b", "#cc5f48", "#f1a078", "#e6785a"],
    width: [5, 10], opacity: [0.22, 0.42], length: [0.55, 1.05], bend: 0.08
  });
  const lights = pressure({
    cx: CX, cy: CY, r: R, seed: 706, color: "#f8bd9c", count: 9, angle: -32,
    region: { x: [-0.8, 0.2], y: [-0.85, 0.1] }, width: [2.5, 5], opacity: [0.35, 0.55]
  });
  const shade = pressure({
    cx: CX, cy: CY, r: R, seed: 707, color: "#b04e3a", count: 7, angle: -28,
    region: { x: [0.2, 0.85], y: [0.3, 0.85] }, width: [2.5, 5], opacity: [0.25, 0.4]
  });
  const fine: Mark[] = [
    scribble({ cx: CX, cy: CY, r: R, seed: 708, color: "#cc5f48", width: 1.6, opacity: 0.25, legs: 12, angle: -30, spread: 0.5, at: [0.2, 0.35] }),
    scribble({ cx: CX, cy: CY, r: R, seed: 709, color: "#f1a078", width: 1.6, opacity: 0.25, legs: 10, angle: -36, spread: 0.4, at: [-0.3, -0.35] })
  ];
  return { broad, lights, shade, fine };
}

export function SaturnArt({ className }: CelestialArtProps) {
  const id = useArtId("saturn");
  const disc = useMemo(() => roughDisc(CX, CY, R, 700, 18, 0.018), []);
  const marks = useMemo(buildMarks, []);
  const back = useMemo(() => RINGS.map((r) => ({ ...r, d: ringHalf(CX, CY, r.rx, r.ry, TILT, r.seed, "back") })), []);
  const front = useMemo(() => RINGS.map((r) => ({ ...r, d: ringHalf(CX, CY, r.rx, r.ry, TILT, r.seed + 10, "front") })), []);
  const clip = `url(#${id}-clip)`;

  return (
    <svg viewBox="0 0 360 260" width={360} height={260} className={className} aria-hidden="true">
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

      <path d={disc} fill="#e6785a" />
      <Marks marks={marks.broad} clipPath={clip} />
      <Marks marks={marks.fine} clipPath={clip} />
      <Marks marks={marks.shade} clipPath={clip} />
      <Marks marks={marks.lights} clipPath={clip} />
      <path d={disc} fill="url(#crayon-tooth)" opacity="0.45" />
      <path d={disc} fill="none" stroke="#b04e3a" strokeWidth="1.4" opacity="0.35" />

      <g data-ring="front" fill="none" strokeLinecap="round">
        {front.map((r, i) => (
          <path key={i} d={r.d} stroke={r.color} strokeWidth={r.width} opacity={r.opacity} />
        ))}
      </g>
    </svg>
  );
}
