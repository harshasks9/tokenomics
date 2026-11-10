/**
 * Visualization A — the same shopping task across three eras.
 * These are ILLUSTRATIVE journey diagrams built from the task's logic, not
 * measured time-and-motion data. Step and decision counts are counts of the
 * diagram, shown so readers can see where the work moves, not how long it takes.
 */
import type { Era } from "./types";

export type Actor = "consumer" | "retailer" | "platform" | "agent" | "merchant-agent";

export interface Step { actor: Actor; text: string; decision?: boolean; approval?: boolean }

export interface Journey { id: string; task: string; brief: string; eras: Record<Era, { summary: string; control: string; steps: Step[] }> }

export const ACTOR_LABEL: Record<Actor, string> = {
  consumer: "Consumer", retailer: "Retailer / store", platform: "Search / marketplace", agent: "Consumer's agent", "merchant-agent": "Merchant system / agent",
};

export const JOURNEYS: Journey[] = [
  {
    id: "laptop",
    task: "Buy a new laptop",
    brief: "A considered, mid-ticket, highly comparable purchase.",
    eras: {
      physical: {
        summary: "The consumer does the searching by travelling; the retailer controls what is on the shelf.",
        control: "Retailer controls the consideration set (the shelf and the salesperson).",
        steps: [
          { actor: "consumer", text: "Decide a laptop is needed and set a rough budget", decision: true },
          { actor: "consumer", text: "Choose which stores to visit (geography limits the options)", decision: true },
          { actor: "retailer", text: "Store presents its stocked assortment and promotions" },
          { actor: "retailer", text: "Salesperson recommends models (often with margin incentives)" },
          { actor: "consumer", text: "Compare a handful of floor models by hand", decision: true },
          { actor: "consumer", text: "Visit a second store to check price", decision: true },
          { actor: "consumer", text: "Choose model and retailer; pay at the till", decision: true, approval: true },
          { actor: "consumer", text: "Carry it home" },
        ],
      },
      ecommerce: {
        summary: "The store comes to the consumer, but the consumer still does the research, comparison and checkout.",
        control: "Search engines and marketplaces control discovery; the consumer still decides.",
        steps: [
          { actor: "consumer", text: "Search a query (\"best laptop for video editing\")", decision: true },
          { actor: "platform", text: "Search engine / marketplace ranks results; sponsored listings sit on top" },
          { actor: "consumer", text: "Read reviews, spec sheets and comparison articles across tabs", decision: true },
          { actor: "consumer", text: "Shortlist 3 models and check prices across retailers", decision: true },
          { actor: "consumer", text: "Pick a retailer on price, delivery date and trust", decision: true },
          { actor: "consumer", text: "Create account / sign in, enter address and card", approval: true },
          { actor: "retailer", text: "Retailer fulfils, sends tracking, handles returns" },
        ],
      },
      agentic: {
        summary: "The consumer states intent and constraints; an agent researches, compares and prepares, and may execute under authorization.",
        control: "The agent (and whoever sets its ranking objective) controls the consideration set; the consumer controls the mandate.",
        steps: [
          { actor: "consumer", text: "State the job: \"Laptop for 4K video editing, under $1,800, arrives by Friday, no Chrome OS\"", decision: true },
          { actor: "agent", text: "Agent queries catalogs, reviews and merchant APIs; filters by verified specs and stock" },
          { actor: "merchant-agent", text: "Merchant systems return price, availability, delivery promise and return terms in machine-readable form" },
          { actor: "agent", text: "Agent ranks options against the consumer's stated and learned preferences" },
          { actor: "consumer", text: "Review 2–3 recommendations with reasons and trade-offs", decision: true },
          { actor: "consumer", text: "Approve the purchase (or grant a bounded mandate in advance)", approval: true },
          { actor: "agent", text: "Agent executes checkout with a delegated payment credential, tracks delivery and files the return if needed" },
        ],
      },
    },
  },
  {
    id: "groceries",
    task: "Weekly grocery shop",
    brief: "High-frequency, low-ticket, substitution-heavy and habit-driven.",
    eras: {
      physical: {
        summary: "A weekly trip; the store's layout and promotions shape the basket.",
        control: "Retailer controls aisle placement, endcaps and promotions.",
        steps: [
          { actor: "consumer", text: "Check the fridge and write a list", decision: true },
          { actor: "consumer", text: "Travel to the nearest supermarket" },
          { actor: "retailer", text: "Store layout, endcaps and offers steer impulse purchases" },
          { actor: "consumer", text: "Pick ~40 items, judging freshness by hand", decision: true },
          { actor: "consumer", text: "Substitute out-of-stock items on the spot", decision: true },
          { actor: "consumer", text: "Pay at checkout", approval: true },
        ],
      },
      ecommerce: {
        summary: "An app replaces the trip, but the consumer still builds the basket item by item.",
        control: "The grocer's app controls search ranking, sponsored products and substitutions.",
        steps: [
          { actor: "consumer", text: "Open grocer app; reorder from past orders", decision: true },
          { actor: "retailer", text: "App ranks products; sponsored items appear in search" },
          { actor: "consumer", text: "Search and add the remaining items", decision: true },
          { actor: "consumer", text: "Set substitution preferences and a delivery slot", decision: true },
          { actor: "consumer", text: "Pay", approval: true },
          { actor: "retailer", text: "Picker substitutes; consumer accepts or rejects on delivery", decision: true },
        ],
      },
      agentic: {
        summary: "A standing mandate: the agent drafts the basket from household patterns, the consumer edits and approves.",
        control: "Whoever holds household context (grocer, agent platform or bank) controls the default basket.",
        steps: [
          { actor: "agent", text: "Agent drafts the basket from consumption patterns, the meal plan and pantry signals" },
          { actor: "agent", text: "Agent compares grocers on total basket price, slots and substitution quality" },
          { actor: "consumer", text: "Review exceptions only: new items, price jumps, substitutions", decision: true },
          { actor: "consumer", text: "Approve, or let it auto-approve under a weekly budget cap", approval: true },
          { actor: "merchant-agent", text: "Grocer's system confirms availability and slot; picker follows the agent's substitution rules" },
          { actor: "agent", text: "Agent logs what was eaten or wasted to improve next week" },
        ],
      },
    },
  },
  {
    id: "travel",
    task: "Book a family trip",
    brief: "High-ticket, multi-component, emotional and time-sensitive.",
    eras: {
      physical: {
        summary: "A travel agent assembles the package; the family decides at the desk.",
        control: "The travel agent (and their commission arrangements) controls the options shown.",
        steps: [
          { actor: "consumer", text: "Decide dates, budget and destination ideas", decision: true },
          { actor: "retailer", text: "Travel agent proposes packages from partner operators" },
          { actor: "consumer", text: "Compare 2–3 brochure packages", decision: true },
          { actor: "consumer", text: "Pay a deposit, then the balance", approval: true },
          { actor: "retailer", text: "Agent issues tickets and handles changes" },
        ],
      },
      ecommerce: {
        summary: "Online travel agencies and metasearch hand the consumer every option, and all the work.",
        control: "Metasearch and OTAs control ranking; paid placement is common.",
        steps: [
          { actor: "consumer", text: "Search flights on metasearch across dates", decision: true },
          { actor: "platform", text: "OTA / metasearch ranks fares and hotels (some sponsored)" },
          { actor: "consumer", text: "Compare hotels, reviews and maps across tabs", decision: true },
          { actor: "consumer", text: "Book flights, hotel and car separately", decision: true, approval: true },
          { actor: "consumer", text: "Track changes and handle disruptions alone", decision: true },
        ],
      },
      agentic: {
        summary: "An agent plans across components and monitors the trip, but high-stakes commitments stay human-approved.",
        control: "The agent's planner controls the itinerary shown; suppliers compete on machine-readable fares and policies.",
        steps: [
          { actor: "consumer", text: "Brief the agent: dates, budget, kids' ages, \"no red-eyes\", loyalty programs", decision: true },
          { actor: "agent", text: "Agent assembles 2–3 complete itineraries with total cost and trade-offs" },
          { actor: "consumer", text: "Choose and approve the itinerary", decision: true, approval: true },
          { actor: "agent", text: "Agent books each component with a delegated credential" },
          { actor: "agent", text: "Agent monitors fares and disruptions; proposes rebookings for approval" },
          { actor: "consumer", text: "Approve changes above a set threshold", approval: true },
        ],
      },
    },
  },
  {
    id: "replenish",
    task: "Replenish household supplies",
    brief: "Low-involvement, recurring, highly predictable.",
    eras: {
      physical: {
        summary: "Bought when someone notices it has run out.",
        control: "Shelf position and in-store promotions decide which brand goes in the cart.",
        steps: [
          { actor: "consumer", text: "Notice detergent is low", decision: true },
          { actor: "consumer", text: "Add to the next store trip" },
          { actor: "retailer", text: "Shelf placement and promotions steer brand choice" },
          { actor: "consumer", text: "Pick a brand and pay", decision: true, approval: true },
        ],
      },
      ecommerce: {
        summary: "Subscriptions and one-click reorder remove some steps; the consumer still sets them up and manages them.",
        control: "Marketplaces control the 'buy again' default and subscription discounts.",
        steps: [
          { actor: "consumer", text: "Reorder from history or set up a subscription", decision: true, approval: true },
          { actor: "platform", text: "Marketplace suggests 'buy again' and sponsored alternatives" },
          { actor: "consumer", text: "Skip or adjust deliveries when the cadence is wrong", decision: true },
        ],
      },
      agentic: {
        summary: "A persistent agent predicts need and reorders within a mandate; the consumer sees exceptions.",
        control: "The agent's default brand and merchant choice becomes the moat; switching happens inside the agent.",
        steps: [
          { actor: "agent", text: "Agent predicts run-out from usage and order history" },
          { actor: "agent", text: "Agent picks the merchant and price within the mandate (brand lock or 'cheapest equivalent')" },
          { actor: "agent", text: "Agent executes automatically under a monthly cap" },
          { actor: "consumer", text: "Review a monthly digest; change the mandate if needed", decision: true },
        ],
      },
    },
  },
];
