import { useMemo } from "react";
import type { CelestialArtProps } from "./CelestialArtProps";
import { CLOUD, hatch, pressure, roughDisc, rngFor, scribble, type Mark } from "./crayon";
import { Marks } from "./CrayonMarks";
import { useArtId } from "./useArtId";

/**
 * Earth. viewBox 0 0 220 220, centre (110, 110), radius 92.
 * Blue diagonal crayon ocean, six abstract green continents with
 * cross-hatching, cream cloud strokes, and a content face in clear water.
 */
const CX = 110;
const CY = 110;
const R = 92;

type Land = { d: string; transform: string; fill: string; hatchMarks: Mark[] };

const CONTINENTS: { x: number; y: number; r: number; sx: number; sy: number; rot: number; seed: number }[] = [
  { x: 62, y: 62, r: 26, sx: 1.25, sy: 0.85, rot: -20, seed: 801 },
  { x: 160, y: 66, r: 20, sx: 1.1, sy: 1.3, rot: 25, seed: 802 },
  { x: 58, y: 152, r: 18, sx: 0.9, sy: 1.25, rot: 10, seed: 803 },
  { x: 156, y: 158, r: 24, sx: 1.3, sy: 0.85, rot: -12, seed: 804 },
  { x: 118, y: 34, r: 12, sx: 1.4, sy: 0.7, rot: 8, seed: 805 },
  { x: 108, y: 188, r: 11, sx: 1.5, sy: 0.6, rot: -6, seed: 806 }
];

function buildLand(): Land[] {
  return CONTINENTS.map((c) => ({
    d: roughDisc(0, 0, c.r, c.seed, 9, 0.24),
    transform: `translate(${c.x} ${c.y}) rotate(${c.rot}) scale(${c.sx} ${c.sy})`,
    fill: c.seed % 2 ? "#5d9c62" : "#6eae69",
    hatchMarks: hatch({
      cx: 0, cy: 0, r: c.r, angle: 50, count: 5, seed: c.seed + 20,
      colors: ["#4f8755", "#6eae69"], width: [1.6, 3], opacity: [0.35, 0.6], length: [0.5, 1], bend: 0.1
    }).concat(
      hatch({
        cx: 0, cy: 0, r: c.r, angle: -35, count: 3, seed: c.seed + 40,
        colors: ["#4f8755"], width: [1.4, 2.4], opacity: [0.3, 0.5], length: [0.4, 0.9], bend: 0.1
      })
    )
  }));
}

function buildMarks() {
  const ocean = hatch({
    cx: CX, cy: CY, r: R, angle: -42, count: 20, seed: 810,
    colors: ["#3d8fdc", "#2367b0", "#2e7ccb", "#3d8fdc"],
    width: [5, 11], opacity: [0.25, 0.45], length: [0.55, 1.1], bend: 0.07
  });
  const lights = pressure({
    cx: CX, cy: CY, r: R, seed: 811, color: "#7fb9ef", count: 10, angle: -42,
    region: { x: [-0.85, 0.1], y: [-0.85, 0.15] }, width: [2.5, 5], opacity: [0.3, 0.5]
  });
  const shade = pressure({
    cx: CX, cy: CY, r: R, seed: 812, color: "#1b5290", count: 8, angle: -38,
    region: { x: [0.2, 0.9], y: [0.3, 0.9] }, width: [2.5, 5], opacity: [0.25, 0.4]
  });
  const fine: Mark[] = [
    scribble({ cx: CX, cy: CY, r: R, seed: 813, color: "#2367b0", width: 1.6, opacity: 0.28, legs: 12, angle: -40, spread: 0.4, at: [0.4, -0.2] }),
    scribble({ cx: CX, cy: CY, r: R, seed: 814, color: "#3d8fdc", width: 1.6, opacity: 0.25, legs: 10, angle: -45, spread: 0.35, at: [-0.45, 0.4] })
  ];
  const rng = rngFor(815);
  const clouds: Mark[] = [];
  const spots: [number, number, number][] = [
    [82, 82, 22],
    [148, 118, 18],
    [96, 158, 20],
    [140, 46, 14],
    [46, 118, 12]
  ];
  for (const [x, y, w] of spots) {
    const tilt = rng.range(-0.25, 0.25);
    clouds.push({
      d: `M${x - w / 2} ${y + tilt * w}q${w * 0.3} ${-w * 0.22} ${w * 0.55} ${-w * 0.05}t${w * 0.45} ${w * 0.08}`,
      stroke: CLOUD,
      width: rng.range(4, 6),
      opacity: rng.range(0.7, 0.9)
    });
  }
  return { ocean, lights, shade, fine, clouds };
}

export function EarthArt({ className }: CelestialArtProps) {
  const id = useArtId("earth");
  const disc = useMemo(() => roughDisc(CX, CY, R, 800, 20, 0.017), []);
  const land = useMemo(buildLand, []);
  const marks = useMemo(buildMarks, []);
  const clip = `url(#${id}-clip)`;

  return (
    <svg viewBox="0 0 220 220" width={220} height={220} className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={disc} />
        </clipPath>
      </defs>
      <path d={disc} fill="#2e7ccb" />
      <Marks marks={marks.ocean} clipPath={clip} />
      <Marks marks={marks.fine} clipPath={clip} />
      <g clipPath={clip}>
        {land.map((l, i) => (
          <g key={i} transform={l.transform}>
            <path d={l.d} fill={l.fill} />
            <Marks marks={l.hatchMarks} />
          </g>
        ))}
      </g>
      <Marks marks={marks.shade} clipPath={clip} />
      <Marks marks={marks.lights} clipPath={clip} />
      <g data-clouds>
        <Marks marks={marks.clouds} clipPath={clip} />
      </g>
      <path d={disc} fill="url(#crayon-tooth)" opacity="0.45" />
      <path d={disc} fill="none" stroke="#1b5290" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}
