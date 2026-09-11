/**
 * Deal file and deal construct.
 *
 * A deal file is a plain JSON document: who the customer is, every input, and
 * a snapshot of the verdict. It is the unit you save, export, review and
 * revisit. The deal construct is derived from it: the Google Private Offer
 * terms as they would be written for this customer, with the checks the offer
 * summary imposes and the approvals and steps it requires.
 */

import { GOOGLE } from "./terms";
import { RANK_LABEL, creditFunnel, defaults, evaluate, geminiPlay, type Inputs, type Rank, type Result } from "./engine";
import { usd, pct } from "./format";

export interface DealMeta {
  customer: string;
  onTargetList: boolean;
  owner: string;
  notes: string;
}

export const emptyMeta = (): DealMeta => ({ customer: "", onTargetList: false, owner: "", notes: "" });

export type RowStatus = "ok" | "warn" | "stop" | "info";

export interface ConstructRow {
  label: string;
  value: string;
  status: RowStatus;
  note?: string;
}

export interface Milestone {
  index: number;
  /** Cumulative incremental marketplace spend that triggers the tranche ($M). */
  threshold: number;
  tranche: number;
}

export interface DealConstruct {
  rows: ConstructRow[];
  milestones: Milestone[];
  approvals: string[];
  steps: string[];
  blockers: string[];
  forecastY1: number;
  pool: number;
}

export interface DealFile {
  version: 1;
  savedAt: string;
  meta: DealMeta;
  inputs: Inputs;
  snapshot: { horizon: number; rank: Rank; advantage: number; awsNet: number; gcpNet: number };
}

export function dealConstruct(meta: DealMeta, inputs: Inputs, result: Result): DealConstruct {
  const i = inputs, g = result.routes.gcp, f = creditFunnel(result).gcp;
  const rows: ConstructRow[] = [];
  const blockers: string[] = [];
  const approvals: string[] = ["DPO (executes the offer; approves up to 10% credits for deals of 3 years or shorter)"];
  const sign = Math.round(i.gcpSignMonth);

  rows.push({ label: "Customer", value: meta.customer || "(unnamed)", status: "info", note: [meta.owner && `Owner: ${meta.owner}`, meta.notes].filter(Boolean).join(" · ") || undefined });
  rows.push({
    label: "Target list",
    value: meta.onTargetList ? `On the pre-approved list of ${GOOGLE.eligibleAccounts.value.total}` : "Not confirmed on the pre-approved list",
    status: meta.onTargetList ? "ok" : "stop",
    note: meta.onTargetList ? undefined : "The offer is limited to 40 pre-approved accounts, no exceptions. Confirm the account is on the list before requesting terms.",
  });
  if (!meta.onTargetList) blockers.push("Account not confirmed on the 40-account target list.");

  rows.push({ label: "Workload today", value: `${usd(i.anthSpend)}/yr Anthropic spend ${({ direct: "direct", aws: "on AWS Bedrock", gcp: "on GCP marketplace" })[i.platform]}, ${i.growth}%/yr growth, ${i.migPct}% moving from month ${i.migStart}`, status: "info" });
  if (i.geminiShare > 0) rows.push({ label: "Gemini offload", value: `${i.geminiShare}% of the traffic served by Gemini at ${i.geminiCostRatio}% of the Anthropic cost; ${100 - i.geminiShare}% stays on Anthropic via marketplace and earns credits`, status: "info", note: `Gemini spend of ${usd(g.totals.geminiSpend)} within the horizon is Cloud AI consumption, so the credits can be applied to it.` });

  rows.push({ label: "Qualification: marketplace paperwork", value: "Sign the Marketplace ToS and a Marketplace agreement", status: "info" });
  const eligible = i.gcpCommitNew >= GOOGLE.minIacv.value;
  rows.push({
    label: "Qualification: incremental GCP commit",
    value: `${usd(i.gcpCommitNew)}/yr iACV × ${i.gcpCommitYears} year${i.gcpCommitYears === 1 ? "" : "s"} = ${usd(i.gcpCommitNew * i.gcpCommitYears)} total`,
    status: eligible ? (i.gcpCommitYears > GOOGLE.dpoMaxYears.value ? "warn" : "ok") : "stop",
    note: eligible ? (i.gcpCommitYears > GOOGLE.dpoMaxYears.value ? `Longer than ${GOOGLE.dpoMaxYears.value} years: outside DPO authority, needs DPM.` : undefined) : `Below the ${usd(GOOGLE.minIacv.value)} iACV minimum. Deals under this are not eligible for escalation to DPM.`,
  });
  if (!eligible) blockers.push(`Incremental commit below ${usd(GOOGLE.minIacv.value)} iACV.`);
  if (i.gcpCommitYears > GOOGLE.dpoMaxYears.value) approvals.push(`DPM (deal longer than ${GOOGLE.dpoMaxYears.value} years)`);

  rows.push({ label: "Baseline at signing", value: `${usd(i.gcpBaselineQ)} last full quarter × 4 = ${usd(i.gcpBaselineQ * 4)}/yr`, status: "info", note: "Credits apply only to marketplace spend above this. Set at signing of the new or committed contract." });
  rows.push({ label: "Earning window", value: `12 months from signing: months ${g.google.windowStart + 1} to ${g.google.windowEnd + 1}`, status: "info" });
  rows.push({
    label: "Forecast Y1 incremental marketplace spend",
    value: `${usd(g.google.forecastY1)}${i.gcpForecastY1 > 0 ? " (entered)" : " (from the model)"}`,
    status: "info",
    note: "Top-line MaaS spend via marketplace above the baseline; the credit pool is sized on this forecast.",
  });

  const dpm = i.gcpPct > GOOGLE.dpoMaxPct.value;
  rows.push({ label: "Credit rate", value: `${i.gcpPct}% of incremental spend`, status: dpm ? "warn" : "ok", note: dpm ? `Above the ${GOOGLE.dpoMaxPct.value}% DPO authority: needs DPM approval.` : `Within DPO authority (up to ${GOOGLE.dpoMaxPct.value}%).` });
  if (dpm) approvals.push(`DPM (credit rate above ${GOOGLE.dpoMaxPct.value}%)`);

  const sized = (g.google.forecastY1 * i.gcpPct) / 100;
  rows.push({
    label: "Credit pool",
    value: `${usd(g.google.pool)}`,
    status: eligible ? "ok" : "stop",
    note: sized > i.gcpCap + 1e-9 ? `${i.gcpPct}% × ${usd(g.google.forecastY1)} = ${usd(sized)}, capped at ${usd(i.gcpCap)} per strategic account.` : `${i.gcpPct}% × ${usd(g.google.forecastY1)}; below the ${usd(i.gcpCap)} cap.`,
  });
  const milestones: Milestone[] = [1, 2, 3, 4].map((k) => ({ index: k, threshold: (g.google.forecastY1 * k) / 4, tranche: g.google.pool / 4 }));
  rows.push({
    label: "Spend milestones",
    value: milestones.map((m) => `${usd(m.threshold)} → ${usd(m.tranche)}`).join(" · "),
    status: "info",
    note: "Assumption: four equal milestones on cumulative incremental spend, each releasing a quarter of the pool. The offer summary defines milestone-based delivery but not the schedule; the model settles quarterly.",
  });

  const capShare = i.mktCapPct / 100;
  const countedPerLeg = capShare * i.gcpCommitNew;
  const y1Marketplace = f.spend;
  const needsException = !i.mktException && y1Marketplace > countedPerLeg + 1e-9;
  rows.push({
    label: "Marketplace commit cap",
    value: `${i.mktCapPct}% of each ${usd(i.gcpCommitNew)} leg = ${usd(countedPerLeg)}/yr counts towards commit${i.mktException ? " (exception granted: all marketplace spend counts)" : ""}`,
    status: i.mktException ? "warn" : needsException ? "warn" : "ok",
    note: i.mktException
      ? "Exception in use: requires DPM and DPO approval and the exception form."
      : needsException
        ? `Year-one marketplace spend of ${usd(y1Marketplace)} exceeds what counts; ${usd(y1Marketplace - countedPerLeg)} would not retire commit unless an exception is approved by DPM and DPO with the exception form.`
        : "Marketplace spend fits within the cap.",
  });
  if (i.mktException) approvals.push("DPM + DPO (marketplace commit-cap exception, with the exception form)");

  const months = i.gcpAiSpend > 0 ? (g.google.pool / (i.gcpAiSpend / 12)) : Infinity;
  rows.push({
    label: "Credit consumability",
    value: `Cloud AI (Gen AI and Gen AI v2) spend of ${usd(i.gcpAiSpend)}/yr absorbs the pool in ${Number.isFinite(months) ? `${Math.ceil(months)} months` : "never"}`,
    status: !Number.isFinite(months) ? "stop" : months > 24 ? "warn" : "ok",
    note: `Credits are scoped to the GCP Cloud AI portfolio, not Anthropic 3P spend. ${usd(g.totals.gcpUsed)} of ${usd(g.totals.gcpEarned)} earned is used within the ${result.horizon}-month horizon.`,
  });
  if (!Number.isFinite(months)) blockers.push("No eligible Cloud AI spend to consume the credits.");

  const late = sign > GOOGLE.executeByMonthIndex.value;
  rows.push({ label: "Contract execution", value: `Month ${sign} (${sign === 0 ? "Sep 2026" : sign === 1 ? "Oct 2026" : "after Oct 2026"}); deadline ${GOOGLE.executeBy.value}`, status: late ? "stop" : "ok", note: late ? "After the program validity date." : undefined });
  if (late) blockers.push(`Contract execution after ${GOOGLE.executeBy.value}.`);

  approvals.push("Approvals per go/sales-concessions before execution");
  rows.push({ label: "Against AWS MAP", value: `${RANK_LABEL[result.rank]}: ${result.advantage >= 0 ? "Google" : "AWS"} cheaper by ${usd(Math.abs(result.advantage))} (${pct(Math.abs(result.advPct))}) over ${result.horizon} months`, status: result.advantage > 0 ? "ok" : "warn", note: result.driver.sentence });

  return { rows, milestones, approvals, steps: [...GOOGLE.request.value], blockers, forecastY1: g.google.forecastY1, pool: g.google.pool };
}

export function toDealFile(meta: DealMeta, inputs: Inputs, result: Result): DealFile {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    meta,
    inputs,
    snapshot: { horizon: result.horizon, rank: result.rank, advantage: result.advantage, awsNet: result.routes.aws.totals.net, gcpNet: result.routes.gcp.totals.net },
  };
}

export function serializeDeal(file: DealFile): string {
  return JSON.stringify(file, null, 2) + "\n";
}

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

/** Parses a deal file, filling missing inputs with defaults and dropping unknown keys. Throws on malformed input. */
export function parseDeal(text: string): DealFile {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { throw new Error("Not valid JSON."); }
  if (!isRecord(raw) || !isRecord(raw.inputs)) throw new Error("Not a deal file: missing inputs.");
  const base = defaults();
  const inputs: Inputs = { ...base };
  for (const k of Object.keys(base) as (keyof Inputs)[]) {
    const v = raw.inputs[k];
    if (v === undefined) continue;
    const want = typeof base[k];
    if (typeof v !== want) throw new Error(`Input "${k}" should be a ${want}.`);
    if (typeof v === "number" && !Number.isFinite(v)) throw new Error(`Input "${k}" is not a finite number.`);
    (inputs as unknown as Record<string, unknown>)[k] = v;
  }
  if (!["direct", "aws", "gcp"].includes(inputs.platform)) throw new Error("Unknown platform.");
  if (![12, 24, 36].includes(inputs.horizon)) throw new Error("Horizon must be 12, 24 or 36.");
  if (!["none", "extend", "restructure"].includes(inputs.mapAfter)) throw new Error("Unknown MAP after-term option.");
  const m = isRecord(raw.meta) ? raw.meta : {};
  const meta: DealMeta = {
    customer: typeof m.customer === "string" ? m.customer : "",
    onTargetList: m.onTargetList === true,
    owner: typeof m.owner === "string" ? m.owner : "",
    notes: typeof m.notes === "string" ? m.notes : "",
  };
  const result = evaluate(inputs);
  const file = toDealFile(meta, inputs, result);
  if (typeof raw.savedAt === "string") file.savedAt = raw.savedAt;
  return file;
}

export function dealFileName(meta: DealMeta): string {
  const slug = (meta.customer || "deal").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "deal";
  return `${slug}.deal.json`;
}

/* ---------------- Browser storage (best effort) ---------------- */

export const STORAGE_KEY = "dealcheck.deals.v1";

export function loadSavedDeals(): DealFile[] {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.map((x) => { try { return parseDeal(JSON.stringify(x)); } catch { return null; } }).filter((x): x is DealFile => x !== null);
  } catch {
    return [];
  }
}

export const DEALS_EVENT = "dealcheck-deals-changed";

function persist(list: DealFile[]): void {
  try { globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(list)); } catch { /* storage unavailable */ }
  try { globalThis.dispatchEvent?.(new Event(DEALS_EVENT)); } catch { /* no window */ }
}

export function saveDeal(file: DealFile): DealFile[] {
  const key = file.meta.customer.trim().toLowerCase();
  const list = loadSavedDeals().filter((d) => d.meta.customer.trim().toLowerCase() !== key);
  list.unshift(file);
  persist(list);
  return list;
}

export function deleteDeal(customer: string): DealFile[] {
  const key = customer.trim().toLowerCase();
  const list = loadSavedDeals().filter((d) => d.meta.customer.trim().toLowerCase() !== key);
  persist(list);
  return list;
}

/** Snapshot helpers for React's useSyncExternalStore: stable array while storage is unchanged. */
const EMPTY: DealFile[] = [];
let cachedRaw: string | null | undefined;
let cachedList: DealFile[] = EMPTY;
export function savedDealsSnapshot(): DealFile[] {
  let raw: string | null = null;
  try { raw = globalThis.localStorage?.getItem(STORAGE_KEY) ?? null; } catch { raw = null; }
  if (raw !== cachedRaw) { cachedRaw = raw; cachedList = raw ? loadSavedDeals() : EMPTY; }
  return cachedList;
}
export function serverDealsSnapshot(): DealFile[] { return EMPTY; }
export function subscribeSavedDeals(cb: () => void): () => void {
  window.addEventListener("storage", cb);
  window.addEventListener(DEALS_EVENT, cb);
  return () => { window.removeEventListener("storage", cb); window.removeEventListener(DEALS_EVENT, cb); };
}

/* ---------------- Text ---------------- */

export function constructText(c: DealConstruct): string {
  const lines: string[] = ["Deal construct — Google Private Offer"];
  for (const r of c.rows) lines.push(`- ${r.label}: ${r.value}${r.status === "stop" ? " [STOP]" : r.status === "warn" ? " [CHECK]" : ""}${r.note ? ` — ${r.note}` : ""}`);
  if (c.blockers.length) { lines.push("", "Blockers:"); for (const b of c.blockers) lines.push(`- ${b}`); }
  lines.push("", "Approvals required:"); for (const a of c.approvals) lines.push(`- ${a}`);
  lines.push("", "How to request:"); c.steps.forEach((s, k) => lines.push(`${k + 1}. ${s}`));
  return lines.join("\n");
}

/* ---------------- Email to DPM ---------------- */

export interface DpmEmail {
  subject: string;
  body: string;
}

/** The deal as a direct email to Deal Pricing, ready to paste. */
export function dpmEmail(meta: DealMeta, inputs: Inputs, result: Result): DpmEmail {
  const c = dealConstruct(meta, inputs, result);
  const i = inputs, g = result.routes.gcp, a = result.routes.aws;
  const play = geminiPlay(inputs, result.horizon);
  const name = meta.customer || "[customer]";
  const exceptions = c.approvals.filter((x) => x.startsWith("DPM"));
  const lines: string[] = [];
  lines.push(`Hi DPM team,`, ``);
  lines.push(`Requesting review of an Anthropic MaaS offer for ${name}${exceptions.length ? " with the exceptions listed below" : ""}. Expert Request raised in Vector with "Anthropic MaaS offer"${exceptions.length ? ' and "Offer Exception Required"' : ""} in the comments.`, ``);
  lines.push(`Customer and workload`);
  lines.push(`- ${name}${meta.owner ? ` (owner: ${meta.owner})` : ""}; ${meta.onTargetList ? "confirmed on the pre-approved target list" : "target-list status not yet confirmed"}.`);
  lines.push(`- ${usd(i.anthSpend)}/yr Anthropic spend today ${({ direct: "direct with Anthropic", aws: "on AWS Bedrock", gcp: "on GCP marketplace" })[i.platform]}, ${i.growth}%/yr growth; ${i.migPct}% moves to GCP marketplace from month ${i.migStart}.`);
  if (i.geminiShare > 0) lines.push(`- ${i.geminiShare}% of the traffic will be served by Gemini (at ${i.geminiCostRatio}% of the Anthropic cost); the remaining ${100 - i.geminiShare}% stays on Anthropic via marketplace.`);
  lines.push(``, `Proposed construct`);
  lines.push(`- Incremental GCP commit: ${usd(i.gcpCommitNew)}/yr iACV × ${i.gcpCommitYears} years (${usd(i.gcpCommitNew * i.gcpCommitYears)} total).`);
  lines.push(`- Baseline: last full quarter ${usd(i.gcpBaselineQ)} × 4 = ${usd(i.gcpBaselineQ * 4)}/yr, set at signing.`);
  lines.push(`- Forecast Y1 incremental marketplace spend: ${usd(g.google.forecastY1)}.`);
  lines.push(`- Credit rate ${i.gcpPct}% → pool ${usd(g.google.pool)}${g.google.pool < (g.google.forecastY1 * i.gcpPct) / 100 - 1e-9 ? ` (capped at ${usd(i.gcpCap)})` : ""}, delivered as spend milestones scoped to Cloud AI (Gen AI / Gen AI v2).`);
  lines.push(`- Milestones (proposed): ${c.milestones.map((m) => `${usd(m.threshold)} → ${usd(m.tranche)}`).join("; ")}.`);
  lines.push(`- Marketplace commit cap: ${i.mktCapPct}% per leg = ${usd((i.mktCapPct / 100) * i.gcpCommitNew)}/yr counts${i.mktException ? "; exception requested so all marketplace spend counts (form attached)" : ""}.`);
  lines.push(`- Eligible Cloud AI spend to consume credits: ${usd(i.gcpAiSpend)}/yr${i.geminiShare > 0 ? ` plus ${usd(g.totals.geminiSpend)} of Gemini spend within ${result.horizon} months` : ""}.`);
  lines.push(`- Contract execution planned for month ${Math.round(i.gcpSignMonth)} (${Math.round(i.gcpSignMonth) <= 1 ? "before" : "AFTER"} the Oct 31, 2026 deadline).`);
  lines.push(``, `Why it works against AWS MAP`);
  lines.push(`- Over ${result.horizon} months: Google route ${usd(g.totals.net)} net vs AWS MAP ${usd(a.totals.net)} net → ${result.advantage >= 0 ? "Google" : "AWS"} ahead by ${usd(Math.abs(result.advantage))} (${pct(Math.abs(result.advPct))}). ${result.driver.sentence}`);
  if (!play.winsNow && play.minShare !== null) lines.push(`- Serving ${play.minShare.toFixed(0)}% of the traffic with Gemini would put Google ahead while the rest stays on Anthropic with credits.`);
  else if (play.winsNow && i.geminiShare > 0) lines.push(`- The Gemini share lowers the Anthropic bill by ${i.geminiShare}% and the total model bill by ${play.billCut.toFixed(0)}%.`);
  if (exceptions.length) { lines.push(``, `Exceptions requested`); for (const e of exceptions) lines.push(`- ${e}`); }
  if (c.blockers.length) { lines.push(``, `Open items before execution`); for (const b of c.blockers) lines.push(`- ${b}`); }
  lines.push(``, `Approvals per go/sales-concessions will be obtained before execution. Happy to walk through the model.`, ``, `Thanks,`, meta.owner || "");
  return { subject: `Anthropic MaaS offer — ${name} — ${exceptions.length ? "exception review" : "DPO expert request"}`, body: lines.join("\n") };
}
