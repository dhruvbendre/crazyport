import type { PlanetId } from "./planets";
import type { OrbitSpec } from "../utils/orbitGeometry";
import type { Point } from "../utils/math";

export type LayoutId = "desktop" | "tablet-landscape" | "tablet-portrait" | "mobile";

/** Where a world's annotation sits relative to the body. Defaults are derived from position. */
export type LabelPlacement = {
  /** "center" stacks the annotation directly above / below the body (narrow layouts). */
  side?: "left" | "right" | "center";
  vertical?: "above" | "below";
};

export type PlanetPlacement = {
  /** First-frame position. The orbit is solved to pass through this point. */
  through: Point;
  /** Visual body radius in scene units (rings excluded). */
  radius: number;
  orbit: Omit<OrbitSpec, "id" | "through">;
  /** Authored annotation placement, used where the derived default would collide. */
  label?: LabelPlacement;
};

export type SceneLayout = {
  id: LayoutId;
  viewBox: { width: number; height: number };
  /** How the SVG fills its window. Mobile uses an aspect-ratio box and `meet`. */
  preserveAspectRatio: "xMidYMid slice" | "xMidYMid meet";
  sun: { x: number; y: number; radius: number };
  planets: Record<PlanetId, PlanetPlacement>;
  stars: { tiny: number; medium: number; cross: number; seed: number };
  asteroids: {
    count: number;
    seed: number;
    /**
     * Elliptical arc the belt follows, parallel to the orbit family. Angles are
     * parametric degrees; density rises toward `to`.
     */
    arc: { center: Point; rx: number; ry: number; rotation: number; from: number; to: number };
    /** Half-thickness of the belt in scene units. */
    spread: number;
    scale: number;
  };
  satellite: {
    /** Local ellipse around Earth. */
    rx: number;
    ry: number;
    rotation: number;
    duration: number;
    scale: number;
  };
  meteor: {
    /** Random spawn window (top-left region). */
    from: { x: [number, number]; y: [number, number] };
    /** Travel vector range. */
    travel: { x: [number, number]; y: [number, number] };
    scale: number;
  };
  hint: { offset: Point };
  pointerParallax: boolean;
  /** Minimum interactive target radius in CSS px. */
  minHitPx: number;
};

/* ---------------------------------------------------------------------------
   Orbit design note
   ---------------------------------------------------------------------------
   Every orbit is a near-horizontal ellipse (rotation within a few degrees)
   whose left tip is tucked behind the Sun and whose body sweeps through the
   visible frame. Planets hold their composed positions (see STATIC_ORBITS in
   motion/orbitMotion.ts), so `through` is simply where each planet sits and
   the ellipse size is solved from it. Centres step right and up as the orbits
   grow so the family nests without visible crossings.
   --------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
   Desktop master composition: 1440 x 1000
   --------------------------------------------------------------------------- */

const desktop: SceneLayout = {
  id: "desktop",
  viewBox: { width: 1440, height: 1000 },
  preserveAspectRatio: "xMidYMid slice",
  sun: { x: 60, y: 625, radius: 320 },
  planets: {
    mercury: {
      through: { x: 430, y: 705 },
      radius: 24,
      orbit: { center: { x: 316, y: 715 }, aspect: 0.6, rotation: -3, wobble: 2.2, seed: 11 },
      label: { side: "right", vertical: "above" }
    },
    venus: {
      through: { x: 610, y: 770 },
      radius: 32,
      orbit: { center: { x: 402, y: 691 }, aspect: 0.55, rotation: -3, wobble: 2.4, seed: 12 },
      label: { side: "right", vertical: "below" }
    },
    earth: {
      through: { x: 820, y: 680 },
      radius: 58,
      orbit: { center: { x: 472, y: 651 }, aspect: 0.61, rotation: -3, wobble: 2.6, seed: 13 },
      label: { side: "right", vertical: "below" }
    },
    mars: {
      through: { x: 1040, y: 605 },
      radius: 36,
      orbit: { center: { x: 571, y: 630 }, aspect: 0.55, rotation: -3, wobble: 2.6, seed: 14 },
      label: { side: "right", vertical: "below" }
    },
    jupiter: {
      through: { x: 1190, y: 480 },
      radius: 100,
      orbit: { center: { x: 659, y: 597 }, aspect: 0.536, rotation: -3, wobble: 3, seed: 15 },
      label: { side: "left", vertical: "above" }
    },
    saturn: {
      through: { x: 1085, y: 330 },
      radius: 62,
      orbit: { center: { x: 716, y: 597 }, aspect: 0.503, rotation: -3, wobble: 3, seed: 16 },
      label: { side: "right", vertical: "above" }
    },
    uranus: {
      through: { x: 870, y: 270 },
      radius: 52,
      orbit: { center: { x: 726, y: 597 }, aspect: 0.511, rotation: -3, wobble: 3, seed: 17 },
      label: { side: "right", vertical: "above" }
    },
    neptune: {
      through: { x: 700, y: 242 },
      radius: 48,
      orbit: { center: { x: 700, y: 592 }, aspect: 0.486, rotation: -4, wobble: 3.2, seed: 18 },
      label: { side: "left", vertical: "above" }
    },
    pluto: {
      through: { x: 440, y: 262 },
      radius: 42,
      orbit: { center: { x: 704, y: 590 }, aspect: 0.5, rotation: -4, wobble: 3.4, seed: 19 },
      label: { side: "left", vertical: "above" }
    }
  },
  stars: { tiny: 220, medium: 28, cross: 7, seed: 2024 },
  asteroids: {
    count: 72,
    seed: 77,
    arc: { center: { x: 615, y: 613 }, rx: 522, ry: 284, rotation: -3, from: 84, to: 8 },
    spread: 26,
    scale: 0.85
  },
  satellite: { rx: 118, ry: 62, rotation: -22, duration: 12, scale: 0.36 },
  meteor: {
    from: { x: [330, 520], y: [150, 260] },
    travel: { x: [170, 260], y: [70, 120] },
    scale: 0.55
  },
  hint: { offset: { x: 74, y: -84 } },
  pointerParallax: true,
  minHitPx: 44
};

/* ---------------------------------------------------------------------------
   Tablet landscape: same composition, tuned for touch and a wider Sun crop
   --------------------------------------------------------------------------- */

const tabletLandscape: SceneLayout = {
  ...desktop,
  id: "tablet-landscape",
  sun: { x: 40, y: 630, radius: 320 },
  planets: {
    ...desktop.planets,
    mercury: { ...desktop.planets.mercury, radius: 28 },
    venus: { ...desktop.planets.venus, radius: 36 },
    mars: { ...desktop.planets.mars, radius: 40 },
    jupiter: { ...desktop.planets.jupiter, radius: 96 },
    saturn: { ...desktop.planets.saturn, radius: 60 },
    uranus: { ...desktop.planets.uranus, radius: 52 },
    neptune: { ...desktop.planets.neptune, radius: 50 },
    pluto: { ...desktop.planets.pluto, radius: 44 }
  },
  stars: { tiny: 170, medium: 22, cross: 6, seed: 2024 },
  asteroids: { ...desktop.asteroids, count: 58 },
  pointerParallax: false,
  minHitPx: 52
};

/* ---------------------------------------------------------------------------
   Tablet portrait: 840 x 1120, Sun anchored lower-left
   --------------------------------------------------------------------------- */

const tabletPortrait: SceneLayout = {
  id: "tablet-portrait",
  viewBox: { width: 840, height: 1120 },
  preserveAspectRatio: "xMidYMid slice",
  sun: { x: 20, y: 800, radius: 300 },
  planets: {
    mercury: {
      through: { x: 350, y: 1040 },
      radius: 26,
      orbit: { center: { x: 300, y: 960 }, aspect: 0.758, rotation: -3, wobble: 2.2, seed: 21 },
      label: { side: "right", vertical: "below" }
    },
    venus: {
      through: { x: 470, y: 950 },
      radius: 32,
      orbit: { center: { x: 330, y: 870 }, aspect: 0.716, rotation: -3, wobble: 2.4, seed: 22 },
      label: { side: "right", vertical: "below" }
    },
    earth: {
      through: { x: 352, y: 650 },
      radius: 54,
      orbit: { center: { x: 300, y: 780 }, aspect: 0.577, rotation: -4, wobble: 2.6, seed: 23 },
      label: { side: "right", vertical: "below" }
    },
    mars: {
      through: { x: 560, y: 790 },
      radius: 36,
      orbit: { center: { x: 380, y: 650 }, aspect: 0.804, rotation: -3, wobble: 2.6, seed: 24 },
      label: { side: "center", vertical: "below" }
    },
    jupiter: {
      through: { x: 620, y: 560 },
      radius: 92,
      orbit: { center: { x: 330, y: 700 }, aspect: 0.806, rotation: -3, wobble: 3, seed: 25 }
    },
    saturn: {
      through: { x: 575, y: 325 },
      radius: 58,
      orbit: { center: { x: 420, y: 600 }, aspect: 0.855, rotation: -4, wobble: 3, seed: 26 },
      label: { side: "center", vertical: "below" }
    },
    uranus: {
      through: { x: 440, y: 205 },
      radius: 48,
      orbit: { center: { x: 420, y: 600 }, aspect: 1.016, rotation: -5, wobble: 3, seed: 27 }
    },
    neptune: {
      through: { x: 230, y: 150 },
      radius: 46,
      orbit: { center: { x: 420, y: 600 }, aspect: 1.221, rotation: -6, wobble: 3.2, seed: 28 },
      label: { side: "right", vertical: "above" }
    },
    pluto: {
      through: { x: 690, y: 170 },
      radius: 40,
      orbit: { center: { x: 420, y: 600 }, aspect: 1.2, rotation: -6, wobble: 3.4, seed: 29 },
      label: { side: "center", vertical: "above" }
    }
  },
  stars: { tiny: 170, medium: 22, cross: 6, seed: 3031 },
  asteroids: {
    count: 54,
    seed: 78,
    arc: { center: { x: 355, y: 675 }, rx: 300, ry: 240, rotation: -3, from: 100, to: 12 },
    spread: 20,
    scale: 0.95
  },
  satellite: { rx: 104, ry: 56, rotation: -26, duration: 12, scale: 0.34 },
  meteor: {
    from: { x: [120, 320], y: [300, 420] },
    travel: { x: [150, 220], y: [70, 110] },
    scale: 0.5
  },
  hint: { offset: { x: -70, y: -96 } },
  pointerParallax: false,
  minHitPx: 52
};

/* ---------------------------------------------------------------------------
   Mobile: 430 x 1000, Sun enters from the upper-left, planets flow downward
   --------------------------------------------------------------------------- */

const mobile: SceneLayout = {
  id: "mobile",
  viewBox: { width: 430, height: 1000 },
  preserveAspectRatio: "xMidYMid meet",
  sun: { x: -40, y: 120, radius: 210 },
  planets: {
    mercury: {
      through: { x: 205, y: 290 },
      radius: 22,
      orbit: { center: { x: 215, y: 390 }, aspect: 0.659, rotation: 8, wobble: 1.6, seed: 31 },
      label: { side: "center", vertical: "below" }
    },
    venus: {
      through: { x: 300, y: 185 },
      radius: 28,
      orbit: { center: { x: 215, y: 430 }, aspect: 1.38, rotation: 10, wobble: 1.6, seed: 32 },
      label: { side: "center", vertical: "below" }
    },
    earth: {
      through: { x: 150, y: 440 },
      radius: 44,
      orbit: { center: { x: 215, y: 590 }, aspect: 0.874, rotation: -6, wobble: 1.8, seed: 33 },
      label: { side: "right", vertical: "above" }
    },
    mars: {
      through: { x: 322, y: 340 },
      radius: 30,
      orbit: { center: { x: 215, y: 540 }, aspect: 1.238, rotation: 6, wobble: 1.8, seed: 34 },
      label: { side: "center", vertical: "above" }
    },
    jupiter: {
      through: { x: 300, y: 570 },
      radius: 78,
      orbit: { center: { x: 215, y: 700 }, aspect: 0.718, rotation: 0, wobble: 2, seed: 35 },
      label: { side: "center", vertical: "above" }
    },
    saturn: {
      through: { x: 140, y: 730 },
      radius: 48,
      orbit: { center: { x: 230, y: 600 }, aspect: 0.804, rotation: -8, wobble: 2, seed: 36 },
      label: { side: "right", vertical: "above" }
    },
    uranus: {
      through: { x: 320, y: 805 },
      radius: 40,
      orbit: { center: { x: 205, y: 560 }, aspect: 1.619, rotation: 3, wobble: 2, seed: 37 },
      label: { side: "left", vertical: "below" }
    },
    neptune: {
      through: { x: 150, y: 915 },
      radius: 40,
      orbit: { center: { x: 225, y: 620 }, aspect: 1.644, rotation: -4, wobble: 2.2, seed: 38 },
      label: { side: "right", vertical: "above" }
    },
    pluto: {
      through: { x: 350, y: 958 },
      radius: 32,
      orbit: { center: { x: 215, y: 600 }, aspect: 1.72, rotation: 2, wobble: 2.2, seed: 39 },
      label: { side: "left", vertical: "above" }
    }
  },
  stars: { tiny: 120, medium: 16, cross: 5, seed: 4041 },
  asteroids: {
    count: 36,
    seed: 79,
    arc: { center: { x: 215, y: 540 }, rx: 185, ry: 250, rotation: 0, from: 95, to: 0 },
    spread: 12,
    scale: 0.7
  },
  satellite: { rx: 74, ry: 40, rotation: -20, duration: 11, scale: 0.28 },
  meteor: {
    from: { x: [180, 330], y: [40, 110] },
    travel: { x: [90, 140], y: [50, 80] },
    scale: 0.42
  },
  hint: { offset: { x: 96, y: -8 } },
  pointerParallax: false,
  minHitPx: 48
};

export const sceneLayouts: Record<LayoutId, SceneLayout> = {
  desktop,
  "tablet-landscape": tabletLandscape,
  "tablet-portrait": tabletPortrait,
  mobile
};

export function pickLayoutId(width: number, height: number): LayoutId {
  if (width < 768) return "mobile";
  if (width < 1200) return height > width ? "tablet-portrait" : "tablet-landscape";
  return "desktop";
}
