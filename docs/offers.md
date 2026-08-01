# Offers — GenAI commercial scenario model

Internal, passcode-gated pricing simulator for `offers.aitokenomics.app`.

It turns the Q3 2026 GenAI commercial model — GSU / serving-tier / commitment
economics — into a live what-if simulator that GTM teammates can drive in a
customer conversation: change a lever, watch the waterfall move, share the URL,
export the chart.

**Internal illustrative modeling. Not a rate card. Not for external
distribution.**

---

## Contents

- [Where the code lives](#where-the-code-lives)
- [The math spec](#the-math-spec)
- [Lever table](#lever-table)
- [Test vectors](#test-vectors)
- [Authentication](#authentication)
- [Passcode rotation](#passcode-rotation)
- [Security honesty note](#security-honesty-note)
- [Local development](#local-development)
- [Deployment](#deployment)
- [Changelog](#changelog)

---

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

### Constants

- `P_LIST = 2.4` — $K per GSU per month (list $2,400)
- GSU unit price by commitment term:

  | Term | $/GSU/month |
  |---|---|
  | 1 month | 2,400 |
  | 3 months | 2,400 |
  | 1 year | 2,100 |

  > **Assumption.** The brief names three terms but only two prices ($2,400 and
  > $2,100). List is fixed at $2,400 and a commitment earns a discount, so the
  > sub-year terms sit at list and the 1-year term takes $2,100 (−12.5%). If
  > that reading is wrong, `GSU_TERM_PRICE` in `model.ts` is the single place to
  > change it — nothing else in the model hardcodes a term price.

### Core chain

```
V  = N0 × u0                          // consumed GSU-equivalents
C0 = N0 × P_LIST                      // legacy monthly $K
legacyMultiplier = 1 / u0

S1 = P·V × ( wb/u1 + (ws + wo + wd + wbt) × 1.0 )      // right-size PT + BOGO
S2 = S1 − P·V × wo × 0.5                                // off-peak placement
defMult = 0.5 + 0.5·h                                   // Deferred honesty term
S3 = S2 − P·V × ( wd·(1 − defMult) + wbt·0.5 )          // deferred + batch
S4 = S3 × (1 − d)                                       // FSP wrapper
```

Closed form, which is what the header renders as the master equation:

```
S4 = P·V · [ wb/u1 + ws + 0.5·wo + (0.5 + 0.5h)·wd + 0.5·wbt ] · (1 − d)
```

### GSU commitment layer

These steps touch **only the GSU/PT line**, `G = P·V·(wb/u1)` — not the PayGo
portion of the bill. That is deliberate: the GSU term price, the GCP commit
discount and the Q3 offer are all GSU constructs, so a customer with little
baseload sees them do very little, which is the honest answer.

```
G            = P·V × wb/u1              // GSU spend at list
G_afterFsp   = G × (1 − d)              // what S4 already charged for it
τ            = P_term / P_LIST          // 1.000 (1m/3m) or 0.875 (1y)
gsuRate      = max(d, g)                // NON-STACKING — see below
G_afterCommit = G × τ × (1 − gsuRate)

S5 = S4 − G_afterFsp + G_afterCommit    // step 5: GSU term + GCP commit

G_afterInc   = G_afterCommit × (1 − i)
credits      = G_afterInc × c
S6 = S5 − (G_afterCommit − G_afterInc) − credits   // step 6: Q3 incentives

final = S6
blendedMultiplier = final / (P·V)
savingPct  = 1 − final/C0
annualSave = (C0 − final) × 12
```

**Non-stacking is an anchored fact, not a modelling choice.** The decks state
FSP is non-stacking with the on-demand rate as the ceiling, and that FSP draws
down the EA rather than compounding with EA discounts. So the GSU line takes the
*better* of the FSP rate and the GCP commit discount, never their product. The
lever rail shows which one won.

At the defaults (`term = 1 month`, `g = i = c = 0`) the whole GSU layer is
neutral: `S6 === S5 === S4`, so the §9 vectors are unaffected.

### Attribution

| Component | Formula |
|---|---|
| Utilization repair | `C0 − S1` |
| Placement (0.5x tiers) | `S1 − S3` |
| FSP | `S3 − S4` |
| GSU term + commit | `S4 − S5` |
| Q3 incentives | `S5 − S6` |

The five sum to `C0 − final` exactly (asserted in the tests). Utilization repair
goes negative when `u1 < u0` — right-sizing that makes things worse — and the UI
says so in red rather than hiding it.

### Anchored vs. modelled

Rendered with `●` (anchored to the decks) and `○` (modelled assumption):

**Anchored** — PT = 1.0x Std PayGo at 100% utilization · Priority PayGo 1.8x ·
Flex / Batch / Deferred / Off-peak = 0.5x · FSP 10% (1Y) / 20% (3Y), monthly
enforcement, dollar-fungible across Vertex AI 1P including PT, non-stacking with
the on-demand ceiling · Deferred discount = inference tokens only, harness fees
at standard rates · Off-peak & Deferred = global endpoint only · Off-peak
windows: weekdays 3–9 PM PT, Fri 3 PM – Sun 9 PM PT.

**Modelled** — `u0`, `u1`, the workload shares, `h`, and the GSU term /
commit / incentive levers. These are the user's.

---

## Lever table

| Symbol | Meaning | Range | Default |
|---|---|---|---|
| `N0` | Legacy peak-sized GSUs | 100–5000, step 50 | 1000 |
| `u0` | Legacy utilization | 0.35–0.90 | 0.55 |
| `u1` | Right-sized PT utilization | 0.60–0.98 | 0.85 |
| `wb` | Baseload share → PT | 0–1 | 0.55 |
| `ws` | Spike share → protected PayGo (1.0x) | 0–1 | 0.07 |
| `wo` | Off-peak-eligible share (0.5x) | 0–1 | 0.18 |
| `wd` | Deferred-agents share (0.5x tokens) | 0–1 | 0.14 |
| `wbt` | Batch share (0.5x) | 0–1 | 0.06 |
| `h` | Harness fee share within Deferred, billed 1.0x | 0–0.50 | 0.15 |
| `d` | FSP discount | {0, 0.10, 0.20} | 0.20 |
| `term` | GSU commitment term | {1m, 3m, 1y} | 1m |
| `g` | GCP commit discount (on GSU pricing) | 0–0.30 | 0 |
| `i` | Q3 incremental discount (on GSU spend) | 0–0.30 | 0 |
| `c` | Q3 credits (on GSU spend) | 0–0.20 | 0 |

Mix shares auto-normalize (`w_i ← w_i / Σw`); the rail shows raw and normalized
values side by side.

### Shareable URLs

```
?n=1000&u0=55&u1=85&mix=55-7-18-14-6&h=15&d=20&t=1m&g=0&inc=0&cr=0&preset=japac
```

Percentages travel as whole numbers. A `preset` supplies the base and explicit
params override it, so a link tweaked after loading a preset round-trips
exactly. Malformed values fall back to defaults instead of throwing.

---

## Test vectors

`npm test` (Vitest). All must pass before deploy.

| Vector | Setup | Expectation | Status |
|---|---|---|---|
| A | Defaults | V=550, C0=2400.00, S1=1448.12, S2=1329.32, S3=1211.18, **S4=968.94**, blended 0.734, saving 59.6%, annual $17.17M | pass |
| B | `u1=u0=.55`, mix 100/0/0/0/0, any `h`, `d=0` | `S4 === C0` exactly (guards sign errors) | pass |
| C | `u0=.55`, mix 0/0/40/40/20, `h=0`, `d=.20` | `S4 = P·V × 0.5 × 0.8 = 528.00` exactly | pass |
| D | Raw mix 110/14/36/28/12 | normalizes to Vector A's shares; same S4 | pass |
| E | `h=.50` | `defMult = 0.75` exactly | pass |
| Property | Monotonicity | S4 non-increasing in `d` and in `wo`; final non-increasing in `g`, `i`, `c`; S4 rises with `h` | pass |
| Integrity | Full lever grid | no NaN, final ≥ 0, deltas reconcile, attribution sums to total, model is pure | pass |

---

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

### 0.1.0 — 2026-08-01

- Initial release: model core with §9 test vectors, seven-step waterfall,
  lever rail, presets, compare mode, presenter mode, shareable URLs, PNG/CSV
  export, playbook reference page.
- GSU commitment layer added on top of the base model: commitment term
  (1m / 3m / 1y) driving the GSU unit price, GCP commit discount (non-stacking
  with FSP), and the GSU Q3 offer's incremental discount and credits.
- Passcode gate: edge proxy, HMAC session cookie, constant-time comparison,
  per-IP throttle, noindex everywhere.
