type Props = { width: number; height: number };

/** The black hand-coloured space field with a faint paper grain. */
export function SceneBackground({ width, height }: Props) {
  return (
    <g data-layer="background" aria-hidden="true">
      <rect x={-200} y={-200} width={width + 400} height={height + 400} fill="var(--space)" />
      <rect x={-200} y={-200} width={width + 400} height={height + 400} filter="url(#space-grain)" />
    </g>
  );
}
