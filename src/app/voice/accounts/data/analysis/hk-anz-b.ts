import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_HK_ANZ_B: Record<string, ProfileAnalysis> = {
  "kiwibank": {
    operatingContext:
      "Kiwibank is New Zealand's Crown-owned challenger bank, positioned explicitly as the locally owned alternative to the four Australian-owned majors that dominate NZ retail banking. It serves roughly a million-plus personal customers plus a growing business and home-lending book, and its growth strategy is built on winning mortgage share rather than on branch density. Its distribution shifted decisively to digital and phone after the historical NZ Post PostShop counter arrangement wound down, which concentrates servicing into app, internet banking, and NZ-based contact centres. Onshore, New Zealand-staffed service is part of the brand promise, which makes every additional call a genuine cost and a genuine brand asset at the same time.",
    strategicPressure: [
      { text: "New Zealand's Commerce Commission market study into personal banking concluded competition was weak and pointed to strengthening Kiwibank as a disruptive challenger, putting national policy weight behind its growth mandate", kind: "verified" },
      { text: "The Government has publicly explored bringing outside capital into Kiwibank so it can scale against the majors, meaning growth targets are political as well as commercial", kind: "verified" },
      { text: "Mortgage-led growth loads the service operation asymmetrically: application-status contacts scale with new lending volume long before the revenue arrives, so cost-to-serve rises ahead of income", kind: "inference" },
      { text: "Its onshore-only service brand blocks the offshore-outsourcing lever the majors have used, leaving automation as the only material capacity lever available to it", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Kiwibank is a sub-scale bank by trans-Tasman standards with a technology budget consumed by core modernization, regulatory change, and digital-channel parity rather than by novel platform engineering. There is no public evidence of an internal conversational-AI research capability of the kind ANZ, CBA, or Westpac maintain, and Crown ownership favours procured, auditable, vendor-supported capability over experimental in-house builds.",
    whyNotBuild:
      "Building would mean owning New Zealand-accented English and te reo place-name speech recognition, telephony integration into the existing contact-centre estate, orchestration into core banking and origination, and an evaluation regime robust enough to satisfy the Reserve Bank of New Zealand and the bank's own conduct obligations. Kiwibank's engineering capacity is committed to core banking and digital channels; a four-layer conversational stack is a multi-year distraction from the mortgage-share mandate that defines its strategy.",
    workflows: [
      {
        name: "Home-loan application status and document chase",
        friction: "Applicants and their brokers call repeatedly for progress because the origination pipeline emits no proactive updates, and a missing payslip or bank statement can sit unnoticed for days before anyone chases it",
        outcome: "Status contacts suppressed by proactive milestone updates, conditions cleared faster, and approval-to-settlement time reduced during the growth push",
        channels: ["Voice", "SMS", "Mobile app", "Email"],
        systems: ["Loan origination system", "Document management", "CRM", "Broker portal"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Everyday-banking inbound servicing",
        friction: "Card blocks, disputed transactions, payment limits, and internet-banking lockouts queue behind complex lending calls in a single NZ-based contact centre, so simple requests carry a full onshore agent cost",
        outcome: "Routine servicing resolved in-conversation at any hour, with NZ-based agents redeployed onto lending and business banking conversations that actually generate revenue",
        channels: ["Voice", "In-app chat", "Web chat"],
        systems: ["Core banking", "Card management", "CRM", "Fraud case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Financial-hardship and arrears first contact",
        friction: "Customers in difficulty avoid calling until arrears are advanced, and when they do the first conversation is a scripted data-collection exercise before any human judgement is applied",
        outcome: "Earlier, lower-stigma disclosure through a non-judgemental channel, with structured hardship information captured and warm-handed to a trained specialist for the actual decision",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Collections system", "Core banking", "Hardship case management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Mobile banking app and internet banking with self-service payments, card controls, and statements",
        "A New Zealand-based contact centre estate handling personal, business, and lending calls",
        "Broker-facing channels supporting the mortgage-adviser distribution that drives home-lending growth",
        "Website help content and an FAQ-style assisted-search layer for common product questions",
      ],
      gaps: [
        "No proactive, conversational tracking of a home-loan application from submission through to settlement",
        "No voice channel that can authenticate a caller and complete an action without an agent",
        "No after-hours capability for anything beyond card blocking, so evening and weekend demand simply waits",
        "No structured, low-friction front door for hardship disclosure that captures information before a specialist call",
      ],
    },
    risks: [
      "Crown ownership means procurement is scrutinised and any perception of automating away New Zealand jobs is a live political risk that must be reframed as capacity redeployment",
      "The Privacy Act 2020 governs collection, use, and cross-border disclosure of customer information, and New Zealand's emerging consumer data right regime adds portability and consent obligations in banking first",
      "Conduct obligations under the CoFI regime require demonstrable fair treatment of customers, especially vulnerable ones, so hardship conversations need auditable human decision points",
    ],
    economics: {
      volumeMonthly: 420000,
      costPerInteraction: 6.5,
      automationRate: 0.5,
      basis: "Seller assumptions only: volume inferred from a retail customer base above one million at typical NZ retail-bank contact rates, cost reflecting fully loaded onshore New Zealand contact-centre labour, automation rate assuming status, balance, and card workflows automate while lending advice and hardship stay human. Validate all three in discovery.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating home-loan application status and outstanding-document chase across voice and SMS for a single origination channel, integrated to the loan origination system and CRM, with a measured reduction in inbound status calls per application as the success criterion.",
    expansion: [
      "Extend to everyday-banking inbound servicing across card controls, disputes, and internet-banking access with full core-banking grounding",
      "Add business-banking service desk workflows for SME account holders including payment queries and merchant servicing",
      "Introduce hardship and arrears first-contact triage with mandatory human decision points and CoFI-aligned evidence capture",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Customer Officer / General Manager Customer Experience",
      "Chief Technology Officer",
      "General Manager Home Lending",
      "Chief Risk Officer",
    ],
    discovery: [
      "How many inbound contacts does a single home-loan application generate between submission and settlement today, and what does that cost you per application?",
      "Your onshore service promise is a brand asset — how does the executive team frame automation against it internally, and what language would make it safe?",
      "What proportion of contact-centre volume is card, balance, and status work that a customer would rather not have called about at all?",
      "Under CoFI, what evidence does your risk function require before an automated conversation can take place with a customer showing signs of financial difficulty?",
    ],
    flowTemplate: "onboarding",
    scenario: "A first-home buyer asks Kiwibank at 9pm whether their loan application is approved, and gets the live pipeline status plus the one document still outstanding.",
  },

  "asb-bank": {
    operatingContext:
      "ASB is one of New Zealand's largest retail and business banks, owned by Commonwealth Bank of Australia but run as an operationally distinct New Zealand institution with its own brand, licence, and contact-centre estate. It serves a broad personal customer base plus rural and business banking, and has cultivated a long-standing reputation as a digital-service leader in the New Zealand market, including early investment in virtual-assistant and chat capability. Its customers reach it through the ASB mobile app and FastNet internet banking, a branch network under continual consolidation, and New Zealand-based phone teams. Because CBA has become one of the most aggressive internal AI builders in Australian banking, ASB sits in the unusual position of being both digitally capable and downstream of a parent roadmap it does not set.",
    strategicPressure: [
      { text: "CBA has publicly positioned itself as an AI-forward bank with substantial internal build and named global technology partnerships, so ASB's conversational roadmap is shaped by decisions made in Sydney", kind: "verified" },
      { text: "The Commerce Commission's personal banking study intensified political and regulatory scrutiny of the Australian-owned majors in New Zealand, raising the cost of visible service failures", kind: "verified" },
      { text: "Group-built assistants trained on Australian products, terminology, and regulation do not transfer cleanly to New Zealand product sets, KiwiSaver, or NZ-specific lending rules, leaving genuine local gaps", kind: "inference" },
      { text: "The window for a New Zealand-specific deployment is narrow and closes as parent capability is progressively rolled across the Tasman, so timing matters more than scope here", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led, and deliberately narrow. ASB has real digital engineering capability and, more importantly, access to a parent with heavy internal AI investment, so it is not a candidate for a wholesale platform purchase. The credible commercial position is a partner engagement targeting New Zealand-specific servicing that the group roadmap either cannot cover or will not prioritise, sequenced ahead of the parent's rollout.",
    whyNotBuild:
      "ASB will not build independently because duplicating group capability is the fastest way to lose a technology budget argument with a parent. What it also will not get from the parent, quickly, is New Zealand English and te reo-inflected speech handling, KiwiSaver and NZ lending workflows, and integration into its own local contact-centre telephony. That gap is a partnership, not a build, and it needs to be framed as complementary to the group roadmap rather than competitive with it.",
    workflows: [
      {
        name: "KiwiSaver and NZ-specific product servicing",
        friction: "KiwiSaver contribution changes, hardship withdrawals, and first-home withdrawal queries have no Australian analogue, so group-built assistants cannot answer them and every query lands on a New Zealand agent",
        outcome: "New Zealand-only product queries resolved conversationally with grounded answers, removing a volume class the parent roadmap will never address",
        channels: ["Voice", "In-app chat", "Web chat"],
        systems: ["KiwiSaver administration platform", "Core banking", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Rural and agribusiness banking service desk",
        friction: "Farming customers call from the field with seasonal-facility, overdraft-limit, and payment-timing questions, and reach a general queue with no context on their facility structure or season",
        outcome: "Rural customers served in-conversation on facility position and payment timing, with relationship managers freed for the credit conversations that actually need them",
        channels: ["Voice", "SMS", "Mobile app"],
        systems: ["Business banking core", "Facility management", "CRM"],
        value: 2,
        complexity: 3,
      },
      {
        name: "Peak-period retail inbound overflow",
        friction: "Card fraud waves, outages, and rate-change announcements produce demand spikes that a fixed onshore roster cannot absorb, so wait times blow out exactly when reputational exposure is highest",
        outcome: "Elastic capacity that absorbs spikes without roster changes, keeping wait times stable through the events that generate media attention",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Core banking", "Card management", "Contact-centre platform", "Incident management"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A well-regarded mobile banking app and FastNet internet banking with broad self-service coverage",
        "Existing virtual-assistant and chat capability on digital channels, developed over several years",
        "New Zealand-based contact centres serving personal, business, and rural customers",
        "Access to parent-group AI platform investment and technology partnerships through CBA",
      ],
      gaps: [
        "No voice-channel automation that can authenticate and act, as distinct from text-based chat deflection",
        "No conversational coverage of New Zealand-only products such as KiwiSaver where group assets do not apply",
        "No context continuity when a customer moves from app chat to a phone call, so the story is retold",
        "No elastic capacity for outage and fraud-wave spikes beyond overtime and roster manipulation",
      ],
    },
    risks: [
      "Parent-group technology governance may restrict vendor selection outright, so any engagement must be validated against CBA panel and architecture standards before serious investment",
      "The Privacy Act 2020 and Reserve Bank of New Zealand outsourcing expectations constrain where New Zealand customer data may be processed and require documented resilience arrangements",
      "CoFI conduct obligations require demonstrable fair-treatment evidence, and an automated channel must produce auditable records of what customers were told",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 6.5,
      automationRate: 0.45,
      basis: "Seller assumptions requiring validation: volume estimated from a large New Zealand retail and business franchise at typical contact rates, cost reflecting onshore New Zealand labour, and a conservative automation rate acknowledging that existing digital self-service has already removed the easiest volume.",
    },
    pilotScope:
      "An eight-week pilot covering KiwiSaver servicing queries on voice and chat, grounded in the KiwiSaver administration platform, chosen precisely because it is New Zealand-specific and therefore outside any plausible group roadmap.",
    expansion: [
      "Extend voice automation to core retail servicing where it complements rather than duplicates group-built chat capability",
      "Add the rural and agribusiness service desk with facility-level grounding for seasonal lending customers",
      "Introduce elastic overflow capacity for outage, fraud-wave, and rate-announcement demand spikes",
    ],
    stakeholders: [
      "Executive General Manager Technology and Operations",
      "General Manager Customer Experience",
      "Head of Contact Centres",
      "Executive General Manager Retail Banking",
      "Chief Risk Officer",
    ],
    discovery: [
      "Which parts of CBA's AI capability are actually committed to ASB deployment with dates, and which remain aspirational?",
      "What share of your contact volume concerns products that exist only in New Zealand and therefore cannot be served by group-built assets?",
      "Your existing chat capability deflects text — what happens to the same customer when they pick up the phone instead?",
      "How does your risk function distinguish a group-approved AI capability from a locally procured one in its approval process?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An ASB customer asks about a KiwiSaver first-home withdrawal and gets a grounded answer no Australian-built assistant could give.",
  },

  "bnz": {
    operatingContext:
      "Bank of New Zealand is one of the country's big-four banks, owned by National Australia Bank but operating with its own brand, licence, and locally run distribution across retail, wealth, and a notably strong small-business and agribusiness franchise. It serves customers through the BNZ app and internet banking, a consolidating branch and business-partner network, and New Zealand-based contact centres. Its SME position is the differentiator: business customers generate materially more service contacts per account than retail customers because payments, merchant facilities, lending drawdowns, and account administration all create phone traffic. Group technology direction comes from NAB, but the SME servicing layer is distinctly a New Zealand operating problem.",
    strategicPressure: [
      { text: "The Commerce Commission's personal banking market study put sustained public and political pressure on the Australian-owned majors operating in New Zealand, including scrutiny of service and switching friction", kind: "verified" },
      { text: "NAB group technology strategy determines platform standards for BNZ, which constrains independent purchasing but also leaves New Zealand-specific workflows systematically under-prioritised", kind: "inference" },
      { text: "SME and agribusiness customers generate far higher contact rates per account than retail customers, so BNZ's franchise strength is also its cost-to-serve concentration", kind: "inference" },
      { text: "Branch consolidation across regional New Zealand shifts business-banking servicing onto phone channels that were sized for a different distribution model", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. BNZ has competent engineering but operates inside NAB group architecture and vendor governance, so a standalone platform purchase is unlikely to survive group review. A partner engagement scoped to New Zealand business-banking servicing — workflows the group roadmap has no reason to prioritise — is the realistic commercial path, and it must be positioned as filling a local gap rather than establishing a parallel stack.",
    whyNotBuild:
      "The build question is settled at group level, not in Auckland. Even if BNZ wanted to, it would need New Zealand English speech handling, telephony integration into its local contact-centre estate, orchestration across business-banking core systems, and an evaluation framework meeting both RBNZ and NAB group standards. No New Zealand bank subsidiary carries that engineering depth alongside its regulatory-change backlog.",
    workflows: [
      {
        name: "SME banking service desk",
        friction: "Business owners call about payment failures, transaction limits, merchant settlement timing, and account administration during their own trading hours, and wait in a queue sized for retail demand patterns",
        outcome: "Business servicing resolved in-conversation outside banker hours, protecting the relationship-banking time that actually wins and retains SME customers",
        channels: ["Voice", "In-app chat", "Email"],
        systems: ["Business banking core", "Payments platform", "Merchant services", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Retail inbound deflection and card servicing",
        friction: "Card blocks, disputed transactions, limit changes, and internet-banking access resets consume onshore agent time at full cost for interactions carrying no revenue and no relationship value",
        outcome: "High-frequency retail servicing automated end-to-end with authenticated action, reducing cost per contact and eliminating queue time for simple requests",
        channels: ["Voice", "Web chat", "Mobile app"],
        systems: ["Core banking", "Card management", "Fraud case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Agribusiness seasonal facility queries",
        friction: "Rural customers ask about seasonal facility headroom, drawdown timing, and interest positions at moments driven by farm cash-flow cycles, not by contact-centre rosters",
        outcome: "Facility-level answers available on demand in the customer's own operating rhythm, with agribusiness managers reserved for credit and structure conversations",
        channels: ["Voice", "SMS"],
        systems: ["Business banking core", "Facility management", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "BNZ mobile app and internet banking with established self-service for payments and card controls",
        "New Zealand-based contact centres covering retail, business, and agribusiness customers",
        "A relationship-banker network serving SME and rural customers alongside digital channels",
        "Website help content and digital chat deflection for common product questions",
      ],
      gaps: [
        "No authenticated voice automation capable of completing a business-banking action without a human",
        "No after-hours service coverage aligned to SME trading hours rather than bank hours",
        "No conversational access to facility and payment status for business customers outside banker availability",
        "No continuity of context between digital chat, phone, and the assigned relationship banker",
      ],
    },
    risks: [
      "NAB group architecture and vendor-panel governance may constrain or veto local procurement, so group alignment is a gating item rather than a later formality",
      "The Privacy Act 2020 and RBNZ outsourcing policy govern where New Zealand banking data can be processed and require documented offshore-arrangement controls",
      "CoFI conduct obligations demand evidence of fair customer treatment, and business-lending conversations carry responsible-lending exposure if automation strays into advice",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 6.5,
      automationRate: 0.45,
      basis: "Seller assumptions to validate: volume inferred from a big-four New Zealand retail plus SME base at typical contact rates, cost based on fully loaded onshore contact-centre labour, and an automation rate assuming transactional servicing automates while lending and advice remain human.",
    },
    pilotScope:
      "An eight-to-ten week pilot delivering an after-hours SME banking service desk on voice and chat covering payment status, transaction limits, and merchant settlement queries, integrated to business-banking core and CRM.",
    expansion: [
      "Extend to retail card and internet-banking servicing with authenticated in-conversation actions",
      "Add agribusiness facility and drawdown queries with seasonal-facility grounding",
      "Introduce agent-assist for relationship bankers so business conversations start with assembled context",
    ],
    stakeholders: [
      "Chief Customer Officer",
      "Executive Partners Business and Agribusiness",
      "Chief Technology Officer",
      "Head of Customer Contact Centres",
      "Chief Risk Officer",
    ],
    discovery: [
      "How many service contacts does an average SME customer generate per month compared with a retail customer, and what does that cost you?",
      "How much of your business-banking contact volume arrives outside the hours your relationship bankers are available?",
      "What is the actual approval path for a New Zealand-specific technology purchase that sits outside the NAB group vendor panel?",
      "Where does a card dispute currently sit between the app, the contact centre, and the fraud team, and how many times does the customer explain it?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Christchurch cafe owner asks BNZ at 6am why last night's merchant settlement has not landed, and gets the answer before opening.",
  },

  "qbe-insurance": {
    operatingContext:
      "QBE is a Sydney-headquartered global commercial and specialty insurer whose Australia Pacific division writes a broad book across commercial property, liability, workers compensation, motor fleet, and rural and crop lines, distributed overwhelmingly through insurance brokers rather than direct to consumers. That broker intermediation shapes its entire service model: the highest-volume conversations are broker-initiated claims lodgement, claims status chasing, policy endorsements, and certificate-of-currency requests, not consumer calls. Its Australia Pacific operation also carries statutory schemes such as compulsory third party and workers compensation, where service standards are regulated rather than discretionary. Brokers reach QBE through portals, email, and phone, and the email-and-phone share of that mix is where the cost and the delay both live.",
    strategicPressure: [
      { text: "QBE has run sustained multi-year modernisation and simplification programmes across its divisions using major external technology partners rather than internal platform builds", kind: "verified" },
      { text: "Australian catastrophe seasons — floods, storms, hail, bushfire — drive claims-lodgement surges that fixed claims teams cannot absorb, and the surge lands on brokers first", kind: "verified" },
      { text: "Broker satisfaction is a distribution asset for an intermediated insurer, so slow claims-status response directly threatens the panel positions that generate premium", kind: "inference" },
      { text: "Statutory scheme obligations in CTP and workers compensation impose service and communication timeframes that manual processes meet only by adding headcount", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. QBE's technology strategy has consistently favoured large systems integrators and platform vendors over in-house platform engineering, and its divisional structure means Australia Pacific buys within a global architecture rather than inventing one. Claims-communications automation is an adjacency to its core underwriting and claims platforms, exactly the shape of work it habitually partners on.",
    whyNotBuild:
      "QBE's engineering investment goes into underwriting, pricing, and claims decisioning where the competitive advantage sits, not into speech recognition, telephony, or conversational orchestration. Building a broker-facing conversational stack would require Australian-accented and rural-accented speech handling, integration across multiple claims platforms inherited from years of acquisition, and an evaluation regime satisfying general-insurance conduct obligations. That is a distraction from a modernisation agenda that is already fully committed.",
    workflows: [
      {
        name: "Broker claims-status service desk",
        friction: "Brokers phone and email claims teams for status on behalf of their clients, and each request pulls a claims handler off assessment work to read a status back from a system the broker cannot see",
        outcome: "Brokers self-serve live claim status in-conversation at any hour, returning claims-handler hours to actual claims progression and lifting broker-panel standing",
        channels: ["Voice", "Email", "Broker portal chat"],
        systems: ["Claims management platform", "Policy administration", "Broker portal", "Document management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Catastrophe-event claims lodgement surge",
        friction: "A single storm or flood event multiplies lodgement volume overnight, queues blow out, and brokers lodging on behalf of multiple clients wait alongside everyone else",
        outcome: "Structured lodgement captured at any volume with policy verification and documents collected in-flow, so human assessors receive complete files rather than partial ones",
        channels: ["Voice", "Email", "Web", "SMS"],
        systems: ["Claims management platform", "Policy administration", "Document management", "Event/catastrophe management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Policy endorsement and certificate-of-currency requests",
        friction: "Routine endorsements, vehicle additions, and certificate requests arrive by email into shared inboxes and are worked manually, creating multi-day turnaround on transactions that carry no underwriting judgement",
        outcome: "Standard endorsements and certificate issuance completed conversationally within policy authority, with underwriting referrals routed only where judgement is genuinely required",
        channels: ["Email", "Voice", "Broker portal chat"],
        systems: ["Policy administration", "Underwriting workbench", "Document generation", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Broker portals providing policy and claims visibility for intermediated distribution",
        "Established claims contact teams handling lodgement and status across commercial and statutory lines",
        "Digital lodgement forms for common claim types alongside phone and email intake",
        "Catastrophe response processes with surge staffing arrangements for major weather events",
      ],
      gaps: [
        "No conversational channel that gives a broker live claims status without a human reading it from a screen",
        "No elastic intake capacity when a catastrophe multiplies lodgement volume in a single day",
        "No automated document-completeness checking at lodgement, so files arrive incomplete and cycle back",
        "No proactive status push to brokers or insureds, leaving chasing as the default behaviour",
      ],
    },
    risks: [
      "General insurance conduct obligations and the industry code of practice impose claims-handling timeframes and communication standards that any automated channel must demonstrably meet",
      "Statutory schemes in CTP and workers compensation carry regulator-set service requirements and jurisdiction-specific rules that differ by state",
      "The Privacy Act and claims data sensitivity, including injury and medical information in workers compensation and CTP, require strict handling and retention controls",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 7,
      automationRate: 0.45,
      basis: "Seller assumptions for validation: volume estimated from a commercial and statutory book served through brokers rather than direct consumers, cost reflecting specialist claims and underwriting-support labour above general contact-centre rates, and a conservative automation rate given the judgement content of commercial claims.",
    },
    pilotScope:
      "A ten-week pilot delivering a broker claims-status service desk across voice and email for one commercial line, grounded in the claims management platform, measured on claims-handler hours returned and broker status-response time.",
    expansion: [
      "Extend to catastrophe-event lodgement surge intake with in-flow document validation",
      "Add policy endorsement and certificate-of-currency automation within delegated underwriting authority",
      "Introduce proactive claim-milestone notification to brokers and insureds to suppress chasing volume entirely",
    ],
    stakeholders: [
      "Chief Executive Officer Australia Pacific",
      "Chief Claims Officer",
      "Chief Operating Officer",
      "Head of Distribution / Broker Relationships",
      "Chief Information Officer Australia Pacific",
    ],
    discovery: [
      "What proportion of inbound contact into your claims teams is status chasing rather than substantive claims progression?",
      "In the last major catastrophe event, how far did lodgement-to-first-contact time stretch, and what did surge staffing cost?",
      "Which broker complaints about QBE service appear most often in panel reviews and broker satisfaction surveys?",
      "How many claims files require a document cycle-back because lodgement was incomplete, and what does that add to cycle time?",
    ],
    flowTemplate: "claims",
    scenario: "A regional broker asks QBE for the status of a flood claim on behalf of three farming clients, and gets all three live in one conversation.",
  },

  "allianz-australia": {
    operatingContext:
      "Allianz Australia is one of the country's largest general insurers, writing motor, home, travel, and commercial lines direct, through brokers, and through significant white-label and partner arrangements with banks, motor manufacturers, and affinity groups. It is also a major compulsory third party insurer in the states where CTP is privately underwritten, which layers regulated, injury-related claims onto its consumer book. Its customers arrive through several front doors — the Allianz brand, partner brands, and broker intermediaries — and that multi-brand servicing reality means one claim event can surface across several service identities. As part of the Allianz global group, it operates within group platform standards and shared architecture decisions made in Munich.",
    strategicPressure: [
      { text: "Australia's recent sequence of major flood, storm, and hail catastrophes produced record claims volumes industry-wide and drew parliamentary and regulatory attention to insurer claims-handling performance", kind: "verified" },
      { text: "Claims handling became a financial service under Australian law, bringing insurer claims conduct under formal regulatory obligation rather than industry self-regulation alone", kind: "verified" },
      { text: "Multi-brand and white-label distribution multiplies servicing surface area, so the same operational failure appears under several brand names and several partner relationships", kind: "inference" },
      { text: "Group platform standards constrain local vendor selection, meaning any Australian deployment must be positioned as compliant with global architecture rather than as a local exception", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Allianz operates global platform standards and centralised architecture governance, so Australia does not build its own conversational platform and cannot buy freely outside group frameworks. The workable engagement is a partner-delivered claims-communications layer that sits within group-approved cloud and vendor arrangements while solving an acutely Australian problem: catastrophe surge.",
    whyNotBuild:
      "Building would require Australian-accented speech handling across a diverse migrant customer base, telephony integration into a multi-brand contact estate, orchestration across claims platforms that differ by line and by partner, and an evaluation regime demonstrating compliance with claims-handling conduct obligations. Allianz Australia's technology function is a consumer of group platforms, not a builder of them, and its local investment capacity is committed to claims and pricing modernisation.",
    workflows: [
      {
        name: "Catastrophe-event FNOL surge intake",
        friction: "A declared weather event multiplies first-notification volume within hours, hold times stretch to the point of media coverage, and customers standing in damaged homes cannot get through to lodge",
        outcome: "Every affected customer lodges a structured claim immediately in any channel with photos and details captured, so assessor deployment is prioritised from complete information rather than from the order calls were answered",
        channels: ["Voice", "SMS", "Web", "Mobile app"],
        systems: ["Claims management platform", "Policy administration", "Event/catastrophe management", "Assessor dispatch"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Proactive claims-status communication",
        friction: "Claimants call repeatedly for updates because assessment, repair scheduling, and settlement milestones produce no outbound communication, and each call reads back a status the customer could have been sent",
        outcome: "Status-chasing volume suppressed by milestone-triggered proactive updates, with claims staff returned to progressing files rather than narrating them",
        channels: ["SMS", "Voice", "Mobile app", "Email"],
        systems: ["Claims management platform", "Repairer network management", "Assessor dispatch", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Multi-brand policy servicing and renewals",
        friction: "Partner-branded and Allianz-branded customers hit different queues with different scripts for identical requests, so service quality varies by which brand a customer bought under",
        outcome: "Consistent, brand-appropriate servicing across all distribution identities from one governed policy layer, with partner-specific rules applied automatically",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Policy administration", "Partner/white-label configuration", "Billing", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Digital claims lodgement forms and a customer portal alongside phone-based FNOL",
        "Established repairer, assessor, and supplier networks with associated scheduling communications",
        "Broker and partner channels supporting white-label and affinity distribution",
        "Catastrophe response processes with surge staffing and event declaration procedures",
      ],
      gaps: [
        "No elastic voice capacity when a catastrophe event multiplies lodgement demand in a single day",
        "No proactive milestone communication that removes the need for the claimant to chase",
        "No consistent servicing experience across Allianz-branded and partner-branded customer identities",
        "No in-conversation document and photo capture that validates completeness before an assessor is dispatched",
      ],
    },
    risks: [
      "Claims handling is a regulated financial service in Australia, so automated claims conversations must meet conduct standards and produce auditable records of what was communicated",
      "The General Insurance Code of Practice sets timeframes and vulnerable-customer obligations, and catastrophe events specifically trigger heightened expectations",
      "Allianz group architecture governance and European data-handling standards constrain vendor selection and processing location for Australian customer data",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 6.5,
      automationRate: 0.5,
      basis: "Seller assumptions to test in discovery: volume estimated from a large multi-line, multi-brand Australian general insurance book, cost reflecting a mix of onshore and offshore claims and service labour, and an automation rate assuming lodgement, status, and policy servicing automate while assessment and settlement decisions stay human.",
    },
    pilotScope:
      "A ten-week pilot delivering catastrophe-event FNOL intake and proactive status updates for home and motor claims in one state, integrated to the claims platform and assessor dispatch, measured on lodgement-to-assessment time during a declared event.",
    expansion: [
      "Extend proactive status communication across all personal-lines claims nationally",
      "Add policy servicing and renewal conversations across Allianz-branded and partner-branded books",
      "Introduce broker and partner service-desk automation for commercial lines and affinity programmes",
    ],
    stakeholders: [
      "Chief General Manager Claims",
      "Chief Operating Officer",
      "Chief Information Officer",
      "Chief Customer and Marketing Officer",
      "Chief Risk Officer",
    ],
    discovery: [
      "During the last declared catastrophe, what happened to your average speed of answer, and how many customers abandoned before lodging?",
      "What share of claims-team handling time is spent reading status back to a claimant who called to ask?",
      "How much autonomy does Allianz Australia have from group architecture to select a conversational platform locally?",
      "Under the code of practice, what vulnerable-customer detection do you require before an automated conversation continues without a human?",
    ],
    flowTemplate: "claims",
    scenario: "Hours after a hailstorm crosses Brisbane, every affected Allianz customer lodges with photos in-conversation instead of waiting on hold.",
  },

  "youi": {
    operatingContext:
      "Youi is a Sunshine Coast-based challenger motor and home insurer, part of South Africa's OUTsurance Group, built around a deliberately conversation-heavy model: its differentiator has always been asking customers detailed questions about how they actually use their car and home in order to price more precisely. That model produces unusually long talk time per policy sold and per policy serviced relative to its premium base, and it concentrates a large workforce in Queensland contact centres. It sells direct rather than through brokers, so every acquisition, renewal, endorsement, and claim conversation lands in its own operation. The same Queensland footprint that houses its people also sits in Australia's most storm- and flood-exposed corridor, so catastrophe events hit its customers and its service capacity simultaneously.",
    strategicPressure: [
      { text: "Youi's proposition is explicitly built on asking more questions to price better, which structurally raises talk time per policy compared with form-based direct insurers", kind: "verified" },
      { text: "Queensland and northern New South Wales weather events repeatedly generate claims surges that concentrate on insurers with heavy exposure in those regions", kind: "verified" },
      { text: "A direct-only distribution model means service cost cannot be pushed onto intermediaries, so cost-to-serve sits entirely on the insurer's own profit and loss", kind: "inference" },
      { text: "Renewal and quote follow-up conversations are outbound and capacity-bound, so a fixed roster caps how much of the book can be actively defended each month", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Youi's scale does not support a platform engineering function, and its parent's technology investment is directed at core insurance systems and the group's South African and Irish operations rather than at conversational infrastructure. Its cost structure is dominated by contact-centre labour, which makes automation a direct margin lever it can buy and measure quickly.",
    whyNotBuild:
      "Youi's competitive advantage is its underwriting question set and pricing, not conversational technology. Building would mean owning Australian-accented speech recognition across a broad demographic, telephony integration, orchestration into policy and claims systems, and continuous evaluation under general-insurance conduct obligations — four disciplines it has no reason to staff. A packaged deployment gets the talk-time reduction without diverting anything from pricing.",
    workflows: [
      {
        name: "Renewal and retention conversations",
        friction: "Renewal outreach is limited by outbound capacity, so only a fraction of the book gets a genuine conversation before the premium notice lands and price-shopping begins",
        outcome: "Every renewing customer reached in a two-way conversation ahead of the notice, with retention offers applied from an approved matrix and specialists reserved for high-value saves",
        channels: ["Voice", "SMS", "Email"],
        systems: ["Policy administration", "Pricing/rating engine", "CRM", "Retention offer matrix"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Quote follow-up and abandoned-quote recovery",
        friction: "Customers who start a detailed quote and drop out mid-question set are followed up only when outbound capacity allows, so a business built on question-heavy quoting leaks its most expensive leads",
        outcome: "Every abandoned quote followed up within minutes in the customer's channel, resuming from where the question set stopped rather than restarting it",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Quote engine", "Pricing/rating engine", "CRM", "Marketing automation"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Claims-status deflection during weather events",
        friction: "After a storm, claims-status calls from already-lodged customers compete with new lodgements for the same Queensland-based phone capacity, and both experiences degrade together",
        outcome: "Status queries answered instantly from the claims system and milestone updates pushed proactively, keeping human capacity on lodgement and assessment during the event",
        channels: ["Voice", "SMS", "Mobile app"],
        systems: ["Claims management platform", "Assessor dispatch", "Repairer network", "Policy administration"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Online quote and purchase journeys alongside its signature phone-based question-set quoting",
        "Queensland-based contact centres handling sales, service, and claims for a direct book",
        "A customer portal and app for policy documents, payments, and basic self-service",
        "Established assessor and repairer networks with event-response processes for storm seasons",
      ],
      gaps: [
        "No way to have its differentiating question-set conversation without a human on the line",
        "No capacity to follow up every abandoned quote while the customer is still shopping",
        "No proactive claims-status communication, so status calls compete with lodgement during events",
        "No after-hours conversational capability, despite weather events not respecting rosters",
      ],
    },
    risks: [
      "General insurance conduct obligations apply to sales conversations as well as claims, so an automated quote conversation must not stray into personal advice",
      "The General Insurance Code of Practice imposes vulnerable-customer and catastrophe-response obligations that automated channels must detect and honour",
      "Automation of Queensland-based roles is locally sensitive given Youi's regional employment footprint and must be framed as capacity for growth rather than headcount reduction",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 6,
      automationRate: 0.45,
      basis: "Seller assumptions requiring validation: volume estimated from a mid-scale direct personal-lines book with unusually high contacts per policy, cost reflecting Queensland-based contact-centre labour, and a conservative automation rate given the consultative nature of Youi's quoting model.",
    },
    pilotScope:
      "An eight-week pilot automating renewal outreach and abandoned-quote follow-up on voice and SMS for motor policies, integrated to the quote engine and policy administration, measured on renewal retention and quote-completion rate against a matched control group.",
    expansion: [
      "Extend to home-insurance renewals and cross-sell conversations across the book",
      "Add claims-status deflection and proactive milestone updates ahead of the next storm season",
      "Introduce agent-assist for the question-set sales conversations that remain human",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Claims",
      "Head of Sales and Service Centres",
      "Chief Information Officer",
    ],
    discovery: [
      "What is your average handle time on a new quote conversation, and how much of it is question-set data capture rather than judgement?",
      "What percentage of your renewing book actually receives an outbound conversation before the premium notice arrives?",
      "During the last major storm event, how did status calls from existing claimants affect your lodgement capacity?",
      "How much of Youi's technology direction is set by OUTsurance group in South Africa versus decided on the Sunshine Coast?",
    ],
    flowTemplate: "retention",
    scenario: "A Youi customer who abandoned a car-insurance quote at the driving-history questions gets a call back that resumes exactly where they stopped.",
  },

  "budget-direct": {
    operatingContext:
      "Budget Direct is the flagship Australian consumer brand of Auto and General, a price-led direct insurer selling motor, home, travel, and pet cover with no broker channel and no branch network. Its entire proposition is that it costs less, which means its cost-to-serve is not a background metric but the product itself: every dollar of avoidable service cost either erodes margin or forces a price increase that undermines the positioning. It acquires heavily through price-comparison-style advertising and online quoting, then services and claims through contact centres with a mix of onshore and offshore handling. Its customers skew price-sensitive and digitally comfortable, which makes them unusually willing to self-serve if the channel actually completes the task.",
    strategicPressure: [
      { text: "A price-leadership positioning makes cost-to-serve a strategic constraint rather than an operational metric, because service cost must be recovered in premium or surrendered in margin", kind: "inference" },
      { text: "Australian motor claims costs have risen materially with repair, parts, and hire-car inflation, squeezing exactly the insurers whose proposition is low premium", kind: "verified" },
      { text: "Offshore contact-centre use is politically and reputationally sensitive in Australia, and onshore AI is a defensible alternative narrative for a brand under price pressure", kind: "inference" },
      { text: "High policy-adjustment volume — vehicle changes, address changes, excess changes — is transactional work generating no revenue and consuming full agent cost", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Auto and General's technology effort is directed at pricing, digital acquisition, and claims cost control, which are where a price-led insurer competes. There is no public evidence of conversational-platform engineering, and the group's culture of operational efficiency favours buying a proven capability with a measurable payback over funding a speculative internal programme.",
    whyNotBuild:
      "The economics answer this directly: a business whose strategy is being cheaper cannot justify funding four engineering disciplines — speech, telephony, orchestration, evaluation — to serve its own contact centre. It needs the automation benefit on the profit and loss this financial year, not a platform team in three. Packaged deployment with usage-based cost aligns to exactly how it thinks about unit economics.",
    workflows: [
      {
        name: "Policy adjustment self-service",
        friction: "Vehicle changes, address updates, excess adjustments, and driver additions arrive by phone, and each requires an agent to re-rate the policy and explain the premium change — full cost, zero revenue",
        outcome: "Adjustments completed conversationally with live re-rating and the premium impact explained in the same conversation, at a fraction of the assisted cost",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Policy administration", "Pricing/rating engine", "Payments", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Claims lodgement and status",
        friction: "Motor claim lodgement is a long structured intake by phone, and once lodged, repair-progress questions generate repeat calls that read back information already in the claims and repairer systems",
        outcome: "Structured lodgement captured in any channel with photos, and repair milestones pushed proactively so status calls largely disappear",
        channels: ["Voice", "SMS", "Web", "Mobile app"],
        systems: ["Claims management platform", "Repairer network management", "Assessor dispatch", "Policy administration"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Renewal premium-change conversations",
        friction: "Premium increases at renewal trigger a spike of calls asking why the price moved, and a price-led brand is most vulnerable at exactly that moment",
        outcome: "Premium changes explained conversationally with the actual rating drivers, and eligible retention options offered from an approved matrix before the customer starts shopping",
        channels: ["Voice", "SMS", "Email"],
        systems: ["Policy administration", "Pricing/rating engine", "Retention offer matrix", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Online quote-and-buy journeys and a customer portal for documents and payments",
        "Contact centres handling sales, service, and claims across a mix of onshore and offshore locations",
        "Digital claims lodgement forms alongside phone-based intake for motor and home",
        "A managed repairer network with associated repair-scheduling communications",
      ],
      gaps: [
        "No authenticated voice channel that can re-rate and complete a policy change without an agent",
        "No proactive repair-milestone communication, leaving status chasing as the customer's only option",
        "No conversational explanation of premium movements at renewal, when churn risk peaks",
        "No after-hours capability, so evening demand from working customers falls back to the web form",
      ],
    },
    risks: [
      "Claims handling is a regulated financial service in Australia and the code of practice imposes timeframes and vulnerable-customer obligations on automated as well as human conversations",
      "Sales conversations must remain general in nature to avoid crossing into personal financial advice, which constrains how an automated agent may discuss cover adequacy",
      "The Privacy Act governs handling of claims information, and any offshore processing must be disclosed and controlled consistently with existing arrangements",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 5.5,
      automationRate: 0.6,
      basis: "Seller assumptions to validate: volume estimated from a large direct personal-lines book with high adjustment and claims contact rates, cost reflecting a blended onshore and offshore service mix below pure-onshore benchmarks, and a relatively high automation rate given the transactional nature of the volume.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating motor policy adjustments — vehicle change, address change, excess change — end to end on voice and chat with live re-rating and payment, measured on cost per adjustment and completion rate.",
    expansion: [
      "Extend to claims lodgement with in-conversation photo capture and proactive repair-milestone updates",
      "Add renewal premium-change explanation and retention offers across motor and home books",
      "Introduce sales-support conversations for abandoned online quotes across all product lines",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Claims",
      "Head of Customer Service Operations",
      "Chief Financial Officer",
    ],
    discovery: [
      "What is your fully loaded cost per policy adjustment today, and what proportion of adjustments arrive by phone rather than online?",
      "How many calls does an average motor claim generate between lodgement and repair completion?",
      "What is your current onshore and offshore handling split, and how does the board think about that mix reputationally?",
      "At renewal, how much of your call volume is customers asking why the premium moved rather than transacting?",
    ],
    flowTemplate: "claims",
    scenario: "A Budget Direct customer swaps to a new car at 8pm, gets the re-rated premium explained, and pays the difference in the same conversation.",
  },

  "hcf": {
    operatingContext:
      "HCF is Australia's largest not-for-profit private health insurer, a member-owned fund covering more than a million and a half people with hospital and extras cover, and it also operates its own dental and eyecare centres alongside partnerships with providers. Its member base skews toward long-tenured families who use extras benefits frequently — dental, optical, physiotherapy — which generates constant eligibility and benefit-limit questions rather than occasional major claims. Members reach it through the HCF app and online member portal, retail branches, and phone teams, and the annual premium-change round produces a sharp, predictable, and severe concentration of inbound calls. Because it returns surplus to members rather than shareholders, every dollar of administration cost is directly and visibly a dollar not returned as benefits.",
    strategicPressure: [
      { text: "Australian private health insurance premium changes are approved and announced on an annual cycle, producing a predictable and severe national spike in member inquiries at the same time each year", kind: "verified" },
      { text: "Private health insurance affordability and the perceived value of extras cover are under sustained public scrutiny, making member retention conversations strategically critical for every fund", kind: "verified" },
      { text: "As a member-owned not-for-profit, HCF's management expense ratio is a published measure of member value, so administration cost is a governance metric rather than just an operating one", kind: "inference" },
      { text: "Extras-heavy usage patterns mean members contact the fund several times a year about eligibility and limits, giving HCF a much higher contact rate per member than a hospital-only insurer", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. HCF has no technology parent, no shareholder capital for speculative platform investment, and a member-value mandate that makes an in-house AI engineering function very hard to justify at a board that scrutinises management expenses. It has consistently procured its digital capability, and packaged automation with a measurable expense-ratio benefit is precisely the shape of investment a member-owned fund can defend.",
    whyNotBuild:
      "A not-for-profit fund cannot explain to members why their premiums funded speech-recognition engineering. Building would require Australian speech handling across a multicultural member base, telephony integration, orchestration into claims and eligibility systems, and a private-health-specific evaluation regime. Buying converts all four into a usage-based cost with a defensible payback on the management expense ratio.",
    workflows: [
      {
        name: "Premium-round inquiry surge",
        friction: "When the annual premium change lands, call volume multiplies for several weeks, wait times blow out, and members who cannot get through simply start comparing funds instead",
        outcome: "Every member reaches an explanation of their specific premium change immediately, with cover-review and retention options offered before they reach a comparison site",
        channels: ["Voice", "SMS", "Mobile app", "Email"],
        systems: ["Policy/membership administration", "Premium calculation", "CRM", "Retention offer rules"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Extras eligibility and benefit-limit checks",
        friction: "Members call before dental, optical, or physiotherapy visits to check what is covered and how much limit remains, and agents read the answer from a benefits table for a two-minute question",
        outcome: "Instant, grounded answers on cover, waiting periods, and remaining limits at the moment of need, removing the highest-frequency and lowest-value call type entirely",
        channels: ["Voice", "Mobile app", "Web chat", "SMS"],
        systems: ["Claims/benefits engine", "Membership administration", "Provider network directory"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Hospital-cover pre-admission checks",
        friction: "Members facing a procedure need to confirm cover, waiting periods, excess, and out-of-pocket exposure, and this anxious, high-stakes conversation queues behind routine extras questions",
        outcome: "Pre-admission cover confirmed with clear out-of-pocket expectations set early, reducing both bill-shock complaints and repeat calls before admission",
        channels: ["Voice", "Web chat", "Email"],
        systems: ["Membership administration", "Hospital agreements/benefits engine", "Provider network directory", "CRM"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A member app and online member portal supporting claims submission, digital membership cards, and cover details",
        "On-the-spot electronic extras claiming at provider terminals across dental, optical, and allied health",
        "HCF-operated dental and eyecare centres alongside a contracted provider network",
        "Retail branches and Australian-based member contact teams",
      ],
      gaps: [
        "No voice channel that can authenticate a member and answer a benefit-limit question without an agent",
        "No elastic capacity for the annual premium-round surge beyond temporary staffing",
        "No proactive outreach explaining an individual member's premium change before they call to ask",
        "No guided pre-admission cover and out-of-pocket estimation conversation ahead of a hospital procedure",
      ],
    },
    risks: [
      "Private health insurance is regulated under the Private Health Insurance Act with rules on cover representations, waiting periods, and portability that automated answers must reflect exactly",
      "Health claims and pre-admission conversations involve sensitive health information under the Privacy Act, requiring heightened consent, handling, and retention controls",
      "Any statement about likely out-of-pocket costs carries complaint and Ombudsman exposure if it proves inaccurate, so quoted figures must be system-derived and clearly bounded",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 6,
      automationRate: 0.6,
      basis: "Seller assumptions for discovery validation: volume estimated from a member base above one and a half million people with high extras-driven contact frequency, cost reflecting Australian-based member service labour, and a high automation rate reflecting the repetitive eligibility and limit-check nature of the volume.",
    },
    pilotScope:
      "A ten-week pilot automating extras eligibility and benefit-limit checks across voice and app chat, grounded in the benefits engine and membership records, timed to be production-ready before the next premium-change round.",
    expansion: [
      "Extend to premium-round surge handling with personalised premium-change explanations and retention options",
      "Add hospital-cover pre-admission checks with out-of-pocket estimation and human escalation for complex cases",
      "Introduce proactive member outreach on unused extras limits before the benefit year resets",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Chief Member Officer / General Manager Member Experience",
      "Chief Information Officer",
      "General Manager Risk and Compliance",
    ],
    discovery: [
      "What does your call volume look like in the four weeks after the premium change is announced compared with a normal month?",
      "What proportion of member calls are eligibility or remaining-limit questions that the benefits system already knows the answer to?",
      "How does the board assess technology investment against the management expense ratio you report to members?",
      "What is your current process when a member asks about out-of-pocket costs before a hospital admission, and how often does that produce a later complaint?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An HCF member in a dentist's waiting room asks how much extras limit is left and gets the exact figure before being called in.",
  },

  "nib-group": {
    operatingContext:
      "nib is a listed Australian health insurer operating across Australia and New Zealand, with a private health book, a substantial international student and worker health insurance business, a travel insurance arm, and a stated ambition to move from payer to health partner through digital health ventures and telehealth partnerships. That international student and migrant book is operationally distinctive: those members are often newly arrived, unfamiliar with Australian health financing, and frequently more comfortable in a language other than English, so they generate high contact rates with genuinely complex questions. Members reach nib through its app and member portal, phone teams across both countries, and partner and broker channels for corporate cover. It is more willing than most funds to experiment with digital capability, which makes it a partner rather than a straightforward buyer.",
    strategicPressure: [
      { text: "nib has publicly pursued a payer-to-partner strategy including telehealth, health-management, and digital health ventures rather than positioning purely as a claims payer", kind: "verified" },
      { text: "Its international student and worker health insurance business serves recently arrived migrants navigating an unfamiliar health system, producing high contact rates and language-support needs", kind: "verified" },
      { text: "Operating across Australia and New Zealand doubles the regulatory and product surface for the same core servicing workflows, without doubling the scale that would justify separate builds", kind: "inference" },
      { text: "Digital-first positioning raises the internal bar for any bought capability: it must integrate with existing ventures rather than sit alongside them as a standalone bot", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. nib has genuine digital ambition and existing technology ventures, so it will not accept a black-box deployment disconnected from its health-services strategy. But it is a mid-cap insurer, not a platform company, and its engineering capacity is committed to health-services products rather than to speech and telephony infrastructure. A partner engagement that plugs conversational capability into its existing digital-health assets fits both realities.",
    whyNotBuild:
      "nib's differentiation thesis is health services and member health outcomes, not conversational infrastructure. Building would require multilingual speech handling for its international member base, telephony integration across two countries, orchestration into claims and eligibility engines under two regulatory regimes, and continuous evaluation. Partnering lets it keep engineering focused on the health propositions that make its payer-to-partner story credible.",
    workflows: [
      {
        name: "International student and worker member servicing",
        friction: "Newly arrived members do not know how Australian health cover works, ask foundational questions in their second or third language, and generate long, repetitive calls that a rostered English-language team handles slowly",
        outcome: "Foundational cover questions answered in the member's own language at any hour across time zones, dramatically reducing handle time and repeat contact for the highest-contact segment",
        channels: ["Voice", "Web chat", "WhatsApp", "Mobile app"],
        systems: ["Membership administration", "Overseas cover benefits engine", "Provider directory", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Claims and eligibility servicing across AU and NZ",
        friction: "Benefit-limit, waiting-period, and claim-status questions are handled by separate teams under separate product rules in each country, duplicating effort on identical conversation shapes",
        outcome: "One governed conversational layer serving both markets with country-specific rules applied automatically, cutting duplicated servicing effort across the group",
        channels: ["Voice", "Mobile app", "Web chat"],
        systems: ["Claims/benefits engine", "Membership administration", "Provider network directory"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Health-programme enrolment and follow-up",
        friction: "Eligible members are identified for chronic-condition and health-management programmes but enrolment depends on outbound calling capacity, so participation stays far below the eligible population",
        outcome: "Every eligible member invited and enrolled conversationally with follow-up check-ins, giving the payer-to-partner strategy the participation volume it needs to demonstrate outcomes",
        channels: ["Voice", "SMS", "Mobile app"],
        systems: ["Health programme management", "Membership administration", "Telehealth partner platforms", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Member apps and online portals across Australian and New Zealand books with digital claiming",
        "Telehealth and digital health partnerships supporting the payer-to-partner positioning",
        "Dedicated servicing for international student and worker health cover alongside domestic membership",
        "Broker and corporate channels supporting group and workplace health cover",
      ],
      gaps: [
        "No multilingual voice servicing for an international member base that is frequently not first-language English",
        "No unified conversational layer across the Australian and New Zealand operations",
        "No scalable enrolment channel for health-management programmes beyond outbound calling capacity",
        "No proactive guidance for newly joined members on how to actually use their cover",
      ],
    },
    risks: [
      "Health information is sensitive information under the Australian Privacy Act and equivalent New Zealand rules, requiring explicit consent handling and strict processing controls",
      "Private health insurance rules on cover representations, waiting periods, and portability differ between Australia and New Zealand and must be applied per market without leakage",
      "Any health-programme conversation risks crossing from information into clinical advice, so clinical escalation boundaries must be explicit and enforced",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 6,
      automationRate: 0.55,
      basis: "Seller assumptions to validate: volume estimated across Australian and New Zealand member books plus a high-contact international student and worker segment, cost reflecting blended trans-Tasman service labour, and an automation rate assuming eligibility and cover-explanation volume automates while clinical topics escalate.",
    },
    pilotScope:
      "A ten-week pilot delivering multilingual servicing for the international student and worker health book across voice and chat in three languages, grounded in the overseas cover benefits engine and provider directory.",
    expansion: [
      "Extend the conversational layer to domestic Australian member eligibility and claims servicing",
      "Add the New Zealand book with country-specific product and regulatory rules applied automatically",
      "Introduce health-programme enrolment and follow-up conversations connected to telehealth partners",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Chief Executive Australian Residents Health Insurance",
      "Chief Information Officer",
      "Group Executive Customer and Brand",
      "Chief Risk Officer",
    ],
    discovery: [
      "What is the contact rate per member for your international student and worker book compared with your domestic residents book?",
      "How many languages do your international members actually contact you in, and how do you serve them today?",
      "Which of your digital health ventures would a conversational layer need to integrate with to be seen as strategic rather than tactical?",
      "How much of your Australian and New Zealand servicing is genuinely duplicated work on identical conversation types?",
    ],
    flowTemplate: "claims",
    scenario: "A newly arrived international student asks nib in Mandarin whether a GP visit is covered and what the gap will be, at 11pm Sydney time.",
  },

  "bupa-anz": {
    operatingContext:
      "Bupa Asia Pacific is unusual in Australian healthcare because it spans three service businesses at once: one of the country's largest private health insurers, a substantial residential aged-care operator, and a large network of dental and optical clinics, plus New Zealand operations including aged care and rehabilitation. Each line generates a different but continuous communications load — member eligibility and claims for insurance, family communications and enquiry management for aged care, and appointment booking and recalls across hundreds of clinics. Customers reach it through the Bupa member app and portal, retail stores, clinic reception desks, care-home enquiry lines, and contact centres. Because it is a global Bupa group operation, platform standards and vendor governance sit partly outside Australia, but the operational volume and the sensitivity of aged-care family conversations are unmistakably local.",
    strategicPressure: [
      { text: "Australian residential aged care has been through royal commission-driven reform with heightened obligations on quality, transparency, and family communication", kind: "verified" },
      { text: "Private health insurance affordability pressure and the annual premium-change cycle apply to Bupa's insurance arm exactly as they do to every other fund", kind: "verified" },
      { text: "Running insurance, aged care, and clinics under one brand means a service failure in any line contaminates the brand for all three, raising the value of consistent servicing", kind: "inference" },
      { text: "Aged-care family enquiry handling is currently reception-and-phone dependent, which caps responsiveness at exactly the moments families are making high-stress placement decisions", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Bupa global procures platforms through structured vendor arrangements and sets architecture standards centrally, so Asia Pacific does not build its own conversational stack and cannot buy entirely independently. The realistic engagement is a partner-delivered layer spanning insurance servicing first, with dental appointment volume as the natural expansion, operating within group technology governance.",
    whyNotBuild:
      "Bupa's capital and management attention go into care quality, clinic networks, and insurance economics — the three things its regulators and customers judge it on. Building conversational infrastructure would demand speech handling for a multicultural and often elderly customer base, telephony across clinics and care homes as well as contact centres, orchestration into insurance, clinical, and care systems, and an evaluation regime satisfying both health-privacy and aged-care quality obligations. That is four disciplines outside anything Bupa is trying to be good at.",
    workflows: [
      {
        name: "Health-insurance member servicing",
        friction: "Eligibility, waiting-period, benefit-limit, and claim-status questions dominate member calls, and each is a lookup an agent performs manually while the member waits",
        outcome: "Instant grounded answers on cover and limits at the point of need, with agents redeployed to complex cover reviews and pre-admission conversations",
        channels: ["Voice", "Mobile app", "Web chat", "SMS"],
        systems: ["Claims/benefits engine", "Membership administration", "Provider network directory", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Dental and optical appointment booking and recalls",
        friction: "Each clinic manages its own phone line, so booking depends on reception availability, no-shows go unrecovered, and six-month recall campaigns run only when staff have time",
        outcome: "Bookings, reschedules, and recall outreach handled centrally across the clinic network, lifting chair utilisation without adding reception headcount",
        channels: ["Voice", "SMS", "Web chat", "Mobile app"],
        systems: ["Clinic practice management", "Appointment scheduling", "Membership administration", "Recall/campaign management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Aged-care family enquiry and placement guidance",
        friction: "Families researching residential care call multiple homes individually, get inconsistent information on availability, fees, and assessment requirements, and often wait days for a callback during a crisis",
        outcome: "Consistent, immediate first-response on availability, fee structures, and assessment steps across the home network, with human care advisers engaged on qualified enquiries",
        channels: ["Voice", "Web chat", "Email"],
        systems: ["Care home occupancy/CRM", "Enquiry management", "Fee/means-assessment reference", "Clinical intake"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A member app and online portal with digital claiming, membership cards, and cover details",
        "Retail store network alongside Australian-based member contact centres",
        "Practice management and reception-based booking across a large dental and optical clinic network",
        "Care-home enquiry lines and placement advisory staff supporting residential aged-care intake",
      ],
      gaps: [
        "No authenticated voice servicing that completes an insurance query without an agent",
        "No central booking capability spanning the clinic network, so each site is capacity-bound at reception",
        "No immediate, consistent first-response for aged-care families making urgent placement decisions",
        "No shared context when a customer touches insurance, a clinic, and a care home as the same household",
      ],
    },
    risks: [
      "Aged Care Quality Standards impose obligations on communication with residents and representatives, and automated conversations in that context require careful design and clear human escalation",
      "Health information across insurance, dental, and care records is sensitive information under the Privacy Act with strict consent and handling requirements",
      "Bupa global architecture and vendor governance may constrain local platform selection and data-processing location, making group alignment a gating step",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 6,
      automationRate: 0.55,
      basis: "Seller assumptions requiring validation: volume aggregated across a large health-insurance membership, a national dental and optical clinic network, and aged-care enquiry lines, cost reflecting Australian service and reception labour, and an automation rate assuming booking and eligibility automate while clinical and care conversations escalate.",
    },
    pilotScope:
      "A ten-to-fourteen week pilot covering health-insurance member eligibility and claims servicing on voice and app chat, grounded in the benefits engine, with dental appointment booking added in one state as a second workflow.",
    expansion: [
      "Extend appointment booking, reminders, and six-month recalls across the full dental and optical network",
      "Add aged-care family enquiry first-response with human care-adviser handoff on qualified enquiries",
      "Introduce cross-line household context so insurance, clinic, and care interactions share one view",
    ],
    stakeholders: [
      "Chief Executive Officer Bupa Asia Pacific",
      "Managing Director Health Insurance",
      "Managing Director Health Services / Dental",
      "Chief Information Officer Asia Pacific",
      "Chief Risk and Compliance Officer",
    ],
    discovery: [
      "How much of your health-insurance call volume is eligibility and limit checking that the benefits system could answer directly?",
      "What is the average time to first response for an aged-care placement enquiry, and how many enquiries are lost to a competitor in that window?",
      "How many appointment bookings and recalls does the dental network handle through reception phone lines each month?",
      "What must be true about group architecture governance for Asia Pacific to select a conversational platform locally?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Bupa member checks a dental limit, books the appointment, and confirms the gap payment in one conversation across two Bupa businesses.",
  },

  "aia-australia": {
    operatingContext:
      "AIA Australia is the Australian arm of the pan-Asian life insurer, and it became one of the country's largest life insurers largely through the acquisition of the CommInsure life book, giving it a huge in-force portfolio of retail and group life, income protection, and trauma cover. Its distribution is overwhelmingly intermediated: superannuation funds providing default group cover to their members, and financial advisers placing retail policies, which means the insured member often has no direct relationship with AIA at all. That B2B2C structure shapes the communications problem — claims and underwriting-status conversations route through fund administrators and advisers, and the member experiences delay at every handoff. It also runs the AIA Vitality health-engagement programme, which is a rare direct-to-member channel in an otherwise intermediated book.",
    strategicPressure: [
      { text: "AIA acquired the CommInsure life insurance business, materially expanding its Australian in-force book and leaving it operating multiple legacy administration environments", kind: "verified" },
      { text: "Australian group life cover distributed through superannuation funds is regulated for insurance-in-superannuation standards, imposing service and claims-handling expectations on the insurer and the trustee jointly", kind: "verified" },
      { text: "In a B2B2C model the insured member is often several handoffs away from the insurer, so claims-status opacity is structural rather than accidental", kind: "inference" },
      { text: "Group platform decisions taken in Hong Kong constrain Australian technology selection, so the credible opening is a narrowly Australian workflow the group roadmap does not reach", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led, and deliberately narrow. AIA group operates regional platform standards and centralised technology governance, so the Australian business is not a free-standing buyer. What it does own is a distinctly Australian problem — group insurance claims communications through superannuation trustees — that no regional platform decision addresses. That is the shape of an Australia-specific partner engagement inside group guardrails.",
    whyNotBuild:
      "AIA Australia's engineering effort is absorbed by integrating acquired legacy books and meeting Australian regulatory change, not by building conversational infrastructure. A build would require Australian speech handling across a broad demographic, telephony integration, orchestration across multiple inherited policy and claims administration systems, and an evaluation regime satisfying life-insurance conduct and vulnerable-customer obligations — none of which AIA Australia has any reason to staff against a regional group roadmap.",
    workflows: [
      {
        name: "Group-insurance claims status for super-fund members",
        friction: "A member claiming on default cover through their super fund is passed between fund administrator and insurer, and neither party proactively updates them, so the member chases both for months",
        outcome: "Proactive, member-facing status updates at every claim milestone regardless of which party holds the file, cutting chasing volume for the insurer and the trustee simultaneously",
        channels: ["Voice", "SMS", "Email"],
        systems: ["Claims management platform", "Group policy administration", "Trustee/fund administrator interfaces", "Document management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Claims document collection and medical-evidence chase",
        friction: "Income protection and trauma claims require medical certificates, employer statements, and financial evidence, and missing items are chased by letter and phone tag over weeks",
        outcome: "Outstanding evidence chased conversationally with clear explanation of what is needed and why, validated on receipt, shortening claim cycle time materially",
        channels: ["Voice", "SMS", "Email"],
        systems: ["Claims management platform", "Document management", "Medical provider interfaces", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Adviser servicing desk",
        friction: "Financial advisers phone for policy status, underwriting progress, and alteration queries on behalf of clients, and each call pulls a case manager away from underwriting work",
        outcome: "Advisers self-serve live policy and underwriting status at any hour, protecting case-manager capacity and adviser relationships at once",
        channels: ["Voice", "Email", "Adviser portal chat"],
        systems: ["Policy administration", "Underwriting workbench", "Adviser portal", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Adviser portals providing policy and underwriting visibility for intermediated retail distribution",
        "Group insurance administration interfaces with superannuation trustees and fund administrators",
        "The AIA Vitality health-engagement programme as a direct-to-member digital channel",
        "Claims case-management teams handling life, income protection, and trauma claims",
      ],
      gaps: [
        "No member-facing status channel for group claims where the fund sits between insurer and member",
        "No conversational evidence-chasing, so document collection runs on letters and voicemail tag",
        "No after-hours adviser servicing despite advisers working outside standard insurer hours",
        "No consolidated view for a member whose cover sits across acquired legacy administration systems",
      ],
    },
    risks: [
      "Life insurance claims handling is a regulated financial service, and the Life Insurance Code of Practice sets timeframes and vulnerable-customer obligations for claims communications",
      "Insurance in superannuation involves the trustee as a separate accountable party, so member communications must be agreed with fund trustees and cannot be unilateral",
      "Claims involve sensitive health and financial information, and mental-health-related income protection claims require particularly careful conversational design and human escalation",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 7,
      automationRate: 0.4,
      basis: "Seller assumptions requiring validation: volume estimated from a large in-force life book where most members contact the insurer rarely but claimants contact repeatedly, cost reflecting specialist case-management labour above general service rates, and a low automation rate reflecting the sensitivity of life claims.",
    },
    pilotScope:
      "A ten-week pilot delivering proactive claims-status updates and outstanding-document chase for group income protection claims with one superannuation fund partner, integrated to the claims platform, measured on chase-call volume and evidence turnaround time.",
    expansion: [
      "Extend proactive status communications across all group insurance partners and retail claims",
      "Add the adviser servicing desk covering policy status, underwriting progress, and alterations",
      "Introduce onboarding conversations for newly insured members explaining their default cover",
    ],
    stakeholders: [
      "Chief Executive Officer AIA Australia",
      "Chief Claims Officer",
      "Chief Group Insurance Officer / Head of Group Partnerships",
      "Chief Technology Officer",
      "Chief Risk Officer",
    ],
    discovery: [
      "How many inbound contacts does an average income protection claim generate between lodgement and decision?",
      "Where does a member's claim sit today between your teams and the fund administrator, and who owns telling the member?",
      "Which superannuation fund partners would sponsor a joint member-communications improvement rather than treat it as your problem alone?",
      "How much technology autonomy does AIA Australia hold relative to regional group platform decisions?",
    ],
    flowTemplate: "claims",
    scenario: "A super-fund member on an income protection claim gets an AIA update the day their medical certificate is received, instead of chasing two organisations.",
  },

  "tal-australia": {
    operatingContext:
      "TAL is Australia's largest life insurer, owned by Japan's Dai-ichi Life, protecting millions of Australians predominantly through group cover arranged by superannuation funds, alongside retail policies through advisers and direct offerings. Its scale comes from being the insurer behind default death, total permanent disability, and income protection cover in many of the country's largest super funds, and it further consolidated its position by acquiring the Westpac life insurance business. Its claims journeys are long, document-heavy, and emotionally charged: total permanent disability and terminal illness claims involve medical evidence, employer records, and often distressed or bereaved claimants over months. Claimants and their families reach TAL by phone and mail through claims case managers, with the superannuation trustee frequently sitting in the middle of the relationship.",
    strategicPressure: [
      { text: "TAL acquired the Westpac life insurance business, adding a substantial in-force book and additional legacy administration environments to integrate", kind: "verified" },
      { text: "Australian life insurers operate under the Life Insurance Code of Practice with defined claims-handling timeframes and explicit obligations toward vulnerable customers", kind: "verified" },
      { text: "Mental-health-related income protection and TPD claims form a significant and growing share of life claims, and these are precisely the conversations where conduct risk is highest", kind: "inference" },
      { text: "Document chasing consumes case-manager capacity that could otherwise be spent on claim assessment and on the human contact claimants actually value", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. TAL's technology investment is committed to integrating acquired books, modernising policy administration, and meeting a heavy Australian regulatory-change agenda. It works with established platform vendors and systems integrators rather than building bespoke infrastructure, and a conversational layer over claims communications is an adjacency it would procure through that same route.",
    whyNotBuild:
      "TAL's competitive position rests on underwriting, group-scheme tendering, and claims capability, not on speech technology. Building would require Australian-accented speech handling across a demographically broad claimant base, telephony into its claims operation, orchestration across multiple inherited claims and policy systems, and an evaluation framework capable of demonstrating code-of-practice compliance in emotionally sensitive conversations. The evaluation layer alone is a specialist discipline TAL has no reason to own.",
    workflows: [
      {
        name: "Claims document and evidence collection",
        friction: "TPD and income protection claims stall waiting for medical certificates, specialist reports, and employer statements, chased by letters and voicemail while the claimant assumes nothing is happening",
        outcome: "Outstanding evidence explained and chased conversationally with receipt confirmation, cutting weeks of dead time out of claim cycles",
        channels: ["Voice", "SMS", "Email"],
        systems: ["Claims management platform", "Document management", "Medical provider interfaces", "Employer/trustee interfaces"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Proactive claim-milestone updates",
        friction: "Claimants call case managers repeatedly for reassurance because the process emits no updates, and each call interrupts assessment work without advancing the claim",
        outcome: "Milestone-triggered proactive updates that reduce anxiety-driven inbound contact and return case-manager hours to actual assessment",
        channels: ["SMS", "Voice", "Email"],
        systems: ["Claims management platform", "Case management workflow", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Group-scheme member cover enquiries",
        friction: "Super-fund members asking what cover they actually hold, what it costs, and whether they can change it are bounced between the fund and the insurer, and neither owns the answer",
        outcome: "Members get a clear, grounded explanation of their default cover and options in one conversation, reducing duplicated contact across trustee and insurer",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Group policy administration", "Trustee/fund administrator interfaces", "Premium calculation", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Claims case-management teams handling death, TPD, income protection, and terminal illness claims",
        "Group insurance administration integrations with major superannuation fund partners",
        "Adviser channels and portals supporting retail life distribution",
        "Established health and rehabilitation support programmes attached to income protection claims",
      ],
      gaps: [
        "No conversational evidence-chasing, leaving document collection on letters and phone tag",
        "No proactive claim-milestone communication, so anxiety-driven status calls are the norm",
        "No self-service path for group members to understand their default cover without a phone call",
        "No unified claimant view across acquired legacy books, so experience varies by which system holds the policy",
      ],
    },
    risks: [
      "The Life Insurance Code of Practice imposes claims timeframes and explicit vulnerable-customer obligations that automated conversations must detect and honour with human escalation",
      "Mental-health and bereavement conversations carry acute conduct risk, so automation must be confined to logistics and status rather than any assessment or advice",
      "Trustee co-accountability in group insurance means member-facing communications require fund agreement and must align with trustee obligations",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 7,
      automationRate: 0.4,
      basis: "Seller assumptions to test: volume estimated from the largest Australian life in-force book where claim-related contact dominates, cost reflecting specialist claims case-management labour, and a deliberately low automation rate given the sensitivity of life claims and the need for human decision points.",
    },
    pilotScope:
      "A ten-week pilot automating outstanding-document explanation and chase plus milestone status updates for income protection claims within one group scheme, with mandatory human escalation on any distress or vulnerability signal.",
    expansion: [
      "Extend proactive status and evidence chase across TPD and death claims with trustee agreement",
      "Add group-scheme member cover enquiries jointly with major superannuation fund partners",
      "Introduce agent-assist for case managers so every claimant call opens with assembled file context",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Claims Officer",
      "Group Executive Group Life and Partnerships",
      "Chief Information Officer",
      "Chief Risk Officer",
    ],
    discovery: [
      "What proportion of claim duration is time waiting on outstanding documents rather than time in assessment?",
      "How many status calls does an average TPD claim generate, and what does that cost in case-manager time?",
      "What vulnerability signals must trigger immediate human handover before your conduct team would approve an automated conversation?",
      "Which superannuation trustees would co-sponsor a member-communications improvement as a joint initiative?",
    ],
    flowTemplate: "claims",
    scenario: "A TAL claimant learns which single medical form is holding up their income protection claim, and how to get it, without waiting for a case manager callback.",
  },

  "zurich-australia": {
    operatingContext:
      "Zurich Financial Services Australia is the local arm of the Swiss global insurer, and it occupies an unusual dual position: a retail life insurance business substantially enlarged by acquiring the ANZ OnePath life book, plus general and specialty commercial lines distributed through brokers. Both halves are intermediated — advisers place and service the life policies, brokers place the commercial cover — so Zurich's highest-volume conversations are with professional intermediaries rather than end customers. The acquired life book brings a large legacy in-force portfolio with older product terms that advisers must query policy by policy, and legacy policy servicing is exactly the kind of unglamorous, high-repetition workload that never gets prioritised. Global group governance in Zurich sets platform standards and vendor panels within which the Australian business operates.",
    strategicPressure: [
      { text: "Zurich acquired the ANZ OnePath life insurance business in Australia, absorbing a large legacy in-force book with older product generations and separate administration", kind: "verified" },
      { text: "Australian financial advice reforms reshaped adviser economics and reduced adviser numbers, so the remaining advisers manage more clients each and value insurer responsiveness more acutely", kind: "verified" },
      { text: "Legacy in-force books generate persistent, low-value servicing volume — policy terms, beneficiary changes, premium queries — that no modernisation programme ever prioritises", kind: "inference" },
      { text: "Global vendor-panel governance means an Australian deployment must be positioned as compliant with group standards from the first conversation, not retro-fitted later", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led within global governance. Zurich group centralises architecture and vendor selection, so the Australian entity buys inside a panel rather than building or purchasing freely. Adviser-support and legacy-book servicing are adjacencies with clear cost cases, delivered by a partner operating within group-approved cloud and security standards.",
    whyNotBuild:
      "The Australian business is a distribution and underwriting operation, not a technology developer, and any platform build would immediately collide with group architecture governance. Independently it would need speech handling, telephony integration into its adviser and broker service lines, orchestration across acquired legacy administration systems, and an evaluation regime for life-insurance conduct — four capabilities it would have to justify twice, once commercially and once to Zurich.",
    workflows: [
      {
        name: "Adviser support desk",
        friction: "Advisers phone for policy terms, premium calculations, underwriting progress, and alteration processes, and each query pulls a service consultant into a manual lookup across systems the adviser cannot access",
        outcome: "Advisers get grounded answers on policy status and process at any hour, freeing consultants for the complex case work that actually differentiates insurer service",
        channels: ["Voice", "Email", "Adviser portal chat"],
        systems: ["Policy administration", "Underwriting workbench", "Adviser portal", "Document management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Legacy-book policy servicing",
        friction: "Acquired legacy policies carry product terms nobody currently sells, so beneficiary updates, premium queries, and lapse prevention require consultants to interpret old product documentation manually",
        outcome: "Legacy policy questions answered from grounded product documentation and administration data, containing a servicing cost that would otherwise persist for decades",
        channels: ["Voice", "Email", "SMS"],
        systems: ["Legacy policy administration", "Product documentation repository", "Billing/premium collection", "CRM"],
        value: 2,
        complexity: 3,
      },
      {
        name: "Broker commercial-lines servicing",
        friction: "Brokers request certificates of currency, endorsements, and claim status by email into shared inboxes, and turnaround runs to days on transactions requiring no underwriting judgement",
        outcome: "Standard broker transactions completed within delegated authority in-conversation, with genuine underwriting referrals routed cleanly to humans",
        channels: ["Email", "Voice", "Broker portal chat"],
        systems: ["Commercial policy administration", "Document generation", "Claims management platform", "Broker portal"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Adviser and broker portals providing policy, claims, and document access for intermediated distribution",
        "Service consultant teams supporting advisers on retail life and brokers on commercial lines",
        "Legacy administration environments carrying the acquired in-force life portfolio",
        "Digital claims lodgement and document exchange for both life and general lines",
      ],
      gaps: [
        "No after-hours adviser or broker servicing despite intermediaries working outside insurer hours",
        "No grounded conversational access to legacy product terms, so every query needs a human interpreter",
        "No automated certificate and endorsement issuance within delegated authority",
        "No proactive premium-lapse outreach on legacy policies where lapse is silent until it happens",
      ],
    },
    risks: [
      "Zurich global vendor-panel and architecture governance may restrict platform choice and data-processing location, making group approval a gating dependency",
      "The Life Insurance Code of Practice and financial services conduct rules constrain what an automated agent may say about cover, especially anything approaching personal advice",
      "Legacy product terms are inconsistent across acquired books, so grounding sources must be verified per product generation or the agent will confidently state wrong terms",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 7,
      automationRate: 0.45,
      basis: "Seller assumptions for validation: volume estimated from intermediary-facing servicing across a retail life in-force book and commercial lines rather than direct consumer contact, cost reflecting specialist consultant labour, and an automation rate assuming status and process queries automate while advice-adjacent topics escalate.",
    },
    pilotScope:
      "An eight-to-ten week pilot delivering an adviser support desk on voice and email covering policy status, premium queries, and alteration process for the retail life book, grounded in policy administration and product documentation.",
    expansion: [
      "Extend to legacy-book policy servicing including beneficiary changes and lapse-prevention outreach",
      "Add broker commercial-lines certificate and endorsement automation within delegated authority",
      "Introduce claims-status self-service for advisers and brokers across both life and general lines",
    ],
    stakeholders: [
      "Chief Executive Officer Zurich Australia",
      "Head of Life Distribution / Adviser Services",
      "Chief Operating Officer",
      "Chief Information Officer",
      "Head of Compliance and Conduct Risk",
    ],
    discovery: [
      "How many adviser and broker contacts per month are process or status questions rather than case-specific judgement?",
      "What does servicing the acquired legacy in-force book cost you per policy per year, and how is that trending?",
      "What is the actual approval path for an Australian platform selection under Zurich group vendor governance?",
      "How reliable is your product documentation as a grounding source across the different generations in the legacy book?",
    ],
    flowTemplate: "dealer-support",
    scenario: "An adviser asks Zurich at 7pm whether a legacy OnePath policy permits a beneficiary change, and gets the actual product terms read back.",
  },

  "jb-hi-fi": {
    operatingContext:
      "JB Hi-Fi Group is Australia's dominant consumer electronics retailer, running the JB Hi-Fi chain across Australia and New Zealand plus The Good Guys home appliance business, and it is culturally defined by an obsessive focus on cost of doing business — a low-cost operating model is explicitly how it out-earns competitors on similar revenue. Its online business is substantial and its click-and-collect proposition is a core strength, which means a very large volume of order-status, collection, and delivery contacts. The Good Guys adds a materially different contact profile: large appliances requiring home delivery, installation, and old-appliance removal, where scheduling and exceptions generate long, complex conversations. Customers reach it through store staff, a customer-care contact operation, web chat, and email, and warranty and returns queries persist long after the sale.",
    strategicPressure: [
      { text: "JB Hi-Fi Group operates and publicly emphasises a low cost-of-doing-business model as its central competitive advantage against other electronics and appliance retailers", kind: "verified" },
      { text: "The group acquired The Good Guys, adding a home-delivery and installation-heavy appliance business with a fundamentally different service profile from small-format electronics retail", kind: "verified" },
      { text: "Post-purchase contact — order status, delivery scheduling, warranty, returns — is pure cost in a retail model that has already priced the margin, so it is the clearest automation target in the group", kind: "inference" },
      { text: "Peak trading periods around Black Friday, Christmas, and end-of-financial-year concentrate delivery-exception volume into weeks when store and care teams are already at capacity", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A retailer whose entire strategic identity is cost discipline does not fund speculative platform engineering; it buys proven capability with a measurable payback. JB Hi-Fi's technology investment goes into merchandising, supply chain, and online conversion where it drives revenue, and there is no public evidence of conversational-AI engineering capability inside the group.",
    whyNotBuild:
      "The cost-of-doing-business logic answers this by itself: hiring speech, telephony, orchestration, and evaluation engineers to serve a customer-care function is exactly the kind of overhead the group's model exists to avoid. Retail contact volume is also seasonal and spiky, which suits usage-based purchased capacity far better than a fixed internal team sized for peak.",
    workflows: [
      {
        name: "Order status and click-and-collect coordination",
        friction: "Customers call and chat asking whether an online order is ready, which store holds it, and why the confirmation has not arrived, and each query needs an agent to check order and store systems",
        outcome: "Instant grounded order and collection status in any channel, with peak-season contact absorbed without adding seasonal care headcount",
        channels: ["Voice", "Web chat", "SMS", "Email"],
        systems: ["Order management system", "Store inventory", "Fulfilment/logistics", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "The Good Guys delivery and installation scheduling",
        friction: "Appliance deliveries need date windows, access details, installation requirements, and old-appliance removal confirmed, and rescheduling requires a call to a team that then calls the carrier",
        outcome: "Delivery windows confirmed, rescheduled, and installation requirements captured in-conversation, cutting failed deliveries and the repeat contacts they generate",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Order management system", "Delivery/installation scheduling", "Third-party carrier feeds", "Store systems"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Warranty, returns, and extended-care claims",
        friction: "Customers with a faulty product face a maze of manufacturer warranty, consumer guarantee, and extended-care entitlements, and staff spend long calls establishing which applies before anything happens",
        outcome: "Entitlement determined conversationally from purchase records and policy rules, with the correct return, repair, or replacement path initiated immediately",
        channels: ["Voice", "Web chat", "Email"],
        systems: ["Point of sale / purchase history", "Extended-care policy administration", "Service/repair agent network", "Returns management"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Established online storefronts for JB Hi-Fi and The Good Guys with order tracking pages",
        "Click-and-collect fulfilment across a large store network in Australia and New Zealand",
        "A customer-care contact operation handling phone, email, and web chat enquiries",
        "Extended-care and warranty programmes with associated claims and repair processes",
      ],
      gaps: [
        "No conversational channel that resolves a delivery exception without a human intermediating the carrier",
        "No proactive notification when a delivery or installation is at risk of missing its window",
        "No automated entitlement determination across consumer guarantees, manufacturer warranty, and extended care",
        "No elastic capacity for the peak trading weeks that generate the year's worst service experience",
      ],
    },
    risks: [
      "Australian Consumer Law guarantees are non-excludable, so any automated statement about repair, replacement, or refund entitlement must be legally accurate or it creates regulatory and reputational exposure",
      "The Privacy Act governs customer purchase and contact data, and any loyalty or purchase-history grounding must be consistent with disclosed collection purposes",
      "Contact volume is severely seasonal, so commercial design must handle peak elasticity without paying for peak capacity year-round",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 5,
      automationRate: 0.6,
      basis: "Seller assumptions to validate: volume estimated from combined JB Hi-Fi and The Good Guys online and post-purchase contact across Australia and New Zealand, cost reflecting retail customer-care labour below financial-services rates, and a high automation rate given the transactional nature of order and delivery queries.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating order status and click-and-collect coordination across voice, chat, and SMS for the JB Hi-Fi online business, integrated to order management and store inventory, timed ahead of peak trading.",
    expansion: [
      "Extend to The Good Guys delivery and installation scheduling including proactive exception notification",
      "Add warranty, returns, and extended-care entitlement determination with automated repair booking",
      "Introduce proactive peak-season delivery-risk outreach across both banners",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Chief Information Officer",
      "General Manager Customer Care",
      "Chief Operating Officer / Supply Chain Director",
      "Managing Director The Good Guys",
    ],
    discovery: [
      "What is your contact rate per online order, and how does it differ between JB Hi-Fi and The Good Guys?",
      "How many contacts does a single failed or rescheduled appliance delivery generate end to end?",
      "What does your customer-care cost curve look like through November and December versus a normal month?",
      "How much agent time goes into establishing whether a faulty-product claim falls under consumer guarantees, manufacturer warranty, or extended care?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Good Guys customer reschedules a fridge delivery and confirms old-appliance removal in one message, without a call to the carrier.",
  },

  "harvey-norman": {
    operatingContext:
      "Harvey Norman is a furniture, bedding, electrical, and computing retailer built on an unusual structure: most Australian stores are operated by independent franchisees under the Harvey Norman brand, with the listed company acting as franchisor and property owner while also running company-operated stores overseas. That franchise model means the customer buys from a franchisee, the delivery is often arranged locally, and after-sales service quality varies store by store even though the complaint lands on the national brand. Bulky goods dominate its mix — lounges, beds, whitegoods — so home delivery scheduling, assembly, installation, and damage-in-transit claims are core operational communications rather than edge cases. Customers contact individual stores by phone, the national website, and store-level email, which fragments the experience precisely where consistency matters most.",
    strategicPressure: [
      { text: "Harvey Norman's Australian operations run predominantly on a franchisee model with independently operated stores under a common brand, so service delivery is structurally decentralised", kind: "verified" },
      { text: "Bulky-goods retail depends on home delivery and installation, which generates far higher post-purchase contact per order than small-format retail", kind: "inference" },
      { text: "Franchise fragmentation means the brand absorbs complaint and review damage caused by inconsistent store-level service it does not directly control", kind: "inference" },
      { text: "A central service layer offered to franchisees is a franchisor value-add, but adoption depends on franchise-agreement leverage that must be established before scoping", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Neither the franchisor nor any individual franchisee has the engineering capacity or the incentive to build conversational infrastructure, and the franchise structure actively prevents the kind of concentrated technology investment a build requires. A purchased central layer that franchisees consume is the only structurally coherent model.",
    whyNotBuild:
      "A franchisor's technology role is to provide shared services, not to run an AI engineering function, and no franchisee operating a handful of stores could fund speech, telephony, orchestration, and evaluation capability. The economics only work as a shared, purchased capability with per-store consumption, which is exactly how franchise systems buy everything else.",
    workflows: [
      {
        name: "Bulky-goods delivery scheduling and rescheduling",
        friction: "Customers wait for a store to call with a delivery window, then need to change it, and the store must contact the carrier separately — a three-party phone chain for a date change",
        outcome: "Delivery windows offered, confirmed, and changed directly with the customer against live carrier capacity, removing store staff from the middle of every scheduling conversation",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Order management", "Delivery scheduling", "Third-party carrier feeds", "Store/franchisee systems"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Warranty and damage-claim intake",
        friction: "A damaged lounge or faulty appliance triggers a claim handled differently by each store, with photos emailed, forms inconsistent, and the customer chasing whoever answers",
        outcome: "Consistent structured claim intake with photos captured in-conversation and routed to the right store, supplier, or service agent, standardising the worst-experience moment across the network",
        channels: ["Voice", "SMS", "Web chat", "Email"],
        systems: ["Order management", "Supplier warranty interfaces", "Service agent network", "Store/franchisee systems"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Store-level product and stock enquiries",
        friction: "Customers ring individual stores to ask whether an item is in stock, what the lead time is, and whether it can be delivered by a date, tying up sales staff who should be selling on the floor",
        outcome: "Stock, lead-time, and delivery-window questions answered instantly across the network, keeping franchisee sales staff on the floor with customers who are ready to buy",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Inventory management", "Supplier lead-time data", "Store/franchisee systems", "Delivery scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national website with product catalogue and online ordering alongside franchisee store operations",
        "Store-level phone and email contact handled by franchisee staff",
        "Established third-party delivery and installation arrangements for bulky goods",
        "Supplier warranty and service-agent networks for repairs across major appliance and furniture brands",
      ],
      gaps: [
        "No consistent national service experience, because each franchisee handles contact its own way",
        "No customer-facing delivery self-service, so every scheduling change requires staff on both sides",
        "No standardised warranty and damage-claim intake across the store network",
        "No after-hours contact capability, despite bulky-goods buyers being working households",
      ],
    },
    risks: [
      "Franchise agreements determine whether the franchisor can mandate a shared service platform, and without that authority adoption becomes voluntary and fragmented",
      "Australian Consumer Law guarantees apply regardless of franchisee arrangements, so automated statements about repair, replacement, or refund entitlement must be legally accurate",
      "Customer data sits across franchisor and franchisee boundaries, so Privacy Act obligations and data-sharing arrangements must be resolved before any unified customer view is built",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 5,
      automationRate: 0.55,
      basis: "Seller assumptions requiring validation: volume estimated across the Australian franchisee store network's aggregate customer contact, cost reflecting retail store-staff time diverted to service calls, and an automation rate assuming delivery and stock enquiries automate while negotiation and complex claims stay human.",
    },
    pilotScope:
      "An eight-week pilot with a defined franchisee cluster in one state automating bulky-goods delivery scheduling and rescheduling on voice and SMS, integrated to order management and carrier feeds, measured on failed-delivery rate and store staff time recovered.",
    expansion: [
      "Extend warranty and damage-claim intake with standardised photo capture across the pilot region",
      "Roll the shared service layer across the national franchisee network with per-store consumption",
      "Add stock, lead-time, and delivery-window enquiry handling to keep sales staff on the floor",
    ],
    stakeholders: [
      "Chief Executive Officer / Executive Director",
      "Chief Information Officer",
      "General Manager Franchise Operations",
      "National Logistics and Delivery Manager",
      "General Manager Marketing",
    ],
    discovery: [
      "Under the franchise agreements, can the franchisor mandate a shared customer-service platform, or is adoption store by store?",
      "How many customer contacts does a single bulky-goods delivery generate from order to installation?",
      "How much franchisee sales-staff time is currently spent on phone service rather than selling on the floor?",
      "Where does customer data sit legally between the franchisor and franchisees, and what can be shared into a central service layer?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Harvey Norman customer moves a bedroom-suite delivery to Saturday and adds assembly, without the store phoning the carrier.",
  },

  "myer": {
    operatingContext:
      "Myer is Australia's largest department store group, operating a national store network alongside a substantial and strategically central online business, and it has recently absorbed the Premium Brands apparel portfolio, broadening it from a pure department-store operator into a multi-brand retail group. Its Myer One loyalty programme is one of the largest in Australian retail with millions of members, and loyalty points, tier status, and rewards questions form a persistent contact stream entirely separate from purchase transactions. Its online growth means order status, delivery, click-and-collect, and returns dominate customer-care volume, with severe concentration around Christmas, stocktake sales, and Click Frenzy-style events. Customers reach it through web chat, phone, email, social channels, and in-store service desks that absorb service work the online channel could not complete.",
    strategicPressure: [
      { text: "Myer operates the Myer One loyalty programme, one of the largest retail loyalty bases in Australia, generating continuous points, tier, and rewards enquiries", kind: "verified" },
      { text: "Myer expanded beyond department stores by acquiring the Premium Brands apparel portfolio, adding separate brand customer bases and service expectations to the group", kind: "verified" },
      { text: "Department-store retail is under structural margin pressure, making customer-care cost a live board-level efficiency target rather than a service-quality debate alone", kind: "inference" },
      { text: "Sale-event concentration means a large share of annual service pain occurs in a handful of weeks that fixed rostering cannot economically cover", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Myer is a turnaround retailer directing capital toward store refurbishment, online capability, and supply chain, with no plausible case for funding conversational-platform engineering. Its technology function consumes vendor platforms across commerce, loyalty, and fulfilment, and a bought conversational layer fits that established pattern with a payback it can put in front of a board.",
    whyNotBuild:
      "A retailer under margin pressure cannot fund four specialist engineering disciplines to answer where-is-my-order questions. Peak-driven volume also makes fixed internal capacity economically wrong: it must be sized for Christmas and idle in February. Purchased, usage-based capability matches the demand curve that retail actually has.",
    workflows: [
      {
        name: "Online order status, delivery, and returns",
        friction: "Order tracking pages go stale between carrier scans, so customers escalate to chat and phone, and returns questions require agents to interpret policy against purchase channel and product category",
        outcome: "Live order truth and policy-correct returns guidance delivered instantly in any channel, with returns initiated in-conversation rather than deferred to a form",
        channels: ["Web chat", "Voice", "SMS", "Email"],
        systems: ["Order management system", "Carrier tracking feeds", "Returns management", "Point of sale / purchase history"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Myer One loyalty servicing",
        friction: "Members ask about missing points, tier status, expiring rewards, and credit redemption, and these queries need agents to reconcile transactions across store and online purchases",
        outcome: "Loyalty queries resolved instantly with points reconciled and rewards explained, converting a cost-generating contact into a redemption and repurchase prompt",
        channels: ["Web chat", "Voice", "Mobile app", "Email"],
        systems: ["Loyalty platform", "Point of sale / purchase history", "Customer data platform", "eCommerce platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Sale-event contact surge handling",
        friction: "Stocktake and Christmas events multiply contact volume while stock, pricing, and delivery questions all peak together, and temporary staff take weeks to become useful",
        outcome: "Peak volume absorbed without seasonal recruitment, with consistent answers on stock, pricing, and delivery timing through the weeks that define annual customer sentiment",
        channels: ["Web chat", "Voice", "SMS", "Social messaging"],
        systems: ["eCommerce platform", "Inventory management", "Order management system", "Carrier tracking feeds"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national eCommerce platform with order tracking and click-and-collect fulfilment from stores",
        "The Myer One loyalty programme with app, digital card, and rewards redemption",
        "A customer-care operation handling phone, email, web chat, and social messaging",
        "In-store service desks that absorb returns, exchanges, and loyalty queries face to face",
      ],
      gaps: [
        "No conversational channel that resolves a delivery exception rather than restating the tracking page",
        "No instant reconciliation of missing loyalty points across store and online purchases",
        "No elastic service capacity for the sale events that generate most annual contact volume",
        "No unified customer view across the department-store and acquired premium-brand customer bases",
      ],
    },
    risks: [
      "Australian Consumer Law guarantees are non-excludable, so automated returns and refund guidance must be accurate regardless of the store's own policy framing",
      "Loyalty data is personal information under the Privacy Act, and use of purchase history for personalisation must stay within disclosed collection purposes and member consent",
      "Peak-season accuracy risk is elevated: wrong stock or delivery-date statements during sale events generate complaint volume that outweighs the deflection benefit",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 4.5,
      automationRate: 0.6,
      basis: "Seller assumptions to validate: volume estimated from online order contact plus a multi-million-member loyalty base, cost reflecting retail customer-care labour with a partly offshore mix, and a high automation rate given the transactional and repetitive nature of order and loyalty enquiries.",
    },
    pilotScope:
      "An eight-week pilot automating online order status, delivery exceptions, and returns initiation across web chat and voice, integrated to order management and carrier feeds, deployed before the peak trading season.",
    expansion: [
      "Extend to Myer One loyalty servicing including points reconciliation and rewards explanation",
      "Add proactive delivery-risk outreach and sale-event surge handling across all channels",
      "Introduce servicing for the acquired premium-brand customer bases on the same governed layer",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Customer Officer",
      "Chief Information Officer",
      "General Manager Customer Service",
      "Chief Financial Officer",
    ],
    discovery: [
      "What is your contact rate per online order, and how much of it is delivery status the tracking page failed to answer?",
      "How many Myer One contacts each month concern missing points or reward redemption rather than a purchase?",
      "What does customer-care volume and cost look like across stocktake and Christmas versus a baseline month?",
      "How separately are the acquired premium brands serviced today, and is there a case for one shared layer?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Myer One member asks why points from a Boxing Day in-store purchase are missing, and gets them reconciled in the conversation.",
  },

  "david-jones": {
    operatingContext:
      "David Jones is Australia's premium department store, operating a smaller and more carefully curated store network than its mass-market rival after years of rationalisation, and now privately owned following its exit from Woolworths Holdings of South Africa. Its positioning depends on service quality: premium customers paying premium prices expect responsive handling of orders, alterations, personal shopping, and returns, and a service failure is far more damaging to a luxury proposition than to a discounter. Its online business carries a high average order value with concierge-style expectations, and its beauty, designer apparel, and homewares categories generate distinct service patterns including alterations, made-to-order timelines, and authentication questions. Customers reach it through in-store service desks and personal shoppers, an online customer-care team, phone, and email.",
    strategicPressure: [
      { text: "David Jones exited Woolworths Holdings South Africa ownership into private equity hands, bringing renewed focus on profitability and disciplined cost management", kind: "verified" },
      { text: "The store network has been rationalised and refocused on flagship locations, shifting a greater share of customer relationship weight onto digital and remote service channels", kind: "verified" },
      { text: "A premium proposition raises the service-failure cost asymmetrically: the same delivery delay damages a luxury brand far more than a discount one", kind: "inference" },
      { text: "Private-equity ownership sharpens appetite for cost initiatives with measurable payback inside a hold period, favouring bought capability over multi-year builds", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A private-equity-owned retailer running a profitability programme directs capital to trading, store experience, and supply chain, not to platform engineering with a multi-year horizon. David Jones has no conversational-AI capability of its own and every structural reason to purchase a measurable one.",
    whyNotBuild:
      "The ownership model makes the answer explicit: capital is allocated against a return horizon that a speech-and-orchestration engineering build cannot meet. Building would also mean owning evaluation for a brand where a single wrong answer to a premium customer is disproportionately costly — a risk far better held by a vendor with a tested evaluation regime than by a retail technology team learning it.",
    workflows: [
      {
        name: "Premium order service and delivery coordination",
        friction: "High-value online orders generate anxious status enquiries, and delivery coordination for furniture, made-to-order, and designer items requires staff to chase suppliers and carriers manually",
        outcome: "Concierge-quality order status and delivery coordination available instantly at any hour, matching the service level the price point implies",
        channels: ["Voice", "Web chat", "SMS", "Email"],
        systems: ["Order management system", "Supplier/concession interfaces", "Carrier tracking feeds", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Returns, exchanges, and alterations",
        friction: "Returns spanning online, in-store, and concession purchases follow different rules, and alterations bookings and collection notifications are handled manually by store teams",
        outcome: "Correct return path determined instantly from purchase record, and alterations booked and collection notified conversationally without tying up store staff",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Returns management", "Point of sale / purchase history", "Concession partner systems", "Alterations scheduling"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Loyalty and personal-shopping engagement",
        friction: "Loyalty benefits, event invitations, and personal-shopping appointments depend on individual staff relationships, so engagement drops whenever a stylist changes or a customer moves channel",
        outcome: "Consistent loyalty servicing and appointment booking that survives staff turnover, with personal shoppers focused on styling rather than scheduling",
        channels: ["Voice", "SMS", "Web chat", "Email"],
        systems: ["Loyalty platform", "Appointment scheduling", "CRM", "Customer data platform"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An eCommerce platform with order tracking serving a high average-order-value customer base",
        "In-store personal shopping and styling services alongside service desks in flagship stores",
        "A loyalty programme with tiered benefits and member events",
        "Concession and supplier arrangements covering a significant share of the merchandise mix",
      ],
      gaps: [
        "No after-hours service channel, despite premium customers shopping in the evening",
        "No unified returns handling across online, own-buy, and concession purchases",
        "No automated alterations booking or collection notification",
        "No continuity of customer context when a personal shopper leaves or the customer changes channel",
      ],
    },
    risks: [
      "Australian Consumer Law guarantees apply irrespective of premium positioning, so returns and refund guidance must be accurate and not misstated as goodwill",
      "Concession merchandise involves third-party retailers, so return and refund authority differs by product and must be resolved before automation can act",
      "Brand-tone risk is elevated in a premium context: an automated conversation that reads as generic damages the proposition more than the cost it saves",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 5.5,
      automationRate: 0.5,
      basis: "Seller assumptions for discovery: volume estimated from a smaller but higher-value customer base than mass-market department retail, cost reflecting Australian premium-service labour, and a moderate automation rate acknowledging that premium expectations require generous human escalation.",
    },
    pilotScope:
      "An eight-week pilot covering premium online order status and delivery coordination across voice and chat, integrated to order management and carrier feeds, with a brand-tone review gate and immediate human escalation on any dissatisfaction signal.",
    expansion: [
      "Extend to returns and exchanges across online, own-buy, and concession purchase paths",
      "Add alterations booking, collection notification, and personal-shopping appointment scheduling",
      "Introduce loyalty servicing and event-invitation management on the same governed layer",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Customer Officer",
      "Chief Information Officer",
      "General Manager Retail Operations",
      "Chief Financial Officer",
    ],
    discovery: [
      "What does a service failure on a high-value order cost you in lifetime value for this customer segment?",
      "How are returns handled differently across own-buy and concession merchandise, and where does that confuse customers?",
      "How much store and personal-shopper time goes into scheduling and status rather than selling and styling?",
      "What brand-tone standard would an automated conversation need to meet before your marketing leadership would approve it?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A David Jones customer confirms an evening delivery window for a designer order and books alterations, at 10pm, without a callback.",
  },

  "chemist-warehouse": {
    operatingContext:
      "Chemist Warehouse is Australia's dominant discount pharmacy network, now part of a listed group following its merger with Sigma Healthcare, and it operates hundreds of stores under a franchise-style model with a shared brand, buying power, and marketing engine. Its economics rest on volume and low price, and its pharmacy operations dispense prescriptions at a scale unmatched in the country, which makes script-related communication the single highest-frequency retail-health touchpoint in Australia. Every script generates a potential contact: is it ready, is the item in stock, is a repeat due, has the prescription expired, has the doctor sent the electronic token. Customers reach stores by phone at enormous volume, plus a large online store for front-of-shop products with its own order and delivery contact stream, and pharmacy staff answer these calls while dispensing.",
    strategicPressure: [
      { text: "Chemist Warehouse merged with Sigma Healthcare to form a listed pharmacy group, bringing public-market scrutiny of margins and operating efficiency to a previously private operator", kind: "verified" },
      { text: "Australia's shift to electronic prescriptions and token-based scripts changed the mechanics of dispensing and created new categories of patient confusion about tokens, repeats, and transfers", kind: "verified" },
      { text: "Pharmacist time is the network's scarcest and most regulated resource, so every minute a pharmacist spends answering a script-status phone call is dispensing capacity lost", kind: "inference" },
      { text: "Sixty-day dispensing and other PBS policy changes have altered repeat cadence and generated a wave of patient questions that store staff absorb one call at a time", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The group's competitive engine is buying power, store economics, and marketing, not software engineering, and a discount-model operator has no path to justifying an internal AI platform team. Its technology is procured across dispensing, point of sale, and eCommerce, and conversational automation would follow the same route with a payback measured in pharmacist hours returned to dispensing.",
    whyNotBuild:
      "A pharmacy group's scarce resource is registered pharmacists, not engineers, and no amount of internal build changes that. A build would require speech handling across a highly multicultural customer base, telephony into hundreds of store phone lines, orchestration into dispensing systems, and clinical-safety evaluation — with a regulatory failure mode that is patient harm rather than customer annoyance. That evaluation discipline belongs with a vendor that does it continuously.",
    workflows: [
      {
        name: "Script-ready notification and status",
        friction: "Patients phone the store to ask whether a script is ready, and a pharmacy assistant or pharmacist interrupts dispensing to check the queue and read back a status",
        outcome: "Ready notifications pushed automatically and status questions answered instantly, removing the highest-frequency call type from pharmacy floors across the network",
        channels: ["Voice", "SMS", "Mobile app"],
        systems: ["Dispensing system", "Electronic prescription/token services", "Store queue management", "Customer contact records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Repeat-prescription reminders and reordering",
        friction: "Patients on ongoing medication run out because nothing reminds them a repeat is due, then call in a hurry or present without a valid script, creating urgent workload and adherence gaps",
        outcome: "Timed repeat reminders with reordering handled in-conversation, improving adherence and smoothing dispensing workload away from the counter rush",
        channels: ["SMS", "Voice", "Mobile app"],
        systems: ["Dispensing system", "Electronic prescription services", "Repeat/reorder scheduling", "Store inventory"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Stock, price, and online order enquiries",
        friction: "Front-of-shop stock checks, price questions, and online-order delivery enquiries land on the same store phone line as clinical queries, so pharmacy staff triage retail questions all day",
        outcome: "Retail enquiries handled entirely outside the pharmacy phone line, with clinical questions cleanly routed to a pharmacist rather than queued behind stock checks",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Store inventory", "eCommerce platform", "Order management", "Point of sale"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A large online store with delivery and click-and-collect for front-of-shop products",
        "Dispensing systems integrated with Australia's electronic prescription infrastructure",
        "Store-level phone lines handling both clinical and retail enquiries",
        "SMS notification capability for prescription readiness in at least part of the network",
      ],
      gaps: [
        "No conversational channel that answers script status without interrupting pharmacy staff",
        "No systematic repeat-due reminder and reorder conversation across the patient base",
        "No separation of retail enquiries from the pharmacy phone line, so both degrade together",
        "No multilingual servicing despite a highly multicultural customer base in metropolitan stores",
      ],
    },
    risks: [
      "Pharmacy practice regulation and state poisons legislation strictly limit what may be communicated about medicines, so an automated agent must be confined to logistics and never provide clinical advice",
      "Health and prescription information is sensitive information under the Privacy Act, requiring strong identity verification before any script detail is disclosed",
      "Franchise and store-ownership structures determine who controls patient data and store phone lines, which must be resolved before any network-wide deployment",
    ],
    economics: {
      volumeMonthly: 2000000,
      costPerInteraction: 4,
      automationRate: 0.65,
      basis: "Seller assumptions requiring validation: volume estimated from script-related contact across hundreds of high-throughput pharmacies plus online retail orders, cost reflecting pharmacy assistant and pharmacist time rather than contact-centre labour, and a high automation rate reflecting the highly repetitive logistics nature of script-status contact.",
    },
    pilotScope:
      "A ten-week pilot across a defined store cluster automating script-ready notification and script-status enquiries on voice and SMS, integrated to the dispensing system with strict clinical-question escalation to a pharmacist, measured on pharmacy phone-call volume and staff time returned.",
    expansion: [
      "Extend to repeat-prescription reminders and reordering across the pilot region's patient base",
      "Add multilingual servicing for metropolitan stores with high non-English-speaking customer populations",
      "Roll retail stock, price, and online-order enquiry handling across the national network",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer / Director of Pharmacy",
      "Chief Information Officer",
      "General Manager Retail Operations",
      "Head of Professional Services / Chief Pharmacist",
    ],
    discovery: [
      "How many phone calls does an average store take per day, and what share are script-status questions?",
      "How much pharmacist and assistant time per store per week goes to answering the phone rather than dispensing?",
      "Which patient data and store phone lines are controlled centrally versus by individual store owners?",
      "What does your professional-services leadership require as the hard boundary between logistics information and clinical advice?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Chemist Warehouse customer is told their script is ready and their repeat is due, without a pharmacist leaving the dispensing bench.",
  },

  "super-retail-group": {
    operatingContext:
      "Super Retail Group operates four distinct specialty retail banners — Supercheap Auto in automotive parts and accessories, rebel in sport, BCF in boating camping and fishing, and Macpac in outdoor apparel — across Australia and New Zealand, on shared corporate, supply chain, and digital infrastructure. Its loyalty club programmes across those banners hold roughly eleven million members, and club membership drives a very high proportion of sales, which makes loyalty servicing a first-order contact category rather than a peripheral one. Its online and click-and-collect volumes are substantial, and its product mix creates banner-specific service patterns: fitment and compatibility questions in auto parts, sizing and stock in sport and outdoor, and seasonal surges around camping and fishing seasons. Customers reach it through store teams, banner-specific contact channels, apps, and web chat.",
    strategicPressure: [
      { text: "Super Retail Group operates loyalty club programmes across its banners with a combined membership in the order of eleven million, and club members account for a large majority of sales", kind: "verified" },
      { text: "Four banners on shared corporate infrastructure means one conversational layer can serve four customer bases, a structural efficiency single-brand retailers do not have", kind: "inference" },
      { text: "Automotive parts enquiries involve vehicle-fitment complexity that generates long, expertise-dependent conversations disproportionate to the transaction value", kind: "inference" },
      { text: "Seasonal peaks differ by banner — camping and fishing, sport seasons, holiday travel — so aggregate service demand is spiky in several distinct patterns across the year", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Super Retail Group's technology investment goes into eCommerce, loyalty, and supply chain where it drives sales, and there is no public evidence of conversational-platform engineering. A shared services model across four banners is precisely the structure that favours buying one governed capability and configuring it per brand rather than building anything.",
    whyNotBuild:
      "Building would mean funding speech, telephony, orchestration, and evaluation engineering to serve retail service enquiries across four brands — overhead that a specialty retailer's margin structure cannot carry. The multi-banner configuration requirement also argues for a platform designed for multi-tenancy rather than a bespoke build that would need replicating four times.",
    workflows: [
      {
        name: "Cross-banner order and click-and-collect servicing",
        friction: "Order status, collection readiness, and delivery exception questions are handled separately per banner, duplicating effort on identical conversation shapes across four brands",
        outcome: "One governed conversational layer serving all four banners with brand-appropriate tone and banner-specific rules, eliminating duplicated servicing effort",
        channels: ["Voice", "Web chat", "SMS", "Mobile app"],
        systems: ["Order management system", "Store inventory", "Carrier tracking feeds", "eCommerce platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Loyalty club servicing across eleven million members",
        friction: "Members ask about points, tier benefits, expiring rewards, and club pricing across four programmes, and each query requires an agent to check the loyalty platform and explain banner-specific rules",
        outcome: "Instant loyalty answers with rewards surfaced proactively, converting service contacts into redemption and repeat-purchase moments across the club base",
        channels: ["Voice", "Mobile app", "Web chat", "SMS"],
        systems: ["Loyalty platform", "Point of sale / purchase history", "Customer data platform", "eCommerce platform"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Automotive fitment and product-compatibility enquiries",
        friction: "Customers call Supercheap Auto stores asking whether a part fits a specific vehicle, and staff work through catalogue lookups while the customer waits and other customers queue at the counter",
        outcome: "Fitment and compatibility answered instantly from catalogue data with stock and store location confirmed, keeping store staff serving the counter",
        channels: ["Voice", "Web chat", "Mobile app"],
        systems: ["Product catalogue / fitment database", "Store inventory", "eCommerce platform", "Point of sale"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "eCommerce platforms and apps across all four banners with click-and-collect fulfilment",
        "Large loyalty club programmes with member pricing and rewards across the banners",
        "Customer contact teams handling phone, chat, and email service per banner",
        "Vehicle-fitment catalogue data supporting automotive parts selection",
      ],
      gaps: [
        "No shared conversational layer across banners, so identical workflows are staffed four times",
        "No instant loyalty resolution for points, tier, and reward questions across eleven million members",
        "No customer-facing fitment lookup that works conversationally rather than through catalogue navigation",
        "No proactive delivery-exception outreach across the group's online orders",
      ],
    },
    risks: [
      "Australian Consumer Law guarantees apply across all banners, so automated statements about returns, refunds, and product suitability must be accurate",
      "Loyalty and purchase data is personal information under the Privacy Act, and cross-banner data use must remain within disclosed collection purposes and member consent",
      "Fitment advice carries safety implications in automotive parts, so compatibility statements must be grounded in verified catalogue data with clear limits",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 4.5,
      automationRate: 0.6,
      basis: "Seller assumptions to validate in discovery: volume aggregated across four banners' online order and loyalty contact in Australia and New Zealand, cost reflecting specialty-retail service labour, and a high automation rate given the transactional and repetitive nature of order and loyalty enquiries.",
    },
    pilotScope:
      "An eight-to-ten week pilot delivering order status, click-and-collect coordination, and loyalty servicing for one banner across voice and chat, architected for multi-banner configuration from the outset.",
    expansion: [
      "Extend the same governed layer to the remaining three banners with brand-specific tone and rules",
      "Add automotive fitment and compatibility enquiry handling for Supercheap Auto stores",
      "Introduce proactive delivery-exception and seasonal-campaign outreach across the club base",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Chief Digital and Technology Officer",
      "Group General Manager Customer and Loyalty",
      "Managing Director Supercheap Auto",
      "General Manager Customer Service Operations",
    ],
    discovery: [
      "Are your service operations genuinely shared across the four banners today, or staffed separately per brand?",
      "What share of contact volume across the group concerns loyalty points, tiers, and rewards rather than orders?",
      "How much store-staff time at Supercheap Auto goes to fitment lookups on the phone rather than serving the counter?",
      "How do your seasonal peaks stack across banners, and where does aggregate service demand actually break?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A BCF club member checks a click-and-collect order and their expiring loyalty reward before a long-weekend camping trip, in one conversation.",
  },

  "dominos-anz": {
    operatingContext:
      "Domino's Pizza Enterprises is the master franchisee for the Domino's brand across Australia and New Zealand plus a set of European and Asian markets, and it is genuinely a technology-forward operator: digital ordering, GPS driver tracking, and app-based experiences have been central to its growth story for well over a decade. Its ANZ business is franchisee-operated at store level, so the customer orders through a corporate digital platform but the fulfilment, and the complaint, land with an individual franchisee. When an order is late, wrong, or missing, the customer calls the store — interrupting a kitchen mid-peak — or contacts the brand, which then has to reach the store. It also runs franchise recruitment and franchisee support functions that generate their own steady enquiry stream distinct from consumer contact.",
    strategicPressure: [
      { text: "Domino's Pizza Enterprises has built its growth story on proprietary digital ordering and delivery-tracking technology, making it an unlikely buyer of anything resembling core ordering capability", kind: "verified" },
      { text: "The group has been through a period of store closures and network rationalisation across several markets, sharpening focus on franchisee profitability and unit economics", kind: "verified" },
      { text: "Order-exception calls hit stores during peak trading, when the labour interrupted is kitchen and delivery capacity rather than dedicated service staff", kind: "inference" },
      { text: "Franchisee support enquiries — supply, systems, compliance, marketing — are a second volume stream that head-office teams absorb with no self-service layer", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led and narrowly scoped. Domino's builds its own ordering and tracking technology and will not buy anything adjacent to it, so a proposal touching the ordering journey is dead on arrival. The credible engagement is the service side it has not built: order-exception resolution and franchisee support, delivered as a layer alongside its own stack rather than competing with it.",
    whyNotBuild:
      "Domino's could build this — it has real engineering capability — but its engineering roadmap is committed to ordering, delivery logistics, and store operations technology that directly drives sales. Conversational service infrastructure for exceptions and franchisee support is off that critical path, and the group has consistently prioritised revenue-generating digital capability over service-side tooling. Partnering delivers it without a roadmap fight.",
    workflows: [
      {
        name: "Order-exception resolution",
        friction: "Late, wrong, or missing orders trigger a call to the store phone during the dinner peak, pulling a manager off the make line to negotiate a remake or refund with no consistent policy",
        outcome: "Exceptions resolved conversationally against a governed remake-and-refund policy with the store notified automatically, keeping kitchen staff on the make line during peak",
        channels: ["Voice", "SMS", "Mobile app", "Web chat"],
        systems: ["Order management / POS", "Delivery tracking", "Payments and refunds", "Store operations system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Franchisee support desk",
        friction: "Franchisees contact head office about supply orders, systems issues, marketing collateral, and compliance requirements, and enquiries queue behind each other in business hours while stores operate at night",
        outcome: "Franchisees get grounded answers on process, supply, and systems around their actual trading hours, freeing support teams for genuine escalations",
        channels: ["Voice", "Web chat", "Email"],
        systems: ["Franchise management system", "Supply chain ordering", "Knowledge base", "IT service management"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Delivery-status and ETA enquiries",
        friction: "Despite GPS tracking, customers still call stores asking where the driver is, particularly when the tracker stalls or the estimate slips, and those calls concentrate exactly at peak",
        outcome: "Live delivery status and revised ETAs delivered conversationally with proactive notification when an order slips, suppressing peak-time store calls",
        channels: ["Voice", "SMS", "Mobile app"],
        systems: ["Delivery tracking", "Order management / POS", "Driver dispatch", "Store operations system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A proprietary digital ordering platform and app carrying the majority of orders",
        "GPS-based delivery tracking with customer-facing order progress visibility",
        "Store-level phone lines that absorb consumer exception calls during trading",
        "Head-office franchisee support functions covering supply, systems, and marketing",
      ],
      gaps: [
        "No consistent, policy-governed handling of order exceptions across franchisee stores",
        "No customer contact channel that keeps exception calls off the store phone during peak",
        "No after-hours self-service for franchisees whose trading hours differ from head office",
        "No proactive notification when a tracked delivery slips beyond its estimate",
      ],
    },
    risks: [
      "Franchise agreements govern whether head office can standardise customer-service handling and refund authority across independently operated stores",
      "Australian Consumer Law applies to food orders, so remake and refund decisioning must be consistent with guarantee obligations rather than discretionary goodwill alone",
      "Any proposal perceived as overlapping the group's own ordering technology roadmap will be rejected internally, so scope discipline is a commercial requirement",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 4,
      automationRate: 0.6,
      basis: "Seller assumptions to validate: volume estimated from order-exception and delivery-status contact across the ANZ store network at typical QSR exception rates, cost reflecting store-manager and crew time interrupted at peak rather than contact-centre labour, and a high automation rate given the narrow, transactional nature of exception handling.",
    },
    pilotScope:
      "An eight-week pilot in one metropolitan region routing order-exception and delivery-status contact away from store phones into a governed conversational layer with automated remake and refund within policy, measured on store-phone interruptions per peak hour.",
    expansion: [
      "Extend exception handling nationally across the ANZ franchise network with per-store configuration",
      "Add the franchisee support desk covering supply ordering, systems issues, and compliance queries",
      "Introduce proactive delivery-slip notification integrated with the existing tracking platform",
    ],
    stakeholders: [
      "Chief Executive Officer ANZ",
      "Chief Digital Officer / Group Chief Technology Officer",
      "General Manager Operations ANZ",
      "Head of Franchise Support",
      "Head of Customer Experience",
    ],
    discovery: [
      "How many exception calls does an average store take during a Friday dinner peak, and what does that interruption cost in throughput?",
      "Which parts of your own technology roadmap cover service-side automation, and where does it stop?",
      "Can head office standardise remake and refund authority across franchisees, or is that store-by-store discretion?",
      "What volume of franchisee enquiries does head office field monthly, and how much is repeatable process guidance?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A late Domino's order is remade and the customer notified without anyone phoning the store mid-Friday-peak.",
  },

  "guzman-y-gomez": {
    operatingContext:
      "Guzman y Gomez is an Australian-founded Mexican-inspired quick-service restaurant chain that listed on the ASX and has pursued aggressive network expansion, with drive-thru formats central to the growth thesis because they carry higher average transaction values and throughput than in-line stores. It operates a mix of corporate and franchised restaurants across Australia, with smaller footprints in Singapore, Japan, and the United States. Its customer contact is dominated by digital and delivery-platform order issues — missing items, incorrect orders, delivery-partner failures — plus a steady stream of franchise-development enquiries generated by its expansion story. Restaurant teams currently absorb both, with store managers handling complaints between service rushes and a small support function fielding franchise interest.",
    strategicPressure: [
      { text: "Guzman y Gomez listed on the ASX and has committed publicly to an aggressive restaurant-opening programme, particularly drive-thru formats", kind: "verified" },
      { text: "Third-party delivery aggregators intermediate a significant share of QSR orders, and order failures attributed to the delivery partner still arrive at the restaurant brand", kind: "verified" },
      { text: "Service contact scales linearly with restaurant count, so a company opening restaurants rapidly is also compounding its unmanaged service volume", kind: "inference" },
      { text: "Franchise-development enquiries generated by a high-profile growth story are a sales pipeline being handled as an administrative inbox", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A growth-stage restaurant company allocates capital to sites, fit-out, and brand marketing, and its technology spend goes into ordering and point-of-sale platforms it procures. There is no basis for an internal conversational-AI capability at this scale, and a small, measurable deployment matched to network growth is exactly what a listed growth company can defend to investors.",
    whyNotBuild:
      "Every dollar of engineering overhead is a dollar not spent opening the next drive-thru, which is the entire investment case. Building speech, telephony, orchestration, and evaluation capability for a service function would be indefensible against that alternative use of capital, and a usage-based purchased capability scales naturally with the restaurant count rather than requiring a step-change hire.",
    workflows: [
      {
        name: "App and delivery order-issue resolution",
        friction: "Missing items, wrong orders, and delivery failures are raised to the restaurant or through social channels, and resolution depends on which manager responds and how generous they feel",
        outcome: "Consistent, policy-governed resolution with refunds or credits applied automatically, protecting brand consistency as the network grows",
        channels: ["Voice", "Web chat", "SMS", "Social messaging"],
        systems: ["Point of sale / order management", "Delivery aggregator interfaces", "Payments and refunds", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Franchise-development enquiry qualification",
        friction: "Prospective franchisees enquire through web forms and are followed up only when the development team has capacity, so a high-intent pipeline decays while the expansion programme needs candidates",
        outcome: "Every franchise enquiry engaged within minutes, qualified on capital, location, and experience criteria, and booked onto a development manager's calendar",
        channels: ["Voice", "Web chat", "SMS", "Email"],
        systems: ["Franchise development CRM", "Site/territory database", "Calendar scheduling", "Marketing automation"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Restaurant-level operational support",
        friction: "Restaurant managers call or message support about point-of-sale faults, supply shortages, and rostering system issues during trade, and wait for a support function operating on office hours",
        outcome: "Frontline operational questions resolved around actual trading hours, keeping managers in the restaurant rather than on hold",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Point of sale", "Supply chain ordering", "Workforce management", "IT service management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A branded ordering app and website alongside third-party delivery aggregator listings",
        "Point-of-sale and drive-thru ordering systems across corporate and franchised restaurants",
        "A loyalty and rewards mechanic within the app driving repeat purchase",
        "A franchise-development function handling enquiries from prospective operators",
      ],
      gaps: [
        "No consistent customer-issue resolution path independent of which restaurant or manager responds",
        "No immediate response to franchise-development enquiries generated by the growth story",
        "No after-hours support channel for restaurant managers trading late into the evening",
        "No structured capture of order-failure patterns that could be fixed upstream with delivery partners",
      ],
    },
    risks: [
      "Australian Consumer Law applies to food orders, so refund and remake handling must be consistent with guarantee obligations rather than purely discretionary",
      "Food-safety complaints require immediate human escalation and cannot be resolved by an automated conversation under any circumstance",
      "At current network scale the deployment must be small enough to justify commercially, so scope discipline matters more than breadth",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 4,
      automationRate: 0.55,
      basis: "Seller assumptions requiring validation: volume estimated from order-issue contact across a growing but still mid-sized restaurant network plus franchise enquiries, cost reflecting restaurant-manager and support-team time, and a moderate automation rate given the small absolute base and the need for human escalation on food-safety issues.",
    },
    pilotScope:
      "An eight-week pilot automating app and delivery order-issue resolution across chat and voice for the Australian network, with governed refund and credit authority and immediate human escalation on any food-safety mention.",
    expansion: [
      "Add franchise-development enquiry qualification and development-manager calendar booking",
      "Extend to restaurant-level operational support covering point of sale, supply, and rostering queries",
      "Introduce order-failure pattern reporting back to delivery aggregator partners and operations",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Chief Technology Officer",
      "Head of Franchise Development",
      "Head of Customer Experience",
    ],
    discovery: [
      "How many customer issues per week arrive across the network, and who resolves them today?",
      "How consistent is refund and remake authority between corporate restaurants and franchised ones?",
      "How many franchise-development enquiries do you receive monthly, and what is your average response time?",
      "What proportion of order failures originate with the delivery aggregator rather than the restaurant?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Guzman y Gomez customer reports a missing burrito bowl from a delivery order and gets the refund applied before the driver reaches the next stop.",
  },

  "energyaustralia": {
    operatingContext:
      "EnergyAustralia is one of Australia's three largest energy retailers, owned by Hong Kong's CLP Group, supplying electricity and gas to millions of residential and business accounts alongside a generation portfolio undergoing transition away from coal. Its retail business is regulated in detail: price-change notifications, default market offer comparisons, life-support customer registers, disconnection protections, and hardship-program obligations all impose mandated communications with specific timing and content. Its customer base spans metropolitan Melbourne and Sydney households where a substantial proportion speak a language other than English at home, which makes multilingual servicing a practical necessity rather than a nicety. Customers reach it through the app and online account portal, phone teams, and email, with billing disputes and payment difficulty the dominant assisted-contact drivers.",
    strategicPressure: [
      { text: "Australian energy retailers operate under regulatory obligations covering hardship programmes, payment plans, life-support registers, and disconnection protections enforced by the AER and state regulators", kind: "verified" },
      { text: "Energy is a designated sector under Australia's Consumer Data Right, obliging retailers to support accredited data sharing and consent management alongside their own servicing", kind: "verified" },
      { text: "Cost-of-living pressure has driven sustained increases in payment-difficulty and hardship contacts, which are the longest and most sensitive conversations in the entire contact mix", kind: "inference" },
      { text: "Multilingual households in Melbourne and Sydney are underserved by English-only phone teams, producing longer handle times and worse outcomes for exactly the customers most likely to fall into arrears", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. EnergyAustralia's capital is committed to generation transition and its retail technology to billing and market systems, not to conversational infrastructure. Australian energy retailers have consistently procured contact-centre and self-service technology from vendors, and margin pressure in retail energy makes a measurable cost-to-serve purchase far more defensible than an engineering programme.",
    whyNotBuild:
      "An energy retailer's regulatory exposure sits in what it says to customers about prices, plans, and hardship — which means the evaluation layer is the hard part, not the model. Building would require multilingual speech handling, telephony integration, orchestration across billing and market systems, and a continuously audited evaluation regime capable of proving regulatory compliance in every conversation. No Australian retailer has built that, and none should.",
    workflows: [
      {
        name: "Hardship and payment-plan setup",
        friction: "Customers in payment difficulty face a long, repetitive assessment call, often after avoiding contact for months, and the conversation is scripted data collection before any human judgement is applied",
        outcome: "Earlier disclosure through a lower-stigma channel with structured capability information captured and policy-bounded plan options presented, then a specialist making the actual decision",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Billing/CIS", "Hardship programme management", "Payments", "Concession/rebate eligibility data"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Billing dispute and high-bill explanation",
        friction: "A bill higher than expected generates a long call where an agent walks through meter reads, tariff, seasonality, and estimated versus actual reads, repeated thousands of times per month",
        outcome: "High-bill drivers explained conversationally from actual meter and tariff data, with genuine billing errors routed to humans and the rest resolved on first contact",
        channels: ["Voice", "Web chat", "Mobile app", "SMS"],
        systems: ["Billing/CIS", "Meter data management", "Tariff/plan catalogue", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Move-in, move-out, and plan-change servicing",
        friction: "Connections, disconnections, and plan changes are transactional but process-heavy, and each requires an agent to capture details, verify identity, and execute across billing and market systems",
        outcome: "Connection and plan transactions completed conversationally end to end, removing a large block of no-judgement volume from the assisted channel",
        channels: ["Voice", "Web chat", "Mobile app"],
        systems: ["Billing/CIS", "Market/retail transfer systems", "Identity verification", "Tariff/plan catalogue"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer app and online account portal with billing, usage, and payment self-service",
        "Australian and offshore contact-centre operations handling billing, connections, and hardship",
        "A regulated hardship programme with dedicated specialist teams and payment-plan tooling",
        "Smart-meter data availability supporting usage insight for a growing share of the customer base",
      ],
      gaps: [
        "No multilingual voice servicing despite a substantially multilingual customer base in its core cities",
        "No low-stigma conversational front door for customers approaching payment difficulty",
        "No proactive high-bill explanation before the bill lands and generates a complaint call",
        "No after-hours capability for connection and plan transactions that customers arrange around work",
      ],
    },
    risks: [
      "AER and state regulatory obligations govern hardship, disconnection, life-support, and price-change communications, so automated conversations must be provably compliant and fully auditable",
      "Consumer Data Right obligations in energy impose consent, authentication, and data-sharing requirements that intersect with any authenticated conversational channel",
      "Vulnerable-customer and life-support flagging must trigger immediate human involvement, and failure to detect it is a regulatory as well as a safety failure",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 5.5,
      automationRate: 0.55,
      basis: "Seller assumptions to validate: volume estimated from a multi-million-account electricity and gas retail base at typical Australian energy contact rates, cost reflecting a blended onshore and offshore service mix, and an automation rate assuming billing and transactional volume automates while hardship decisions remain human.",
    },
    pilotScope:
      "A ten-week pilot automating high-bill explanation and billing enquiries across voice and chat in English and two community languages, grounded in billing and meter data, with mandatory human handover on any hardship or life-support signal.",
    expansion: [
      "Extend to move-in, move-out, and plan-change transactions completed end to end in-conversation",
      "Add hardship first-contact triage with structured capability capture and specialist decision points",
      "Introduce proactive high-bill and price-change outreach ahead of the billing cycle",
    ],
    stakeholders: [
      "Managing Director Retail / Executive Customer",
      "Chief Operating Officer",
      "Chief Information Officer",
      "Head of Customer Care and Hardship",
      "General Manager Regulatory Affairs and Compliance",
    ],
    discovery: [
      "What share of your assisted contacts are high-bill and billing-dispute conversations, and what is the average handle time?",
      "How many of your customers are served in a language other than English today, and how is that resourced?",
      "What does your compliance team require as evidence that an automated conversation met hardship and life-support obligations?",
      "How does CLP group ownership affect technology governance and vendor selection for the Australian retail business?",
    ],
    flowTemplate: "collections",
    scenario: "An EnergyAustralia customer facing a summer bill spike gets it explained in Mandarin and a payment plan started before disconnection notices begin.",
  },

  "alinta-energy": {
    operatingContext:
      "Alinta Energy is a challenger Australian energy retailer with over a million customer accounts across electricity and gas, competing against the big three primarily on price and simplicity, with a generation portfolio and a strong historical position in Western Australia alongside its east-coast retail growth. Its proposition is essentially that it costs less, which means every dollar of cost to serve directly attacks the discount it can offer and therefore its ability to win accounts. Its contact profile is dominated by commodity conversations — bills, account transfers when people move house, concession applications, and plan comparisons — that carry no differentiation but full assisted cost. Customers reach it through an app and online account, phone teams, and email, and it competes in a market where switching is easy and churn is constant.",
    strategicPressure: [
      { text: "Australian energy retail is a high-churn market with government comparison tools and default market offers making switching straightforward and price transparency high", kind: "verified" },
      { text: "Energy retailers face regulated hardship, disconnection, and life-support obligations regardless of size, so a challenger carries the same compliance load on a smaller cost base", kind: "verified" },
      { text: "A price-led challenger's cost to serve directly constrains the discount it can offer, making service cost a competitive variable rather than an operating detail", kind: "inference" },
      { text: "Move-house account transfers are a moment of maximum churn risk, and slow or clumsy handling converts a retained customer into a switching one", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Alinta is a mid-scale retailer with no plausible route to funding a conversational-platform build, and its technology spend goes into billing, market systems, and digital account capability. The commercial logic of a price-led challenger is precisely to buy proven capability at a usage cost rather than to carry engineering overhead.",
    whyNotBuild:
      "A challenger competing on price cannot carry the fixed cost of speech, telephony, orchestration, and evaluation engineering — that overhead would show up directly in the discount it can no longer offer. It also needs the compliance evidence layer from day one, and building that from scratch under AER scrutiny is a risk no mid-scale retailer should take.",
    workflows: [
      {
        name: "Move-house account transfer",
        friction: "Customers moving home must arrange disconnection at one address and connection at another, and the process requires an agent to capture details, verify identity, and set dates across systems",
        outcome: "Move transactions completed conversationally in one pass, retaining customers at the exact moment they are most likely to shop for a new retailer",
        channels: ["Voice", "Web chat", "SMS", "Mobile app"],
        systems: ["Billing/CIS", "Market/retail transfer systems", "Identity verification", "Distributor interfaces"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Billing enquiry and plan comparison",
        friction: "Bill questions and plan-comparison requests consume long assisted calls, and because the customer is often already comparing offers elsewhere, a slow answer directly precedes a switch",
        outcome: "Bills explained and eligible plan options presented immediately from the tariff catalogue, converting a churn-risk moment into a retention conversation",
        channels: ["Voice", "Web chat", "Mobile app"],
        systems: ["Billing/CIS", "Tariff/plan catalogue", "Meter data management", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Concession and rebate eligibility",
        friction: "Concession card holders and rebate-eligible customers must apply and re-verify, and errors or lapses show up as unexpected bill increases that generate complaint calls months later",
        outcome: "Eligibility checked and applications completed conversationally with proactive re-verification prompts, preventing an entirely avoidable complaint category",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Billing/CIS", "Concession/rebate eligibility data", "State scheme interfaces", "Document management"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer app and online account portal with billing, usage, and payment self-service",
        "Contact-centre operations covering billing, connections, and hardship across east coast and Western Australia",
        "A regulated hardship programme with payment-plan tooling and specialist staff",
        "Digital move-in and move-out forms alongside phone-based connection handling",
      ],
      gaps: [
        "No conversational channel that completes a move-house transfer end to end without an agent",
        "No instant, personalised plan comparison at the moment a customer is considering switching",
        "No proactive concession re-verification, so lapses surface as complaints after the fact",
        "No after-hours servicing, despite move-house arrangements typically being made outside work hours",
      ],
    },
    risks: [
      "AER and state regulatory obligations on hardship, disconnection, life-support, and price communications apply in full to a challenger retailer with a smaller compliance function",
      "Consumer Data Right obligations in energy govern consent and authenticated data access, intersecting directly with a conversational channel that identifies customers",
      "Plan-comparison statements carry misleading-conduct exposure if an automated agent presents an offer inaccurately or omits material conditions",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 5,
      automationRate: 0.6,
      basis: "Seller assumptions requiring validation: volume estimated from a customer base above one million accounts at typical Australian energy contact rates, cost reflecting a blended onshore and offshore service mix, and a high automation rate given the commodity, transactional nature of the volume.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating move-house account transfers end to end across voice and chat, integrated to billing and market transfer systems, measured on transfer completion rate and churn at move events.",
    expansion: [
      "Extend to billing enquiry and personalised plan comparison with retention offers from an approved matrix",
      "Add concession and rebate eligibility checking with proactive re-verification prompts",
      "Introduce hardship first-contact triage with mandatory specialist decision points",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Executive General Manager Retail",
      "Chief Information Officer",
      "Head of Customer Operations",
      "General Manager Regulatory and Compliance",
    ],
    discovery: [
      "What is your cost to serve per account per year, and how does it compare with the discount you need to win accounts?",
      "What proportion of your churn occurs at move-house events, and how long does a transfer take today?",
      "How many concession-lapse complaints do you handle monthly, and what does each cost to resolve?",
      "What evidence does your regulatory team need before an automated agent can discuss plan options with a customer?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "An Alinta customer moving house arranges the final read at the old address and connection at the new one in a single evening conversation.",
  },

  "aurora-energy-tas": {
    operatingContext:
      "Aurora Energy is Tasmania's state-owned electricity retailer, the default and dominant supplier to Tasmanian households and small businesses in a market with limited retail competition, owned by the Tasmanian Government. Its customer base is small by national standards but distinctive: Tasmania has among the highest rates of electric heating dependence in Australia, cold winters drive severe seasonal consumption peaks, and household income levels make payment difficulty a persistent structural issue rather than an occasional one. Its aurora+ app pushed a meaningful share of customers toward pay-as-you-go style engagement with daily usage visibility, which shifted some volume out of the phone channel, while payment-difficulty, concession, and high-winter-bill conversations remain firmly phone-based. Government ownership means service performance and hardship handling are politically visible in a way they are not for private retailers.",
    strategicPressure: [
      { text: "Aurora Energy is owned by the Tasmanian Government, so its service performance, pricing, and hardship handling are subject to ministerial and parliamentary scrutiny", kind: "verified" },
      { text: "The aurora+ app introduced pay-as-you-go and daily usage visibility, changing how a portion of the customer base engages with their energy account", kind: "verified" },
      { text: "Tasmania's cold winters and high electric-heating dependence create a severe seasonal bill peak that concentrates payment-difficulty contacts into a predictable window each year", kind: "inference" },
      { text: "A small state-owned retailer has no capacity to scale service staffing for the winter peak, so the peak is absorbed as queue time rather than as capacity", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led, decisively. Aurora Energy is a small state-owned enterprise with no engineering function capable of building conversational infrastructure and a procurement framework designed for buying services. Its scale makes a compact, packaged deployment the only realistic option, and government cost mandates make a measurable payback essential.",
    whyNotBuild:
      "There is no version of this where a state-owned retailer serving a single small state builds speech, telephony, orchestration, and evaluation capability. The regulatory evidence burden on hardship conversations alone exceeds what an organisation of this size could construct, and government procurement is structured to buy proven capability with contractual accountability rather than to fund internal development.",
    workflows: [
      {
        name: "Payment-plan and hardship first contact",
        friction: "Customers struggling with a winter bill delay contacting the retailer, then face a long assessment call, and the phone queue is longest exactly in the season when the problem peaks",
        outcome: "Earlier, easier disclosure with structured capability information captured and plan options presented within policy, and a human making the actual hardship decision",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Billing/CIS", "Hardship programme management", "Payments", "aurora+ account data"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Concession eligibility and application",
        friction: "Tasmanian concession entitlements require application and periodic verification, and eligible households frequently miss out simply because the process needs a phone call in business hours",
        outcome: "Eligibility checked and applications lodged conversationally at any hour, increasing concession uptake among exactly the households most at risk of arrears",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Billing/CIS", "State concession scheme interfaces", "Document management", "Identity verification"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Winter high-bill explanation",
        friction: "Cold-season bills spike sharply, and each explanation call walks through heating consumption, tariff, and daily usage data that the aurora+ platform already holds",
        outcome: "Bill drivers explained conversationally from actual usage data with practical consumption guidance, cutting a highly seasonal complaint category at its source",
        channels: ["Voice", "SMS", "Mobile app"],
        systems: ["Billing/CIS", "Meter/interval data", "aurora+ platform", "Tariff catalogue"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "The aurora+ app providing daily usage visibility and pay-as-you-go style account management",
        "An online account portal with billing and payment self-service",
        "A Tasmanian-based contact centre handling billing, connections, and hardship",
        "A regulated hardship programme with payment-plan arrangements and concession administration",
      ],
      gaps: [
        "No conversational channel for hardship disclosure outside business-hours phone queues",
        "No proactive concession eligibility prompting for households likely to qualify",
        "No elastic capacity for the winter contact peak beyond queue time",
        "No proactive high-bill warning before the winter bill arrives and triggers the call",
      ],
    },
    risks: [
      "State-government ownership makes automation of Tasmanian service jobs politically sensitive, so the proposition must be framed around winter-peak capacity rather than headcount",
      "AER-equivalent Tasmanian regulatory obligations on hardship, disconnection, and life-support apply in full and require auditable evidence of compliant conversations",
      "Government procurement pathways impose process and timing constraints that must be understood before any commercial engagement is scoped",
    ],
    economics: {
      volumeMonthly: 60000,
      costPerInteraction: 5.5,
      automationRate: 0.5,
      basis: "Seller assumptions to validate: volume estimated from a Tasmanian household and small-business customer base at typical energy contact rates with a pronounced winter peak, cost reflecting Tasmanian-based service labour, and a moderate automation rate given the high hardship share of contacts.",
    },
    pilotScope:
      "An eight-week pilot ahead of the winter peak automating concession eligibility checking and high-bill explanation across voice and SMS, grounded in billing and aurora+ usage data, with immediate human handover on any hardship or life-support signal.",
    expansion: [
      "Extend to hardship first contact with structured capability capture and human decision points",
      "Add proactive pre-winter outreach warning customers of likely bill increases with concession prompts",
      "Introduce connection, disconnection, and move-house transaction handling",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "General Manager Customer Experience",
      "Chief Information Officer",
      "Manager Customer Assistance and Hardship",
      "General Manager Regulation and Compliance",
    ],
    discovery: [
      "How much does your contact volume increase between summer and the winter peak, and how do you staff for it today?",
      "How many Tasmanian households eligible for concessions do you believe are not currently receiving them?",
      "What is the government shareholder's position on automation in a Tasmanian-employing service operation?",
      "What is the procurement pathway and approval timeline for a technology service of this type?",
    ],
    flowTemplate: "collections",
    scenario: "A Tasmanian household facing a July heating bill checks concession eligibility and sets a payment plan on a Sunday evening.",
  },

  "genesis-energy-nz": {
    operatingContext:
      "Genesis Energy is New Zealand's largest energy retailer by customer connections, a listed gentailer with a generation portfolio and a retail business spanning electricity, natural gas, and LPG, operating both the Genesis brand and the budget-positioned Frank Energy brand. That multi-fuel, multi-brand structure is operationally distinctive: a single household can hold electricity, piped gas, and bottled LPG accounts with different billing cycles and different service processes, and the two brands serve deliberately different customer expectations. New Zealand's retail energy market is competitive with active switching, so moving house and plan-comparison moments are churn events. Customers reach it through online accounts and apps, New Zealand-based contact teams, and email, with billing, moving house, and LPG delivery coordination the main assisted-contact drivers.",
    strategicPressure: [
      { text: "Genesis Energy operates multiple retail brands across electricity, natural gas, and LPG, giving it the broadest multi-fuel retail footprint among New Zealand gentailers", kind: "verified" },
      { text: "New Zealand's electricity retail market has active switching supported by government-backed comparison tools, keeping churn structurally high", kind: "verified" },
      { text: "Multi-fuel households generate more service contacts than single-fuel ones because each fuel carries its own billing, delivery, and connection processes", kind: "inference" },
      { text: "LPG bottle delivery coordination is a logistics conversation with no analogue in electricity retail, and it likely runs on phone and manual scheduling", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Genesis is a generation-and-retail business whose capital goes into generation assets and whose retail technology is procured. New Zealand gentailer scale does not support conversational-platform engineering, and the multi-brand, multi-fuel configuration requirement argues for a configurable bought platform rather than a bespoke build repeated per brand.",
    whyNotBuild:
      "A gentailer's engineering attention is on generation, trading, and market systems. Building conversational capability would require New Zealand English speech handling, telephony integration, orchestration across separate electricity, gas, and LPG systems, and an evaluation regime meeting Electricity Authority and consumer-protection expectations — four disciplines competing directly with generation investment for capital.",
    workflows: [
      {
        name: "Moving-house connections across fuels",
        friction: "A household moving home must close and open accounts across electricity, gas, and sometimes LPG, and each fuel is handled as a separate conversation with separate details captured",
        outcome: "One conversation closes and opens every fuel at both addresses, retaining a multi-fuel customer at the highest-risk churn moment in the relationship",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Billing/CIS", "Registry/switching systems", "LPG delivery scheduling", "Identity verification"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Multi-fuel billing enquiries",
        friction: "Customers holding electricity, gas, and LPG accounts receive separate bills on separate cycles, and reconciling them requires an agent to open several systems while the customer waits",
        outcome: "A single grounded explanation across all fuels and cycles held by the household, resolving a confusion category that is entirely structural",
        channels: ["Voice", "Web chat", "Mobile app"],
        systems: ["Billing/CIS", "Meter data management", "LPG account system", "Tariff/plan catalogue"],
        value: 3,
        complexity: 3,
      },
      {
        name: "LPG delivery coordination",
        friction: "Bottled LPG customers phone to order refills, check delivery timing, and report empty bottles, and rural delivery windows make scheduling conversations long and repetitive",
        outcome: "Refill ordering and delivery scheduling handled conversationally with proactive reorder prompts, reducing both call volume and run-out incidents",
        channels: ["Voice", "SMS", "Mobile app"],
        systems: ["LPG account and delivery scheduling", "Route/logistics planning", "Billing/CIS", "Inventory"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Online account management and apps across the Genesis and Frank Energy brands",
        "New Zealand-based contact centres handling billing, connections, and moves",
        "LPG bottle delivery operations with ordering and scheduling processes",
        "Smart-meter data availability supporting usage insight for electricity customers",
      ],
      gaps: [
        "No single conversation that handles a move across all fuels a household holds",
        "No consolidated multi-fuel billing explanation without an agent opening several systems",
        "No proactive LPG reorder prompting, so run-outs generate urgent calls",
        "No after-hours servicing for move and connection arrangements made outside work hours",
      ],
    },
    risks: [
      "New Zealand's Privacy Act 2020 governs customer information handling and any cross-border processing arrangement must be disclosed and controlled",
      "Electricity Authority consumer care obligations cover payment difficulty, medically dependent consumers, and disconnection, requiring auditable compliant conversations",
      "LPG is a hazardous good, so any conversation touching bottle handling, leaks, or safety must escalate immediately to trained human staff",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 6,
      automationRate: 0.55,
      basis: "Seller assumptions for validation: volume estimated from New Zealand's largest retail connection base across multiple fuels and two brands, cost reflecting onshore New Zealand service labour, and an automation rate assuming billing, moves, and LPG ordering automate while payment difficulty escalates.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating moving-house connections across electricity and gas for the Genesis brand on voice and chat, integrated to billing and registry systems, measured on move-event retention and transfer completion time.",
    expansion: [
      "Extend to multi-fuel billing explanation including LPG accounts on one consolidated view",
      "Add LPG refill ordering, delivery scheduling, and proactive reorder prompts",
      "Roll the same governed layer to the Frank Energy brand with budget-brand tone and rules",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Customer Officer",
      "Chief Information Officer",
      "General Manager Retail Operations",
      "Head of Regulatory Affairs",
    ],
    discovery: [
      "How many contacts does a multi-fuel household generate per year compared with an electricity-only customer?",
      "What happens to your retention rate at move-house events, and how long does a multi-fuel move take to process?",
      "How is LPG refill ordering handled today, and how many run-out incidents generate urgent calls?",
      "Are service operations shared across Genesis and Frank Energy, or run separately per brand?",
    ],
    flowTemplate: "onboarding",
    scenario: "A Wellington family moving house closes electricity and gas at the old address and opens both at the new one in a single Genesis conversation.",
  },

  "mercury-nz": {
    operatingContext:
      "Mercury NZ is a listed New Zealand gentailer with a substantial renewable generation portfolio, and it has expanded its retail proposition well beyond electricity into broadband and mobile bundles, and it grew significantly by acquiring Trustpower's retail customer base. That bundling strategy fundamentally changes its service profile: a household with electricity, broadband, and mobile on one account generates questions that span three product domains with different fault modes, and a broadband outage conversation looks nothing like an electricity billing conversation. It serves customers through online accounts, an app, New Zealand-based contact teams, and email. Bundle billing is the specific pain point — one bill covering three services, with plan changes in any one service affecting the total.",
    strategicPressure: [
      { text: "Mercury acquired the Trustpower retail customer base, materially expanding its retail footprint and bringing bundled telecommunications customers into the business", kind: "verified" },
      { text: "Mercury markets multi-product bundles combining electricity with broadband and mobile, positioning bundling as a retention and value strategy", kind: "verified" },
      { text: "Bundled households generate more contacts than single-product ones because each service carries its own faults, plan changes, and billing questions on a shared bill", kind: "inference" },
      { text: "Integrating an acquired customer base onto common systems leaves a transitional period where service staff work across multiple environments per customer", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Mercury's capital is committed to renewable generation and its retail technology is procured, with post-acquisition integration consuming the available technology capacity. New Zealand gentailer scale does not justify a conversational-platform build, and cross-domain bundle servicing is precisely the kind of integration-heavy workflow that a configurable bought platform handles better than bespoke development.",
    whyNotBuild:
      "Building would mean owning speech, telephony, orchestration across energy and telecommunications systems, and evaluation, at exactly the moment technology capacity is absorbed by acquisition integration. A generation-led business has no strategic reason to develop conversational infrastructure and every reason to buy capability that spans the product domains it has assembled.",
    workflows: [
      {
        name: "Bundle billing explanation",
        friction: "One bill covering electricity, broadband, and mobile confuses customers when any component changes, and agents must reconcile charges across three product systems to explain a single total",
        outcome: "Bundle charges explained line by line across all services in one grounded conversation, resolving the confusion category bundling structurally creates",
        channels: ["Voice", "Web chat", "Mobile app"],
        systems: ["Billing/CIS", "Telecommunications billing", "Meter data management", "Product/plan catalogue"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Plan-change and bundle-configuration servicing",
        friction: "Adding, removing, or changing a service within a bundle requires an agent to work across systems and recalculate the bundle discount, and customers cannot see the impact before committing",
        outcome: "Bundle changes modelled and executed conversationally with the price impact shown before confirmation, turning a friction point into a cross-sell moment",
        channels: ["Voice", "Web chat", "Mobile app"],
        systems: ["Billing/CIS", "Telecommunications provisioning", "Product/plan catalogue", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Broadband fault and outage triage",
        friction: "Broadband faults generate a fundamentally different call type from energy, with diagnostic steps, network status checks, and technician scheduling that energy-trained agents handle slowly",
        outcome: "Guided diagnostics and network-status grounding resolve or correctly triage faults before a human is involved, with technician appointments booked in-conversation",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Network monitoring / outage systems", "Telecommunications provisioning", "Field service scheduling", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Online account management and an app covering energy and telecommunications services",
        "New Zealand-based contact centres handling energy and bundled telecommunications enquiries",
        "Bundled product offerings combining electricity with broadband and mobile",
        "Smart-meter data supporting electricity usage insight for the customer base",
      ],
      gaps: [
        "No conversational capability spanning energy and telecommunications on a single bundle enquiry",
        "No self-service modelling of what a bundle change will do to the bill before committing",
        "No guided broadband fault diagnostics, so telecom faults consume energy-trained agent time",
        "No unified service experience across originally-Mercury and acquired customer bases",
      ],
    },
    risks: [
      "New Zealand's Privacy Act 2020 governs customer data across both energy and telecommunications products held on the same account",
      "Electricity Authority consumer care obligations on payment difficulty and medically dependent consumers apply to the energy component regardless of bundling",
      "Telecommunications consumer protections and outage-communication expectations add a second regulatory domain that automated conversations must respect",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 6,
      automationRate: 0.55,
      basis: "Seller assumptions requiring validation: volume estimated from a New Zealand retail base with elevated contact rates from bundled multi-service households, cost reflecting onshore New Zealand service labour, and an automation rate assuming billing and plan servicing automate while complex faults escalate.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating bundle billing explanation across voice and chat, grounded in both energy and telecommunications billing systems, measured on handle time and repeat-contact rate for bundled customers.",
    expansion: [
      "Extend to plan-change and bundle-configuration servicing with price-impact modelling before confirmation",
      "Add broadband fault triage with guided diagnostics and technician appointment booking",
      "Introduce proactive outage and planned-maintenance notification across both service domains",
    ],
    stakeholders: [
      "Chief Executive",
      "General Manager Customer",
      "Chief Information Officer",
      "Head of Customer Operations",
      "General Manager Retail Products",
    ],
    discovery: [
      "What is the contact rate for a bundled household compared with an electricity-only customer?",
      "How much agent training is required to handle both energy and telecommunications enquiries competently?",
      "How far through the acquired customer base integration are you, and how many systems does an agent touch per call today?",
      "What proportion of your contacts are bundle billing confusion rather than genuine billing errors?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A Mercury customer asks why the bundle bill jumped and gets electricity, broadband, and mobile charges each explained in one call.",
  },

  "contact-energy": {
    operatingContext:
      "Contact Energy is one of New Zealand's largest listed gentailers, with geothermal and hydro generation and a retail business supplying electricity, natural gas, and broadband to households and businesses nationwide. It competes in a retail market where switching is easy, government-backed comparison tools are prominent, and churn is a permanent operating condition rather than a periodic problem — which makes win-back and retention conversations as commercially significant as billing service. It has invested visibly in digital account management and app-based engagement, and it uses time-of-use and usage-based plan structures that require customer explanation to be understood and valued. Customers reach it through the app and online account, New Zealand-based contact teams, and email.",
    strategicPressure: [
      { text: "New Zealand's electricity retail market has active switching supported by prominent comparison tools, keeping churn structurally elevated for every retailer", kind: "verified" },
      { text: "Contact Energy has expanded beyond electricity into broadband and gas, using multi-product holding as a retention mechanism", kind: "verified" },
      { text: "Retention conversations are capacity-bound: an outbound save team can only reach a fraction of the at-risk base before switching completes", kind: "inference" },
      { text: "Time-of-use and usage-based plans deliver value only if customers understand them, so explanation quality directly affects both satisfaction and churn", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Contact's capital is directed at generation, particularly geothermal development, and its retail technology stack is procured and integrated rather than built. New Zealand retail scale cannot support conversational-platform engineering, and retention conversations bounded by an approved offer matrix are exactly the shape of workflow a packaged deployment handles well.",
    whyNotBuild:
      "A gentailer's engineering effort belongs in generation and trading. Conversational infrastructure would demand New Zealand speech handling, telephony integration, orchestration across energy and broadband systems, and continuous evaluation against consumer care obligations — with no strategic return, since no customer chooses an electricity retailer because it built its own voice stack.",
    workflows: [
      {
        name: "Churn-save retention conversations",
        friction: "Customers signalling churn risk — comparison-site activity, complaint history, plan dissatisfaction — are contacted only as far as outbound save-team capacity allows, so most leave uncontacted",
        outcome: "Every at-risk customer reached in a two-way conversation with retention offers applied from an approved matrix, and specialists focused on high-value saves",
        channels: ["Voice", "SMS", "Email", "Mobile app"],
        systems: ["Billing/CIS", "Churn model / customer data platform", "Retention offer matrix", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Billing and plan-explanation servicing",
        friction: "Time-of-use and usage-based plans generate questions that require an agent to walk through interval data and tariff structure, a long conversation repeated thousands of times monthly",
        outcome: "Plan structure and actual usage explained conversationally from interval data, so customers understand and value the plan rather than distrusting the bill",
        channels: ["Voice", "Web chat", "Mobile app"],
        systems: ["Billing/CIS", "Meter/interval data management", "Tariff/plan catalogue", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Move-house and multi-product connections",
        friction: "Moving customers must arrange electricity, gas, and broadband transfers separately, and every additional step in that process is an opportunity to switch retailer instead",
        outcome: "All services moved in one conversation with dates confirmed, converting the highest-risk churn moment into a multi-product retention event",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Billing/CIS", "Registry/switching systems", "Broadband provisioning", "Identity verification"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A well-developed customer app and online account with usage visibility and payment self-service",
        "New Zealand-based contact centres handling billing, connections, and retention",
        "Multi-product offerings spanning electricity, natural gas, and broadband",
        "Time-of-use and usage-based plan structures supported by smart-meter interval data",
      ],
      gaps: [
        "No capacity to have a retention conversation with every at-risk customer before they switch",
        "No conversational explanation of time-of-use plan performance against actual household usage",
        "No single conversation that moves all products a household holds to a new address",
        "No after-hours servicing for the move and plan decisions customers make in the evening",
      ],
    },
    risks: [
      "Electricity Authority consumer care obligations cover payment difficulty, medically dependent consumers, and disconnection, and automated conversations must detect and escalate accordingly",
      "New Zealand's Privacy Act 2020 governs use of consumption and behavioural data for retention targeting, requiring transparency about how customer data drives outreach",
      "Retention offers made conversationally must remain within approved economics and be represented accurately to avoid misleading-conduct exposure under the Fair Trading Act",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 6,
      automationRate: 0.55,
      basis: "Seller assumptions to validate in discovery: volume estimated from a large New Zealand multi-product retail base at typical contact rates, cost reflecting onshore New Zealand service labour, and an automation rate assuming billing and retention outreach automate while hardship and complex disputes escalate.",
    },
    pilotScope:
      "An eight-to-ten week pilot running churn-save retention conversations against a defined at-risk segment on voice and SMS with offers from an approved matrix, measured on save rate and offer cost against a matched control group.",
    expansion: [
      "Extend to billing and time-of-use plan-explanation servicing across the customer base",
      "Add multi-product move-house connections covering electricity, gas, and broadband in one conversation",
      "Introduce proactive plan-optimisation outreach where usage data shows a customer is on the wrong plan",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Customer Officer",
      "Chief Information Officer",
      "General Manager Retail",
      "Head of Regulatory and Compliance",
    ],
    discovery: [
      "What proportion of your at-risk base does the save team actually reach before the switch completes?",
      "How much of your billing contact volume is customers not understanding a time-of-use plan rather than disputing a charge?",
      "What is your retention rate at move-house events, and how many products typically move with the customer?",
      "What offer authority would you delegate to an automated conversation, and where must a human decide?",
    ],
    flowTemplate: "retention",
    scenario: "A Contact Energy customer comparing offers online gets a call the same day with a plan matched to their actual usage pattern.",
  },

  "meridian-energy": {
    operatingContext:
      "Meridian Energy is New Zealand's largest electricity generator, operating an entirely renewable hydro and wind portfolio, with a retail arm supplying households and businesses across the country and a brand proposition explicitly built on renewable generation. It consolidated its retail brands after acquiring and later integrating the Powershop New Zealand business, bringing a customer base that had chosen a distinctly digital, self-service-oriented retailer. Its customers therefore skew toward people who selected their retailer on values and on digital experience, which raises expectations for how service feels rather than merely whether it works. Retail contact is dominated by standard energy volume — billing questions, moving house, tariff and plan queries, and payment arrangements — reaching New Zealand-based teams by phone, online account, and email.",
    strategicPressure: [
      { text: "Meridian generates entirely from renewable hydro and wind sources and markets that renewable position as a core brand differentiator", kind: "verified" },
      { text: "Meridian consolidated its retail operations following the Powershop New Zealand acquisition, bringing together customer bases with different service expectations", kind: "verified" },
      { text: "Customers who chose a retailer on values and digital experience judge service quality more harshly than price-motivated switchers, raising the cost of a poor service moment", kind: "inference" },
      { text: "A generation-led business treats retail service technology as an operating cost to be managed rather than a differentiator to be built", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Meridian's capital and engineering attention go to generation assets, wind development, and market operations. Its retail arm is a channel to market for that generation, and its service technology is procured. There is no strategic argument for a generator to develop conversational infrastructure.",
    whyNotBuild:
      "Meridian competes on renewable generation, not on service technology, and its retail base is not large enough by global standards to amortise a platform build. Speech handling for New Zealand English, telephony integration, orchestration into billing and registry systems, and evaluation against consumer care obligations are four disciplines with no connection whatsoever to what makes Meridian valuable.",
    workflows: [
      {
        name: "Billing and tariff servicing",
        friction: "Bill questions require an agent to walk through consumption, tariff structure, and seasonal variation, a repeatable conversation consuming a large share of onshore agent hours",
        outcome: "Bills explained conversationally from meter and tariff data with genuine errors escalated, resolving the highest-volume contact category on first contact",
        channels: ["Voice", "Web chat", "Mobile app"],
        systems: ["Billing/CIS", "Meter data management", "Tariff/plan catalogue", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Moving-house connections",
        friction: "Move transactions require closing one account and opening another with dates, meter details, and identity verification captured by an agent across systems",
        outcome: "Moves completed end to end in one conversation at any hour, retaining values-motivated customers who would otherwise re-evaluate their retailer at the move",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Billing/CIS", "Registry/switching systems", "Identity verification", "Distributor interfaces"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Payment arrangement and arrears first contact",
        friction: "Customers in payment difficulty are handled through phone-based assessment during business hours, and the least confident customers are the least likely to make that call",
        outcome: "A lower-barrier channel for disclosure with structured information captured and policy-bounded arrangements offered, with humans making the actual decisions",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Billing/CIS", "Payment arrangement management", "Payments", "Consumer care case management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Online account management and app-based self-service inherited and developed across consolidated retail brands",
        "New Zealand-based contact teams handling billing, connections, and payment arrangements",
        "Smart-meter interval data supporting usage visibility for the customer base",
        "A renewable-generation brand proposition that drives customer acquisition and loyalty",
      ],
      gaps: [
        "No authenticated voice servicing that resolves a billing question without an agent",
        "No end-to-end conversational move-house transaction outside business hours",
        "No low-barrier disclosure channel for customers approaching payment difficulty",
        "No proactive outreach when usage data indicates a customer would be better on a different plan",
      ],
    },
    risks: [
      "Electricity Authority consumer care obligations require identification and appropriate handling of medically dependent and payment-difficulty consumers, with auditable evidence",
      "New Zealand's Privacy Act 2020 governs consumption data use and any cross-border processing must be disclosed and controlled",
      "A brand built on values expectations means a poor automated experience carries reputational cost disproportionate to the service saving",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 6,
      automationRate: 0.55,
      basis: "Seller assumptions requiring validation: volume estimated from a consolidated New Zealand retail electricity base at typical contact rates, cost reflecting onshore New Zealand service labour, and an automation rate assuming billing and move transactions automate while consumer care conversations escalate.",
    },
    pilotScope:
      "An eight-week pilot automating billing enquiries and moving-house connections across voice and chat, grounded in billing, meter, and registry systems, measured on first-contact resolution and after-hours completion rate.",
    expansion: [
      "Extend to payment arrangement first contact with structured capture and human decision points",
      "Add proactive plan-optimisation outreach where interval data shows a plan mismatch",
      "Introduce business-customer servicing for small and medium commercial accounts",
    ],
    stakeholders: [
      "Chief Executive",
      "General Manager Retail",
      "Chief Information Officer",
      "Head of Customer Operations",
      "Head of Regulatory Affairs",
    ],
    discovery: [
      "What share of your contact volume is billing explanation rather than genuine billing error?",
      "How has service performance tracked since the retail brand consolidation, and where did expectations diverge?",
      "How many move-house transactions do you process monthly, and what proportion complete without an agent today?",
      "How does your brand team think about automated conversations in a values-led customer relationship?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A Meridian customer moving to a new address completes the switch and understands their first bill in one evening conversation.",
  },

  "vocus-group": {
    operatingContext:
      "Vocus is an Australian fibre and network operator whose strategic centre of gravity is enterprise, government, and wholesale connectivity rather than consumer broadband, running substantial intercity and metro fibre infrastructure and, after acquiring the TPG enterprise and wholesale assets, an enlarged business-focused network footprint. Its consumer heritage brands such as Dodo and iPrimus served value-conscious households across broadband and energy, and consumer servicing there runs on a deliberately lean cost base because those brands compete on price. Its business customers generate a very different contact pattern: service assurance, fault escalation, and provisioning status conversations from IT managers who need a specific technical answer quickly. Both sides are undergoing structural change as the group's portfolio is reshaped.",
    strategicPressure: [
      { text: "Vocus acquired TPG Telecom's enterprise, government, and wholesale fibre assets, significantly enlarging its business-focused network operation", kind: "verified" },
      { text: "The group's strategic focus is enterprise and wholesale connectivity, with consumer brands sitting outside that core positioning", kind: "verified" },
      { text: "Business connectivity customers judge providers on fault-response and provisioning-status transparency more than on price, making service communication a retention determinant", kind: "inference" },
      { text: "Consumer brands operating on a lean cost base cannot fund proportionate service staffing, so automation is the only route to acceptable consumer service economics", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Vocus builds and operates networks, and its engineering capability is in fibre, transmission, and network systems rather than customer conversational infrastructure. Consumer service technology in particular is a cost centre in a portfolio positioned around enterprise, which makes buying a proven capability the only sensible route.",
    whyNotBuild:
      "A network operator's engineers build networks. Redirecting them to speech, telephony orchestration, and conversational evaluation would be a category error, and the consumer brands that generate the highest contact volumes are precisely the parts of the portfolio least likely to receive discretionary engineering investment. Purchased capability with usage-based cost matches how those brands are managed.",
    workflows: [
      {
        name: "Consumer billing and connection servicing",
        friction: "Value-brand broadband customers call about bills, plan changes, and connection status into a lean service operation, and wait times reflect a cost base sized for price competition",
        outcome: "Routine consumer servicing resolved conversationally at low unit cost, making acceptable service economics possible for value-positioned brands",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Billing systems", "Provisioning / order management", "NBN and network status feeds", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Business service-assurance desk",
        friction: "Enterprise IT managers call for fault status, ticket updates, and restoration estimates, and the answer often exists in network and ticketing systems the customer cannot see",
        outcome: "Business customers get grounded fault and restoration status any hour without waiting for an account manager, with genuine escalations routed immediately",
        channels: ["Voice", "Email", "Web chat"],
        systems: ["Network monitoring", "ITSM / ticketing", "Service inventory", "Customer portal"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Provisioning and installation status",
        friction: "New business and consumer connections involve carrier dependencies and site works, and status opacity generates repeated chasing calls across the entire provisioning window",
        outcome: "Proactive milestone updates through the provisioning journey, suppressing chase contacts and reducing installation-related complaints",
        channels: ["SMS", "Voice", "Email"],
        systems: ["Provisioning / order management", "Field service scheduling", "Carrier interfaces", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Consumer brand websites and account portals with billing and plan self-service",
        "Business customer portals providing service inventory and ticket visibility",
        "Network operations centres with monitoring and fault-management processes",
        "Contact operations spanning consumer service and business service assurance",
      ],
      gaps: [
        "No conversational fault-status capability for business customers outside account-manager hours",
        "No proactive provisioning milestone communication, so chasing is the customer's default behaviour",
        "No low-cost automated servicing for the consumer brands that generate the most volume",
        "No unified context when a customer moves between portal, phone, and account manager",
      ],
    },
    risks: [
      "Telecommunications Consumer Protections Code obligations govern complaint handling, billing accuracy, and customer communications for consumer services",
      "Enterprise service-level agreements make fault-status accuracy contractually significant, so any automated status statement must be system-derived and correct",
      "Ongoing portfolio restructuring means the consumer brand footprint may change, so scope must be validated against the current corporate structure before commitment",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 5.5,
      automationRate: 0.55,
      basis: "Seller assumptions to validate: volume estimated across consumer brand service contact and business assurance enquiries, cost reflecting a blended consumer and technical support labour mix, and an automation rate assuming billing and status queries automate while technical escalation stays human.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating consumer billing and connection-status servicing for one consumer brand across voice and chat, integrated to billing and provisioning systems, measured on cost per contact and resolution rate.",
    expansion: [
      "Extend to the business service-assurance desk with grounded fault and restoration status",
      "Add proactive provisioning milestone communication across consumer and business connections",
      "Introduce agent-assist for business service managers handling complex enterprise escalations",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Chief Information Officer",
      "Executive General Manager Consumer",
      "Head of Service Assurance",
    ],
    discovery: [
      "How is the consumer brand portfolio structured today after the recent corporate changes, and who owns its service cost?",
      "What proportion of business customer contacts are status enquiries the portal could theoretically answer but does not?",
      "How many chase contacts does an average business connection generate during provisioning?",
      "What is your current cost per contact across consumer versus business service operations?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A Dodo customer checks why their bill changed and confirms their NBN connection date in one conversation, without a queue.",
  },

  "aussie-broadband": {
    operatingContext:
      "Aussie Broadband is a challenger Australian internet provider that grew from regional Victoria into a substantial national player by making one promise its competitors could not credibly match: Australian-based support staffed by people who actually understand the network. That promise is its brand, its pricing justification, and its retention mechanism all at once, and it has expanded into business, enterprise, and wholesale services alongside its residential NBN base. Its support model is deliberately human — customers reach real Australian agents by phone and chat — which produces genuinely high satisfaction scores and genuinely high cost per subscriber as it scales. Its customers skew technically literate and vocal, active on forums and social channels where any perceived erosion of the support promise is immediately visible.",
    strategicPressure: [
      { text: "Aussie Broadband has built its market position explicitly on Australian-based customer support as its central differentiator against larger telcos using offshore contact centres", kind: "verified" },
      { text: "The company has expanded into business, enterprise, and wholesale segments alongside residential broadband, diversifying a support operation designed for consumers", kind: "verified" },
      { text: "A human-support promise creates a cost curve that rises linearly with subscribers, which is exactly the wrong shape for a scaling challenger's unit economics", kind: "inference" },
      { text: "Its technically literate customer base would detect and publicly criticise any automation that degrades the support experience, so the deployment must augment rather than replace", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Aussie Broadband has real technical capability and a culture of building its own operational tooling, so it will not accept a black-box replacement for the support function that defines its brand. The credible engagement is a partnership: after-hours coverage, status automation, and agent-assist that makes its Australian agents faster and better rather than fewer.",
    whyNotBuild:
      "It could build parts of this, and might try — but the four layers together are the problem. Speech recognition tuned for Australian accents across a national base, telephony integration, orchestration into network and provisioning systems, and above all a continuous evaluation regime rigorous enough that this specific customer base cannot catch the agent being wrong. The evaluation discipline is where a partner earns its place: getting caught being wrong is an existential brand risk here, not a service metric.",
    workflows: [
      {
        name: "After-hours connection and outage status",
        friction: "Overnight and weekend faults leave customers with reduced support coverage, and the promise of Australian support is hardest to keep economically at 2am",
        outcome: "Full-quality status, diagnostics, and outage information available around the clock without overnight rostering, extending the support promise rather than diluting it",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Network monitoring / outage systems", "Provisioning / order management", "NBN carrier feeds", "ITSM / ticketing"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Agent assist for in-hours support",
        friction: "Agents build technical context manually across network, provisioning, and ticketing systems while the customer waits, which lengthens the very calls the brand promises will be good",
        outcome: "Every agent opens a call with assembled network state, service history, and suggested diagnostics, cutting handle time while improving the quality customers already praise",
        channels: ["Voice", "Web chat"],
        systems: ["Network monitoring", "Service inventory", "ITSM / ticketing", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Provisioning and connection-milestone updates",
        friction: "New connections depend on NBN carrier processes and site works, and status opacity produces repeated chase calls that consume support capacity without technical content",
        outcome: "Proactive milestone updates through the connection journey, suppressing chase contacts and protecting agent capacity for genuine technical support",
        channels: ["SMS", "Voice", "Email"],
        systems: ["Provisioning / order management", "NBN carrier interfaces", "Field service scheduling", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Australian-based support teams handling phone and chat for residential and business customers",
        "A customer portal and app with service, usage, and billing visibility",
        "Network monitoring and outage-notification capability across its own and NBN infrastructure",
        "Business and enterprise service teams alongside the residential support operation",
      ],
      gaps: [
        "No full-service coverage outside staffed support hours, where the human promise is most expensive",
        "No automated context assembly for agents, so technical lookup time sits inside every call",
        "No proactive connection-milestone communication, leaving chasing as the customer's option",
        "No elastic capacity for major outage events when contact volume spikes far above roster",
      ],
    },
    risks: [
      "The brand promise of human Australian support means any automation perceived as replacing agents carries acute reputational risk with a vocal, forum-active customer base",
      "Telecommunications Consumer Protections Code obligations govern complaint handling, billing accuracy, and service communications",
      "Technical accuracy matters more than usual: a technically literate customer base will publicly identify any incorrect diagnostic or status statement",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 7,
      automationRate: 0.4,
      basis: "Seller assumptions requiring validation: volume estimated from a substantial residential and business subscriber base with above-average contact rates driven by a support-forward brand, cost reflecting fully loaded Australian technical support labour at the high end of the range, and a deliberately conservative automation rate that preserves the human support promise.",
    },
    pilotScope:
      "An eight-week pilot delivering after-hours connection and outage status on voice and chat with full escalation to the next-day support queue, deliberately scoped so that no in-hours human interaction is removed.",
    expansion: [
      "Add agent assist for in-hours support with pre-assembled network and service context",
      "Extend to proactive provisioning and connection-milestone communication",
      "Introduce elastic surge capacity for major outage events alongside existing support teams",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer",
      "Chief Operating Officer",
      "Chief Technology Officer",
      "General Manager Customer Service",
      "Head of Brand and Marketing",
    ],
    discovery: [
      "What does your cost per subscriber for support look like as you scale, and where does that curve become uncomfortable?",
      "How does leadership internally distinguish automation that extends the support promise from automation that dilutes it?",
      "How much of an average technical call is agent lookup time before the diagnosis actually begins?",
      "What is your current after-hours coverage, and what does the customer experience look like at 2am today?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An Aussie Broadband customer at 1am gets a real diagnosis of their outage, with the ticket already open when Australian agents start their shift.",
  },

  "superloop": {
    operatingContext:
      "Superloop is a fast-growing Australian challenger internet provider that operates on two fronts simultaneously: its own consumer and business broadband brands, and a large white-label wholesale arrangement supplying broadband to Origin Energy's customer base. That dual model is the defining operational fact — it must run service for subscribers who know they are Superloop customers and for a far larger base who believe they are buying broadband from an energy company. It also owns fibre infrastructure in Australia and Asia and serves business and wholesale customers alongside residential. Growth has been rapid relative to its cost base, which means subscriber numbers have expanded faster than any service operation designed around them, and the white-label relationship adds a partner whose brand standards it must meet without controlling the customer relationship.",
    strategicPressure: [
      { text: "Superloop supplies broadband on a white-label basis to Origin Energy's customer base, giving it a wholesale-branded subscriber population alongside its own retail brands", kind: "verified" },
      { text: "The company has grown subscriber numbers rapidly as a challenger in the NBN resale market, competing on price and value against much larger incumbents", kind: "verified" },
      { text: "White-label service delivery means service quality is judged by a partner against contracted standards, adding a commercial accountability layer absent from a purely retail model", kind: "inference" },
      { text: "A lean cost base scaling with rapid subscriber growth makes cost per contact the constraint that determines whether the growth is profitable", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Superloop's engineering capability is in network and infrastructure, and its growth strategy consumes capital in subscriber acquisition rather than internal platform development. A challenger scaling fast on a lean cost base needs automation capability now with usage-based cost, not an engineering programme that arrives after the growth curve has already broken the service operation.",
    whyNotBuild:
      "Building the full stack would divert engineering from the network assets that are Superloop's actual balance-sheet value. The white-label relationship also raises the bar: service quality is contractually measured by a partner, and a self-built conversational layer that underperforms would put a wholesale contract at risk, not just a customer satisfaction score.",
    workflows: [
      {
        name: "Connection and provisioning status",
        friction: "New connections depend on NBN carrier processes, and status opacity generates repeat chase calls across both the retail and white-label bases with no proactive communication",
        outcome: "Proactive milestone updates through connection, suppressing chase contacts across both bases and reducing early-life complaints that damage the wholesale relationship",
        channels: ["SMS", "Voice", "Web chat", "Email"],
        systems: ["Provisioning / order management", "NBN carrier interfaces", "Billing", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Outage and fault triage across brands",
        friction: "Faults arrive from subscribers of several brands with different identities and expectations, and agents must first establish which brand and which service before any diagnosis begins",
        outcome: "Brand-aware fault triage with guided diagnostics and network-status grounding, resolving or correctly routing before a human is engaged",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Network monitoring / outage systems", "Service inventory", "ITSM / ticketing", "Partner brand configuration"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Billing and plan servicing",
        friction: "Billing questions differ between retail subscribers and white-label customers billed by the energy partner, and agents must know which rules apply before answering anything",
        outcome: "Correct, brand-specific billing answers delivered automatically, removing a recurring source of wrong information across two very different billing relationships",
        channels: ["Voice", "Web chat", "Mobile app"],
        systems: ["Billing systems", "Partner billing interfaces", "Product/plan catalogue", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Consumer and business broadband brands with online account portals and self-service",
        "A white-label wholesale platform supplying broadband under a major energy retailer's brand",
        "Network monitoring and outage-detection capability across owned and NBN infrastructure",
        "Contact operations covering residential, business, and wholesale-supported subscribers",
      ],
      gaps: [
        "No proactive connection-milestone communication, leaving chasing as the customer's default",
        "No brand-aware automated triage that knows which brand and rule set a caller belongs to",
        "No after-hours fault and status capability across a subscriber base that grew faster than the roster",
        "No scalable service capacity to absorb wholesale-partner subscriber growth without linear hiring",
      ],
    },
    risks: [
      "Telecommunications Consumer Protections Code obligations apply to complaint handling, billing accuracy, and service communications across all brands served",
      "White-label contractual service levels mean automated service quality is measured by a commercial partner, raising the consequence of poor performance",
      "Brand and data separation between retail and wholesale-supported subscribers must be enforced rigorously so that no partner customer is served with the wrong identity or information",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 5.5,
      automationRate: 0.6,
      basis: "Seller assumptions to validate: volume estimated across retail and white-label supported subscriber bases at typical broadband contact rates, cost reflecting a lean Australian and offshore support mix, and a high automation rate given the transactional nature of connection, billing, and status enquiries.",
    },
    pilotScope:
      "An eight-week pilot delivering proactive connection and provisioning status across SMS and voice for the retail broadband base, integrated to provisioning and NBN carrier interfaces, measured on chase-contact suppression per connection.",
    expansion: [
      "Extend to outage and fault triage with guided diagnostics across retail brands",
      "Add brand-aware billing and plan servicing including white-label partner rule sets",
      "Roll the service layer to the wholesale-supported subscriber base under partner brand standards",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Chief Technology Officer",
      "General Manager Consumer",
      "Head of Wholesale Partnerships",
    ],
    discovery: [
      "How is service responsibility divided between Superloop and Origin for white-label subscribers today?",
      "How many chase contacts does an average new connection generate before it goes live?",
      "What is your cost per contact, and how has it moved as subscriber numbers have grown?",
      "How do partner-contracted service levels measure your performance, and where are you closest to breaching them?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A new Superloop customer gets each NBN provisioning milestone pushed to them instead of calling three times to ask.",
  },

  "two-degrees": {
    operatingContext:
      "2degrees is New Zealand's third mobile and broadband operator, formed by merging the original 2degrees mobile challenger with Vocus New Zealand's fixed-line and broadband business, giving it a genuinely converged mobile-plus-broadband proposition against Spark and One NZ. It has always competed on value — it built its early brand on making mobile more affordable for New Zealanders — and that value positioning constrains what it can spend to serve each customer. The merger left it integrating multiple billing, provisioning, and customer systems, which means agents frequently work across environments to answer a single customer question. Customers reach it through an app and online account, New Zealand-based contact teams, and retail stores, with billing, plan changes, and retention conversations dominating assisted volume.",
    strategicPressure: [
      { text: "2degrees was formed by the merger of the 2degrees mobile business with Vocus New Zealand's fixed-line operations, creating a converged third operator", kind: "verified" },
      { text: "The company built and maintains a value-based market position against New Zealand's two larger telecommunications operators", kind: "verified" },
      { text: "Post-merger system consolidation means agents work across multiple environments for a single customer, inflating handle time until integration completes", kind: "inference" },
      { text: "A value proposition caps cost to serve, so growth in the converged base without automation compresses the margin the value position depends on", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. 2degrees is a third operator in a small market with technology capacity fully committed to post-merger system consolidation. There is no realistic path to funding conversational-platform engineering alongside that integration work, and a bought layer that can span multiple back-end environments is actually more useful during integration than after it.",
    whyNotBuild:
      "Every available engineering hour is consumed by merging billing, provisioning, and customer systems. Adding speech, telephony, orchestration, and evaluation development to that agenda is implausible. A purchased conversational layer that sits above several back ends also solves an integration-period problem rather than waiting for integration to finish.",
    workflows: [
      {
        name: "Billing and plan-change servicing",
        friction: "Billing questions and plan changes require agents to work across merged systems, and customers holding both mobile and broadband often need two lookups for one question",
        outcome: "Billing explained and plan changes executed conversationally across mobile and broadband regardless of which back end holds the service",
        channels: ["Voice", "Web chat", "Mobile app", "SMS"],
        systems: ["Mobile billing", "Broadband billing", "Product/plan catalogue", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Retention and churn-save conversations",
        friction: "Customers approaching contract end or showing churn signals are reached only as far as the save team's capacity allows, and in a value market the competitor offer is always one call away",
        outcome: "Every at-risk customer engaged in a two-way conversation with retention offers from an approved matrix, and specialists reserved for high-value converged households",
        channels: ["Voice", "SMS", "Mobile app"],
        systems: ["CRM", "Churn model / customer data", "Retention offer matrix", "Billing systems"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Broadband fault and connection support",
        friction: "Fixed-line faults and new connections depend on network and installer processes, and status opacity produces repeated chase calls into a value-priced support operation",
        outcome: "Guided diagnostics and proactive connection milestones handle the volume that carries no revenue, protecting agent capacity for sales and complex support",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Network monitoring / outage systems", "Provisioning / order management", "Field service scheduling", "ITSM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A customer app and online account covering mobile and broadband services",
        "New Zealand-based contact centres plus a retail store presence",
        "Converged mobile and broadband product bundles following the merger",
        "Network monitoring and outage-notification capability across fixed and mobile services",
      ],
      gaps: [
        "No conversational layer that spans merged billing and provisioning environments in one answer",
        "No capacity to reach every at-risk customer before a competitor offer converts them",
        "No guided broadband fault diagnostics before a human agent is engaged",
        "No after-hours servicing despite value-market customers making decisions in the evening",
      ],
    },
    risks: [
      "New Zealand's Telecommunications Dispute Resolution scheme and consumer-protection expectations govern complaint handling and billing accuracy",
      "The Privacy Act 2020 governs use of customer and usage data for retention targeting and requires transparency about automated outreach",
      "Post-merger system fragmentation means grounding sources must be verified per environment or the agent will confidently return stale or wrong account data",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 5.5,
      automationRate: 0.6,
      basis: "Seller assumptions requiring validation: volume estimated from a converged New Zealand mobile and broadband base at typical telecom contact rates, cost reflecting a blended onshore and offshore support mix, and a high automation rate given the transactional dominance of billing and plan enquiries.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating mobile billing and plan-change servicing across voice and app chat, grounded in the mobile billing environment, architected to add the broadband back end without redesign.",
    expansion: [
      "Extend to broadband billing and converged household servicing across both back ends",
      "Add retention and churn-save conversations with offers from an approved matrix",
      "Introduce guided broadband fault diagnostics and proactive connection milestones",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Customer Officer",
      "Chief Technology Officer",
      "General Manager Customer Operations",
      "Head of Retention and Base Management",
    ],
    discovery: [
      "How far through post-merger system consolidation are you, and how many systems does an agent touch for a converged customer?",
      "What proportion of your at-risk base does the retention team actually contact before churn completes?",
      "What is your cost to serve per subscriber, and how does that compare with the larger two operators?",
      "How much of your contact volume is billing explanation that a grounded conversation could resolve on first contact?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A 2degrees customer with mobile and broadband on one account gets both charges explained and a plan changed in a single conversation.",
  },

  "one-nz": {
    operatingContext:
      "One New Zealand is one of the country's two largest telecommunications operators, the former Vodafone New Zealand, rebranded after Infratil-led ownership took control and separated it from the global Vodafone group. It serves millions of mobile connections plus broadband and business services, and it has pursued visible technology positioning including satellite-to-mobile coverage for remote parts of New Zealand — a genuinely differentiating capability in a country with substantial rural and backcountry areas. Rebranding away from Vodafone required rebuilding brand, systems, and customer relationships simultaneously, and modernisation since has been pursued through partnerships rather than deep internal platform development. Customers reach it through the app, online account, New Zealand contact teams, and retail stores, with billing, plan changes, retention, and outage events dominating volume.",
    strategicPressure: [
      { text: "One New Zealand rebranded from Vodafone New Zealand following the change in ownership, requiring a full brand and systems transition away from the global group", kind: "verified" },
      { text: "The company has publicised satellite-to-mobile connectivity for remote New Zealand coverage, positioning technology leadership as a competitive differentiator", kind: "verified" },
      { text: "Separation from a global telco group removed access to group-built platforms, making partner-led modernisation the practical route for capability the business needs", kind: "inference" },
      { text: "Network outage events in a two-operator market generate concentrated contact spikes with immediate national media attention", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. One NZ has scale and technology ambition but no longer has a global group platform to draw on, and its post-Vodafone modernisation has proceeded through partnerships rather than internal builds. Telco-scale retention, billing, and outage servicing is a well-understood high-volume automation target that a partner delivers faster than any internal programme could.",
    whyNotBuild:
      "New Zealand market scale does not amortise a conversational-platform build the way a global telco group could. Building would require New Zealand English and te reo-inflected speech handling, telephony integration across a modernising estate, orchestration into billing and network systems, and continuous evaluation — while the business is still completing the separation from its former parent's technology.",
    workflows: [
      {
        name: "Retention and contract-end conversations",
        friction: "Customers reaching contract end or showing churn signals are contacted only within outbound capacity, and in a two-operator market the competing offer is immediate and well advertised",
        outcome: "Every at-risk customer engaged conversationally with offers bounded by approved economics, with specialists focused on high-value and business accounts",
        channels: ["Voice", "SMS", "Mobile app"],
        systems: ["Billing systems", "Churn model / customer data platform", "Retention offer matrix", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Outage-event servicing surge",
        friction: "A network outage generates an immediate contact spike with national media attention, and fixed contact capacity cannot absorb it, so the service failure compounds the network failure",
        outcome: "Every affected customer reaches accurate outage information and restoration estimates immediately, and proactive notification suppresses much of the spike before it forms",
        channels: ["Voice", "SMS", "Mobile app", "Social messaging"],
        systems: ["Network monitoring / outage systems", "Customer location/service data", "Incident management", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Billing and plan servicing",
        friction: "Billing questions, plan changes, and roaming queries consume the bulk of assisted contact, and each is a lookup and explanation an agent performs at full onshore cost",
        outcome: "Routine billing and plan volume resolved conversationally at any hour, releasing agent capacity for retention and business customer work",
        channels: ["Voice", "Mobile app", "Web chat", "SMS"],
        systems: ["Billing systems", "Product/plan catalogue", "Roaming/usage data", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer app and online account with billing, usage, and plan self-service",
        "New Zealand-based contact centres plus a national retail store network",
        "Network monitoring and outage-communication processes across mobile and fixed services",
        "Satellite-to-mobile coverage capability extending service into remote areas",
      ],
      gaps: [
        "No capacity to have a retention conversation with the full at-risk base each month",
        "No elastic contact capacity for network outage events that draw immediate national attention",
        "No authenticated voice automation completing billing and plan transactions without an agent",
        "No proactive, location-aware outage notification before affected customers begin calling",
      ],
    },
    risks: [
      "New Zealand's Telecommunications Dispute Resolution scheme and consumer-protection expectations govern complaint handling and billing communications",
      "The Privacy Act 2020 governs use of location, usage, and behavioural data for outage targeting and retention outreach",
      "Outage communications carry acute accuracy risk: a wrong restoration estimate during a national incident amplifies rather than reduces the reputational damage",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 6,
      automationRate: 0.6,
      basis: "Seller assumptions to validate: volume estimated from a multi-million-connection New Zealand mobile and broadband base at typical telecom contact rates, cost reflecting a blended onshore and offshore support mix, and a high automation rate given the dominance of billing and status enquiries.",
    },
    pilotScope:
      "A ten-week pilot automating billing and plan servicing on voice and app chat for the consumer mobile base, integrated to billing and plan catalogue, with an outage-surge module tested against a simulated incident.",
    expansion: [
      "Extend to retention and contract-end conversations with offers from an approved matrix",
      "Add proactive, location-aware outage notification and elastic surge handling for incidents",
      "Introduce business-customer service-assurance workflows alongside consumer servicing",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Customer Officer",
      "Chief Technology Officer",
      "General Manager Consumer",
      "Head of Customer Care Operations",
    ],
    discovery: [
      "During your last significant outage, what happened to contact volume and how much of it was people simply asking whether you knew?",
      "What proportion of your contract-end base receives an outbound retention conversation today?",
      "Which platform commitments were made during the post-Vodafone modernisation that constrain a new conversational layer?",
      "What is your cost per contact, and how does the board view it relative to the other operator's?",
    ],
    flowTemplate: "retention",
    scenario: "A One NZ customer nearing contract end gets a call matching their actual data use before the competitor's offer arrives in the letterbox.",
  },

  "virgin-australia": {
    operatingContext:
      "Virgin Australia is the country's second airline, rebuilt under Bain Capital ownership after administration and returned to the ASX, running a simplified mid-market model focused on domestic trunk routes and leisure destinations with a narrower fleet and a leaner cost base than its pre-administration form. Its Velocity Frequent Flyer programme has millions of members and is a significant business in its own right, generating a continuous stream of points, status, redemption, and partner-earn enquiries entirely separate from flight operations. Its contact volume is structurally spiky: a weather event, an air traffic control disruption, or an engineering issue converts a normal day into a queue crisis within an hour, and disruption is precisely when customer contact is most valuable and most expensive. Customers reach it through the app, website, phone teams, airport service desks, and social channels.",
    strategicPressure: [
      { text: "Virgin Australia was rebuilt under Bain Capital ownership following voluntary administration and subsequently returned to public listing on the ASX", kind: "verified" },
      { text: "The airline operates the Velocity Frequent Flyer programme with millions of members, which generates its own substantial servicing volume independent of flying", kind: "verified" },
      { text: "Airline disruption produces contact spikes an order of magnitude above baseline, and no fixed contact-centre roster can economically be sized for them", kind: "verified" },
      { text: "A post-restructure airline with a deliberately lean cost base is structurally unable to solve disruption capacity by hiring, leaving automation as the only lever", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. Virgin Australia's technology investment is committed to core airline systems — reservations, operations, loyalty — and a post-restructure carrier does not fund speculative platform engineering. Airline conversational automation also requires deep integration with reservation and disruption-management systems, which is partner-delivered integration work rather than a product purchase alone.",
    whyNotBuild:
      "Airlines build revenue management and operations capability, not speech platforms. Building here would require Australian-accented speech across a broad travelling public, telephony integration, orchestration into reservations, loyalty, and disruption management, and evaluation robust enough to handle the highest-emotion conversations an airline has. The spiky demand curve also makes purchased elastic capacity fundamentally the right commercial shape.",
    workflows: [
      {
        name: "Disruption rebooking and proactive notification",
        friction: "When flights cancel, affected passengers all call at once, queues stretch to an hour, and passengers standing in terminals cannot reach anyone while seats on alternative flights are taken by whoever gets through first",
        outcome: "Affected passengers notified proactively with live rebooking options offered and confirmed in-channel, absorbing the spike and rebooking passengers before they reach the queue",
        channels: ["Mobile app", "SMS", "Voice", "Email"],
        systems: ["Reservation system", "Disruption management", "Inventory/seat availability", "Departure control"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Velocity Frequent Flyer servicing",
        friction: "Members query missing points from partner earns, status credit calculations, redemption availability, and family pooling, and each requires an agent to reconcile across loyalty and partner systems",
        outcome: "Loyalty queries resolved instantly with points reconciled and redemptions completed conversationally, converting a cost centre into a redemption and engagement moment",
        channels: ["Voice", "Mobile app", "Web chat", "Email"],
        systems: ["Loyalty platform", "Partner earn interfaces", "Reservation system", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Refund and credit status",
        friction: "Refunds and travel credits move through a multi-step process with no customer-facing visibility, so passengers call repeatedly and each call reads a status back rather than advancing anything",
        outcome: "Live refund and credit status available on demand with proactive updates at each stage, eliminating a persistent and entirely avoidable contact category",
        channels: ["Voice", "Mobile app", "SMS", "Email"],
        systems: ["Reservation system", "Payments/refund processing", "Travel credit management", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mobile app and website supporting booking, check-in, and self-service changes",
        "The Velocity Frequent Flyer programme with a member app, partner earn network, and redemption capability",
        "Contact centres handling reservations, disruption, and loyalty enquiries",
        "Airport service desks and lounge teams providing in-person disruption handling",
      ],
      gaps: [
        "No elastic conversational capacity when disruption multiplies contact volume within an hour",
        "No proactive rebooking offer that reaches passengers before they join the queue",
        "No instant reconciliation of missing Velocity points from partner earns",
        "No live refund and travel-credit status, so passengers chase a process they cannot see",
      ],
    },
    risks: [
      "Australian Consumer Law guarantees apply to flight cancellations and delays, and the developing aviation consumer protection agenda raises expectations for how disruption is communicated and remedied",
      "Disruption conversations are the highest-emotion contacts an airline has, so vulnerability and distress detection with immediate human escalation is essential",
      "Rebooking actions write directly to inventory, so authorisation boundaries and error handling must be precise or the operational consequences are immediate",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 6.5,
      automationRate: 0.55,
      basis: "Seller assumptions requiring validation: volume estimated from domestic passenger numbers plus a multi-million-member loyalty base, cost reflecting airline reservations and service labour with a mixed onshore and offshore footprint, and an automation rate assuming status, loyalty, and standard rebooking automate while complex itineraries escalate.",
    },
    pilotScope:
      "A ten-to-fourteen week pilot delivering proactive disruption notification and in-channel rebooking for domestic flights on app, SMS, and voice, integrated to the reservation and disruption-management systems, measured on rebooking completion before queue contact.",
    expansion: [
      "Extend to Velocity Frequent Flyer servicing including points reconciliation and redemption",
      "Add refund and travel-credit status with proactive stage notifications",
      "Introduce agent-assist for airport and contact-centre staff during declared disruption events",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Customer and Digital Officer",
      "Chief Operating Officer",
      "Chief Executive Velocity Frequent Flyer",
      "Chief Information Officer",
    ],
    discovery: [
      "On your worst disruption day last year, what happened to contact volume, average speed of answer, and abandonment?",
      "What proportion of disrupted passengers are rebooked proactively today versus after they contact you?",
      "How much of your contact volume is Velocity loyalty servicing rather than flight-related?",
      "How long does a refund take end to end, and how many contacts does an average refund generate?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "When fog closes Sydney, Virgin Australia passengers are offered and confirmed onto alternative flights before they reach the service desk.",
  },

  "flight-centre": {
    operatingContext:
      "Flight Centre Travel Group is a global travel company headquartered in Brisbane, operating leisure retail brands including the Flight Centre shops themselves alongside a very substantial corporate travel business through FCM Travel and Corporate Traveller. Its proposition in both halves is expert human advice: leisure consultants who design complex trips, and corporate travel managers who look after business travellers, both underpinned by a 24/7 servicing promise that a booked traveller can always reach someone. That promise is expensive — after-hours and emergency assistance teams exist to handle schedule changes and disruptions at any hour, and much of what they handle is transactional rather than advisory. Corporate travel adds a further dimension: policy compliance, approval workflows, and duty-of-care obligations to travelling employees that consumer travel does not carry.",
    strategicPressure: [
      { text: "Flight Centre operates both a leisure retail network and a large corporate travel business through FCM Travel and Corporate Traveller, serving fundamentally different customer types", kind: "verified" },
      { text: "Its service model rests on a 24/7 assistance promise for booked travellers, which requires staffed capacity across all time zones and hours", kind: "verified" },
      { text: "Airline schedule changes cascade automatically through booked itineraries, generating high-volume transactional rework that consultants absorb rather than advisory work", kind: "inference" },
      { text: "Consultant time spent on transactional servicing is time not spent selling, which directly caps the revenue a fixed consultant base can generate", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Flight Centre has genuine technology capability and has invested in its own corporate booking and management tools, so it will not accept a commodity deployment. But its differentiation is human expertise and supplier relationships, not conversational infrastructure, and the after-hours and transactional layer is exactly where a partner adds capacity without touching the advisory model the brand is built on.",
    whyNotBuild:
      "The company's technology investment goes into booking, corporate travel management, and supplier connectivity where it creates commercial advantage. Building a conversational stack would demand speech handling across multiple markets, telephony integration into a globally distributed service operation, orchestration into GDS and mid-office systems, and evaluation across duty-of-care-sensitive conversations — four capabilities with no relationship to why customers choose a travel expert.",
    workflows: [
      {
        name: "After-hours booking and schedule-change servicing",
        friction: "Airline schedule changes and traveller-initiated amendments arrive around the clock, and after-hours teams handle transactional rework at premium staffing cost across time zones",
        outcome: "Schedule changes actioned and amendments completed conversationally at any hour, with human assistance teams reserved for genuine emergencies and complex itineraries",
        channels: ["Voice", "WhatsApp", "SMS", "Email"],
        systems: ["GDS / booking platform", "Mid-office / ticketing", "Supplier interfaces", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Corporate traveller support and policy compliance",
        friction: "Business travellers need changes made within corporate travel policy and approval rules, and consultants must check policy, seek approvals, and rebook manually while the traveller waits",
        outcome: "Policy-compliant changes executed in-conversation with approvals routed automatically, giving corporate travellers immediate service and clients a demonstrable duty-of-care record",
        channels: ["Voice", "Mobile app", "WhatsApp", "Email"],
        systems: ["Corporate booking tool", "Travel policy engine", "Approval workflow", "GDS / booking platform"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Leisure enquiry qualification and consultant handoff",
        friction: "Leisure enquiries arrive through web forms, phone, and store contact, and consultants spend early conversation time on destination basics and budget qualification before advisory value begins",
        outcome: "Enquiries qualified conversationally on dates, budget, party, and preferences, so consultants open every conversation at the point where their expertise actually matters",
        channels: ["Voice", "Web chat", "WhatsApp", "SMS"],
        systems: ["CRM", "Product and supplier catalogue", "Calendar scheduling", "Marketing automation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Retail store networks and consultant teams across leisure brands",
        "Corporate travel platforms and dedicated travel managers through FCM and Corporate Traveller",
        "24/7 emergency assistance teams supporting booked travellers globally",
        "Online booking capability alongside consultant-managed bookings",
      ],
      gaps: [
        "No automated handling of schedule-change cascades, so transactional rework consumes advisory capacity",
        "No conversational channel that applies corporate travel policy and approvals without a consultant",
        "No instant response to leisure enquiries outside consultant availability",
        "No consistent servicing experience when a traveller moves between store, phone, and after-hours teams",
      ],
    },
    risks: [
      "Corporate duty-of-care obligations mean traveller-safety and disruption communications must be reliable and auditable, since clients contract on that basis",
      "Travel bookings involve supplier terms, fare rules, and change penalties, so automated statements about cost and eligibility must be system-derived and accurate",
      "The consultant-led brand promise means automation must be positioned as protecting advisory time rather than replacing the human expertise customers pay for",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 7,
      automationRate: 0.5,
      basis: "Seller assumptions to validate: volume estimated across leisure and corporate servicing contacts including after-hours assistance, cost reflecting skilled travel-consultant labour at the higher end of the ANZ range, and a moderate automation rate reflecting the advisory content of leisure conversations.",
    },
    pilotScope:
      "A ten-to-fourteen week pilot automating after-hours schedule-change servicing and booking amendments for one corporate brand across voice and messaging, integrated to the booking platform and policy engine.",
    expansion: [
      "Extend corporate traveller support with policy-compliant changes and automated approval routing",
      "Add leisure enquiry qualification with consultant calendar handoff across retail brands",
      "Introduce proactive disruption notification and rebooking for both corporate and leisure travellers",
    ],
    stakeholders: [
      "Global Managing Director / Chief Executive Officer",
      "Chief Executive FCM Travel",
      "Chief Information Officer",
      "General Manager Corporate Traveller",
      "Head of Customer Experience and Operations",
    ],
    discovery: [
      "What share of after-hours assistance volume is transactional schedule-change work rather than genuine emergency?",
      "How much consultant time per booking goes to servicing after the sale rather than to selling?",
      "What duty-of-care evidence do your corporate clients require in their contracts, and how is it produced today?",
      "Which brands have service operations centralised enough to deploy against first?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A Corporate Traveller client's flight is retimed overnight and the traveller is rebooked within policy before their alarm goes off.",
  },

  "webjet-group": {
    operatingContext:
      "Webjet Group is Australia's best-known consumer online travel agency brand, operating the Webjet OTA and associated consumer travel businesses following the demerger that separated it from the B2B WebBeds hotel-distribution business. Its model is digital-first and deliberately lean: customers book flights and packages online at low margin, and the economics depend on servicing costs staying proportionate to a booking fee rather than a full-service travel agency margin. That makes airline schedule changes its central operational problem — when an airline retimes or cancels, the cascade hits every affected booking, and as the agency of record Webjet must communicate and re-issue. Refund processing adds a second persistent volume driver, because refunds depend on airline timelines the OTA does not control but does get blamed for.",
    strategicPressure: [
      { text: "Webjet Group was separated from the B2B WebBeds business by demerger, leaving a focused consumer online travel agency operating at OTA margins", kind: "verified" },
      { text: "As agency of record, an OTA absorbs the servicing consequences of airline schedule changes and refund timelines it does not control", kind: "verified" },
      { text: "OTA booking-fee economics make every assisted contact disproportionately expensive relative to the revenue on the transaction that generated it", kind: "inference" },
      { text: "Schedule-change cascades cluster unpredictably, so a fixed service roster is simultaneously over-staffed on quiet weeks and overwhelmed when a carrier retimes a season", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Webjet's engineering investment goes into the booking platform and conversion funnel that generates revenue, and its post-demerger scale does not support conversational-platform development. Servicing is a cost line to be minimised, which makes purchased automation with usage-based cost the structurally correct answer.",
    whyNotBuild:
      "An OTA earning a booking fee cannot fund four engineering disciplines to service that booking. The volume is also episodic — driven by carrier schedule decisions rather than by its own operations — so purchased elastic capacity fits the demand shape in a way a fixed internal team never could.",
    workflows: [
      {
        name: "Schedule-change notification and rebooking",
        friction: "Airline retimings and cancellations cascade across affected bookings, and customers learn from the airline or not at all, then call the OTA which must interpret fare rules and re-issue manually",
        outcome: "Affected customers notified proactively with compliant options presented and re-issue completed in-channel, converting the OTA's biggest cost event into a service advantage",
        channels: ["Email", "SMS", "Voice", "Web chat"],
        systems: ["Booking platform / GDS", "Airline schedule feeds", "Ticketing / re-issue", "Payments"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Refund status and processing",
        friction: "Refunds depend on airline processing timelines the OTA cannot accelerate, and customers call repeatedly for updates on a process with no visible state, blaming the agency for the delay",
        outcome: "Live refund state exposed conversationally with proactive updates at each stage, eliminating the OTA's most persistent and least productive contact category",
        channels: ["Voice", "Email", "SMS", "Web chat"],
        systems: ["Booking platform", "Payments / refund processing", "Airline settlement interfaces", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Booking amendment and ancillary servicing",
        friction: "Name corrections, date changes, baggage additions, and seat selections require agents to check fare rules and airline policies before quoting a change cost, for low-value transactions",
        outcome: "Amendments quoted and executed conversationally against live fare rules, with genuine exceptions escalated and everything else handled without an agent",
        channels: ["Voice", "Web chat", "Email"],
        systems: ["Booking platform / GDS", "Fare rules engine", "Airline ancillary interfaces", "Payments"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A consumer online travel agency platform with flight and package booking",
        "Manage-my-booking self-service for basic itinerary visibility",
        "Customer service teams handling amendments, schedule changes, and refunds",
        "Airline and supplier connectivity supporting ticketing and re-issue",
      ],
      gaps: [
        "No proactive schedule-change notification with rebooking options presented before the customer calls",
        "No visible refund state, so customers chase a process they cannot see",
        "No automated amendment quoting against live fare rules for low-value changes",
        "No elastic service capacity for the carrier-driven volume events that define the cost curve",
      ],
    },
    risks: [
      "Australian Consumer Law and travel-agency obligations govern representations about refunds and cancellation rights, so automated statements must be accurate about who owes what",
      "Fare rules and change penalties vary by airline and fare class, so any quoted change cost must be system-derived rather than generalised",
      "As agency of record the OTA carries reputational blame for airline decisions, so communication tone and clarity about responsibility matter commercially",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 5.5,
      automationRate: 0.6,
      basis: "Seller assumptions requiring validation: volume estimated from OTA booking volumes at typical servicing contact rates weighted for schedule-change events, cost reflecting a lean blended service operation, and a high automation rate given the transactional and rules-driven nature of the volume.",
    },
    pilotScope:
      "An eight-week pilot delivering proactive schedule-change notification with rebooking options across email, SMS, and voice for one major carrier's affected bookings, integrated to the booking platform and schedule feeds.",
    expansion: [
      "Extend to refund status exposure with proactive stage-by-stage updates",
      "Add booking amendment quoting and execution against live fare rules",
      "Introduce ancillary sales conversations for baggage, seats, and insurance on existing bookings",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Chief Technology Officer",
      "Head of Customer Service",
      "Chief Financial Officer",
    ],
    discovery: [
      "How many customer contacts does a single airline schedule-change event generate across affected bookings?",
      "What is your average contact volume per booking, and what does that cost against your booking fee?",
      "How long does an average refund take, and how many status contacts does each one generate?",
      "How much of your service cost is driven by carrier decisions rather than by anything you control?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A Webjet customer whose airline retimed their return flight is offered two alternatives and re-ticketed before they notice the change.",
  },

  "nrma": {
    operatingContext:
      "The NRMA is Australia's largest mutual, a member-owned motoring organisation with millions of members whose core service is roadside assistance dispatched across New South Wales and the ACT, alongside an expanding portfolio of holiday parks and resorts, an electric-vehicle charging network, driver training, and travel businesses. Its insurance brand sits with a separate partner organisation, so the mutual's own service operation is centred on roadside, membership, and its leisure assets rather than on claims. Roadside assistance is inherently a real-time logistics operation: a member breaks down, a job is created, a patrol or contractor is dispatched, and the member wants to know when someone will arrive — which generates enormous status-enquiry volume concentrated on hot days, cold snaps, and long weekends. Membership renewals and holiday-park bookings add two further high-frequency conversation streams.",
    strategicPressure: [
      { text: "The NRMA operates as a member-owned mutual with millions of members and has diversified into holiday parks, resorts, electric-vehicle charging, and travel alongside roadside assistance", kind: "verified" },
      { text: "Roadside demand spikes sharply with weather extremes and holiday travel periods, concentrating call volume into predictable but unmanageable peaks", kind: "verified" },
      { text: "Where-is-my-patrol enquiries are pure status volume that adds no value to the job but consumes the same dispatch-centre capacity that assigns patrols", kind: "inference" },
      { text: "Diversification into parks and resorts creates booking and enquiry volume handled separately from the motoring service operation, fragmenting the member experience", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A member-owned mutual allocates surplus to member benefits and asset investment, not to platform engineering, and its technology has been procured across dispatch, membership, and booking systems. Roadside status and membership servicing are well-understood workflows where packaged capability delivers measurable member-benefit improvement without capital diversion.",
    whyNotBuild:
      "A mutual would have to justify to its members why their subscriptions funded a speech-technology team. Building would require Australian speech handling across a very broad demographic including distressed roadside callers, telephony integration into a dispatch operation, orchestration across dispatch, membership, and booking systems, and continuous evaluation — none of which advances the member proposition the way faster roadside response does.",
    workflows: [
      {
        name: "Roadside job status and ETA updates",
        friction: "Members who have called for help ring back asking where the patrol is, and those calls hit the same dispatch capacity that is trying to assign patrols during a peak",
        outcome: "Live job status and revised ETAs pushed proactively and answered instantly, protecting dispatch capacity for actual dispatching during weather and holiday peaks",
        channels: ["Voice", "SMS", "Mobile app"],
        systems: ["Roadside dispatch system", "Patrol/contractor tracking", "Membership system", "Job management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Membership renewal and benefit conversations",
        friction: "Renewals are handled by notice and outbound calling within capacity limits, so most members renew or lapse without a conversation about the benefits they are not using",
        outcome: "Every renewing member reached conversationally with their actual usage and unused benefits surfaced, lifting retention and cross-portfolio engagement",
        channels: ["Voice", "SMS", "Email", "Mobile app"],
        systems: ["Membership system", "Billing/payments", "Benefit catalogue", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Holiday park and resort booking enquiries",
        friction: "Park bookings, availability questions, and amendments are handled park by park or through a central line, and peak-season enquiry volume outstrips the small teams answering it",
        outcome: "Availability, booking, and amendment handled conversationally across the park network, converting enquiry volume into bookings during peak demand",
        channels: ["Voice", "Web chat", "SMS", "Email"],
        systems: ["Property management / booking system", "Membership system", "Payments", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A member app with roadside request, job tracking, and membership details",
        "A national dispatch operation coordinating patrols and contracted providers",
        "Membership administration with renewal, benefits, and payment processes",
        "Holiday park and resort booking systems across the leisure portfolio",
      ],
      gaps: [
        "No conversational status channel, so where-is-my-patrol calls hit the dispatch centre",
        "No capacity to have a renewal conversation with every member each year",
        "No unified member view spanning roadside, parks, charging, and travel businesses",
        "No elastic capacity for the weather and holiday peaks that define the roadside cost curve",
      ],
    },
    risks: [
      "Roadside calls can involve genuine safety emergencies, so distress and hazard detection must trigger immediate human and emergency-service escalation without exception",
      "The Privacy Act governs member data across motoring, parks, and charging businesses, and cross-portfolio use must stay within disclosed collection purposes",
      "Mutual governance means member-facing service changes attract member and board scrutiny, so the framing must be improved member service rather than cost reduction",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 5.5,
      automationRate: 0.6,
      basis: "Seller assumptions to validate: volume estimated from millions of members generating roadside jobs, renewal contacts, and leisure bookings annually, cost reflecting Australian dispatch and member-service labour, and a high automation rate given the dominance of status and transactional enquiries.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating roadside job status and ETA updates across voice, SMS, and app for one state region, integrated to dispatch and patrol tracking, measured on dispatch-centre call deflection during a peak period.",
    expansion: [
      "Extend to membership renewal conversations with personalised benefit and usage insight",
      "Add holiday park and resort booking, availability, and amendment handling",
      "Introduce a unified member front door spanning roadside, parks, charging, and travel",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Chief Member Officer",
      "Chief Information Officer",
      "General Manager Roadside Operations",
      "General Manager Parks and Resorts",
    ],
    discovery: [
      "What proportion of dispatch-centre calls during a heatwave are status enquiries rather than new jobs?",
      "How many members receive an actual renewal conversation each year versus a renewal notice?",
      "How much do members use the wider portfolio — parks, charging, travel — and how is that conversation had today?",
      "What safety escalation rules would your operations team require before an automated agent handles a roadside call?",
    ],
    flowTemplate: "order-logistics",
    scenario: "An NRMA member stranded on the M1 in 40-degree heat gets a live patrol ETA without calling the dispatch centre back.",
  },

  "racv": {
    operatingContext:
      "RACV is Victoria's motoring mutual, member-owned with a very large Victorian member base, and it is unusually diversified for a motoring club: alongside roadside assistance it runs Emergency Home Assist and a substantial home trades business covering electrical, plumbing, heating and cooling, and security, plus a resorts and clubs portfolio and insurance distributed through a partnership. That home-services arm makes RACV operationally more like a trades-dispatch business than a pure motoring club — bookings, technician scheduling, quotes, and job status across thousands of Victorian homes. Its members interact with it far more often than an insurance-only relationship would generate, across roadside, home, leisure, and membership. Contact is handled through the RACV app, member service teams, and business-line-specific booking channels.",
    strategicPressure: [
      { text: "RACV operates roadside assistance alongside home trades and emergency home assistance services, resorts and clubs, and insurance distribution to a large Victorian member base", kind: "verified" },
      { text: "Victorian weather events — storms, heatwaves, cold snaps — drive simultaneous surges in roadside callouts and home emergency assistance", kind: "verified" },
      { text: "Trades booking and technician scheduling is a fundamentally different conversation from roadside dispatch, and running both through member service teams creates skill fragmentation", kind: "inference" },
      { text: "Members holding several RACV services still experience them as separate operations, so cross-portfolio context is lost at every contact", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A member-owned mutual invests in member benefits and service assets, not in conversational platform engineering, and RACV's technology has consistently been procured across its diversified business lines. The diversity itself argues for a configurable bought layer that can serve roadside, trades, and resorts rather than a bespoke build per line.",
    whyNotBuild:
      "No mutual can justify to its members funding speech, telephony, orchestration, and evaluation engineering. RACV's operational complexity — several business lines with different scheduling systems — also means a build would effectively be four builds. A configurable purchased platform that spans lines is both cheaper and structurally better matched to how the organisation actually works.",
    workflows: [
      {
        name: "Home trades booking and technician scheduling",
        friction: "Members booking an electrician, plumber, or heating service describe the problem to a call handler who then finds a slot, and rescheduling means another call into the same queue",
        outcome: "Jobs scoped and booked conversationally against live technician availability with rescheduling handled directly, lifting trades utilisation without adding call handlers",
        channels: ["Voice", "Web chat", "SMS", "Mobile app"],
        systems: ["Field service management", "Technician scheduling", "Membership system", "Job/quote management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Roadside and emergency home assist job status",
        friction: "Members waiting for a patrol or an emergency tradesperson call back for updates, and those status calls hit the same dispatch capacity during exactly the storm or heatwave that created the surge",
        outcome: "Live job status and ETAs pushed proactively across both roadside and home emergency jobs, protecting dispatch capacity during simultaneous surges",
        channels: ["Voice", "SMS", "Mobile app"],
        systems: ["Roadside dispatch", "Emergency home assist dispatch", "Contractor/patrol tracking", "Membership system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Membership and resort booking servicing",
        friction: "Membership renewals, benefit questions, and resort bookings are handled separately from service operations, so a member with several RACV relationships repeats themselves at every contact",
        outcome: "One member front door covering membership, benefits, and resort bookings with full cross-portfolio context, increasing utilisation of benefits members already pay for",
        channels: ["Voice", "Web chat", "Mobile app", "Email"],
        systems: ["Membership system", "Resort booking system", "Benefit catalogue", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An RACV member app covering roadside requests, membership, and benefits",
        "Roadside patrol and emergency home assist dispatch operations across Victoria",
        "A home trades business with technician scheduling and job management",
        "Resorts and clubs with their own booking systems and member pricing",
      ],
      gaps: [
        "No conversational trades booking against live technician availability",
        "No proactive job-status communication across roadside and home emergency jobs",
        "No unified member context spanning motoring, home, and leisure relationships",
        "No elastic capacity when a storm generates roadside and home emergency surges at once",
      ],
    },
    risks: [
      "Emergency home and roadside calls can involve genuine safety hazards — gas, electrical, stranded members — requiring immediate human and emergency-service escalation paths",
      "Trades work is licensed and regulated in Victoria, so any automated scoping must not stray into technical advice or quoting outside approved parameters",
      "Mutual governance means member-facing automation attracts member scrutiny, so the case must rest on faster service rather than on cost reduction",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 5.5,
      automationRate: 0.55,
      basis: "Seller assumptions requiring validation: volume estimated across a large Victorian member base generating roadside, home trades, membership, and resort contacts, cost reflecting Australian dispatch and service labour, and an automation rate assuming booking and status automate while emergency and technical conversations escalate.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating home trades booking and rescheduling across voice and SMS for two trade categories, integrated to field service management and technician scheduling, measured on booking conversion and technician utilisation.",
    expansion: [
      "Extend to roadside and emergency home assist job-status updates with proactive ETA push",
      "Add membership renewal, benefit, and resort booking servicing on the same member front door",
      "Introduce cross-portfolio member context so every contact opens with the full relationship",
    ],
    stakeholders: [
      "Managing Director and Chief Executive Officer",
      "General Manager Home and Motoring Services",
      "Chief Information Officer",
      "General Manager Membership",
      "General Manager Leisure",
    ],
    discovery: [
      "How many trades bookings per month go through call handlers, and what is the average time to book?",
      "During a major Victorian storm, what happens to roadside and home emergency contact volume simultaneously?",
      "How many members hold more than one RACV service, and does any single contact see that full picture?",
      "What technician utilisation improvement would justify the investment on its own?",
    ],
    flowTemplate: "appointments",
    scenario: "An RACV member books a Saturday electrician, reschedules it midweek, and tracks the technician's arrival without a single call queue.",
  },

  "racq": {
    operatingContext:
      "RACQ is Queensland's motoring mutual, member-owned, combining roadside assistance with its own general insurance operation and a banking business, serving a very large Queensland member base. Its combination of roadside and insurance under one mutual is operationally consequential because Queensland is Australia's most cyclone-, flood-, and storm-exposed state: a single severe weather event simultaneously generates roadside callouts from stranded members, home and motor claims from damaged property, and banking hardship enquiries from affected households. That triple surge hits one organisation at once, which no other Australian mutual faces to the same degree. Members reach it through the RACQ app, member service teams, claims lines, and branches, and the service operation is sized for normal conditions rather than for the events that define its reputation.",
    strategicPressure: [
      { text: "Queensland experiences recurring cyclones, floods, and severe storms that generate simultaneous surges in insurance claims and roadside assistance demand", kind: "verified" },
      { text: "RACQ operates roadside assistance, general insurance, and banking within one member-owned mutual, so a single weather event loads all three businesses at once", kind: "verified" },
      { text: "Claims handling is a regulated financial service in Australia with code-of-practice obligations that intensify during declared catastrophe events", kind: "verified" },
      { text: "A regional mutual cannot economically hold standing surge capacity for events that occur a few times a year but define member sentiment when they do", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. A Queensland mutual allocates surplus to member benefits and reserves, not to platform engineering, and its technology across dispatch, claims, and banking is procured. Event-surge elasticity is fundamentally a capacity purchase, not an engineering project, and it is the clearest possible business case for buying rather than building.",
    whyNotBuild:
      "The problem is elastic capacity a few weeks a year, which is the worst possible economic shape for internally built and staffed capability. Building would require speech handling for distressed callers, telephony across roadside, claims, and banking operations, orchestration across three business lines' systems, and evaluation meeting general insurance code obligations during catastrophes — an enormous undertaking for a benefit realised episodically.",
    workflows: [
      {
        name: "Catastrophe-event claims and assistance surge intake",
        friction: "After a cyclone or flood, claims lodgement, roadside callouts, and general enquiries arrive simultaneously in volumes many times normal, and members in damaged homes cannot get through",
        outcome: "Every affected member lodges a claim or requests assistance immediately with structured detail and photos captured, so assessors and patrols are prioritised from complete information",
        channels: ["Voice", "SMS", "Mobile app", "Web"],
        systems: ["Claims management platform", "Roadside dispatch", "Policy administration", "Event/catastrophe management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Claims status and repair coordination",
        friction: "After a catastrophe, thousands of claimants call for updates through a months-long repair backlog, and each call reads back a status without advancing the repair",
        outcome: "Proactive milestone updates through assessment, builder allocation, and repair, suppressing the status-call wave that follows every major event",
        channels: ["SMS", "Voice", "Mobile app", "Email"],
        systems: ["Claims management platform", "Builder/repairer network management", "Assessor dispatch", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Roadside job status and membership servicing",
        friction: "Roadside status enquiries and membership questions compete for the same member-service capacity, and during a heat event or storm both spike together",
        outcome: "Live roadside ETAs and membership servicing handled conversationally, keeping dispatch and member teams focused on jobs rather than status narration",
        channels: ["Voice", "SMS", "Mobile app"],
        systems: ["Roadside dispatch", "Patrol tracking", "Membership system", "Billing/payments"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "An RACQ app covering roadside requests, membership, insurance, and banking access",
        "Roadside patrol dispatch operations across Queensland including regional areas",
        "An in-house general insurance operation with claims teams and assessor and builder networks",
        "A banking business with hardship processes for members affected by disaster events",
      ],
      gaps: [
        "No elastic intake capacity when a catastrophe multiplies claims and roadside demand together",
        "No proactive claims-milestone communication through long post-event repair backlogs",
        "No cross-business member view spanning roadside, insurance, and banking during an event",
        "No structured after-hours lodgement channel when events occur overnight",
      ],
    },
    risks: [
      "Claims handling is a regulated financial service and the General Insurance Code of Practice imposes heightened obligations during declared catastrophe events, including vulnerable-customer handling",
      "Disaster-affected members are frequently in genuine distress, so vulnerability detection and immediate human escalation are non-negotiable design requirements",
      "Banking hardship obligations apply to affected members simultaneously, requiring careful separation and routing between insurance and banking conversations",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 5.5,
      automationRate: 0.5,
      basis: "Seller assumptions to validate: volume estimated from a large Queensland member base across roadside, insurance, and banking contacts with severe event-driven peaks, cost reflecting Australian dispatch and claims labour, and a moderate automation rate reflecting the sensitivity of disaster-period conversations.",
    },
    pilotScope:
      "A ten-week pilot delivering catastrophe-event claims and roadside intake with structured capture and photo upload across voice, SMS, and app, integrated to the claims platform and dispatch, deployed before the next storm season.",
    expansion: [
      "Extend to proactive claims-milestone updates through assessment and repair backlogs",
      "Add roadside job-status and membership servicing on the same member front door",
      "Introduce coordinated event response spanning insurance claims and banking hardship for affected members",
    ],
    stakeholders: [
      "Group Chief Executive Officer",
      "Chief Executive Insurance",
      "Chief Member Experience Officer",
      "Chief Information Officer",
      "Head of Claims Operations",
    ],
    discovery: [
      "In the last declared catastrophe, what happened to claims lodgement wait times and roadside response together?",
      "How many status contacts does an average catastrophe claim generate across a repair backlog?",
      "How do you currently coordinate a member who has an insurance claim, a roadside callout, and a banking hardship need in the same week?",
      "What vulnerability detection would your conduct team require before an automated conversation continues during an event?",
    ],
    flowTemplate: "claims",
    scenario: "The morning after a Queensland cyclone, every affected RACQ member lodges with photos while patrols are dispatched from the same conversation stream.",
  },

  "ramsay-health-care": {
    operatingContext:
      "Ramsay Health Care is Australia's largest private hospital operator, running a national network of surgical hospitals, day-procedure centres, and mental-health facilities, alongside international operations in Europe and the United Kingdom. Its Australian business is fundamentally an admissions and theatre-utilisation machine: patients are referred by specialists, must complete pre-admission registration and health questionnaires, need informed financial consent about out-of-pocket costs, and then be confirmed and prepared for surgery. Almost all of that runs on phone calls and paper handled facility by facility, with each hospital's admissions office operating its own processes and phone lines. Late cancellations and incomplete pre-admission paperwork directly waste theatre time, which is the most expensive capacity in the business, and billing queries continue long after discharge.",
    strategicPressure: [
      { text: "Ramsay Health Care operates the largest private hospital network in Australia alongside substantial international operations in Europe and the United Kingdom", kind: "verified" },
      { text: "Australian private hospital operators have faced sustained margin pressure from health-fund funding negotiations and rising labour and input costs", kind: "verified" },
      { text: "Pre-admission processes handled facility by facility on phone and paper make administrative cost and inconsistency structural rather than incidental", kind: "inference" },
      { text: "Incomplete pre-admission information and late cancellations waste theatre capacity, which is the single most expensive resource in a private hospital", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Ramsay's capital and management attention go into clinical capability, theatre capacity, and facility investment, and its technology is procured across patient administration and clinical systems. Centralising pre-admission communications across a distributed facility network is an integration-heavy programme that a partner delivers, not a product a hospital operator builds.",
    whyNotBuild:
      "Hospital operators do not build conversational infrastructure — their scarce resources are clinicians, theatre time, and beds. A build would require speech handling across an elderly and multicultural patient population, telephony into dozens of facility phone systems, orchestration into patient administration and theatre scheduling, and evaluation meeting health-privacy and clinical-safety boundaries. Every one of those competes directly with clinical investment.",
    workflows: [
      {
        name: "Pre-admission registration and health questionnaire",
        friction: "Admissions staff phone each patient to collect demographics, health history, medications, and consent, and incomplete information surfaces on the day of surgery when it is most expensive",
        outcome: "Structured pre-admission collected conversationally at the patient's convenience with completeness validated, so theatre lists proceed on complete information",
        channels: ["Voice", "SMS", "Web", "Email"],
        systems: ["Patient administration system", "Pre-admission platform", "Theatre scheduling", "Document management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Appointment confirmation and preparation instructions",
        friction: "Fasting instructions, arrival times, medication holds, and what-to-bring guidance are delivered by phone and letter, and patients arrive unprepared or cancel late, wasting theatre slots",
        outcome: "Timed, personalised preparation guidance with confirmation and easy rescheduling, reducing late cancellations and day-of-surgery deferrals",
        channels: ["SMS", "Voice", "Email"],
        systems: ["Theatre scheduling", "Patient administration system", "Clinical protocols reference", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Informed financial consent and billing queries",
        friction: "Patients need out-of-pocket estimates before admission and then query accounts afterwards, and each conversation requires staff to reconcile health-fund cover, excess, and hospital charges",
        outcome: "Financial consent explained clearly before admission and account queries resolved conversationally afterwards, reducing bill shock complaints and improving collection",
        channels: ["Voice", "SMS", "Email", "Web chat"],
        systems: ["Patient billing", "Health fund eligibility interfaces", "Patient administration system", "Payments"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Patient administration and theatre scheduling systems across the hospital network",
        "Facility-level admissions offices handling pre-admission by phone and paper",
        "Online pre-admission forms available at some facilities alongside phone-based collection",
        "Health-fund eligibility checking processes supporting informed financial consent",
      ],
      gaps: [
        "No consistent, centralised pre-admission conversation across facilities",
        "No automated completeness validation before the day of surgery",
        "No timed, personalised preparation guidance reducing late cancellations",
        "No conversational financial-consent explanation before admission or account query handling afterwards",
      ],
    },
    risks: [
      "Health information is sensitive information under the Privacy Act with strict consent, handling, and retention requirements across every state jurisdiction the network operates in",
      "Any conversation touching clinical matters must escalate to qualified staff immediately, with the automated boundary confined strictly to administrative and logistical content",
      "Informed financial consent is a regulated patient-rights process, so out-of-pocket estimates must be system-derived, clearly bounded, and auditable",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 6,
      automationRate: 0.55,
      basis: "Seller assumptions requiring validation: volume estimated from admissions, pre-admission, appointment, and billing contacts across a national private hospital network, cost reflecting Australian hospital administrative labour, and an automation rate assuming administrative workflows automate while all clinical content escalates.",
    },
    pilotScope:
      "A ten-to-fourteen week pilot centralising pre-admission registration and appointment confirmation for elective surgery across three facilities in one state, integrated to patient administration and theatre scheduling, measured on day-of-surgery deferrals and admissions staff hours.",
    expansion: [
      "Extend pre-admission and preparation workflows across the national facility network",
      "Add informed financial consent conversations with health-fund eligibility grounding",
      "Introduce post-discharge account query handling and follow-up appointment coordination",
    ],
    stakeholders: [
      "Chief Executive Officer Australia",
      "Chief Operating Officer",
      "Chief Information Officer",
      "National Director of Clinical Services",
      "General Manager Revenue and Patient Administration",
    ],
    discovery: [
      "How many pre-admission phone calls does a single elective surgery generate today, and who makes them?",
      "What proportion of your day-of-surgery deferrals trace back to incomplete pre-admission information?",
      "Are patient-communications budgets held centrally or by each facility, and who could sponsor a network-wide change?",
      "What is your current process for informed financial consent, and how often does it produce a later billing complaint?",
    ],
    flowTemplate: "appointments",
    scenario: "A Ramsay surgical patient completes pre-admission and gets fasting instructions the night before, without an admissions officer calling three times.",
  },

  "sonic-healthcare": {
    operatingContext:
      "Sonic Healthcare is a Sydney-headquartered global pathology and diagnostics group, one of the largest in the world, operating laboratory networks across Australia, Europe, and the United States along with a substantial Australian medical-centre business. Its Australian pathology operation runs a very large network of patient collection centres — small suburban sites where patients present with a doctor's request form to have blood taken — under several regional brand names inherited from decades of acquisition. Its commercial model is B2B: referrals come from doctors, and revenue is largely from Medicare and health funds. But patients still generate enormous direct contact volume asking where the nearest collection centre is, what its opening hours are, whether they need to fast, whether an appointment is required, when results will reach their doctor, and why they received an account.",
    strategicPressure: [
      { text: "Sonic Healthcare operates one of the world's largest pathology networks with extensive Australian collection-centre coverage under multiple regional brands", kind: "verified" },
      { text: "Australian pathology revenue depends heavily on Medicare benefits schedule funding, which has been subject to sustained indexation pressure and constrains cost structures", kind: "verified" },
      { text: "A B2B referral model still produces high direct patient contact because patients must physically attend a collection centre and prepare correctly beforehand", kind: "inference" },
      { text: "Multiple regional pathology brands mean patient-facing service is likely handled brand by brand, so the same conversation is staffed several times over", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Sonic directs its technology investment into laboratory information systems, diagnostic instrumentation, and clinical and diagnostic AI where it creates genuine competitive advantage. Patient-communications automation is an adjacency well outside that focus, and its multi-brand Australian structure makes a configurable partner-delivered layer more practical than any single internal build.",
    whyNotBuild:
      "Sonic's engineering identity is laboratory and diagnostic technology, not patient conversation. Building would require speech handling across an elderly and multicultural patient population, telephony into hundreds of collection-centre and call-centre lines, orchestration into laboratory information systems and billing, and evaluation with strict clinical boundaries around results. None of that improves diagnostic quality, which is the only thing referrers choose Sonic for.",
    workflows: [
      {
        name: "Collection-centre location, hours, and appointment enquiries",
        friction: "Patients call to find their nearest centre, check opening hours, and ask whether an appointment is needed, and collection-centre staff answer the phone while taking blood from another patient",
        outcome: "Location, hours, and booking handled conversationally at any hour, removing phone interruption from collection rooms and reducing wasted patient trips",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Collection-centre directory", "Appointment scheduling", "Laboratory information system", "Website content"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Test preparation and fasting instructions",
        friction: "Patients arrive having eaten before a fasting test or without the right paperwork, and the collection is wasted, requiring a return visit and a repeat conversation",
        outcome: "Preparation requirements explained from the actual test request before the visit, cutting failed collections and the repeat visits they cause",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Test catalogue and preparation protocols", "Laboratory information system", "Referral/request data", "Appointment scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Results timing and billing enquiries",
        friction: "Patients call asking when results will reach their doctor and why they received an account, and staff must check laboratory status and Medicare or fund billing separately for each",
        outcome: "Turnaround expectations and billing explained conversationally with a hard clinical boundary at results content, which always routes to the referring doctor",
        channels: ["Voice", "SMS", "Web chat", "Email"],
        systems: ["Laboratory information system", "Billing / Medicare claiming", "Referrer directory", "Payments"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Extensive patient collection-centre networks across Australia under multiple regional brands",
        "Websites with centre locators, opening hours, and preparation information",
        "Laboratory information systems tracking specimens from collection to result delivery",
        "Referrer-facing results delivery into general practice clinical software",
      ],
      gaps: [
        "No conversational channel that keeps location and preparation calls out of collection rooms",
        "No proactive preparation reminder tied to the specific tests a patient has been referred for",
        "No consistent patient-facing service across the regional pathology brands",
        "No after-hours capability, despite early-morning fasting collections being planned the night before",
      ],
    },
    risks: [
      "Pathology results are sensitive health information and must never be disclosed by an automated agent; the clinical boundary must route all results content to the referring doctor",
      "Health information handling under the Privacy Act requires strong identity verification before even confirming that a test was collected",
      "Multiple regional brands may operate separate systems and data, so grounding sources must be verified per brand before any unified deployment",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 5,
      automationRate: 0.6,
      basis: "Seller assumptions to validate: volume estimated from patient contacts across a national collection-centre network handling millions of episodes annually, cost reflecting collection-centre staff time and call-centre labour, and a high automation rate given the logistical and repetitive nature of location, hours, and preparation enquiries.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating collection-centre location, hours, and preparation enquiries for one Australian pathology brand across voice and chat, with an absolute clinical boundary excluding any results content.",
    expansion: [
      "Extend to appointment booking and proactive preparation reminders tied to referred tests",
      "Add results-timing and billing enquiry handling with referrer routing for clinical content",
      "Roll the same governed layer across the other regional pathology brands",
    ],
    stakeholders: [
      "Chief Executive Officer Australia Pathology",
      "Chief Information Officer",
      "General Manager Operations",
      "National Manager Collection Services",
      "Head of Revenue and Billing",
    ],
    discovery: [
      "How many phone calls does an average collection centre take per day, and who answers them?",
      "What proportion of collections fail because the patient was not correctly prepared?",
      "Are patient-facing service operations shared across your Australian pathology brands, or run separately?",
      "What is the absolute boundary your clinical governance requires between logistics information and results?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A patient referred for a fasting blood test finds the nearest Sonic collection centre and learns exactly when to stop eating, the night before.",
  },

  "i-med-radiology": {
    operatingContext:
      "I-MED Radiology Network is Australia's largest diagnostic imaging provider, operating hundreds of clinics nationally offering X-ray, ultrasound, CT, MRI, nuclear medicine, and interventional procedures, under private-equity ownership. Its economics are dominated by expensive capital equipment: an MRI or CT scanner represents a large investment whose return depends entirely on utilisation, so every empty slot and every no-show is a direct and quantifiable loss. Patients arrive by referral from GPs and specialists, then must book an appointment, understand modality-specific preparation — fasting for some scans, contrast questions, metal and implant screening for MRI — and often reschedule. Almost all of that runs through clinic reception phone lines, which are the single busiest and most interruptible point in the operation.",
    strategicPressure: [
      { text: "I-MED operates the largest diagnostic imaging clinic network in Australia and is owned by private-equity investors", kind: "verified" },
      { text: "Diagnostic imaging economics depend on utilisation of expensive scanner capacity, making no-shows and empty slots directly quantifiable losses", kind: "verified" },
      { text: "Modality-specific preparation and safety screening — fasting, contrast, MRI implant checks — makes booking conversations longer and more error-prone than general appointment scheduling", kind: "inference" },
      { text: "Private-equity ownership favours initiatives with measurable payback inside a hold period, and scanner utilisation is exactly that kind of metric", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A private-equity-owned clinical network invests in scanners, clinics, and radiologist capacity, not in conversational-platform engineering, and its technology is procured across radiology information systems and scheduling. Booking automation with a directly measurable utilisation benefit is precisely the kind of investment this ownership model approves quickly.",
    whyNotBuild:
      "The return on capital argument settles it: money spent on engineers is money not spent on scanners, and scanners generate revenue. Building would also require MRI safety-screening logic embedded in conversation, which is a clinical-safety evaluation problem of a kind a radiology group has no reason to own internally when a vendor can carry it with a tested evaluation regime.",
    workflows: [
      {
        name: "Imaging appointment booking and rescheduling",
        friction: "Patients call clinic reception to book from a referral, and reception staff work through modality availability, location options, and referral details while other patients wait at the counter",
        outcome: "Bookings made and changed conversationally against live modality schedules at any hour, filling slots that currently go empty because reception was busy",
        channels: ["Voice", "SMS", "Web chat", "Mobile app"],
        systems: ["Radiology information system", "Modality scheduling", "Referral management", "Patient records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Preparation and safety screening",
        friction: "Fasting requirements, contrast questions, and MRI implant and metal screening are covered verbally at booking or on arrival, and errors mean the scan cannot proceed and the slot is lost",
        outcome: "Modality-specific preparation and structured safety screening completed before the appointment, with any positive screening flag routed to clinical staff",
        channels: ["Voice", "SMS", "Web"],
        systems: ["Modality protocols reference", "Radiology information system", "Patient records", "Clinical escalation workflow"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Reminders and no-show recovery",
        friction: "No-shows leave expensive scanner time idle with no mechanism to backfill, and waitlisted patients are called manually only if reception has spare capacity",
        outcome: "Timed reminders with one-tap confirmation and automatic waitlist backfill when a slot frees, converting idle scanner time directly into revenue",
        channels: ["SMS", "Voice", "Mobile app"],
        systems: ["Modality scheduling", "Waitlist management", "Radiology information system", "CRM"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national clinic network with radiology information systems and modality scheduling",
        "Online booking capability for some modalities alongside clinic reception phone booking",
        "Referrer-facing results delivery into general practice and specialist clinical software",
        "Patient reminder processes at clinic level, typically SMS-based",
      ],
      gaps: [
        "No conversational booking against live modality availability across the clinic network",
        "No structured pre-appointment safety screening before the patient arrives",
        "No automatic waitlist backfill when a no-show or cancellation frees expensive scanner time",
        "No after-hours booking capability, despite referrals being received throughout the day",
      ],
    },
    risks: [
      "MRI safety screening is a clinical-safety process where a missed implant or metal disclosure can cause patient harm, so any automated screening must be conservative and escalate on every positive or ambiguous response",
      "Health information handling under the Privacy Act requires strong identity verification and strict controls on referral and clinical data",
      "Results content must never be disclosed by an automated agent and must always route to the referring practitioner",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 5,
      automationRate: 0.6,
      basis: "Seller assumptions requiring validation: volume estimated from booking, preparation, and reminder contacts across hundreds of clinics handling millions of imaging episodes annually, cost reflecting clinic reception labour, and a high automation rate given the scheduling-dominated nature of the volume.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating imaging appointment booking, reminders, and waitlist backfill for two modalities across one metropolitan clinic cluster, integrated to the radiology information system and modality scheduling, measured on scanner utilisation and no-show rate.",
    expansion: [
      "Add structured preparation and MRI safety screening with mandatory clinical escalation on positive flags",
      "Extend booking and reminder automation across all modalities and the national clinic network",
      "Introduce referrer-facing booking support so GP practices can schedule patients conversationally",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Chief Information Officer",
      "National Director of Clinical Governance",
      "General Manager Patient Experience",
    ],
    discovery: [
      "What is your no-show rate by modality, and what does an empty MRI hour cost you?",
      "How long does an average booking call take, and how many are abandoned at clinic reception during busy periods?",
      "How is MRI safety screening conducted today, and at what point in the journey?",
      "How much scanner capacity goes unfilled each week that a waitlist backfill could recover?",
    ],
    flowTemplate: "appointments",
    scenario: "An I-MED patient books an MRI, completes implant screening, and gets fasting instructions before a slot that would otherwise have gone empty.",
  },

  "australia-post": {
    operatingContext:
      "Australia Post is the national postal and parcels operator, a government business enterprise obliged to deliver to every Australian address, and it has transformed from a letters business into one of the country's largest parcel logistics operations as eCommerce grew. It runs post offices, a parcel-locker and collection-point network, StarTrack for business and express freight, and a delivery workforce covering metropolitan, regional, and remote Australia. Its consumer contact volume is among the very highest of any Australian organisation and is dominated by a single conversation shape: something about a parcel is wrong — it was missed, it went to a collection point, tracking has not updated, or it never arrived. Peak season around Black Friday and Christmas multiplies that volume enormously while the delivery network is simultaneously at maximum stress.",
    strategicPressure: [
      { text: "Australia Post is a government business enterprise with a community service obligation to deliver to all Australian addresses while operating commercially", kind: "verified" },
      { text: "Structural letters decline alongside parcel growth has driven sustained financial pressure and public debate about the sustainability of the postal service model", kind: "verified" },
      { text: "Peak eCommerce season concentrates delivery exceptions and consumer contact into a few weeks that define annual public perception of the organisation", kind: "verified" },
      { text: "Missed-delivery redelivery coordination is the single highest-frequency consumer conversation and is almost entirely logistical rather than judgemental", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Partner-led. Australia Post is a large, technically capable organisation but a government business enterprise under sustained cost pressure, and it procures major technology through structured partner arrangements rather than building conversational platforms internally. The scale and integration depth of parcel-servicing automation across its network makes this a partner-delivered programme.",
    whyNotBuild:
      "Even at national scale, the four-layer build competes with a modernisation agenda already stretched across delivery network, retail, and digital transformation under GBE financial constraints. Multilingual speech for a highly multicultural population, telephony at national contact volumes, orchestration across parcel, locker, and retail systems, and an evaluation regime for a politically scrutinised organisation are better contracted with accountability than built under budget pressure.",
    workflows: [
      {
        name: "Missed-delivery redelivery and collection coordination",
        friction: "A missed delivery leaves a card and a parcel at a collection point, and the customer must navigate a website or call to arrange redelivery, change address, or extend collection time",
        outcome: "Redelivery arranged, safe-drop authorised, or collection extended conversationally in seconds, resolving the country's single most common parcel conversation without a human",
        channels: ["Voice", "SMS", "Mobile app", "Web chat"],
        systems: ["Parcel tracking and delivery management", "Collection point / locker network", "Address and identity verification", "Delivery workforce scheduling"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Tracking exceptions and parcel investigation",
        friction: "When tracking stalls, customers contact repeatedly and each contact re-reads the same stale scan, with formal investigation requiring a separate manual process",
        outcome: "Exception context explained accurately with investigation initiated in-conversation and proactive updates thereafter, ending the repeat-contact cycle",
        channels: ["Voice", "Web chat", "Mobile app", "SMS"],
        systems: ["Parcel tracking", "Investigation / case management", "Delivery scan data", "Sender interfaces"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Peak-season proactive exception management",
        friction: "In peak weeks, delivery exceptions multiply while contact capacity is fixed, so wait times blow out at the moment national attention on parcel performance is highest",
        outcome: "Exceptions detected and communicated proactively before customers contact, absorbing the peak spike and shifting the experience from chasing to being informed",
        channels: ["SMS", "Mobile app", "Voice", "Email"],
        systems: ["Parcel tracking", "Network capacity/exception detection", "Customer contact preferences", "Delivery management"],
        value: 3,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "The AusPost app and website with parcel tracking, delivery preferences, and safe-drop options",
        "A national parcel-locker and collection-point network alongside post office counters",
        "A large consumer contact operation handling parcel enquiries across phone and digital channels",
        "Business and sender-facing services including StarTrack express and freight",
      ],
      gaps: [
        "No conversational redelivery arrangement that completes without a website form or a human",
        "No accurate explanation of tracking exceptions beyond restating the last scan",
        "No proactive exception communication before the customer discovers the problem themselves",
        "No multilingual voice servicing despite serving one of the world's most multicultural populations",
      ],
    },
    risks: [
      "As a government business enterprise, service changes and any perception of automating away Australian jobs attract political, union, and media scrutiny",
      "Enterprise agreements and workforce arrangements may constrain how contact work is redistributed, requiring early industrial engagement",
      "Redelivery and address-change actions require identity verification to prevent parcel misdirection and fraud, so authentication design is a security requirement not a convenience",
    ],
    economics: {
      volumeMonthly: 3000000,
      costPerInteraction: 5,
      automationRate: 0.65,
      basis: "Seller assumptions requiring validation: volume estimated from parcel-related consumer contact at national delivery scale with severe seasonal peaking, cost reflecting a blended onshore and offshore consumer contact operation, and a high automation rate given the overwhelmingly logistical nature of parcel conversations.",
    },
    pilotScope:
      "A fourteen-week pilot automating missed-delivery redelivery and collection-point coordination across voice, SMS, and app in one metropolitan delivery region, integrated to parcel tracking and the collection network, deployed ahead of peak season.",
    expansion: [
      "Extend to tracking-exception explanation and in-conversation investigation initiation",
      "Add proactive peak-season exception communication before customers contact",
      "Introduce multilingual servicing across the community languages most represented in the delivery footprint",
    ],
    stakeholders: [
      "Executive General Manager Parcel Post and Community",
      "Chief Customer Officer",
      "Chief Information Officer",
      "General Manager Customer Contact",
      "Executive General Manager People and Culture",
    ],
    discovery: [
      "What proportion of consumer contacts are redelivery and collection arrangements rather than genuine problems?",
      "What happens to contact volume and wait time in the two weeks after Black Friday compared with a baseline month?",
      "What do your enterprise agreements say about redistributing contact work, and who needs to be engaged early?",
      "How many languages are represented in your highest-volume delivery regions, and how are those customers served today?",
    ],
    flowTemplate: "order-logistics",
    scenario: "An Australia Post customer who missed a delivery reschedules it for Saturday and authorises a safe drop, in under a minute at 10pm.",
  },

  "toll-group": {
    operatingContext:
      "Toll Group is a Japan Post-owned logistics operator spanning freight forwarding, contract logistics, and specialised government and defence logistics across Asia-Pacific, following years of restructuring and the divestment of parts of its express parcels business. Its remaining operation is predominantly business-to-business: manufacturers, retailers, resources companies, and government departments moving freight under contracts with defined service levels. That B2B character shapes its contact pattern entirely — the callers are logistics coordinators, warehouse managers, and procurement staff chasing booking confirmations, consignment status, proof of delivery, and exception resolution, and they call because the customer portal does not answer their specific question. Each of those calls consumes a customer-service representative who often has to check several operational systems to answer.",
    strategicPressure: [
      { text: "Toll Group is owned by Japan Post and has undergone extensive restructuring including divestment of parts of its express and parcels operations", kind: "verified" },
      { text: "Its remaining portfolio centres on freight forwarding, contract logistics, and government and defence logistics rather than consumer parcels", kind: "verified" },
      { text: "B2B logistics contracts carry defined service levels, so proof-of-delivery and exception-response performance is contractually measured rather than merely desirable", kind: "inference" },
      { text: "Customer-service representatives spend a large share of their time on status lookups across operational systems that customers cannot see themselves", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. After sustained restructuring, Toll's technology capacity is directed at operational systems consolidation rather than new platform development, and it modernises through partners. A B2B service-desk automation layer over existing transport management and tracking systems is integration work well suited to a partner engagement.",
    whyNotBuild:
      "A logistics operator's engineering priority is transport management, warehouse systems, and network optimisation. Building conversational infrastructure would compete directly with that agenda during a period when system rationalisation is already consuming capacity, and the evaluation discipline required to make status statements contractually reliable is a specialist capability better sourced than developed.",
    workflows: [
      {
        name: "B2B consignment status and proof of delivery",
        friction: "Customer logistics coordinators phone and email for consignment status and proof-of-delivery documents, and representatives look these up manually across transport management and scanning systems",
        outcome: "Customers get grounded consignment status and POD documents on demand at any hour, releasing representative capacity for exception resolution that actually needs judgement",
        channels: ["Voice", "Email", "Web chat"],
        systems: ["Transport management system", "Consignment tracking and scanning", "Document management", "Customer portal"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Booking and pickup coordination",
        friction: "Freight bookings and pickup requests arrive by phone and email and are keyed manually by service staff, with errors surfacing later as failed pickups and rework",
        outcome: "Bookings and pickups captured conversationally with validation at the point of entry, reducing keying errors and the exception volume they generate downstream",
        channels: ["Voice", "Email", "Web chat"],
        systems: ["Transport management system", "Booking / order entry", "Fleet and driver scheduling", "Rate/contract configuration"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Delivery-exception resolution desk",
        friction: "Failed deliveries, damaged freight, and site access problems generate escalations that bounce between customer service, depot operations, and the customer with context lost each time",
        outcome: "Exceptions captured with structured detail and routed with full context to the right operational owner, with proactive updates back to the customer",
        channels: ["Voice", "Email", "SMS"],
        systems: ["Transport management system", "Depot operations systems", "Case/exception management", "Customer portal"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Customer portals providing consignment tracking and document access for contracted customers",
        "Transport management and consignment scanning systems across the freight network",
        "Customer service teams handling bookings, status, and exception escalations",
        "Specialised government and defence logistics operations with dedicated service arrangements",
      ],
      gaps: [
        "No conversational access to consignment status and proof of delivery outside business hours",
        "No validated conversational booking capture, so phone and email bookings are keyed manually",
        "No structured exception intake that preserves context through operational handoffs",
        "No proactive exception notification to customers before they call to chase",
      ],
    },
    risks: [
      "Contracted service levels make status accuracy commercially consequential, so any automated statement must be derived from operational systems rather than inferred",
      "Government and defence logistics work carries security clearance and data-handling requirements that may exclude certain workloads from any automated channel entirely",
      "Ongoing corporate restructuring means the divisional footprint may change, so scope must be validated against the current business structure",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 6,
      automationRate: 0.55,
      basis: "Seller assumptions to validate: volume estimated from B2B customer service contacts across freight and contract logistics operations rather than consumer parcels, cost reflecting skilled logistics customer-service labour, and an automation rate assuming status and booking automate while operational exceptions need human ownership.",
    },
    pilotScope:
      "An eight-to-ten week pilot delivering B2B consignment status and proof-of-delivery retrieval across voice and email for one freight division, integrated to the transport management system and document repository.",
    expansion: [
      "Extend to conversational booking and pickup capture with validation at entry",
      "Add the delivery-exception resolution desk with structured intake and context-preserving routing",
      "Introduce proactive exception and milestone notification to contracted customers",
    ],
    stakeholders: [
      "President / Chief Executive Officer",
      "Chief Operating Officer",
      "Chief Information Officer",
      "General Manager Customer Service",
      "Divisional General Manager Freight",
    ],
    discovery: [
      "What proportion of customer-service contacts are status and POD requests rather than genuine exceptions?",
      "How many operational systems does a representative touch to answer a single consignment status question?",
      "Which divisions still carry high-volume, repeatable service contact after the express divestments?",
      "What data-handling restrictions apply to your government and defence logistics work?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A Toll customer's warehouse manager retrieves proof of delivery for six consignments at 6am, before the depot shift starts.",
  },

  "aramex-anz": {
    operatingContext:
      "Aramex Australia and New Zealand is the former Fastway Couriers franchise network rebranded under the Dubai-headquartered Aramex group, operating a courier model where local franchisees own delivery territories and run their own vans and rounds under the national brand. That structure defines its service problem precisely: the customer buys from an online retailer, the parcel is delivered by an independent franchisee, and when something goes wrong the customer does not know whether to contact the retailer, the national brand, or the local courier — and often gets different answers from each. Its volumes are driven by eCommerce senders who choose it on price, and delivery exceptions — missed deliveries, wrong addresses, parcels left in unexpected places, and depot delays — are the overwhelming majority of consumer contact. The franchise model makes the customer experience structurally inconsistent even where individual couriers perform well.",
    strategicPressure: [
      { text: "The Australian and New Zealand business operates as a franchise courier network, rebranded from Fastway following the Aramex acquisition", kind: "verified" },
      { text: "eCommerce parcel delivery in Australia is intensely price-competitive, so carriers competing below the major operators run on lean cost bases", kind: "verified" },
      { text: "A franchise delivery model fragments accountability for exceptions, producing inconsistent customer outcomes that attach to the national brand regardless of which franchisee delivered", kind: "inference" },
      { text: "Consumer contact reaches both the national brand and individual franchisees, duplicating handling effort and producing contradictory answers on the same parcel", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A franchise courier network has no central engineering function and no franchisee capable of funding technology development, and the group's technology decisions are made outside the region. Unified exception handling is exactly the kind of shared capability a franchise network buys centrally and distributes to its franchisees.",
    whyNotBuild:
      "There is no organisational unit here that could build it. The franchisor is a network coordinator, not a technology company, and franchisees operate at owner-driver scale. A purchased central layer with per-territory configuration is the only structure that fits both the economics and the operating model.",
    workflows: [
      {
        name: "Delivery-exception and redelivery servicing",
        friction: "A missed delivery leaves the customer contacting the retailer, the national brand, and sometimes the local courier, receiving different answers and no clear way to arrange redelivery",
        outcome: "One authoritative conversation that explains what happened and arranges redelivery, safe drop, or depot collection, ending the multi-party confusion that defines the current experience",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Parcel tracking and scan data", "Franchisee territory routing", "Depot management", "Sender/retailer interfaces"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Where-is-my-parcel enquiries",
        friction: "Customers chase parcels through the tracking page and then through whichever channel answers, and depot and franchisee staff answer the same question repeatedly while sorting",
        outcome: "Accurate parcel status with next-step options delivered instantly in any channel, keeping enquiry volume off franchisee phones during delivery rounds",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Parcel tracking and scan data", "Route/driver data", "Depot management", "Sender interfaces"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Sender and retailer service desk",
        friction: "eCommerce senders raise exception queries and claims on behalf of their customers, and each requires manual investigation across scan data and franchisee contact",
        outcome: "Senders self-serve consignment investigation and claim initiation, protecting the commercial relationships that generate the network's volume",
        channels: ["Email", "Voice", "Web chat"],
        systems: ["Parcel tracking", "Claims / investigation management", "Sender account systems", "Franchisee routing"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A national tracking website and consumer-facing parcel status pages",
        "A franchisee courier network covering delivery territories across Australia and New Zealand",
        "Depot operations with parcel scanning and sortation across the network",
        "Sender-facing account and consignment management for eCommerce retailers",
      ],
      gaps: [
        "No single authoritative answer on a parcel across national brand, franchisee, and retailer",
        "No conversational redelivery arrangement, so exceptions require chasing across parties",
        "No consistent exception handling across independently operated delivery territories",
        "No after-hours contact capability for a delivery service that operates into the evening",
      ],
    },
    risks: [
      "Franchise agreements determine whether the franchisor can centralise customer contact and redelivery authority across independently operated territories",
      "Australian Consumer Law obligations sit with the sending retailer rather than the carrier for most consumer claims, so automated statements about remedies must be carefully bounded",
      "Redelivery and address-change instructions require identity verification to prevent misdirection, particularly where the recipient is not the account holder",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 4.5,
      automationRate: 0.6,
      basis: "Seller assumptions requiring validation: volume estimated from consumer and sender exception contact across a national franchise courier network at typical eCommerce parcel exception rates, cost reflecting lean carrier service labour, and a high automation rate given the purely logistical nature of the volume.",
    },
    pilotScope:
      "An eight-week pilot with a defined franchisee territory cluster automating where-is-my-parcel and redelivery arrangement across voice and SMS, integrated to tracking and depot systems, measured on repeat-contact rate per exception.",
    expansion: [
      "Extend unified exception handling across the national franchisee network with per-territory routing",
      "Add the sender and retailer service desk with self-serve investigation and claim initiation",
      "Introduce proactive exception notification before the customer discovers the problem",
    ],
    stakeholders: [
      "Managing Director Australia and New Zealand",
      "General Manager Operations",
      "Head of Customer Experience",
      "Head of Franchise Network",
      "Information Technology Manager ANZ",
    ],
    discovery: [
      "Can the franchisor centralise customer contact and redelivery authority under the current franchise agreements?",
      "How many contacts does a single missed delivery generate across the retailer, the brand, and the franchisee?",
      "What are your most common exception types, and which franchisee territories generate them disproportionately?",
      "How much do your eCommerce senders escalate on behalf of their customers, and what does that cost the relationship?",
    ],
    flowTemplate: "order-logistics",
    scenario: "An Aramex recipient who missed a delivery arranges a Thursday redelivery in one conversation, without contacting the retailer or the local courier.",
  },

  "couriersplease": {
    operatingContext:
      "CouriersPlease is a national Australian parcel carrier owned by Singapore Post, focused squarely on eCommerce deliveries and operating with a franchisee driver model where independent contractors run delivery rounds under the brand. It competes against Australia Post and the major private carriers largely on price for retailer contracts, which means its cost base is deliberately lean and its service operation is sized accordingly. Its consumer contact is dominated almost entirely by two conversations: where is my parcel, and I missed the delivery so what happens now. It also operates a network of parcel collection points and lockers through partner arrangements, which adds collection coordination to the mix. Ownership has been subject to strategic review at the Singapore Post group level, which affects investment appetite and decision timelines.",
    strategicPressure: [
      { text: "CouriersPlease is owned by Singapore Post and operates as an eCommerce-focused parcel carrier in the Australian market", kind: "verified" },
      { text: "Singapore Post has conducted strategic reviews of its Australian logistics assets, creating uncertainty about ownership and investment direction", kind: "verified" },
      { text: "Competing on price against larger carriers means service cost per parcel is a direct constraint on contract competitiveness with retailers", kind: "inference" },
      { text: "Where-is-my-parcel and missed-delivery conversations are almost the entirety of consumer contact for an eCommerce-focused carrier", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. A mid-size carrier competing on price has neither the engineering capacity nor the capital to build conversational infrastructure, and parent-level strategic uncertainty makes a multi-year internal programme even less plausible. Purchased automation with usage-based cost and rapid deployment fits both the economics and the ownership situation.",
    whyNotBuild:
      "A carrier whose competitive position depends on undercutting larger operators cannot carry engineering overhead they can absorb more easily. The narrow, highly repetitive nature of parcel conversations also means a packaged capability captures most of the available value immediately, with none of the risk of an internal build during a period of ownership uncertainty.",
    workflows: [
      {
        name: "Parcel-tracking and status enquiries",
        friction: "Customers chase parcels through a tracking page that shows only scan events, then contact the carrier, and each contact restates the same scan without explaining what it means for delivery",
        outcome: "Accurate status with a plain-language explanation and next-step options delivered instantly, removing the highest-volume contact type entirely",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Parcel tracking and scan data", "Route/driver data", "Depot management", "Sender interfaces"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Missed-delivery redelivery and collection",
        friction: "A missed delivery requires the customer to arrange redelivery, authorise a safe drop, or find the collection point, all through a website process many abandon in favour of calling",
        outcome: "Redelivery, safe drop, or collection-point redirection arranged conversationally in seconds, cutting both contact cost and failed second attempts",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Parcel tracking", "Collection point / locker network", "Driver routing", "Identity verification"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Retailer sender support",
        friction: "eCommerce retailers raise exception queries and lost-parcel claims on behalf of their customers, and each requires manual investigation that delays the retailer's own customer response",
        outcome: "Retailers self-serve investigation and claim status, protecting the contracts that supply the carrier's volume in a price-competitive market",
        channels: ["Email", "Voice", "Web chat"],
        systems: ["Parcel tracking", "Claims / investigation management", "Sender account systems", "Depot management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A tracking website and consumer notification capability for parcel status",
        "A national franchisee driver network delivering eCommerce parcels",
        "Partner collection points and parcel lockers for alternative delivery",
        "Retailer-facing account management and consignment systems for eCommerce senders",
      ],
      gaps: [
        "No plain-language explanation of what a tracking scan actually means for delivery timing",
        "No conversational redelivery arrangement, so customers call rather than complete the web process",
        "No after-hours contact capability, despite deliveries running into the evening",
        "No self-serve investigation for retailer senders escalating on behalf of their customers",
      ],
    },
    risks: [
      "Ownership uncertainty at the Singapore Post group level may delay or complicate investment decisions, so commercial engagement must account for approval risk",
      "Redelivery and address-change instructions require identity verification to prevent parcel misdirection and fraud",
      "Consumer remedies for undelivered goods generally sit with the sending retailer under Australian Consumer Law, so automated statements about compensation must be carefully bounded",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 4.5,
      automationRate: 0.65,
      basis: "Seller assumptions to validate: volume estimated from consumer and sender contact across an eCommerce-focused national parcel operation at typical exception rates, cost reflecting lean carrier service labour, and a high automation rate given the narrow and repetitive nature of parcel conversations.",
    },
    pilotScope:
      "An eight-week pilot automating parcel-tracking enquiries and missed-delivery redelivery across voice, SMS, and chat nationally, integrated to tracking and collection-point systems, measured on cost per contact and redelivery completion rate.",
    expansion: [
      "Add proactive exception notification before customers discover a delivery problem",
      "Extend to retailer sender support with self-serve investigation and claim status",
      "Introduce collection-point and locker redirection as a default alternative to failed redelivery",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Operating Officer",
      "Head of Customer Experience",
      "Head of Commercial / Sender Accounts",
      "Information Technology Manager",
    ],
    discovery: [
      "What is your cost per consumer contact, and how does it compare to your margin per parcel?",
      "What proportion of contacts are where-is-my-parcel versus missed-delivery arrangement?",
      "How much of your web-based redelivery process is abandoned in favour of a phone call?",
      "How does the Singapore Post strategic review affect your ability to commit to a technology investment this year?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A CouriersPlease recipient learns their parcel is on the van two stops away, and redirects it to a locker before the driver arrives.",
  },

  "nz-post": {
    operatingContext:
      "NZ Post is New Zealand's state-owned postal and parcels operator, managing the same structural transition as its Australian counterpart: letter volumes in long-term decline while eCommerce parcels grow, on a national delivery network that must still reach rural and remote addresses across both islands. It operates parcel delivery, a collection-point and locker network, retail service points, and international services, and it has taken visible steps to restructure its letters network in response to declining volumes. Its consumer contact is dominated by parcel tracking, missed-delivery redelivery, and rural-delivery questions that have no metropolitan equivalent — rural delivery contractors, roadside delivery arrangements, and long distances change what a delivery exception even means. State ownership makes its service performance and network decisions publicly and politically visible.",
    strategicPressure: [
      { text: "NZ Post is a state-owned enterprise managing a structural transition from declining letter volumes to eCommerce parcel growth across a national delivery obligation", kind: "verified" },
      { text: "The organisation has restructured elements of its letters network and delivery frequency in response to sustained volume decline, drawing public attention", kind: "verified" },
      { text: "Rural delivery in New Zealand involves contracted rural delivery arrangements and long distances, creating exception types with no urban equivalent", kind: "inference" },
      { text: "A shrinking cost base with growing parcel volume means service capacity cannot grow with parcels, making automation the only route to holding service quality", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A state-owned enterprise in structural cost transition procures technology services with contractual accountability rather than funding internal platform development. New Zealand scale further removes any argument for building, and the workflow set closely mirrors proven parcel-servicing automation available as a purchased capability.",
    whyNotBuild:
      "NZ Post is reducing structural cost, not adding engineering functions. Building speech, telephony, orchestration, and evaluation capability for a New Zealand-scale parcel operation would never amortise, and SOE procurement is designed to buy accountable services rather than develop them internally.",
    workflows: [
      {
        name: "Redelivery and collection-point coordination",
        friction: "Missed deliveries require the customer to arrange redelivery or locate a collection point through a website process, and many call instead into a contact operation shrinking with the letters business",
        outcome: "Redelivery, safe drop, or collection redirection arranged conversationally, resolving the highest-frequency parcel conversation without human handling",
        channels: ["Voice", "SMS", "Mobile app", "Web chat"],
        systems: ["Parcel tracking and delivery management", "Collection point / locker network", "Identity verification", "Delivery routing"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Parcel tracking and exception explanation",
        friction: "Tracking shows scan events without explaining what they mean, so customers contact repeatedly through the delivery window and depot staff answer the same question many times",
        outcome: "Plain-language status with realistic delivery expectations and investigation initiated where genuinely needed, ending the repeat-contact pattern",
        channels: ["Voice", "SMS", "Web chat", "Mobile app"],
        systems: ["Parcel tracking", "Investigation / case management", "Depot scan data", "Sender interfaces"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Rural delivery servicing",
        friction: "Rural customers have delivery arrangements involving contracted rural delivery, roadside boxes, and long distances, and their questions do not fit urban scripts or urban expectations",
        outcome: "Rural-specific delivery questions handled correctly with the right arrangements applied, improving service for the customers hardest and most expensive to serve",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Rural delivery contractor data", "Address and delivery point database", "Parcel tracking", "Delivery routing"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A tracking website and app with parcel status and delivery preference options",
        "A collection point, locker, and retail service point network across New Zealand",
        "National delivery operations including contracted rural delivery arrangements",
        "Sender-facing services for eCommerce and business customers",
      ],
      gaps: [
        "No conversational redelivery arrangement completing without a website form or a human",
        "No plain-language explanation of what a tracking scan means for delivery timing",
        "No rural-specific servicing that reflects how rural delivery actually works",
        "No after-hours capability, despite recipients arranging redelivery in the evening",
      ],
    },
    risks: [
      "State ownership makes service change and any perception of automating New Zealand jobs politically visible and subject to ministerial interest",
      "New Zealand's Privacy Act 2020 governs recipient data, and redelivery or address changes require identity verification to prevent misdirection",
      "SOE procurement pathways impose process requirements and timelines that must be understood before commercial engagement is scoped",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 5.5,
      automationRate: 0.6,
      basis: "Seller assumptions requiring validation: volume estimated from parcel-related consumer contact at New Zealand national delivery scale with seasonal peaking, cost reflecting onshore New Zealand contact labour, and a high automation rate given the logistical nature of parcel conversations.",
    },
    pilotScope:
      "An eight-to-ten week pilot automating redelivery arrangement and parcel-tracking explanation across voice, SMS, and app nationally, integrated to parcel tracking and the collection-point network, deployed ahead of peak season.",
    expansion: [
      "Add rural delivery servicing with contractor and delivery-point grounding",
      "Extend to proactive exception notification before recipients discover a problem",
      "Introduce sender-facing investigation and claim status for eCommerce business customers",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Customer Officer",
      "Chief Information Officer",
      "General Manager Parcels and Logistics",
      "Head of Customer Care",
    ],
    discovery: [
      "What proportion of parcel contacts are redelivery arrangements rather than genuine service failures?",
      "How does your contact volume track against parcel growth as the letters business shrinks?",
      "How do rural delivery enquiries differ from urban ones, and how are they handled today?",
      "What is the SOE procurement pathway and approval timeline for a service of this type?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A rural Canterbury recipient redirects a missed parcel to the nearest collection point without waiting for the next rural delivery run.",
  },

  "stockland": {
    operatingContext:
      "Stockland is one of Australia's largest diversified property groups, operating across masterplanned residential communities, land-lease living communities for downsizers and retirees, logistics estates, and town centres. Its residential business sells house-and-land packages and lots into communities that take years to build out, which means a single buyer relationship spans enquiry, deposit, contract, construction milestones, and settlement over an extended period with many communication touchpoints. Its land-lease communities business is structurally different and increasingly important: those are ongoing resident relationships with maintenance requests, community services, and lifestyle amenities, effectively a residential services operation. Buyers reach it through display village sales teams, web enquiry forms, and phone, and residents reach community managers on site.",
    strategicPressure: [
      { text: "Stockland operates across masterplanned residential communities, land-lease living, logistics, and town centres as a diversified property group", kind: "verified" },
      { text: "Land-lease living has been a strategic growth area for Australian property groups serving downsizing retirees, creating ongoing resident-services operations", kind: "verified" },
      { text: "Residential buyer journeys span years from enquiry to settlement, so communication gaps at milestones produce anxiety, complaints, and cancellations", kind: "inference" },
      { text: "Enquiry response speed at display villages depends on sales-consultant availability, so weekend and after-hours enquiries decay before anyone responds", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Property groups procure customer-experience technology rather than developing it, and Stockland's technology investment supports development, asset management, and sales systems. A conversational layer spanning residential sales and resident services requires integration with several operational systems, which is partner-delivered work rather than an off-the-shelf purchase alone.",
    whyNotBuild:
      "A property developer's capability is land, planning, construction, and asset management. Building conversational infrastructure would be entirely outside that competence set and would compete for capital with development pipeline. The residential and land-lease businesses also have very different conversation shapes, which favours a configurable purchased platform over any bespoke build.",
    workflows: [
      {
        name: "Residential sales-enquiry qualification",
        friction: "Web and display village enquiries are followed up when a sales consultant is free, so weekend and evening enquiries wait, and buyers comparing several communities respond to whoever answers first",
        outcome: "Every enquiry engaged within minutes and qualified on budget, timing, block preference, and finance readiness, with consultant appointments booked for qualified buyers",
        channels: ["Voice", "SMS", "Web chat", "Email"],
        systems: ["Sales CRM", "Lot and product inventory", "Pricing and release data", "Calendar scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Settlement and construction milestone communication",
        friction: "Buyers wait years between contract and settlement with milestones — titling, construction stages, settlement dates — communicated inconsistently, generating anxious calls to sales teams",
        outcome: "Proactive milestone updates through the whole journey, suppressing anxiety-driven contact and reducing the cancellations that follow communication silence",
        channels: ["SMS", "Email", "Voice"],
        systems: ["Sales CRM", "Development/project scheduling", "Titling and settlement tracking", "Builder interfaces"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Land-lease resident services",
        friction: "Residents raise maintenance requests, amenity bookings, and community questions with on-site community managers, whose availability limits response and whose time is consumed by administration",
        outcome: "Resident requests captured and triaged conversationally with maintenance dispatched and bookings confirmed, freeing community managers for the community-building work that sells the lifestyle",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Property/facilities management", "Maintenance work orders", "Amenity booking", "Resident records"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Community and project websites with enquiry forms and lot or home availability information",
        "Display villages with on-site sales consultants across residential communities",
        "Sales CRM systems tracking buyer enquiries through to settlement",
        "On-site community management for land-lease living communities",
      ],
      gaps: [
        "No immediate response to enquiries arriving outside display village hours",
        "No proactive milestone communication through the multi-year buyer journey",
        "No conversational resident-service channel outside community manager availability",
        "No shared customer view between residential sales and ongoing resident relationships",
      ],
    },
    risks: [
      "Property sales communications are subject to state-based real-estate and consumer protection rules, so representations about pricing, timing, and availability must be accurate and current",
      "Settlement and construction dates are inherently uncertain, so automated milestone communications must be carefully worded to avoid creating expectations that become disputes",
      "The Privacy Act governs buyer and resident data, and land-lease residents are frequently older Australians requiring accessible, patient service design",
    ],
    economics: {
      volumeMonthly: 80000,
      costPerInteraction: 6,
      automationRate: 0.5,
      basis: "Seller assumptions to validate: volume estimated from residential sales enquiries, buyer-journey communications, and land-lease resident contacts across the portfolio, cost reflecting sales consultant and community manager time rather than contact-centre labour, and a moderate automation rate given the high-value, consultative nature of property sales.",
    },
    pilotScope:
      "An eight-week pilot delivering instant residential sales-enquiry qualification and consultant appointment booking across voice, SMS, and web chat for three communities, integrated to the sales CRM and lot inventory.",
    expansion: [
      "Extend to settlement and construction milestone communication across the buyer journey",
      "Add land-lease resident services covering maintenance requests and amenity bookings",
      "Introduce a shared customer view spanning sales and ongoing resident relationships",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Chief Executive Officer Communities",
      "Chief Information and Digital Officer",
      "General Manager Residential Sales",
      "General Manager Land Lease Communities",
    ],
    discovery: [
      "What is your average time to first response on a residential enquiry, and how does that differ on weekends?",
      "How many buyer contacts does a single house-and-land purchase generate between contract and settlement?",
      "What proportion of contract cancellations trace back to communication gaps rather than finance failures?",
      "How much community manager time in land-lease communities goes to administration rather than community building?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A buyer enquiring about a Stockland community at 9pm Sunday is qualified and booked with a consultant before the display village opens.",
  },

  "mirvac": {
    operatingContext:
      "Mirvac is an integrated Australian property group that both develops and manages assets across residential apartments, master-planned communities, office, retail, and industrial, and it has built one of the country's larger build-to-rent platforms under the LIV brand. That build-to-rent platform changes its business model fundamentally: instead of selling an apartment and moving on, Mirvac becomes an ongoing landlord operating a residential service business with leasing enquiries, tours, applications, move-ins, maintenance requests, rent queries, and renewals — a permanently high-frequency communication relationship. Its traditional residential development business generates its own communication load through apartment sales, settlement coordination, and post-settlement defect management, which is one of the most complaint-prone processes in property. Buyers and residents reach it through sales suites, building management teams, resident apps, and phone.",
    strategicPressure: [
      { text: "Mirvac operates a build-to-rent platform under the LIV brand, making it an ongoing residential landlord rather than solely a developer selling completed stock", kind: "verified" },
      { text: "The group is an integrated developer and asset manager across residential, office, retail, and industrial sectors", kind: "verified" },
      { text: "Build-to-rent converts a one-off sales relationship into a continuous service relationship with leasing, maintenance, and renewal conversations year-round", kind: "inference" },
      { text: "Apartment defect management after settlement is a high-friction, complaint-prone process where communication quality determines whether issues escalate", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Mirvac procures customer-experience and property-management technology rather than developing platforms, and its technology investment supports development, asset, and building management. A conversational layer spanning leasing, resident services, and defect management requires integration with property management and maintenance systems, which is partner-delivered integration.",
    whyNotBuild:
      "Mirvac's capabilities are development, construction, and asset management. Building conversational infrastructure would sit entirely outside that and compete with development capital. Build-to-rent operations are also a relatively new business line where the operating model is still being refined, which favours a configurable bought capability over a fixed internal build.",
    workflows: [
      {
        name: "Build-to-rent leasing enquiries and tours",
        friction: "Prospective renters enquire at all hours and expect immediate response, but leasing consultants work business hours, so enquiries decay while renters book tours with competing buildings",
        outcome: "Instant enquiry response with availability, pricing, and tour booking handled conversationally, lifting lease-up speed and occupancy in a competitive rental market",
        channels: ["Voice", "SMS", "Web chat", "Email"],
        systems: ["Property management system", "Unit availability and pricing", "Tour scheduling", "Leasing CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Resident maintenance requests and building services",
        friction: "Residents report maintenance issues to building management by phone, email, or in person, and triage, tradesperson dispatch, and follow-up are handled manually by on-site teams",
        outcome: "Maintenance captured and triaged conversationally with work orders raised and residents updated automatically, improving resident satisfaction and renewal rates",
        channels: ["Voice", "SMS", "Resident app", "Web chat"],
        systems: ["Property management system", "Maintenance work orders", "Contractor dispatch", "Resident records"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Apartment settlement and defect management",
        friction: "Purchasers approaching settlement need inspection appointments, settlement coordination, and then defect rectification tracking, and slow or unclear communication turns minor defects into formal disputes",
        outcome: "Settlement milestones communicated proactively and defect items logged, tracked, and updated conversationally, reducing escalation into formal complaints",
        channels: ["Voice", "SMS", "Email", "Web chat"],
        systems: ["Sales CRM", "Settlement tracking", "Defect management system", "Builder and contractor interfaces"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "LIV build-to-rent buildings with on-site building management and resident services",
        "Resident-facing app and portal capability across build-to-rent assets",
        "Sales suites and consultant teams for apartment and community developments",
        "Property management and maintenance systems across managed assets",
      ],
      gaps: [
        "No after-hours leasing enquiry response, despite renters searching in the evening",
        "No conversational maintenance intake outside building management hours",
        "No proactive settlement and defect-rectification status communication for purchasers",
        "No consistent service experience across build-to-rent assets and development customers",
      ],
    },
    risks: [
      "Residential tenancy legislation differs by state and governs maintenance response obligations, entry notice, and rent-related communications, all of which an automated agent must apply correctly",
      "Urgent maintenance — water, electrical, security, safety — carries statutory response timeframes and must escalate immediately to human and contractor dispatch",
      "Defect and settlement communications can become evidence in disputes, so records must be accurate, complete, and auditable",
    ],
    economics: {
      volumeMonthly: 100000,
      costPerInteraction: 6,
      automationRate: 0.55,
      basis: "Seller assumptions requiring validation: volume estimated from build-to-rent leasing and resident contacts plus development sales and settlement communications, cost reflecting leasing consultant and building management time, and an automation rate assuming leasing and maintenance intake automate while urgent issues escalate.",
    },
    pilotScope:
      "An eight-week pilot delivering build-to-rent leasing enquiry response and tour booking across voice and messaging for two LIV buildings, integrated to unit availability and tour scheduling, measured on enquiry-to-tour conversion and lease-up speed.",
    expansion: [
      "Extend to resident maintenance intake and triage with automated work orders and status updates",
      "Add renewal conversations and resident services across the build-to-rent portfolio",
      "Introduce settlement and defect-rectification communication for apartment purchasers",
    ],
    stakeholders: [
      "Chief Executive Officer and Managing Director",
      "Chief Executive Officer Development",
      "General Manager Build to Rent",
      "Chief Information Officer",
      "Head of Customer Experience",
    ],
    discovery: [
      "How many leasing enquiries arrive outside consultant hours, and what is your current response time?",
      "How many maintenance requests does an average build-to-rent building generate per month, and who handles intake?",
      "What proportion of settlement-stage complaints trace back to defect communication rather than the defects themselves?",
      "How does your renewal rate correlate with maintenance response time across the LIV portfolio?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A renter browsing LIV apartments at 11pm books a Saturday tour and confirms pet policy and parking in the same conversation.",
  },

  "ray-white": {
    operatingContext:
      "Ray White is Australasia's largest real-estate group, a family-owned franchise network of around a thousand offices across Australia and New Zealand covering residential sales, property management, commercial, and rural agency. The franchisor supplies brand, technology, training, and marketing, while each office is independently owned and operated with its own agents, property managers, and service standards. That structure produces the network's defining inconsistency: buyer enquiry response speed, open-home follow-up, and tenant communication vary enormously between offices, and in residential sales the agent who responds first to a buyer enquiry frequently wins the relationship. Property management adds a continuous, unglamorous communication load — maintenance requests, rent queries, lease renewals, and routine inspections — that property managers handle across large rent rolls while also chasing new business.",
    strategicPressure: [
      { text: "Ray White operates as Australasia's largest real-estate franchise network with around a thousand independently owned offices across Australia and New Zealand", kind: "verified" },
      { text: "The franchisor provides shared technology, marketing, and training services to member offices as its core value proposition", kind: "verified" },
      { text: "In residential sales, speed of response to a buyer enquiry materially affects which agent captures the relationship, so response lag is direct lost revenue for offices", kind: "inference" },
      { text: "Property management rent rolls generate continuous tenant and landlord communication that property managers absorb alongside business development, capping portfolio size per manager", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. The franchisor's role is network orchestration and shared services, not platform engineering, and no individual office could fund conversational technology. But a network-wide service layer requires configuration per office, per state tenancy law, and per business line, which makes this a partner-delivered shared capability rather than a simple product purchase.",
    whyNotBuild:
      "A franchisor is a service organisation for its members, and its technology function assembles and delivers shared tools rather than building speech and orchestration infrastructure. An individual office operating a rent roll and a sales team has no capacity whatsoever. The economics only work as a centrally purchased capability consumed per office, which is exactly how the network already buys its other shared services.",
    workflows: [
      {
        name: "Buyer-enquiry instant response and qualification",
        friction: "Portal and web enquiries arrive continuously, but agents are at open homes, in appraisals, or asleep, so response lag hands the buyer relationship to whichever agent replies first",
        outcome: "Every buyer enquiry answered within minutes with property details, inspection times, and price guidance, and qualified buyers booked directly into the agent's diary",
        channels: ["Voice", "SMS", "Web chat", "Email"],
        systems: ["Listing/CRM platform", "Portal enquiry feeds", "Inspection scheduling", "Agent calendars"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Open-home follow-up and campaign nurture",
        friction: "Open-home attendees are followed up inconsistently depending on agent workload, so buyer interest goes uncaptured and vendors receive weaker campaign feedback than the data supports",
        outcome: "Systematic follow-up with every attendee capturing interest level and objections, giving vendors real campaign feedback and agents a ranked buyer list",
        channels: ["SMS", "Voice", "Email"],
        systems: ["Listing/CRM platform", "Open-home attendance capture", "Vendor reporting", "Campaign management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Property management tenant and landlord communication",
        friction: "Maintenance requests, rent queries, inspection scheduling, and lease renewals arrive continuously to property managers already carrying large rent rolls and chasing new management business",
        outcome: "Routine tenant and landlord communication handled conversationally with maintenance triaged and inspections scheduled, letting property managers carry larger portfolios",
        channels: ["Voice", "SMS", "Web chat", "Email"],
        systems: ["Property management trust software", "Maintenance work orders", "Inspection scheduling", "Landlord reporting"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Franchisor-supplied CRM, listing, and marketing technology used across member offices",
        "Property management trust accounting and portfolio software across rent rolls",
        "Portal listing distribution generating buyer and tenant enquiry flow to offices",
        "Training and shared services delivered centrally to independently owned offices",
      ],
      gaps: [
        "No instant enquiry response across the network, so speed varies by office and by agent availability",
        "No systematic open-home follow-up, leaving buyer interest and vendor feedback uncaptured",
        "No after-hours tenant maintenance intake, despite issues occurring at any hour",
        "No consistent service standard the franchisor can guarantee across independently operated offices",
      ],
    },
    risks: [
      "Residential tenancy legislation differs by Australian state and in New Zealand, so maintenance, entry, and rent communications must apply the correct jurisdiction's rules",
      "Real-estate agency legislation governs representations about property, price, and marketing, so automated responses must avoid statements that could mislead a buyer",
      "Franchise structure means adoption may be per-office rather than mandated, so the commercial model must work as an opt-in shared service with clear per-office value",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 5,
      automationRate: 0.6,
      basis: "Seller assumptions to validate: volume estimated across around a thousand offices generating buyer enquiries, open-home follow-ups, and property management communications, cost reflecting agent and property manager time rather than contact-centre labour, and a high automation rate given the repetitive nature of enquiry and maintenance intake.",
    },
    pilotScope:
      "An eight-to-ten week pilot with a group of volunteer offices delivering instant buyer-enquiry response and inspection booking across voice, SMS, and chat, integrated to the network CRM and portal enquiry feeds, measured on response time and enquiry-to-inspection conversion.",
    expansion: [
      "Extend to systematic open-home follow-up with vendor campaign reporting",
      "Add property management tenant and landlord communication with jurisdiction-specific tenancy rules",
      "Roll the shared service layer across the network with per-office configuration and Mandarin-language support in high-demand markets",
    ],
    stakeholders: [
      "Managing Director / Chief Executive Officer",
      "Chief Information Officer",
      "Head of Property Management Network",
      "General Manager Network Growth and Franchise Services",
      "Head of Marketing and Customer Experience",
    ],
    discovery: [
      "What is the median time to first response on a portal buyer enquiry across the network, and how wide is the spread between offices?",
      "How many properties does an average property manager carry, and what caps that number today?",
      "Can the franchisor fund and mandate a network-wide service layer, or must it be an opt-in per-office subscription?",
      "How much buyer enquiry in your Sydney and Melbourne markets arrives from Mandarin-speaking buyers, and how is that handled today?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A buyer enquiring on a Ray White listing at 11pm gets the price guide, inspection times, and a Saturday appointment before any rival agent replies.",
  },
};
