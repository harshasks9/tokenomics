# Google AI Intelligence Hub (`/google-ai`)

An independent, source-grounded intelligence product about Google's AI ecosystem: what changed, how it fits
together and why it matters. Not affiliated with Google.

## What ships

| Destination | Route | What it does |
| --- | --- | --- |
| Overview | `/google-ai` | Freshness, executive brief (30 s / 3 min / 15 min), what changed by kind, release radar, deadlines, scheduled price changes, unreviewed detections |
| Latest | `/google-ai/latest`, `/latest/<id>` | Canonical developments with filters; detail page with sections A–J; auto-detected (unreviewed) feed |
| AI Stack | `/google-ai/stack`, `/entity/<id>` | Eight-layer explorer, agent architecture walk-through, knowledge-graph view; 18-part dossier per entity |
| Models | `/google-ai/models` | Cross-provider catalogue, model family tree |
| Compare | `/google-ai/compare` | Head-to-head, landscape scatter, workload ranking, competition matrix by battleground |
| Pricing | `/google-ai/pricing` | Effective-dated price tables, workload calculator, price history, plans, upcoming changes |
| Enterprise | `/google-ai/enterprise` | Workload navigator (industry × function × architecture), opportunity matrix, products |
| Timeline | `/google-ai/timeline` | Swim-lane timeline with rival comparison; Time Machine (state as of any date, compare two dates) |
| Research | `/google-ai/research` | Research-to-product lineage, method, pipeline status, source library, review report, limitations |

Global: search (names, aliases, former names, exact model ids), an analyst that answers only from the knowledge
base, light/dark mode, and three depths (Executive / Analyst / Technical).

## Specialist edition

The first five pages are written for AI sales specialists in Asia-Pacific; the original nine destinations remain
as the reference library in the sidebar.

| Page | Route | What it does |
| --- | --- | --- |
| Today | `/google-ai` | Must-know developments, each with what happened, what to say and what to watch; upcoming dates; rival moves; unreviewed items from the daily check |
| Industries | `/google-ai/industries` | Four segments, 27 sub-verticals as checkboxes; news, customer examples and workloads for the selection |
| Case studies | `/google-ai/cases` | Real customers on Google Cloud and on other platforms, with labelled claims and how to use each example |
| Quiz | `/google-ai/quiz` | Multiple-choice questions written from knowledge-base records, with explanations and sources |
| Graph | `/google-ai/graph` | The whole knowledge base as one explorable graph |

- **Sub-region** (sidebar): Korea, India, South East Asia, Japan, Australia and New Zealand, China, Hong Kong and
  Taiwan. Filters news and case studies by editorial tags and shows a sourced market brief.
- **Language** (sidebar): English plus Korean, Japanese, Simplified and Traditional Chinese, Indonesian, Thai,
  Vietnamese and Hindi. Navigation strings are hand-translated (`i18n.ts`); page text is machine-translated in the
  browser by `LanguageMirror` through `/api/google-ai/translate` (Gemini when a key is set, otherwise the public
  translate endpoint the repo already uses), cached, and labelled as machine translation. Elements marked
  `translate="no"` (product names, ids) are left alone. A failed translation shows English and says so.
- **Daily automatic notes** (`ingest/digest.ts`): after each monitoring run a model writes a headline and a
  talking point for the newest unreviewed Google posts, from the post's title and excerpt only. Output is validated
  (known item ids, known taxonomy ids, length caps), stored with the pipeline state and shown on Today as
  unreviewed. No key → no notes; a failed model call never fails the run.
- **Data** (`data/cases.json`, `notes.json`, `regions.json`, `quiz.json`): built by the merge tool from
  `s1-cases-google.json`, `s2-cases-other.json` and `s3-specialist.json`. Customer-reported results can never
  carry the "verified fact" label; taxonomy ids are checked against `taxonomy.ts`.

## Architecture

The simplest thing that is correct: a typed, versioned dataset in the repo plus a small monitoring pipeline.

```
src/lib/google-ai/
  types.ts            canonical data model (Source, Claim, Entity, Relationship, PriceRecord, BenchmarkResult,
                      AvailabilityRecord, LifecycleEvent, Announcement, TimelineEvent, …)
  data/*.json         the curated knowledge base (built by tools/merge.mjs)
  kb.ts               the only access layer: typed collections, indexes, the eight layers
  engine/             asof (time machine), pricing (effective-dated lookup + cost model), search, brief/radar,
                      graph, answer (grounded analyst), timeline, compare, pricing-view
  ingest/             registry (source inventory), fetch (robots.txt, user agent), parse (RSS/Atom/HTML),
                      cluster, classify (rules + entity resolution), pricewatch, store, run
  editorial.ts        analyst-written content: example workloads, agent request path, enterprise workloads,
                      review report, limitations
  tools/merge.mjs     validates and merges research files into data/*.json
src/app/google-ai/    layout, stylesheet, one optional catch-all page (rendered per request so "today" is real)
src/app/api/google-ai/{cron,status,ask}/route.ts
src/components/google-ai/   shell, shared UI, visualisations, one file per view
```

### Data rules the types and tests enforce

1. Every fact carries one of four labels — verified fact, provider claim, independent measurement, analyst
   interpretation — and at least one source id that resolves.
2. Publication date and effective date are stored separately for prices, availability and lifecycle events.
3. How a source was read (directly, via search extract, via third-party report, not re-read) is stored separately
   from what the source is.
4. One canonical id per thing. Renames are dated aliases (`formerNames`), not new entities.
5. No two price records for the same meter may be in force on the same day.

## Monitoring pipeline

`GET /api/google-ai/cron` (daily, see `vercel.json`) runs sixteen steps: discover sources → robots.txt → fetch →
snapshot and hash → parse → normalise → de-duplicate → cluster → resolve entities → classify → match to canonical
developments → compare the official pricing page with the knowledge base → score → queue for review → persist →
publish status. `GET /api/google-ai/status` exposes exactly what happened.

- Nothing detected is published automatically. Detected items are labelled unreviewed everywhere they appear.
- A failed run is reported as failed and does not advance "last successful run".
- The price watcher reads Google Cloud's pricing page and compares standard-tier, global input/output prices for
  Google text models with the knowledge base. A difference raises an alert for an editor.

Environment:

| Variable | Purpose |
| --- | --- |
| `CRON_SECRET` | Required in production; the cron route answers 428 without it and 401 on a wrong bearer token |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_*`) | Durable pipeline state. Without it, state is in memory and the status panel says so |
| `GEMINI_API_KEY` / `GOOGLE_API_KEY` | Optional. Lets the analyst reword retrieved facts; output is discarded unless every citation resolves |
| `GOOGLE_AI_HUB_MODEL` | Optional model id for the analyst |

## Updating the knowledge base

1. Research into four files with the shapes in `types.ts` (`r1-models.json`, `r2-stack.json`,
   `r3-competitors.json`, `r4-news.json`), optionally `dates.json` and `fixes.json` (see `tools/fixes.json`).
2. `GAI_RESEARCH_DIR=<folder> node src/lib/google-ai/tools/merge.mjs` — drops and logs anything without a valid
   source or a known entity; closes superseded prices; writes `data/*.json`.
3. `./node_modules/.bin/vitest run src/lib/google-ai` — must pass.

### Dated updates

A later update is one more file in the research folder, `r5-update.json`, `r6-update.json`, … (applied oldest first),
with the same collections plus `entityPatches` (confirmed status changes to existing entities) and `checks`.
Run the merge with `GAI_CURATED=<date>`; that date becomes the "updated through" date shown on every page.

- Records from the base research keep their own check date. An update never re-stamps what it did not re-read.
- `rechecked.json` lists list prices re-read from the live official page on a date (written from the pipeline's
  price check); only those price records take the later check date.
- A retirement date that was still ahead when it was recorded is a schedule. It becomes a retirement only when an
  update confirms it; otherwise the product stays deprecated and the site says the retirement was scheduled.
- An update's lifecycle events never set the introduction date of an existing product.

## Acceptance tests (`src/lib/google-ai/google-ai.test.ts`)

| Test | What is proven |
| --- | --- |
| A · new announcement | A fake feed with a duplicate and an already-covered post yields two queued items, classified and linked to canonical entities; nothing enters the curated feed; a re-run adds nothing |
| B · future-dated price change | The current price holds until the effective date, then switches; the change is listed as upcoming; regional, long-context and batch prices stay separate; the price watcher flags a changed page |
| C · cross-platform discovery | Every former name and every exact model id resolves to its canonical entity |
| D · competitive comparison | Benchmark results carry reporter and date; governance is enforced in `engine/compare.ts` |
| E · historical reconstruction | Names and stages as of a date; snapshots contain nothing dated later; undated entities are never guessed into the past |
| F · enterprise decision | The secure voice-agent workload resolves to canonical products including identity, gateway and screening |
| G · freshness failure | A failed run is reported as failed, raises an alert and does not advance freshness; robots.txt is honoured |
| H · evidence integrity | Unique ids, every citation resolves, every claim labelled and sourced, closed graph, ISO dates, no overlapping prices |
| I · production readiness | `npm run build` with `/google-ai/[[...slug]]` and the three API routes in the route list |

## Known limitations

Listed on the site under Research → Limitations (`LIMITATIONS` in `editorial.ts`) together with the five-role
review report (`REVIEW`). The most important: most non-`cloud.google.com` sources were read through search
extracts in the research environment; 21 Google entries still have no sourced introduction date and are left
out of as-of views; the knowledge base is a curated snapshot, not an auto-updating feed; the
calculator covers text tokens only; benchmark coverage is deliberately small.
