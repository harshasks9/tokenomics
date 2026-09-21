import { CASE_IDS, CASE_LABEL, SCENARIO_IDS, SCENARIO_LABEL, compareScenarios, type Result } from "./engine";
import { COMMITMENT } from "./terms";

function cell(v: string | number | boolean | null): string {
  if (v === null) return "";
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(6);
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Monthly table plus summary and scenario comparison, exact values (no display rounding). */
export function toCsv(result: Result): string {
  const lines: string[] = [];
  lines.push(["MDES / Human Intelligence — Gemini Enterprise commitment planner"].map(cell).join(","));
  lines.push(["Commitment (USD)", COMMITMENT].map(cell).join(","));
  lines.push(["Window (months)", result.window].map(cell).join(","));
  lines.push(["Price per user per month (term)", result.inputs.pupm].map(cell).join(","));
  lines.push(["Price per user per month (extension)", result.inputs.timeline.extPupm ?? result.inputs.pupm].map(cell).join(","));
  lines.push(["GCP allocation enabled", result.inputs.gcp.enabled].map(cell).join(","));
  lines.push("");
  lines.push([
    "Month", "Calendar", "Extension", "Contracted units", "Contracted fees (USD)", "Cumulative contracted fees (USD)",
    "Adoption (users)", "Billed users", "Price", "GE spend (USD)", "Eligible GCP spend (USD)", "GCP counted (USD)",
    "Consumption (USD)", "Cumulative GE (USD)", "Cumulative GCP (USD)", "Cumulative consumption (USD)",
    "Commitment remaining (USD)", "Spend above commitment (USD)", "Ordered but unadopted (users)",
  ].map(cell).join(","));
  for (const r of result.months) {
    lines.push([
      r.m, r.label.split(" · ")[1], r.isExtension, r.contracted, r.contractedFees, r.cumContractedFees,
      r.adoption, r.billed, r.pupm, r.geSpend, r.gcpEligible, r.gcpCounted,
      r.consumption, r.cumGe, r.cumGcp, r.cumConsumption, r.remaining, r.above, r.unusedContracted,
    ].map(cell).join(","));
  }
  lines.push("");
  lines.push(["Summary", "Value"].map(cell).join(","));
  lines.push(["GE spend (window, USD)", result.total.geSpend].map(cell).join(","));
  lines.push(["Eligible GCP spend (window, USD)", result.total.gcpEligible].map(cell).join(","));
  lines.push(["GCP counted (window, USD)", result.total.gcpCounted].map(cell).join(","));
  lines.push(["Total consumption (window, USD)", result.total.consumption].map(cell).join(","));
  lines.push(["Utilization", result.total.utilization].map(cell).join(","));
  lines.push(["Unconsumed commitment (window, USD)", result.total.unconsumed].map(cell).join(","));
  lines.push(["Spend above commitment (window, USD)", result.total.above].map(cell).join(","));
  lines.push(["Consumption at Month 12 (USD)", result.term.consumption].map(cell).join(","));
  lines.push(["Commitment remaining at Month 12 (USD)", result.term.unconsumed].map(cell).join(","));
  lines.push(["Completion month", result.completionMonth].map(cell).join(","));
  lines.push(["Additional months beyond 12", result.extraMonths].map(cell).join(","));
  lines.push(["Month-12 billed users", result.m12.billed].map(cell).join(","));
  lines.push(["Month-12 requirement met (650,000)", result.m12.met].map(cell).join(","));
  lines.push(["Billed user-months (term)", result.userMonths12].map(cell).join(","));
  lines.push(["Average billed users (term)", result.avgBilled12].map(cell).join(","));
  for (const a of result.approvals) lines.push(["Approval dependency", a].map(cell).join(","));
  for (const w of result.warnings) lines.push(["Warning", w].map(cell).join(","));
  for (const e of result.errors) lines.push(["Error", e].map(cell).join(","));

  const cmp = compareScenarios(result.inputs);
  lines.push("");
  lines.push(["Scenario comparison", "Case", "Window", "Month-12 billed users", "Month-12 adoption", "Month-12 met", "GE spend (USD)", "Eligible GCP (USD)", "GCP counted (USD)", "Total consumption (USD)", "Utilization", "Unconsumed (USD)", "Above (USD)", "Completion month", "Approvals"].map(cell).join(","));
  for (const c of CASE_IDS) {
    for (const s of SCENARIO_IDS) {
      const x = cmp[c][s];
      lines.push([SCENARIO_LABEL[s], CASE_LABEL[c], x.window, x.m12Billed, x.m12Adoption, x.m12Met, x.geSpend, x.gcpEligible, x.gcpCounted, x.consumption, x.utilization, x.unconsumed, x.above, x.completionMonth, x.approvals.join(" | ")].map(cell).join(","));
    }
  }
  return lines.join("\n") + "\n";
}
