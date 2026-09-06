import { useEffect, useMemo, useRef, useState } from "react";
import { chalkBox } from "../../art/chalk";
import { createRng } from "../../utils/seededRandom";

type Props = {
  seed: number;
  /** Stroke weight of the heaviest ring, in px. */
  weight?: number;
  /** How far outside the element's box the chalk sits, in px. */
  inset?: number;
  /** Number of dust specks scattered along the edges. */
  dust?: number;
};

/**
 * The chalk perimeter, for a rectangle: the same three imperfect rings and
 * dust the planets wear (art.md §4), drawn just outside whatever element
 * this sits in. The parent must be `position: relative`; the frame measures
 * it with a ResizeObserver so the jitter is generated in real pixels and
 * never stretched.
 */
export function ChalkFrame({ seed, weight = 2.2, inset = 6, dust = 12 }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize((s) => (s && Math.abs(s.w - r.width) < 0.5 && Math.abs(s.h - r.height) < 0.5 ? s : { w: r.width, h: r.height }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const drawn = useMemo(() => {
    if (!size) return null;
    const w = size.w + inset * 2;
    const h = size.h + inset * 2;
    const rings = [
      { d: chalkBox(w, h, seed, 4), width: weight, opacity: 0.9 },
      { d: chalkBox(w, h, seed + 7, 3), width: weight * 0.55, opacity: 0.55 },
      { d: chalkBox(w, h, seed + 13, 5), width: weight * 0.35, opacity: 0.4 }
    ];
    const rng = createRng(seed + 29);
    const specks = Array.from({ length: dust }, () => {
      const t = rng.range(0, 1);
      const side = Math.floor(rng.range(0, 4));
      const off = rng.range(-inset * 0.9, inset * 0.9);
      const x = side === 0 ? t * w : side === 2 ? t * w : side === 1 ? w + off : off;
      const y = side === 1 ? t * h : side === 3 ? t * h : side === 0 ? off : h + off;
      return { x, y, r: rng.range(0.6, 1.5), o: rng.range(0.25, 0.6) };
    });
    return { w, h, rings, specks };
  }, [size, seed, weight, inset, dust]);

  return (
    <svg
      ref={ref}
      className="chalk chalk-frame"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", left: -inset, top: -inset, width: drawn ? drawn.w : 0, height: drawn ? drawn.h : 0, overflow: "visible", pointerEvents: "none" }}
      width={drawn?.w ?? 0}
      height={drawn?.h ?? 0}
      viewBox={drawn ? `0 0 ${drawn.w} ${drawn.h}` : "0 0 1 1"}
    >
      {drawn && (
        <g filter="url(#chalk-grain)">
          {drawn.rings.map((r, i) => (
            <path key={i} className="chalk__stroke" d={r.d} strokeWidth={r.width.toFixed(2)} opacity={r.opacity} />
          ))}
          <g className="chalk__dust">
            {drawn.specks.map((s, i) => (
              <circle key={i} cx={s.x.toFixed(1)} cy={s.y.toFixed(1)} r={s.r.toFixed(2)} opacity={s.o.toFixed(2)} />
            ))}
          </g>
        </g>
      )}
    </svg>
  );
}
