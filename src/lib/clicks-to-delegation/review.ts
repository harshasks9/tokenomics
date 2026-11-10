/** Phase 5 — adversarial editorial review: the five weakest claims and what was done about them. */
import type { WeakClaim } from "./types";

export const WEAK_CLAIMS: WeakClaim[] = [
  {
    claim: "\"The most-used AI shopping assistants sit inside existing marketplaces and retailer apps.\" (early draft of sections 01 and 13)",
    problem: "Contradicted by the strongest independent survey: consumers used general AI chatbots for shopping about twice as often as retailers' own assistants (56% vs 27%).",
    action: "removed",
    resolution: "Rewritten to say retailers are building their own agents and pulling checkout back, while general chatbots lead on usage, so destinations are not safe either.",
  },
  {
    claim: "Walmart's in-ChatGPT checkout converted at about a third of the rate of click-outs.",
    problem: "Load-bearing for insight 1, but it comes from one executive interview, read through a mirror and secondary coverage; the original article was not reached.",
    action: "qualified",
    resolution: "Sourced to the mirror and corroborated by OpenAI's independently reported retreat and Forrester's assessment; insight 1 carries confidence 70, not higher, and names the single-source risk in its counterargument.",
  },
  {
    claim: "Alipay's AI Pay handled more than 120 million transactions in one week.",
    problem: "An unaudited company claim from a week that overlapped a subsidized campaign; easy to misread as proof of consumer delegation at scale.",
    action: "qualified",
    resolution: "Labeled a company claim everywhere it appears, rated 'contested' in the scorecard, and never used as evidence of autonomous purchasing.",
  },
  {
    claim: "Amazon's shopping assistant delivers more than $10B in annualized incremental sales.",
    problem: "Amazon's own attribution method; it may include advertising inside the assistant, and there is no independent audit.",
    action: "qualified",
    resolution: "Shown as a company claim; the initiative's level-6 maturity placement is footnoted as resting on company claims.",
  },
  {
    claim: "Category suitability scores and the adoption scenario outputs.",
    problem: "Both are judgment or modeling, and the scenario curves can be read as forecasts. Only five of fifteen categories have sourced online-penetration figures.",
    action: "qualified",
    resolution: "Every score is labeled 'Our judgment' with confidence rings; scenario curves are labeled illustrative, formulas are printed beside them, and no scenario number appears in a section takeaway.",
  },
];
