# The Economics of AI: Is the Hyperscaler Subsidy Model Sustainable?

**Financial research memo · JAPAC AI go-to-market · as of November 26, 2026 · v1.0 after independent review**

Independent analysis from primary filings, company statements and credible reporting. Not investment advice. Companion files: [executive email](/subsidy-math/email) · [claims audit](/subsidy-math/claims) · [Excel model](/subsidy-math/subsidy-math-model.xlsx) · [interactive site](/subsidy-math).

**Labels.** *Disclosed* = in a company filing (page given). *Reported* = company statement on a call or blog, or credible press. *Calculated* = our arithmetic on disclosed or reported figures. *Assumption* = a modelling input, adjustable in the workbook. "Per $100" means per $100 of list-price (rate-card) frontier-model consumption in year one.

**Method.** Five research workstreams (Amazon/AWS, Microsoft/OpenAI, Anthropic, Alphabet/Google, AI-infrastructure economics) read the primary filings. A modelling workstream built one engine, used by the site and mirrored cell for cell in the workbook, with automated parity checks. An independent reviewer then argued the opposite thesis and checked 20 figures against the filings. That review changed this memo materially; §9 lists what it changed.

---

## 1. The answer

**The evidence does not show that AWS's or Microsoft's incentives are unsustainable.** We set out to test whether they are and could not establish it. The narrower conclusions the evidence does support:

1. **Reselling a third-party model is a thin-slice, capital-light business.**
   - Anthropic's IPO filing shows that on cloud marketplaces Anthropic is the seller (principal): it sets the price and books the revenue. The cloud is a "collection agent" that keeps a fee (S-1/A pp. F-17, F-22).
   - Reselling Claude, a cloud keeps roughly **$12–30 of every $100, central ~$25**, before incentives. That rests on our reading of Anthropic's channel fees (category 3; §3.1).
   - The reseller bears almost no model or serving capital.
   - Microsoft keeps ~$64 of $100 on royalty-free OpenAI models. Google keeps ~$74 on Gemini before model development, ~$51 after it.
2. **The form of an incentive matters more than its size.**
   - A **time-limited** 35% incentive — one-time, MAP-style on spend growth, or tied to a broader commit — pays back for AWS in roughly **13–17 months**, *if it wins a workload AWS would otherwise lose*. That is ordinary customer acquisition.
   - A **permanent** 35% discount loses money on the Claude line alone: five-year value −$24 per $100 in the base case, −$59 if each credit dollar costs AWS a full dollar.
   - It roughly breaks even, however, once ~$5–12 a year of incremental non-AI cloud gross profit per $100 is counted, or once ~8% of the subsidized usage is genuinely new revenue for Anthropic, given Amazon's ~23% stake.
3. **The "unsustainable" case survives only in a narrow corner:** permanent, fully AWS-funded, cash-equivalent discounts on usage AWS would have won anyway, while channel fees fall back toward 2025 levels. That is not what MAP is designed to be, and we have no evidence AWS does it at scale.
4. **For Microsoft the resale premise largely fails.**
   - Since April 2026 Microsoft sells OpenAI models royalty-free, through a non-exclusive licence that runs to 2032.
   - Its exposure is **OpenAI as a customer**: $10.0B of revenue in the September 2026 quarter (10.8% of Microsoft's total), roughly equal to OpenAI's own quarterly revenue (press). That is concentration and credit risk, not margin dilution.
5. **Reported results contradict a "collapse".** AWS earned a 38.7% operating margin in Q3 2026 while growing 39%. Microsoft's operating margins held while its cloud gross margin fell 71% → 66%. No company reports third-party AI profitability, so segment data cannot settle the per-workload question either way.
6. **The same arithmetic, and the same circularity, apply to Google.**
   - Selling Claude on Vertex, we keep the same thin fee AWS does.
   - We subsidize too. In our model, Gemini's 50% introductory pricing is roughly break-even in year one after model cost.
   - Google Cloud's 36% margin excludes ~$25B a year of Alphabet-level model development.
   - Anthropic is ≥21.6% of our Cloud backlog, against ~19% of AWS's.
   - Alphabet's 2026 earnings lean on the same stake mark-ups.

**What this means competitively:** treat competitor incentives as rational, time-limited acquisition spending, not as proof of a broken model.

- Do not answer them with permanent price cuts.
- Match only where matching changes the outcome. The bar is low on Gemini and high on resold Claude.
- Win on the customer's multi-year bill and on what lasts after the credit expires (§10).

---

## 2. Scope, sources and what exists

- **Anthropic's S-1 exists.**
  - Filed October 26, 2026 ([S-1](https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm)) and amended November 2 ([S-1/A No. 1](https://www.sec.gov/Archives/edgar/data/2130357/000162828026068676/anthropicpbc-sx1ax1.htm)).
  - The IPO priced November 18 at $83; the final prospectus was filed November 19 ([424B4](https://www.sec.gov/Archives/edgar/data/2130357/000162828026074944/anthropicpbc-424b4.htm)).
  - The 424B4 left all channel, marketplace, sales-and-marketing and cost-of-revenue figures unchanged. It added October 31 Run-Rate Revenue (~$81B) and updated commitments ($900.9B, of which $186.2B is contingent or terminable).
- **OpenAI has no public S-1.** Nothing is on EDGAR as of November 26, 2026; a confidential draft has been reported. OpenAI figures are company statements or press estimates.
- **Amazon, Microsoft and Alphabet:** nine quarters of 10-Q/10-K and earnings-release data (Q3 2024 – Q3 2026; Microsoft FY25 Q1 – FY27 Q1), read from EDGAR.
- **Pricing and incentive programmes.** AWS, Azure and Google pages could be read only through search extracts in this environment; those items are graded medium or low confidence.
- **The field observation** ("~35% AWS incentives via MAP for Anthropic workloads") is treated throughout as unverified (§5.4).

---

## 3. The forensic heart: who is the seller?

| Route | Principal to the customer | Cloud keeps | Cloud bears | Model maker keeps | Evidence |
|---|---|---|---|---|---|
| AWS Bedrock × Claude | Anthropic | Distribution fee on Anthropic's price, plus margin on any *incremental* serving compute Anthropic buys from AWS | AWS-funded credits; platform and account costs | Price − fee − serving compute | S-1/A pp. F-17, F-22 (Disclosed) |
| Azure × OpenAI | Microsoft | Net revenue | Serving infrastructure, cost of capital, discounts, credits | Nothing per token since Apr 2026. Microsoft receives a capped share of OpenAI's revenue to 2030 | Microsoft FY26 Q3 call; Apr 27, 2026 blog (Reported) |
| Vertex × Gemini | Google | Net revenue | TPU serving, cost of capital, discounts, credits, and model development outside Cloud's segment | n/a | Alphabet segment note (Disclosed) |
| Vertex × Claude (control) | Anthropic | Distribution fee + incremental compute margin | Google-funded credits; platform costs | Price − fee − serving | S-1/A (Disclosed) |

What follows from this structure:

- **Who funds what.**
  - Negotiated Claude discounts are Anthropic's: AWS's enterprise-discount (EDP) pricing reportedly covers Bedrock only for Amazon Nova and Titan, so Claude discounts come as Anthropic private offers (Reported, medium confidence).
  - A *cloud-funded* credit comes out of the cloud's fee, not out of Anthropic's revenue.
  - The filing mentions no CSP-funded credits, marketing funds or rebates.
- **What a credit really costs.**
  - AWS promotional credits generally do not apply to Marketplace charges unless authorized (credit terms, via search extracts). MAP credits earned on Claude growth may therefore be redeemed on first-party AWS services.
  - A credit that displaces cash the customer would have paid costs ~$1 per $1. One that funds new first-party consumption costs roughly the marginal cost, ~35¢.
  - We use **80¢** (range 35¢–$1).
- **Avoid double counting compute.**
  - Anthropic pays for serving: "infrastructure costs associated with serving customer workloads through partner channels" sit in its compute line (S-1/A p. F-22). Often it pays the same cloud.
  - Its AWS spend is a ≥$110B take-or-pay commitment, so we count only *incremental* serving compute. The base is 50%, because Anthropic bought $5.0B of premium short-term compute in Q3 2026 "when customer demand or research needs exceed this long-term capacity". We apply a 30% margin.
- **How AWS books Bedrock-Claude is not disclosed.**
  - Gross booking would dilute AWS's reported margin percentage without changing profit dollars; net booking would not. Amazon's policy of excluding amounts collected for third parties suggests net.
  - Either way, reported segment margins cannot isolate Claude.

### 3.1 How big is the fee? (Calculated; interpretation category 3)

Anthropic's "sales, marketing and partnerships" line "primarily consist[s] of fees paid to channel partners and marketing" (S-1/A p. 148). Combining the disclosed increases in channel fees with the marketplace revenue shares gives:

| Period | Fees to all channel partners ($M) | CSP-marketplace revenue ($M) | Fees ÷ marketplace revenue (low – mid – high) |
|---|---:|---:|---|
| FY2025 | 341–345 | ~2,155 | 15.7% – 15.9% – 16.2% |
| H1 2026 | 2,650–2,869 | ~7,817 | 33.5% – 35.3% – 37.1% |
| Q3 2026 | 2,001–2,361 | ~6,809 | 28.4% – 32.0% – 36.0% |
| 9M 2026 | 4,845–5,171 | ~14,626 | 32.8% – 34.2% – 35.8% |

**Read this as an upper bound on what clouds keep for distribution, not a measured take rate.**

- Reuters made the same calculation for 2025 (~$351M, ~16%); it is not an independent source.
- The numerator may include payments to systems integrators and data platforms. Anthropic funds a $100M partner network in 2026 (p. 198).
- Part of the fee may pay the cloud for *delivering* the service: the line moves with "the cost to deliver our intelligence service". If AWS bears serving cost out of the fee, its net pool is ~$13–16 per $100.
- The 2026 doubling coincides with a restructured Amazon–Anthropic agreement (press reports token-based billing; Amazon disputes the cost impact) and with Anthropic's gross margin stepping up.
- "Changes in the terms of our channel partner distribution arrangements" helped cut S&M from 22% to 14% of revenue between Q1 and Q3 2026 (p. 162). But the Q3 fee range overlaps the nine-month range, so the direction since Q3 cannot be determined.

**Modelling choice.** We use a **30% base fee (range 16–36%) with no drift**. Choosing the higher, 2026-level fee is deliberately conservative against the hypothesis we were asked to test, because it makes AWS's economics look better.

---

## 4. Following $100 through each route

**Base-case assumptions** (all adjustable in the workbook):

- *Common:* list price $100; 10% negotiated discount; 4% distribution and support cost.
- *Agent routes (Claude):*
  - 30% fee; Anthropic funds the discount;
  - Anthropic's serving cost is 14.3% of its revenue (Q3 2026 cost of revenue);
  - 90% is served on the reselling cloud, of which 50% is incremental to Anthropic's commitment, at a 30% cloud margin.
- *Principal routes (OpenAI, Gemini):*
  - serving infrastructure is 20% of list on Microsoft's GPU-heavy fleet and 10% on Google's TPUs (derived; hyperscaler-owned capacity costs ~13% of list on average, range 6–30%);
  - 2.5% of list for cost of capital on serving assets;
  - 50% utilization.
- *Gemini model development:* charged at 25% of net revenue. The anchors are ~6% (Alphabet-level AI spend spread over all Alphabet revenue) and ~58% (a stand-alone lab's R&D intensity).

| Line ($ per $100 of list) | AWS · Claude | Azure · OpenAI | Vertex · Gemini | Vertex · Claude |
|---|---:|---:|---:|---:|
| List price | 100.0 | 100.0 | 100.0 | 100.0 |
| Negotiated discount (who funds) | (10.0) model maker | (10.0) cloud | (10.0) cloud | (10.0) model maker |
| Customer pays (no incentive) | 90.0 | 90.0 | 90.0 | 90.0 |
| Model maker's revenue / royalty paid | 90.0 | 0.0 | 0.0 | 90.0 |
| Cloud keeps from the transaction (fee or net revenue) | 27.0 | 90.0 | 90.0 | 27.0 |
| Serving infrastructure borne by the cloud | — | (20.0) | (10.0) | — |
| — accelerator depreciation / power / network & DC | — | 12.4 / 2.6 / 5.0 | 6.2 / 1.3 / 2.5 | — |
| Cost of capital on serving assets | — | (2.5) | (2.5) | — |
| Compute margin on incremental serving | 1.7 | — | — | 1.7 |
| Distribution, support, platform | (4.0) | (4.0) | (4.0) | (4.0) |
| **Cloud contribution, no incentive** | **24.7** | **63.5** | **73.5** | **24.7** |
| Model-development charge (economic view) | — | — | (22.5) | — |
| Cloud economic contribution | 24.7 | 63.5 | 51.0 | 24.7 |
| **Break-even year-one incentive** (credits at 80¢) | **30.9%** | **79.4%** | **91.9% (63.7% economic)** | **30.9%** |
| Cloud contribution with a 35% cloud-funded incentive | −3.3 | 35.5 | 45.5 | −3.3 |
| Model maker's contribution before R&D | 50.1 | — | — | 50.1 |

**Ranges, AWS · Claude.**

| Seller fee | AWS keeps per $100 | Break-even incentive |
|---|---:|---:|
| 16% (2025 level) | $12.1 | 15% |
| 36% | $30.1 | 38% |

If each credit dollar costs AWS a full dollar, the break-even falls to ~25%.

**Anthropic's side.** On a marketplace dollar Anthropic keeps ~$50 after the fee and serving cost, against ~$86 on a direct dollar. That is why it is steering share to direct.

**The control case.** Vertex × Claude uses the same parameters as Bedrock × Claude, and the point is exactly that: on resold Claude, Google's slice is the same thin fee AWS earns.

---

## 5. The mathematical limits of subsidy

### 5.1 The grid (AWS · Claude; per $100 of year-one list; AI line only)

| Incentive | Customer pays | AWS keeps yr 1 | Extra usage needed if recurring | Payback if one-time | 5-yr value, one-time | 5-yr value, recurring |
|---:|---:|---:|---:|---:|---:|---:|
| 0% | 90.0 | 24.7 | — | — | 117.8 | 117.8 |
| 10% | 80.0 | 16.7 | 1.48× | 4 mo | 109.8 | 77.4 |
| 20% | 70.0 | 8.7 | 2.83× | 8 mo | 101.8 | 37.1 |
| 25% | 65.0 | 4.7 | 5.22× | 10 mo | 97.8 | 16.9 |
| 35% | 55.0 | −3.3 | not recoverable | 13 mo | 89.8 | −23.5 |
| 40% | 50.0 | −7.3 | not recoverable | 15 mo | 85.8 | −43.6 |
| 50% | 40.0 | −15.3 | not recoverable | 19 mo | 77.8 | −84.0 |

**Lifetime assumptions.**

- AI spend grows 30% a year.
- There is an 85% chance each year that the workload stays.
- Discount rate is 10%; flows are counted mid-year and incentives are paid at the start of each year.
- List prices fall 35% a year and serving cost 40% a year.
- The fee does not drift.

"Extra usage needed" is the volume multiple that keeps contribution dollars unchanged under a permanent incentive: M₀ ÷ (M₀ − incentive cost). Above break-even no extra usage can recover the cost *on the AI line alone*.

**Other routes** (year 1 / 5-yr one-time / 5-yr recurring):

| Incentive | Azure · OpenAI | Vertex · Gemini | Vertex · Claude |
|---:|---|---|---|
| 0% | 63.5 / 321.0 / 321.0 | 73.5 / 362.2 / 362.2 | 24.7 / 117.8 / 117.8 |
| 10% | 55.5 / 313.0 / 280.6 | 65.5 / 354.2 / 321.8 | 16.7 / 109.8 / 77.4 |
| 20% | 47.5 / 305.0 / 240.2 | 57.5 / 346.2 / 281.5 | 8.7 / 101.8 / 37.1 |
| 25% | 43.5 / 301.0 / 220.1 | 53.5 / 342.2 / 261.3 | 4.7 / 97.8 / 16.9 |
| 35% | 35.5 / 293.0 / 179.7 | 45.5 / 334.2 / 220.9 | −3.3 / 89.8 / −23.5 |
| 40% | 31.5 / 289.0 / 159.5 | 41.5 / 330.2 / 200.7 | −7.3 / 85.8 / −43.6 |
| 50% | 23.5 / 281.0 / 119.2 | 33.5 / 322.2 / 160.4 | −15.3 / 77.8 / −84.0 |

### 5.2 Incentive types are not interchangeable

A 35% incentive on AWS · Claude, per $100 of year-one list:

| Type | How it works | 5-yr value, AI only | 5-yr value, + base adjacency | Payback | Customer's effective discount (3 yr / 5 yr) |
|---|---|---:|---:|---:|---:|
| None | — | 117.8 | 185.2 | — | 0% / 0% |
| One-time migration credit | 35% of year-one spend, once | 89.8 | 157.2 | 13 mo | 10.5% / 5.7% |
| Consumption-based (MAP-style) | 35% of spend *growth* each year for a 3-year plan | 84.5 | 151.8 | 15 mo | 12.8% / 6.9% |
| Commitment-conditional | One-time credit that secures a 3-year commit, with $0.50 of committed adjacent spend per $1 of AI | 121.1 | 325.8 | 13 mo | 8.8% / 4.4% |
| Recurring price discount | 35% off every year | −23.5 | 43.9 | never | 35% / 35% |
| Partner- or model-provider-funded | Any of the above, with a share paid by an SI or by Anthropic | The cloud's cost falls in proportion | | | |

"Base adjacency" means $0.40 of non-AI cloud revenue per $1 of AI, half of it genuinely new, at a 70% gross margin: ~$14 of gross profit per $100 a year. No cloud discloses this, so it is an assumption (category 3).

**A 35% one-time incentive is not a permanent 35% price cut.**

- To a growing customer it is worth ~10% of list over three years and ~6% over five.
- The "year-two cliff" when it expires is +54% at constant prices, or +64% if a 10% discount also applies.
- If list prices keep falling ~35% a year, the bill for the same work barely moves (0–6%). The customer's real loss is the year of price-cut savings the credit absorbed.

### 5.3 When a 35% incentive is rational and when it destroys value (AWS · Claude)

**The counterfactual test.** The values above assume the incentive wins a workload that would otherwise be lost. If the customer would have come anyway, the incentive is a pure transfer. An incentive is worth paying only if it lifts the win probability by at least:

> base win rate × (value without − value with) ÷ value with

| Route | Lift needed as a share of the base win rate | Example: base 20% | Example: base 50% |
|---|---:|---|---|
| AWS · Claude | ~31% | 20% → 26% | 50% → 66% |
| Vertex · Claude | ~31% | 20% → 26% | 50% → 66% |
| Azure · OpenAI | ~10% | 20% → 22% | 50% → 55% |
| Vertex · Gemini | ~8% | 20% → 22% | 50% → 54% |

**Single-assumption sensitivity** of the 5-year value of a one-time 35% incentive (base $89.8):

| Assumption | Low → High | 5-yr value (low / high) | Break-even incentive (low / high) |
|---|---|---:|---:|
| Customer growth | 0% → 80% | 46.6 / 222.5 | — |
| Cloud's seller fee | 16% → 36% | 29.2 / 115.8 | 15.2% / 37.7% |
| Customer retention | 70% → 97% | 55.0 / 128.1 | — |
| Fee renegotiation per year | −4 pts → 0 | 55.0 / 89.8 | — |
| Selling and support cost | 2% → 8% | 99.4 / 70.6 | 33.4% / 25.9% |
| Price cuts per year | 15% → 65% | 87.3 / 115.1 | — |
| Negotiated discount | 5% → 20% | 97.4 / 74.6 | 32.9% / 26.9% |
| What $1 of credit costs the cloud | 35¢ → $1 | 105.6 / 82.8 | 70.7% / 24.7% |
| Share of discount Anthropic funds | 50% → 100% | 73.4 / 89.8 | 26.7% / 30.9% |
| Incremental compute | 0% → 100% | 82.6 / 97.0 | 28.7% / 33.1% |

**Rational when:**

- the incentive is one-time, growth-based or commit-linked, and time-limited;
- the customer stays beyond ~13–17 months (~26 months at a 16% fee);
- it lifts win odds by ≥ ~31% of the base rate;
- adjacent workloads or a broader commit come with it.

**Value-destructive when:**

- the incentive is permanent and fully AWS-funded, *and* incremental non-AI gross profit is below ~$5–12 per $100 a year;
- or the incentive goes to usage AWS would have won anyway;
- or the usage merely shifts between Anthropic's channels, so neither the commitment nor the equity benefits.

**Pessimist corner.** With a 16% fee, no incremental compute, a fee falling 4 points a year, credits costing $1 and no adjacency, even a one-time 35% never pays back within five years (−$20), and a permanent one loses −$161. That is a real but narrow case, and it is the case in which AWS would simply stop offering the incentive.

### 5.4 The field observation: "35% via MAP for Anthropic workloads"

- **Documented** (search extracts of AWS-hosted terms; medium confidence):
  - MAP credits are a plan-specific percentage of growth in trailing-12-month spend on included services, over the migration plan's term.
  - Claude (Amazon Bedrock Edition) is on the MAP included-services list, and Bedrock has been MAP-eligible since December 2024.
- **Reported** (low confidence): typical MAP credits of ~25% of incremental spend.
- **Not found:** any public source for 35%, or for an Anthropic-specific rate.
- **Read.** 35% is plausible as a *stacked* deal: MAP (~25%) plus an Anthropic private-offer discount (Anthropic-funded), POC funding or partner pass-back. It is not a published policy. It may also be confused with the ~32% channel take Anthropic pays clouds. Anthropic co-funding of MAP credits was not found.
- **Implication.** Ask for the paperwork (§10.3). MAP credits are paid on growth, over a plan term, in AWS credit currency. Economically that is a *consumption-based, time-limited* incentive, not a recurring discount.

### 5.5 Declining prices, utilization and efficiency

- **Prices vs costs.** List prices for a given frontier tier fall ~35% a year (Opus 5 → 5.5 −20%; GPT Sol −60% in ~10 weeks). Serving cost per token falls ~40% a year (hardware cost per FLOP −27% a year, plus software gains). The serving-cost ratio therefore *declines* slowly, ~13% → ~9% of list over five years.
- **Price-war case.** 50% price cuts against only 30% efficiency gains push the ratio to ~18%. Gemini 4 Argon's list price *doubles* after its introductory period, which points to scarcity rather than a race to zero.
- **Utilization.** Each 10-point drop below 50% adds ~3–5 points of serving cost per $100.
- **Who carries the risk.** The principal routes (Azure, Gemini) carry it directly. The agent routes pass it to Anthropic: its $5.0B of Q3 2026 premium short-term compute shows a capacity squeeze costs the model maker, not the reseller.

---

## 6. The circular economics

### 6.1 Amazon ⇄ Anthropic

- **Equity in.**
  - $18.0B of cash: $8.0B of notes (2023–25) plus $5.0B Series G and $5.0B Series H in Q2 2026 (Amazon 10-Q Q3 2026, Note 2; 424B4).
  - Up to $15B more is released in $5B tranches only as AWS hits compute-capacity milestones, and can be settled by set-off against amounts Amazon owes Anthropic.
- **Compute out.** ≥$110.0B of take-or-pay AWS spend, May 2026 – April 2036, "regardless of actual usage", subject to "adjustments and exceptions" and AWS chip-performance obligations. Anthropic's minimums are ~19% of AWS's $578B backlog (Calculated).
- **Fees.** A share of ~$5B of 9M 2026 channel-partner fees (not split by cloud).
- **Accounting.**
  - Amazon carries $238.7B of Anthropic investments: notes at fair value of $146.2B, with a $140.3B pre-tax gain in accumulated other comprehensive income; and preferred stock at $92.5B. Anthropic marks the same notes at $130.5B.
  - About **$67B of Amazon's 9M 2026 pre-tax income (~46%)** came from Anthropic, all below operating income. AWS's segment profit contains none of it.
  - At the $83 IPO price Amazon's economic interest (~3.48B shares, including notes that could not convert under the ownership cap) is worth ~$289B, ~16× cash invested.
  - Amazon also invested $50.0B in OpenAI preferred stock in 2026.
- **Read.** We found no evidence of improper accounting. AI revenue is, however, partly vendor-financed (category 2): the cloud invests in a lab that commits to spend on the cloud.

### 6.2 Microsoft ⇄ OpenAI

- **Equity.** Microsoft's stake is ~24%, diluted from ~27% (Reported). OpenAI's losses no longer reach Microsoft's P&L: +$272M in FY27 Q1, against −$4.1B in FY26 Q1.
- **Commitments and licence.**
  - October 2025: an incremental $250B of Azure; Microsoft gave up its right of first refusal (8-K exhibit).
  - April 27, 2026 amendment:
    - Microsoft stops paying OpenAI a revenue share.
    - OpenAI's ~20% share to Microsoft continues to 2030 under a cap (reported ~$38B).
    - The licence runs to 2032 and becomes non-exclusive.
    - OpenAI may sell on any cloud. Press reports say AWS now distributes OpenAI models too (unverified).
    - Source: Microsoft blog and call (Reported, medium-high confidence).
- **Revenue.** $24.1B from OpenAI in FY26 and $10.0B in FY27 Q1 (10.8% of revenue). OpenAI was ~45% of commercial RPO at December 2025. The OpenAI receivable rose from $6.0B to $7.2B in one quarter.
- **Read.** We found no evidence of below-list pricing to OpenAI. The exposure is concentration, duration and counterparty credit risk:
  - $364.6B of leases signed but not commenced;
  - $743.8B of contractual obligations;
  - a customer whose ability to pay depends on raising outside capital.

### 6.3 Google ⇄ Anthropic (the same pattern)

- **Equity and financing.** ~$23B of cash invested, including the $10B IPO private placement, plus up to $10B more linked to compute and revenue targets.
- **Commitments.** ≥$121.3B owed to Google Cloud (Apr 2026 – Jul 2033), plus $125–150B of additional TPU capacity excluded from the aggregate. Anthropic is ≥21.6% of our $560.8B Cloud backlog.
- **Earnings.** Alphabet's 9M 2026 gains on equity securities ($127.3B) exceeded its operating income ($121.0B). Under the measurement alternative it books none of Anthropic's losses. Its stake is ~$147B at the IPO price.
- **Other support.** Google backstops ~$48.0B of third-party data-centre obligations through credit derivatives, books TPU hardware sales upfront with buyback options, and carries $16.8B of related-party backlog (Crux AI).
- **Cash.** Alphabet's free cash flow was −$5.9B in Q2 and −$9.1B in Q3 2026. It raised ~$143B of debt and equity in 2026.

### 6.4 Operating business vs investment returns

- **Keep the two separate.**
  - *The cloud operating business* earns fees, compute margin and adjacent services, and pays any incentives.
  - *The investment portfolio* earns valuation gains on the lab.
- **How they interact.** A subsidy that thins AWS's operating margin can still raise Amazon's total return if it creates *new* Anthropic revenue. At a 23% stake and ~14× run-rate revenue (~$1.1T market value at $83 ÷ $81B run-rate), each $100 of genuinely new Anthropic revenue adds ~$290 of stake value.
- **What it takes.** In the base case a permanent 35% discount on Claude is covered if ~8% of the subsidized usage is new to Anthropic.
- **Limits.** The gain is non-cash and depends on the multiple holding. It is zero for usage merely shifted between channels — and incentives mostly shift channel.

---

## 7. Vertical integration: does Google keep more of each dollar?

**Per dollar, yes: that is arithmetic. More profitable overall: not provable from outside.**

| | Google (Gemini on TPU) | AWS (Claude on Trainium) | Microsoft (OpenAI on GPUs/Maia) |
|---|---|---|---|
| Silicon | Own TPUs (designed with Broadcom, which takes a margin). Avoids NVIDIA's ~75% gross margin. Independent estimates put internal TCO ~30–44% below GB200 (Reported, medium-low) | Own Trainium serves most Bedrock usage; claimed 30–40% better price-performance (Reported) | Mostly NVIDIA/AMD, so it pays merchant margin; Maia 200 in production, scale unproven |
| Model IP | Owns Gemini | None on Claude (Nova is first-party) | Royalty-free, non-exclusive licence to OpenAI models until 2032 |
| Royalty / revenue share | None | Anthropic sets the price; AWS keeps a fee | None since April 2026 |
| Model development cost | Fully borne: Alphabet-level AI spend $24.7B TTM (+81%), outside Cloud's margin | None for Claude | None per token for OpenAI models; MAI spend separate |
| Per $100 before incentives (base) | $74 ($51 after model cost) | $25 | $64 |
| Capital intensity | Highest: serving plus training | Lowest: Anthropic pays for serving | High: serving |
| Pricing flexibility | Highest | Lowest on Claude | High on OpenAI models |

**What this does and doesn't establish.**

- Google can afford larger and longer incentives on Gemini than AWS can on Claude: a year-one break-even of 92% (64% after model cost), against 31%.
- "No royalty" is not "no cost". Charging Google Cloud its 24% revenue share of Alphabet-level AI cost takes the Q3 2026 margin from 36.2% to ~30%.
- Google is subsidizing too. Gemini 4 Argon and 3.8 Flash launched at 50% introductory prices, which in our model are roughly break-even in year one after model cost. Startup credits pay for Gemini but not Claude.
- The cost advantage has not yet won the market. Menlo's survey (Menlo is an Anthropic investor) puts Gemini at 9% of enterprise API spend, down from 21%, against Anthropic's 55%. The TPU edge is being monetized largely by selling capacity to Anthropic.

**Contractual offsets to Google's apparent advantage:**

- Microsoft's royalty-free OpenAI licence gives it most of the same per-dollar economics without paying for training.
- AWS earns owned-silicon margin on Trainium and bears little capital on the resale route.
- Both rivals are paid as the vendor first, through take-or-pay compute.

---

## 8. Validation against reported earnings (Q3 2024 – Q3 2026)

| | Q3 2024 | Q3 2025 | Q3 2026 | Read |
|---|---:|---:|---:|---|
| AWS revenue ($B) / growth | 27.5 / 19% | 33.0 / 20% | 46.0 / 39% | Accelerating |
| AWS operating margin | 38.1% | 34.6% | 38.7% | Range 32.9–39.5%; no collapse |
| AWS D&A ÷ revenue | 12.9% | 17.1% | 20.1% | D&A +63% YoY vs revenue +39% |
| AWS return on average segment assets | ~30% (FY24) | — | ~19% (TTM) | Falling. ROIIC ~9–12% same-period, ~21% lagged |
| Amazon FCF, TTM ($B) | 47.7 | 14.8 | −42.4 | Before $65B of AI-lab investments |
| Microsoft Cloud gross margin | 71% | 68% | 66% | "Scaling our AI infrastructure" through FY26 Q3, then "sales mix shift to Azure" |
| Microsoft Agents & Infra operating margin | 51.8% | 53.1% | 52.8% | Held |
| Microsoft pre-tax ROIIC | — | 29.3% | 23.5% (34.9% lagged) | High but falling |
| Google Cloud revenue ($B) / growth | 11.4 / 35% | 15.2 / 34% | 30.7 / 103% | Includes upfront TPU hardware sales and Wiz; not comparable with AWS/Azure |
| Google Cloud operating margin | 17.1% | 23.7% | 36.2% | ~30% if charged 24% of Alphabet-level AI cost |
| Alphabet capex ÷ depreciation | 3.3× | 4.3× | 6.1× | 39% of net PP&E not yet in service |
| Alphabet FCF, quarter ($B) | 17.6 | 24.5 | −9.1 | Negative in Q2 and Q3 2026 |

**Management commentary.**

- Amazon (Olsavsky, Oct 29, 2026): AI margins are "ahead of where the core was at a similar point in time, but they're still lower, so there's going to be that mix issue" (third-party transcripts).
- Amazon (Jassy, same call): "most Bedrock usage runs on Trainium, which offers strong price performance and margins."
- Microsoft's MD&A attributed the cloud gross-margin decline to "scaling our AI infrastructure" in every quarter to March 2026.

**Conclusion.**

- Reported results do **not** support the hypothesis that third-party AI workloads are wrecking hyperscaler economics. Whatever AWS spends on incentives is already inside a 38.7% margin that rose while revenue grew 39%.
- Segment disclosures are **insufficient** to show whether third-party AI is less profitable than first-party AI. No company splits it out, and AWS does not say whether Bedrock-Claude is booked gross or net.
- Margin moves cannot be attributed to AI alone: depreciation lives, energy derivatives (AWS Q2 2026, +$551M), mix and pricing all move them.

**Two things the results do show:**

- **The capital test is ahead for all three.** Depreciation grows 49–63% a year and lags capex.
- **A large share of 2026 profit is paper gains on AI-lab stakes, at Amazon and Alphabet alike.**

---

## 9. The strongest counterargument, and what the independent review changed

An independent reviewer argued that *AWS and Microsoft are entirely rational to subsidize aggressively*. On base inputs, any one of these is enough to defeat the "unsustainable" thesis:

1. **The incentive is time-limited** (one-time, MAP-style or commit-linked): 5-year value +$85 to +$121 per $100, payback ~13–15 months.
2. **The credit funds new first-party consumption** (cost ~35¢ per $1): even a recurring 35% is +$56.
3. **Anthropic or a partner funds part of the 35%.**
4. **Incremental non-AI gross profit reaches ~$5–12 per $100 a year.** Our base assumption is $14.
5. **~8% of the subsidized usage is new revenue for Anthropic** (the Amazon equity view).
6. **The question is Microsoft and Azure OpenAI:** royalty-free, year-one break-even ~79%.

**Further counterpoints:**

- **Filling committed capacity.** AWS built Project Rainier and multi-gigawatt Trainium for Anthropic and OpenAI. Anthropic buys premium short-term compute when demand exceeds its commitments.
- **Commit burn.** Claude on Bedrock draws down AWS commitments without any AWS price discount.
- **Platform retention.** Bedrock is multi-model: a customer that moves from Claude to Nova or OpenAI stays on AWS, often at a higher AWS margin.
- **Land-grab economics.** At Menlo's 55% Anthropic share, being the default channel for the share leader is worth a customer-acquisition cost.

**What the review changed in this memo:**

1. Amazon's cash invested corrected from ~$13B to **$18.0B** (16×, not 22×).
2. The channel-fee reading moved to category 3, with a range ($12–30 central ~$25; $13–16 if the fee pays for serving).
3. Adjacency and equity are reported alongside the AI-only lens instead of being left off.
4. A counterfactual (win-probability) test is applied to AWS as well as to Google.
5. Commit-conditional results are reported, and an engine error that charged churn during the commit term was fixed.
6. Incremental compute raised from 25% to 50%, given Anthropic's premium short-term compute.
7. Credit cost set at 80¢, not $1, with the full range shown.
8. A cost of capital is added to the principal routes.
9. The year-two "cliff" is reported with and without price deflation.
10. Microsoft's exposure reframed as customer concentration.
11. Google's own subsidies, its Anthropic dependence, and Alphabet's negative FCF and 2026 financing added.
12. Alphabet-level growth labelled correctly (+81% TTM; +71% in Q3).

**Our verdict after the challenge:** the "unsustainable" thesis is not supported by the evidence and, for Microsoft's resale economics, is contradicted. The narrower conclusions in §1 survive.

---

## 10. JAPAC go-to-market implications

### 10.1 What to tell leaders and sellers

1. **Don't call the competitor's model unsustainable.** It isn't, and customers' CFOs will check. Credibility is the asset.
2. **Don't match indiscriminately; never answer a one-time credit with a permanent discount.** Their coupon costs them once; our price cut costs us every year. Compare offers on the customer's three-year bill.
3. **Match when it changes the outcome, and lead with the product that can carry it.**
   - Matching a 35% one-time offer on Gemini pays if it lifts our win odds by ~8% of the base rate (50% → 54%).
   - On Claude resold through Vertex it needs ~31% (50% → 66%), because our slice is the same thin fee AWS earns.
   - Where the customer needs Claude, compete on platform, guaranteed capacity, in-region data residency, governance and model choice, not on credits.
4. **Separate temporary incentives from sustainable price-performance.** Credits expire; owned-silicon price-performance, capacity guarantees and residency don't. Ask of every competitor offer: what does month 13 cost, and who pays for it?
5. **Position lifetime TCO honestly.**
   - A 35% year-one credit is ~10% over three years and ~6% over five.
   - Its expiry raises the bill ~54% at constant prices. If list prices keep falling it mainly costs the customer a year of savings; show both.
6. **Compete on model choice while respecting the economics.**
   - If the customer wants Claude, run it on Vertex: it is still Google revenue and TPU utilization.
   - Then earn the right to route high-volume steps to Gemini, where our economics are strongest.
   - Keep seller compensation model-neutral on consumption so reps don't push the wrong model.

### 10.2 Customers whose AI economics may change when incentives expire

Flag accounts where:

- credits were sized on year-one or growth spend and expire within six months;
- growth-based credits are running out of headroom;
- the workload is mostly stateless inference with little data gravity;
- finance tracks cost per task;
- an EDP/MACC commitment renews within a year.

Prepare a "month-13" comparison for each.

### 10.3 Field intelligence to collect, deal by deal

1. **Incentive form:** one-time credit, credits on growth (MAP), recurring discount, or commit-linked credit.
2. **Funder:** AWS, Anthropic private offer, partner pass-back, or a mix. Get the paperwork, not the headline percentage.
3. **Currency:** credits redeemable on Claude/Marketplace, or on first-party AWS services only.
4. **Base and cap:** list or net; all spend or growth over a baseline; the cap.
5. **Timing:** term, expiry and promised renewal terms.
6. **Conditions:** minimum commit, tagged workloads, migration partner, Marketplace drawdown caps.
7. **Model and endpoint:** global or regional pricing, and whether the customer's AWS commit discount applies to Claude.
8. **Footprint:** the adjacent workloads that move with the AI workload.

Aggregated across JAPAC, these eight items would directly test the 35% report and our fee, credit-cost and attach assumptions.

---

## 11. Open questions that would change the answer

- **CSP-specific fees.** The split of the 2026 channel-fee pool between AWS, Google, Microsoft and non-cloud partners, and between distribution and delivery.
- **Booking.** Whether AWS books Bedrock-Claude gross or net.
- **MAP terms.** Actual MAP rates and credit currency on Anthropic workloads, and any Anthropic co-funding.
- **Adjacency.** Measured incremental non-AI attach per $1 of AI spend in our own JAPAC base.
- **Gemini cost.** Gemini's fully loaded model-development cost per dollar of revenue (internal data).
- **OpenAI.** Whether OpenAI's capped revenue share binds before 2030, and OpenAI's ability to keep funding its Azure bills.

---

## Appendix A. Base-case assumptions

All assumptions, with low, base and high values and the basis for each, are in the workbook's *Assumptions* sheet and in `src/lib/subsidy-math/params.json`.

| Assumption | Range |
|---|---|
| Channel fee | 16–36% (base 30%, no drift) |
| Credit cost to the cloud | 35¢–$1 (base 80¢) |
| Incremental compute | 0–100% (base 50%) at a 15–40% margin |
| Serving infrastructure | 6–30% of list; route bases 10–20% |
| Cost of capital | 1–6% of list (base 2.5%, principal routes) |
| Utilization | 30–70% |
| Distribution cost | 2–8% |
| Growth | 0–80% |
| Retention | 70–97% |
| Price deflation | 15–65% a year |
| Efficiency | 25–60% a year |
| Adjacency | $0.10–1.20 gross attach at 25–100% incremental |
| Equity stake | 13–27% |
| Equity multiple | 6–25× |

## Appendix B. Principal sources

- Anthropic S-1 (Oct 26, 2026), S-1/A (Nov 2, 2026) and 424B4 (Nov 19, 2026): revenue recognition and concentrations (pp. F-17, F-22); quarterly results (p. 160); S&M commentary (pp. 148, 152, 162); contractual obligations (pp. 173–178); principal stockholders (424B4 p. 298).
- Amazon 10-Q Q3 2026 (Notes 1, 2, 4, 8) and earnings releases Q3 2024 – Q3 2026; Q3 2026 earnings call.
- Microsoft 10-K FY26 and 10-Q Sep 2026 (related-party Note 1; MD&A segment results; leases); FY26 Q3 earnings call; Apr 27, 2026 partnership blog.
- Alphabet 10-Q Q3 2026 (segment note; OI&E; RPO) and earnings releases Q3 2024 – Q3 2026; Broadcom 8-K (Apr 2026).
- NVIDIA Q3 FY27 results; SemiAnalysis InferenceX (via secondary sources); Epoch AI; Menlo Ventures 2026; Reuters (Sep 30, 2026).
- The full source register with URLs is in the workbook's *Sources* sheet and on the [interactive site](/subsidy-math#downloads).
