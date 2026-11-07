import { describe, expect, it } from "vitest";
import { attempt, replay, seed } from "./engine";
import { ACCOUNTS, CUSTOMER_ACCOUNT, USECASES } from "./data";
import { qualify, stats } from "./model";
import { USECASE_FILES } from "./content";
import { buildView, listUseCases } from "./views";
import type { Action, PersonaId } from "./types";

const act = (actor: PersonaId, action: Action) => attempt(seed(), { actor, action });
const byName = (n: string) => ACCOUNTS.find((a) => a.name === n)!;

describe("usage statistics", () => {
  it("reports a median that the mean hides when most seats are idle", () => {
    const s = stats(byName("Wattle Retail Group"));
    expect(s.median).toBe(0);
    expect(s.mean).toBeGreaterThan(0);
    expect(s.histogram.reduce((n, h) => n + h.users, 0)).toBe(900);
  });

  it("puts $2-entitlement editions on an upgrade-first play and sovereign customers out of scope", () => {
    const tasman = byName("Tasman Freight");
    expect(qualify(tasman, stats(tasman)).play).toBe("upgrade-first");
    const aet = byName("Aotearoa Education Trust");
    expect(qualify(aet, stats(aet)).play).toBe("not-now");
  });
});

describe("per-persona projection", () => {
  const w = seed();

  it("gives the customer only their own account, no targeting, no plan, no credits", () => {
    const v = buildView(w, "customer");
    expect(v.accounts.map((a) => a.id)).toEqual([CUSTOMER_ACCOUNT]);
    expect(v.accounts[0].internal).toBeUndefined();
    expect(v.plan).toBeUndefined();
    expect(v.credits).toBeNull();
    expect(JSON.stringify(v)).not.toMatch(/iRev|Brenton|Tanya|60% of revenue|revenue mix/i);
  });

  it("gives the partner only their book and no plan", () => {
    const v = buildView(w, "partner");
    expect(v.accounts.length).toBeGreaterThan(3);
    expect(v.accounts.every((a) => a.partner?.id === "northlight")).toBe(true);
    expect(v.accounts[0].internal).toBeDefined();
    expect(v.plan).toBeUndefined();
    expect(JSON.stringify(v)).not.toMatch(/iRev|Brenton|Tanya/);
  });

  it("gives Google the plan and every account", () => {
    const v = buildView(w, "google");
    expect(v.accounts.length).toBe(ACCOUNTS.length);
    expect(v.plan?.principles.some((p) => /do not sell Gemini/i.test(p.title))).toBe(true);
    expect(v.plan?.raci.some((r) => r.who.includes("Brenton"))).toBe(true);
  });
});

describe("authorization", () => {
  it("lets the customer book only their own workshop", () => {
    expect(act("customer", { type: "workshop.register", accountId: CUSTOMER_ACCOUNT, week: 3 }).ok).toBe(true);
    const other = act("customer", { type: "workshop.register", accountId: byName("Wattle Retail Group").id, week: 3 });
    expect(other.ok).toBe(false);
  });

  it("keeps partners inside their own book", () => {
    const r = act("partner", { type: "workshop.register", accountId: byName("Lumen Bank SEA").id, week: 3 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/not found or not yours/);
  });

  it("refuses to claim a stage the median telemetry doesn't support", () => {
    // Harbourside is agentified but its median is below the 'Using' bar.
    const h = byName("Harbourside Health");
    const r = act("partner", { type: "account.advance", accountId: h.id, to: "using" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/Telemetry doesn't support/);
  });

  it("runs the workshop flow and allocates credits within the partner cap and the pool", () => {
    const id = CUSTOMER_ACCOUNT;
    const events = [
      { actor: "customer" as const, action: { type: "workshop.register" as const, accountId: id, week: 2 } },
      { actor: "partner" as const, action: { type: "workshop.complete" as const, accountId: id, useCaseIds: ["uc-inbox", "uc-delegate", "uc-status"] } },
    ];
    const { world, events: ok } = replay(events);
    expect(ok).toHaveLength(2);
    expect(world.accounts.find((a) => a.id === id)!.stage).toBe("agentified");
    // Enterprise Standard: $27 × 3 months = $81 per new user; 61 users = $4,941 (under the $5k partner cap), 62 is over.
    expect(attempt(world, { actor: "partner", action: { type: "credits.allocate", accountId: id, newUsers: 61 } }).ok).toBe(true);
    expect(attempt(world, { actor: "partner", action: { type: "credits.allocate", accountId: id, newUsers: 62 } }).ok).toBe(false);
    expect(attempt(world, { actor: "customer", action: { type: "credits.allocate", accountId: id, newUsers: 1 } }).ok).toBe(false);
    // Google can go past the partner cap but not past the $50K pool ($81 × 618 = $50,058).
    expect(attempt(world, { actor: "google", action: { type: "credits.allocate", accountId: id, newUsers: 500 } }).ok).toBe(true);
    const big = attempt(world, { actor: "google", action: { type: "credits.allocate", accountId: id, newUsers: 500 } });
    if (big.ok) expect(attempt(big.world, { actor: "google", action: { type: "credits.allocate", accountId: id, newUsers: 200 } }).ok).toBe(false);
  });

  it("blocks credits before activation, sovereign bookings and cross-region assignment", () => {
    expect(act("google", { type: "credits.allocate", accountId: byName("Wattle Retail Group").id, newUsers: 5 }).ok).toBe(false);
    expect(act("google", { type: "workshop.register", accountId: byName("Aotearoa Education Trust").id, week: 3 }).ok).toBe(false);
    expect(act("google", { type: "account.assign", accountId: byName("Wattle Retail Group").id, partnerId: "lionfish" }).ok).toBe(false);
    expect(act("partner", { type: "account.assign", accountId: byName("Wattle Retail Group").id, partnerId: "meridian" }).ok).toBe(false);
  });

  it("truncates a forged log at the first denied event", () => {
    const r = replay([
      { actor: "customer", action: { type: "workshop.register", accountId: CUSTOMER_ACCOUNT, week: 2 } },
      { actor: "customer", action: { type: "workshop.complete", accountId: CUSTOMER_ACCOUNT, useCaseIds: ["uc-inbox"] } },
    ]);
    expect(r.events).toHaveLength(1);
    expect(r.rejected?.index).toBe(1);
  });
});

describe("use-case packages", () => {
  it("ships six files per use case with sane entitlement math", () => {
    for (const u of USECASES) {
      const paths = (USECASE_FILES[u.id] ?? []).map((f) => f.path);
      for (const p of ["SKILL.md", "schema/output.json", "examples/sample-input.json", "examples/sample-output.json", "workshop/lab.md", "CHANGELOG.md"]) expect(paths, `${u.id} ${p}`).toContain(p);
    }
    for (const v of listUseCases()) {
      expect(v.monthlyPerUser, v.id).toBeGreaterThan(0.5);
      expect(v.monthlyPerUser, v.id).toBeLessThanOrEqual(6);
    }
  });

  it("never pitches a Gemini add-on", () => {
    const all = Object.values(USECASE_FILES).flat().map((f) => f.content).join("\n");
    expect(all).not.toMatch(/Gemini Enterprise (add-on|plan|Standard|Plus)|upgrade to Gemini/i);
  });
});

describe("client bundle boundary", () => {
  it("never imports server-only modules into browser code", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const root = path.resolve(__dirname, "../../components/agentify");
    const forbidden = /^\s*import\s+(?!type\b)[^;]*from\s+["']@\/lib\/agentify\/(data|engine|model|views|plan|run|server|content)["']/m;
    for (const f of fs.readdirSync(root).filter((x) => /\.tsx?$/.test(x))) {
      const src = fs.readFileSync(path.join(root, f), "utf8");
      expect(forbidden.test(src), f).toBe(false);
      // Internal plan wording must come from the server-side plan, not ship in client JS.
      expect(/iRev|Brenton|Tanya/.test(src), `${f} hard-codes internal plan text`).toBe(false);
    }
  });
});
