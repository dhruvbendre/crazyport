import { useMemo } from "react";
import { chalkRing } from "../../art/chalk";

type Props = {
  /** Body radius in the parent's units. The chalk sits just outside it. */
  radius: number;
  seed: number;
  /** Override the automatic stroke weight. */
  weight?: number;
  /**
   * "grain" runs the full powder filter (displacement + speckle). "soft" is a
   * cheaper blur-only treatment for bodies that move every frame (the Sun
   * under pointer parallax) or very large horizons.
   */
  finish?: "grain" | "soft";
  /** Anchors per ring; more for large bodies. */
  points?: number;
  /** Number of dust specks around the perimeter. */
  dust?: number;
};

/**
 * The white chalk perimeter around a celestial body (art.md §4).
 *
 * Three rings of different weight, each skipping in a few places, a handful of
 * dust specks, and a hidden emphasis ring that hover / focus / selection draws
 * in with stroke-dashoffset. The parent centres it on the body's origin.
 *
 *   [data-chalk]            the whole perimeter (jitters gently while active)
 *   [data-chalk-emphasis]   the emphasis ring, animated by hoverMotion
 *   [data-chalk-dust]       the dust, brightened while active
 */
export function ChalkOutline({ radius, seed, weight, finish = "grain", points, dust }: Props) {
  const ring = useMemo(() => chalkRing(radius, seed, { weight, points, dust }), [radius, seed, weight, points, dust]);
  return (
    <g className="chalk" data-chalk filter={finish === "grain" ? "url(#chalk-grain)" : "url(#chalk-soft)"} aria-hidden="true">
      {ring.strokes.map((s, i) => (
        <path
          key={i}
          className="chalk__stroke"
          d={s.d}
          strokeWidth={s.width.toFixed(2)}
          opacity={s.opacity}
          strokeDasharray={s.dasharray}
          strokeDashoffset={s.dashoffset.toFixed(1)}
          transform={s.dx || s.dy ? `translate(${s.dx.toFixed(2)} ${s.dy.toFixed(2)})` : undefined}
        />
      ))}
      <path
        className="chalk__emphasis"
        data-chalk-emphasis
        d={ring.emphasis.d}
        strokeWidth={ring.emphasis.width.toFixed(2)}
        strokeDasharray={ring.emphasis.length.toFixed(1)}
        strokeDashoffset={ring.emphasis.length.toFixed(1)}
      />
      <g className="chalk__dust" data-chalk-dust>
        {ring.dust.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} opacity={d.opacity} />
        ))}
      </g>
    </g>
  );
}
