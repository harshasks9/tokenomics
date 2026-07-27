// Executive persona models for the Global Sae-A session.
// Named attendees are from the account team's briefing document (evidence).
// Motivations, metrics and objections are modelled by the Google Cloud strategy
// team (hypothesis) and are intended to be tested, not assumed, on 14 August.

export type Persona = {
  id: string;
  name: string;
  nameKo?: string;
  role: string;
  inRoom: boolean;
  headline: string;
  context: string;
  successMetrics: string[];
  constraints: string[];
  politics: string;
  aiLeverage: string;
  aiRisk: string;
  openingLine: string;
  killerObjection: string;
  answer: string;
  accent: string;
};

export const personas: Persona[] = [
  {
    id: "km-kim",
    name: "KM Kim",
    nameKo: "김기명 부회장",
    role: "Vice Chairman & CEO — former Country Manager, Walmart Korea",
    inRoom: true,
    headline: "He has sat on the other side of your supplier scorecard. Sell to that.",
    context:
      "A Vice Chairman who ran Walmart Korea evaluates this proposal the way a buyer evaluates a vendor: total landed cost, on-time-in-full, and whether the supplier makes the buyer's own compliance obligations easier or harder. He does not need to be taught what Project Gigaton reporting or a supplier scorecard is — he has enforced one.",
    successMetrics: [
      "Fully-landed cost per unit versus competing OEMs",
      "Share of wallet at Walmart, Target, Kohl's and Gap",
      "On-time-in-full and order-change responsiveness",
      "Group operating margin resilience through the tariff transition",
    ],
    constraints: [
      "Cannot commit capital that the owner family has not blessed",
      "Cannot risk buyer relationships on an unproven system",
      "Must show results inside a buying cycle, not a technology cycle",
    ],
    politics:
      "The bridge between the owner family and professional management. If he endorses this in front of Jinah Kim, it happens. If he stays neutral, it stalls politely.",
    aiLeverage:
      "Make Sae-A the supplier whose compliance and cost answers arrive first. Buyers reward the supplier who reduces their own workload — he knows this from the inside.",
    aiRisk:
      "A visible AI failure in front of a buyer — a wrong emissions figure in a Walmart submission — would cost more than the programme saves.",
    openingLine:
      "\"You have run the scorecard we are now trying to win. We would like to build the system that makes Sae-A the easiest supplier on it to say yes to.\"",
    killerObjection: "\"What does this actually change in a buyer negotiation?\"",
    answer:
      "It changes what you can put on the table in the room. Today a duty-and-carbon-inclusive quote across four candidate factories takes days to assemble. The target state is that it is assembled before the meeting ends, with the evidence pack attached. That is a negotiating position, not a report.",
    accent: "#0047A0",
  },
  {
    id: "jinah-kim",
    name: "Jinah Kim",
    nameKo: "김진아 대표이사",
    role: "CEO — owner family",
    inRoom: true,
    headline: "Legacy and durability, not novelty. Nothing that risks the family name.",
    context:
      "Owner-family leadership of a business built over four decades, with a publicly recognised record of investing in manufacturing communities. Decisions are weighed on a generational horizon and on reputational durability, not quarterly technology fashion.",
    successMetrics: [
      "The group's standing with global buyers and in Korea",
      "Long-run competitiveness of the manufacturing base",
      "Employee stability across 70,000 people",
      "Capital deployed with discipline and visible return",
    ],
    constraints: [
      "Deep institutional caution about IT spend that does not visibly pay back",
      "Reputational exposure of anything labelled 'AI replacing people'",
      "Prefers proven, referenceable choices over first-mover risk",
    ],
    politics:
      "The single decision node. Without explicit backing here, adoption in fashion and construction is, in the account team's words, nearly impossible.",
    aiLeverage:
      "Framed correctly, this protects the manufacturing base rather than shrinking it: it defends bidding competitiveness against buyers whose ESG demands are rising faster than the group's ability to answer them.",
    aiRisk:
      "Any framing that implies workforce reduction. The 70,000 are the group's social legacy, not a cost line to be optimised in a slide.",
    openingLine:
      "\"We are not proposing to change what Sae-A makes or who makes it. We are proposing to make the two thousand people in Seoul who decide where the work goes dramatically faster at deciding.\"",
    killerObjection: "\"Why should we spend on this now, when we have spent on systems before and seen little?\"",
    answer:
      "Because this one is bounded and reversible. One thousand seats, one buyer programme, sixty days, one number agreed in advance. If that number does not move, we stop — and you will have spent less than a single overseas audit round.",
    accent: "#CD2E3A",
  },
  {
    id: "brian-cho",
    name: "Brian Cho",
    nameKo: "조병훈 상무",
    role: "Group CTO / IT Executive",
    inRoom: true,
    headline: "He owns the integration risk and will be blamed if this is messy.",
    context:
      "Responsible for a heterogeneous estate across apparel, construction and paper, complicated by the Ssangyong (2022) and Tegra (2024) acquisitions. Almost certainly running lean, with no dedicated ML platform team.",
    successMetrics: [
      "Uptime, security and data-residency posture",
      "Integration effort and total systems he must keep alive",
      "Whether the business stops asking him for reports",
      "Delivery without a headcount increase he cannot get approved",
    ],
    constraints: [
      "No in-house MLOps capability to assume",
      "Multiple ERP and factory systems across subsidiaries and geographies",
      "Korean data-residency and AI Basic Act obligations landing on his desk",
    ],
    politics:
      "Will not block a CEO-backed programme, but can slow it indefinitely on integration grounds. Must be made a co-author on 14 August, not a recipient.",
    aiLeverage:
      "A retrieval and agent layer over existing systems avoids the consolidation programme he has neither budget nor appetite for.",
    aiRisk:
      "Shadow AI. If the business does not get a governed tool, it will use ungoverned ones — and the AI Basic Act's transparency duties will land on him anyway.",
    openingLine:
      "\"We are not asking you to consolidate anything. We are proposing a layer that reads what you already have, with the audit trail your regulators are about to ask for.\"",
    killerObjection: "\"How much integration work does my team actually have to do?\"",
    answer:
      "For the sixty-day proof: connectors to the document repositories and the ERP extracts you already produce. No schema changes, no data migration, no new platform team. If phase one requires a data-warehouse programme first, we have designed it wrong.",
    accent: "#00897B",
  },
  {
    id: "michael-lesniak",
    name: "Michael Lesniak",
    role: "Director, Strategic Initiatives — AX Lead",
    inRoom: true,
    headline: "Our champion. He has already spent his credibility on us once.",
    context:
      "Led the alignment sessions on 2 and 8 July, then took the Google AX collaboration plan to the Senior Leadership Summit on 15 July and secured positive feedback. He is the reason this meeting exists.",
    successMetrics: [
      "The AX programme surviving contact with the owner family",
      "A visible, quotable win inside 2026",
      "Being seen to have chosen the right partner",
    ],
    constraints: [
      "Political capital already spent once; a stalled programme is his risk",
      "Needs artefacts he can circulate internally without a Google person present",
    ],
    politics:
      "Everything we produce should be designed for him to forward. This microsite is built to be forwardable.",
    aiLeverage: "He converts Google capability into Sae-A language. Arm him, do not upstage him.",
    aiRisk: "If Google over-promises on 28 July and under-delivers on 14 August, he absorbs the damage, not us.",
    openingLine:
      "\"Michael took this to your Senior Leadership Summit on 15 July. Everything we are showing today is what he asked us to make concrete.\"",
    killerObjection: "\"Will Google still be here in six months, or does the JAPAC team move on?\"",
    answer:
      "Named resources, named dates: the 14 August workshop, the Korean AI specialist team, Country Director engagement in the September/October window, and the Q4 review. Commitment written down is the only kind that counts.",
    accent: "#4285F4",
  },
  {
    id: "jonghyun-lee",
    name: "Jonghyun Lee",
    nameKo: "이종현 부장",
    role: "Head of Strategic Planning",
    inRoom: true,
    headline: "He will own the business case that the family actually reads.",
    context:
      "Strategic Planning is where cross-subsidiary capital allocation is argued in a Korean conglomerate. He translates a Google proposal into the internal format the owner family trusts.",
    successMetrics: [
      "Defensible ROI arithmetic that survives internal challenge",
      "Cross-subsidiary coherence rather than five separate pilots",
      "Alignment with the group's stated transformation agenda",
    ],
    constraints: ["Must show payback within an approvable horizon", "Cannot appear captured by a single vendor"],
    politics: "Quiet but decisive. If his model says no, the deck never reaches the family in a favourable form.",
    aiLeverage: "Give him the model, not the conclusion. The ROI calculator on this site is built for him.",
    aiRisk: "Over-claimed benefits that collapse under his sensitivity analysis destroy trust permanently.",
    openingLine:
      "\"We have published our assumptions rather than our conclusions. Change any of them and the model recalculates in front of you.\"",
    killerObjection: "\"Your savings assume adoption. What if adoption is 30%?\"",
    answer:
      "Then set adoption to 30% in the model and see. The case is designed to clear its hurdle at conservative adoption; we would rather lose the argument at 30% than win it at 90% and be wrong.",
    accent: "#5F6368",
  },
  {
    id: "jason-park",
    name: "Jason Park",
    nameKo: "박해정 팀장",
    role: "HR Team Leader",
    inRoom: true,
    headline: "Owns adoption — and owns the group's exposure under the AI Basic Act.",
    context:
      "HR carries both the change-management burden for ~2,000 office staff and the highest-risk regulatory surface, since employment is a high-impact category under Korea's AI Basic Act, effective 22 January 2026.",
    successMetrics: [
      "Actual weekly active use, not licences deployed",
      "Employee sentiment through the change",
      "No regulatory or works-council incident",
    ],
    constraints: [
      "Anxiety about job-displacement framing across a 70,000-person group",
      "High-impact AI obligations if agents touch hiring or evaluation",
    ],
    politics: "Can quietly starve the programme of participation. Must be a designer of the rollout, not its recipient.",
    aiLeverage:
      "The Samsung DX pattern is directly relevant: non-technical staff in HR, marketing and administration building their own no-code agents is what turns licences into adoption.",
    aiRisk:
      "Any agent that scores, ranks or screens people. Keep phase one to retrieval and drafting; defer evaluation use cases entirely.",
    openingLine:
      "\"The metric we would like to be judged on is weekly active use by people who do not work in IT.\"",
    killerObjection: "\"Are we going to be told this replaces our teams?\"",
    answer:
      "The design target is the opposite: the group is absorbing more order volatility, more overseas construction and more buyer compliance work with the same Seoul headcount. This is capacity for growth, not a headcount programme — and we will not propose agents that evaluate people.",
    accent: "#E37400",
  },
  {
    id: "saejin-jung",
    name: "Saejin Jung",
    nameKo: "정세진 과장",
    role: "PM, Strategic Planning",
    inRoom: true,
    headline: "The person who will actually run the sixty days.",
    context:
      "Programme management for the AX workstream. Day-to-day execution, workshop logistics and the internal reporting cadence will run through this seat.",
    successMetrics: ["Milestones hit", "Clean internal reporting", "No surprises escalated upward"],
    constraints: ["Limited authority", "Competing priorities inside Strategic Planning"],
    politics: "Low formal power, high informational power. Keep this seat over-informed.",
    aiLeverage: "First and best user of the workspace agents; a credible internal proof point by week three.",
    aiRisk: "Under-resourcing. A sixty-day proof with a part-time owner fails on calendar, not on capability.",
    openingLine: "\"Who owns the sixty days, and what percentage of their week is it?\"",
    killerObjection: "\"How much of my team's time does this take?\"",
    answer:
      "One named owner at roughly half-time for sixty days, plus two hours a week from four business users. Google brings the engineering. If it needs more than that from Sae-A, phase one is scoped wrong.",
    accent: "#7B61FF",
  },
  {
    id: "cfo",
    name: "Group CFO / Finance",
    role: "Not in the room — decides anyway",
    inRoom: false,
    headline: "The absent veto. Write the deck for someone who was not there.",
    context:
      "In a cost-conservative, owner-operated group, the finance function will price this proposal against COGS improvement, not against an IT budget line. The materials that reach them will be a summary, not this conversation.",
    successMetrics: ["Payback period", "Cash-flow profile", "Contractual downside if it fails"],
    constraints: ["Thin construction margins", "Working-capital discipline through a tariff transition"],
    politics: "Will not attend, will be consulted, and can end this with one question about payback.",
    aiLeverage: "Audit travel and overseas-audit labour are hard, cash-visible savings with an unusually clean baseline.",
    aiRisk: "A multi-year commitment with back-loaded benefits. Do not propose one.",
    openingLine: "\"The first commitment we are asking for is sixty days and one bounded number.\"",
    killerObjection: "\"What is the payback period, and what happens if we stop?\"",
    answer:
      "Phase one is designed to be exited cleanly. Seat-based, bounded scope, one agreed metric. The scale decision in Q4 is a separate decision, made with your own data instead of our references.",
    accent: "#188038",
  },
  {
    id: "audit",
    name: "Group Internal Audit",
    role: "Not in the room — the cleanest first win",
    inRoom: false,
    headline: "Highest ratio of measurable saving to implementation difficulty in the whole group.",
    context:
      "Auditing 41 factories across 10 countries means multilingual invoices, ERP extracts and contracts, and a great deal of air travel. The briefing identifies a 30–50% travel-overhead reduction as the target.",
    successMetrics: ["Coverage of entities audited", "Findings per auditor-day", "Travel and time cost per audit"],
    constraints: ["Small team relative to entity count", "Evidence standards that must survive external scrutiny"],
    politics: "Reports to the family. A win here is heard where it matters most.",
    aiLeverage:
      "Document ingestion and anomaly flagging across Korean, English, Spanish and Vietnamese source documents is precisely what a grounded enterprise agent does well today.",
    aiRisk: "Never let the agent conclude. It surfaces and cites; a human auditor decides. That distinction is the control.",
    openingLine: "\"Continuous remote review across all 41 sites, with the auditor deciding and the agent doing the reading.\"",
    killerObjection: "\"Will an auditor trust a machine-generated finding?\"",
    answer:
      "They will not, and should not. The agent produces a ranked, cited exception list — every flag traceable to the source document. The auditor's judgement is the product; the reading is the cost we are removing.",
    accent: "#A50E0E",
  },
  {
    id: "ssangyong-safety",
    name: "Ssangyong E&C Safety & Operations",
    role: "Not in the room — the highest-stakes exposure",
    inRoom: false,
    headline: "Under SAPA, a site accident is a criminal matter for named executives.",
    context:
      "Korea's Serious Accident Punishment Act, effective January 2022 and extended from January 2024 to workplaces with five or more workers and construction projects of any size, exposes responsible executives to imprisonment of at least one year and fines up to KRW 1 billion for a fatality. Ssangyong runs ~3% operating margins on a USD 6.7B backlog.",
    successMetrics: ["Zero serious accidents", "Schedule adherence", "Handover quality on overseas projects"],
    constraints: ["Site-level connectivity", "Union and privacy considerations for camera-based monitoring"],
    politics: "Safety is not a business case in Korean construction. It is a personal-liability case for named individuals.",
    aiLeverage:
      "Vision-based PPE compliance detection plus a durable, timestamped safety record — the evidence trail matters as much as the detection.",
    aiRisk:
      "Worker-surveillance perception, and Korean privacy obligations. Detect conditions and equipment, not identities.",
    openingLine: "\"The deliverable is not the camera. It is the defensible record that the system was working.\"",
    killerObjection: "\"We already have safety managers and CCTV. What does this add?\"",
    answer:
      "Continuity and evidence. Human monitoring is sampled; this is continuous, and it produces a timestamped compliance log. Under SAPA the question after an incident is what your system was doing, and whether you can prove it.",
    accent: "#F29900",
  },
  {
    id: "esg",
    name: "ESG / Sustainability",
    role: "Not in the room — where the commercial threat actually sits",
    inRoom: false,
    headline: "This has stopped being a reporting function and become a bidding qualification.",
    context:
      "Walmart's Project Gigaton has moved to deeper Scope 3 work with a raised disclosure bar; the EU's Digital Product Passport for textiles is indicated for a 2027 delegated act with application from roughly 2028 and contemplates ~126 structured data points per product.",
    successMetrics: ["Buyer audit outcomes", "Emissions intensity per unit", "Data completeness across 41 factories"],
    constraints: ["Data collected inconsistently across ten countries", "Manual consolidation into buyer templates"],
    politics: "Currently treated as compliance overhead. Reframing it as a bidding asset changes its internal standing.",
    aiLeverage:
      "A BigQuery environmental data pipeline with Looker dashboards turns a quarterly scramble into an always-available answer — and eventually into a machine-readable product passport.",
    aiRisk: "Publishing figures that cannot survive third-party assurance. Lineage and auditability are the requirement, not dashboards.",
    openingLine: "\"Your buyers are about to make this a condition of bidding. Being early is worth more than being accurate late.\"",
    killerObjection: "\"Why build this before the regulation is final?\"",
    answer:
      "Because Walmart's requirements are not waiting for Brussels, and the data collection lead time is measured in years, not quarters. Brands that piloted in 2024–25 are already finding costly gaps. The pipeline you build for Walmart today is the passport you emit in 2028.",
    accent: "#188038",
  },
];

export const decisionDynamics = [
  {
    title: "The decision unit is a family, not a committee",
    detail:
      "The briefing is explicit: in fashion and construction, adoption is nearly impossible without owner-family backing. Optimise the entire engagement for one outcome — the owner family saying yes in front of professional management.",
  },
  {
    title: "Cost conservatism is a feature, not an obstacle",
    detail:
      "A group that has resisted expensive technology for decades has a strong balance sheet and no legacy AI sprawl to unwind. Meet the conservatism with bounded scope and pre-agreed exit conditions, and it becomes an advantage.",
  },
  {
    title: "Korean conglomerate proof beats global proof",
    detail:
      "Samsung Electronics' DX division adopting Gemini Enterprise for roughly 50,000 employees worldwide — announced 13 July 2026 and characterised as the largest agentic AI deal in Korea — carries more weight in this room than any Western reference.",
  },
  {
    title: "The buyer is the third party in every conversation",
    detail:
      "Walmart, Target, Kohl's and Gap are effectively present at this table. Any argument that improves Sae-A's standing with them lands; any argument that does not is a technology discussion.",
  },
  {
    title: "Procurement will look for a reason to shrink the first commitment",
    detail:
      "Anticipate it and pre-shrink it. Offering a bounded phase one before they ask converts a negotiation into an agreement.",
  },
];
