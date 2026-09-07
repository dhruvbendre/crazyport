import { MAIL_TO, type FestivalContent } from "./types";

const DOI = "https://doi.org/10.5281/zenodo.20352667";

/**
 * Photos: drop the file in public/festival/theoria/photos/ and set `photo.src` on the card (2026-09-07).
 * Theoria · Certificates & achievements · "What proves his learning and achievements?"
 * Verified items: the Aavishkar Zonal Round win (2025) and the published paper on
 * Zenodo. No certificate files exist in the repository yet; the certificate slots
 * are clearly labelled placeholders, never fabricated credentials. When the asset
 * directory arrives, add each certificate's image via assets.certificateImages
 * and its details in the cards below.
 */
export const CERTIFICATE_NEEDED = "[CERTIFICATE NEEDED]";

export const theoria: FestivalContent = {
  world: "theoria",
  theme: {
    poster: "#fb3132",
    nav: "#4a1a14",
    ticker: "#dbafe0",
    board: "#00c8e8",
    blocks: ["#fff133", "#dbafe0", "#00c8e8", "#ff69b8"],
    shadow: "#4a1a14"
  },
  ticker: ["Theoria", "Certificates & achievements", "Awards · publications · certifications", "Aavishkar Zonal Round winner 2025"],
  lockup: { name: "theoria", sub: "certificates & achievements" },
  nav: {
    links: [
      { label: "Awards", href: "#lineup" },
      { label: "Credentials", href: "#stages" },
      { label: "How to verify", href: "#notes" }
    ],
    cta: { label: "Contact me", to: "/signal" }
  },
  hero: { eyebrow: "Dhruv Bendre · Certificates & achievements", title: "Certificates and achievements", line: "Courses completed, awards won and the research I have published." },
  lineup: [
    { name: "Aavishkar Zonal Round winner", tier: 1 },
    { name: "Published research", tier: 2, href: DOI },
    { name: "Zenodo · DOI 10.5281/zenodo.20352667", tier: 2, href: DOI },
    { name: "2025", tier: 3 },
    { name: "Sign language support on video calls", tier: 3, href: DOI },
    { name: "98.2% accuracy", tier: 3 },
    { name: "Featured project", tier: 4 },
    { name: "Real-time · WebRTC · MediaPipe · CVZone · Random Forest", tier: 4 },
    { name: `${CERTIFICATE_NEEDED} · title · issuer · year`, tier: 5 },
    { name: `${CERTIFICATE_NEEDED} · title · issuer · year`, tier: 5 },
    { name: `${CERTIFICATE_NEEDED} · title · issuer · year`, tier: 5 }
  ],
  lineupFoot: "Awards, publications and certifications · each with issuer and year",
  sampleNote: "Certificates not yet added · each one needs title, issuer, year, image and verification link in data/festival/theoria.ts",
  board: {
    category: "Certificates & achievements",
    name: "Theoria",
    tagline: "Awards, publications and certifications, with proof.",
    story: [
      "Theoria is the red world, and its cliffs are cut in layers. Each layer is a piece of proof: a certificate earned, an award won, a paper published.",
      "Dhruv collects these the way the planet collects strata, slowly and in order, one on top of the last.",
      "Nothing here is decorative. Every credential backs a skill you can find on another world."
    ],
    stats: [
      { value: 1, label: "award" },
      { value: 1, label: "publication" },
      { value: 0, label: "certificates listed so far" }
    ],
    updated: "Latest · Aavishkar Zonal Round, 2025",
    formTitle: ["Verify", "a credential"],
    hint: "Ask for the certificate, the record or a reference behind any item. Opens your mail app.",
    form: {
      kind: "mail",
      to: MAIL_TO,
      subject: "Theoria: verify a credential",
      submit: "Send",
      fields: [
        { key: "name", placeholder: "NAME", label: "Name" },
        { key: "organisation", placeholder: "ORGANISATION", label: "Organisation" },
        { key: "item", placeholder: "WHICH ITEM?", label: "Which item", required: true },
        { key: "why", placeholder: "WHAT DO YOU NEED?", label: "What do you need" }
      ]
    }
  },
  sticker: ["Awards,", "publications &", "certificates"],
  cards: [
    {
      lockup: ["Award"],
      meta: ["Year · 2025", "Issued by · Aavishkar"],
      button: { label: "View project", href: "/magnara#stages" },
      photo: { caption: "Aavishkar Zonal Round winner, 2025 · real-time sign language support for video calls" },
      tabs: [
        { label: "Details", lead: "Aavishkar Zonal Round winner:", items: ["Title · Aavishkar Zonal Round winner", "Issued by · Aavishkar", "Year · 2025", "Category · competition win", "For · a real-time sign language support system for video calls"] },
        { label: "Skills shown", lead: "What it proves:", text: "Real-time computer vision (WebRTC, MediaPipe, CVZone), classical machine learning (Random Forest), and building an accessible product that works on ordinary hardware. The project was featured for the award." }
      ],
      patch: 47
    },
    {
      lockup: ["Publi", "cation"],
      meta: ["Published on · Zenodo", "DOI 10.5281/zenodo.20352667"],
      button: { label: "View publication", href: DOI },
      photo: { caption: "Published research on Zenodo · sign language support on video calls, 98.2% accuracy" },
      tabs: [
        { label: "Details", lead: "Published research:", items: ["Title · Sign language support on video calls (full title on the Zenodo record)", "Published on · Zenodo", "Category · publication", "Verify · the DOI link", "Result · 98.2% recognition accuracy"] },
        { label: "Skills shown", lead: "What it proves:", text: "Research method, evaluation and writing: a lightweight landmark-based approach measured at 98.2% accuracy with low latency. The full research is on the Projects & research page." }
      ],
      patch: 48
    },
    {
      lockup: ["Certif", "icate"],
      meta: [`Issued by · ${CERTIFICATE_NEEDED}`, `Year · ${CERTIFICATE_NEEDED}`],
      button: { label: "View certificate", href: "#ask" },
      photo: { caption: "Python certificate" },
      tabs: [
        { label: "Details", lead: "Placeholder · not a real credential yet:", items: ["Title · Python certificate", "Issued by · [CERTIFICATE NEEDED]", "Year · [CERTIFICATE NEEDED]", "Category · course, certification or training", "Image · none yet"] },
        { label: "Skills shown", lead: "What it proves:", text: "[CERTIFICATE NEEDED] Add a one-line description and the skills demonstrated once the certificate file and its verification link are in the repository." }
      ],
      patch: 45
    },
    {
      lockup: ["Certif", "icate"],
      meta: [`Issued by · ${CERTIFICATE_NEEDED}`, `Year · ${CERTIFICATE_NEEDED}`],
      button: { label: "View certificate", href: "#ask" },
      photo: { caption: "Certificate · title coming" },
      tabs: [
        { label: "Details", lead: "Placeholder · not a real credential yet:", items: ["Title · [CERTIFICATE NEEDED]", "Issued by · [CERTIFICATE NEEDED]", "Year · [CERTIFICATE NEEDED]", "Category · course, certification or training", "Image · none yet"] },
        { label: "Skills shown", lead: "What it proves:", text: "[CERTIFICATE NEEDED] Add a one-line description and the skills demonstrated once the certificate file and its verification link are in the repository." }
      ],
      patch: 46
    }
  ],
  info: {
    label: ["About my", "credentials"],
    blocks: [
      {
        title: "Awards & recognition",
        items: [
          { q: "What awards have you won?", a: "The Aavishkar Zonal Round, 2025, for the real-time sign language support system for video calls. The project was featured for the award." },
          { q: "What was recognised?", a: "A working accessibility product: real-time gesture recognition on ordinary hardware, at 98.2% accuracy." }
        ]
      },
      { title: "Publications", items: [{ q: "What have you published?", a: "Research on sign language support on video calls, on Zenodo, DOI 10.5281/zenodo.20352667. The full research is on the Projects & research page." }] },
      { title: "Certifications", items: [{ q: "What certificates do you hold?", a: "[CERTIFICATE NEEDED] None are listed in the portfolio yet. Each will show title, issuer, year, category and a verification link." }] },
      {
        title: "How to verify",
        items: [
          { q: "The publication", a: "Open the DOI link on Zenodo." },
          { q: "The award", a: "Ask through the form above and the record is sent." },
          { q: "Certificates", a: "Each will carry its own View certificate link." }
        ]
      }
    ],
    chips: { title: ["Recognition", "list"], items: ["Aavishkar Zonal Round 2025", "Zenodo publication", "98.2% accuracy", "Featured project", "[CERTIFICATE NEEDED]"] }
  },
  partners: {
    rows: [
      { key: "Recognised by", items: ["Aavishkar", "Zenodo"], size: "big" },
      { key: "Built with", items: ["WebRTC", "MediaPipe", "CVZone", "scikit-learn"], size: "mid" },
      { key: "Certified by", items: ["[CERTIFICATE NEEDED]"], size: "small" }
    ],
    promo: { key: "Promoted by", name: "Dhruv Bendre", sub: "AI engineer + data scientist" }
  },
  footer: { big: ["Theoria", "is proven"], logo: ["Theo", "ria"], sub: "certificates & achievements" }
};
