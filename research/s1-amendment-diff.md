# Anthropic S-1 (Oct 26, 2026) vs S-1/A No. 1 (Nov 2, 2026): what actually changed

Sources: [Form S-1](https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm) · [Form S-1/A](https://www.sec.gov/Archives/edgar/data/2130357/000162828026068676/anthropicpbc-sx1ax1.htm). EDGAR shows no further amendment through the Nov 7, 2026 research cutoff.

## Bottom line

- **The October S-1 was a Q2 filing.** Its financial statements ran through **June 30, 2026** (EDGAR description "S-1 (Q2)"), while customer counts, NRR and concentration metrics were already stated as of Sep 30, 2026. The amendment rolls the financial statements forward to **nine months ended Sep 30, 2026** and adds a Q3 2026 column to the quarterly table.
- **The biggest numbers were blank in October**: Q3 revenue, the ~$895.4B commitment total, the contractual-obligations table, the $150–175B excluded estimate, and liquidity. All were filled in on Nov 2.
- **New Q3 narrative**: a $567M Q3 operating loss (vs $974M Q2 operating income) driven by **$5.0B of short-term compute** and **$2.0B** of non-cash donation-matching charges; **~$600M** of Q3 revenue lost to price reductions; positive **$6.6B** nine-month operating cash flow; S&M falling from 22% to 14% of revenue on channel mix and renegotiated channel terms.
- **New risk language**: Anthropic "may imminently meet" its Responsible Scaling Policy definition of "dramatically accelerated progress attributable to AI"; it is considering human review of R&D decisions; suppliers' own financing can delay or reprice contracted capacity; $213.8B of commitments are contingent or terminable.
- **Not new**: the 5–7% policy-violating revenue estimate, ~900% NRR, the 11,900 / 1,900 / 250 customer tiers, and the top-five ≈25% concentration were all already in the October filing.
- **No October operating data**: "our Run-Rate Revenue was $ as of October 31, 2026" is **blank in both filings**. An October filing date is not October performance data.

## Method

Both filings were downloaded from EDGAR, converted to text (`scripts/anthropic-s1/extract_text.py`) and compared sentence-by-sentence after removing pagination and line-wraps (`diff_filings.py`, `condense_diff.py`). The diff produced **711 changed passages**; most are period roll-forwards ("six months ended June 30" → "nine months ended September 30") and copy edits. Risk factors: **0 added or removed**, 92 paragraphs edited, ~20 substantively. Each item below was checked in both documents. Page numbers are printed folios in the EDGAR HTML (±1 vs a PDF rendering where image pages intervene).

## Change log

| # | Category | Change | Oct 26 → Nov 2 delta | Materiality | Confidence | S-1 p. | S-1/A p. |
|---|---|---|---|---|---|---|---|
| 1 | Accounting update | The S-1 was a Q2 document; the amendment is the first with Q3 financial statements | +1 quarter of audited-comparable data; ~190 MD&A edits are period roll-forwards. | High | High | cover; F-pages | cover; F-pages |
| 2 | Financial revelation | Q3 revenue disclosed: $16.96B, +46.7% QoQ — sequential growth more than halved | Q2 → Q3 sequential growth 144.2% → 46.7%; absolute addition $6.82B → $5.40B. | High | High | 5 (blank) | 5, 134, 160 |
| 3 | Financial revelation | Headline efficiency comparison re-based: revenue growth 1,368% → 1,127%; compute growth 300% → 382% | Revenue/compute growth multiple narrowed from 4.6× to 3.0×. | High | High | 10 | 10 |
| 4 | Financial revelation | New: Q3 swung to a $567M operating loss from $974M operating income in Q2 | −$1,541M swing in GAAP operating income; adjusted operating margin 19% → 15%. | High | High | F-64 (charge flagged as subsequent event) | 138, 162–163 |
| 5 | Business-model revelation | New: $5.0B of Q3 compute (and $6.5B year-to-date) bought on short-term commitments at a premium | $5.0B = 51% of Q3 compute expense; 9M short-term $6.5B (implies ≤$1.5B in H1). | High | High | 134 | 135, 137, 151, 161 |
| 6 | Business-model revelation | New: ~$600M of Q3 revenue lost to price reductions in new model versions and contractual discounts | Price drag = 3.5% of Q3 revenue; ≈11% of the Q3 sequential addition. | High | High | — | 161 |
| 7 | Financial revelation | Commitment total filled in: ~$895.4B, $447.5B before 2031, $69.8B in the next 12 months | From blank to $895.4B; table shows $320.0B with year-by-year schedule. | High | High | 6, 32 (blank) | 6, 32, 139, 173 |
| 8 | Risk clarification | New: ~$213.8B of obligations carry termination rights or contingent conditions | 24% of the aggregate is conditional; ≈ $681.6B is not. | High | High | — | 173–174 |
| 9 | Financial revelation | Estimate for non-fixed arrangements filled in: $150–175B excluded from the $895.4B | Potential total including excluded estimates ≈ $1.05–1.07 trillion. | High | High | 170 (blank) | 174 |
| 10 | Strategic revelation | Google CSP minimum raised $114.5B → $121.3B; additional TPU path now includes direct purchase with five-year financing | +$6.8B Google minimum; new delivery-method options. | High | High | 170 | 174 |
| 11 | Risk clarification | New risk language: suppliers' own financing can delay, reprice or cancel contracted capacity | New sentence. | High | High | — | 31 |
| 12 | Strategic revelation | Broadcom has now assigned part of the 2026 TPU lease to a special-purpose financing entity | Intent → executed. | Medium | Medium | 57 | 57, 176 |
| 13 | Financial revelation | Liquidity quantified at $146.6B; revolver upsized to $15.0B | +$11.6B available revolver; cash+STI flat at ~$131.8B over Q3. | High | High | 137 (blank) | 139, 164 |
| 14 | Financial revelation | New: positive operating cash flow of $6.6B for nine months | Q3 operating cash flow ≈ $2.6B (derived). | High | High | 170 | 164, 172 |
| 15 | Business-model revelation | Marketplace share falling: 48% (H1) → 44% (9M); S&M fell from 22% to 14% of revenue on channel mix and renegotiated terms | Implied Q3 marketplace share ≈ 40% (range 38.7–41.6%). | High | High | 57, F-16 | 57, 162, F-16 |
| 16 | Financial revelation | Largest customer drops below 10% of revenue for the nine months | Customer C share fell from 11% (H1) to <10% (9M) → implies <9.5% of Q3. | Medium | High | F-15 | F-15 |
| 17 | Risk clarification | New: Anthropic 'may imminently meet' its RSP definition of 'dramatically accelerated progress attributable to AI' | New disclosure. | High | High | — | 29 |
| 18 | Risk clarification | Capability language strengthened; human review of R&D decisions under consideration | Conditional → possibly already occurred; new governance measure contemplated. | High | High | 48, 51 | 49, 52 |
| 19 | Risk clarification | Government revenue ceiling loosened: 'approximately 1%' → 'less than 2%' | Ceiling roughly doubled; exact figure undisclosed. | Medium | Medium | 70 | 72 |
| 20 | Accounting update | Donation-matching cost now a top-three driver of reported operating results | Q3 non-cash charge $1,960M (11.6% of Q3 revenue). | High | High | 144 | 145, 163 |
| 21 | Accounting update | IPO-day stock-comp catch-up grows: $2.9B → $8.2B of service-satisfied RSUs | +$5.3B catch-up; new grants no longer IPO-contingent. | Medium | High | 173 | 178 |
| 22 | Strategic revelation | New: direct retail allocation through Schwab, Fidelity, Robinhood, SoFi and E*TRADE platforms | New section. | Low | High | — | 330 |
| 23 | Administrative change | Unchanged: Run-Rate Revenue 'as of October 31, 2026' is still blank | No October performance data disclosed in either filing. | High | High | 194 | 198 |
| 24 | Administrative change | Unchanged: 5–7% of nine-month revenue from customers later found violating policy or terms | No change. | High | High | 145 | 146 |
| 25 | Administrative change | Unchanged: ~900% NRR, 11,900 / 1,900 / 250 customer tiers, top-five ≈25% (9M) — all already as of Sep 30 in the original | No change. | Medium | High | 8–10, 133–143 | 8–10, 135–144 |
| 26 | Accounting update | Interest-rate sensitivity quantified: ±100bp ≈ $310M | Qualitative → quantified. | Low | High | 172 | 176 |
| 27 | Administrative change | Stock-split assumptions removed from the summary (10-for-1 split already effected Sep 17, 2026) | — | Low | High | 21 | — |
| 28 | Administrative change | Class E timing tightened: authorized 'Immediately prior to' rather than 'Upon' completion | Wording. | Low | High | cover | cover |

## Detail

### 1. The S-1 was a Q2 document; the amendment is the first with Q3 financial statements

*Accounting update · topic: financial · section: Whole document*

- **Original (Oct 26):** Financial statements through the six months ended June 30, 2026 (EDGAR description: 'S-1 (Q2)'); many headline figures left blank ('$').
- **Updated (Nov 2):** Financial statements through the nine months ended September 30, 2026; quarterly table gains a Q3 2026 column; subsequent events evaluated through Nov 2, 2026.
- **Actual delta:** +1 quarter of audited-comparable data; ~190 MD&A edits are period roll-forwards.
- **Why it matters:** Every Q3 conclusion in circulation — the operating loss, the $5.0B short-term compute, the price-cut drag — exists only because of this amendment.
- **Interpretation:** A standard pre-roadshow update: the October filing could not include unaudited Q3 statements, so it carried Q3 operating KPIs (customer counts, NRR) alongside Q2 financials.
- **Competitive implication:** Readers who analysed the Oct 26 filing were benchmarking a Q2 P&L against Q3 KPIs. Re-run any model built on the original.
- **Confidence:** High · **Evidence:** S-1 p. cover; F-pages; S-1/A p. cover; F-pages

### 2. Q3 revenue disclosed: $16.96B, +46.7% QoQ — sequential growth more than halved

*Financial revelation · topic: financial · section: Summary / MD&A*

- **Original (Oct 26):** Overview: 'revenue growing from $0 ... to $ for the three months ended ...' (blank). Latest quarter shown: Q2 2026 $11,555M.
- **Updated (Nov 2):** 'to $17.0 billion for the three months ended September 30, 2026'; Q3 column $16,956M.
- **Actual delta:** Q2 → Q3 sequential growth 144.2% → 46.7%; absolute addition $6.82B → $5.40B.
- **Why it matters:** First quarter in the series where the dollar increase shrank. The growth curve, not just the growth rate, bent.
- **Interpretation:** Mix of ~$600M price cuts, enforcement against policy violators (Aug–Sep), compute constraints (short-term buying), and base effects; the filing does not apportion them.
- **Competitive implication:** The 'law of large numbers' explanation is insufficient on its own: dollar adds fell. Competitors should watch Q4 for whether Q3 was a pause or a new slope.
- **Confidence:** High · **Evidence:** S-1 p. 5 (blank); S-1/A p. 5, 134, 160

### 3. Headline efficiency comparison re-based: revenue growth 1,368% → 1,127%; compute growth 300% → 382%

*Financial revelation · topic: financial · section: Summary — Strengths of Our Financial Model*

- **Original (Oct 26):** 'revenue that grew 1,368% year over year for the three months ended June 30, 2026, compared to compute and infrastructure expenses that grew 300%'
- **Updated (Nov 2):** 'revenue that grew 1,127% year over year for the three months ended September 30, 2026, compared to compute and infrastructure expenses that grew 382%'
- **Actual delta:** Revenue/compute growth multiple narrowed from 4.6× to 3.0×.
- **Why it matters:** Management's own 'compute efficiency' proof point weakened by a third in one quarter.
- **Interpretation:** Compute deliveries (including expensive short-term capacity) caught up with revenue.
- **Competitive implication:** The efficiency gap is real but not monotonic — compute arrives in steps. Price-performance attackers should time pressure to Anthropic's capacity-step quarters.
- **Confidence:** High · **Evidence:** S-1 p. 10; S-1/A p. 10

### 4. New: Q3 swung to a $567M operating loss from $974M operating income in Q2

*Financial revelation · topic: financial · section: MD&A — Overview / Quarterly Trends*

- **Original (Oct 26):** Not disclosed (Q2 was the latest quarter: operating income $974M).
- **Updated (Nov 2):** 'Our operating loss was $567 million for the three months ended September 30, 2026 ... primarily driven by $5.0 billion of compute under short-term commitments ... and $2.0 billion of non-cash charges related to our donation matching program.'
- **Actual delta:** −$1,541M swing in GAAP operating income; adjusted operating margin 19% → 15%.
- **Why it matters:** GAAP profitability lasted one quarter. Adjusted operating income still rose ($2.24B → $2.46B).
- **Interpretation:** Two drivers: one economic (expensive short-term compute) and one accounting/discretionary (equity-linked donation match). The $2.0B charge had been flagged as a subsequent event in the Oct 26 filing.
- **Competitive implication:** Frontier-lab margins are hostage to capacity timing. A rival with owned, already-amortizing capacity has a structural cost advantage in demand spikes.
- **Confidence:** High · **Evidence:** S-1 p. F-64 (charge flagged as subsequent event); S-1/A p. 138, 162–163

### 5. New: $5.0B of Q3 compute (and $6.5B year-to-date) bought on short-term commitments at a premium

*Business-model revelation · topic: compute · section: MD&A — Compute Efficiency; Components*

- **Original (Oct 26):** Short-term compute 'typically carries a higher cost per unit of compute'; 'We expect our use of short-term compute to increase in the near term'. No dollar amount.
- **Updated (Nov 2):** '$5.0 billion of compute under short-term commitments, which currently costs significantly more than comparable compute procured under our multi-year commitments. This reduced revenue per dollar of compute compared to the preceding quarter.' Use expected 'to continue to increase'.
- **Actual delta:** $5.0B = 51% of Q3 compute expense; 9M short-term $6.5B (implies ≤$1.5B in H1).
- **Why it matters:** Demand (or research needs) outran the 12–18-month procurement plan, and the spot premium consumed the quarter's margin.
- **Interpretation:** Consistent with demand exceeding contracted supply, but also with front-loaded research runs. The filing allows both ('customer demand or research needs').
- **Competitive implication:** Short-term capacity sellers (neoclouds, SpaceXAI, CSP on-demand) hold pricing power over frontier labs in surge quarters. Hyperscalers with spare capacity can monetize it at a premium.
- **Confidence:** High · **Evidence:** S-1 p. 134; S-1/A p. 135, 137, 151, 161

### 6. New: ~$600M of Q3 revenue lost to price reductions in new model versions and contractual discounts

*Business-model revelation · topic: financial · section: MD&A — Quarterly Trends*

- **Original (Oct 26):** 'Growth in customers generating meaningful revenue contributed across the periods' — no price-effect quantification.
- **Updated (Nov 2):** '... partially offset by a decrease of approximately $600 million from price reductions introduced as part of new model versions and contractual discounts' (Q3); ~$70M in Q4 2025; 'Price changes did not have a material impact on the other quarterly revenue trends presented.'
- **Actual delta:** Price drag = 3.5% of Q3 revenue; ≈11% of the Q3 sequential addition.
- **Why it matters:** First quantified evidence that Anthropic is passing efficiency gains to customers. Opus 5.5 launched at $4/$20 vs Opus 5 at $5/$25.
- **Interpretation:** Deliberate elasticity play (cost per task −40% with Opus 5.5) and competitive response (GPT-6.1 Sol at $2/$10).
- **Competitive implication:** Price is now an active lever at the frontier. Attackers should assume Anthropic will cut again rather than cede share.
- **Confidence:** High · **Evidence:** S-1 p. —; S-1/A p. 161

### 7. Commitment total filled in: ~$895.4B, $447.5B before 2031, $69.8B in the next 12 months

*Financial revelation · topic: compute · section: Summary / MD&A / Risk Factors*

- **Original (Oct 26):** 'aggregate committed spend of more than $' (blank); before-2031 and 12-month figures blank; contractual obligations table blank.
- **Updated (Nov 2):** 'approximately $895.4 billion ... approximately $447.5 billion expected to be incurred before December 31, 2030 ... Approximately $69.8 billion ... due in the 12 months following September 30, 2026.' Table: $319,993M.
- **Actual delta:** From blank to $895.4B; table shows $320.0B with year-by-year schedule.
- **Why it matters:** The single largest disclosed number in the filing first appeared in the amendment.
- **Interpretation:** Figures were likely still being finalized as October contracts closed (Google and Microsoft agreements were amended through October).
- **Competitive implication:** Sizes the capacity race: $447.5B due before 2031 averages roughly $105B a year from Q4 2026 — about half of what Alphabet (2026 capex guide $195–205B) or Amazon (~$220B) spend in a year, carried by a company with $131.8B of cash and investments and no hyperscaler cash engine.
- **Confidence:** High · **Evidence:** S-1 p. 6, 32 (blank); S-1/A p. 6, 32, 139, 173

### 8. New: ~$213.8B of obligations carry termination rights or contingent conditions

*Risk clarification · topic: compute · section: MD&A — Contractual Obligations*

- **Original (Oct 26):** Not present.
- **Updated (Nov 2):** 'Approximately $213.8 billion of the aggregate total of our contractual obligations relates to arrangements that are subject to either exercisable termination rights or contingent conditions prior to commencement, such as the counterparty’s ability to secure financing, facilities, or regulatory approvals'; plus general right to terminate if counterparties miss delivery dates; $4.3B of the next-12-month amount is contingent.
- **Actual delta:** 24% of the aggregate is conditional; ≈ $681.6B is not.
- **Why it matters:** Reframes the headline: almost a quarter of the 'commitments' depend on suppliers' financing and permits, not just on Anthropic.
- **Interpretation:** Likely responsive to investor/SEC focus on whether $895B is a hard liability.
- **Competitive implication:** The binding constraint on the AI build-out is partly supplier financing. Neoclouds' cost of capital is now a frontier-lab risk factor.
- **Confidence:** High · **Evidence:** S-1 p. —; S-1/A p. 173–174

### 9. Estimate for non-fixed arrangements filled in: $150–175B excluded from the $895.4B

*Financial revelation · topic: compute · section: MD&A — Contractual Obligations fn. 5*

- **Original (Oct 26):** 'we currently estimate such payments to be approximately $ to $' (blank).
- **Updated (Nov 2):** 'approximately $150 billion to $175 billion ... payable over time after the capacity is delivered.' (Includes the $125–150B additional Google TPU estimate and AMD > $20B.)
- **Actual delta:** Potential total including excluded estimates ≈ $1.05–1.07 trillion.
- **Why it matters:** Brings total potential infrastructure exposure past $1 trillion.
- **Interpretation:** Not liabilities until capacity is delivered; amounts depend on delivery method, pricing and financing.
- **Competitive implication:** Google's TPU franchise is the single largest beneficiary of Anthropic's forward compute plan.
- **Confidence:** High · **Evidence:** S-1 p. 170 (blank); S-1/A p. 174

### 10. Google CSP minimum raised $114.5B → $121.3B; additional TPU path now includes direct purchase with five-year financing

*Strategic revelation · topic: compute · section: MD&A — Infrastructure Service Arrangements*

- **Original (Oct 26):** 'committed to spend at least approximately $114.5 billion' (amended May–Aug 2026); additional TPU compute 'from TPU providers, including Google'.
- **Updated (Nov 2):** 'committed to spend at least approximately $121.3 billion' (amended May–Oct 2026); additional TPU via 'a CSP hosting agreement with Google, direct purchase from Google with five-year financing, or direct purchase and/or lease from a third-party TPU provider with five-year financing'.
- **Actual delta:** +$6.8B Google minimum; new delivery-method options.
- **Why it matters:** Google deepened its Anthropic commitment between filings, and TPUs are moving toward direct ownership/financing.
- **Interpretation:** Consistent with Anthropic Direct: separating chips from hosting; Google selling TPUs, not just renting them.
- **Competitive implication:** For Google Cloud: Anthropic is converting from a cloud tenant to a TPU buyer — higher revenue certainty for TPU, lower cloud-margin capture.
- **Confidence:** High · **Evidence:** S-1 p. 170; S-1/A p. 174

### 11. New risk language: suppliers' own financing can delay, reprice or cancel contracted capacity

*Risk clarification · topic: risk · section: Risk Factors (RF2)*

- **Original (Oct 26):** Not present.
- **Updated (Nov 2):** 'certain of our compute providers and infrastructure partners depend on third-party financing or credit support to acquire chips and develop capacity, and if such financing or support becomes unavailable or more costly, contracted capacity may be delayed, repriced, reduced, or not delivered.'
- **Actual delta:** New sentence.
- **Why it matters:** Explains the contingent $213.8B and Nscale/Lambda financing conditions.
- **Interpretation:** Rising concern over neocloud credit; Broadcom assigned lease portions to financing SPVs.
- **Competitive implication:** Credit spreads of neoclouds are now an input to frontier-model capacity — and a lever for well-capitalized hyperscalers.
- **Confidence:** High · **Evidence:** S-1 p. —; S-1/A p. 31

### 12. Broadcom has now assigned part of the 2026 TPU lease to a special-purpose financing entity

*Strategic revelation · topic: compute · section: MD&A / Risk Factors*

- **Original (Oct 26):** Broadcom 'intends to assign' rights to a financial partner.
- **Updated (Nov 2):** 'In October 2026, Broadcom assigned to a newly formed special purpose financing entity its rights and obligations with respect to a portion of the equipment under the 2026 Lease Arrangement. These assignments did not increase our aggregate rent payments.'
- **Actual delta:** Intent → executed.
- **Why it matters:** TPU capacity is being financed off Broadcom's balance sheet through SPVs.
- **Interpretation:** Typical asset-backed structure; transfers lessor risk to financiers.
- **Competitive implication:** AI accelerator leasing is becoming an asset-backed-finance market; whoever controls the financing stack shapes who gets capacity.
- **Confidence:** Medium · **Evidence:** S-1 p. 57; S-1/A p. 57, 176

### 13. Liquidity quantified at $146.6B; revolver upsized to $15.0B

*Financial revelation · topic: financial · section: MD&A — Compute Investments / Liquidity*

- **Original (Oct 26):** 'we had $ of liquidity, comprised of $ ...' (blank); June 30: cash $112.4B, short-term investments $19.3B, $3.2B revolver available.
- **Updated (Nov 2):** $146.6B = $95.6B cash + $36.3B short-term investments + $14.8B revolver availability; partner financing capacity up to $77.0B; AMD equity up to $5.0B.
- **Actual delta:** +$11.6B available revolver; cash+STI flat at ~$131.8B over Q3.
- **Why it matters:** Cash plus investments did not decline in Q3 despite the build-out: operations funded ~$2.7B and investing outflows were largely treasury purchases.
- **Interpretation:** —
- **Competitive implication:** Liquidity covers ~2.1× the next 12 months of obligations ($69.8B) before IPO proceeds.
- **Confidence:** High · **Evidence:** S-1 p. 137 (blank); S-1/A p. 139, 164

### 14. New: positive operating cash flow of $6.6B for nine months

*Financial revelation · topic: financial · section: MD&A — Liquidity*

- **Original (Oct 26):** Six months: operating cash flow $3.9B.
- **Updated (Nov 2):** 'We generated positive cash flows from operating activities of $6.6 billion for the nine months ended September 30, 2026.'
- **Actual delta:** Q3 operating cash flow ≈ $2.6B (derived).
- **Why it matters:** Even in the GAAP-loss quarter, the business generated operating cash.
- **Interpretation:** Non-cash charges (donation match, SBC, fair-value) and the fact that CSP compute is paid as delivered.
- **Competitive implication:** Do not equate the $104B net loss with cash burn; the cash engine is positive before infrastructure prepayments and capex.
- **Confidence:** High · **Evidence:** S-1 p. 170; S-1/A p. 164, 172

### 15. Marketplace share falling: 48% (H1) → 44% (9M); S&M fell from 22% to 14% of revenue on channel mix and renegotiated terms

*Business-model revelation · topic: strategy · section: MD&A — Quarterly Trends; Note 1*

- **Original (Oct 26):** H1 2026 CSP-marketplace revenue ≈48%; marketplace receivables 58%.
- **Updated (Nov 2):** 9M 2026 ≈44%; receivables 52%. New: S&M % of revenue 'decreased from 22% ... to 14% ... primarily driven by a decrease in revenue generated from sales through channel partners as a percentage of total revenue and changes in the terms of our channel partner distribution arrangements.'
- **Actual delta:** Implied Q3 marketplace share ≈ 40% (range 38.7–41.6%).
- **Why it matters:** Anthropic is shifting revenue toward direct billing and has improved its channel terms — a direct transfer from CSP partners.
- **Interpretation:** As scale grew, bargaining power moved toward Anthropic; direct relationships (already contractual) are increasingly billed directly.
- **Competitive implication:** For AWS/Google/Microsoft, the Anthropic marketplace take-rate is under pressure. Hyperscalers should expect lower fee capture per Anthropic dollar going forward.
- **Confidence:** High · **Evidence:** S-1 p. 57, F-16; S-1/A p. 57, 162, F-16

### 16. Largest customer drops below 10% of revenue for the nine months

*Financial revelation · topic: customers · section: Note 1 — Significant Customers*

- **Original (Oct 26):** 'Customer C' = 11% of H1 2026 revenue (and 43% of FY2023); receivables: Customer A 13%, Customer C 10%.
- **Updated (Nov 2):** No customer ≥10% of 9M 2026 revenue; receivables: Customer E 13%.
- **Actual delta:** Customer C share fell from 11% (H1) to <10% (9M) → implies <9.5% of Q3.
- **Why it matters:** Concentration is diluting quickly; a new counterparty (E) now dominates receivables.
- **Interpretation:** Broad-based growth plus top-5 share falling from ~36% (Q1) to ~21% (Q3).
- **Competitive implication:** Anthropic's revenue is less hostage to one AI-native customer than in 2023–2025 — but top-five still ≈25% of 9M revenue.
- **Confidence:** High · **Evidence:** S-1 p. F-15; S-1/A p. F-15

### 17. New: Anthropic 'may imminently meet' its RSP definition of 'dramatically accelerated progress attributable to AI'

*Risk clarification · topic: risk · section: Risk Factors (RF1)*

- **Original (Oct 26):** Not present; 'we may not identify' acceleration.
- **Updated (Nov 2):** 'our internal estimates and our expectations regarding future models, rather than our current models, indicate that we may imminently meet our Responsible Scaling Policy’s definition of “dramatically accelerated progress attributable to AI.”' Also: 'have in the past not identified, and may in the future not identify'.
- **Actual delta:** New disclosure.
- **Why it matters:** A safety trigger tied to AI-driven R&D acceleration could change release cadence, internal processes and cost.
- **Interpretation:** Consistent with 'closing the loop' (>90% of code written by Claude) — the same dynamic sold as an advantage is disclosed as a governance trigger.
- **Competitive implication:** Competitors without equivalent self-imposed thresholds may move faster; Anthropic's safety posture becomes both a trust asset and a potential velocity tax.
- **Confidence:** High · **Evidence:** S-1 p. —; S-1/A p. 29

### 18. Capability language strengthened; human review of R&D decisions under consideration

*Risk clarification · topic: risk · section: Risk Factors (RF13, RF15)*

- **Original (Oct 26):** 'could advance' at a rate that initiates enhanced measures.
- **Updated (Nov 2):** 'may have already advanced, and may continue to advance, at a rate that initiates the implementation of enhanced safety and testing measures'; 'considering ... updates to our Responsible Scaling Policy, to require human review and approval of certain decisions in our research and development processes as our models perform an increasing share of that work.'
- **Actual delta:** Conditional → possibly already occurred; new governance measure contemplated.
- **Why it matters:** Signals that model-driven research is large enough to warrant human gating.
- **Interpretation:** Pre-IPO de-risking of disclosure around frontier capability thresholds.
- **Competitive implication:** Rivals should expect Anthropic's release decisions to be more visibly gated — and enterprises to value that predictability.
- **Confidence:** High · **Evidence:** S-1 p. 48, 51; S-1/A p. 49, 52

### 19. Government revenue ceiling loosened: 'approximately 1%' → 'less than 2%'

*Risk clarification · topic: risk · section: Risk Factors (RF30)*

- **Original (Oct 26):** 'approximately 1% of our revenue in each of the periods presented'
- **Updated (Nov 2):** 'less than 2% of our revenue in each of the periods presented'
- **Actual delta:** Ceiling roughly doubled; exact figure undisclosed.
- **Why it matters:** Despite the February 2026 supply-chain-risk designation and the D.C. Circuit's 2-1 ruling, public-sector exposure is immaterial to revenue.
- **Interpretation:** Could reflect rounding with a larger nine-month base or Q3 public-sector revenue outside the Department of War.
- **Competitive implication:** The government dispute is a strategic and reputational issue more than a revenue one.
- **Confidence:** Medium · **Evidence:** S-1 p. 70; S-1/A p. 72

### 20. Donation-matching cost now a top-three driver of reported operating results

*Accounting update · topic: financial · section: MD&A — Public Benefit*

- **Original (Oct 26):** 'have not historically been significant ... For the year ended December 31, 2025 ... $541 million, representing approximately 4%'
- **Updated (Nov 2):** 'were not significant before the three months ended September 30, 2026. For the nine months ended September 30, 2026 ... $2.1 billion, representing approximately 6%'
- **Actual delta:** Q3 non-cash charge $1,960M (11.6% of Q3 revenue).
- **Why it matters:** A discretionary, equity-linked program swung the Q3 GAAP result; it scales with the share price.
- **Interpretation:** Excluded from Adjusted Operating Income as 'non-cash', but it is real dilution.
- **Competitive implication:** Anthropic's public-benefit commitments create P&L volatility that peers do not carry; investors will need to normalize it.
- **Confidence:** High · **Evidence:** S-1 p. 144; S-1/A p. 145, 163

### 21. IPO-day stock-comp catch-up grows: $2.9B → $8.2B of service-satisfied RSUs

*Accounting update · topic: financial · section: MD&A — Critical Accounting Estimates; Note 17*

- **Original (Oct 26):** Unrecognized RSU expense ~$26.6B, of which $2.9B service-satisfied; ~91M RSUs ($5.8B) granted after June 30 with performance conditions.
- **Updated (Nov 2):** ~$32.3B unrecognized, of which $8.2B service-satisfied; ~47M RSUs granted after Sep 30 now vest on service only.
- **Actual delta:** +$5.3B catch-up; new grants no longer IPO-contingent.
- **Why it matters:** The IPO quarter will carry a large non-cash GAAP charge.
- **Interpretation:** Grants after the registration shift to service-only vesting (normal post-IPO design).
- **Competitive implication:** Talent retention costs are rising with valuation; rivals competing for researchers face the same equity math.
- **Confidence:** High · **Evidence:** S-1 p. 173; S-1/A p. 178

### 22. New: direct retail allocation through Schwab, Fidelity, Robinhood, SoFi and E*TRADE platforms

*Strategic revelation · topic: other · section: Underwriting*

- **Original (Oct 26):** Not present.
- **Updated (Nov 2):** 'we anticipate that a portion of the shares ... will, at our request, be offered to retail investors through Charles Schwab & Co., Inc., Fidelity ..., Robinhood Financial, LLC, Trade-PMR, Inc., SoFi Securities LLC, and E*TRADE from Morgan Stanley'
- **Actual delta:** New section.
- **Why it matters:** Broad retail distribution for a consumer-recognized brand.
- **Interpretation:** Brand and prosumer funnel extend to the shareholder base.
- **Competitive implication:** Claude's consumer brand is now also an investor-relations asset.
- **Confidence:** High · **Evidence:** S-1 p. —; S-1/A p. 330

### 23. Unchanged: Run-Rate Revenue 'as of October 31, 2026' is still blank

*Administrative change · topic: financial · section: Business — Significant Revenue Growth*

- **Original (Oct 26):** 'Additionally, our Run-Rate Revenue was $ as of October 31, 2026.'
- **Updated (Nov 2):** 'Additionally, our Run-Rate Revenue was $ as of October 31, 2026.' (identical)
- **Actual delta:** No October performance data disclosed in either filing.
- **Why it matters:** Any 'October run-rate' figure circulating in the press is not from the filing.
- **Interpretation:** Likely to be filled in a later amendment with the price range.
- **Competitive implication:** Do not anchor on unofficial run-rate numbers; the next amendment is the data point to watch.
- **Confidence:** High · **Evidence:** S-1 p. 194; S-1/A p. 198

### 24. Unchanged: 5–7% of nine-month revenue from customers later found violating policy or terms

*Administrative change · topic: risk · section: MD&A — Components of Results*

- **Original (Oct 26):** Identical paragraph (already measured for the nine months ended Sep 30, 2026).
- **Updated (Nov 2):** Identical paragraph.
- **Actual delta:** No change.
- **Why it matters:** Not a new revelation of the amendment — but the most consequential revenue-quality disclosure in both filings.
- **Interpretation:** Measured on a nine-month basis even in the Q2 filing.
- **Competitive implication:** Revenue-quality haircuts should be applied to both filings' growth narratives.
- **Confidence:** High · **Evidence:** S-1 p. 145; S-1/A p. 146

### 25. Unchanged: ~900% NRR, 11,900 / 1,900 / 250 customer tiers, top-five ≈25% (9M) — all already as of Sep 30 in the original

*Administrative change · topic: customers · section: Summary / MD&A*

- **Original (Oct 26):** Same Sep 30, 2026 operating metrics.
- **Updated (Nov 2):** Same.
- **Actual delta:** No change.
- **Why it matters:** The October filing already contained Q3 operating metrics; only the financial statements lagged.
- **Interpretation:** —
- **Competitive implication:** Don't treat these KPIs as 'new' amendment information.
- **Confidence:** High · **Evidence:** S-1 p. 8–10, 133–143; S-1/A p. 8–10, 135–144

### 26. Interest-rate sensitivity quantified: ±100bp ≈ $310M

*Accounting update · topic: financial · section: MD&A — Market Risk*

- **Original (Oct 26):** 'would not have had a material effect on the fair value of our investment portfolio'
- **Updated (Nov 2):** 'would have resulted in a decrease or increase, respectively, of $310 million in the market value of our cash equivalents and short-term investments'
- **Actual delta:** Qualitative → quantified.
- **Why it matters:** Reflects the larger short-term investment book ($36.3B).
- **Interpretation:** —
- **Competitive implication:** —
- **Confidence:** High · **Evidence:** S-1 p. 172; S-1/A p. 176

### 27. Stock-split assumptions removed from the summary (10-for-1 split already effected Sep 17, 2026)

*Administrative change · topic: other · section: Prospectus Summary*

- **Original (Oct 26):** Bullet: '10-for-one forward split ... effected on September 17, 2026 ...; one-for-1,000 reverse split of our Class T common stock'
- **Updated (Nov 2):** Removed (now reflected in the Sep 30 balance sheet).
- **Actual delta:** —
- **Why it matters:** Housekeeping.
- **Interpretation:** —
- **Competitive implication:** —
- **Confidence:** High · **Evidence:** S-1 p. 21; S-1/A p. —

### 28. Class E timing tightened: authorized 'Immediately prior to' rather than 'Upon' completion

*Administrative change · topic: other · section: Cover / Governance*

- **Original (Oct 26):** 'Upon the completion of this offering, we will also authorize ... Class E common stock'
- **Updated (Nov 2):** 'Immediately prior to the completion of this offering ...'
- **Actual delta:** Wording.
- **Why it matters:** Governance mechanics, no economic effect.
- **Interpretation:** —
- **Competitive implication:** —
- **Confidence:** High · **Evidence:** S-1 p. cover; S-1/A p. cover

## Specific investigation: is there October operating data in the amendment?

No. The only October-dated metric placeholder — "Additionally, our Run-Rate Revenue was $ as of October 31, 2026" (Business, S-1/A p. 198; S-1 p. 194) — is blank in both filings. October *events* do appear (Broadcom's assignment of part of the 2026 Lease Arrangement to a financing SPV; amendments to the Google and Microsoft agreements; ~$100.2B of new commitments after Sep 30; the 28.0M-share donation-match settlement; executive-agreement amendments), but no October revenue, usage or customer figures. Run-rate figures reported in the press for October are not from the filing.
