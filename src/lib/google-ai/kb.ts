/**
 * Knowledge base — the single access layer over the canonical dataset.
 * Pages, search, the analyst and the ingestion pipeline all read from here.
 */
import announcementsJson from "./data/announcements.json";
import availabilityJson from "./data/availability.json";
import battlegroundsJson from "./data/battlegrounds.json";
import casesJson from "./data/cases.json";
import notesJson from "./data/notes.json";
import quizJson from "./data/quiz.json";
import regionsJson from "./data/regions.json";
import benchmarksJson from "./data/benchmarks.json";
import entitiesJson from "./data/entities.json";
import lifecycleJson from "./data/lifecycle.json";
import metaJson from "./data/meta.json";
import pricesJson from "./data/prices.json";
import relationshipsJson from "./data/relationships.json";
import resultsJson from "./data/results.json";
import sourcesJson from "./data/sources.json";
import timelineJson from "./data/timeline.json";
import { fmtDate } from "./dates";
import type {
  Announcement,
  AvailabilityRecord,
  Battleground,
  BenchmarkDef,
  BenchmarkResult,
  CaseStudy,
  DatasetMeta,
  Entity,
  LayerId,
  LifecycleEvent,
  PriceRecord,
  QuizQuestion,
  RegionBrief,
  Relationship,
  Source,
  SpecialistNote,
  TimelineEvent,
} from "./types";

export const META = metaJson as DatasetMeta;
export const SOURCES = sourcesJson as Source[];
export const ENTITIES = entitiesJson as Entity[];
export const RELATIONSHIPS = relationshipsJson as Relationship[];
export const PRICES = pricesJson as PriceRecord[];
export const BENCHMARKS = benchmarksJson as BenchmarkDef[];
export const RESULTS = resultsJson as BenchmarkResult[];
export const AVAILABILITY = availabilityJson as AvailabilityRecord[];
export const LIFECYCLE = lifecycleJson as LifecycleEvent[];
export const ANNOUNCEMENTS = (announcementsJson as Announcement[]).slice().sort((a, b) => b.date.localeCompare(a.date));
export const TIMELINE = (timelineJson as TimelineEvent[]).slice().sort((a, b) => a.date.localeCompare(b.date));
export const BATTLEGROUNDS = battlegroundsJson as Battleground[];
export const CASES = (casesJson as CaseStudy[]).slice().sort((a, b) => Number(a.dateBasis === "read") - Number(b.dateBasis === "read") || b.date.localeCompare(a.date));
export const NOTES = notesJson as SpecialistNote[];
export const REGION_BRIEFS = regionsJson as RegionBrief[];
export const QUIZ = quizJson as QuizQuestion[];
export const NOTE_BY_ANNOUNCEMENT: Record<string, SpecialistNote> = Object.fromEntries(NOTES.map((n) => [n.announcementId, n]));

function index<T extends { id: string }>(rows: T[]): Record<string, T> {
  const out: Record<string, T> = {};
  for (const r of rows) out[r.id] = r;
  return out;
}
function group<T>(rows: T[], key: (r: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const r of rows) (out[key(r)] ??= []).push(r);
  return out;
}

export const SOURCE_BY_ID = index(SOURCES);
export const ENTITY_BY_ID = index(ENTITIES);
export const ANNOUNCEMENT_BY_ID = index(ANNOUNCEMENTS);
export const BENCHMARK_BY_ID = index(BENCHMARKS);
export const PRICES_BY_ENTITY = group(PRICES, (p) => p.entityId);
export const RESULTS_BY_MODEL = group(RESULTS, (r) => r.modelId);
export const LIFECYCLE_BY_ENTITY = group(LIFECYCLE, (l) => l.entityId);
export const AVAILABILITY_BY_ENTITY = group(AVAILABILITY, (a) => a.entityId);

export const PROVIDERS = ENTITIES.filter((e) => e.kind === "provider");
export const MODELS = ENTITIES.filter((e) => e.kind === "model");
export const GOOGLE = ENTITIES.filter((e) => e.providerId === "google" && e.kind !== "provider");

export interface LayerDef {
  id: LayerId;
  n: number;
  name: string;
  short: string;
  question: string;
  blurb: string;
}

/** The eight-layer view. Conceptual: one product can touch several layers; each entity is counted once, in its home layer. */
export const LAYERS: LayerDef[] = [
  { id: "infrastructure", n: 1, name: "Infrastructure", short: "Infra", question: "What does it run on?", blurb: "Custom silicon, GPUs, networking and data centers that train and serve the models." },
  { id: "research", n: 2, name: "Foundational research", short: "Research", question: "Where do the ideas come from?", blurb: "Google DeepMind and Google Research: the science that later ships as product." },
  { id: "models", n: 3, name: "Foundation models", short: "Models", question: "What are the models?", blurb: "Gemini and the specialist families for image, video, audio, embeddings, open weights and robotics." },
  { id: "platform", n: 4, name: "Model serving & developer platform", short: "Platform", question: "How do builders reach the models?", blurb: "The Gemini API, AI Studio and the Google Cloud platform for serving, tuning and evaluating models." },
  { id: "agents", n: 5, name: "Agents & application infrastructure", short: "Agents", question: "How do agents get built and governed?", blurb: "Frameworks, runtime, memory, grounding, protocols, identity and policy for agents." },
  { id: "enterprise", n: 6, name: "Enterprise AI products", short: "Enterprise", question: "What do companies buy?", blurb: "Gemini Enterprise, Workspace, Gemini for Google Cloud and industry applications." },
  { id: "consumer", n: 7, name: "Consumer & ecosystem distribution", short: "Consumer", question: "Where do people meet it?", blurb: "The Gemini app, Search, Android, Chrome, YouTube and the Workspace apps people use daily." },
  { id: "ecosystem", n: 8, name: "Ecosystem & commercialization", short: "Ecosystem", question: "How does it reach the market?", blurb: "Partners, marketplaces, model partners, compute customers and the commercial results." },
];
export const LAYER_BY_ID = Object.fromEntries(LAYERS.map((l) => [l.id, l])) as Record<LayerId, LayerDef>;

export function entity(id: string): Entity | undefined {
  return ENTITY_BY_ID[id];
}
export function entityName(id: string): string {
  return ENTITY_BY_ID[id]?.name ?? id;
}
export function providerName(id: string): string {
  return ENTITY_BY_ID[id]?.name ?? id.charAt(0).toUpperCase() + id.slice(1);
}

/** Edges touching an entity, both directions. */
export function edgesOf(id: string): Relationship[] {
  return RELATIONSHIPS.filter((r) => r.from === id || r.to === id);
}

/** Announcements that mention an entity, newest first. */
export function announcementsFor(id: string): Announcement[] {
  return ANNOUNCEMENTS.filter((a) => a.entityIds.includes(id));
}

/** Path on the site for any canonical entity. */
export function entityHref(e: Entity | string): string {
  const id = typeof e === "string" ? e : e.id;
  return `/google-ai/entity/${id}`;
}

/** Introduction date at the precision it is actually known to. */
export function fmtIntro(e: Pick<Entity, "introducedAt" | "introducedPrecision">): string {
  return fmtDate(e.introducedAt, e.introducedPrecision ?? "day");
}
