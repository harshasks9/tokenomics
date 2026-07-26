import type { Account, ExcludedAccount, ProfileAccount, ProfileAnalysis } from "./shared";
import { ANALYSIS_INDIA_BFSI_A } from "./data/analysis/india-bfsi-a";
import { ANALYSIS_INDIA_BFSI_B } from "./data/analysis/india-bfsi-b";
import { ANALYSIS_INDIA_CONSUMER_A } from "./data/analysis/india-consumer-a";
import { ANALYSIS_INDIA_CONSUMER_B } from "./data/analysis/india-consumer-b";
import { ANALYSIS_ID_PH_VN_A } from "./data/analysis/id-ph-vn-a";
import { ANALYSIS_ID_PH_VN_B } from "./data/analysis/id-ph-vn-b";
import { ANALYSIS_TH_MY_SG_A } from "./data/analysis/th-my-sg-a";
import { ANALYSIS_TH_MY_SG_B } from "./data/analysis/th-my-sg-b";
import { ANALYSIS_JAPAN_A } from "./data/analysis/japan-a";
import { ANALYSIS_JAPAN_B } from "./data/analysis/japan-b";
import { ANALYSIS_KR_TW_A } from "./data/analysis/kr-tw-a";
import { ANALYSIS_KR_TW_B } from "./data/analysis/kr-tw-b";
import { ANALYSIS_HK_ANZ_A } from "./data/analysis/hk-anz-a";
import { ANALYSIS_HK_ANZ_B } from "./data/analysis/hk-anz-b";
import { ANALYSIS_GOV_EDU_BPM_A } from "./data/analysis/gov-edu-bpm-a";
import { ANALYSIS_GOV_EDU_BPM_B } from "./data/analysis/gov-edu-bpm-b";
import { ACCOUNTS_INDIA_BFSI, EXCLUDED_INDIA_BFSI } from "./data/india-bfsi";
import { ACCOUNTS_INDIA_CONSUMER, EXCLUDED_INDIA_CONSUMER } from "./data/india-consumer";
import { ACCOUNTS_ID_PH, EXCLUDED_ID_PH } from "./data/indonesia-philippines";
import { ACCOUNTS_SEA, EXCLUDED_SEA } from "./data/sea";
import { ACCOUNTS_NORTH_APJ, EXCLUDED_NORTH_APJ } from "./data/north-apj";
import { ACCOUNTS_JAPAN_DEEP } from "./data/japan-deep";
import { ACCOUNTS_KR_TW } from "./data/korea-taiwan";
import { ACCOUNTS_HK_ANZ } from "./data/hongkong-anz";
import { ACCOUNTS_INDIA_DEEP } from "./data/india-deep";
import { ACCOUNTS_SEA_DEEP } from "./data/sea-deep";
import { PROFILES_INDIA_BFSI } from "./data/profiles-india-bfsi";
import { PROFILES_INDIA_CONSUMER } from "./data/profiles-india-consumer";
import { PROFILES_ID_PH_VN } from "./data/profiles-id-ph-vn";
import { PROFILES_TH_MY_SG } from "./data/profiles-th-my-sg";
import { PROFILES_JAPAN } from "./data/profiles-japan";
import { PROFILES_KR_TW } from "./data/profiles-kr-tw";
import { PROFILES_HK_ANZ } from "./data/profiles-hk-anz";
import { PROFILES_GOV_EDU_BPM } from "./data/profiles-gov-edu-bpm";
import { PROFILES_SUPPLEMENT } from "./data/profiles-supplement";

const rawAccounts: Account[] = [
  ...ACCOUNTS_INDIA_BFSI,
  ...ACCOUNTS_INDIA_CONSUMER,
  ...ACCOUNTS_ID_PH,
  ...ACCOUNTS_SEA,
  ...ACCOUNTS_NORTH_APJ,
  ...ACCOUNTS_JAPAN_DEEP,
  ...ACCOUNTS_KR_TW,
  ...ACCOUNTS_HK_ANZ,
  ...ACCOUNTS_INDIA_DEEP,
  ...ACCOUNTS_SEA_DEEP,
];

// Defensive slug dedup: first occurrence wins.
const seen = new Set<string>();
export const ALL_ACCOUNTS: Account[] = rawAccounts.filter((a) => {
  if (seen.has(a.slug)) return false;
  seen.add(a.slug);
  return true;
});

const rawProfiles: ProfileAccount[] = [
  ...PROFILES_INDIA_BFSI,
  ...PROFILES_INDIA_CONSUMER,
  ...PROFILES_ID_PH_VN,
  ...PROFILES_TH_MY_SG,
  ...PROFILES_JAPAN,
  ...PROFILES_KR_TW,
  ...PROFILES_HK_ANZ,
  ...PROFILES_GOV_EDU_BPM,
  ...PROFILES_SUPPLEMENT,
];

// Profiles must not collide with deep accounts or each other.
export const ALL_PROFILES: ProfileAccount[] = rawProfiles.filter((p) => {
  if (seen.has(p.slug)) return false;
  seen.add(p.slug);
  return true;
});

export const ALL_EXCLUDED: ExcludedAccount[] = [
  ...EXCLUDED_INDIA_BFSI,
  ...EXCLUDED_INDIA_CONSUMER,
  ...EXCLUDED_ID_PH,
  ...EXCLUDED_SEA,
  ...EXCLUDED_NORTH_APJ,
];

export const PROFILE_ANALYSIS: Record<string, ProfileAnalysis> = {
  ...ANALYSIS_INDIA_BFSI_A, ...ANALYSIS_INDIA_BFSI_B,
  ...ANALYSIS_INDIA_CONSUMER_A, ...ANALYSIS_INDIA_CONSUMER_B,
  ...ANALYSIS_ID_PH_VN_A, ...ANALYSIS_ID_PH_VN_B,
  ...ANALYSIS_TH_MY_SG_A, ...ANALYSIS_TH_MY_SG_B,
  ...ANALYSIS_JAPAN_A, ...ANALYSIS_JAPAN_B,
  ...ANALYSIS_KR_TW_A, ...ANALYSIS_KR_TW_B,
  ...ANALYSIS_HK_ANZ_A, ...ANALYSIS_HK_ANZ_B,
  ...ANALYSIS_GOV_EDU_BPM_A, ...ANALYSIS_GOV_EDU_BPM_B,
};

export function accountBySlug(slug: string) {
  return ALL_ACCOUNTS.find((a) => a.slug === slug);
}

export function profileBySlug(slug: string) {
  return ALL_PROFILES.find((p) => p.slug === slug);
}

export function analysisFor(slug: string) {
  return PROFILE_ANALYSIS[slug];
}

// Profiles that carry deep analysis get their own working account page.
export const ANALYZED_PROFILES = () => ALL_PROFILES.filter((p) => Boolean(PROFILE_ANALYSIS[p.slug]));

// Composite scores for the prioritization matrix
export function businessValueScore(a: Account) {
  const s = a.scores;
  return (s.volume + s.urgency + s.expansion + s.costSensitivity) / 4;
}
export function readinessScore(a: Account) {
  const s = a.scores;
  return (s.feasibility + s.speed + s.gcpRelevance) / 3;
}
