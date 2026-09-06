/**
 * Sonara: Dhruv's favourite music, laid out like a festival poster.
 *
 * SAMPLE_LINEUP is true while these entries are stand-ins. Replace every
 * artist, stage and note below with Dhruv's real favourites, then flip it to
 * false and the "sample lineup" sticker disappears from the page.
 */
export const SAMPLE_LINEUP = true;

export const festival = {
  name: "Sonara",
  /** The ticker strip along the top, repeated end to end. */
  ticker: ["IX · Sonara", "Dhruv's favourite music", "Always on", "Mumbai, India"],
  venue: "Wherever the headphones are",
  dates: "Every day, all year"
} as const;

export type Act = {
  name: string;
  /** 1 = headliner (largest), 5 = smallest row on the poster. */
  tier: 1 | 2 | 3 | 4 | 5;
  /** Which stage (genre) the act belongs to; must match a stage id. */
  stage: string;
  link?: string;
};

export const lineup: Act[] = [
  { name: "Coldplay", tier: 1, stage: "main" },
  { name: "The Weeknd", tier: 1, stage: "main" },
  { name: "Arctic Monkeys", tier: 2, stage: "main" },
  { name: "Prateek Kuhad", tier: 2, stage: "acoustic" },
  { name: "Daft Punk", tier: 3, stage: "electronic" },
  { name: "Kendrick Lamar", tier: 3, stage: "hiphop" },
  { name: "A. R. Rahman", tier: 3, stage: "acoustic" },
  { name: "Fred again..", tier: 3, stage: "electronic" },
  { name: "Tame Impala", tier: 4, stage: "main" },
  { name: "Frank Ocean", tier: 4, stage: "hiphop" },
  { name: "Divine", tier: 4, stage: "hiphop" },
  { name: "Lucky Ali", tier: 4, stage: "acoustic" },
  { name: "Radiohead", tier: 4, stage: "main" },
  { name: "Peggy Gou", tier: 4, stage: "electronic" },
  { name: "Hanumankind", tier: 5, stage: "hiphop" },
  { name: "Bon Iver", tier: 5, stage: "acoustic" },
  { name: "Four Tet", tier: 5, stage: "electronic" },
  { name: "The Local Train", tier: 5, stage: "main" },
  { name: "Ritviz", tier: 5, stage: "electronic" },
  { name: "Tyler, The Creator", tier: 5, stage: "hiphop" },
  { name: "Cigarettes After Sex", tier: 5, stage: "acoustic" },
  { name: "Seedhe Maut", tier: 5, stage: "hiphop" }
];

export type Stage = {
  id: string;
  /** Stacked lockup on the ticket-style card, one word per line. */
  lockup: string[];
  genre: string;
  /** Two meta lines under the lockup, like the date and venue on a ticket. */
  when: string;
  where: string;
  tabs: { tracks: string[]; why: string };
  /** Where "Listen" goes. A playlist, an album, a channel. */
  link?: string;
  /** Which pattern patch peeks out behind the card (public/festival/*.svg). */
  patch: string;
};

export const stages: Stage[] = [
  {
    id: "main",
    lockup: ["Main", "Stage"],
    genre: "Alt & indie rock",
    when: "Long builds, late nights",
    where: "Big speakers, windows open",
    tabs: {
      tracks: ["Fix You · Coldplay", "Do I Wanna Know? · Arctic Monkeys", "The Less I Know the Better · Tame Impala", "Weird Fishes · Radiohead", "Choo Lo · The Local Train"],
      why: "The stage that plays when a project is nearly done and the last bug will not give up."
    },
    patch: "47_teal_zebra_patch_top_right.svg"
  },
  {
    id: "hiphop",
    lockup: ["Hip-hop", "Stage"],
    genre: "Hip-hop & rap",
    when: "Deploy days",
    where: "Headphones, volume up",
    tabs: {
      tracks: ["HUMBLE. · Kendrick Lamar", "Big Dawgs · Hanumankind", "Mere Gully Mein · Divine", "Pink + White · Frank Ocean", "Nanchaku · Seedhe Maut"],
      why: "Momentum music. Everything ships faster with a beat behind it."
    },
    patch: "48_blue_pattern_patch_right.svg"
  },
  {
    id: "electronic",
    lockup: ["Electro", "Stage"],
    genre: "Electronic & house",
    when: "Training runs, data cleaning",
    where: "One tab open, ten to go",
    tabs: {
      tracks: ["One More Time · Daft Punk", "Marea (we've lost dancing) · Fred again..", "(It Goes Like) Nanana · Peggy Gou", "Baby · Four Tet", "Udd Gaye · Ritviz"],
      why: "Loops for loops. Repetitive music for repetitive work, and it never gets old."
    },
    patch: "45_blue_heart_pattern_top_left.svg"
  },
  {
    id: "acoustic",
    lockup: ["Acoustic", "Stage"],
    genre: "Acoustic, film & folk",
    when: "Sunday mornings",
    where: "A cat, a chai, no laptop",
    tabs: {
      tracks: ["cold/mess · Prateek Kuhad", "Kun Faya Kun · A. R. Rahman", "O Sanam · Lucky Ali", "Holocene · Bon Iver", "Apocalypse · Cigarettes After Sex"],
      why: "The stage for the quiet itch to create: shape an idea, question it, and keep going."
    },
    patch: "46_yellow_pattern_mound_top.svg"
  }
];

/** What is on repeat right now. Counted on the page's flip-digit board. */
export const onRepeat = {
  albums: ["Random Access Memories · Daft Punk", "AM · Arctic Monkeys", "Blonde · Frank Ocean", "good kid, m.A.A.d city · Kendrick Lamar", "Currents · Tame Impala", "In Rainbows · Radiohead", "Actual Life 3 · Fred again..", "Rockstar · A. R. Rahman"],
  track: { title: "Weird Fishes / Arpeggi", artist: "Radiohead" }
};

/**
 * The four records on Sonara's page: the top songs, each drawn as a crayon
 * disc in the same family as the planet. `hue` picks the disc palette
 * (art/DiscArt). `audio` is the track itself under public/festival/sonara/audio;
 * tapping the disc plays it and the record spins while it does.
 */
export type TopSong = {
  title: string;
  artist: string;
  note: string;
  hue: "pink" | "cyan" | "lavender" | "teal" | "yellow";
  href?: string;
  /** Playable file, relative to the site root. */
  audio?: string;
};

export const SONARA_AUDIO_ROOT = "/festival/sonara/audio";

export const topSongs: TopSong[] = [
  { title: "I Don't Care", artist: "Ed Sheeran & Justin Bieber", note: "The one that goes on first.", hue: "cyan", audio: `${SONARA_AUDIO_ROOT}/dont-care.mp3` },
  { title: "High on Life", artist: "Martin Garrix ft. Bonn", note: "Deploy-day energy, volume up.", hue: "lavender", audio: `${SONARA_AUDIO_ROOT}/high-on-life.mp3` },
  { title: "Lost", artist: "Frank Ocean", note: "Late nights, last bug standing.", hue: "teal", audio: `${SONARA_AUDIO_ROOT}/lost.mp3` },
  { title: "Nothing's Gonna Stop Us Now", artist: "Starship", note: "For when the build finally passes.", hue: "yellow", audio: `${SONARA_AUDIO_ROOT}/nothings-gonna-stop-us-now.mp3` }
];

export type NoteBlock = {
  tone: "pink" | "lavender" | "cyan" | "teal";
  title: string;
  items: { q: string; a: string }[];
};

/** The coloured information blocks, in the order they tile. */
export const notes: NoteBlock[] = [
  {
    tone: "pink",
    title: "Listening FAQ",
    items: [
      { q: "What is playing while Dhruv codes?", a: "Mostly the Main and Electro stages: long alt-rock records and house loops that do not ask for attention." },
      { q: "Is there a purchasing limit?", a: "No limit on how many times one album can be replayed in a week. Random Access Memories has tested this." },
      { q: "Can I switch stages mid-set?", a: "Yes. Hip-hop for shipping, acoustic for thinking, electronic for anything with a progress bar." },
      { q: "Will the lineup change?", a: "Every few months. Headliners stay; the lower rows rotate as new favourites arrive." }
    ]
  },
  {
    tone: "lavender",
    title: "Home delivery",
    items: [
      { q: "When will I get a recommendation?", a: "Send a track through the form above and one comes back by email, usually within a week." }
    ]
  },
  {
    tone: "cyan",
    title: "Box office information",
    items: [
      { q: "I have not found the playlist yet. Where is it?", a: "The Listen button on each stage card opens that stage's picks. The full festival lives on the streaming profiles listed under Played on." },
      { q: "Do I need a wristband?", a: "Only headphones. Everything else is optional." }
    ]
  },
  {
    tone: "teal",
    title: "Headphone essentials",
    items: [
      { q: "What are the uses of a good pair?", a: "Entry to the festival, and the sole payment mode for focus." },
      {
        q: "Headphone policy",
        a: "Keep them on during builds. Do not remove between deploys. Replacements will not be provided. Patrons found without a soundtrack will be handed one."
      }
    ]
  }
];

/** The black partner strip: where the music actually plays. */
export const playedOn = {
  presented: ["Spotify", "YouTube Music"],
  powered: ["Apple Music", "SoundCloud", "Bandcamp", "Vinyl"],
  associate: ["Local gigs", "Mumbai"]
};
