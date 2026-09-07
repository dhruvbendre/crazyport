import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { gsap, useGSAP } from "../../motion/gsapSetup";
import { planetById, planets, type PlanetConfig, type PlanetId } from "../../data/planets";
import type { SceneLayout } from "../../data/sceneLayouts";
import type { ResolvedScene } from "../../data/orbitPaths";
import { createOrbitEngine, type OrbitEngine } from "../../motion/orbitMotion";
import { planetHoverIn, planetHoverOut } from "../../motion/hoverMotion";
import { playSceneIntro } from "../../motion/sceneIntro";
import { createEnvironmentMotion } from "../../motion/environmentMotion";
import { createCursorMotion } from "../../motion/cursorMotion";
import { createPlanetInteraction, type InteractionSource, type PlanetInteractionController } from "../../motion/planetInteraction";
import { createPlanetProximity } from "../../motion/planetProximity";
import { createStageGeometry } from "../../motion/stageGeometry";
import { prefetchWorldPages } from "../../app/lazyPages";
import { consumeReturning, loadOrbitSnapshot, saveOrbitSnapshot } from "../../motion/orbitState";
import { usePlanetNavigation } from "../../hooks/usePlanetNavigation";
import { useFinePointer } from "../../hooks/useReducedMotion";
import { dismissHint, isHintDismissed } from "../../utils/accessibility";
import { SceneContext, type SceneContextValue } from "./SceneContext";
import { SceneDefs } from "./SceneDefs";
import { SceneBackground } from "./SceneBackground";
import { StarField } from "./StarField";
import { OrbitLayer } from "./OrbitLayer";
import { AsteroidBelt } from "./AsteroidBelt";
import { SunNode } from "./SunNode";
import { PlanetNavigator } from "./PlanetNavigator";
import { Meteor } from "./Meteor";
import { NavigationHint } from "./NavigationHint";
import { PlanetLabels } from "./PlanetLabels";
import { DebugGrid, DebugPanel } from "./DebugOverlay";

export const DEBUG_SOLAR_SYSTEM = import.meta.env.VITE_DEBUG_SOLAR === "true";

type Props = {
  layout: SceneLayout;
  scene: ResolvedScene;
  reducedMotion: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  onLockChange: (locked: boolean) => void;
};

/**
 * Owns the master SVG and orchestrates every motion system. It contains no
 * drawing details for individual bodies: art lives in the registry, geometry
 * in the layouts, and each motion concern in its own module.
 */
export function SolarSystemScene({ layout, scene, reducedMotion, stageRef, onLockChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const engineRef = useRef<OrbitEngine | null>(null);
  const interactionRef = useRef<PlanetInteractionController | null>(null);
  const finePointer = useFinePointer();
  // Touch layouts always show every world label (there is no hover); desktop
  // reveals them on hover / focus unless the pointer itself is coarse.
  const persistentLabels = !finePointer || layout.id !== "desktop";
  const [unitScale, setUnitScale] = useState(1);
  const [hintVisible, setHintVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [activePlanet, setActivePlanet] = useState<PlanetId | null>(null);
  const hintArmed = useRef(!isHintDismissed());

  /* ---- rendered scale (px per scene unit), updated only on resize ------- */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    // Layout size, not the bounding box: the stage may be rotated 90° on phones.
    // The observer hands us the size it already computed, so no forced layout.
    const measure = (width: number, height: number) => {
      const sx = width / layout.viewBox.width;
      const sy = height / layout.viewBox.height;
      const s = layout.preserveAspectRatio === "xMidYMid slice" ? Math.max(sx, sy) : Math.min(sx, sy);
      setUnitScale((prev) => (Math.abs(prev - s) < 0.002 ? prev : s));
    };
    measure(svg.clientWidth, svg.clientHeight);
    const ro = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) measure(box.width, box.height);
    });
    ro.observe(svg);
    return () => ro.disconnect();
  }, [layout]);

  /* ---- hint ---------------------------------------------------------------- */
  const hideHint = useCallback(() => {
    if (!hintArmed.current) return;
    hintArmed.current = false;
    dismissHint();
    setHintVisible(false);
  }, []);

  /* ---- hover / focus ------------------------------------------------------- */
  const hoverTargets = useCallback(
    (id: PlanetId) => {
      const svg = svgRef.current;
      if (!svg) return null;
      const wrapper = svg.querySelector<SVGGElement>(`[data-orbit-wrapper="${id}"]`);
      const hoverWrapper = wrapper?.querySelector<SVGGElement>("[data-hover-wrapper]");
      if (!wrapper || !hoverWrapper) return null;
      return {
        hoverWrapper,
        microWrapper: wrapper.querySelector<SVGGElement>("[data-micro-wrapper]"),
        orbitPath: svg.querySelector<SVGPathElement>(`[data-orbit-path="${id}"]`),
        chalk: hoverWrapper.querySelector<SVGGElement>("[data-chalk]"),
        chalkEmphasis: hoverWrapper.querySelector<SVGPathElement>("[data-chalk-emphasis]"),
        chalkDust: hoverWrapper.querySelector<SVGGElement>("[data-chalk-dust]"),
        label: svg.querySelector<SVGGElement>(`[data-planet-label="${id}"] [data-label-inner]`),
        persistentLabel: persistentLabels,
        reducedMotion
      };
    },
    [reducedMotion, persistentLabels]
  );

  const setPlanetActive = useCallback(
    (id: PlanetId, active: boolean, source: InteractionSource) => {
      const targets = hoverTargets(id);
      if (!targets) return;
      engineRef.current?.setSlow(id, active);
      interactionRef.current?.setActive(id, active, source);
      if (active) {
        prefetchWorldPages();
        planetHoverIn(targets);
        // The active id only feeds the debug panel: keep every hover in and
        // out from re-rendering the ~1,400-element scene in production.
        if (DEBUG_SOLAR_SYSTEM) setActivePlanet(id);
        hideHint();
      } else {
        planetHoverOut(targets);
        if (DEBUG_SOLAR_SYSTEM) setActivePlanet((prev) => (prev === id ? null : prev));
      }
    },
    [hideHint, hoverTargets]
  );
  const onPlanetHover = useCallback((id: PlanetId, active: boolean) => setPlanetActive(id, active, "pointer"), [setPlanetActive]);
  const onPlanetFocus = useCallback((id: PlanetId, active: boolean) => setPlanetActive(id, active, "focus"), [setPlanetActive]);
  const onPlanetTap = useCallback((id: PlanetId) => interactionRef.current?.tap(id), []);
  const onPlanetBurst = useCallback((id: PlanetId) => interactionRef.current?.burst(id), []);

  /* ---- navigation ---------------------------------------------------------- */
  const onBeforeLeave = useCallback(() => {
    hideHint();
    const engine = engineRef.current;
    if (engine) saveOrbitSnapshot(engine.getProgress(), layout.id);
  }, [hideHint, layout.id]);

  const navigateToPlanet = usePlanetNavigation({ svgRef, reducedMotion, onBeforeLeave });

  /* ---- motion lifecycle ---------------------------------------------------- */
  useGSAP(
    () => {
      const svg = svgRef.current;
      // Layout effects run child-first, so the parent's ref is not attached yet.
      // Resolve the stage from the DOM instead.
      const stage = svg?.closest<HTMLElement>("[data-stage]") ?? stageRef.current;
      if (!svg || !stage) return;

      const snapshot = loadOrbitSnapshot(layout.id);
      const isReturn = consumeReturning() || snapshot !== null;

      const engine = createOrbitEngine({ svg, scene, initialProgress: snapshot, reducedMotion });
      engineRef.current = engine;
      if (import.meta.env.DEV) {
        (window as unknown as { __solar?: Record<string, unknown> }).__solar = {
          ...(window as unknown as { __solar?: Record<string, unknown> }).__solar,
          engine
        };
      }

      const environment = createEnvironmentMotion({ svg, layout, reducedMotion });
      // One cached client→scene transform shared by every pointer system.
      const geometry = createStageGeometry(stage, svg);
      const cursor =
        layout.pointerParallax && finePointer && !reducedMotion ? createCursorMotion({ stage, svg, geometry }) : null;
      // Planet zone reactions (doodles, pulse, UFO thoughts) and the "near" ring around each body.
      const interaction = createPlanetInteraction({ svg, reducedMotion });
      interactionRef.current = interaction;
      const proximity =
        finePointer && !reducedMotion
          ? createPlanetProximity({ stage, svg, geometry, onNear: (id) => interaction.setNear(id) })
          : null;

      onLockChange(true);
      const intro = playSceneIntro({
        svg,
        stage,
        layout,
        mode: isReturn ? "return" : "first",
        reducedMotion,
        onOrbitsStart: () => engine.start(0, isReturn ? 0.8 : 1.4),
        onInteractive: () => {
          onLockChange(false);
          setInteractive(true);
          // Warm the world-page chunk while the visitor is still looking.
          const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
          if (idle) idle(() => prefetchWorldPages(), { timeout: 4000 });
          else setTimeout(prefetchWorldPages, 2500);
        },
        onHintTime: () => {
          if (hintArmed.current) setHintVisible(true);
        }
      });

      return () => {
        // Remember where everything was so a return continues the universe.
        // (Only once the orbits actually ran: StrictMode remounts must not
        // turn the very first visit into a return trip.)
        if (engine.started) saveOrbitSnapshot(engine.getProgress(), layout.id);
        intro.kill();
        proximity?.kill();
        interaction.kill();
        interactionRef.current = null;
        cursor?.kill();
        geometry.kill();
        environment.kill();
        engine.kill();
        engineRef.current = null;
        gsap.killTweensOf(svg);
      };
    },
    { scope: svgRef, dependencies: [layout, scene, reducedMotion, finePointer] }
  );

  /* ---- context ------------------------------------------------------------- */
  const value = useMemo<SceneContextValue>(
    () => ({
      layout,
      scene,
      reducedMotion,
      unitScale,
      persistentLabels,
      debug: DEBUG_SOLAR_SYSTEM,
      onPlanetHover,
      onPlanetFocus,
      onPlanetTap,
      onPlanetBurst,
      navigateToPlanet: (planet: PlanetConfig) => navigateToPlanet(planetById[planet.id])
    }),
    [layout, scene, reducedMotion, unitScale, persistentLabels, onPlanetHover, onPlanetFocus, onPlanetTap, onPlanetBurst, navigateToPlanet]
  );

  const { width, height } = layout.viewBox;

  return (
    <SceneContext.Provider value={value}>
      <svg
        ref={svgRef}
        className="stage__scene"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio={layout.preserveAspectRatio}
        role="group"
        aria-label="Solar system navigation. Each world is a link to a part of Dhruv Bendre's portfolio."
        data-interactive={interactive ? "true" : "false"}
        data-layout={layout.id}
      >
        <SceneDefs />
        <SceneBackground width={width} height={height} />
        <StarField layout={layout} />
        <OrbitLayer scene={scene} />
        <AsteroidBelt layout={layout} />
        <PlanetNavigator />
        <SunNode />
        <g data-layer="environment" data-dimmable>
          <Meteor />
        </g>
        <PlanetLabels />
        <NavigationHint visible={hintVisible} />
        {DEBUG_SOLAR_SYSTEM && <DebugGrid />}
      </svg>
      {DEBUG_SOLAR_SYSTEM && <DebugPanel active={activePlanet} layoutId={layout.id} unitScale={unitScale} />}
      <ul className="visually-hidden">
        {planets.map((p) => (
          <li key={p.id}>
            {p.catalog} · {p.name}: {p.section}
          </li>
        ))}
      </ul>
    </SceneContext.Provider>
  );
}
