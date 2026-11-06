/**
 * Synthetic organizations, people, assets and engagements for the demo.
 * All names are fictional. Nothing here describes a real customer or partner.
 */
import type { Asset, Collection, Config, Org, PersonaId, User, Workspace } from "./types";

export const ORGS: Org[] = [
  { id: "google", name: "Google Cloud", kind: "google", verified: true, blurb: "Forward Deployed Engineering · Gemini 10 program" },
  { id: "kestrel", name: "Kestrel Industrial", kind: "customer", verified: true, industry: "Manufacturing", blurb: "Discrete manufacturer · 4 plants · 1,900 suppliers" },
  { id: "halvorsen", name: "Halvorsen Foods", kind: "customer", verified: true, industry: "Food & Beverage", blurb: "Cold-chain food producer" },
  { id: "orion", name: "Orion Freight", kind: "customer", verified: true, industry: "Logistics", blurb: "Regional freight and 3PL operator" },
  { id: "lattice", name: "Lattice Systems Integrators", kind: "partner", verified: true, blurb: "SAP + supply chain practice · Premier partner" },
  { id: "brightpath", name: "Brightpath Digital", kind: "partner", verified: true, blurb: "Insurance and claims modernization partner" },
];

export const USERS: User[] = [
  { id: "u-dana", name: "Dana Whitfield", title: "VP, Supply Chain Operations", orgId: "kestrel", initials: "DW" },
  { id: "u-tomas", name: "Tomás Ibarra", title: "Plant IT Lead", orgId: "kestrel", initials: "TI" },
  { id: "u-priya", name: "Priya Raman", title: "Forward Deployed Engineer", orgId: "google", initials: "PR" },
  { id: "u-jonah", name: "Jonah Mbeki", title: "Asset Review Board", orgId: "google", initials: "JM" },
  { id: "u-marcus", name: "Marcus Oyelaran", title: "Partner FDE, Supply Chain", orgId: "lattice", initials: "MO" },
  { id: "u-ines", name: "Inês Carvalho", title: "SAP Integration Architect", orgId: "lattice", initials: "IC" },
  { id: "u-elena", name: "Elena Sørensen", title: "Head of Quality Systems", orgId: "halvorsen", initials: "ES" },
  { id: "u-arjun", name: "Arjun Mehta", title: "Principal Consultant", orgId: "brightpath", initials: "AM" },
  { id: "u-kim", name: "Kim Hollis", title: "Director, Claims Operations", orgId: "orion", initials: "KH" },
];

/** The three switchable personas — the demo's simulated sign-in. */
export const PERSONA_USER: Record<PersonaId, string> = {
  customer: "u-dana",
  google: "u-priya",
  partner: "u-marcus",
};

export const PERSONA_LABEL: Record<PersonaId, string> = {
  customer: "Customer",
  google: "Google FDE",
  partner: "Partner FDE",
};

export const DEFAULT_CONFIG: Config = {
  autoResolveLimit: 1500,
  approvalChannel: "Google Chat",
  plants: 1,
  exceptionsPerMonth: 1200,
  regions: ["us-central1"],
};

const d = (s: string) => s; // ISO date helper for readability

export const kebabName = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function asset(a: Omit<Asset, "slug" | "sharedWorkspaceIds" | "reviews" | "forks" | "attribution"> & Partial<Pick<Asset, "sharedWorkspaceIds" | "reviews" | "forks" | "attribution">>): Asset {
  return { slug: `${a.ownerOrgId}/${kebabName(a.name)}`, sharedWorkspaceIds: [], reviews: [], forks: 0, attribution: "named", ...a };
}

export const SCER_BLUEPRINT = "a-scer-blueprint";

export const ASSETS: Asset[] = [
  // ── Blueprints ────────────────────────────────────────────────────────
  asset({
    id: SCER_BLUEPRINT, name: "Supply Chain Exception Resolution Agent", type: "blueprint",
    summary: "Detects supply exceptions, finds the root cause in ERP data, proposes a fix and routes approvals — end to end.",
    description: "A reference architecture for an agent that watches purchase orders, ASNs and production schedules, classifies each exception (late supplier, short shipment, quality hold, demand spike), reasons over ERP history to find the root cause, drafts a resolution (expedite, re-source, re-sequence) and routes anything above a value threshold to a human approver. Ships with evaluation baselines and a human-in-the-loop approval workflow.",
    industries: ["Manufacturing", "Automotive", "CPG"], outcomes: ["Fewer line stoppages", "Lower expedite freight", "Faster exception close"],
    ownerOrgId: "google", contributorId: "u-priya", visibility: "public", trust: "verified",
    versions: [
      { version: "2.0", at: d("2026-05-12"), note: "Gemini 10 runtime, multi-agent planner" },
      { version: "2.1", at: d("2026-07-02"), note: "Root-cause tool calling over ERP change logs" },
      { version: "2.3", at: d("2026-10-01"), note: "Approval thresholds per plant; eval suite v4" },
    ],
    reviews: [
      { id: "r1", userId: "u-elena", rating: 5, text: "Root-cause step is the real value — it cut our triage time in half.", at: d("2026-09-14") },
      { id: "r2", userId: "u-arjun", rating: 4, text: "Solid scaffold. Bring your own ERP mapping for non-SAP stacks.", at: d("2026-10-03") },
    ],
    ratingSeed: { sum: 4.6 * 38, count: 38 }, forks: 41, deployments: 23,
    prerequisites: ["ERP read access (SAP S/4HANA, Oracle Fusion or equivalent)", "Supplier master data in BigQuery or ERP", "An approval channel (Google Chat, Teams or email)", "Vertex AI project in a supported region"],
    security: ["Read-only ERP scopes by default; writes require approval workflow", "Credentials held in Secret Manager — never in the agent package", "PII-free by design: supplier contacts are referenced by ID", "Audit log of every proposed and executed action"],
    costPer1k: 1650, minutesSaved: 26, tags: ["supply chain", "exceptions", "erp", "procurement", "late supplier deliveries", "shortages", "line stoppage"],
    requires: ["erp"], includes: ["a-exception-classify", "a-root-cause", "a-hitl", "a-scer-evals", "a-sap-connector"],
    updatedAt: d("2026-10-01"),
  }),
  asset({
    id: "a-scer-preview", name: "Exception Resolution v3 — Gemini 10 preview", type: "blueprint",
    summary: "Pre-release planner that negotiates directly with supplier agents. Internal preview only.",
    description: "Internal preview of the next major blueprint. Not yet security-reviewed for external use; available to Google FDEs for design partner engagements.",
    industries: ["Manufacturing"], outcomes: ["Autonomous supplier negotiation"],
    ownerOrgId: "google", contributorId: "u-jonah", visibility: "internal", trust: "community",
    versions: [{ version: "3.0-preview.2", at: d("2026-10-22"), note: "Agent-to-agent supplier protocol" }],
    ratingSeed: { sum: 4.2 * 6, count: 6 }, deployments: 1,
    prerequisites: ["Design-partner agreement"], security: ["Internal preview — not for customer data outside design-partner terms"],
    costPer1k: 2100, minutesSaved: 34, tags: ["preview", "a2a"], requires: ["erp"], updatedAt: d("2026-10-22"),
  }),
  asset({
    id: "a-supplier-onboarding", name: "Supplier Onboarding Agent", type: "blueprint",
    summary: "Collects supplier documents, validates certificates and creates vendor master records with approvals.",
    description: "Guides new suppliers through document collection, checks certificates against registries, and drafts vendor master records in SAP for procurement approval.",
    industries: ["Manufacturing", "CPG"], outcomes: ["Onboarding in days, not weeks"],
    ownerOrgId: "lattice", contributorId: "u-ines", visibility: "public", trust: "field",
    versions: [{ version: "1.0", at: d("2026-06-10"), note: "Initial" }, { version: "1.2", at: d("2026-09-01"), note: "Certificate registry checks" }],
    ratingSeed: { sum: 4.4 * 17, count: 17 }, forks: 9, deployments: 7,
    prerequisites: ["SAP vendor master write via approval"], security: ["Document storage in customer GCS bucket"],
    costPer1k: 900, minutesSaved: 45, tags: ["procurement", "vendor master"], requires: ["erp"], updatedAt: d("2026-09-01"),
  }),
  asset({
    id: "a-demand-sensing", name: "Demand Sensing Copilot", type: "blueprint",
    summary: "Blends POS, weather and promotions into a daily demand signal planners can interrogate in plain language.",
    description: "Reference agent that explains forecast changes and proposes replenishment adjustments.",
    industries: ["Retail", "CPG"], outcomes: ["Lower stockouts", "Less safety stock"],
    ownerOrgId: "google", contributorId: "u-priya", visibility: "public", trust: "verified",
    versions: [{ version: "1.4", at: d("2026-08-20"), note: "Promo uplift tool" }],
    ratingSeed: { sum: 4.5 * 29, count: 29 }, forks: 22, deployments: 14,
    prerequisites: ["POS data in BigQuery"], security: ["Aggregated data only"],
    costPer1k: 700, minutesSaved: 12, tags: ["forecasting", "planning"], requires: ["data"], updatedAt: d("2026-08-20"),
  }),
  asset({
    id: "a-claims-triage", name: "Carrier Claims Triage Agent", type: "blueprint",
    summary: "Reads damage and loss claims, matches them to shipments and drafts carrier responses.",
    description: "Classifies freight claims, retrieves shipment evidence, estimates liability and drafts responses for adjuster review.",
    industries: ["Logistics", "Insurance"], outcomes: ["Faster claim cycle time"],
    ownerOrgId: "brightpath", contributorId: "u-arjun", visibility: "public", trust: "field",
    versions: [{ version: "1.1", at: d("2026-07-15"), note: "Photo evidence analysis" }],
    ratingSeed: { sum: 4.3 * 11, count: 11 }, forks: 6, deployments: 5,
    prerequisites: ["Claims system API", "Shipment data"], security: ["Claimant PII redacted before model calls"],
    costPer1k: 1100, minutesSaved: 22, tags: ["claims", "freight claims"], requires: ["edi"], updatedAt: d("2026-07-15"),
  }),
  asset({
    id: "a-capa", name: "Quality Deviation & CAPA Agent", type: "blueprint",
    summary: "Turns a quality deviation into a drafted investigation, root-cause hypothesis and CAPA plan.",
    description: "Contributed by a food manufacturer after their own deployment. Drafts deviation reports and CAPA plans aligned to GMP-style templates.",
    industries: ["Food & Beverage", "Pharma", "Manufacturing"], outcomes: ["Faster deviation close", "Audit-ready records"],
    ownerOrgId: "halvorsen", contributorId: "u-elena", visibility: "public", trust: "community", attribution: "org",
    versions: [{ version: "0.9", at: d("2026-09-30"), note: "Community release" }],
    ratingSeed: { sum: 4.1 * 8, count: 8 }, forks: 4, deployments: 2,
    prerequisites: ["QMS export"], security: ["No batch genealogy leaves the customer project"],
    costPer1k: 1300, minutesSaved: 40, tags: ["quality", "gmp", "capa", "quality deviations"], requires: ["data"], updatedAt: d("2026-09-30"),
  }),
  asset({
    id: "a-field-dispatch", name: "Field Service Dispatch Agent", type: "blueprint",
    summary: "Prioritizes work orders, matches technicians and drafts customer updates.",
    description: "Reference dispatch agent for utilities and industrial service teams.",
    industries: ["Utilities", "Manufacturing"], outcomes: ["Higher first-time fix rate"],
    ownerOrgId: "google", contributorId: "u-priya", visibility: "public", trust: "verified",
    versions: [{ version: "1.0", at: d("2026-06-02"), note: "Initial" }],
    ratingSeed: { sum: 4.4 * 15, count: 15 }, forks: 8, deployments: 9,
    prerequisites: ["Work order system API"], security: ["Technician location data minimized"],
    costPer1k: 800, minutesSaved: 15, tags: ["field service", "dispatch", "work order backlog"], requires: ["ticketing"], updatedAt: d("2026-06-02"),
  }),
  asset({
    id: "a-kyc", name: "KYC Refresh Agent", type: "blueprint",
    summary: "Runs periodic KYC refresh: gathers evidence, flags changes and prepares analyst packets.",
    description: "Reference agent for financial services periodic review.",
    industries: ["Financial Services"], outcomes: ["Lower review backlog"],
    ownerOrgId: "google", contributorId: "u-jonah", visibility: "public", trust: "verified",
    versions: [{ version: "1.3", at: d("2026-08-08"), note: "Adverse media tool" }],
    ratingSeed: { sum: 4.6 * 21, count: 21 }, forks: 12, deployments: 11,
    prerequisites: ["Customer master data", "Screening provider API"], security: ["Runs inside customer VPC-SC perimeter"],
    costPer1k: 1400, minutesSaved: 35, tags: ["kyc", "compliance", "review backlog"], requires: ["data"], updatedAt: d("2026-08-08"),
  }),

  // ── Skills ────────────────────────────────────────────────────────────
  asset({
    id: "a-exception-classify", name: "Exception Classification", type: "skill",
    summary: "Classifies supply exceptions into 14 types with confidence and evidence links.",
    description: "Few-shot plus tool-grounded classifier tuned on synthetic and partner-contributed exception data.",
    industries: ["Manufacturing", "CPG", "Automotive"], outcomes: ["Consistent triage"],
    ownerOrgId: "google", contributorId: "u-priya", visibility: "public", trust: "verified",
    versions: [{ version: "1.6", at: d("2026-09-12"), note: "Quality-hold subtype" }],
    ratingSeed: { sum: 4.7 * 44, count: 44 }, forks: 18, deployments: 31,
    prerequisites: [], security: ["Stateless; no data retention"], costPer1k: 120, minutesSaved: 4, tags: ["classification"], updatedAt: d("2026-09-12"),
  }),
  asset({
    id: "a-root-cause", name: "ERP Root-Cause Reasoning", type: "skill",
    summary: "Walks ERP change logs and document flow to explain why an exception happened.",
    description: "Tool-calling skill that traverses PO, ASN, goods receipt and MRP change history to produce a cited root-cause narrative.",
    industries: ["Manufacturing", "CPG"], outcomes: ["Root cause in minutes"],
    ownerOrgId: "google", contributorId: "u-priya", visibility: "public", trust: "verified",
    versions: [{ version: "2.0", at: d("2026-08-28"), note: "Document-flow traversal" }],
    ratingSeed: { sum: 4.6 * 27, count: 27 }, forks: 10, deployments: 19,
    prerequisites: ["ERP read connector"], security: ["Read-only"], costPer1k: 380, minutesSaved: 8, tags: ["reasoning", "erp"], requires: ["erp"], updatedAt: d("2026-08-28"),
  }),
  asset({
    id: "a-supplier-risk", name: "Supplier Risk Scoring", type: "skill",
    summary: "Scores each supplier on delivery, financial and geographic risk and explains the score.",
    description: "Combines on-time-in-full history, financial health signals and geographic exposure into an explainable risk score that the agent uses when choosing between expedite and re-source.",
    industries: ["Manufacturing", "Automotive", "CPG"], outcomes: ["Smarter re-sourcing"],
    ownerOrgId: "lattice", contributorId: "u-marcus", visibility: "public", trust: "field",
    versions: [{ version: "1.2", at: d("2026-07-19"), note: "Geographic exposure" }, { version: "1.3", at: d("2026-09-25"), note: "Explanations per factor" }],
    reviews: [{ id: "r3", userId: "u-priya", rating: 5, text: "Field-validated at three manufacturers. Explanations are what approvers trust.", at: d("2026-10-05") }],
    ratingSeed: { sum: 4.5 * 19, count: 19 }, forks: 7, deployments: 9,
    prerequisites: ["Supplier master + OTIF history"], security: ["Financial signals from licensed provider; no supplier PII"],
    costPer1k: 160, minutesSaved: 5, tags: ["supplier risk", "procurement"], updatedAt: d("2026-09-25"),
  }),
  asset({
    id: "a-tier2-signals", name: "Tier-2 Supplier Disruption Signals", type: "skill",
    summary: "Maps tier-2 suppliers and watches port, weather and news signals for disruption.",
    description: "Lattice's proprietary tier-2 mapping skill. Shared into customer workspaces under engagement terms.",
    industries: ["Manufacturing", "Automotive"], outcomes: ["Earlier disruption warning"],
    ownerOrgId: "lattice", contributorId: "u-ines", visibility: "org", trust: "field",
    versions: [{ version: "0.8", at: d("2026-10-10"), note: "Port congestion feed" }],
    ratingSeed: { sum: 4.8 * 5, count: 5 }, deployments: 3,
    prerequisites: ["Tier-1 supplier list"], security: ["Proprietary partner IP — engagement license"],
    costPer1k: 210, minutesSaved: 3, tags: ["tier-2", "risk"], updatedAt: d("2026-10-10"),
  }),
  asset({
    id: "a-expedite", name: "PO Expedite Negotiation", type: "skill",
    summary: "Drafts expedite requests and evaluates supplier counter-offers against cost of delay.",
    description: "Community skill that frames expedite requests and compares counter-offers to line-stoppage cost.",
    industries: ["Manufacturing"], outcomes: ["Lower expedite cost"],
    ownerOrgId: "brightpath", contributorId: "u-arjun", visibility: "public", trust: "community",
    versions: [{ version: "0.6", at: d("2026-08-14"), note: "Counter-offer scoring" }],
    ratingSeed: { sum: 3.9 * 7, count: 7 }, forks: 3, deployments: 2,
    prerequisites: ["Cost-of-delay table"], security: ["Drafts only; sending requires approval"], costPer1k: 140, minutesSaved: 6, tags: ["negotiation"], updatedAt: d("2026-08-14"),
  }),
  asset({
    id: "a-supplier-comms", name: "Multilingual Supplier Comms", type: "skill",
    summary: "Writes and translates supplier messages in 38 languages with tone and policy guardrails.",
    description: "Generates supplier communications with approved templates and terminology.",
    industries: ["Manufacturing", "CPG", "Retail"], outcomes: ["Faster supplier response"],
    ownerOrgId: "google", contributorId: "u-jonah", visibility: "public", trust: "verified",
    versions: [{ version: "1.1", at: d("2026-07-30"), note: "Terminology glossary" }],
    ratingSeed: { sum: 4.5 * 23, count: 23 }, forks: 5, deployments: 16,
    prerequisites: [], security: ["Policy guardrails on commitments"], costPer1k: 90, minutesSaved: 6, tags: ["communications", "translation"], updatedAt: d("2026-07-30"),
  }),
  asset({
    id: "a-three-way", name: "Invoice Three-Way Match", type: "skill",
    summary: "Matches invoice, PO and goods receipt and explains every mismatch.",
    description: "Customer-contributed skill from an accounts-payable deployment.",
    industries: ["Food & Beverage", "Manufacturing", "Retail"], outcomes: ["Fewer AP exceptions"],
    ownerOrgId: "halvorsen", contributorId: "u-elena", visibility: "public", trust: "field", attribution: "anonymous",
    versions: [{ version: "1.0", at: d("2026-05-21"), note: "Initial" }],
    ratingSeed: { sum: 4.4 * 13, count: 13 }, forks: 6, deployments: 8,
    prerequisites: ["AP + GR data"], security: ["Bank details masked"], costPer1k: 110, minutesSaved: 7, tags: ["accounts payable", "invoice mismatches"], updatedAt: d("2026-05-21"),
  }),

  // ── Connectors ────────────────────────────────────────────────────────
  asset({
    id: "a-sap-connector", name: "SAP S/4HANA Connector", type: "connector",
    summary: "OData connector for purchasing, inventory and production with least-privilege scopes.",
    description: "Verified connector exposing PO, ASN, goods receipt, MRP and material master as agent tools.",
    industries: ["Manufacturing", "CPG", "Automotive"], outcomes: [],
    ownerOrgId: "google", contributorId: "u-jonah", visibility: "public", trust: "verified",
    versions: [{ version: "3.2", at: d("2026-09-05"), note: "Change-log endpoints" }],
    ratingSeed: { sum: 4.6 * 52, count: 52 }, forks: 14, deployments: 48,
    prerequisites: ["SAP Gateway OData services enabled", "Technical user with read roles"], security: ["Credentials in Secret Manager", "Per-tool scope allowlist"],
    costPer1k: 20, minutesSaved: 0, tags: ["sap", "erp"], provides: ["erp"], updatedAt: d("2026-09-05"),
  }),
  asset({
    id: "a-sap-template", name: "SAP Exception Integration Template", type: "connector",
    summary: "Pre-mapped SAP movement types, MRP exception codes and plant calendars for exception agents.",
    description: "Lattice's reusable integration template: field mappings from SAP MRP exception messages to the exception taxonomy, batching for OData throttling, and a plant-calendar adapter.",
    industries: ["Manufacturing", "Automotive"], outcomes: ["Weeks of mapping removed"],
    ownerOrgId: "lattice", contributorId: "u-ines", visibility: "public", trust: "field",
    versions: [{ version: "2.0", at: d("2026-08-02"), note: "MRP exception codes 01–69" }, { version: "2.1", at: d("2026-10-12"), note: "OData batching" }],
    reviews: [{ id: "r4", userId: "u-elena", rating: 5, text: "Saved us the mapping workshop entirely.", at: d("2026-09-02") }],
    ratingSeed: { sum: 4.7 * 21, count: 21 }, forks: 8, deployments: 12,
    prerequisites: ["SAP S/4HANA Connector"], security: ["Mapping only; no credentials"], costPer1k: 10, minutesSaved: 2,
    tags: ["sap", "mapping", "template"], provides: ["erp-template"], requires: ["erp"], updatedAt: d("2026-10-12"),
  }),
  asset({
    id: "a-oracle", name: "Oracle Fusion SCM Connector", type: "connector",
    summary: "REST connector for Oracle Fusion purchasing and inventory.",
    description: "Community connector maintained by Brightpath.",
    industries: ["Manufacturing", "Retail"], outcomes: [],
    ownerOrgId: "brightpath", contributorId: "u-arjun", visibility: "public", trust: "community",
    versions: [{ version: "0.9", at: d("2026-08-01"), note: "Inventory endpoints" }],
    ratingSeed: { sum: 4.0 * 9, count: 9 }, forks: 2, deployments: 3,
    prerequisites: ["Fusion integration user"], security: ["OAuth client in Secret Manager"], costPer1k: 20, minutesSaved: 0, tags: ["oracle", "erp"], provides: ["erp"], updatedAt: d("2026-08-01"),
  }),
  asset({
    id: "a-servicenow", name: "ServiceNow Connector", type: "connector",
    summary: "Create, update and query incidents and work orders.",
    description: "Verified ITSM connector.", industries: ["Utilities", "Manufacturing", "Financial Services"], outcomes: [],
    ownerOrgId: "google", contributorId: "u-jonah", visibility: "public", trust: "verified",
    versions: [{ version: "2.4", at: d("2026-07-11"), note: "Work orders" }],
    ratingSeed: { sum: 4.5 * 31, count: 31 }, forks: 4, deployments: 27,
    prerequisites: ["ServiceNow integration user"], security: ["Scoped OAuth"], costPer1k: 15, minutesSaved: 0, tags: ["itsm"], provides: ["ticketing"], updatedAt: d("2026-07-11"),
  }),
  asset({
    id: "a-chat", name: "Approvals in Chat", type: "connector",
    summary: "Interactive approval cards in Google Chat or Microsoft Teams.",
    description: "Sends approve / modify / reject cards and returns the decision to the agent.",
    industries: ["Manufacturing", "Retail", "Financial Services", "Logistics"], outcomes: [],
    ownerOrgId: "google", contributorId: "u-jonah", visibility: "public", trust: "verified",
    versions: [{ version: "1.8", at: d("2026-09-18"), note: "Teams adaptive cards" }],
    ratingSeed: { sum: 4.6 * 40, count: 40 }, forks: 3, deployments: 36,
    prerequisites: ["Chat or Teams app registration"], security: ["Approver identity verified via SSO"], costPer1k: 5, minutesSaved: 1, tags: ["approvals"], provides: ["notify"], updatedAt: d("2026-09-18"),
  }),
  asset({
    id: "a-bigquery", name: "BigQuery Supply Chain Twin", type: "connector",
    summary: "Query a governed supply chain data model in BigQuery as agent tools.",
    description: "Verified connector over a standard supply chain twin schema.",
    industries: ["Manufacturing", "Retail", "CPG"], outcomes: [],
    ownerOrgId: "google", contributorId: "u-priya", visibility: "public", trust: "verified",
    versions: [{ version: "1.5", at: d("2026-08-11"), note: "Row-level security passthrough" }],
    ratingSeed: { sum: 4.5 * 26, count: 26 }, forks: 6, deployments: 22,
    prerequisites: ["BigQuery dataset"], security: ["Row-level security honored"], costPer1k: 35, minutesSaved: 0, tags: ["bigquery", "data"], provides: ["data"], updatedAt: d("2026-08-11"),
  }),
  asset({
    id: "a-edi", name: "EDI X12 856 / ASN Connector", type: "connector",
    summary: "Parses advance ship notices and exposes shipment status to agents.",
    description: "Field-validated EDI parser and status tool.", industries: ["Manufacturing", "Logistics", "Retail"], outcomes: [],
    ownerOrgId: "lattice", contributorId: "u-ines", visibility: "public", trust: "field",
    versions: [{ version: "1.3", at: d("2026-06-29"), note: "856 hierarchical levels" }],
    ratingSeed: { sum: 4.3 * 12, count: 12 }, forks: 2, deployments: 10,
    prerequisites: ["VAN or AS2 feed"], security: ["Trading-partner IDs only"], costPer1k: 10, minutesSaved: 1, tags: ["edi", "asn"], provides: ["edi"], updatedAt: d("2026-06-29"),
  }),

  // ── Workflows & evaluations ───────────────────────────────────────────
  asset({
    id: "a-hitl", name: "Human-in-the-Loop Approval Routing", type: "workflow",
    summary: "Routes agent actions above a value or risk threshold to the right approver, with SLAs.",
    description: "Threshold-based routing with escalation, delegation and audit trail.",
    industries: ["Manufacturing", "Financial Services", "Retail", "Logistics"], outcomes: ["Safe autonomy"],
    ownerOrgId: "google", contributorId: "u-priya", visibility: "public", trust: "verified",
    versions: [{ version: "2.2", at: d("2026-09-09"), note: "Per-plant thresholds" }],
    ratingSeed: { sum: 4.7 * 35, count: 35 }, forks: 11, deployments: 33,
    prerequisites: ["Approval channel connector"], security: ["Segregation of duties enforced"], costPer1k: 15, minutesSaved: 2, tags: ["approvals", "governance"], requires: ["notify"], updatedAt: d("2026-09-09"),
  }),
  asset({
    id: "a-escalation", name: "Supplier Escalation Ladder", type: "workflow",
    summary: "Three-step escalation from buyer to category manager to supplier executive.",
    description: "Community workflow with templated messages per step.",
    industries: ["Manufacturing", "Automotive"], outcomes: [],
    ownerOrgId: "lattice", contributorId: "u-marcus", visibility: "public", trust: "community",
    versions: [{ version: "1.0", at: d("2026-08-19"), note: "Initial" }],
    ratingSeed: { sum: 4.2 * 6, count: 6 }, forks: 1, deployments: 4,
    prerequisites: [], security: [], costPer1k: 10, minutesSaved: 3, tags: ["escalation"], updatedAt: d("2026-08-19"),
  }),
  asset({
    id: "a-scer-evals", name: "Exception Resolution Eval Suite", type: "evaluation",
    summary: "1,200 graded exception scenarios: classification, root cause, resolution quality and safety.",
    description: "Evaluation pack with golden answers and rubric graders; the baseline every Gemini 10 exception agent is accepted against.",
    industries: ["Manufacturing", "CPG"], outcomes: ["Acceptance you can measure"],
    ownerOrgId: "google", contributorId: "u-jonah", visibility: "public", trust: "verified",
    versions: [{ version: "4.0", at: d("2026-10-01"), note: "Safety refusals + approval routing" }],
    ratingSeed: { sum: 4.8 * 18, count: 18 }, forks: 9, deployments: 21,
    prerequisites: [], security: ["Synthetic scenarios only"], costPer1k: 0, minutesSaved: 0, tags: ["evals"], updatedAt: d("2026-10-01"),
  }),

  // ── Restricted assets (prove the boundaries) ──────────────────────────
  asset({
    id: "a-gtm-playbook", name: "Manufacturing Consumption Expansion Playbook", type: "workflow",
    summary: "Internal account-planning playbook for expanding agent consumption after first activation.",
    description: "Google-internal GTM guidance. Never exposed to customers or partners.",
    industries: ["Manufacturing"], outcomes: [], ownerOrgId: "google", contributorId: "u-jonah", visibility: "internal", trust: "community",
    versions: [{ version: "1.0", at: d("2026-10-15"), note: "FY27" }], ratingSeed: { sum: 0, count: 0 }, deployments: 0,
    prerequisites: [], security: ["Google internal"], costPer1k: 0, minutesSaved: 0, tags: ["gtm"], sensitive: true, updatedAt: d("2026-10-15"),
  }),
  asset({
    id: "a-kestrel-calendar", name: "Kestrel Plant Calendar Adapter", type: "connector",
    summary: "Kestrel's shift and maintenance calendars for four plants.",
    description: "Kestrel-internal adapter. Contains plant identifiers and shift patterns.",
    industries: ["Manufacturing"], outcomes: [], ownerOrgId: "kestrel", contributorId: "u-tomas", visibility: "org", trust: "community",
    versions: [{ version: "1.0", at: d("2026-03-01"), note: "Initial" }], ratingSeed: { sum: 0, count: 0 }, deployments: 1,
    prerequisites: [], security: ["Customer confidential"], costPer1k: 5, minutesSaved: 1, tags: ["calendar"], provides: ["calendar"], sensitive: true, updatedAt: d("2026-03-01"),
  }),
  asset({
    id: "a-halvorsen-coldchain", name: "Halvorsen Cold-Chain Rules", type: "skill",
    summary: "Temperature excursion rules and product-specific disposition logic.",
    description: "Halvorsen-confidential rules shared only into their engagement workspace.",
    industries: ["Food & Beverage"], outcomes: [], ownerOrgId: "halvorsen", contributorId: "u-elena", visibility: "org", trust: "community",
    sharedWorkspaceIds: ["ws-halvorsen"],
    versions: [{ version: "2.0", at: d("2026-08-01"), note: "SKU-level rules" }], ratingSeed: { sum: 0, count: 0 }, deployments: 1,
    prerequisites: [], security: ["Customer confidential"], costPer1k: 60, minutesSaved: 6, tags: ["cold chain"], sensitive: true, updatedAt: d("2026-08-01"),
  }),
  asset({
    id: "a-brightpath-guidewire", name: "Brightpath Guidewire Accelerator", type: "connector",
    summary: "Brightpath's proprietary Guidewire ClaimCenter mappings.",
    description: "Partner-private IP.", industries: ["Insurance"], outcomes: [], ownerOrgId: "brightpath", contributorId: "u-arjun", visibility: "org", trust: "field",
    versions: [{ version: "3.1", at: d("2026-07-01"), note: "ClaimCenter 10" }], ratingSeed: { sum: 0, count: 0 }, deployments: 6,
    prerequisites: [], security: ["Partner confidential"], costPer1k: 15, minutesSaved: 2, tags: ["guidewire"], updatedAt: d("2026-07-01"),
  }),
  asset({
    id: "a-orion-acceptance", name: "Orion Claims Acceptance Tests", type: "evaluation",
    summary: "Orion's acceptance criteria and graded claims scenarios.",
    description: "Workspace-only evaluation set built with Orion's own claims.", industries: ["Logistics"], outcomes: [],
    ownerOrgId: "orion", contributorId: "u-kim", visibility: "workspace", trust: "community", sharedWorkspaceIds: ["ws-orion"],
    versions: [{ version: "1.0", at: d("2026-08-20"), note: "Initial" }], ratingSeed: { sum: 0, count: 0 }, deployments: 1,
    prerequisites: [], security: ["Contains customer claims data"], costPer1k: 0, minutesSaved: 0, tags: ["acceptance"], sensitive: true, updatedAt: d("2026-08-20"),
  }),
];

export const COLLECTIONS: Collection[] = [
  {
    id: "c-lattice-sc", name: "Lattice Supply Chain on SAP", ownerOrgId: "lattice", curatorId: "u-marcus",
    blurb: "Everything Lattice reuses on SAP-based supply chain engagements.",
    assetIds: ["a-sap-template", "a-supplier-risk", "a-tier2-signals", "a-edi", "a-supplier-onboarding", "a-escalation"],
  },
  {
    id: "c-google-mfg", name: "Gemini 10 for Manufacturing", ownerOrgId: "google", curatorId: "u-priya",
    blurb: "Google-verified starting points for manufacturing agents.",
    assetIds: [SCER_BLUEPRINT, "a-exception-classify", "a-root-cause", "a-sap-connector", "a-hitl", "a-scer-evals", "a-field-dispatch"],
  },
  {
    id: "c-brightpath-claims", name: "Claims Modernization Kit", ownerOrgId: "brightpath", curatorId: "u-arjun",
    blurb: "Brightpath's claims agents and connectors.",
    assetIds: ["a-claims-triage", "a-oracle", "a-expedite", "a-brightpath-guidewire"],
  },
];

const seededSprintDone = (day: number): Workspace["sprint"] => ({ day, blockers: [] });

export const SEED_WORKSPACES: Workspace[] = [
  {
    id: "ws-kestrel-ap", name: "AP invoice exceptions", problem: "Clear invoice mismatches before payment runs.",
    ownerOrgId: "kestrel", customerOrgId: "kestrel", createdBy: "u-tomas", seeded: true,
    members: [
      { userId: "u-tomas", orgId: "kestrel", responsibilities: ["owner", "architecture", "integration"], joinedAt: 0 },
      { userId: "u-dana", orgId: "kestrel", responsibilities: ["acceptance"], joinedAt: 0 },
    ],
    blueprintId: undefined, componentIds: ["a-three-way", "a-sap-connector", "a-hitl", "a-chat"],
    config: { ...DEFAULT_CONFIG, exceptionsPerMonth: 2600, plants: 1 },
    approvals: { "u-tomas": true, "u-dana": true }, sprint: seededSprintDone(10), activated: true, configured: true, createdSeq: 0,
    activity: [
      { seq: 0, actorId: "u-tomas", text: "Built from the community Invoice Three-Way Match skill", kind: "build" },
      { seq: 0, actorId: "u-dana", text: "Activated in production", kind: "activate" },
    ],
  },
  {
    id: "ws-halvorsen", name: "Cold-chain deviation agent", problem: "Disposition temperature excursions within one shift.",
    ownerOrgId: "halvorsen", customerOrgId: "halvorsen", createdBy: "u-elena", seeded: true,
    members: [
      { userId: "u-elena", orgId: "halvorsen", responsibilities: ["owner", "acceptance"], joinedAt: 0 },
      { userId: "u-priya", orgId: "google", responsibilities: ["architecture", "integration"], joinedAt: 0 },
    ],
    blueprintId: "a-capa", componentIds: ["a-halvorsen-coldchain", "a-bigquery", "a-hitl", "a-chat"],
    config: { ...DEFAULT_CONFIG, exceptionsPerMonth: 900, plants: 2 },
    approvals: { "u-elena": true }, sprint: { day: 7, blockers: [{ id: "b-h1", day: 6, text: "QMS export missing lot genealogy field", resolved: false, ownerOrgId: "halvorsen" }] },
    activated: false, configured: true, createdSeq: 0,
    activity: [
      { seq: 0, actorId: "u-elena", text: "Created workspace and invited Google Cloud", kind: "invite" },
      { seq: 0, actorId: "u-priya", text: "Selected Quality Deviation & CAPA blueprint", kind: "build" },
      { seq: 0, actorId: "u-elena", text: "Shared Halvorsen Cold-Chain Rules into this workspace", kind: "share" },
      { seq: 0, actorId: "u-priya", text: "Sprint day 7 — blocker raised on QMS export", kind: "sprint" },
    ],
  },
  {
    id: "ws-orion", name: "Carrier claims automation", problem: "Cut freight claim cycle time from 21 days to 5.",
    ownerOrgId: "orion", customerOrgId: "orion", createdBy: "u-kim", seeded: true,
    members: [
      { userId: "u-kim", orgId: "orion", responsibilities: ["owner", "acceptance"], joinedAt: 0 },
      { userId: "u-priya", orgId: "google", responsibilities: ["architecture"], joinedAt: 0 },
      { userId: "u-marcus", orgId: "lattice", responsibilities: ["integration"], joinedAt: 0 },
    ],
    blueprintId: "a-claims-triage", componentIds: ["a-edi", "a-orion-acceptance", "a-hitl", "a-chat"],
    config: { ...DEFAULT_CONFIG, exceptionsPerMonth: 3100, plants: 1 },
    approvals: { "u-kim": true, "u-priya": true, "u-marcus": true }, sprint: seededSprintDone(10), activated: true, configured: true, createdSeq: 0,
    activity: [
      { seq: 0, actorId: "u-kim", text: "Created workspace and invited Google Cloud and Lattice", kind: "invite" },
      { seq: 0, actorId: "u-marcus", text: "Added EDI X12 856 / ASN Connector", kind: "build" },
      { seq: 0, actorId: "u-kim", text: "Activated in production", kind: "activate" },
    ],
  },
];

/** Engagement days each seeded workspace took from kickoff to activation (for time-to-value metrics). */
export const SEED_DAYS_TO_ACTIVATE: Record<string, number> = { "ws-kestrel-ap": 31, "ws-orion": 12 };

/** Modeled economics constants (synthetic, labeled as modeled in the UI). */
export const ECON = {
  loadedHourlyRate: 68,
  monitoringPerPlantPerDay: 95,
  expediteAvoidedPerException: 11,
  /** Typical build time without reusable assets, days — the comparison baseline. */
  baselineBuildDays: 60,
};
