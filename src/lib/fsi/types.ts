/**
 * FSI Knowledge Hub — content graph types.
 *
 * The HUB object (hub.ts + cases.ts) is the deliverable's shelf life: a
 * specialist updates a case, corrects a figure or adds a source here without
 * touching any UI code. Every entity carries evidence grading and source IDs.
 */

/** Claim-level epistemic label, preserved from the canonical file's markup. */
export type ClaimLabel = "verified" | "analysis" | "company";

/** Case-level evidence grade (deep-research badge taxonomy). */
export type EvidenceGrade =
  | "verified-production"
  | "production-undisclosed"
  | "limited-production"
  | "pilot"
  | "announced"
  | "unverified";

/** Four-stage maturity model with the recommended production labels. */
export type Stage = "assistive" | "bounded-agent" | "multi-agent" | "autonomous";

export type Segment =
  | "retail"
  | "commercial"
  | "ib-research"
  | "wealth-asset"
  | "payments-fintech"
  | "insurance"
  | "market-infra";

export type Claim = {
  text: string;
  label: ClaimLabel;
  sourceIds: string[];
};

export type CaseRecord = {
  id: string;
  name: string;
  geo: string;
  segment: Segment;
  /** Vendor IDs (cloud + model). Drives filters and the guardrail check. */
  vendorIds: string[];
  workflowIds: string[];
  stage: Stage;
  grade: EvidenceGrade;
  problem: string;
  capability: string;
  models?: string;
  architecture?: string;
  dataPlatform?: string;
  governance?: string;
  outcomes: Claim[];
  lessons?: string;
  whySucceeded?: string;
  whyCompetitorsStruggle?: string;
  googlePosition: Claim;
  /** "Conflicting account" note where the three files genuinely disagree. */
  conflict?: string;
  /** True = attribution guardrail: never present as a Google Cloud win. */
  guardrail?: boolean;
  sourceIds: string[];
  lastReviewed: string;
};

export type WorkflowScores = {
  value: number;
  readiness: number;
  complexity: number;
  exec: number;
  roi: number;
};

export type Workflow = {
  id: string;
  name: string;
  /** null = present in the canonical ranking but not scored by the model. */
  scores: WorkflowScores | null;
  /** Composite printed in the source report (differs ≤0.1 on three rows). */
  printedComposite?: number;
  rationale: string;
  current: string;
  future: string;
  decisionRights: string;
  /** Labelled as a planning hypothesis, never a promised outcome. */
  planningGain?: string;
  dataControls: string;
  gcpArch: string;
  competitive: string;
  canonicalProof?: string;
  productIds: string[];
  caseIds: string[];
  sourceIds: string[];
  lastReviewed: string;
};

export type VendorCat =
  | "hyperscaler"
  | "model-lab"
  | "data-platform"
  | "enterprise-platform"
  | "silicon"
  | "fsi-isv"
  | "integrator";

export type Vendor = {
  id: string;
  name: string;
  cat: VendorCat;
  wins: string;
  loses: string;
  guidance: string;
  caseIds: string[];
  sourceIds: string[];
  lastReviewed: string;
};

export type EdgeType = "partners" | "competes" | "hosts-model";

export type VendorEdge = { from: string; to: string; type: EdgeType; note?: string };

export type Product = {
  id: string;
  name: string;
  layerId: string;
  blurb: string;
};

export type ArchLayer = {
  id: string;
  name: string;
  story: string;
  fsiRelevance: string;
  proof: string;
  productIds: string[];
  sourceIds: string[];
};

/** Per-workflow reshaping of the architecture diagram. */
export type ArchPath = {
  workflowId: string;
  label: string;
  productIds: string[];
  flow: string;
};

export type Regulation = {
  id: string;
  name: string;
  region: string;
  detail: string;
  dates: { date: string; label: string }[];
  archImplication: string;
  sourceIds: string[];
};

export type Source = {
  id: string;
  name: string;
  kind: "primary" | "press" | "vendor" | "research-file" | "not-captured";
  note?: string;
};

export type ProofPoint = {
  id: string;
  message: string;
  leadCaseIds: string[];
  competitorCaseIds: string[];
};

export type Hub = {
  cases: CaseRecord[];
  workflows: Workflow[];
  vendors: Vendor[];
  vendorEdges: VendorEdge[];
  products: Product[];
  architectureLayers: ArchLayer[];
  archPaths: ArchPath[];
  regulations: Regulation[];
  sources: Source[];
  proofPoints: ProofPoint[];
};
