/**
 * EARNINGS — Model-as-a-Service competitive intelligence, Feb–Aug 2026.
 *
 * Every figure here comes from the source report. Nothing is invented and
 * nothing is rounded away from the reported unit: if the report says $24.8B,
 * that is what appears. Each datum carries a `c` (confidence) tag:
 *
 *   fact       — disclosed by the company or a named primary source
 *   inference  — derived from disclosed figures, or a named third-party estimate
 *   hypothesis — directional modelling; forward-looking or bounded scenario
 *
 * The site renders that tag as a pill everywhere the number appears, and the
 * "facts only" filter dims anything that is not `fact`.
 */

export type Confidence = "fact" | "inference" | "hypothesis";

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  fact: "Fact",
  inference: "Inference",
  hypothesis: "Hypothesis",
};

export const CONFIDENCE_BLURB: Record<Confidence, string> = {
  fact: "Disclosed by the company or a named primary source.",
  inference: "Derived from disclosed figures, or a named third-party estimate.",
  hypothesis: "Directional model — forward-looking or a bounded scenario.",
};

/** One accent per layer of the stack. Used site-wide, never decoratively. */
export type Layer = "models" | "hyperscalers" | "platforms" | "economics";

export const LAYER_LABEL: Record<Layer, string> = {
  models: "Model providers",
  hyperscalers: "Hyperscalers",
  platforms: "Data & app platforms",
  economics: "Economics & control points",
};

export const REPORT_WINDOW = "Feb–Aug 2026";
export const COMPILED_ON = "Aug 2026";

/* ── 1 · Hero ────────────────────────────────────────────────────────────── */

export const THESIS = "The control point is leaving the model.";

export type Counter = {
  /** Numeric target for the count-up. */
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
  label: string;
  detail: string;
  layer: Layer;
  c: Confidence;
  source: string;
};

export const HERO_COUNTERS: Counter[] = [
  {
    value: 24.8,
    decimals: 1,
    prefix: "$",
    suffix: "B",
    label: "Google Cloud Q2 2026 revenue",
    detail: "+82% YoY · $8.8B operating income · 35.6% margin · $514B backlog",
    layer: "hyperscalers",
    c: "fact",
    source: "Alphabet Q2 2026 results",
  },
  {
    value: 47,
    decimals: 0,
    prefix: "$",
    suffix: "B",
    label: "Anthropic run-rate revenue",
    detail: "May 2026, gross basis — from ~$9B at end-2025",
    layer: "models",
    c: "fact",
    source: "Anthropic Series H announcement, May 28 2026",
  },
  {
    value: 22,
    decimals: 0,
    prefix: "",
    suffix: "B",
    label: "Google tokens per minute",
    detail: "1P Gemini API only, up from 16B a quarter earlier (+37%)",
    layer: "economics",
    c: "fact",
    source: "Sundar Pichai, Alphabet Q2 2026 call, July 22 2026",
  },
];

export const TLDR = [
  {
    n: 1,
    title: "Winning the cloud race, not the frontier-model race",
    body: "Google Cloud grew faster than Azure (43% Azure-only) and AWS (37%) — yet Anthropic at $47B run-rate and OpenAI at ~$25B are capturing frontier-model revenue and mindshare. Claude Code alone (~$8B ARR, ~54% enterprise coding share) rivals a mid-cap public software company.",
    c: "fact" as Confidence,
  },
  {
    n: 2,
    title: "Third-party models are net-accretive — but lopsided",
    body: "Claude on Vertex expands GCP consumption and defends against migration. Google captures Anthropic value across four vectors: TPU infrastructure, ~14% equity, reseller margin, ecosystem pull. But AWS holds the structural advantage — primary cloud, $53.4B unrealized Q2 gain, Trainium lock-in.",
    c: "inference" as Confidence,
  },
  {
    n: 3,
    title: "Keep the harness separate from the model",
    body: "Nadella made model-swappability Microsoft's official enterprise posture. Microsoft reported a 5x increase in multi-provider customers since the start of 2026, across an 11,000+ model catalog. Google's biggest opportunity and biggest threat are the same fact.",
    c: "fact" as Confidence,
  },
];

/* ── 2 · The stack mind map ──────────────────────────────────────────────── */

export type Metric = { k: string; v: string; c: Confidence };

export type MapNode = {
  id: string;
  label: string;
  layer: Layer;
  /** Hub nodes anchor a branch; leaf nodes fan out from their hub. */
  kind: "hub" | "leaf";
  hub?: string;
  blurb: string;
  metrics: Metric[];
  quote?: { text: string; who: string; c: Confidence };
  /** Which zone this node's detail lives in, for the "jump to" affordance. */
  jump?: number;
};

export const MAP_CENTER = {
  label: "Enterprise AI stack",
  sub: "Where the money and the control point sit",
};

export const MAP_NODES: MapNode[] = [
  /* Model providers — amber */
  {
    id: "models",
    label: "Model providers",
    layer: "models",
    kind: "hub",
    blurb:
      "Frontier labs and open-weight families. Revenue is real and concentrated in coding and agents, but the layer is commoditizing beneath the harness.",
    metrics: [
      { k: "Anthropic run-rate", v: "$47B", c: "fact" },
      { k: "OpenAI ARR", v: "~$25B, crossed Feb 2026", c: "inference" },
      { k: "Enterprise LLM spend share", v: "Anthropic 40% · OpenAI 27% · Google 21%", c: "inference" },
    ],
    jump: 3,
  },
  {
    id: "anthropic",
    label: "Anthropic",
    layer: "models",
    kind: "leaf",
    hub: "models",
    blurb:
      "The standout revenue story, now on all three major clouds — which erodes any single cloud's exclusivity.",
    metrics: [
      { k: "Run-rate (May 2026, gross basis)", v: "$47B", c: "fact" },
      { k: "Trajectory", v: "$9B → $14B → $19B → $30B → $47B", c: "fact" },
      { k: "Series H", v: "$65B at $965B valuation", c: "fact" },
      { k: "Claude Code ARR", v: "~$8B — Sacra estimate, May 2026; Anthropic publishes no Claude Code line", c: "inference" },
      { k: "Enterprise coding share", v: "~54% — Menlo Ventures estimate, Dec 2025", c: "inference" },
      { k: "Business customers", v: "300,000+ · 1,000+ paying >$1M", c: "fact" },
      { k: "Fortune 100 penetration", v: "70%", c: "fact" },
      { k: "2026 compute spend", v: "~$19B — analyst modelling, not an Anthropic disclosure", c: "hypothesis" },
    { k: "Commitment to AWS", v: "$100B+ over 10 years, up to 5GW — Anthropic buying, not AWS investing", c: "fact" },
    { k: "Customers >$100K/yr", v: "Up 7x over one year", c: "fact" },
    { k: "Claude Code, Feb 2026", v: "$2.5B+ run-rate · enterprise >half of it · business subs 4x since Jan", c: "fact" },
      { k: "Availability", v: "Bedrock · Vertex · Foundry (GA Jun 29 2026)", c: "fact" },
    ],
    quote: {
      text: "Earlier this month, our run-rate revenue crossed $47 billion.",
      who: "Anthropic Series H announcement, May 28 2026",
      c: "fact",
    },
    jump: 3,
  },
  {
    id: "openai",
    label: "OpenAI",
    layer: "models",
    kind: "leaf",
    hub: "models",
    blurb:
      "Becoming cloud-independent, loosening Microsoft's grip. The clearest single opening for Google Cloud.",
    metrics: [
      { k: "ARR", v: "~$25B — crossed Feb 2026 and reportedly flat since; press reporting on internals, not a disclosure", c: "inference" },
      { k: "Revenue mix", v: "~70% ChatGPT subs · ~25% API — analyst construction; OpenAI has never disclosed a mix", c: "inference" },
      { k: "Operating margin", v: "~−122% — Q1 2026 only, non-GAAP adjusted, from leaked internals; GAAP is worse", c: "inference" },
      { k: "Projected 2026 losses", v: "~$14B — OpenAI's own internal projection, as reported", c: "inference" },
      { k: "Valuation", v: "~$850B — $852B post-money on a $122B raise, Mar 31 2026", c: "fact" },
    { k: "Jul 30 2026 price cuts", v: "GPT-5.6 Luna −80% to $0.20/$1.20; Terra −20% to $2/$12", c: "fact" },
    { k: "Rollout", v: "OpenAI said the July pricing would begin rolling out in AWS", c: "fact" },
      { k: "Payments to Microsoft", v: "~20% of revenue through 2030, subject to a total cap; the $38B figure is press-reported, not in either company's statement", c: "inference" },
      { k: "Oracle commitment", v: "$300B over ~5 years from 2027, 4.5GW of capacity in aggregate — press-reported, not in an Oracle or OpenAI release", c: "inference" },
      { k: "GPT-5.6 on Bedrock", v: "GA July 13 2026 — the July 9 date is the OpenAI first-party launch", c: "fact" },
    ],
    jump: 3,
  },
  {
    id: "gemini",
    label: "Gemini",
    layer: "models",
    kind: "leaf",
    hub: "models",
    blurb:
      "Enormous consumer and distribution scale. Enterprise selection is increasingly on price, value and bundling rather than clear quality leadership.",
    metrics: [
      { k: "Gemini App MAU", v: "950M · DAU tripled YoY", c: "fact" },
      { k: "Gemini Enterprise", v: "Nearly 90% of the Fortune 100; Enterprise Standard lists at $30/seat/mo ($21 is the Business edition on annual commitment)", c: "fact" },
      { k: "Monthly developers", v: "9M+", c: "fact" },
      { k: "1P API throughput", v: "~22B tokens/min (from 16B)", c: "fact" },
      { k: "Frontier pricing", v: "$2 / $12 per M up to 200K context, stepping to $4 / $18 above it; cached input ~$0.50", c: "fact" },
      { k: "LiveCodeBench Pro", v: "~2,439 Elo vs GPT-5.1 ~2,243 — Gemini 3 Pro, Nov 2025", c: "fact" },
      { k: "GPQA Diamond", v: "94.3% — Gemini 3.1 Pro, Feb 2026 (Gemini 3 Pro scored 91.9%)", c: "fact" },
      { k: "Antigravity coding tool", v: "2.4M weekly active users", c: "fact" },
      { k: "Constraint", v: "Supply constrained on Gemini (Pichai)", c: "fact" },
    ],
    jump: 5,
  },
  {
    id: "openweights",
    label: "Chinese open weights",
    layer: "models",
    kind: "leaf",
    hub: "models",
    blurb:
      "Qwen, DeepSeek and Kimi are displacing Meta/Llama and setting the cost floor. Highly relevant to JAPAC.",
    metrics: [
      { k: "Share of OpenRouter tokens", v: "~61% at peak — one week, top-10 models only; ~60% for Asia-based models by Jul 2026", c: "inference" },
      { k: "Qwen downloads", v: "1B+ on Hugging Face · 200,000+ derivatives", c: "fact" },
      { k: "Kimi K2.7 Code", v: "$0.95 / $4 per M — ~5x cheaper than Claude Opus", c: "fact" },
      { k: "DeepSeek V4 Flash", v: "$0.14 / $0.28 per M on DeepSeek's own API — the price floor; $0.09 / $0.18 is reseller pricing", c: "fact" },
      { k: "DeepSeek V4 Pro", v: "$0.435 / $0.87 per M", c: "fact" },
      { k: "Alibaba Cloud AI", v: "~$5.3B annualised, derived from RMB8.97B in the quarter · triple-digit growth 11 straight quarters", c: "inference" },
      { k: "Kimi K3", v: "1M context at $3 / $15 — launched Jul 16, weights public Jul 26", c: "fact" },
    { k: "DeepSeek peak pricing", v: "Announced at 2x regular in peak hours, not yet in effect — scarcity being monetised, not just capacity", c: "fact" },
    { k: "Llama", v: "Fallen off the OpenRouter rankings entirely", c: "fact" },
    ],
    quote: {
      text: "By May 2026, Chinese open-weight models were ~61% of all tokens consumed on OpenRouter… Four of the five most-used models are Chinese — and Meta's Llama has fallen off the rankings entirely.",
      who: "Chris Zeoli, datagravity.dev — a top-10-model measurement, not the full catalogue",
      c: "fact",
    },
    jump: 5,
  },
  {
    id: "challengers",
    label: "Challengers",
    layer: "models",
    kind: "leaf",
    hub: "models",
    blurb:
      "Mistral, Cohere, xAI and Meta's post-pivot API business. Regional and sovereign wedges rather than frontier contenders.",
    metrics: [
      { k: "Mistral", v: "~$400M ARR · 60% Europe · ~€11.7B valuation", c: "inference" },
      { k: "Mistral round", v: "~€3B at ~€20B — reported in talks, unconfirmed", c: "hypothesis" },
      { k: "Cohere", v: "~$240M ARR (~287% YoY) · ~$20B after the Aleph Alpha merger · ~85% private/on-prem", c: "inference" },
      { k: "xAI", v: "~$3.2B 2025 revenue · $6.4B operating loss · 117M Grok MAU · merged into SpaceX Feb 2026", c: "fact" },
      { k: "Meta Muse Spark 1.1", v: "$1.25 / $4.25 per M — 75% below Opus on input, 83% on output", c: "fact" },
      { k: "Meta Q2 2026", v: "$60.8B revenue (+28%) · FCF $784M (−91%) · 2026 capex guide raised to $130–145B", c: "fact" },
    { k: "Mistral Medium 3.5", v: "$1.50 / $7.50 per M · powers remote coding agents · open weights", c: "fact" },
    { k: "Cohere Command A+", v: "Runs on as few as two H100s at 4-bit — the sovereign/constrained-capacity wedge", c: "inference" },
    { k: "Grok pricing", v: "Grok 4.3 on Bedrock $1.25 / $2.50; Grok 4.5 $2 / $6, 2x token efficiency claimed", c: "inference" },
    { k: "Tencent Q1 2026", v: "Revenue RMB196.5B (+9%) · capex RMB31.9B (+16%) · new AI products cut non-IFRS operating profit", c: "fact" },
    ],
    jump: 5,
  },

  /* Hyperscalers — teal */
  {
    id: "hyperscalers",
    label: "Hyperscalers",
    layer: "hyperscalers",
    kind: "hub",
    blurb:
      "Infrastructure margin plus reseller markup. The backlogs are enormous — but they are capacity reservations, not recognised revenue.",
    metrics: [
      { k: "Combined disclosed backlog", v: "$514B + $496B + $678B + $638B", c: "fact" },
      { k: "Growth leader", v: "Google Cloud +82%", c: "fact" },
      { k: "Margin leader", v: "AWS 39.4%", c: "fact" },
    ],
    jump: 5,
  },
  {
    id: "gcp",
    label: "Google Cloud",
    layer: "hyperscalers",
    kind: "leaf",
    hub: "hyperscalers",
    blurb:
      "Growth-rate leader with the strongest 1P model breadth, a TPU cost edge, and Claude native on Vertex.",
    metrics: [
      { k: "Q2 2026 revenue", v: "$24.8B (+82% YoY)", c: "fact" },
      { k: "Operating income", v: "$8.8B", c: "fact" },
      { k: "Operating margin", v: "35.6%, from 20.7% — derived; Alphabet publishes segment operating income, not margin %", c: "inference" },
      { k: "Backlog", v: "$514B — Alphabet's wording is \u201cincreased by more than $50 billion\u201d sequentially, from ~$460B", c: "fact" },
      { k: "Backlog composition", v: "Majority typical GCP contracts, not just AI", c: "fact" },
      { k: "Free cash flow", v: "−$5.9B in Q2 — capex ahead of monetisation", c: "fact" },
    { k: "Q2 capex", v: "$44.9B — a record, and Alphabet's first negative free-cash-flow quarter as a public company", c: "fact" },
    { k: "2026 capex guidance", v: "Raised to $195–205B from $180–190B; ~60% servers / 40% data centres is forward-looking CFO guidance, not actual spend", c: "fact" },
    {
      k: "Caveat on the 82%",
      v: "Includes TPU system sales; Alphabet says growth still accelerated meaningfully excluding them, but does not disclose the split",
      c: "fact",
    },
      { k: "TPU external strategy", v: "Blackstone JV $5B / 500MW 2027 + direct hardware sales", c: "fact" },
    ],
    jump: 5,
  },
  {
    id: "aws",
    label: "AWS",
    layer: "hyperscalers",
    kind: "leaf",
    hub: "hyperscalers",
    blurb:
      "Structural Anthropic advantage: primary cloud, Trainium lock-in, largest equity position. Broadest third-party catalog.",
    metrics: [
      { k: "Q2 2026 revenue", v: "$42.2B (+37%) · ~$169B annualised (derived)", c: "fact" },
      { k: "Operating income", v: "$16.6B, up from $10.2B (+64%) · 39.4% margin (derived)", c: "fact" },
      { k: "Backlog", v: "$496B of remaining performance obligations, up from $364B", c: "fact" },
      { k: "Anthropic investment", v: "$13B ($8B in 2024 + $5B Apr 2026), with up to ~$25B more milestone-linked", c: "fact" },
      { k: "Unrealized Q2 Anthropic gain", v: "$53.4B of non-operating income, primarily Anthropic — ~66% of pre-tax income (derived)", c: "fact" },
      { k: "Bedrock Claude customers", v: "100,000+", c: "fact" },
      { k: "Trainium economics", v: "~30–40% better price-performance than comparable Nvidia instances — an AWS claim, not a lower list price", c: "inference" },
      { k: "TTM free cash flow", v: "−$7.6B", c: "fact" },
    ],
    jump: 5,
  },
  {
    id: "azure",
    label: "Azure",
    layer: "hyperscalers",
    kind: "leaf",
    hub: "hyperscalers",
    blurb:
      "Largest enterprise distribution and the official home of model swappability — while unwinding a 45% RPO concentration in OpenAI.",
    metrics: [
      { k: "FY26 revenue", v: "Passed $100B in actual revenue, +41% for the year · +43% in Q4", c: "fact" },
      { k: "Commercial backlog", v: "$678B (+25% ex-OpenAI)", c: "fact" },
      { k: "Model catalog", v: "11,000+ models", c: "fact" },
      { k: "Multi-provider customers", v: "5x increase since the start of 2026", c: "fact" },
      { k: "OpenAI RPO concentration", v: "~45% of the $625B commercial RPO disclosed Jan 2026 — about $281B", c: "fact" },
      { k: "1P routing proof", v: "MAI-Cyber-1-Flash completes 90% of security tasks; frontier models take the hard 10%", c: "fact" },
      { k: "Anthropic equity gain", v: "$3.2B unrealized in Q2", c: "fact" },
    { k: "Foundry customers", v: "100,000", c: "fact" },
    { k: "1T-token/yr Foundry customers", v: "Up 4x YoY — production scale, though total tokens undisclosed", c: "fact" },
    { k: "M365 Copilot", v: "30M+ paid seats; net seat adds more than doubled QoQ", c: "fact" },
    { k: "Agent 365", v: "~40M agents registered in two months", c: "fact" },
    { k: "MAI in GitHub Copilot", v: "10% lower median token use at higher acceptance, alongside OpenAI and Anthropic", c: "inference" },
    ],
    quote: {
      text: "Azure is now the only cloud providing access to both Claude and GPT frontier models to customers on one platform.",
      who: "Asha Sharma, President, Microsoft CoreAI — Azure blog, Feb 5 2026",
      c: "fact",
    },
    jump: 5,
  },
  {
    id: "oracle",
    label: "Oracle Cloud",
    layer: "hyperscalers",
    kind: "leaf",
    hub: "hyperscalers",
    blurb: "Compute landlord. Enormous RPO growth, thin on first-party models.",
    metrics: [
      { k: "OCI revenue", v: "$5.8B (+93%)", c: "fact" },
      { k: "RPO", v: "$638B (+363%)", c: "fact" },
      { k: "OpenAI deal", v: "$300B over ~5 years · 4.5GW total from 2027 (press-reported)", c: "inference" },
      { k: "Multicloud database", v: "+404%", c: "fact" },
    { k: "RPO movement", v: "+$85B sequential", c: "fact" },
    { k: "Customer-funded hardware", v: "$75B of large AI contracts prepaid or customer-supplied", c: "fact" },
    ],
    jump: 5,
  },
  {
    id: "alibaba",
    label: "Alibaba Cloud",
    layer: "hyperscalers",
    kind: "leaf",
    hub: "hyperscalers",
    blurb: "Dominant China/APAC open-model force and a direct regional threat.",
    metrics: [
      { k: "Revenue", v: "~$6B (+38%)", c: "fact" },
      { k: "AI run-rate", v: "~$5.3B annualised (derived from RMB8.97B in the quarter) · triple-digit growth 11 consecutive quarters", c: "inference" },
      { k: "Qwen", v: "Most-used open model family · SAP partnership scoped to China first", c: "fact" },
    { k: "As reported (Mar quarter)", v: "Cloud revenue RMB41.6B (+38%) · external cloud +40% · Cloud EBITA +57%", c: "fact" },
    { k: "Qwen 3.7 Max pricing", v: "$2.50 / $7.50 per M list, $1.25 / $3.75 on promo · 1M context · off-peak discount up to 80%", c: "fact" },
    { k: "Regional reach", v: "Qwen served from Singapore and Tokyo with region-specific pricing", c: "fact" },
    ],
    jump: 7,
  },

  /* Data & app platforms — violet */
  {
    id: "platforms",
    label: "Data & app platforms",
    layer: "platforms",
    kind: "hub",
    blurb:
      "Consolidating the customer relationship and commoditizing the model beneath them. All three increase cloud consumption AND abstract away Vertex's native surface.",
    metrics: [
      { k: "Shared posture", v: "Explicitly model-agnostic", c: "fact" },
      { k: "Net effect", v: "Accretive to cloud consumption, corrosive to model differentiation", c: "inference" },
    ],
    jump: 5,
  },
  {
    id: "databricks",
    label: "Databricks",
    layer: "platforms",
    kind: "leaf",
    hub: "platforms",
    blurb: "Becoming an AI control plane on top of every cloud.",
    metrics: [
      { k: "ARR (June 2026)", v: "~$6.9B, >80% YoY — disclosed to analysts Jun 16 2026", c: "fact" },
      { k: "AI products", v: "$1.4B of the $5.4B run-rate — the ~26% ratio is derived", c: "inference" },
      { k: "Agent Bricks", v: "100,000+ agents · 1+ quadrillion tokens/yr", c: "fact" },
      { k: "Raise", v: "~$3B at ~$188B, Coatue-led, Jul 17 2026 — up from $134B in February", c: "fact" },
      { k: "Disclosed Feb 2026", v: "$5.4B+ run-rate (+65%) · AI products $1.4B+ · NRR >140%", c: "fact" },
    { k: "Customers >$1M", v: "800+ · more than 60% of the Fortune 500 use Databricks", c: "fact" },
    { k: "Gateway risk", v: "Unity AI Gateway can hold evaluation history, budgets, guardrails and routing rules", c: "inference" },
    { k: "Partnerships", v: "All three clouds + 5-yr Anthropic + $100M OpenAI + Palantir + SAP — all struck in 2025", c: "fact" },
    ],
    jump: 5,
  },
  {
    id: "snowflake",
    label: "Snowflake",
    layer: "platforms",
    kind: "leaf",
    hub: "platforms",
    blurb: "Positioning as the control plane for the agentic enterprise.",
    metrics: [
      { k: "Q1 FY27 product revenue", v: "$1.33B (+34%) — strongest sequential dollar growth ever", c: "fact" },
      { k: "Total revenue", v: "$1.39B (+33%) · NRR 126%", c: "fact" },
      { k: "Accounts using AI", v: "13,600+ · Cortex Code in 7,100+", c: "fact" },
      { k: "Customers >$1M", v: "779", c: "fact" },
      { k: "FY27 product guide", v: "Raised to $5.84B", c: "fact" },
      { k: "Partnerships", v: "$6B AWS agreement · $200M each with OpenAI and Anthropic", c: "fact" },
    ],
    jump: 5,
  },
  {
    id: "palantir",
    label: "Palantir",
    layer: "platforms",
    kind: "leaf",
    hub: "platforms",
    blurb:
      "The clearest commercial proof of the commodity-cognition thesis — captures more enterprise value than the model provider beneath it.",
    metrics: [
      { k: "Q1 2026 revenue", v: "+85% YoY · US $1.28B (+104%)", c: "fact" },
      { k: "US commercial", v: "+133% YoY to $595M", c: "fact" },
      { k: "Rule of 40", v: "145%", c: "fact" },
      { k: "US commercial RDV", v: "+112% to $4.92B", c: "fact" },
      { k: "FY26 guide", v: "Raised to $7.65B+ (US commercial +120%)", c: "fact" },
      { k: "Q1 total revenue", v: "$1.633B — the US $1.28B is 79% of it", c: "fact" },
    { k: "GAAP gross margin", v: "87%, up from 80% — above the cloud it runs on", c: "fact" },
    { k: "Reporting cadence", v: "Q1 reported May 4 2026; Q2 lands after the close on Aug 3 2026, so Q1 is the latest actual", c: "fact" },
    { k: "Top 20 customers", v: "$108M average trailing-twelve-month revenue, +55% — deep but concentrated", c: "fact" },
    { k: "Geographic concentration", v: "79% US; only 13% outside the US and UK — limits APAC extrapolation", c: "fact" },
    { k: "Posture", v: "Explicitly model-agnostic — “commodity cognition”", c: "fact" },
    ],
    jump: 5,
  },

  /* Control points — green */
  {
    id: "control",
    label: "Control points",
    layer: "economics",
    kind: "hub",
    blurb:
      "Where durable margin is migrating: the agent harness, the data platform, and enterprise distribution. Not the raw model.",
    metrics: [
      { k: "Direction of travel", v: "Up-stack, away from the model", c: "inference" },
      { k: "Strongest evidence", v: "Palantir US commercial +133% on an explicitly model-agnostic stack", c: "fact" },
    ],
    jump: 4,
  },
  {
    id: "harness",
    label: "Agent harness",
    layer: "economics",
    kind: "leaf",
    hub: "control",
    blurb:
      "Microsoft's official doctrine: the harness, context, memory and action space are separate from any one model family.",
    metrics: [
      { k: "Multi-provider customers", v: "5x increase since the start of 2026", c: "fact" },
      { k: "Model catalog", v: "11,000+", c: "fact" },
      { k: "Routing in production", v: "MAI-Cyber-1-Flash 90% / frontier models 10%", c: "fact" },
    ],
    quote: {
      text: "We are building a new model system where the harness, context, memory, and action space are separate from any one model family, thereby moving the frontier on the cost-to-outcome curve … every model is substitutable.",
      who: "Satya Nadella, Microsoft FY26 Q4 call, July 29 2026",
      c: "fact",
    },
    jump: 4,
  },
  {
    id: "datagravity",
    label: "Data gravity",
    layer: "economics",
    kind: "leaf",
    hub: "control",
    blurb:
      "The one thing Bedrock and Foundry cannot replicate against Google's data estate — governed enterprise data meeting any model.",
    metrics: [
      { k: "Google asset", v: "BigQuery data estate + Vertex", c: "fact" },
      { k: "Competing gravity", v: "Lakehouse/Unity · Snowflake data cloud · Palantir Ontology", c: "fact" },
      { k: "Switching friction", v: "Persists even when models are nominally swappable", c: "inference" },
    ],
    jump: 7,
  },
  {
    id: "distribution",
    label: "Distribution",
    layer: "economics",
    kind: "leaf",
    hub: "control",
    blurb:
      "Google's structural advantage — consumer scale and Workspace reach that no rival cloud can match.",
    metrics: [
      { k: "Gemini App", v: "950M MAU · DAU tripled YoY", c: "fact" },
      { k: "Gemini Enterprise", v: "~90% of the Fortune 100", c: "fact" },
      { k: "Apple partnership", v: "Powers next-gen Apple Foundation Models/Siri from Jan 2026", c: "fact" },
      { k: "Counterweight", v: "Microsoft's installed base and unified Copilot super-app", c: "fact" },
    ],
    jump: 7,
  },
  {
    id: "orchestration",
    label: "Orchestration & routing",
    layer: "economics",
    kind: "leaf",
    hub: "control",
    blurb:
      "The layer Google must win: a neutral multi-model orchestrator treating Gemini AND Claude AND open weights as first-class.",
    metrics: [
      { k: "Vertex today", v: "Broad model access · routing emerging · ADK/Agent Platform", c: "fact" },
      { k: "Required outcome", v: "Agents built and running on Vertex Agent Platform", c: "hypothesis" },
      { k: "Failure mode", v: "Vertex becomes a low-margin Claude reseller", c: "hypothesis" },
    ],
    jump: 7,
  },
];

/** Money and dependency edges drawn across the map as curved, labelled links. */
export type MapEdge = {
  from: string;
  to: string;
  label: string;
  detail: string;
  c: Confidence;
  /** Curvature sign/strength so crossing edges stay legible. */
  bend: number;
  /** Where along the curve the label sits, 0–1. All four cross the same band. */
  labelT: number;
};

export const MAP_EDGES: MapEdge[] = [
  {
    from: "gcp",
    to: "anthropic",
    label: "up to 1M TPUs",
    detail:
      "Google committed up to ~1M TPUs and >1GW in 2026, plus ~3.5GW from 2027 with Broadcom. Google holds a ~14% stake (capped at 15%, no board seat) on ~$3B invested — and agreed on 24 Apr 2026 to invest up to $40B more.",
    c: "fact",
    bend: 0.16,
    labelT: 0.46,
  },
  {
    from: "aws",
    to: "anthropic",
    label: "$53.4B equity gain",
    detail:
      "AWS is Anthropic's primary cloud with $13B invested ($8B 2024 + $5B Apr 2026) and a 10-year multi-gigawatt Trainium commitment. The Q2 2026 gain is unrealized mark-to-market — ~66% of Amazon's pre-tax income.",
    c: "fact",
    bend: 0.06,
    labelT: 0.3,
  },
  {
    from: "azure",
    to: "openai",
    label: "45% of $625B RPO",
    detail:
      "~45% of Microsoft's $625B commercial RPO was tied to OpenAI as of Jan 2026 — a concentration risk Microsoft is actively unwinding via MAI and the swappability doctrine.",
    c: "fact",
    bend: 0.3,
    labelT: 0.5,
  },
  {
    from: "openai",
    to: "oracle",
    label: "$300B / 5 yrs",
    detail:
      "4.5GW of capacity in aggregate from 2027, per press reporting. Together with GPT-5.6 GA on Bedrock (July 13 2026) and a non-exclusive Microsoft license, OpenAI is now materially cloud-independent.",
    c: "fact",
    bend: 0.09,
    labelT: 0.5,
  },
];

/* ── 3 · Where demand lives ──────────────────────────────────────────────── */

export type RunRatePoint = { label: string; value: number; c: Confidence; note?: string };

/** Anthropic run-rate trajectory, $B, gross basis. */
export const ANTHROPIC_RUNRATE: RunRatePoint[] = [
  { label: "End 2025", value: 9, c: "fact", note: "~$9B at the end of 2025" },
  { label: "Feb 2026", value: 14, c: "fact" },
  { label: "Mar 2026", value: 19, c: "fact" },
  { label: "Apr 2026", value: 30, c: "fact", note: "Disclosed in the Google-Broadcom announcement, Apr 6 2026" },
  { label: "May 2026", value: 47, c: "fact", note: "Series H announcement, May 28 2026" },
];

/** OpenAI reference line, $B ARR, net basis — deliberately not directly comparable. */
export const OPENAI_RUNRATE: RunRatePoint[] = [
  { label: "Mid 2026", value: 25, c: "fact", note: "~70% ChatGPT subscriptions, ~25% API" },
];

export const RUNRATE_CAVEAT =
  "Anthropic reports cloud-reseller revenue gross — total end-customer spend as revenue, partner payouts as expense. The $47B and OpenAI's ~$25B are not directly comparable.";

export type WorkloadTile = {
  id: string;
  label: string;
  /** Relative area weight. */
  weight: number;
  headline: string;
  evidence: string[];
  c: Confidence;
};

export const WORKLOAD_MIX: WorkloadTile[] = [
  {
    id: "coding",
    label: "Coding",
    weight: 44,
    headline: "The single largest identifiable driver",
    evidence: [
      "Claude Code ~$8B ARR — ~17% of Anthropic revenue",
      "~54% enterprise coding share (vs OpenAI 21%, up from 42% six months earlier)",
      "~4% of all public GitHub commits as measured in Feb 2026 (~135K/day); SemiAnalysis projects >20% by end-2026",
      "Google Antigravity at 2.4M weekly active users",
    ],
    c: "inference",
  },
  {
    id: "agents",
    label: "Agentic workflows",
    weight: 26,
    headline: "Second largest, and the fastest-compounding",
    evidence: [
      "Databricks Agent Bricks: 100,000+ agents, 1+ quadrillion tokens/year",
      "Kimi Agent Swarm runs up to 300 sub-agents",
      "Microsoft routing 90% of security tasks to MAI-Cyber-1-Flash",
    ],
    c: "inference",
  },
  {
    id: "analytics",
    label: "Analytics & RAG",
    weight: 18,
    headline: "Riding the data platforms",
    evidence: [
      "Snowflake: 13,600+ accounts using AI, Cortex Code in 7,100+",
      "Snowflake Intelligence accounts doubled quarter over quarter",
      "Palantir AIP US commercial +133% YoY",
    ],
    c: "inference",
  },
  {
    id: "chat",
    label: "Chat & content",
    weight: 12,
    headline: "The 2024-era pilot pool, now the smallest slice",
    evidence: [
      "A decisive shift out of chat/content pilots into production coding and agents",
      "Consumer MAU is not enterprise API usage — 950M Gemini App MAU sits outside this mix",
    ],
    c: "inference",
  },
];

export const WORKLOAD_CAVEAT =
  "Tile areas are an inference from the report's ranked qualitative evidence. The figures inside each tile are the disclosed ones.";

export type TrafficLight = {
  verdict: "Incremental" | "Displaced" | "Subsidised";
  tone: "go" | "warn" | "stop";
  body: string;
  evidence: string;
  c: Confidence;
};

export const DEMAND_QUALITY: TrafficLight[] = [
  {
    verdict: "Incremental",
    tone: "go",
    body: "Mostly incremental at the aggregate level.",
    evidence:
      "Token volumes and cloud AI run-rates are all accelerating together: Google 16B → 22B tokens/min, Amazon added more Bedrock customers in six months than in the first two years post-launch, and Q2 Bedrock spend exceeded all prior quarters combined.",
    c: "fact",
  },
  {
    verdict: "Displaced",
    tone: "warn",
    body: "Clear displacement inside the model layer.",
    evidence:
      "Chinese open models peaked near 61% of OpenRouter tokens in early 2026 and pushed Meta's Llama below 1% of routed volume. Displacement is between providers, not away from the category.",
    c: "fact",
  },
  {
    verdict: "Subsidised",
    tone: "stop",
    body: "Some end-user pricing is effectively VC-subsidised.",
    evidence:
      "Hyperscalers offer committed-use discounts, credits and reserved-capacity incentives. OpenAI runs ~−122% operating margin with ~$14B projected 2026 losses, so a portion of headline pricing is not cost-recovering.",
    c: "inference",
  },
];

/* ── 4 · How enterprises choose ──────────────────────────────────────────── */

export const NADELLA_QUOTE = {
  text: "We offer the broadest model catalog in the cloud with over 11,000 models… Since the start of the year, we have seen 5x increase in the number of customers building with models from multiple providers.",
  who: "Satya Nadella, Microsoft FY26 Q4 earnings call, July 29 2026",
  c: "fact" as Confidence,
};

export const NADELLA_SECONDARY = {
  text: "Every customer wants the right model for each task based on quality, latency, cost, and compliance.",
  who: "Satya Nadella",
  c: "fact" as Confidence,
};

export type SankeyNode = { id: string; label: string; col: 0 | 1 | 2; note?: string };
export type SankeyLink = { from: string; to: string; value: number; note: string };

/**
 * Workloads → selection factors → models.
 *
 * Link weights are an inference. They are anchored on the disclosed shares
 * (Claude ~54% of enterprise coding vs OpenAI 21%; Chinese open weights ~61%
 * of OpenRouter tokens; Gemini cheapest frontier tier) and on the report's
 * ranking of selection factors by frequency in management commentary.
 */
export const SANKEY_NODES: SankeyNode[] = [
  { id: "w-coding", label: "Coding", col: 0, note: "Largest identifiable token pool" },
  { id: "w-agents", label: "Agents", col: 0, note: "Second largest, fastest compounding" },
  { id: "w-analytics", label: "Analytics & RAG", col: 0, note: "Runs through the data platforms" },
  { id: "w-volume", label: "High-volume batch", col: 0, note: "Price-led, latency-tolerant" },

  { id: "f-quality", label: "Task-specific quality", col: 1, note: "Ranked #1 in management commentary" },
  { id: "f-price", label: "Price & inference efficiency", col: 1, note: "Ranked #2" },
  { id: "f-latency", label: "Latency", col: 1, note: "Ranked #3" },
  { id: "f-context", label: "Context length", col: 1, note: "Ranked #4" },
  { id: "f-residency", label: "Residency & security", col: 1, note: "Ranked #5" },
  { id: "f-commit", label: "Existing cloud commitment", col: 1, note: "Ranked #6 — the switching friction" },

  { id: "m-claude", label: "Claude", col: 2, note: "~54% enterprise coding share" },
  { id: "m-gemini", label: "Gemini", col: 2, note: "Cheapest frontier tier, largest context" },
  { id: "m-gpt", label: "GPT-5.x", col: 2, note: "Leads terminal/autonomous coding" },
  { id: "m-open", label: "Open weights", col: 2, note: "~61% of OpenRouter tokens" },
];

export const SANKEY_LINKS: SankeyLink[] = [
  { from: "w-coding", to: "f-quality", value: 26, note: "Coding buyers lead on task-specific quality" },
  { from: "w-coding", to: "f-price", value: 10, note: "High-volume coding is price-sensitive" },
  { from: "w-coding", to: "f-commit", value: 8, note: "Committed-use discounts create friction" },
  { from: "w-agents", to: "f-quality", value: 14, note: "Agentic reliability compounds per step" },
  { from: "w-agents", to: "f-latency", value: 8, note: "Multi-step loops multiply latency" },
  { from: "w-agents", to: "f-context", value: 6, note: "Long-horizon agents need context" },
  { from: "w-analytics", to: "f-residency", value: 10, note: "Governed data, regulated industries" },
  { from: "w-analytics", to: "f-context", value: 6, note: "Retrieval stuffs the window" },
  { from: "w-analytics", to: "f-commit", value: 6, note: "Follows the data platform's cloud" },
  { from: "w-volume", to: "f-price", value: 16, note: "Price is the only factor that matters at volume" },
  { from: "w-volume", to: "f-latency", value: 6, note: "Batch tolerates slower tiers" },

  { from: "f-quality", to: "m-claude", value: 22, note: "Claude dominant in coding and agentic/expert work" },
  { from: "f-quality", to: "m-gpt", value: 12, note: "GPT-Codex leads terminal/autonomous coding" },
  { from: "f-quality", to: "m-gemini", value: 6, note: "Strong raw benchmarks: GPQA Diamond 94.3%" },
  { from: "f-price", to: "m-open", value: 14, note: "DeepSeek V4 Flash at $0.09/$0.18 sets the floor" },
  { from: "f-price", to: "m-gemini", value: 12, note: "Cheapest frontier tier at ~$2/$12" },
  { from: "f-latency", to: "m-gemini", value: 8, note: "Flash tiers built for latency" },
  { from: "f-latency", to: "m-claude", value: 6, note: "4.6s median vs Kimi's 29s in one test" },
  { from: "f-context", to: "m-gemini", value: 7, note: "1M context — at parity with GPT-5.5, Claude, Qwen and Kimi" },
  { from: "f-context", to: "m-claude", value: 5, note: "1M context" },
  { from: "f-residency", to: "m-gemini", value: 6, note: "In-region Vertex, sovereignty motions" },
  { from: "f-residency", to: "m-claude", value: 4, note: "Enterprise trust position" },
  { from: "f-commit", to: "m-gemini", value: 8, note: "GCP committed spend pulls Gemini" },
  { from: "f-commit", to: "m-claude", value: 6, note: "Claude now native on all three clouds" },
];

export const SWITCHING_NOTE =
  "Claimed vs actual switching: the gap is narrowing as routing becomes real, but committed-use discounts, data gravity and harness lock-in create friction even when models are nominally swappable — which is precisely why the harness is the control point.";

/* ── 5 · The scoreboard ──────────────────────────────────────────────────── */

/** 0–3: the 4-step colour scale. */
export type Score = 0 | 1 | 2 | 3;

export type ScoreCell = { s: Score; t: string; e: string };
export type ScoreRow = { name: string; layer: Layer; cells: ScoreCell[] };
export type ScoreTable = {
  id: string;
  label: string;
  layer: Layer;
  cols: string[];
  rows: ScoreRow[];
  note: string;
  c: Confidence;
};

export const SCOREBOARDS: ScoreTable[] = [
  {
    id: "providers",
    label: "Model providers",
    layer: "models",
    c: "inference",
    note: "Qualitative scorecard as of Aug 2026. Benchmark rankings rotate every few weeks across versions; no single model dominates.",
    cols: [
      "Enterprise adoption",
      "Coding",
      "Reasoning",
      "Agents",
      "Context",
      "Pricing",
      "Cloud availability",
      "Commercial sustainability",
    ],
    rows: [
      {
        name: "Gemini",
        layer: "models",
        cells: [
          { s: 2, t: "High", e: "~90% of the Fortune 100 via Gemini Enterprise, from $21/user/mo" },
          { s: 1, t: "Good", e: "Losing enterprise coding share to Claude; Antigravity at 2.4M WAU is promising but sub-scale" },
          { s: 2, t: "Strong", e: "GPQA Diamond 94.3%; LiveCodeBench Pro ~2,439 Elo vs GPT-5.1 ~2,243" },
          { s: 2, t: "Strong", e: "Gemini Enterprise Agent Platform and ADK, but orchestration is still emerging" },
          {
            s: 2,
            t: "1M",
            e: "Up to 1M on current Gemini 3 models — parity, not a lead. A second research pass found GPT-5.5, Claude, Qwen 3.7 Max, Kimi K3 and Grok all at 1M too, so context length is no longer a Gemini differentiator.",
          },
          { s: 3, t: "Cheapest frontier", e: "~$2 / $12 per M tokens — the cheapest frontier tier" },
          { s: 1, t: "GCP-native + Apple", e: "GCP-native, plus the Apple partnership powering Apple Foundation Models/Siri from Jan 2026" },
          { s: 3, t: "Very high", e: "Alphabet-funded; Google Cloud at 35.6% operating margin" },
        ],
      },
      {
        name: "Anthropic / Claude",
        layer: "models",
        cells: [
          { s: 3, t: "Highest", e: "70% of the Fortune 100; 40% of enterprise LLM spend vs OpenAI 27% and Google 21%" },
          { s: 3, t: "Dominant", e: "~54% enterprise coding share; ~4% of all public GitHub commits" },
          { s: 2, t: "Strong", e: "Strong across reasoning benchmarks, though not the price leader" },
          { s: 3, t: "Dominant", e: "GDPval human-preference lead on agentic and expert work" },
          { s: 2, t: "1M", e: "1M token context" },
          { s: 0, t: "Premium", e: "Premium pricing; Kimi K2.7 Code is ~5x cheaper than Claude Opus" },
          { s: 3, t: "All 3 clouds", e: "Bedrock, Vertex, and Foundry GA on June 29 2026" },
          { s: 2, t: "High", e: "Approaching profitability, targeting ~$10.9B quarterly" },
        ],
      },
      {
        name: "OpenAI / GPT",
        layer: "models",
        cells: [
          { s: 2, t: "High", e: "Broad adoption, but overtaken by Anthropic in enterprise LLM spend share in 2026" },
          { s: 2, t: "Strong", e: "GPT-Codex leads terminal and autonomous-agent coding; 21% enterprise coding share" },
          { s: 2, t: "Strong", e: "Competitive across reasoning tiers" },
          { s: 2, t: "Strong", e: "Strong agent tooling" },
          { s: 2, t: "1M", e: "GPT-5.5 ships 1M context at $5/$30, with Batch and Flex at half price and Priority at 2.5x" },
          { s: 1, t: "Mid", e: "Mid-market pricing between Gemini and Claude" },
          { s: 2, t: "Azure + Bedrock + Oracle", e: "GPT-5.6 GA on Bedrock July 13 2026; non-exclusive Microsoft license; Oracle $300B" },
          { s: 0, t: "Low", e: "~−122% operating margin; ~$14B projected 2026 losses" },
        ],
      },
      {
        name: "Kimi (Moonshot)",
        layer: "models",
        cells: [
          { s: 0, t: "Low", e: "China-centric adoption" },
          { s: 2, t: "Strong", e: "K2.6 ranked strongest open-weight model on the Artificial Analysis intelligence index" },
          { s: 2, t: "Strong", e: "1T-param MoE with 32B active" },
          { s: 2, t: "Strong", e: "Agent Swarm runs up to 300 sub-agents" },
          { s: 2, t: "256K–1M", e: "256K to 1M context" },
          { s: 3, t: "Very low", e: "K2.7 Code at $0.95 / $4 per M — ~5x cheaper than Claude Opus" },
          { s: 0, t: "Open weights", e: "Open weights only; no first-party hyperscaler distribution" },
          { s: 1, t: "Uncertain", e: "Distillation accusations from Anthropic (3.4M+ queries); censorship constraints" },
        ],
      },
      {
        name: "DeepSeek",
        layer: "models",
        cells: [
          { s: 1, t: "Low-med", e: "Primarily China" },
          { s: 2, t: "Strong", e: "Strong coding at the lowest price point in the market" },
          { s: 2, t: "Strong", e: "Competitive reasoning" },
          { s: 1, t: "Med", e: "Less agent tooling than Kimi's Agent Swarm" },
          { s: 2, t: "Large", e: "Large context" },
          { s: 3, t: "Lowest", e: "V4 Flash at $0.09 / $0.18; V4 Pro at $0.435 / $0.87 — the industry price floor" },
          { s: 0, t: "Open weights", e: "Open weights only" },
          { s: 1, t: "Uncertain", e: "Unclear commercial model" },
        ],
      },
      {
        name: "Qwen (Alibaba)",
        layer: "models",
        cells: [
          { s: 2, t: "High in APAC", e: "Dominant open-model force in APAC; SAP partnership, China-first" },
          { s: 2, t: "Strong", e: "Strong coding across the family" },
          { s: 2, t: "Strong", e: "Qwen3.7-Max flagship, API-only" },
          { s: 2, t: "Strong", e: "Broad agent tooling" },
          { s: 2, t: "1M", e: "1M context on the flagship" },
          { s: 3, t: "Very low", e: "Open weights plus low-cost Alibaba Cloud serving" },
          { s: 2, t: "Open + Alibaba", e: "1B+ Hugging Face downloads; 200,000+ Qwen-tagged derivatives" },
          { s: 3, t: "High", e: "Alibaba-funded; AI revenue at a ~$5.3B annualised pace (derived), triple digits for 11 quarters" },
        ],
      },
      {
        name: "Mistral",
        layer: "models",
        cells: [
          { s: 1, t: "Med (Europe)", e: "60% of revenue from Europe; sovereign wedge with Airbus and BMW" },
          { s: 1, t: "Med", e: "Mid-tier coding" },
          { s: 1, t: "Med", e: "Mid-tier reasoning" },
          { s: 1, t: "Med", e: "Mid-tier agent support" },
          { s: 1, t: "Med", e: "Mid-tier context" },
          { s: 2, t: "Low-mid", e: "Low-to-mid pricing" },
          { s: 2, t: "Multi-cloud", e: "Available across multiple clouds" },
          { s: 1, t: "Med", e: "~$400M ARR estimate; ASML-backed at ~€11.7B" },
        ],
      },
      {
        name: "Meta / Muse",
        layer: "models",
        cells: [
          { s: 0, t: "Low", e: "Post-pivot to closed models; Llama fell off the OpenRouter rankings" },
          { s: 1, t: "Med", e: "Mid-tier coding" },
          { s: 1, t: "Med", e: "Mid-tier reasoning" },
          { s: 1, t: "Med", e: "Mid-tier agents" },
          { s: 1, t: "Med", e: "Mid-tier context" },
          { s: 3, t: "Very low", e: "Muse Spark 1.1 at $1.25 / $4.25 per M — 75–83% below Opus" },
          { s: 0, t: "Meta API (new)", e: "Meta's first serious API business, launched July 9 2026" },
          { s: 3, t: "High", e: "Meta-funded, though Q2 FCF collapsed to $784M on a $130–145B capex guide" },
        ],
      },
      {
        name: "Cohere",
        layer: "models",
        cells: [
          { s: 1, t: "Med", e: "Sovereign and RAG focus; ~85% of revenue from private/on-prem deployments" },
          { s: 0, t: "Low", e: "Not a coding contender" },
          { s: 1, t: "Med", e: "Mid-tier reasoning" },
          { s: 1, t: "Med (North)", e: "North agentic platform" },
          { s: 1, t: "Med", e: "Mid-tier context" },
          { s: 1, t: "Mid", e: "Mid-market pricing" },
          { s: 2, t: "Cloud-agnostic", e: "Deploys across clouds and on-prem" },
          { s: 1, t: "Med", e: "~$240M ARR (~287% YoY); ~$20B combined after the Aleph Alpha merger; Schwarz Group €500M Series E" },
        ],
      },
      {
        name: "xAI / Grok",
        layer: "models",
        cells: [
          { s: 1, t: "Low-med", e: "117M Grok MAU but governance and enterprise-adoption concerns" },
          { s: 1, t: "Med", e: "Mid-tier coding" },
          { s: 2, t: "Strong", e: "Strong reasoning" },
          { s: 1, t: "Med", e: "Mid-tier agents" },
          { s: 2, t: "1M", e: "1M context" },
          { s: 1, t: "Mid", e: "Mid-market pricing" },
          { s: 2, t: "Oracle/Azure/Bedrock", e: "Grok 4.3 GA June 15 2026 across three clouds" },
          { s: 0, t: "Low", e: "$6.4B operating loss on ~$3.2B 2025 revenue" },
        ],
      },
    ],
  },
  {
    id: "hyperscalers",
    label: "Hyperscalers",
    layer: "hyperscalers",
    c: "fact",
    note: "Q2 2026 or most recent disclosed quarter. Margins are blended infrastructure margins, NOT model-specific.",
    cols: [
      "Revenue growth",
      "Operating margin",
      "Backlog",
      "1P model breadth",
      "3P model catalog",
      "Silicon cost edge",
      "Enterprise distribution",
      "Anthropic position",
    ],
    rows: [
      {
        name: "Google Cloud",
        layer: "hyperscalers",
        cells: [
          { s: 3, t: "+82%", e: "$24.8B in Q2 2026 — the growth-rate leader across all hyperscalers" },
          { s: 2, t: "35.6%", e: "$8.8B operating income, up from a 20.7% margin" },
          { s: 2, t: "$514B", e: "+$50B sequential; majority typical GCP contracts, not just AI" },
          { s: 3, t: "Strongest", e: "Gemini 3.5 Pro, 3.6 Flash, 3.5 Flash-Lite, 3.5 Flash Cyber; Gemini 4 pre-training started" },
          { s: 2, t: "Broad", e: "Gemini + Claude + open models native on Vertex" },
          { s: 3, t: "TPU", e: "TPU cost structure plus a merchant business: Blackstone JV $5B / 500MW 2027" },
          { s: 2, t: "Very strong", e: "950M Gemini App MAU; ~90% of the Fortune 100 on Gemini Enterprise" },
          { s: 2, t: "Secondary", e: "~14% stake on ~$3B invested, plus up to $40B committed Apr 2026; up to 1M TPUs and >1GW in 2026" },
        ],
      },
      {
        name: "AWS",
        layer: "hyperscalers",
        cells: [
          { s: 2, t: "+37%", e: "$42.2B in Q2 2026 — a $169B run-rate" },
          { s: 3, t: "39.4%", e: "$16.6B operating income — the margin leader" },
          { s: 2, t: "$496B", e: "Large backlog, but capacity reservations rather than steady-state consumption" },
          { s: 1, t: "Limited", e: "Nova family; thin relative to Gemini's breadth" },
          { s: 3, t: "Broadest", e: "Bedrock carries Claude, GPT-5.6, Gemma, Grok, Llama and Mistral" },
          { s: 3, t: "Trainium", e: "~30–40% better price-performance than comparable Nvidia instances (an AWS claim); 10-yr multi-GW Anthropic commitment" },
          { s: 2, t: "Strong", e: "100,000+ Bedrock customers running Claude" },
          { s: 3, t: "Primary cloud", e: "$13B invested ($8B 2024 + $5B Apr 2026); $53.4B unrealized Q2 gain — ~66% of Amazon pre-tax income" },
        ],
      },
      {
        name: "Azure",
        layer: "hyperscalers",
        cells: [
          { s: 2, t: "+43%", e: "Azure-only growth in Q4; FY26 revenue passed $100B, up 41% for the year" },
          { s: 1, t: "Not disclosed", e: "Azure-specific operating margin is not separately disclosed" },
          { s: 3, t: "$678B", e: "+25% excluding OpenAI — the largest disclosed commercial backlog" },
          { s: 2, t: "MAI", e: "MAI-Cyber-1-Flash completes 90% of security tasks; 1P push to reduce OpenAI dependence" },
          { s: 3, t: "11,000+", e: "The broadest catalog in the cloud; 5x increase in multi-provider customers" },
          { s: 0, t: "None disclosed", e: "No disclosed first-party silicon cost advantage at this scale" },
          { s: 3, t: "Largest", e: "Largest enterprise installed base; unified Copilot super-app shipping" },
          { s: 1, t: "Reseller", e: "Claude GA on Foundry June 29 2026; $3.2B unrealized Q2 Anthropic gain" },
        ],
      },
      {
        name: "Oracle Cloud",
        layer: "hyperscalers",
        cells: [
          { s: 3, t: "+93%", e: "OCI at $5.8B" },
          { s: 1, t: "Not disclosed", e: "OCI-specific operating margin is not separately disclosed" },
          { s: 3, t: "$638B", e: "RPO +363% — driven overwhelmingly by the OpenAI commitment" },
          { s: 0, t: "None", e: "No first-party frontier models" },
          { s: 1, t: "Narrow", e: "Grok and select partner models" },
          { s: 0, t: "None", e: "No first-party silicon" },
          { s: 2, t: "Database estate", e: "Multicloud database +404%" },
          { s: 0, t: "None", e: "No Anthropic relationship; the OpenAI landlord instead — $300B over 5 years" },
        ],
      },
      {
        name: "Tencent Cloud",
        layer: "hyperscalers",
        cells: [
          { s: 1, t: "+9%", e: "Group revenue RMB196.5B in Q1 2026; cloud not separately disclosed" },
          { s: 1, t: "Diluted by AI", e: "Non-IFRS operating profit RMB75.6B, or RMB84.4B excluding new AI products; IFRS operating profit was RMB67.4B" },
          { s: 0, t: "Not disclosed", e: "No comparable backlog disclosure" },
          { s: 2, t: "Hunyuan", e: "Hunyuan, WorkBuddy and CodeBuddy; early agent traction reported" },
          { s: 1, t: "Regional", e: "Primarily its own family" },
          { s: 1, t: "In-house", e: "Capex RMB31.9B (+16%), funded from a profitable core business" },
          { s: 2, t: "China", e: "Strong China distribution; limited outside" },
          { s: 0, t: "None", e: "No Anthropic relationship" },
        ],
      },
      {
        name: "Alibaba Cloud",
        layer: "hyperscalers",
        cells: [
          { s: 2, t: "+38%", e: "~$6B revenue, growing 26–38% YoY" },
          { s: 1, t: "Not disclosed", e: "Segment operating margin is not separately disclosed" },
          { s: 0, t: "Not disclosed", e: "No comparable backlog disclosure" },
          { s: 3, t: "Qwen", e: "Most-used open model family: 1B+ downloads, 200,000+ derivatives" },
          { s: 1, t: "Regional", e: "Primarily its own family plus regional models" },
          { s: 1, t: "In-house", e: "In-house accelerators, not disclosed at hyperscaler scale" },
          { s: 2, t: "APAC", e: "Dominant China/APAC position; SAP partnership, China-first" },
          { s: 0, t: "None", e: "No Anthropic relationship" },
        ],
      },
    ],
  },
  {
    id: "platforms",
    label: "Data & app platforms",
    layer: "platforms",
    c: "inference",
    note: "These platforms both increase underlying cloud consumption AND risk abstracting away Vertex AI's native surface.",
    cols: [
      "Model access",
      "Routing",
      "Agent dev",
      "Data integration",
      "Governance",
      "Enterprise adoption",
      "Controls customer relationship",
      "Commoditizes the model",
    ],
    rows: [
      {
        name: "Vertex AI",
        layer: "platforms",
        cells: [
          { s: 3, t: "Broad", e: "Gemini + Claude + open models, all native" },
          { s: 1, t: "Emerging", e: "Routing is emerging, not yet a differentiated orchestration layer" },
          { s: 2, t: "ADK / Agent Platform", e: "Agent Development Kit and Gemini Enterprise Agent Platform" },
          { s: 3, t: "BigQuery gravity", e: "The one asset Bedrock and Foundry cannot replicate" },
          { s: 2, t: "Strong", e: "Strong enterprise governance controls" },
          { s: 2, t: "High", e: "~90% of the Fortune 100 via Gemini Enterprise" },
          { s: 1, t: "Medium", e: "Risks becoming a low-margin Claude reseller if orchestration does not differentiate" },
          { s: 1, t: "Medium risk", e: "Medium risk of commoditizing its own first-party model" },
        ],
      },
      {
        name: "Databricks",
        layer: "platforms",
        cells: [
          { s: 3, t: "Broad", e: "Partners with all three clouds plus a 5-year Anthropic deal and $100M OpenAI deal" },
          { s: 3, t: "Yes (Mosaic)", e: "Mosaic AI is ~26% of revenue" },
          { s: 3, t: "Agent Bricks", e: "100,000+ agents processing 1+ quadrillion tokens/year" },
          { s: 3, t: "Lakehouse / Unity", e: "Lakehouse and Unity Catalog data gravity" },
          { s: 2, t: "Strong", e: "Strong governance via Unity Catalog" },
          { s: 3, t: "High", e: "~$6.9B ARR growing >80% YoY" },
          { s: 3, t: "High", e: "Owns the data plane and therefore the customer relationship" },
          { s: 3, t: "High", e: "Model choice moves inside Databricks, not the cloud console" },
        ],
      },
      {
        name: "Snowflake",
        layer: "platforms",
        cells: [
          { s: 2, t: "Growing (Cortex)", e: "$200M partnerships each with OpenAI and Anthropic" },
          { s: 2, t: "Growing", e: "Routing capability expanding inside Cortex" },
          { s: 3, t: "Snowflake Intelligence", e: "Accounts doubled quarter over quarter; Natoma (MCP) acquisition" },
          { s: 3, t: "Native data cloud", e: "13,600+ accounts using AI; Cortex Code in 7,100+" },
          { s: 2, t: "Strong", e: "Strong native governance" },
          { s: 3, t: "High", e: "$1.33B product revenue (+34%), NRR 126%, 779 customers >$1M" },
          { s: 3, t: "High", e: "Positioned as the control plane for the agentic enterprise" },
          { s: 3, t: "High", e: "Redirects model consumption to whatever Cortex embeds" },
        ],
      },
      {
        name: "Palantir",
        layer: "platforms",
        cells: [
          { s: 3, t: "Agnostic", e: "Explicitly model-agnostic — the “commodity cognition” thesis" },
          { s: 3, t: "Yes", e: "Routes across providers by design" },
          { s: 3, t: "AIP (leading)", e: "AIP is the leading enterprise agent development environment" },
          { s: 3, t: "Ontology", e: "Ontology is the deepest semantic integration in the category" },
          { s: 3, t: "Strongest", e: "Strongest governance posture; US Army NGC2 win" },
          { s: 2, t: "High (US)", e: "US commercial +133% YoY to $595M; Rule of 40 at 145%" },
          { s: 3, t: "Highest", e: "Captures more enterprise value than the model provider beneath it" },
          { s: 3, t: "Highest", e: "The model is an interchangeable input to the ontology" },
        ],
      },
    ],
  },
];

export const SCORE_SCALE = ["Weak / absent", "Moderate", "Strong", "Leading"];

/* ── 6 · Follow the dollar ───────────────────────────────────────────────── */

export type DollarBand = {
  id: string;
  label: string;
  lo: number;
  hi: number;
  note: string;
  c: Confidence;
};

/** Bounded scenario for $1.00 of enterprise spend on a 3P model via a hyperscaler. */
export const DOLLAR_SPLIT: DollarBand[] = [
  {
    id: "provider",
    label: "Model provider token revenue",
    lo: 0.55,
    hi: 0.75,
    note: "Booked on a gross basis by Anthropic — total end-customer spend as revenue, partner payouts as expense.",
    c: "hypothesis",
  },
  {
    id: "hyperscaler",
    label: "Hyperscaler serving margin + reseller markup",
    lo: 0.1,
    hi: 0.25,
    note: "Infrastructure and serving margin plus a markup on partner-model tokens. On Vertex/Bedrock the reseller takes this; Anthropic books the gross.",
    c: "hypothesis",
  },
];

export const DOLLAR_COST: DollarBand = {
  id: "infra",
  label: "Underlying inference cost",
  lo: 0.3,
  hi: 0.5,
  note: "Chips, power and networking. On Google TPUs and AWS Trainium the hyperscaler captures the hardware-efficiency spread — AWS claims Trainium delivers ~30–40% better price-performance than comparable Nvidia instances.",
  c: "hypothesis",
};

export const CROSS_SELL = {
  lo: 1.5,
  hi: 3.0,
  headline: "Every $1 of model spend pulls $1.50–3.00 of adjacent spend",
  note: "Storage, data warehouse, networking and application spend. Strongly implied by Google's $514B backlog being majority typical GCP contracts, not just AI. This multiplier is the real reason third-party models are accretive.",
  c: "hypothesis" as Confidence,
  target: "Target cross-sell multiplier on Claude-on-Vertex: >2x",
};

export const TOKEN_DEFLATION = {
  from: 20,
  to: 0.4,
  headline: "GPT-4-class pricing fell from ~$20/M tokens to ~$0.40",
  note: "Late 2022 to early 2026 — roughly a 10x annual decline in equivalent-capability tiers. Token growth is therefore not revenue growth.",
  c: "fact" as Confidence,
  levers: [
    { k: "Prompt caching", v: "90% cached-input discounts on Bedrock", c: "fact" as Confidence },
    { k: "Batch inference", v: "60% of real-time on Kimi", c: "fact" as Confidence },
    { k: "Batch / Flex", v: "Half price on GPT-5.5; above 272K input it bills 2x in / 1.5x out", c: "fact" as Confidence },
    { k: "Priority tier", v: "2.5x list on GPT-5.5 — latency is now a paid product", c: "fact" as Confidence },
    { k: "Off-peak", v: "Qwen discounts off-peak usage up to 80%", c: "fact" as Confidence },
    { k: "Peak surcharge", v: "DeepSeek plans peak rates at 2x regular", c: "fact" as Confidence },
  ],
};

export type CircularityStep = { n: number; label: string; detail: string; c: Confidence };

export const CIRCULARITY: CircularityStep[] = [
  {
    n: 1,
    label: "Hyperscaler invests in lab",
    detail: "AWS $13B into Anthropic; Google ~$3B in for a ~14% stake and up to $40B committed in Apr 2026; Microsoft into OpenAI.",
    c: "fact",
  },
  {
    n: 2,
    label: "Lab buys hyperscaler compute",
    detail:
      "Anthropic's 2026 compute spend is put at ~$19B by analysts — not an Anthropic disclosure — across AWS Trainium, Google TPU and Nvidia GPUs.",
    c: "hypothesis",
  },
  {
    n: 3,
    label: "Lab valuation marks up",
    detail: "Anthropic Series H: $65B raised at a $965B valuation, May 2026.",
    c: "fact",
  },
  {
    n: 4,
    label: "Hyperscaler books an unrealized gain",
    detail:
      "Amazon booked $53.4B and Microsoft $3.2B in Q2 2026 — mark-to-market revaluations, not operating profit. Amazon's was ~66% of pre-tax income.",
    c: "fact",
  },
];

export const CIRCULARITY_WARNING =
  "These are paper gains, not operating profit, and should be excluded from any MaaS-economics assessment. The same loop applies to Google/Anthropic and Microsoft/OpenAI.";

/* ── 7 · The playbook ────────────────────────────────────────────────────── */

export type Play = {
  id: string;
  kind: string;
  title: string;
  action: string;
  metric: string;
  detail: string;
  threshold?: string;
  stage: 1 | 2;
  layer: Layer;
  c: Confidence;
};

export const PLAYBOOK: Play[] = [
  {
    id: "protect-coding",
    kind: "Protect",
    title: "Defend the coding workload",
    action: "Invest Antigravity, Gemini CLI and Code Assist; price Gemini Flash aggressively for high-volume coding.",
    metric: "Gemini coding-tool WAU and coding-token share on Vertex",
    detail:
      "Claude holds ~54% enterprise coding share and ~4% of all public GitHub commits. Antigravity's 2.4M weekly active users is promising but sub-scale. Ceding coding cedes the largest token pool.",
    threshold:
      "If Gemini coding share on Vertex falls below ~25% while Claude-on-Vertex rises, pivot to capturing the workload on Claude-via-Vertex rather than defending Gemini share.",
    stage: 1,
    layer: "models",
    c: "fact",
  },
  {
    id: "protect-f100",
    kind: "Protect",
    title: "Lock in the Fortune 100 footprint",
    action: "Convert the ~90% F100 Gemini Enterprise footprint into seats and consumption before Microsoft's unified Copilot super-app ships this quarter.",
    metric: "Gemini Enterprise seats, per-seat consumption, net retention",
    detail:
      "Gemini Enterprise enters at $21/user/month, matching Microsoft 365 Copilot Business list price. The footprint exists; the consumption does not yet follow it.",
    stage: 1,
    layer: "models",
    c: "fact",
  },
  {
    id: "expand-claude",
    kind: "Expand",
    title: "Make Vertex the best place to run Claude",
    action: "Ensure Claude latency, price and feature parity or superiority on Vertex versus Bedrock and Foundry; bundle Claude consumption into GCP committed-use discounts.",
    metric: "Claude-on-Vertex token volume and attached GCP services per Claude dollar — target >2x",
    detail:
      "Claude is now on all three clouds, so distribution exclusivity is gone. Google's counter is the TPU cost edge plus a ~14% equity stake: market “the two best models, one governed platform.”",
    stage: 1,
    layer: "hyperscalers",
    c: "inference",
  },
  {
    id: "expand-open",
    kind: "Expand",
    title: "Host compliant open weights",
    action: "Aggressively host Qwen, Kimi, DeepSeek and Mistral on Vertex to capture price-sensitive and APAC workloads.",
    metric: "Open-model token volume on Vertex; new logos citing open-model availability",
    detail:
      "Chinese open weights are ~61% of OpenRouter tokens. Treat Kimi and DeepSeek as workload-acquisition opportunities and price benchmarks — not partners to feature prominently outside China.",
    stage: 1,
    layer: "hyperscalers",
    c: "fact",
  },
  {
    id: "diff-harness",
    kind: "Differentiate",
    title: "Win the harness and orchestration layer",
    action: "Make the Vertex / Gemini Enterprise Agent Platform the neutral multi-model orchestrator — routing, eval, observability, governance, ADK — treating Gemini AND Claude AND open models as first-class.",
    metric: "Agents built and running on Vertex Agent Platform; multi-model routing adoption",
    detail:
      "This is the control point. Nadella's swappability doctrine plus Palantir, Snowflake and Databricks climbing the stack means model quality alone is insufficient.",
    stage: 2,
    layer: "economics",
    c: "inference",
  },
  {
    id: "diff-bigquery",
    kind: "Differentiate",
    title: "Exploit BigQuery data gravity",
    action: "Position Vertex as the layer where governed enterprise data meets any model.",
    metric: "Vertex workloads originating in BigQuery",
    detail: "The one thing Bedrock and Foundry cannot replicate against Google's data estate.",
    stage: 2,
    layer: "economics",
    c: "inference",
  },
  {
    id: "partner",
    kind: "Partner",
    title: "Co-sell, don't fight the control planes",
    action: "Secure Gemini as a first-class backend in Snowflake Cortex, Databricks Mosaic AI / Agent Bricks, and Palantir AIP.",
    metric: "Gemini token volume flowing through partner platforms on GCP",
    detail:
      "All three are genuinely model-agnostic and all three increase underlying cloud consumption. Compete only at the low-code agent-builder tier via Gemini Enterprise.",
    stage: 1,
    layer: "platforms",
    c: "inference",
  },
  {
    id: "monetise",
    kind: "Monetise",
    title: "Price for total account value",
    action: "Lead with cross-sell logic — accept thin Claude-reseller margin to win the account's data, compute and app spend. Use provisioned throughput, batch, prompt caching and off-peak tiers to match the open-model price floor on Gemini Flash.",
    metric: "Blended gross margin per account, not per model",
    detail:
      "Each $1 of model spend pulls an estimated $1.50–3.00 of adjacent spend. DeepSeek V4 Flash at $0.09/$0.18 is the floor Gemini Flash has to answer.",
    stage: 1,
    layer: "economics",
    c: "hypothesis",
  },
  {
    id: "compete",
    kind: "Compete",
    title: "Attack the lock-in, concede the chip",
    action: "Against Azure/OpenAI: hammer neutrality, lock-in risk and OpenAI's cash burn. Against AWS/Anthropic: concede the Trainium cost edge and win on Gemini+Claude on one platform, data integration, and TPU price/performance.",
    metric: "Win rate on multi-model enterprise deals against Azure and AWS",
    detail:
      "~45% of Microsoft's $625B commercial RPO — about $281B — was tied to OpenAI. OpenAI ran a ~−122% adjusted operating margin in Q1 2026 against Anthropic's path to profit — a point field teams can make directly.",
    stage: 1,
    layer: "hyperscalers",
    c: "fact",
  },
];

export const PLAY_KINDS = ["Protect", "Expand", "Differentiate", "Partner", "Monetise", "Compete"];

export const SEQUENCING =
  "Stage 1 (now–Q4 2026) defends and captures the OpenAI-Microsoft decoupling window. Stage 2 (2027) builds the orchestration moat.";

export type ApacTile = {
  country: string;
  lead: string;
  metric: string;
  risk: string;
  priority: "highest" | "high" | "standard";
  c: Confidence;
};

export const APAC: ApacTile[] = [
  {
    country: "Japan",
    lead: "Data residency and sovereignty via in-region Vertex; the Gemini+Claude dual-model story for manufacturing, finance and trading houses.",
    metric: "Regulated-industry new logos",
    risk: "Conservative procurement; Microsoft and AWS incumbency.",
    priority: "high",
    c: "inference",
  },
  {
    country: "Korea",
    lead: "Chaebol, gaming and entertainment multimodal workloads, plus public sector.",
    metric: "Gemini multimodal consumption",
    risk: "Naver HyperCLOVA and local sovereignty pressure.",
    priority: "standard",
    c: "inference",
  },
  {
    country: "India",
    lead: "Gemini Flash pricing plus Claude-on-Vertex for the IT-services and global capability centre coding workloads.",
    metric: "Developer sign-ups; coding-token volume",
    risk: "Price sensitivity across the services base.",
    priority: "highest",
    c: "fact",
  },
  {
    country: "Southeast Asia",
    lead: "Gemini Flash plus compliant open models (Qwen, Kimi) on Vertex; target digital-native, fintech and e-commerce.",
    metric: "Open-model + Flash token volume",
    risk: "Highly price-sensitive; open weights are the default.",
    priority: "high",
    c: "inference",
  },
  {
    country: "Australia",
    lead: "Government sovereignty and regulated sectors; Gemini Enterprise plus Vertex governance.",
    metric: "Public-sector and financial-services seats",
    risk: "Azure's public-sector strength.",
    priority: "standard",
    c: "inference",
  },
  {
    country: "Greater China",
    lead: "Do not fight Alibaba, Tencent and Qwen domestically. Serve multinationals operating in-region and capture outbound Chinese firms expanding into SE Asia via GCP.",
    metric: "Multinational and outbound-China account consumption",
    risk: "Alibaba Cloud AI at a ~$5.3B annualised pace; Qwen dominance.",
    priority: "standard",
    c: "inference",
  },
];

export const INDIA_NOTE = "India is Anthropic's #2 usage geography and a coding/developer powerhouse.";

/* ── 8 · Watch-outs ──────────────────────────────────────────────────────── */

export type Risk = {
  id: string;
  severity: 1 | 2 | 3;
  title: string;
  body: string;
  evidence: string;
  c: Confidence;
};

export const RISKS: Risk[] = [
  {
    id: "tpu",
    severity: 3,
    title: "TPU / Gemini capacity conflict",
    body: "Google committed up to ~1M scarce TPUs to Anthropic — Gemini's chief competitor — while its own DeepMind researchers reportedly queued behind paying customers.",
    evidence:
      "A genuine 1P/3P resource-allocation tension that could constrain Gemini's roadmap if demand inflects. Non-cancelable capacity commitments cannot be un-sold, and Pichai has already flagged Google as supply constrained on Gemini.",
    c: "fact",
  },
  {
    id: "circularity",
    severity: 3,
    title: "Circular ecosystem revenue",
    body: "Amazon's $53.4B and Microsoft's $3.2B Q2 gains are unrealized mark-to-market equity revaluations on lab stakes — not operating profit.",
    evidence:
      "Amazon's gain was ~66% of pre-tax income. The loop — hyperscaler invests in lab, lab buys hyperscaler compute, equity marks up — applies equally to Google/Anthropic and Microsoft/OpenAI.",
    c: "fact",
  },
  {
    id: "backlog",
    severity: 3,
    title: "Capacity booked ahead of consumption",
    body: "Much of the $514B / $496B / $638B / $678B backlogs are capacity reservations, not confirmed steady-state consumption.",
    evidence:
      "Jassy noted 2028 demand is already striking while supply is short through 2027. Capex is running ahead of monetisation everywhere: Google FCF −$5.9B in Q2, Amazon TTM FCF −$7.6B, Meta FCF $784M.",
    c: "fact",
  },
  {
    id: "grossnet",
    severity: 2,
    title: "Gross versus net reporting",
    body: "Anthropic's $47B and OpenAI's ~$25B are not directly comparable.",
    evidence:
      "Anthropic books cloud-reseller revenue gross — total end-customer spend as revenue, partner payouts as expense. Comparing it to net-reporting peers overstates the gap.",
    c: "fact",
  },
  {
    id: "metrics",
    severity: 2,
    title: "Incomparable metrics throughout",
    body: "Token growth is not revenue growth; consumer MAU is not enterprise API usage; contracted backlog is not recognised revenue.",
    evidence:
      "Equivalent-capability token prices are falling ~10x per year. Training revenue is not inference revenue, and hyperscaler infrastructure revenue is not model revenue.",
    c: "fact",
  },
  {
    id: "substitution",
    severity: 2,
    title: "Unresolved: does Claude displace Gemini?",
    body: "Does Claude usage on Vertex displace Gemini at the account level, or is it purely additive?",
    evidence:
      "Current evidence suggests complementary — enterprises use Gemini Flash for high-volume cheap tasks and Claude for premium coding and agents. But Google lacks disclosed account-level substitution data. This should be actively instrumented.",
    c: "hypothesis",
  },
  {
    id: "tpu-embedded",
    severity: 2,
    title: "The 82% embeds TPU system sales",
    body: "Google Cloud revenue includes TPU systems supplied to customer data centres, which is not recurring model consumption.",
    evidence:
      "Alphabet states that Cloud growth still accelerated meaningfully excluding TPU system sales, but does not disclose the split or the recurring-services growth rate. Read against 2026 capex guidance of $195–205B, revenue growth and economic return have to be measured separately.",
    c: "fact",
  },
  {
    id: "runrate-basis",
    severity: 2,
    title: "Run-rates are company-defined, not audited revenue",
    body: "Anthropic's $47B, Databricks' $5.4B and $6.9B, and Claude Code's $2.5B and ~$8B are annualised run-rates on differing bases and dates.",
    evidence:
      "A second research pass independently confirmed the February and April Anthropic waypoints but never reached the May Series H figure. Databricks' $5.4B is a February disclosure and its $6.9B a June one. Direction is reliable; level and comparability across bases are not.",
    c: "inference",
  },
  {
    id: "estimates",
    severity: 1,
    title: "Third-party estimates flagged",
    body: "Claude Code ARR, coding-market shares, and Mistral/Cohere revenues are analyst estimates, not audited disclosures.",
    evidence:
      "Sources: Sacra, Menlo Ventures, FutureSearch, SemiAnalysis. Mistral's ~€20B round is reported in talks (Bloomberg), not confirmed closed.",
    c: "inference",
  },
  {
    id: "benchmarks",
    severity: 1,
    title: "Benchmark volatility",
    body: "Model-quality rankings rotate every few weeks across Gemini 3.x, Claude Opus 4.x and GPT-5.x versions.",
    evidence:
      "No single model dominates, and vendor-reported benchmarks lack independent verification. Any scorecard is a snapshot, not a standing.",
    c: "fact",
  },
];


/* ── Cross-check against a second, independent research pass ─────────────── */

/**
 * A second deep-research pass over the same window (2 Feb – 2 Aug 2026) was
 * reconciled against this dataset line by line. Agreements are recorded because
 * an independently sourced match is stronger evidence than either pass alone;
 * conflicts are recorded because a site that hides them is worth less than one
 * that shows its working.
 */
export type CrossCheckKind = "agreed" | "reconciled" | "conflict" | "added" | "gap";

export type CrossCheckItem = {
  kind: CrossCheckKind;
  claim: string;
  detail: string;
};

export const CROSS_CHECK_KIND_LABEL: Record<CrossCheckKind, string> = {
  agreed: "Independently confirmed",
  reconciled: "Reconciled",
  conflict: "Conflict — corrected",
  added: "Added",
  gap: "Gap in the second pass",
};

export const CROSS_CHECK: CrossCheckItem[] = [
  {
    kind: "agreed",
    claim: "Google Cloud Q2: $24.8B, +82%, $8.8B operating income, 35.6% margin, $514B backlog",
    detail:
      "Every figure matched, including the +$50B sequential backlog move and the margin rising from 20.7%.",
  },
  {
    kind: "agreed",
    claim: "22B tokens per minute, up from 16B",
    detail: "Confirmed. The exact sequential change is +37.5%; this site rounds it to ~37%.",
  },
  {
    kind: "agreed",
    claim: "AWS $42.2B (+37%), $16.6B operating income; Snowflake $1.33B (+34%), 13,600+ AI accounts",
    detail:
      "Matched line for line. The second pass adds that AWS operating income grew 64% and derives the same ~39.4% segment margin.",
  },
  {
    kind: "agreed",
    claim: "Anthropic: $14B run-rate in February, $30B+ in April, from ~$9B at end-2025",
    detail:
      "Both waypoints confirmed from the same primary disclosures, and the >$1M customer count doubling from 500+ to 1,000+ between February and April.",
  },
  {
    kind: "reconciled",
    claim: "Palantir US $1.28B versus total revenue $1.633B",
    detail:
      "Not a conflict: 79% of $1.633B is $1.29B. The second pass supplies the total and the geographic split; this site had only the US figure.",
  },
  {
    kind: "reconciled",
    claim: "Anthropic–AWS: $13B invested versus $100B+ over ten years",
    detail:
      "Two different flows in opposite directions. AWS has invested $13B of equity into Anthropic — $8B in 2024 plus $5B in April 2026, with up to ~$25B more milestone-linked; Anthropic committed $100B+ over ten years to buy AWS technologies, securing up to 5GW. Both now appear, labelled.",
  },
  {
    kind: "reconciled",
    claim: "Databricks $5.4B versus $6.9B run-rate",
    detail:
      "Different dates, but both are company disclosures. $5.4B is the February press release; $6.9B is what Databricks told analysts on Jun 16. An earlier pass here mislabelled $6.9B as a Sacra estimate — Sacra republishes it. Both are shown, dated.",
  },
  {
    kind: "reconciled",
    claim: "Claude Code $2.5B versus ~$8B",
    detail:
      "A trajectory, not a disagreement: $2.5B+ disclosed in February, ~$8B estimated by May. The February figure is a company disclosure and is now shown alongside the estimate.",
  },
  {
    kind: "conflict",
    claim: "Gemini's context window was described as the largest",
    detail:
      "Corrected. Gemini 3 reaches 1M, but so do GPT-5.5, Claude, Qwen 3.7 Max, Kimi K3 and Grok. The scorecard now reads 1M at parity rather than a lead, and the selection-flow note was changed to match.",
  },
  {
    kind: "conflict",
    claim: "The 82% Google Cloud growth figure carried no caveat",
    detail:
      "Corrected. Cloud revenue embeds TPU system sales. Alphabet states growth still accelerated meaningfully excluding them but does not disclose the split, so the headline cannot be read as pure recurring consumption.",
  },
  {
    kind: "added",
    claim: "Alphabet 2026 capex guidance raised to $195–205B; $44.9B spent in Q2",
    detail:
      "Roughly 60% servers and 40% data centres and networking. This is the denominator the $24.8B has to earn against, and it was missing entirely.",
  },
  {
    kind: "added",
    claim: "Oracle: $75B of large AI contracts prepaid or customer-supplied hardware",
    detail:
      "A customer-funded capacity model that shifts capital off the provider's balance sheet — and makes the $638B RPO less comparable to ordinary cloud backlog than it first appears.",
  },
  {
    kind: "added",
    claim: "Microsoft Foundry: 100,000 customers, 1T-token/yr customers up 4x, 30M+ Copilot seats, ~40M agents",
    detail:
      "The strongest available evidence that the harness doctrine is backed by production consumption rather than positioning alone.",
  },
  {
    kind: "added",
    claim: "Palantir's third-party cloud-hosting cost line could not be verified",
    detail:
      "The 87% GAAP gross margin, up from 80%, is confirmed and remains the cleanest proof of the up-stack thesis. The $39M cost-of-revenue and $25M R&D hosting figures attributed to the Q1 10-Q could not be corroborated, so they were removed rather than published unverified.",
  },
  {
    kind: "added",
    claim: "Latency and time-of-day are now priced products",
    detail:
      "GPT-5.5 Batch and Flex at half price and Priority at 2.5x — and 2x input above 272K; Qwen discounting off-peak up to 80%; DeepSeek planning 2x peak rates. Price compression and yield management are running at the same time.",
  },
  {
    kind: "added",
    claim: "OpenAI raised $122B at an $852B post-money valuation, and cut prices on July 30",
    detail:
      "GPT-5.6 Luna fell 80% to $0.20/$1.20 and Terra 20% to $2/$12, with rollout beginning in AWS — funding and price competition moving together.",
  },
  {
    kind: "gap",
    claim: "The second pass never reached Anthropic's $47B",
    detail:
      "Its Anthropic evidence stops at the April disclosures, so it misses the May 28 Series H announcement of a $47B run-rate at a $965B valuation. This site's headline figure stands and is the more current of the two.",
  },
  {
    kind: "gap",
    claim: "Minor date discrepancy on Kimi K3",
    detail:
      "An earlier revision here dated the K3 launch July 15; the second pass and the verification pass both say July 16, and the site now reads mid-July / Jul 16 throughout.",
  },
];


/* ── The numbers: normalized Top-10 metrics per company ──────────────────── */

export type MetricCell = { v: string; c: Confidence; d?: string } | null;

export type CompanyMetrics = {
  company: string;
  layer: Layer;
  /** Ten cells, aligned with METRIC_COLS. null renders as an em-dash. */
  cells: MetricCell[];
};

export const METRIC_COLS: { k: string; hint: string }[] = [
  { k: "AI / cloud revenue", hint: "Annualized where the company discloses a run-rate; per-quarter where it does not" },
  { k: "Growth", hint: "Latest disclosed YoY unless noted" },
  { k: "Valuation / status", hint: "Latest priced round for private companies" },
  { k: "Customers & reach", hint: "Whatever scale metric the company itself discloses" },
  { k: "$1M+ accounts", hint: "Customers above $1M annually" },
  { k: "Backlog / RPO", hint: "Remaining performance obligations or equivalent" },
  { k: "AI capex / compute", hint: "2026 spend or committed compute" },
  { k: "Margin / profitability", hint: "As disclosed; bases differ by company" },
  { k: "Flagship price / 1M tok", hint: "List input / output per 1M tokens" },
  { k: "Strategic capital", hint: "← money in · → money out" },
];

export const METRICS_CAVEAT =
  "One row per company, whichever layers it plays in. Units are normalized to USD and annualized " +
  "where the company itself discloses a run-rate; quarterly figures are marked /qtr rather than " +
  "silently multiplied. An empty cell means no credibly sourced figure exists — not zero. Every " +
  "cell keeps its fact / inference / hypothesis tag and dims under the Facts-only filter.";

export const METRICS_TABLE: CompanyMetrics[] = [
  {
    company: "Anthropic",
    layer: "models",
    cells: [
      { v: "$47B run-rate, gross", c: "fact", d: "May 2026" },
      { v: "~5x in 5 months ($9B → $47B)", c: "fact", d: "Dec 2025 → May 2026" },
      { v: "$965B post-money · S-1 filed Jun 1", c: "fact", d: "Series H, May 2026" },
      { v: "300,000+ business customers · 70% of F100", c: "fact", d: "May 2026" },
      { v: "1,000+", c: "fact", d: "Apr 2026" },
      null,
      { v: "~$19B 2026 (analyst est.) · $100B+/10yr committed to AWS", c: "hypothesis", d: "not a disclosure" },
      null,
      { v: "Opus $5 / $25 · Fable & Mythos $10 / $50", c: "fact", d: "Aug 2026" },
      { v: "← Amazon $13B (+~$25B linked) · Google up to $40B · AMD up to $5B", c: "fact", d: "2024–Jul 2026" },
    ],
  },
  {
    company: "OpenAI",
    layer: "models",
    cells: [
      { v: "~$25B ARR, net", c: "inference", d: "crossed Feb 2026; leaked, not disclosed" },
      { v: "Reportedly flat since Feb", c: "inference", d: "The Information" },
      { v: "$852B post-money · S-1 filed Jun 8", c: "fact", d: "Mar 2026" },
      null,
      null,
      null,
      { v: "$300B/5yr committed to Oracle (press)", c: "inference", d: "from 2027" },
      { v: "~−122% adj. op margin · ~$14B projected 2026 losses", c: "inference", d: "Q1 2026, leaked" },
      { v: "GPT-5.6 Sol $5 / $30 · Luna $0.20 / $1.20", c: "fact", d: "after Jul 30 cuts" },
      { v: "← $122B raise (Amazon $50B, Nvidia + SoftBank $30B each) · → ~20% of revenue to Microsoft", c: "fact", d: "Mar 2026" },
    ],
  },
  {
    company: "Meta",
    layer: "models",
    cells: [
      { v: "$60.8B /qtr, group", c: "fact", d: "Q2 2026" },
      { v: "+28% group", c: "fact", d: "Q2 2026" },
      { v: "Public", c: "fact" },
      null,
      null,
      null,
      { v: "$130–145B 2026 guide (raised twice) · FCF $784M (−91%)", c: "fact", d: "Q2 2026" },
      null,
      { v: "Muse Spark 1.1 $1.25 / $4.25", c: "fact", d: "Jul 2026" },
      null,
    ],
  },
  {
    company: "xAI / SpaceX",
    layer: "models",
    cells: [
      { v: "~$3.2B 2025 revenue", c: "fact", d: "SpaceX S-1" },
      null,
      { v: "$230B (Jan round) · merged into SpaceX Feb 2026", c: "fact" },
      { v: "117M Grok MAU", c: "fact", d: "TTM to Mar 2026" },
      null,
      null,
      null,
      { v: "−$6.4B 2025 operating loss", c: "fact", d: "S-1" },
      { v: "Grok 4.5 $2 / $6 · Grok 4.3 $1.25 / $2.50 on Bedrock", c: "fact", d: "Jun–Jul 2026" },
      { v: "← $20B Series E", c: "fact", d: "Jan 2026" },
    ],
  },
  {
    company: "Mistral",
    layer: "models",
    cells: [
      { v: "~$400M ARR", c: "inference", d: "Jan 2026, Sacra" },
      { v: "~20x YoY · 60% of revenue from Europe", c: "inference", d: "Sacra" },
      { v: "€11.7B post · ~€20B round in talks, unclosed", c: "hypothesis", d: "Bloomberg Jun 2026" },
      null,
      null,
      null,
      null,
      null,
      { v: "Medium 3.5 $1.50 / $7.50, open weights", c: "fact", d: "Apr 2026" },
      { v: "← €1.7B ASML-led · Samsung up to €1B reported", c: "inference", d: "2025–Jul 2026" },
    ],
  },
  {
    company: "Cohere",
    layer: "models",
    cells: [
      { v: "~$240M ARR · ~85% private / on-prem", c: "inference", d: "2025, leaked memo" },
      { v: "~287% YoY", c: "inference", d: "2024 → 2025" },
      { v: "~$20B combined after Aleph Alpha merger", c: "fact", d: "Apr 2026" },
      null,
      null,
      null,
      null,
      null,
      { v: "Command A+ 218B MoE, Apache 2.0 — runs on 2 H100s at 4-bit", c: "inference", d: "May 2026" },
      { v: "← Schwarz Group €500M anchoring Series E", c: "fact", d: "Apr 2026" },
    ],
  },
  {
    company: "DeepSeek",
    layer: "models",
    cells: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      { v: "V4 Pro $0.435 / $0.87 · V4 Flash $0.14 / $0.28", c: "fact", d: "own API, Aug 2026" },
      null,
    ],
  },
  {
    company: "Moonshot (Kimi)",
    layer: "models",
    cells: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      { v: "K3 $3 / $15, 1M ctx · K2.7 Code $0.95 / $4", c: "fact", d: "Jul 2026" },
      null,
    ],
  },
  {
    company: "Google / Alphabet",
    layer: "hyperscalers",
    cells: [
      { v: "Cloud $24.8B /qtr", c: "fact", d: "Q2 2026" },
      { v: "+82% (embeds TPU system sales)", c: "fact", d: "Q2 2026" },
      { v: "Public", c: "fact" },
      { v: "Gemini app 950M MAU · ~90% of F100 on Gemini Enterprise", c: "fact", d: "Jul 2026" },
      null,
      { v: "$514B backlog (+>$50B seq.)", c: "fact", d: "Q2 2026" },
      { v: "$195–205B 2026 guide · first negative-FCF quarter", c: "fact", d: "raised Jul 2026" },
      { v: "Cloud op income $8.8B (~36% margin, derived)", c: "inference", d: "Q2 2026" },
      { v: "Gemini 3.1 Pro $2 / $12 ≤200K ctx", c: "fact", d: "$4 / $18 above" },
      { v: "→ Anthropic ~14% stake, up to $40B committed", c: "fact", d: "Apr 2026" },
    ],
  },
  {
    company: "Microsoft",
    layer: "hyperscalers",
    cells: [
      { v: "Azure $100B+ FY26 actual", c: "fact", d: "FY ended Jun 2026" },
      { v: "+41% FY26 · +43% in Q4", c: "fact" },
      { v: "Public", c: "fact" },
      { v: "Foundry 100K customers · Copilot 30M+ seats · ~40M agents", c: "fact", d: "Jul 2026" },
      null,
      { v: "$678B commercial RPO (+84%; +25% ex-OpenAI)", c: "fact", d: "Q4 FY26" },
      null,
      null,
      null,
      { v: "→ OpenAI stake (non-exclusive since Apr) · → Anthropic stake, +$3.2B unrealized in Q2", c: "fact", d: "Jul 2026" },
    ],
  },
  {
    company: "Amazon / AWS",
    layer: "hyperscalers",
    cells: [
      { v: "AWS $42.2B /qtr (~$169B ann., derived)", c: "fact", d: "Q2 2026" },
      { v: "+37%", c: "fact", d: "Q2 2026" },
      { v: "Public", c: "fact" },
      { v: "100,000+ Bedrock customers running Claude", c: "fact", d: "Jul 2026" },
      null,
      { v: "$496B RPO, up from $364B", c: "fact", d: "Q2 2026" },
      { v: "Net PP&E purchases +$66B YoY · TTM FCF −$7.6B", c: "fact", d: "Jun 2026" },
      { v: "39.4% AWS op margin (derived)", c: "fact", d: "Q2 2026" },
      null,
      { v: "→ Anthropic $13B invested, up to ~$25B more milestone-linked", c: "fact", d: "2024–Apr 2026" },
    ],
  },
  {
    company: "Oracle",
    layer: "hyperscalers",
    cells: [
      { v: "OCI $5.8B /qtr · total cloud $9.9B /qtr", c: "fact", d: "Q4 FY26" },
      { v: "OCI +93% · Multicloud DB +404%", c: "fact", d: "Q4 FY26" },
      { v: "Public", c: "fact" },
      null,
      null,
      { v: "$638B RPO (+363%)", c: "fact", d: "Q4 FY26" },
      { v: "$75B of large-AI-contract capacity prepaid or customer-supplied", c: "fact", d: "Jun 2026" },
      null,
      null,
      { v: "← OpenAI $300B/5yr commitment (terms press-reported)", c: "inference", d: "from 2027" },
    ],
  },
  {
    company: "Alibaba",
    layer: "hyperscalers",
    cells: [
      { v: "Cloud RMB41.6B /qtr (~$6B) · AI ~$5.3B ann. (derived)", c: "inference", d: "Mar qtr 2026" },
      { v: "Cloud +38% · AI triple-digit, 11 straight qtrs", c: "fact", d: "Mar qtr 2026" },
      { v: "Public", c: "fact" },
      { v: "Qwen 1B+ HF downloads · 200K+ derivative models", c: "fact", d: "Jan 2026" },
      null,
      null,
      null,
      { v: "Cloud adj. EBITA +57%", c: "fact", d: "Mar qtr 2026" },
      { v: "Qwen3.7-Max $2.50 / $7.50 ($1.25 / $3.75 promo)", c: "fact", d: "Aug 2026" },
      null,
    ],
  },
  {
    company: "Tencent",
    layer: "hyperscalers",
    cells: [
      { v: "Cloud not separately disclosed", c: "fact", d: "Q1 2026" },
      { v: "Group +9%", c: "fact", d: "Q1 2026" },
      { v: "Public", c: "fact" },
      null,
      null,
      null,
      { v: "Capex RMB31.9B /qtr (+16%)", c: "fact", d: "Q1 2026" },
      { v: "IFRS op profit RMB67.4B · non-IFRS RMB75.6B, RMB84.4B ex-new-AI", c: "fact", d: "Q1 2026" },
      null,
      null,
    ],
  },
  {
    company: "Databricks",
    layer: "platforms",
    cells: [
      { v: "$6.9B ARR · AI products $1.4B of the Feb $5.4B", c: "fact", d: "disclosed Jun 16 2026" },
      { v: ">80% YoY · NRR >140%", c: "fact", d: "Jun 2026" },
      { v: "$188B (Coatue round)", c: "fact", d: "Jul 17 2026" },
      { v: "20,000+ orgs · >60% of F500", c: "fact", d: "Feb 2026" },
      { v: "800+ ($1M+) · >70 ($10M+)", c: "fact", d: "Feb 2026" },
      null,
      null,
      null,
      null,
      { v: "← ~$3B Coatue-led · ~$5B + $2B debt in Feb", c: "fact", d: "2026" },
    ],
  },
  {
    company: "Snowflake",
    layer: "platforms",
    cells: [
      { v: "Product $1.33B /qtr · FY27 guide $5.84B", c: "fact", d: "Q1 FY27" },
      { v: "+34% · NRR 126%", c: "fact", d: "Q1 FY27" },
      { v: "Public", c: "fact" },
      { v: "13,912 customers · 13,600+ using AI · Cortex Code in 7,100+", c: "fact", d: "Apr 2026" },
      { v: "779", c: "fact", d: "Q1 FY27" },
      null,
      null,
      null,
      null,
      { v: "→ $6B AWS agreement · $200M each with OpenAI and Anthropic", c: "fact", d: "May 2026" },
    ],
  },
  {
    company: "Palantir",
    layer: "platforms",
    cells: [
      { v: "$1.633B /qtr · FY26 guide $7.65B+", c: "fact", d: "Q1 2026" },
      { v: "+85% · US commercial +133%", c: "fact", d: "Q1 2026" },
      { v: "Public", c: "fact" },
      { v: "Top-20 customers avg $108M TTM (+55%)", c: "fact", d: "Q1 2026" },
      null,
      { v: "US commercial remaining deal value $4.92B (+112%)", c: "fact", d: "Q1 2026" },
      null,
      { v: "87% GAAP gross margin · Rule of 40: 145%", c: "fact", d: "Q1 2026" },
      null,
      null,
    ],
  },
];

/* ── Zones ───────────────────────────────────────────────────────────────── */

export type Zone = { n: number; id: string; label: string; kicker: string };

export const ZONES: Zone[] = [
  { n: 1, id: "hero", label: "The thesis", kicker: "State of Model-as-a-Service" },
  { n: 2, id: "map", label: "The stack", kicker: "Mind map" },
  { n: 3, id: "demand", label: "Where demand lives", kicker: "Run-rate & workload mix" },
  { n: 4, id: "choose", label: "How enterprises choose", kicker: "Selection flow" },
  { n: 5, id: "scoreboard", label: "The scoreboard", kicker: "Three matrices" },
  { n: 6, id: "dollar", label: "Follow the dollar", kicker: "MaaS economics" },
  { n: 7, id: "playbook", label: "The playbook", kicker: "Nine moves + JAPAC" },
  { n: 8, id: "risks", label: "Watch-outs", kicker: "Open risks" },
];
