import type { CustomerProfile } from "./types";

export const AUSRETAIL_PROFILE: CustomerProfile = {
  id: "ausretail",
  name: "AusRetail",
  country: "Australia",
  industry: "Retail",
  color: "#059669",
  gradient: "linear-gradient(135deg, #064E3B 0%, #059669 100%)",
  heroGradient: "linear-gradient(160deg, #021a10 0%, #052e16 40%, #021a10 70%, #011a0d 100%)",
  tagline: "22M loyalty members. 5M queries a month. One tiered stack.",
  savingsHeadline: "58% build savings. 78% support cost reduction.",
  description:
    "Australia\'s largest retailer runs the country\'s most-used loyalty programme. AI handles everything from weekly shop planning to supplier negotiations — but not every query needs frontier intelligence. Tiered routing puts Flash-Lite on routine loyalty lookups and Opus on the moments that drive retention.",
  kpis: [
    { label: "Loyalty Members", value: "22M" },
    { label: "Monthly AI Queries", value: "5M" },
    { label: "Store Network", value: "3,200" },
    { label: "Annual Revenue", value: "A$67B" },
  ],
  build: {
    title: "Loyalty & Store Operations Platform",
    description:
      "Building Australia\'s next-gen AI-powered loyalty engine — personalization models, store manager copilots, inventory reorder APIs, and supplier negotiation tools. 55% of development tasks are boilerplate.",
    defaultDevs: 20,
    defaultSprints: 13,
    mix: { flashLitePct: 0.55, flashPct: 0.25, opusPct: 0.20 },
    tasks: [
      {
        title: "Generate unit tests for 45 API endpoints",
        tier: "flashLite",
        why: "Repetitive scaffolding — pattern-match and emit. No reasoning required.",
      },
      {
        title: "Write CRUD for loyalty points ledger",
        tier: "flashLite",
        why: "Standard boilerplate with well-defined schema. Flash-Lite handles it in seconds.",
      },
      {
        title: "Generate OpenAPI docs from Express handlers",
        tier: "flashLite",
        why: "Mechanical extraction from existing code. No design decisions needed.",
      },
      {
        title: "Write seed data for 500 product SKUs",
        tier: "flashLite",
        why: "Volume data generation — structured repetition at scale.",
      },
      {
        title: "Add input validation to all checkout forms",
        tier: "flashLite",
        why: "Apply known validation patterns across forms. Template work.",
      },
      {
        title: "Create Storybook stories for loyalty UI kit",
        tier: "flashLite",
        why: "Component story boilerplate — copy and adapt existing patterns.",
      },
      {
        title: "Write SQL migrations for member address table",
        tier: "flashLite",
        why: "Schema changes are well-specified and mechanical to implement.",
      },
      {
        title: "Generate i18n strings for store kiosk UI",
        tier: "flashLite",
        why: "String extraction and key generation — pure mechanical work.",
      },
      {
        title: "Build product recommendation engine adapter",
        tier: "flash",
        why: "Requires understanding integration patterns and data contracts across systems.",
      },
      {
        title: "Scaffold 12 personalisation dashboard components",
        tier: "flash",
        why: "Component design requires UX reasoning and state management decisions.",
      },
      {
        title: "Write E2E tests for checkout flow with loyalty redemption",
        tier: "flash",
        why: "Complex user journey with branching state — requires test design thinking.",
      },
      {
        title: "Build supplier contract webhook integration",
        tier: "flash",
        why: "Third-party integration with error handling and retry logic design.",
      },
      {
        title: "Design ML architecture for churn prediction from basket data",
        tier: "opus",
        why: "Requires deep ML systems thinking — feature engineering, model selection, and data pipeline design from sparse behavioural signals.",
      },
      {
        title: "Implement GDPR-compliant anonymisation pipeline for loyalty analytics",
        tier: "opus",
        why: "Privacy law compliance plus data engineering — high-stakes correctness requirement.",
      },
      {
        title: "Plan real-time personalisation orchestration system",
        tier: "opus",
        why: "Distributed systems architecture at 22M member scale — latency, consistency, and cost tradeoffs all matter.",
      },
    ],
  },
  run: {
    title: "Loyalty Member Support AI",
    description:
      "5 million monthly queries from 22 million Everyday Rewards members. 65% are routine lookups — points balances, store hours, order status. Route those to Flash-Lite. Route complex complaints and retention-risk moments to Opus.",
    defaultQueriesPerMonth: 5_000_000,
    maxQueriesPerMonth: 25_000_000,
    queriesStepSize: 500_000,
    queriesLabel: "Queries / Month",
    querySize: { inTok: 2000, outTok: 400 },
    mix: { flashLitePct: 0.65, flashPct: 0.25, opusPct: 0.10 },
    qa: [
      {
        id: "q1",
        question: "How many Everyday Rewards points do I have?",
        category: "routine",
        answers: {
          flashLite:
            "You have 14,280 Everyday Rewards points — worth $14.28 off your next shop. Your points reset date is 30 September.",
          flash:
            "You have 14,280 Everyday Rewards points ($14.28 value). You\'re 720 points away from a $15 bonus redemption. Points expire 30 September 2026.",
          opus:
            "You have 14,280 points ($14.28). You\'re 720 points from the next $15 redemption tier — achievable in roughly 2 shops at your average $120 weekly spend. Your Everyday Rewards Gold tier renews automatically in October, so no action needed. Would you like to know how to boost your points this week?",
        },
        scores: { flashLite: 5, flash: 5, opus: 5 },
      },
      {
        id: "q2",
        question: "My online grocery order shows delivered but nothing arrived at my door.",
        category: "standard",
        answers: {
          flashLite:
            "I\'m sorry about your missing order. I\'ll raise a missing delivery case and a refund will be processed in 3–5 business days. Case number: OD-4827261.",
          flash:
            "Sorry to hear your order didn\'t arrive. I can see it was marked delivered at 2:14 PM to 42 Maple St. I\'ve raised urgent case OD-4827261 and flagged it to our fulfilment team. A full refund of $143.60 will appear in 2 business days. I can also rebook the order for tomorrow\'s earliest slot if that helps.",
          opus:
            "I can see your $143.60 order was scanned as delivered at 2:14 PM but our GPS data shows the driver was 380m from your address at that time — this is a known delivery exception pattern. I\'ve immediately raised escalation case OD-4827261 with our fulfilment team. A full refund is already processing (2 business days). I\'ve also flagged this driver route for review. Would you like me to rebook the order for tomorrow morning? I can apply a $15 goodwill credit for the inconvenience.",
        },
        scores: { flashLite: 3, flash: 4, opus: 5 },
        sellerNote:
          "A $143 delivery failure is a churn risk. Flash-Lite opens a case. Opus diagnoses the GPS discrepancy, processes the refund proactively, and turns the failure into a retention moment with a goodwill credit.",
      },
      {
        id: "q3",
        question: "What time does the Bondi Junction store close tonight?",
        category: "routine",
        answers: {
          flashLite:
            "The Bondi Junction Woolworths closes at 10:00 PM tonight (Sunday).",
          flash:
            "Bondi Junction closes at 10:00 PM tonight. If you\'re doing a big shop, the trolley bays fill up after 8:30 PM on Sundays — the Edgecliff store 2km away is usually quieter.",
          opus:
            "Bondi Junction closes at 10:00 PM tonight (Sunday). Worth knowing: the trolley bays fill up quickly after 8:30 PM on Sundays. The Edgecliff store 2km away closes at the same time and tends to be quieter — might be worth the short detour.",
        },
        scores: { flashLite: 5, flash: 5, opus: 5 },
      },
      {
        id: "q4",
        question:
          "I\'m a Gold tier member and I\'ve spent $4,200 this year. I\'m switching to Coles because your deli keeps running out of stock and I\'ve had three bad experiences.",
        category: "complex",
        answers: {
          flashLite:
            "I\'m sorry to hear about your experience. I\'ll pass your feedback to our store team and apply 500 bonus points as an apology.",
          flash:
            "I completely understand your frustration — stock reliability is something we take seriously. I can see you\'re a Gold member who\'s shopped with us for 4 years and spent $4,200 this year. I\'ve escalated the deli feedback to the Bondi Junction store manager. I\'d like to offer you 2,000 bonus points ($2 value) and a guaranteed stock check on your usual deli items.",
          opus:
            "I can see you\'ve been a Gold member for 4 years with $4,200 in spend — you\'re exactly the customer we want to keep. Three deli stockouts is unacceptable. I\'ve pulled your order history: you buy smallgoods every Tuesday and Thursday. Bondi Junction\'s deli has had 8 stockout complaints in the last 30 days — I\'m escalating this to our Category Manager right now. Here\'s what I can do immediately: 5,000 bonus points ($5 off your next shop), priority notification when your regular items are restocked, and a direct callback from the store manager this week. What would make this right for you?",
        },
        scores: { flashLite: 1, flash: 3, opus: 5 },
        sellerNote:
          "A Gold member threatening churn represents thousands in lifetime value. Opus knows the member\'s history, diagnoses the systemic stockout issue, and responds with specific retention actions. Flash-Lite offers 500 points and moves on.",
      },
    ],
  },
  agent: {
    title: "Overnight Store Replenishment Agent",
    description:
      "Reviews 3,200 stores every night — checking live stock levels against tomorrow\'s sales forecast, weather patterns, and promotional calendar. 10 data-pull steps on Flash; exception triage and order commit on Opus.",
    defaultVolume: 3200,
    maxVolume: 5000,
    volumeStep: 100,
    volumeLabel: "Stores / Run",
    runsPerDay: 1,
    executorSteps: 10,
    steps: [
      {
        id: 0,
        label: "Prioritise stores by forecast variance",
        role: "planner",
        inTok: 6000,
        outTok: 2000,
      },
      {
        id: 1,
        label: "Pull live stock levels vs PAR",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 2,
        label: "Fetch tomorrow\'s sales forecast",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 3,
        label: "Check promotional calendar",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 4,
        label: "Query weather impact alerts",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 5,
        label: "Check supplier lead times",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 6,
        label: "Pull competitor price signals",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 7,
        label: "Review waste and markdown history",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 8,
        label: "Check warehouse dispatch capacity",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 9,
        label: "Flag perishable risk items",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 10,
        label: "Draft preliminary reorder quantities",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 11,
        label: "Commit reorders and flag escalations",
        role: "reviewer",
        inTok: 9000,
        outTok: 2000,
      },
    ],
  },
};
