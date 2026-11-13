/**
 * Breakout 1 · Agentic Commerce — "Cloud for Agentic Commerce & Digital Banking".
 * Talk track and slides. Evidence ids resolve in sources.json: main report
 * sources (a-, g-, e-, c-, h-) and the Sea Limited fact base (s-, compiled
 * 2026-11-13; see data/sea.json). Sea figures are as reported for Q3 2026.
 */
import type { AgendaItem, Slide } from "./breakout-types";

export const SESSION = {
  kicker: "Breakout 1 · Agentic Commerce",
  title: "Cloud for agentic commerce & digital banking",
  dek: "What has to be true underneath Shopee and Monee's AI vision, and how to turn the February Sea–Google MOU into three pilots on live traffic.",
  talk: "Cloud for Agentic Commerce & Digital Banking",
  speaker: "Harsha Konduri",
};

export const AGENDA: AgendaItem[] = [
  { minutes: 20, title: "Shopee & Monee AI Vision", speaker: "Chris Feng", role: "President, Sea Limited", link: "Sets the ambition: what Sea wants AI to do for buyers, sellers and borrowers." },
  { minutes: 20, title: "Cloud for Agentic Commerce & Digital Banking", speaker: "Harsha Konduri", mine: true, link: "What has to be true underneath that vision: four planes, the use cases, three pilots." },
  { minutes: 20, title: "UCP Update", speaker: "Ben Byon", link: "The protocol path: how agents discover, cart and check out with merchants like Shopee." },
  { minutes: 20, title: "Android UI Automation & Use Cases", speaker: "Naz Akbari", link: "The device path: agents completing tasks across apps, with or without an API." },
  { minutes: 10, title: "Discussion & Next Steps", speaker: "All", link: "Pick pilots, owners and dates." },
];

export const SLIDES: Slide[] = [
  {
    id: "title", minute: "0:00", minutes: 1, title: "Title",
    headline: "Cloud for agentic commerce & digital banking",
    body: { type: "title", kicker: "Breakout 1 · Agentic Commerce", title: "Cloud for agentic commerce & digital banking", subtitle: "What has to be true underneath Shopee and Monee's AI vision." },
    notes: [
      "Thank Chris. Bridge: \"You just heard what Shopee and Monee want AI to do for buyers, sellers and borrowers. My job in the next twenty minutes is the part underneath: what has to be true in the platform for that vision to work at Sea's scale, safely, and how we turn February's MOU into pilots.\"",
      "Set up the next two talks: Ben goes deep on the protocol, Naz on the device. I cover the architecture that connects them.",
      "Room sensitivities (don't put on screen): Sea announced its own AI-first enterprise cloud, Sea Cloud, in an October staff memo. Position this talk as the agentic layer (identity, payments protocols, Gemini, evaluation) that works alongside Sea's own platform, not as an infrastructure pitch. Also avoid quoting Chris's reported Q3-call remark on agentic AI and GMV; it rests on a single secondary source.",
    ],
  },
  {
    id: "market", minute: "1:00", minutes: 2.5, title: "Where the market really is",
    headline: "Southeast Asia says it will let AI buy, on conditions: safeguards, transparency, the right to undo. Those conditions are infrastructure.",
    body: {
      type: "stats",
      stats: [
        { value: "75%", label: "of AI users in the six largest SEA markets say they'd let AI find the best price and buy, with safeguards (Jul 2026, 9,006 AI users)", kind: "survey", sourceIds: ["s-relevant-econ-2026", "s-bain-econ-2026"] },
        { value: "243M", label: "people across SEA-6 use generative AI, though per-person usage is about a tenth of US levels", kind: "survey", sourceIds: ["s-technode-econ-2026", "s-crn-econ-2026"] },
        { value: "53% → ~9%", label: "of consumers in 11 markets used AI for shopping; about 9% completed a purchase through it (Jun 2026)", kind: "survey", sourceIds: ["a-mckinsey-who-wins"] },
        { value: "6–10%", label: "would let an agent buy fully on its own, in most US and multi-market surveys", kind: "survey", sourceIds: ["g-worldpay-2025", "g-accenture-pulse-2026"] },
      ],
      caption: "Different surveys, questions and denominators: read each figure on its own, not as a funnel.",
    },
    notes: [
      "Lead with Southeast Asia: stated willingness here is much higher than in US surveys, but it is conditional. Safeguards, transparency and reversibility are exactly what the platform has to provide.",
      "Then the global reality check: more than half of consumers use AI to research purchases; fewer than one in ten have let it complete one. Not one of the 29 agentic commerce initiatives we tracked has published evidence of repeat agent purchasing.",
      "Key line: \"The gap between 'I would' and 'I did' isn't a model problem. It's identity, payments, liability, reliability and data. That's why this is a platform conversation.\"",
    ],
  },
  {
    id: "lessons", minute: "3:30", minutes: 2, title: "What 2026 taught us",
    headline: "The first agentic checkout wave went to whoever owns the bundle, not to whoever owns the chat window, and Shopee is already playing it that way.",
    body: {
      type: "points",
      points: [
        { head: "Checkout moved back to merchants", text: "OpenAI scaled back native Instant Checkout in March 2026; Walmart reported in-chat checkout converting at about a third of the rate of click-outs (single executive account).", sourceIds: ["a-cnbc-openai-revamp", "a-wired-walmart-mirror"] },
        { head: "Shopee already keeps the transaction", text: "The Shopee app has been in ChatGPT in eight markets since June 2026, with checkout staying in Shopee; Shopee is also a launch partner for Meta's Muse agent in Singapore.", sourceIds: ["s-sea-openai-jun26", "s-meta-muse-sg"] },
        { head: "Influence is being monetized", text: "OpenAI, Google and Amazon all launched ad formats inside AI shopping answers in 2026.", sourceIds: ["a-digiday-chatgpt-ads", "a-ppc-ai-mode-ads", "a-amazon-agentic-ads"] },
        { head: "Integrated stacks moved fastest", text: "The largest claimed agentic payment volume came from an integrated commerce-and-wallet stack: Alipay reported 120M+ AI Pay transactions in one week (company claim, campaign week).", sourceIds: ["a-alipay-bw"] },
      ],
    },
    notes: [
      "This is the most important slide for Sea. The early bet was that the chat window would own commerce. 2026 showed the transaction gravitates back to whoever has identity, a wallet, merchant supply and logistics.",
      "Credit Shopee: it is already multi-homing across agent ecosystems while keeping checkout in its own app. That is the right instinct; the architecture should make it systematic.",
      "Be careful with the Alipay number: company claim from a subsidized campaign week. Direction, not proof.",
    ],
  },
  {
    id: "bundle", minute: "5:30", minutes: 2, title: "Sea already owns the bundle",
    headline: "The moat in agentic commerce is identity, permissioned data, merchant access and reliable execution. Sea holds all four.",
    body: {
      type: "bundle",
      items: [
        { need: "Demand & merchant supply", sea: "Shopee", detail: "US$39.7B GMV and 4.5B orders in Q3 2026; about 53% of Southeast Asia's platform e-commerce GMV in 2025 (Momentum Works estimate).", sourceIds: ["s-sea-q3-26-release", "s-mw-ecom-2025"] },
        { need: "Identity & accounts", sea: "ShopeePay, Monee, MariBank", detail: "Verified wallets and accounts, plus licensed digital banks in Singapore and the Philippines: the trust anchor for delegated payments.", sourceIds: ["s-fortune-maribank", "s-philstar-maribank"] },
        { need: "Credit", sea: "Monee lending", detail: "US$12.6B consumer and SME loan book (Q3 2026, up about 60%), with credit lines that can be scoped to an agent's mandate.", sourceIds: ["s-dsa-q3-26", "s-panabee-q3-26"] },
        { need: "Execution", sea: "SPX Express", detail: "Fulfilment and returns: the part of the promise an agent can't fake.", sourceIds: [] },
      ],
    },
    notes: [
      "Key line: \"Most players in this market are trying to assemble this bundle. Sea already has it. The question isn't whether to play; it's how to make the bundle agent-ready without giving away the customer.\"",
      "Name the risk with the Borders lesson: if external agents own discovery and the relationship, Shopee becomes a fulfilment backend. Keep merchant-of-record status, data and attribution with Sea.",
      "Figures are Sea's Q3 2026 results (reported 10 November) and an analyst share estimate; say 'about' for the share.",
    ],
  },
  {
    id: "planes", minute: "7:30", minutes: 3, title: "The architecture: four planes",
    headline: "Agentic commerce runs on four planes. The model is only one of them.",
    body: {
      type: "planes",
      planes: [
        { name: "Agent-readable commerce", job: "Be selectable by agents", items: ["Structured catalog & attributes", "Real-time stock, price, delivery promise", "Protocol endpoints for cart & checkout (UCP)"], handoff: "Ben · UCP" },
        { name: "Execution", job: "Complete the task reliably", items: ["APIs first", "App actions & UI automation on Android", "Retries, idempotency, order status"], handoff: "Naz · Android" },
        { name: "Trust & payments", job: "Know who acted, and why", items: ["Agent identity & gateway", "Scoped, revocable mandates (AP2)", "Real-time fraud & risk", "Consent ledger & audit trail"] },
        { name: "Intelligence & operations", job: "Make it good, safe and affordable", items: ["Gemini grounded on first-party data", "Agent runtime & registry", "Evaluation & observability", "Cost per resolved task"] },
      ],
    },
    notes: [
      "Walk top to bottom. Plane 1 is what makes Shopee visible and buyable for agents: Ben's talk. Plane 2 is how tasks get done: APIs where they exist, app actions and UI automation where they don't: Naz's talk.",
      "Planes 3 and 4 are where Monee and the cloud carry the most weight. Product names if asked: Google renamed Vertex AI the Gemini Enterprise Agent Platform in April 2026 (Agent Runtime, Agent Registry, Agent Identity, Agent Gateway); AP2 moved to the FIDO Alliance in April, and v0.2 adds human-not-present purchases under pre-authorized mandates.",
      "Key line: \"If you only invest in the model, you get a great demo. If you invest in all four planes, you get a business.\"",
    ],
    sourceIds: ["s-gcp-agent-platform-blog", "s-fido-ap2"],
  },
  {
    id: "shopee", minute: "10:30", minutes: 3, title: "Agentic commerce at Shopee",
    headline: "Three places Shopee can use agents now, each a rung higher on the delegation ladder.",
    body: {
      type: "cases",
      cases: [
        { name: "In-app shopping agent", rung: "Rungs 2–4: assist → prepare", what: "Conversational discovery, comparison and basket-building inside the Shopee app, grounded on live catalog, price and delivery data.", cloud: "Gemini grounded on catalog and behavioral data; low-latency serving through mega-sale peaks.", kpi: "Conversion and basket size vs search; repeat use after 30 days." },
        { name: "Shopee for external agents", rung: "Rung 5: supervised checkout", what: "One systematic way to serve ChatGPT, Muse and Gemini agents: catalog, stock and checkout handoff, with Shopee as merchant of record.", cloud: "Protocol endpoints, agent authentication, attribution and data return.", kpi: "Incremental orders, conversion vs app, data returned per order." },
        { name: "Seller agents", rung: "Supply side", what: "Extend Shopee's seller AI tools from listings into pricing, promotions and customer chat for the long tail.", cloud: "Multimodal generation, policy and accuracy evaluation, cost per task.", kpi: "Seller adoption, listing quality, response time, GMV per seller." },
      ],
    },
    notes: [
      "Start low-regret: the in-app agent strengthens Shopee's own destination. Then the external-agent channel on Sea's terms: Shopee is already in ChatGPT and Muse, and the MOU includes a Google agentic shopping prototype. One architecture should serve all of them.",
      "For external agents, insist on three terms: merchant of record, order and customer data returned, and attribution.",
      "Don't promise UCP availability in Southeast Asia; UCP launched with US merchants first and has expanded to Canada, Australia and the UK. Leave roadmap to Ben.",
    ],
    sourceIds: ["s-sea-openai-jun26", "s-meta-muse-sg", "s-sea-google-mou", "s-mb-shopee-seller-ai"],
  },
  {
    id: "monee", minute: "13:30", minutes: 3, title: "Agentic digital banking at Monee",
    headline: "Monee can be the trust anchor for delegated buying, and agents should make credit safer before they make it faster.",
    body: {
      type: "cases",
      cases: [
        { name: "Bounded payment mandates", rung: "Rung 6: bounded autonomy", what: "Let a shopping agent spend within caps by category, merchant and amount, revocable at any time; start with replenishment and top-ups.", cloud: "AP2-style mandates, tokenized credentials, a checkpoint before execution, audit trail.", kpi: "Repeat mandates; dispute rate vs card-not-present baseline." },
        { name: "Credit & risk agents", rung: "Human-in-the-loop", what: "Agents that assemble underwriting evidence, watch portfolio drift and draft decisions for credit officers.", cloud: "Explainable features, model-risk controls, data residency per market.", kpi: "Decision time, approval quality, NPL trend by cohort." },
        { name: "Fraud defence for agent traffic", rung: "Always on", what: "Agent-initiated payments are a new fraud surface: verify which agent acted, for whom, under which mandate.", cloud: "Agent identity verification and real-time risk scoring at peak load.", kpi: "Fraud loss rate on agent orders; false-positive rate." },
        { name: "Servicing & collections agents", rung: "Rungs 2–5", what: "Resolve servicing requests and run respectful, compliant collections conversations in local languages.", cloud: "Grounded responses, policy guardrails, evaluation.", kpi: "Resolution rate, cost per contact, complaint rate." },
      ],
    },
    notes: [
      "Context from Q3: Monee's loan book reached about US$12.6B, up about 60%, while the 90+ day NPL ratio rose to 1.3% from 1.0% in Q2. That's why credit agents should start by improving risk decisions, not just speed.",
      "Monee has already shown what AI can do here (company-reported): new underwriting models raised approvals about 10% at a similar risk level, and AI document checks cut income-verification review time about 95%.",
      "Trust: in a US survey, 39% said they'd be more comfortable if an AI agent used a familiar payment provider. Wallet brands are trusted for this job. Under the MOU, Monee is already giving feedback on AP2 for Southeast Asia's payment landscape.",
    ],
    sourceIds: ["s-dsa-q3-26", "s-mb-q2-26-call", "g-bain-2025", "s-sea-google-mou"],
  },
  {
    id: "operate", minute: "16:30", minutes: 2, title: "Operating it",
    headline: "Reliability, regulation and unit economics decide whether agents scale, not demos.",
    body: {
      type: "points",
      points: [
        { head: "Reliability is the new conversion rate", text: "Web agents still fail many real tasks; production systems narrow tasks and measure completion and error rates.", sourceIds: ["a-webarena"] },
        { head: "Regulators are already specific", text: "MAS's AI Risk Management Guidelines (Oct 2026) cover AI agents and phase in over 2027–28; its SAFR paper puts a checkpoint between an agent's decision and its execution. Vietnam is weighing a cap of about US$3,800 on AI-approved transactions.", sourceIds: ["s-mas-airm-mr", "s-ag-mas-safr", "s-tuoitre-sbv-cap"] },
        { head: "Peaks set the architecture", text: "Design for mega-sale days, not averages: latency and cost at peak determine what can run in the purchase path." },
        { head: "Pass the Webvan test", text: "Don't build autonomous checkout ahead of demonstrated demand. Start supervised, measure repeat behavior, then widen mandates." },
      ],
    },
    notes: [
      "Make evaluation concrete: every agent use case gets a test set, a completion metric and an error budget before it touches real money.",
      "On regulation, the SAFR pattern maps directly onto bounded mandates: decide, check against the mandate, then execute. Other markets have principle-based guidance too: OJK (Indonesia), Bank of Thailand, and BSP's voluntary framework in the Philippines.",
      "Economics: track cost per resolved task next to conversion; investors are already watching AI costs, so pilots should show unit economics, not just accuracy.",
    ],
  },
  {
    id: "pilots", minute: "18:30", minutes: 1, title: "Three 90-day pilots",
    headline: "Turn February's MOU into three 90-day pilots, each with a metric and a gate.",
    body: {
      type: "pilots",
      pilots: [
        { name: "Agentic shopping prototype", scope: "The MOU's Shopee × Google prototype in one market: catalog, stock and checkout handoff, with Shopee as merchant of record.", kpi: "Agent-referred orders and conversion vs app; data returned per order.", gate: "Scale if orders are incremental and data-rich." },
        { name: "AP2 payments pilot with Monee", scope: "Category- and amount-capped mandates for replenishment and top-ups, with a checkpoint before every execution and full audit.", kpi: "Repeat mandates per user; dispute and fraud rate vs card-not-present.", gate: "Widen caps only if disputes stay below baseline." },
        { name: "Credit & servicing agents", scope: "An underwriting-evidence assistant for credit officers and a servicing agent for one Monee product, both behind an evaluation harness.", kpi: "Decision time, NPL by cohort, resolution rate, cost per contact.", gate: "Expand when quality beats the human baseline at lower cost." },
      ],
    },
    notes: [
      "Propose, don't prescribe: these are starting points for the discussion slot. Pilots 1 and 2 are the two Shopee and Monee workstreams the February MOU already names; pilot 3 targets the metric investors are watching.",
    ],
    sourceIds: ["s-sea-google-mou"],
  },
  {
    id: "handoff", minute: "19:30", minutes: 0.5, title: "Handoff",
    headline: "Two paths for agents to act: the protocol and the device.",
    body: {
      type: "handoff",
      next: [
        { who: "Ben Byon", topic: "UCP update", bridge: "The protocol path: how agents discover products, build carts and check out with merchants like Shopee, and what Southeast Asia would need." },
        { who: "Naz Akbari", topic: "Android UI automation", bridge: "The device path: agents completing multi-step tasks across apps with the user's approval, through app actions or the UI." },
      ],
    },
    notes: ["Hand to Ben: \"The first plane, being selectable and buyable by agents, is where protocols come in. Ben.\""],
    sourceIds: ["s-siliconangle-ucp", "s-gulfnews-gemini-intel", "s-android-dev-intelligent-os"],
  },
];

export const DISCUSSION = [
  { q: "Which Shopee market should host the MOU's agentic shopping prototype first, and why?", why: "Balances AI assistant adoption, catalog quality and regulatory clarity." },
  { q: "What would Monee need to see before allowing bounded mandates under AP2?", why: "Sets dispute, fraud and consent thresholds up front, and the checkpoint design." },
  { q: "Which terms must every external agent accept to sell Shopee inventory?", why: "Merchant of record, data return and attribution: Shopee already keeps checkout in-app in ChatGPT; make it a standard." },
  { q: "Where is UI automation the right path, and where should we insist on APIs?", why: "Connects Naz's use cases to reliability and audit needs." },
  { q: "How should credit agents be judged, given rising NPLs in some markets?", why: "Agree that risk quality, not just approval speed, is the success metric." },
  { q: "How does this align with Sea's own AI platform plans, including Sea Cloud?", why: "Clarifies which layers Sea builds and where Google's agentic stack plugs in." },
];

export const NEXT_STEPS = [
  { step: "Pick one pilot per track and name owners on both sides", owner: "Sea + Google", when: "This week" },
  { step: "Architecture working session: catalog, mandates, evaluation", owner: "Google Cloud + Shopee and Monee engineering", when: "Within 2 weeks" },
  { step: "Agree pilot metrics, gates and review cadence", owner: "Sea product leads + Google account team", when: "Within 30 days" },
  { step: "First readout on live traffic", owner: "Joint", when: "Day 90" },
];
