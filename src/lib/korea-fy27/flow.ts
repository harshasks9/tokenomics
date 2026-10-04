/**
 * The flow version's view of the plan: the same model, regrouped to the review
 * outline. Nothing here restates a number; every figure is read from the model.
 */
import type { SiteModel } from "./model";
import type { CohortId, PlayId } from "./types";
import { cadence, flowVerticals, followUps, q4Overview, takeaways, trainingTracks } from "./data/flow";
import { COMMERCIAL_BUCKETS, type CommercialBucket, type When } from "./flow-labels";

/** Bucket a dated target by the quarter in its own wording; undated targets fall to FY27. */
export function whenOf(text: string): When {
  if (/\bQ4\b/.test(text)) return "q4";
  if (/\bQ1\b/.test(text)) return "q1";
  if (/\bQ2\b|\bH1\b/.test(text)) return "q2";
  return "fy27";
}

const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
const capitalize = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
const round1 = (x: number) => Math.round(x * 10) / 10;

export function buildFlow(model: SiteModel) {
  const cohortOf = (id: CohortId) => {
    const c = model.cohorts.find((x) => x.id === id);
    if (!c) throw new Error(`Unknown cohort ${id}`);
    return c;
  };
  const growth = model.headline.growth;

  const verticals = flowVerticals.map((v) => {
    const c = cohortOf(v.cohort);
    const table = c.accountTables[v.example.table];
    const row = table?.rows.find((r) => r.name === v.example.account);
    const top = model.plan.topAccounts.rows.find((r) => r.segment === v.segment && r.motion === v.motion) ?? null;
    const staffing = model.resourcing.staffing.find((s) => s.cohort === v.cohort) ?? null;
    return {
      ...v,
      name: c.name,
      growthPct: Math.round((c.added / growth) * 100),
      top,
      staffing,
      milestones: c.targets.map((t) => ({ ...t, when: whenOf(t.text) })),
      commercialDecisionText: c.decisions[v.commercialDecision] ?? "",
      exampleRow: row
        ? { columns: table.columns, cells: row.cells, tableTitle: table.title, tableSrc: table.src }
        : null,
    };
  });

  const inFlow = new Set<CohortId>(verticals.map((v) => v.cohort));
  const others = model.cohorts
    .filter((c) => !inFlow.has(c.id))
    .map((c) => ({ id: c.id, name: c.name, motion: c.motion, segment: c.segment, added: c.added, fy27: c.fy27 }));

  const verticalCohorts = verticals.map((v) => cohortOf(v.cohort));
  const reconciliation = {
    verticalsAdded: sum(verticalCohorts.map((c) => c.added)),
    othersAdded: sum(others.map((o) => o.added)),
    verticalsFy26: round1(sum(verticalCohorts.map((c) => c.fy26))),
    verticalsFy27: sum(verticalCohorts.map((c) => c.fy27)),
    othersFy27: sum(others.map((o) => o.fy27)),
    autoEver: model.autoEver.fy27,
    statedGrowth: growth,
    statedFy27: model.headline.fy27Plan,
  };
  const addedTotal = reconciliation.verticalsAdded + reconciliation.othersAdded;
  const fy27Total = round1(reconciliation.verticalsFy27 + reconciliation.othersFy27 + reconciliation.autoEver);

  const commercial = verticals.map((v) => {
    const c = cohortOf(v.cohort);
    const cells = Object.fromEntries(
      COMMERCIAL_BUCKETS.map((b) => [b, c.commercial.filter((x) => x.startsWith(`${b}:`)).map((x) => capitalize(x.slice(b.length + 1).trim()))]),
    ) as Record<CommercialBucket, string[]>;
    const unbucketed = c.commercial.filter((x) => !COMMERCIAL_BUCKETS.some((b) => x.startsWith(`${b}:`)));
    return { vertical: v.id, label: v.label, motion: v.motion, cells, unbucketed, decision: v.commercialDecisionText };
  });

  const snapshots = model.resourcing.snapshots;
  const current = snapshots.find((s) => s.id === "current")!;
  const target = snapshots.find((s) => s.id === "target")!;
  const hiringRows = [...verticals.map((v) => v.cohort), ...others.map((o) => o.id)].map((id) => {
    const s = model.resourcing.staffing.find((x) => x.cohort === id)!;
    return {
      cohort: id,
      name: cohortOf(id).name,
      vertical: verticals.find((v) => v.cohort === id)?.label ?? null,
      current: s.current,
      plan: s.plan,
      target: s.target,
      addSs: s.target.aiSs - s.current.aiSs,
      addCe: s.target.aiCe === null ? null : s.target.aiCe - s.current.aiCe,
    };
  });
  const hiring = {
    rows: hiringRows,
    current: { aiSs: current.aiSs ?? 0, aiCe: current.aiCe ?? 0, fde: current.fde, vcbd: current.vcbd ?? 0 },
    target: { aiSs: target.aiSs ?? 0, aiCe: target.aiCe ?? 0, fde: target.fde, vcbd: target.vcbd ?? 0 },
    cohortCeNow: sum(hiringRows.map((r) => r.current.aiCe)),
    cohortCeTarget: sum(hiringRows.map((r) => r.target.aiCe ?? 0)),
    cohortSsNow: sum(hiringRows.map((r) => r.current.aiSs)),
    cohortSsTarget: sum(hiringRows.map((r) => r.target.aiSs)),
  };

  const training = model.execution.plays.map((p) => {
    const map = trainingTracks.find((t) => t.play === p.id);
    const dd = map ? model.execution.deepDives.find((d) => d.id === map.deepDive) : undefined;
    return {
      play: p.id as PlayId,
      name: p.name,
      what: p.what,
      leadsSlide17: model.cohorts.filter((c) => c.plays[p.id] === "lead").length,
      leadsCohortPages: model.cohorts.filter((c) => c.playsOnCohortPage[p.id] === "lead").length,
      verticalsLeading: verticals.filter((v) => cohortOf(v.cohort).plays[p.id] === "lead").map((v) => v.label),
      deepDive: dd?.title ?? null,
      pod: dd?.pod ?? null,
      tracks: (map?.tracks ?? []).map((i) => dd?.tracks[i]).filter((t): t is NonNullable<typeof t> => Boolean(t)).map((t) => ({ name: t.name, focus: t.focus })),
    };
  });

  const accountability = [...verticals.map((v) => v.cohort), ...others.map((o) => o.id)].map((id) => {
    const c = cohortOf(id);
    const v = verticals.find((x) => x.cohort === id);
    return {
      cohort: id,
      name: c.name,
      vertical: v?.label ?? null,
      verticalId: v?.id ?? null,
      motion: c.motion,
      owner: c.owner,
      sponsor: v?.sponsor.text ?? null,
      fy27: c.fy27,
      runRate: c.runRate,
      losPct: c.losPct,
      milestones: c.targets.length,
      roles: [...new Set(c.targets.map((t) => t.owner).filter((o): o is string => Boolean(o)))],
    };
  });

  return {
    verticals,
    others,
    reconciliation: { ...reconciliation, addedTotal, fy27Total },
    takeaways,
    q4Overview,
    commercial,
    hiring,
    training,
    accountability,
    cadence,
    followUps,
  };
}

export type FlowModel = ReturnType<typeof buildFlow>;
export type FlowVertical = FlowModel["verticals"][number];
