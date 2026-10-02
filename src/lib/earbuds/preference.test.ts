import { describe, expect, it } from "vitest";
import { MIN_COVERAGE, preferenceEstimate } from "./preference";
import type { Datum, MetricId, Product } from "./types";

function num(value: number | null): Datum<number> {
  return { value, evidence: "measured", sources: [], confidence: "high" };
}

function product(id: string, m: Partial<Record<MetricId, number | null>>): Product {
  const metrics = Object.fromEntries(
    (["price", "anc", "batteryClaim", "batteryMeasured", "comfort", "weight"] as MetricId[]).map((k) => [k, num(m[k] ?? null)]),
  ) as Product["metrics"];
  return { id, metrics } as unknown as Product;
}

describe("preferenceEstimate", () => {
  it("normalises with direction (cheaper and quieter-better both score 1)", () => {
    const rows = preferenceEstimate([product("a", { price: 100, anc: 9 }), product("b", { price: 300, anc: 7 })], { price: 1, anc: 1 });
    expect(rows[0]).toMatchObject({ id: "a", estimate: 1, rank: 1 });
    expect(rows[1]).toMatchObject({ id: "b", estimate: 0, rank: 2 });
  });

  it("averages over available metrics and reports coverage", () => {
    const rows = preferenceEstimate(
      [product("full", { price: 100, anc: 8, comfort: 8 }), product("partial", { price: 200, anc: 9, comfort: null }), product("other", { price: 300, anc: 7, comfort: 9 })],
      { price: 1, anc: 1, comfort: 1 },
    );
    const partial = rows.find((r) => r.id === "partial")!;
    expect(partial.coverage).toBeCloseTo(2 / 3);
    expect(partial.missingMetrics).toEqual(["comfort"]);
    expect(partial.estimate).not.toBeNull();
  });

  it("refuses to rank below the coverage threshold", () => {
    const rows = preferenceEstimate([product("thin", { price: 100 }), product("rich", { price: 200, anc: 9, comfort: 9 })], { price: 1, anc: 1, comfort: 1 });
    const thin = rows.find((r) => r.id === "thin")!;
    expect(thin.coverage).toBeLessThan(MIN_COVERAGE);
    expect(thin.estimate).toBeNull();
    expect(thin.rank).toBeNull();
  });

  it("gives tied estimates the same rank", () => {
    const rows = preferenceEstimate([product("a", { anc: 8 }), product("b", { anc: 8 }), product("c", { anc: 6 })], { anc: 1 });
    expect(rows.find((r) => r.id === "a")!.rank).toBe(1);
    expect(rows.find((r) => r.id === "b")!.rank).toBe(1);
    expect(rows.find((r) => r.id === "c")!.rank).toBe(3);
  });

  it("reports a sensitivity rank range that widens when weights matter", () => {
    const rows = preferenceEstimate(
      [product("cheap", { price: 100, anc: 7 }), product("quiet", { price: 300, anc: 9 }), product("mid", { price: 190, anc: 8.1 })],
      { price: 1, anc: 1 },
    );
    const mid = rows.find((r) => r.id === "mid")!;
    expect(mid.rankRange![0]).toBeLessThanOrEqual(mid.rank!);
    expect(mid.rankRange![1]).toBeGreaterThanOrEqual(mid.rank!);
    const cheap = rows.find((r) => r.id === "cheap")!;
    expect(cheap.rankRange![1] - cheap.rankRange![0]).toBeGreaterThanOrEqual(0);
  });

  it("ignores zero-weight metrics entirely", () => {
    const rows = preferenceEstimate([product("a", { price: 100, anc: null }), product("b", { price: 200, anc: null })], { price: 1, anc: 0 });
    expect(rows[0]).toMatchObject({ id: "a", coverage: 1 });
  });
});
