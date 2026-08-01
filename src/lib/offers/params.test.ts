import { describe, expect, it } from "vitest";
import { DEFAULT_LEVERS, type Levers, computeModel } from "./model";
import { leversFromParams, paramsFromLevers } from "./params";
import { PRESETS } from "./presets";

function roundTrip(levers: Levers, presetId: string | null = null) {
  return leversFromParams(paramsFromLevers(levers, presetId));
}

describe("Shareable URLs", () => {
  it("round-trips the defaults exactly", () => {
    expect(roundTrip(DEFAULT_LEVERS).levers).toEqual(DEFAULT_LEVERS);
  });

  it("round-trips every preset, levers and id", () => {
    for (const preset of PRESETS) {
      const result = roundTrip(preset.levers, preset.id);
      expect(result.levers).toEqual(preset.levers);
      expect(result.presetId).toBe(preset.id);
      expect(computeModel(result.levers).final).toBeCloseTo(
        computeModel(preset.levers).final,
        9,
      );
    }
  });

  it("round-trips the commitment levers", () => {
    const levers: Levers = {
      ...DEFAULT_LEVERS,
      term: "1y",
      gcpCommit: 0.25,
      q3Discount: 0.1,
    };
    expect(roundTrip(levers).levers).toEqual(levers);
  });

  it("round-trips every combination of elected offers", () => {
    const keys = ["bogo", "offPeak", "deferred", "batch", "fsp", "q3"] as const;
    for (let mask = 0; mask < 1 << keys.length; mask += 1) {
      const offers = {} as Levers["offers"];
      keys.forEach((key, i) => {
        offers[key] = Boolean(mask & (1 << i));
      });
      expect(roundTrip({ ...DEFAULT_LEVERS, offers }).levers.offers).toEqual(
        offers,
      );
    }
  });

  it("produces the documented query shape", () => {
    const query = paramsFromLevers(DEFAULT_LEVERS).toString();
    expect(query).toContain("g=1000");
    expect(query).toContain("up=55");
    expect(query).toContain("ut=85");
    expect(query).toContain("mix=55-7-18-14-6");
    expect(query).toContain("h=15");
    expect(query).toContain("fsp=20");
    expect(query).toContain("t=1m");
  });

  it("lets explicit params override the named preset", () => {
    const japac = PRESETS.find((p) => p.id === "japac")!;
    const params = paramsFromLevers(japac.levers, "japac");
    params.set("fsp", "10");
    const { levers, presetId } = leversFromParams(params);
    expect(presetId).toBe("japac");
    expect(levers.fspRate).toBe(0.1);
    expect(levers.mix).toEqual(japac.levers.mix);
  });

  it("falls back to defaults on junk instead of throwing", () => {
    const junk = new URLSearchParams(
      "g=notanumber&up=999&ut=-5&mix=broken&h=abc&fsp=37&t=99y&gcp=&q3d=&preset=nope",
    );
    const { levers, presetId } = leversFromParams(junk);
    expect(presetId).toBeNull();
    expect(levers.mix).toEqual(DEFAULT_LEVERS.mix);
    expect(levers.term).toBe(DEFAULT_LEVERS.term);
    expect(levers.fspRate).toBe(DEFAULT_LEVERS.fspRate); // 37 is not a valid tier
    expect(levers.harness).toBe(DEFAULT_LEVERS.harness);
    expect(levers.offers).toEqual(DEFAULT_LEVERS.offers);
    expect(Number.isFinite(computeModel(levers).final)).toBe(true);
  });

  it("an empty offer list means nothing elected, not the default", () => {
    const { levers } = leversFromParams(new URLSearchParams("o="));
    expect(Object.values(levers.offers).every((v) => v === false)).toBe(true);
  });

  it("clamps out-of-range values into the lever ranges", () => {
    const { levers } = leversFromParams(
      new URLSearchParams("g=99999&up=5&ut=200&gcp=90&q3d=90"),
    );
    expect(levers.gsus).toBeLessThanOrEqual(5000);
    expect(levers.gsus).toBeGreaterThanOrEqual(100);
    expect(levers.uPeak).toBeGreaterThanOrEqual(0.35);
    expect(levers.uPt).toBeLessThanOrEqual(0.98);
    expect(levers.gcpCommit).toBeLessThanOrEqual(0.3);
    expect(levers.q3Discount).toBeLessThanOrEqual(0.3);
  });

  it("snaps the GSU count to its 50-GSU step", () => {
    expect(leversFromParams(new URLSearchParams("g=1237")).levers.gsus).toBe(1250);
  });
});
