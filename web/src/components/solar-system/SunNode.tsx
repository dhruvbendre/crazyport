import { SUN_ART } from "../../art/PlanetArtRegistry";
import { ArtFrame } from "./ArtFrame";
import { ChalkOutline } from "./ChalkOutline";
import { useScene } from "./SceneContext";

/**
 * The Sun is Hearth: home. On the landing scene it is the stable visual
 * anchor and has no link semantics (the greeting it once carried was removed
 * on 2026-09-05; the disc is bare). It is rendered
 * above the planet layer so planets pass behind it on the near side of their
 * orbits. Its chalk perimeter circles the disc; the corona rays cross it.
 */
export function SunNode() {
  const { layout } = useScene();
  const { x, y, radius } = layout.sun;
  const scale = radius / SUN_ART.bodyRadius;
  return (
    <g data-layer="sun" data-dimmable>
      <g data-parallax="sun">
        <g data-sun transform={`translate(${x} ${y})`}>
          <g data-sun-intro>
            <ArtFrame art={SUN_ART} scale={scale} />
            {/* The Sun moves under pointer parallax, so it takes the cheap finish. */}
            <ChalkOutline radius={radius * 0.965} seed={1} weight={2.6} finish="soft" points={34} />
          </g>
        </g>
      </g>
    </g>
  );
}
