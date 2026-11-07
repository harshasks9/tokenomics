/** Server-only: package files for the 16 functional use cases. Never import from client code. */
import type { AgentifyFile } from "./content";

export const FUNCTION_USECASE_FILES: Record<string, AgentifyFile[]> = {
  'fn-fpa-variance': [
    {
      path: 'SKILL.md',
      content: `---
name: month-end-variance-explainer
namespace: google
version: "1.1"
description: Use when an FP&A analyst or manager needs every budget-vs-actual variance over threshold explained in plain English, with its driver, owner and source, before the close review.
license: Apache-2.0
surfaces: [Sheets, Gmail, Docs, Chat]
runtime: long-running
approval: Every question email or Chat message to a cost-centre owner, and every edit to the commentary Doc; notes written to the agent's own tab need no approval.
entitlement_cost_per_run_usd: 0.09
typical_runs_per_user_per_week: 3
outputs: schema/output.json
---

# Month-end Variance Explainer

## When to use

- Actuals land in a budget-vs-actual Sheet (an export from the ledger or a consolidation file)
  shared in Drive, and someone has to explain every line over threshold.
- The explanations already exist somewhere: supplier emails, PO threads, Chat messages, last
  month's commentary. Nobody has time to find them during close.
- Good fit for FP&A analysts, finance business partners and controllers.
- Not for posting adjustments or changing actuals. The explainer reads and writes notes; it
  never edits a number.
- Signs it is working: the close review opens with explained variances, and fewer "why is this
  up?" emails go out after WD+2.

## How it runs

1. **Wake: actuals loaded.** When the actuals tab of the variance Sheet changes after WD+1, the
   agent wakes (or at \`run_time_local\` on close days, whichever comes first).
2. **Screen.** Flags every line where the variance exceeds both \`threshold_pct\` and
   \`threshold_abs\`. Everything else is ignored.
3. **Explain.** For each flagged line, searches threads, Chat spaces and Docs shared with the user
   in the lookback window for the driver: a price change, a timing shift, a one-off, a volume
   change. Each explanation cites at least one source link.
4. **Checkpoint 1: draft notes.** Writes explanations to the notes tab with a confidence label.
   Lines without a confident driver get a drafted question to the owner.
5. **Checkpoint 2: owner questions.** Questions are batched one per owner and held as drafts; the
   user approves which go out.
6. **Wake: owner replies.** A reply updates the note and marks it "confirmed by owner".
7. **Close.** When every flagged line is confirmed or accepted, it drafts the commentary section
   of the close Doc as suggestions the user accepts or rejects.

## Instructions

1. Treat the variance Sheet as the only source of numbers. Never recalculate actuals or budget;
   quote the cells as they are.
2. Classify each driver as \`price\`, \`volume\`, \`timing\`, \`one_off\`, \`mix\` or \`unknown\`.
3. An explanation needs a source link (thread, message, Doc or cell). No source means
   \`unknown\` and a drafted owner question, never a guess.
4. Write notes in plain English, at most \`max_words_per_note\` words, leading with the driver:
   "Diesel surcharge from Ridgeway Haulage from 3 Oct; about $41k of the $56k."
5. Quantify a driver only when the source states an amount. Otherwise write "amount not stated".
6. Batch questions so each owner gets one message listing all of their lines.
7. Never send an email or Chat message and never edit the commentary Doc without approval.
8. Never quote individual pay or supplier bank details, even when the source contains them;
   link the source instead.
9. Write only to the notes tab; never change other tabs, formulas or formatting.
10. Emit JSON matching \`schema/output.json\` after each run.

## Approvals & guardrails

- **Email and Chat:** every owner question is a draft until the user approves it.
- **Commentary Doc:** changes arrive as suggestions; the user accepts or rejects each one.
- **Sheets:** writes only to the notes tab; numbers are never changed.
- **Finance systems:** no access. It reads exports that are already in Drive.
- **Audit:** every note keeps its source links, so a reviewer can trace each sentence.
- **Cost:** about $0.09 per run that explains 10-40 lines; about three runs in a close week.

## Examples

\`\`\`json
{
  "input": { "line": "Freight & logistics", "budget": 412000, "actual": 468000,
             "variance_pct": 13.6, "owner": "Sanjay Patel" },
  "output": { "driver": "price", "confidence": "high",
              "note": "Diesel surcharge from Ridgeway Haulage from 3 Oct; about $41k of the $56k.",
              "status": "explained" }
}
\`\`\`

## Parameters

\`\`\`yaml
threshold_pct: 5             # flag lines whose variance exceeds this percentage...
threshold_abs: 10000         # ...and this absolute amount in reporting currency
lookback_days: 45            # how far back to search threads and Docs for drivers
notes_tab: "Variance notes (Gemini)"
max_words_per_note: 25
batch_questions_by_owner: true
run_time_local: "05:30"
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Month-end Variance Explainer run",
  "type": "object",
  "required": ["run_id", "period", "generated_at", "lines", "summary", "drafts_for_approval"],
  "properties": {
    "run_id": { "type": "string" },
    "period": { "type": "string", "pattern": "^[0-9]{4}-[0-9]{2}$" },
    "generated_at": { "type": "string", "format": "date-time" },
    "lines": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["line", "budget", "actual", "variance_pct", "driver", "confidence", "note", "status"],
        "properties": {
          "line": { "type": "string" },
          "owner": { "type": "string" },
          "budget": { "type": "number" },
          "actual": { "type": "number" },
          "variance_pct": { "type": "number" },
          "driver": { "type": "string", "enum": ["price", "volume", "timing", "one_off", "mix", "unknown"] },
          "confidence": { "type": "string", "enum": ["high", "medium", "low"] },
          "note": { "type": "string", "maxLength": 200 },
          "sources": { "type": "array", "items": { "type": "string" } },
          "status": { "type": "string", "enum": ["explained", "question_drafted", "confirmed_by_owner"] }
        }
      }
    },
    "summary": {
      "type": "object",
      "required": ["lines_screened", "flagged", "explained", "questions_drafted"],
      "properties": {
        "lines_screened": { "type": "integer", "minimum": 0 },
        "flagged": { "type": "integer", "minimum": 0 },
        "explained": { "type": "integer", "minimum": 0 },
        "questions_drafted": { "type": "integer", "minimum": 0 }
      }
    },
    "drafts_for_approval": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "to", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["send_email", "post_chat", "suggest_doc_edit"] },
          "to": { "type": "string" },
          "summary": { "type": "string" }
        }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "user": "maya.okonkwo@cymbal-sandbox.example",
  "timezone": "America/Chicago",
  "period": "2026-10",
  "variance_sheet": "Oct budget vs actual (shared drive: Finance / Close / 2026-10)",
  "lines": [
    { "line": "Freight & logistics", "owner": "Sanjay Patel", "budget": 412000, "actual": 468000 },
    { "line": "Field marketing", "owner": "Leo Brandt", "budget": 185000, "actual": 221000 },
    { "line": "Packaging", "owner": "Sanjay Patel", "budget": 298000, "actual": 271000 },
    { "line": "Contract labour", "owner": "Ruth Adeyemi", "budget": 156000, "actual": 176000 },
    { "line": "Office supplies", "owner": "Omar Haddad", "budget": 12000, "actual": 12900 }
  ],
  "sources_in_scope": [
    { "kind": "email", "subject": "Ridgeway Haulage - fuel surcharge from 3 October", "from": "billing@ridgeway-haulage.example", "date": "2026-10-01" },
    { "kind": "chat", "space": "Field marketing", "text": "Harvest Expo booth is now 21-23 Oct, not November. Same budget, earlier month.", "date": "2026-09-18" },
    { "kind": "doc", "title": "PO 4471 - carton price reset", "date": "2026-10-14" }
  ]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "run_id": "vex-2026-10-wd2-mokonkwo",
  "period": "2026-10",
  "generated_at": "2026-11-03T05:31:12-06:00",
  "lines": [
    { "line": "Freight & logistics", "owner": "Sanjay Patel", "budget": 412000, "actual": 468000, "variance_pct": 13.6, "driver": "price", "confidence": "high", "note": "Diesel surcharge from Ridgeway Haulage from 3 Oct; about $41k of the $56k.", "sources": ["email: Ridgeway Haulage - fuel surcharge from 3 October"], "status": "explained" },
    { "line": "Field marketing", "owner": "Leo Brandt", "budget": 185000, "actual": 221000, "variance_pct": 19.5, "driver": "timing", "confidence": "high", "note": "Harvest Expo booth moved from November to October; full-year spend unchanged.", "sources": ["chat: Field marketing, 18 Sep"], "status": "explained" },
    { "line": "Packaging", "owner": "Sanjay Patel", "budget": 298000, "actual": 271000, "variance_pct": -9.1, "driver": "price", "confidence": "medium", "note": "Carton price reset on PO 4471 from mid-October; amount not stated.", "sources": ["doc: PO 4471 - carton price reset"], "status": "explained" },
    { "line": "Contract labour", "owner": "Ruth Adeyemi", "budget": 156000, "actual": 176000, "variance_pct": 12.8, "driver": "unknown", "confidence": "low", "note": "No driver found in shared threads or Docs; question drafted for the owner.", "sources": [], "status": "question_drafted" }
  ],
  "summary": { "lines_screened": 5, "flagged": 4, "explained": 3, "questions_drafted": 1 },
  "drafts_for_approval": [
    { "kind": "send_email", "to": "ruth.adeyemi@cymbal-sandbox.example", "summary": "One question on contract labour (+$20k): line 3 changeover, or ongoing into November?" }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab FP&A 1: Explain the month before the review

**Time box:** 40 minutes

## Objective

Let Gemini screen a month of budget-vs-actual lines, explain each variance over threshold from
the threads and Docs you already have, and draft questions for the rest. You approve every
question and accept every sentence of commentary.

## Setup

- **Seats:** pairs on Business Standard or Enterprise Standard seats in \`cymbal-sandbox.example\`:
  one FP&A analyst, one cost-centre owner (Ops).
- **Data:** an "Oct budget vs actual" Sheet with 40 lines, a shared Finance drive, seeded supplier
  emails and a "Field marketing" Chat space. All figures are synthetic.
- **Package:** \`google/month-end-variance-explainer@1.1\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Analyst: open the variance Sheet and, in the side panel, run "Explain October variances over
   5% and $10k." Watch the notes tab fill in.
2. Pick two notes and open their source links. Check each note says what the source says, no more.
3. Find the line marked \`unknown\`. Read the drafted question; edit it and approve it.
4. Owner: reply from your own seat with a one-line answer. Watch the note flip to
   "confirmed by owner".
5. Analyst: try to find a number the agent changed on any tab (there should be none).
6. Open the commentary Doc and review the suggested paragraph. Accept two sentences, reject one.

## What good looks like

- [ ] Every note has a source link or is marked \`unknown\` with a question drafted.
- [ ] One question per owner, not one per line.
- [ ] No number changed anywhere; commentary arrived as suggestions only.
- [ ] Your hands-on time is under 10 minutes for a 40-line month.

## Entitlement check

About $0.09 per run, three runs in a close week: 0.09 x 3 x 4.3 = about $1.16 a month. That fits
any seat, including Starter ($2).

## Facilitator notes

- The contract labour line has no source on purpose; the point is to see the agent ask, not guess.
- If someone asks the agent to "fix" a number, show that it declines and explains why.
- Debrief prompt: which variance did you explain twice last month, once by email and once in the
  commentary?

## Measure it next week

- **Signal:** agentic tasks per FP&A user during the close window in the Admin console Gemini
  usage report. Three or more per analyst means the habit stuck.
- **Outcome:** share of flagged lines explained before the close review, compared with last month.
- **Watch for:** notes rejected by owners; usually the lookback window is too short.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.1 - 2026-10-21
- Owner questions batched one per owner across lines.
- Commentary drafted as Doc suggestions once every flagged line is confirmed.

## 1.0 - 2026-09-02
- First release: threshold screen, sourced driver notes in a dedicated tab, owner questions held
  for approval.
`,
    },
  ],
  'fn-fpa-forecast': [
    {
      path: 'SKILL.md',
      content: `---
name: forecast-input-chaser
namespace: google
version: "1.0"
description: Use when FP&A collects forecast or budget inputs from many owners in a shared Sheet and needs every owner reminded, every submission checked and the status visible without a day of chasing.
license: Apache-2.0
surfaces: [Gmail, Sheets, Chat, Meet]
runtime: long-running
approval: Every request, reminder and escalation email or Chat message; checks are left as comments that need no approval.
entitlement_cost_per_run_usd: 0.07
typical_runs_per_user_per_week: 4
outputs: schema/output.json
---

# Forecast Input Chaser

## When to use

- A forecast or budget cycle collects inputs from 5-50 owners, each with a tab or a block of rows
  in a shared Sheet.
- FP&A spends the cycle writing reminders and checking submissions by eye: blank months,
  headcount that doesn't match the plan, numbers wildly off the last forecast.
- Good fit for quarterly reforecasts, annual budgets and rolling forecasts.
- Not for consolidating into a planning system or changing anyone's numbers. The chaser
  reminds and checks; owners own their inputs.
- Signs it is working: inputs arrive before the deadline, and fewer submissions bounce back.

## How it runs

1. **Kickoff.** Reads the input Sheet's owner list and due date. Drafts one request per owner
   linking their tab and last cycle's submission. The user approves the batch.
2. **Daily sweep (09:00 local).** For each owner: has the tab changed, is it complete, do the
   checks pass? Updates a status tab the agent owns.
3. **Wake: owner edits or replies.** A change to an owner's tab or a reply wakes the agent to run
   the checks and leave comments on cells that fail.
4. **Checkpoint 1: reminders.** Owners behind schedule get one drafted reminder naming exactly
   what is missing. The user approves; nothing goes out on its own.
5. **Wake: status call notes.** When notes from the cycle's status meeting land, the agent turns
   agreed actions into owner follow-ups, as drafts.
6. **Escalation.** After \`escalate_after_days\` late, it drafts a note to the owner's manager for
   approval.
7. **Close.** At the deadline it posts a summary to the user: complete, flagged, missing.

## Instructions

1. The input Sheet is the source of truth for owners and due dates; never add or remove owners.
2. A submission is "complete" when every required cell in the owner's range is filled.
3. Run the configured checks: headcount against the approved plan, change against the last
   forecast above \`flag_change_pct\`, and blank months. Leave a comment on each failing cell.
4. Never edit an owner's numbers, even to fix an obvious typo; comment instead.
5. Reminders name the exact missing rows or failed checks, and link the owner's tab. Keep them
   under 70 words, in the user's voice.
6. One reminder per owner per business day, at most \`max_reminders\` per cycle.
7. Never send an email or Chat message without approval of that specific draft or batch.
8. Escalate to a manager only after \`escalate_after_days\` late, and only with approval.
9. Emit JSON matching \`schema/output.json\` after each sweep or wake.

## Approvals & guardrails

- **Email and Chat:** requests, reminders and escalations are drafts until approved.
- **Sheets:** writes only to its own status tab and leaves comments; owners' cells are untouched.
- **Meet:** reads notes the user's meetings already produce; it never joins as a participant.
- **Data:** inputs stay in the shared Sheet; nothing is copied outside Workspace.
- **Cost:** about $0.07 per sweep or wake that checks and drafts; four a week in a cycle.

## Examples

\`\`\`json
{
  "input": { "owner": "Ruth Adeyemi", "cost_centre": "Operations",
             "headcount_submitted": 46, "headcount_plan": 42, "blank_months": [] },
  "output": { "status": "flagged", "issues": ["Headcount 4 above approved plan"],
              "action": "comment_left", "reminder_draft": null }
}
\`\`\`

## Parameters

\`\`\`yaml
sweep_time_local: "09:00"
flag_change_pct: 15          # comment when a line moves more than this vs last forecast
max_reminders: 3             # per owner per cycle
escalate_after_days: 2       # business days late before a manager note is drafted
status_tab: "Input status (Gemini)"
quiet_hours_local: ["18:00", "08:00"]
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Forecast Input Chaser run",
  "type": "object",
  "required": ["run_id", "cycle", "run_type", "owners", "drafts_for_approval"],
  "properties": {
    "run_id": { "type": "string" },
    "cycle": { "type": "string" },
    "run_type": { "type": "string", "enum": ["kickoff", "daily_sweep", "edit_wake", "reply_wake", "meeting_wake", "close"] },
    "due": { "type": "string", "format": "date-time" },
    "owners": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["owner", "cost_centre", "status"],
        "properties": {
          "owner": { "type": "string" },
          "email": { "type": "string" },
          "cost_centre": { "type": "string" },
          "status": { "type": "string", "enum": ["not_started", "in_progress", "submitted", "flagged", "accepted", "late"] },
          "issues": { "type": "array", "items": { "type": "string" } },
          "reminders_sent": { "type": "integer", "minimum": 0 }
        }
      }
    },
    "drafts_for_approval": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "to", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["request", "reminder", "escalation", "follow_up"] },
          "to": { "type": "string" },
          "summary": { "type": "string" }
        }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "user": "maya.okonkwo@cymbal-sandbox.example",
  "timezone": "America/Chicago",
  "now": "2026-11-03T09:00:00-06:00",
  "cycle": "Q1 FY27 reforecast",
  "due": "2026-11-04T12:00:00-06:00",
  "input_sheet": "Q1 forecast inputs",
  "owners": [
    { "owner": "Sanjay Patel", "email": "sanjay.patel@cymbal-sandbox.example", "cost_centre": "Freight", "blank_rows": ["Feb volume", "Mar volume"], "reminders_sent": 1 },
    { "owner": "Ruth Adeyemi", "email": "ruth.adeyemi@cymbal-sandbox.example", "cost_centre": "Operations", "headcount_submitted": 46, "headcount_plan": 42, "reminders_sent": 0 },
    { "owner": "Leo Brandt", "email": "leo.brandt@cymbal-sandbox.example", "cost_centre": "Field marketing", "complete": true, "reminders_sent": 0 },
    { "owner": "Hana Sato", "email": "hana.sato@cymbal-sandbox.example", "cost_centre": "IT", "blank_rows": ["Mar all lines"], "reminders_sent": 1 }
  ]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "run_id": "fic-q1fy27-2026-11-03-0900",
  "cycle": "Q1 FY27 reforecast",
  "run_type": "daily_sweep",
  "due": "2026-11-04T12:00:00-06:00",
  "owners": [
    { "owner": "Sanjay Patel", "email": "sanjay.patel@cymbal-sandbox.example", "cost_centre": "Freight", "status": "in_progress", "issues": ["Feb and Mar volume blank"], "reminders_sent": 1 },
    { "owner": "Ruth Adeyemi", "email": "ruth.adeyemi@cymbal-sandbox.example", "cost_centre": "Operations", "status": "flagged", "issues": ["Headcount 46 vs approved plan 42; comment left on C14"], "reminders_sent": 0 },
    { "owner": "Leo Brandt", "email": "leo.brandt@cymbal-sandbox.example", "cost_centre": "Field marketing", "status": "submitted", "issues": [], "reminders_sent": 0 },
    { "owner": "Hana Sato", "email": "hana.sato@cymbal-sandbox.example", "cost_centre": "IT", "status": "in_progress", "issues": ["March blank"], "reminders_sent": 1 }
  ],
  "drafts_for_approval": [
    { "kind": "reminder", "to": "sanjay.patel@cymbal-sandbox.example", "summary": "Freight tab nearly done: only Feb and Mar volume rows blank. Due Wed 12:00." },
    { "kind": "reminder", "to": "hana.sato@cymbal-sandbox.example", "summary": "IT tab: March is still blank. Due Wed 12:00." }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab FP&A 2: Run a forecast cycle without the chase

**Time box:** 40 minutes

## Objective

Run a compressed reforecast with Gemini sending nothing on its own: it drafts requests and
reminders, checks every submission as it lands and keeps a status tab current. Owners keep their
numbers; you approve every message.

## Setup

- **Seats:** groups of four on Business or Enterprise seats in \`cymbal-sandbox.example\`: one FP&A
  lead and three owners (Freight, Operations, IT).
- **Data:** a "Q1 forecast inputs" Sheet with one tab per owner, an approved headcount plan and
  last cycle's submissions. All figures are synthetic.
- **Package:** \`google/forecast-input-chaser@1.0\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. FP&A lead: in the side panel, run "Start the Q1 reforecast, due Wednesday 12:00." Review the
   three request drafts and approve them as a batch.
2. Operations owner: enter a headcount four above plan. Watch a comment appear on that cell.
3. Freight owner: leave two rows blank and do nothing else.
4. Facilitator advances to the next morning's sweep. FP&A lead: read the status tab and the one
   reminder draft. Confirm it names the two blank rows. Approve it.
5. FP&A lead: try asking the agent to "just correct" the headcount. Confirm it comments instead.
6. Run a five-minute status call with "Take notes for me" on. After the call, review the
   follow-up drafts the agent built from the notes.

## What good looks like

- [ ] Every reminder names exactly what is missing and links the owner's tab.
- [ ] No owner cell was changed by the agent.
- [ ] One reminder per owner per day, each approved.
- [ ] The status tab matches what owners actually submitted.

## Entitlement check

About $0.07 per sweep or wake, four a week during a cycle: 0.07 x 4 x 4.3 = about $1.20 a month.
Owners who only receive reminders spend nothing.

## Facilitator notes

- Advance the sweep for the whole room at once so the debrief lines up.
- The headcount gap is deliberate: show that the agent flags it but never fixes it.
- Debrief prompt: which owner did you remind three times last cycle, and what was missing?

## Measure it next week

- **Signal:** agentic tasks per FP&A user per week during the cycle in the Admin console Gemini
  usage report.
- **Outcome:** share of inputs submitted before the deadline, compared with last cycle.
- **Watch for:** checks that flag too much; raise \`flag_change_pct\` rather than ignoring them.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.0 - 2026-10-14
- First release: batched requests, daily sweep with completeness and plan checks as comments,
  reminders and escalations held for approval, status-call follow-ups from Meet notes.
`,
    },
  ],
  'fn-fpa-boardpack': [
    {
      path: 'SKILL.md',
      content: `---
name: board-pack-assembler
namespace: google
version: "1.2"
description: Use when FP&A assembles a monthly or quarterly board pack from approved Sheets and Docs and needs every section current, every figure tied to source and stale content caught before distribution.
license: Apache-2.0
surfaces: [Drive, Docs, Sheets, Gmail]
runtime: long-running
approval: Every change to the pack Doc (made as suggestions), the distribution email and any request to a section owner; the tie-out report needs no approval.
entitlement_cost_per_run_usd: 0.32
typical_runs_per_user_per_week: 1
outputs: schema/output.json
---

# Board Pack Assembler

## When to use

- The board pack is a Doc built from a template, with each section pointing to a source: a Sheet
  range, a commentary Doc or a chart.
- Assembly means copying the latest approved versions in, then checking that every number in the
  text matches its source. One stale chart forces a full re-check.
- Good fit for FP&A managers, chiefs of staff and finance directors.
- Not for writing the CFO's narrative from scratch or deciding what goes to the board.
- Signs it is working: the pack reaches the CFO a day earlier, with no "this number is wrong"
  replies.

## How it runs

1. **Wake: T-5 business days.** Reads the pack template and its section map: section name,
   source file, range or heading, and section owner.
2. **Inventory.** For each section, finds the latest version of the source and checks it is
   approved (the file's "Approved" label or an approval note in the file) and modified after
   period end.
3. **Checkpoint 1: assembly.** Inserts current content into the pack as suggestions. Sections
   with stale or unapproved sources get a comment and a drafted request to the section owner.
4. **Tie-out.** Compares every number in the pack text and tables with its source cell, within
   \`rounding_tolerance\`, and writes a tie-out report Doc.
5. **Checkpoint 2: fixes.** Proposed fixes for mismatches arrive as suggestions; the user accepts
   or rejects each one.
6. **Wake: source changes.** A source edited after assembly wakes the agent to re-check the
   affected section only.
7. **Checkpoint 3: distribution.** Drafts the cover email to the review list, linking the pack.

## Instructions

1. Use only sources listed in the section map. Never pull a number from an unlisted file.
2. A source is current when it is approved and modified after the period end date.
3. Insert content as suggestions; never accept your own suggestions or delete the user's text.
4. Tie out every number: exact match, or within \`rounding_tolerance\` when the pack rounds.
5. A number with no traceable source is flagged "no source", never left silently.
6. Never change Drive sharing. If a reviewer lacks access, say so in the report.
7. Link the pack in emails; never attach exports or copies.
8. Draft requests to section owners for stale sources; approval required to send.
9. Emit JSON matching \`schema/output.json\` after each run.

## Approvals & guardrails

- **Pack Doc:** every change is a suggestion the user accepts or rejects.
- **Email:** owner requests and the distribution email are drafts until approved.
- **Sharing:** never changed; access gaps are reported.
- **Audit:** the tie-out report lists each figure, its source cell and the result.
- **Cost:** about $0.32 per assembly or re-check run; roughly one a week averaged over the month.

## Examples

\`\`\`json
{
  "input": { "section": "Headcount", "source": "Headcount plan!B4:M4",
             "source_approved": "2026-11-04", "pack_value": 412 },
  "output": { "freshness": "stale", "source_value": 418, "result": "mismatch",
              "proposed_fix": "Replace chart with 4 Nov approved version" }
}
\`\`\`

## Parameters

\`\`\`yaml
start_business_days_before_due: 5
rounding_tolerance: 0.5      # in the pack's displayed unit
approved_label: "Approved"
report_doc_name: "Board pack - tie-out report (Gemini)"
review_list: "board-pack-review@cymbal-sandbox.example"
recheck_on_source_change: true
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Board Pack Assembler run",
  "type": "object",
  "required": ["pack_id", "period", "status", "sections", "tie_out", "drafts_for_approval"],
  "properties": {
    "pack_id": { "type": "string" },
    "period": { "type": "string" },
    "status": { "type": "string", "enum": ["assembling", "awaiting_user_review", "ready_to_distribute", "distributed"] },
    "sections": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["section", "source", "freshness", "status"],
        "properties": {
          "section": { "type": "string" },
          "source": { "type": "string" },
          "owner": { "type": "string" },
          "freshness": { "type": "string", "enum": ["current", "stale", "unapproved", "missing"] },
          "status": { "type": "string", "enum": ["suggested", "accepted", "waiting_on_owner"] }
        }
      }
    },
    "tie_out": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["location", "pack_value", "source_value", "result"],
        "properties": {
          "location": { "type": "string" },
          "pack_value": { "type": "number" },
          "source_value": { "type": "number" },
          "result": { "type": "string", "enum": ["match", "within_rounding", "mismatch", "no_source"] }
        }
      }
    },
    "drafts_for_approval": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["suggest_doc_edit", "owner_request", "distribution_email"] },
          "to": { "type": "string" },
          "summary": { "type": "string" }
        }
      }
    },
    "access_warnings": { "type": "array", "items": { "type": "string" } }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "user": "maya.okonkwo@cymbal-sandbox.example",
  "period": "2026-10",
  "pack_doc": "Board pack - October 2026",
  "due": "2026-11-06",
  "section_map": [
    { "section": "Financial summary", "source": "Oct budget vs actual!B2:F12", "owner": "maya.okonkwo@cymbal-sandbox.example" },
    { "section": "Commentary", "source": "Oct close commentary (Doc)", "owner": "maya.okonkwo@cymbal-sandbox.example" },
    { "section": "Headcount", "source": "Headcount plan!B4:M4", "owner": "people-ops@cymbal-sandbox.example" },
    { "section": "Cash", "source": "Cash forecast!C3:C9", "owner": "treasury@cymbal-sandbox.example" }
  ],
  "review_list": ["cfo@cymbal-sandbox.example", "board-pack-review@cymbal-sandbox.example"]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "pack_id": "bpa-2026-10",
  "period": "2026-10",
  "status": "awaiting_user_review",
  "sections": [
    { "section": "Financial summary", "source": "Oct budget vs actual!B2:F12", "owner": "maya.okonkwo@cymbal-sandbox.example", "freshness": "current", "status": "suggested" },
    { "section": "Commentary", "source": "Oct close commentary (Doc)", "owner": "maya.okonkwo@cymbal-sandbox.example", "freshness": "current", "status": "suggested" },
    { "section": "Headcount", "source": "Headcount plan!B4:M4", "owner": "people-ops@cymbal-sandbox.example", "freshness": "stale", "status": "suggested" },
    { "section": "Cash", "source": "Cash forecast!C3:C9", "owner": "treasury@cymbal-sandbox.example", "freshness": "unapproved", "status": "waiting_on_owner" }
  ],
  "tie_out": [
    { "location": "Financial summary, operating costs", "pack_value": 3.46, "source_value": 3.461, "result": "within_rounding" },
    { "location": "Commentary, freight surcharge", "pack_value": 41, "source_value": 41, "result": "match" },
    { "location": "Slide 6, headcount chart", "pack_value": 412, "source_value": 418, "result": "mismatch" }
  ],
  "drafts_for_approval": [
    { "kind": "suggest_doc_edit", "summary": "Replace the slide 6 headcount chart with the 4 Nov approved version (418 FTE)." },
    { "kind": "owner_request", "to": "treasury@cymbal-sandbox.example", "summary": "Cash forecast was edited 2 Nov but is not marked approved. Please approve or confirm by Thu." }
  ],
  "access_warnings": []
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab FP&A 3: Assemble and tie out a board pack

**Time box:** 45 minutes

## Objective

Have Gemini assemble a board pack from approved sources, tie every figure back to its cell and
catch a stale chart before the CFO does. Every change arrives as a suggestion; the distribution
email waits for you.

## Setup

- **Seats:** pairs on Business Standard or Enterprise Standard seats in \`cymbal-sandbox.example\`:
  FP&A manager and a section owner (People Ops).
- **Data:** a "Board pack - October 2026" template Doc with a section map, four source Sheets and
  Docs, one deliberately stale headcount chart. All figures are synthetic.
- **Package:** \`google/board-pack-assembler@1.2\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. FP&A manager: open the pack Doc and @mention Gemini in a comment: "Assemble October from the
   section map." Watch suggestions appear section by section.
2. Open the tie-out report Doc. Find the headcount mismatch (412 vs 418).
3. Accept the suggested chart replacement. Reject one other suggestion to see that the agent
   leaves your choice alone.
4. Read the comment on the Cash section: its source is not approved. Approve the drafted request
   to Treasury.
5. Section owner: update the headcount plan and mark it approved. Watch the agent re-check only
   that section.
6. Review the distribution email draft. Confirm the pack is linked, not attached. Send it.

## What good looks like

- [ ] Every figure in the pack appears in the tie-out report with a result.
- [ ] No change was applied without you accepting it.
- [ ] Drive sharing is unchanged.
- [ ] The distribution email links the pack and lists any open item.

## Entitlement check

About $0.32 per assembly or re-check run, one a week averaged over the month:
0.32 x 1 x 4.3 = about $1.38 a month.

## Facilitator notes

- The stale chart is the moment of the lab; let attendees find it in the report before you hint.
- Expect "can it just send it to the board?" No: distribution is always approved by a person.
- Debrief prompt: what did your last pack's late correction cost in time and credibility?

## Measure it next week

- **Signal:** agentic tasks per FP&A manager in the pack week in the Admin console Gemini usage
  report.
- **Outcome:** days between period end and pack distribution, compared with last month.
- **Watch for:** many "no source" figures; the section map needs more ranges.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.2 - 2026-10-30
- Re-check only the affected section when a source changes after assembly.
- Access warnings in the report instead of failing silently. Never change sharing.

## 1.1 - 2026-09-25
- Tie-out report Doc with per-figure source cell and result.

## 1.0 - 2026-08-28
- First release: section map, freshness checks, assembly as suggestions, distribution draft.
`,
    },
  ],
  'fn-fpa-budgetqa': [
    {
      path: 'SKILL.md',
      content: `---
name: budget-owner-q-and-a
namespace: google
version: "1.0"
description: Use when budget owners keep asking FP&A how much budget they have left, what is committed or how to move money, and the answers already sit in the approved budget Sheet and the open-PO export.
license: Apache-2.0
surfaces: [Chat, Sheets, Gmail]
runtime: on-demand
approval: Any reallocation or exception request sent to FP&A on an owner's behalf; answers to the owner's own questions need no approval.
entitlement_cost_per_run_usd: 0.02
typical_runs_per_user_per_week: 10
outputs: schema/output.json
---

# Budget Owner Q&A

## When to use

- FP&A publishes an approved budget Sheet with an owner column, and an open-PO or spend export
  lands in Drive weekly.
- Budget owners ask the same questions by DM: remaining budget, spend to date, what is committed,
  how to request a transfer.
- Good fit for a "Budget questions" Chat space per department, or DMs to Gemini.
- Not for approving spend, moving budget or answering about cost centres the asker doesn't own.
- Signs it is working: FP&A DMs about balances drop, and transfer requests arrive with the
  numbers already filled in.

## How it runs

1. **Wake: @mention.** An owner @mentions Gemini in the space or DMs it with a question.
2. **Who is asking.** Matches the asker to cost centres in the owner column of the approved
   budget Sheet. If none match, it says so and suggests who to ask.
3. **Answer.** Reads budget, actuals to date and open commitments for that cost centre and
   answers in two or three sentences, citing the tab and row.
4. **Checkpoint: requests.** If the question is a reallocation or exception, it drafts a request
   to FP&A with the numbers filled in. The owner approves before it is sent; FP&A decides.
5. **Hand-off.** Questions it cannot answer from the Sheets are routed to the FP&A analyst on
   duty with the context, never guessed.
6. **Weekly digest.** On Fridays, it sends FP&A a short list of the most-asked questions so the
   budget FAQ can be improved.

## Instructions

1. Answer only from the approved budget Sheet and the latest spend or PO export in Drive.
2. Answer only about cost centres the asker owns per the owner column. For others, name the owner.
3. Always state the as-of date of the export: "as of the 9 Nov export".
4. Show remaining budget as budget minus actuals, and say separately what open POs will use.
5. Cite the tab and row for every number.
6. Never promise or approve spend, and never say a transfer is approved.
7. Draft reallocation requests with from, to, amount and reason; the owner approves sending.
8. Never reveal individual salaries or employee-level lines, even if the asker owns the cost
   centre; give the total and link the restricted tab.
9. Emit JSON matching \`schema/output.json\` for each question.

## Approvals & guardrails

- **Chat answers:** read-only answers to the owner's own question need no approval.
- **Requests:** reallocation and exception requests are drafts until the owner approves sending.
- **Scope:** cost-centre ownership comes from the Sheet; access controls on the Sheet still apply.
- **Data:** answers quote the Sheet; nothing is copied outside Workspace.
- **Cost:** about $0.02 per question; a busy owner asks two a day.

## Examples

\`\`\`json
{
  "input": { "asked_by": "dev.malhotra@cymbal-sandbox.example",
             "question": "How much is left in the line 3 maintenance budget for Q4?" },
  "output": { "intent": "remaining_budget", "answered_by": "agent",
              "answer": "$64,200 left of $180,000; two open POs ($11,800) not yet invoiced.",
              "sources": ["FY26 Approved Budget > Ops, row 31", "Open POs export, 9 Nov"] }
}
\`\`\`

## Parameters

\`\`\`yaml
budget_sheet: "FY26 Approved Budget"
spend_export_folder: "Finance/Exports/Open POs"
fpa_on_duty: "fpa-duty@cymbal-sandbox.example"
max_sentences: 3
weekly_digest_day: "Friday"
restricted_tabs: ["Payroll detail"]
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Budget Owner Q&A answer",
  "type": "object",
  "required": ["question_id", "asked_by", "asked_at", "intent", "answered_by", "answer", "sources"],
  "properties": {
    "question_id": { "type": "string" },
    "asked_by": { "type": "string" },
    "asked_at": { "type": "string", "format": "date-time" },
    "space": { "type": "string" },
    "cost_centre": { "type": "string" },
    "intent": { "type": "string", "enum": ["remaining_budget", "spend_to_date", "open_commitments", "reallocation_request", "policy", "other"] },
    "answered_by": { "type": "string", "enum": ["agent", "routed_to_fpa", "not_owner"] },
    "answer": { "type": "string", "maxLength": 500 },
    "as_of": { "type": "string", "format": "date" },
    "sources": { "type": "array", "items": { "type": "string" } },
    "draft_for_approval": {
      "type": "object",
      "required": ["kind", "summary"],
      "properties": {
        "kind": { "type": "string", "enum": ["reallocation_request", "exception_request"] },
        "to": { "type": "string" },
        "summary": { "type": "string" }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "asked_by": "dev.malhotra@cymbal-sandbox.example",
  "asked_at": "2026-11-03T08:29:40-06:00",
  "space": "Budget questions - Operations",
  "question": "How much is left in the line 3 maintenance budget for Q4? And can I move $8k from line 2 if I need it?",
  "budget_sheet_rows": [
    { "tab": "Ops", "row": 31, "cost_centre": "Line 3 maintenance", "owner": "dev.malhotra@cymbal-sandbox.example", "q4_budget": 180000, "q4_actual": 115800 },
    { "tab": "Ops", "row": 30, "cost_centre": "Line 2 maintenance", "owner": "dev.malhotra@cymbal-sandbox.example", "q4_budget": 150000, "q4_actual": 61200 }
  ],
  "open_pos_export": { "as_of": "2026-11-02", "line_3_open": 11800, "line_2_open": 4000 }
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "question_id": "bqa-2026-11-03-0829-dmalhotra",
  "asked_by": "dev.malhotra@cymbal-sandbox.example",
  "asked_at": "2026-11-03T08:29:40-06:00",
  "space": "Budget questions - Operations",
  "cost_centre": "Line 3 maintenance",
  "intent": "reallocation_request",
  "answered_by": "agent",
  "answer": "Line 3 maintenance has $64,200 left of $180,000 for Q4; two open POs ($11,800) will use part of it. Line 2 has $88,800 left. I've drafted an $8,000 transfer request to FP&A for you to review; FP&A decides.",
  "as_of": "2026-11-02",
  "sources": ["FY26 Approved Budget > Ops, row 31", "FY26 Approved Budget > Ops, row 30", "Open POs export, 2 Nov"],
  "draft_for_approval": { "kind": "reallocation_request", "to": "fpa-duty@cymbal-sandbox.example", "summary": "Move $8,000 Q4 budget from Line 2 to Line 3 maintenance for a bearing replacement." }
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab FP&A 4: Stop being the budget help desk

**Time box:** 30 minutes

## Objective

Put Gemini in a "Budget questions" Chat space as a coworker that answers owners from the
approved budget Sheet, cites its sources and drafts transfer requests the owner approves.
FP&A still decides every transfer.

## Setup

- **Seats:** groups of three on any Business or Enterprise seat in \`cymbal-sandbox.example\`:
  one FP&A analyst and two budget owners.
- **Data:** an "FY26 Approved Budget" Sheet with an owner column, an open-PO export in Drive and a
  restricted "Payroll detail" tab. All figures are synthetic.
- **Package:** \`google/budget-owner-q-and-a@1.0\`.
- A "Budget questions - Operations" Chat space with the group and Gemini added.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Owner 1: @mention Gemini and ask how much is left in your cost centre. Check the answer
   cites a tab, a row and the export date.
2. Owner 1: ask about Owner 2's cost centre. Confirm the agent declines and names the owner.
3. Owner 2: ask to move $8k between your two cost centres. Review the drafted request and approve
   sending it.
4. FP&A analyst: find the request in your inbox. Confirm nothing in the Sheet changed.
5. Owner 2: ask what one named team member is paid. Confirm the agent gives no individual figure.
6. FP&A analyst: ask Gemini for this week's most-asked questions.

## What good looks like

- [ ] Every answer cites its source and as-of date.
- [ ] No answer about a cost centre the asker doesn't own.
- [ ] The transfer request was sent only after the owner approved it.
- [ ] No salary or employee-level detail appeared in the space.

## Entitlement check

About $0.02 per question, ten a week for a busy owner: 0.02 x 10 x 4.3 = about $0.86 a month.

## Facilitator notes

- The out-of-scope question in step 2 is the trust moment; pause on it.
- Debrief prompt: how many budget DMs did FP&A answer last week, and how many were lookups?

## Measure it next week

- **Signal:** agentic tasks per budget owner in the Admin console Gemini usage report.
- **Outcome:** budget-balance DMs to FP&A, compared with the week before.
- **Watch for:** many \`routed_to_fpa\` answers; usually the export is missing a column.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.0 - 2026-10-07
- First release: owner-scoped answers with sources and as-of date, drafted transfer requests,
  routing to FP&A on duty, weekly most-asked digest.
`,
    },
  ],
  'fn-devops-postmortem': [
    {
      path: 'SKILL.md',
      content: `---
name: incident-timeline-postmortem-drafter
namespace: google
version: "1.1"
description: Use when an incident has been worked in a Chat space with alert emails and bridge notes, and the team needs a sourced timeline and a blameless postmortem draft without rebuilding the night by hand.
license: Apache-2.0
surfaces: [Chat, Gmail, Docs, Meet]
runtime: long-running
approval: Sharing the postmortem Doc, any post to a stakeholder space and any email; the timeline and postmortem draft in the user's own Drive need no approval.
entitlement_cost_per_run_usd: 0.18
typical_runs_per_user_per_week: 1.5
outputs: schema/output.json
---

# Incident Timeline & Postmortem Drafter

## When to use

- Incidents are worked in a dedicated Chat space, alerting systems email the on-call list, and
  the bridge call produces Meet notes or a running Doc.
- After resolution, an engineer spends hours scrolling the space to rebuild the timeline, then
  faces a blank postmortem template.
- Good fit for SRE, platform and support engineering teams with a postmortem culture.
- Not for running the incident. The drafter never touches production systems, monitoring or
  deploy tooling; it reads only what has been shared into Workspace.
- Signs it is working: postmortem drafts exist the same day, and review meetings spend their time
  on causes and actions instead of "what time did we roll back?"

## How it runs

1. **Wake: incident resolved.** A "resolved" message in the incident space, or a resolution
   email from the alerting list, wakes the agent after \`settle_minutes\`.
2. **Collect.** Reads the incident space, alert emails with the incident ID in the subject, and
   the bridge's Meet notes or running Doc, within the incident window.
3. **Timeline.** Builds a UTC timeline: detection, acknowledgement, key decisions, mitigations,
   recovery. Every entry links to its source message or email.
4. **Checkpoint 1: timeline review.** Writes the timeline Doc in the user's Drive and comments on
   entries it is unsure about, such as conflicting timestamps or estimated impact.
5. **Postmortem draft.** Fills the team's template: summary, impact, contributing factors, what
   went well, action items with suggested owners. Rewrites blame-shaped sentences.
6. **Checkpoint 2: share.** Proposes the reviewer list from the space's members. The Doc is
   shared only after approval, with the reviewers' existing access rules.
7. **Stakeholder answers.** When @mentioned in a stakeholder space, answers status questions from
   the incident Doc only.

## Instructions

1. Read only the incident space, emails carrying the incident ID, and the bridge notes. Never
   read other spaces or inboxes.
2. Every timeline entry needs a source link and a UTC timestamp. Convert local times explicitly.
3. When sources disagree on a time or a number, keep both, comment, and ask the user.
4. Never invent impact numbers. Quote the status email or dashboard screenshot shared in the space.
5. Write blamelessly: describe systems, decisions and conditions, not people. Suggest rewording
   for any sentence in the sources that names a person as the cause.
6. Action items are suggestions with a proposed owner team, never assigned to an individual
   without approval.
7. Never suggest running commands, and never claim a fix is deployed unless a message says so.
8. Never share the Doc, post in a space or send email without approval.
9. Emit JSON matching \`schema/output.json\` after each run.

## Approvals & guardrails

- **Production:** no access. Reads Workspace content only; recommends, never acts.
- **Sharing and posting:** the Doc share, stakeholder posts and emails each need approval.
- **Blameless:** blame-shaped sentences are rewritten as suggestions the user accepts.
- **Audit:** every timeline entry links its source; reviewers can verify each line.
- **Cost:** about $0.18 per incident (timeline plus postmortem draft); 1-2 incidents a week.

## Examples

\`\`\`json
{
  "input": { "incident": "INC-2291", "space_messages": 312, "alert_emails": 14,
             "bridge_notes": true },
  "output": { "timeline_entries": 11, "conflicts": 1, "actions_suggested": 3,
              "status": "awaiting_user_review" }
}
\`\`\`

## Parameters

\`\`\`yaml
settle_minutes: 30           # wait after "resolved" before collecting
timezone_output: "UTC"
postmortem_template: "Postmortem template v3"
incident_id_pattern: "INC-[0-9]{4}"
max_timeline_entries: 25
propose_reviewers_from_space: true
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Incident Timeline & Postmortem Drafter run",
  "type": "object",
  "required": ["incident_id", "status", "timeline", "impact", "actions", "pending_approvals"],
  "properties": {
    "incident_id": { "type": "string" },
    "status": { "type": "string", "enum": ["collecting", "awaiting_user_review", "shared", "closed"] },
    "window_utc": { "type": "string" },
    "timeline": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["at_utc", "event", "source"],
        "properties": {
          "at_utc": { "type": "string" },
          "event": { "type": "string" },
          "source": { "type": "string" },
          "conflict": { "type": "string" }
        }
      }
    },
    "impact": {
      "type": "object",
      "required": ["summary", "source"],
      "properties": {
        "summary": { "type": "string" },
        "duration_minutes": { "type": "integer", "minimum": 0 },
        "source": { "type": "string" }
      }
    },
    "actions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["action", "owner_team"],
        "properties": {
          "action": { "type": "string" },
          "owner_team": { "type": "string" },
          "priority": { "type": "string", "enum": ["p1", "p2", "p3"] }
        }
      }
    },
    "pending_approvals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["share_doc", "post_chat", "send_email"] },
          "summary": { "type": "string" },
          "recipients": { "type": "array", "items": { "type": "string" } }
        }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "user": "jordan.whitlock@cymbal-sandbox.example",
  "incident_id": "INC-2291",
  "space": "inc-2291-checkout-latency",
  "alert_emails": [
    { "at": "2026-11-10T02:14:00Z", "subject": "[ALERT] INC-2291 checkout p95 latency 4.8s > 1.5s" },
    { "at": "2026-11-10T03:30:00Z", "subject": "[STATUS] INC-2291 resolved - 2,140 retried, 312 abandoned" }
  ],
  "space_messages": [
    { "at": "2026-11-10T02:19:00Z", "author": "Ana Ruiz", "text": "Ack. Looking at payments-api." },
    { "at": "2026-11-10T02:36:00Z", "author": "Ana Ruiz", "text": "4.11.3 changed the pool size. Rolling back to 4.11.2." },
    { "at": "2026-11-10T02:41:00Z", "author": "Ana Ruiz", "text": "Rollback done." },
    { "at": "2026-11-10T03:05:00Z", "author": "Kenji Mori", "text": "p95 back to 1.1s. Watching." },
    { "at": "2026-11-10T03:40:00Z", "author": "Ana Ruiz", "text": "Resolved. Bob pushed 4.11.3 without a load test." }
  ],
  "bridge_notes_doc": "INC-2291 bridge notes"
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "incident_id": "INC-2291",
  "status": "awaiting_user_review",
  "window_utc": "2026-11-10T02:14Z/2026-11-10T03:40Z",
  "timeline": [
    { "at_utc": "02:14", "event": "Alert: checkout p95 latency 4.8 s (threshold 1.5 s).", "source": "email: [ALERT] INC-2291" },
    { "at_utc": "02:19", "event": "On-call acknowledged in the incident space.", "source": "chat: inc-2291, 02:19" },
    { "at_utc": "02:36", "event": "Pool-size change in payments-api 4.11.3 identified; rollback decided.", "source": "chat: inc-2291, 02:36" },
    { "at_utc": "02:41", "event": "Rolled back to 4.11.2.", "source": "chat: inc-2291, 02:41" },
    { "at_utc": "03:05", "event": "p95 latency back to 1.1 s.", "source": "chat: inc-2291, 03:05", "conflict": "Bridge notes say 03:02; kept both." },
    { "at_utc": "03:40", "event": "Incident resolved.", "source": "chat: inc-2291, 03:40" }
  ],
  "impact": { "summary": "About 2,140 checkouts retried and 312 abandoned.", "duration_minutes": 51, "source": "email: [STATUS] INC-2291 resolved" },
  "actions": [
    { "action": "Add a pool-size check to the release checklist.", "owner_team": "Release management", "priority": "p1" },
    { "action": "Alert at 1.0 s p95 for 5 minutes instead of 1.5 s.", "owner_team": "SRE", "priority": "p2" },
    { "action": "Require a load test for payments-api config changes.", "owner_team": "Payments", "priority": "p2" }
  ],
  "pending_approvals": [
    { "kind": "share_doc", "summary": "Share the INC-2291 postmortem draft with five reviewers from the incident space.", "recipients": ["ana.ruiz@cymbal-sandbox.example", "kenji.mori@cymbal-sandbox.example", "payments-leads@cymbal-sandbox.example"] }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab DevOps 1: From incident space to postmortem in an hour

**Time box:** 45 minutes

## Objective

Hand Gemini a resolved incident: a busy Chat space, alert emails and bridge notes. Get back a
sourced UTC timeline and a blameless postmortem draft. Nothing touches production, and nothing
is shared until you approve.

## Setup

- **Seats:** groups of three on Business or Enterprise seats in \`cymbal-sandbox.example\`:
  incident commander, on-call engineer, stakeholder (Payments).
- **Data:** an "inc-2291-checkout-latency" Chat space with 300 seeded messages, 14 alert emails, a
  bridge notes Doc and the team's postmortem template. All synthetic; no real systems connected.
- **Package:** \`google/incident-timeline-postmortem-drafter@1.1\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Incident commander: post "Resolved" in the incident space. Facilitator skips the settle wait.
2. Open the timeline Doc. Pick three entries and follow their source links.
3. Find the comment on the conflicting recovery time. Decide which time to keep and resolve it.
4. Open the postmortem draft. Find the sentence the sources wrote as blame ("Bob pushed...") and
   review the suggested blameless rewording. Accept it.
5. Review the proposed reviewer list. Remove one person, then approve sharing.
6. Stakeholder: in the "Payments - stakeholders" space, @mention Gemini: "Is checkout fixed?"
   Check the answer comes only from the incident Doc.
7. Ask the agent to "restart payments-api". Confirm it declines: it has no production access.

## What good looks like

- [ ] Every timeline entry has a UTC time and a source link.
- [ ] Conflicts were surfaced as comments, not silently resolved.
- [ ] The postmortem names systems and decisions, not people.
- [ ] The Doc was shared only after your approval.

## Entitlement check

About $0.18 per incident, 1.5 incidents a week: 0.18 x 1.5 x 4.3 = about $1.16 a month.

## Facilitator notes

- The blame sentence is deliberate. Let the room discuss why blameless wording matters.
- Expect "can it roll back for us?" No: it reads Workspace only and never acts on production.
- Debrief prompt: how long did your last postmortem take to reach a first draft?

## Measure it next week

- **Signal:** agentic tasks per SRE per week in the Admin console Gemini usage report.
- **Outcome:** hours from resolution to postmortem first draft, compared with the last five
  incidents.
- **Watch for:** many conflicts per timeline; agree one clock source in the incident space.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.1 - 2026-10-26
- Conflicting timestamps kept side by side with a comment instead of picking one.
- Blameless rewording offered as suggestions.

## 1.0 - 2026-09-08
- First release: sourced UTC timeline, postmortem draft from template, approval to share.
`,
    },
  ],
  'fn-devops-releasenotes': [
    {
      path: 'SKILL.md',
      content: `---
name: release-notes-compiler
namespace: google
version: "1.0"
description: Use when a release manager must turn a release's merge-notification emails and release Doc into customer-facing and internal release notes, and brief support before customers notice.
license: Apache-2.0
surfaces: [Gmail, Docs, Chat]
runtime: long-running
approval: Every email to support or customers and every Chat post; the notes Doc in the user's own Drive needs no approval.
entitlement_cost_per_run_usd: 0.16
typical_runs_per_user_per_week: 1.5
outputs: schema/output.json
---

# Release Notes Compiler

## When to use

- Merge notifications from the code host arrive by email to a release list, and a release Doc
  tracks scope, flags and known issues.
- Someone turns 30-60 commit titles into words customers understand, usually the afternoon before
  release.
- Good fit for release managers, product ops and engineering managers on weekly or biweekly
  release trains.
- Not for deciding scope or toggling flags. The compiler reads what is shared into Workspace and
  never touches the code host, pipelines or production.
- Signs it is working: support hears about changes before customers do, and release-day notes
  need only light edits.

## How it runs

1. **Wake: release cut.** An email matching \`release_subject_pattern\` or a "cut" message in the
   release Chat space wakes the agent.
2. **Collect.** Reads merge-notification emails since the previous release tag and the release
   Doc's scope and known-issues sections.
3. **Group.** Classifies each change as \`feature\`, \`fix\`, \`internal\` or \`breaking\`. Internal
   changes go to an appendix; flagged-off features are left out of customer notes.
4. **Checkpoint 1: notes Doc.** Writes customer notes and internal notes in one Doc, each customer
   line linked to its merge email. Unclear titles get a comment asking the author.
5. **Checkpoint 2: support brief.** Drafts a short email to support leads: what customers will
   notice, known issues, linked notes. Approval required.
6. **Wake: scope change.** A late merge or a reverted change updates the Doc and flags the diff.
7. **Release.** On release day, offers to post the summary in the release space (approval).

## Instructions

1. Use only merge emails between the previous and current release tags, plus the release Doc.
2. Rewrite titles into customer language: say what changed for the user, not the code path.
3. Leave out anything behind a flag that is off at release, per the release Doc.
4. Mark \`breaking\` changes at the top and ask the user to confirm the wording.
5. Never include internal hostnames, ticket links or customer names in customer notes.
6. Link every customer line to its merge email so reviewers can check it.
7. Never send email or post in Chat without approval.
8. Emit JSON matching \`schema/output.json\` after each run.

## Approvals & guardrails

- **Code and production:** no access. Reads Workspace emails and Docs only.
- **Email and Chat:** the support brief and release post are drafts until approved.
- **Customer safety:** internal names and flagged-off features stay out of customer notes.
- **Audit:** each customer line links to its source merge email.
- **Cost:** about $0.16 per release (compile plus one update); 1-2 releases a week.

## Examples

\`\`\`json
{
  "input": { "title": "fix(checkout): cap payments-api pool at 64 under burst",
             "flag": null, "release": "4.12" },
  "output": { "category": "fix",
              "customer_line": "Checkout no longer slows down under heavy load.",
              "in_customer_notes": true }
}
\`\`\`

## Parameters

\`\`\`yaml
release_subject_pattern: "Release {version} cut"
merge_list: "merges@cymbal-sandbox.example"
support_list: "support-leads@cymbal-sandbox.example"
max_customer_lines: 8
internal_appendix: true
ask_author_when_unclear: true
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Release Notes Compiler run",
  "type": "object",
  "required": ["release", "status", "changes", "customer_notes", "pending_approvals"],
  "properties": {
    "release": { "type": "string" },
    "status": { "type": "string", "enum": ["compiling", "awaiting_user_review", "briefed", "released"] },
    "changes": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title", "category", "in_customer_notes"],
        "properties": {
          "title": { "type": "string" },
          "category": { "type": "string", "enum": ["feature", "fix", "internal", "breaking"] },
          "in_customer_notes": { "type": "boolean" },
          "reason_excluded": { "type": "string" }
        }
      }
    },
    "customer_notes": { "type": "array", "items": { "type": "string" } },
    "internal_count": { "type": "integer", "minimum": 0 },
    "questions_for_authors": { "type": "array", "items": { "type": "string" } },
    "pending_approvals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["send_email", "post_chat"] },
          "to": { "type": "string" },
          "summary": { "type": "string" }
        }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "user": "jordan.whitlock@cymbal-sandbox.example",
  "release": "4.12",
  "previous_tag": "4.11.2",
  "merge_emails": [
    { "subject": "Merged: feat(orders): reprint shipment label from order page" },
    { "subject": "Merged: fix(checkout): cap payments-api pool at 64 under burst" },
    { "subject": "Merged: fix(delivery): render windows in customer tz" },
    { "subject": "Merged: feat(routing): beta multi-depot planner (flag: multi_depot)" },
    { "subject": "Merged: chore(deps): bump http client" }
  ],
  "release_doc": {
    "flags_off_at_release": ["multi_depot"],
    "known_issues": ["Label reprint is not yet available on mobile."]
  }
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "release": "4.12",
  "status": "awaiting_user_review",
  "changes": [
    { "title": "feat(orders): reprint shipment label from order page", "category": "feature", "in_customer_notes": true },
    { "title": "fix(checkout): cap payments-api pool at 64 under burst", "category": "fix", "in_customer_notes": true },
    { "title": "fix(delivery): render windows in customer tz", "category": "fix", "in_customer_notes": true },
    { "title": "feat(routing): beta multi-depot planner", "category": "feature", "in_customer_notes": false, "reason_excluded": "Flag multi_depot is off at release." },
    { "title": "chore(deps): bump http client", "category": "internal", "in_customer_notes": false, "reason_excluded": "Internal change; listed in appendix." }
  ],
  "customer_notes": [
    "New: reprint a shipment label from the order page (web only for now).",
    "Fixed: checkout no longer slows down under heavy load.",
    "Fixed: delivery windows now show in your own time zone."
  ],
  "internal_count": 1,
  "questions_for_authors": [],
  "pending_approvals": [
    { "kind": "send_email", "to": "support-leads@cymbal-sandbox.example", "summary": "4.12 ships Thu 10:00: label reprints, checkout load fix, time-zone fix. Known issue: no reprint on mobile yet." }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab DevOps 2: Release notes people can read

**Time box:** 35 minutes

## Objective

Turn a release's merge emails into customer notes, internal notes and a support brief. Gemini
reads only what lands in Workspace and drafts; you decide what customers and support see.

## Setup

- **Seats:** pairs on Business or Enterprise seats in \`cymbal-sandbox.example\`: release manager
  and a support lead.
- **Data:** 37 seeded merge-notification emails for release 4.12, a release Doc with one flag off
  and one known issue, and a "Releases" Chat space. All synthetic.
- **Package:** \`google/release-notes-compiler@1.0\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Release manager: post "Release 4.12 cut" in the Releases space. Open the notes Doc that
   appears in your Drive.
2. Check the customer section: is the flagged-off multi-depot feature left out?
3. Follow two customer lines to their merge emails. Does the wording match what changed?
4. Find the comment on an unclear commit title. Answer it yourself, as the author would.
5. Facilitator sends a late merge. Watch the Doc update and flag the diff.
6. Review the support brief draft. Add one line about the known issue and approve it.
7. Support lead: confirm the brief arrived and links the notes rather than attaching them.

## What good looks like

- [ ] No internal hostnames, ticket links or customer names in customer notes.
- [ ] Flagged-off work is excluded with a reason.
- [ ] Every customer line links to its merge email.
- [ ] The support brief went out only after approval.

## Entitlement check

About $0.16 per release, 1.5 releases a week: 0.16 x 1.5 x 4.3 = about $1.03 a month.

## Facilitator notes

- Seed one commit title that is meaningless ("misc fixes") so the author-question path fires.
- Debrief prompt: when did support last learn about a change from a customer?

## Measure it next week

- **Signal:** agentic tasks per release manager in the Admin console Gemini usage report.
- **Outcome:** edits per release-notes Doc before approval; fewer edits means better first drafts.
- **Watch for:** customer lines that leak internal names; tighten the release Doc's flag list.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.0 - 2026-10-12
- First release: grouped customer and internal notes from merge emails, flag-aware exclusions,
  support brief and release post held for approval.
`,
    },
  ],
  'fn-devops-handoff': [
    {
      path: 'SKILL.md',
      content: `---
name: on-call-handoff-digest
namespace: google
version: "1.2"
description: Use when on-call engineers hand over shifts and the next engineer needs one page of open alerts, live incidents, watch items and pending changes drawn from alert emails, incident spaces and the change sheet.
license: Apache-2.0
surfaces: [Gmail, Chat, Docs]
runtime: long-running
approval: The handoff post or email, every time; the outgoing engineer approves before it reaches the next shift.
entitlement_cost_per_run_usd: 0.05
typical_runs_per_user_per_week: 5
outputs: schema/output.json
---

# On-call Handoff Digest

## When to use

- Alerts reach the on-call list by email, incidents are worked in Chat spaces, and changes are
  tracked in a shared Sheet or calendar.
- Handoffs are written from memory at the end of a long shift, and the next engineer reads a
  thread of contradicting replies.
- Good fit for SRE, platform and support on-call rotations of any size.
- Not for paging, acknowledging alerts or changing monitors. The digest reads Workspace only
  and never touches alerting or production systems.
- Signs it is working: shifts start with one page, and "I didn't know that was still open"
  disappears from incident reviews.

## How it runs

1. **Wake: T-45 minutes before shift end.** Reads alert emails to the on-call list during the
   shift, incident spaces active during the shift and the change sheet for the next 24 hours.
2. **Group.** Collapses repeated alerts by alert name and resource; separates resolved, still
   firing (no resolve email) and watch items mentioned in Chat.
3. **Checkpoint: draft handoff.** Drafts a one-page digest in the outgoing engineer's voice:
   live incidents, open alerts, watch items, changes in the next shift, things tried.
4. **Approval.** The outgoing engineer edits and approves the post to the on-call space (and the
   email to the rotation list, if configured).
5. **Wake: next shift's first question.** If the incoming engineer @mentions Gemini about an item,
   it answers from the same sources with links.
6. State lives in the digest Doc for that shift; the agent holds no memory between shifts.

## Instructions

1. Read only the on-call list, incident spaces active in the shift and the change sheet.
2. An alert is "open" if it fired in the shift and no matching resolve email followed.
3. Collapse duplicates; show the count and the first and last time.
4. Put live incidents first, then open alerts, then watch items, then upcoming changes.
5. Keep the digest under \`max_words\`. Link each item to its source email, message or row.
6. Never mark anything resolved on the agent's own judgement; quote the resolve message.
7. Never post or send without the outgoing engineer's approval.
8. Emit JSON matching \`schema/output.json\` for each handoff.

## Approvals & guardrails

- **Production and alerting:** no access; nothing is acknowledged, silenced or changed.
- **Post and email:** the outgoing engineer approves every handoff.
- **Scope:** reads only shift-window content from the listed sources.
- **Audit:** every line links its source; the approved digest is kept per shift.
- **Cost:** about $0.05 per handoff; five shifts a week for a typical rotation member.

## Examples

\`\`\`json
{
  "input": { "shift": "Tue 18:00 - Wed 07:00", "alert_emails": 41,
             "incident_spaces": ["inc-2291"], "changes_next_24h": 3 },
  "output": { "live_incidents": 0, "open_alerts": 2, "watch_items": 1,
              "upcoming_changes": 3, "status": "awaiting_approval" }
}
\`\`\`

## Parameters

\`\`\`yaml
draft_minutes_before_shift_end: 45
oncall_list: "oncall@cymbal-sandbox.example"
oncall_space: "On-call"
change_sheet: "Change requests"
max_words: 220
also_email_rotation: false
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "On-call Handoff Digest run",
  "type": "object",
  "required": ["shift", "outgoing", "incoming", "status", "items", "pending_approval"],
  "properties": {
    "shift": { "type": "string" },
    "outgoing": { "type": "string" },
    "incoming": { "type": "string" },
    "status": { "type": "string", "enum": ["drafting", "awaiting_approval", "posted"] },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "summary", "source"],
        "properties": {
          "kind": { "type": "string", "enum": ["live_incident", "open_alert", "watch_item", "upcoming_change", "resolved"] },
          "summary": { "type": "string" },
          "count": { "type": "integer", "minimum": 1 },
          "source": { "type": "string" }
        }
      }
    },
    "pending_approval": {
      "type": "object",
      "required": ["kind", "summary"],
      "properties": {
        "kind": { "type": "string", "enum": ["post_chat", "send_email"] },
        "summary": { "type": "string" }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "outgoing": "ana.ruiz@cymbal-sandbox.example",
  "incoming": "jordan.whitlock@cymbal-sandbox.example",
  "shift": "2026-11-10T18:00:00-05:00/2026-11-11T07:00:00-05:00",
  "alert_emails": [
    { "subject": "[ALERT] INC-2291 checkout p95 latency 4.8s", "count": 6 },
    { "subject": "[RESOLVED] checkout p95 latency", "count": 1 },
    { "subject": "[WARN] reporting-db disk 82%", "count": 1 },
    { "subject": "[WARN] reporting-db disk 85%", "count": 1 }
  ],
  "incident_spaces": ["inc-2291-checkout-latency"],
  "change_sheet_next_24h": [
    { "cr": "CR-5512", "change": "Release 4.12", "window": "Thu 10:00-12:00" },
    { "cr": "CR-5517", "change": "DB patch window", "window": "Thu 21:00-22:30", "note": "clashes with 4.12 soak" }
  ]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "shift": "Tue night -> Wed day",
  "outgoing": "ana.ruiz@cymbal-sandbox.example",
  "incoming": "jordan.whitlock@cymbal-sandbox.example",
  "status": "awaiting_approval",
  "items": [
    { "kind": "resolved", "summary": "INC-2291 checkout latency resolved 03:40 after rollback to 4.11.2; fix not yet merged.", "source": "chat: inc-2291, 03:40" },
    { "kind": "open_alert", "summary": "reporting-db disk warnings at 82% then 85%; no resolve email.", "count": 2, "source": "email: [WARN] reporting-db disk 85%" },
    { "kind": "upcoming_change", "summary": "Release 4.12 Thu 10:00-12:00.", "source": "sheet: Change requests, CR-5512" },
    { "kind": "upcoming_change", "summary": "DB patch window Thu 21:00 clashes with the 4.12 soak.", "source": "sheet: Change requests, CR-5517" }
  ],
  "pending_approval": { "kind": "post_chat", "summary": "Post the Tue night -> Wed day handoff to the On-call space." }
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab DevOps 3: Never start a shift blind

**Time box:** 30 minutes

## Objective

Let Gemini draft the end-of-shift handoff from alert emails, incident spaces and the change sheet,
so the next engineer reads one page. The outgoing engineer approves every handoff; nothing is
acknowledged or silenced.

## Setup

- **Seats:** pairs on Business or Enterprise seats in \`cymbal-sandbox.example\`: outgoing and
  incoming on-call engineer.
- **Data:** 41 seeded alert emails for one night shift, an incident space, a "Change requests"
  Sheet and an "On-call" Chat space. All synthetic; no alerting system connected.
- **Package:** \`google/on-call-handoff-digest@1.2\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Facilitator advances the clock to 45 minutes before shift end.
2. Outgoing: open the draft digest. Check that 41 alert emails became a handful of items.
3. Find the disk warning: is it listed as open because no resolve email followed?
4. Add one watch item of your own that wasn't in any email. Approve the post.
5. Incoming: @mention Gemini in the On-call space: "What did we try on the disk warning?"
   Check the answer links its source.
6. Ask the agent to "silence the disk alert". Confirm it declines.

## What good looks like

- [ ] Live incidents first, then open alerts, watch items and upcoming changes.
- [ ] Every item links its email, message or row.
- [ ] Nothing was marked resolved without a resolve message.
- [ ] The handoff was posted only after the outgoing engineer approved it.

## Entitlement check

About $0.05 per handoff, five shifts a week: 0.05 x 5 x 4.3 = about $1.08 a month.

## Facilitator notes

- The duplicate alerts are the point: show the collapse from 41 emails to a short list.
- Debrief prompt: what did you last miss at a handoff, and where was it written down?

## Measure it next week

- **Signal:** handoffs posted per on-call engineer in the Admin console Gemini usage report.
- **Outcome:** incoming engineers' follow-up questions per handoff; fewer means clearer digests.
- **Watch for:** digests near \`max_words\`; noisy alerts belong in a tuning ticket, not the handoff.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.2 - 2026-10-29
- Duplicate alerts collapsed with count and first/last time.
- Incoming engineer can ask follow-up questions in the On-call space.

## 1.1 - 2026-09-23
- Upcoming changes from the change sheet for the next 24 hours.

## 1.0 - 2026-08-26
- First release: shift-window digest from alert emails and incident spaces, approval to post.
`,
    },
  ],
  'fn-devops-changecal': [
    {
      path: 'SKILL.md',
      content: `---
name: change-calendar-coordinator
namespace: google
version: "0.9"
description: Use when change windows live in a shared Calendar and a change-request Sheet, and the team needs clashes with freezes, other changes and staffing spotted early with a reschedule drafted for approval.
license: Apache-2.0
surfaces: [Calendar, Sheets, Chat, Gmail]
runtime: long-running
approval: Every reschedule proposal, calendar change, Chat post and email; flags written to the agent's own column need no approval.
entitlement_cost_per_run_usd: 0.06
typical_runs_per_user_per_week: 4
outputs: schema/output.json
---

# Change Calendar Coordinator

## When to use

- Change windows are calendar events on a shared "Changes" calendar, and requests are tracked in a
  Sheet (or an export from the change tool dropped into Drive).
- Freezes, release days and on-call staffing are known in advance but checked by eye.
- Good fit for release managers, change managers and SRE leads.
- Not for approving changes or running them. The coordinator never touches deployment, change
  tooling or production; it reads the calendar and Sheet and drafts.
- Signs it is working: no change lands in a freeze, and clashes are found days ahead, not at the
  change advisory meeting.

## How it runs

1. **Daily sweep (08:00 local) and wake on new events.** Reads the Changes calendar and the
   change-request Sheet for the next \`horizon_days\`.
2. **Check.** For each change: overlaps another change on the same service, falls inside a freeze,
   runs past a freeze start, lacks an on-call engineer, or misses a required approver in the Sheet.
3. **Flag.** Writes the result to the agent's own column in the Sheet with a one-line reason.
4. **Checkpoint 1: reschedule draft.** For each clash, proposes up to \`slots_to_propose\` windows
   that avoid freezes and other changes, inside the owning team's working hours.
5. **Checkpoint 2: send proposal.** The user approves sending the proposal to the change owner.
   The event moves only when the owner accepts; the agent never moves it on its own.
6. **Weekly digest.** On Mondays, posts the week's change calendar to the change space (approval).

## Instructions

1. Treat the Sheet as the source of truth for approvals and owners, and the calendar for times.
2. Freezes come from events titled with \`freeze_keyword\` on the Changes calendar.
3. A clash is any overlap on the same service, or any change that starts or ends inside a freeze.
4. Proposed windows must avoid freezes, other changes on the same service and the owner's busy
   events, and stay inside working hours unless the original was out of hours.
5. Write flags only to the agent's column; never edit other columns or other teams' events.
6. Never move, create or delete a calendar event; propose and let the owner accept.
7. Never send email or post in Chat without approval.
8. Emit JSON matching \`schema/output.json\` after each sweep or wake.

## Approvals & guardrails

- **Change tooling and production:** no access; nothing is approved, scheduled or run.
- **Calendar:** proposals only; the owner accepts the new time.
- **Sheets:** writes only to its own flag column.
- **Audit:** every flag records the rule it broke and the events involved.
- **Cost:** about $0.06 per sweep; four a week, more during release weeks.

## Examples

\`\`\`json
{
  "input": { "cr": "CR-5517", "service": "orders-db", "window": "Thu 21:00-22:30",
             "other_change": "Release 4.12 soak until Fri 10:00" },
  "output": { "flag": "clash", "proposed_windows": ["Thu 06:00-07:30", "Wed 20:00-21:30"],
              "status": "awaiting_user_approval" }
}
\`\`\`

## Parameters

\`\`\`yaml
horizon_days: 14
sweep_time_local: "08:00"
freeze_keyword: "FREEZE"
slots_to_propose: 2
flag_column: "Calendar check (Gemini)"
change_space: "Changes"
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Change Calendar Coordinator run",
  "type": "object",
  "required": ["run_id", "horizon", "changes", "pending_approvals"],
  "properties": {
    "run_id": { "type": "string" },
    "horizon": { "type": "string" },
    "freezes": { "type": "array", "items": { "type": "string" } },
    "changes": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["cr", "change", "window", "flag"],
        "properties": {
          "cr": { "type": "string" },
          "change": { "type": "string" },
          "service": { "type": "string" },
          "window": { "type": "string" },
          "flag": { "type": "string", "enum": ["ok", "clash", "in_freeze", "runs_past_freeze", "no_oncall", "missing_approver"] },
          "reason": { "type": "string" },
          "proposed_windows": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "pending_approvals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["send_proposal", "post_chat", "send_email"] },
          "to": { "type": "string" },
          "summary": { "type": "string" }
        }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "user": "jordan.whitlock@cymbal-sandbox.example",
  "now": "2026-11-11T08:00:00-05:00",
  "freezes": [{ "title": "FREEZE - year-end peak", "start": "2026-11-13T18:00:00-05:00" }],
  "changes": [
    { "cr": "CR-5512", "change": "Release 4.12", "service": "web", "window": "2026-11-12T10:00/12:00", "owner": "release-mgmt@cymbal-sandbox.example" },
    { "cr": "CR-5517", "change": "DB patch window", "service": "orders-db", "window": "2026-11-12T21:00/22:30", "owner": "db-team@cymbal-sandbox.example" },
    { "cr": "CR-5520", "change": "Load balancer cert rotation", "service": "edge", "window": "2026-11-13T16:00/19:00", "owner": "network@cymbal-sandbox.example" },
    { "cr": "CR-5523", "change": "Reporting cluster disk expansion", "service": "reporting-db", "window": "2026-11-11T13:00/14:00", "owner": "data-platform@cymbal-sandbox.example" }
  ],
  "release_soak": { "service": "orders-db", "until": "2026-11-13T10:00:00-05:00" }
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "run_id": "ccc-2026-11-11-0800",
  "horizon": "2026-11-11/2026-11-25",
  "freezes": ["FREEZE - year-end peak from Fri 13 Nov 18:00"],
  "changes": [
    { "cr": "CR-5512", "change": "Release 4.12", "service": "web", "window": "Thu 10:00-12:00", "flag": "ok" },
    { "cr": "CR-5517", "change": "DB patch window", "service": "orders-db", "window": "Thu 21:00-22:30", "flag": "clash", "reason": "Overlaps the 4.12 soak on orders-db until Fri 10:00.", "proposed_windows": ["Thu 06:00-07:30", "Wed 20:00-21:30"] },
    { "cr": "CR-5520", "change": "Load balancer cert rotation", "service": "edge", "window": "Fri 16:00-19:00", "flag": "runs_past_freeze", "reason": "Ends one hour after the 18:00 freeze starts.", "proposed_windows": ["Fri 14:00-17:00"] },
    { "cr": "CR-5523", "change": "Reporting cluster disk expansion", "service": "reporting-db", "window": "Wed 13:00-14:00", "flag": "ok" }
  ],
  "pending_approvals": [
    { "kind": "send_proposal", "to": "db-team@cymbal-sandbox.example", "summary": "Move the DB patch window to Thu 06:00-07:30 (or Wed 20:00) to clear the 4.12 soak." },
    { "kind": "send_proposal", "to": "network@cymbal-sandbox.example", "summary": "Start the cert rotation at 14:00 Fri so it ends before the 18:00 freeze." }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab DevOps 4: A change calendar with no surprises

**Time box:** 35 minutes

## Objective

Have Gemini sweep two weeks of change windows against freezes, other changes and approvals, flag
clashes in the Sheet and draft reschedule proposals. Owners accept new times; the agent never moves
an event or touches change tooling.

## Setup

- **Seats:** groups of three on Business or Enterprise seats in \`cymbal-sandbox.example\`:
  release manager, DB team owner, network owner.
- **Data:** a shared "Changes" calendar with a year-end freeze, a "Change requests" Sheet with 12
  rows and a "Changes" Chat space. All synthetic.
- **Package:** \`google/change-calendar-coordinator@0.9\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Release manager: run "Check the next two weeks of changes" from the Sheet's side panel.
2. Read the flag column. Find the DB patch clash and the cert rotation that runs past the freeze.
3. Open the reschedule proposals. Check each avoids the freeze and the owner's busy time.
4. Approve sending the DB proposal. DB owner: accept the new time from your own seat and watch the
   flag clear on the next sweep.
5. Network owner: decline the proposal and reply with your own time. See the agent re-check it.
6. Release manager: try asking the agent to "move it for them". Confirm it only proposes.

## What good looks like

- [ ] Every clash names the rule and the events involved.
- [ ] No calendar event moved without its owner accepting.
- [ ] Only the agent's flag column changed in the Sheet.
- [ ] The weekly digest post waited for approval.

## Entitlement check

About $0.06 per sweep, four a week: 0.06 x 4 x 4.3 = about $1.03 a month.

## Facilitator notes

- The freeze starts mid-afternoon Friday on purpose; most attendees miss the overrun by eye.
- Debrief prompt: what was the last change that landed in a freeze, and who found out first?

## Measure it next week

- **Signal:** sweeps per release manager in the Admin console Gemini usage report.
- **Outcome:** clashes found more than 48 hours ahead versus at the change advisory meeting.
- **Watch for:** proposals declined repeatedly; owners' working hours may be wrong in Calendar.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 0.9 - 2026-10-27
- Runs-past-freeze check, not just starts-in-freeze.
- Reschedule proposals respect the owner's busy events and working hours.

## 0.8 - 2026-09-29
- First preview: overlap and freeze checks written to a dedicated Sheet column.
`,
    },
  ],
  'fn-secops-triage': [
    {
      path: 'SKILL.md',
      content: `---
name: alert-triage-digest
namespace: google
version: "1.1"
description: Use when a SOC receives security alerts by email and coordinates in a Chat space, and analysts need overnight and weekend alerts grouped into a ranked, sourced digest before the shift starts.
license: Apache-2.0
surfaces: [Gmail, Chat, Sheets, Meet]
runtime: long-running
approval: Any post outside the SOC space, any email and any change to proposed severity or owner; the digest post to the SOC space and rows in the agent's own triage tab need no approval.
entitlement_cost_per_run_usd: 0.07
typical_runs_per_user_per_week: 7
outputs: schema/output.json
---

# Alert Triage Digest

## When to use

- Detection tools email alerts to a SOC mailbox or Group, and analysts discuss them in a SOC Chat
  space. Exports from security tools may also land in Sheets.
- After nights and weekends, the first hour of every shift is spent de-duplicating email.
- Good fit for SOC analysts, SOC leads and small security teams without a dedicated triage tier.
- Not a detection or response tool. The digest has no access to security tooling: it never
  closes, suppresses, blocks or remediates anything. It reads Workspace and drafts.
- Signs it is working: analysts start on the top signals within minutes of the shift, and the
  stand-up spends its time on decisions.

## How it runs

1. **Wake: \`digest_time_local\` and on volume spikes.** Reads alert emails to the SOC mailbox since
   the last digest and messages in the SOC space over the same window.
2. **Group.** Collapses alerts into signals by rule name, entity (user, host, mailbox) and time
   proximity. Links signals that share an entity, such as failed MFA followed by a reset request.
3. **Rank.** Proposes a severity from the alert's own severity, entity sensitivity
   (\`sensitive_groups\`), correlation count and whether an analyst already commented in the space.
4. **Checkpoint 1: digest.** Posts the top \`top_n\` signals to the SOC space with sources and the
   line "Nothing has been changed or closed."
5. **Triage tab.** Writes every signal to the agent's tab in the triage Sheet with proposed
   severity and owner. Analysts set the final values; the agent never overwrites them.
6. **Wake: stand-up notes.** When the stand-up's Meet notes land, it records decisions against
   each signal in the tab.

## Instructions

1. Read only the SOC mailbox, the SOC space and the triage Sheet. Never read users' inboxes.
2. Every signal lists its source emails or messages; never summarise without a link.
3. Severity is a proposal. Never lower an alert's own severity without saying why.
4. Treat a signal as handled only when an analyst says so in the space; quote the message.
5. Never suggest that the agent will block, purge, disable or reset anything. Write
   recommendations as "Recommended for an analyst: ...".
6. Do not paste full email headers or payloads into Chat; summarise and link.
7. Never post outside the SOC space or email anyone without approval.
8. Emit JSON matching \`schema/output.json\` for each digest.

## Approvals & guardrails

- **Security tooling:** no access. Nothing is closed, suppressed, blocked or remediated.
- **Posting:** the SOC-space digest is automatic; any other post or email needs approval.
- **Sheets:** writes only to its own tab; analysts' severity and owner columns win.
- **Audit:** each signal links its source alerts, and the tab keeps every digest.
- **Cost:** about $0.07 per digest; one a day including weekends.

## Examples

\`\`\`json
{
  "input": { "window": "Sat 00:00 - Mon 06:00", "alert_emails": 214, "soc_messages": 37 },
  "output": { "signals": 31, "top": ["Failed MFA + reset request, finance user",
              "Payroll-update phishing campaign", "After-hours shared-drive downloads"],
              "changed_anything": false }
}
\`\`\`

## Parameters

\`\`\`yaml
digest_time_local: "06:00"
soc_mailbox: "soc-alerts@cymbal-sandbox.example"
soc_space: "SOC"
top_n: 3
correlation_window_minutes: 720
sensitive_groups: ["finance", "executives", "it-admins"]
triage_tab: "Triage (Gemini)"
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Alert Triage Digest run",
  "type": "object",
  "required": ["digest_id", "window", "alert_emails_read", "signals", "changed_anything"],
  "properties": {
    "digest_id": { "type": "string" },
    "window": { "type": "string" },
    "alert_emails_read": { "type": "integer", "minimum": 0 },
    "signals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["rank", "title", "alert_count", "proposed_severity", "sources"],
        "properties": {
          "rank": { "type": "integer", "minimum": 1 },
          "title": { "type": "string" },
          "entity": { "type": "string" },
          "alert_count": { "type": "integer", "minimum": 1 },
          "proposed_severity": { "type": "string", "enum": ["critical", "high", "medium", "low", "info"] },
          "proposed_owner": { "type": "string" },
          "correlated_with": { "type": "array", "items": { "type": "string" } },
          "handled_by_analyst": { "type": "boolean" },
          "recommendation": { "type": "string" },
          "sources": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "changed_anything": { "type": "boolean", "const": false }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "soc_mailbox": "soc-alerts@cymbal-sandbox.example",
  "window": "2026-11-07T00:00:00-05:00/2026-11-09T06:00:00-05:00",
  "alert_emails_summary": [
    { "rule": "Repeated MFA failure", "entity": "j.okafor@cymbal-sandbox.example", "count": 9, "first": "Sat 22:10", "last": "Sat 23:40", "severity": "medium" },
    { "rule": "Helpdesk password reset requested", "entity": "j.okafor@cymbal-sandbox.example", "count": 1, "first": "Sun 08:02", "severity": "info" },
    { "rule": "User-reported phishing", "entity": "phishing mailbox", "count": 17, "first": "Sat 09:14", "severity": "medium" },
    { "rule": "DLP: bulk download from shared drive", "entity": "contractor.lee@cymbal-sandbox.example", "count": 6, "first": "Sat 23:05", "severity": "medium" },
    { "rule": "Certificate expiring", "entity": "multiple", "count": 42, "severity": "low" }
  ],
  "soc_space_messages": [
    { "at": "Sun 10:12", "author": "Sam Osei", "text": "Saw the phishing reports, will look Monday." }
  ],
  "directory_groups": { "j.okafor@cymbal-sandbox.example": ["finance"] }
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "digest_id": "atd-2026-11-09-0600",
  "window": "Sat 00:00 - Mon 06:00",
  "alert_emails_read": 214,
  "signals": [
    { "rank": 1, "title": "Failed MFA followed by reset request, finance user", "entity": "j.okafor@cymbal-sandbox.example", "alert_count": 10, "proposed_severity": "high", "proposed_owner": "Nadia Haddad", "correlated_with": ["Helpdesk password reset requested, Sun 08:02"], "handled_by_analyst": false, "recommendation": "Recommended for an analyst: confirm with the user whether she requested the reset.", "sources": ["email: Repeated MFA failure x9", "email: Helpdesk password reset requested"] },
    { "rank": 2, "title": "Payroll-update phishing campaign", "entity": "phishing mailbox", "alert_count": 17, "proposed_severity": "high", "proposed_owner": "Sam Osei", "handled_by_analyst": false, "recommendation": "Recommended for an analyst: investigate as one campaign.", "sources": ["email: User-reported phishing x17", "chat: SOC, Sun 10:12"] },
    { "rank": 3, "title": "After-hours bulk downloads by a departing contractor", "entity": "contractor.lee@cymbal-sandbox.example", "alert_count": 6, "proposed_severity": "medium", "proposed_owner": "Leila Moreau", "handled_by_analyst": false, "sources": ["email: DLP bulk download x6"] }
  ],
  "changed_anything": false
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab SecOps 1: Start the shift with three signals, not 214 emails

**Time box:** 40 minutes

## Objective

Let Gemini read a weekend of alert emails and SOC Chat messages, group them into signals, rank
them with sources and post a digest. Analysts set every final severity and owner; the agent has no
access to security tooling and changes nothing.

## Setup

- **Seats:** groups of three on Business or Enterprise seats in \`cymbal-sandbox.example\`: SOC lead
  and two analysts.
- **Data:** 214 seeded alert emails in a SOC mailbox, a "SOC" Chat space with weekend messages and a
  triage Sheet. All synthetic; no security tools connected.
- **Package:** \`google/alert-triage-digest@1.1\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Facilitator triggers the 06:00 digest. Read it in the SOC space.
2. Open the sources for signal 1. Confirm the MFA alerts and the reset request were linked.
3. Open the triage tab. Change a proposed severity, then trigger another digest. Confirm the agent
   kept your value.
4. Ask the agent in the space to "disable the finance user's account". Confirm it declines and
   offers a recommendation for an analyst instead.
5. Run a five-minute stand-up with "Take notes for me" on. Afterwards, check the decisions were
   recorded against each signal.

## What good looks like

- [ ] 214 emails became about 30 signals, each with sources.
- [ ] Related alerts were correlated across rules.
- [ ] Analysts' severity and owner values were never overwritten.
- [ ] The digest says plainly that nothing was changed or closed.

## Entitlement check

About $0.07 per digest, seven a week: 0.07 x 7 x 4.3 = about $2.11 a month.

## Facilitator notes

- The reset request arrives ten hours after the MFA failures; the correlation window must cover it.
- Expect "can it just close the low ones?" No: closing is an analyst decision in the security tool.
- Debrief prompt: how long did your last Monday triage take before the first real investigation?

## Measure it next week

- **Signal:** digests read per analyst in the Admin console Gemini usage report.
- **Outcome:** minutes from shift start to the first high signal being claimed.
- **Watch for:** severities analysts change often; adjust \`sensitive_groups\`.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.1 - 2026-10-30
- Correlation across rules by shared entity within \`correlation_window_minutes\`.
- Stand-up decisions recorded from Meet notes.

## 1.0 - 2026-09-15
- First release: grouped, ranked, sourced digest to the SOC space and a triage tab.
`,
    },
  ],
  'fn-secops-phishing': [
    {
      path: 'SKILL.md',
      content: `---
name: phishing-report-investigator
namespace: google
version: "1.0"
description: Use when users report suspicious email to a phishing mailbox and analysts need each report examined, clustered into campaigns and answered quickly, with a verdict an analyst approves.
license: Apache-2.0
surfaces: [Gmail, Chat, Sheets]
runtime: long-running
approval: Every verdict, every reply to a reporter and every Chat post outside the triage space; recommendations for blocking or removal are carried out by an analyst in their own tools.
entitlement_cost_per_run_usd: 0.04
typical_runs_per_user_per_week: 10
outputs: schema/output.json
---

# Phishing Report Investigator

## When to use

- Users report suspicious email with the Gmail "Report phishing" flow or by forwarding to a
  phishing mailbox your security team reads.
- Analysts open each report by hand, and reporters wait hours for "thanks, it's malicious" or
  "safe to use".
- Good fit for SOC analysts and IT security generalists in small and mid-size teams.
- Not for blocking, purging or quarantining. The investigator has no access to security tooling or
  other users' mailboxes; it reads the phishing mailbox and drafts.
- Signs it is working: reporters hear back the same morning, and campaigns are spotted from
  the second report, not the seventeenth.

## How it runs

1. **Wake: new report.** A message in the phishing mailbox wakes the agent; a burst is processed
   as one batch.
2. **Examine.** Reads the reported message as delivered to the mailbox: sender, reply-to, display
   name, links, attachment names and wording. It does not open links or attachments.
3. **Cluster.** Groups reports into campaigns by sender domain, link target domain and subject
   similarity, and checks the log Sheet for earlier matches.
4. **Checkpoint 1: verdicts.** Posts proposed verdicts (\`phishing\`, \`spam\`, \`safe\`,
   \`needs_analyst\`) to the triage space with the indicators and a recommendation for an analyst.
5. **Checkpoint 2: replies.** After an analyst confirms a verdict, drafts replies to every reporter
   in that cluster. The analyst approves the batch.
6. **Log.** Writes each report, cluster and confirmed verdict to the log Sheet.

## Instructions

1. Read only the phishing mailbox and the log Sheet. Never search other users' mailboxes.
2. Never open links or attachments; reason from headers, domains, names and text only.
3. Look-alike domains, mismatched reply-to, urgent payment or credential requests and links to
   non-company login pages raise the verdict; known newsletters on the allow list lower it.
4. A verdict is a proposal until an analyst confirms it in the triage space.
5. Recommendations are for an analyst to carry out in their own tools: "Recommended: block the
   sender domain and remove the messages from mailboxes."
6. Reporter replies thank the reporter, state the verdict in one sentence, and say what to do if
   they clicked. No indicators or technical detail.
7. Never send replies or post outside the triage space without approval.
8. Emit JSON matching \`schema/output.json\` for each batch.

## Approvals & guardrails

- **Security tooling and mailboxes:** no access; nothing is blocked, purged or quarantined.
- **Verdicts:** proposed by the agent, confirmed by an analyst.
- **Replies:** drafted per cluster, sent only after approval.
- **Audit:** the log Sheet keeps each report, indicators, verdict and who confirmed it.
- **Cost:** about $0.04 per batch; ten batches a week for an analyst on rotation.

## Examples

\`\`\`json
{
  "input": { "reports": 23, "window": "Sat 09:12 - Mon 08:00" },
  "output": { "clusters": 1, "singletons": 2, "safe": 4,
              "top_cluster": { "reports": 17, "proposed_verdict": "phishing",
                               "indicator": "look-alike sender domain" } }
}
\`\`\`

## Parameters

\`\`\`yaml
phishing_mailbox: "phishing@cymbal-sandbox.example"
triage_space: "Phishing triage"
log_sheet: "Phishing reports log"
cluster_min_reports: 2
allow_list_senders: ["newsletter@cymbal-sandbox.example"]
reply_from: "security@cymbal-sandbox.example"
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Phishing Report Investigator batch",
  "type": "object",
  "required": ["batch_id", "reports_read", "clusters", "pending_approvals"],
  "properties": {
    "batch_id": { "type": "string" },
    "reports_read": { "type": "integer", "minimum": 0 },
    "clusters": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["cluster_id", "reports", "proposed_verdict", "indicators"],
        "properties": {
          "cluster_id": { "type": "string" },
          "subject": { "type": "string" },
          "sender_domain": { "type": "string" },
          "reports": { "type": "integer", "minimum": 1 },
          "proposed_verdict": { "type": "string", "enum": ["phishing", "spam", "safe", "needs_analyst"] },
          "confirmed_by": { "type": "string" },
          "indicators": { "type": "array", "items": { "type": "string" } },
          "recommendation": { "type": "string" }
        }
      }
    },
    "pending_approvals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "count", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["confirm_verdict", "send_replies", "post_chat"] },
          "count": { "type": "integer", "minimum": 1 },
          "summary": { "type": "string" }
        }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "phishing_mailbox": "phishing@cymbal-sandbox.example",
  "reports": [
    { "reported_by": "tom.becker@cymbal-sandbox.example", "subject": "Payroll update required", "from": "payroll-notice@cymbal-sandbox-payroll.example", "reply_to": "hr.update.desk@freemail.example", "link_domains": ["login-cymbal-sandbox.example"], "received": "2026-11-07T09:14:00-05:00" },
    { "reported_by": "grace.kim@cymbal-sandbox.example", "subject": "Payroll update required", "from": "payroll-notice@cymbal-sandbox-payroll.example", "reply_to": "hr.update.desk@freemail.example", "link_domains": ["login-cymbal-sandbox.example"], "received": "2026-11-07T09:16:00-05:00" },
    { "reported_by": "omar.haddad@cymbal-sandbox.example", "subject": "November product digest", "from": "newsletter@cymbal-sandbox.example", "link_domains": ["cymbal-sandbox.example"], "received": "2026-11-08T07:00:00-05:00" }
  ],
  "more_reports_in_batch": 20,
  "log_sheet_matches": []
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "batch_id": "pri-2026-11-09-0800",
  "reports_read": 23,
  "clusters": [
    { "cluster_id": "C-118", "subject": "Payroll update required", "sender_domain": "cymbal-sandbox-payroll.example", "reports": 17, "proposed_verdict": "phishing", "indicators": ["Look-alike sender domain", "Reply-to on a free-mail domain", "Link to a non-company login page", "Urgent payroll request"], "recommendation": "Recommended for an analyst: block the sender domain and remove the messages from mailboxes." },
    { "cluster_id": "C-119", "subject": "November product digest", "sender_domain": "cymbal-sandbox.example", "reports": 4, "proposed_verdict": "safe", "indicators": ["Sender on allow list", "Links to company domain only"] },
    { "cluster_id": "S-120", "subject": "Invoice 88213 overdue", "reports": 1, "proposed_verdict": "needs_analyst", "indicators": ["Attachment name ends in .html"] },
    { "cluster_id": "S-121", "subject": "Shared file: Q4 plan", "reports": 1, "proposed_verdict": "needs_analyst", "indicators": ["Display name matches an executive; sender domain is external"] }
  ],
  "pending_approvals": [
    { "kind": "confirm_verdict", "count": 2, "summary": "Confirm phishing for C-118 (17 reports) and safe for C-119 (4 reports)." },
    { "kind": "send_replies", "count": 21, "summary": "17 'confirmed phishing' and 4 'safe to use' replies, sent after verdicts are confirmed." }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab SecOps 2: Answer every phishing report before lunch

**Time box:** 35 minutes

## Objective

Have Gemini examine a weekend of reported emails, cluster them into a campaign, propose verdicts
and draft replies to every reporter. Analysts confirm verdicts and take any blocking action in
their own tools; the agent never touches mailboxes or security tooling.

## Setup

- **Seats:** pairs on Business or Enterprise seats in \`cymbal-sandbox.example\`: two analysts.
- **Data:** 23 seeded reports in a phishing mailbox (one 17-report campaign, a newsletter, two
  oddities), a "Phishing triage" Chat space and a log Sheet. All synthetic; links are inert.
- **Package:** \`google/phishing-report-investigator@1.0\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Analyst 1: trigger the batch and read the proposed verdicts in the triage space.
2. Check the campaign's indicators. Which one would you have spotted first by eye?
3. Confirm the phishing and safe verdicts. Leave the two singletons as \`needs_analyst\`.
4. Review the 21 reply drafts. Edit the "if you clicked" sentence to match your policy, then
   approve the batch.
5. Analyst 2: ask the agent to "purge the campaign". Confirm it declines and points to your tools.
6. Open the log Sheet and check who confirmed each verdict.

## What good looks like

- [ ] 17 reports became one campaign with clear indicators.
- [ ] No link or attachment was opened by the agent.
- [ ] Replies went out only after the verdict and the batch were approved.
- [ ] The log shows who confirmed each verdict.

## Entitlement check

About $0.04 per batch, ten batches a week: 0.04 x 10 x 4.3 = about $1.72 a month.

## Facilitator notes

- The look-alike domain is close enough to fool a skim; that's the point of step 2.
- Debrief prompt: how long did reporters wait for an answer last time there was a campaign?

## Measure it next week

- **Signal:** batches per analyst in the Admin console Gemini usage report.
- **Outcome:** median time from report to reply, compared with last month.
- **Watch for:** many \`needs_analyst\` verdicts; add known senders to the allow list.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.0 - 2026-10-19
- First release: indicator-based verdicts without opening links, campaign clustering, reporter
  replies per cluster held for approval, log Sheet.
`,
    },
  ],
  'fn-secops-access': [
    {
      path: 'SKILL.md',
      content: `---
name: access-review-chaser
namespace: google
version: "1.0"
description: Use when a quarterly access review runs from a Sheet export of accounts and roles, and security or GRC needs every manager chased for keep or remove decisions and every answer logged by the deadline.
license: Apache-2.0
surfaces: [Sheets, Gmail, Chat]
runtime: long-running
approval: Every reminder, escalation and hand-off to the identity team; answers to managers' questions about their own rows need no approval.
entitlement_cost_per_run_usd: 0.25
typical_runs_per_user_per_week: 1
outputs: schema/output.json
---

# Access Review Chaser

## When to use

- Access reviews run from a Sheet: an export of accounts, systems and roles, one block of rows per
  manager, with a decision column (keep, remove) and a reason column.
- The review owner spends the last week chasing managers and explaining what roles mean.
- Good fit for SOC leads, GRC analysts and IT security for SOC 2, ISO 27001 or internal reviews.
- Not for changing access. The chaser has no access to identity or security tooling; removals are
  handed to the identity team as a list for them to action.
- Signs it is working: reviews close on time, and evidence of each decision is already in the
  Sheet when auditors ask.

## How it runs

1. **Kickoff.** Reads the review Sheet, groups rows by manager and drafts one request each with a
   link to their filtered view and the deadline. The review owner approves the batch.
2. **Daily sweep (10:00 local).** Counts decided and open rows per manager and updates the agent's
   status tab.
3. **Checkpoint 1: reminders.** Managers with open rows get a drafted reminder naming the count and
   systems. One per manager per day at most.
4. **Wake: @mention in the review space.** Answers questions about a role from the entitlement
   catalog Sheet and last quarter's decisions on that row.
5. **Escalation.** After \`escalate_after_days\` with no progress, drafts a note to the manager's
   manager for approval.
6. **Checkpoint 2: hand-off.** At the deadline, compiles all "remove" decisions into a list for the
   identity team and drafts the hand-off email for approval.

## Instructions

1. The review Sheet is the source of truth; never add, delete or edit decision cells.
2. Show managers only their own rows; never list another manager's people.
3. Explain roles from the entitlement catalog only; if a role is missing, say so.
4. Mention last quarter's decision when it exists ("kept for handover in Q3").
5. Admin roles kept without a reason are flagged back to the manager, not accepted silently.
6. Never claim access has been removed. Removal is the identity team's action, after hand-off.
7. Never send reminders, escalations or the hand-off without approval.
8. Emit JSON matching \`schema/output.json\` after each sweep.

## Approvals & guardrails

- **Identity and security tooling:** no access; nothing is granted, removed or disabled.
- **Sheets:** writes only to its status tab; decision cells belong to managers.
- **Email and Chat:** reminders, escalations and the hand-off are drafts until approved.
- **Audit:** the status tab records each reminder and when each decision was made.
- **Cost:** about $0.25 per sweep that drafts reminders; weekly outside review month, daily in it.

## Examples

\`\`\`json
{
  "input": { "manager": "Marco Silva", "rows": 14, "decided": 8,
             "systems": ["claims"], "deadline": "2026-11-13" },
  "output": { "open": 6, "status": "behind", "action": "reminder_drafted",
              "admin_keep_without_reason": 0 }
}
\`\`\`

## Parameters

\`\`\`yaml
review_sheet: "Q4 access review"
catalog_sheet: "Entitlement catalog"
sweep_time_local: "10:00"
escalate_after_days: 3
review_space: "Q4 access review"
identity_team: "identity-ops@cymbal-sandbox.example"
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Access Review Chaser sweep",
  "type": "object",
  "required": ["review", "deadline", "managers", "totals", "pending_approvals"],
  "properties": {
    "review": { "type": "string" },
    "deadline": { "type": "string", "format": "date" },
    "managers": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["manager", "rows", "decided", "status"],
        "properties": {
          "manager": { "type": "string" },
          "email": { "type": "string" },
          "rows": { "type": "integer", "minimum": 0 },
          "decided": { "type": "integer", "minimum": 0 },
          "removals": { "type": "integer", "minimum": 0 },
          "status": { "type": "string", "enum": ["done", "on_track", "behind", "escalated"] },
          "flags": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "totals": {
      "type": "object",
      "required": ["rows", "decided", "removals"],
      "properties": {
        "rows": { "type": "integer", "minimum": 0 },
        "decided": { "type": "integer", "minimum": 0 },
        "removals": { "type": "integer", "minimum": 0 }
      }
    },
    "pending_approvals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["reminder", "escalation", "identity_handoff"] },
          "to": { "type": "string" },
          "summary": { "type": "string" }
        }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "review_owner": "nadia.haddad@cymbal-sandbox.example",
  "review": "Q4 access review",
  "deadline": "2026-11-13",
  "now": "2026-11-09T10:00:00-05:00",
  "managers": [
    { "manager": "Marco Silva", "email": "marco.silva@cymbal-sandbox.example", "rows": 14, "decided": 8, "removals": 1 },
    { "manager": "Priya Nair", "email": "priya.nair@cymbal-sandbox.example", "rows": 9, "decided": 9, "removals": 2 },
    { "manager": "Owen Park", "email": "owen.park@cymbal-sandbox.example", "rows": 22, "decided": 3, "removals": 0, "admin_keep_without_reason": 1 }
  ]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "review": "Q4 access review",
  "deadline": "2026-11-13",
  "managers": [
    { "manager": "Marco Silva", "email": "marco.silva@cymbal-sandbox.example", "rows": 14, "decided": 8, "removals": 1, "status": "behind", "flags": [] },
    { "manager": "Priya Nair", "email": "priya.nair@cymbal-sandbox.example", "rows": 9, "decided": 9, "removals": 2, "status": "done", "flags": [] },
    { "manager": "Owen Park", "email": "owen.park@cymbal-sandbox.example", "rows": 22, "decided": 3, "removals": 0, "status": "behind", "flags": ["Admin role kept without a reason (row 61)"] }
  ],
  "totals": { "rows": 45, "decided": 20, "removals": 3 },
  "pending_approvals": [
    { "kind": "reminder", "to": "marco.silva@cymbal-sandbox.example", "summary": "6 decisions left, all on the claims system. Due Fri 17:00." },
    { "kind": "reminder", "to": "owen.park@cymbal-sandbox.example", "summary": "19 decisions left; row 61 needs a reason for keeping an admin role. Due Fri 17:00." }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab SecOps 3: Close the access review on time

**Time box:** 35 minutes

## Objective

Let Gemini run the chase for a quarterly access review: one request per manager, daily status,
answers about roles in Chat and a clean hand-off of removals to the identity team. Managers decide;
the identity team acts; the agent changes no access.

## Setup

- **Seats:** groups of three on Business or Enterprise seats in \`cymbal-sandbox.example\`: review
  owner and two managers.
- **Data:** a "Q4 access review" Sheet with 45 rows across three managers, an "Entitlement catalog"
  Sheet and a "Q4 access review" Chat space. All synthetic; no identity system connected.
- **Package:** \`google/access-review-chaser@1.0\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Review owner: run "Start the Q4 review, due Friday 17:00". Approve the batch of three requests.
2. Manager 1: in the review space, ask "@Gemini what is fin-ap-approver?" Check the answer cites
   the catalog and last quarter's decision.
3. Manager 1: mark three rows Remove. Manager 2: mark an admin role Keep with no reason.
4. Facilitator advances to the next sweep. Review owner: read the status tab and the reminder
   drafts. Confirm the admin-role flag went back to Manager 2.
5. Ask the agent to "remove the access now". Confirm it declines and explains the hand-off.
6. Facilitator advances to the deadline. Review the hand-off list and approve the email.

## What good looks like

- [ ] Each manager saw only their own rows.
- [ ] No decision cell was edited by the agent.
- [ ] Admin roles kept without a reason were flagged back.
- [ ] Removals reached the identity team as an approved hand-off list.

## Entitlement check

About $0.25 per sweep, one a week averaged across the quarter: 0.25 x 1 x 4.3 = about $1.08 a
month.

## Facilitator notes

- Debrief prompt: which managers were late last quarter, and what did they ask you?

## Measure it next week

- **Signal:** sweeps and Chat answers per review owner in the Admin console Gemini usage report.
- **Outcome:** share of rows decided by the deadline, compared with last quarter.
- **Watch for:** roles missing from the catalog; add them before the next review.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.0 - 2026-10-21
- First release: per-manager requests and reminders, role answers from the catalog, admin-role
  reason checks, identity hand-off list held for approval.
`,
    },
  ],
  'fn-secops-evidence': [
    {
      path: 'SKILL.md',
      content: `---
name: audit-evidence-collector
namespace: google
version: "0.9"
description: Use when a security or GRC team prepares for an audit and needs evidence in Drive matched to each control, stale or missing items found, and control owners asked for exactly what is needed.
license: Apache-2.0
surfaces: [Drive, Sheets, Gmail, Docs]
runtime: long-running
approval: Every request to a control owner, any change to the evidence index outside the agent's columns and any sharing with auditors; matching and indexing need no approval.
entitlement_cost_per_run_usd: 0.28
typical_runs_per_user_per_week: 1
outputs: schema/output.json
---

# Audit Evidence Collector

## When to use

- A control list (SOC 2, ISO 27001 or internal) lives in a Sheet with an evidence description and
  owner per control, and evidence is stored in a Drive folder per audit period.
- Before fieldwork, the team hunts through folders and inboxes for screenshots, exports and
  sign-offs, then chases owners for the rest.
- Good fit for GRC analysts, SOC leads and compliance managers.
- Not for producing evidence from security tools. The collector has no access to security or
  identity tooling; it finds what is already in Drive and asks owners for the rest.
- Signs it is working: gaps are known weeks before fieldwork, and auditors' requests are answered
  from the index.

## How it runs

1. **Weekly sweep (Mondays 09:00) and wake on new files.** Reads the control list and the audit
   folder, including subfolders named by control ID.
2. **Match.** Matches files to controls by folder, file name and content (for Docs and Sheets),
   within the audit period.
3. **Classify.** Each control is \`found\`, \`stale\` (evidence older than the period start),
   \`partial\` or \`missing\`. Writes results to the agent's columns in the index Sheet.
4. **Checkpoint 1: gap list.** Writes a short gap memo Doc grouped by owner.
5. **Checkpoint 2: owner requests.** Drafts one request per owner listing controls, the evidence
   needed, the period and the folder to use. The GRC lead approves sending.
6. **Wake: file added.** A new file in a control folder is matched and the index updated.
7. **Pre-fieldwork.** Proposes the auditor share list for approval; never shares on its own.

## Instructions

1. The control list is the source of truth for controls, owners and evidence descriptions.
2. Evidence must fall within the audit period; older files are \`stale\`, not \`found\`.
3. Match on content, not just file names; cite the file and, for Docs, the heading.
4. Write only to the agent's columns in the index; never edit control descriptions or owners.
5. Requests name the control ID, what evidence is needed, the period and the folder link.
6. Never paste evidence contents into emails; link files and rely on their access settings.
7. Never change Drive sharing; report access gaps instead.
8. Never send requests or share with auditors without approval.
9. Emit JSON matching \`schema/output.json\` after each sweep.

## Approvals & guardrails

- **Security tooling:** no access; evidence comes only from files already in Drive.
- **Requests:** drafts until the GRC lead approves.
- **Sharing:** never changed by the agent; auditor shares are proposed for approval.
- **Audit trail:** the index records each match, its file and when it was found.
- **Cost:** about $0.28 per weekly sweep across 60-120 controls.

## Examples

\`\`\`json
{
  "input": { "control": "CC8.1 Change management", "period": "2026-01-01/2026-12-31",
             "files": ["Change approvals export 2026-06-30.xlsx"] },
  "output": { "status": "stale", "reason": "Latest export ends 30 Jun; period runs to 31 Dec.",
              "request_drafted": true }
}
\`\`\`

## Parameters

\`\`\`yaml
control_sheet: "SOC 2 controls 2026"
audit_folder: "Audit/2026"
sweep_day: "Monday"
sweep_time_local: "09:00"
stale_if_before_period_start: true
index_columns: ["Evidence (Gemini)", "Last updated (Gemini)", "Status (Gemini)"]
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Audit Evidence Collector sweep",
  "type": "object",
  "required": ["audit", "period", "controls", "summary", "pending_approvals"],
  "properties": {
    "audit": { "type": "string" },
    "period": { "type": "string" },
    "controls": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["control_id", "title", "status"],
        "properties": {
          "control_id": { "type": "string" },
          "title": { "type": "string" },
          "owner": { "type": "string" },
          "status": { "type": "string", "enum": ["found", "partial", "stale", "missing"] },
          "evidence": { "type": "array", "items": { "type": "string" } },
          "last_updated": { "type": "string" },
          "reason": { "type": "string" }
        }
      }
    },
    "summary": {
      "type": "object",
      "required": ["found", "partial", "stale", "missing"],
      "properties": {
        "found": { "type": "integer", "minimum": 0 },
        "partial": { "type": "integer", "minimum": 0 },
        "stale": { "type": "integer", "minimum": 0 },
        "missing": { "type": "integer", "minimum": 0 }
      }
    },
    "pending_approvals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["owner_request", "auditor_share"] },
          "to": { "type": "string" },
          "summary": { "type": "string" }
        }
      }
    },
    "access_warnings": { "type": "array", "items": { "type": "string" } }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "grc_lead": "nadia.haddad@cymbal-sandbox.example",
  "audit": "SOC 2 Type II 2026",
  "period": "2026-01-01/2026-12-31",
  "controls": [
    { "control_id": "CC6.2", "title": "Access reviews", "owner": "nadia.haddad@cymbal-sandbox.example" },
    { "control_id": "CC7.3", "title": "Incident response", "owner": "sre-leads@cymbal-sandbox.example" },
    { "control_id": "CC8.1", "title": "Change management", "owner": "it-ops@cymbal-sandbox.example" },
    { "control_id": "CC6.6", "title": "MFA enforcement", "owner": "identity-ops@cymbal-sandbox.example" },
    { "control_id": "CC9.2", "title": "Vendor review", "owner": "procurement@cymbal-sandbox.example" }
  ],
  "folder_files": [
    { "path": "Audit/2026/CC6.2/Q3 access review (signed).gsheet", "modified": "2026-10-02" },
    { "path": "Audit/2026/CC7.3/INC-2207 postmortem.gdoc", "modified": "2026-09-18" },
    { "path": "Audit/2026/CC8.1/Change approvals export 2026-06-30.xlsx", "modified": "2026-06-30" }
  ]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "audit": "SOC 2 Type II 2026",
  "period": "2026-01-01/2026-12-31",
  "controls": [
    { "control_id": "CC6.2", "title": "Access reviews", "owner": "nadia.haddad@cymbal-sandbox.example", "status": "found", "evidence": ["Audit/2026/CC6.2/Q3 access review (signed)"], "last_updated": "2026-10-02" },
    { "control_id": "CC7.3", "title": "Incident response", "owner": "sre-leads@cymbal-sandbox.example", "status": "found", "evidence": ["Audit/2026/CC7.3/INC-2207 postmortem"], "last_updated": "2026-09-18" },
    { "control_id": "CC8.1", "title": "Change management", "owner": "it-ops@cymbal-sandbox.example", "status": "partial", "evidence": ["Audit/2026/CC8.1/Change approvals export 2026-06-30"], "last_updated": "2026-06-30", "reason": "Export covers January to June only; July to October needed." },
    { "control_id": "CC6.6", "title": "MFA enforcement", "owner": "identity-ops@cymbal-sandbox.example", "status": "missing", "evidence": [], "reason": "No file in the control folder or elsewhere in Audit/2026." },
    { "control_id": "CC9.2", "title": "Vendor review", "owner": "procurement@cymbal-sandbox.example", "status": "missing", "evidence": [], "reason": "No file in the control folder or elsewhere in Audit/2026." }
  ],
  "summary": { "found": 2, "partial": 1, "stale": 0, "missing": 2 },
  "pending_approvals": [
    { "kind": "owner_request", "to": "it-ops@cymbal-sandbox.example", "summary": "CC8.1: change-approval export for 1 Jul - 31 Oct into Audit/2026/CC8.1 by 20 Nov." },
    { "kind": "owner_request", "to": "identity-ops@cymbal-sandbox.example", "summary": "CC6.6: MFA enforcement settings screenshot and policy export for 2026 by 20 Nov." },
    { "kind": "owner_request", "to": "procurement@cymbal-sandbox.example", "summary": "CC9.2: 2026 vendor review sign-offs for critical vendors by 20 Nov." }
  ],
  "access_warnings": []
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab SecOps 4: Know your audit gaps weeks early

**Time box:** 40 minutes

## Objective

Have Gemini index an audit folder against the control list, find what is stale or missing and draft
precise requests to control owners. Owners supply evidence; the GRC lead approves every request and
every auditor share.

## Setup

- **Seats:** groups of three on Business or Enterprise seats in \`cymbal-sandbox.example\`: GRC lead
  and two control owners (IT Ops, Identity).
- **Data:** a "SOC 2 controls 2026" Sheet with 20 controls and an "Audit/2026" shared drive folder
  with partial, stale and misnamed evidence. All synthetic.
- **Package:** \`google/audit-evidence-collector@0.9\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. GRC lead: run "Index Audit/2026 against the SOC 2 controls" from the Sheet's side panel.
2. Read the agent's columns. Find one \`partial\`, one \`stale\` and two \`missing\` controls.
3. Find the misnamed file the agent matched by content. Check the cited heading.
4. Open the gap memo Doc. Review the three owner requests; edit one due date and approve them.
5. IT Ops owner: drop the missing export into the control folder. Watch the index update.
6. GRC lead: ask the agent to share the folder with the auditor. Review the proposed share list
   and decide; confirm nothing was shared before you approved.

## What good looks like

- [ ] Every control has a status and, where found, a cited file.
- [ ] Old evidence was marked stale, not found.
- [ ] Requests name the control, evidence, period and folder.
- [ ] No sharing changed without approval.

## Entitlement check

About $0.28 per weekly sweep: 0.28 x 1 x 4.3 = about $1.20 a month for the GRC lead. Control
owners who only receive requests spend nothing.

## Facilitator notes

- Debrief prompt: which control did you scramble for during last year's fieldwork?

## Measure it next week

- **Signal:** sweeps per GRC lead in the Admin console Gemini usage report.
- **Outcome:** controls with complete evidence, week over week, before fieldwork.
- **Watch for:** many content-only matches; agree folder names with owners.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 0.9 - 2026-10-28
- Content matching for Docs and Sheets, citing the heading or tab.
- \`partial\` status for evidence that covers only part of the period.

## 0.8 - 2026-09-30
- First preview: folder-to-control matching and owner requests held for approval.
`,
    },
  ],
  'fn-revops-hygiene': [
    {
      path: 'SKILL.md',
      content: `---
name: pipeline-hygiene-nudger
namespace: google
version: "1.1"
description: Use when RevOps reviews a weekly pipeline export in Sheets and needs stale, past-dated and incomplete deals fixed by their reps before forecast call, without DMing every rep by hand.
license: Apache-2.0
surfaces: [Sheets, Chat, Gmail]
runtime: long-running
approval: Every nudge to a rep and every message to a sales manager; flags written to the agent's own tab need no approval.
entitlement_cost_per_run_usd: 0.08
typical_runs_per_user_per_week: 2
outputs: schema/output.json
---

# Pipeline Hygiene Nudger

## When to use

- Open pipeline is exported from the CRM to a Sheet in Drive on a schedule (nightly or before
  forecast call).
- RevOps filters the same issues every week, then DMs reps one by one: past close dates, commit
  deals without next steps, missing amounts, stage and field mismatches.
- Good fit for RevOps managers, sales ops analysts and first-line sales managers.
- Not for editing the CRM. The nudger works only on the export in Sheets; reps fix their own
  deals in the CRM.
- Signs it is working: fewer stale deals at call time, and forecast call stops being a data
  clean-up session.

## How it runs

1. **Wake: export lands.** A new or updated pipeline export in the configured folder wakes the
   agent (or at \`run_time_local\` on forecast day).
2. **Check.** Applies the hygiene rules to every open deal: close date in the past, no next step
   for \`next_step_max_days\`, amount zero beyond stage 2, stage requirements not met.
3. **Flag.** Writes issues to the agent's tab with deal, rep, rule and amount, sorted by amount.
4. **Checkpoint 1: nudges.** Drafts one Chat DM per rep listing only their deals and the exact fix.
   The user approves the batch; nothing is sent automatically.
5. **Wake: next export.** Re-checks flagged deals and marks them fixed or still open.
6. **Checkpoint 2: manager summary.** Before the call, drafts a per-manager summary of deals still
   open, for approval.

## Instructions

1. Use only the latest export; never read or write the CRM.
2. Apply rules exactly as configured; list the rule ID with each flag.
3. Sort flags by amount, largest first; skip deals below \`min_amount\`.
4. One nudge per rep per run, listing all their deals; never more than two nudges per rep per day.
5. Nudges are specific: deal, issue, the fix, and the deadline before the call. Under 60 words.
6. Never shame reps in shared spaces; nudges are DMs, manager summaries go to managers only.
7. Respect known exceptions in the exceptions tab; do not flag them again.
8. Never send without approval.
9. Emit JSON matching \`schema/output.json\` after each run.

## Approvals & guardrails

- **CRM:** no access; reps fix deals themselves.
- **Chat and email:** every nudge and manager summary is approved before sending.
- **Sheets:** writes only to its own tab and reads the exceptions tab.
- **Audit:** each flag records the rule and the export it came from.
- **Cost:** about $0.08 per run over 300-600 open deals; two runs a week.

## Examples

\`\`\`json
{
  "input": { "deal": "Northgate Freight - new", "rep": "Diego Ramos", "category": "commit",
             "days_since_next_step": 21, "amount": 96000 },
  "output": { "rule": "H2", "issue": "Commit with no next step in 21 days",
              "nudge": "Add a next step or move to best case before 14:00." }
}
\`\`\`

## Parameters

\`\`\`yaml
export_folder: "RevOps/Pipeline exports"
run_time_local: "06:00"
next_step_max_days: 14
min_amount: 5000
rules: ["H1 close date passed", "H2 commit without next step", "H3 zero amount after stage 2", "H4 stage requirements"]
exceptions_tab: "Exceptions"
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Pipeline Hygiene Nudger run",
  "type": "object",
  "required": ["run_id", "export", "deals_checked", "flags", "pending_approvals"],
  "properties": {
    "run_id": { "type": "string" },
    "export": { "type": "string" },
    "deals_checked": { "type": "integer", "minimum": 0 },
    "flags": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["deal", "rep", "rule", "issue", "amount", "state"],
        "properties": {
          "deal": { "type": "string" },
          "rep": { "type": "string" },
          "rule": { "type": "string" },
          "issue": { "type": "string" },
          "amount": { "type": "number", "minimum": 0 },
          "state": { "type": "string", "enum": ["new", "still_open", "fixed"] }
        }
      }
    },
    "pending_approvals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "to", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["rep_nudge", "manager_summary"] },
          "to": { "type": "string" },
          "summary": { "type": "string" }
        }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "user": "marcus.bell@cymbal-sandbox.example",
  "now": "2026-11-12T06:00:00-08:00",
  "export": "Pipeline export 2026-11-12 05:30",
  "open_deals": 412,
  "sample_rows": [
    { "deal": "Pinecrest Health - expansion", "rep": "Ava Lindqvist", "stage": 4, "close_date": "2026-10-31", "amount": 184000, "category": "best case", "last_next_step": "2026-11-05" },
    { "deal": "Northgate Freight - new", "rep": "Diego Ramos", "stage": 4, "close_date": "2026-11-27", "amount": 96000, "category": "commit", "last_next_step": "2026-10-22" },
    { "deal": "Saltmarsh Labs - renewal", "rep": "Kim Tran", "stage": 4, "close_date": "2026-12-15", "amount": 58000, "category": "commit", "pricing_sent": false },
    { "deal": "Orchard Bay Retail - new", "rep": "Kim Tran", "stage": 3, "close_date": "2026-12-20", "amount": 0, "category": "pipeline" }
  ],
  "exceptions": ["Harbor & Pine - legal review (known delay)"]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "run_id": "phn-2026-11-12-0600",
  "export": "Pipeline export 2026-11-12 05:30",
  "deals_checked": 412,
  "flags": [
    { "deal": "Pinecrest Health - expansion", "rep": "Ava Lindqvist", "rule": "H1", "issue": "Close date 31 Oct has passed", "amount": 184000, "state": "new" },
    { "deal": "Northgate Freight - new", "rep": "Diego Ramos", "rule": "H2", "issue": "Commit with no next step in 21 days", "amount": 96000, "state": "new" },
    { "deal": "Saltmarsh Labs - renewal", "rep": "Kim Tran", "rule": "H4", "issue": "Stage 4 without pricing sent", "amount": 58000, "state": "new" },
    { "deal": "Orchard Bay Retail - new", "rep": "Kim Tran", "rule": "H3", "issue": "Amount is zero in stage 3", "amount": 0, "state": "new" }
  ],
  "pending_approvals": [
    { "kind": "rep_nudge", "to": "diego.ramos@cymbal-sandbox.example", "summary": "Northgate Freight ($96k): add a next step or move to best case before 14:00." },
    { "kind": "rep_nudge", "to": "kim.tran@cymbal-sandbox.example", "summary": "Saltmarsh: send pricing or move back to stage 3. Orchard Bay: add an amount." },
    { "kind": "rep_nudge", "to": "ava.lindqvist@cymbal-sandbox.example", "summary": "Pinecrest Health ($184k): close date 31 Oct has passed; update it." }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab RevOps 1: Clean pipeline before the call

**Time box:** 35 minutes

## Objective

Let Gemini check a 400-deal pipeline export against your hygiene rules and draft one specific Chat
nudge per rep. Reps fix their own deals in the CRM; RevOps approves every nudge.

## Setup

- **Seats:** groups of three on Business or Enterprise seats in \`cymbal-sandbox.example\`: RevOps
  manager and two reps.
- **Data:** a "Pipeline export" Sheet with 412 synthetic open deals, an "Exceptions" tab and a
  second export to simulate the afternoon refresh. No CRM connected.
- **Package:** \`google/pipeline-hygiene-nudger@1.1\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. RevOps: drop the morning export into the folder. Open the agent's tab and read the flags.
2. Pick two flags and check them against the export rows. Is the rule ID right?
3. Add one deal to the Exceptions tab and re-run. Confirm it is no longer flagged.
4. Review the nudge drafts. Confirm each rep sees only their own deals. Approve the batch.
5. Reps: reply in your DM and "fix" a deal by editing the second export.
6. Facilitator drops the afternoon export. Check which flags flipped to \`fixed\`.
7. Review the manager summary draft and decide whether to send it.

## What good looks like

- [ ] Every flag names a rule and an amount.
- [ ] One nudge per rep, specific and under 60 words.
- [ ] Exceptions were respected.
- [ ] Nothing went out without approval, and nothing touched the CRM.

## Entitlement check

About $0.08 per run, two runs a week: 0.08 x 2 x 4.3 = about $0.69 a month.

## Facilitator notes

- Debrief prompt: how many minutes of last week's forecast call were data clean-up?

## Measure it next week

- **Signal:** runs per RevOps user in the Admin console Gemini usage report.
- **Outcome:** flagged deals still open at call time, compared with last week.
- **Watch for:** reps who never fix; that's a manager conversation, not more nudges.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.1 - 2026-10-29
- Exceptions tab respected; known delays are no longer re-flagged.
- Re-check on the next export marks flags fixed or still open.

## 1.0 - 2026-09-17
- First release: rule-based flags from the pipeline export and per-rep nudges held for approval.
`,
    },
  ],
  'fn-revops-qbr': [
    {
      path: 'SKILL.md',
      content: `---
name: qbr-pack-assembler
namespace: google
version: "1.0"
description: Use when an account team prepares a quarterly business review and needs a sourced draft pack built from usage Sheets, support threads and the last QBR Doc, plus a meeting booked with the pre-read.
license: Apache-2.0
surfaces: [Drive, Sheets, Docs, Calendar, Gmail]
runtime: long-running
approval: Every edit to a shared pack Doc (as suggestions), every external email and every calendar booking; the first draft in the user's own Drive needs no approval.
entitlement_cost_per_run_usd: 0.3
typical_runs_per_user_per_week: 1.5
outputs: schema/output.json
---

# QBR Pack Assembler

## When to use

- An account's material is spread across Drive: a usage or adoption Sheet, support threads in
  Gmail, last quarter's QBR Doc with its commitments, and the renewal or expansion notes.
- Account managers and CSMs rebuild the same QBR structure each quarter from a blank page.
- Good fit for account managers, customer success managers and RevOps supporting them.
- Not for writing commercial proposals or pricing. The assembler drafts the review; people decide
  what to commit to.
- Signs it is working: QBR packs are ready three days ahead, and last quarter's commitments are
  always reported on.

## How it runs

1. **Wake: QBR due.** \`days_before\` business days before a QBR (from the account's QBR calendar
   or a request in the side panel), the agent reads the account folder.
2. **Collect.** Usage trend from the usage Sheet, support volume and themes from threads with the
   account's domain, commitments from the last QBR Doc, open asks from recent threads.
3. **Checkpoint 1: draft.** Writes the pack Doc in the user's Drive from the team's template:
   outcomes, usage, support, last commitments (met or open), asks, proposed next-quarter goals.
   Every number cites its source.
4. **Questions.** Numbers it cannot confirm get a comment for the CSM or account owner.
5. **Checkpoint 2: schedule.** Proposes slots that work for internal attendees and drafts the
   invite with the pack linked. Booked only after approval.
6. **Wake: pack edits.** Comments from colleagues are answered from the sources.

## Instructions

1. Use only files in the account folder, threads with the account's domain and the last QBR Doc.
2. Every number cites its source cell, thread or Doc heading.
3. Report every commitment from the last QBR as \`met\`, \`open\` or \`dropped\` with evidence.
4. Never quote customer emails beyond one sentence; summarise and link.
5. Never include pricing, discounts or other customers' names.
6. Propose next-quarter goals as suggestions for the account team, not commitments.
7. Never send external email, share the pack externally or book a meeting without approval.
8. Emit JSON matching \`schema/output.json\` after each run.

## Approvals & guardrails

- **Pack Doc:** the first draft lives in the user's Drive; later edits are suggestions.
- **Calendar and email:** invites and external emails need approval.
- **Sharing:** never changed by the agent; external sharing is the account owner's decision.
- **Audit:** every figure links its source.
- **Cost:** about $0.30 per QBR pack (draft plus one revision).

## Examples

\`\`\`json
{
  "input": { "account": "Alder & Finch", "qbr_date": "2026-11-17",
             "last_qbr_commitments": 3, "support_threads": 14 },
  "output": { "commitments": { "met": 2, "open": 1, "dropped": 0 },
              "usage_change_pct": 21, "questions_for_csm": 1, "status": "draft_ready" }
}
\`\`\`

## Parameters

\`\`\`yaml
days_before: 3
template_doc: "QBR template v4"
account_folder_pattern: "Accounts/{account}"
support_lookback_days: 90
max_quote_sentences: 1
slots_to_propose: 3
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "QBR Pack Assembler run",
  "type": "object",
  "required": ["account", "qbr_date", "status", "sections", "commitments", "pending_approvals"],
  "properties": {
    "account": { "type": "string" },
    "qbr_date": { "type": "string", "format": "date" },
    "status": { "type": "string", "enum": ["collecting", "draft_ready", "in_review", "booked"] },
    "sections": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["section", "summary", "sources"],
        "properties": {
          "section": { "type": "string" },
          "summary": { "type": "string" },
          "sources": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "commitments": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["commitment", "status"],
        "properties": {
          "commitment": { "type": "string" },
          "status": { "type": "string", "enum": ["met", "open", "dropped"] },
          "evidence": { "type": "string" }
        }
      }
    },
    "questions_for_team": { "type": "array", "items": { "type": "string" } },
    "pending_approvals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["book_event", "send_email", "share_doc"] },
          "summary": { "type": "string" },
          "proposed_start": { "type": "string" }
        }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "user": "marcus.bell@cymbal-sandbox.example",
  "account": "Alder & Finch",
  "account_domain": "alderfinch.example",
  "qbr_date": "2026-11-17",
  "usage_sheet": { "active_users_aug": 340, "active_users_nov": 412 },
  "support_threads": { "this_quarter": 14, "last_quarter": 31, "median_resolution_hours": 6 },
  "last_qbr_doc": {
    "date": "2026-08-12",
    "commitments": [
      "Roll out SSO to the Leeds office",
      "Monthly adoption report to their ops lead",
      "Add a reporting export"
    ]
  },
  "evidence": [
    { "commitment": "Roll out SSO to the Leeds office", "source": "thread: Leeds SSO go-live, 22 Sep" },
    { "commitment": "Monthly adoption report to their ops lead", "source": "sent mail: Adoption report Sep, Oct" }
  ]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "account": "Alder & Finch",
  "qbr_date": "2026-11-17",
  "status": "draft_ready",
  "sections": [
    { "section": "Usage", "summary": "Active users up from 340 to 412 (+21%) since the August QBR.", "sources": ["sheet: Alder & Finch usage, B4:B7"] },
    { "section": "Support", "summary": "14 tickets this quarter, down from 31; median resolution 6 h.", "sources": ["threads: support, alderfinch.example, last 90 days"] }
  ],
  "commitments": [
    { "commitment": "Roll out SSO to the Leeds office", "status": "met", "evidence": "thread: Leeds SSO go-live, 22 Sep" },
    { "commitment": "Monthly adoption report to their ops lead", "status": "met", "evidence": "sent mail: Adoption report Sep, Oct" },
    { "commitment": "Add a reporting export", "status": "open", "evidence": "Raised twice; no date in any thread." }
  ],
  "questions_for_team": ["CSM: is there a date for the reporting export before Tuesday?"],
  "pending_approvals": [
    { "kind": "book_event", "summary": "Alder & Finch QBR, 60 min, pack linked as pre-read.", "proposed_start": "2026-11-17T10:00:00-08:00" }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab RevOps 2: A QBR pack in twenty minutes

**Time box:** 40 minutes

## Objective

Let Gemini build a QBR pack from an account folder: usage, support, last quarter's commitments and
open asks, each with a source. You edit the story, the CSM answers open questions and nothing is
booked or shared until you approve.

## Setup

- **Seats:** pairs on Business or Enterprise seats in \`cymbal-sandbox.example\`: account manager and
  CSM.
- **Data:** an "Accounts/Alder & Finch" folder with a usage Sheet, last quarter's QBR Doc, 14 seeded
  support threads and a QBR template. The customer and all figures are synthetic.
- **Package:** \`google/qbr-pack-assembler@1.0\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Account manager: in the side panel, run "Draft the Alder & Finch QBR for 17 November."
2. Open the draft. Follow the source for the usage number and one support figure.
3. Check the commitments section. Is the open reporting export reported honestly?
4. CSM: answer the comment on the reporting export from your own seat.
5. Account manager: rewrite the opening paragraph in your own words.
6. Review the proposed slots and invite. Approve one; check the invite links the pack.
7. Ask the agent to "add a 10% discount offer". Confirm it declines: pricing is out of scope.

## What good looks like

- [ ] Every number cites a source.
- [ ] All three commitments from last quarter are reported, including the open one.
- [ ] No pricing or other customers' names in the pack.
- [ ] The meeting was booked only after approval.

## Entitlement check

About $0.30 per pack, 1.5 packs a week: 0.3 x 1.5 x 4.3 = about $1.94 a month.

## Facilitator notes

- Debrief prompt: which commitment from your last QBR was never reported back on?

## Measure it next week

- **Signal:** packs drafted per account manager in the Admin console Gemini usage report.
- **Outcome:** days before the QBR that the pack was ready, compared with last quarter.
- **Watch for:** many questions per pack; the usage Sheet may need a stable layout.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.0 - 2026-10-22
- First release: sourced QBR pack from the account folder, commitment tracking from the last QBR,
  slot proposals and invite held for approval.
`,
    },
  ],
  'fn-revops-dealdesk': [
    {
      path: 'SKILL.md',
      content: `---
name: deal-desk-approval-router
namespace: google
version: "1.0"
description: Use when non-standard deal requests (discounts, terms, payment schedules) arrive by email or Chat and must reach the right approvers with full context, with every sign-off tracked in a Sheet to a decision.
license: Apache-2.0
surfaces: [Gmail, Sheets, Chat]
runtime: long-running
approval: Every routing email, reminder and decision notice; logging to the approvals Sheet needs no approval.
entitlement_cost_per_run_usd: 0.06
typical_runs_per_user_per_week: 5
outputs: schema/output.json
---

# Deal Desk Approval Router

## When to use

- Reps send non-standard requests to a deal desk mailbox or Chat space, and an approval matrix in
  a Sheet says who signs off on what (by discount band, term length, payment terms).
- Approvals stall because approvers get the request without the margin sheet, or nobody knows
  whose turn it is.
- Good fit for deal desk analysts, RevOps managers and finance business partners.
- Not for approving deals or changing quotes. The router routes and tracks; approvers decide in
  their own words, and quotes are changed by people in their own tools.
- Signs it is working: requests reach approvers the same day with everything they need, and
  "where is my approval?" disappears from the deal desk space.

## How it runs

1. **Wake: new request.** A new thread to the deal desk mailbox or a message in the deal desk space
   starts a request.
2. **Parse.** Extracts account, amount, term, requested discount or term, and the rep's reason.
   Missing fields go back to the rep as a drafted question.
3. **Match.** Looks up the approval matrix to find required approvers and the order.
4. **Checkpoint 1: route.** Drafts one routing email to the approvers with the request, the margin
   at the requested terms (from the deal desk Sheet) and a decision deadline. Approval required.
5. **Log.** Writes the request and each approver's state to the approvals Sheet.
6. **Wake: replies.** Each approver reply is classified (\`approved\`, \`approved_with_counter\`,
   \`declined\`, \`question\`) and logged; a status note is posted to the deal desk space.
7. **Checkpoint 2: decision.** When all required approvers have replied, drafts the decision notice
   to the rep. Approval required.

## Instructions

1. The approval matrix decides approvers; never skip or add approvers on your own.
2. Include the margin at requested terms only from the deal desk Sheet; never compute pricing.
3. Classify a reply as approved only when the approver says so plainly; otherwise \`question\`.
4. Counters are recorded with the approver's exact terms.
5. Remind approvers at most once per business day before the deadline, with approval.
6. Post status to the deal desk space without customer contacts or margin figures.
7. Never tell a rep a deal is approved until every required approver has approved.
8. Emit JSON matching \`schema/output.json\` after each wake.

## Approvals & guardrails

- **Decisions:** made only by approvers; the router never approves or declines.
- **Email:** routing, reminders and decision notices are drafts until approved.
- **CRM and quoting:** no access; people update quotes in their own tools.
- **Audit:** the approvals Sheet logs each request, approver, reply and timestamp.
- **Cost:** about $0.06 per request event (route, reply or decision); five a week.

## Examples

\`\`\`json
{
  "input": { "account": "Pinecrest Health", "amount": 184000, "term_years": 3,
             "requested_discount_pct": 28 },
  "output": { "band": "above 20%", "approvers": ["VP Sales", "Finance BP"],
              "margin_at_request_pct": 61, "status": "awaiting_routing_approval" }
}
\`\`\`

## Parameters

\`\`\`yaml
deal_desk_mailbox: "dealdesk@cymbal-sandbox.example"
deal_desk_space: "Deal desk"
approval_matrix: "Approval matrix FY27"
approvals_sheet: "Deal desk approvals"
default_deadline_business_days: 1
max_reminders_per_day: 1
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Deal Desk Approval Router event",
  "type": "object",
  "required": ["request_id", "account", "request", "approvers", "status", "pending_approvals"],
  "properties": {
    "request_id": { "type": "string" },
    "account": { "type": "string" },
    "rep": { "type": "string" },
    "request": {
      "type": "object",
      "required": ["amount", "ask"],
      "properties": {
        "amount": { "type": "number", "minimum": 0 },
        "term_years": { "type": "number" },
        "ask": { "type": "string" },
        "margin_at_request_pct": { "type": "number" }
      }
    },
    "approvers": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["role", "email", "state"],
        "properties": {
          "role": { "type": "string" },
          "email": { "type": "string" },
          "state": { "type": "string", "enum": ["not_contacted", "pending", "approved", "approved_with_counter", "declined", "question"] },
          "counter": { "type": "string" },
          "replied_at": { "type": "string" }
        }
      }
    },
    "status": { "type": "string", "enum": ["awaiting_routing_approval", "with_approvers", "decided", "withdrawn"] },
    "deadline": { "type": "string" },
    "pending_approvals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["route_email", "reminder", "decision_notice", "rep_question"] },
          "to": { "type": "string" },
          "summary": { "type": "string" }
        }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "thread": {
    "to": "dealdesk@cymbal-sandbox.example",
    "from": "ava.lindqvist@cymbal-sandbox.example",
    "subject": "Pinecrest Health - 28% on 3-year expansion",
    "body": "Pinecrest want 28% on the $184k three-year expansion. Competitive bake-off, they'll sign this month if we can get there. Margin sheet attached in the deal folder."
  },
  "approval_matrix_row": { "band": "above 20%", "approvers": ["VP Sales", "Finance BP"], "order": "parallel" },
  "directory": [
    { "role": "VP Sales", "email": "vp-sales@cymbal-sandbox.example" },
    { "role": "Finance BP", "email": "finance-bp@cymbal-sandbox.example" }
  ],
  "deal_desk_sheet": { "margin_at_28_pct": 61, "margin_floor_pct": 60 },
  "later_replies": [
    { "from": "finance-bp@cymbal-sandbox.example", "at": "2026-11-12T10:52:00-08:00", "text": "Can't do 28. I can approve 24% if VP agrees." }
  ]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "request_id": "dd-2026-117",
  "account": "Pinecrest Health",
  "rep": "Ava Lindqvist",
  "request": { "amount": 184000, "term_years": 3, "ask": "28% discount", "margin_at_request_pct": 61 },
  "approvers": [
    { "role": "VP Sales", "email": "vp-sales@cymbal-sandbox.example", "state": "pending" },
    { "role": "Finance BP", "email": "finance-bp@cymbal-sandbox.example", "state": "approved_with_counter", "counter": "24% discount, subject to VP Sales agreement", "replied_at": "2026-11-12T10:52:00-08:00" }
  ],
  "status": "with_approvers",
  "deadline": "2026-11-13T12:00:00-08:00",
  "pending_approvals": [
    { "kind": "reminder", "to": "vp-sales@cymbal-sandbox.example", "summary": "Pinecrest 28% request: Finance countered at 24%. Your decision needed by Fri 12:00." }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab RevOps 3: Same-day deal desk

**Time box:** 35 minutes

## Objective

Let Gemini route a non-standard discount to the right approvers with the margin context, log every
reply and draft the decision notice. Approvers decide; the router never approves or touches quotes.

## Setup

- **Seats:** groups of four on Business or Enterprise seats in \`cymbal-sandbox.example\`: deal desk
  analyst, rep, VP Sales, Finance BP.
- **Data:** an "Approval matrix FY27" Sheet, a deal desk Sheet with margin by discount, a "Deal desk
  approvals" log Sheet, a deal desk mailbox and Chat space. All synthetic.
- **Package:** \`google/deal-desk-approval-router@1.0\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Rep: email the deal desk mailbox asking for 28% on Pinecrest Health.
2. Analyst: review the parsed request and the matched approvers. Approve the routing email; check
   it includes margin at 28% and a deadline.
3. Finance BP: reply "I can approve 24% if VP agrees." Watch it logged as a counter.
4. Analyst: read the status post in the deal desk space. Confirm no margin figure appears there.
5. Facilitator advances the clock. Review and approve one reminder to the VP.
6. VP Sales: reply "Approve at 24%." Review the drafted decision notice to the rep and send it.
7. Ask the agent to "just approve it at 24%". Confirm it declines.

## What good looks like

- [ ] Approvers came from the matrix, not from guesswork.
- [ ] The counter was recorded with exact terms.
- [ ] The rep heard "approved" only after both approvers replied.
- [ ] The log Sheet shows every step with timestamps.

## Entitlement check

About $0.06 per request event, five a week: 0.06 x 5 x 4.3 = about $1.29 a month.

## Facilitator notes

- Debrief prompt: how many days did your last non-standard deal wait, and on whom?

## Measure it next week

- **Signal:** request events per deal desk analyst in the Admin console Gemini usage report.
- **Outcome:** hours from request to decision, compared with last month.
- **Watch for:** many \`question\` replies; approvers may need more context in the routing email.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.0 - 2026-10-15
- First release: matrix-based routing with margin context, reply classification and logging,
  reminders and decision notices held for approval.
`,
    },
  ],
  'fn-revops-forecast': [
    {
      path: 'SKILL.md',
      content: `---
name: forecast-call-prep
namespace: google
version: "1.2"
description: Use when RevOps runs a weekly forecast call from pipeline exports in Sheets and wants each sales manager to arrive with a one-page brief, and the call's commit changes captured and followed up.
license: Apache-2.0
surfaces: [Sheets, Docs, Meet, Gmail, Calendar]
runtime: long-running
approval: Every follow-up email and any change to the forecast call invite; briefs in the user's own Drive need no approval.
entitlement_cost_per_run_usd: 0.12
typical_runs_per_user_per_week: 2
outputs: schema/output.json
---

# Forecast Call Prep

## When to use

- A weekly forecast call reviews commit and best case per manager, using pipeline exports saved
  to Sheets each week.
- Prep means comparing two exports by eye to find what moved, and the call's decisions live in
  someone's head afterwards.
- Good fit for RevOps managers, sales managers and CROs' chiefs of staff.
- Not for changing forecast categories or the CRM. The prep works from exports; managers update
  their forecast in their own tools.
- Signs it is working: calls start with "what changed and why" instead of reading numbers, and
  follow-ups go out the same afternoon.

## How it runs

1. **Wake: \`hours_before_call\` before the forecast call.** Reads this week's and last week's
   exports and the call invite's attendee list.
2. **Diff.** Per manager: commit and best-case totals, deals that moved in or out of commit,
   close dates that slipped across the quarter boundary, new and lost deals over \`min_amount\`.
3. **Checkpoint 1: briefs.** Writes one-page brief Docs per manager in the user's Drive: totals,
   changes, slipped deals, three suggested questions. Each figure cites the export rows.
4. **Share.** Offers to link the briefs in the call invite description; change made only after
   approval.
5. **Wake: call notes.** When the Meet notes land, matches each spoken commit change to a deal in
   the export and lists anything it could not match.
6. **Checkpoint 2: follow-ups.** Drafts one follow-up email per manager with their changes and
   actions. The user approves.

## Instructions

1. Use only the two exports and the call notes. Never read or write the CRM.
2. Every figure cites export rows. Totals must equal the sum of listed deals.
3. "Slipped" means the close date moved past the quarter end since last week.
4. Suggested questions are neutral and specific: "What changed at Northgate since last Thursday?"
5. In follow-ups, quote decisions as captured in the notes; flag anything ambiguous to the user.
6. Never change the forecast call invite or send email without approval.
7. Emit JSON matching \`schema/output.json\` for each prep and each follow-up run.

## Approvals & guardrails

- **CRM and forecasting tools:** no access; managers update their own forecast.
- **Calendar:** linking briefs in the invite needs approval.
- **Email:** follow-ups are drafts until approved.
- **Audit:** every number in a brief traces to export rows.
- **Cost:** about $0.12 per run; prep and follow-up each week.

## Examples

\`\`\`json
{
  "input": { "manager": "West", "commit_last_week": 1324000, "commit_this_week": 1420000 },
  "output": { "commit_change": 96000, "moved_in": ["Northgate Freight - new"],
              "slipped": ["Pinecrest Health - expansion"], "questions": 3 }
}
\`\`\`

## Parameters

\`\`\`yaml
hours_before_call: 6
export_folder: "RevOps/Pipeline exports"
min_amount: 25000
questions_per_manager: 3
quarter_end: "2026-12-31"
link_briefs_in_invite: ask   # ask | never
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Forecast Call Prep run",
  "type": "object",
  "required": ["run_id", "run_type", "call", "managers", "pending_approvals"],
  "properties": {
    "run_id": { "type": "string" },
    "run_type": { "type": "string", "enum": ["prep", "follow_up"] },
    "call": { "type": "string" },
    "managers": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["team", "commit", "commit_change", "changes"],
        "properties": {
          "team": { "type": "string" },
          "manager": { "type": "string" },
          "commit": { "type": "number" },
          "commit_change": { "type": "number" },
          "best_case": { "type": "number" },
          "changes": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["deal", "change", "amount"],
              "properties": {
                "deal": { "type": "string" },
                "change": { "type": "string", "enum": ["moved_in", "moved_out", "slipped", "new", "lost"] },
                "amount": { "type": "number" }
              }
            }
          },
          "questions": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "unmatched_from_call": { "type": "array", "items": { "type": "string" } },
    "pending_approvals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["update_invite", "send_email"] },
          "to": { "type": "string" },
          "summary": { "type": "string" }
        }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "user": "marcus.bell@cymbal-sandbox.example",
  "call": "Forecast call - Thu 12 Nov 15:30",
  "exports": ["Pipeline export 2026-11-05", "Pipeline export 2026-11-12"],
  "teams": [
    {
      "team": "West", "manager": "grace.oyelaran@cymbal-sandbox.example",
      "commit_last_week": 1324000, "commit_this_week": 1420000,
      "deal_moves": [
        { "deal": "Northgate Freight - new", "from": "best case", "to": "commit", "amount": 96000 },
        { "deal": "Pinecrest Health - expansion", "close_from": "2026-10-31", "close_to": "2027-01-15", "amount": 184000 }
      ]
    },
    {
      "team": "East", "manager": "lena.fischer@cymbal-sandbox.example",
      "commit_last_week": 1020000, "commit_this_week": 980000,
      "deal_moves": [
        { "deal": "Saltmarsh Labs - renewal", "close_from": "2026-12-15", "close_to": "2027-01-20", "amount": 40000 }
      ]
    }
  ]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "run_id": "fcp-2026-11-12-0930",
  "run_type": "prep",
  "call": "Forecast call - Thu 12 Nov 15:30",
  "managers": [
    {
      "team": "West", "manager": "grace.oyelaran@cymbal-sandbox.example",
      "commit": 1420000, "commit_change": 96000,
      "changes": [
        { "deal": "Northgate Freight - new", "change": "moved_in", "amount": 96000 },
        { "deal": "Pinecrest Health - expansion", "change": "slipped", "amount": 184000 }
      ],
      "questions": [
        "What changed at Northgate since last Thursday?",
        "Is the Pinecrest close date real if the discount decision lands Friday?",
        "Which best-case deal is most likely to move into commit next week?"
      ]
    },
    {
      "team": "East", "manager": "lena.fischer@cymbal-sandbox.example",
      "commit": 980000, "commit_change": -40000,
      "changes": [ { "deal": "Saltmarsh Labs - renewal", "change": "slipped", "amount": 40000 } ],
      "questions": ["What would bring Saltmarsh back into this quarter?"]
    }
  ],
  "unmatched_from_call": [],
  "pending_approvals": [
    { "kind": "update_invite", "summary": "Link the West and East briefs in the forecast call invite description." }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab RevOps 4: Walk into forecast call already briefed

**Time box:** 40 minutes

## Objective

Let Gemini compare two weekly pipeline exports, write a one-page brief per manager and, after the
call, turn the Meet notes into follow-ups. Managers own their forecast; you approve every invite
change and email.

## Setup

- **Seats:** groups of three on Business or Enterprise seats in \`cymbal-sandbox.example\`: RevOps
  manager and two sales managers (West, East).
- **Data:** two "Pipeline export" Sheets a week apart, a forecast call invite and seeded deals that
  move in and out of commit. All synthetic; no CRM connected.
- **Package:** \`google/forecast-call-prep@1.2\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. RevOps: run "Prep Thursday's forecast call" from the side panel. Open both briefs.
2. Check the West commit change equals the sum of listed deal moves.
3. Approve linking the briefs in the invite; confirm the invite changed only after approval.
4. Run a ten-minute mock forecast call with "Take notes for me" on. Say one commit change aloud
   that isn't in the export.
5. After the call, review the follow-up drafts. Find the unmatched change the agent flagged.
6. Edit one follow-up and approve both.

## What good looks like

- [ ] Every figure in a brief traces to export rows.
- [ ] Slipped deals crossed the quarter boundary, not just any date change.
- [ ] Ambiguous call decisions were flagged, not guessed.
- [ ] Follow-ups went out only after approval.

## Entitlement check

About $0.12 per run, two runs a week: 0.12 x 2 x 4.3 = about $1.03 a month.

## Facilitator notes

- Debrief prompt: what decision from last week's forecast call never made it into a follow-up?

## Measure it next week

- **Signal:** prep and follow-up runs per RevOps user in the Admin console Gemini usage report.
- **Outcome:** time from call end to follow-ups sent, compared with last month.
- **Watch for:** many unmatched call items; managers may be naming deals inconsistently.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.2 - 2026-10-30
- Unmatched call items flagged instead of guessed.
- Quarter-boundary definition for slipped deals.

## 1.1 - 2026-09-24
- Follow-up drafts per manager from Meet notes.

## 1.0 - 2026-08-27
- First release: per-manager briefs from two weekly exports with sourced figures.
`,
    },
  ],
};
