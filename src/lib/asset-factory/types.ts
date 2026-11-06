/**
 * Gemini 10 Asset Factory — domain types.
 *
 * Everything here is synthetic demo data. The access model is real, though:
 * the server (src/app/api/asset-factory) replays the event log through
 * engine.ts, which authorizes every event, then projects the world through
 * views.ts so a persona only ever receives what policy.ts lets it see.
 */

export type PersonaId = "customer" | "google" | "partner";

export type OrgKind = "google" | "customer" | "partner";

export interface Org {
  id: string;
  name: string;
  kind: OrgKind;
  /** Verified contributor organization (identity verified — NOT an asset certification). */
  verified: boolean;
  industry?: string;
  blurb: string;
}

export interface User {
  id: string;
  name: string;
  title: string;
  orgId: string;
  initials: string;
}

export type Visibility = "public" | "org" | "workspace" | "internal";

/**
 * community — published by any verified contributor; not certified by Google.
 * field     — field-validated: running in production in ≥2 FDE-led engagements.
 * verified  — officially verified by Google (security review + eval baseline).
 */
export type TrustTier = "community" | "field" | "verified";

export type AssetType = "blueprint" | "skill" | "connector" | "workflow" | "evaluation";

export interface Review {
  id: string;
  userId: string;
  rating: number; // 1..5
  text: string;
  at: string; // ISO date
}

export interface AssetVersion {
  version: string;
  at: string;
  note: string;
}

export interface AssetFile {
  path: string;
  content: string;
}

export interface FileChange {
  version: string;
  at: string;
  actorId: string;
  note: string;
  path: string;
  before: string;
  after: string;
}

export interface Asset {
  id: string;
  /** namespace/name — the package address, e.g. google/exception-classification. */
  slug: string;
  name: string;
  type: AssetType;
  summary: string;
  description: string;
  industries: string[];
  outcomes: string[];
  ownerOrgId: string;
  contributorId: string;
  visibility: Visibility;
  /** Workspaces an owner explicitly shared this asset into (only meaningful for org/workspace assets). */
  sharedWorkspaceIds: string[];
  trust: TrustTier;
  versions: AssetVersion[];
  reviews: Review[];
  ratingSeed: { sum: number; count: number };
  forks: number;
  deployments: number;
  forkedFromId?: string;
  prerequisites: string[];
  security: string[];
  /** Modeled consumption per 1,000 executions, USD. */
  costPer1k: number;
  /** Modeled analyst minutes saved per execution. */
  minutesSaved: number;
  tags: string[];
  /** For connectors: system category. For blueprints: categories it needs. */
  provides?: string[];
  requires?: string[];
  /** Contains customer data or credentials — may never be published publicly. */
  sensitive?: boolean;
  /** How the contributor chose to be credited to people outside their org. */
  attribution: "named" | "org" | "anonymous";
  /** Components a blueprint brings with it when selected. */
  includes?: string[];
  /** Files for assets created on the platform; seed assets read theirs from content.ts. */
  files?: AssetFile[];
  /** Inheritance: this package `extends` another at a pinned version. */
  extendsRef?: { assetId: string; version: string };
  /** Commits made on the platform (edits to files). */
  history?: FileChange[];
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  ownerOrgId: string;
  curatorId: string;
  blurb: string;
  assetIds: string[];
}

export type Responsibility =
  | "owner"
  | "architecture"
  | "integration"
  | "acceptance"
  | "observer";

export interface Member {
  userId: string;
  orgId: string;
  responsibilities: Responsibility[];
  joinedAt: number; // event seq
}

export interface ActivityItem {
  seq: number;
  actorId: string;
  text: string;
  kind: "create" | "invite" | "share" | "build" | "review" | "sprint" | "activate" | "contribute" | "system";
}

export interface Config {
  autoResolveLimit: number; // USD — exceptions under this value resolve without approval
  approvalChannel: "Google Chat" | "Microsoft Teams" | "Email";
  plants: number;
  exceptionsPerMonth: number;
  regions: string[];
}

export interface Sprint {
  day: number; // 0 = not started, 10 = complete
  blockers: { id: string; day: number; text: string; resolved: boolean; ownerOrgId: string }[];
}

export interface Workspace {
  id: string;
  name: string;
  problem: string;
  ownerOrgId: string;
  customerOrgId: string;
  createdBy: string;
  members: Member[];
  blueprintId?: string;
  componentIds: string[];
  config: Config;
  approvals: Record<string, boolean>; // userId → approved readiness
  sprint: Sprint;
  activated: boolean;
  /** Team has customized thresholds/volumes and recorded acceptance criteria. */
  configured: boolean;
  activity: ActivityItem[];
  /** Event seq at creation, for time-to-value. */
  createdSeq: number;
  seeded?: boolean;
}

export type ContributionStatus =
  | "proposed"
  | "customer-approved"
  | "reviewed"
  | "published"
  | "rejected";

export interface Contribution {
  id: string;
  workspaceId: string;
  baseAssetId: string;
  proposedBy: string;
  title: string;
  summary: string;
  changes: string[];
  scan: { id: string; label: string; passed: boolean }[];
  status: ContributionStatus;
  customerApprovedBy?: string;
  reviewedBy?: string;
  publishedAssetId?: string;
}

export interface World {
  seq: number;
  assets: Asset[];
  workspaces: Workspace[];
  contributions: Contribution[];
  shortlists: Record<string, string[]>; // userId → assetIds
}

/** Every mutation is an event; the server re-authorizes each one on replay. */
export type Action =
  | { type: "asset.shortlist"; assetId: string }
  | { type: "asset.review"; assetId: string; rating: number; text: string }
  | { type: "asset.fork"; assetId: string }
  | { type: "asset.publish"; assetId: string; visibility: Visibility }
  | { type: "asset.shareToWorkspace"; assetId: string; workspaceId: string }
  | { type: "asset.inherit"; baseId: string; name: string; visibility: Visibility; skillMd: string; workspaceId?: string }
  | { type: "asset.edit"; assetId: string; path: string; content: string; note: string }
  | { type: "asset.create"; name: string; assetType: AssetType; summary: string; visibility: Visibility; workspaceId?: string; industries: string[] }
  | { type: "workspace.create"; name: string; problem: string }
  | { type: "workspace.invite"; workspaceId: string; userId: string; responsibilities: Responsibility[] }
  | { type: "workspace.selectBlueprint"; workspaceId: string; assetId: string }
  | { type: "workspace.addComponent"; workspaceId: string; assetId: string }
  | { type: "workspace.removeComponent"; workspaceId: string; assetId: string }
  | { type: "workspace.configure"; workspaceId: string; config: Partial<Config> }
  | { type: "workspace.approveReadiness"; workspaceId: string }
  | { type: "sprint.advance"; workspaceId: string; toDay?: number }
  | { type: "sprint.resolveBlocker"; workspaceId: string; blockerId: string }
  | { type: "workspace.activate"; workspaceId: string }
  | { type: "contribution.propose"; workspaceId: string; baseAssetId: string; title: string; summary: string; changes: string[] }
  | { type: "contribution.approveCustomer"; contributionId: string }
  | { type: "contribution.review"; contributionId: string; approve: boolean }
  | { type: "contribution.publish"; contributionId: string };

export interface Event {
  actorId: string;
  action: Action;
}

export interface Actor {
  persona: PersonaId;
  user: User;
  org: Org;
}
