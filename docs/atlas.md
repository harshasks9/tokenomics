# AI Intelligence Atlas (`/atlas` · atlas.aitokenomics.app)

A time-aware knowledge graph of how 30 influential AI builders, researchers and investors understood,
predicted and shaped AI from 2012 to the research cutoff (**2026-10-11**), with an auditable foresight
scorecard, debate maps, 2027–2030 scenarios and a final synthesis.

## Experiences

| # | View (hash route) | What it does |
|---|---|---|
| 01 | `#/big-picture` | Turning-points timeline, layer × period attention heatmap, top of the leaderboard, theses by status, debate balances, sourced metric series |
| 02 | `#/timeline?p=p2022&vs=p2026` | Seven event-driven periods; 14-layer stack per period; consensus, minority views, bottlenecks, perceived vs actual advantage; side-by-side compare |
| 03 | `#/minds` | 30 profiles (drawer): evolving mental model, reversals, claims, relationships, selection scores, source limits |
| 04 | `#/graph?who=<id>` / `?thesis=<id>` | Radial knowledge graph (people outer ring, theses inner ring ordered by stack layer); time slider + play; 2027–30 scenario mode; filters; zoom/pan; keyboard; edge explanations |
| 05 | `#/courtroom` | Searchable/filterable/exportable database of every assertion; case-file drawer with context, evidence, outcome, verdict, competing interpretations |
| 06 | `#/leaderboard?who=<id>` | Ten rankings, adjustable weights and presets, 80% intervals, tie detection, sensitivity table, per-claim audit trail |
| 07 | `#/debates?d=<id>` | 12 argument maps: camps, assumptions, dated evidence, balance-of-evidence chart, "could both be right?" |
| 08 | `#/future?s=<id>` | Three 2030 stack scenarios with bottlenecks, control points, winners/losers, indicators, invalidators, supporting/challenging thinkers; strategic implications by lens |
| — | `#/synthesis`, `#/method` | Ten synthesis questions and the 2030 mental model; methodology, exclusions, biases, limitations, audit log, evidence database, full-dataset export |

## Layout

| Path | Purpose |
|---|---|
| `src/app/atlas/` | Route (`layout.tsx`, `page.tsx`, `atlas.css` — design system prefix `at-`) |
| `src/components/atlas/` | One component per experience + `Shared` (drawer, badges, export, inline citations), `Drawers` (profile, case file, evidence), `StackView` |
| `src/lib/atlas/types.ts` | **Documented schema** for every entity (stable string ids, typed relations) |
| `src/lib/atlas/taxonomy.ts` | 14-layer stack, 17 topics, periods, cohorts, visual grammar |
| `src/lib/atlas/data/*.json` | **The dataset** (presentation-free): thinkers, assertions, evidence, relations, events, periods, metrics, theses, technologies, debates, scenarios, implications, judgments, synthesis, method |
| `src/lib/atlas/scoring.ts` | Foresight scorecard (weights, shrinkage, penalties, bootstrap intervals, sensitivity) |
| `src/lib/atlas/graph.ts` | Time-aware graph builder (progressive disclosure, as-of status) |
| `src/lib/atlas/pipeline/` | Raw research batches (`research/*.json`, schemas) and the Python scripts that rebuild `data/` (`./run.sh`) |
| `src/lib/atlas/atlas.test.ts` | Integrity (ids, references, cutoff, no recalled text shown verbatim), scoring and graph tests |

## Updating the dataset

1. Add or correct raw research in `pipeline/research/*.json` (schema: `pipeline/research/SCHEMA.md`, `CONTEXT_SCHEMA.md`).
   Every evidence record needs a real URL (or `""`), a verified date and an honest `verification` level.
2. Edit the knowledge model (`model.py` theses and assertion→thesis mapping; `debates.py`, `scenarios.py`,
   `synthesis.py`, `judgments.py`) when new evidence changes a thesis status or debate balance.
3. `src/lib/atlas/pipeline/run.sh` then `npx vitest run src/lib/atlas`.

No server, cron or environment variables are required — the site is static.

## Method in brief

- **Selection**: six criteria from the brief, scored 1–5 per candidate with reasons; exclusions and biases listed on `#/method`.
- **Assertions**: 5–10 per person where evidence allows; kind (prediction / opinion / aspiration / conditional / action),
  category, layers, assumptions, horizon, outcome by the cutoff, verdict, timing, confidence, originality, causal, specificity.
  Unreached deadlines are unresolved. Strategic actions are scored at half weight and never treated as proof of belief.
- **Scorecard**: accuracy 30 / originality 20 / timing 15 / causal 15 / updating 10 / breadth 10 (adjustable).
  Specificity- and confidence-weighted, Bayesian-shrunk for thin records, −0.25 for precise misses, bootstrap +
  small-sample 80% intervals, ties reported, ranks re-computed under five weighting schemes.
- **Graph grammar**: green = agreement/validation, red = disagreement/falsification, blue = influence/dependency/change of
  position, amber = unresolved, dashed = inferred or forecast. Thesis colors are read *as of* the slider date.

## Known limitations

- Research ran behind a network proxy that blocked page fetches, and a shared web-search quota ran out mid-research:
  about 55% of evidence records are **unverified recall** (flagged in every view; never shown as verbatim quotes).
  A verification pass against primary sources is the top data-quality priority.
- Half of the assertions are unresolved at the cutoff; scores rest on 3–7 scorable claims per person and most top ranks are ties.
- Period heat and debate balance values are analyst readings, not measurements; 2026 facts come from news reporting.
