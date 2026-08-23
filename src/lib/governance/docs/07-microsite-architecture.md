# Deliverable 7 — Microsite architecture

## Information architecture

Ten numbered sections, one persistent top nav, every page usable standalone in a
customer meeting:

| # | Route | Purpose | PRD section |
|---|---|---|---|
| 01 | `/governance` | The question, the gap in four numbers, the stack in 30 seconds, the thesis, three entry doors, seller how-to | §10.01 |
| 02 | `/governance/why-now` | Three eras, seven broken assumptions, regulatory clock | §10.02 |
| 03 | `/governance/stack` + `/stack/[layer]` | Interactive stack + 7 layer deep-dives with L1/L2/L3 depth tabs, controls tables, enforcement points, Google band, talk track, discovery | §10.03, §6 |
| 04 | `/governance/personas` + `/personas/[persona]` | 9 role views: accountabilities, nightmares, decisions, questions, first stops | §10.04 |
| 05 | `/governance/risks` | 12-risk explorer filtered by layer; incidents, controls, capabilities per risk | §10.05 |
| 06 | `/governance/architectures` | 9 deployment patterns with governance profiles and Google notes | §10.06 |
| 07 | `/governance/vendors` | Vendor philosophies + 7 challenge-led comparisons + questions to ask vendors | §10.07, §7 |
| 08 | `/governance/google` | Naming table, interactive capability map (filter by layer), 4 reference architectures, honest gaps, compliance anchors | §10.08, §8 |
| 09 | `/governance/examples` | 6 shared patterns, filterable library (lens + industry), cautionary-tales table | §10.09, §9 |
| 10 | `/governance/readiness` | 14-question diagnostic (2/layer, 4 maturity levels) → per-layer profile, priorities, Google-team topics; browser-only, printable | §10.10 |
| — | `/governance/sources` | Claim-type legend + grouped source register + methodology | §13 |

## Interaction model

- **Progressive depth** is a UI primitive: `DepthTabs` (L1 Executive / L2 Practitioner /
  L3 Technical) on every layer page; all three panels are server-rendered so switching
  is instant.
- **Cross-linking discipline:** layers ↔ risks ↔ incidents ↔ capabilities ↔ examples all
  share the same ids; a vitest integrity suite fails the build content if any reference
  dangles.
- **Client islands only where interaction demands:** stack explorer, risk explorer,
  capability map, example library, readiness quiz, nav active state, expanders.
  Everything else is static server rendering; all routes prerender (SSG).
- **Seller blocks are standardized:** every major page ends with "In the room —
  discussion points" (talk track + one serif insight) and "Questions to ask your
  organization" (discovery). Google content always appears in a clearly-marked
  "How Google Cloud approaches this" band *after* the neutral treatment.

## Design system

Scoped under `.gov-root` (`src/app/governance/governance.css`), following the repo's
convention of self-contained site design systems. Editorial-consulting aesthetic: paper
ground, ink text, Source Serif 4 for judgment lines and display headings, Inter for UI
and evidence; one accent (Google blue) plus a fixed hue per layer (indigo/teal/violet/
blue/amber/red/green) applied via `data-hue` attributes; numbered kickers; print styles
for in-room handouts; `prefers-reduced-motion`-safe (CSS transitions only, no animation
library).

## Content system

All content lives as typed data in `src/lib/governance/data/*.ts` (layers, risks,
incidents, personas, architectures, vendors + challenges, Google capabilities, examples,
readiness, sources) with types in `types.ts`. Pages are thin renderers. Updating the
site = editing data files; `integrity.test.ts` guards referential consistency.

## Routing & deployment

Served at `/governance` on the main host and at `governance.aitokenomics.app` via
appended host rules in `src/proxy.ts` and `vercel.json` (repo pattern). The subdomain is
noindex (X-Robots-Tag + metadata robots), consistent with recent internal microsites.
A tile is appended to the homepage springboard. Deploys with main via Vercel.
