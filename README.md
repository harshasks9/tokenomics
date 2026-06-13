# AI Tokenomics - WealthAI and ShopOS

Two industry-specific demonstrations of the same model-routing thesis: use **Claude Opus for difficult reasoning** and **Gemini Flash or Flash-Lite for bounded volume work**, compared with an all-frontier Opus baseline across **Build -> Run -> Extend**.

## Routes

| Route | Industry | Status |
|-------|----------|--------|
| `/` | WealthAI - Wealth Management | Live |
| `/wealthai` | WealthAI route alias | Live |
| `/shopos` | ShopOS - Retail Commerce | Live |
| `/healthcare` | Healthcare placeholder | Coming Soon |

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for WealthAI or `http://localhost:3000/shopos` for ShopOS.

## Production Build

```bash
npm run build
npm start
```

## Pricing

Pricing is defined once in `src/lib/pricing.ts` and all scenario costs are calculated with `callCost(model, inputTokens, outputTokens)`.

| Model | Input / 1M tokens | Output / 1M tokens |
|-------|-------------------|--------------------|
| Claude Opus 4.8 | $5.00 | $25.00 |
| Gemini 3.5 Flash | $1.50 | $9.00 |
| Gemini 3.1 Flash-Lite | $0.25 | $1.50 |

## ShopOS Defaults

| Scenario | All-Frontier | Tiered | Savings |
|----------|--------------|--------|---------|
| Build, 13 sprints and 12 developers | ~$11.9K | ~$8.3K | ~30% |
| Shopping Assistant, 15M queries/month | ~$4.5M/year | ~$972K/year | ~78% |
| Visual Search, 8M interactions/year | ~$560K/year | ~$416K/year | ~26% |
| Merchandising Agent, 5K SKUs/night | ~$1.67M/year | ~$747K/year | ~55% |

Default annual ShopOS savings across Run and Extend are approximately **$4.6M**.

## Structure

```text
src/
  app/
    page.tsx                 WealthAI experience
    shopos/page.tsx          ShopOS experience
  components/
    *.tsx                    WealthAI scenarios
    shopos/*.tsx             ShopOS scenarios
  lib/
    pricing.ts               Shared model pricing
    scenarios.ts             WealthAI economics
    industries/shopos.ts     ShopOS economics and seeded retail content
```

## Tech Stack

- Next.js 16 App Router and TypeScript
- Tailwind CSS v4
- Recharts
- Framer Motion
- Lucide React

## Deployment

The application is deployed on Vercel at `https://aitokenomics.app`.
