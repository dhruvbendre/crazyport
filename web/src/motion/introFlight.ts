import { gsap } from "./gsapSetup";

export type IntroFlightOptions = {
  root: HTMLElement;
  ufo: HTMLElement;
  /** The text block; every `[data-char]` inside it is one revealable glyph. */
  text: HTMLElement;
  reducedMotion: boolean;
  /** The reveal is complete and the page underneath may mount. */
  onReveal: () => void;
  /** The overlay has faded out and can be removed. */
  onDone: () => void;
};

export type IntroFlight = {
  /** Jump to the end of the reveal (user skipped). */
  skip: () => void;
  kill: () => void;
};

/** Seconds the saucer takes for its single crossing. */
const PASS = 2.7;
/** Seconds the finished text stays on screen before the handoff. */
const HOLD = 1.7;
/** Seconds per glyph while a character rolls through random letters. */
const ROLL_STEP = 0.07;

/** Alien-looking fillers: kana, kanji, Devanagari, Greek, Cyrillic, Latin, digits. */
const GLYPHS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん" +
  "宇宙星空月光風雷火水木金土日夢愛道力心" +
  "अआइईउऊएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह" +
  "ΑΒΓΔΘΛΞΠΣΦΨΩαβγδθλξπσφψω" +
  "БГДЖЗИЛФЦЧШЩЭЮЯ" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%&";

function randomGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/** Fonts settle (or 1.5 s pass) before anything is measured. */
function whenFontsReady(): Promise<void> {
  const ready = typeof document !== "undefined" && document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve();
  return Promise.race([ready, new Promise<void>((r) => setTimeout(r, 1500))]);
}

/**
 * The opening: a crayon saucer makes one crossing from left to right. As its
 * beam passes each character, the character appears as a random foreign
 * glyph and rolls down through a few more before settling on the real
 * letter, so the greeting decodes itself in the saucer's wake. A short hold,
 * then the overlay fades while the solar system draws itself in underneath.
 */
export function createIntroFlight(o: IntroFlightOptions): IntroFlight {
  const { root, ufo, text } = o;
  const chars = Array.from(text.querySelectorAll<HTMLElement>("[data-char]"));
  const rolls: gsap.core.Timeline[] = [];
  let tl: gsap.core.Timeline | null = null;
  let finished = false;
  let killed = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    o.onReveal();
    gsap.to(root, { opacity: 0, duration: 0.75, ease: "power2.inOut", onComplete: o.onDone });
  };

  const settleAll = () => {
    for (const r of rolls) r.kill();
    for (const el of chars) {
      el.textContent = el.dataset.char === " " ? " " : (el.dataset.char ?? "");
      gsap.set(el, { opacity: 1, yPercent: 0 });
    }
  };

  const roll = (el: HTMLElement) => {
    const real = el.dataset.char ?? "";
    if (real === " ") {
      gsap.set(el, { opacity: 1 });
      return;
    }
    const steps = 3 + Math.floor(Math.random() * 3);
    const r = gsap.timeline();
    for (let i = 0; i < steps; i++) {
      r.call(() => void (el.textContent = randomGlyph()), undefined, i * ROLL_STEP);
      r.fromTo(el, { yPercent: -55, opacity: 0.45 }, { yPercent: 0, opacity: 1, duration: ROLL_STEP, ease: "none" }, i * ROLL_STEP);
    }
    r.call(() => void (el.textContent = real), undefined, steps * ROLL_STEP);
    r.fromTo(el, { yPercent: -55, opacity: 0.6 }, { yPercent: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, steps * ROLL_STEP);
    rolls.push(r);
  };

  // Every glyph starts invisible and keeps the width of its real character,
  // so rolling through wider or narrower letters never reflows the line.
  gsap.set(chars, { opacity: 0 });

  if (o.reducedMotion) {
    gsap.set(ufo, { opacity: 0 });
    tl = gsap.timeline({ onComplete: finish });
    tl.to(chars, { opacity: 1, duration: 0.6, stagger: 0.004 }, 0.2);
    tl.to({}, { duration: 2.2 });
    return {
      skip: () => tl?.progress(1),
      kill: () => tl?.kill()
    };
  }

  void whenFontsReady().then(() => {
    if (killed) return;
    if (finished) return;

    const centres = chars.map((el) => {
      const r = el.getBoundingClientRect();
      el.style.width = `${r.width}px`;
      return r.left + r.width / 2;
    });
    const textRect = text.getBoundingClientRect();
    const ufoWidth = ufo.getBoundingClientRect().width || 300;
    const width = root.clientWidth;

    gsap.set(ufo, { opacity: 1, xPercent: -50, yPercent: -50 });
    const flight = { x: -ufoWidth, y: textRect.top + textRect.height * 0.42, tilt: -7, bob: 0 };
    const apply = () => gsap.set(ufo, { x: flight.x, y: flight.y + Math.sin(flight.bob) * 9, rotation: flight.tilt });
    apply();

    const revealed = new Array<boolean>(chars.length).fill(false);
    tl = gsap.timeline({ onComplete: finish });
    tl.to(
      flight,
      {
        x: width + ufoWidth,
        duration: PASS,
        ease: "power1.inOut",
        onUpdate: () => {
          apply();
          // The beam trails a little behind the saucer's nose.
          const beam = flight.x - ufoWidth * 0.2;
          for (let i = 0; i < chars.length; i++) {
            if (!revealed[i] && centres[i] < beam) {
              revealed[i] = true;
              roll(chars[i]);
            }
          }
        }
      },
      0.3
    );
    tl.to(flight, { bob: Math.PI * 7, duration: PASS + 0.3, ease: "none" }, 0);
    tl.to(flight, { tilt: -3, duration: PASS + 0.3, ease: "sine.inOut" }, 0);
    tl.to({}, { duration: HOLD });
  });

  return {
    skip: () => {
      if (finished) return;
      settleAll();
      if (tl) tl.progress(1);
      else finish();
    },
    kill: () => {
      killed = true;
      tl?.kill();
      for (const r of rolls) r.kill();
    }
  };
}
