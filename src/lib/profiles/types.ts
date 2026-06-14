export interface ProfileTask {
  title: string;
  tier: "flashLite" | "flash" | "opus";
  why: string;
}

export interface ProfileQA {
  id: string;
  question: string;
  category: "routine" | "standard" | "complex";
  answers: { flashLite: string; flash: string; opus: string };
  scores: { flashLite: number; flash: number; opus: number };
  sellerNote?: string;
}

export interface ProfileAgentStep {
  id: number;
  label: string;
  role: "planner" | "executor" | "reviewer";
  inTok: number;
  outTok: number;
}

export interface CustomerProfile {
  id: string;
  name: string;
  country: string;
  industry: string;
  color: string;
  gradient: string;
  heroGradient: string;
  tagline: string;
  savingsHeadline: string;
  description: string;
  kpis: Array<{ label: string; value: string }>;
  build: {
    title: string;
    description: string;
    defaultDevs: number;
    defaultSprints: number;
    mix: { flashLitePct: number; flashPct: number; opusPct: number };
    tasks: ProfileTask[];
  };
  run: {
    title: string;
    description: string;
    defaultQueriesPerMonth: number;
    maxQueriesPerMonth: number;
    queriesStepSize: number;
    queriesLabel: string;
    querySize: { inTok: number; outTok: number };
    mix: { flashLitePct: number; flashPct: number; opusPct: number };
    qa: ProfileQA[];
  };
  agent: {
    title: string;
    description: string;
    defaultVolume: number;
    maxVolume: number;
    volumeStep: number;
    volumeLabel: string;
    runsPerDay: number;
    executorSteps: number;
    steps: ProfileAgentStep[];
  };
}
