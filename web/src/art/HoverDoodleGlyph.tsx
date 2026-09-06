import type { DoodleKind } from "../data/planetInteractions";

/**
 * The small marks that escape from a hovered world: music notes, sprouts,
 * embers, question marks and the like. Every glyph shares a 24×24 grid, a
 * 1.9 round-capped stroke and the same slightly unsteady hand as the chalk
 * perimeters (art.md §4). No fills except tiny dots and note heads.
 *
 * These are placeholders in the illustration language. When the final asset
 * directory lands, a doodle spec can name an `asset`; this component then
 * renders that SVG in the same 24×24 box and nothing else changes.
 */
type Props = {
  kind: DoodleKind;
  /** Final artwork URL; when set it replaces the code-drawn glyph. */
  asset?: string;
};

type Glyph = { d: string; dots?: [number, number, number][]; fills?: string[] };

const GLYPHS: Record<DoodleKind, Glyph> = {
  // A single eighth note: stem with a flag, a filled slightly squashed head.
  note: {
    d: "M9.2 18.6 L9.6 5.4 Q13.4 6.2 15.6 9.6 Q14.2 8.4 9.8 8.6",
    fills: ["M9.4 18.4 m-3.6 0 a3.6 2.7 -20 1 0 7.2 0 a3.6 2.7 -20 1 0 -7.2 0"]
  },
  // Two beamed eighth notes.
  "note-double": {
    d: "M6.8 18.2 L7.1 6.4 L18.2 4.6 L18.5 15.8 M7.1 9.2 L18.2 7.4",
    fills: [
      "M7 18.2 m-3.2 0 a3.2 2.4 -18 1 0 6.4 0 a3.2 2.4 -18 1 0 -6.4 0",
      "M18.3 15.8 m-3.2 0 a3.2 2.4 -18 1 0 6.4 0 a3.2 2.4 -18 1 0 -6.4 0"
    ]
  },
  // A short sound wave: uneven bars.
  wave: {
    d: "M3.4 13.2 L3.6 10.8 M7.2 16.4 L7.4 7.6 M11 14.2 L11.2 9.6 M14.8 18 L15.1 6.2 M18.6 15 L18.8 9 M22 12.8 L22.1 11.2"
  },
  // A tiny record: a rough disc with a groove and a hole.
  vinyl: {
    d: "M12 3.2 A8.8 8.8 0 1 0 12.2 20.8 A8.8 8.8 0 1 0 12 3.2 M12 7.4 A4.6 4.6 0 1 0 12.1 16.6 A4.6 4.6 0 1 0 12 7.4",
    dots: [[12, 12, 1.3]]
  },
  // A four-point sparkle.
  sparkle: { d: "M12 3.4 L12.2 20.6 M3.6 12.2 L20.4 11.8 M7 7.2 L8.6 8.8 M17.2 15.4 L15.8 14" },
  // A small spark: a short bent stroke and a dot.
  spark: { d: "M8 16.4 Q11.4 12.2 13.8 7.6", dots: [[15.4, 5.4, 1.2]] },
  // Code brackets.
  bracket: { d: "M8.6 4.8 Q3.4 12 8.8 19.4 M15.4 4.6 Q20.8 12 15.2 19.2" },
  // A gear: ring with six short teeth.
  gear: {
    d: "M12 6.4 A5.6 5.6 0 1 0 12.1 17.6 A5.6 5.6 0 1 0 12 6.4 M12 2.8 L12 5.4 M12 18.6 L12 21.2 M3.4 12 L6 12 M18 12 L20.6 12 M5.6 5.6 L7.6 7.6 M16.4 16.4 L18.4 18.4 M18.4 5.6 L16.4 7.6 M7.6 16.4 L5.6 18.4"
  },
  // A wrench, drawn as a stem with an open jaw.
  wrench: { d: "M5.2 18.8 L14.2 9.8 M14.2 9.8 Q12.6 6.4 15.4 4.2 L17.6 6.6 L19.6 4.6 Q21.4 8.2 17.8 10.6 Q16 10.8 14.2 9.8" },
  // A sprout: two leaves on a stem.
  sprout: { d: "M12 20 L12.2 10.6 M12.1 13.8 Q8.4 13.6 7.2 9.6 Q11 9.4 12.1 13.8 M12.3 11.4 Q13.2 6.8 17.4 6.2 Q16.6 10.6 12.3 11.4" },
  // A single leaf with a vein.
  leaf: { d: "M5.4 18.6 Q6.2 8.4 18.4 5.4 Q17.2 17.6 5.4 18.6 M6.4 17.6 Q11.2 12.4 16.4 7.6" },
  // An ember: a small flame-like teardrop.
  ember: { d: "M12 4.6 Q17.4 10 16.2 15 Q15.2 19.4 12 19.6 Q8.8 19.4 7.8 15 Q6.6 10 12 4.6 M12 11.2 Q13.8 14.2 12 16.6 Q10.2 14.2 12 11.2" },
  // A trail with stops: a wandering line with three points.
  trail: { d: "M3 17.4 Q8 15.2 10 10.4 Q12.4 6.4 16 8.6 Q19.2 10.6 21 6.4", dots: [[3.2, 17.4, 1.3], [10.2, 10.2, 1.3], [21, 6.4, 1.3]] },
  // A medal: a disc hanging from two ribbon strokes.
  medal: { d: "M9 3.2 L11 10.2 M15 3.2 L13 10.2 M12 9.6 A5.4 5.4 0 1 0 12.1 20.4 A5.4 5.4 0 1 0 12 9.6", dots: [[12, 15, 1.4]] },
  // A five-point star drawn in one uneven stroke.
  star: { d: "M12 3.4 L14.4 9.6 L20.8 10 L15.8 14 L17.4 20.4 L12 16.8 L6.6 20.4 L8.2 14 L3.2 10 L9.6 9.6 Z" },
  // A page with a folded corner and two lines of writing.
  page: { d: "M6 3.6 L14.6 3.4 L18.4 7.2 L18.2 20.6 L6.2 20.4 Z M14.4 3.6 L14.6 7.4 L18.2 7.2 M8.6 11.2 L15.4 11 M8.6 14.6 L15.2 14.4 M8.6 17.6 L12.8 17.6" },
  // A winding path with a start dot.
  path: { d: "M3.4 19.2 Q7 18.6 8.4 14.6 Q9.6 10.2 13.6 10.6 Q17.6 11 18.2 6.8 Q18.6 4.6 20.6 4", dots: [[3.4, 19.2, 1.3]] },
  // A question mark.
  question: { d: "M7.6 8.4 Q8.2 3.6 12.4 3.8 Q16.8 4.2 16.2 8.6 Q15.8 11 12.4 12.6 L12.2 15.4", dots: [[12.2, 19.6, 1.4]] },
  // A speech bubble.
  bubble: { d: "M5 5.4 L19 5.2 L19.4 14.2 L11 14.4 L7 18.6 L7.4 14.4 L4.8 14.2 Z M8.4 9.8 L15.6 9.6" },
  // An open ring: a memory that nearly closes.
  ring: { d: "M15.2 5.8 A7 7 0 1 0 18.4 14.6", dots: [[12.2, 12.1, 1.3]] },
  // Two arcs leaving a dot: a signal.
  "signal-arc": { d: "M11.4 7.2 Q15.4 12 11.4 16.8 M15.2 4.2 Q20.6 12 15.2 19.8", dots: [[7.2, 12, 1.4]] },
  // An envelope.
  envelope: { d: "M4 7 L20 6.8 L20.2 17.4 L4.2 17.6 Z M4.2 7.2 L12 13 L20 6.9" },
  // A paper plane.
  plane: { d: "M3.4 11.6 L21 4.6 L15.4 20 L11.6 13.4 Z M11.6 13.4 L21 4.6" },
  // A loose spiral.
  spiral: { d: "M12 12.4 Q13.6 11 13.4 13.2 Q13 15.8 10.2 15 Q7 13.8 8 10.2 Q9.2 6.4 13.4 6.6 Q18.6 7.2 18 12.8 Q17.2 18.8 11 19" }
};

export function HoverDoodleGlyph({ kind, asset }: Props) {
  if (asset) {
    return <image href={asset} x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid meet" />;
  }
  const g = GLYPHS[kind];
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d={g.d} />
      {g.fills?.map((d, i) => (
        <path key={`f${i}`} d={d} fill="currentColor" stroke="none" />
      ))}
      {g.dots?.map(([x, y, r], i) => (
        <circle key={`d${i}`} cx={x} cy={y} r={r} fill="currentColor" stroke="none" />
      ))}
    </g>
  );
}
