/**
 * Server-only: "Try it" — runs a package's instructions on an input.
 * Live with Gemini when GEMINI_API_KEY is configured, otherwise a recorded run
 * from the package's own examples/ (clearly labeled as recorded).
 */
import { GoogleGenAI } from "@google/genai";
import { PERSONA_USER } from "./data";
import { fileOf, instructionPath, refOf, resolveFor, schemaFor } from "./packages";
import { canViewAsset, orgById, userById } from "./policy";
import { parseSkill } from "./skillmd";
import type { Asset, PersonaId, World } from "./types";

export const RUN_MODEL = process.env.ASSET_FACTORY_GEMINI_MODEL ?? process.env.BRIEF_GEMINI_MODEL ?? "gemini-3.5-flash";
const MAX_INPUT = 6000;

export interface TraceStep { label: string; detail: string; ms: number; status: "ok" | "warn" | "fail" }

export interface RunResult {
  ok: boolean;
  mode: "live" | "recorded";
  model: string;
  output: unknown;
  outputText: string;
  trace: TraceStep[];
  latencyMs: number;
  tokens: { input: number; output: number } | null;
  /** Modeled cost of this one execution, USD. */
  costUsd: number;
  validation: { valid: boolean; issues: string[] } | null;
  note?: string;
  reason?: string;
}

function apiKey() {
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
}

function stripJson(text: string): unknown {
  const t = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  try {
    return JSON.parse(t);
  } catch {
    const m = /\{[\s\S]*\}/.exec(t);
    if (m) {
      try { return JSON.parse(m[0]); } catch { /* fall through */ }
    }
    return null;
  }
}

/** Shallow JSON Schema check: required keys, primitive types, enums. */
export function validate(output: unknown, schemaText: string | null | undefined): { valid: boolean; issues: string[] } | null {
  if (!schemaText) return null;
  let schema: { type?: string; required?: string[]; properties?: Record<string, { type?: string | string[]; enum?: unknown[] }> };
  try { schema = JSON.parse(schemaText); } catch { return null; }
  const issues: string[] = [];
  if (!output || typeof output !== "object" || Array.isArray(output)) return { valid: false, issues: ["Output is not a JSON object"] };
  const o = output as Record<string, unknown>;
  for (const k of schema.required ?? []) if (!(k in o)) issues.push(`missing required field “${k}”`);
  for (const [k, p] of Object.entries(schema.properties ?? {})) {
    if (!(k in o) || o[k] === null) continue;
    const v = o[k];
    const types = Array.isArray(p.type) ? p.type : p.type ? [p.type] : [];
    const actual = Array.isArray(v) ? "array" : typeof v === "number" ? (Number.isInteger(v) ? "integer" : "number") : typeof v;
    if (types.length && !types.some((t) => t === actual || (t === "number" && actual === "integer"))) issues.push(`“${k}” should be ${types.join("|")}, got ${actual}`);
    if (p.enum && !p.enum.includes(v)) issues.push(`“${k}” = ${JSON.stringify(v)} is not one of ${p.enum.map((e) => JSON.stringify(e)).join(", ")}`);
  }
  return { valid: issues.length === 0, issues };
}

/** Sanitize a JSON schema to the subset the model API accepts. */
function responseSchema(schemaText: string | null | undefined): Record<string, unknown> | undefined {
  if (!schemaText) return undefined;
  try {
    const strip = (node: unknown): unknown => {
      if (Array.isArray(node)) return node.map(strip);
      if (!node || typeof node !== "object") return node;
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(node)) {
        if (["$schema", "$id", "$comment", "examples", "default", "additionalProperties", "title"].includes(k)) continue;
        out[k] = strip(v);
      }
      return out;
    };
    return strip(JSON.parse(schemaText)) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

function instructionsFor(a: Asset, world: World, persona: PersonaId): { text: string; source: string; chain: string[] } {
  const viewer = userById.get(PERSONA_USER[persona])!;
  const resolved = resolveFor(a, world, viewer);
  if (resolved) return { text: resolved.md, source: `resolved SKILL.md (${resolved.chain.join(" → ")})`, chain: resolved.chain };
  const path = instructionPath(a) ?? "";
  let text = fileOf(a, path) ?? "";
  if (a.type === "blueprint") {
    // A blueprint run gives the planner its bundled skills' instructions too.
    const skills = (a.includes ?? [])
      .map((id) => world.assets.find((x) => x.id === id))
      .filter((x): x is Asset => Boolean(x && x.type === "skill" && canViewAsset(viewer, x, world)));
    for (const s of skills) {
      const md = fileOf(s, "SKILL.md");
      if (!md) continue;
      const instr = parseSkill(md).sections.find((x) => x.heading.toLowerCase() === "instructions");
      if (instr) text += `\n\n## Skill: ${refOf(s)}\n\n${instr.body}`;
    }
  }
  return { text, source: path, chain: [refOf(a)] };
}

const buckets = new Map<string, { n: number; reset: number }>();
export function rateLimited(key: string, limit = 12): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { n: 1, reset: now + 60_000 });
    return false;
  }
  b.n += 1;
  return b.n > limit;
}

export async function runAsset(world: World, persona: PersonaId, idOrSlug: string, rawInput: string): Promise<RunResult | null> {
  const viewer = userById.get(PERSONA_USER[persona])!;
  const a = world.assets.find((x) => x.id === idOrSlug || x.slug === idOrSlug);
  if (!a || !canViewAsset(viewer, a, world)) return null;

  const trace: TraceStep[] = [];
  const t0 = Date.now();
  const step = (label: string, detail: string, status: TraceStep["status"] = "ok") => trace.push({ label, detail, ms: Date.now() - t0, status });

  step("Authorize", `${viewer.name} (${orgById.get(viewer.orgId)?.name}) may run ${refOf(a)} — ${a.visibility} asset`);
  const { text: instructions, source, chain } = instructionsFor(a, world, persona);
  step("Resolve package", chain.length > 1 ? `Inheritance chain ${chain.join(" → ")}` : `${refOf(a)} · ${source}`);
  const schemaText = schemaFor(a, world, viewer) ?? null;
  step("Load instructions", `${instructions.split("\n").length} lines from ${source}${schemaText ? " · output schema schema/output.json" : ""}`);

  const input = String(rawInput ?? "").slice(0, MAX_INPUT);
  const recorded = fileOf(a, "examples/sample-output.json") ?? (a.extendsRef ? fileOf(world.assets.find((x) => x.id === a.extendsRef!.assetId)!, "examples/sample-output.json") : undefined);
  const costPerRun = a.costPer1k / 1000;

  const key = apiKey();
  if (key && instructions) {
    try {
      const client = new GoogleGenAI({ apiKey: key });
      const schema = responseSchema(schemaText);
      const started = Date.now();
      const interaction = (await client.interactions.create({
        model: RUN_MODEL,
        system_instruction: `${instructions}\n\n---\nYou are executing the package above inside the Gemini 10 Asset Factory sandbox. Follow its Instructions, Guardrails and Parameters exactly. Respond with a single JSON object only${schemaText ? " matching the output schema" : ""}. Use only facts present in the input; if something needed is missing, say so in the output rather than inventing it.`,
        input: input || "{}",
        response_format: schema ? { type: "text", mime_type: "application/json", schema } : { type: "text", mime_type: "application/json" },
        store: false,
      } as Parameters<typeof client.interactions.create>[0])) as { output_text?: string; usage?: { total_input_tokens?: number; total_output_tokens?: number } };
      const text = interaction.output_text ?? "";
      const latency = Date.now() - started;
      step(`Call ${RUN_MODEL}`, `${latency} ms · live`, text ? "ok" : "warn");
      const output = stripJson(text);
      const validation = validate(output, schemaText);
      if (validation) step("Validate output", validation.valid ? "Matches schema/output.json" : validation.issues.join("; "), validation.valid ? "ok" : "warn");
      const usage = interaction.usage;
      return {
        ok: true, mode: "live", model: RUN_MODEL, output, outputText: text, trace, latencyMs: Date.now() - t0,
        tokens: usage ? { input: usage.total_input_tokens ?? 0, output: usage.total_output_tokens ?? 0 } : null,
        costUsd: costPerRun, validation,
      };
    } catch (e) {
      step(`Call ${RUN_MODEL}`, `Live call failed (${e instanceof Error ? e.message.slice(0, 140) : "error"}) — falling back to the recorded run`, "warn");
    }
  } else {
    step("Model", "Live runs need GEMINI_API_KEY on this deployment — showing the package's recorded run", "warn");
  }

  const output = recorded ? stripJson(recorded) : null;
  const validation = validate(output, schemaText);
  if (validation) step("Validate output", validation.valid ? "Recorded output matches schema/output.json" : validation.issues.join("; "), validation.valid ? "ok" : "warn");
  return {
    ok: Boolean(recorded), mode: "recorded", model: RUN_MODEL, output, outputText: recorded ?? "", trace, latencyMs: Date.now() - t0,
    tokens: null, costUsd: costPerRun, validation,
    note: recorded ? "Recorded run from examples/sample-output.json — it answers the package's sample input, not necessarily what you typed." : "This package has no recorded example.",
  };
}
