import { profiles } from "../portfolio";
import { MAIL_TO, type FestivalContent } from "./types";

const LIVE = {
  snapclass: "https://snapclassprojectpro.streamlit.app/",
  research: "https://multiagent-research-systembydhruvb.streamlit.app/",
  hackathon: "https://stem-gsl-hack.streamlit.app/",
  chessbot: "https://github.com/bscitdhruvbendre-create/chessBot",
  paper: "https://doi.org/10.5281/zenodo.20352667"
};

/**
 * Verdance · Projects & research · "What has he built and researched?"
 * Projects are the main body; the published research is the deeper layer.
 */
export const verdance: FestivalContent = {
  world: "verdance",
  theme: {
    poster: "#58c26a",
    nav: "#12305a",
    ticker: "#00c8e8",
    board: "#fff133",
    blocks: ["#ff69b8", "#cdb1ff", "#00c8e8", "#fff133"],
    shadow: "#12305a"
  },
  ticker: ["Verdance", "Projects & research", "3 live projects", "1 published paper"],
  lockup: { name: "verdance", sub: "projects & research" },
  nav: {
    links: [
      { label: "My projects", href: "#lineup" },
      { label: "Project details", href: "#stages" },
      { label: "Research", href: "#notes" }
    ],
    cta: { label: "Contact me", to: "/signal" }
  },
  hero: { eyebrow: "Dhruv Bendre · Projects & research", title: "Projects and research", line: "Things I have built and published, most of them live and open to try." },
  lineup: [
    { name: "SnapClass", tier: 1, href: LIVE.snapclass },
    { name: "Multi-Agent Research System", tier: 1, href: LIVE.research },
    { name: "Hackathon Management Platform", tier: 2, href: LIVE.hackathon },
    { name: "MyChessBot", tier: 2, href: LIVE.chessbot },
    { name: "Published research", tier: 3, href: LIVE.paper },
    { name: "Sign language video communication", tier: 3, href: LIVE.paper },
    { name: "98.2% recognition accuracy", tier: 3 },
    { name: "Facial recognition", tier: 4 },
    { name: "Voice authentication", tier: 4 },
    { name: "RAG assistant", tier: 4 },
    { name: "Search Agent", tier: 4 },
    { name: "Reader Agent", tier: 4 },
    { name: "Writer Agent", tier: 4 },
    { name: "Critic Agent", tier: 4 },
    { name: "Streamlit", tier: 5 },
    { name: "SVM · dlib · PyDub", tier: 5 },
    { name: "LangChain · Groq · Tavily", tier: 5 },
    { name: "Supabase · Agno", tier: 5 },
    { name: "Stockfish · PGN", tier: 5 },
    { name: "WebRTC · MediaPipe · CVZone · Random Forest", tier: 5 },
    { name: "Zenodo · DOI 10.5281/zenodo.20352667", tier: 5, href: LIVE.paper }
  ],
  lineupFoot: "My projects · 2024 to 2026 · three live · one published",
  board: {
    category: "Projects & research",
    name: "Verdance",
    tagline: "Things I have built, tested and shipped.",
    story: [
      "Verdance is the green and blue world, the one with a satellite. It is where Dhruv's ideas are grown into things people can actually use.",
      "SnapClass, a multi-agent research system, a hackathon platform, and a chess engine with a personality all started here as a question and ended up live.",
      "Underneath the fields runs the research: real-time sign language recognition, published and shipped. Every project on this world is proof that he finishes."
    ],
    stats: [
      { value: 4, label: "projects" },
      { value: 3, label: "live right now" },
      { value: 1, label: "published paper" }
    ],
    updated: "Currently building · MyChessBot interface redesign",
    formTitle: ["Suggest", "a project"],
    hint: "Have a problem that wants an app, or a research question? Send it and I'll reply with what I would build first. Opens your mail app.",
    form: {
      kind: "mail",
      to: MAIL_TO,
      subject: "Verdance: a project idea",
      submit: "Send",
      fields: [
        { key: "name", placeholder: "NAME", label: "Name" },
        { key: "idea", placeholder: "IDEA", label: "Idea", required: true },
        { key: "who", placeholder: "WHO IS IT FOR?", label: "Who is it for" },
        { key: "why", placeholder: "WHY NOW?", label: "Why now" }
      ]
    }
  },
  sticker: ["My projects", "and", "research"],
  cards: [
    {
      lockup: ["Snap", "Class"],
      meta: ["2026 · 3 to 4 weeks", "Streamlit · SVM · dlib · PyDub"],
      button: { label: "View project", href: LIVE.snapclass },
      tabs: [
        { label: "Tools used", lead: "AI-powered attendance:", items: ["Streamlit full-stack app", "SVM facial recognition over dlib features", "Voice authentication with PyDub", "Password hashing for secure accounts"] },
        { label: "What it does", lead: "For teachers:", text: "Automates classroom attendance through facial recognition and voice authentication. Teachers create and manage classes; attendance takes seconds instead of a roll call." }
      ],
      patch: 47
    },
    {
      lockup: ["Research", "System"],
      meta: ["2026 · 3 to 4 weeks", "LangChain · Groq · Tavily"],
      button: { label: "View project", href: LIVE.research },
      tabs: [
        { label: "Tools used", lead: "A team of specialised agents:", items: ["Search Agent · Tavily Search", "Reader Agent · BeautifulSoup", "Writer Agent · structured report", "Critic Agent · score, strengths, weaknesses", "Groq Llama 3.3 70B on LangChain"] },
        { label: "What it does", lead: "Research on autopilot:", text: "Searches the web, reads reliable sources, writes a structured report and critiques its own output, so the result is more accurate and trustworthy than a single LLM answer." }
      ],
      patch: 48
    },
    {
      lockup: ["Hackathon", "Platform"],
      meta: ["2026 · 1 week", "Get Set Learn · Supabase · Agno"],
      button: { label: "View project", href: LIVE.hackathon },
      tabs: [
        { label: "Tools used", lead: "Python, Streamlit, Supabase, RAG, Agno:", items: ["Discover hackathons and register in a few clicks", "Secure payment and instant receipt download", "Get Set Learn AI Assistant: a RAG chatbot over the docs, FAQs and guidelines", "Playful K-12 visual style"] },
        { label: "What it does", lead: "For students, teachers and organisers:", text: "One end-to-end hackathon workflow, with an assistant that answers questions about eligibility, schedules, rules and judging in seconds." }
      ],
      patch: 45
    },
    {
      lockup: ["My", "ChessBot"],
      meta: ["2024 → ongoing", "Stockfish · PGN · Streamlit"],
      button: { label: "View source", href: LIVE.chessbot },
      tabs: [
        { label: "Tools used", lead: "An engine that plays like me:", items: ["A model trained on my own PGN games", "Stockfish for strength", "An interactive Streamlit board", "Interface redesign in progress"] },
        { label: "What it does", lead: "Human-like gameplay:", text: "Keeps strong, accurate play while preserving my strategies and move preferences. A live demo opens once the redesign is complete." }
      ],
      patch: 46
    },
    {
      lockup: ["Published", "research"],
      meta: ["Zenodo · DOI 10.5281/zenodo.20352667", "WebRTC · MediaPipe · CVZone · Random Forest"],
      button: { label: "Read research", href: LIVE.paper },
      tabs: [
        { label: "How it works", lead: "Real-time sign language support on video calls:", items: ["WebRTC carries the video call", "MediaPipe and CVZone extract hand landmarks", "A Random Forest classifier recognises the gesture", "Gesture → text → speech for the listener; speech → text for the signer", "98.2% accuracy, low latency on consumer hardware"] },
        { label: "The problem", lead: "Accessibility on ordinary calls:", text: "Deaf and hard-of-hearing people are cut out of everyday video calls. Landmark-based recognition instead of raw images keeps the system lightweight, robust to varying environments, and fast enough for real-time two-way communication. The same project won the Aavishkar Zonal Round in 2025." }
      ],
      patch: 47
    },
    {
      lockup: ["Vision", "& voice"],
      meta: ["Experiments inside the projects", "Faces · voices · hands"],
      button: { label: "View skills", href: "/ferrin" },
      tabs: [
        { label: "What I tried", lead: "Recognition work across the projects:", items: ["Facial recognition · SVM over dlib face features (SnapClass)", "Voice authentication · PyDub audio (SnapClass)", "Hand-landmark gesture recognition · MediaPipe, CVZone, Random Forest (research)", "AI agents · search, reader, writer, critic roles (research system)"] },
        { label: "What I learned", lead: "The thread through all of them:", text: "Features beat pixels. Landmarks, face descriptors and audio features are lighter and more robust than raw images, and they run on the hardware people already own." }
      ],
      patch: 48
    }
  ],
  info: {
    label: ["About my", "projects"],
    blocks: [
      {
        title: "Common questions",
        items: [
          { q: "What is live right now?", a: "SnapClass, the Multi-Agent Research System and the Hackathon Management Platform, all on Streamlit." },
          { q: "What was the fastest build?", a: "The Hackathon Management Platform: one week, for Get Set Learn." },
          { q: "What is the most ambitious?", a: "The research system: four agents that search, read, write and critique." },
          { q: "What is next?", a: "MyChessBot's redesign, then a live demo." }
        ]
      },
      { title: "How to try them", items: [{ q: "Do I need to install anything?", a: "No. Every live project opens in the browser, and the paper opens on Zenodo." }] },
      { title: "Source code & paper", items: [{ q: "Where are they?", a: "Repositories on GitHub (MyChessBot in the chessBot repo). The paper is on Zenodo at DOI 10.5281/zenodo.20352667." }] },
      {
        title: "Research: sign language on video calls",
        items: [
          { q: "What was published?", a: "A real-time AI-powered sign language translation system for video calls, designed for deaf and hard-of-hearing people." },
          { q: "How does it work?", a: "WebRTC, MediaPipe, CVZone and a Random Forest classifier recognise gestures from hand landmarks, convert them into text and speech, and transcribe spoken language back into text." },
          { q: "Results", a: "98.2% accuracy while staying lightweight, robust to varying environments and low-latency on standard consumer hardware." },
          { q: "Recognition", a: "Aavishkar Zonal Round winner, 2025. See Certificates & achievements." }
        ]
      }
    ],
    chips: { title: ["Live", "projects"], items: ["SnapClass", "Research System", "Hackathon Platform", "The paper on Zenodo", "GitHub"] }
  },
  partners: {
    rows: [
      { key: "Built with", items: ["Streamlit", "GitHub"], size: "big" },
      { key: "Also using", items: ["Supabase", "LangChain", "Groq", "Stockfish"], size: "mid" },
      { key: "Thanks to", items: ["Get Set Learn", "Zenodo", profiles.github.replace("https://", "")], size: "small" }
    ],
    promo: { key: "Promoted by", name: "Dhruv Bendre", sub: "AI engineer + data scientist" }
  },
  footer: { big: ["Verdance", "is growing"], logo: ["Verd", "ance"], sub: "projects & research" }
};
