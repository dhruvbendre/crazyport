import { RESUME_URL } from "../portfolio";
import { MAIL_TO, type FestivalContent } from "./types";

/**
 * Emberline · Experience · "Where has he worked?"
 * The SocioHub dates on the source site (2012 to 2013) look like a template leftover and are left out.
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
  ticker: ["Emberline", "Experience", "Where I've worked", "Mumbai, India"],
  lockup: { name: "emberline", sub: "experience" },
  nav: {
    links: [
      { label: "Career timeline", href: "#lineup" },
      { label: "My roles", href: "#stages" },
      { label: "What I learned", href: "#notes" }
    ],
    cta: { label: "Contact me", to: "/signal" }
  },
  hero: { eyebrow: "Dhruv Bendre · Experience", title: "Experience", line: "Where I have worked, what I did there, and what each role taught me." },
  lineup: [
    { name: "My Equity School", tier: 1 },
    { name: "NullClass", tier: 1 },
    { name: "SocioHub", tier: 1 },
    { name: "Data Science Intern", tier: 2 },
    { name: "Data Analyst Intern", tier: 2 },
    { name: "Digital Marketing Intern", tier: 2 },
    { name: "CRM analytics", tier: 3 },
    { name: "Twitter data", tier: 3 },
    { name: "Lead-flow prediction", tier: 3 },
    { name: "Campaign data", tier: 3 },
    { name: "Dashboards", tier: 4 },
    { name: "Data cleaning", tier: 4 },
    { name: "Visualisation", tier: 4 },
    { name: "Reporting", tier: 4 },
    { name: "Power BI", tier: 5 },
    { name: "Excel", tier: 5 },
    { name: "Social media captions", tier: 5 },
    { name: "Jun → Aug 2025", tier: 5 },
    { name: "Apr → May 2025", tier: 5 }
  ],
  lineupFoot: "Career timeline · marketing → analytics → data science → what comes next",
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
      { value: 3, label: "roles" },
      { value: 2, label: "data internships in 2025" },
      { value: "5 months", label: "of dashboards, analysis and prediction" }
    ],
    updated: "Currently · open to AI engineering and data science work",
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
  sticker: ["My roles:", "three", "internships"],
  cards: [
    {
      lockup: ["Socio", "Hub"],
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
      meta: ["Jun 2025 to Aug 2025 · 3 months", "Data Science Intern"],
      button: { label: "Open resume", href: RESUME_URL },
      tabs: [
        { label: "What I worked on", lead: "Data science internship:", items: ["Built interactive Power BI dashboards", "Analysed CRM data to surface business insights", "Used historical data to predict lead flow and conversion trends", "Improved reporting, decision-making and operational efficiency"] },
        { label: "What I learned", lead: "Carried forward:", text: "Prediction is only useful when it lands in a report someone reads. Tools: Power BI, CRM data, lead-flow prediction, historical analysis." }
      ],
      patch: 47
    },
    {
      lockup: ["Next", "role"],
      meta: ["Open to offers", "AI engineering · data science"],
      button: { label: "Contact me", href: "/signal" },
      tabs: [
        { label: "Open to", lead: "The role that comes next:", items: ["Intelligent systems and multi-agent applications", "RAG and LLM products", "Computer vision", "Dashboards that turn raw data into decisions"] },
        { label: "Where", lead: "Based in:", text: "Vakola, Santacruz, Mumbai 400055, India. Available for on-site work in Mumbai and remote work anywhere." }
      ],
      patch: 46
    }
  ],
  info: {
    label: ["About my", "experience"],
    blocks: [
      {
        title: "Common questions",
        items: [
          { q: "Where have you worked?", a: "SocioHub (Digital Marketing Intern), NullClass (Data Analyst Intern, April to May 2025) and My Equity School (Data Science Intern, June to August 2025)." },
          { q: "What did each role produce?", a: "Campaigns, captions and organised campaign data at SocioHub; Twitter engagement dashboards at NullClass; Power BI dashboards and lead-flow predictions at My Equity School." },
          { q: "How did the roles progress?", a: "From marketing and campaign data, to analytics and dashboards, to data science and prediction. Each role handed the next one a habit." },
          { q: "What comes next?", a: "AI engineering and data science work: agents, RAG, computer vision, and dashboards that people actually read." }
        ]
      },
      { title: "Resume", items: [{ q: "Where is it?", a: "One click away: the Open resume button on every role opens it on Google Drive." }] },
      { title: "Hiring", items: [{ q: "How do I hire you?", a: "Send a message with the role and the work. Replies usually arrive within a week." }] },
      {
        title: "What I carried forward",
        items: [
          { q: "From marketing", a: "An eye for how work is presented." },
          { q: "From analytics", a: "The habit of turning raw, messy data into something a person can read at a glance." },
          { q: "Both together", a: "Dashboards that explain themselves and interfaces that are pleasant to use." }
        ]
      }
    ],
    chips: { title: ["Skills from", "these roles"], items: ["Power BI", "CRM data", "Lead flow", "Engagement trends", "Data cleaning", "Campaign Excel", "Reporting"] }
  },
  partners: {
    rows: [
      { key: "Worked at", items: ["My Equity School", "NullClass"], size: "big" },
      { key: "Also", items: ["SocioHub", "Power BI", "Excel", "Twitter data"], size: "mid" },
      { key: "Based in", items: ["Mumbai", "Remote"], size: "small" }
    ],
    promo: { key: "Promoted by", name: "Dhruv Bendre", sub: "AI engineer + data scientist" }
  },
  footer: { big: ["Emberline", "is warm"], logo: ["Ember", "line"], sub: "experience" }
};
