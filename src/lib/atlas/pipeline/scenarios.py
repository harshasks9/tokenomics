# Stage 5 — forward analysis. Scenarios and strategic implications (forecasts, clearly labeled in UI).
import os
HERE = os.path.dirname(os.path.abspath(__file__))
import json
D = os.path.join(HERE, '..', 'data')
def st(state, control, margin): return {"state": state, "control": control, "margin": margin}
def P(tid, why, *aids): return {"thinkerId": tid, "why": why, "assertionIds": [f"as-{a}" for a in aids]}

SC = [
{
 "id": "scaling-continues", "name": "Scaling Continues",
 "tagline": "Frontier models and giant compute stay central; capital intensity is the moat.",
 "confidence": "elevated",
 "confidenceNote": "The most historically predictive causal model in the dataset (Bitter Lesson, scaling laws, Jevons, infra supercycle) points here, and 2024–26 leading indicators (capex, lab revenue, reasoning-compute demand) are all observed. It breaks if revenue fails to close the capex gap or if a power/financing shock hits.",
 "stack": {
  "energy": st("GW-scale campuses and on-site generation are the unit of competition; power is the binding constraint.", 3, "expanding"),
  "semis": st("Nvidia plus hyperscaler ASICs; HBM and advanced packaging stay scarce.", 3, "expanding"),
  "cloud": st("A few hyperscalers and neoclouds run multi-GW fleets under long-term contracts.", 3, "stable"),
  "data": st("RL environments, synthetic and agentic interaction data become the main training input.", 2, "stable"),
  "architecture": st("Transformer-based backbones with MoE and long-context improvements; incremental change.", 1, "stable"),
  "training": st("RL and post-training compute rival pretraining; continual scaling of both.", 2, "stable"),
  "inference": st("Reasoning and agents multiply tokens per task; unit prices fall, total spend rises.", 2, "compressing"),
  "models": st("3–5 frontier labs hold a capability lead of 6–12 months over open models.", 3, "expanding"),
  "platforms": st("Lab-owned agent platforms and hyperscaler AI platforms dominate tooling.", 2, "stable"),
  "agents": st("Agents automate software engineering and parts of knowledge work, scaling with model capability.", 2, "expanding"),
  "apps": st("Apps built on frontier APIs; labs move up-stack into the most valuable categories.", 1, "compressing"),
  "distribution": st("Assistants become the default interface; incumbents with devices and suites hold share.", 2, "stable"),
  "economics": st("Value concentrates in chips, power and frontier labs; scale is the moat.", 3, "expanding"),
  "society": st("National-security framing of frontier AI; compute governance and export controls tighten.", 3, "stable"),
 },
 "bottlenecks": ["Power and grid interconnects", "HBM/advanced packaging supply", "Financing of $1T+ annual capex", "Verifiable-reward environments for RL"],
 "advantage": ["Access to capital and long-term compute contracts", "Frontier research talent", "Proprietary RL environments and evals"],
 "controlPoints": ["Nvidia/ASIC supply", "Power-ready sites", "Frontier model weights", "Government compute & export policy"],
 "winners": [{"layer": "semis", "who": "Nvidia, TSMC, HBM suppliers"}, {"layer": "energy", "who": "Utilities, gas/nuclear developers"}, {"layer": "models", "who": "OpenAI, Anthropic, Google DeepMind"}, {"layer": "cloud", "who": "Hyperscalers with power"}],
 "losers": [{"layer": "apps", "who": "Thin wrappers competing with labs"}, {"layer": "models", "who": "Sub-scale independent labs"}],
 "capitalIntensity": "Extreme and rising: annual AI capex well above the ~$700B of 2026, financed increasingly by debt and sovereign capital.",
 "enterprise": "Enterprises buy capability from a few labs/clouds; spend shifts to agentic services priced per task; vendor concentration risk rises.",
 "assumptions": ["Capability keeps improving with compute", "Revenue grows fast enough to finance capex", "No efficiency shock collapses compute demand", "Power can be built fast enough"],
 "indicators": [
   {"text": "Big-four capex guidance rising year over year (≈$700B+ in 2026)", "status": "observed"},
   {"text": "Lab revenue run-rates compounding >2x per year (~$65–70B by Sep 2026)", "status": "observed"},
   {"text": "GW-scale campuses energized on schedule", "status": "watch"},
   {"text": "Frontier model releases keep widening the gap over open weights", "status": "watch"},
   {"text": "Capex financing shifts to bonds/private credit without spread blowouts", "status": "watch"}],
 "invalidators": ["A sustained capex cut by two or more hyperscalers", "Frontier releases stall for 12+ months despite more compute", "An open model matches the frontier at a fraction of the cost and holds", "Credit event at a major AI infrastructure borrower"],
 "supporters": [P("jensen-huang", "AI factories and reasoning compute imply a multi-trillion build-out.", "huang-6", "huang-8"), P("leopold-aschenbrenner", "OOM counting: GW → 10 GW → 100 GW clusters.", "asch-2", "asch-3"), P("dario-amodei", "Scaling laws plus RL keep delivering.", "amodei-1", "amodei-4"), P("sam-altman", "Compute is the input; 30 GW committed.", "altman-9", "altman-7"), P("richard-sutton", "The Bitter Lesson: general methods + compute win.", "sutton-1")],
 "challengers": [P("ilya-sutskever", "Age of scaling is over; research is the bottleneck.", "sutskever-8"), P("david-cahn", "Revenue gap makes the capex trajectory fragile.", "cahn-2"), P("gary-marcus", "Scaling yields diminishing returns on reliability.", "marcus-7")],
 "thesisIds": ["scale-works", "infra-supercycle", "power-binding", "frontier-consolidates", "jevons"]
},
{
 "id": "intelligence-commoditizes", "name": "Intelligence Commoditizes",
 "tagline": "Open weights and efficiency compress model margins; value migrates to data, workflow and distribution.",
 "confidence": "moderate",
 "confidenceNote": "Strongly supported on price (fixed-capability cost falling ~10x/yr; open weights months behind) but contradicted, so far, on margins: frontier labs' revenue grew rather than shrinking. It becomes dominant if the frontier gap stops mattering for most workloads.",
 "stack": {
  "energy": st("Power still matters but demand growth slows as efficiency outpaces usage.", 2, "compressing"),
  "semis": st("Inference-optimized and edge chips gain; GPU pricing power erodes.", 2, "compressing"),
  "cloud": st("Overbuilt capacity; GPU-hour prices fall; neoclouds consolidate.", 1, "compressing"),
  "data": st("Proprietary enterprise data and feedback loops become the differentiator.", 3, "expanding"),
  "architecture": st("Efficiency innovations (MoE, distillation, new attention) diffuse within weeks.", 1, "stable"),
  "training": st("Distillation and fine-tuning of open bases dominate; few frontier pretraining runs.", 1, "compressing"),
  "inference": st("Cost per task collapses; small models run on device and on-prem.", 1, "compressing"),
  "models": st("Open-weight models within weeks of the frontier for most tasks; models interchangeable.", 1, "compressing"),
  "platforms": st("Routing, evaluation, security and governance platforms capture value.", 2, "expanding"),
  "agents": st("Agent frameworks are open; value sits in workflow integration.", 2, "stable"),
  "apps": st("Vertical apps with proprietary data and distribution win.", 3, "expanding"),
  "distribution": st("OS, browser, suite and marketplace owners control access to users.", 3, "expanding"),
  "economics": st("Value migrates from model layer to data, distribution and workflow ownership.", 2, "stable"),
  "society": st("Proliferation of capable open models complicates governance; national open-model champions.", 2, "stable"),
 },
 "bottlenecks": ["Enterprise integration and change management", "Trust, evaluation and liability", "Proprietary data access"],
 "advantage": ["Proprietary data and feedback loops", "Distribution and default placement", "Workflow ownership and switching costs"],
 "controlPoints": ["Operating systems and app stores", "Enterprise systems of record", "Model routing and evaluation layers"],
 "winners": [{"layer": "apps", "who": "Vertical AI with proprietary data"}, {"layer": "distribution", "who": "Apple, Microsoft, Google, Meta (distribution)"}, {"layer": "platforms", "who": "Routing/eval/governance vendors"}],
 "losers": [{"layer": "models", "who": "Pure-play model labs without distribution"}, {"layer": "cloud", "who": "Leveraged GPU lessors"}, {"layer": "semis", "who": "Training-GPU pricing power"}],
 "capitalIntensity": "Falls after 2027 as overbuilt capacity is absorbed; write-downs on GPU fleets.",
 "enterprise": "Buying shifts from models to platforms, workflows and outcomes; multi-model routing becomes standard; on-prem/open models for sensitive data.",
 "assumptions": ["Capability plateaus relative to task needs", "Open releases continue (esp. from China)", "Efficiency gains outpace demand growth"],
 "indicators": [
   {"text": "Open-weight lag vs frontier at 3–4 months (Epoch)", "status": "observed"},
   {"text": "Fixed-capability price falling ~10x/yr", "status": "observed"},
   {"text": "Frontier labs' gross margins and price per token at the top tier falling", "status": "watch"},
   {"text": "Enterprise share of spend going to open/self-hosted models rising", "status": "watch"},
   {"text": "GPU rental prices and utilization falling", "status": "watch"}],
 "invalidators": ["Frontier labs sustain premium pricing and >50% revenue growth", "A capability jump (e.g. reliable agents) only available from closed models", "Open releases restricted by regulation"],
 "supporters": [P("liang-wenfeng", "Closed moats are temporary; price near cost.", "liang-3", "liang-5"), P("marc-andreessen", "Selling intelligence may be like selling rice.", "andreessen-5"), P("gary-marcus", "Price wars and no moat.", "marcus-5"), P("kai-fu-lee", "Efficient labs approach frontier with a fraction of compute.", "lee-7"), P("satya-nadella", "Jevons: AI becomes a commodity we can't get enough of.", "nadella-6")],
 "challengers": [P("dario-amodei", "Frontier capability gaps persist and command premium.", "amodei-5"), P("vinod-khosla", "Frontier AI should not be open-sourced.", "khosla-4"), P("jensen-huang", "Reasoning compute demand keeps rising.", "huang-6")],
 "thesisIds": ["models-commoditize", "open-closes-gap", "app-layer-value", "china-parity"]
},
{
 "id": "agentic-transformation", "name": "Agentic & Architectural Transformation",
 "tagline": "Reliable agents, memory, continual learning or world models reshape the stack around outcomes.",
 "confidence": "moderate",
 "confidenceNote": "Coding agents already show the pattern (2025–26), and METR task horizons doubling ~every 7 months is the strongest leading indicator. But general-purpose reliability, continual learning and world models were still research problems at the cutoff, and the most specific near-term agent forecasts were early.",
 "stack": {
  "energy": st("Demand driven by always-on agents; inference dominates power use.", 2, "stable"),
  "semis": st("Inference and memory-bandwidth-optimized silicon; on-device agents.", 2, "stable"),
  "cloud": st("Agent runtimes, sandboxes and long-running compute become cloud products.", 2, "stable"),
  "data": st("Experience data from agents' own interactions; persistent memory as an asset.", 3, "expanding"),
  "architecture": st("Memory, continual learning and world-model components join or replace pure next-token models.", 3, "expanding"),
  "training": st("Online/experiential learning (Era of Experience) supplements batch pretraining.", 3, "expanding"),
  "inference": st("Long-horizon test-time computation; cost per outcome replaces cost per token.", 2, "stable"),
  "models": st("Models become components inside agent systems; capability measured by task completion.", 2, "stable"),
  "platforms": st("Agent identity, permissions, audit and evaluation become critical infrastructure.", 3, "expanding"),
  "agents": st("Agents run multi-day tasks reliably in many functions; humans supervise portfolios of agents.", 3, "expanding"),
  "apps": st("Apps restructure as agents sold on outcomes; seat-based SaaS erodes.", 2, "stable"),
  "distribution": st("Whoever owns the agent the user delegates to owns the customer.", 3, "expanding"),
  "economics": st("Pricing shifts to outcomes and labor budgets; value accrues to agent owners and trusted platforms.", 3, "expanding"),
  "society": st("Labor-market restructuring, especially entry-level knowledge work; liability and agent identity regulation.", 3, "stable"),
 },
 "bottlenecks": ["Long-horizon reliability", "Continual learning without forgetting", "Security and permissioning of autonomous actions", "Organizational redesign"],
 "advantage": ["Owning the primary agent relationship", "Memory and context about users and firms", "Trust, auditability and liability coverage"],
 "controlPoints": ["Agent identity and permission systems", "Systems of record agents act on", "Persistent memory stores"],
 "winners": [{"layer": "agents", "who": "Agent platforms with trust and memory"}, {"layer": "platforms", "who": "Security, identity and audit for agents"}, {"layer": "apps", "who": "Outcome-priced vertical agents"}],
 "losers": [{"layer": "apps", "who": "Seat-based SaaS without agent strategy"}, {"layer": "society", "who": "Entry-level knowledge work"}],
 "capitalIntensity": "High but shifting from training to inference and agent runtimes; new spend on security and evaluation.",
 "enterprise": "Buyers purchase outcomes (resolved tickets, shipped code) rather than models or seats; ROI becomes measurable per task.",
 "assumptions": ["Agent reliability keeps compounding (METR horizons)", "Memory/continual learning breakthroughs arrive", "Organizations can absorb autonomous agents"],
 "indicators": [
   {"text": "METR 50% task horizon doubling ~every 7 months (≈5h by 2026)", "status": "observed"},
   {"text": "Coding agents writing most code at leading firms", "status": "observed"},
   {"text": "Outcome-based pricing spreading beyond software engineering", "status": "watch"},
   {"text": "Published continual-learning or world-model systems deployed at scale", "status": "watch"},
   {"text": "Measurable productivity in national statistics", "status": "watch"}],
 "invalidators": ["Task-horizon growth stalls for a year", "Major agent security incidents trigger restrictions", "Enterprise agent deployments fail to show P&L impact through 2028"],
 "supporters": [P("andrej-karpathy", "Coding agents crossed a coherence threshold; LLM OS.", "karpathy-3", "karpathy-9"), P("david-silver", "Era of Experience: agents learn from their own streams.", "silver-6"), P("satya-nadella", "Business logic migrates to agents.", "nadella-5"), P("yann-lecun", "World models and memory are the next paradigm.", "lecun-7"), P("demis-hassabis", "World models, planning and continual learning are missing pieces.", "hassabis-8")],
 "challengers": [P("gary-marcus", "Reliability problems persist.", "marcus-7"), P("francois-chollet", "Novel-task adaptation still lags humans.", "chollet-8"), P("andrej-karpathy", "It's a decade of agents, not a year.", "karpathy-6")],
 "thesisIds": ["agents-soon", "coding-first", "rl-experience", "beyond-llms"]
}
]
json.dump(SC, open(f'{D}/scenarios.json', 'w'), indent=1, ensure_ascii=False)

def I(id, lens, q, a, strength, sup, dis, basis, theses): return {"id": id, "lens": lens, "question": q, "answer": a, "strength": strength, "supporters": sup, "dissenters": dis, "basis": basis, "thesisIds": theses}
IM = [
 I("t1", "technology", "Which layers are likely to become commodities?", "Fixed-capability model inference (prices falling ~10x/yr), mid-tier models (open weights months behind), and agent frameworks/orchestration code. Commoditization follows the capability frontier down: last year's frontier is this year's commodity.", "strong", ["liang-wenfeng", "marc-andreessen", "sam-altman", "gary-marcus"], ["dario-amodei"], "Price series and open-closed gap data 2023–26; the models-commoditize thesis is validated on price.", ["models-commoditize", "open-closes-gap"]),
 I("t2", "technology", "Which layers have durable technical barriers?", "Leading-edge semiconductors and packaging, power-ready data-center capacity, and frontier training (capital + talent + RL environments). These are physical or capital barriers, not algorithmic ones — algorithms diffuse in months.", "strong", ["jensen-huang", "leopold-aschenbrenner", "mark-zuckerberg"], ["liang-wenfeng"], "Infra-supercycle and power-binding theses validated; DeepSeek shows algorithmic leads are short-lived.", ["infra-supercycle", "power-binding"]),
 I("t3", "technology", "Where are the next architectural discontinuities likely?", "Memory and continual learning, RL from experience, and world models for physical tasks — the ingredients that LLM skeptics and DeepMind researchers have named for a decade. Expect them as additions to transformer systems before replacements.", "moderate", ["demis-hassabis", "david-silver", "yann-lecun", "ilya-sutskever", "fei-fei-li"], ["sam-altman"], "Historically, skeptics correctly identified missing pieces (reasoning, search) that were then added to LLMs, not substituted.", ["beyond-llms", "rl-experience"]),
 I("e1", "economics", "Where is value created vs captured?", "Value is created in applications and end-user productivity but, through 2026, captured mainly by chips (Nvidia), clouds and two-to-three frontier labs. Capture has migrated up the stack slowly and in sequence.", "strong", ["jensen-huang", "david-cahn"], ["cathie-wood"], "Nvidia data-center revenue vs lab run-rates vs app-layer revenue, 2023–26.", ["infra-supercycle", "app-layer-value"]),
 I("e2", "economics", "Where could overinvestment compress margins?", "GPU leasing and neocloud capacity financed with debt, and any capacity built ahead of power and demand. Short GPU economic lives make overbuild costly; the 2027–29 window decides it.", "moderate", ["david-cahn", "gary-marcus", "sundar-pichai"], ["mark-zuckerberg", "masayoshi-son", "jensen-huang"], "Capex-payback thesis unresolved; credit stress signals in late 2025.", ["capex-pays-back"]),
 I("e3", "economics", "Which parts of the stack have attractive long-term economics?", "Scarce physical inputs (advanced chips, power), distribution owners, and agent platforms that own outcomes and memory. Commodity inference and thin applications look least attractive.", "moderate", ["jensen-huang", "satya-nadella", "andrej-karpathy"], ["cathie-wood"], "Consistent with which theses validated (infra, power, consolidation) vs which are contested (app moats).", ["power-binding", "frontier-consolidates"]),
 I("p1", "platforms", "Will hyperscalers become more powerful or less differentiated?", "More powerful through 2026: they control capital, power and distribution, and absorbed independent labs. Their risk is that frontier labs become platforms themselves and multi-source compute.", "strong", ["satya-nadella", "mustafa-suleyman", "sundar-pichai"], ["liang-wenfeng"], "Frontier-consolidates validated; license-and-hire deals; OpenAI's multi-cloud deals in 2025.", ["frontier-consolidates", "incumbents-hold"]),
 I("p2", "platforms", "Will model providers retain durable pricing power?", "At the frontier tier, yes so far (rapid revenue growth despite collapsing unit prices); below it, no. Pricing power is temporary and must be re-earned each model generation.", "moderate", ["sam-altman", "dario-amodei"], ["marc-andreessen", "liang-wenfeng", "gary-marcus"], "Two-tier pricing observed 2024–26.", ["models-commoditize"]),
 I("p3", "platforms", "How do foundation models, agents and enterprise platforms relate?", "Models become components; the agent layer (memory, tools, permissions) is where platform control is contested between labs, hyperscalers and SaaS incumbents.", "moderate", ["andrej-karpathy", "satya-nadella"], [], "LLM-OS framing plus 2025–26 lab moves into agents and IDEs.", ["app-layer-value", "agents-soon"]),
 I("x1", "enterprise", "What will enterprises pay for once capability is widely available?", "Outcomes and reliability: completed tasks, auditability, security, integration with systems of record, and liability — not raw model access.", "moderate", ["reid-hoffman", "satya-nadella", "andrej-karpathy"], [], "Coding agents (outcome-shaped) are the clearest 2025–26 revenue success; generic pilots underperformed.", ["productivity-roi", "coding-first"]),
 I("x2", "enterprise", "Which capabilities create measurable ROI?", "Software engineering first; then customer operations and document-heavy back-office work where outputs are verifiable. Open-ended knowledge work ROI remains hard to measure.", "strong", ["andrej-karpathy", "jensen-huang", "dario-amodei"], ["gary-marcus"], "Coding-first thesis validated; MIT NANDA pilot-failure findings for generic use.", ["coding-first", "productivity-roi"]),
 I("x3", "enterprise", "What shifts buying from models to platforms, workflows, agents or outcomes?", "Model interchangeability (open weights, routing) plus agents that act on systems of record: once any model is 'good enough', buyers optimize for integration, governance and price per outcome.", "moderate", ["satya-nadella", "marc-andreessen"], ["sam-altman"], "Commoditization of fixed capability; rise of multi-model routing.", ["models-commoditize", "app-layer-value"]),
 I("i1", "investing", "Which economic assumptions are most vulnerable?", "That AI revenue will close a ~$600B+ annual gap fast enough to service capex and debt; that GPUs keep multi-year economic lives; and that frontier pricing power survives open competition.", "moderate", ["david-cahn", "gary-marcus"], ["jensen-huang", "masayoshi-son"], "Capex-payback thesis unresolved; depreciation and credit concerns 2025–26.", ["capex-pays-back"]),
 I("i2", "investing", "Which historical investment theses have held up?", "Picks-and-shovels (Nvidia, 2023–26); backing frontier labs early (Microsoft/Khosla in OpenAI 2019); the power/data-center build-out (Cahn's 'shovel ready'). Independent consumer-AI and sub-scale frontier labs (Inflection, 01.AI) did not.", "strong", ["satya-nadella", "vinod-khosla", "david-cahn", "jensen-huang"], ["cathie-wood", "masayoshi-son"], "Outcomes of strategic actions in the courtroom.", ["infra-supercycle", "frontier-consolidates"]),
 I("i3", "investing", "What leading indicators should investors track?", "Lab revenue run-rates vs capex guidance; open-weight lag (months); fixed-capability price decline; METR task horizons; power interconnect queues; GPU rental prices and utilization; credit spreads of AI infrastructure borrowers.", "strong", ["david-cahn", "leopold-aschenbrenner"], [], "These indicators would have flagged each major 2022–26 turn.", ["capex-pays-back", "agents-soon", "open-closes-gap"]),
]
json.dump(IM, open(f'{D}/implications.json', 'w'), indent=1, ensure_ascii=False)
print(len(SC), len(IM))
