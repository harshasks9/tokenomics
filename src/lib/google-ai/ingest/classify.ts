/**
 * Rule-based classification and entity resolution for detected items.
 *
 * Deliberately deterministic: every label can be traced to a pattern, and
 * nothing here is presented to readers as a verified fact — detected items
 * are triage for the editors.
 */
import { ENTITIES } from "../kb";
import { norm } from "../engine/search";
import type { AnnouncementType, LayerId, RadarArea } from "../types";

const TYPE_RULES: [AnnouncementType, RegExp][] = [
  ["deprecation", /\b(deprecat\w*|retir\w*|sunset\w*|shut(?:ting)? down|end of life|discontinu\w*|turn(?:ed|ing)? off)\b/i],
  ["pricing", /\b(pric\w+|price cut|price increase|\$\d[\d.,]*\s?(?:\/|per)\s?(?:1?m|million|user|seat|month)|billing|free tier|discount\w*|cheaper|cost[- ]effective tier)\b/i],
  ["rename", /\b(renam\w*|rebrand\w*|now called|is now|formerly|new name)\b/i],
  ["availability", /\b(generally available|general availability|\bGA\b|public preview|private preview|now available|rolling out|rollout|expands? to|available in \d+|new regions?|countries)\b/i],
  ["model-launch", /\b(introduc\w+|announc\w+|launch\w*|releas\w*|meet|unveil\w*)\b.{0,60}\b(gemini|gemma|veo|imagen|lyria|genie|model|gpt|claude|llama|grok|qwen|deepseek)\b/i],
  ["model-update", /\b(updated?|improv\w+|upgrade\w*|new version|stable version|snapshot)\b.{0,60}\b(gemini|gemma|veo|imagen|lyria|model)\b/i],
  ["infrastructure", /\b(tpu|ironwood|trillium|axion|gpu|data cent\w+|hypercomputer|gigawatt|\bGW\b|capex|capital expenditure|chips?|silicon|supercomputer|subsea)\b/i],
  ["research", /\b(research|paper|nature|science journal|arxiv|breakthrough|alpha(?:fold|evolve|genome|proof|geometry|go)\w*|scientific|discovery)\b/i],
  ["benchmark", /\b(benchmark\w*|leaderboard|state[- ]of[- ]the[- ]art|sota|swe-bench|lmarena|arc-agi|eval(?:uation)? results?)\b/i],
  ["partnership", /\b(partner\w*|collaborat\w+|alliance|teams? up|joint|agreement with|deal with)\b/i],
  ["customer", /\b(customer stor\w+|case study|how .{3,40} (?:uses|is using|built)|deploys?|adopts?|chooses|selects) \b/i],
  ["acquisition", /\b(acqui\w+|to buy|merger|invest(?:s|ment) in)\b/i],
  ["safety-governance", /\b(safety|responsib\w+|synthid|watermark\w*|red[- ]team\w*|frontier safety|governance|model armor|guardrails?|security)\b/i],
  ["policy-regulatory", /\b(regulat\w+|antitrust|court|ruling|doj|european commission|eu ai act|policy|legislation|compliance|sovereign\w*)\b/i],
  ["open-source", /\b(open[- ]source\w*|open[- ]weights?|apache 2\.0|github|hugging face|open model)\b/i],
  ["event", /\b(google i\/o|cloud next|keynote|summit|conference|event recap|what we announced)\b/i],
  ["financial", /\b(earnings|revenue|quarter(?:ly)?|q[1-4] 20\d\d|backlog|guidance|investor)\b/i],
  ["product-launch", /\b(introduc\w+|announc\w+|launch\w*|unveil\w*|new)\b/i],
  ["product-update", /\b(update\w*|new features?|improv\w+|now supports?|adds?|enhanc\w+)\b/i],
];

const AREA_RULES: [RadarArea, RegExp][] = [
  ["models", /\b(gemini \d|gemini (?:pro|flash|ultra)|gemma|model|flash-lite|deep think|embedding)\b/i],
  ["infrastructure", /\b(tpu|ironwood|axion|gpu|data cent\w+|hypercomputer|capex|chips?|network\w*)\b/i],
  ["developer-platforms", /\b(gemini api|ai studio|sdk|developers?|vertex|agent platform|model garden|cli|antigravity|jules|firebase|colab|api)\b/i],
  ["enterprise-agents", /\b(gemini enterprise|agentspace|agents?|agentic|adk|a2a|mcp|agent (?:runtime|engine|registry|gateway|identity)|customer engagement)\b/i],
  ["workspace", /\b(workspace|gmail|docs|sheets|slides|meet|drive|notebooklm|chat)\b/i],
  ["search-consumer", /\b(search|ai mode|ai overviews?|gemini app|android|pixel|chrome|youtube|maps|photos|shopping|google home|google tv)\b/i],
  ["multimodal", /\b(veo|imagen|nano banana|lyria|flow|image generation|video generation|audio|voice|speech|live api|music|genie|world model|3d)\b/i],
  ["safety-governance", /\b(safety|responsib\w+|synthid|watermark\w*|governance|model armor|guardrails?|privacy|security|regulat\w+|antitrust)\b/i],
  ["research", /\b(research|deepmind|paper|nature|arxiv|alpha\w+|science|discovery|quantum)\b/i],
];

const AREA_LAYER: Record<RadarArea, LayerId> = {
  models: "models",
  infrastructure: "infrastructure",
  "developer-platforms": "platform",
  "enterprise-agents": "agents",
  workspace: "enterprise",
  "search-consumer": "consumer",
  multimodal: "models",
  "safety-governance": "agents",
  research: "research",
};

/** Does the text concern AI at all? Used to filter general-purpose feeds. */
export const AI_SIGNAL = /\b(ai|a\.i\.|gemini|gemma|agent\w*|llm|model|generative|genai|machine learning|\bml\b|tpu|deepmind|notebooklm|vertex|copilot|gpt|claude)\b/i;

export function classifyTypes(textIn: string): AnnouncementType[] {
  const out: AnnouncementType[] = [];
  for (const [type, re] of TYPE_RULES) if (re.test(textIn)) out.push(type);
  // The two generic product rules are fallbacks: drop them when something specific matched.
  const specific = out.filter((t) => t !== "product-launch" && t !== "product-update");
  if (specific.length) {
    const keep = out.filter((t) => t === "product-launch" || t === "product-update").slice(0, specific.some((t) => t === "model-launch" || t === "model-update") ? 0 : 1);
    return [...specific, ...keep].slice(0, 4);
  }
  return out.slice(0, 1).length ? out.slice(0, 1) : ["product-update"];
}

export function classifyAreas(textIn: string): RadarArea[] {
  return AREA_RULES.filter(([, re]) => re.test(textIn)).map(([a]) => a);
}

export function layersFor(areas: RadarArea[], fallback: LayerId[]): LayerId[] {
  const out = [...new Set(areas.map((a) => AREA_LAYER[a]))];
  return out.length ? out : fallback;
}

interface AliasEntry {
  id: string;
  phrase: string;
}

let ALIASES: AliasEntry[] | null = null;
function aliasTable(): AliasEntry[] {
  if (ALIASES) return ALIASES;
  const rows: AliasEntry[] = [];
  for (const e of ENTITIES) {
    // Names, former names and model ids always count. A bare one-word alias ("Search", "Argon", "Flow")
    // is too ambiguous to resolve from free text, so aliases need a second word, a digit or a separator.
    const strong = [e.name, ...(e.formerNames ?? []).map((f) => f.name), ...(e.model?.apiIds ?? [])];
    const aliases = e.aliases.filter((a) => /[\s\d.\-/]/.test(a.trim()));
    for (const n of [...strong, ...aliases]) {
      const phrase = norm(n);
      if (phrase.length < 3) continue;
      rows.push({ id: e.id, phrase });
    }
  }
  // Longest phrases first so "gemini enterprise agent platform" wins over "gemini enterprise".
  return (ALIASES = rows.sort((a, b) => b.phrase.length - a.phrase.length));
}

/** Resolve mentions in free text to canonical entity ids. Longest match wins; overlapping shorter matches are ignored. */
export function resolveEntities(textIn: string, limit = 8): string[] {
  let hay = ` ${norm(textIn)} `;
  const found: string[] = [];
  for (const a of aliasTable()) {
    const needle = ` ${a.phrase} `;
    if (!hay.includes(needle)) continue;
    if (!found.includes(a.id)) found.push(a.id);
    hay = hay.split(needle).join(" ¤ ");
    if (found.length >= limit) break;
  }
  return found;
}
