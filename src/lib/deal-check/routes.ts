/**
 * Deal check — host-aware routing. The site lives at
 * `dealcheck.aitokenomics.app/…` (the proxy adds the /deal-check prefix) and at
 * `aitokenomics.app/deal-check/…` (already prefixed).
 */

export const DEALCHECK_HOST = "dealcheck.aitokenomics.app";
export const DEALCHECK_PREFIX = "/deal-check";

export function isDealCheckHost(hostname: string): boolean {
  return hostname.toLowerCase() === DEALCHECK_HOST;
}

/** "" on the dedicated subdomain, "/deal-check" everywhere else. */
export function basePathFor(hostname: string): string {
  return isDealCheckHost(hostname) ? "" : DEALCHECK_PREFIX;
}

/** Normalises `x-forwarded-host` / `host` down to a bare hostname. */
export function hostnameFrom(headers: { get(name: string): string | null }): string {
  const raw = headers.get("x-forwarded-host") ?? headers.get("host") ?? "";
  return raw.split(":")[0].toLowerCase();
}

/** Browser path → App Router path. */
export function toAppPath(hostname: string, pathname: string): string {
  if (!isDealCheckHost(hostname)) return pathname;
  if (pathname === "/") return DEALCHECK_PREFIX;
  return `${DEALCHECK_PREFIX}${pathname}`;
}

/** True for any path that belongs to this microsite, on either host. */
export function isDealCheckPath(hostname: string, pathname: string): boolean {
  return isDealCheckHost(hostname) || pathname === DEALCHECK_PREFIX || pathname.startsWith(`${DEALCHECK_PREFIX}/`);
}

/** The one page inside the gate that must stay reachable while locked out. */
export function isGatePath(hostname: string, pathname: string): boolean {
  return toAppPath(hostname, pathname) === `${DEALCHECK_PREFIX}/gate`;
}
