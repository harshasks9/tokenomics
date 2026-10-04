import { describe, expect, it } from "vitest";
import { betterCorner, explore, frontierCurve } from "./explore";
import { PRODUCTS } from "./products";
import { NO_REQUIREMENTS } from "./requirements";

describe("explore", () => {
  it("default price × ANC view: frontier is non-dominated and excludes products missing ANC", () => {
    const r = explore(PRODUCTS, { x: "price", y: "anc", requirements: NO_REQUIREMENTS, brands: [] });
    expect(r.missing.map((m) => m.product.id)).toContain("sennheiser-mtw5");
    // Every product is either plotted or listed as missing a metric — none silently dropped.
    expect(r.points.length + r.missing.length).toBe(PRODUCTS.length);
    for (const m of r.missing) for (const k of m.metrics) expect(m.product.metrics[k].value).toBeNull();
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
    expect(ids(r.failed)).toContain("powerbeats-pro-2");
    expect(ids(r.unknown)).toEqual(expect.arrayContaining(["airpods-5", "airpods-pro-3"]));
    for (const u of r.unknown) expect(u.product.features.multipoint.value).toBeNull();
    for (const f of r.failed) expect(f.product.features.multipoint.value).toBe("no");
    expect(r.brandFiltered.every((b) => !["Apple", "Beats", "Sony"].includes(b.product.brand))).toBe(true);
    expect(r.eligible.every((p) => p.brand === "Sony")).toBe(true);
  });

  it("returns an empty, valid result when nothing qualifies", () => {
    const r = explore(PRODUCTS, { x: "price", y: "anc", requirements: { ...NO_REQUIREMENTS, maxPrice: 1 }, brands: [] });
    expect(r.points).toEqual([]);
    expect(r.frontier).toEqual([]);
    // Products with a price fail the budget; products without one are "unknown", never passed.
    expect(r.failed.length + r.unknown.length).toBe(PRODUCTS.length);
    for (const u of r.unknown) expect(u.product.metrics.price.value).toBeNull();
  });

  it("handles same-metric-direction views (battery × ANC both higher)", () => {
    const r = explore(PRODUCTS, { x: "batteryMeasured", y: "anc", requirements: NO_REQUIREMENTS, brands: [] });
    const longest = [...r.points].sort((a, b) => b.x - a.x)[0];
    expect(longest.onFrontier).toBe(true);
  });
});

describe("market scope", () => {
  it("India view only includes products documented as sold in India", () => {
    const r = explore(PRODUCTS, { x: "priceInr", y: "batteryMax", requirements: NO_REQUIREMENTS, brands: [], market: "in" });
    for (const p of r.eligible) expect(p.indiaAvailable === true || p.metrics.priceInr.value !== null).toBe(true);
    for (const o of r.outOfMarket) expect(o.product.indiaAvailable !== true && o.product.metrics.priceInr.value === null).toBe(true);
    expect(r.eligible.length + r.outOfMarket.length).toBe(PRODUCTS.length);
  });

  it("US view requires a US launch price and budgets in dollars", () => {
    const r = explore(PRODUCTS, { x: "price", y: "anc", requirements: { ...NO_REQUIREMENTS, maxPrice: 150 }, brands: [], market: "us" });
    for (const p of r.eligible) expect(p.metrics.price.value).toBeLessThanOrEqual(150);
  });

  it("India budgets apply to the rupee price", () => {
    const r = explore(PRODUCTS, { x: "priceInr", y: "batteryMax", requirements: { ...NO_REQUIREMENTS, maxPrice: 2000 }, brands: [], market: "in" });
    for (const p of r.eligible) expect(p.metrics.priceInr.value).toBeLessThanOrEqual(2000);
    expect(r.eligible.length).toBeGreaterThan(0);
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
