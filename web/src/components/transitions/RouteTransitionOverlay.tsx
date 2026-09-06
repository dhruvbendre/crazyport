import { useEffect, useRef } from "react";
import { registerRouteOverlay } from "../../motion/routeTransitions";

/**
 * A fixed, pointer-transparent layer used by route transitions: an accent
 * colour disc that grows from the selected planet, and a paper veil used for
 * the shorter return trip. Registered once, animated imperatively by GSAP.
 */
export function RouteTransitionOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current && discRef.current && veilRef.current) {
      registerRouteOverlay({ root: rootRef.current, disc: discRef.current, veil: veilRef.current });
    }
    return () => registerRouteOverlay(null);
  }, []);

  return (
    <div ref={rootRef} className="route-overlay" data-active="false" aria-hidden="true">
      <div ref={veilRef} className="route-overlay__veil" />
      <div ref={discRef} className="route-overlay__disc" />
    </div>
  );
}
