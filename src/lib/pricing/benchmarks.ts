import type { BenchmarkDef } from "./types";

/**
 * Benchmark definitions (Deliverable: capability comparison). Only benchmarks
 * with cross-model comparable scores are included; scores live on each model
 * in catalog.ts with `selfReported` flags. Snapshot dates are the leaderboard
 * dates the scores were read from, not today.
 */
export const BENCHMARKS: BenchmarkDef[] = [
  {
    id: "aa-index",
    name: "Artificial Analysis Intelligence Index v4.3",
    short: "AA Index",
    unit: "index",
    higherBetter: true,
    measures: "Composite of 10 evals (agentic, coding, science, long-context, knowledge); independent, run at max effort.",
    source: { label: "artificialanalysis.ai (v4.3 methodology, Sep 7 2026)", url: "https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-3" },
    snapshot: "2026-10-02",
    caveat: "Only v4.3 values are comparable: AA recalibrated v4.1 → v4.2 → v4.3 in early September 2026 and the same model moved 8–13 points with no change — pre-v4.3 values are excluded.",
  },
  {
    id: "lmarena",
    name: "LMArena text Elo",
    short: "Arena Elo",
    unit: "Elo",
    higherBetter: true,
    measures: "Crowd pairwise preference on open-ended prompts; style and verbosity influence the score.",
    source: { label: "lmarena.ai (tracker snapshots, Jul–Oct 2026)", url: "https://lmarena.ai/leaderboard" },
    snapshot: "2026-10-02",
    caveat: "Per-score snapshot dates vary (see notes); tracker snapshots disagree by 10–20 Elo, and a disguised preview checkpoint (Gemini 4 Argon) tops the Oct board.",
  },
  {
    id: "gpqa",
    name: "GPQA Diamond",
    short: "GPQA",
    unit: "%",
    higherBetter: true,
    measures: "Graduate-level science questions; near saturation at the frontier.",
    source: { label: "Vendor model cards / independent trackers", url: "https://benchlm.ai/benchmarks/aagpqadiamond" },
    snapshot: "2026-10-06",
    caveat: "Mix of vendor-reported and independent runs (flagged per score); effort settings differ.",
  },
  {
    id: "swe-verified",
    name: "SWE-bench Verified",
    short: "SWE-bench",
    unit: "% resolved",
    higherBetter: true,
    measures: "Real GitHub issues resolved end-to-end by an agent.",
    source: { label: "Vendor reports / leaderboard", url: "https://www.swebench.com/" },
    snapshot: "2026-10-06",
    caveat: "Vendor scores use proprietary scaffolds and are not strictly comparable; best open-harness runs trail vendor claims by several points. Several vendors now report SWE-bench Pro instead.",
  },
  {
    id: "aime",
    name: "AIME 2026",
    short: "AIME",
    unit: "%",
    higherBetter: true,
    measures: "Competition math; near ceiling for frontier reasoning models.",
    source: { label: "Vals AI AIME leaderboard", url: "https://www.vals.ai/benchmarks/aime" },
    snapshot: "2026-10-06",
    caveat: "Independent leaderboard; newest releases not yet listed.",
  },
  {
    id: "mmlu-pro",
    name: "MMLU-Pro",
    short: "MMLU-Pro",
    unit: "%",
    higherBetter: true,
    measures: "Broad knowledge and reasoning across 14 subjects (harder MMLU variant).",
    source: { label: "benchlm / Artificial Analysis harmonized set", url: "https://benchlm.ai/benchmarks/aammlupro" },
    snapshot: "2026-08-20",
    caveat: "Harmonized independent set; a few entries vendor-reported (flagged).",
  },
];

export const benchById = (id: string) => BENCHMARKS.find((b) => b.id === id);
