import { useMemo } from "react";
import type { SceneLayout } from "../../data/sceneLayouts";
import { createRng } from "../../utils/seededRandom";
import { degToRad, round } from "../../utils/math";
import { asteroidVariants } from "../../art/AsteroidArt";

const FILLS = ["#b39a72", "#c2aa7d", "#8e7c61", "#d0b88a", "#776b59"];

type Rock = { x: number; y: number; rot: number; s: number; variant: number; fill: string; drift: boolean };

export function buildAsteroids(layout: SceneLayout): Rock[] {
  const { count, seed, arc, spread, scale } = layout.asteroids;
  const rng = createRng(seed);
  const rocks: Rock[] = [];
  const rot = degToRad(arc.rotation);
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  for (let i = 0; i < count; i++) {
    // Density rises toward the `to` end of the arc.
    const t = Math.pow(rng.next(), 0.88);
    const a = degToRad(arc.from + (arc.to - arc.from) * t);
    const ex = arc.rx * Math.cos(a);
    const ey = arc.ry * Math.sin(a);
    const p = { x: arc.center.x + ex * cos - ey * sin, y: arc.center.y + ex * sin + ey * cos };
    // Outward normal of the ellipse at this parameter, in scene space.
    const nxl = Math.cos(a) / arc.rx;
    const nyl = Math.sin(a) / arc.ry;
    const nl = Math.hypot(nxl, nyl) || 1;
    const n = { x: (nxl * cos - nyl * sin) / nl, y: (nxl * sin + nyl * cos) / nl };
    const off = rng.range(-spread, spread) * rng.range(0.5, 1);
    rocks.push({
      x: p.x + n.x * off,
      y: p.y + n.y * off,
      rot: rng.range(0, 360),
      s: rng.range(0.55, 1.35) * scale,
      variant: rng.int(0, asteroidVariants.length - 1),
      fill: rng.pick(FILLS),
      drift: rng.chance(0.2)
    });
  }
  return rocks;
}

/**
 * A loose curved belt built from a handful of reusable pebble shapes,
 * instanced with <use> so 70 rocks cost 70 nodes, not 700.
 */
export function AsteroidBelt({ layout }: { layout: SceneLayout }) {
  const rocks = useMemo(() => buildAsteroids(layout), [layout]);
  return (
    <g data-layer="asteroids" data-dimmable aria-hidden="true">
      <defs>
        {asteroidVariants.map((v, i) => (
          <g key={i} id={`asteroid-v${i}`}>
            <path d={v.body} />
            {v.marks && <path d={v.marks} fill="none" stroke="#5d5142" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />}
          </g>
        ))}
      </defs>
      {rocks.map((r, i) => (
        <use
          key={i}
          href={`#asteroid-v${r.variant}`}
          className="asteroid"
          fill={r.fill}
          transform={`translate(${round(r.x)} ${round(r.y)}) rotate(${round(r.rot)}) scale(${round(r.s, 2)})`}
          data-drift={r.drift ? "" : undefined}
        />
      ))}
    </g>
  );
}
