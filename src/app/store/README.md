# The Department Store for AI

A single-page microsite that explains the Google Cloud AI platform to CEOs, CIOs
and CTOs through one sustained analogy: the platform is a modern department
store. The visitor walks through the building by scrolling.

Live at **https://store.aitokenomics.app** (route `/store` in this repo).

## Run

```bash
npm install
npm run dev
# open http://localhost:3000/store
```

## Deploy

The site deploys automatically from `main` via Vercel. The repo's study
workflow (`AGENTS.md`) merges a `study/*` branch into `main`; Vercel then builds
and serves the route. The subdomain is routed in two places, both appended
(never rewritten) for this site:

- `src/proxy.ts` — host block for `store.aitokenomics.app` → `/store`
- `vercel.json` — host rewrite for the same subdomain

The subdomain itself has to be attached to the Vercel project once
(`vercel domains add store.aitokenomics.app` or the dashboard); there is no
wildcard domain.

## Where things live

| Path | What |
| --- | --- |
| `src/app/store/layout.tsx` | Route metadata, Fraunces via `next/font`, imports `store.css` |
| `src/app/store/store.css` | The whole design system (`ds-` prefix): materials, chrome, scene engine, every scene |
| `src/lib/store/copy.ts` | Every line of copy, verbatim from the brief |
| `src/components/store/Site.tsx` | Composes the walk, mounts the engine |
| `src/components/store/engine.tsx` | Scroll engine: writes `--p` per scene, tracks the active floor |
| `src/components/store/Objects.tsx` | `SceneObject` (a physical thing with a hang-tag), `HangTag`, `TagList` |
| `src/components/store/props.tsx` | SVG props: desks, racks, mannequin, wardrobe, register, fitting rooms, bays… |
| `src/components/store/rooms.tsx` | SVG rooms and backgrounds per scene, atrium rings, escalators |
| `src/components/store/facade.tsx` | The night façade for the hero |
| `src/components/store/CrossSection.tsx` | The 720×900 building cross-section with eight focusable targets |
| `src/components/store/tableaus.tsx` | Window-display tableaus and the three shops across the street |
| `src/components/store/scenes/*` | The seventeen scenes in walking order |

## How the walk works

- Each scene is a `[data-scene]` section taller than the viewport with a
  100vh `position: sticky` stage. The engine computes progress 0→1 for every
  scene on scroll (one `requestAnimationFrame` per scroll event) and writes it
  as a `--p` custom property on the section.
- All motion is CSS: `transform` and `opacity` expressed as `calc()` of `--p`.
  Nothing else animates on scroll. The revolving door uses CSS `sin()`/`cos()`
  on `--p` for real rotation; the camera pushes through the door and out of the
  exit with `translate` + `scale` around the doorway.
- Every scene composes inside a 16:9 "frame" (1600×900 coordinate system) that
  covers the stage. SVG layers and HTML signage share those coordinates, so
  signage stays real, selectable text positioned exactly on the drawing.
  Signage inside the frame is sized in container-query units so it scales with
  the room.
- Objects are `role="button"` elements. Hover previews the hang-tag (pure CSS,
  so it works without JavaScript); click or Enter locks it open; Escape closes;
  only one tag is open per scene.

## Decisions the brief did not specify

1. **Repo, not a standalone project.** Built as a route (`/store`) inside the
   existing `tokenomics` Next.js app and served on `store.aitokenomics.app`,
   matching every other microsite here. No `output: 'export'` was added because
   the shared app uses a proxy and API routes; the page itself is fully static
   (no data fetching, no server code).
2. **Scroll engine.** A single rAF-driven `--p` engine was used everywhere
   instead of the CSS Scroll-Driven Animations API with a fallback. One code
   path, identical behaviour in every browser, and the CSS stays declarative.
   No Framer Motion or GSAP is used on this route.
3. **Reduced motion and narrow screens share one static layout.** Under
   `prefers-reduced-motion` or below 768px, stages stop being sticky, the frame
   renders as a plain illustration, the floor copy moves into normal flow
   beneath it, and every hang-tag is listed under the scene. The engine keeps
   tracking the active floor for the directory and lift panel but writes no
   progress. Without JavaScript the same stacked tag lists appear and every
   scene renders in its resting state, so the page reads top to bottom.
4. **Ultra-wide screens.** The 16:9 frame is capped at 213vh wide so a 21:9
   monitor crops at most ten percent of the room top and bottom; the stage
   background fills the sides.
5. **Fonts.** Fraunces (display) via `next/font` and Inter (body), which the
   root stylesheet already loads. No third font.
6. **Grain.** One tiled `feTurbulence` SVG data-URI per stage, multiply on
   daylight scenes and screen at night, instead of a full-viewport filter.
7. **Hero façade.** Drawn as its own front elevation (`facade.tsx`) rather
   than reusing the cross-section unlit; a cut-through reads wrong from the
   street. The building sits right of centre so the copy stands on the dark
   pavement in front of the neighbour.
8. **Floor numbering.** The brief numbers "Your Wardrobe" as Floor 3 and titles
   its panel "The Ground Floor: Your Wardrobe". The signage keeps the verbatim
   title; the lift panel and directory use 3.
9. **Model floor mapping.** Racks map to the brief's rows: GEMINI → premium
   house brand; GEMMA → own-label; CLAUDE and MISTRAL → partner brands; LLAMA,
   QWEN, DEEPSEEK → open brands; the five counters → specialist boutiques; the
   desk → bring-your-own; the overhead MODEL GARDEN sign → the store floor.
   Spotlights come on left to right as the visitor scrolls in.
10. **Escalators.** Each is its own 140vh scene (40vh of travel) rather than
    part of the floor scene, so the hand-off between light temperatures is a
    clean cross-fade. Escalators are hidden in the static layout.
11. **Receipt extras.** The receipt has a header (store name, customer, day), a
    "Store rebuilt · 0 times" total line and a barcode as receipt furniture. No
    other copy was added.
12. **Awnings.** The three shops across the street carry the one-word column
    names from the comparison table (Boutique, Marketplace, Warehouse) on
    their awnings; the full archetype titles sit beneath.
13. **Lift panel labels** for the non-floor scenes (ST for the street, G for
    ground, R for the receipt, L for the lectern) are an invention.
14. **Robots.** The route is `noindex`, like the other field microsites here.
15. **Homepage tile.** A tile was appended to the repo homepage, per the
    repo's convention.

## Acceptance checks performed

- All seventeen scenes present in order; copy is imported from one module and
  used verbatim.
- Keyboard: Tab to an object, Enter opens the tag (`aria-expanded`), Escape
  closes. Hover previews. One tag per scene. Cross-section targets scroll to
  their floors and light the directory.
- Copy talk track shows "Copied" for two seconds; Practice toggle counts.
- Reduced motion, no-JS and 390px mobile renders checked in headless Chrome.
- Production build passes; the route appears in the build output.
- JS budget: the store's own code is roughly 30 KB gzipped. The page ships
  about 215 KB gzipped in total because it inherits this repo's shared
  Next.js and React runtime chunks, which are outside this route's control.
  A standalone export of the same code would sit inside the 150 KB target.
