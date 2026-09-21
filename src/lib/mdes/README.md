# MDES × Human Intelligence — Gemini Enterprise commitment planner

Route `/mdes` (also `mdes.aitokenomics.app`). Internal planning tool for the
USD 10.8M / 12-month Gemini Enterprise for EDU commitment resold by Human
Intelligence to MDES (Thailand). Sits behind the Deal Check passcode gate
(same `DEALCHECK_PASSCODE` and cookie; see `src/proxy.ts`).

## Layout

| File | Role |
| --- | --- |
| `terms.ts` | Facts read from the Order Form (17 Sep 2026, Quote Q-465401) tagged `contract`, account-team assumptions tagged `assumption`, proposed flexibility tagged `proposed`. |
| `engine.ts` | Pure engine: ramp generation, `evaluate`, solvers, scenario comparison, sensitivity. No rounding. |
| `engine.test.ts` | Arithmetic, price floor, GCP caps, extension logic, infeasible solves, zero adoption. |
| `format.ts` | Display-only K / M formatting and exact hover strings. |
| `storage.ts`, `plan.ts` | localStorage working plan + saved scenarios (browser only). |
| `csv.ts` | Full-precision CSV export. |
| `routes.ts` | Host-aware routing for the subdomain. |

UI lives in `src/components/mdes/` and `src/app/mdes/`.

## Calendar

Planning months follow the Order Form billing periods (15th to 14th).
M1 = 15 Sep – 14 Oct 2026 (Order Form effective, nothing provisioned yet);
the first order term starts "upon provisioning", assumed 15 Oct 2026, so the
six order terms map to M2–M12 and the final six-month term ends 14 Sep 2027.
Ordered units: 0, 100K, 200K, 300K, 400K, 500K, then 650K × 6 = 5.4M
user-months = USD 10.8M at USD 2.

## Rules the engine enforces

- Monthly GE spend = billed users × price. Total consumption = GE + explicitly
  modelled eligible GCP spend (only when enabled, capped if a cap is set).
- Remaining = max(10.8M − cumulative, 0); above = max(cumulative − 10.8M, 0).
- The commitment is owed regardless of consumption; shortfall creates no
  refund, rollover or extension. Extending the window never moves the
  Month-12 user milestone.
- Prices below USD 1.85 are rejected; any price other than USD 2 is flagged
  as needing an amended order form.
- GCP allocation and spending beyond Month 12 are always labelled as proposed
  and listed as approval dependencies. The one-time GEAP transition
  discussion is shown as a contract term and not modelled.
