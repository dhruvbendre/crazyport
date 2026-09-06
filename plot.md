# PLOT.MD

## The narrative structure of Dhruv Bendre's solar system

This document is the story bible for the portfolio. `art.md` says how the universe looks; this file says what it *is*, what each world means, how a visitor moves through it, and what is deliberately left open until Dhruv's real information arrives in Round 2.

Nothing in this file is a biographical claim. Every world is a container. Its meaning is fixed; its contents are not.

---

# 1. Premise

A person, drawn as a solar system.

The visitor arrives in front of a hand-drawn universe: a large crayon Sun on the left, eight planets on nested chalk orbits, a satellite, a meteor, a belt of rocks, an analog star field. Every celestial body is circled in white chalk, the way an astronomer marks a find on a photographic plate. Every planet is a door.

The Sun is Dhruv. The planets are the parts of Dhruv's work and story that can be visited on their own: what he has built, where he has been, what he has published, what he plays with, how he thinks. One of them can be spoken to.

The conceit is a **field notebook of a system that was drawn by hand**. Chalk on black paper. Catalog marks instead of menus. Handwritten annotations instead of tooltips. The visitor is not using a website; they are reading and entering a drawing.

The drawing is intentionally imperfect. The code underneath is not.

---

# 2. Dhruv as the centre of the narrative

Dhruv Bendre is the gravitational centre of the system. Every orbit is solved around him. That is the only thing the universe asserts about him right now.

What is *not* asserted anywhere in this build:

- biography, education, employers, roles, dates
- projects, publications, awards, skills
- interests, personality traits, opinions

The greeting on the Sun ("Hii, I am / Dhruv Bendre / AI Engineer") is the one line of self-description in the build, and it was written by Dhruv. Everything else is a labelled placeholder waiting for Round 2.

The narrative rule for Round 2: **the worlds do not change shape to fit the data; the data is placed into the worlds.** If a section of Dhruv's story does not fit any world, a world is renamed or a moon is added. The system stays a system.

---

# 3. The Sun · Hearth

**Name:** Hearth
**Meaning:** the fire at the centre of a home. Warmth, origin, the thing everyone in the house is arranged around.
**Represents:** identity and core philosophy. Not a section. Not a page. The person.

The Sun is the only body in the system with a plain English name. Every planet has a coined name because every planet is an *aspect*; the Sun is simply the person, so it gets a simple word. This asymmetry is deliberate and should be preserved.

The Sun:

- carries the handwritten greeting
- is the stable visual anchor the planets pass behind
- is not a link on the home scene (there is nowhere more central to go)
- appears as a tiny crayon mark on every interior page as the way home ("Back to the system")

Symbolic interpretation is intentionally unfinished. Once Dhruv's story arrives, Hearth may gain a single line of philosophy beneath the greeting, and nothing more. The Sun does not explain itself.

---

# 4. Planet Registry

Art slots are the internal ids in the code (`mercury` … `neptune`). They name the drawing, not the world. The visitor never sees them.

All world names are **provisional** and renameable after Round 2. The mapping of world to art slot should stay, because the compositions, orbit geometry and colour system are built on it.

| World | Art slot | Meaning | Portfolio section | Colour | Personality | Core interaction | Status |
|---|---|---|---|---|---|---|---|
| **Hearth** | sun | the fire at the centre | Home · identity | `#ffd84a` warm yellow | warm, steady, unhurried | carries the greeting; the way home | built |
| **Ferrin** | mercury | iron; the small dense thing closest to the fire | Skills & tools | `#7d847a` iron grey-green | quick, plain, exact | a constellation of tools and how they connect | built (poster) |
| **Emberline** | venus | a trail of embers; where the fire has been | Experience & path | `#d16f33` burnt orange | warm, travelled, candid | a timeline drawn as an ember trail | built (poster) |
| **Verdance** | earth | greenness, growth; things that were grown and shipped | Projects | `#2e7ccb` blue with `#5d9c62` green | grounded, alive, generous | fields of projects; the satellite is what shipped | built (poster) |
| **Theoria** | mars | contemplation, the act of looking closely | Research & publications | `#c74436` red | intense, rigorous, quiet | papers as red strata cut into the surface | built (poster) |
| **Magnara** | jupiter | the great one; where the long stories live | Case studies | `#f1852d` banded orange | vast, patient, narrative | long-form banded stories, one band per study | built (poster) |
| **Cadence** | saturn | rhythm; loops that repeat and improve | Process & principles | `#e6785a` coral with dark rings | measured, honest, cyclical | rings as loops: sketch, prototype, ship, learn | built (poster) |
| **Whimsel** | uranus | whimsy, tilt; the one that spins sideways | Playground & experiments | `#42b69d` teal with a cyan ring | playful, askew, curious | tilted experiments that may never ship | built (poster) |
| **Mnemora** | neptune | memory; the archive that answers | The AI archive (conversation) | `#1889c0` on a deep `#0a1a2e` field | listening, deep, exact, never guessing | a conversation with the archive | built (poster threshold + archive) |
| **Sonara** | pluto | sound; the loud one, heard before it is seen | Favourite music | `#ff5fbc` hot pink on `#170812` | loud, playful, collaged | a festival poster: lineup, stages, on repeat | built (poster, sample lineup) |
| **Signal** | — | a message sent out into the dark | Contact | chalk on black | direct, brief | send a signal | built (poster) |

**Naming system.** Every planet is named for the *quality it holds*, coined from a root plus a soft ending, so the set reads as one catalogue rather than a list of features: Ferr-in, Ember-line, Verd-ance, Theor-ia, Magn-ara, Cad-ence, Whims-el, Mnem-ora, Son-ara.

**Sonara (added 2026-09-05).** The ninth body sits on the outermost orbit, upper-left on desktop. Its lineup lives in `web/src/data/music.ts` and is a labelled sample until Dhruv supplies his real favourites (`SAMPLE_LINEUP`).

**The poster interiors (2026-09-05).** Every world's interior, and Signal, is now a festival poster in the world's own colours: typography, sizes and hierarchy measured from lollaindia.com, a 50-slot doodle pack per world drawn from `festival-pages-brief.md`. The home scene is untouched: crayon bodies, chalk perimeters, chalk annotations, the same descent. The content of each poster is real (scraped from Dhruv's published portfolio) except Sonara's lineup. Registry status "built (poster)" above means the poster page exists with real content; "sample lineup" means the doodles and layout are done but the facts are placeholders.

No world is named after what it does in a portfolio ("Projects World"). No world is named after a real planet. The Sun alone is a plain word.

**Signal** has no planet. Contact is not a destination to explore; it is an action. It is reachable from the footer of every interior world and from a small chalk mark on the home scene. If Round 2 makes a ninth body feel right (a comet, a distant moon), Signal is the obvious candidate.

**Colour ownership.** Each world owns one accent, one soft accent and one *field*: the deep, near-black tint of that world's interior. The home scene is pure black paper; a world's field is the same black, breathed on by that world's colour. See `art.md` §2.

---

# 5. World 01 · Mnemora

## 5.1 Why this name

The archive world needed a name that meant *memory* without saying "memory", felt like it belonged to the same catalogue as the others, and could carry a conversation with dignity.

Candidates considered:

- **Mnemos** (the example in the brief): strong root, but reads as a product name and is close to existing brands.
- **AstraMind**: says "AI" too loudly; every planet here is a mind of sorts.
- **Anamnesis**: exact (the recollection of things known before), but five syllables and hard to say.
- **Archivum / Archiva**: too literal, and "archive" is already the word the interface uses.
- **Mnemora**: *mnēmē* (memory) with the *-ora* ending shared by Magnara. Three syllables, easy to say, sounds like a place. It keeps "memory" one step below the surface, which is where the chatbot's nature should sit.

Mnemora is the outermost world. In the drawing it is the deep blue planet at the top-left of the far orbit: the last thing in the system, the one that remembers all of it.

## 5.2 What the visitor experiences

**On the home scene.** Hovering Mnemora strengthens its chalk perimeter and reveals its catalog mark:

```
VIII  ·  Mnemora
the archive that answers
```

**Entering.** Clicking begins the descent (see §6). The universe dims, Mnemora rises and grows, its deep-blue field floods the screen, and the interior opens with the same planet now sitting as a horizon at the bottom of the viewport.

**Inside.** The interior is the *threshold* of the archive: the world name, the line "Ask the archive about Dhruv.", and a single chalk-outlined question field. Submitting a question, or choosing to enter, carries the visitor into the archive itself, which is the Streamlit application. The two are designed to be the same room: same field colour, same chalk, same typography, same horizon. The technology switch is not announced.

**In the archive.** The visitor talks to Mnemora. The archive answers only from what it holds. When it does not know, it says so plainly:

> The archive doesn't contain enough information about that yet.

It never speculates about Dhruv. It can synthesise across what it holds, follow a conversation, and point to where an answer came from ("From the archive: Projects / …").

## 5.3 Personality

Mnemora is not an assistant and not a mascot. It is the memory of a system, spoken aloud.

- **listening** before it speaks; it answers the question that was asked
- **exact**: it prefers a short grounded answer to a long plausible one
- **candid** about the edges of what it knows
- **curious** in the way it phrases a follow-up, never in the way it invents
- **never corporate**, never "As an AI", never "According to the context"

## 5.4 Visual identity (summary; full rules in `art.md` §10)

- field `#0a1a2e`, accent `#1889c0`, soft accent `rgba(24,137,192,0.16)`
- the deep-blue crayon planet as a horizon at the bottom of every screen
- chalk `#f1f1e8` for outlines, rules, the question field and the answer glyph
- glyph: a small chalk **open ring with a single dot** (a memory, held)
- texture: blue dust, thin orbital arcs crossing the corner of the frame
- typography: Manrope for conversation, Caveat for the world name and annotations
- motion: one slow orbital arc drifting behind the conversation; nothing else moves on its own

## 5.5 Knowledge model

The archive is a folder of markdown documents, one per category, each with metadata (category, title, source, date, project, document type). Round 2 replaces the placeholder documents with Dhruv's real ones. Nothing about the interface changes when that happens; only the answers do.

---

# 6. Narrative progression

There is no required order. The system is a map, not a corridor. Still, the composition suggests a reading:

1. **Arrive at Hearth.** The greeting is the only text. The hint "Explore a planet" appears once.
2. **The near worlds first.** Ferrin, Emberline and Verdance sit close to the Sun and low in the frame, where the eye lands: skills, path, projects. The practical story.
3. **The great worlds.** Magnara and Cadence rise up the right side: the long stories and the way of working.
4. **The far worlds.** Theoria, Whimsel and Mnemora sit along the top: research, play and memory. The reflective story.
5. **Signal**, whenever the visitor is ready.

**Moving between worlds.** Each interior world ends with a footer that names the next world on the orbit outward ("Next orbit → Emberline · Experience") and a mark that returns to the system. Returning to the system is always a short trip (the paper veil, under half a second); entering a world is always a longer descent (about seven tenths of a second). Leaving should feel easy; arriving should feel like something.

**Entering a world** always follows the same choreography, so the visitor learns it once:

1. the chosen planet's chalk perimeter strengthens
2. the other bodies fall back (opacity down, no movement)
3. the planet rises above its neighbours and grows toward the centre of the viewport
4. its field colour spreads from the planet until it fills the screen
5. the interior opens with the same planet as a horizon
6. the interior's text is drawn in

Under `prefers-reduced-motion` the choreography collapses to a short cross-fade with the same colours.

---

# 7. Hidden details

Optional, small, and none of them should be built before Round 2. Listed so the architecture leaves room.

- **The satellite.** It circles Verdance. It could be the one thing that is actually shipped and live: a link to Dhruv's most current project.
- **The meteor.** It crosses the upper-left every nine to eighteen seconds. Catching it (clicking during its flight) could open a single hidden note: something Dhruv is thinking about this month.
- **The asteroid belt.** Small unfinished things. A field of tiny ideas, one line each, revealed on hover. No page.
- **Chalk marks that change.** After a visitor has entered every world, the orbit lines on the home scene could gain small chalk tick marks, like a plate that has been fully catalogued.
- **Mnemora remembers.** In the archive, asking "what have I asked you?" could replay the session's questions back as a constellation.
- **The Sun's second line.** A single sentence of philosophy under the greeting, revealed only after Signal has been visited.

---

# 8. Ending

There is no final screen. A solar system does not end; it keeps turning.

What changes after every world has been visited:

- the home scene carries the small chalk tick marks on each orbit (see §7)
- the hint text, if it ever reappears, changes from "Explore a planet" to "You have seen the whole system"
- Signal's chalk mark on the home scene strengthens, the way Mnemora's does on hover, as the natural last act

If Dhruv wants a true ending in Round 2, the strongest candidate is a single quiet screen reached only from the Sun after everything has been seen: the drawing with the chalk wiped away, and one sentence.

---

# 9. Open questions for Round 2

- Final world names, once the real sections are known. Keep the naming rule in §4.
- Whether Research (Theoria) and Case studies (Magnara) are both needed, or merge.
- Whether Signal deserves a body.
- What the Sun says beneath the greeting, if anything.
- Which real questions replace the category prompts in Mnemora's empty state.
