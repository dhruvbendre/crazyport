import { useMemo } from "react";
import type { WorldTexture } from "../../data/planets";
import { roughEllipse, hatch, band, type Mark } from "../../art/crayon";
import { Marks } from "../../art/CrayonMarks";
import { ChalkDefs } from "../solar-system/SceneDefs";
import { createRng } from "../../utils/seededRandom";
import { round } from "../../utils/math";
import type { WorldTheme } from "./WorldTheme";

const W = 1600;
const H = 1000;

type Star = { x: number; y: number; r: number; o: number };

function buildStars(seed: number): Star[] {
  const rng = createRng(seed);
  const stars: Star[] = [];
  for (let i = 0; i < 46; i++) {
    stars.push({ x: round(rng.range(0, W)), y: round(rng.range(0, H)), r: round(rng.range(0.7, 1.7), 2), o: round(rng.range(0.25, 0.7), 2) });
  }
  return stars;
}

/**
 * The world's texture motif, drawn faintly in its accent so the interior
 * carries the same marks as the planet (art.md §9.2).
 */
function textureMarks(texture: WorldTexture, seed: number, accent: string): Mark[] {
  const rng = createRng(seed + 5);
  switch (texture) {
    case "hatch":
      return hatch({ cx: W * 0.82, cy: H * 0.28, r: 260, angle: 48, count: 14, seed, colors: [accent], width: [3, 9], opacity: [0.05, 0.12], length: [0.4, 1], bend: 0.05 });
    case "ember": {
      const marks: Mark[] = [];
      let x = W * 0.08;
      let y = H * 0.92;
      for (let i = 0; i < 9; i++) {
        const nx = x + rng.range(120, 200);
        const ny = y - rng.range(50, 110);
        marks.push({ d: `M${round(x)} ${round(y)}Q${round((x + nx) / 2 + rng.range(-30, 30))} ${round((y + ny) / 2 + rng.range(-20, 20))} ${round(nx)} ${round(ny)}`, stroke: accent, width: rng.range(2, 5), opacity: rng.range(0.08, 0.18) });
        x = nx;
        y = ny;
      }
      return marks;
    }
    case "fields":
      return hatch({ cx: W * 0.78, cy: H * 0.3, r: 220, angle: -35, count: 9, seed, colors: [accent, "#5d9c62"], width: [4, 10], opacity: [0.05, 0.11], length: [0.5, 1], bend: 0.08 });
    case "strata": {
      const marks: Mark[] = [];
      for (let i = 0; i < 7; i++) {
        const y = H * 0.18 + i * rng.range(28, 44);
        marks.push({ d: `M${round(W * 0.62 + rng.range(-40, 40))} ${round(y)}q${round(rng.range(120, 220))} ${round(rng.range(-8, 8))} ${round(rng.range(360, 520))} ${round(rng.range(-14, 14))}`, stroke: accent, width: rng.range(2, 6), opacity: rng.range(0.06, 0.14) });
      }
      return marks;
    }
    case "bands": {
      const marks: Mark[] = [];
      for (let i = 0; i < 5; i++) {
        marks.push({ d: band(W * 0.8, H * 0.2 + i * 46, 300, rng.range(10, 22), seed + i, 0.4), stroke: accent, width: 0, opacity: rng.range(0.05, 0.1) });
      }
      return marks;
    }
    case "rings": {
      const marks: Mark[] = [];
      for (let i = 0; i < 4; i++) {
        marks.push({ d: roughEllipse(W * 0.86, H * 0.22, 240 + i * 46, 70 + i * 14, -12, seed + i, 0.02), stroke: accent, width: rng.range(1.5, 3.5), opacity: rng.range(0.08, 0.16) });
      }
      return marks;
    }
    case "tilt":
      return [
        { d: roughEllipse(W * 0.84, H * 0.26, 300, 60, -58, seed, 0.02), stroke: accent, width: 3, opacity: 0.14 },
        { d: roughEllipse(W * 0.84, H * 0.26, 330, 72, -58, seed + 1, 0.025), stroke: "#2ba9df", width: 1.6, opacity: 0.1 }
      ];
    case "grooves": {
      // Concentric arcs off the top-right corner, like the grooves of a record.
      const marks: Mark[] = [];
      for (let i = 0; i < 6; i++) {
        marks.push({ d: roughEllipse(W * 0.92, H * 0.12, 200 + i * 58, 200 + i * 58, 0, seed + i, 0.015), stroke: accent, width: rng.range(2, 5), opacity: rng.range(0.06, 0.15) });
      }
      return marks;
    }
    case "dust":
    default:
      return [];
  }
}

/**
 * Fixed ambient layer behind every interior: a faint paper grain, two chalk
 * orbit arcs crossing the top-right corner, a sparse star field and the
 * world's texture motif. Nothing here moves on its own.
 */
export function WorldAmbient({ theme }: { theme: WorldTheme }) {
  const stars = useMemo(() => buildStars(theme.seed), [theme.seed]);
  const marks = useMemo(() => textureMarks(theme.texture, theme.seed, theme.accent), [theme.texture, theme.seed, theme.accent]);
  const arcs = useMemo(
    () => [roughEllipse(W * 1.02, H * -0.1, 780, 440, -8, theme.seed + 2, 0.012), roughEllipse(W * 1.04, H * -0.12, 980, 560, -6, theme.seed + 3, 0.012)],
    [theme.seed]
  );
  const dust = useMemo(() => {
    if (theme.texture !== "dust") return [];
    const rng = createRng(theme.seed + 9);
    return Array.from({ length: 90 }, () => ({ x: round(rng.range(W * 0.5, W)), y: round(rng.range(0, H * 0.6)), r: round(rng.range(0.6, 2.2), 2), o: round(rng.range(0.08, 0.3), 2) }));
  }, [theme.texture, theme.seed]);

  return (
    <div className="world__ambient" aria-hidden="true">
      <svg className="world__ambient-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <ChalkDefs />
        <defs>
          <filter id="world-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="2" seed="21" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.94  0 0 0 0 0.94  0 0 0 0 0.9  0 0 0 0.045 0" />
          </filter>
        </defs>
        <rect width={W} height={H} filter="url(#world-grain)" />
        <g className="world__arcs" filter="url(#chalk-soft)">
          {arcs.map((d, i) => (
            <path key={i} d={d} strokeDasharray={i === 0 ? "420 14 260 9 600 18" : "700 12 380 16 500 10"} />
          ))}
        </g>
        <g className="world__stars">
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.o} />
          ))}
        </g>
        {dust.length > 0 && (
          <g fill={theme.accent}>
            {dust.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={d.r} opacity={d.o} />
            ))}
          </g>
        )}
        {marks.length > 0 &&
          (theme.texture === "bands" ? (
            <g fill={theme.accent}>
              {marks.map((m, i) => (
                <path key={i} d={m.d} opacity={m.opacity.toFixed(2)} />
              ))}
            </g>
          ) : (
            <Marks marks={marks} />
          ))}
      </svg>
    </div>
  );
}
