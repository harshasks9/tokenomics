import type { Inputs } from "./engine";

export interface Preset {
  id: string;
  name: string;
  /** Only the inputs the scenario needs; everything else is the default. */
  set: Partial<Inputs>;
  note: string;
}

export const PRESETS: Preset[] = [
  { id: "net-new", name: "Net-new Anthropic customer", note: "Direct today, no AWS history, no commits either side.",
    set: { platform: "direct", awsBaseline: 0, awsCommitRemaining: 0, awsOtherSpend: 0, gcpBaselineQ: 0, gcpCommitExisting: 0 } },
  { id: "aws-flat", name: "Existing AWS customer, flat spend", note: "Bedrock today; spend equals last year's, so MAP has nothing incremental to pay on.",
    set: { platform: "aws", growth: 0 } },
  { id: "aws-growing", name: "Rapidly growing AWS customer", note: "Bedrock today with steep growth; MAP pays on everything above last year.",
    set: { platform: "aws", growth: 150 } },
  { id: "aws-commit-used", name: "AWS commit fully utilised regardless of migration", note: "Other AWS spend alone covers the remaining AWS commit.",
    set: { platform: "aws", awsCommitRemaining: 12, awsCommitMonths: 12, awsOtherSpend: 20 } },
  { id: "aws-commit-stranded", name: "AWS commit stranded after migration", note: "Large AWS commit that only the Anthropic workload can consume.",
    set: { platform: "aws", growth: 0, awsCommitRemaining: 24, awsCommitMonths: 12, awsOtherSpend: 6 } },
  { id: "aws-renewal", name: "Near AWS commit renewal, migrate at renewal", note: "Three months left on the AWS commit; the move waits for it to end.",
    set: { platform: "aws", awsCommitRemaining: 6, awsCommitMonths: 3, awsOtherSpend: 12, migStart: 3 } },
  { id: "gcp-unused-commit", name: "Unused GCP commit that Anthropic fills", note: "An under-consumed GCP commit that the migrated workload fills; marketplace cap exception granted.",
    set: { platform: "aws", anthSpend: 20, awsBaseline: 20, gcpCommitExisting: 20, gcpCommitExistingMonths: 12, mktException: true } },
  { id: "gcp-small-footprint", name: "New GCP commit with small GCP footprint", note: "Little other GCP consumption to fill the new $10M commit or absorb credits.",
    set: { platform: "aws", gcpAiSpend: 1, gcpOtherSpend: 1 } },
  { id: "direct-to-gcp", name: "Direct Anthropic → GCP", note: "Direct with Anthropic today; either cloud is a migration.",
    set: { platform: "direct", awsBaseline: 0, awsCommitRemaining: 0, awsOtherSpend: 0 } },
  { id: "bedrock-to-gcp", name: "AWS Bedrock → GCP", note: "Bedrock today with a modest AWS commit that other spend covers.",
    set: { platform: "aws" } },
  { id: "partial-40", name: "Partial migration 40%", note: "Only 40% of the workload moves.",
    set: { migPct: 40 } },
  { id: "full", name: "Full migration", note: "Everything moves at once.",
    set: { migPct: 100, migRamp: 0 } },
  { id: "mkt-cap", name: "Marketplace cap constrained", note: "Marketplace spend counts only up to 25% of the commit; little else consumes it.",
    set: { platform: "aws", gcpAiSpend: 2, gcpOtherSpend: 1, mktException: false } },
  { id: "mkt-exception", name: "Marketplace cap exception granted", note: "Same footprint with the DPM + DPO exception so all marketplace spend counts.",
    set: { platform: "aws", gcpAiSpend: 2, gcpOtherSpend: 1, mktException: true } },
  { id: "ample-ai", name: "Ample eligible GCP AI consumption", note: "Plenty of Cloud AI spend to absorb the Google credits.",
    set: { gcpAiSpend: 30 } },
  { id: "no-ai", name: "Cannot consume Google credits", note: "No eligible Cloud AI spend, so Google credits are worthless.",
    set: { gcpAiSpend: 0 } },
  { id: "cap-reached", name: "$5M cap reached", note: "Spend large enough that the $5M cap truncates Google's credits.",
    set: { anthSpend: 60, awsBaseline: 60, gcpAiSpend: 20, gcpOtherSpend: 10, awsOtherSpend: 30 } },
  { id: "aws-baseline-high", name: "AWS baseline high", note: "Prior-year AWS spend above current spend; MAP pays little.",
    set: { platform: "aws", awsBaseline: 30 } },
  { id: "aws-baseline-low", name: "AWS baseline low", note: "Almost no prior-year AWS spend; MAP pays on nearly everything.",
    set: { platform: "aws", awsBaseline: 2 } },
  { id: "migrate-now", name: "Migrate now (vs at renewal)", note: "Six months left on the AWS commit; move immediately and strand part of it.",
    set: { platform: "aws", awsCommitRemaining: 12, awsCommitMonths: 6, awsOtherSpend: 6, migStart: 0 } },
  { id: "migrate-renewal", name: "Migrate at renewal (vs now)", note: "Same commit; wait six months and strand nothing.",
    set: { platform: "aws", awsCommitRemaining: 12, awsCommitMonths: 6, awsOtherSpend: 6, migStart: 6 } },
  { id: "partner-stack", name: "AWS partner stacking", note: "Indirect MAP deal with a 5% partner pass-back on top of 25%.",
    set: { platform: "aws", mapPct: 25, partnerPass: 5 } },
  { id: "map-multiyear", name: "Multi-year MAP with restructure reset", note: "Two-year MAP; afterwards a partner restructure resets the baseline to zero.",
    set: { platform: "aws", mapYears: 2, mapAfter: "restructure", horizon: 36 } },
  { id: "gcp-15", name: "Google offer at 15%", note: "Credit rate above DPO authority; needs DPM.",
    set: { gcpPct: 15 } },
];

export function presetById(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}
