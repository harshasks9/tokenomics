/**
 * Event engine. The world is the seed plus an ordered log of events; every
 * event is re-authorized against policy.ts whenever the log is replayed, so a
 * tampered or hand-written log cannot grant access the policy does not allow.
 *
 * Each handler checks everything first and only then mutates, so a denied
 * event leaves the world untouched.
 */
import { ASSETS, DEFAULT_CONFIG, PERSONA_USER, SCER_BLUEPRINT, SEED_WORKSPACES } from "./data";
import { evalsPass, evaluate, isReady, workspaceAssetIds } from "./model";
import {
  canSeeWorkspace, canViewAsset, deny, hasResponsibility, isGoogle, memberOf, orgById, scanForPublication,
  userById, visibleToAllMembers, PolicyError,
} from "./policy";
import { contributionFiles, fileOf, filesFor, inheritedFiles, refOf, starterFiles, versionOf } from "./packages";
import { bumpVersion, kebab, parseSkill } from "./skillmd";
import type { Action, Asset, Contribution, Event, User, Workspace, World } from "./types";

export const MAX_EVENTS = 400;

/** Only the three demo personas (plus the Google review board) can author events. */
const ACTORS = new Set<string>([...Object.values(PERSONA_USER), "u-jonah"]);

export function seedWorld(): World {
  return structuredClone({
    seq: 0,
    assets: ASSETS,
    workspaces: SEED_WORKSPACES,
    contributions: [] as Contribution[],
    shortlists: {} as Record<string, string[]>,
  });
}

function findAsset(world: World, id: string): Asset {
  return world.assets.find((a) => a.id === id) ?? deny("Asset not found.");
}

/** Not-found and not-allowed look the same to the caller, so existence never leaks. */
function viewableAsset(world: World, user: User, id: string): Asset {
  const a = world.assets.find((x) => x.id === id);
  if (!a || !canViewAsset(user, a, world)) deny("Asset not found or not shared with you.");
  return a;
}

function memberWorkspace(world: World, user: User, id: string): Workspace {
  const ws = world.workspaces.find((w) => w.id === id);
  if (!ws || !canSeeWorkspace(user, ws)) deny("Workspace not found or you are not a collaborator.");
  return ws;
}

function assetMap(world: World) {
  return new Map(world.assets.map((a) => [a.id, a]));
}

function log(ws: Workspace, world: World, actor: User, text: string, kind: Workspace["activity"][number]["kind"]) {
  ws.activity.push({ seq: world.seq, actorId: actor.id, text, kind });
}

function uniqueSlug(world: World, orgId: string, name: string): string {
  const base = `${orgId}/${kebab(name) || "asset"}`;
  let slug = base;
  for (let i = 2; world.assets.some((a) => a.slug === slug); i++) slug = `${base}-${i}`;
  return slug;
}

const MAX_FILE = 40_000;

function scanOrDeny(text: string, orgId: string) {
  const failed = scanForPublication(text, orgId).filter((s) => !s.passed);
  if (failed.length) deny(`Publication scan failed — ${failed.map((f) => f.label).join("; ")}.`);
}

function addComponentChecked(world: World, ws: Workspace, asset: Asset) {
  if (asset.visibility === "internal" && ws.members.some((m) => m.orgId !== "google")) {
    deny(`"${asset.name}" is Google Internal and cannot be used in a workspace with external collaborators.`);
  }
  if (!visibleToAllMembers(asset, ws, world)) {
    deny(`"${asset.name}" is private to ${orgById.get(asset.ownerOrgId)?.name}. Share it into this workspace first — sharing is an explicit permission.`);
  }
  if (!ws.componentIds.includes(asset.id) && ws.blueprintId !== asset.id) ws.componentIds.push(asset.id);
}

function apply(world: World, actor: User, action: Action): void {
  switch (action.type) {
    case "asset.shortlist": {
      const a = viewableAsset(world, actor, action.assetId);
      const list = world.shortlists[actor.id] ?? [];
      world.shortlists[actor.id] = list.includes(a.id) ? list.filter((x) => x !== a.id) : [...list, a.id];
      return;
    }

    case "asset.review": {
      const a = viewableAsset(world, actor, action.assetId);
      if (a.ownerOrgId === actor.orgId) deny("You can't review your own organization's asset.");
      const rating = Math.round(action.rating);
      if (!(rating >= 1 && rating <= 5)) deny("Rating must be 1–5.");
      const text = String(action.text ?? "").slice(0, 400).trim();
      a.reviews = a.reviews.filter((r) => r.userId !== actor.id);
      a.reviews.push({ id: `rv-${world.seq}`, userId: actor.id, rating, text, at: new Date(Date.UTC(2026, 10, 6)).toISOString().slice(0, 10) });
      return;
    }

    case "asset.fork": {
      const a = viewableAsset(world, actor, action.assetId);
      if (a.sensitive && a.ownerOrgId !== actor.orgId) deny("Confidential assets can't be forked outside their owner.");
      const fork: Asset = {
        ...structuredClone(a),
        id: `a-u${world.seq}`,
        slug: uniqueSlug(world, actor.orgId, a.name),
        name: `${a.name} (fork)`,
        files: structuredClone(filesFor(a)),
        history: [],
        ownerOrgId: actor.orgId,
        contributorId: actor.id,
        visibility: a.visibility === "internal" ? "internal" : "org",
        sharedWorkspaceIds: [],
        trust: "community",
        forkedFromId: a.id,
        versions: [{ version: "0.1", at: "2026-11-06", note: `Forked from ${a.name} ${a.versions.at(-1)?.version ?? ""}`.trim() }],
        reviews: [],
        ratingSeed: { sum: 0, count: 0 },
        forks: 0,
        deployments: 0,
        attribution: "named",
        updatedAt: "2026-11-06",
      };
      a.forks += 1;
      world.assets.push(fork);
      return;
    }

    case "asset.publish": {
      const a = viewableAsset(world, actor, action.assetId);
      if (a.ownerOrgId !== actor.orgId) deny("Only the owning organization can change an asset's visibility.");
      if (action.visibility === "public") {
        if (a.sensitive) deny("This asset is marked confidential (customer data or GTM material) and can never be published publicly.");
        if (a.visibility === "workspace") deny("Workspace assets reach the marketplace only through a contribution, with customer permission and review.");
        if (a.visibility === "internal" && !isGoogle(actor)) deny("Only Google can release an internal asset.");
        scanOrDeny([a.name, a.summary, a.description, ...filesFor(a).map((f) => f.content)].join("\n"), actor.orgId);
        if (a.extendsRef) {
          const parent = world.assets.find((x) => x.id === a.extendsRef!.assetId);
          if (parent && parent.visibility !== "public") deny(`It inherits from “${parent.name}”, which isn't public — a child can't be more visible than its parent.`);
        }
      } else if (action.visibility === "internal" && !isGoogle(actor)) {
        deny("Only Google employees can classify assets as Google Internal.");
      } else if (action.visibility === "workspace") {
        deny("Use “Share to workspace” to make an asset available to a workspace.");
      }
      a.visibility = action.visibility;
      return;
    }

    case "asset.shareToWorkspace": {
      const a = viewableAsset(world, actor, action.assetId);
      const ws = memberWorkspace(world, actor, action.workspaceId);
      if (a.ownerOrgId !== actor.orgId) deny(`Only ${orgById.get(a.ownerOrgId)?.name ?? "the owner"} can share this asset.`);
      if (a.visibility === "internal" && ws.members.some((m) => m.orgId !== "google")) deny("Google Internal assets can't be shared with external collaborators.");
      if (a.visibility === "public") deny("Public assets are already available to every collaborator.");
      if (!a.sharedWorkspaceIds.includes(ws.id)) a.sharedWorkspaceIds.push(ws.id);
      log(ws, world, actor, `Shared ${orgById.get(actor.orgId)?.name}'s private “${a.name}” into this workspace`, "share");
      return;
    }

    case "asset.create": {
      const name = String(action.name ?? "").trim().slice(0, 90);
      const summary = String(action.summary ?? "").trim().slice(0, 300);
      if (name.length < 3) deny("Give the asset a name.");
      if (!["blueprint", "skill", "connector", "workflow", "evaluation"].includes(action.assetType)) deny("Unknown asset type.");
      let shared: string[] = [];
      if (action.visibility === "internal" && !isGoogle(actor)) deny("Only Google employees can create Google Internal assets.");
      if (action.visibility === "workspace") {
        if (!action.workspaceId) deny("Choose a workspace.");
        shared = [memberWorkspace(world, actor, action.workspaceId).id];
      }
      if (action.visibility === "public") {
        const failed = scanForPublication(`${name}\n${summary}`, actor.orgId).filter((s) => !s.passed);
        if (failed.length) deny(`Publication scan failed — ${failed.map((f) => f.label).join("; ")}.`);
      }
      const created: Asset = {
        id: `a-u${world.seq}`, slug: uniqueSlug(world, actor.orgId, name), name, type: action.assetType, summary, description: summary,
        industries: (action.industries ?? []).slice(0, 4).map(String), outcomes: [],
        ownerOrgId: actor.orgId, contributorId: actor.id, visibility: action.visibility, sharedWorkspaceIds: shared,
        trust: "community", versions: [{ version: "0.1", at: "2026-11-06", note: "First contribution" }], reviews: [],
        ratingSeed: { sum: 0, count: 0 }, forks: 0, deployments: 0, prerequisites: [], security: [],
        costPer1k: 100, minutesSaved: 3, tags: [], attribution: "named", updatedAt: "2026-11-06", history: [],
      };
      created.files = starterFiles(created, actor);
      world.assets.push(created);
      if (shared[0]) log(world.workspaces.find((w) => w.id === shared[0])!, world, actor, `Contributed “${name}” to this workspace`, "contribute");
      return;
    }

    case "asset.inherit": {
      const base = viewableAsset(world, actor, action.baseId);
      if (!["skill", "blueprint"].includes(base.type)) deny("Only skills and blueprints can be inherited. Fork other assets instead.");
      if (base.sensitive && base.ownerOrgId !== actor.orgId) deny("Confidential assets can't be inherited outside their owner.");
      const name = String(action.name ?? "").trim().slice(0, 90);
      if (name.length < 3) deny("Name your skill.");
      const md = String(action.skillMd ?? "");
      if (md.length > MAX_FILE) deny("SKILL.md is too large.");
      const fm = parseSkill(md).frontmatter;
      if (!fm.extends) deny("The SKILL.md frontmatter must declare `extends:`.");
      const pinned = String(fm.extends);
      if (pinned !== refOf(base)) deny(`\`extends: ${pinned}\` doesn't match the asset you're inheriting (${refOf(base)}).`);
      let shared: string[] = [];
      if (action.visibility === "internal" && !isGoogle(actor)) deny("Only Google employees can create Google Internal assets.");
      if (action.visibility === "public") {
        if (base.visibility !== "public") deny("A child can't be more visible than its parent — the parent isn't public.");
        scanOrDeny(`${name}\n${md}`, actor.orgId);
      }
      if (action.visibility === "workspace") {
        if (!action.workspaceId) deny("Choose a workspace.");
        shared = [memberWorkspace(world, actor, action.workspaceId).id];
      }
      const child: Asset = {
        ...structuredClone(base),
        id: `a-u${world.seq}`,
        slug: uniqueSlug(world, actor.orgId, String(fm.name ?? name)),
        name,
        summary: String(fm.description ?? base.summary).slice(0, 300),
        description: `Inherits ${refOf(base)} and adds ${orgById.get(actor.orgId)?.name}'s own instructions and parameters.`,
        ownerOrgId: actor.orgId, contributorId: actor.id, visibility: action.visibility, sharedWorkspaceIds: shared,
        trust: "community", forkedFromId: base.id, extendsRef: { assetId: base.id, version: versionOf(base) },
        versions: [{ version: "0.1.0", at: "2026-11-06", note: `Inherits ${refOf(base)}` }],
        reviews: [], ratingSeed: { sum: 0, count: 0 }, forks: 0, deployments: 0, attribution: "named",
        includes: base.type === "blueprint" ? base.includes : undefined,
        files: inheritedFiles(base, md, actor), history: [], sensitive: false, updatedAt: "2026-11-06",
      };
      base.forks += 1;
      world.assets.push(child);
      return;
    }

    case "asset.edit": {
      const a = viewableAsset(world, actor, action.assetId);
      if (a.ownerOrgId !== actor.orgId) deny(`Only ${orgById.get(a.ownerOrgId)?.name ?? "the owner"} can commit to this package. Fork or inherit it to make your own version.`);
      const path = String(action.path ?? "");
      const content = String(action.content ?? "");
      const note = String(action.note ?? "").trim().slice(0, 160) || `Update ${path}`;
      if (!/^[\w./-]{1,120}$/.test(path) || path.includes("..")) deny("Invalid file path.");
      if (content.length > MAX_FILE) deny("File is too large.");
      const before = fileOf(a, path);
      if (before === undefined) deny("File not found in this package.");
      if (before === content) deny("No changes to commit.");
      if (path.endsWith(".json")) {
        try { JSON.parse(content); } catch { deny(`${path} isn't valid JSON.`); }
      }
      if (path === "SKILL.md") {
        const fm = parseSkill(content).frontmatter;
        const wasExtends = parseSkill(before).frontmatter.extends;
        if (String(fm.extends ?? "") !== String(wasExtends ?? "")) deny("Changing `extends:` re-parents the package — inherit the new parent instead.");
      }
      if (a.visibility === "public") scanOrDeny(content, actor.orgId);
      const files = structuredClone(filesFor(a)).map((f) => (f.path === path ? { ...f, content } : f));
      const version = bumpVersion(versionOf(a), "patch");
      a.files = files;
      a.versions.push({ version, at: "2026-11-06", note });
      (a.history ??= []).push({ version, at: "2026-11-06", actorId: actor.id, note, path, before, after: content });
      a.updatedAt = "2026-11-06";
      return;
    }

    case "workspace.create": {
      const name = String(action.name ?? "").trim().slice(0, 80);
      if (name.length < 3) deny("Name the workspace.");
      const customerOrg = orgById.get(actor.orgId)!;
      const ws: Workspace = {
        id: `ws-j${world.seq}`, name, problem: String(action.problem ?? "").slice(0, 240),
        ownerOrgId: actor.orgId, customerOrgId: customerOrg.kind === "customer" ? actor.orgId : "",
        createdBy: actor.id,
        members: [{ userId: actor.id, orgId: actor.orgId, responsibilities: ["owner", "acceptance"], joinedAt: world.seq }],
        componentIds: [], config: { ...DEFAULT_CONFIG }, approvals: {}, sprint: { day: 0, blockers: [] },
        activated: false, configured: false, activity: [], createdSeq: world.seq,
      };
      log(ws, world, actor, `Created the workspace — visible only to ${customerOrg.name} until someone is invited`, "create");
      world.workspaces.push(ws);
      return;
    }

    case "workspace.invite": {
      const ws = memberWorkspace(world, actor, action.workspaceId);
      if (!hasResponsibility(actor, ws, "owner")) deny("Only the workspace owner can invite collaborators — cross-organization access is the owner's decision.");
      const invitee = userById.get(action.userId) ?? deny("Unknown user.");
      if (memberOf(invitee, ws)) deny(`${invitee.name} is already a collaborator.`);
      const allowed = ["architecture", "integration", "acceptance", "observer"] as const;
      const responsibilities = (action.responsibilities ?? []).filter((r): r is (typeof allowed)[number] => (allowed as readonly string[]).includes(r));
      if (!responsibilities.length) deny("Assign at least one responsibility.");
      // Everything already in the workspace must be visible to the newcomer.
      const blocked = workspaceAssetIds(ws).map((id) => findAsset(world, id)).filter((a) => !canViewAsset(invitee, a, world) && !(a.visibility !== "internal" && a.sharedWorkspaceIds.includes(ws.id)));
      if (blocked.length) deny(`${invitee.name} can't be invited while the workspace uses assets they may not see: ${blocked.map((b) => b.name).join(", ")}.`);
      ws.members.push({ userId: invitee.id, orgId: invitee.orgId, responsibilities, joinedAt: world.seq });
      log(ws, world, actor, `Granted ${invitee.name} (${orgById.get(invitee.orgId)?.name}) access as ${responsibilities.join(" + ")}`, "invite");
      return;
    }

    case "workspace.selectBlueprint": {
      const ws = memberWorkspace(world, actor, action.workspaceId);
      if (!hasResponsibility(actor, ws, "architecture", "owner")) deny("Selecting the reference architecture needs the architecture responsibility.");
      const bp = viewableAsset(world, actor, action.assetId);
      if (bp.type !== "blueprint") deny("That asset isn't a blueprint.");
      if (!visibleToAllMembers(bp, ws, world)) deny(`"${bp.name}" isn't visible to every collaborator, so it can't anchor this workspace.`);
      ws.blueprintId = bp.id;
      ws.componentIds = ws.componentIds.filter((c) => c !== bp.id);
      const added: string[] = [];
      for (const id of bp.includes ?? []) {
        const c = world.assets.find((a) => a.id === id);
        if (c && visibleToAllMembers(c, ws, world) && !ws.componentIds.includes(id)) {
          ws.componentIds.push(id);
          added.push(c.name);
        }
      }
      log(ws, world, actor, `Selected reference blueprint “${bp.name}”${added.length ? ` with ${added.length} bundled components` : ""}`, "build");
      return;
    }

    case "workspace.addComponent": {
      const ws = memberWorkspace(world, actor, action.workspaceId);
      if (!hasResponsibility(actor, ws, "architecture", "integration", "owner")) deny("Adding components needs the architecture or integration responsibility.");
      if (ws.activated) deny("The agent is live — propose changes as a new version instead.");
      const a = viewableAsset(world, actor, action.assetId);
      if (a.type === "blueprint") deny("Use “Select blueprint” for blueprints.");
      addComponentChecked(world, ws, a);
      log(ws, world, actor, `Added ${a.type} “${a.name}”`, "build");
      return;
    }

    case "workspace.removeComponent": {
      const ws = memberWorkspace(world, actor, action.workspaceId);
      if (!hasResponsibility(actor, ws, "architecture", "integration", "owner")) deny("Removing components needs the architecture or integration responsibility.");
      if (ws.activated) deny("The agent is live — propose changes as a new version instead.");
      if (!ws.componentIds.includes(action.assetId)) deny("Not in this workspace.");
      ws.componentIds = ws.componentIds.filter((c) => c !== action.assetId);
      log(ws, world, actor, `Removed “${findAsset(world, action.assetId).name}”`, "build");
      return;
    }

    case "workspace.configure": {
      const ws = memberWorkspace(world, actor, action.workspaceId);
      if (!hasResponsibility(actor, ws, "architecture", "integration", "owner")) deny("Configuration needs the architecture, integration or owner responsibility.");
      if (ws.activated) deny("The agent is live — configuration is locked.");
      const c = action.config ?? {};
      const next = { ...ws.config };
      if (c.autoResolveLimit !== undefined) next.autoResolveLimit = Math.max(0, Math.min(20000, Math.round(Number(c.autoResolveLimit) || 0)));
      if (c.plants !== undefined) next.plants = Math.max(1, Math.min(12, Math.round(Number(c.plants) || 1)));
      if (c.exceptionsPerMonth !== undefined) next.exceptionsPerMonth = Math.max(100, Math.min(50000, Math.round(Number(c.exceptionsPerMonth) || 100)));
      if (c.approvalChannel && ["Google Chat", "Microsoft Teams", "Email"].includes(c.approvalChannel)) next.approvalChannel = c.approvalChannel;
      ws.config = next;
      ws.configured = true;
      // Any change invalidates prior sign-offs.
      ws.approvals = {};
      log(ws, world, actor, `Customized workflow: ${next.plants} plants, ${next.exceptionsPerMonth.toLocaleString("en-US")} exceptions/mo, auto-resolve under $${next.autoResolveLimit.toLocaleString("en-US")}, approvals in ${next.approvalChannel}`, "build");
      return;
    }

    case "workspace.approveReadiness": {
      const ws = memberWorkspace(world, actor, action.workspaceId);
      const map = assetMap(world);
      if (!ws.blueprintId) deny("Nothing to approve yet — select a blueprint first.");
      if (!isReady(ws, map)) {
        const failing = evaluate(ws, map).filter((e) => !e.pass).map((e) => e.label);
        deny(`Readiness checks are not all green${failing.length ? ` — failing evals: ${failing.join(", ")}` : ""}.`);
      }
      if (ws.approvals[actor.id]) deny("You've already signed off.");
      ws.approvals[actor.id] = true;
      log(ws, world, actor, "Signed off deployment readiness and evaluation results", "review");
      return;
    }

    case "sprint.advance": {
      const ws = memberWorkspace(world, actor, action.workspaceId);
      if (!hasResponsibility(actor, ws, "architecture")) deny("The 10-day sprint is run by the collaborator with the architecture responsibility.");
      if (!ws.members.every((m) => ws.approvals[m.userId])) deny("Every collaborator must sign off readiness before the sprint starts.");
      if (ws.sprint.day >= 10) deny("The sprint is complete.");
      const open = ws.sprint.blockers.find((b) => !b.resolved);
      if (open) deny(`Day ${open.day} blocker is open: ${open.text}. ${orgById.get(open.ownerOrgId)?.name} owns it.`);
      const target = Math.min(10, Math.max(ws.sprint.day + 1, Math.round(Number(action.toDay ?? 10))));
      let day = ws.sprint.day;
      while (day < target) {
        day += 1;
        const partner = ws.members.find((m) => orgById.get(m.orgId)?.kind === "partner");
        if (day === 4 && ws.componentIds.includes("a-sap-template") && !ws.sprint.blockers.some((b) => b.id === "b-odata")) {
          ws.sprint.blockers.push({ id: "b-odata", day: 4, text: "SAP OData throttling on MRP exception reads during back-fill", resolved: false, ownerOrgId: partner?.orgId ?? ws.ownerOrgId });
          log(ws, world, actor, "Day 4 — blocker raised: SAP OData throttling during back-fill", "sprint");
          break;
        }
      }
      ws.sprint.day = day;
      log(ws, world, actor, day === 10 ? "Day 10 — sprint complete, go-live readiness confirmed" : `Advanced the sprint to day ${day}`, "sprint");
      return;
    }

    case "sprint.resolveBlocker": {
      const ws = memberWorkspace(world, actor, action.workspaceId);
      const b = ws.sprint.blockers.find((x) => x.id === action.blockerId) ?? deny("Blocker not found.");
      if (b.resolved) deny("Already resolved.");
      if (b.ownerOrgId !== actor.orgId) deny(`This blocker is owned by ${orgById.get(b.ownerOrgId)?.name}.`);
      b.resolved = true;
      log(ws, world, actor, `Resolved day ${b.day} blocker — switched back-fill to batched OData requests (from the SAP template v2.1)`, "sprint");
      return;
    }

    case "workspace.activate": {
      const ws = memberWorkspace(world, actor, action.workspaceId);
      if (!hasResponsibility(actor, ws, "owner")) deny("Only the customer owner can activate the agent in production.");
      if (ws.activated) deny("Already live.");
      if (ws.sprint.day < 10) deny("Finish the 10-day engagement first.");
      if (!evalsPass(ws, assetMap(world))) deny("Evaluation results are below the agreed acceptance thresholds.");
      ws.activated = true;
      for (const id of workspaceAssetIds(ws)) {
        const a = world.assets.find((x) => x.id === id);
        if (a) a.deployments += 1;
      }
      log(ws, world, actor, "Validated acceptance criteria and activated the agent in production", "activate");
      return;
    }

    case "contribution.propose": {
      const ws = memberWorkspace(world, actor, action.workspaceId);
      if (!ws.activated) deny("Propose improvements once the agent has been validated in production.");
      const base = viewableAsset(world, actor, action.baseAssetId);
      if (base.visibility !== "public") deny("Improvements must build on a public asset.");
      const title = String(action.title ?? "").trim().slice(0, 100);
      const summary = String(action.summary ?? "").trim().slice(0, 400);
      const changes = (action.changes ?? []).map((c) => String(c).slice(0, 200)).slice(0, 8);
      if (title.length < 3) deny("Give the improvement a title.");
      const scan = [
        ...scanForPublication([title, summary, ...changes].join("\n"), actor.orgId),
        { id: "confidential", label: "Customer-confidential and partner-private assets excluded", passed: true },
        { id: "evals", label: "Evaluation evidence attached from production engagement", passed: evalsPass(ws, assetMap(world)) },
      ];
      world.contributions.push({
        id: `ct-${world.seq}`, workspaceId: ws.id, baseAssetId: base.id, proposedBy: actor.id, title, summary, changes, scan, status: "proposed",
      });
      log(ws, world, actor, `Proposed “${title}” as a reusable improvement — awaiting customer permission`, "contribute");
      return;
    }

    case "contribution.approveCustomer": {
      const c = world.contributions.find((x) => x.id === action.contributionId) ?? deny("Contribution not found.");
      const ws = memberWorkspace(world, actor, c.workspaceId);
      if (!(actor.orgId === ws.customerOrgId && hasResponsibility(actor, ws, "owner"))) deny("Only the customer who owns the engagement can permit reuse of work done in it.");
      if (c.status !== "proposed") deny("This contribution isn't waiting for customer permission.");
      c.status = "customer-approved";
      c.customerApprovedBy = actor.id;
      log(ws, world, actor, `Permitted “${c.title}” to be shared beyond this workspace (no customer data included)`, "contribute");
      return;
    }

    case "contribution.review": {
      const c = world.contributions.find((x) => x.id === action.contributionId) ?? deny("Contribution not found.");
      if (!isGoogle(actor)) deny("Marketplace review is performed by the Google Asset Review Board.");
      if (c.proposedBy === actor.id) deny("Contributors can't review their own submission.");
      if (c.status !== "customer-approved") deny(c.status === "proposed" ? "Waiting for customer permission before review." : "Already reviewed.");
      if (action.approve && c.scan.some((s) => !s.passed)) deny("The publication scan has failures — it must be clean before approval.");
      c.status = action.approve ? "reviewed" : "rejected";
      c.reviewedBy = actor.id;
      const ws = world.workspaces.find((w) => w.id === c.workspaceId);
      if (ws) log(ws, world, actor, `${action.approve ? "Approved" : "Rejected"} “${c.title}” in marketplace security and quality review`, "review");
      return;
    }

    case "contribution.publish": {
      const c = world.contributions.find((x) => x.id === action.contributionId) ?? deny("Contribution not found.");
      if (c.proposedBy !== actor.id) deny("Only the contributor can publish their submission.");
      if (c.status !== "reviewed") deny(c.status === "published" ? "Already published." : "Publishing needs customer permission and marketplace review first.");
      const ws = world.workspaces.find((w) => w.id === c.workspaceId)!;
      const base = findAsset(world, c.baseAssetId);
      const includes = workspaceAssetIds(ws).filter((id) => id !== base.id && findAsset(world, id).visibility === "public");
      const id = `a-ct${world.seq}`;
      const slug = uniqueSlug(world, actor.orgId, c.title);
      world.assets.push({
        ...structuredClone(base),
        id, slug, name: c.title, summary: c.summary || base.summary,
        extendsRef: { assetId: base.id, version: versionOf(base) }, history: [],
        files: contributionFiles({
          base, slug, title: c.title, summary: c.summary, changes: c.changes,
          components: includes.map((x) => findAsset(world, x)), config: ws.config, author: actor,
        }),
        description: `${c.summary} Built and validated in a Gemini 10 engagement and contributed with the customer's permission. Changes: ${c.changes.join("; ")}.`,
        ownerOrgId: actor.orgId, contributorId: actor.id, visibility: "public", sharedWorkspaceIds: [], trust: "community",
        forkedFromId: base.id, includes, versions: [{ version: "1.0", at: "2026-11-06", note: "Published from a production engagement" }],
        reviews: [], ratingSeed: { sum: 0, count: 0 }, forks: 0, deployments: 1, attribution: "named",
        security: [...base.security, "Passed Google marketplace security review (community asset — not a Google certification)"],
        updatedAt: "2026-11-06",
      });
      c.status = "published";
      c.publishedAssetId = id;
      log(ws, world, actor, `Published “${c.title}” to the shared marketplace as a community asset`, "contribute");
      return;
    }

    default:
      deny("Unknown action.");
  }
}

export interface ReplayResult {
  world: World;
  /** Events that survived authorization (a tampered log is truncated at the first denial). */
  events: Event[];
  rejected?: { index: number; reason: string };
}

export function applyEvent(world: World, event: Event): void {
  if (!ACTORS.has(event.actorId)) deny("Unknown actor.");
  const actor = userById.get(event.actorId) ?? deny("Unknown actor.");
  if (!event.action || typeof event.action !== "object") deny("Malformed event.");
  world.seq += 1;
  try {
    apply(world, actor, event.action);
  } catch (e) {
    world.seq -= 1;
    throw e;
  }
}

/** Rebuild the world from the seed, authorizing every event in order. */
export function replay(events: Event[]): ReplayResult {
  const world = seedWorld();
  const accepted: Event[] = [];
  const list = Array.isArray(events) ? events.slice(0, MAX_EVENTS) : [];
  for (let i = 0; i < list.length; i++) {
    const snapshot = structuredClone(world);
    try {
      applyEvent(world, list[i]);
      accepted.push(list[i]);
    } catch (e) {
      const reason = e instanceof PolicyError ? e.message : "Malformed event.";
      return { world: snapshot, events: accepted, rejected: { index: i, reason } };
    }
  }
  return { world, events: accepted };
}

/** Try one new action as `actorId` on top of an already-replayed world. */
export function attempt(world: World, event: Event): { ok: true; world: World } | { ok: false; reason: string } {
  const next = structuredClone(world);
  try {
    applyEvent(next, event);
    return { ok: true, world: next };
  } catch (e) {
    return { ok: false, reason: e instanceof PolicyError ? e.message : "Something went wrong." };
  }
}

export { SCER_BLUEPRINT };
