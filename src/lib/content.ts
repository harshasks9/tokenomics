// ============================
// S1 — SDLC Tasks (Kanban board content)
// ============================

export interface S1Task {
  title: string;
  tier: 'opus' | 'flash';
  why: string;
}

export const S1_TASKS: S1Task[] = [
  // Opus-required (complex / architecture / reasoning)
  { title: "Design RAG architecture for fund-prospectus search", tier: "opus", why: "Requires deep architectural reasoning across multiple retrieval strategies and embedding approaches" },
  { title: "Write compliance rules engine for SEC 17a-4", tier: "opus", why: "Complex regulatory interpretation requiring nuanced legal reasoning and edge-case handling" },
  { title: "Debug portfolio dashboard state race condition", tier: "opus", why: "Concurrency bug requiring deep analysis of async state transitions and timing" },
  { title: "Design multi-account aggregation schema", tier: "opus", why: "Complex data modeling requiring understanding of financial entity relationships and tax lots" },
  { title: "Plan agent orchestration graph for rebalancing", tier: "opus", why: "Architectural planning of multi-step agent pipeline with error handling and rollback" },
  // Flash-appropriate (routine / boilerplate / well-defined)
  { title: "Generate unit tests for 40 API endpoints", tier: "flash", why: "Repetitive test generation from clear API specs — pattern-based, well-defined output" },
  { title: "Scaffold 15 React components from Figma spec", tier: "flash", why: "Translating visual specs to component boilerplate — mechanical, pattern-following work" },
  { title: "Write CRUD for client profiles", tier: "flash", why: "Standard database operations following established ORM patterns" },
  { title: "Generate OpenAPI docs from route handlers", tier: "flash", why: "Extracting types and descriptions from existing code — pure documentation" },
  { title: "Write CSV statement import transforms", tier: "flash", why: "Straightforward data parsing and mapping with clear input/output schemas" },
  { title: "Add input validation to all form fields", tier: "flash", why: "Repetitive Zod/Yup schema generation from TypeScript types" },
  { title: "Write seed/fixture data for 12 account types", tier: "flash", why: "Generating realistic test data — creative but not complex" },
  { title: "Create Storybook stories for UI components", tier: "flash", why: "Boilerplate generation from existing component props — entirely mechanical" },
  { title: "Write SQL migration for positions table", tier: "flash", why: "Standard DDL from a clear schema definition" },
  { title: "Add error boundary wrappers to all routes", tier: "flash", why: "Repetitive wrapper pattern application across files" },
  { title: "Generate i18n string keys for settings pages", tier: "flash", why: "Mechanical extraction and mapping of UI strings" },
  { title: "Write Dockerfile and docker-compose for local dev", tier: "flash", why: "Standard container configuration from well-known patterns" },
  { title: "Add TypeScript strict-mode fixes to utils/", tier: "flash", why: "Mechanical type narrowing and assertion additions" },
  { title: "Write E2E test flows for onboarding wizard", tier: "flash", why: "Step-by-step UI interaction tests from clear user flows" },
  { title: "Convert REST endpoints to tRPC procedures", tier: "flash", why: "Mechanical migration following established tRPC patterns" },
];

// ============================
// S2 — In-App Q&A Pairs
// ============================

export interface S2QAPair {
  id: string;
  question: string;
  category: 'routine' | 'faq' | 'complex';
  flashAnswer: string;
  opusAnswer: string;
  scores: {
    flash: { accuracy: number; tone: number; completeness: number };
    opus: { accuracy: number; tone: number; completeness: number };
  };
}

export const S2_QA_PAIRS: S2QAPair[] = [
  {
    id: 'q1',
    category: 'routine',
    question: "What's my current allocation?",
    flashAnswer: "Your portfolio is currently allocated as follows:\n\n• **US Equities**: 48.2% ($482,000)\n• **International Equities**: 18.5% ($185,000)\n• **Fixed Income**: 22.3% ($223,000)\n• **Alternatives**: 7.1% ($71,000)\n• **Cash & Equivalents**: 3.9% ($39,000)\n\nYour total portfolio value is **$1,000,000** as of market close yesterday.",
    opusAnswer: "Your portfolio is currently allocated as follows:\n\n• **US Equities**: 48.2% ($482,000)\n• **International Equities**: 18.5% ($185,000)\n• **Fixed Income**: 22.3% ($223,000)\n• **Alternatives**: 7.1% ($71,000)\n• **Cash & Equivalents**: 3.9% ($39,000)\n\nYour total portfolio value is **$1,000,000** as of yesterday's close.",
    scores: { flash: { accuracy: 5, tone: 5, completeness: 5 }, opus: { accuracy: 5, tone: 5, completeness: 5 } },
  },
  {
    id: 'q2',
    category: 'routine',
    question: "How exposed am I to tech stocks?",
    flashAnswer: "Your tech exposure across all holdings:\n\n• **Direct tech equities**: 22.4% of portfolio ($224,000)\n• **Tech via index funds**: ~8.1% additional ($81,000)\n• **Total effective tech exposure**: ~30.5%\n\nTop holdings: AAPL (4.2%), MSFT (3.8%), NVDA (2.9%), GOOGL (2.1%).\n\nThis is slightly above the S&P 500 tech weighting of ~29%.",
    opusAnswer: "Your technology sector exposure totals approximately **30.5%** of your portfolio:\n\n• **Direct equities**: 22.4% ($224,000) — AAPL, MSFT, NVDA, GOOGL, META\n• **Indirect via index funds**: ~8.1% ($81,000)\n\nKey holdings: AAPL (4.2%), MSFT (3.8%), NVDA (2.9%), GOOGL (2.1%).\n\nThis is modestly above the S&P 500 benchmark tech weight of ~29%.",
    scores: { flash: { accuracy: 5, tone: 5, completeness: 5 }, opus: { accuracy: 5, tone: 5, completeness: 5 } },
  },
  {
    id: 'q3',
    category: 'faq',
    question: "What's an expense ratio?",
    flashAnswer: "An **expense ratio** is the annual fee a fund charges to cover its operating costs — management fees, administrative costs, and compliance. It's expressed as a percentage of your investment.\n\nFor example, a 0.20% expense ratio on a $100,000 investment means you pay $200/year. This is deducted from the fund's returns, not billed separately.\n\nYour portfolio's weighted average expense ratio is **0.18%**, which is well below the industry average of ~0.50%.",
    opusAnswer: "An **expense ratio** is the annual percentage fee charged by a mutual fund or ETF. It covers management, administration, and operating costs.\n\n**Example**: A 0.20% expense ratio on $100,000 = $200/year in fees, deducted from returns.\n\nYour portfolio's weighted average expense ratio is **0.18%** — competitive and below the ~0.50% industry average.",
    scores: { flash: { accuracy: 5, tone: 5, completeness: 5 }, opus: { accuracy: 5, tone: 5, completeness: 5 } },
  },
  {
    id: 'q4',
    category: 'faq',
    question: "What does net expense ratio vs gross expense ratio mean?",
    flashAnswer: "**Gross expense ratio** is the total cost of running a fund before any fee waivers. **Net expense ratio** is what you actually pay after the fund company waives or reimburses some fees.\n\nAlways look at the **net** ratio — that's your real cost. But note that waivers can expire, so check the prospectus for the waiver end date.\n\nYour funds currently show gross: 0.24%, net: 0.18%.",
    opusAnswer: "**Gross expense ratio** = total operating costs before any fee waivers or reimbursements.\n**Net expense ratio** = your actual cost after waivers are applied.\n\nThe net ratio is what matters for your returns. However, waivers are contractual and can expire — always check the prospectus for the commitment period.\n\nAcross your holdings: gross averages 0.24%, net 0.18%. The 6bps difference is from fee waivers on your VXUS and BND positions.",
    scores: { flash: { accuracy: 5, tone: 4, completeness: 4 }, opus: { accuracy: 5, tone: 5, completeness: 5 } },
  },
  {
    id: 'q5',
    category: 'complex',
    question: "Model what happens if I retire 5 years early at 60 instead of 65.",
    flashAnswer: "Early retirement at 60 would mean:\n\n• **5 fewer years of contributions**: ~$150,000 less in savings\n• **5 more years of withdrawals**: ~$300,000 additional spend\n• **Portfolio impact**: Projected value at 90 drops from $1.2M to ~$680K\n• **Social Security**: Reduced benefit (~25% less at 62 vs 67)\n\nYou'd need to bridge 5 years before Medicare at 65. Consider a spending reduction of ~15% or a bridge strategy.",
    opusAnswer: "Here's a detailed early-retirement scenario analysis:\n\n**Accumulation Gap (age 60–65)**\n• Lost contributions: $30K/yr × 5 = $150K principal\n• Lost compounding: ~$47K at 7% avg return\n• Total opportunity cost: **~$197K**\n\n**Distribution Impact**\n• 5 additional withdrawal years: ~$300K (at $60K/yr)\n• Portfolio at 90: drops from **$1.2M → ~$620K** (48% lower cushion)\n• Probability of not outliving assets drops from 94% → 78%\n\n**Healthcare Bridge (60–65)**\n• ACA marketplace: ~$12K–$18K/yr for couple\n• 5-year cost: **$60K–$90K** (not in current projection)\n\n**Social Security Timing**\n• Filing at 62: ~$2,180/mo (25% permanent reduction vs 67)\n• Filing at 67: ~$2,900/mo\n• Breakeven age: ~80. Given family longevity, delaying may be optimal.\n\n**Recommendation**: Achievable with adjustments — reduce spending to $52K/yr, maintain 60/40 allocation, delay Social Security to 67, and budget $15K/yr for healthcare bridge. This brings success probability back to ~89%.",
    scores: { flash: { accuracy: 3, tone: 3, completeness: 2 }, opus: { accuracy: 5, tone: 5, completeness: 5 } },
  },
  {
    id: 'q6',
    category: 'complex',
    question: "Should I rebalance given current rate expectations and my tax situation?",
    flashAnswer: "Based on current conditions:\n\n• Your allocation has drifted: equities at 66% vs 60% target\n• With rates expected to decline, fixed income could appreciate\n• Rebalancing back to target would lock in equity gains\n\nConsider rebalancing in your IRA first to avoid taxable events. In taxable accounts, use new contributions to rebalance passively.",
    opusAnswer: "Let me analyze this across three dimensions:\n\n**1. Drift Analysis**\nYour equity allocation has drifted to 66.7% vs your 60% target — a 6.7% overshoot, triggered by the recent equity rally. Your fixed income is underweight by 4.3%.\n\n**2. Rate Environment Overlay**\nThe Fed's dot plot implies 75–100bps of cuts through 2027. This creates a tactical case for fixed income:\n• Duration play: Your BND position (duration ~6.2yr) would gain ~4.3% on a 75bp cut\n• Credit spreads are tight — favor Treasuries over corporate for new allocations\n• Suggestion: Tilt rebalance toward intermediate Treasuries (VGIT) rather than broad bond (BND)\n\n**3. Tax-Efficient Execution**\nYour taxable account has $42K in unrealized long-term gains on VTI.\n• **Tax cost of selling**: ~$6,300 at 15% LTCG rate\n• **Alternative**: Rebalance within your IRA ($380K) by selling equity funds and buying bond funds — zero tax impact\n• **Shortfall**: IRA rebalance alone closes ~60% of the drift. Cover the rest by directing next 3 months of contributions to fixed income in taxable.\n• **Tax-loss harvest**: Your VXUS position has a $3,200 loss — harvest it now and replace with IXUS (similar but not substantially identical) to offset other gains.\n\n**Net recommendation**: Rebalance in IRA immediately, harvest the VXUS loss in taxable, and steer contributions. Full target restored in ~3 months with minimal tax friction.",
    scores: { flash: { accuracy: 3, tone: 3, completeness: 2 }, opus: { accuracy: 5, tone: 5, completeness: 5 } },
  },
];

// ============================
// S3 — Synthetic Statements
// ============================

export interface StatementEntry {
  security: string;
  ticker: string;
  lastMonth: { shares: number; price: number; value: number };
  thisMonth: { shares: number; price: number; value: number };
  change: number;
  changePct: number;
}

export interface S3Statement {
  id: string;
  title: string;
  period: string;
  entries: StatementEntry[];
  summary: string;
}

export const S3_STATEMENTS: S3Statement[] = [
  {
    id: 'stmt1',
    title: "Brokerage Account ••••4521",
    period: "Apr 2026 → May 2026",
    entries: [
      { security: "Vanguard Total Stock Market ETF", ticker: "VTI", lastMonth: { shares: 120, price: 268.40, value: 32208 }, thisMonth: { shares: 120, price: 275.10, value: 33012 }, change: 804, changePct: 2.5 },
      { security: "iShares Core US Aggregate Bond", ticker: "AGG", lastMonth: { shares: 200, price: 98.20, value: 19640 }, thisMonth: { shares: 200, price: 99.10, value: 19820 }, change: 180, changePct: 0.9 },
      { security: "Vanguard Total Intl Stock ETF", ticker: "VXUS", lastMonth: { shares: 300, price: 58.90, value: 17670 }, thisMonth: { shares: 350, price: 60.20, value: 21070 }, change: 3400, changePct: 19.2 },
      { security: "NVIDIA Corporation", ticker: "NVDA", lastMonth: { shares: 40, price: 182.50, value: 7300 }, thisMonth: { shares: 40, price: 195.30, value: 7812 }, change: 512, changePct: 7.0 },
      { security: "Cash & Equivalents", ticker: "CASH", lastMonth: { shares: 1, price: 15200, value: 15200 }, thisMonth: { shares: 1, price: 8200, value: 8200 }, change: -7000, changePct: -46.1 },
    ],
    summary: "Total portfolio up $4,896 (+5.3%). Notable: 50 shares of VXUS purchased, cash deployed into international equities. NVDA up 7% on earnings beat."
  },
  {
    id: 'stmt2',
    title: "IRA Account ••••8832",
    period: "Apr 2026 → May 2026",
    entries: [
      { security: "Vanguard Target Retirement 2050", ticker: "VFIFX", lastMonth: { shares: 1500, price: 52.80, value: 79200 }, thisMonth: { shares: 1500, price: 54.10, value: 81150 }, change: 1950, changePct: 2.5 },
      { security: "Schwab US REIT ETF", ticker: "SCHH", lastMonth: { shares: 400, price: 21.50, value: 8600 }, thisMonth: { shares: 400, price: 20.80, value: 8320 }, change: -280, changePct: -3.3 },
      { security: "iShares TIPS Bond ETF", ticker: "TIP", lastMonth: { shares: 100, price: 107.40, value: 10740 }, thisMonth: { shares: 100, price: 108.20, value: 10820 }, change: 80, changePct: 0.7 },
    ],
    summary: "IRA up $1,750 (+1.8%). REITs pulled back on rate concerns. Target date fund steady. No contributions this period."
  },
];

// ============================
// S4 — Agent Trace Nodes
// ============================

export interface AgentNode {
  id: number;
  label: string;
  tier: 'opus' | 'flash';
  role: 'planner' | 'executor' | 'reviewer';
  inTok: number;
  outTok: number;
}

export const S4_TRACE: AgentNode[] = [
  { id: 0,  label: "Decompose rebalancing task",       tier: "opus",  role: "planner",  inTok: 5000, outTok: 2000 },
  { id: 1,  label: "Pull portfolio holdings",          tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 2,  label: "Fetch current market prices",      tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 3,  label: "Calculate allocation drift",       tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 4,  label: "Search fund news & alerts",        tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 5,  label: "Evaluate tax lot implications",    tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 6,  label: "Check wash sale constraints",      tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 7,  label: "Compute optimal trade list",       tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 8,  label: "Validate against risk limits",     tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 9,  label: "Check sector concentration",       tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 10, label: "Verify liquidity requirements",    tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 11, label: "Generate trade rationale",         tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 12, label: "Format client notification",       tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 13, label: "Prepare audit trail entry",        tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 14, label: "Compile performance attribution",  tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 15, label: "Draft rebalancing summary",        tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 16, label: "Stage orders for execution",       tier: "flash", role: "executor", inTok: 4000, outTok: 1000 },
  { id: 17, label: "Compliance review & final sign-off", tier: "opus", role: "reviewer", inTok: 8000, outTok: 1500 },
];

// ============================
// Seller Notes
// ============================

export const SELLER_NOTES = {
  s1: {
    title: "Build Phase — AI-Assisted Development",
    note: "We assume a 75/25 routine-to-complex task split based on empirical data from enterprise dev teams. Routine tasks (tests, scaffolding, docs) are well-served by Flash at 1/3 the cost. Only architecture, compliance, and hard debugging justify frontier reasoning. Adjust the mix slider for the customer's actual codebase.",
    oneLiner: "Your engineering team doesn't need a $25/M-output model to write unit tests.",
  },
  s2: {
    title: "Run Phase — In-App Client Intelligence",
    note: "The 60/20/20 routing split (Flash-Lite / Flash / Opus) reflects typical wealth management query patterns: most questions are lookups or FAQs. The demo honestly shows that complex financial planning questions produce visibly better answers from Opus — this is why 20% still routes to frontier. Volume is the lever: at 5M queries/month, the savings are massive.",
    oneLiner: "Sixty percent of your client queries are lookups. They don't need a PhD to answer them.",
  },
  s3: {
    title: "Run Phase — Multimodal Document Intelligence",
    note: "Gemini's native multimodal capability eliminates separate OCR/vision preprocessing. The hybrid approach uses Flash for visual parsing and Opus for financial reasoning — matching pure-Claude quality at ~30% lower cost and latency. The voice variant exposes Claude's lack of native audio I/O, which requires separate STT/TTS services.",
    oneLiner: "Flash sees the document; Opus thinks about it. Best of both worlds.",
  },
  s4: {
    title: "Extend Phase — Agentic Orchestration at Scale",
    note: "A rebalancing agent needs frontier reasoning only for planning and compliance review (2 of 18 steps). The 16 executor steps are data retrieval, calculation, and formatting — Flash handles these identically at 1/3 the cost. At 50K portfolios nightly, the executor volume dominates total cost, making tiering transformative (~55% savings).",
    oneLiner: "The planner thinks with Opus. The executors run with Flash. You save eight million a year.",
  },
};
