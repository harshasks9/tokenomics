/*
 * CLIENT-SAFE MODULE (pure functions, no data): SKILL.md parsing, inheritance
 * resolution and line diffs. The server uses the same code to resolve skills it
 * runs, and the inherit editor uses it for its live preview.
 */

export interface Frontmatter {
  [key: string]: string | string[] | undefined;
  name?: string;
  namespace?: string;
  version?: string;
  description?: string;
  extends?: string;
  model?: string;
  license?: string;
}

export interface ParsedSkill {
  frontmatter: Frontmatter;
  /** Raw frontmatter text without the --- fences. */
  frontmatterText: string;
  /** Leading content before the first "## " section (usually the "# Title" line and intro). */
  preamble: string;
  sections: { heading: string; body: string }[];
}

const unquote = (s: string) => s.trim().replace(/^["']|["']$/g, "");

/** Parses a minimal YAML subset: top-level `key: value` and `key: [a, b]`; nested blocks are kept as text. */
export function parseFrontmatterText(text: string): Frontmatter {
  const out: Frontmatter = {};
  for (const line of text.split("\n")) {
    const m = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!m) continue;
    const [, key, raw] = m;
    const value = raw.replace(/\s+#.*$/, "").trim();
    if (!value) continue;
    if (value.startsWith("[") && value.endsWith("]")) {
      out[key] = value.slice(1, -1).split(",").map(unquote).filter(Boolean);
    } else {
      out[key] = unquote(value);
    }
  }
  return out;
}

export function parseSkill(md: string): ParsedSkill {
  const text = md.replace(/\r\n/g, "\n");
  let frontmatterText = "";
  let rest = text;
  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (fm) {
    frontmatterText = fm[1];
    rest = text.slice(fm[0].length);
  }
  const lines = rest.split("\n");
  const sections: ParsedSkill["sections"] = [];
  const pre: string[] = [];
  let current: { heading: string; lines: string[] } | null = null;
  let inFence = false;
  for (const line of lines) {
    if (/^```/.test(line)) inFence = !inFence;
    const h = !inFence && /^## (.+)$/.exec(line);
    if (h) {
      if (current) sections.push({ heading: current.heading, body: current.lines.join("\n").trim() });
      current = { heading: h[1].trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else {
      pre.push(line);
    }
  }
  if (current) sections.push({ heading: current.heading, body: current.lines.join("\n").trim() });
  return { frontmatter: parseFrontmatterText(frontmatterText), frontmatterText, preamble: pre.join("\n").trim(), sections };
}

/** Sections a child appends to its parent's matching section instead of replacing it. */
const APPEND_TO: Record<string, string> = {
  "additional instructions": "Instructions",
  "additional guardrails": "Guardrails",
  "additional examples": "Examples",
  instructions: "Instructions",
  guardrails: "Guardrails",
  examples: "Examples",
};

function parseParams(body: string): { order: string[]; map: Map<string, string> } {
  const block = /```(?:ya?ml)?\n([\s\S]*?)```/.exec(body)?.[1] ?? body;
  const order: string[] = [];
  const map = new Map<string, string>();
  for (const line of block.split("\n")) {
    const m = /^([A-Za-z_][\w.-]*):\s*(.*)$/.exec(line);
    if (!m) continue;
    if (!map.has(m[1])) order.push(m[1]);
    map.set(m[1], m[2]);
  }
  return { order, map };
}

export interface ResolveLayer {
  ref: string; // namespace/name@version
  md: string;
}

export interface ResolvedSkill {
  md: string;
  /** Which layer each section's content came from, for the provenance view. */
  provenance: { heading: string; from: string[] }[];
  overriddenParams: { key: string; from: string; to: string; by: string }[];
}

/**
 * Resolves an inheritance chain, root first. Child rules:
 *  - frontmatter keys override the parent's (`extends` records the chain);
 *  - "Instructions"/"Additional instructions", "Guardrails", "Examples" append;
 *  - "Parameters" merges key by key, child wins;
 *  - any other section replaces the parent's section of the same name, or is added.
 */
export function resolveChain(layers: ResolveLayer[]): ResolvedSkill {
  if (!layers.length) return { md: "", provenance: [], overriddenParams: [] };
  const root = parseSkill(layers[0].md);
  const fm: Frontmatter = { ...root.frontmatter };
  let preamble = root.preamble;
  const sections = root.sections.map((s) => ({ heading: s.heading, body: s.body, from: [layers[0].ref] }));
  const overriddenParams: ResolvedSkill["overriddenParams"] = [];

  for (const layer of layers.slice(1)) {
    const child = parseSkill(layer.md);
    Object.assign(fm, child.frontmatter);
    if (child.preamble) preamble = child.preamble;
    for (const s of child.sections) {
      const key = s.heading.toLowerCase();
      if (key === "parameters") {
        const target = sections.find((x) => x.heading.toLowerCase() === "parameters");
        const parent = parseParams(target?.body ?? "");
        const mine = parseParams(s.body);
        for (const k of mine.order) {
          const before = parent.map.get(k);
          if (before !== undefined && before !== mine.map.get(k)) overriddenParams.push({ key: k, from: before, to: mine.map.get(k)!, by: layer.ref });
          if (before === undefined) parent.order.push(k);
          parent.map.set(k, mine.map.get(k)!);
        }
        const body = "```yaml\n" + parent.order.map((k) => `${k}: ${parent.map.get(k)}`).join("\n") + "\n```";
        if (target) {
          target.body = body;
          target.from.push(layer.ref);
        } else sections.push({ heading: "Parameters", body, from: [layer.ref] });
        continue;
      }
      const appendTo = APPEND_TO[key];
      const target = sections.find((x) => x.heading.toLowerCase() === (appendTo ?? s.heading).toLowerCase());
      if (appendTo && target) {
        target.body = `${target.body}\n\n<!-- inherited from ${target.from.join(" → ")} · added by ${layer.ref} -->\n${s.body}`;
        target.from.push(layer.ref);
      } else if (target) {
        target.body = s.body;
        target.from = [layer.ref];
      } else {
        sections.push({ heading: appendTo ?? s.heading, body: s.body, from: [layer.ref] });
      }
    }
  }

  const fmLines = Object.entries(fm)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.join(", ")}]` : v}`);
  const md = `---\n${fmLines.join("\n")}\n---\n\n${preamble ? `${preamble}\n\n` : ""}${sections.map((s) => `## ${s.heading}\n\n${s.body}`).join("\n\n")}\n`;
  return { md, provenance: sections.map((s) => ({ heading: s.heading, from: s.from })), overriddenParams };
}

/** A starter child SKILL.md that inherits from `parentRef`. */
export function childTemplate(opts: { parentRef: string; parentMd: string; name: string; namespace: string; description: string }): string {
  const parent = parseSkill(opts.parentMd);
  const params = parent.sections.find((s) => s.heading.toLowerCase() === "parameters");
  const firstParams = params ? parseParams(params.body).order.slice(0, 3) : [];
  const pmap = params ? parseParams(params.body).map : new Map<string, string>();
  return `---
name: ${opts.name}
namespace: ${opts.namespace}
version: 0.1.0
extends: ${opts.parentRef}
description: ${opts.description}
license: Proprietary
---

# ${opts.name}

Inherits every instruction, guardrail, example and the output schema from \`${opts.parentRef}\`.
Only what you write below is added or overridden.

## Additional instructions

1. Describe what is different about your environment here (plants, suppliers, thresholds, terminology).

## Parameters

\`\`\`yaml
${firstParams.length ? firstParams.map((k) => `${k}: ${pmap.get(k)}`).join("\n") : "# key: value  — overrides the parent's parameter of the same name"}
\`\`\`
`;
}

export interface DiffLine { kind: "same" | "add" | "del"; text: string }

/** Line diff (LCS). Fine for files of a few hundred lines. */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split("\n");
  const b = after.split("\n");
  const n = a.length;
  const m = b.length;
  if (n * m > 400_000) return [...a.map((t) => ({ kind: "del" as const, text: t })), ...b.map((t) => ({ kind: "add" as const, text: t }))];
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push({ kind: "same", text: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ kind: "del", text: a[i] }); i++; }
    else { out.push({ kind: "add", text: b[j] }); j++; }
  }
  while (i < n) out.push({ kind: "del", text: a[i++] });
  while (j < m) out.push({ kind: "add", text: b[j++] });
  return out;
}

export function kebab(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function bumpVersion(v: string, kind: "patch" | "minor" = "patch"): string {
  const parts = v.split(/[.-]/).map((x) => Number.parseInt(x, 10)).filter((x) => !Number.isNaN(x));
  const [maj = 0, min = 0, pat = 0] = parts;
  return kind === "minor" ? `${maj}.${min + 1}.0` : `${maj}.${min}.${pat + 1}`;
}
