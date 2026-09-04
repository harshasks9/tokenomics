# The Department Store for AI

A single-page microsite that explains the Google Cloud AI platform to CEOs,
CIOs and CTOs through one sustained analogy: the platform is a modern
department store. A concierge walks beside the visitor; every floor is an
exhibit with a numbered legend.

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

The subdomain is attached to the Vercel project; there is no wildcard domain.

## Where things live

| Path | What |
| --- | --- |
| `src/app/store/layout.tsx` | Route metadata, Fraunces via `next/font`, imports `store.css` |
| `src/app/store/store.css` | The design system (`ds-` prefix): chrome, exhibit layout, cards, every scene |
| `src/lib/store/copy.ts` | Every line of copy, verbatim from the narrative, in walking order |
| `src/components/store/Site.tsx` | Composes the walk, mounts the scroll engine |
| `src/components/store/engine.tsx` | Writes `--p` per scene, tracks the active stop |
| `src/components/store/Chrome.tsx` | Top rail with progress line and directory; the building stack in each floor header |
| `src/components/store/Objects.tsx` | `Exhibit` context, `Hotspot` (object + numbered callout), `Card`, `Narrator` |
| `src/components/store/props.tsx` | SVG props: desks, racks, mannequin, wardrobe, register, fitting rooms, bays… |
| `src/components/store/rooms.tsx` | SVG rooms, atrium rings, escalator |
| `src/components/store/facade.tsx` | The night façade for the hero |
| `src/components/store/CrossSection.tsx` | The building cross-section with eight linked targets |
| `src/components/store/tableaus.tsx` | Window-display tableaus and the three shops across the street |
| `src/components/store/scenes/*` | The scenes in walking order |

## How the walk is organised

Fourteen stops, always visible in the top rail ("Stop 5 of 14 · 4 · The Model
Floor") and in a directory panel split into the building and the street:

1. Entrance (pavement) · 2. Atrium · 3–8. Floors 6 to 1 · 9. The Walls ·
   10. The Doors · 11. Your Receipt · 12. Window Displays · 13. Across the
   Street · 14. Talk Track.

Every floor is one exhibit:

- **Room above.** The illustration, with a numbered brass callout on each
  object and small verbatim signage (GEMINI ENTERPRISE — ASK HERE, One suit.
  Several brands. Made here., SAME CHECKOUT, EVERY BRAND. THIS TILL., TPU · GPU).
- **Header plate.** Floor number, name, sub-banner, and a small building stack
  with the current floor lit, so the visitor always knows where they stand.
- **Legend beneath.** The concierge's line on the left; one card per object on
  the right, numbered to match the callouts: the object, the Google Cloud
  capability, and what it means. Hovering or focusing an object lights its card
  and vice versa; clicking pins it. Nothing is hidden behind a hover.
- **Next strip.** The concierge's line at the down escalator, as a link to the
  next floor.

Scrolling a floor reveals the cards and switches on each object's light in
sequence; the page reads fully by scrolling alone. The model floor groups the
racks with brackets (House brand · Own-label · Partner brand · Open-weights)
and hangs a SAME CHECKOUT tag on every rack.

## How it is built

- Each scene is a `[data-scene]` section taller than the viewport with a 100vh
  `position: sticky` stage. The engine writes progress 0→1 as `--p`; all
  motion is CSS `transform`/`opacity` computed from it. The revolving door
  uses CSS `sin()`/`cos()`; the camera pushes through the door and out of the
  exit.
- Rooms compose inside a 16:9 frame (1600×900 units) that covers the room box,
  so SVG layers and HTML signage share coordinates. Signage is sized in
  container-query units so it scales with the room.
- Below 1024px, and under `prefers-reduced-motion`, everything stacks: header,
  room, concierge, cards, next. Without JavaScript the same stacked content
  renders in order.

## Decisions the narrative did not specify

1. **Exhibit layout instead of hang-tags.** The narrative places copy on
   hang-tags; this build shows every hang-tag as a numbered card beneath the
   room so an executive can read a floor without hovering. The tag copy is
   unchanged.
2. **One escalator.** The ride up from the atrium is kept as a scene (it
   carries the mid-ride line). The down escalators between floors were replaced
   by the "next" strip carrying each floor's escalator line, which shortens the
   walk by about a third.
3. **Directory and stack instead of a lift panel.** The fourteen-stop
   directory lives in a panel behind a Directory button; the floor indicator is
   a small building stack inside each floor header rather than a floating
   panel, which had collided with copy.
4. **Doors header.** The Doors floor has no sub-banner in the narrative; the
   exit-door lettering (Open APIs · Open weights · A2A · MCP) is used.
5. **Walls "next".** The walls scene has no narrator hand-off in the
   narrative, so its next strip carries only the destination.
6. **Stop labels.** Eyebrows on the street scenes ("Stop 11 · One customer's
   first day", "Stop 12 · Six reasons", "Stop 13 · Four ways to build",
   "Stop 14 · Say it in ninety seconds") are navigation labels, not narrative.
7. **Practice toggle.** Kept from the original brief beside "Copy talk track".
8. **Repo, fonts, robots, grain, ultra-wide.** Built as a route in the shared
   Next.js app (`noindex`, like the other field microsites); Fraunces plus the
   root stylesheet's Inter; one tiled `feTurbulence` grain per stage; the
   viewport frame is capped at 213vh wide for ultra-wide monitors.

## Checks performed

- All fourteen stops present in order; copy imported from one module.
- Keyboard: Tab to an object focuses it and lights its card; Enter pins;
  Escape releases. Hovering a card lights every object it describes (all four
  open-weights racks). Cross-section targets are real links. Directory opens,
  lists fourteen stops, closes on navigation.
- Copy talk track shows "Copied" for two seconds; Practice counts.
- No-JS, reduced motion and 390px mobile renders checked in headless Chrome.
- Production build passes; the route appears in the build output.
- JS budget: the store's own code is roughly 30 KB gzipped; the page ships
  about 215 KB gzipped in total because it inherits the repo's shared Next.js
  and React runtime, which is outside this route's control.
