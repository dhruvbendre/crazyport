import { useMediaQuery } from "./useMediaQuery";

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)", true);
}
