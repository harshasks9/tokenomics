/**
 * Agentify your Day — domain types.
 * Synthetic demo data; the server projects it per persona (views.ts) so the
 * customer and partner experiences never receive internal plan, revenue or
 * accountability content.
 */

export type PersonaId = "customer" | "partner" | "google";

export type EditionId =
  | "business-starter"
  | "business-standard"
  | "business-plus"
  | "enterprise-starter"
  | "enterprise-standard"
  | "enterprise-plus";

export interface Edition {
  id: EditionId;
  name: string;
  pupm: number; // list price per user per month, annual commitment
  entitlement: number; // indicative Gemini agent entitlement per user per month (not pooled)
  betaFirstWave: boolean; // first access in the Q4 Gemini Beta rollout
}

export type Stage = "qualified" | "scheduled" | "agentified" | "using" | "expanding";

export interface Team {
  name: string;
  seatShare: number; // share of seats
  intensity: number; // usage multiplier vs org baseline
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  subRegion: string;
  edition: EditionId;
  seats: number;
  geminiBeta: boolean; // Gemini Beta admin setting enabled
  sovereign: boolean; // Sovereign Controls — out of scope for the beta
  partnerId: string | null;
  /** Deterministic usage generator: share of seats with any agentic task, and scale of tasks/week. */
  usage: { seed: number; activeShare: number; scale: number };
  teams: Team[];
  /** Use cases in use today: id → share of active users using it. */
  useCases: Record<string, number>;
  stage: Stage;
  workshopWeek?: number;
  enabled: string[];
  credits: number; // POC credits allocated (USD)
  newUsers: number; // new users onboarded on POC credits
  notes: string;
}

export interface Partner {
  id: string;
  name: string;
  subRegion: string;
  lead: string;
  focus: string;
}

export interface UseCaseMeta {
  id: string;
  slug: string;
  title: string;
  owner: string;
  ownerKind: "google" | "partner";
  version: string;
  summary: string;
  surfaces: string[];
}

export type Action =
  | { type: "workshop.register"; accountId: string; week: number }
  | { type: "workshop.complete"; accountId: string; useCaseIds: string[] }
  | { type: "account.advance"; accountId: string; to: Stage }
  | { type: "usecase.enable"; accountId: string; useCaseId: string }
  | { type: "credits.allocate"; accountId: string; newUsers: number }
  | { type: "account.assign"; accountId: string; partnerId: string };

export interface Event {
  actor: PersonaId;
  action: Action;
}

export interface World {
  seq: number;
  accounts: Account[];
  creditsUsed: number;
  log: { seq: number; actor: PersonaId; text: string; accountId?: string }[];
}
