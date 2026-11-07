# Agentify your Day (`/agentify`, agentify.aitokenomics.app)

Fork of the Asset Factory for the Q1 FY27 Workspace activation workstream
(AWT 2.0). Not passcode-gated (noindex; search-only on the homepage).
Synthetic accounts, partners and telemetry.

## Customer-first experience: collections and Agent in a Day

The site opens in the **customer** view. The top bar links to the Google and
Partner views, and each of those links back to the customer view.

- **Agent in a Day** (`#/day/<fpa|devops|secops|revops>`). One persona per
  team (Maya, Jordan, Nadia, Marcus), shown in four ways:
  - the same working day twice on one 06:00–20:00 clock;
  - before/after comparison cards;
  - a "You stay in control" strip;
  - a walkthrough that toggles between two modes. *Without agents* lists
    the manual blocks with their pain points. *With agents* is a player that
    steps through rendered Gmail, Docs, Sheets, Chat, Calendar and Meet
    moments, with an agent / you / approved note on each.
  
  The page ends with a closing call to action. Each day has at least one
  overnight moment and at least two approvals, and uses under 6/21 of the
  daily per-user entitlement. Tests enforce all three.
- **Collections** (`#/collections`, `#/c/<id>`). Four collections of four
  use-case packages each, with full SKILL.md files. The data lives in
  `functions.ts` and `content-functions.ts`; `catalog.ts` merges them with
  the everyday packages.
- **Pre vs post for every persona.** Customers get the day walkthrough. The
  Partner board and the Google plan open with a before/after "shift" card,
  `PERSONA_SHIFT` in `data.ts`, which is projected only to those personas.
- `docs/agentify-review.md` is the executive review of this flow and lists
  the fixes it drove.

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
