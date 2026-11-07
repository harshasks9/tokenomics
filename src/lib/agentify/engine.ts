/**
 * Event engine: the world is the seed plus an ordered log; every event is
 * re-authorized on replay. Handlers check first, then mutate.
 */
import { ACCOUNTS, CUSTOMER_ACCOUNT, PARTNER_PERSONA_ID, PARTNERS, PROGRAM } from "./data";
import { ALL_USECASES as USECASES } from "./catalog";
import { creditsFor, earnedStage, STAGES, stats } from "./model";
import type { Account, Event, PersonaId, Stage, World } from "./types";

export class PolicyError extends Error {}
const deny = (m: string): never => { throw new PolicyError(m); };

export const MAX_EVENTS = 300;
export const PARTNER_CREDIT_CAP = 5_000;

export function seed(): World {
  return { seq: 0, accounts: structuredClone(ACCOUNTS), creditsUsed: 0, log: [] };
}

/** Which accounts a persona may see and act on. */
export function canSee(persona: PersonaId, a: Account): boolean {
  if (persona === "google") return true;
  if (persona === "partner") return a.partnerId === PARTNER_PERSONA_ID;
  return a.id === CUSTOMER_ACCOUNT;
}

function account(w: World, persona: PersonaId, id: string): Account {
  const a = w.accounts.find((x) => x.id === id);
  if (!a || !canSee(persona, a)) deny("Account not found or not yours.");
  return a!;
}

const order = (s: Stage) => STAGES.findIndex((x) => x.id === s);

function apply(w: World, persona: PersonaId, ev: Event["action"]) {
  const say = (text: string, accountId?: string) => w.log.push({ seq: w.seq, actor: persona, text, accountId });
  switch (ev.type) {
    case "workshop.register": {
      const a = account(w, persona, ev.accountId);
      if (a.sovereign) deny("Sovereign Controls customers are out of scope for the initial beta.");
      if (a.stage !== "qualified") deny("A workshop is already booked or done for this account.");
      const week = Math.round(Number(ev.week));
      if (!(week >= 1 && week <= PROGRAM.quarterWeeks)) deny("Pick a week in Q1 (1–13).");
      a.stage = "scheduled";
      a.workshopWeek = week;
      say(`Booked Agentify your Day for ${a.name} in week ${week}`, a.id);
      return;
    }
    case "workshop.complete": {
      if (persona === "customer") deny("Workshops are marked complete by the delivering partner.");
      const a = account(w, persona, ev.accountId);
      if (a.stage !== "scheduled") deny("Book the workshop first.");
      const ids = (ev.useCaseIds ?? []).filter((id) => USECASES.some((u) => u.id === id));
      if (ids.length < 1) deny("Record at least one long-running use case the champions built.");
      a.stage = "agentified";
      a.enabled = [...new Set([...a.enabled, ...ids])];
      say(`Ran Agentify your Day at ${a.name}: ${ids.length} long-running agent${ids.length > 1 ? "s" : ""} live`, a.id);
      return;
    }
    case "usecase.enable": {
      const a = account(w, persona, ev.accountId);
      if (!USECASES.some((u) => u.id === ev.useCaseId)) deny("Unknown use case.");
      if (a.enabled.includes(ev.useCaseId)) deny("Already enabled.");
      a.enabled.push(ev.useCaseId);
      say(`Enabled ${USECASES.find((u) => u.id === ev.useCaseId)!.title} at ${a.name}`, a.id);
      return;
    }
    case "account.advance": {
      if (persona === "customer") deny("Stages are tracked by the program, not set by the customer.");
      const a = account(w, persona, ev.accountId);
      const to = ev.to;
      if (order(to) !== order(a.stage) + 1) deny("Stages move one step at a time.");
      if (to === "scheduled" || to === "agentified") deny("Use “Book workshop” / “Mark workshop done” for this step.");
      const earned = earnedStage(a, stats(a));
      if (order(earned) < order(to)) {
        const s = stats(a);
        deny(`Telemetry doesn't support “${to}” yet: median user at ${s.median} tasks/week, ${new Set([...Object.keys(a.useCases), ...a.enabled]).size} use cases. Stages follow the median, not a claim.`);
      }
      a.stage = to;
      say(`${a.name} moved to ${to}`, a.id);
      return;
    }
    case "credits.allocate": {
      if (persona === "customer") deny("POC credits are allocated by the program — ask your partner.");
      const a = account(w, persona, ev.accountId);
      const users = Math.round(Number(ev.newUsers));
      if (!(users >= 1 && users <= 500)) deny("Allocate for 1–500 new users.");
      const cost = creditsFor(a, users);
      if (persona === "partner" && a.credits + cost > PARTNER_CREDIT_CAP) deny(`Partners can allocate up to $${PARTNER_CREDIT_CAP.toLocaleString("en-US")} per account; larger asks go to the AWT lead.`);
      if (w.creditsUsed + cost > PROGRAM.pocCreditPool) deny(`Only $${(PROGRAM.pocCreditPool - w.creditsUsed).toLocaleString("en-US")} left in the $50K POC pool.`);
      if (!["agentified", "using", "expanding"].includes(a.stage)) deny("Credits are for new users at accounts already agentified — activation first.");
      a.credits += cost;
      a.newUsers += users;
      w.creditsUsed += cost;
      say(`Allocated $${cost.toLocaleString("en-US")} POC credits: ${users} new users at ${a.name} for ${PROGRAM.pocMonths} months`, a.id);
      return;
    }
    case "account.assign": {
      if (persona !== "google") deny("Only the central team assigns partners.");
      const a = account(w, persona, ev.accountId);
      const p = PARTNERS.find((x) => x.id === ev.partnerId) ?? deny("Unknown partner.");
      if (p.subRegion !== a.subRegion) deny(`${p.name} covers ${p.subRegion}, not ${a.subRegion}.`);
      a.partnerId = p.id;
      say(`Assigned ${a.name} to ${p.name}`, a.id);
      return;
    }
    default:
      deny("Unknown action.");
  }
}

const PERSONAS: PersonaId[] = ["customer", "partner", "google"];

export function applyEvent(w: World, e: Event) {
  if (!e || !PERSONAS.includes(e.actor) || !e.action || typeof e.action !== "object") deny("Malformed event.");
  w.seq += 1;
  try { apply(w, e.actor, e.action); } catch (err) { w.seq -= 1; throw err; }
}

export function replay(events: Event[]) {
  const w = seed();
  const ok: Event[] = [];
  for (const [i, e] of (Array.isArray(events) ? events.slice(0, MAX_EVENTS) : []).entries()) {
    const snap = structuredClone(w);
    try { applyEvent(w, e); ok.push(e); } catch (err) {
      return { world: snap, events: ok, rejected: { index: i, reason: err instanceof PolicyError ? err.message : "Malformed event." } };
    }
  }
  return { world: w, events: ok };
}

export function attempt(w: World, e: Event): { ok: true; world: World } | { ok: false; reason: string } {
  const next = structuredClone(w);
  try { applyEvent(next, e); return { ok: true, world: next }; } catch (err) {
    return { ok: false, reason: err instanceof PolicyError ? err.message : "Something went wrong." };
  }
}
