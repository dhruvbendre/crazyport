# ART.MD

## The visual constitution of Dhruv Bendre's solar system

This document is authoritative for how the universe looks. Part I sets the global rules every screen obeys: the home scene, every interior world, and the archive (the Streamlit application). Part II keeps the original crayon asset specifications the planets were drawn from, with the amendments that were made while building.

Read `plot.md` for what the universe *means*. Read this for how it is drawn.

---

# PART I · THE SYSTEM

# 1. Global aesthetic

**A hand-drawn solar system, catalogued in chalk.**

Two materials meet on black paper:

- **Crayon** is the matter of the universe. The Sun and the planets are coloured in with wax: broad directional strokes, fine scribbles, pressure highlights, slightly irregular silhouettes, a faint paper tooth. Warm, saturated, imperfect.
- **Chalk** is the hand of the cataloguer. Every celestial object is circled in white chalk the way an astronomer marks a find on a photographic plate. Labels, rules, leaders, boxes, inputs and the archive's marks are all chalk. Off-white, dusty, broken in places, never smooth.

Everything the visitor reads is chalk on black; everything the visitor visits is crayon. The interface never becomes a website: there are no bars, no cards, no pills, no glass. When an element feels like it came from an ordinary site, it is redrawn in one of these two materials until it belongs.

The drawing is deliberately imperfect. The code and the motion under it are not.

Hierarchy on the home scene, in order: solar system → planets → chalk outlines → annotations → environment.

Priority for every decision: **world first, interface second, content third, decoration last.**

# 2. Colour system

## 2.1 Background

| Token | Value | Use |
|---|---|---|
| `--space` | `#050505` | The black paper of the home scene. Never pure `#000`. |
| `--space-soft` | `#101010` | Rare lifted surfaces on the home scene. |
| world `field` | per world, below | The interior of a world: the same black, breathed on by the world's colour. |

## 2.2 Chalk

The only white in the universe. It appears in three tones and a family of opacities.

| Token | Value | Use |
|---|---|---|
| `--chalk` | `#f1f1e8` | Default chalk: outlines, names, rules, marks. |
| `--chalk-paper` | `#f8f8f2` | Chalk on a body that has just been pressed hard (emphasis rings). |
| `--chalk-bright` | `#ffffff` | Sparingly: a single specular fleck, a bright dust grain. |
| `--chalk-soft` | `rgba(241,241,232,0.72)` | Body copy, descriptors, secondary chalk. |
| `--chalk-faint` | `rgba(241,241,232,0.42)` | Metadata, catalog numbers, disabled marks. |
| `--chalk-dust` | `rgba(241,241,232,0.22)` | Dust specks, halos. |
| `--chalk-line` | `rgba(241,241,232,0.16)` | The faintest rules and the archive's answer thread. |

Chalk never glows. No `box-shadow`, no `text-shadow`, no blur radius above 0.4px. The "soft" chalk finish is a whisper of blur; the "grain" finish is displacement plus speckle (see §4).

## 2.3 Global neutrals

| Token | Value | Use |
|---|---|---|
| `--orbit` | `#f3efe0` | Orbit lines, stars on the home scene (warm, one step off chalk). |
| `--ink` | `#151515` | Text on the Sun and any light surface. |
| `--charcoal` | `#2a2724` | Dark crayon marks. |
| `--paper` `--paper-light` | `#e8e1cf` `#f5efdf` | Retained for the art-test board only. There is no paper frame in the universe (see Part II amendments). |

## 2.4 World colours

Each world owns an **accent** (its crayon), a **soft accent** (a 16% wash used for atmosphere), and a **field** (the near-black tint of its interior). Fields are the accent mixed to about 6% into `--space`; they must stay dark enough for chalk body copy to hold 12:1 contrast.

| World | Accent | Soft | Field |
|---|---|---|---|
| Hearth (Sun) | `#ffd84a` / `#f5a82c` | `rgba(255,216,74,0.16)` | `#050505` |
| Ferrin | `#7d847a` | `rgba(125,132,122,0.18)` | `#0d0f0e` |
| Emberline | `#d16f33` | `rgba(209,111,51,0.16)` | `#140c07` |
| Verdance | `#2e7ccb` + `#5d9c62` | `rgba(46,124,203,0.16)` | `#07111c` |
| Theoria | `#c74436` | `rgba(199,68,54,0.16)` | `#150807` |
| Magnara | `#f1852d` | `rgba(241,133,45,0.16)` | `#160b04` |
| Cadence | `#e6785a` (rings `#9c4c3a`) | `rgba(230,120,90,0.16)` | `#150a07` |
| Whimsel | `#42b69d` (ring `#2ba9df`) | `rgba(66,182,157,0.16)` | `#061411` |
| Mnemora | `#1889c0` | `rgba(24,137,192,0.16)` | `#0a1a2e` |
| Sonara | `#ff5fbc` (grooves `#b2237a`, flare `#fff133`) | `rgba(255,95,188,0.16)` | `#170812` (home scene only; the interior is a poster, see §8) |
| Signal | chalk | `rgba(241,241,232,0.12)` | `#070707` |

Accents are for crayon bodies and texture motifs. They are **not** used for text, buttons or borders. Interface elements are chalk; the world colour arrives through the field, the horizon and the ambient texture, never through tinted UI.

## 2.5 Text colours

| Role | Colour |
|---|---|
| Display (world names) | `--chalk` |
| Body | `--chalk-soft` |
| Metadata, catalog numbers, labels | `--chalk-faint` (uppercase) or `--chalk-soft` (descriptors) |
| On the Sun's disc | `--ink` |
| Placeholder / dev notes | `--chalk-faint`, monospace |

## 2.6 Accessibility of colour

- Chalk on any field: `--chalk` ≥ 15:1, `--chalk-soft` ≥ 10:1, `--chalk-faint` ≥ 5.5:1 (large or bold text only). Do not set body copy in `--chalk-faint`.
- Selection and focus are never colour-only: focus draws a second chalk ring; hover both scales the body and draws the emphasis ring and the annotation.
- The Sun's greeting in `--ink` on `#ffd84a` is 13:1.

# 3. Typography

Three faces, all open and free, loaded from Google Fonts with system fallbacks.

| Role | Face | Fallback | Where |
|---|---|---|---|
| **Display / hand** | Caveat 500–600 | Segoe Print, Bradley Hand, cursive | World names, annotations, section titles, links that are "written" (Back to the system, send a signal), the Sun's greeting, the archive's prompt line. |
| **Body / interface** | Manrope 400–700 | Nunito Sans, Segoe UI, system-ui | Body copy, descriptors, metadata, inputs, chips, the conversation. |
| **Intro** | Lacquer | Impact, Arial Black | The opening flight only. Never inside a world. |
| **Dev notes** | ui-monospace stack | Consolas | Placeholder panels and env-var hints only. |

## 3.1 Scale

| Element | Size | Line | Tracking | Face |
|---|---|---|---|---|
| World name (interior H1) | `clamp(64px, 11vw, 132px)` | 0.96 | −0.005em | Caveat 600, rotated −1.2° |
| Archive name (Streamlit H1) | `clamp(56px, 9vw, 96px)` | 0.96 | 0 | Caveat 600 |
| Descriptor under a name | `clamp(22px, 2.8vw, 30px)` | 1.2 | 0 | Caveat 500, `--chalk-soft`, rotated −0.8° |
| Section title | 30px | 1.1 | 0 | Caveat 600, rotated −0.6° |
| Annotation name (home) | 24 scene units (15 on mobile) | — | +0.01em | Caveat 600 |
| Intro / lede | `clamp(17px, 1.9vw, 20px)` | 1.6 | 0 | Manrope 400, `--chalk-soft`, max 50ch |
| Body | 17px | 1.66 | 0 | Manrope 400, `--chalk-soft`, max 62ch |
| Conversation | 17px | 1.6 | 0 | Manrope 400 |
| Metadata / eyebrow / catalog | 11–12px | 1.4 | +0.22em | Manrope 700, uppercase |
| Annotation descriptor (home) | 11.5 units (8.5 mobile) | — | +0.14em | Manrope 600, uppercase |
| Chips | 12.5px | 1 | +0.14em | Manrope 700, uppercase |
| Handwritten links | 20–21px | 1 | 0 | Caveat 500–600, rotated −1.5° to −2° |

Rotation is part of the type system: any Caveat element may tilt between −2° and +0.6°, never more, never on Manrope.

# 4. Chalk system

The chalk perimeter is the single most important shared element. It is generated, seeded, and never a CSS border.

## 4.1 Construction (`web/src/art/chalk.ts`, mirrored in `dhruv-rag/ui/horizon.py`)

A perimeter for a body of radius *r* is:

1. **Main ring**: a closed cubic path at 1.075 *r* with 16–30 anchors, radial wobble ±2.2%, handle jitter ±10%, a slow lean of 0.4–1.2% so it is never concentric with the body. Weight `1.6 + 0.006r` (≈1.7 for the smallest planet, 2.2 for the largest, 2.6 for the Sun). Opacity 0.86. Broken in 2–3 places by a dash pattern whose gaps are 1.5–4.5% of the circumference.
2. **Second pass**: 1.012× the main radius, 55% of the weight, opacity 0.42, offset by up to 1.2 units, broken in 3–5 places (3–8% gaps). The hand went round twice.
3. **Inner halo**: 0.985× the main radius, 1.7× the weight, opacity 0.12, broken in 2–4 places. Settled dust.
4. **Emphasis ring** (hidden): 1.02× the main radius, 1.35× weight, drawn in with `stroke-dashoffset` while the body is hovered, focused or selected; opacity 0.8 (1.0 on selection).
5. **Dust**: 6–16 specks at 0.96–1.12× the main radius, radius 0.35–1.1 units, opacity 0.18–0.5.

## 4.2 Finish

- **Grain** (`#chalk-grain`): low-frequency turbulence displacement (base 0.045, scale 1.8) bends the line the way a hand does not travel straight; a high-frequency speckle (base 0.9) is turned into an alpha mask so the stroke has holes and uneven density; a 0.22px blur softens the edge. Used on every planet, every horizon, and interior chalk marks.
- **Soft** (`#chalk-soft`): a 0.35px blur only. Used on bodies that transform every frame (the Sun under pointer parallax) so the filter is not re-rasterised at 60fps.

## 4.3 Motion of chalk

- Idle: none. Chalk is a drawing, not a shader.
- Hover / focus: the emphasis ring draws in over 0.55s (`power2.out`); dust brightens to 1.6× opacity; the whole perimeter jitters ±0.5° at 0.9s `sine.inOut` yoyo. On leave: emphasis fades in 0.3s and resets; jitter settles in 0.3s.
- Selection (entering a world): emphasis to full opacity in 0.3s, then the perimeter scales with the body.
- Reduced motion: no jitter; emphasis snaps in 0.15s.

## 4.4 Where chalk appears

Sun, every planet, the horizon of every interior world, the archive's horizon, annotation leaders, section rules, the threshold input, the placeholder panels, the archive's answer marks, focus rings.

## 4.5 Where chalk must not appear

Around the satellite, the meteor, asteroids and stars (they are environment, not catalogued bodies). Around text. Around buttons on the home scene (there are none). As a page border or a frame. As a glow.

# 5. Planet construction

Retained from Part II, with amendments:

- **Base form**: a hand-adjusted disc (12–24 anchors, 1–2.5% wobble). Never a perfect circle.
- **Texture**: broad directional hatch, fine scribbles, pressure highlights, a faint paper tooth pattern at 45% (`#crayon-tooth`). Authored strokes first; filters only to roughen.
- **Shadows**: a few darker strokes lower-right, lighter upper-left. No sphere lighting, no specular.
- **Atmosphere**: none on the body itself. On interior pages the world's soft accent is a single radial wash top-right (`.world::before`); that is the whole atmosphere.
- **Outline**: the chalk perimeter (§4) outside a thin crayon edge stroke of the body's own dark tone at 35–45% opacity.
- **Rings**: split into back and front halves so the body sits between them (Cadence, Whimsel).
- **Rotation**: bodies do not rotate. On hover the art leans −2.4° (micro wrapper) and returns; that is the only rotation.
- **Faces**: removed (see Part II amendments). No body has a face.

# 6. Motion

| Moment | Duration | Easing | Notes |
|---|---|---|---|
| Hover in (body scale to 1.10) | 320ms | `power2.out` | Micro lean −2.4° over 500ms; orbit line brightens 350ms |
| Hover out | 420ms | `power2.inOut` | Everything returns; nothing snaps |
| Annotation in / out | 360ms / 220ms | `power2.out` / `power2.in` | 4-unit rise; persistent on touch layouts |
| Enter a world | ~720ms | `power3.inOut` | See sequence below |
| Interior text draw-in | 350ms fade + 550ms stagger 60ms | `power3.out` | `[data-enter]` items |
| Return to the system | ~380ms | `power2.in` / `power2.inOut` | Page lifts −12px, black veil, scene resumes |
| Leave for the archive | ~550ms | `power2.in` | Page settles, field veil, then the browser navigates |
| Orbit draw-in (first visit) | 0.7–1.06s staggered 70ms | `power2.inOut` | Stroke-dash |
| Star twinkle | 2.8–6.5s | `sine.inOut` | 10–15% of stars only |
| Meteor | 1.3–2.2s every 9–18s | linear | Occasional |

**Entering a world**, in order: chalk emphasis (0–0.3s) and annotation out (0–0.2s) → universe falls back to 28% (0–0.5s) → the planet rises above its neighbours and grows to 2.6× toward the viewport centre (0.04–0.7s) → the world's field colour spreads from the planet's screen position until it covers the viewport (0.12–0.72s) → route change at 0.72s → the interior draws in with the same body risen as its horizon.

**Reduced motion** (`prefers-reduced-motion: reduce`): no parallax, no meteor flight (one frozen meteor), no twinkle beyond a slow breath on four stars, no jitter, no lean. Hover scale 1.04 in 120ms. Entering a world is a 180ms field-colour cross-fade. Interior text fades in 150ms. Everything remains reachable.

Performance rules: filters never animate continuously; the Sun uses the soft finish; the home scene stays under ~1,500 SVG nodes; hidden tabs pause the GSAP ticker; labels live in one layer above the planets rather than inside nine transform stacks.

# 7. Components

- **Annotation (home scene)**: a chalk leader (1.1 units, 70%) from the perimeter at ±35°, then `CATALOG · Name` in Caveat with the numeral in Manrope small caps, the world glyph, and the descriptor in uppercase Manrope. Placed above/below and left/right per layout so it never crosses a neighbour; centred on narrow layouts. Never a card.
- **World glyph**: one 24×24 chalk symbol per world, 1.6 stroke, round caps, at most one dot fill. Ferrin anvil, Emberline ember trail, Verdance sprout, Theoria lens, Magnara bands, Cadence loop, Whimsel tilted ring, Mnemora open ring with a dot, Signal two arcs.
- **Handwritten link** (Back to the system, send a signal, Next orbit): Caveat, `--chalk-soft`, tilted, an underline or a tiny crayon Sun. Hover: `--chalk`.
- **Chalk rule**: a 600-unit wavy path stretched to its container with `vector-effect: non-scaling-stroke`, 1.4px, 38–55% opacity.
- **Chip / button**: transparent, 1.3px `--chalk-faint` border, the sketchy uneven border-radius (`200px 8px 180px 8px / 8px 180px 8px 200px`), uppercase Manrope 12.5px, alternating ±0.6° tilt. Hover: chalk border and text. Never filled, never rounded-pill.
- **Input**: the same sketchy border at 1.6px `--chalk-soft`, 18px padding, Manrope 17px, placeholder `--chalk-faint`, focus = `--chalk` border. The submit is a handwritten "Ask" with the world glyph.
- **Placeholder panel** ("Not yet catalogued"): the sketchy border at 1.5px `--chalk-faint`, world glyph top-left, Caveat title, monospace note. Rotated −0.35°.
- **Panel / section**: no box. A chalk rule, a Caveat title in a 240px column, body in the remaining column.
- **Navigation**: the solar system is the navigation. Interiors have only Back to the system (top-left), Next orbit and send a signal (footer). No navbar anywhere.
- **Chat messages** (archive): a visitor turn is `you` handwritten in the margin and the question in `--chalk-soft`; an archive turn is marked by the Mnemora glyph (or a chalk cross-star for a refusal), a `the archive` eyebrow, the answer in `--chalk`, and a `from the archive` line in Caveat with the sources as underlined chalk items. A hairline chalk thread runs down the left of each answer. No bubbles, no avatars, no sparkle icons, no emoji.

# 8. Interior pages

Every planetary interior must:

1. Use its world's `field` as the page background and expose `--planet-accent`, `--planet-accent-soft`, `--planet-field` on `<main>`.
2. Open with Back to the system top-left and `World N` top-right.
3. Set the world name in Caveat display size, its descriptor beneath, a chalk rule, then an intro in Manrope.
4. Draw its ambient layer: a faint grain, two chalk orbit arcs crossing the top-right corner, sparse stars, and the world's **texture motif** in its accent at 5–18% opacity (hatch, ember trail, fields, strata, bands, rings, tilted ring, dust).
5. Rise its own crayon body as a horizon at the foot of the page, chalk perimeter intact, with a field-colour fade over its top 42%.
6. End with Next orbit and send a signal.
7. Render sections without boxes and placeholders as uncatalogued panels.
8. Animate in with the shared `[data-enter]` stagger and leave through the shared veil.

A world may add: its own texture motif (required), its own layout of sections, ambient marks in its accent, a custom interior (Mnemora's threshold, the archive itself). A world may not add: a different type system, a different chalk, coloured UI, cards, a different navigation.

**Amendment (2026-09-05): every interior is a festival poster.** At Dhruv's request the interiors left the chalk system. Sonara (IX) was drawn first as a poster modelled on lollaindia.com; the same template now dresses every world and Signal (`pages/FestivalPage.tsx`, `styles/festival.css`, one content file per world in `data/festival/`, one 50-slot doodle pack per world in `web/public/festival/<world>/`, spec in `festival-pages-brief.md`). Each keeps rules 2, 5, 6 and 8 (Back to the system, its crayon body as the horizon, a next-orbit link, the shared enter/leave motion) and drops the rest: Archivo (width 125 / weight 900 for display, normal width for body) and Anton for the lineup instead of Caveat and Manrope; a ticker, a sticky nav, torn-paper cards and coloured blocks in the world's own palette (poster, nav, ticker, board and four block colours per content file); the constants are near-black `#18120f`, white, the red CTA `#fb4a40` and the yellow-green button `#d4da00`. The chalk-and-crayon rules still govern the home scene, the horizon, and the archive (Streamlit) in full. `WorldPageShell` and `data/portfolio.ts` remain as the chalk interior kit and can dress a world again by changing `pages/WorldPage.tsx`.

The archive (Streamlit) is an interior page of Mnemora and follows the same rules with the same tokens, the same fonts, the same horizon construction and the same chalk. Default Streamlit chrome is hidden; every component is restyled.

# 9. Responsive behaviour

- **Desktop (≥1200px)**: the 1440×1000 composition, `slice` fitted; pointer parallax; annotations on hover; the richest experience.
- **Tablet landscape (768–1199px, wide)**: the desktop composition with larger hit targets; annotations always visible; no parallax.
- **Tablet portrait (768–1199px, tall)**: the 840×1120 composition, Sun anchored lower-left, worlds cascading up the right; annotations always visible with authored placements.
- **Mobile (<768px)**: the 430×1000 vertical composition, Sun entering top-left, worlds flowing downward on nested orbits; the page scrolls; annotations always visible, compact and centred where the column is narrow; send a signal sits below the scene.
- Interiors: single column below 760px; the section title stacks over its body; the horizon keeps 200px minimum; the world name scales with `clamp`.
- Archive: 820px column; conversation margins collapse below 640px; the horizon shrinks to 130px.

# 10. Accessibility

- Every planet is an SVG `<a href>` with an `aria-label` naming the world and its section, a `<title>`, a 44–54px hit target, Enter activation, modifier-click pass-through.
- Focus draws a double chalk ring around the hit area (`.planet-focus`), and triggers the same annotation and emphasis as hover. Chalk is never the only signal: the annotation text names the world.
- Tab order follows visual depth order (front to back), which is stable; the `visually-hidden` list under the scene reads all eight worlds and their sections.
- Interiors are semantic: one `<h1>`, `<h2>` per section, `<main id="main">`, a skip link.
- Contrast per §2.6. Focus outlines are 2px chalk with 4px offset everywhere, including Streamlit.
- Reduced motion per §6. Nothing requires motion to be understood.
- Screen readers: decorative SVG is `aria-hidden`; the horizon and ambient layers are hidden; the archive's answer marks are decorative and the eyebrow text is real text.
- Keyboard in the archive: the input is a native textarea, chips are native buttons, submit works with Enter.

# 11. Anti-patterns (banned)

- Generic SaaS interfaces, top navbars, About / Work / Contact menus.
- Default Bootstrap, default Streamlit, default anything.
- Glassmorphism, frosted panels, backdrop blur.
- Neon, cyberpunk, HUD brackets, scanlines.
- Giant cards, cards at all as a layout primitive, rounded pills.
- Gradients as a finish. One radial wash per world is the limit.
- Generic space wallpaper, stock planet images, icon-pack planets, emoji.
- AI sparkle icons, robot avatars, chat bubbles.
- Smooth vector-perfect circles for anything visible.
- A smooth white CSS border pretending to be chalk.
- Paragraphs on the home scene.
- A world designed outside this system.
- Gratuitous animation: anything that moves without a reason the visitor can feel.

---

# PART II · CRAYON ASSET SPECIFICATIONS (retained)

The planets, Sun, satellite, meteor, asteroids, orbit lines and stars were drawn to the specification below, as pure SVG generated in code (`web/src/art/`). It remains the reference for redrawing or adding a body.

## Amendments made while building

These override the retained text where they conflict:

1. **No faces.** §4 (Face style) and every per-body "Face" subsection are void. No body carries eyes, a nose or a mouth. The `data-face` hooks in the motion code are dormant.
2. **No paper frame.** §19 is void. The black space field fills the viewport edge to edge; `--paper` survives only on the art-test board.
3. **Planets pass behind the Sun.** The Sun layer renders above the planet layer.
4. **Chalk perimeters** (Part I §4) are added around the Sun and every planet. They are not part of the crayon artwork and live outside the art components.
5. **Planets hold still.** `STATIC_ORBITS` keeps each body at its composed position; the orbit engine remains wired for when motion is wanted.
6. **Real planet names are internal ids only.** The visible universe uses the world names in `plot.md`.

## 0. Purpose

Create every visual asset for the interactive solar-system portfolio as pure SVG code. The assets must feel hand-drawn using wax crayons, pastel pencils, chalk, rough paper, and ink lines. The result must not feel like polished corporate vector illustration. The art must be usable directly in React as inline SVG components and remain editable in code.

## 1. Absolute art rules

1. Pure SVG only for all celestial art.
2. No embedded PNG, JPEG, WebP, base64 image, or external image reference.
3. No emoji.
4. No icon library planets.
5. No stock SVG illustrations.
6. No realistic astronomy textures.
7. No photorealistic shading.
8. No glossy 3D gradients.
9. No perfectly geometric vector look.
10. No thick black cartoon outline around every shape.
11. Use subtle handmade irregularity on silhouettes.
12. Use visible layered crayon strokes.
13. Each planet must remain recognizable at approximately 60 to 180 CSS px.
14. Every asset must have a clean transparent SVG background.
15. All texture must be generated with SVG paths, masks, patterns, and filters.
16. Keep SVG complexity performant enough for continuous animation.

## 2. Shared visual language

Every planet combines warm paper tooth, broad crayon body fill, lighter pressure streaks, darker scribble strokes and a slightly uneven edge. Silhouettes are hand-adjusted paths with 12 to 24 control points and 1 to 2.5 percent radial variation, or a near-circle plus a very low strength `feDisplacementMap`. A planet contains at least three classes of marks: broad fill texture following the dominant direction, fine scribbles with irregular spacing and opacity, and short pressure highlights where wax catches the grain. Never rely on a noise filter alone.

## 3. Shared SVG definitions

`crayonRoughness` (fractal noise 0.035, two octaves, displacement 0.8–2.2), `paperGrain` (subtle fractal noise at low opacity), `chalkSoftness` (blur under 0.9 units). Rendered once per page.

## 5. Sun

ViewBox `0 0 700 850`, partial disc extending off the left edge, 14 to 22 hand-cut triangular corona rays of varied length, width and angle, never a symmetrical sunburst. Base `#FFD84A #F9C63A #F5A82C`; strokes `#FFF08A #EFA537 #E5902D`. Broad yellow crayon strokes, orange undertones near the corona, lighter streaks toward the centre, faint paper grain. No radial gradient as the visible finish. The greeting is handwritten on the visible part of the disc.

## 6. Mercury slot (Ferrin)

ViewBox `0 0 120 120`. Palette `#7D847A #9A9D91 #61675F #BBB9A9`. Tiny uneven grey-green body, 3 to 5 darker crater-like marks, legible at 45 to 55 px.

## 7. Venus slot (Emberline)

ViewBox `0 0 150 150`. Palette `#D16F33 #E28A3D #B85D2C #F0A44E`. Orange / burnt sienna crayon, 5 to 8 curved horizontal strokes, soft lighter edge upper-left. Must not resemble the Jupiter slot.

## 8. Earth slot (Verdance)

ViewBox `0 0 220 220`. Ocean `#2E7CCB #3D8FDC #2367B0`; land `#5D9C62 #6EAE69 #4F8755`; clouds `#E9E5D5 #F4EFDE`. Slightly irregular circle, 5 to 8 abstract continents (no geographic precision), blue diagonal scribbles, green cross-hatching, off-white short cloud strokes.

## 9. Mars slot (Theoria)

ViewBox `0 0 160 160`. Palette `#C74436 #D95B43 #A7352E #E17654`. Red-orange body, 3 to 6 darker crater scribbles, broad diagonal strokes.

## 10. Jupiter slot (Magnara)

ViewBox `0 0 300 300`, one of the most prominent bodies. Palette `#F1852D #E7682C #F5A03B #D34C2D #F1B052`. 8 to 12 hand-drawn horizontal bands with irregular curvature and uneven thickness, several overlapping strokes; optional subtle oval spot.

## 11. Saturn slot (Cadence)

ViewBox `0 0 360 260`. Body `#E6785A #EF8D6B #CC5F48 #F1A078`; rings `#9C4C3A #B15A43 #D47758 #774234`. 3 to 5 broad hand-drawn elliptical ring bands split into back and front groups, uneven thickness, no metallic shine.

## 12. Uranus slot (Whimsel)

ViewBox `0 0 260 260`. Palette `#42B69D #5EC7AC #2B9B88 #76D2B8`; ring `#2BA9DF #57C2EB` crossing at a steep angle as a crayon line. Green / turquoise broad diagonal streaks.

## 13. Neptune slot (Mnemora)

ViewBox `0 0 220 220`. Palette `#1889C0 #247FB2 #146C9D #3699C9`. Blue body, subtle violet/cyan cross-strokes, 4 to 7 broad curved texture bands. Calmer and darker than the Uranus slot. This body is also the archive's horizon (`dhruv-rag/ui/horizon.py`), regenerated in Python with the same construction.

## 14. Meteor

ViewBox `0 0 220 90`. Irregular rounded yellow-orange head, long rough red/orange crayon flame tail, 2 to 4 trail strokes. Palette `#FFC447 #F89932 #E55832 #C93E2A`. Tapers unevenly, no clean gradient trail.

## 15. Satellite

ViewBox `0 0 180 130`. Small central body, two rectangular solar panels with imperfect crayon grid lines, tiny antenna. Palette `#E7E3D4 #7C8791 #4D6475 #9CB5C5 #2E3438`. Legible at 45 to 65 px. No text or logos.

## 16. Asteroids

8 to 12 reusable variants: irregular 6 to 12 point pebble paths with 1 to 3 internal crayon marks. Palette `#B39A72 #C2AA7D #8E7C61 #D0B88A #776B59`. Instanced at different sizes and rotations; 15 to 25 percent drift slowly.

## 17. Orbit lines

Pure SVG paths: warm off-white `#F3EFE0`, thin, rounded caps, subtle waviness, no glow, with a second slightly offset stroke at 8 to 15 percent opacity for pencil pressure. Solved from the composition so each passes exactly through its planet's position.

## 18. Stars

Pinpricks (1.5 to 3 px irregular circles), chalk dots (3 to 6 px uneven blobs), cross stars (two slightly curved crossing lines), blue-white specks. Palette `#F3EFE0 #D8D7CD #AFC9D5`, `#FFFFFF` sparingly. Seeded positions; no perfect five-point stars.

## 20. Crayon stroke construction

For every large planet add directional scribble groups by hand: varied widths, varied opacity, round linecaps, overlapping strokes, imperfect paths, not all parallel. Do not rely only on filters.

## 21. Highlight and shading

A few lighter marks upper-left, a few darker strokes lower-right. No realistic sphere light source, no glossy specular. Planets look coloured-in, not rendered.

## 22. Performance

Large planets 60 to 120 visible path elements, small planets 20 to 60. Shared clipPaths, masks, reusable groups, instanced asteroids. Modest filters, never stacked per child path.

## 23–25. Component API and naming

Each asset is a React component with a stable viewBox, centre, body radius and extents registered in `PlanetArtRegistry.ts`. Internal ids are namespaced per instance with `useId()`. Art is `aria-hidden`; the link around it carries the label.

## 26. Art QA checklist

- Can the body be identified without its label?
- Does it look hand-coloured rather than digitally filled?
- Is the silhouette subtly imperfect?
- Are there enough marks to feel crayon-made?
- Is it still clean enough to animate?
- Does it avoid heavy gradients and mascot outlines?
- Does it remain attractive against the black field, and inside its chalk perimeter?

## 27. Whole-system QA

- The Sun dominates the left; the outer worlds cascade upper-right; Verdance is clearly visible lower-middle; the small inner worlds sit near the Sun.
- Sizes vary dramatically; colours are warm and crayon-like.
- Orbit lines feel hand-drawn; the star field feels analog; the belt is clear lower-right.
- Every body carries its chalk perimeter and its annotation appears without crossing a neighbour.
- Nothing looks like a stock vector icon.

## 28. Prohibited shortcuts

No icon-package planets, no CSS-gradient circles, no image textures, no noise PNGs, no canvas rasters, no Three.js spheres, no perfect concentric ellipses, no classroom clip-art style, no large black outlines, no sticker gloss, no text inside artwork.
