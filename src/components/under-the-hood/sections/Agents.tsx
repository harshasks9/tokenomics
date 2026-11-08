"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartFrame, Cite, ClassBadge, Ext, makeTip, PALETTE, Section } from "../ui";

const STAGES = [
  { id: "chat", name: "Chatbot", period: "2023–24", what: "Answers discrete prompts.", products: "Claude.ai (early)", unit: "Per seat (subscription)", intensity: 1, capture: "Subscription seat; low marginal usage.", evidence: "Subscription revenue was 25% of 2024 revenue." },
  { id: "assist", name: "Assistant", period: "2024–25", what: "Drafts, analyzes and codes alongside a person.", products: "Claude.ai, API integrations, early Claude Code", unit: "Per seat + per token", intensity: 2, capture: "API consumption rises with embedded use cases.", evidence: "Consumption revenue reached 83% of 2025 revenue." },
  { id: "agent", name: "Agent", period: "2025–26", what: "Plans, runs tools and code, iterates for hours.", products: "Claude Code, Agent SDK, Managed Agents, MCP", unit: "Per token (metered by task)", intensity: 3, capture: "Top 5% Claude Code users spend ~20× a non-Code enterprise user.", evidence: "Claude Code ‘becoming the default’ in enterprise engineering orgs." },
  { id: "vc", name: "Virtual collaborator", period: "2026→", what: "Persistent, permissioned, multi-agent work over days or weeks.", products: "Claude Cowork, Claude Tag, vertical solutions, Enterprise Frontier Safeguards", unit: "Per task / workflow / outcome (emerging)", intensity: 4, capture: "Value shifts to the runtime that holds context, permissions and memory.", evidence: "Cowork adoption outpaced Claude Code at the same stage; merged with Claude.ai in Sep 2026." },
];

const UNITS = [
  { unit: "Per seat", friction: 1, intensity: 1, potential: 1, switching: 2, note: "Easy to buy; caps revenue from heavy agent users (e.g., M365 E7 $99/user/month)." },
  { unit: "Per token", friction: 2, intensity: 3, potential: 3, switching: 1, note: "Anthropic's model (79% of revenue); scales with usage but exposes price per token to comparison and routing." },
  { unit: "Per task", friction: 2, intensity: 3, potential: 3, switching: 2, note: "Aligns with 'cost per task' claims (−40% Opus 5.5); requires measurable task definitions." },
  { unit: "Per workflow", friction: 3, intensity: 3, potential: 3, switching: 3, note: "Skills, connectors and permissions embed the vendor; slower to sell, stickier once live." },
  { unit: "Per outcome", friction: 3, intensity: 2, potential: 2, switching: 3, note: "Hard to verify outside coding/support; shifts risk to the vendor." },
  { unit: "Per autonomous worker", friction: 3, intensity: 3, potential: 3, switching: 3, note: "Priced against labor budgets — the largest pool, the highest governance bar." },
];

const MATRIX = [
  { name: "Claude Code (Anthropic)", cap: "Frontier coding models (Opus 5.5 / Fable 5.1); long-horizon agent loop", dist: "Direct + all three clouds; developer-led", econ: "Consumption (tokens) + Pro/Max/Ultra/Enterprise plans", loyalty: "High: ‘default choice’ in many eng orgs (company claim)", ext: "Agent SDK, MCP, Skills, plugins", gov: "Enterprise controls; Frontier Safeguards", port: "Claude models only" },
  { name: "GitHub Copilot (Microsoft)", cap: "Multi-model incl. Claude & OpenAI; Copilot Fusion routes per step", dist: "GitHub + Microsoft enterprise agreements; ~50M users", econ: "Seats + usage-based billing (from Jun 2026)", loyalty: "Owns the repo and PR loop; agents start ~40% of PRs (Octoverse)", ext: "GitHub ecosystem, Actions", gov: "Strong enterprise policy/compliance", port: "High — model is swappable" },
  { name: "OpenAI Codex", cap: "GPT-6.1 Sol at $2/$10; near-frontier", dist: "ChatGPT Work + API; consumer reach", econ: "Bundled seats + API", loyalty: "~40M Codex + ChatGPT Work active users (Oct, period unstated)", ext: "Codex CLI and cloud agents", gov: "Enterprise controls", port: "OpenAI models" },
  { name: "Google Antigravity (Gemini)", cap: "Gemini 4 Argon ($2/$10 intro → $4/$20); also hosts Claude & gpt-oss", dist: "Workspace, Google Cloud, Android", econ: "AI Pro/Ultra plans + API", loyalty: "Rebuilding after Gemini CLI → Antigravity CLI transition", ext: "Vertex, Firebase, Workspace", gov: "Google Cloud controls", port: "Multi-model" },
  { name: "Cursor (SpaceX)", cap: "Composer 2 (built on Kimi K2.5 open weights) + frontier models", dist: "Developer-led; enterprise ~75% of revenue (Jun)", econ: "Plans + credits; ~$4B ARR (Jun 2026)", loyalty: "High among individual devs; owner now also competes (Grok)", ext: "Editor-native", gov: "Improving", port: "High" },
  { name: "Open-model agents", cap: "Kimi K3.1 Pro, GLM-5.3, DeepSeek V4.1 near frontier on some benchmarks", dist: "Self-hosted, OpenRouter, clouds", econ: "Tokens at $0.15–$3 per M input", loyalty: "Low; price-driven", ext: "Open", gov: "Customer-owned", port: "Total" },
];

const Dots = ({ n }: { n: number }) => (
  <span aria-label={`${n} of 3`} style={{ letterSpacing: 2 }}>{[1, 2, 3].map((i) => <span key={i} style={{ color: i <= n ? "var(--accent)" : "var(--rule)" }}>●</span>)}</span>
);

export default function Agents() {
  const [stage, setStage] = useState("agent");
  const s = STAGES.find((x) => x.id === stage)!;
  const spend = [
    { label: "Claude Enterprise user without Claude Code (avg)", v: 75, note: "‘less than $75 per month on average’ (upper bound)", c: PALETTE.s7 },
    { label: "Microsoft 365 E7 list price (reference)", v: 99, note: "$99/user/month list (Mar 2026)", c: PALETTE.axis },
    { label: "Top 5% Claude Enterprise users of Claude Code", v: 1500, note: "≈20× the <$75 average (calculated, upper-bound)", c: PALETTE.s1 },
  ];
  return (
    <Section id="agents">
      <div className="uth-step" role="group" aria-label="From chatbots to virtual collaborators">
        {STAGES.map((x, i) => (
          <button key={x.id} type="button" aria-pressed={stage === x.id} onClick={() => setStage(x.id)}>
            <span className="uth-xs">{i + 1} · {x.period}</span>
            <span style={{ display: "block", fontFamily: "var(--serif)", fontSize: 20, color: "var(--ink)", margin: "2px 0 4px" }}>{x.name}</span>
            <span style={{ fontSize: 13 }}>{x.what}</span>
            <span style={{ display: "block", marginTop: 8, height: 6, borderRadius: 3, background: "var(--rule-soft)" }}><span style={{ display: "block", height: 6, borderRadius: 3, width: `${x.intensity * 25}%`, background: "var(--accent)" }} /></span>
            <span className="uth-xs">Usage intensity (illustrative)</span>
          </button>
        ))}
      </div>
      <div className="uth-card" style={{ marginTop: 12 }} aria-live="polite">
        <dl className="uth-kv">
          <dt>Anthropic products</dt><dd>{s.products}</dd>
          <dt>Unit of value</dt><dd>{s.unit}</dd>
          <dt>Value capture</dt><dd>{s.capture}</dd>
          <dt>Evidence</dt><dd>{s.evidence} {s.id === "agent" && <Cite id="cc-default" />}{s.id === "assist" && <Cite id="rev-consumption-9m" />}</dd>
        </dl>
      </div>

      <div className="uth-block uth-split">
        <div className="uth-card">
          <ChartFrame
            title="Monthly spend per user: a coding agent is a workload, not a seat"
            summary="Claude Enterprise users who did not use Claude Code spent under $75 per month on average in Q3 2026; the top 5% of Claude Enterprise users who used Claude Code spent about 20 times that, roughly $1,500. Microsoft 365 E7 lists at $99 per user per month for reference."
            rows={spend.map((x) => ({ user: x.label, monthlyUsd: x.v, note: x.note }))}
            cols={[{ key: "user", label: "User type" }, { key: "monthlyUsd", label: "$ / month", num: true, render: (r) => `$${(r.monthlyUsd as number).toLocaleString()}` }, { key: "note", label: "Basis" }]}
            filename="uth-agent-spend.csv"
            note={<span>S-1/A <Cite id="code-spend-20x" /> · E7 price: <Ext href="https://fortune.com/2026/03/09/microsoft-copilot-cowork-ai-agents-anthropic-e7-m365-saas/">Fortune</Ext></span>}
          >
            <div style={{ height: 230 }}>
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
                <BarChart layout="vertical" data={spend} margin={{ top: 4, right: 70, bottom: 4, left: 8 }}>
                  <CartesianGrid horizontal={false} stroke={PALETTE.grid} />
                  <XAxis type="number" stroke={PALETTE.axis} tickFormatter={(v: number) => `$${v}`} />
                  <YAxis type="category" dataKey="label" width={210} stroke={PALETTE.axis} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip content={makeTip((v) => `$${v.toLocaleString()} / month`)} cursor={{ fill: "rgba(0,0,0,.04)" }} />
                  <Bar dataKey="v" name="Monthly spend" radius={[0, 4, 4, 0]} maxBarSize={22} isAnimationActive={false}>
                    {spend.map((x, i) => <Cell key={i} fill={x.c} />)}
                    <LabelList dataKey="v" position="right" style={{ fontSize: 11, fill: PALETTE.ink, fontWeight: 600 }} formatter={(v: unknown) => `$${Number(v).toLocaleString()}`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
        </div>
        <div className="uth-card sunk">
          <h3 className="uth-h4">The beachhead sequence the filing describes</h3>
          <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8, fontSize: 14, color: "var(--ink-2)" }}>
            <li><b>Individual developer:</b> “relationships often beginning with individual engineers”; prosumers as “top-of-funnel engine”.</li>
            <li><b>Team standardization:</b> Claude Code “becoming the default choice inside many enterprise engineering organizations” <Cite id="cc-default" />.</li>
            <li><b>Enterprise buying:</b> &gt;50% of ≥$100K customers use Platform + an app (from ~30% in Q4 2025) <Cite id="platform-plus-app" />.</li>
            <li><b>Expanded use cases:</b> “non-technical teams increasingly adopting Claude Code and Claude Cowork”.</li>
            <li><b>Agentic workflows:</b> Cowork (Jan 2026 preview) merged into Claude.ai in Sep 2026.</li>
          </ol>
          <hr className="uth-rule" />
          <p className="uth-small" style={{ margin: 0 }}><b>Is coding exceptional?</b> Probably yes — outputs are verifiable, users tolerate iteration, and Anthropic’s own engineers prove it (&gt;90% of code by Claude <Cite id="code-by-claude" />). Finance, legal and healthcare face liability and accuracy constraints; the top-5% figure is a selected tail, and average Claude Code spend is not disclosed. <ClassBadge kind="inference" /></p>
        </div>
      </div>

      <div className="uth-block uth-card">
        <h3 className="uth-h4">Monetization units for agents — analytical framework</h3>
        <div className="uth-tablewrap">
          <table className="uth-table">
            <thead><tr><th>Unit</th><th>Adoption friction</th><th>Usage intensity</th><th>Monetization potential</th><th>Switching costs</th><th>Comment</th></tr></thead>
            <tbody>{UNITS.map((u) => <tr key={u.unit}><td><strong>{u.unit}</strong></td><td><Dots n={u.friction} /></td><td><Dots n={u.intensity} /></td><td><Dots n={u.potential} /></td><td><Dots n={u.switching} /></td><td>{u.note}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="uth-xs" style={{ marginTop: 8 }}>Scores 1–3 are judgments. <ClassBadge kind="inference" /> The industry’s unit of value is moving from seats to tokens to tasks; whoever owns the runtime that executes tasks (permissions, memory, sandboxes) decides which unit customers pay in.</p>
      </div>

      <div className="uth-block uth-card">
        <h3 className="uth-h4">Coding-agent competitive matrix (Nov 2026)</h3>
        <div className="uth-tablewrap">
          <table className="uth-table" style={{ minWidth: 1180 }}>
            <thead><tr><th>Offer</th><th>Capability</th><th>Enterprise distribution</th><th>Economics</th><th>Developer loyalty</th><th>Extensibility</th><th>Governance</th><th>Model portability</th></tr></thead>
            <tbody>{MATRIX.map((m) => <tr key={m.name}><td><strong>{m.name}</strong></td><td>{m.cap}</td><td>{m.dist}</td><td>{m.econ}</td><td>{m.loyalty}</td><td>{m.ext}</td><td>{m.gov}</td><td>{m.port}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="uth-xs" style={{ marginTop: 8 }}>Sources: company announcements and press compiled in the evidence library (Section 16) — e.g. <Ext href="https://thenewstack.io/github-copilot-fusion/">Copilot Fusion</Ext>, <Ext href="https://openai.com/index/introducing-gpt-6-1-sol/">GPT-6.1 Sol</Ext>, <Ext href="https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/">Antigravity CLI</Ext>, <Ext href="https://dealroom.co/news/134107-cursor-tops-4b-annualized-revenue/">Cursor ARR</Ext>. Vendor claims are not independently verified.</p>
      </div>

      <div className="uth-block uth-grid uth-g2">
        <div className="uth-card">
          <h3 className="uth-h4">Is Anthropic trying to own the whole stack?</h3>
          <div className="uth-tablewrap">
            <table className="uth-table">
              <thead><tr><th>Layer</th><th>Anthropic offer</th><th>Assessment</th></tr></thead>
              <tbody>
                <tr><td><strong>Model</strong></td><td>Mythos/Fable, Opus, Sonnet, Haiku</td><td>Differentiated (frontier coding/agentic)</td></tr>
                <tr><td><strong>Agent runtime</strong></td><td>Managed Agents, Agent SDK, sandboxes, memory</td><td>Differentiating; contested by clouds</td></tr>
                <tr><td><strong>Connectivity</strong></td><td>MCP (donated to Linux Foundation), connectors</td><td>Commoditizing by design (open standard)</td></tr>
                <tr><td><strong>Workflow</strong></td><td>Agent Skills, 7 vertical solutions, plugins</td><td>Early; partners (SIs, Ode) carry delivery</td></tr>
                <tr><td><strong>User interface</strong></td><td>Claude.ai + Cowork, Code, Tag, Design, Science, Security</td><td>Strong in coding; contested in office work</td></tr>
                <tr><td><strong>Embedded in others</strong></td><td>Copilot Cowork, Claude for Microsoft 365, Claude in Chrome</td><td>Reach without owning the surface</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="uth-card sunk">
          <h3 className="uth-h4">Runtime ownership vs being embedded</h3>
          <p className="uth-p" style={{ fontSize: 14 }}>Owning the execution environment lets Anthropic meter work, hold context and enforce safeguards; being embedded (e.g., Microsoft’s Copilot Cowork is built on Claude) buys reach but hands the interface — and the seat price — to the host.</p>
          <p className="uth-p" style={{ fontSize: 14 }}>The tell: Anthropic is doing both, and the {">"}50% of large customers using Platform <i>plus</i> a first-party app suggests the direct runtime is winning inside its own base.</p>
          <p className="uth-p" style={{ fontSize: 14, margin: 0 }}><b>Agent security & governance</b> is the price of admission: the filing discloses models that “gained unauthorized access to real third-party systems” in testing and a state-sponsored misuse of Claude Code — exactly the risks enterprises will pay a runtime to contain. <ClassBadge kind="inference" /></p>
        </div>
      </div>
    </Section>
  );
}
