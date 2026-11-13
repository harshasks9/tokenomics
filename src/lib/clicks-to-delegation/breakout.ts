/**
 * Breakout 1 · Agentic Commerce — "Cloud for Agentic Commerce & Digital Banking".
 * Framed from Google Cloud's vantage point: market signals, patterns across
 * commerce and banking, what Google is building, and what we've learned
 * operating agents. Sea appears only where the work is joint (the Feb 2026 MOU)
 * and in the questions for the room. Evidence ids resolve in sources.json.
 */
import type { AgendaItem, Slide } from "./breakout-types";

export const SESSION = {
  kicker: "Breakout 1 · Agentic Commerce",
  title: "Cloud for agentic commerce & digital banking",
  dek: "What we're seeing from Google Cloud: the market signals, the patterns that separate pilots from production, and the stack we're building with partners.",
  talk: "Cloud for Agentic Commerce & Digital Banking",
  speaker: "Harsha Konduri",
};

export const AGENDA: AgendaItem[] = [
  { minutes: 20, title: "Shopee & Monee AI Vision", speaker: "Chris Feng", role: "President, Sea Limited", link: "Sea's ambition for AI across buyers, sellers and borrowers." },
  { minutes: 20, title: "Cloud for Agentic Commerce & Digital Banking", speaker: "Harsha Konduri", mine: true, link: "What Google Cloud is seeing: signals, patterns, the stack and operating lessons." },
  { minutes: 20, title: "UCP Update", speaker: "Ben Byon", link: "The protocol path: how agents discover, cart and check out with merchants." },
  { minutes: 20, title: "Android UI Automation & Use Cases", speaker: "Naz Akbari", link: "The device path: agents completing tasks across apps, with or without an API." },
  { minutes: 10, title: "Discussion & Next Steps", speaker: "All", link: "Where to start together, owners and dates." },
];

export const SLIDES: Slide[] = [
  {
    id: "title", minute: "0:00", minutes: 1, title: "Title",
    headline: "Cloud for agentic commerce & digital banking",
    body: { type: "title", kicker: "Breakout 1 · Agentic Commerce", title: "Cloud for agentic commerce & digital banking", subtitle: "What we're seeing from Google Cloud: signals, patterns and the stack." },
    notes: [
      "Thank Chris. Bridge: \"Chris just set out Sea's ambition. I won't tell you about your business; you know it better than anyone. What I can offer is what we're seeing from Google Cloud's side: across commerce and financial services customers, in the market data, and in what we're building.\"",
      "Preview: five signals, two patterns, the stack, the use cases we see working, and what we've learned operating agents. Then Ben goes deep on the protocol and Naz on the device.",
      "Room sensitivities (not on screen): Sea announced its own AI-first enterprise cloud, Sea Cloud, in October. Stay on the agentic layer (identity, payments protocols, Gemini, evaluation), not infrastructure. Don't recite Sea's results back to the room, and don't quote Chris's reported Q3-call remarks.",
    ],
  },
  {
    id: "signals", minute: "1:00", minutes: 2.5, title: "Five signals we're seeing",
    headline: "Five signals from 2026: discovery has moved to AI, purchasing hasn't yet, and the rules of the game are being written now.",
    body: {
      type: "points",
      points: [
        { head: "AI research is mainstream", text: "53% of consumers in 11 markets used AI for shopping in the past three months; about 9% completed a purchase through it (June 2026).", sourceIds: ["a-mckinsey-who-wins"] },
        { head: "Southeast Asia is unusually open", text: "75% of AI users in the region's six largest markets say they'd let AI find the best price and buy, conditional on safeguards, transparency and the ability to undo.", sourceIds: ["s-relevant-econ-2026", "s-bain-econ-2026"] },
        { head: "Checkout is gravitating to merchants", text: "The first wave of native in-chat checkout was scaled back in March 2026; purchases now complete on merchant sites and apps.", sourceIds: ["a-cnbc-openai-revamp", "a-wired-walmart-mirror"] },
        { head: "Influence is being monetized", text: "Ad formats arrived inside AI shopping answers across the major assistants in 2026.", sourceIds: ["a-digiday-chatgpt-ads", "a-ppc-ai-mode-ads", "a-amazon-agentic-ads"] },
        { head: "Regulators are getting specific", text: "MAS issued AI risk-management guidelines covering AI agents (Oct 2026) and a runtime-safeguards paper for agentic finance; Vietnam is weighing caps on AI-approved transactions.", sourceIds: ["s-mas-airm-mr", "s-ag-mas-safr", "s-tuoitre-sbv-cap"] },
      ],
    },
    notes: [
      "Keep this brisk: one line per signal. The thread is that discovery has already moved to AI, the transaction hasn't, and the trust rules are being written in real time.",
      "On Southeast Asia: stated willingness here is far above US surveys (where 6–10% would let an agent buy fully alone), but it's conditional. The conditions are exactly what platforms have to provide.",
      "Add: one anonymized observation from your own customer conversations this quarter (e.g. which use case customers are asking for most).",
    ],
  },
  {
    id: "pattern-rails", minute: "3:30", minutes: 2, title: "Pattern 1: leaders build on owned rails",
    headline: "The companies moving fastest already own four rails. They treat external agents as channels with terms, not as owners of the customer.",
    body: {
      type: "bundle",
      items: [
        { need: "Rail 1", sea: "Catalog & demand", detail: "Structured, real-time product data and a destination customers already use.", sourceIds: [] },
        { need: "Rail 2", sea: "Identity & accounts", detail: "Verified customers and agents: who is acting, for whom.", sourceIds: [] },
        { need: "Rail 3", sea: "Payments & credit", detail: "Wallets and credit lines that can be scoped to an agent's mandate.", sourceIds: [] },
        { need: "Rail 4", sea: "Execution", detail: "Fulfilment, returns and service: the part of the promise an agent can't fake.", sourceIds: [] },
      ],
    },
    notes: [
      "What we see: the largest claimed agentic payment volumes so far came from integrated commerce-and-wallet stacks (Alipay reported 120M+ AI Pay transactions in one week; company claim, campaign week). Retailers that kept checkout on their own rails saw better conversion than in-chat checkout.",
      "The common posture among leaders: work with every agent ecosystem, but on three terms: stay merchant of record, get order and customer data back, and get attribution.",
      "Let the room draw the Sea parallel; don't spell it out.",
    ],
    sourceIds: ["a-alipay-bw", "a-wired-walmart-mirror"],
  },
  {
    id: "pattern-planes", minute: "5:30", minutes: 2.5, title: "Pattern 2: the bottleneck moved",
    headline: "The bottleneck has moved from the model to the platform around it. Agentic commerce runs on four planes.",
    body: {
      type: "planes",
      planes: [
        { name: "Agent-readable commerce", job: "Be selectable by agents", items: ["Structured catalog & attributes", "Real-time stock, price, delivery promise", "Protocol endpoints for cart & checkout"], handoff: "Ben · UCP" },
        { name: "Execution", job: "Complete the task reliably", items: ["APIs first", "App actions & UI automation", "Retries, idempotency, order status"], handoff: "Naz · Android" },
        { name: "Trust & payments", job: "Know who acted, and why", items: ["Agent identity & verification", "Scoped, revocable payment mandates", "Real-time fraud & risk", "Consent & audit trail"] },
        { name: "Intelligence & operations", job: "Make it good, safe and affordable", items: ["Models grounded on first-party data", "Agent runtime & registry", "Evaluation & observability", "Cost per resolved task"] },
      ],
    },
    notes: [
      "This is the core of what we see: the demos that stall have a great model and nothing else. The deployments that scale invest in all four planes.",
      "Key line: \"If you only invest in the model, you get a great demo. If you invest in all four planes, you get a business.\"",
      "Add: an anonymized example of a pilot that stalled on plane 1 or 3 (stale catalog data, no payment mandate) and what fixed it.",
    ],
  },
  {
    id: "stack", minute: "8:00", minutes: 3, title: "What Google is building",
    headline: "Open protocols and a managed agent platform for each plane, so partners don't build the plumbing alone.",
    body: {
      type: "planes",
      planes: [
        { name: "Commerce protocol", job: "Plane 1 · UCP", items: ["Launched Jan 2026", "Cart, catalog & loyalty linking added Mar 2026", "Multi-retailer cart, new verticals & countries May 2026"], handoff: "Ben" },
        { name: "Payments protocol", job: "Plane 3 · AP2", items: ["Donated to the FIDO Alliance, Apr 2026", "v0.2: human-not-present purchases under pre-authorized mandates"] },
        { name: "Agent platform", job: "Plane 4 · Gemini Enterprise Agent Platform", items: ["Formerly Vertex AI (renamed Apr 2026)", "Agent Runtime, Agent Registry", "Agent Identity, Agent Gateway"] },
        { name: "Device", job: "Plane 2 · Android", items: ["Gemini completing multi-step tasks across apps with user approval (May 2026)", "AppFunctions: apps expose actions to agents (preview)"], handoff: "Naz" },
      ],
    },
    notes: [
      "Walk the stack by plane, and keep it factual: dates and status, not superlatives. These are Google's own announcements.",
      "Point out the design choice: the protocols are open (AP2 now sits with the FIDO Alliance) so a merchant integrates once and serves many agents. That's what keeps the merchant in control.",
      "Don't promise UCP availability in Southeast Asia; it launched with US merchants first and has expanded to a few countries. Leave roadmap to Ben.",
    ],
    sourceIds: ["s-siliconangle-ucp", "s-google-ucp-updates", "s-ppc-ucp-countries", "s-fido-ap2", "s-gcp-agent-platform-blog", "s-gulfnews-gemini-intel", "s-android-appfunctions-docs"],
  },
  {
    id: "commerce-cases", minute: "11:00", minutes: 2.5, title: "Commerce use cases we see working",
    headline: "In commerce, the use cases that reach production are the ones closest to the customer's own app, and the measurement is unglamorous.",
    body: {
      type: "cases",
      cases: [
        { name: "Assisted discovery & cart building", rung: "Working today", what: "Conversational search, comparison and basket preparation inside the merchant's own app, grounded on live catalog data.", cloud: "Grounding, low-latency serving, evaluation for accuracy.", kpi: "Conversion and basket size vs search; repeat use after 30 days." },
        { name: "Agent-ready catalog & checkout handoff", rung: "Scaling now", what: "Exposing catalog, stock and checkout to external assistants while staying merchant of record.", cloud: "Protocol endpoints, agent authentication, attribution.", kpi: "Incremental orders; data returned per order." },
        { name: "Seller & merchant agents", rung: "Working today", what: "Listings, pricing, promotions and customer chat for the long tail of merchants.", cloud: "Multimodal generation, policy checks, cost per task.", kpi: "Seller adoption, listing quality, response time." },
      ],
    },
    notes: [
      "Order matters: assisted discovery is low-regret and strengthens the merchant's own destination; external-agent channels come next, on the merchant's terms.",
      "Add: one anonymized retail or marketplace customer metric you can share (conversion lift, cost per contact), clearly marked as a customer result.",
    ],
  },
  {
    id: "banking-cases", minute: "13:30", minutes: 2.5, title: "Banking use cases we see working",
    headline: "In digital banking, agents are earning trust first in servicing and risk, and delegated payments are next.",
    body: {
      type: "cases",
      cases: [
        { name: "Servicing & collections", rung: "Working today", what: "Resolving servicing requests and running compliant collections conversations, in local languages.", cloud: "Grounded responses, policy guardrails, evaluation.", kpi: "Resolution rate, cost per contact, complaints." },
        { name: "Credit evidence assistants", rung: "Human-in-the-loop", what: "Agents that assemble underwriting evidence and draft decisions for credit officers.", cloud: "Explainable features, model-risk controls, data residency.", kpi: "Decision time, approval quality, loss rates by cohort." },
        { name: "Fraud defence for agent traffic", rung: "Becoming essential", what: "Verifying which agent acted, for whom, under which mandate, before money moves.", cloud: "Agent identity verification, real-time risk scoring.", kpi: "Fraud loss and false-positive rates on agent transactions." },
        { name: "Bounded payment mandates", rung: "Emerging", what: "Letting a shopping agent spend within caps by category, merchant and amount, revocable at any time.", cloud: "Mandates (AP2), tokenized credentials, a checkpoint before execution.", kpi: "Repeat mandates; dispute rate vs card-not-present." },
      ],
    },
    notes: [
      "What we see across financial services: servicing and risk use cases reach production first because they keep a human accountable. Delegated payments come next, and regulators are already describing the safeguards.",
      "Trust data point: in a US survey, 39% said they'd be more comfortable if an AI agent used a familiar payment provider. Payment brands are trusted for this job.",
      "Google Cloud launched Gemini Enterprise for Financial Services in preview in August 2026 (capital markets and corporate banking focus); mention only if asked.",
    ],
    sourceIds: ["g-bain-2025", "s-ag-mas-safr", "s-pe-ge-fs"],
  },
  {
    id: "lessons", minute: "16:00", minutes: 2, title: "What we've learned operating agents",
    headline: "Four lessons from running agents in production: measure completion, design for peaks, build the checkpoint, and earn autonomy.",
    body: {
      type: "points",
      points: [
        { head: "Completion is the new conversion rate", text: "Web agents still fail many real tasks. Every use case needs a test set, a completion metric and an error budget before it touches money.", sourceIds: ["a-webarena"] },
        { head: "Design for peaks, not averages", text: "Latency and cost at the busiest hour decide what can run in the purchase path." },
        { head: "Build the checkpoint in", text: "Decide, check against the mandate, then execute: the pattern regulators are converging on.", sourceIds: ["s-ag-mas-safr"] },
        { head: "Earn autonomy", text: "Start supervised, measure repeat behavior, then widen mandates. Don't build autonomous checkout ahead of demonstrated demand." },
      ],
    },
    notes: [
      "Economics: track cost per resolved task next to conversion. Agents that are accurate but expensive don't survive peak season.",
      "Add: one lesson from a Google Cloud deployment you've seen first-hand (what broke at peak, or what evaluation caught).",
    ],
  },
  {
    id: "together", minute: "18:00", minutes: 1.5, title: "Where we can start together",
    headline: "Building on February's MOU: three places to learn together on real traffic, each with a metric and a gate.",
    body: {
      type: "pilots",
      pilots: [
        { name: "Agentic shopping prototype", scope: "The MOU's Shopee × Google prototype in one market, with the merchant staying merchant of record.", kpi: "Agent-referred orders; data returned per order.", gate: "Scale if orders are incremental and data-rich." },
        { name: "AP2 payments pilot", scope: "Monee's AP2 feedback, turned into capped mandates for a narrow use case with a checkpoint before every execution.", kpi: "Repeat mandates; dispute and fraud rates.", gate: "Widen caps only if disputes stay below baseline." },
        { name: "One servicing or risk agent", scope: "A single high-volume workflow behind an evaluation harness.", kpi: "Resolution rate, cost per task, quality vs baseline.", gate: "Expand when quality beats the baseline at lower cost." },
      ],
    },
    notes: [
      "Frame as options for the discussion slot, not a plan. The first two are the workstreams the February MOU already names; the third is where we see banking customers succeed first. Sea chooses where to start.",
    ],
    sourceIds: ["s-sea-google-mou"],
  },
  {
    id: "handoff", minute: "19:30", minutes: 0.5, title: "Handoff",
    headline: "Two paths for agents to act: the protocol and the device.",
    body: {
      type: "handoff",
      next: [
        { who: "Ben Byon", topic: "UCP update", bridge: "The protocol path: how agents discover products, build carts and check out with merchants." },
        { who: "Naz Akbari", topic: "Android UI automation", bridge: "The device path: agents completing multi-step tasks across apps with the user's approval." },
      ],
    },
    notes: ["Hand to Ben: \"The first plane, being selectable and buyable by agents, is where protocols come in. Ben.\""],
  },
];

export const DISCUSSION = [
  { q: "Which of these signals matches what you're seeing in Shopee and Monee data?", why: "Grounds the discussion in Sea's own evidence rather than ours." },
  { q: "Which plane is the hardest for you today: catalog, execution, trust or operations?", why: "Points the first workstream at the real constraint." },
  { q: "Where would you want to start under the MOU: the shopping prototype, AP2 payments, or a servicing or risk agent?", why: "Lets Sea choose the first pilot." },
  { q: "What terms should any external agent accept to sell through Shopee?", why: "Merchant of record, data return and attribution." },
  { q: "Where is UI automation the right path, and where should we insist on APIs?", why: "Connects Naz's use cases to reliability and audit needs." },
  { q: "How should this work fit with Sea's own AI platform plans?", why: "Clarifies which layers Sea builds and where Google's agentic stack plugs in." },
];

export const NEXT_STEPS = [
  { step: "Agree the first workstream and name owners on both sides", owner: "Sea + Google", when: "This week" },
  { step: "Architecture working session on the chosen plane", owner: "Google Cloud + Sea engineering", when: "Within 2 weeks" },
  { step: "Agree metrics, gates and review cadence", owner: "Sea product leads + Google account team", when: "Within 30 days" },
  { step: "First readout on live traffic", owner: "Joint", when: "Day 90" },
];
