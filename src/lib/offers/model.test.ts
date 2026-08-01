import { describe, expect, it } from "vitest";
import {
  DEFAULT_LEVERS,
  GSU_TERM_PRICE,
  type Levers,
  P_LIST,
  computeModel,
  normalizeMix,
} from "./model";

/** Build a lever set from the defaults, overriding only what a vector names. */
function levers(overrides: Partial<Levers> = {}): Levers {
  return { ...DEFAULT_LEVERS, ...overrides };
}

describe("Vector A — defaults", () => {
  const r = computeModel(DEFAULT_LEVERS);

  it("V = 550 and C0 = 2400.00", () => {
    expect(r.v).toBeCloseTo(550, 6);
    expect(r.c0).toBeCloseTo(2400, 6);
  });

  it("S1 = 1448.12", () => expect(r.s1).toBeCloseTo(1448.12, 1));
  it("S2 = 1329.32", () => expect(r.s2).toBeCloseTo(1329.32, 1));
  it("S3 = 1211.18", () => expect(r.s3).toBeCloseTo(1211.18, 1));
  it("S4 = 968.94", () => expect(r.s4).toBeCloseTo(968.94, 1));

  it("each step is within ±0.5 of the published vector", () => {
    expect(Math.abs(r.s1 - 1448.12)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(r.s2 - 1329.32)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(r.s3 - 1211.18)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(r.s4 - 968.94)).toBeLessThanOrEqual(0.5);
  });

  it("blendedMultiplier = 0.734 ±0.002", () => {
    expect(Math.abs(r.blendedMultiplier - 0.734)).toBeLessThanOrEqual(0.002);
  });

  it("savingPct = 59.6% ±0.1", () => {
    expect(Math.abs(r.savingPct * 100 - 59.6)).toBeLessThanOrEqual(0.1);
  });

  it("annualSave = $17.17M ±0.05", () => {
    expect(Math.abs(r.annualSave / 1000 - 17.17)).toBeLessThanOrEqual(0.05);
  });

  it("the new GSU levers are neutral at their defaults, so S6 === S4", () => {
    expect(r.s5).toBeCloseTo(r.s4, 10);
    expect(r.s6).toBeCloseTo(r.s4, 10);
    expect(r.final).toBeCloseTo(968.94, 1);
  });
});

describe("Vector B — no changes at all", () => {
  it("collapses exactly to the legacy state (guards sign errors)", () => {
    for (const h of [0, 0.15, 0.5]) {
      const r = computeModel(
        levers({
          u0: 0.55,
          u1: 0.55,
          mix: { wb: 1, ws: 0, wo: 0, wd: 0, wbt: 0 },
          h,
          d: 0,
        }),
      );
      expect(r.s4).toBeCloseTo(r.c0, 9);
      expect(r.final).toBeCloseTo(r.c0, 9);
      expect(r.savingPct).toBeCloseTo(0, 9);
    }
  });

  it("holds at other utilizations too", () => {
    for (const u of [0.35, 0.6, 0.9]) {
      const r = computeModel(
        levers({
          u0: u,
          u1: u,
          mix: { wb: 1, ws: 0, wo: 0, wd: 0, wbt: 0 },
          d: 0,
        }),
      );
      expect(r.s4).toBeCloseTo(r.c0, 9);
    }
  });
});

describe("Vector C — everything flexible", () => {
  it("S4 = P·V × 0.5 × 0.8 = 528.00 exactly", () => {
    const r = computeModel(
      levers({
        n0: 1000,
        u0: 0.55,
        mix: { wb: 0, ws: 0, wo: 0.4, wd: 0.4, wbt: 0.2 },
        h: 0,
        d: 0.2,
      }),
    );
    expect(r.s4).toBeCloseTo(P_LIST * r.v * 0.5 * 0.8, 9);
    expect(r.s4).toBeCloseTo(528, 9);
  });
});

describe("Vector D — normalization", () => {
  const raw = computeModel(
    levers({ mix: { wb: 110, ws: 14, wo: 36, wd: 28, wbt: 12 } }),
  );
  const a = computeModel(DEFAULT_LEVERS);

  it("normalized shares equal Vector A's shares", () => {
    expect(raw.mix.wb).toBeCloseTo(a.mix.wb, 12);
    expect(raw.mix.ws).toBeCloseTo(a.mix.ws, 12);
    expect(raw.mix.wo).toBeCloseTo(a.mix.wo, 12);
    expect(raw.mix.wd).toBeCloseTo(a.mix.wd, 12);
    expect(raw.mix.wbt).toBeCloseTo(a.mix.wbt, 12);
  });

  it("S4 equals Vector A's S4", () => {
    expect(raw.s4).toBeCloseTo(a.s4, 9);
  });

  it("normalizeMix sums to 1 and degenerates safely on an all-zero mix", () => {
    const n = normalizeMix({ wb: 3, ws: 1, wo: 1, wd: 1, wbt: 4 });
    expect(n.wb + n.ws + n.wo + n.wd + n.wbt).toBeCloseTo(1, 12);
    expect(normalizeMix({ wb: 0, ws: 0, wo: 0, wd: 0, wbt: 0 }).wb).toBe(1);
  });
});

describe("Vector E — harness ceiling", () => {
  it("defMult = 0.75 exactly at h = 0.50", () => {
    expect(computeModel(levers({ h: 0.5 })).defMult).toBe(0.75);
  });

  it("defMult = 0.5 exactly at h = 0 (full 0.5x, no dilution)", () => {
    expect(computeModel(levers({ h: 0 })).defMult).toBe(0.5);
  });
});

describe("Property — monotonicity", () => {
  it("S4 is non-increasing as the FSP discount rises", () => {
    let prev = Infinity;
    for (const d of [0, 0.1, 0.2]) {
      const s4 = computeModel(levers({ d })).s4;
      expect(s4).toBeLessThanOrEqual(prev + 1e-9);
      prev = s4;
    }
  });

  it("S4 is non-increasing as the off-peak share rises (mix normalized-fixed)", () => {
    // Shift weight from spike (1.0x, no placement benefit) into off-peak (0.5x)
    // so the other shares keep their relative proportions.
    let prev = Infinity;
    for (let wo = 0; wo <= 0.4; wo += 0.02) {
      const r = computeModel(
        levers({ mix: { wb: 0.55, ws: 0.45 - wo, wo, wd: 0, wbt: 0 } }),
      );
      expect(r.s4).toBeLessThanOrEqual(prev + 1e-9);
      prev = r.s4;
    }
  });

  it("the final number is non-increasing in every discount lever", () => {
    const sweep = <K extends "gcp" | "inc" | "cr">(key: K, steps: number[]) => {
      let prev = Infinity;
      for (const value of steps) {
        const r = computeModel(levers({ [key]: value } as Partial<Levers>));
        expect(r.final).toBeLessThanOrEqual(prev + 1e-9);
        prev = r.final;
      }
    };
    sweep("gcp", [0, 0.1, 0.2, 0.3]);
    sweep("inc", [0, 0.1, 0.2, 0.3]);
    sweep("cr", [0, 0.05, 0.1, 0.2]);
  });

  it("S4 rises with the harness share — h dilutes the 0.5x", () => {
    let prev = -Infinity;
    for (const h of [0, 0.1, 0.2, 0.3, 0.4, 0.5]) {
      const s4 = computeModel(levers({ h })).s4;
      expect(s4).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = s4;
    }
    expect(computeModel(levers({ h: 0 })).s4).toBeLessThan(
      computeModel(levers({ h: 0.5 })).s4,
    );
  });
});

describe("GSU commitment layer", () => {
  it("the 1-year term reprices the GSU line by the published ratio", () => {
    const base = computeModel(levers({ term: "1m", d: 0 }));
    const year = computeModel(levers({ term: "1y", d: 0 }));
    const ratio = GSU_TERM_PRICE["1y"] / GSU_TERM_PRICE["1m"];
    expect(year.gsu.afterCommit).toBeCloseTo(base.gsu.afterCommit * ratio, 9);
    // Only the GSU line moves; the PayGo portion is untouched.
    expect(base.final - year.final).toBeCloseTo(
      base.gsu.afterCommit - year.gsu.afterCommit,
      9,
    );
  });

  it("the 3-month term prices at list, same as 1 month", () => {
    expect(computeModel(levers({ term: "3m" })).final).toBeCloseTo(
      computeModel(levers({ term: "1m" })).final,
      9,
    );
  });

  it("FSP and the GCP commit discount do not stack — best of the two wins", () => {
    const r = computeModel(levers({ d: 0.2, gcp: 0.1 }));
    // GCP 10% loses to FSP 20%, so the GSU line is unchanged from S4.
    expect(r.gsu.appliedDiscount).toBe("fsp");
    expect(r.gsu.appliedDiscountRate).toBeCloseTo(0.2, 12);
    expect(r.s5).toBeCloseTo(r.s4, 9);

    const g = computeModel(levers({ d: 0.1, gcp: 0.25 }));
    expect(g.gsu.appliedDiscount).toBe("gcp");
    expect(g.gsu.appliedDiscountRate).toBeCloseTo(0.25, 12);
    expect(g.gsu.afterCommit).toBeCloseTo(g.gsu.atList * 0.75, 9);
    // Strictly better than the FSP-only line it replaces.
    expect(g.s5).toBeLessThan(g.s4);
  });

  it("credits and the incremental discount apply to GSU spend only", () => {
    const r = computeModel(levers({ inc: 0.1, cr: 0.05 }));
    const base = computeModel(levers());
    const expectedIncremental = r.gsu.afterCommit * 0.1;
    const expectedCredits = r.gsu.afterCommit * 0.9 * 0.05;
    expect(base.final - r.final).toBeCloseTo(
      expectedIncremental + expectedCredits,
      9,
    );
    expect(r.gsu.credits).toBeCloseTo(expectedCredits, 9);
  });

  it("attribution components are non-negative and sum to the total saving", () => {
    const r = computeModel(
      levers({ term: "1y", gcp: 0.25, inc: 0.15, cr: 0.1, d: 0.1 }),
    );
    const { utilization, placement, fsp, gsuCommit, incentives, total } =
      r.attribution;
    expect(placement).toBeGreaterThanOrEqual(0);
    expect(fsp).toBeGreaterThanOrEqual(0);
    expect(gsuCommit).toBeGreaterThanOrEqual(0);
    expect(incentives).toBeGreaterThanOrEqual(0);
    expect(utilization + placement + fsp + gsuCommit + incentives).toBeCloseTo(
      total,
      9,
    );
    expect(total).toBeCloseTo(r.c0 - r.final, 9);
  });

  it("a GSU-lever change with zero baseload share does nothing", () => {
    const noPt = { wb: 0, ws: 0.2, wo: 0.4, wd: 0.2, wbt: 0.2 };
    const a = computeModel(levers({ mix: noPt }));
    const b = computeModel(
      levers({ mix: noPt, term: "1y", gcp: 0.3, inc: 0.3, cr: 0.2 }),
    );
    expect(b.final).toBeCloseTo(a.final, 9);
  });
});

describe("Model integrity", () => {
  it("steps are internally consistent — deltas and cumulative % reconcile", () => {
    const r = computeModel(
      levers({ term: "1y", gcp: 0.15, inc: 0.1, cr: 0.05 }),
    );
    for (let i = 1; i < r.steps.length; i += 1) {
      expect(r.steps[i].delta).toBeCloseTo(
        r.steps[i].value - r.steps[i - 1].value,
        9,
      );
      expect(r.steps[i].cumulativeSavingPct).toBeCloseTo(
        1 - r.steps[i].value / r.c0,
        9,
      );
    }
    expect(r.steps[r.steps.length - 1].value).toBeCloseTo(r.final, 9);
    expect(r.steps[0].value).toBeCloseTo(r.c0, 9);
  });

  it("never returns NaN across the full lever space", () => {
    const grid: Levers[] = [];
    for (const n0 of [100, 1000, 5000])
      for (const u0 of [0.35, 0.55, 0.9])
        for (const u1 of [0.6, 0.85, 0.98])
          for (const h of [0, 0.5])
            for (const d of [0, 0.1, 0.2])
              for (const term of ["1m", "1y"] as const)
                grid.push(levers({ n0, u0, u1, h, d, term, gcp: 0.3, inc: 0.3, cr: 0.2 }));
    for (const l of grid) {
      const r = computeModel(l);
      expect(Number.isFinite(r.final)).toBe(true);
      expect(Number.isFinite(r.blendedMultiplier)).toBe(true);
      expect(Number.isFinite(r.savingPct)).toBe(true);
      expect(r.final).toBeGreaterThanOrEqual(0);
    }
  });

  it("is pure — computing twice from the same input gives the same result", () => {
    const l = levers({ gcp: 0.2 });
    expect(computeModel(l).final).toBe(computeModel(l).final);
    // and does not mutate its input
    const before = JSON.stringify(l);
    computeModel(l);
    expect(JSON.stringify(l)).toBe(before);
  });
});
