import { useEffect, useMemo, useState } from "react";
import { pickLayoutId, sceneLayouts, type LayoutId, type SceneLayout } from "../data/sceneLayouts";
import { resolveScene, type ResolvedScene } from "../data/orbitPaths";

type Choice = { layoutId: LayoutId; rotated: boolean };

/** Portrait viewports narrower than this show the landscape composition turned sideways. */
const ROTATE_BELOW = 768;

/**
 * The composition for a rotated phone. The rotated box is (height × width)
 * of the viewport, and it must always get the wide desktop composition:
 * on a real phone the inner height is often under the mobile breakpoint
 * (iPhone Safari reports ~660px with its toolbars), and feeding that to
 * `pickLayoutId` as a width chose the tall mobile layout, which then got
 * turned sideways and letterboxed (2026-09-07). The tablet-landscape layout
 * is the desktop composition with touch tuning (bigger hit targets, no
 * pointer parallax), so it is the phone's default.
 */
function pickRotatedLayoutId(longSide: number): LayoutId {
  return longSide >= 1200 ? "desktop" : "tablet-landscape";
}

function currentChoice(): Choice {
  if (typeof window === "undefined") return { layoutId: "desktop", rotated: false };
  const w = window.innerWidth;
  const h = window.innerHeight;
  // A phone held upright: the stage is rotated 90° so the visitor sees the
  // same wide composition as on a desktop (2026-09-06).
  if (w < ROTATE_BELOW && h > w) return { layoutId: pickRotatedLayoutId(h), rotated: true };
  return { layoutId: pickLayoutId(w, h), rotated: false };
}

/**
 * Chooses the responsive composition. Only re-renders when the *layout id*
 * or the rotation changes, never on every resize pixel.
 */
export function useSceneLayout(): { layout: SceneLayout; scene: ResolvedScene; layoutId: LayoutId; rotated: boolean } {
  const [choice, setChoice] = useState<Choice>(currentChoice);

  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = currentChoice();
        setChoice((prev) => (prev.layoutId === next.layoutId && prev.rotated === next.rotated ? prev : next));
      });
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  const layout = sceneLayouts[choice.layoutId];
  const scene = useMemo(() => resolveScene(layout), [layout]);
  return { layout, scene, layoutId: choice.layoutId, rotated: choice.rotated };
}
