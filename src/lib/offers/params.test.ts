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

  it("round-trips the commitment and assumption levers", () => {
    const levers: Levers = {
      ...DEFAULT_LEVERS,
      term: "1y",
      gcpCommit: 0.25,
      q3Discount: 0.1,
      tpmPerGsu: 90_000,
      modelId: "gemini-3-5-flash-lite",
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
    expect(query).toContain("d=72000000");
    expect(query).toContain("pts=50");
    expect(query).toContain("out=25");
    expect(query).toContain("u=85");
    expect(query).toContain("mix=15-30-20-10");
    expect(query).toContain("h=15");
    expect(query).toContain("fsp=20");
    expect(query).toContain("t=1m");
    expect(query).toContain("tpm=60000");
  });

  it("lets explicit params override the named preset", () => {
    const japac = PRESETS.find((p) => p.id === "japac")!;
    const params = paramsFromLevers(japac.levers, "japac");
    params.set("fsp", "10");
    const { levers, presetId } = leversFromParams(params);
    expect(presetId).toBe("japac");
    expect(levers.fspRate).toBe(0.1);
    expect(levers.paygoMix).toEqual(japac.levers.paygoMix);
  });

  it("falls back to defaults on junk instead of throwing", () => {
    const junk = new URLSearchParams(
      "pt=notanumber&pg=x&u=-5&mix=broken&h=abc&fsp=37&t=99y&gcp=&q3d=&m=nope&tpm=&preset=nope",
    );
    const { levers, presetId } = leversFromParams(junk);
    expect(presetId).toBeNull();
    expect(levers.paygoMix).toEqual(DEFAULT_LEVERS.paygoMix);
    expect(levers.modelId).toBe(DEFAULT_LEVERS.modelId);
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
      new URLSearchParams("d=999999999&pts=200&out=-30&u=200&gcp=90&q3d=90&tpm=9999999"),
    );
    expect(levers.tpm).toBeLessThanOrEqual(400_000_000);
    expect(levers.ptShare).toBeLessThanOrEqual(1);
    expect(levers.ptShare).toBeGreaterThanOrEqual(0);
    expect(levers.outputShare).toBeGreaterThanOrEqual(0);
    expect(levers.ptUtilization).toBeLessThanOrEqual(1);
    expect(levers.gcpCommit).toBeLessThanOrEqual(0.3);
    expect(levers.q3Discount).toBeLessThanOrEqual(0.3);
    expect(levers.tpmPerGsu).toBeLessThanOrEqual(400_000);
  });

  it("snaps the demand to its step", () => {
    expect(leversFromParams(new URLSearchParams("d=71400000")).levers.tpm).toBe(
      71_000_000,
    );
  });

  it("a link written before the TPM rewrite falls back rather than breaking", () => {
    // Old links carried pt=/pg= GSU counts, which no longer exist as inputs.
    const { levers } = leversFromParams(new URLSearchParams("pt=600&pg=600"));
    expect(levers.tpm).toBe(DEFAULT_LEVERS.tpm);
    expect(levers.ptShare).toBe(DEFAULT_LEVERS.ptShare);
  });

  it("only accepts a selectable model id", () => {
    expect(
      leversFromParams(new URLSearchParams("m=claude-sonnet")).levers.modelId,
    ).toBe(DEFAULT_LEVERS.modelId);
    expect(
      leversFromParams(new URLSearchParams("m=gemini-2-5-pro")).levers.modelId,
    ).toBe("gemini-2-5-pro");
  });
});
