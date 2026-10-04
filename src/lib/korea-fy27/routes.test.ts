import { describe, expect, it } from "vitest";
import { gatePathFor, homePathFor, isGatePath, isKoreaFy27Path, toAppPath } from "./routes";

const KOREA = "korea.aitokenomics.app";
const APEX = "aitokenomics.app";

describe("korea.aitokenomics.app routing", () => {
  it("the root and /gate belong to the plan; /korea stays with Sae-A", () => {
    expect(isKoreaFy27Path(KOREA, "/")).toBe(true);
    expect(isKoreaFy27Path(KOREA, "/gate")).toBe(true);
    expect(isKoreaFy27Path(KOREA, "/korea")).toBe(false);
    expect(isKoreaFy27Path(KOREA, "/prudential")).toBe(false);
    expect(isKoreaFy27Path(KOREA, "/korea-fy27")).toBe(true);
  });

  it("maps browser paths to app routes", () => {
    expect(toAppPath(KOREA, "/")).toBe("/korea-fy27");
    expect(toAppPath(KOREA, "/gate")).toBe("/korea-fy27/gate");
    expect(toAppPath(KOREA, "/korea-fy27/gate")).toBe("/korea-fy27/gate");
    expect(toAppPath(KOREA, "/korea")).toBe("/korea");
  });

  it("knows the gate on both hosts", () => {
    expect(isGatePath(KOREA, "/gate")).toBe(true);
    expect(isGatePath(KOREA, "/")).toBe(false);
    expect(isGatePath(APEX, "/korea-fy27/gate")).toBe(true);
    expect(gatePathFor(KOREA)).toBe("/gate");
    expect(gatePathFor(APEX)).toBe("/korea-fy27/gate");
    expect(homePathFor(KOREA)).toBe("/");
    expect(homePathFor(APEX)).toBe("/korea-fy27");
  });
});

describe("other hosts", () => {
  it("only /korea-fy27 paths belong to the plan", () => {
    expect(isKoreaFy27Path(APEX, "/")).toBe(false);
    expect(isKoreaFy27Path(APEX, "/gate")).toBe(false);
    expect(isKoreaFy27Path(APEX, "/korea")).toBe(false);
    expect(isKoreaFy27Path(APEX, "/korea-fy27")).toBe(true);
    expect(isKoreaFy27Path(APEX, "/korea-fy27/gate")).toBe(true);
    expect(isKoreaFy27Path(APEX, "/korea-fy27x")).toBe(false);
    expect(toAppPath(APEX, "/")).toBe("/");
  });
});
