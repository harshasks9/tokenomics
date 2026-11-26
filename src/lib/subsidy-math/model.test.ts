import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  breakEvenIncentive, creditCliff, creditCliffWithDeflation, lifetime, requiredAttach, requiredVolumeMultiple, subsidyGrid, waterfall,
  INCENTIVE_LEVELS, LIST, type Incentive, type IncentiveType, type RouteId,
} from "./model";
import { BASE_INCENTIVE, BASE_LIFETIME, baseRoute, ROUTE_IDS } from "./params";

const none = { pct: 0, partnerFunded: 0, providerFunded: 0 };

describe("waterfall identities", () => {
  it.each(ROUTE_IDS)("%s: the 100 of list splits into slices that sum to list", (id) => {
    const p = baseRoute(id);
    const w = waterfall(p, none);
    if (p.structure === "agent") {
      const slices = p.customerDiscount * LIST + w.providerContribution + (w.providerServing - w.computeContribution) + w.distribution + w.cloudContribution;
      expect(slices).toBeCloseTo(LIST, 9);
    } else {
      const slices = p.customerDiscount * LIST + w.revenueSharePaid + w.infra + w.capital + w.distribution + w.cloudContribution;
      expect(slices).toBeCloseTo(LIST, 9);
    }
  });

  it.each(ROUTE_IDS)("%s: cash reconciles — customer + reimbursements − remittance = cloud net revenue", (id) => {
    const p = baseRoute(id);
    const inc = { pct: 0.35, partnerFunded: 0.2, providerFunded: 0.1 };
    const w = waterfall(p, inc);
    if (p.structure === "agent") {
      const cloudCash = w.customerPays + w.creditsPartner - (w.providerRevenue - w.channelFeePaid);
      expect(cloudCash).toBeCloseTo(w.cloudNetRevenue, 9);
    } else {
      expect(w.customerPays + w.creditsPartner + w.creditsProvider).toBeCloseTo(w.cloudNetRevenue, 9);
    }
  });

  it.each(ROUTE_IDS)("%s: contribution is linear in the incentive and zero at break-even", (id) => {
    const p = baseRoute(id);
    const be = breakEvenIncentive(p, { partnerFunded: 0, providerFunded: 0 });
    expect(waterfall(p, { pct: be, partnerFunded: 0, providerFunded: 0 }).cloudContribution).toBeCloseTo(0, 9);
    const a = waterfall(p, { pct: 0.1, partnerFunded: 0, providerFunded: 0 }).cloudContribution;
    const b = waterfall(p, { pct: 0.2, partnerFunded: 0, providerFunded: 0 }).cloudContribution;
    const c = waterfall(p, { pct: 0.3, partnerFunded: 0, providerFunded: 0 }).cloudContribution;
    expect(b - a).toBeCloseTo(c - b, 9);
  });

  it("partner and provider funding lower the cloud's cost", () => {
    const p = baseRoute("bedrock-claude");
    const own = waterfall(p, { pct: 0.35, partnerFunded: 0, providerFunded: 0 }).cloudContribution;
    const shared = waterfall(p, { pct: 0.35, partnerFunded: 0.3, providerFunded: 0.2 }).cloudContribution;
    expect(shared).toBeGreaterThan(own);
  });
});

describe("incentive mechanics", () => {
  it("a recurring incentive at or above break-even cannot be recovered by volume", () => {
    const p = baseRoute("bedrock-claude");
    const be = breakEvenIncentive(p, { partnerFunded: 0, providerFunded: 0 });
    expect(requiredVolumeMultiple(p, { pct: be + 0.01, partnerFunded: 0, providerFunded: 0 })).toBe(Infinity);
    expect(requiredVolumeMultiple(p, { pct: be / 2, partnerFunded: 0, providerFunded: 0 })).toBeCloseTo(2, 9);
  });

  it("one-time beats recurring over any lifetime longer than a year", () => {
    for (const id of ROUTE_IDS) {
      const p = baseRoute(id);
      for (const years of [3, 5]) {
        const lt = { ...BASE_LIFETIME, years };
        const one = lifetime(p, { ...BASE_INCENTIVE, type: "one-time" }, lt).npv;
        const rec = lifetime(p, { ...BASE_INCENTIVE, type: "recurring" }, lt).npv;
        expect(one).toBeGreaterThan(rec);
      }
    }
  });

  it("one-time and recurring are identical over a one-year life", () => {
    const p = baseRoute("azure-openai");
    const lt = { ...BASE_LIFETIME, years: 1 };
    expect(lifetime(p, { ...BASE_INCENTIVE, type: "one-time" }, lt).npv).toBeCloseTo(lifetime(p, { ...BASE_INCENTIVE, type: "recurring" }, lt).npv, 9);
  });

  it("consumption credits stop after the plan term", () => {
    const p = baseRoute("bedrock-claude");
    const r = lifetime(p, { ...BASE_INCENTIVE, type: "consumption" }, { ...BASE_LIFETIME, years: 5, consumptionYears: 3 });
    expect(r.rows[3].customerCredit).toBe(0);
    expect(r.rows[4].customerCredit).toBe(0);
    expect(r.rows[1].customerCredit).toBeGreaterThan(0);
  });

  it("the year-2 cliff for a 35% credit with no other discount is +53.8%", () => {
    expect(creditCliff(0, 0.35)).toBeCloseTo(1 / 0.65 - 1, 12);
  });

  it("payback is zero without an incentive and finite for a one-time credit that the customer outlives", () => {
    const p = baseRoute("bedrock-claude");
    expect(lifetime(p, { ...BASE_INCENTIVE, pct: 0 }, BASE_LIFETIME).paybackMonths).toBe(0);
    const pb = lifetime(p, { ...BASE_INCENTIVE, type: "one-time" }, BASE_LIFETIME).paybackMonths;
    expect(Number.isFinite(pb)).toBe(true);
  });

  it("required attach makes the lifetime NPV zero", () => {
    const p = baseRoute("bedrock-claude");
    const inc: Incentive = { ...BASE_INCENTIVE, type: "recurring" };
    const lt = { ...BASE_LIFETIME, years: 5, includeAdjacency: true, adjacencyIncremental: 1, commitAdjacencyUplift: 0 };
    const a = requiredAttach(p, inc, lt);
    expect(Number.isFinite(a)).toBe(true);
    expect(lifetime(p, inc, { ...lt, adjacencyAttach: a }).npv).toBeCloseTo(0, 6);
  });

  it("grid covers the seven incentive levels for every route", () => {
    for (const id of ROUTE_IDS) expect(subsidyGrid(baseRoute(id), { partnerFunded: 0, providerFunded: 0 }, BASE_LIFETIME)).toHaveLength(INCENTIVE_LEVELS.length);
  });
});

/** TS ≡ Python ≡ Excel: fixtures are produced by scripts/subsidy-math/model_ref.py, which also verifies the workbook. */
describe("parity with the Excel workbook's reference model", () => {
  const file = path.join(process.cwd(), "src/lib/subsidy-math/fixtures.json");
  const has = fs.existsSync(file);
  it.runIf(has)("fixtures match the TypeScript engine", () => {
    const fx = JSON.parse(fs.readFileSync(file, "utf8"));
    let checked = 0;
    const close = (a: number | null | string, b: number) => {
      if (a === null || a === "Infinity" || a === "never") { expect(Number.isFinite(b)).toBe(false); return; }
      expect(b).toBeCloseTo(Number(a), 6);
      checked += 1;
    };
    for (const id of ROUTE_IDS) {
      const f = fx.routes?.[id];
      if (!f) continue;
      const p = baseRoute(id);
      if (f.waterfall) {
        const w = waterfall(p, { pct: BASE_INCENTIVE.pct, partnerFunded: BASE_INCENTIVE.partnerFunded, providerFunded: BASE_INCENTIVE.providerFunded });
        for (const [k, v] of Object.entries(f.waterfall)) if (k in w) close(v as number, (w as unknown as Record<string, number>)[k]);
      }
      if (f.breakEven !== undefined) close(f.breakEven, breakEvenIncentive(p, { partnerFunded: BASE_INCENTIVE.partnerFunded, providerFunded: BASE_INCENTIVE.providerFunded }));
      if (f.lifetime) {
        for (const [type, byYears] of Object.entries(f.lifetime as Record<string, Record<string, { npv: number; payback: number | string | null }>>)) {
          for (const [years, v] of Object.entries(byYears)) {
            const r = lifetime(p, { ...BASE_INCENTIVE, type: type as IncentiveType }, { ...BASE_LIFETIME, years: Number(years) });
            close(v.npv, r.npv);
            close(v.payback as number, r.paybackMonths);
          }
        }
      }
    }
    expect(checked).toBeGreaterThan(20);
  });
});

describe("headline numbers (printed for review)", () => {
  it("prints the base case", () => {
    const rows = ROUTE_IDS.map((id: RouteId) => {
      const p = baseRoute(id);
      const lt5 = { ...BASE_LIFETIME, years: 5 };
      return {
        route: id,
        keep0: waterfall(p, none).cloudContribution.toFixed(1),
        keep35: waterfall(p, { pct: 0.35, partnerFunded: 0, providerFunded: 0 }).cloudContribution.toFixed(1),
        breakEven: (breakEvenIncentive(p, { partnerFunded: 0, providerFunded: 0 }) * 100).toFixed(1) + "%",
        npv5none: lifetime(p, { ...BASE_INCENTIVE, pct: 0 }, lt5).npv.toFixed(1),
        npv5one: lifetime(p, { ...BASE_INCENTIVE, type: "one-time" }, lt5).npv.toFixed(1),
        npv5cons: lifetime(p, { ...BASE_INCENTIVE, type: "consumption" }, lt5).npv.toFixed(1),
        npv5rec: lifetime(p, { ...BASE_INCENTIVE, type: "recurring" }, lt5).npv.toFixed(1),
        payOne: lifetime(p, { ...BASE_INCENTIVE, type: "one-time" }, lt5).paybackMonths.toFixed(1),
        eff3: (lifetime(p, { ...BASE_INCENTIVE, type: "one-time" }, { ...BASE_LIFETIME, years: 3 }).effectiveCustomerDiscount * 100).toFixed(1) + "%",
        eff5: (lifetime(p, { ...BASE_INCENTIVE, type: "one-time" }, lt5).effectiveCustomerDiscount * 100).toFixed(1) + "%",
      };
    });
    console.table(rows);
    expect(rows).toHaveLength(4);
  });
});

describe("argument robustness", () => {
  it("a stray pct inside the funding argument never overrides the incentive level", () => {
    const p = baseRoute("bedrock-claude");
    const fundingWithPct = { pct: 0, partnerFunded: 0, providerFunded: 0 } as unknown as { partnerFunded: number; providerFunded: number };
    expect(breakEvenIncentive(p, fundingWithPct)).toBeCloseTo(breakEvenIncentive(p, { partnerFunded: 0, providerFunded: 0 }), 12);
    const g = subsidyGrid(p, fundingWithPct, BASE_LIFETIME);
    expect(g[4].contribution).toBeLessThan(g[0].contribution);
  });
});

describe("post-review mechanics", () => {
  it("commit deals keep the customer for the term and only then start to churn", () => {
    const p = baseRoute("bedrock-claude");
    const lt = { ...BASE_LIFETIME, years: 5, commitYears: 3, retention: 0.8, growth: 0 };
    const r = lifetime(p, { ...BASE_INCENTIVE, type: "commit" }, lt);
    expect(r.rows[2].spend).toBeCloseTo(100, 9);
    expect(r.rows[3].spend).toBeCloseTo(80, 9);
    expect(r.rows[4].spend).toBeCloseTo(64, 9);
  });

  it("a cheaper credit (one that buys new usage) costs the cloud less", () => {
    const p = baseRoute("bedrock-claude");
    const full = waterfall(p, { pct: 0.35, partnerFunded: 0, providerFunded: 0, creditCost: 1 }).cloudContribution;
    const cheap = waterfall(p, { pct: 0.35, partnerFunded: 0, providerFunded: 0, creditCost: 0.35 }).cloudContribution;
    expect(cheap - full).toBeCloseTo(0.65 * 35, 9);
  });

  it("serving compute does not shrink when the model maker funds a credit", () => {
    const p = baseRoute("bedrock-claude");
    const a = waterfall(p, { pct: 0, partnerFunded: 0, providerFunded: 0 }).computeContribution;
    const b = waterfall(p, { pct: 0.35, partnerFunded: 0, providerFunded: 0.5 }).computeContribution;
    expect(b).toBeCloseTo(a, 12);
  });

  it("first-party routes ignore 'model maker funded' credits", () => {
    const g = baseRoute("vertex-gemini");
    const own = waterfall(g, { pct: 0.35, partnerFunded: 0, providerFunded: 0 }).cloudContribution;
    const claimed = waterfall(g, { pct: 0.35, partnerFunded: 0, providerFunded: 0.5 }).cloudContribution;
    expect(claimed).toBeCloseTo(own, 12);
  });

  it("with price deflation the year-2 cliff largely disappears", () => {
    expect(creditCliffWithDeflation(0, 0.35, 0.35)).toBeCloseTo(0, 12);
    expect(creditCliffWithDeflation(0.1, 0.35, 0.35)).toBeCloseTo((0.9 * 0.65) / 0.55 - 1, 12);
  });
});
