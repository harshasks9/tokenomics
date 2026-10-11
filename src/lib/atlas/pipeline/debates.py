# Stage 3/5 authored analysis: debates. Uses events/evidence ids from the merged dataset.
import os
HERE = os.path.dirname(os.path.abspath(__file__))
import json
D = os.path.join(HERE, '..', 'data')
E = {e['id']: e['evidenceIds'] for e in json.load(open(f'{D}/events.json'))}
A = {a['id']: a for a in json.load(open(f'{D}/assertions.json'))}
def ev(*ids):
    out = []
    for i in ids:
        if i in E: out += E[i]
        elif i in A: out += A[i]['evidenceIds'][:1] + A[i]['outcomeEvidenceIds'][:1]
    return list(dict.fromkeys(out))
def F(date, text, *src): return {"date": date, "text": text, "evidenceIds": ev(*src)}
def B(date, v, note): return {"date": date, "value": v, "note": note}
def camp(id, label, position, thinkers, assumptions, evidence): return {"id": id, "label": label, "position": position, "thinkers": thinkers, "assumptions": assumptions, "evidenceFor": evidence}

DEB = []
def debate(id, title, question, layers, a, b, balance, both, status, verdict, theses):
    DEB.append({"id": id, "title": title, "question": question, "layers": layers, "camps": [a, b], "balance": balance,
                "bothRight": both, "status": status, "verdictNote": verdict, "thesisIds": theses})

debate("scaling-vs-architecture", "Scaling vs new architectures",
  "Will scaling today's transformer recipe keep producing capability gains, or is a fundamentally new architecture required?",
  ["architecture", "training"],
  camp("scale", "Scale the recipe", "General methods plus compute win; LLMs plus RL and search will keep improving toward general intelligence.",
       ["ilya-sutskever", "dario-amodei", "sam-altman", "leopold-aschenbrenner", "jensen-huang"],
       ["Loss keeps falling predictably with compute", "Post-training/RL can fix reliability", "Data limits can be routed around"],
       [F("2020-01", "Scaling laws show smooth power-law gains.", "evt-2020-scaling-laws"), F("2020-05", "GPT-3 few-shot learning emerges from scale.", "evt-2020-gpt3"),
        F("2023-03", "GPT-4 extends the trend across professional exams.", "evt-2023-gpt4"), F("2024-09", "o1 adds an inference-time scaling axis.", "evt-2024-o1"),
        F("2026-09", "GPT-6 and Claude 5 keep the frontier moving with LLM-based systems.", "evt-2026-gpt-6")]),
  camp("new", "New ideas needed", "Autoregressive LLMs lack world models, planning and efficient learning; a different paradigm (world models, experiential RL, program synthesis) is required.",
       ["yann-lecun", "gary-marcus", "francois-chollet", "richard-sutton", "fei-fei-li"],
       ["Text alone cannot ground understanding", "Errors compound in autoregressive generation", "Sample efficiency matters for intelligence"],
       [F("2022-03", "Chinchilla shows data, not just parameters, binds.", "evt-2022-chinchilla"), F("2024-12", "Sutskever: 'pretraining as we know it will end'.", "as-sutskever-7"),
        F("2025-08", "GPT-5's mixed reception fuels 'diminishing returns' talk.", "evt-2025-gpt-5"), F("2025-11", "Sutskever: back to an 'age of research'.", "as-sutskever-8"),
        F("2025-06", "ARC-AGI-2 keeps a large human–AI gap.", "as-chollet-8")]),
  [B("2017", 0.4, "Deep learning works but transformers are new; skeptics (Marcus) catalogue limits."), B("2020-06", -0.4, "GPT-3 and scaling laws swing the field toward scale."),
   B("2023-03", -0.6, "GPT-4 is the high-water mark for 'scale is all you need'."), B("2024-12", -0.1, "Pretraining slowdown concedes ground; but o1/o3 show the LLM stack still has headroom."),
   B("2025-11", 0.1, "Even scaling's champion calls for new research; LLM-based systems still lead every benchmark."), B("2026-09", 0.0, "Stalemate: LLM-centric systems define the frontier, but via RL/search additions that the 'new ideas' camp predicted.")],
  "Both are partly right if 'scaling' is read broadly: the frontier kept advancing on transformer backbones, but the gains since 2024 came from new training ideas (RL with verifiable rewards, test-time search) layered on top — exactly the kind of addition skeptics said was needed.",
  "unresolved", "No rival architecture had displaced transformer LLMs by Oct 2026, and no LLM system met AGI definitions. The debate has narrowed to whether additions on an LLM base count as 'scaling'.",
  ["scaling-sufficient", "beyond-llms", "inference-scaling"])

debate("llm-vs-world-models", "Language models vs world models",
  "Can intelligence be learned from text, or must models learn grounded representations of the physical world?",
  ["architecture", "data"],
  camp("lang", "Language is enough", "Predicting text well forces a model to learn the world that produced it ('compression is understanding').",
       ["ilya-sutskever", "andrej-karpathy", "sam-altman"], ["Text encodes most human knowledge", "Multimodality can be bolted on"],
       [F("2023-03", "GPT-4 shows broad world knowledge from text pretraining.", "evt-2023-gpt4"), F("2024-05", "GPT-4o adds native multimodality on the same backbone.", "evt-2024-gpt-4o")]),
  camp("world", "World models first", "Systems must learn predictive models of physical reality (JEPA, spatial intelligence) to plan and reason robustly.",
       ["yann-lecun", "fei-fei-li", "demis-hassabis", "richard-sutton"], ["Most knowledge is non-verbal", "Planning requires predictive state models"],
       [F("2024-09", "World Labs founded for large world models.", "as-li-6"), F("2025-11", "LeCun leaves Meta to found AMI Labs for world models.", "as-lecun-8"),
        F("2025-11", "Marble ships from World Labs.", "as-li-7")]),
  [B("2022-06", 0.2, "LeCun's JEPA proposal; LLMs not yet mainstream."), B("2023-03", -0.5, "GPT-4 makes text-only learning look sufficient."),
   B("2025-11", -0.1, "Capital flows to world-model startups; Hassabis says world models are one of the missing pieces."), B("2026-09", -0.2, "World-model labs are funded but pre-product at scale; multimodal LLMs dominate deployment (AMD agrees to acquire World Labs).")],
  "Both may hold: language models dominate digital knowledge work, while world models may prove necessary for robotics and physical autonomy — different domains, different bottlenecks.",
  "unresolved", "Undecided at the cutoff; the decisive test (robotics, physical agents) had not played out.",
  ["beyond-llms"])

debate("open-vs-closed", "Open weights vs closed models",
  "Will open-weight models keep pace with — and erode the moats of — closed frontier labs?",
  ["models", "economics", "society"],
  camp("open", "Open wins", "Recipes diffuse; open models will become the standard like Linux, and closed moats are temporary.",
       ["mark-zuckerberg", "liang-wenfeng", "yann-lecun", "marc-andreessen", "bill-gurley"], ["Knowledge diffuses within months", "Efficiency beats raw compute"],
       [F("2024-07", "Llama 3.1 405B reaches frontier class.", "evt-2024-llama-31-405b"), F("2025-01", "DeepSeek-R1 matches o1-class reasoning in the open.", "evt-2025-deepseek-r1"),
        F("2026-04", "DeepSeek V4: 1.6T open MoE.", "evt-2026-deepseek-v4")]),
  camp("closed", "Closed frontier holds", "The best models stay closed; frontier capability needs scale, security and control.",
       ["vinod-khosla", "dario-amodei", "leopold-aschenbrenner", "sam-altman"], ["Frontier compute is scarce", "Security concerns justify closure"],
       [F("2026-04", "Meta retreats from fully open frontier releases.", "evt-2026-meta-muse-spark"), F("2026-05", "Closed labs' revenue reaches tens of billions.", "evt-2026-anthropic-series-h"),
        F("2026-06", "Most capable models are withheld or access-restricted (Mythos).", "evt-2026-commerce-mythos-order")]),
  [B("2023-02", 0.5, "Closed GPT-4 far ahead; LLaMA leak starts open era."), B("2024-07", 0.1, "Llama 3.1 narrows the gap."), B("2025-01", -0.3, "DeepSeek-R1 shock."),
   B("2026-06", 0.2, "Open trails by months, while the very top (and Meta) moves closed.")],
  "Both are right on different axes: open weights commoditize capability a few months behind the frontier (pressuring prices), while closed labs keep the frontier and most revenue.",
  "leaning", "Leaning to a two-tier equilibrium: closed frontier with pricing power, open models months behind setting the price floor.",
  ["open-closes-gap", "models-commoditize", "open-safer"])

debate("agi-timelines", "Fast AGI vs gradual capability",
  "Is human-level general AI a few years away, or a decade-plus of gradual, jagged progress?",
  ["models", "society"],
  camp("fast", "AGI within a few years", "Extrapolating compute and algorithmic gains implies AGI around 2026–2028.",
       ["elon-musk", "masayoshi-son", "dario-amodei", "leopold-aschenbrenner", "sam-altman"], ["Trend lines continue", "No missing ingredients"],
       [F("2023-03", "GPT-4 shortens timelines for many experts.", "evt-2023-gpt4"), F("2025-03", "METR: task horizons double every ~7 months.", "evt-2025-metr-horizons")]),
  camp("slow", "Decade-plus, jagged progress", "Capability is jagged; reliability, continual learning and agency need breakthroughs — think a decade, not years.",
       ["andrej-karpathy", "demis-hassabis", "yann-lecun", "francois-chollet", "sundar-pichai", "satya-nadella"], ["Benchmarks overstate generality", "Diffusion into economy is slow"],
       [F("2025-10", "Karpathy: 'decade of agents', agents 'just don't work' yet.", "as-karpathy-7"), F("2025-12", "Musk's AGI-by-2025 deadline passes.", "as-musk-6"),
        F("2025-06", "ARC-AGI-2 gap persists.", "as-chollet-8")]),
  [B("2016", 0.7, "Most researchers place AGI decades out."), B("2023-05", -0.2, "GPT-4 and the CAIS statement mainstream short timelines."),
   B("2025-03", -0.3, "METR doubling and reasoning models strengthen short timelines."), B("2026-01", 0.2, "2025 deadlines missed; jaggedness acknowledged widely."),
   B("2026-09", 0.1, "Rapid progress continues but no consensus AGI; 2027 deadlines still open.")],
  "Both can be right if 'AGI' is defined differently: superhuman performance on many tests may arrive on the fast camp's schedule while reliable, autonomous, generally competent agents take the slow camp's decade.",
  "unresolved", "Open: the earliest deadlines (2025) missed, the 2026–2028 windows still live. Definitions, not just evidence, divide the camps.",
  ["agi-near", "scaling-sufficient"])

debate("infra-vs-models-value", "Infrastructure vs models: who captures value?",
  "Will economic value accrue mainly to chip/infrastructure providers, model labs, or applications?",
  ["semis", "models", "apps", "economics"],
  camp("infra", "Picks and shovels", "Compute is the scarce input; Nvidia and hyperscalers capture most value.",
       ["jensen-huang", "leopold-aschenbrenner", "satya-nadella"], ["Demand outruns supply", "Compute is not commoditized"],
       [F("2023-08", "Nvidia data-center revenue doubles in a quarter.", "evt-2023-nvidia-q2fy24"), F("2026-08", "Nvidia ~$89B data-center quarter.", "evt-2026-nvidia-q2fy27")]),
  camp("up", "Value moves up the stack", "Infrastructure overbuilds and commoditizes; models and applications/agents capture durable value.",
       ["cathie-wood", "david-cahn", "elad-gil", "marc-andreessen"], ["Capex outruns revenue", "GPU pricing power erodes"],
       [F("2024-06", "AI's $600B question.", "evt-2024-sequoia-600b"), F("2026-09", "Lab run-rates reach ~$65–70B.", "evt-2026-lab-runrates")]),
  [B("2023-08", -0.7, "Nvidia captures the overwhelming share of AI profits."), B("2024-06", -0.6, "The $600B gap highlights app-layer shortfall."),
   B("2025-01", -0.3, "DeepSeek scare questions compute moats."), B("2026-09", -0.3, "Infrastructure still dominant, but model-lab revenue is now large.")],
  "Both: value capture has migrated in sequence — first chips, then clouds and frontier labs — and whether it reaches applications depends on whether models commoditize.",
  "leaning", "Through Oct 2026 infrastructure captured the most profit; model labs became the second profit pool; the application layer is the least proven.",
  ["infra-supercycle", "app-layer-value", "capex-pays-back"])

debate("bubble", "Bubble vs build-out",
  "Is the AI capex boom a bubble that will end in overcapacity, or a rational build-out ahead of demand?",
  ["economics", "cloud", "energy"],
  camp("bubble", "Bubble risk", "Revenue lags capex by an order of magnitude; circular financing and depreciation risk echo past manias.",
       ["david-cahn", "gary-marcus"], ["Revenue cannot catch up in time", "GPUs depreciate fast"],
       [F("2024-06", "Revenue gap estimated at ~$600B/yr.", "evt-2024-sequoia-600b"), F("2025-12", "Oracle credit spreads widen on AI debt.", "evt-2025-oracle-cds")]),
  camp("build", "Rational build-out", "Under-investment is the bigger risk; demand (reasoning, agents) will absorb capacity.",
       ["mark-zuckerberg", "jensen-huang", "masayoshi-son", "cathie-wood", "sundar-pichai"], ["Demand compounds", "Infrastructure is reusable"],
       [F("2025-02", "Reasoning and agents multiply token demand.", "evt-2025-reasoning-wave"), F("2026-09", "Lab revenue run-rates surge.", "evt-2026-lab-runrates")]),
  [B("2023-09", 0.0, "Sequoia's $200B question raises the gap."), B("2024-06", -0.2, "$600B question."), B("2025-12", -0.2, "Credit stress around AI debt."),
   B("2026-09", 0.1, "Revenue growth outpaces skeptics' expectations; gap persists.")],
  "Both can be true: a technology can be transformative and still overbuilt in the short run — railways and fiber both were.",
  "unresolved", "Unresolved at the cutoff; the payback test lies in 2027–2029.",
  ["capex-pays-back", "infra-supercycle"])

debate("agents-replace-vs-augment", "Agents replace software vs augment it",
  "Will AI agents replace SaaS applications and workflows, or be embedded as features inside existing software?",
  ["agents", "apps", "distribution"],
  camp("replace", "Agents replace apps", "Business logic migrates into agents; SaaS becomes a database.",
       ["satya-nadella", "jensen-huang", "sam-altman"], ["Agents become reliable", "Interfaces collapse into conversation"],
       [F("2025-02", "Coding agents take over development workflows.", "evt-2025-claude-code")]),
  camp("augment", "Agents augment software", "Agents are a new interface over durable systems of record; incumbents embed them.",
       ["reid-hoffman", "andrej-karpathy", "fei-fei-li"], ["Systems of record persist", "Reliability limits autonomy"],
       [F("2025-08", "Most enterprise pilots fail to reach P&L impact.", "evt-2025-mit-nanda"), F("2025-10", "Karpathy: agents 'just don't work' as employees yet.", "as-karpathy-7")]),
  [B("2024-12", 0.0, "Nadella predicts SaaS collapse into agents."), B("2025-08", 0.3, "Enterprise pilots disappoint."), B("2026-09", 0.1, "Coding agents replace workflows; elsewhere agents augment.")],
  "Both: in software engineering agents replaced workflows; in most enterprise functions they augment systems of record.",
  "unresolved", "Domain-dependent and unresolved; coding is the counterexample to the 'augment only' view.",
  ["agents-soon", "app-layer-value"])

debate("labor", "Replace labor vs raise productivity",
  "Will AI mainly displace workers or mainly raise their productivity?",
  ["society", "apps"],
  camp("replace", "Mass displacement", "AI will replace large shares of white-collar work within years.",
       ["geoffrey-hinton", "dario-amodei", "vinod-khosla", "kai-fu-lee", "mustafa-suleyman"], ["Capability converts quickly to substitution"],
       [F("2025-08", "Entry-level hiring declines in AI-exposed occupations.", "evt-2025-canaries")]),
  camp("augment", "Productivity, not unemployment", "AI raises productivity and demand; lump-of-labor fears are a fallacy.",
       ["marc-andreessen", "reid-hoffman", "fei-fei-li", "jensen-huang"], ["Demand is elastic", "New tasks emerge"],
       [F("2021-11", "Radiology call misses: radiologist demand rises.", "as-hinton-2"), F("2026-09", "No aggregate unemployment spike by the cutoff.", "as-andreessen-9")]),
  [B("2016-11", -0.3, "Radiology & driving predicted to go first."), B("2021-12", 0.3, "Radiology deadline passes."), B("2025-08", 0.0, "Entry-level effects emerge."), B("2026-09", 0.1, "Aggregate employment holds; early-career pressure visible.")],
  "Both: task-level substitution concentrated in entry-level roles can coexist with stable aggregate employment and rising productivity.",
  "unresolved", "Unresolved; most displacement deadlines fall after 2026, and early specific calls failed.",
  ["mass-displacement", "productivity-roi"])

debate("xrisk", "Existential risk: serious vs overblown",
  "Does advanced AI pose existential risk requiring strong governance now?",
  ["society"],
  camp("serious", "Serious risk", "Loss of control and misuse could be catastrophic; governance must precede capability.",
       ["geoffrey-hinton", "yoshua-bengio", "dario-amodei", "demis-hassabis", "elon-musk", "ilya-sutskever"], ["Alignment is unsolved", "Capability may outpace control"],
       [F("2023-05", "CAIS extinction-risk statement.", "evt-2023-cais-statement"), F("2026-04", "Frontier cyber capabilities withheld (Glasswing).", "evt-2026-glasswing")]),
  camp("overblown", "Overblown / counter-productive", "X-risk is speculative; regulation entrenches incumbents and slows benefits.",
       ["yann-lecun", "marc-andreessen", "richard-sutton", "bill-gurley", "francois-chollet"], ["No credible path to rogue AI", "Open systems are safer"],
       [F("2024-09", "SB 1047 vetoed.", "evt-2024-sb1047-veto"), F("2026-06", "EU delays AI Act high-risk rules.", "evt-2026-eu-omnibus")]),
  [B("2014-10", 0.6, "Musk/Bostrom warnings are fringe."), B("2023-05", -0.2, "Hinton and Bengio join; CAIS statement."), B("2024-09", 0.1, "Regulatory pushback."), B("2026-06", -0.1, "Governments restrict frontier access on security grounds.")],
  "Both camps can be partly right: near-term misuse (cyber, bio) is real and governable, while long-term loss-of-control remains unobservable and contested.",
  "unresolved", "Not resolvable by observation; policy moved toward targeted security controls rather than broad licensing.",
  ["existential-risk", "open-safer"])

debate("centralized-vs-distributed", "Centralized compute vs efficiency & distributed inference",
  "Will AI stay concentrated in giant centralized clusters, or will efficiency gains shift it to cheaper, distributed and edge inference?",
  ["energy", "cloud", "inference"],
  camp("central", "Giant clusters", "GW-scale centralized clusters remain decisive for training and serving frontier models.",
       ["leopold-aschenbrenner", "sam-altman", "elon-musk", "jensen-huang"], ["Frontier needs ever-larger runs", "Inference demand is centralized"],
       [F("2025-10", "OpenAI GW-scale compute deals.", "evt-2025-compute-megadeals"), F("2026-04", "Capex guidance ~$700B+.", "evt-2026-capex-raise")]),
  camp("efficient", "Efficiency diffuses", "Architectural efficiency and open models push intelligence to cheaper hardware and the edge.",
       ["liang-wenfeng", "kai-fu-lee", "satya-nadella"], ["Efficiency gains outpace scale", "Small models suffice for most tasks"],
       [F("2025-01", "DeepSeek-R1 at a fraction of the cost.", "evt-2025-deepseek-r1"), F("2024-07", "GPT-4o mini makes GPT-4-class cheap.", "evt-2024-gpt4o-mini")]),
  [B("2023-08", -0.5, "H100 shortage centralizes."), B("2025-01", -0.1, "DeepSeek efficiency shock."), B("2026-04", -0.5, "Capex hits record; efficiency feeds demand (Jevons).")],
  "Both: efficiency gains are real, but they increase total demand (Jevons) — so efficiency and centralization reinforce rather than replace each other.",
  "leaning", "Leaning centralized through 2026; efficiency gains were absorbed by demand.",
  ["jevons", "power-binding", "infra-supercycle"])

debate("foundation-vs-app", "Foundation models vs application-layer differentiation",
  "Do durable moats sit with foundation-model providers or with applications built on them?",
  ["models", "apps", "economics"],
  camp("model", "Model labs win", "Frontier capability, not wrappers, captures value; labs move up-stack.",
       ["sam-altman", "dario-amodei", "elad-gil"], ["Capability gaps persist", "Labs control distribution via assistants"],
       [F("2026-09", "Labs reach ~$65–70B run-rates, much from their own apps and agents.", "evt-2026-lab-runrates")]),
  camp("app", "Apps differentiate", "Models commoditize; workflow, data and distribution create app moats.",
       ["cathie-wood", "marc-andreessen", "satya-nadella"], ["Models become interchangeable", "Workflow lock-in matters"],
       [F("2025-02", "Coding-agent applications become breakout businesses.", "evt-2025-claude-code"), F("2024-07", "Model prices collapse.", "evt-2024-gpt4o-mini")]),
  [B("2023-06", 0.2, "'Thin wrapper' fears vs app hype."), B("2025-02", 0.1, "Coding apps break out."), B("2026-09", -0.3, "Labs capture much of the agent/app value directly.")],
  "Both: commodity tiers favor applications; frontier tiers favor labs — the split follows the capability frontier.",
  "leaning", "Leaning to model labs at the cutoff, but the app layer's durability is not yet testable.",
  ["app-layer-value", "models-commoditize", "frontier-consolidates"])

debate("data-vs-reasoning", "Proprietary data vs general reasoning",
  "Will advantage come from proprietary data, or will general reasoning capability make data moats matter less?",
  ["data", "training"],
  camp("data", "Data decides capability", "The scale, curation and ownership of data (labeled, proprietary or national) determine who wins.",
       ["kai-fu-lee", "fei-fei-li"], ["Data is scarce and defensible"],
       [F("2009-06", "ImageNet: data scale unlocks vision.", "as-li-1"), F("2018-09", "'Age of data' favors China.", "as-lee-4")]),
  camp("reason", "General reasoning wins", "General methods and self-generated experience beat hand-curated proprietary data.",
       ["richard-sutton", "david-silver", "ilya-sutskever"], ["Self-play and RL generate data", "Generality transfers"],
       [F("2017-10", "AlphaGo Zero beats human-data systems with self-play.", "evt-2017-alphago-zero"), F("2024-09", "Reasoning models trained by RL on verifiable tasks.", "evt-2024-o1")]),
  [B("2012-09", -0.4, "Labeled data (ImageNet) is king."), B("2018-10", 0.0, "Self-supervised pretraining on public text."), B("2025-01", 0.4, "RL-generated reasoning data drives progress.")],
  "Both: proprietary data matters for enterprise workflows and evaluation, while general capability comes from public data plus self-generated experience.",
  "leaning", "Leaning to general reasoning for capability; proprietary data remains a deployment advantage.",
  ["data-wall", "rl-experience", "self-supervision"])

json.dump(DEB, open(f'{D}/debates.json', 'w'), indent=1, ensure_ascii=False)
print(len(DEB))
