import { profiles, RESUME_URL } from "../portfolio";
import { MAIL_TO, type FestivalContent } from "./types";

const EMAIL_2 = "dhruvbendre121@gmail.com";
const PHONE_1 = { label: "+91 83696 19146", href: "tel:+918369619146" };
const PHONE_2 = { label: "+91 82915 05249", href: "tel:+918291505249" };

/**
 * Signal · About me & contact · "Who is he and how do I reach him?"
 * The end of the journey. The poster is the about layer; the board and cards are
 * the contact layer. Only channels already published on Dhruv's portfolio are used.
 * Signal is the ringed world (saturn art slot): its planet sits on the board and rises as the horizon.
 */
export const signal: FestivalContent = {
  world: "signal",
  theme: {
    poster: "#f6f6f6",
    nav: "#18120f",
    ticker: "#fff133",
    board: "#ff69b8",
    blocks: ["#00c8e8", "#fff133", "#cdb1ff", "#00b398"],
    shadow: "#0084ff"
  },
  ticker: ["Signal", "About me & contact", "Who I am and how to reach me", "Vakola · Santacruz · Mumbai 400055"],
  lockup: { name: "signal", sub: "about & contact" },
  nav: {
    links: [
      { label: "About me", href: "#lineup" },
      { label: "Contact me", href: "#stages" },
      { label: "Location", href: "#notes" }
    ],
    cta: { label: "Send a message", to: "#ask" }
  },
  hero: { eyebrow: "Dhruv Bendre · About & contact", title: "About me and contact", line: "Who I am, what I do, and every way to reach me." },
  lineup: [
    { name: "Dhruv Bendre", tier: 1 },
    { name: "AI engineer + data scientist", tier: 2 },
    { name: "Mumbai, India", tier: 2 },
    { name: "Intelligent systems", tier: 3 },
    { name: "Multi-agent applications", tier: 3 },
    { name: "RAG", tier: 3 },
    { name: "Computer vision", tier: 3 },
    { name: "Dashboards", tier: 3 },
    { name: "Currently · MyChessBot redesign · LangGraph", tier: 4 },
    { name: "Chess", tier: 4 },
    { name: "Accessibility", tier: 4 },
    { name: "Making things", tier: 4 },
    { name: "Cats", tier: 4 },
    { name: MAIL_TO, tier: 5, href: `mailto:${MAIL_TO}` },
    { name: PHONE_1.label, tier: 5, href: PHONE_1.href },
    { name: "LinkedIn", tier: 5, href: profiles.linkedin },
    { name: "GitHub", tier: 5, href: profiles.github },
    { name: "Instagram", tier: 5, href: profiles.instagram },
    { name: "Resume", tier: 5, href: RESUME_URL }
  ],
  lineupFoot: "About me · I apply AI, machine learning and data analytics to build intelligent solutions that automate processes and deliver actionable insights",
  board: {
    category: "About me & contact",
    name: "Signal",
    tagline: "Who I am, what I do, and how to reach me.",
    story: [
      "Signal is the ringed world, the one that reaches out. This is where you find Dhruv himself.",
      "An AI engineer and data scientist in Mumbai who likes chess, accessibility, making things and cats, in roughly that order on any given day.",
      "The rings are the channels: email, LinkedIn, GitHub, Instagram. Pick any one and the message lands with him."
    ],
    stats: [
      { value: 2, label: "email addresses" },
      { value: 2, label: "phone numbers" },
      { value: 3, label: "profiles · LinkedIn, GitHub, Instagram" }
    ],
    updated: "Replies usually within a week · Mumbai time (IST)",
    formTitle: ["Send me", "a message"],
    hint: "Reach out and let's create something together. Opens your mail app with the message filled in.",
    form: {
      kind: "mail",
      to: MAIL_TO,
      subject: "Message from the solar system",
      submit: "Send message",
      fields: [
        { key: "name", placeholder: "NAME", label: "Name", required: true },
        { key: "email", placeholder: "EMAIL", label: "Email" },
        { key: "subject", placeholder: "SUBJECT", label: "Subject" },
        { key: "message", placeholder: "MESSAGE", label: "Message", required: true }
      ]
    }
  },
  sticker: ["Contact me", "on", "4 channels"],
  cards: [
    {
      lockup: ["Email"],
      meta: ["Best for anything long", "Replies within a week"],
      button: { label: "Send email", href: `mailto:${MAIL_TO}` },
      tabs: [
        { label: "Details", lead: "Two addresses:", items: [MAIL_TO, EMAIL_2] },
        { label: "Best for", lead: "Use email for:", text: "Roles, projects, collaboration, research questions, and anything that needs an attachment." }
      ],
      patch: 47
    },
    {
      lockup: ["Phone"],
      meta: ["Best for quick things", "Mumbai time, IST"],
      button: { label: "Call me", href: PHONE_1.href },
      tabs: [
        { label: "Details", lead: "Two numbers:", items: [PHONE_1.label, PHONE_2.label] },
        { label: "Best for", lead: "Use the phone for:", text: "Short calls once a conversation has started by email. Working hours in Mumbai." }
      ],
      patch: 48
    },
    {
      lockup: ["Profiles"],
      meta: ["GitHub · LinkedIn · Instagram", "Plus the resume"],
      button: { label: "View GitHub", href: profiles.github },
      tabs: [
        { label: "Details", lead: "Where else to find me:", items: ["GitHub · dhruvbendre", "LinkedIn · dhruv-bendre", "Instagram · bendrexd", "Resume · Google Drive"] },
        { label: "Best for", lead: "Use the profiles for:", text: "Code and repositories on GitHub, the professional trail on LinkedIn, and the resume on Drive." }
      ],
      patch: 45
    },
    {
      lockup: ["Location"],
      meta: ["Vakola, Santacruz", "Mumbai 400055, India"],
      button: { label: "Send a message", href: "#ask" },
      tabs: [
        { label: "Details", lead: "Based in:", items: ["Vakola, Santacruz", "Mumbai 400055", "India", "Time zone IST (UTC+5:30)"] },
        { label: "Best for", lead: "Meeting in person:", text: "Mumbai. Remote work anywhere; on-site work in the city." }
      ],
      patch: 46
    }
  ],
  info: {
    label: ["About me", "& contact"],
    blocks: [
      {
        title: "About me",
        items: [
          { q: "Who am I?", a: "Dhruv Bendre, an AI engineer and data scientist based in Mumbai, India. My passion for artificial intelligence, machine learning and data-driven solutions shows in the intelligent systems I build." },
          { q: "What do I do?", a: "I apply AI, machine learning and data analytics to build intelligent solutions that automate processes and deliver actionable insights: multi-agent applications, RAG, computer vision, dashboards." },
          { q: "What am I interested in?", a: "Stateful multi-agent workflows in LangGraph, MyChessBot's interface redesign, chess, accessibility, making things, and cats." },
          { q: "In my own words", a: "\"I thrive on finding unexpected solutions and believe that, with the right technology and perspective, AI can transform the way people work and interact with the world.\"" }
        ]
      },
      { title: "Resume", items: [{ q: "Where is it?", a: "On Google Drive, linked from the poster and the Profiles card." }] },
      { title: "Book a call", items: [{ q: "How?", a: "Email with three time slots in IST and what the call is about. Replies usually within a week." }] },
      {
        title: "How to reach me",
        items: [
          { q: "Keep it short", a: "Say who you are, what you need, and when." },
          { q: "This is the last stop", a: "The orbit is one click away: Return to orbit in the footer." }
        ]
      }
    ],
    chips: { title: ["Open", "to"], items: ["Intelligent systems", "Multi-agent applications", "RAG", "Computer vision", "Dashboards"] }
  },
  partners: {
    rows: [
      { key: "Reach me on", items: ["Gmail", "LinkedIn"], size: "big" },
      { key: "Also on", items: ["GitHub", "Instagram", "Phone", "Google Drive"], size: "mid" },
      { key: "Based in", items: ["Mumbai", "IST"], size: "small" }
    ],
    promo: { key: "Promoted by", name: "Dhruv Bendre", sub: "AI engineer + data scientist" }
  },
  footer: { big: ["Signal", "is sent"], logo: ["Sig", "nal"], sub: "about & contact", next: { label: "Return to orbit", to: "/" } }
};
