import { RANK_LABEL, ROUTE_LABEL, reverseSolve, type Result, type SolveRow } from "./engine";
import { INPUT_META } from "./terms";
import { pct, usd } from "./format";

const PLATFORM_LABEL = { direct: "direct with Anthropic", aws: "AWS Bedrock", gcp: "GCP marketplace" } as const;

export function changeSentence(row: SolveRow, gcpAhead: boolean): string {
  const loser = gcpAhead ? "AWS" : "Google";
  if (row.mode === "boolean") return gcpAhead ? "AWS wins if the marketplace cap exception is withdrawn." : "Google wins only with the marketplace cap exception (DPM + DPO approval).";
  if (row.mode === "optimal") return `Google wins if migration starts in month ${row.value} instead of month ${row.current}.`;
  const v = row.value as number;
  const cur = row.current as number;
  const unit = row.unit.startsWith("$") ? (x: number) => `$${x.toFixed(Math.abs(x) >= 10 ? 1 : 2)}M${row.unit.slice(2)}` : (x: number) => `${x.toFixed(row.unit === "month" ? 0 : Math.abs(x) >= 10 ? 0 : 1)}${row.unit ? " " + row.unit : ""}`;
  const dir = v > cur ? "rises to" : "falls to";
  const label = row.label.replace(/^(AWS|GCP|Google|Anthropic|Eligible GCP AI|Migration|Growth)/, (m) => (m === "AWS" || m === "GCP" || m === "Google" || m === "Anthropic" || m === "Eligible GCP AI" ? m : m.toLowerCase()));
  return `${loser} wins if ${label} ${dir} ${unit(v)} (now ${unit(cur)})${row.dpm ? " — needs DPM" : ""}.`;
}

export function smallestChangeSentence(result: Result): string {
  const rs = reverseSolve(result.inputs, result.horizon);
  if (!rs.smallest) return rs.gcpAhead ? "No single input in the tested ranges flips the verdict to AWS." : "No single input in the tested ranges flips the verdict to Google.";
  return changeSentence(rs.smallest, rs.gcpAhead);
}

export function accountSummary(result: Result): string {
  const { inputs: i, horizon: H, routes } = result;
  const a = routes.aws.totals, g = routes.gcp.totals, n = routes.nothing.totals;
  const lines: string[] = [];
  lines.push(`Anthropic workload deal check — ${H}-month horizon`);
  lines.push("");
  lines.push(`Today: ${usd(i.anthSpend)}/yr Anthropic spend ${PLATFORM_LABEL[i.platform]}, ${i.growth}%/yr growth, ${i.migPct}% of the workload moving from month ${i.migStart}.`);
  lines.push("");
  lines.push(`AWS MAP 2.0 (field-reported terms): usable credits ${usd(a.creditsUsed)} (${pct(a.effectiveIncentive)} of spend), net cost ${usd(a.net)}, soft commit ${usd(a.incrementalCommit)}.`);
  lines.push(`Google Private Offer: usable credits ${usd(g.creditsUsed)} (${pct(g.effectiveIncentive)} of spend), net cost ${usd(g.net)}, hard commit ${usd(g.incrementalCommit)}.`);
  lines.push(`Do nothing: net cost ${usd(n.net)}.`);
  lines.push("");
  lines.push(`Verdict: ${RANK_LABEL[result.rank]} — ${result.advantage >= 0 ? "Google" : "AWS"} cheaper by ${usd(Math.abs(result.advantage))} (${pct(Math.abs(result.advPct))}).`);
  if (result.doNothingBest) lines.push("Note: staying put beats both programs at this horizon.");
  lines.push(`Break-even: ${result.breakEven === null ? "Google does not overtake AWS within the horizon" : `Google cheaper on a cumulative basis from month ${result.breakEven}`}.`);
  lines.push(`Driver: ${result.driver.sentence}`);
  lines.push(`To flip: ${smallestChangeSentence(result)}`);
  lines.push("");
  lines.push("Flags:");
  for (const f of result.flags) lines.push(`- ${f.text}`);
  lines.push("");
  lines.push("Inputs:");
  for (const [k, meta] of Object.entries(INPUT_META)) {
    const v = i[k as keyof typeof i];
    if (v === undefined) continue;
    const shown = typeof v === "boolean" ? (v ? "yes" : "no") : `${v}${"unit" in meta && meta.unit ? " " + meta.unit : ""}`;
    lines.push(`- ${meta.label}: ${shown} [${meta.source}]`);
  }
  lines.push("");
  lines.push(`Routes compared: ${Object.values(ROUTE_LABEL).join(" / ")}. AWS terms are field-reported from one region and unverified.`);
  return lines.join("\n");
}
