import { useMemo } from "react";
import type { CelestialArtProps } from "./CelestialArtProps";
import { band, hatch, pressure, roughDisc, rngFor, scribble, type Mark } from "./crayon";
import { Marks } from "./CrayonMarks";
import { useArtId } from "./useArtId";

/**
 * Neptune. viewBox 0 0 220 220, centre (110, 110), radius 90.
 * Deep blue body, five broad curved bands, faint violet / cyan cross-strokes.
 * Calmer and darker than Uranus.
 */
const CX = 110;
const CY = 110;
const R = 90;

function buildBands() {
  const rng = rngFor(1001);
  const colors = ["#146c9d", "#247fb2", "#3699c9", "#146c9d", "#247fb2"];
  return colors.map((fill, i) => {
    const t = (i + 0.5) / colors.length;
    return {
      d: band(CX, CY - R * 0.8 + t * R * 1.6 + rng.range(-5, 5), R + 6, rng.range(10, 22), 1010 + i, 0.45),
      fill,
      opacity: rng.range(0.45, 0.7)
    };
  });
}

function buildMarks() {
  const broad = hatch({
    cx: CX, cy: CY, r: R, angle: 6, count: 14, seed: 1002,
    colors: ["#247fb2", "#3699c9", "#146c9d"],
    width: [5, 10], opacity: [0.2, 0.38], length: [0.5, 1.05], bend: 0.09
  });
  const cross = hatch({
    cx: CX, cy: CY, r: R, angle: 38, count: 10, seed: 1003,
    colors: ["#5b6fc9", "#57c2eb"],
    width: [2.5, 5], opacity: [0.12, 0.22], length: [0.4, 0.9], bend: 0.06
  });
  const lights = pressure({
    cx: CX, cy: CY, r: R, seed: 1004, color: "#7cc4ea", count: 8, angle: 8,
    region: { x: [-0.85, 0.1], y: [-0.85, 0.1] }, width: [2.5, 5], opacity: [0.25, 0.42]
  });
  const shade = pressure({
    cx: CX, cy: CY, r: R, seed: 1005, color: "#0e4f78", count: 8, angle: 4,
    region: { x: [0.15, 0.85], y: [0.3, 0.85] }, width: [2.5, 5], opacity: [0.3, 0.45]
  });
  const fine: Mark[] = [
    scribble({ cx: CX, cy: CY, r: R, seed: 1006, color: "#5b6fc9", width: 1.5, opacity: 0.2, legs: 12, angle: 35, spread: 0.35, at: [0.3, -0.35] })
  ];
  return { broad, cross, lights, shade, fine };
}

export function NeptuneArt({ className }: CelestialArtProps) {
  const id = useArtId("neptune");
  const disc = useMemo(() => roughDisc(CX, CY, R, 1000, 18, 0.016), []);
  const bands = useMemo(buildBands, []);
  const marks = useMemo(buildMarks, []);
  const clip = `url(#${id}-clip)`;

  return (
    <svg viewBox="0 0 220 220" width={220} height={220} className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={disc} />
        </clipPath>
      </defs>
      <path d={disc} fill="#1889c0" />
      <g clipPath={clip}>
        {bands.map((b, i) => (
          <path key={i} d={b.d} fill={b.fill} opacity={b.opacity.toFixed(2)} />
        ))}
      </g>
      <Marks marks={marks.broad} clipPath={clip} />
      <Marks marks={marks.cross} clipPath={clip} />
      <Marks marks={marks.fine} clipPath={clip} />
      <Marks marks={marks.shade} clipPath={clip} />
      <Marks marks={marks.lights} clipPath={clip} />
      <path d={disc} fill="url(#crayon-tooth)" opacity="0.4" />
      <path d={disc} fill="none" stroke="#0e4f78" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}
