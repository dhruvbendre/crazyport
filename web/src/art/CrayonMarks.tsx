import type { Mark } from "./crayon";

/** Renders a list of generated crayon marks as round-capped strokes. */
export function Marks({ marks, clipPath, blend }: { marks: Mark[]; clipPath?: string; blend?: string }) {
  return (
    <g clipPath={clipPath} fill="none" strokeLinecap="round" strokeLinejoin="round" style={blend ? { mixBlendMode: blend as never } : undefined}>
      {marks.map((m, i) => (
        <path key={i} d={m.d} stroke={m.stroke} strokeWidth={m.width.toFixed(1)} opacity={m.opacity.toFixed(2)} />
      ))}
    </g>
  );
}

/**
 * Shared paper-tooth pattern and charcoal softness. Rendered once per page
 * (inside the scene defs and on the art-test route).
 */
export function CrayonDefs() {
  return (
    <defs>
      <pattern id="crayon-tooth" patternUnits="userSpaceOnUse" width="26" height="26" patternTransform="rotate(23)">
        <g fill="#fffbe9" opacity="0.5">
          <circle cx="3" cy="4" r="0.9" />
          <circle cx="12" cy="9" r="0.7" />
          <circle cx="20" cy="3" r="0.8" />
          <circle cx="7" cy="17" r="0.6" />
          <circle cx="16" cy="21" r="0.9" />
          <circle cx="23" cy="14" r="0.7" />
          <path d="M9 12 l3 1 M18 16 l2 -1 M2 22 l3 0.5" stroke="#fffbe9" strokeWidth="0.8" strokeLinecap="round" />
        </g>
        <g fill="#000" opacity="0.14">
          <circle cx="8" cy="7" r="0.6" />
          <circle cx="21" cy="19" r="0.7" />
          <circle cx="14" cy="24" r="0.5" />
          <circle cx="24" cy="8" r="0.5" />
        </g>
      </pattern>
    </defs>
  );
}
