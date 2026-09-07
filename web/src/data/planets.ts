/**
 * Central planet configuration: the world registry.
 *
 * Every planet has two identities:
 *
 *   - an *art slot* (`id`): "mercury", "venus", … These name the drawing, the
 *     orbit geometry and the colour family. They never appear in the UI.
 *   - a *world* (`name`, `descriptor`, `section` …): the fictional identity the
 *     visitor sees, plus one plain-language purpose (the `descriptor`, drawn
 *     under the name on the home scene) so every planet answers one question.
 *
 * Restructure of 2026-09-05: each world has exactly one purpose (see
 * festival-pages-brief.md §0). The saturn slot is Signal (about me and
 * contact). Whimsel (uranus) is the playground: experiments and toys. The
 * former Cadence content (data/festival/cadence.ts) is kept without a slot.
 *
 * Positions and sizes live in sceneLayouts.ts because they differ per
 * breakpoint. Interior content lives in data/festival/<slug>.ts.
 */
export type PlanetId =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune"
  | "pluto";

/** Per-world texture motif reused by the interior page (see art.md §9). */
export type WorldTexture = "hatch" | "ember" | "fields" | "strata" | "bands" | "rings" | "tilt" | "dust" | "grooves";

/** Small chalk symbol drawn beside labels and answers (see art/WorldGlyph.tsx). */
export type WorldGlyph = "anvil" | "ember" | "sprout" | "lens" | "band" | "loop" | "tilt" | "memory" | "signal" | "wave";

export type PlanetConfig = {
  id: PlanetId;
  /** Fictional world name (visible). */
  name: string;
  /** URL slug, derived from the world name. */
  slug: string;
  /** Roman catalog number, in orbital order from the Sun. */
  catalog: string;
  /** Short plain label shown under the name on the home scene: the world's purpose. */
  descriptor: string;
  /** What this world holds in the portfolio (document titles, page eyebrows). */
  section: string;
  /** The one question this world answers. */
  question: string;
  route: string;
  orbitId: string;
  /** Seconds per full revolution (only used when STATIC_ORBITS is off). */
  orbitDuration: number;
  /** Render order inside the planet layer (higher = in front). */
  zIndex: number;
  accent: string;
  accentSoft: string;
  /** Deep near-black tint of the world's interior. */
  field: string;
  /** Dark ink for the rare places the accent is used as a background. */
  ink: string;
  glyph: WorldGlyph;
  texture: WorldTexture;
  ariaLabel: string;
  /** Conceptual introduction to the world. */
  intro: string;
  /** True for the world whose interior is a separate application (Mnemora). */
  external?: boolean;
  /**
   * Interior style marker. Since 2026-09-05 every world's interior is a
   * festival poster (pages/FestivalPage.tsx, data/festival/*.ts); the flag is
   * kept for the record on the world that started it.
   */
  interior?: "festival";
  /**
   * RESERVED / TBD: kept in the registry (art, layouts, content) but not drawn
   * on the orbit, not routable, and not part of the journey.
   */
  reserved?: boolean;
};

/** Every art slot, including reserved worlds. Use `planets` for what the visitor sees. */
export const allPlanets: PlanetConfig[] = [
  {
    id: "mercury",
    name: "Ferrin",
    slug: "ferrin",
    catalog: "I",
    descriptor: "Skills & tools",
    section: "Skills & tools",
    question: "What can he build with?",
    route: "/ferrin",
    orbitId: "orbit-mercury",
    orbitDuration: 18,
    zIndex: 40,
    accent: "#7d847a",
    accentSoft: "rgba(125, 132, 122, 0.18)",
    field: "#0d0f0e",
    ink: "#2b2f2a",
    glyph: "anvil",
    texture: "hatch",
    ariaLabel: "Ferrin, the first world: skills and tools",
    intro: "The small dense world closest to the fire. Iron, plain and quick: the tools, languages and habits that every other world is built with."
  },
  {
    id: "venus",
    name: "Emberline",
    slug: "emberline",
    catalog: "II",
    descriptor: "Experience",
    section: "Experience",
    question: "Where has he worked?",
    route: "/emberline",
    orbitId: "orbit-venus",
    orbitDuration: 24,
    zIndex: 45,
    accent: "#d16f33",
    accentSoft: "rgba(209, 111, 51, 0.16)",
    field: "#140c07",
    ink: "#3a2416",
    glyph: "ember",
    texture: "ember",
    ariaLabel: "Emberline, the second world: experience",
    intro: "A trail of embers. The places, teams and roles a path has passed through, drawn as a line that is still warm."
  },
  {
    id: "earth",
    name: "Verdance",
    slug: "verdance",
    catalog: "III",
    descriptor: "My story",
    section: "My story",
    question: "How did he get here?",
    route: "/verdance",
    orbitId: "orbit-earth",
    orbitDuration: 31,
    zIndex: 60,
    accent: "#2e7ccb",
    accentSoft: "rgba(46, 124, 203, 0.16)",
    field: "#07111c",
    ink: "#12305a",
    glyph: "sprout",
    texture: "fields",
    ariaLabel: "Verdance, the third world: my story",
    intro: "The green and blue world, the one with a satellite. One long story, read top to bottom as it grew: where it started, what changed, and what comes next."
  },
  {
    id: "mars",
    name: "Theoria",
    slug: "theoria",
    catalog: "IV",
    descriptor: "Certificates & achievements",
    section: "Certificates & achievements",
    question: "What proves his learning and achievements?",
    route: "/theoria",
    orbitId: "orbit-mars",
    orbitDuration: 38,
    zIndex: 50,
    accent: "#c74436",
    accentSoft: "rgba(199, 68, 54, 0.16)",
    field: "#150807",
    ink: "#4a1a14",
    glyph: "lens",
    texture: "strata",
    ariaLabel: "Theoria, the fourth world: certificates and achievements",
    intro: "The red world. Proof cut into strata: certificates, awards and the publication that backs the work."
  },
  {
    id: "jupiter",
    name: "Magnara",
    slug: "magnara",
    catalog: "V",
    descriptor: "Projects & research",
    section: "Projects & research",
    question: "What has he built and researched?",
    route: "/magnara",
    orbitId: "orbit-jupiter",
    orbitDuration: 52,
    zIndex: 70,
    accent: "#f1852d",
    accentSoft: "rgba(241, 133, 45, 0.16)",
    field: "#160b04",
    ink: "#4d2a10",
    glyph: "band",
    texture: "bands",
    ariaLabel: "Magnara, the fifth world: projects and research",
    intro: "The great banded world. Each band is something that was built from an idea and shipped into the open, and the research runs underneath them."
  },
  {
    // The ringed world is Signal itself: about me and contact, the end of the journey.
    id: "saturn",
    name: "Signal",
    slug: "signal",
    catalog: "VI",
    descriptor: "About me & contact",
    section: "About me & contact",
    question: "Who is he and how do I reach him?",
    route: "/signal",
    orbitId: "orbit-saturn",
    orbitDuration: 62,
    zIndex: 65,
    accent: "#e6785a",
    accentSoft: "rgba(230, 120, 90, 0.16)",
    field: "#150a07",
    ink: "#4b2418",
    glyph: "signal",
    texture: "rings",
    ariaLabel: "Signal, the ringed world: about Dhruv and how to contact him",
    intro: "The ringed world. Who Dhruv is, what he does, and every channel that reaches him."
  },
  {
    id: "uranus",
    name: "Whimsel",
    slug: "whimsel",
    catalog: "VII",
    descriptor: "Playground",
    section: "Playground & experiments",
    question: "What does Dhruv build for fun?",
    route: "/whimsel",
    orbitId: "orbit-uranus",
    orbitDuration: 72,
    zIndex: 55,
    accent: "#42b69d",
    accentSoft: "rgba(66, 182, 157, 0.16)",
    field: "#061411",
    ink: "#0f3d33",
    glyph: "tilt",
    texture: "tilt",
    ariaLabel: "Whimsel, the seventh world: Dhruv's playground and experiments",
    intro: "Tilted on its side. Toys, half-ideas and experiments that may never ship.",
    interior: "festival"
  },
  {
    id: "neptune",
    name: "Mnemora",
    slug: "mnemora",
    catalog: "VIII",
    descriptor: "Ask me",
    section: "Ask me",
    question: "What do I want to ask him?",
    route: "/mnemora",
    orbitId: "orbit-neptune",
    orbitDuration: 84,
    zIndex: 52,
    accent: "#1889c0",
    accentSoft: "rgba(24, 137, 192, 0.16)",
    field: "#0a1a2e",
    ink: "#0d3550",
    glyph: "memory",
    texture: "dust",
    ariaLabel: "Mnemora, the outermost archive: ask the portfolio about Dhruv",
    intro: "The archive remembers all of it. Ask it about Dhruv, and it answers only from what it holds.",
    external: true
  },
  {
    id: "pluto",
    name: "Sonara",
    slug: "sonara",
    catalog: "IX",
    descriptor: "Music",
    section: "Music",
    question: "What does he listen to?",
    route: "/sonara",
    orbitId: "orbit-pluto",
    orbitDuration: 96,
    zIndex: 48,
    accent: "#ff5fbc",
    accentSoft: "rgba(255, 95, 188, 0.16)",
    field: "#170812",
    ink: "#5a1a44",
    glyph: "wave",
    texture: "grooves",
    ariaLabel: "Sonara, the ninth world: Dhruv's music",
    intro: "You hear this world before you see it. The soundtrack behind everything else.",
    interior: "festival"
  }
];

/** The worlds the visitor can see and visit, in orbital order. */
export const planets: PlanetConfig[] = allPlanets.filter((p) => !p.reserved);

export const planetById: Record<PlanetId, PlanetConfig> = Object.fromEntries(
  allPlanets.map((p) => [p.id, p])
) as Record<PlanetId, PlanetConfig>;

export function planetForRoute(pathname: string): PlanetConfig | undefined {
  return allPlanets.find((p) => p.route === pathname);
}

export function planetForSlug(slug: string): PlanetConfig | undefined {
  return allPlanets.find((p) => p.slug === slug);
}

/** Orbital order of the visible worlds, used for keyboard tabbing. */
export const planetOrder: PlanetId[] = planets.map((p) => p.id);

/**
 * The visitor journey (festival-pages-brief.md §0.3): personality →
 * capability → proof → experience → credentials → story → conversation →
 * connection. "Next orbit" links follow this order; the last world is Signal
 * (the ringed world), which returns to the system.
 */
export const journeyOrder: PlanetId[] = ["pluto", "mercury", "earth", "venus", "mars", "jupiter", "uranus", "neptune", "saturn"];

/** The world you can talk to. */
export const ARCHIVE_PLANET_ID: PlanetId = "neptune";

export const HOME_ROUTE = "/";
export const SIGNAL_ROUTE = "/signal";
export const ART_TEST_ROUTE = "/art-test";
