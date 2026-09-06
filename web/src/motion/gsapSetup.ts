import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

/** Central plugin registration. Import this module once from main.tsx. */
gsap.registerPlugin(MotionPathPlugin, useGSAP);

gsap.defaults({ ease: "power2.out", overwrite: "auto" });

if (import.meta.env.DEV && typeof window !== "undefined") {
  // Dev-only handle for debugging motion state from the console / QA scripts.
  (window as unknown as { __solar?: { gsap: typeof gsap } }).__solar = { gsap };
}

export { gsap, useGSAP };
