# AI Model Pricing Explorer (`/pricing` · pricing.aitokenomics.app)

Compares current AI models on verified token pricing, capabilities and comparable
benchmarks, with a workload cost calculator and a daily-updated pricing news feed.
Answers: *"Which model best fits my workload, and what will it actually cost?"*

## Layout

| Path | Purpose |
|---|---|
| `src/app/pricing/` | Route: `layout.tsx` (metadata, fonts, CSS), `page.tsx`, `pricing.css` (design system, prefix `px-`) |
| `src/components/pricing/` | UI: `Site` (shell + state), `FilterBar`, `PricingBars`, `Calculator`, `CapabilityMatrix`, `Compare`, `Scatter`, `Recommend`, `News`, `Methodology`, `Tooltip` |
| `src/lib/pricing/catalog.ts` | **The data.** Hand-verified model catalog + seeded news. Edit this to update prices/specs. |
| `src/lib/pricing/benchmarks.ts` | Benchmark definitions (source, snapshot date, caveat) |
| `src/lib/pricing/presets.ts` | Providers (palette slots + glyphs), workload presets, tier ramp |
| `src/lib/pricing/calc.ts` | Cost math, formatting, requirement checks |
| `src/lib/pricing/refresh.ts` | Daily refresh: Gemini reads official pricing pages → conservative diff → overrides + news |
| `src/lib/pricing/store.ts` | Snapshot storage (Upstash/Vercel KV REST → local file → memory) |
| `src/lib/pricing/data.ts` | Client hook merging catalog + live snapshot |
| `src/app/api/pricing/route.ts` | `GET` live snapshot (overrides + generated news) |
| `src/app/api/pricing/cron/route.ts` | Daily job (Vercel cron, `CRON_SECRET` bearer); `?force=1` re-runs same day |

## Setup

No extra dependencies. Environment (all optional — the site renders from the catalog without any):

```
GEMINI_API_KEY=            # enables the live daily refresh (url_context tool); same key as /brief
PRICING_GEMINI_MODEL=      # optional override (default gemini-3.5-flash, falls back to BRIEF_GEMINI_MODEL)
PRICING_SOURCES=           # optional comma-separated URLs replacing the default official pricing pages
CRON_SECRET=               # required in production for /api/pricing/cron
KV_REST_API_URL / KV_REST_API_TOKEN   # durable snapshot storage (falls back to data/pricing/*.json locally)
```

The cron is registered in `vercel.json` (`/api/pricing/cron`, daily 02:40 UTC). Trigger manually:

```
curl -H "Authorization: Bearer $CRON_SECRET" "https://pricing.aitokenomics.app/api/pricing/cron?force=1"
```

## Updating data by hand

1. Edit the model entry in `catalog.ts` (prices in USD per 1M tokens, standard tier, first-party unless `thirdPartyPricing`).
2. Bump `lastVerified`, set `verification` (`official` / `indexed` / `secondary`) and list anything unconfirmable in `unverified`.
3. If a price changed, add a `SEED_NEWS` item (newest first) with a source link.
4. Bump `CATALOG_VERSION` / `CATALOG_DATE`. Live overrides from the cron still apply on top.

Adding a provider: there are exactly eight palette slots (validated with the dataviz checker for CVD
separation); a ninth provider must replace one or be folded into an existing slot with its own glyph.

## How the daily refresh works

`refresh.ts` asks Gemini (with `url_context`) to read the official pricing pages and return, for each
catalog model matched by exact API identifier, the current input / output / cached prices and a
confidence. Policy:

- Only `high`-confidence rows for models already in the catalog can change a price; new models and
  anything ambiguous become **news items**, never rows.
- Every applied change produces a news item with before → after values and the source URL.
- The snapshot (overrides + news + confirmed ids) is stored as `latest` plus a dated history key;
  `GET /api/pricing` serves it and the client overlays it on the bundled catalog.
- Without `GEMINI_API_KEY` the job writes a timestamped no-op snapshot so the UI still shows when
  the last check ran.

## Methodology

- **Prices**: USD per 1M tokens, standard (lowest) context tier. Cached-input, cache-write, batch
  discount and long-context tiers are recorded where published. Third-party host prices (e.g. Llama
  on Together AI) are labeled as such and are not the model owner's price.
- **Verification levels**: `official` = official page fetched directly on the verification date;
  `indexed` = official page read through search-index extracts and cross-checked against ≥2
  independent trackers because the official domain was unreachable from the research environment;
  `secondary` = third-party only. Unverifiable facts are rendered as *n/a* — never estimated.
- **Calculator**: monthly cost = requests × [(1−hit)·in·p_in + hit·in·p_cached + out·p_out], minus
  batch discount on the batch-eligible share; if average input exceeds a model's long-context
  threshold, the whole request prices at that tier. Cached price falls back to full input price
  where none is published; models without caching ignore the hit rate; models without batch ignore
  the batch share.
- **Benchmarks**: only cross-model-comparable scores, each flagged vendor-reported vs independent.
  Artificial Analysis Index values are v4.3 only (the index was recalibrated twice in Sept 2026).
  SWE-bench Verified depends on each vendor's scaffold. Models without a score on the selected
  benchmark are excluded from the scatter and listed.
- **Recommendation**: lowest monthly cost among visible models that satisfy the preset's (editable)
  requirements and have public pricing; alternatives explained by cost delta and the preset's quality
  proxy. No single universal winner is declared.

## Limitations

- Excludes cache-write/storage fees, tool/search/grounding surcharges, off-peak schedules
  (DeepSeek), provisioned throughput and committed-use discounts, and cloud-marketplace pricing
  (Azure OpenAI, Bedrock, Vertex) which differ from first-party rates.
- Moonshot (Kimi) and image/audio-generation models are out of scope in this snapshot (palette
  slots are capped at eight providers).
- Benchmark coverage is uneven for releases from the last few weeks; "no score" is not "low score".
- Snapshot date is in `CATALOG_DATE`; the daily job only confirms or overrides prices for models
  already in the catalog — new models need a human edit.
