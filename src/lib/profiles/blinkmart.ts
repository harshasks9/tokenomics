import type { CustomerProfile } from "./types";

export const BLINKMART_PROFILE: CustomerProfile = {
  id: "blinkmart",
  name: "BlinkMart",
  country: "India",
  industry: "Quick Commerce",
  color: "#EA580C",
  gradient: "linear-gradient(135deg, #7C2D12 0%, #EA580C 100%)",
  heroGradient: "linear-gradient(160deg, #1a0800 0%, #2d1206 40%, #1a0800 70%, #180900 100%)",
  tagline: "2 million orders a day. 12 languages. ₹0.0003 per query.",
  savingsHeadline: "64% build savings. 80% support cost reduction.",
  description:
    "India\'s fastest-growing quick commerce platform operates 500 dark stores across 30 cities. Every rupee of AI cost matters at this scale. Tiered routing handles vernacular queries in Hindi, Tamil, Telugu, Kannada, and 8 other languages — Flash-Lite for tracking lookups, Opus for churn-risk moments.",
  kpis: [
    { label: "Orders / Day", value: "2M" },
    { label: "Dark Stores", value: "500" },
    { label: "Languages Supported", value: "12" },
    { label: "Avg Delivery", value: "9 min" },
  ],
  build: {
    title: "Dark Store Management Platform",
    description:
      "The engineering team is building BlinkMart\'s core dark store OS — slot optimization, rider allocation engine, demand prediction modules, and the hyperlocal inventory pre-positioning system. 60% of development is test harnesses, CRUD, and boilerplate.",
    defaultDevs: 12,
    defaultSprints: 13,
    mix: { flashLitePct: 0.60, flashPct: 0.25, opusPct: 0.15 },
    tasks: [
      {
        title: "Generate unit tests for 50 inventory API endpoints",
        tier: "flashLite",
        why: "Repetitive scaffolding — pattern-match and emit. No reasoning required.",
      },
      {
        title: "Write CRUD for product SKU registry",
        tier: "flashLite",
        why: "Standard boilerplate with well-defined schema. Flash-Lite handles it in seconds.",
      },
      {
        title: "Generate OpenAPI docs from warehouse handlers",
        tier: "flashLite",
        why: "Mechanical extraction from existing code. No design decisions needed.",
      },
      {
        title: "Write seed data for 300 dark store product layouts",
        tier: "flashLite",
        why: "Volume data generation — structured repetition at scale.",
      },
      {
        title: "Add Zod validation to all rider dispatch forms",
        tier: "flashLite",
        why: "Apply known validation patterns across forms. Template work.",
      },
      {
        title: "Generate i18n string keys for 12 languages in customer app",
        tier: "flashLite",
        why: "String extraction and key generation — pure mechanical work.",
      },
      {
        title: "Write SQL migrations for order status table",
        tier: "flashLite",
        why: "Schema changes are well-specified and mechanical to implement.",
      },
      {
        title: "Create Storybook stories for dark store UI kit",
        tier: "flashLite",
        why: "Component story boilerplate — copy and adapt existing patterns.",
      },
      {
        title: "Write Docker configs for local fulfilment simulation",
        tier: "flashLite",
        why: "Container configuration follows established patterns. No novel reasoning.",
      },
      {
        title: "Build rider GPS tracking adapter with real-time latency handling",
        tier: "flash",
        why: "Requires understanding real-time systems and integration patterns across data sources.",
      },
      {
        title: "Scaffold demand forecast dashboard with hyperlocal visualisations",
        tier: "flash",
        why: "Data visualisation design requires layout reasoning and state management decisions.",
      },
      {
        title: "Write E2E tests for 10-minute SLA fulfilment flow",
        tier: "flash",
        why: "Complex timing-dependent journey with branching state — requires test design thinking.",
      },
      {
        title: "Implement multi-language NLP routing logic for support triage",
        tier: "flash",
        why: "Language detection and routing across 12 scripts requires careful NLP design.",
      },
      {
        title: "Design ML architecture for hyperlocal demand pre-positioning with causal inference",
        tier: "opus",
        why: "Causal ML at hyperlocal scale — feature engineering, model selection, and data pipeline design from sparse real-time signals.",
      },
      {
        title: "Architect real-time inventory rebalancing system across 500 dark stores",
        tier: "opus",
        why: "Distributed systems architecture with sub-minute latency requirements — correctness and cost tradeoffs are high-stakes.",
      },
    ],
  },
  run: {
    title: "Vernacular Customer Support AI",
    description:
      "12 million monthly queries across 12 Indian languages. 70% are real-time order tracking requests — Flash-Lite answers instantly. Refund disputes and churn-risk moments escalate to Opus, where the wrong response means losing a daily-ordering customer.",
    defaultQueriesPerMonth: 12_000_000,
    maxQueriesPerMonth: 50_000_000,
    queriesStepSize: 1_000_000,
    queriesLabel: "Queries / Month",
    querySize: { inTok: 2000, outTok: 400 },
    mix: { flashLitePct: 0.70, flashPct: 0.20, opusPct: 0.10 },
    qa: [
      {
        id: "q1",
        question: "Mera order kahan hai? / Where is my order?",
        category: "routine",
        answers: {
          flashLite:
            "Your order #BM-4729183 is out for delivery. Rider Suresh is 1.4 km away. Estimated arrival: 6 minutes.",
          flash:
            "Order #BM-4729183 is on its way — rider Suresh left the dark store at 3:42 PM and is 1.4 km from you. Live tracking link: blnk.mt/track/4729183. ETA: 6 minutes.",
          opus:
            "Order #BM-4729183 is with rider Suresh — 1.4 km away, ETA 6 minutes. Live tracking: blnk.mt/track/4729183. If he\'s not at your door in 10 minutes, I\'ll automatically notify you and look into it.",
        },
        scores: { flashLite: 5, flash: 5, opus: 5 },
      },
      {
        id: "q2",
        question: "The tomatoes I received were soft and rotten. I want a refund.",
        category: "standard",
        answers: {
          flashLite:
            "Sorry about the tomatoes! I\'ve raised refund request RF-3918271. ₹49 will be credited to your BlinkMart wallet within 2 hours.",
          flash:
            "Completely unacceptable quality — I\'ve immediately processed a full refund of ₹49 to your wallet (RF-3918271, 2 hours). I\'ve also flagged this batch to our quality team at the Koramangala dark store. We source fresh produce daily but sometimes a batch slips through.",
          opus:
            "Refund of ₹49 processed to your wallet (RF-3918271). I\'ve flagged this to the Koramangala store — this is the 3rd complaint about tomatoes from this batch today, so I\'ve triggered a quality pull on the remaining stock. I\'ve also added 20 BlinkCoins (₹20 value) to your account as an apology. Your next order of fresh produce will be quality-checked before dispatch.",
        },
        scores: { flashLite: 4, flash: 4, opus: 5 },
      },
      {
        id: "q3",
        question:
          "Maine aapke app se roz order kiya — 3 mahine se. Aaj mera order 45 minute late hua aur koi explanation nahi. Main Zepto pe switch kar raha hoon.",
        category: "complex",
        answers: {
          flashLite:
            "I\'m sorry for the delay. I\'ve applied ₹50 off your next order. Your feedback has been noted.",
          flash:
            "I understand your frustration — a 45-minute delay with no update is not acceptable. I can see you\'ve placed 87 orders with us in the last 3 months and you\'re one of our most loyal customers. I\'ve applied ₹100 off your next order and flagged this to the Indiranagar store for an explanation. We want to keep you.",
          opus:
            "You\'ve placed 87 orders in 90 days — that\'s remarkable loyalty and I want to keep you. Here\'s what happened today: a rider breakdown at 3:22 PM caused a cascade delay across 14 orders in your zone. Our system should have sent you an update at 3:30 PM but the notification failed. I\'ve applied ₹200 credit to your account, upgraded your delivery priority to VIP for the next 30 days (guaranteed 12-minute delivery or ₹100 back), and personally flagged this notification failure to our engineering team. Your business matters to us — can I make this right?",
        },
        scores: { flashLite: 1, flash: 3, opus: 5 },
        sellerNote:
          "A daily-ordering customer threatening churn in Hindi/English mix is a high-value retention moment. Opus understands the context, diagnoses the cascade failure, and responds with specific loyalty retention actions. Flash-Lite gives ₹50 and moves on.",
      },
      {
        id: "q4",
        question: "Do you deliver to HSR Layout Sector 4 in Bangalore?",
        category: "routine",
        answers: {
          flashLite:
            "Yes! We deliver to HSR Layout Sector 4. Delivery from our HSR dark store typically takes 8–10 minutes.",
          flash:
            "Yes, we deliver to HSR Layout Sector 4 from our HSR dark store (0.8 km away). Typical delivery time is 8–10 minutes. We\'re open 6 AM–midnight.",
          opus:
            "Yes — HSR Layout Sector 4 is served by our HSR dark store, just 0.8 km away. Typical delivery is 8–10 minutes. We\'re open 6 AM–midnight. Popular in your area right now: Amul butter, fresh coriander, and Haldiram\'s snacks — in case you need a top-up.",
        },
        scores: { flashLite: 5, flash: 5, opus: 5 },
      },
    ],
  },
  agent: {
    title: "Demand Pre-Positioning Agent",
    description:
      "Runs every 30 minutes across 500 dark stores — checking hyperlocal demand signals (weather, local events, order velocity), pre-positioning high-probability SKUs, and flagging restock needs. 8 data-pull steps on Flash; inventory commit decisions on Opus.",
    defaultVolume: 500,
    maxVolume: 1000,
    volumeStep: 50,
    volumeLabel: "Dark Stores / Run",
    runsPerDay: 48,
    executorSteps: 8,
    steps: [
      {
        id: 0,
        label: "Score stores by demand volatility",
        role: "planner",
        inTok: 6000,
        outTok: 2000,
      },
      {
        id: 1,
        label: "Pull current order velocity (last 30 min)",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 2,
        label: "Check live weather and temperature",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 3,
        label: "Fetch local event calendar",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 4,
        label: "Query real-time stock levels per SKU",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 5,
        label: "Check supplier replenishment ETA",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 6,
        label: "Analyse basket composition trends",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 7,
        label: "Flag low-stock high-velocity SKUs",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 8,
        label: "Draft pre-position transfer request",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 9,
        label: "Commit transfers and raise urgent replenishment",
        role: "reviewer",
        inTok: 9000,
        outTok: 2000,
      },
    ],
  },
};
