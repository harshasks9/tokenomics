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

  it("round-trips the GSU levers", () => {
    const levers: Levers = {
      ...DEFAULT_LEVERS,
      term: "1y",
      gcp: 0.25,
      inc: 0.1,
      cr: 0.05,
    };
    expect(roundTrip(levers).levers).toEqual(levers);
  });

  it("produces the documented query shape", () => {
    const query = paramsFromLevers(DEFAULT_LEVERS).toString();
    expect(query).toContain("n=1000");
    expect(query).toContain("u0=55");
    expect(query).toContain("u1=85");
    expect(query).toContain("mix=55-7-18-14-6");
    expect(query).toContain("h=15");
    expect(query).toContain("d=20");
    expect(query).toContain("t=1m");
  });

  it("lets explicit params override the named preset", () => {
    const japac = PRESETS.find((p) => p.id === "japac")!;
    const params = paramsFromLevers(japac.levers, "japac");
    params.set("d", "0");
    const { levers, presetId } = leversFromParams(params);
    expect(presetId).toBe("japac");
    expect(levers.d).toBe(0);
    expect(levers.mix).toEqual(japac.levers.mix);
  });

  it("falls back to defaults on junk instead of throwing", () => {
    const junk = new URLSearchParams(
      "n=notanumber&u0=999&u1=-5&mix=broken&h=abc&d=37&t=99y&g=&inc=&cr=&preset=nope",
    );
    const { levers, presetId } = leversFromParams(junk);
    expect(presetId).toBeNull();
    expect(levers.mix).toEqual(DEFAULT_LEVERS.mix);
    expect(levers.term).toBe(DEFAULT_LEVERS.term);
    expect(levers.d).toBe(DEFAULT_LEVERS.d); // 37 is not a valid FSP tier
    expect(levers.h).toBe(DEFAULT_LEVERS.h);
    expect(Number.isFinite(computeModel(levers).final)).toBe(true);
  });

  it("clamps out-of-range values into the lever ranges", () => {
    const { levers } = leversFromParams(
      new URLSearchParams("n=99999&u0=5&u1=200&g=90&inc=90&cr=90"),
    );
    expect(levers.n0).toBeLessThanOrEqual(5000);
    expect(levers.n0).toBeGreaterThanOrEqual(100);
    expect(levers.u0).toBeGreaterThanOrEqual(0.35);
    expect(levers.u1).toBeLessThanOrEqual(0.98);
    expect(levers.gcp).toBeLessThanOrEqual(0.3);
    expect(levers.inc).toBeLessThanOrEqual(0.3);
    expect(levers.cr).toBeLessThanOrEqual(0.2);
  });

  it("snaps N0 to its 50-GSU step", () => {
    expect(leversFromParams(new URLSearchParams("n=1237")).levers.n0).toBe(1250);
  });
});
