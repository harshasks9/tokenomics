/**
 * Breakout reference section: Walmart's Agent Gateway (announced 21 Oct 2026)
 * and how the same pattern maps onto Google's stack.
 *
 * Two things this section must keep straight:
 *  - Walmart has not disclosed what the gateway or Sparky run on, and its
 *    infrastructure is multi-cloud. The Google mapping is OUR illustration of
 *    how an equivalent would be assembled, not a description of Walmart's build.
 *  - Google component status (GA / preview) moves quickly and sources differ;
 *    confirm against release notes before quoting.
 * Compiled 13 November 2026 from search excerpts; ids resolve in sources.json.
 */
import type { Slide } from "./breakout-types";

export const GATEWAY_AS_OF = "13 November 2026";

export interface GatewayPiece { name: string; what: string; status: string; sourceIds: string[] }

/** What Walmart announced on 21 October 2026. */
export const WALMART_PIECES: GatewayPiece[] = [
  {
    name: "Agent Gateway",
    what: "An MCP server that lets approved third-party agents call Walmart's shopping systems directly, through Sparky, instead of navigating web pages built for people.",
    status: "Early beta; companies and developers request access. Participants and any fees are not disclosed.",
    sourceIds: ["a-techcrunch-walmart-gateway", "w-dc360-gateway", "w-retaildive-gateway"],
  },
  {
    name: "Agent Profiles",
    what: "Each agent gets its own profile inside the shopper's Walmart account: approval for every purchase by default, optional spending limits, a separate order history, and access the shopper can revoke at any time.",
    status: "Announced for about a month after launch. We found no confirmation that it is live.",
    sourceIds: ["w-dc360-gateway", "a-chainstore-walmart-gateway", "w-consumergoods-gateway"],
  },
  {
    name: "Terms for AI Agents",
    what: "Rules every agent must accept: don't act beyond what the shopper intends, use only the data a task needs, never receive card details. Walmart can demand extra approvals and block agents that break the rules.",
    status: "Published with the announcement.",
    sourceIds: ["a-mediapost-walmart-agents", "w-dc360-gateway", "w-mmr-gateway"],
  },
];

export const WALMART_CONTEXT: { text: string; sourceIds: string[] }[] = [
  { text: "It follows Walmart's March 2026 retreat from checkout inside ChatGPT, where in-chat purchases converted at about a third of the rate of click-outs (one executive's account).", sourceIds: ["a-wired-walmart-mirror"] },
  { text: "The gateway can help an agent find a shopper's usual items without handing the agent the shopper's wider purchase history.", sourceIds: ["w-consumergoods-gateway", "w-dc360-gateway"] },
  { text: "OnePay, Walmart's fintech arm, has joined Google's Agent Payments Protocol (AP2) as a credential provider, covering spending limits and merchant parameters for agents.", sourceIds: ["w-onepay-ap2", "w-emarketer-onepay"] },
  { text: "Walmart has not said which cloud or model the gateway or Sparky run on; its internal platform is described as multi-cloud.", sourceIds: ["w-eweek-sparky"] },
];

export interface GoogleComponent { name: string; role: string; status?: string }
export interface GatewayCapability {
  id: string;
  capability: string;
  walmart: string;
  short: string; // slide-length version of `walmart`
  google: GoogleComponent[];
  note?: string;
  sourceIds: string[];
}

/** Capability → Walmart's design choice → the Google components that would provide it. */
export const GATEWAY_MAP: GatewayCapability[] = [
  {
    id: "front-door", capability: "A front door for agents",
    short: "MCP server; access by request",
    walmart: "MCP server, so agents call tools (search, cart, checkout) rather than scrape pages.",
    google: [
      { name: "Apigee MCP", role: "Exposes existing managed APIs as MCP tools without code changes, with OAuth, quotas and rate limits", status: "Launched Dec 2025" },
      { name: "API hub", role: "Catalogs the tools and syncs them to Agent Registry" },
      { name: "UCP", role: "Open protocol alternative for cart and checkout", status: "Selected markets" },
    ],
    note: "Cloud API Gateway also offers MCP support, in public preview as of September 2026.",
    sourceIds: ["w-apigee-mcp-docs", "w-apigee-mcp-blog", "w-apigee-registry-docs", "w-apigw-mcp-blog"],
  },
  {
    id: "identity", capability: "Knowing which agent is calling",
    short: "Approved agents only",
    walmart: "Only approved agents get in; agents that break the terms are blocked.",
    google: [
      { name: "Agent Identity", role: "A unique, managed identity for each agent, for access control and audit" },
      { name: "Agent Registry", role: "Central catalog of agents, tools and MCP servers", status: "GA June 2026" },
      { name: "Apigee", role: "Partner credentials and keys for external agents at the edge" },
    ],
    note: "Agent Identity is built for agents an organization runs itself; outside agents would be onboarded as API partners at the edge. That split is our reading of the docs.",
    sourceIds: ["w-gcp-govern-docs", "s-gcp-agent-platform-relnotes", "w-apigee-mcp-docs"],
  },
  {
    id: "merchant-agent", capability: "A merchant agent in the middle",
    short: "Agents connect through Sparky",
    walmart: "Outside agents connect through Sparky, which can find a shopper's usual items without sharing their wider history.",
    google: [
      { name: "Agent Runtime", role: "Managed runtime for the merchant's own agent" },
      { name: "Gemini models", role: "Reasoning, grounded on catalog and order data" },
      { name: "Memory Bank & Sessions", role: "Long-term shopper context that stays with the merchant" },
    ],
    sourceIds: ["w-gcp-platform-docs", "s-gcp-agent-platform-blog"],
  },
  {
    id: "limits", capability: "Limits and approvals",
    short: "Agent Profiles: approval and caps",
    walmart: "Agent Profiles: approval by default, optional spending limits, separate order history, revocable access.",
    google: [
      { name: "AP2 mandates", role: "Signed record of what the shopper authorized; v0.2 covers purchases without the human present", status: "With FIDO Alliance" },
      { name: "Agent Gateway", role: "Allows or denies each tool call by agent, tool name and read vs write" },
      { name: "Semantic governance", role: "Natural-language rules on tool use, such as never exceeding a stated budget", status: "Preview" },
    ],
    note: "The profile itself (limits, order history) lives in the merchant's own account system.",
    sourceIds: ["s-fido-ap2", "w-gcp-agent-gateway-docs", "w-devto-tour"],
  },
  {
    id: "safety", capability: "Rules, safety and proof",
    short: "Terms for AI Agents",
    walmart: "Terms for AI Agents: stay within shopper intent, minimum data, no card details; extra approvals on demand.",
    google: [
      { name: "Model Armor", role: "Screens for prompt injection, tool poisoning and sensitive-data leakage" },
      { name: "Agent evaluation", role: "Test sets and simulation before an agent touches real orders" },
      { name: "Audit logs", role: "Every call tied to an agent identity" },
    ],
    sourceIds: ["w-gcp-govern-docs", "w-devto-tour"],
  },
];

/** The request path for one agent-placed order, with the component that would do each job. */
export const GATEWAY_FLOW: { step: string; who: string; component: string }[] = [
  { step: "An outside agent calls a shopping tool", who: "ChatGPT, Gemini or another approved agent", component: "MCP" },
  { step: "The edge checks the partner and applies quotas", who: "Merchant's front door", component: "Apigee MCP" },
  { step: "Policy decides whether this agent may use this tool", who: "Governance layer", component: "Agent Gateway + Model Armor" },
  { step: "The merchant's own agent does the work", who: "Sparky-style agent with shopper context", component: "Agent Runtime + Gemini" },
  { step: "The order is checked against the shopper's limits", who: "Profile and mandate check; approval prompt if needed", component: "AP2 mandate" },
  { step: "Checkout runs on the merchant's systems", who: "Merchant of record; order tagged to the agent", component: "Order & payment systems" },
];

export const GATEWAY_TAKEAWAYS: { head: string; text: string }[] = [
  { head: "The merchant's agent mediates", text: "Outside agents get answers and actions, not the customer's data. The relationship stays with the merchant." },
  { head: "Limits live in the customer's account", text: "Caps, approvals and revocation sit with the shopper and the merchant, not inside someone else's agent." },
  { head: "Rules are written down and enforced", text: "Published terms plus technical blocking: the contract and the control point are the same place." },
  { head: "Protocol over scraping", text: "Calling tools is more reliable than driving web pages, and every call can be attributed and audited." },
];

export const GATEWAY_CAVEATS: string[] = [
  "Walmart has not disclosed the technology behind the Agent Gateway or Sparky. The Google mapping shows how an equivalent would be assembled; it is not a description of Walmart's build.",
  "We found no coverage dated November 2026. Whether Agent Profiles has launched, who is in the beta and what it costs are not confirmed.",
  "Spending-limit examples ($50, $100, $200) appear in some coverage only.",
  "Google component status changes quickly and sources differ on dates. Confirm GA or preview status against release notes before quoting it.",
  "All sources here were read through search excerpts, not opened in full.",
];

/** Backup slide for present mode (0 minutes: outside the 20-minute plan). */
export const GATEWAY_SLIDE: Slide = {
  id: "gateway", minute: "Backup", minutes: 0, title: "Backup: the agent gateway pattern",
  headline: "The agent gateway pattern: a front door for agents, on the merchant's rules.",
  body: {
    type: "planes",
    planes: GATEWAY_MAP.map((c) => ({ name: c.capability, job: `Walmart: ${c.short}`, items: c.google.map((g) => g.name) })),
  },
  notes: [
    "Use if someone asks what 'agent-ready on your own terms' looks like in practice. Walmart announced this on 21 October 2026: an MCP-based gateway in early beta, Agent Profiles with approval by default and optional spending limits, and published Terms for AI Agents.",
    "Be precise: Walmart has not said what it built this on, and it runs multi-cloud. The right-hand side is how you would assemble the same pattern on Google's stack, not a claim about Walmart.",
    "The design choices worth noting: the merchant's own agent sits in the middle, limits live in the customer's account, and the rules are both published and technically enforced.",
    "We could not confirm whether Agent Profiles has launched yet, or who is in the beta.",
  ],
  sourceIds: ["a-techcrunch-walmart-gateway", "w-dc360-gateway", "w-gcp-govern-docs", "w-apigee-mcp-docs"],
};
