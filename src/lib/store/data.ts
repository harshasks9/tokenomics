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
    sectionId: "explore",
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
    products: ["Model Garden", "Gemini 3.1 Pro · 3.8 Flash · 3.5 Flash-Lite", "Claude Opus 5 · Sonnet 5 · Haiku 4.5", "Grok · Mistral AI · AI21", "Gemma 4 · Llama 4 · DeepSeek · Qwen3 · gpt-oss"],
    summary: "Shop for the right intelligence for the job across 200+ Google, partner and open models, in four tiers: frontier, workhorse, efficient, specialist.",
    detail:
      "Model Garden is one place to discover more than 200 models. Google's own line runs from Gemini 3.1 Pro (frontier) through Gemini 3.8 Flash (the workhorse) to Gemini 3.5 Flash-Lite (efficient), with Veo, Imagen and Lyria as specialists. Partner brands such as Anthropic Claude, xAI Grok and Mistral AI sit on the same shelf as managed APIs. Open models from Google, Meta, DeepSeek, Alibaba and OpenAI are managed or self-deployed. The store carries its own flagship label and does not force you to buy it.",
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
    products: ["Agent Identity", "Agent Registry", "Agent Gateway", "Model Armor", "Agent Evaluation", "Agent Observability"],
    summary: "Control which agents reach which systems, protect every interaction, and know how agents are performing.",
    detail:
      "Agent Identity gives every agent an identity and granular permissions; Agent Registry keeps track of every agent, built here or sourced from partners. Agent Gateway is the policy enforcement point for agent, tool and user interactions. Model Armor screens prompts and responses for injection, harmful content and sensitive-data leakage. Evaluation and observability show what an agent did and whether it was any good.",
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
  { id: "idea", label: "The idea" },
  { id: "explore", label: "The store" },
  { id: "models", label: "Model Garden" },
  { id: "switch", label: "Model switch" },
  { id: "build", label: "Build agents" },
  { id: "data", label: "Data" },
  { id: "openness", label: "Openness" },
  { id: "governance", label: "Governance" },
  { id: "operations", label: "Operations" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "archetypes", label: "Archetypes" },
  { id: "journey", label: "Journey" },
  { id: "final", label: "The point" },
] as const;

export const sectionFloor: Record<string, FloorId | "column" | null> = {
  idea: null,
  explore: null,
  models: "models",
  switch: "models",
  build: "agents",
  data: "data",
  openness: "column",
  governance: "govern",
  operations: "build",
  infrastructure: "foundation",
  archetypes: null,
  journey: null,
  final: null,
};

/* ------------------------------------------------------------------ */
/* Copy                                                                 */
/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: "Google Cloud",
  headline: ["Don't bet on the winning model.", "Pick the right store."],
  support: "AI is moving too quickly to lock your enterprise into one model, one framework or one architecture.",
  cta: "Enter the AI Department Store",
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

export type ShelfModel = { name: string; maker: string; tier: Tier; note: string; preview?: boolean };

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
      { name: "Gemini 3.1 Pro", maker: "Google", tier: "frontier", note: "Most advanced reasoning model; 1M-token context; text, audio, image, video, PDF and whole code repositories.", preview: true },
      { name: "Gemini 3.8 Flash", maker: "Google", tier: "workhorse", note: "Most intelligent workhorse model; software engineering, agentic tasks, multi-step reasoning; often approaches frontier performance at lower cost." },
      { name: "Gemini 3.5 Flash-Lite", maker: "Google", tier: "efficient", note: "Cost-effective line for simple coding, precise document understanding and lightweight agents; built for high-throughput classification and extraction." },
      { name: "Gemini 3.1 Flash Image", maker: "Google", tier: "specialist", note: "Image understanding and generation at a balance of price and performance." },
      { name: "Gemini 3 Pro Image · Imagen", maker: "Google", tier: "specialist", note: "Text-to-image for the highest-fidelity creative work." },
      { name: "Veo 3.1", maker: "Google", tier: "specialist", note: "Text-to-video and image-to-video." },
      { name: "Gemini Omni 1.1 Flash", maker: "Google", tier: "specialist", note: "Video, image and text in one model, with video output alongside text.", preview: true },
      { name: "Lyria 3", maker: "Google", tier: "specialist", note: "Music generation." },
      { name: "Gemini 3.5 Transcribe · Live Translate · Chirp", maker: "Google", tier: "specialist", note: "Speech to text, live translation and speech recognition." },
      { name: "Gemini Embedding 2", maker: "Google", tier: "specialist", note: "Embeddings for search, retrieval and grounding." },
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
      { name: "Claude Opus 5", maker: "Anthropic", tier: "frontier", note: "Anthropic’s most advanced Opus model: long-running agents, ambitious coding, deep professional and financial analysis, computer use." },
      { name: "Claude Fable 5.1", maker: "Anthropic", tier: "frontier", note: "Optimised for autonomous knowledge work and coding; long-running, complex and asynchronous tasks." },
      { name: "Grok 4.6", maker: "xAI", tier: "frontier", note: "xAI’s most capable model for coding, agentic tasks and knowledge work.", preview: true },
      { name: "Claude Sonnet 5", maker: "Anthropic", tier: "workhorse", note: "Most capable Sonnet yet; lead agent or sub-agent in production pipelines with the cost profile to run high-volume agentic work." },
      { name: "Grok 4.20", maker: "xAI", tier: "workhorse", note: "Reasoning and non-reasoning variants; document understanding and long-horizon tool calling.", preview: true },
      { name: "Mistral Medium 3", maker: "Mistral AI", tier: "workhorse", note: "Versatile model for coding, maths, long-document understanding, summarisation and dialogue." },
      { name: "Jamba 1.5 Large · Mini", maker: "AI21 Labs", tier: "workhorse", note: "Long-context models balancing quality, throughput and cost.", preview: true },
      { name: "Claude Haiku 4.5", maker: "Anthropic", tier: "efficient", note: "Near-frontier performance at the speed and cost for customer-service agents, sub-agents and high-volume experiences." },
      { name: "Grok 4.1 Fast", maker: "xAI", tier: "efficient", note: "xAI’s most cost-effective model; search, summarisation and categorisation at volume.", preview: true },
      { name: "Mistral Small 3.1", maker: "Mistral AI", tier: "efficient", note: "Small multimodal model with an extended context window." },
      { name: "Codestral 2", maker: "Mistral AI", tier: "specialist", note: "Code generation and fill-in-the-middle completion." },
      { name: "Mistral OCR", maker: "Mistral AI", tier: "specialist", note: "Document understanding: text, tables, media and equations." },
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
      { name: "DeepSeek-V3.2", maker: "DeepSeek", tier: "frontier", note: "Computational efficiency with strong reasoning and agent performance; the reasoning tier of the open shelf." },
      { name: "Kimi K2 Thinking", maker: "Moonshot AI", tier: "frontier", note: "Open thinking-agent model that reasons step by step and uses tools." },
      { name: "Qwen3-Next-80B Thinking", maker: "Alibaba", tier: "frontier", note: "Complex problem-solving and deep reasoning in the Qwen3-Next family." },
      { name: "Llama 4 Maverick", maker: "Meta", tier: "workhorse", note: "The largest Llama 4: coding, reasoning and image understanding in a mixture-of-experts model." },
      { name: "Qwen3 235B", maker: "Alibaba", tier: "workhorse", note: "Hybrid thinking: switches between methodical reasoning and rapid conversation." },
      { name: "GLM 5.2", maker: "Zhipu AI", tier: "workhorse", note: "Long-horizon agentic and coding tasks with a 1M-token context window." },
      { name: "gpt-oss 120B", maker: "OpenAI", tier: "workhorse", note: "Open-weights model with high performance on reasoning tasks." },
      { name: "Gemma 4 26B", maker: "Google", tier: "efficient", note: "Google’s open multimodal model; a house label you can take with you." },
      { name: "Llama 4 Scout", maker: "Meta", tier: "efficient", note: "High performance for its size class; multimodal mixture-of-experts." },
      { name: "gpt-oss 20B", maker: "OpenAI", tier: "efficient", note: "Optimised for efficiency and deployment on modest hardware." },
      { name: "Qwen3 Coder", maker: "Alibaba", tier: "specialist", note: "Open-weights model built for advanced software development." },
      { name: "DeepSeek-OCR", maker: "DeepSeek", tier: "specialist", note: "Optical character recognition for complex documents." },
      { name: "MiniMax M2", maker: "MiniMax", tier: "specialist", note: "Agentic and code tasks: planning and executing complex tool calls." },
    ],
  },
];

export const modelGarden = {
  eyebrow: "Section 04 · Floor 4",
  title: ["Shop by outcome.", "Not by brand."],
  lead: "Model Garden is one place to discover more than 200 models. The shelf below is what is actually on it today, sorted the way a buyer thinks: by the job, not the logo.",
  howToRead: "Four tiers run across every shelf. Premium is a tier, not a brand: each shelf carries a frontier model, a workhorse and an efficient option.",
  factors: ["Intelligence", "Latency", "Modality", "Cost", "Sovereignty", "Customisation", "Deployment requirements"],
  caveat: "Deployment options differ by model: partner models are managed APIs; open models are managed or, where supported, self-deployed. Items marked Preview are pre-GA. Not every model on the 200+ shelf is shown.",
  verified: "Model names, tiers and descriptions verified against Google Cloud documentation on 5 September 2026.",
  matrixTitle: "The shelf at a glance",
  matrix: [
    { tier: "frontier", google: "Gemini 3.1 Pro (Preview)", partner: "Claude Opus 5 · Claude Fable 5.1 · Grok 4.6 (Preview)", open: "DeepSeek-V3.2 · Kimi K2 Thinking · Qwen3-Next-80B Thinking" },
    { tier: "workhorse", google: "Gemini 3.8 Flash", partner: "Claude Sonnet 5 · Grok 4.20 · Mistral Medium 3", open: "Llama 4 Maverick · Qwen3 235B · GLM 5.2 · gpt-oss 120B" },
    { tier: "efficient", google: "Gemini 3.5 Flash-Lite", partner: "Claude Haiku 4.5 · Grok 4.1 Fast · Mistral Small 3.1", open: "Gemma 4 26B · Llama 4 Scout · gpt-oss 20B" },
    { tier: "specialist", google: "Gemini 3.1 Flash Image · Veo 3.1 · Lyria 3 · Gemini 3.5 Transcribe · Gemini Embedding 2", partner: "Codestral 2 · Mistral OCR", open: "Qwen3 Coder · DeepSeek-OCR · MiniMax M2" },
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
      { name: "Qwen3 Coder", category: "open", note: "Open specialist · advanced software development" },
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
      { name: "Mistral OCR", category: "partner", note: "Specialist · text, tables, media, equations" },
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
      { name: "gpt-oss 20B", category: "open", note: "Open efficient · runs on modest hardware" },
    ],
  },
];

export const modelSwitch = {
  eyebrow: "Section 05 · The hero interaction",
  title: ["Switch the model.", "Not the architecture."],
  lead: "Your AI architecture shouldn’t have to change every time the leaderboard does.",
  kicker: "One use case. Multiple choices.",
  layers: ["Data", "Security", "Governance", "Operations", "Infrastructure"],
  platform: "Common Google Cloud platform",
  button: "Switch the model",
  unchanged: "Unchanged",
};

/* Build */
export const buildSection = {
  eyebrow: "Section 06 · Floor 5",
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
  eyebrow: "Section 07 · Floor 3",
  title: ["Models know the world.", "Your data teaches them your business."],
  lead: "The store knows your business because the store keeps your context.",
  sources: ["BigQuery", "Databases", "Documents", "Enterprise search", "Google Workspace", "Microsoft 365", "SaaS systems", "APIs"],
  concepts: ["Grounding", "Enterprise search", "RAG", "Operational data", "Analytics", "Contextual responses"],
  caveat: "Your enterprise data grounds your agents. It is not used to train public Google models.",
};

/* Openness */
export const opennessSection = {
  eyebrow: "Section 08 · The column",
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
  eyebrow: "Section 09 · Floor 1",
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

/* Operations */
export const operationsSection = {
  eyebrow: "Section 10 · Floors 2 and 1",
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
  eyebrow: "Section 11 · Foundation",
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
  eyebrow: "Section 12",
  title: ["Which kind of AI store", "are you building?"],
  lead: "Four ways to construct an enterprise AI stack. None is wrong. Each optimises for something different.",
};

/* Journey */
export const journey = {
  eyebrow: "Section 13",
  title: ["Follow one AI idea", "through the store."],
  brief: "An agent that researches a customer, analyses internal data, prepares a recommendation and initiates follow-up actions.",
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
  "Product names follow current official Google Cloud pages and documentation as of September 2026.",
  "Model names and tiers were verified against the Agent Platform model documentation on 5 September 2026. Tiers (frontier, workhorse, efficient, specialist) are an editorial grouping based on each model's official description, not a Google classification.",
  "The department store is an analogy for the operating model; it is not a literal product architecture diagram.",
  "Deployment options differ by model. Nothing here implies every model is open or self-deployable.",
  "Enterprise data grounds agents; nothing here implies it trains public Google models.",
  "No customer statistics, benchmarks, cost comparisons or competitor claims are made.",
  "A field narrative from Google Cloud JAPAC, built as a point of view. Product names belong to their owners.",
];
