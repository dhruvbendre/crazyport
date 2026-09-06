import { METEOR_ART } from "../../art/PlanetArtRegistry";
import { ArtFrame } from "./ArtFrame";
import { useScene } from "./SceneContext";

/** Positioned and flown by environmentMotion; starts invisible. */
export function Meteor() {
  const { layout } = useScene();
  return (
    <g data-meteor opacity={0} aria-hidden="true">
      <ArtFrame art={METEOR_ART} scale={layout.meteor.scale} />
    </g>
  );
}
