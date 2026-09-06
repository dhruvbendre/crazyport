import { useMemo } from "react";
import { chalkRule } from "../../art/chalk";

/**
 * A wavy chalk rule. Drawn at a fixed logical width and stretched to the
 * container; the stroke keeps its pixel width so it never looks smeared.
 */
export function ChalkRule({ seed, className }: { seed: number; className?: string }) {
  const d = useMemo(() => chalkRule(600, seed), [seed]);
  return (
    <svg className={className} viewBox="-2 -6 604 12" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
