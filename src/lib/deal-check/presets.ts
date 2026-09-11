import type { Inputs } from "./engine";

export interface Preset {
  id: string;
  name: string;
  /** Only the inputs the scenario needs; everything else is the default. */
  set: Partial<Inputs>;
  note: string;
}

/** The seven situations that come up most often. */
export const PRESETS: Preset[] = [
  { id: "net-new", name: "Net-new Anthropic customer", note: "Direct with Anthropic today, no AWS history, no commits either side. MAP's zero baseline is at its strongest here.",
    set: { platform: "direct", awsBaseline: 0, awsCommitRemaining: 0, awsOtherSpend: 0, gcpBaselineQ: 0, gcpCommitExisting: 0 } },
  { id: "aws-growing", name: "Growing AWS Bedrock customer", note: "On Bedrock today with 60% growth; MAP pays on the growth, Google on everything that moves.",
    set: { platform: "aws" } },
  { id: "aws-flat", name: "Existing AWS customer, flat spend", note: "Spend equals last year's, so MAP has nothing incremental to pay on.",
    set: { platform: "aws", growth: 0 } },
  { id: "aws-commit-stranded", name: "AWS commit stranded after migration", note: "A large AWS commit that only the Anthropic workload can consume; moving strands it.",
    set: { platform: "aws", growth: 0, awsCommitRemaining: 24, awsCommitMonths: 12, awsOtherSpend: 6 } },
  { id: "aws-renewal", name: "Migrate at AWS commit renewal", note: "Six months left on the AWS commit; the move and the Google signing wait for it to end.",
    set: { platform: "aws", awsCommitRemaining: 12, awsCommitMonths: 6, awsOtherSpend: 6, migStart: 6, gcpSignMonth: 6 } },
  { id: "gcp-unused-commit", name: "Unused GCP commit that Anthropic fills", note: "An under-consumed GCP commit that the migrated workload fills; marketplace cap exception granted.",
    set: { platform: "aws", anthSpend: 20, awsBaseline: 20, gcpCommitExisting: 20, gcpCommitExistingMonths: 12, mktException: true } },
  { id: "gemini-play", name: "Gemini offload play", note: "Serve 40% of the traffic with Gemini at 40% of the cost; the rest stays on Anthropic via marketplace with credits.",
    set: { platform: "aws", geminiShare: 40, geminiCostRatio: 40 } },
];

export function presetById(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}
