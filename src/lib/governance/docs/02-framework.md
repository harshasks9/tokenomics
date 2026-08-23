# Deliverable 2 — The AI Governance Framework

## The framework

**Seven layers × one operating loop, at three depths.**

| # | Layer | The question it answers |
|---|---|---|
| 1 | Enterprise Governance | Who is accountable for AI — and for which AI? |
| 2 | Data Governance | What is the AI allowed to know? |
| 3 | Model Governance | Which models do we trust — and how do we know? |
| 4 | Application Governance | Does the system behave — and can we prove it? |
| 5 | Agent Governance | What may AI do on its own — and who can stop it? |
| 6 | Runtime Security & Observability | What is happening right now — and would we notice? |
| 7 | People Governance | What are our people doing with AI today? |

Every layer runs the same **operating loop**: *set policy → gate the lifecycle → enforce
at runtime → prove it with evidence.* The loop is the process dimension (NIST's
Govern–Map–Measure–Manage, ISO 42001's clauses); the layers are the asset dimension
(the things an enterprise actually manages and staffs).

Every topic is written at **three depths**: L1 Executive (30 seconds: stakes, the risk in
one line, decisions only leadership can make), L2 Practitioner (controls, owners,
processes, what good looks like), L3 Technical (enforcement points, mechanisms,
monitoring and audit).

**Central thesis:** *policy must compile.* Governance that lives in documents fails at
machine speed; it works when each policy statement names the platform control that
enforces it. The differentiating layers in 2026 are runtime enforcement (6) and agent
governance (5) — which is also where the incident record concentrates.

## Why this is the right taxonomy

1. **It matches how enterprises are organized.** Each layer has a natural owner (CEO/
   council; CDO; platform/risk; product engineering; platform+security; CISO; CIO/HR) —
   unlike purely process-shaped frameworks, which cut across every org chart and
   therefore default to committees.
2. **It separates what regulators merge and merges what they separate.** Regulation
   arrives by risk tier and by artifact (model vs. system). Enterprises operate by asset
   class. The layers absorb any regime: EU deployer duties land in layers 1/4/6; GPAI
   transparency in 3; literacy in 7 — one program serves every jurisdiction.
3. **Agents get their own layer.** The research is unambiguous that agent governance is
   qualitatively different (identity, delegated authority, memory, budgets, kill
   switches) and is where maturity is lowest and buying decisions are being made.
   Frameworks that treat agents as a footnote to applications misprice the risk.
4. **Runtime is promoted to a first-class layer.** Gartner TRiSM, Forrester AEGIS, and
   SAIF converge on runtime inspection/enforcement as the layer that makes the rest
   real. Placing it as a horizontal control plane (layer 6) reflects its actual
   architecture: one screening floor, one telemetry pipeline, across layers 2–5.
5. **People are governed, not just trained.** Shadow-AI data shows the workforce is the
   widest AI surface. A layer with its own controls (paved road, discovery, coaching,
   literacy-gated access) reflects what mature programs actually build.
6. **It is memorable at executive altitude and lossless at technical altitude.** Seven
   questions fit in a CIO's head; each opens into control tables and enforcement points
   without changing the model. The progressive-depth requirement is satisfied by
   construction, not by hiding detail.

## Cross-cutting lenses

The framework is explored through four lenses on the site, all tagged to the same layer
ids so the model stays coherent: **personas** (9 roles with decisions and questions),
**risks** (12, each with documented incidents), **architectures** (9 deployment shapes
with governance profiles), and **maturity** (4 stages: Ad hoc → Documented → Enforced →
Continuous, benchmarked against McKinsey's 2.3/4 industry average).

## Boundaries and non-goals

The framework does not attempt: a full ethics treatise (it operationalizes fairness as
testing + monitoring controls where AI touches people); jurisdiction-specific legal
advice (it maps obligations and dates, and says "verify"); or vendor scoring (the vendor
lens compares architectures and leaves weighting to the customer).
