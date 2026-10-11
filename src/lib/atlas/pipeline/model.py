# Stage 2 — knowledge modeling. Reads the merged research dataset and writes theses,
# technologies, judgments, and the assertion→thesis mapping. Idempotent: run after merge.py.
import os
HERE = os.path.dirname(os.path.abspath(__file__))
import json, collections
D = os.path.join(HERE, '..', 'data')
L = lambda f: json.load(open(f'{D}/{f}.json'))
S = lambda f, x: json.dump(x, open(f'{D}/{f}.json', 'w'), indent=1, ensure_ascii=False)

A = L('assertions'); E = L('events'); EV = {e['id']: e for e in L('evidence')}
ev_of = {e['id']: e['evidenceIds'] for e in E}
def evs(*ids):
    out = []
    for i in ids:
        out += ev_of.get(i, []) if i.startswith('evt-') else ([i] if i in EV else [])
    return list(dict.fromkeys(out))
def outev(*aids):  # outcome evidence from assertions
    by = {a['id']: a for a in A}
    out = []
    for i in aids:
        if i in by: out += by[i]['outcomeEvidenceIds']
    return list(dict.fromkeys(out))[:4]

def H(date, status, note, *src): return {"date": date, "status": status, "note": note, "evidenceIds": evs(*src), "eventIds": [x for x in src if x.startswith("evt-")]}

T = []
def thesis(id, title, statement, layers, topics, lens, assumptions, depends, history, outcome, out_src, superseded=None):
    t = {"id": id, "title": title, "statement": statement, "layers": layers, "topics": topics, "lens": lens,
         "assumptions": assumptions, "dependsOn": depends, "statusHistory": history, "status": history[-1]["status"],
         "outcome": outcome, "outcomeEvidenceIds": out_src}
    if superseded: t["supersededBy"] = superseded
    T.append(t)

thesis("scale-works", "Scale drives capability",
  "Bigger networks, more data and more compute reliably buy better capability — general methods that exploit computation beat hand-engineering.",
  ["semis", "cloud", "training"], ["scaling"], "technical",
  ["Compute keeps getting cheaper per FLOP", "Enough data exists to feed larger models", "Gains show up in useful capability, not just loss"],
  [],
  [H("2012-09", "partial", "AlexNet shows large GPU-trained nets beat hand-engineered vision.", "evt-2012-alexnet"),
   H("2017-10", "partial", "AlphaZero and Transformers reward general methods + compute.", "evt-2017-alphago-zero", "evt-2017-transformer"),
   H("2020-01", "validated", "Kaplan et al. show smooth power laws; GPT-3 confirms in May 2020.", "evt-2020-scaling-laws", "evt-2020-gpt3"),
   H("2023-03", "validated", "GPT-4 extends the trend.", "evt-2023-gpt4"),
   H("2025-08", "validated", "Pretraining returns are debated (GPT-5 reception), but scale — now in RL and inference — still drives the frontier.", "evt-2025-gpt-5", "evt-2024-o1")],
  "Held for 2012–2026: every frontier gain came with more compute, though since 2024 the compute shifted from pretraining to RL and inference.",
  evs("evt-2020-scaling-laws", "evt-2023-gpt4", "evt-2024-o1"))

thesis("scaling-sufficient", "Scaling LLMs is enough for AGI",
  "Continuing to scale today's transformer LLM recipe (plus incremental unhobbling) will by itself reach human-level general intelligence.",
  ["training", "models", "society"], ["scaling", "agi-timelines"], "technical",
  ["Next-token prediction learns a world model ('compression is understanding')", "No new architectural ingredient is required", "Data and compute keep pace"],
  ["scale-works"],
  [H("2020-05", "unresolved", "GPT-3's few-shot ability makes the 'pure scaling' bet credible to a minority.", "evt-2020-gpt3"),
   H("2023-03", "contested", "GPT-4 strengthens the scaling camp; critics point to hallucination and reasoning failures.", "evt-2023-gpt4"),
   H("2024-12", "contested", "Leading voices (Sutskever, Pichai) say pretraining gains are slowing; o1/o3 move gains to inference & RL.", "evt-2024-o1", "evt-2024-o3-arc"),
   H("2025-11", "contested", "Sutskever declares the 'age of scaling' over; Hassabis, LeCun, Sutton, Karpathy all expect extra ingredients.", "evt-2025-gpt-5")],
  "Unsettled at the cutoff: capability kept rising, but via RL, search and tool use layered on LLMs — not plain scale-up — and no system meets common AGI definitions.",
  evs("evt-2024-o1", "evt-2025-gpt-5"))

thesis("inference-scaling", "Reasoning = a new scaling axis",
  "Search, deliberation and RL at inference/post-training time ('System 2') unlock capability that pretraining alone does not.",
  ["inference", "training", "agents"], ["reasoning", "post-training"], "technical",
  ["Verifiable rewards exist for enough domains", "Inference compute stays affordable", "Reasoning traces generalize"],
  ["scale-works"],
  [H("2016-03", "partial", "AlphaGo shows search + learned value functions beat pure pattern-matching in games.", "evt-2016-alphago"),
   H("2022-01", "partial", "Chain-of-thought prompting hints that LLMs reason better when allowed to think.", "evt-2022-chain-of-thought"),
   H("2024-09", "validated", "OpenAI o1 makes test-time compute a product and a scaling law.", "evt-2024-o1"),
   H("2025-01", "validated", "DeepSeek-R1 replicates RL-trained reasoning in the open; reasoning goes mainstream.", "evt-2025-deepseek-r1", "evt-2025-reasoning-wave")],
  "Validated: reasoning models defined 2025–26 frontier progress and multiplied inference compute demand.",
  evs("evt-2024-o1", "evt-2025-deepseek-r1"))

thesis("data-wall", "Human data runs out",
  "High-quality human text is finite; pretraining as practised will plateau and progress must come from synthetic data, RL and experience.",
  ["data", "training"], ["data", "post-training", "scaling"], "technical",
  ["Web-scale text is near exhaustion", "Synthetic/experiential data can substitute", "Data efficiency does not leap"],
  ["scale-works"],
  [H("2022-03", "unresolved", "Chinchilla shows models were data-starved — data becomes the binding input.", "evt-2022-chinchilla"),
   H("2024-12", "partial", "Sutskever's 'peak data' talk; labs pivot to RL environments and synthetic data.", "evt-2024-o1"),
   H("2026-04", "partial", "Frontier progress continues through RL/post-training; no hard wall observed, but pretraining is no longer the main lever.", "evt-2026-deepseek-v4")],
  "Partly borne out: labs shifted to RL environments, synthetic and agentic data; no capability wall appeared.",
  evs("evt-2022-chinchilla"))

thesis("beyond-llms", "LLMs are a dead end",
  "Autoregressive language models cannot reach human-level intelligence; world models, experiential RL or program synthesis are needed.",
  ["architecture", "training"], ["architecture", "reasoning", "agi-timelines"], "technical",
  ["Text lacks grounding in physical reality", "Error compounds in autoregressive generation", "A rival paradigm can be made to work at scale"],
  [],
  [H("2018-01", "contested", "Critics catalogue deep learning's limits; few alternatives are competitive.", "evt-2018-elmo-gpt1-bert"),
   H("2022-11", "contested", "ChatGPT's success puts LLM skeptics on the defensive.", "evt-2022-chatgpt"),
   H("2025-11", "contested", "LeCun leaves Meta to build world models; Sutskever calls for an 'age of research'; no rival paradigm has yet beaten LLM-based systems.", "evt-2025-gpt-5"),
   H("2026-09", "contested", "LLM-centric systems still define the frontier (GPT-6, Claude 5); world-model startups are funded but pre-product.", "evt-2026-gpt-6")],
  "Unresolved: LLM-based systems kept improving through 2026; no alternative architecture has displaced them, but neither has scaling delivered AGI.",
  evs("evt-2026-gpt-6"))

thesis("self-supervision", "Self-supervision is the cake",
  "Most learning should come from predicting the world from raw data (self-supervised), not from labels or reward.",
  ["training", "data"], ["data", "scaling"], "technical",
  ["Unlabeled data is abundant", "Prediction objectives yield transferable representations"],
  [],
  [H("2016-12", "unresolved", "Supervised ImageNet-style learning dominates.", "evt-2015-resnet"),
   H("2018-10", "partial", "ELMo/GPT/BERT pretraining shows self-supervised text pretraining transfers.", "evt-2018-elmo-gpt1-bert"),
   H("2020-05", "validated", "GPT-3 makes self-supervised pretraining the foundation of the field.", "evt-2020-gpt3")],
  "Validated: self-supervised pretraining became the base layer of every foundation model.",
  evs("evt-2018-elmo-gpt1-bert", "evt-2020-gpt3"))

thesis("rl-experience", "RL from experience is the path",
  "Agents maximizing reward from their own experience — not imitation of human data — are the route to superhuman intelligence.",
  ["training", "agents"], ["post-training", "agents"], "technical",
  ["Rich environments with reward signals can be built", "Credit assignment scales", "Experience can be gathered cheaply enough"],
  ["data-wall"],
  [H("2016-03", "partial", "AlphaGo / AlphaZero: superhuman play from self-play RL.", "evt-2016-alphago", "evt-2017-alphago-zero"),
   H("2022-03", "partial", "RLHF shows RL matters for LLM usefulness.", "evt-2022-instructgpt"),
   H("2025-01", "partial", "RL with verifiable rewards drives reasoning models; continual experiential learning not yet realized.", "evt-2025-deepseek-r1")],
  "Partly validated: RL became central to post-training and reasoning, but open-ended learning from lifelong experience is still a research goal.",
  evs("evt-2025-deepseek-r1"))

thesis("open-closes-gap", "Open weights catch the frontier",
  "Open-weight models will match or closely trail the best closed models, eroding closed-model moats.",
  ["models", "economics"], ["open-weights", "commoditization"], "commercial",
  ["Training recipes diffuse quickly", "Open developers can access enough compute", "Distillation/efficiency gains spread"],
  [],
  [H("2023-02", "unresolved", "LLaMA weights leak; open models trail GPT-4 by a wide margin.", "evt-2023-llama"),
   H("2024-07", "partial", "Llama 3.1 405B reaches frontier-class on many benchmarks.", "evt-2024-llama-31-405b"),
   H("2025-01", "partial", "DeepSeek-R1 matches o1-class reasoning in the open at a fraction of cost.", "evt-2025-deepseek-r1"),
   H("2026-04", "partial", "DeepSeek V4 and Chinese open models trail the closed frontier by months; Meta retreats from fully open frontier releases.", "evt-2026-deepseek-v4", "evt-2026-meta-muse-spark")],
  "Partly validated: open weights trail by months (Epoch estimates ~3–4), not years — but the very top remains closed and Meta itself pulled back.",
  evs("evt-2026-deepseek-v4"))

thesis("open-safer", "Openness is safer than control",
  "Open release and light-touch rules protect competition and safety better than licensing regimes that favor incumbents.",
  ["society", "models"], ["open-weights", "safety"], "commercial",
  ["Misuse risk from open models is manageable", "Regulation would be captured by incumbents", "Many eyes improve security"],
  [],
  [H("2023-05", "contested", "Senate hearings float licensing; open-source advocates warn of regulatory capture.", "evt-2023-cais-statement"),
   H("2024-09", "contested", "SB 1047 vetoed; EU AI Act in force with GPAI duties.", "evt-2024-sb1047-veto", "evt-2024-eu-ai-act"),
   H("2026-06", "contested", "Governments restrict access to the most capable closed models (Mythos), while open Chinese models proliferate.", "evt-2026-commerce-mythos-order", "evt-2026-deepseek-v4")],
  "A values-laden debate, not settled by events: neither catastrophic open-model misuse nor regulatory capture has been clearly demonstrated by the cutoff.",
  [])

thesis("models-commoditize", "Models commoditize",
  "Prices for a given capability collapse and model APIs become interchangeable, compressing model-layer margins.",
  ["inference", "models", "economics"], ["commoditization", "value-accrual"], "commercial",
  ["Competitors reach parity quickly", "Switching costs stay low", "Efficiency gains are passed to price"],
  ["open-closes-gap"],
  [H("2023-11", "partial", "GPT-4 Turbo price cuts begin a price war.", "evt-2023-devday-gpt4-turbo"),
   H("2024-07", "partial", "GPT-4o mini prices GPT-4-class quality ~100x below launch price.", "evt-2024-gpt4o-mini"),
   H("2025-01", "partial", "DeepSeek prices near cost; Nvidia drops $589B in a day on efficiency fears.", "evt-2025-deepseek-r1", "evt-2025-nvidia-deepseek-drop"),
   H("2026-09", "partial", "Fixed-capability prices kept falling ~10x/yr, yet frontier labs reached ~$65–70B run-rates — premium frontier tiers retain pricing power.", "evt-2026-lab-runrates")],
  "Half right: capability-adjusted prices collapsed as predicted, but frontier model revenue exploded rather than commoditizing.",
  evs("evt-2024-gpt4o-mini", "evt-2026-lab-runrates"))

thesis("jevons", "Cheaper AI → more total demand",
  "Falling cost per unit of intelligence increases total consumption and spending (Jevons paradox) rather than shrinking the market.",
  ["inference", "cloud", "economics"], ["commoditization", "infra-cycle"], "commercial",
  ["Demand is highly elastic", "New use cases (agents, reasoning) absorb cheap tokens"],
  [],
  [H("2024-07", "partial", "Token prices fall sharply while usage grows.", "evt-2024-gpt4o-mini"),
   H("2025-02", "validated", "After DeepSeek, reasoning and agents multiply token demand; capex rises instead of falling.", "evt-2025-reasoning-wave", "evt-2025-claude-code"),
   H("2026-04", "validated", "Capex guidance reaches ~$700B+ despite collapsing unit prices.", "evt-2026-capex-raise")],
  "Validated through the cutoff: unit prices fell while total compute spend and lab revenue rose steeply.",
  evs("evt-2026-capex-raise", "evt-2026-lab-runrates"))

thesis("infra-supercycle", "AI infra is a supercycle",
  "Demand for AI compute (GPUs, data centers) will sustain a multi-year, trillion-dollar build-out rather than a short boom.",
  ["semis", "cloud", "energy"], ["infra-cycle", "hyperscalers"], "commercial",
  ["Model and agent demand keeps compounding", "Capital markets keep funding capex", "No efficiency shock collapses compute needs"],
  ["jevons", "scale-works"],
  [H("2019-01", "unresolved", "Crypto bust hits Nvidia; AI demand still small.", "evt-2019-mellanox"),
   H("2023-08", "partial", "Nvidia data-center revenue doubles in a quarter amid H100 shortage.", "evt-2023-nvidia-q2fy24"),
   H("2025-01", "validated", "Stargate and record hyperscaler capex; DeepSeek scare does not dent spending.", "evt-2025-stargate", "evt-2025-nvidia-deepseek-drop"),
   H("2026-08", "validated", "Big-four capex ~$700–725B; Nvidia data-center revenue ~$89B a quarter.", "evt-2026-capex-raise", "evt-2026-nvidia-q2fy27")],
  "Validated through Oct 2026 — the largest capex cycle in tech history — though whether it ends in overbuild is a separate, open question.",
  evs("evt-2026-capex-raise", "evt-2026-nvidia-q2fy27"))

thesis("capex-pays-back", "The capex will pay back",
  "End-user AI revenue will grow fast enough to justify the infrastructure spend; fears of an AI bubble are overdone.",
  ["economics", "cloud"], ["infra-cycle", "value-accrual", "enterprise-roi"], "commercial",
  ["AI revenue keeps compounding at triple digits", "Depreciation lives hold", "Financing stays available"],
  ["infra-supercycle"],
  [H("2023-09", "contested", "Sequoia's $200B question: revenue far below capex.", "evt-2023-nvidia-q2fy24"),
   H("2024-06", "contested", "The gap becomes 'AI's $600B question'.", "evt-2024-sequoia-600b"),
   H("2025-12", "contested", "Circular financing and Oracle credit spreads raise bubble fears.", "evt-2025-oracle-cds", "evt-2025-compute-megadeals"),
   H("2026-09", "unresolved", "Lab revenue run-rates of ~$65–70B narrow but do not close the gap with ~$700B annual capex.", "evt-2026-lab-runrates", "evt-2026-capex-raise")],
  "Unresolved: revenue is growing faster than skeptics expected, but remains a fraction of annual capex; the payback test falls after the cutoff.",
  evs("evt-2026-lab-runrates", "evt-2025-oracle-cds"))

thesis("power-binding", "Power becomes the binding constraint",
  "Electricity, grid interconnects and permitted data-center shells — not chips — become the limiting factor for AI build-out.",
  ["energy", "cloud"], ["infra-cycle"], "commercial",
  ["Chip supply catches up", "Grid and permitting move slowly", "Demand keeps rising"],
  ["infra-supercycle"],
  [H("2019-06", "unresolved", "Energy cost of training is an academic concern.", "evt-2019-strubell-energy"),
   H("2024-09", "partial", "Hyperscalers sign nuclear PPAs and restart reactors.", "evt-2024-tmi-restart", "evt-2024-lbnl-report"),
   H("2025-11", "partial", "CEOs report chips waiting on power and shells; GW-scale campuses become the unit of planning — but HBM and packaging also stay tight.", "evt-2025-compute-megadeals"),
   H("2026-06", "partial", "LBNL: data centers ~4.7% of US power and rising toward ~12% by 2030; power is a binding constraint alongside memory and packaging, not instead of them.", "evt-2026-lbnl-update")],
  "Partly validated by 2025–26: power and site readiness became a gating factor for new capacity, alongside (not instead of) chips, HBM and packaging.",
  evs("evt-2026-lbnl-update", "evt-2024-tmi-restart"))

thesis("frontier-consolidates", "Frontier AI consolidates",
  "Building frontier models requires capital and compute only a handful of hyperscaler-backed players can sustain.",
  ["cloud", "models", "economics"], ["hyperscalers", "value-accrual", "scaling"], "commercial",
  ["Frontier training costs keep rising", "Distribution and capital are scarce", "Efficiency shocks don't reset the race"],
  ["scale-works"],
  [H("2019-07", "partial", "OpenAI needs Microsoft's $1B and Azure to keep scaling.", "evt-2019-microsoft-openai-1b"),
   H("2023-09", "partial", "Anthropic aligns with Amazon/Google; Microsoft deepens OpenAI tie.", "evt-2023-amazon-anthropic", "evt-2023-microsoft-openai-10b"),
   H("2024-03", "validated", "Independent labs (Inflection, Character) fold into hyperscalers via license-and-hire deals.", "evt-2024-acquihire-deals"),
   H("2026-05", "validated", "OpenAI ($852B) and Anthropic ($965B) raise mega-rounds; 01.AI exits pretraining. DeepSeek remains the efficient exception.", "evt-2026-openai-852b", "evt-2026-anthropic-series-h")],
  "Validated with an exception: the frontier narrowed to a few capital-rich US labs plus a small group of efficient Chinese labs.",
  evs("evt-2024-acquihire-deals", "evt-2026-anthropic-series-h"))

thesis("incumbents-hold", "Incumbents absorb the disruption",
  "Platform incumbents (Google, Microsoft, Meta) defend their core franchises by embedding generative AI rather than being displaced by it.",
  ["distribution", "apps"], ["hyperscalers", "app-moats"], "commercial",
  ["Distribution beats model quality", "Incumbents move fast enough", "Users don't switch default habits"],
  [],
  [H("2023-02", "contested", "Bing Chat vows to 'make Google dance'; Google rushes Bard.", "evt-2023-bing-chat"),
   H("2025-11", "partial", "Google's Gemini 3 retakes benchmark lead; search revenue holds.", "evt-2025-gemini-3"),
   H("2026-09", "partial", "Incumbents hold distribution, but OpenAI and Anthropic became platform-scale companies in their own right.", "evt-2026-lab-runrates")],
  "Partly validated: no major incumbent franchise collapsed by 2026, but new AI-native platforms reached incumbent scale.",
  evs("evt-2025-gemini-3"))

thesis("app-layer-value", "Value accrues to apps & agents",
  "Durable value will accrue to application, workflow and agent layers built on top of models (the software-after-Nvidia thesis).",
  ["apps", "agents", "economics"], ["app-moats", "value-accrual"], "commercial",
  ["Models commoditize beneath apps", "Workflow and data create switching costs", "Apps capture a share of labor budgets"],
  ["models-commoditize"],
  [H("2023-06", "unresolved", "Value concentrates in Nvidia; apps are 'thin wrappers'.", "evt-2023-nvidia-q2fy24"),
   H("2025-02", "partial", "Coding agents (Cursor, Claude Code) become the first breakout application category.", "evt-2025-claude-code"),
   H("2026-09", "contested", "Model labs move up-stack into agents and apps, competing with their own customers.", "evt-2026-lab-runrates")],
  "Unresolved: some app-layer companies grew fast, but model labs captured much of the agent value themselves through 2026.",
  evs("evt-2025-claude-code"))

thesis("agents-soon", "Reliable agents arrive in 2025–26",
  "Autonomous agents will join the workforce as reliable coworkers within a year or two, materially changing company output.",
  ["agents", "apps"], ["agents", "enterprise-roi", "labor"], "commercial",
  ["Reliability over long horizons is achievable soon", "Tool/computer use matures", "Enterprises restructure work around agents"],
  ["inference-scaling"],
  [H("2023-07", "unresolved", "Copilots launch; autonomy is aspirational.", "evt-2023-devday-gpt4-turbo"),
   H("2025-03", "partial", "METR shows task horizons doubling ~every 7 months; coding agents work for hours.", "evt-2025-metr-horizons", "evt-2025-claude-code"),
   H("2025-08", "partial", "Enterprise pilots mostly fail to show P&L impact (MIT NANDA).", "evt-2025-mit-nanda"),
   H("2026-09", "partial", "Agents are productive in coding and narrow workflows; general 'digital employees' remain unreliable.", "evt-2026-lab-runrates")],
  "Partly right, early elsewhere: agents transformed software engineering by 2026 but not general knowledge work.",
  evs("evt-2025-metr-horizons", "evt-2025-mit-nanda"))

thesis("coding-first", "Software is automated first",
  "Programming becomes the first profession transformed: natural language and neural nets increasingly write the code.",
  ["apps", "agents"], ["coding", "labor"], "commercial",
  ["Code is verifiable and data-rich", "Developers adopt tools quickly"],
  [],
  [H("2017-11", "unresolved", "'Software 2.0' framing; little practical automation.", "evt-2017-transformer"),
   H("2021-06", "partial", "GitHub Copilot preview shows LLM code completion works.", "evt-2021-copilot-preview"),
   H("2025-02", "validated", "Agentic coding (Claude Code, Cursor) becomes the killer app.", "evt-2025-claude-code"),
   H("2026-03", "validated", "AI writes the majority of code at leading labs and many startups; coding agents drive lab revenue.", "evt-2026-lab-runrates")],
  "Validated: software development was the first large-scale professional domain transformed by AI.",
  evs("evt-2021-copilot-preview", "evt-2025-claude-code"))

thesis("agi-near", "Human-level AGI is near",
  "Human-level (or greater) general AI will arrive within a few years of the claim — on most such claims, before ~2030.",
  ["models", "society"], ["agi-timelines"], "technical",
  ["Current trends extrapolate", "No missing ingredient", "Compute build-out continues"],
  ["scaling-sufficient"],
  [H("2014-10", "unresolved", "AGI timelines are speculative; most researchers say decades.", "evt-2014-superintelligence"),
   H("2023-05", "unresolved", "GPT-4 shortens many experts' timelines (Hinton, Bengio).", "evt-2023-gpt4", "evt-2023-cais-statement"),
   H("2026-01", "unresolved", "Deadlines set for 2025 (e.g. Musk) pass without AGI; Amodei/Aschenbrenner windows (2026–27) still open.", "evt-2025-gpt-5")],
  "Unresolved: no consensus AGI by the cutoff; several specific near-term deadlines (2025) were missed while capability rose quickly.",
  [])

thesis("existential-risk", "Advanced AI is an existential risk",
  "Advanced AI could cause catastrophic or existential harm and warrants strong safety work and governance now.",
  ["society"], ["safety"], "technical",
  ["Capabilities will exceed human control", "Alignment is not solved by default", "Coordination is possible"],
  [],
  [H("2014-07", "contested", "Bostrom's Superintelligence frames the risk; most researchers dismiss it.", "evt-2014-superintelligence"),
   H("2023-05", "contested", "CAIS statement signed by Hinton, Bengio, Altman, Amodei, Hassabis; LeCun dissents.", "evt-2023-cais-statement"),
   H("2026-06", "contested", "Governments restrict frontier cyber-capable models (Glasswing/Mythos); evaluations show deceptive behaviors; no catastrophe observed.", "evt-2026-glasswing", "evt-2026-commerce-mythos-order")],
  "Not resolvable by observation at the cutoff; the risk debate moved from fringe to government policy.",
  evs("evt-2023-cais-statement", "evt-2026-glasswing"))

thesis("mass-displacement", "AI causes mass job loss",
  "AI will displace a large share of human jobs (or tasks) within roughly a decade of the claim.",
  ["society", "apps"], ["labor"], "commercial",
  ["Capability translates quickly into deployment", "Firms substitute rather than augment", "New job creation lags"],
  [],
  [H("2016-11", "unresolved", "Radiology and driving cited as first to go.", "evt-2016-alphago"),
   H("2021-11", "contested", "Five-year radiology deadline passes; radiologist demand still rises — first concrete miss for the thesis.", "evt-2021-copilot-preview"),
   H("2025-08", "unresolved", "Early evidence of reduced entry-level hiring in AI-exposed occupations; no aggregate unemployment spike.", "evt-2025-canaries"),
   H("2026-09", "unresolved", "Aggregate employment intact at the cutoff; most decade-scale deadlines not yet reached.", "evt-2025-canaries")],
  "Unresolved overall; specific early calls (radiologists by 2021, 80% of doctors' work by 2025) failed, while entry-level effects are emerging.",
  evs("evt-2025-canaries"))

thesis("china-parity", "China reaches near-parity",
  "Chinese AI will match or nearly match the US frontier despite compute disadvantages and export controls.",
  ["models", "semis", "society"], ["open-weights", "infra-cycle"], "commercial",
  ["Engineering efficiency offsets compute gap", "Talent and data are sufficient", "Controls leak or are circumvented"],
  [],
  [H("2017-07", "unresolved", "China's AI plan targets leadership by 2030.", "evt-2017-china-aidp"),
   H("2022-10", "contested", "US export controls aim to freeze China's compute.", "evt-2022-export-controls"),
   H("2025-01", "partial", "DeepSeek-R1 shocks markets with near-frontier reasoning.", "evt-2025-deepseek-r1"),
   H("2026-04", "partial", "DeepSeek V4 / Qwen / Kimi trail the frontier by months; compute still constrains China.", "evt-2026-deepseek-v4", "evt-2025-china-open-wave")],
  "Partly validated: China reached near-parity in open models with months of lag, not leadership; compute access remains its binding constraint.",
  evs("evt-2025-deepseek-r1", "evt-2026-deepseek-v4"))

thesis("ai-for-science", "AI becomes an engine of science",
  "AI systems will solve fundamental scientific problems and become primary tools of discovery.",
  ["models", "apps"], ["reasoning"], "technical",
  ["Scientific problems have learnable structure", "Verification is possible"],
  [],
  [H("2016-03", "unresolved", "AlphaGo hints at superhuman search in hard domains.", "evt-2016-alphago"),
   H("2020-11", "validated", "AlphaFold 2 solves protein structure prediction at CASP14.", "evt-2020-alphafold2"),
   H("2024-10", "validated", "Nobel Prize in Chemistry for AlphaFold.", "evt-2024-nobel-ai"),
   H("2026-09", "partial", "Models contribute novel math results; AI-designed drugs still in early trials.", "evt-2026-gpt-6")],
  "Validated for structural biology and parts of mathematics; broader 'AI scientist' claims remain partial.",
  evs("evt-2020-alphafold2", "evt-2024-nobel-ai"))

thesis("language-interface", "Language becomes the interface",
  "Natural-language conversation becomes a primary computing interface — 'English is the new programming language'.",
  ["distribution", "apps"], ["agents", "coding"], "commercial",
  ["Models understand intent reliably", "Users prefer asking to clicking"],
  [],
  [H("2016-03", "unresolved", "Chatbots ('bots are the new apps') underwhelm.", "evt-2016-alphago"),
   H("2022-11", "validated", "ChatGPT reaches 100M users in two months.", "evt-2022-chatgpt"),
   H("2025-02", "validated", "Coding by natural language ('vibe coding') goes mainstream.", "evt-2025-claude-code")],
  "Validated: conversational interfaces reached hundreds of millions of weekly users and natural language became a programming interface.",
  evs("evt-2022-chatgpt"))

thesis("fsd-imminent", "Full self-driving is a year away",
  "Camera-only neural driving will deliver unsupervised autonomy at scale within about a year of each claim.",
  ["agents", "apps"], ["agents"], "technical",
  ["End-to-end vision is sufficient", "Fleet data solves the long tail", "Regulators approve quickly"],
  [],
  [H("2017-12", "falsified", "The promised 2017 coast-to-coast autonomous drive does not happen.", ),
   H("2020-12", "falsified", "No million robotaxis in 2020.", ),
   H("2025-12", "falsified", "Robotaxi coverage of half the US by end-2025 does not happen; service remains limited.", )],
  "Falsified on the stated timelines (2017, 2020, 2025); whether vision-only autonomy ultimately scales is a separate, open question.",
  outev("as-musk-3", "as-musk-4", "as-musk-9"))

thesis("benchmarks-not-intelligence", "Skill ≠ intelligence",
  "Benchmark skill can be bought with data; intelligence is efficiency of adapting to novelty, and AI capability is 'jagged'.",
  ["platforms", "models"], ["reasoning", "agi-timelines"], "technical",
  ["Benchmarks leak into training data", "Novel-task adaptation is measurable"],
  [],
  [H("2019-11", "unresolved", "ARC benchmark introduced; LLMs score near zero.", ),
   H("2024-12", "partial", "o3 breaks ARC-AGI-1 with heavy test-time compute.", "evt-2024-o3-arc"),
   H("2025-06", "partial", "ARC-AGI-2 again exposes a large human–AI gap; 'jagged intelligence' becomes common vocabulary — though scores rose quickly later in 2025.", "evt-2024-o3-arc")],
  "Partly validated as a measurement critique: frontier systems remain jagged, but each new benchmark gap narrowed faster than the critique implied.",
  outev("as-chollet-6", "as-chollet-8"))

thesis("productivity-roi", "Enterprise AI pays off fast",
  "Generative AI will quickly deliver large, measurable enterprise productivity gains and ROI.",
  ["apps", "economics", "society"], ["enterprise-roi", "labor"], "commercial",
  ["Workflows can be redesigned quickly", "Quality is sufficient for production", "Gains show up in P&L"],
  [],
  [H("2023-07", "unresolved", "Copilot priced at $30/user/month; ROI unproven.", "evt-2023-devday-gpt4-turbo"),
   H("2025-08", "contested", "MIT NANDA: ~95% of GenAI pilots show no P&L impact; coding is the exception.", "evt-2025-mit-nanda"),
   H("2026-09", "partial", "Enterprise spend surges (lab run-rates), concentrated in coding and customer operations; economy-wide productivity gains not yet visible in statistics.", "evt-2026-lab-runrates")],
  "Partial: spending and adoption are real and concentrated; macro productivity effects had not appeared by the cutoff.",
  evs("evt-2025-mit-nanda", "evt-2026-lab-runrates"))

# ---------- assertion → thesis mapping ----------
S_, O_ = "supports", "opposes"
MAP = {
 "scale-works": {S_: "altman-2 hinton-1 sutskever-1 amodei-1 sutton-1 sutton-2 li-1 nadella-2 altman-1 musk-7 khosla-3 silver-3 huang-6 liang-1", O_: "marcus-2 lee-5"},
 "scaling-sufficient": {S_: "suleyman-1 asch-1 sutskever-3 amodei-4 son-5 musk-6", O_: "lecun-3 lecun-6 chollet-4 sutton-6 hassabis-8 sutskever-8 marcus-7 bengio-1 li-7 karpathy-7 pichai-5"},
 "inference-scaling": {S_: "huang-6 chollet-6 hassabis-2 silver-1 silver-5 sutton-2 bengio-1 sutskever-7", O_: "lecun-3"},
 "data-wall": {S_: "sutskever-7 silver-6 silver-2", O_: ""},
 "beyond-llms": {S_: "lecun-2 lecun-3 lecun-6 lecun-7 lecun-8 sutton-5 sutton-6 chollet-4 chollet-7 marcus-1 marcus-2 li-6 li-7 hassabis-8 hinton-3 sutskever-8", O_: "sutskever-3 asch-1 karpathy-3"},
 "self-supervision": {S_: "lecun-1 karpathy-1", O_: ""},
 "rl-experience": {S_: "silver-2 silver-4 silver-6 silver-7 sutton-3 sutton-5 hassabis-2 silver-3", O_: ""},
 "open-closes-gap": {S_: "zuck-5 liang-3 liang-5 andreessen-8 lee-7 gurley-2", O_: "khosla-4 amodei-5"},
 "open-safer": {S_: "lecun-5 gurley-1 gurley-2 andreessen-3 andreessen-6 andreessen-7 li-5 musk-2 musk-5 chollet-5", O_: "khosla-4 asch-7 suleyman-3 altman-4 marcus-4 hassabis-4"},
 "models-commoditize": {S_: "andreessen-5 altman-7 liang-5 marcus-5 cahn-3 lee-7 lee-8 wood-1", O_: ""},
 "jevons": {S_: "nadella-6 altman-7 huang-6", O_: ""},
 "infra-supercycle": {S_: "huang-2 huang-8 huang-9 asch-2 asch-3 asch-4 cahn-4 son-6 son-9 altman-9 zuck-3 zuck-8 pichai-4 wood-7 wood-8 huang-3", O_: "son-2 wood-4 wood-5 cahn-3 marcus-6"},
 "capex-pays-back": {S_: "pichai-4 zuck-8 son-9 wood-7 huang-8 wood-6", O_: "cahn-1 cahn-2 cahn-5 marcus-6 pichai-7 hassabis-5"},
 "power-binding": {S_: "zuck-4 asch-5 nadella-8 cahn-4", O_: ""},
 "frontier-consolidates": {S_: "altman-1 nadella-2 suleyman-5 hassabis-9 lee-8 son-7 zuck-7 musk-7 amodei-2", O_: "hoffman-2 lee-6 liang-3"},
 "incumbents-hold": {S_: "pichai-3 pichai-1", O_: "nadella-3"},
 "app-layer-value": {S_: "wood-6 gil-2 nadella-5 huang-1 karpathy-3 suleyman-4 wood-2", O_: "andreessen-5"},
 "agents-soon": {S_: "altman-6 amodei-6 zuck-6 suleyman-8 suleyman-2 asch-1 musk-8 nadella-4", O_: "karpathy-6 karpathy-7 marcus-7 chollet-8"},
 "coding-first": {S_: "huang-1 huang-5 karpathy-1 karpathy-2 karpathy-5 amodei-6 zuck-6 karpathy-9", O_: ""},
 "agi-near": {S_: "huang-4 hassabis-7 sutskever-2 musk-6 son-3 son-4 son-5 amodei-3 amodei-4 asch-1 altman-5 altman-8 hinton-4 hinton-6 bengio-3 bengio-4 khosla-7 suleyman-2 son-7 son-8 asch-9 zuck-7 sutskever-6", O_: "lecun-4 lecun-6 chollet-2 chollet-4 karpathy-7 li-8 marcus-3 pichai-6 nadella-7 sutskever-8"},
 "existential-risk": {S_: "suleyman-7 musk-1 hinton-4 hinton-5 hinton-8 bengio-2 bengio-3 bengio-4 bengio-5 bengio-6 bengio-7 hassabis-4 altman-4 suleyman-3 suleyman-6 asch-6 asch-8 amodei-8 amodei-9 sutskever-4 sutskever-6 marcus-4 pichai-2 amodei-2", O_: "lecun-4 lecun-5 andreessen-1 andreessen-4 sutton-4 chollet-2 gurley-1 hoffman-4 li-5"},
 "mass-displacement": {S_: "hinton-2 hinton-7 amodei-7 khosla-1 khosla-2 khosla-5 khosla-6 lee-1 lee-2 lee-3 suleyman-8 khosla-7", O_: "andreessen-2 andreessen-9 hoffman-3 li-2 karpathy-4 huang-5"},
 "china-parity": {S_: "lee-4 lee-7 liang-4 huang-7 andreessen-8 liang-1", O_: "amodei-5"},
 "ai-for-science": {S_: "hassabis-1 hassabis-3 hassabis-6 altman-8 silver-5 hoffman-5", O_: ""},
 "language-interface": {S_: "nadella-1 pichai-1 karpathy-2 huang-5 suleyman-4 karpathy-3", O_: ""},
 "fsd-imminent": {S_: "musk-3 musk-4 musk-9 karpathy-8", O_: ""},
 "benchmarks-not-intelligence": {S_: "chollet-3 chollet-6 chollet-8 nadella-7 li-8 pichai-6", O_: ""},
 "productivity-roi": {S_: "wood-3 wood-2 nadella-4 altman-6 khosla-6 hoffman-3", O_: "marcus-6 cahn-1 marcus-5"},
}
PFX = {"huang": "huang", "nadella": "nadella", "pichai": "pichai", "zuck": "zuck", "liang": "liang"}
byid = {a['id']: a for a in A}
for a in A: a['theses'] = []
miss = []
for tid, st in MAP.items():
    for stance, ids in st.items():
        for short in ids.split():
            aid = f"as-{short}"
            if aid not in byid: miss.append(aid); continue
            if not any(x['id'] == tid for x in byid[aid]['theses']):
                byid[aid]['theses'].append({"id": tid, "stance": stance})
print("missing mapped ids:", miss)
print("unmapped assertions:", [a['id'] for a in A if not a['theses']])

# ---------- stage-6 audit adjustments (recorded in method.json audit log) ----------
AUDIT = {
 # --- first-pass (author) adjustments ---
 "as-bengio-2": ("Signing a pause letter is advocacy, not a forecast: shown (the advocated pause did not happen) but not scored.", {"kind": "aspiration", "unscored": "Advocacy, not a forecast."}),
 "as-altman-8": ("'Novel insights in 2026' verdict rests on contested reports of model-assisted math results; confidence lowered.", {"confidence": "low"}),
 "as-asch-4": ("Aschenbrenner's ~$500B/yr by 2026 counted total AI investment; the match uses big-four capex guidance (~$700B), a narrower but larger measure — directionally correct.", {}),
 "as-marcus-2": ("Kept incorrect on the headline ('hitting a wall' on capability — rapid gains 2022–26). Auditor noted the parallel LeCun claim (as-lecun-3) is graded partial; the difference is that LeCun's claim concerned reliability/factuality only, while Marcus's headline concerned progress itself.", {}),
 "as-zuck-5": ("Two parts: 'open source becomes the standard' (not borne out at the frontier) and 'Llama most advanced in 2025' (did not happen). Verdict incorrect on the testable part.", {}),
 # --- stage-6 independent audit (audit-findings f1–f31) ---
 "as-hassabis-6": ("[f1] Deadline (end-2025) passed with no public first-dosing announcement recorded by the cutoff, so resolved as incorrect (low confidence: flips if a 2025 trial start is documented).", {"verdict": "incorrect", "timing": "n/a", "confidence": "low", "causal": 2}),
 "as-silver-1": ("[f2] Announces the authors' own demonstrated result (AlphaGo vs Fan Hui) — track record, not foresight.", {"unscored": "Self-demonstrated result."}),
 "as-silver-2": ("[f2] Announces a result already demonstrated in the paper (AlphaGo Zero).", {"unscored": "Self-demonstrated result."}),
 "as-silver-3": ("[f2] Announces a result already demonstrated (AlphaZero).", {"unscored": "Self-demonstrated result."}),
 "as-silver-5": ("[f2] Announces a result already demonstrated (AlphaProof IMO silver).", {"unscored": "Self-demonstrated result."}),
 "as-hassabis-2": ("[f2] Same AlphaGo result as as-silver-1; counted once and as track record, not foresight.", {"unscored": "Self-demonstrated result."}),
 "as-hassabis-3": ("[f4] Dated at the CASP14 result it is credited with predicting; treated as track record. 'Primary tool for scientific discovery' is too vague for specificity 4.", {"unscored": "Self-demonstrated result.", "specificity": 2}),
 "as-hinton-1": ("[f2] AlexNet is the authors' own demonstrated result — foundational, but not a forecast.", {"unscored": "Self-demonstrated result."}),
 "as-karpathy-5": ("[f9] Coining 'vibe coding' described a practice the same day; its spread is self-fulfilling, not foresight.", {"unscored": "Description of a present practice."}),
 "as-sutskever-5": ("[f5] A board vote is a governance act, not a claim about AI's evolution; shown, not scored (consistent with as-bengio-2).", {"unscored": "Governance act, not a forecast."}),
 "as-li-4": ("[f7] Policy advocacy (NAIRR); outcome partly shaped by the advocacy itself. Treated like other advocacy (licensing calls) — shown, not scored.", {"unscored": "Advocacy; outcome shaped by the advocate.", "verdict": "unresolved", "causal": None}),
 "as-andreessen-3": ("[f8] Winning a policy argument is not forecasting accuracy; shown, not scored.", {"unscored": "Advocacy; outcome shaped by the advocate.", "verdict": "unresolved", "causal": None}),
 "as-andreessen-7": ("[f8] Joint policy statement — advocacy, not a forecast.", {"unscored": "Advocacy; outcome shaped by the advocate.", "verdict": "unresolved", "causal": None}),
 "as-amodei-6": ("[f10] Industry-wide share of AI-written code was far below 90% within 3–6 months (lab-internal shares were high). Graded incorrect for consistency with other direction-right, magnitude/timing-wrong dated claims (khosla-2, hinton-2, musk-8).", {"verdict": "incorrect", "timing": "premature", "causal": 3}),
 "as-zuck-4": ("[f11] Power-not-chips: graded partial and on-time for consistency with as-asch-5 — chips, HBM and packaging also bound through 2026.", {"verdict": "partial", "timing": "on-time", "originality": 3}),
 "as-huang-2": ("[f12] Horizon (2027) is after the cutoff; the literal claim is not yet testable.", {"verdict": "unresolved", "causal": None, "timing": "n/a"}),
 "as-amodei-5": ("[f13] Core claim (export controls decisive for a unipolar world ~2026–27) not yet testable.", {"verdict": "unresolved", "causal": None, "timing": "n/a"}),
 "as-son-6": ("[f14] Aspiration with a 2029 horizon — unresolved.", {"verdict": "unresolved", "causal": None, "timing": "n/a"}),
 "as-hinton-2": ("[f15] The 5-year horizon (Nov 2021) passed with AI used as an aid, not a replacement, and the advice to stop training radiologists was refuted by rising radiologist demand and pay. The 'might be ten years' hedge runs to Nov 2026, just after the cutoff; Hinton later said he was too early and too specific.", {"verdictRationale": "The 5-year horizon (Nov 2021) passed with AI used as an aid, not a replacement; the explicit advice to stop training radiologists was refuted by rising radiologist demand. The 10-year hedge ends Nov 2026, just after the cutoff, with no sign of displacement."}),
 "as-liang-1": ("[f16] The A100 purchase was completed by ~2021 for quant trading; redated and originality lowered — its LLM rationale is partly retrospective.", {"date": "2021", "originality": 3, "timing": "on-time"}),
 "as-gil-1": ("[f18] Posed explicitly as an open question — not scorable as a correct opinion.", {"verdict": "unresolved", "causal": None, "timing": "n/a"}),
 "as-khosla-3": ("[f19] An investment is never proof of belief; shown on the record, not scored.", {"unscored": "Investment / financial position."}),
 "as-hoffman-1": ("[f19] A donation is not a forecast; shown, not scored.", {"unscored": "Investment / financial position."}),
 "as-gil-2": ("[f19] An investment is not a forecast; shown, not scored.", {"unscored": "Investment / financial position."}),
 "as-son-2": ("[f19] A divestment is a financial position, not a stated forecast; shown, not scored.", {"unscored": "Investment / financial position."}),
 "as-wood-4": ("[f19] A divestment is a financial position; her stated valuation view (as-wood-5) is scored instead.", {"unscored": "Investment / financial position."}),
 "as-son-7": ("[f19] Capital concentration in OpenAI is a financial position.", {"unscored": "Investment / financial position."}),
 "as-asch-9": ("[f19] Founding a fund is a financial position.", {"unscored": "Investment / financial position."}),
 "as-sutskever-2": ("[f31] No source attached for this record; shown, not scored until one is.", {"unscored": "No source attached."}),
 "as-huang-7": ("[f30] Bundles statements from May, Oct and Nov 2025 under one date; the May 2025 statement is the dated claim, later remarks are context.", {}),
}
for aid, (note, patch) in AUDIT.items():
    if aid in byid:
        byid[aid]['audit'] = note; byid[aid].update(patch)

# Competing interpretations for landmark cases
INTERP = {
 "as-hinton-2": ["Strict reading: radiologists were not outperformed or displaced within 5 or 10 years — incorrect.", "Charitable reading: AI does outperform radiologists on narrow detection tasks; the error was assuming task performance implies job loss."],
 "as-marcus-2": ["Capability reading: scaling kept delivering through 2026 — the 'wall' did not appear.", "Reliability reading: hallucination and robustness problems persisted, which was Marcus's core claim."],
 "as-amodei-6": ["Inside frontier labs and AI-native startups, ~90% AI-written code was reported by 2025–26.", "Industry-wide, the share was far lower within the 3–6 month window — the claim overreached in scope."],
 "as-altman-6": ["Coding agents did change output at many firms in 2025 — partially right.", "General-purpose 'digital employees' did not join the workforce in 2025."],
 "as-chollet-4": ["o3's ARC-AGI-1 score shows LLM-based systems with test-time search can adapt — the strong claim failed.", "o3 is not a plain LLM; Chollet argued it validated his view that program search was the missing piece."],
 "as-asch-2": ["~1 GW-class campuses (e.g. Stargate Abilene) were operating or under construction in 2026 — on track.", "Single training clusters at a true 1 GW draw are hard to verify from public data."],
 "as-cahn-2": ["Revenue grew far faster than skeptics expected (lab run-rates ~$65–70B by Sep 2026).", "Annual capex (~$700B) still dwarfs revenue; the payback question remains open."],
 "as-zuck-5": ["Open weights did come within months of the frontier (DeepSeek, Qwen).", "But Llama did not lead, and Meta itself retreated from open frontier releases in 2026."],
}
for aid, xs in INTERP.items():
    if aid in byid: byid[aid]['interpretations'] = xs

S('assertions', A)
S('theses', T)

# ---------- technologies ----------
TECH = [
 ("gpu-deep-learning", "GPU-trained deep nets", "semis", "2012-09", "Large convolutional nets trained on GPUs (AlexNet) made deep learning practical.", ["geoffrey-hinton", "org:NVIDIA"], ["evt-2012-alexnet"]),
 ("deep-rl-search", "Deep RL + tree search", "training", "2016-03", "Policy/value networks with Monte Carlo tree search and self-play (AlphaGo, AlphaZero).", ["david-silver", "demis-hassabis"], ["evt-2016-alphago", "evt-2017-alphago-zero"]),
 ("tpu", "TPU (custom AI ASIC)", "semis", "2016-05", "Google's tensor processing unit — the first hyperscaler AI chip.", ["sundar-pichai", "org:Google"], ["evt-2016-tpu"]),
 ("transformer", "Transformer", "architecture", "2017-06", "Attention-only architecture that became the substrate of all foundation models.", ["org:Google"], ["evt-2017-transformer"]),
 ("pretraining", "Self-supervised pretraining", "training", "2018-10", "Pretrain on raw text, then fine-tune (ELMo, GPT, BERT).", ["ilya-sutskever", "org:OpenAI", "org:Google"], ["evt-2018-elmo-gpt1-bert"]),
 ("scaling-laws", "Neural scaling laws", "training", "2020-01", "Empirical power laws relating loss to compute, data and parameters.", ["dario-amodei", "org:OpenAI"], ["evt-2020-scaling-laws", "evt-2022-chinchilla"]),
 ("alphafold", "AlphaFold", "models", "2020-11", "Protein-structure prediction at experimental accuracy.", ["demis-hassabis"], ["evt-2020-alphafold2"]),
 ("rlhf", "RLHF / instruction tuning", "training", "2022-03", "Reinforcement learning from human feedback turned base models into assistants.", ["org:OpenAI", "dario-amodei"], ["evt-2022-instructgpt", "evt-2022-chatgpt"]),
 ("diffusion", "Diffusion models", "architecture", "2022-08", "Iterative denoising generators for images and video.", ["org:Stability", "org:OpenAI"], ["evt-2022-image-diffusion", "evt-2024-sora"]),
 ("moe", "Mixture-of-experts", "architecture", "2023-12", "Sparse expert routing that cuts inference cost (Mixtral, DeepSeek).", ["liang-wenfeng", "org:Mistral"], ["evt-2023-mixtral", "evt-2026-deepseek-v4"]),
 ("open-llms", "Open-weight LLMs", "models", "2023-02", "Downloadable frontier-class weights (Llama, Qwen, DeepSeek).", ["mark-zuckerberg", "yann-lecun", "liang-wenfeng"], ["evt-2023-llama", "evt-2024-llama-31-405b"]),
 ("reasoning-models", "Reasoning models (test-time compute)", "inference", "2024-09", "RL-trained models that think before answering (o1, R1, o3).", ["sam-altman", "liang-wenfeng", "org:OpenAI"], ["evt-2024-o1", "evt-2025-deepseek-r1"]),
 ("agents-mcp", "Agents, computer use & MCP", "agents", "2024-11", "Tool-using agents with standardized context protocols and coding harnesses.", ["dario-amodei", "andrej-karpathy", "org:Anthropic"], ["evt-2024-computer-use-mcp", "evt-2025-claude-code"]),
 ("world-models", "World models / JEPA", "architecture", "2022-06", "Predictive models of the physical world in representation space; spatial intelligence.", ["yann-lecun", "fei-fei-li", "demis-hassabis"], []),
]
S('technologies', [{"id": i, "name": n, "layer": l, "date": d, "summary": s, "builtBy": b, "eventIds": e, "evidenceIds": evs(*e)} for i, n, l, d, s, b, e in TECH])
print("theses", len(T), collections.Counter(t['status'] for t in T))
