/**
 * Korea AI FY27 plan — host-aware routing. The plan owns the root of
 * korea.aitokenomics.app (the proxy maps "/" to /korea-fy27 and "/gate" to its
 * passcode page) and also lives at aitokenomics.app/korea-fy27/…
 *
 * The Global Sae-A customer microsite keeps its own route at /korea, so
 * korea.aitokenomics.app/korea still serves it, ungated.
 *
 * Access reuses the Deal Check passcode gate (same cookie, same passcode),
 * like the MDES planner.
 */

export const KOREA_HOST = "korea.aitokenomics.app";
export const KOREA_FY27_PREFIX = "/korea-fy27";
export const KOREA_FY27_GATE = `${KOREA_FY27_PREFIX}/gate`;

export function isKoreaHost(hostname: string): boolean {
  return hostname.toLowerCase() === KOREA_HOST;
}

/** True for any path that belongs to the plan site, on either host. */
export function isKoreaFy27Path(hostname: string, pathname: string): boolean {
  if (pathname === KOREA_FY27_PREFIX || pathname.startsWith(`${KOREA_FY27_PREFIX}/`)) return true;
  return isKoreaHost(hostname) && (pathname === "/" || pathname === "/gate");
}

/** Browser path → App Router path. */
export function toAppPath(hostname: string, pathname: string): string {
  if (isKoreaHost(hostname)) {
    if (pathname === "/") return KOREA_FY27_PREFIX;
    if (pathname === "/gate") return KOREA_FY27_GATE;
  }
  return pathname;
}

/** The one plan page that must stay reachable while locked out. */
export function isGatePath(hostname: string, pathname: string): boolean {
  return toAppPath(hostname, pathname) === KOREA_FY27_GATE;
}

/** Where a locked-out visitor is sent: the short path on the Korea host. */
export function gatePathFor(hostname: string): string {
  return isKoreaHost(hostname) ? "/gate" : KOREA_FY27_GATE;
}

/** Where the plan itself lives for this host. */
export function homePathFor(hostname: string): string {
  return isKoreaHost(hostname) ? "/" : KOREA_FY27_PREFIX;
}
