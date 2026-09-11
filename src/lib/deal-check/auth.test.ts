import { afterEach, describe, expect, it } from "vitest";
import { createSessionToken, isGateConfigured, isSessionValid, safeNextPath, sha256Hex, timingSafeEqualHex } from "./auth";
import { basePathFor, isDealCheckPath, isGatePath, toAppPath } from "./routes";

describe("deal-check gate", () => {
  const env = { ...process.env };
  afterEach(() => { process.env = { ...env }; });

  it("tokens are deterministic per secret and differ across secrets", async () => {
    const a = await createSessionToken("secret-a"), b = await createSessionToken("secret-a"), c = await createSessionToken("secret-b");
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });
  it("an unconfigured gate never validates a cookie", async () => {
    delete process.env.SESSION_SECRET; delete process.env.DEALCHECK_SESSION_SECRET; delete process.env.DEALCHECK_PASSCODE;
    expect(isGateConfigured()).toBe(false);
    expect(await isSessionValid(await createSessionToken("anything"))).toBe(false);
  });
  it("validates only the cookie minted from the configured secret", async () => {
    process.env.DEALCHECK_PASSCODE = "x"; process.env.SESSION_SECRET = "site-wide";
    expect(isGateConfigured()).toBe(true);
    expect(await isSessionValid(await createSessionToken("site-wide"))).toBe(true);
    expect(await isSessionValid(await createSessionToken("other"))).toBe(false);
    process.env.DEALCHECK_SESSION_SECRET = "dedicated";
    expect(await isSessionValid(await createSessionToken("site-wide"))).toBe(false);
    expect(await isSessionValid(await createSessionToken("dedicated"))).toBe(true);
  });
  it("hashes and compares in constant width", async () => {
    expect((await sha256Hex("Q")).length).toBe(64);
    expect(timingSafeEqualHex("abcd", "abcd")).toBe(true);
    expect(timingSafeEqualHex("abcd", "abce")).toBe(false);
    expect(timingSafeEqualHex("abc", "abcd")).toBe(false);
  });
  it("rejects open redirects", () => {
    expect(safeNextPath("/deal-check?x=1")).toBe("/deal-check?x=1");
    expect(safeNextPath("//evil.example")).toBe("/deal-check");
    expect(safeNextPath("https://evil.example")).toBe("/deal-check");
    expect(safeNextPath(undefined, "/")).toBe("/");
  });
  it("maps hosts and paths", () => {
    expect(basePathFor("dealcheck.aitokenomics.app")).toBe("");
    expect(basePathFor("aitokenomics.app")).toBe("/deal-check");
    expect(toAppPath("dealcheck.aitokenomics.app", "/")).toBe("/deal-check");
    expect(toAppPath("dealcheck.aitokenomics.app", "/gate")).toBe("/deal-check/gate");
    expect(toAppPath("aitokenomics.app", "/deal-check/gate")).toBe("/deal-check/gate");
    expect(isDealCheckPath("aitokenomics.app", "/deal-check")).toBe(true);
    expect(isDealCheckPath("aitokenomics.app", "/deal-checker")).toBe(false);
    expect(isDealCheckPath("dealcheck.aitokenomics.app", "/anything")).toBe(true);
    expect(isGatePath("dealcheck.aitokenomics.app", "/gate")).toBe(true);
    expect(isGatePath("aitokenomics.app", "/deal-check/gate")).toBe(true);
    expect(isGatePath("aitokenomics.app", "/deal-check")).toBe(false);
  });
});
