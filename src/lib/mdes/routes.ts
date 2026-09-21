/**
 * MDES planner — host-aware routing. Lives at `mdes.aitokenomics.app/…` (the
 * proxy adds the /mdes prefix) and at `aitokenomics.app/mdes/…`.
 *
 * Access reuses the Deal Check passcode gate (same cookie, same passcode), so
 * one internal passcode covers both account tools.
 */

export const MDES_HOST = "mdes.aitokenomics.app";
export const MDES_PREFIX = "/mdes";

export function isMdesHost(hostname: string): boolean {
  return hostname.toLowerCase() === MDES_HOST;
}

/** "" on the dedicated subdomain, "/mdes" everywhere else. */
export function basePathFor(hostname: string): string {
  return isMdesHost(hostname) ? "" : MDES_PREFIX;
}

/** Browser path → App Router path. */
export function toAppPath(hostname: string, pathname: string): string {
  if (!isMdesHost(hostname)) return pathname;
  if (pathname === "/") return MDES_PREFIX;
  if (pathname === MDES_PREFIX || pathname.startsWith(`${MDES_PREFIX}/`)) return pathname;
  return `${MDES_PREFIX}${pathname}`;
}

/** True for any path that belongs to this microsite, on either host. */
export function isMdesPath(hostname: string, pathname: string): boolean {
  return isMdesHost(hostname) || pathname === MDES_PREFIX || pathname.startsWith(`${MDES_PREFIX}/`);
}
