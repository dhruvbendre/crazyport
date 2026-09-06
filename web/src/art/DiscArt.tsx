import { useMemo } from "react";
import type { CelestialArtProps } from "./CelestialArtProps";
import { hatch, pressure, roughDisc, roughEllipse, scribble, type Mark } from "./crayon";
import { Marks } from "./CrayonMarks";
import { useArtId } from "./useArtId";

/**
 * A crayon record: the disc-shaped body first drawn for the pluto slot
 * (Sonara). viewBox 0 0 200 200, centre (100, 100), radius 82. A coloured
 * crayon body cut with the grooves of a record: five uneven concentric rings
 * in a darker tone, a pressure flare upper-left like a spotlight, and a small
 * two-colour burst scribble for the beat.
 *
 * Sonara's own planet uses the pink palette with seed 1900; the top-song
 * discs on its page reuse the same drawing with other palettes and seeds so
 * every disc keeps the same organic shape family without being a copy.
 */
export const CX = 100;
export const CY = 100;
export const R = 82;

export type DiscPalette = {
  /** Flat body colour. */
  body: string;
  /** Broad hatch strokes, light to dark. */
  hatch: [string, string, string, string];
  /** Record grooves and the outer rim. */
  groove: string;
  /** Spotlight flare upper-left. */
  light: string;
  /** Lower-right shading. */
  shade: string;
  /** The beat: a dark scribble and a bright one on top. */
  beat: [string, string];
};

export type DiscHue = "pink" | "cyan" | "lavender" | "teal" | "yellow";

export const DISC_PALETTES: Record<DiscHue, DiscPalette> = {
  pink: {
    body: "#ff5fbc",
    hatch: ["#ff6fc4", "#e94ba8", "#ff8ad0", "#d13a92"],
    groove: "#b2237a",
    light: "#fff133",
    shade: "#8a1a5e",
    beat: ["#18120f", "#00c8a0"]
  },
  cyan: {
    body: "#00c8e8",
    hatch: ["#1fd3f0", "#00a9c9", "#5ee0f5", "#0091ad"],
    groove: "#006f88",
    light: "#fff133",
    shade: "#004d60",
    beat: ["#18120f", "#ff5fbc"]
  },
  lavender: {
    body: "#cdb1ff",
    hatch: ["#d7c0ff", "#b592f7", "#e2d1ff", "#9d75e8"],
    groove: "#7a55c4",
    light: "#fff133",
    shade: "#5a3aa0",
    beat: ["#18120f", "#00c8e8"]
  },
  teal: {
    body: "#00b398",
    hatch: ["#1cc2a8", "#00967f", "#4fd2bb", "#007f6b"],
    groove: "#00614f",
    light: "#fff133",
    shade: "#004236",
    beat: ["#18120f", "#ff69b8"]
  },
  yellow: {
    body: "#ffd23f",
    hatch: ["#ffdb5c", "#f2b81e", "#ffe680", "#d99f0a"],
    groove: "#b77d00",
    light: "#fffbe9",
    shade: "#8a5d00",
    beat: ["#18120f", "#0076cf"]
  }
};

export function buildDiscMarks(p: DiscPalette, seed: number) {
  const broad = hatch({
    cx: CX, cy: CY, r: R, angle: -32, count: 16, seed: seed + 1,
    colors: [...p.hatch],
    width: [5, 12], opacity: [0.22, 0.4], length: [0.5, 1.05], bend: 0.07
  });
  const grooves: Mark[] = [];
  for (let i = 0; i < 5; i++) {
    const rr = R * (0.3 + i * 0.145);
    grooves.push({ d: roughEllipse(CX + 2, CY + 1, rr, rr * 0.96, -14, seed + 10 + i, 0.03), stroke: p.groove, width: 2.2 + (i % 2) * 1.1, opacity: 0.32 });
  }
  const lights = pressure({
    cx: CX, cy: CY, r: R, seed: seed + 20, color: p.light, count: 9, angle: -40,
    region: { x: [-0.9, 0.05], y: [-0.9, 0] }, width: [2.6, 5], opacity: [0.28, 0.5]
  });
  const shade = pressure({
    cx: CX, cy: CY, r: R, seed: seed + 21, color: p.shade, count: 8, angle: -30,
    region: { x: [0.1, 0.9], y: [0.2, 0.9] }, width: [2.6, 5], opacity: [0.25, 0.42]
  });
  const fine: Mark[] = [
    scribble({ cx: CX, cy: CY, r: R, seed: seed + 30, color: p.beat[0], width: 1.6, opacity: 0.4, legs: 12, angle: 20, spread: 0.22, at: [0.42, -0.2] }),
    scribble({ cx: CX, cy: CY, r: R, seed: seed + 31, color: p.beat[1], width: 1.2, opacity: 0.35, legs: 8, angle: -60, spread: 0.16, at: [0.44, -0.18] })
  ];
  return { broad, grooves, lights, shade, fine };
}

type Props = CelestialArtProps & {
  palette: DiscPalette;
  /** Seed for the disc edge and every mark; each disc gets its own. */
  seed: number;
  /** Id prefix for the clip path (one per art slot / disc). */
  name: string;
};

export function DiscArt({ className, palette, seed, name }: Props) {
  const id = useArtId(name);
  const disc = useMemo(() => roughDisc(CX, CY, R, seed, 18, 0.02), [seed]);
  const marks = useMemo(() => buildDiscMarks(palette, seed), [palette, seed]);
  const clip = `url(#${id}-clip)`;

  return (
    <svg viewBox="0 0 200 200" width={200} height={200} className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={disc} />
        </clipPath>
      </defs>
      <path d={disc} fill={palette.body} />
      <Marks marks={marks.broad} clipPath={clip} />
      <Marks marks={marks.grooves} clipPath={clip} />
      <Marks marks={marks.shade} clipPath={clip} />
      <Marks marks={marks.lights} clipPath={clip} />
      <Marks marks={marks.fine} clipPath={clip} />
      <path d={disc} fill="url(#crayon-tooth)" opacity="0.4" />
      <path d={disc} fill="none" stroke={palette.shade} strokeWidth="1.3" opacity="0.42" />
    </svg>
  );
}
