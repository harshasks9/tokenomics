# AI Tokenomics — Multi-Industry Demo

iOS springboard launcher for industry-specific tokenomics demos. Proves the economics of a **tiered model architecture** across a 5-model ladder (Gemini 3.1 Flash-Lite → Gemini 3.5 Flash → Gemini 3.1 Pro → Claude Sonnet 4.6 → Claude Opus 4.8) versus single-model baselines, across an app's lifecycle: **Build → Run → Extend**.

## Routes

| Route | Industry | Status |
|-------|----------|--------|
| `/` | iOS springboard homepage | Live |
| `/wealthai` | WealthAI — Wealth Management | Live |
| `/shopos` | ShopOS — Retail Commerce | Live |
| `/healthcare` | Healthcare — Clinical AI | Coming Soon |

## Quick Start

```bash
npm install
npm run dev      # → http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/
    page.tsx              ← iOS springboard homepage
    wealthai/page.tsx     ← WealthAI industry experience
    shopos/page.tsx       ← ShopOS industry experience
    healthcare/page.tsx   ← Coming Soon placeholder
  lib/
    pricing.ts            ← Shared pricing engine (single source of truth)
    scenarios.ts          ← WealthAI scenario parameters + cost functions
    content.ts            ← WealthAI seeded content
    industries/
      shopos.ts           ← ShopOS data + cost functions
  components/
    Hero.tsx, BuildScenario.tsx …   ← WealthAI scenario components
    shopos/
      ShopHero.tsx, ShopBuildScenario.tsx …  ← ShopOS scenario components
```

## Adding a New Industry

1. Drop a config file in `src/lib/industries/<id>.ts` with scenario parameters and cost functions.
2. Create `src/app/<id>/page.tsx` with your industry page (see `shopos/page.tsx` for the pattern).
3. Add scenario components in `src/components/<id>/`.
4. Add a tile to the `APPS` array in `src/app/page.tsx`.

## Where Pricing Lives

**Single source of truth:** `src/lib/pricing.ts`

All dollar figures across all industries are computed via `callCost(model, inTok, outTok)` — never hard-coded.

### Current Model Pricing (June 2026 list rates)

| Model | Input / 1M tokens | Output / 1M tokens |
|-------|-------------------|-------------------|
| Claude Opus 4.8 | $5.00 | $25.00 |
| Claude Sonnet 4.6 | $3.00 | $15.00 |
| Gemini 3.1 Pro | $2.00 | $12.00 |
| Gemini 3.5 Flash | $1.50 | $9.00 |
| Gemini 3.1 Flash-Lite | $0.25 | $1.50 |

## ShopOS Headline Savings (at default slider values)

| Scenario | All-Opus | Tiered | Savings |
|----------|----------|--------|---------|
| S1 Build (6mo, 12 devs) | ~$11.2K | ~$6.9K | ~38% |
| S2 Assistant (annual, 15M/mo) | ~$4.5M | ~$970K | ~78% |
| S3 Visual Search (annual, 8M/yr) | ~$560K | ~$312K | ~44% |
| S4 Merch Agent (annual, 5K SKUs/night) | ~$1.49M | ~$688K | ~54% |

## WealthAI Headline Savings

| Scenario | All-Frontier | Tiered | Savings |
|----------|-------------|--------|---------|
| S1 Build (6mo) | $4,388 | $2,633 | ~40% |
| S2 In-App (annual) | $1.2M | $359K | ~70% |
| S3 Multimodal (per interaction) | $0.085 | $0.063 | ~26% |
| S4 Agent (annual @50K/night) | $15.9M | $7.2M | ~55% |

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Recharts (bar/donut charts)
- Framer Motion (animations, tap feedback, stagger-in)
- lucide-react (icons)

## Deployment

Deployed to Vercel. Pushes to `main` auto-deploy.
