import { SATELLITE_ART } from "../../art/PlanetArtRegistry";
import { ArtFrame } from "./ArtFrame";
import { useScene } from "./SceneContext";

/**
 * Rides inside Earth's orbit wrapper. Its own local loop is driven by
 * environmentMotion through the transform proxy on [data-satellite].
 */
export function Satellite() {
  const { layout } = useScene();
  const { rx, ry, rotation, scale } = layout.satellite;
  // Initial position: a point on its local ellipse so the static frame is right.
  const a = Math.PI * 0.15;
  const rot = (rotation * Math.PI) / 180;
  const ex = rx * Math.cos(a);
  const ey = ry * Math.sin(a);
  const x = ex * Math.cos(rot) - ey * Math.sin(rot);
  const y = ex * Math.sin(rot) + ey * Math.cos(rot);
  return (
    <g data-satellite transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} aria-hidden="true">
      <g data-satellite-body>
        <ArtFrame art={SATELLITE_ART} scale={scale} />
      </g>
    </g>
  );
}
