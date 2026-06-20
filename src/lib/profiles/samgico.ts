import type { CustomerProfile } from "./types";

export const SAMGICO_PROFILE: CustomerProfile = {
  id: "samgico",
  name: "SamgiCo",
  country: "South Korea",
  industry: "Conglomerate",
  color: "#3B82F6",
  gradient: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
  heroGradient:
    "linear-gradient(160deg, #060d1f 0%, #0d1d3e 40%, #060d1f 70%, #050c1a 100%)",
  tagline: "12 business units. One AI budget. Tiered routing as governance.",
  savingsHeadline: "48% build savings. 62% patent analysis cost reduction.",
  description:
    "SamgiCo runs a central AI inference platform shared across semiconductors, displays, chemicals, construction, finance, and six other BUs. The CFO demands predictable AI costs. Tiered routing makes that possible — Flash-Lite for internal knowledge retrieval and routine summarisation, Opus for patent novelty analysis and M&A due diligence.",
  kpis: [
    { label: "Business Units", value: "12" },
    { label: "Employees", value: "300K" },
    { label: "Patents Filed/Yr", value: "30K" },
    { label: "Annual Revenue", value: "$82B" },
  ],
  build: {
    title: "Cross-BU AI Inference Gateway",
    description:
      "The central AI platform team is building the shared inference gateway — per-BU billing, routing rules, governance controls, audit trails, and the multi-model fallback chain. 50% of development is boilerplate configuration, validation, and SDK generation.",
    defaultDevs: 25,
    defaultSprints: 13,
    mix: { flashLitePct: 0.50, flashPct: 0.20, opusPct: 0.30 },
    tasks: [
      {
        title: "Generate unit tests for 60 gateway API endpoints",
        tier: "flashLite",
        why: "Repetitive test scaffolding across standard REST endpoints — no design judgement needed.",
      },
      {
        title: "Write CRUD for BU configuration registry",
        tier: "flashLite",
        why: "Straightforward data-layer boilerplate following an established schema.",
      },
      {
        title: "Generate OpenAPI docs from gateway handlers",
        tier: "flashLite",
        why: "Mechanical extraction of route signatures into spec format.",
      },
      {
        title: "Write seed data for 12 BU profiles and routing rules",
        tier: "flashLite",
        why: "Structured data generation from a known template — no ambiguity.",
      },
      {
        title: "Add input validation to all admin console forms",
        tier: "flashLite",
        why: "Pattern-based validation rules applied uniformly across form fields.",
      },
      {
        title: "Write Docker configs for multi-region gateway deployment",
        tier: "flashLite",
        why: "Infrastructure-as-code boilerplate with well-defined patterns.",
      },
      {
        title: "Generate audit log schema migrations",
        tier: "flashLite",
        why: "Structured DDL generation from an existing schema definition.",
      },
      {
        title: "Build per-BU cost allocation and billing adapter",
        tier: "flash",
        why: "Requires understanding of multi-tenant billing logic and API integration patterns.",
      },
      {
        title: "Scaffold cross-BU usage analytics dashboard",
        tier: "flash",
        why: "Non-trivial data aggregation across 12 BUs with charting and filtering logic.",
      },
      {
        title: "Write E2E tests for model fallback and retry logic",
        tier: "flash",
        why: "Testing stateful fallback chains requires understanding of distributed system behaviour.",
      },
      {
        title: "Implement Korean/English bilingual error message system",
        tier: "flash",
        why: "Localisation logic with language-switching infrastructure and translation mapping.",
      },
      {
        title: "Design multi-tenant routing architecture with per-BU security isolation",
        tier: "opus",
        why: "High-stakes architectural decision affecting compliance, cost, and security for all 12 BUs.",
      },
      {
        title: "Implement patent semantic search index with prior-art matching",
        tier: "opus",
        why: "Domain-complex NLP pipeline requiring understanding of patent classification and IP law context.",
      },
      {
        title: "Architect cross-BU knowledge graph for M&A target intelligence",
        tier: "opus",
        why: "Graph schema design connecting heterogeneous entity types across business domains.",
      },
      {
        title: "Plan FCC and Korean ISMS compliance monitoring engine",
        tier: "opus",
        why: "Regulatory interpretation requiring deep domain knowledge of multi-jurisdiction compliance frameworks.",
      },
    ],
  },
  run: {
    title: "Patent Analysis & Competitive Intelligence",
    description:
      "30,000 patents filed per year — prior-art searches, novelty scoring, competitive mapping. 40% are routine database lookups (Flash-Lite). 35% need cross-patent reasoning (Flash). 25% require deep novelty analysis against global prior art (Opus). Patent queries use larger context windows than standard support.",
    defaultQueriesPerMonth: 100000,
    maxQueriesPerMonth: 500000,
    queriesStepSize: 10000,
    queriesLabel: "Patent Queries / Month",
    querySize: { inTok: 8000, outTok: 1500 },
    mix: { flashLitePct: 0.40, flashPct: 0.35, opusPct: 0.25 },
    qa: [
      {
        id: "q1",
        question:
          "List all SamgiCo semiconductor patents filed in Q1 2026 related to HBM4 memory architecture.",
        category: "routine",
        answers: {
          flashLite:
            "Found 23 SamgiCo patents filed in Q1 2026 tagged HBM4: [KR10-2026-0021847 to KR10-2026-0021869]. Filed under IPC class G11C 5/06 (memory addressing). All 23 are assigned to the Semiconductor BU, Hwaseong R&D Centre.",
          flash:
            "23 patents found, Q1 2026, HBM4 architecture. Key cluster: 14 patents on stacked die interconnect (Jan–Feb), 9 on thermal management for 12-layer HBM4 (Mar). Primary inventors: Dr. Kim Jae-won (7 patents), Dr. Park Soo-yeon (6 patents). Cross-references JEDEC JESD235E standard.",
          opus:
            "23 patents in Q1 2026 on HBM4. Strategic observation: the March thermal management cluster (9 patents) is unusual — it suggests SamgiCo encountered thermal wall issues during HBM4 validation and patented the workarounds. Competitor analysis shows SK Hynix filed 31 HBM4 patents in the same period with heavier focus on TSV geometry. Recommend IP counsel review the thermal cluster for licensing opportunity before Q3 product launch.",
        },
        scores: { flashLite: 5, flash: 5, opus: 5 },
      },
      {
        id: "q2",
        question:
          "What are the key claims in KR10-2025-0847291 and how do they differ from our earlier KR10-2023-0441827?",
        category: "standard",
        answers: {
          flashLite:
            "KR10-2025-0847291 claims a novel etching process for 3nm gate structures. KR10-2023-0441827 claims a deposition method for the same class of structures. Both are active and assigned to Semiconductor BU.",
          flash:
            "KR10-2025-0847291 (2025) claims an atomic-layer etching process for 3nm GAA transistors with ±0.3A uniformity. KR10-2023-0441827 (2023) claims a CVD deposition method achieving ±0.5A. The newer patent extends the 2023 work by addressing etch selectivity in high-aspect-ratio structures — they form a prosecution chain. Recommend citing the 2023 patent in any continuation filing.",
          opus:
            "The 2025 patent is a strategic extension of the 2023 foundational work. Key difference: 2023 covers deposition (upstream), 2025 covers etching (downstream) — together they create a process flow patent pair that competitors would need both to design around. This is a deliberate prosecution strategy. However, claim 7 of the 2025 patent uses language nearly identical to Intel US11,823,947 — recommend FTO analysis before asserting.",
        },
        scores: { flashLite: 3, flash: 4, opus: 5 },
        sellerNote:
          "Patent portfolio strategy is exactly where Opus earns its cost. Flash can summarise claims. Opus finds the prosecution chain, identifies competitor overlap, and flags the FTO risk before it becomes expensive.",
      },
      {
        id: "q3",
        question:
          "How many active patents does SamgiCo hold in OLED display technology?",
        category: "routine",
        answers: {
          flashLite:
            "SamgiCo holds 4,821 active patents in OLED display technology across all BUs (as of June 2026). Display BU holds 3,247; others hold 1,574.",
          flash:
            "4,821 active OLED patents. Top clusters: flexible display substrates (1,204), pixel driver ICs (887), encapsulation materials (743). 312 patents expire in the next 24 months — 89 are in the top-10 revenue-generating clusters.",
          opus:
            "4,821 active OLED patents, but the expiry picture is strategic. Of the 312 patents expiring in 24 months, 89 are in revenue-generating clusters — and 34 of those are in flexible display substrates, where BOE Technology has been aggressively filing continuations. Once those SamgiCo patents lapse, BOE will have freedom to operate in areas currently blocked. Recommend a defensive publication strategy for the 34 substrate patents to prevent BOE continuation claims from expanding into the vacated space.",
        },
        scores: { flashLite: 5, flash: 5, opus: 5 },
      },
      {
        id: "q4",
        question:
          "We are evaluating acquiring a German LIDAR startup that holds 47 patents. Assess the strategic fit and freedom-to-operate risks against our autonomous vehicle programme.",
        category: "complex",
        answers: {
          flashLite:
            "I can retrieve the 47 patents filed by the target company for your review. Please confirm the target name to proceed.",
          flash:
            "I have pulled the 47 patents. 31 overlap with autonomous vehicle sensor fusion (IPC G01S 17/xx). SamgiCo holds 8 patents in adjacent classes. There are 3 patents from the target that appear to read on SamgiCo's current LIDAR roadmap — recommend FTO opinion before close. Strategic fit: adds sensor depth to an area where SamgiCo currently licenses from third parties.",
          opus:
            "The target's IP is strategically valuable but carries risk. Key findings: (1) 12 of their 47 patents are continuation families that could generate additional claims — you may be buying more IP than the headline number suggests. (2) Patent KR-DE-2024-7741 uses claim language that a German court already found infringed by a Bosch product — this could be a litigation asset or a liability depending on your market position. (3) Their 8 patents on solid-state LIDAR fill a specific gap in SamgiCo Display BU's AR headset roadmap that was not obvious from the automotive framing. Recommend IP diligence focused on continuation risk and the Bosch litigation history before term sheet.",
        },
        scores: { flashLite: 1, flash: 3, opus: 5 },
        sellerNote:
          "M&A IP diligence is the highest-stakes use case. Opus finds the continuation risk, the prior litigation exposure, and the cross-BU strategic angle that no one asked about. That is the difference between a $200M acquisition and a $200M mistake.",
      },
    ],
  },
  agent: {
    title: "Daily Cross-BU Intelligence Briefing Agent",
    description:
      "Runs once daily to synthesise signals from all 12 business units — earnings updates, competitor filings, regulatory changes, and internal patent activity — into a C-suite morning briefing. 12 data-pull steps on Flash; synthesis and strategic framing on Opus.",
    defaultVolume: 12,
    maxVolume: 50,
    volumeStep: 1,
    volumeLabel: "Business Units",
    runsPerDay: 1,
    executorSteps: 12,
    steps: [
      {
        id: 0,
        label: "Prioritise BU intelligence signals by materiality",
        role: "planner",
        inTok: 6000,
        outTok: 2000,
      },
      {
        id: 1,
        label: "Pull semiconductor BU production metrics",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 2,
        label: "Fetch display BU yield reports",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 3,
        label: "Check chemical BU regulatory filings",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 4,
        label: "Pull construction BU project status",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 5,
        label: "Fetch finance BU credit exposure report",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 6,
        label: "Query competitor patent filings (24h)",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 7,
        label: "Check global semiconductor index moves",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 8,
        label: "Pull KFTC and EU regulatory updates",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 9,
        label: "Fetch R&D spending vs milestone tracker",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 10,
        label: "Check cross-BU IP conflict flags",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 11,
        label: "Pull executive calendar and board agenda items",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 12,
        label: "Draft BU-by-BU delta vs last briefing",
        role: "executor",
        inTok: 4000,
        outTok: 1000,
      },
      {
        id: 13,
        label: "Synthesise executive briefing and flag board items",
        role: "reviewer",
        inTok: 9000,
        outTok: 2000,
      },
    ],
  },
};
