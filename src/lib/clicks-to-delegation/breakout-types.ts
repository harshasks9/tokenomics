/** Types for the Agentic Commerce breakout talk (narrative + slides). */
import type { EvidenceKind } from "./types";

export interface Stat { value: string; label: string; kind: EvidenceKind; sourceIds: string[] }

export type SlideBody =
  | { type: "title"; kicker: string; title: string; subtitle: string }
  | { type: "stats"; stats: Stat[]; caption?: string }
  | { type: "bundle"; items: { need: string; sea: string; detail: string; sourceIds: string[] }[] }
  | { type: "planes"; planes: { name: string; job: string; items: string[]; handoff?: string }[] }
  | { type: "cases"; cases: { name: string; rung: string; what: string; cloud: string; kpi: string }[] }
  | { type: "points"; points: { head: string; text: string; sourceIds?: string[] }[] }
  | { type: "pilots"; pilots: { name: string; scope: string; kpi: string; gate: string }[] }
  | { type: "handoff"; next: { who: string; topic: string; bridge: string }[] };

export interface Slide {
  id: string;
  minute: string; // "0:00"
  minutes: number; // planned duration
  title: string;
  headline: string; // the one sentence the room should remember
  body: SlideBody;
  notes: string[]; // speaker notes
  sourceIds?: string[];
}

export interface AgendaItem { minutes: number; title: string; speaker: string; role?: string; mine?: boolean; link: string }
