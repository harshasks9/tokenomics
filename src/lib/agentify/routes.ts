/**
 * Agentify your Day (agentify.aitokenomics.app · /agentify) — internal, behind
 * the Deal Check passcode gate like the MDES and Korea FY27 plans.
 */
export const AGENTIFY_HOST = "agentify.aitokenomics.app";
export const AGENTIFY_PREFIX = "/agentify";

export function isAgentifyHost(hostname: string): boolean {
  return hostname.toLowerCase() === AGENTIFY_HOST;
}

export function isAgentifyPath(hostname: string, pathname: string): boolean {
  return isAgentifyHost(hostname) || pathname === AGENTIFY_PREFIX || pathname.startsWith(`${AGENTIFY_PREFIX}/`);
}

/** Browser path → App Router path. */
export function toAppPath(hostname: string, pathname: string): string {
  if (!isAgentifyHost(hostname)) return pathname;
  if (pathname === "/") return AGENTIFY_PREFIX;
  return pathname.startsWith(AGENTIFY_PREFIX) ? pathname : `${AGENTIFY_PREFIX}${pathname}`;
}
