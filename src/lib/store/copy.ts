/**
 * THE DEPARTMENT STORE FOR AI — every line of copy on the site, verbatim,
 * in walking order. The narrator is a concierge walking beside the visitor.
 */

export type Item = {
  id: string;
  /** The physical object in the room ("The concierge desk"). */
  object: string;
  /** The Google Cloud capability, as the card heading. */
  capability: string;
  body: string;
};

export type Floor = {
  id: string;
  number: string;
  name: string;
  sub: string;
  narrator: string;
  items: Item[];
  /** The narrator's line at the down escalator. */
  outro: string;
  /** Where the outro leads. */
  next: { id: string; number: string; name: string };
  /** Small in-room signage, verbatim. */
  signs?: Record<string, string>;
};

/* ------------------------------------------------------------------ */
/* Persistent chrome                                                    */
/* ------------------------------------------------------------------ */

export const directory = [
  { id: "pavement", label: "Entrance", group: "building" },
  { id: "atrium", label: "Atrium", group: "building" },
  { id: "storefront", label: "Storefront", group: "building" },
  { id: "tailoring", label: "Tailoring", group: "building" },
  { id: "model-floor", label: "Model Floor", group: "building" },
  { id: "wardrobe", label: "Your Wardrobe", group: "building" },
  { id: "back-of-house", label: "Back of House", group: "building" },
  { id: "foundations", label: "Foundations", group: "building" },
  { id: "walls", label: "The Walls", group: "building" },
  { id: "doors", label: "The Doors", group: "building" },
  { id: "receipt", label: "Your Receipt", group: "street" },
  { id: "windows", label: "Window Displays", group: "street" },
  { id: "across", label: "Across the Street", group: "street" },
  { id: "talk-track", label: "Talk Track", group: "street" },
] as const;

export type StopId = (typeof directory)[number]["id"];

/** Floor indicator labels, keyed by scene id. `nav` is the directory stop. */
export const indicator: Record<string, { number: string; name: string; nav: StopId; level: number }> = {
  pavement: { number: "G", name: "Pavement", nav: "pavement", level: 0 },
  atrium: { number: "A", name: "Atrium", nav: "atrium", level: 0 },
  "escalator-up": { number: "A", name: "Atrium", nav: "atrium", level: 0 },
  storefront: { number: "6", name: "The Storefront", nav: "storefront", level: 6 },
  tailoring: { number: "5", name: "The Tailoring Floor", nav: "tailoring", level: 5 },
  "model-floor": { number: "4", name: "The Model Floor", nav: "model-floor", level: 4 },
  wardrobe: { number: "3", name: "Your Wardrobe", nav: "wardrobe", level: 3 },
  "back-of-house": { number: "2", name: "Back of House", nav: "back-of-house", level: 2 },
  foundations: { number: "1", name: "The Foundations", nav: "foundations", level: 1 },
  walls: { number: "—", name: "The Walls", nav: "walls", level: -1 },
  doors: { number: "G", name: "The Doors", nav: "doors", level: 0 },
  receipt: { number: "G", name: "Your Receipt", nav: "receipt", level: 0 },
  windows: { number: "ST", name: "Window Displays", nav: "windows", level: 0 },
  across: { number: "ST", name: "Across the Street", nav: "across", level: 0 },
  "talk-track": { number: "ST", name: "Talk Track", nav: "talk-track", level: 0 },
  plaque: { number: "ST", name: "Talk Track", nav: "talk-track", level: 0 },
  footer: { number: "ST", name: "Talk Track", nav: "talk-track", level: 0 },
};

/* ------------------------------------------------------------------ */
/* Scene 1 — The pavement                                               */
/* ------------------------------------------------------------------ */

export const hero = {
  roofSign: "The Department Store for AI",
  vinyl: "Open · Every brand · One checkout",
  eyebrow: "A way to explain Google Cloud AI to the board",
  headline: "One store. Every brand. One set of rules.",
  subhead:
    "Every enterprise is being asked to place the same bet: which model, which vendor, which architecture will still be right in three years. Nobody can make that bet honestly. So we built a place where you don't have to.",
  narrator: "It's late. The street is quiet and the windows are lit. You can see the racks from here. Walk in.",
  walkIn: "Walk in",
  skip: "Skip to the talk track",
};

/* ------------------------------------------------------------------ */
/* Scene 2 — The atrium                                                 */
/* ------------------------------------------------------------------ */

export const atrium = {
  narratorIn: "Through the door, and the ceiling goes up six storeys.",
  welcomeTitle: "Welcome",
  welcome: [
    "Google Cloud AI is a department store. Under one roof, on one set of shelves, it carries our own premium line, Gemini, alongside the best third-party and open brands — Claude, Llama, Mistral, Qwen, DeepSeek and hundreds more. Every one of them checks out through the same register, ships from the same logistics network, and is covered by the same security, returns and warranty desk.",
    "The store runs on one operating system, Vertex AI. It is stocked with your own goods, your data in BigQuery. And it has a tailoring floor where individual products are assembled into complete outfits.",
    "The point of a department store is not that it sells everything. It is that you never have to bet your wardrobe on a single brand, and never have to rebuild the building when fashion changes.",
  ],
  banners: [
    { n: "6", id: "storefront", name: "The Storefront", line: "Where your people shop" },
    { n: "5", id: "tailoring", name: "The Tailoring Floor", line: "Where products become solutions" },
    { n: "4", id: "model-floor", name: "The Model Floor", line: "Every serious brand on one shelf" },
    { n: "3", id: "wardrobe", name: "Your Wardrobe", line: "Your data makes it yours" },
    { n: "2", id: "back-of-house", name: "Back of House", line: "One register. One inventory. One receipt." },
    { n: "1", id: "foundations", name: "The Foundations", line: "Best economics, wherever you need it" },
  ],
  engraved: "You shouldn't have to predict the winner.",
  narratorOut:
    "We'll start at the top, where your employees start, and work our way down to the foundations. Step on.",
};

/* ------------------------------------------------------------------ */
/* Scene 3 — Escalator up                                               */
/* ------------------------------------------------------------------ */

export const escalatorUp = {
  narrator:
    "Six floors. One building. Watch the walls as we go — they're the same deep green on every level. That's not decoration. We'll come back to it.",
};

/* ------------------------------------------------------------------ */
/* Scenes 4–9 — The floors                                              */
/* ------------------------------------------------------------------ */

export const storefront: Floor = {
  id: "storefront",
  number: "6",
  name: "The Storefront",
  sub: "Where your people shop",
  narrator:
    "Daylight, tall windows, and a desk. Most of your organisation will never go further than this floor, and that's the point. They don't need to know where anything is kept. They ask.",
  signs: { desk: "Gemini Enterprise — Ask here" },
  items: [
    {
      id: "concierge",
      object: "The concierge desk",
      capability: "Gemini Enterprise",
      body: "One front door for the whole enterprise. An employee asks a question, gives an instruction, or hands over a task, and the concierge goes and gets what's needed — from any model on the floor below, from the agents on the tailoring floor, from your documents, your Workspace, your CRM, your third-party systems. Permissions come with the request. Nobody sees a floor they aren't allowed on.",
    },
    {
      id: "storecard",
      object: "The store card on the counter",
      capability: "Identity, access and Workspace integration",
      body: "The store already knows who you are. Your existing identity, your existing groups, your existing entitlements. Personalisation without leakage: the same question from two employees gets two different answers, and both are correct.",
    },
  ],
  outro: "Everything the concierge hands over was made somewhere. Let's go and see where.",
  next: { id: "tailoring", number: "5", name: "The Tailoring Floor" },
};

export const tailoring: Floor = {
  id: "tailoring",
  number: "5",
  name: "The Tailoring Floor",
  sub: "Where products become solutions",
  narrator:
    "Warmer light, a cutting table, and a mannequin halfway through a fitting. Look closely at the suit. The jacket is one brand, the lining another, the buttons a third. Nobody buys a sleeve. They buy the suit.",
  signs: { mannequin: "One suit. Several brands. Made here." },
  items: [
    {
      id: "bench",
      object: "The tailoring bench",
      capability: "Agent Development Kit",
      body: "This is where developers stitch models, tools and data into agents that do a job from start to finish. A bench, a pattern, a set of measurements. Open source, model-agnostic, and built to make the first fitting fast and the tenth one boring.",
    },
    {
      id: "alterations",
      object: "The alterations counter",
      capability: "Agent Engine",
      body: "A suit that fits on the day isn't the hard part. The hard part is the day after. Agent Engine is the managed runtime that keeps agents fitting: memory, sessions, scaling, tracing, evaluation in production. Someone to call when the hem drops.",
    },
    {
      id: "hangers",
      object: "The wall of hangers",
      capability: "Agent2Agent protocol and MCP",
      body: "Every hanger on this wall is the same size. An agent made here can hand work to an agent made somewhere else, and any tool can hook in without a custom adapter. Standard sizing is what lets a wardrobe grow without a tailor on retainer.",
    },
    {
      id: "readytowear",
      object: "The ready-to-wear rail",
      capability: "Pre-built agents",
      body: "Some jobs are the same in every company: deep research, a question against the data warehouse, a customer conversation, a code review. Those hang here ready to wear. Take one off the rail, adjust the sleeves, and go.",
    },
  ],
  outro: "Now the floor everyone comes to see.",
  next: { id: "model-floor", number: "4", name: "The Model Floor" },
};

export const modelFloor: Floor = {
  id: "model-floor",
  number: "4",
  name: "The Model Floor",
  sub: "Every serious brand on one shelf",
  narrator:
    "A long hall, and the lights are coming up rack by rack. Here's the rule of this floor: everything on it is priced against everything else on it, and everything on it goes through the same till. Take your time.",
  signs: {
    overhead: "Model Garden",
    byo: "Bring your own",
    price: "Same checkout",
    counters: "Imagen · Veo · Lyria · Chirp · MedLM",
  },
  items: [
    {
      id: "gemini",
      object: "The GEMINI rack, front and centre",
      capability: "Gemini — the house brand",
      body: "Our own line. Pro for the hard problems, Flash for the fast ones, Flash-Lite for the many. Multimodal, long-context, and tuned for the store it lives in — the data floor, the tailoring floor, the concierge upstairs. We think it's the best value on the floor. We also know that's for you to decide, which is why it isn't alone.",
    },
    {
      id: "gemma",
      object: "The GEMMA rack",
      capability: "Gemma — the house own-label",
      body: "Our open models. Sold with the weights, so you can take them to another store, run them in your own building, or fine-tune them into something that's yours. A house label you're allowed to walk out with.",
    },
    {
      id: "claude",
      object: "The CLAUDE rack",
      capability: "Claude, by Anthropic — a partner brand with the same warranty",
      body: "Frontier models from Anthropic, sold here on the same enterprise terms, inside the same security perimeter, on the same bill as the house brand. Not a concession at the back. A rack in the front row.",
    },
    {
      id: "open",
      object: "The LLAMA, MISTRAL, QWEN and DEEPSEEK racks",
      capability: "Open-weights models",
      body: "Llama, Mistral, Qwen, DeepSeek and the wider open catalogue. Price competition, no exclusive-distribution clauses, and the freedom to run them managed here or on your own infrastructure. When a new one arrives that's better and cheaper, it goes on this rack, not into a procurement cycle.",
    },
    {
      id: "specialist",
      object: "The counters: Imagen · Veo · Lyria · Chirp · MedLM",
      capability: "Specialist counters",
      body: "The camera shop, the film counter, the music room, the pharmacy. Image, video, music, speech, medical, translation, embeddings. Built for one job rather than every job, and sold on the same floor as everything else.",
    },
    {
      id: "byo",
      object: "The desk at the end of the hall",
      capability: "Custom model import and open-source serving",
      body: "Already own something? Bring it in. It gets fitted, secured, monitored and served like everything else on the floor.",
    },
  ],
  outro: "A rack of brands is only a rack of brands. What makes any of them useful is what you bring with you.",
  next: { id: "wardrobe", number: "3", name: "Your Wardrobe" },
};

export const wardrobe: Floor = {
  id: "wardrobe",
  number: "3",
  name: "Your Wardrobe",
  sub: "Your data makes it yours",
  narrator:
    "Quieter here. A wardrobe with the doors open, a dressmaker's form, a ledger. This floor is the one floor in the building that isn't ours. It's yours. We just keep it dry and locked.",
  signs: { plaque: "Your goods. Our lock." },
  items: [
    {
      id: "closet",
      object: "The wardrobe",
      capability: "BigQuery, AlloyDB, Spanner, Cloud SQL, Looker",
      body: "A model without your data is a stranger giving you fashion advice. Your transactions, your documents, your product catalogue, your history — kept here, governed here, and reachable by every rack and every agent in the building without being copied out the door.",
    },
    {
      id: "measurements",
      object: "The measurement book",
      capability: "Vector search, RAG Engine, BigQuery ML, data agents",
      body: "The store remembers your dimensions. Ask a question and the answer is grounded in your own records, cited back to the page. Nothing comes out generic when the measurements are on file.",
    },
  ],
  outro: "Most customers never see the next floor. You should.",
  next: { id: "back-of-house", number: "2", name: "Back of House" },
};

export const backOfHouse: Floor = {
  id: "back-of-house",
  number: "2",
  name: "Back of House",
  sub: "One register. One inventory. One receipt.",
  narrator:
    "Fluorescent light. No marble. This is where the store actually runs, and it's the reason a rack full of rival brands doesn't turn into a warehouse full of contracts.",
  signs: { door: "Staff only", register: "Every brand. This till." },
  items: [
    {
      id: "register",
      object: "The register and the shelving",
      capability: "Vertex AI",
      body: "One register for every brand. One inventory system, the Model Registry, so you know exactly which version of what is on which shelf. One training academy for tuning and distillation. One delivery system for online and batch. Add a model on the floor above and it's already on the books down here.",
    },
    {
      id: "fitting",
      object: "The fitting rooms",
      capability: "Vertex AI Evaluation",
      body: "Try before you buy. Take three models into the fitting room with your own task and your own rubric, and look at them side by side in the same mirror. The one that fits wins. Nothing about that decision is architectural, which is why you can make it again next quarter.",
    },
    {
      id: "qc",
      object: "The quality-control bench",
      capability: "Monitoring, grounding, citations, safety filters",
      body: "Products are checked on the way in and watched on the way out. Drift, quality, groundedness, safety — measured continuously, not once at launch.",
    },
  ],
  outro: "One more floor. Bring a coat.",
  next: { id: "foundations", number: "1", name: "The Foundations" },
};

export const foundations: Floor = {
  id: "foundations",
  number: "1",
  name: "The Foundations",
  sub: "Best economics, wherever you need it",
  narrator:
    "Dim, vast, and humming. Two loading bays, a conveyor heading off into the dark, and on a plinth in the middle, a little lit-up model of the store. Customers pick the price and the delivery time. The building decides which bay fulfils the order.",
  signs: { bays: "TPU · GPU" },
  items: [
    {
      id: "bays",
      object: "The loading bays",
      capability: "AI Hypercomputer",
      body: "Our own silicon in one bay, NVIDIA's in the other, with the storage and network to feed both. The house brand is priced the way it is because we own the factory. The partner brands are competitive because we don't make you choose a bay.",
    },
    {
      id: "franchise",
      object: "The model on the plinth",
      capability: "Google Distributed Cloud",
      body: "For sovereign, regulated or disconnected markets, the whole store opens inside your own building. Same brands, same operating system, same rules. Air-gapped if it has to be.",
    },
    {
      id: "conveyor",
      object: "The conveyor",
      capability: "Multi-cloud and hybrid",
      body: "Shop here, stock elsewhere. If part of your estate lives in another cloud or on your own floor, the store still works. The conveyor runs both ways.",
    },
  ],
  outro: "Now step back. Look at the whole building.",
  next: { id: "walls", number: "—", name: "The Walls" },
};

export const floors = [storefront, tailoring, modelFloor, wardrobe, backOfHouse, foundations] as const;

/* ------------------------------------------------------------------ */
/* Scene 10 — The walls                                                 */
/* ------------------------------------------------------------------ */

export const walls = {
  id: "walls",
  name: "The Walls",
  lettering: "Security · Governance · Residency · Audit",
  narrator:
    "The green walls you've seen on every floor. They're the building's frame, not its paint. Every rack, every agent, every wardrobe you walked past sits inside them — which means adding a brand never means adding a risk review.",
  items: [
    {
      id: "security",
      object: "The security desk",
      capability: "Model Armor, IAM, VPC Service Controls, CMEK, data residency, SecOps",
      body: "Guards at every door and cameras on every floor. Prompts and responses screened, keys held where you say, data kept in the country you name. Nothing leaves without a receipt.",
    },
    {
      id: "returns",
      object: "The returns and compliance counter",
      capability: "Audit logging, indemnification, responsible-AI tooling, sovereignty controls",
      body: "Who bought what, when, for whom, and who is liable if it fails. The paperwork a regulated enterprise needs, produced once for the whole store rather than once per vendor.",
    },
  ] as Item[],
  caption: "You have walked all of this. Click any floor to go back.",
  next: { id: "doors", number: "G", name: "The Doors" },
};

/* ------------------------------------------------------------------ */
/* Scene 11 — The doors                                                 */
/* ------------------------------------------------------------------ */

export const doors = {
  id: "doors",
  number: "G",
  name: "The Doors",
  narrator: "Ground floor again. Two doors, both open, and a glass annex between them.",
  dockSign: "Loading dock — Bring your own",
  crates: ["Your models", "Your data", "Your agents"],
  exitSign: "Exit",
  exitSub: "Open APIs · Open weights · A2A · MCP",
  annexSign: "Marketplace & Partners",
  items: [
    {
      id: "inbound",
      object: "The loading dock",
      capability: "Open APIs and open standards, inbound",
      body: "What you've already built comes in on the dock. OpenAI-compatible endpoints, MCP tools, A2A agents, imported weights. No re-platforming to get through the door.",
    },
    {
      id: "outbound",
      object: "The front doors",
      capability: "Open APIs and open standards, outbound",
      body: "What you build here can leave. Open weights, exportable agent code, open protocols, a franchise store you can run yourself. Customers stay because the store is good, not because the doors are locked.",
    },
    {
      id: "annex",
      object: "The annex",
      capability: "Google Cloud Marketplace, partners and services",
      body: "Third-party brands running their own counters inside the store, billed on the same account and drawn down against the same commitment. And the people who know the building best — partners, integrators, Google Cloud Consulting — for when you want a tailor, not just a tape measure.",
    },
  ] as Item[],
  narratorOut:
    "That's the tour. Before you go, here's what one customer's first day actually looked like.",
};

/* ------------------------------------------------------------------ */
/* Scene 12 — Your receipt                                              */
/* ------------------------------------------------------------------ */

export const receipt = {
  title: "Your receipt",
  header: "The Department Store for AI",
  subheader: "Customer: a regional bank · Day: Monday",
  lines: [
    {
      title: "Entering the store",
      body: "The CIO doesn't start on the model floor. She starts at the concierge. Gemini Enterprise is switched on for 5,000 employees in a week, connected to Workspace, SharePoint and the CRM, with identity and permissions inherited. Employees are shopping on day one.",
    },
    {
      title: "Browsing the model floor",
      body: "For contact-centre summarisation the data science team short-lists Gemini Flash for cost, Claude for tone, and an open model for sovereignty. They don't argue about it in a meeting. They take all three to the fitting room.",
    },
    {
      title: "The fitting room",
      body: "Vertex AI Evaluation runs the three against 2,000 anonymised transcripts with the bank's own rubric. Gemini Flash wins on cost-per-quality for summarisation. Claude wins for complaint-response drafts. They keep both. Nothing about the choice is architectural.",
    },
    {
      title: "Bringing in the wardrobe",
      body: "Transactions in BigQuery, policy documents in Cloud Storage, product catalogue in AlloyDB. RAG Engine and vector search give the models the bank's own measurements. Grounding and citations make every answer traceable.",
    },
    {
      title: "Tailoring",
      body: "With ADK the team builds a dispute-resolution agent: it reads the complaint, checks the transaction in BigQuery, drafts a response with Claude, summarises the case with Gemini Flash, and files it via MCP tools. One suit, several brands.",
    },
    {
      title: "Alterations and delivery",
      body: "The agent goes live on Agent Engine. Sessions, memory, scaling and tracing handled. Model Armor screens every prompt and response. Every call is logged. Employees reach it through the concierge without knowing what's underneath.",
    },
    {
      title: "Governance",
      body: "Risk and compliance see one audit trail across every model, agent and dataset. Data residency is pinned in-country. Nobody writes a separate governance story per vendor.",
    },
    {
      title: "Eighteen months later",
      body: "A new open model appears that is better and cheaper for summarisation. The team runs it through the same fitting room, changes one line in the agent's configuration, and the concierge, the data, the security perimeter and the audit trail are untouched. The store did not need to be rebuilt to change a brand.",
    },
  ],
  footer: "Thank you for shopping. Doors open both ways.",
};

/* ------------------------------------------------------------------ */
/* Scene 13 — Window displays                                           */
/* ------------------------------------------------------------------ */

export const windows = {
  title: "Window displays",
  narrator: "Back on the street. Six windows, six reasons.",
  items: [
    {
      id: "choice",
      title: "Choice, at every layer",
      body: "Model, modality, framework, chip and location are separate decisions. A department store isn't one of everything. It's curated breadth with a single checkout.",
    },
    {
      id: "optionality",
      title: "Optionality is the strategy",
      body: "Frontier leadership has changed hands repeatedly and will again. The only durable bet is to be able to switch. A store that stocks every serious brand turns a forecasting problem into a procurement decision.",
    },
    {
      id: "economics",
      title: "Economics",
      body: "Brands priced against each other on the same shelf, so every price drop is yours. A house brand made in our own factory. One commitment, drawn down across the whole store, Marketplace included.",
    },
    {
      id: "velocity",
      title: "Velocity",
      body: "New models arrive on the shelf in days, already wired into evaluation, security and billing. Teams try things in the fitting room, not in a procurement cycle.",
    },
    {
      id: "governance",
      title: "Governance that's horizontal",
      body: "Security, audit, residency and evaluation live in the building, not the brand. Add a model and it inherits the controls. That is the difference between a platform and a stack of contracts.",
    },
    {
      id: "lockin",
      title: "No lock-in, by design",
      body: "Open weights, open protocols, open APIs, a franchise you can run yourself, and exit doors that open. You stay because the store is good.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Scene 14 — Across the street                                         */
/* ------------------------------------------------------------------ */

export const across = {
  title: "Across the street",
  narrator:
    "Three other ways to build, and none of them are wrong. They just optimise for different things. Choose knowingly.",
  shops: [
    {
      id: "boutique",
      awning: "The single-brand boutique",
      body: "Everything from one designer. Beautiful, coherent, and often genuinely excellent — this season. But your whole wardrobe now follows one house's taste, pricing and roadmap. If they have a bad year, or someone else gets better and cheaper, your choices are to accept it or move house. The coherence is real. So is the concentration risk.",
    },
    {
      id: "bazaar",
      awning: "The marketplace without an operating layer",
      body: "Enormous selection, low prices, and you carry everything home in bags. No fitting room, no shared security, no single receipt, no one to call when the pieces don't fit. The integration cost is yours, and every enterprise ends up building its own private department store on top. Badly. More than once.",
    },
    {
      id: "warehouse",
      awning: "The infrastructure warehouse",
      body: "Racks of the best compute at the best price, and nothing else. Exactly right for the handful of companies building frontier models. For everyone else, it means hiring the staff, building the shelves, writing the security policy and negotiating the brand contracts before the first employee can buy anything.",
    },
  ],
  columns: ["Boutique", "Marketplace", "Warehouse", "Department store"],
  rows: [
    { label: "Model choice", cells: ["One family", "Very wide", "Bring your own", "Curated breadth, house brand included"] },
    { label: "Integration burden", cells: ["Low", "High", "Very high", "Low"] },
    { label: "Shared governance", cells: ["One vendor only", "No", "No", "Yes, across every brand"] },
    { label: "Switching cost", cells: ["High", "Low", "n/a", "Low"] },
    { label: "Price competition on the shelf", cells: ["No", "Yes", "n/a", "Yes"] },
    { label: "Owns its own factories", cells: ["Sometimes", "No", "Yes", "Yes, plus partners"] },
  ],
  closing:
    "The department store is the only one that gives you the choice of the marketplace and the coherence of the boutique.",
};

/* ------------------------------------------------------------------ */
/* Scene 15 — The talk track                                            */
/* ------------------------------------------------------------------ */

export const talk = {
  title: "The Talk Track",
  lectern: "For the CEO, CIO or CTO · 60–90 seconds",
  paragraphs: [
    "Every enterprise I talk to is being asked to make the same bet: pick the model, pick the vendor, pick the architecture that will still be the right answer in three years. Nobody can make that bet honestly. Frontier leadership has changed hands several times in eighteen months, and it will keep changing.",
    "So we've built something different. Think of Google Cloud AI as a department store. Gemini is our house brand — we're proud of it and it's on the front rack. But on the same shelves you'll find Claude, Llama, Mistral, Qwen, open models, specialist models for image, video and speech — hundreds of them. Same checkout, same security, same audit trail, same contract.",
    "Underneath is Vertex AI: the store's operating system. Fitting rooms where you test any model on your own data before you commit. A tailoring floor where you stitch models and tools into agents that do real work. Your own data in BigQuery so every answer is about your business, not a generic one. And the whole building is wrapped in one security and governance perimeter, so adding a model never means adding a risk review.",
    "The doors open both ways. Bring what you've already built. Take out what you build here.",
    "The point is simple: you shouldn't have to predict the winner. You should be able to choose the best capability for each job, today and again next year, without rebuilding the store every time the market moves. That's what we're offering.",
  ],
  button: "Copy talk track",
};

/* ------------------------------------------------------------------ */
/* Scene 16 — The plaque                                                */
/* ------------------------------------------------------------------ */

export const plaque = {
  title: "Where the analogy strains",
  body: "Two places the store metaphor breaks, and both break in your favour. In a real store you cannot take a competitor's product home cheaper than you bought it; here, model prices fall every quarter and you capture the drop automatically. And real department stores rarely own the factories; Google does, which is why the house brand is both frontier-class and inexpensive, and why the store can afford to carry rivals on the same shelf without fear.",
};

/* ------------------------------------------------------------------ */
/* Scene 17 — Footer                                                    */
/* ------------------------------------------------------------------ */

export const footer = {
  narrator: "The lights stay on. Come back whenever the market moves.",
  attribution:
    "A field narrative from Google Cloud JAPAC. Product names belong to their respective owners. Built as a point of view, not an official product page.",
  year: "2026",
};
