/**
 * Verification checks run at build time (and in vitest). Each check compares
 * a reported total with the sum of its reported parts, or a stated ratio with
 * our recomputation. The Sources & Methodology section renders the results.
 */
import { CHANGES, COMMITMENTS, CUSTOMERS, EVIDENCE, GTM, GTM_RANKS, INSIGHTS, MARKET, MOAT, NARRATIVE, TABLES } from "./data";
import { annual, commitmentBucketsTotal, obligationProfile, quarterly, sum, TTM_REVENUE_SEP26 } from "./calc";

export interface Check { id: string; group: string; label: string; pass: boolean; detail: string }

const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

export function runChecks(): Check[] {
  const out: Check[] = [];
  const add = (group: string, id: string, label: string, pass: boolean, detail: string) => out.push({ id, group, label, pass, detail });
  const q = quarterly();
  const a = annual();
  const A = TABLES.s1a.annual_pnl;
  const s1 = TABLES.s1.annual_pnl;

  // Revenue totals
  add("Revenue", "rev-9m26", "Q1+Q2+Q3 2026 revenue = 9M 2026 revenue", sum(q.slice(4).map((r) => r.revenue)) === a[4].revenue, `${sum(q.slice(4).map((r) => r.revenue))} vs ${a[4].revenue}`);
  add("Revenue", "rev-9m25", "Q1+Q2+Q3 2025 revenue = 9M 2025 revenue", sum(q.slice(0, 3).map((r) => r.revenue)) === a[3].revenue, `${sum(q.slice(0, 3).map((r) => r.revenue))} vs ${a[3].revenue}`);
  add("Revenue", "rev-fy25", "Four 2025 quarters = FY2025 revenue", sum(q.slice(0, 4).map((r) => r.revenue)) === a[2].revenue, `${sum(q.slice(0, 4).map((r) => r.revenue))} vs ${a[2].revenue}`);
  add("Revenue", "rev-cross-filing", "S-1 H1 2026 revenue + S-1/A Q3 2026 = 9M 2026", s1["Revenue"][4] + q[6].revenue === a[4].revenue, `${s1["Revenue"][4]} + ${q[6].revenue}`);
  const geo = TABLES.s1a.revenue_by_geography, typ = TABLES.s1a.revenue_by_type;
  add("Revenue", "geo-sum", "US + international = total revenue (all periods)", geo["Total"].every((t, i) => geo["United States"][i] + geo["International"][i] === t), "5 periods");
  add("Revenue", "type-sum", "Consumption + subscription = total revenue (all periods)", typ["Total"].every((t, i) => typ["Consumption-based"][i] + typ["Subscription-based"][i] === t), "5 periods");
  add("Growth", "yoy-q3", "Q3 2026 YoY revenue growth rounds to the stated 1,127%", Math.round((q[6].yoy ?? 0) * 100) === 1127, `${((q[6].yoy ?? 0) * 100).toFixed(1)}%`);
  add("Growth", "yoy-q2", "Q2 2026 YoY revenue growth rounds to the stated 1,368% (Oct 26 S-1)", Math.round((q[5].yoy ?? 0) * 100) === 1368, `${((q[5].yoy ?? 0) * 100).toFixed(1)}%`);
  add("Growth", "compute-yoy-q3", "Q3 2026 YoY compute growth rounds to the stated 382%", Math.round((q[6].computeYoy ?? 0) * 100) === 382, `${((q[6].computeYoy ?? 0) * 100).toFixed(1)}%`);
  add("Growth", "compute-yoy-q2", "Q2 2026 YoY compute growth rounds to the stated 300%", Math.round((q[5].computeYoy ?? 0) * 100) === 300, `${((q[5].computeYoy ?? 0) * 100).toFixed(1)}%`);
  add("Growth", "rev-9m-growth", "9M 2026 revenue growth rounds to the stated 1,206%", Math.round((a[4].revenue / a[3].revenue - 1) * 100) === 1206, `${((a[4].revenue / a[3].revenue - 1) * 100).toFixed(1)}%`);
  add("Growth", "qoq-q4-q1", "QoQ growth Q4 2025 / Q1 2026 round to stated 48% / 132%", Math.round((q[3].qoq ?? 0) * 100) === 48 && Math.round((q[4].qoq ?? 0) * 100) === 132, `${((q[3].qoq ?? 0) * 100).toFixed(1)}% / ${((q[4].qoq ?? 0) * 100).toFixed(1)}%`);

  // Expense totals and reconciliations
  q.forEach((r) => {
    const parts = r.compute + r.personnel + r.bartz + r.sm + r.otherOpex;
    add("Expenses", `opex-${r.q}`, `${r.q}: expense lines sum to total operating expenses`, parts === r.totalOpex, `${parts} vs ${r.totalOpex}`);
    add("Expenses", `opinc-${r.q}`, `${r.q}: revenue − total opex = operating income`, r.revenue - r.totalOpex === r.opIncome, `${r.revenue - r.totalOpex} vs ${r.opIncome}`);
    const adj = r.opIncome + r.sbc + r.donation + r.bartz;
    add("Reconciliation", `adjoi-${r.q}`, `${r.q}: adjusted operating income reconciles`, adj === r.adjOpIncome, `${adj} vs ${r.adjOpIncome}`);
    const adjn = r.netLoss + r.sbc + r.donation + r.bartz - r.fvNotes + r.mtm + r.taxAdj;
    add("Reconciliation", `adjni-${r.q}`, `${r.q}: adjusted net income reconciles (±$1M rounding)`, near(adjn, r.adjNetIncome, 1), `${adjn} vs ${r.adjNetIncome}`);
  });
  add("Expenses", "compute-9m", "Quarterly compute Q1–Q3 2026 = 9M 2026 compute", sum(q.slice(4).map((r) => r.compute)) === a[4].compute, `${sum(q.slice(4).map((r) => r.compute))} vs ${a[4].compute}`);
  add("Expenses", "compute-cross-filing", "S-1 H1 2026 compute + S-1/A Q3 compute = 9M compute", s1["Compute and infrastructure"][4] + q[6].compute === a[4].compute, `${s1["Compute and infrastructure"][4]} + ${q[6].compute}`);
  const f = TABLES.s1a.functional_opex;
  add("Expenses", "functional-sum", "Functional expense presentation sums to total opex (all periods)", f["Total operating expenses"].every((t, i) => f["Cost of revenue"][i] + f["Research and development"][i] + f["Sales and marketing"][i] + f["Bartz settlement"][i] + f["General and administrative"][i] === t), "5 periods");
  add("Expenses", "functional-vs-natural", "Functional total = natural-expense total (9M 2026)", f["Total operating expenses"][4] === A["Total operating expenses"][4], `${f["Total operating expenses"][4]}`);
  add("Margins", "q3-op-margin", "Q3 2026 operating margin rounds to stated (3)%", Math.round(q[6].opMargin * 100) === -3, `${(q[6].opMargin * 100).toFixed(2)}%`);
  add("Margins", "q3-adj-margin", "Q3 2026 adjusted operating margin rounds to stated 15%", Math.round(q[6].adjMargin * 100) === 15, `${(q[6].adjMargin * 100).toFixed(2)}%`);
  add("Margins", "q3-compute-pct", "Q3 2026 compute % of revenue rounds to stated 58%", Math.round(q[6].computePct * 100) === 58, `${(q[6].computePct * 100).toFixed(2)}%`);

  // Customers
  const c = CUSTOMERS.cohort100k;
  add("Customers", "cohort-monotonic", "≥$100K customer counts increase over time", c.every((r, i) => i === 0 || r.count > c[i - 1].count), c.map((r) => r.count).join(" → "));
  const tier = (id: string) => CUSTOMERS.tiers.find((t) => t.id === id)!;
  add("Customers", "tier-nesting", "Tier counts nest: ≥$10M ≤ ≥$1M ≤ ≥$100K", tier("10m").count <= tier("1m").count && tier("1m").count <= tier("100k").count, `${tier("10m").count} ≤ ${tier("1m").count} ≤ ${tier("100k").count}`);
  add("Customers", "ttm-share", "≥$100K TTM revenue share recomputes to stated 74%", Math.round((26100 / TTM_REVENUE_SEP26) * 100) === 74, `${((26100 / TTM_REVENUE_SEP26) * 100).toFixed(1)}% of $${TTM_REVENUE_SEP26}M`);

  // Commitments
  const ct = COMMITMENTS.tableByYear;
  add("Commitments", "table-rows", "Contractual table: leases + purchase commitments = total, every column", ct.total.every((t, i) => ct.operatingLeases[i] + ct.financeLeases[i] + ct.purchaseCommitments[i] === t), "6 columns");
  add("Commitments", "table-total", "Contractual table columns sum to $319,993M", sum(ct.total) === 319993, `${sum(ct.total)}`);
  add("Commitments", "buckets", "Five non-overlapping buckets sum to ≈$895.4B (±$0.1B)", near(commitmentBucketsTotal(), COMMITMENTS.aggregate.total, 100), `${commitmentBucketsTotal()} vs ${COMMITMENTS.aggregate.total}`);
  add("Commitments", "timing", "Before-2031 + 2031–2045 = total", COMMITMENTS.aggregate.before2031 + COMMITMENTS.aggregate.from2031to2045 === COMMITMENTS.aggregate.total, "447.5 + 447.9 = 895.4");
  add("Commitments", "table-within-pre2031", "Table amounts through 2030 ≤ $447.5B disclosed before 2031", sum(ct.total.slice(0, 5)) <= COMMITMENTS.aggregate.before2031, `${sum(ct.total.slice(0, 5))}`);
  const prof = obligationProfile();
  add("Commitments", "profile-total", "Illustrative schedule reproduces $895.4B total", near(sum(prof.map((p) => p.total)), COMMITMENTS.aggregate.total, 1), `${sum(prof.map((p) => p.total)).toFixed(0)}`);
  add("Commitments", "profile-pre2031", "Illustrative schedule reproduces $447.5B before 2031", near(sum(prof.filter((p) => p.year < 2031).map((p) => p.total)), COMMITMENTS.aggregate.before2031, 1), "anchor");
  add("Commitments", "profile-next12", "Illustrative schedule reproduces $69.8B next 12 months", near(prof[0].total + 0.75 * prof[1].total, COMMITMENTS.aggregate.next12Months, 1), "anchor");
  const fin = COMMITMENTS.financing;
  const liq = sum(fin.filter((x) => ["cash", "sti", "revolver"].includes(x.id)).map((x) => x.amount));
  add("Liquidity", "liquidity", "Cash + short-term investments + revolver ≈ stated $146.6B (rounding)", near(liq, 146600, 150), `${liq}`);
  add("Liquidity", "npa", "NPA capacities sum to stated $77.0B", sum(fin.filter((x) => x.id.startsWith("npa")).map((x) => x.amount)) === 77000, "20 + 15 + 42");
  const bs = TABLES.s1a.balance_sheet_summary_sep30_2026;
  add("Liquidity", "cash-sti", "Cash + short-term investments ≈ balance-sheet $131,845M", near(95600 + 36300, bs["Cash, cash equivalents, and short-term investments"][0], 100), `${bs["Cash, cash equivalents, and short-term investments"][0]}`);

  // Evidence integrity
  const reported = EVIDENCE.filter((e) => e.classification === "reported");
  add("Evidence", "quotes", "Every 'reported' evidence quote verified verbatim in its filing", reported.every((e) => e.quoteVerified === true), `${reported.filter((e) => e.quoteVerified).length}/${reported.length}`);
  const ids = new Set(EVIDENCE.map((e) => e.id));
  const missing = INSIGHTS.flatMap((i) => i.evidenceIds).filter((id) => !ids.has(id));
  add("Evidence", "insight-refs", "Every insight cites evidence that exists in the library", missing.length === 0, missing.length ? missing.join(", ") : `${INSIGHTS.length} insights`);
  add("Evidence", "calc-formulas", "Every 'calculated' evidence item states its formula or inputs", EVIDENCE.filter((e) => e.classification === "calculated").every((e) => e.formula.length > 0 || e.quote.length > 0), "");
  add("Evidence", "changes-pages", "Every amendment change cites S-1 and S-1/A locations", CHANGES.every((ch) => ch.evidence.s1Page && ch.evidence.s1aPage), `${CHANGES.length} changes`);
  add("Assessments", "moat-range", "Moat scores are on the 1–5 rubric", MOAT.dimensions.every((d) => Object.values(d.scores).every((v) => v >= 1 && v <= 5)), `${MOAT.dimensions.length} dimensions`);

  // Google Cloud AI GTM page
  const mk = new Set(MARKET.map((m) => m.id));
  const sections = new Set(NARRATIVE.sections.map((s) => s.id));
  const areas = new Set(GTM.areas.map((a) => a.id));
  const gtmIds = new Set(GTM.items.map((i) => i.id));
  const ledgerRows = [...GTM.ledger.pays, ...GTM.ledger.costs];
  const gtmEvidence = [...GTM.items.flatMap((i) => i.evidenceIds), ...GTM.example.evidenceIds, ...ledgerRows.flatMap((r) => r.evidenceIds)];
  const gtmMarket = [...GTM.items.flatMap((i) => i.marketIds), ...GTM.example.marketIds, ...ledgerRows.flatMap((r) => r.marketIds ?? [])];
  const gtmMissing = [...gtmEvidence.filter((id) => !ids.has(id)), ...gtmMarket.filter((id) => !mk.has(id))];
  add("GTM page", "gtm-refs", "Every GTM implication cites filing evidence and market facts that exist", gtmMissing.length === 0 && GTM.items.every((i) => i.evidenceIds.length > 0), gtmMissing.length ? gtmMissing.join(", ") : `${gtmEvidence.length} filing refs, ${gtmMarket.length} market refs`);
  add("GTM page", "gtm-ranks", "Every GTM implication has a High/Medium/Low rank and a known area", GTM.items.every((i) => GTM_RANKS.includes(i.rank) && areas.has(i.area)), GTM_RANKS.map((r) => `${r} ${GTM.items.filter((i) => i.rank === r).length}`).join(" · "));
  add("GTM page", "gtm-links", "Every GTM deep-dive link and top-move reference resolves", GTM.items.every((i) => sections.has(i.deepDive)) && sections.has(GTM.example.deepDive) && GTM.moves.every((m) => m.refs.every((r) => gtmIds.has(r))), `${GTM.items.length} items, ${GTM.moves.length} moves`);
  add("GTM page", "gtm-unique", "GTM implication ids are unique", gtmIds.size === GTM.items.length, `${gtmIds.size}`);
  return out;
}
