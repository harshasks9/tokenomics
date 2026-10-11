import os
HERE = os.path.dirname(os.path.abspath(__file__))
import json
D = os.path.join(HERE, '..', 'data')
def Q(id, q, a, items=None):
    d = {"id": id, "question": q, "answer": a}
    if items: d["items"] = [{"title": t, "body": b, "thinkers": th} for t, b, th in items]
    return d

QS = [
Q("headline", "In one paragraph", "Of 221 dated claims from 30 people, only 88 could be fairly scored by October 2026: 117 have deadlines that have not arrived, and 21 are announcements of the speaker's own results, investments or advocacy, which are shown but not counted as foresight. On that thin record the most reliable causal model was a mechanism, not a person: general methods that convert compute into capability kept winning, value pooled in whoever controlled scarce physical inputs (chips, memory, power), and falling unit costs expanded demand rather than shrinking it. Among the eleven people with enough scorable evidence, Huang, Altman, Nadella, Aschenbrenner and Chollet lead with overlapping uncertainty intervals — no single winner is justified — and Musk's dated deployment promises are the one clearly separated result, at the bottom."),
Q("mistakes", "What were the five biggest mistakes in how influential people understood AI?",
  "The costliest errors were about timing and substitution, not about direction.",
  [("Capability ≠ deployment", "Treating benchmark or demo capability as imminent job or product substitution: radiologists (2016), robotaxis (2017–2025), 80% of doctors' work by 2025, 90% of code within 3–6 months (2025).", ["geoffrey-hinton", "elon-musk", "vinod-khosla", "dario-amodei"]),
   ("'Deep learning is hitting a wall'", "Declaring in March 2022 that scaling had stalled — months before ChatGPT and a year before GPT-4. (The reliability critique inside it held up better than the headline.)", ["gary-marcus"]),
   ("The age of discovery is over", "The 2018 view that AI had moved from invention to implementation, so data and execution (not research) would decide winners — then came transformers at scale, RLHF and reasoning models.", ["kai-fu-lee"]),
   ("Reliability on schedule", "Expecting reliability problems to be solved on a short clock: hallucinations 'largely eliminated by 2025', fully autonomous driving within a year, agents joining the workforce in 2025.", ["mustafa-suleyman", "elon-musk", "sam-altman"]),
   ("Open source will lead the frontier", "Expecting open models to become the most advanced (Llama in 2025); open weights trailed by months and the leading open champion retreated.", ["mark-zuckerberg"])]),
Q("insights", "What were the five most consequential insights that turned out to be correct?",
  "Each is a mechanism, not a date. Several were first shown by their authors' own results — those results are recorded as track record and not scored as forecasts — but the generalizations drawn from them were forward-looking and held.",
  [("General methods + compute win", "The Bitter Lesson (2019) and the 2014–2020 scaling bets anticipated a decade of progress.", ["richard-sutton", "ilya-sutskever", "dario-amodei"]),
   ("Search and RL on top of learned models", "AlphaGo-style search + learning, generalized beyond games, foreshadowed 2024–25 reasoning models and inference-time scaling.", ["david-silver", "demis-hassabis", "francois-chollet"]),
   ("Compute, then power and memory, are the bottleneck", "Accelerated computing, then energy alongside HBM and packaging, as the binding constraints — borne out partly by GW-scale planning in 2025–26.", ["jensen-huang", "mark-zuckerberg", "leopold-aschenbrenner"]),
   ("Cheaper intelligence expands demand", "~10x/yr cost declines plus Jevons dynamics explained why efficiency shocks (DeepSeek) raised rather than cut spending.", ["sam-altman", "satya-nadella"]),
   ("Software is automated first", "Software 2.0 / 'English is the new programming language' anticipated coding as the first transformed profession.", ["andrej-karpathy", "jensen-huang"])]),
Q("early", "Which thinkers were early, and which were merely eventually correct?",
  "Early (right before consensus, for stated reasons): Sutskever on scaling big networks (2014); Fei-Fei Li on data scale (2009); Sutton's Bitter Lesson (2019); Karpathy on Software 2.0 (2017) and English as a programming language (2023); Huang on AI 'eating software' (2017). On time rather than early: Liang Wenfeng on closed-source moats being temporary (2024) and Aschenbrenner on GW-scale clusters (2024) — right, but stated as the trend became visible. Eventually correct, after the evidence was in: Pichai's generative launch (reactive, 2023), Chollet's revised view of LLM-based search after o3 (2024), Cahn's shift from the revenue gap to the physical build-out (2024). Premature: Khosla (80% of doctors' work by 2025), Hinton (radiologists), Amodei (90% of code in 3–6 months) and Musk (robotaxis) — directionally plausible, years early. Many of the boldest long-horizon calls (Kai-Fu Lee and Khosla on jobs, Son and Aschenbrenner on AGI) are still unresolved."),
Q("causal", "Which individuals demonstrated the best causal understanding of AI?",
  "Among those with enough scorable evidence, the highest 'right for the right reasons' scores go to Altman (cost curves and scaling economics), Chollet (skill ≠ intelligence; test-time adaptation as the missing piece), Huang (parallel compute and software ecosystem as the bottleneck) and Aschenbrenner (counting orders of magnitude of compute, power and capex). Nadella's Jevons-and-distribution model scored well on accuracy but is thinner on stated mechanism. Several of the most influential mechanism-level ideas come from people whose scorable records are too thin to rank: Sutton's Bitter Lesson rests on two claims from one essay, and Hassabis's and Silver's strongest evidence is their own demonstrated results, which the Atlas records as track record rather than forecasts. Their ideas are retained in the mental model on the strength of what later happened to them (reasoning models, RL post-training), not on a foresight score.",
  [("Mechanism vs deadline — a weaker effect than it looks", "Dated capability-to-deployment promises produced the dataset's worst misses, but most of them are Musk's. Excluding his claims, dated and undated scorable claims score almost the same (≈0.66 vs ≈0.67 weighted accuracy in the audit). The lesson is narrower: deployment deadlines are where forecasts fail, not dates as such.", ["elon-musk", "vinod-khosla", "geoffrey-hinton"])]),
Q("updaters", "Which individuals changed their beliefs most intelligently?",
  "Bengio (2023: from distant timelines to near-term risk, explicitly citing new evidence, and redirecting his research), Hinton (2023 risk/timeline revision; conceded the radiology call), Sutskever (declaring the end of the 'age of scaling' he had championed), Chollet (calling o3 a genuine breakthrough without abandoning his definition), Karpathy (from 'agents don't work' to 'threshold of coherence' within three months, with reasons), and Cahn (from revenue gap to physical build-out). Weakest updaters re-dated predictions without acknowledging misses (Musk, Son)."),
Q("underestimated", "What has consistently been underestimated?",
  "Four things: (1) how far the same transformer recipe would go once combined with RL and search; (2) the speed of cost decline for a fixed capability (~10x per year) and the demand it unlocks; (3) physical constraints — power, grid, HBM and packaging — as co-equal bottlenecks; (4) how quickly efficient challengers (DeepSeek, Qwen) could close the gap with far less compute."),
Q("overestimated", "What has consistently been overestimated?",
  "The speed of deployment and substitution in the physical and institutional world: autonomous driving, robotics, enterprise ROI from generic pilots, labor displacement and regulatory coordination. Also overestimated: the durability of any single lab's lead, and the likelihood that open models would lead the frontier."),
Q("value-shift", "How has the expected source of value shifted through the AI stack?",
  "2012–16: algorithms and talent (acqui-hires, DeepMind). 2017–21: data and research labs. 2022–23: foundation models and GPUs. 2024–25: chips, clouds and power (Nvidia, hyperscaler capex, nuclear PPAs). 2026: frontier labs as platforms (tens of billions in revenue) and agents, with power the binding constraint. Expected value repeatedly ran ahead of captured value at the layer above — applications were always 'next'."),
Q("consensus-wrong", "Which consensus assumptions in October 2026 are most likely to be wrong?",
  "Candidates, with the reasoning that makes each fragile: (1) that the capex trajectory self-finances — revenue still trails annual capex several-fold; (2) that frontier pricing power is durable — every prior tier commoditized within ~12 months; (3) that power is the permanent binding constraint — efficiency and siting may relieve it faster than expected; (4) that agents will generalize from coding to all knowledge work on coding's timeline — coding is unusually verifiable; (5) that AGI is a single threshold event rather than jagged, domain-by-domain capability."),
Q("retain-discard", "Which ideas should be retained — and which discarded — in a mental model for the next decade?",
  "Retain mechanism-level ideas whose later history held up: the Bitter Lesson (Sutton), search + learning (Silver, Hassabis), scaling with data limits (Sutskever), Jevons dynamics (Nadella, Altman), compute, memory and power as bottlenecks (Huang, Aschenbrenner), skill ≠ intelligence (Chollet), and Software 2.0 (Karpathy). Discard deployment-deadline extrapolation, 'X is hitting a wall' declarations, and the assumption that capability translates directly into substitution. Treat this as provisional: more than half of the claims behind it are still unresolved."),
]

MM = {
 "title": "Compute-driven capability, jagged deployment, migrating value",
 "principles": [
  {"id": "p1", "title": "General methods + compute keep winning — but the compute moves", "body": "Expect capability to keep tracking effective compute, with the marginal compute shifting from pretraining to RL, search and inference. Bet on mechanisms that convert compute into capability, not on a fixed recipe.", "from": ["richard-sutton", "ilya-sutskever", "david-silver", "dario-amodei"], "confidence": "medium"},
  {"id": "p2", "title": "Unit cost collapses, total spend rises", "body": "Price for a fixed capability falls ~10x per year; demand expands faster (Jevons). Efficiency shocks raise total compute demand unless capability stops mattering.", "from": ["sam-altman", "satya-nadella", "jensen-huang"], "confidence": "high"},
  {"id": "p3", "title": "The binding constraints are physical", "body": "Chips, HBM, packaging, power and permitted sites jointly gate the build-out. Strategic control points are physical and capital-intensive; algorithms diffuse within months.", "from": ["jensen-huang", "mark-zuckerberg", "leopold-aschenbrenner"], "confidence": "high"},
  {"id": "p4", "title": "Capability is jagged; measure adaptation, not benchmarks", "body": "Superhuman on tests and brittle on novelty can coexist. Judge progress by task horizons and adaptation to genuinely new problems.", "from": ["francois-chollet", "sundar-pichai", "andrej-karpathy"], "confidence": "medium"},
  {"id": "p5", "title": "Deployment is slower than capability — except where outputs are verifiable", "body": "Coding moved first because correctness is checkable; expect domains with verifiable outputs to follow, and institutions (health, law, transport) to lag by years.", "from": ["andrej-karpathy", "satya-nadella", "reid-hoffman"], "confidence": "medium"},
  {"id": "p6", "title": "Frontier leads are rented, not owned", "body": "Open and efficient challengers trail by months. Durable advantage comes from capital, distribution, proprietary feedback loops and trust — not from a model.", "from": ["liang-wenfeng", "elad-gil", "marc-andreessen"], "confidence": "medium"},
  {"id": "p7", "title": "Value migrates upward in sequence", "body": "Chips → clouds → frontier labs → agents/outcomes. Each layer captures value only once the layer below is abundant; watch for the layer that is becoming abundant next.", "from": ["david-cahn", "satya-nadella", "cathie-wood"], "confidence": "medium"},
  {"id": "p8", "title": "The next discontinuity is likely an addition, not a replacement", "body": "Memory, continual learning, experiential RL and world models will most likely arrive as components of LLM-based systems — as reasoning did — rather than as a clean paradigm swap.", "from": ["demis-hassabis", "yann-lecun", "david-silver", "ilya-sutskever"], "confidence": "low"},
 ],
 "discard": [
  {"idea": "Deployment-deadline extrapolation ('next year')", "heldBy": ["elon-musk"], "why": "The worst-performing claims in the dataset are dated capability-to-deployment promises."},
  {"idea": "'Scaling is hitting a wall'", "heldBy": ["gary-marcus"], "why": "Declared repeatedly before each major jump; capability kept rising (reliability critiques remain valid)."},
  {"idea": "Capability implies immediate substitution", "heldBy": ["geoffrey-hinton", "vinod-khosla", "dario-amodei"], "why": "Radiology, medicine and code-share calls failed on timing; institutions, liability and workflow change slow deployment."},
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
  "117 of 221 assertions are unresolved at the cutoff and 21 more are shown but unscored (self-demonstrated results, investments, advocacy, governance acts), leaving 88 scorable claims. Only 11 of the 30 people clear the ranking threshold (≥3 scorable claims and ≥1.0 total evidential weight); the other 19 are shown as provisional.",
  "Known missing claims flagged by the audit, to add after verification: Marcus's dated 2024/2025 calls, LeCun's 'GPT-5000' remark, Cathie Wood's Tesla robotaxi targets, Musk's power-shortage and Austin robotaxi statements, and other high-profile claims that could shift rankings.",
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
  {"date": "2026-10-11", "finding": "Musk's last place is robust across all five weightings; the top ranks are not.", "action": "Leaderboard reports 'no clear winner' when top intervals overlap; sensitivity table shows rank ranges."},
  {"date": "2026-10-11", "finding": "[Independent audit f2/f3] The top two ranks (Hassabis, Silver) rested on announcements of their own demonstrated results (AlphaGo counted twice), and Hassabis ranked on an effective weight of 1.45 — below the shrinkage prior.", "action": "Self-demonstrated results, investments, advocacy and governance acts are now shown but unscored (21 claims); ranking also requires ≥1.0 total evidential weight. Hassabis and Silver move to provisional."},
  {"date": "2026-10-11", "finding": "[f1] Hassabis's 'Isomorphic drugs in trials by end-2025' was past its deadline but left unresolved.", "action": "Resolved incorrect at low confidence (flips if a 2025 first dosing is documented)."},
  {"date": "2026-10-11", "finding": "[f10/f11] Inconsistent grading: Amodei's 90%-of-code overshoot was partial while comparable misses were incorrect; the power-not-chips claim was graded three ways.", "action": "Amodei → incorrect (premature); Zuckerberg's power claim → partial, on-time, matching Aschenbrenner's."},
  {"date": "2026-10-11", "finding": "[f12–f14, f18] Claims with horizons after the cutoff (Huang 2027, Amodei 2027, Son 2029) or posed as open questions (Gil) carried resolved verdicts.", "action": "Set to unresolved."},
  {"date": "2026-10-11", "finding": "[f15, f16, f4, f30] Date issues: Hinton's 10-year hedge ends Nov 2026; Liang's GPU purchase was ~2021; Hassabis's AlphaFold claim was dated at its own result; Huang's export-control record bundles three dates.", "action": "Rationale rewritten; Liang redated to 2021 with originality lowered; AlphaFold claim treated as track record; Huang bundling noted."},
  {"date": "2026-10-11", "finding": "[f20–f23] Synthesis overreach: the mechanism-beats-deadline effect largely disappears without Musk; Lee and Son were named for unresolved or absent claims; Sutton praised on two claims; Liang/Aschenbrenner labeled early though coded on-time.", "action": "Synthesis rewritten to match the data and to separate retained ideas from foresight scores."},
  {"date": "2026-10-11", "finding": "[f24–f29] Thesis/debate labels: power-binding and benchmarks-not-intelligence overstated as validated; a contradicting radiology step labeled partial; one debate status inconsistent; two camp placements questionable.", "action": "Both theses → partial; step → contested; foundation-vs-app → leaning; data camp relabeled; Pichai moved to the build-out camp."},
 ],
}
json.dump(METHOD, open(f'{D}/method.json', 'w'), indent=1, ensure_ascii=False)
print('ok')
