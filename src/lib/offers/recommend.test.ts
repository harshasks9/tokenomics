import { describe, expect, it } from "vitest";
import { DEFAULT_LEVERS, Q3_TIERS, computeModel, monthlySpendFromTpm, tpmFromMonthlySpend } from "./model";
import { recommend, talkingPoints } from "./recommend";
import { DEFAULT_WORKLOAD_ID, WORKLOADS, findWorkload, matchWorkload } from "./workloads";

describe("Spend is the seller's unit", () => {
  it("round-trips money → tokens → money", () => {
    for (const spendK of [0, 25, 300, 1200, 4000])
      for (const outputShare of [0, 0.2, 0.5]) {
        const tpm = tpmFromMonthlySpend(spendK, "gemini-3-6-flash", outputShare);
        expect(
          monthlySpendFromTpm(tpm, "gemini-3-6-flash", outputShare),
        ).toBeCloseTo(spendK, 6);
      }
  });

  it("the quoted spend is what the model calls the PayGo reference", () => {
    // Everything on PayGo at standard rates should cost what the seller typed.
    const tpm = tpmFromMonthlySpend(500, "gemini-3-6-flash", 0.2);
    const r = computeModel({
      ...DEFAULT_LEVERS,
      tpm,
      ptShare: 0,
      outputShare: 0.2,
      paygoMix: { spike: 0, offPeak: 0, deferred: 0, batch: 0 },
    });
    expect(r.reference).toBeCloseTo(500, 6);
  });

  it("a model with no published price yields no demand rather than a guess", () => {
    expect(tpmFromMonthlySpend(500, "gpt-5-4", 0.2)).toBe(0);
  });
});

describe("Workload archetypes", () => {
  it("every archetype is internally consistent", () => {
    for (const w of WORKLOADS) {
      const claimed =
        w.paygoMix.spike + w.paygoMix.offPeak + w.paygoMix.deferred + w.paygoMix.batch;
      expect(claimed).toBeLessThanOrEqual(1.0001);
      expect(w.outputShare).toBeGreaterThanOrEqual(0);
      expect(w.outputShare).toBeLessThanOrEqual(1);
      expect(w.suggestedPtShare).toBeGreaterThanOrEqual(0);
      expect(w.suggestedPtShare).toBeLessThanOrEqual(1);
      expect(w.rationale.length).toBeGreaterThan(20);
    }
  });

  it("applying an archetype makes it recognisable again", () => {
    for (const w of WORKLOADS) {
      const applied = {
        ...DEFAULT_LEVERS,
        outputShare: w.outputShare,
        paygoMix: w.paygoMix,
        harness: w.harness,
      };
      expect(matchWorkload(applied)?.id).toBe(w.id);
    }
  });

  it("an unknown id falls back rather than throwing", () => {
    expect(findWorkload("nope")).toBeDefined();
  });

  it("output-heavy archetypes need more capacity per token", () => {
    const coding = findWorkload("coding");
    const batch = findWorkload("batch");
    expect(coding.outputShare).toBeGreaterThan(batch.outputShare);
    const size = (id: string) => {
      const w = findWorkload(id);
      return computeModel({
        ...DEFAULT_LEVERS,
        tpm: 60_000_000,
        ptShare: 1,
        ptUtilization: 1,
        outputShare: w.outputShare,
      }).traffic.ptGsus;
    };
    expect(size("coding")).toBeGreaterThan(size("batch"));
  });
});

describe("The recommendation takes a position", () => {
  const base = { ...DEFAULT_LEVERS };

  it("recommends a shape for every archetype, and says why", () => {
    for (const w of WORKLOADS) {
      const rec = recommend(base, w.id);
      expect(rec.headline).toMatch(/^Commit /);
      expect(rec.headline).toContain("$");
      expect(rec.reasons.length).toBeGreaterThan(0);
    }
  });

  it("is idempotent — applying it does not change it", () => {
    const first = recommend(base, DEFAULT_WORKLOAD_ID);
    const second = recommend(first.levers, DEFAULT_WORKLOAD_ID);
    expect(second.levers).toEqual(first.levers);
  });

  it("holds back a year-long commit when the volume earns no Q3 tier", () => {
    const floor = Q3_TIERS[Q3_TIERS.length - 1].minGsus;
    const small = recommend({ ...base, tpm: 200_000 }, "batch");
    const gsus = computeModel(small.levers).traffic.ptGsus;
    expect(gsus).toBeLessThan(floor);
    expect(small.levers.term).toBe("3m");
    expect(small.levers.offers.q3).toBe(false);
    expect(small.watchOuts.join(" ")).toContain("unlock the Q3 offer");
  });

  it("commits for a year once the volume clears the floor", () => {
    const big = recommend({ ...base, tpm: 300_000_000 }, "assistant");
    expect(big.levers.term).toBe("1y");
    expect(big.levers.offers.q3).toBe(true);
  });

  it("never elects a concession the profile has no traffic for", () => {
    const rec = recommend(base, "batch"); // no spike share in this archetype
    expect(findWorkload("batch").paygoMix.spike).toBe(0);
    expect(rec.levers.offers.bogo).toBe(false);
  });

  it("flags an unpublished throughput rather than quoting it silently", () => {
    const rec = recommend({ ...base, modelId: "gemini-3-5-flash-lite" }, "mixed");
    expect(rec.watchOuts.join(" ")).toContain("modelled assumption");
  });

  it("recommending never costs the customer more than doing nothing", () => {
    for (const w of WORKLOADS) {
      const rec = recommend(base, w.id);
      const r = computeModel(rec.levers);
      expect(r.final).toBeLessThanOrEqual(r.reference + 1e-9);
      expect(r.savingPct).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("Talking points", () => {
  it("always closes on the blended outcome", () => {
    const points = talkingPoints(computeModel(recommend(DEFAULT_LEVERS, "mixed").levers));
    expect(points.length).toBeGreaterThan(0);
    expect(points[points.length - 1]).toContain("Blended");
  });

  it("does not claim a saving that was not elected", () => {
    const none = computeModel({
      ...DEFAULT_LEVERS,
      offers: { bogo: false, offPeak: false, deferred: false, batch: false, fsp: false, q3: false },
    });
    expect(talkingPoints(none).join(" ")).not.toContain("Flexible Savings Plan takes");
  });
});

describe("Advice is worth reading", () => {
  it("does not nag about a single idle GSU", () => {
    const tiny = recommend({ ...DEFAULT_LEVERS, tpm: 400_000 }, "mixed");
    expect(tiny.watchOuts.join(" ")).not.toMatch(/buys 1 GSUs?\b/);
  });

  it("still flags idle capacity once it is material", () => {
    const big = recommend({ ...DEFAULT_LEVERS, tpm: 300_000_000, ptUtilization: 0.5 }, "assistant");
    expect(big.watchOuts.join(" ")).toContain("they will not use");
  });

  it("counts in whole units without mangling the grammar", () => {
    for (const tpm of [200_000, 5_000_000, 300_000_000]) {
      const rec = recommend({ ...DEFAULT_LEVERS, tpm }, "mixed");
      // Word boundary: "131 GSUs" is fine, a bare "1 GSUs" is not.
      expect(rec.headline).not.toMatch(/\b1 GSUs\b/);
    }
  });
});
