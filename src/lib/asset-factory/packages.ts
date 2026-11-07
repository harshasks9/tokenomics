/**
 * Server-only: asset package files, inheritance resolution and lineage.
 * Seed files live in content.ts; assets created on the platform carry their own.
 */
import { SEED_FILES } from "./content";
import { canViewAsset, orgById, userById } from "./policy";
import { parseSkill, resolveChain, type ResolvedSkill } from "./skillmd";
import type { Asset, AssetFile, User, World } from "./types";

export const MAIN_FILE: Record<Asset["type"], string[]> = {
  skill: ["SKILL.md"],
  blueprint: ["README.md", "agent.yaml"],
  connector: ["README.md", "connector.yaml"],
  workflow: ["README.md", "workflow.yaml"],
  evaluation: ["README.md", "suite.yaml"],
};

export const versionOf = (a: Asset) => a.versions.at(-1)?.version ?? "0.1";
export const refOf = (a: Asset) => `${a.slug}@${versionOf(a)}`;

export function filesFor(a: Asset): AssetFile[] {
  return a.files ?? SEED_FILES[a.id] ?? [];
}

export function fileOf(a: Asset, path: string): string | undefined {
  return filesFor(a).find((f) => f.path === path)?.content;
}

/** The instruction document a run uses: SKILL.md, a planner prompt, or the main manifest. */
export function instructionPath(a: Asset): string | undefined {
  const files = filesFor(a);
  for (const p of ["SKILL.md", "prompts/planner.md", "workflow.yaml", "suite.yaml", "connector.yaml", "README.md"]) {
    if (files.some((f) => f.path === p)) return p;
  }
  return files[0]?.path;
}

/** Root-first inheritance chain, stopping at anything the viewer may not see. */
export function chainFor(a: Asset, world: World, viewer: User): Asset[] {
  const chain: Asset[] = [a];
  let cur = a;
  for (let guard = 0; guard < 8 && cur.extendsRef; guard++) {
    const parent = world.assets.find((x) => x.id === cur.extendsRef!.assetId);
    if (!parent || !canViewAsset(viewer, parent, world)) break;
    chain.unshift(parent);
    cur = parent;
  }
  return chain;
}

export function resolveFor(a: Asset, world: World, viewer: User): (ResolvedSkill & { chain: string[] }) | null {
  if (!a.extendsRef) return null;
  const chain = chainFor(a, world, viewer);
  const layers = chain.map((x) => ({ ref: refOf(x), md: fileOf(x, "SKILL.md") ?? fileOf(x, "prompts/planner.md") ?? "" }));
  return { ...resolveChain(layers), chain: layers.map((l) => l.ref) };
}

/** The output schema in effect: own, else inherited. */
export function schemaFor(a: Asset, world: World, viewer: User): string | undefined {
  for (const x of [...chainFor(a, world, viewer)].reverse()) {
    const s = fileOf(x, "schema/output.json");
    if (s) return s;
  }
  return undefined;
}

export interface LineageNode {
  id: string;
  slug: string;
  name: string;
  version: string;
  relation: "self" | "extends" | "fork";
  owner: string;
  trust: Asset["trust"];
  children: LineageNode[];
}

/** Ancestors (root first) and the visible descendant tree of an asset. */
export function lineageFor(a: Asset, world: World, viewer: User) {
  const ancestors = chainFor(a, world, viewer).slice(0, -1).map((x) => ({ id: x.id, slug: x.slug, version: versionOf(x), name: x.name }));
  if (a.forkedFromId && !a.extendsRef) {
    const p = world.assets.find((x) => x.id === a.forkedFromId);
    if (p && canViewAsset(viewer, p, world)) ancestors.push({ id: p.id, slug: p.slug, version: versionOf(p), name: p.name });
  }
  const build = (x: Asset, relation: LineageNode["relation"], depth: number): LineageNode => ({
    id: x.id, slug: x.slug, name: x.name, version: versionOf(x), relation,
    owner: orgById.get(x.ownerOrgId)?.name ?? "", trust: x.trust,
    children: depth > 4 ? [] : world.assets
      .filter((c) => (c.extendsRef?.assetId === x.id || (c.forkedFromId === x.id && !c.extendsRef)) && canViewAsset(viewer, c, world))
      .map((c) => build(c, c.extendsRef ? "extends" : "fork", depth + 1)),
  });
  return { ancestors, tree: build(a, "self", 0) };
}

const today = "2026-11-06";

/** Files for a skill created by inheritance. */
export function inheritedFiles(base: Asset, skillMd: string, actor: User): AssetFile[] {
  return [
    { path: "SKILL.md", content: skillMd },
    { path: "CHANGELOG.md", content: `# Changelog\n\n## 0.1.0 — ${today}\n\n- Created by ${actor.name} (${orgById.get(actor.orgId)?.name}) by inheriting \`${refOf(base)}\`.\n` },
  ];
}

/** Files for an asset contributed from scratch through the Contribute form. */
export function starterFiles(a: Asset, actor: User): AssetFile[] {
  const org = orgById.get(actor.orgId)?.name ?? "";
  const ns = a.slug.split("/")[0];
  const name = a.slug.split("/")[1];
  if (a.type === "skill") {
    return [
      { path: "SKILL.md", content: `---\nname: ${name}\nnamespace: ${ns}\nversion: 0.1.0\ndescription: ${a.summary || a.name}\nlicense: ${a.visibility === "public" ? "Apache-2.0" : "Proprietary"}\nmodel: gemini-3.5-flash\noutputs: schema/output.json\ntools: []\n---\n\n# ${a.name}\n\n## When to use\n\n${a.summary || "Describe when an agent should reach for this skill."}\n\n## Instructions\n\n1. Read the input carefully and restate the task in one sentence.\n2. Produce the output strictly in the schema below.\n\n## Output format\n\nReturn JSON matching \`schema/output.json\`.\n\n## Guardrails\n\n- Never invent identifiers that are not in the input.\n\n## Parameters\n\n\`\`\`yaml\nconfidence_floor: 0.7\n\`\`\`\n` },
      { path: "schema/output.json", content: JSON.stringify({ $schema: "https://json-schema.org/draft/2020-12/schema", type: "object", properties: { result: { type: "string" }, confidence: { type: "number" } }, required: ["result", "confidence"] }, null, 2) },
      { path: "CHANGELOG.md", content: `# Changelog\n\n## 0.1.0 — ${today}\n\n- First contribution by ${actor.name} (${org}).\n` },
    ];
  }
  return [
    { path: "README.md", content: `# ${a.name}\n\n${a.summary}\n\nContributed by ${actor.name} (${org}).\n` },
    { path: "CHANGELOG.md", content: `# Changelog\n\n## 0.1.0 — ${today}\n\n- First contribution.\n` },
  ];
}

/** The package published from a workspace contribution: a blueprint that extends its base. */
export function contributionFiles(opts: {
  base: Asset; slug: string; title: string; summary: string; changes: string[];
  components: Asset[]; config: { autoResolveLimit: number; approvalChannel: string }; author: User;
}): AssetFile[] {
  const { base, slug, title, summary, changes, components, config, author } = opts;
  const org = orgById.get(author.orgId)?.name ?? "";
  const [ns, name] = slug.split("/");
  const comp = (t: Asset["type"]) => components.filter((c) => c.type === t).map((c) => `    - ${refOf(c)}`).join("\n") || "    []";
  return [
    { path: "README.md", content: `# ${title}\n\n${summary}\n\n> Community package by ${org}. Extends \`${refOf(base)}\`. Passed the Google marketplace security review — this is **not** a Google certification.\n\n## What changes versus the base blueprint\n\n${changes.map((c) => `- ${c}`).join("\n")}\n\n## Components\n\n${components.map((c) => `- \`${refOf(c)}\` — ${c.summary}`).join("\n")}\n\n## Deploy\n\n\`\`\`bash\ng10 agents deploy ./agent.yaml --project <PROJECT_ID>\n\`\`\`\n\nPlant identifiers, thresholds and volumes are parameters — nothing from the originating engagement is included.\n` },
    { path: "agent.yaml", content: `apiVersion: agents.gemini10/v1\nkind: Agent\nmetadata:\n  name: ${name}\n  namespace: ${ns}\n  version: 1.0.0\n  extends: ${refOf(base)}\nspec:\n  runtime:\n    model: gemini-3.5-flash\n  skills:\n${comp("skill")}\n  connectors:\n${components.filter((c) => c.type === "connector").map((c) => `    - ref: ${refOf(c)}\n      secretRef: projects/<PROJECT_ID>/secrets/${c.slug.split("/")[1]}`).join("\n") || "    []"}\n  workflows:\n${comp("workflow")}\n  parameters:\n    plants: \${PLANTS}            # list of plant codes, supplied at deploy time\n    autoResolveLimitUsd: ${config.autoResolveLimit}\n    approvalChannel: "${config.approvalChannel}"\n  evaluation:\n    suites:\n${comp("evaluation")}\n    gate: all-thresholds-pass\n` },
    { path: "CHANGELOG.md", content: `# Changelog\n\n## 1.0.0 — ${today}\n\n- Published from a production Gemini 10 engagement with the customer's permission.\n${changes.map((c) => `- ${c}`).join("\n")}\n` },
  ];
}

export function authorName(a: Asset): string {
  return userById.get(a.contributorId)?.name ?? "";
}

export { parseSkill };
