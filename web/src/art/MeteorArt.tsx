import { useMemo } from "react";
import type { CelestialArtProps } from "./CelestialArtProps";
import { hatch, roughDisc, rngFor } from "./crayon";
import { Marks } from "./CrayonMarks";

/**
 * Meteor. viewBox 0 0 220 90, head centre (190, 46).
 * A small irregular yellow-orange head and a long rough red/orange crayon
 * flame tail that tapers unevenly. No gradients, no glow.
 */
function tail(x: number, y: number, length: number, seed: number, spread: number): string {
  const rng = rngFor(seed);
  const pts: string[] = [];
  const n = 5;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push(`${(x - t * length).toFixed(1)} ${(y + Math.sin(t * Math.PI * 1.3 + seed) * spread + rng.range(-1.5, 1.5)).toFixed(1)}`);
  }
  return `M${pts.join("L")}`;
}

export function MeteorArt({ className }: CelestialArtProps) {
  const art = useMemo(() => {
    const head = roughDisc(190, 46, 21, 1501, 12, 0.07);
    const headHatch = hatch({ cx: 190, cy: 46, r: 21, angle: -40, count: 6, seed: 1502, colors: ["#f89932", "#ffd36b"], width: [3, 5], opacity: [0.35, 0.6], length: [0.5, 1], bend: 0.1 });
    return {
      head,
      headHatch,
      trails: [
        { d: tail(176, 42, 150, 1503, 3), stroke: "#e55832", width: 9, opacity: 0.9 },
        { d: tail(178, 50, 122, 1504, 4), stroke: "#f89932", width: 6, opacity: 0.85 },
        { d: tail(174, 46, 96, 1505, 2.5), stroke: "#c93e2a", width: 4, opacity: 0.75 },
        { d: tail(172, 38, 70, 1506, 2), stroke: "#ffc447", width: 2.2, opacity: 0.7 }
      ]
    };
  }, []);
  return (
    <svg viewBox="0 0 220 90" width={220} height={90} className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {art.trails.map((t, i) => (
          <path key={i} d={t.d} stroke={t.stroke} strokeWidth={t.width} opacity={t.opacity} />
        ))}
      </g>
      <path d={art.head} fill="#ffc447" />
      <Marks marks={art.headHatch} />
      <path d={art.head} fill="none" stroke="#e58a2a" strokeWidth="1.4" opacity="0.5" />
    </svg>
  );
}
