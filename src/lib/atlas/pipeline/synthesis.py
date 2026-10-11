import os
HERE = os.path.dirname(os.path.abspath(__file__))
import json
D = os.path.join(HERE, '..', 'data')
def Q(id, q, a, items=None):
    d = {"id": id, "question": q, "answer": a}
    if items: d["items"] = [{"title": t, "body": b, "thinkers": th} for t, b, th in items]
    return d

QS = [
Q("headline", "In one paragraph", "Across 221 dated claims from 30 people, the most reliable causal model of AI from 2012 to 2026 was the Bitter Lesson's: general methods that convert compute into capability kept winning, value pooled in whoever controlled the scarce physical inputs, and falling unit costs expanded demand rather than shrinking it. The people who reasoned from that mechanism — researchers like Hassabis, Silver, Sutton and Karpathy, and builders like Huang and Nadella — were most often right; those who reasoned from deadlines (self-driving next year, AGI next year, radiologists in five years) were most often wrong. No single forecaster stands clearly above the rest once uncertainty is shown."),
Q("mistakes", "What were the five biggest mistakes in how influential people understood AI?",
  "The costliest errors were about timing and substitution, not about direction.",
  [("Capability ≠ deployment", "Treating benchmark or demo capability as imminent job or product substitution: radiologists (2016), robotaxis (2017–2025), 80% of doctors' work by 2025, agents 'joining the workforce' in 2025.", ["geoffrey-hinton", "elon-musk", "vinod-khosla", "sam-altman"]),
   ("'Deep learning is hitting a wall'", "Repeated declarations that scaling had stalled (2018–2022) — just before GPT-3, ChatGPT and GPT-4.", ["gary-marcus", "kai-fu-lee"]),
   ("The age of discovery is over", "The 2018 view that AI had moved from invention to implementation, so data and execution (not research) would decide winners — then came transformers at scale, RLHF and reasoning models.", ["kai-fu-lee"]),
   ("Selling the shovels too early", "Exiting Nvidia (SoftBank 2019, ARK 2023) on valuation grounds, underestimating how long compute scarcity would last.", ["masayoshi-son", "cathie-wood"]),
   ("Open source will lead the frontier", "Expecting open models to become the most advanced (Llama in 2025); open weights trailed by months and the leading open champion retreated.", ["mark-zuckerberg"])]),
Q("insights", "What were the five most consequential insights that turned out to be correct?",
  "Each is a mechanism, not a date.",
  [("General methods + compute win", "The Bitter Lesson (2019) and the 2014–2020 scaling bets anticipated a decade of progress.", ["richard-sutton", "ilya-sutskever", "dario-amodei", "geoffrey-hinton"]),
   ("Search and RL on top of learned models", "AlphaGo-style search + learning foreshadowed 2024–25 reasoning models and inference-time scaling.", ["david-silver", "demis-hassabis", "francois-chollet"]),
   ("Compute, then power, is the bottleneck", "Accelerated computing, then energy, as the binding constraint (2024) — validated by GW-scale planning in 2025–26.", ["jensen-huang", "mark-zuckerberg", "leopold-aschenbrenner"]),
   ("Cheaper intelligence expands demand", "~10x/yr cost declines plus Jevons dynamics explained why efficiency shocks (DeepSeek) raised rather than cut spending.", ["sam-altman", "satya-nadella"]),
   ("Software is automated first", "Software 2.0 / 'English is the new programming language' anticipated coding as the first transformed profession.", ["andrej-karpathy", "jensen-huang"])]),
Q("early", "Which thinkers were early, and which were merely eventually correct?",
  "Early (right before consensus, for stated reasons): Sutskever and Hinton on scaling neural nets (2012–2014); Fei-Fei Li on data scale (2009); Silver/Hassabis on search + RL (2016); Sutton's Bitter Lesson (2019); Karpathy on Software 2.0 (2017); Liang Wenfeng on closed-source moats being temporary (2024); Aschenbrenner on GW clusters and power (2024). Eventually correct, after the evidence was in: Pichai's generative launch (reactive, 2023), Zuckerberg's pivot from metaverse to AI (2023), Chollet's revised view of LLM-based search after o3 (2024), Son's AI conviction (stated, re-dated, then funded). Premature: Khosla, Hinton (radiology) and Kai-Fu Lee on labor displacement — directionally plausible, years early."),
Q("causal", "Which individuals demonstrated the best causal understanding of AI?",
  "The strongest causal models explained why something would happen and kept working out of sample: Sutton (compute-leveraging general methods), Silver and Hassabis (learning + search), Sutskever (scale + data, then the data limit), Huang (parallel compute + software ecosystem as the bottleneck), Nadella (Jevons and distribution) and Karpathy (what LLMs are actually good at). Chollet's measurement critique (skill ≠ intelligence) is the best causal account of where systems remain brittle. Several of these records are too short in scorable claims to rank precisely — the leaderboard shows overlapping intervals.",
  [("Mechanism over deadline", "Thinkers who stated mechanisms (scaling laws, Jevons, search) scored far better than those who stated dates.", ["richard-sutton", "david-silver", "jensen-huang", "satya-nadella"])]),
Q("updaters", "Which individuals changed their beliefs most intelligently?",
  "Bengio (2023: from distant timelines to near-term risk, explicitly citing new evidence, and redirecting his research), Hinton (2023 risk/timeline revision; conceded the radiology call), Sutskever (declaring the end of the 'age of scaling' he had championed), Chollet (calling o3 a genuine breakthrough without abandoning his definition), Karpathy (from 'agents don't work' to 'threshold of coherence' within three months, with reasons), and Cahn (from revenue gap to physical build-out). Weakest updaters re-dated predictions without acknowledging misses (Musk, Son)."),
Q("underestimated", "What has consistently been underestimated?",
  "Four things: (1) how far the same transformer recipe would go once combined with RL and search; (2) the speed of cost decline for a fixed capability (~10x per year) and the demand it unlocks; (3) physical constraints — power, grid, HBM and packaging — as the true bottleneck; (4) how quickly efficient challengers (DeepSeek, Qwen) could close the gap with far less compute."),
Q("overestimated", "What has consistently been overestimated?",
  "The speed of deployment and substitution in the physical and institutional world: autonomous driving, robotics, enterprise ROI from generic pilots, labor displacement and regulatory coordination. Also overestimated: the durability of any single lab's lead, and the likelihood that open models would lead the frontier."),
Q("value-shift", "How has the expected source of value shifted through the AI stack?",
  "2012–16: algorithms and talent (acqui-hires, DeepMind). 2017–21: data and research labs. 2022–23: foundation models and GPUs. 2024–25: chips, clouds and power (Nvidia, hyperscaler capex, nuclear PPAs). 2026: frontier labs as platforms (tens of billions in revenue) and agents, with power the binding constraint. Expected value repeatedly ran ahead of captured value at the layer above — applications were always 'next'."),
Q("consensus-wrong", "Which consensus assumptions in October 2026 are most likely to be wrong?",
  "Candidates, with the reasoning that makes each fragile: (1) that the capex trajectory self-finances — revenue still trails annual capex several-fold; (2) that frontier pricing power is durable — every prior tier commoditized within ~12 months; (3) that power is the permanent binding constraint — efficiency and siting may relieve it faster than expected; (4) that agents will generalize from coding to all knowledge work on coding's timeline — coding is unusually verifiable; (5) that AGI is a single threshold event rather than jagged, domain-by-domain capability."),
Q("retain-discard", "Which ideas should be retained — and which discarded — in a mental model for the next decade?",
  "Retain mechanism-level ideas with out-of-sample records: the Bitter Lesson (Sutton), search + learning (Silver, Hassabis), scaling with data limits (Sutskever), Jevons dynamics (Nadella, Altman), compute/power as the bottleneck (Huang, Aschenbrenner), skill ≠ intelligence (Chollet), and Software 2.0 (Karpathy). Discard deadline-driven extrapolation, 'X is hitting a wall' declarations, and the assumption that capability translates directly into substitution."),
]

MM = {
 "title": "Compute-driven capability, jagged deployment, migrating value",
 "principles": [
  {"id": "p1", "title": "General methods + compute keep winning — but the compute moves", "body": "Expect capability to keep tracking effective compute, with the marginal compute shifting from pretraining to RL, search and inference. Bet on mechanisms that convert compute into capability, not on a fixed recipe.", "from": ["richard-sutton", "ilya-sutskever", "david-silver", "dario-amodei"], "confidence": "high"},
  {"id": "p2", "title": "Unit cost collapses, total spend rises", "body": "Price for a fixed capability falls ~10x per year; demand expands faster (Jevons). Efficiency shocks raise total compute demand unless capability stops mattering.", "from": ["sam-altman", "satya-nadella", "jensen-huang"], "confidence": "high"},
  {"id": "p3", "title": "The binding constraint is physical", "body": "Chips, HBM, packaging and above all power and permitted sites gate the build-out. Strategic control points are physical and capital-intensive; algorithms diffuse within months.", "from": ["jensen-huang", "mark-zuckerberg", "leopold-aschenbrenner"], "confidence": "high"},
  {"id": "p4", "title": "Capability is jagged; measure adaptation, not benchmarks", "body": "Superhuman on tests and brittle on novelty can coexist. Judge progress by task horizons and adaptation to genuinely new problems.", "from": ["francois-chollet", "sundar-pichai", "andrej-karpathy"], "confidence": "medium"},
  {"id": "p5", "title": "Deployment is slower than capability — except where outputs are verifiable", "body": "Coding moved first because correctness is checkable; expect domains with verifiable outputs to follow, and institutions (health, law, transport) to lag by years.", "from": ["andrej-karpathy", "satya-nadella", "reid-hoffman"], "confidence": "medium"},
  {"id": "p6", "title": "Frontier leads are rented, not owned", "body": "Open and efficient challengers trail by months. Durable advantage comes from capital, distribution, proprietary feedback loops and trust — not from a model.", "from": ["liang-wenfeng", "elad-gil", "marc-andreessen"], "confidence": "medium"},
  {"id": "p7", "title": "Value migrates upward in sequence", "body": "Chips → clouds → frontier labs → agents/outcomes. Each layer captures value only once the layer below is abundant; watch for the layer that is becoming abundant next.", "from": ["david-cahn", "satya-nadella", "cathie-wood"], "confidence": "medium"},
  {"id": "p8", "title": "The next discontinuity is likely an addition, not a replacement", "body": "Memory, continual learning, experiential RL and world models will most likely arrive as components of LLM-based systems — as reasoning did — rather than as a clean paradigm swap.", "from": ["demis-hassabis", "yann-lecun", "david-silver", "ilya-sutskever"], "confidence": "low"},
 ],
 "discard": [
  {"idea": "Deadline extrapolation ('next year')", "heldBy": ["elon-musk", "masayoshi-son"], "why": "The worst-performing claims in the dataset are dated capability-to-deployment promises."},
  {"idea": "'Scaling is hitting a wall'", "heldBy": ["gary-marcus"], "why": "Declared repeatedly before each major jump; capability kept rising (reliability critiques remain valid)."},
  {"idea": "Capability implies immediate substitution", "heldBy": ["geoffrey-hinton", "vinod-khosla", "kai-fu-lee"], "why": "Radiology, medicine and labor calls failed on timing; institutions and liability slow deployment."},
  {"idea": "One open (or closed) model will own the frontier", "heldBy": ["mark-zuckerberg"], "why": "Leads lasted months; both open and closed champions were overtaken."},
 ],
 "assumptions": ["No severe financial or power shock interrupts the build-out", "No regulatory freeze on frontier development", "Historical relationships (compute→capability, price→demand) persist through 2030", "The research record sampled here is representative of each thinker's views"],
 "uncertainties": ["Whether AI revenue closes the capex gap before financing tightens", "Whether continual learning or world models produce a genuine discontinuity", "Whether agent reliability generalizes beyond verifiable domains", "Geopolitics: export controls, China's compute access, government control of frontier models", "Labor-market effects beyond entry-level knowledge work"],
}
json.dump({"questions": QS, "mentalModel": MM}, open(f'{D}/synthesis.json', 'w'), indent=1, ensure_ascii=False)

METHOD = {
 "exclusions": [
  {"name": "Greg Brockman", "cohort": "builders", "why": "Thesis and public record overlap heavily with Altman's; less independent documented forecasting."},
  {"name": "Lisa Su", "cohort": "builders", "why": "Major allocator (AMD) but a thinner corpus of falsifiable AI predictions."},
  {"name": "Arthur Mensch", "cohort": "builders", "why": "Influential European open-weight builder; shorter record (2023–) and overlap with the open-weights camp already covered."},
  {"name": "Alexandr Wang", "cohort": "builders", "why": "Important data-layer builder, but few dated theses beyond Scale AI positioning."},
  {"name": "Ashish Vaswani", "cohort": "researchers", "why": "Foundational (Transformer) but a sparse public record of predictions; represented via the Transformer technology node."},
  {"name": "Jared Kaplan", "cohort": "researchers", "why": "Scaling-laws author; overlaps with Amodei/Anthropic; represented via the scaling-laws event."},
  {"name": "Noam Shazeer", "cohort": "researchers", "why": "Architectural contributions (Transformer, MoE) with few public forecasts."},
  {"name": "Ben Horowitz", "cohort": "investors", "why": "Same firm and largely the same public theses as Andreessen."},
  {"name": "Peter Thiel", "cohort": "investors", "why": "Few AI-specific falsifiable claims relative to his influence."},
  {"name": "Sarah Guo", "cohort": "investors", "why": "Active AI investor; dated predictions are mostly portfolio commentary since 2022."},
  {"name": "Naval Ravikant", "cohort": "investors", "why": "Aphoristic, largely non-falsifiable statements."},
  {"name": "Michael Burry / Mary Meeker / David Sacks", "cohort": "investors", "why": "Respectively: short-horizon trades rather than AI theses; trend documentation rather than predictions; policy role rather than investment theses."},
 ],
 "biases": [
  "Anglophone, US-centric selection: only two China-based voices (Liang Wenfeng, Kai-Fu Lee) and no European or Indian builders.",
  "No women in the builders or investors cohorts and one among researchers (Fei-Fei Li) — a reflection of who held these roles, which also narrows the range of views.",
  "Survivorship: people were selected partly because they became prominent, which favors those whose bets worked.",
  "Claim selection: assertions were chosen as each person's most consequential documented claims; prolific speakers (Altman, Musk, Marcus) have more scorable claims than reticent ones (Sutton, Liang).",
  "Corporate messaging: CEOs' statements often double as marketing; the dataset labels strategic actions separately and never treats an investment as proof of belief.",
  "Hindsight: verdict rationales were written to judge claims on information available at the time, but the analyst knows the outcomes.",
 ],
 "limitations": [
  "Research ran under a network proxy that blocked direct page fetches, and a shared search quota was exhausted mid-research. About 55% of evidence records are 'unverified recall' and are flagged everywhere; a follow-up verification pass is the top data-quality priority.",
  "Half of all assertions (111 of 221) are unresolved at the cutoff, so foresight scores rest on 3–7 scorable claims per person; intervals are wide and ties are common.",
  "Seven people (Gurley, Gil, Son, Wood, Bengio, Sutton and LeCun) have fewer than 3 scorable claims and are shown but not ranked.",
  "Period 'heat' values and debate 'balance' values are analyst readings of the record, not measured quantities.",
  "2026 developments come from news reporting via search snippets; some figures (lab run-rates, capex) vary by source.",
  "Some 2026 events in this dataset (e.g. model names, the Mythos access order) are reported from search results and could not be cross-checked against primary documents.",
 ],
 "periodRevisions": [
  "2012–16 effectively ends with the Transformer (June 2017), not December 2016; kept on calendar years for readability.",
  "2022–23: technical shifts (Chinchilla, InstructGPT, H100, export controls) precede ChatGPT; ChatGPT (Nov 30, 2022) is the break for adoption, capital and policy.",
  "The reasoning era starts with OpenAI o1 (Sept 2024), not January 2025; 2024's snapshot therefore already includes inference-time scaling.",
  "The 2026 period could reasonably start in December 2025 (Gemini 3, credit stress, preemption EO).",
 ],
 "audit": [
  {"date": "2026-10-11", "finding": "Signing the 2023 pause letter (Bengio) was coded as an 'incorrect' action.", "action": "Reclassified as an aspiration (advocacy); shown but not scored."},
  {"date": "2026-10-11", "finding": "Altman's 'novel insights in 2026' was scored correct on contested reports.", "action": "Confidence lowered to low (halves its weight)."},
  {"date": "2026-10-11", "finding": "Bootstrap intervals over 3–7 claims looked implausibly tight.", "action": "Added a small-sample widening term; most top ranks are now reported as ties."},
  {"date": "2026-10-11", "finding": "55% of evidence could not be re-verified against sources.", "action": "Flagged as 'unverified recall' in every view; evidence-grade filter added to the courtroom; no recalled text shown as a verbatim quote."},
  {"date": "2026-10-11", "finding": "Duplicate evidence ids across research batches (outcome sources).", "action": "Renamed with batch suffixes; all references re-pointed."},
  {"date": "2026-10-11", "finding": "Several landmark verdicts admit two readings (Hinton radiology, Marcus 'wall', Amodei 90% code, Chollet on LLMs).", "action": "Added competing interpretations to each case file."},
  {"date": "2026-10-11", "finding": "Musk's last place is robust across all five weightings; the top ~11 ranks are not.", "action": "Leaderboard reports 'no clear winner' when top intervals overlap; sensitivity table shows rank ranges."},
 ],
}
json.dump(METHOD, open(f'{D}/method.json', 'w'), indent=1, ensure_ascii=False)
print('ok')
