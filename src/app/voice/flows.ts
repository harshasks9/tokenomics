// Animated flow storytelling + operating-model comparison data.
// Every quantified value carries a `kind` label: benchmark (cited), assumption
// (modelling default to replace with customer data), or platform (capability fact).

export type FlowActor = "customer" | "ivr" | "human" | "system" | "agent";

export type FlowStep = {
  label: string;
  desc: string;
  actor: FlowActor;
  channel?: string;
  wait?: string;             // elapsed-time chip
  pain?: string;             // conventional-flow friction callout
  approval?: boolean;        // human-approval point in agentic flow
  perspectives?: { customer?: string; employee?: string; system?: string };
};

export type FlowMetric = {
  name: string;
  before: string;
  after: string;
  basis: string;
  kind: "benchmark" | "assumption" | "platform";
};

export type VerticalFlow = {
  slug: string;
  scenario: string;
  conventional: FlowStep[];
  agentic: FlowStep[];
  metrics: FlowMetric[];
  impact: { customer: string; employee: string };
  valueDrivers: string[];
  differentiators: string[];
  roles: { geap: string; gecx: string; partner: string; human: string };
};

export const ACTOR_META: Record<FlowActor, { label: string; color: string }> = {
  customer: { label: "Customer", color: "#5F6368" },
  ivr: { label: "IVR / form", color: "#9AA0A6" },
  human: { label: "Human staff", color: "#D97706" },
  system: { label: "Siloed system", color: "#B3261E" },
  agent: { label: "Gemini agent", color: "#1A73E8" },
};

// ─── Operating-model comparison (13 dimensions) ─────────────────────────────

export type CompareRow = {
  dimension: string;
  conventional: string;
  point: string;
  agentic: string;
};

export const OPERATING_MODELS: CompareRow[] = [
  { dimension: "Customer experience", conventional: "Queue, IVR maze, repeat yourself at every step", point: "One channel improves; experience breaks at its edges", agentic: "Recognized, understood, and resolved in the customer's language on any channel" },
  { dimension: "Process completion", conventional: "Conversation ends; a human re-keys the outcome later, if at all", point: "Bot deflects to forms or articles; completion still manual", agentic: "Agent executes the transaction in systems of record within the conversation" },
  { dimension: "Speed of response", conventional: "Minutes of hold; days for follow-up", point: "Instant answers for scripted intents only", agentic: "Instant engagement and resolution for the majority of intents, 24/7" },
  { dimension: "Cost to serve", conventional: "$13.50 median per assisted contact (Gartner 2024)", point: "Savings on deflected volume; escalations still full cost", agentic: "Self-service economics ($1.84 median, Gartner 2024) on contained volume; cheaper escalations via triage" },
  { dimension: "Revenue & collections impact", conventional: "Coverage-limited: uncontacted leads and accounts decay", point: "Campaign blasts without conversation or negotiation", agentic: "Every lead and account engaged in minutes, negotiated within policy" },
  { dimension: "Context retention", conventional: "None — each channel and call starts from zero", point: "Session-scoped memory inside one tool", agentic: "State and memory persist across channels, sessions, and handoffs" },
  { dimension: "Personalization", conventional: "Script-level segments at best", point: "Rule-based greetings and merge fields", agentic: "Grounded in the customer's actual history, entitlements, and intent" },
  { dimension: "Multichannel continuity", conventional: "Voice, chat, and email owned by different teams and vendors", point: "Continuity only inside the vendor's channel", agentic: "One agent layer: start on WhatsApp, continue on voice, finish by email" },
  { dimension: "Human-agent productivity", conventional: "Agents toggle 5–10 screens; after-call work eats capacity", point: "Assist widgets bolt onto an unchanged workflow", agentic: "Humans receive triaged, contextualized escalations with drafted next steps" },
  { dimension: "Enterprise-system integration", conventional: "Swivel-chair: humans are the integration layer", point: "A few hard-wired API calls per bot", agentic: "Governed tool-calling into CRM, core, ERP, ITSM — permissioned per interaction" },
  { dimension: "Governance & compliance", conventional: "1–2% call sampling; script discipline is the control", point: "Per-tool logs; no cross-channel policy enforcement", agentic: "100% of interactions logged, policy-checked in-line, and auditable" },
  { dimension: "Scalability", conventional: "Hire, train, attrite — capacity lags demand by months", point: "Scales within one channel until intents get messy", agentic: "Elastic on Google infrastructure; peak marginal cost ≈ flat" },
  { dimension: "Measurement & improvement", conventional: "QA samples and quarterly surveys", point: "Vendor dashboard for its own slice", agentic: "Every interaction evaluated against golden sets; policies and prompts improve weekly" },
];

// ─── Per-vertical flows ─────────────────────────────────────────────────────

export const FLOWS: VerticalFlow[] = [
  {
    slug: "financial-services",
    scenario: "A retail-bank customer is 12 days past due on an auto-loan EMI",
    conventional: [
      { label: "Dialer burst", desc: "Predictive dialer tries the customer during work hours", actor: "system", channel: "Voice", wait: "Day 12", pain: "60–70% of attempts go unanswered", perspectives: { customer: "Three missed calls from an unknown number", employee: "Collector burns 40 dials to get 8 conversations", system: "Dialer list exported nightly from the collections CRM" } },
      { label: "Callback queue", desc: "Customer calls back, lands in the general IVR tree", actor: "ivr", channel: "IVR", wait: "+4 min", pain: "IVR has no idea why the bank called", perspectives: { customer: "Press 1 for accounts… none of these options are 'you called me'", employee: "Inbound team can't see outbound campaign context", system: "IVR and dialer are separate vendors with separate logs" } },
      { label: "Re-authentication", desc: "Agent asks for account number, DOB, and last transaction", actor: "human", wait: "+3 min", pain: "Second authentication in the same journey", perspectives: { customer: "I already put my account number into the IVR", employee: "KYC script mandatory — no way to carry IVR auth over", system: "IVR auth token not passed to the desktop" } },
      { label: "Manual lookup", desc: "Collector toggles core banking, CRM, and a payments portal", actor: "human", wait: "+2 min", pain: "5–10 screens per call", perspectives: { customer: "Long silences and hold music", employee: "Alt-tab between LOS, core, and the discount matrix spreadsheet", system: "No unified customer view; data re-keyed between systems" } },
      { label: "Improvised offer", desc: "Collector negotiates from memory of the discount matrix", actor: "human", pain: "Offer consistency depends on who answers", perspectives: { customer: "A colleague got a better deal last month", employee: "Pressure to close vs fear of audit findings", system: "Offer terms recorded free-text, if at all" } },
      { label: "Promise on paper", desc: "Promise-to-pay noted in a wrap-up field", actor: "human", wait: "+2 min ACW", pain: "No automatic follow-up scheduled", perspectives: { customer: "Told to 'pay by Friday' with no link", employee: "After-call work: 2 minutes of typing per call", system: "PTP field rarely drives any downstream workflow" } },
      { label: "Broken promise, silence", desc: "Payment doesn't arrive; account waits for the next dialer cycle", actor: "system", wait: "+6 days", pain: "Account ages toward the next bucket at 5–10× recovery cost", perspectives: { customer: "No reminder before the promised date", employee: "Next collector starts from zero", system: "Roll-rate visible only in month-end MIS" } },
      { label: "Sampled QA", desc: "Compliance reviews 1–2% of recordings weeks later", actor: "human", wait: "+3 weeks", pain: "98% of conversations never audited", perspectives: { customer: "Complaint raised; bank can't find the call quickly", employee: "QA feedback arrives after habits are formed", system: "Recordings in a separate voice-logger silo" } },
    ],
    agentic: [
      { label: "Policy-timed outreach", desc: "Agent contacts on WhatsApp within permitted windows, in the customer's language", actor: "agent", channel: "WhatsApp", wait: "Day 1", perspectives: { customer: "A polite message from the bank's verified number, in Hindi", employee: "Collections team sees campaign status live, not in month-end MIS", system: "Consent, DND, and window rules enforced by orchestration before send" } },
      { label: "Identity resolved once", desc: "Registered-number match plus OTP; auth state carried across channels", actor: "agent", perspectives: { customer: "One OTP — never asked to repeat details again", employee: "Escalations arrive pre-authenticated", system: "Identity token bound to the session across WhatsApp and voice" } },
      { label: "Context retrieved", desc: "Live dues, EMI history, and prior promises pulled from core banking", actor: "agent", perspectives: { customer: "The agent already knows my exact dues and last payment", employee: "No screen-toggling — context is assembled before any human sees it", system: "Read-only scoped APIs; every retrieval logged" } },
      { label: "Reasoned negotiation", desc: "Agent explains dues and offers only from the risk-approved matrix", actor: "agent", perspectives: { customer: "Clear options: pay now, split in two, or set a date", employee: "Offer consistency is structural, not training-dependent", system: "Offer matrix versioned by risk; agent cannot exceed it" } },
      { label: "Payment in-channel", desc: "Payment link issued; PTP written to the collections system with auto-follow-up", actor: "agent", channel: "WhatsApp", perspectives: { customer: "Tap, pay, get a receipt — 90 seconds total", employee: "Kept promises no longer depend on collector diaries", system: "Gateway webhook updates core; follow-up job scheduled automatically" } },
      { label: "Hardship detected → human", desc: "Job-loss cue routes to a trained specialist with full transcript", actor: "human", approval: true, perspectives: { customer: "A human calls, already knowing the situation — no re-telling", employee: "Specialist handles judgment, not data gathering", system: "Vulnerability triggers defined by compliance, not left to scripts" } },
      { label: "Outcome recorded", desc: "Resolution, offer, and consent trail written back; 100% logged", actor: "agent", perspectives: { customer: "Confirmation message with the agreed plan", employee: "Roll-rate and kept-promise dashboards update daily", system: "Full transcript + actions in the audit store, in-region" } },
      { label: "Continuous evaluation", desc: "Every conversation scored against policy; scripts improve weekly", actor: "agent", perspectives: { customer: "Next month's reminder is shorter and better timed", employee: "QA coverage goes from 2% sampled to 100% scored", system: "Eval harness gates every prompt/policy change before rollout" } },
    ],
    metrics: [
      { name: "Day-1 contact coverage", before: "~30–40% of accounts", after: "100% attempted, multi-channel", basis: "Coverage is a capacity fact today; agentic coverage is a platform capability. Contact success measured in pilot.", kind: "platform" },
      { name: "Cost per completed contact", before: "$13.50 median assisted", after: "$1.84 median self-service", basis: "Gartner customer service cost benchmarks, 2024 — medians, not promises", kind: "benchmark" },
      { name: "Authentication events per journey", before: "2–3", after: "1", basis: "Process design: session identity carried across channels", kind: "platform" },
      { name: "QA coverage", before: "1–2% sampled", after: "100% scored", basis: "Platform capability: every interaction logged and evaluated", kind: "platform" },
      { name: "Roll-rate improvement", before: "—", after: "measured in pilot", basis: "McKinsey reports 20–25% NPL reduction for digital-first collections leaders; your number comes from your pilot cohort", kind: "benchmark" },
    ],
    impact: { customer: "Contacted respectfully in their language on day one, resolved in 90 seconds, never asked to repeat themselves — and routed to a human the moment hardship appears.", employee: "Collectors stop dialing voicemail and typing wrap-ups; they handle the negotiations and hardship cases that need judgment, with full context served up." },
    valueDrivers: ["Earlier contact → lower roll rates", "Self-service economics on contained volume", "Kept-promise automation", "100% compliance coverage", "Collector capacity redeployed to complex cases"],
    differentiators: ["In-tenant deployment: models, state, and logs inside the bank's cloud perimeter", "Indic + regional language quality incl. code-switching", "Policy matrices enforced by orchestration, not scripts", "One evaluation framework across every channel"],
    roles: {
      geap: "Gemini Enterprise Agent Platform runs the collections agent: reasoning, policy enforcement, state, tool-calling into core banking, and evaluation.",
      gecx: "Where the bank runs a contact centre, escalations land in Customer Engagement Suite (or the incumbent CC stack) with full context; GECX leads any CC-modernization track.",
      partner: "Partner wires telephony/BSP, tunes languages, builds core-banking and payment connectors, and operates the deployment.",
      human: "Hardship, disputes, and legal-stage accounts always route to trained specialists; compliance owns the offer matrix and vulnerability triggers.",
    },
  },
  {
    slug: "retail",
    scenario: "A customer's cash-on-delivery order shows 'out for delivery' for the second day",
    conventional: [
      { label: "Self-serve dead end", desc: "Tracking page shows a stale status; FAQ says 'wait 48 hours'", actor: "system", channel: "Web", wait: "Day 2", pain: "The one answer the customer wants isn't there", perspectives: { customer: "Refreshing the tracking page for the fifth time", employee: "—", system: "OMS status not synced with the 3PL's last-mile feed" } },
      { label: "Chatbot loop", desc: "FAQ bot offers order status — the same stale status", actor: "ivr", channel: "Chat", wait: "+5 min", pain: "Deflection without resolution", perspectives: { customer: "'Did that answer your question?' No.", employee: "Bot vendor reports this as a 'successful deflection'", system: "Bot reads a cached status API; can't act on anything" } },
      { label: "Call + queue", desc: "Customer calls; 18-minute festival-season queue", actor: "ivr", channel: "Voice", wait: "+18 min", pain: "Peak volume, worst wait exactly when it matters", perspectives: { customer: "Hold music while at work", employee: "Queue SLA blown every festival week", system: "Seasonal staffing never matches the spike" } },
      { label: "Identify + explain again", desc: "Agent asks for order ID and the whole story", actor: "human", wait: "+3 min", pain: "Chat transcript invisible to the voice agent", perspectives: { customer: "Third time explaining the same issue", employee: "No CTI pop — order lookup is manual", system: "Chat and voice run on different vendors" } },
      { label: "Swivel-chair lookup", desc: "Agent checks OMS, then the 3PL portal, then payments", actor: "human", wait: "+4 min", pain: "Three systems, three logins", perspectives: { customer: "More hold music", employee: "3PL portal times out during peaks", system: "No delivery-exception feed into the service desk" } },
      { label: "Ticket to logistics", desc: "Agent can't reschedule — raises an internal ticket", actor: "human", wait: "+1–2 days", pain: "The person who answered can't act", perspectives: { customer: "'You'll hear back within 48 hours'", employee: "Ticket queue to a team with its own backlog", system: "Ticket loses the conversation context" } },
      { label: "Failed delivery → RTO", desc: "Third attempt fails; order returns to origin", actor: "system", wait: "+3 days", pain: "COD return-to-origin is pure margin loss", perspectives: { customer: "Order cancelled without being asked", employee: "Refund workflow starts — another queue", system: "RTO logged in logistics, invisible to marketing" } },
      { label: "Churn, unmeasured", desc: "Customer quietly shops elsewhere; nobody connects the dots", actor: "system", pain: "No closed loop from delivery failure to lost lifetime value", perspectives: { customer: "Deletes the app", employee: "CSAT survey went to spam", system: "Delivery failures and churn live in different dashboards" } },
    ],
    agentic: [
      { label: "Proactive exception ping", desc: "Delivery-risk detected; agent messages before the customer asks", actor: "agent", channel: "WhatsApp", wait: "Hour 0", perspectives: { customer: "'Your order may be delayed — want it tomorrow 6–9pm instead?'", employee: "Exception queue shrinks before it forms", system: "3PL exception feed triggers the outreach workflow" } },
      { label: "Recognized instantly", desc: "Registered number matched; recent order already in context", actor: "agent", perspectives: { customer: "No order ID hunting", employee: "—", system: "Identity + order context assembled from OMS at session start" } },
      { label: "Live truth retrieved", desc: "Real-time status from OMS and the 3PL's last-mile API", actor: "agent", perspectives: { customer: "Told exactly where the package is, honestly", employee: "Same live view on the rare escalation", system: "Connector normalizes three 3PL feeds into one status model" } },
      { label: "Reasoned options", desc: "Agent weighs COD value, RTO risk, and slot availability", actor: "agent", perspectives: { customer: "Reschedule, redirect to a pickup point, or switch to prepaid with a small voucher", employee: "Options come from a policy the ops team owns", system: "RTO-risk model scores the order; incentives bounded by policy tiers" } },
      { label: "Action executed", desc: "Reschedule written into the 3PL system; address fix applied", actor: "agent", channel: "WhatsApp", perspectives: { customer: "Done in one message — new slot confirmed", employee: "Zero tickets raised for reschedules", system: "Write-scoped 3PL API call, logged with before/after values" } },
      { label: "Refund above tier → approval", desc: "A goodwill credit above policy pings a human lead for one-tap approval", actor: "human", approval: true, perspectives: { customer: "Compensation arrives without begging", employee: "Lead approves from a queue with full context, 10 seconds", system: "Approval thresholds by customer tier; every override logged" } },
      { label: "Outcome measured", desc: "Delivery completes; RTO avoided and attributed", actor: "agent", perspectives: { customer: "Package arrives in the chosen slot", employee: "Ops dashboard shows RTO saves by cohort", system: "Outcome joined to the intervention in the warehouse" } },
      { label: "Learning loop", desc: "Exception patterns feed slotting and courier selection", actor: "agent", perspectives: { customer: "Fewer delays next month", employee: "Weekly review shows top failure causes with evidence", system: "Eval sets updated from real conversations; policies re-tested before rollout" } },
    ],
    metrics: [
      { name: "Time to resolution", before: "26+ min + 1–2 day ticket", after: "under 2 minutes, in-channel", basis: "Conventional = queue + handle + ticket SLA (typical operator pattern, assumption); agentic = platform design", kind: "assumption" },
      { name: "Contacts per incident", before: "3–4 across channels", after: "1 proactive thread", basis: "Process design: exception detected before the customer calls", kind: "platform" },
      { name: "Cost per contact", before: "$13.50 median assisted", after: "$1.84 median self-service", basis: "Gartner customer service cost benchmarks, 2024", kind: "benchmark" },
      { name: "Cart abandonment context", before: "~70% of carts abandoned", after: "recoverable via consent-based outreach", basis: "Baymard Institute meta-analysis; recovery rate measured in pilot", kind: "benchmark" },
      { name: "RTO reduction", before: "—", after: "measured in pilot", basis: "COD RTO economics vary widely by category; baseline yours before projecting", kind: "assumption" },
    ],
    impact: { customer: "Told about problems before they notice, given real options in one thread, compensated fairly — festival peaks feel like off-peak.", employee: "Service teams stop being human middleware between OMS and 3PL portals; they handle disputes and exceptions with live context." },
    valueDrivers: ["RTO avoidance on COD orders", "Peak absorbed at flat marginal cost", "WISMO removed from human queues", "Proactive outreach converts service into retention", "Ticket elimination for routine logistics actions"],
    differentiators: ["One agent layer across WhatsApp, voice, web, and app", "Real-time grounding in OMS + logistics truth", "Policy-tiered goodwill with human approval above threshold", "Peak elasticity on Google infrastructure"],
    roles: {
      geap: "Agent Platform orchestrates exception detection, conversation, policy reasoning, and write-actions into OMS/3PL systems.",
      gecx: "If the retailer runs a CC platform, human escalations arrive there context-complete; GECX leads if the engagement is CC modernization.",
      partner: "Partner builds 3PL/OMS connectors, WhatsApp BSP integration, and category-specific policies; operates during peaks.",
      human: "Ops leads approve above-tier goodwill; disputes and fraud flags always route to people.",
    },
  },
  {
    slug: "telecom",
    scenario: "A fiber outage hits a neighborhood; a prepaid customer's bill-date lands the same week",
    conventional: [
      { label: "Outage, no signal to CX", desc: "NOC knows; the IVR and agents don't", actor: "system", wait: "Hour 0", pain: "Ops and CX systems don't talk", perspectives: { customer: "Internet down, no explanation", employee: "Agents learn about the outage from angry callers", system: "NOC alarms never reach the service desk" } },
      { label: "Call spike ×5", desc: "Thousands call at once; queue melts", actor: "ivr", channel: "Voice", wait: "+35 min", pain: "Capacity is worst exactly when demand peaks", perspectives: { customer: "35-minute estimated wait", employee: "Every conversation starts with an apology", system: "Erlang staffing math can't absorb a 5× spike" } },
      { label: "Language mismatch", desc: "IVR offers two languages; the customer speaks a third", actor: "ivr", pain: "Multilingual base, monolingual IVR", perspectives: { customer: "Navigating menus in a second language", employee: "Regional-language queue has 3 agents", system: "Language routing = separate queues, separate staffing" } },
      { label: "Generic triage script", desc: "Agent runs the restart-your-router script — for a known outage", actor: "human", wait: "+8 min", pain: "The script doesn't know what the NOC knows", perspectives: { customer: "'Have you tried turning it off and on?' It's your outage.", employee: "No outage overlay on the agent desktop", system: "Trouble-ticket system separate from network inventory" } },
      { label: "Inconsistent ETA", desc: "Three agents give three restoration estimates", actor: "human", pain: "Guesswork erodes trust", perspectives: { customer: "Was told 2 hours, then 6, then 'tomorrow'", employee: "No authoritative ETA feed to quote", system: "Restoration estimates live in NOC chat threads" } },
      { label: "Bill shock on top", desc: "Auto-debit fails during the outage week; service barred", actor: "system", wait: "+2 days", pain: "Billing doesn't know about the outage either", perspectives: { customer: "No internet AND barred for non-payment", employee: "Collections calls a customer who couldn't get online to pay", system: "Billing and assurance are separate stacks" } },
      { label: "Churn begins", desc: "Customer ports out; exit survey unanswered", actor: "system", wait: "+2 weeks", pain: "Preventable churn, invisible until the port-out report", perspectives: { customer: "Competitor SIM by Friday", employee: "Retention desk never saw the outage + billing combo", system: "Churn model runs monthly, after the fact" } },
      { label: "Post-mortem without CX data", desc: "Network RCA done; customer-impact never quantified", actor: "human", pain: "No closed loop between outage cost and CX cost", perspectives: { customer: "—", employee: "CX impact estimated by anecdote", system: "Call spike and churn not joined to the outage record" } },
    ],
    agentic: [
      { label: "Outage → proactive notice", desc: "Agent correlates affected nodes to subscribers; notifies before calls form", actor: "agent", channel: "SMS/WhatsApp", wait: "Min 10", perspectives: { customer: "'We know about the outage in your area — ETA 4pm, we'll update you'", employee: "Call spike suppressed before it forms", system: "NOC alarm feed mapped to subscriber-location index" } },
      { label: "Callers recognized + located", desc: "Inbound callers matched to the outage by line location before hello", actor: "agent", channel: "Voice", perspectives: { customer: "Greeted in their own language with the actual answer", employee: "Only non-outage faults reach humans", system: "Caller line ID joined to network topology in real time" } },
      { label: "Honest status, any language", desc: "Live restoration ETA from the NOC feed, in 10+ languages", actor: "agent", perspectives: { customer: "One consistent ETA, updated when it changes", employee: "Everyone quotes the same authoritative feed", system: "Single ETA source of truth; agent subscribes to changes" } },
      { label: "Real faults triaged", desc: "Non-outage issues get guided diagnostics; unresolved cases book a technician", actor: "agent", perspectives: { customer: "Technician slot booked in the same call", employee: "Field force receives pre-diagnosed tickets", system: "Diagnostics API + field-service scheduling integration" } },
      { label: "Billing grace applied", desc: "Agent sees the outage-billing collision and applies policy grace", actor: "agent", perspectives: { customer: "'Your bill date fell in the outage — we've extended it 5 days'", employee: "No collections calls into outage zones", system: "Assurance context injected into billing decisions, per policy" } },
      { label: "Retention risk → human", desc: "Port-out signals route to a retention specialist with an approved offer set", actor: "human", approval: true, perspectives: { customer: "A human calls with a relevant offer, not a script", employee: "Retention desk works a ranked, contextualized queue", system: "Churn signals scored in-flight, not month-end" } },
      { label: "Restoration confirmed", desc: "Service verified per line; closure message with goodwill data pack", actor: "agent", perspectives: { customer: "'You're back online — here's 5GB for the trouble'", employee: "Confirmed-restore list replaces guesswork", system: "Line-level verification joined to the outage record" } },
      { label: "CX cost joined to RCA", desc: "Interaction volume, churn saves, and goodwill cost attached to the outage", actor: "agent", perspectives: { customer: "Fewer repeat outages over time", employee: "Network investment cases now include CX cost", system: "Outage record carries full customer-impact economics" } },
    ],
    metrics: [
      { name: "Outage call spike", before: "5× normal volume", after: "suppressed by proactive notice", basis: "Spike multiple is an operator-reported pattern (assumption); suppression measured in pilot", kind: "assumption" },
      { name: "Languages served", before: "2–3 staffed", after: "10+ via one deployment", basis: "Platform capability: Gemini + Chirp speech models", kind: "platform" },
      { name: "Cost per interaction vs ARPU", before: "$13.50 assisted median", after: "$1.84 self-service median", basis: "Gartner 2024 benchmarks — the gap is untenable at prepaid ARPU", kind: "benchmark" },
      { name: "ETA consistency", before: "per-agent guesswork", after: "one authoritative feed", basis: "Process design: single source of truth", kind: "platform" },
      { name: "Churn save rate", before: "—", after: "measured in pilot", basis: "Depends on offer policy and base mix; baseline before projecting", kind: "assumption" },
    ],
    impact: { customer: "Told about the outage before noticing, in their own language, with an honest ETA — and never billed or barred for the operator's downtime.", employee: "Agents stop apologizing for information they don't have; field and retention teams work ranked, pre-diagnosed queues." },
    valueDrivers: ["Call-spike suppression at near-zero marginal cost", "Language coverage without language staffing", "Churn prevention at the moment of risk", "Billing-assurance coordination", "Field-force efficiency from pre-diagnosis"],
    differentiators: ["Carrier-scale elasticity on Google infrastructure", "NOC-to-CX real-time grounding", "10+ languages incl. code-switching in one deployment", "In-tenant subscriber data handling"],
    roles: {
      geap: "Agent Platform correlates network + billing + subscriber context, runs conversations at spike scale, and executes grace/booking actions.",
      gecx: "The telco's CC stack (GECX or incumbent) receives non-outage escalations and retention conversations; GECX leads CC-modernization tracks.",
      partner: "Partner integrates NOC feeds, BSS/OSS APIs, SMSC/BSP channels, and regional language tuning; operates 24/7.",
      human: "Retention offers above policy, regulatory complaints, and field dispatch exceptions stay human-approved.",
    },
  },
  {
    slug: "education",
    scenario: "A parent inquires about undergraduate admission for their daughter, in Kannada, at 9pm",
    conventional: [
      { label: "Web form into the void", desc: "Inquiry form submitted; auto-reply promises '3 business days'", actor: "system", channel: "Web", wait: "Day 0", pain: "Speed-to-lead is the whole game, and the clock starts now", perspectives: { customer: "Filled the form at 9pm; silence", employee: "Forms land in a shared inbox nobody owns at night", system: "Form tool not integrated with the admissions CRM" } },
      { label: "Counselor backlog", desc: "Counselor works a 300-lead spreadsheet during office hours", actor: "human", wait: "+2 days", pain: "Peak season = flat team, 10× inquiries", perspectives: { customer: "Two days later, still nothing", employee: "Dialing down a spreadsheet, newest first", system: "Lead source and program interest not captured structurally" } },
      { label: "Missed-call tag", desc: "Two attempts reach voicemail; lead marked 'unresponsive'", actor: "human", pain: "Working parents can't answer 11am calls", perspectives: { customer: "Two missed calls while at work", employee: "Three attempts is the SOP, then move on", system: "'Unresponsive' is a terminal state in the CRM" } },
      { label: "English-only callback", desc: "Contact finally made — but not in the family's language", actor: "human", wait: "+3 days", pain: "The decision-maker is most comfortable in Kannada", perspectives: { customer: "Grandmother's questions go untranslated", employee: "One Kannada-speaking counselor, always busy", system: "Language preference never captured" } },
      { label: "Fees 'to be confirmed'", desc: "Scholarship and hostel questions need callbacks from two offices", actor: "human", wait: "+2 days", pain: "Answers exist in documents; retrieval is human", perspectives: { customer: "Three calls to answer three questions", employee: "Counselor emails accounts and hostel office, waits", system: "Fee tables in PDFs; no queryable source" } },
      { label: "Application stalls", desc: "Application started; missing marksheet nobody chases", actor: "system", wait: "+1 week", pain: "Incomplete applications quietly die", perspectives: { customer: "Unsure what's missing; portal just says 'incomplete'", employee: "No one owns incomplete-app follow-up", system: "Document checklist not exposed to applicants" } },
      { label: "Admit, then silence", desc: "Offer letter sent; next touch is the fee deadline", actor: "system", wait: "+3 weeks", pain: "Summer melt: admitted ≠ enrolled", perspectives: { customer: "Another college kept calling; this one went quiet", employee: "Nurture is 'send the brochure again'", system: "No post-admit engagement workflow at all" } },
      { label: "Seat lost, unattributed", desc: "Student enrolls elsewhere; funnel report says 'yield down'", actor: "system", pain: "No one can say where the funnel actually leaks", perspectives: { customer: "—", employee: "Year-end review blames 'market conditions'", system: "Drop-off reasons never captured" } },
    ],
    agentic: [
      { label: "Instant engagement, 9pm", desc: "Agent responds on WhatsApp in Kannada within a minute", actor: "agent", channel: "WhatsApp", wait: "Min 1", perspectives: { customer: "A real conversation, that night, in Kannada", employee: "Counselors wake up to qualified, booked conversations", system: "Form webhook triggers the agent; language auto-detected" } },
      { label: "Grounded answers", desc: "Program fit, eligibility, fees, scholarships, hostel — answered with citations from governed sources", actor: "agent", perspectives: { customer: "Every question answered from official documents", employee: "One approved source of truth ends answer drift", system: "Prospectus, fee tables, and policies indexed with citations" } },
      { label: "Qualified + booked", desc: "Interest scored against rubric; counselor call booked into a real calendar", actor: "agent", perspectives: { customer: "Saturday 11am slot chosen in-chat", employee: "Calendar fills with qualified families only", system: "BANT-style rubric writes structured fields to the CRM" } },
      { label: "Family conference call", desc: "Counselor joins with the full transcript; grandmother's questions pre-translated", actor: "human", perspectives: { customer: "Counselor already knows the context — the call is about the decision", employee: "15-minute prep becomes 15 seconds", system: "Transcript + summary attached to the CRM record" } },
      { label: "Application shepherded", desc: "Checklist tracked; missing marksheet chased automatically with clear instructions", actor: "agent", channel: "WhatsApp", perspectives: { customer: "'Only your 12th marksheet is pending — here's how to upload'", employee: "Incomplete-app rate visible daily, by document type", system: "SIS document status drives the chase workflow" } },
      { label: "Scholarship exception → human", desc: "Edge-case scholarship request routed to the admissions director for decision", actor: "human", approval: true, perspectives: { customer: "A considered human decision within a day", employee: "Director sees the case with full academic context", system: "Exception categories defined by policy; all decisions logged" } },
      { label: "Post-admit nurture", desc: "Orientation, fee plans, hostel allotment — proactive through enrollment day", actor: "agent", perspectives: { customer: "The college that stayed in touch won", employee: "Melt-risk list ranked by engagement signals", system: "Admit-to-enroll journey instrumented end to end" } },
      { label: "Funnel learning", desc: "Drop-off reasons captured conversationally; next intake's playbook improves", actor: "agent", perspectives: { customer: "—", employee: "Yield review runs on evidence, not anecdote", system: "Every stage transition measured; eval sets updated per intake" } },
    ],
    metrics: [
      { name: "First response time", before: "2–3 days", after: "under 2 minutes", basis: "Conventional = typical institutional pattern (assumption); agentic = platform design", kind: "assumption" },
      { name: "Speed-to-lead effect", before: "—", after: "first responder wins", basis: "78% of students choose the first institution to respond — vendor funnel studies (LeadSquared); treat as directional", kind: "benchmark" },
      { name: "Languages served", before: "counselor-dependent", after: "every family's language", basis: "Platform capability: Gemini + Chirp; 98% of Indian internet users consume Indic-language content (IAMAI 2025)", kind: "benchmark" },
      { name: "Incomplete-application chase", before: "manual, unowned", after: "automatic, instrumented", basis: "Process design", kind: "platform" },
      { name: "Yield improvement", before: "—", after: "measured across one intake", basis: "Melt ranges 20–40% in US higher-ed research; your intake is the only number that matters", kind: "benchmark" },
    ],
    impact: { customer: "Families get real answers the night they ask, in their language, and a relationship that lasts through enrollment day — not a brochure and silence.", employee: "Counselors spend peak season counseling — every conversation qualified, scheduled, and context-complete." },
    valueDrivers: ["Speed-to-lead conversion lift", "Counselor capacity multiplied in peak season", "Application-completion recovery", "Melt reduction through nurture", "Full-funnel attribution"],
    differentiators: ["Indic-language admissions conversations at native quality", "Grounded, citable answers from governed institutional sources", "One layer from first inquiry to alumni engagement", "Student-data privacy inside the institution's tenant"],
    roles: {
      geap: "Agent Platform runs inquiry, qualification, chase, and nurture agents grounded in institutional knowledge, writing to the admissions CRM and SIS.",
      gecx: "Institutions with contact-centre operations route human escalations through their CC stack; GECX leads if a CC platform decision is active.",
      partner: "Partner integrates CRM/SIS, WhatsApp BSP, and calendar systems; tunes languages; packages the admissions agent for repeatability.",
      human: "Counselors own every enrollment conversation; directors decide exceptions; wellbeing cues route to trained staff immediately.",
    },
  },
  {
    slug: "gcc",
    scenario: "A new analyst in the Manila centre is locked out of two systems on day 3, with a leave request pending",
    conventional: [
      { label: "Portal maze", desc: "Employee searches the intranet; three portals, none obviously right", actor: "system", channel: "Portal", wait: "Min 0", pain: "Knowledge exists; findability doesn't", perspectives: { customer: "Which portal — IT, HR, or 'ServiceHub'?", employee: "—", system: "Three ticketing front doors, separate knowledge bases" } },
      { label: "Wrong-category ticket", desc: "Ticket filed under the wrong category with minimal details", actor: "system", wait: "+15 min", pain: "Misrouted tickets bounce between queues", perspectives: { customer: "Free-text box: 'system not working'", employee: "L1 must re-triage with no context", system: "Category taxonomy designed for agents, not requesters" } },
      { label: "Queue wait", desc: "L1 picks it up hours later, asks for details already knowable", actor: "human", wait: "+4 hrs", pain: "$15–25 fully-loaded cost for an L1 touch", perspectives: { customer: "'Please share your employee ID and error screenshot'", employee: "Half the shift is information-gathering", system: "AD status was queryable all along" } },
      { label: "Password reset, eventually", desc: "A 2-minute fix delivered after 6 elapsed hours", actor: "human", wait: "+2 hrs", pain: "40–60% of L1 volume is resets and status checks", perspectives: { customer: "Day 3 of onboarding, half lost", employee: "Reset #23 today", system: "Reset requires no human judgment whatsoever" } },
      { label: "Second system, second ticket", desc: "The other lockout is 'a different team' — new ticket, new queue", actor: "human", wait: "+1 day", pain: "One problem, two tickets, two SLAs", perspectives: { customer: "Explaining the same onboarding context again", employee: "Access team has no view of the first ticket", system: "Entitlements owned by app-specific admins" } },
      { label: "Leave request lost in email", desc: "HR query sits in a shared inbox behind payroll-run spikes", actor: "human", wait: "+2 days", pain: "HR answers wait behind higher-priority cycles", perspectives: { customer: "Leave for a family event still unconfirmed", employee: "HRBP triages 200 emails after payroll week", system: "Policy answer is in the handbook, page 47" } },
      { label: "Manager escalates", desc: "Manager pings the service-desk lead on chat; queue-jumping begins", actor: "human", pain: "Escalation culture rewards noise, not need", perspectives: { customer: "Felt like a burden in week one", employee: "Lead handles VIP-routing instead of improving the system", system: "Chat escalations bypass all measurement" } },
      { label: "Quarterly survey says 'fine'", desc: "Ticket closed 'resolved'; experience never really measured", actor: "system", wait: "+3 months", pain: "SLA met, experience terrible — and invisible", perspectives: { customer: "Rates onboarding 5/10, tells no one why", employee: "Dashboard is green", system: "Elapsed experience time not a tracked metric" } },
    ],
    agentic: [
      { label: "One front door", desc: "Employee asks in chat, in Filipino or English — no portal choice needed", actor: "agent", channel: "Chat", wait: "Min 0", perspectives: { customer: "'I'm locked out of Workday and the T&E tool, and I have a leave question'", employee: "—", system: "SSO identity resolved; entitlements loaded at session start" } },
      { label: "Context assembled", desc: "Agent sees: day-3 new joiner, onboarding cohort, provisioning status", actor: "agent", perspectives: { customer: "No employee-ID ritual", employee: "—", system: "HRMS + AD + provisioning pipeline queried in one pass" } },
      { label: "Root cause reasoned", desc: "Both lockouts trace to one incomplete provisioning task", actor: "agent", perspectives: { customer: "One problem, one answer — not two tickets", employee: "Systemic onboarding defect surfaced, not buried in two queues", system: "Provisioning workflow state exposed to the agent" } },
      { label: "Fixes executed", desc: "Reset performed; access request completed against the entitlement catalog", actor: "agent", perspectives: { customer: "Both systems working in 4 minutes", employee: "Zero L1 tickets created", system: "Least-privilege tool calls; every action identity-bound and logged" } },
      { label: "Leave answered + filed", desc: "Policy answered with citation; leave request submitted to HRMS in-chat", actor: "agent", perspectives: { customer: "Policy quote + request confirmation in one thread", employee: "HRBP inbox untouched", system: "Governed policy corpus with citations; HRMS write API" } },
      { label: "Manager approval in-flow", desc: "Leave routes to the manager for one-tap approval with context", actor: "human", approval: true, perspectives: { customer: "Approved before end of day", employee: "Manager approves from chat, ten seconds", system: "Approval chain from HRMS org data; decision logged" } },
      { label: "Experience measured", desc: "End-to-end elapsed time and satisfaction captured per interaction", actor: "agent", perspectives: { customer: "Thumbs-up, one tap", employee: "Dashboards show experience time, not just SLA", system: "100% of interactions scored; no more survey blindness" } },
      { label: "Onboarding fixed upstream", desc: "Provisioning defect pattern reported to the process owner with evidence", actor: "agent", perspectives: { customer: "Next cohort never hits this", employee: "CoE ships a provisioning fix with data behind it", system: "Recurring-issue clustering feeds continuous improvement" } },
    ],
    metrics: [
      { name: "Elapsed time to resolution", before: "6 hours – 2 days", after: "minutes, in one thread", basis: "Conventional = typical L1 SLA pattern (assumption); agentic = platform design", kind: "assumption" },
      { name: "Cost per L1 ticket", before: "$15–25 fully loaded", after: "self-service economics", basis: "HDI / service-desk benchmarks (validate per customer); Gartner $1.84 self-service median", kind: "benchmark" },
      { name: "Reset/status share of L1", before: "40–60% of volume", after: "fully automated", basis: "ITSM benchmarks (validate per customer); automation is a platform capability", kind: "benchmark" },
      { name: "Tickets per incident", before: "2–3 across teams", after: "0–1, auto-filed with context", basis: "Process design: root-cause reasoning across systems", kind: "platform" },
      { name: "Experience measurement", before: "quarterly survey", after: "100% of interactions", basis: "Platform capability", kind: "platform" },
    ],
    impact: { customer: "Employees get answers and actions in minutes, in their language, in one thread — onboarding week feels like the company works.", employee: "L1 teams shift from reset factories to agent-operations roles; HRBPs and leads work judgment cases, not inboxes." },
    valueDrivers: ["L1 cost collapse on automatable volume", "Elapsed-time (not just SLA) improvement", "Upstream defect elimination", "Follow-the-sun coverage without staffing", "GCC charter expansion into AI operations"],
    differentiators: ["One governed layer across IT, HR, finance, and facilities", "Least-privilege actions with full audit vs shared-inbox opacity", "The GCC as builder-operator: same platform serves the global enterprise", "Multilingual workforce support in one deployment"],
    roles: {
      geap: "Agent Platform runs the employee-support agents: identity-bound reasoning, cross-system root cause, governed actions into ITSM/HRMS/AD.",
      gecx: "Not typically in scope — employee support sits outside the contact-centre domain. If the GCC also runs customer CC operations, GECX leads that track.",
      partner: "Partner integrates ITSM/HRMS/IdP, builds the entitlement-catalog connector, and co-builds the GCC's agent-operations CoE.",
      human: "Managers approve in-flow; sensitive HR matters route to HRBPs; the CoE governs every agent the centre ships.",
    },
  },
];

export const FLOW_SOURCES = [
  { label: "Gartner, customer service cost benchmarks (2024): $13.50 median assisted vs $1.84 self-service per contact", kind: "benchmark" },
  { label: "McKinsey, digital-first collections research: 20–25% NPL reduction among leaders; up to 40% opex reduction with gen AI", kind: "benchmark" },
  { label: "Baymard Institute: ~70% average cart abandonment (meta-analysis)", kind: "benchmark" },
  { label: "IAMAI–Kantar via IBEF (2025): 900M+ Indian internet users; 98% consume Indic-language content", kind: "benchmark" },
  { label: "LeadSquared and vendor funnel studies: 78% of students choose the first institution to respond (directional, vendor data)", kind: "benchmark" },
  { label: "HDI / ITSM operator benchmarks: $15–25 per L1 ticket; 40–60% of L1 volume is resets/status (validate per customer)", kind: "benchmark" },
  { label: "Conventional-flow wait times and volumes are typical operator patterns — assumptions to replace with the customer's own baseline", kind: "assumption" },
  { label: "Agentic-flow behaviors (context retention, 100% logging, in-line policy checks) are platform capabilities, not projections", kind: "platform" },
];
