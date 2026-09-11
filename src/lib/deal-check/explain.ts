/**
 * Plain-language explanation of a result: why each program pays what it
 * pays, what else moves the net cost, and which levers change the answer.
 * Pure text, built from the engine's own figures.
 */

import { GOOGLE } from "./terms";
import { creditFunnel, reverseSolve, type Result } from "./engine";
import { usd, pct } from "./format";
import { changeSentence } from "./summary";

export interface Explanation {
  opening: string;
  aws: string;
  google: string;
  commits: string;
  verdict: string;
  levers: string[];
}

const PLATFORM = { direct: "direct with Anthropic", aws: "on AWS Bedrock", gcp: "on GCP marketplace" } as const;

export function explain(result: Result): Explanation {
  const { inputs: i, horizon: H, routes } = result;
  const f = creditFunnel(result);
  const a = routes.aws, g = routes.gcp;

  const opening = `Both programs pay credits only on spend above a baseline, and the two baselines are set very differently. That difference, plus what each credit can be spent on, is most of the story.`;

  // AWS
  let aws: string;
  const held = a.map.heldForever;
  if (f.aws.spend <= 1e-9) {
    aws = `AWS MAP has nothing to measure: no Anthropic spend lands on Bedrock within ${H} months on that route.`;
  } else if (f.aws.incremental <= 1e-9) {
    aws = `AWS MAP compares Anthropic spend on Bedrock with last year's AWS AI spend of ${usd(i.awsBaseline)}. Over ${H} months the tagged spend of ${usd(f.aws.spend)} never rises above that baseline, so MAP pays nothing: the program only rewards growth, not the workload you already had.`;
  } else {
    aws = `AWS MAP compares Anthropic spend on Bedrock with last year's AWS AI spend of ${usd(i.awsBaseline)}. Over ${H} months, ${usd(f.aws.spend)} of tagged spend sits ${usd(f.aws.incremental)} above that baseline, and MAP returns ${f.aws.rate}% of the excess: ${usd(f.aws.gross)}.`;
    if (held > 0.005) aws += ` ${usd(held)} of it never releases because tagged spend does not reach the 10% of committed ARR gate.`;
    else if (a.map.gateMonth !== null && a.map.gateMonth > a.map.programStart + 2) aws += ` The credits are held until month ${a.map.gateMonth + 1}, when tagged spend passes the 10% of committed ARR gate.`;
    if (i.mapYears > 1 || i.mapAfter !== "none") aws += ` After year one only spend above the previous year counts${i.mapAfter === "restructure" ? ", unless a partner restructure resets the baseline to zero" : ""}.`;
    aws += ` The credits can be applied to any AWS bill (Bedrock plus ${usd(i.awsOtherSpend)}/yr of other AWS spend), so ${usd(f.aws.usable)} is used within the horizon${f.aws.usable < f.aws.earned - 0.005 ? ` and ${usd(f.aws.earned - f.aws.usable)} is still waiting to be consumed` : ""}.`;
  }

  // Google
  let google: string;
  if (!g.google.eligible) {
    google = `The Google offer needs a new GCP commitment of at least ${usd(GOOGLE.minIacv.value)}/yr; at ${usd(i.gcpCommitNew)}/yr the account is not eligible, so it pays nothing.`;
  } else if (f.gcp.spend <= 1e-9) {
    google = `The Google offer has nothing to measure: no Anthropic spend reaches GCP marketplace inside its 12-month window (months ${g.google.windowStart + 1} to ${g.google.windowEnd + 1}).`;
  } else {
    const base = i.gcpBaselineQ > 0 ? `your last full quarter on GCP marketplace (${usd(i.gcpBaselineQ)}, so ${usd(i.gcpBaselineQ * 4)}/yr)` : `your last full quarter on GCP marketplace, which is zero`;
    google = `The Google offer compares each quarter of marketplace spend with ${base}, for the 12 months after signing. ${i.gcpBaselineQ > 0 ? `${usd(f.gcp.incremental)} of ${usd(f.gcp.spend)} counts as incremental` : `Because the workload is new to GCP, all ${usd(f.gcp.spend)} counts as incremental`}, and Google returns ${f.gcp.rate}%: ${usd(f.gcp.gross)}.`;
    google += ` The pool is sized at signing on the forecast year-one incremental spend (${usd(g.google.forecastY1)}) and paid out as spend milestones.`;
    if (g.google.capBinding) google += ` The ${usd(i.gcpCap)} cap per account trims that to ${usd(f.gcp.earned)}.`;
    else if (g.google.forecastBinding) google += ` Actual spend runs ahead of the forecast, so the pool of ${usd(g.google.pool)} is the limit.`;
    google += ` The catch is where the credits can go: only against eligible GCP Cloud AI consumption, never against the Anthropic spend itself. With ${usd(i.gcpAiSpend)}/yr of eligible spend, ${usd(f.gcp.usable)} is used within the horizon${f.gcp.usable < f.gcp.earned - 0.005 ? ` and ${usd(f.gcp.earned - f.gcp.usable)} cannot be consumed in time` : ""}.`;
    if (g.migrates && i.migStart + Math.max(0, i.migRamp - 1) >= g.google.windowStart + 3) google += ` Part of the earning window passes before the workload is fully on GCP, which is why the window and the migration timing matter.`;
  }

  if (i.geminiShare > 0 && g.totals.geminiSpend > 0) {
    const saved = result.routes.aws.totals.gross - g.totals.gross;
    google += ` ${i.geminiShare}% of the traffic is served by Gemini at ${i.geminiCostRatio}% of the Anthropic cost, which takes ${usd(Math.abs(saved))} ${saved >= 0 ? "off" : "onto"} the model bill compared with AWS; Gemini spend is Cloud AI consumption, so the credits can be applied to it.`;
  }

  // Commits and migration
  const parts: string[] = [];
  const awsStrandGap = g.awsCommit.stranded - a.awsCommit.stranded;
  if (awsStrandGap > 0.005) parts.push(`moving to Google leaves ${usd(awsStrandGap)} more of the existing AWS commit unconsumed, and that stranded amount is charged in month ${(g.awsCommit.strandMonth ?? 0) + 1}`);
  const gcpLegStrand = g.gcpLegs.reduce((s, l) => s + (l.strandMonth !== null && l.strandMonth < H ? l.stranded : 0), 0);
  if (gcpLegStrand > 0.005) parts.push(`the new ${usd(i.gcpCommitNew)}/yr GCP commit is not fully consumed and strands ${usd(gcpLegStrand)} within the horizon${!i.mktException ? `, partly because marketplace spend only counts up to ${i.mktCapPct}% of the commit` : ""}`);
  const existingGap = a.gcpExisting.stranded - g.gcpExisting.stranded;
  if (existingGap > 0.005) parts.push(`the Anthropic workload fills ${usd(existingGap)} of an existing GCP commit that would otherwise strand`);
  if (g.totals.mig > 0.005 && a.totals.mig <= 0.005) parts.push(`the Google route carries a one-off migration cost of ${usd(g.totals.mig)}`);
  else if (a.totals.mig > 0.005 && g.totals.mig <= 0.005) parts.push(`the AWS route carries a one-off migration cost of ${usd(a.totals.mig)}`);
  const commits = parts.length ? `Credits are only part of the bill. On top of them, ${parts.join("; ")}.` : `Neither route strands commit or pays migration cost within the horizon, so the comparison comes down to credits alone.`;

  // Verdict
  const winner = result.advantage >= 0 ? "Google" : "AWS";
  const verdict = `Put together: the AWS route costs ${usd(a.totals.net)} net and the Google route ${usd(g.totals.net)} over ${H} months, so ${winner} is cheaper by ${usd(Math.abs(result.advantage))} (${pct(Math.abs(result.advPct))}). ${result.driver.sentence}${result.doNothingBest ? ` Staying ${PLATFORM[i.platform]} with no program is cheaper than both.` : ""}`;

  // Levers
  const rs = reverseSolve(i, H);
  const levers: string[] = [];
  levers.push(`Growth favours AWS: MAP pays ${f.aws.rate}% on every dollar above last year, while Google pays ${f.gcp.rate}% and stops at ${usd(i.gcpCap)}.`);
  levers.push(`A higher AWS baseline favours Google: prior-year AWS spend is subtracted before MAP pays anything, so flat or slowing spend earns MAP nothing.`);
  levers.push(`Eligible GCP Cloud AI spend is Google's bottleneck: credits above what that spend can absorb within the horizon are worth nothing.`);
  levers.push(`Remaining AWS commit is the largest swing against moving: whatever the migrated workload would have consumed is charged as stranded.`);
  const row = rs.smallest;
  if (row) levers.push(`Smallest single change that flips the verdict: ${changeSentence(row, rs.gcpAhead)}`);
  else levers.push(rs.gcpAhead ? "No single input in the tested ranges flips the verdict to AWS." : "No single input in the tested ranges flips the verdict to Google.");
  return { opening, aws, google, commits, verdict, levers };
}

export function explanationText(result: Result): string {
  const e = explain(result);
  return [e.opening, e.aws, e.google, e.commits, e.verdict, "", "What moves the answer:", ...e.levers.map((l) => `- ${l}`)].join("\n");
}
