/**
 * Server-only synthetic data for Agentify your Day. Organizations, people and
 * telemetry are fictional. Plan content reflects the program owner's Q1 FY27
 * thinking and is projected to Google personas only.
 */
import type { Account, Edition, EditionId, Partner, PersonaId, Team, UseCaseMeta } from "./types";

export const EDITIONS: Record<EditionId, Edition> = {
  "business-starter": { id: "business-starter", name: "Business Starter", pupm: 7, entitlement: 2, betaFirstWave: false },
  "business-standard": { id: "business-standard", name: "Business Standard", pupm: 14, entitlement: 6, betaFirstWave: false },
  "business-plus": { id: "business-plus", name: "Business Plus", pupm: 22, entitlement: 6, betaFirstWave: true },
  "enterprise-starter": { id: "enterprise-starter", name: "Enterprise Starter", pupm: 11, entitlement: 2, betaFirstWave: false },
  "enterprise-standard": { id: "enterprise-standard", name: "Enterprise Standard", pupm: 27, entitlement: 6, betaFirstWave: false },
  "enterprise-plus": { id: "enterprise-plus", name: "Enterprise Plus", pupm: 35, entitlement: 6, betaFirstWave: true },
};

export const SUB_REGIONS = ["ANZ", "ASEAN", "India", "Japan", "Korea"];

export const PARTNERS: Partner[] = [
  { id: "northlight", name: "Northlight Partners", subRegion: "ANZ", lead: "Tom Okafor", focus: "Workspace change & adoption" },
  { id: "meridian", name: "Meridian Advisory", subRegion: "ANZ", lead: "Grace Liu", focus: "Finance operations" },
  { id: "kauri", name: "Kauri Digital", subRegion: "ANZ", lead: "Mere Tane", focus: "Public sector & education" },
  { id: "bluegum", name: "Bluegum Cloud", subRegion: "ANZ", lead: "Sam Whitaker", focus: "Mid-market SMB" },
  { id: "lionfish", name: "Lionfish Systems", subRegion: "ASEAN", lead: "Aditya Rao", focus: "Retail & logistics" },
  { id: "tembusu", name: "Tembusu Consulting", subRegion: "ASEAN", lead: "Mei Ling Tan", focus: "Financial services" },
  { id: "padi", name: "Padi Workspace", subRegion: "ASEAN", lead: "Rizal Hakim", focus: "Manufacturing" },
  { id: "orchid", name: "Orchid Partners", subRegion: "ASEAN", lead: "Nicole Santos", focus: "BPO & services" },
  { id: "banyan", name: "Banyan Tech", subRegion: "India", lead: "Kavya Iyer", focus: "IT services" },
  { id: "monsoon", name: "Monsoon Labs", subRegion: "India", lead: "Arjun Desai", focus: "Startups & digital natives" },
  { id: "saffron", name: "Saffron Solutions", subRegion: "India", lead: "Neha Kapoor", focus: "Healthcare" },
  { id: "deccan", name: "Deccan Cloudworks", subRegion: "India", lead: "Rohit Menon", focus: "Manufacturing" },
  { id: "sakura", name: "Sakura Integrators", subRegion: "Japan", lead: "Haruto Sato", focus: "Enterprise change" },
  { id: "fuji", name: "Fuji Workstyle", subRegion: "Japan", lead: "Yui Tanaka", focus: "Retail" },
  { id: "kumo", name: "Kumo Partners", subRegion: "Japan", lead: "Ren Ito", focus: "Media" },
  { id: "tsubaki", name: "Tsubaki Systems", subRegion: "Japan", lead: "Aoi Kobayashi", focus: "Financial services" },
  { id: "hangang", name: "Hangang Digital", subRegion: "Korea", lead: "Ji-woo Park", focus: "Manufacturing" },
  { id: "seoraksan", name: "Seorak Cloud", subRegion: "Korea", lead: "Min-jun Kim", focus: "Gaming & media" },
  { id: "namsan", name: "Namsan Partners", subRegion: "Korea", lead: "Seo-yeon Lee", focus: "Education" },
  { id: "busan", name: "Busan Works", subRegion: "Korea", lead: "Do-hyun Choi", focus: "Logistics" },
];

const T = (name: string, seatShare: number, intensity: number): Team => ({ name, seatShare, intensity });
const OPS: Team[] = [T("Operations", 0.4, 0.8), T("Sales & account management", 0.2, 1.3), T("Finance", 0.1, 1.1), T("People & HR", 0.08, 0.9), T("Leadership", 0.04, 1.6), T("Customer service", 0.18, 0.7)];
const PRO: Team[] = [T("Consulting & delivery", 0.5, 1.2), T("Sales", 0.15, 1.4), T("Finance & legal", 0.12, 1.0), T("Operations", 0.15, 0.8), T("Leadership", 0.08, 1.5)];
const RET: Team[] = [T("Stores & field", 0.55, 0.4), T("Merchandising", 0.12, 1.2), T("Supply chain", 0.13, 1.0), T("Head office functions", 0.15, 1.1), T("Leadership", 0.05, 1.4)];

let n = 0;
function acct(a: Omit<Account, "id" | "stage" | "enabled" | "credits" | "newUsers" | "notes" | "sovereign" | "workshopWeek"> & Partial<Pick<Account, "stage" | "notes" | "sovereign" | "enabled" | "workshopWeek">>): Account {
  n += 1;
  return { id: `acct-${n}`, stage: "qualified", enabled: [], credits: 0, newUsers: 0, notes: "", sovereign: false, ...a };
}

export const CUSTOMER_ACCOUNT = "acct-1";

export const ACCOUNTS: Account[] = [
  acct({ name: "Fernhill Logistics", industry: "Logistics", subRegion: "ANZ", edition: "enterprise-standard", seats: 1200, geminiBeta: false, partnerId: "northlight",
    usage: { seed: 11, activeShare: 0.34, scale: 2.4 }, teams: OPS, useCases: { "uc-inbox": 0.5, "uc-meeting": 0.3 }, stage: "qualified",
    notes: "Heavy Gmail + Calendar coordination across depots; leadership asked for 'fewer status meetings'." }),
  acct({ name: "Harbourside Health", industry: "Healthcare", subRegion: "ANZ", edition: "enterprise-plus", seats: 3400, geminiBeta: true, partnerId: "northlight",
    usage: { seed: 12, activeShare: 0.58, scale: 3.1 }, teams: OPS, useCases: { "uc-inbox": 0.6, "uc-docreview": 0.35, "uc-meeting": 0.4 }, stage: "agentified", workshopWeek: 1,
    enabled: ["uc-inbox", "uc-docreview", "uc-meeting"], notes: "Beta opted-in; clinicians excluded from scope — admin and corporate only." }),
  acct({ name: "Copperline Engineering", industry: "Engineering services", subRegion: "ANZ", edition: "business-plus", seats: 280, geminiBeta: true, partnerId: "northlight",
    usage: { seed: 13, activeShare: 0.71, scale: 4.2 }, teams: PRO, useCases: { "uc-rfp": 0.4, "uc-docreview": 0.55, "uc-status": 0.3, "uc-inbox": 0.5 }, stage: "using",
    enabled: ["uc-rfp", "uc-docreview", "uc-status", "uc-inbox"], notes: "Bids team runs the RFP builder on every tender; hiring 60 engineers in Q1." }),
  acct({ name: "Wattle Retail Group", industry: "Retail", subRegion: "ANZ", edition: "business-standard", seats: 900, geminiBeta: false, partnerId: "northlight",
    usage: { seed: 14, activeShare: 0.18, scale: 1.6 }, teams: RET, useCases: { "uc-inbox": 0.3 }, notes: "Store staff on frontline-style use; head office is the real audience." }),
  acct({ name: "Kingfisher Legal", industry: "Professional services", subRegion: "ANZ", edition: "enterprise-plus", seats: 420, geminiBeta: true, partnerId: "northlight",
    usage: { seed: 15, activeShare: 0.82, scale: 5.6 }, teams: PRO, useCases: { "uc-docreview": 0.75, "uc-inbox": 0.6, "uc-delegate": 0.45, "uc-meeting": 0.5 }, stage: "expanding",
    enabled: ["uc-docreview", "uc-inbox", "uc-delegate", "uc-meeting"], notes: "Partners hitting the per-user entitlement by week 3; opening a second office." }),
  acct({ name: "Southern Cross Energy", industry: "Energy", subRegion: "ANZ", edition: "enterprise-standard", seats: 2100, geminiBeta: false, partnerId: "meridian",
    usage: { seed: 16, activeShare: 0.27, scale: 2.2 }, teams: OPS, useCases: { "uc-inbox": 0.4, "uc-monthend": 0.2 }, notes: "Finance shared services is the champion." }),
  acct({ name: "Tasman Freight", industry: "Logistics", subRegion: "ANZ", edition: "business-starter", seats: 160, geminiBeta: false, partnerId: "bluegum",
    usage: { seed: 17, activeShare: 0.12, scale: 1.2 }, teams: OPS, useCases: {}, notes: "$2 entitlement only — low ceiling; edition upgrade conversation first." }),
  acct({ name: "Aotearoa Education Trust", industry: "Education", subRegion: "ANZ", edition: "enterprise-standard", seats: 1500, geminiBeta: false, sovereign: true, partnerId: "kauri",
    usage: { seed: 18, activeShare: 0.22, scale: 1.9 }, teams: PRO, useCases: { "uc-inbox": 0.3 }, notes: "Sovereign Controls — out of scope for the initial beta." }),
  acct({ name: "Lumen Bank SEA", industry: "Financial services", subRegion: "ASEAN", edition: "enterprise-plus", seats: 5200, geminiBeta: true, partnerId: "tembusu",
    usage: { seed: 21, activeShare: 0.46, scale: 2.8 }, teams: OPS, useCases: { "uc-inbox": 0.5, "uc-escalation": 0.25, "uc-docreview": 0.3 }, stage: "scheduled", workshopWeek: 2, notes: "Risk sign-off done for Docs and Gmail; Chat pending." }),
  acct({ name: "Mekong Manufacturing", industry: "Manufacturing", subRegion: "ASEAN", edition: "business-plus", seats: 640, geminiBeta: true, partnerId: "padi",
    usage: { seed: 22, activeShare: 0.31, scale: 2.0 }, teams: OPS, useCases: { "uc-meeting": 0.35, "uc-status": 0.2 }, notes: "Plant managers run daily stand-ups in Meet." }),
  acct({ name: "Straits Retail Co", industry: "Retail", subRegion: "ASEAN", edition: "business-standard", seats: 1100, geminiBeta: false, partnerId: "lionfish",
    usage: { seed: 23, activeShare: 0.16, scale: 1.4 }, teams: RET, useCases: { "uc-inbox": 0.25 }, notes: "" }),
  acct({ name: "Archipelago BPO", industry: "Business services", subRegion: "ASEAN", edition: "enterprise-standard", seats: 3800, geminiBeta: false, partnerId: "orchid",
    usage: { seed: 24, activeShare: 0.39, scale: 2.6 }, teams: OPS, useCases: { "uc-escalation": 0.45, "uc-inbox": 0.4 }, stage: "agentified", workshopWeek: 1, enabled: ["uc-escalation", "uc-inbox"], notes: "Escalation tracker piloted with two client programs." }),
  acct({ name: "Indus Health Network", industry: "Healthcare", subRegion: "India", edition: "enterprise-standard", seats: 2600, geminiBeta: false, partnerId: "saffron",
    usage: { seed: 31, activeShare: 0.24, scale: 2.1 }, teams: OPS, useCases: { "uc-meeting": 0.3 }, notes: "" }),
  acct({ name: "Konark IT Services", industry: "IT services", subRegion: "India", edition: "business-plus", seats: 1800, geminiBeta: true, partnerId: "banyan",
    usage: { seed: 32, activeShare: 0.63, scale: 3.8 }, teams: PRO, useCases: { "uc-rfp": 0.35, "uc-status": 0.5, "uc-docreview": 0.45, "uc-meeting": 0.55 }, stage: "using", enabled: ["uc-rfp", "uc-status", "uc-docreview", "uc-meeting"], notes: "Delivery leads use the status digest across 40 client accounts." }),
  acct({ name: "Pune Precision", industry: "Manufacturing", subRegion: "India", edition: "business-standard", seats: 520, geminiBeta: false, partnerId: "deccan",
    usage: { seed: 33, activeShare: 0.2, scale: 1.5 }, teams: OPS, useCases: {}, notes: "" }),
  acct({ name: "Zest Commerce", industry: "Digital native", subRegion: "India", edition: "business-plus", seats: 350, geminiBeta: true, partnerId: "monsoon",
    usage: { seed: 34, activeShare: 0.76, scale: 4.6 }, teams: PRO, useCases: { "uc-inbox": 0.6, "uc-escalation": 0.4, "uc-status": 0.4 }, stage: "expanding", enabled: ["uc-inbox", "uc-escalation", "uc-status"], notes: "Growing headcount 30% in H1." }),
  acct({ name: "Hikari Department Stores", industry: "Retail", subRegion: "Japan", edition: "enterprise-standard", seats: 4100, geminiBeta: false, partnerId: "fuji",
    usage: { seed: 41, activeShare: 0.21, scale: 1.8 }, teams: RET, useCases: { "uc-meeting": 0.25 }, notes: "Japanese-language prompts in the workshop are a must." }),
  acct({ name: "Minato Securities", industry: "Financial services", subRegion: "Japan", edition: "enterprise-plus", seats: 2300, geminiBeta: true, partnerId: "tsubaki",
    usage: { seed: 42, activeShare: 0.49, scale: 2.9 }, teams: PRO, useCases: { "uc-docreview": 0.4, "uc-inbox": 0.45 }, stage: "scheduled", workshopWeek: 2, notes: "" }),
  acct({ name: "Kanto Media Holdings", industry: "Media", subRegion: "Japan", edition: "business-plus", seats: 760, geminiBeta: true, partnerId: "kumo",
    usage: { seed: 43, activeShare: 0.37, scale: 2.4 }, teams: PRO, useCases: { "uc-status": 0.3 }, notes: "" }),
  acct({ name: "Hanbit Motors Supply", industry: "Manufacturing", subRegion: "Korea", edition: "enterprise-standard", seats: 2900, geminiBeta: false, partnerId: "hangang",
    usage: { seed: 51, activeShare: 0.26, scale: 2.0 }, teams: OPS, useCases: { "uc-meeting": 0.3, "uc-inbox": 0.25 }, notes: "" }),
  acct({ name: "Pixelwave Games", industry: "Gaming", subRegion: "Korea", edition: "business-plus", seats: 610, geminiBeta: true, partnerId: "seoraksan",
    usage: { seed: 52, activeShare: 0.68, scale: 3.9 }, teams: PRO, useCases: { "uc-status": 0.5, "uc-docreview": 0.35 }, stage: "using", enabled: ["uc-status", "uc-docreview"], notes: "" }),
  acct({ name: "Hangul Learning", industry: "Education", subRegion: "Korea", edition: "enterprise-starter", seats: 400, geminiBeta: false, partnerId: "namsan",
    usage: { seed: 53, activeShare: 0.14, scale: 1.1 }, teams: PRO, useCases: {}, notes: "$2 entitlement (Enterprise Starter, emerging markets)." }),
];

export const PERSONA: Record<PersonaId, { name: string; title: string; org: string; initials: string }> = {
  customer: { name: "Lena Fischer", title: "Digital Workplace Lead", org: "Fernhill Logistics", initials: "LF" },
  partner: { name: "Tom Okafor", title: "Partner FDE", org: "Northlight Partners", initials: "TO" },
  google: { name: "Program lead", title: "Central team · Agentify program", org: "Google Cloud", initials: "PL" },
};

export const PARTNER_PERSONA_ID = "northlight";

export const USECASES: UseCaseMeta[] = [
  { id: "uc-inbox", slug: "google/ai-inbox-follow-up-tracker", title: "AI Inbox Follow-up Tracker", owner: "Google", ownerKind: "google", version: "1.2", summary: "Tracks every thread waiting on you or on someone else, and drafts the nudge before it's late.", surfaces: ["Gmail", "Calendar"] },
  { id: "uc-delegate", slug: "google/delegate-stakeholder-coordinator", title: "Stakeholder Coordinator", owner: "Google", ownerKind: "google", version: "1.1", summary: "Delegate a multi-person task once: Gemini finds the stakeholders, drafts outreach in your voice and books time — after you approve.", surfaces: ["Gmail", "Calendar", "Chat"] },
  { id: "uc-meeting", slug: "google/meeting-to-actions", title: "Meeting-to-Actions Loop", owner: "Google", ownerKind: "google", version: "1.4", summary: "Turns Meet notes into an action log in Docs, follows up owners in Chat and closes the loop before the next meeting.", surfaces: ["Meet", "Docs", "Chat"] },
  { id: "uc-status", slug: "google/weekly-status-digest", title: "Weekly Status Digest", owner: "Google", ownerKind: "google", version: "1.0", summary: "A Chat-space coworker that reads the week's Docs, Sheets and threads and posts the status update nobody wants to write.", surfaces: ["Chat", "Docs", "Sheets"] },
  { id: "uc-docreview", slug: "google/doc-review-partner", title: "Doc Review Partner", owner: "Google", ownerKind: "google", version: "1.3", summary: "@mention Gemini in a comment: it reviews against your checklist, replies to threads and proposes edits you accept or reject.", surfaces: ["Docs", "Drive"] },
  { id: "uc-rfp", slug: "northlight/rfp-response-builder", title: "RFP Response Builder", owner: "Northlight Partners", ownerKind: "partner", version: "0.9", summary: "Runs over days: finds prior answers in Drive, drafts the response, routes sections to SMEs and tracks sign-off.", surfaces: ["Drive", "Docs", "Gmail", "Chat"] },
  { id: "uc-escalation", slug: "northlight/customer-escalation-tracker", title: "Customer Escalation Tracker", owner: "Northlight Partners", ownerKind: "partner", version: "1.0", summary: "Watches an escalation across Gmail and Chat, nudges owners against the SLA and posts a daily summary.", surfaces: ["Gmail", "Chat", "Sheets"] },
  { id: "uc-monthend", slug: "meridian/month-end-close-chaser", title: "Month-end Close Chaser", owner: "Meridian Advisory", ownerKind: "partner", version: "0.8", summary: "Chases close inputs by email, reconciles what arrives in Sheets and assembles the close pack.", surfaces: ["Gmail", "Sheets", "Docs"] },
];

/** Program constants (Q1 FY27). */
export const PROGRAM = {
  pocCreditPool: 50_000,
  pocMonths: 3,
  quarterWeeks: 13,
  q1Start: "2027-01-04",
  activation: { medianTasksPerWeek: 2 },
  using: { medianTasksPerWeek: 5, useCases: 3 },
  avgCostPerTask: 0.18,
};
