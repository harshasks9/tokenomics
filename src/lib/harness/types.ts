/**
 * HARNESS CHOICE — content model.
 *
 * Every fact on the site renders from typed content in this directory so the
 * research snapshot can be refreshed without touching components. Claims that
 * come from a primary source carry a SourceRef; analyst interpretation is
 * labeled as such in the content itself (fact → interpretation → implication).
 */

/** Audience lens for progressive depth (PRD §17). */
export type Lens = "exec" | "architect" | "developer";

export type SourceRef = {
  /** Short label shown in the UI, e.g. "Microsoft Agent Framework docs". */
  label: string;
  url: string;
  /** Publication or last-verified date, ISO yyyy-mm. */
  date: string;
};

/** One of the capability layers of a production-grade harness (PRD §6). */
export type Capability = {
  id: string;
  name: string;
  /** Lucide icon name resolved in the component layer. */
  icon: string;
  /** The question this layer answers, e.g. "What does the model need to know?" */
  question: string;
  /** One-line essence for the grid tile. */
  essence: string;
  /** Progressive depth copy. */
  depth: Record<Lens, string>;
  /** Concrete mechanisms/examples at this layer. */
  mechanisms: string[];
  /** Failure mode when this layer is missing or weak. */
  withoutIt: string;
  hue: number; // HSL hue for the layer's accent
};

/** Workload profile for the interactive selector (PRD §10). */
export type Workload = {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  /** What makes this workload distinctive. */
  traits: string[];
  /** capabilityId → weight 1..5 (how much this layer matters here). */
  weights: Record<string, number>;
  /** Why the top-weighted capabilities dominate, in one short paragraph. */
  rationale: string;
  /** Example harnesses/platforms commonly used for this workload today. */
  exemplars: string[];
};

/** A vendor/ecosystem architectural philosophy (PRD §11). */
export type VendorStack = {
  id: string;
  name: string;
  /** e.g. "Vertically integrated platform", "Protocol-first toolkit". */
  philosophy: string;
  hue: number;
  /** What occupies each layer in this vendor's world. */
  layers: {
    models: string;
    harness: string;
    runtime: string;
    protocols: string;
  };
  /** Verified facts, with sources. */
  facts: { text: string; source?: SourceRef }[];
  /** Analyst interpretation — clearly labeled in UI. */
  interpretation: string;
  /** What it implies for an enterprise buyer. */
  implication: string;
  /** Who owns what: capabilityId → "platform" | "developer" | "shared". */
  ownership: Record<string, "platform" | "developer" | "shared">;
  portability: { models: string; harness: string; tools: string };
};

/** Build vs Buy approaches (PRD §9). */
export type Approach = {
  id: string;
  name: string;
  subtitle: string;
  bestWhen: string[];
  tradeoffs: { control: number; speed: number; portability: number; opsBurden: number; reliability: number };
  watchOut: string;
  examples: string[];
};

/** Decision-framework dimension (PRD §8). */
export type Dimension = {
  id: string;
  name: string;
  question: string;
  probes: string[]; // what to actually test/ask
};

/** Google capability mapping row (PRD §12). */
export type GoogleRow = {
  capabilityId: string;
  requirement: string;
  approach: string;
  services: { name: string; note: string }[];
  openness: string; // where third-party/custom fits
};

/** Reference architecture (PRD §16). */
export type RefArchitecture = {
  id: string;
  name: string;
  scenario: string;
  /** Ordered flow of nodes; kind drives the node's visual. */
  nodes: { id: string; label: string; kind: "actor" | "app" | "harness" | "model" | "tool" | "data" | "human" }[];
  /** Edges between node ids, optional label. */
  edges: { from: string; to: string; label?: string }[];
  /** Which harness capabilities carry the weight, and how. */
  spotlight: { capabilityId: string; how: string }[];
  whyItMatters: string;
};

/** Evidence exhibit for "why harness choice matters" (PRD §7). */
export type Exhibit = {
  id: string;
  title: string;
  claim: string;
  /** Bars: same model, different harness. */
  bars: { label: string; value: number; unit: string; note?: string }[];
  source: SourceRef;
  caveat: string;
};

/** Readiness assessment item (PRD §15/12). */
export type AssessmentItem = {
  capabilityId: string;
  prompt: string;
  levels: [string, string, string, string]; // 0..3 maturity descriptions
};

/** Seller-mode discovery questions per section (PRD §19). */
export type SellerKit = {
  sectionId: string;
  questions: string[];
  talkTrack: string;
};
