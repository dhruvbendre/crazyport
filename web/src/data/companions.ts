import type { AvatarDefinition } from "@bible-strong/avatar-core";

/**
 * The companions: one small character per world.
 *
 * Each interior page has a resident who greets the visitor when the page
 * opens and then drifts down the side of the page as they scroll, so the
 * visitor is never reading alone. Their bodies are procedural avatar
 * definitions (data/avatars/*.avatar.json, exported from the avatar studio)
 * rendered by @bible-strong/avatar-react; each definition is loaded only on
 * its own page.
 *
 * Every definition shares the same animation vocabulary (waking, idle,
 * listening, thinking, searching, working, excited, bored, suspicious, angry,
 * sleeping, drowsy, happy, curious, confused, surprised, proud, shy, sad,
 * laughing, scared, playful, celebrate), so a companion's personality is
 * simply which of those it reaches for.
 */
export type CompanionMoods = {
  /** Played while the greeting is on screen. */
  greet: string;
  /** Resting between scrolls. */
  idle: string;
  /** The visitor is scrolling at a reading pace. */
  scroll: string;
  /** The visitor is scrolling fast. */
  rush: string;
  /** Played once when the visitor reaches the foot of the page. */
  arrive: string;
};

export type Companion = {
  id: string;
  name: string;
  /** One line under the name, in the world's voice. */
  tagline: string;
  /** What the companion says when the page opens. */
  greeting: string;
  moods: CompanionMoods;
  load: () => Promise<AvatarDefinition>;
};

const definition = (loader: () => Promise<{ default: unknown }>) => () => loader().then((m) => m.default as AvatarDefinition);

/** Companions by world slug (planets.ts slugs, plus "signal"). */
export const companions: Record<string, Companion> = {
  sonara: {
    id: "dhwani",
    name: "Dhwani",
    tagline: "the sound of this place",
    greeting: "Shh... hear that? That's Dhruv's playlist. I'm Dhwani. Tap a record and I'll turn it up.",
    moods: { greet: "waking", idle: "idle", scroll: "curious", rush: "excited", arrive: "celebrate" },
    load: definition(() => import("./avatars/dhwani.avatar.json"))
  },
  ferrin: {
    id: "ekallu",
    name: "Ekallu",
    tagline: "forged on the first rock",
    greeting: "Ekallu here. Tools, languages, habits. Everything else in this system gets built with what's on this rock.",
    moods: { greet: "working", idle: "idle", scroll: "searching", rush: "working", arrive: "proud" },
    load: definition(() => import("./avatars/ekallu.avatar.json"))
  },
  emberline: {
    id: "ember",
    name: "Ember",
    tagline: "still warm",
    greeting: "Follow the warm trail. I'm Ember, and I've walked every stop on it with him. Some are still glowing.",
    moods: { greet: "curious", idle: "drowsy", scroll: "curious", rush: "surprised", arrive: "happy" },
    load: definition(() => import("./avatars/ember.avatar.json"))
  },
  verdance: {
    id: "sprig",
    name: "Sprig",
    tagline: "grew from an idea",
    greeting: "Hi! I'm Sprig. Everything on this world was planted as an idea and grew into something real. Most of it is live.",
    moods: { greet: "excited", idle: "happy", scroll: "curious", rush: "excited", arrive: "celebrate" },
    load: definition(() => import("./avatars/sprig.avatar.json"))
  },
  theoria: {
    id: "tally",
    name: "Tally",
    tagline: "keeps the receipts",
    greeting: "Tally, keeper of the receipts. Certificates, awards, a publication. All counted, all real.",
    moods: { greet: "proud", idle: "idle", scroll: "thinking", rush: "suspicious", arrive: "proud" },
    load: definition(() => import("./avatars/tally.avatar.json"))
  },
  magnara: {
    id: "saga",
    name: "Saga",
    tagline: "reads like weather",
    greeting: "Sit down, this one's a story. I'm Saga. Start at the top and read it like weather: where it began, what changed, what's next.",
    moods: { greet: "happy", idle: "idle", scroll: "listening", rush: "curious", arrive: "happy" },
    load: definition(() => import("./avatars/saga.avatar.json"))
  },
  signal: {
    id: "ping",
    name: "Ping",
    tagline: "you found the signal",
    greeting: "Ping! You found the signal. I'm Ping. Say hello down there, he actually reads these.",
    moods: { greet: "surprised", idle: "idle", scroll: "curious", rush: "excited", arrive: "celebrate" },
    load: definition(() => import("./avatars/ping.avatar.json"))
  },
  whimsel: {
    id: "zest",
    name: "Zest",
    tagline: "nothing here is serious",
    greeting: "Zest here! Nothing on this planet is serious. Poke everything, some of it pokes back.",
    moods: { greet: "playful", idle: "playful", scroll: "laughing", rush: "excited", arrive: "laughing" },
    load: definition(() => import("./avatars/zest.avatar.json"))
  },
  mnemora: {
    id: "roro",
    name: "Roro",
    tagline: "keeper of the archive",
    greeting: "Roro here. I keep Dhruv's archive. Ask me anything about him; I only answer from what I hold.",
    moods: { greet: "waking", idle: "idle", scroll: "curious", rush: "searching", arrive: "happy" },
    load: definition(() => import("./avatars/roro.avatar.json"))
  }
};
