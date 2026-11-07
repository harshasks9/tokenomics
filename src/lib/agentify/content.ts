/** Server-only: real package files for every Workspace agent use case. Never import from client code. */
export interface AgentifyFile { path: string; content: string }

export const USECASE_FILES: Record<string, AgentifyFile[]> = {
  'uc-inbox': [
    {
      path: 'SKILL.md',
      content: `---
name: ai-inbox-follow-up-tracker
namespace: google
version: "1.2"
description: Use when a user wants Gemini to watch AI Inbox for threads where someone owes them a reply (or they owe one) and keep those loops closed over several days.
license: Apache-2.0
surfaces: [Gmail, Tasks, Chat]
runtime: long-running
approval: Every outgoing nudge or reply email; creating Tasks and drafts needs no approval.
entitlement_cost_per_run_usd: 0.06
typical_runs_per_user_per_week: 5
outputs: schema/output.json
---

# AI Inbox Follow-up Tracker

## When to use

- The user lives in Gmail and loses track of "waiting on" threads once they scroll below the fold.
- AI Inbox already surfaces priorities and to-dos; this skill turns those signals into a tracked
  follow-up ledger that survives across days instead of resetting every morning.
- Good fit for account managers, project leads, recruiters and anyone who sends 20+ asks a week.
- Not a fit for shared mailboxes or delegated inboxes; the tracker reasons about one user's voice.
- Signs it is working: fewer "just checking in" emails written from scratch, and the Friday wrap
  shrinks week over week as loops close faster.

## How it runs

1. **Morning sweep (wakes at 08:00 local, weekdays).** Reads the AI Inbox priority and to-do
   cards plus threads the user sent in the last 10 business days. Classifies each thread as
   \`waiting_on_them\`, \`waiting_on_me\`, \`fyi\` or \`closed\`.
2. **Ledger update.** Each open loop becomes or refreshes a Google Tasks item in the list
   "Follow-ups (Gemini)", with the thread link, the counterparty and a due date derived from any
   date mentioned in the thread or from the default SLA.
3. **Checkpoint 1: nudge drafts.** For loops past their SLA, it drafts a short nudge in the
   user's voice and leaves it in Drafts. Nothing is sent. A Chat DM to the user lists the drafts
   with one-tap "Review" links.
4. **Event wake-ups.** A new reply on a tracked thread wakes the agent; it re-classifies the
   thread and closes the Task if the ask was answered. A calendar event with the counterparty also
   wakes it, so it can add "raise in meeting" to the event description draft (user approves).
5. **Checkpoint 2: Friday wrap.** At 15:00 Friday it posts a summary of closed, still-open and
   escalated loops, and proposes which loops to drop.
6. State lives in the Tasks list and a hidden label \`gemini/follow-up\`; the agent holds no other
   memory between runs.

## Instructions

1. Only consider threads where the user is on To or From. Ignore newsletters, notifications and
   anything AI Inbox already marks as low priority.
2. A thread is \`waiting_on_them\` when the user's last message contains a question, a request
   verb ("can you", "please send", "let me know") or an explicit deadline, and no later reply
   from the counterparty answers it.
3. A thread is \`waiting_on_me\` when the counterparty's last message asks the user for something.
   Never draft a substantive answer for these; create a Task and surface it.
4. Derive due dates from text first ("by Thursday", "EOW"), then fall back to \`default_sla_days\`.
5. Draft nudges in the user's voice: match their greeting style, sign-off and typical length from
   their last 30 sent messages. Keep nudges under 70 words and reference the original ask.
6. Never send an email. Place drafts in Drafts and list them in the Chat summary for approval.
7. Do not nudge the same person more than \`max_nudges_per_thread\` times; after that, mark the
   loop \`escalate\` and suggest a different channel (Chat or a call).
8. Never nudge anyone outside the user's domain on a weekend or after 18:00 in their time zone.
9. Close a loop automatically only when the reply clearly answers the ask; otherwise mark it
   \`needs_review\` and ask the user.
10. Report every run as JSON matching \`schema/output.json\`.

## Approvals & guardrails

- **Send:** every nudge is a draft until the user clicks Send. The agent cannot send on its own.
- **Tasks:** creating, updating and completing Tasks in the dedicated list is allowed without
  approval; the agent never touches the user's other Task lists.
- **Scope:** read-only access to threads; no forwarding, no label changes outside \`gemini/*\`.
- **Privacy:** summaries never quote more than one sentence from an external sender.
- **Cost:** about $0.06 per daily sweep; chat questions to Gemini about the ledger are free.

## Examples

\`\`\`json
{
  "input": { "thread_subject": "Q3 pricing sheet", "last_sent_by": "user", "days_since": 4,
             "ask": "Could you send the signed pricing sheet by Tuesday?" },
  "output": { "status": "waiting_on_them", "action": "draft_nudge", "due": "2026-11-10",
              "draft_preview": "Hi Priya, a quick nudge on the signed pricing sheet..." }
}
\`\`\`

## Parameters

\`\`\`yaml
default_sla_days: 3          # business days before a loop counts as overdue
max_nudges_per_thread: 2     # after this the loop is escalated, not nudged again
lookback_business_days: 10   # how far back the morning sweep reads sent mail
sweep_time_local: "08:00"
friday_wrap_time_local: "15:00"
task_list_name: "Follow-ups (Gemini)"
quiet_hours_local: ["18:00", "08:00"]
external_weekend_nudges: false
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AI Inbox Follow-up Tracker run",
  "type": "object",
  "required": ["run_id", "run_type", "generated_at", "loops", "summary"],
  "properties": {
    "run_id": { "type": "string" },
    "run_type": { "type": "string", "enum": ["morning_sweep", "reply_wake", "friday_wrap"] },
    "generated_at": { "type": "string", "format": "date-time" },
    "loops": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["thread_subject", "counterparty", "status", "action"],
        "properties": {
          "thread_subject": { "type": "string" },
          "counterparty": { "type": "string" },
          "status": {
            "type": "string",
            "enum": ["waiting_on_them", "waiting_on_me", "fyi", "closed", "needs_review", "escalate"]
          },
          "action": {
            "type": "string",
            "enum": ["none", "create_task", "update_task", "complete_task", "draft_nudge", "suggest_channel_switch"]
          },
          "due_date": { "type": "string", "format": "date" },
          "nudges_sent": { "type": "integer", "minimum": 0 },
          "draft_preview": { "type": "string", "maxLength": 400 },
          "requires_approval": { "type": "boolean" }
        }
      }
    },
    "summary": {
      "type": "object",
      "required": ["open", "closed_today", "drafts_awaiting_approval"],
      "properties": {
        "open": { "type": "integer", "minimum": 0 },
        "closed_today": { "type": "integer", "minimum": 0 },
        "drafts_awaiting_approval": { "type": "integer", "minimum": 0 },
        "chat_message": { "type": "string" }
      }
    }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "user": "dana.okafor@cymbal-sandbox.example",
  "timezone": "America/Chicago",
  "run_type": "morning_sweep",
  "now": "2026-11-09T08:00:00-06:00",
  "threads": [
    {
      "subject": "Q3 pricing sheet - countersignature",
      "participants": ["dana.okafor@cymbal-sandbox.example", "priya.raman@alderbrook-supply.example"],
      "last_message_from": "dana.okafor@cymbal-sandbox.example",
      "last_message_at": "2026-11-04T16:12:00-06:00",
      "last_message_excerpt": "Could you send the countersigned pricing sheet by Tuesday so finance can load it?"
    },
    {
      "subject": "Onsite agenda for the 18th",
      "participants": ["dana.okafor@cymbal-sandbox.example", "marco.lind@cymbal-sandbox.example"],
      "last_message_from": "marco.lind@cymbal-sandbox.example",
      "last_message_at": "2026-11-06T11:40:00-06:00",
      "last_message_excerpt": "Can you confirm which two customers we're hosting so I can book the room?"
    },
    {
      "subject": "Re: renewal paperwork",
      "participants": ["dana.okafor@cymbal-sandbox.example", "ken.adeyemi@harborview-labs.example"],
      "last_message_from": "ken.adeyemi@harborview-labs.example",
      "last_message_at": "2026-11-07T09:05:00-06:00",
      "last_message_excerpt": "Attached is the signed renewal. Thanks for the quick turnaround!"
    },
    {
      "subject": "Security questionnaire for the Q1 pilot",
      "participants": ["dana.okafor@cymbal-sandbox.example", "joel.brandt@northgate-mills.example"],
      "last_message_from": "dana.okafor@cymbal-sandbox.example",
      "last_message_at": "2026-10-27T10:30:00-05:00",
      "last_message_excerpt": "Following up again: could your team return the questionnaire so we can schedule the pilot kickoff?"
    },
    {
      "subject": "Updated holiday schedule",
      "participants": ["dana.okafor@cymbal-sandbox.example", "people-ops@cymbal-sandbox.example"],
      "last_message_from": "people-ops@cymbal-sandbox.example",
      "last_message_at": "2026-11-06T13:00:00-06:00",
      "last_message_excerpt": "The office closes at 14:00 on 25 November. No action needed."
    }
  ],
  "existing_tasks": [
    { "title": "Renewal paperwork - Harborview Labs", "due": "2026-11-07", "nudges_sent": 1 },
    { "title": "Security questionnaire - Northgate Mills", "due": "2026-10-23", "nudges_sent": 2 }
  ]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "run_id": "fut-2026-11-09-0800-dokafor",
  "run_type": "morning_sweep",
  "generated_at": "2026-11-09T08:00:41-06:00",
  "loops": [
    {
      "thread_subject": "Q3 pricing sheet - countersignature",
      "counterparty": "priya.raman@alderbrook-supply.example",
      "status": "waiting_on_them",
      "action": "draft_nudge",
      "due_date": "2026-11-10",
      "nudges_sent": 0,
      "draft_preview": "Hi Priya, a quick nudge on the countersigned Q3 pricing sheet. Finance is hoping to load it Tuesday. Anything you need from me to get it over the line? Thanks, Dana",
      "requires_approval": true
    },
    {
      "thread_subject": "Onsite agenda for the 18th",
      "counterparty": "marco.lind@cymbal-sandbox.example",
      "status": "waiting_on_me",
      "action": "create_task",
      "due_date": "2026-11-11",
      "nudges_sent": 0,
      "requires_approval": false
    },
    {
      "thread_subject": "Re: renewal paperwork",
      "counterparty": "ken.adeyemi@harborview-labs.example",
      "status": "closed",
      "action": "complete_task",
      "nudges_sent": 1,
      "requires_approval": false
    },
    {
      "thread_subject": "Security questionnaire for the Q1 pilot",
      "counterparty": "joel.brandt@northgate-mills.example",
      "status": "escalate",
      "action": "suggest_channel_switch",
      "due_date": "2026-10-23",
      "nudges_sent": 2,
      "requires_approval": false
    },
    {
      "thread_subject": "Updated holiday schedule",
      "counterparty": "people-ops@cymbal-sandbox.example",
      "status": "fyi",
      "action": "none",
      "nudges_sent": 0,
      "requires_approval": false
    }
  ],
  "summary": {
    "open": 3,
    "closed_today": 1,
    "drafts_awaiting_approval": 1,
    "chat_message": "Morning, Dana. 1 nudge draft ready for Priya (pricing sheet, due Tue). Marco needs the two onsite customers from you; I added a Task due Wed. Harborview renewal came back signed, so I closed it. Northgate has had 2 nudges on the security questionnaire with no reply; suggest a quick call or a Chat message to Joel instead of a third email."
  }
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab 1: Close your loops with the AI Inbox Follow-up Tracker

**Time box:** 35 minutes

## Objective

Turn AI Inbox from a morning glance into a multi-day follow-up system. By the end, Gemini keeps a
ledger of who owes you what, drafts nudges in your voice, and never sends without your click.

## Setup

- **Seats:** each attendee uses a Business Standard seat in the sandbox domain
  \`cymbal-sandbox.example\` (Gemini agent entitlement $6/user/month, indicative).
- **Data:** the facilitator seeds each mailbox with 40 synthetic threads from the
  "Alderbrook / Harborview" pack, including 6 open asks and 3 already-answered ones.
- **Package:** install \`google/ai-inbox-follow-up-tracker@1.2\` from the workshop catalog.
- Make sure AI Inbox is switched on in Gmail settings for the sandbox OU.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Open Gmail and switch to AI Inbox. Skim the priority cards and note which asks you think are
   still open. Write the count on your lab sheet.
2. Open the Gemini side panel and run the skill: "Start my follow-up tracker with a 3-day SLA."
   Confirm the agent creates the "Follow-ups (Gemini)" list in Tasks.
3. Compare the agent's ledger with your own count. Find one thread it classified differently and
   ask in the side panel why. (Chat questions do not draw down the entitlement.)
4. Open Drafts. Review the nudge to Priya Raman. Edit one phrase so it sounds more like you, then
   send it yourself. Notice that the agent never sent anything on its own.
5. Ask the facilitator to reply on the "renewal paperwork" thread from the seeded counterparty
   account. Watch the agent wake, re-classify the thread and complete the Task.
6. In Google Chat, open the DM from Gemini and read the summary. Reply "drop the onsite loop" and
   check that the Task is marked complete with a note.
7. Change one parameter: set \`max_nudges_per_thread\` to 1 and re-run. Note which loop moves to
   \`escalate\`.

## What good looks like

- [ ] Ledger in Tasks matches the 6 open asks in the seeded data (allow one disagreement).
- [ ] Every nudge sat in Drafts until you sent it.
- [ ] The answered renewal thread closed without you touching it.
- [ ] Chat summary lists drafts awaiting approval with working links.
- [ ] You can explain the difference between a chat question (free) and an agentic task (metered).

## Entitlement check

A daily sweep costs about $0.06. At 5 runs a week that is 0.06 x 5 x 4.3 = about $1.29 a month,
inside even the $2 Starter entitlement.

## Facilitator notes

- Seed data resets with the "Reset lab 1" Apps Script in the facilitator Sheet; run it between
  cohorts so the renewal thread is open again.
- If the sweep finds fewer than 6 loops, check that the attendee's AI Inbox finished indexing (it
  can take 10 minutes after the seed import). Re-run rather than debugging the classification.
- Common question: "Why didn't it just send the nudge?" Answer: approval is the design. The
  package cannot send; the value is that the draft is already written in your voice.
- Pair slower attendees for step 7; changing a parameter is optional if the room runs late.
- Debrief prompt: which of your real threads this week would you hand to the tracker?

## Measure it next week

- **Signal:** agentic tasks per user per week from the Gemini usage report in the Admin console,
  filtered to this skill. Target: 4 or more by day 7 means the morning sweep stuck.
- **Secondary:** share of nudge drafts that were sent (healthy is 50-80%; lower means the voice
  match needs tuning).
- **Watch for:** users who stop opening the Chat summary; re-run step 6 with them in office hours.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.2 - 2026-10-21
- Friday wrap now proposes loops to drop, not just a list of open ones.
- Respect \`quiet_hours_local\` for external recipients; no weekend nudges by default.
- Reply wake-ups re-classify instead of closing on any reply (fewer false closes).

## 1.1 - 2026-09-02
- Added \`max_nudges_per_thread\` and the \`escalate\` status with a channel-switch suggestion.
- Voice matching uses the last 30 sent messages instead of 10.

## 1.0 - 2026-07-15
- First release: morning sweep, Tasks ledger, nudge drafts left for approval, Chat summary.
`,
    },
  ],
  'uc-delegate': [
    {
      path: 'SKILL.md',
      content: `---
name: delegate-stakeholder-coordinator
namespace: google
version: "1.1"
description: Use when a user hands Gemini a Gmail thread with "Delegate to Gemini" and needs the right people identified, briefed and booked into a decision meeting over the next few days.
license: Apache-2.0
surfaces: [Gmail, Calendar, Chat, Drive]
runtime: long-running
approval: Every outgoing email and every calendar invitation; the user approves each one individually.
entitlement_cost_per_run_usd: 0.22
typical_runs_per_user_per_week: 3
outputs: schema/output.json
---

# Stakeholder Coordinator (Delegate to Gemini)

## When to use

- A thread lands that needs a decision from several people, and half of them are not on it yet:
  a pricing exception, a launch date change, a vendor swap, a policy question.
- The user would normally spend 30-60 minutes over two days working out who decides, who must be
  consulted, writing three variants of the same email and chasing calendars.
- Triggered from Gmail with **Delegate to Gemini** on the thread. The user states the goal in one
  line, e.g. "Get a yes/no on the Tallgrass discount by Thursday."
- Not for sensitive HR, legal hold or M&A threads; the skill refuses when the thread carries a
  Confidential-Restricted label.
- Signs it is working: decisions land before the deadline with one meeting or none, and the
  user's own time on the thread drops to a few approvals and edits.

## How it runs

1. **Day 0, minute 0: map.** Reads the delegated thread, linked Drive files and the user's org
   chart from the Directory. Proposes a stakeholder map with roles: \`decider\`, \`approver\`,
   \`consulted\`, \`informed\`.
2. **Checkpoint 1: confirm the map.** The map is shown in the Gmail side panel. The user removes,
   adds or re-roles people. Nothing is sent until the map is confirmed.
3. **Drafts in the user's voice.** One draft per role group: a crisp ask for deciders, a context
   brief for consulted, a heads-up for informed. All sit in Drafts.
4. **Checkpoint 2: approve each send.** The user approves drafts one by one ("Send" or "Edit").
5. **Scheduling.** Reads free/busy for deciders and approvers, proposes three 30-minute slots
   inside the deadline and drafts the invite with a pre-read link. The invite is booked only after
   the user approves the slot.
6. **Wake-ups.** Replies on any of the new threads, RSVP changes and the deadline approaching
   (T-24h) wake the agent. It updates the map status and drafts follow-ups for silent deciders.
7. **Close.** When the decider replies with a decision or the meeting ends, it drafts a decision
   record email and offers to post it to the team's Chat space. Both need approval.

## Instructions

1. Restate the user's goal as a single decision question with a deadline before doing anything
   else. If either is missing, ask the user; do not guess a deadline.
2. Build the stakeholder map from the thread participants, people @mentioned in linked Docs,
   Directory managers of the people asking, and owners of linked Drive files.
3. Assign exactly one \`decider\`. If the evidence points to two, flag the conflict at Checkpoint 1.
4. Keep the map to at most \`max_stakeholders\` people. Prefer \`informed\` over adding a meeting
   attendee.
5. Write drafts in the user's voice using their last 30 sent messages for tone, greeting and
   sign-off. Deciders' drafts lead with the question and the deadline in the first two lines.
6. Never send an email and never create a calendar event without explicit user approval of that
   specific item. Approval of one draft is not approval of the others.
7. For scheduling, respect working hours and focus-time blocks; never propose slots that overlap
   an existing event marked busy, and never move someone else's meeting.
8. Attach the pre-read as a Drive link with the recipients' existing access; if someone lacks
   access, tell the user instead of changing sharing settings.
9. When a decider is silent for \`nudge_after_hours\`, draft one follow-up and wait for approval.
10. Record every state change in the run output so the user can audit what happened and when.
11. Stop and hand back to the user when the decision is made, the deadline passes, or the user
    says "take it from here".

## Approvals & guardrails

- **Email:** every outgoing message is approved individually from the side panel or Drafts.
- **Calendar:** proposed slots are shown first; the event is booked only after the user approves.
- **Sharing:** the agent never changes Drive permissions. It reports missing access instead.
- **Scope:** it acts only on the delegated thread and threads it created; it does not read the
  rest of the inbox.
- **Cost:** a full delegation (map, 3-5 drafts, scheduling, 1-2 wake-ups) is about $0.22.

## Examples

\`\`\`json
{
  "input": { "goal": "Yes/no on the 18% Tallgrass discount by Thu 12 Nov",
             "thread_participants": 3, "linked_docs": 1 },
  "output": { "decider": "VP Sales West", "drafts": 3, "proposed_slots": 3,
              "status": "awaiting_user_approval" }
}
\`\`\`

## Parameters

\`\`\`yaml
max_stakeholders: 8          # hard cap on people in the map
meeting_length_minutes: 30
slots_to_propose: 3
nudge_after_hours: 24        # silence from a decider before a follow-up draft
respect_focus_time: true
post_decision_to_chat: ask   # ask | never
restricted_label: "Confidential-Restricted"
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Stakeholder Coordinator run",
  "type": "object",
  "required": ["delegation_id", "decision_question", "deadline", "status", "stakeholders", "pending_approvals"],
  "properties": {
    "delegation_id": { "type": "string" },
    "decision_question": { "type": "string" },
    "deadline": { "type": "string", "format": "date-time" },
    "status": {
      "type": "string",
      "enum": ["mapping", "awaiting_user_approval", "waiting_on_stakeholders", "meeting_booked", "decided", "expired", "handed_back"]
    },
    "stakeholders": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "email", "role", "state"],
        "properties": {
          "name": { "type": "string" },
          "email": { "type": "string" },
          "title": { "type": "string" },
          "role": { "type": "string", "enum": ["decider", "approver", "consulted", "informed"] },
          "state": { "type": "string", "enum": ["not_contacted", "draft_ready", "contacted", "responded", "attending", "declined"] },
          "reason": { "type": "string" }
        }
      }
    },
    "pending_approvals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["send_email", "book_event", "post_chat"] },
          "summary": { "type": "string" },
          "recipients": { "type": "array", "items": { "type": "string" } },
          "proposed_start": { "type": "string", "format": "date-time" }
        }
      }
    },
    "access_warnings": { "type": "array", "items": { "type": "string" } },
    "next_wake": { "type": "string" }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "delegated_by": "leah.moreno@cymbal-sandbox.example",
  "timezone": "America/Denver",
  "goal": "Get a yes/no on the 18% Tallgrass Outfitters discount by Thursday noon",
  "thread": {
    "subject": "Tallgrass Outfitters - renewal pricing exception",
    "messages": [
      {
        "from": "sam.whitfield@cymbal-sandbox.example",
        "at": "2026-11-09T09:14:00-07:00",
        "body": "Leah, Tallgrass is asking for 18% off the three-year renewal. Standard ceiling is 12%. They've hinted they're evaluating alternatives. Deal desk sheet is linked. Who needs to sign off?"
      },
      {
        "from": "leah.moreno@cymbal-sandbox.example",
        "at": "2026-11-09T09:40:00-07:00",
        "body": "Thanks Sam. Let me pull the right folks together."
      }
    ],
    "linked_files": [
      {
        "title": "Tallgrass renewal - deal desk sheet",
        "owner": "nora.batista@cymbal-sandbox.example",
        "mentions": ["owen.park@cymbal-sandbox.example"]
      }
    ]
  },
  "directory": [
    { "name": "Sam Whitfield", "email": "sam.whitfield@cymbal-sandbox.example", "title": "Account Executive", "manager": "leah.moreno@cymbal-sandbox.example" },
    { "name": "Leah Moreno", "email": "leah.moreno@cymbal-sandbox.example", "title": "Sales Director, Mountain", "manager": "grace.oyelaran@cymbal-sandbox.example" },
    { "name": "Grace Oyelaran", "email": "grace.oyelaran@cymbal-sandbox.example", "title": "VP Sales, West", "manager": "cro@cymbal-sandbox.example" },
    { "name": "Nora Batista", "email": "nora.batista@cymbal-sandbox.example", "title": "Deal Desk Lead", "manager": "finance-dir@cymbal-sandbox.example" },
    { "name": "Owen Park", "email": "owen.park@cymbal-sandbox.example", "title": "Finance Business Partner", "manager": "finance-dir@cymbal-sandbox.example" },
    { "name": "Ivy Chen", "email": "ivy.chen@cymbal-sandbox.example", "title": "Customer Success Manager", "manager": "cs-dir@cymbal-sandbox.example" }
  ],
  "free_busy_window": { "start": "2026-11-10T08:00:00-07:00", "end": "2026-11-12T12:00:00-07:00" }
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "delegation_id": "dlg-7f3a-tallgrass",
  "decision_question": "Do we approve an 18% discount (vs 12% ceiling) on the Tallgrass Outfitters three-year renewal?",
  "deadline": "2026-11-12T12:00:00-07:00",
  "status": "awaiting_user_approval",
  "stakeholders": [
    { "name": "Grace Oyelaran", "email": "grace.oyelaran@cymbal-sandbox.example", "title": "VP Sales, West", "role": "decider", "state": "draft_ready", "reason": "Discount above ceiling needs VP sign-off; Leah's manager." },
    { "name": "Nora Batista", "email": "nora.batista@cymbal-sandbox.example", "title": "Deal Desk Lead", "role": "approver", "state": "draft_ready", "reason": "Owns the deal desk sheet linked in the thread." },
    { "name": "Owen Park", "email": "owen.park@cymbal-sandbox.example", "title": "Finance Business Partner", "role": "consulted", "state": "draft_ready", "reason": "Mentioned in the deal desk sheet margin analysis." },
    { "name": "Ivy Chen", "email": "ivy.chen@cymbal-sandbox.example", "title": "Customer Success Manager", "role": "consulted", "state": "not_contacted", "reason": "Owns adoption data that supports the churn-risk claim." },
    { "name": "Sam Whitfield", "email": "sam.whitfield@cymbal-sandbox.example", "title": "Account Executive", "role": "informed", "state": "not_contacted", "reason": "Raised the request; needs the outcome for the customer." }
  ],
  "pending_approvals": [
    { "kind": "send_email", "summary": "Decision ask to Grace: 18% vs 12% ceiling, answer needed by Thu noon, deal desk sheet linked.", "recipients": ["grace.oyelaran@cymbal-sandbox.example"] },
    { "kind": "send_email", "summary": "Context brief to Nora and Owen asking for margin impact at 15% and 18%.", "recipients": ["nora.batista@cymbal-sandbox.example", "owen.park@cymbal-sandbox.example"] },
    { "kind": "book_event", "summary": "30-min decision call: Grace, Nora, Owen, Leah. Pre-read: deal desk sheet.", "recipients": ["grace.oyelaran@cymbal-sandbox.example", "nora.batista@cymbal-sandbox.example", "owen.park@cymbal-sandbox.example"], "proposed_start": "2026-11-10T14:00:00-07:00" }
  ],
  "access_warnings": ["Grace Oyelaran has no access to 'Tallgrass renewal - deal desk sheet'. Ask Nora to share it; sharing was not changed."],
  "next_wake": "On any reply or RSVP, or 2026-11-11T12:00:00-07:00 (T-24h)"
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab 2: Delegate a decision to Gemini

**Time box:** 40 minutes

## Objective

Hand a messy, multi-person thread to Gemini with **Delegate to Gemini** and let it run the
coordination for a simulated three days: map stakeholders, draft in your voice, propose a meeting
and chase silence. You stay in control of every send and every booking.

## Setup

- **Seats:** Business Standard seats in \`cymbal-sandbox.example\`; one facilitator seat plays the
  stakeholders (Grace, Nora, Owen) via pre-built Gmail filters and canned replies.
- **Data:** the "Tallgrass renewal" thread, the deal desk Sheet in a shared drive, and seeded
  calendars with realistic busy blocks and one focus-time block on Wednesday.
- **Package:** \`google/delegate-stakeholder-coordinator@1.1\`.
- The workshop clock is compressed: the facilitator advances "days" by sending wake events.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. In Gmail, open "Tallgrass Outfitters - renewal pricing exception". Click **Delegate to
   Gemini** and type the goal: "Get a yes/no on the 18% discount by Thursday noon."
2. Review the stakeholder map in the side panel. Gemini proposes Grace as decider. Move Ivy from
   \`consulted\` to \`informed\` and confirm the map (Checkpoint 1).
3. Open each draft. Approve the decider ask as written, edit the brief to Nora and Owen to add one
   sentence of your own, and send both. Leave the heads-up to Sam unsent for now.
4. Read the access warning about the deal desk Sheet. Fix it the right way: ask Nora in Chat to
   share it. Confirm the agent did not change sharing itself.
5. Review the three proposed slots. Notice none overlap Wednesday focus time. Approve the Tuesday
   14:00 slot; check that the invite appears only after your approval.
6. Facilitator advances to "Day 2": Grace has not replied. Open the follow-up draft Gemini wrote
   and decide whether to send or wait.
7. Facilitator sends Grace's decision ("approve at 15%"). Watch the agent draft the decision record
   and offer to post it to the "Mountain deals" Chat space. Approve the email, decline the post.

## What good looks like

- [ ] Exactly one decider in the confirmed map.
- [ ] Every email and the invite carry your approval in the activity log; nothing auto-sent.
- [ ] Drive sharing unchanged; the access gap was handled by a human.
- [ ] The decision record names the outcome (15%), who decided and the date.
- [ ] Your total hands-on time is under 10 minutes for what is normally a two-day chase.

## Entitlement check

About $0.22 per delegation, 3 delegations a week: 0.22 x 3 x 4.3 = about $2.84 a month. That fits
a $6 Standard or Plus seat; Starter seats ($2) should plan for 2 delegations a week.

## Facilitator notes

- Run the "Day 2" and "decision" wake events from the facilitator console at fixed times for
  the whole room so the debrief lines up.
- If an attendee's map lists two deciders, keep it: resolving the conflict at Checkpoint 1 is the
  point of the step.
- Expect the question "can it just book the meeting?" The answer is no, by design. Each send and
  each booking is approved individually, and approving one draft does not approve the others.
- Starter-seat attendees should note the entitlement guidance in the check below.
- Debrief prompt: name one decision in your real inbox that is waiting on someone not yet on the
  thread.

## Measure it next week

- **Signal:** agentic tasks per user per week with source "Delegate to Gemini" in the Admin
  console Gemini usage report. Two or more per active user means the habit stuck.
- **Secondary:** median time from delegation to \`decided\` (target under 3 business days) and the
  share of drafts sent with light or no edits.
- **Watch for:** delegations that end in \`expired\`; review them in office hours to see whether the
  map or the deadline was wrong.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.1 - 2026-10-28
- Access warnings: report missing Drive access instead of failing silently. Never change sharing.
- Respect focus-time blocks when proposing slots.
- T-24h deadline wake-up drafts a follow-up for silent deciders.

## 1.0 - 2026-08-19
- First release: stakeholder map with one decider, role-specific drafts, per-item approval,
  slot proposals and decision record draft.
`,
    },
  ],
  'uc-meeting': [
    {
      path: 'SKILL.md',
      content: `---
name: meeting-to-actions
namespace: google
version: "1.4"
description: Use when a recurring or one-off meeting produces notes and the user wants every action item assigned, tracked and closed out before the next occurrence.
license: Apache-2.0
surfaces: [Meet, Docs, Gmail, Tasks, Chat, Calendar]
runtime: long-running
approval: The recap email, any message to an owner outside the meeting, and any change to the next occurrence's agenda or invite.
entitlement_cost_per_run_usd: 0.14
typical_runs_per_user_per_week: 4
outputs: schema/output.json
---

# Meeting-to-Actions Loop

## When to use

- The user runs or owns a meeting whose notes are captured by "Take notes for me" in Meet, or
  typed into a Doc attached to the calendar event.
- Action items get written down but nobody owns the follow-through between meetings.
- Typical meetings: weekly project syncs, customer QBR prep, incident reviews, hiring debriefs.
- Not for meetings without notes, or where the notes Doc is owned by someone outside the domain.
- Signs it is working: the next sync opens with the carry-over list instead of "where were
  we?", and fewer actions slip twice in a row.

## How it runs

1. **Wake: notes Doc finalised.** When Meet finishes writing notes to the event's Doc (or the
   organiser marks the Doc "final"), the agent wakes, usually 5-15 minutes after the call.
2. **Extract.** Pulls decisions, action items, owners and due dates. Resolves owners against the
   attendee list and Directory; unresolved owners go to the user as questions.
3. **Checkpoint 1: recap.** Drafts a recap email to attendees (decisions first, then actions with
   owners and dates) and inserts a structured "Actions" table at the top of the notes Doc. The Doc
   edit is shown as suggestions; the email waits in Drafts.
4. **Assign.** After approval, the agent @mentions each owner in a Doc comment on their row, which
   creates a Google Tasks item assigned to them through Docs' assign-a-task feature.
5. **Mid-cycle check (daily at 10:00).** Reads comment replies, Task completion and linked Docs.
   For actions with no movement at 50% of the time to due date, drafts a gentle Chat nudge to the
   owner for the user to approve.
6. **Checkpoint 2: pre-meeting (T-24h before next occurrence).** Builds a "carry-over" section:
   done, in progress, slipped. Proposes it as a suggestion in the next occurrence's agenda Doc and
   asks the user before editing the invite description.
7. The loop ends when every action is closed or carried into the next occurrence's agenda.

## Instructions

1. Extract only items with a clear verb and an object ("send the SOW to legal"). Discussion
   points without an owner become "open questions", not actions.
2. Each action has exactly one owner. If the notes say "we" or name two people, ask the user who
   owns it; never split an action silently.
3. Normalise due dates to ISO dates in the organiser's time zone. "Next sync" means the next
   occurrence of this recurring event.
4. Make all Doc edits as suggestions so the organiser can accept or reject them.
5. Put the recap email in Drafts addressed to attendees only. Never add people who were not
   invited; propose them to the user instead.
6. Use Doc comment assignments for owners inside the domain. For external owners, list the action
   in the recap and track it on the user's own Task list.
7. Nudges go by Chat DM, are under 40 words, reference the action row link and are sent only
   after the user approves them. At most one nudge per action per cycle.
8. Never change the meeting time, attendees or recurrence.
9. Before the next occurrence, summarise status as done / in_progress / slipped / dropped with the
   evidence used (comment reply, Task completion, linked Doc change).
10. Emit JSON matching \`schema/output.json\` after every wake.

## Approvals & guardrails

- **Email:** the recap is a draft until the user sends it.
- **Docs:** all edits are suggestions; the agent does not accept its own suggestions.
- **Chat:** each nudge is approved individually; nudges never go to external guests.
- **Calendar:** no changes to time, attendees or recurrence; agenda changes are proposed only.
- **Cost:** about $0.14 per wake that does work (extract, mid-cycle check, pre-meeting build).
  Asking Gemini questions about the notes in the side panel does not draw down the entitlement.

## Examples

\`\`\`json
{
  "input": { "notes_excerpt": "Arun to send revised SOW to legal by Wed. Decision: pilot starts 1 Dec." },
  "output": { "decisions": ["Pilot starts 2026-12-01"],
              "actions": [{ "owner": "arun.mehta@cymbal-sandbox.example",
                            "action": "Send revised SOW to legal", "due": "2026-11-11" }] }
}
\`\`\`

## Parameters

\`\`\`yaml
nudge_at_fraction_of_window: 0.5   # nudge when half the time to due date has passed with no movement
max_nudges_per_action: 1
mid_cycle_check_time_local: "10:00"
pre_meeting_build_hours: 24
doc_edit_mode: suggest             # suggest only; direct edits are not supported
include_open_questions: true
recap_order: [decisions, actions, open_questions]
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Meeting-to-Actions run",
  "type": "object",
  "required": ["meeting", "wake_reason", "decisions", "actions", "pending_approvals"],
  "properties": {
    "meeting": {
      "type": "object",
      "required": ["title", "occurred_at", "notes_doc"],
      "properties": {
        "title": { "type": "string" },
        "occurred_at": { "type": "string", "format": "date-time" },
        "notes_doc": { "type": "string" },
        "next_occurrence": { "type": "string", "format": "date-time" }
      }
    },
    "wake_reason": { "type": "string", "enum": ["notes_finalised", "mid_cycle_check", "pre_meeting_build", "owner_reply"] },
    "decisions": { "type": "array", "items": { "type": "string" } },
    "actions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "action", "owner", "status"],
        "properties": {
          "id": { "type": "string" },
          "action": { "type": "string" },
          "owner": { "type": "string" },
          "owner_type": { "type": "string", "enum": ["internal", "external", "unresolved"] },
          "due": { "type": "string", "format": "date" },
          "status": { "type": "string", "enum": ["new", "assigned", "in_progress", "done", "slipped", "dropped"] },
          "evidence": { "type": "string" }
        }
      }
    },
    "open_questions": { "type": "array", "items": { "type": "string" } },
    "pending_approvals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["send_recap", "doc_suggestion", "chat_nudge", "agenda_update"] },
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
  "organiser": "hana.sato@cymbal-sandbox.example",
  "timezone": "Europe/London",
  "event": {
    "title": "Orchard Pilot - weekly sync",
    "start": "2026-11-10T15:00:00Z",
    "recurrence": "weekly on Tuesday",
    "attendees": [
      "hana.sato@cymbal-sandbox.example",
      "arun.mehta@cymbal-sandbox.example",
      "beatriz.costa@cymbal-sandbox.example",
      "tomas.novak@cymbal-sandbox.example",
      "rachel.mbeki@fernhill-health.example"
    ],
    "notes_doc": "Notes - Orchard Pilot weekly sync - 2026-11-10"
  },
  "notes_text": "Summary\\n- Fernhill confirmed the pilot cohort: 3 clinics, 140 users.\\n- Legal still reviewing the SOW redlines from last week.\\n\\nDecisions\\n- Pilot start moves to 1 December to give IT a full week for SSO testing.\\n- We will not include the analytics add-on in the pilot scope.\\n\\nNext steps\\n- Arun to send revised SOW to legal by Wednesday.\\n- Beatriz and Tomas to draft the SSO test plan.\\n- Rachel (Fernhill) to share the clinic go-live calendar.\\n- Hana to update the steering deck before next sync.\\n- Someone should check whether the training videos need captions.",
  "wake_reason": "notes_finalised"
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "meeting": {
    "title": "Orchard Pilot - weekly sync",
    "occurred_at": "2026-11-10T15:00:00Z",
    "notes_doc": "Notes - Orchard Pilot weekly sync - 2026-11-10",
    "next_occurrence": "2026-11-17T15:00:00Z"
  },
  "wake_reason": "notes_finalised",
  "decisions": [
    "Pilot start moves to 2026-12-01 to allow a full week of SSO testing.",
    "Analytics add-on is out of pilot scope."
  ],
  "actions": [
    { "id": "A1", "action": "Send revised SOW to legal", "owner": "arun.mehta@cymbal-sandbox.example", "owner_type": "internal", "due": "2026-11-11", "status": "new" },
    { "id": "A2", "action": "Draft the SSO test plan", "owner": "unresolved: Beatriz Costa or Tomas Novak", "owner_type": "unresolved", "due": "2026-11-17", "status": "new", "evidence": "Notes name two people; asking organiser for a single owner." },
    { "id": "A3", "action": "Share the clinic go-live calendar", "owner": "rachel.mbeki@fernhill-health.example", "owner_type": "external", "due": "2026-11-17", "status": "new", "evidence": "External owner; tracked on organiser's Task list, listed in recap." },
    { "id": "A4", "action": "Update the steering deck", "owner": "hana.sato@cymbal-sandbox.example", "owner_type": "internal", "due": "2026-11-16", "status": "new" }
  ],
  "open_questions": [
    "Do the training videos need captions? No owner named."
  ],
  "pending_approvals": [
    { "kind": "doc_suggestion", "summary": "Insert an Actions table (A1-A4) at the top of the notes Doc as a suggestion." },
    { "kind": "send_recap", "summary": "Recap draft to all 5 attendees: 2 decisions, 4 actions, 1 open question." }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab 3: Close the loop between meetings

**Time box:** 45 minutes

## Objective

Make a recurring meeting self-maintaining: Gemini turns notes into owned actions, follows them for
a week across Docs, Tasks and Chat, and builds the carry-over for the next sync. You approve the
recap, every nudge and every agenda change.

## Setup

- **Seats:** Business Standard or Enterprise Standard seats in \`cymbal-sandbox.example\`. Groups of
  four attendees share one recurring event so assignments land on real colleagues.
- **Data:** a pre-recorded "Orchard Pilot" Meet call with "Take notes for me" output, plus the
  previous week's notes Doc with two unfinished actions.
- **Package:** \`google/meeting-to-actions@1.4\`.
- External attendee \`rachel.mbeki@fernhill-health.example\` is a facilitator-controlled mailbox.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Open the event "Orchard Pilot - weekly sync" in Calendar and open its notes Doc. Read the
   "Next steps" section and predict how many actions have a single clear owner.
2. Start the skill from the Docs side panel: "Run meeting-to-actions on this sync." Review the
   suggested Actions table. Resolve A2 by choosing Beatriz as owner.
3. Accept the table suggestion. Confirm each internal owner got a Doc comment assignment and a
   Task. Check that Rachel, the external owner, did not get a comment assignment.
4. Open Drafts and review the recap. Move the open question about captions into an action owned
   by yourself, then send the recap.
5. Facilitator advances to "Thursday 10:00". Arun's action has no movement. Review the Chat nudge
   draft, shorten it, and approve it.
6. Arun's teammate replies in the Doc comment thread "sent to legal". Watch the next check mark
   A1 done and cite the comment as evidence.
7. Facilitator advances to "Monday 15:00" (T-24h). Review the carry-over section suggested in next
   week's agenda Doc and the proposed invite description change. Accept the Doc suggestion; decline
   the invite change.

## What good looks like

- [ ] Every action has exactly one owner; nothing was split silently.
- [ ] All Doc changes arrived as suggestions.
- [ ] The recap went out once, from you, to invited attendees only.
- [ ] External owners were tracked, not assigned or nudged.
- [ ] The carry-over shows done / in progress / slipped with evidence for each.
- [ ] No change to meeting time, attendees or recurrence.

## Entitlement check

About $0.14 per working wake and 4 per week (extract, mid-cycle, pre-meeting, one reply wake):
0.14 x 4 x 4.3 = about $2.41 a month per organiser. Attendees who only receive assignments
spend nothing.

## Facilitator notes

- Play the recorded Meet call only once for the room; the notes Doc is already attached to each
  group's copy of the event, so groups do not need to rejoin.
- If no Actions table appears, check the notes Doc owner is inside the sandbox domain; the skill
  skips Docs owned externally.
- Groups often argue about A2. That is useful: ask them how they would phrase the action in the
  meeting so the owner is never ambiguous.
- Keep the external mailbox (Rachel) quiet during the lab; it exists to show tracking, not nudging.
- Debrief prompt: which recurring meeting on your calendar would benefit most next week?

## Measure it next week

- **Signal:** agentic tasks per user per week for organisers, plus the count of Doc comment
  assignments created by Gemini. Healthy: 3+ agentic tasks per organiser per week.
- **Outcome:** share of actions closed before the next occurrence (baseline it this week; target
  +20 points in a month).
- **Watch for:** organisers who stop accepting the Actions table suggestion; usually the notes
  are too vague, so coach on stating owners out loud in the meeting.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.4 - 2026-10-30
- Pre-meeting build now proposes the carry-over into the next occurrence's agenda Doc.
- Evidence field cites the comment, Task or Doc change used to set a status.

## 1.3 - 2026-09-24
- External owners are tracked on the organiser's Task list instead of being assigned.
- Open questions are separated from actions.

## 1.2 - 2026-08-27
- Mid-cycle nudge moved from email to Chat DM, with per-nudge approval.

## 1.1 - 2026-07-30
- Unresolved owners are asked about instead of split across two people.

## 1.0 - 2026-06-25
- First release: notes extraction, recap draft, Actions table as Doc suggestion.
`,
    },
  ],
  'uc-status': [
    {
      path: 'SKILL.md',
      content: `---
name: weekly-status-digest
namespace: google
version: "1.0"
description: Use when a team lead wants Gemini, @mentioned in a Chat space, to collect the week's progress from files and threads and post one status digest without a status meeting.
license: Apache-2.0
surfaces: [Chat, Docs, Sheets, Gmail, Drive]
runtime: long-running
approval: Posting the digest to the space, any DM to a contributor, and any email copy to stakeholders outside the space.
entitlement_cost_per_run_usd: 0.35
typical_runs_per_user_per_week: 1
outputs: schema/output.json
---

# Weekly Status Digest (Chat coworker)

## When to use

- A team of 4-15 people coordinates in a Google Chat space and keeps its plan in a Sheet or Doc.
- The lead spends Friday afternoon reading threads and chasing people for a status update.
- The space already shares the relevant files (project tracker Sheet, design Docs, launch plan).
- Not for cross-company spaces with external members; the digest would summarise their messages
  to people who may not have consented.
- Signs it is working: the weekly status call is cancelled or shortened, and the team starts
  tagging \`#update\` because they know the digest reads it.

## How it runs

1. **Setup.** The lead @mentions Gemini in the space: "@Gemini run the weekly status digest every
   Thursday." The agent reads files shared in the space and asks which one is the source of truth
   for milestones.
2. **Wake: Wednesday 16:00.** Collects signals since the last digest: tracker Sheet row changes,
   Docs with new versions, resolved and open comment threads, and space messages tagged with
   \`#update\` or \`#blocked\`.
3. **Gap check.** Lists workstreams with no signal this week. Drafts a short DM to each owner
   ("Anything to add for the digest by Thursday 11:00?"). The lead approves the batch of DMs.
4. **Wake: replies.** Replies to those DMs, or new \`#update\` messages in the space, wake the agent
   to fold them in. It answers coworker questions in the space thread when @mentioned
   (answering from shared files only).
5. **Checkpoint: Thursday 12:00.** The digest draft (RAG status per workstream, top risks, asks of
   others, decisions needed) appears in a DM to the lead with "Post", "Edit" and "Skip" options.
6. **Post.** After approval, posts the digest to the space as a new thread and optionally drafts an
   email copy for stakeholders outside the space (separate approval).
7. **Triage until next run.** Replies in the digest thread that ask a question or report a blocker
   are triaged: answered from files, or turned into a follow-up item for next week's digest.

## Instructions

1. Use only content from the space, files shared in it and the configured tracker. Never read
   the members' personal mail or private files.
2. Status per workstream is \`green\`, \`amber\` or \`red\`. Red requires a cited reason: a slipped
   date in the tracker, an \`#blocked\` message, or an open risk older than 5 business days.
3. Every claim in the digest links to its source (Sheet row, Doc, message). No unsourced claims.
4. Keep the digest under \`max_digest_words\`. Lead with what changed, then risks, then asks.
5. When a workstream has no signal, say "no update received" rather than inferring progress.
6. DMs to contributors are drafted as one batch and sent only after the lead approves the batch.
   Send at most one DM per person per week.
7. When @mentioned in a thread, answer only from shared files and cite them; if unsure, say so and
   tag the owner rather than guessing.
8. Never post outside the configured space and never change the tracker Sheet; propose edits as
   comments if a row looks stale.
9. Emit JSON matching \`schema/output.json\` at the checkpoint and after posting.

## Approvals & guardrails

- **Space post:** the digest is posted only after the lead clicks Post.
- **DMs:** approved as a batch, once per week, at most one per person.
- **Email copy:** separate draft in the lead's Drafts; never sent by the agent.
- **Files:** read-only. Suggested tracker corrections are left as comments.
- **Cost:** one weekly run (collect, gap check, fold-in, post) is about $0.35. Coworkers asking
  Gemini questions in the space is chat, not an agentic task, so it does not draw down.

## Examples

\`\`\`json
{
  "input": { "space": "Atlas Launch", "tracker_rows_changed": 9, "blocked_messages": 1 },
  "output": { "workstreams": [{ "name": "Payments", "status": "red",
              "reason": "Sandbox certification slipped from 13 Nov to 20 Nov (tracker row 12)" }] }
}
\`\`\`

## Parameters

\`\`\`yaml
collect_at: "Wed 16:00"
contributor_cutoff: "Thu 11:00"
post_checkpoint: "Thu 12:00"
max_digest_words: 350
red_if_risk_older_than_days: 5
update_hashtags: ["#update", "#blocked"]
email_copy: ask            # ask | never
tracker_source: "Atlas launch tracker"   # the Sheet named as source of truth
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Weekly Status Digest run",
  "type": "object",
  "required": ["space", "week_of", "phase", "workstreams", "risks", "asks", "approval_state"],
  "properties": {
    "space": { "type": "string" },
    "week_of": { "type": "string", "format": "date" },
    "phase": { "type": "string", "enum": ["collect", "gap_check", "draft_ready", "posted", "skipped"] },
    "workstreams": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "owner", "status", "summary"],
        "properties": {
          "name": { "type": "string" },
          "owner": { "type": "string" },
          "status": { "type": "string", "enum": ["green", "amber", "red", "no_update"] },
          "summary": { "type": "string", "maxLength": 300 },
          "reason": { "type": "string" },
          "sources": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "risks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["risk", "severity"],
        "properties": {
          "risk": { "type": "string" },
          "severity": { "type": "string", "enum": ["low", "medium", "high"] },
          "owner": { "type": "string" }
        }
      }
    },
    "asks": { "type": "array", "items": { "type": "string" } },
    "dm_batch": { "type": "array", "items": { "type": "string" } },
    "approval_state": { "type": "string", "enum": ["not_requested", "awaiting_lead", "approved", "edited_and_approved", "skipped"] },
    "digest_markdown": { "type": "string" }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "space": "Atlas Launch",
  "lead": "femi.adeleke@cymbal-sandbox.example",
  "week_of": "2026-11-09",
  "phase": "draft_ready",
  "tracker_source": "Atlas launch tracker",
  "tracker_changes": [
    { "row": 7, "workstream": "Mobile app", "field": "status", "from": "In progress", "to": "Code complete", "owner": "lina.haddad@cymbal-sandbox.example" },
    { "row": 12, "workstream": "Payments", "field": "target_date", "from": "2026-11-13", "to": "2026-11-20", "owner": "jonas.weber@cymbal-sandbox.example" },
    { "row": 15, "workstream": "Help center", "field": "status", "from": "Not started", "to": "Drafting", "owner": "mei.tan@cymbal-sandbox.example" }
  ],
  "space_messages": [
    { "from": "jonas.weber@cymbal-sandbox.example", "at": "2026-11-10T10:22:00Z", "text": "#blocked sandbox certification queue at the card processor is 7 days. Can someone with a partner contact help expedite?" },
    { "from": "lina.haddad@cymbal-sandbox.example", "at": "2026-11-11T17:05:00Z", "text": "#update iOS and Android builds passed internal QA. TestFlight to beta group Monday." }
  ],
  "docs_changed": [
    { "title": "Atlas launch comms plan", "owner": "ruth.kimani@cymbal-sandbox.example", "new_version_at": "2026-11-11T09:30:00Z", "open_comments": 4 }
  ],
  "dm_replies": [
    { "from": "ruth.kimani@cymbal-sandbox.example", "text": "Press kit draft done, waiting on legal review of the pricing paragraph." }
  ],
  "workstreams": ["Mobile app", "Payments", "Help center", "Launch comms", "Data migration"]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "space": "Atlas Launch",
  "week_of": "2026-11-09",
  "phase": "draft_ready",
  "workstreams": [
    { "name": "Mobile app", "owner": "lina.haddad@cymbal-sandbox.example", "status": "green", "summary": "Code complete; iOS and Android passed internal QA. Beta to TestFlight group Monday.", "sources": ["tracker row 7", "space message 2026-11-11 #update"] },
    { "name": "Payments", "owner": "jonas.weber@cymbal-sandbox.example", "status": "red", "summary": "Sandbox certification slipped one week; processor queue is 7 days.", "reason": "Target date moved 2026-11-13 to 2026-11-20 and an open #blocked message.", "sources": ["tracker row 12", "space message 2026-11-10 #blocked"] },
    { "name": "Help center", "owner": "mei.tan@cymbal-sandbox.example", "status": "green", "summary": "Moved from not started to drafting.", "sources": ["tracker row 15"] },
    { "name": "Launch comms", "owner": "ruth.kimani@cymbal-sandbox.example", "status": "amber", "summary": "Press kit drafted; pricing paragraph waiting on legal. 4 open comments on the comms plan.", "sources": ["Atlas launch comms plan", "DM reply from Ruth"] },
    { "name": "Data migration", "owner": "unassigned", "status": "no_update", "summary": "No update received this week.", "sources": [] }
  ],
  "risks": [
    { "risk": "Payments certification slip pushes the 2026-12-02 launch if it slips again.", "severity": "high", "owner": "jonas.weber@cymbal-sandbox.example" },
    { "risk": "Legal review of pricing copy has no committed date.", "severity": "medium", "owner": "ruth.kimani@cymbal-sandbox.example" }
  ],
  "asks": [
    "Anyone with a contact at the card processor: help Jonas expedite sandbox certification.",
    "Femi: confirm an owner for Data migration."
  ],
  "dm_batch": ["ruth.kimani@cymbal-sandbox.example"],
  "approval_state": "awaiting_lead",
  "digest_markdown": "*Atlas Launch - week of 9 Nov*\\nGreen: Mobile app, Help center. Amber: Launch comms. Red: Payments. No update: Data migration.\\nRisks: payments certification (high), pricing copy legal review (medium).\\nAsks: processor contact for Jonas; owner for Data migration."
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab 4: Replace the status meeting with a Chat coworker

**Time box:** 40 minutes

## Objective

Add Gemini to a team space as a coworker that gathers progress from the files and threads the team
already uses, asks for missing updates, and posts a sourced weekly digest after the lead approves.

## Setup

- **Seats:** groups of five on Business Standard or Business Plus seats in
  \`cymbal-sandbox.example\`. One person per group is the lead.
- **Data:** a pre-built "Atlas Launch" Chat space with three weeks of history, the "Atlas launch
  tracker" Sheet, and the "Atlas launch comms plan" Doc, all shared to the space.
- **Package:** \`google/weekly-status-digest@1.0\`.
- The facilitator controls the clock for the Wednesday collect and Thursday checkpoint wakes.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Lead: in the space, type "@Gemini run the weekly status digest every Thursday. The tracker
   Sheet is the source of truth." Confirm Gemini replies with the schedule and sources it found.
2. Everyone: post one realistic message tagged \`#update\` or \`#blocked\` about your workstream.
   One person changes a target date in the tracker Sheet.
3. Facilitator triggers the Wednesday collect. Lead: review the gap-check DM batch in your DMs.
   Remove one person from the batch and approve the rest.
4. Recipients: reply to the DM with a one-line update. Check the agent folds it in (the lead can
   ask "@Gemini what changed since the collect?"; this is a chat question and costs nothing).
5. Anyone: ask "@Gemini why is Payments red?" in the space. Confirm the answer cites the tracker
   row and the \`#blocked\` message.
6. Facilitator triggers the Thursday checkpoint. Lead: open the digest draft, change one status,
   and click Post. Confirm the digest appears once, as a new thread.
7. Someone replies to the digest thread with a new blocker. Watch the agent triage it into next
   week's follow-ups rather than editing the posted digest.

## What good looks like

- [ ] Every line in the digest links to a row, Doc or message.
- [ ] A workstream with no signal says "no update received", not invented progress.
- [ ] Only one DM per person, and only after the lead approved the batch.
- [ ] The tracker Sheet was not edited by the agent.
- [ ] The lead spent under 10 minutes; the team skipped the 30-minute status call.

## Entitlement check

One weekly run is about $0.35: 0.35 x 1 x 4.3 = about $1.51 a month for the lead. Team members
asking @Gemini questions in the space use chat, which does not draw down the entitlement.

## Facilitator notes

- Make sure the tracker Sheet and comms Doc are shared to the space before the lab; the agent only
  reads files shared in the space.
- If the digest shows every workstream as "no update", attendees probably skipped step 2. Have
  them post their update messages and trigger the collect again.
- Point out the difference between asking @Gemini a question (chat, free) and the scheduled
  digest run (agentic, metered). Leads often worry that teammates' questions cost money.
- The reply in step 7 should be a real blocker, not a joke; triage quality depends on it.
- Debrief prompt: which status meeting could your team cancel if this ran for a month?

## Measure it next week

- **Signal:** agentic tasks per user per week for leads (target 1 digest posted per week) and the
  number of distinct spaces with an active digest schedule.
- **Secondary:** count of \`#update\` messages per space per week; it should rise as the team learns
  the digest reads them.
- **Watch for:** digests marked "skipped" two weeks running; the space usually lacks a clear
  tracker, so fix the source of truth first.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.0 - 2026-10-14
- General availability. Batch-approved gap-check DMs, sourced RAG statuses, digest thread triage.
- Email copy for stakeholders outside the space is now a separate draft and approval.

## 0.9 - 2026-09-09
- Beta with three internal teams. Added \`no_update\` status after feedback that the agent inferred
  progress from silence.

## 0.8 - 2026-08-05
- Private preview: collect and post only, no gap check.
`,
    },
  ],
  'uc-docreview': [
    {
      path: 'SKILL.md',
      content: `---
name: doc-review-partner
namespace: google
version: "1.3"
description: Use when a Doc author @mentions Gemini in a comment to run a multi-day review cycle, replying to reviewer threads and proposing inline edits until the document is ready to sign off.
license: Apache-2.0
surfaces: [Docs, Drive, Chat, Gmail]
runtime: long-running
approval: Accepting any suggestion, resolving any comment thread, and any message or email to reviewers; the agent only suggests and drafts.
entitlement_cost_per_run_usd: 0.12
typical_runs_per_user_per_week: 3
outputs: schema/output.json
---

# Doc Review Partner

## When to use

- A proposal, PRD, policy or customer-facing Doc is out for review with 3-10 reviewers and the
  comments pile up faster than the author can work through them.
- The author wants a partner that works in the Doc with a live cursor: answering factual threads
  from linked sources, grouping duplicate feedback, and drafting edits as suggestions.
- Started by @mentioning Gemini in a comment: "@Gemini be my review partner until Friday; target
  is sign-off from Legal and Product."
- Not for Docs owned outside the domain, or where the author is not an editor.
- Signs it is working: reviewers see their comments answered within hours, duplicate feedback
  collapses into one change, and sign-off arrives before the deadline.

## How it runs

1. **Kick-off.** Reads the Doc, its version history since the review started, linked Docs and
   Sheets, and every open comment thread. Builds a review board: thread, reviewer, theme, type
   (\`question\`, \`edit_request\`, \`disagreement\`, \`nit\`), and proposed handling.
2. **Checkpoint 1: board approval.** Posts the board as a reply to the kick-off comment and a
   Chat DM to the author. The author marks which threads the agent may answer.
3. **Work pass (live cursor).** For approved threads: replies to questions with citations to linked
   sources; drafts inline suggested edits for edit requests and nits, tagged to the thread; groups
   duplicate comments under one canonical thread with a reply on each duplicate.
4. **Wake: new comments or replies.** Each new comment, reply or reviewer accepting a suggestion
   wakes the agent to update the board. Disagreements between reviewers are never resolved by the
   agent; it writes a neutral side-by-side and asks the author to decide.
5. **Daily wrap (17:00).** Sends the author a Chat DM: threads closed, open, blocked on whom.
6. **Checkpoint 2: sign-off pack.** When required approvers have no open threads, drafts a
   sign-off request email to them with a change summary. The author sends it.
7. Ends when the required approvers sign off, the deadline passes, or the author says stop.

## Instructions

1. Work only inside this Doc and files linked from it. Do not open other files the reviewers own.
2. Classify each thread before acting. Only answer threads the author approved on the board.
3. All edits are suggestions. Never accept a suggestion, including your own.
4. Keep suggested edits minimal: change the fewest words that resolve the comment and preserve the
   author's terminology and heading structure.
5. When replying to a question, cite the source (linked Doc heading, Sheet range) in the reply. If
   no source answers it, say so and tag the author.
6. Never resolve a thread. Reply "Suggested edit ready for review" and let the reviewer or author
   resolve it.
7. For disagreements, post a neutral summary of each position with who holds it and leave the
   decision to the author. Do not pick a side.
8. Flag style-guide violations only once per pattern, with a single suggestion that fixes all
   instances.
9. Do not message reviewers directly. Draft any nudge or sign-off request for the author to send.
10. Emit JSON matching \`schema/output.json\` after each wake.

## Approvals & guardrails

- **Doc edits:** suggestions only; the author or reviewer accepts.
- **Threads:** the agent replies but never resolves.
- **Email and Chat to reviewers:** drafts only, sent by the author.
- **Scope:** this Doc and its linked sources; no sharing changes.
- **Cost:** about $0.12 per work pass or wake that changes the board. Asking Gemini to explain a
  comment in the side panel is chat and does not draw down the entitlement.

## Examples

\`\`\`json
{
  "input": { "comment": "Is the 99.9% SLA monthly or quarterly?", "reviewer": "Legal",
             "linked_source": "Service terms v4, section 3.2" },
  "output": { "type": "question", "handling": "reply_with_citation",
              "reply": "Monthly, per Service terms v4 s3.2. Suggested edit adds 'monthly'." }
}
\`\`\`

## Parameters

\`\`\`yaml
daily_wrap_time_local: "17:00"
required_approvers: []          # set at kick-off, e.g. ["Legal", "Product"]
group_duplicates: true
style_guide_doc: ""             # optional link to the team style guide
max_suggestions_per_pass: 25
answer_threads: approved_only   # approved_only | none
deadline: ""                    # ISO date; the loop ends here if not signed off
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Doc Review Partner run",
  "type": "object",
  "required": ["doc_title", "wake_reason", "threads", "counts", "signoff_ready"],
  "properties": {
    "doc_title": { "type": "string" },
    "wake_reason": { "type": "string", "enum": ["kickoff", "new_comment", "reply", "suggestion_accepted", "daily_wrap"] },
    "threads": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["thread_id", "reviewer", "type", "handling", "state"],
        "properties": {
          "thread_id": { "type": "string" },
          "reviewer": { "type": "string" },
          "theme": { "type": "string" },
          "type": { "type": "string", "enum": ["question", "edit_request", "disagreement", "nit"] },
          "handling": { "type": "string", "enum": ["reply_with_citation", "suggest_edit", "group_duplicate", "side_by_side_for_author", "author_only"] },
          "state": { "type": "string", "enum": ["open", "agent_replied", "suggestion_pending", "awaiting_author", "resolved_by_human"] },
          "reply": { "type": "string" },
          "duplicate_of": { "type": "string" }
        }
      }
    },
    "counts": {
      "type": "object",
      "required": ["open", "suggestions_pending", "awaiting_author"],
      "properties": {
        "open": { "type": "integer", "minimum": 0 },
        "suggestions_pending": { "type": "integer", "minimum": 0 },
        "awaiting_author": { "type": "integer", "minimum": 0 },
        "resolved_by_human": { "type": "integer", "minimum": 0 }
      }
    },
    "signoff_ready": { "type": "boolean" },
    "blocked_on": { "type": "array", "items": { "type": "string" } }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "doc_title": "Cymbal Field Service - Data Retention Policy v2 (DRAFT)",
  "author": "elena.vasquez@cymbal-sandbox.example",
  "wake_reason": "kickoff",
  "kickoff_comment": "@Gemini be my review partner until Fri 13 Nov. Need sign-off from Legal and Security.",
  "linked_sources": [
    { "title": "Records schedule 2026", "type": "sheet", "range": "Schedule!A1:F48" },
    { "title": "Service terms v4", "type": "doc", "heading": "3.2 Availability" }
  ],
  "open_threads": [
    { "thread_id": "c-101", "reviewer": "kwame.asante@cymbal-sandbox.example (Legal)", "anchor": "Section 4: Customer data is retained for 7 years", "text": "Records schedule says 6 years for service tickets. Which is right?" },
    { "thread_id": "c-102", "reviewer": "olga.petrov@cymbal-sandbox.example (Security)", "anchor": "Section 5: Backups", "text": "Need to state backups are encrypted at rest." },
    { "thread_id": "c-103", "reviewer": "raj.iyer@cymbal-sandbox.example (Product)", "anchor": "Section 5: Backups", "text": "Should mention encryption for backups." },
    { "thread_id": "c-104", "reviewer": "kwame.asante@cymbal-sandbox.example (Legal)", "anchor": "Section 6: Deletion requests", "text": "30 days is too long; we should commit to 14." },
    { "thread_id": "c-105", "reviewer": "raj.iyer@cymbal-sandbox.example (Product)", "anchor": "Section 6: Deletion requests", "text": "14 days isn't feasible for the archive tier. Keep 30." },
    { "thread_id": "c-106", "reviewer": "olga.petrov@cymbal-sandbox.example (Security)", "anchor": "Title", "text": "nit: use 'Data Retention Standard' per naming guide" }
  ],
  "author_approved_threads": ["c-101", "c-102", "c-103", "c-104", "c-105", "c-106"]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "doc_title": "Cymbal Field Service - Data Retention Policy v2 (DRAFT)",
  "wake_reason": "kickoff",
  "threads": [
    { "thread_id": "c-101", "reviewer": "kwame.asante@cymbal-sandbox.example (Legal)", "theme": "Retention period", "type": "question", "handling": "reply_with_citation", "state": "suggestion_pending", "reply": "Records schedule 2026 (Schedule!C14) lists service tickets at 6 years. Suggested edit changes 7 to 6 for service tickets only; other customer records stay at 7 per row C9." },
    { "thread_id": "c-102", "reviewer": "olga.petrov@cymbal-sandbox.example (Security)", "theme": "Backup encryption", "type": "edit_request", "handling": "suggest_edit", "state": "suggestion_pending", "reply": "Suggested edit adds: 'Backups are encrypted at rest.' Ready for review." },
    { "thread_id": "c-103", "reviewer": "raj.iyer@cymbal-sandbox.example (Product)", "theme": "Backup encryption", "type": "edit_request", "handling": "group_duplicate", "state": "agent_replied", "duplicate_of": "c-102", "reply": "Same ask as c-102; one suggestion covers both." },
    { "thread_id": "c-104", "reviewer": "kwame.asante@cymbal-sandbox.example (Legal)", "theme": "Deletion SLA", "type": "disagreement", "handling": "side_by_side_for_author", "state": "awaiting_author", "reply": "Legal proposes 14 days; Product (c-105) says the archive tier needs 30. Elena to decide; one option is 14 days for primary storage and 30 for archive." },
    { "thread_id": "c-105", "reviewer": "raj.iyer@cymbal-sandbox.example (Product)", "theme": "Deletion SLA", "type": "disagreement", "handling": "side_by_side_for_author", "state": "awaiting_author", "reply": "Summarised alongside c-104 for the author." },
    { "thread_id": "c-106", "reviewer": "olga.petrov@cymbal-sandbox.example (Security)", "theme": "Naming", "type": "nit", "handling": "suggest_edit", "state": "suggestion_pending", "reply": "Suggested edit renames title and 3 in-body references in one pass." }
  ],
  "counts": { "open": 6, "suggestions_pending": 3, "awaiting_author": 2, "resolved_by_human": 0 },
  "signoff_ready": false,
  "blocked_on": ["elena.vasquez@cymbal-sandbox.example: decide deletion SLA (c-104/c-105)"]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab 5: Run a review cycle with a Doc partner

**Time box:** 40 minutes

## Objective

Use Gemini as a review partner inside a Doc for a simulated week: it triages comment threads,
answers from linked sources, drafts minimal suggested edits and surfaces disagreements for you to
decide. You and your reviewers stay the only ones who accept, resolve or send.

## Setup

- **Seats:** pairs on Business Standard or Enterprise Standard seats in \`cymbal-sandbox.example\`.
  One partner is the author, the other plays Legal and Security reviewers.
- **Data:** "Data Retention Policy v2 (DRAFT)" Doc with six seeded comment threads, plus the
  linked "Records schedule 2026" Sheet and "Service terms v4" Doc.
- **Package:** \`google/doc-review-partner@1.3\`.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Author: add a comment on the title, "@Gemini be my review partner until Friday. Need sign-off
   from Legal and Security." Watch the live cursor as it reads the Doc.
2. Read the review board in the reply. Approve all threads except the naming nit (c-106), which
   you want to handle yourself.
3. Check c-101. Open the cited Sheet range and confirm the citation is right. Accept the suggested
   edit.
4. Reviewer partner: accept the backup encryption suggestion and resolve c-102. Confirm c-103 now
   points to it as a duplicate.
5. Read the side-by-side on the deletion SLA (c-104/c-105). Make the call yourself and reply in
   the thread. Notice the agent did not choose.
6. Reviewer partner: add a new comment on Section 7. Watch the agent wake, classify it and add it
   to the board within a minute or two.
7. Ask the facilitator to trigger the daily wrap. Read the Chat DM. When no Legal or Security
   threads remain open, open the sign-off draft in Gmail, edit it and send it yourself.

## What good looks like

- [ ] No suggestion was accepted and no thread resolved by the agent.
- [ ] Every answer cites a heading or range you could verify in under 30 seconds.
- [ ] Duplicate comments collapsed into one suggestion.
- [ ] The disagreement was decided by the author, with both positions represented fairly.
- [ ] The sign-off email went from the author's account, after the author edited it.

## Entitlement check

About $0.12 per work pass and 3 passes a week: 0.12 x 3 x 4.3 = about $1.55 a month, comfortably
inside a $2 Starter or $6 Standard entitlement.

## Facilitator notes

- Reset the Doc from version history ("Lab 5 seed") between cohorts; resolved threads do not
  come back otherwise.
- If the live cursor does not appear, the attendee is probably viewing, not editing. Confirm the
  author partner has edit rights.
- Expect debate on the deletion SLA. Remind attendees the agent is designed not to choose; the
  side-by-side is there to make the author's decision faster, not to replace it.
- Encourage reviewers to add a genuinely new comment in step 6 so the wake is visible.
- Debrief prompt: which Doc in your real Drive has more than 10 open comments right now?

## Measure it next week

- **Signal:** agentic tasks per user per week started from a Docs comment @mention. Target: at
  least one review cycle per author per week in teams that write policies or PRDs.
- **Outcome:** median days from "out for review" to sign-off on Docs that used the partner versus
  those that did not.
- **Watch for:** a low acceptance rate on suggested edits (under 40%); usually the style guide
  parameter is unset, so link it.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.3 - 2026-10-22
- Duplicate grouping: one canonical thread and one suggestion for repeated feedback.
- Style-guide violations flagged once per pattern instead of per instance.

## 1.2 - 2026-09-17
- Disagreements produce a neutral side-by-side for the author instead of a suggested compromise.

## 1.1 - 2026-08-13
- Replies cite the linked source heading or Sheet range.
- Never resolves threads; replies "Suggested edit ready for review" instead.

## 1.0 - 2026-07-09
- First release: comment @mention kick-off, review board, suggestions-only edits, daily wrap.
`,
    },
  ],
  'uc-rfp': [
    {
      path: 'SKILL.md',
      content: `---
name: rfp-response-builder
namespace: northlight
version: "0.9"
description: Use when an RFP or security questionnaire arrives by email and a bid lead needs a first-draft response Doc assembled from past answers, routed to subject-matter experts and tracked to the submission date.
license: Apache-2.0
surfaces: [Gmail, Drive, Docs, Sheets, Chat]
runtime: long-running
approval: Every email to SMEs or the issuer, the SME assignment plan, and marking the response final; the agent never submits.
entitlement_cost_per_run_usd: 0.65
typical_runs_per_user_per_week: 1
outputs: schema/output.json
---

# RFP Response Builder

Maintained by Northlight Partners. Built on the Gemini agent included in Workspace; no extra
licences are required.

## When to use

- A bid lead receives an RFP, RFI or vendor security questionnaire as an email attachment or
  Drive link, with a submission date one to three weeks out.
- The team has an answer library: past responses in a shared drive and/or a "Q&A library" Sheet.
- Questions span product, security, legal, pricing and references, so several SMEs must contribute.
- Not for public-sector bids with sealed-envelope rules that forbid drafting tools; check the
  issuer's terms first.
- Signs it is working: a complete first draft exists on the day the RFP arrives, and SMEs spend
  their time on gaps rather than on copying old answers.

## How it runs

1. **Day 0: intake.** From the RFP email, reads the attachment, extracts every question with its
   section number, word limit and mandatory flag into a "Compliance matrix" Sheet. Reads the
   submission date, clarification deadline and format rules.
2. **Day 0: first draft.** Searches the answer library and past responses in the shared drive for
   each question. Writes a response Doc in the RFP's section order. Each answer is tagged
   \`reused\`, \`adapted\` or \`gap\`, with the source file linked in a comment.
3. **Checkpoint 1: assignment plan.** Proposes an SME for each \`adapted\` or \`gap\` answer based on
   who authored the source and the Directory. The bid lead edits and approves the plan.
4. **Day 1: routing.** Assigns each section to its SME with a Doc comment assignment and posts
   one summary in the bid's Chat space. Drafts a kick-off email to the SMEs; the lead sends it.
5. **Daily, 09:30: progress.** Reads Doc changes, comment replies and assignment completion.
   Updates the matrix status. Drafts reminders for sections due within 48 hours.
6. **Wake: clarification window.** Two days before the clarification deadline, drafts a list of
   questions to the issuer for ambiguous requirements. The lead edits and sends.
7. **Checkpoint 2: final readiness.** At T-2 days, runs a compliance pass (every mandatory
   question answered, word limits met, no placeholder text) and reports blockers. The lead marks
   the Doc final and submits through the issuer's portal; the agent does not submit.

## Instructions

1. Extract questions verbatim. Never paraphrase a requirement in the compliance matrix.
2. Reuse library answers only when the source is less than \`max_source_age_months\` old; older
   matches are \`adapted\` and need an SME check.
3. Never invent capabilities, certifications, customer references or prices. If the library has
   no supported answer, mark \`gap\` and leave a bracketed note for the SME.
4. Respect word limits; if a reused answer is too long, shorten it and tag it \`adapted\`.
5. Every answer links its source in a comment so reviewers can verify it.
6. Pricing and legal sections are always \`gap\` until a named owner from Finance or Legal has
   replied in the thread, regardless of library matches.
7. Assignments go only to people inside the domain. External partners are listed for the lead.
8. Draft every email (SME kick-off, reminders, issuer clarifications) for the lead to send.
9. Do not edit sections after an SME marks them done; leave comments instead.
10. Keep the compliance matrix as the single source of status; update it on every wake.
11. Emit JSON matching \`schema/output.json\` after each wake.

## Approvals & guardrails

- **Email:** SME kick-off, reminders and issuer questions are drafts in the lead's Drafts.
- **Assignments:** the plan is approved before any comment assignment is created.
- **Final:** only the lead marks final and submits. The agent has no access to the issuer portal.
- **Content:** no fabricated claims; pricing and legal always need a human owner.
- **Cost:** a full intake-and-draft run is about $0.65; daily progress checks are small and are
  included in that average across a typical two-week bid (one bid per lead per week at peak).

## Examples

\`\`\`json
{
  "input": { "question": "4.3 Describe your data residency options (max 200 words). Mandatory." },
  "output": { "section": "4.3", "status": "adapted", "words": 184,
              "source": "Response - Kestrel Logistics RFP 2025, section 6.1",
              "sme": "data-platform lead" }
}
\`\`\`

## Parameters

\`\`\`yaml
answer_library_sheet: "Q&A library"
past_responses_folder: "Bids/Responses"
max_source_age_months: 12
reminder_hours_before_due: 48
progress_check_time_local: "09:30"
final_readiness_days_before: 2
always_gap_sections: [pricing, legal, commercial_terms]
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "RFP Response Builder run",
  "type": "object",
  "required": ["rfp_title", "issuer", "submission_due", "phase", "questions", "readiness"],
  "properties": {
    "rfp_title": { "type": "string" },
    "issuer": { "type": "string" },
    "submission_due": { "type": "string", "format": "date-time" },
    "clarification_due": { "type": "string", "format": "date-time" },
    "phase": { "type": "string", "enum": ["intake", "drafting", "routing", "in_progress", "clarifications", "final_readiness", "handed_to_lead"] },
    "questions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["section", "question", "mandatory", "status"],
        "properties": {
          "section": { "type": "string" },
          "question": { "type": "string" },
          "mandatory": { "type": "boolean" },
          "word_limit": { "type": "integer", "minimum": 0 },
          "status": { "type": "string", "enum": ["reused", "adapted", "gap", "sme_in_progress", "sme_done"] },
          "source": { "type": "string" },
          "proposed_sme": { "type": "string" },
          "note": { "type": "string" }
        }
      }
    },
    "readiness": {
      "type": "object",
      "required": ["answered", "total", "blockers"],
      "properties": {
        "answered": { "type": "integer", "minimum": 0 },
        "total": { "type": "integer", "minimum": 0 },
        "blockers": { "type": "array", "items": { "type": "string" } }
      }
    },
    "drafts_for_lead": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "to"],
        "properties": {
          "kind": { "type": "string", "enum": ["sme_kickoff", "sme_reminder", "issuer_clarification"] },
          "to": { "type": "array", "items": { "type": "string" } }
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
  "bid_lead": "marcus.reid@cymbal-sandbox.example",
  "rfp_email": {
    "from": "procurement@brightwater-utilities.example",
    "subject": "RFP BW-2026-114: Field workforce scheduling platform",
    "received_at": "2026-11-09T14:02:00Z",
    "attachment": "BW-2026-114 Requirements.pdf"
  },
  "rfp_outline": {
    "submission_due": "2026-11-24T17:00:00Z",
    "clarification_due": "2026-11-13T17:00:00Z",
    "format": "Single PDF, answers in section order, Arial 11",
    "sections": [
      { "section": "2.1", "question": "Provide a company overview including years in operation and headcount.", "mandatory": true, "word_limit": 250 },
      { "section": "3.4", "question": "Describe how the platform optimises technician routes across multiple depots.", "mandatory": true, "word_limit": 400 },
      { "section": "4.3", "question": "Describe your data residency options.", "mandatory": true, "word_limit": 200 },
      { "section": "4.7", "question": "Confirm current ISO/IEC 27001 certification and attach the certificate.", "mandatory": true },
      { "section": "5.2", "question": "Provide three references from utilities with 500+ field staff.", "mandatory": true },
      { "section": "7.1", "question": "Provide a five-year total cost including implementation.", "mandatory": true }
    ]
  },
  "library_matches": [
    { "section": "2.1", "source": "Q&A library row 3 - Company overview (updated 2026-09)", "words": 210 },
    { "section": "3.4", "source": "Response - Kestrel Logistics RFP 2025, section 5.2", "words": 520, "author": "anika.shah@cymbal-sandbox.example", "age_months": 14 },
    { "section": "4.3", "source": "Q&A library row 41 - Data residency (updated 2026-06)", "words": 184, "author": "felix.grant@cymbal-sandbox.example" },
    { "section": "4.7", "source": "Q&A library row 52 - ISO 27001 (updated 2026-03)", "words": 60, "author": "olga.petrov@cymbal-sandbox.example" }
  ]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "rfp_title": "BW-2026-114: Field workforce scheduling platform",
  "issuer": "Brightwater Utilities",
  "submission_due": "2026-11-24T17:00:00Z",
  "clarification_due": "2026-11-13T17:00:00Z",
  "phase": "routing",
  "questions": [
    { "section": "2.1", "question": "Provide a company overview including years in operation and headcount.", "mandatory": true, "word_limit": 250, "status": "reused", "source": "Q&A library row 3 - Company overview (updated 2026-09)" },
    { "section": "3.4", "question": "Describe how the platform optimises technician routes across multiple depots.", "mandatory": true, "word_limit": 400, "status": "adapted", "source": "Response - Kestrel Logistics RFP 2025, section 5.2", "proposed_sme": "anika.shah@cymbal-sandbox.example", "note": "Source is 14 months old and 520 words; shortened to 395, needs SME check on multi-depot features." },
    { "section": "4.3", "question": "Describe your data residency options.", "mandatory": true, "word_limit": 200, "status": "reused", "source": "Q&A library row 41 - Data residency (updated 2026-06)" },
    { "section": "4.7", "question": "Confirm current ISO/IEC 27001 certification and attach the certificate.", "mandatory": true, "status": "adapted", "source": "Q&A library row 52 - ISO 27001 (updated 2026-03)", "proposed_sme": "olga.petrov@cymbal-sandbox.example", "note": "Confirm certificate is current and attach the PDF; agent did not locate the certificate file." },
    { "section": "5.2", "question": "Provide three references from utilities with 500+ field staff.", "mandatory": true, "status": "gap", "proposed_sme": "marcus.reid@cymbal-sandbox.example", "note": "No approved utility references in the library. Do not invent; needs customer marketing." },
    { "section": "7.1", "question": "Provide a five-year total cost including implementation.", "mandatory": true, "status": "gap", "proposed_sme": "finance owner (to be named by lead)", "note": "Pricing is always a gap until Finance replies." }
  ],
  "readiness": {
    "answered": 2,
    "total": 6,
    "blockers": [
      "5.2 references: no library source",
      "7.1 pricing: needs a named Finance owner",
      "4.7 certificate file not found in Drive"
    ]
  },
  "drafts_for_lead": [
    { "kind": "sme_kickoff", "to": ["anika.shah@cymbal-sandbox.example", "olga.petrov@cymbal-sandbox.example"] },
    { "kind": "issuer_clarification", "to": ["procurement@brightwater-utilities.example"] }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab 6: Build an RFP response in a day, not a week

**Time box:** 50 minutes

## Objective

Let Gemini do the heavy first pass on an RFP: build the compliance matrix, assemble a sourced first
draft from your answer library, route gaps to SMEs and keep status current until submission. You
approve the plan, send every email and own the final submission.

## Setup

- **Seats:** teams of three on Business Standard or Enterprise Standard seats in
  \`cymbal-sandbox.example\`: a bid lead and two SMEs.
- **Data:** the email "RFP BW-2026-114" with a 6-question requirements PDF, a "Q&A library" Sheet
  with 60 rows, and a "Bids/Responses" shared drive folder with four past responses.
- **Package:** \`northlight/rfp-response-builder@0.9\` (partner-maintained, Northlight Partners).
- A "Bid - Brightwater" Chat space with the three team members.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Bid lead: open the RFP email in Gmail. In the side panel, run "Build an RFP response for this,
   due 24 Nov." Watch the compliance matrix Sheet fill in.
2. Open the response Doc. Check the source comments on 2.1 and 4.3 (\`reused\`). Click through to
   confirm each source.
3. Look at 5.2 and 7.1. Confirm both are \`gap\` with notes, and that no references or prices were
   invented.
4. Review the assignment plan. Change the 7.1 owner to a named person, then approve the plan.
   Confirm comment assignments land on the SMEs and a summary appears in the Chat space.
5. Open Drafts and send the SME kick-off after one edit of your own.
6. SMEs: update your sections in the Doc and mark the assignment done. Facilitator triggers the
   09:30 progress wake; confirm the matrix status updated.
7. Facilitator triggers the clarification wake. Review the issuer questions draft; delete one
   question you can answer yourself and send the rest.
8. Facilitator jumps to T-2. Read the readiness report and fix one blocker.

## What good looks like

- [ ] Matrix lists every question verbatim with mandatory flags and word limits.
- [ ] Every drafted answer has a source link; gaps say so plainly.
- [ ] Pricing and references were never filled in by the agent.
- [ ] All emails went from the lead's account after review.
- [ ] Readiness report catches at least one word-limit or placeholder issue.

## Entitlement check

About $0.65 per bid run, one bid per lead per week at peak: 0.65 x 1 x 4.3 = about $2.80 a month.
Fits a $6 Standard seat; on a $2 Starter seat plan for one bid every other week.

## Facilitator notes

- The requirements PDF is intentionally inconsistent on word limits in two places; strong teams
  catch it at the readiness pass.
- If 5.2 or 7.1 comes back filled in, stop the room: it means the library was edited. Restore the
  "Q&A library" Sheet from version history and re-run intake.
- SMEs should edit only their assigned sections; the agent leaves comments, not edits, on
  sections marked done.
- Mention that this is a partner package maintained by Northlight Partners and runs on the agent
  already included with Workspace seats.
- Debrief prompt: what is the oldest answer in your team's library that still gets reused?

## Measure it next week

- **Signal:** agentic tasks per user per week for bid leads, and the number of active compliance
  matrices created by the skill.
- **Outcome:** hours from RFP receipt to complete first draft (baseline 3-5 days; target same day)
  and the share of answers marked \`reused\` that SMEs left unchanged.
- **Watch for:** gaps that never get an owner; set \`always_gap_sections\` owners at kick-off.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 0.9 - 2026-10-27
- Clarification-window wake drafts issuer questions two days before the deadline.
- Final readiness pass checks word limits, placeholders and mandatory coverage.

## 0.8 - 2026-10-06
- Pricing, legal and commercial terms are always \`gap\` until a named owner replies.
- Sources older than \`max_source_age_months\` are tagged \`adapted\`.

## 0.7 - 2026-09-08
- Assignment plan checkpoint before any Doc comment assignment is created.

## 0.6 - 2026-08-11
- Compliance matrix Sheet becomes the single source of status.

## 0.5 - 2026-07-14
- First partner preview: intake and first draft from the answer library.
`,
    },
  ],
  'uc-escalation': [
    {
      path: 'SKILL.md',
      content: `---
name: customer-escalation-tracker
namespace: northlight
version: "1.0"
description: Use when an account owner is handling a customer escalation that spans email, an internal Chat swarm space and a timeline Doc, and needs it tracked to resolution with regular customer updates.
license: Apache-2.0
surfaces: [Gmail, Chat, Docs, Calendar, Sheets]
runtime: long-running
approval: Every customer-facing email, every calendar invitation, and severity changes; internal Chat posts in the swarm space are approved per post.
entitlement_cost_per_run_usd: 0.09
typical_runs_per_user_per_week: 5
outputs: schema/output.json
---

# Customer Escalation Tracker

Maintained by Northlight Partners. Runs on the Gemini agent included with Workspace.

## When to use

- A customer has escalated (outage impact, missed delivery, billing dispute) and the account owner
  must coordinate support, engineering and leadership while keeping the customer informed.
- The escalation lasts days to weeks, so the timeline and the promised update cadence drift.
- An internal Chat "swarm" space exists or will be created by the user for the escalation.
- Not a replacement for the support ticketing system; the tracker reads ticket notification emails
  but does not write to the ticketing tool.
- Signs it is working: the customer gets an update at the promised time every day, and anyone
  in the swarm can answer "what did we promise?" in one question.

## How it runs

1. **Open.** The account owner says in Gmail: "Track this as an escalation, Sev 2, daily updates."
   The agent creates a timeline Doc from a template and adds the customer thread, ticket emails
   and swarm space link. It proposes the update cadence and the next update time.
2. **Wake: any new signal.** Customer replies, ticket notification emails, and swarm-space
   messages tagged \`#esc\` wake the agent. Each signal becomes a timestamped timeline entry with
   a source link.
3. **Update cadence (default daily 16:00 customer time).** Drafts the customer update from the
   timeline: what happened since last update, current status, next step and next update time.
   The account owner edits and sends.
4. **Swarm triage.** When @mentioned in the swarm space, answers "what did we promise and when"
   from the timeline, and drafts a summary post for the space after major changes (owner approves).
5. **Checkpoint: severity and leadership.** If the customer mentions contract terms, a deadline
   passes, or there is no engineering update in 24 hours, the agent proposes a severity change
   and a leadership heads-up draft. Both need approval.
6. **Meeting support.** Proposes a customer call slot when the customer asks for one; books it
   only after approval and attaches the timeline summary as a pre-read.
7. **Close.** When the customer confirms resolution, drafts the closure email and a post-incident
   summary in the timeline Doc, and logs the escalation in the "Escalations log" Sheet.

## Instructions

1. The timeline Doc is the record. Every entry has a UTC timestamp, a source link and one line.
2. Never state a root cause, fix date or credit to the customer unless engineering or finance has
   stated it in the swarm space or ticket; quote the source in the timeline entry.
3. Customer updates follow the cadence. If nothing changed, still draft an update that says so and
   gives the next update time. A missed cadence is worse than a short update.
4. Drafts are written in the account owner's voice, plain and specific, without blame, and under
   \`max_update_words\`.
5. Never send email, never book meetings, and never post in the swarm space without approval of
   that specific item.
6. Track every promise made to the customer (dates, follow-ups) as a "commitment" with owner and
   due time, and flag commitments due in the next 4 hours.
7. Propose severity changes with the trigger that caused them; do not change severity yourself.
8. Never copy internal swarm discussion into customer-facing drafts.
9. On close, write the log row with open date, close date, severity history and commitments met
   versus missed.
10. Emit JSON matching \`schema/output.json\` after each wake.

## Approvals & guardrails

- **Customer email:** drafts only; the account owner sends.
- **Calendar:** customer calls proposed, booked only after approval.
- **Swarm space:** summary posts approved one by one; answers to @mentions are allowed.
- **Severity:** proposed, never changed by the agent.
- **Separation:** internal discussion never appears in customer drafts.
- **Cost:** about $0.09 per working wake (timeline update plus a draft); roughly one per business
  day during an active escalation.

## Examples

\`\`\`json
{
  "input": { "signal": "Ticket #48213 status changed to 'Fix deployed to staging'",
             "cadence_due": "2026-11-11T16:00:00-05:00" },
  "output": { "timeline_entry": "Fix deployed to staging (ticket #48213).",
              "customer_update_draft": "ready", "commitments_due_soon": 1 }
}
\`\`\`

## Parameters

\`\`\`yaml
default_cadence: daily
update_time_customer_local: "16:00"
max_update_words: 180
no_engineering_update_hours: 24
commitment_warning_hours: 4
timeline_template: "Escalation timeline template"
escalations_log_sheet: "Escalations log"
swarm_hashtag: "#esc"
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Customer Escalation Tracker run",
  "type": "object",
  "required": ["escalation_id", "customer", "severity", "state", "timeline_added", "commitments", "pending_approvals"],
  "properties": {
    "escalation_id": { "type": "string" },
    "customer": { "type": "string" },
    "severity": { "type": "string", "enum": ["sev1", "sev2", "sev3"] },
    "state": { "type": "string", "enum": ["open", "investigating", "fix_in_progress", "monitoring", "resolved", "closed"] },
    "timeline_added": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["at", "entry", "source"],
        "properties": {
          "at": { "type": "string", "format": "date-time" },
          "entry": { "type": "string" },
          "source": { "type": "string" }
        }
      }
    },
    "commitments": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["commitment", "owner", "due", "status"],
        "properties": {
          "commitment": { "type": "string" },
          "owner": { "type": "string" },
          "due": { "type": "string", "format": "date-time" },
          "status": { "type": "string", "enum": ["open", "due_soon", "met", "missed"] }
        }
      }
    },
    "pending_approvals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "summary"],
        "properties": {
          "kind": { "type": "string", "enum": ["customer_update", "swarm_post", "severity_change", "leadership_heads_up", "book_call", "closure_email"] },
          "summary": { "type": "string" }
        }
      }
    },
    "next_customer_update": { "type": "string", "format": "date-time" }
  }
}
`,
    },
    {
      path: 'examples/sample-input.json',
      content: `{
  "account_owner": "tess.morgan@cymbal-sandbox.example",
  "escalation_id": "ESC-2026-0417",
  "customer": "Pinecrest Freight",
  "customer_timezone": "America/New_York",
  "severity": "sev2",
  "cadence": "daily 16:00 customer time",
  "signals_since_last_run": [
    {
      "type": "ticket_email",
      "at": "2026-11-11T14:10:00Z",
      "text": "Ticket #48213 status changed to 'Fix deployed to staging'. Engineer note: retry logic for manifest sync corrected; verifying with replayed traffic."
    },
    {
      "type": "swarm_message",
      "at": "2026-11-11T15:02:00Z",
      "from": "devon.price@cymbal-sandbox.example",
      "text": "#esc staging looks clean after 2h replay. Planning prod rollout tomorrow 10:00 ET if overnight soak passes."
    },
    {
      "type": "customer_email",
      "at": "2026-11-11T15:40:00Z",
      "from": "alicia.ford@pinecrest-freight.example",
      "text": "Thanks for the updates. Our VP ops wants a 20-minute call tomorrow to understand the rollout. Also, will this affect our December invoice?"
    }
  ],
  "open_commitments": [
    { "commitment": "Share staging test results with Pinecrest", "owner": "tess.morgan@cymbal-sandbox.example", "due": "2026-11-11T21:00:00Z" }
  ],
  "owner_free_slots_tomorrow_et": ["11:30", "13:00", "15:30"]
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "escalation_id": "ESC-2026-0417",
  "customer": "Pinecrest Freight",
  "severity": "sev2",
  "state": "fix_in_progress",
  "timeline_added": [
    { "at": "2026-11-11T14:10:00Z", "entry": "Fix deployed to staging; manifest sync retry logic corrected.", "source": "Ticket #48213 notification" },
    { "at": "2026-11-11T15:02:00Z", "entry": "Staging clean after 2h replay; prod rollout planned 2026-11-12 10:00 ET pending overnight soak.", "source": "Swarm space message from Devon Price" },
    { "at": "2026-11-11T15:40:00Z", "entry": "Customer requested 20-min call with VP ops tomorrow; asked about December invoice impact.", "source": "Email from Alicia Ford" }
  ],
  "commitments": [
    { "commitment": "Share staging test results with Pinecrest", "owner": "tess.morgan@cymbal-sandbox.example", "due": "2026-11-11T21:00:00Z", "status": "due_soon" },
    { "commitment": "Answer December invoice question", "owner": "tess.morgan@cymbal-sandbox.example", "due": "2026-11-12T21:00:00Z", "status": "open" }
  ],
  "pending_approvals": [
    { "kind": "customer_update", "summary": "Daily update for Alicia: fix verified in staging, prod rollout planned tomorrow 10:00 ET if overnight checks pass, staging results attached, next update tomorrow 16:00 ET. Invoice question acknowledged; answer to follow once Finance confirms." },
    { "kind": "book_call", "summary": "20-min call with Pinecrest VP ops, proposed 2026-11-12 11:30 ET (after planned rollout). Pre-read: timeline summary." },
    { "kind": "swarm_post", "summary": "Ask Finance in the swarm space whether a service credit applies to the December invoice." }
  ],
  "next_customer_update": "2026-11-11T21:00:00Z"
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab 7: Keep a customer escalation on cadence

**Time box:** 45 minutes

## Objective

Run a week-long customer escalation in compressed time with Gemini keeping the timeline, the
promises and the update cadence. You approve every customer email, every call and every swarm post.

## Setup

- **Seats:** groups of three on Business Standard or Enterprise Standard seats in
  \`cymbal-sandbox.example\`: account owner, engineer and support lead.
- **Data:** the "Pinecrest Freight - manifest sync failures" email thread, seeded ticket
  notification emails, and an "ESC-2026-0417 swarm" Chat space. The facilitator controls the
  customer mailbox \`alicia.ford@pinecrest-freight.example\`.
- **Package:** \`northlight/customer-escalation-tracker@1.0\` (partner-maintained).
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Account owner: open the customer thread and tell Gemini in the side panel "Track this as an
   escalation, Sev 2, daily updates at 16:00 Eastern." Open the timeline Doc it creates.
2. Engineer: post in the swarm space "#esc fix in staging, soak overnight." Confirm the timeline
   gets a new entry with a source link.
3. Facilitator sends the customer email asking for a call and about the December invoice.
   Account owner: review the three pending approvals.
4. Edit the customer update draft. Check it says nothing about credits or root cause that
   engineering or finance has not stated. Send it.
5. Approve the proposed call slot. Confirm the invite exists only after approval and carries the
   timeline summary as a pre-read.
6. Support lead: @mention Gemini in the swarm space, "what have we promised Pinecrest and when?"
   Confirm the answer lists both commitments with due times.
7. Facilitator advances 26 hours with no engineering update. Review the proposed severity change
   and leadership heads-up. Decline the severity change, send the heads-up.
8. Facilitator sends the customer's resolution confirmation. Approve the closure email and check
   the new row in the "Escalations log" Sheet.

## What good looks like

- [ ] Every timeline entry has a timestamp and a source.
- [ ] No customer draft contains internal swarm discussion or unconfirmed claims.
- [ ] The cadence held: one update per day, even when nothing changed.
- [ ] Severity changed only when a human chose to change it.
- [ ] The log row shows commitments met versus missed.

## Entitlement check

About $0.09 per working wake, 5 a week during an active escalation: 0.09 x 5 x 4.3 = about $1.94
a month. Fits a $2 Starter seat for one active escalation at a time.

## Facilitator notes

- Use the facilitator console to inject the ticket emails at the times in the script; the order
  matters for the commitment warning in step 3.
- If a customer draft mentions a credit, check the swarm space: someone in the group probably
  posted one. That is the guardrail working as designed, not a bug.
- Account owners sometimes ask for automatic sending at the cadence. Explain that a missed cadence
  is handled by a ready draft and a reminder, not by sending without approval.
- Keep the support lead busy in step 6; the @mention answer is quick to verify.
- Debrief prompt: what did you last promise a customer that nobody wrote down?

## Measure it next week

- **Signal:** agentic tasks per user per week for account owners with an open escalation (target:
  one per business day), and cadence adherence from the timeline Doc.
- **Outcome:** share of customer commitments met on time, from the "Escalations log" Sheet.
- **Watch for:** owners who edit every draft heavily; review the \`max_update_words\` setting and
  their sent-mail voice sample together.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 1.0 - 2026-10-20
- General availability. Commitments tracking with due-soon warnings.
- Severity changes and leadership heads-ups are proposals that need approval.
- Escalations log row written on close.

## 0.9 - 2026-09-22
- Swarm space @mention answers from the timeline; summary posts need per-post approval.
- Guardrail: internal discussion is never copied into customer drafts.

## 0.8 - 2026-08-25
- Partner preview: timeline Doc, daily customer update drafts.
`,
    },
  ],
  'uc-monthend': [
    {
      path: 'SKILL.md',
      content: `---
name: month-end-close-chaser
namespace: meridian
version: "0.8"
description: Use when a controller or finance lead runs the month-end close from a checklist Sheet and needs owners chased for reconciliations, accrual inputs and sign-offs across the close window.
license: Apache-2.0
surfaces: [Sheets, Gmail, Chat, Calendar, Drive]
runtime: long-running
approval: Every email to task owners or other departments, every Chat DM, and any calendar hold; checklist status changes made by the agent are suggestions until the controller accepts them.
entitlement_cost_per_run_usd: 0.38
typical_runs_per_user_per_week: 1.2
outputs: schema/output.json
---

# Month-end Close Chaser

Maintained by Meridian Advisory. Uses only the Gemini agent included with Workspace.

## When to use

- The close is run from a checklist Sheet: one row per task with owner, workday due (WD-5 to WD+5),
  evidence link and status.
- The controller spends the close window chasing: "is the bank rec done?", "where are the
  accrual inputs from Ops?", "who still needs to sign off the flux analysis?"
- Evidence (reconciliations, support files) lives in a Drive folder per period.
- Not for posting journal entries or touching the ledger. The chaser reads and reminds; it never
  books anything in the finance system.
- Signs it is working: the controller stops writing individual chase emails, and fewer rows
  are late at the WD+3 review than in the previous close.

## How it runs

1. **WD-5: plan.** Reads the checklist Sheet and the period's Drive folder. Computes calendar dates
   for each workday-relative due date, skipping weekends and the regional holiday calendar.
   Proposes a close calendar hold for the review meeting on WD+3 (controller approves).
2. **WD-4: requests.** Drafts input requests to owners outside Finance (Ops accruals, HR payroll
   changes, Sales commissions) using last month's email as a template. The controller approves
   them as a batch; the agent never sends them itself.
3. **Daily 08:30 during the window: sweep.** Checks each row: is there an evidence file in the
   folder modified this period, did the owner reply, did the owner update the row? Proposes
   status changes as cell comments and suggestions, not direct edits.
4. **Wake: evidence lands.** A new file in the period folder or a reply on a request thread wakes
   the agent to match it to a row and propose "ready for review".
5. **Checkpoint: daily close stand-up note.** Posts a draft to the controller by Chat DM: done,
   at risk (due today or tomorrow without evidence), late. The controller forwards or edits it to
   the close Chat space.
6. **Escalation path.** Rows late by \`escalate_after_days\` get a drafted note to the owner's
   manager, CC the controller, for approval.
7. **WD+5: wrap.** Builds a close summary (on-time rate by team, late items, recurring blockers)
   in a Doc and proposes checklist template changes for next month.

## Instructions

1. Treat the checklist Sheet as the source of truth for tasks and owners. Do not add or remove
   rows; propose additions in a comment.
2. Convert WD-relative due dates using the configured holiday calendar; show both the WD label and
   the calendar date in every message.
3. A row is "evidence present" only if a file in the period folder matches the row's evidence
   pattern and was modified on or after the day the close window opened (WD-5).
4. Propose status changes as comments with the evidence link. Never overwrite a status the
   controller or owner set by hand.
5. Draft every email and DM for approval. Batch requests by recipient so each owner gets one
   message listing all of their items.
6. Never request, quote or attach payroll detail or bank account numbers in messages; link the
   restricted folder instead and let access controls do the rest.
7. Never chase the same owner more than once per business day.
8. Escalate to a manager only after \`escalate_after_days\` late, and only with controller approval.
9. Do not open files outside the period folder and the checklist Sheet.
10. Emit JSON matching \`schema/output.json\` after each sweep or wake.

## Approvals & guardrails

- **Email and Chat:** every request, reminder and escalation is a draft until approved.
- **Sheet:** status changes are proposed as comments or suggestions; the controller accepts.
- **Calendar:** review holds are proposed and booked only after approval.
- **Finance systems:** no access; the agent never posts entries or approves anything.
- **Sensitive data:** link restricted files; never paste their contents into messages.
- **Cost:** about $0.38 per close-window sweep that drafts reminders. About 5 working sweeps per
  monthly close averages 1.2 runs per week.

## Examples

\`\`\`json
{
  "input": { "row": "Bank reconciliation - operating account", "due": "WD+1",
             "owner": "Jae Kim", "evidence_found": false, "today": "WD+1" },
  "output": { "status_proposal": "at_risk", "reminder_draft": "ready_for_approval",
              "message_preview": "Hi Jae, the operating account bank rec is due today (WD+1, 1 Dec)..." }
}
\`\`\`

## Parameters

\`\`\`yaml
sweep_time_local: "08:30"
holiday_calendar: "en.usa#holiday"
escalate_after_days: 2
max_reminders_per_owner_per_day: 1
period_folder_pattern: "Close/{YYYY}-{MM}"
review_meeting_workday: "WD+3"
batch_requests_by_owner: true
\`\`\`
`,
    },
    {
      path: 'schema/output.json',
      content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Month-end Close Chaser run",
  "type": "object",
  "required": ["period", "workday", "run_type", "tasks", "summary", "drafts_for_approval"],
  "properties": {
    "period": { "type": "string", "pattern": "^[0-9]{4}-[0-9]{2}$" },
    "workday": { "type": "string" },
    "run_type": { "type": "string", "enum": ["plan", "requests", "daily_sweep", "evidence_wake", "wrap"] },
    "tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["row", "task", "owner", "due_workday", "proposed_status"],
        "properties": {
          "row": { "type": "integer", "minimum": 2 },
          "task": { "type": "string" },
          "owner": { "type": "string" },
          "due_workday": { "type": "string" },
          "due_date": { "type": "string", "format": "date" },
          "evidence": { "type": "string" },
          "proposed_status": { "type": "string", "enum": ["not_started", "in_progress", "ready_for_review", "at_risk", "late", "done"] },
          "reason": { "type": "string" }
        }
      }
    },
    "summary": {
      "type": "object",
      "required": ["total", "done", "at_risk", "late"],
      "properties": {
        "total": { "type": "integer", "minimum": 0 },
        "done": { "type": "integer", "minimum": 0 },
        "at_risk": { "type": "integer", "minimum": 0 },
        "late": { "type": "integer", "minimum": 0 },
        "standup_note": { "type": "string" }
      }
    },
    "drafts_for_approval": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["kind", "to", "rows"],
        "properties": {
          "kind": { "type": "string", "enum": ["input_request", "reminder", "manager_escalation", "calendar_hold"] },
          "to": { "type": "string" },
          "rows": { "type": "array", "items": { "type": "integer" } }
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
  "controller": "nadia.rahman@cymbal-sandbox.example",
  "period": "2026-11",
  "today": "2026-12-01",
  "workday": "WD+1",
  "run_type": "daily_sweep",
  "holiday_calendar": "en.usa#holiday",
  "checklist": [
    { "row": 4, "task": "Bank reconciliation - operating account", "owner": "jae.kim@cymbal-sandbox.example", "due_workday": "WD+1", "evidence_pattern": "BankRec_Operating_*", "status": "in_progress" },
    { "row": 5, "task": "Bank reconciliation - payroll account", "owner": "jae.kim@cymbal-sandbox.example", "due_workday": "WD+2", "evidence_pattern": "BankRec_Payroll_*", "status": "not_started" },
    { "row": 9, "task": "Ops accrual inputs (freight, utilities)", "owner": "luis.ortega@cymbal-sandbox.example", "due_workday": "WD-2", "evidence_pattern": "Accruals_Ops_*", "status": "not_started" },
    { "row": 12, "task": "Prepaid amortisation schedule", "owner": "chloe.dubois@cymbal-sandbox.example", "due_workday": "WD+1", "evidence_pattern": "Prepaids_*", "status": "in_progress" },
    { "row": 14, "task": "Payroll changes and bonus accrual inputs", "owner": "priti.desai@cymbal-sandbox.example", "due_workday": "WD-1", "evidence_pattern": "Restricted/Payroll_Changes_*", "status": "in_progress" },
    { "row": 17, "task": "Revenue flux analysis sign-off", "owner": "nadia.rahman@cymbal-sandbox.example", "due_workday": "WD+3", "evidence_pattern": "Flux_Revenue_*", "status": "not_started" }
  ],
  "period_folder_files": [
    { "name": "Prepaids_2026-11_v2.xlsx", "modified": "2026-11-30T18:22:00Z" },
    { "name": "Restricted/Payroll_Changes_2026-11.xlsx", "modified": "2026-11-30T20:05:00Z" },
    { "name": "BankRec_Operating_2026-10.xlsx", "modified": "2026-11-03T15:10:00Z" }
  ],
  "request_thread_replies": [
    { "from": "luis.ortega@cymbal-sandbox.example", "at": "2026-11-30T22:40:00Z", "text": "Freight accrual is ready, still waiting on the utilities estimate from facilities." }
  ],
  "owner_managers": { "luis.ortega@cymbal-sandbox.example": "maya.chen@cymbal-sandbox.example" }
}
`,
    },
    {
      path: 'examples/sample-output.json',
      content: `{
  "period": "2026-11",
  "workday": "WD+1",
  "run_type": "daily_sweep",
  "tasks": [
    { "row": 4, "task": "Bank reconciliation - operating account", "owner": "jae.kim@cymbal-sandbox.example", "due_workday": "WD+1", "due_date": "2026-12-01", "proposed_status": "at_risk", "reason": "Due today; only last period's file (2026-10) found in the folder." },
    { "row": 5, "task": "Bank reconciliation - payroll account", "owner": "jae.kim@cymbal-sandbox.example", "due_workday": "WD+2", "due_date": "2026-12-02", "proposed_status": "not_started", "reason": "Due tomorrow; no evidence yet." },
    { "row": 9, "task": "Ops accrual inputs (freight, utilities)", "owner": "luis.ortega@cymbal-sandbox.example", "due_workday": "WD-2", "due_date": "2026-11-27", "proposed_status": "late", "reason": "2 workdays late. Freight ready per Luis's reply; utilities estimate outstanding." },
    { "row": 12, "task": "Prepaid amortisation schedule", "owner": "chloe.dubois@cymbal-sandbox.example", "due_workday": "WD+1", "due_date": "2026-12-01", "evidence": "Prepaids_2026-11_v2.xlsx", "proposed_status": "ready_for_review", "reason": "Evidence file modified inside the close window (30 Nov)." },
    { "row": 14, "task": "Payroll changes and bonus accrual inputs", "owner": "priti.desai@cymbal-sandbox.example", "due_workday": "WD-1", "due_date": "2026-11-30", "evidence": "Restricted/Payroll_Changes_2026-11.xlsx (linked, contents not read into messages)", "proposed_status": "ready_for_review", "reason": "File landed in the restricted subfolder on 30 Nov; link only." },
    { "row": 17, "task": "Revenue flux analysis sign-off", "owner": "nadia.rahman@cymbal-sandbox.example", "due_workday": "WD+3", "due_date": "2026-12-03", "proposed_status": "not_started" }
  ],
  "summary": {
    "total": 6,
    "done": 0,
    "at_risk": 1,
    "late": 1,
    "standup_note": "Close WD+1 (1 Dec): 2 ready for review (prepaids, payroll changes), 1 at risk (operating bank rec, due today), 1 late (Ops accruals, utilities estimate outstanding). Escalation to Luis's manager drafted for your approval."
  },
  "drafts_for_approval": [
    { "kind": "reminder", "to": "jae.kim@cymbal-sandbox.example", "rows": [4, 5] },
    { "kind": "manager_escalation", "to": "maya.chen@cymbal-sandbox.example", "rows": [9] }
  ]
}
`,
    },
    {
      path: 'workshop/lab.md',
      content: `# Lab 8: Chase the close without chasing people

**Time box:** 45 minutes

## Objective

Run a compressed month-end close with Gemini sweeping the checklist Sheet and the period folder,
proposing statuses with evidence, and drafting batched reminders and escalations. The controller
approves every message and accepts every status change.

## Setup

- **Seats:** groups of four on Business Standard or Enterprise Standard seats in
  \`cymbal-sandbox.example\`: controller, staff accountant, and two non-finance owners (Ops, HR).
- **Data:** a "Close checklist 2026-11" Sheet with 24 rows, a \`Close/2026-11\` shared drive
  folder with partial evidence, and last month's request emails. All figures are synthetic.
- **Package:** \`meridian/month-end-close-chaser@0.8\` (partner-maintained, Meridian Advisory).
- A "Close - November" Chat space with the group.
- **Admin prerequisite:** Gemini usage reporting is on for the sandbox OU in the Admin console,
  so the "Measure it next week" signal is visible from day one.

## Steps

1. Controller: open the checklist Sheet and, in the side panel, run "Plan the November close."
   Check the WD-to-date mapping skips the Thanksgiving holiday. Approve the WD+3 review hold.
2. Review the batched input requests. Confirm Ops gets one email listing all of its rows, not
   three separate ones. Edit and send.
3. Staff accountant: upload a prepaids file to the period folder. Watch the evidence wake propose
   "ready for review" as a comment on the row.
4. Controller: accept the suggestion. Then try to find any cell the agent changed directly
   (there should be none).
5. Facilitator advances to WD+1 08:30. Read the stand-up note in your Chat DM. Forward it to the
   close space with one line of your own.
6. Review the reminder to Jae: confirm it batches rows 4 and 5 and shows both the WD label and
   the calendar date. Send it.
7. Review the escalation to Luis's manager. Decide whether to send it or give Luis another day.
8. Facilitator advances to WD+5. Open the wrap Doc and read the on-time rate by team and the
   proposed checklist changes.

## What good looks like

- [ ] Every status proposal cites an evidence file or reply.
- [ ] One message per owner per day, batched across rows.
- [ ] No payroll or bank details pasted into any message.
- [ ] No escalation went out without the controller's approval.
- [ ] The wrap names recurring blockers you can fix in next month's template.

## Entitlement check

About $0.38 per working sweep and roughly 5 per close (1.2 per week averaged over the month):
0.38 x 1.2 x 4.3 = about $1.96 a month for the controller. Owners who only receive reminders
spend nothing.

## Facilitator notes

- Reset the checklist statuses and the period folder from the "Lab 8 seed" copy between cohorts.
- If evidence files are not matched, check names against the row patterns; a trailing space in a
  file name is the usual culprit.
- Remind attendees no finance system is connected. The chaser reads the Sheet and the folder and
  drafts messages; it never posts entries or approves anything.
- Non-finance owners should reply to the request emails from their own sandbox seat so the reply
  wake fires.
- Debrief prompt: which close task did you chase most often last month, and who owns it?

## Measure it next week

- **Signal:** agentic tasks per controller during the close window (target: 5 or more working sweeps between
  WD-5 and WD+5) in the Admin console Gemini usage report.
- **Outcome:** checklist rows late at WD+3, compared with last month's close.
- **Watch for:** controllers who stop accepting status proposals; usually evidence file names do
  not match the row patterns, so fix the patterns.
`,
    },
    {
      path: 'CHANGELOG.md',
      content: `# Changelog

## 0.8 - 2026-10-29
- Holiday-aware workday mapping; every message shows WD label and calendar date.
- Manager escalation after \`escalate_after_days\`, approval required.

## 0.7 - 2026-09-30
- Requests batched by owner across rows.
- Status changes proposed as comments, never direct cell edits.

## 0.6 - 2026-08-29
- Evidence wake: new files in the period folder matched to checklist rows.

## 0.5 - 2026-07-31
- First partner preview: daily sweep and stand-up note for the controller.
`,
    },
  ],
};
