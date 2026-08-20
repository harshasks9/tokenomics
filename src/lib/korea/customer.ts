// Customer-facing content for the Global Sae-A executive session.
//
// AUDIENCE: Global Sae-A's executive committee. Everything in this file is
// written to be read by the customer directly and circulated inside Sae-A
// without a Google presenter in the room.
//
// The internal account-team assessment — persona politics, objection handling,
// competitive positioning — lives in docs/global-sae-a-account-briefing.md and
// is deliberately NOT served by this site.
//
// Claim labelling: "confirmed" means publicly reported or established in our
// sessions with your team. "to confirm" means our inference, which we would
// rather have you correct than quietly carry into a plan.

export type Claim = "confirmed" | "to confirm";

export const site = {
  customer: "Global Sae-A",
  customerKo: "글로벌세아",
  title: "The Allocation Advantage",
  titleKo: "배분의 경쟁력",
  subtitle:
    "Your factories now sit on both sides of the line the July 2026 trade reset drew. This is what we have understood about that advantage, where we think the constraint on it sits, and what we would like to build with you over the next sixty days.",
  meetingDate: "28 July 2026",
  workshopDate: "14 August 2026",
  preparedFor: "Prepared for the executive leadership of Global Sae-A",
  preparedBy: "Google Cloud — JAPAC AI GTM and the Korea account team",
};

export const gratitude = {
  label: "감사의 말 · Thank you",
  headline: "Thank you for inviting us in, and for the work your team has already done",
  body: [
    "Global Sae-A approached Google Cloud to begin this conversation. That is not how most of these relationships start, and we have tried to be worth it. Over three technical sessions in early July your team taught us more about vertically integrated apparel manufacturing than we could have learned any other way, and on 15 July your Senior Leadership Summit gave the AX collaboration plan its first endorsement.",
    "What follows is our attempt to repay that. It is not a product presentation. It is what we now believe about your business, what we think the next twelve months ask of it, and a deliberately small first step we would like to take together on 14 August.",
    "We have marked every claim as either confirmed or still to confirm. Where we have inferred, we would rather be corrected tomorrow than be politely right in a plan that turns out to be wrong.",
  ],
};

export const koreanSummary = {
  label: "임원 요약 · Executive summary in Korean",
  note: "이 요약은 구글 클라우드가 작성했으며, 한국 담당팀의 검수를 거칩니다.",
  paragraphs: [
    "2026년 7월 24일, 미국의 Section 122 일괄 10% 부과 조치가 종료되었습니다. 후속으로 제안된 Section 301 조치는 베트남·인도네시아·캄보디아를 포함한 46개국 이상에 10~12.5%를 적용하는 반면, CAFTA-DR 요건을 충족하는 의류는 무관세가 유지됩니다.",
    "글로벌세아는 아시아와 중미 양쪽에 수직계열화된 생산 능력을 모두 보유한 소수의 기업 중 하나입니다. 이는 경쟁사가 단기간에 복제하기 어려운 구조적 자산입니다.",
    "저희가 보기에 제약은 41개 공장이 아니라, 서울에서 '어느 공장에, 얼마의 총 도착원가로, 어떤 탄소·컴플라이언스 근거와 함께' 배분할지를 결정하는 속도에 있습니다.",
    "8월 14일 AX 워크숍에서는 하나의 바이어 프로그램과 하나의 감사 주기를 대상으로, 60일 안에 측정 가능한 단일 지표를 합의하는 것을 목표로 합니다.",
  ],
};

export const heroStats = [
  { value: "41", label: "factories across 10 countries", note: "Sae-A Trading", claim: "confirmed" as Claim },
  { value: "2.5M", label: "garments produced per day", note: "Sae-A Trading", claim: "confirmed" as Claim },
  { value: "2", label: "tariff regimes your footprint now spans", note: "CAFTA-DR and Asia", claim: "confirmed" as Claim },
  { value: "4 days", label: "since the rule that set your landed cost expired", note: "Section 122 lapsed 24 July 2026", claim: "confirmed" as Claim },
];

export const tradeReset = {
  label: "무엇이 달라졌는가 · What changed",
  headline: "On 24 July, the number underneath every sourcing decision stopped existing",
  body:
    "You know this better than we do, so we will be brief. Section 122's flat 10% surcharge expired at 12:01am ET on 24 July 2026, four days ago, after reaching its 150-day statutory cap. The proposed Section 301 replacement carries duties of 10–12.5% across 46 or more economies — Vietnam, Indonesia, Cambodia and Korea among them — and, unlike Section 122, it has no built-in expiry. Textile and apparel goods qualifying under CAFTA-DR remain duty-free.",
  points: [
    {
      fact: "Section 122's 10% surcharge expired 24 July 2026",
      detail: "Extension would require an Act of Congress. None is pending.",
      claim: "confirmed" as Claim,
    },
    {
      fact: "The proposed Section 301 replacement has no sunset",
      detail: "10–12.5% across 46+ economies, in effect until USTR or the President affirmatively changes it.",
      claim: "confirmed" as Claim,
    },
    {
      fact: "CAFTA-DR qualifying apparel is exempt",
      detail:
        "Including goods of Guatemala, Nicaragua, Costa Rica, Honduras, El Salvador and the Dominican Republic.",
      claim: "confirmed" as Claim,
    },
    {
      fact: "Sourcing assumptions set this spring are now stale",
      detail:
        "Any landed-cost model built before 24 July is describing a regime that no longer exists.",
      claim: "to confirm" as Claim,
    },
  ],
};

export const footprint = {
  label: "귀사의 강점 · Your position",
  headline: "Very few manufacturers have real capacity on both sides of that line. You do.",
  body:
    "This is the part of your business we find most striking, and it is not a compliment we would pay to most of the companies we work with. Sae-A Trading runs vertically integrated capacity in Vietnam, Indonesia, Cambodia and Myanmar, and in Haiti, Guatemala, Nicaragua and Costa Rica — the latter reinforced by the Tegra acquisition in 2024. The Asian-weighted majors cannot cross that line for US-bound volume. The Central American specialists do not have your scale or your integration back to yarn.",
  regimes: [
    {
      name: "Central America and the Caribbean",
      nameKo: "중미·카리브",
      status: "Qualifying goods enter the US duty-free",
      countries: ["Guatemala", "Nicaragua", "Costa Rica", "Haiti"],
      implication:
        "Structurally advantaged for US-bound programmes under the proposed replacement duties. Tegra deepened this base in 2024. The work here is proving qualification and origin quickly, not adding capacity.",
      tone: "advantage" as const,
    },
    {
      name: "Asia",
      nameKo: "아시아",
      status: "Exposed to the proposed 10–12.5% replacement duties",
      countries: ["Vietnam", "Indonesia", "Cambodia", "Myanmar"],
      implication:
        "Retains the cost, scale and speed that made it your core. But for US-bound volume its landed-cost position is now policy-contingent and can move within a quarter. For EU, Japanese and Korean destinations the arithmetic is different again.",
      tone: "exposed" as const,
    },
  ],
  closing:
    "Your competitors are re-running this arithmetic this week too. Our view is that the advantage will not go to whoever has the cheapest factory. It will go to whoever can re-run the arithmetic fastest — per style, per buyer, per week — and hand the buyer the evidence behind the answer.",
};

export const constraint = {
  label: "제약 조건 · Where the constraint sits",
  headline: "We do not think the constraint is your factories. We think it is the time it takes Seoul to answer.",
  body:
    "Converting a dual-hemisphere footprint into margin means answering one question faster than the market moves: for this buyer, this style, this quantity, this week — which factory, at what fully-landed cost, with what carbon and compliance evidence attached?",
  today: [
    "The inputs already exist: duty treatment by origin, GSDCost standard-minute data, factory capacity, lead time, freight, buyer requirements.",
    "They live in different systems, in different countries, in four languages, and increasingly across stacks that arrived with Ssangyong in 2022 and Tegra in 2024.",
    "So the answer is assembled by hand, by experienced people, and it takes days — by which time the question has often moved.",
  ],
  careful:
    "We want to be precise about this, because it would be easy to hear it as criticism of your team. It is the opposite. Your people are doing genuinely sophisticated commercial reasoning on top of manual assembly work. We are proposing to remove the assembly, not the judgement.",
  claim: "to confirm" as Claim,
};

export const clocks = [
  {
    title: "The trade regime",
    titleKo: "관세",
    detail:
      "Section 122 expired 24 July 2026. The Section 301 successor proposes 10–12.5% across 46+ economies with no expiry, while CAFTA-DR apparel stays duty-free.",
    horizon: "Already in effect",
    soWhat: "Landed-cost modelling has to move from an annual planning artefact to something you can query on any given Tuesday.",
    claim: "confirmed" as Claim,
  },
  {
    title: "Your buyers' Scope 3 requirements",
    titleKo: "바이어 ESG",
    detail:
      "Walmart passed its 1-gigaton Project Gigaton goal six years early and has refocused on deeper Scope 3 reduction, with a raised disclosure bar for top-tier supplier recognition across 6,800+ participating suppliers. Target has publicly increased its Guatemala sourcing under tariff pressure.",
    horizon: "Now, and tightening annually",
    soWhat:
      "Emissions and traceability data quality has stopped being a CSR report and become a commercial term in a bidding conversation.",
    claim: "confirmed" as Claim,
  },
  {
    title: "The EU Digital Product Passport",
    titleKo: "EU 디지털 제품 여권",
    detail:
      "The ESPR working plan indicates a 2027 delegated act for textiles, with application realistically from around 2028. Current designs contemplate roughly 126 structured data points per product, of which 25–30 are consumer-visible.",
    horizon: "~2028, but the data takes years to collect",
    soWhat:
      "Brands that began piloting in 2024–25 are already finding costly gaps. The manufacturer who can already emit structured product-level provenance becomes the easy answer when brands scramble.",
    claim: "confirmed" as Claim,
  },
  {
    title: "Korea's AI Basic Act",
    titleKo: "AI 기본법",
    detail:
      "The Act and its Enforcement Decree took effect on 22 January 2026 and apply to businesses that use AI, not only those that build it. MSIT is operating a grace period of at least one year through 2026.",
    horizon: "In force; grace period through 2026",
    soWhat:
      "Governance configured during the grace period is inexpensive. Governance retrofitted in 2027 is not, and it lands during enforcement rather than before it.",
    claim: "confirmed" as Claim,
  },
];

export const businessUnderstanding = {
  label: "저희가 이해한 바 · What we understand about your business",
  headline: "Five business systems, one owner, one balance sheet",
  body:
    "Global Sae-A is privately held, so what follows is drawn from public reporting and from what your team has told us. We have marked our confidence on each. Corrections tomorrow are genuinely useful to us.",
  pillars: [
    {
      name: "Sae-A Trading",
      nameKo: "세아상역",
      role: "Apparel OEM/ODM — the origin of the group and its cash engine",
      facts: [
        "The world's largest apparel manufacturer and exporter, founded 1986",
        "41 factories, 25 local offices, 10 countries, 4 continents",
        "Approximately 2.5 million garments produced per day",
        "Buyers include Walmart, Target, Kohl's and Gap",
        "Vertically integrated from yarn through fabric, dyeing and finishing to garment",
      ],
      claim: "confirmed" as Claim,
      accent: "#0047A0",
    },
    {
      name: "Win Textile · Sae-A Spinning · Swisstex · Tegra",
      nameKo: "원단·방적·염색·중미",
      role: "Upstream materials and Central American capacity",
      facts: [
        "Yarn and fabric supplied into your own garment network",
        "Swisstex covers dyeing and finishing — the most energy- and water-intensive step",
        "Tegra, acquired 2024, added sports-apparel capacity in Central America",
        "This integration is why your certified-content claims can be evidenced end to end rather than negotiated with third parties",
      ],
      claim: "confirmed" as Claim,
      accent: "#00897B",
    },
    {
      name: "Ssangyong E&C",
      nameKo: "쌍용건설",
      role: "Construction — acquired December 2022, now the group's growth story",
      facts: [
        "2025 revenue of KRW 1.83 trillion, up approximately 23.3% year on year",
        "2025 operating profit of approximately KRW 60 billion",
        "Order backlog grown from USD 4.7B in 2022 to USD 6.7B in 2025",
        "Overseas orders up roughly eightfold, from USD 121M to USD 650M",
        "Completed the USD 220M ASML Hwaseong Campus; won Avenue Park Towers in Dubai at USD 250M",
        "Approximately 6,000 apartment units planned for delivery in 2026",
      ],
      claim: "confirmed" as Claim,
      accent: "#CD2E3A",
    },
    {
      name: "Tailim Packaging · Jeonju Paper",
      nameKo: "태림포장·전주페이퍼",
      role: "Paper and packaging — domestic, energy-intensive, cash-generative",
      facts: [
        "A leading Korean position in comprehensive paper and corrugated packaging",
        "More than 20 domestic mills across the platform",
        "Steam and electricity are the dominant controllable cost line",
        "Boiler and line reliability drives both cost and your Net-Zero trajectory",
      ],
      claim: "confirmed" as Claim,
      accent: "#E37400",
    },
    {
      name: "Valmax · Sae-A STX Entech · IN THE F",
      nameKo: "그린에너지·EPC·패션",
      role: "Green energy, EPC and domestic fashion retail",
      facts: [
        "Valmax positions the group in green energy",
        "Sae-A STX Entech operates as a global EPC business",
        "IN THE F carries own-brand fashion retail exposure",
        "Together these give the group both supply-side and demand-side sustainability assets",
      ],
      claim: "confirmed" as Claim,
      accent: "#7B61FF",
    },
  ],
  strengths: [
    {
      title: "You already quantify industrial engineering",
      detail:
        "Your adoption of Coats Digital's GSDCost for standard-minute benchmarking across factories matters more than it might appear. It means you already have a structured, cross-factory dataset about how long work actually takes. Most manufacturers we speak to do not, and it is the natural seed for a costing and allocation capability.",
      claim: "confirmed" as Claim,
    },
    {
      title: "Vertical integration makes your evidence yours",
      detail:
        "Traceability claims that most manufacturers must negotiate across third parties, you can assert from your own operations. The data exists inside the group. It is simply not joined up yet.",
      claim: "confirmed" as Claim,
    },
    {
      title: "Two acquisitions in four years means several stacks",
      detail:
        "Ssangyong in 2022 and Tegra in 2024 will have brought their own systems. We assume this rather than know it, and it is the single most important thing for us to understand correctly on 14 August — because it determines whether we propose reading across your systems or consolidating them. We would propose the former.",
      claim: "to confirm" as Claim,
    },
  ],
};

export const departments = [
  {
    id: "sourcing",
    name: "Sourcing & Commercial",
    nameKo: "소싱·영업",
    unit: "Sae-A Trading",
    today:
      "A buyer enquiry arrives. Producing a fully-landed cost across candidate factories means gathering duty treatment, standard minutes, capacity, lead times and freight from several systems and several people, in several countries. It takes days, and the tariff inputs may change before the quote is used.",
    tomorrow:
      "The enquiry is read automatically. A ranked recommendation across candidate factories comes back with a fully-landed cost, a delivery date, and its working shown — so your commercial team spends its time on the negotiation rather than on the assembly.",
    measure: "Hours to produce a duty-inclusive quote across four candidate factories",
    accent: "#0047A0",
  },
  {
    id: "audit",
    name: "Group Internal Audit",
    nameKo: "그룹 내부감사",
    unit: "Holding company",
    today:
      "Auditing 41 factories across 10 countries means air travel and the manual review of invoices, ERP extracts and contracts in Korean, English, Spanish and Vietnamese. Coverage is necessarily sampled.",
    tomorrow:
      "The full population is read continuously in its original language. Your auditors receive a ranked exception list where every flag cites the source document, and spend their weeks on judgement rather than on reading and travel.",
    measure: "Auditor-days and travel cost per cycle; share of transactions actually reviewed",
    accent: "#A50E0E",
  },
  {
    id: "esg",
    name: "ESG & Sustainability",
    nameKo: "ESG·지속가능경영",
    unit: "Sae-A Trading · Win Textile",
    today:
      "Environmental metrics for 41 factories are consolidated manually when a buyer asks, which turns each request into a project and each deadline into a scramble.",
    tomorrow:
      "Factory-level energy, water, waste and emissions data sits in one place with its lineage intact. A buyer's question is answered the day it arrives, and the same foundation later emits the product-level record the EU passport will ask for.",
    measure: "Days to answer a buyer ESG request; data completeness across 41 factories",
    accent: "#188038",
  },
  {
    id: "construction",
    name: "Ssangyong E&C",
    nameKo: "쌍용건설",
    unit: "Construction",
    today:
      "Overseas orders have grown roughly eightfold since 2022, into Dubai and Equatorial Guinea among others, while senior engineers approach retirement. Method statements, claims history and hard-won lessons live in project archives and in individuals.",
    tomorrow:
      "A project engineer abroad asks what the group learned on the last comparable structure and receives a cited answer drawn from decades of Korean project records, in the language they work in, in under a minute.",
    measure: "Rework and claim incidence on overseas projects; time to answer a technical query",
    accent: "#CD2E3A",
  },
  {
    id: "paper",
    name: "Tailim & Jeonju Paper",
    nameKo: "태림·전주페이퍼",
    unit: "Paper and packaging",
    today:
      "Steam and electricity dominate controllable cost across more than 20 domestic mills, and unplanned boiler or line downtime is expensive in both cash and carbon.",
    tomorrow:
      "Boiler and machinery behaviour is forecast rather than observed, and the energy plan is written against the coming tariff structure rather than last month's invoice.",
    measure: "Unplanned downtime hours; energy cost per tonne of output",
    accent: "#E37400",
    note: "This depends on historian-grade operational data we have not yet seen. If that foundation is not in place, this is a 2027 conversation and we would rather say so now.",
  },
  {
    id: "group",
    name: "Group Functions",
    nameKo: "그룹 스태프",
    unit: "Strategic Planning · HR · IT",
    today:
      "Institutional knowledge across apparel, construction and paper sits in mail, shared drives and long tenure. Finding what the group already knows is often harder than deciding what to do with it.",
    tomorrow:
      "Grounded search across the group's documents, and — importantly — colleagues in planning, HR and administration building their own simple agents without waiting for IT. This is the pattern that turns licences into actual adoption.",
    measure: "Weekly active users outside IT; agents built by non-technical colleagues",
    accent: "#4285F4",
  },
];

export const whyGoogle = {
  label: "왜 구글 클라우드인가 · Why Google Cloud",
  headline: "Your problem is multilingual, multi-system and multi-country. That is a narrower requirement than it sounds.",
  reasons: [
    {
      title: "Reasoning across systems, not just inside documents",
      detail:
        "The questions that cost you time span your ERP, your factory records, your buyer correspondence and your contracts at once. Assistance inside a single document is genuinely useful, but it is not the same capability.",
    },
    {
      title: "Four languages, ten countries, two acquired stacks",
      detail:
        "Korean, Spanish, Vietnamese and English across contracts, invoices and factory records — and increasingly Arabic as Ssangyong's overseas backlog grows. Grounded answers with citations across that estate is the actual requirement.",
    },
    {
      title: "Agents built by the people who do the work",
      detail:
        "Adoption compounds when planning, HR and administrative colleagues can build their own automations, and stalls when everything must queue behind a central team.",
    },
    {
      title: "Governance configured from the start",
      detail:
        "Transparency, logging and audit trails aligned to Korea's AI Basic Act, set up during the grace period rather than retrofitted afterwards. Your enterprise data used for grounding is not used to train foundation models.",
    },
  ],
  honesty: {
    title: "Where we are not the right answer",
    points: [
      "If the work genuinely lives inside your existing productivity documents and nowhere else, the assistant already bundled with that suite may serve you better and more cheaply. We would say so.",
      "We are not proposing to replace or consolidate your ERP. That is a multi-year programme with no AI dependency and we do not think it should be in this conversation.",
      "We are not proposing a group-wide data platform before value is proven. Building one first is the most reliable way we know to spend two years and demonstrate nothing.",
    ],
  },
};

// ---------------------------------------------------------------------------
// The Google Cloud AI story, told for a manufacturer rather than for a
// technology audience. Product naming reflects Google Cloud Next '26: Vertex AI
// was retired as a brand and its capabilities now sit in the Gemini Enterprise
// Agent Platform.
// ---------------------------------------------------------------------------

export const googleStory = {
  label: "구글 클라우드 AI · The Google Cloud AI story",
  headline: "Four layers, one owner — and the reason that matters to you is cost per answer",
  standfirst:
    "Most AI vendors assemble their stack from other people's parts. Google designs the chip, trains the model, runs the platform and ships the interface. We would not raise this as an engineering boast; we raise it because it is what decides whether reading every invoice across 41 factories is an affordable habit or an expensive pilot.",
  layers: [
    {
      n: "01",
      layer: "Silicon",
      name: "Ironwood TPUs",
      detail:
        "Google's seventh-generation inference chip, announced with roughly 80% better price-performance on inference than the prior generation.",
      soWhat:
        "Inference is the recurring cost of an agent that reads continuously. This is the layer that determines whether 'audit the whole population' stays affordable at 41 factories rather than at four.",
    },
    {
      n: "02",
      layer: "Models",
      name: "Gemini",
      detail:
        "Frontier models with long context and native multimodality — able to work across Korean, Spanish, Vietnamese and English text, tables, scans and images in a single pass.",
      soWhat:
        "Your document estate is not one language and not one format. A model that handles a scanned Spanish invoice and a Korean contract in the same request removes an entire integration layer.",
    },
    {
      n: "03",
      layer: "Agent platform",
      name: "Gemini Enterprise Agent Platform",
      detail:
        "Formerly Vertex AI, renamed at Google Cloud Next '26. Agent Studio for building, plus Agent Registry, Agent Identity, Agent Gateway and Agent Observability for running agents in production.",
      soWhat:
        "The difference between a demonstration and an operating system is knowing which agents exist, what they may touch, and what they did. That governance layer is the part that lets an internal auditor trust the output.",
    },
    {
      n: "04",
      layer: "Where people already are",
      name: "Gemini Enterprise and Workspace",
      detail:
        "The interface your colleagues use, connected to the systems underneath rather than sitting beside them.",
      soWhat:
        "Adoption is not a training problem, it is a proximity problem. Capability that requires people to go somewhere else does not get used.",
    },
  ],
  touches: {
    title: "What Sae-A would actually touch, and when",
    items: [
      {
        phase: "Phase 1 — 60 days",
        what: "Gemini Enterprise",
        detail:
          "Grounded search and agents over the documents you already trust. No schema changes, no migration, no platform team required from you.",
      },
      {
        phase: "Phase 2 — Q4 2026",
        what: "Gemini Enterprise at scale, plus Agent Platform governance",
        detail:
          "1,000 seats across your Korean offices, with the agent registry, identity and observability configured inside the AI Basic Act grace period.",
      },
      {
        phase: "Phase 3 — Q1 2027",
        what: "BigQuery, Looker and the Agent Platform",
        detail:
          "The environmental and traceability foundation your buyers and the EU passport timeline require — built after adoption is proven, not before.",
      },
    ],
  },
  openness: {
    title: "This is not a closed bet",
    detail:
      "Agent2Agent (A2A) and the Model Context Protocol (MCP) are open protocols, not Google formats. They are how an agent reaches an ERP, a factory system or a partner tool that Google does not own — which is most of your estate. If you later decide to run part of this elsewhere, the agents you build do not become stranded assets.",
  },
  dataHandling: {
    title: "Your data",
    points: [
      "Enterprise data used for grounding is not used to train foundation models.",
      "Regional data handling, access controls and audit logging are configured to your requirements during phase one.",
      "Every grounded answer cites its source document, so a person can check the system rather than trust it.",
      "Your Group CTO is a co-author of that design, not a recipient of it.",
    ],
  },
};

export const references = {
  label: "레퍼런스 · What this has looked like elsewhere",
  headline: "Five references, chosen because they answer a question you are likely to ask",
  standfirst:
    "We have deliberately not listed everything Google Cloud has done. These are the deployments that speak to a specific doubt about doing this at Global Sae-A — a manufacturer, in Korea, with a conservative cost posture and non-technical staff.",
  items: [
    {
      customer: "GE Appliances",
      geography: "United States",
      headline: "800+ agents across manufacturing, logistics and supply chain",
      detail:
        "Gemini Enterprise embedded into GE Appliances' own Brilliant Factory manufacturing data platform, which tracks production performance, part genealogy and workforce activity across lines, shifts and plants. Their Supplier Collaboration Agent handles communication with more than 600 suppliers and automated order-status enquiries.",
      outcome: "25% reduction in backorders from the supplier collaboration agent alone",
      answers:
        "The doubt this addresses: can agents work on top of an existing manufacturing data platform rather than replacing it? GE Appliances did not rebuild their systems. They put agents over what they had — which is exactly what we are proposing for your ERP estate, and their supplier-communication result maps directly onto your order-change problem.",
      date: "Announced 22 April 2026",
      accent: "#0047A0",
    },
    {
      customer: "Samsung Electronics, DX division",
      geography: "Korea, global workforce",
      headline: "Approximately 50,000 employees worldwide",
      detail:
        "Gemini Enterprise deployed across the Device eXperience division globally, delivered with Samsung SDS as the implementation partner. Characterised by Google Cloud as the largest agentic AI adoption in the Korean market.",
      outcome: "The largest agentic AI deal in Korea to date",
      answers:
        "The doubt this addresses: is this proven with a Korean conglomerate that watches cost closely? Samsung could have built this internally and chose not to. The stated reason was that it lets non-technical employees build their own agents.",
      date: "Announced 13 July 2026",
      accent: "#CD2E3A",
    },
    {
      customer: "CJ Olive Young",
      geography: "Korea",
      headline: "Gemini Enterprise across all employees",
      detail:
        "Non-developer staff — merchandise planners and marketing managers — build their own AI tools for work previously done manually, including market research and customer data analysis.",
      outcome: "Adoption driven by non-technical staff building their own tools",
      answers:
        "The doubt this addresses: will people who are not engineers actually use this? Olive Young's merchandisers are a close analogue to your planning, sourcing and marketing colleagues, and it is the pattern behind the adoption measure we propose to be judged on.",
      date: "Announced April 2026",
      accent: "#188038",
    },
    {
      customer: "KakaoBank · Daewon Pharmaceutical · Weverse · Yanolja",
      geography: "Korea",
      headline: "Adoption across finance, healthcare, media and travel",
      detail:
        "A widening base of Korean enterprises adopting Google Cloud AI across regulated and consumer-facing industries.",
      outcome: "Korea is no longer early-adopter territory for this",
      answers:
        "The doubt this addresses: are we taking a risk our peers are not taking? In the Korean market this has moved from experiment to procurement in roughly eighteen months.",
      date: "Through 2026",
      accent: "#7B61FF",
    },
    {
      customer: "LG CNS",
      geography: "Korea",
      headline: "Google Cloud Partner of the Year 2026 for Korea",
      detail:
        "Has built hundreds of generative AI services across manufacturing, finance, retail, telecommunications and the public sector on Gemini and the Google Cloud AI platform.",
      outcome: "Delivery capability inside Korea, not flown in",
      answers:
        "The doubt this addresses: who actually does the work, and are they here? The partner-delivered model — the one behind the Samsung rollout — means the team in the room on 14 August is the team that delivers.",
      date: "Awarded 2026",
      accent: "#E37400",
    },
  ],
  caveat:
    "Every figure above is from public announcements by Google Cloud or the customer, and each is another company's result achieved in their circumstances. We have not adjusted any of them to flatter a projection for Sae-A, and we would not ask you to plan against them. The only numbers we would ask you to plan against are the ones we measure together in the sixty days.",
};

export const notProposing = {
  label: "제안하지 않는 것 · What we are not proposing",
  headline: "This is a programme for roughly 2,000 people in Seoul, not for 70,000",
  body:
    "We want to be explicit about the boundary before anyone asks, because the honest answer makes the proposal smaller rather than larger.",
  items: [
    {
      title: "Not 70,000 seats",
      detail:
        "Approximately 68,000 of your 70,000 colleagues are factory and field workers, for whom a seat-based knowledge assistant is simply the wrong tool. The population this addresses is your Korean office staff, and the Q4 proposal is 1,000 seats — around half of them.",
    },
    {
      title: "Not an ERP consolidation",
      detail:
        "A multi-year integration programme with no AI dependency. Everything we propose reads across the systems you already run, without schema changes or data migration.",
    },
    {
      title: "Not a data platform first",
      detail:
        "The environmental data foundation matters, which is why it is sequenced for Q1 2027 — after the work that earns it, not before.",
    },
    {
      title: "Not agents that evaluate people",
      detail:
        "Employment is a high-impact category under Korea's AI Basic Act, and it is not where the value is. Phase one keeps HR use to retrieval and drafting.",
    },
  ],
};

export const jointRisks = [
  {
    risk: "The workshop becomes a demonstration rather than a working session",
    design:
      "We have designed 14 August to produce one signed page — a metric, an owner and a date — rather than a list of possibilities. If we arrive with a capability tour, hold us to this.",
  },
  {
    risk: "The data is not clean enough for what we propose",
    design:
      "Phase one deliberately works over documents your teams already trust — contracts, invoices, audit files, standard-minute outputs — rather than over data that must first be cleaned. What it surfaces will also tell you which data is worth cleaning first.",
  },
  {
    risk: "Licences are deployed and nobody uses them",
    design:
      "Weekly active use outside IT is the headline measure, not seats deployed. We would run an agent-building session with your planning, HR and administrative colleagues inside the sixty days rather than after them.",
  },
  {
    risk: "It works, and then it does not scale past the pilot",
    design:
      "Both phase-one workstreams were chosen because they generalise: audit extends from one cycle to all 41 factories on the same design, and allocation extends from one buyer programme to the rest.",
  },
  {
    risk: "Regulatory exposure arrives with adoption",
    design:
      "Transparency notices, logging and high-impact category handling are configured during phase one, inside the AI Basic Act grace period, and are part of the programme rather than a later invoice.",
  },
  {
    risk: "The commitment grows beyond what was agreed",
    design:
      "Sixty days, one metric, pre-agreed exit conditions, and a stated seat ceiling. If the metric does not move, the programme stops and the finding is yours.",
  },
];

export const commitments = {
  label: "저희의 약속 · What we commit",
  headline: "Named people, named dates",
  items: [
    { what: "AX Workshop, run as a working session", who: "Google Cloud Korea AI specialist team", when: "14 August 2026" },
    { what: "Delivery partner named, so the workshop team is the delivery team", who: "Google Cloud Korea", when: "Before 14 August" },
    { what: "Sixty-day proof on audit and allocation, weekly checkpoints", who: "Google Cloud customer engineering", when: "September – October 2026" },
    { what: "Country Director engagement", who: "Ruth Sun, Country Director, Google Cloud Korea", when: "September – October 2026" },
    { what: "Executive review of measured results with your leadership", who: "Harsha Konduri, MD, JAPAC AI GTM", when: "November 2026" },
  ],
  ask: {
    headline: "What we are asking for tomorrow",
    body: "Not the Q4 decision. Not a platform commitment. Three things:",
    items: [
      "Confirmation of 14 August, and one buyer programme and one audit cycle chosen in advance as the working material",
      "One named owner from your side at roughly half-time for sixty days, plus two hours a week from four business users",
      "Agreement on the single number we will be measured against, set on 14 August and reported on 31 October",
    ],
  },
};

export const faq = [
  {
    q: "Why move now rather than in two years?",
    a: "Because three clocks are already running and none of them are set by you: the Section 301 transition following Section 122's expiry on 24 July, your buyers' escalating Scope 3 expectations, and the EU Digital Product Passport arriving around 2028 on data that takes years to accumulate. Moving now costs a bounded sixty days. Moving in two years means moving to someone else's deadline.",
  },
  {
    q: "We have invested in enterprise systems before without seeing the return. Why would this be different?",
    a: "Because the first commitment is small and reversible. One thousand seats, one buyer programme, one audit cycle, sixty days, and one metric agreed before any engineering starts. Phase one requires no schema changes, no data migration and no new platform team on your side. If the metric does not move, you stop — having spent less than a single overseas audit round.",
  },
  {
    q: "Does this reduce headcount?",
    a: "That is not the design and not the case we are making. You are absorbing more order volatility, more overseas construction and more buyer compliance work than you were three years ago, with broadly the same Seoul headcount. The objective is capacity for that growth. We are also explicitly not proposing agents that evaluate or select people.",
  },
  {
    q: "How does this help us specifically with Walmart and Target?",
    a: "Two ways. Speed: a duty-inclusive quote across candidate factories assembled before a call ends rather than days after it. And evidence: buyer ESG data requests answered the day they arrive from a foundation with its lineage intact, rather than through a manual consolidation each time. Buyers tend to reward the supplier who reduces their own workload.",
  },
  {
    q: "What about our factory colleagues — do they get this?",
    a: "Not in this programme, and we would advise against paying for it. Approximately 68,000 of your 70,000 colleagues are factory and field workers for whom a seat-based assistant is the wrong tool. Value for them comes later and differently — vision-based safety support on Ssangyong sites, predictive maintenance in the mills — and those need different data foundations.",
  },
  {
    q: "How do we stay compliant with Korea's AI Basic Act?",
    a: "By configuring governance during phase one, within the grace period MSIT is operating through 2026, rather than retrofitting it in 2027. In practice that means transparency notices where colleagues interact with AI, logging and audit trails, and keeping phase-one HR use to retrieval and drafting rather than evaluation.",
  },
  {
    q: "What happens to our data?",
    a: "Enterprise data used for grounding is not used to train foundation models. Regional data handling, access controls and audit logging are configured to your requirements during phase one, with your Group CTO as a co-author of that design rather than a recipient of it.",
  },
  {
    q: "Why not build this ourselves, or with a Korean provider?",
    a: "Korean-language capability is not the differentiating requirement for your problem — your document estate is Korean, Spanish, Vietnamese and English across ten countries and two acquired stacks, and increasingly Arabic. Building in-house would require a platform team you have not told us you want to create. The partner-delivered model gives you Korean delivery with Google engineering behind it.",
  },
  {
    q: "What does success look like on 31 October?",
    a: "Four numbers, agreed with you on 14 August and measured weekly: auditor-days and travel cost avoided on one real audit cycle; hours-to-quote on one buyer programme; weekly active users outside IT; and the number of agents built by colleagues who do not work in IT.",
  },
  {
    q: "What if it does not work?",
    a: "Then we will have told you so by 31 October, with your own data rather than our references, and you will have spent a bounded amount finding out. We would rather be trusted with the second decision than oversold on the first.",
  },
];
