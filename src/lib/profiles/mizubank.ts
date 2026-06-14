import type { CustomerProfile } from "./types";

export const MIZUBANK_PROFILE: CustomerProfile = {
  id: "mizubank",
  name: "MizuBank",
  country: "Japan",
  industry: "Banking",
  color: "#E11D48",
  gradient: "linear-gradient(135deg, #881337 0%, #E11D48 100%)",
  heroGradient:
    "linear-gradient(160deg, #1a0007 0%, #2d000e 40%, #1a0007 70%, #160006 100%)",
  tagline:
    "40 million customers. 50,000 loans a year. Zero compliance compromise.",
  savingsHeadline:
    "52% build savings. 76% customer advisory cost reduction.",
  description:
    "MizuBank processes 50,000 loan applications per year and serves 40 million customers across Japan and 40 countries. AI operates in a dual-language environment (Japanese and English) under strict FSA and Basel III compliance requirements. Tiered routing keeps routine balance inquiries on Flash-Lite while Opus handles credit decisions, elderly customer advisories, and structured finance complexity.",
  kpis: [
    { label: "Customers", value: "40M" },
    { label: "Loans / Year", value: "50K" },
    { label: "Countries", value: "40" },
    { label: "Assets", value: "$2.1T" },
  ],
  build: {
    title: "Digital Banking Platform (Legacy Replacement)",
    description:
      "Replacing COBOL-era core banking with an AI-native API layer — loan origination microservices, KYC pipeline, bilingual advisory interface, and FSA compliance monitoring. 50% of development is test suites, migration scripts, and API wrappers.",
    defaultDevs: 15,
    defaultSprints: 13,
    mix: { flashLitePct: 0.50, flashPct: 0.25, opusPct: 0.25 },
    tasks: [
      {
        title: "Generate unit tests for 55 banking API endpoints",
        tier: "flashLite",
        why: "Repetitive test scaffolding across standard REST endpoints — no design judgement needed.",
      },
      {
        title: "Write CRUD for customer address and contact management",
        tier: "flashLite",
        why: "Straightforward data-layer boilerplate following an established schema.",
      },
      {
        title: "Generate OpenAPI docs from loan origination handlers",
        tier: "flashLite",
        why: "Mechanical extraction of route signatures into spec format.",
      },
      {
        title: "Write seed data for 200 loan product configurations",
        tier: "flashLite",
        why: "Structured data generation from a known product template — no ambiguity.",
      },
      {
        title: "Add input validation to all KYC data entry forms",
        tier: "flashLite",
        why: "Pattern-based validation rules applied uniformly across form fields.",
      },
      {
        title: "Write SQL migrations for transaction history table",
        tier: "flashLite",
        why: "Structured DDL generation from an existing schema definition.",
      },
      {
        title: "Create Storybook stories for banking UI component kit",
        tier: "flashLite",
        why: "Mechanical story generation from component prop definitions.",
      },
      {
        title: "Build SWIFT MT103 message parsing adapter",
        tier: "flash",
        why: "Requires understanding of SWIFT message format specifications and field mapping logic.",
      },
      {
        title: "Scaffold bilingual customer dashboard (Japanese/English)",
        tier: "flash",
        why: "Non-trivial i18n architecture with RTL/CJK layout considerations and language-switching state.",
      },
      {
        title: "Write E2E tests for loan application state machine",
        tier: "flash",
        why: "Testing stateful multi-step workflows requires understanding of complex business rules.",
      },
      {
        title: "Implement FSA audit trail generation for all AI decisions",
        tier: "flash",
        why: "Structured audit logging with regulatory field requirements across all AI interaction types.",
      },
      {
        title:
          "Design real-time credit scoring pipeline with Basel III capital requirement awareness",
        tier: "opus",
        why: "High-stakes pipeline requiring deep understanding of regulatory capital frameworks and model risk management.",
      },
      {
        title:
          "Implement FIB (Financial Instruments and Exchange Act) compliance monitoring engine",
        tier: "opus",
        why: "Regulatory interpretation requiring domain expertise in Japanese securities law and automated surveillance.",
      },
      {
        title:
          "Architect cross-border transaction screening system for 40 jurisdictions",
        tier: "opus",
        why: "Multi-jurisdiction AML/sanctions rules engine with complex conflict-of-laws logic.",
      },
      {
        title:
          "Plan elderly customer protection advisory framework with suitable product guardrails",
        tier: "opus",
        why: "FSA suitability framework design requiring understanding of consumer protection law and behavioural finance.",
      },
    ],
  },
  run: {
    title: "Bilingual Customer Advisory AI",
    description:
      "2 million monthly queries in Japanese and English. 60% are routine account inquiries handled instantly by Flash-Lite. Investment advisories for elderly customers and complex cross-border transactions require Opus — FSA regulations mandate explainability and suitability assessment on all advisory interactions.",
    defaultQueriesPerMonth: 2000000,
    maxQueriesPerMonth: 10000000,
    queriesStepSize: 200000,
    queriesLabel: "Queries / Month",
    querySize: { inTok: 2000, outTok: 400 },
    mix: { flashLitePct: 0.60, flashPct: 0.30, opusPct: 0.10 },
    qa: [
      {
        id: "q1",
        question:
          "口座残高を教えてください。/ What is my account balance?",
        category: "routine",
        answers: {
          flashLite:
            "普通領金口座の残高は ￥2,847,320 です。最終取引：6月13日（ATM出金 ￥50,000）。 / Savings account balance: ¥2,847,320. Last transaction: June 13 (ATM withdrawal ¥50,000).",
          flash:
            "普通領金: ￥2,847,320。定期領金: ￥5,000,000 (満期: 2026年9月30日)。MizuBank Goldカード残高: ￥143,200 (支払日: 27日)。 / Savings: ¥2,847,320. Fixed deposit: ¥5,000,000 (matures Sept 30). Card balance: ¥143,200 due the 27th.",
          opus:
            "普通領金: ￥2,847,320。定期領金: ￥5,000,000 (満期: 9月30日 — あと9週間です)。MizuBank Goldカード: ￥143,200 (27日引落とし)。定期領金の満期について: 現在の金利環境では、満期後に1年定期に切り替えると現行0.45%から0.70%に金利が上がります。詳細はお申し付けいただけますか？ / Full account summary: Savings ¥2,847,320; Fixed deposit ¥5,000,000 maturing Sept 30 (9 weeks away); Card ¥143,200 due the 27th. On the maturing fixed deposit: rolling into a 1-year term at 0.70% vs the current 0.45% 6-month rate would earn you an additional ¥12,500 per ¥1M. Shall I prepare the reinvestment options?",
        },
        scores: { flashLite: 5, flash: 5, opus: 5 },
      },
      {
        id: "q2",
        question:
          "6ヶ月定期の金利を教えてください。/ What are your current 6-month fixed deposit rates?",
        category: "standard",
        answers: {
          flashLite:
            "6ヶ月定期預金の金利は年0.45%です (2026年6月現在)。 / Current 6-month fixed deposit rate: 0.45% p.a. (June 2026).",
          flash:
            "6ヶ月定期: 0.45% (￥100万未満) / 0.55% (￥100万以上)。参考：1年定期は0.70%で、同期間なら複利メリットが大きくなります。現在の日銀政策金利は0.50%です。 / 6-month rates: 0.45% (<¥1M) / 0.55% (¥1M+). Note: 1-year at 0.70% may suit your profile. BoJ policy rate is 0.50%.",
          opus:
            "6-month rate: 0.45-0.55%. However, given the BoJ signals from the June MPM meeting suggesting a possible 25bp hike in October, you may want to consider a 3-month term that rolls over after the rate decision, or a 1-year term now to lock in before potential increases. I can model both scenarios with your current deposit amount if you would like.",
        },
        scores: { flashLite: 4, flash: 5, opus: 5 },
      },
      {
        id: "q3",
        question:
          "I am 72 years old with ¥180 million in savings. My daughter is advising me to move into aggressive growth funds. What do you recommend?",
        category: "complex",
        answers: {
          flashLite:
            "I can connect you with a MizuBank wealth advisor to discuss investment options suitable for your situation. Would you like to schedule an appointment?",
          flash:
            "Thank you for trusting us with this important decision. For a 72-year-old customer with ¥180M in savings, Japanese FSA suitability guidelines strongly favour capital preservation and income generation over aggressive growth. I would recommend a consultation with our Senior Wealth Advisory team who specialise in post-retirement portfolios. In the meantime, our JGB-backed structured products currently yield 1.8-2.3% with capital guarantee — a meaningful improvement over cash without volatility risk.",
          opus:
            "I want to give you honest guidance here, not just a referral. At 72 with ¥180M, aggressive growth funds expose you to sequence-of-returns risk that could be catastrophic if markets decline in your early retirement years — a 30% drawdown at this stage takes decades to recover, and you may not have those decades. Under FSA suitability rules, I am required to flag that aggressive equity products are not suitable for your stated profile and age. What your daughter may be responding to is the real problem of cash earning 0.1% in a rising-rate environment — that is worth solving, but through capital-guaranteed structured products, JGBs, or annuities, not equity funds. I am flagging this interaction for review by your dedicated Senior Wealth Manager, Yamada-san, who will call you tomorrow. In the meantime, I can show you three FSA-suitable alternatives that address the inflation concern without the volatility risk.",
        },
        scores: { flashLite: 1, flash: 3, opus: 5 },
        sellerNote:
          "FSA suitability compliance on elderly customer advisories is where a wrong Flash answer creates regulatory exposure. Opus understands the legal obligation, gives honest advice that protects the bank and the customer, and documents the interaction properly.",
      },
      {
        id: "q4",
        question:
          "My international wire of ¥5,000,000 to a Singapore account was rejected. No reason given.",
        category: "complex",
        answers: {
          flashLite:
            "I am sorry your transfer was rejected. Please contact our International Transfers desk at 0120-xxx-xxx for assistance.",
          flash:
            "Your ¥5,000,000 wire (ref: TRF-2026-00847291) was returned by DBS Singapore on June 12 with rejection code R06 — this typically means an account name mismatch. The beneficiary name you entered was 'Tanaka Trading Pte' but DBS has the account registered as 'Tanaka Trading Pte Ltd' — the full legal entity name is required. I can re-initiate the transfer with the corrected beneficiary name. Would you like to proceed?",
          opus:
            "Transfer TRF-2026-00847291 was rejected by DBS Singapore (R06: beneficiary name mismatch). The fix is simple — 'Tanaka Trading Pte' needs to be 'Tanaka Trading Pte Ltd'. However, I also want to flag that this is your third transfer to this beneficiary in 30 days (total ¥18M). Under our AML monitoring thresholds, three transfers in 30 days to the same Singapore entity triggers a routine compliance review. This is not a block — just a documentation requirement. I have already submitted the review form on your behalf with the transfer purpose code you used last time (trade settlement). The transfer will go out today once the beneficiary name is corrected. Shall I proceed?",
        },
        scores: { flashLite: 1, flash: 4, opus: 5 },
        sellerNote:
          "Opus catches the AML threshold trigger proactively — filing the compliance review before the customer asks, turning a potential block into a smooth experience. Flash fixes the name. Opus manages the compliance context.",
      },
    ],
  },
  agent: {
    title: "Overnight Credit Portfolio Monitoring Agent",
    description:
      "Reviews 50,000 loan accounts every night — checking covenant compliance, market rate movements, collateral value changes, and early warning indicators. 11 data-pull steps on Flash; credit decision and escalation on Opus.",
    defaultVolume: 50000,
    maxVolume: 200000,
    volumeStep: 5000,
    volumeLabel: "Loan Accounts",
    runsPerDay: 1,
    executorSteps: 11,
    steps: [
      {
        id: 0,
        label: "Score loan portfolio by risk signal materiality",
        role: "planner",
        inTok: 6000,
        outTok: 2000,
      },
      {
        id: 1,
        label: "Pull overnight market rate movements (TIBOR/SOFR)",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 2,
        label: "Check collateral valuations vs LTV covenants",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 3,
        label: "Fetch borrower credit bureau updates",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 4,
        label: "Query past-due payment indicators",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 5,
        label: "Check cross-default clauses from related entities",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 6,
        label: "Pull industry sector stress indicators",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 7,
        label: "Fetch FX exposure for multi-currency loans",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 8,
        label: "Check Basel III capital consumption vs limits",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 9,
        label: "Pull ESG covenant compliance signals",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 10,
        label: "Query restructuring and forbearance flag history",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 11,
        label: "Draft watch-list additions and removals",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 12,
        label: "Approve watch-list changes and escalate to credit committee",
        role: "reviewer",
        inTok: 9000,
        outTok: 2000,
      },
    ],
  },
};
