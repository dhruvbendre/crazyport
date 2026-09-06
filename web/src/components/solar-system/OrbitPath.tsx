import type { ResolvedOrbit } from "../../utils/orbitGeometry";

type Props = { orbit: ResolvedOrbit; planetId: string };

/**
 * A single hand-drawn orbit: the main stroke plus a faint offset echo that
 * mimics uneven crayon pressure. The main path is what MotionPath follows.
 */
export function OrbitPath({ orbit, planetId }: Props) {
  return (
    <g data-orbit={planetId}>
      <path className="orbit orbit--echo" d={orbit.d} transform="translate(1.4 0.9)" aria-hidden="true" />
      <path id={orbit.id} className="orbit" d={orbit.d} data-orbit-path={planetId} aria-hidden="true" />
    </g>
  );
}
