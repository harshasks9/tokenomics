/**
 * Visualization E — "Who controls the customer?"
 * A structural map, not a measurement: for each commerce architecture, which
 * participant controls each control point, and how attention, decisions,
 * money and data move. Assignments are this report's expert judgment.
 */

export type NodeId = "consumer" | "brand" | "retailer" | "marketplace" | "assistant" | "agent" | "payments" | "logistics";
export type ControlPoint = "discovery" | "context" | "checkout" | "payment" | "fulfillment" | "loyalty";
export type FlowKind = "attention" | "decision" | "money" | "data";

export const NODES: Record<NodeId, { label: string; x: number; y: number }> = {
  consumer: { label: "Consumer", x: 60, y: 160 },
  agent: { label: "Consumer agent", x: 220, y: 60 },
  assistant: { label: "AI assistant platform", x: 400, y: 60 },
  marketplace: { label: "Search / marketplace", x: 400, y: 260 },
  retailer: { label: "Retailer (merchant of record)", x: 580, y: 160 },
  brand: { label: "Brand / manufacturer", x: 760, y: 160 },
  payments: { label: "Payments & identity", x: 220, y: 260 },
  logistics: { label: "Fulfillment", x: 760, y: 290 },
};

export const CONTROL_LABEL: Record<ControlPoint, { label: string; q: string }> = {
  discovery: { label: "Discovery", q: "Who decides which products are considered?" },
  context: { label: "Consumer context", q: "Who holds intent, preferences and purchase history?" },
  checkout: { label: "Checkout", q: "Whose interface completes the transaction?" },
  payment: { label: "Payment & authorization", q: "Who holds the credential and the authorization rules?" },
  fulfillment: { label: "Fulfillment", q: "Who delivers, and owns returns?" },
  loyalty: { label: "Loyalty", q: "Where does the repeat habit live?" },
};

export interface Architecture {
  id: string;
  label: string;
  era: "physical" | "ecommerce" | "agentic";
  blurb: string;
  active: NodeId[];
  control: Record<ControlPoint, { node: NodeId; note: string }>;
  flows: { from: NodeId; to: NodeId; kind: FlowKind }[];
  question: string;
}

export const ARCHITECTURES: Architecture[] = [
  {
    id: "physical", label: "Physical store", era: "physical",
    blurb: "The consumer travels to the store; the retailer owns the shelf, the till and the relationship.",
    active: ["consumer", "retailer", "brand", "payments", "logistics"],
    control: {
      discovery: { node: "retailer", note: "Shelf space, layout and promotions" },
      context: { node: "retailer", note: "Loyalty cards, if any; mostly anonymous" },
      checkout: { node: "retailer", note: "The till" },
      payment: { node: "payments", note: "Card networks clear; retailer is merchant of record" },
      fulfillment: { node: "consumer", note: "The consumer carries it home" },
      loyalty: { node: "retailer", note: "Location and habit" },
    },
    flows: [
      { from: "consumer", to: "retailer", kind: "attention" }, { from: "consumer", to: "retailer", kind: "decision" },
      { from: "consumer", to: "payments", kind: "money" }, { from: "payments", to: "retailer", kind: "money" }, { from: "retailer", to: "brand", kind: "money" },
      { from: "brand", to: "logistics", kind: "money" },
    ],
    question: "Retail advantage = location, assortment and supplier terms.",
  },
  {
    id: "ecommerce", label: "E-commerce & marketplaces", era: "ecommerce",
    blurb: "Search engines and marketplaces aggregate attention; the consumer still decides and checks out.",
    active: ["consumer", "marketplace", "retailer", "brand", "payments", "logistics"],
    control: {
      discovery: { node: "marketplace", note: "Search ranking and sponsored placement" },
      context: { node: "marketplace", note: "Marketplace accounts and clickstream" },
      checkout: { node: "retailer", note: "Retailer site, or the marketplace's checkout" },
      payment: { node: "payments", note: "Stored cards, wallets (PayPal, Shop Pay, Alipay)" },
      fulfillment: { node: "logistics", note: "Retailer or marketplace logistics (FBA etc.)" },
      loyalty: { node: "marketplace", note: "Subscriptions (Prime), app habit" },
    },
    flows: [
      { from: "consumer", to: "marketplace", kind: "attention" }, { from: "marketplace", to: "retailer", kind: "attention" },
      { from: "consumer", to: "retailer", kind: "decision" }, { from: "consumer", to: "payments", kind: "money" },
      { from: "payments", to: "retailer", kind: "money" }, { from: "retailer", to: "marketplace", kind: "money" }, { from: "retailer", to: "brand", kind: "money" },
      { from: "consumer", to: "marketplace", kind: "data" }, { from: "retailer", to: "logistics", kind: "money" },
    ],
    question: "The battle was to become the destination.",
  },
  {
    id: "agentic-a", label: "A · AI discovery, retailer checkout", era: "agentic",
    blurb: "An assistant shapes the shortlist; the consumer clicks through and buys on the retailer's site.",
    active: ["consumer", "assistant", "retailer", "brand", "payments", "logistics"],
    control: {
      discovery: { node: "assistant", note: "The answer replaces the results page" },
      context: { node: "assistant", note: "Conversation history and memory" },
      checkout: { node: "retailer", note: "Retailer site keeps the transaction" },
      payment: { node: "payments", note: "Unchanged from e-commerce" },
      fulfillment: { node: "retailer", note: "Unchanged" },
      loyalty: { node: "retailer", note: "Retailer still sees the customer, but arrives later in the journey" },
    },
    flows: [
      { from: "consumer", to: "assistant", kind: "attention" }, { from: "assistant", to: "retailer", kind: "attention" },
      { from: "consumer", to: "retailer", kind: "decision" }, { from: "consumer", to: "payments", kind: "money" },
      { from: "payments", to: "retailer", kind: "money" }, { from: "consumer", to: "assistant", kind: "data" }, { from: "retailer", to: "brand", kind: "money" },
    ],
    question: "Closest to 2026 reality: influence moves, transactions mostly don't.",
  },
  {
    id: "agentic-b", label: "B · Checkout inside the assistant", era: "agentic",
    blurb: "The merchant stays merchant of record, but the purchase happens inside the AI interface via a protocol.",
    active: ["consumer", "assistant", "retailer", "brand", "payments", "logistics"],
    control: {
      discovery: { node: "assistant", note: "Assistant ranks and presents" },
      context: { node: "assistant", note: "Assistant sees intent; merchant receives order data" },
      checkout: { node: "assistant", note: "Embedded checkout (protocol-mediated)" },
      payment: { node: "payments", note: "Tokenized, scoped credential passed to the merchant" },
      fulfillment: { node: "retailer", note: "Merchant fulfils and owns returns" },
      loyalty: { node: "assistant", note: "The habit forms in the assistant, not the store" },
    },
    flows: [
      { from: "consumer", to: "assistant", kind: "attention" }, { from: "consumer", to: "assistant", kind: "decision" },
      { from: "assistant", to: "retailer", kind: "data" }, { from: "consumer", to: "payments", kind: "money" },
      { from: "payments", to: "retailer", kind: "money" }, { from: "retailer", to: "assistant", kind: "money" }, { from: "retailer", to: "brand", kind: "money" },
    ],
    question: "Who owns the customer when the store's front door is someone else's chat window?",
  },
  {
    id: "agentic-c", label: "C · Third-party agent, delegated authority", era: "agentic",
    blurb: "A consumer-selected agent shops across merchants with a delegated, bounded mandate.",
    active: ["consumer", "agent", "assistant", "retailer", "brand", "payments", "logistics"],
    control: {
      discovery: { node: "agent", note: "The agent's ranking objective decides" },
      context: { node: "agent", note: "Mandate, preferences, household data" },
      checkout: { node: "agent", note: "Agent executes; merchant may never see the consumer's session" },
      payment: { node: "payments", note: "Mandate-bound credential; network tokens and audit trail" },
      fulfillment: { node: "retailer", note: "Merchant fulfils; disputes route through the agent" },
      loyalty: { node: "agent", note: "Loyalty to the agent; merchants become interchangeable suppliers" },
    },
    flows: [
      { from: "consumer", to: "agent", kind: "decision" }, { from: "agent", to: "retailer", kind: "decision" },
      { from: "consumer", to: "agent", kind: "data" }, { from: "agent", to: "payments", kind: "money" },
      { from: "payments", to: "retailer", kind: "money" }, { from: "retailer", to: "brand", kind: "money" }, { from: "assistant", to: "agent", kind: "data" },
    ],
    question: "The delegation layer becomes the control point, if consumers grant it authority.",
  },
  {
    id: "agentic-d", label: "D · Retailer-owned agent", era: "agentic",
    blurb: "The retailer's own assistant shops for the customer inside its ecosystem.",
    active: ["consumer", "retailer", "brand", "payments", "logistics"],
    control: {
      discovery: { node: "retailer", note: "Retailer's agent ranks its own assortment" },
      context: { node: "retailer", note: "Retailer keeps first-party data" },
      checkout: { node: "retailer", note: "Native" },
      payment: { node: "payments", note: "Stored credentials on file" },
      fulfillment: { node: "retailer", note: "Own network" },
      loyalty: { node: "retailer", note: "Membership + agent convenience" },
    },
    flows: [
      { from: "consumer", to: "retailer", kind: "attention" }, { from: "consumer", to: "retailer", kind: "decision" },
      { from: "consumer", to: "payments", kind: "money" }, { from: "payments", to: "retailer", kind: "money" },
      { from: "consumer", to: "retailer", kind: "data" }, { from: "retailer", to: "brand", kind: "money" }, { from: "retailer", to: "logistics", kind: "money" },
    ],
    question: "Works for retailers with broad assortment and frequent visits; less so for specialists.",
  },
  {
    id: "agentic-e", label: "E · Persistent agent, recurring purchases", era: "agentic",
    blurb: "A standing mandate: the agent initiates purchases without a shopping session.",
    active: ["consumer", "agent", "retailer", "brand", "payments", "logistics"],
    control: {
      discovery: { node: "agent", note: "Default brand and merchant set once, revisited rarely" },
      context: { node: "agent", note: "Consumption signals, budgets, calendars" },
      checkout: { node: "agent", note: "No session; the agent initiates" },
      payment: { node: "payments", note: "Recurring mandate with spending caps" },
      fulfillment: { node: "logistics", note: "Predictable, schedulable demand" },
      loyalty: { node: "agent", note: "Inertia lives in the agent's defaults" },
    },
    flows: [
      { from: "consumer", to: "agent", kind: "data" }, { from: "agent", to: "retailer", kind: "decision" },
      { from: "agent", to: "payments", kind: "money" }, { from: "payments", to: "retailer", kind: "money" },
      { from: "retailer", to: "logistics", kind: "money" }, { from: "retailer", to: "brand", kind: "money" },
    ],
    question: "What happens to merchandising when purchases no longer begin with a session?",
  },
];
