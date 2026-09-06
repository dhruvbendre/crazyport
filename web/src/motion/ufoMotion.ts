import { gsap } from "./gsapSetup";
import { clamp } from "../utils/clamp";
import { createRng } from "../utils/seededRandom";
import { subscribeAttention } from "./ufoAttention";

type Options = {
  root: HTMLElement;
  ship: HTMLElement;
  flames: SVGGElement;
  embers: SVGCircleElement[];
};

export type UfoMotion = {
  /** Where the ship actually is on screen right now (after its lag). */
  position: () => { x: number; y: number };
  kill: () => void;
};

/**
 * Cursor-following UFO.
 *
 * The saucer chases the pointer with a soft lag, banks into its horizontal
 * velocity and bobs gently. The crayon flame exhaust under it flickers every
 * frame and grows with speed; ember dots are recycled behind the ship when it
 * moves. Desktop pointers only; the caller decides when to mount it.
 *
 * The UFO is also a character: while the scene reports that the pointer is
 * near or on a planet (ufoAttention), the ship slows its chase, leans a few
 * degrees toward the body, bobs a little more and keeps its embers tighter.
 * A curious observer, never a wild one.
 */
export function createUfoMotion({ root, ship, flames, embers }: Options): UfoMotion {
  const toX = gsap.quickTo(root, "x", { duration: 0.55, ease: "power3.out" });
  const toY = gsap.quickTo(root, "y", { duration: 0.55, ease: "power3.out" });
  const toTilt = gsap.quickTo(ship, "rotation", { duration: 0.4, ease: "power2.out" });

  const rng = createRng(2025);
  const tongues = Array.from(flames.querySelectorAll<SVGPathElement>("path"));
  const emberState = embers.map(() => ({ life: 0, x: 0, y: 0, vx: 0, vy: 0 }));

  let targetX = -200;
  let targetY = -200;
  let lastX = -200;
  let lastY = -200;
  let speed = 0;
  let visible = false;
  let seen = false;
  let bob = 0;
  let emberCursor = 0;
  // Attention: 0 = plain cursor companion, 0.5 = near a planet, 1 = on it.
  let attention = 0;
  let attentionTarget = 0;
  let planetX: number | null = null;
  let followX = -200;
  let followY = -200;
  const unsubscribe = subscribeAttention((a) => {
    attentionTarget = a.zone === "active" ? 1 : a.zone === "near" ? 0.5 : 0;
    planetX = a.center ? a.center.x : null;
  });

  const show = () => {
    if (visible) return;
    visible = true;
    gsap.to(root, { opacity: 1, duration: 0.35, overwrite: "auto" });
  };
  const hide = () => {
    if (!visible) return;
    visible = false;
    gsap.to(root, { opacity: 0, duration: 0.25, overwrite: "auto" });
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    targetX = event.clientX;
    targetY = event.clientY;
    if (!seen) {
      seen = true;
      gsap.set(root, { x: targetX, y: targetY });
      lastX = targetX;
      lastY = targetY;
      followX = targetX;
      followY = targetY;
    }
    show();
  };
  const onLeave = (event: PointerEvent) => {
    if (event.relatedTarget === null) hide();
  };

  const tick = (_t: number, deltaMs: number) => {
    if (!seen) return;
    const dt = Math.min(deltaMs / 1000, 0.05);
    // Where the ship actually is (after its lag).
    const x = Number(gsap.getProperty(root, "x")) || 0;
    const y = Number(gsap.getProperty(root, "y")) || 0;
    const vx = (x - lastX) / Math.max(dt, 0.001);
    const vy = (y - lastY) / Math.max(dt, 0.001);
    lastX = x;
    lastY = y;
    const v = Math.hypot(vx, vy);
    speed += (v - speed) * 0.15;

    // Attention settles over ~0.4 s so entering and leaving a zone never snaps.
    attention += (attentionTarget - attention) * Math.min(1, dt * 6);

    // Chase the pointer, hovering slightly above-left of it so the cursor stays
    // clear. Near a planet the chase slows: the follow point lags the pointer
    // a little more before the usual quickTo lag is applied on top.
    const chase = 1 - attention * 0.55;
    followX += (targetX - followX) * Math.min(1, chase * dt * 30);
    followY += (targetY - followY) * Math.min(1, chase * dt * 30);
    toX(followX - 26);
    toY(followY - 30);

    // Bank into horizontal motion, bob while idle. On a planet the bob deepens
    // slightly and the ship leans toward the body it is looking at.
    bob += dt;
    const idleBob = Math.sin(bob * (2.2 + attention * 0.6)) * (2 + attention * 1.4);
    const lean = planetX === null ? 0 : clamp((planetX - x) * 0.05, -7, 7) * attention;
    toTilt(clamp(vx * 0.012, -14, 14) + lean);
    gsap.set(ship, { y: idleBob });

    // Flames: flicker each frame, longer with speed.
    const intensity = clamp(0.35 + speed / 900, 0.35, 1.6);
    tongues.forEach((tongue, i) => {
      const flicker = 0.75 + rng.next() * 0.5;
      const s = intensity * flicker * (i === 1 ? 1.15 : 0.9);
      tongue.setAttribute("transform", `scale(${(0.9 + rng.next() * 0.2).toFixed(2)} ${s.toFixed(2)})`);
      tongue.setAttribute("opacity", (0.55 + rng.next() * 0.4).toFixed(2));
    });

    // Embers: spawn behind the ship while moving, drift down and fade.
    if (speed > 120 && rng.chance(clamp(speed / 1500, 0.15, 0.7))) {
      const e = emberState[emberCursor];
      emberCursor = (emberCursor + 1) % emberState.length;
      e.life = 1;
      e.x = (rng.next() - 0.5) * 18;
      e.y = 22;
      // The trail tightens while the ship is paying attention to a planet.
      e.vx = -vx * 0.01 + (rng.next() - 0.5) * (30 - attention * 16);
      e.vy = 40 + rng.next() * 40;
    }
    emberState.forEach((e, i) => {
      const el = embers[i];
      if (e.life <= 0) {
        el.setAttribute("opacity", "0");
        return;
      }
      e.life -= dt * 1.6;
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      el.setAttribute("cx", e.x.toFixed(1));
      el.setAttribute("cy", e.y.toFixed(1));
      el.setAttribute("r", (1.2 + e.life * 2.2).toFixed(2));
      el.setAttribute("opacity", Math.max(0, e.life).toFixed(2));
    });
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerout", onLeave);
  gsap.ticker.add(tick);

  return {
    position() {
      return { x: Number(gsap.getProperty(root, "x")) || 0, y: Number(gsap.getProperty(root, "y")) || 0 };
    },
    kill() {
      unsubscribe();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
      gsap.ticker.remove(tick);
      gsap.killTweensOf([root, ship]);
    }
  };
}
