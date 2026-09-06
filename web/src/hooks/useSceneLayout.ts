import { useEffect, useMemo, useState } from "react";
import { pickLayoutId, sceneLayouts, type LayoutId, type SceneLayout } from "../data/sceneLayouts";
import { resolveScene, type ResolvedScene } from "../data/orbitPaths";

function currentLayoutId(): LayoutId {
  if (typeof window === "undefined") return "desktop";
  return pickLayoutId(window.innerWidth, window.innerHeight);
}

/**
 * Chooses the responsive composition. Only re-renders when the *layout id*
 * changes, never on every resize pixel.
 */
export function useSceneLayout(): { layout: SceneLayout; scene: ResolvedScene; layoutId: LayoutId } {
  const [layoutId, setLayoutId] = useState<LayoutId>(currentLayoutId);

  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = currentLayoutId();
        setLayoutId((prev) => (prev === next ? prev : next));
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

  const layout = sceneLayouts[layoutId];
  const scene = useMemo(() => resolveScene(layout), [layout]);
  return { layout, scene, layoutId };
}
