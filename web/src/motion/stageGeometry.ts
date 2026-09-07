/**
 * Cached geometry for the pointer systems (parallax, proximity).
 *
 * `getBoundingClientRect()` and `getScreenCTM()` each force a synchronous
 * layout when called after a style write, and both pointer loops used to call
 * them on every frame. The stage only moves on resize, orientation change or
 * scroll, so the values are computed lazily once and invalidated on those
 * events instead. Shared by every consumer on the same stage.
 */
export type StageGeometry = {
  /** Client rect of the stage element. */
  rect: () => DOMRect;
  /** Client → scene-unit transform for the scene SVG. */
  toScene: (clientX: number, clientY: number) => { x: number; y: number };
  invalidate: () => void;
  kill: () => void;
};

export function createStageGeometry(stage: HTMLElement, svg: SVGSVGElement): StageGeometry {
  let rect: DOMRect | null = null;
  let inverse: DOMMatrix | null = null;
  const scratch = new DOMPoint();

  const invalidate = () => {
    rect = null;
    inverse = null;
  };

  const onChange = () => invalidate();
  window.addEventListener("resize", onChange, { passive: true });
  window.addEventListener("orientationchange", onChange, { passive: true });
  window.addEventListener("scroll", onChange, { passive: true, capture: true });

  return {
    rect() {
      if (!rect) rect = stage.getBoundingClientRect();
      return rect;
    },
    toScene(clientX, clientY) {
      if (!inverse) {
        const ctm = svg.getScreenCTM();
        inverse = ctm ? ctm.inverse() : new DOMMatrix();
      }
      scratch.x = clientX;
      scratch.y = clientY;
      const p = scratch.matrixTransform(inverse);
      return { x: p.x, y: p.y };
    },
    invalidate,
    kill() {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("orientationchange", onChange);
      window.removeEventListener("scroll", onChange, { capture: true });
    }
  };
}
