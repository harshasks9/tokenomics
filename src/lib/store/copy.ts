/**
 * THE DEPARTMENT STORE FOR AI — every line of copy on the site, verbatim.
 * Scenes import from here; nothing below is paraphrased in the components.
 */

export type Row = {
  id: string;
  element: string; // store element
  capability: string; // Google Cloud capability
  meaning: string; // what it means
};

export type Floor = {
  id: string;
  number: string; // lift-panel number
  short: string; // directory label
  name: string; // signage
  tagline: string;
  rows: Row[];
};

export const hero = {
  eyebrow: "A way to explain Google Cloud AI to the board",
  headline: "One store. Every brand. One set of rules.",
  subhead:
    "In AI, you should not have to predict today which model, architecture or vendor will win tomorrow. Google Cloud is the department store: choose the best capability for each job, again and again, without rebuilding the store every time the market moves.",
  walkIn: "Walk in",
  skip: "Skip to the talk track",
};

export const coreAnalogy =
  "Google Cloud AI is a modern department store. Under one roof, on one set of shelves, it carries Google's own premium line (Gemini) alongside the best third-party and open brands — Claude, Llama, Mistral, Qwen, DeepSeek and hundreds more — and every one of them checks out through the same register, ships from the same logistics network, and is covered by the same security, returns and warranty desk. The store is run by one operating system (Vertex AI), stocked with the customer's own goods (their data in BigQuery), and staffed by a tailoring department (agents) that assembles individual products into complete outfits. The point of a department store is not that it sells everything; it is that the customer never has to bet the wardrobe on a single brand, and never has to rebuild the building when fashion changes.";

export const pullQuote = "You shouldn't have to predict the winner.";

export const storefront: Floor = {
  id: "storefront",
  number: "6",
  short: "Storefront",
  name: "The Storefront",
  tagline: "Where the enterprise shops.",
  rows: [
    {
      id: "concierge",
      element: "Front entrance and personal shopper",
      capability: "Gemini Enterprise",
      meaning:
        "Employees don't need to know the floor plan. They ask one concierge who pulls from every department — models, agents, company data, Workspace and third-party apps — with permissions already enforced.",
    },
    {
      id: "storecard",
      element: "Store card and loyalty profile",
      capability: "Enterprise identity, IAM, Workspace integration",
      meaning:
        "The store already knows who you are and what you're allowed to see. Personalisation without leakage.",
    },
  ],
};

export const tailoring: Floor = {
  id: "tailoring",
  number: "5",
  short: "Tailoring",
  name: "The Tailoring Floor",
  tagline: "Where products become solutions.",
  rows: [
    {
      id: "bench",
      element: "Tailoring and styling department",
      capability: "Agent Development Kit (ADK)",
      meaning:
        "Customers don't buy a sleeve and a collar; they buy a suit. ADK is where developers stitch models, tools and data into agents that do a job end to end.",
    },
    {
      id: "alterations",
      element: "Alterations and after-sales service",
      capability: "Agent Engine",
      meaning:
        "Once the suit is made, someone has to keep it fitting: managed runtime, memory, sessions, scaling, monitoring.",
    },
    {
      id: "hangers",
      element: "Universal sizing standards",
      capability: "A2A protocol and MCP support",
      meaning:
        "Any garment fits any hanger. Agents built here talk to agents built elsewhere, and tools plug in without custom adapters.",
    },
    {
      id: "readytowear",
      element: "Ready-to-wear rack",
      capability:
        "Pre-built agents (Deep Research, data agents, customer engagement, code)",
      meaning:
        "Off-the-shelf solutions for the jobs everyone needs, without a bespoke fitting.",
    },
  ],
};

export const modelFloor: Floor = {
  id: "model-floor",
  number: "4",
  short: "Model Floor",
  name: "The Model Floor",
  tagline: "Every serious brand on one shelf.",
  rows: [
    {
      id: "garden",
      element: "The store floor",
      capability: "Model Garden",
      meaning:
        "Browse, compare and pick from hundreds of models. Same shelf, same price tag format, same checkout.",
    },
    {
      id: "gemini",
      element: "Premium house brand",
      capability: "Gemini (Pro, Flash, Flash-Lite; multimodal, long context)",
      meaning:
        "Deeply integrated, tuned for the store's own systems, and continuously refreshed — but never the only thing on the rack.",
    },
    {
      id: "gemma",
      element: "House own-label",
      capability: "Gemma open models",
      meaning:
        "The store's own label, sold openly so you can even take it to another store.",
    },
    {
      id: "partner",
      element: "Partner brands with the same warranty",
      capability: "Claude (Anthropic), Mistral, AI21 and other partner models",
      meaning:
        "Top-tier third-party brands with the same enterprise terms, security perimeter and billing as the house brand.",
    },
    {
      id: "open",
      element: "Open brands",
      capability: "Llama, Qwen, DeepSeek and the open-weights catalogue",
      meaning: "Choice and price competition. No exclusive-distribution clauses.",
    },
    {
      id: "specialist",
      element: "Specialist boutiques inside the store",
      capability: "Imagen, Veo, Lyria, Chirp, MedLM, translation, embeddings",
      meaning:
        "The camera shop, the music room, the pharmacy: purpose-built for a job rather than general purpose.",
    },
    {
      id: "byo",
      element: "Bring-your-own goods desk",
      capability: "Custom model import, open-source serving on GKE",
      meaning:
        "If you already own something, you can still get it fitted, secured and serviced here.",
    },
  ],
};

export const wardrobe: Floor = {
  id: "wardrobe",
  number: "3",
  short: "Your Wardrobe",
  name: "The Ground Floor: Your Wardrobe",
  tagline: "Your data makes it yours.",
  rows: [
    {
      id: "closet",
      element: "The customer's wardrobe, brought in for styling",
      capability: "BigQuery, AlloyDB, Spanner, Cloud SQL, Looker",
      meaning:
        "AI without your data is a stranger giving you fashion advice. The data cloud is what makes every recommendation yours.",
    },
    {
      id: "measurements",
      element: "Measurements and fitting records",
      capability: "Vector search, RAG Engine, BigQuery ML, data agents",
      meaning:
        "The store remembers your dimensions, so every product comes out fitted rather than generic.",
    },
  ],
};

export const backOfHouse: Floor = {
  id: "back-of-house",
  number: "2",
  short: "Back of House",
  name: "Back of House",
  tagline: "One register. One inventory. One receipt.",
  rows: [
    {
      id: "register",
      element: "Store operations: inventory, point of sale, staffing, fulfilment",
      capability: "Vertex AI",
      meaning:
        "One register for every brand, one inventory system (Model Registry), one training academy (tuning and distillation), one delivery system (endpoints and batch).",
    },
    {
      id: "fitting",
      element: "Fitting rooms",
      capability: "Vertex AI Evaluation",
      meaning:
        "Try before you buy. Compare Gemini against Claude against Llama on your task with your rubric before you commit.",
    },
    {
      id: "qc",
      element: "Product-testing lab and quality control",
      capability: "Model monitoring, grounding, citations, safety filters",
      meaning: "Products are checked on the way in and watched on the way out.",
    },
  ],
};

export const foundations: Floor = {
  id: "foundations",
  number: "1",
  short: "Foundations",
  name: "The Foundations",
  tagline: "Best economics, wherever you need it.",
  rows: [
    {
      id: "bays",
      element: "Distribution centres and factories",
      capability: "AI Hypercomputer: TPUs, NVIDIA GPUs, storage, networking",
      meaning:
        "The customer picks price and delivery time; the store decides which warehouse fulfils the order. Same product, best economics.",
    },
    {
      id: "franchise",
      element: "Franchise store on your premises",
      capability: "Google Distributed Cloud (connected or air-gapped)",
      meaning:
        "For sovereign or regulated markets, the same store opens inside your own building, with the same brands and operating system.",
    },
    {
      id: "conveyor",
      element: "Same store, another mall",
      capability: "Multi-cloud and hybrid connectivity, Cross-Cloud Network",
      meaning:
        "Shop here, stock elsewhere. The store works even if part of your estate lives in another cloud.",
    },
  ],
};

export const walls: Floor = {
  id: "walls",
  number: "—",
  short: "The Walls",
  name: "The Walls",
  tagline: "Guards at every door, cameras on every floor.",
  rows: [
    {
      id: "security",
      element: "Store security and loss prevention",
      capability:
        "Model Armor, IAM, VPC Service Controls, CMEK, data residency, SecOps",
      meaning: "No product leaves without a receipt.",
    },
    {
      id: "compliance",
      element: "Compliance and returns desk",
      capability:
        "Audit logging, indemnification, responsible-AI tooling, sovereignty controls",
      meaning:
        "The paperwork a regulated enterprise needs: who bought what, when, and who is liable if it fails.",
    },
  ],
};

export const doors: Floor = {
  id: "doors",
  number: "G",
  short: "Exit",
  name: "Doors and Concessions",
  tagline: "The doors open both ways.",
  rows: [
    {
      id: "dock",
      element: "Loading dock and exit doors",
      capability:
        "Open APIs (including OpenAI-compatible endpoints), open protocols, export of open weights and agent code",
      meaning:
        "Goods come in from other stores; goods go out to other environments. No one is trapped inside.",
    },
    {
      id: "concessions",
      element: "Shop-in-shop concessions",
      capability:
        "Google Cloud Marketplace — ISV and model listings, committed-spend drawdown",
      meaning:
        "Third-party brands operate their own counters inside the store, billed on the same account.",
    },
    {
      id: "services",
      element: "In-store services",
      capability: "Partners and SIs, Google Cloud Consulting, training",
      meaning:
        "Tailors, stylists and installers who know the store better than anyone.",
    },
  ],
};

export const floors = [
  storefront,
  tailoring,
  modelFloor,
  wardrobe,
  backOfHouse,
  foundations,
] as const;

export const monday = {
  title: "A Customer's Monday",
  intro: "Follow a regional bank walking in on a Monday.",
  steps: [
    {
      title: "Entering the store.",
      body: "The CIO does not start on the model floor; she starts at the concierge. Gemini Enterprise is switched on for 5,000 employees in a week, connected to Workspace, SharePoint and the CRM, with existing identity and permissions inherited. Employees are shopping on day one.",
    },
    {
      title: "Browsing the model floor.",
      body: "The data science team opens Model Garden. For contact-centre summarisation they short-list Gemini Flash (cost), Claude (tone) and an open model (sovereignty). They do not argue about it in a meeting; they take all three to the fitting room.",
    },
    {
      title: "The fitting room.",
      body: "Vertex AI Evaluation runs the three models against 2,000 real anonymised transcripts with the bank's own rubric. Gemini Flash wins on cost-per-quality for summarisation; Claude wins for the complaint-response drafts. They keep both. Nothing about that choice is architectural.",
    },
    {
      title: "Bringing in the wardrobe.",
      body: "Transaction data in BigQuery, policy documents in Cloud Storage, product catalogue in AlloyDB. RAG Engine and vector search give the models the bank's own measurements. Grounding and citations make every answer traceable.",
    },
    {
      title: "Tailoring.",
      body: "Using ADK, the team builds a dispute-resolution agent that reads the complaint, checks the transaction in BigQuery, drafts a response with Claude, summarises the case with Gemini Flash, and files it in the case system via MCP tools. It is one suit, made from several brands.",
    },
    {
      title: "Alterations and delivery.",
      body: "The agent is deployed on Agent Engine: sessions, memory, scaling and tracing handled. Model Armor screens prompts and responses. Every call is logged. The agent is exposed to the concierge, so employees reach it through Gemini Enterprise without knowing what is underneath.",
    },
    {
      title: "Governance.",
      body: "Risk and compliance see one audit trail across every model, every agent and every dataset. Data residency is pinned to the in-country region. Nobody has to write a separate governance story per vendor.",
    },
    {
      title: "Eighteen months later.",
      body: "A new open model appears that is better and cheaper for summarisation. The team runs it through the same fitting room, swaps one line in the agent configuration, and the concierge, the data, the security perimeter and the audit trail are untouched. The store did not need to be rebuilt to change a brand.",
    },
  ],
};

export const why = {
  title: "Why the Department Store Matters",
  cards: [
    {
      id: "choice",
      title: "Choice, at every layer.",
      body: "Model, modality, framework, chip and deployment location are all independent decisions. A department store is not “one of everything”; it is curated breadth with a single checkout.",
    },
    {
      id: "optionality",
      title: "Optionality is the strategy.",
      body: "Frontier leadership has changed hands repeatedly and will keep doing so. The only durable bet is to be positioned to switch. A store that stocks every serious brand converts a forecasting problem into a procurement decision.",
    },
    {
      id: "economics",
      title: "Economics.",
      body: "Models are priced against one another on the same shelf, so the customer captures every price drop. The store owns its own factories (TPUs) as well as sourcing from others (GPUs). Committed spend draws down across the whole store, including Marketplace.",
    },
    {
      id: "velocity",
      title: "Innovation velocity.",
      body: "New models arrive on the shelf within days, not quarters, already wired into evaluation, security and billing. Teams try new things in the fitting room instead of in a procurement cycle.",
    },
    {
      id: "governance",
      title: "Governance that is horizontal.",
      body: "Security, audit, residency and evaluation live in the building, not in the brand. Add a model and it inherits the controls. This is the difference between a platform and a collection of contracts.",
    },
    {
      id: "lockin",
      title: "No lock-in, by design.",
      body: "Open weights, open protocols, open APIs, a franchise store on-premises and exit doors that actually open. Customers stay because the store is good, not because the doors are locked.",
    },
  ],
};

export const fourWays = {
  title: "Four Ways to Build",
  intro:
    "None of these are wrong; each is a legitimate way to build. They simply optimise for different things, and you should choose knowingly.",
  shops: [
    {
      id: "boutique",
      title: "The single-brand boutique.",
      body: "Everything on the shelf comes from one designer. The experience is coherent, and the brand is often genuinely excellent — this year. But the whole wardrobe is now tied to one house's taste, pricing and roadmap. If the designer has a bad season, the only options are to accept it or to move house entirely. The coherence is real; so is the concentration risk.",
    },
    {
      id: "bazaar",
      title: "The marketplace without an operating layer.",
      body: "Enormous selection, low prices, and the customer takes everything home in bags. There is no fitting room, no shared security, no single receipt, and no one to call when the pieces don't fit together. The integration cost is transferred to the customer, and every enterprise ends up building its own private department store on top — badly, and more than once.",
    },
    {
      id: "warehouse",
      title: "The infrastructure warehouse.",
      body: "Racks of the best compute at the best price, and nothing else. Exactly right for a handful of companies building frontier models. For everyone else it means hiring the staff, building the shelves, writing the security policy and negotiating the brand contracts before the first employee can buy anything.",
    },
  ],
  columns: ["Boutique", "Marketplace", "Warehouse", "Department store"],
  rows: [
    {
      label: "Model choice",
      cells: [
        "One family",
        "Very wide",
        "Bring your own",
        "Curated breadth incl. house brand",
      ],
    },
    {
      label: "Integration burden",
      cells: ["Low", "High", "Very high", "Low"],
    },
    {
      label: "Shared governance",
      cells: ["One vendor only", "No", "No", "Yes, across all vendors"],
    },
    { label: "Switching cost", cells: ["High", "Low", "n/a", "Low"] },
    {
      label: "Price competition on the shelf",
      cells: ["No", "Yes", "n/a", "Yes"],
    },
    {
      label: "Owns its own factories",
      cells: ["Sometimes", "No", "Yes", "Yes (TPU) plus partners (GPU)"],
    },
  ],
  closing:
    "The department store is the only archetype that gives you both the choice of the marketplace and the coherence of the boutique.",
};

export const talkTrack = {
  title: "The Talk Track",
  readTime: "60–90 seconds",
  paragraphs: [
    "Every enterprise I talk to is being asked to make the same bet: pick the model, pick the vendor, pick the architecture that will still be the right answer in three years. Nobody can make that bet honestly. Frontier leadership has changed hands several times in eighteen months, and it will keep changing.",
    "So we've built something different. Think of Google Cloud AI as a department store. Gemini is our house brand — we're proud of it and it's on the front rack. But on the same shelves you'll find Claude, Llama, Mistral, Qwen, open models, specialist models for image, video and speech — hundreds of them. Same checkout, same security, same audit trail, same contract.",
    "Underneath is Vertex AI: the store's operating system. Fitting rooms where you test any model on your own data before you commit. A tailoring floor where you stitch models and tools into agents that do real work. Your own data in BigQuery so every answer is about your business, not a generic one. And the whole building is wrapped in one security and governance perimeter, so adding a model never means adding a risk review.",
    "The doors open both ways. Bring what you've already built. Take out what you build here.",
    "The point is simple: you shouldn't have to predict the winner. You should be able to choose the best capability for each job, today and again next year, without rebuilding the store every time the market moves. That's what we're offering.",
  ],
};

export const strains = {
  title: "Where the Analogy Strains",
  body: "Two places the store metaphor breaks, and both break in the customer's favour. In a real store you cannot take a competitor's product home cheaper than you bought it; here, model prices fall every quarter and the customer captures the drop automatically. And real department stores rarely own the factories; Google does, which is why the house brand is both frontier-class and inexpensive, and why the store can afford to carry rivals on the same shelf without fear.",
};

export const footer = {
  attribution:
    "A field narrative from Google Cloud JAPAC. Product names belong to their respective owners.",
  builtAs: "Built as a field narrative, not an official product page",
  year: "2026",
};

/** Directory (nav) entries, in walking order. */
export const directory = [
  { id: "pavement", label: "Entrance" },
  { id: "atrium", label: "Atrium" },
  { id: "storefront", label: "Storefront" },
  { id: "tailoring", label: "Tailoring" },
  { id: "model-floor", label: "Model Floor" },
  { id: "wardrobe", label: "Your Wardrobe" },
  { id: "back-of-house", label: "Back of House" },
  { id: "foundations", label: "Foundations" },
  { id: "doors", label: "Exit" },
  { id: "talk-track", label: "Talk Track" },
] as const;

/** Lift-panel labels for every scene, keyed by scene id. */
export const liftPanel: Record<string, { number: string; name: string; nav: string }> = {
  pavement: { number: "ST", name: "The Pavement", nav: "pavement" },
  atrium: { number: "G", name: "The Atrium", nav: "atrium" },
  "escalator-up": { number: "↑", name: "Escalator", nav: "atrium" },
  storefront: { number: "6", name: "The Storefront", nav: "storefront" },
  "escalator-5": { number: "↓", name: "Escalator", nav: "storefront" },
  tailoring: { number: "5", name: "The Tailoring Floor", nav: "tailoring" },
  "escalator-4": { number: "↓", name: "Escalator", nav: "tailoring" },
  "model-floor": { number: "4", name: "The Model Floor", nav: "model-floor" },
  "escalator-3": { number: "↓", name: "Escalator", nav: "model-floor" },
  wardrobe: { number: "3", name: "Your Wardrobe", nav: "wardrobe" },
  "escalator-2": { number: "↓", name: "Escalator", nav: "wardrobe" },
  "back-of-house": { number: "2", name: "Back of House", nav: "back-of-house" },
  "escalator-1": { number: "↓", name: "Service stair", nav: "back-of-house" },
  foundations: { number: "1", name: "The Foundations", nav: "foundations" },
  walls: { number: "—", name: "The Walls", nav: "foundations" },
  doors: { number: "G", name: "The Doors", nav: "doors" },
  monday: { number: "R", name: "A Customer's Monday", nav: "doors" },
  why: { number: "ST", name: "The Street", nav: "doors" },
  "four-ways": { number: "ST", name: "Across the Street", nav: "doors" },
  "talk-track": { number: "L", name: "The Talk Track", nav: "talk-track" },
  strains: { number: "L", name: "The Plaque", nav: "talk-track" },
  footer: { number: "ST", name: "The Street", nav: "talk-track" },
};
