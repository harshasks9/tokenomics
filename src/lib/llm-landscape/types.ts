export type EvidenceGrade =
  | "vendor-claim"
  | "measured-benchmark"
  | "independent-eval"
  | "practitioner-consensus"
  | "analyst-inference";

export type Claim = {
  claim: string;
  evidence_grade: EvidenceGrade;
  source_url: string | null;
};

export type Alternative = {
  workload: string;
  model_id: string | null;
  model_label: string;
  rationale: string;
  confidence: "high" | "medium" | "low";
  trade_offs: string;
};

export type GuideModel = {
  model_id: string | null;
  label: string;
  access_note: string;
  choose_when: string;
  avoid_when: string;
  trade_offs: string;
};

export type WorkloadGuide = {
  workload: string;
  market_direction: string;
  representative_models: GuideModel[];
  decision_factors: string[];
};

export type VendorProfile = { vendor: string; synthesis: string };

export type MaturityEntry = { category: string; stage: string; justification: string };

export type Disputed = {
  question: string;
  position_a: string;
  position_b: string;
  assessment: string;
};

export type Source = { url: string; type: string; accessed: string };

export type Model = {
  id: string;
  name: string;
  vendor: string;
  family: string;
  predecessor_id: string | null;
  tier: 1 | 2 | 3;
  released: string | null;
  released_precision?: string | null;
  status?: string | null;
  access?: string | null;
  license?: string | null;
  size?: { params_b: number | null; class: string; note: string } | null;
  context?: {
    input_tokens: number | null;
    output_tokens: number | null;
    source_url: string;
  } | null;
  modalities_in?: string[] | null;
  modalities_out?: string[] | null;
  known_for?: Claim[] | null;
  best_use_cases?: Claim[] | null;
  weaknesses?: Claim[] | null;
  why_it_mattered?: string | null;
  market_reputation?: string | null;
  reputation_shift?: string | null;
  disputed?: Disputed[] | null;
  alternatives?: Alternative[] | null;
  sources?: Source[] | null;
  last_verified?: string | null;
  note?: string | null;
};

export type Workload = { id: string; label: string; definition: string };

export type Dimension = {
  id: string;
  label: string;
  conditional: boolean;
  keywords: string[];
};

export type Meta = {
  title: string;
  snapshot_date: string;
  schema_version: string;
  purpose: string;
  disclaimer: string;
  evidence_grades: Record<string, string>;
  source_types: string[];
  tier_definitions: Record<string, string>;
  workloads: Workload[];
  confidence_levels: Record<string, string>;
  dimensions?: Dimension[];
  dimensions_note?: string;
  workload_guides?: WorkloadGuide[];
  vendor_profiles?: VendorProfile[];
  maturity?: MaturityEntry[];
};

export type Dataset = { meta: Meta; models: Model[] };
