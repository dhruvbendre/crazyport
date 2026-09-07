import { useEffect } from "react";
import { gsap } from "gsap";

/**
 * Pauses the global GSAP ticker while the tab is hidden and resumes it when
 * the user comes back. Continuous orbit loops therefore cost nothing in the
 * background and resume from exactly where they were.
 */
export function useDocumentVisibility(): void {
  useEffect(() => {
    // The global timeline holds the tweens; gsap.ticker.add() callbacks (the
    // cursor saucer, the scroll companion) live outside it, so the ticker is
    // put to sleep as well or they would keep computing against frozen tweens
    // and jump on return.
    const onVisibility = () => {
      if (document.hidden) {
        gsap.globalTimeline.pause();
        gsap.ticker.sleep();
      } else {
        gsap.ticker.wake();
        gsap.globalTimeline.resume();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      gsap.ticker.wake();
      gsap.globalTimeline.resume();
    };
  }, []);
}
