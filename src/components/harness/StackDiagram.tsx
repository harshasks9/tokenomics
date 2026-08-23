"use client";

import { useState } from "react";
import type { Lens } from "@/lib/harness/types";
import { Depth } from "./ui";

type LayerId = "user" | "app" | "harness" | "engine";

const LAYERS: {
  id: LayerId;
  name: string;
  role: string;
  detail: string;
  items: string[];
  depth: Record<Lens, string>;
}[] = [
  {
    id: "user",
    name: "User",
    role: "A person — or another agent — with a job to be done",
    detail:
      "The boundary that matters here is expectation: users judge outcomes, not model quality. Everything below exists to convert intent into reliable work.",
    items: ["Employees", "Customers", "Developers", "Other agents (A2A)"],
    depth: {
      exec: "Users experience the whole stack as one thing. When it fails, they don't blame the model or the harness — they blame you.",
      architect: "Design the user boundary explicitly: what's asked, what's promised, what's escalated. Agents calling agents (A2A) makes 'user' a recursive concept.",
      developer: "Interface contracts live here: request shapes, streaming, interruption, approval prompts, and how trajectories surface to the user for trust.",
    },
  },
  {
    id: "app",
    name: "Application",
    role: "Where intelligence becomes business value",
    detail:
      "The experience or process being delivered: the support desk, the research tool, the claims pipeline. It consumes the harness's guarantees and adds domain workflow, UI and business rules.",
    items: ["Experience / UI", "Business process", "Domain rules", "Value metrics"],
    depth: {
      exec: "Applications are what you fund and measure. The strategic error is letting each application quietly rebuild the layer below it.",
      architect: "Keep the application thin over the harness: domain workflow and UX here; context, tools, permissions and verification below, where they can be shared and governed.",
      developer: "If your app code contains retry loops, context assembly and tool plumbing, you've inlined a harness. It works — until the second app needs the same code.",
    },
  },
  {
    id: "harness",
    name: "Harness",
    role: "The system that turns intelligence into reliable work",
    detail:
      "Everything between the application and the raw model: context assembly, tool execution, memory, orchestration, state, permissions, verification, guardrails, observability, recovery, and cost control. This layer is the site's subject — and the decision most enterprises haven't consciously made.",
    items: [
      "Context & memory",
      "Tool execution",
      "Orchestration & state",
      "Permissions & guardrails",
      "Verification & observability",
      "Recovery & economics",
    ],
    depth: {
      exec: "This is the decision layer. Model choice is a procurement decision you'll revisit yearly; harness architecture is an operating-model decision that compounds.",
      architect: "Microsoft's definition is the cleanest: runtime scaffolding that drives model and tool calls, manages state and context, applies approval policies, and keeps multi-step tasks progressing. Decide which of its eleven capabilities are platform-shared vs workload-specific.",
      developer: "Concretely: an agent loop (gather context → act → verify), a permission system, tool adapters (MCP), state/checkpoints, traces, and eval hooks. You get it from an SDK (Claude Agent SDK, ADK), a platform (Agent Engine, AgentCore, Foundry), or you've written it yourself.",
    },
  },
  {
    id: "engine",
    name: "Model · Tools · Data",
    role: "Raw capability: intelligence, actuators, knowledge",
    detail:
      "The model provides reasoning; tools provide reach into systems; data provides truth. All three are increasingly swappable commodities at the interface level — the harness is what composes them into behavior.",
    items: ["Frontier & fast models", "APIs, MCP servers, shell, browser", "Enterprise data & search"],
    depth: {
      exec: "This layer is where the market noise is loudest and the switching costs are, counterintuitively, lowest — if the harness above was built for freedom.",
      architect: "Standardize the interfaces (MCP for tools, retrieval behind your own API, models behind an eval gate) so components swap without application rewrites.",
      developer: "Model APIs converge on the surface and diverge in behavior: tool-call styles, context habits, failure modes. Budget eval time, not integration time, for a swap.",
    },
  },
];

const DEFINITIONS = [
  {
    cls: "model",
    k: "The model",
    v: "provides intelligence",
    p: "Reasoning, language, code, judgment — rented by the token from a fast-moving market.",
  },
  {
    cls: "harness",
    k: "The harness",
    v: "operationalizes it",
    p: "Decides what the model sees, what it can do, how work proceeds, what it may never do, and how you know it worked.",
  },
  {
    cls: "app",
    k: "The application",
    v: "delivers the value",
    p: "The experience or process where converted intelligence meets a business metric.",
  },
];

export default function StackDiagram({ lens, sellerOn }: { lens: Lens; sellerOn: boolean }) {
  void sellerOn;
  const [sel, setSel] = useState<LayerId>("harness");
  const active = LAYERS.find((l) => l.id === sel)!;

  return (
    <>
      <div className="hx-stack">
        <div className="hx-stack-col">
          {LAYERS.map((l) => (
            <div
              key={l.id}
              className={`hx-slayer ${l.id === "harness" ? "harness-layer" : ""} ${sel === l.id ? "on" : ""}`}
              onClick={() => setSel(l.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(l.id)}
            >
              {l.id === "harness" && <span className="badge">This decision</span>}
              <div className="name">{l.name}</div>
              <div className="role">{l.role}</div>
            </div>
          ))}
        </div>
        <div className="hx-card hx-stack-detail">
          <h4>{active.name}</h4>
          <p>{active.detail}</p>
          <ul>
            {active.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <Depth lens={lens} body={active.depth} />
        </div>
      </div>

      <div className="hx-defn">
        {DEFINITIONS.map((d) => (
          <div key={d.k} className={`hx-card hx-defn-card ${d.cls}`}>
            <div className="k">{d.k}</div>
            <div className="v">{d.v}</div>
            <p>{d.p}</p>
          </div>
        ))}
      </div>
    </>
  );
}
