import { RESUME_URL } from "../portfolio";
import { MAIL_TO, type FestivalContent } from "./types";

/**
 * Emberline · Experience · "Where has he worked?"
 * The SocioHub dates on the source site (2012 to 2013) look like a template leftover and are left out.
 * Jarurat Care Foundation and Get Set Learn were added 2026-09-07 from the user's own account;
 * logos live in public/festival/emberline/logos/.
 */
export const emberline: FestivalContent = {
  world: "emberline",
  theme: {
    poster: "#ff7a2f",
    nav: "#5a1a0f",
    ticker: "#fff133",
    board: "#ffc69e",
    blocks: ["#ff69b8", "#fff133", "#00c8e8", "#dbafe0"],
    shadow: "#5a1a0f"
  },
  ticker: ["Emberline", "Experience", "Where I've worked", "Now · Get Set Learn", "Mumbai, India"],
  lockup: { name: "emberline", sub: "experience" },
  nav: {
    links: [
      { label: "Career timeline", href: "#lineup" },
      { label: "My roles", href: "#stages" }
    ],
    cta: { label: "Contact me", to: "/signal" }
  },
  hero: { eyebrow: "Dhruv Bendre · Experience", title: "Experience", line: "Where I have worked, what I did there, and what each role taught me." },
  lineup: [
    { name: "Get Set Learn", tier: 1 },
    { name: "Jarurat Care Foundation", tier: 1 },
    { name: "My Equity School", tier: 1 },
    { name: "NullClass", tier: 2 },
    { name: "SocioHub", tier: 2 },
    { name: "Jr Developer · product team", tier: 2 },
    { name: "Full Stack Developer Intern", tier: 2 },
    { name: "Data Science Intern", tier: 3 },
    { name: "Data Analyst Intern", tier: 3 },
    { name: "Digital Marketing Intern", tier: 3 },
    { name: "Interactive product UI", tier: 3 },
    { name: "Funnel optimisation", tier: 4 },
    { name: "Automations", tier: 4 },
    { name: "Chatbot", tier: 4 },
    { name: "Lead-flow prediction", tier: 4 },
    { name: "Dashboards", tier: 4 },
    { name: "Power BI", tier: 5 },
    { name: "Excel", tier: 5 },
    { name: "Twitter data", tier: 5 },
    { name: "Campaign data", tier: 5 },
    { name: "Now", tier: 5 }
  ],
  lineupFoot: "Career timeline · marketing → analytics → data science → full stack → product, now",
  board: {
    category: "Experience",
    name: "Emberline",
    tagline: "Where I've worked and what I did there.",
    story: [
      "Emberline is a trail of embers: every place Dhruv has worked, still warm, laid end to end.",
      "Each stop taught him something the last one could not. Teams, deadlines, real users and the quiet discipline of shipping what was promised.",
      "Follow the line and you can see the shape of a career that keeps moving toward harder problems and better company."
    ],
    stats: [
      { value: 5, label: "roles" },
      { value: "6 months", label: "of full-stack work at Jarurat Care Foundation" },
      { value: "Now", label: "Jr Developer on the product team at Get Set Learn" }
    ],
    updated: "Currently · Jr Developer, product team, Get Set Learn",
    formTitle: ["Offer", "a role"],
    hint: "Hiring, or have a project that needs an AI engineer? Send the role and I'll reply. Opens your mail app.",
    form: {
      kind: "mail",
      to: MAIL_TO,
      subject: "Emberline: a new role",
      submit: "Send",
      fields: [
        { key: "name", placeholder: "NAME", label: "Name" },
        { key: "company", placeholder: "COMPANY", label: "Company" },
        { key: "role", placeholder: "ROLE", label: "Role", required: true },
        { key: "work", placeholder: "WHAT IS THE WORK?", label: "What is the work" }
      ]
    }
  },
  sticker: ["My roles:", "five", "stops"],
  cards: [
    {
      lockup: ["Socio", "Hub"],
      logo: { src: "/festival/emberline/logos/sociohub.png", alt: "SocioHub", dark: true },
      meta: ["Digital Marketing Intern · first role", "Social media and campaigns"],
      button: { label: "Open resume", href: RESUME_URL },
      tabs: [
        { label: "What I worked on", lead: "Digital marketing internship:", items: ["Developed and executed digital marketing strategies", "Wrote engaging social media captions", "Managed and organised campaign data in Excel", "Supported content creation and improved audience engagement and brand presence"] },
        { label: "What I learned", lead: "Carried forward:", text: "An eye for how work is presented, and the first habit of keeping data organised. Tools: Excel, social media platforms." }
      ],
      patch: 45
    },
    {
      lockup: ["Null", "Class"],
      logo: { src: "/festival/emberline/logos/nullclass.png", alt: "NullClass", dark: true },
      meta: ["Apr 2025 to May 2025 · 2 months", "Data Analyst Intern"],
      button: { label: "Open resume", href: RESUME_URL },
      tabs: [
        { label: "What I worked on", lead: "Hands-on, real-world analytics projects:", items: ["Transformed raw Twitter data into interactive Power BI dashboards", "Uncovered engagement trends through data cleaning, analysis and visualisation", "Turned messy social data into meaningful insights"] },
        { label: "What I learned", lead: "Carried forward:", text: "Most of the work is cleaning; the insight is easy once the data is honest. Tools: Power BI, data cleaning, visualisation." }
      ],
      patch: 48
    },
    {
      lockup: ["My Equity", "School"],
      logo: { src: "/festival/emberline/logos/myequityschool.png", alt: "My Equity School" },
      meta: ["Jun 2025 to Aug 2025 · 3 months", "Data Science Intern"],
      button: { label: "Open resume", href: RESUME_URL },
      tabs: [
        { label: "What I worked on", lead: "Data science internship:", items: ["Built interactive Power BI dashboards", "Analysed CRM data to surface business insights", "Used historical data to predict lead flow and conversion trends", "Improved reporting, decision-making and operational efficiency"] },
        { label: "What I learned", lead: "Carried forward:", text: "Prediction is only useful when it lands in a report someone reads. Tools: Power BI, CRM data, lead-flow prediction, historical analysis." }
      ],
      patch: 47
    },
    {
      lockup: ["Jarurat", "Care"],
      logo: { src: "/festival/emberline/logos/jarurat.svg", alt: "Jarurat Care Foundation" },
      meta: ["Full Stack Developer Intern · 6 months", "Jarurat Care Foundation"],
      button: { label: "Open resume", href: RESUME_URL },
      tabs: [
        { label: "What I worked on", lead: "Six months of full-stack work for a cancer-care NGO:", items: ["Funnel optimisation: studied where visitors dropped off and reworked the flow", "Built automations that took repetitive work off the team", "Assisted in building the foundation's chatbot", "Worked back and forth with the seniors on reviews and fixes"] },
        { label: "What I learned", lead: "Carried forward:", text: "How a real product is shipped with a team: reviews, revisions and the patience to get it right. Tools: full-stack web development, automation, chatbot integration." }
      ],
      patch: 45
    },
    {
      lockup: ["Get Set", "Learn"],
      logo: { src: "/festival/emberline/logos/gsl.svg", alt: "Get Set Learn" },
      meta: ["Jr Developer · product team · now", "Get Set Learn, Mumbai"],
      button: { label: "Open resume", href: RESUME_URL },
      tabs: [
        { label: "What I work on", lead: "On the product team, currently:", items: ["Interactive UI for Get Set Learn's products", "The front-facing side corporates and schools see first", "Study Pod, POP and the rest of the product line", "Shipping alongside product, design and the learning teams"] },
        { label: "What I'm learning", lead: "Right now:", text: "How a learning product earns a corporate's trust from the first screen: clarity, polish and interactions that feel considered. Tools: React, TypeScript, interactive front-end." }
      ],
      patch: 48
    },
    {
      lockup: ["Next", "role"],
      meta: ["Open to conversations", "AI engineering · data science"],
      button: { label: "Contact me", href: "/signal" },
      tabs: [
        { label: "Open to", lead: "The role that comes next:", items: ["Intelligent systems and multi-agent applications", "RAG and LLM products", "Computer vision", "Dashboards that turn raw data into decisions"] },
        { label: "Where", lead: "Based in:", text: "Vakola, Santacruz, Mumbai 400055, India. Available for on-site work in Mumbai and remote work anywhere." }
      ],
      patch: 46
    }
  ],
  partners: {
    rows: [
      { key: "Working at", items: ["Get Set Learn"], size: "big" },
      { key: "Worked at", items: ["Jarurat Care Foundation", "My Equity School", "NullClass", "SocioHub"], size: "mid" },
      { key: "Based in", items: ["Mumbai", "Remote"], size: "small" }
    ],
    promo: { key: "Promoted by", name: "Dhruv Bendre", sub: "AI engineer + data scientist" }
  },
  footer: { big: ["Emberline", "is warm"], logo: ["Ember", "line"], sub: "experience" }
};
