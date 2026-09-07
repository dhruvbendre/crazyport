import { MAIL_TO, type FestivalContent } from "./types";

const CHESSBOT = "https://github.com/bscitdhruvbendre-create/chessBot";

/**
 * Whimsel · VII · Playground & experiments.
 */
export const whimsel: FestivalContent = {
  world: "whimsel",
  theme: {
    poster: "#42d9b8",
    nav: "#0f3d33",
    ticker: "#ff5fbc",
    board: "#fff133",
    blocks: ["#ff69b8", "#cdb1ff", "#00c8e8", "#ff5d00"],
    shadow: "#0f3d33"
  },
  ticker: ["VII · Whimsel", "The one that spins sideways", "Playground & experiments", "May never ship"],
  lockup: { name: "whimsel", sub: "world VII" },
  nav: {
    links: [
      { label: "Toys", href: "#lineup" },
      { label: "Experiments", href: "#stages" }
    ],
    cta: { label: "Send a signal", to: "/signal" }
  },
  hero: { eyebrow: "Dhruv Bendre · Playground", title: "Playground", line: "Side projects, toys and experiments I build for fun." },
  lineup: [
    { name: "MyChessBot", tier: 1, href: CHESSBOT },
    { name: "n8n workflows", tier: 2 },
    { name: "This solar system", tier: 2, href: "/" },
    { name: "Stockfish", tier: 3 },
    { name: "PGN games", tier: 3 },
    { name: "Style model", tier: 3 },
    { name: "Streamlit board", tier: 3 },
    { name: "Crayon planets", tier: 4 },
    { name: "Chalk outlines", tier: 4 },
    { name: "Mnemora", tier: 4, href: "/mnemora" },
    { name: "Sonara", tier: 4, href: "/sonara" },
    { name: "Prototypes", tier: 5 },
    { name: "Sketches", tier: 5 },
    { name: "Toys", tier: 5 },
    { name: "Half-ideas", tier: 5 },
    { name: "Things that taught something", tier: 5 }
  ],
  lineupFoot: "Pinned at odd angles",
  board: {
    category: "Playground",
    name: "Whimsel",
    tagline: "Playground and experiments. Toys, prototypes and half-ideas.",
    story: [
      "Whimsel spins on its side, which tells you most of what you need to know. This is Dhruv's playground.",
      "A chess bot that plays in his style, n8n workflows built for fun, this solar system you are standing in, and a drawer of half-ideas that may never ship.",
      "It matters because the serious work on the other worlds started here, as something he tried on a weekend just to see."
    ],
    stats: [
      { value: 3, label: "experiments" },
      { value: 1, label: "ongoing" },
      { value: 9, label: "worlds drawn" }
    ],
    updated: "Currently · MyChessBot interface redesign",
    formTitle: ["Suggest", "a toy"],
    hint: "An experiment worth a weekend. Send it with a link. Opens your mail app.",
    form: {
      kind: "mail",
      to: MAIL_TO,
      subject: "Whimsel: a toy to try",
      submit: "Submit",
      fields: [
        { key: "name", placeholder: "NAME", label: "Name" },
        { key: "toy", placeholder: "TOY", label: "Toy", required: true },
        { key: "fun", placeholder: "WHY IT WOULD BE FUN", label: "Why it would be fun" },
        { key: "link", placeholder: "A LINK", label: "A link" }
      ]
    }
  },
  sticker: ["Kick off", "with", "4 toys"],
  cards: [
    {
      lockup: ["My", "ChessBot"],
      meta: ["2024 → ongoing", "Stockfish · PGN · Streamlit"],
      button: { label: "Source", href: CHESSBOT },
      tabs: [
        { label: "What it is", lead: "An engine that plays like Dhruv:", items: ["Trained on Dhruv's personal PGN game database", "Stockfish keeps it strong and accurate", "Preserves his strategies and move preferences", "Wrapped in an interactive Streamlit board"] },
        { label: "What it taught", lead: "The lesson:", text: "A clean, modern, immersive interface matters as much as the engine. The redesign with real-time analysis comes before the live demo." }
      ],
      patch: 47
    },
    {
      lockup: ["n8n", "Flows"],
      meta: ["Low-code automation", "Apps, APIs, databases, AI tools"],
      button: { label: "See the skills", href: "/ferrin" },
      tabs: [
        { label: "What it is", lead: "Workflow automation without code:", items: ["Connects apps, APIs, databases and AI tools", "Builds complex workflows from small nodes", "Runs the boring parts on a schedule"] },
        { label: "What it taught", lead: "The lesson:", text: "Not everything needs a codebase. Some automations are better as a diagram that runs." }
      ],
      patch: 48
    },
    {
      lockup: ["This", "Drawing"],
      meta: ["2026", "A portfolio as a solar system"],
      button: { label: "Back to the system", href: "/" },
      tabs: [
        { label: "What it is", lead: "The site you are reading:", items: ["Nine crayon worlds on chalk orbits", "An archive you can talk to (Mnemora)", "A festival poster for favourite music (Sonara)", "Built with React, Vite and GSAP"] },
        { label: "What it taught", lead: "The lesson:", text: "A portfolio can be a place rather than a list. Every world is a door." }
      ],
      patch: 45
    },
    {
      lockup: ["Next", "Toy"],
      meta: ["Booking open", "One weekend"],
      button: { label: "Suggest a toy", href: "#ask" },
      tabs: [
        { label: "What it is", lead: "Not decided yet:", items: ["Something that teaches one thing", "Something that may never ship", "Something pinned at an odd angle"] },
        { label: "What it taught", lead: "Not yet:", text: "Suggest one through the form above." }
      ],
      patch: 46
    }
  ],
  partners: {
    rows: [
      { key: "Plays on", items: ["Streamlit", "GitHub"], size: "big" },
      { key: "Powered by", items: ["Stockfish", "n8n", "GSAP", "React"], size: "mid" },
      { key: "Associate partners", items: ["One cat", "Weekends"], size: "small" }
    ],
    promo: { key: "Promoted by", name: "Dhruv Bendre", sub: "AI engineer + data scientist" }
  },
  footer: { big: ["Whimsel", "is sideways"], logo: ["Whim", "sel"], sub: "world VII" }
};
