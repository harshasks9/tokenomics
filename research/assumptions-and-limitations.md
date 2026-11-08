# Assumptions, limitations and confidence

This file lists every assumption behind derived numbers, the comparability issues we guarded against, the data gaps, and how confident we are in each class of claim. Research cutoff: November 7, 2026.

## 1. Sources and their limits

| Source | Use | Limits |
|---|---|---|
| Form S-1 (Oct 26, 2026) and S-1/A No. 1 (Nov 2, 2026), EDGAR | All Anthropic financial and operating figures | Preliminary prospectus: offering terms, share counts, ownership percentages and the Oct 31 Run-Rate Revenue are blank. 20 customer case-study pages (S-1/A pp. 212–231) are image-only and were not text-parsed for this analysis's numbers. |
| EDGAR submissions index | Confirms no further amendment by the cutoff | — |
| Competitor releases, filings and press (`data/anthropic-s1/market.json`) | Context only; never used to compute an Anthropic figure | Many pages were read via search-engine extracts because their hosts were not reachable from the research environment; confidence is graded per fact. Survey sources have biases (Menlo is an Anthropic investor; Ramp covers its own customers). |

## 2. Page numbers

Page references are the printed folio of the page containing the quoted text in the EDGAR HTML. In the text extraction the folio line precedes its page's text (verified against the table of contents, e.g. "MANAGEMENT | 258"). Reported-fact pages are assigned automatically from verbatim quotes by `scripts/anthropic-s1/verify_evidence.py`. A PDF rendering may differ by ±1 page where image-only section covers intervene. Every quote is verbatim and searchable.

## 3. Calculated metrics and their assumptions

| Metric | Formula | Assumption / caveat |
|---|---|---|
| QoQ, YoY, dollar additions, TTM revenue | From the quarterly table | None; reproduce the filing's stated rates (checked) |
| Implied gross margin | 1 − functional cost of revenue ÷ revenue | Anthropic does not report gross margin; allocation of a "single fungible pool" across functions is management judgment; free-tier compute sits in S&M and internal-use compute in R&D |
| Customer-serving compute share (≤25.6%) | Cost of revenue ÷ compute & infrastructure (9M 2026) | Upper bound: cost of revenue includes some personnel/overhead |
| Compute ex short-term (Q3 ≈ 29% of revenue) | (9,863 − 5,000) ÷ 16,956 | Removes the full short-term cost, not just the premium |
| Q3 implied CSP-marketplace share (≈40%, range 38.7–41.6%) | (0.44 × 9M rev − 0.48 × H1 rev) ÷ Q3 rev | Uses rounded percentages from two filings; range applies ±0.5 pt |
| Channel fees ≈14% of revenue | $4.8B YoY increase ÷ 9M revenue | A floor on 9M fees (9M 2025 fees ≤ $322M); fees may apply beyond marketplace-billed revenue, so a take rate cannot be isolated |
| NRR cohort revenue ($8.2–13.1B; 48–77% of Q3) | Base ∈ [Q3’25 rev − 9M’25 subscriptions, Q3’25 rev] × NRR 8.5–9.5 | Subscriptions used as a loose proxy for excluded Pro/Max/Ultra revenue; "approximately 900%" read as 850–950% |
| Policy-violating revenue ($1.66–2.33B) | 5–7% × 9M revenue | Even spreading across quarters is an assumption in the sensitivity tool |
| Implied growth to cover obligations (~24%/quarter) | Solve R₀Σ(1+g)ᵏ (k = 1..4) = $69.8B ÷ 0.58 | Treats all obligations as compute expense at Q3's ratio; payments ≠ expense recognition for finance leases; obligations include research/internal compute and some capex-like prepayments |
| TPU-linked share of named arrangements (≈52–53%) | (161.2 + 121.3 + 125–150) ÷ Σ named headline amounts | Headline amounts mix minimums, "up to" amounts and estimates; Amazon's and Microsoft's chip mix is not specified in the agreement descriptions |
| Top-5% Claude Code spend (~$1,500/month) | 20 × <$75 | Upper-bound reading; selected tail |
| Headcount | Disclosed ~5,300 | — |

## 4. Illustrative obligation profile (used in Sections 06 and 14)

Only the $320.0B contractual table has a by-year schedule. The other buckets ($575.4B) are spread so the profile reproduces the three disclosed anchors exactly — $895.4B total, $447.5B before 2031, $69.8B in the 12 months after Sep 30, 2026:

- Q4 2026 non-table amount: $9.0B (assumption: mostly short-term minimums).
- 2027 non-table amount solved from the 12-month anchor (≈$44.9B); 2028–2030 non-table spread evenly (≈$74.0B/yr) to reach $447.5B.
- Table "thereafter" ($148.4B) spread 2031–2036 with weights 30/25/20/12/8/5%.
- Non-table 2031–2045 ($299.5B): $60B, $45B, $30B in 2031–2033, then level (~$13.7B/yr) through 2045.

This is a timing illustration, not a disclosure. The automated checks verify the anchors.

## 5. Scenario model (Section 14)

All inputs are assumptions, never guidance: starting QoQ revenue growth and quarterly decay; annual price change; annual compute-efficiency gain; research-compute growth; serving share of Q3 compute (default 30% vs the ≤25.6% bound plus free-tier serving); short-term premium on shortfalls; other cash costs as % of revenue (9M 2026 ≈ 31% on an adjusted basis); optional IPO proceeds, partner financing (+$77.0B) and exiting contingent commitments from 2028 (−23.9%). Base quarter = Q3 2026 actuals. Q3 compute is restated at committed prices with an assumed 1.6× premium (the actual premium is undisclosed: "significantly more"). The model ignores interest income, taxes, capex outside commitments, working capital, SBC and dilution.

## 6. Compute simulator (Section 05)

One quarter forward from Q3 2026. Defaults reproduce Q3 exactly. Non-compute costs are held at Q3's adjusted ratio (≈27% of revenue). The assumed Q3 short-term premium (1.6×) only affects how Q3's $5.0B is converted to committed-price capacity.

## 7. Analytical assessments

- **Moat scores (1–5)** are judgments, not measurements; each has evidence, counterargument, durability, replication difficulty and confidence. "Microsoft" scores its own models and distribution; OpenAI is scored separately.
- **Positioning map, monetization-unit framework and industry × function matrix** are analytical judgments on stated scales.
- **APAC/Japan segment views** are hypotheses with validation methods; no regional market shares are estimated.

- **Google Cloud AI GTM page (High / Medium / Low).** Ranks, implications, plays, owners and metrics are judgments for a Google Cloud go-to-market reader, using the rubric stated on the page. The statistics they rest on are verified filing quotes. Google-side context (Gemini Enterprise seats and usage, Google Cloud backlog, list prices) comes from company statements read through search extracts and is graded Medium or Low. The Q3 2026 Gemini Enterprise "Fortune 100" line is graded Low because secondary sources attribute it to different quarters. The filing's ">50% of ≥$100K customers used Claude Platform and ≥1 first-party app" is a breadth-of-adoption measure, not a token or revenue share by surface.

## 8. Guardrails applied

- Annualized or run-rate revenue is never mixed with recognized GAAP revenue (Q3 × 4 is labelled as such; Run-Rate Revenue is defined by the filing and blank for Oct 31).
- ~900% NRR is not compared with SaaS NRR without explaining the methodological difference.
- Customers are not treated as seats; "enterprise" means ≥$100K TTM spend per the filing.
- Compute expense is not treated as inference COGS.
- Adjusted operating income is not cash flow; mark-to-market losses are not cash burn.
- Commitment buckets are never added to named-arrangement amounts; contingent and excluded amounts are shown separately.
- Maximum or "up to" amounts are labelled as such, not as unconditional liabilities.
- No product-level margins, customer-level data, regional shares or competitor revenue are invented.
- Modeled values are visually separated from actuals and labelled as assumptions.

## 9. Data gaps (what the filing does not tell us)

Revenue by product; model-level profitability; training vs inference compute; accelerator utilization; gross retention and mature-cohort expansion; identity of top customers; revenue by industry and function; fee rates by CSP; fully loaded cost per agentic task; Oct 31 Run-Rate Revenue; nature and geography of policy-violating revenue; revenue by region beyond US/international. Absence of disclosure is not evidence of weakness.

## 10. Confidence by claim class

| Class | Confidence | Why |
|---|---|---|
| Reported filing figures and quotes | High | Verified verbatim against the EDGAR text; financial tables parsed by script and reconciled (70 automated checks) |
| Calculated metrics | High (arithmetic) / Medium (interpretation) | Formulas shown; interpretations depend on management allocations |
| Amendment change log | High | Two independent diff passes; every item checked in both filings |
| Competitor facts | Medium overall | Mixed primary/press; many read via search extracts |
| Moat scores, theses, playbook | Medium–Low | Analytical judgment, explicitly labelled |
| Scenarios | Illustrative only | Assumption-driven by design |
