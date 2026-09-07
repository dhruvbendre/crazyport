/**
 * Content model for a festival-style world page (pages/FestivalPage.tsx).
 * One file per world under data/festival/. Everything visible on the page
 * comes from here; the page itself only knows the ten blocks and the slots.
 *
 * Copy rule (2026-09-05): clarity first, personality second. Every heading
 * says what the section is; playful lines live in taglines and flavour text.
 */
export type FestivalTheme = {
  /** Block 4 and 6 background: the world's main poster colour. */
  poster: string;
  /** Nav, footer and the colour the horizon rises out of. */
  nav: string;
  ticker: string;
  tickerInk?: string;
  /** The rounded board (block 5). */
  board: string;
  /** The four information blocks, in tile order: big-left, right-top, right-bottom, big-bottom. */
  blocks: [string, string, string, string];
  /** Offset shadow under the lineup boxes. Lolla uses blue. */
  shadow?: string;
};

/**
 * Asset hooks. Every path is optional; when absent the page falls back to the
 * world's slot pack (`/festival/<world>/NN.svg`) and the crayon planet drawn
 * in code. Fill these in when the final asset directory arrives.
 */
export type FestivalAssets = {
  /** Folder that holds the 50 numbered slot SVGs. Default: /festival/<world>/ */
  dir?: string;
  /** A finished planet image for the board. Default: the crayon planet art. */
  planetImage?: string;
  /** Per-slot overrides for the black hero band doodles (slot number → URL). */
  heroAssets?: Record<number, string>;
  /** Per-slot overrides for the poster doodles (slot number → URL). */
  posterAssets?: Record<number, string>;
  /** Per-card images by card index (project screenshots, certificate scans). */
  cardImages?: Record<number, string>;
  /** Certificate images by credential id, for Theoria. */
  certificateImages?: Record<string, string>;
};

export type LineupItem = { name: string; tier: 1 | 2 | 3 | 4 | 5; href?: string };

export type CardTab = { label: string; lead: string; items?: string[]; text?: string };

export type FestivalCard = {
  /** Stacked lockup, one word per line. */
  lockup: string[];
  meta: [string, string];
  button: { label: string; href: string };
  tabs: [CardTab, CardTab];
  /** Pattern patch slot behind the card (45 to 48). */
  patch: number;
  /** Optional image shown in the card (screenshot, certificate). Prefer assets.cardImages. */
  image?: string;
};

export type NoteBlock = { title: string; items: { q: string; a: string }[] };

export type FormField = { key: string; placeholder: string; label: string; required?: boolean };

export type FestivalForm =
  | { kind: "mail"; fields: FormField[]; submit: string; to: string; subject: string }
  | { kind: "archive"; placeholder: string; submit: string; chips: { label: string; question: string }[]; offline: string };

/** A plain statistic. Rendered as normal text, never as a counter. */
export type Stat = { value: string | number; label: string };

export type FestivalContent = {
  /** Asset folder under public/festival/. */
  world: string;
  theme: FestivalTheme;
  assets?: FestivalAssets;
  ticker: string[];
  lockup: { name: string; sub: string };
  nav: { links: { label: string; href: string }[]; cta: { label: string; to: string } };
  /**
   * The page header (2026-09-06): a small eyebrow, a plain title and one
   * sentence that says what the page holds. No slogan, no button: a visitor
   * or a recruiter should understand the page in one line.
   */
  hero: { eyebrow: string; title: string; line: string };
  lineup: LineupItem[];
  lineupFoot: string;
  /** Yellow sticker under the lineup while the data is a stand-in. */
  sampleNote?: string;
  /**
   * The board. Left: the world's name and its planet. Right: the tagline and
   * a short story of what this world says about Dhruv (2026-09-05). The
   * stats and form below are kept in the data but no longer drawn.
   */
  board: {
    category: string;
    name: string;
    tagline: string;
    /** Two or three short paragraphs, told as a story. */
    story: string[];
    stats: Stat[];
    updated?: string;
    formTitle: [string, string];
    hint: string;
    form: FestivalForm;
  };
  sticker: [string, string, string];
  /**
   * Optional row of crayon records between the board and the cards (Sonara:
   * top songs). Each disc is drawn in code with the planet's chalk outline.
   */
  discs?: {
    title: [string, string];
    foot?: string;
    items: {
      title: string;
      artist: string;
      note: string;
      hue: "pink" | "cyan" | "lavender" | "teal" | "yellow";
      href?: string;
      /** A playable track: tapping the disc plays it and the record spins. */
      audio?: string;
    }[];
  };
  /**
   * A conversation with the archive (Mnemora only). Rendered as a chat panel
   * that talks to the archive API; `starters` are the predefined questions.
   */
  chat?: {
    title: [string, string];
    /** The character who answers: its name is what the transcript shows. */
    bot: { name: string; tagline: string };
    intro: string;
    placeholder: string;
    starters: { label: string; question: string }[];
    offline: string;
  };
  cards: FestivalCard[];
  /** The notes section. Omitted on worlds where it would only repeat the cards (2026-09-07). */
  info?: {
    label: [string, string];
    blocks: [NoteBlock, NoteBlock, NoteBlock, NoteBlock];
    chips: { title: [string, string]; items: string[] };
  };
  partners: {
    rows: { key: string; items: string[]; size: "big" | "mid" | "small" }[];
    promo: { key: string; name: string; sub: string };
  };
  footer: {
    big: [string, string];
    logo: [string, string];
    sub: string;
    /** Overrides the default "Next orbit" link (Signal goes back to the system). */
    next?: { label: string; to: string };
  };
};

export const MAIL_TO = "bscit.dhruvbendre@gmail.com";
