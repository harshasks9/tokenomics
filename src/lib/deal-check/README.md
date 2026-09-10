# Deal check — AWS MAP 2.0 vs Google Private Offer

A field-facing calculator that compares two incentive programs for a customer's
Anthropic model workload and reports which is cheaper for the customer, by how
much, and what would have to change to flip the answer. It never manufactures a
Google win: if AWS is cheaper, it says so.

Live route: `/deal-check` on the aitokenomics site (Next.js App Router, static,
no API, no storage, no analytics).

## Run

```bash
npm ci
npm test                  # Vitest — engine suite in src/lib/deal-check/engine.test.ts
npm run dev               # http://localhost:3000/deal-check
npm run build             # must list /deal-check in the route output
```

The test run prints a preset table (net cost per route, advantage, rank at
12/24/36 months) so a human can eyeball every scenario.

## Deploy

The site deploys from `main` via Vercel; nothing is server-side, so no
environment variables or functions are required. Follow the repo's study
workflow in `AGENTS.md` (branch from fresh `main`, build, merge with
`--no-ff`, push `main`). To deploy the page standalone, any static Next.js
host works: `next build` then serve `.next` with `next start`, or point a
Vercel project at this repository.

## Where each program term is encoded

| File | Contents |
|---|---|
| `terms.ts` | Every program constant with a `source` tag: `documented` (Google internal sales summary), `field` (AWS MAP 2.0, one region, unverified), `assumption` (not in either source). Also the per-input metadata (label, tag, range, help). Nothing in the engine may use a term that is not declared here. |
| `engine.ts` | The pure economic model: monthly simulation of three routes, MAP credits (baseline, quarterly settlement, 10% ARR gate, multi-year, extension/restructure), Google credits (12-month window, last-quarter baseline, $5M cap, Cloud-AI-only consumability), AWS and GCP commit consumption and stranding (marketplace cap per leg, existing-commit-first), net cost, verdict rank, break-even, driver sentence, flags, reverse solvers and sensitivity. |
| `presets.ts` | The 24 named scenarios. Each sets only the inputs it needs. |
| `summary.ts` | Plain-text account summary and the "smallest change to flip" sentence. |
| `format.ts` | Money, percent and month formatting. |
| `engine.test.ts` | The 37-test suite: hand-computed credit and commit mechanics, accounting identities over all presets plus 200 seeded random input sets, verdict and solver behaviour. |

Google terms: `GOOGLE.minIacv` ($10M), `GOOGLE.windowMonths` (12),
`GOOGLE.baselineRule`, `GOOGLE.capTotal` ($5M), `GOOGLE.dpoMaxPct` (10%),
`GOOGLE.dpoMaxYears` (3), `GOOGLE.executeBy` (Oct 31, 2026, month index 1),
`GOOGLE.mktCapPct` (25%), `GOOGLE.creditScope`, `GOOGLE.eligibleAccounts`.

AWS terms: `AWS.creditPct` (25%), `AWS.gatePctOfArr` (10%), `AWS.settlement`,
`AWS.commitType` (soft), `AWS.multiYear`, `AWS.approvals`,
`AWS.migrationFeeMaxPctArr` (20%), `AWS.partnerPassMinPct` (5%),
`AWS.afterYearOne`, `AWS.unverified` (EMEA/Africa partner-channel claim, listed
and not modelled).

Modelling assumptions are listed in `ASSUMPTIONS` and shown in the
methodology panel: credits never retire commit; Google credits still accrue on
marketplace spend above the marketplace cap; AWS credits are usable against any
AWS bill.

## UI

`src/app/deal-check/` holds the route (layout with noindex metadata, page,
stylesheet). `src/components/deal-check/` holds the client components: verdict
panel, inputs (slider + number with a source tag per label), horizon tabs,
economics table, cumulative net-cost chart (inline SVG), reverse-solve table,
sensitivity chart (inline SVG), flags, copyable summary, methodology and sources
panels. Below 920px the inputs stack above the results with the verdict first.
