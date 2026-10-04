# Korea AI – Path to 4x · FY27 plan site

Route `/korea-fy27`. On `korea.aitokenomics.app` the plan owns `/` and `/gate`;
the Global Sae-A executive briefing keeps `/korea` on that host, ungated.
The plan sits behind the Deal Check passcode gate (same `DEALCHECK_PASSCODE`,
session cookie and secret as Deal Check and MDES; see `src/proxy.ts`), so no new
environment variables are needed.

Source: "Korea AI – Path to 4x · FY27_vFF" (133 slides, Oct 2026, Draft ·
Google internal) and its website build brief. The brief's canonical data wins;
where the deck disagrees with itself, the site shows the plan-of-record value and
logs the other one (Appendix → Conflicts & WIP).

> **The repository is public.** Everything in `data/` can be read on GitHub; the
> gate protects only the rendered site. Individual employees are named by role
> (`[name]` where the deck has an owner placeholder); keep it that way.

## The brief, rewritten

One scrolling page that answers one question per section, in the order an
executive would ask them. Each section opens with its question, a one-sentence
answer (the headline) and then the evidence. Every number is either stated in
the deck (with its slide) or computed from stated numbers by a formula listed in
the numbers ledger. Nothing blank in the deck is filled in here.

| # | Section | Question | Answer (headline, abridged) | Interactive views |
| --- | --- | --- | --- | --- |
| 01 | Summary | What is the plan, and why does it matter? | $226M → ~$900M: market ~2x × share ~2x. | Equation strip, given/commit/stretch ladder, three motions, three decisions |
| 02 | Market | Is the market large enough? | The wallet doubles, ~$1.3B → ~$2.6B, in four segments that buy differently. | Wallet dumbbell, segment cards, sizing methods, competitor bars (directional) |
| 03 | Our business | What did FY26 prove, and what is fragile? | A breakout year built on a handful of accounts and almost nothing new. | KPIs, growth sources (not additive), share by segment |
| 04 | The plan | Where does the +$675M come from? | Market growth carries us to ~$435M; ~$465M must be won as share. | Equation sliders, market-vs-share waterfall, motion bridge + linked matrix, base + eight-lever bridge, top-13 accounts |
| 05 | Cohorts | How does the strategy become owned books of business? | Eight cohorts own the number. | Motion map, cohort explorer (segment, motion, lead play, coverage, line of sight), cohort drawer |
| 06 | Execution | What do we sell, and how do we get to production? | Six plays, one three-phase delivery system. | Play cards, play × cohort heatmap (slide 17 vs cohort pages), phases, deep dives |
| 07 | Resourcing | Who does the work, and does every hire map to a number? | Coverage follows the money. | Three snapshots, both FDE models, allocation board, pods |
| 08 | VC engine | How do we build the new-logo machine FY26 lacked? | ~$114M of the startups cohort runs through investors. | Flow, funnel to ~$203M, benchmark, 90-day plan, asks |
| 09 | Risks | What could break the number? | Run-rate covers ~59% of Samsung but ~4% of startups. | Line of sight by cohort, ranked risks, what must be true |
| 10 | Asks | What must leadership decide now? | Three decisions let the eight cohort plans start in Q1. | People / money / cross-team panels linked to cohorts, open items |
| 11 | Appendix | Why do we believe the numbers? | The data room. | Market deep dives, FY26 penetration, numbers ledger, conflicts, sources |

The narrative ends on the decisions (10); the appendix is reference, reached
from the "Data room" button.

### One total, five cuts

The +$675M is cut five ways. Each cut sums to the total on its own and the cuts
are never mixed in one chart:

| Cut | Pieces | Where |
| --- | --- | --- |
| Market vs share | +$209M market growth at today's share, +$465M share gain | 04 waterfall |
| Motion | Deepen +$277M · Penetrate +$142M · Acquire +$257M | 04 motion bridge |
| Segment | DN +$449M · C&E +$189M · Mid-market +$13M · Public & EDU +$25M | 02, 04 |
| Cohort | eight cohorts, plus Hyundai AutoEver held flat at $13.4M (in C&E, outside the cohorts) | 05 |
| Certainty | ~$725M base case + $175M across eight levers; whales (+$100–300M) sit outside the ~$900M | 04 lever bridge |

### Number rules

1. Every figure carries a basis: stated, derived (computed here), estimate,
   directional (competitor field intel), WIP, to confirm, placeholder or proposed.
2. Placeholders stay visible: `[name]`, `[team to fill]`, `[$ to confirm]`, `xx`.
3. Competitor figures are directional; the open-weight figure is a placeholder.
4. A deck-internal disagreement is logged in `data/sources.ts` with both values,
   the slides and the value shown. Rounding differences are logged as rounding.
5. Red is reserved for risk. Motion colours (Deepen navy, Penetrate blue,
   Acquire teal) mean motion and nothing else; the palette passes the dataviz
   validator for colour-vision deficiency. Every chart has a table view and
   tooltips on hover and keyboard focus.

## Layout

| File | Role |
| --- | --- |
| `types.ts` | Data types, including `Src` (deck part + slides) and `Basis`. |
| `data/plan.ts` | Headline, equation, ladder, market vs share, motions, levers, top-13 accounts. |
| `data/market.ts` | Four segments, sizing methods, signals, competitors, market deep dives. |
| `data/business.ts` | FY26 review and the Appendix B penetration tables. |
| `data/cohorts.ts` | The eight cohorts (economics, plays, delivery, team, decisions, account tables) and AutoEver. |
| `data/execution.ts` | Plays, enablers, phases, governance, KPIs, commercial buckets, deep dives. |
| `data/org.ts` | Resourcing snapshots, FDE models, staffing by cohort, pods, VC engine. |
| `data/decisions.ts` | Risks and the three asks. |
| `data/sources.ts` | Conflict log and source map. |
| `model.ts` | `buildModel()`: assembles the data, derives the matrix, base case and line of sight, and runs the reconciliation checks. |
| `model.test.ts`, `routes.test.ts` | Every check passes; counts (3 motions, 4 segments, 8 cohorts, 6 plays); no employee names; routing. |
| `format.ts` | Display helpers (pure). |
| `routes.ts` | Host-aware routing for `korea.aitokenomics.app`. |

UI lives in `src/components/korea-fy27/` and `src/app/korea-fy27/`. The page is a
server component that checks the session, builds the model and passes it to the
client as props. Client components import only types and the pure helpers in
`format.ts` from this folder, so the data files are never bundled into client
JavaScript (a few labels and notes in the components still quote figures). The root carries
`data-ja-mirror-control` and `translate="no"`, so the Japanese mirror never sends
plan text to `/api/translate`.

## Updating the numbers

1. Edit the relevant file in `data/` and keep its `src` slide reference current.
2. If you add a derived figure, add a `check(...)` for it in `model.ts`.
3. Run `npx vitest run src/lib/korea-fy27`. A failing check means the change does
   not tie to the deck: fix the data, or log the disagreement in `data/sources.ts`.
4. Run `npm run build` and confirm `/korea-fy27` and `/korea-fy27/gate` are listed.

## Printing

"Executive print" prints the sections marked `exec` (Summary, The plan, Risks,
Asks). "Full print" prints everything with all details expanded.
