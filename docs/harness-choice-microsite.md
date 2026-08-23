# Harness Choice — Microsite Architecture (Deliverable 9)

Route: `/harness` · Host: `harness.aitokenomics.app` · Snapshot: 2026-08-23

## Experience model

A single scrolling narrative in twelve numbered sections, mirroring the PRD's IA.
Three global modes modify every section:

- **Lens** (Exec / Architect / Developer) — progressive depth. Copy blocks tagged by
  audience swap in place; executives never scroll through developer material.
- **Seller Mode** — reveals per-section "questions to ask the customer" kits and a
  10-minute talk track. Off by default for customer-facing use.
- **Interactive state** — workload, vendor, approach, economics inputs and the
  readiness assessment persist per visit (React state only; nothing is sent anywhere).

## Sections → components

| # | Section | Component | Interaction |
|---|---|---|---|
| 01 | Models aren't the whole system | `Hero` | Clickable outcome equation; each term explains itself |
| 02 | What is a harness? | `StackDiagram` | Clickable User→App→Harness→Model/Tools/Data boundary diagram + 3-card definition |
| 03 | Inside the harness | `CapabilityExplorer` | 11-layer grid; tile → detail with lens-aware depth |
| 04 | Why harness choice matters | `EvidencePanel` | Research exhibits: same model, different harness, sourced + caveated |
| 05 | Choose your workload | `WorkloadSelector` | 7 workloads → animated capability-weight profile |
| 06 | Harness landscape | `Landscape` | 6 vendor stacks; fact / interpretation / implication blocks; ownership chips |
| 07 | Build vs Buy | `BuildVsBuy` | 4 approaches, tradeoff bars, expandable detail |
| 08 | Model + Harness | `PairExplorer` | Pick model posture × harness posture → verdict on coupling and portability |
| 09 | Google Cloud architecture | `GoogleMap` | Requirement → approach → services rows across all 11 capabilities |
| 10 | Harness economics | `EconomicsLab` | Cost-per-successful-task calculator; two harness profiles side by side |
| 11 | Reference architectures | `RefArchGallery` | 4 flow diagrams with capability spotlights |
| 12 | Readiness assessment | `Readiness` | 11-question maturity self-score → strength/gap profile |

Footer: dated source list + freshness disclaimer (agent ecosystem churns monthly).

## Content system

All copy and data live in `src/lib/harness/*.ts` (typed by `types.ts`), so the
research snapshot can be refreshed without touching components. Sources carry
labels + dates; secondary-source numbers carry caveats in the UI itself.

## Seller test (PRD §19)

Every section ships: one memorable visual, one central idea (the "IDEA" callout),
customer questions (Seller Mode), tradeoffs, and a Google point of view where it
belongs (§09 primarily; §06 keeps the landscape symmetric and factual).
