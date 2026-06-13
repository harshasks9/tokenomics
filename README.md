# WealthAI Tokenomics Showcase

CEO-facing sales-enablement demo for Google Cloud sellers. Proves the economics of a **tiered model architecture** (Claude Opus + Gemini Flash) versus an all-frontier-model approach across an app's lifecycle: **Build → Run → Extend**.

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

## Architecture

Single-page Next.js 14 app with:
- **5 interactive scenario sections** + summary dashboard
- **Sticky left nav** stepper for presenter mode
- **Live sliders** that recompute costs in real-time
- **Animated visualizations**: Recharts charts, Framer Motion race lanes & count-ups
- **Zero runtime API calls** — all data is pre-seeded for instant demos

## Where to Edit Pricing

All cost figures flow from a single config module:

```
src/lib/pricing.ts    ← Model prices (per 1M tokens)
src/lib/scenarios.ts  ← Scenario parameters + derived cost functions
src/lib/content.ts    ← Seeded demo content (tasks, Q&A, statements, agent trace)
```

### Current Pricing (June 2026 list rates)

| Model | Input / 1M tokens | Output / 1M tokens |
|-------|-------------------|-------------------|
| Claude Opus 4.8 | $5.00 | $25.00 |
| Gemini 3.5 Flash | $1.50 | $9.00 |
| Gemini 3.1 Flash-Lite | $0.25 | $1.50 |

## Headline Savings (at default slider values)

| Scenario | All-Frontier | Tiered | Savings |
|----------|-------------|--------|---------|
| S1 Build (6mo) | $4,388 | $2,633 | ~40% |
| S2 In-App (annual) | $1.2M | $359K | ~70% |
| S3 Multimodal (per interaction) | $0.085 | $0.063 | ~26% |
| S4 Agent (annual @50K/night) | $15.9M | $7.2M | ~55% |

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Recharts (bar/donut/stacked charts)
- Framer Motion (animations)
- lucide-react (icons)

## Deployment

Deployed to Vercel. Pushes to `main` auto-deploy.
