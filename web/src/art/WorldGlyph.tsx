import type { WorldGlyph as GlyphId } from "../data/planets";

type Props = {
  glyph: GlyphId;
  /** Rendered size in the parent's units (CSS px in HTML, user units in SVG). */
  size?: number;
  className?: string;
  /** When true, renders only the inner group so it can sit inside another SVG. */
  inline?: boolean;
  title?: string;
};

/**
 * One small chalk symbol per world (art.md §9.4). All glyphs share a 24×24
 * grid, a 1.6 stroke, round caps, and are drawn with the same slightly
 * unsteady hand as the chalk perimeters. No fills except tiny dots.
 */
const PATHS: Record<GlyphId, { d: string; dots?: [number, number][] }> = {
  // Ferrin: an anvil-like flat stroke over a stem, "the thing you make on".
  anvil: { d: "M4.5 9.2 Q12 7.6 19.6 9 M8.2 9.4 L7.4 17.6 M15.8 9.3 L16.7 17.4 M6.2 17.8 Q12 19 17.9 17.6" },
  // Emberline: a rising trail with a last spark.
  ember: { d: "M4 19 Q9 15 10.5 11.5 Q12.5 8.5 15 10 Q17.5 12 18.6 8.2", dots: [[19.6, 5.2]] },
  // Verdance: a sprout: two leaves on a stem out of a small ground line.
  sprout: { d: "M12 19.5 L12.2 10.6 M12.1 13.8 Q8.4 13.6 7.2 9.6 Q11 9.4 12.1 13.8 M12.3 11.4 Q13.2 6.8 17.4 6.2 Q16.6 10.6 12.3 11.4 M8 19.8 Q12 20.6 16.4 19.6" },
  // Theoria: a lens: circle with a short handle, looking closely.
  lens: { d: "M9.6 5.4 A5.2 5.2 0 1 0 9.8 15.8 A5.2 5.2 0 1 0 9.6 5.4 M13.6 14.4 L19 19.6" },
  // Magnara: three bands, the middle one heavier.
  band: { d: "M5 8.2 Q12 7.2 19.2 8.4 M4.6 12.2 Q12 10.8 19.6 12.4 M5.2 16.2 Q12 15.2 18.8 16.3" },
  // Cadence: a loop that nearly closes: repeat and improve.
  loop: { d: "M17.6 9.4 A6.2 6.2 0 1 0 17.2 15.2 M17.4 15.2 L18.6 12.2 M17.4 15.2 L14.6 14.6" },
  // Whimsel: a tilted ring around a small disc.
  tilt: { d: "M12 8.6 A3.4 3.4 0 1 0 12.1 15.4 A3.4 3.4 0 1 0 12 8.6 M4.2 17.6 Q12 6.2 19.8 6.6" },
  // Mnemora: an open ring with a single dot held inside: a memory.
  memory: { d: "M15.2 5.8 A7 7 0 1 0 18.4 14.6", dots: [[12.2, 12.1]] },
  // Signal: a short line and two arcs leaving it.
  signal: { d: "M5.2 12 L10.6 12 M13.4 8.2 Q16.4 12 13.4 15.8 M16.8 5.6 Q21 12 16.8 18.4" },
  // Sonara: a sound wave, five uneven bars with a small dot for the beat.
  wave: { d: "M5 13.4 L5.2 10.8 M9 16.8 L9.3 7.4 M13 14.6 L13.2 9.2 M17 18.2 L17.3 6 M21 12.6 L21.1 11", dots: [[9.1, 19.6]] }
};

export function WorldGlyph({ glyph, size = 20, className, inline = false, title }: Props) {
  const spec = PATHS[glyph];
  const body = (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={spec.d} />
      {spec.dots?.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.25" fill="currentColor" stroke="none" />
      ))}
    </g>
  );
  if (inline) return body;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {body}
    </svg>
  );
}
