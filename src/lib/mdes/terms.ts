/**
 * MDES (Thailand) via Human Intelligence — Gemini Enterprise for EDU.
 *
 * Every number here is either (a) read from the Google Cloud Addendum /
 * Subscription Order Form dated 17 Sep 2026 (Quote Q-465401) — tagged
 * `contract` — or (b) a working assumption supplied by the account team that
 * the Order Form does not state — tagged `assumption`. Proposed flexibility
 * (GCP allocation, spending beyond the Order Form term) is not in the Order
 * Form at all and is tagged `proposed` wherever it appears.
 */

export type Basis = "contract" | "assumption" | "proposed";

export const COMMITMENT = 10_800_000;
export const TERM_MONTHS = 12;
export const REQUIRED_USERS_M12 = 650_000;
export const LIST_PRICE = 5;
export const LIST_DISCOUNT = 0.6;
/** Discounted price per unit in the Order Form; also the Maximum Retail Price the Partner may charge. */
export const PUPM = 2;
/** Deal-desk floor supplied by the account team. Not in the Order Form. */
export const PUPM_FLOOR = 1.85;

/**
 * Ordered units per billing month, mapped onto a 12-month planning window
 * (M1 = 15 Sep – 14 Oct 2026 … M12 = 15 Aug – 14 Sep 2027).
 *
 * The first order term starts "Upon Provisioning" and each later term starts
 * on the 15th, so with provisioning on 15 Oct 2026 the six order terms run
 * back-to-back from M2 to M12 and the final six-month term ends 14 Sep 2027.
 * M1 carries no ordered units (nothing is provisioned yet).
 *
 * Σ units = 5,400,000 user-months; × $2 = $10,800,000 = the Order Form total.
 */
export const CONTRACTED_UNITS: readonly number[] = [
  0, 100_000, 200_000, 300_000, 400_000, 500_000,
  650_000, 650_000, 650_000, 650_000, 650_000, 650_000,
];

export interface OrderTerm {
  start: string;
  months: number;
  units: number;
  feesPerMonth: number;
  total: number;
}

/** The six order terms exactly as tabulated on pages 1–2 of the Order Form. */
export const ORDER_TERMS: readonly OrderTerm[] = [
  { start: "Upon provisioning", months: 1, units: 100_000, feesPerMonth: 200_000, total: 200_000 },
  { start: "15 Nov 2026", months: 1, units: 200_000, feesPerMonth: 400_000, total: 400_000 },
  { start: "15 Dec 2026", months: 1, units: 300_000, feesPerMonth: 600_000, total: 600_000 },
  { start: "15 Jan 2027", months: 1, units: 400_000, feesPerMonth: 800_000, total: 800_000 },
  { start: "15 Feb 2027", months: 1, units: 500_000, feesPerMonth: 1_000_000, total: 1_000_000 },
  { start: "15 Mar 2027", months: 6, units: 650_000, feesPerMonth: 1_300_000, total: 7_800_000 },
];

/** Calendar label for planning month m (1-based). M1 = Sep 2026. */
export function monthLabel(m: number): string {
  const d = new Date(Date.UTC(2026, 8 + (m - 1), 1));
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" });
}

export interface TermNote {
  id: string;
  title: string;
  basis: Basis;
  text: string;
  source: string;
}

/** Terms the planner surfaces, each with where it comes from. */
export const TERM_NOTES: readonly TermNote[] = [
  {
    id: "commitment",
    title: "Total subscription fees: USD 10,800,000",
    basis: "contract",
    text: "Sum of the six order terms. Fees are invoiced monthly in arrears for the ordered units whether or not the licenses are used, are non-refundable, and unused units may not be rolled over or banked across order terms.",
    source: "Order Form p.2 (total) and p.3 (Invoice Issuance)",
  },
  {
    id: "sku",
    title: "SKU: Gemini Enterprise for EDU — Subscription, monthly term (per user per month)",
    basis: "contract",
    text: "SKU D8F8-F694-6AC9. List price USD 5 per unit, 60% List Price Discount, 0% Promo, 0% Partner Program Discount → USD 2 per user per month. USD 2 is also the Maximum Retail Price the Partner may charge MDES.",
    source: "Order Form p.1–2 (fee table) and p.3 (Definitions; Retail Prices)",
  },
  {
    id: "schedule",
    title: "Ordered users ramp 100K → 200K → 300K → 400K → 500K, then 650K for six months",
    basis: "contract",
    text: "First term starts upon provisioning, later terms on the 15th of each month, final six-month term from 15 Mar 2027. Mapped here as M2–M12 of a 12-month window that starts with the Order Form effective date (Sep 2026).",
    source: "Order Form p.1–2 (fee table)",
  },
  {
    id: "m12",
    title: "650,000 users at Month 12",
    basis: "contract",
    text: "The final order term bills 650,000 users per month for its six months, ending 14 Sep 2027. The planner keeps this milestone visible in every scenario; extending the spending period never moves it.",
    source: "Order Form p.2 (final order term); account-team framing",
  },
  {
    id: "term",
    title: "Order Form term: effective on last signature, ends with the final order term. No auto-renewal.",
    basis: "contract",
    text: "Usage after the end of an order term without a written renewal is billed at then-current list prices unless otherwise agreed in writing. Continuing at USD 2 beyond Month 12 is therefore a proposal that needs written agreement, not a right.",
    source: "Order Form p.3 (Order Form Term; No Auto-Renewal)",
  },
  {
    id: "additional",
    title: "Additional users can be added, coterminous, if all payments are on time",
    basis: "contract",
    text: "Ramps above 650K are allowed: extra users are purchased through a new order form or amendment coterminous with this one. Ordering fewer users than actual usage is a Discrepancy the Partner must cure by ordering more.",
    source: "Order Form p.3 (Additional Users) and p.4 (Reconciliation)",
  },
  {
    id: "geap",
    title: "One-time option to discuss transition to Gemini Enterprise Agent Platform",
    basis: "contract",
    text: "No more than once during the term, at the Partner's written request, Google and Partner meet in good faith to discuss moving the services to GEAP. Neither party is obliged to transition; any transition needs a separately executed amendment of equal or greater value and term. Not modelled numerically here.",
    source: "Order Form p.4 (Transition to GEAP)",
  },
  {
    id: "eligibility",
    title: "Licenses only for learners who complete Level 3 AI certification",
    basis: "contract",
    text: "End users authenticate via social login plus Thai National ID, are registered as vocational participants, complete Level 1–3 courses on the customer LMS, and only then may be provisioned a license. This gate is why adoption and billed users are modelled separately.",
    source: "Order Form p.4 (Services SKUs Additional Terms)",
  },
  {
    id: "termination",
    title: "Early termination accelerates all unpaid fees",
    basis: "contract",
    text: "If the Order Form terminates before the end of the final order term for any reason other than Google's uncured material breach, all unpaid subscription fees for the remaining order terms become due. A consumption shortfall never reduces the amount owed.",
    source: "Order Form p.3 (Termination)",
  },
  {
    id: "payment",
    title: "Payment due 45 days from invoice; overages billed per the Quota Page",
    basis: "contract",
    text: "Feature use beyond the published Gemini Enterprise quotas is invoiced monthly in arrears at Quota Page prices. Not modelled here.",
    source: "Order Form p.3 (Payment Due Date; Usage Quotas)",
  },
  {
    id: "floor",
    title: "Price floor USD 1.85 per user per month",
    basis: "assumption",
    text: "Deal-desk floor supplied by the account team. The Order Form fixes USD 2; any other price means an amended order form. The planner refuses prices below the floor.",
    source: "Account team",
  },
  {
    id: "gcp",
    title: "Counting eligible GCP spend toward the commitment",
    basis: "proposed",
    text: "Not in the Order Form. Modelled only when switched on and only for GCP spend you enter explicitly. Presented as an approval dependency, never as an entitlement.",
    source: "Proposed flexibility — subject to approval",
  },
  {
    id: "extension",
    title: "Spending the commitment over more than 12 months",
    basis: "proposed",
    text: "Not in the Order Form (no auto-renewal; post-term usage at list price unless agreed in writing). Modelled only when switched on. Pricing in the extension months is a visible assumption, and the Month-12 user milestone stays where it is.",
    source: "Proposed flexibility — subject to approval",
  },
];

export const BASIS_LABEL: Record<Basis, string> = {
  contract: "Contract",
  assumption: "Assumption",
  proposed: "Proposed exception",
};
