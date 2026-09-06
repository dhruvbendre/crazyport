import type { FestivalContent } from "./types";
import { ferrin } from "./ferrin";
import { emberline } from "./emberline";
import { verdance } from "./verdance";
import { theoria } from "./theoria";
import { magnara } from "./magnara";
import { cadence } from "./cadence";
import { whimsel } from "./whimsel";
import { mnemora } from "./mnemora";
import { sonara } from "./sonara";
import { signal } from "./signal";

/** Festival content by world slug (planets.ts slugs, plus "signal"). */
export const festivalBySlug: Record<string, FestivalContent> = {
  ferrin,
  emberline,
  verdance,
  theoria,
  magnara,
  cadence,
  whimsel,
  mnemora,
  sonara,
  signal
};

export type { FestivalContent } from "./types";
