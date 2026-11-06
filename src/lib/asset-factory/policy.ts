/**
 * Access policy — the single source of truth for who can see and do what.
 * Called by the engine (writes) and the view projection (reads), both of
 * which run on the server. The browser never receives an asset, workspace or
 * metric this module does not allow for the signed-in persona.
 */
import { ORGS, USERS } from "./data";
import type { Asset, Responsibility, User, Workspace, World } from "./types";

export class PolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolicyError";
  }
}

export function deny(reason: string): never {
  throw new PolicyError(reason);
}

export const userById = new Map(USERS.map((u) => [u.id, u]));
export const orgById = new Map(ORGS.map((o) => [o.id, o]));

export function isGoogle(user: User): boolean {
  return user.orgId === "google";
}

export function memberOf(user: User, ws: Workspace) {
  return ws.members.find((m) => m.userId === user.id);
}

export function hasResponsibility(user: User, ws: Workspace, ...any: Responsibility[]): boolean {
  const m = memberOf(user, ws);
  return Boolean(m && m.responsibilities.some((r) => any.includes(r)));
}

export function canSeeWorkspace(user: User, ws: Workspace): boolean {
  return Boolean(memberOf(user, ws));
}

/**
 * Visibility rules:
 *  public    — every authorized platform user
 *  org       — the owning organization, plus members of workspaces the owner explicitly shared it into
 *  workspace — the owning organization and members of the workspace(s) it lives in
 *  internal  — Google employees only; can never be shared out
 */
export function canViewAsset(user: User, asset: Asset, world: World): boolean {
  switch (asset.visibility) {
    case "public":
      return true;
    case "internal":
      return isGoogle(user);
    case "org":
    case "workspace": {
      if (user.orgId === asset.ownerOrgId) return true;
      return asset.sharedWorkspaceIds.some((wsId) => {
        const ws = world.workspaces.find((w) => w.id === wsId);
        return ws ? canSeeWorkspace(user, ws) : false;
      });
    }
  }
}

/** True when every current member of the workspace may see the asset. */
export function visibleToAllMembers(asset: Asset, ws: Workspace, world: World): boolean {
  return ws.members.every((m) => {
    const u = userById.get(m.userId);
    return u ? canViewAsset(u, asset, world) : false;
  });
}

const SECRET_PATTERNS = [
  /AIza[0-9A-Za-z_-]{20,}/, // API key shape
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\b(password|passwd|secret|api[_-]?key|token)\s*[:=]\s*\S+/i,
  /\b(sk|pk)_(live|test)_[0-9A-Za-z]{8,}/,
];

export interface ScanResult {
  id: string;
  label: string;
  passed: boolean;
}

/**
 * Pre-publication scan for anything that would leak into the public marketplace:
 * names of customer organizations other than the author's own, and credential-shaped strings.
 */
export function scanForPublication(text: string, authorOrgId: string): ScanResult[] {
  const customerNames = ORGS.filter((o) => o.kind === "customer" && o.id !== authorOrgId)
    .flatMap((o) => [o.name, o.name.split(" ")[0]]);
  const lower = text.toLowerCase();
  const leaked = customerNames.filter((n) => lower.includes(n.toLowerCase()));
  const secret = SECRET_PATTERNS.some((re) => re.test(text));
  return [
    { id: "identifiers", label: leaked.length ? `Customer identifiers found: ${[...new Set(leaked)].join(", ")}` : "No customer names or identifiers", passed: leaked.length === 0 },
    { id: "secrets", label: secret ? "Credential-like string found" : "No credentials or secrets", passed: !secret },
  ];
}
