# Offers — GenAI commercial scenario model

Internal, passcode-gated pricing simulator for `offers.aitokenomics.app`.

It turns the Q3 2026 GenAI commercial model — GSU / serving-tier / commitment
economics — into a live what-if simulator that GTM teammates can drive in a
customer conversation: change a lever, watch the waterfall move, share the URL,
export the chart.

**Scope: incremental new workload only** — the PT capacity and PayGo demand
being added, on an incremental commit. Nothing here reprices or describes what
the customer already runs. The baseline figure is what that *new* workload costs
at standard rates with nothing elected.

**Nothing is programmatic.** Buy One PT Get One PayGo, Off-peak, Deferred,
Batch, FSP and the GSU Q3 offer are each an election, so each is a checkbox.
A share whose construct is not elected bills at the standard 1.0x rate, and
spike traffic without BOGO bills at Priority PayGo 1.8x.

**Internal illustrative modeling. Not a rate card. Not for external
distribution.**

---

## Contents

- [Where the code lives](#where-the-code-lives)
- [The math spec](#the-math-spec)
- [Lever table](#lever-table)
- [Assumptions](#assumptions)
- [Model pricing comparison](#model-pricing-comparison)
- [Authentication](#authentication)
- [Passcode rotation](#passcode-rotation)
- [Security honesty note](#security-honesty-note)
- [Local development](#local-development)
- [Deployment](#deployment)
- [Measured quality](#measured-quality)
- [Changelog](#changelog)

## Where the code lives

This is a microsite inside the `tokenomics` monorepo, so it follows the repo's
lane rules — new files only, shared files appended to.

```
src/app/offers/
  layout.tsx            fonts (IBM Plex Sans/Mono), metadata, noindex
  offers.css            the whole design system, scoped to .offers-root
  page.tsx              the simulator (server shell, hydrates from ?params)
  gate/page.tsx         passcode entry screen
  playbook/page.tsx     static reference page
src/app/api/offers/
  auth/route.ts         POST passcode → signed session cookie
  logout/route.ts       POST → clears the cookie
src/lib/offers/
  model.ts              ALL math — pure, no `any`, unit-tested
  model.test.ts         the test vectors below
  presets.ts            scenario presets
  params.ts             shareable-URL encode/decode
  auth.ts               HMAC session token, constant-time compare
  ratelimit.ts          in-memory failed-attempt throttle
  routes.ts             host-aware path helpers
  content.ts            playbook copy, as a typed constant
  format.ts             number formatting
src/components/offers/  Waterfall, Levers, KpiStrip, MixBar, TierLadder,
                        ScenarioBar, ShareButton, ExportButton, StepTable,
                        AttributionBar, Slider, Nav, Footnotes, GateForm,
                        Simulator
public/offers/robots.txt
```

Appended to (never rewritten): `src/proxy.ts` (host routing + the gate),
`vercel.json` (one `/robots.txt` rewrite for the offers host).

---

## The math spec

All money is **$K per month** unless a name says otherwise.

### What is being modelled

Two inputs describe the incremental workload, both normalised to GSUs so they
sit on one scale:

- `ptGsus` — Provisioned Throughput capacity being ordered. **PT bills on
  capacity, not usage**, so this number is what gets paid for.
- `paygoGsus` — expected PayGo demand, in GSU-equivalents.

`ptUtilization` says how full the reserved capacity actually runs. Anything
below 100% is capacity bought and not used — surfaced explicitly, because it is
the single most common way a PT order goes wrong.

TPM figures come from `tpmPerGsu`, an editable assumption. See the note in
[Assumptions](#assumptions).

### Constants

- `P_LIST = 2.4` — $K per GSU per month (list $2,400)
- GSU unit price by commitment term:

  | Term | $/GSU/month |
  |---|---|
  | 1 month | 2,400 |
  | 3 months | 2,400 |
  | 1 year | 2,100 |

### The baseline

The reference everything is measured against is **incremental spend with
nothing elected** — not a peak-sized hypothetical, and not the customer's
current bill:

```
ptReference    = ptGsus × P_LIST
paygoUnit      = paygoGsus × P_LIST
paygoReference = paygoUnit × ( spike×1.8 + standard + offPeak + deferred + batch )
reference      = ptReference + paygoReference
```

Spike traffic sits at Priority PayGo 1.8x in the baseline because Buy One PT
Get One PayGo has not been elected yet. Standard PayGo is the remainder of the
four placement shares, so nothing auto-normalises behind the user's back; if
the four are pushed past 100% they are scaled back proportionally and the UI
says so.

### The steps

Each step is gated on the customer electing that construct. Nothing is
programmatic.

| # | Step | Effect when elected | When not |
|---|---|---|---|
| 1 | Buy One PT Get One PayGo | spike share 1.8x → 1.0x | stays at 1.8x |
| 2 | Off-peak PayGo | off-peak share × 0.5 | stays at 1.0x |
| 3 | Deferred + Batch | deferred × (0.5 + 0.5·harness), batch × 0.5 | stay at 1.0x |
| 4 | Flexible Savings Plan | −10% or −20% on everything in scope | on-demand |
| 5 | GSU term + GCP commit | PT line only | list, 1-month |
| 6 | GSU Q3 offer | PT line only, tier discount then credits | none |

Steps 5 and 6 touch **only the PT line**, so a customer with little PT sees
them do little — which is the honest answer.

**Non-stacking is an anchored fact.** The decks state FSP is non-stacking with
the on-demand rate as ceiling, and that FSP draws down the EA rather than
compounding with it. So the PT line takes the *better* of the FSP rate and the
GCP commit discount, never their product.

### GSU Q3 offer tiers

Qualified for, not negotiated — derived from `ptGsus`:

| PT GSUs / month | Discount on PT spend | Credits |
|---|---|---|
| 2,000 or more | **30%**, fixed | **10%** |
| 500 or more | **up to 15%**, a band | **10%** |
| under 500 | does not qualify | — |

The rail shows the qualifying tier and how many more GSUs reach the next one.
Credits apply after the discount, on PT spend only.

### Derived figures

```
totalConsumed     = ptGsus × ptUtilization + paygoGsus
idleGsus          = ptGsus × (1 − ptUtilization)
blendedMultiplier = final / (P_LIST × totalConsumed)
savingPct         = 1 − final / reference
annualSave        = (reference − final) × 12
commit.monthly    = PT line after term, commit discount, Q3 and credits
commit.total      = commit.monthly × term months
```

### Attribution

| Component | Formula |
|---|---|
| Buy One PT Get One PayGo | `reference − S1` |
| Placement (0.5x tiers) | `S1 − S3` |
| FSP | `S3 − S4` |
| GSU term + commit | `S4 − S5` |
| GSU Q3 offer | `S5 − S6` |

The five sum to `reference − final` exactly, and each is non-negative
(asserted in the tests).

## Lever table

| Lever | Meaning | Range | Default |
|---|---|---|---|
| `ptGsus` | Incremental PT capacity | 0–5000, step 50 | 600 |
| `ptUtilization` | How full that PT runs | 0.40–1.00 | 0.85 |
| `paygoGsus` | Incremental PayGo demand, GSU-equiv | 0–5000, step 50 | 600 |
| `paygoMix.spike` | Peak-sensitive share of PayGo | 0–1 | 0.15 |
| `paygoMix.offPeak` | Off-peak-eligible share | 0–1 | 0.30 |
| `paygoMix.deferred` | Deferred-agents share | 0–1 | 0.20 |
| `paygoMix.batch` | Batch share | 0–1 | 0.10 |
| `harness` | Harness fee share within Deferred | 0–0.50 | 0.15 |
| `tpmPerGsu` | TPM per GSU — assumption | 10k–200k | 60,000 |
| `modelId` | Model for the token comparison | — | Gemini 3.6 Flash |
| `fspRate` | FSP rate when elected | {0.10, 0.20} | 0.20 |
| `term` | GSU commitment term | {1m, 3m, 1y} | 1m |
| `gcpCommit` | GCP commit discount on GSU pricing | 0–0.30 | 0 |
| `q3Discount` | Discount within the qualifying Q3 band | 0–0.30 | 0.15 |

Standard PayGo is the remainder of the four placement shares — there is no
fifth slider fighting the others.

### Elections

Six checkboxes: `bogo`, `offPeak`, `deferred`, `batch`, `fsp`, `q3`. All default
to elected. BOGO additionally requires 200+ PT GSUs and disables itself below
that, explaining why.

### Shareable URLs

```
?pt=600&u=85&pg=600&mix=15-30-20-10&h=15&fsp=20&t=1m&gcp=0&q3d=15
  &m=gemini-3-6-flash&tpm=60000&o=bogo.offpeak.deferred.batch.fsp.q3&preset=japac
```

Percentages travel as whole numbers; elected offers as a dot-separated list in
`o`. `o=` (empty) means *nothing* elected — not the same as omitting `o`, which
keeps the base. Malformed values fall back to defaults instead of throwing.

## Assumptions

Two numbers on this page are not in the source decks, and both are exposed as
levers rather than buried:

- **`tpmPerGsu` (default 60,000).** The decks quote customer traffic in TPM and
  capacity in GSUs but never the conversion. The default is reverse-engineered
  from the PT-percentile chart — a large customer peaking around 60M TPM against
  an order in the high hundreds of GSUs. **Set this to your region's real figure
  before quoting any TPM number from this site.**
- **GSU term pricing.** Three terms, two published prices. List is $2,400 and a
  commitment earns a discount, so sub-year terms sit at list and the 1-year term
  takes $2,100. `GSU_TERM_PRICE` is the single place to change it.

## Model pricing comparison

The "Compete" view compares published list prices per million tokens, and what
they become once token consumption is accounted for — the decks are emphatic
that the argument is cost-per-task, not cost-per-token.

Every entry carries its provenance in the UI:

| Source badge | Meaning |
|---|---|
| `deck` | Stated in the Q3 2026 commercial deck |
| `derived` | Computed from a relative claim in the deck, not a rate card |
| `no price` | Named in the deck as a comparison target, with no price given |

Claude Sonnet is `derived` — the deck says it is priced about 2x higher on list
than Gemini 3.6 Flash. The GPT models carry **no price at all** rather than an
invented one. The effective-cost-per-task figures use directional EAP token
ratios, not benchmarks. All of this is stated on the page itself; verify against
the vendor's public pricing before using any of it with a customer.

## Authentication

The passcode **never reaches the browser**. There is no client-side comparison,
no passcode in any JS bundle, and no `NEXT_PUBLIC_` variable.

1. `src/proxy.ts` gates every offers path except `/gate`. No valid cookie →
   redirect to `/gate?next=<path>`.
2. `/gate` posts the candidate to `POST /api/offers/auth`, which SHA-256s both
   sides and compares with `node:crypto.timingSafeEqual` (fixed-width, so the
   passcode's length never leaks through timing).
3. On success it sets `offers_session` — **HttpOnly, Secure, SameSite=Lax**,
   `Max-Age` 14 days — containing `HMAC-SHA256(SESSION_SECRET,
   "offers-session-v1")`.
4. On failure: 401 with a generic message. After 5 failures from one IP inside
   10 minutes: 429 for 10 minutes.
5. Search-engine hygiene: `X-Robots-Tag: noindex, nofollow` from the proxy,
   `robots: { index: false, follow: false }` in the route metadata, and
   `public/offers/robots.txt` (`Disallow: /`) served on the offers host.
6. "Lock" in the nav and the footer posts to `/api/offers/logout`, which clears
   the cookie. It's a plain form, so it works without JavaScript.

The gate **never fails open.** If `SITE_PASSCODE` or `SESSION_SECRET` is
missing, no cookie can validate, so every request lands on `/gate` and the gate
says it is unconfigured.

### Environment variables

| Name | Purpose |
|---|---|
| `SITE_PASSCODE` | The shared passcode. Server-side only. |
| `SESSION_SECRET` | Random 32+ bytes, signs the session cookie. |

Neither is ever committed. See `.env.example`.

---

## Passcode rotation

Rotate quarterly, and immediately on any team change.

```bash
# 1. Set the new passcode (production + preview)
vercel env rm SITE_PASSCODE production
vercel env add SITE_PASSCODE production      # paste the new value

# 2. Redeploy so the new env is picked up. No code change needed.
vercel --prod
```

To force **every existing session to sign in again** (do this when someone
leaves), rotate the signing secret too — outstanding cookies stop validating
immediately, because the cookie is just an HMAC of a fixed payload:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
vercel env rm SESSION_SECRET production
vercel env add SESSION_SECRET production
vercel --prod
```

---

## Security honesty note

**A shared passcode is access friction, not security.** It is one secret held by
many people; it will be pasted into chat threads, and it does not identify who
opened the site or when.

The pricing constructs modelled here are commercially sensitive. Therefore:

- Do not put anything on this site that is flagged internal-only beyond the
  audience of the passcode holders. The site deliberately excludes discount
  authority figures, approval-chain detail, deal-desk mechanics, named customer
  references, and competitor take-out framing — keep it that way.
- Rotate `SITE_PASSCODE` in the Vercel env vars quarterly or on team change. No
  code redeploy is required, only an env redeploy.
- The failed-attempt throttle is an in-memory `Map`, per lambda instance. Vercel
  runs several instances and recycles them, so it slows a casual guesser but is
  not a hard boundary. A shared durable store (Upstash / Vercel KV, already used
  elsewhere in this repo) would be the upgrade if that ever matters.
- If the audience grows beyond a small team, move to Vercel password protection
  or SSO. A per-person identity is worth more than a stronger shared string.

---

## Local development

```bash
npm install
cp .env.example .env.local     # then fill in SITE_PASSCODE and SESSION_SECRET
npm run dev                    # http://localhost:3000/offers
npm test                       # the vectors above
npm run build                  # /offers must appear in the route list
```

The site is reachable two ways and both are supported:

- `offers.aitokenomics.app/…` — the proxy strips the prefix, so the browser
  sees `/`, `/playbook`, `/gate`.
- `aitokenomics.app/offers/…` (and localhost) — paths keep the `/offers`
  prefix.

`basePathFor(host)` in `src/lib/offers/routes.ts` is what keeps every internal
link correct on both.

---

## Deployment

The microsite ships with the rest of the property: merge to `main`, Vercel
deploys automatically. It does **not** need its own Vercel project — the proxy
already routes by host.

Before the subdomain works, two things must exist on the Vercel project:

1. **Env vars**, on production *and* preview:
   ```bash
   vercel env add SITE_PASSCODE production
   vercel env add SITE_PASSCODE preview
   vercel env add SESSION_SECRET production
   vercel env add SESSION_SECRET preview
   ```
2. **The domain:**
   ```bash
   vercel domains add offers.aitokenomics.app
   ```
   If the apex `aitokenomics.app` is already on this Vercel account the
   subdomain binds automatically. Otherwise add a DNS record:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `offers` | `cname.vercel-dns.com` |

Post-deploy smoke test:

```bash
curl -sI https://offers.aitokenomics.app/            # 307 → /gate, X-Robots-Tag: noindex
curl -s  https://offers.aitokenomics.app/robots.txt  # Disallow: /
```

Then in a browser: gate accepts the passcode → simulator shows
**$968.94K / −59.6% / 0.73x** at defaults → preset chips load → Share
round-trips → PNG and CSV download → `/playbook` renders → Lock signs out.

---

## Measured quality

Lighthouse, desktop preset, against a local production build of `/offers`:

| Category | Score |
|---|---|
| Accessibility | **100** (no failing audits) |
| Best practices | **100** |
| Performance | **74** |
| SEO | 60 — expected; the page asserts `noindex` by design |

Two things worth knowing about those numbers:

- **Performance 74 is Lighthouse's simulated slow-4G model, not the page.**
  Measured unthrottled on the same build: TTFB 29 ms, FCP 192 ms, **LCP 192 ms**,
  load 195 ms, 171 KiB transferred, CLS 0, TBT 20 ms. The route is
  `force-dynamic` because the gate and the server-side URL hydration both need
  request context, so it cannot be prerendered — under Lighthouse's 1.6 Mbps /
  150 ms-RTT simulation that costs the score. This is below the ≥95 target and
  is recorded here rather than papered over.
- Running Lighthouse locally also has to exclude
  `fonts.googleapis.com` — the shared root `globals.css` imports Inter for the
  rest of the property, and a sandbox with no route to Google leaves that
  request hanging ~12 s, which drags Speed Index to ~19 s. It resolves normally
  in production, and this microsite does not use Inter (IBM Plex is self-hosted
  by `next/font`).

Reaching 100 on accessibility required two deviations from the literal §3
palette, both noted at their definitions:

- `--ink-faint` lifted from `#5E7E96` to `#8AA5BA`. At the 10–11 px sizes it is
  actually used, the spec swatch measured 3.3:1 on `--panel` — under AA's 4.5:1.
- The workload mix bar varies tier by **tint** rather than opacity. Fading a
  segment toward the dark panel also faded the label sitting on it (4.27:1);
  solid lighter tints put every label above 7:1.

Either is a one-line revert if the exact swatches matter more.

## Changelog

### 0.5.0 — 2026-08-01

- **Simple / Pro modes**, toggled at the top. Everything built so far is now
  Pro.
- **Simple mode is two inputs**: total demand, and the share of it going to PT.
  It states the customer in one sentence — "Total demand of 1,200 GSUs, of which
  50% goes to Provisioned Throughput and 50% goes to PayGo" — applies the
  concessions in sequence, shows the waterfall, and closes on the blended
  multiplier.
- `leversFromSimple` expands those two numbers into the full lever set with
  stated defaults: PT right-sized at 100% utilization, a 1-year GSU term, FSP at
  the 3-year rate, and every option elected. It answers "what could this
  customer get?" — the assumption is printed under the result, and Pro is where
  it comes apart.
- Mode travels in the URL as `?mode=simple`, so a simple scenario shares as one.

### 0.4.0 — 2026-08-01

- **"Show me the math" tab** on the savings chart. The model now emits its own
  working — one line per operation, with the live values substituted rather than
  abstract symbols — and the chart card tabs between the waterfall and the full
  arithmetic: every step's inputs, its running total, cumulative saving, and a
  closing reconciliation. Formulas stayed off the default view; the audit trail
  is one click away.

### 0.3.1 — 2026-08-01

- **The page opens with the question.** A "Step one — how much is the
  incremental spend?" block leads: the estimate, then how it divides between
  the PT order and everything else, with a proportional split bar.
- **The traffic trace is an ECG, not a hill.** 5-minute resolution across the
  day, with fast jitter, a slow ripple and sparse bursts over the diurnal
  envelope — the shape real TPM traces have. Peakiness now flexes the envelope
  only, so solving for the PT/PayGo split no longer amplifies noise into
  implausible spikes.
- **One unit per scale.** `pickUnit` / `inUnit` in `format.ts` choose a single
  unit for a whole axis or readout and hold every value to it, with gridlines
  on round numbers — no more "116.4M" sitting next to "60K" on the same chart.

### 0.3.0 — 2026-08-01

- **Inputs are now volumes, not shares.** The builder asks for incremental PT
  (GSUs) and incremental PayGo (GSU-equivalents) directly, normalised to GSUs,
  with TPM backed out from an explicit `tpmPerGsu` assumption.
- **Traffic shape chart** added above the fold: a representative day with the
  reserved PT band, PayGo overflow above it, and the PT/PayGo split of both
  volume and spend. The curve is *solved* so its two areas match the reported
  split rather than merely suggesting one. No 50/50 assumption — the presets
  span 15/85 to 78/22.
- **The baseline is now incremental spend at standard rates**, so every
  visualization answers one question: how much of the new spend do the programs
  take back.
- **Mathematical formulas removed from the site.** The spec lives here; the
  page speaks in plain language.
- **Compete view** comparing published list prices and effective cost per task
  across Google, Anthropic and OpenAI models — each entry carrying its
  provenance, and no invented prices.
- **Model selection** added under Assumptions.
- **Levers simplified again**: three groups plus an Assumptions disclosure.
  Standard PayGo is the remainder of the placement shares rather than a fifth
  competing slider, so nothing auto-normalises behind the user.
- "Legacy" removed from the vocabulary entirely.

### 0.2.0 — 2026-08-01

- **Scope narrowed to new capacity.** The model now describes new GSU / PT
  capacity on an incremental commit; existing orders are explicitly out of
  scope. "Legacy" is gone from the vocabulary — the reference bar is "at list".
- **Offers are opt-in.** BOGO, Off-peak, Deferred, Batch, FSP and the GSU Q3
  offer are checkboxes rather than baked-in assumptions. An unelected share
  bills at 1.0x; spike traffic without BOGO bills at Priority PayGo 1.8x, and
  BOGO itself needs 200+ committed GSUs.
- **GSU Q3 offer replaced by its two real tiers**: 2,000+ GSUs/month earns a
  fixed 30% plus 10% credits; 500+ earns up to 15% plus 10% credits; below 500
  does not qualify. The tier is derived from the committed GSU count, and the
  rail shows how far away the next one is.
- **Workload-on-PT promoted** to a first-class slider — customers rarely place
  everything on PT.
- **Incremental commit surfaced** as a KPI: monthly, term length, and total.
- **Simplified rail**: five groups instead of seven, each construct's checkbox
  sits with its own slider, the equation and the harness lever moved into
  disclosures, and every attribute carries a "?" tooltip describing it.

### 0.1.0 — 2026-08-01

- Initial release: model core with §9 test vectors, seven-step waterfall,
  lever rail, presets, compare mode, presenter mode, shareable URLs, PNG/CSV
  export, playbook reference page.
- GSU commitment layer added on top of the base model: commitment term
  (1m / 3m / 1y) driving the GSU unit price, GCP commit discount (non-stacking
  with FSP), and the GSU Q3 offer's incremental discount and credits.
- Passcode gate: edge proxy, HMAC session cookie, constant-time comparison,
  per-IP throttle, noindex everywhere.
