import type { Account } from "./shared";
import { ACCOUNTS_INDIA_BFSI } from "./data/india-bfsi";
import { ACCOUNTS_INDIA_CONSUMER } from "./data/india-consumer";
import { ACCOUNTS_ID_PH } from "./data/indonesia-philippines";
import { ACCOUNTS_SEA } from "./data/sea";
import { ACCOUNTS_NORTH_APJ } from "./data/north-apj";

export const ALL_ACCOUNTS: Account[] = [
  ...ACCOUNTS_INDIA_BFSI,
  ...ACCOUNTS_INDIA_CONSUMER,
  ...ACCOUNTS_ID_PH,
  ...ACCOUNTS_SEA,
  ...ACCOUNTS_NORTH_APJ,
];

export function accountBySlug(slug: string) {
  return ALL_ACCOUNTS.find((a) => a.slug === slug);
}

// Composite scores for the prioritization matrix
export function businessValueScore(a: Account) {
  const s = a.scores;
  return (s.volume + s.urgency + s.expansion + s.costSensitivity) / 4;
}
export function readinessScore(a: Account) {
  const s = a.scores;
  return (s.feasibility + s.speed + s.gcpRelevance) / 3;
}
