import { festival, lineup, notes, onRepeat, playedOn, SAMPLE_LINEUP, stages, topSongs } from "../music";
import { MAIL_TO, type FestivalContent } from "./types";

/** Sonara · Music · "What does he listen to?" The lineup itself is edited in data/music.ts. */
export const sonara: FestivalContent = {
  world: "sonara",
  theme: {
    poster: "#ff69b8",
    nav: "#0076cf",
    ticker: "#d4da00",
    board: "#00c8e8",
    blocks: ["#ff69b8", "#cdb1ff", "#00c8e8", "#00b398"],
    shadow: "#0084ff"
  },
  ticker: ["Sonara", "My music", "What I'm listening to", "Mumbai, India"],
  lockup: { name: "sonara", sub: "music" },
  nav: {
    links: [
      { label: "Favourite artists", href: "#lineup" },
      { label: "Genres", href: "#stages" },
      { label: "Albums", href: "#notes" }
    ],
    cta: { label: "Contact me", to: "/signal" }
  },
  hero: { eyebrow: "Dhruv Bendre · Music", title: "What I listen to", line: "The artists, genres and records that play while I work." },
  lineup: lineup.map((a) => ({ name: a.name, tier: a.tier, href: a.link })),
  lineupFoot: `Favourite artists · ${festival.dates} · ${festival.venue}`,
  sampleNote: SAMPLE_LINEUP ? "Sample lineup · swap in Dhruv's real favourites in data/music.ts" : undefined,
  board: {
    category: "Music",
    name: "Sonara",
    tagline: "The soundtrack behind everything else.",
    story: [
      "Sonara is the world you hear before you see. It is the soundtrack running under everything Dhruv builds.",
      "Radiohead and Arctic Monkeys for late nights, Fred again.. for deploy days, A. R. Rahman and Prateek Kuhad for slow mornings.",
      "Headphones go on when the work starts. The music is not background; it is part of how the work gets done."
    ],
    stats: [
      { value: stages.length, label: "favourite genres" },
      { value: lineup.length, label: "favourite artists" },
      { value: onRepeat.albums.length, label: "albums on repeat" }
    ],
    updated: `Now playing · ${onRepeat.track.title} · ${onRepeat.track.artist}`,
    formTitle: ["Send me", "a track"],
    hint: "Recommend a song. I'll reply with one back. Opens your mail app.",
    form: {
      kind: "mail",
      to: MAIL_TO,
      subject: "Sonara: a track for Dhruv",
      submit: "Send",
      fields: [
        { key: "name", placeholder: "NAME", label: "Name" },
        { key: "artist", placeholder: "ARTIST", label: "Artist" },
        { key: "track", placeholder: "TRACK", label: "Track", required: true },
        { key: "note", placeholder: "WHY THIS ONE?", label: "Why this one" }
      ]
    }
  },
  discs: {
    title: ["Top", "songs"],
    foot: "Four records that never leave the player",
    items: topSongs.map((s) => ({ title: s.title, artist: s.artist, note: s.note, hue: s.hue, href: s.href, audio: s.audio }))
  },
  sticker: ["Favourite", "genres:", "4 stages"],
  cards: stages.map((s, i) => ({
    lockup: [...s.lockup],
    meta: [s.genre, s.when],
    button: { label: "Listen", href: s.link ?? "#lineup" },
    tabs: [
      { label: "Favourite tracks", lead: `${s.genre} · ${lineup.filter((a) => a.stage === s.id).length} artists on the poster:`, items: [...s.tabs.tracks] },
      { label: "When I play it", lead: `${s.when} · ${s.where}:`, text: s.tabs.why }
    ],
    patch: [47, 48, 45, 46][i % 4]
  })),
  info: {
    label: ["What I'm", "listening to"],
    blocks: [
      { title: "How I listen", items: notes[0].items },
      { title: "Recommendations", items: notes[1].items },
      { title: "Where to listen", items: notes[2].items },
      { title: "Headphone rules", items: notes[3].items }
    ],
    chips: { title: ["Albums", "on repeat"], items: [...onRepeat.albums] }
  },
  partners: {
    rows: [
      { key: "Played on", items: [...playedOn.presented], size: "big" },
      { key: "Also on", items: [...playedOn.powered], size: "mid" },
      { key: "And live at", items: [...playedOn.associate], size: "small" }
    ],
    promo: { key: "Promoted by", name: "Dhruv Bendre", sub: "AI engineer + data scientist" }
  },
  footer: { big: ["Sonara", "is loud"], logo: ["Son", "ara"], sub: "music" }
};
