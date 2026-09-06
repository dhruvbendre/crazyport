import { useId } from "react";

/** Stable, collision-free id prefix for clipPaths inside one art instance. */
export function useArtId(name: string): string {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return `${name}-${id}`;
}
