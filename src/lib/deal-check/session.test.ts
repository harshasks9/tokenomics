import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { defaults } from "./engine";
import { emptyMeta } from "./construct";
import { SESSION_KEY, getServerSession, getSession, resetSessionCache, setSession } from "./session";

class MemoryStorage {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
}

describe("shared working session", () => {
  const g = globalThis as { localStorage?: unknown };
  beforeEach(() => { g.localStorage = new MemoryStorage(); resetSessionCache(); });
  afterEach(() => { delete g.localStorage; resetSessionCache(); });

  it("starts from defaults and round-trips a change through storage", () => {
    expect(getSession().inputs).toEqual(defaults());
    setSession({ inputs: { ...defaults(), anthSpend: 30, geminiShare: 40 }, meta: { ...emptyMeta(), customer: "Acme" }, presetId: "gemini-play" });
    resetSessionCache();
    const s = getSession();
    expect(s.inputs.anthSpend).toBe(30);
    expect(s.inputs.geminiShare).toBe(40);
    expect(s.meta.customer).toBe("Acme");
    expect(s.presetId).toBe("gemini-play");
  });
  it("ignores corrupt storage and keeps the server snapshot stable", () => {
    (g.localStorage as MemoryStorage).setItem(SESSION_KEY, "{not json");
    expect(getSession()).toBe(getServerSession());
    (g.localStorage as MemoryStorage).setItem(SESSION_KEY, JSON.stringify({ inputs: { anthSpend: "x" } }));
    resetSessionCache();
    expect(getSession()).toBe(getServerSession());
  });
});
