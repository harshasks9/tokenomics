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

Narrative order (customer problem first, platform as proof): Hero · The
customer problem · Think of the best department store in your city (the
analogy and the insight) · Why optionality matters (model switch) · Why this is different
(single-brand store vs department store, Google's differentiation) · The
whole idea in ninety seconds · Map the store to the platform (mapping table + building
explorer) · Customer journey · then proof: Model Garden · Build agents · Data ·
Openness · Governance (x-ray) · Operations · Infrastructure · Four archetypes ·
Final message.

The page is written for the customer, not for a seller: no named retailers,
no store picker, no talk-track framing. The department store is a generic,
everyday analogy and no retailer is named, implied or endorsed.

## Positioning discipline

- The store is the operating model: Gemini Enterprise, Gemini Enterprise
  Agent Platform (formerly Vertex AI), Data Cloud, AI Hypercomputer and the
  ecosystem. Model Garden is the model floor inside it, not the store.
- Product names follow current official Google Cloud pages and documentation
  (September 2026): Agent Garden, Agent Studio, Agent Development Kit, Agent
  Runtime, Agent Identity, Agent Gateway, Model Armor, evaluation and
  observability, Model Garden with 200+ models.
- Models are named specifically and were verified against the Agent Platform
  model documentation on 5 September 2026: Google (Gemini 3.1 Pro, 3.8 Flash,
  3.5 Flash-Lite, 3.1 Flash Image, Veo 3.1, Lyria 3, Gemini Omni 1.1 Flash,
  Gemini Embedding 2, Gemma 4), partners as managed APIs (Anthropic Claude
  Opus 5, Fable 5.1, Sonnet 5, Haiku 4.5; xAI Grok 4.6, 4.20, 4.1 Fast;
  Mistral Medium 3, Small 3.1, Codestral 2, OCR; AI21 Jamba 1.5) and open
  models managed or self-deployed (Llama 4 Maverick and Scout, DeepSeek-V3.2 and
  OCR, Qwen3 235B, Qwen3 Coder, Qwen3-Next-80B, gpt-oss 120B and 20B, GLM 5.2,
  Kimi K2 Thinking, MiniMax M2). Preview status is shown where the docs show
  it. No statistics, benchmarks, prices or competitor names.
- Recency rule: only models released within the last twelve months (September
  2025 onward) are featured, each with its release month. Older families
  (Llama 4, Qwen3 235B, Qwen3 Coder, gpt-oss, Mistral Medium 3, Small 3.1 and
  OCR, Jamba 1.5) remain on the shelf and are named in a note but not featured.
- The model floor groups every shelf into four tiers: Frontier, Workhorse,
  Efficient, Specialist. The tiers are an editorial grouping derived from each
  model's official description (for example, Gemini 3.8 Flash is documented as
  the "most intelligent workhorse model"; Claude Haiku 4.5 as the speed-and-cost
  model for high-volume experiences), not a Google classification, and the
  page says so. Premium is a tier, not a brand: each shelf has a frontier
  option.
- Deployment differences and the training caveat are stated on the page.
- The sources drawer lists the official pages used and the methodology.

## Decisions the brief left open

1. **Interaction model.** Everything is visible on scroll; interactions add
   depth (floor detail, model switch, journey stepper, archetype assembly).
2. **Mobile.** The building explorer becomes an accordion of floors; the
   navigator hides below 1180px in favour of a sections menu.
3. **Use cases.** Six use cases, each with three specific models and a one-line
   rationale for the tier chosen. "Image and video" offers Google specialist
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
