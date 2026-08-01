import { describe, expect, it } from "vitest";
import {
  BOGO_MIN_GSUS,
  DEFAULT_LEVERS,
  GSU_TERM_PRICE,
  type Levers,
  type OfferElections,
  P_LIST,
  Q3_TIERS,
  computeModel,
  normalizeMix,
  qualifyingTier,
} from "./model";

/** Build a lever set from the defaults, overriding only what a vector names. */
function levers(overrides: Partial<Levers> = {}): Levers {
  return {
    ...DEFAULT_LEVERS,
    ...overrides,
    offers: { ...DEFAULT_LEVERS.offers, ...(overrides.offers ?? {}) },
  };
}

const allOffers = (on: boolean): OfferElections => ({
  bogo: on,
  offPeak: on,
  deferred: on,
  batch: on,
  fsp: on,
  q3: on,
});

describe("Vector A — defaults", () => {
  const r = computeModel(DEFAULT_LEVERS);

  it("V = 550 and the at-list reference = 2400.00", () => {
    expect(r.v).toBeCloseTo(550, 6);
    expect(r.atList).toBeCloseTo(2400, 6);
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

  it("the GSU commit and Q3 steps are neutral at defaults, so S6 === S4", () => {
    expect(r.s5).toBeCloseTo(r.s4, 10);
    expect(r.s6).toBeCloseTo(r.s4, 10);
    expect(r.final).toBeCloseTo(968.94, 1);
  });
});

describe("Vector B — nothing placed or committed", () => {
  it("collapses exactly to the at-list reference (guards sign errors)", () => {
    for (const harness of [0, 0.15, 0.5]) {
      const r = computeModel(
        levers({
          uPeak: 0.55,
          uPt: 0.55,
          mix: { pt: 1, spike: 0, offPeak: 0, deferred: 0, batch: 0 },
          harness,
          offers: allOffers(false),
        }),
      );
      expect(r.s4).toBeCloseTo(r.atList, 9);
      expect(r.final).toBeCloseTo(r.atList, 9);
      expect(r.savingPct).toBeCloseTo(0, 9);
    }
  });

  it("holds at other utilizations too", () => {
    for (const u of [0.35, 0.6, 0.9]) {
      const r = computeModel(
        levers({
          uPeak: u,
          uPt: u,
          mix: { pt: 1, spike: 0, offPeak: 0, deferred: 0, batch: 0 },
          offers: allOffers(false),
        }),
      );
      expect(r.s4).toBeCloseTo(r.atList, 9);
    }
  });
});

describe("Vector C — everything flexible", () => {
  it("S4 = P·V × 0.5 × 0.8 = 528.00 exactly", () => {
    const r = computeModel(
      levers({
        gsus: 1000,
        uPeak: 0.55,
        mix: { pt: 0, spike: 0, offPeak: 0.4, deferred: 0.4, batch: 0.2 },
        harness: 0,
        fspRate: 0.2,
      }),
    );
    expect(r.s4).toBeCloseTo(P_LIST * r.v * 0.5 * 0.8, 9);
    expect(r.s4).toBeCloseTo(528, 9);
  });
});

describe("Vector D — normalization", () => {
  const raw = computeModel(
    levers({ mix: { pt: 110, spike: 14, offPeak: 36, deferred: 28, batch: 12 } }),
  );
  const a = computeModel(DEFAULT_LEVERS);

  it("normalized shares equal Vector A's shares", () => {
    expect(raw.mix.pt).toBeCloseTo(a.mix.pt, 12);
    expect(raw.mix.spike).toBeCloseTo(a.mix.spike, 12);
    expect(raw.mix.offPeak).toBeCloseTo(a.mix.offPeak, 12);
    expect(raw.mix.deferred).toBeCloseTo(a.mix.deferred, 12);
    expect(raw.mix.batch).toBeCloseTo(a.mix.batch, 12);
  });

  it("S4 equals Vector A's S4", () => expect(raw.s4).toBeCloseTo(a.s4, 9));

  it("normalizeMix sums to 1 and degenerates safely on an all-zero mix", () => {
    const n = normalizeMix({ pt: 3, spike: 1, offPeak: 1, deferred: 1, batch: 4 });
    expect(n.pt + n.spike + n.offPeak + n.deferred + n.batch).toBeCloseTo(1, 12);
    expect(
      normalizeMix({ pt: 0, spike: 0, offPeak: 0, deferred: 0, batch: 0 }).pt,
    ).toBe(1);
  });
});

describe("Vector E — harness ceiling", () => {
  it("defMult = 0.75 exactly at harness = 0.50", () => {
    expect(computeModel(levers({ harness: 0.5 })).defMult).toBe(0.75);
  });

  it("defMult = 0.5 exactly at harness = 0 (full 0.5x, no dilution)", () => {
    expect(computeModel(levers({ harness: 0 })).defMult).toBe(0.5);
  });
});

describe("Offers are opt-in", () => {
  it("every offer left unelected costs money versus electing it", () => {
    const all = computeModel(levers({ offers: allOffers(true) }));
    for (const key of ["bogo", "offPeak", "deferred", "batch", "fsp"] as const) {
      const without = computeModel(
        levers({ offers: { ...allOffers(true), [key]: false } }),
      );
      expect(without.final).toBeGreaterThan(all.final);
    }
  });

  it("without BOGO the spike share bills at Priority PayGo 1.8x", () => {
    const base = { pt: 0.5, spike: 0.5, offPeak: 0, deferred: 0, batch: 0 };
    const on = computeModel(
      levers({ mix: base, offers: { ...allOffers(false), bogo: true } }),
    );
    const off = computeModel(levers({ mix: base, offers: allOffers(false) }));
    // The only difference is the spike multiplier: 1.0x → 1.8x.
    expect(off.s1 - on.s1).toBeCloseTo(on.pv * 0.5 * (1.8 - 1.0), 9);
  });

  it("BOGO needs 200 committed GSUs and is ignored below that", () => {
    const small = computeModel(
      levers({ gsus: 100, uPeak: 0.35, offers: allOffers(true) }),
    );
    expect(small.gsu.units).toBeLessThan(BOGO_MIN_GSUS);
    expect(small.bogoEligible).toBe(false);
    // Electing it changes nothing when ineligible.
    const withoutBogo = computeModel(
      levers({
        gsus: 100,
        uPeak: 0.35,
        offers: { ...allOffers(true), bogo: false },
      }),
    );
    expect(small.final).toBeCloseTo(withoutBogo.final, 9);
  });

  it("electing nothing leaves only right-sizing on the table", () => {
    const r = computeModel(levers({ offers: allOffers(false) }));
    expect(r.attribution.placement).toBeCloseTo(0, 9);
    expect(r.attribution.fsp).toBeCloseTo(0, 9);
    expect(r.attribution.q3).toBeCloseTo(0, 9);
    expect(r.final).toBeCloseTo(r.s1, 9);
  });
});

describe("GSU Q3 offer tiers", () => {
  it("qualification is by committed GSU count", () => {
    expect(qualifyingTier(2500)?.id).toBe("gsu2000");
    expect(qualifyingTier(2000)?.id).toBe("gsu2000");
    expect(qualifyingTier(1999)?.id).toBe("gsu500");
    expect(qualifyingTier(500)?.id).toBe("gsu500");
    expect(qualifyingTier(499)).toBeNull();
  });

  it("the 2,000+ tier is a fixed 30% plus 10% credits", () => {
    const r = computeModel(
      levers({
        gsus: 4000,
        uPeak: 0.6,
        uPt: 0.85,
        mix: { pt: 0.75, spike: 0.07, offPeak: 0.08, deferred: 0.06, batch: 0.04 },
        term: "1y",
        offers: { ...DEFAULT_LEVERS.offers, q3: true },
      }),
    );
    expect(r.gsu.units).toBeGreaterThanOrEqual(2000);
    expect(r.q3Tier?.id).toBe("gsu2000");
    expect(r.q3AppliedDiscount).toBe(0.3);
    expect(r.q3AppliedCredits).toBe(0.1);
    expect(r.gsu.afterQ3Discount).toBeCloseTo(r.gsu.afterCommit * 0.7, 9);
    expect(r.gsu.credits).toBeCloseTo(r.gsu.afterCommit * 0.7 * 0.1, 9);
    // The fixed tier ignores the band slider entirely.
    const nudged = computeModel(
      levers({
        gsus: 4000,
        uPeak: 0.6,
        uPt: 0.85,
        mix: { pt: 0.75, spike: 0.07, offPeak: 0.08, deferred: 0.06, batch: 0.04 },
        term: "1y",
        q3Discount: 0.05,
        offers: { ...DEFAULT_LEVERS.offers, q3: true },
      }),
    );
    expect(nudged.final).toBeCloseTo(r.final, 9);
  });

  it("the 500+ tier is a band capped at 15%, plus 10% credits", () => {
    const at = (q3Discount: number) =>
      computeModel(
        levers({
          gsus: 2000,
          uPeak: 0.6,
          uPt: 0.85,
          mix: { pt: 0.6, spike: 0.1, offPeak: 0.1, deferred: 0.1, batch: 0.1 },
          q3Discount,
          offers: { ...DEFAULT_LEVERS.offers, q3: true },
        }),
      );
    const full = at(0.15);
    expect(full.gsu.units).toBeGreaterThanOrEqual(500);
    expect(full.gsu.units).toBeLessThan(2000);
    expect(full.q3Tier?.id).toBe("gsu500");
    expect(full.q3AppliedDiscount).toBe(0.15);
    expect(full.q3AppliedCredits).toBe(0.1);
    // Asking for more than the band allows is clamped to the band.
    expect(at(0.4).q3AppliedDiscount).toBe(0.15);
    expect(at(0.05).q3AppliedDiscount).toBe(0.05);
  });

  it("below 500 committed GSUs no tier applies even when elected", () => {
    const r = computeModel(
      levers({ offers: { ...DEFAULT_LEVERS.offers, q3: true } }),
    );
    expect(r.gsu.units).toBeLessThan(500);
    expect(r.q3Tier).toBeNull();
    expect(r.q3AppliedDiscount).toBe(0);
    expect(r.s6).toBeCloseTo(r.s5, 9);
    expect(r.gsusToNextTier).toBeGreaterThan(0);
  });

  it("credits apply after the discount, on GSU spend only", () => {
    const r = computeModel(
      levers({
        gsus: 3000,
        uPeak: 0.6,
        uPt: 0.85,
        mix: { pt: 0.7, spike: 0.1, offPeak: 0.1, deferred: 0.05, batch: 0.05 },
        offers: { ...DEFAULT_LEVERS.offers, q3: true },
      }),
    );
    const withoutQ3 = computeModel(
      levers({
        gsus: 3000,
        uPeak: 0.6,
        uPt: 0.85,
        mix: { pt: 0.7, spike: 0.1, offPeak: 0.1, deferred: 0.05, batch: 0.05 },
        offers: { ...DEFAULT_LEVERS.offers, q3: false },
      }),
    );
    const discount = r.gsu.afterCommit * r.q3AppliedDiscount;
    const credits = (r.gsu.afterCommit - discount) * r.q3AppliedCredits;
    expect(withoutQ3.final - r.final).toBeCloseTo(discount + credits, 9);
  });
});

describe("Incremental commit", () => {
  it("reports the monthly GSU spend and the total across the term", () => {
    for (const term of ["1m", "3m", "1y"] as const) {
      const r = computeModel(levers({ term }));
      expect(r.commit.monthly).toBeGreaterThan(0);
      expect(r.commit.total).toBeCloseTo(r.commit.monthly * r.commit.months, 9);
    }
    expect(computeModel(levers({ term: "1m" })).commit.months).toBe(1);
    expect(computeModel(levers({ term: "3m" })).commit.months).toBe(3);
    expect(computeModel(levers({ term: "1y" })).commit.months).toBe(12);
  });

  it("the commit is the GSU line only, never the whole bill", () => {
    const r = computeModel(levers());
    expect(r.commit.monthly).toBeLessThan(r.final);
  });
});

describe("Property — monotonicity", () => {
  it("S4 is non-increasing as the FSP rate rises", () => {
    let prev = Infinity;
    for (const fspRate of [0.1, 0.2]) {
      const s4 = computeModel(levers({ fspRate })).s4;
      expect(s4).toBeLessThanOrEqual(prev + 1e-9);
      prev = s4;
    }
  });

  it("S4 is non-increasing as the off-peak share rises", () => {
    let prev = Infinity;
    for (let offPeak = 0; offPeak <= 0.4; offPeak += 0.02) {
      const r = computeModel(
        levers({
          mix: { pt: 0.55, spike: 0.45 - offPeak, offPeak, deferred: 0, batch: 0 },
        }),
      );
      expect(r.s4).toBeLessThanOrEqual(prev + 1e-9);
      prev = r.s4;
    }
  });

  it("the final number is non-increasing in the GCP commit discount", () => {
    let prev = Infinity;
    for (const gcpCommit of [0, 0.1, 0.2, 0.3]) {
      const final = computeModel(levers({ gcpCommit })).final;
      expect(final).toBeLessThanOrEqual(prev + 1e-9);
      prev = final;
    }
  });

  it("S4 rises with the harness share — it dilutes the 0.5x", () => {
    let prev = -Infinity;
    for (const harness of [0, 0.1, 0.2, 0.3, 0.4, 0.5]) {
      const s4 = computeModel(levers({ harness })).s4;
      expect(s4).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = s4;
    }
  });
});

describe("GSU commitment layer", () => {
  it("the 1-year term reprices the GSU line by the published ratio", () => {
    const base = computeModel(levers({ term: "1m", offers: allOffers(false) }));
    const year = computeModel(levers({ term: "1y", offers: allOffers(false) }));
    const ratio = GSU_TERM_PRICE["1y"] / GSU_TERM_PRICE["1m"];
    expect(year.gsu.afterCommit).toBeCloseTo(base.gsu.afterCommit * ratio, 9);
    expect(base.final - year.final).toBeCloseTo(
      base.gsu.afterCommit - year.gsu.afterCommit,
      9,
    );
  });

  it("FSP and the GCP commit discount do not stack — best of the two wins", () => {
    const r = computeModel(levers({ fspRate: 0.2, gcpCommit: 0.1 }));
    expect(r.gsu.appliedDiscount).toBe("fsp");
    expect(r.gsu.appliedDiscountRate).toBeCloseTo(0.2, 12);
    expect(r.s5).toBeCloseTo(r.s4, 9);

    const g = computeModel(levers({ fspRate: 0.1, gcpCommit: 0.25 }));
    expect(g.gsu.appliedDiscount).toBe("gcp");
    expect(g.gsu.afterCommit).toBeCloseTo(g.gsu.atList * 0.75, 9);
    expect(g.s5).toBeLessThan(g.s4);
  });

  it("attribution components are non-negative and sum to the total saving", () => {
    const r = computeModel(
      levers({
        gsus: 4000,
        uPeak: 0.6,
        term: "1y",
        gcpCommit: 0.25,
        fspRate: 0.1,
        offers: allOffers(true),
      }),
    );
    const { rightSizing, placement, fsp, gsuCommit, q3, total } = r.attribution;
    expect(placement).toBeGreaterThanOrEqual(0);
    expect(fsp).toBeGreaterThanOrEqual(0);
    expect(gsuCommit).toBeGreaterThanOrEqual(0);
    expect(q3).toBeGreaterThanOrEqual(0);
    expect(rightSizing + placement + fsp + gsuCommit + q3).toBeCloseTo(total, 9);
    expect(total).toBeCloseTo(r.atList - r.final, 9);
  });

  it("GSU levers do nothing when no workload is placed on PT", () => {
    const noPt = { pt: 0, spike: 0.2, offPeak: 0.4, deferred: 0.2, batch: 0.2 };
    const a = computeModel(levers({ mix: noPt }));
    const b = computeModel(
      levers({
        mix: noPt,
        term: "1y",
        gcpCommit: 0.3,
        offers: { ...DEFAULT_LEVERS.offers, q3: true },
      }),
    );
    expect(b.final).toBeCloseTo(a.final, 9);
  });
});

describe("Model integrity", () => {
  it("steps are internally consistent — deltas and cumulative % reconcile", () => {
    const r = computeModel(
      levers({ gsus: 4000, term: "1y", gcpCommit: 0.15, offers: allOffers(true) }),
    );
    for (let i = 1; i < r.steps.length; i += 1) {
      expect(r.steps[i].delta).toBeCloseTo(
        r.steps[i].value - r.steps[i - 1].value,
        9,
      );
      expect(r.steps[i].cumulativeSavingPct).toBeCloseTo(
        1 - r.steps[i].value / r.atList,
        9,
      );
    }
    expect(r.steps[r.steps.length - 1].value).toBeCloseTo(r.final, 9);
    expect(r.steps[0].value).toBeCloseTo(r.atList, 9);
  });

  it("never returns NaN across the full lever space", () => {
    const grid: Levers[] = [];
    for (const gsus of [100, 1000, 5000])
      for (const uPeak of [0.35, 0.55, 0.9])
        for (const uPt of [0.6, 0.85, 0.98])
          for (const harness of [0, 0.5])
            for (const fspRate of [0.1, 0.2])
              for (const term of ["1m", "1y"] as const)
                for (const on of [true, false])
                  grid.push(
                    levers({
                      gsus,
                      uPeak,
                      uPt,
                      harness,
                      fspRate,
                      term,
                      gcpCommit: 0.3,
                      offers: allOffers(on),
                    }),
                  );
    for (const l of grid) {
      const r = computeModel(l);
      expect(Number.isFinite(r.final)).toBe(true);
      expect(Number.isFinite(r.blendedMultiplier)).toBe(true);
      expect(Number.isFinite(r.savingPct)).toBe(true);
      expect(r.final).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(r.commit.total)).toBe(true);
    }
  });

  it("is pure — computing twice from the same input gives the same result", () => {
    const l = levers({ gcpCommit: 0.2 });
    expect(computeModel(l).final).toBe(computeModel(l).final);
    const before = JSON.stringify(l);
    computeModel(l);
    expect(JSON.stringify(l)).toBe(before);
  });

  it("tier specs are ordered from largest threshold down", () => {
    for (let i = 1; i < Q3_TIERS.length; i += 1) {
      expect(Q3_TIERS[i - 1].minGsus).toBeGreaterThan(Q3_TIERS[i].minGsus);
    }
  });
});
