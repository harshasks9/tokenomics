import { describe, expect, it } from "vitest";
import { attempt, replay } from "./engine";
import { JOURNEY, journeyContext, journeyProgress, nextTask } from "./journey";
import { PERSONA_USER } from "./data";
import { buildAssetDetail, buildView } from "./views";
import { runAsset } from "./run";
import type { Action, Event, PersonaId } from "./types";

/** Run the whole executive journey through the authorizing engine. */
function runJourney(stopAfterStep = JOURNEY.length): Event[] {
  let events: Event[] = [];
  for (let guard = 0; guard < 60; guard++) {
    const ctx = journeyContext(events);
    const next = nextTask(ctx);
    if (!next || next.step.n > stopAfterStep) break;
    const action = next.task.action(ctx);
    if (!action) throw new Error(`No action for ${next.task.id}`);
    const { world } = replay(events);
    const ev: Event = { actorId: PERSONA_USER[next.task.persona], action };
    const r = attempt(world, ev);
    if (!r.ok) throw new Error(`${next.step.n}/${next.task.id}: ${r.reason}`);
    events = [...events, ev];
  }
  return events;
}

const as = (persona: PersonaId, action: Action): Event => ({ actorId: PERSONA_USER[persona], action });
const view = (events: Event[], persona: PersonaId) => buildView(replay(events).world, persona);
const ids = (events: Event[], persona: PersonaId) => new Set(view(events, persona).assets.map((a) => a.id));
const wsOf = (events: Event[]) => journeyContext(events).wsId!;

describe("visibility", () => {
  it("hides Google Internal assets from customers and partners", () => {
    expect(ids([], "google").has("a-gtm-playbook")).toBe(true);
    expect(ids([], "customer").has("a-gtm-playbook")).toBe(false);
    expect(ids([], "partner").has("a-scer-preview")).toBe(false);
  });

  it("keeps organization-private assets inside their organization", () => {
    expect(ids([], "customer").has("a-kestrel-calendar")).toBe(true);
    expect(ids([], "partner").has("a-kestrel-calendar")).toBe(false);
    expect(ids([], "google").has("a-kestrel-calendar")).toBe(false);
    expect(ids([], "customer").has("a-tier2-signals")).toBe(false);
    expect(ids([], "customer").has("a-brightpath-guidewire")).toBe(false);
  });

  it("shows workspace-shared assets only to that workspace's collaborators", () => {
    // Priya collaborates with Halvorsen and Orion; Dana does neither.
    expect(ids([], "google").has("a-halvorsen-coldchain")).toBe(true);
    expect(ids([], "google").has("a-orion-acceptance")).toBe(true);
    expect(ids([], "partner").has("a-orion-acceptance")).toBe(true);
    expect(ids([], "partner").has("a-halvorsen-coldchain")).toBe(false);
    expect(ids([], "customer").has("a-orion-acceptance")).toBe(false);
  });

  it("returns GTM metrics only to Google", () => {
    expect(view([], "google").gtm).toBeDefined();
    expect(view([], "customer").gtm).toBeUndefined();
    expect(view([], "partner").gtm).toBeUndefined();
    expect(view([], "customer").metrics.some((m) => m.internal)).toBe(false);
    expect(view([], "partner").metrics.some((m) => m.internal)).toBe(false);
  });

  it("redacts anonymous contributors outside their organization", () => {
    const a = view([], "customer").assets.find((x) => x.id === "a-three-way")!;
    expect(a.owner).toBeNull();
    expect(a.contributor).toBeNull();
    expect(a.ownerLabel).toMatch(/Verified customer/);
    expect(a.slug.startsWith("community/")).toBe(true);
    expect(JSON.stringify(a)).not.toMatch(/halvorsen/i);
  });
});

describe("workspace collaboration", () => {
  const created = [as("customer", { type: "workspace.create", name: "Test", problem: "x" })];

  it("is invisible to other organizations until the owner invites them", () => {
    expect(view(created, "google").workspaces.some((w) => w.id === "ws-j1")).toBe(false);
    const invited = [...created, as("customer", { type: "workspace.invite", workspaceId: "ws-j1", userId: "u-priya", responsibilities: ["architecture"] })];
    expect(view(invited, "google").workspaces.some((w) => w.id === "ws-j1")).toBe(true);
    expect(view(invited, "partner").workspaces.some((w) => w.id === "ws-j1")).toBe(false);
  });

  it("only lets the owner invite", () => {
    const invited = [...created, as("customer", { type: "workspace.invite", workspaceId: "ws-j1", userId: "u-priya", responsibilities: ["architecture"] })];
    const r = attempt(replay(invited).world, as("google", { type: "workspace.invite", workspaceId: "ws-j1", userId: "u-marcus", responsibilities: ["integration"] }));
    expect(r.ok).toBe(false);
  });

  it("requires an explicit share before a private asset can be added", () => {
    const events = runJourney(3);
    const r = attempt(replay(events).world, as("partner", { type: "workspace.addComponent", workspaceId: wsOf(events), assetId: "a-tier2-signals" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/Share it into this workspace/);
  });

  it("never lets an internal asset into a cross-organization workspace", () => {
    const events = runJourney(3);
    const r = attempt(replay(events).world, as("google", { type: "workspace.addComponent", workspaceId: wsOf(events), assetId: "a-gtm-playbook" }));
    expect(r.ok).toBe(false);
  });

  it("does not leak another org's private asset through a crafted action", () => {
    const r = attempt(replay(created).world, as("customer", { type: "asset.fork", assetId: "a-tier2-signals" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/not found or not shared/);
  });
});

describe("executive journey", () => {
  it("runs end to end through the authorizing engine", () => {
    const events = runJourney();
    expect(journeyProgress(journeyContext(events)).complete).toBe(true);
    const ws = view(events, "customer").workspaces.find((w) => w.id === wsOf(events))!;
    expect(ws.activated).toBe(true);
    expect(ws.evals.every((e) => e.pass)).toBe(true);
    expect(ws.economics.roi).toBeGreaterThan(3);
  });

  it("publishes the improvement to every persona only after permission and review", () => {
    const before = runJourney(9);
    const ctx = journeyContext(before);
    const world = replay(before).world;
    // Publishing early is denied.
    expect(attempt(world, as("partner", { type: "contribution.publish", contributionId: ctx.contributionId! })).ok).toBe(false);
    // Google can't review before the customer permits reuse.
    expect(attempt(world, as("google", { type: "contribution.review", contributionId: ctx.contributionId!, approve: true })).ok).toBe(false);
    // Only the customer owner can permit.
    expect(attempt(world, as("partner", { type: "contribution.approveCustomer", contributionId: ctx.contributionId! })).ok).toBe(false);

    const after = runJourney();
    for (const p of ["customer", "google", "partner"] as const) {
      expect(view(after, p).assets.some((a) => a.name.includes("SAP Discrete Manufacturing Pack") && a.visibility === "public" && a.trust === "community")).toBe(true);
    }
  });

  it("refuses to publish a contribution that names the customer", () => {
    const events = runJourney(8);
    const r = attempt(replay(events).world, as("partner", {
      type: "contribution.propose", workspaceId: wsOf(events), baseAssetId: "a-scer-blueprint",
      title: "Kestrel exception pack", summary: "Built for Kestrel Industrial", changes: [],
    }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const c = r.world.contributions.at(-1)!;
    expect(c.scan.find((s) => s.id === "identifiers")!.passed).toBe(false);
  });

  it("gates activation on the sprint and on the customer owner", () => {
    const events = runJourney(6);
    const w = replay(events).world;
    expect(attempt(w, as("customer", { type: "workspace.activate", workspaceId: wsOf(events) })).ok).toBe(false);
    const done = runJourney(7);
    expect(attempt(replay(done).world, as("google", { type: "workspace.activate", workspaceId: wsOf(done) })).ok).toBe(false);
    expect(attempt(replay(done).world, as("customer", { type: "workspace.activate", workspaceId: wsOf(done) })).ok).toBe(true);
  });

  it("truncates a tampered log at the first unauthorized event", () => {
    const forged: Event[] = [
      as("customer", { type: "workspace.create", name: "Forgery test", problem: "" }),
      as("partner", { type: "workspace.invite", workspaceId: "ws-j1", userId: "u-arjun", responsibilities: ["observer"] }),
    ];
    const r = replay(forged);
    expect(r.events).toHaveLength(1);
    expect(r.rejected?.index).toBe(1);
  });
});

describe("client bundle boundary", () => {
  it("never imports server-only modules (which hold restricted assets) into browser code", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const root = path.resolve(__dirname, "../../components/asset-factory");
    const files = [
      ...fs.readdirSync(root).filter((f) => /\.tsx?$/.test(f)).map((f) => path.join(root, f)),
      path.resolve(__dirname, "journey.ts"),
      path.resolve(__dirname, "skillmd.ts"),
    ];
    const forbidden = /^\s*import\s+(?!type\b)[^;]*from\s+["'](?:@\/lib\/asset-factory\/|\.\/)(data|policy|engine|model|views|packages|run|server|content)["']/m;
    for (const f of files) {
      const src = fs.readFileSync(f, "utf8");
      expect(forbidden.test(src), `${path.basename(f)} imports a server-only module`).toBe(false);
    }
  });
});

describe("packages: real files, inheritance and edits", () => {
  it("ships real files for every seed asset", async () => {
    const { SEED_FILES } = await import("./content");
    const { ASSETS } = await import("./data");
    for (const a of ASSETS) {
      expect(SEED_FILES[a.id]?.length, a.id).toBeGreaterThan(0);
      if (a.type === "skill") expect(SEED_FILES[a.id].some((f) => f.path === "SKILL.md"), a.id).toBe(true);
    }
  });

  it("only returns files to personas allowed to see the asset", () => {
    const w = replay([]).world;
    expect(buildAssetDetail(w, "partner", "a-tier2-signals")?.files.length).toBeGreaterThan(0);
    expect(buildAssetDetail(w, "customer", "a-tier2-signals")).toBeNull();
    expect(buildAssetDetail(w, "customer", "google/manufacturing-consumption-expansion-playbook")).toBeNull();
    expect(buildAssetDetail(w, "google", "google/manufacturing-consumption-expansion-playbook")).not.toBeNull();
  });

  const parent = () => buildAssetDetail(replay([]).world, "customer", "a-exception-classify")!;
  const childMd = (ref: string, extra = "") => `---\nname: kestrel-exception-classification\nnamespace: kestrel\nversion: 0.1.0\nextends: ${ref}\ndescription: Kestrel tuning\n---\n\n# Kestrel exception classification\n\n## Additional instructions\n\n1. Treat plant P300 quality holds as blocking.${extra}\n\n## Parameters\n\n\`\`\`yaml\nconfidence_floor: 0.91\n\`\`\`\n`;

  it("inherits a skill and resolves the parent's instructions plus the child's", () => {
    const ref = parent().asset.ref;
    const ev = as("customer", { type: "asset.inherit", baseId: "a-exception-classify", name: "Kestrel Exception Classification", visibility: "org", skillMd: childMd(ref) });
    const r = attempt(replay([]).world, ev);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const child = r.world.assets.at(-1)!;
    expect(child.extendsRef?.assetId).toBe("a-exception-classify");
    const d = buildAssetDetail(r.world, "customer", child.id)!;
    expect(d.resolved?.chain).toEqual([ref, `${child.slug}@0.1.0`]);
    expect(d.resolved?.md).toContain("Treat plant P300 quality holds as blocking.");
    // Parent instructions survive in the resolved document.
    const parentInstr = parent().files.find((f: { path: string }) => f.path === "SKILL.md")!.content.split("## Instructions")[1].split("\n").find((l) => /^1\./.test(l.trim()))!;
    expect(d.resolved?.md).toContain(parentInstr.trim());
    expect(d.schema).toBeTruthy();
    // The child is private to Kestrel.
    expect(buildAssetDetail(r.world, "partner", child.id)).toBeNull();
  });

  it("rejects a wrong extends pin, a public child of a private parent, and leaking names", () => {
    const w = replay([]).world;
    expect(attempt(w, as("customer", { type: "asset.inherit", baseId: "a-exception-classify", name: "X skill", visibility: "org", skillMd: childMd("google/exception-classification@0.0.1") })).ok).toBe(false);
    const tier2 = buildAssetDetail(w, "partner", "a-tier2-signals")!.asset.ref;
    expect(attempt(w, as("partner", { type: "asset.inherit", baseId: "a-tier2-signals", name: "Public tier2", visibility: "public", skillMd: childMd(tier2) })).ok).toBe(false);
    const leak = attempt(w, as("partner", { type: "asset.inherit", baseId: "a-exception-classify", name: "Leaky skill", visibility: "public", skillMd: childMd(parent().asset.ref, " Built for Kestrel Industrial.") }));
    expect(leak.ok).toBe(false);
  });

  it("lets only the owner commit edits, and records a versioned diff", () => {
    const w = replay([]).world;
    const md = buildAssetDetail(w, "partner", "a-supplier-risk")!.files.find((f) => f.path === "SKILL.md")!.content;
    expect(attempt(w, as("customer", { type: "asset.edit", assetId: "a-supplier-risk", path: "SKILL.md", content: md + "\n", note: "x" })).ok).toBe(false);
    const r = attempt(w, as("partner", { type: "asset.edit", assetId: "a-supplier-risk", path: "SKILL.md", content: md + "\n<!-- tuned -->\n", note: "Tune" }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const d = buildAssetDetail(r.world, "customer", "a-supplier-risk")!;
    expect(d.history[0].note).toBe("Tune");
    expect(d.asset.version).not.toBe(buildAssetDetail(w, "customer", "a-supplier-risk")!.asset.version);
    expect(attempt(w, as("partner", { type: "asset.edit", assetId: "a-supplier-risk", path: "schema/output.json", content: "{not json", note: "bad" })).ok).toBe(false);
  });

  it("runs a skill (recorded when no API key) with an authorized trace", async () => {
    const key = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    const w = replay([]).world;
    const r = await runAsset(w, "customer", "a-exception-classify", "{}");
    expect(r?.mode).toBe("recorded");
    expect(r?.output).toBeTruthy();
    expect(r?.validation?.valid).toBe(true);
    expect(await runAsset(w, "customer", "a-tier2-signals", "{}")).toBeNull();
    if (key) process.env.GEMINI_API_KEY = key;
  });

  it("publishes the journey contribution as a package that extends the base blueprint", () => {
    const events = runJourney();
    const w = replay(events).world;
    const published = w.assets.find((a) => a.id.startsWith("a-ct"))!;
    const d = buildAssetDetail(w, "customer", published.id)!;
    expect(d.files.map((f) => f.path)).toContain("agent.yaml");
    expect(d.files.find((f) => f.path === "agent.yaml")!.content).toContain("extends: google/supply-chain-exception-resolution-agent@");
    expect(d.files.map((f) => f.content).join("\n")).not.toMatch(/Kestrel/);
  });
});
