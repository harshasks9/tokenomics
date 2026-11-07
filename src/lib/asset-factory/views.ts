/**
 * Server-side projection: turns the full world into exactly what one persona
 * is allowed to receive. Anything not returned here never reaches the browser.
 */
import { COLLECTIONS, ECON, ORGS, PERSONA_USER, SEED_DAYS_TO_ACTIVATE, SEED_WORKSPACES, USERS } from "./data";
import { economics, evaluate, readiness, stageOf, workspaceAssetIds, type Economics, type EvalResult, type ReadinessCheck } from "./model";
import { canSeeWorkspace, canViewAsset, isGoogle, orgById, userById } from "./policy";
import { chainFor, contributionFiles, fileOf, filesFor, instructionPath, lineageFor, refOf, resolveFor, schemaFor, type LineageNode } from "./packages";
import { kebab } from "./skillmd";
import type {
  ActivityItem, Asset, AssetType, AssetVersion, Config, ContributionStatus, OrgKind, PersonaId, Responsibility, Sprint, TrustTier, User, Visibility, Workspace, World,
} from "./types";

export interface OrgRef { id: string; name: string; kind: OrgKind; verified: boolean }
export interface PersonRef { id: string; name: string; title: string; initials: string; org: OrgRef }

export interface AssetView {
  id: string;
  slug: string;
  /** slug@version — what you pin in `extends:` or an agent manifest. */
  ref: string;
  name: string;
  type: AssetType;
  summary: string;
  description: string;
  industries: string[];
  outcomes: string[];
  visibility: Visibility;
  trust: TrustTier;
  version: string;
  versions: AssetVersion[];
  reviews: { id: string; rating: number; text: string; at: string; reviewer: string; reviewerOrg: string }[];
  rating: number;
  ratingCount: number;
  forks: number;
  deployments: number;
  forkedFrom: { id: string; name: string } | null;
  prerequisites: string[];
  security: string[];
  costPerExecution: number;
  minutesSaved: number;
  tags: string[];
  provides: string[];
  requires: string[];
  includes: string[];
  updatedAt: string;
  /** null when the contributor chose anonymous attribution. */
  owner: OrgRef | null;
  ownerLabel: string;
  contributor: { name: string; title: string } | null;
  mine: boolean;
  sharedInto: { id: string; name: string }[];
  sensitive: boolean;
  isNew: boolean;
  extends: { id: string; ref: string; name: string } | null;
  children: number;
  files: string[];
  runnable: boolean;
}

export interface WorkspaceView {
  id: string;
  name: string;
  problem: string;
  owner: OrgRef;
  customer: OrgRef | null;
  myResponsibilities: Responsibility[];
  members: { person: PersonRef; responsibilities: Responsibility[]; approved: boolean }[];
  blueprintId: string | null;
  componentIds: string[];
  config: Config;
  configured: boolean;
  sprint: Sprint;
  activated: boolean;
  stage: number;
  activity: (Omit<ActivityItem, "actorId"> & { actor: string; actorOrg: string; actorKind: OrgKind })[];
  evals: EvalResult[];
  readiness: ReadinessCheck[];
  economics: Economics;
  daysToActivate: number | null;
  seeded: boolean;
}

export interface ContributionView {
  id: string;
  workspaceId: string;
  workspaceName: string;
  baseAsset: { id: string; name: string };
  proposer: PersonRef;
  title: string;
  summary: string;
  changes: string[];
  scan: { id: string; label: string; passed: boolean }[];
  status: ContributionStatus;
  customerApprovedBy: string | null;
  reviewedBy: string | null;
  publishedAssetId: string | null;
  /** The exact files that would be published, and agent.yaml's diff against the base package. */
  preview: { files: { path: string; content: string }[]; baseManifest: string };
  canApproveCustomer: boolean;
  canReview: boolean;
  canPublish: boolean;
}

export interface MetricCard { id: string; label: string; value: string; sub: string; internal?: boolean }

export interface GtmView {
  portfolio: { id: string; name: string; customer: string; stage: number; consumptionPerMonth: number; annualized: number; activated: boolean }[];
  runRate: number;
  pipeline: { account: string; opportunity: string; incrementalPerMonth: number; basis: string }[];
  topReused: { id: string; name: string; deployments: number; owner: string; trust: TrustTier }[];
}

export interface PlatformView {
  seq: number;
  actor: { persona: PersonaId; person: PersonRef };
  assets: AssetView[];
  workspaces: WorkspaceView[];
  contributions: ContributionView[];
  collections: { id: string; name: string; blurb: string; owner: OrgRef; curator: string; mine: boolean; assetIds: string[] }[];
  shortlist: string[];
  directory: PersonRef[];
  metrics: MetricCard[];
  recommendedNext: { assetId: string; reason: string }[];
  /** Present only for Google personas. */
  gtm?: GtmView;
}

const orgRef = (id: string): OrgRef => {
  const o = orgById.get(id) ?? ORGS[0];
  return { id: o.id, name: o.name, kind: o.kind, verified: o.verified };
};

export const personRef = (u: User): PersonRef => ({ id: u.id, name: u.name, title: u.title, initials: u.initials, org: orgRef(u.orgId) });

function projectAsset(a: Asset, viewer: User, world: World): AssetView {
  const mine = a.ownerOrgId === viewer.orgId;
  const anonymous = a.attribution === "anonymous" && !mine;
  const orgOnly = a.attribution === "org" && !mine;
  const owner = orgById.get(a.ownerOrgId)!;
  const contributor = userById.get(a.contributorId);
  const kindLabel = owner.kind === "google" ? "Google" : owner.kind === "partner" ? "partner" : "customer";
  const reviews = a.reviews.map((r) => {
    const u = userById.get(r.userId);
    return { id: r.id, rating: r.rating, text: r.text, at: r.at, reviewer: u?.name ?? "Platform user", reviewerOrg: u ? orgById.get(u.orgId)?.name ?? "" : "" };
  });
  const sum = a.ratingSeed.sum + a.reviews.reduce((s, r) => s + r.rating, 0);
  const count = a.ratingSeed.count + a.reviews.length;
  const forked = a.forkedFromId ? world.assets.find((x) => x.id === a.forkedFromId) : undefined;
  const parent = a.extendsRef ? world.assets.find((x) => x.id === a.extendsRef!.assetId) : undefined;
  const paths = filesFor(a).map((f) => f.path);
  return {
    id: a.id, slug: a.slug, ref: refOf(a), name: a.name, type: a.type, summary: a.summary, description: a.description,
    industries: a.industries, outcomes: a.outcomes, visibility: a.visibility, trust: a.trust,
    version: a.versions.at(-1)?.version ?? "0.1", versions: a.versions, reviews,
    rating: count ? Math.round((sum / count) * 10) / 10 : 0, ratingCount: count,
    forks: a.forks, deployments: a.deployments,
    forkedFrom: forked && canViewAsset(viewer, forked, world) ? { id: forked.id, name: forked.name } : null,
    prerequisites: a.prerequisites, security: a.security,
    costPerExecution: a.costPer1k / 1000, minutesSaved: a.minutesSaved, tags: a.tags,
    provides: a.provides ?? [], requires: a.requires ?? [],
    includes: (a.includes ?? []).filter((id) => {
      const x = world.assets.find((y) => y.id === id);
      return x ? canViewAsset(viewer, x, world) : false;
    }),
    updatedAt: a.updatedAt,
    owner: anonymous ? null : orgRef(a.ownerOrgId),
    ownerLabel: anonymous ? `Verified ${kindLabel} · ${owner.industry ?? "community"}` : owner.name,
    contributor: anonymous || orgOnly || !contributor ? null : { name: contributor.name, title: contributor.title },
    mine,
    sharedInto: a.sharedWorkspaceIds
      .map((id) => world.workspaces.find((w) => w.id === id))
      .filter((w): w is Workspace => Boolean(w && canSeeWorkspace(viewer, w)))
      .map((w) => ({ id: w.id, name: w.name })),
    sensitive: Boolean(a.sensitive),
    isNew: a.id.startsWith("a-ct") || a.id.startsWith("a-u"),
    extends: parent && canViewAsset(viewer, parent, world) ? { id: parent.id, ref: `${parent.slug}@${a.extendsRef!.version}`, name: parent.name } : null,
    children: world.assets.filter((c) => (c.extendsRef?.assetId === a.id || c.forkedFromId === a.id) && canViewAsset(viewer, c, world)).length,
    files: paths,
    runnable: paths.includes("examples/sample-input.json") || (a.type === "skill" && paths.includes("SKILL.md")),
  };
}

function daysToActivate(ws: Workspace): number | null {
  if (!ws.activated) return null;
  // Journey workspaces: two days of assembly before the 10-day sprint.
  return SEED_DAYS_TO_ACTIVATE[ws.id] ?? 12;
}

function projectWorkspace(ws: Workspace, viewer: User, world: World, map: Map<string, Asset>): WorkspaceView {
  const me = ws.members.find((m) => m.userId === viewer.id);
  return {
    id: ws.id, name: ws.name, problem: ws.problem, owner: orgRef(ws.ownerOrgId),
    customer: ws.customerOrgId ? orgRef(ws.customerOrgId) : null,
    myResponsibilities: me?.responsibilities ?? [],
    members: ws.members.map((m) => ({ person: personRef(userById.get(m.userId)!), responsibilities: m.responsibilities, approved: Boolean(ws.approvals[m.userId]) })),
    blueprintId: ws.blueprintId ?? null,
    componentIds: ws.componentIds,
    config: ws.config, configured: ws.configured, sprint: ws.sprint, activated: ws.activated,
    stage: stageOf(ws, world.contributions),
    activity: [...ws.activity].reverse().map((a) => {
      const u = userById.get(a.actorId)!;
      const o = orgById.get(u.orgId)!;
      return { seq: a.seq, text: a.text, kind: a.kind, actor: u.name, actorOrg: o.name, actorKind: o.kind };
    }),
    evals: evaluate(ws, map),
    readiness: readiness(ws, map),
    economics: economics(ws, map),
    daysToActivate: daysToActivate(ws),
    seeded: Boolean(ws.seeded),
  };
}

const fmtUsd = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}k` : `$${Math.round(n)}`);
const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

function metricsFor(persona: PersonaId, viewer: User, world: World, map: Map<string, Asset>): MetricCard[] {
  if (persona === "customer") {
    const mine = world.workspaces.filter((w) => w.customerOrgId === viewer.orgId && canSeeWorkspace(viewer, w));
    const live = mine.filter((w) => w.activated);
    const econ = live.map((w) => economics(w, map));
    const value = econ.reduce((s, e) => s + e.valuePerMonth, 0);
    const cost = econ.reduce((s, e) => s + e.consumptionPerMonth, 0);
    const execs = econ.reduce((s, e) => s + e.executionsPerMonth, 0);
    const ttv = live.map(daysToActivate).filter((x): x is number => x !== null);
    return [
      { id: "ttv", label: "Time to value", value: ttv.length ? `${Math.min(...ttv)} days` : "—", sub: ttv.length > 1 ? `fastest of ${ttv.length} agents · first took ${Math.max(...ttv)}` : "kickoff to production" },
      { id: "outcomes", label: "Business outcomes", value: `${fmtUsd(value)}/mo`, sub: "modeled labor + expedite savings" },
      { id: "agents", label: "Production agents", value: String(live.length), sub: `${mine.length - live.length} in progress` },
      { id: "execs", label: "Workflow executions", value: `${execs.toLocaleString("en-US")}/mo`, sub: "recurring agent runs" },
      { id: "roi", label: "ROI", value: cost ? `${(value / cost).toFixed(1)}×` : "—", sub: `on ${fmtUsd(cost)}/mo modeled run cost` },
    ];
  }
  if (persona === "google") {
    const mine = world.workspaces.filter((w) => canSeeWorkspace(viewer, w));
    const live = mine.filter((w) => w.activated);
    const ids = mine.flatMap(workspaceAssetIds);
    const reused = ids.filter((id) => map.get(id)?.visibility === "public").length;
    const consumption = live.reduce((s, w) => s + economics(w, map).consumptionPerMonth, 0);
    const baseline = seededGoogleConsumption(viewer, map);
    const growth = baseline ? ((consumption - baseline) / baseline) * 100 : 0;
    return [
      { id: "ttd", label: "Time to deployment", value: live.length ? `${median(live.map((w) => daysToActivate(w)!))} days` : "—", sub: `median · ${ECON.baselineBuildDays}-day build without reuse` },
      { id: "reuse", label: "Asset reuse", value: ids.length ? `${Math.round((reused / ids.length) * 100)}%` : "—", sub: `${reused} of ${ids.length} components from the marketplace` },
      { id: "activation", label: "Customer activation", value: `${live.length} of ${mine.length}`, sub: "engagements live in production" },
      { id: "growth", label: "Consumption growth", value: `${growth >= 0 ? "+" : ""}${Math.round(growth)}%`, sub: `${fmtUsd(consumption)}/mo across your live agents`, internal: true },
      { id: "arr", label: "Recurring AI revenue", value: fmtUsd(consumption * 12), sub: "annualized modeled run-rate · internal", internal: true },
    ];
  }
  // partner
  const engagements = world.workspaces.filter((w) => w.members.some((m) => m.orgId === viewer.orgId) && canSeeWorkspace(viewer, w));
  const live = engagements.filter((w) => w.activated);
  const ours = world.assets.filter((a) => a.ownerOrgId === viewer.orgId);
  const publicOurs = ours.filter((a) => a.visibility === "public");
  const ids = engagements.flatMap(workspaceAssetIds);
  const fromCatalog = ids.filter((id) => {
    const a = map.get(id);
    return a && (a.visibility === "public" || a.ownerOrgId === viewer.orgId);
  }).length;
  const avgDays = live.length ? live.reduce((s, w) => s + (daysToActivate(w) ?? 0), 0) / live.length : 0;
  return [
    { id: "efficiency", label: "Delivery efficiency", value: live.length ? `${Math.round(ECON.baselineBuildDays - avgDays)} days saved` : "—", sub: "per deployment vs from-scratch build" },
    { id: "adoption", label: "Reusable IP adoption", value: String(publicOurs.reduce((s, a) => s + a.deployments, 0)), sub: `deployments of ${publicOurs.length} published assets` },
    { id: "deployments", label: "Customer deployments", value: String(live.length), sub: `${engagements.length - live.length} engagement(s) in delivery` },
    { id: "solution", label: "Solution adoption", value: String(publicOurs.reduce((s, a) => s + a.forks, 0)), sub: "forks by other teams" },
    { id: "repeatable", label: "Repeatable delivery", value: ids.length ? `${Math.round((fromCatalog / ids.length) * 100)}%` : "—", sub: "of engagement components reused" },
  ];
}

function seededGoogleConsumption(viewer: User, map: Map<string, Asset>): number {
  // Baseline = the seeded live engagements this FDE already supports.
  return seedLive(viewer).reduce((s, w) => s + economics(w, map).consumptionPerMonth, 0);
}

function seedLive(viewer: User): Workspace[] {
  return SEED_WORKSPACES.filter((w) => w.activated && w.members.some((m) => m.userId === viewer.id));
}

function expansionFor(world: World, viewer: User, map: Map<string, Asset>) {
  // Expansion opportunities derive from live agents: adjacent blueprints on the same systems.
  const live = world.workspaces.filter((w) => w.activated && canSeeWorkspace(viewer, w));
  const out: { assetId: string; reason: string; account: string; incremental: number }[] = [];
  for (const w of live) {
    const customer = orgById.get(w.customerOrgId)?.name ?? "";
    if (w.blueprintId === "a-scer-blueprint") {
      out.push({ assetId: "a-supplier-onboarding", reason: "Runs on the same SAP connector and supplier risk data you already have live", account: customer, incremental: 7400 });
      out.push({ assetId: "a-capa", reason: "Quality holds are 18% of your exceptions — a CAPA agent closes the loop", account: customer, incremental: 9100 });
    }
    if (w.id === "ws-orion") out.push({ assetId: "a-expedite", reason: "Claims often trigger re-shipment; negotiate expedites automatically", account: customer, incremental: 2600 });
    if (w.id === "ws-kestrel-ap") out.push({ assetId: "a-scer-blueprint", reason: "Many invoice mismatches start as supply exceptions upstream", account: customer, incremental: 0 });
  }
  // Never recommend something the account already runs or is building.
  const inUse = (account: string) => new Set(world.workspaces.filter((w) => orgById.get(w.customerOrgId)?.name === account).flatMap(workspaceAssetIds));
  return out.filter((o) => {
    const a = map.get(o.assetId);
    return a && canViewAsset(viewer, a, world) && !inUse(o.account).has(o.assetId);
  });
}

export function buildView(world: World, persona: PersonaId): PlatformView {
  const viewer = userById.get(PERSONA_USER[persona])!;
  const map = new Map(world.assets.map((a) => [a.id, a]));
  const assets = world.assets.filter((a) => canViewAsset(viewer, a, world)).map((a) => projectAsset(a, viewer, world));
  const workspaces = world.workspaces.filter((w) => canSeeWorkspace(viewer, w)).map((w) => projectWorkspace(w, viewer, world, map));

  const contributions = world.contributions
    .filter((c) => {
      const ws = world.workspaces.find((w) => w.id === c.workspaceId);
      if (ws && canSeeWorkspace(viewer, ws)) return true;
      // The Google review board sees submissions once the customer has permitted reuse.
      return isGoogle(viewer) && c.status !== "proposed";
    })
    .map((c): ContributionView => {
      const ws = world.workspaces.find((w) => w.id === c.workspaceId)!;
      const base = map.get(c.baseAssetId)!;
      const isOwner = ws.customerOrgId === viewer.orgId && ws.members.some((m) => m.userId === viewer.id && m.responsibilities.includes("owner"));
      return {
        id: c.id, workspaceId: ws.id, workspaceName: canSeeWorkspace(viewer, ws) ? ws.name : "Customer engagement",
        baseAsset: { id: base.id, name: base.name }, proposer: personRef(userById.get(c.proposedBy)!),
        title: c.title, summary: c.summary, changes: c.changes, scan: c.scan, status: c.status,
        customerApprovedBy: c.customerApprovedBy ? userById.get(c.customerApprovedBy)!.name : null,
        reviewedBy: c.reviewedBy ? userById.get(c.reviewedBy)!.name : null,
        publishedAssetId: c.publishedAssetId ?? null,
        canApproveCustomer: c.status === "proposed" && isOwner,
        canReview: c.status === "customer-approved" && isGoogle(viewer) && c.proposedBy !== viewer.id,
        canPublish: c.status === "reviewed" && c.proposedBy === viewer.id,
        preview: {
          files: contributionFiles({
            base, slug: `${userById.get(c.proposedBy)!.orgId}/${kebab(c.title)}`, title: c.title, summary: c.summary, changes: c.changes,
            components: workspaceAssetIds(ws).filter((id) => id !== base.id && map.get(id)?.visibility === "public").map((id) => map.get(id)!),
            config: ws.config, author: userById.get(c.proposedBy)!,
          }),
          baseManifest: fileOf(base, "agent.yaml") ?? "",
        },
      };
    });

  const collections = COLLECTIONS.map((c) => ({
    id: c.id, name: c.name, blurb: c.blurb, owner: orgRef(c.ownerOrgId), curator: userById.get(c.curatorId)!.name,
    mine: c.ownerOrgId === viewer.orgId,
    assetIds: c.assetIds.filter((id) => {
      const a = map.get(id);
      return a ? canViewAsset(viewer, a, world) : false;
    }),
  }));

  // Invite directory: verified people across organizations (profiles are public; access is not).
  const directory = USERS.filter((u) => u.id !== viewer.id).map(personRef);

  const expansion = expansionFor(world, viewer, map);
  const view: PlatformView = {
    seq: world.seq,
    actor: { persona, person: personRef(viewer) },
    assets, workspaces, contributions, collections,
    shortlist: world.shortlists[viewer.id] ?? [],
    directory,
    metrics: metricsFor(persona, viewer, world, map),
    // Customers and partners get the recommendation, never the modeled revenue behind it.
    recommendedNext: expansion.map(({ assetId, reason }) => ({ assetId, reason })),
  };

  if (isGoogle(viewer)) {
    const mine = world.workspaces.filter((w) => canSeeWorkspace(viewer, w));
    const portfolio = mine.map((w) => {
      const e = economics(w, map);
      return {
        id: w.id, name: w.name, customer: orgById.get(w.customerOrgId)?.name ?? "—", stage: stageOf(w, world.contributions),
        consumptionPerMonth: w.activated ? e.consumptionPerMonth : 0, annualized: e.consumptionPerMonth * 12, activated: w.activated,
      };
    });
    view.gtm = {
      portfolio,
      runRate: portfolio.filter((p) => p.activated).reduce((s, p) => s + p.annualized, 0),
      pipeline: expansion.filter((e) => e.incremental > 0).map((e) => ({ account: e.account, opportunity: map.get(e.assetId)!.name, incrementalPerMonth: e.incremental, basis: e.reason })),
      topReused: [...world.assets].filter((a) => a.visibility === "public").sort((a, b) => b.deployments - a.deployments).slice(0, 8)
        .map((a) => ({ id: a.id, name: a.name, deployments: a.deployments, owner: orgById.get(a.ownerOrgId)!.name, trust: a.trust })),
    };
  }
  return view;
}


// ── Asset detail (fetched on demand when an asset page opens) ─────────────

export interface AssetDetail {
  asset: AssetView;
  files: { path: string; content: string }[];
  mainFile: string | null;
  resolved: { md: string; chain: string[]; provenance: { heading: string; from: string[] }[]; overriddenParams: { key: string; from: string; to: string; by: string }[] } | null;
  schema: string | null;
  lineage: { ancestors: { id: string; slug: string; version: string; name: string }[]; tree: LineageNode };
  history: { version: string; at: string; author: string; note: string; path: string; before: string; after: string }[];
  install: string;
  /** Owner org may commit to this package. */
  canEdit: boolean;
  /** Sample input for "Try it" — own, else inherited from the nearest ancestor that has one. */
  sampleInput: string | null;
}

/** Returns null when the asset doesn't exist or the persona may not see it (indistinguishable on purpose). */
export function buildAssetDetail(world: World, persona: PersonaId, idOrSlug: string): AssetDetail | null {
  const viewer = userById.get(PERSONA_USER[persona])!;
  const a = world.assets.find((x) => x.id === idOrSlug || x.slug === idOrSlug);
  if (!a || !canViewAsset(viewer, a, world)) return null;
  const resolved = resolveFor(a, world, viewer);
  const verb = a.type === "skill" ? "skills add" : a.type === "blueprint" ? "agents init --from" : a.type === "connector" ? "connectors add" : a.type === "workflow" ? "workflows add" : "evals add";
  return {
    asset: projectAsset(a, viewer, world),
    files: filesFor(a).map((f) => ({ path: f.path, content: f.content })),
    mainFile: instructionPath(a) ?? null,
    resolved,
    schema: schemaFor(a, world, viewer) ?? null,
    lineage: lineageFor(a, world, viewer),
    history: [...(a.history ?? [])].reverse().map((h) => ({ version: h.version, at: h.at, author: userById.get(h.actorId)?.name ?? "", note: h.note, path: h.path, before: h.before, after: h.after })),
    install: `g10 ${verb} ${refOf(a)}`,
    canEdit: a.ownerOrgId === viewer.orgId,
    sampleInput: [...chainFor(a, world, viewer)].reverse().map((x) => fileOf(x, "examples/sample-input.json")).find(Boolean) ?? null,
  };
}
