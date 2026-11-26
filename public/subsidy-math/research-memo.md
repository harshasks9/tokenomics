# The Economics of AI: Is the Hyperscaler Subsidy Model Sustainable?

**Financial research memo · JAPAC AI go-to-market · as of November 26, 2026**
Independent analysis from primary filings, company statements and credible reporting. Not investment advice. Companion files: [executive email](/subsidy-math/email) · [claims audit](/subsidy-math/claims) · [Excel model](/subsidy-math/subsidy-math-model.xlsx) · [interactive site](/subsidy-math).

**Labels.** *Disclosed* = in a company filing (page given). *Reported* = company statement on a call or blog, or credible press. *Calculated* = our arithmetic on disclosed or reported figures. *Assumption* = a modelling input, adjustable in the workbook. Every dollar figure "per $100" refers to $100 of list-price (rate-card) frontier-model consumption in year one.

---

## 1. The answer

**The evidence does not establish that AWS's or Microsoft's subsidy model is structurally unsustainable.** We tried to prove it and could not. What the evidence supports is narrower, and more useful:

1. **Reselling a third-party model is a thin-slice business.** Anthropic's IPO filing shows that when Claude is sold through a cloud marketplace, Anthropic is the principal: it sets the price, books the revenue, and the cloud acts as a "collection agent" (S-1/A pp. F-17, F-22). The cloud keeps a distribution fee. Our bounds put that fee at ~16% of marketplace revenue in 2025 and ~28–36% (central ~32%) in Q3 2026, if all of Anthropic's channel-partner fees went to the clouds. In our base case AWS keeps **~$24 of every $100** of Claude before incentives, against ~$66 for Microsoft on OpenAI models (royalty-free since April 2026) and ~$76 for Google on Gemini before Gemini's own development cost (~$54 after it).
2. **So the form of the incentive matters more than its size.** A 35% incentive costs AWS ~1.5× its year-one slice. **Paid once**, it is an ordinary customer-acquisition cost: base-case payback ~18 months, five-year value $60 vs $92 with no incentive. **Paid every year**, it can never be recovered from AI usage alone (five-year value −$69) — it needs roughly $0.16–0.21 of genuinely incremental non-AI cloud spend per $1 of AI to break even, which is about what typical attach is estimated to be (low confidence).
3. **The resale margin is not where AWS's money is.** Anthropic owes AWS ≥$110B of take-or-pay compute; Amazon's Anthropic stake is worth ~$289B at the $83 IPO price for ~$18B of cash invested; Anthropic marks produced ~$67B of Amazon's nine-month pre-tax income. At the corporate level, subsidizing Claude adoption can be rational even where it thins AWS's operating margin — provided the subsidized usage is genuinely new to Anthropic, not merely moved between channels.
4. **For Microsoft the premise largely fails.** Since the April 27, 2026 amendment Microsoft no longer pays OpenAI a revenue share; its CFO describes the licence as "royalty free" through 2032. Azure OpenAI is now economically closer to a first-party product than to Bedrock's Claude resale. Microsoft's real exposure is OpenAI as a customer: $24.1B of FY26 revenue (10.8% of revenue in the September 2026 quarter), paid largely from OpenAI's outside capital.
5. **Reported results contradict the "collapse" story.** AWS's operating margin was 38.7% in Q3 2026 while it grew 39%; Microsoft's operating margins held even as Microsoft Cloud gross margin fell 71% → 66%. Segment disclosures are insufficient to show whether third-party AI workloads are less profitable than first-party ones; no company reports it.
6. **The same arithmetic applies to Google.** When we sell Claude on Vertex we earn the same thin fee AWS does. Google also subsidizes (introductory Gemini pricing, startup and migration credits), Google Cloud's 36% margin excludes ~$25B a year of Alphabet-level model development, and Alphabet's 2026 earnings lean on the same Anthropic mark-ups.

**The defensible competitive conclusion:** competitor incentives are a rational, time-limited cost of winning customers — not evidence of a broken business. Google should not match them indiscriminately; it should match where the incentive changes the outcome and our economics can carry it (a low bar on Gemini, a high bar on resold Claude), and win on the customer's multi-year bill and on what lasts after the credit expires.

---

## 2. Scope, sources and what exists

- **Anthropic.** The S-1 *does* exist: filed October 26, 2026 ([S-1](https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm)), amended November 2 ([S-1/A No. 1](https://www.sec.gov/Archives/edgar/data/2130357/000162828026068676/anthropicpbc-sx1ax1.htm)); the IPO priced November 18 at $83 and the final prospectus was filed November 19 ([424B4](https://www.sec.gov/Archives/edgar/data/2130357/000162828026074944/anthropicpbc-424b4.htm)). The 424B4 left all channel, marketplace, sales-and-marketing and cost-of-revenue figures unchanged and added October 31 Run-Rate Revenue of ~$81B and updated commitments ($900.9B).
- **OpenAI.** No public S-1 on EDGAR as of November 26, 2026 (a confidential draft has been reported). OpenAI figures are company statements or press estimates and are labelled as such.
- **Amazon, Microsoft, Alphabet.** Nine quarters of 10-Q/10-K and earnings-release data (Q3 2024 – Q3 2026; Microsoft FY25 Q1 – FY27 Q1), read from EDGAR.
- **Pricing and incentive programmes.** AWS, Azure and Google pages could only be read via search extracts in this environment; those items are graded medium or low confidence.
- **Field observation.** "AWS offering ~35% incentives through MAP for Anthropic workloads" is treated as an unverified field report throughout (§5.4).

---

## 3. The forensic heart: who is the seller?

| Route | Principal to the customer | Cloud keeps | Cloud bears | Model maker keeps | Evidence |
|---|---|---|---|---|---|
| AWS Bedrock × Claude | Anthropic | distribution fee on Anthropic's price + margin on any *incremental* serving compute | AWS-funded credits; platform and account costs | price − fee − serving compute | S-1/A pp. F-17, F-22 (Disclosed) |
| Azure × OpenAI | Microsoft | net revenue | serving infrastructure, discounts, credits | nothing per token since Apr 2026 (Microsoft receives a capped share of OpenAI's revenue to 2030) | Microsoft FY26 Q3 call, Apr 27, 2026 blog (Reported) |
| Vertex × Gemini | Google | net revenue | TPU serving, discounts, credits, model development (outside Cloud's segment) | n/a | Alphabet segment note (Disclosed) |
| Vertex × Claude (control) | Anthropic | distribution fee + incremental compute margin | Google-funded credits; platform costs | price − fee − serving | S-1/A (Disclosed) |

Three implications follow and drive everything else.

- **A cloud-funded credit on a resold model comes out of the cloud's fee, not out of Anthropic's revenue.** Anthropic recognizes revenue at the price it sets, net only of its own concessions; the filing contains no reference to CSP-funded credits, marketing funds or rebates. AWS's enterprise-discount (EDP) pricing reportedly covers Bedrock only for Amazon Nova and Titan, so negotiated Claude discounts come as Anthropic private offers (Reported, medium confidence).
- **Serving compute must not be double counted.** Anthropic pays for serving ("infrastructure costs associated with serving customer workloads through partner channels" are in its compute line, S-1/A p. F-22) — often to the same cloud. But Anthropic's AWS spend is a ≥$110B take-or-pay commitment; serving one more customer inside capacity Anthropic has already committed to pay for earns AWS little new revenue. We therefore count only the *incremental* share of serving compute (base 25%) at a 25% margin.
- **Whether AWS books Bedrock-Claude gross or net is not disclosed.** If gross, reported AWS revenue includes pass-through dollars and the reported margin percentage is diluted without any loss of profit dollars; if net, only the fee is revenue. Profit is identical either way. This is one reason reported margins cannot settle the question.

### 3.1 How big is the fee? (Calculated)

Anthropic's "sales, marketing and partnerships" line "primarily consist[s] of fees paid to channel partners and marketing" (S-1/A p. 148). Combining the disclosed increases in channel fees with marketplace revenue shares gives these bounds (method in the Anthropic research pack):

| Period | Channel-partner fees ($M) | CSP-marketplace revenue ($M) | Implied fee rate (low – mid – high) |
|---|---:|---:|---|
| FY2025 | 341–345 | ~2,155 | 15.7% – 15.9% – 16.2% |
| H1 2026 | 2,650–2,869 | ~7,817 | 33.5% – 35.3% – 37.1% |
| Q3 2026 | 2,001–2,361 | ~6,809 | 28.4% – 32.0% – 36.0% |
| 9M 2026 | 4,845–5,171 | ~14,626 | 32.8% – 34.2% – 35.8% |

- FY2025 is corroborated by Reuters' reading of the prospectus: 2025 sales via Amazon and Google of $2.16B with fees above $350M (~16%).
- **Caveats.** The filing never says which partners receive the fees; if some go to systems integrators, resellers or data platforms, the CSP-only rate is lower. The filing also says the line moves with "the cost to deliver our intelligence service", so part of the fee may pay the cloud for delivery rather than distribution. The 2026 step-up coincides with the new 2026 compute and distribution agreements; the filing does not explain it.
- **Direction.** The fee is falling: S&M dropped from 22% to 14% of revenue between Q1 and Q3 2026, "primarily driven by a decrease in revenue generated from sales through channel partners as a percentage of total revenue and changes in the terms of our channel partner distribution arrangements" (p. 162). Marketplace share fell from 48% (H1) to ~40% (Q3, implied), and Anthropic launched an Anthropic-operated, Marketplace-billed "Claude Platform on AWS" in May 2026 (Reported).

**We use a 30% base fee (range 16–36%) and a −2 point annual drift.** Using the higher 2026 rate is deliberately conservative against our own starting hypothesis: it makes AWS's economics look better.

---

## 4. Following $100 through each route

Base-case assumptions (all adjustable in the workbook): list $100; 10% negotiated discount; agent routes — 30% fee, Anthropic funds the discount, Anthropic serving cost 14.3% of its revenue (Q3 2026 cost of revenue), 90% served on the reselling cloud, 25% of that incremental to the take-or-pay commitment, 25% cloud margin on compute; principal routes — serving infrastructure 20% of list on Microsoft's GPU-heavy fleet and 10% on Google's TPUs (derived; hyperscaler-owned capacity costs ~13% of list on average, range 6–30%), 50% utilization; 4% distribution and support cost; Gemini model development charged at 25% of net revenue (anchors: ~6% if Alphabet-level AI spend is spread over all Alphabet revenue; ~58% at a stand-alone lab's R&D intensity).

| Line ($ per $100 of list) | AWS · Claude | Azure · OpenAI | Vertex · Gemini | Vertex · Claude |
|---|---:|---:|---:|---:|
| List price | 100.0 | 100.0 | 100.0 | 100.0 |
| Negotiated discount (who funds) | (10.0) model maker | (10.0) cloud | (10.0) cloud | (10.0) model maker |
| Customer pays (no incentive) | 90.0 | 90.0 | 90.0 | 90.0 |
| Model maker's revenue / royalty paid | 90.0 | 0.0 | 0.0 | 90.0 |
| Cloud keeps from the transaction (fee or net revenue) | 27.0 | 90.0 | 90.0 | 27.0 |
| Serving infrastructure borne by the cloud | — | (20.0) | (10.0) | — |
| — accelerator depreciation / power / network & DC | — | 12.4 / 2.6 / 5.0 | 6.2 / 1.3 / 2.5 | — |
| Compute margin on incremental serving | 0.7 | — | — | 0.7 |
| Distribution, support, platform | (4.0) | (4.0) | (4.0) | (4.0) |
| **Cloud contribution, no incentive** | **23.7** | **66.0** | **76.0** | **23.7** |
| Model-development charge (economic view) | — | — | (22.5) | — |
| Cloud economic contribution | 23.7 | 66.0 | 53.5 | 23.7 |
| **Break-even year-one incentive** | **23.7%** | **66.0%** | **76.0% (53.5% economic)** | **23.7%** |
| Cloud contribution with a 35% cloud-funded incentive | −11.3 | 31.0 | 41.0 | −11.3 |
| Model maker's contribution before R&D | 50.1 | — | — | 50.1 |

Notes:

- **Anthropic's side.** On a marketplace dollar Anthropic keeps ~$50–57 after the fee and serving cost, against ~$86 on a direct dollar — which is why it is steering share to direct and renegotiating channel terms.
- **Azure pre-amendment.** At the old ~20% revenue share Microsoft would keep ~$48.
- **The serving-cost split** uses ~62% accelerator depreciation, ~13% power, ~25% network, facility and other (infrastructure research; 5-year life). A 3-year life raises the ~13% average serving cost to ~19% of list; a 30% utilization raises it to ~22%.

---

## 5. The mathematical limits of subsidy

### 5.1 The grid (AWS · Claude; per $100 of year-one list; AI line only)

| Incentive | Customer pays | AWS keeps yr 1 | Extra usage needed if recurring | Payback if one-time | 5-yr value, one-time | 5-yr value, recurring |
|---:|---:|---:|---:|---:|---:|---:|
| 0% | 90.0 | 23.7 | — | — | 91.8 | 91.8 |
| 10% | 80.0 | 13.7 | 1.73× | 5 mo | 82.7 | 45.9 |
| 20% | 70.0 | 3.7 | 6.37× | 10 mo | 73.6 | 0.0 |
| 25% | 65.0 | −1.3 | not recoverable | 13 mo | 69.0 | −22.9 |
| 35% | 55.0 | −11.3 | not recoverable | 18 mo | 59.9 | −68.8 |
| 40% | 50.0 | −16.3 | not recoverable | 20 mo | 55.4 | −91.7 |
| 50% | 40.0 | −26.3 | not recoverable | 25 mo | 46.3 | −137.6 |

Lifetime assumptions: AI spend grows 30% a year; 85% chance each year that the workload stays; 10% discount rate; list prices fall 35% a year and serving cost 40% a year; the fee drifts down 2 points a year. "Extra usage needed" is the volume multiple that keeps contribution dollars unchanged under a permanent incentive: M₀ ÷ (M₀ − incentive cost). Above the break-even it is infinite.

The same grid for the other routes (5-yr values; full tables in the workbook):

| Incentive | Azure · OpenAI yr 1 / one-time 5-yr / recurring 5-yr | Vertex · Gemini yr 1 / one-time / recurring | Vertex · Claude yr 1 / one-time / recurring |
|---:|---|---|---|
| 0% | 66.0 / 315.9 / 315.9 | 76.0 / 355.2 / 355.2 | 23.7 / 91.8 / 91.8 |
| 10% | 56.0 / 306.8 / 270.0 | 66.0 / 346.1 / 309.3 | 13.7 / 82.7 / 45.9 |
| 20% | 46.0 / 297.7 / 224.1 | 56.0 / 337.0 / 263.4 | 3.7 / 73.6 / 0.0 |
| 25% | 41.0 / 293.1 / 201.2 | 51.0 / 332.4 / 240.5 | −1.3 / 69.0 / −22.9 |
| 35% | 31.0 / 284.0 / 155.3 | 41.0 / 323.4 / 194.6 | −11.3 / 59.9 / −68.8 |
| 40% | 26.0 / 279.5 / 132.4 | 36.0 / 318.8 / 171.7 | −16.3 / 55.4 / −91.7 |
| 50% | 16.0 / 270.4 / 86.5 | 26.0 / 309.7 / 125.8 | −26.3 / 46.3 / −137.6 |

### 5.2 Incentive types are not interchangeable

A 35% incentive, AWS · Claude, per $100 of year-one list:

| Type | How it works | 1-yr value | 3-yr | 5-yr | Payback | Customer's effective discount (3 yr / 5 yr) |
|---|---|---:|---:|---:|---:|---:|
| None | — | 21.6 | 59.9 | 91.8 | — | 0% / 0% |
| One-time migration credit | 35% of year-one spend, once | −10.3 | 28.1 | 59.9 | 18 mo | 10.5% / 5.7% |
| Consumption-based (MAP-style) | 35% of spend *growth* each year for a 3-year plan | −10.3 | 22.0 | 53.9 | 19 mo | 12.8% / 6.9% |
| Commitment-conditional | one-time credit that buys a 3-year commit with $0.50 of committed adjacent spend per $1 of AI | −10.3 | 38.7 | 70.5 | 17 mo | 8.8% / 5.1% |
| Recurring price discount | 35% off every year | −10.3 | −36.0 | −68.8 | never | 35% / 35% |
| Partner-funded / model-provider-funded | any of the above, with a share paid by an SI or by Anthropic | cost to the cloud falls in proportion to the share funded by others (workbook inputs) |||||

**A 35% one-time incentive is not economically equivalent to a permanent 35% price cut.** To a growing customer it is worth ~10% of list over three years and ~6% over five. When it expires, the customer's effective price at constant usage rises by 1 ÷ (1 − 0.35) − 1 = **54%** (64% if a 10% discount also applies).

### 5.3 When a 35% incentive is rational — and when it destroys value (AWS · Claude)

Single-assumption sensitivity of the five-year value of a one-time 35% incentive (base $59.9):

| Assumption | Low → High | 5-yr value (low / high) | Break-even incentive (low / high) |
|---|---|---:|---:|
| Customer growth | 0% → 80% | 28.9 / 152.6 | 23.7% / 23.7% |
| Cloud's fee | 16% → 36% | 2.1 / 84.7 | 11.1% / 29.1% |
| Retention | 70% → 97% | 35.0 / 87.0 | — |
| Fee renegotiation per year | −5 pts → 0 | 35.1 / 76.5 | — |
| Distribution cost | 2% → 8% | 69.1 / 41.6 | 25.7% / 19.7% |
| Negotiated discount | 5% → 20% | 66.1 / 47.7 | 25.3% / 20.6% |
| Share of discount Anthropic funds | 50% → 100% | 43.1 / 59.9 | 20.3% / 23.7% |
| Incremental compute | 0% → 100% | 57.1 / 68.5 | 23.0% / 25.9% |
| Price deflation | 15% → 65% | 59.0 / 70.0 | — |

**Rational when** the incentive is one-time or growth-based and time-limited; the customer stays beyond ~18 months (~3.5 years if the fee falls back to 2025's ~16%); the incentive actually wins the workload (see §9.2); and the customer brings adjacent workloads or a broader commit.

**Value-destructive when**:

- the incentive recurs above the fee pool (~24% in the base case, ~11% at 2025's fee) without enough genuinely incremental adjacent spend;
- the customer would have chosen the same cloud anyway — then the incentive is a pure transfer;
- the customer leaves at the year-two cliff;
- the fee keeps being renegotiated down while incentives stay;
- the usage is merely shifted from Anthropic's direct channel or another cloud, so neither the commitment nor the equity benefits.

### 5.4 The field observation: "35% via MAP for Anthropic workloads"

- **What is documented** (search extracts of AWS-hosted terms; medium confidence): MAP credits equal a plan-specific percentage × growth in trailing-12-month spend on included services, set per migration plan. Claude (Amazon Bedrock Edition) is on the MAP included-services list, and Bedrock has been MAP-included since December 2024.
- **What is reported** (low confidence): typical MAP credit rates of ~25% of incremental spend; caps sometimes ~$10M ARR.
- **What we could not find:** any public source for 35%, or for an Anthropic-specific rate. A 35% figure is plausible as a stacked deal — MAP (~25%) plus an Anthropic private-offer discount, POC funding or partner pass-back. It is not a published policy. It may also be confused with the ~33% channel take Anthropic pays clouds.
- **Co-funding by Anthropic:** not found.
- **Implication.** Treat the field report as *deal-specific* and ask for the paperwork (§10.3). Because MAP credits are paid on growth over a plan term, the closest model type is "consumption-based", not "recurring".

### 5.5 Declining prices, utilization and efficiency

- **The trend.** List prices for a given frontier tier fell ~35% a year (Opus 5 → 5.5 −20%; GPT Sol −60% in ~10 weeks), while serving cost per token fell ~40% a year (hardware cost per FLOP −27% a year plus software gains). That leaves the serving-cost ratio roughly stable (13% → ~12% next year).
- **A price war** — 50% price cuts with only 30% efficiency gains — raises it to ~18%. Gemini 4 Argon's list price *doubles* after its introductory period, which suggests capacity scarcity, not a race to zero.
- **Utilization.** Each 10-point drop below 50% adds ~3–5 points of serving cost per $100 (serving cost scales with 50 ÷ utilization).
- **Who it matters for.** The principal routes (Azure, Gemini) carry this risk directly. The agent routes pass it to Anthropic, whose Q3 2026 short-term compute premium ($5.0B) shows what a capacity squeeze costs the model maker, not the reseller.

---

## 6. The circular economics

### 6.1 Amazon ⇄ Anthropic

- **Equity in.** About $18B of cash for notes and preferred stock: $8.0B of notes, 2023–25; $5.0B Series G and $5.0B Series H in Q2 2026 (Amazon 10-Q Q3 2026, Note 2). Up to $15B more is released in $5B tranches only as AWS hits compute-capacity milestones, and can be settled by set-off against amounts Amazon owes Anthropic (S-1/A).
- **Compute out.** At least $110.0B of take-or-pay AWS spend, May 2026 – April 2036, "regardless of actual usage" (S-1/A p. ~175). Most Bedrock usage runs on Trainium (Amazon, Q3 2026 call).
- **Fees.** A share of the ~$5B of 9M 2026 channel fees (not split by cloud).
- **Accounting.**
  - Amazon carries the Anthropic notes as available-for-sale debt at fair value ($146.2B; Anthropic marks the same notes at $130.5B) and the preferred stock under the measurement alternative ($92.5B). Total carrying value is $238.7B against ~$18B of cash (Amazon 10-Q).
  - About **$67B of Amazon's 9M 2026 pre-tax income (~46%) came from Anthropic marks**, all below operating income. AWS segment profit contains none of it.
  - At the $83 IPO price Amazon's economic interest (≈3.48B shares, including notes that could not convert under the 12% ownership cap) is worth ≈$289B (Calculated on 424B4 p. 298).
  - Amazon also invested $50.0B in OpenAI preferred stock in 2026 (10-Q).
- **Cash vs accounting.** The cash flows are compute purchases and fee remittances. The gains are non-cash, valuation-dependent and outside the cloud segment. We found no evidence of improper accounting; Amazon discloses no AWS revenue from Anthropic and no related-party treatment.

### 6.2 Microsoft ⇄ OpenAI

- **Equity.** Microsoft's stake is ~24%, diluted from ~27% (Reported). Since the October 2025 recapitalization OpenAI's losses no longer reach Microsoft's P&L: Microsoft booked a +$272M gain in FY27 Q1, against −$4.1B in FY26 Q1 (10-Q).
- **Compute commitments.**
  - October 2025: OpenAI contracted an incremental $250B of Azure, and Microsoft gave up its right of first refusal (8-K exhibit).
  - April 27, 2026 amendment: Microsoft stops paying OpenAI a revenue share. OpenAI's ~20% share to Microsoft continues to 2030 under a cap (reported ~$38B). Microsoft's licence to OpenAI IP runs to 2032 and becomes non-exclusive. OpenAI may sell on any cloud. (Microsoft blog and call; Reported, medium-high confidence.)
- **Revenue.** Microsoft recorded **$24.1B of FY26 revenue from OpenAI** (related-party note, 10-K) and **$10.0B in FY27 Q1** (10.8% of revenue). Press estimates put OpenAI's own Q3 2026 revenue at ~$10B, so its Microsoft bills are being paid largely from outside capital. The OpenAI receivable rose from $6.0B to $7.2B in one quarter.
- **Where the subsidy sits.** Not in price. We found no evidence of below-list pricing to OpenAI. The exposure is duration and counterparty risk:
  - $364.6B of leases signed but not commenced (more than net PP&E);
  - $743.8B of contractual obligations;
  - a customer whose ability to pay depends on continued fundraising.

### 6.3 Google ⇄ Anthropic (the same pattern)

- **Equity and financing.** About $23B of cash invested, including the $10B IPO private placement. Up to $10B of financing remains, linked to compute and revenue targets.
- **Commitments.** Anthropic owes ≥$121.3B to Google Cloud (Apr 2026 – Jul 2033), plus $125–150B of additional TPU capacity excluded from the aggregate.
- **Concentration.** Anthropic is ≥21.6% of Google Cloud's $560.8B backlog (Calculated).
- **Accounting.**
  - Alphabet's 9M 2026 gains on equity securities ($127.3B) exceeded its operating income ($121.0B).
  - Under the measurement alternative, none of Anthropic's losses are booked.
  - Google's stake is ≈$147B at the IPO price.
  - Google also backstops third-party data-centre leases ($48.0B notional of credit protection) and books TPU hardware sales upfront with buyback options.
- **Read.** Any criticism of "circular" AI revenue at AWS applies to Google too.

### 6.4 Operating business vs investment returns

Separate the two. **The cloud operating business** earns fees, compute margin and adjacent services, and pays any incentives. **The investment portfolio** earns valuation gains on the lab. A subsidy that thins AWS's operating margin can raise Amazon's total return if it adds *incremental* Anthropic revenue: at a 23% stake and ~14× run-rate revenue (≈$1.1T market value at $83 ÷ $81B run-rate), each $100 of genuinely new Anthropic revenue adds ≈$322 of stake value. Only ~11% of subsidized usage needs to be truly new for the stake gain to cover a 35% coupon. The gain is non-cash, depends on the multiple persisting, and is zero for usage merely shifted between channels — and incentives mostly shift channel.

---

## 7. Vertical integration: does Google keep more of each dollar?

**Yes, per dollar — that is arithmetic. More profitable overall — not provable from outside.**

| | Google (Gemini on TPU) | AWS (Claude on Trainium) | Microsoft (OpenAI on GPUs / Maia) |
|---|---|---|---|
| Silicon | Own TPUs (designed with Broadcom, which takes a margin); avoids NVIDIA's ~75% gross margin. Independent estimates put internal TCO ~30–44% below GB200 (Reported, medium-low) | Own Trainium for most Bedrock serving; claimed 30–40% better price-performance than GPU instances (Reported) | Mostly NVIDIA/AMD (pays merchant margin); Maia 200 in production, scale unproven |
| Model IP | Owns Gemini | None (resells Claude; Amazon Nova first-party) | Royalty-free, non-exclusive licence to OpenAI models to 2032 |
| Royalty / revenue share | None | Pays Anthropic the price less its fee | None since April 2026 |
| Model development cost | Borne in full: Alphabet-level activities $24.7B TTM (+71%), outside Cloud's margin | None for Claude | None per token for OpenAI models; MAI spend separate |
| Per $100, before incentives (base) | $76 ($54 after model cost) | $24 | $66 |
| Pricing flexibility | Highest | Lowest on Claude (Anthropic sets the price) | High on OpenAI models |
| Monetize across products | Search, Workspace, Android, Cloud | Retail, Alexa, Cloud | M365, GitHub, Windows, Cloud |

**What owning the stack does and doesn't establish.**

- Google can afford larger and longer incentives on Gemini than AWS can on Claude: year-one break-even of 76% (54% economic), against 24%.
- But "no royalty" is not "no cost". Charging Google Cloud its revenue share (24%) of Alphabet-level AI cost takes the Q3 2026 margin from 36.2% to ~30%; charging half takes it to ~24%.
- The cost advantage has not yet won the model market. Menlo's survey (Menlo is an Anthropic investor) puts Gemini at 9% of enterprise LLM API spend, down from 21%, against Anthropic's 55%. The TPU edge is being monetized largely by selling capacity to Anthropic.

**Contractual offsets to Google's apparent advantage.**

- Microsoft's royalty-free OpenAI licence gives it much of the same per-dollar economics without paying for training.
- AWS earns owned-silicon margin on Trainium serving.
- Both rivals are paid as the vendor first, through take-or-pay compute.

---

## 8. Validation against reported earnings (Q3 2024 – Q3 2026)

| | Q3 2024 | Q3 2025 | Q3 2026 | Read |
|---|---:|---:|---:|---|
| AWS revenue ($B) / growth | 27.5 / 19% | 33.0 / 20% | 46.0 / 39% | Accelerating |
| AWS operating margin | 38.1% | 34.6% | 38.7% | Range 32.9–39.5% across nine quarters; no collapse |
| AWS D&A ÷ revenue | 12.9% | 17.1% | 20.1% | Depreciation +63% YoY vs revenue +39% |
| AWS return on average segment assets | ~30% (FY24) | — | ~19% (TTM) | Falling; same-period ROIIC ~9–12%, lagged ~21% |
| Amazon FCF, TTM ($B) | 47.7 | 14.8 | −42.4 | Excludes $65B of AI-lab investments |
| Microsoft Cloud gross margin | 71% | 68% | 66% | Attributed to "scaling our AI infrastructure" through FY26 Q3; then "sales mix shift to Azure" |
| Microsoft Agents & Infra operating margin | 51.8% | 53.1% | 52.8% | Held |
| Microsoft ROIIC (pre-tax) | — | 29.3% | 23.5% (34.9% lagged) | High but falling |
| Google Cloud revenue ($B) / growth | 11.4 / 35% | 15.2 / 34% | 30.7 / 103% | Includes TPU hardware sales and Anthropic |
| Google Cloud operating margin | 17.1% | 23.7% | 36.2% | ~30% if charged 24% of Alphabet-level AI cost |
| Alphabet capex ÷ depreciation | 3.3× | 4.3× | 6.1× | 39% of net PP&E not yet in service |
| Alphabet FCF, quarter ($B) | 17.6 | 24.5 | −9.1 | Negative in Q2 and Q3 2026 |

**Management commentary.**

- Amazon (Olsavsky, Oct 29, 2026): AI margins are "ahead of where the core was at a similar point in time, but they're still lower, so there's going to be that mix issue" (third-party transcripts). Jassy: "most Bedrock usage runs on Trainium, which offers strong price performance and margins."
- Microsoft's MD&A: Microsoft Cloud gross margin "decreased… driven by scaling our AI infrastructure" in each quarter to March 2026.
- Google: management flagged third-party capacity margin headwinds from Q4 2026.

**Conclusion.** Reported results do **not** support the hypothesis that third-party AI workloads are wrecking hyperscaler economics. The segment disclosures are also **insufficient** to show whether third-party AI is less profitable than first-party AI: no company splits AI or third-party-model revenue and margin, and AWS does not say whether Bedrock-Claude is booked gross or net. Margin moves cannot be attributed to AI alone; depreciation lives, energy derivatives (AWS Q2 2026, +$551M), mix and pricing all move them.

**Two things the results do show:**

- **The capital test is ahead, not behind, for all three.** Depreciation is growing 49–63% a year and lags capex.
- **A large share of 2026 profits is paper gains on AI-lab stakes** outside the cloud segments.

---

## 9. The strongest counterargument

An independent reviewer argued the opposite thesis: *AWS and Microsoft are entirely rational to subsidize aggressively.* Its strongest points, quantified with our model:

1. **The coupon buys the whole application, not just tokens.**
   - At 70% gross margin, a *recurring* 35% subsidy on Claude breaks even over five years with ~$0.21 of genuinely incremental non-AI spend per $1 of AI (storage, databases, networking, CPU sandboxes for agents). That is ~$16 of adjacent revenue per $100 of AI spend a year.
   - Our infrastructure research puts typical incremental attach at $0.05–0.60 (base $0.20, low confidence).
   - On a one-time incentive, no adjacency is needed at all.
2. **Equity.** As shown in §6.4, a coupon that creates new Anthropic revenue is worth several times its cost to Amazon's stake.
3. **Filling committed capacity.** AWS built Project Rainier and multi-GW Trainium for Anthropic and OpenAI. Demand that fills it raises utilization, and the marginal cost of serving inside a take-or-pay envelope is low.
4. **Commit burn and switching costs.** Claude-on-Bedrock draws down AWS commitments, so the customer's AWS relationship deepens without any AWS price discount. Data gravity and agent infrastructure raise switching costs.
5. **Falling costs.** Serving-cost declines (~40% a year) outpace price declines in the base case, so the fee pool per unit of capability is stable.
6. **Share at a land-grab moment.** Enterprise AI standards are being set now. A two-year payback on the defining workload of the decade is cheap.
7. **Model-provider- and partner-funded incentives.** If Anthropic or an SI funds part of the 35%, AWS's cost falls proportionally.

**Conditions under which the original "unsustainable" thesis fails entirely:**

- incentives are one-time or growth-based and time-limited — which is how MAP is designed;
- the fee stays near 2026 levels;
- retention holds above ~70% and growth stays positive;
- incremental attach ≥ ~$0.2 per $1;
- or the equity value of incremental Anthropic revenue is counted.

**Conditions under which it holds:**

- incentives roll over every year at ~35%;
- the fee falls back toward ~16%;
- the AI workload churns at the cliff;
- the subsidized usage is merely shifted between channels — no new commitment value, no new equity value.

**Our verdict after the challenge:** the "unsustainable" thesis is unproven and, for Microsoft post-April 2026, largely contradicted. The narrower claims in §1 survive.

---

## 10. JAPAC go-to-market implications

### 10.1 What to tell leaders and sellers

1. **Don't match indiscriminately.** A competitor's one-time incentive costs it once; a permanent price cut from us costs us every year. Never answer a one-time credit with a recurring discount. Compare offers on the customer's three-year bill.
2. **Match when it changes the outcome — and only on the right product.** The incentive pays only if it lifts our win probability by enough to cover its cost. For a 35% one-time match at a 50% base win rate, that lift is ≈5 points on Gemini but ≈27 points on Claude resold through Vertex, because our slice of a Claude dollar is the same thin fee AWS earns. At a 30% base win rate the lifts are ≈3 and ≈16 points.
3. **Separate temporary incentives from sustainable price-performance.** Credits expire; price-performance from owned chips and models, guaranteed capacity, in-region data residency and model choice on one platform do not. Ask of any competitor offer: what does month 13 cost?
4. **Position TCO over the lifetime.** A 35% year-one credit is ~10% over three years and ~6% over five for a growing workload, and the bill jumps ~54% when it ends. Put that on one page with list prices, expected price cuts and committed discounts.
5. **Compete on model choice honestly.** If the customer wants Claude, Vertex is a good place to run it, and it is still Google revenue and TPU utilization. Win the workload, then earn the right to route high-volume steps to Gemini, where our economics are strongest. Keep seller compensation model-neutral on consumption, or reps will push the wrong model.
6. **Don't tell customers the competitor is collapsing.** AWS's cloud margin is 38.7% and Amazon's stake is worth ~$289B. Customers and their CFOs will check.

### 10.2 Customers whose AI economics may change when incentives expire

Flag accounts where:

- credits were sized on year-one or growth spend and expire within six months;
- growth-based credits are running out of headroom;
- the workload is mostly stateless inference with little data gravity;
- finance tracks cost per task;
- the customer's commitment cycle (EDP/MACC) is up for renewal within a year.

Build a "month-13" cost comparison for each.

### 10.3 Field intelligence to collect, deal by deal

1. Incentive form: one-time credit, credits on growth (MAP), recurring discount or commit-linked credit.
2. Funder: AWS, Anthropic private offer, partner pass-back, or a mix. Ask for the paperwork, not the headline percentage.
3. Base: list or net; all spend or growth above a baseline; the cap.
4. Term, expiry, and promised renewal terms.
5. Conditions: minimum commit, tagged workloads, migration partner, Marketplace drawdown caps.
6. Model and endpoint (global vs regional pricing), and whether the customer's AWS commit discount applies to Claude.
7. The adjacent footprint that moves with the workload.
8. Where the customer is in its commit cycle.

Aggregated across JAPAC, these eight items would test the 35% report and our fee and attach assumptions directly.

---

## 11. Open questions that would change the answer

- **CSP-specific channel fees.** How much of the 2026 fee pool is AWS vs Google vs Microsoft, and how much is distribution vs delivery?
- **Gross vs net.** Does AWS book Bedrock-Claude revenue gross or net?
- **MAP terms.** Actual MAP rates on Anthropic workloads, and whether Anthropic co-funds any.
- **Adjacency.** Measured non-AI attach per $1 of AI spend in our own JAPAC base.
- **Gemini's cost.** Gemini's fully-loaded model-development cost per dollar of revenue (internal data).
- **OpenAI.** Whether OpenAI's capped revenue share binds before 2030.

---

## Appendix A. Base-case assumptions

All assumptions with low/base/high, basis and notes are in the workbook's *Assumptions* sheet and in `src/lib/subsidy-math/params.json`. Key ranges:

- channel fee 16–36%;
- serving infrastructure 6–30% of list (route bases 10–20%);
- utilization 30–70%;
- distribution cost 2–8%;
- growth 0–80%;
- retention 70–97%;
- price deflation 15–65% a year;
- efficiency 25–60% a year;
- adjacency $0.10–1.20 gross attach at 50% incremental;
- equity stake 13–27%, multiple 6–25×.

## Appendix B. Principal sources

- Anthropic S-1 (Oct 26, 2026), S-1/A (Nov 2, 2026) and 424B4 (Nov 19, 2026) — revenue recognition and concentrations (pp. F-17, F-22), quarterly results (p. 160), S&M commentary (pp. 148, 152, 162), contractual obligations (pp. 173–178), principal stockholders (424B4 p. 298).
- Amazon 10-Q Q3 2026 (Notes 1, 2, 4, 8) and earnings releases Q3 2024 – Q3 2026; Q3 2026 earnings call.
- Microsoft 10-K FY26 and 10-Q Sep 2026 (related-party Note 1; MD&A segment results; leases); FY26 Q3 earnings call; April 27, 2026 partnership blog.
- Alphabet 10-Q Q3 2026 (segment note; OI&E; RPO) and earnings releases Q3 2024 – Q3 2026; Broadcom 8-K (Apr 2026).
- NVIDIA Q3 FY27 results; SemiAnalysis InferenceX (via secondary sources); Epoch AI; Menlo Ventures 2026; Reuters (Sep 30, 2026).
- Full source register with URLs: the workbook's *Sources* sheet and the [interactive site](/subsidy-math#downloads).
