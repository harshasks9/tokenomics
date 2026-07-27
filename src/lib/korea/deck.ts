// Deliverable 2: the executive presentation, expressed as structured slide
// specifications rather than a rendered deck, so the account team can build it
// in any tool and so every slide carries its own speaker notes and objection
// handling.

export type Slide = {
  n: number;
  section: string;
  headline: string;
  narrative: string;
  evidence: string[];
  visual: string;
  infographic: string;
  speakerNotes: string;
  question: string;
  answer: string;
};

export const deckMeta = {
  audience:
    "Global Sae-A executive leadership — Vice Chairman KM Kim, CEO Jinah Kim, Group CTO Brian Cho, AX Lead Michael Lesniak, HR and Strategic Planning",
  duration: "20 minutes of Google content inside a 45-minute session, plus 15 minutes of executive Q&A",
  designPrinciple:
    "One idea per slide, one number per slide, and no product name before slide 8. The first seven slides are about Sae-A's business. If the deck were photographed without the Google logo, it should still read as a Sae-A strategy document.",
  goldenRule:
    "This deck is not trying to explain Gemini Enterprise. It is trying to get one sentence agreed: 'we will prove one number in sixty days.' Every slide is judged against that.",
};

export const slides: Slide[] = [
  {
    n: 1,
    section: "Why change",
    headline: "Four days ago, the number that sets your landed cost stopped existing",
    narrative:
      "Open in Sae-A's world, not Google's. Section 122's flat 10% surcharge expired at 12:01am ET on 24 July 2026. The proposed Section 301 replacement — 10–12.5% on 46-plus economies including Vietnam, Indonesia and Cambodia — has no statutory sunset, while CAFTA-DR-qualifying apparel enters duty-free. Every sourcing assumption made this spring is now stale.",
    evidence: [
      "Section 122 expired 24 July 2026 after its 150-day statutory cap; extension requires an Act of Congress",
      "USTR Section 301 proposal: 10–12.5% on 46+ economies, no expiration date",
      "CAFTA-DR textile and apparel goods of Costa Rica, Guatemala, Nicaragua and others remain exempt",
    ],
    visual:
      "Full-bleed world map, Sae-A's ten production countries lit. A single hard line divides the duty-free hemisphere from the exposed hemisphere. No chrome, no logo, no bullets.",
    infographic:
      "Two stacked cost bars for the same garment — one routed via Guatemala, one via Vietnam — showing the duty wedge opening on 24 July. One number, enormous type.",
    speakerNotes:
      "Do not speak for the first four seconds. Let the map land. Then: 'You know this better than we do. We are starting here because everything we propose is downstream of it.' This slide earns the right to the next nineteen minutes.",
    question: "Are you telling us how to run our sourcing?",
    answer:
      "No — you have already made the right footprint bets, over decades. We are here because the speed at which you can act on them has become the constraint.",
  },
  {
    n: 2,
    section: "Why change",
    headline: "Almost nobody else has factories on both sides of that line",
    narrative:
      "Sae-A's dual-hemisphere footprint — Vietnam, Indonesia, Cambodia, Myanmar alongside Haiti, Guatemala, Nicaragua, Costa Rica, deepened by Tegra in 2024 — is a genuinely rare structural asset. Shenzhou and most Asian peers cannot cross this line. Central American specialists lack Asian scale and vertical integration.",
    evidence: [
      "41 factories, 25 local offices, 10 countries, 4 continents",
      "Vertical integration from yarn through fabric and finishing to garment",
      "Tegra acquisition (2024) added Central American sports-apparel capacity",
      "Target has publicly doubled down on Guatemala sourcing under tariff pressure",
    ],
    visual: "Competitor footprint comparison — four horizontal bands, only Sae-A's spanning both hemispheres.",
    infographic:
      "A simple 2×2: Asian scale on one axis, duty-free access on the other. Sae-A alone occupies the top-right quadrant.",
    speakerNotes:
      "This is the flattery slide, and it is true. It also sets the trap for slide 3: the asset is real, but it is currently under-exploited because the decision layer is slow.",
    question: "Do our competitors not already know this?",
    answer:
      "They know the geography. What they cannot easily copy is the ability to act on it order by order — and that is the part that is buildable.",
  },
  {
    n: 3,
    section: "Why change",
    headline: "The constraint is not your factories. It is the two thousand people in Seoul.",
    narrative:
      "Converting the footprint into margin requires answering one question faster than the market moves: for this buyer, this style, this quantity, this week — which factory, at what fully-landed cost, with what carbon and compliance evidence? Today that answer is assembled by hand from ERP extracts, GSDCost standard-minute data and institutional memory.",
    evidence: [
      "~2,000 Korean office staff of ~70,000 group headcount",
      "GSDCost benchmarking already adopted across factories — the structured data exists",
      "Two acquisitions since 2022 (Ssangyong, Tegra) have increased estate heterogeneity",
    ],
    visual:
      "A swimlane of the current quote-assembly process with elapsed time on each hop, ending in a large number: days.",
    infographic:
      "Before/after clock. The 'after' clock is not zero — it is hours. Credibility beats ambition.",
    speakerNotes:
      "This is the pivot of the entire deck. Say plainly: 'We are not proposing to change what Sae-A makes or who makes it. We are proposing to make the people who decide where the work goes dramatically faster.' Watch the owner-family CEO on this line.",
    question: "Are you saying our people are the problem?",
    answer:
      "The opposite. They are doing sophisticated reasoning with poor tooling. We want to remove the assembly work, not the judgement.",
  },
  {
    n: 4,
    section: "Why now",
    headline: "Three external clocks are running, and none of them are yours",
    narrative:
      "Trade policy reset on 24 July. Walmart has moved Project Gigaton to deeper Scope 3 work with a raised disclosure bar. The EU's textile Digital Product Passport is indicated for a 2027 delegated act, applying from roughly 2028, with around 126 structured data points per product. Data collection lead times are measured in years.",
    evidence: [
      "Walmart passed its 1-gigaton goal six years early; 6,800+ suppliers participating; disclosure bar raised",
      "ESPR working plan indicates a 2027 textiles delegated act; application realistically from ~2028",
      "Brands that piloted DPP data in 2024–25 are already finding costly gaps",
    ],
    visual: "Three parallel timeline bars converging on 2028, with today marked by a vertical line at July 2026.",
    infographic:
      "A countdown strip: days since the tariff change, quarters to the DPP delegated act, and the current buyer disclosure cycle.",
    speakerNotes:
      "The Vice Chairman ran Walmart Korea. Let him confirm the buyer-side pressure — an endorsement from him here is worth more than another Google slide.",
    question: "Regulation always slips. Why build ahead of it?",
    answer:
      "Because Walmart is not waiting for Brussels, and the data takes years to collect regardless of when the rule lands. Being early is cheap; being late is disqualifying.",
  },
  {
    n: 5,
    section: "Why now",
    headline: "Korea regulated AI in January. The grace period is a window, not an exemption.",
    narrative:
      "The AI Basic Act and its Enforcement Decree took effect on 22 January 2026, covering both developers and businesses that use AI, with transparency notice obligations and high-impact categories including employment. MSIT is operating a grace period of at least one year through 2026.",
    evidence: [
      "AI Basic Act effective 22 January 2026",
      "Applies to AI-utilising businesses, not only developers",
      "MSIT grace period of at least one year through 2026; fines capped around KRW 30 million",
      "High-impact categories include employment, healthcare, finance and public safety",
    ],
    visual: "A calendar bar showing the grace period shrinking, with the programme's governance milestones inside it.",
    infographic: "Two costs side by side: governance configured inside the grace period versus retrofitted in 2027.",
    speakerNotes:
      "This slide is aimed at the Group CTO and at HR. It converts a compliance worry into a reason to move now rather than a reason to wait.",
    question: "Does this mean AI in HR is off the table?",
    answer:
      "Evaluation and selection use cases are, and we are not proposing them. Retrieval and drafting are not high-impact and are where the productivity actually is.",
  },
  {
    n: 6,
    section: "Why Google",
    headline: "Korea's most cost-conscious innovator made this decision two weeks ago",
    narrative:
      "Samsung Electronics' DX division adopted Gemini Enterprise for roughly 50,000 employees worldwide — announced 13 July 2026, characterised as the largest agentic AI deal in Korea, delivered through Samsung SDS. The stated reason matters more than the size: it lets non-technical employees build their own agents.",
    evidence: [
      "Samsung Electronics DX division, ~50,000 employees worldwide, announced 13 July 2026",
      "Delivered via Samsung SDS as the implementation partner",
      "Gemini Enterprise positioned as a gateway across fragmented internal systems",
    ],
    visual: "Deliberately plain. The Samsung DX headline, the date, and the seat count. Nothing else on the slide.",
    infographic: "A Korean adoption timeline of the last eighteen months, with July 2026 as the inflection.",
    speakerNotes:
      "Do not oversell. One sentence: 'A company famous for cost discipline, that could have built this itself, chose to buy it — and chose us.' Then stop talking.",
    question: "Samsung has an IT arm. We do not.",
    answer:
      "Which is precisely why the partner-delivered model matters for you. We will name the delivery partner before 14 August so the team that runs the workshop is the team that delivers.",
  },
  {
    n: 7,
    section: "Why Google",
    headline: "Your problem is multilingual, multi-system and multi-country. That narrows the field.",
    narrative:
      "This is not a Korean-language problem. It is Korean, Spanish, Vietnamese and English across contracts, invoices, factory records and buyer specifications, spanning ERP systems that two acquisitions have made heterogeneous. Grounded reasoning across that estate — with citations — is a narrow capability, not a commodity one.",
    evidence: [
      "10 countries, 41 factories, 25 local offices",
      "Ssangyong (2022) and Tegra (2024) added separate stacks",
      "Overseas construction orders grew ~8x to USD 650M in 2025, adding Arabic and English contract volume",
    ],
    visual:
      "One document rendered in four languages flowing into a single grounded answer, with source citations shown explicitly.",
    infographic:
      "An honest capability comparison across document-centric assistance, cross-system grounding, multilingual reasoning and no-code agent building — including where competitors are genuinely strong.",
    speakerNotes:
      "Show a competitor's genuine strength on this slide. A comparison that admits nothing is not believed by anyone in this room, least of all a Vice Chairman who has evaluated vendors for a living.",
    question: "Why not simply use what is bundled with our existing productivity suite?",
    answer:
      "For work that lives inside documents, you may well should. The gap is answering questions that span your ERP, your factory records and your buyer correspondence at once — which is where your actual cost sits.",
  },
  {
    n: 8,
    section: "What we propose",
    headline: "Two agents. Sixty days. One number each.",
    narrative:
      "First real product mention, and deliberately narrow. The Remote Smart Audit Agent reads the full population of invoices, contracts and ERP entries across 41 factories and returns cited exceptions. The Landed-Cost Allocation Agent turns a buyer RFQ into a ranked, duty-and-carbon-inclusive factory recommendation. Nothing else in phase one.",
    evidence: [
      "Audit today spans 41 factories across 10 countries with physical travel",
      "Briefing target: 30–50% reduction in audit travel overhead",
      "GSDCost standard-minute data already exists as an input to allocation",
    ],
    visual: "Two cards, side by side, nothing else on the slide. Resist the temptation to add a third.",
    infographic:
      "For each agent: input documents on the left, the cited output on the right, and the human decision point drawn explicitly in the middle.",
    speakerNotes:
      "The restraint is the message. If someone asks about a third use case, write it on the board for 14 August and move on. A cost-conservative family reads a long list as an unbounded bill.",
    question: "Only two? We have more problems than that.",
    answer:
      "You do, and we have mapped nineteen. We are proposing two because a programme that proves two things in sixty days earns the right to the rest — and one that attempts nine proves none.",
  },
  {
    n: 9,
    section: "What we propose",
    headline: "We are not proposing seats for seventy thousand people",
    narrative:
      "Roughly 68,000 of Sae-A's 70,000 employees are factory and field workers for whom a seat-based knowledge assistant is not the right tool. The AX population is the ~2,000 Korean office staff, and the Q4 proposal is 1,000 seats — half of them. We also recommend against ERP consolidation and against a group-wide data lake before value is proven.",
    evidence: [
      "~2,000 Korean office staff of ~70,000 group headcount",
      "Q4 2026 target: 1,000 Gemini Enterprise seats",
      "Phase one requires no schema changes and no data migration",
    ],
    visual:
      "A single proportional block of 70,000 with a small highlighted square of 1,000. The visual argument is the size ratio.",
    infographic: "A short list titled 'What we are not proposing', with three items and a cost of zero beside each.",
    speakerNotes:
      "This is the trust slide of the entire deck. Deliver it slowly. For an owner family that has been oversold technology before, the vendor who names the ceiling unprompted is the one they believe.",
    question: "What stops this becoming a seventy-thousand-seat bill later?",
    answer:
      "Expansion is tied to measured weekly active use, and we will write the ceiling into phase one. If the second thousand seats are not earned by data, they should not be sold.",
  },
  {
    n: 10,
    section: "The money",
    headline: "One cent per garment is worth more than the entire programme",
    narrative:
      "At roughly 2.5 million garments a day, a one-cent improvement in fully-landed cost per unit is worth tens of millions of dollars a year. Set against that, the entire phase-one and Q4 commitment is a rounding error. The right comparison for this investment is COGS, never the IT budget.",
    evidence: [
      "~2.5 million garments produced per day",
      "Group revenue KRW 4–5 trillion",
      "Q4 proposal bounded at 1,000 seats",
    ],
    visual:
      "Two bars at true scale: annual value of a one-cent per-unit improvement, and the annual programme cost. The second bar is almost invisible.",
    infographic: "A live ROI model with adjustable adoption, realisation and seat-cost inputs — assumptions visible, not hidden.",
    speakerNotes:
      "Show the model, not the conclusion. Invite the Head of Strategic Planning to change an assumption in the room. Losing an argument at his numbers is better than winning it at ours.",
    question: "Your savings assume adoption. What if adoption is thirty per cent?",
    answer:
      "Set it to thirty and look. The case is built to clear its hurdle at conservative adoption — and the audit workstream's savings barely depend on adoption at all.",
  },
  {
    n: 11,
    section: "The money",
    headline: "The audit case is cash, and its baseline is unusually clean",
    narrative:
      "Auditing 41 factories in 10 countries generates travel cost and auditor-days that are already measured and already in the budget. A 30–50% reduction in travel overhead is cash out of a known line, with no dependency on factory instrumentation or user adoption.",
    evidence: [
      "41 factories across 10 countries",
      "Multilingual document estate: Korean, English, Spanish, Vietnamese",
      "Briefing target: 30–50% audit travel-overhead reduction",
    ],
    visual: "A single waterfall: current audit cost, travel avoided, auditor-days recovered, coverage gained.",
    infographic:
      "Coverage inversion — a sampled population versus a fully-read one, with the same team size on both sides.",
    speakerNotes:
      "This is the slide the absent CFO will be shown. Make it self-contained enough to survive being forwarded without a narrator.",
    question: "Will our auditors trust machine-generated findings?",
    answer:
      "They should not, and the design does not ask them to. The agent produces a ranked, cited exception list; the auditor decides. We are removing the reading, not the judgement.",
  },
  {
    n: 12,
    section: "Why this sequence",
    headline: "Knowledge first, warehouse second — the reverse order is where programmes die",
    narrative:
      "Manufacturers that begin with a data-warehouse programme typically take eighteen months to first value and lose sponsorship on the way. Those that begin with grounded retrieval over documents they already trust reach value in weeks and earn the right to the data programme. Sae-A's ESG pipeline is phase two precisely because it will be funded by phase-one credibility.",
    evidence: [
      "Two acquisitions since 2022 guarantee estate heterogeneity",
      "Phase one requires no schema changes and no data migration",
      "ESG and traceability work sequenced for Q1 2027 against the DPP timeline",
    ],
    visual: "Two roadmaps side by side — the warehouse-first path and the knowledge-first path — with first-value markers.",
    infographic: "A confidence curve: sponsor confidence over time under each sequence.",
    speakerNotes:
      "Aimed at the Group CTO. He is expecting to be asked for an integration programme. Telling him he is not being asked converts the most likely blocker into an ally.",
    question: "Should we not fix our data first?",
    answer:
      "Fix the data you will be paid for fixing. The audit and allocation agents work over documents you already trust; what they surface will also tell you exactly which data is worth cleaning first.",
  },
  {
    n: 13,
    section: "The ask",
    headline: "14 August: we build in the room, and leave with one page signed",
    narrative:
      "The workshop is a working session, not a capability tour. Grounded retrieval stood up live over Sae-A's own documents. One agent built by a non-technical Sae-A employee. And a one-page charter naming the metric, the owner and the sixty-day date, signed on the day.",
    evidence: [
      "Workshop confirmed for 14 August 2026",
      "Alignment sessions completed 2 and 8 July; Senior Leadership Summit endorsement 15 July",
      "Google commits the Korean AI specialist team and Country Director engagement",
    ],
    visual: "The one-page charter itself, shown as the artefact. The slide is the document.",
    infographic: "A sixty-day calendar with four checkpoints and a single named owner per workstream.",
    speakerNotes:
      "End on an ask that is small enough to say yes to in the room. Do not ask for the Q4 decision today. Ask for the sixty days.",
    question: "What do you need from us?",
    answer:
      "One named owner at roughly half-time for sixty days, two hours a week from four business users, and access to the documents you already have. Google brings the engineering.",
  },
  {
    n: 14,
    section: "The ask",
    headline: "What we are committing, by name and by date",
    narrative:
      "Close on Google's commitments rather than on Sae-A's obligations: named people, named dates, and a Country Director engagement in the September–October window. Trust in this room is built by written commitment, not by enthusiasm.",
    evidence: [
      "Korean AI specialist team named to the programme",
      "Country Director engagement planned for September–October, after the PoC",
      "Delivery partner to be named before 14 August",
    ],
    visual: "A commitment table: what, who, by when. No imagery.",
    infographic: "A joint governance cadence — weekly working, monthly executive, quarterly with the owner family.",
    speakerNotes:
      "The final line belongs to the relationship, not the technology: 'You came to us. We intend to be worth that.' Then stop.",
    question: "Will the JAPAC team still be involved in six months?",
    answer:
      "The dates are on the slide, and the Korean team is permanent. Escalation runs to JAPAC AI GTM leadership directly for the life of the programme.",
  },
];

export const faq = [
  {
    q: "Why should a manufacturer of our size move now rather than in two years?",
    a: "Three external clocks are already running and none of them are yours: the Section 301 transition following Section 122's expiry on 24 July, Walmart's escalating Scope 3 disclosure expectations, and the EU Digital Product Passport arriving around 2028 on data that takes years to collect. Moving now costs a bounded sixty days. Moving in two years means moving under someone else's deadline.",
  },
  {
    q: "We have spent on enterprise systems before and seen little return. Why is this different?",
    a: "Because the commitment is bounded and reversible. One thousand seats, one buyer programme, sixty days, one metric agreed before any engineering begins. Phase one requires no schema changes, no data migration and no new platform team. If the metric does not move, you stop — having spent less than one overseas audit round.",
  },
  {
    q: "Does this reduce headcount?",
    a: "That is not the design and not the case we are making. The group is absorbing more order volatility, more overseas construction and more buyer compliance work with the same Seoul headcount. The objective is capacity for growth. We are also explicitly not proposing agents that evaluate or select people — that is a high-impact category under Korea's AI Basic Act, and it is not where the value is.",
  },
  {
    q: "How does this help us with Walmart and Target specifically?",
    a: "Two ways. First, speed: a duty-and-carbon-inclusive quote across multiple candidate factories assembled before a call ends rather than days after. Second, evidence: buyer ESG data requests answered the day they arrive, from a pipeline with lineage, rather than through a quarterly manual scramble. Buyers reward the supplier who reduces their own workload.",
  },
  {
    q: "What about our factory workers — do they get this?",
    a: "No, and we would advise against paying for it. Roughly 68,000 of your 70,000 employees are factory and field workers for whom a seat-based knowledge assistant is the wrong tool. Value for them comes later and differently: vision-based safety at Ssangyong sites, predictive maintenance in the paper mills. Those need different data foundations and belong to a later phase.",
  },
  {
    q: "How do we stay compliant with Korea's AI Basic Act?",
    a: "By configuring governance during phase one, inside MSIT's grace period, rather than retrofitting it in 2027. That means transparency notices where users interact with AI, logging and audit trails, and keeping phase-one HR use cases to retrieval and drafting rather than evaluation. This is included in the programme, not invoiced afterwards.",
  },
  {
    q: "What happens to our data?",
    a: "Enterprise data used for grounding is not used to train foundation models. Regional data handling, access controls and audit logging are configured to your requirements during phase one, with your Group CTO as co-author of the design rather than its recipient.",
  },
  {
    q: "Why not build this ourselves, or with a Korean provider?",
    a: "Korean-language capability is not the differentiator for your problem — your document estate is Korean, Spanish, Vietnamese, English and increasingly Arabic across ten countries and two acquired stacks. Building in-house requires a platform team you have not signalled a wish to create. The partner-delivered model, following the Samsung SDS pattern, gives you Korean delivery with Google engineering behind it.",
  },
  {
    q: "What does success look like on 31 October?",
    a: "Four numbers: auditor-days and travel cost avoided in one real audit cycle; hours-to-quote on one buyer programme; weekly active users among non-IT staff; and the number of agents built by people who do not work in IT. Agreed on 14 August, measured weekly, reported to the owner family in November.",
  },
  {
    q: "What is the single biggest risk to this programme?",
    a: "That the 14 August workshop becomes a capability tour and produces a use-case longlist instead of a signed one-page charter. We have designed the day specifically to avoid that, and you should hold us to it.",
  },
];

export const blueprint = {
  headline: "This site is the blueprint — here is how it is designed to work",
  sections: [
    {
      title: "Executive landing",
      detail:
        "Opens on Sae-A's trade-regime exposure, not on Google's portfolio. Four statistics, one thesis, no product name above the fold.",
    },
    {
      title: "Customer-specific business overview",
      detail:
        "The five-pillar group anatomy with sourced figures for each subsidiary, and an explicit evidence-versus-hypothesis label on every claim.",
    },
    {
      title: "Industry insights",
      detail:
        "Six forces with a stated 'so what' for Sae-A, anchored to dated external events rather than to generic market commentary.",
    },
    {
      title: "Department journeys",
      detail:
        "Eleven executive personas — those in the room and the four who decide anyway — each with success metrics, constraints, the likely killer objection and our answer to it.",
    },
    {
      title: "Interactive opportunity explorer",
      detail:
        "Ten opportunities plotted by modelled value against implementation effort, filterable by subsidiary and phase, including what we recommend against.",
    },
    {
      title: "ROI calculator",
      detail:
        "Assumptions exposed rather than conclusions asserted. Built for the Head of Strategic Planning to break in the room on 14 August.",
    },
    {
      title: "Adoption roadmap",
      detail:
        "Six phases from today to 2029, each with named outputs and a named owner, anchored to the 14 August workshop and the Q4 seat decision.",
    },
    {
      title: "Executive presentation",
      detail:
        "Fourteen slide specifications with headline, narrative, evidence, visual and infographic direction, speaker notes and the anticipated executive question for each.",
    },
    {
      title: "Executive FAQ and call to action",
      detail:
        "Ten anticipated executive questions answered in the customer's language, closing on a single ask: confirm 14 August and name the owner of the sixty days.",
    },
  ],
  demoIdeas: [
    "Live grounded search across a redacted set of Sae-A buyer contracts in Korean, English and Spanish, showing citations",
    "The allocation agent answering one real RFQ across four candidate factories, with its working shown",
    "A no-code agent built in the room by a Sae-A HR or planning employee, start to finish, in under fifteen minutes",
    "A Looker mock of the buyer ESG dashboard using Sae-A's own factory list",
    "NotebookLM over Ssangyong's method statements for one completed overseas project",
  ],
};
