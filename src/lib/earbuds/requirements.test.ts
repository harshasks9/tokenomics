import { describe, expect, it } from "vitest";
import { PRODUCT_BY_ID, PRODUCTS } from "./products";
import { NO_REQUIREMENTS, applyRequirements, checkProduct, countActive, partitionForAxes, waterDigit } from "./requirements";
import type { Product } from "./types";

const p = (id: string) => PRODUCT_BY_ID[id];

function withFeature(base: Product, patch: Partial<Product["features"]>): Product {
  return { ...base, features: { ...base.features, ...patch } };
}

describe("waterDigit", () => {
  it("parses IP codes", () => {
    expect(waterDigit("IP57")).toBe(7);
    expect(waterDigit("IPX4")).toBe(4);
    expect(waterDigit("IP55")).toBe(5);
    expect(waterDigit(null)).toBeNull();
    expect(waterDigit("splash-proof")).toBeNull();
  });
});

describe("checkProduct", () => {
  it("passes everything with no requirements", () => {
    const res = applyRequirements(PRODUCTS, NO_REQUIREMENTS);
    expect(res.every((r) => r.eligible)).toBe(true);
  });

  it("applies the budget against launch price", () => {
    const r = checkProduct(p("sony-wf-1000xm6"), { ...NO_REQUIREMENTS, maxPrice: 300 });
    expect(r.eligible).toBe(false);
    expect(r.exclusions[0]).toMatchObject({ requirement: "maxPrice", kind: "fails" });
    expect(checkProduct(p("bose-qc-ultra-earbuds-2"), { ...NO_REQUIREMENTS, maxPrice: 299 }).eligible).toBe(true);
  });

  it("treats unknown multipoint as unknown, never as a pass", () => {
    const r = checkProduct(p("airpods-pro-3"), { ...NO_REQUIREMENTS, multipoint: true });
    expect(r.eligible).toBe(false);
    expect(r.exclusions[0]).toMatchObject({ requirement: "multipoint", kind: "unknown" });
  });

  it("fails a documented 'no' on multipoint", () => {
    const r = checkProduct(p("powerbeats-pro-2"), { ...NO_REQUIREMENTS, multipoint: true });
    expect(r.exclusions[0]).toMatchObject({ requirement: "multipoint", kind: "fails" });
  });

  it("filters by water digit, with unknown ratings excluded as unknown", () => {
    const ipx7 = { ...NO_REQUIREMENTS, water: 7 as const };
    expect(checkProduct(p("airpods-pro-3"), ipx7).eligible).toBe(true);
    expect(checkProduct(p("cmf-buds-pro-2"), ipx7).exclusions[0]).toMatchObject({ kind: "fails" });
    const noRating = withFeature(p("cmf-buds-pro-2"), { ipRating: { value: null, evidence: "manufacturer", sources: [], confidence: "low" } });
    expect(checkProduct(noRating, { ...NO_REQUIREMENTS, water: "documented" }).exclusions[0]).toMatchObject({ kind: "unknown" });
    expect(checkProduct(p("cmf-buds-pro-2"), { ...NO_REQUIREMENTS, water: "documented" }).eligible).toBe(true);
  });

  it("requires full OS support and treats limited as a failure", () => {
    const ios = { ...NO_REQUIREMENTS, os: "ios" as const };
    expect(checkProduct(p("galaxy-buds4-pro"), ios).exclusions[0]).toMatchObject({ requirement: "os", kind: "fails" });
    expect(checkProduct(p("pixel-buds-pro-2"), ios).exclusions[0]).toMatchObject({ requirement: "os", kind: "unknown" });
    expect(checkProduct(p("airpods-pro-3"), ios).eligible).toBe(true);
  });

  it("secure-fit accepts hooks, wings and bands only", () => {
    const fit = { ...NO_REQUIREMENTS, secureFit: true };
    expect(checkProduct(p("powerbeats-pro-2"), fit).eligible).toBe(true);
    expect(checkProduct(p("bose-qc-ultra-earbuds-2"), fit).eligible).toBe(true);
    expect(checkProduct(p("nothing-ear-3"), fit).exclusions[0]).toMatchObject({ kind: "fails" });
    expect(checkProduct(p("airpods-5"), fit).exclusions[0].reason).toMatch(/Open fit/);
    expect(checkProduct(p("galaxy-buds4-pro"), fit).exclusions[0]).toMatchObject({ kind: "unknown" });
  });

  it("records every failed requirement, not just the first", () => {
    const r = checkProduct(p("airpods-5"), { ...NO_REQUIREMENTS, wirelessCharging: true, secureFit: true, maxPrice: 100 });
    expect(r.exclusions.map((e) => e.requirement).sort()).toEqual(["maxPrice", "secureFit", "wirelessCharging"]);
  });

  it("brand filter excludes other brands", () => {
    const res = applyRequirements(PRODUCTS, NO_REQUIREMENTS, ["Sony"]);
    const eligible = res.filter((r) => r.eligible).map((r) => r.product.brand);
    expect(eligible.length).toBeGreaterThanOrEqual(3);
    expect(new Set(eligible)).toEqual(new Set(["Sony"]));
  });

  it("counts active requirements", () => {
    expect(countActive(NO_REQUIREMENTS)).toBe(0);
    expect(countActive({ ...NO_REQUIREMENTS, multipoint: true, water: 4 })).toBe(2);
  });
});

describe("new requirements", () => {
  it("ANC requirement fails documented no-ANC and treats unknown as unknown", () => {
    const res = applyRequirements(PRODUCTS, { ...NO_REQUIREMENTS, anc: true });
    for (const r of res) {
      const a = r.product.features.ancType.value;
      if (a === "anc" || a === "adaptive") expect(r.eligible).toBe(true);
      else expect(r.exclusions.find((e) => e.requirement === "anc")?.kind).toBe(a === null ? "unknown" : "fails");
    }
  });

  it("release-year filter never passes an undated product", () => {
    const res = applyRequirements(PRODUCTS, { ...NO_REQUIREMENTS, releasedSince: 2025 });
    for (const r of res) {
      if (r.product.releasedMonth === null) expect(r.eligible).toBe(false);
      else expect(r.eligible).toBe(Number(r.product.releasedMonth.slice(0, 4)) >= 2025);
    }
  });

  it("form filter separates sealed and open designs", () => {
    const open = applyRequirements(PRODUCTS, { ...NO_REQUIREMENTS, form: "open" }).filter((r) => r.eligible);
    expect(open.every((r) => ["open-ear", "clip", "semi-in-ear"].includes(r.product.form ?? ""))).toBe(true);
  });
});

describe("partitionForAxes", () => {
  it("excludes products missing either selected metric and says which", () => {
    const { plotted, missing } = partitionForAxes(PRODUCTS, "price", "anc");
    expect(plotted.find((x) => x.id === "sennheiser-mtw5")).toBeUndefined();
    expect(missing.find((m) => m.product.id === "sennheiser-mtw5")?.metrics).toEqual(["anc"]);
    expect(plotted.length + missing.length).toBe(PRODUCTS.length);
  });

  it("lists both metrics when both are missing", () => {
    const { missing } = partitionForAxes(PRODUCTS, "batteryMeasured", "comfort");
    expect(missing.find((m) => m.product.id === "airpods-5")?.metrics).toEqual(["batteryMeasured", "comfort"]);
  });
});
