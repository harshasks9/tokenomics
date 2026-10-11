# AI Intelligence Atlas — research output schema (context agents)

Research cutoff: 2026-10-11 (today). Nothing after it. Never fabricate facts, numbers, dates or URLs; mark
anything not re-confirmed this session as verification "recalled" and list it in gaps.

Write ONE JSON file:
{
  "agent": "<name>",
  "events": [ Event, ... ],
  "periods": [ Period, ... ],
  "metrics": [ Metric, ... ],
  "evidence": [ Evidence, ... ],      // same Evidence shape as SCHEMA.md; ids "ev-ctx-<n>" (agent A) / "ev-ctx2-<n>" (agent B)
  "gaps": [ "..." ]
}

Layer ids: energy, semis, cloud, data, architecture, training, inference, models, platforms, agents, apps, distribution, economics, society
(1 Energy & physical infra, 2 Semiconductors, 3 Cloud & compute, 4 Data, 5 Model architecture, 6 Training & learning,
 7 Inference & economics, 8 Foundation models, 9 Platforms & tooling, 10 Agents & reasoning, 11 Applications,
 12 Distribution, 13 Economics & moats, 14 Society & governance)

## Event — a turning point that changed what people could know or do
{
  "id": "evt-<yyyy>-<slug>",
  "date": "YYYY-MM-DD" | "YYYY-MM",
  "title": "AlexNet wins ImageNet (ILSVRC 2012)",
  "kind": "research" | "model" | "product" | "infra" | "capital" | "policy" | "market" | "org",
  "layers": [layer ids],
  "summary": "1–2 sentences: what happened (fact).",
  "significance": "1 sentence: why it changed thinking (interpretation).",
  "magnitude": 1-5,                   // 5 = era-defining
  "evidenceIds": ["ev-ctx-..."]
}
Aim for 35–60 events in your range, balanced across layers (incl. energy, chips, capital, policy, not only models).

## Period — snapshot of the AI stack as understood AT THE TIME
{
  "id": "p2012" | "p2017" | "p2020" | "p2022" | "p2024" | "p2025" | "p2026",
  "label": "Deep learning becomes practical",
  "range": ["2012-01", "2016-12"],
  "boundaryRationale": "Why the period starts/ends where it does (event-driven; propose revisions to the reference ranges if research supports it).",
  "consensus": "Dominant industry/intellectual consensus at the time (2–4 sentences, no hindsight).",
  "minorityViews": [ { "view": "...", "heldBy": "names", "laterImportance": "how it mattered later (hindsight, labeled)" } ],
  "technologies": ["what existed and mattered"],
  "architectures": ["dominant model architectures"],
  "bottlenecks": [ { "item": "...", "kind": "technical" | "commercial" | "physical" | "regulatory", "note": "..." } ],
  "perceivedAdvantage": ["where people BELIEVED competitive advantage resided then"],
  "actualAdvantage": ["where value actually accrued in hindsight (as of 2026-10-11), with evidence"],
  "investment": "Distribution of investment & attention with sourced numbers where available.",
  "layers": { "<layerId>": { "state": "1 sentence state of this layer in the period", "heat": 0-3 } },  // all 14 layers; heat = how much attention/investment it got (0 none – 3 central)
  "commoditized": ["things that looked structurally important then but later commoditized"],
  "underestimated": ["things initially underestimated"],
  "evidenceIds": [...]
}

## Metric — quantitative series for charts (only sourced values)
{
  "id": "m-<slug>",                    // e.g. m-nvidia-dc-revenue, m-hyperscaler-capex, m-openai-revenue, m-token-price-gpt4-class
  "label": "NVIDIA data center revenue (fiscal year)",
  "unit": "USD bn" | "USD per 1M tokens" | "%" | "GW" | ...,
  "layer": "<layer id>",
  "points": [ { "date": "YYYY" | "YYYY-MM", "value": 47.5, "evidenceId": "ev-ctx-..", "note": "FY2024 ended Jan 2024" } ],
  "caveat": "definitions/comparability caveats"
}
