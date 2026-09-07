import type { FestivalContent } from "./types";

/**
 * Mnemora · AI archive · "Ask about me."
 * The conversational interface to the whole portfolio. The board's form carries
 * the question into the Streamlit archive, which answers only from what it holds.
 */
export const mnemora: FestivalContent = {
  world: "mnemora",
  theme: {
    poster: "#4fb3e8",
    nav: "#0a1a2e",
    ticker: "#f6f6f6",
    tickerInk: "#0a1a2e",
    board: "#cdb1ff",
    blocks: ["#00c8e8", "#fff133", "#ff69b8", "#dbafe0"],
    shadow: "#0a1a2e"
  },
  ticker: ["Mnemora", "AI archive", "Ask about me", "Answers only from what it knows"],
  lockup: { name: "mnemora", sub: "AI archive" },
  nav: {
    links: [
      { label: "Ask Roro", href: "#ask" },
      { label: "What it knows", href: "#stages" }
    ],
    cta: { label: "Ask Roro", to: "#ask" }
  },
  hero: { eyebrow: "Dhruv Bendre · Ask about me", title: "Ask about me", line: "Roro answers questions about my work from a small archive of verified facts." },
  lineup: [
    { name: "Who is Dhruv?", tier: 1 },
    { name: "What has he built?", tier: 2 },
    { name: "Where has he worked?", tier: 2 },
    { name: "What technologies does he use?", tier: 3 },
    { name: "What research has he published?", tier: 3 },
    { name: "What awards has he won?", tier: 3 },
    { name: "What projects use LangGraph?", tier: 4 },
    { name: "What is SnapClass?", tier: 4 },
    { name: "What is MyChessBot?", tier: 4 },
    { name: "How do I contact him?", tier: 4 },
    { name: "What certificates does he have?", tier: 5 },
    { name: "What is he currently working on?", tier: 5 }
  ],
  lineupFoot: "Popular questions · tap Ask a question to try one",
  board: {
    category: "AI archive",
    name: "Mnemora",
    tagline: "Ask about Dhruv's projects, skills, experience, research or background.",
    story: [
      "Mnemora is the world that remembers. Every document, project and note about Dhruv is kept here in one archive.",
      "Ask it a question and it answers only from what it holds, never from imagination. It is Dhruv's memory, made searchable.",
      "It is the closest thing to sitting down with him and asking anything you like."
    ],
    stats: [
      { value: 7, label: "documents" },
      { value: 21, label: "passages" },
      { value: 5, label: "categories" }
    ],
    updated: "Updated 5 September 2026",
    formTitle: ["Ask about", "Dhruv"],
    hint: "Ask about my projects, skills, experience, research or background.",
    form: {
      kind: "archive",
      placeholder: "Ask me anything about Dhruv...",
      submit: "Ask",
      chips: [
        { label: "Story", question: "Who is Dhruv Bendre?" },
        { label: "Experience", question: "Where has Dhruv worked?" },
        { label: "Projects", question: "What has Dhruv built?" },
        { label: "Research", question: "What research has Dhruv published?" },
        { label: "Skills", question: "What technologies does Dhruv work with?" },
        { label: "Awards", question: "What awards has Dhruv won?" },
        { label: "Contact", question: "How can I contact Dhruv?" }
      ],
      offline: "Archive coming online soon."
    }
  },
  chat: {
    title: ["Ask", "Roro"],
    bot: { name: "Roro", tagline: "keeper of the archive" },
    intro: "Hi, I'm Roro. I keep Dhruv's archive. Ask me anything about him and I'll answer from what I hold, and tell you plainly when I don't know.",
    placeholder: "Ask me anything about Dhruv...",
    starters: [
      { label: "Who is Dhruv?", question: "Who is Dhruv Bendre?" },
      { label: "Where has he worked?", question: "Where has Dhruv worked, and what did he do there?" },
      { label: "What has he built?", question: "What projects has Dhruv built?" },
      { label: "What is SnapClass?", question: "What is SnapClass and how does it work?" },
      { label: "His research", question: "What research has Dhruv published?" },
      { label: "Skills & tools", question: "What technologies and tools does Dhruv work with?" },
      { label: "Awards", question: "What awards or achievements has Dhruv won?" },
      { label: "How to reach him", question: "How can I contact Dhruv?" }
    ],
    offline: "The archive is not connected right now. Start it with `uvicorn api:app --port 8000` in dhruv-rag, or set VITE_ARCHIVE_API_URL."
  },
  sticker: ["What the", "archive", "knows"],
  cards: [
    {
      lockup: ["Story"],
      meta: ["Profile · Interests", "Who Dhruv is, in his own words"],
      button: { label: "Ask a question", href: "#ask" },
      tabs: [
        { label: "What it knows", lead: "Two documents:", items: ["Profile: an AI engineer and data scientist in Mumbai, his story, how to reach him", "Interests: chess, accessibility, making things, cats"] },
        { label: "Try asking", lead: "Popular questions:", items: ["Who is Dhruv Bendre?", "What is Dhruv curious about?", "Where is Dhruv based?", "How do I contact him?"] }
      ],
      patch: 47
    },
    {
      lockup: ["Projects", "& skills"],
      meta: ["Projects · Skills", "What was built and with what"],
      button: { label: "Ask a question", href: "#ask" },
      tabs: [
        { label: "What it knows", lead: "Two documents:", items: ["Projects: SnapClass, the research system, the hackathon platform, MyChessBot", "Skills: languages, agent frameworks, data tools, computer vision"] },
        { label: "Try asking", lead: "Popular questions:", items: ["What has Dhruv built?", "What is SnapClass?", "What is MyChessBot?", "What projects use LangGraph?"] }
      ],
      patch: 48
    },
    {
      lockup: ["Experience", "& awards"],
      meta: ["Experience · Achievements", "Where he has worked and what he has won"],
      button: { label: "Ask a question", href: "#ask" },
      tabs: [
        { label: "What it knows", lead: "Two documents:", items: ["Experience: My Equity School, NullClass, SocioHub", "Achievements: the Aavishkar Zonal Round win and the published paper"] },
        { label: "Try asking", lead: "Popular questions:", items: ["Where has Dhruv worked?", "What did Dhruv do at NullClass?", "What awards has he won?", "What certificates does he have?"] }
      ],
      patch: 45
    },
    {
      lockup: ["Research"],
      meta: ["Research", "The paper on Zenodo"],
      button: { label: "Ask a question", href: "#ask" },
      tabs: [
        { label: "What it knows", lead: "One document:", items: ["Real-time sign language support on video calls", "WebRTC, MediaPipe, CVZone, Random Forest", "98.2% accuracy, DOI 10.5281/zenodo.20352667"] },
        { label: "Try asking", lead: "Popular questions:", items: ["What research has Dhruv published?", "How accurate is the sign language system?", "What is the DOI?"] }
      ],
      patch: 46
    }
  ],
  partners: {
    rows: [
      { key: "Runs on", items: ["Streamlit", "Python"], size: "big" },
      { key: "Powered by", items: ["Vector store", "Embeddings", "Markdown", "An LLM"], size: "mid" },
      { key: "Rule", items: ["Facts only"], size: "small" }
    ],
    promo: { key: "Promoted by", name: "Dhruv Bendre", sub: "AI engineer + data scientist" }
  },
  footer: { big: ["Mnemora", "remembers"], logo: ["Mnem", "ora"], sub: "AI archive" }
};
