import { describe, expect, it } from "vitest";
import {
  BOGO_MIN_GSUS,
  DEFAULT_LEVERS,
  GSU_TERM_PRICE,
  type Levers,
  type OfferElections,
  P_LIST,
  Q3_TIERS,
  MINUTES_PER_MONTH,
  computeModel,
  effectiveTpmPerGsu,
  electedSteps,
  isOverAllocated,
  leversFromSimple,
  normalizeForSimple,
  qualifyingTier,
  simpleFromLevers,
  standardShare,
  tpmForGsus,
} from "./model";

function levers(overrides: Partial<Levers> = {}): Levers {
  return {
    ...DEFAULT_LEVERS,
    ...overrides,
    offers: { ...DEFAULT_LEVERS.offers, ...(overrides.offers ?? {}) },
  };
}

/**
 * GSUs are an output now, so a test that wants "600 PT GSUs" has to ask for the
 * request that sizes to them. Utilization defaults to 1 so the ordered count is
 * the demanded count and the intent survives the conversion.
 */
function sized(
  ptGsus: number,
  paygoGsus: number,
  overrides: Partial<Levers> = {},
): Levers {
  const base = levers({ ptUtilization: 1, ...overrides });
  const { tpm, ptShare } = tpmForGsus(
    ptGsus,
    paygoGsus,
    effectiveTpmPerGsu(base),
    base.ptUtilization,
  );
  return { ...base, tpm, ptShare };
}

/** The blended PayGo rate the defaults price at: $1.50 in / $7.50 out @ 20%. */
const PAYGO_RATE = 2.7;
/** $K per month of PayGo at standard rates for a given GSU-equivalent count. */
function paygoUnitFor(
  paygoGsus: number,
  tpmPerGsu = effectiveTpmPerGsu(DEFAULT_LEVERS),
) {
  return ((paygoGsus * tpmPerGsu * MINUTES_PER_MONTH) / 1e6) * PAYGO_RATE / 1000;
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

  it("weights raw tokens by the burndown rates before sizing anything", () => {
    // Gemini 3.6 Flash burns output at 5x and input at 1x, so at a 20% output
    // mix one raw token costs 0.8x1 + 0.2x5 = 1.8 standard units. A GSU carries
    // 675 standard tokens/sec = 40,500/min, i.e. 22,500 RAW tokens/min.
    expect(r.sizing.throughputPerGsu).toBe(675);
    expect(r.sizing.burndownWeight).toBeCloseTo(1.8, 9);
    expect(r.sizing.tpmPerGsu).toBeCloseTo(22_500, 9);
    expect(r.sizing.throughputIsPublished).toBe(true);
    expect(r.sizing.burndownIsPublished).toBe(true);
  });

  it("reproduces Google's own worked example", () => {
    // 10 QPS of 1,000 text + 500 audio in, 300 text out, on gemini-3.6-flash.
    // Burndown-adjusted: (1,500 + 300x5) = 3,000 per query, 30,000 tokens/sec.
    // 30,000 / 675 = 44.4 -> 45 GSUs at a minimum increment of 1.
    const rawTokensPerSec = (1_000 + 500 + 300) * 10;
    const r45 = computeModel(
      levers({
        tpm: rawTokensPerSec * 60,
        ptShare: 1,
        ptUtilization: 1,
        // The example's mix is 300 output of 1,800 raw tokens.
        outputShare: 300 / 1_800,
      }),
    );
    expect(r45.sizing.burndownWeight).toBeCloseTo(1 + (300 / 1_800) * 4, 9);
    expect(r45.traffic.ptGsus).toBe(45);
  });

  it("derives the GSU order from the request, not the other way round", () => {
    // 36M TPM on PT / 22,500 = 1,600 GSUs of traffic; at 85% utilization the
    // customer must ORDER ceil(1,600/0.85) = 1,883, rounded to the increment.
    expect(r.sizing.ptDemandGsus).toBeCloseTo(1600, 9);
    expect(r.sizing.minGsuIncrement).toBe(1);
    expect(r.traffic.ptGsus).toBe(1883);
    expect(r.traffic.idleGsus).toBeCloseTo(283, 9);
  });

  it("prices PayGo from the model's own rate, not at parity with the GSU", () => {
    // Gemini 3.6 Flash: $1.50/Mtok in, $7.50 out, 20% output → $2.70 blended.
    expect(r.sizing.paygoPerMtok).toBeCloseTo(2.7, 9);
    expect(r.sizing.paygoRateIsPublished).toBe(true);
    expect(r.sizing.paygoMtokPerMonth).toBeCloseTo(1_555_200, 6);
  });

  it("splits the incremental spend into its PT and PayGo halves", () => {
    expect(r.ptReference).toBeCloseTo(1883 * P_LIST, 6); // 4519.20
    // 4199.04 x (0.15x1.8 + 0.25 + 0.3 + 0.2 + 0.1) = 4199.04 x 1.12
    expect(r.paygoReference).toBeCloseTo(4702.9248, 6);
    expect(r.reference).toBeCloseTo(9222.1248, 6);
  });

  it("walks the steps to the derived figures", () => {
    expect(r.s1).toBeCloseTo(8718.24, 6); // BOGO: spike 1.8x → 1.0x
    expect(r.s2).toBeCloseTo(8088.384, 6); // off-peak halves
    expect(r.s3).toBeCloseTo(7521.5136, 6); // deferred @0.575x + batch @0.5x
    expect(r.s4).toBeCloseTo(6017.21088, 6); // FSP −20%
    expect(r.s5).toBeCloseTo(6017.21088, 6); // 1-month term, no GCP commit
    expect(r.s6).toBeCloseTo(5167.60128, 6); // Q3 500+ tier: −15% then 10% credits
    expect(r.final).toBeCloseTo(5167.60128, 6);
  });

  it("reports the headline numbers", () => {
    expect(r.savingPct * 100).toBeCloseTo(43.97, 1);
    expect(r.annualSave).toBeCloseTo((9222.1248 - 5167.60128) * 12, 6);
  });

  it("measures the blended multiplier against real Standard PayGo", () => {
    // Not against P_LIST x GSUs, which would price PayGo at the GSU rate again.
    expect(r.allStandardPayGo).toBeCloseTo(8398.08, 6);
    expect(r.blendedMultiplier).toBeCloseTo(5167.60128 / 8398.08, 9);
  });

  it("standard PayGo takes the remainder of the mix", () => {
    expect(r.mix.standard).toBeCloseTo(0.25, 9);
    expect(r.overAllocated).toBe(false);
  });
});

describe("Vector B — nothing elected", () => {
  it("collapses exactly to the incremental-spend baseline", () => {
    for (const harness of [0, 0.15, 0.5]) {
      const r = computeModel(levers({ harness, offers: allOffers(false) }));
      expect(r.final).toBeCloseTo(r.reference, 9);
      expect(r.savingPct).toBeCloseTo(0, 9);
      expect(r.attribution.total).toBeCloseTo(0, 9);
    }
  });

  it("holds across volumes and terms", () => {
    for (const ptGsus of [0, 600, 5000])
      for (const paygoGsus of [0, 600, 5000])
        for (const term of ["1m", "3m", "1y"] as const) {
          const r = computeModel(
            sized(ptGsus, paygoGsus, { term, offers: allOffers(false) }),
          );
          // The term price only bites once a commit discount is elected.
          expect(r.s4).toBeCloseTo(r.reference, 9);
        }
  });
});

describe("Vector C — everything on a 0.5x tier", () => {
  it("lands on exactly half, then the FSP discount", () => {
    const r = computeModel(
      sized(0, 1000, {
        paygoMix: { spike: 0, offPeak: 0.5, deferred: 0, batch: 0.5 },
        fspRate: 0.2,
      }),
    );
    const unit = paygoUnitFor(1000);
    expect(r.reference).toBeCloseTo(unit, 6);
    expect(r.final).toBeCloseTo(unit * 0.5 * 0.8, 6);
  });
});

describe("Vector D — share allocation", () => {
  it("standard PayGo is the remainder, never negative", () => {
    expect(
      standardShare({ spike: 0.15, offPeak: 0.3, deferred: 0.2, batch: 0.1 }),
    ).toBeCloseTo(0.25, 9);
    expect(
      standardShare({ spike: 0.9, offPeak: 0.9, deferred: 0, batch: 0 }),
    ).toBe(0);
  });

  it("over-allocated shares are flagged and scaled back to 100%", () => {
    const over = { spike: 0.6, offPeak: 0.6, deferred: 0.4, batch: 0.4 };
    expect(isOverAllocated(over)).toBe(true);
    const r = computeModel(levers({ paygoMix: over }));
    expect(r.overAllocated).toBe(true);
    const sum =
      r.mix.spike + r.mix.offPeak + r.mix.deferred + r.mix.batch + r.mix.standard;
    expect(sum).toBeCloseTo(1, 9);
    // Proportions are preserved: spike and off-peak were equal, still are.
    expect(r.mix.spike).toBeCloseTo(r.mix.offPeak, 9);
  });
});

describe("Vector E — harness ceiling", () => {
  it("defMult = 0.75 exactly at harness = 0.50", () => {
    expect(computeModel(levers({ harness: 0.5 })).defMult).toBe(0.75);
  });
  it("defMult = 0.5 exactly at harness = 0", () => {
    expect(computeModel(levers({ harness: 0 })).defMult).toBe(0.5);
  });
});

describe("Offers are opt-in", () => {
  it("every offer left unelected costs money versus electing it", () => {
    const all = computeModel(levers({ offers: allOffers(true) }));
    for (const key of ["bogo", "offPeak", "deferred", "batch", "fsp", "q3"] as const) {
      const without = computeModel(
        levers({ offers: { ...allOffers(true), [key]: false } }),
      );
      expect(without.final).toBeGreaterThan(all.final);
    }
  });

  it("without BOGO the spike share stays on Priority PayGo at 1.8x", () => {
    const mix = { spike: 0.5, offPeak: 0, deferred: 0, batch: 0 };
    const on = computeModel(
      sized(600, 600, { paygoMix: mix, offers: { ...allOffers(false), bogo: true } }),
    );
    const off = computeModel(
      sized(600, 600, { paygoMix: mix, offers: allOffers(false) }),
    );
    expect(off.final - on.final).toBeCloseTo(paygoUnitFor(600) * 0.5 * 0.8, 6);
  });

  it("BOGO needs 200 PT GSUs and is ignored below that", () => {
    const small = computeModel(sized(150, 600, { offers: allOffers(true) }));
    expect(small.bogoEligible).toBe(false);
    const withoutBogo = computeModel(
      sized(150, 600, { offers: { ...allOffers(true), bogo: false } }),
    );
    expect(small.final).toBeCloseTo(withoutBogo.final, 9);
    expect(computeModel(sized(BOGO_MIN_GSUS, 600)).bogoEligible).toBe(true);
  });
});

describe("GSU Q3 offer tiers", () => {
  it("qualification is by PT GSU count", () => {
    expect(qualifyingTier(2500)?.id).toBe("gsu2000");
    expect(qualifyingTier(2000)?.id).toBe("gsu2000");
    expect(qualifyingTier(1999)?.id).toBe("gsu500");
    expect(qualifyingTier(500)?.id).toBe("gsu500");
    expect(qualifyingTier(499)).toBeNull();
  });

  it("the 2,000+ tier is a fixed 30% plus 10% credits", () => {
    const r = computeModel(sized(2400, 600));
    expect(r.q3Tier?.id).toBe("gsu2000");
    expect(r.q3AppliedDiscount).toBe(0.3);
    expect(r.q3AppliedCredits).toBe(0.1);
    expect(r.gsu.afterQ3Discount).toBeCloseTo(r.gsu.afterCommit * 0.7, 9);
    expect(r.gsu.credits).toBeCloseTo(r.gsu.afterCommit * 0.7 * 0.1, 9);
    // The fixed tier ignores the band slider.
    expect(computeModel(sized(2400, 600, { q3Discount: 0.02 })).final).toBeCloseTo(
      r.final,
      9,
    );
    expect(r.gsusToNextTier).toBeNull();
  });

  it("the 500+ tier is a band capped at 15%, plus 10% credits", () => {
    const at = (q3Discount: number) =>
      computeModel(sized(900, 600, { q3Discount }));
    expect(at(0.15).q3Tier?.id).toBe("gsu500");
    expect(at(0.15).q3AppliedDiscount).toBe(0.15);
    expect(at(0.4).q3AppliedDiscount).toBe(0.15); // clamped to the band
    expect(at(0.05).q3AppliedDiscount).toBe(0.05);
    expect(at(0.15).q3AppliedCredits).toBe(0.1);
    expect(at(0.15).gsusToNextTier).toBe(2000 - 900);
  });

  it("below 500 PT GSUs no tier applies even when elected", () => {
    const r = computeModel(sized(300, 600));
    expect(r.q3Tier).toBeNull();
    expect(r.q3AppliedDiscount).toBe(0);
    expect(r.s6).toBeCloseTo(r.s5, 9);
    expect(r.gsusToNextTier).toBe(200);
  });

  it("credits apply after the discount, on PT spend only", () => {
    const r = computeModel(sized(2400, 600));
    const without = computeModel(
      sized(2400, 600, { offers: { ...DEFAULT_LEVERS.offers, q3: false } }),
    );
    const discount = r.gsu.afterCommit * r.q3AppliedDiscount;
    const credits = (r.gsu.afterCommit - discount) * r.q3AppliedCredits;
    expect(without.final - r.final).toBeCloseTo(discount + credits, 9);
  });
});

describe("Traffic split and TPM", () => {
  it("volume and spend shares each sum to 1", () => {
    const r = computeModel(DEFAULT_LEVERS);
    expect(r.traffic.ptShareOfVolume + r.traffic.paygoShareOfVolume).toBeCloseTo(1, 9);
    expect(r.traffic.ptShareOfSpend + r.traffic.paygoShareOfSpend).toBeCloseTo(1, 9);
  });

  it("PT consumption and idle capacity reconcile with what is billed", () => {
    const r = computeModel(sized(1000, 600, { ptUtilization: 0.8 }));
    expect(r.traffic.ptConsumed).toBeCloseTo(800, 9);
    expect(r.traffic.idleGsus).toBeCloseTo(200, 9);
    // Billing follows capacity, not consumption.
    expect(r.ptReference).toBeCloseTo(1000 * P_LIST, 9);
  });

  it("the request round-trips through the GSU conversion", () => {
    const l = sized(500, 250);
    const perGsu = effectiveTpmPerGsu(l);
    const r = computeModel(l);
    expect(r.traffic.ptGsus).toBe(500);
    expect(r.traffic.ptCapacityTpm).toBeCloseTo(500 * perGsu, 6);
    expect(r.traffic.paygoTpm).toBeCloseTo(250 * perGsu, 6);
    expect(r.traffic.totalTpm).toBeCloseTo(750 * perGsu, 6);
  });

  it("a chattier workload needs more GSUs for the same raw token count", () => {
    // Burndown, not volume: output burns at 5x, so shifting the mix towards
    // output raises the reservation without a single extra raw token.
    const request = { tpm: 60_000_000, ptShare: 1, ptUtilization: 1 };
    const lean = computeModel(levers({ ...request, outputShare: 0 }));
    const chatty = computeModel(levers({ ...request, outputShare: 0.5 }));
    expect(lean.sizing.burndownWeight).toBeCloseTo(1, 9);
    expect(chatty.sizing.burndownWeight).toBeCloseTo(3, 9);
    // Compared before the purchase-increment rounding, which is a ceiling and
    // so not multiplicative — 3x the demand is not always 3x the rounded order.
    expect(chatty.sizing.ptDemandGsus).toBeCloseTo(
      lean.sizing.ptDemandGsus * 3,
      6,
    );
    expect(chatty.traffic.ptGsus).toBeGreaterThan(lean.traffic.ptGsus * 2.99);
    expect(chatty.traffic.totalTpm).toBe(lean.traffic.totalTpm);
  });

  it("a model with no published throughput falls back, and says so", () => {
    const r = computeModel(
      levers({ modelId: "gemini-3-5-flash-lite", tpmPerGsu: 40_000 }),
    );
    expect(r.sizing.throughputIsPublished).toBe(false);
    expect(r.sizing.tpmPerGsu).toBe(40_000);
  });

  it("a zero-volume scenario stays finite", () => {
    const r = computeModel(sized(0, 0));
    expect(Number.isFinite(r.final)).toBe(true);
    expect(r.final).toBe(0);
    expect(r.savingPct).toBe(0);
    expect(r.blendedMultiplier).toBe(0);
  });
});

describe("Incremental commit", () => {
  it("reports monthly spend and the total across the term", () => {
    for (const term of ["1m", "3m", "1y"] as const) {
      const r = computeModel(levers({ term }));
      expect(r.commit.total).toBeCloseTo(r.commit.monthly * r.commit.months, 9);
    }
    expect(computeModel(levers({ term: "1m" })).commit.months).toBe(1);
    expect(computeModel(levers({ term: "3m" })).commit.months).toBe(3);
    expect(computeModel(levers({ term: "1y" })).commit.months).toBe(12);
  });

  it("the commit is the PT line only, never the whole bill", () => {
    expect(computeModel(levers()).commit.monthly).toBeLessThan(
      computeModel(levers()).final,
    );
  });
});

describe("Commitment layer", () => {
  it("the 1-year term reprices the PT line by the published ratio", () => {
    const base = computeModel(levers({ term: "1m", offers: allOffers(false) }));
    const year = computeModel(levers({ term: "1y", offers: allOffers(false) }));
    const ratio = GSU_TERM_PRICE["1y"] / GSU_TERM_PRICE["1m"];
    expect(year.gsu.afterCommit).toBeCloseTo(base.gsu.afterCommit * ratio, 9);
  });

  it("FSP and the GCP commit discount do not stack — best of the two wins", () => {
    const r = computeModel(levers({ fspRate: 0.2, gcpCommit: 0.1 }));
    expect(r.gsu.appliedDiscount).toBe("fsp");
    expect(r.gsu.appliedDiscountRate).toBeCloseTo(0.2, 12);

    const g = computeModel(levers({ fspRate: 0.1, gcpCommit: 0.25 }));
    expect(g.gsu.appliedDiscount).toBe("gcp");
    expect(g.gsu.afterCommit).toBeCloseTo(g.gsu.atList * 0.75, 9);
  });

  it("attribution components are non-negative and sum to the total saving", () => {
    const r = computeModel(
      sized(2400, 600, { term: "1y", gcpCommit: 0.25, fspRate: 0.1 }),
    );
    const { bogo, placement, fsp, gsuCommit, q3, total } = r.attribution;
    for (const part of [bogo, placement, fsp, gsuCommit, q3]) {
      expect(part).toBeGreaterThanOrEqual(-1e-9);
    }
    expect(bogo + placement + fsp + gsuCommit + q3).toBeCloseTo(total, 9);
    expect(total).toBeCloseTo(r.reference - r.final, 9);
  });

  it("commitment levers do nothing with no PT", () => {
    const a = computeModel(sized(0, 600));
    const b = computeModel(sized(0, 600, { term: "1y", gcpCommit: 0.3 }));
    expect(b.final).toBeCloseTo(a.final, 9);
  });
});

describe("Property — monotonicity", () => {
  it("more off-peak placement never costs more", () => {
    let prev = Infinity;
    for (let offPeak = 0; offPeak <= 0.6; offPeak += 0.05) {
      const r = computeModel(levers({ paygoMix: { spike: 0.1, offPeak, deferred: 0, batch: 0 } }));
      expect(r.final).toBeLessThanOrEqual(prev + 1e-9);
      prev = r.final;
    }
  });

  it("a deeper GCP commit discount never costs more", () => {
    let prev = Infinity;
    for (const gcpCommit of [0, 0.1, 0.2, 0.3]) {
      const final = computeModel(levers({ gcpCommit })).final;
      expect(final).toBeLessThanOrEqual(prev + 1e-9);
      prev = final;
    }
  });

  it("a bigger harness share always costs more", () => {
    let prev = -Infinity;
    for (const harness of [0, 0.1, 0.2, 0.3, 0.4, 0.5]) {
      const final = computeModel(levers({ harness })).final;
      expect(final).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = final;
    }
  });

  it("more PT capacity always costs more up front", () => {
    let prev = -Infinity;
    for (const ptGsus of [0, 500, 1000, 2000, 3000]) {
      const reference = computeModel(sized(ptGsus, 0)).reference;
      expect(reference).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = reference;
    }
  });
});

describe("Model integrity", () => {
  it("steps are internally consistent", () => {
    const r = computeModel(sized(2400, 600, { term: "1y", gcpCommit: 0.15 }));
    for (let i = 1; i < r.steps.length; i += 1) {
      expect(r.steps[i].delta).toBeCloseTo(r.steps[i].value - r.steps[i - 1].value, 9);
      expect(r.steps[i].cumulativeSavingPct).toBeCloseTo(
        1 - r.steps[i].value / r.reference,
        9,
      );
    }
    expect(r.steps[0].value).toBeCloseTo(r.reference, 9);
    expect(r.steps[r.steps.length - 1].value).toBeCloseTo(r.final, 9);
  });

  it("never returns NaN across the lever space", () => {
    const grid: Levers[] = [];
    for (const ptGsus of [0, 600, 5000])
      for (const paygoGsus of [0, 600, 5000])
        for (const ptUtilization of [0.4, 0.85, 1])
          for (const harness of [0, 0.5])
            for (const term of ["1m", "1y"] as const)
              for (const on of [true, false])
                grid.push(
                  sized(ptGsus, paygoGsus, {
                    ptUtilization,
                    harness,
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
      expect(Number.isFinite(r.commit.total)).toBe(true);
      expect(r.final).toBeGreaterThanOrEqual(-1e-9);
      expect(r.final).toBeLessThanOrEqual(r.reference + 1e-9);
    }
  });

  it("is pure and does not mutate its input", () => {
    const l = levers({ gcpCommit: 0.2 });
    const before = JSON.stringify(l);
    expect(computeModel(l).final).toBe(computeModel(l).final);
    expect(JSON.stringify(l)).toBe(before);
  });

  it("tier specs are ordered from largest threshold down", () => {
    for (let i = 1; i < Q3_TIERS.length; i += 1) {
      expect(Q3_TIERS[i - 1].minGsus).toBeGreaterThan(Q3_TIERS[i].minGsus);
    }
  });
});

describe("Simple and Pro are one scenario", () => {
  const scenarios: Levers[] = [
    normalizeForSimple(DEFAULT_LEVERS),
    normalizeForSimple(
      sized(2000, 800, { ptUtilization: 0.7, term: "1y" }),
    ),
    normalizeForSimple(
      sized(150, 1850, { gcpCommit: 0.25, offers: allOffers(false) }),
    ),
  ];

  it("round-trips the two simple inputs without moving the number", () => {
    for (const scenario of scenarios) {
      const round = leversFromSimple(simpleFromLevers(scenario), scenario);
      expect(round).toEqual(scenario);
      expect(computeModel(round).final).toBeCloseTo(
        computeModel(scenario).final,
        9,
      );
    }
  });

  it("keeps everything simple mode does not expose", () => {
    const base = levers({
      ptUtilization: 0.62,
      term: "3m",
      fspRate: 0.14,
      harness: 0.4,
      gcpCommit: 0.18,
      q3Discount: 0.09,
      tpmPerGsu: 90_000,
    });
    const from = simpleFromLevers(base);
    const next = leversFromSimple(
      { ...from, tpm: 180_000_000, ptShare: 0.4 },
      base,
    );
    expect(next.ptUtilization).toBe(0.62);
    expect(next.term).toBe("3m");
    expect(next.fspRate).toBe(0.14);
    expect(next.harness).toBe(0.4);
    expect(next.gcpCommit).toBe(0.18);
    expect(next.q3Discount).toBe(0.09);
    expect(next.tpmPerGsu).toBe(90_000);
    expect(next.modelId).toBe(base.modelId);
    expect(next.outputShare).toBe(base.outputShare);
    // ...while moving only what it does expose.
    expect(next.tpm).toBe(180_000_000);
    expect(next.ptShare).toBe(0.4);
  });

  it("carries the PayGo split, which the concessions act on", () => {
    const base = normalizeForSimple(DEFAULT_LEVERS);
    const from = simpleFromLevers(base);
    expect(from.paygoMix).toEqual({
      offPeak: base.paygoMix.offPeak,
      deferred: base.paygoMix.deferred,
      batch: base.paygoMix.batch,
    });
    const moved = leversFromSimple(
      { ...from, paygoMix: { offPeak: 0.6, deferred: 0.1, batch: 0.05 } },
      base,
    );
    expect(moved.paygoMix).toEqual({
      spike: 0,
      offPeak: 0.6,
      deferred: 0.1,
      batch: 0.05,
    });
    // Moving traffic into a 0.5x tier can only help.
    expect(computeModel(moved).final).toBeLessThan(computeModel(base).final);
  });

  it("splits the request exactly — PT and PayGo TPM always reconcile", () => {
    for (const tpm of [1_000_000, 72_000_000, 333_000_000])
      for (const ptShare of [0, 0.33, 0.5, 0.666, 1]) {
        const l = leversFromSimple({
          ...simpleFromLevers(DEFAULT_LEVERS),
          tpm,
          ptShare,
        });
        const t = computeModel(l).traffic;
        expect(t.ptUsedTpm + t.paygoTpm).toBeCloseTo(tpm, 6);
      }
  });

  it("normalizing for simple mode is idempotent and drops only spike + BOGO", () => {
    const once = normalizeForSimple(DEFAULT_LEVERS);
    expect(once.paygoMix.spike).toBe(0);
    expect(once.offers.bogo).toBe(false);
    expect(normalizeForSimple(once)).toEqual(once);
    expect(once.paygoMix.offPeak).toBe(DEFAULT_LEVERS.paygoMix.offPeak);
    expect(once.ptUtilization).toBe(DEFAULT_LEVERS.ptUtilization);
  });

  it("leaves BOGO with nothing to do once normalized", () => {
    const r = computeModel({
      ...normalizeForSimple(DEFAULT_LEVERS),
      offers: { ...normalizeForSimple(DEFAULT_LEVERS).offers, bogo: true },
    });
    expect(r.s1).toBeCloseTo(r.reference, 9);
  });
});

describe("electedSteps", () => {
  it("keeps the reference and every step that moved", () => {
    const r = computeModel(DEFAULT_LEVERS);
    const kept = electedSteps(r.steps);
    expect(kept[0].id).toBe("reference");
    expect(kept.every((s) => s.index === 0 || s.elected)).toBe(true);
  });

  it("drops exactly the steps whose bar equals the one before it", () => {
    const r = computeModel(levers({ offers: allOffers(false), term: "1m" }));
    // Nothing elected: every concession is a no-op, so only the reference
    // survives and the final equals the reference.
    expect(electedSteps(r.steps).map((s) => s.id)).toEqual(["reference"]);
    expect(r.final).toBeCloseTo(r.reference, 9);
  });

  it("never changes the endpoints of the chain it charts", () => {
    for (const term of ["1m", "3m", "1y"] as const)
      for (const on of [true, false]) {
        const r = computeModel(levers({ term, offers: allOffers(on) }));
        const kept = electedSteps(r.steps);
        expect(kept[0].value).toBeCloseTo(r.reference, 9);
        expect(kept[kept.length - 1].value).toBeCloseTo(r.final, 9);
      }
  });

  it("drops a concession the moment it is unelected, and only that one", () => {
    const all = computeModel(levers({ term: "1y", offers: allOffers(true) }));
    const withoutFsp = computeModel(
      levers({ term: "1y", offers: { ...allOffers(true), fsp: false } }),
    );
    const before = electedSteps(all.steps).map((s) => s.id);
    const after = electedSteps(withoutFsp.steps).map((s) => s.id);
    expect(before).toContain("fsp");
    expect(after).not.toContain("fsp");
    expect(after).toEqual(before.filter((id) => id !== "fsp"));
  });
});
