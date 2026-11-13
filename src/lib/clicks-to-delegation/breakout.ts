/**
 * Breakout 1 · Agentic Commerce — "Cloud for Agentic Commerce & Digital Banking".
 * Talk track and slides. Evidence ids resolve in sources.json (main report) or
 * sea-sources (Sea Limited fact base, compiled 2026-11-13).
 */
import type { AgendaItem, Slide } from "./breakout-types";

export const SESSION = {
  kicker: "Breakout 1 · Agentic Commerce",
  title: "Cloud for agentic commerce & digital banking",
  dek: "What has to be true underneath Shopee and Monee's AI vision, and where Google Cloud fits between the vision, the protocol and the device.",
  talk: "Cloud for Agentic Commerce & Digital Banking",
  speaker: "Harsha Konduri",
};

export const AGENDA: AgendaItem[] = [
  { minutes: 20, title: "Shopee & Monee AI Vision", speaker: "Chris Feng", role: "President, Sea Limited", link: "Sets the ambition: what Sea wants AI to do for buyers, sellers and borrowers." },
  { minutes: 20, title: "Cloud for Agentic Commerce & Digital Banking", speaker: "Harsha Konduri", mine: true, link: "What has to be true underneath that vision: the four planes, the use cases and three pilots." },
  { minutes: 20, title: "UCP Update", speaker: "Ben Byon", link: "The protocol layer: how agents discover, cart and check out with merchants like Shopee." },
  { minutes: 20, title: "Android UI Automation & Use Cases", speaker: "Naz Akbari", link: "The device layer: agents operating apps where no API exists." },
  { minutes: 10, title: "Discussion & Next Steps", speaker: "All", link: "Pick pilots, owners and dates." },
];

export const SLIDES: Slide[] = [
  {
    id: "title", minute: "0:00", minutes: 1, title: "Title",
    headline: "Cloud for agentic commerce & digital banking",
    body: { type: "title", kicker: "Breakout 1 · Agentic Commerce", title: "Cloud for agentic commerce & digital banking", subtitle: "What has to be true underneath Shopee and Monee's AI vision." },
    notes: [
      "Thank Chris. Bridge: \"You just heard what Shopee and Monee want AI to do for buyers, sellers and borrowers. My job in the next twenty minutes is the part underneath: what has to be true in the platform for that vision to work at Sea's scale, safely.\"",
      "Set up the next two talks: Ben will go deep on the protocol, Naz on the device. I'll cover the architecture that connects them and propose three pilots.",
    ],
  },
  {
    id: "market", minute: "1:00", minutes: 2.5, title: "Where the market really is",
    headline: "Research with AI is mainstream; letting AI buy is not, yet. The gap is trust and execution, and those are infrastructure problems.",
    body: {
      type: "stats",
      stats: [
        { value: "53%", label: "of consumers in 11 markets used AI for shopping in the past three months (June 2026)", kind: "survey", sourceIds: ["a-mckinsey-who-wins"] },
        { value: "~9%", label: "completed a purchase through AI (about 1 in 7 AI shoppers)", kind: "survey", sourceIds: ["a-mckinsey-who-wins"] },
        { value: "6–10%", label: "would let an agent buy fully on its own, in most surveys", kind: "survey", sourceIds: ["g-worldpay-2025", "g-accenture-pulse-2026"] },
        { value: "0 of 29", label: "agentic commerce initiatives have published evidence of repeat agent purchasing", kind: "expert-judgment", sourceIds: [] },
      ],
      caption: "Different surveys and denominators; read each figure on its own, not as a funnel.",
    },
    notes: [
      "Lead with the gap, not the hype. Over half of consumers already use AI to research purchases; fewer than one in ten have let it complete one, and only single digits would let it buy alone.",
      "Key line: \"That gap is not a model problem. It's identity, payments, liability, reliability and data — which is to say, it's infrastructure. That's why this is a cloud conversation.\"",
      "If asked about SEA specifically: the multi-market surveys don't break out SEA countries; we can bring Sea's own funnel data to the pilots.",
    ],
  },
  {
    id: "lessons", minute: "3:30", minutes: 2, title: "What 2026 taught us",
    headline: "The first agentic checkout wave went to whoever owns the bundle, not to whoever owns the chat window.",
    body: {
      type: "points",
      points: [
        { head: "Checkout moved back to merchants", text: "OpenAI scaled back native Instant Checkout in March 2026; purchases now complete on merchant sites and apps.", sourceIds: ["a-cnbc-openai-revamp", "a-forrester-pullback"] },
        { head: "Owned checkout converted better", text: "Walmart reported in-chat checkout converting at about a third of the rate of click-outs to its own site (single executive account).", sourceIds: ["a-wired-walmart-mirror"] },
        { head: "Influence is being monetized", text: "OpenAI, Google and Amazon all launched ad formats inside AI shopping answers in 2026.", sourceIds: ["a-digiday-chatgpt-ads", "a-ppc-ai-mode-ads", "a-amazon-agentic-ads"] },
        { head: "Integrated stacks moved fastest", text: "The largest claimed agentic payment volume came from an integrated commerce-and-wallet stack: Alipay reported 120M+ AI Pay transactions in one week (company claim, campaign week).", sourceIds: ["a-alipay-bw"] },
      ],
    },
    notes: [
      "This is the most important slide for Sea. The early bet was that the chat window would own commerce. 2026 showed the transaction gravitates back to whoever has identity, a wallet, merchant supply and logistics.",
      "Be careful with the Alipay number: it's a company claim from a subsidized campaign week. Use it as direction, not proof.",
    ],
  },
  {
    id: "bundle", minute: "5:30", minutes: 2, title: "Sea already owns the bundle",
    headline: "The moat in agentic commerce is identity, permissioned data, merchant access and reliable execution. Sea holds all four.",
    body: {
      type: "bundle",
      items: [
        { need: "Demand & merchant supply", sea: "Shopee", detail: "Marketplace catalog, buyers and sellers across Southeast Asia and Brazil.", sourceIds: [] },
        { need: "Identity & wallet", sea: "ShopeePay / Monee", detail: "Verified accounts and a stored-value wallet: the trust anchor for delegated payments.", sourceIds: [] },
        { need: "Credit", sea: "SPayLater & Monee loans", detail: "Underwriting data and credit lines that can be scoped to an agent's mandate.", sourceIds: [] },
        { need: "Execution", sea: "SPX Express", detail: "Fulfilment and returns: what an agent actually needs to keep its promise.", sourceIds: [] },
      ],
    },
    notes: [
      "Key line: \"Most players in this market are trying to assemble this bundle. Sea already has it. The question isn't whether to play — it's how to make the bundle agent-ready without giving away the customer.\"",
      "Name the risk: the Borders lesson. If external agents own discovery and the relationship, Shopee becomes a fulfilment backend. The architecture should keep merchant-of-record status, data and attribution with Sea.",
    ],
  },
  {
    id: "planes", minute: "7:30", minutes: 3, title: "The architecture: four planes",
    headline: "Agentic commerce runs on four planes. The model is only one of them.",
    body: {
      type: "planes",
      planes: [
        { name: "Agent-readable commerce", job: "Be selectable by agents", items: ["Structured catalog & attributes", "Real-time stock, price, delivery promise", "Protocol endpoints for cart & checkout"], handoff: "Ben · UCP" },
        { name: "Execution", job: "Complete the task reliably", items: ["APIs first", "UI automation where no API exists", "Retries, idempotency, order status"], handoff: "Naz · Android" },
        { name: "Trust & payments", job: "Know who acted, and why", items: ["Agent identity & verification", "Scoped, revocable payment mandates", "Real-time fraud & risk", "Consent ledger & audit trail"] },
        { name: "Intelligence & operations", job: "Make it good, safe and affordable", items: ["Gemini grounded on first-party data", "Agent runtime & tools", "Evaluation & observability", "Cost per resolved task"] },
      ],
    },
    notes: [
      "Walk top to bottom. Plane 1 is what makes Shopee visible to agents — that's Ben's talk. Plane 2 is how tasks actually get done: APIs where they exist, UI automation where they don't — that's Naz's talk.",
      "Planes 3 and 4 are where Monee and the cloud carry the most weight: identity, mandates, fraud, audit; then grounding, evaluation and cost.",
      "Key line: \"If you only invest in the model, you get a great demo. If you invest in all four planes, you get a business.\"",
    ],
  },
  {
    id: "shopee", minute: "10:30", minutes: 3, title: "Agentic commerce at Shopee",
    headline: "Three places Shopee can use agents now, each a rung higher on the delegation ladder.",
    body: {
      type: "cases",
      cases: [
        { name: "In-app shopping agent", rung: "Rungs 2–4: assist → prepare", what: "Conversational discovery, comparison and basket-building inside the Shopee app, grounded on live catalog, price and delivery data.", cloud: "Gemini grounded on catalog & behavioral data; low-latency serving through 11.11 and 12.12 peaks.", kpi: "Conversion and AOV vs search; repeat use after 30 days." },
        { name: "Shopee as a merchant to external agents", rung: "Rung 5: supervised checkout", what: "Expose catalog and checkout to external assistants through protocol endpoints, keeping Shopee as merchant of record.", cloud: "Protocol endpoints, agent authentication, attribution and data return.", kpi: "Incremental orders, conversion vs app, data returned per order." },
        { name: "Seller agents", rung: "Supply side", what: "Listing generation, pricing suggestions, chat replies and promotions for millions of sellers.", cloud: "Multimodal generation, evaluation for policy and accuracy, cost per task.", kpi: "Seller adoption, listing quality, response time, GMV per seller." },
      ],
    },
    notes: [
      "Start with what is low-regret: the in-app agent strengthens Shopee's own destination. Then the external-agent channel, on Sea's terms. Then sellers, where agents remove real work for the long tail (the Shopify lesson: make a capability available to every merchant at once).",
      "For external agents, insist on three contract terms: merchant of record, order and customer data returned, and attribution.",
    ],
  },
  {
    id: "monee", minute: "13:30", minutes: 3, title: "Agentic digital banking at Monee",
    headline: "Shoppers trust payment brands more than AI brands, which makes Monee the natural trust anchor for delegated buying.",
    body: {
      type: "cases",
      cases: [
        { name: "Bounded payment mandates", rung: "Rung 6: bounded autonomy", what: "Let a shopping agent spend within caps by category, merchant and amount, revocable at any time, starting with replenishment and top-ups.", cloud: "Tokenized, scoped credentials; mandate store; step-up authentication; audit trail.", kpi: "Repeat mandates, dispute rate vs card-not-present baseline." },
        { name: "Risk & credit agents", rung: "Human-in-the-loop", what: "Agents that assemble underwriting evidence, monitor portfolios and draft decisions for credit officers.", cloud: "Explainable features, model-risk controls, data residency per market.", kpi: "Decision time, approval quality, NPL trend." },
        { name: "Fraud defence for agent traffic", rung: "Always on", what: "Agent-initiated transactions are a new fraud surface: verify which agent acted, for whom, under which mandate.", cloud: "Agent identity verification, real-time risk scoring at peak load.", kpi: "Fraud loss rate on agent orders; false-positive rate." },
        { name: "Servicing & collections agents", rung: "Rungs 2–5", what: "Resolve servicing requests and run respectful, compliant collections conversations.", cloud: "Grounded responses, policy guardrails, evaluation, multilingual support.", kpi: "Resolution rate, cost per contact, complaint rate." },
      ],
    },
    notes: [
      "Key evidence: in one US survey, 39% said they'd be more comfortable if an AI agent used a familiar payment provider; only 16% said the same of their bank or card issuer. Wallet brands are trusted for this job.",
      "Frame regulation as a design input: every agent action in banking needs a who-authorized-what record and human oversight for credit decisions.",
    ],
    sourceIds: ["g-bain-2025"],
  },
  {
    id: "operate", minute: "16:30", minutes: 2, title: "Operating it",
    headline: "Reliability, regulation and unit economics decide whether agents scale, not demos.",
    body: {
      type: "points",
      points: [
        { head: "Reliability is the new conversion rate", text: "Web agents still fail many real tasks; production systems narrow tasks and measure completion and error rates.", sourceIds: ["a-webarena"] },
        { head: "Regulation is a design input", text: "Data residency per market, model-risk management and human oversight for credit; audit every agent action." },
        { head: "Peaks set the architecture", text: "Design for mega-sale days, not averages: latency and cost at peak determine what can run in the purchase path." },
        { head: "Pass the Webvan test", text: "Don't build autonomous checkout ahead of demonstrated demand. Start supervised, measure repeat behavior, then widen mandates." },
      ],
    },
    notes: [
      "Make the evaluation point concrete: every agent use case gets a test set, a completion metric and an error budget before it touches real money.",
      "Economics: track cost per resolved task alongside conversion; agents that are accurate but expensive won't survive a mega-sale.",
    ],
  },
  {
    id: "pilots", minute: "18:30", minutes: 1, title: "Three 90-day pilots",
    headline: "Three pilots, each with a metric and a gate, so we learn on real traffic without betting the platform.",
    body: {
      type: "pilots",
      pilots: [
        { name: "Agent-ready Shopee in one market", scope: "Expose catalog, stock and checkout to agents through protocol endpoints; keep Shopee as merchant of record.", kpi: "Agent-referred orders and conversion vs app; data returned per order.", gate: "Scale if orders are incremental and data-rich." },
        { name: "Monee bounded mandates", scope: "Category- and amount-capped mandates for replenishment and top-ups, with full audit.", kpi: "Repeat mandates per user; dispute and fraud rate vs card-not-present.", gate: "Widen caps only if disputes stay below baseline." },
        { name: "Seller & servicing agents", scope: "Listing and chat agents for a seller cohort; servicing agent for one Monee product.", kpi: "Resolution rate, cost per task, seller adoption.", gate: "Expand when quality beats human baseline at lower cost." },
      ],
    },
    notes: [
      "Propose, don't prescribe: these are starting points for the discussion slot. Each has an owner on both sides and a go/no-go gate.",
    ],
  },
  {
    id: "handoff", minute: "19:30", minutes: 0.5, title: "Handoff",
    headline: "Two paths for agents to act: the protocol and the device.",
    body: {
      type: "handoff",
      next: [
        { who: "Ben Byon", topic: "UCP update", bridge: "The API path: how agents discover products, build carts and check out with merchants like Shopee." },
        { who: "Naz Akbari", topic: "Android UI automation", bridge: "The device path: how agents operate apps where no API exists, and where that's the right choice." },
      ],
    },
    notes: ["Hand to Ben: \"The first plane — being selectable and buyable by agents — is where protocols come in. Ben.\""],
  },
];

export const DISCUSSION = [
  { q: "Which Shopee market should go agent-ready first, and why?", why: "Balances agent-assistant adoption, catalog quality and regulatory clarity." },
  { q: "What would Monee need to see before allowing bounded mandates?", why: "Defines the dispute, fraud and consent thresholds up front." },
  { q: "Which terms must any external agent accept to sell Shopee inventory?", why: "Merchant of record, data return and attribution: the Borders test." },
  { q: "Where is UI automation the right path, and where should we insist on APIs?", why: "Connects Naz's use cases to reliability and audit needs." },
  { q: "What does success look like by the next quarterly review?", why: "Agree the metrics and gates for each pilot." },
];

export const NEXT_STEPS = [
  { step: "Pick one pilot per track and name owners on both sides", owner: "Sea + Google", when: "This week" },
  { step: "Data and architecture working session (catalog, mandates, evaluation)", owner: "Google Cloud + Shopee/Monee engineering", when: "Within 2 weeks" },
  { step: "Agree pilot metrics, gates and review cadence", owner: "Sea product leads + Google account team", when: "Within 30 days" },
  { step: "First readout on live traffic", owner: "Joint", when: "Day 90" },
];
