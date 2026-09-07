import { MAIL_TO, type FestivalContent } from "./types";

/**
 * RESERVED / TBD (2026-09-05 restructure). Cadence is off the orbit and its
 * route returns not-found (planets.ts `reserved`). This content is kept intact
 * until the world's purpose is decided; do not expose it to visitors.
 *
 * Cadence · VI · Process & principles. Dhruv's own words from the portfolio, plus how the projects were actually built.
 */
export const cadence: FestivalContent = {
  world: "cadence",
  theme: {
    poster: "#ff8c6b",
    nav: "#4b2418",
    ticker: "#00f800",
    board: "#dbafe0",
    blocks: ["#fff133", "#00c8e8", "#ff69b8", "#00b398"],
    shadow: "#4b2418"
  },
  ticker: ["VI · Cadence", "Loops that repeat and improve", "Process & principles", "Around again"],
  lockup: { name: "cadence", sub: "world VI" },
  nav: {
    links: [
      { label: "Loops", href: "#lineup" },
      { label: "Principles", href: "#stages" }
    ],
    cta: { label: "Send a signal", to: "/signal" }
  },
  hero: { eyebrow: "Dhruv Bendre · Process", title: "How I work", line: "How I plan, build and improve the things I make." },
  lineup: [
    { name: "Sketch", tier: 1 },
    { name: "Prototype", tier: 1 },
    { name: "Ship", tier: 1 },
    { name: "Learn", tier: 1 },
    { name: "Question it", tier: 2 },
    { name: "Keep going", tier: 2 },
    { name: "Every detail", tier: 2 },
    { name: "Ship in one to four weeks", tier: 3 },
    { name: "Redesign after it proves itself", tier: 3 },
    { name: "One responsibility per part", tier: 4 },
    { name: "Measure before trusting", tier: 4 },
    { name: "Unexpected solutions", tier: 4 },
    { name: "98.2%", tier: 5 },
    { name: "Critic agent", tier: 5 },
    { name: "Dashboards", tier: 5 },
    { name: "Minimal clicks", tier: 5 },
    { name: "Say hello to a cat", tier: 5 }
  ],
  lineupFoot: "In Dhruv's words: chase a perfection you may never quite catch",
  board: {
    category: "Reserved",
    name: "Cadence",
    tagline: "Process and principles (reserved, to be decided).",
    story: [
      "Cadence is the world of loops: how Dhruv works, not what he makes.",
      "Small steps, honest tests, and a habit of shipping before something feels finished.",
      "Reserved for now, until its purpose is decided."
    ],
    stats: [
      { value: 4, label: "steps" },
      { value: 4, label: "principles" },
      { value: 1, label: "cat" }
    ],
    updated: "Currently · MyChessBot, loop three: the redesign",
    formTitle: ["Join", "a loop"],
    hint: "Stuck somewhere between sketch and ship? Send where it is and what is stuck. Opens your mail app.",
    form: {
      kind: "mail",
      to: MAIL_TO,
      subject: "Cadence: join a loop",
      submit: "Submit",
      fields: [
        { key: "name", placeholder: "NAME", label: "Name" },
        { key: "idea", placeholder: "IDEA", label: "Idea", required: true },
        { key: "stage", placeholder: "STAGE IT IS AT", label: "Stage it is at" },
        { key: "stuck", placeholder: "WHAT IS STUCK?", label: "What is stuck" }
      ]
    }
  },
  sticker: ["Kick off", "with", "4 loops"],
  cards: [
    {
      lockup: ["Sketch", "Loop"],
      meta: ["Days", "An idea, shaped and questioned"],
      button: { label: "See it", href: "/verdance" },
      tabs: [
        { label: "What happens", lead: "Take an idea and shape it:", items: ["Name the problem and the person it is for", "Question it until the shape is clear", "Decide what one to four weeks can hold"] },
        { label: "Example", lead: "SnapClass:", text: "The problem was a slow roll call; the constraint was a plain web app a school could open. The sketch was: faces, voices, minimal clicks." }
      ],
      patch: 47
    },
    {
      lockup: ["Proto", "type"],
      meta: ["One to two weeks", "Streamlit first"],
      button: { label: "See it", href: "https://stem-gsl-hack.streamlit.app/" },
      tabs: [
        { label: "What happens", lead: "A working version, fast:", items: ["Streamlit for the interface", "One clear responsibility per part", "Real data as early as possible"] },
        { label: "Example", lead: "The hackathon platform:", text: "Built in one week for Get Set Learn: discovery, registration, payment, receipts and a RAG assistant, all inside the first prototype." }
      ],
      patch: 48
    },
    {
      lockup: ["Ship", "Loop"],
      meta: ["Three to four weeks", "Live on Streamlit"],
      button: { label: "See it", href: "https://multiagent-research-systembydhruvb.streamlit.app/" },
      tabs: [
        { label: "What happens", lead: "Put it in front of people:", items: ["Deploy where it can be opened in a browser", "Measure what can be measured", "Let a critic score the output"] },
        { label: "Example", lead: "The research system:", text: "Four agents shipped as one pipeline, with a Critic Agent that scores every report and names its weaknesses." }
      ],
      patch: 45
    },
    {
      lockup: ["Learn", "Loop"],
      meta: ["Ongoing", "Then around again"],
      button: { label: "See it", href: "https://github.com/bscitdhruvbendre-create/chessBot" },
      tabs: [
        { label: "What happens", lead: "Return once it has proved itself:", items: ["Redesign the interface with real use in mind", "Keep what taught something", "Write down what was learned"] },
        { label: "Example", lead: "MyChessBot:", text: "Started in 2024, still going. The engine works; the interface is being redesigned for a clean, immersive experience before the live demo opens." }
      ],
      patch: 46
    }
  ],
  partners: {
    rows: [
      { key: "Runs on", items: ["Curiosity", "Streamlit"], size: "big" },
      { key: "Powered by", items: ["Sketches", "Prototypes", "Critics", "Dashboards"], size: "mid" },
      { key: "Associate partners", items: ["One cat"], size: "small" }
    ],
    promo: { key: "Promoted by", name: "Dhruv Bendre", sub: "AI engineer + data scientist" }
  },
  footer: { big: ["Cadence is", "on repeat"], logo: ["Cad", "ence"], sub: "world VI" }
};
