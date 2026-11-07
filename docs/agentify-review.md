# Agentify your Day — executive review of the customer flow

**Scope:** the customer-first experience at `/agentify`: Agent in a Day, the four functional collections (FP&A, DevOps, SecOps, RevOps), the use-case library, and the links to the Google and Partner views.

**Lens:** an enterprise-cloud CEO looks at a customer-facing page with five questions:

1. Is the outcome clear in the first five seconds?
2. Is it believable?
3. Does the customer feel in control?
4. Is it obvious what to do next?
5. Does it respect what the customer already pays for?

These are review standards only. Nothing here is attributed to any person.

## What already works

- **The first screen states the outcome.** "Same day. Same work. Hours back." sits above a single clock that shows both days. The ending time (19:10 → 17:30) carries the argument without any copy.
- **The four teams are one click apart.** Each team has a named persona and a concrete scenario, such as close week, an incident morning or forecast day, instead of a generic "productivity" story.
- **The walkthrough shows the actual Workspace surfaces.** You see the Gmail draft, the Docs suggestion and the Sheets highlight, not a description of them. Every moment separates what the agent did from what the person did.
- **Approvals are part of the story, not fine print.** Each day has two or more explicit approvals, and the end card says who approved what.

## Findings and fixes (ranked by impact)

| # | Impact | Finding | Fix shipped |
|---|---|---|---|
| 1 | High | The end-of-day card's main button ("See the … collection") rendered white on white. The best moment in the flow had no visible next step. | New `solid-light` button variant: white pill with dark text on the dark card. |
| 2 | High | There was no call to action on the main page unless the viewer played the day to the end, so most visitors would never see "Book". | Added a closing band under the walkthrough: "Run Maya's day on your team's real Workspace", with Book and Collection buttons. It shows in both the before and after modes. |
| 3 | High | Trust lived only on the collection pages. A security or finance buyer who lands on Agent in a Day sees time saved, but not *why it's safe*. | Added a "You stay in control" strip under the before/after comparison, using that team's own guardrails (e.g. "No access to security tooling…" for SecOps). |
| 4 | High | **Credibility.** The "context switches after" figure came from a rule of thumb (35% of before), not from the modeled day. | It now equals the number of agent moments in the day: one review per moment. Every figure on the page now traces to the data. |
| 5 | Medium | "$0.03 of entitlement", "of ~$0.29/day owned" and "$6/user/month of entitlement" read like billing. On a customer page they invite "what will this cost me?" | Reworded as "of included entitlement" and "used of ~$0.29/day already in your plan". The collection line now says when all four agents fit "inside the agent entitlement your plan already includes". The footnote explains it once. No upsell language anywhere. |
| 6 | Medium | The "Without agents" view was a dead end: nine painful blocks and no way forward. | Added a footer that totals the before-day (busywork, slipped items, end time) and a primary "Now the same day with agents →" button. |
| 7 | Medium | "Hover the day…" is meaningless on a phone or tablet, where many executives will first see the link. | Now reads "Point at, tap or tab to any block…". The blocks were already focusable buttons. |
| 8 | Low | At 390 px the signed-in avatar wrapped onto a second header line under the view links. | The identity chip is hidden on narrow screens. The Google and Partner links stay. |
| 9 | Low | A hydration warning came from whitespace inside a Sheets `<tr>`. | Fixed. The walkthrough has zero console errors on desktop and at 390 px. |

## Deliberately not changed

- **No autoplay on landing.** Executives skim; motion that starts by itself competes with the headline. The player starts on "Play the day" or the arrow keys.
- **The Google and Partner links stay small in the top bar.** The brief was customer-first. The other views are one click away, and each now opens with its own before/after "shift" card.
- **No pricing, SKU or revenue language in customer or partner views.** The server projection still strips plan, revenue and targeting data, and tests enforce this.

## Next, if this goes in front of customers

- Replace the modeled days with one real anonymised pilot day per team once the first workshops run. Keep the same layout and swap the data only.
- Add a "share this day" link that deep-links to `#/day/<team>`; routing already supports it.
- Let the customer's own usage page highlight which collection fits their median user. The qualification data exists; only the customer-safe projection is missing.
