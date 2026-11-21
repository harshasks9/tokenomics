/**
 * Editorial layer — content written by this site's editors rather than taken
 * from a source: example workloads, the agent request path, enterprise
 * workload guidance. Everything here is analyst interpretation and is
 * labelled that way wherever it is shown. Product references are canonical
 * entity ids; an id that is not in the knowledge base is simply not rendered.
 */
import type { EnterpriseWorkload, WorkloadScenario } from "./types";

/** Example workloads for the pricing calculator. The numbers are illustrative assumptions, not measurements. */
export const SCENARIOS: (WorkloadScenario & { needs: ("text" | "image" | "audio" | "video" | "pdf")[] })[] = [
  { id: "support-assistant", name: "Customer-support assistant", description: "Chat assistant answering from a help centre. Long, stable system prompt and retrieved passages; short answers.", requestsPerMonth: 1_000_000, inputTokens: 6_000, outputTokens: 350, cachedShare: 0.6, batchShare: 0, thinkingRatio: 0, attemptsPerTask: 1, needs: ["text"] },
  { id: "enterprise-search", name: "Enterprise search with grounding", description: "Employees ask questions over company documents. Large retrieved context, cited answer.", requestsPerMonth: 300_000, inputTokens: 20_000, outputTokens: 700, cachedShare: 0.2, batchShare: 0, thinkingRatio: 0.5, attemptsPerTask: 1, needs: ["text", "pdf"] },
  { id: "coding-agent", name: "Coding agent", description: "An agent that reads a repository, plans, edits and runs tests. Many model calls per finished task, heavy reasoning.", requestsPerMonth: 20_000, inputTokens: 60_000, outputTokens: 4_000, cachedShare: 0.7, batchShare: 0, thinkingRatio: 2, attemptsPerTask: 25, needs: ["text"] },
  { id: "document-pipeline", name: "Document processing pipeline", description: "Overnight extraction from invoices, contracts and forms into structured data. Not time-sensitive.", requestsPerMonth: 2_000_000, inputTokens: 8_000, outputTokens: 600, cachedShare: 0.1, batchShare: 1, thinkingRatio: 0, attemptsPerTask: 1.05, needs: ["text", "pdf", "image"] },
  { id: "voice-agent", name: "Voice agent (text-token view)", description: "Contact-centre voice agent, costed on the text tokens of each turn. Audio is metered separately and is not included here.", requestsPerMonth: 4_000_000, inputTokens: 3_000, outputTokens: 150, cachedShare: 0.5, batchShare: 0, thinkingRatio: 0, attemptsPerTask: 1, needs: ["text", "audio"] },
];

export interface FlowStep {
  id: string;
  name: string;
  job: string;
  question: string;
  entityIds: string[];
}

/** The path of one agent request. Filled in below once component ids are known. */
export const AGENT_FLOW: FlowStep[] = [
  { id: "entry", name: "Where the request starts", job: "A person or another system asks for something: in a chat surface, inside a work app, on a phone line or through an API.", question: "Which surface owns the conversation, and does the agent act for a signed-in employee, a customer or a system?", entityIds: ["gemini-enterprise", "gemini-in-workspace", "gemini-for-customer-experience", "gemini-app", "a2ui-protocol"] },
  { id: "build", name: "Define the agent", job: "The agent's instructions, tools and sub-agents are written in code or assembled without code, and published so others can find it.", question: "Who builds it — developers in code, or business teams in a designer — and where is it published?", entityIds: ["agent-development-kit", "agent-designer", "agent-studio", "agent-garden", "agent-marketplace"] },
  { id: "model", name: "Choose and reach the model", job: "Each step is sent to a model. Which one, on which serving tier, decides quality, latency and most of the bill.", question: "Which model per step, and is capacity bought on demand, in batch or reserved?", entityIds: ["gemini", "gemini-flash", "model-garden", "smart-routing", "agent-platform-paygo-tiers", "provisioned-throughput"] },
  { id: "run", name: "Run it", job: "A managed runtime executes the agent loop, keeps the session, remembers across sessions and gives it a safe place to run code.", question: "How long do tasks run, what state must survive, and where does generated code execute?", entityIds: ["agent-runtime", "agent-sessions", "agent-memory-bank", "agent-sandbox", "managed-agents-api", "agent-compute-engine"] },
  { id: "ground", name: "Ground it in data", job: "The agent retrieves company documents, records and web results so answers rest on current facts, not on the model's memory.", question: "Which sources are authoritative, who may see what, and how fresh must the index be?", entityIds: ["agent-search", "rag-engine", "vector-search", "gemini-enterprise-connectors", "grounding-with-your-data", "grounding-with-google-search", "knowledge-catalog"] },
  { id: "act", name: "Reach tools and other agents", job: "The agent calls APIs and tools, hands work to other agents, operates a browser or completes a purchase through open protocols.", question: "Which systems may it change, through which protocol, and what needs a human in the loop?", entityIds: ["google-managed-mcp-servers", "model-context-protocol", "apigee", "a2a-protocol", "computer-use", "universal-commerce-protocol", "ap2-protocol"] },
  { id: "govern", name: "Identify and control", job: "Every agent gets an identity, a registry entry and a policy checkpoint; prompts and responses are screened.", question: "Can you say which agent did what, on whose behalf, and stop it?", entityIds: ["agent-identity", "agent-registry", "agent-gateway", "model-armor", "agent-security"] },
  { id: "operate", name: "Evaluate and operate", job: "Agents are tested before release, simulated against scenarios, traced in production and tuned.", question: "What is the pass bar before launch, and what do you watch after it?", entityIds: ["agent-evaluation", "agent-simulation", "agent-observability", "agent-optimizer", "gen-ai-evaluation-service"] },
];

export interface ReviewFinding {
  severity: "blocker" | "major" | "minor";
  finding: string;
  resolution: string;
  status: "fixed" | "accepted-limitation" | "open";
}
export interface ReviewerReport {
  role: string;
  lens: string;
  verdict: string;
  findings: ReviewFinding[];
}

/** Independent review, written after the build by five reviewer roles. Filled in below. */
export const REVIEW: ReviewerReport[] = [
  {
    role: "AI research scientist",
    lens: "Are model facts and benchmark comparisons technically sound?",
    verdict: "Comparisons are governed correctly: results are only ranked against each other when the benchmark and its version match, and provider-reported numbers never share a ranking with independent ones. Coverage of benchmarks is thin, and that is stated rather than papered over.",
    findings: [
      { severity: "major", finding: "The Artificial Analysis index appeared under two version strings (v5 and v5.0), which split comparable results into two groups that the comparison view treated as not comparable.", resolution: "Version strings are normalised when the dataset is built; the six results now sit in one group.", status: "fixed" },
      { severity: "major", finding: "Some Gemini 4 Carbon and GPT-6 scores come from a rival's launch tables.", resolution: "They are recorded as provider-reported with a limitation naming who reported them, and are kept out of independent rankings.", status: "accepted-limitation" },
      { severity: "major", finding: "Flagship / mid / light labels for the Gemini 4 element names are not Google's.", resolution: "Stated in the research notes shown under Limitations; the labels are used only for grouping.", status: "accepted-limitation" },
      { severity: "minor", finding: "Several defined benchmarks (SWE-bench Verified, GPQA Diamond, ARC-AGI-2, output speed) have no recorded result, so the speed and multimodal comparison modes are empty.", resolution: "The views show an explicit empty state. Filling them needs licensed or directly fetched leaderboard data.", status: "open" },
      { severity: "minor", finding: "Context windows, output limits and model ids for Google models come from pages that could only be read through search extracts.", resolution: "Sources carry that access level; unconfirmed fields are listed on each model's dossier instead of being filled in.", status: "accepted-limitation" },
    ],
  },
  {
    role: "Google Cloud enterprise architect",
    lens: "Would a customer architect trust the product map, stages and names?",
    verdict: "The product map is accurate to Google Cloud's own pages as of the verification date, including the 2026 renames. Stage data is the weak point for the newest components, and the time machine is only as complete as the dated history behind it.",
    findings: [
      { severity: "blocker", finding: "Two products were shown as retired because a record about a preview id being shut down was typed as a retirement of the product.", resolution: "Such records are now stored as updates when the product itself is still listed as live; the stage shown matches the catalogue.", status: "fixed" },
      { severity: "major", finding: "In the time machine, models with only an 'announced' event were shown as still 'announced' years later.", resolution: "'Announced' is trusted only while nothing shows the product later shipped; otherwise the stage reads 'not recorded'.", status: "fixed" },
      { severity: "major", finding: "Many Google products had no introduction date and were therefore missing from the time machine.", resolution: "Dates are now derived from recorded launch events where they exist, and a separate sourced pass dated 73 more (8 to the month only). 21 Google entries remain undated; they stay out of as-of views, and the view counts them.", status: "fixed" },
      { severity: "major", finding: "Google's pages have used 'Gemini platform' and 'Gemini for business' since October 2026 without a formal rename.", resolution: "Canonical names are kept; the newer wording is recorded as aliases, so search finds either, and the drift is listed as a development.", status: "accepted-limitation" },
      { severity: "minor", finding: "The stage of Agent Compute Engine, the Managed Agents API and Smart Routing is unclear in Google's own material.", resolution: "Recorded at the most conservative stage the sources support; the enterprise view computes readiness from these stages and tells the reader to check each dossier.", status: "open" },
    ],
  },
  {
    role: "AI economics analyst",
    lens: "Are prices right, dated correctly and costed honestly?",
    verdict: "Google Cloud list prices were read from the official price list and re-checked by the monitoring job against the live page. Effective dates are handled correctly, including introductory prices with published end dates. Prices outside Google Cloud rest on weaker access and are labelled so.",
    findings: [
      { severity: "blocker", finding: "On its first live run the price watcher raised ten false price-change alerts: it read introductory and scheduled tables for the same model, and meters priced in other units.", resolution: "It now checks Google text models only, reads every table headed by the model's name and passes when any shows the expected price. The re-run matched every price it could find on the page and raised no alert.", status: "fixed" },
      { severity: "major", finding: "An older internal catalogue lists a Gemini 3.1 Pro rise to $2.50 / $15; Google's price list does not.", resolution: "The knowledge base records $2 / $12 from the price list read directly, and says so under Limitations.", status: "fixed" },
      { severity: "major", finding: "Overlapping price records for the same meter would make 'the price on a date' ambiguous.", resolution: "Building the dataset closes each record when a later one starts and drops exact duplicates; a test fails if any overlap remains.", status: "fixed" },
      { severity: "major", finding: "Where the price page gives no start date, a start date had to be assumed.", resolution: "The record's note states the assumption (release date or observation date).", status: "accepted-limitation" },
      { severity: "major", finding: "Gemini Enterprise seat prices and most competitor API prices could not be read from the vendor's own page.", resolution: "Competitor prices from trackers are labelled independent measurement, not verified fact; conflicting seat prices are flagged as indicative.", status: "accepted-limitation" },
      { severity: "minor", finding: "The calculator covers text tokens only; audio, image and video meters are recorded but not costed.", resolution: "Stated in the calculator and under Limitations; the voice workload says so explicitly.", status: "open" },
    ],
  },
  {
    role: "Competitive intelligence analyst",
    lens: "Is the competitive picture balanced and free of manufactured causation?",
    verdict: "Battleground assessments are labelled as interpretation, say where Google trails, and rest on cited positions. Rival coverage is deliberately shallower than Google's and is weakest for the Chinese labs.",
    findings: [
      { severity: "major", finding: "The same development appeared twice on the timeline when it existed both as a curated milestone and as a feed item with a different headline.", resolution: "Items within a day of each other, from the same company, that share most title words or name the same product are folded into one event.", status: "fixed" },
      { severity: "major", finding: "Placing Google and rival events side by side invites a causal reading.", resolution: "The comparison is presented as context only, with a standing caveat that closeness in time is not evidence of cause; no view infers a response.", status: "accepted-limitation" },
      { severity: "minor", finding: "Several rival facts (corporate changes at xAI, unreleased model status at DeepSeek and Alibaba) rest on secondary reporting.", resolution: "Marked with their access level and verification state.", status: "accepted-limitation" },
      { severity: "minor", finding: "Battlegrounds list positions for two to four rivals each, not the full field.", resolution: "The matrix shows a filled cell only where a sourced position exists and says an empty cell means 'not recorded', not 'absent'.", status: "open" },
    ],
  },
  {
    role: "Product and editorial quality",
    lens: "Is it usable, honest about freshness, and consistent?",
    verdict: "Every page was walked in a browser in light and dark mode at desktop and phone widths with no script errors and no sideways scrolling. Freshness is reported from what the pipeline actually did. The pages are long and data-heavy, and assistive-technology testing has not been done.",
    findings: [
      { severity: "blocker", finding: "Compare and Pricing scrolled sideways on phones: visually hidden text inside wide tables escaped its scroll container.", resolution: "Scroll containers now contain their hidden text; all pages measure zero overflow at 390px.", status: "fixed" },
      { severity: "major", finding: "One-word aliases such as 'Search' or 'Flow' made the pipeline and the analyst link unrelated text to products.", resolution: "Free-text matching now needs the product's name, a former name, a model id or a multi-word alias. Search still accepts short aliases typed by a person.", status: "fixed" },
      { severity: "major", finding: "The executive brief did not show which items were only partially verified.", resolution: "Brief and feed rows now carry the verification state when it is not 'verified'.", status: "fixed" },
      { severity: "minor", finding: "Radar labels were clipped, dates wrapped, and scheduled price changes listed one row per tier and region.", resolution: "Chart padding and column widths fixed; scheduled changes are grouped to one line per product and date.", status: "fixed" },
      { severity: "major", finding: "The whole dataset is sent to the browser (about 1.6 MB before compression).", resolution: "Acceptable at this size; beyond it the data should move behind an API with per-page queries.", status: "open" },
      { severity: "major", finding: "No screen-reader or keyboard-only test of the charts has been run.", resolution: "Charts have text alternatives and table views, but this has not been verified with assistive technology.", status: "open" },
    ],
  },
];

/** What this product does not do, or does not do yet. */
export const LIMITATIONS: { area: string; text: string }[] = [
  { area: "Source access", text: "The research environment could fetch pages on cloud.google.com and anthropic.com directly. Most other official sites (ai.google.dev, blog.google, deepmind.google, docs.cloud.google.com, Workspace Updates, OpenAI) were blocked there, so facts from them were read through search-engine extracts and are marked that way. The production pipeline is not subject to that block." },
  { area: "Curated, not automatic", text: "The verified knowledge base is a curated snapshot with a stated date. The monitoring pipeline detects and classifies new items and price differences, but an editor must verify them before they enter the knowledge base. Nothing is auto-published." },
  { area: "Pipeline schedule", text: "The monitoring job is scheduled once a day. A higher frequency needs a hosting plan that allows it. Run history is kept only when a Redis-compatible store is configured; without one the status panel says so." },
  { area: "Pipeline classification", text: "Detected items are classified by transparent keyword rules, not by a model. Rules miss nuance and can mislabel; that is why detected items are shown as unreviewed." },
  { area: "Price watch", text: "The automatic price check covers standard-tier, global input and output prices on Google Cloud's pricing page. Other meters, tiers, regions and other providers' pages are watched only for change, not parsed." },
  { area: "Prices", text: "Prices are public list prices. Negotiated, committed-use and reseller prices are not represented. Audio, image and video generation meters are recorded but are not part of the workload calculator, which models text tokens." },
  { area: "Start dates of prices", text: "Where a price page does not say when a price began, the record starts at the model's release date or at the date we observed it, and its note says which." },
  { area: "Benchmarks", text: "Only a small, cited set of benchmark results is included. Leaderboards are not copied in bulk, results change often, and provider-reported and independent results are kept apart. No licensed benchmark API is connected." },
  { area: "Calculator assumptions", text: "Retries per task and reasoning-token ratios are the user's assumptions. The calculator cannot tell you how many attempts a given model needs for your task; only a trial can." },
  { area: "Competitor depth", text: "Competitors are covered at the level needed for comparison (current models, list prices, headline positions), not with the depth given to Google." },
  { area: "Enterprise guidance", text: "Workload guidance and the opportunity matrix are this site's analysis. Stack readiness is computed from recorded product stages, which can lag an announcement." },
  { area: "Analyst", text: "The analyst assembles answers from knowledge-base records. Without a configured model key it does not paraphrase or reason across facts; with one, a model rewords the retrieved facts and its output is discarded if its citations do not resolve." },
  { area: "Personalisation and alerts", text: "There are no accounts, saved watchlists or outbound alerts (email, chat). Alerts appear on the pipeline status panel only. Saved pricing scenarios live in the browser." },
  { area: "Regions", text: "Choosing a sub-region filters news and case studies by tags the editors assigned and shows a short market brief. It does not change prices, and regional availability of products is recorded only where a source states it." },
  { area: "Languages", text: "The navigation is translated by hand. Everything else is machine-translated on demand and can be wrong, especially for technical terms; product and model names are left in English. The English text is authoritative, and sources are English-language." },
  { area: "Daily automatic notes", text: "Each day the monitoring job writes short notes on new official posts from the post's own title and excerpt. They are not reviewed, are shown as unreviewed beside a link to the source, and never enter the verified knowledge base. Verified content changes only when an editor updates the knowledge base." },
  { area: "Case studies", text: "Results in case studies are the customer's or the vendor's own figures and are labelled as claims. Coverage is uneven: some sub-regions and segments have few public examples, and examples on other platforms rest more often on press reports than on primary documents." },
  { area: "Quiz", text: "Quiz questions are written from knowledge-base records as of the date shown on each question. A fact can change after that date; the linked record is the current source of truth." },
];

/** Enterprise workload guidance. Analyst interpretation throughout; the stack references canonical entities. */
export const WORKLOADS: EnterpriseWorkload[] = [
  {
    id: "secure-voice-agent", name: "Secure voice agent for customer service", industries: ["Financial services", "Telecommunications", "Healthcare", "Public sector"], functions: ["Customer service"], architecture: "voice",
    need: "Answer and resolve customer calls by voice, in real time, with access to account systems — while proving who the agent acted for, keeping regulated data inside policy and handing over to a person when it should.",
    stack: [
      { entityId: "gemini-for-customer-experience", role: "The packaged contact-centre product: channels, routing, agent assist." },
      { entityId: "cx-agent-studio", role: "Where the conversational flows and voice agent are designed and tested." },
      { entityId: "gemini-live-api", role: "Low-latency, two-way audio with the model: the speech loop itself." },
      { entityId: "gemini-live", role: "The native-audio model family behind the voice." },
      { entityId: "agent-runtime", role: "Runs the agent logic and tool calls behind the conversation." },
      { entityId: "agent-identity", role: "Gives the agent its own identity so actions on accounts are attributable." },
      { entityId: "agent-gateway", role: "Policy checkpoint between the agent and the systems it can change." },
      { entityId: "model-armor", role: "Screens prompts and responses for injection and sensitive data." },
      { entityId: "agent-evaluation", role: "Tests the agent against scripted calls before and after each change." },
      { entityId: "agent-observability", role: "Traces every turn in production for audit and tuning." },
    ],
    customer: "The case is cost per resolved contact and queue time, not model quality. Regulated buyers will ask first where audio and transcripts are processed and stored, and whether an action taken by the agent can be traced to an identity and reversed.",
    sales: "Lead with one high-volume, low-risk call type (balance, order status, appointment change) and a containment target. Ask who owns the telephony contract: the contact-centre platform decision often decides the AI decision.",
    technical: "Latency is the design constraint: every tool call sits inside a spoken turn. Audio is metered separately from text tokens, so cost models built on text prices understate the bill. Decide early which actions need step-up authentication or a human.",
    commercial: "Expect a mix of per-seat or per-interaction contact-centre licensing plus model consumption. Check which components are still in preview before committing production dates — the stack list above shows the stage of each today.",
    competitive: "The alternatives are the incumbent contact-centre vendor's own AI, a cloud rival's voice stack, or a specialist voice-agent start-up on any model. Google's argument is one vendor for telephony AI, models and agent governance; the counter-argument is lock-in and the maturity of the newer governance pieces.",
    execution: "Success depends on integration with the systems of record and on a clean escalation path, far more than on the model. Budget for conversation design, evaluation sets built from real calls, and a staged rollout by call type.",
    risks: ["Audio pricing is not covered by the text-token calculator on this site.", "Several governance components are recent; verify their stage and regional availability in the dossiers.", "Voice cloning, consent and call-recording rules differ by jurisdiction and need legal review."],
    value: 5, scenarioId: "voice-agent", sourceIds: [],
  },
  {
    id: "employee-knowledge-assistant", name: "Employee assistant grounded in company knowledge", industries: ["Any industry"], functions: ["Knowledge work", "IT"], architecture: "rag",
    need: "Let employees ask questions across documents, tickets, mail and business systems and get cited answers that respect each person's access rights.",
    stack: [
      { entityId: "gemini-enterprise", role: "The employee-facing app: search, chat and a gallery of agents." },
      { entityId: "gemini-enterprise-connectors", role: "Bring in content from third-party and internal systems with their permissions." },
      { entityId: "agent-search", role: "Indexing and retrieval behind grounded answers." },
      { entityId: "knowledge-catalog", role: "Business context and metadata so answers use the right definitions." },
      { entityId: "gemini-notebook", role: "Source-grounded notebooks for deep work on a set of documents." },
      { entityId: "model-armor", role: "Screens prompts and responses." },
    ],
    customer: "Value shows up as time saved finding and summarising, so adoption — not capability — is the risk. Buyers will compare it with the assistant bundled in the productivity suite they already pay for.",
    sales: "Find the two or three systems where knowledge is trapped (ticketing, CRM, document stores) and demo on those. A pilot with a real connector beats any generic demo.",
    technical: "Permission fidelity of each connector is the make-or-break detail: confirm that document-level access is enforced at query time. Plan for content hygiene; stale documents produce confident wrong answers.",
    commercial: "Sold per user per month in editions; list prices and what each edition includes are on the product's dossier where a public price exists. Seat prices reported by resellers conflict, so treat them as indicative.",
    competitive: "Competes with the assistant inside Microsoft 365, with ChatGPT and Claude enterprise plans, and with specialist enterprise-search vendors. The honest comparison is connector coverage and permission handling for this customer's systems.",
    execution: "Start with one department and a named owner for content quality. Measure weekly active use and answer acceptance, not seats provisioned.",
    risks: ["Edition prices are not confirmed from a Google price page in this knowledge base.", "Connector depth varies by source system."],
    value: 4, scenarioId: "enterprise-search", sourceIds: [],
  },
  {
    id: "software-engineering-agents", name: "Coding agents for software teams", industries: ["Technology", "Financial services", "Any industry"], functions: ["Engineering"], architecture: "single-agent",
    need: "Give engineers agents that read a codebase, plan, edit, run tests and open changes — with the organisation's code kept private and spend kept predictable.",
    stack: [
      { entityId: "google-antigravity", role: "The agent-first development environment." },
      { entityId: "gemini-4-argon", role: "Frontier model for long multi-step engineering tasks." },
      { entityId: "gemini-code-assist", role: "Assistance inside existing IDEs and code review." },
      { entityId: "codemender", role: "Agent that finds and fixes security flaws." },
      { entityId: "agent-sandbox", role: "Isolated execution for generated code." },
      { entityId: "ai-spend-caps", role: "Limits on consumption per project or team." },
    ],
    customer: "Engineering leaders buy on throughput and code quality, and increasingly on cost per merged change. They will already have at least one coding assistant in use.",
    sales: "This is a bake-off market: offer a time-boxed trial on the customer's own repository with their own acceptance tests. Bring cost per completed task, not price per token.",
    technical: "Agent loops multiply model calls: a task can take tens of calls with heavy reasoning, so caching and model choice per step dominate cost. Check context limits, tool support and where code is processed.",
    commercial: "Consumption-priced; the calculator's coding-agent example shows why two models with similar token prices can differ several-fold per finished task. Introductory prices with published end dates apply to some models — see Pricing.",
    competitive: "The strongest competitors are Claude Code, Codex and Cursor. Independent coding benchmarks are listed under Compare; where Google trails on a benchmark, that is shown, not hidden.",
    execution: "Standardise on evaluation: a private task set drawn from real tickets, rerun on every model change. Tooling churn is high — some earlier Google developer tools have been deprecated in favour of newer ones.",
    risks: ["Developer tools in this area have been renamed or retired within a year; check each dossier's history.", "Cost per task depends on assumptions about attempts and reasoning tokens that only a trial can settle."],
    value: 5, scenarioId: "coding-agent", sourceIds: [],
  },
  {
    id: "agentic-commerce", name: "Agent-ready commerce", industries: ["Retail", "Consumer goods", "Travel"], functions: ["Commerce", "Marketing"], architecture: "multi-agent",
    need: "Make catalogue, cart, checkout and loyalty usable by AI agents — the retailer's own and other companies' — without giving up the customer relationship or payment control.",
    stack: [
      { entityId: "universal-commerce-protocol", role: "Open protocol for agents to discover products and transact with a merchant." },
      { entityId: "ap2-protocol", role: "Payment mandates: proof of what the user authorised the agent to buy." },
      { entityId: "ai-commerce-search", role: "Product search and discovery tuned for retail." },
      { entityId: "apigee", role: "Exposes existing commerce APIs to agents, with quotas and policy." },
      { entityId: "agent-gateway", role: "Checks each agent's request against policy before it reaches commerce systems." },
      { entityId: "agent-identity", role: "Tells the merchant which agent is calling." },
      { entityId: "a2a-protocol", role: "Lets a shopping agent delegate to the merchant's agent." },
      { entityId: "agent-runtime", role: "Runs the merchant's own shopping and service agents." },
    ],
    customer: "The strategic question is who owns the shopper when an assistant does the shopping. Merchants want to be present in AI surfaces without becoming a commodity back end.",
    sales: "Open with the merchant-of-record and data questions, not the technology. Position the protocols as a way to stay in control of pricing, loyalty and checkout.",
    technical: "Most of the work is making existing APIs safe for agents: authentication, rate limits, idempotent orders, fraud signals. Protocol support is new and evolving; pin versions.",
    commercial: "Protocols are open and free to implement; the spend is on platform, search and consumption. Assistant-referred traffic and fees are still being defined across the industry.",
    competitive: "OpenAI and its partners promote a competing checkout protocol; large retailers are building their own gateways. Expect to support more than one protocol.",
    execution: "Pilot with a narrow category and a spending cap per mandate. Measure agent-originated conversion and return rates separately.",
    risks: ["Standards are young and competing; today's choice may need revisiting.", "Liability for agent-initiated purchases is not settled in most markets."],
    value: 4, sourceIds: [],
  },
  {
    id: "document-processing", name: "High-volume document processing", industries: ["Financial services", "Insurance", "Public sector", "Healthcare"], functions: ["Operations"], architecture: "batch-pipeline",
    need: "Turn large volumes of forms, contracts and correspondence into structured data overnight at the lowest reliable cost.",
    stack: [
      { entityId: "gemini-flash", role: "Fast, lower-priced multimodal models suited to extraction." },
      { entityId: "agent-platform-paygo-tiers", role: "Batch and flex tiers trade latency for a lower price." },
      { entityId: "gen-ai-evaluation-service", role: "Measures extraction accuracy against labelled samples." },
      { entityId: "gemini-in-bigquery", role: "Runs models over data where it already lives." },
      { entityId: "model-armor", role: "Detects sensitive data in inputs and outputs." },
    ],
    customer: "A cost-and-accuracy decision. The buyer wants unit cost per document and an error rate they can defend to audit.",
    sales: "Ask for a sample set and price it three ways in the calculator: standard, batch, and with caching of the shared instructions.",
    technical: "Batch pricing and caching change the economics more than model choice within a tier. Long documents can cross a long-context price threshold on some models.",
    commercial: "Straight consumption. Watch scheduled price changes: some current prices are introductory and end on a published date.",
    competitive: "Every provider's small model competes here, as do open-weight models run on the customer's own capacity. Price moves quickly; re-quote before signing.",
    execution: "Keep a labelled regression set and a human-review queue for low-confidence extractions.",
    risks: ["Introductory prices expire; budget on the scheduled price.", "Accuracy on handwriting and poor scans must be measured, not assumed."],
    value: 3, scenarioId: "document-pipeline", sourceIds: [],
  },
  {
    id: "governed-multi-agent", name: "Governed multi-agent operations", industries: ["Any industry"], functions: ["Operations", "IT"], architecture: "multi-agent",
    need: "Run many agents built by different teams and vendors across business processes, with a single way to register, authorise, observe and stop them.",
    stack: [
      { entityId: "agent-development-kit", role: "Open-source framework teams build agents with." },
      { entityId: "agent-runtime", role: "Managed execution for those agents." },
      { entityId: "a2a-protocol", role: "How agents from different teams and vendors talk to each other." },
      { entityId: "google-managed-mcp-servers", role: "Standard tool access to Google Cloud services." },
      { entityId: "agent-registry", role: "Inventory of approved agents and tools." },
      { entityId: "agent-identity", role: "A distinct identity per agent." },
      { entityId: "agent-gateway", role: "Central policy enforcement for agent traffic." },
      { entityId: "agent-observability", role: "Tracing and monitoring across agents." },
      { entityId: "agent-evaluation", role: "Release gates for agent quality." },
    ],
    customer: "The CIO's worry is sprawl: agents nobody inventoried acting on systems nobody approved. The buying trigger is usually an audit question.",
    sales: "Sell the control plane, not the agents. Start from the customer's existing identity and API-management estate and show where agents plug in.",
    technical: "Decide what is the system of record for agent inventory and policy. Interoperability claims rest on open protocols; test them with a non-Google agent.",
    commercial: "Platform consumption plus governance components, some of which are recent. Stage and regional availability vary — the list above reflects today.",
    competitive: "Microsoft and AWS offer their own agent control planes tied to their identity systems; customers with a strong incumbent identity provider will lean that way.",
    execution: "Introduce registration and identity before scaling the number of agents. Retro-fitting governance is far harder.",
    risks: ["Parts of this control plane are in preview; see each dossier.", "Cross-vendor interoperability is promised by protocol, and thinly proven in production."],
    value: 4, sourceIds: [],
  },
  {
    id: "sovereign-regulated", name: "AI under sovereignty or air-gap constraints", industries: ["Public sector", "Financial services", "Defence"], functions: ["IT"], architecture: "assistant",
    need: "Use frontier models where data residency, operator nationality or disconnection from the public internet are hard requirements.",
    stack: [
      { entityId: "google-distributed-cloud", role: "Google Cloud software and models run on premises, including disconnected." },
      { entityId: "google-sovereign-cloud", role: "Regional offerings operated with local control and partners." },
      { entityId: "gemini", role: "The model family made available in these environments." },
      { entityId: "gemini-for-government-services", role: "Packaged offering for public-sector use." },
      { entityId: "model-armor", role: "Content and data screening." },
    ],
    customer: "Compliance decides before capability does. The buyer needs to know which model versions are available in the constrained environment and how far they lag the public cloud.",
    sales: "Qualify the constraint precisely (residency, sovereignty, air gap) — each maps to a different offering and partner.",
    technical: "Feature and model parity with public regions is not guaranteed; confirm per model. Capacity is planned, not elastic.",
    commercial: "Longer sales cycles, committed capacity, often through a local partner.",
    competitive: "Rivals offer sovereign regions and on-premises options of their own; open-weight models on local hardware are the fallback every buyer considers.",
    execution: "Agree an update cadence for models and a path for security patches before go-live.",
    risks: ["Model availability in constrained environments trails public cloud.", "Sovereignty terms depend on the partner and country."],
    value: 3, sourceIds: [],
  },
  {
    id: "data-analytics-agent", name: "Conversational analytics on governed data", industries: ["Any industry"], functions: ["Data and analytics", "Finance"], architecture: "single-agent",
    need: "Let business users ask questions of governed data in plain language and get answers that use the company's agreed metrics.",
    stack: [
      { entityId: "gemini-in-bigquery", role: "Model assistance and agents inside the data warehouse." },
      { entityId: "gemini-in-looker", role: "Conversational analytics on the governed semantic layer." },
      { entityId: "knowledge-catalog", role: "Shared business definitions and lineage." },
      { entityId: "gemini-enterprise", role: "Where employees reach the data agent alongside other agents." },
    ],
    customer: "Trust in the number is everything. A plausible wrong figure ends the project.",
    sales: "Demo on the customer's own metric definitions. Involve the data-governance owner from the first meeting.",
    technical: "Accuracy comes from the semantic layer, not the model. Constrain the agent to governed measures and log every generated query.",
    commercial: "Usually part of existing data-platform spend plus consumption.",
    competitive: "Every data platform now ships a conversational layer; the incumbent warehouse has the advantage.",
    execution: "Start with one subject area and a set of verified questions used as a regression test.",
    risks: ["Without a maintained semantic layer the agent will produce inconsistent figures."],
    value: 3, sourceIds: [],
  },
];
