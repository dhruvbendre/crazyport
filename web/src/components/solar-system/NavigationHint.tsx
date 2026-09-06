import { useRef } from "react";
import { gsap, useGSAP } from "../../motion/gsapSetup";
import { useScene } from "./SceneContext";

type Props = { visible: boolean };

/**
 * "Explore a planet" — a single understated handwritten hint with a small
 * hand-drawn arrow, anchored near Earth's first-frame position.
 */
export function NavigationHint({ visible }: Props) {
  const { layout, scene, reducedMotion } = useScene();
  const ref = useRef<SVGGElement>(null);
  const earth = scene.orbits.earth.start;
  const { x, y } = layout.hint.offset;
  const flip = x < 0;

  useGSAP(
    () => {
      if (!ref.current) return;
      if (visible) {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: reducedMotion ? 0.15 : 0.6, ease: "power2.out" }
        );
      } else {
        gsap.to(ref.current, { opacity: 0, duration: reducedMotion ? 0.1 : 0.3, ease: "power2.in" });
      }
    },
    { dependencies: [visible] }
  );

  return (
    <g
      ref={ref}
      className="nav-hint"
      data-hint
      transform={`translate(${(earth.x + x).toFixed(1)} ${(earth.y + y).toFixed(1)})`}
      aria-hidden="true"
    >
      <text className="nav-hint__text" textAnchor={flip ? "end" : "start"} x={flip ? -34 : 34} y={4}>
        Explore a planet
      </text>
      <path
        className="nav-hint__arrow"
        d={flip ? "M-26 6 q-6 14 4 30 M-24 30 l2 8 l6 -5" : "M26 6 q6 14 -4 30 M24 30 l-2 8 l-6 -5"}
      />
    </g>
  );
}
