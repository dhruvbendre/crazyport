# Interactive Solar System Portfolio
## Master Execution Plan for Codex

## 0. Mission

Build a full-screen interactive portfolio that feels like a hand-drawn paper-crayon solar-system poster brought to life.

The composition must preserve the visual logic of the supplied reference:

- A huge smiling Sun enters from the left edge and occupies a large part of the frame.
- Thin hand-drawn white orbit lines sweep diagonally and elliptically from left to right.
- The planets sit on different orbital paths rather than in a rigid horizontal row.
- The upper-right quadrant contains the larger outer planets.
- Earth and the smaller inner planets sit lower and closer to the Sun.
- A small satellite crosses one orbit.
- A meteor travels through the upper-left / central space.
- A loose asteroid belt curves through the lower-right area.
- The background is a black paper-like star field.
- The whole scene is framed like a physical illustrated sheet of paper.
- Every planet has a simple friendly face and imperfect crayon texture.

This is not a scientifically accurate astronomy visualizer. It is a portfolio navigation world. The priority is charm, motion, discoverability, and visual composition.

The entire solar system is the primary navigation. Each planet is a clickable destination in the portfolio.

Do not replace this with conventional navbar cards, glassmorphism panels, generic floating spheres, realistic 3D planets, WebGL, or a stock solar-system illustration.

---

# 1. Core Creative Direction

## 1.1 Experience statement

The page should feel like:

> A childlike hand-drawn solar-system poster made from paper, wax crayon, chalk, pencil, and tiny cut-paper details, then animated with sophisticated web motion.

The visual art should remain deliberately imperfect. The code and interaction should be highly refined.

## 1.2 Emotional target

The experience should feel:

- playful
- curious
- handmade
- personal
- tactile
- memorable
- calm rather than chaotic
- whimsical without becoming childish UI

The portfolio itself is the universe. The user explores the creator by exploring planets.

## 1.3 Non-negotiables

1. Use pure SVG artwork for the Sun, planets, orbit lines, stars, satellite, meteor, asteroid belt, paper frame, and decorative space elements.
2. Do not use raster planet images.
3. Do not use photorealism.
4. Do not use normal flat vector gradients as the dominant visual treatment.
5. Do not use perfectly smooth mathematical circles for visible planet edges. Use subtly irregular SVG paths or filters.
6. Every planet must be a real interactive navigation target.
7. Orbit motion must feel physically believable but intentionally stylized.
8. Hovering a planet must never interrupt the orbital system abruptly.
9. The Sun remains the stable visual anchor.
10. The composition must match the same overall spatial hierarchy as the reference image.
11. Mobile must remain usable without shrinking the entire desktop scene into unreadable miniature artwork.
12. All major motion must honor `prefers-reduced-motion`.
13. No conventional top navigation bar on the landing screen unless used only as a minimal utility fallback.

---

# 2. Portfolio Information Architecture

Use the planets as the primary navigation model.

The exact labels can be changed later through a single data file. Build the system so page names are not hard-coded into individual SVG components.

## Recommended default mapping

| Celestial body | Portfolio role | Suggested route | Reason |
|---|---|---|---|
| Sun | Home / identity | `/` | Main visual anchor and return-home control |
| Mercury | About me | `/about` | Closest planet, personal introduction |
| Venus | Skills | `/skills` | Rich visual character and warm color |
| Earth | Selected work / projects | `/work` | Most familiar and naturally important |
| Mars | Experience | `/experience` | Strong character and clear distinct color |
| Jupiter | Case studies | `/case-studies` | Largest planet for largest body of work |
| Saturn | Process | `/process` | Ring metaphor suits systems/process |
| Uranus | Playground / experiments | `/playground` | Unusual orientation fits experimental work |
| Neptune | Contact | `/contact` | Final outer destination, calm blue closure |

Optional Pluto can be included as a small secret / easter-egg destination:

- `/archive`
- `/music`
- `/notes`
- `/secret`

Do not force Pluto if it makes the composition too busy.

---

# 3. Site Architecture

Recommended stack:

- React
- Vite or Next.js if this portfolio will eventually need SEO-heavy case-study pages
- TypeScript
- GSAP for orbital, hover, entrance, and route transition motion
- React Router if using Vite
- CSS variables for all design tokens
- SVG components as React components
- Optional Lenis only for inner content pages if smooth scrolling is needed

Do not use Three.js for the solar system. It would make the visual language harder to control and less faithful to the paper-crayon reference.

## Recommended repository structure

```text
src/
  app/
    App.tsx
    router.tsx
    routes.ts

  pages/
    HomePage.tsx
    AboutPage.tsx
    SkillsPage.tsx
    WorkPage.tsx
    ExperiencePage.tsx
    CaseStudiesPage.tsx
    ProcessPage.tsx
    PlaygroundPage.tsx
    ContactPage.tsx

  components/
    solar-system/
      SolarSystemScene.tsx
      SolarSystemStage.tsx
      OrbitLayer.tsx
      PlanetNavigator.tsx
      PlanetNode.tsx
      SunHomeControl.tsx
      StarField.tsx
      AsteroidBelt.tsx
      Satellite.tsx
      Meteor.tsx
      SpaceDust.tsx
      PaperFrame.tsx
      NavigationHint.tsx
      PlanetLabel.tsx
      RouteTransition.tsx

    celestial-art/
      SunArt.tsx
      MercuryArt.tsx
      VenusArt.tsx
      EarthArt.tsx
      MarsArt.tsx
      JupiterArt.tsx
      SaturnArt.tsx
      UranusArt.tsx
      NeptuneArt.tsx
      SatelliteArt.tsx
      MeteorArt.tsx
      AsteroidArt.tsx

    layout/
      PortfolioPageShell.tsx
      BackToUniverse.tsx

  data/
    planets.ts
    portfolio.ts

  motion/
    solarMotion.ts
    planetHover.ts
    routeTransitions.ts
    reducedMotion.ts

  styles/
    tokens.css
    globals.css
    solar-system.css
    portfolio-pages.css

  assets/
    none-required-for-planets.md

  hooks/
    useReducedMotion.ts
    useSceneScale.ts
    usePlanetNavigation.ts

  utils/
    clamp.ts
    math.ts
    accessibility.ts

public/

art.md
README.md
```

---

# 4. Scene Composition

## 4.1 Desktop master composition

Design first for a 1440 x 1000 reference viewport.

Use a logical SVG viewBox of:

```text
0 0 1440 1000
```

This creates a stable coordinate system independent of device pixel ratio.

The stage should fill the viewport:

```css
min-height: 100svh;
width: 100%;
overflow: hidden;
position: relative;
background: #050505;
```

The complete illustration should render inside one main `<svg>` scene plus DOM-based overlays only when required for accessibility.

## 4.2 Reference-driven spatial layout

Approximate placement targets:

### Sun

- Center roughly: `x = 80`, `y = 625`
- Radius visible: `320 to 360`
- Much of the Sun extends beyond the left edge.
- The Sun should occupy approximately 35 to 45 percent of the visible scene height.
- Its right edge forms a scalloped flame corona.

### Top planets

- Neptune-like blue planet around `x 770, y 140`
- Uranus-like green/teal planet around `x 920, y 225`
- Saturn around `x 1070, y 330`
- Jupiter around `x 1180, y 500`

### Inner planets

- Mars-like red planet around `x 1030, y 640`
- Earth around `x 785, y 720`
- Mercury / Venus small planets around `x 250 to 500, y 760 to 835`

### Satellite

- Around `x 690, y 550`
- Crosses an orbit path.

### Meteor

- Around `x 420, y 215`
- Angled diagonally rightward.

### Asteroid belt

- Curving band from lower center toward lower-right.
- Individual stones, not a single brush stroke.
- Visual density should increase slightly toward the right edge.

The scene must feel intentionally asymmetrical, like a hand-composed poster.

Do not evenly distribute the planets.

---

# 5. Orbit System

## 5.1 Orbit visual design

Use 8 thin white orbit paths.

Required appearance:

- off-white rather than pure digital white
- approximately 1.5 to 3 px at the 1440 logical width
- slight line-width irregularity
- slightly rough paper/crayon edge
- never perfectly identical
- no glow
- no neon
- no transparent 3D rings

Preferred orbit stroke:

```css
stroke: #f4f0df;
stroke-width: 2;
stroke-linecap: round;
fill: none;
opacity: 0.92;
```

Then apply subtle SVG roughness with a very low-strength displacement filter.

## 5.2 Orbit geometry

The orbit paths should be wide ellipses whose implied centers sit near the Sun.

They should appear compressed by perspective and pass diagonally through the viewport.

Do not use perfectly concentric circles.

Each path should have a unique SVG path string.

Example design strategy:

- Create a base ellipse.
- Rotate it between `6deg` and `14deg`.
- Slightly offset the path center for each orbit.
- Introduce tiny control-point deviations so the path feels hand-drawn.

## 5.3 Actual planet motion

Each planet must move along its associated orbit path.

Use GSAP MotionPathPlugin if available. If avoiding paid/plugin concerns, use SVG native path measurement plus `getPointAtLength()` inside GSAP animation.

Recommended implementation:

1. Each orbit `<path>` receives a stable ID.
2. Each planet receives the corresponding `orbitId` in data.
3. Motion state is computed independently from planet art.
4. A wrapper `<g>` receives translation based on the orbit path.
5. The planet art inside the wrapper can perform its own subtle wobble independent of orbital translation.

Do not rotate the planet artwork with the orbit tangent unless intentionally configured. Friendly faces should remain mostly upright.

## 5.4 Orbital periods

The orbital durations should be intentionally compressed for interaction.

Suggested loop durations:

```text
Mercury: 18s
Venus: 24s
Earth: 31s
Mars: 38s
Jupiter: 52s
Saturn: 62s
Uranus: 72s
Neptune: 84s
```

This gives the inner planets visibly quicker movement without creating a frantic scene.

Use `ease: none` for the path translation.

## 5.5 Starting positions

Match the reference composition at initial load.

Do not let all planets begin at the same normalized orbital progress.

Each planet receives a `startProgress` value between `0` and `1`.

The first rendered frame should already look like the intended poster composition.

Example:

```ts
{
  id: 'earth',
  orbitId: 'orbit-earth',
  duration: 31,
  startProgress: 0.66
}
```

## 5.6 Hover behavior while orbiting

On hover/focus:

- Do not fully stop the entire solar system.
- The target planet should smoothly slow to approximately 15 percent of normal orbital speed.
- The planet should scale to around `1.08` to `1.14`.
- Its face can animate slightly.
- A small handwritten label appears close to the planet.
- Nearby stars can react subtly.
- The orbit line associated with the planet can brighten by 5 to 10 percent.

On pointer leave:

- Speed returns smoothly to normal.
- Scale returns to 1.
- Label fades out.

Never snap the planet to a fixed point.

---

# 6. Planet Navigation Interaction

## 6.1 Entire planet is clickable

Every planet wrapper must behave as an accessible link.

Preferred structure:

```tsx
<a
  href="/work"
  aria-label="Open selected work"
  className="planet-hit-target"
>
  <svg ... />
</a>
```

For React Router, use `<Link>` or route handler while preserving semantic link behavior.

## 6.2 Hit targets

Visible planets can be small, but click/touch areas must not be.

Minimum interactive target:

- 44 x 44 CSS pixels
- Prefer 56 x 56 or larger for tiny Mercury-like elements

Use invisible SVG hit circles or transparent pointer target wrappers.

## 6.3 Hover label design

Do not use modern pill badges.

Use a small handwritten annotation:

```text
EARTH
Selected work
```

Visual language:

- off-white paper label or just floating handwritten text
- tiny crayon underline
- slight angle between `-2deg` and `2deg`
- no heavy shadow
- no glass panel

For desktop, labels appear on hover/focus only.

For touch, labels can appear on first tap, route on second tap, or remain persistently visible in a compact mode depending on usability test results.

Recommended touch approach:

- Planet labels are visible by default on tablet/mobile.
- Tap navigates immediately.

## 6.4 Current destination indication

Inner pages should include a compact “Back to universe” link using a tiny Sun icon or orbit icon.

When returning to the home scene, restore the same orbital state where possible for continuity.

---

# 7. Landing Sequence

## 7.1 First 2 seconds

The entry should feel like a drawing waking up.

Suggested sequence:

### 0.00 to 0.35s

- Paper background and black space field fade in.

### 0.15 to 0.8s

- Orbit paths are drawn using stroke-dash animation.
- Do not draw all paths at exactly the same speed.

### 0.35 to 1.2s

- Sun eases slightly in from the left and settles.
- It should not bounce excessively.

### 0.55 to 1.45s

- Planets scale from approximately 0.9 to 1 while opacity rises.
- Stagger according to spatial order, not DOM order.

### 0.9 to 1.8s

- Satellite glides in.
- One meteor travels across.
- Stars begin faint twinkle motion.

### 1.6s+

- Orbital movement begins at normal speed.
- Small “Explore the planets” hint appears for first-time visitors.

The intro must be skippable and should not block interaction for more than about 1 second.

---

# 8. Background Star Field

## 8.1 Visual construction

Do not use a CSS star background texture.

Create stars inside SVG so they inherit the handmade style.

Use approximately:

- 180 to 260 tiny dots
- 20 to 35 slightly larger irregular stars
- 5 to 9 small cross-shaped stars

Use deterministic seeded coordinates so the composition does not change on every reload.

## 8.2 Star styles

Mix:

- tiny chalk dots
- irregular white pinpricks
- faint grey specks
- occasional blue-white crayon dots

Avoid a perfect random procedural “space wallpaper” look.

The reference has stars distributed throughout but visually subordinate to the planets.

## 8.3 Star motion

Most stars remain static.

Only 10 to 15 percent should animate.

Twinkle animation:

- opacity range: `0.35 to 0.9`
- scale range: `0.85 to 1.15`
- random duration: `2.8 to 6.5s`
- random delay

Never animate the entire background simultaneously.

---

# 9. Meteor Motion

The meteor should be a recurring environmental animation.

Art:

- small orange/yellow head
- crayon red/orange tail
- irregular streak

Motion:

- begins outside or near upper-left orbit region
- moves diagonally right/down a short distance
- duration around 1.3 to 2.2 seconds
- repeats every 9 to 18 seconds with randomized delay
- slight rotation variation per pass

Do not make meteors constant. They should feel like occasional surprises.

---

# 10. Satellite Motion

The satellite should feel separate from the planets.

Use a tiny paper-cut / crayon satellite with:

- dark grey body
- small white center module
- blue/grey solar panels

Motion options:

- slow movement along a small local path around Earth
- plus a gentle body rotation of approximately `-8deg` to `8deg`

Recommended:

- local Earth orbit duration: 9 to 14 seconds
- panel wobble: 2 to 3 degrees

Do not rotate so quickly that it becomes a spinner.

---

# 11. Asteroid Belt

## 11.1 Construction

Create 45 to 90 individual asteroid shapes in one SVG group.

Each asteroid:

- irregular blob or pebble path
- tan / grey / dusty-gold fill
- rough crayon texture
- slightly different rotation and scale

## 11.2 Motion

The belt should not behave like one rigid object.

Animate only a subset:

- 15 to 25 percent slowly drift 2 to 8 px
- slight rotation over 8 to 20 seconds
- very low amplitude

The belt should still read as mostly illustrated, not as particle effects.

---

# 12. Paper Frame

The supplied reference reads as artwork pinned on a physical page.

Recreate this as SVG or CSS-assisted SVG.

Required elements:

- warm cream paper outer field
- irregular torn/painted black inner space window
- slightly rough paper edge
- optional subtle corner pin/tack details

The frame should be visible on desktop, but on small mobile screens it may crop partially to preserve the solar-system scale.

Suggested colors:

```css
--paper: #e8e1cf;
--paper-highlight: #f4eedf;
--space: #050505;
--orbit: #f4f0df;
--ink: #121212;
```

Do not make it look like a glossy museum frame.

---

# 13. Crayon / Paper Texture Strategy

This is the most important implementation detail after composition.

Do not fake “crayon style” by simply applying noise to a flat vector.

Use multiple techniques together.

## 13.1 SVG filters

Create shared SVG `<defs>`:

- `crayonRoughness`
- `paperGrain`
- `edgeWobble`
- `softChalk`

Recommended primitives:

- `feTurbulence`
- `feDisplacementMap`
- `feColorMatrix`
- `feBlend`
- `feComposite`

Keep distortion low enough that faces remain clean.

## 13.2 Layered fill strokes

Each planet should contain:

1. Base irregular planet silhouette.
2. 2 to 5 broad hand-drawn crayon bands.
3. Fine scribble strokes at 10 to 25 percent opacity.
4. A few lighter pressure streaks.
5. Subtle dark edge texture.
6. Face drawn with imperfect ink-like SVG paths.

## 13.3 No overly digital gradients

Gradients may be used sparingly below crayon layers to create volume, but they must never be the visible final style.

## 13.4 Texture scale

Texture needs to remain visible when planets scale up on hover.

Do not use a tiny repeated bitmap pattern.

Prefer SVG vector scribbles plus filter-generated grain.

---

# 14. Face Animation

Faces are central to the reference style.

Use simple line-art expressions.

Possible micro-interactions:

- blink every 5 to 12 seconds
- tiny smile change on hover
- eyes glance toward cursor within a very small range

Rules:

- no realistic eyes
- no complex character rig
- no cartoon mouth talking
- no giant bounce reactions

The default face should always read pleasantly even while static.

---

# 15. Cursor Interaction

Desktop only.

## 15.1 Planet proximity response

When pointer enters a planet's proximity radius:

- planet subtly leans or shifts 2 to 4 px toward cursor
- face eyes can shift by at most 2 px
- label fades in

The orbit itself must remain the dominant movement.

## 15.2 Background parallax

Use very subtle pointer parallax:

- stars: maximum 4 px
- asteroid belt: maximum 6 px
- outer paper frame: maximum 2 px

Do not move the Sun more than 2 px from pointer parallax.

Disable pointer parallax on touch devices and in reduced-motion mode.

---

# 16. Route Transition Concept

Clicking a planet should feel like entering that world.

Recommended transition:

1. User clicks planet.
2. Planet scales from `1` to approximately `1.8` while moving toward viewport center.
3. Surrounding scene fades to 40 percent opacity.
4. Planet becomes a circular / organic color field.
5. Page content cross-fades or reveals from the planet color.
6. New route loads.

Duration:

- 500 to 800 ms

Do not use a long cinematic zoom through space.

The transition needs to feel delightful but not make navigation slow.

For browser back:

- reverse with a shorter 350 to 550 ms return.

---

# 17. Inner Portfolio Page System

The user requested the solar system as the portfolio navigation, so inner pages should feel connected to the universe without copying the entire scene.

## 17.1 Shared shell

Each page gets:

- small “Back to universe” control
- planet-specific accent color
- optional small orbit doodle in background
- clear page title
- normal highly usable content layout

## 17.2 Avoid theme overuse

Do not turn every card into a planet.

The landing scene carries most of the visual fantasy. Inner pages should be calmer and readable.

## 17.3 Planet accent variables

Set per-route CSS custom properties:

```css
--planet-accent
--planet-accent-soft
--planet-ink
```

Use the active planet's palette for section accents and interaction cues.

---

# 18. Data Model

Create `src/data/planets.ts`.

Example structure:

```ts
export type PlanetConfig = {
  id: string;
  label: string;
  subtitle: string;
  route: string;
  orbitId: string;
  orbitDuration: number;
  startProgress: number;
  scale: number;
  zIndex: number;
  ariaLabel: string;
  accent: string;
};

export const planets: PlanetConfig[] = [
  {
    id: 'earth',
    label: 'Earth',
    subtitle: 'Selected work',
    route: '/work',
    orbitId: 'orbit-earth',
    orbitDuration: 31,
    startProgress: 0.66,
    scale: 1,
    zIndex: 6,
    ariaLabel: 'Open selected work',
    accent: '#3e82d8'
  }
];
```

All route labels and planet metadata must be controlled from this file.

---

# 19. Motion Architecture

Do not scatter ad hoc GSAP code throughout planet components.

## 19.1 `solarMotion.ts`

Owns:

- orbital loops
- start progress
- slow-on-hover logic
- scene pause/resume

## 19.2 `planetHover.ts`

Owns:

- scale
- label
- eye glance
- local wobble

## 19.3 `routeTransitions.ts`

Owns:

- planet-to-page transitions
- page-to-universe return

## 19.4 Cleanup

All GSAP contexts must be scoped and reverted on unmount.

No accumulating event listeners.

No timers without cleanup.

---

# 20. Responsive Strategy

Do not simply scale the 1440 desktop scene down.

## 20.1 Desktop: 1200px+

- Full illustrated composition.
- Labels appear on hover.
- All planets orbit.
- Pointer reactions active.

## 20.2 Tablet: 768 to 1199px

- Scene remains full-screen.
- Crop more of the Sun.
- Reduce orbit radii slightly.
- Increase small planet hit targets.
- Labels appear on hover if pointer exists, otherwise remain lightly visible.

## 20.3 Mobile: below 768px

Create a dedicated mobile composition using the same art assets.

Target:

- portrait orientation
- Sun enters from upper-left or lower-left
- orbit curves arc vertically through screen
- planets are distributed from top to bottom
- keep at least 5 primary planets visible without overlap
- allow vertical scroll for remaining destinations if necessary

Preferred option:

- 120 to 140svh illustrated scene
- planets positioned along a vertical orbit flow
- scroll itself advances orbital progress subtly

Do not make touch targets smaller than 48 px.

## 20.4 Very small screens

If width is below approximately 390 px:

- reduce decorative stars
- reduce asteroid count
- simplify hover-equivalent interactions
- keep navigation labels readable

---

# 21. Accessibility

The visual should remain accessible without reducing the experience.

Required:

- semantic links for all planets
- keyboard navigation
- visible focus indicators that fit the crayon style
- `aria-label` for every planet link
- sensible DOM order matching navigation order
- text labels available to screen readers
- reduced-motion mode
- minimum color contrast on page copy

## 21.1 Keyboard behavior

When a planet receives keyboard focus:

- label appears
- orbit slows for that planet
- focus ring appears as hand-drawn double-outline around hit target

Enter activates route.

## 21.2 Reduced motion

When `prefers-reduced-motion: reduce`:

- planets remain in composed initial positions
- no continuous orbital movement
- no parallax
- no meteor loops
- only simple hover opacity/scale transitions below 150 ms

The navigation must still feel complete.

---

# 22. Performance Budget

Target:

- 60 fps on modern desktop
- stable 45 to 60 fps on mid-range mobile
- no layout thrashing during orbit animation

Rules:

- animate SVG transforms, not layout properties
- avoid huge blur filters
- keep `feTurbulence` octaves modest
- share filters across artwork where possible
- avoid thousands of DOM nodes
- target under 1,500 SVG nodes for the entire landing scene if possible
- pause animations when tab is hidden
- pause or reduce animation when scene is off-screen

Do not render every crayon stroke as hundreds of paths. Balance texture richness with DOM cost.

---

# 23. Design Tokens

Create in `tokens.css`:

```css
:root {
  --space: #050505;
  --paper: #e8e1cf;
  --paper-light: #f4eedf;
  --orbit: #f4f0df;
  --ink: #151515;

  --sun-yellow: #ffd94a;
  --sun-orange: #f6a92f;

  --mercury-grey: #81867c;
  --venus-orange: #d97b35;
  --earth-blue: #3a84d8;
  --earth-green: #5ba766;
  --mars-red: #c94836;
  --jupiter-orange: #ef862e;
  --saturn-coral: #e77359;
  --uranus-green: #45b69c;
  --neptune-blue: #198cc1;

  --motion-fast: 180ms;
  --motion-medium: 420ms;
  --motion-route: 680ms;
}
```

Do not treat these values as rigid if art direction requires adjustment. Maintain the warm crayon palette.

---

# 24. Typography

The main solar-system screen should contain very little text.

Recommended type direction:

- Main labels: a hand-drawn or soft humanist font with excellent legibility
- Portfolio page text: clean sans-serif

If avoiding external type licensing, use:

- `Nunito Sans` or `Manrope` for page UI
- custom hand-drawn SVG lettering for tiny planet labels where needed

Do not use a novelty space font.

Do not add a giant headline over the solar system unless explicitly requested later.

The art is the hero.

---

# 25. Loading State

Avoid a generic spinner.

Use one of these:

### Preferred

A tiny crayon Sun appears centered and draws one orbit ring around itself.

Maximum display duration before content should be approximately 1 second on normal loads.

If SVG is bundled locally, a loading screen may not be required at all.

---

# 26. Audio

Do not include audio by default.

If added later:

- must start muted/off
- user must explicitly opt in
- ambient audio should be subtle and non-loop-fatiguing

The experience must be complete without sound.

---

# 27. Implementation Phases

## Phase 1: Foundation

1. Create project shell.
2. Install routing.
3. Create CSS tokens.
4. Create `planets.ts` data model.
5. Add placeholder route pages.
6. Implement responsive full-screen scene wrapper.

Acceptance gate:

- Every route works from temporary buttons.
- No visual art yet required.

## Phase 2: Static SVG Composition

1. Build PaperFrame.
2. Build StarField.
3. Build orbit paths.
4. Add final SVG Sun and planet components from `art.md`.
5. Place all planets in their intended initial positions.
6. Add meteor, satellite, asteroid belt.

Acceptance gate:

- Screenshot of page without animation should already look like a finished poster.
- If static composition is weak, do not continue to animation.

## Phase 3: Orbital Motion

1. Map each planet to path.
2. Implement progress-based motion.
3. Apply independent durations.
4. Lock friendly faces upright.
5. Add local planet wobble.

Acceptance gate:

- No visible jumps after a full loop.
- Orbits remain smooth for at least 3 minutes.

## Phase 4: Interactive Navigation

1. Add hover/focus states.
2. Add labels.
3. Add hit targets.
4. Add route click behavior.
5. Add keyboard support.

Acceptance gate:

- Every planet is understandable as navigation without a conventional navbar.

## Phase 5: Environmental Motion

1. Meteor loop.
2. Satellite loop.
3. Sparse star twinkle.
4. Asteroid micro-drift.
5. Tiny cursor parallax.

Acceptance gate:

- Motion feels alive but never distracts from planet navigation.

## Phase 6: Route Transitions

1. Planet zoom transition.
2. Page shell.
3. Back-to-universe animation.
4. State restoration.

Acceptance gate:

- Navigation feels fast and intentional.

## Phase 7: Responsive Recomposition

1. Tablet coordinates.
2. Mobile vertical composition.
3. Touch labels.
4. Reduced decorative density.

Acceptance gate:

- Every route remains discoverable on 390 x 844.

## Phase 8: Accessibility and Performance

1. Reduced-motion test.
2. Keyboard-only test.
3. Screen-reader label test.
4. Chrome performance test.
5. Mobile throttling test.

Acceptance gate:

- No continuous animation causes frame drops or interaction lag.

## Phase 9: Polish

1. Tune orbital timing.
2. Tune crayon filters.
3. Reduce repetitive star pattern.
4. Adjust paper frame.
5. Refine labels.
6. Verify route transition continuity.

---

# 28. Component Responsibilities

## `SolarSystemScene.tsx`

Owns the overall scene and data orchestration.

Must not contain drawing details for individual planets.

## `OrbitLayer.tsx`

Renders all orbit paths and IDs.

Should expose refs or path registry to motion system.

## `PlanetNavigator.tsx`

Maps `planets.ts` into interactive planet nodes.

## `PlanetNode.tsx`

Owns:

- anchor semantics
- hit target
- motion wrapper
- label
- hover/focus state

Does not own route page content.

## Planet art components

Pure presentational SVG.

Inputs may include:

```ts
size?: number
expression?: 'default' | 'hover' | 'blink'
className?: string
```

Do not put GSAP logic in art components.

---

# 29. Required CSS Layering

Recommended scene z-index / SVG group order:

```text
0 paper outer background
1 black space window
2 distant stars
3 orbit lines
4 distant planet elements
5 asteroid belt
6 planets
7 satellite and meteor
8 labels / focus art
9 first-time navigation hint
```

Some planets may overlap orbit lines. Preserve reference-like depth.

Do not render every orbit line above every planet.

---

# 30. Interaction Details by Planet

The art stays consistent, but each planet can have one tiny signature behavior.

These should be optional and subtle.

| Planet | Micro-interaction |
|---|---|
| Mercury | quick blink |
| Venus | tiny cheek highlight |
| Earth | small cloud moves 3 to 5 px |
| Mars | face tilts 2 degrees |
| Jupiter | one stripe shifts subtly |
| Saturn | ring rocks 2 to 3 degrees |
| Uranus | ring rotates slightly |
| Neptune | faint scribble shimmer |

Do not create arcade-style animations.

---

# 31. First-Time Navigation Guidance

Some users may not immediately understand that planets are links.

Use a single understated hint after the intro:

```text
Explore a planet
```

It can appear near Earth with a hand-drawn arrow.

Behavior:

- fade in after ~1.8s
- disappear after first planet hover or pointer interaction
- store dismissal in session storage

Do not add a tutorial modal.

---

# 32. Optional Secret Interaction

Add only after core experience is complete.

Examples:

- Clicking the satellite reveals a tiny “currently exploring” note.
- Clicking a star cluster reveals a personal easter egg.
- Pluto leads to archive / notes.

The secret must never block primary navigation.

---

# 33. Testing Matrix

Test at minimum:

```text
1440 x 1000 Chrome
1920 x 1080 Chrome
1366 x 768 Chrome
1280 x 800 Safari equivalent
1024 x 1366 iPad portrait
834 x 1194 iPad portrait
430 x 932 mobile
390 x 844 mobile
360 x 800 mobile
```

Input modes:

- mouse
- trackpad
- keyboard only
- touch
- reduced motion

---

# 34. QA Checklist

## Visual

- [ ] Sun is visually dominant and cropped from left edge.
- [ ] Planet layout resembles the supplied composition rather than a standard astronomy diagram.
- [ ] Orbit lines are hand-drawn and diagonally sweeping.
- [ ] Black star field feels textured but not noisy.
- [ ] Paper frame is visible.
- [ ] Planet surfaces visibly read as crayon/paper.
- [ ] Faces are simple and charming.
- [ ] Saturn ring feels integrated, not pasted on.
- [ ] Asteroid belt curves through lower-right area.
- [ ] Satellite and meteor are present but secondary.

## Motion

- [ ] No orbit loop jump.
- [ ] No planet teleports when hovered.
- [ ] Planet labels remain attached to moving planets.
- [ ] Hover scales do not collide with nearby planets.
- [ ] Face remains mostly upright while orbiting.
- [ ] Meteor does not loop too frequently.
- [ ] Star motion is sparse.
- [ ] Reduced-motion mode disables continuous movement.

## Navigation

- [ ] Every planet links to correct route.
- [ ] Browser back works.
- [ ] Deep links work.
- [ ] Planet hit targets are large enough.
- [ ] Keyboard focus is visible.
- [ ] Touch interaction does not depend on hover.

## Performance

- [ ] No major CPU spike from SVG turbulence.
- [ ] No console warnings.
- [ ] No orphaned animation timelines after route changes.
- [ ] Tab-hidden state pauses nonessential loops.

---

# 35. Definition of Done

The project is complete only when all of the following are true:

1. The landing page can be understood visually before reading any text.
2. A screenshot of the static first frame strongly resembles the composition and spirit of the reference.
3. All planets have authentic hand-drawn SVG texture.
4. Each planet continuously follows its own orbit smoothly.
5. The solar system never looks mechanically synchronized.
6. Every planet is a usable portfolio navigation link.
7. Hover/focus interactions feel responsive without stopping the universe.
8. Environmental motion supports the world instead of distracting from it.
9. Mobile has a deliberate recomposed layout.
10. Reduced motion remains beautiful and fully navigable.
11. Inner routes retain a visual connection to their planet.
12. The project contains no raster planet artwork and no photorealistic 3D solar-system assets.

---

# 36. Codex Build Order

Codex should follow this exact order and not skip ahead:

```text
STEP 1  Build route shell and data model
STEP 2  Build static scene coordinate system
STEP 3  Build paper frame and star field
STEP 4  Build orbit paths
STEP 5  Integrate SVG art from art.md
STEP 6  Tune static poster composition
STEP 7  Add orbital movement
STEP 8  Add hover/focus navigation
STEP 9  Add route transitions
STEP 10 Add environmental motion
STEP 11 Build responsive layouts
STEP 12 Add reduced-motion behavior
STEP 13 Performance optimization
STEP 14 Cross-device QA
STEP 15 Final visual polish
```

Do not begin decorative animation before Step 6 is visually approved.

The static composition is the foundation of this project.

---

# 37. Final Instruction to Codex

Treat the supplied reference as a composition and material reference, not as something to loosely reinterpret.

Preserve:

- large left-edge Sun
- sweeping hand-drawn orbit structure
- unevenly distributed planets
- black textured paper space
- cream outer paper
- small satellite
- meteor
- asteroid belt
- simple faces
- crayon/pastel texture
- handmade imperfection

Then add modern interaction discipline:

- smooth orbital motion
- semantic navigation
- responsive composition
- GSAP micro-motion
- route transitions
- accessibility
- performance

The final result should look hand-made and behave professionally.
