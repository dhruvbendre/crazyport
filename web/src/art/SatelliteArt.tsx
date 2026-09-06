import { useMemo } from "react";
import type { CelestialArtProps } from "./CelestialArtProps";
import { hatch, rngFor } from "./crayon";
import { Marks } from "./CrayonMarks";

/**
 * Satellite. viewBox 0 0 180 130, body centre (90, 65).
 * Educational-poster style: a small central module, two rectangular solar
 * panels with hand-drawn grid lines, and a tiny dish. Legible at 45–65 px.
 */
function roughRect(x: number, y: number, w: number, h: number, seed: number): string {
  const rng = rngFor(seed);
  const j = () => rng.range(-1.4, 1.4);
  return `M${x + j()} ${y + j()}L${x + w + j()} ${y + j()}L${x + w + j()} ${y + h + j()}L${x + j()} ${y + h + j()}Z`;
}

export function SatelliteArt({ className }: CelestialArtProps) {
  const shapes = useMemo(() => {
    const leftPanel = roughRect(8, 42, 50, 44, 1401);
    const rightPanel = roughRect(122, 42, 50, 44, 1402);
    const body = roughRect(66, 38, 48, 52, 1403);
    const core = roughRect(78, 50, 24, 28, 1404);
    const panelHatch = (cx: number, seed: number) =>
      hatch({ cx, cy: 64, r: 26, angle: 90, count: 6, seed, colors: ["#9cb5c5", "#7c8791"], width: [1.6, 2.4], opacity: [0.55, 0.85], length: [0.7, 0.95], bend: 0.02 }).concat(
        hatch({ cx, cy: 64, r: 26, angle: 0, count: 3, seed: seed + 1, colors: ["#9cb5c5"], width: [1.4, 2], opacity: [0.5, 0.8], length: [0.85, 1], bend: 0.02 })
      );
    return { leftPanel, rightPanel, body, core, leftHatch: panelHatch(33, 1405), rightHatch: panelHatch(147, 1407) };
  }, []);

  return (
    <svg viewBox="0 0 180 130" width={180} height={130} className={className} aria-hidden="true">
      {/* struts */}
      <path d="M58 64 l8 0.6 M114 64.4 l8 -0.6" stroke="#2e3438" strokeWidth="3" strokeLinecap="round" />
      {/* panels */}
      <path d={shapes.leftPanel} fill="#4d6475" />
      <path d={shapes.rightPanel} fill="#4d6475" />
      <Marks marks={shapes.leftHatch} />
      <Marks marks={shapes.rightHatch} />
      {/* body */}
      <path d={shapes.body} fill="#7c8791" />
      <path d={shapes.core} fill="#e7e3d4" />
      <path d="M82 56 l16 0.5 M82 64 l16 0.4 M82 72 l16 0.3" stroke="#9cb5c5" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
      {/* dish + antenna */}
      <path d="M90 38 l0.6 -14" stroke="#2e3438" strokeWidth="3" strokeLinecap="round" />
      <path d="M78 24 q12 -10 24 0" stroke="#e7e3d4" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M76 25 q14 -13 28 -0.5" stroke="#2e3438" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7" />
      {/* tiny leg */}
      <path d="M84 90 l-3 10 M96 90 l3 10" stroke="#2e3438" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
