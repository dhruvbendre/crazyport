/**
 * Shared SVG definitions for the master scene: crayon roughness for orbit
 * lines, a faint paper grain for the space field, and the two chalk finishes.
 * Kept deliberately light so nothing here costs frame time during continuous
 * animation.
 */
import { CrayonDefs } from "../../art/CrayonMarks";

/** Chalk filters, also used by interior pages (rendered once per page). */
export function ChalkDefs() {
  return (
    <defs>
      {/*
        Powder finish: a low-frequency warp bends the stroke like a hand that
        does not travel perfectly, and a high-frequency speckle punches tiny
        holes in it so the opacity is uneven along the line.
      */}
      <filter id="chalk-grain" x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="5" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="bent" />
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="13" result="speckle" />
        <feColorMatrix in="speckle" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.2 -0.45" result="speckleAlpha" />
        <feComposite in="bent" in2="speckleAlpha" operator="in" result="powder" />
        <feGaussianBlur in="powder" stdDeviation="0.22" />
      </filter>
      {/* Cheaper finish for bodies that transform every frame: a whisper of blur only. */}
      <filter id="chalk-soft" x="-6%" y="-6%" width="112%" height="112%">
        <feGaussianBlur stdDeviation="0.35" />
      </filter>
    </defs>
  );
}

export function SceneDefs() {
  return (
    <>
      <CrayonDefs />
      <ChalkDefs />
      <defs>
        <filter id="crayon-roughness" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="11" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="space-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="9" result="noise" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.9  0 0 0 0 0.88  0 0 0 0 0.8  0 0 0 0.05 0"
          />
        </filter>
      </defs>
    </>
  );
}
