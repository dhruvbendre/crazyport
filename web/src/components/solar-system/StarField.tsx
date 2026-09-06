import { useMemo } from "react";
import type { SceneLayout } from "../../data/sceneLayouts";
import { createRng } from "../../utils/seededRandom";
import { round } from "../../utils/math";

type Star =
  | { kind: "tiny"; x: number; y: number; r: number; color: string; twinkle: boolean }
  | { kind: "chalk"; x: number; y: number; d: string; color: string; twinkle: boolean }
  | { kind: "cross"; x: number; y: number; d: string; twinkle: boolean };

const COLORS = ["#f3efe0", "#f3efe0", "#f3efe0", "#d8d7cd", "#d8d7cd", "#afc9d5"];

function chalkBlob(rng: ReturnType<typeof createRng>, r: number): string {
  const n = 7;
  let d = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * rng.range(0.7, 1.15);
    d += `${i === 0 ? "M" : "L"}${round(Math.cos(a) * rr)} ${round(Math.sin(a) * rr)}`;
  }
  return d + "Z";
}

function crossStar(rng: ReturnType<typeof createRng>, s: number): string {
  const b1 = rng.range(-0.6, 0.6);
  const b2 = rng.range(-0.6, 0.6);
  return `M${round(-s)} ${round(b1)} q${round(s)} ${round(-b1 * 2)} ${round(s * 2)} 0 M${round(b2)} ${round(-s)} q${round(-b2 * 2)} ${round(s)} 0 ${round(s * 2)}`;
}

export function buildStars(layout: SceneLayout): Star[] {
  const rng = createRng(layout.stars.seed);
  const { width, height } = layout.viewBox;
  const sun = layout.sun;
  const stars: Star[] = [];

  const place = () => {
    // Avoid the Sun disk: stars behind it are invisible and cost nodes.
    for (let tries = 0; tries < 12; tries++) {
      const x = rng.range(-20, width + 20);
      const y = rng.range(-20, height + 20);
      if (Math.hypot(x - sun.x, y - sun.y) > sun.radius * 0.96) return { x, y };
    }
    return { x: width * 0.7, y: height * 0.3 };
  };

  for (let i = 0; i < layout.stars.tiny; i++) {
    const { x, y } = place();
    stars.push({ kind: "tiny", x, y, r: rng.range(0.8, 1.7), color: rng.pick(COLORS), twinkle: rng.chance(0.11) });
  }
  for (let i = 0; i < layout.stars.medium; i++) {
    const { x, y } = place();
    stars.push({ kind: "chalk", x, y, d: chalkBlob(rng, rng.range(1.8, 3.2)), color: rng.pick(COLORS), twinkle: rng.chance(0.22) });
  }
  for (let i = 0; i < layout.stars.cross; i++) {
    const { x, y } = place();
    stars.push({ kind: "cross", x, y, d: crossStar(rng, rng.range(4, 7)), twinkle: rng.chance(0.5) });
  }
  return stars;
}

export function StarField({ layout }: { layout: SceneLayout }) {
  const stars = useMemo(() => buildStars(layout), [layout]);
  return (
    <g data-layer="stars" data-dimmable aria-hidden="true">
      {stars.map((s, i) => {
        if (s.kind === "tiny") {
          return (
            <circle
              key={i}
              className="star"
              cx={round(s.x)}
              cy={round(s.y)}
              r={round(s.r, 2)}
              fill={s.color}
              opacity={s.twinkle ? 0.9 : 0.75}
              data-twinkle={s.twinkle ? "" : undefined}
            />
          );
        }
        if (s.kind === "chalk") {
          return (
            <path
              key={i}
              className="star"
              d={s.d}
              transform={`translate(${round(s.x)} ${round(s.y)})`}
              fill={s.color}
              opacity="0.85"
              data-twinkle={s.twinkle ? "" : undefined}
            />
          );
        }
        return (
          <path
            key={i}
            className="star star--cross"
            d={s.d}
            transform={`translate(${round(s.x)} ${round(s.y)})`}
            data-twinkle={s.twinkle ? "" : undefined}
          />
        );
      })}
    </g>
  );
}
