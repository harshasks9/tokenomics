/**
 * Assembles the plan site's single model: source data + derived figures +
 * reconciliation checks. Server-only by convention: client components import
 * the SiteModel *type* and receive the model as props, so the plan data never
 * ships in a public JS chunk.
 */
import type { Check, CohortId, MotionId, SegmentId } from "./types";
import { autoEver, cohorts } from "./data/cohorts";
import { segments, marketTotals, competitors, signals, sizingMethods, marketDeepDives } from "./data/market";
import { business, penetration } from "./data/business";
import {
  headline,
  facts,
  fragility,
  ladder,
  marketVsShare,
  equationRanges,
  motions,
  motionMix,
  levers,
  leverNotes,
  topAccounts,
  mustBeTrue,
} from "./data/plan";
import {
  plays,
  enablers,
  enablerNote,
  heatmapNote,
  engines,
  phases,
  phaseGrid,
  governance,
  kpis,
  commercialBuckets,
  activation,
  deepDives,
} from "./data/execution";
import { snapshots, fdeModels, fdeConflict, staffing, staffingNotes, pods, ecosystem, modelMotions, vc } from "./data/org";
import { risks, riskNotes, asks, askClosing, askLinkNote } from "./data/decisions";
import { conflicts, sourceDoc, sourceLabels, sourceMap } from "./data/sources";

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
const round1 = (value: number) => Math.round(value * 10) / 10;

function check(
  id: string,
  label: string,
  formula: string,
  computed: number,
  stated: number,
  tolerance: number,
  unit: Check["unit"],
  slides: string,
  kind: Check["kind"] = "rounding",
): Check {
  const delta = round1(computed - stated);
  return {
    id,
    label,
    formula,
    computed: round1(computed),
    stated,
    tolerance,
    unit,
    slides,
    kind,
    pass: Math.abs(computed - stated) <= tolerance + 1e-9,
    delta,
  };
}

const byId = (id: CohortId) => {
  const cohort = cohorts.find((c) => c.id === id);
  if (!cohort) throw new Error(`Unknown cohort ${id}`);
  return cohort;
};

const fy26Of = (id: CohortId) => byId(id).fy26Precise ?? byId(id).fy26;

export function buildModel() {
  // ── Derived: motion × segment matrix, from the cohorts ──────────────────
  const motionIds: MotionId[] = ["deepen", "penetrate", "acquire"];
  const segmentIds: SegmentId[] = ["dn", "ce", "mm", "ps"];
  const matrix = motionIds.map((motion) => ({
    motion,
    cells: segmentIds.map((segment) => {
      const members = cohorts.filter((c) => c.motion === motion && c.segment === segment);
      return { segment, cohorts: members.map((c) => c.id), value: members.length ? sum(members.map((c) => c.added)) : null };
    }),
  }));
  const matrixRowSum = (motion: MotionId) => sum(cohorts.filter((c) => c.motion === motion).map((c) => c.added));
  const matrixColSum = (segment: SegmentId) => sum(cohorts.filter((c) => c.segment === segment).map((c) => c.added));
  const segmentFY27 = (segment: SegmentId) =>
    sum(cohorts.filter((c) => c.segment === segment).map((c) => c.fy27)) + (segment === "ce" ? autoEver.fy27 : 0);
  const segmentFY26 = (segment: SegmentId) =>
    sum(cohorts.filter((c) => c.segment === segment).map((c) => fy26Of(c.id))) + (segment === "ce" ? autoEver.fy26 : 0);

  // ── Derived: base case by cohort = FY27 − the levers that land there ────
  const leverAddsFor = (id: CohortId) =>
    sum(levers.flatMap((lever) => lever.landsIn.filter((l) => l.cohort === id).map((l) => l.value)));
  const baseByCohort = cohorts.map((c) => ({ cohort: c.id, base: c.fy27 - leverAddsFor(c.id), levers: leverAddsFor(c.id), fy27: c.fy27 }));
  const baseTotal = sum(baseByCohort.map((b) => b.base)) + autoEver.fy27;

  // ── Derived: line of sight gap ($ not yet in today's run-rate) ──────────
  const losRows = cohorts.map((c) => ({
    cohort: c.id,
    fy27: c.fy27,
    runRate: c.runRate,
    losPct: c.losPct,
    computedPct: round1((c.runRate / c.fy27) * 100),
    gap: round1(c.fy27 - c.runRate),
  }));
  const dnRunRate = sum(cohorts.filter((c) => c.segment === "dn").map((c) => c.runRate));

  // ── Derived: hold-share bridge (slide 49 logic) ─────────────────────────
  const holdShare = sum(segments.map((s) => s.googleFY26 * s.tamGrowth));
  const dnShareGain = segments[0].planFY27 - segments[0].googleFY26 * segments[0].tamGrowth;

  const topRows = topAccounts.rows;
  const topGoogle = sum(topRows.map((r) => r.googleToday));
  const topTotal = sum(topRows.map((r) => r.totalAiSpend));
  const kraftonUnitemized = topAccounts.stated.krafton - topAccounts.stated.kraftonItemized;
  const otherVendors = topTotal - topGoogle - kraftonUnitemized;

  const marketFY26Sum = sum(segments.map((s) => s.marketFY26));
  const marketFY27Sum = sum(segments.map((s) => s.marketFY27));

  const staffingSum = (pick: (row: (typeof staffing)[number]) => number | null) => sum(staffing.map((row) => pick(row) ?? 0));

  const cohortChecks: Check[] = cohorts.flatMap((c) => [
    check(`${c.id}-adds`, `${c.name}: FY26 + added = FY27`, `${c.fy26} + ${c.added}`, c.fy26 + c.added, c.fy27, 0.5, "$M", c.srcMain.slides, "exact"),
    check(
      `${c.id}-build`,
      `${c.name}: build-up sums to FY27`,
      c.buildUp.map((step) => step.value).join(" + "),
      sum(c.buildUp.map((step) => step.value)),
      c.fy27,
      0.6,
      "$M",
      "12",
    ),
    check(
      `${c.id}-los`,
      `${c.name}: line of sight = run-rate ÷ FY27`,
      `${c.runRate} ÷ ${c.fy27}`,
      (c.runRate / c.fy27) * 100,
      c.losPct,
      0.75,
      "%",
      c.srcAppendix.slides,
    ),
  ]);

  const checks: Check[] = [
    // Headline economics
    check("h-4x", "~4x: FY27 plan ÷ FY26", "900 ÷ 226", headline.fy27Plan / headline.fy26Ai, 4, 0.05, "x", "1, 4"),
    check("h-gcp-ai", "AI share of FY26 GCP growth", "(226 − 50) ÷ (534 − 316)", ((headline.fy26Ai - headline.aiFY25) / (headline.gcpFY26 - headline.gcpFY25)) * 100, headline.aiShareOfGcpGrowthStated, 0.5, "%", "3"),
    check("h-ai-added", "AI added in FY26", "226 − 50", headline.fy26Ai - headline.aiFY25, headline.aiAddedFY26, 1, "$M", "3, 9"),
    check("h-share26", "FY26 share of wallet", "226 ÷ 1,325 (segment sum)", (headline.fy26Ai / marketFY26Sum) * 100, headline.shareFY26, 0.5, "%", "4, 9"),
    check("h-share27", "FY27 share at plan", "900 ÷ 2,655 (segment sum)", (headline.fy27Plan / marketFY27Sum) * 100, headline.shareFY27, 0.5, "%", "4, 49"),
    check("h-share27-headline", "FY27 share using the ~$2.6B headline", "900 ÷ 2,600", (headline.fy27Plan / headline.marketFY27) * 100, headline.shareFY27, 0.75, "%", "4"),
    check("h-market2x", "Market ~2x", "2,655 ÷ 1,325", marketFY27Sum / marketFY26Sum, 2, 0.05, "x", "4, 44"),
    check("h-share2x", "Share of wallet ~2x", "34 ÷ 17", headline.shareFY27 / headline.shareFY26, 2, 0.05, "x", "4"),
    check("h-equation", "Equation: FY26 × market × share", "226 × 2.0 × 2.0", headline.fy26Ai * 2 * 2, headline.fy27Plan, 5, "$M", "4"),
    // Market
    check("m-fy26", "FY26 wallet: segments vs ~$1.3B", "720 + 510 + 45 + 50", marketFY26Sum, headline.marketFY26, 30, "$M", "7"),
    check("m-fy27", "FY27 wallet: segments vs ~$2.6B (~$2.65B on slides 44, 49)", "1,490 + 920 + 90 + 155", marketFY27Sum, 2650, 10, "$M", "7, 44"),
    check("m-90", "DN + C&E share of the FY27 wallet", "(1,490 + 920) ÷ 2,655", ((segments[0].marketFY27 + segments[1].marketFY27) / marketFY27Sum) * 100, marketTotals.dnPlusCePct, 1.5, "%", "6, 44"),
    check("m-range26", "FY26 TAM range, low end", "580 + 385 + 25 + 30", sum(segments.map((s) => s.tamFY26[0])), marketTotals.fy26Range[0], 5, "$M", "43, 44"),
    check("m-range27", "FY27 TAM range, high end", "1,885 + 1,220 + 130 + 230", sum(segments.map((s) => s.tamFY27[1])), marketTotals.fy27Range[1], 5, "$M", "44"),
    ...segments.map((s) =>
      check(`m-share-${s.id}`, `${s.name}: FY26 share`, `${s.googleFY26} ÷ ${s.midFY26}`, (s.googleFY26 / s.midFY26) * 100, s.shareFY26, 0.7, "%", "48"),
    ),
    ...segments.map((s) =>
      check(
        `m-plan-${s.id}`,
        `${s.name}: share at FY27 plan`,
        `${s.planFY27} ÷ ${s.midFY27 ?? s.marketFY27}`,
        (s.planFY27 / (s.midFY27 ?? s.marketFY27)) * 100,
        s.sharePlan,
        0.75,
        "%",
        "45, 49",
      ),
    ),
    check("m-comp-total", "Competitor-implied total (low)", "700 + 226 + 200 + 100", 700 + 226 + 200 + 100, 1225, 1, "$M", "46"),
    check("m-comp-x", "Anthropic vs Google", "700 ÷ 226", 700 / 226, 3, 0.15, "x", "46"),
    check("m-comp-share", "Google share excl. open weight (mid)", "226 ÷ 1,051", (226 / 1051) * 100, 21.5, 0.5, "%", "46"),
    check("m-budget", "Government AI budget", "KRW 9.9tn ÷ 3.3tn", 9.9 / 3.3, 3, 0.01, "x", "41"),
    // Plan ladder and share bridge
    check("p-floor", "Organic floor", "226 × 1.35", headline.fy26Ai * 1.35, ladder.given.value, 1, "$M", "3", "exact"),
    check("p-base-levers", "Base case + levers", "725 + 175", ladder.commit.value + ladder.stretch.value, headline.fy27Plan, 0, "$M", "3, 92", "exact"),
    check("p-levers", "Eight levers", levers.map((l) => l.value).join(" + "), sum(levers.map((l) => l.value)), leverNotes.stated.total, 0, "$M", "92", "exact"),
    check("p-87", "Samsung + big AI spenders levers", "50 + 37", levers[0].value + levers[1].value, leverNotes.stated.samsungPlusBigAi, 0, "$M", "92", "exact"),
    check("p-base-cohorts", "Base case by cohort (derived) + AutoEver", "Σ (FY27 − levers) + 13.4", baseTotal, ladder.commit.value, 2, "$M", "3, 92"),
    check("p-whales", "Whales: 2–6 deals × ~$50M (high end)", "6 × 50", 6 * 50, ladder.upside.range[1], 0, "$M", "92", "exact"),
    check("p-hold", "Hold share: FY26 × segment TAM growth", "102×2.1 + 121×1.8 + 2.3×2.1 + 0.5×3.1", holdShare, marketVsShare.holdShare, 5, "$M", "45, 49"),
    check("p-mgrowth", "Market growth", "435 − 226", marketVsShare.holdShare - headline.fy26Ai, marketVsShare.marketGrowth, 0, "$M", "49", "exact"),
    check("p-gain", "Share gain", "900 − 435", headline.fy27Plan - marketVsShare.holdShare, marketVsShare.shareGain, 0, "$M", "49", "exact"),
    check("p-dn-gain", "DN share of the share gain", "(551 − 102 × 2.1) ÷ 465", (dnShareGain / marketVsShare.shareGain) * 100, marketVsShare.dnShareOfGain, 1.5, "%", "45, 49"),
    // Motions and the matrix
    check("x-adds", "Motion adds vs +$675M", "277 + 142 + 257", sum(motions.map((m) => m.added)), headline.growth, 1, "$M", "4, 13"),
    ...motions.map((m) =>
      check(`x-share-${m.id}`, `${m.name}: share of growth`, `${m.added} ÷ 675`, (m.added / headline.growth) * 100, m.sharePct, 0.6, "%", "11, 91"),
    ),
    ...motions.map((m) =>
      check(`x-row-${m.id}`, `${m.name}: cohort cells sum to the motion`, "Σ cohort adds", matrixRowSum(m.id), m.added, 1, "$M", "13"),
    ),
    ...segments.map((s) =>
      check(`x-col-${s.id}`, `${s.name}: cohort cells sum to the segment add`, "Σ cohort adds", matrixColSum(s.id), s.added, 1, "$M", "13"),
    ),
    ...segments.map((s) =>
      check(`x-fy27-${s.id}`, `${s.name}: FY27 from cohorts${s.id === "ce" ? " + AutoEver" : ""}`, "Σ cohort FY27", segmentFY27(s.id), s.planFY27, 1, "$M", "13, 45"),
    ),
    ...segments.map((s) =>
      check(`x-fy26-${s.id}`, `${s.name}: FY26 from cohorts${s.id === "ce" ? " + AutoEver" : ""}`, "Σ cohort FY26", segmentFY26(s.id), s.googleFY26, 1, "$M", "45, 91"),
    ),
    check("x-pa", "Penetrate + Acquire share of growth", "(142 + 257) ÷ 675", ((motions[1].added + motions[2].added) / headline.growth) * 100, motionMix.penetratePlusAcquirePct, 1.5, "%", "11"),
    check("x-da", "Deepen + Acquire share of growth", "(277 + 257) ÷ 675", ((motions[0].added + motions[2].added) / headline.growth) * 100, motionMix.deepenPlusAcquirePct, 0.5, "%", "91"),
    check("x-acq-split", "Acquire: already buying AI + new to AI", "193 + 64", sum(motionMix.acquireSplit.map((a) => a.value)), motions[2].added, 0, "$M", "11", "exact"),
    check("x-three", "Three cohorts' share of growth", "(177 + 193 + 100) ÷ 675", ((byId("big-ai").added + byId("startups").added + byId("samsung").added) / headline.growth) * 100, 70, 1, "%", "12"),
    check("x-dn67", "DN share of growth", "449 ÷ 675", (segments[0].added / headline.growth) * 100, 67, 1, "%", "4, 94"),
    check("x-dn61", "DN share of the FY27 plan", "551 ÷ 900", (segments[0].planFY27 / headline.fy27Plan) * 100, 61, 0.5, "%", "45"),
    check("x-fy26", "FY26: eight cohorts + AutoEver", "Σ cohort FY26 + 13.4", sum(cohorts.map((c) => fy26Of(c.id))) + autoEver.fy26, headline.fy26Ai, 1, "$M", "12"),
    check("x-fy27", "FY27: eight cohorts + AutoEver", "Σ cohort FY27 + 13.4", sum(cohorts.map((c) => c.fy27)) + autoEver.fy27, headline.fy27Plan, 2, "$M", "12, 97"),
    check("x-888", "FY27 cohorts excluding AutoEver", "Σ cohort FY27", sum(cohorts.map((c) => c.fy27)), 888, 0, "$M", "97", "exact"),
    check("x-859", "Resourcing slide total (excl. AutoEver and the long tail)", "888 − 29", sum(cohorts.map((c) => c.fy27)) - 29, 859, 0, "$M", "23, 24", "exact"),
    check("x-m-deepen", "Deepen FY27 level (incl. AutoEver)", "255 + 199 + 13.4", byId("big-ai").fy27 + byId("samsung").fy27 + autoEver.fy27, motions[0].fy27, 1, "$M", "94"),
    check("x-m-penetrate", "Penetrate FY27 level", "93 + 70", byId("big-gcp").fy27 + byId("flagship").fy27, motions[1].fy27, 1, "$M", "94"),
    check("x-m-acquire", "Acquire FY27 level", "203 + 28 + 15 + 25", byId("startups").fy27 + byId("trad-ent").fy27 + byId("mid-market").fy27 + byId("public").fy27, motions[2].fy27, 1, "$M", "94"),
    // Cohorts
    ...cohortChecks,
    check("c-dn-los", "DN line of sight", "(97.8 + 14.6 + 8.3) ÷ 551", (dnRunRate / segments[0].planFY27) * 100, 22, 0.5, "%", "99"),
    check("c-wrtn-coupang", "Wrtn + Coupang share of big-AI run-rate", "(41.8 + 19.7) ÷ 97.8", ((41.8 + 19.7) / 97.8) * 100, 63, 0.5, "%", "104"),
    check("c-top3", "Wrtn + Scatter Lab + Coupang share of run-rate", "(41.8 + 20.7 + 19.7) ÷ 97.8", ((41.8 + 20.7 + 19.7) / 97.8) * 100, 84, 0.5, "%", "104"),
    check("c-samsung-x", "Samsung FY27 vs today's run-rate", "199 ÷ 118.1", byId("samsung").fy27 / byId("samsung").runRate, 1.7, 0.05, "x", "92"),
    check("c-samsung-81", "Samsung expansion beyond run-rate", "199 − 118.1", byId("samsung").fy27 - byId("samsung").runRate, 81, 0.5, "$M", "118"),
    check("c-seats", "Traditional enterprise seats", "7 × 30K + 20 × 3K (thousands)", 7 * 30 + 20 * 3, 270, 0, "count", "12", "exact"),
    check("c-gcp50", "Big GCP spenders: ~50% of $135M GCP", "0.5 × 135", 0.5 * 135, 68, 0.5, "$M", "12"),
    check("c-vc", "VC-led line", "90 + 24", sum(vc.vcLedParts.map((p) => p.value)), vc.vcLed, 0, "$M", "28", "exact"),
    check("c-vc-pct", "VC-led share of the startup add", "114 ÷ 193", (vc.vcLed / byId("startups").added) * 100, vc.vcLedPctStated, 0.5, "%", "28"),
    check("c-funnel-named", "56 named + 1K+ program", "60 + 50 + 40 + 24", sum(vc.funnel.slice(0, 4).map((f) => f.value)), vc.funnelStated.named, 0, "$M", "111", "exact"),
    check("c-funnel", "Funnel + long tail", "174 + 29", sum(vc.funnel.map((f) => f.value)), vc.funnelStated.total, 0, "$M", "111", "exact"),
    // Top 13 accounts
    check("t-google", "Top 13: Google AI today", "Σ rows", topGoogle, topAccounts.stated.googleToday, 0.5, "$M", "14"),
    check("t-total", "Top 13: total AI spend", "Σ rows", topTotal, topAccounts.stated.totalAiSpend, 0.5, "$M", "14"),
    check("t-share", "Top 13: Google share", "160 ÷ 519", (topGoogle / topTotal) * 100, topAccounts.stated.googleSharePct, 0.5, "%", "14"),
    check("t-ao", "Top 13: Anthropic + OpenAI", "Σ rows", sum(topRows.map((r) => r.anthropicOpenAi)), topAccounts.stated.anthropicOpenAi, 1, "$M", "14"),
    check("t-base", "Top 13: plan base", "Σ rows", sum(topRows.map((r) => r.planBase)), topAccounts.stated.planBase, 1, "$M", "14"),
    check("t-stretch", "Top 13: plan stretch", "Σ rows", sum(topRows.map((r) => r.planStretch)), topAccounts.stated.planStretch, 0, "$M", "14", "exact"),
    check("t-exsk", "Top 13: total excl. SK's on-prem GPUs", "519 − 150", topTotal - topAccounts.stated.skGpu, topAccounts.stated.totalExSk, 0.5, "$M", "14"),
    check("t-exsk-share", "Top 13: Google share excl. SK GPUs", "160 ÷ 369", (topGoogle / (topTotal - topAccounts.stated.skGpu)) * 100, topAccounts.stated.shareExSk, 0.5, "%", "14"),
    check("t-other", "Other vendors (Krafton at its itemized $9.8M)", "519 − 160 − 15.2", otherVendors, topAccounts.stated.otherVendors, 1, "$M", "14"),
    check("t-other-mkt", "Other vendors in our market", "344.6 − 150", otherVendors - topAccounts.stated.skGpu, topAccounts.stated.otherVendorsInMarket, 1, "$M", "14"),
    check("t-cover-lo", "Top 13 base as share of the plan", "274 ÷ 900", (topAccounts.stated.planBase / headline.fy27Plan) * 100, 30, 1, "%", "14"),
    check("t-cover-hi", "Top 13 stretch as share of the plan", "443 ÷ 900", (topAccounts.stated.planStretch / headline.fy27Plan) * 100, 50, 1, "%", "14"),
    // Resourcing
    check("r-current-ss", "Current AI SS by cohort", "Σ cohorts", staffingSum((r) => r.current.aiSs), snapshots[0].aiSs ?? 0, 0, "count", "23", "exact"),
    check("r-current-ce", "Current AI CE: cohort + 4 specialty pool", "Σ cohorts + 4", staffingSum((r) => r.current.aiCe) + 4, snapshots[0].aiCe ?? 0, 0, "count", "23", "exact"),
    check("r-plan-ss", "Plan AI SS by cohort", "Σ cohorts", staffingSum((r) => r.plan.aiSs), snapshots[1].aiSs ?? 0, 0, "count", "12, 97", "exact"),
    check("r-target-ss", "Target AI SS by cohort", "Σ cohorts", staffingSum((r) => r.target.aiSs), snapshots[2].aiSs ?? 0, 0, "count", "24", "exact"),
    check("r-target-ce", "Target AI CE by cohort", "Σ cohorts", staffingSum((r) => r.target.aiCe), snapshots[2].aiCe ?? 0, 0, "count", "24", "exact"),
    check("r-top3", "AI SS on the three biggest cohorts", "3 + 3 + 1", 3 + 3 + 1, 7, 0, "count", "12, 97", "exact"),
    check("r-fde", "FDE models agree on 14", "6 + 8 vs 3 + 11", 6 + 8, 3 + 11, 0, "count", "3, 23", "exact"),
    // FY26 penetration (Appendix B)
    check("b-ai", "FY26 AI by internal segment", "Σ segments", 17.2 + 103.8 + 21.5 + 0.8 + 82.6 + 0.2, 226.1, 0.05, "$M", "83", "exact"),
    check("b-accts", "Accounts by internal segment", "Σ segments", 89 + 16 + 509 + 83 + 80 + 39, headline.accounts, 0, "count", "83", "exact"),
    check("b-partA", "≥$1M GCP accounts: AI % of GCP", "210.7 ÷ 492.1", (210.7 / 492.1) * 100, 43, 0.5, "%", "84"),
    check("b-upsell", "AI upsell list: AI % of GCP", "6.5 ÷ 75.6", (6.5 / 75.6) * 100, 9, 0.5, "%", "89"),
    check("b-bands", "Accounts across spend bands", "12 + 3 + 22 + 24 + 31 + 51 + 673", 12 + 3 + 22 + 24 + 31 + 51 + 673, headline.accounts, 0, "count", "87", "exact"),
    check("b-ge", "GE wins across spend bands", "2 + 0 + 3 + 1 + 2 + 1 + 3", 2 + 0 + 3 + 1 + 2 + 1 + 3, 12, 0, "count", "85, 87", "exact"),
    check("b-ce93", "C&E AI in Samsung + AutoEver", "(99 + 13.4) ÷ 121", ((99 + 13.4) / 121) * 100, 93, 0.5, "%", "65"),
  ];

  const passed = checks.filter((c) => c.pass).length;

  return {
    meta: {
      ...sourceDoc,
      labels: sourceLabels,
      builtFrom: "Built from the deck and a structured build brief; every number carries its slide reference.",
    },
    headline,
    facts,
    fragility,
    ladder,
    marketVsShare,
    equationRanges,
    mustBeTrue,
    market: { segments, totals: marketTotals, competitors, signals, sizingMethods, deepDives: marketDeepDives },
    business,
    penetration,
    plan: {
      motions,
      motionMix,
      matrix,
      segmentFY27: segmentIds.map((segment) => ({ segment, value: segmentFY27(segment) })),
      levers,
      leverNotes,
      baseByCohort,
      baseTotal,
      topAccounts,
    },
    cohorts,
    autoEver,
    los: { rows: losRows, dnRunRate, dnPct: round1((dnRunRate / segments[0].planFY27) * 100) },
    execution: { plays, enablers, enablerNote, heatmapNote, engines, phases, phaseGrid, governance, kpis, commercialBuckets, activation, deepDives },
    resourcing: { snapshots, fdeModels, fdeConflict, staffing, staffingNotes, pods, ecosystem, modelMotions },
    vc,
    risks: { items: risks, notes: riskNotes },
    asks: { items: asks, closing: askClosing, linkNote: askLinkNote },
    audit: { checks, passed, total: checks.length },
    conflicts,
    sourceMap,
  };
}

export type SiteModel = ReturnType<typeof buildModel>;
