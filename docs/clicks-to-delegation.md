# From Clicks to Delegation (`/clicks-to-delegation`)

An interactive research report on what the 1994–2026 e-commerce transition does
and does not predict about agentic commerce. Research as of 10 November 2026.

## Structure
- `src/lib/clicks-to-delegation/data/*.json` — curated output of five research
  streams (history, cases, agentic commerce 2022–26, consumer/category/geography,
  economics). Every record carries `sourceIds`; `sources.json` is the library
  (each source has a `verification` level showing how it was reached).
- `research.ts` — typed access to the data; `models.ts` — the two calculators
  (the $100 value-capture model and the adoption scenario model); analytical
  layers in `analogies.ts`, `contrarian.ts`, `futures.ts`, `playbook.ts`,
  `insights.ts`, `journeys.ts`, `gatekeepers.ts`, `review.ts`.
- `src/components/clicks-to-delegation/` — the site shell and one component per
  section (01–14 plus the closing insights).

## Evidence rules
- Evidence kinds (measured, survey, company claim, analyst estimate, our
  judgment, illustrative, projection) are labeled wherever a figure appears.
- Access levels: primary hosts (Census, FRED, SEC, Pew…) were blocked by the
  research environment's network policy, so most sources were read through
  search excerpts; the US e-commerce series came from exact FRED mirrors.
  Items resting only on unverified background knowledge are flagged
  "not re-verified" in the UI.
- Tests (`clicks-to-delegation.test.ts`) fail if any citation does not resolve,
  if a "strong" scorecard claim rests on company claims alone, or if the
  calculators break their invariants.

## Updating
Edit the JSON in `data/` directly (the curation script lived in the research
session's scratchpad and is not part of the build). Keep `sourceIds` valid —
the tests enforce it.
