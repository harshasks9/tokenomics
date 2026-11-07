/**
 * Live by Lunch — campaign data. Built from the Agentify collections so the
 * campaign page and the before/after walkthrough never disagree. Plain,
 * serializable data only (safe to pass from a server page to a client component).
 */
import { DAYS, FUNCTION_USECASES, FUNCTIONS } from "@/lib/agentify/functions";
import type { FunctionId } from "@/lib/agentify/functions-types";

export interface TrackAgent { title: string; summary: string; surfaces: string[] }

export interface Track {
  id: FunctionId;
  name: string;
  tagline: string;
  roles: string[];
  outcomes: { label: string; value: string }[];
  trust: string[];
  /** The agent the team takes live in the morning. */
  live: TrackAgent;
  /** The rest of the collection, for the 30 days after. */
  next: TrackAgent[];
  /** Three recurring tasks to suggest in the registration form. */
  taskIdeas: string[];
  persona: { name: string; first: string; role: string; company: string; initials: string };
  before: { end: string; busywork: number; slipped: number };
  after: { end: string; back: number; approvals: number };
}

/**
 * The agent each track takes live in the morning: the one with the smallest
 * blast radius and a weekly rhythm, not necessarily the collection's hero.
 */
const LIVE_BY_LUNCH: Record<FunctionId, string> = {
  fpa: "fn-fpa-forecast",
  devops: "fn-devops-handoff",
  secops: "fn-secops-triage",
  revops: "fn-revops-hygiene",
};

/** First idea matches the agent that goes live by lunch. */
const TASK_IDEAS: Record<FunctionId, string[]> = {
  fpa: ["Chase late forecast inputs", "Explain month-end variances", "Answer “how much budget is left?” questions"],
  devops: ["Hand off on-call at shift change", "Draft the postmortem after an incident", "Write release notes from merged changes"],
  secops: ["Triage the overnight alert inbox", "Answer user-reported phishing", "Chase managers for access reviews"],
  revops: ["Flag stale deals before the forecast call", "Prep the deal-desk summary", "Chase reps for next steps"],
};

const agent = (id: string): TrackAgent => {
  const u = FUNCTION_USECASES.find((x) => x.id === id);
  if (!u) throw new Error(`Unknown use case ${id}`);
  return { title: u.title, summary: u.summary, surfaces: u.surfaces };
};

export const TRACKS: Track[] = FUNCTIONS.map((f) => {
  const d = DAYS.find((x) => x.functionId === f.id);
  if (!d) throw new Error(`No day for ${f.id}`);
  return {
    id: f.id,
    name: f.name,
    tagline: f.tagline,
    roles: f.personas,
    outcomes: f.outcomes,
    trust: f.trust,
    live: agent(LIVE_BY_LUNCH[f.id]),
    next: f.useCaseIds.filter((id) => id !== LIVE_BY_LUNCH[f.id]).map(agent),
    taskIdeas: TASK_IDEAS[f.id],
    persona: { ...d.persona, first: d.persona.name.split(" ")[0] },
    before: { end: d.before.stats.endOfDay, busywork: d.before.stats.hoursOnBusywork, slipped: d.before.stats.slipped },
    after: { end: d.after.stats.endOfDay, back: d.after.stats.hoursReturned, approvals: d.after.stats.approvals },
  };
});
