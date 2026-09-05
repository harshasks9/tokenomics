# The AI Department Store

A single-page executive microsite: Google Cloud as the department store for
enterprise AI. One idea, fourteen sections, one hero interaction.

> Don't bet on the winning model. Pick the right store.

Live at **https://store.aitokenomics.app** (route `/store` in this repo).

## Run

```bash
npm install
npm run dev
# open http://localhost:3000/store
```

## Deploy

Deploys automatically from `main` via Vercel (repo study workflow in
`AGENTS.md`). The subdomain is routed in `src/proxy.ts` (host block) and
`vercel.json` (host rewrite) and is attached to the Vercel project.

## Structure

| Path | What |
| --- | --- |
| `src/lib/store/data.ts` | All structured content: floors, model categories, use cases, journey steps, archetypes, copy, sources |
| `src/app/store/store.css` | Design tokens and primitives (`ds-` prefix); Tailwind utilities for layout |
| `src/components/store/Building.tsx` | The architectural cutaway (outline / solid / x-ray), reused in hero, explorer, governance, journey and final |
| `src/components/store/Nav.tsx` | Top bar with progress and sections menu; sticky building navigator |
| `src/components/store/Hero.tsx` … `FinalCTA.tsx` | One component per section, in page order |
| `src/components/store/ModelSwitcher.tsx` | The model-switch interaction; exports `ArchitectureStack`, reused in the journey's final step |
| `src/components/store/SourcesDrawer.tsx` | Sources & methodology drawer |

Page order: Hero · The idea · Explore the store · Model Garden · Model switch ·
Build agents · Data · Openness · Governance (x-ray) · Operations ·
Infrastructure (+ stores within the store) · Archetypes · Customer journey ·
Final message.

## Positioning discipline

- The store is the operating model: Gemini Enterprise, Gemini Enterprise
  Agent Platform (formerly Vertex AI), Data Cloud, AI Hypercomputer and the
  ecosystem. Model Garden is the model floor inside it, not the store.
- Product names follow current official Google Cloud pages and documentation
  (September 2026): Agent Garden, Agent Studio, Agent Development Kit, Agent
  Runtime, Agent Identity, Agent Gateway, Model Armor, evaluation and
  observability, Model Garden with 200+ models.
- Model examples are families ("Gemini (latest)", "Anthropic Claude", "Gemma",
  "Llama"), never versions. No statistics, benchmarks, prices or competitor
  names. Deployment differences and the training caveat are stated on the page.
- The sources drawer lists the official pages used and the methodology.

## Decisions the brief left open

1. **Interaction model.** Everything is visible on scroll; interactions add
   depth (floor detail, model switch, journey stepper, archetype assembly).
2. **Mobile.** The building explorer becomes an accordion of floors; the
   navigator hides below 1180px in favour of a sections menu.
3. **Use cases.** Six use cases, each with three model options drawn from the
   categories Model Garden carries. "Image and video" offers Google specialist
   models only, to avoid implying partner or open video models are available.
4. **Agent Garden.** Cards show illustrative pattern categories, not a product
   list, and say so.
5. **Journey step 11.** Reuses the architecture diagram: only the model chip is
   replaced; the platform and layers carry an "Unchanged" mark.
6. **Fonts and colour.** Inter only. Colour marks layers (Google blue,
   partner amber, open green, agents violet, data teal, security red,
   infrastructure indigo); backgrounds stay neutral; governance and
   infrastructure sections go dark.
7. **Practice toggle and talk track** from the earlier brief were dropped; this
   version ends on the final message.

## Checks

- Keyboard: floors, pills, steps, drawer and menu are buttons or links with
  visible focus; the drawer traps Escape and restores scroll.
- Reduced motion: every animation is skipped via `useReducedMotion` and CSS.
- Production build passes; the route appears in the build output.
