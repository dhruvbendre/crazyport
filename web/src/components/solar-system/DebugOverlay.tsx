import { planets } from "../../data/planets";
import { useScene } from "./SceneContext";

/** Coordinate grid, orbit ids and start progress. Rendered only when DEBUG is on. */
export function DebugGrid() {
  const { layout, scene } = useScene();
  const { width, height } = layout.viewBox;
  const step = 100;
  const xs: number[] = [];
  const ys: number[] = [];
  for (let x = 0; x <= width; x += step) xs.push(x);
  for (let y = 0; y <= height; y += step) ys.push(y);
  return (
    <g className="debug-grid" aria-hidden="true">
      {xs.map((x) => (
        <g key={`x${x}`}>
          <line x1={x} y1={0} x2={x} y2={height} />
          <text x={x + 3} y={12}>{x}</text>
        </g>
      ))}
      {ys.map((y) => (
        <g key={`y${y}`}>
          <line x1={0} y1={y} x2={width} y2={y} />
          <text x={3} y={y - 3}>{y}</text>
        </g>
      ))}
      {planets.map((p) => {
        const o = scene.orbits[p.id];
        return (
          <text key={p.id} x={o.start.x + 6} y={o.start.y - 6} fill="#ff4fa3">
            {o.id}
          </text>
        );
      })}
    </g>
  );
}

export function DebugPanel({ active, layoutId, unitScale }: { active: string | null; layoutId: string; unitScale: number }) {
  const { scene } = useScene();
  const lines = [
    `layout: ${layoutId}`,
    `unitScale: ${unitScale.toFixed(3)} px/unit`,
    `active: ${active ?? "-"}`,
    ...planets.map((p) => `${p.id.padEnd(8)} start=${scene.orbits[p.id].startProgress.toFixed(3)} z=${p.zIndex}`)
  ];
  return <div className="debug-panel">{lines.join("\n")}</div>;
}
