import { MAIL_TO, type FestivalContent } from "./types";

/**
 * Ferrin · Skills & tools · "What can he build with?"
 * The complete toolkit, from the portfolio's skills section and every project stack.
 */
const LANGUAGES = ["Python", "SQL", "HTML", "CSS", "JavaScript"];
const AI = ["LangChain", "LangGraph", "Agno", "RAG", "LLM APIs", "Agent architectures"];
const DATA = ["Pandas", "Power BI", "Excel", "Data cleaning", "Dashboards", "Analytics"];
const VISION = ["MediaPipe", "CVZone", "dlib", "scikit-learn", "Random Forest", "Facial recognition", "Computer vision"];
const BACKEND = ["Supabase", "APIs", "WebRTC", "n8n"];
const OTHER = ["Streamlit", "GitHub", "VS Code", "Tavily", "BeautifulSoup", "PyDub", "Stockfish", "Groq"];

export const ferrin: FestivalContent = {
  world: "ferrin",
  theme: {
    poster: "#b9c6c2",
    nav: "#2b3533",
    ticker: "#ff5d00",
    board: "#9ce3c8",
    blocks: ["#ff5d00", "#dbafe0", "#00c8e8", "#d4da00"],
    shadow: "#2b3533"
  },
  ticker: ["Ferrin", "Skills & tools", "What I can build with", "Mumbai, India"],
  lockup: { name: "ferrin", sub: "skills & tools" },
  nav: {
    links: [
      { label: "My skills", href: "#lineup" },
      { label: "Tools I use", href: "#stages" },
      { label: "Tech stack", href: "#notes" }
    ],
    cta: { label: "Contact me", to: "/signal" }
  },
  hero: { eyebrow: "Dhruv Bendre · Skills & tools", title: "Skills and tools", line: "The languages, frameworks and tools I use to build AI and data products." },
  lineup: [
    { name: "Python", tier: 1 },
    { name: "LangChain", tier: 1 },
    { name: "SQL", tier: 2 },
    { name: "Pandas", tier: 2 },
    { name: "RAG", tier: 2 },
    { name: "Streamlit", tier: 2 },
    { name: "LangGraph", tier: 3 },
    { name: "Agno", tier: 3 },
    { name: "Power BI", tier: 3 },
    { name: "Supabase", tier: 3 },
    { name: "scikit-learn", tier: 3 },
    { name: "MediaPipe", tier: 4 },
    { name: "CVZone", tier: 4 },
    { name: "dlib", tier: 4 },
    { name: "WebRTC", tier: 4 },
    { name: "n8n", tier: 4 },
    { name: "LLM APIs", tier: 4 },
    { name: "Groq", tier: 4 },
    { name: "HTML", tier: 5 },
    { name: "CSS", tier: 5 },
    { name: "JavaScript", tier: 5 },
    { name: "Excel", tier: 5 },
    { name: "Tavily", tier: 5 },
    { name: "BeautifulSoup", tier: 5 },
    { name: "PyDub", tier: 5 },
    { name: "Stockfish", tier: 5 },
    { name: "GitHub", tier: 5 },
    { name: "VS Code", tier: 5 }
  ],
  lineupFoot: "My skills · biggest names are the ones I use most",
  board: {
    category: "Skills & tools",
    name: "Ferrin",
    tagline: "Tools I use, laid out like a workbench.",
    story: [
      "Ferrin is the small iron world closest to the fire, and it is where everything else gets made. This is Dhruv's workbench.",
      "Python is the hammer he reaches for first. Around it sit LangChain, LangGraph and Agno for building agents, Streamlit and Supabase for shipping them, and MediaPipe and scikit-learn for teaching machines to see.",
      "None of these tools are precious to him. They are simply the ones that have earned a place on the bench by being used, every week, on real work."
    ],
    stats: [
      { value: LANGUAGES.length, label: "languages" },
      { value: AI.length + VISION.length, label: "AI & ML tools" },
      { value: DATA.length + BACKEND.length + OTHER.length, label: "data, backend & everyday tools" }
    ],
    updated: "Currently learning · LangGraph, stateful multi-agent workflows",
    formTitle: ["Ask about", "a tool"],
    hint: "Describe a problem and the stack you are on. I'll reply with what I would use. Opens your mail app.",
    form: {
      kind: "mail",
      to: MAIL_TO,
      subject: "Ferrin: which tool?",
      submit: "Send",
      fields: [
        { key: "name", placeholder: "NAME", label: "Name" },
        { key: "problem", placeholder: "PROBLEM", label: "Problem", required: true },
        { key: "stack", placeholder: "STACK", label: "Stack" },
        { key: "why", placeholder: "ANYTHING ELSE?", label: "Anything else" }
      ]
    }
  },
  sticker: ["Tools I use", "in", "6 areas"],
  cards: [
    {
      lockup: ["Lang", "uages"],
      meta: ["Five languages", "The base of everything else"],
      button: { label: "View projects", href: "/verdance" },
      tabs: [
        { label: "Tools", lead: "Languages:", items: ["Python · software, automation, data analysis, AI and machine learning", "SQL · storing, retrieving, managing and analysing relational data", "HTML, CSS and JavaScript · full-stack websites and web apps"] },
        { label: "Used in", lead: "Where they show up:", text: "Python runs every shipped project. SQL sits behind the hackathon platform's database. HTML, CSS and JavaScript built this portfolio." }
      ],
      patch: 47
    },
    {
      lockup: ["AI &", "agents"],
      meta: ["LLM apps and agents", "Research system · hackathon assistant"],
      button: { label: "View project", href: "https://multiagent-research-systembydhruvb.streamlit.app/" },
      tabs: [
        { label: "Tools", lead: "AI and agent frameworks:", items: ["LangChain · LLM apps with tools, data sources, memory and external APIs", "LangGraph · stateful multi-agent workflows on a graph architecture", "Agno · agents and multi-agent systems with tools, memory and knowledge", "RAG · retrieval-augmented generation for grounded answers", "LLM APIs · Groq's Llama 3.3 70B and others", "Agent architectures · search, reader, writer and critic roles"] },
        { label: "Used in", lead: "Where they show up:", text: "The Multi-Agent Research System (LangChain, Groq, Tavily) and the Get Set Learn hackathon assistant (RAG on Agno)." }
      ],
      patch: 48
    },
    {
      lockup: ["Data"],
      meta: ["Analysis and dashboards", "NullClass · My Equity School"],
      button: { label: "View experience", href: "/emberline" },
      tabs: [
        { label: "Tools", lead: "Data tools:", items: ["Pandas · manipulation, cleaning and analysis", "Power BI · interactive dashboards", "Excel · campaign data organisation", "Data cleaning, visualisation and analytics"] },
        { label: "Used in", lead: "Where they show up:", text: "Twitter engagement dashboards at NullClass; CRM analysis and lead-flow prediction at My Equity School." }
      ],
      patch: 45
    },
    {
      lockup: ["Computer", "vision"],
      meta: ["Real-time recognition", "SnapClass · sign language research"],
      button: { label: "Read research", href: "/verdance#stages" },
      tabs: [
        { label: "Tools", lead: "Computer vision and classical ML:", items: ["MediaPipe and CVZone · hand landmarks", "dlib · face features for facial recognition", "scikit-learn · SVM and Random Forest classifiers", "Computer vision pipelines on consumer hardware"] },
        { label: "Used in", lead: "Where they show up:", text: "SnapClass attendance (SVM over dlib faces) and the sign language support system for video calls (Random Forest over hand landmarks, 98.2% accuracy)." }
      ],
      patch: 46
    },
    {
      lockup: ["Develop", "ment"],
      meta: ["Backend, APIs, automation", "Hackathon platform · video calls"],
      button: { label: "View project", href: "https://stem-gsl-hack.streamlit.app/" },
      tabs: [
        { label: "Tools", lead: "Backend and infrastructure:", items: ["Supabase · database and auth", "APIs · the glue between agents, tools and services", "WebRTC · real-time video for the sign language system", "n8n · no-code / low-code workflow automation"] },
        { label: "Used in", lead: "Where they show up:", text: "Supabase and APIs under the hackathon platform; WebRTC carries the video calls in the published research; n8n connects apps, APIs, databases and AI tools." }
      ],
      patch: 47
    },
    {
      lockup: ["Everyday", "tools"],
      meta: ["The daily kit", "Every project"],
      button: { label: "View GitHub", href: "https://github.com/dhruvbendre" },
      tabs: [
        { label: "Tools", lead: "The rest of the bench:", items: ["Streamlit · the interface for every shipped app", "GitHub and VS Code · where the work lives", "Tavily · web search for the research agents", "BeautifulSoup · clean content extraction", "PyDub · voice authentication audio", "Stockfish · the chess engine behind MyChessBot", "Groq · fast LLM inference"] },
        { label: "Used in", lead: "Where they show up:", text: "Streamlit on all four projects; Tavily, BeautifulSoup and Groq in the research system; PyDub in SnapClass; Stockfish in MyChessBot." }
      ],
      patch: 48
    }
  ],
  info: {
    label: ["About my", "skills"],
    blocks: [
      {
        title: "Common questions",
        items: [
          { q: "What is your main language?", a: "Python, for software development, automation, data analysis, AI and machine learning. SQL and full-stack web development (HTML, CSS, JavaScript) sit beside it." },
          { q: "What do you build agents with?", a: "LangChain for LLM apps, LangGraph for stateful multi-agent graphs, Agno for tool-using agents, and RAG to keep answers grounded in real documents." },
          { q: "Do you build dashboards?", a: "Yes. Power BI dashboards over Twitter and CRM data, with Pandas and Excel for the cleaning underneath." },
          { q: "What about computer vision?", a: "MediaPipe, CVZone and dlib for landmarks and faces; SVM and Random Forest classifiers from scikit-learn on top." }
        ]
      },
      { title: "How fast I build", items: [{ q: "How long does a prototype take?", a: "One to four weeks. The hackathon platform took a week; SnapClass and the research system took three to four." }] },
      { title: "See the tools in use", items: [{ q: "Where can I see them working?", a: "Three live apps on the Projects page: SnapClass, the Multi-Agent Research System and the Hackathon Management Platform. Source on GitHub." }] },
      {
        title: "How I work",
        items: [
          { q: "One responsibility per part", a: "Split work across dedicated agents rather than asking one model to do everything." },
          { q: "Landmarks over pixels", a: "Prefer landmark and feature based recognition over raw images: lighter, more robust, faster on ordinary hardware." },
          { q: "Fewer clicks", a: "Optimise every workflow to reduce manual effort. Design for the person who will actually use it." }
        ]
      }
    ],
    chips: { title: ["Full", "tech stack"], items: [...LANGUAGES, ...AI, ...DATA, ...VISION, ...BACKEND, ...OTHER] }
  },
  partners: {
    rows: [
      { key: "Main tools", items: ["Python", "Streamlit"], size: "big" },
      { key: "Also using", items: ["LangChain", "Supabase", "Groq", "Power BI"], size: "mid" },
      { key: "Everyday", items: ["VS Code", "GitHub", "n8n"], size: "small" }
    ],
    promo: { key: "Promoted by", name: "Dhruv Bendre", sub: "AI engineer + data scientist" }
  },
  footer: { big: ["Ferrin", "is sharp"], logo: ["Fer", "rin"], sub: "skills & tools" }
};
