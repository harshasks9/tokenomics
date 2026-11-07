/**
 * Server-only: the Q1 FY27 plan for the Workspace activation workstream.
 * "decided" items restate the program owner's brief; "proposed" items are
 * suggestions awaiting confirmation and are labeled as such in the UI.
 */

export type Status = "decided" | "proposed" | "open";

export interface Principle { title: string; body: string; status: Status }

export const THESIS = {
  title: "Agentify Workspace — AWT 2.0",
  oneLiner:
    "Activate the Gemini agent every Workspace customer already owns, prove usage with median (not average) telemetry, and turn usage into seat and edition expansion — delivered by FDEs and partners at weekly scale.",
  revenueTarget: 0.6, // share of revenue from GWS
};

export const PRINCIPLES: Principle[] = [
  { title: "60% of revenue from GWS", status: "decided",
    body: "Workspace is the revenue engine for the year. Every workstream on the Q1 shortlist is judged by how much it moves GWS revenue." },
  { title: "Activation → usage → expansion, nothing else", status: "decided",
    body: "AWT 2.0 is purely an activation, usage and expansion play. No new-product pitch, no bundle redesign: get people using what they own, measure it, then grow seats and editions." },
  { title: "We do not sell Gemini to Workspace users", status: "decided",
    body: "No Gemini Enterprise add-on pitch in this motion. The Gemini agent entitlement ($2–$6 per user per month) is already in their plan — our job is to make it part of their day." },
  { title: "Led by FDEs and partners", status: "decided",
    body: "FDEs build the use-case packs and coach partners; partners run the weekly workshops and follow-ups. The central team runs the system, not the sessions." },
  { title: "Long-running productivity use cases", status: "decided",
    body: "Lead with agent work that spans hours or days across Gmail, Calendar, Docs, Chat and Meet — follow-up tracking, stakeholder coordination, meeting-to-actions, status digests, review loops — not one-shot chat." },
  { title: "$50K POC credits buy new users", status: "decided",
    body: "POC credits are spent on bringing new users onto Workspace (new seats for a 90-day proof), not on discounting existing seats." },
  { title: "Entitlement usage is a leading indicator, not the revenue", status: "decided",
    body: "Workspace entitlement consumption counts as revenue unless it is classed as iRevenue — and we should assume it will be iRev. So the revenue case rests on new seats, edition upgrades and renewals; entitlement draw is how we know activation is real." },
];

export const SHORTLIST = {
  note: "Q1 FY27 runs at most 5–6 workstreams at scale. This one is on the list; the other slots are open until the selection review.",
  criteria: ["Moves GWS revenue in-quarter", "Repeatable weekly by partners without central heroics", "Measured by telemetry we can get per account", "Needs no new product or pricing change"],
  slots: [
    { n: 1, name: "Agentify Workspace — AWT 2.0", status: "decided" as Status, why: "Activation of an entitlement customers already pay for; partner-scalable; measurable via median usage; expansion path is seats and editions." },
    { n: 2, name: "To be confirmed", status: "open" as Status, why: "" },
    { n: 3, name: "To be confirmed", status: "open" as Status, why: "" },
    { n: 4, name: "To be confirmed", status: "open" as Status, why: "" },
    { n: 5, name: "To be confirmed", status: "open" as Status, why: "" },
    { n: 6, name: "Optional sixth slot", status: "open" as Status, why: "" },
  ],
};

export const EXECUTION = {
  model: [
    { level: "Central team", count: "1 person", does: "Runs the program system: account selection each Monday, partner enablement, use-case packs with FDEs, the weekly scorecard." },
    { level: "Partners", count: "4 per sub-region", does: "Each partner runs Agentify your Day for 5 customers a week, then follows up in week 1 and week 4." },
    { level: "Customers", count: "5 per partner per week", does: "A half-day hands-on workshop: admins switch on the Gemini Beta setting where eligible, champions build 3 long-running agents on their own work." },
  ],
  inspiration: "Modeled on Power BI's “Dashboard in a Day”: one repeatable hands-on day, a fixed kit, run by partners at volume. Ours is “Agentify your Day”.",
  workshop: [
    { time: "0:00", block: "Why your day, not a demo", detail: "What the entitlement covers; what an agentic task is; how approvals work. No product pitch." },
    { time: "0:20", block: "Admin switch-on (admins only)", detail: "Gemini Beta setting (Business Plus / Enterprise Plus first), data access and audit — 15 minutes, done live." },
    { time: "0:35", block: "Lab 1 — AI Inbox follow-ups", detail: "Everyone runs the follow-up tracker on their own inbox." },
    { time: "1:15", block: "Lab 2 — pick your long-running agent", detail: "Choose by role: Stakeholder Coordinator, Meeting-to-Actions, Weekly Status Digest, Doc Review Partner, or a partner pack." },
    { time: "2:15", block: "Lab 3 — hand it a real job that runs past today", detail: "Set it up to keep working through the week; agree the approval points." },
    { time: "3:00", block: "Commit & measure", detail: "Each attendee names the agent they'll run daily; the partner books week-1 and week-4 check-ins against the median-usage target." },
    { time: "3:30", block: "New users on POC credits", detail: "Who else in the business should be in next week's session? Credits cover their seats for 90 days." },
  ],
  cadence: [
    { when: "Monday", what: "Central team publishes the week's 5-per-partner account list (edition + median usage + use cases)." },
    { when: "Tue–Thu", what: "Partners run Agentify your Day sessions; FDEs float across sub-regions for escalations." },
    { when: "Friday", what: "30-minute scorecard review: workshops run, activation at week 1, median-usage movement at week 4, credits converted to new users, expansion conversations opened." },
  ],
};

export interface RaciRow {
  who: string;
  role: string;
  accountableFor: string;
  metric: string;
  cadence: string;
  status: Status;
}

export const RACI: RaciRow[] = [
  { who: "Central team (1)", role: "Program DRI", accountableFor: "The system works every week: right accounts, enabled partners, current use-case packs, a scorecard that is true.", metric: "Accounts workshopped per week vs plan; % of partners delivering 5/week", cadence: "Weekly scorecard owner", status: "decided" },
  { who: "Brenton & team", role: "Workspace sellers for the targeted book (proposed — confirm scope)", accountableFor: "Turning activation into revenue: every agentified account gets an expansion conversation (new seats, edition upgrade, renewal) within 30 days.", metric: "Expansion pipeline created from agentified accounts; seat adds and edition upgrades closed", cadence: "Friday review, monthly forecast", status: "proposed" },
  { who: "AWT lead (Tanya's team)", role: "AWT 2.0 play owner (new hire)", accountableFor: "The AWT 2.0 rules: what counts as activated / using / expanding, POC-credit governance ($50K), partner incentive alignment to those stages.", metric: "Median usage lift at week 4; credits converted to paid new users; partner stage-conversion rates", cadence: "Publishes the AWT funnel every Friday", status: "proposed" },
  { who: "FDEs", role: "Use-case and partner coaching", accountableFor: "Use-case packs that work on real data; partner certification to run the day; unblock technical issues within 48 hours.", metric: "Partners certified; packs used per workshop; issues closed < 48h", cadence: "Weekly", status: "proposed" },
  { who: "Partners (4 per sub-region)", role: "Delivery", accountableFor: "5 customers a week each, with week-1 and week-4 follow-ups.", metric: "Workshops delivered; accounts reaching ‘agentified’ and ‘using’", cadence: "Weekly", status: "decided" },
  { who: "GWS product & telemetry", role: "Data and enablement", accountableFor: "Per-account median usage and use-case telemetry, and the Gemini Beta switch-on path for eligible editions.", metric: "Telemetry freshness (≤ 7 days) for every targeted account", cadence: "Weekly feed", status: "proposed" },
];

export const SQUAD = [
  { seat: "Program lead (central team)", fte: "1", note: "Single DRI for the workstream." },
  { seat: "AWT 2.0 lead", fte: "1", note: "The new hire in Tanya's team — owns play rules and credits." },
  { seat: "Workspace seller pod", fte: "Brenton + team", note: "Owns expansion conversations from agentified accounts." },
  { seat: "FDEs", fte: "2–3 (proposed)", note: "One per two sub-regions; build packs, certify partners." },
  { seat: "Partner managers", fte: "1 per sub-region (proposed)", note: "Hold partners to 5/week and the follow-ups." },
  { seat: "Telemetry analyst", fte: "0.5 (proposed)", note: "Median-usage and use-case reporting per account." },
];

export const QUALIFY = {
  mustKnow: [
    { q: "Do they have Workspace, and which edition?", why: "Edition sets the entitlement ($2 vs $6 per user per month) and Gemini Beta first-wave eligibility (Business Plus, Enterprise Plus). Sovereign Controls customers are out of the initial beta." },
    { q: "How much are their users using Gemini — the median user, not the average?", why: "Averages hide that most seats are idle: a few power users make the mean look healthy while the median user does nothing. The median is what activation has to move." },
    { q: "Which use-case scenarios are they already using?", why: "Tells us which lab to lead with, and whether they're stuck on one-shot chat or already running long-running work." },
  ],
  alsoUseful: ["Seats and seat growth plans (expansion headroom)", "Gemini Beta admin setting on/off", "Partner coverage in the sub-region", "A named champion who will commit to a daily agent"],
};

/** Internal copy rendered by the Google pages — kept server-side so it never ships in client JS. */
export const COPY = {
  revenueCaveat: "Workspace entitlement usage counts as revenue unless it is iRevenue — plan as if it is iRev. Measure entitlement draw as the activation signal; count revenue from new seats, edition upgrades and renewals.",
  calcExclusion: "Entitlement draw is excluded on purpose: assume it is iRevenue.",
  holding: [
    { lead: "One scorecard, read every Friday", body: "30 minutes, every owner present, red/amber/green against plan." },
    { lead: "Brenton & team", body: "Owned number is expansion created from agentified accounts — every agentified account has an expansion conversation within 30 days, or it's red." },
    { lead: "AWT lead (Tanya's team)", body: "Owns the play rules and the $50K — publishes the funnel (agentified → using → expanding) and credits-to-paid conversion every Friday. Two reds in a row escalate to the program lead." },
    { lead: "The role of GWS", body: "Keep the motion about activation, usage and expansion — never a Gemini add-on pitch — and own per-account median-usage telemetry." },
  ],
  placeholderNote: "Scope and titles for Brenton's team and the AWT hire are placeholders until confirmed; the metrics are the proposal.",
};
