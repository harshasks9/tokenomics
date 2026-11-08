/**
 * ANTHROPIC: UNDER THE HOOD (ants1.aitokenomics.app · /under-the-hood) — host-aware routing.
 *
 * The brief named ants1.aitokenomics.com; the rest of the family (and the only
 * apex on the Vercel team) is aitokenomics.app, so both hosts are routed here,
 * as the MODELCOMP block in src/proxy.ts does.
 */
export const UNDER_THE_HOOD_HOSTS = ["ants1.aitokenomics.app", "ants1.aitokenomics.com"] as const;
export const UNDER_THE_HOOD_PREFIX = "/under-the-hood";

export function isUnderTheHoodHost(hostname: string): boolean {
  return (UNDER_THE_HOOD_HOSTS as readonly string[]).includes(hostname.toLowerCase());
}

/**
 * Browser path → App Router path on an ants1 host. "/" serves the teardown;
 * "/google-cloud-gtm" serves the companion page. Paths already under the
 * prefix (the site's own absolute links) and API routes pass through.
 */
export function toAppPath(pathname: string): string {
  if (pathname === "/") return UNDER_THE_HOOD_PREFIX;
  if (pathname === UNDER_THE_HOOD_PREFIX || pathname.startsWith(`${UNDER_THE_HOOD_PREFIX}/`) || pathname.startsWith("/api/")) return pathname;
  return `${UNDER_THE_HOOD_PREFIX}${pathname}`;
}
