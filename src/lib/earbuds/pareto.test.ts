import { describe, expect, it } from "vitest";
import { compare, dominates, orderFrontier, paretoFrontier, type Objective } from "./pareto";

const priceVsAnc: Objective[] = [{ direction: "lower" }, { direction: "higher" }];
const bothHigher: Objective[] = [{ direction: "higher" }, { direction: "higher" }];
const bothLower: Objective[] = [{ direction: "lower" }, { direction: "lower" }];

describe("compare", () => {
  it("respects direction", () => {
    expect(compare(100, 200, "lower")).toBe(1);
    expect(compare(100, 200, "higher")).toBe(-1);
    expect(compare(5, 5, "higher")).toBe(0);
  });
});

describe("dominates", () => {
  it("requires at-least-as-good on all and strictly better on one", () => {
    expect(dominates([100, 9], [200, 8], priceVsAnc)).toBe(true);
    expect(dominates([100, 8], [200, 8], priceVsAnc)).toBe(true); // tie on y, cheaper
    expect(dominates([200, 9], [200, 8], priceVsAnc)).toBe(true); // tie on x, better y
    expect(dominates([100, 7], [200, 8], priceVsAnc)).toBe(false); // genuine tradeoff
  });

  it("identical points never dominate each other", () => {
    expect(dominates([150, 8], [150, 8], priceVsAnc)).toBe(false);
  });

  it("handles mixed directions correctly", () => {
    // lower price is better, higher anc is better
    expect(dominates([250, 9], [100, 9], priceVsAnc)).toBe(false);
    expect(dominates([100, 9], [250, 9], priceVsAnc)).toBe(true);
  });

  it("handles both-lower objectives (price vs weight)", () => {
    expect(dominates([100, 4.5], [120, 5], bothLower)).toBe(true);
    expect(dominates([100, 5.5], [120, 5], bothLower)).toBe(false);
  });
});

describe("paretoFrontier", () => {
  it("keeps only non-dominated points", () => {
    const r = paretoFrontier(
      [
        { id: "cheap-weak", values: [60, 8.1] },
        { id: "mid", values: [180, 8.2] },
        { id: "dominated", values: [250, 8.0] },
        { id: "best-anc", values: [250, 9.0] },
        { id: "pricey-worse", values: [330, 8.8] },
      ],
      priceVsAnc,
    );
    expect(r.frontier.sort()).toEqual(["best-anc", "cheap-weak", "mid"]);
    expect(r.dominatedBy.dominated.sort()).toEqual(["best-anc", "cheap-weak", "mid"]);
    expect(r.dominatedBy["pricey-worse"]).toEqual(["best-anc"]);
  });

  it("keeps exact ties together on the frontier", () => {
    const r = paretoFrontier(
      [
        { id: "a", values: [99, 8.1] },
        { id: "b", values: [99, 8.1] },
        { id: "c", values: [120, 8.0] },
      ],
      priceVsAnc,
    );
    expect(r.frontier.sort()).toEqual(["a", "b"]);
    expect(r.dominatedBy.c.sort()).toEqual(["a", "b"]);
  });

  it("a tie on one axis is broken by the other", () => {
    const r = paretoFrontier(
      [
        { id: "a", values: [8, 6.5] },
        { id: "b", values: [8, 8.75] },
      ],
      bothHigher,
    );
    expect(r.frontier).toEqual(["b"]);
  });

  it("returns a single point as its own frontier and empty input as empty", () => {
    expect(paretoFrontier([{ id: "solo", values: [1, 1] }], priceVsAnc).frontier).toEqual(["solo"]);
    expect(paretoFrontier([], priceVsAnc).frontier).toEqual([]);
  });

  it("refuses missing values instead of guessing", () => {
    expect(() => paretoFrontier([{ id: "x", values: [100, Number.NaN] }], priceVsAnc)).toThrow();
    expect(() => paretoFrontier([{ id: "x", values: [100] }], priceVsAnc)).toThrow();
  });

  it("recomputes when the candidate set shrinks", () => {
    const all = [
      { id: "a", values: [100, 9] },
      { id: "b", values: [150, 8] },
    ];
    expect(paretoFrontier(all, priceVsAnc).frontier).toEqual(["a"]);
    expect(paretoFrontier(all.filter((c) => c.id !== "a"), priceVsAnc).frontier).toEqual(["b"]);
  });
});

describe("orderFrontier", () => {
  it("sorts by x for the staircase", () => {
    expect(orderFrontier([{ x: 3 }, { x: 1 }, { x: 2 }]).map((p) => p.x)).toEqual([1, 2, 3]);
  });
});
