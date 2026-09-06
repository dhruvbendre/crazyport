import { useMemo } from "react";
import type { PlanetConfig } from "../../data/planets";
import { hoverAssetUrl, planetInteractions, type DoodleTint } from "../../data/planetInteractions";
import { HoverDoodleGlyph } from "../../art/HoverDoodleGlyph";
import { round } from "../../utils/math";
import { clamp } from "../../utils/clamp";

type Props = {
  planet: PlanetConfig;
  /** Body radius in scene units. */
  radius: number;
};

const TINTS: Record<DoodleTint, (accent: string) => string> = {
  chalk: () => "var(--chalk)",
  accent: (accent) => accent,
  warm: () => "#ffe27a"
};

/**
 * The marks that escape from behind a hovered world.
 *
 * Rendered *before* the body inside the planet's link, so every doodle starts
 * hidden behind the artwork and becomes visible only as it drifts clear of
 * the disc: sound leaving the record, sprouts breaking the surface. Each
 * doodle is one `<g data-doodle>` sitting at its emergence point on the
 * perimeter; motion/planetInteraction.ts animates the inner group along the
 * drift stored in its dataset. Nothing here catches pointer events.
 */
export function PlanetHoverDoodles({ planet, radius }: Props) {
  const spec = planetInteractions[planet.id];
  const size = clamp(radius * 0.46, 14, 28);

  const doodles = useMemo(
    () =>
      spec.doodles.map((d, i) => {
        const a = (d.angle * Math.PI) / 180;
        // Start well inside the disc so the mark is fully hidden by the body.
        const r0 = radius * 0.55;
        const s = size * (d.size ?? 1);
        // Rest just past the perimeter plus the drift. The drift is scaled by
        // the radius up to a cap so a 100-unit world does not throw its marks
        // onto its neighbours.
        const pad = clamp(radius * 0.2, 8, 18);
        const driftScale = Math.min(radius, 56);
        return {
          key: i,
          x: round(Math.cos(a) * r0),
          y: round(Math.sin(a) * r0),
          dx: round(Math.cos(a) * (radius + pad - r0) + d.drift.x * driftScale),
          dy: round(Math.sin(a) * (radius + pad - r0) + d.drift.y * driftScale),
          scale: round(s / 24, 3),
          half: round(s / 2),
          color: TINTS[d.tint ?? "chalk"](planet.accent),
          asset: d.asset ? hoverAssetUrl(planet.slug, d.asset) : undefined,
          spec: d
        };
      }),
    [spec, radius, size, planet.accent, planet.slug]
  );

  return (
    <g className="hover-doodles" data-hover-doodles={planet.id} data-effect={spec.hoverEffect} aria-hidden="true">
      {doodles.map((d) => (
        <g
          key={d.key}
          className="hover-doodle"
          data-doodle={d.key}
          data-kind={d.spec.kind}
          data-dx={d.dx}
          data-dy={d.dy}
          data-rot-from={d.spec.rotate[0]}
          data-rot-to={d.spec.rotate[1]}
          data-delay={d.spec.delay}
          data-ambient={d.spec.ambient ? "true" : undefined}
          data-near={d.spec.ambientNear ? "true" : undefined}
          transform={`translate(${d.x} ${d.y})`}
          style={{ color: d.color }}
        >
          <g data-doodle-inner opacity="0">
            <g transform={`translate(${-d.half} ${-d.half}) scale(${d.scale})`}>
              <HoverDoodleGlyph kind={d.spec.kind} asset={d.asset} />
            </g>
          </g>
        </g>
      ))}
    </g>
  );
}
