import { useMemo } from "react";
import { planets, type PlanetConfig } from "../../data/planets";
import type { LabelPlacement } from "../../data/sceneLayouts";
import { chalkLeader } from "../../art/chalk";
import { WorldGlyph } from "../../art/WorldGlyph";
import { useScene } from "./SceneContext";
import { round } from "../../utils/math";

/**
 * Astronomical annotations: a chalk leader from the perimeter to a
 * handwritten world name, its catalog numeral, its glyph and a one-line
 * descriptor. Rendered as a layer above the planets so a label never hides
 * behind a neighbouring body.
 *
 * Labels are positioned at each planet's composed position. The composition
 * is static (STATIC_ORBITS); if the orbits are ever re-enabled, move this
 * inside PlanetNode's orbit wrapper so the label travels with the body.
 *
 * On fine pointers a label appears on hover / focus (hoverMotion). On touch
 * layouts every label is visible, because there is no hover.
 */
export function PlanetLabels() {
  const { layout, scene, persistentLabels } = useScene();
  const compact = layout.id === "mobile";
  return (
    <g data-layer="labels" data-dimmable aria-hidden="true">
      {planets.map((planet) => {
        const placement = layout.planets[planet.id];
        const start = scene.orbits[planet.id].start;
        const label = resolveLabelPlacement(placement.label, placement.through, layout.viewBox);
        return (
          <PlanetLabel
            key={planet.id}
            planet={planet}
            x={start.x}
            y={start.y}
            radius={placement.radius}
            placement={label}
            compact={compact}
            persistent={persistentLabels}
          />
        );
      })}
    </g>
  );
}

function resolveLabelPlacement(
  authored: LabelPlacement | undefined,
  through: { x: number; y: number },
  viewBox: { width: number; height: number }
): Required<LabelPlacement> {
  return {
    side: authored?.side ?? (through.x > viewBox.width * 0.7 ? "left" : "right"),
    vertical: authored?.vertical ?? (through.y < viewBox.height * 0.3 ? "below" : "above")
  };
}

type LabelProps = {
  planet: PlanetConfig;
  x: number;
  y: number;
  radius: number;
  placement: Required<LabelPlacement>;
  compact: boolean;
  persistent: boolean;
};

function PlanetLabel({ planet, x, y, radius, placement, compact, persistent }: LabelProps) {
  const centered = placement.side === "center";
  const dir = placement.side === "right" ? 1 : -1;
  const up = placement.vertical === "above" ? -1 : 1;
  const nameSize = compact ? 15 : 24;
  const smallSize = compact ? 8.5 : 11.5;
  const gap = compact ? 14 : 22;
  const glyphSize = compact ? 12 : 18;

  const geometry = useMemo(() => {
    if (centered) {
      // Stacked: a short vertical tick, then the name and descriptor centred.
      const from = { x: 0, y: up * radius * 1.12 };
      const textY = up * (radius * 1.14 + gap) + (up === -1 ? 0 : nameSize * 0.8);
      const to = { x: 0, y: up === -1 ? textY + 4 : textY - nameSize * 0.85 };
      return { leader: chalkLeader(from, to, planet.orbitDuration * 7), textX: 0, textY };
    }
    // Leader leaves the perimeter at ~35° and lands just short of the text.
    const a = (up === -1 ? -35 : 35) * (Math.PI / 180);
    const from = { x: Math.cos(a) * radius * 1.14 * dir, y: Math.sin(a) * radius * 1.14 };
    const textX = dir * (radius * 1.14 + gap + (compact ? 10 : 18));
    const textY = up * (radius * 0.62 + (compact ? 10 : 16));
    const to = { x: textX - dir * (compact ? 6 : 10), y: textY + (up === -1 ? 6 : -4) };
    return { leader: chalkLeader(from, to, planet.orbitDuration * 7), textX, textY };
  }, [centered, radius, dir, up, gap, compact, nameSize, planet.orbitDuration]);

  const anchor = centered ? "middle" : dir === 1 ? "start" : "end";
  const glyphX = centered ? -glyphSize / 2 : dir === 1 ? geometry.textX : geometry.textX - glyphSize;
  const glyphY = geometry.textY + (compact ? 6 : 8);
  const descriptorX = centered ? 0 : dir === 1 ? geometry.textX + glyphSize + 6 : geometry.textX - glyphSize - 6;
  const descriptorY = centered ? glyphY + glyphSize * 0.72 + smallSize * 1.5 : glyphY + glyphSize * 0.72;

  return (
    <g
      className="planet-label"
      data-planet-label={planet.id}
      data-persistent={persistent ? "true" : undefined}
      transform={`translate(${round(x)} ${round(y)})`}
    >
      {/* Static translate above; hoverMotion animates this inner group. */}
      <g className="planet-label__inner" data-label-inner>
        <path className="planet-label__leader" d={geometry.leader} />
        <text className="planet-label__name" x={round(geometry.textX)} y={round(geometry.textY)} textAnchor={anchor} fontSize={nameSize}>
          <tspan className="planet-label__catalog" fontSize={smallSize}>
            {planet.catalog}
          </tspan>
          <tspan dx={compact ? 4 : 7}>{planet.name}</tspan>
        </text>
        <g className="planet-label__glyph" transform={`translate(${round(glyphX)} ${round(glyphY)}) scale(${(glyphSize / 24).toFixed(3)})`}>
          <WorldGlyph glyph={planet.glyph} inline />
        </g>
        <text className="planet-label__descriptor" x={round(descriptorX)} y={round(descriptorY)} textAnchor={anchor} fontSize={smallSize}>
          {planet.descriptor}
        </text>
      </g>
    </g>
  );
}
