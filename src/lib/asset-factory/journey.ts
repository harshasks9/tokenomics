/**
 * The executive demo: ten steps, each a set of tasks performed by a specific
 * persona. Tasks are ordinary actions sent to the server, which authorizes
 * them exactly as it would any other request.
 */
/*
 * CLIENT-SAFE MODULE: imported by the browser bundle. It must never import
 * data.ts, policy.ts, engine.ts or model.ts at runtime — those hold assets the
 * signed-in persona may not be allowed to see. (Enforced by a test.)
 */
import type { Action, Config, Event, PersonaId } from "./types";

const SCER_BLUEPRINT = "a-scer-blueprint";

export const JOURNEY_WS_NAME = "Supply chain exception resolution";

export interface JourneyCtx {
  events: Event[];
  wsId: string | null;
  contributionId: string | null;
  config: Partial<Config>;
}

export interface JourneyTask {
  id: string;
  persona: PersonaId;
  label: string;
  /** Explicit consent copy for cross-organization actions. */
  consent?: string;
  /** What the server enforces here — the demo offers to try it as the wrong persona. */
  guarded?: string;
  action: (ctx: JourneyCtx) => Action | null;
  done: (ctx: JourneyCtx) => boolean;
}

export interface JourneyStep {
  n: number;
  id: string;
  title: string;
  lead: PersonaId;
  /** Lifecycle stage index this step belongs to. */
  stage: number;
  story: string;
  collaboration: Partial<Record<PersonaId, string>>;
  tasks: JourneyTask[];
  /** Which part of the step panel to show alongside the tasks. */
  focus: "asset" | "workspace" | "assembly" | "readiness" | "sprint" | "outcomes" | "contribution";
}

const has = (ctx: JourneyCtx, pred: (e: Event) => boolean) => ctx.events.some(pred);
const count = (ctx: JourneyCtx, pred: (e: Event) => boolean) => ctx.events.filter(pred).length;
const inWs = (ctx: JourneyCtx, a: Action) => "workspaceId" in a && a.workspaceId === ctx.wsId;

export function journeyContext(events: Event[], config: Partial<Config> = {}): JourneyCtx {
  const wsIdx = events.findIndex((e) => e.action.type === "workspace.create" && e.actorId === "u-dana" && e.action.name === JOURNEY_WS_NAME);
  const wsId = wsIdx >= 0 ? `ws-j${wsIdx + 1}` : null;
  const ctIdx = events.findIndex((e) => e.action.type === "contribution.propose" && e.action.workspaceId === wsId);
  return { events, wsId, contributionId: ctIdx >= 0 ? `ct-${ctIdx + 1}` : null, config };
}

const ws = (ctx: JourneyCtx) => ctx.wsId ?? "";

export const DEMO_CONFIG: Config = {
  plants: 4,
  exceptionsPerMonth: 4200,
  autoResolveLimit: 2500,
  approvalChannel: "Google Chat",
  regions: ["us-central1"],
};

export const CONTRIBUTION_DRAFT = {
  title: "Exception Resolution — SAP Discrete Manufacturing Pack",
  summary: "A ready-to-deploy variant of the reference blueprint for multi-plant discrete manufacturers on SAP: pre-tuned thresholds, supplier risk in the resolution step, and batched OData back-fill.",
  changes: [
    "Supplier risk score feeds the expedite-vs-re-source decision",
    "Per-plant auto-resolve thresholds parameterized (no plant identifiers)",
    "Batched OData back-fill pattern that resolved throttling in production",
    "Eval suite extended with 140 multi-plant scenarios (synthetic)",
  ],
};

export const JOURNEY: JourneyStep[] = [
  {
    n: 1, id: "discover", title: "Customer discovers a Supply Chain Exception Resolution Agent", lead: "customer", stage: 0, focus: "asset",
    story: "Kestrel Industrial loses line time every week to late and short supplier deliveries. Dana searches the marketplace for her problem and finds a Google-verified reference blueprint already running at 23 manufacturers — with prerequisites, security notes and modeled run cost on one page.",
    collaboration: { customer: "Searches by business problem and shortlists the blueprint" },
    tasks: [{
      id: "shortlist", persona: "customer", label: "Shortlist the blueprint",
      action: () => ({ type: "asset.shortlist", assetId: SCER_BLUEPRINT }),
      done: (c) => has(c, (e) => e.action.type === "asset.shortlist" && e.action.assetId === SCER_BLUEPRINT && e.actorId === "u-dana"),
    }],
  },
  {
    n: 2, id: "workspace", title: "Customer creates a Gemini 10 workspace and invites both FDEs", lead: "customer", stage: 0, focus: "workspace",
    story: "Dana opens a shared workspace. It is private to Kestrel until she explicitly grants access — first to Priya at Google Cloud for architecture, then to Marcus at Lattice for SAP integration. Neither can see Kestrel's private assets; they see only this workspace.",
    collaboration: { customer: "Owns the workspace and decides who gets in", google: "Invited as architecture lead", partner: "Invited as integration lead" },
    tasks: [
      {
        id: "create", persona: "customer", label: "Create the workspace",
        action: () => ({ type: "workspace.create", name: JOURNEY_WS_NAME, problem: "Resolve supply exceptions across four plants before they stop a line." }),
        done: (c) => Boolean(c.wsId),
      },
      {
        id: "invite-google", persona: "customer", guarded: "Only the workspace owner can grant cross-organization access.", label: "Invite Priya Raman (Google Cloud) — architecture",
        consent: "Grant Google Cloud access to this workspace only: architecture, configuration, evaluations and activity. Your other Kestrel assets stay private.",
        action: (c) => ({ type: "workspace.invite", workspaceId: ws(c), userId: "u-priya", responsibilities: ["architecture"] }),
        done: (c) => has(c, (e) => e.action.type === "workspace.invite" && inWs(c, e.action) && e.action.userId === "u-priya"),
      },
      {
        id: "invite-partner", persona: "customer", label: "Invite Marcus Oyelaran (Lattice) — integration",
        consent: "Grant Lattice Systems Integrators access to this workspace only. Lattice will not see your other workspaces or private assets.",
        action: (c) => ({ type: "workspace.invite", workspaceId: ws(c), userId: "u-marcus", responsibilities: ["integration"] }),
        done: (c) => has(c, (e) => e.action.type === "workspace.invite" && inWs(c, e.action) && e.action.userId === "u-marcus"),
      },
    ],
  },
  {
    n: 3, id: "blueprint", title: "Google FDE selects the reference blueprint", lead: "google", stage: 1, focus: "assembly",
    story: "Priya doesn't start from a blank page. She anchors the workspace on the verified blueprint, which brings its classification and root-cause skills, the SAP connector, the approval workflow and the eval suite with it.",
    collaboration: { google: "Chooses the reference architecture", customer: "Sees exactly what was added and why", partner: "Plans the SAP integration around it" },
    tasks: [{
      id: "select", persona: "google", label: "Select the verified reference blueprint",
      action: (c) => ({ type: "workspace.selectBlueprint", workspaceId: ws(c), assetId: SCER_BLUEPRINT }),
      done: (c) => has(c, (e) => e.action.type === "workspace.selectBlueprint" && inWs(c, e.action)),
    }],
  },
  {
    n: 4, id: "partner", title: "Partner FDE adds the SAP template and supplier-risk skills", lead: "partner", stage: 2, focus: "assembly",
    story: "Marcus brings Lattice's reusable IP: a public SAP integration template and Supplier Risk Scoring skill — and Lattice's private Tier-2 Disruption Signals, which he must explicitly share into this workspace before anyone else can use it.",
    collaboration: { partner: "Adds reusable integration IP and shares private IP under engagement terms", google: "Reviews fit with the blueprint", customer: "Sees evaluation scores move" },
    tasks: [
      {
        id: "sap", persona: "partner", label: "Add SAP Exception Integration Template",
        action: (c) => ({ type: "workspace.addComponent", workspaceId: ws(c), assetId: "a-sap-template" }),
        done: (c) => has(c, (e) => e.action.type === "workspace.addComponent" && inWs(c, e.action) && e.action.assetId === "a-sap-template"),
      },
      {
        id: "risk", persona: "partner", label: "Add Supplier Risk Scoring skill",
        action: (c) => ({ type: "workspace.addComponent", workspaceId: ws(c), assetId: "a-supplier-risk" }),
        done: (c) => has(c, (e) => e.action.type === "workspace.addComponent" && inWs(c, e.action) && e.action.assetId === "a-supplier-risk"),
      },
      {
        id: "share-tier2", persona: "partner", guarded: "Only Lattice can share Lattice-private IP.", label: "Share Lattice-private Tier-2 Signals into the workspace",
        consent: "Share Lattice's private “Tier-2 Supplier Disruption Signals” with this workspace's collaborators (Kestrel and Google). It stays hidden from the public marketplace.",
        action: (c) => ({ type: "asset.shareToWorkspace", workspaceId: ws(c), assetId: "a-tier2-signals" }),
        done: (c) => has(c, (e) => e.action.type === "asset.shareToWorkspace" && inWs(c, e.action) && e.action.assetId === "a-tier2-signals"),
      },
      {
        id: "tier2", persona: "partner", label: "Add Tier-2 Supplier Disruption Signals",
        action: (c) => ({ type: "workspace.addComponent", workspaceId: ws(c), assetId: "a-tier2-signals" }),
        done: (c) => has(c, (e) => e.action.type === "workspace.addComponent" && inWs(c, e.action) && e.action.assetId === "a-tier2-signals"),
      },
    ],
  },
  {
    n: 5, id: "assemble", title: "The team assembles and customizes the workflow", lead: "google", stage: 2, focus: "assembly",
    story: "Priya wires approvals into Google Chat and sets Kestrel's thresholds: four plants, ~4,200 exceptions a month, anything above the auto-resolve limit goes to a planner. Try a higher limit and watch the safety eval react.",
    collaboration: { google: "Configures thresholds and approval routing", customer: "Agrees acceptance criteria", partner: "Maps plant codes in SAP" },
    tasks: [
      {
        id: "chat", persona: "google", label: "Connect approvals in Google Chat",
        action: (c) => ({ type: "workspace.addComponent", workspaceId: ws(c), assetId: "a-chat" }),
        done: (c) => has(c, (e) => e.action.type === "workspace.addComponent" && inWs(c, e.action) && e.action.assetId === "a-chat"),
      },
      {
        id: "configure", persona: "google", label: "Apply Kestrel's thresholds and volumes",
        action: (c) => ({ type: "workspace.configure", workspaceId: ws(c), config: { ...DEMO_CONFIG, ...c.config } }),
        done: (c) => has(c, (e) => e.action.type === "workspace.configure" && inWs(c, e.action)),
      },
    ],
  },
  {
    n: 6, id: "readiness", title: "Everyone reviews deployment readiness and eval results", lead: "customer", stage: 2, focus: "readiness",
    story: "Readiness is a shared gate: six checks and five evaluations against Kestrel's acceptance thresholds. Each organization signs off for itself — and any later configuration change clears the sign-offs.",
    collaboration: { customer: "Signs off on acceptance criteria", google: "Signs off on architecture and safety", partner: "Signs off on integration" },
    tasks: [
      { id: "approve-customer", persona: "customer", label: "Dana signs off", action: (c) => ({ type: "workspace.approveReadiness", workspaceId: ws(c) }), done: (c) => approvedSinceConfig(c, "u-dana") },
      { id: "approve-google", persona: "google", label: "Priya signs off", action: (c) => ({ type: "workspace.approveReadiness", workspaceId: ws(c) }), done: (c) => approvedSinceConfig(c, "u-priya") },
      { id: "approve-partner", persona: "partner", label: "Marcus signs off", action: (c) => ({ type: "workspace.approveReadiness", workspaceId: ws(c) }), done: (c) => approvedSinceConfig(c, "u-marcus") },
    ],
  },
  {
    n: 7, id: "sprint", title: "The 10-day Gemini 10 engagement", lead: "google", stage: 3, focus: "sprint",
    story: "Priya runs the sprint. On day 4 the SAP back-fill hits OData throttling — a blocker owned by Lattice. Marcus resolves it with the batching pattern from his own template, and the team reaches go-live readiness on day 10.",
    collaboration: { google: "Runs the sprint and milestones", partner: "Owns and clears the integration blocker", customer: "Planners run acceptance testing on day 7" },
    tasks: [
      {
        id: "days-1-4", persona: "google", guarded: "Only the collaborator with the architecture responsibility runs the sprint.", label: "Run days 1–4",
        action: (c) => ({ type: "sprint.advance", workspaceId: ws(c), toDay: 10 }),
        done: (c) => count(c, (e) => e.action.type === "sprint.advance" && inWs(c, e.action)) >= 1,
      },
      {
        id: "blocker", persona: "partner", guarded: "Only the organization that owns a blocker can clear it.", label: "Resolve the day-4 SAP throttling blocker",
        action: (c) => ({ type: "sprint.resolveBlocker", workspaceId: ws(c), blockerId: "b-odata" }),
        done: (c) => has(c, (e) => e.action.type === "sprint.resolveBlocker" && inWs(c, e.action)),
      },
      {
        id: "days-5-10", persona: "google", label: "Run days 5–10",
        action: (c) => ({ type: "sprint.advance", workspaceId: ws(c), toDay: 10 }),
        done: (c) => count(c, (e) => e.action.type === "sprint.advance" && inWs(c, e.action)) >= 2,
      },
    ],
  },
  {
    n: 8, id: "activate", title: "Customer activates the agent and reviews outcomes", lead: "customer", stage: 4, focus: "outcomes",
    story: "Only Dana can put the agent into production. Once live, Kestrel sees what it gets: recurring executions, hours returned to planners, expedite freight avoided and modeled run cost — business value, not vendor targets.",
    collaboration: { customer: "Validates acceptance criteria and activates", google: "Sees activation and consumption in the FDE portfolio", partner: "Records a repeatable deployment" },
    tasks: [{
      id: "activate", persona: "customer", guarded: "Only the customer owner can put an agent into production.", label: "Validate and activate in production",
      action: (c) => ({ type: "workspace.activate", workspaceId: ws(c) }),
      done: (c) => has(c, (e) => e.action.type === "workspace.activate" && inWs(c, e.action)),
    }],
  },
  {
    n: 9, id: "propose", title: "Partner proposes a reusable improvement", lead: "partner", stage: 6, focus: "contribution",
    story: "What Lattice learned at Kestrel is valuable to every SAP manufacturer — but it was built in Kestrel's engagement. Marcus proposes a sanitized pack. An automatic scan checks it for customer identifiers and secrets before anyone else sees it.",
    collaboration: { partner: "Packages the improvement", customer: "Will decide whether it may leave the workspace", google: "Will review it for the marketplace" },
    tasks: [{
      id: "propose", persona: "partner", label: "Propose the SAP Discrete Manufacturing Pack",
      action: (c) => ({ type: "contribution.propose", workspaceId: ws(c), baseAssetId: SCER_BLUEPRINT, ...CONTRIBUTION_DRAFT }),
      done: (c) => Boolean(c.contributionId),
    }],
  },
  {
    n: 10, id: "publish", title: "Permission, review, then publish to the marketplace", lead: "customer", stage: 7, focus: "contribution",
    story: "Three keys, three organizations. Kestrel permits reuse. Google's Asset Review Board checks security and quality. Only then can Lattice publish — as a community asset credited to Lattice, clearly not a Google certification.",
    collaboration: { customer: "Grants permission to reuse", google: "Security and quality review", partner: "Publishes and maintains it" },
    tasks: [
      {
        id: "permit", persona: "customer", guarded: "Only the customer can permit reuse of work done in its engagement.", label: "Kestrel permits reuse",
        consent: "Allow Lattice to publish this improvement beyond your workspace. The scan confirms no Kestrel names, plant identifiers, data or credentials are included.",
        action: (c) => (c.contributionId ? { type: "contribution.approveCustomer", contributionId: c.contributionId } : null),
        done: (c) => has(c, (e) => e.action.type === "contribution.approveCustomer" && e.action.contributionId === c.contributionId),
      },
      {
        id: "review", persona: "google", guarded: "Marketplace review is reserved for the Google Asset Review Board.", label: "Google Asset Review Board approves",
        action: (c) => (c.contributionId ? { type: "contribution.review", contributionId: c.contributionId, approve: true } : null),
        done: (c) => has(c, (e) => e.action.type === "contribution.review" && e.action.contributionId === c.contributionId),
      },
      {
        id: "publish", persona: "partner", guarded: "Only the contributor can publish, and only after permission and review.", label: "Lattice publishes to the marketplace",
        action: (c) => (c.contributionId ? { type: "contribution.publish", contributionId: c.contributionId } : null),
        done: (c) => has(c, (e) => e.action.type === "contribution.publish" && e.action.contributionId === c.contributionId),
      },
    ],
  },
];

/** A sign-off counts only if no configuration change happened after it. */
function approvedSinceConfig(c: JourneyCtx, userId: string): boolean {
  let approved = false;
  for (const e of c.events) {
    if (!("workspaceId" in e.action) || e.action.workspaceId !== c.wsId) continue;
    if (e.action.type === "workspace.configure") approved = false;
    if (e.action.type === "workspace.approveReadiness" && e.actorId === userId) approved = true;
  }
  return approved;
}

export function journeyProgress(ctx: JourneyCtx) {
  const steps = JOURNEY.map((s) => ({ step: s, done: s.tasks.every((t) => t.done(ctx)) }));
  const current = steps.findIndex((s) => !s.done);
  return { steps, current: current === -1 ? JOURNEY.length : current, complete: current === -1 };
}

export function nextTask(ctx: JourneyCtx): { step: JourneyStep; task: JourneyTask } | null {
  for (const step of JOURNEY) {
    for (const task of step.tasks) if (!task.done(ctx)) return { step, task };
  }
  return null;
}

export const LIFECYCLE = [
  { id: "discover", label: "Discover", lead: "customer", line: "Customer discovers a workflow" },
  { id: "assemble", label: "Assemble", lead: "google", line: "Google and partner FDEs help assemble the solution" },
  { id: "configure", label: "Configure", lead: "partner", line: "Reusable skills and connectors are configured" },
  { id: "execute", label: "Execute", lead: "google", line: "The 10-day Gemini 10 engagement runs" },
  { id: "activate", label: "Activate", lead: "customer", line: "Customer validates and activates the agent" },
  { id: "run", label: "Run", lead: "customer", line: "Recurring agent execution drives business value" },
  { id: "expand", label: "Expand", lead: "google", line: "Consumption and expansion opportunities are identified" },
  { id: "contribute", label: "Contribute", lead: "partner", line: "Improvements flow back to the ecosystem, with permission" },
] as const;

export const SPRINT_PLAN = [
  "Kickoff, access and data contracts",
  "Connector wiring in a sandbox project",
  "Exception taxonomy mapped to plant codes",
  "Skill tuning on historical exceptions",
  "First full evaluation run",
  "Approval workflow and thresholds live",
  "Planner acceptance testing (UAT)",
  "Security and audit review",
  "Shadow mode on live exceptions",
  "Go-live readiness and handover",
];
