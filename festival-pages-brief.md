# FESTIVAL PAGES BRIEF

## Every world as a Lolla-style poster: colour themes, content and the SVG packs to draw

> **Status (2026-09-05, evening).** All ten packs were delivered and wired. The system was then restructured (§0 below) so each world has one purpose, the flip-clock counters were removed from the board, and every heading was rewritten for clarity. §3 to §11 below remain the original per-world drawing briefs; where they conflict with §0, §0 wins.

---

# 0. Current structure (source of truth)

## 0.1 One purpose per world

| Route | World | Category (shown under the name on the home scene) | The question it answers |
|---|---|---|---|
| `/sonara` | Sonara | Music | What does he listen to? |
| `/ferrin` | Ferrin | Skills & tools | What can he build with? |
| `/verdance` | Verdance | Projects & research | What has he built and researched? |
| `/emberline` | Emberline | Experience | Where has he worked? |
| `/theoria` | Theoria | Certificates & achievements | What proves his learning and achievements? |
| `/magnara` | Magnara | My story | How did he get here? |
| `/mnemora` | Mnemora | AI archive · ask me | What do I want to ask him? |
| `/signal` | Signal (the ringed world, saturn art slot) | About me & contact | Who is he and how do I reach him? |
| `/whimsel` | Whimsel | **RESERVED / TBD** | off the orbit, route returns not-found, code and pack kept |
| `/cadence` | (former Cadence content) | **RESERVED / TBD** | no art slot any more (saturn became Signal); `data/festival/cadence.ts` and its pack are kept |

Registry: `web/src/data/planets.ts` (`reserved`, `descriptor`, `question`, `journeyOrder`). Content: `web/src/data/festival/<slug>.ts`. Page: `web/src/pages/FestivalPage.tsx`. Styles: `web/src/styles/festival.css`.

## 0.2 Copy rules

- **Clarity first, personality second.** Every heading says what the section is (My projects, My roles, What the archive knows). Personality lives in the typography, colours, doodles, world names, taglines and the "X IS Y" footer line.
- Each page states both identities: the world name and the plain category (nav lockup, ticker, hero eyebrow, board, footer).
- Button labels describe the action: View project, Read research, View certificate, Open resume, Contact me, Ask a question, Send message.
- No developer text in the UI. When the archive is not connected, Mnemora shows "Archive coming online soon."; the environment hint goes to the dev console.
- Facts only. Missing facts are labelled `[STORY DETAIL NEEDED]` or `[CERTIFICATE NEEDED]`, never invented.

## 0.3 Visitor journey (Next links)

Sonara → Ferrin → Verdance → Emberline → Theoria → Magnara → Mnemora → Signal → Return to orbit.

## 0.4 The board (block 5)

No counters, no flip clocks. Left column (about 45%): category label, world name, one-line tagline, the world's **planet** (the same crayon body as the home scene and the horizon, drawn in code), two or three plain statistics, an "updated" line. Right column (about 55%): one action: a mail form, or on Mnemora the ask box with topic chips. Stacks vertically below 860px with the planet still visible.

## 0.5 Asset hooks (for the final asset directory)

Every path is optional in `FestivalContent.assets`; defaults are the slot packs in `web/public/festival/<world>/NN.svg` and the code-drawn planet.

```ts
assets?: {
  dir?: string;                            // slot pack folder override
  planetImage?: string;                    // finished planet image for the board
  heroAssets?: Record<number, string>;     // slot → URL, black hero band
  posterAssets?: Record<number, string>;   // slot → URL, poster
  cardImages?: Record<number, string>;     // card index → screenshot / scan
  certificateImages?: Record<string, string>; // credential id → image (Theoria)
}
```

Signal's planet is the ringed saturn body; a world without a planet would show a labelled placeholder ring until `planetImage` is set.

---

Sonara (`/sonara`) is the reference. This brief turns every other page into the same poster system with a different colour theme and different information about Dhruv. Read §1 for the shared template, §2 for the SVG rules and the fixed slot system, then one section per world (§3 to §11) for the palette, the content that goes in each slot, and the list of SVGs to draw.

Deliver each pack as a folder: `web/public/festival/<world>/` with the numbered files named exactly as in §2.4. Once a folder is in place the page is wired with the same code as Sonara; only the data file and the colour tokens change.

---

# 1. The shared template

Every page has the same ten blocks in the same order, at the same sizes. This is the visual hierarchy measured from lollaindia.com and already built for Sonara in `web/src/pages/SonaraPage.tsx` and `web/src/styles/festival.css`.

| # | Block | What it is | Type | Size (desktop) |
|---|---|---|---|---|
| 1 | **Ticker** | Marquee strip, 4 short phrases repeated end to end, a tiny mark between each | Archivo 700, 14px, uppercase, +0.7px | 44px tall, full width |
| 2 | **Nav** | Sticky bar: Back to the system, the world's lockup, three anchor links, one red button | Archivo 700, 16px, uppercase, +0.4px, white | 80px tall |
| 3 | **Hero band** (near-black) | Eyebrow, the headline in three parts (lead · *italic* · **WIDE**), one red 20px button, 12 doodles | Archivo wdth 125 / 900, 38 to 76px | min 300px |
| 4 | **Poster** (the world's main colour) | The "lineup": every item in Anton, white on black boxes with a blue offset shadow, 5 tiers, 33 doodles around it | Anton, 54 / 44 / 32 / 24 / 19px | full width, ~600px |
| 5 | **Board** (secondary colour, 20px radius) | Left: a two-line heading and three two-digit flip counters with labels. Right: a heading, a one-line hint, four dark inputs, a red Submit | Archivo 900 36px; digits 84px; labels 18px | 1200px wide, overlaps the poster by 60px |
| 6 | **Ticket cards** | A blue torn sticker heading, then four white torn-paper cards: stacked lockup, two meta lines with a pin, a red button, a black tab bar with two tabs, a list or a paragraph, a pattern patch behind each | Anton lockup 30px; tabs 14px; body 13px | 2 × 2 grid |
| 7 | **Information** (near-black) | A white torn label, four coloured blocks in a 2fr / 1fr grid, each with a heading and question / answer pairs; then a chip strip | Archivo 800 26px headings; 14px body | full width |
| 8 | **Partner strip** (near-black) | Three rows of wordmarks (big / medium / small) and a red promo tab on the right | Archivo wdth 110 / 900, 34 / 22 / 16px | full width |
| 9 | **Footer** (the nav colour) | "WORLD IS ___" in 44px, a yellow-green button to the next orbit, the stacked Anton logo in the centre, three icon squares and "Brought to you by" on the right, a legal line | Archivo 900 44px; Anton 64px | full width |
| 10 | **Horizon** | The world's own crayon planet rising out of the footer colour | already drawn in code | 160 to 300px |

Constants that never change between worlds: near-black `#18120F`, white `#FFFFFF`, the red CTA `#FB4A40`, the input grey `#282521`, the black lineup boxes, the fonts (Archivo for body and display, Anton for the lineup and lockups). Everything else is themed per world.

---

# 2. SVG rules and the slot system

## 2.1 File rules (same as the GSL pack)

- Pure SVG, transparent background, `viewBox` set, width and height attributes in px matching the viewBox.
- No embedded PNG or base64, no `<image>`, no external fonts, no text (convert any lettering to paths).
- Flat fills and strokes only. Round caps and joins (`stroke-linecap="round" stroke-linejoin="round"`). No gradients, no filters, no blur.
- Colours only from that world's palette (§3 to §11). White is always `#F6F6F6`, black always `#18120F`.
- Keep each file under 12 KB. Simplify paths; the doodle look is the point.
- Hand-drawn energy: wobbly lines, uneven stroke widths (3 to 12 px at the file's native size), slightly off symmetry. Nothing pixel-perfect, nothing "icon set".
- Optional but helpful: a `preview_png/` folder and a `contact_sheet.png` like the GSL pack.

## 2.2 Sizes

Files are drawn at a native size and scaled by CSS, so proportions matter more than pixels. Use these native canvases:

| Class | Native canvas | Placed at (desktop) |
|---|---|---|
| Corner waves | 220 × 160 | 12 to 18 vw, max 280px |
| Pattern patches | 120 × 60 (rounded blob) | 10 to 13 vw, and 62% of a card behind the ticket cards |
| Scribbles and coils | 90 × 90 | 8 to 12 vw |
| Big centrepiece | 200 × 200 | 18 vw, max 280px |
| Objects and stickers | 70 × 70 to 100 × 100 | 4 to 9 vw |
| Characters | 85 × 85 | 6 vw |
| Micro marks (sparkles, plus, bubbles, dots) | 48 × 40 | 3 vw |
| Ticker marks | 24 × 24 | 18px |
| Footer icon | 70 × 70 | 44px |

## 2.3 The fixed slot map

The page code places assets by slot, not by motif. Fifty-one slots, the same on every world, numbered like the GSL pack. Whatever you draw for slot 17 lands where the big yellow sun sits on Sonara. Keep the numbers; change the drawings.

**Hero band (black, top). Slots 01 to 13.**

| Slot | Position | Category | What Sonara has |
|---|---|---|---|
| 01 | top-left corner | corner waves | orange concentric wave |
| 02 | top, left of centre | micro | three white bubbles |
| 03 | top-right | corner waves | orange wave |
| 04 | left of the button | micro | white starburst |
| 05 | left edge, lower | scribble | green zigzag |
| 06 | right edge, lower | scribble | green zigzag |
| 09 | right of the button | micro | white sparkle |
| 11 | right, lower | sticker | blue eye |
| 13 | under the button | coil | green coil |
| 45 | left, lower | pattern patch | blue heart pattern |
| 46 | centre, under the button | pattern patch | yellow mound |
| 47 | right, upper | pattern patch | teal zebra |

**Poster (main colour). Slots 07 to 44, 48 to 50.**

| Slot | Position | Category | What Sonara has |
|---|---|---|---|
| 07 | top-left | scribble | purple spiral |
| 08 | right, upper-middle | burst | black flower with a green centre |
| 10 | top, right of centre | micro | white plus pair |
| 12 | lower-left | object | snail collage |
| 14 | top centre | sticker | black halftone hand |
| 15 | upper-left | micro | two yellow hearts |
| 16 | right middle | micro | three yellow hearts |
| 17 | right, large | **centrepiece** | large yellow sun |
| 18 | upper-left | micro | orange asterisk |
| 19 | left middle | sticker | black scribble bug |
| 20 | right, lower | object | kite |
| 21 | right of centre, lower | micro | white sparkle |
| 22 | left middle | doodle bundle | yellow flower doodles |
| 23 | bottom-left edge | landmark | red-black tower |
| 24 | bottom-left | landmark | Mumbai skyline |
| 25 | bottom, left of centre | character | statue with rings |
| 26 | top, left of centre | character | tiny robot |
| 27 | bottom, right of centre | vehicle | small rickshaw |
| 29 | bottom centre | burst | black flower |
| 30 | bottom centre | arcs | rainbow arcs |
| 31 | bottom, right of centre | burst | yellow starburst |
| 32 | right, lower | micro | purple stars |
| 33 | right middle | character | blue-yellow creature |
| 36 | bottom, right of centre | character | white dancing figures |
| 37 | upper-left | object | blue planet |
| 38 | right, lower | coil | white spring |
| 39 | bottom right | coil | green coil |
| 40 | bottom-right edge | object | traffic light |
| 41 | left, lower | sticker | pink bird with an eye |
| 42 | right edge, middle | corner waves | orange waves |
| 43 | left edge, middle | corner waves | orange waves |
| 44 | bottom-left | corner waves | orange waves |
| 50 | top centre | micro | white micro star |

**Ticket cards. Slots 45 to 48 reused as the patches behind the four cards** (card 1 uses 47, card 2 uses 48, card 3 uses 45, card 4 uses 46).

**Ticker marks: slots 04 and 18** (white starburst, orange asterisk) alternate between phrases, tinted dark by CSS.

**Footer icon: slot 37** (the small planet) sits above "WORLD IS ___".

Slots 28, 34, 35, 49 are spare on Sonara (white squiggle, tall black-orange object, large rickshaw, orange bubbles). Draw them anyway; they are used on narrow layouts and as swaps.

## 2.4 File names

`<NN>_<short_name>.svg`, two-digit slot number, lowercase, underscores. The slot number is what the code reads; the name is for you. Example for Ferrin: `17_large_gear.svg`, `24_server_rack_skyline.svg`, `40_terminal_cursor.svg`.

## 2.5 What every pack needs, at a glance

- 5 corner waves (01, 03, 42, 43, 44) in the world's warm or cool accent
- 4 pattern patches (45, 46, 47, 48) in four different patterns
- 5 scribbles / coils (05, 06, 07, 13, 38, 39) in the world's neon
- 7 micro marks (02, 04, 09, 10, 21, 50, 32) in white plus one coloured pair (15, 16, 18)
- 1 big centrepiece (17)
- 3 bursts / arcs (08, 29, 30, 31)
- ~14 world-specific objects, stickers and landmarks (11, 12, 14, 19, 20, 22, 23, 24, 27, 37, 40, 41, 28, 34, 35, 49)
- 4 characters (25, 26, 33, 36)

Roughly 50 files per world, 9 worlds. The white micro marks (02, 04, 09, 10, 21, 50) and the four characters are the same silhouettes every time and only need recolouring, so draw them once and duplicate.

---

# 3. Ferrin · IX slot mercury · Skills & tools

**Feel:** the workshop. Iron, plain, exact. Tools laid out on a bench.

## 3.1 Palette

| Role | Hex | Used for |
|---|---|---|
| Poster | `#B9C6C2` iron grey-green | block 4, block 6 background |
| Nav / footer | `#2B3533` gunmetal | blocks 2, 9 |
| Ticker | `#FF5D00` safety orange | block 1, ink text |
| Board | `#9CE3C8` mint | block 5 |
| Info blocks | `#FF5D00` orange, `#DBAFE0` lavender, `#00C8E8` cyan, `#D4DA00` lime | block 7, in that order |
| Doodle accents | `#FF5D00`, `#FFF133`, `#00F800`, `#00C8E8`, `#5030B1`, `#F6F6F6`, `#18120F` | the SVGs |

## 3.2 Content

- **Ticker:** I · Ferrin / What the hands know / Skills & tools / Mumbai, India
- **Nav lockup:** ferrin · world I. Links: Tools, Workshops, Notes.
- **Headline:** The toolkit *is* **OPEN !** Eyebrow: I · Skills & tools. Button: See the tools.
- **Lineup tiers:** 1 Python · LangChain. 2 RAG · Pandas · SQL. 3 LangGraph · Agno · Streamlit · Power BI. 4 n8n · Supabase · MediaPipe · dlib · WebRTC · scikit-learn. 5 CVZone · PyDub · BeautifulSoup · Tavily · Groq · Stockfish · Excel · HTML/CSS/JS. Foot line: Every day, all year · wherever the laptop is.
- **Board left:** SEE YOU @ THE BENCH. Counters: 03 languages · 05 frameworks · 12 tools. Now playing line: "Currently sharpening · LangGraph".
- **Board right:** ASK FOR A TOOL. Inputs: Name, Problem, Stack, Why this one? Submit opens mail.
- **Sticker heading:** KICK OFF WITH 4 WORKSHOPS.
- **Cards:** LANGUAGES (Python, SQL, web) · AI & AGENTS (LangChain, LangGraph, Agno, RAG) · DATA (Pandas, Power BI, Excel) · VISION (MediaPipe, CVZone, dlib, WebRTC). Meta lines: "since 2023" and where it is used. Tabs: Tools | Used in (the projects that used it).
- **Information blocks:** SKILLS FAQ (what is the main language, what is used for agents, do you do dashboards, what is next) · HOME DELIVERY (how fast can a prototype be built: one to four weeks) · BOX OFFICE (where to see the tools in use: the four live projects) · BENCH ESSENTIALS (ways of working: one responsibility per agent, landmarks over pixels, fewer clicks).
- **Chip strip:** ON THE BENCH: the nine skills exactly as the Framer site lists them, with their one-line definitions in the answers.
- **Partner strip:** RUNS ON: Python, Streamlit. POWERED BY: Supabase, Groq, n8n, Power BI. ASSOCIATE: VS Code, GitHub. Promo tab: Promoted by Dhruv Bendre.
- **Footer:** FERRIN IS SHARP. Next orbit · Emberline. Logo: FER / RIN · world I.

## 3.3 SVGs to draw (slot → motif)

- **01, 03, 42, 43, 44 corner waves:** stacks of orange `#FF5D00` metal shavings: curled parallel strokes like a plane's shavings, 5 to 7 lines each.
- **45 patch:** black blob with a cyan grid of tiny "+" signs. **46:** yellow half-disc with orange hex-nut outlines. **47:** teal blob with black zebra stripes. **48:** blue blob with white circuit traces.
- **05, 06 scribbles:** neon green zigzag "sawtooth" lines. **07:** purple spiral drawn like a coiled spring. **13, 39:** green coils. **38:** white spring.
- **02, 04, 09, 10, 21, 50 micro:** white bubbles, starburst, sparkle, plus pair, sparkle, micro star (same as GSL, white). **15, 16:** yellow hexagon nuts instead of hearts. **18:** orange asterisk. **32:** three purple stars.
- **17 centrepiece:** a large yellow gear with a spiral in the middle, teeth drawn as wobbly wedges, 200 × 200.
- **08, 29, 31 bursts:** black flower burst with a green centre; black flower; yellow starburst.
- **30 arcs:** rainbow arcs in yellow, orange, lavender, green, like the GSL one.
- **11 sticker:** a blue eye inside a wrench outline. **14:** black halftone hand holding a tiny screwdriver. **19:** black scribble bug shaped like a Python snake curled in a circle. **41:** pink bird sitting on a `{ }` bracket.
- **12 object:** a laptop collage with sticker doodles on its lid. **20:** a kite made of a keyboard key ("F"). **23:** a red-black tower built of stacked database cylinders. **24:** a skyline of server racks and Mumbai rooftops. **27:** a small rickshaw carrying a monitor. **37:** a small planet with a gear ring. **40:** a traffic light whose lamps are `>_` `{ }` `#`. **28:** white squiggle. **34:** a tall black-orange spanner. **35:** the large rickshaw. **49:** three orange bubbles.
- **22 doodle bundle:** yellow doodles of a hammer, a magnifying glass and a smiling anvil.
- **25, 26, 33, 36 characters:** statue with rings (a figure holding a wrench), tiny robot, blue-yellow creature wearing goggles, two white dancing figures.

---

# 4. Emberline · slot venus · Experience & path

**Feel:** a trail of embers, still warm. Offices, dashboards, the road so far.

## 4.1 Palette

| Role | Hex |
|---|---|
| Poster | `#FF7A2F` burnt orange |
| Nav / footer | `#5A1A0F` deep maroon |
| Ticker | `#FFF133` yellow |
| Board | `#FFC69E` peach |
| Info blocks | `#FF69B8` pink, `#FFF133` yellow, `#00C8E8` cyan, `#DBAFE0` lavender |
| Doodle accents | `#FFF133`, `#FB3132`, `#00F800`, `#5030B1`, `#00C8E8`, `#F6F6F6`, `#18120F` |

## 4.2 Content

- **Ticker:** II · Emberline / Where the fire has been / Experience & path / Mumbai, India
- **Nav lockup:** emberline · world II. Links: Trail, Roles, Notes.
- **Headline:** The trail *is* **WARM !** Eyebrow: II · Experience & path. Button: Follow the trail.
- **Lineup tiers:** 1 My Equity School · NullClass. 2 Data Science Intern · Data Analyst Intern. 3 SocioHub · Digital Marketing Intern · Power BI. 4 CRM analytics · Twitter data · Lead-flow prediction · Campaign data. 5 Dashboards · Data cleaning · Visualisation · Captions · Excel · Reporting. Foot line: 2025 → now · Mumbai.
- **Board left:** SEE YOU @ THE NEXT ROLE. Counters: 03 roles · 02 data internships · 08 months on the trail. Now playing: "Currently · open to AI engineering and data science work".
- **Board right:** LIGHT A NEW EMBER. Inputs: Name, Company, Role, What is the work? Submit opens mail.
- **Sticker heading:** KICK OFF WITH 3 EMBERS (+ 1 NEXT).
- **Cards:** MY EQUITY SCHOOL (Data Science Intern · Jun to Aug 2025) · NULLCLASS (Data Analyst Intern · Apr to May 2025) · SOCIOHUB (Digital Marketing Intern) · NEXT EMBER (the role that comes next; card text: "Booking open"). Meta lines: dates and city. Tabs: What I did | What it taught.
- **Information blocks:** TRAIL FAQ (where has Dhruv worked, what did each role produce, what tools ran the dashboards, what came next) · HOME DELIVERY (resume: the Google Drive link) · BOX OFFICE (how to hire: send a signal, response within a week) · EMBER ESSENTIALS (what was carried onward: dashboards that explain themselves, an eye for presentation).
- **Chip strip:** CARRIED ONWARD: Power BI, CRM data, lead flow, engagement trends, data cleaning, campaign Excel.
- **Partner strip:** WORKED WITH: My Equity School, NullClass. POWERED BY: SocioHub, Power BI, Excel, Twitter data. Promo tab: Promoted by Dhruv Bendre.
- **Footer:** EMBERLINE IS WARM. Next orbit · Verdance. Logo: EMBER / LINE · world II.

## 4.3 SVGs to draw

- **Corner waves (01, 03, 42, 43, 44):** yellow-to-red ember trails: parallel strokes that start thick and end in dots, like sparks flying.
- **Patches:** 45 black blob with pink tiny flames; 46 yellow half-disc with red dashes; 47 purple blob with white sparks; 48 cyan blob with black wave lines.
- **Scribbles / coils:** neon green zigzags (05, 06); purple spiral (07) drawn as a smoke curl; green coils (13, 39); white spring (38).
- **Micro:** white set (02, 04, 09, 10, 21, 50); 15, 16 yellow flames instead of hearts; 18 red asterisk; 32 purple stars.
- **17 centrepiece:** a large yellow campfire: three logs and a spiral of flame, 200 × 200.
- **Bursts / arcs:** 08 black flower with a red centre; 29 black flower; 31 yellow starburst; 30 rainbow arcs.
- **Stickers:** 11 blue eye on a name badge; 14 black halftone hand holding a match; 19 scribble bug shaped like a little flame with legs; 41 pink bird carrying an envelope.
- **Objects / landmarks:** 12 a desk collage: monitor with a bar chart, mug, sticky notes; 20 kite made of a Power BI-style dashboard tile; 23 a red-black office tower with a "NC" sign; 24 Mumbai skyline (Bandra-Worli sea link outline is a nice touch); 27 small rickshaw with a briefcase; 37 planet with an orbit of tiny sparks; 40 traffic light with lamps reading 2025 / 2025 / NEXT; 28 white squiggle; 34 a tall black-orange thermometer; 35 large rickshaw; 49 orange bubbles.
- **22 doodle bundle:** yellow doodles of a calendar, a line chart going up and a coffee cup.
- **Characters:** 25 statue holding a torch; 26 tiny robot with a clipboard; 33 creature warming its hands; 36 white dancing figures.

---

# 5. Verdance · slot earth · Projects

**Feel:** fields, growth, things that shipped. The most alive page after Sonara.

## 5.1 Palette

| Role | Hex |
|---|---|
| Poster | `#58C26A` leaf green |
| Nav / footer | `#12305A` deep blue |
| Ticker | `#00C8E8` sky cyan |
| Board | `#FFF133` yellow |
| Info blocks | `#FF69B8` pink, `#CDB1FF` lavender, `#00C8E8` cyan, `#0084FF` blue (white text on this one) |
| Doodle accents | `#0084FF`, `#FFF133`, `#FF5FBC`, `#00F800`, `#FF5D00`, `#F6F6F6`, `#18120F` |

## 5.2 Content

- **Ticker:** III · Verdance / Things grown and shipped / Projects / 3 live now
- **Nav lockup:** verdance · world III. Links: Fields, Projects, Notes.
- **Headline:** The fields *are* **LIVE !** Eyebrow: III · Projects. Button: Open a project.
- **Lineup tiers:** 1 SnapClass · Multi-Agent Research System. 2 Hackathon Management Platform · MyChessBot. 3 Facial recognition · Voice authentication · RAG assistant · Critic Agent. 4 Search Agent · Reader Agent · Writer Agent · Stockfish · Receipts in-app · Supabase. 5 Streamlit · SVM · dlib · PyDub · LangChain · Groq Llama 3.3 70B · Tavily · BeautifulSoup · Agno · PGN. Foot line: 2024 → 2026 · three of them live.
- **Board left:** SEE YOU @ THE DEMO. Counters: 04 projects · 03 live · 01 in progress. Now playing: "Currently · MyChessBot redesign".
- **Board right:** PLANT AN IDEA. Inputs: Name, Idea, Who is it for, Why now? Submit opens mail.
- **Sticker heading:** KICK OFF WITH 4 FIELDS.
- **Cards:** SNAPCLASS (2026 · 3 to 4 weeks · Listen → snapclassprojectpro.streamlit.app) · RESEARCH SYSTEM (2026 · 3 to 4 weeks · live link) · HACKATHON PLATFORM (2026 · 1 week · Get Set Learn · live link) · MYCHESSBOT (2024 → ongoing · GitHub). Meta lines: year and duration; client or stack. Tabs: Stack | What it does. The card button says Open instead of Listen.
- **Information blocks:** PROJECT FAQ (what is live right now, what was the fastest build, what is the biggest, what is next) · HOME DELIVERY (every live project opens in the browser, no install) · BOX OFFICE (source code: GitHub profile and the chessBot repo) · FIELD ESSENTIALS (every project: a problem, what was built, the stack, what it taught).
- **Chip strip:** IN ORBIT NOW: SnapClass, Research System, Hackathon Platform, GitHub.
- **Partner strip:** SHIPPED ON: Streamlit, GitHub. POWERED BY: Supabase, LangChain, Groq, Stockfish. ASSOCIATE: Get Set Learn. Promo tab: Promoted by Dhruv Bendre.
- **Footer:** VERDANCE IS GROWING. Next orbit · Theoria. Logo: VERD / ANCE · world III.

## 5.3 SVGs to draw

- **Corner waves:** blue `#0084FF` furrows: parallel wavy field lines with tiny green sprouts on top.
- **Patches:** 45 black blob with pink tiny leaves; 46 yellow half-disc with green seed dots; 47 teal blob with black zebra; 48 blue blob with white raindrops.
- **Scribbles / coils:** neon green vines (05, 06) with two leaves each; 07 a purple spiral snail shell; 13, 39 green coils as tendrils; 38 white spring.
- **Micro:** white set; 15, 16 yellow four-leaf sprouts instead of hearts; 18 orange asterisk; 32 purple stars.
- **17 centrepiece:** a large yellow sunflower, petals as thick wobbly strokes, black seed-spiral centre.
- **Bursts / arcs:** 08 black dandelion burst with a green centre; 29 black flower; 31 yellow starburst; 30 rainbow arcs.
- **Stickers:** 11 blue eye inside a camera viewfinder (SnapClass); 14 black halftone hand giving a thumbs up; 19 scribble bug: a beetle shaped like a chess knight; 41 pink bird holding a microphone (voice auth).
- **Objects / landmarks:** 12 a chessboard collage with a knight and a queen; 20 a kite shaped like a paper receipt; 23 a red-black satellite tower; 24 a skyline of greenhouses and a school building; 27 small rickshaw carrying a potted plant; 37 the blue planet with a green continent (this world's own body); 40 traffic light with lamps reading LIVE / LIVE / LIVE; 28 white squiggle; 34 tall black-orange watering can; 35 large rickshaw; 49 orange bubbles.
- **22 doodle bundle:** yellow doodles of a magnifying-glass agent, a report page and a speech bubble (the research system).
- **Characters:** 25 statue with rings holding a seedling; 26 tiny robot (the Critic Agent, holding a scorecard); 33 blue-yellow creature reading a book; 36 white dancing figures.

---

# 6. Theoria · slot mars · Research & publications

**Feel:** looking closely. Red strata, a lens, a hand signing.

## 6.1 Palette

| Role | Hex |
|---|---|
| Poster | `#FB3132` red |
| Nav / footer | `#4A1A14` oxblood |
| Ticker | `#DBAFE0` lavender |
| Board | `#00C8E8` cyan |
| Info blocks | `#FFF133` yellow, `#DBAFE0` lavender, `#00C8E8` cyan, `#FF69B8` pink |
| Doodle accents | `#FFF133`, `#F6F6F6`, `#00C8E8`, `#00F800`, `#5030B1`, `#FF5D00`, `#18120F` |

Note: white lineup boxes on red read fine because the boxes are black. Keep the blue offset shadow.

## 6.2 Content

- **Ticker:** IV · Theoria / The act of looking closely / Research & publications / DOI 10.5281/zenodo.20352667
- **Nav lockup:** theoria · world IV. Links: Paper, Method, Notes.
- **Headline:** The paper *is* **OUT !** Eyebrow: IV · Research & publications. Button: Read the paper (→ the DOI link).
- **Lineup tiers:** 1 Sign language support on video calls. 2 98.2% accuracy · Published on Zenodo. 3 WebRTC · MediaPipe · CVZone · Random Forest. 4 Hand landmarks · Gesture → text → speech · Speech → text · Two-way calls. 5 Real time · Low latency · Consumer hardware · Aavishkar Zonal Round winner 2025. Foot line: Zenodo · 2026 · Mumbai.
- **Board left:** SEE YOU @ THE STAGE (the conference one). Counters: 01 paper · 01 award · 98 % accuracy. Now playing: "Currently · reading on landmark-based recognition".
- **Board right:** ASK A QUESTION. Inputs: Name, Institution, Question, Context. Submit opens mail.
- **Sticker heading:** KICK OFF WITH 4 STRATA.
- **Cards:** THE PAPER (Zenodo · 2026 · Read → DOI) · THE AWARD (Aavishkar Zonal Round · 2025 · Featured) · THE METHOD (WebRTC + MediaPipe + CVZone + Random Forest) · THE RESULT (98.2%, lightweight, robust, low latency). Tabs: Summary | Why it matters.
- **Information blocks:** RESEARCH FAQ (what was published, where, what accuracy, who it helps) · HOME DELIVERY (the DOI link opens the full paper) · BOX OFFICE (citations: how to cite, the Zenodo record) · LENS ESSENTIALS (open questions: how far landmarks go, fact-checking agents, a style model that stays recognisable).
- **Chip strip:** OPEN QUESTIONS: the three from Theoria's current page.
- **Partner strip:** PUBLISHED ON: Zenodo. POWERED BY: WebRTC, MediaPipe, CVZone, scikit-learn. ASSOCIATE: Aavishkar. Promo tab.
- **Footer:** THEORIA IS PUBLISHED. Next orbit · Magnara. Logo: THEO / RIA · world IV.

## 6.3 SVGs to draw

- **Corner waves:** yellow `#FFF133` strata: stacked wavy rock layers, 5 to 7 bands, like the ambient texture on the current page.
- **Patches:** 45 black blob with white tiny hands; 46 yellow half-disc with red dots; 47 lavender blob with black zebra; 48 cyan blob with white sound waves.
- **Scribbles / coils:** neon green sound-wave zigzags (05, 06); 07 purple spiral as a fingerprint; 13, 39 green coils as waveforms; 38 white spring.
- **Micro:** white set; 15, 16 yellow quotation marks instead of hearts; 18 orange asterisk; 32 purple stars.
- **17 centrepiece:** a large yellow magnifying lens with a spiral in the glass and a chunky handle.
- **Bursts / arcs:** 08 black burst with a cyan centre; 29 black flower; 31 yellow starburst; 30 rainbow arcs drawn as audio waveforms.
- **Stickers:** 11 blue eye inside a webcam circle; 14 black halftone hand making the ASL sign for "I love you" (the hero sticker of this world; make it big and clean); 19 scribble bug shaped like a microphone; 41 pink bird with a speech bubble.
- **Objects / landmarks:** 12 a video-call window collage: two frames, one with a signing hand, one with a caption bar; 20 a kite made of a paper page with "DOI"; 23 a red-black lighthouse; 24 a skyline of a university dome and the Mumbai sea front; 27 small rickshaw with a satellite dish; 37 planet with a lens ring; 40 traffic light with lamps reading 98 / . / 2; 28 white squiggle; 34 tall black-orange trophy; 35 large rickshaw; 49 orange bubbles.
- **22 doodle bundle:** yellow doodles of a hand with landmark dots, a decision tree, and a medal.
- **Characters:** 25 statue holding a medal; 26 tiny robot with headphones; 33 creature with a huge eye; 36 white dancing figures, one signing.

---

# 7. Magnara · slot jupiter · Case studies

**Feel:** the great banded world. Long stories read top to bottom like weather.

## 7.1 Palette

| Role | Hex |
|---|---|
| Poster | `#FF9A2E` amber orange |
| Nav / footer | `#4D2A10` brown |
| Ticker | `#00B398` teal |
| Board | `#FFE7B3` cream |
| Info blocks | `#FF5FBC` pink, `#00C8E8` cyan, `#FFF133` yellow, `#CDB1FF` lavender |
| Doodle accents | `#5030B1`, `#FFF133`, `#00B398`, `#FB3132`, `#00C8E8`, `#F6F6F6`, `#18120F` |

## 7.2 Content

- **Ticker:** V · Magnara / Where the long stories live / Case studies / Three bands
- **Nav lockup:** magnara · world V. Links: Bands, Stories, Notes.
- **Headline:** The long stories *are* **TOLD !** Eyebrow: V · Case studies. Button: Read a band.
- **Lineup tiers:** 1 SnapClass · Hackathon Platform. 2 Multi-Agent Research System. 3 Problem · Constraint · Work · Design · Learned. 4 Teachers · Students · Organisers · Get Set Learn · One week · Four weeks. 5 Password hashing · K-12 visual style · Search / Reader / Writer / Critic · Modular · Scalable. Foot line: Read top to bottom, like weather.
- **Board left:** SEE YOU @ THE LONG READ. Counters: 03 bands · 09 weeks of building · 04 agents. Now playing: "Currently · Band IV in the making".
- **Board right:** PITCH A STORY. Inputs: Name, Problem, Constraint, Why it is worth a band. Submit opens mail.
- **Sticker heading:** KICK OFF WITH 3 BANDS (+ 1 FORMING).
- **Cards:** BAND I · SNAPCLASS · BAND II · HACKATHON PLATFORM · BAND III · RESEARCH SYSTEM · BAND IV · FORMING (blank, "booking open"). Tabs: The problem | What shipped.
- **Information blocks:** STORY FAQ (how a case study is structured, how long each took, what changed after shipping, what was learned) · HOME DELIVERY (each band opens its live product) · BOX OFFICE (how to commission one) · BAND ESSENTIALS (one band per long story; problem, constraints, work, shipped, learned).
- **Chip strip:** LEARNED: split responsibilities, fewer clicks, design for the real user, measure before trusting.
- **Partner strip:** TOLD WITH: Streamlit, Supabase. POWERED BY: LangChain, Groq, Agno, dlib. ASSOCIATE: Get Set Learn. Promo tab.
- **Footer:** MAGNARA IS LONG. Next orbit · Cadence. Logo: MAG / NARA · world V.

## 7.3 SVGs to draw

- **Corner waves:** purple `#5030B1` weather bands: thick wavy horizontal strokes with a tiny cloud on the end.
- **Patches:** 45 black blob with yellow tiny lightning bolts; 46 yellow half-disc with brown bands; 47 teal blob with black zebra; 48 cyan blob with white raindrops.
- **Scribbles / coils:** neon-teal zigzags (05, 06); 07 purple spiral as a storm; 13, 39 green coils; 38 white spring.
- **Micro:** white set; 15, 16 yellow lightning bolts instead of hearts; 18 red asterisk; 32 purple stars.
- **17 centrepiece:** a large yellow sun half-hidden by a striped cloud, 200 × 200.
- **Bursts / arcs:** 08 black burst with a teal centre; 29 black flower; 31 yellow starburst; 30 rainbow arcs (this world owns the rainbow: make it the biggest one of all the packs).
- **Stickers:** 11 blue eye in a storm cloud; 14 black halftone hand holding an umbrella; 19 scribble bug shaped like a thundercloud with legs; 41 pink bird flying with a scroll.
- **Objects / landmarks:** 12 an open book collage with a band of stripes on the page; 20 kite in the shape of a weather flag; 23 a red-black weather tower with an anemometer; 24 skyline with a big banded gas-giant rising behind Mumbai; 27 small rickshaw in the rain; 37 planet with three bands; 40 traffic light with lamps I / II / III; 28 white squiggle; 34 tall black-orange barometer; 35 large rickshaw; 49 orange bubbles.
- **22 doodle bundle:** yellow doodles of a timeline, a bookmark and an hourglass.
- **Characters:** 25 statue holding a scroll; 26 tiny robot with an umbrella; 33 creature reading a long strip of paper; 36 white dancing figures.

---

# 8. Cadence · slot saturn · Process & principles

**Feel:** rings within rings. Sketch, prototype, ship, learn, around again.

## 8.1 Palette

| Role | Hex |
|---|---|
| Poster | `#FF8C6B` coral |
| Nav / footer | `#4B2418` dark coral |
| Ticker | `#00F800` neon green |
| Board | `#DBAFE0` lavender |
| Info blocks | `#FFF133` yellow, `#00C8E8` cyan, `#FF69B8` pink, `#00B398` teal |
| Doodle accents | `#00F800`, `#FFF133`, `#5030B1`, `#00C8E8`, `#F6F6F6`, `#18120F`, `#9C4C3A` (the ring brown) |

## 8.2 Content

- **Ticker:** VI · Cadence / Loops that repeat and improve / Process & principles / Around again
- **Nav lockup:** cadence · world VI. Links: Loops, Principles, Notes.
- **Headline:** The loop *is* **ON !** Eyebrow: VI · Process & principles. Button: Start the loop.
- **Lineup tiers:** 1 Sketch · Prototype · Ship · Learn. 2 Question it · Keep going · Every detail. 3 Ship in one to four weeks · Redesign after it proves itself. 4 One responsibility per part · Measure before trusting · Unexpected solutions. 5 98.2% · Critic agent · Dashboards · Minimal clicks · Say hello to a cat. Foot line: In Dhruv's words: chase a perfection you may never quite catch.
- **Board left:** SEE YOU @ THE NEXT LOOP. Counters: 04 steps · 04 principles · 01 cat. Now playing: "Currently · MyChessBot, loop three".
- **Board right:** JOIN A LOOP. Inputs: Name, Idea, Stage it is at, What is stuck. Submit opens mail.
- **Sticker heading:** KICK OFF WITH 4 LOOPS.
- **Cards:** SKETCH · PROTOTYPE · SHIP · LEARN. Meta lines: how long, what it produces. Tabs: What happens | Example (a real project at that stage: SnapClass interface, hackathon week, research pipeline, MyChessBot redesign).
- **Information blocks:** PROCESS FAQ (how long does a first version take, when is the interface redesigned, how are agents split, how is quality measured) · HOME DELIVERY (a working version in one to four weeks) · BOX OFFICE (what a project needs to start: the problem, the user, the constraint) · LOOP ESSENTIALS (the four principles from the current page).
- **Chip strip:** PRINCIPLES: unconventional approach, unexpected solutions, AI changes how people work, hello to a cat.
- **Partner strip:** RUNS ON: curiosity, Streamlit. POWERED BY: sketches, prototypes, critics, dashboards. Promo tab.
- **Footer:** CADENCE IS ON REPEAT. Next orbit · Whimsel. Logo: CAD / ENCE · world VI.

## 8.3 SVGs to draw

- **Corner waves:** neon green `#00F800` ring arcs: nested quarter-circles like Saturn's rings seen edge-on.
- **Patches:** 45 black blob with white tiny loops; 46 yellow half-disc with brown ring stripes; 47 teal blob with black zebra; 48 cyan blob with white metronome ticks.
- **Scribbles / coils:** green zigzags (05, 06) drawn as heartbeat lines; 07 purple spiral (the loop itself, an arrow at the end); 13, 39 green coils; 38 white spring.
- **Micro:** white set; 15, 16 yellow circular arrows instead of hearts; 18 orange asterisk; 32 purple stars.
- **17 centrepiece:** a large yellow ringed planet, ring drawn as three wobbly ellipses, 200 × 200.
- **Bursts / arcs:** 08 black burst with a green centre; 29 black flower; 31 yellow starburst; 30 rainbow arcs as concentric rings.
- **Stickers:** 11 blue eye in a clock face; 14 black halftone hand drawing with a pencil; 19 scribble bug: a metronome with legs; 41 pink bird on a swing (a loop).
- **Objects / landmarks:** 12 a sketchbook collage with a rough wireframe; 20 kite shaped like a sticky note; 23 red-black clock tower; 24 skyline of Mumbai with a Ferris wheel; 27 small rickshaw going around a roundabout; 37 planet with a ring; 40 traffic light with lamps SKETCH / SHIP / LEARN as dots; 28 white squiggle; 34 tall black-orange pencil; 35 large rickshaw; 49 orange bubbles.
- **22 doodle bundle:** yellow doodles of a checklist, a circular arrow and a cat's face.
- **Characters:** 25 statue with rings (this world's own: the rings are the hula hoops); 26 tiny robot holding a stopwatch; 33 creature chasing its tail; 36 white dancing figures.

---

# 9. Whimsel · slot uranus · Playground & experiments

**Feel:** tilted on its side. Toys, half-ideas, a chess bot, a cat.

## 9.1 Palette

| Role | Hex |
|---|---|
| Poster | `#42D9B8` teal |
| Nav / footer | `#0F3D33` deep teal |
| Ticker | `#FF5FBC` pink |
| Board | `#FFF133` yellow |
| Info blocks | `#FF69B8` pink, `#CDB1FF` lavender, `#00C8E8` cyan, `#FF5D00` orange |
| Doodle accents | `#2BA9DF`, `#FF5FBC`, `#FFF133`, `#5030B1`, `#00F800`, `#F6F6F6`, `#18120F` |

## 9.2 Content

- **Ticker:** VII · Whimsel / The one that spins sideways / Playground & experiments / May never ship
- **Nav lockup:** whimsel · world VII. Links: Toys, Experiments, Notes.
- **Headline:** The playground *is* **OPEN !** Eyebrow: VII · Playground & experiments. Button: Pick a toy.
- **Lineup tiers:** 1 MyChessBot. 2 n8n workflows · This solar system. 3 Stockfish · PGN games · Style model · Streamlit board. 4 Crayon planets · Chalk outlines · Mnemora · Sonara. 5 Prototypes · Sketches · Toys · Half-ideas · Things that taught something. Foot line: Pinned at odd angles.
- **Board left:** SEE YOU @ THE SANDBOX. Counters: 03 experiments · 01 ongoing · 09 worlds drawn. Now playing: "Currently · MyChessBot interface redesign".
- **Board right:** SUGGEST A TOY. Inputs: Name, Toy, Why it would be fun, A link. Submit opens mail.
- **Sticker heading:** KICK OFF WITH 4 TOYS.
- **Cards:** MYCHESSBOT (2024 → ongoing · GitHub) · N8N WORKFLOWS (low-code automations) · THIS DRAWING (a portfolio as a solar system) · NEXT TOY (booking open). Tabs: What it is | What it taught.
- **Information blocks:** PLAYGROUND FAQ (what is the chess bot, when will the demo open, what is n8n for, why is the site a solar system) · HOME DELIVERY (the demo opens when the redesign is done) · BOX OFFICE (source: chessBot on GitHub) · TOY ESSENTIALS (keep what taught something, pin it at an angle).
- **Chip strip:** IN THE BOX: Stockfish, PGN, Streamlit, n8n, GSAP, crayon, chalk.
- **Partner strip:** PLAYS ON: Streamlit, GitHub. POWERED BY: Stockfish, n8n, GSAP, React. Promo tab.
- **Footer:** WHIMSEL IS SIDEWAYS. Next orbit · Mnemora. Logo: WHIM / SEL · world VII.

## 9.3 SVGs to draw

- **Corner waves:** cyan `#2BA9DF` tilted ring arcs, all leaning 30 degrees.
- **Patches:** 45 black blob with pink tiny chess pawns; 46 yellow half-disc with a checkerboard; 47 teal blob with black zebra; 48 blue blob with white question marks.
- **Scribbles / coils:** green zigzags (05, 06); 07 purple spiral drawn as a yo-yo string; 13, 39 green coils as springs from a jack-in-the-box; 38 white spring.
- **Micro:** white set; 15, 16 yellow paw prints instead of hearts; 18 pink asterisk; 32 purple stars.
- **17 centrepiece:** a large yellow tilted planet with a cyan ring, drawn like a spinning top, 200 × 200.
- **Bursts / arcs:** 08 black burst with a pink centre; 29 black flower; 31 yellow starburst; 30 rainbow arcs.
- **Stickers:** 11 blue eye on a die; 14 black halftone hand moving a chess knight; 19 scribble bug: a wind-up toy with a key; 41 pink bird wearing a party hat.
- **Objects / landmarks:** 12 a chess collage: a board tilted, a knight, a clock; 20 kite made of a playing card; 23 red-black rocket on a stand; 24 skyline of a fairground with a Mumbai sea-face; 27 small rickshaw with balloons; 37 planet tilted with a ring (this world's own body); 40 traffic light with lamps as dice faces; 28 white squiggle; 34 tall black-orange jack-in-the-box; 35 large rickshaw; 49 orange bubbles.
- **22 doodle bundle:** yellow doodles of a cat, a joystick and a paper plane.
- **Characters:** 25 statue juggling rings; 26 tiny robot playing chess; 33 creature upside down; 36 white dancing figures.

---

# 10. Mnemora · slot neptune · The archive (threshold)

**Feel:** memory, deep blue, listening. This page stays a threshold: the board's form is the ask box that carries the visitor into the Streamlit archive. The archive itself keeps its own chalk styling; only the threshold page becomes a poster.

## 10.1 Palette

| Role | Hex |
|---|---|
| Poster | `#4FB3E8` sky blue |
| Nav / footer | `#0A1A2E` navy |
| Ticker | `#F6F6F6` white with navy text |
| Board | `#CDB1FF` lavender |
| Info blocks | `#00C8E8` cyan, `#FFF133` yellow, `#FF69B8` pink, `#DBAFE0` lavender |
| Doodle accents | `#1889C0`, `#FFF133`, `#FF5FBC`, `#00F800`, `#5030B1`, `#F6F6F6`, `#18120F` |

## 10.2 Content

- **Ticker:** VIII · Mnemora / The archive that answers / Ask it about Dhruv / It answers only from what it holds
- **Nav lockup:** mnemora · world VIII. Links: Ask, Categories, Notes. Button: Enter the archive.
- **Headline:** The archive *is* **OPEN !** Eyebrow: VIII · The archive. Button: Ask a question (scrolls to the board).
- **Lineup tiers (the questions it can answer):** 1 Who is Dhruv Bendre? 2 What has Dhruv built? · Where has Dhruv worked? 3 What research has Dhruv published? · What technologies does Dhruv work with? 4 How can I contact Dhruv? · What is MyChessBot? · What won the Aavishkar round? 5 Profile · Projects · Experience · Research · Skills · Achievements · Interests. Foot line: 7 live documents · 21 passages.
- **Board left:** SEE YOU @ THE ARCHIVE. Counters: 07 documents · 21 passages · 05 categories. Now playing: "Last indexed · 2026-09-05".
- **Board right:** ASK THE ARCHIVE. One wide input (the question) and the five category chips as buttons; Submit says Ask and carries `?q=` into the archive, exactly as the current threshold does.
- **Sticker heading:** KICK OFF WITH 4 SHELVES.
- **Cards:** STORY (profile, interests) · WORK (projects, case studies) · PATH (experience, achievements) · RESEARCH (the paper). Tabs: What it holds | Try asking (three sample questions each).
- **Information blocks:** ARCHIVE FAQ (what it knows, what it refuses, how it cites, when it is updated) · HOME DELIVERY (answers arrive with a "from the archive" line naming the document) · BOX OFFICE (the archive is a separate Streamlit app; the link) · MEMORY ESSENTIALS (it never guesses; if it is not written, it does not exist).
- **Chip strip:** FROM THE ARCHIVE: Profile, Projects, Experience, Research, Skills, Achievements, Interests.
- **Partner strip:** RUNS ON: Streamlit, Python. POWERED BY: numpy vector store, embeddings, LLM provider, markdown. Promo tab.
- **Footer:** MNEMORA REMEMBERS. Next orbit · Sonara. Logo: MNEM / ORA · world VIII.

## 10.3 SVGs to draw

- **Corner waves:** deep blue `#1889C0` orbital arcs: thin nested ellipses, like the ambient arcs on the current page, with one dot on each.
- **Patches:** 45 black blob with white tiny open rings (the memory glyph); 46 yellow half-disc with blue dots; 47 lavender blob with black zebra; 48 blue blob with white speech bubbles.
- **Scribbles / coils:** green zigzags (05, 06); 07 purple spiral as a thought curl; 13, 39 green coils; 38 white spring.
- **Micro:** white set; 15, 16 yellow question marks instead of hearts; 18 pink asterisk; 32 purple stars.
- **17 centrepiece:** a large yellow open book with a spiral of text lines, 200 × 200.
- **Bursts / arcs:** 08 black burst with a blue centre; 29 black flower; 31 yellow starburst; 30 rainbow arcs as ripples on water.
- **Stickers:** 11 blue eye inside an open ring with a dot (the Mnemora glyph, big); 14 black halftone hand holding a card index; 19 scribble bug: a jellyfish; 41 pink bird with a tiny scroll.
- **Objects / landmarks:** 12 a card-index collage with tabs labelled by shape only; 20 kite made of a folded letter; 23 red-black library tower; 24 skyline of bookshelves behind Mumbai rooftops; 27 small rickshaw loaded with books; 37 the deep blue planet (this world's own body); 40 traffic light with lamps ? / … / ! ; 28 white squiggle; 34 tall black-orange filing cabinet; 35 large rickshaw; 49 orange bubbles.
- **22 doodle bundle:** yellow doodles of a speech bubble, a magnifying glass and a bookmark.
- **Characters:** 25 statue holding a lantern; 26 tiny robot with a book; 33 creature with a thought bubble; 36 white dancing figures.

---

# 11. Signal · no planet · Contact

**Feel:** a message sent out into the dark. Chalk-white poster, black ink, the loudest CTA in the system.

## 11.1 Palette

| Role | Hex |
|---|---|
| Poster | `#F6F6F6` white |
| Nav / footer | `#18120F` black |
| Ticker | `#FFF133` yellow |
| Board | `#FF69B8` pink |
| Info blocks | `#00C8E8` cyan, `#FFF133` yellow, `#CDB1FF` lavender, `#00B398` teal |
| Doodle accents | every pack colour: this world is the one that uses the full GSL palette |

Lineup boxes stay black with the blue shadow; on white they read like stickers.

## 11.2 Content

- **Ticker:** Signal / A message sent out into the dark / Contact / Vakola · Santacruz · Mumbai 400055
- **Nav lockup:** signal · send. Links: Channels, Profiles, Where. Button: Send now (scrolls to the board).
- **Headline:** The line *is* **OPEN !** Eyebrow: · Contact. Button: Send a signal.
- **Lineup tiers:** 1 bscit.dhruvbendre@gmail.com. 2 +91 83696 19146 · +91 82915 05249. 3 dhruvbendre121@gmail.com · LinkedIn · GitHub · Instagram. 4 Resume · Vakola, Santacruz · Mumbai 400055 · India. 5 AI engineering · Data science · Multi-agent apps · RAG · Computer vision · Dashboards. Each tier-1 to tier-3 item is a real link (mailto, tel, profile).
- **Board left:** SEE YOU @ THE INBOX. Counters: 02 emails · 02 phones · 03 profiles. Now playing: "Replies · usually within a week".
- **Board right:** RING A BELL. Inputs: Name, Email, Subject, Message. Submit opens mail with the fields filled (this replaces the Framer contact form).
- **Sticker heading:** KICK OFF WITH 4 CHANNELS.
- **Cards:** EMAIL (both addresses) · PHONE (both numbers) · PROFILES (GitHub, LinkedIn, Instagram, Resume) · WHERE (Vakola, Santacruz, Mumbai 400055, India). Tabs: Details | Best for.
- **Information blocks:** CONTACT FAQ (best channel, response time, what Dhruv is open to, time zone IST) · HOME DELIVERY (resume link) · BOX OFFICE (how to book a call: email with three time slots) · SIGNAL ESSENTIALS (a signal is short; say who you are, what you need, when).
- **Chip strip:** OPEN TO: intelligent systems, multi-agent applications, RAG, computer vision, dashboards.
- **Partner strip:** REACH ON: Gmail, LinkedIn. POWERED BY: GitHub, Instagram, WhatsApp, Google Drive. Promo tab.
- **Footer:** SIGNAL IS SENT. Button: Back to the system. Logo: SIG / NAL. Icons as on Sonara.

## 11.3 SVGs to draw

- **Corner waves:** radio waves in five colours (one wave each: orange, pink, cyan, green, purple), concentric arcs leaving a dot.
- **Patches:** 45 black blob with white tiny envelopes; 46 yellow half-disc with pink @ signs; 47 teal blob with black zebra; 48 blue blob with white map pins.
- **Scribbles / coils:** green zigzags (05, 06) as signal lines; 07 purple spiral as a telephone cord; 13, 39 green coils as phone cords; 38 white spring.
- **Micro:** white micro set drawn in black for this world (the poster is white): black bubbles, starburst, sparkle, plus pair, sparkle, micro star; 15, 16 pink hearts; 18 orange asterisk; 32 purple stars.
- **17 centrepiece:** a large yellow bell with a spiral clapper and motion lines, 200 × 200.
- **Bursts / arcs:** 08 black burst with a pink centre; 29 black flower; 31 yellow starburst; 30 rainbow arcs as a broadcast fan.
- **Stickers:** 11 blue eye inside a phone screen; 14 black halftone hand waving hello; 19 scribble bug: a tiny satellite with legs; 41 pink bird carrying an envelope in its beak.
- **Objects / landmarks:** 12 a postcard collage with a stamp and a wavy postmark; 20 kite made of an envelope; 23 red-black radio mast; 24 Mumbai skyline with Santacruz station and a plane overhead (the airport is next door); 27 small rickshaw as a post van; 37 a small black planet with a chalk ring (the system itself); 40 traffic light with lamps @ / # / ! ; 28 black squiggle; 34 tall black-orange antenna; 35 large rickshaw; 49 orange bubbles.
- **22 doodle bundle:** yellow doodles of a telephone, a paper plane and a map pin.
- **Characters:** 25 statue holding a megaphone; 26 tiny robot with a headset; 33 creature holding a walkie-talkie; 36 white dancing figures drawn in black.

---

# 12. What I still need from you besides the SVGs

These fill gaps the Framer site did not cover. Send them as plain text with the packs; anything missing stays as a labelled placeholder on the page.

1. **Sonara:** your real favourite artists in five tiers, four genres with five tracks each, eight albums on repeat, one "now playing" track, and streaming profile links.
2. **Ferrin:** anything to add to the nine skills, and which tool you are currently learning.
3. **Emberline:** the correct dates for the SocioHub internship, and the one line of what you are open to next.
4. **Theoria:** the paper's full title and co-authors, so the citation block is exact.
5. **Whimsel:** any n8n workflows you want named, and a target date for the MyChessBot demo.
6. **Signal:** whether the phone numbers should stay public, and your preferred reply window.
7. **Any world:** the ticker phrases, if you want different ones from the drafts above.

# 13. Delivery checklist per pack

- [ ] Folder `web/public/festival/<world>/` with 50 files, numbered 01 to 50 by slot
- [ ] Every file: transparent, viewBox, no rasters, no text, palette colours only, under 12 KB
- [ ] `preview_png/` and `contact_sheet.png` (optional)
- [ ] The content answers from §12 for that world
- [ ] Then tell me the folder is in place and I wire the page
