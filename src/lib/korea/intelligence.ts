// Executive customer intelligence for Global Sae-A (글로벌세아).
// Prepared for the Harsha Konduri / Global Sae-A executive session, 28 July 2026,
// and the Google-led AX Workshop on 14 August 2026.
//
// Sourcing convention used throughout this microsite:
//   "evidence"   — publicly reported or stated in the account team's briefing document
//   "hypothesis" — an inference by the Google Cloud strategy team, to be validated on 14 Aug
// Every quantified claim carries one of the two labels so the customer can see
// exactly where we are asserting and where we are asking.

export type Confidence = "evidence" | "hypothesis";

export const site = {
  customer: "Global Sae-A",
  customerKo: "글로벌세아",
  title: "The Allocation Advantage",
  subtitle:
    "Why Global Sae-A's dual-hemisphere manufacturing footprint becomes its decisive advantage in the 2026 trade regime — and why that advantage is a data and agent problem, not a factory problem.",
  meetingDate: "28 July 2026",
  workshopDate: "14 August 2026",
  preparedBy: "Google Cloud JAPAC AI GTM · Korea Account Team",
  confidentiality: "Prepared for Global Sae-A executive leadership · Google Cloud confidential",
};

export const heroStats = [
  { value: "41", label: "factories across 10 countries", note: "Sae-A Trading", tone: "evidence" as Confidence },
  { value: "2.5M", label: "garments produced per day", note: "Sae-A Trading", tone: "evidence" as Confidence },
  { value: "~2,000", label: "Korean office staff — the AX population", note: "of 70,000 group headcount", tone: "evidence" as Confidence },
  { value: "4 days", label: "since the tariff regime that set your landed cost expired", note: "Section 122 lapsed 24 July 2026", tone: "evidence" as Confidence },
];

export const thesis = [
  {
    id: "shock",
    title: "The variable that decides your margin changed on 24 July",
    body:
      "Section 122's flat 10% surcharge expired at 12:01am ET on 24 July 2026. The proposed replacement — Section 301 duties of 10–12.5% on 46+ economies including Vietnam, Indonesia, Cambodia and Korea — carries no statutory sunset, while textile and apparel goods qualifying under CAFTA-DR remain duty-free. For a manufacturer with factories on both sides of that line, landed cost is no longer a sourcing assumption. It is a live variable.",
    confidence: "evidence" as Confidence,
  },
  {
    id: "asset",
    title: "Almost no one else has both hemispheres at scale",
    body:
      "Sae-A Trading runs vertically integrated capacity in Vietnam, Indonesia, Cambodia and Myanmar and in Haiti, Guatemala, Nicaragua and Costa Rica — the latter reinforced by the 2024 Tegra acquisition. Shenzhou, Crystal and most Asian peers are Asia-weighted. Central American specialists lack Asian scale and vertical integration. Sae-A can move a Walmart or Target program across a tariff boundary that its competitors cannot cross.",
    confidence: "evidence" as Confidence,
  },
  {
    id: "bottleneck",
    title: "The bottleneck is Seoul, not the sewing floor",
    body:
      "Converting that footprint into margin requires answering one question faster than the market moves: for this buyer, this style, this quantity, this week — which factory, at what fully-landed cost, with what carbon and compliance evidence attached? Today that answer is assembled by roughly 2,000 Korean office staff out of ERP extracts, GSDCost standard-minute data, spreadsheets and institutional memory. That is a knowledge-retrieval and reasoning problem. It is exactly what Gemini Enterprise is for.",
    confidence: "hypothesis" as Confidence,
  },
  {
    id: "ask",
    title: "So the AX programme has one organising goal, not twelve",
    body:
      "Everything we propose on 14 August ladders to a single measurable outcome: compress the group's allocation-and-evidence cycle from weeks to hours, and prove it on one buyer programme before spending on scale. Cost reduction, ESG compliance and productivity are not three initiatives. They are three views of the same engine.",
    confidence: "hypothesis" as Confidence,
  },
];

export const company = {
  summary:
    "Global Sae-A is an owner-operated Korean conglomerate built on Sae-A Trading (세아상역, founded 1986), the world's largest apparel manufacturer and exporter. Over two decades it has diversified into construction (Ssangyong E&C), paper and packaging (Tailim/Taerim, Jeonju Paper), green energy (Valmax) and EPC (Sae-A STX Entech), while deepening vertical integration inside apparel from yarn to finished garment.",
  pillars: [
    {
      name: "Sae-A Trading (세아상역)",
      role: "Apparel OEM/ODM — the group's origin and cash engine",
      facts: [
        "World's No.1 apparel manufacturer and exporter",
        "41 factories, 25 local offices, 10 countries, 4 continents",
        "~2.5 million garments produced per day",
        "Buyers include Walmart, Target, Kohl's and Gap",
        "Vertically integrated: yarn → fabric → dyeing/finishing → garment",
      ],
      confidence: "evidence" as Confidence,
      accent: "#0047A0",
    },
    {
      name: "Win Textile · Sae-A Spinning · Swisstex · Tegra",
      role: "Upstream materials and Central American capacity",
      facts: [
        "Win Textile supplies yarn and fabric into the garment network",
        "Swisstex adds dyeing and finishing — the most energy- and water-intensive step",
        "Tegra (acquired 2024) added sports-apparel capacity in Central America",
        "Vertical integration is what makes recycled/certified material claims verifiable end to end",
      ],
      confidence: "evidence" as Confidence,
      accent: "#00897B",
    },
    {
      name: "Ssangyong E&C (쌍용건설)",
      role: "Construction — acquired December 2022, now the group's growth story",
      facts: [
        "2025 revenue KRW 1.83 trillion, up ~23.3% year on year",
        "2025 operating profit ~KRW 60 billion — sustained return to profitability",
        "Order backlog grew from USD 4.7B (2022) to USD 6.7B (2025)",
        "Overseas orders up ~8x, from USD 121M (2022) to USD 650M (2025)",
        "Completed the USD 220M ASML Hwaseong Campus; won Avenue Park Towers, Dubai (USD 250M)",
        "Plans to deliver ~6,000 apartment units in 2026",
      ],
      confidence: "evidence" as Confidence,
      accent: "#CD2E3A",
    },
    {
      name: "Tailim/Taerim Packaging · Jeonju Paper",
      role: "Paper and packaging — domestic, energy-intensive, cash-generative",
      facts: [
        "Top-tier Korean comprehensive paper and corrugated packaging position",
        "20+ domestic mills across the paper and packaging platform",
        "Steam and electricity are the dominant controllable cost line",
        "Boiler and line reliability drives both cost and Net-Zero trajectory",
      ],
      confidence: "evidence" as Confidence,
      accent: "#E37400",
    },
    {
      name: "Valmax Technology · Sae-A STX Entech · IN THE F",
      role: "Green energy, EPC and domestic fashion retail",
      facts: [
        "Valmax positions the group in green energy",
        "Sae-A STX Entech operates as a global EPC business",
        "IN THE F carries the group's own-brand fashion retail exposure",
        "Together these give the group demand-side and supply-side sustainability assets",
      ],
      confidence: "evidence" as Confidence,
      accent: "#7B61FF",
    },
  ],
};

export const footprint = {
  note:
    "Sae-A's production geography now straddles the two tariff regimes created by the July 2026 transition. This map is the single most important slide in the executive session.",
  regimes: [
    {
      name: "CAFTA-DR / HOPE-HELP hemisphere",
      status: "Qualifying textile and apparel goods enter the US duty-free",
      countries: ["Guatemala", "Nicaragua", "Costa Rica", "Haiti"],
      implication:
        "Structurally advantaged for US-bound programmes under the proposed Section 301 replacement. Tegra deepens this base. The binding constraint here is proving origin and qualification, not capacity.",
      tone: "advantage" as const,
    },
    {
      name: "Asian hemisphere",
      status: "Exposed to the proposed 10–12.5% Section 301 replacement duties",
      countries: ["Vietnam", "Indonesia", "Cambodia", "Myanmar"],
      implication:
        "Retains the cost, scale and speed advantages that made it dominant — but its landed-cost advantage is now policy-contingent and can move within a quarter. Non-US destinations (EU, Japan, Korea) change the calculus again.",
      tone: "exposed" as const,
    },
  ],
  insight:
    "Every competitor is now re-running this arithmetic. The winner is not whoever has the cheapest factory; it is whoever can re-run the arithmetic fastest, per style, per buyer, per week — and evidence the answer to the buyer's compliance team.",
};

export const industryForces = [
  {
    title: "Trade policy became a weekly variable",
    detail:
      "Section 122's 10% surcharge expired 24 July 2026 after its 150-day statutory cap; the USTR's Section 301 successor proposes 10–12.5% on 46+ economies with no sunset. CAFTA-DR-qualifying apparel is exempt. Sourcing decisions made on a spring assumption are already stale.",
    soWhat: "Landed-cost modelling must move from an annual planning artefact to a queryable, always-current service.",
    confidence: "evidence" as Confidence,
  },
  {
    title: "The buyer's compliance team is now a gatekeeper on price",
    detail:
      "Walmart's Project Gigaton passed its 1-gigaton goal six years early and has refocused on deeper Scope 3 reduction, with a raised disclosure bar for top-tier supplier recognition and 6,800+ participating suppliers. Target has publicly doubled down on Guatemala sourcing under tariff pressure.",
    soWhat: "Emissions and traceability data quality has become a commercial term, not a CSR report.",
    confidence: "evidence" as Confidence,
  },
  {
    title: "The EU is industrialising product-level data",
    detail:
      "The ESPR working plan indicates a 2027 textiles delegated act for the Digital Product Passport, with application realistically from ~2028. Designs contemplate ~126 structured data points per product, of which 25–30 are consumer-visible, across tiered access for brands, suppliers and recyclers.",
    soWhat:
      "The manufacturer that can already emit structured product-level provenance becomes the default partner when brands scramble in 2027.",
    confidence: "evidence" as Confidence,
  },
  {
    title: "Nearshoring urgency softened, then reversed",
    detail:
      "Asian suppliers took share through 2025 as Asian rates normalised, blunting the nearshoring case. The July 2026 Section 301 proposal reverses that: CAFTA-DR exemption restores a hard duty differential for US-bound goods.",
    soWhat: "Sae-A's Central American investment thesis is vindicated — but only if allocation can respond at the speed of policy.",
    confidence: "evidence" as Confidence,
  },
  {
    title: "Buyers push cost and risk down the chain",
    detail:
      "Brands increasingly expect suppliers to absorb last-minute order changes, low minimum order quantities, raw-material sourcing and value-added services. The OEM absorbs volatility that the brand refuses to hold.",
    soWhat:
      "Absorbing volatility profitably requires better internal information, faster — the single clearest AI value case in this business.",
    confidence: "evidence" as Confidence,
  },
  {
    title: "Korea regulated AI before most of its peers",
    detail:
      "The AI Basic Act and Enforcement Decree took effect 22 January 2026, covering both AI developers and AI-utilising businesses, with transparency notice duties, high-impact categories including employment, and MSIT operating a grace period of at least one year through 2026 (fines capped at ~KRW 30 million).",
    soWhat:
      "The grace period is a window, not an exemption. Governance built now is cheap; governance retrofitted in 2027 is not.",
    confidence: "evidence" as Confidence,
  },
];

export const competitors = [
  {
    name: "Shenzhou International",
    profile: "Vertically integrated knitwear giant; Nike/Uniqlo/adidas core",
    posture: "Asia-weighted (China, Vietnam, Cambodia). Deep automation in knitting and dyeing.",
    saeaEdge: "Sae-A's Central American duty-free base is a hedge Shenzhou structurally lacks for US-bound volume.",
  },
  {
    name: "Crystal International",
    profile: "Multi-category, multi-country Asian manufacturer",
    posture: "Strong sustainability reporting and buyer-facing ESG disclosure discipline.",
    saeaEdge: "Sae-A matches scale; the gap to close is the credibility and machine-readability of the ESG data layer.",
  },
  {
    name: "Youngone / Hansae (Korean peers)",
    profile: "Korean OEM peers with overlapping buyers",
    posture: "Comparable buyer relationships and Korean HQ operating models; similar digital maturity curve.",
    saeaEdge:
      "First Korean OEM to operationalise agentic allocation would take a durable head start with the same buyers — this is a race between neighbours, and it is winnable in one quarter.",
  },
  {
    name: "Central American specialists",
    profile: "Elcatex, regional CAFTA-DR players",
    posture: "Duty-free advantaged but sub-scale and rarely vertically integrated to yarn.",
    saeaEdge: "Sae-A brings Asian-scale industrial engineering discipline into the duty-free hemisphere. Few can.",
  },
];

export const platformCompetition = [
  {
    vendor: "Microsoft 365 Copilot",
    likelyPitch:
      "Bundled with an existing Microsoft estate; 'zero change management' framing; seat-priced and easy to approve.",
    honestStrength: "Strongest where the work already happens in Outlook, Teams and Excel — which is much of a Korean HQ day.",
    whereItLoses:
      "Weak on grounding across heterogeneous manufacturing systems, multilingual document estates and factory data. Assistance inside documents ≠ answers across the group.",
  },
  {
    vendor: "AWS (Bedrock / Q)",
    likelyPitch: "Model choice and infrastructure credibility; build-your-own agent stack.",
    honestStrength: "Excellent if Sae-A wants to own the assembly and has the platform engineers to do it.",
    whereItLoses:
      "Requires an internal platform team Global Sae-A has not signalled it wants to build. Time-to-first-value is measured in quarters, not weeks — which a cost-conservative owner family will not fund on faith.",
  },
  {
    vendor: "Korean domestic stacks (Naver, LG, Samsung SDS-led builds)",
    likelyPitch: "Data residency, Korean-language nuance, local support, government alignment.",
    honestStrength: "Genuine strengths in Korean-language handling and in-country trust.",
    whereItLoses:
      "Sae-A's problem is not Korean-only. It is Korean ↔ Spanish ↔ Vietnamese ↔ English across contracts, invoices and factory records. Multilingual reasoning across ten countries is the requirement.",
  },
  {
    vendor: "Do nothing / wait for the workshop to be someone else's problem",
    likelyPitch: "Cost discipline; wait for prices to fall and case studies to accumulate.",
    honestStrength: "Rational for a family-owned business that has been burned by IT spend before.",
    whereItLoses:
      "The tariff and DPP clocks are running on someone else's schedule. Waiting is a decision to let a peer set the buyer expectation first.",
  },
];

export const financialObservations = [
  {
    metric: "Group revenue",
    value: "KRW 4–5 trillion (~USD 3–4B)",
    read: "Large enough that a 1% COGS or SG&A improvement dwarfs any plausible software line item. Frame every proposal against COGS, never against IT budget.",
    confidence: "evidence" as Confidence,
  },
  {
    metric: "Ssangyong E&C 2025",
    value: "KRW 1.83T revenue (+23.3%), ~KRW 60B operating profit",
    read: "Roughly a 3% operating margin. Construction is growing fast on thin margin — meaning schedule slip and safety penalty are existential, not incremental. Safety and schedule are the AI case here, not chat.",
    confidence: "evidence" as Confidence,
  },
  {
    metric: "Ssangyong E&C backlog",
    value: "USD 6.7B (from 4.7B in 2022); overseas orders 8x to USD 650M",
    read: "The backlog is increasingly overseas and multilingual — Dubai, Equatorial Guinea. Document and contract volume is compounding faster than headcount.",
    confidence: "evidence" as Confidence,
  },
  {
    metric: "Apparel unit economics",
    value: "2.5M garments/day across 41 factories",
    read: "At this volume, a 1-cent per-garment landed-cost improvement is worth tens of millions of dollars a year. This is the number to put in front of the Vice Chairman.",
    confidence: "hypothesis" as Confidence,
  },
  {
    metric: "AX-addressable population",
    value: "~2,000 Korean office staff of ~70,000 group headcount",
    read: "Critically: this is a 2,000-seat opportunity, not a 70,000-seat one. Say so out loud. A cost-conservative owner family's first fear is a bill that scales with total headcount.",
    confidence: "evidence" as Confidence,
  },
  {
    metric: "Current Google Cloud spend",
    value: "No active contract",
    read: "Greenfield. There is no migration argument to make and no sunk cost to defend. The entire conversation is about incremental value on top of what already runs.",
    confidence: "evidence" as Confidence,
  },
];

export const digitalMaturity = {
  headline: "Industrially sophisticated, digitally conventional, AI-curious and owner-gated",
  signals: [
    {
      signal: "Adopted Coats Digital GSDCost for standard-minute benchmarking across factories",
      reading:
        "This matters enormously. Sae-A already believes in quantified industrial engineering and has a structured, cross-factory dataset about how long work actually takes. That is the seed corpus for a costing and allocation agent — most OEMs do not have it.",
      confidence: "evidence" as Confidence,
      tone: "strength" as const,
    },
    {
      signal: "Vertically integrated from yarn through garment under one owner",
      reading:
        "Traceability claims that competitors must negotiate across third parties, Sae-A can assert from its own systems. The data exists; it is simply not joined up.",
      confidence: "evidence" as Confidence,
      tone: "strength" as const,
    },
    {
      signal: "Customer proactively approached Google to start the AX conversation",
      reading:
        "Rare and significant. Demand is pulled, not pushed. Three technical syncs and a Senior Leadership Summit endorsement on 15 July already exist. The risk is not interest; it is stall.",
      confidence: "evidence" as Confidence,
      tone: "strength" as const,
    },
    {
      signal: "No active Google Cloud contract; conservative sectors (fashion, construction)",
      reading:
        "Expect a data estate spread across ERP, factory systems, email and spreadsheets, with limited group-level warehousing. Assume no meaningful MLOps capability today.",
      confidence: "hypothesis" as Confidence,
      tone: "gap" as const,
    },
    {
      signal: "Tech adoption is 'nearly impossible without explicit owner-family backing'",
      reading:
        "The decision unit is the family, not the IT function. Any proposal that reads as an IT project dies. Any proposal that reads as a margin and buyer-relationship decision survives.",
      confidence: "evidence" as Confidence,
      tone: "constraint" as const,
    },
    {
      signal: "Recent acquisitions (Ssangyong 2022, Tegra 2024) still carry separate stacks",
      reading:
        "Post-merger system heterogeneity is near-certain. This argues strongly for a retrieval-and-agent layer over systems rather than a consolidation programme — a far cheaper first move.",
      confidence: "hypothesis" as Confidence,
      tone: "constraint" as const,
    },
  ],
};

export const readiness = [
  { dimension: "Executive sponsorship", score: 4, of: 5, note: "Owner-family CEO and Vice Chairman in the room; Senior Leadership Summit already endorsed the plan on 15 July." },
  { dimension: "Business case clarity", score: 4, of: 5, note: "Tariff, ESG and audit-cost pressures give unusually concrete near-term value hooks." },
  { dimension: "Data foundations", score: 2, of: 5, note: "GSDCost and ERP data exist but are unlikely to be joined at group level. No warehouse assumed." },
  { dimension: "AI/ML capability", score: 1, of: 5, note: "No evidence of in-house MLOps. Design for zero-platform-engineering dependence in phase one." },
  { dimension: "Change capacity", score: 2, of: 5, note: "~2,000 Korean office staff; conservative culture; no dedicated AX org yet beyond Michael Lesniak's team." },
  { dimension: "Governance & compliance", score: 3, of: 5, note: "Korean AI Basic Act grace period through 2026 gives room, but employment-related use cases are high-impact and need care." },
  { dimension: "Commercial readiness", score: 3, of: 5, note: "No Google Cloud contract; procurement will demand ROI proof before scale. Q4 GE target is realistic if the PoC lands." },
];

export const risks = [
  {
    risk: "The cost-conservative owner family reads this as an IT spend",
    severity: "High",
    mitigation:
      "Never present a platform. Present a single number: cost per garment allocated, or auditor-days recovered. Put the seat count at 1,000 of 2,000 office staff explicitly so the bill is visibly bounded and cannot be extrapolated to 70,000.",
  },
  {
    risk: "The 14 August workshop becomes a capability tour",
    severity: "High",
    mitigation:
      "Run the workshop against one live buyer programme with real data. Leave with a signed one-page PoC charter naming the metric, the owner and the 60-day date — not a use-case longlist.",
  },
  {
    risk: "Data quality kills the allocation agent before it proves value",
    severity: "Medium",
    mitigation:
      "Phase one deliberately targets retrieval and reasoning over documents the group already trusts (contracts, invoices, GSDCost outputs, audit files) rather than analytics over data that must first be cleaned.",
  },
  {
    risk: "A peer Korean OEM signs first and sets the buyer expectation",
    severity: "Medium",
    mitigation:
      "Speed is the differentiator. The 14 August → Q4 sequence exists precisely to compress this. Use the Samsung DX reference to show the Korean market has already moved.",
  },
  {
    risk: "Employment-adjacent agents trip the AI Basic Act's high-impact category",
    severity: "Medium",
    mitigation:
      "Keep HR use cases in phase one to knowledge retrieval and drafting, not evaluation or selection. Bring Google's governance tooling and Korean legal framing into the workshop rather than after it.",
  },
  {
    risk: "Factory-floor expectations outrun what phase one delivers",
    severity: "Low",
    mitigation:
      "State plainly that 68,000 of 70,000 employees are not Gemini Enterprise seats. Vision and predictive-maintenance work belongs to a later phase with different economics and different data prerequisites.",
  },
];
