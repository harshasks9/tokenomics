/**
 * AI Governance field guide — content model.
 *
 * All site content is typed data under src/lib/governance/data/. Pages render
 * from these registries so the framework stays coherent: every risk, control,
 * capability, and example is tagged to the same seven layers.
 */

export const LAYER_IDS = [
  "enterprise",
  "data",
  "model",
  "application",
  "agent",
  "security",
  "people",
] as const;

export type LayerId = (typeof LAYER_IDS)[number];

export type Hue =
  | "enterprise"
  | "data"
  | "model"
  | "application"
  | "agent"
  | "security"
  | "people"
  | "neutral";

/** How a statement should be read: binding law, certifiable standard, industry practice, vendor capability, or Google's stated view. */
export type ClaimKind = "regulation" | "standard" | "practice" | "vendor" | "google";

export interface Source {
  id: string;
  title: string;
  org: string;
  url: string;
  /** Publication or last-verified date, YYYY-MM. */
  date: string;
  kind: ClaimKind | "research" | "news";
}

export interface ControlRow {
  /** Control name, e.g. "Approved model catalog". */
  control: string;
  /** What the control does, one line. */
  what: string;
  /** Primary owner role(s). */
  owner: string;
  /** Technical mechanisms that implement it. */
  mechanisms: string;
  /** Standards / regulatory hooks, short labels. */
  standards: string;
}

export interface EnforcementPoint {
  point: string;
  what: string;
  examples: string;
}

export interface Layer {
  id: LayerId;
  num: string;
  name: string;
  /** Short name for tight UI. */
  short: string;
  /** The customer question this layer answers. */
  question: string;
  hue: Hue;
  /** One-paragraph definition. */
  summary: string;
  /** The single memorable line for this layer. */
  insight: string;
  executive: {
    /** Why leadership should care — 3-4 stakes. */
    stakes: string[];
    /** The risk, in one blunt sentence. */
    riskLine: string;
    /** Decisions only leadership can make. */
    decisions: string[];
    /** Anchor stat or incident reference. */
    anchor?: { value: string; label: string; sourceId?: string };
  };
  practitioner: {
    controls: ControlRow[];
    goodLooksLike: string[];
    operating: string[];
  };
  technical: {
    enforcementPoints: EnforcementPoint[];
    mechanisms: string[];
    monitoring: string[];
  };
  /** Risk ids concentrated at this layer. */
  riskIds: string[];
  /** Google capability ids most relevant to this layer. */
  googleCapabilityIds: string[];
  /** Discussion points a seller can use verbatim. */
  talkTrack: string[];
  /** Discovery questions for the customer. */
  discovery: string[];
  /** Related standards / framework hooks, short labels with claim kinds. */
  standardsHooks: { label: string; kind: ClaimKind }[];
}

export interface Incident {
  id: string;
  org: string;
  date: string;
  headline: string;
  what: string;
  lesson: string;
  layerIds: LayerId[];
  sourceIds: string[];
}

export interface Risk {
  id: string;
  name: string;
  /** One-line description for grid cards. */
  blurb: string;
  /** Fuller treatment. */
  detail: string;
  layerIds: LayerId[];
  /** Controls that mitigate it, short labels. */
  controls: string[];
  /** Incident ids that make it concrete. */
  incidentIds: string[];
  /** Google capabilities that address it. */
  googleCapabilityIds: string[];
}

export interface Persona {
  id: string;
  title: string;
  /** e.g. "Board / CEO". */
  group: string;
  tagline: string;
  /** What this person is accountable for. */
  cares: string[];
  /** What keeps them up at night. */
  nightmares: string[];
  /** Decisions they own in AI governance. */
  decisions: string[];
  /** Questions they should be asking. */
  questions: string[];
  /** Layers that matter most to them, in order. */
  layerEmphasis: LayerId[];
  /** Where in the site to take them first. */
  firstStops: { label: string; href: string }[];
}

export interface ArchGovernanceNote {
  layerId: LayerId;
  note: string;
}

export interface ArchPattern {
  id: string;
  name: string;
  examples: string;
  description: string;
  /** What is distinctive about governing this architecture. */
  distinctive: string;
  governanceNotes: ArchGovernanceNote[];
  topRiskIds: string[];
  googleNote: string;
  googleCapabilityIds: string[];
}

export const VENDOR_IDS = ["google", "microsoft", "aws", "openai", "anthropic"] as const;
export type VendorId = (typeof VENDOR_IDS)[number];

export interface Vendor {
  id: VendorId;
  name: string;
  /** Their governance philosophy in one paragraph — fair, sourced. */
  philosophy: string;
  /** Where the philosophy is written down. */
  philosophyDocs: string;
  /** Architectural center of gravity for governance enforcement. */
  enforcement: string;
  strengths: string[];
  /** Where customers must build their own controls. */
  customerMustBuild: string[];
}

export interface Challenge {
  id: string;
  /** The customer question, verbatim. */
  question: string;
  layerIds: LayerId[];
  /** Governance principle. */
  principle: string;
  /** Capabilities any enterprise needs, vendor-neutral. */
  required: string[];
  /** Architectural approaches seen in the market. */
  approaches: string[];
  /** Per-vendor implementation notes — factual, sourced. */
  vendorNotes: Record<VendorId, string>;
  /** Questions to ask any vendor. */
  askVendors: string[];
}

export interface GoogleCapability {
  id: string;
  name: string;
  /** Product family, e.g. "Vertex AI", "Security Command Center". */
  family: string;
  oneLiner: string;
  /** Which governance problem it addresses. */
  solves: string;
  layerIds: LayerId[];
  status: "GA" | "Preview" | "Announced";
  docsUrl: string;
}

export interface CaseStudy {
  id: string;
  company: string;
  industry: string;
  /** "google" = Google Cloud customer story; "market" = instructive non-Google example. */
  lens: "google" | "market";
  system: string;
  situation: string;
  challenge: string;
  controls: string[];
  architecture: string;
  outcome: string;
  lessons: string[];
  layerIds: LayerId[];
  confidence: "strong" | "directional";
  sourceIds: string[];
}

export interface ReadinessQuestion {
  id: string;
  layerId: LayerId;
  question: string;
  /** Maturity descriptions for levels 1–4, in order. */
  levels: [string, string, string, string];
}

export interface MaturityStage {
  level: 1 | 2 | 3 | 4;
  name: string;
  meaning: string;
}
