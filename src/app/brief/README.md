# AI Daily Brief

A mobile-first webapp that delivers the **Top 10 most important AI news items of the day**, ranked by importance rather than recency, readable in under five minutes. Each item carries an optional **Google Cloud Interpretation** lens for field teams.

Live route: `/brief`, served at **https://news.aitokenomics.app** (host rewrite in `src/proxy.ts`).

## How it works

```
Vercel cron (daily 01:00 UTC = 09:00 SGT)
   └─► GET /api/brief/cron
         └─► src/lib/brief/generate.ts
               • Gemini (gemini-3.5-flash) + url_context tool
               • live-fetches ~10 curated primary sources & reliable pubs,
                 confirms each article page, dedupes, ranks
               • returns structured JSON (schema-enforced via response_format)
         └─► src/lib/brief/store.ts  (Redis → file → memory fallback)

/brief page
   └─► GET /api/brief            latest brief (or ?date=YYYY-MM-DD)
   └─► GET /api/brief/archive    list of prior briefing dates
```

The news content is produced **exclusively from live web fetches** at generation time — never from model memory. Ingestion uses Gemini's `url_context` tool against a curated source list (Google AI, OpenAI, Anthropic, Microsoft, AWS ML, NVIDIA, Meta AI blogs + TechCrunch AI, The Verge AI, Ars Technica AI) because Google Search grounding requires paid quota on AI Studio keys; `url_context` is included in the free tier. Every item requires a real source URL and publish date confirmed from a fetched article page; the prompt forbids invented facts and forced Google Cloud positioning ("Limited direct Google Cloud implication." is the required fallback). On quiet news days the window may expand to ~7 days, always disclosed in a visible coverage note.

## Files

| Path | Purpose |
|---|---|
| `src/app/brief/page.tsx` | Route entry + metadata |
| `src/components/brief/BriefApp.tsx` | Full UI: header, GC toggle, signal summary, ranked cards, "Go deeper", archive, loading/error/empty states |
| `src/lib/brief/types.ts` | Data model (`NewsItem`, `DailyBrief`, archive index) |
| `src/lib/brief/generate.ts` | Daily job: web search → rank → structured Top 10 + GC interpretation |
| `src/lib/brief/store.ts` | Storage: Upstash/Vercel KV REST → local JSON files → in-memory |
| `src/lib/brief/fixtures.ts` | **Mock-only** sample brief for local dev without an API key |
| `src/app/api/brief/route.ts` | GET latest brief / brief by date |
| `src/app/api/brief/archive/route.ts` | GET archive index |
| `src/app/api/brief/cron/route.ts` | Daily job endpoint (cron + manual trigger) |

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | For live briefs | Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) (Google Search grounding + summarization). `GOOGLE_API_KEY` also accepted. Without it the app serves clearly-labeled mock data. |
| `CRON_SECRET` | Production | Bearer token Vercel cron sends to `/api/brief/cron`. Required in production when a Gemini key is set. |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Production | Upstash/Vercel KV REST endpoint for durable brief storage (`UPSTASH_REDIS_REST_URL`/`_TOKEN` also accepted). Falls back to `data/briefs/*.json` locally, then memory. |
| `BRIEF_GEMINI_MODEL` | No | Override the generation model (default `gemini-3.5-flash`). |
| `BRIEF_SOURCES` | No | Comma-separated URLs to replace the default curated source list. |

See `.env.example` at the repo root for placeholders.

## Run locally

```bash
npm install
# optional, for live briefs (key from https://aistudio.google.com/apikey):
export GEMINI_API_KEY=AIza...
npm run dev
```

Open `http://localhost:3000/brief`.

- **Without** `GEMINI_API_KEY`: the empty state offers a "Generate today's brief" button that stores the mock fixture (visibly bannered as sample data).
- **With** the key: the same button (or `curl -X POST 'http://localhost:3000/api/brief/cron?force=1'`) runs a live web-search generation — expect a few minutes. Briefs persist to `data/briefs/` between restarts.

## Daily job & regeneration

- Vercel cron hits `GET /api/brief/cron` daily at **01:00 UTC (09:00 SGT)** (see `vercel.json`) with `Authorization: Bearer $CRON_SECRET`.
- The job skips if today's brief already exists; pass `?force=1` to regenerate.
- `maxDuration` is 300s — web-search research runs take several minutes, so the Vercel plan must allow long function durations for live generation.

## Content quality rules (enforced in the prompt + normalizer)

- Ranked by the spec's seven criteria (enterprise adoption impact first), not recency.
- Primary sources preferred; SEO blogs, rumors, unverified social threads, and syndicated duplicates excluded; one item per story.
- Fewer than 10 items are returned (with a visible `coverage_note`) when the quality bar isn't met — the model is told not to pad.
- Items missing a real `http` source URL are dropped by the normalizer; scores are clamped to 0–1.
