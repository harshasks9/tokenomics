import { describe, expect, it } from "vitest";
import { betterCorner, explore, frontierCurve } from "./explore";
import { PRODUCTS } from "./products";
import { NO_REQUIREMENTS } from "./requirements";

describe("explore", () => {
  it("default price × ANC view: frontier is non-dominated and excludes products missing ANC", () => {
    const r = explore(PRODUCTS, { x: "price", y: "anc", requirements: NO_REQUIREMENTS, brands: [] });
    expect(r.missing.map((m) => m.product.id)).toEqual(["sennheiser-mtw5"]);
    expect(r.points).toHaveLength(PRODUCTS.length - 1);
    // The cheapest product is always on a price frontier.
    const cheapest = [...r.points].sort((a, b) => a.x - b.x)[0];
    expect(cheapest.onFrontier).toBe(true);
    // The highest ANC score is always on the frontier.
    const quietest = [...r.points].sort((a, b) => b.y - a.y)[0];
    expect(quietest.onFrontier).toBe(true);
    // Every dominated point names who dominates it, and those exist in the plotted set.
    for (const p of r.points.filter((p) => !p.onFrontier)) {
      expect(p.dominatedBy.length).toBeGreaterThan(0);
      for (const id of p.dominatedBy) expect(r.points.some((q) => q.id === id)).toBe(true);
    }
  });

  it("recomputes the frontier after requirements shrink the eligible set", () => {
    const all = explore(PRODUCTS, { x: "price", y: "anc", requirements: NO_REQUIREMENTS, brands: [] });
    const ip57 = explore(PRODUCTS, { x: "price", y: "anc", requirements: { ...NO_REQUIREMENTS, water: 7 }, brands: [] });
    expect(ip57.points.every((p) => ["IP57"].includes(p.product.features.ipRating.value ?? ""))).toBe(true);
    expect(ip57.points.length).toBeLessThan(all.points.length);
    expect(ip57.frontier.length).toBeGreaterThan(0);
  });

  it("separates documented failures, unknowns and brand filtering", () => {
    const r = explore(PRODUCTS, { x: "price", y: "anc", requirements: { ...NO_REQUIREMENTS, multipoint: true }, brands: ["Apple", "Beats", "Sony"] });
    const ids = (xs: { product: { id: string } }[]) => xs.map((x) => x.product.id).sort();
    expect(ids(r.failed)).toEqual(["powerbeats-pro-2"]);
    expect(ids(r.unknown)).toEqual(["airpods-5", "airpods-pro-3"]);
    expect(r.brandFiltered.every((b) => !["Apple", "Beats", "Sony"].includes(b.product.brand))).toBe(true);
    expect(r.eligible.every((p) => p.brand === "Sony")).toBe(true);
  });

  it("returns an empty, valid result when nothing qualifies", () => {
    const r = explore(PRODUCTS, { x: "price", y: "anc", requirements: { ...NO_REQUIREMENTS, maxPrice: 10 }, brands: [] });
    expect(r.points).toEqual([]);
    expect(r.frontier).toEqual([]);
    expect(r.failed).toHaveLength(PRODUCTS.length);
  });

  it("handles same-metric-direction views (battery × ANC both higher)", () => {
    const r = explore(PRODUCTS, { x: "batteryMeasured", y: "anc", requirements: NO_REQUIREMENTS, brands: [] });
    const longest = [...r.points].sort((a, b) => b.x - a.x)[0];
    expect(longest.onFrontier).toBe(true);
  });
});

describe("chart helpers", () => {
  it("places the better corner by direction", () => {
    expect(betterCorner("price", "anc")).toEqual({ horizontal: "left", vertical: "top" });
    expect(betterCorner("batteryMeasured", "weight")).toEqual({ horizontal: "right", vertical: "bottom" });
  });

  it("draws the staircase in the direction of the x objective", () => {
    expect(frontierCurve("price")).toBe("stepAfter");
    expect(frontierCurve("batteryMeasured")).toBe("stepBefore");
  });
});
