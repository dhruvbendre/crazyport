import { MAIL_TO, type FestivalContent } from "./types";

/**
 * Magnara · My story · "How did he get here?"
 * Only verified material from the portfolio is used; anything the sources do not
 * cover is a labelled [STORY DETAIL NEEDED] slot, never an invented memory.
 */
export const STORY_NEEDED = "[STORY DETAIL NEEDED]";

export const magnara: FestivalContent = {
  world: "magnara",
  theme: {
    poster: "#ff9a2e",
    nav: "#4d2a10",
    ticker: "#00b398",
    board: "#ffe7b3",
    blocks: ["#ff5fbc", "#00c8e8", "#fff133", "#cdb1ff"],
    shadow: "#4d2a10"
  },
  ticker: ["Magnara", "My story", "How I got here", "Since 2005 · Mumbai"],
  lockup: { name: "magnara", sub: "my story" },
  nav: {
    links: [
      { label: "Chapters", href: "#lineup" },
      { label: "Read my story", href: "#stages" },
      { label: "Now & next", href: "#notes" }
    ],
    cta: { label: "Contact me", to: "/signal" }
  },
  hero: { eyebrow: "Dhruv Bendre · My story", title: "My story", line: "How I got into AI and data, from the first experiment to today." },
  lineup: [
    { name: "Where it started", tier: 1 },
    { name: "The first thing I built", tier: 2 },
    { name: "Data", tier: 2 },
    { name: "AI", tier: 2 },
    { name: "Building for people", tier: 3 },
    { name: "Research", tier: 3 },
    { name: "Shipping", tier: 3 },
    { name: "Now", tier: 4 },
    { name: "Next", tier: 4 },
    { name: "Since 2005", tier: 5 },
    { name: "Mumbai, India", tier: 5 },
    { name: "A quiet itch to create", tier: 5 },
    { name: "Hello to a cat", tier: 5 }
  ],
  lineupFoot: "Nine chapters · in my words: I build with curiosity and chase a perfection I may never quite catch",
  board: {
    category: "My story",
    name: "Magnara",
    tagline: "How I got here, from early curiosity to shipping real systems.",
    story: [
      "Magnara is the great banded world. Read it top to bottom and you are reading Dhruv's story like weather.",
      "It begins with a curious kid in Mumbai taking things apart, moves through the years of learning to put them back together with code, and arrives at someone who now builds AI systems that other people rely on.",
      "The bands are still forming. The next chapter is being written right now, one shipped project at a time."
    ],
    stats: [
      { value: 9, label: "chapters" },
      { value: 3, label: "roles so far" },
      { value: 4, label: "projects shipped" }
    ],
    updated: "This chapter · AI engineer and data scientist in Mumbai · MyChessBot redesign in progress",
    formTitle: ["Ask about", "a chapter"],
    hint: "Curious about a part of the story? Ask and I'll write back. Opens your mail app.",
    form: {
      kind: "mail",
      to: MAIL_TO,
      subject: "Magnara: a question about the story",
      submit: "Send",
      fields: [
        { key: "name", placeholder: "NAME", label: "Name" },
        { key: "chapter", placeholder: "WHICH CHAPTER?", label: "Which chapter", required: true },
        { key: "question", placeholder: "YOUR QUESTION", label: "Your question" },
        { key: "why", placeholder: "WHY IT MATTERS TO YOU", label: "Why it matters to you" }
      ]
    }
  },
  sticker: ["My story", "in", "9 chapters"],
  cards: [
    {
      lockup: ["1 · Where", "it started"],
      meta: ["Since 2005 · Mumbai, India", "Early curiosity"],
      button: { label: "Next chapter", href: "#stages" },
      tabs: [
        { label: "What happened", lead: "In my words:", items: ["\"I've always carried a quiet itch to create: to take an idea, shape it, question it, and keep going until every detail feels just right.\"", `${STORY_NEEDED} · where the curiosity came from, the first computer, the first fascination`] },
        { label: "What changed", lead: "The thread through every chapter:", text: "Curiosity first, then the itch to make the thing rather than just use it. The rest of the story is that itch meeting data, then AI, then real people." }
      ],
      patch: 47
    },
    {
      lockup: ["2 · The first", "thing I built"],
      meta: [`${STORY_NEEDED} · year`, "From using technology to making it"],
      button: { label: "View projects", href: "/verdance" },
      tabs: [
        { label: "What happened", lead: "The moment technology became something to make:", items: [`${STORY_NEEDED} · what the first build was`, `${STORY_NEEDED} · what it was for and what went wrong`, "The earliest project in the portfolio is MyChessBot, started in 2024: an engine that learns my own playing style from my PGN games"] },
        { label: "What changed", lead: "Why it mattered:", text: "Building something that behaves like you is a strange, addictive first project. It taught the habit of shipping a working version quickly and redesigning it once it has proved itself." }
      ],
      patch: 48
    },
    {
      lockup: ["3 · Data"],
      meta: ["2025 · NullClass, My Equity School", "Analytics enters the path"],
      button: { label: "View experience", href: "/emberline" },
      tabs: [
        { label: "What happened", lead: "How data became part of the story:", items: ["Digital Marketing Intern at SocioHub: campaign data kept in Excel, the first habit of organising information", "Data Analyst Intern at NullClass, April to May 2025: raw Twitter data turned into Power BI dashboards", "Data Science Intern at My Equity School, June to August 2025: CRM analysis and lead-flow prediction from historical data"] },
        { label: "What changed", lead: "What I learned:", text: "Most of the work is cleaning, and the insight only counts when it lands in a report someone reads. Dashboards that explain themselves became a standard." }
      ],
      patch: 45
    },
    {
      lockup: ["4 · AI"],
      meta: ["Agents, RAG, vision", "Machine learning enters the story"],
      button: { label: "View skills", href: "/ferrin" },
      tabs: [
        { label: "What happened", lead: "How AI came in:", items: ["Classical machine learning first: an SVM over face features, a Random Forest over hand landmarks", "Then language models: LangChain, LangGraph, Agno and retrieval-augmented generation", "Then agents with one responsibility each: search, read, write, critique", `${STORY_NEEDED} · the course, book or moment that started it`] },
        { label: "What changed", lead: "What I believe:", text: "\"With the right technology and perspective, AI can transform the way people work and interact with the world.\" Though the approach may be unconventional, the dedication to innovation is unwavering." }
      ],
      patch: 46
    },
    {
      lockup: ["5 · Building", "for people"],
      meta: ["2026 · SnapClass, Get Set Learn", "From experiments to products"],
      button: { label: "View projects", href: "/verdance#stages" },
      tabs: [
        { label: "What happened", lead: "The move from technical experiments to things people use:", items: ["SnapClass: attendance by face and voice, built so teachers create a class and mark attendance in minimal clicks", "The Hackathon Management Platform, built in one week for Get Set Learn, with a playful K-12 visual style for first-time participants", "The Multi-Agent Research System: research on autopilot, with a critic that scores its own reports"] },
        { label: "What changed", lead: "The rule I kept:", text: "Design for the person who will actually use it, whether a teacher or a K-12 student. Every workflow trimmed to the fewest clicks." }
      ],
      patch: 47
    },
    {
      lockup: ["6 · Research"],
      meta: ["Zenodo · DOI 10.5281/zenodo.20352667", "Curiosity becomes formal"],
      button: { label: "Read research", href: "https://doi.org/10.5281/zenodo.20352667" },
      tabs: [
        { label: "What happened", lead: "Where curiosity became a published method:", items: ["A real-time sign language support system for video calls, for deaf and hard-of-hearing people", "WebRTC, MediaPipe, CVZone and a Random Forest classifier over hand landmarks", "98.2% accuracy, lightweight, low latency on consumer hardware", "Aavishkar Zonal Round winner, 2025"] },
        { label: "What changed", lead: "What I learned:", text: "Features beat pixels, and accessibility is a real problem worth the rigour. The paper is on the Projects page; the award is on Certificates & achievements." }
      ],
      patch: 48
    },
    {
      lockup: ["7 · Shipping"],
      meta: ["2024 → 2026", "Three live apps, three internships, one paper"],
      button: { label: "View projects", href: "/verdance" },
      tabs: [
        { label: "What happened", lead: "Real-world systems:", items: ["SnapClass, the Multi-Agent Research System and the Hackathon Management Platform, all live on Streamlit", "Three internships across marketing, analytics and data science", "One published paper and one competition win"] },
        { label: "What changed", lead: "The loop I work in:", text: "Sketch, prototype, ship in one to four weeks, learn, and go around again. MyChessBot is on its redesign loop right now." }
      ],
      patch: 45
    },
    {
      lockup: ["8 · Now"],
      meta: ["Mumbai, India", "AI engineer + data scientist"],
      button: { label: "Ask the archive", href: "/mnemora" },
      tabs: [
        { label: "What happened", lead: "What I'm interested in now:", items: ["Building intelligent systems that turn complex ideas into real-world solutions", "Stateful multi-agent workflows (currently learning LangGraph)", "Landmark-based recognition and how far it can go", "MyChessBot's interface redesign before its live demo"] },
        { label: "What changed", lead: "A habit:", text: "\"I thrive on finding unexpected solutions.\" And somewhere along the way, I'll probably stop to say hello to a cat." }
      ],
      patch: 46
    },
    {
      lockup: ["9 · Next"],
      meta: ["Open to", "AI engineering · data science"],
      button: { label: "Contact me", href: "/signal" },
      tabs: [
        { label: "What happened", lead: "What I'm building toward:", items: ["Intelligent systems and multi-agent applications", "RAG and LLM products people rely on", "Computer vision that runs on the hardware people already own", "Dashboards that turn raw data into decisions", `${STORY_NEEDED} · the bigger goal in my own words`] },
        { label: "What changed", lead: "The last line, for now:", text: "\"I build with curiosity, chase perfection I may never quite catch, and somewhere along the way, I'll probably stop to say hello to a cat.\"" }
      ],
      patch: 47
    }
  ],
  info: {
    label: ["About", "my story"],
    blocks: [
      {
        title: "How I got here",
        items: [
          { q: "Who am I?", a: "An AI engineer and data scientist based in Mumbai, India, applying AI, machine learning and data analytics to build intelligent systems that automate processes and deliver actionable insights." },
          { q: "How did I get here?", a: "Curiosity, then data (three internships in 2025), then AI (agents, RAG, vision), then products people use, then a published paper and an award." },
          { q: "What drives me?", a: "A quiet itch to create: take an idea, shape it, question it, and keep going until every detail feels right." },
          { q: "What is missing from this page?", a: "Early chapters are still [STORY DETAIL NEEDED]: the first build, the first fascination, and the bigger goal in my own words." }
        ]
      },
      { title: "Now", items: [{ q: "What am I working on?", a: "MyChessBot's interface redesign, stateful multi-agent workflows in LangGraph, and the next loop of whatever ships next." }] },
      { title: "Next", items: [{ q: "What am I building toward?", a: "AI engineering and data science work: intelligent systems, multi-agent applications, RAG, computer vision, and dashboards that turn raw data into decisions." }] },
      {
        title: "In my own words",
        items: [
          { q: "Unconventional, unwavering", a: "\"Though my approach may be unconventional, my dedication to innovation is unwavering.\"" },
          { q: "Unexpected solutions", a: "\"I thrive on finding unexpected solutions and believe that, with the right technology and perspective, AI can transform the way people work and interact with the world.\"" }
        ]
      }
    ],
    chips: { title: ["The", "timeline"], items: ["Since 2005", "2024 · MyChessBot", "Apr 2025 · NullClass", "Jun 2025 · My Equity School", "2025 · Aavishkar", "2026 · SnapClass", "2026 · Research System", "2026 · Hackathon Platform", "2026 · Paper on Zenodo"] }
  },
  partners: {
    rows: [
      { key: "Written in", items: ["Mumbai", "Curiosity"], size: "big" },
      { key: "Chapters at", items: ["SocioHub", "NullClass", "My Equity School", "Get Set Learn"], size: "mid" },
      { key: "With", items: ["One cat"], size: "small" }
    ],
    promo: { key: "Promoted by", name: "Dhruv Bendre", sub: "AI engineer + data scientist" }
  },
  footer: { big: ["Magnara", "is long"], logo: ["Mag", "nara"], sub: "my story" }
};
