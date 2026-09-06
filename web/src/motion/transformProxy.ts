/**
 * Origin-exact SVG transforms.
 *
 * Planet artwork is centred on the origin of its wrapper `<g>`, so scaling and
 * rotating around (0,0) is exactly what we want. GSAP's transformOrigin logic
 * for SVG is bounding-box based, which drifts slightly for asymmetric art such
 * as Saturn's rings. A tiny proxy object tweened by GSAP and written to the
 * `transform` attribute keeps every transform anchored to the true centre.
 */
export type TransformProxy = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  el: SVGGraphicsElement;
  apply: () => void;
};

const registry = new WeakMap<SVGGraphicsElement, TransformProxy>();

export function getTransformProxy(el: SVGGraphicsElement): TransformProxy {
  const existing = registry.get(el);
  if (existing) return existing;

  const proxy: TransformProxy = {
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    el,
    apply() {
      const parts: string[] = [];
      if (proxy.x !== 0 || proxy.y !== 0) parts.push(`translate(${proxy.x.toFixed(2)} ${proxy.y.toFixed(2)})`);
      if (proxy.rotation !== 0) parts.push(`rotate(${proxy.rotation.toFixed(3)})`);
      if (proxy.scale !== 1) parts.push(`scale(${proxy.scale.toFixed(4)})`);
      el.setAttribute("transform", parts.join(" "));
    }
  };
  registry.set(el, proxy);
  return proxy;
}
