import type { PlanetId } from "./planets";

/**
 * Interior content for every world.
 *
 * Round 2 (2026-09-05): the placeholders were replaced with verified
 * information taken from Dhruv's published portfolio
 * (dhruvsportfoliob.framer.website). Sections open with a line about what the
 * world holds, then the catalogue. Keep facts here in sync with
 * dhruv-rag/knowledge/*.md, which the archive answers from.
 */
export type PortfolioLink = {
  label: string;
  href: string;
  /** Short grey aside after the link (where it goes, what it is). */
  note?: string;
};

export type PortfolioSection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
  /** Chalk-underlined links rendered after the paragraphs and list. */
  links?: PortfolioLink[];
  /** Renders as a chalk "not yet catalogued" panel instead of content. */
  placeholder?: boolean;
  /** Short line inside the placeholder panel saying what will arrive. */
  note?: string;
};

export const RESUME_URL = "https://drive.google.com/file/d/1dN1rhSxPmjZfCaDI6xyUayiPwFO3EyIx/view?usp=drive_link";

export const profiles = {
  github: "https://github.com/dhruvbendre",
  linkedin: "https://www.linkedin.com/in/dhruv-bendre/",
  instagram: "https://www.instagram.com/bendrexd/"
} as const;

const LIVE = {
  snapclass: "https://snapclassprojectpro.streamlit.app/",
  research: "https://multiagent-research-systembydhruvb.streamlit.app/",
  hackathon: "https://stem-gsl-hack.streamlit.app/",
  chessbot: "https://github.com/bscitdhruvbendre-create/chessBot",
  paper: "https://doi.org/10.5281/zenodo.20352667"
} as const;

export const portfolioContent: Record<PlanetId, PortfolioSection[]> = {
  mercury: [
    {
      title: "What lives here",
      paragraphs: [
        "Ferrin is the smallest world and the closest to the fire. It holds the raw material: languages, frameworks, tools, and the habits that turn them into work.",
        "Dhruv applies AI, machine learning and data analytics to build intelligent systems that automate processes and deliver actionable insights. These are the tools that work is made with."
      ]
    },
    {
      title: "Languages & frameworks",
      list: [
        "Python · the main language: software, automation, data analysis, AI and machine learning.",
        "Pandas · data manipulation, cleaning and analysis.",
        "SQL · storing, retrieving, managing and analysing data in relational databases.",
        "LangChain · building LLM applications with tools, data sources, memory and external APIs.",
        "LangGraph · stateful, multi-agent AI applications and complex LLM workflows on a graph architecture.",
        "Agno · AI agents and multi-agent systems that use tools, memory, knowledge and external services.",
        "Retrieval-augmented generation (RAG) · grounding LLM answers in external documents so they stay accurate and context-aware.",
        "Web development · full-stack sites and web apps with HTML, CSS, JavaScript and modern frameworks."
      ]
    },
    {
      title: "Tools & environments",
      list: [
        "Streamlit · the interface layer for most shipped projects.",
        "Supabase · database and auth behind the hackathon platform.",
        "n8n · low-code workflow automation connecting apps, APIs, databases and AI tools.",
        "Power BI and Excel · interactive dashboards and campaign data during internships.",
        "Computer vision · MediaPipe, CVZone, dlib and WebRTC for real-time hand and face recognition.",
        "Classical ML · SVM and Random Forest classifiers where they beat heavier models.",
        "Groq (Llama 3.3 70B), Tavily Search and BeautifulSoup · the research agents' engine, eyes and hands.",
        "PyDub · voice authentication audio processing.",
        "Stockfish · the chess engine paired with a learned playing style."
      ]
    },
    {
      title: "Ways of working",
      list: [
        "Split responsibilities across dedicated agents rather than asking one model to do everything.",
        "Prefer landmark and feature based recognition over raw pixels: lighter, more robust, faster on ordinary hardware.",
        "Optimise every workflow to reduce manual effort and clicks.",
        "Design the interface for the people who will actually use it, whether teachers or K–12 students."
      ]
    }
  ],
  venus: [
    {
      title: "What lives here",
      paragraphs: [
        "Emberline is a trail. Each place a path has passed through leaves an ember: a role, a team, a span of time, and what was carried onward.",
        "Dhruv is an AI engineer and data professional based in Mumbai, India. The trail so far runs through data analytics, data science and digital marketing."
      ]
    },
    {
      title: "The trail",
      list: [
        "My Equity School · Data Science Intern · June 2025 to August 2025. Built interactive Power BI dashboards and analysed CRM data to surface business insights, and used historical data to predict lead flow and conversion trends, improving reporting, decision-making and operational efficiency.",
        "NullClass · Data Analyst Intern · April 2025 to May 2025. Hands-on, real-world analytics projects: transformed raw Twitter data into interactive Power BI dashboards, uncovering engagement trends through data cleaning, analysis and visualisation.",
        "SocioHub · Digital Marketing Intern. Developed and executed digital marketing strategies: engaging social media captions, campaign data organised in Excel, content support, and improved audience engagement and brand presence."
      ]
    },
    {
      title: "What was carried onward",
      paragraphs: [
        "From analytics came the habit of turning raw, messy data into something a person can read at a glance. From marketing came an eye for how work is presented. Both show up in the projects: dashboards that explain themselves and interfaces that are pleasant to use."
      ],
      links: [{ label: "Download resume", href: RESUME_URL, note: "Google Drive" }]
    }
  ],
  earth: [
    {
      title: "What lives here",
      paragraphs: [
        "Verdance is where things were grown from an idea and shipped into the open. It is the most familiar world and the one with a satellite, because something here is always in orbit.",
        "Four fields so far, planted between 2024 and 2026: attendance, chess, research and hackathons."
      ]
    },
    {
      title: "SnapClass",
      paragraphs: [
        "An AI-powered full-stack attendance management platform that automates classroom attendance through facial recognition and voice authentication. Teachers create and manage classes, users are authenticated securely with password hashing, and attendance takes seconds instead of a roll call.",
        "Built in three to four weeks with Streamlit, an SVM classifier over dlib face features, and PyDub for voice."
      ],
      links: [{ label: "Open SnapClass", href: LIVE.snapclass, note: "live on Streamlit" }]
    },
    {
      title: "Multi-Agent AI Research System",
      paragraphs: [
        "A research assistant that automates the whole research process with a team of specialised agents: one searches the web, one reads and extracts clean content, one writes a structured report, and one critiques it with a score, strengths, weaknesses and suggested improvements.",
        "Built in 2026 in three to four weeks with LangChain, Groq's Llama 3.3 70B, Tavily Search and BeautifulSoup."
      ],
      links: [{ label: "Open the research system", href: LIVE.research, note: "live on Streamlit" }]
    },
    {
      title: "Hackathon Management Platform",
      paragraphs: [
        "An end-to-end hackathon platform for students, teachers and organisers, built in one week for Get Set Learn. Participants discover hackathons, register in a few clicks, pay securely and download receipts inside the app.",
        "Its Get Set Learn AI Assistant is a RAG chatbot trained on hackathon documentation, FAQs and guidelines, so a question about eligibility, schedules, rules or judging is answered in seconds. Python, Streamlit, Supabase, RAG and Agno."
      ],
      links: [{ label: "Open the hackathon platform", href: LIVE.hackathon, note: "live on Streamlit" }]
    },
    {
      title: "MyChessBot",
      paragraphs: [
        "A chess application that learns Dhruv's playing style from his own PGN games and combines that model with the Stockfish engine, so it plays strongly but with his strategies and move preferences. Started in 2024 and still going; the interface is being redesigned before a live demo opens."
      ],
      links: [{ label: "MyChessBot on GitHub", href: LIVE.chessbot, note: "source" }]
    },
    {
      title: "In orbit now",
      paragraphs: ["Three of the fields are live right now."],
      links: [
        { label: "Research system", href: LIVE.research },
        { label: "Hackathon platform", href: LIVE.hackathon },
        { label: "SnapClass", href: LIVE.snapclass },
        { label: "All repositories", href: profiles.github, note: "GitHub" }
      ]
    }
  ],
  mars: [
    {
      title: "What lives here",
      paragraphs: [
        "Theoria is the act of looking closely. It holds the questions that were asked carefully enough to publish: methods, findings, and the papers they became.",
        "One stratum so far, on making video calls accessible to sign language users."
      ]
    },
    {
      title: "Sign language support on video calls",
      paragraphs: [
        "A real-time AI-powered sign language translation system for video calls, designed for deaf and hard-of-hearing people. It combines WebRTC, MediaPipe, CVZone and a Random Forest classifier to recognise sign language gestures, convert them into text and speech, and simultaneously transcribe spoken language into text for two-way communication.",
        "Because recognition works on hand landmarks rather than raw images, the system reaches 98.2% accuracy while staying lightweight, robust to changing environments, and low-latency on ordinary consumer hardware.",
        "Published on Zenodo."
      ],
      links: [{ label: "Read the paper", href: LIVE.paper, note: "DOI 10.5281/zenodo.20352667" }]
    },
    {
      title: "Recognition",
      list: ["Aavishkar Zonal Round winner, 2025 · for the real-time sign language support system for video calls."]
    },
    {
      title: "Open questions",
      list: [
        "How far can landmark-based recognition go before it needs a heavier model?",
        "Adding fact-checking, citation validation and summarisation agents to the research pipeline.",
        "Whether a model of one player's style can stay recognisable as it gets stronger."
      ]
    }
  ],
  jupiter: [
    {
      title: "What lives here",
      paragraphs: [
        "Magnara is the great banded world. The long stories live here: a problem, its constraints, the approach, what shipped and what was learned, told at the length they deserve.",
        "Three bands, read top to bottom, like weather."
      ]
    },
    {
      title: "Band I · SnapClass",
      paragraphs: [
        "The problem: taking attendance by hand is slow, easy to fake and tedious for teachers. The constraint: it had to run as a plain web app that a school could open in a browser.",
        "The work: a full-stack Streamlit platform where an SVM over dlib face features recognises students and PyDub-based voice authentication confirms them. Teachers create and manage classes; accounts are protected with password hashing.",
        "The design: clean, intuitive and friendly for both teachers and students. Every workflow was optimised to reduce manual effort, so creating a class, marking attendance and managing records take minimal clicks. Shipped in three to four weeks."
      ],
      links: [{ label: "SnapClass", href: LIVE.snapclass }]
    },
    {
      title: "Band II · Hackathon Management Platform",
      paragraphs: [
        "The brief: a Get Set Learn assignment to simplify the entire hackathon experience for students, teachers and organisers, in one week.",
        "The work: discovery, registration in a few clicks, secure payment and instant receipt download, all inside a Streamlit app on Supabase. On top sits the Get Set Learn AI Assistant, a RAG chatbot over the hackathon documentation, FAQs and guidelines, built with Agno.",
        "The design: playful and engaging, inspired by educational products for K–12 students rather than an enterprise dashboard. Vibrant colours, bold typography, custom illustrations and interactive layouts, with every screen simplified so first-time participants explore confidently while organisers keep full functionality."
      ],
      links: [{ label: "Hackathon platform", href: LIVE.hackathon }]
    },
    {
      title: "Band III · Multi-Agent AI Research System",
      paragraphs: [
        "The problem: a single LLM answer to a research question is fast but shallow and hard to trust.",
        "The work: a pipeline of specialised agents on LangChain, Groq's Llama 3.3 70B and Tavily Search. A Search Agent discovers sources, a Reader Agent extracts clean content with BeautifulSoup, a Writer Agent synthesises a professional report, and a Critic Agent scores it, names strengths and weaknesses, and suggests improvements.",
        "What it taught: separating responsibilities across agents gives more accurate, organised and trustworthy research than one model, and the modular shape makes it easy to add fact-checking, citation validation or summarisation agents later. Built in three to four weeks."
      ],
      links: [{ label: "Research system", href: LIVE.research }]
    }
  ],
  saturn: [
    {
      title: "What lives here",
      paragraphs: [
        "Cadence is rhythm. A piece of work moves through loops: sketch, prototype, ship, learn, and around again. The rings are those loops.",
        "In Dhruv's words: \"I've always carried a quiet itch to create, to take an idea, shape it, question it, and keep going until every detail feels just right.\""
      ]
    },
    {
      title: "The loops",
      list: [
        "Take an idea, shape it, question it, and keep going until every detail feels right.",
        "Ship a working version quickly (most projects took one to four weeks), then return to redesign the interface once it has proved itself, as MyChessBot is doing now.",
        "Give each part of a system one clear responsibility, whether it is an agent in a pipeline or a screen in an app, so the whole stays scalable and easy to extend.",
        "Measure before trusting: 98.2% accuracy, a critic agent that scores its own reports, dashboards that make trends visible."
      ]
    },
    {
      title: "Principles",
      list: [
        "The approach may be unconventional; the dedication to innovation is not.",
        "Look for the unexpected solution.",
        "With the right technology and perspective, AI can change the way people work and interact with the world.",
        "Chase a perfection you may never quite catch, and stop to say hello to a cat along the way."
      ]
    }
  ],
  uranus: [
    {
      title: "What lives here",
      paragraphs: [
        "Whimsel spins sideways. It keeps the prototypes, sketches, toys and half-ideas that may never ship, because they taught something on the way."
      ]
    },
    {
      title: "Experiments",
      list: [
        "MyChessBot · an engine that plays like Dhruv. His PGN games train a model of his style, Stockfish keeps it strong, and the two are wrapped in a Streamlit board. Ongoing since 2024; a premium, immersive redesign with real-time analysis is in progress before the live demo opens.",
        "n8n workflows · low-code automations that connect apps, APIs, databases and AI tools.",
        "This drawing · a portfolio as a hand-drawn solar system, with an archive you can talk to."
      ],
      links: [{ label: "MyChessBot on GitHub", href: LIVE.chessbot }]
    }
  ],
  neptune: [
    // Mnemora's interior is the threshold page (pages/MnemoraPage.tsx); these
    // sections are only used if the shared shell ever renders it.
    {
      title: "What lives here",
      paragraphs: ["The archive. Ask it about Dhruv and it answers only from what it holds."]
    }
  ],
  pluto: [
    // Sonara's interior is the festival page (pages/SonaraPage.tsx, data/music.ts).
    {
      title: "What lives here",
      paragraphs: ["A festival drawn on a planet: the lineup of Dhruv's favourite music, its stages, and what is on repeat."]
    }
  ]
};

/** Contact: the channels a signal can travel on. */
export const signalContent: PortfolioSection[] = [
  {
    title: "How a signal travels",
    paragraphs: [
      "A signal is short. It leaves the system, crosses the dark, and arrives somewhere a person can read it.",
      "Reach out and let's create something together."
    ]
  },
  {
    title: "Channels",
    links: [
      { label: "bscit.dhruvbendre@gmail.com", href: "mailto:bscit.dhruvbendre@gmail.com", note: "email" },
      { label: "dhruvbendre121@gmail.com", href: "mailto:dhruvbendre121@gmail.com", note: "email" },
      { label: "+91 83696 19146", href: "tel:+918369619146", note: "phone" },
      { label: "+91 82915 05249", href: "tel:+918291505249", note: "phone" }
    ]
  },
  {
    title: "Profiles",
    links: [
      { label: "GitHub", href: profiles.github, note: "dhruvbendre" },
      { label: "LinkedIn", href: profiles.linkedin, note: "dhruv-bendre" },
      { label: "Instagram", href: profiles.instagram, note: "bendrexd" },
      { label: "Resume", href: RESUME_URL, note: "Google Drive" }
    ]
  },
  {
    title: "Where",
    paragraphs: ["Vakola, Santacruz, Mumbai 400055, India."]
  },
  {
    title: "Open to",
    paragraphs: [
      "AI engineering and data science work: intelligent systems, multi-agent applications, RAG, computer vision, and dashboards that turn raw data into decisions."
    ]
  }
];

/** Category prompts for the archive threshold. */
export const archivePromptCategories = [
  { label: "Story", question: "Who is Dhruv Bendre?" },
  { label: "Experience", question: "Where has Dhruv worked?" },
  { label: "Projects", question: "What has Dhruv built?" },
  { label: "Research", question: "What research has Dhruv published?" },
  { label: "Skills", question: "What technologies does Dhruv work with?" }
] as const;
