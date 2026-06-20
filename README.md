# AI Tokenomics — Multi-Industry Demo

Interactive scenarios built around one thesis: **Opus is superior for the hardest work, but you do not need Opus for everything.** Keep Opus on architecture, nuanced judgment, planning, and review. Route bounded execution to Gemini 3.5 Flash or Gemini 3.1 Flash-Lite.

## Japanese mirror

The Japanese site uses the same deployment and route tree as the English site:

- English: `https://aitokenomics.app`
- Japanese: `https://jp.aitokenomics.app`

The Japanese host translates rendered and dynamically added interface content, caches translations in the browser, preserves product and model names, and keeps relative navigation on the same host. `src/proxy.ts` publishes the appropriate `Content-Language` and per-path alternate-language headers.

For local testing, use `http://jp.localhost:3000` or append `?lang=ja` to a local URL. The Japanese host can be changed with `NEXT_PUBLIC_JAPANESE_HOST`.

Each scenario compares the recommended **Opus + Gemini** route with an **Opus + Sonnet** baseline and relevant single-model deployments such as All Opus, All Sonnet, or All Flash.

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

## Options Wheel Screener

The options app is a read-only cash-secured-put "wheel" screener at `/options` and `https://options.aitokenomics.app`.
It ranks candidates only. It never places, sizes, routes, or simulates trades, and it never integrates with a broker.

### Environment variables

Server-side only; do not prefix these with `NEXT_PUBLIC_`.

| Variable | Required | Purpose |
|----------|----------|---------|
| `APP_PASSWORD` | Production | Cookie-based access gate for `/options` and `options.aitokenomics.app`. |
| `FMP_API_KEY` | Live mode | Financial Modeling Prep universe, quotes, fundamentals, and historical closes. |
| `POLYGON_API_KEY` | Live mode | Polygon/Massive delayed option-chain snapshots. Options Starter 15-minute delayed data is sufficient. |
| `ANTHROPIC_API_KEY` | Optional | Enables AI judgment scoring on manual refresh. Defaults to neutral judgment if absent or on error. |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Recommended | Vercel KV / Upstash Redis REST cache for daily screened results and manual refresh rate limiting. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Alternative | Same as above when using raw Upstash Redis env names. |
| `CRON_SECRET` | Recommended | Protects `/api/options/cron`; Vercel Cron sends `Authorization: Bearer $CRON_SECRET` when configured. |

If `FMP_API_KEY` or `POLYGON_API_KEY` is absent, the app runs in mock mode using the built-in fixtures from `src/lib/options/fixtures.ts`.
This keeps the UI demoable without paid keys and reproduces the acceptance buckets in tests.

### Data stack and cost notes

- FMP endpoints: stock screener, quote, key metrics TTM, ratios TTM, annual income statements, enterprise values, and historical daily closes.
- Polygon endpoint: `/v3/snapshot/options/{ticker}` for delayed put-chain snapshots.
- Expected monthly data cost: roughly `$29` for Polygon Options Starter plus about `$20-50` for an FMP tier, depending on plan and usage.
- API cost control: cheap stock gates run before option-chain calls; a Vercel Cron job refreshes once daily at `21:30 UTC`; manual refresh is server-rate-limited to once per 15 minutes.

### Caveats

- `iv_rank*` is a realized-volatility proxy computed from one year of daily closes, not true IV rank. Upgrade by replacing it with a real one-year ATM-IV series from Polygon historical chains or a provider such as tastytrade.
- 40% of the score is judgment. Judgment defaults to neutral scores until reviewed manually or refreshed with optional AI judgment. This is not investment advice.

### Swapping data providers

Provider-specific code is isolated in `src/lib/options/live-data.ts`.
Keep the normalized `StockProfile`, `Fundamentals`, `OptionContract`, and daily close shapes stable, then replace the FMP/Polygon fetchers with another provider.
The scorer, UI, cache, tests, and route handlers should not need provider-specific changes.

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

| Scenario | Opus + Sonnet | Opus + Gemini | Savings |
|----------|----------|--------|---------|
| S1 Build (6mo, 12 devs) | ~$8.0K | ~$4.7K | ~41% |
| S2 Assistant (annual, 15M/mo) | ~$2.92M | ~$1.09M | ~62% |
| S3 Visual Search (annual, 8M/yr) | ~$560K | ~$416K | ~26% |
| S4 Merch Agent (annual, 5K SKUs/night) | ~$1.11M | ~$747K | ~33% |

## WealthAI Headline Savings

| Scenario | Opus + Sonnet | Opus + Gemini | Savings |
|----------|-------------|--------|---------|
| S1 Build (6mo) | ~$3.3K | ~$2.6K | ~21% |
| S2 In-App (annual) | ~$778K | ~$294K | ~62% |
| S3 Multimodal (annual, 2M/yr) | ~$170K | ~$127K | ~25% |
| S4 Agent (annual @50K/night) | ~$10.7M | ~$7.2M | ~33% |

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Recharts (bar/donut charts)
- Framer Motion (animations, tap feedback, stagger-in)
- lucide-react (icons)

## Deployment

Deployed to Vercel. Pushes to `main` auto-deploy.
