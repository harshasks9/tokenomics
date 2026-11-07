# Agentify your Day (`/agentify`, agentify.aitokenomics.app) — internal

Fork of the Asset Factory for the Q1 FY27 Workspace activation workstream
(AWT 2.0). Behind the Deal Check passcode gate, like MDES and the Korea FY27
plan. Synthetic accounts, partners and telemetry.

## Personas (server-projected)

| Persona | Gets | Never gets |
| --- | --- | --- |
| Customer (Workspace admin) | Own account: entitlement owned, median-user usage, recommended long-running agents, workshop booking, use-case packages | Targeting scores, plays, internal notes, credits, plan, revenue |
| Partner FDE | Own book, this week's 5 slots, pipeline, workshop kit, credits (≤ $5K/account) | Plan, revenue thesis, accountability |
| Google (central team) | Plan, execution model, squad & accountability, qualification, scorecard | — |

`views.ts` builds each projection; internal copy lives in `plan.ts` and is
only serialized for Google. A test fails if client components hard-code
internal plan wording or import server-only modules, and the production
bundle contains none of it.

## Gate

`src/proxy.ts` redirects locked visitors to `/deal-check/gate`. `/api` is
outside the proxy matcher, so `src/lib/agentify/server.ts` checks the same
Deal Check session on every API call (401 otherwise).

## Model

- Per-user agentic tasks/week are generated deterministically per account;
  statistics are real medians/quantiles over those users (`model.ts`).
- Qualification = edition (entitlement $2/$6, beta first wave, sovereign),
  median usage (idle seats = activation prize), live use cases → play:
  Activate / Deepen / Expand / Upgrade first / Not now.
- Stages: qualified → workshop booked → agentified → using (median ≥ 5,
  ≥ 3 use cases) → expanding. `engine.ts` refuses stage claims the telemetry
  doesn't support, partners outside their book, credits before activation,
  over the partner cap or past the $50K pool.
- Use-case packages (`content.ts`): SKILL.md, schema, sample run, workshop lab;
  "Try it" runs them with Gemini when `GEMINI_API_KEY` is set (recorded
  otherwise).

Tests: `npx vitest run src/lib/agentify`.
