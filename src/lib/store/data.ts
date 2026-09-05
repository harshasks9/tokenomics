/**
 * THE AI DEPARTMENT STORE — structured content.
 * Product names follow current official Google Cloud terminology
 * (Gemini Enterprise Agent Platform, formerly Vertex AI). Model examples use
 * family names so nothing goes stale with a version number.
 */

export type FloorId = "rooftop" | "agents" | "models" | "data" | "build" | "govern" | "foundation";

export type Floor = {
  id: FloorId;
  level: string;
  name: string;
  metaphor: string;
  products: string[];
  summary: string;
  detail: string;
  accent: string;
  sectionId: string;
};

/* Colour is used to tell layers apart, not to decorate. */
export const accent = {
  google: "#1a73e8",
  partner: "#b26a00",
  open: "#188038",
  agents: "#5e35b1",
  data: "#00796b",
  security: "#c5221f",
  infra: "#3f51b5",
  people: "#1a73e8",
  ink: "#111318",
};

export const floors: Floor[] = [
  {
    id: "rooftop",
    level: "Rooftop",
    name: "People",
    metaphor: "The front door and the concierge",
    products: ["Gemini Enterprise"],
    summary: "Where employees enter, search enterprise information, discover agents and get work done.",
    detail:
      "One interface into enterprise AI. Employees search across enterprise information, discover and use agents, create their own, and execute work across connected systems such as Google Workspace and Microsoft 365. Permissions come with the person.",
    accent: accent.people,
    sectionId: "map",
  },
  {
    id: "agents",
    level: "Floor 5",
    name: "Agents",
    metaphor: "Ready-to-wear, the design studio, and associates working together",
    products: ["Agent Garden", "Agent Studio", "Agent Development Kit", "Multi-agent systems"],
    summary: "Start from a proven pattern, or design your own. Specialised agents collaborate instead of one agent doing everything.",
    detail:
      "Agent Garden is a library of prebuilt agents and templates. Agent Studio is a low-code visual canvas. The Agent Development Kit is open source and model-agnostic. Different specialised agents can hand work to each other rather than forcing one agent to do everything.",
    accent: accent.agents,
    sectionId: "build",
  },
  {
    id: "models",
    level: "Floor 4",
    name: "Models",
    metaphor: "The model floor: house brand, premium brands, independent brands",
    products: ["Model Garden", "Gemini 3.1 Pro · 3.8 Flash · 3.5 Flash-Lite", "Claude Fable 5.1 · Opus 5 · Sonnet 5 · Haiku 4.5", "Grok 4.6 · Codestral 2", "Gemma 4 · DeepSeek-V3.2 · GLM 5.2 · Kimi K2 · Qwen3-Next"],
    summary: "Shop for the right intelligence for the job across 200+ Google, partner and open models, in four tiers: frontier, workhorse, efficient, specialist.",
    detail:
      "Model Garden is one place to discover more than 200 models. Google's own line runs from Gemini 3.1 Pro (frontier) through Gemini 3.8 Flash (the workhorse) to Gemini 3.5 Flash-Lite (efficient), with Veo, Imagen and Lyria as specialists. Partner brands such as Anthropic Claude, xAI Grok and Mistral AI sit on the same shelf as managed APIs. Open models from Google, DeepSeek, Zhipu, Moonshot and Alibaba are managed or self-deployed. The store carries its own flagship label and does not force you to buy it.",
    accent: accent.google,
    sectionId: "models",
  },
  {
    id: "data",
    level: "Floor 3",
    name: "Data + Tools",
    metaphor: "The stockroom, the customer memory, and the corridors between departments",
    products: ["Data Cloud", "BigQuery", "RAG and grounding", "Connectors", "APIs, MCP, A2A"],
    summary: "Models become useful when they work with trusted enterprise context and can reach the systems that do the work.",
    detail:
      "Enterprise data in BigQuery and other databases, documents, enterprise search, Workspace, Microsoft 365 and SaaS systems ground every answer. Open interfaces — APIs, MCP tools, A2A agents and connectors — let systems, tools and agents interoperate instead of becoming islands.",
    accent: accent.data,
    sectionId: "data",
  },
  {
    id: "build",
    level: "Floor 2",
    name: "Build + Runtime",
    metaphor: "The workshop and the operations floor",
    products: ["Agent Runtime", "Memory Bank", "Agent Simulation", "Deployment"],
    summary: "Take an agent from prototype to production, then keep it running at scale.",
    detail:
      "Agent Runtime clears the path to production: managed, scalable execution for agents, with persistent memory for long-running work. Access to models alone is not an enterprise AI system; this floor is the production system around them.",
    accent: accent.infra,
    sectionId: "operations",
  },
  {
    id: "govern",
    level: "Floor 1",
    name: "Govern + Optimize",
    metaphor: "Security guards, access badges, loss prevention and quality control",
    products: ["Agent Identity", "Agent Registry", "Agent Gateway", "Model Armor", "CodeMender", "AI Protection", "Agent Evaluation", "Agent Observability"],
    summary: "Control which agents reach which systems, protect every interaction, and know how agents are performing.",
    detail:
      "Agent Identity gives every agent an identity and granular permissions; Agent Registry keeps track of every agent, built here or sourced from partners. Agent Gateway is the policy enforcement point for agent, tool and user interactions. Model Armor screens prompts and responses for injection, harmful content and sensitive-data leakage. CodeMender finds, proves and fixes vulnerabilities in the code you build here; AI Protection and Agent Platform Threat Detection in Security Command Center watch the agents while they run. Evaluation and observability show what an agent did and whether it was any good.",
    accent: accent.security,
    sectionId: "governance",
  },
  {
    id: "foundation",
    level: "Foundation",
    name: "AI Hypercomputer",
    metaphor: "The loading docks and the power plant",
    products: ["AI Hypercomputer", "TPUs", "GPUs", "Networking and storage"],
    summary: "The infrastructure underneath the experience: performance, scale and economics you don't have to see.",
    detail:
      "AI Hypercomputer combines performance-optimised hardware, open software and flexible consumption. TPUs and GPUs, networking, storage and serving infrastructure are operated by Google so enterprises can optimise for performance, latency, scale and economics.",
    accent: accent.infra,
    sectionId: "infrastructure",
  },
];

export const column = ["Identity", "Security", "Governance", "Open Standards"];

export const nav = [
  { id: "problem", label: "The problem" },
  { id: "analogy", label: "Think of the store" },
  { id: "switch", label: "Why optionality" },
  { id: "different", label: "Why different" },
  { id: "talk", label: "The whole idea" },
  { id: "map", label: "Map the store" },
  { id: "journey", label: "Customer journey" },
  { id: "models", label: "Model Garden" },
  { id: "build", label: "Build agents" },
  { id: "data", label: "Data" },
  { id: "openness", label: "Openness" },
  { id: "governance", label: "Governance" },
  { id: "security", label: "Security" },
  { id: "operations", label: "Operations" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "archetypes", label: "Four archetypes" },
  { id: "final", label: "The point" },
] as const;

export const sectionFloor: Record<string, FloorId | "column" | null> = {
  problem: null,
  analogy: null,
  switch: "models",
  different: null,
  talk: null,
  map: null,
  journey: null,
  models: "models",
  build: "agents",
  data: "data",
  openness: "column",
  governance: "govern",
  security: "govern",
  operations: "build",
  infrastructure: "foundation",
  archetypes: null,
  final: null,
};

/* ------------------------------------------------------------------ */
/* Copy                                                                 */
/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: "Google Cloud",
  headline: ["Don't bet on the winning model.", "Pick the right store."],
  support: "No enterprise wants to bet its AI strategy on one model, one vendor or one generation of technology. Everyone wants one trusted place that carries the best option for every need.",
  cta: "Start with the store",
};

export const problem = {
  eyebrow: "01 · The customer problem",
  title: ["The bet nobody can make."],
  lead: "Every enterprise is being asked to place the same bet. Which model, which vendor, which architecture will still be right in three years?",
  bets: [
    { q: "Which model will be best in twelve months?", a: "Nobody knows. Not us, not them. The leaderboard has changed hands repeatedly and will again." },
    { q: "Which vendor will lead in three years?", a: "Every provider has had a great season. None has had every season." },
    { q: "Which architecture survives the next generation?", a: "Only the one that does not depend on the answer to the first two questions." },
  ],
  wantTitle: "What enterprises actually want",
  wants: ["One trusted place.", "The best option for every need.", "The freedom to change their mind without rebuilding."],
};

export const analogy = {
  eyebrow: "02 · The analogy",
  title: ["Think of the best department store", "in your city."],
  lead: "You don’t go there because it makes everything. You go because it chooses well, and everything works under one roof.",
  points: [
    { title: "Choice", body: "Every serious brand, side by side on the same floor." },
    { title: "Curation", body: "The buyers have already done the sorting. Not one of everything; the right things." },
    { title: "One building", body: "One entrance, one card, one returns desk, one loyalty programme." },
    { title: "One standard", body: "The same service, security and guarantee whichever brand you pick." },
  ],
  result: "Optionality without chaos",
  insight: "Google Cloud is the department store of enterprise AI. Gemini is our house brand and it sits on the front rack. But the same shelves carry Claude, Grok, Mistral, DeepSeek, Gemma and hundreds more, and every one of them runs on the same building: the same security, the same data, the same operations, the same bill.",
  ask: "The question for the board is not which model to bet on. It is which store to shop in.",
};

export const different = {
  eyebrow: "04 · Why this is different",
  title: ["Betting on one house,", "or planning for change."],
  lead: "A single-brand store asks you to believe one house wins every category forever. A department store assumes innovation stays fragmented, and gives you whichever brand wins. The difference is not which model is best this quarter; it is what each strategy assumes about the future.",
  boutique: {
    title: "The single-brand store",
    assumes: "Assumes one provider will win every category, every year.",
    points: ["Your whole wardrobe follows one house’s taste, pricing and roadmap.", "A bad season for them is a bad season for you.", "Changing your mind means moving house."],
  },
  store: {
    title: "The department store",
    assumes: "Assumes innovation will stay fragmented, and plans for it.",
    points: ["Whichever brand wins a category is already on the shelf.", "You change the product, not the building.", "Security, data and operations are the store’s job, not the brand’s."],
  },
  google: {
    title: "Google’s differentiation",
    not: "Not “our model is always the best.”",
    but: "The best model for the job today. A different one tomorrow if the market moves. One enterprise platform throughout.",
  },
};

export const talk = {
  eyebrow: "05 · The whole idea",
  title: ["The whole idea, in ninety seconds."],
  lead: "Simple, visual, repeatable. Read it before anyone explains the technology; the rest of this page only proves it.",
  script: [
    "Every enterprise is being asked to make the same bet: pick the model, pick the vendor, pick the architecture that will still be right in three years. Nobody can make that bet honestly.",
    "So think of the best department store in your city. You don’t shop there because it makes everything. You shop there because it chooses well, and everything works under one roof: one entrance, one card, one returns desk, one standard of service whichever brand you pick.",
    "Google Cloud is the department store of enterprise AI. Gemini is our house brand, and it’s on the front rack. But the same shelves carry Claude, Grok, Mistral, DeepSeek, Gemma and hundreds more. Same checkout, same security, same audit trail, same contract.",
    "Underneath is one platform. Your data grounds every answer in your business. Security and governance wrap the whole building, so adding a model never means adding a risk review. And the doors open both ways: bring what you’ve built, take out what you build here.",
    "The point is simple. You shouldn’t have to predict the winner. You should be able to choose the best capability for every job today, change it tomorrow when the market moves, and never rebuild the store.",
  ],
  button: "Copy these five paragraphs",
  copied: "Copied",
  hint: "Share them as they are. They are the whole argument.",
};

export const mapping = {
  eyebrow: "06 · Map the store to the platform",
  title: ["Every part of the store", "has a name on the platform."],
  lead: "Walk the building from the front door down. Each part of the store is one part of Google Cloud’s AI platform.",
  rows: [
    { store: "The store itself", platform: "Google Cloud AI platform: Gemini Enterprise Agent Platform", means: "One operating environment across build, scale, govern and optimise. The building everything else sits in." },
    { store: "The front door and the concierge", platform: "Gemini Enterprise", means: "Where employees enter, ask, find agents and get work done, with their existing permissions." },
    { store: "The brands and departments", platform: "Google models, partner models, open models, specialised capabilities", means: "Gemini on the front rack; Claude, Grok, Mistral, DeepSeek, Gemma and specialists for image, video, speech and code alongside." },
    { store: "The breadth of the shelf", platform: "Model Garden", means: "More than 200 models under one roof, in four tiers: frontier, workhorse, efficient, specialist." },
    { store: "The customer’s own measurements", platform: "Data and grounding: BigQuery, enterprise search, RAG, connectors", means: "The context that decides what is relevant. Your data makes every answer yours, and it is never used to train public models." },
    { store: "The finished outfit", platform: "Agents and applications: Agent Garden, Agent Studio, ADK, Agent Runtime", means: "What the customer actually consumes: an agent that does a job from start to finish, assembled from models, tools and data." },
    { store: "Security, standards and quality control", platform: "Agent Identity, Agent Gateway, Model Armor, evaluation, observability", means: "Common standards across the entire store. Add a brand and it inherits the controls." },
    { store: "The building, logistics and supply chain", platform: "AI Hypercomputer: TPUs, GPUs, networking, storage", means: "Everything customers don’t see but depend on: performance, scale and economics." },
  ],
  exploreTitle: "Walk the floors",
  exploreLead: "Seven levels. One structural column. Click a floor.",
};

export const idea = {
  title: "Welcome to the AI Department Store",
  lead: "A department store doesn't win because it has many products. A catalogue has many products.",
  body: "It wins because it combines choice with curation, premium first-party products with third-party brands, and a common building underneath: shared infrastructure, shared security, shared services, one coherent customer experience.",
  terms: ["Choice", "Curation", "Common platform", "Governance"],
  result: "Optionality without chaos",
  distinction: {
    title: "The distinction that matters",
    body: "Model Garden is not the department store. Model Garden is the model floor inside it. The store is Gemini Enterprise, Gemini Enterprise Agent Platform, Data Cloud, AI infrastructure and the partner ecosystem, working as one operating model.",
  },
  positioning:
    "Build your AI strategy around a platform where you can continuously choose the right model, agent, data, infrastructure and ecosystem for each workload, while keeping common security, governance and operations underneath.",
};

export const explore = {
  eyebrow: "Section 03",
  title: "Explore the store",
  lead: "Seven levels. One structural column. Click a floor.",
};

/* Model Garden — verified against Google Cloud documentation. */
export const verifiedOn = "5 September 2026";

export type Tier = "frontier" | "workhorse" | "efficient" | "specialist";
export const tiers: { id: Tier; label: string; tagline: string; exec: string }[] = [
  { id: "frontier", label: "Frontier", tagline: "The hardest problems.", exec: "Deepest reasoning, long-horizon agents, highest cost per token. Use where the answer is worth it." },
  { id: "workhorse", label: "Workhorse", tagline: "The everyday default.", exec: "Near-frontier quality at a cost profile that runs agents at scale. Most production work lives here." },
  { id: "efficient", label: "Efficient", tagline: "Volume and latency.", exec: "Classification, routing, extraction, real-time service. Fast, cheap, good enough by design." },
  { id: "specialist", label: "Specialist", tagline: "One job, done well.", exec: "Image, video, music, speech, code, documents, embeddings. Built for a task rather than every task." },
];

export type ShelfModel = { name: string; maker: string; tier: Tier; note: string; released: string; preview?: boolean };

/**
 * Recency rule: a model is featured only if it was released or materially
 * refreshed within the last twelve months (September 2025 onward). Every
 * entry carries its release month so the reader can judge for themselves.
 */
export const recencyRule = "Featured models were released within the last twelve months. Older families stay on the shelf but are not shown here.";
export const olderOnShelf = "Also available but not featured: Llama 4 Maverick and Scout (Apr 2025), Qwen3 235B and Qwen3 Coder (2025), gpt-oss 120B and 20B (Aug 2025), Mistral Medium 3, Small 3.1 and OCR (2025), AI21 Jamba 1.5 (2024), and earlier Claude, Gemini and Gemma generations.";

export const modelCategories: {
  id: "google" | "partner" | "open";
  label: string;
  metaphor: string;
  accent: string;
  body: string;
  access: string;
  models: ShelfModel[];
}[] = [
  {
    id: "google",
    label: "Google",
    metaphor: "The flagship in-house label",
    accent: accent.google,
    body: "Gemini and Google’s specialised models. Deeply integrated with the rest of the store, and never the only thing on the shelf.",
    access: "Managed APIs on Agent Platform. Gemma 4 is also available as an open model.",
    models: [
      { name: "Gemini 3.1 Pro", maker: "Google", tier: "frontier", released: "Feb 2026", note: "Most advanced reasoning model; 1M-token context; text, audio, image, video, PDF and whole code repositories.", preview: true },
      { name: "Gemini 3.8 Flash", maker: "Google", tier: "workhorse", released: "Sep 2026", note: "Most intelligent workhorse model; software engineering, agentic tasks, multi-step reasoning; often approaches frontier performance at lower cost." },
      { name: "Gemini 3.5 Flash-Lite", maker: "Google", tier: "efficient", released: "Jul 2026", note: "Cost-effective line for simple coding, precise document understanding and lightweight agents; built for high-throughput classification and extraction." },
      { name: "Gemini 3.1 Flash Image", maker: "Google", tier: "specialist", released: "May 2026", note: "Image understanding and generation at a balance of price and performance." },
      { name: "Gemini 3 Pro Image", maker: "Google", tier: "specialist", released: "Nov 2025", note: "Text-to-image for the highest-fidelity creative work." },
      { name: "Gemini Omni 1.1 Flash", maker: "Google", tier: "specialist", released: "Aug 2026", note: "Video, image and text in one model, with video output alongside text.", preview: true },
      { name: "Veo 3.1", maker: "Google", tier: "specialist", released: "Oct 2025", note: "Text-to-video and image-to-video." },
      { name: "Lyria 3", maker: "Google", tier: "specialist", released: "Feb 2026", note: "Music generation." },
      { name: "Gemini 3.5 Transcribe · Live Translate", maker: "Google", tier: "specialist", released: "Jul 2026", note: "Speech to text and live translation in the Gemini 3.5 line." },
      { name: "Gemini Embedding 2", maker: "Google", tier: "specialist", released: "Apr 2026", note: "Natively multimodal embeddings for search, retrieval and grounding." },
    ],
  },
  {
    id: "partner",
    label: "Partner models",
    metaphor: "Premium brands carried inside the store",
    accent: accent.partner,
    body: "Frontier models from other providers, sold as managed APIs inside the same environment, governed by the same platform, billed on the same account.",
    access: "Managed APIs (model as a service). No infrastructure to run.",
    models: [
      { name: "Claude Fable 5.1", maker: "Anthropic", tier: "frontier", released: "Sep 2026", note: "Anthropic’s newest top-tier model: autonomous knowledge work and coding; long-running, complex and asynchronous tasks." },
      { name: "Claude Opus 5", maker: "Anthropic", tier: "frontier", released: "Jul 2026", note: "Most advanced Opus model: long-running agents, ambitious coding, deep professional and financial analysis, computer use." },
      { name: "Grok 4.6", maker: "xAI", tier: "frontier", released: "Aug 2026", note: "xAI’s most capable model for coding, agentic tasks and knowledge work.", preview: true },
      { name: "Claude Sonnet 5", maker: "Anthropic", tier: "workhorse", released: "Jun 2026", note: "Most capable Sonnet yet; lead agent or sub-agent in production pipelines with the cost profile to run high-volume agentic work." },
      { name: "Grok 4.20", maker: "xAI", tier: "workhorse", released: "Mar 2026", note: "Reasoning and non-reasoning variants; document understanding and long-horizon tool calling.", preview: true },
      { name: "Claude Haiku 4.5", maker: "Anthropic", tier: "efficient", released: "Oct 2025", note: "Anthropic’s current small model: near-frontier performance at the speed and cost for service agents, sub-agents and high-volume experiences." },
      { name: "Grok 4.1 Fast", maker: "xAI", tier: "efficient", released: "Nov 2025", note: "xAI’s most cost-effective model; search, summarisation and categorisation at volume.", preview: true },
      { name: "Codestral 2", maker: "Mistral AI", tier: "specialist", released: "Apr 2026", note: "Code generation and fill-in-the-middle completion." },
    ],
  },
  {
    id: "open",
    label: "Open models",
    metaphor: "Independent brands and specialist products",
    accent: accent.open,
    body: "Open-weights choices from Google and the wider community. Managed as a service, or, for supported models, self-deployed into your own environment with your own weights.",
    access: "Managed APIs, or one-click self-deployment for supported models.",
    models: [
      { name: "DeepSeek-V3.2", maker: "DeepSeek", tier: "frontier", released: "Dec 2025", note: "Computational efficiency with strong reasoning and agent performance; the reasoning tier of the open shelf." },
      { name: "Kimi K2 Thinking", maker: "Moonshot AI", tier: "frontier", released: "Nov 2025", note: "Open thinking-agent model that reasons step by step and uses tools." },
      { name: "Qwen3-Next-80B Thinking", maker: "Alibaba", tier: "frontier", released: "Sep 2025", note: "Complex problem-solving and deep reasoning in the Qwen3-Next family." },
      { name: "GLM 5.2", maker: "Zhipu AI", tier: "workhorse", released: "Jun 2026", note: "Long-horizon agentic and coding tasks with a 1M-token context window; the newest open workhorse on the shelf." },
      { name: "Gemma 4 26B", maker: "Google", tier: "efficient", released: "Apr 2026", note: "Google’s open multimodal model; a house label you can take with you." },
      { name: "Qwen3-Next-80B Instruct", maker: "Alibaba", tier: "efficient", released: "Sep 2025", note: "Instruction-following at a small active-parameter cost." },
      { name: "DeepSeek-OCR", maker: "DeepSeek", tier: "specialist", released: "Oct 2025", note: "Optical character recognition for complex documents." },
      { name: "MiniMax M2", maker: "MiniMax", tier: "specialist", released: "Oct 2025", note: "Agentic and code tasks: planning and executing complex tool calls." },
    ],
  },
];

export const modelGarden = {
  eyebrow: "Proof 01 · Floor 4",
  title: ["Shop by outcome.", "Not by brand."],
  lead: "Model Garden is one place to discover more than 200 models. The shelf below is this generation only, sorted the way a buyer thinks: by the job, not the logo.",
  howToRead: "Four tiers run across every shelf. Premium is a tier, not a brand: each shelf carries a frontier model, a workhorse and an efficient option. " + recencyRule,
  factors: ["Intelligence", "Latency", "Modality", "Cost", "Sovereignty", "Customisation", "Deployment requirements"],
  caveat: "Deployment options differ by model: partner models are managed APIs; open models are managed or, where supported, self-deployed. Items marked Preview are pre-GA. " + olderOnShelf,
  verified: "Names, tiers and release months verified against Google Cloud documentation and provider announcements on 5 September 2026.",
  matrixTitle: "The shelf at a glance",
  matrix: [
    { tier: "frontier", google: "Gemini 3.1 Pro (Preview)", partner: "Claude Fable 5.1 · Claude Opus 5 · Grok 4.6 (Preview)", open: "DeepSeek-V3.2 · Kimi K2 Thinking · Qwen3-Next-80B Thinking" },
    { tier: "workhorse", google: "Gemini 3.8 Flash", partner: "Claude Sonnet 5 · Grok 4.20", open: "GLM 5.2" },
    { tier: "efficient", google: "Gemini 3.5 Flash-Lite", partner: "Claude Haiku 4.5 · Grok 4.1 Fast", open: "Gemma 4 26B · Qwen3-Next-80B Instruct" },
    { tier: "specialist", google: "Gemini 3.1 Flash Image · Gemini Omni 1.1 Flash · Veo 3.1 · Lyria 3 · Gemini Embedding 2", partner: "Codestral 2", open: "DeepSeek-OCR · MiniMax M2" },
  ],
};

/* Model switch */
export type ModelChip = { name: string; category: "google" | "partner" | "open"; note: string };

export const useCases: { id: string; label: string; agent: string; why: string; models: ModelChip[] }[] = [
  {
    id: "research",
    label: "Research",
    agent: "Research agent",
    why: "Deep reading across long documents and many sources. Frontier reasoning earns its cost here.",
    models: [
      { name: "Gemini 3.1 Pro", category: "google", note: "Frontier · 1M-token context · Preview" },
      { name: "Claude Opus 5", category: "partner", note: "Frontier · deep analysis, long-running agents" },
      { name: "DeepSeek-V3.2", category: "open", note: "Open reasoning tier · managed or self-deployed" },
    ],
  },
  {
    id: "coding",
    label: "Coding",
    agent: "Coding agent",
    why: "Everyday development at scale: features, refactors, reviews. The workhorse tier does most of the work; frontier for the hardest migrations.",
    models: [
      { name: "Gemini 3.8 Flash", category: "google", note: "Workhorse · software engineering and agentic tasks" },
      { name: "Claude Sonnet 5", category: "partner", note: "Workhorse · built for coding and agents at scale" },
      { name: "GLM 5.2", category: "open", note: "Open workhorse · long-horizon coding, 1M-token context" },
    ],
  },
  {
    id: "service",
    label: "Customer service",
    agent: "Service agent",
    why: "Latency and cost per conversation decide this one. Near-frontier quality at efficient-tier prices.",
    models: [
      { name: "Gemini 3.5 Flash-Lite", category: "google", note: "Efficient · fast inference at minimal cost" },
      { name: "Claude Haiku 4.5", category: "partner", note: "Efficient · built for real-time service agents" },
      { name: "Gemma 4 26B", category: "open", note: "Open · managed or self-deployed for sovereignty" },
    ],
  },
  {
    id: "documents",
    label: "Document processing",
    agent: "Document agent",
    why: "Reading filings, forms and tables at volume. A specialist OCR model in front of a workhorse is often the right pairing.",
    models: [
      { name: "Gemini 3.8 Flash", category: "google", note: "Workhorse · multimodal document understanding" },
      { name: "Claude Sonnet 5", category: "partner", note: "Workhorse · documents, spreadsheets, office files at scale" },
      { name: "DeepSeek-OCR", category: "open", note: "Open specialist · complex document OCR" },
    ],
  },
  {
    id: "video",
    label: "Image and video",
    agent: "Creative agent",
    why: "Generation is specialist work. The choice is between Google’s own media models; the platform underneath is the same.",
    models: [
      { name: "Veo 3.1", category: "google", note: "Specialist · text-to-video and image-to-video" },
      { name: "Gemini 3.1 Flash Image", category: "google", note: "Specialist · image generation and understanding" },
      { name: "Gemini Omni 1.1 Flash", category: "google", note: "Specialist · video output alongside text · Preview" },
    ],
  },
  {
    id: "classification",
    label: "High-volume classification",
    agent: "Classification agent",
    why: "Millions of small decisions. The efficient tier exists for exactly this; anything bigger is paying for reasoning you do not use.",
    models: [
      { name: "Gemini 3.5 Flash-Lite", category: "google", note: "Efficient · minimal thinking for routing and extraction" },
      { name: "Grok 4.1 Fast", category: "partner", note: "Efficient · summarisation and categorisation at volume · Preview" },
      { name: "Qwen3-Next-80B Instruct", category: "open", note: "Open efficient · small active-parameter cost" },
    ],
  },
];

export const modelSwitch = {
  eyebrow: "03 · Why optionality matters",
  title: ["Switch the model.", "Not the architecture."],
  lead: "Optionality is the hero of this story. You don’t know which model will win tomorrow. In a department store, you don’t have to.",
  kicker: "One use case. Multiple choices.",
  layers: ["Data", "Security", "Governance", "Operations", "Infrastructure"],
  platform: "Common Google Cloud platform",
  button: "Switch the model",
  unchanged: "Unchanged",
};

/* Build */
export const buildSection = {
  eyebrow: "Proof 02 · Floor 5",
  title: ["Don't just buy products.", "Build new ones."],
  lead: "Google Cloud meets developers where they are rather than forcing one development approach.",
  paths: [
    {
      id: "studio",
      label: "No / low code",
      product: "Agent Studio",
      body: "A low-code visual canvas for designing, prototyping and managing agent reasoning loops and workflows.",
    },
    {
      id: "adk",
      label: "Code",
      product: "Agent Development Kit",
      body: "An open-source, model-agnostic framework for building and deploying complex agents. Use models and frameworks beyond Google's own.",
    },
  ],
  parts: ["Model", "Instructions", "Tools", "Data", "Memory", "Other agents"],
  garden: {
    title: "Ready to use. Ready to customise.",
    product: "Agent Garden",
    body: "A library of prebuilt agents and templates. Start with proven building blocks instead of rebuilding common capabilities from scratch.",
    patterns: [
      { name: "Research pattern", body: "Gathers, reads and synthesises sources into a brief." },
      { name: "Data analysis pattern", body: "Answers questions against enterprise data and explains the result." },
      { name: "Customer conversation pattern", body: "Handles a service conversation and hands off when needed." },
      { name: "Workflow pattern", body: "Runs a multi-step task across tools with checkpoints." },
    ],
    note: "Patterns are illustrative categories, not a product list.",
  },
  associates: {
    title: "Associates working together",
    body: "Multi-agent systems: specialised agents collaborate rather than one agent doing everything.",
  },
};

/* Data */
export const dataSection = {
  eyebrow: "Proof 03 · Floor 3",
  title: ["Models know the world.", "Your data teaches them your business."],
  lead: "The store knows your business because the store keeps your context.",
  sources: ["BigQuery", "Databases", "Documents", "Enterprise search", "Google Workspace", "Microsoft 365", "SaaS systems", "APIs"],
  concepts: ["Grounding", "Enterprise search", "RAG", "Operational data", "Analytics", "Contextual responses"],
  caveat: "Your enterprise data grounds your agents. It is not used to train public Google models.",
};

/* Openness */
export const opennessSection = {
  eyebrow: "Proof 04 · The column",
  title: ["Open at every layer."],
  lead: "Doors, corridors and standard interfaces. The point is optionality, not a slogan.",
  layers: [
    { layer: "Models", examples: "Google, partner and open models on one floor" },
    { layer: "Agents", examples: "Agents built here or sourced from partners; A2A between them" },
    { layer: "Frameworks", examples: "ADK is open source and model-agnostic" },
    { layer: "Tools", examples: "MCP tools, APIs, connectors" },
    { layer: "Data", examples: "BigQuery, databases, documents, Workspace, Microsoft 365, SaaS" },
    { layer: "Infrastructure", examples: "TPUs and GPUs; open software; flexible consumption" },
    { layer: "Ecosystem", examples: "Partners, Marketplace, implementation services" },
  ],
};

/* Governance */
export const governanceSection = {
  eyebrow: "Proof 05 · Floor 1",
  title: ["Autonomy without anarchy."],
  lead: "Switch to the X-ray. Every agent has an identity, every interaction has a controlled path, every interaction can be protected.",
  items: [
    {
      product: "Agent Identity",
      line: "Every agent has an identity.",
      metaphor: "Access badges",
      body: "Authentication and granular authorisation for agents, so the platform knows who is acting and what it may touch.",
      accent: accent.security,
    },
    {
      product: "Agent Gateway",
      line: "Every interaction has a controlled path.",
      metaphor: "Security checkpoints and controlled doors",
      body: "A central policy enforcement point for user-to-agent, agent-to-tool and agent-to-agent interactions.",
      accent: accent.security,
    },
    {
      product: "Model Armor",
      line: "Every interaction can be protected.",
      metaphor: "Loss prevention",
      body: "Guardrails against prompt injection, harmful content and sensitive-data leakage, applied to prompts and responses.",
      accent: accent.security,
    },
  ],
  controls: ["Authentication", "Authorisation", "Policy enforcement", "Controlled access to tools", "Prompt-injection protection", "Sensitive-data protection", "Enterprise guardrails"],
};

/* Security: CodeMender + AI threat detection */
export const securitySection = {
  eyebrow: "Proof 06 · Floor 1, continued",
  title: ["Security is the store’s job.", "Not the brand’s."],
  lead: "A department store does not ask each brand to bring its own guards. It has a maintenance crew that fixes the broken lock before anyone finds it, and a watch at the door, on the floor and in the control room. On Google Cloud that is CodeMender plus AI threat detection, and both apply whichever model you pick.",
  why: {
    tag: "Why now",
    lines: [
      "In May 2026 Google Threat Intelligence Group reported the first zero-day exploit it believes was written with AI, found in use against a widely deployed admin tool.",
      "The same report describes state-backed groups using models for vulnerability discovery, and supply-chain compromises that reached AI gateway libraries and package registries.",
      "Google’s reading: attackers now find and weaponise flaws at machine speed, so defenders need to find, prove and fix them at machine speed too.",
    ],
  },
  mender: {
    metaphor: "The maintenance crew",
    product: "CodeMender",
    status: "Public Preview · July 2026 · limited customers",
    line: "Finds the flaw, proves it is real, writes the fix. You approve it.",
    body: "CodeMender is a code-security agent from Google DeepMind, now hosted on Gemini Enterprise Agent Platform. It wraps a security-tuned harness around Gemini and works on the code you build in the store: agents, tools and the applications around them.",
    steps: [
      { n: "01", title: "Find", body: "Scans a repository for memory-corruption, injection, web, cryptographic and data-handling flaws, or imports findings from scanners you already run, including Wiz." },
      { n: "02", title: "Verify", body: "Builds the code and runs a proof-of-concept exploit in a sandbox you manage. Only exploitable findings go forward, which cuts false positives." },
      { n: "03", title: "Fix", body: "Generates a patch, tests it, and has a second model judge that behaviour is unchanged. The result is a diff in your CLI, IDE or CI pipeline for a developer to review and approve." },
    ],
    facts: [
      "Source stays in your environment: the CLI sends snippets, findings and patches, never the repository; nothing is used to train models.",
      "C/C++, Go, Java, Python, TypeScript/JavaScript, Rust and Ruby, with common frameworks.",
      "Runs on current Gemini Flash and Pro models; you choose the model per run for cost, speed or depth.",
      "Also the remediation stage of Google AI Threat Defense (May 2026), alongside Wiz, Mandiant and Google Security Operations.",
    ],
    provenance: "Announced by Google DeepMind on 6 October 2025 as a research agent; DeepMind reported 72 security fixes contributed to open-source projects in its first six months. Preview terms apply: supervise it, and keep a human on every change.",
  },
  watch: {
    metaphor: "The watch",
    title: "AI threat detection, three places at once",
    rings: [
      {
        place: "At the door",
        product: "Model Armor on Agent Gateway",
        status: "Generally available",
        body: "Every prompt, response and tool call that passes through the gateway is screened for prompt injection, jailbreaks, harmful content and sensitive-data leakage. Block, redact or log; violations surface in Security Command Center.",
      },
      {
        place: "On the floor",
        product: "Agent Platform Threat Detection · Agent Anomaly Detection",
        status: "Preview · announced April 2026",
        body: "A watcher sits beside each agent in Agent Runtime and flags malicious binaries, libraries or skills, reverse shells, container escapes and credential hunting; control-plane rules catch agent-initiated data exfiltration and suspicious token generation. Anomaly detection adds statistical models and a model-as-judge to flag reasoning that does not look like the agent’s normal behaviour.",
      },
      {
        place: "In the control room",
        product: "AI Protection in Security Command Center",
        status: "Generally available · March 2026",
        body: "An inventory of every model, agent, endpoint, data source and MCP server; CVEs and plaintext secrets in agent workloads; attack-path simulation with agents as high-value assets; over-privileged agents flagged. Findings appear in the Agent Platform’s own Security tab, and Google Security Operations agents triage and hunt across them.",
      },
    ],
  },
  point: {
    tag: "What it means for the model choice",
    line: "Change the brand. Keep the guards.",
    body: "None of this is tied to a model. Swap Gemini for Claude, or Claude for an open model, and the door, the floor and the control room stay exactly where they were. Security is a property of the store, which is why adding a model never means adding a risk review.",
  },
  caveat: "Availability is as published by Google Cloud on 5 September 2026. CodeMender is a pre-GA offering for evaluation, not production, and its Gemini 3.5 Flash Cyber variant is limited to selected governments and partners. Figures are Google’s own, dated and attributed in Sources.",
};

/* Operations */
export const operationsSection = {
  eyebrow: "Proof 07 · Floors 2 and 1",
  title: ["AI you can actually operate."],
  lead: "Access to models is not an enterprise AI system. Enterprises need a production system around them.",
  pipeline: ["Idea", "Build", "Test", "Deploy", "Scale", "Operate"],
  runtime: {
    product: "Agent Runtime",
    body: "Managed execution from prototype to production: fast provisioning, scaling, and persistent memory for long-running agents.",
  },
  loop: ["Agent executes task", "Trace captured", "Performance evaluated", "Failure identified", "Agent optimised", "Repeat"],
  observability: { label: "Observability", question: "What did the agent do?" },
  evaluation: { label: "Evaluation", question: "Was it any good?" },
  headline: ["Don't just deploy AI.", "Know how it's performing."],
};

/* Infrastructure */
export const infraSection = {
  eyebrow: "Proof 08 · Foundation",
  title: ["The engine room."],
  lead: "Everything customers don't need to see, but depend on.",
  product: "AI Hypercomputer",
  parts: ["TPUs", "GPUs", "Networking", "Storage", "Serving infrastructure", "Open software", "Flexible consumption"],
  optimise: ["Performance", "Latency", "Scale", "Economics"],
  headline: "The best store still needs a great supply chain.",
  body: "Google operates the infrastructure underneath the platform so enterprises can optimise around performance, economics and the character of each workload.",
};

/* Ecosystem */
export const ecosystemSection = {
  title: "Stores within the store",
  body: "Third-party models, third-party agents, enterprise software and implementation partners participate through Google Cloud Marketplace and the partner ecosystem. Google Cloud can create an ecosystem without requiring everything to be built by Google.",
  items: ["Third-party models", "Third-party agents", "Enterprise software", "Implementation partners", "Marketplace"],
};

/* Archetypes */
export const archetypes = [
  {
    id: "boutique",
    name: "The Boutique",
    message: "Exceptional products. One primary brand.",
    strength: "Deep vertical integration.",
    tradeoff: "Your platform strategy becomes more dependent on one provider.",
    strengthShort: "Integration",
  },
  {
    id: "bazaar",
    name: "The Bazaar",
    message: "Maximum choice. Assembly required.",
    strength: "Breadth.",
    tradeoff: "The customer owns integration, security, operations and governance.",
    strengthShort: "Choice",
  },
  {
    id: "warehouse",
    name: "The Warehouse",
    message: "Everything you need to build it yourself.",
    strength: "Control and infrastructure flexibility.",
    tradeoff: "Significant engineering required above the infrastructure.",
    strengthShort: "Control",
  },
  {
    id: "store",
    name: "The Department Store",
    message: "Choice without chaos.",
    strength: "Choice + integration + governance + common operations.",
    tradeoff: "Choose the best product for every job. Let the platform make everything work together.",
    strengthShort: "All three, plus governance",
  },
];

export const archetypeSection = {
  eyebrow: "Proof 09 · Four archetypes",
  title: ["Which kind of AI store", "are you building?"],
  lead: "Four ways to construct an enterprise AI stack. None is wrong. Each optimises for something different.",
};

/* Journey */
export const journey = {
  eyebrow: "07 · Customer use cases",
  title: ["Follow one AI idea", "through the store."],
  brief: "An agent that researches a customer, analyses internal data, prepares a recommendation and initiates follow-up actions. The same walk works in any industry: the products change, the building does not.",
  steps: [
    { n: 1, title: "Enter", product: "Gemini Enterprise", floor: "rooftop" as FloorId },
    { n: 2, title: "Choose intelligence", product: "Model Garden", floor: "models" as FloorId },
    { n: 3, title: "Add business context", product: "Enterprise data · RAG · connectors", floor: "data" as FloorId },
    { n: 4, title: "Build", product: "Agent Studio or ADK", floor: "agents" as FloorId },
    { n: 5, title: "Connect to tools", product: "APIs · MCP · enterprise systems", floor: "data" as FloorId },
    { n: 6, title: "Secure", product: "Agent Identity · Agent Gateway · Model Armor", floor: "govern" as FloorId },
    { n: 7, title: "Run", product: "Agent Runtime", floor: "build" as FloorId },
    { n: 8, title: "Observe", product: "Tracing · monitoring", floor: "govern" as FloorId },
    { n: 9, title: "Evaluate", product: "Measure quality", floor: "govern" as FloorId },
    { n: 10, title: "Improve", product: "Optimise", floor: "govern" as FloorId },
  ],
  swap: {
    question: "What happens when a better model arrives six months later?",
    answer: "That's the point.",
    line: ["Switch the model.", "Not the architecture."],
  },
};

export const finalSection = {
  lines: ["You don't know which model", "will win tomorrow."],
  answer: "You shouldn't have to.",
  support: "Build your AI strategy around choice, not prediction.",
  brand: "Google Cloud",
  statement: "The department store for enterprise AI.",
  secondary: "Choose the best capability for every job — without rebuilding the store every time the market changes.",
};

/* Sources */
export const sources = [
  { label: "CodeMender overview — Agent Platform documentation (Preview)", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/codemender" },
  { label: "Now in preview: find and fix software vulnerabilities with CodeMender — Google Cloud blog, 22 July 2026", url: "https://cloud.google.com/blog/products/identity-security/find-and-fix-software-vulnerabilities-with-codemender" },
  { label: "Introducing CodeMender — Google DeepMind, 6 October 2025", url: "https://deepmind.google/blog/introducing-codemender-an-ai-agent-for-code-security/" },
  { label: "Introducing Google AI Threat Defense — Google Cloud blog, 28 May 2026", url: "https://cloud.google.com/blog/products/identity-security/introducing-google-ai-threat-defense" },
  { label: "Agent Platform Threat Detection overview — Security Command Center documentation", url: "https://docs.cloud.google.com/security-command-center/docs/agent-platform-threat-detection-overview" },
  { label: "AI Protection overview — Security Command Center documentation", url: "https://docs.cloud.google.com/security-command-center/docs/ai-protection-overview" },
  { label: "Integrate Model Armor with Agent Gateway — documentation", url: "https://docs.cloud.google.com/model-armor/model-armor-agent-gateway-integration" },
  { label: "Next ’26: redefining security for the AI era — Google Cloud blog, April 2026", url: "https://cloud.google.com/blog/products/identity-security/next26-redefining-security-for-the-ai-era-with-google-cloud-and-wiz" },
  { label: "GTIG AI Threat Tracker: adversaries leverage AI for vulnerability exploitation — 12 May 2026", url: "https://cloud.google.com/blog/topics/threat-intelligence/ai-vulnerability-exploitation-initial-access" },
  { label: "Gemini Enterprise Agent Platform (formerly Vertex AI)", url: "https://cloud.google.com/products/gemini-enterprise-agent-platform" },
  { label: "Agent Platform overview — documentation", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview" },
  { label: "Introducing Gemini Enterprise Agent Platform — Google Cloud blog", url: "https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-agent-platform" },
  { label: "Gemini Enterprise app", url: "https://cloud.google.com/gemini-enterprise" },
  { label: "Model Garden", url: "https://cloud.google.com/model-garden" },
  { label: "Overview of Model Garden — documentation", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-garden/explore-models" },
  { label: "Google models on Agent Platform — documentation", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/google-models" },
  { label: "Gemini 3.1 Pro — documentation", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-1-pro" },
  { label: "Gemini 3.8 Flash — documentation", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-8-flash" },
  { label: "Gemini 3.5 Flash-Lite — documentation", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-5-flash-lite" },
  { label: "Partner models for MaaS (Anthropic, xAI, Mistral AI, AI21) — documentation", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/use-partner-models" },
  { label: "Anthropic Claude on Google Cloud — documentation", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude" },
  { label: "Open models for MaaS (Llama, DeepSeek, Qwen, gpt-oss, Gemma, GLM, Kimi, MiniMax) — documentation", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/maas/use-open-models" },
  { label: "Open models: choose a serving option — documentation", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/open-models/choose-serving-option" },
  { label: "Agent Garden — documentation", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/agent-garden" },
  { label: "Agent Studio overview — documentation", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/agent-studio" },
  { label: "Agent Development Kit", url: "https://google.github.io/adk-docs/" },
  { label: "Agent Gateway overview — documentation", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern/gateways/agent-gateway-overview" },
  { label: "Model Armor overview — documentation", url: "https://docs.cloud.google.com/model-armor/overview" },
  { label: "AI Hypercomputer", url: "https://cloud.google.com/solutions/ai-hypercomputer" },
  { label: "Cloud TPU", url: "https://cloud.google.com/tpu" },
  { label: "BigQuery", url: "https://cloud.google.com/bigquery" },
  { label: "Google Cloud Marketplace", url: "https://cloud.google.com/marketplace" },
  { label: "Agent2Agent protocol", url: "https://a2a-protocol.org/" },
  { label: "Model Context Protocol", url: "https://modelcontextprotocol.io/" },
];

export const methodology = [
  "Security section: product status (Preview or generally available) follows the official documentation and release notes on 5 September 2026. The only figures quoted are Google’s own published ones, with their date and source; no third-party benchmarks are used.",
  "Product names follow current official Google Cloud pages and documentation as of September 2026.",
  "Model names and tiers were verified against the Agent Platform model documentation on 5 September 2026; release months against provider announcements. Tiers (frontier, workhorse, efficient, specialist) are an editorial grouping based on each model's official description, not a Google classification.",
  "Recency rule: only models released within the last twelve months are featured, because older generations no longer shape an enterprise's model strategy. Older families remain available on Model Garden and are named on the page.",
  "The department store is an analogy for the operating model; it is not a literal product architecture diagram.",
  "Deployment options differ by model. Nothing here implies every model is open or self-deployable.",
  "Enterprise data grounds agents; nothing here implies it trains public Google models.",
  "No customer statistics, benchmarks, cost comparisons or competitor claims are made.",
  "The department store is an everyday analogy. No retailer is named, implied or endorsed.",
  "A field narrative from Google Cloud JAPAC, built as a point of view. Product names belong to their owners.",
];
