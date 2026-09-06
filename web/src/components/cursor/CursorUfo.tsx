import { useMemo, useRef } from "react";
import { gsap, useGSAP } from "../../motion/gsapSetup";
import { createUfoMotion, type UfoMotion } from "../../motion/ufoMotion";
import { useFinePointer, useReducedMotion } from "../../hooks/useReducedMotion";
import { roughDisc } from "../../art/crayon";

/**
 * A small crayon UFO that follows the pointer, with a code-drawn crayon flame
 * exhaust and ember trail underneath. The saucer artwork is /ufo.svg
 * (generated with Magnific, cleaned with SVGO); the fire is pure SVG here.
 * Only mounted for fine pointers and when motion is not reduced.
 *
 * Near a planet the ship slows and leans toward it (motion/ufoAttention.ts);
 * it never speaks. The thought cloud was removed on 2026-09-06.
 */
function flameTongue(w: number, h: number, seed: number): string {
  // A rough teardrop pointing down from (0,0): drawn in a unit-ish space so
  // the motion can scale it vertically for flicker.
  const rng = (n: number) => ((Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453) % 1) * 0.5 + 0.5;
  const j = (v: number, k: number) => v + (rng(k) - 0.5) * w * 0.25;
  return `M${j(-w / 2, 1)} 0 C${j(-w * 0.55, 2)} ${h * 0.35} ${j(-w * 0.18, 3)} ${h * 0.7} 0 ${h} C${j(w * 0.18, 4)} ${h * 0.7} ${j(w * 0.55, 5)} ${h * 0.35} ${j(w / 2, 6)} 0 Z`;
}

export function CursorUfo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<HTMLDivElement>(null);
  const flamesRef = useRef<SVGGElement>(null);
  const emberRefs = useRef<SVGCircleElement[]>([]);
  const motionRef = useRef<UfoMotion | null>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const enabled = finePointer && !reducedMotion;

  const flames = useMemo(
    () => [
      { d: flameTongue(9, 22, 1), x: -13, fill: "#f89932", inner: flameTongue(4, 11, 4) },
      { d: flameTongue(11, 28, 2), x: 0, fill: "#e55832", inner: flameTongue(5, 14, 5) },
      { d: flameTongue(9, 22, 3), x: 13, fill: "#f89932", inner: flameTongue(4, 11, 6) }
    ],
    []
  );
  const glow = useMemo(() => roughDisc(0, 4, 20, 77, 10, 0.12), []);

  useGSAP(
    () => {
      if (!enabled || !rootRef.current || !shipRef.current || !flamesRef.current) return;
      gsap.set(rootRef.current, { opacity: 0 });
      const motion = createUfoMotion({
        root: rootRef.current,
        ship: shipRef.current,
        flames: flamesRef.current,
        embers: emberRefs.current.filter(Boolean)
      });
      motionRef.current = motion;
      return () => {
        motion.kill();
        motionRef.current = null;
      };
    },
    { dependencies: [enabled] }
  );

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="ufo" aria-hidden="true">
      <div ref={shipRef} className="ufo__ship">
        <svg className="ufo__fire" viewBox="-40 -10 80 70" width="80" height="70">
          <path d={glow} fill="#ffc447" opacity="0.18" transform="translate(0 18)" />
          <g ref={flamesRef} transform="translate(0 16)" fill="none">
            {flames.map((f, i) => (
              <path key={i} d={f.d} fill={f.fill} transform={`translate(${f.x} 0)`} opacity="0.9" />
            ))}
          </g>
          <g transform="translate(0 16)">
            {flames.map((f, i) => (
              <path key={i} d={f.inner} fill="#ffc447" opacity="0.85" transform={`translate(${f.x} 2)`} />
            ))}
          </g>
          <g fill="#ffd36b">
            {Array.from({ length: 7 }, (_, i) => (
              <circle
                key={i}
                ref={(el) => {
                  if (el) emberRefs.current[i] = el;
                }}
                cx="0"
                cy="0"
                r="1.5"
                opacity="0"
              />
            ))}
          </g>
        </svg>
        <img className="ufo__img" src="/ufo.svg" alt="" width="64" height="30" draggable={false} />
      </div>
    </div>
  );
}
