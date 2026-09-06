import { useEffect } from "react";
import { gsap } from "gsap";

/**
 * Pauses the global GSAP ticker while the tab is hidden and resumes it when
 * the user comes back. Continuous orbit loops therefore cost nothing in the
 * background and resume from exactly where they were.
 */
export function useDocumentVisibility(): void {
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        gsap.globalTimeline.pause();
      } else {
        gsap.globalTimeline.resume();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      gsap.globalTimeline.resume();
    };
  }, []);
}
