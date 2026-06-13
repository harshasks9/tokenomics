import { callCost } from "../pricing";

// ─── S1: Build (SDLC) ───────────────────────────────────────────────────
export const SHOP_S1 = {
  routineTask: { inTok: 120_000, outTok: 25_000 }, // boilerplate, CRUD, feed importers, tests
  complexTask: { inTok: 400_000, outTok: 60_000 }, // search relevance, pricing engine, hard bugs
  defaultMix:  { routinePct: 0.70, complexPct: 0.30 },
  tasksPerDevPerSprint: 40,
  defaults: { devs: 12, sprints: 13 },
};

export interface ShopS1Task {
  title: string;
  tier: "flash" | "opus";
  why: string;
}

export const SHOP_S1_TASKS: ShopS1Task[] = [
  // Opus — complex
  { title: "Design search-relevance & ranking architecture", tier: "opus", why: "Multi-factor ranking systems require deep reasoning across embedding strategies, re-ranking layers, and A/B testing infrastructure." },
  { title: "Build pricing/promotions rules engine", tier: "opus", why: "Pricing logic involves layered business rules, margin guardrails, and edge-case handling across product hierarchies." },
  { title: "Handle payment & fraud edge cases", tier: "opus", why: "Fraud prevention and payment logic require reasoning across failure modes, regulatory constraints, and real-time signals." },
  { title: "Design multi-tenant data isolation", tier: "opus", why: "Row-level security and tenant scoping must be architecturally sound — mistakes here have serious data-leak consequences." },
  { title: "Plan merchandising agent graph", tier: "opus", why: "Multi-step agentic architecture requires careful planning of tool selection, state management, and failure recovery." },
  { title: "Build cart/checkout flow", tier: "opus", why: "Checkout state machines coordinate inventory, pricing, tax, payments, and failure recovery across several systems." },
  { title: "Integrate payment + tax providers", tier: "opus", why: "Payment and tax integrations need careful reasoning about idempotency, retries, and high-cost edge cases." },
  { title: "Refactor catalog service", tier: "opus", why: "A cross-cutting catalog refactor needs architectural judgment across search, inventory, pricing, and merchandising." },
  { title: "Wire RAG ingestion for product docs", tier: "opus", why: "Chunking, retrieval, and evaluation choices affect product accuracy and require deliberate technical judgment." },
  // Flash — routine
  { title: "Scaffold PLP/PDP React components", tier: "flash", why: "Standard list/detail UI components from well-defined Figma specs — mechanical pattern application." },
  { title: "CRUD for SKU & inventory", tier: "flash", why: "Standard database operations following established ORM patterns — repetitive but predictable." },
  { title: "Write supplier-feed CSV/XML importers", tier: "flash", why: "Straightforward data parsing and mapping with clear input/output schemas." },
  { title: "Generate OpenAPI docs from route handlers", tier: "flash", why: "Extracting types and descriptions from existing code — pure documentation work." },
  { title: "Unit tests for cart/checkout", tier: "flash", why: "Test generation from existing logic is pattern-based and well-defined." },
  { title: "Image-alt & SEO meta generation", tier: "flash", why: "Template-driven content generation with clear product data as input." },
  { title: "Seed catalog fixtures", tier: "flash", why: "Generating realistic test data — creative but not complex." },
  { title: "Write E2E test flows for checkout", tier: "flash", why: "Step-by-step UI interaction tests from user stories — mechanical translation." },
  { title: "Add input validation to all form fields", tier: "flash", why: "Repetitive Zod/Yup schema generation from TypeScript types." },
  { title: "Generate i18n string keys for storefront", tier: "flash", why: "Mechanical extraction of UI strings across component files." },
  { title: "Add error boundary wrappers to product routes", tier: "flash", why: "Repetitive wrapper pattern applied across known route files." },
];

export type ShopS1Baseline = "allOpus" | "tiered";

export function shopS1Costs(devs: number, sprints: number, baseline: ShopS1Baseline = "tiered") {
  const totalTasks = devs * SHOP_S1.tasksPerDevPerSprint;
  const { routinePct, complexPct } = SHOP_S1.defaultMix;
  const routineTasks  = totalTasks * routinePct;
  const complexTasks  = totalTasks * complexPct;

  const { routineTask, complexTask } = SHOP_S1;

  const allOpusPerSprint =
    routineTasks * callCost("opus", routineTask.inTok, routineTask.outTok) +
    complexTasks * callCost("opus", complexTask.inTok, complexTask.outTok);

  const tieredPerSprint =
    routineTasks * callCost("flash",  routineTask.inTok, routineTask.outTok) +
    complexTasks * callCost("opus",   complexTask.inTok, complexTask.outTok);

  const chosen = baseline === "allOpus" ? allOpusPerSprint : tieredPerSprint;

  return {
    allOpusPerSprint,   allOpusTotal:   allOpusPerSprint   * sprints,
    tieredPerSprint,    tieredTotal:    tieredPerSprint    * sprints,
    chosen,             chosenTotal:    chosen             * sprints,
  };
}

// ─── S2: In-App Shopping Assistant ──────────────────────────────────────
export const SHOP_S2 = {
  query: { inTok: 3_000, outTok: 400 },
  tieredMix: { flashLitePct: 0.65, flashPct: 0.25, opusPct: 0.10 },
  defaults: { queriesPerMonth: 15_000_000 },
};

export type ShopS2Baseline = "opus";

export function shopS2Costs(queriesPerMonth: number) {
  const { inTok, outTok } = SHOP_S2.query;
  const { flashLitePct, flashPct, opusPct } = SHOP_S2.tieredMix;

  const perQueryOpus      = callCost("opus",      inTok, outTok);
  const perQueryFlash     = callCost("flash",     inTok, outTok);
  const perQueryFlashLite = callCost("flashLite", inTok, outTok);

  const perQueryTiered =
    flashLitePct * perQueryFlashLite +
    flashPct     * perQueryFlash     +
    opusPct      * perQueryOpus;

  const allOpus      = queriesPerMonth * perQueryOpus;
  const allFlash     = queriesPerMonth * perQueryFlash;
  const allFlashLite = queriesPerMonth * perQueryFlashLite;
  const tiered       = queriesPerMonth * perQueryTiered;

  return {
    allOpus, allFlash, allFlashLite, tiered,
    allOpusAnnual:      allOpus      * 12,
    tieredAnnual:       tiered       * 12,
    perQueryOpus, perQueryFlash, perQueryFlashLite, perQueryTiered,
  };
}

export interface ShopS2QAPair {
  id: string;
  question: string;
  category: "routine" | "faq" | "complex";
  answers: { flashLite: string; flash: string; opus: string };
  scores: { flashLite: number; flash: number; opus: number };
  sellerNote?: string;
}

export const SHOP_S2_QA: ShopS2QAPair[] = [
  {
    id: "q1",
    category: "routine",
    question: "Do you have this in medium?",
    answers: {
      flashLite: "Yes! The Coastal Linen Shirt is available in Medium. Add it to your cart now — it's in stock.",
      flash:     "Yes, the Coastal Linen Shirt is available in Medium. Would you like me to add it to your cart?",
      opus:      "Yes, Medium is available in the Coastal Linen Shirt. It's currently in stock. Would you like to add it to your cart, or is there a specific colour you had in mind?",
    },
    scores: { flashLite: 5, flash: 5, opus: 5 },
  },
  {
    id: "q2",
    category: "routine",
    question: "When will it arrive to 560001?",
    answers: {
      flashLite: "Standard delivery to 560001 (Bengaluru) takes 3–5 business days. Express available for ₹99 — arrives in 1–2 days.",
      flash:     "For pin code 560001, standard delivery is 3–5 business days. Express delivery (₹99 extra) arrives in 1–2 business days.",
      opus:      "For your pin code 560001 (Bengaluru), standard delivery takes 3–5 business days and is free on orders over ₹499. Express delivery (₹99) arrives in 1–2 business days. Would you like to upgrade?",
    },
    scores: { flashLite: 5, flash: 5, opus: 5 },
  },
  {
    id: "q3",
    category: "faq",
    question: "What's your return policy?",
    answers: {
      flashLite: "Returns accepted within 30 days of delivery for most items. Items must be unused, unwashed, with original tags. Initiate at My Orders > Return.",
      flash:     "You can return most items within 30 days of delivery, as long as they're unused and in original packaging with tags attached. Start a return from My Orders.",
      opus:      "Our return window is 30 days from delivery. Items must be unused, unwashed, and have original tags. Categories excluded: innerwear, earrings, and customised items. To initiate: My Orders → Return Request → select reason. Refunds go to the original payment method within 5–7 business days after pickup.",
    },
    scores: { flashLite: 4, flash: 5, opus: 5 },
  },
  {
    id: "q4",
    category: "faq",
    question: "Is this final sale?",
    answers: {
      flashLite: "Yes, sale items marked 'Final Sale' are not eligible for return or exchange.",
      flash:     "Items marked 'Final Sale' are non-returnable and non-exchangeable. This item appears to be in our end-of-season sale — I'll check if it's marked Final Sale.",
      opus:      "Great question. 'Final Sale' means the item is excluded from our standard 30-day return policy. You can confirm by checking the product page for the red 'Final Sale' badge — if it's there, no returns or exchanges apply. If you don't see that badge, our normal policy covers it.",
    },
    scores: { flashLite: 4, flash: 5, opus: 5 },
  },
  {
    id: "q5",
    category: "complex",
    question: "Anniversary gift for my wife who likes hiking and minimalist design under ₹3,000.",
    answers: {
      flashLite: "Here are a few options:\n\n• Hiking socks set — ₹799\n• Water bottle (stainless) — ₹1,299\n• Trekking backpack — ₹2,499\n\nAll under ₹3,000 and suitable for hiking.",
      flash:     "Great choice! Here are some hiking + minimalist picks under ₹3,000:\n\n• **Merino wool trail socks (3-pack)** — ₹899 — lightweight, moisture-wicking\n• **Hydro Flask 500ml water bottle** — ₹1,599 — clean design, keeps water cold 24 hrs\n• **Osprey Daylite 13L pack** — ₹2,799 — minimalist carry for day hikes\n\nThe water bottle or pack would make a thoughtful standalone gift.",
      opus:      "A thoughtful anniversary gift that combines her love of hiking with minimalist aesthetics — here's how I'd approach it:\n\n**Tier 1: Statement gift (₹2,500–3,000)**\n🎁 **Osprey Daylite 13L Daypack** — ₹2,799\nClean, featherweight design (290g), no superfluous pockets. Fits a hydration sleeve and 13L of essentials. The kind of pack that disappears into your back. Free gift-wrapping available.\n\n**Tier 2: Thoughtful set (₹2,400–2,600)**\n• **Hydro Flask 500ml Flex Cap** ₹1,599 — powder-coated, timeless silhouette\n• **Smartwool PhD Outdoor Light Mini socks (2-pack)** ₹899\nCombined: practical, premium-feel, and shows you thought about the details of her hikes.\n\n**Why these?** Minimalist hikers tend to dislike gear that shouts 'outdoorsy' — both options lean functional-beautiful. The Osprey pack particularly resonates because it transitions from trail to city.\n\nWould you like me to add either option to your cart with a gift message?",
    },
    scores: { flashLite: 2, flash: 3, opus: 5 },
    sellerNote: "This is the basket-size moment. Opus's curated recommendation with purchase rationale drives add-to-cart on premium SKUs. The 10% routing allocation here is a margin investment, not an overhead.",
  },
  {
    id: "q6",
    category: "complex",
    question: "Style a smart-casual outfit around these navy chinos for a summer wedding.",
    answers: {
      flashLite: "For a summer wedding with navy chinos:\n• White linen shirt\n• Brown loafers\n• No tie needed for smart-casual\n• Optional blazer",
      flash:     "Navy chinos are a solid smart-casual foundation. For a summer wedding:\n• **White or light blue linen shirt** — breathable, elegant\n• **Tan/cognac loafers** — warm contrast to navy\n• **No socks or no-show socks** — keeps it light\n• **Optional: unstructured beige blazer** for a polished finish\n\nAvoid heavy fabrics or dark colours — summer weddings call for lightness.",
      opus:      "Excellent base — navy chinos are one of the most versatile smart-casual pieces. Let me build a complete outfit and explain the logic:\n\n**The complete look:**\n\n1. **Sky-blue linen shirt** (Riviera Linen, ₹1,899) — Tonal dressing (blue-on-blue with variation in depth) is the 2026 smart-casual move. Linen is essential for summer.\n\n2. **Tan suede Derby shoes** (₹2,499) — The cognac/tan-navy pairing is a classic menswear rule: warm earth tones anchor cool-toned navy beautifully. Suede keeps it from reading too formal.\n\n3. **White linen pocket square, no tie** — Adds structure without the formality of a tie. A rolled square (not a fold) signals relaxed confidence.\n\n4. **Cognac leather belt** — Always match to shoes in materials/tone.\n\n**Optional layer:** Unstructured white or ivory linen blazer if the ceremony is indoors or evening. Roll the sleeves for that effortless feel.\n\n**What to avoid:** Anything black (too stark in summer), printed shirts (fights the occasion), rubber-soled shoes (too casual).\n\nWant me to pull the exact shirt and shoe options to your cart? I can also check if the shoes come in your size.",
    },
    scores: { flashLite: 2, flash: 3, opus: 5 },
    sellerNote: "Styling recommendations are cross-sell engines. Opus recommends a complete 3-item outfit (shirt + shoes + belt) and offers to add to cart. FlashLite stops at bullet points. The margin difference per session justifies the routing cost.",
  },
];

// ─── S3: Visual Search ───────────────────────────────────────────────────
export const SHOP_S3 = {
  visionInput:     10_000,
  analysisOut:        800,
  structuredOut:      500,
  structuredReInput: 2_500,
  lanes: {
    pureClaude:   { model: "opus"      as const, latencyMs: 3_500, quality: 5, label: "Pure Claude (Opus vision)" },
    pureGemini:   { model: "flash"     as const, latencyMs:   700, quality: 4, label: "Pure Gemini (3.5 Flash, native)" },
    hybrid:       { ingest: "flash" as const, analyze: "opus" as const, latencyMs: 2_200, quality: 5, label: "Hybrid (Flash ingest → Opus analyze)" },
  },
  defaults: { interactionsPerYear: 8_000_000 },
};

export interface VisualSearchCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  matchedProducts: { name: string; category: string; confidence: number }[];
}

export const SHOP_S3_CARDS: VisualSearchCard[] = [
  {
    id: "vs1",
    title: "Summer outfit — shopper photo",
    description: "Floral midi dress, white sneakers, straw bag",
    tags: ["floral print", "midi length", "white footwear", "casual summer", "warm tones"],
    matchedProducts: [
      { name: "Bloom Floral Midi Dress", category: "Dresses", confidence: 96 },
      { name: "Classic Canvas Sneakers (White)", category: "Footwear", confidence: 91 },
      { name: "Woven Raffia Tote Bag", category: "Bags", confidence: 88 },
      { name: "Sundrop Linen Shirt Dress", category: "Dresses", confidence: 82 },
    ],
  },
  {
    id: "vs2",
    title: "Room styling — bedroom photo",
    description: "Scandinavian bedroom: white walls, oak furniture, linen bedding",
    tags: ["Scandinavian", "minimalist", "oak tones", "white & neutral", "linen texture"],
    matchedProducts: [
      { name: "Nordic Oak Bedside Table", category: "Furniture", confidence: 94 },
      { name: "Stone-Washed Linen Duvet Set", category: "Bedding", confidence: 90 },
      { name: "Slim Arc Floor Lamp (Oak)", category: "Lighting", confidence: 87 },
      { name: "Herringbone Wool Throw (Ivory)", category: "Textiles", confidence: 85 },
    ],
  },
  {
    id: "vs3",
    title: "Product match — watch photo",
    description: "Vintage-style field watch, brown leather strap, cream dial",
    tags: ["vintage", "field watch", "leather strap", "cream dial", "minimalist face"],
    matchedProducts: [
      { name: "Garrison Field Watch (Cream)", category: "Watches", confidence: 97 },
      { name: "Heritage Canvas Watch Strap — Tan", category: "Watch Accessories", confidence: 89 },
      { name: "Expedition Pilot Watch (Ivory)", category: "Watches", confidence: 84 },
      { name: "Leather Watch Roll (Cognac)", category: "Watch Accessories", confidence: 79 },
    ],
  },
];

export function shopS3Costs() {
  const { visionInput, analysisOut, structuredOut, structuredReInput } = SHOP_S3;

  const pureClaude = callCost("opus", visionInput, analysisOut);
  const pureGemini = callCost("flash", visionInput, analysisOut);
  const hybrid = callCost("flash", visionInput, structuredOut) + callCost("opus", structuredReInput, analysisOut);

  return { pureClaude, pureGemini, hybrid };
}

// ─── S4: Nightly Merchandising Agent ────────────────────────────────────
export const SHOP_S4 = {
  planner:  { inTok: 5_000, outTok: 2_000 },
  review:   { inTok: 8_000, outTok: 1_500 },
  executor: { inTok: 3_500, outTok: 1_200 },
  steps: 16,
  configs: {
    allOpus:   { planner: "opus"   as const, executor: "opus"   as const, review: "opus"   as const },
    tiered:    { planner: "opus"   as const, executor: "flash"  as const, review: "opus"   as const },
  },
  defaults: { skusPerNight: 5_000, nightsPerYear: 365 },
};

export type ShopS4Config = keyof typeof SHOP_S4["configs"];

export interface ShopAgentNode {
  id: number;
  label: string;
  role: "planner" | "executor" | "reviewer";
  inTok: number;
  outTok: number;
}

export const SHOP_S4_TRACE: ShopAgentNode[] = [
  { id: 0,  label: "Plan merchandising tasks",        role: "planner",  inTok: 5_000, outTok: 2_000 },
  { id: 1,  label: "Pull inventory levels",           role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 2,  label: "Detect stockouts",                role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 3,  label: "Read demand signals",             role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 4,  label: "Summarize competitor prices",     role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 5,  label: "Compute reorder qty",             role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 6,  label: "Draft PO",                        role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 7,  label: "Categorize new SKUs",             role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 8,  label: "Generate product copy",           role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 9,  label: "Generate SEO meta",               role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 10, label: "Check price elasticity",          role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 11, label: "Flag margin outliers",            role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 12, label: "Refresh recommendations",         role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 13, label: "Update bundles",                  role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 14, label: "Localize copy",                   role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 15, label: "Validate feed",                   role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 16, label: "QA copy",                         role: "executor", inTok: 3_500, outTok: 1_200 },
  { id: 17, label: "Review: pricing + margin",        role: "reviewer", inTok: 8_000, outTok: 1_500 },
];

export function shopS4Costs(cfg: ShopS4Config = "tiered") {
  const config = SHOP_S4.configs[cfg];
  const { planner, review, executor, steps } = SHOP_S4;

  const plannerCost  = callCost(config.planner,  planner.inTok,  planner.outTok);
  const reviewCost   = callCost(config.review,   review.inTok,   review.outTok);
  const executorCost = steps * callCost(config.executor, executor.inTok, executor.outTok);

  return { plannerCost, reviewCost, executorCost, total: plannerCost + executorCost + reviewCost };
}

export function shopS4Annual(skusPerNight: number, cfg: ShopS4Config = "tiered") {
  return shopS4Costs(cfg).total * skusPerNight * SHOP_S4.defaults.nightsPerYear;
}

// ─── Seller Notes ────────────────────────────────────────────────────────
export const SHOP_SELLER_NOTES = {
  s1: {
    title: "Build Phase — Tiered Dev Routing",
    assumption: "70% routine / 30% complex task split across a mature commerce platform backlog.",
    sayThis: "Use Opus for search, checkout, pricing, fraud, and architecture. The repetitive 70% belongs on Flash.",
  },
  s2: {
    title: "Run Phase — Shopping Assistant",
    assumption: "15M queries/mo for a large retailer. Routing mix is 65% Flash-Lite, 25% Flash, and 10% Opus.",
    sayThis: "Routine availability and policy questions stay cheap; Opus is reserved for recommendation moments that can grow the basket.",
  },
  s3: {
    title: "Run Phase — Visual Search",
    assumption: "8M visual search interactions/yr at peak for a mid-large fashion retailer with active app. Latency figures are p95 for each pipeline.",
    sayThis: "Flash handles image extraction quickly, then Opus reasons over a compact product representation for quality-five matching at lower cost.",
  },
  s4: {
    title: "Extend Phase — Merchandising Agent",
    assumption: "Agent runs only on SKUs requiring attention nightly — new items, stockouts, price moves. 5K SKUs/night for a mid-size catalogue.",
    sayThis: "The 16 repetitive executor steps hold most of the tokens. Flash removes that spend while Opus still owns the plan and final pricing review.",
  },
};
