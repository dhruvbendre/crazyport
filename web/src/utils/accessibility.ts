const HINT_KEY = "solar:hint-dismissed";

export function isHintDismissed(): boolean {
  try {
    return sessionStorage.getItem(HINT_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissHint(): void {
  try {
    sessionStorage.setItem(HINT_KEY, "1");
  } catch {
    /* storage unavailable: hint simply reappears next load */
  }
}

/** Media query helpers evaluated at call time (safe on the server). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
