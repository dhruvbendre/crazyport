# web · the solar system

The front-facing universe: a Vite + React + TypeScript + GSAP app whose entire navigation is a hand-drawn solar system. See the root `README.md` for the concept and `../art.md` / `../plot.md` for the visual and narrative rules.

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # tsc -b + vite build -> dist/
npm run preview
npm run typecheck
```

Copy `.env.example` to `.env.local` to set `VITE_ARCHIVE_URL` (the deployed archive) and `VITE_DEBUG_SOLAR`.

## Map

```
src/
  app/            router (/, /:slug, /signal, /art-test) + App shell
  pages/          HomePage, WorldPage, MnemoraPage (threshold), SignalPage, ArtTestPage, NotFoundPage
  data/
    planets.ts    THE WORLD REGISTRY: art slot -> fictional world (name, catalog, descriptor, colours, glyph, texture, route)
    sceneLayouts.ts responsive compositions + authored annotation placements
    orbitPaths.ts  solved orbit paths
    portfolio.ts   interior sections (placeholders until Round 2) + archive prompt categories
  art/
    *Art.tsx       crayon bodies (pure SVG, generated from crayon.ts)
    chalk.ts       the chalk perimeter / leader / rule / box generators
    WorldGlyph.tsx one chalk symbol per world
  components/
    solar-system/  scene, ChalkOutline, PlanetLabels, PlanetNode, SunNode, SignalMark, layers
    layout/        WorldPageShell, WorldHorizon, WorldAmbient, ChalkRule, BackToSystem, WorldTheme
    intro/         the opening flight
    transitions/   the route overlay (field-colour disc + veil)
  motion/          GSAP: hoverMotion (chalk + annotation), routeTransitions (enter / return / external), intro, environment
  config/site.ts   env-driven configuration
  styles/          tokens, globals, solar-system, intro, worlds
```

## Conventions

- Real planet names (`mercury` … `neptune`) are internal art-slot ids only. Visible names come from `planets.ts`.
- Positions and orbit geometry are authored per layout; `resolveOrbit` solves the ellipse through the authored point.
- Chalk perimeters and annotations are generated and seeded; never hand-draw an outline or use a CSS border.
- Interior pages go through `WorldPageShell` and inherit the world's field, texture motif and horizon.
- `STATIC_ORBITS` in `motion/orbitMotion.ts` keeps planets at their composed positions. If it is switched off, move `PlanetLabels` inside each planet's orbit wrapper so annotations travel with the body.
- On Windows from Git Bash, run Vite as `node node_modules/vite/bin/vite.js` if `npx` fails to find node.
