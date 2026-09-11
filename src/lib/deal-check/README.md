# Deal check — AWS MAP 2.0 vs Google Private Offer

A field-facing calculator that compares two incentive programs for a customer's
Anthropic model workload and reports which is cheaper for the customer, by how
much, and what would have to change to flip the answer. It never manufactures a
Google win: if AWS is cheaper, it says so.

Live route: `/deal-check` on the aitokenomics site, also served as
`dealcheck.aitokenomics.app` (host handling in `src/proxy.ts`). Next.js App
Router, no storage, no analytics.

## Passcode gate

Both addresses sit behind a shared passcode, built like the Offers gate:
`src/proxy.ts` redirects every request without a valid `dealcheck_session`
cookie to `/gate`; the gate posts to `/api/deal-check/auth`, which compares the
candidate against `DEALCHECK_PASSCODE` in constant time and sets an HttpOnly,
Secure, SameSite=Lax cookie signed with `DEALCHECK_SESSION_SECRET` (or the
site-wide `SESSION_SECRET`). Five failures from one IP in ten minutes lock that
IP out for ten minutes. The passcode is never committed; set it in the Vercel
environment (`vercel env add DEALCHECK_PASSCODE production`) and redeploy. An
unset passcode keeps the gate closed. `/api/deal-check/logout` clears the
session.

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
| `presets.ts` | The seven scenarios that come up most often, including the Gemini offload play. Each sets only the inputs it needs. |
| `summary.ts` | Plain-text account summary and the "smallest change to flip" sentence. |
| `explain.ts` | Plain-language explanation of a result and the levers that move it. |
| `construct.ts` | Deal files (save, export, import, browser list), the deal construct (the Google offer as written for one customer, with the offer's checks, credit pool, milestones, approvals and request steps) and the email to DPM. |
| `deals/` | `example.deal.json` template and the file schema notes. Real customer files stay out of this public repo. |
| `format.ts` | Money, percent and month formatting. |
| `engine.test.ts` | The 37-test suite: hand-computed credit and commit mechanics, accounting identities over all presets plus 200 seeded random input sets, verdict and solver behaviour. |

Google terms: `GOOGLE.minIacv` ($10M), `GOOGLE.windowMonths` (12),
`GOOGLE.baselineRule`, `GOOGLE.capTotal` ($5M), `GOOGLE.dpoMaxPct` (10%),
`GOOGLE.dpoMaxYears` (3), `GOOGLE.executeBy` (Oct 31, 2026, month index 1),
`GOOGLE.mktCapPct` (25%), `GOOGLE.creditScope`, `GOOGLE.eligibleAccounts`,
`GOOGLE.sizing` (pool sized on forecast Y1 incremental spend), `GOOGLE.topLine`
(credits on undiscounted marketplace spend), `GOOGLE.delivery` (spend
milestones, modelled as quarterly settlement), `GOOGLE.authority`,
`GOOGLE.request` (execution steps).

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
stylesheet). `src/components/deal-check/` holds the client components. The page
is built for a seller: seven plain-language questions plus a scenario picker
(`Questions.tsx`), a verdict hero with one cost bar per program and three
sentences (`Verdict.tsx`, `CostBars.tsx`, `threeSentences()`), a three-step
credit view with source tooltips (`SimpleCredits.tsx`, `Tip.tsx`), and a
five-item deal checklist with the email to DPM (`Checklist.tsx`,
`EmailActions.tsx`). Everything else is kept, collapsed: every assumption with
its source under "Advanced assumptions", and under "Details" the Gemini tuner,
the full explanation and levers, credits quarter by quarter, the economics
table and cumulative chart, the reverse-solve table and sensitivity chart, the
full deal construct, flags, the plain-text summary, and methodology and
sources. Below 920px the inputs stack above the results with the verdict first.

## The Gemini play

On the Google route a share of the traffic can be served by Gemini at a cost
ratio to Anthropic (`geminiShare`, `geminiCostRatio`). That spend is billed at
the ratio, counts as GCP Cloud AI consumption (so the offer's credits can be
applied to it) and consumes GCP commit without the marketplace cap; the
remaining traffic stays on Anthropic via marketplace and earns the credits.
`geminiPlay()` finds the smallest share at which Google beats AWS, and the
verdict, overview and DPM email state it.

## Inputs kept out of the assumptions panel

`gcpCap`, `mktCapPct`, `mapCommitArr`, `awsCreditUse` and `directDiscount`
stay in the engine (they are program constants or test hooks) but are marked
`hidden` in `INPUT_META` and do not appear as assumptions.
