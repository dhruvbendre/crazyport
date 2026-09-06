import { useMemo } from "react";
import type { CelestialArtProps } from "./CelestialArtProps";
import { hatch, pressure, roughDisc, rngFor, scribble, type Mark } from "./crayon";
import { Marks } from "./CrayonMarks";
import { useArtId } from "./useArtId";

/**
 * The Sun. viewBox 0 0 700 850, disk centre (330, 425), radius 280.
 * Designed to be cropped by the left edge.
 * Rays are hand-cut paper triangles, uneven in length, width and angle.
 */
const CX = 330;
const CY = 425;
const R = 280;

type Ray = { d: string; fill: string; light: string };

function buildRays(): Ray[] {
  const rng = rngFor(501);
  const rays: Ray[] = [];
  const count = 19;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rng.range(-0.07, 0.07);
    const len = rng.range(42, 92);
    const halfW = rng.range(0.085, 0.13);
    const base = R - 4;
    const ax = CX + Math.cos(a - halfW) * base + rng.range(-3, 3);
    const ay = CY + Math.sin(a - halfW) * base + rng.range(-3, 3);
    const bx = CX + Math.cos(a + halfW) * base + rng.range(-3, 3);
    const by = CY + Math.sin(a + halfW) * base + rng.range(-3, 3);
    const tip = a + rng.range(-0.02, 0.02);
    const tx = CX + Math.cos(tip) * (R + len);
    const ty = CY + Math.sin(tip) * (R + len);
    const mx = (ax + tx) / 2 + rng.range(-3, 3);
    const my = (ay + ty) / 2 + rng.range(-3, 3);
    rays.push({
      d: `M${ax.toFixed(1)} ${ay.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}Z`,
      fill: rng.pick(["#f9c63a", "#f5a82c", "#ffd84a", "#f9c63a"]),
      light: `M${((ax + tx) / 2).toFixed(1)} ${((ay + ty) / 2).toFixed(1)}L${(tx - Math.cos(tip) * 14).toFixed(1)} ${(ty - Math.sin(tip) * 14).toFixed(1)}`
    });
  }
  return rays;
}

function buildMarks() {
  // Broad, soft streaks: the wax body colour laid down in one direction.
  const broad = hatch({
    cx: CX, cy: CY, r: R, angle: -34, count: 30, seed: 502,
    colors: ["#f9c63a", "#ffe066", "#f5a82c", "#ffd84a", "#f9c63a"],
    width: [14, 26], opacity: [0.1, 0.22], length: [0.35, 0.8], bend: 0.05
  });
  // Orange undertone gathering toward the corona edge.
  const corona = hatch({
    cx: CX + 110, cy: CY, r: R * 0.9, angle: 72, count: 10, seed: 503,
    colors: ["#efa537", "#e5902d"],
    width: [10, 16], opacity: [0.1, 0.2], length: [0.3, 0.6], bend: 0.1
  });
  // Lighter pressure marks toward the centre of the disk.
  const lights = pressure({
    cx: CX, cy: CY, r: R, seed: 504, color: "#fff2a8", count: 12, angle: -34,
    region: { x: [-0.1, 0.7], y: [-0.6, 0.35] }, width: [4, 7], opacity: [0.16, 0.3]
  });
  // Fine scribbles kept tight and faint so they read as grain, not zig-zags.
  const fine: Mark[] = [
    scribble({ cx: CX, cy: CY, r: R, seed: 505, color: "#e5902d", width: 1.6, opacity: 0.1, legs: 22, angle: -30, spread: 0.16, at: [0.3, 0.5] }),
    scribble({ cx: CX, cy: CY, r: R, seed: 506, color: "#efa537", width: 1.6, opacity: 0.1, legs: 20, angle: -40, spread: 0.14, at: [0.55, -0.45] }),
    scribble({ cx: CX, cy: CY, r: R, seed: 507, color: "#fff2a8", width: 1.8, opacity: 0.12, legs: 20, angle: -28, spread: 0.14, at: [-0.35, -0.25] })
  ];
  return { broad, corona, lights, fine };
}

export function SunArt({ className }: CelestialArtProps) {
  const id = useArtId("sun");
  const rays = useMemo(buildRays, []);
  const disc = useMemo(() => roughDisc(CX, CY, R, 500, 26, 0.012), []);
  const marks = useMemo(buildMarks, []);
  const clip = `url(#${id}-clip)`;

  return (
    <svg viewBox="0 0 700 850" width={700} height={850} className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={disc} />
        </clipPath>
      </defs>

      {/* corona: hand-cut rays, one lighter crayon streak each */}
      <g>
        {rays.map((ray, i) => (
          <g key={i}>
            <path d={ray.d} fill={ray.fill} />
            <path d={ray.light} stroke="#fff08a" strokeWidth="5" strokeLinecap="round" opacity="0.35" fill="none" />
          </g>
        ))}
      </g>

      {/* body */}
      <path d={disc} fill="#ffd84a" />
      <Marks marks={marks.broad} clipPath={clip} />
      <Marks marks={marks.corona} clipPath={clip} />
      <Marks marks={marks.fine} clipPath={clip} />
      <Marks marks={marks.lights} clipPath={clip} />
      <path d={disc} fill="url(#crayon-tooth)" opacity="0.5" />
      <path d={disc} fill="none" stroke="#e5902d" strokeWidth="2" opacity="0.28" />
    </svg>
  );
}
