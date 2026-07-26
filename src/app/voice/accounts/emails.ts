// Pre-built offer emails, composed from each account's researched specifics.
//
// Design rules:
// 1. Structurally customer-safe. The composer only ever reads customer-facing
//    fields. Internal content (tier, build-vs-buy classification, priority
//    score, GECX routing, margin, partner-funding) is not an input, so it
//    cannot leak into a draft.
// 2. No unsupported claims. Any money figure is framed as modelled from the
//    customer's own volumes, with the pilot establishing the real number.
// 3. Specific, not generic. Every draft opens on something true about that
//    organization — a strategic signal or a capability gap — never "transform
//    your customer experience with AI".

import type { MarketId, PackageId } from "./shared";
import { PACKAGES } from "./shared";

export type EmailType = "first-touch" | "exec-sponsor" | "post-meeting" | "pilot-proposal" | "reengage";
export type EmailPersona = "ceo" | "cio" | "coo" | "owner" | "risk" | "cfo";
export type EmailTone = "direct" | "consultative" | "formal";
export type EmailLength = "short" | "standard" | "detailed";

export const EMAIL_TYPES: { id: EmailType; label: string; when: string }[] = [
  { id: "first-touch", label: "First touch", when: "Cold outreach — no prior conversation" },
  { id: "exec-sponsor", label: "Executive sponsor", when: "Escalating to a sponsor who can fund a pilot" },
  { id: "post-meeting", label: "Post-meeting follow-up", when: "After a discovery conversation" },
  { id: "pilot-proposal", label: "Pilot proposal", when: "Proposing scope, package, and success criteria" },
  { id: "reengage", label: "Re-engage", when: "Reviving a stalled thread with a new reason to talk" },
];

export const EMAIL_PERSONAS: { id: EmailPersona; label: string; cares: string }[] = [
  { id: "ceo", label: "CEO / BU leader", cares: "Growth, cost of service, competitive position" },
  { id: "cio", label: "CIO / CTO", cares: "Architecture, integration risk, data control" },
  { id: "coo", label: "COO / Operations", cares: "Capacity, resolution quality, escalation load" },
  { id: "owner", label: "Functional owner", cares: "The workflow itself and its daily failure modes" },
  { id: "risk", label: "Risk / Compliance", cares: "Auditability, policy bounds, human accountability" },
  { id: "cfo", label: "CFO / Procurement", cares: "Unit economics, payback, contract shape" },
];

// Markets where a formal register is the safer default for first contact.
const FORMAL_MARKETS: MarketId[] = ["Japan", "Korea", "Taiwan", "Hong Kong"];
export const defaultTone = (market: MarketId): EmailTone =>
  FORMAL_MARKETS.includes(market) ? "formal" : "consultative";

export type EmailContext = {
  name: string;
  market: MarketId;
  vertical: string;
  entryWorkflow: string;
  outcome?: string;
  packageRec: PackageId;
  gaps: string[];
  signal?: string;        // strategic pressure / earnings hook, already customer-safe
  grossAnnual?: number;
  volumeMonthly?: number;
  costPerInteraction?: number;
  stakeholders?: string[];
  discovery?: string[];
  pilotScope?: string;
  languages: string[];
};

export type EmailOptions = {
  type: EmailType;
  persona: EmailPersona;
  tone: EmailTone;
  length: EmailLength;
  senderName: string;
  senderTitle: string;
  recipientName?: string;
};

export type ComposedEmail = { subject: string; body: string };

const money = (n: number) => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3)}K`;
  return `$${Math.round(n)}`;
};

const vol = (n: number) => {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`;
  return `${n}`;
};

const first = (arr: string[] | undefined, fallback: string) => (arr && arr.length ? arr[0] : fallback);

// Lowercase for mid-sentence use. Only applied to text whose shape we control
// (workflow labels, gap phrases) — never to free-form research prose, which is
// always placed at the start of its own sentence instead. Guards against
// acronyms (IRCTC, MTR), possessive proper nouns (Japan's), and lowercase
// brands (ttb, upGrad).
const lower = (s: string) => {
  if (!s) return s;
  const head = s.split(/\s/)[0].replace(/[^A-Za-z']/g, "");
  if (/^[A-Z]{2,}/.test(head)) return s;      // acronym
  if (/^[A-Z][a-z]+['’]s$/.test(head)) return s; // possessive proper noun
  return s.charAt(0).toLowerCase() + s.slice(1);
};

// Subjects use the trading name, not the full legal/expanded form.
const shortName = (name: string) => name.replace(/\s*\(.*?\)\s*/g, " ").trim();

// Keep a workflow label subject-line sized.
const shortWf = (wf: string) => {
  const base = wf.replace(/\s*\(.*?\)\s*/g, " ").split(/\s+[&+]\s+|\s+and\s+/i)[0].trim();
  return base.length > 44 ? `${base.slice(0, 41).trimEnd()}…` : base;
};

const capSubject = (s: string) => (s.length > 78 ? `${s.slice(0, 75).trimEnd()}…` : s);

// ─── Persona framing ────────────────────────────────────────────────────────

function personaHook(p: EmailPersona, c: EmailContext): string {
  const gap = lower(first(c.gaps, "customers still can't finish routine requests without a person"));
  switch (p) {
    case "ceo":
      return `Most of what reaches your teams today is routine — but ${gap}. That gap is paid for twice: once in service cost, and again in the customers who give up.`;
    case "cio":
      return `The hard part of this is never the model — it's telephony, session state, and the integrations into your systems of record. That's the part we're not asking you to build.`;
    case "coo":
      return `Your teams absorb volume that scales with the business while headcount can't. The routine share of that volume is the part worth removing first — starting with ${lower(c.entryWorkflow)}.`;
    case "owner":
      return `Specifically on ${lower(c.entryWorkflow)}: today ${gap}. That's the workflow we'd take first, because it's measurable inside a quarter.`;
    case "risk":
      return `The governance case is the part most teams find surprising: today roughly 1–2% of conversations get sampled for quality. In this model, 100% are logged, policy-checked, and scoreable — and anything sensitive routes to your people by design.`;
    case "cfo":
      return `The commercial shape is deliberately simple: a fixed implementation, then usage-based running costs. No seat licence, no unlimited-usage promise, and every figure traceable to your own volumes.`;
  }
}

function personaAsk(p: EmailPersona, c: EmailContext): string {
  const stake = first(c.stakeholders, "your service and technology leads");
  switch (p) {
    case "ceo":
      return `Would a 30-minute session with ${stake} be worth it — to size this against your own numbers rather than ours?`;
    case "cio":
      return `Could we spend 45 minutes on architecture and integration boundaries with your platform team before anything commercial?`;
    case "coo":
      return `Could we baseline one workflow together — volumes, handle time, and where escalations actually come from — and see whether the economics hold?`;
    case "owner":
      return `Would you be open to a working session on this one workflow, using a month of your own interaction data?`;
    case "risk":
      return `Could we walk your risk team through the controls — policy bounds, audit trail, and escalation triggers — before any pilot scope is agreed?`;
    case "cfo":
      return `Would a short session on unit economics help — cost per interaction today versus modelled, with all assumptions visible and editable?`;
  }
}

// ─── Building blocks ────────────────────────────────────────────────────────

function openingLine(c: EmailContext, o: EmailOptions): string {
  const greeting = o.recipientName ? `Hi ${o.recipientName},` : "Hello,";
  const formalGreeting = o.recipientName ? `Dear ${o.recipientName},` : "Dear Sir or Madam,";
  return o.tone === "formal" ? formalGreeting : greeting;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function contextLine(c: EmailContext, o: EmailOptions): string {
  const n = shortName(c.name);
  if (c.signal && o.type !== "post-meeting") {
    // Research signals often open with the company's own name; don't say it twice.
    const stripped = c.signal.replace(new RegExp(`^${escapeRe(n)}\\s+`, "i"), "");
    // Research prose keeps its own capitalization — it always opens a sentence.
    return stripped !== c.signal
      ? `I've been following ${n} — it ${lower(stripped)}`
      : `I've been following ${n}, and one thing stands out. ${c.signal}`;
  }
  return `I've been looking at how ${n} handles ${lower(c.entryWorkflow)} across ${c.languages.slice(0, 2).join(" and ")}${c.languages.length > 2 ? " and other languages" : ""}.`;
}

function whatWeDoLine(c: EmailContext): string {
  return `We work with Tilicho Labs on exactly this: they provide the communications and voice layer — telephony, channels, session handling — and Google Cloud provides the intelligence, with Gemini agents reasoning over your policies and acting in your systems. Nothing gets rebuilt from scratch, and your data and business rules stay yours.`;
}

function economicsLine(c: EmailContext): string {
  if (!c.grossAnnual || !c.volumeMonthly) {
    return `We'd model the economics from your actual volumes and cost per interaction — not from a benchmark — and the pilot is what establishes the real containment rate.`;
  }
  return `At roughly ${vol(c.volumeMonthly)} interactions a month, a first workflow models out to something in the order of ${money(c.grossAnnual)} of annual value. Treat that as arithmetic on assumptions, not a promise — the pilot exists to replace the assumptions with your measured results.`;
}

function packageLine(c: EmailContext): string {
  const p = PACKAGES[c.packageRec];
  return `Based on what we can see, the ${p.name} package looks like the right starting shape: ${p.tagline.toLowerCase()}, ${p.timeline}. That covers implementation and integration; platform usage, cloud consumption, and carrier charges run separately, so nothing is bundled into an unlimited-usage promise.`;
}

function pilotLine(c: EmailContext): string {
  return c.pilotScope
    ? `Proposed scope: ${c.pilotScope}.`
    : `Proposed scope: one workflow — ${lower(c.entryWorkflow)} — on two channels, with baseline metrics captured before we build and human fallback throughout.`;
}

function governanceLine(): string {
  return `Humans stay in the loop where it matters: anything sensitive, above policy threshold, or ambiguous routes to your team with the full conversation attached.`;
}

function signoff(o: EmailOptions): string {
  const close = o.tone === "formal" ? "Kind regards," : o.tone === "direct" ? "Thanks," : "Best regards,";
  return `${close}\n${o.senderName}\n${o.senderTitle}`;
}

// ─── Subjects ───────────────────────────────────────────────────────────────

function subjectFor(c: EmailContext, o: EmailOptions): string {
  const wf = shortWf(c.entryWorkflow);
  const n = shortName(c.name);
  const s = (() => {
    switch (o.type) {
      case "first-touch":
        return o.persona === "cfo"
          ? `${n}: cost per interaction on ${lower(wf)}`
          : o.persona === "risk"
            ? `${n}: 100% of conversations audited, not 2%`
            : `${wf} at ${n} — a 10-week test`;
      case "exec-sponsor":
        return `${n}: one workflow, measured in a quarter`;
      case "post-meeting":
        return `Following up: ${lower(wf)} at ${n}`;
      case "pilot-proposal":
        return `Pilot proposal — ${wf} (${PACKAGES[c.packageRec].name})`;
      case "reengage":
        return `Picking this back up: ${lower(wf)}`;
    }
  })();
  return capSubject(s);
}

// ─── Composer ───────────────────────────────────────────────────────────────

export function composeEmail(c: EmailContext, o: EmailOptions): ComposedEmail {
  const paras: string[] = [];
  const detailed = o.length === "detailed";
  const short = o.length === "short";

  paras.push(openingLine(c, o));

  switch (o.type) {
    case "first-touch": {
      paras.push(contextLine(c, o));
      paras.push(personaHook(o.persona, c));
      if (!short) paras.push(whatWeDoLine(c));
      if (detailed) paras.push(economicsLine(c));
      if (detailed && o.persona === "risk") paras.push(governanceLine());
      paras.push(personaAsk(o.persona, c));
      break;
    }
    case "exec-sponsor": {
      paras.push(
        `${contextLine(c, o)} The reason I'm writing to you rather than further down: this needs one decision, not a procurement cycle — a single workflow, funded for a quarter, with agreed success thresholds.`,
      );
      paras.push(personaHook(o.persona, c));
      if (!short) paras.push(whatWeDoLine(c));
      paras.push(economicsLine(c));
      if (detailed) paras.push(packageLine(c));
      paras.push(
        `If the numbers don't hold at the end of the pilot, we stop — that's the point of scoping it this tightly. ${personaAsk(o.persona, c)}`,
      );
      break;
    }
    case "post-meeting": {
      paras.push(`Thank you for the time earlier — it was a useful conversation.`);
      paras.push(
        `What I took away: ${lower(c.entryWorkflow)} is where the volume and the frustration meet, and ${lower(first(c.gaps, "customers still can't complete the request end-to-end without a person"))}.`,
      );
      if (!short) paras.push(whatWeDoLine(c));
      paras.push(economicsLine(c));
      if (detailed && c.discovery?.length) {
        paras.push(
          `To sharpen this before the next session, the things we'd need from your side are: ${c.discovery.slice(0, 3).map(lower).join("; ")}.`,
        );
      }
      paras.push(
        `I'll send a one-page scope ahead of our next conversation. Would ${o.tone === "formal" ? "the coming fortnight" : "sometime in the next two weeks"} suit for a follow-up with ${first(c.stakeholders, "your operations and technology leads")}?`,
      );
      break;
    }
    case "pilot-proposal": {
      paras.push(`As promised, here is the proposed shape of a first deployment for ${c.name}.`);
      paras.push(pilotLine(c));
      paras.push(packageLine(c));
      if (!short) paras.push(economicsLine(c));
      paras.push(governanceLine());
      if (detailed) {
        paras.push(
          `Success criteria we'd agree up front: containment on the pilot intents, resolution quality against your current baseline, customer satisfaction versus the human-handled control, and cost per completed interaction. If those thresholds aren't met, the pilot ends there.`,
        );
      }
      paras.push(
        `If this looks right, the next step is a half-day working session with ${first(c.stakeholders, "your workflow owner and platform lead")} to baseline today's numbers and confirm the integration boundary.`,
      );
      break;
    }
    case "reengage": {
      paras.push(
        c.signal
          ? `It's been a while since we spoke about ${lower(c.entryWorkflow)} at ${shortName(c.name)}. I'm coming back to it for a reason. ${c.signal}`
          : `It's been a while since we spoke about ${lower(c.entryWorkflow)} at ${shortName(c.name)}, and I wanted to come back with something more concrete than last time.`,
      );
      paras.push(personaHook(o.persona, c));
      if (!short) paras.push(economicsLine(c));
      paras.push(
        `No pitch needed — if it's still not the right quarter, tell me and I'll stop. If it is, ${lower(personaAsk(o.persona, c))}`,
      );
      break;
    }
  }

  paras.push(signoff(o));

  return { subject: subjectFor(c, o), body: paras.join("\n\n") };
}

// ─── Context builders ───────────────────────────────────────────────────────

export function contextFromAccount(a: {
  name: string; market: MarketId; vertical: string; entryWorkflow: string; outcome: string;
  packageRec: PackageId; existing: { gaps: string[] }; earningsSignals: { signal: string; kind: string }[];
  volumeMonthly: number; costPerInteraction: number; languages: string[];
  validate: string[]; workflows: { name: string }[];
}, grossAnnual?: number): EmailContext {
  // Only non-hypothesis signals are safe to quote back to a customer.
  const safeSignal = a.earningsSignals.find((s) => s.kind !== "hypothesis")?.signal;
  return {
    name: a.name, market: a.market, vertical: a.vertical,
    entryWorkflow: a.entryWorkflow, outcome: a.outcome, packageRec: a.packageRec,
    gaps: a.existing.gaps, signal: safeSignal, grossAnnual,
    volumeMonthly: a.volumeMonthly, costPerInteraction: a.costPerInteraction,
    languages: a.languages,
  };
}
