import type {
  Assertion, Debate, Evidence, HistEvent, Implication, Judgment, Metric, Period, Relation, Scenario,
  Synthesis, Technology, Thesis, Thinker, MethodNotes,
} from "./types";
import thinkersJson from "./data/thinkers.json";
import evidenceJson from "./data/evidence.json";
import assertionsJson from "./data/assertions.json";
import relationsJson from "./data/relations.json";
import eventsJson from "./data/events.json";
import periodsJson from "./data/periods.json";
import metricsJson from "./data/metrics.json";
import thesesJson from "./data/theses.json";
import debatesJson from "./data/debates.json";
import scenariosJson from "./data/scenarios.json";
import implicationsJson from "./data/implications.json";
import judgmentsJson from "./data/judgments.json";
import technologiesJson from "./data/technologies.json";
import synthesisJson from "./data/synthesis.json";
import methodJson from "./data/method.json";
import { COHORTS, PERIOD_ORDER } from "./taxonomy";

/**
 * Typed access to the research dataset. JSON stays the source of truth so the
 * graph can be updated (or exported) without touching presentation code.
 */
export const THINKERS = (thinkersJson as unknown as Thinker[]).sort(
  (a, b) => COHORTS.findIndex((c) => c.id === a.cohort) - COHORTS.findIndex((c) => c.id === b.cohort) || a.name.localeCompare(b.name),
);
export const EVIDENCE = evidenceJson as unknown as Evidence[];
export const ASSERTIONS = assertionsJson as unknown as Assertion[];
export const RELATIONS = relationsJson as unknown as Relation[];
export const EVENTS = (eventsJson as unknown as HistEvent[]).sort((a, b) => a.date.localeCompare(b.date));
export const PERIODS = (periodsJson as unknown as Period[]).sort((a, b) => PERIOD_ORDER.indexOf(a.id) - PERIOD_ORDER.indexOf(b.id));
export const METRICS = metricsJson as unknown as Metric[];
export const THESES = thesesJson as unknown as Thesis[];
export const DEBATES = debatesJson as unknown as Debate[];
export const SCENARIOS = scenariosJson as unknown as Scenario[];
export const IMPLICATIONS = implicationsJson as unknown as Implication[];
export const JUDGMENTS = judgmentsJson as unknown as Judgment[];
export const TECHNOLOGIES = technologiesJson as unknown as Technology[];
export const SYNTHESIS = synthesisJson as unknown as Synthesis;
export const METHOD = methodJson as unknown as MethodNotes;

const evIndex = new Map(EVIDENCE.map((e) => [e.id, e]));
export const evidenceById = (id: string) => evIndex.get(id);
const thIndex = new Map(THINKERS.map((t) => [t.id, t]));
export const thinkerById = (id: string) => thIndex.get(id);
const asIndex = new Map(ASSERTIONS.map((a) => [a.id, a]));
export const assertionById = (id: string) => asIndex.get(id);
const thesisIndex = new Map(THESES.map((t) => [t.id, t]));
export const thesisById = (id: string) => thesisIndex.get(id);
export const claimsOf = (thinkerId: string) =>
  ASSERTIONS.filter((a) => a.thinkerId === thinkerId).sort((a, b) => a.date.localeCompare(b.date));
export const nameOf = (id: string) => thIndex.get(id)?.name ?? id.replace(/^(org|tech):/, "");
