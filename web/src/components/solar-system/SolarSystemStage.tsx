import { useEffect, useRef, useState } from "react";
import { useSceneLayout } from "../../hooks/useSceneLayout";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { subscribeTransitionLock } from "../../motion/routeTransitions";
import { SolarSystemScene } from "./SolarSystemScene";
import { SignalMark } from "./SignalMark";

/**
 * The stage: a full-viewport black space window holding the scene. On a
 * phone held upright the whole stage is turned 90° (CSS, .stage--rotated) so
 * the visitor sees the wide composition instead of a stacked one.
 */
export function SolarSystemStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { layout, scene, layoutId, rotated } = useSceneLayout();
  const reducedMotion = useReducedMotion();
  const [locked, setLocked] = useState(true);

  useEffect(() => subscribeTransitionLock(setLocked), []);

  return (
    <div
      ref={stageRef}
      className={`stage stage--${layoutId}${rotated ? " stage--rotated" : ""}`}
      data-stage
      data-locked={locked ? "true" : "false"}
      data-layout={layoutId}
      data-rotated={rotated ? "true" : undefined}
    >
      <div className="stage__window" data-space-window>
        <SolarSystemScene
          key={layoutId}
          layout={layout}
          scene={scene}
          reducedMotion={reducedMotion}
          stageRef={stageRef}
          onLockChange={setLocked}
        />
      </div>
      <SignalMark />
    </div>
  );
}
