/**
 * Offers — host-aware routing.
 *
 * The site lives at two addresses: `offers.aitokenomics.app/…` (where the proxy
 * strips the prefix, so the browser sees `/playbook`) and
 * `aitokenomics.app/offers/…` (where it doesn't). Every internal link is built
 * from `basePathFor(host)` so both read correctly.
 */

export const OFFERS_HOST = "offers.aitokenomics.app";

/** App-router path prefix for the microsite. */
export const OFFERS_PREFIX = "/offers";

export function isOffersHost(hostname: string): boolean {
  return hostname.toLowerCase() === OFFERS_HOST;
}

/** "" on the dedicated subdomain, "/offers" everywhere else. */
export function basePathFor(hostname: string): string {
  return isOffersHost(hostname) ? "" : OFFERS_PREFIX;
}

/** Normalises `x-forwarded-host` / `host` down to a bare hostname. */
export function hostnameFrom(headers: {
  get(name: string): string | null;
}): string {
  const raw =
    headers.get("x-forwarded-host") ?? headers.get("host") ?? "";
  return raw.split(":")[0].toLowerCase();
}

/**
 * Browser path → App Router path. On the subdomain `/playbook` is really
 * `/offers/playbook`; everywhere else the path is already correct.
 */
export function toAppPath(hostname: string, pathname: string): string {
  if (!isOffersHost(hostname)) return pathname;
  if (pathname === "/") return OFFERS_PREFIX;
  return `${OFFERS_PREFIX}${pathname}`;
}

/** True for any path that belongs to this microsite, on either host. */
export function isOffersPath(hostname: string, pathname: string): boolean {
  return isOffersHost(hostname) || pathname === OFFERS_PREFIX || pathname.startsWith(`${OFFERS_PREFIX}/`);
}

/** The one page inside the gate that must stay reachable while locked out. */
export function isGatePath(hostname: string, pathname: string): boolean {
  const appPath = toAppPath(hostname, pathname);
  return appPath === `${OFFERS_PREFIX}/gate`;
}
