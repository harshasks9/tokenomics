/**
 * Typed access to the source-backed datasets in /data/anthropic-s1.
 *
 * Nothing in the microsite should hard-code a disclosed number: components read
 * from these objects (or from calc.ts, which derives from them). The JSON files
 * are produced/verified by scripts/anthropic-s1/* — see README section
 * "Anthropic S-1 teardown (/under-the-hood)".
 */
import tables from "../../../data/anthropic-s1/extracted-tables.json";
import evidenceFile from "../../../data/anthropic-s1/evidence.json";
import customersFile from "../../../data/anthropic-s1/customers.json";
import commitmentsFile from "../../../data/anthropic-s1/commitments.json";
import changesFile from "../../../data/anthropic-s1/amendment-changes.json";
import marketFile from "../../../data/anthropic-s1/market.json";
import insightsFile from "../../../data/anthropic-s1/insights.json";
import gapsFile from "../../../data/anthropic-s1/gaps.json";
import thesesFile from "../../../data/anthropic-s1/theses.json";
import moatFile from "../../../data/anthropic-s1/moat.json";
import playbookFile from "../../../data/anthropic-s1/playbook.json";
import scenariosFile from "../../../data/anthropic-s1/scenarios.json";
import narrativeFile from "../../../data/anthropic-s1/narrative.json";

export type Classification = "reported" | "calculated" | "inference" | "assumption" | "hypothesis";

export interface Evidence {
  id: string;
  metric: string;
  value: number | string | null;
  unit: string;
  period: string;
  classification: Classification;
  sourceId: "s1" | "s1a";
  section: string;
  page: string | null;
  quote: string;
  formula: string;
  confidence: "High" | "Medium" | "Low";
  caveat: string;
  tags: string[];
  quoteVerified?: boolean;
}

export interface MarketFact {
  id: string;
  entity: string;
  metric: string;
  value: string;
  period: string;
  url: string;
  date: string;
  basis: string;
  confidence: string;
  tags: string[];
}

export interface Change {
  id: string;
  category: string;
  tag: "financial" | "customers" | "compute" | "risk" | "strategy" | "other";
  section: string;
  title: string;
  original: string;
  amended: string;
  delta: string;
  whyItMatters: string;
  interpretation: string;
  competitiveImplication: string;
  confidence: string;
  evidence: { s1Page: string; s1aPage: string };
  materiality: "High" | "Medium" | "Low";
}

export interface Insight {
  id: string;
  kind: "surprising" | "unsurprising" | "underappreciated" | "contradiction";
  headline: string;
  evidence: string[];
  whyItMatters: string;
  whatIsSurprising: string;
  competitiveImplication: string;
  alternativeExplanation: string;
  whatToWatch: string;
  confidence: string;
  evidenceIds: string[];
  links: string[];
}

export interface Counterparty {
  id: string;
  name: string;
  type: string;
  amount: number;
  amountLow?: number;
  amountHigh?: number;
  amountBasis: string;
  period: string;
  chip: string;
  cancelability: string;
  financing: string;
  inAggregate: string;
  page: string;
  dependency: string;
}

export interface ScenarioParams {
  label?: string;
  g0: number;
  decay: number;
  priceChange: number;
  efficiency: number;
  researchGrowth: number;
  servingShare: number;
  premium: number;
  otherOpex: number;
  exitContingent: boolean;
  partnerFinancing: boolean;
  ipoProceeds: number;
  narrative?: string;
}

type Row = Record<string, number[]>;

export const TABLES = tables as unknown as {
  _meta: { s1_url: string; s1a_url: string; description: string };
  s1a: {
    quarterly_columns: string[];
    quarterly_pnl: Row;
    quarterly_adjusted_operating_income: Row;
    quarterly_adjusted_net_income: Row;
    annual_columns: string[];
    annual_pnl: Row;
    annual_adjusted_operating_income: Row;
    annual_adjusted_net_income: Row;
    cash_flows: Row;
    contractual_obligations: Row;
    functional_opex: Row;
    revenue_by_geography: Row;
    revenue_by_type: Row;
    balance_sheet_summary_sep30_2026: Row;
  };
  s1: { annual_columns: string[]; annual_pnl: Row; cash_flows: Row; quarterly_columns: string[]; quarterly_pnl: Row };
};

export const EVIDENCE = evidenceFile.items as unknown as Evidence[];
export const EVIDENCE_META = evidenceFile._meta;
export const evidenceById = (id: string) => EVIDENCE.find((e) => e.id === id);

export const CUSTOMERS = customersFile as unknown as {
  cohort100k: { asOf: string; label: string; count: number; qualifier: string; revenue: number | null; revenuePeriod: string | null; shareOfRevenue: number | null; sourceId: string; page: string }[];
  tiers: { id: string; label: string; count: number; qualifier: string; revenue?: number; floorRevenue?: number; note: string; sourceId: string; page: string }[];
  concentration: { period: string; metric: string; value: number | null; note?: string; sourceId: string; page: string }[];
  top5Share: { period: string; top5: number; sourceId: string; page: string; basis: string }[];
  marketplaceShare: { period: string; value: number; low?: number; high?: number; derived?: boolean; sourceId?: string }[];
};

export const COMMITMENTS = commitmentsFile as unknown as {
  _meta: { description: string; doubleCountingRule: string; asOf: string };
  aggregate: { total: number; before2031: number; from2031to2045: number; next12Months: number; next12MonthsContingent: number; contingentOrTerminable: number; excludedEstimateLow: number; excludedEstimateHigh: number; page: string };
  buckets: { id: string; label: string; amount: number; page: string; detail: string }[];
  tableByYear: { columns: string[]; operatingLeases: number[]; financeLeases: number[]; purchaseCommitments: number[]; total: number[]; page: string };
  history: { asOf: string; label: string; amount: number; sourceId: string; page: string }[];
  counterparties: Counterparty[];
  financing: { id: string; label: string; amount: number; page: string; note?: string }[];
};

export const CHANGES = changesFile.changes as unknown as Change[];
export const CHANGES_META = changesFile._meta;
export const MARKET = marketFile.items as unknown as MarketFact[];
export const INSIGHTS = insightsFile.items as unknown as Insight[];
export const GAPS = gapsFile.items as unknown as { id: string; title: string; status: string; whyItMatters: string; whatWeCanBound: string; disclosureNeeded: string }[];
export const THESES = thesesFile.items as unknown as {
  id: string; title: string; support: string[]; contra: string[]; industry: string; anthropic: string;
  players: Record<string, string>; confidence: string; prediction: string; verdict: string;
}[];
export const MOAT = moatFile as unknown as {
  _meta: { description: string; rubric: Record<string, string>; players: string[] };
  dimensions: { id: string; dimension: string; scores: Record<string, number>; anthropicEvidence: string; counterargument: string; durability: string; confidence: string; replicationDifficulty: string; whatErodes: string }[];
};
export const PLAYBOOK = playbookFile as unknown as {
  domains: { domain: string; opportunity: string; evidence: string; target: string; capabilities: string; action: string; horizon: string; benefit: string; risk: string; metric: string }[];
  google: { title: string; points: { layer: string; view: string; incentive: string; tension: string }[]; actions: string[] };
  apac: { title: string; context: string[]; segments: { segment: string; hypothesis: string; validate: string }[]; risks: string[] };
  matrix: { functions: string[]; industries: string[]; note: string; cells: Record<string, { adoption: number; intensity: number; economics: number }> };
  signposts: { signal: string; threshold: string; why: string }[];
};
export const SCENARIOS = scenariosFile as unknown as {
  _meta: { description: string; base: { quarter: string; revenue: number; compute: number; shortTerm: number; liquidity: number; partnerFinancing: number; contingentShare: number; otherCashOpexPct9m: number } };
  presets: Record<"bull" | "base" | "bear", ScenarioParams>;
};
export const NARRATIVE = narrativeFile as unknown as {
  site: { title: string; subtitle: string; positioning: string; cutoff: string; sources: string };
  verdict: {
    headline: string; assessment: string;
    conclusions: { title: string; body: string; refs: string[] }[];
    strengths: { title: string; body: string }[];
    vulnerabilities: { title: string; body: string }[];
    implications: { title: string; body: string }[];
    positioning: { note: string; points: { name: string; x: number; y: number; size: number }[] };
  };
  sections: { id: string; n: string; kicker: string; headline: string; dek: string; implication: string }[];
};

export const SOURCES = {
  s1: { label: "Form S-1 (Oct 26, 2026)", url: TABLES._meta.s1_url },
  s1a: { label: "Form S-1/A No. 1 (Nov 2, 2026)", url: TABLES._meta.s1a_url },
  edgar: { label: "EDGAR filing index, Anthropic, PBC (CIK 2130357)", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0002130357&type=S-1" },
} as const;

export const section = (id: string) => {
  const s = NARRATIVE.sections.find((x) => x.id === id);
  if (!s) throw new Error(`unknown section ${id}`);
  return s;
};
