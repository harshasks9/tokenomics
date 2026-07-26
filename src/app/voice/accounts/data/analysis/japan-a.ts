import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_JAPAN_A: Record<string, ProfileAnalysis> = {
  "resona-holdings": {
    operatingContext:
      "Resona Holdings is the retail- and SME-focused banking group formed from Resona Bank, Saitama Resona Bank and Kansai Mirai Bank, concentrated in the Tokyo/Saitama corridor and the Osaka-Kansai belt rather than spread thinly nationwide. It is unusual among Japanese commercial banks in retaining full trust-banking functions inside the commercial bank, which makes inheritance, testamentary trust and asset-succession procedures a genuine revenue line rather than an administrative afterthought. Its customers are overwhelmingly individual depositors and small business owners, a large share of them retired, who still treat the branch and the branch phone number as the default way to start any procedure. Digital servicing runs through the group smartphone app and a group contact centre, but the moment a procedure involves seals, certificates, family registers or a deceased account holder, the interaction falls back to a phone call and a booked branch visit.",
    strategicPressure: [
      { text: "Resona has built its retail identity around branch reform - later opening hours, reservation-based visits and a heavily promoted group app - which makes moving routine procedures off teller counters an explicit management commitment rather than a cost project.", kind: "verified" },
      { text: "Inheritance and asset-succession volume rises mechanically with the death rate of the depositor cohort, and each case starts with a long, emotionally sensitive, document-heavy phone conversation that no IVR menu can absorb.", kind: "inference" },
      { text: "Branch and contact-centre staffing in Saitama and Kansai competes with every other service employer for the same shrinking pool of Japanese-speaking service workers, so headcount cannot be the answer to rising procedure volume.", kind: "inference" },
      { text: "Because retail servicing cost per account is the binding constraint on a low-margin deposit franchise, the group will fund automation that measurably removes teller and phone minutes rather than automation that only improves satisfaction scores.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Resona is a bank with a strong retail operating culture, not a software producer - its core banking and channel systems are delivered by external system vendors and a group IT services arm that integrates rather than invents. There is no publicly visible internal speech, dialogue-model or evaluation engineering practice, and the group's AI narrative has been about applying tools to operations, not building platforms.",
    whyNotBuild:
      "Building this would mean owning Japanese speech recognition tuned for elderly speakers and regional accents, keigo-correct synthesis a bank is willing to put in front of a bereaved family, telephony integration into an existing branch and contact-centre estate, orchestration into core banking and trust systems, and a permanent evaluation function to prove every automated utterance was compliant. That is four specialist disciplines with no relationship to Resona's competitive advantage, which is branch density and retail trust.",
    workflows: [
      {
        name: "Branch appointment booking and pre-visit document guidance",
        friction: "Customers phone the branch to book a visit, staff check a paper or shared calendar mid-shift, and the caller arrives without the seal, certificate or identification the procedure required - forcing a second visit.",
        outcome: "Slots booked in-conversation with a procedure-specific document checklist confirmed before the customer leaves home, cutting repeat visits and teller rework.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Branch reservation system", "Customer information file", "Product and procedure knowledge base"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Inheritance and succession procedure intake",
        friction: "A bereaved family member calls, is transferred between the branch and a specialist desk, re-explains the circumstances each time, and receives a document list verbally that is later misremembered.",
        outcome: "Structured, patient intake that captures the relationship, account scope and required documents once, then hands a complete case file to the succession specialist with the family contacted only once.",
        channels: ["Voice", "LINE"],
        systems: ["Trust and succession case system", "Core deposit system", "Document management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Address, seal and card reissue procedure guidance",
        friction: "High-repetition, low-value procedure calls occupy the same staffed queue as complex consultations, so wait times spike at month-end and after branch consolidations.",
        outcome: "Routine procedure calls resolved or fully pre-processed without a human, releasing the staffed queue for consultation and succession work.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Core banking", "Card issuance system", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A widely promoted group smartphone banking app used as the primary digital servicing channel",
        "A LINE official account used for notifications and light servicing entry points",
        "A group contact centre supporting the three bank brands, with substantial outsourced capacity",
        "An established branch reservation capability tied to extended opening hours",
      ],
      gaps: [
        "No way to complete an inheritance intake end-to-end without a human specialist call and a branch visit",
        "Out-of-hours procedure questions have no resolution path beyond a recorded message",
        "Digital and phone channels do not carry context, so an app user who calls starts from zero",
        "Family members acting for elderly or incapacitated account holders have no guided, compliant self-service route",
      ],
    },
    risks: [
      "Banking Act and FSA conduct expectations mean any automated explanation touching products or fees must be provably within approved wording, with full retention of the interaction record.",
      "APPI obliges clear purpose specification and consent handling for voice recordings and for the sensitive family data disclosed during succession conversations.",
      "Elderly-customer protection practice inside Japanese banks requires escalation paths where diminished capacity or possible fraud is suspected - the agent must detect and hand off rather than complete the procedure.",
    ],
    economics: {
      volumeMonthly: 800000,
      costPerInteraction: 6.2,
      automationRate: 0.5,
      basis: "Seller assumptions derived from group retail scale and Japanese contact-centre labour cost, to be replaced with the account team's actual contact volumes and fully-loaded cost per call in discovery.",
    },
    pilotScope:
      "One production Japanese-language voice and LINE agent handling branch appointment booking plus pre-visit document guidance for the top ten retail procedures across Resona Bank and Saitama Resona branches in one region, with live reservation-system write-back and escalation to the staffed queue.",
    expansion: [
      "Extend to inheritance and succession intake with specialist handoff and case-file creation",
      "Roll the same agent across Kansai Mirai Bank and the full branch network with per-brand tone and disclosure settings",
      "Add proactive outbound - document-chasing, appointment reminders and procedure-completion follow-up",
    ],
    stakeholders: [
      "Head of Retail Banking Division",
      "General Manager, Customer Service / Contact Centre",
      "Head of Branch Strategy and Channel Reform",
      "Group CIO / Head of IT Planning",
      "Compliance and Customer Protection Officer",
    ],
    discovery: [
      "What share of branch-originated calls are pure procedure guidance versus consultation, and how is that split measured today?",
      "How many inheritance cases start each month, and what is the average number of customer contacts before the documents are complete?",
      "Which parts of the contact centre are outsourced, and when do those BPO contracts come up for renewal?",
      "What is the internal standard for automated speech in front of elderly customers, and who signs off on it?",
    ],
    flowTemplate: "appointments",
    scenario: "A daughter calls her mother's Resona branch after a bereavement and completes the full succession document checklist and specialist appointment in one guided conversation.",
  },

  "fukuoka-fg": {
    operatingContext:
      "Fukuoka Financial Group is Japan's largest regional banking group, built from the Bank of Fukuoka, Kumamoto Bank and Juhachi-Shinwa Bank, covering Kyushu from Fukuoka city down through Kumamoto and Nagasaki. Its customer base is a mix of Kyushu SMEs and a retail depositor population that is ageing and shrinking faster than the national average, particularly in the Nagasaki and Kumamoto footprints where branch consolidation has gone furthest. The group also operates Minna Bank, a purpose-built digital-only bank, and the iBank marketing venture - genuine digital assets, but ones aimed at a young smartphone segment that overlaps very little with the elderly depositors who generate the traditional banks' phone traffic. Those traditional customers still reach the group through branch phone lines and a regional contact centre, with the app used mainly for balance checking rather than procedures.",
    strategicPressure: [
      { text: "The group built Minna Bank as a full cloud-native digital bank on Google Cloud, which is unusually strong public evidence that group leadership will approve cloud-delivered customer-facing technology.", kind: "verified" },
      { text: "Kyushu's population decline means the traditional banks face rising servicing cost per remaining customer at exactly the moment branch consolidation removes the staff who used to absorb it.", kind: "verified" },
      { text: "Minna Bank's engineering organisation is deliberately separated from the legacy banks, so its capability does not translate into conversational servicing for Bank of Fukuoka's elderly branch customers.", kind: "inference" },
      { text: "Contact-centre hiring in Fukuoka is contested by the city's large BPO industry, pushing wage rates up and making elastic non-human capacity commercially attractive.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Unlike most regional banks the group has demonstrated real build capability through Minna Bank, so a pure buy pitch will be met with in-house pride. But that capability sits in a separate legal entity with a separate product roadmap, and it has never been pointed at keigo-quality voice servicing for the legacy banks' branch estate. The correct posture is to sell industry workflow, Japanese voice quality and speed of deployment on top of a cloud stack they already trust.",
    whyNotBuild:
      "Minna Bank's team is fully committed to running and growing a licensed digital bank. Redirecting it to build speech recognition for elderly Kyushu dialect speakers, keigo synthesis, legacy branch telephony integration, orchestration into the traditional banks' core systems and a permanent evaluation harness would be years of work outside its charter, and would delay the digital bank's own roadmap.",
    workflows: [
      {
        name: "After-hours and overflow inbound servicing for the traditional bank brands",
        friction: "Outside branch hours callers reach a recorded message; during peak hours the regional centre queues, and calls that overflow are simply abandoned.",
        outcome: "A single always-on line that answers procedure questions, checks statuses and books callbacks, absorbing evening and peak-hour demand across all three bank brands.",
        channels: ["Voice", "LINE"],
        systems: ["Core banking", "CRM", "Branch reservation system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Branch consolidation transition support",
        friction: "When a Nagasaki or Kumamoto branch closes, affected customers phone repeatedly about where their account is now handled, ATM access and passbook changes - a spike the shrunken local staff absorb worst.",
        outcome: "Proactive outbound notification plus an inbound line that answers relocation questions with the customer's actual new branch, suppressing the consolidation call spike.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Core banking", "Branch master data", "Customer information file"],
        value: 2,
        complexity: 2,
      },
      {
        name: "SME loan and procedure status inquiries",
        friction: "Kyushu business owners call their relationship manager for application status; the RM is out visiting clients, so the call bounces to a branch clerk who cannot see the case.",
        outcome: "Business customers get grounded status and next-step answers immediately, protecting relationship-manager time for actual origination.",
        channels: ["Voice", "LINE", "Email"],
        systems: ["Loan origination system", "CRM", "Document management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Minna Bank, a fully digital bank operating as a separate entity with its own app",
        "Banking apps and LINE official accounts for the traditional bank brands",
        "A regional contact centre serving the group's retail customers",
        "The iBank marketing venture and its consumer money-management app",
      ],
      gaps: [
        "Elderly branch customers have no servicing channel that works outside staffed hours",
        "Branch-closure transitions are communicated by mail and signage with no conversational support",
        "Nothing carries context between the three bank brands' channels and the group contact centre",
        "SME customers cannot get a grounded loan-status answer without reaching a specific human",
      ],
    },
    risks: [
      "Three bank brands with distinct customer bases and legacy systems mean the agent must present different names, disclosures and product wording per brand from one deployment.",
      "APPI consent and retention rules apply to voice recordings across all brands, and Kyushu regional customers are unusually sensitive to how their data moves between merged entities.",
      "FSA expectations around customer explanation quality mean product-related answers require approved-source grounding and a full audit trail.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 5.6,
      automationRate: 0.5,
      basis: "Seller assumptions from group retail scale and Kyushu contact-centre wage levels; validate against the group's actual inbound volumes and per-brand cost allocation in discovery.",
    },
    pilotScope:
      "One Japanese-language voice and LINE agent covering after-hours and overflow procedure inquiries for Bank of Fukuoka retail customers, grounded in core banking status and branch reservation data, with warm transfer into the regional contact centre during staffed hours.",
    expansion: [
      "Extend the same deployment to Kumamoto Bank and Juhachi-Shinwa with per-brand tone and disclosure profiles",
      "Add proactive branch-consolidation and product-maturity outbound campaigns",
      "Introduce SME loan-status and document-chasing workflows tied to the origination system",
    ],
    stakeholders: [
      "Head of Group Digital Strategy",
      "General Manager, Retail Business Division, Bank of Fukuoka",
      "Head of Customer Service Centre",
      "Group CIO / Head of Systems Planning",
      "Chief Compliance Officer",
    ],
    discovery: [
      "Does the Minna Bank engineering organisation have any mandate over the traditional banks' customer channels, or is the separation absolute?",
      "What happens today to calls that arrive at branch numbers outside staffed hours, and how many are there?",
      "How is customer communication handled when a branch closes, and what call volume does each closure generate?",
      "Which contact-centre functions are outsourced in Fukuoka, and at what cost per call?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Nagasaki customer whose branch has just been consolidated calls at 8pm and gets a full answer about her new branch, passbook and ATM access without waiting for morning.",
  },

  "concordia-fg": {
    operatingContext:
      "Concordia Financial Group is the holding company for the Bank of Yokohama, the largest Japanese regional bank by assets, together with Higashi-Nippon Bank. Its franchise is unusually dense rather than dispersed - Kanagawa and southern Tokyo contain both a very large retail depositor base and a heavy concentration of small manufacturers and trading companies. That density means high absolute call volume per branch: card reissues, address changes, salary-account setup, housing-loan servicing and the steady flow of inheritance procedures that comes with Kanagawa's ageing suburban population. Customers reach the bank through a retail app, a LINE official account and, still predominantly for anything procedural, the branch or contact-centre telephone number.",
    strategicPressure: [
      { text: "As the largest regional bank by assets, Concordia is measured by investors against megabank cost-income ratios, which puts sustained pressure on retail servicing cost per account.", kind: "verified" },
      { text: "Kanagawa's dense but ageing suburban base means procedure calls concentrate in high-volume urban branches where staffing costs are highest in the whole regional-bank sector.", kind: "inference" },
      { text: "Housing-loan servicing - rate-type changes, prepayment questions, group credit insurance - generates long, complex calls that are among the most expensive minutes in retail banking to staff.", kind: "inference" },
      { text: "With megabank branches competing in the same postcodes, the bank cannot degrade service quality to cut cost, so it needs automation that customers experience as an upgrade rather than a barrier.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The group's technology is delivered through shared regional-banking system platforms and external system integrators, with IT organised as planning and vendor management rather than product engineering. There is no public evidence of internal speech, dialogue or model-evaluation capability, and regional-bank IT budgets are dominated by core-system maintenance and regulatory work.",
    whyNotBuild:
      "A bank of this profile has neither the engineering headcount nor the recruitment position to hire speech and conversational-AI specialists in competition with Tokyo technology employers. Even if it could, telephony integration, keigo evaluation and continuous model governance are permanent operating functions, not a project - and no part of that improves the bank's actual competitive position in Kanagawa lending.",
    workflows: [
      {
        name: "Branch-call deflection for routine account procedures",
        friction: "Urban branch phones ring continuously with address changes, passbook questions and card reissues, pulling staff off the counter and lengthening in-branch waits for customers who actually came in person.",
        outcome: "Routine procedure calls answered and actioned without touching branch staff, measurably returning staff minutes to counter and consultation work.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Core banking", "Card issuance system", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Housing-loan servicing inquiries",
        friction: "Rate-type change, prepayment and insurance questions are routed to a specialist desk with limited hours, so borrowers wait days for an answer that is largely deterministic.",
        outcome: "Borrowers get grounded, policy-correct answers and simulations immediately, with only genuine restructuring cases reaching a human specialist.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Loan servicing system", "Rate and product master", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Consultation appointment booking with pre-qualification",
        friction: "Customers book asset-management or loan consultations by phone with no pre-qualification, so specialists spend the first half of every meeting gathering facts.",
        outcome: "Appointments arrive pre-qualified with the customer's situation captured in advance, raising specialist productivity per booked hour.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Branch reservation system", "CRM", "Customer information file"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A retail banking smartphone app for balance, transfer and basic servicing",
        "A LINE official account used for notifications and simple inquiries",
        "A group contact centre covering both bank brands with outsourced overflow capacity",
        "An IVR estate front-ending branch and centre telephone numbers",
      ],
      gaps: [
        "Customers cannot complete an address or seal change end-to-end without staff involvement",
        "Housing-loan questions have no self-service path and always queue for a specialist",
        "The IVR cannot understand a spoken request, only route a keypress",
        "Nothing connects an app session that failed to the phone call the customer makes next",
      ],
    },
    risks: [
      "Housing-loan and investment-product explanations fall under suitability and explanation-obligation rules, so automated responses must be strictly bounded to approved wording.",
      "APPI requires explicit handling rules for voice recordings and for the customer attributes used to personalise responses.",
      "Any degradation in perceived politeness would be commercially damaging in a market where megabank branches are physically adjacent alternatives.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 6.5,
      automationRate: 0.55,
      basis: "Seller assumptions based on retail account scale and Kanagawa labour cost; replace with the bank's measured inbound volume and fully-loaded cost per contact during discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent on the retail contact-centre number handling the eight highest-volume account procedures with live core-banking status lookup and warm transfer, deployed across the Yokohama metropolitan branch cluster first.",
    expansion: [
      "Add housing-loan servicing inquiries with product-master grounding and specialist escalation",
      "Extend to Higashi-Nippon Bank and to LINE as a parallel channel",
      "Introduce pre-qualified consultation booking and outbound appointment reminders",
    ],
    stakeholders: [
      "Head of Retail Banking, Bank of Yokohama",
      "General Manager, Customer Service Centre",
      "Head of Channel Strategy",
      "Group Head of IT Planning",
      "Compliance and Customer Protection lead",
    ],
    discovery: [
      "How many calls land directly on branch telephone numbers versus the central contact centre, and who measures that?",
      "What is the current IVR containment rate, and which intents fail containment most often?",
      "Which housing-loan inquiries are considered too sensitive to automate, and who decides?",
      "When does the current contact-centre and IVR vendor contract come up for renewal?",
    ],
    flowTemplate: "appointments",
    scenario: "A Yokohama customer changes her registered address and books a housing-loan consultation in one call, without a branch visit or a specialist callback.",
  },

  "chiba-bank": {
    operatingContext:
      "Chiba Bank is the dominant regional bank in Chiba Prefecture, serving the Tokyo-commuter belt around Funabashi and Kashiwa as well as the far more rural and rapidly ageing Boso peninsula. It anchors the TSUBASA Alliance, a multi-bank cooperation framework built around shared core banking infrastructure and joint digital initiatives with other large regional banks, and separately runs a partnership with Musashino Bank. Its retail customers span younger commuter households that use the app and an older prefectural population whose banking behaviour is entirely branch- and telephone-based. That split means the bank operates two effectively different service models at once, with the phone channel carrying the higher-effort half of the demand.",
    strategicPressure: [
      { text: "The TSUBASA Alliance was created explicitly to share systems and cost across large regional banks, which means anything proven at Chiba has a structural replication path to alliance members.", kind: "verified" },
      { text: "The Boso peninsula and inland Chiba are ageing far faster than the commuter belt, so branch consolidation there converts in-person servicing into telephone servicing rather than digital servicing.", kind: "inference" },
      { text: "The bank's app-first digital push does not reach the customers generating the most expensive calls, leaving a widening gap between digital investment and where servicing cost actually sits.", kind: "inference" },
      { text: "Alliance-level procurement makes a multi-bank commercial structure plausible, which changes the economics of a pilot from single-bank ROI to shared-platform ROI.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The bank's IT posture is defined by shared alliance infrastructure and vendor-delivered core systems - the entire logic of TSUBASA is that individual regional banks should not build things separately. That same logic argues strongly against Chiba Bank building conversational AI alone, and equally strongly for buying a platform that can be shared.",
    whyNotBuild:
      "The alliance model exists precisely because regional banks concluded they cannot each afford independent system development. Speech recognition tuned to elderly Chiba speakers, keigo-safe synthesis, telephony integration, core-system orchestration and permanent evaluation would be five build streams for a bank whose declared strategy is to stop building things alone.",
    workflows: [
      {
        name: "Procedure guidance and appointment booking for post-consolidation branches",
        friction: "Rural Chiba customers whose branch has closed call the nearest remaining branch for procedures, arriving without documents and forcing repeat trips that are far longer than in urban areas.",
        outcome: "Procedure requirements confirmed and visits booked by phone with a verified document checklist, sharply reducing wasted long-distance trips.",
        channels: ["Voice", "LINE"],
        systems: ["Branch reservation system", "Core banking", "Procedure knowledge base"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Card, passbook and internet-banking access recovery",
        friction: "Lost cards, forgotten internet-banking credentials and passbook problems generate urgent, emotionally charged calls that queue behind routine traffic.",
        outcome: "Immediate identity-safe handling of blocks, reissues and reset initiation at any hour, with fraud-suspicion cases escalated to humans instantly.",
        channels: ["Voice", "Mobile app", "LINE"],
        systems: ["Card management", "Internet banking platform", "Fraud case system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Time-deposit maturity and product-renewal conversations",
        friction: "Maturity notices go out by mail and generate an unpredictable inbound wave of renewal and rate questions that the centre cannot staff for.",
        outcome: "Maturity handled as a planned, proactive conversation with renewal options explained within approved wording and specialist referral where suitability applies.",
        channels: ["Voice", "LINE", "Mail follow-up"],
        systems: ["Core deposit system", "Product master", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A retail banking app promoted heavily to the commuter customer base",
        "A LINE official account used for notifications and simple inquiries",
        "A central contact centre supplemented by branch-level telephone handling",
        "Shared alliance digital infrastructure providing common platform components",
      ],
      gaps: [
        "Rural customers still cannot complete any procedure without a physical branch visit",
        "No after-hours handling for card loss or access problems beyond a blocking line",
        "Maturity and renewal conversations are reactive, arriving as an unmanaged call wave",
        "Alliance-level customer-communication capability does not exist despite shared core systems",
      ],
    },
    risks: [
      "Anything shared across TSUBASA banks needs multi-bank governance agreement on wording, data handling and escalation, which lengthens the path from pilot to alliance rollout.",
      "APPI and banking secrecy rules constrain how customer data can be processed across an alliance boundary.",
      "Elderly-customer fraud protection obligations require the agent to detect coercion or confusion signals and route to a human rather than complete a transaction.",
    ],
    economics: {
      volumeMonthly: 220000,
      costPerInteraction: 6,
      automationRate: 0.5,
      basis: "Seller assumptions from prefectural retail scale and Japanese contact-centre labour cost; validate against Chiba Bank's measured call volumes and branch-level telephone traffic in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent handling procedure guidance and branch-appointment booking for retail customers in the Boso and inland Chiba branch cluster, with live reservation write-back and a document-checklist confirmation step.",
    expansion: [
      "Add card and internet-banking access recovery with 24-hour coverage",
      "Introduce proactive maturity and renewal outbound conversations",
      "Package the deployment for adoption by other TSUBASA Alliance banks on shared infrastructure",
    ],
    stakeholders: [
      "Head of Retail Business Division",
      "General Manager, Customer Service Centre",
      "Head of Digital Strategy / TSUBASA Alliance liaison",
      "Head of IT Planning",
      "Compliance and Customer Protection Officer",
    ],
    discovery: [
      "How much telephone traffic is handled at branch level rather than the central centre, and is it measured at all?",
      "Could a conversational deployment be procured through the TSUBASA Alliance rather than by Chiba Bank alone?",
      "What is the current process when a rural customer arrives at a branch without the correct documents?",
      "Which intents are already handled by the existing IVR, and what is its abandon rate?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An 80-year-old customer on the Boso peninsula confirms exactly which documents her inheritance procedure needs and books the branch visit in a single unhurried call.",
  },

  "shizuoka-fg": {
    operatingContext:
      "Shizuoka Financial Group is the holding company for Shizuoka Bank, among the strongest-capitalised regional banks in Japan, serving a prefecture whose economy is built on manufacturing - the Hamamatsu machinery and mobility cluster, food processing, and a long belt of supplier SMEs along the Tokaido corridor. Its lending franchise is therefore unusually business-weighted for a regional bank, while its deposit base is a conventional ageing retail population spread across Shizuoka, Hamamatsu and smaller coastal towns. Retail customers use a bank app for balances but return to the branch telephone for anything involving documents, seals or product decisions. The group has diversified into securities, leasing and a securities-brokerage partnership, which adds further customer-servicing lines that all land on the same constrained phone estate.",
    strategicPressure: [
      { text: "Shizuoka Bank's strong capital position gives it more freedom than most regional banks to fund efficiency investment ahead of an immediate cost crisis.", kind: "verified" },
      { text: "A manufacturing-SME lending base means business customers call about facility drawdowns, foreign-exchange settlement and document requirements during working hours, competing directly with retail procedure calls for the same staff.", kind: "inference" },
      { text: "Branch consolidation across coastal and inland Shizuoka pushes displaced servicing into a contact centre that cannot recruit locally at the pace consolidation removes counters.", kind: "inference" },
      { text: "Group diversification into securities and leasing multiplies the number of servicing lines without multiplying the staff available to answer them.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The bank's technology is delivered through external core-banking vendors and integrators, with internal IT focused on planning, security and vendor governance. Its public innovation narrative concerns business partnerships and regional revitalisation rather than software engineering, and there is no evidence of internal speech or conversational-model capability.",
    whyNotBuild:
      "Strong capital does not create engineering talent. Shizuoka would have to recruit speech and conversational specialists into a prefectural bank competing with Tokyo employers, then run permanent evaluation and telephony operations - all to produce a capability that confers no lending advantage. Buying a proven Japanese-language platform converts that into a procurement decision the bank is well equipped to make.",
    workflows: [
      {
        name: "Retail procedure and product-inquiry handling",
        friction: "Address changes, passbook reissues and deposit-product questions arrive at branch phones during counter hours, forcing staff to choose between the customer in front of them and the one on the line.",
        outcome: "Routine retail inquiries resolved without human involvement, with staff attention returned to counter service and consultation.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Core banking", "Product master", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "SME facility and settlement-procedure support",
        friction: "Business customers call to check drawdown timing, remittance cut-offs and required documentation, and are transferred to whichever staff member happens to know - answers vary by branch.",
        outcome: "Consistent, grounded answers on facility status and settlement procedure at any hour, with relationship managers freed for origination.",
        channels: ["Voice", "Email", "LINE"],
        systems: ["Loan management system", "Remittance and FX systems", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Group cross-referral triage across bank, securities and leasing",
        friction: "A customer calling about an investment or leasing question reaches the bank line, is given another number to call, and often does not call it.",
        outcome: "Intent recognised and the customer connected or booked directly into the right group entity, converting abandoned referrals into scheduled conversations.",
        channels: ["Voice", "LINE"],
        systems: ["CRM", "Group entity booking systems", "Customer information file"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A retail banking app used mainly for balance and transfer functions",
        "A LINE official account for notifications and light inquiry handling",
        "A central customer service centre backed by branch-level phone handling",
        "Group companies in securities and leasing with their own customer desks",
      ],
      gaps: [
        "No end-to-end digital completion for document-bearing retail procedures",
        "Business customers have no self-service route to facility or settlement status",
        "Group entities do not share customer context, so referrals leak",
        "No servicing capacity outside branch and centre hours",
      ],
    },
    risks: [
      "Investment and insurance product discussion triggers suitability and explanation obligations, so any group cross-referral flow must stop short of product recommendation.",
      "APPI governs voice recording and the transfer of customer information between the bank and group companies, which requires explicit consent design.",
      "Business-customer settlement queries touch payment instructions, where any automated error carries direct financial consequence and demands strict read-only bounds.",
    ],
    economics: {
      volumeMonthly: 160000,
      costPerInteraction: 6,
      automationRate: 0.5,
      basis: "Seller assumptions from prefectural retail and SME scale and Japanese contact-centre cost; validate with the bank's measured contact volumes and channel mix during discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent on the retail service line covering the highest-volume account procedures and deposit-product inquiries for the Shizuoka and Hamamatsu branch clusters, grounded in core banking data with warm transfer to the customer service centre.",
    expansion: [
      "Add SME facility-status and settlement-procedure support with read-only system grounding",
      "Introduce group cross-referral triage into securities and leasing booking",
      "Extend to LINE and add proactive outbound for maturity and document chasing",
    ],
    stakeholders: [
      "Head of Retail Business Division, Shizuoka Bank",
      "General Manager, Customer Service Centre",
      "Head of Corporate Banking Operations",
      "Group Head of IT Planning",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How is call traffic split between branch phones, the service centre and group-company desks?",
      "What proportion of inbound business-customer calls are pure status checks that could be answered from systems?",
      "Where has branch consolidation already displaced servicing volume, and where is it going next?",
      "What is the group's position on automated voice touching anything investment-related?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Hamamatsu parts-supplier owner checks a facility drawdown and next-day remittance cut-off at 7am without waiting for his relationship manager.",
  },

  "hachijuni-bank": {
    operatingContext:
      "Hachijuni Bank is the dominant regional bank of Nagano Prefecture, a mountainous, sparsely-settled region with one of the oldest population profiles in Japan and long travel distances between towns. It is in the middle of integrating Nagano Bank following their business combination, which means account, card, passbook and internet-banking migration questions for a customer base that is precisely the least equipped to handle a digital transition. Its lending is spread across Nagano manufacturing SMEs, agriculture and tourism-related businesses in areas like Karuizawa and Hakuba, while the deposit franchise is retail and heavily elderly. Customers reach the bank through branch phones, a central service line and, increasingly reluctantly, an app they mostly do not use for procedures.",
    strategicPressure: [
      { text: "The integration with Nagano Bank is publicly committed, and system and account migration in Japanese bank mergers reliably produces a multi-quarter surge in customer procedure inquiries.", kind: "verified" },
      { text: "Nagano's terrain and settlement pattern make branch visits genuinely costly for elderly customers, so telephone servicing carries a higher share of demand than in flat, dense prefectures.", kind: "inference" },
      { text: "The merger call surge arrives exactly when combined-entity headcount is being rationalised, creating a temporary capacity gap that permanent hiring cannot economically fill.", kind: "inference" },
      { text: "A successful migration-support deployment would leave behind a reusable servicing capability, which reframes a one-off integration cost as a permanent efficiency asset.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Hachijuni's systems are vendor-delivered and its integration programme is being executed with external system houses, which is where all available IT capacity is committed. A bank in the middle of a core-system integration has, by definition, no spare engineering capacity for a new conversational platform.",
    whyNotBuild:
      "Merger integration consumes every available IT resource for years. Even in a normal year Hachijuni could not staff speech, dialogue, telephony and evaluation disciplines from the Nagano labour market. The migration surge is time-bound and immediate, which makes a deployable bought capability the only option that arrives before the problem peaks.",
    workflows: [
      {
        name: "Merger account-migration inquiry handling",
        friction: "Customers receive migration notices by mail, do not understand which of their account numbers, cards or direct debits change, and call repeatedly - each call re-explaining the same circumstance to a different clerk.",
        outcome: "Migration questions answered against the customer's actual account records, with the same answer every time and a complete record of who was told what.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Core banking (both legacy estates)", "Migration mapping data", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Proactive migration readiness outreach",
        friction: "Customers who need to act - re-register a direct debit, replace a card, re-enrol in internet banking - are identified in reports but never contacted individually, so problems surface after cutover.",
        outcome: "Targeted outbound conversations before cutover that walk each customer through their specific required actions, suppressing the post-cutover complaint wave.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Migration mapping data", "Direct debit registry", "Campaign management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Routine procedure guidance for remote branch customers",
        friction: "Elderly customers in mountain communities phone the branch to ask what a procedure requires, and a wrong answer costs them an hour of travel each way.",
        outcome: "Reliable, patient, document-level guidance available all day, with appointment booking so the trip only happens once.",
        channels: ["Voice", "LINE"],
        systems: ["Branch reservation system", "Procedure knowledge base", "Core banking"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A retail banking app and internet-banking service for the combining customer bases",
        "A LINE official account used for notices and campaign communication",
        "A central customer service line supplemented by branch telephone handling",
        "Mail-based migration notification infrastructure for the integration programme",
      ],
      gaps: [
        "No conversational channel that can tell a customer what specifically changes for their accounts",
        "Direct-debit and card re-registration cannot be initiated by the customer without staff help",
        "No after-hours support during the migration period when anxiety is highest",
        "Elderly customers in remote areas have no alternative to a long branch trip for document-bearing procedures",
      ],
    },
    risks: [
      "Migration communications carry legal weight - misinforming a customer about account changes or direct debits creates real financial harm and regulatory exposure, so grounding must be in the actual migration record.",
      "APPI consent handling must cover the merged entity's use of customer data from both legacy banks.",
      "Elderly-customer protection practice requires the agent to recognise confusion and escalate rather than proceed, particularly around card and internet-banking re-registration where fraud risk spikes.",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 5.8,
      automationRate: 0.45,
      basis: "Seller assumptions from prefectural retail scale plus an assumed merger-driven uplift; validate with the integration programme's own forecast call volumes in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent dedicated to the Nagano Bank account-migration inquiry line, grounded in the migration mapping data so each customer hears what changes for their specific accounts, with escalation to integration-desk staff.",
    expansion: [
      "Add proactive pre-cutover outbound to customers with required actions outstanding",
      "Convert the migration agent into a permanent retail procedure and appointment line after integration",
      "Extend to SME customers for facility and settlement-account migration questions",
    ],
    stakeholders: [
      "Head of the Nagano Bank Integration Programme",
      "General Manager, Retail Business Division",
      "Head of Customer Service Centre",
      "Head of IT Planning",
      "Compliance and Customer Protection lead",
    ],
    discovery: [
      "What call volume does the integration programme forecast around each migration milestone, and against what staffed capacity?",
      "Is the migration mapping available as queryable data, or only as batch mail-merge output?",
      "What proportion of the combined customer base has active internet banking that must be re-registered?",
      "Who owns customer communications for the integration - the programme office or the retail division?",
    ],
    flowTemplate: "onboarding",
    scenario: "A Nagano Bank customer learns exactly which of her direct debits move, which card is replaced and what she must do before cutover, in one call she does not have to repeat.",
  },

  "bank-of-kyoto": {
    operatingContext:
      "The Bank of Kyoto is the leading regional bank of Kyoto Prefecture, lending to a distinctive local economy of precision manufacturers, traditional craft and textile businesses, universities and tourism-dependent enterprises. It is known for an unusually conservative balance sheet, including a large long-held portfolio of local corporate equities, and for a management style that changes slowly and deliberately. Its retail depositors are typical of Kyoto - long-tenured, older, and strongly attached to a specific branch and a specific counter relationship. Servicing therefore runs on branch visits and branch telephone calls, with the app and internet banking used by a younger minority and almost never for procedures involving seals, certificates or inheritance.",
    strategicPressure: [
      { text: "The bank's conservative, relationship-led operating culture means service quality expectations are high and any automated voice would be judged against a very polished human standard.", kind: "verified" },
      { text: "Kyoto's older depositor base generates a steady and rising flow of seal, address and inheritance procedures that are labour-intensive and cannot be moved to an app.", kind: "inference" },
      { text: "Local craft and small manufacturing customers are themselves shrinking through succession failure, which pushes business-succession consultation - a long, sensitive conversation - up the bank's agenda.", kind: "inference" },
      { text: "A conservative board is more likely to approve a narrow, provably-bounded automation of routine procedures than a broad customer-experience programme, so scope discipline is the deal strategy.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Bank of Kyoto operates on vendor-supplied core banking and channel systems with an internal IT function oriented to planning and control. Nothing in its public posture suggests software development ambition, and a conservative institution of this size would not fund speculative platform engineering.",
    whyNotBuild:
      "The bank's entire competitive position rests on local relationships and balance-sheet strength, neither of which is improved by owning speech models. It has no route to recruit conversational-AI engineers into Kyoto against Tokyo and Osaka technology employers, and no appetite to run a permanent model-evaluation function.",
    workflows: [
      {
        name: "Address, seal and passbook procedure guidance",
        friction: "Long-tenured customers phone their branch to ask what a seal change or passbook reissue requires; the answer depends on which staff member picks up, and customers arrive under-documented.",
        outcome: "One consistent, keigo-correct answer per procedure with a confirmed document checklist, ending repeat visits and branch phone interruptions.",
        channels: ["Voice", "LINE"],
        systems: ["Core banking", "Procedure knowledge base", "Branch reservation system"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Inheritance and business-succession first consultation intake",
        friction: "Succession inquiries - personal and business - arrive as unstructured calls to a branch, are relayed imperfectly to a specialist, and lose days before the first real conversation.",
        outcome: "Structured intake that captures the situation and required documents once and books the specialist consultation with a complete brief already prepared.",
        channels: ["Voice", "LINE"],
        systems: ["CRM", "Succession case system", "Branch reservation system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Time-deposit and product-inquiry handling",
        friction: "Rate and maturity questions from elderly depositors take long, repetitive calls that occupy branch staff during the busiest counter hours.",
        outcome: "Deposit-product questions answered from the approved product master at any hour, with genuine consultation demand routed to a booked appointment.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Core deposit system", "Product master", "CRM"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A retail banking app and internet-banking service used mainly by younger customers",
        "A LINE official account for notices and simple inquiry entry",
        "Branch-level telephone handling as the primary servicing channel",
        "A modest central customer service desk with limited hours",
      ],
      gaps: [
        "No consistent answer source for procedure requirements across branches",
        "Succession inquiries have no structured intake before a specialist is involved",
        "Nothing available outside branch hours beyond a card-blocking line",
        "No record of what a customer was told by phone, so disputes cannot be resolved",
      ],
    },
    risks: [
      "A conservative institution will demand demonstrable control over every automated utterance before allowing it on a customer line, extending approval timelines.",
      "APPI and banking secrecy rules govern recording and processing of the family and business information disclosed in succession conversations.",
      "Elderly-customer protection expectations require confusion and coercion detection with mandatory human escalation.",
    ],
    economics: {
      volumeMonthly: 85000,
      costPerInteraction: 6,
      automationRate: 0.45,
      basis: "Seller assumptions from prefectural retail scale and Japanese service-labour cost; the bank's own branch-level call statistics should replace these in discovery.",
    },
    pilotScope:
      "A tightly-scoped Japanese-language voice agent covering the six highest-volume account procedures for retail customers, with document-checklist confirmation and branch-appointment booking, deployed on a single Kyoto city branch cluster with full transcript review.",
    expansion: [
      "Add inheritance and business-succession intake with specialist brief generation",
      "Extend across the full branch network and onto LINE",
      "Introduce proactive maturity and document-chasing outbound",
    ],
    stakeholders: [
      "General Manager, Retail Business Division",
      "Head of Branch Administration",
      "Head of IT Planning",
      "Head of Trust and Succession Business",
      "Compliance Officer",
    ],
    discovery: [
      "Are branch telephone volumes measured at all today, or only central desk volumes?",
      "What is the internal approval path for putting any automated voice on a customer-facing line?",
      "How many succession and inheritance inquiries reach the bank per month, and how are they currently triaged?",
      "What would the board need to see in a pilot before approving network-wide rollout?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A long-standing Kyoto depositor confirms exactly what her seal change requires and books the counter appointment without her branch manager leaving the floor.",
  },

  "hokuhoku-fg": {
    operatingContext:
      "Hokuhoku Financial Group brings together the Hokuriku Bank, headquartered in Toyama and covering the Hokuriku coast, and the Hokkaido Bank in Sapporo - two banks separated by hundreds of kilometres, serving regions with severe depopulation, heavy winters and long distances between settlements. The customer base is elderly retail depositors plus regional SMEs in construction, agriculture, fisheries and tourism. Branch networks in both regions are thin relative to geography, so the telephone is not a convenience channel but often the only practical one, particularly in winter. Digital adoption exists through bank apps and internet banking but is concentrated among younger urban customers in Toyama, Kanazawa and Sapporo.",
    strategicPressure: [
      { text: "Both operating regions are among Japan's fastest-depopulating, which shrinks the deposit base and the local labour pool for contact-centre work at the same time.", kind: "verified" },
      { text: "Winter weather in Hokuriku and Hokkaido makes branch visits genuinely difficult for elderly customers for months at a time, concentrating demand on the phone channel seasonally.", kind: "inference" },
      { text: "Operating two geographically separate banks means duplicated servicing infrastructure that a single conversational layer could consolidate without merging the brands.", kind: "inference" },
      { text: "Contact-centre recruitment in Toyama and regional Hokkaido is structurally constrained, so elastic non-human capacity solves a problem the group cannot hire out of at any wage.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The group runs vendor-delivered core banking across two bank entities and has no software engineering organisation. Its scale is split between two regions, which further undermines any internal build case - the fixed cost of a platform would be carried by half the volume of a single-region bank of comparable size.",
    whyNotBuild:
      "A build would need speech tuned for Hokuriku and Hokkaido speech patterns, keigo synthesis, telephony integration across two separate estates, orchestration into two core systems and a permanent evaluation team - staffed from labour markets that already cannot fill the group's existing service roles. The constraint that makes the project necessary is the same one that makes a build impossible.",
    workflows: [
      {
        name: "Centralised overflow and after-hours servicing for both banks",
        friction: "Each bank runs its own limited-hours desk; overflow calls are simply lost, and winter demand spikes have no capacity behind them.",
        outcome: "One always-on line serving both brands with brand-correct greeting and disclosure, absorbing overflow and out-of-hours demand across two time-separated regions.",
        channels: ["Voice", "LINE"],
        systems: ["Core banking (both banks)", "CRM", "Branch reservation systems"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Winter-season procedure and access support",
        friction: "Snow closures and travel difficulty mean elderly customers cannot reach branches for weeks, and there is no non-branch route for procedures that need documents.",
        outcome: "Procedures pre-processed by phone with document submission guidance and postal or agent-visit alternatives arranged, so servicing does not stop with the weather.",
        channels: ["Voice", "LINE", "Postal follow-up"],
        systems: ["Core banking", "Document management", "Branch reservation system"],
        value: 2,
        complexity: 2,
      },
      {
        name: "SME status and procedure inquiries across dispersed branches",
        friction: "Regional business customers phone thinly-staffed branches for facility, remittance and document questions, and often reach nobody able to answer.",
        outcome: "Grounded, consistent answers on facility and settlement status from any branch number, at any hour, without the relationship manager.",
        channels: ["Voice", "Email"],
        systems: ["Loan management system", "Remittance system", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Separate banking apps and internet-banking services for each bank brand",
        "LINE official accounts used for notices and campaigns",
        "Limited-hours customer service desks operated per bank",
        "A branch and ATM network stretched thinly across two very large geographies",
      ],
      gaps: [
        "No shared servicing capability across the two banks despite common ownership",
        "No servicing at all outside desk hours in either region",
        "Elderly customers cut off by winter conditions have no remote procedure path",
        "Business customers cannot self-serve any status information",
      ],
    },
    risks: [
      "Two bank brands with separate customer bases and system estates require strict per-brand data segregation under banking secrecy and APPI.",
      "Regional dialect and elderly speech patterns in both Hokuriku and Hokkaido demand explicit recognition testing before any production exposure.",
      "Disaster and heavy-snow events create demand spikes where automated handling must degrade safely and escalate rather than give wrong answers about branch or ATM availability.",
    ],
    economics: {
      volumeMonthly: 110000,
      costPerInteraction: 5.5,
      automationRate: 0.45,
      basis: "Seller assumptions covering both bank brands at regional retail scale; validate against each bank's measured call volumes and current outsourcing arrangements in discovery.",
    },
    pilotScope:
      "A single Japanese-language voice agent serving both Hokuriku Bank and Hokkaido Bank numbers with brand-specific greeting and disclosure, handling the top retail procedures and appointment booking outside staffed hours.",
    expansion: [
      "Add winter-season procedure pre-processing with document and postal-alternative guidance",
      "Introduce SME facility and settlement status inquiries with read-only grounding",
      "Extend to proactive outbound for maturity, dormancy and document chasing across both banks",
    ],
    stakeholders: [
      "Group Head of Business Planning",
      "General Manager, Retail Division, Hokuriku Bank",
      "General Manager, Retail Division, Hokkaido Bank",
      "Group Head of IT Planning",
      "Compliance Officer",
    ],
    discovery: [
      "Do the two banks share any contact-centre infrastructure today, or is everything duplicated?",
      "What happens to calls arriving outside desk hours in each region, and how many are there?",
      "How does servicing demand change during heavy-snow periods, and is that measured?",
      "Would the holding company sponsor a single deployment serving both brands, or must each bank buy separately?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Toyama customer snowed in for a week completes her pension-account procedure by phone and has the documents posted to her, without a branch visit.",
  },

  "mebuki-fg": {
    operatingContext:
      "Mebuki Financial Group is the northern-Kanto banking group formed from the Joyo Bank in Ibaraki and the Ashikaga Bank in Tochigi, with a combined footprint covering two prefectures that age faster than the national average while sitting close enough to Tokyo for their working-age population to commute away. The group's lending mixes agriculture, regional manufacturing and construction SMEs with conventional retail mortgages and deposits. It has consciously pursued group-level shared services since the merger, running common functions across the two banks while keeping both brands in market. Customers reach the banks through separate apps and branch telephone numbers, with a shared-service centre handling parts of the load behind the scenes.",
    strategicPressure: [
      { text: "The group was formed explicitly to capture scale benefits across two regional banks, so any proposal that consolidates duplicated servicing effort aligns directly with the stated merger rationale.", kind: "verified" },
      { text: "Ibaraki and Tochigi lose working-age residents to Tokyo while retaining an ageing depositor base, producing a widening gap between the customers who generate calls and the workers available to answer them.", kind: "inference" },
      { text: "Maintaining two brands means duplicated telephone estates, scripts and training, which raises the marginal cost of every servicing improvement the group makes.", kind: "inference" },
      { text: "A single conversational layer serving both brands is a visible, quantifiable synergy of the type the group is under investor pressure to keep demonstrating.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Mebuki's IT effort since the merger has been absorbed by system integration and shared-services consolidation using external vendors. The group has no product-engineering organisation, and its strategic playbook is explicitly about consolidating and buying shared capability rather than building bespoke technology per bank.",
    whyNotBuild:
      "The group's IT capacity is committed to core-system and shared-service integration. Building Japanese speech, keigo-safe generation, dual-brand telephony integration, core orchestration and evaluation would compete for exactly the scarce internal resources the merger was meant to free up - and would deliver nothing that differentiates the group in northern-Kanto lending.",
    workflows: [
      {
        name: "Shared inbound servicing line across Joyo and Ashikaga",
        friction: "Both banks staff their own routine-procedure handling with separate scripts, so the same address-change question is answered twice over by two teams with different quality.",
        outcome: "One agent serving both brands with correct brand identity and disclosure, giving consistent answers and eliminating duplicated handling capacity.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Core banking (both banks)", "Shared CRM", "Branch reservation systems"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Pension and elderly-customer account servicing",
        friction: "Pension-receipt account questions, passbook problems and family-representative requests come from customers who need patience and repetition, occupying counter and phone staff disproportionately.",
        outcome: "Unhurried, consistent handling at any volume, with capacity-concern and fraud-suspicion signals escalated to trained staff immediately.",
        channels: ["Voice", "LINE"],
        systems: ["Core deposit system", "Customer information file", "Fraud case system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Mortgage servicing and prepayment inquiries",
        friction: "Rate-type and prepayment questions route to a specialist desk with narrow hours, so commuting borrowers - the group's core mortgage segment - cannot reach it.",
        outcome: "Evening and weekend answers with policy-correct simulations, with only genuine restructuring cases escalated.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Loan servicing system", "Rate master", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Separate banking apps and internet-banking services for the Joyo and Ashikaga brands",
        "LINE official accounts used for notification and campaign delivery",
        "Group shared-service functions covering back-office operations across both banks",
        "Branch and central telephone handling per bank brand",
      ],
      gaps: [
        "Servicing is not shared even though back-office functions are",
        "Commuting mortgage customers cannot reach a specialist outside working hours",
        "Family members acting for elderly account holders have no guided compliant route",
        "No context carries between the app and the phone call that follows a failed app session",
      ],
    },
    risks: [
      "Dual-brand operation requires strict separation of customer data between the two banks under banking secrecy rules, even where the agent is shared.",
      "APPI consent and retention design must cover a shared processing layer serving two licensed banks.",
      "Pension-account and elderly-customer interactions attract heightened supervisory expectations around fraud detection and human escalation.",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 5.8,
      automationRate: 0.5,
      basis: "Seller assumptions across the combined retail base at Japanese contact-centre cost; validate with each bank's measured volumes and the shared-services cost allocation model in discovery.",
    },
    pilotScope:
      "One Japanese-language voice agent serving both Joyo and Ashikaga retail service numbers with brand-correct identity, handling the top ten account procedures with core-banking grounding and shared-service escalation.",
    expansion: [
      "Add pension and elderly-customer servicing with capacity-signal escalation",
      "Extend to mortgage servicing inquiries with evening and weekend coverage",
      "Introduce proactive outbound for maturity, dormancy and document completion across both brands",
    ],
    stakeholders: [
      "Head of Group Business Planning",
      "General Manager, Retail Division, Joyo Bank",
      "General Manager, Retail Division, Ashikaga Bank",
      "Head of Group Shared Services",
      "Group Compliance Officer",
    ],
    discovery: [
      "Which servicing functions are already shared between the two banks, and which are still duplicated?",
      "What are the measured inbound volumes per brand, and how much is handled at branch level?",
      "What are the hours of the mortgage specialist desk, and what is its abandon rate?",
      "How does the group currently quantify merger synergies, and would servicing automation count?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An Ashikaga pension customer and a Joyo mortgage borrower are both served correctly by the same deployment, each hearing their own bank's name and wording.",
  },

  "nishi-nippon-fh": {
    operatingContext:
      "Nishi-Nippon Financial Holdings is the Fukuoka-headquartered group built around the Nishi-Nippon City Bank, the second major banking franchise in northern Kyushu, competing directly against a larger local rival for the same retail depositors and SME borrowers. Its customers are Fukuoka and northern Kyushu households - skewing older outside the city centre - and small businesses in retail, construction and services. Because it operates at smaller scale than its principal competitor, every unit of servicing cost matters more, and it has less room to absorb rising labour cost. Retail servicing runs through branch telephone lines and a modest customer centre, with app and internet banking used mainly for balance checking rather than procedures.",
    strategicPressure: [
      { text: "The group competes head-on in Fukuoka against a larger regional banking group, which makes cost-income discipline a survival issue rather than an optimisation exercise.", kind: "inference" },
      { text: "Fukuoka has one of Japan's densest concentrations of outsourced contact-centre operations, which bids up the wage rate for exactly the staff the bank needs.", kind: "verified" },
      { text: "Outside Fukuoka city, the northern Kyushu customer base ages quickly, so procedure and inheritance call volume rises while branch counters are consolidated.", kind: "inference" },
      { text: "A smaller balance sheet means the bank is more likely to buy a proven capability at a bounded price than to fund an open-ended internal programme.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The group runs vendor-supplied core and channel systems with an IT function focused on planning and vendor management. It has neither the scale nor the engineering base to fund a conversational platform, and its competitive urgency favours capability that can be deployed in a quarter rather than built over years.",
    whyNotBuild:
      "Every yen spent building infrastructure is a yen not spent competing for Fukuoka deposits and SME lending. The bank cannot recruit speech and conversational engineers against Fukuoka's own BPO and technology employers, and would still need a permanent evaluation function afterwards. The build case fails on cost, talent and time simultaneously.",
    workflows: [
      {
        name: "Routine retail servicing call automation",
        friction: "Address changes, card reissues and passbook questions consume branch and centre staff hours that the bank cannot afford relative to its larger competitor.",
        outcome: "The highest-volume procedure calls handled without human time, converting directly into a measurable cost-income improvement.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Core banking", "Card management", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Elderly-customer procedure and inheritance intake",
        friction: "Inheritance and elderly-account procedures are long, document-heavy calls handled inconsistently across branches, with families contacted repeatedly for the same information.",
        outcome: "One structured intake that captures the case fully and hands a complete brief to the succession desk, reducing family contacts and specialist prep time.",
        channels: ["Voice", "LINE"],
        systems: ["Succession case system", "Core deposit system", "Document management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "SME procedure and status support for local businesses",
        friction: "Small business owners call for remittance cut-offs, document requirements and facility status and are passed between staff who each check different systems.",
        outcome: "Immediate, grounded operational answers for business customers, protecting relationship-manager time for revenue-generating work.",
        channels: ["Voice", "Email", "LINE"],
        systems: ["Loan management", "Remittance system", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A retail banking app and internet-banking service",
        "A LINE official account used for notices and light inquiry entry",
        "A customer service centre with limited hours plus branch telephone handling",
        "An IVR front-ending the main service numbers",
      ],
      gaps: [
        "No procedure can be completed end-to-end without staff involvement",
        "No servicing capacity outside centre hours",
        "Inheritance intake is unstructured and inconsistent across branches",
        "Business customers have no self-service status route",
      ],
    },
    risks: [
      "Competitive sensitivity in Fukuoka means any service-quality regression from automation would be immediately visible to a larger local rival.",
      "APPI governs voice recording, consent and retention for both retail and business customer conversations.",
      "Elderly-customer protection expectations require detection of confusion or third-party pressure with mandatory human escalation.",
    ],
    economics: {
      volumeMonthly: 95000,
      costPerInteraction: 5.6,
      automationRate: 0.5,
      basis: "Seller assumptions from northern Kyushu retail scale and Fukuoka contact-centre wage levels; validate with the bank's own volume and cost-per-call figures in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent on the retail service number covering the eight highest-volume account procedures with core-banking grounding, targeted at a measurable reduction in staffed handling minutes within one quarter.",
    expansion: [
      "Add elderly-customer and inheritance intake with succession-desk brief generation",
      "Extend to SME procedure and status support",
      "Introduce LINE as a parallel channel and add proactive outbound for maturity and dormancy",
    ],
    stakeholders: [
      "Head of Retail Banking Division, Nishi-Nippon City Bank",
      "General Manager, Customer Service Centre",
      "Head of Business Planning",
      "Head of IT Planning",
      "Compliance Officer",
    ],
    discovery: [
      "What is the current fully-loaded cost per handled call, and how does it trend against wage inflation in Fukuoka?",
      "How much servicing is outsourced, and to which partners under what contract terms?",
      "What is the contact-centre attrition rate, and how long does it take to fill a vacancy?",
      "Which procedure intents dominate inbound volume by count and by handling time?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Kitakyushu customer completes a card reissue and address change in one evening call, on a line that used to be closed after five.",
  },

  "yamaguchi-fg": {
    operatingContext:
      "Yamaguchi Financial Group operates three separate bank brands - the Yamaguchi Bank in Yamaguchi, Momiji Bank in Hiroshima and the Kitakyushu Bank in northern Kyushu - across a corridor spanning western Honshu and the Kanmon strait. Maintaining three licences and three brand identities in adjacent markets gives the group local presence but leaves it with fragmented, sub-scale operations behind the scenes. Its customers are regional households, a substantial elderly depositor population in the more rural Yamaguchi and Shimane-adjacent areas, and SMEs in manufacturing, marine industries and services. Servicing runs through each brand's branch telephone estate with limited centralisation, meaning three sets of scripts and three sets of staffing for essentially identical work.",
    strategicPressure: [
      { text: "Three bank brands operating in a contiguous corridor means triplicated servicing infrastructure for one underlying customer proposition, which is a structural cost disadvantage.", kind: "verified" },
      { text: "Yamaguchi and the surrounding western Honshu prefectures are among the most rapidly depopulating in Japan, shrinking both the deposit base and the local hiring pool.", kind: "inference" },
      { text: "The group has been through governance and strategy turbulence in recent years, which raises the value of visible, quantifiable efficiency wins that do not require structural change.", kind: "inference" },
      { text: "One conversational platform deployed across three brands produces a synergy that would otherwise require a legally complex bank merger to obtain.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The group runs vendor-delivered core systems across three banks with no product-engineering capability. The fragmentation that makes a shared conversational layer valuable is exactly what makes an internal build impossible - no single brand has the volume to justify the fixed cost, and the group has no mechanism to build once for three licensed entities.",
    whyNotBuild:
      "A build would require the group to stand up speech, dialogue, telephony and evaluation disciplines and then integrate them into three separate system estates. It cannot recruit that capability into Yamaguchi or Hiroshima, cannot justify the fixed cost against fragmented volume, and would take years to reach what a bought platform delivers in a quarter.",
    workflows: [
      {
        name: "Cross-brand shared inbound servicing",
        friction: "The same account procedure is handled by three different teams with three different scripts and three different quality levels, none of them at efficient scale.",
        outcome: "One deployment answering for all three brands with correct brand identity, giving consistent quality and one set of operating costs.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Core banking (three estates)", "CRM", "Branch reservation systems"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Rural elderly-customer procedure support",
        friction: "Customers in depopulated inland areas travel long distances to consolidated branches, often arriving without required documents because phone guidance was inconsistent.",
        outcome: "Reliable document guidance and appointment booking that makes each trip count, with proactive reminders before the visit.",
        channels: ["Voice", "LINE"],
        systems: ["Branch reservation system", "Procedure knowledge base", "Core banking"],
        value: 2,
        complexity: 1,
      },
      {
        name: "Regional SME operational-inquiry handling",
        friction: "Marine, manufacturing and construction SMEs phone branches for remittance, facility and document questions, reaching staff who must check multiple systems while another customer waits at the counter.",
        outcome: "Business operational questions answered immediately and identically across all three brands, releasing branch staff for counter and relationship work.",
        channels: ["Voice", "Email", "LINE"],
        systems: ["Loan management", "Remittance system", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Three separate bank apps and internet-banking services, one per brand",
        "LINE official accounts used for notices per brand",
        "Branch-level telephone handling as the dominant servicing channel",
        "A regional group planning function coordinating across the three banks",
      ],
      gaps: [
        "No shared servicing capability across three brands despite common ownership",
        "No consistent procedure answer across brands or branches",
        "No servicing outside branch hours in any brand",
        "Business customers have no self-service operational status route",
      ],
    },
    risks: [
      "Three licensed banks require strict data segregation under banking secrecy rules, so a shared agent needs provable per-brand isolation.",
      "APPI consent design must be executed separately for each bank's customer base even where the processing layer is common.",
      "Rural western Honshu speech patterns among elderly speakers require explicit recognition testing before production exposure.",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 5.5,
      automationRate: 0.45,
      basis: "Seller assumptions across the three brands at regional retail scale; validate with each bank's measured volumes and the group's per-brand cost allocation in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent deployed on the Yamaguchi Bank retail service number for the top account procedures, architected from the outset for brand-parameterised reuse on Momiji and Kitakyushu numbers.",
    expansion: [
      "Extend the same deployment to Momiji Bank and Kitakyushu Bank with per-brand identity and disclosure",
      "Add rural procedure guidance with appointment booking and pre-visit reminders",
      "Introduce SME operational-inquiry handling across all three brands",
    ],
    stakeholders: [
      "Head of Group Business Planning",
      "General Manager, Retail Division, Yamaguchi Bank",
      "Head of Customer Service Operations",
      "Group Head of IT Planning",
      "Group Compliance Officer",
    ],
    discovery: [
      "Do the three banks share any contact-centre operation today, or is everything brand-separate?",
      "Can the holding company contract centrally on behalf of all three licensed banks?",
      "What are the measured call volumes per brand, and how much sits at branch level?",
      "Which procedures differ materially between the three banks, and which are identical?",
    ],
    flowTemplate: "inbound-service",
    scenario: "One deployment answers a Yamaguchi Bank pension question and a Momiji Bank card reissue, each in the right brand voice, from the same platform.",
  },

  "hirogin-holdings": {
    operatingContext:
      "Hirogin Holdings is the group built around the Hiroshima Bank, the principal regional bank of the Chugoku region, with a footprint centred on Hiroshima city and extending across western Honshu. Beyond banking the group has deliberately diversified into securities, leasing, guarantee services and regional advisory work, so a single customer relationship can touch several entities. Its retail base combines an urban Hiroshima population with rural coastal and island communities that are ageing rapidly, and its business lending is weighted toward the region's automotive-supply-chain and shipbuilding manufacturers. Customers reach the group through the bank app, a LINE official account and predominantly through branch and central telephone lines, with each group company running its own thin service desk.",
    strategicPressure: [
      { text: "The group has explicitly pursued diversification into non-banking financial services, which multiplies customer-servicing lines without a corresponding multiplication of service staff.", kind: "verified" },
      { text: "Hiroshima's regional economy is exposed to automotive supply-chain transition, making corporate advisory and consultation demand - the group's growth area - dependent on specialist time that routine calls currently consume.", kind: "inference" },
      { text: "Island and coastal communities in the footprint age faster and travel less, so branch consolidation there converts directly into telephone servicing demand.", kind: "inference" },
      { text: "The group would value cross-entity referral capture more than pure cost reduction, because its strategy depends on selling more than deposits to each relationship.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Hirogin's technology comes from banking-system vendors and integrators, and its group companies are small enough that each buys its own operational tooling. The group's investment thesis is regional business diversification, not software - there is no engineering organisation and no public evidence of speech or conversational-model capability anywhere in the group.",
    whyNotBuild:
      "Building would mean funding speech, dialogue, telephony and evaluation teams from a Hiroshima labour market that cannot supply them, to serve fragmented volume spread across several small entities. The group's own diversification logic argues for buying operational capability and spending management attention on regional client relationships instead.",
    workflows: [
      {
        name: "Retail inbound servicing and consultation booking",
        friction: "Routine procedure calls and genuine consultation requests arrive in the same queue, so advisory demand waits behind address changes and consultants sit idle at the wrong times.",
        outcome: "Routine calls resolved automatically while consultation demand is triaged and booked directly into specialist calendars with context captured.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Core banking", "Branch reservation system", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Cross-entity referral capture across bank, securities and leasing",
        friction: "A customer asking about asset management or equipment leasing is handed another phone number, and the referral is lost between entities with no tracking.",
        outcome: "Intent recognised and the customer booked directly with the right group company, with the referral recorded and measurable end to end.",
        channels: ["Voice", "LINE"],
        systems: ["CRM", "Group entity booking systems", "Customer information file"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Island and coastal community procedure support",
        friction: "Customers in island and remote coastal communities face ferry-dependent branch access, and inconsistent phone guidance turns a wrong document into a lost day.",
        outcome: "Accurate document guidance and booked appointments that make each difficult journey productive, with postal alternatives arranged where possible.",
        channels: ["Voice", "LINE", "Postal follow-up"],
        systems: ["Branch reservation system", "Procedure knowledge base", "Document management"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A retail banking app and internet-banking service",
        "A LINE official account used for notification and campaign delivery",
        "A central customer service desk plus branch telephone handling",
        "Separate customer desks in the securities, leasing and guarantee subsidiaries",
      ],
      gaps: [
        "Referrals between group companies depend on the customer making a second call",
        "Consultation booking has no pre-qualification, so specialist time is wasted on fact-gathering",
        "No servicing available outside branch and desk hours",
        "Island and remote customers have no remote procedure completion route",
      ],
    },
    risks: [
      "Cross-entity referral flows involve transferring customer information between a bank and its securities subsidiary, which is tightly regulated under firewall rules and requires explicit consent.",
      "Securities-related discussion triggers suitability and explanation obligations, so the agent must route rather than advise.",
      "APPI applies to voice recordings and to any profile data used to personalise responses across group entities.",
    ],
    economics: {
      volumeMonthly: 100000,
      costPerInteraction: 5.8,
      automationRate: 0.5,
      basis: "Seller assumptions from Chugoku regional retail scale and Japanese contact-centre cost; validate against the group's measured volumes across bank and subsidiary desks in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent on the Hiroshima Bank retail service number handling top account procedures plus pre-qualified consultation booking into branch specialist calendars, with strict routing-only behaviour on any investment topic.",
    expansion: [
      "Add compliant cross-entity referral capture into securities and leasing booking",
      "Extend to island and remote-community procedure support with postal alternatives",
      "Introduce proactive outbound for maturity, review and appointment reminders",
    ],
    stakeholders: [
      "Head of Retail Business Division, Hiroshima Bank",
      "Head of Group Strategy / Business Development",
      "General Manager, Customer Service Centre",
      "Group Head of IT Planning",
      "Group Compliance Officer",
    ],
    discovery: [
      "How many customer referrals between group entities are initiated per month, and how many complete?",
      "Which entity owns contact-centre strategy - the bank or the holding company?",
      "What is the current specialist utilisation rate for booked consultations?",
      "What firewall constraints apply to sharing customer context between the bank and the securities arm?",
    ],
    flowTemplate: "appointments",
    scenario: "An island customer books a ferry-day branch appointment with the right documents confirmed and an asset-management consultation queued behind it.",
  },

  "gunma-bank": {
    operatingContext:
      "The Gunma Bank is the principal regional bank of Gunma Prefecture, lending into a manufacturing-heavy local economy anchored by automotive and machinery plants and their supplier networks around Ota, Isesaki and Takasaki. That industrial base has made Gunma home to one of Japan's largest concentrations of Brazilian-Japanese and other foreign resident workers, particularly in Oizumi, where a meaningful share of retail banking customers are not first-language Japanese speakers. Alongside that, the bank serves a conventional and rapidly ageing prefectural depositor base whose servicing behaviour is entirely branch- and phone-led. The result is an unusual dual demand: keigo-quality Japanese for elderly customers and genuine second-language servicing for foreign residents, both delivered today by a branch network that can staff neither reliably.",
    strategicPressure: [
      { text: "Gunma hosts one of Japan's largest resident Brazilian communities, concentrated around Oizumi and the Ota manufacturing belt, giving the bank a foreign-resident customer segment far larger than typical regional banks.", kind: "verified" },
      { text: "Foreign-resident customers need account opening, remittance and procedure support in Portuguese or simple Japanese, which the branch network can only offer at specific locations on specific days.", kind: "inference" },
      { text: "The prefecture's ageing Japanese depositor base simultaneously drives inheritance and procedure call volume that competes for the same branch staff.", kind: "inference" },
      { text: "International remittance servicing for foreign workers is both a compliance-sensitive and a commercially attractive workflow, making it the highest-value candidate for language-capable automation.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Gunma Bank's systems are vendor-delivered and its IT function is oriented to planning and integration. Multilingual conversational capability in particular is not something a prefectural bank builds - it is precisely the capability that a multilingual platform provides out of the box and that no amount of local hiring can replicate.",
    whyNotBuild:
      "The bank cannot hire Portuguese-speaking banking staff at scale in Gunma, let alone build multilingual speech recognition and synthesis. Adding Japanese keigo quality, telephony integration, core orchestration and permanent evaluation on top makes an internal build implausible on every axis - talent, cost and time.",
    workflows: [
      {
        name: "Multilingual retail servicing for foreign residents",
        friction: "Portuguese-speaking and other foreign-resident customers can only get language support at specific branches on specific days, so procedures wait or are attempted through a family member interpreting.",
        outcome: "Account, card and procedure questions answered in the customer's language at any hour, with accurate document requirements and appointment booking.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Core banking", "Procedure knowledge base", "Branch reservation system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "International remittance guidance and pre-checks",
        friction: "Remittance requests from foreign workers fail at the counter on documentation, purpose-of-transfer wording or beneficiary detail errors, wasting both the customer's trip and staff compliance time.",
        outcome: "Requirements explained and pre-validated in the customer's language before the visit, cutting failed remittance attempts and counter rework.",
        channels: ["Voice", "LINE"],
        systems: ["Remittance system", "AML screening interface", "Branch reservation system"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Elderly-customer Japanese procedure and inheritance guidance",
        friction: "The same branch staff handling multilingual demand also carry long, patient procedure and inheritance calls from elderly Japanese depositors, and both segments queue behind each other.",
        outcome: "Both demand streams served in parallel by one deployment, each in the right language and register, releasing branch staff entirely.",
        channels: ["Voice", "LINE"],
        systems: ["Core banking", "Succession case system", "CRM"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A retail banking app and internet-banking service",
        "A LINE official account used for notices and simple inquiries",
        "Designated branches offering foreign-language counter support on limited schedules",
        "Branch and central telephone handling for retail servicing",
      ],
      gaps: [
        "Foreign-language support exists only at specific branches at specific times",
        "No self-service route for remittance requirements in any non-Japanese language",
        "Nothing available outside branch hours for either language segment",
        "Elderly and foreign-resident demand compete for the same staffed capacity",
      ],
    },
    risks: [
      "International remittance touches AML and sanctions screening obligations, so the agent must be strictly bounded to guidance and pre-checks with all decisions remaining with compliance staff.",
      "APPI plus foreign-resident data handling requires careful consent design where the customer's first language is not Japanese.",
      "Providing financial information in a second language raises explanation-obligation questions if the customer later disputes what they understood - transcripts and language records become essential.",
    ],
    economics: {
      volumeMonthly: 85000,
      costPerInteraction: 6,
      automationRate: 0.5,
      basis: "Seller assumptions from prefectural retail scale with a multilingual segment uplift; validate with the bank's measured foreign-language servicing demand and total call volumes in discovery.",
    },
    pilotScope:
      "A Japanese and Portuguese voice and LINE agent on a dedicated foreign-resident servicing line covering account procedures and remittance requirement guidance for the Ota and Oizumi branch cluster, with escalation to bilingual staff.",
    expansion: [
      "Add remittance pre-validation with AML-safe read-only screening context",
      "Extend Japanese-language coverage to elderly procedure and inheritance intake network-wide",
      "Add further languages reflecting the prefecture's other foreign-worker communities",
    ],
    stakeholders: [
      "Head of Retail Business Division",
      "General Manager, Customer Service Centre",
      "Head of International Business / Remittance Operations",
      "Head of IT Planning",
      "Head of Compliance and AML",
    ],
    discovery: [
      "How many customer interactions per month require non-Japanese language support, and which languages?",
      "What proportion of counter remittance attempts fail on documentation, and what does that cost in staff time?",
      "Which branches currently offer foreign-language support, and how is that staffed?",
      "What compliance constraints apply to explaining remittance requirements through an automated channel?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An Oizumi factory worker confirms in Portuguese exactly what documents his monthly remittance needs and books the counter slot, in one evening call.",
  },

  "iyogin-holdings": {
    operatingContext:
      "Iyogin Holdings is the group built around the Iyo Bank, the dominant financial institution of Ehime Prefecture and one of the strongest banks in Shikoku, a region losing population faster than almost anywhere else in Japan. Its lending base includes marine and pulp industry, agriculture, shipping-related businesses in the Imabari cluster, and regional services. Its retail depositors are heavily weighted toward older residents in towns and villages where branch consolidation has already gone a long way, meaning the telephone has absorbed servicing volume that used to be handled at a counter. The bank runs an app and LINE presence and belongs to inter-bank cooperation frameworks, but its everyday servicing reality is branch phones answered by staff who are simultaneously serving customers in front of them.",
    strategicPressure: [
      { text: "Shikoku, and Ehime within it, is among the fastest-depopulating and fastest-ageing regions in Japan, which compresses both the customer base and the available service workforce.", kind: "verified" },
      { text: "Branch consolidation in Ehime is further advanced than in most prefectures, so displaced servicing has already landed on telephone channels that were never resourced for it.", kind: "inference" },
      { text: "Local hiring for contact-centre roles in Matsuyama and smaller Ehime towns competes with every other employer for a shrinking working-age pool, making elastic capacity structurally attractive.", kind: "inference" },
      { text: "As a financially strong regional bank the group can fund a well-scoped efficiency investment, but will require clear evidence of service-quality preservation for its elderly customers.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Iyo Bank's systems come from external banking-system vendors and it participates in shared inter-bank infrastructure rather than building independently. There is no product-engineering organisation and no public evidence of conversational-AI capability; the bank's differentiation is regional relationship depth, not technology.",
    whyNotBuild:
      "The bank's binding constraint is the same shrinking Ehime labour pool that would have to supply any internal engineering team. Speech recognition for elderly Shikoku speakers, keigo synthesis, telephony integration, core orchestration and permanent evaluation cannot be assembled locally at any realistic cost, while a bought platform arrives already able to do all five.",
    workflows: [
      {
        name: "Post-consolidation procedure guidance and appointment booking",
        friction: "Customers whose local branch has closed phone the surviving branch for procedure guidance, get inconsistent answers, and make long trips that fail on missing documents.",
        outcome: "Consistent document-level guidance with a booked slot at the correct branch, so a single trip completes the procedure.",
        channels: ["Voice", "LINE"],
        systems: ["Branch reservation system", "Procedure knowledge base", "Core banking"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Elderly-customer account and pension servicing",
        friction: "Pension-receipt questions, passbook problems and family-representative requests take long, patient calls that branch staff cannot give while a counter queue builds.",
        outcome: "Unhurried handling at unlimited concurrency with immediate escalation where capacity concerns or fraud indicators appear.",
        channels: ["Voice", "LINE"],
        systems: ["Core deposit system", "Customer information file", "Fraud case system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Regional SME operational-inquiry handling",
        friction: "Imabari shipping and Ehime manufacturing customers call branches for facility, remittance and document questions and reach staff who must interrupt counter work to check systems.",
        outcome: "Business operational questions answered from systems of record at any hour, protecting relationship-manager and branch staff time.",
        channels: ["Voice", "Email", "LINE"],
        systems: ["Loan management", "Remittance system", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A retail banking app and internet-banking service",
        "A LINE official account used for notices and light servicing entry",
        "A central customer service desk with limited hours plus branch telephone handling",
        "Participation in shared inter-bank system infrastructure",
      ],
      gaps: [
        "No consistent procedure guidance across a consolidated branch network",
        "No servicing capacity outside branch hours for a population that increasingly cannot travel",
        "Family representatives of elderly customers have no compliant guided route",
        "Business customers cannot obtain any status information without a human",
      ],
    },
    risks: [
      "Elderly-customer protection expectations are elevated in a region with this age profile, requiring reliable detection of confusion or third-party pressure and mandatory escalation.",
      "APPI governs voice recording, consent and retention, including recordings of family members speaking on behalf of account holders.",
      "Ehime and wider Shikoku speech patterns among elderly speakers require explicit recognition testing before any production exposure.",
    ],
    economics: {
      volumeMonthly: 75000,
      costPerInteraction: 5.8,
      automationRate: 0.45,
      basis: "Seller assumptions from Ehime retail scale and Japanese contact-centre labour cost; validate against the bank's measured branch and centre call volumes in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent handling procedure guidance and branch-appointment booking for retail customers across the consolidated Ehime branch network, with document-checklist confirmation and staffed-desk escalation.",
    expansion: [
      "Add elderly-customer and pension servicing with capacity-signal escalation",
      "Extend to LINE and add proactive appointment reminders and document chasing",
      "Introduce SME operational-inquiry handling for the Imabari and Matsuyama business base",
    ],
    stakeholders: [
      "Head of Retail Business Division, Iyo Bank",
      "General Manager, Customer Service Centre",
      "Head of Branch Network Strategy",
      "Head of IT Planning",
      "Compliance and Customer Protection lead",
    ],
    discovery: [
      "How many branches have closed in the last five years, and where did that servicing volume go?",
      "What share of inbound calls is handled at branch level rather than a central desk?",
      "What is the contact-centre vacancy and attrition picture in Matsuyama today?",
      "What evidence of service-quality preservation would the bank need before allowing automated voice with elderly customers?",
    ],
    flowTemplate: "appointments",
    scenario: "An elderly Uwajima customer books one branch trip with every required document confirmed, instead of three failed attempts across two months.",
  },

  "meiji-yasuda-life": {
    operatingContext:
      "Meiji Yasuda Life is one of Japan's largest mutual life insurers, formed from the merger of Meiji Life and Yasuda Mutual Life, with a policy book measured in the tens of millions of individual and group contracts and a substantial corporate-group insurance franchise alongside its individual business. Distribution runs through a large tied salesforce of life-plan advisors who visit customers and workplaces, supported by regional service offices and a central policyholder contact centre. Because the policyholder base has aged with the company, a growing share of servicing contacts are procedural and emotional rather than commercial - beneficiary changes, address updates after a move into care, surrender questions, and claims that arrive at the worst moment in a family's life. Public visibility is high through long-running national sponsorship activity, which raises the reputational cost of any servicing interaction that feels impersonal.",
    strategicPressure: [
      { text: "Meiji Yasuda operates as a mutual company owned by its policyholders, which makes policyholder service quality a governance obligation rather than only a commercial choice.", kind: "verified" },
      { text: "The tied salesforce that historically absorbed servicing questions in person is shrinking and ageing, so contacts that used to be handled at the kitchen table now arrive at a contact centre.", kind: "inference" },
      { text: "An ageing in-force book mechanically increases servicing and claims contacts per policy each year, independent of new sales performance.", kind: "inference" },
      { text: "Family members increasingly call on behalf of policyholders who cannot manage their own affairs, creating an authentication and consent problem the current phone process handles case by case.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Meiji Yasuda's systems are delivered by large Japanese system integrators, and its technology function is organised around policy administration, actuarial systems and regulatory reporting. Mutual governance makes large speculative technology investment difficult to justify to a policyholder-representative board, and there is no public evidence of internal speech or conversational-model engineering.",
    whyNotBuild:
      "The insurer would have to build Japanese speech recognition that works with elderly and hard-of-hearing callers, keigo synthesis a mutual insurer is prepared to use with a bereaved family, telephony integration into a legacy contact-centre estate, orchestration into policy administration and claims systems, and a permanent evaluation function proving every automated statement was compliant. None of that improves underwriting, asset management or distribution - the three things that actually determine a life insurer's results.",
    workflows: [
      {
        name: "Policy servicing for elderly policyholders",
        friction: "Address changes, beneficiary updates and premium-payment-method changes require long, patient calls; volume peaks are unpredictable and the queue holds customers who find waiting physically difficult.",
        outcome: "Routine policy procedures completed or fully pre-processed in-conversation at any volume, with document requirements confirmed before anything is posted.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Policy administration system", "Customer master", "Document management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Claims status and payment inquiries",
        friction: "Once a claim is filed, the claimant calls repeatedly for status, and each call is a human reading the same screen - status inquiries crowd out first-notice intake capacity.",
        outcome: "Proactive status updates plus instant grounded answers on demand, suppressing repeat status calls and freeing assessors and intake staff.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Claims administration system", "Payment system", "CRM"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Family-representative intake and authorisation guidance",
        friction: "A son or daughter calling about a parent's policy hits an authentication wall, is told to send forms, and the process stalls for weeks at a point of real family stress.",
        outcome: "A structured, compliant path that explains exactly what authority evidence is needed, captures the case, and routes to the right specialist with everything documented.",
        channels: ["Voice", "LINE"],
        systems: ["Policy administration system", "Customer master", "Case management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A policyholder web portal and smartphone app for policy confirmation and some procedures",
        "A LINE official account used for notices and simple servicing entry",
        "A central policyholder contact centre with substantial outsourced capacity",
        "A regional service-office network supporting the tied salesforce",
      ],
      gaps: [
        "Most document-bearing policy procedures still cannot be completed without paper and a human",
        "No servicing capability outside contact-centre hours for a population that is often home all day",
        "Family representatives have no guided compliant route to act for a policyholder",
        "Claim status must be pulled by the claimant rather than pushed by the insurer",
      ],
    },
    risks: [
      "Insurance Business Act solicitation rules mean any automated statement that could be construed as product recommendation requires strict boundaries and audit evidence.",
      "APPI treats health and medical information disclosed during claims conversations as requiring particular care in consent, recording and retention.",
      "Policyholder-protection expectations for elderly and possibly cognitively impaired customers require detection and human escalation rather than automated completion.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 6.5,
      automationRate: 0.5,
      basis: "Seller assumptions derived from in-force policy scale and Japanese insurance contact-centre labour cost; replace with the insurer's actual contact volumes and cost per call in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent on the policyholder servicing line handling the top procedural intents plus claim-status inquiries, grounded in policy administration and claims systems, with warm transfer to the existing centre for anything requiring judgement.",
    expansion: [
      "Add proactive claim-status push and document-chasing outbound",
      "Introduce family-representative intake with compliant authority guidance",
      "Extend to LINE and to group-insurance member servicing for corporate clients",
    ],
    stakeholders: [
      "General Manager, Policyholder Service Division",
      "Head of Contact Centre Operations",
      "Head of Claims Administration",
      "Chief Information Officer / Head of Systems Planning",
      "Head of Compliance and Customer Protection",
    ],
    discovery: [
      "Which servicing intents dominate the policyholder contact centre by call count and by handling time?",
      "What share of inbound volume is claim-status inquiry that could be suppressed by proactive updates?",
      "How much of the contact centre is outsourced, and when do those contracts renew?",
      "What is the current process when a family member calls about a policyholder who cannot manage their own affairs?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A daughter updates her mother's registered address after a move into care and gets the beneficiary-change document list confirmed in the same call.",
  },

  "sumitomo-life": {
    operatingContext:
      "Sumitomo Life is one of Japan's four large mutual life insurers, distributing primarily through a tied salesforce that visits households and workplaces, supplemented by agency and bancassurance channels. It is distinguished from its mutual peers by the Vitality wellness-linked insurance programme it introduced in Japan in partnership with Discovery, which rewards policyholders for measured physical activity and therefore generates continuous digital engagement, app support questions and points or status disputes - an entirely different contact profile from traditional life insurance. The result is two coexisting servicing populations: younger, app-native Vitality members with frequent low-value queries, and an older traditional policy book with infrequent but long, procedural and emotionally weighted contacts. Both currently land in centrally-run contact operations under the same hiring constraints.",
    strategicPressure: [
      { text: "Sumitomo Life launched the Vitality wellness-linked insurance programme in Japan with Discovery, deliberately building an ongoing digital relationship rather than a once-a-year premium notice.", kind: "verified" },
      { text: "Vitality generates recurring support contacts - device linking, activity-point disputes, status and reward questions - at a volume and unit value that cannot economically be handled by trained insurance staff.", kind: "inference" },
      { text: "The traditional policy book continues to age, so the insurer must simultaneously scale a high-frequency low-value contact stream and a low-frequency high-sensitivity one.", kind: "inference" },
      { text: "Because Vitality's commercial logic depends on sustained engagement, unresolved support friction translates directly into programme lapse and lost differentiation.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Sumitomo Life's technology is delivered through major Japanese integrators and, for Vitality, through a licensed international programme platform. The insurer's demonstrated pattern is to acquire capability through partnership rather than to build it - Vitality itself is the clearest evidence - and there is no internal speech or conversational-AI engineering practice.",
    whyNotBuild:
      "The Vitality partnership shows the insurer's own strategy: buy a proven capability and integrate it rather than construct it. Building Japanese speech, keigo-safe generation, telephony, orchestration into both policy administration and the wellness platform, and a permanent evaluation function would take years and produce nothing a licensed partner platform cannot supply faster.",
    workflows: [
      {
        name: "Vitality member support and engagement recovery",
        friction: "Device-linking failures, missing activity points and status-level questions arrive constantly through app and phone; each is trivial individually but collectively consumes trained staff, and unresolved cases cause members to disengage.",
        outcome: "Instant resolution of the common wellness-programme issues in-channel, with disengaging members proactively re-engaged before their status drops.",
        channels: ["Voice", "LINE", "Mobile app", "Web"],
        systems: ["Vitality programme platform", "Policy administration", "Device integration services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Traditional policy servicing and procedure guidance",
        friction: "Address, beneficiary and premium-method changes for older policyholders require long calls and posted forms, and are handled by the same operations group now absorbing wellness-programme volume.",
        outcome: "Procedural contacts handled with unlimited patience and consistent keigo, with documents confirmed before dispatch and human escalation only where judgement is needed.",
        channels: ["Voice", "LINE"],
        systems: ["Policy administration system", "Document management", "Customer master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Premium-payment recovery and lapse prevention",
        friction: "Failed premium collections are followed up by letter and sporadic calls, so avoidable lapses occur among customers who simply changed bank account or overlooked a notice.",
        outcome: "Timely, policy-bounded conversations that fix the payment method in-channel, converting administrative lapses into retained policies.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Premium collection system", "Policy administration", "Payment services"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "The Vitality wellness programme with its own member app and status mechanics",
        "A policyholder web portal and app for traditional policy confirmation",
        "A LINE official account used for notices and campaign delivery",
        "A central policyholder contact centre with outsourced overflow capacity",
      ],
      gaps: [
        "Wellness-programme support and policy servicing are not joined, so a member with both needs calls twice",
        "No out-of-hours support for a programme whose activity data is generated in the evening and at weekends",
        "Premium-payment failures are not recovered conversationally, only by letter",
        "Document-bearing policy procedures still cannot be completed digitally end to end",
      ],
    },
    risks: [
      "Health and activity data inside a wellness programme is sensitive under APPI and requires explicit purpose limitation, especially where it is combined with insurance policy data.",
      "Insurance Business Act solicitation boundaries constrain how far an automated agent can go when a member asks about coverage or upgrade options.",
      "Rewards and status decisions carry contractual weight, so the agent must explain and escalate rather than adjudicate disputes.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 6,
      automationRate: 0.6,
      basis: "Seller assumptions combining traditional policy servicing with high-frequency wellness-programme support; validate against the insurer's own split of Vitality versus policy contacts in discovery.",
    },
    pilotScope:
      "A Japanese-language voice, LINE and in-app agent handling the top Vitality member support intents - device linking, activity points, status questions - with escalation into the existing support team and full resolution logging.",
    expansion: [
      "Extend to traditional policy procedure servicing for the ageing in-force book",
      "Add premium-payment recovery and lapse-prevention outbound",
      "Introduce proactive engagement outreach to members whose activity has stalled",
    ],
    stakeholders: [
      "Head of the Vitality Business / Wellness Programme",
      "General Manager, Policyholder Service Division",
      "Head of Contact Centre Operations",
      "Chief Information Officer",
      "Head of Compliance and Customer Protection",
    ],
    discovery: [
      "Are Vitality support and traditional policy servicing run by the same operations group and the same vendors?",
      "What are the top five reasons Vitality members contact support, and how many contacts per member per year?",
      "What is the measured relationship between unresolved support friction and programme disengagement?",
      "How many policies lapse for purely administrative payment reasons each year?",
    ],
    flowTemplate: "retention",
    scenario: "A Vitality member whose wearable stopped syncing gets it fixed and her missing activity points restored in one evening conversation, before her status drops.",
  },

  "aflac-japan": {
    operatingContext:
      "Aflac Life Insurance Japan is the country's leading provider of cancer and medical supplemental insurance, with an in-force block covering a very large share of Japanese households and a distribution model built on independent agencies, corporate agencies and a long-standing partnership with the Japan Post network. Its products are deliberately simple and claim-frequent by design - a cancer diagnosis, a hospitalisation, a surgery - which means the claims function is not an occasional event but the core customer-facing operation. Policyholders acquired over decades are now well into old age, so both claimants and the family members calling for them are typically elderly, distressed and unfamiliar with digital channels. Contact runs through a claims and policyholder centre plus agency-mediated support, with digital claim submission available but far from universal.",
    strategicPressure: [
      { text: "Aflac's Japan business is the dominant part of its overall operation and is built on cancer and medical products distributed widely, including through the Japan Post network.", kind: "verified" },
      { text: "Claim-frequent supplemental products mean servicing volume scales with the policy book's age, so contact volume rises structurally even in a flat sales year.", kind: "inference" },
      { text: "First-notice claim conversations happen at moments of medical crisis, where handling quality directly determines whether the customer renews, recommends, or complains publicly.", kind: "inference" },
      { text: "Agency-mediated distribution means the insurer often lacks a direct digital relationship with the policyholder, leaving the telephone as the only reliable contact channel at claim time.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The Japan entity operates established insurance administration systems delivered and maintained with external partners, and its technology narrative concerns digital claim submission and agency tooling rather than platform engineering. Conversational AI for Japanese-language claims intake is not a capability the entity has shown any sign of developing internally.",
    whyNotBuild:
      "Claims intake in Japanese from elderly, distressed callers is the single hardest voice problem in the market - it requires speech robustness, emotional register, keigo discipline and provable compliance simultaneously. Building that plus telephony, claims-system orchestration and permanent evaluation would divert the insurer from what actually drives its results: product design, agency distribution and claims-payment speed.",
    workflows: [
      {
        name: "Claim first-notice intake for medical and cancer policies",
        friction: "A newly diagnosed policyholder or their spouse calls, waits in a queue, then narrates a medical history to an agent who types it into a form - and is told which documents to obtain, verbally, once.",
        outcome: "Structured, unhurried intake at any hour that captures the claim facts, confirms coverage, and issues a precise document checklist the family can refer back to.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Claims administration system", "Policy administration", "Document management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Claim status and document-completion follow-up",
        friction: "After filing, families call repeatedly for status and are chased by letter for missing documents, so claims sit incomplete for weeks with neither side informed.",
        outcome: "Proactive status updates and conversational document chasing that shortens claim cycle time and eliminates most status calls.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Claims administration system", "Document management", "Payment system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Agency and Japan Post channel support desk",
        friction: "Agency staff and postal counter staff phone the insurer to check coverage details, procedure requirements and claim status on behalf of customers, tying up specialist support lines.",
        outcome: "Channel partners get grounded product and case answers instantly, so counter conversations complete without a callback.",
        channels: ["Voice", "Web", "Email"],
        systems: ["Product knowledge base", "Policy administration", "Agency management system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A policyholder web service and digital claim submission route",
        "A large agency network plus the Japan Post distribution channel as customer touchpoints",
        "A claims and policyholder contact centre with outsourced capacity",
        "A LINE official account used for notices and light servicing entry",
      ],
      gaps: [
        "Claim intake outside centre hours has no path other than waiting until morning",
        "Document requirements are communicated verbally or by letter with no reliable reference for the family",
        "Status must be pulled by the claimant, not pushed by the insurer",
        "Agency and postal channel staff have no self-service route to case and coverage answers",
      ],
    },
    risks: [
      "Claims conversations capture health information, which APPI treats as requiring special care in consent, storage and access control.",
      "Insurance Business Act rules mean coverage explanations must be provably accurate and bounded, since a wrong statement at claim time creates both regulatory and reputational exposure.",
      "Distress and bereavement handling requires reliable detection and immediate human escalation - an agent that continues scripted questioning through a grief signal would be commercially catastrophic.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 6.8,
      automationRate: 0.45,
      basis: "Seller assumptions from in-force policy scale and claim-frequent product design at Japanese insurance contact-centre cost; validate with the insurer's claims and servicing contact statistics in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling claim status inquiries and document-completion follow-up for medical and cancer policies, grounded in the claims system, with all first-notice distress cases routed to human intake during the pilot.",
    expansion: [
      "Extend to structured first-notice claim intake with coverage verification and checklist issuance",
      "Add proactive status push and document chasing across the claims book",
      "Open an agency and Japan Post channel support line with product and case grounding",
    ],
    stakeholders: [
      "Head of Claims Division",
      "General Manager, Customer Service Centre",
      "Head of Agency and Channel Support",
      "Chief Information Officer, Japan",
      "Head of Compliance and Customer Protection",
    ],
    discovery: [
      "What proportion of claims-related contacts are status inquiries rather than new claim notifications?",
      "What is the average number of customer contacts per claim from first notice to payment?",
      "How many claims stall on missing documents, and how are customers chased today?",
      "What volume of support calls comes from agency and postal channel staff rather than policyholders?",
    ],
    flowTemplate: "claims",
    scenario: "A husband calling about his wife's cancer diagnosis gets her coverage confirmed and an exact document checklist, at nine in the evening, without repeating the diagnosis twice.",
  },

  "metlife-japan": {
    operatingContext:
      "MetLife Insurance Japan is one of the largest foreign-owned life insurers operating in the country, built on a long-established Japanese book and distributing through independent agencies, bancassurance partnerships with banks, and direct channels rather than a large tied salesforce. That distribution shape matters operationally: with no tied agent attached to most policies, servicing questions land directly on the insurer's contact centre rather than being absorbed by a visiting salesperson. A significant part of the book is foreign-currency-denominated savings and annuity product sold through bank counters, which generates a distinctive and demanding contact type - customers asking about exchange-rate effects, surrender values and maturity choices on products they bought from a bank teller years earlier. The insurer sits within a global group with common technology standards and centralised platform decisions.",
    strategicPressure: [
      { text: "MetLife's Japan business distributes heavily through agencies and bancassurance rather than a tied salesforce, so servicing demand concentrates on centralised contact operations.", kind: "verified" },
      { text: "Foreign-currency-denominated products sold through bank channels generate complex, anxiety-driven inquiries whenever exchange rates move sharply, producing unpredictable call spikes.", kind: "inference" },
      { text: "Customers who bought through a bank counter have no ongoing relationship with the insurer, so their first contact is often a confused call years after purchase.", kind: "inference" },
      { text: "Being part of a global group means platform selection may be influenced or constrained by a regional or global CX organisation rather than decided purely in Tokyo.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. As a subsidiary of a global insurance group, the Japan entity operates on group-standard technology with local integration, and its mandate is market execution rather than platform construction. Global groups in this position consistently buy CX platforms and localise them rather than funding country-level engineering.",
    whyNotBuild:
      "A country subsidiary has no charter to build core technology, and the Japanese-language requirements here - keigo register, elderly-caller speech robustness, financial explanation compliance - are precisely the parts a global platform team cannot deliver from outside Japan. Buying a Japanese-native conversational capability and integrating it locally is the only route that satisfies both group governance and local language quality.",
    workflows: [
      {
        name: "Bancassurance policy servicing and product explanation",
        friction: "Customers who bought a foreign-currency product at a bank counter call the insurer years later, cannot recall the product name, and need surrender value and maturity options explained from scratch.",
        outcome: "Policy identified from the caller, current values retrieved live, and options explained within strictly approved wording, with suitability discussions routed to licensed staff.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Policy administration system", "Valuation and rate services", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Rate-move inquiry surge absorption",
        friction: "Sharp currency moves generate call spikes the centre cannot staff for, so hold times blow out exactly when customers are most anxious and most likely to surrender.",
        outcome: "Elastic capacity absorbs the spike with consistent, compliant explanations, and genuine surrender intent is routed to retention specialists rather than lost in a queue.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Policy administration", "Valuation services", "Retention case system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Agency and bank-partner support desk",
        friction: "Bank and agency staff call the insurer to check product details and case status while a customer waits at their counter, and often have to promise a callback.",
        outcome: "Partner-facing grounded answers delivered in seconds, so bank counter conversations conclude on the spot and partner satisfaction improves.",
        channels: ["Voice", "Web", "Email"],
        systems: ["Product knowledge base", "Policy administration", "Partner management system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A policyholder web portal for policy confirmation and selected procedures",
        "Bancassurance and agency partner channels acting as the original customer touchpoint",
        "A central customer service centre in Japan with outsourced components",
        "Group-standard digital servicing tooling localised for the Japan market",
      ],
      gaps: [
        "Bancassurance customers have no direct digital relationship with the insurer",
        "No capacity elasticity when currency moves create inquiry spikes",
        "Surrender and maturity decisions cannot be explored self-service in any channel",
        "Bank and agency partners have no instant grounded answer source",
      ],
    },
    risks: [
      "Foreign-currency product explanations sit squarely inside suitability and explanation obligations, so automated wording must be pre-approved and every interaction retained.",
      "APPI plus group-level cross-border data governance both apply, and data residency for voice recordings must be settled before deployment.",
      "Any statement that could be read as advice on whether to surrender or hold creates regulatory exposure, so the boundary between explanation and recommendation must be enforced technically, not by training.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 6.5,
      automationRate: 0.5,
      basis: "Seller assumptions from the Japan in-force book and bancassurance servicing profile at local contact-centre cost; validate against the insurer's actual volumes and spike behaviour in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent on the policyholder servicing line handling policy identification, value and status inquiries for foreign-currency products with strictly bounded explanation wording and immediate routing of any surrender intent to licensed staff.",
    expansion: [
      "Add elastic spike absorption tied to currency-move triggers with proactive outbound reassurance",
      "Open a bank and agency partner support line with product and case grounding",
      "Extend to LINE and to proactive maturity and renewal conversations",
    ],
    stakeholders: [
      "Head of Customer Service, Japan",
      "Head of Bancassurance and Partner Distribution",
      "Chief Operations Officer, Japan",
      "Chief Information Officer, Japan / Regional CX lead",
      "Head of Compliance, Japan",
    ],
    discovery: [
      "Are contact-centre platform decisions made in Tokyo or by a regional or global CX organisation?",
      "How does call volume behave in the week after a sharp yen move, against staffed capacity?",
      "What proportion of the in-force book was sold through bank channels, and what is the servicing contact rate for those policies?",
      "Where must voice recordings be stored, and what group data-residency rules apply?",
    ],
    flowTemplate: "inbound-service",
    scenario: "After a sharp yen move, a bancassurance customer gets her foreign-currency policy value and maturity options explained clearly, without a forty-minute hold.",
  },

  "zurich-japan": {
    operatingContext:
      "Zurich's Japanese general-insurance operation is one of the country's established direct insurers, selling motor and related cover by telephone and web rather than through the agent and dealership networks that dominate Japanese non-life distribution. In a direct model the contact centre is not a cost centre attached to the business - it is the business: quotation, underwriting questions, policy issuance, mid-term changes, renewal and accident first notification all happen through the same channels. Its customers skew toward price-conscious drivers who chose to buy without an agent, but they still expect the accident line to answer instantly at three in the morning after a collision. That combination - commercially rational buyers and an unpredictable, safety-critical accident stream - defines the operating challenge.",
    strategicPressure: [
      { text: "Direct insurers compete on expense ratio because they have no agent commission to differentiate on, which makes cost per contact a first-order financial metric rather than an operational detail.", kind: "verified" },
      { text: "Accident first notification must be available continuously, so overnight and holiday staffing is carried as fixed cost against unpredictable and mostly low volume.", kind: "inference" },
      { text: "Renewal season concentrates policy-change and quotation calls into predictable peaks that a fixed human roster either overstaffs or fails.", kind: "inference" },
      { text: "Because the customer chose a direct insurer partly for convenience, a slow or clumsy telephone experience undermines the entire value proposition and drives switching at renewal.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The Japan operation runs on group and vendor-supplied insurance platforms with local configuration, and its competitive advantage is pricing, underwriting and marketing efficiency. There is no local engineering organisation building conversational technology, and group governance would favour a proven platform over country-level construction.",
    whyNotBuild:
      "A direct insurer's entire margin logic is spending less on distribution and servicing than agent-based competitors. Diverting capital into building Japanese speech, keigo synthesis, telephony and evaluation would directly contradict that logic, and the accident line's safety-critical nature means the quality bar is far above what a first internal build could reach.",
    workflows: [
      {
        name: "Renewal and mid-term policy-change handling",
        friction: "Renewal season floods the centre with coverage-change, vehicle-change and address-change calls that are individually simple but collectively determine the season's staffing cost.",
        outcome: "Standard changes and renewals handled conversationally end to end at any volume, with human agents reserved for genuine underwriting or pricing exceptions.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Policy administration", "Rating and quotation engine", "Payment services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "After-hours accident first notification",
        friction: "Overnight accident calls are handled by a thin roster or an answering service, so a shaken driver at a roadside gets a form-filling experience or a callback promise.",
        outcome: "Immediate, calm, structured first notification any hour with tow and assistance dispatch initiated and a human adjuster brought in for injury or complex cases.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Claims first-notice system", "Roadside assistance dispatch", "Policy administration"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Quotation follow-up and abandoned-application recovery",
        friction: "Web quotations abandoned mid-flow are followed up with email that is largely ignored, and outbound calling capacity is too small to work the list.",
        outcome: "Timely, consent-based conversational follow-up that answers the specific question that stalled the application and completes the sale in-channel.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Quotation engine", "Marketing automation", "Policy issuance"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A web quotation and self-service policy management portal",
        "A telephone sales and servicing centre as the primary distribution channel",
        "A 24-hour accident reception arrangement with roadside assistance partners",
        "A LINE official account used for notices and light servicing",
      ],
      gaps: [
        "Renewal-season capacity is fixed while demand is not",
        "Overnight accident reception quality depends on which thin-roster operator answers",
        "Abandoned web quotations are not recovered conversationally",
        "Nothing carries context between a failed web session and the phone call that follows",
      ],
    },
    risks: [
      "Accident first notification is safety-adjacent - injury, hazard or emotional distress signals must trigger immediate human takeover, with that behaviour provable to regulators.",
      "Insurance Business Act solicitation rules constrain automated quotation and coverage recommendation, so pricing conversations must stay within approved bounds.",
      "APPI applies to accident circumstance data, including any health information disclosed at first notice.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 6.2,
      automationRate: 0.55,
      basis: "Seller assumptions from a direct-model contact profile where the centre carries sales and servicing; validate against the insurer's actual call mix and renewal-peak staffing in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent handling renewal and mid-term policy changes across the renewal season peak, with live rating and policy-system integration and immediate transfer of any underwriting exception to a licensed agent.",
    expansion: [
      "Extend to after-hours accident first notification with assistance dispatch and mandatory human escalation rules",
      "Add abandoned-quotation recovery outbound on a consent basis",
      "Introduce LINE as a parallel servicing channel with session continuity from web",
    ],
    stakeholders: [
      "Head of Direct Business, Japan",
      "Head of Contact Centre Operations",
      "Head of Claims Operations",
      "Chief Information Officer, Japan",
      "Head of Compliance, Japan",
    ],
    discovery: [
      "What is the split of contact-centre volume between new-business, servicing and accident calls?",
      "How much does renewal-season peak staffing cost relative to baseline?",
      "How are overnight accident calls handled today, and what is the current answer-time distribution?",
      "What proportion of web quotations are abandoned, and what recovery activity exists?",
    ],
    flowTemplate: "retention",
    scenario: "A direct customer changes her vehicle and completes her renewal in one call during the March peak, without ever reaching a queue.",
  },

  "sony-assurance": {
    operatingContext:
      "Sony Assurance is a direct-model non-life insurer inside the Sony financial services group, best known in the Japanese motor market for usage-based pricing that reflects how far the customer actually drives, and for consistently strong customer-satisfaction standing in a category where most buyers shop on price. Like all direct insurers its distribution and servicing are the same operation: web and telephone quotation, policy issuance, mid-term changes, renewal, and a continuously staffed accident reception function. Its customer base skews toward comparison-shopping urban drivers who selected the brand deliberately, which raises expectations for both digital polish and telephone quality. The group context matters commercially - Sony's financial arm has real technology depth - but the insurance entity itself is an operations business, not an engineering one.",
    strategicPressure: [
      { text: "Sony Assurance built its position on mileage-linked motor pricing and a direct model, so its economics depend on keeping acquisition and servicing cost below agent-based competitors.", kind: "verified" },
      { text: "Its brand rests substantially on service-quality reputation, which means automation must demonstrably improve rather than degrade the telephone experience.", kind: "inference" },
      { text: "Continuous accident reception is a fixed staffing obligation whose cost is disproportionate to overnight volume, a classic case for elastic capacity with human escalation.", kind: "inference" },
      { text: "Group technology depth means any proposal will be assessed by people who could in principle build parts of it, so the pitch must be about workflow, Japanese voice quality and time to production rather than platform primitives.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. The insurance entity buys and configures operational technology rather than engineering it, but it sits in a group with genuine software capability, so a pure buy framing will be challenged. The right posture is to sell the insurance-specific conversational workflows, the Japanese voice quality bar and the evaluation discipline as an accelerator on top of whatever the group already runs.",
    whyNotBuild:
      "Even with group engineering nearby, the insurer would still need Japanese speech tuned for roadside and in-vehicle noise, keigo-correct synthesis, telephony integration into its accident-reception estate, orchestration into policy and claims systems, and a permanent evaluation function. That is a multi-year programme competing against a brand promise that has to be kept every day in the meantime.",
    workflows: [
      {
        name: "Accident first-notice reception",
        friction: "Accident calls arrive from roadsides with background noise and a distressed caller, and are handled by a continuously staffed team whose overnight utilisation is very low but whose cost is fixed.",
        outcome: "Immediate structured reception any hour with assistance dispatch triggered, and injury or complex cases handed to a human adjuster within seconds.",
        channels: ["Voice", "Mobile app", "LINE"],
        systems: ["Claims first-notice system", "Roadside assistance dispatch", "Policy administration"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Renewal and mileage-declaration handling",
        friction: "Usage-based pricing requires customers to confirm or adjust driving distance at renewal, generating a predictable seasonal wave of calls that are almost entirely deterministic.",
        outcome: "Mileage confirmation and renewal completed conversationally in seconds, with premium impact explained within approved wording.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Rating engine", "Policy administration", "Payment services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Mid-term change and quotation follow-up",
        friction: "Vehicle changes, driver additions and coverage adjustments require a call, and abandoned web quotations are followed up only by email.",
        outcome: "Changes executed in-conversation and stalled quotations recovered by a timely call that answers the specific blocking question.",
        channels: ["Voice", "Web", "SMS"],
        systems: ["Quotation engine", "Policy administration", "Marketing automation"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A polished web quotation and policy self-service experience",
        "A continuously operated accident reception function with assistance partners",
        "A telephone sales and servicing centre as a core distribution channel",
        "A mobile app and LINE presence for policy and claim touchpoints",
      ],
      gaps: [
        "Overnight accident reception quality varies with roster depth",
        "Renewal-season mileage confirmation still consumes human minutes at scale",
        "Abandoned quotations are not recovered by conversation",
        "No context continuity between the app, the web quote and the phone call",
      ],
    },
    risks: [
      "Accident reception is safety-adjacent: injury, fire or hazard indicators require instantaneous human takeover with auditable behaviour.",
      "Solicitation and premium-explanation rules bound what an automated agent may say about pricing changes arising from mileage declarations.",
      "A brand built on service-quality reputation makes any publicised automation failure disproportionately damaging, so evaluation coverage must be complete rather than sampled.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 6.5,
      automationRate: 0.5,
      basis: "Seller assumptions from a direct motor insurer's combined sales, servicing and accident contact profile; validate with the insurer's own call mix and overnight utilisation figures in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent handling renewal and mileage-declaration conversations through one renewal peak, with rating-engine integration, approved premium-explanation wording and full transcript evaluation.",
    expansion: [
      "Extend to mid-term policy changes and abandoned-quotation recovery",
      "Introduce accident first-notice reception for non-injury incidents with strict escalation rules",
      "Add app and LINE continuity so a stalled digital session resumes on the phone",
    ],
    stakeholders: [
      "Head of Direct Marketing and Sales",
      "Head of Customer Service Operations",
      "Head of Claims / Accident Reception",
      "Chief Information Officer",
      "Head of Compliance",
    ],
    discovery: [
      "How much conversational automation has the group already deployed, and where does it fall short?",
      "What is the overnight utilisation of the accident reception roster relative to its cost?",
      "What share of renewal-season calls are pure mileage confirmations?",
      "What service-quality evidence would be required before automated voice touches the accident line?",
    ],
    flowTemplate: "claims",
    scenario: "A driver in a minor night-time collision has the incident recorded and a tow dispatched in three minutes, with a human adjuster joining only because a passenger felt unwell.",
  },

  "fukoku-mutual-life": {
    operatingContext:
      "Fukoku Mutual Life is a mid-sized Japanese mutual life insurer distributing largely through a tied salesforce serving individual households and workplace channels, with a policy book that has aged alongside its customers. It became widely known internationally in 2017 for deploying IBM Watson technology to support claims assessment work - an unusually early and public commitment by a Japanese insurer to buying artificial intelligence to offset back-office labour. Operationally it runs a policyholder contact centre that handles procedure, premium and claims-related contacts at a scale that is meaningful for the company but sub-scale relative to the four largest mutuals, which makes fixed-cost technology investment harder to justify per contact. Its customers reach it by telephone, by post, and through a modest digital portal.",
    strategicPressure: [
      { text: "Fukoku Mutual Life publicly adopted IBM Watson technology to support claims assessment in 2017, which is rare and direct evidence that this management will buy AI to offset labour rather than build it.", kind: "verified" },
      { text: "As a mid-sized mutual, it faces the same ageing-book servicing cost curve as the largest insurers without their volume to spread fixed costs across.", kind: "inference" },
      { text: "The tied salesforce that historically absorbed policyholder questions in person is shrinking, pushing contacts into a contact centre that was not sized for them.", kind: "inference" },
      { text: "Having already justified one AI investment to a mutual board, the internal precedent and vocabulary for approving a second one exist - which materially shortens the sales cycle.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led, with unusually strong evidence. The company's own most prominent technology decision was to license an external AI capability and apply it to an internal workflow rather than construct anything. Its systems are integrator-delivered and it has no product-engineering organisation.",
    whyNotBuild:
      "The Watson precedent is the argument: when this insurer wanted AI it bought it. Nothing about its scale, talent access or governance has changed to make speech recognition, keigo synthesis, telephony integration, orchestration and continuous evaluation a sensible internal programme - and a mid-sized mutual has less fixed-cost headroom than the peers who also do not build.",
    workflows: [
      {
        name: "Claims status and assessment-progress inquiries",
        friction: "Claimants call repeatedly for progress on an assessment that is running behind, and each call occupies a person who could otherwise be assessing claims.",
        outcome: "Proactive progress updates plus instant grounded status answers, converting inbound status volume into assessor capacity.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Claims administration system", "Assessment workflow", "Payment system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Policy procedure and premium servicing",
        friction: "Address, beneficiary and premium-method changes arrive as long calls from elderly policyholders, with forms posted and often returned incomplete.",
        outcome: "Procedures explained precisely with the correct forms dispatched and completion chased, cutting the post-and-return failure cycle.",
        channels: ["Voice", "LINE", "Postal follow-up"],
        systems: ["Policy administration", "Document management", "Premium collection"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Salesforce support and case-status desk",
        friction: "Tied sales staff call head office to check policy details and case progress while sitting with a customer, occupying support staff and delaying the conversation in front of them.",
        outcome: "Sales staff get grounded case and product answers instantly by phone, closing conversations at the customer's table.",
        channels: ["Voice", "Mobile app", "Web"],
        systems: ["Policy administration", "Product knowledge base", "Sales support system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A policyholder web service for policy confirmation and selected procedures",
        "An AI-supported claims assessment capability already in production use",
        "A policyholder contact centre with outsourced components",
        "A tied salesforce acting as the primary in-person servicing channel",
      ],
      gaps: [
        "Claim progress is pulled by the claimant rather than pushed by the insurer",
        "Document-bearing procedures still depend on posting forms that frequently return incomplete",
        "No servicing available outside contact-centre hours",
        "Sales staff have no instant self-service route to case status while with a customer",
      ],
    },
    risks: [
      "Health information captured during claims-related conversations requires APPI special-care handling in consent, storage and access.",
      "Insurance Business Act solicitation rules bound what an automated agent may say when a policyholder asks about additional or replacement cover.",
      "Mutual governance means policyholder-facing changes need board-level comfort, so evaluation evidence must be presentable to non-technical directors.",
    ],
    economics: {
      volumeMonthly: 120000,
      costPerInteraction: 6.2,
      automationRate: 0.5,
      basis: "Seller assumptions from mid-sized mutual in-force scale at Japanese insurance contact-centre cost; validate against the insurer's own contact statistics in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling claim status and assessment-progress inquiries with live claims-system grounding and proactive status push, positioned as an extension of the insurer's existing AI-in-claims investment.",
    expansion: [
      "Extend to policy procedure and premium servicing with form dispatch and completion chasing",
      "Add a salesforce case-status support line",
      "Introduce proactive premium-failure recovery and lapse-prevention outbound",
    ],
    stakeholders: [
      "General Manager, Claims Division",
      "Head of Policyholder Service Centre",
      "Head of Sales Administration",
      "Chief Information Officer",
      "Head of Compliance",
    ],
    discovery: [
      "What became of the earlier claims-AI deployment, and who inside the company owns its outcome?",
      "What share of claims-related calls are progress inquiries rather than new notifications?",
      "How many posted procedure forms are returned incomplete, and what does that rework cost?",
      "What is the board's approval path for a policyholder-facing AI deployment?",
    ],
    flowTemplate: "claims",
    scenario: "A policyholder waiting on a hospitalisation claim is told the assessment stage and expected timing before he picks up the phone, and stops calling.",
  },

  "taiyo-life": {
    operatingContext:
      "Taiyo Life, part of T&D Holdings, has deliberately specialised in the senior and household market, designing products and a distribution model around older customers - including in-home visits by sales staff and cover aimed at the health and care needs of later life. Its policyholder base is therefore among the oldest in the Japanese life industry by design, not by accident of ageing. That shapes every servicing interaction: callers may be hard of hearing, may need information repeated, and are frequently not the policyholder at all but a son, daughter or care manager acting on their behalf. The company has also positioned itself around cognitive-decline-related protection and support services, which makes the handling of confused or impaired callers a live product and compliance question rather than an edge case.",
    strategicPressure: [
      { text: "Taiyo Life targets the senior and household segment explicitly, with products and services oriented to the health and care concerns of older customers.", kind: "verified" },
      { text: "A policyholder base concentrated in later life means a rising proportion of contacts come from family members or carers, requiring authority verification the current phone process handles ad hoc.", kind: "inference" },
      { text: "Cognitive decline among policyholders creates a servicing obligation - recognising when a caller cannot make an informed decision and stopping - that human agents perform inconsistently and cannot evidence.", kind: "inference" },
      { text: "Because slow, patient, repeated explanation is intrinsic to this customer base, average handling times are structurally high and cannot be cut by pressuring agents.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Taiyo Life operates on group and integrator-delivered insurance systems, with technology decisions made at T&D group level around administration and distribution rather than customer-facing AI. There is no engineering organisation and no public evidence of speech or dialogue capability.",
    whyNotBuild:
      "The hardest requirement here - reliably recognising confusion, hearing difficulty or third-party pressure in elderly Japanese speech and escalating correctly - is a specialist speech and evaluation problem no insurer solves internally. Adding keigo synthesis, telephony and orchestration makes an internal build implausible, while the compliance benefit of a consistent, fully-evaluated agent is exactly what this customer base needs.",
    workflows: [
      {
        name: "Senior policyholder servicing with patience by design",
        friction: "Calls from elderly policyholders take much longer than industry average because information must be repeated and confirmed, so handling-time targets and service quality are in permanent conflict.",
        outcome: "Unhurried, consistently paced conversations at unlimited concurrency, with repetition and confirmation built in rather than traded off against queue length.",
        channels: ["Voice", "Postal follow-up"],
        systems: ["Policy administration", "Customer master", "Document management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Family-representative and carer authorisation handling",
        friction: "A daughter or care manager calls about a parent's policy, faces an authentication wall, is told to send documents, and the family gives up or escalates as a complaint.",
        outcome: "A clear, compliant path that explains exactly what authority evidence is required, captures the case, and routes it with everything documented for the specialist.",
        channels: ["Voice", "LINE", "Postal follow-up"],
        systems: ["Policy administration", "Case management", "Document management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Claim intake for hospitalisation and care events",
        friction: "Claims are triggered by hospitalisation or a move into care, so the caller is usually mid-crisis and the intake is done by whoever is available, with variable completeness.",
        outcome: "Structured intake that gathers what the assessor needs the first time and issues a precise document checklist to the family.",
        channels: ["Voice", "Postal follow-up", "LINE"],
        systems: ["Claims administration", "Policy administration", "Document management"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A sales model built on in-person visits to older customers at home",
        "A policyholder contact centre trained for elderly-customer handling",
        "A policyholder web service used mainly by family members rather than policyholders",
        "Product and service offerings oriented to health and later-life care needs",
      ],
      gaps: [
        "No consistent, evidenced process for recognising cognitive impairment during a call",
        "Family representatives have no guided route to establish authority to act",
        "No servicing capacity outside centre hours, when carers are often free to call",
        "Document-bearing procedures depend on postal cycles with no completion chasing",
      ],
    },
    risks: [
      "Elderly-policyholder protection expectations require demonstrable detection of confusion or third-party pressure with mandatory human escalation, and the evidence must be reviewable.",
      "APPI special-care rules apply to the health and care information disclosed in these conversations, including by carers rather than the policyholder.",
      "Any solicitation-adjacent statement to a customer whose decision-making capacity is uncertain carries acute regulatory and reputational exposure.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 6.5,
      automationRate: 0.4,
      basis: "Seller assumptions from a senior-focused in-force book with structurally long handling times; validate with the insurer's actual average handling time and contact mix in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent on the senior policyholder servicing line handling routine procedure guidance at a deliberately slow, confirming pace, with explicit confusion-signal detection that escalates to trained human staff and logs every escalation.",
    expansion: [
      "Add family-representative and carer authorisation guidance with case capture",
      "Extend to hospitalisation and care-event claim intake with checklist issuance",
      "Introduce proactive document-chasing and procedure-completion outbound",
    ],
    stakeholders: [
      "General Manager, Policyholder Service Division",
      "Head of Contact Centre Operations",
      "Head of Claims Administration",
      "Head of Customer Protection / Elderly Customer Policy",
      "Chief Information Officer",
    ],
    discovery: [
      "What is the current policy and process when a family member calls on behalf of an elderly policyholder?",
      "How is cognitive impairment recognised and recorded today, and by whom?",
      "What is average handling time on the senior servicing line versus the industry benchmark?",
      "What proportion of contacts come from someone other than the policyholder?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A care manager calling for an 88-year-old policyholder learns exactly what authority documents are needed and has the case opened before she hangs up.",
  },

  "daido-life": {
    operatingContext:
      "Daido Life, part of T&D Holdings, is the Japanese life insurer specialised in protection cover for small and medium-sized business owners - keyman cover, business-continuity protection and owner retirement provision - rather than mass-market household insurance. Its distribution is distinctive and durable: long-standing relationships with tax-accountant networks and small-business owner associations, whose members introduce and service policies alongside their accounting work. That means a large share of servicing contacts come not from the insured owner but from a tax accountant's office staff asking procedural questions on a client's behalf, during business hours, with a precise and repetitive intent set - premium treatment, policy value for accounting purposes, procedure documents, and cover changes tied to a company's circumstances.",
    strategicPressure: [
      { text: "Daido Life's distribution is built on tax-accountant and small-business-owner association channels rather than a mass consumer salesforce, which concentrates servicing demand on intermediary professionals.", kind: "verified" },
      { text: "Japan's SME succession crisis - owners retiring without successors - directly drives policy changes, surrenders and succession-related inquiries across Daido's core book.", kind: "verified" },
      { text: "Intermediary callers ask a narrow, highly repetitive set of technical questions, which is an unusually favourable profile for automation compared with consumer servicing.", kind: "inference" },
      { text: "Because the accountant is the relationship owner, slow or inconsistent answers to their office staff damage the channel relationship more than they damage the end customer relationship.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Daido Life runs group and integrator-delivered insurance administration systems, with T&D group technology decisions focused on core administration rather than conversational capability. There is no product-engineering organisation in the insurer.",
    whyNotBuild:
      "The insurer's advantage is a defensible distribution relationship with the accountant profession, not software. Building speech, keigo generation, telephony, policy-system orchestration and evaluation would consume years and produce a capability that a bought platform delivers in a quarter, while the channel relationship it is meant to protect degrades in the meantime.",
    workflows: [
      {
        name: "Intermediary procedure and policy-detail desk",
        friction: "Tax-accountant office staff phone the insurer for policy values, premium treatment and procedure requirements on behalf of client companies, and queue behind consumer-style calls for answers that are entirely deterministic.",
        outcome: "Instant grounded answers to the repetitive technical questions, so accountant offices resolve client matters in one call.",
        channels: ["Voice", "Web", "Email"],
        systems: ["Policy administration", "Product and tax-treatment knowledge base", "Agency management system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Business-owner policy change and succession inquiries",
        friction: "Ownership transfer, retirement and business succession trigger complex policy changes that start as a vague phone question and take several handoffs before reaching the right specialist.",
        outcome: "Structured triage that identifies the situation, gathers the company and policy facts, and books the right specialist with a complete brief.",
        channels: ["Voice", "Email", "LINE"],
        systems: ["Policy administration", "Case management", "CRM"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Procedure document request and completion chasing",
        friction: "Forms are requested by phone, posted, and frequently returned incomplete or unsigned, with no proactive follow-up until a renewal or premium event surfaces the problem.",
        outcome: "Correct forms dispatched immediately with requirements confirmed, and outstanding documents chased conversationally until the procedure closes.",
        channels: ["Voice", "Postal follow-up", "Email"],
        systems: ["Document management", "Policy administration", "Workflow system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Deep distribution relationships with tax-accountant networks and business-owner associations",
        "An intermediary-facing web service for policy and case information",
        "A policyholder and agency contact centre operating in business hours",
        "Product materials oriented to SME accounting and tax treatment",
      ],
      gaps: [
        "Intermediary staff cannot get technical answers without a queued phone call",
        "Succession-related inquiries have no structured triage before reaching a specialist",
        "Procedure documents are posted with no proactive completion chasing",
        "No servicing capacity outside business hours for owners who work them",
      ],
    },
    risks: [
      "Statements touching tax treatment of premiums carry professional and regulatory sensitivity, so the agent must retrieve approved material rather than reason about tax positions.",
      "APPI and confidentiality obligations apply where an intermediary is calling about a third-party company's policy, requiring verified authority.",
      "Insurance Business Act solicitation rules bound any conversation that shades from procedure into recommending cover changes.",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 6,
      automationRate: 0.55,
      basis: "Seller assumptions from an SME-focused in-force book with heavy intermediary contact; validate with the insurer's split between intermediary and direct policyholder contacts in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent on the intermediary support line answering the highest-frequency policy-detail and procedure questions from tax-accountant offices, grounded in policy administration and approved product material, with authority verification and specialist transfer.",
    expansion: [
      "Add business-owner succession and policy-change triage with specialist briefing",
      "Introduce document dispatch and conversational completion chasing",
      "Extend to direct owner servicing outside business hours",
    ],
    stakeholders: [
      "Head of Agency and Channel Administration",
      "General Manager, Policyholder Service Division",
      "Head of SME Market Business",
      "Chief Information Officer",
      "Head of Compliance",
    ],
    discovery: [
      "What share of inbound contacts come from intermediary offices rather than policyholders?",
      "What are the top ten questions asked by tax-accountant staff, and are the answers deterministic?",
      "How is authority verified today when an accountant calls about a client company's policy?",
      "How many procedures stall on incomplete posted documents each month?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A tax accountant's assistant confirms a client company's policy value and the exact procedure documents for an ownership change, in one two-minute call.",
  },

  "orix-life": {
    operatingContext:
      "ORIX Life Insurance sells deliberately simple medical, cancer and term protection products through insurance-shop agencies, comparison sites and direct channels, positioning on clear product design and price rather than on a tied salesforce relationship. That model produces a customer base that is younger and more digitally comfortable than the mutual insurers' books, but also one with no assigned agent to absorb questions - so servicing, claims intake and payment issues arrive directly at the insurer. Product simplicity is operationally decisive: because cover is easy to describe and claims triggers are well defined, the intent set behind most contacts is narrow and highly repeatable. The company sits inside the ORIX group, a diversified financial services organisation whose operating culture is to acquire and run businesses efficiently rather than to build software platforms.",
    strategicPressure: [
      { text: "ORIX Life competes through agency, insurance-shop and direct channels with simple, comparison-friendly medical and term products rather than through a tied salesforce.", kind: "verified" },
      { text: "Without an assigned agent, every servicing and claims question routes to the insurer directly, so contact volume per policy is higher than in tied-agent models.", kind: "inference" },
      { text: "Simple, well-defined products mean a narrow intent set - coverage confirmation, claim eligibility, payment changes - which is the most automatable contact profile in Japanese life insurance.", kind: "inference" },
      { text: "A cost-disciplined group parent will judge the proposal on measurable servicing cost per policy rather than on customer-experience narrative.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. ORIX Life runs vendor-delivered insurance administration systems, and the ORIX group's pattern is to buy or acquire operating capability and run it efficiently rather than to develop platform technology. There is no insurance-side engineering organisation building conversational systems.",
    whyNotBuild:
      "The insurer's competitive position rests on product design, pricing and channel economics. Building speech, keigo synthesis, telephony, claims orchestration and permanent evaluation would raise its expense ratio - the exact metric its lean model exists to protect - for years before delivering anything.",
    workflows: [
      {
        name: "Claim eligibility and intake for medical products",
        friction: "Customers call to ask whether a hospitalisation or procedure is covered before filing, and each conversation requires an agent to read policy terms aloud and interpret them.",
        outcome: "Coverage questions answered from the actual policy terms with a structured claim opened in the same conversation and a document checklist issued.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Policy administration", "Claims administration", "Product terms knowledge base"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Coverage confirmation and policy-detail inquiries",
        friction: "Customers who bought through a comparison site or insurance shop years earlier cannot remember what they hold, and call to have the whole policy explained again.",
        outcome: "Policy identified and explained accurately within approved wording at any hour, with genuine change intent routed to licensed staff.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Policy administration", "Product knowledge base", "CRM"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Premium payment change and collection recovery",
        friction: "Failed collections are handled by letter and low-volume outbound calling, so policies lapse for administrative reasons that a two-minute conversation would fix.",
        outcome: "Payment method corrected in-conversation on a policy-bounded basis, converting avoidable lapses into retained cover.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Premium collection", "Payment services", "Policy administration"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A direct online purchase and policy self-service capability",
        "Agency and insurance-shop channels acting as the original point of sale",
        "A policyholder and claims contact centre with outsourced components",
        "A LINE official account used for notices and light servicing entry",
      ],
      gaps: [
        "Coverage eligibility questions always require a human to interpret policy terms",
        "No claim intake capability outside contact-centre hours",
        "Payment failures are recovered by letter rather than conversation",
        "Customers who bought through a shop have no ongoing relationship with the insurer",
      ],
    },
    risks: [
      "Statements about whether a specific medical event is covered have direct contractual consequence, so the agent must retrieve and quote approved terms rather than infer eligibility.",
      "APPI special-care rules apply to the health information disclosed when customers describe a hospitalisation or diagnosis.",
      "Insurance Business Act solicitation boundaries constrain any conversation that moves from explaining existing cover toward recommending additional cover.",
    ],
    economics: {
      volumeMonthly: 180000,
      costPerInteraction: 5.8,
      automationRate: 0.6,
      basis: "Seller assumptions from a direct-and-agency medical insurance book with a narrow intent set; validate against the insurer's contact-per-policy rate and cost per contact in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling coverage confirmation and policy-detail inquiries for the core medical products, grounded in policy administration and approved product terms, with claim intake handoff to human staff during the pilot.",
    expansion: [
      "Extend to claim eligibility screening and structured intake with checklist issuance",
      "Add premium-failure recovery and lapse-prevention outbound",
      "Open an agency and insurance-shop support line with product and case grounding",
    ],
    stakeholders: [
      "Head of Customer Service Division",
      "Head of Claims Operations",
      "Head of Direct and Agency Channel Management",
      "Chief Information Officer",
      "Head of Compliance",
    ],
    discovery: [
      "What is the contact rate per policy per year, and how does it compare across the direct and agency channels?",
      "What share of inbound calls are pre-claim coverage questions rather than actual claims?",
      "How many policies lapse each year for purely administrative payment reasons?",
      "What is the current fully-loaded cost per contact, and who owns that number?",
    ],
    flowTemplate: "claims",
    scenario: "A customer facing a three-day hospitalisation confirms exactly what her medical policy pays and opens the claim in the same LINE conversation.",
  },

  "jcb": {
    operatingContext:
      "JCB is Japan's only home-grown international payment brand, and unusually it operates all three roles at once - it runs the network, issues its own cards to consumers, and acquires merchants - while also licensing issuance to partner banks and card companies domestically and abroad. That structure means it carries two large and quite different contact populations: cardholders who call about lost cards, suspected fraudulent transactions, statement queries, revolving-payment changes and point redemption; and merchants who call about settlement timing, terminal problems, chargebacks and acceptance questions. Japanese cardholders skew older than in card markets elsewhere and treat the printed statement and the telephone as primary, while the merchant base includes very large numbers of small independent businesses without any digital support relationship. Both streams run through large telephone operations where keigo standards are exacting because the brand is explicitly positioned as the Japanese one.",
    strategicPressure: [
      { text: "JCB operates as network, issuer and acquirer simultaneously, which is rare globally and means it carries both cardholder and merchant servicing obligations rather than only one.", kind: "verified" },
      { text: "Card fraud in Japan has risen substantially with the shift to online commerce, driving both inbound fraud reports and large volumes of outbound verification calls that must be answered quickly to limit loss.", kind: "verified" },
      { text: "Fraud-verification outbound is capacity-bound: unreached cardholders mean either blocked legitimate cards or unblocked fraudulent ones, so contact-rate improvement translates directly into loss and complaint reduction.", kind: "inference" },
      { text: "As the domestic champion brand, JCB is judged on service courtesy in a way international networks operating in Japan are not, which raises the quality bar for any automated voice.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. JCB has genuine engineering capability at the network, authorisation and security layers - it must, to run a payment scheme - so a pure buy framing will be resisted. But scheme engineering and conversational servicing are different disciplines, and JCB's servicing operations are run as operations, substantially with outsourced partners. The pitch is industry workflow, Japanese voice quality and evaluation discipline layered onto their existing estate.",
    whyNotBuild:
      "JCB's engineering priority is scheme reliability, security and international acceptance - the things that keep the brand viable against global networks. Redirecting that capability into Japanese speech recognition, keigo synthesis, contact-centre telephony and continuous conversational evaluation would starve the roadmap that actually defends the franchise, to build something available as a product.",
    workflows: [
      {
        name: "Lost and stolen card reporting with immediate action",
        friction: "Loss reports arrive at all hours through a line that must be staffed continuously, and callers are anxious, often abroad, and sometimes calling in a second language.",
        outcome: "Instant identity-safe blocking, reissue initiation and travel-emergency guidance at any hour in multiple languages, with fraud-suspicion cases escalated to specialists immediately.",
        channels: ["Voice", "Mobile app", "LINE"],
        systems: ["Card management system", "Fraud case system", "Reissue and logistics workflow"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Fraud-alert verification outbound",
        friction: "Suspicious-transaction verification depends on reaching the cardholder quickly by phone; outbound capacity is limited, so cards are blocked pre-emptively and legitimate customers are inconvenienced.",
        outcome: "Every flagged transaction verified through a policy-timed conversation on the cardholder's preferred channel, reducing both fraud loss and false-block complaints.",
        channels: ["Voice", "LINE", "SMS", "Mobile app"],
        systems: ["Fraud detection engine", "Card management", "Case management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Merchant settlement and terminal support",
        friction: "Small merchants call about settlement timing, terminal errors and chargeback paperwork, and queue in the same operation that serves consumers, often during their own trading hours.",
        outcome: "Merchants get grounded settlement and case answers instantly, with terminal troubleshooting guided step by step and field dispatch booked where needed.",
        channels: ["Voice", "Web", "Email"],
        systems: ["Merchant management system", "Settlement platform", "Terminal support and dispatch"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A cardholder mobile app and web member service for statements, points and card controls",
        "A continuously staffed loss and fraud reporting line",
        "Merchant support desks covering settlement, terminals and disputes",
        "A LINE official account used for notices and light cardholder servicing",
      ],
      gaps: [
        "Fraud verification depends on reaching a human-dialled cardholder, so coverage is capacity-limited",
        "Merchants cannot self-serve settlement or chargeback status without a call",
        "No context continuity between the app, a blocked transaction notification and the call that follows",
        "Multilingual support for cardholders travelling or living abroad is thin outside core hours",
      ],
    },
    risks: [
      "Payment card data handling sits under PCI DSS and scheme rules, so no card numbers or authentication data may be exposed to the conversational layer beyond strictly controlled tokens.",
      "APPI governs transaction and voice-recording data, and fraud-verification calls involve sensitive behavioural information.",
      "Fraud-verification conversations are themselves a social-engineering target, so the agent must never request credentials and must follow a provable authentication protocol.",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 5.5,
      automationRate: 0.55,
      basis: "Seller assumptions covering combined cardholder and merchant contact volumes at Japanese contact-centre cost; validate against JCB's actual in-house and outsourced volumes in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and app-integrated agent for lost and stolen card reporting and card-status inquiries, operating continuously with immediate blocking and reissue initiation and hard escalation on any fraud indicator.",
    expansion: [
      "Add fraud-alert verification outbound across voice, LINE and app push with policy-timed retry",
      "Extend to merchant settlement, terminal and chargeback support",
      "Add English and other languages for cardholders travelling or resident abroad",
    ],
    stakeholders: [
      "Head of Cardholder Services / Member Business",
      "Head of Fraud and Risk Operations",
      "Head of Merchant Services",
      "Chief Information Officer / Head of Systems",
      "Head of Compliance and Personal Data Protection",
    ],
    discovery: [
      "Which parts of cardholder and merchant servicing are in-house versus outsourced, and under what contract terms?",
      "What is the current contact rate on fraud-verification outbound, and what does a missed verification cost?",
      "How many merchant support calls are pure settlement-status questions answerable from systems?",
      "What are the scheme and PCI constraints on what a conversational layer may access?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A JCB cardholder whose wallet was stolen in Osaka blocks the card, orders a replacement and confirms the disputed charges in one late-night call.",
  },

  "credit-saison": {
    operatingContext:
      "Credit Saison is one of Japan's largest card issuers, with a cardholder base numbering in the tens of millions built originally through retail partnerships in the Seibu and Saison distribution world and extended through co-brand relationships with retailers, transport operators and online platforms. Its business now spans card issuance, payments, leasing, real-estate finance and a substantial overseas lending arm, but the domestic card business is what generates contact volume: statement queries, revolving-balance and payment-amount changes, point-programme questions, limit increases and early-stage delinquency follow-up. Many cardholders acquired through retail partnerships are older and joined at a store counter decades ago, so telephone remains a primary servicing channel alongside the app. The company has been unusually vocal among Japanese financial firms about internal digital transformation and in-house engineering.",
    strategicPressure: [
      { text: "Credit Saison has publicly pursued an internal digital transformation programme including building in-house engineering capability, which means platform-level pitches will meet genuine in-house ambition.", kind: "verified" },
      { text: "A cardholder base built through decades of retail partnerships skews older than a digital-native issuer's, keeping telephone servicing volume structurally high.", kind: "inference" },
      { text: "Revolving-balance and payment-change conversations sit close to lending conduct rules, so they are handled by trained staff and cannot simply be deflected to an FAQ.", kind: "inference" },
      { text: "Early-stage delinquency contact is where automation pays fastest in card economics, but it is also where conduct risk is highest - which favours a policy-bounded agent over more human dialling.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. This is a company that has deliberately built internal engineering and will not accept being told it cannot build. The honest position is that it could build parts of this, but Japanese speech quality, keigo-safe generation, telephony integration and continuous evaluation are four specialist stacks whose combined delivery time is measured in years, and the servicing cost problem is present now.",
    whyNotBuild:
      "The internal digital team's roadmap is dominated by the app, data platform and new business lines - the things that grow revenue. Diverting it into speech and conversational infrastructure would delay that roadmap to reproduce a capability available as a product. The credible partner framing is that the agent runs on their platform and their data, with the conversational stack supplied.",
    workflows: [
      {
        name: "Statement, payment-amount and revolving-balance servicing",
        friction: "Cardholders call to change payment amounts, convert to or from revolving, and query statement lines - each a bounded transaction handled by trained staff because it touches lending terms.",
        outcome: "Payment and statement changes executed conversationally within approved policy at any hour, with full disclosure wording and a complete audit record.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Card management system", "Billing and statement platform", "Payment services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Early-stage delinquency contact",
        friction: "Missed-payment follow-up relies on dialler capacity and staffed hours, so contact rates are low, working customers are unreachable, and accounts roll into more expensive collection stages.",
        outcome: "Every early-stage account contacted within permitted windows on its preferred channel, with payment completed in-conversation and hardship cases routed to specialists.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Collections system", "Card management", "Payment services"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Point programme and co-brand partner inquiries",
        friction: "Point balance, expiry and redemption questions - plus co-brand partner benefit rules - generate very high-volume, very low-value calls that nonetheless occupy trained agents.",
        outcome: "Point and benefit questions resolved instantly across channels, releasing the staffed queue for lending and dispute work.",
        channels: ["Voice", "LINE", "Mobile app", "Web"],
        systems: ["Loyalty and points platform", "Co-brand partner rules engine", "Card management"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A widely used cardholder app with statement, point and card-control functions",
        "A LINE official account used for notices and servicing entry",
        "An in-house digital and engineering organisation building customer-facing products",
        "Card servicing and collections operations with substantial outsourced capacity",
      ],
      gaps: [
        "Payment-term changes still require a staffed conversation during limited hours",
        "Delinquency contact coverage is bounded by dialler and agent capacity",
        "Point and benefit questions consume trained agent time that lending work needs",
        "App and phone channels do not share session context",
      ],
    },
    risks: [
      "Payment-change and revolving conversations fall under lending conduct expectations, requiring provably approved disclosure wording and full retention.",
      "Collections contact in Japan is bounded by permitted hours, frequency and manner rules under money-lending conduct regulation, and third-party disclosure is prohibited.",
      "APPI plus PCI constraints govern what transaction and identity data may enter the conversational layer.",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 5,
      automationRate: 0.6,
      basis: "Seller assumptions from cardholder base scale and Japanese card-servicing contact rates; validate with the company's own volumes, outsourcing split and cost per contact in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling statement, point and payment-amount inquiries for the core card portfolio, integrated with the existing card management platform and running on the company's own cloud footprint.",
    expansion: [
      "Extend to revolving-balance and payment-term changes with approved disclosure wording",
      "Add policy-bounded early-stage delinquency contact with hardship escalation",
      "Open co-brand partner benefit servicing across partner-specific rule sets",
    ],
    stakeholders: [
      "Head of Card Business Division",
      "Head of Customer Service and Contact Centre",
      "Head of Credit and Collections",
      "Chief Digital Officer / Head of the internal engineering organisation",
      "Head of Compliance and Conduct",
    ],
    discovery: [
      "What is on the internal digital team's roadmap for the contact centre over the next four quarters?",
      "What contact rate does early-stage collections achieve today, and against what permitted-window rules?",
      "How much of servicing and collections is outsourced, and at what cost per contact?",
      "What proportion of calls are point and benefit questions that never touch lending terms?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A Saison cardholder switches next month's payment amount and checks her point expiry in one LINE conversation, without waiting for the centre to open.",
  },

  "orient-corporation": {
    operatingContext:
      "Orient Corporation, trading as Orico, is one of Japan's principal shinpan companies - installment credit providers whose business is arranged at the point of sale rather than in a branch. Its largest engine is auto finance written through dealerships, alongside shopping credit for consumer purchases, rent and loan guarantee businesses, and a card operation. That structure gives it two contact populations that most card issuers do not have in the same shape: dealer and merchant staff who call about application status, contract paperwork and credit decisions while a customer is sitting at their desk, and consumers who call about payment dates, early settlement, contract details and - inevitably in installment lending - missed payments. Consumer contacts skew toward people who financed a car or a purchase years ago and have no app relationship, so telephone dominates.",
    strategicPressure: [
      { text: "Orico's installment credit and auto-finance model means credit is arranged at dealer and merchant premises, so intermediary support is a first-class servicing obligation rather than a side channel.", kind: "verified" },
      { text: "Dealer-side application-status calls are time-critical because a customer is physically waiting, which makes response speed a commercial variable in winning the dealer's next referral.", kind: "inference" },
      { text: "Installment portfolios generate continuous payment-date-change and early-stage arrears contact, which is high-volume, rules-bounded and currently dependent on dialler and agent capacity.", kind: "inference" },
      { text: "Japan's money-lending conduct rules on contact timing, frequency and third-party disclosure make a policy-bounded automated agent lower-risk than expanding human dialling capacity.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Orico's systems are delivered and maintained through external integrators, with internal IT focused on credit systems, dealer connectivity and regulatory work. There is no product-engineering organisation and no public evidence of conversational or speech capability.",
    whyNotBuild:
      "Orico competes on credit decisioning speed and dealer relationships. Building Japanese speech, keigo-safe generation, telephony, credit-system orchestration and a permanent conduct-evaluation function would absorb years of IT capacity that its dealer connectivity and credit platforms need, for a capability that is purchasable now.",
    workflows: [
      {
        name: "Payment-date change and early settlement requests",
        friction: "Customers call to move a payment date or ask for an early-settlement figure, and each request requires a staffed agent to calculate and explain within limited hours.",
        outcome: "Date changes executed and settlement figures quoted conversationally within policy at any hour, with the disclosure wording identical every time.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Installment credit system", "Payment services", "Contract master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Early-stage arrears contact",
        friction: "Missed installments are worked by a dialler within permitted hours; contact rates are low, working customers are missed, and cases roll into more expensive stages with worse outcomes.",
        outcome: "Full coverage of early-stage accounts within permitted windows on the customer's channel, with payment taken in-conversation and hardship routed to trained specialists.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Collections system", "Installment credit system", "Payment services"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Dealer and merchant application-status support",
        friction: "Dealer finance staff phone Orico for credit decision status and document requirements with a buyer waiting at the desk, and hold time directly risks the sale.",
        outcome: "Instant grounded application status and document guidance for dealer staff, so the deal closes in the showroom rather than waiting for a callback.",
        channels: ["Voice", "Web", "Email"],
        systems: ["Credit decisioning system", "Dealer portal", "Document workflow"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A dealer and merchant portal for application submission and status",
        "A consumer web and app member service for contract and payment information",
        "Consumer servicing and collections operations with outsourced capacity",
        "A LINE official account used for notices and payment reminders",
      ],
      gaps: [
        "Payment-date changes cannot be completed without a staffed agent",
        "Arrears contact coverage is bounded by dialler and agent capacity",
        "Dealer staff still phone for status the portal cannot answer conversationally",
        "No after-hours capability for consumers who work during centre hours",
      ],
    },
    risks: [
      "Money-lending and installment-sales conduct rules restrict contact hours, frequency, manner and any disclosure to third parties including family members who answer the phone.",
      "APPI governs voice recordings and the credit information handled during arrears conversations.",
      "Hardship and vulnerability signals require reliable detection and human handover, with evidence available to supervisors and regulators.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 5,
      automationRate: 0.6,
      basis: "Seller assumptions from installment and auto-finance portfolio scale with dealer support volume; validate with Orico's measured consumer and dealer contact volumes in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling payment-date changes and contract inquiries for the auto-finance portfolio, with live installment-system integration, approved disclosure wording and full transcript retention.",
    expansion: [
      "Add policy-bounded early-stage arrears contact with in-conversation payment and hardship escalation",
      "Open a dealer and merchant application-status support line with credit-system grounding",
      "Extend across shopping credit and card portfolios with per-product disclosure sets",
    ],
    stakeholders: [
      "Head of Auto Finance Business",
      "Head of Customer Service Operations",
      "Head of Credit and Collections",
      "Head of IT Planning",
      "Head of Compliance and Conduct",
    ],
    discovery: [
      "What is the compliance sign-off process for any automated outbound contact on an arrears account?",
      "What contact rate does early-stage collections currently achieve, and within what permitted windows?",
      "How many dealer calls per month are pure application-status checks, and what is the average hold time?",
      "Which servicing functions are outsourced, and when do those contracts renew?",
    ],
    flowTemplate: "collections",
    scenario: "A car-loan customer moves next month's payment date and settles a missed installment in one evening conversation, before the account rolls a bucket.",
  },

  "aiful": {
    operatingContext:
      "Aiful is one of the few large Japanese consumer lenders that remains independent rather than sitting inside a megabank group, operating unsecured personal lending under its own brand alongside a card business and a business-support finance arm. Independence shapes everything about how it operates: it has no group platform to inherit, no parent subsidising its cost base, and a P&L in which acquisition cost, servicing cost and collection effectiveness are directly visible to management. Its customer journey is telephone- and web-heavy from the first contact - application questions, income verification, limit inquiries, in-life servicing and, across a consumer lending book, a continuous stream of early-stage arrears work. The company operates under money-lending regulation that tightly bounds how, when and how often a borrower may be contacted.",
    strategicPressure: [
      { text: "Aiful is an independent consumer lender without a megabank parent, so cost-to-serve and collection effectiveness fall entirely on its own P&L.", kind: "verified" },
      { text: "Money-lending conduct regulation in Japan restricts contact hours, frequency and manner, which caps what additional human dialling capacity can achieve regardless of headcount.", kind: "verified" },
      { text: "Application drop-off between initial interest and completed contract is a direct revenue leak that faster, always-available follow-up conversation would reduce.", kind: "inference" },
      { text: "A policy-bounded agent that never deviates from approved wording is arguably a lower conduct risk than a variable human dialler operation, which reframes automation as risk reduction rather than only cost saving.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Aiful's systems are vendor-delivered with internal IT focused on lending platforms, scoring and regulatory reporting. As an independent mid-cap it has neither the engineering headcount nor the capital allocation freedom to fund a conversational platform build, and its competitive position depends on lending economics rather than technology ownership.",
    whyNotBuild:
      "Independence cuts both ways - there is no group technology function to draw on. Building speech, keigo-safe generation, telephony, lending-system orchestration and a conduct-evaluation harness would be a multi-year drain on a company whose entire advantage is operating efficiency, to reach a capability that can be deployed this quarter.",
    workflows: [
      {
        name: "Application follow-up and completion",
        friction: "Applicants who start online and stall on income documents or verification receive an SMS and an occasional call within office hours; many simply do not complete, and the acquisition spend is wasted.",
        outcome: "Timely conversational follow-up in the applicant's channel that answers the specific blocking question and completes verification, converting stalled applications into funded loans.",
        channels: ["Voice", "LINE", "SMS", "Web"],
        systems: ["Loan origination system", "Document verification workflow", "Scoring engine"],
        value: 3,
        complexity: 3,
      },
      {
        name: "In-life servicing and limit inquiries",
        friction: "Balance, repayment schedule, limit and interest questions arrive constantly and are handled by trained staff because they touch lending terms and disclosure obligations.",
        outcome: "Deterministic servicing questions answered instantly within approved wording at any hour, with limit-change requests routed into the scoring process rather than answered ad hoc.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Loan management system", "Scoring engine", "Payment services"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Early-stage arrears contact within permitted windows",
        friction: "Contact attempts are constrained by regulation and by dialler capacity, so coverage of the early-stage book is partial and the accounts that roll are often simply the ones nobody reached.",
        outcome: "Complete coverage within permitted contact rules, with repayment arranged in-conversation and hardship or vulnerability signals escalated to trained humans.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Collections system", "Loan management", "Payment services"],
        value: 3,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "An online and app-based application and member service journey",
        "A LINE official account used for notices and servicing entry",
        "A telephone servicing and collections operation with dialler infrastructure",
        "Automated contract and verification processes built for a self-service borrower",
      ],
      gaps: [
        "Stalled applications are not recovered conversationally outside office hours",
        "Servicing questions touching lending terms always require a trained human",
        "Arrears contact coverage is capacity-bound rather than policy-bound",
        "No consistent evidence trail proving what was said on every collections call",
      ],
    },
    risks: [
      "Money Lending Business Act conduct rules bound contact timing, frequency and manner, and prohibit disclosing the existence of a debt to third parties who answer the phone.",
      "APPI governs voice recordings and the credit and income information handled during application and arrears conversations.",
      "Vulnerability and hardship detection must be reliable and evidenced, since regulatory scrutiny of consumer lenders in Japan is historically intense.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 4.8,
      automationRate: 0.6,
      basis: "Seller assumptions from unsecured consumer lending portfolio scale and Japanese contact-centre cost; validate with the company's application, servicing and collections volumes in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent for application follow-up and completion on stalled online applications, with origination-system integration, approved wording and immediate handoff of any credit-decision conversation to staff.",
    expansion: [
      "Extend to in-life servicing and limit inquiries with lending-system grounding",
      "Add policy-bounded early-stage arrears contact with hardship escalation and full transcript evidence",
      "Introduce proactive pre-due reminders on a consent basis to reduce arrears entry",
    ],
    stakeholders: [
      "Head of Consumer Lending Business",
      "Head of Customer Service Operations",
      "Head of Credit and Collections",
      "Head of IT Planning",
      "Head of Compliance and Conduct",
    ],
    discovery: [
      "What proportion of started applications fail to complete, and where in the flow do they stall?",
      "What contact rate does the current dialler achieve on early-stage arrears within permitted windows?",
      "How is conduct compliance evidenced today - sampled call review, or something more complete?",
      "What is the fully-loaded cost per contact across servicing and collections?",
    ],
    flowTemplate: "onboarding",
    scenario: "An applicant who stalled at income verification on Sunday night is guided through the missing document and funded on Monday, instead of abandoning.",
  },

  "acom": {
    operatingContext:
      "Acom is one of Japan's largest consumer lenders, operating unsecured personal loans under its own brand and a substantial guarantee business standing behind bank card loans, within the MUFG group orbit but running its own operations. It is culturally significant in the Japanese market for having normalised machine-mediated borrowing through unstaffed automated contract kiosks, which taught a generation of borrowers that a loan could be arranged without speaking to a person - a precedent that matters directly when proposing automated voice servicing. Its contact profile is dominated by application follow-up, limit and balance inquiries, repayment-arrangement conversations and early-stage arrears work, all conducted under money-lending conduct rules. Customers reach it by phone, web, app and kiosk, with the telephone still carrying the conversations that involve judgement or negotiation.",
    strategicPressure: [
      { text: "Acom built its scale partly on unstaffed automated contract kiosks, demonstrating that its customer base accepts completing sensitive financial transactions without a human present.", kind: "verified" },
      { text: "A large guarantee business means Acom also carries servicing and recovery obligations behind partner banks' card loans, multiplying contact volume beyond its own-brand book.", kind: "verified" },
      { text: "Repayment-arrangement conversations are the highest-value and most conduct-sensitive contacts in the book, and their quality currently depends on which agent answers.", kind: "inference" },
      { text: "MUFG group technology governance may influence vendor selection even though Acom operates its own servicing stack, so the group relationship needs mapping early.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Acom's technology is delivered by external integrators and group IT partners, with internal focus on lending systems, scoring and kiosk operations. There is no evidence of internal speech or conversational-model engineering, and the company's demonstrated pattern is to deploy purchased automation - the kiosks themselves - rather than to build it.",
    whyNotBuild:
      "The kiosk precedent is instructive: Acom bought and deployed automation to remove human contact from a sensitive process, and it worked. Repeating that logic for voice means buying a Japanese conversational platform, not constructing speech recognition, keigo synthesis, telephony, orchestration and conduct evaluation from scratch inside a lender.",
    workflows: [
      {
        name: "Repayment-arrangement conversations",
        friction: "Borrowers seeking to change a repayment amount or schedule reach whichever agent is free, and the outcome depends on that agent's confidence and interpretation of the policy matrix.",
        outcome: "Arrangements offered strictly from the approved matrix with identical explanation every time, executed in-conversation and fully recorded, with exceptions escalated.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Loan management system", "Collections and arrangement policy engine", "Payment services"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Limit, balance and repayment-schedule inquiries",
        friction: "High-volume deterministic questions about available limit, next payment and outstanding balance occupy trained agents subject to disclosure obligations.",
        outcome: "Instant grounded answers at any hour with correct disclosure wording, releasing agent capacity for arrangement and hardship work.",
        channels: ["Voice", "LINE", "Mobile app", "Web"],
        systems: ["Loan management system", "Scoring engine", "Card and account master"],
        value: 3,
        complexity: 1,
      },
      {
        name: "Guarantee-business servicing behind partner banks",
        friction: "Borrowers of partner-bank card loans call about payments and arrears without always understanding which entity they are dealing with, causing transfers and repeated explanation.",
        outcome: "Correct entity identification and grounded answers on the first contact, with partner-bank-specific wording applied automatically.",
        channels: ["Voice", "SMS", "LINE"],
        systems: ["Guarantee administration system", "Partner bank interfaces", "Collections system"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Unstaffed automated contract kiosks used for application and card issuance",
        "An app and web member service for balance, payment and limit information",
        "A telephone servicing and collections operation with dialler infrastructure",
        "A guarantee-business operation servicing partner-bank card loans",
      ],
      gaps: [
        "Repayment arrangements vary by agent rather than being deterministically policy-bounded",
        "No servicing or arrangement capability outside staffed hours",
        "Guarantee-business callers are frequently misrouted between entities",
        "Conduct compliance is evidenced by sampled review rather than complete coverage",
      ],
    },
    risks: [
      "Money Lending Business Act conduct rules govern contact windows, frequency, manner and third-party disclosure, and are actively supervised for this sector.",
      "APPI applies to voice recordings and to credit information used during arrangement conversations.",
      "Guarantee-business contacts involve partner banks' customers, so data sharing and wording must satisfy both the bank's and Acom's compliance requirements.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 4.8,
      automationRate: 0.6,
      basis: "Seller assumptions from own-brand plus guarantee-business portfolio scale at Japanese contact-centre cost; validate against Acom's measured contact volumes and outsourcing split in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling limit, balance and repayment-schedule inquiries for own-brand borrowers, with loan-system grounding, approved disclosure wording and complete transcript evaluation.",
    expansion: [
      "Extend to policy-bounded repayment-arrangement conversations with matrix enforcement and exception escalation",
      "Add early-stage arrears contact within permitted windows",
      "Open guarantee-business servicing with partner-bank-specific identification and wording",
    ],
    stakeholders: [
      "Head of Consumer Lending Business",
      "Head of Customer Service and Contact Centre",
      "Head of Credit Management and Collections",
      "Head of Systems / IT Planning",
      "Head of Compliance and Conduct",
    ],
    discovery: [
      "Does MUFG group technology governance constrain vendor selection for Acom's own servicing stack?",
      "How much variance exists today in repayment arrangements offered for comparable customer situations?",
      "What share of inbound calls are deterministic balance and limit inquiries?",
      "How is conduct compliance evidenced across collections calls today?",
    ],
    flowTemplate: "collections",
    scenario: "A borrower who lost overtime hours agrees a policy-approved revised repayment schedule at 9pm, with the arrangement recorded and the explanation identical to every other customer in the same position.",
  },

  "smbc-consumer-finance": {
    operatingContext:
      "SMBC Consumer Finance operates the Promise brand, one of the largest unsecured personal lending books in Japan, and runs a substantial guarantee business standing behind card loans issued by SMBC group and partner regional banks. Although it sits within a megabank group, it functions as a distinct operating company with its own lending platforms, contact centres and collections organisation, because consumer finance conduct rules and operating rhythms differ fundamentally from bank retail. Its customers apply online, through automated contract machines and through partner bank channels, and then interact predominantly by phone and app for verification, servicing, repayment arrangements and arrears. Contact volume is driven less by product complexity than by regulatory process - identity and income verification, disclosure obligations, and permitted-window contact rules that shape every collections conversation.",
    strategicPressure: [
      { text: "Promise is among the largest consumer lending brands in Japan and is paired with a large guarantee business behind bank card loans, giving the company two distinct servicing populations.", kind: "verified" },
      { text: "Application verification is a mandatory, high-volume, largely deterministic conversation that currently consumes trained staff time at scale.", kind: "inference" },
      { text: "Operating inside a megabank group raises the compliance bar above standalone lenders, which favours a fully-logged and evaluated automated agent over variable human handling.", kind: "inference" },
      { text: "The subsidiary is likely to be able to decide its own servicing platform within group security standards, making this a subsidiary-level rather than group-level deal.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The company runs vendor-delivered lending and servicing systems, with group IT setting security and architecture standards rather than building conversational products. Its operational focus is credit quality and conduct compliance, not software engineering.",
    whyNotBuild:
      "Within a megabank group, a consumer finance subsidiary does not get funded to build platform technology - it gets held to group standards and expected to buy compliant capability. Speech, keigo generation, telephony, orchestration and conduct evaluation are five build streams no one inside this entity is chartered to run.",
    workflows: [
      {
        name: "Application verification callbacks",
        friction: "Verification calls confirming identity, employment and income are mandatory, deterministic and high-volume, yet consume trained agents within office hours, delaying funding by a day or more.",
        outcome: "Verification conducted conversationally at any hour with identical protocol and complete evidence, cutting time from application to funding.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Loan origination system", "Identity verification services", "Document workflow"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Payment reminder and early-stage arrears outreach",
        friction: "Reminder and early arrears contact is dialler-bound and permitted-window-bound, so coverage is partial and outcomes depend on who was reached rather than who most needed contact.",
        outcome: "Complete coverage within permitted windows on the borrower's channel, with payment or arrangement completed in-conversation and hardship escalated.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Collections system", "Loan management", "Payment services"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Guarantee-business borrower servicing for partner banks",
        friction: "Borrowers of partner-bank card loans are unsure which company services their loan and are transferred repeatedly, re-explaining their situation each time.",
        outcome: "Entity and product identified from the first utterance with partner-specific wording and grounded answers, eliminating transfer loops.",
        channels: ["Voice", "SMS", "Web"],
        systems: ["Guarantee administration system", "Partner bank interfaces", "Loan management"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "An online and automated-contract-machine application journey",
        "An app and web member service for balance, payment and limit information",
        "Telephone servicing and collections operations with dialler infrastructure",
        "A guarantee-business operation serving SMBC group and partner regional banks",
      ],
      gaps: [
        "Verification calls cannot happen outside staffed hours, delaying funding",
        "Arrears contact coverage is capacity-bound rather than policy-bound",
        "Guarantee-business borrowers face repeated transfers between entities",
        "Conduct evidence relies on sampled call review rather than full coverage",
      ],
    },
    risks: [
      "Money Lending Business Act rules on contact hours, frequency, manner and third-party disclosure apply to every outbound conversation and are actively supervised.",
      "Group security and data-residency standards from the parent bank will constrain architecture and voice-recording storage.",
      "APPI applies to identity, income and credit data handled during verification and arrears conversations.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 4.8,
      automationRate: 0.6,
      basis: "Seller assumptions from own-brand and guarantee-business portfolio scale at Japanese contact-centre cost; validate with the company's own contact statistics and group cost allocations in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent conducting application verification callbacks for the Promise brand with origination-system integration, fixed protocol, complete evidence capture and immediate escalation of any inconsistency to a human underwriter.",
    expansion: [
      "Add payment reminder and early-stage arrears outreach within permitted windows",
      "Extend to in-life servicing inquiries across voice, LINE and app",
      "Open guarantee-business servicing with partner-bank identification and wording",
    ],
    stakeholders: [
      "Head of Consumer Finance Business",
      "Head of Customer Service Operations",
      "Head of Credit Management and Collections",
      "Head of IT Planning (with group architecture liaison)",
      "Head of Compliance and Conduct",
    ],
    discovery: [
      "How much operational and vendor-selection independence does the company have from SMBC group technology governance?",
      "How many verification calls are made per month, and what is the average delay they add to funding?",
      "What contact rate does early-stage collections achieve within permitted windows today?",
      "Where must voice recordings be stored under group data-residency policy?",
    ],
    flowTemplate: "collections",
    scenario: "A Promise applicant completes income verification at 10pm and is funded the next morning instead of losing two days to a callback queue.",
  },

  "jaccs": {
    operatingContext:
      "JACCS is an established shinpan company whose core franchise is installment credit arranged at the point of sale - most prominently auto loans written through dealerships, alongside home-improvement and other merchant credit, credit cards, and loan guarantee work for financial institutions. It also runs consumer finance operations in several Southeast Asian markets, but the Japanese business is the contact-heavy one. Like other shinpan players its servicing has two faces: dealer and merchant staff who need application status and paperwork answers while a customer waits, and consumers with installment contracts who call about payment dates, balances, early settlement and missed payments. Because the point of sale is a third party, most consumer customers have no direct digital relationship with JACCS at all, which pushes servicing onto the telephone by default.",
    strategicPressure: [
      { text: "JACCS arranges credit through dealer and merchant networks, so intermediary support quality directly affects whether those partners keep routing business to it.", kind: "verified" },
      { text: "Auto and home-improvement credit is written at premises where a customer is physically present, making application-status response time a competitive rather than operational variable.", kind: "inference" },
      { text: "Consumers acquired through a third party rarely register for digital servicing, so telephone contact rates per contract stay stubbornly high across the installment book.", kind: "inference" },
      { text: "Sub-scale relative to the largest issuers, JACCS is unlikely to fund a bespoke platform and will respond to a bounded, provable cost-per-contact case.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. JACCS operates vendor-delivered credit and servicing systems with internal IT focused on dealer connectivity, credit processing and regulatory work. It has no product-engineering organisation and insufficient scale to carry the fixed cost of a conversational platform build.",
    whyNotBuild:
      "The company's competitive asset is its dealer and merchant network, not technology. Building Japanese speech, keigo-safe generation, telephony, credit-system orchestration and conduct evaluation would consume its entire discretionary IT capacity for years while the dealer-experience problem it is meant to fix goes unaddressed.",
    workflows: [
      {
        name: "Dealer-channel application-status and document support",
        friction: "Dealer finance desks phone JACCS for credit decision status and required paperwork with a buyer waiting, and hold time directly threatens the sale and the dealer relationship.",
        outcome: "Instant grounded status and document guidance for dealer staff, so contracts complete in the showroom and dealers keep sending business.",
        channels: ["Voice", "Web", "Email"],
        systems: ["Credit decisioning system", "Dealer portal", "Document workflow"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Consumer payment-date change and balance inquiries",
        friction: "Installment customers with no digital relationship call for balances, payment dates and settlement figures, and every one of those calls costs a staffed agent minute.",
        outcome: "Deterministic contract questions answered and date changes executed conversationally at any hour, with consistent disclosure wording.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Installment credit system", "Payment services", "Contract master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Early-stage arrears reminder contact",
        friction: "Missed installments are worked by dialler within permitted hours; coverage is partial and the accounts that deteriorate are often simply those nobody reached.",
        outcome: "Full early-stage coverage within permitted windows with payment taken in-conversation and hardship routed to trained specialists.",
        channels: ["Voice", "SMS", "LINE"],
        systems: ["Collections system", "Installment credit system", "Payment services"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A dealer and merchant portal for application submission and status",
        "A consumer web member service for contract and payment information",
        "Telephone servicing and collections operations with dialler infrastructure",
        "An installment and guarantee business spanning auto, home-improvement and card products",
      ],
      gaps: [
        "Dealer staff still phone for status the portal cannot answer conversationally",
        "Most consumers have no registered digital channel, so all servicing defaults to phone",
        "No servicing capacity outside business hours",
        "Arrears contact coverage is bounded by dialler capacity rather than policy",
      ],
    },
    risks: [
      "Installment sales and money-lending conduct rules bound contact timing, frequency, manner and third-party disclosure for all consumer outreach.",
      "APPI governs voice recordings and credit information, and dealer-channel conversations involve a third party discussing a consumer's credit application.",
      "Dealer-facing answers must be provably accurate, since a wrong status statement can cause a dealer to release a vehicle against unapproved finance.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 4.8,
      automationRate: 0.55,
      basis: "Seller assumptions from installment portfolio scale plus dealer support volume; validate with JACCS measured dealer and consumer contact volumes in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent on the dealer support line answering application-status and document-requirement questions with live credit-system grounding and immediate transfer for any credit-decision discussion.",
    expansion: [
      "Extend to consumer payment-date changes and contract inquiries across voice and LINE",
      "Add early-stage arrears reminder contact within permitted windows",
      "Introduce proactive pre-due reminders and digital-channel enrolment for new contracts",
    ],
    stakeholders: [
      "Head of Auto Credit Business",
      "Head of Merchant and Dealer Network Management",
      "Head of Customer Service Operations",
      "Head of IT Planning",
      "Head of Compliance",
    ],
    discovery: [
      "Which generates more inbound volume today - dealer support or consumer servicing - and how is each measured?",
      "What is the average hold time on the dealer line during weekend showroom peaks?",
      "What share of consumer contracts have a registered digital servicing channel?",
      "What is the compliance sign-off path for automated outbound on arrears accounts?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A Saturday-afternoon dealership confirms a car-loan approval and the exact remaining paperwork in ninety seconds, and the customer drives away that day.",
  },

  "lawson": {
    operatingContext:
      "Lawson operates roughly fourteen thousand convenience stores across Japan, the overwhelming majority run by franchisee owners rather than the company, plus format variants including Natural Lawson and the hundred-yen store line. Its economics rest on a franchise model in which store owners carry the labour problem directly - recruiting and rostering part-time crew, running twenty-four-hour operations in many locations, and keeping equipment from fryers to coffee machines to multifunction copiers working without on-site technical staff. Headquarters therefore fields a continuous stream of store-side calls: ordering and allocation questions, equipment faults, settlement and accounting queries, system and till problems, and personnel matters. Since the joint acquisition by KDDI and Mitsubishi Corporation, the chain has been positioned as a platform combining retail with telecommunications and services, which raises the strategic profile of store operations technology.",
    strategicPressure: [
      { text: "Lawson is now jointly owned by KDDI and Mitsubishi Corporation following their acquisition, and is explicitly positioned as a retail-plus-telecommunications platform rather than a pure convenience chain.", kind: "verified" },
      { text: "Convenience-store labour scarcity is the format's existential constraint - franchisee owners cannot fill night and early-morning shifts, and this is the single most cited operational issue in the sector.", kind: "verified" },
      { text: "Because the franchisee is a small business owner with no back office, every operational question becomes a phone call to headquarters support lines that are staffed to an average rather than to peaks.", kind: "inference" },
      { text: "Part-time recruitment is itself a communications workload - applicants call or apply and then wait for a store or area manager to respond, and slow response is a major source of applicant loss.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led for store operations, with a partner-led overlay because of the new telecommunications ownership. Lawson itself is a retail operator whose systems are delivered by external partners; the KDDI relationship introduces group technology capability but that capability is in networks and telecommunications platforms, not Japanese conversational servicing for franchise store support.",
    whyNotBuild:
      "Lawson's operating problem is immediate and store-level - owners need answers now, in the middle of a shift. Building speech, keigo generation, telephony, orchestration into ordering, equipment and settlement systems, and a permanent evaluation function would take years while franchisee frustration compounds. The chain's own strategy is to assemble partner capability onto a retail platform, which is exactly this shape of deal.",
    workflows: [
      {
        name: "Franchisee store-support desk",
        friction: "Store owners and crew call headquarters about ordering, equipment faults, settlement discrepancies and till problems during shifts, and queue behind each other because support staffing is flat while incidents cluster.",
        outcome: "Store-side questions triaged and resolved instantly at any hour, with guided equipment troubleshooting and automatic field dispatch where the fix needs a technician.",
        channels: ["Voice", "LINE", "Store system"],
        systems: ["Store ordering system", "Equipment maintenance and dispatch", "Settlement and accounting systems"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Part-time applicant screening and interview scheduling",
        friction: "Applicants apply to individual stores and wait for a busy owner or manager to call back; the delay loses applicants to whichever employer responds first in a market where every retailer is hiring.",
        outcome: "Applicants engaged within minutes, screened against basic criteria and booked directly into a store interview slot, sharply reducing applicant loss.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Recruitment system", "Store rostering", "Interview scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Customer inquiry and service-counter question handling",
        friction: "Consumer calls about products, campaigns, machine services, lost items and store facilities arrive at a general line and at stores themselves, interrupting crew who are serving a queue.",
        outcome: "Consumer questions resolved without touching store crew, with store-specific answers grounded in live inventory and store master data.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Store master data", "Inventory and campaign systems", "Point programme interfaces"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A consumer app tied to point programmes and store campaigns",
        "A LINE official account used for campaigns and customer notices",
        "Headquarters support desks for franchisee ordering, equipment and settlement questions",
        "In-store systems including ordering terminals and multifunction service machines",
      ],
      gaps: [
        "Store owners cannot get an answer at 3am when a fryer or till fails",
        "Applicants have no immediate response path, so hiring funnels leak at first contact",
        "Consumer questions still interrupt store crew serving customers",
        "Support-call patterns are not analysed to fix recurring equipment and process defects upstream",
      ],
    },
    risks: [
      "Franchise relationships are contractual and sensitive - support quality is a live topic in franchisee negotiations, so degradation would carry commercial and reputational consequences.",
      "Recruitment conversations collect personal data from applicants under APPI, including where the applicant is a minor requiring guardian consent.",
      "Equipment guidance touching gas, fryers or electrical systems must escalate to qualified technicians rather than instruct untrained crew.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 4.5,
      automationRate: 0.6,
      basis: "Seller assumptions combining franchisee support, recruitment and consumer contact across the store network; validate with Lawson support-desk volumes and recruitment funnel data in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent on the franchisee store-support line covering equipment faults, ordering questions and settlement queries for one regional store cluster, with guided troubleshooting and automatic technician dispatch.",
    expansion: [
      "Add part-time applicant screening and interview scheduling across the same cluster",
      "Extend store support nationwide with defect-pattern reporting back to operations",
      "Open consumer inquiry handling with store-specific grounded answers",
    ],
    stakeholders: [
      "Head of Store Operations / Franchise Support",
      "Head of Human Resources and Crew Recruitment",
      "Head of Equipment and Facilities",
      "Chief Information Officer / Head of Digital",
      "Head of Franchise Relations",
    ],
    discovery: [
      "How does KDDI co-ownership change technology sourcing decisions for store operations?",
      "What is the current volume and answer-time profile of the franchisee support desk by hour of day?",
      "How many part-time applications are received monthly, and what share never reach an interview?",
      "Which equipment failure types generate the most support calls, and are those patterns analysed today?",
    ],
    flowTemplate: "employee-desk",
    scenario: "A Lawson owner whose coffee machine fails at 4am gets guided through the reset and, when it fails again, a technician booked before the morning rush.",
  },

  "ministop": {
    operatingContext:
      "Ministop operates roughly eighteen hundred convenience stores within the AEON group, differentiated from larger konbini rivals by in-store kitchens producing soft-serve, fried items and other prepared food to order. That kitchen is the strategic point and the operational burden: it requires food-handling trained crew, more equipment per store, stricter hygiene procedures and more frequent equipment failures than a standard convenience format. With a store count roughly an eighth of the largest chains, headquarters support functions are correspondingly thin, so the same franchisee questions - equipment, ordering, hygiene procedure, settlement - reach a much smaller support team. Consumer contact runs through group point and payment systems shared with AEON, and through store-level phone calls.",
    strategicPressure: [
      { text: "Ministop differentiates through in-store kitchens producing prepared food to order, which raises per-store labour, equipment and hygiene-procedure requirements above standard convenience operations.", kind: "verified" },
      { text: "At roughly eighteen hundred stores the chain lacks the scale to staff support functions deeply, so support capacity is thin exactly where its format is most operationally complex.", kind: "inference" },
      { text: "Food-preparation equipment failures are time-critical - a broken soft-serve machine removes the store's signature product for the day - so response speed has direct revenue consequence.", kind: "inference" },
      { text: "AEON group procurement conventions may constrain subsidiary-level vendor choice, making the group relationship an early qualification question.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Ministop is a mid-sized retail subsidiary within a group whose technology investments have centred on payments, point programmes and retail systems rather than conversational AI. It has no engineering organisation of its own and no scale to justify building one.",
    whyNotBuild:
      "A chain of this size cannot carry the fixed cost of speech, dialogue, telephony and evaluation engineering, and the AEON group has not pointed capability of that kind at subsidiary store operations. Buying a bounded store-support capability is the only route that matches the chain's scale and urgency.",
    workflows: [
      {
        name: "Store-support line for kitchen equipment and food operations",
        friction: "A soft-serve or fryer failure during a peak trading period is reported by phone to a thin support desk, and the store loses its differentiating product until someone calls back.",
        outcome: "Guided troubleshooting instantly at any hour with automatic technician dispatch and parts logging, minimising signature-product downtime.",
        channels: ["Voice", "LINE", "Store system"],
        systems: ["Equipment maintenance and dispatch", "Store master data", "Parts inventory"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Ordering, allocation and hygiene-procedure queries",
        friction: "Crew and owners call about ordering deadlines, allocation shortfalls and food-handling procedure questions, and the answer depends on who at head office picks up.",
        outcome: "Consistent, grounded operational answers from the current procedure manuals and ordering system, identical across all stores.",
        channels: ["Voice", "LINE", "Store system"],
        systems: ["Store ordering system", "Procedure and hygiene manuals", "Allocation system"],
        value: 2,
        complexity: 2,
      },
      {
        name: "Part-time crew applicant screening and scheduling",
        friction: "Food-handling roles need more screening than standard convenience crew, but applicants still wait for a busy store manager to call back and are lost to faster employers.",
        outcome: "Applicants engaged immediately, screened for food-handling suitability and availability, and booked into store interviews.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Recruitment system", "Store rostering", "Interview scheduling"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Group point and payment programme participation shared across AEON retail",
        "A LINE official account used for campaigns and customer notices",
        "A headquarters store-support function covering ordering and equipment",
        "In-store ordering terminals and kitchen equipment monitoring where fitted",
      ],
      gaps: [
        "No out-of-hours support for kitchen equipment failures",
        "Procedure answers vary by which head-office staff member responds",
        "Applicants for food-handling roles wait on store-manager availability",
        "Equipment failure patterns are not systematically analysed across the network",
      ],
    },
    risks: [
      "Food-handling and hygiene guidance carries regulatory weight under food-sanitation rules, so the agent must retrieve approved procedure rather than improvise instruction.",
      "Equipment troubleshooting involving gas, heat or electrical systems must escalate to qualified technicians rather than direct crew action.",
      "APPI applies to applicant data collected during recruitment screening, including guardian consent where applicants are minors.",
    ],
    economics: {
      volumeMonthly: 80000,
      costPerInteraction: 4.5,
      automationRate: 0.55,
      basis: "Seller assumptions from store count and a kitchen-format support profile; validate with Ministop support-desk volumes and equipment incident rates in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent on the store-support line handling kitchen equipment troubleshooting and dispatch plus ordering queries, covering the full store network from day one given the modest scale.",
    expansion: [
      "Add hygiene and food-handling procedure guidance grounded in approved manuals",
      "Introduce part-time applicant screening and interview scheduling",
      "Add equipment failure-pattern reporting to operations and procurement",
    ],
    stakeholders: [
      "Head of Store Operations",
      "Head of Food Service / Kitchen Operations",
      "Head of Human Resources",
      "Head of Information Systems",
      "AEON group procurement liaison",
    ],
    discovery: [
      "Does AEON group procurement constrain subsidiary-level vendor selection, and what is the approval path?",
      "How many equipment incidents are reported per store per month, and what is the average resolution time?",
      "What are the support desk's staffed hours versus the chain's trading hours?",
      "How is food-handling procedure guidance currently distributed and kept current?",
    ],
    flowTemplate: "employee-desk",
    scenario: "A Ministop crew member gets the soft-serve machine restarted during the after-school rush instead of losing the day's signature sales.",
  },

  "ppih": {
    operatingContext:
      "Pan Pacific International Holdings operates the Don Quijote and MEGA Don Quijote discount stores, the Apita and Piago general-merchandise formats acquired with Uny, and an overseas discount business. Its Japanese stores are unlike conventional retail: densely packed, deliberately maze-like, frequently open around the clock, and staffed by lean crews who are expected to merchandise as well as serve. The flagship urban stores have become one of the defining destinations of Japan's inbound tourism boom, so a large share of in-store questions come from visitors asking about product location, availability, tax-free procedures and payment methods, in Chinese, Korean, English and other languages, at hours when few bilingual staff are on the floor. The chain runs its own payment and membership app with a house point and prepaid function, and communicates with domestic shoppers largely through app and store channels.",
    strategicPressure: [
      { text: "Don Quijote stores are among the most visited retail destinations for inbound tourists in Japan, concentrating multilingual customer questions and tax-free processing into specific urban flagship locations.", kind: "verified" },
      { text: "PPIH operates its own membership and payment app with prepaid and point functions, giving it a direct digital relationship with domestic shoppers that could carry conversational servicing.", kind: "verified" },
      { text: "Twenty-four-hour trading with deliberately lean crews means that at night a store may have almost no one available to answer a customer question, let alone in a foreign language.", kind: "inference" },
      { text: "Tax-free procedure questions are both the highest-frequency tourist interaction and the most compliance-sensitive, making them the natural first automation target.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. PPIH's institutional strength is merchandising, store-level entrepreneurship and pricing - its famous operating model devolves buying decisions to store staff. It runs retail and payment systems delivered with external partners and has no conversational-AI engineering practice.",
    whyNotBuild:
      "Multilingual conversational capability across Chinese, Korean, English and Japanese with tax-free procedure accuracy is precisely what a merchandising company cannot build. PPIH would need speech, translation quality, telephony and evaluation disciplines that have no relationship to the merchandising culture that makes it successful.",
    workflows: [
      {
        name: "Multilingual tax-free procedure and eligibility guidance",
        friction: "Tourists queue at the tax-free counter with questions about eligibility, passport requirements, consumable versus general goods thresholds and packaging rules, slowing a counter that is already the store's bottleneck.",
        outcome: "Rules explained accurately in the shopper's language before they reach the counter, cutting queue time and counter rework from ineligible or incomplete claims.",
        channels: ["Voice", "In-store digital", "Web", "Mobile app"],
        systems: ["Tax-free processing system", "Product classification data", "Store master data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Product location and availability inquiries in multiple languages",
        friction: "Shoppers cannot find items in a deliberately dense store layout and stop crew who are merchandising; at night there may be no one available, and rarely anyone who speaks the shopper's language.",
        outcome: "Location and stock answers grounded in store-level inventory in the shopper's language at any hour, without consuming crew time.",
        channels: ["Voice", "Mobile app", "In-store digital"],
        systems: ["Store inventory system", "Planogram and location data", "Product master"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Store crew support and shift-side operational questions",
        friction: "Lean overnight crews handle equipment, till, pricing and security questions with no supervisor present and a head-office desk that is closed.",
        outcome: "Crew get grounded operational answers and escalation paths at any hour, reducing overnight incidents that wait until morning.",
        channels: ["Voice", "LINE", "Store system"],
        systems: ["Store operations manuals", "POS and pricing systems", "Facilities dispatch"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A house membership and payment app with point and prepaid functions",
        "Tax-free counters and processing systems in tourist-facing stores",
        "Multilingual signage and limited bilingual staffing in flagship locations",
        "Store-level operational systems including POS and inventory",
      ],
      gaps: [
        "Tourist questions cannot be answered in the shopper's language outside limited staffed windows",
        "No stock or location self-service beyond signage in a deliberately complex store layout",
        "Overnight crews have no support desk to call",
        "Nothing captures what tourists actually ask, so store operations cannot fix recurring friction",
      ],
    },
    risks: [
      "Tax-free procedure guidance touches customs and consumption-tax rules, so answers must be grounded in current official requirements rather than generated freely.",
      "APPI and cross-border data handling apply where foreign visitors interact through app or voice channels.",
      "Multilingual answers about product suitability, particularly for medicines and cosmetics sold in these stores, must not stray into regulated health advice.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 4,
      automationRate: 0.6,
      basis: "Seller assumptions from flagship-store customer interaction rates and tourist volumes; validate with PPIH counter and store inquiry measurement in discovery.",
    },
    pilotScope:
      "A multilingual voice and in-app agent covering tax-free eligibility and procedure questions plus product location for three tourist-heavy flagship stores, grounded in store inventory and tax-free rule data, in Japanese, English, Chinese and Korean.",
    expansion: [
      "Extend multilingual product and availability answering across the flagship store group",
      "Add overnight store crew operational support",
      "Feed captured inquiry patterns into store layout, signage and stocking decisions",
    ],
    stakeholders: [
      "Head of Store Operations, Japan",
      "Head of Inbound / Tax-Free Business",
      "Head of Digital and Membership Platform",
      "Head of Information Systems",
      "Head of Compliance and Store Legal",
    ],
    discovery: [
      "What is the measured volume of tourist inquiries reaching store staff versus resolved by signage or the app?",
      "How long is the tax-free counter queue at peak, and what share of claims fail on eligibility?",
      "How many bilingual staff are rostered in flagship stores by hour of day?",
      "Could the existing membership app carry a conversational agent, and who owns that roadmap?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Korean visitor at 11pm finds the cosmetics she wants, confirms it qualifies for tax-free, and reaches the counter with the right passport documents ready.",
  },

  "fast-retailing": {
    operatingContext:
      "Fast Retailing operates Uniqlo, GU and other apparel brands, with several hundred Uniqlo stores in Japan alongside one of the country's largest apparel e-commerce operations. Its declared transformation programme has rebuilt supply chain, planning and digital infrastructure around a single information-driven model, and the Uniqlo app is a genuine mass-market channel used for purchases, membership and store services. Operationally, the customer-contact load sits at the seam between online and store: order status and delivery questions, size and fit exchanges, store stock checks before a visit, in-store pickup problems, and repairs or alterations. Japanese store staffing faces the same part-time labour scarcity as every other retailer, so calls that land on store telephones directly reduce floor service quality in stores designed around attentive folding, fitting-room and checkout operations.",
    strategicPressure: [
      { text: "Fast Retailing has run a large, publicly described digital and supply-chain transformation programme, so it has real internal digital capability and will not accept a naive platform pitch.", kind: "verified" },
      { text: "The Uniqlo app is a mainstream Japanese consumer channel, which means any conversational capability must integrate with an existing high-traffic digital relationship rather than replace it.", kind: "verified" },
      { text: "Store stock inquiries and pickup problems are the highest-frequency store telephone interruptions, and each one pulls a staff member off the floor during trading hours.", kind: "inference" },
      { text: "Customer service is run as an operations function rather than inside the product organisation, which is where the addressable gap sits.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Fast Retailing has genuine engineering capability and a strong internal digital identity, so the honest position is not that it cannot build but that its engineering roadmap is committed to supply chain, planning and app product work. The pitch is Japanese conversational quality and store-to-EC servicing workflow delivered as an accelerator on their existing platform and data.",
    whyNotBuild:
      "The transformation programme's value comes from planning, inventory and product engineering - the things that determine markdowns and sell-through. Diverting it into Japanese speech, keigo synthesis, telephony and conversational evaluation would delay the roadmap that actually drives gross margin, to reproduce a purchasable capability.",
    workflows: [
      {
        name: "Order status, delivery and pickup problem resolution",
        friction: "Customers whose online order is delayed or whose store pickup failed call a contact centre or the store itself, and staff must check order, logistics and store systems separately while the customer waits.",
        outcome: "Grounded order and delivery truth delivered instantly across channels, with reschedules and pickup corrections executed in-conversation.",
        channels: ["Voice", "LINE", "Mobile app", "Web"],
        systems: ["Order management system", "Logistics and carrier interfaces", "Store pickup system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Exchange, return and size-issue handling",
        friction: "Size exchanges are the dominant apparel service intent, and each one is a conversation about fit, availability and process that currently requires a human at a store or centre.",
        outcome: "Exchange eligibility, size availability and process handled conversationally with the return initiated in-channel, reducing both centre load and store interruptions.",
        channels: ["Voice", "LINE", "Mobile app"],
        systems: ["Order management", "Inventory system", "Returns and exchange workflow"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Store stock and service inquiries",
        friction: "Customers phone individual stores to check whether an item and size is in stock, pulling staff off the floor at peak trading hours for a question the inventory system can answer.",
        outcome: "Store-level stock and service questions answered from live inventory without touching store staff, protecting floor service quality.",
        channels: ["Voice", "Mobile app", "LINE"],
        systems: ["Store inventory system", "Store master data", "Product master"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mass-market brand app used for purchase, membership and store services",
        "A large own e-commerce operation with store pickup capability",
        "A customer contact centre supporting EC and store customers",
        "A LINE official account used for campaigns and customer notices",
      ],
      gaps: [
        "Store telephones remain an unmanaged customer-service channel that interrupts floor operations",
        "No conversational continuity between an app session and the call or store visit that follows",
        "Exchanges still require human involvement even when the outcome is deterministic",
        "No servicing capacity outside contact-centre hours for a customer base that shops in the evening",
      ],
    },
    risks: [
      "A brand with exacting service standards will require evaluation evidence that automated Japanese matches its in-store politeness norms before exposure.",
      "APPI applies to purchase history and membership data used to personalise responses.",
      "Any answer touching product safety, materials or recall status must be grounded in approved sources rather than generated.",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 4,
      automationRate: 0.65,
      basis: "Seller assumptions from combined EC and store service contact volumes at Japanese retail contact-centre cost; validate against the company's own contact-per-order rate in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling order status, delivery and store-pickup problems for Uniqlo EC customers, integrated with the existing order management and logistics data, with human transfer for complaints and product-safety topics.",
    expansion: [
      "Extend to exchange, return and size-availability handling with in-channel initiation",
      "Add store stock inquiry handling to remove customer calls from store telephones",
      "Introduce proactive delivery-exception notification before customers contact",
    ],
    stakeholders: [
      "Head of Customer Service / CX Operations, Japan",
      "Head of E-Commerce",
      "Head of Store Operations, Japan",
      "Head of Digital / Information Systems",
      "Head of Legal and Personal Data Protection",
    ],
    discovery: [
      "How much of customer service is already on the internal digital roadmap, and for when?",
      "How many customer calls land on store telephones per store per day, and is that measured?",
      "What is the contact rate per online order, and what are the top three reasons?",
      "What politeness and tone standard would an automated Japanese voice have to meet for brand approval?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A customer whose store pickup failed gets the order relocated to a nearby store and confirmed in one message thread, without a store phone call.",
  },

  "nitori": {
    operatingContext:
      "Nitori Holdings is Japan's dominant home-furnishing retailer, operating a vertically integrated model in which it designs, manufactures, imports and distributes its own products through several hundred domestic stores plus a substantial e-commerce business. What makes it operationally distinctive among Japanese retailers is that large-item delivery and assembly is intrinsic to the proposition rather than an add-on - sofas, beds, wardrobes and dining sets must be scheduled into a household's calendar, carried into a Japanese home with real access constraints, and often assembled on site. The company runs significant parts of that home-delivery operation itself rather than handing everything to third-party carriers. The resulting communications load is therefore delivery-shaped: slot booking, slot changes, access questions, redelivery after a failed attempt, damage and missing-parts claims, and assembly appointment coordination.",
    strategicPressure: [
      { text: "Nitori operates a vertically integrated model extending into its own home-delivery and installation capability, so delivery coordination is an in-house cost it directly controls and directly suffers.", kind: "verified" },
      { text: "The 2024 driver working-hour regulations tightened available delivery labour across Japan, making every failed large-item delivery attempt materially more expensive than before.", kind: "verified" },
      { text: "Large-item delivery slots are long and household-specific, so a missed slot wastes a two-person crew for hours rather than a single parcel drop.", kind: "inference" },
      { text: "Nitori has publicised internal IT hiring ambitions, so the proposal must be framed as filling an operations gap rather than substituting for their digital roadmap.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Nitori has stated ambitions to build internal IT capability, so a pure buy framing will be resisted, but its engineering priorities are merchandising, supply chain and store systems. Delivery-coordination conversation is an operations gap where a packaged agent delivers in a quarter what an internal team would need years to reach.",
    whyNotBuild:
      "Even a well-staffed internal IT function would have to add Japanese speech, keigo synthesis, telephony into a delivery contact estate, orchestration into delivery scheduling and route systems, and permanent evaluation. Meanwhile every failed delivery under tightened driver-hour rules costs real money today - the timing argument alone defeats the build case.",
    workflows: [
      {
        name: "Delivery slot booking and change handling",
        friction: "Customers call to book or move a large-item delivery slot, and each call requires a human to check crew capacity, route feasibility and access constraints while the customer waits.",
        outcome: "Slots booked and changed conversationally against live crew capacity at any hour, with access questions captured up front so the crew arrives prepared.",
        channels: ["Voice", "LINE", "SMS", "Web"],
        systems: ["Delivery scheduling system", "Route and crew capacity planning", "Order management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Failed-delivery recovery and redelivery coordination",
        friction: "When a household is not home or access proves impossible, the crew leaves and the customer must phone during limited hours to rebook - burning a second crew visit and days of delay.",
        outcome: "Proactive contact at the moment of failure with immediate rebooking into the next feasible slot, sharply reducing wasted crew hours.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Delivery scheduling", "Crew mobile systems", "Order management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Damage, missing-parts and assembly-issue claims",
        friction: "Damage or missing-part reports arrive by phone and require photographs, part identification and a replacement decision, which currently takes multiple contacts across days.",
        outcome: "Structured claim intake with photograph capture and part identification in one conversation, and replacement or revisit scheduled immediately.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Claims and after-sales system", "Parts inventory", "Delivery scheduling"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A retail app and e-commerce site with order tracking for delivered items",
        "An in-house home-delivery and installation capability alongside partner carriers",
        "A customer contact centre handling delivery and after-sales inquiries",
        "A LINE official account used for campaigns and notices",
      ],
      gaps: [
        "Delivery slot changes cannot be completed outside contact-centre hours",
        "Failed deliveries are recovered reactively, after the customer calls",
        "Access constraints are discovered by the crew at the door rather than captured at booking",
        "Damage and missing-part claims take several contacts to resolve",
      ],
    },
    risks: [
      "Delivery crew scheduling is safety- and hours-regulated under the 2024 driver rules, so any automated booking must respect statutory crew-hour constraints rather than optimise purely for customer preference.",
      "APPI applies to household address, access and photographic data captured during claims and access questioning.",
      "Commitments made conversationally about delivery timing are commercially binding in customer expectation terms, so the agent must only offer slots the scheduling system can actually honour.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 4.5,
      automationRate: 0.6,
      basis: "Seller assumptions from large-item delivery volumes and contact-per-delivery rates; validate with Nitori delivery contact statistics and failed-attempt rates in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling delivery slot booking and changes for large-item orders in one metropolitan delivery region, integrated with live crew capacity and capturing access constraints at booking.",
    expansion: [
      "Add proactive failed-delivery recovery with immediate rebooking at the point of failure",
      "Extend to damage, missing-parts and assembly-issue claim intake with photograph capture",
      "Roll out nationally and add proactive pre-delivery confirmation to suppress failed attempts",
    ],
    stakeholders: [
      "Head of Logistics and Home Delivery Operations",
      "Head of Customer Service Centre",
      "Head of E-Commerce",
      "Head of Information Systems / Digital",
      "Head of After-Sales and Quality",
    ],
    discovery: [
      "What share of large-item deliveries fail on the first attempt, and what does each failure cost in crew hours?",
      "Which parts of home delivery are in-house versus third-party, and how does that change the scheduling integration?",
      "How many delivery-related contacts arrive per month, and through which channels?",
      "Are access constraints captured at order time today, or discovered at the door?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A customer whose sofa delivery could not fit the stairwell is called immediately, rebooked with a hoist-equipped crew, and never has to phone in.",
  },

  "yodobashi-camera": {
    operatingContext:
      "Yodobashi Camera is a privately held electronics retailer operating large flagship stores at major railway hubs alongside one of Japan's strongest own-brand e-commerce operations, notable for extremely fast fulfilment in metropolitan areas and for a loyalty point programme that keeps customers inside its ecosystem. Unusually among Japanese retailers it has a reputation for developing its core commerce and logistics systems internally rather than buying packaged retail software, which shapes how any technology proposal must be framed. Its contact load is a mix of e-commerce servicing - order status, delivery coordination, returns, technical product questions before and after purchase - and store-side demand at flagship locations where tourist traffic adds multilingual product and tax-free questions to an already busy floor.",
    strategicPressure: [
      { text: "Yodobashi runs a large own e-commerce operation known for rapid metropolitan delivery, which sets a customer expectation that servicing responsiveness must match fulfilment responsiveness.", kind: "verified" },
      { text: "The company has a long-standing reputation for building its commerce and logistics systems in-house rather than buying packaged software, so any external platform must be positioned as complementary.", kind: "inference" },
      { text: "Electronics servicing involves genuinely technical pre-purchase and post-purchase questions - compatibility, specification, setup, warranty - which are expensive to staff and highly repeatable.", kind: "inference" },
      { text: "Flagship stores at major stations carry heavy tourist traffic whose multilingual questions cannot be staffed at peak without diverting product specialists from selling.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. This is a company that visibly prefers to build, so the framing must be that the conversational stack complements systems it already owns. The realistic entry is Japanese and multilingual voice quality plus evaluation discipline layered onto its own order, inventory and logistics data.",
    whyNotBuild:
      "Yodobashi's internal engineering is deployed on commerce and logistics - the systems that produce its fulfilment advantage. Adding Japanese and multilingual speech, keigo synthesis, telephony and conversational evaluation would divert that team from the capability that actually differentiates it, and speech quality in particular is not something a retail engineering group reaches quickly.",
    workflows: [
      {
        name: "Delivery coordination and order-status handling",
        friction: "Fast fulfilment raises the stakes on exceptions: when a delivery slips or an address needs changing, the customer expects an immediate answer and instead reaches a queue.",
        outcome: "Live delivery truth and slot changes handled conversationally at any hour, matching servicing responsiveness to the fulfilment promise.",
        channels: ["Voice", "Web", "LINE", "Mobile app"],
        systems: ["Order management system", "In-house logistics platform", "Carrier interfaces"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Technical product and compatibility inquiries",
        friction: "Pre-purchase compatibility questions and post-purchase setup problems are answered by product specialists whose time is far better spent selling on the floor or advising high-value customers.",
        outcome: "Specification, compatibility and setup questions answered from grounded product data at any hour, escalating only genuinely complex cases to specialists.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Product master and specification data", "Support knowledge base", "Order history"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Multilingual flagship-store product and tax-free support",
        friction: "Tourist customers at station flagships need product, voltage, warranty and tax-free answers in their own language, and bilingual floor staff are a scarce resource at peak.",
        outcome: "Multilingual product and tax-free answers available continuously without consuming floor specialists, improving conversion on high-value tourist purchases.",
        channels: ["Voice", "In-store digital", "Web"],
        systems: ["Product master", "Tax-free processing system", "Store inventory"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A large own-brand e-commerce platform with rapid metropolitan delivery",
        "A loyalty point programme integrated across store and online purchases",
        "In-house developed commerce and logistics systems",
        "Store-based product specialists and tax-free counters at flagship locations",
      ],
      gaps: [
        "Delivery exceptions cannot be resolved conversationally outside centre hours",
        "Technical product questions always consume specialist time",
        "Multilingual support at flagship stores depends on which bilingual staff are rostered",
        "No conversational continuity between the site, the app and the phone call",
      ],
    },
    risks: [
      "A self-reliant private company will scrutinise any external dependency in its customer-facing stack, so integration boundaries and data control must be settled early.",
      "Product answers touching electrical safety, voltage compatibility for export, or warranty terms must be grounded rather than generated.",
      "APPI applies to purchase history and point-programme data used to personalise responses.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 4.2,
      automationRate: 0.6,
      basis: "Seller assumptions from e-commerce order volumes and electronics contact-per-order rates; validate with the company's own servicing volumes and specialist time allocation in discovery.",
    },
    pilotScope:
      "A Japanese-language voice agent handling order status and delivery coordination for metropolitan e-commerce orders, integrated with the in-house order and logistics platform, with escalation for complaints and technical escalation cases.",
    expansion: [
      "Extend to technical product and compatibility inquiries with grounded specification data",
      "Add multilingual flagship-store product and tax-free support",
      "Introduce proactive delivery-exception notification ahead of customer contact",
    ],
    stakeholders: [
      "Head of E-Commerce Operations",
      "Head of Customer Service",
      "Head of Logistics",
      "Head of Systems Development",
      "Head of Store Operations for flagship locations",
    ],
    discovery: [
      "How open is the company to an external conversational layer over its in-house systems, and what integration model would it accept?",
      "What is the contact rate per online order, and what proportion are delivery exceptions?",
      "How much specialist floor time is consumed by telephone technical questions?",
      "What tourist share do flagship stores see, and how is multilingual support staffed today?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A customer whose same-day delivery slipped is offered a revised window and a store pickup alternative in one call, at ten at night.",
  },

  "bic-camera": {
    operatingContext:
      "Bic Camera operates large electronics and general-merchandise stores concentrated at major urban railway terminals, together with the Kojima and Sofmap chains, giving it a footprint weighted toward high-footfall city-centre locations rather than suburban roadside sites. Those terminal-adjacent flagships are among the most visited retail destinations for inbound tourists in Japan, so the stores handle a continuous flow of foreign-language product questions, voltage and export-compatibility queries, warranty explanations and tax-free procedure processing - all of which land on floor staff who are simultaneously serving domestic customers. Domestic contact runs through the store telephone, an e-commerce operation and a point-card membership programme. Store-level labour scarcity is acute in exactly the urban locations where the tourist load is highest.",
    strategicPressure: [
      { text: "Bic Camera's flagship stores sit at major railway terminals and are among the most visited electronics retail destinations for inbound visitors, concentrating multilingual and tax-free demand.", kind: "verified" },
      { text: "Tax-free processing at these stores is high-volume and procedurally strict, making the counter a persistent bottleneck at peak tourist hours.", kind: "inference" },
      { text: "Electronics purchases by tourists involve voltage, plug, warranty and export questions that domestic staff are not always equipped to answer even in Japanese.", kind: "inference" },
      { text: "Urban store labour scarcity means additional bilingual staffing is not available at any realistic wage, making elastic multilingual capacity the only practical route.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Bic Camera is a merchandising and store-operations business whose systems are vendor-delivered, with no software engineering organisation. Multilingual conversational capability is exactly the sort of capability such a retailer procures rather than constructs.",
    whyNotBuild:
      "The retailer would need speech and generation quality across Japanese, English, Chinese and Korean, plus telephony, inventory orchestration and evaluation - none of which relates to buying, merchandising or store operations. The tourist demand is present now and seasonal, which further favours capability that can be switched on rather than built.",
    workflows: [
      {
        name: "Multilingual tourist product and tax-free guidance",
        friction: "Tourists ask about voltage compatibility, plug types, warranty coverage abroad and tax-free eligibility, and either wait for a scarce bilingual staff member or make a purchase they later return.",
        outcome: "Accurate multilingual answers on compatibility, warranty and tax-free rules delivered instantly, raising conversion and cutting returns and counter rework.",
        channels: ["Voice", "In-store digital", "Web", "Mobile app"],
        systems: ["Product master and specification data", "Tax-free processing system", "Store inventory"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Store stock and reservation inquiries",
        friction: "Customers phone flagship stores to check whether a model is in stock before travelling across the city, interrupting floor staff during peak trading.",
        outcome: "Live store-level stock answers and reservation holds handled without touching floor staff, in Japanese or the customer's language.",
        channels: ["Voice", "Web", "Mobile app"],
        systems: ["Store inventory system", "Reservation and hold system", "Product master"],
        value: 3,
        complexity: 2,
      },
      {
        name: "After-sales, repair and warranty inquiries",
        friction: "Repair status, warranty coverage and manufacturer-referral questions generate repeat calls that a service counter answers by reading a screen.",
        outcome: "Repair status and warranty coverage answered instantly with proactive status updates, freeing the service counter for physical intake work.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Repair and after-sales system", "Warranty data", "Purchase history"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Tax-free counters and processing systems in flagship terminal stores",
        "A point-card membership programme spanning store and online purchases",
        "An e-commerce operation alongside the store network",
        "Limited bilingual floor staffing and multilingual signage in tourist-heavy stores",
      ],
      gaps: [
        "Multilingual product answers depend on which bilingual staff happen to be on shift",
        "Stock checks by phone still interrupt floor staff at peak",
        "Repair and warranty status must be pulled by the customer through a service counter",
        "Nothing captures what tourists ask, so range and signage decisions are uninformed",
      ],
    },
    risks: [
      "Tax-free procedure guidance must follow current consumption-tax and customs requirements exactly, since errors create both customer detriment and compliance exposure.",
      "Electrical compatibility and export-use advice carries safety implications and must be grounded in manufacturer specification data.",
      "APPI and cross-border considerations apply where foreign visitors interact through digital or voice channels.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 4.2,
      automationRate: 0.6,
      basis: "Seller assumptions from flagship-store footfall and inquiry rates plus after-sales volume; validate with store-level inquiry measurement and tourist transaction share in discovery.",
    },
    pilotScope:
      "A multilingual voice and in-store digital agent for two terminal flagship stores covering tax-free eligibility, voltage and warranty questions and live stock checks in Japanese, English, Chinese and Korean.",
    expansion: [
      "Extend stock and reservation handling across the flagship store group and Kojima and Sofmap formats",
      "Add after-sales repair and warranty status with proactive updates",
      "Feed captured tourist inquiry patterns into range, signage and staffing decisions",
    ],
    stakeholders: [
      "Head of Store Operations",
      "Head of Inbound / Tax-Free Business",
      "Head of E-Commerce and Membership",
      "Head of Information Systems",
      "Head of After-Sales Service",
    ],
    discovery: [
      "What share of flagship-store transactions are tax-free, and how is that counter staffed at peak?",
      "How many customer calls reach store telephones per day, and what proportion are stock checks?",
      "How is bilingual staffing rostered across the flagship network today?",
      "What proportion of tourist purchases are returned or disputed on compatibility grounds?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Chinese visitor confirms a camera model is in stock at Ikebukuro, that it works on her home voltage, and exactly what her passport needs for tax-free - before she leaves her hotel.",
  },

  "matsukiyococokara": {
    operatingContext:
      "MatsukiyoCocokara is the drugstore group formed from the combination of Matsumotokiyoshi and Cocokara Fine, operating thousands of stores that split into two very different businesses under one roof. Its urban stores - particularly in Tokyo, Osaka and other tourist centres - are cosmetics and beauty destinations with heavy inbound-visitor traffic and a private-brand cosmetics range that draws foreign shoppers specifically. Its dispensing pharmacies serve an entirely different customer: older Japanese patients on chronic medication who collect prescriptions regularly and are subject to the medication follow-up obligations that Japanese pharmacists now carry after dispensing. That obligation converts what used to be a counter transaction into an ongoing communications duty performed by the scarcest resource in the business - the licensed pharmacist.",
    strategicPressure: [
      { text: "Japanese pharmacists carry a legal obligation to follow up on patients' medication use after dispensing, which turned post-dispensing contact from optional service into required professional work.", kind: "verified" },
      { text: "The group combines high-traffic urban cosmetics stores serving inbound visitors with dispensing pharmacies serving elderly chronic patients, two contact profiles with nothing in common except the staff who absorb both.", kind: "verified" },
      { text: "Pharmacist time is the binding constraint on dispensing growth, so every minute spent on routine follow-up calls or prescription-ready notifications is a minute not spent counselling or dispensing.", kind: "inference" },
      { text: "Electronic prescription infrastructure is changing how prescriptions reach pharmacies, which creates a window to redesign patient communication rather than digitise the existing phone process.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Drugstore groups procure retail, dispensing and point-programme systems from specialist vendors and integrators; their internal capability is merchandising, store operations and pharmacy practice. There is no engineering organisation building conversational technology anywhere in this group.",
    whyNotBuild:
      "The group would need Japanese speech tuned for elderly patients, clinically-safe conversational boundaries, telephony, dispensing-system orchestration and permanent evaluation - a stack with no relationship to retail merchandising or pharmacy practice. Meanwhile the pharmacist-time constraint is binding today, and the regulatory follow-up obligation does not wait for a build.",
    workflows: [
      {
        name: "Prescription-ready notification and collection coordination",
        friction: "Patients are told a prescription will be ready and then either wait in store or call to check, and pharmacy staff make manual calls when items must be ordered in.",
        outcome: "Automatic notification when the prescription is ready with collection time confirmed conversationally, eliminating both waiting-room time and manual callback work.",
        channels: ["Voice", "LINE", "SMS", "Mobile app"],
        systems: ["Dispensing system", "Prescription queue", "Store master data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Post-dispensing medication follow-up",
        friction: "The pharmacist follow-up obligation is discharged by a licensed professional making individual calls, which is the most expensive possible way to ask a set of structured questions.",
        outcome: "Structured follow-up conducted conversationally with responses recorded against the patient record, and anything clinically concerning escalated to a pharmacist immediately.",
        channels: ["Voice", "LINE"],
        systems: ["Dispensing system", "Patient medication record", "Pharmacist workflow"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Multilingual store and cosmetics product inquiries",
        friction: "Tourist shoppers ask about product availability, ingredient suitability and purchase limits in urban cosmetics stores, occupying staff who are also serving domestic customers and dispensing patients.",
        outcome: "Multilingual product and availability answers delivered without staff involvement, with anything touching medicines routed to qualified staff.",
        channels: ["Voice", "Mobile app", "In-store digital"],
        systems: ["Store inventory", "Product master", "Point programme interfaces"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A group retail app with point programme and store functions",
        "A LINE official account used for campaigns and customer notices",
        "Dispensing pharmacies with prescription management systems",
        "Private-brand cosmetics ranges that attract inbound shoppers to urban stores",
      ],
      gaps: [
        "Prescription readiness is communicated inconsistently, often by manual phone call",
        "Medication follow-up depends entirely on pharmacist availability",
        "Multilingual product help exists only where a bilingual staff member is present",
        "Patient communication is not recorded in a form that evidences the follow-up obligation",
      ],
    },
    risks: [
      "Medication follow-up is a regulated pharmacist duty - an automated agent may gather structured information but must never give clinical advice, and escalation criteria must be provable.",
      "Patient medication data is special-care information under APPI requiring explicit consent, restricted access and clear retention rules.",
      "Advertising and product-claim rules for medicines and quasi-drugs constrain what may be said about any product in an automated conversation.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 4.5,
      automationRate: 0.55,
      basis: "Seller assumptions from dispensing volumes plus urban store inquiry rates; validate with the group's dispensing-store count, prescription volumes and follow-up call statistics in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling prescription-ready notification and collection coordination for one metropolitan dispensing-pharmacy cluster, integrated with the dispensing system and escalating any clinical question to a pharmacist.",
    expansion: [
      "Add structured post-dispensing medication follow-up with pharmacist escalation and record write-back",
      "Extend to refill and repeat-prescription reminders across the dispensing network",
      "Introduce multilingual product and availability support in tourist-heavy urban stores",
    ],
    stakeholders: [
      "Head of Pharmacy / Dispensing Business",
      "Chief Pharmacist or Head of Pharmacy Practice",
      "Head of Store Operations",
      "Head of Digital and Membership",
      "Head of Legal and Personal Data Protection",
    ],
    discovery: [
      "How is the medication follow-up obligation discharged today, and how much pharmacist time does it consume per store?",
      "What share of stores have dispensing pharmacies, and what is the growth plan?",
      "How are patients notified today that a prescription is ready?",
      "What clinical escalation criteria would the chief pharmacist require before any automated patient contact?",
    ],
    flowTemplate: "appointments",
    scenario: "A chronic-medication patient is told her prescription is ready, confirms a pickup time, and answers her follow-up questions without a pharmacist making a single call.",
  },

  "welcia-holdings": {
    operatingContext:
      "Welcia Holdings is the largest drugstore group in Japan by revenue, operating within the AEON group with a strategy built explicitly on dispensing pharmacies and extended trading hours - a large share of its stores include a dispensing counter, and a meaningful number operate around the clock. That combination makes it the most pharmacist-dependent of the major drugstore chains: dispensing growth is the profit engine, and pharmacist recruitment is the constraint on how fast it can grow. Its patients are disproportionately older, on chronic medication, and served under the post-dispensing follow-up obligations Japanese pharmacists now carry. Alongside dispensing, the stores run a conventional drugstore business with cosmetics, daily goods and food, supported by AEON group point and payment programmes.",
    strategicPressure: [
      { text: "Welcia's growth strategy centres on dispensing pharmacies and long trading hours, which makes licensed pharmacist availability the single binding constraint on store expansion.", kind: "verified" },
      { text: "The pharmacist follow-up obligation after dispensing creates recurring professional communication work that scales directly with prescription volume.", kind: "verified" },
      { text: "Twenty-four-hour stores mean patient and customer contact arrives at hours when no head-office support and few staff are available.", kind: "inference" },
      { text: "Ongoing consolidation among AEON-affiliated drugstore chains makes the ownership of pharmacy operations technology a live question that could either accelerate or stall a deployment.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Welcia is a retailer within a group whose technology investments have been in payments, point programmes and retail systems. Pharmacy operations technology is procured from specialist dispensing-system vendors, and there is no engineering organisation capable of or chartered for conversational development.",
    whyNotBuild:
      "The chain's problem is a shortage of licensed pharmacists, not a shortage of software ideas. Building speech, clinically-bounded dialogue, telephony, dispensing orchestration and evaluation would take years while pharmacist time continues to be consumed by routine calls that could be handled today by a bought capability.",
    workflows: [
      {
        name: "Refill and repeat-prescription reminder calls",
        friction: "Patients on chronic medication run out and either go without or arrive unannounced; reminder calls, where they happen at all, are made manually by pharmacy staff.",
        outcome: "Timely reminders with collection or re-prescription arranged conversationally, improving adherence and smoothing dispensing workload across the day.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Dispensing system", "Patient medication record", "Appointment and queue management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Post-dispensing medication follow-up",
        friction: "Pharmacists discharge the follow-up obligation by making individual calls, the most expensive way to collect a structured set of answers, and coverage suffers when the counter is busy.",
        outcome: "Complete structured follow-up coverage with responses recorded and clinical concerns escalated to a pharmacist within minutes rather than at the next quiet moment.",
        channels: ["Voice", "LINE"],
        systems: ["Dispensing system", "Patient medication record", "Pharmacist escalation workflow"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Store and pharmacy inquiry handling including overnight hours",
        friction: "Twenty-four-hour stores receive calls about opening hours, stock, dispensing availability and pharmacist presence at times when there is nobody free to answer.",
        outcome: "Store, stock and dispensing-availability questions answered continuously without pulling a pharmacist or lone night staff member off the floor.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Store master data", "Inventory system", "Pharmacist rostering"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A large dispensing-pharmacy network integrated into drugstore locations",
        "AEON group point and payment programme participation",
        "A LINE official account and app used for campaigns and store information",
        "Dispensing systems and patient medication records in every pharmacy",
      ],
      gaps: [
        "Refill reminders depend on staff finding time to make calls",
        "Follow-up obligation coverage varies with counter workload",
        "Overnight and extended-hours contact has no support capacity",
        "Patients cannot check dispensing availability or pharmacist presence before travelling",
      ],
    },
    risks: [
      "Post-dispensing follow-up is a pharmacist duty - automated contact may collect structured information only, with clinical judgement and advice reserved to licensed staff and escalation criteria evidenced.",
      "Patient medication data is special-care personal information under APPI requiring explicit consent and restricted handling.",
      "Any statement about medicines must stay within advertising and product-claim rules for pharmaceuticals.",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 4.5,
      automationRate: 0.55,
      basis: "Seller assumptions from dispensing volumes across a large pharmacy network; validate with the group's prescription counts, follow-up coverage and pharmacist time allocation in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling refill and repeat-prescription reminders for chronic-medication patients across one prefecture's dispensing stores, with dispensing-system integration and pharmacist escalation.",
    expansion: [
      "Add structured post-dispensing follow-up with record write-back and escalation evidence",
      "Extend to store, stock and dispensing-availability inquiry handling including overnight hours",
      "Roll out nationally with adherence and dispensing-workload reporting to pharmacy operations",
    ],
    stakeholders: [
      "Head of Pharmacy Business",
      "Chief Pharmacist / Head of Pharmacy Practice",
      "Head of Store Operations",
      "Head of Information Systems",
      "Head of Legal and Personal Data Protection",
    ],
    discovery: [
      "How much pharmacist time per store per week goes to follow-up and reminder calls today?",
      "What is the current follow-up coverage rate against dispensed prescriptions?",
      "Where does the Tsuruha integration leave ownership of pharmacy operations technology decisions?",
      "What escalation protocol would the chief pharmacist require before automated patient contact?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient two days from running out of her blood-pressure medication is reminded, re-books her prescription collection, and never has a gap in treatment.",
  },

  "tsuruha-holdings": {
    operatingContext:
      "Tsuruha Holdings grew from Hokkaido into one of Japan's largest drugstore groups, operating thousands of stores under several banners with a footprint weighted toward regional and rural Japan rather than the urban cosmetics corridors that dominate its Tokyo-centric rivals. That geography defines its operating challenge: pharmacist and store-staff recruitment is hardest exactly where its stores are, in prefectures losing working-age population, and its customers are older and less likely to use digital channels than urban shoppers. Dispensing has been a growth priority, bringing with it the post-dispensing pharmacist follow-up obligation across a widely dispersed network. Ownership consolidation within the AEON drugstore bloc has put group-level technology and operations decisions into flux.",
    strategicPressure: [
      { text: "Tsuruha's store footprint is weighted toward regional and rural Japan, where pharmacist and store-staff recruitment is structurally hardest.", kind: "verified" },
      { text: "Dispensing growth brings the pharmacist follow-up obligation to hundreds of thinly-staffed regional pharmacies where a single pharmacist may cover the whole counter.", kind: "inference" },
      { text: "A dispersed rural network is the strongest possible case for centralising patient communication, because local staffing cannot be improved by recruitment at any wage.", kind: "inference" },
      { text: "Consolidation within the AEON drugstore bloc means the entity that will own pharmacy operations technology decisions may change during the sales cycle.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Tsuruha is a retail and dispensing operator using vendor-supplied store and pharmacy systems, with no software engineering organisation. Group consolidation reinforces this: a business in the middle of ownership change does not start platform builds.",
    whyNotBuild:
      "The chain's constraint is licensed and store labour in regional Japan - the same labour market that would have to supply engineering talent. Speech, clinically-bounded dialogue, telephony, dispensing orchestration and evaluation cannot be assembled there, and centralised bought capability is precisely what a dispersed rural network needs.",
    workflows: [
      {
        name: "Centralised patient reminder and follow-up communication",
        friction: "Each regional pharmacy makes its own reminder and follow-up calls when the counter allows, so coverage varies enormously by store and by day.",
        outcome: "One centralised communication capability giving every store the same reminder and follow-up coverage regardless of local staffing, with pharmacist escalation routed to whoever is on duty.",
        channels: ["Voice", "SMS", "LINE"],
        systems: ["Dispensing system", "Patient medication record", "Pharmacist rostering"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Store and dispensing availability inquiries",
        friction: "Rural customers phone to ask whether a pharmacist is on duty, whether an item is in stock, or when the store closes - questions that interrupt a lone staff member serving a counter queue.",
        outcome: "Store, stock and pharmacist-availability answers delivered instantly, saving customers wasted journeys in areas where the next store is far away.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Store master data", "Inventory system", "Pharmacist rostering"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Store staff and pharmacy operational support",
        friction: "Store staff in remote locations call head office about systems, dispensing procedure, ordering and equipment, and wait because support is centralised and thin.",
        outcome: "Grounded operational answers available continuously to every store regardless of location, with escalation only where a human decision is required.",
        channels: ["Voice", "LINE", "Store system"],
        systems: ["Operations and dispensing procedure manuals", "Ordering system", "Facilities dispatch"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A large multi-banner store network with dispensing pharmacies across regional Japan",
        "A group point programme and retail app",
        "Dispensing systems and patient medication records in each pharmacy",
        "Centralised head-office support functions for a dispersed store base",
      ],
      gaps: [
        "Reminder and follow-up coverage varies store by store with local staffing",
        "Customers cannot check pharmacist availability before making a long journey",
        "Remote store staff wait for centralised support during busy periods",
        "No consistent record of patient communication across the network",
      ],
    },
    risks: [
      "Post-dispensing follow-up is a licensed pharmacist duty, so automated contact must be strictly information-gathering with evidenced escalation.",
      "Patient medication information is special-care data under APPI, and a centralised communication layer must satisfy consent and access-control requirements across all banners.",
      "Ownership consolidation could change the contracting entity mid-cycle, so the commercial structure must anticipate a group-level counterparty.",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 4.2,
      automationRate: 0.55,
      basis: "Seller assumptions from dispensing volumes across a large regional network; validate with the group's prescription counts and current follow-up coverage in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and SMS agent providing centralised refill reminders and store and pharmacist-availability answers for one regional store cluster, integrated with dispensing and rostering data.",
    expansion: [
      "Add structured post-dispensing follow-up with pharmacist escalation across the network",
      "Extend to store staff operational support for remote locations",
      "Consolidate patient communication reporting across all banners for pharmacy operations",
    ],
    stakeholders: [
      "Head of Pharmacy Business",
      "Chief Pharmacist / Head of Pharmacy Practice",
      "Head of Store Operations",
      "Head of Information Systems",
      "Group integration lead for AEON drugstore consolidation",
    ],
    discovery: [
      "Which entity will own pharmacy operations technology decisions once the current consolidation settles?",
      "What is the variance in reminder and follow-up coverage between the best and worst performing stores?",
      "How many customer calls per store per day are availability or opening-hours questions?",
      "How is pharmacist rostering data held, and could it be queried in real time?",
    ],
    flowTemplate: "appointments",
    scenario: "A customer forty minutes from her nearest Tsuruha pharmacy confirms a pharmacist is on duty and her prescription is ready before she starts driving.",
  },

  "sundrug": {
    operatingContext:
      "Sundrug operates a major Japanese drugstore chain across two distinct formats - urban discount stores competing hard on price for daily goods and cosmetics, and dispensing pharmacies serving prescription patients. Unlike several of its larger rivals it sits outside the AEON-affiliated drugstore bloc, which means group procurement politics do not govern its vendor choices and decisions can be taken on their own merits. Its store staff carry the standard drugstore split of duties - registered-seller medicine counselling, cosmetics advice, restocking and checkout - while its pharmacists carry dispensing plus the post-dispensing follow-up obligation Japanese pharmacy practice now requires. Customer contact is store-centric and telephone-heavy, with the chain's app and point programme used mainly for promotions rather than servicing.",
    strategicPressure: [
      { text: "Sundrug operates both discount drugstore and dispensing-pharmacy formats, so it carries pharmacist scarcity and price-competitive store labour pressure simultaneously.", kind: "verified" },
      { text: "The post-dispensing pharmacist follow-up obligation applies across its dispensing estate and consumes licensed professional time that dispensing growth requires.", kind: "verified" },
      { text: "Independence from the AEON drugstore bloc simplifies vendor selection and shortens the approval path relative to group-affiliated competitors.", kind: "inference" },
      { text: "A discount-format operator will judge any proposal primarily on cost per handled contact rather than experience narrative, so the business case must lead with labour minutes removed.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Sundrug is a retail and dispensing operator running vendor-supplied store and pharmacy systems, with no engineering organisation. Its competitive model is price and store productivity, which argues for buying operational capability at a known cost rather than funding development.",
    whyNotBuild:
      "A discount operator's entire logic is keeping cost per transaction low. Building speech, clinically-bounded dialogue, telephony, dispensing orchestration and evaluation would be a large fixed cost with a multi-year payback, against a bought capability that reduces labour minutes from the first month.",
    workflows: [
      {
        name: "Dispensing reminder and prescription-ready notification",
        friction: "Prescription readiness and refill timing are communicated by manual staff calls when the counter allows, so patients wait in store or run out of medication.",
        outcome: "Automatic readiness notification and refill reminders with collection times confirmed conversationally, smoothing counter workload and improving adherence.",
        channels: ["Voice", "SMS", "LINE"],
        systems: ["Dispensing system", "Patient medication record", "Store queue management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Post-dispensing follow-up information gathering",
        friction: "Pharmacists must follow up after dispensing but do so between counter tasks, so coverage is inconsistent and the record of what was asked is thin.",
        outcome: "Consistent structured follow-up with responses recorded against the patient record and clinical concerns escalated immediately to a pharmacist.",
        channels: ["Voice", "LINE"],
        systems: ["Dispensing system", "Patient medication record", "Pharmacist workflow"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Store product, stock and opening-hours inquiries",
        friction: "Customers call stores about stock, price and hours, interrupting staff who are restocking or serving a checkout queue in a format built on lean labour.",
        outcome: "Routine store questions resolved without touching staff, with anything touching medicines routed to a registered seller or pharmacist.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Store master data", "Inventory system", "Product master"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A dual-format store network combining discount drugstores and dispensing pharmacies",
        "A chain app and point programme used mainly for promotions",
        "Dispensing systems and patient medication records in pharmacy locations",
        "Store-level telephone handling as the main customer contact channel",
      ],
      gaps: [
        "Prescription readiness is communicated manually or not at all",
        "Follow-up coverage depends on counter workload rather than protocol",
        "Store telephone calls interrupt lean-format staffing continuously",
        "No record connecting patient communication to the dispensing record",
      ],
    },
    risks: [
      "Automated patient contact may gather structured information only - clinical advice and judgement must remain with pharmacists and escalation must be provable.",
      "Patient medication data is special-care information under APPI requiring explicit consent and restricted handling.",
      "Registered-seller medicine counselling rules mean any conversation about over-the-counter medicines must route to qualified staff rather than answer directly.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 4.2,
      automationRate: 0.55,
      basis: "Seller assumptions from dispensing volumes and store inquiry rates; validate with Sundrug prescription counts, follow-up coverage and store call volumes in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and SMS agent handling prescription-ready notification and refill reminders across one regional dispensing cluster, with dispensing-system integration and immediate pharmacist escalation on any clinical signal.",
    expansion: [
      "Add structured post-dispensing follow-up with record write-back",
      "Extend to store product, stock and opening-hours inquiry handling",
      "Introduce adherence and counter-workload reporting to pharmacy operations",
    ],
    stakeholders: [
      "Head of Pharmacy Business",
      "Chief Pharmacist / Head of Pharmacy Practice",
      "Head of Store Operations",
      "Head of Information Systems",
      "Head of Legal and Compliance",
    ],
    discovery: [
      "What share of revenue and store count is dispensing, and what is the growth target?",
      "How much pharmacist time per store goes to reminder and follow-up calls today?",
      "How many customer calls reach store telephones daily, and what are the top intents?",
      "What is the vendor approval path now that group procurement is not a constraint?",
    ],
    flowTemplate: "appointments",
    scenario: "A Sundrug patient is reminded her repeat prescription is due, confirms a pickup slot, and the pharmacist only gets involved because she mentions a new side effect.",
  },

  "cainz": {
    operatingContext:
      "Cainz is the leading home-centre chain in Japan, part of the Beisia group, operating large-format stores that combine DIY materials, gardening, home improvement, pet supplies and a substantial private-brand range. Its stores sell items that are physically awkward - lumber, garden equipment, large furniture, building materials - which means large-item delivery, in-store cutting and processing services, and installation or home-improvement coordination are core to the offer rather than peripheral. It is also unusually digitally active for a Japanese home-centre operator, having invested in its own app, in-store digital services such as order pickup, and internal digital capability. Its customers are a mix of domestic DIY consumers and small trade customers who buy materials for jobs and need availability and delivery answers quickly.",
    strategicPressure: [
      { text: "Cainz has invested visibly in digital capability including its own app and in-store digital services, so it will assess proposals as a partner rather than as a first-time buyer.", kind: "verified" },
      { text: "Large-item delivery and installation coordination became materially more expensive after the 2024 driver working-hour rules tightened available delivery labour nationwide.", kind: "verified" },
      { text: "Home-centre product breadth generates constant availability and specification questions that store staff answer while also cutting timber and serving checkouts.", kind: "inference" },
      { text: "Trade customers buying materials for scheduled jobs are more delivery-sensitive than consumers, so failed or vague delivery commitments cost repeat business directly.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Cainz has real internal digital ambition and an app roadmap, so the right posture is complementary: the conversational layer for delivery scheduling and store inquiries fills an operations gap their digital team has not prioritised and would take years to build to Japanese voice quality.",
    whyNotBuild:
      "Their digital investment is aimed at the app and in-store customer experience - the visible differentiators. Adding Japanese speech, keigo synthesis, telephony, delivery-scheduling orchestration and evaluation would divert that team from its roadmap while the delivery-cost problem worsens under tightened driver rules.",
    workflows: [
      {
        name: "Large-item delivery and installation scheduling",
        friction: "Delivery and installation slots for bulky items are arranged by phone against crew and vehicle capacity, and each booking or change requires a staff member to check availability manually.",
        outcome: "Slots booked and changed conversationally against live capacity, with access and site constraints captured up front so crews arrive able to complete.",
        channels: ["Voice", "LINE", "Web", "Mobile app"],
        systems: ["Delivery scheduling system", "Installation and service dispatch", "Order management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Store stock, specification and processing-service inquiries",
        friction: "Customers and trade buyers phone stores to check material availability, dimensions and whether cutting or processing services are available that day, pulling staff off the workshop and floor.",
        outcome: "Live stock, specification and service-availability answers without staff involvement, so trade customers can plan jobs and consumers avoid wasted trips.",
        channels: ["Voice", "Mobile app", "Web"],
        systems: ["Store inventory system", "Product specification data", "In-store service scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Home-improvement and reform service coordination",
        friction: "Reform and installation inquiries start as vague phone questions, require a site survey to be arranged, and lose days moving between store staff, contractors and the customer.",
        outcome: "Structured intake that qualifies the job, captures site details and books the survey directly, shortening the path from inquiry to quoted work.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Reform and service management system", "Contractor scheduling", "CRM"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "A retail app with store services including order and pickup functions",
        "In-store processing services such as cutting and tool rental",
        "A delivery and installation operation for large items",
        "Store-level telephone handling for customer and trade inquiries",
      ],
      gaps: [
        "Delivery scheduling cannot be completed outside store hours",
        "Trade customers cannot check material availability without calling a store",
        "Reform and installation inquiries have no structured intake before a human gets involved",
        "Access and site constraints are discovered at delivery rather than at booking",
      ],
    },
    risks: [
      "Delivery and installation crew scheduling must respect the 2024 driver working-hour constraints, so automated booking cannot offer slots the crew roster cannot legally serve.",
      "Product answers touching structural materials, electrical goods or chemicals must be grounded in specification data rather than generated.",
      "APPI applies to household address, site and contact data captured during delivery and reform intake.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 4.2,
      automationRate: 0.6,
      basis: "Seller assumptions from store network scale, delivery volumes and trade-customer inquiry rates; validate with Cainz store call volumes and delivery contact rates in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling large-item delivery scheduling and changes for one regional store cluster, integrated with live crew capacity and capturing site access constraints at booking.",
    expansion: [
      "Add store stock, specification and processing-service inquiry handling for trade and consumer customers",
      "Extend to reform and installation intake with survey booking",
      "Introduce proactive pre-delivery confirmation and failed-delivery recovery",
    ],
    stakeholders: [
      "Head of Store Operations",
      "Head of Logistics and Delivery Services",
      "Head of Reform / Home Services Business",
      "Head of Digital / IT",
      "Head of Customer Service",
    ],
    discovery: [
      "How does the internal digital team scope contact-centre investment relative to the app roadmap?",
      "How many delivery bookings and changes are handled by phone per month, and by whom?",
      "What share of store calls come from trade customers checking availability?",
      "What is the current first-attempt success rate for large-item deliveries?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A builder confirms timber stock, books a cutting slot and schedules a next-day site delivery in one call, before the store has opened.",
  },

  "shimamura": {
    operatingContext:
      "Shimamura operates around two thousand low-price apparel stores across several banners covering womenswear, children's and baby goods and general fashion, almost all in suburban and roadside locations rather than city centres. Its operating model is famously frugal and systematised: stores are run by very small teams working to centrally-defined merchandising and replenishment rules, with deliberately minimal store-level discretion and correspondingly minimal store-level overhead. That leanness is the strategy, and it means any activity that pulls a staff member away from the floor - a customer phone call, a headquarters query, a stock check for another store - has an outsized cost relative to a conventionally staffed retailer. The chain has built out e-commerce more recently, adding order, delivery and store-pickup servicing to a network that was designed around cash-and-carry simplicity.",
    strategicPressure: [
      { text: "Shimamura runs a deliberately lean, centrally-systematised store model with very small store teams, so every minute of staff time diverted to a phone call is disproportionately expensive.", kind: "verified" },
      { text: "Adding e-commerce and store pickup to a network designed for simple cash-and-carry retail created servicing demand the store model was never built to absorb.", kind: "inference" },
      { text: "A frugal operating culture will not fund experience-led technology, but responds to arithmetic showing labour minutes removed per yen spent.", kind: "inference" },
      { text: "Store-level call volume is probably unmeasured, which means the first discovery task is establishing the baseline the business case depends on.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Shimamura's institutional capability is merchandising systematisation and cost control, delivered through vendor-supplied retail systems. It has no engineering organisation and a culture that would regard a platform build as precisely the kind of overhead the company exists to avoid.",
    whyNotBuild:
      "Building speech, keigo generation, telephony, order and inventory orchestration and evaluation would contradict the operating philosophy that makes the company profitable. The only proposal this buyer accepts is one with a bounded price and a demonstrable reduction in staffed minutes.",
    workflows: [
      {
        name: "Store-support and headquarters query handling",
        friction: "Store staff call headquarters about replenishment, system, pricing and procedure questions, and headquarters staff call stores back - two-way interruption in a model with almost no slack.",
        outcome: "Grounded operational answers available to every store instantly, removing both the store interruption and the headquarters callback.",
        channels: ["Voice", "LINE", "Store system"],
        systems: ["Merchandising and replenishment systems", "Operations manuals", "Store master data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "E-commerce order and store-pickup inquiries",
        friction: "Online order status, pickup readiness and return questions land on store telephones and a small central desk, neither of which was resourced for e-commerce servicing.",
        outcome: "Order, pickup and return questions resolved conversationally without touching store staff, so e-commerce growth does not consume floor labour.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Order management system", "Store pickup system", "Returns workflow"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Store stock and opening-hours inquiries",
        friction: "Customers phone stores to ask whether an item and size is in stock or when the store closes, and a two-person team must leave the floor to check.",
        outcome: "Stock and store information answered from live systems without staff involvement, protecting the lean staffing model.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Store inventory system", "Store master data", "Product master"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A large multi-banner suburban store network run on centralised merchandising rules",
        "An e-commerce operation with store-pickup capability",
        "A chain app and LINE official account used for promotions",
        "Centralised headquarters support functions for store operations",
      ],
      gaps: [
        "Store telephone calls interrupt two- and three-person store teams continuously",
        "E-commerce servicing has no dedicated capacity and defaults to stores",
        "No out-of-hours customer or store support at all",
        "Store call volume is not measured, so its cost is invisible to management",
      ],
    },
    risks: [
      "A frugal buyer will not proceed without a measured baseline, so the pilot must include instrumentation of current call volume before automation is judged.",
      "APPI applies to customer contact and order data used in servicing conversations.",
      "Store staffing is so lean that any escalation path must be designed around a store team that genuinely cannot take a call, meaning escalation routes to a central desk rather than a store.",
    ],
    economics: {
      volumeMonthly: 150000,
      costPerInteraction: 3.8,
      automationRate: 0.6,
      basis: "Seller assumptions from store count and e-commerce order volumes; the baseline is likely unmeasured today, so instrumenting actual call volume is the first discovery task.",
    },
    pilotScope:
      "A Japanese-language voice agent absorbing store-directed customer calls - stock, hours and e-commerce order questions - for one regional store cluster, with call-volume instrumentation to establish the baseline the business case rests on.",
    expansion: [
      "Extend to store-support and headquarters query handling for store teams",
      "Add e-commerce returns and pickup exception handling",
      "Roll out nationally with a per-store labour-minutes-saved report",
    ],
    stakeholders: [
      "Head of Store Operations",
      "Head of E-Commerce",
      "Head of Merchandising Systems",
      "Head of Information Systems",
      "Head of Administration / Cost Control",
    ],
    discovery: [
      "Is store-level call volume measured at all today, and if not can it be instrumented before a decision?",
      "What is the average store team size by shift, and what happens when the phone rings during a checkout queue?",
      "How many e-commerce orders involve a customer contact, and where do those contacts land?",
      "What payback period would clear this company's investment bar?",
    ],
    flowTemplate: "employee-desk",
    scenario: "A two-person Shimamura store gets through a Saturday afternoon without leaving the floor once to answer a stock-check phone call.",
  },

  "ryohin-keikaku": {
    operatingContext:
      "Ryohin Keikaku operates MUJI, a lifestyle retail brand spanning household goods, apparel, food and furniture, with a large Japanese store network that has been expanding into larger roadside and regional formats alongside its urban flagships, plus a well-established e-commerce operation and a widely used membership app. The brand's proposition is quiet, consistent, considered service, which sets an unusually high bar for tone in any customer interaction. Operationally, the furniture and large-item categories generate a delivery and assembly workload similar to a home-furnishing retailer - slot booking, redelivery, damage claims - while urban flagship stores carry significant inbound-tourist traffic asking product and availability questions in several languages. Both loads land on store staff and a central customer service function under the same national labour constraints as every other retailer.",
    strategicPressure: [
      { text: "MUJI's brand proposition rests on consistent, understated service quality, which makes tone and register a genuine commercial requirement rather than a nicety for any automated channel.", kind: "verified" },
      { text: "Expansion into larger regional and roadside formats increases the furniture and large-item share of sales, and with it the delivery-coordination communications load.", kind: "inference" },
      { text: "Tightened driver working-hour rules since 2024 raise the cost of every failed large-item delivery, making proactive coordination financially material.", kind: "verified" },
      { text: "Urban flagship tourist traffic adds multilingual product questions that cannot be staffed at peak without diverting staff from domestic customers.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Ryohin Keikaku is a merchandising and brand company whose retail and e-commerce systems are delivered with external partners. Its internal capability is product development, store design and supply chain, not conversational engineering, and there is no public evidence of speech or dialogue capability.",
    whyNotBuild:
      "The brand's differentiation comes from product and store experience. Building Japanese speech, tone-controlled generation matching a distinctive brand register, telephony, delivery-scheduling orchestration and evaluation would be a multi-year distraction from that, and the delivery-cost and tourist-language problems are present now.",
    workflows: [
      {
        name: "Furniture delivery scheduling and redelivery coordination",
        friction: "Large-item delivery slots are arranged and changed by phone, and failed attempts are recovered only when the customer calls back, wasting crew capacity that is now legally constrained.",
        outcome: "Slots booked and changed against live capacity with proactive contact at the moment of a failed attempt, cutting wasted crew hours.",
        channels: ["Voice", "LINE", "Mobile app", "SMS"],
        systems: ["Delivery scheduling system", "Carrier interfaces", "Order management"],
        value: 3,
        complexity: 3,
      },
      {
        name: "E-commerce order servicing and returns",
        friction: "Order status, delivery exception and return questions arrive at a central desk and at store telephones, each requiring a human to check order and logistics systems separately.",
        outcome: "Grounded order truth and return initiation handled conversationally at any hour, in a register consistent with the brand's service standard.",
        channels: ["Voice", "LINE", "Mobile app", "Web"],
        systems: ["Order management", "Logistics interfaces", "Returns workflow"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Multilingual store product and availability inquiries",
        friction: "Tourist customers in flagship stores ask about product availability, materials and store locations in several languages, occupying staff also serving domestic customers.",
        outcome: "Multilingual product and stock answers delivered without consuming store staff, preserving the calm floor experience the brand depends on.",
        channels: ["Voice", "Mobile app", "In-store digital"],
        systems: ["Store inventory system", "Product master", "Store master data"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A widely used membership app spanning store and online purchases",
        "An established e-commerce operation with store pickup",
        "A central customer service function alongside store telephone handling",
        "Large-item delivery arrangements through carrier and installation partners",
      ],
      gaps: [
        "Delivery slot changes require a call during limited hours",
        "Failed deliveries are recovered reactively rather than at the point of failure",
        "Tourist product questions depend on which staff happen to be available",
        "No servicing continuity between the app, the store and the phone call",
      ],
    },
    risks: [
      "The brand's service register is distinctive and closely guarded, so tone evaluation must be part of the deployment rather than an afterthought.",
      "Delivery scheduling must respect crew working-hour constraints under the 2024 rules rather than optimise purely for customer convenience.",
      "APPI applies to membership, purchase-history and delivery-address data used in servicing conversations.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 4.2,
      automationRate: 0.6,
      basis: "Seller assumptions from store network and e-commerce order volumes with a furniture-delivery contact uplift; validate with the company's contact-per-order data in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling furniture delivery slot booking, changes and redelivery coordination for one metropolitan region, with brand-tone evaluation applied to every interaction.",
    expansion: [
      "Extend to general e-commerce order servicing and returns initiation",
      "Add proactive failed-delivery recovery at the point of the failed attempt",
      "Introduce multilingual store product and availability support in flagship locations",
    ],
    stakeholders: [
      "Head of Customer Service",
      "Head of E-Commerce",
      "Head of Logistics and Delivery",
      "Head of Store Operations, Japan",
      "Head of Brand / Communication Standards",
    ],
    discovery: [
      "What share of total customer contacts are delivery-related, and how is that measured?",
      "What is the first-attempt success rate for furniture deliveries, and what does a failure cost?",
      "Who owns the brand tone standard, and what approval would automated speech require?",
      "How many contacts arrive in languages other than Japanese, and where?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A customer whose sofa delivery failed is contacted while the crew is still in the van and rebooked for the next morning, without calling anyone.",
  },

  "skylark-holdings": {
    operatingContext:
      "Skylark Holdings operates roughly three thousand family restaurants across Japan under brands including Gusto, Bamiyan, Jonathan's and its shabu-shabu and Japanese-food formats, plus a delivery and takeout business run from the same kitchens. Its restaurants are mid-scale, table-service and open long hours, which makes crew headcount per store far higher than a quick-service format and therefore far more exposed to part-time labour scarcity. The company responded to that exposure with one of the most visible technology deployments in Japanese food service - installing serving robots across thousands of restaurants and moving ordering onto table tablets - which is unusually direct public evidence that this management buys automation to substitute for scarce floor labour. What remains unautomated is the communications layer: recruiting the crew, scheduling their interviews, answering customer reservation and inquiry calls, and handling store-to-headquarters operational questions.",
    strategicPressure: [
      { text: "Skylark deployed serving robots across thousands of its restaurants and moved ordering onto table tablets, publicly demonstrating a strategy of buying automation to offset floor labour scarcity.", kind: "verified" },
      { text: "Table-service family restaurants carry far higher crew requirements per store than quick-service formats, so part-time recruitment is a continuous, high-volume operational process rather than an occasional task.", kind: "verified" },
      { text: "Applicants are lost between application and interview because store managers cannot call back promptly during service hours, and competing employers respond faster.", kind: "inference" },
      { text: "Having already justified robot capital expenditure on labour-substitution grounds, the internal business-case vocabulary for a communications equivalent already exists.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Skylark is a restaurant operator whose technology is procured - the robots, the tablets, the ordering systems all came from external suppliers and were deployed at scale. It has no software engineering organisation and a demonstrated preference for buying proven automation and rolling it out fast.",
    whyNotBuild:
      "The company's own robot programme is the argument: when it wanted labour substitution it bought it and deployed it across thousands of stores in a matter of quarters. Building Japanese speech, keigo generation, telephony, recruitment and reservation orchestration and evaluation would take years and contradict a proven operating pattern.",
    workflows: [
      {
        name: "Part-time applicant screening and interview scheduling",
        friction: "Applications arrive per store and wait for a manager who is on the floor during service; by the time a callback happens the applicant has taken another job.",
        outcome: "Applicants engaged within minutes, screened on availability and eligibility, and booked directly into a store interview slot, materially reducing funnel loss.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Recruitment management system", "Store rostering", "Interview scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Reservation, waitlist and customer inquiry handling",
        friction: "Reservation and group-booking calls, allergen questions and store information requests reach restaurant telephones during service, pulling a crew member off the floor at the busiest moment.",
        outcome: "Reservations booked against live table availability and inquiries answered from grounded store and menu data, without interrupting service.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Reservation system", "Store master data", "Menu and allergen data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Store-to-headquarters operational support",
        friction: "Store managers call headquarters about equipment, ordering, systems and personnel matters and queue behind each other, while headquarters staffing is flat against clustered incidents.",
        outcome: "Operational questions answered instantly from current manuals and systems, with equipment faults triaged and technicians dispatched automatically.",
        channels: ["Voice", "LINE", "Store system"],
        systems: ["Operations manuals", "Equipment maintenance and dispatch", "Ordering system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Serving robots and table-ordering tablets deployed across the restaurant network",
        "A brand app and LINE official accounts used for coupons and campaigns",
        "Online and telephone reservation capability for the table-service brands",
        "Headquarters support functions for store operations and equipment",
      ],
      gaps: [
        "Applicants have no immediate response path, so the hiring funnel leaks at first contact",
        "Restaurant telephones remain an unmanaged interruption during service",
        "No support capacity for stores outside headquarters hours",
        "Allergen and menu questions still require a crew member to check",
      ],
    },
    risks: [
      "Allergen and food-content questions carry real safety consequence, so answers must come from controlled menu data with escalation for anything uncertain.",
      "APPI applies to applicant personal data collected during screening, including guardian consent where applicants are under age.",
      "Labour law constrains what may be asked during recruitment screening, so the question set requires HR and legal sign-off before deployment.",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 4,
      automationRate: 0.6,
      basis: "Seller assumptions combining recruitment, reservation and store-support contact across the restaurant network; validate with Skylark applicant volumes and store call measurement in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling part-time applicant screening and interview scheduling for one regional brand cluster, integrated with the recruitment system and store interview calendars.",
    expansion: [
      "Extend to reservation, waitlist and customer inquiry handling with live table availability",
      "Add store-to-headquarters operational support with equipment triage and dispatch",
      "Roll out across all brands with per-store hiring funnel and interruption reporting",
    ],
    stakeholders: [
      "Head of Human Resources / Crew Recruitment",
      "Head of Store Operations",
      "Head of Brand Marketing and Reservations",
      "Head of Information Systems",
      "Head of Quality and Food Safety",
    ],
    discovery: [
      "How many part-time applications arrive per store per month, and what share reach an interview?",
      "What is the current average time from application to first contact?",
      "How many customer calls reach restaurant telephones during peak service hours?",
      "Who signs off the permitted question set for automated recruitment screening?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A student who applies to a Gusto store at 11pm is screened, matched to available shifts and booked for a Thursday interview before she goes to bed.",
  },

  "zensho-holdings": {
    operatingContext:
      "Zensho Holdings is Japan's largest food-service company by sales, operating the Sukiya gyudon chain, Hama Sushi, Nakau and a widening portfolio of domestic and international restaurant brands, together with a vertically integrated food supply chain that it has invested in heavily. Its Japanese store base runs to thousands of locations, many trading around the clock or close to it, staffed almost entirely by part-time crew including a growing proportion of foreign workers. Crew labour is the company's defining operational constraint - its own history includes a period when understaffing forced temporary store closures across the Sukiya network, which made the fragility of the crew supply chain a matter of public record. Recruitment therefore runs continuously at enormous volume across brands, alongside store-side operational support and customer contact.",
    strategicPressure: [
      { text: "Zensho is Japan's largest food-service group by sales, operating thousands of stores whose crew requirements make part-time recruitment a continuous, very high-volume process.", kind: "verified" },
      { text: "The Sukiya network previously suffered temporary store closures driven by crew shortages, making labour supply a documented business risk for this group specifically.", kind: "verified" },
      { text: "A growing share of crew are foreign workers, so recruitment and store communication increasingly require languages other than Japanese, which stores cannot staff for.", kind: "inference" },
      { text: "The group's capital is committed to food supply-chain vertical integration, which means operational technology is bought rather than developed.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Zensho's investment thesis is vertical integration of food production and distribution - farms, factories, logistics - not software. Its store and back-office systems are vendor-delivered and it has no conversational engineering capability.",
    whyNotBuild:
      "Every yen of Zensho's capital allocation narrative goes into the food supply chain. Building multilingual speech, keigo generation, telephony, recruitment orchestration and evaluation would be a foreign activity for this company, and the crew supply problem is immediate rather than something that can wait for a build cycle.",
    workflows: [
      {
        name: "High-volume multilingual part-time recruitment screening",
        friction: "Applications arrive across thousands of stores and multiple brands; managers call back when they can, and applicants - including non-Japanese speakers - are lost to faster or more accessible employers.",
        outcome: "Every applicant engaged within minutes in their language, screened on availability, eligibility and work status, and booked into a store interview.",
        channels: ["Voice", "LINE", "Web", "SMS"],
        systems: ["Recruitment management system", "Store rostering", "Interview scheduling"],
        value: 3,
        complexity: 3,
      },
      {
        name: "Crew onboarding and shift-related store support",
        friction: "New crew, particularly foreign workers, have repeated questions about shifts, pay, procedures and documentation, and ask store managers who are working the counter.",
        outcome: "Multilingual answers on shifts, pay dates, procedures and paperwork available continuously, reducing early attrition and manager interruption.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Rostering and payroll systems", "Employee handbook and procedures", "HR case management"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Customer inquiry and store information handling",
        friction: "Customer calls about store hours, allergens, delivery orders and complaints reach store telephones and brand desks, interrupting crew during service in stores that are already thinly staffed.",
        outcome: "Customer questions answered from grounded store and menu data without touching crew, with complaints routed to brand customer service with full context.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Store master data", "Menu and allergen data", "Customer complaint system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "Brand apps and LINE official accounts used for coupons, ordering and campaigns",
        "Self-service ordering and payment terminals in many store formats",
        "Centralised and brand-level recruitment channels feeding store hiring",
        "Headquarters and brand customer service desks",
      ],
      gaps: [
        "Applicants wait on store-manager availability, so the funnel leaks at first contact",
        "Foreign crew have no reliable multilingual support channel for shift and pay questions",
        "Customer calls interrupt crew during service across thousands of stores",
        "No consistent measurement of where the hiring funnel actually breaks",
      ],
    },
    risks: [
      "Recruitment conversations must comply with Japanese labour law on permissible questions, and work-status verification for foreign applicants requires careful handling rather than automated judgement.",
      "APPI governs applicant and crew personal data, including residency and work-permit information which is particularly sensitive.",
      "Allergen and food-content answers carry safety consequence and must be grounded in controlled menu data.",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 3.8,
      automationRate: 0.65,
      basis: "Seller assumptions from store count, crew turnover and applicant volumes across brands; validate with Zensho recruitment funnel data and store contact measurement in discovery.",
    },
    pilotScope:
      "A Japanese, English and Vietnamese voice and LINE agent handling part-time applicant screening and interview scheduling for Sukiya stores in two prefectures, integrated with the recruitment system and store interview calendars.",
    expansion: [
      "Extend recruitment screening across all brands and languages nationwide",
      "Add multilingual crew onboarding and shift-support handling",
      "Introduce customer inquiry handling with grounded store and menu data",
    ],
    stakeholders: [
      "Head of Human Resources / Crew Recruitment",
      "Head of Store Operations, Sukiya",
      "Head of Brand Operations across group formats",
      "Head of Information Systems",
      "Head of Legal and Labour Compliance",
    ],
    discovery: [
      "Is recruitment run centrally or brand by brand, and who owns the funnel metrics?",
      "How many applications arrive monthly, and what proportion convert to a first shift?",
      "What share of crew are foreign workers, and which languages dominate?",
      "What questions are legally permissible in an automated screening conversation, and who approves them?",
    ],
    flowTemplate: "admissions",
    scenario: "A Vietnamese applicant to a Sukiya store completes screening in her own language on a Sunday night and starts training the following week.",
  },

  "mcdonalds-japan": {
    operatingContext:
      "McDonald's Company (Japan) operates around three thousand restaurants across company-operated and franchised stores, making it one of the largest single employers of part-time workers in the country and one of the highest-throughput restaurant operations anywhere in Japan. Global systems supply its consumer-facing digital layer - the mobile ordering app, delivery integrations, kiosk ordering - so the local organisation is not short of customer technology. What is emphatically local, and emphatically labour-constrained, is people operations: recruiting, screening and scheduling crew at a scale of tens of thousands of hires a year across stores whose managers are working service shifts, plus the store-to-headquarters operational support that keeps three thousand kitchens running. Franchise ownership adds a further layer, since a large share of hiring happens inside franchisee businesses with even thinner administrative capacity.",
    strategicPressure: [
      { text: "McDonald's Japan operates around three thousand restaurants across company and franchise stores, making crew recruitment a continuous operation at a scale few Japanese employers match.", kind: "verified" },
      { text: "Consumer-facing digital capability comes from the global system, so the local organisation's discretionary technology attention is available for operations rather than customer apps.", kind: "inference" },
      { text: "Hiring competition for part-time crew is national and intense, and the employer who responds first to an application wins a disproportionate share of applicants.", kind: "inference" },
      { text: "Franchisee-operated stores hire independently with even less administrative capacity, so any solution must work for franchisees as well as company stores.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led for local people operations. Global brand technology arrives from the global system, and the Japanese organisation does not build platforms - it operates restaurants. Local people-operations communications is a bounded, market-specific problem that would be bought and integrated rather than engineered.",
    whyNotBuild:
      "The Japanese entity has no charter or capability to build platform technology, and the global technology organisation is focused on consumer ordering and delivery, not Japanese-language recruitment conversation. Buying a Japanese conversational capability for people operations sits cleanly outside the global roadmap and inside local decision rights.",
    workflows: [
      {
        name: "Crew applicant screening and interview scheduling",
        friction: "Applications arrive per store and wait for a manager working a service shift; the delay costs applicants to competitors who called back the same day.",
        outcome: "Every applicant contacted within minutes, screened on availability and eligibility, and booked into an interview slot at the store they applied to.",
        channels: ["Voice", "LINE", "Web", "SMS"],
        systems: ["Recruitment management system", "Store rostering", "Interview scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Interview no-show reduction and onboarding follow-through",
        friction: "Booked interviews are missed and first shifts are not attended, with no systematic reminder or re-engagement, so hiring effort is wasted at the last step.",
        outcome: "Reminders, confirmations and re-engagement conversations that convert booked interviews into attended first shifts.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Recruitment system", "Onboarding workflow", "Store rostering"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Store operational support for company and franchise restaurants",
        friction: "Restaurant managers call headquarters about equipment, systems, supply and procedure questions, and franchisee stores have even less administrative support to fall back on.",
        outcome: "Grounded operational answers and equipment triage available continuously to every restaurant regardless of ownership, with automatic technician dispatch.",
        channels: ["Voice", "LINE", "Store system"],
        systems: ["Operations manuals", "Equipment maintenance and dispatch", "Supply ordering system"],
        value: 2,
        complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mass-market mobile ordering and offers app supplied through the global system",
        "Kiosk ordering and delivery-platform integrations in restaurants",
        "A LINE official account with very large reach used for offers",
        "Centralised and store-level recruitment channels across company and franchise stores",
      ],
      gaps: [
        "Applicants wait on the availability of a manager who is working a service shift",
        "No systematic reminder or re-engagement between application, interview and first shift",
        "Franchise stores have thinner administrative support than company stores for the same problems",
        "Hiring funnel breakage is not measured consistently across ownership types",
      ],
    },
    risks: [
      "Recruitment questioning must comply with Japanese labour law on permissible subjects, requiring HR and legal approval of the automated question set.",
      "APPI applies to applicant data, including guardian consent for applicants who are minors - a significant share of crew applicants.",
      "Franchise stores are independent employers, so data handling and contracting must respect the boundary between the company and franchisee businesses.",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 4,
      automationRate: 0.65,
      basis: "Seller assumptions from restaurant count, crew turnover and applicant volumes; validate with the company's recruitment funnel metrics and company-versus-franchise split in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling crew applicant screening and interview scheduling for company-operated restaurants in one metropolitan area, integrated with the recruitment system and store interview calendars.",
    expansion: [
      "Add interview reminder, no-show reduction and first-shift follow-through",
      "Extend the same capability to franchisee-operated restaurants under an appropriate data and contracting model",
      "Introduce store operational support with equipment triage and dispatch",
    ],
    stakeholders: [
      "Head of People / Human Resources, Japan",
      "Head of Restaurant Operations",
      "Head of Franchise Operations",
      "Head of Information Technology, Japan",
      "Head of Legal and Labour Compliance",
    ],
    discovery: [
      "How is hiring split between headquarters, franchisees and individual restaurants?",
      "How many applications are received monthly, and what share reach a first shift?",
      "What is the current interview no-show rate, and is any reminder process in place?",
      "What is the local decision right on operations technology relative to the global system?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A high-school student applying at 10pm is screened, matched to weekend shifts and booked for a Saturday interview, and gets a reminder the night before.",
  },

  "kura-sushi": {
    operatingContext:
      "Kura Sushi operates a large conveyor-belt sushi chain across Japan built around a distinctive technology-forward store model: automated plate counting and disposal, self-service check-in and seating, table ordering panels, a reward game tied to plate count, and food-safety covers on the belt. That deployment is deliberate labour substitution - the chain has pursued store automation harder than almost any Japanese restaurant operator because floor and kitchen labour is its binding constraint. Its customers are families and groups who cluster into weekend and holiday peaks, generating heavy waitlist and reservation demand that spikes exactly when stores are least able to answer a telephone. The chain also hires part-time crew continuously across hundreds of stores, with the same manager-availability bottleneck as the rest of the sector.",
    strategicPressure: [
      { text: "Kura Sushi has pursued in-store automation aggressively - automated plate counting, self check-in and seating, table ordering - as a deliberate substitute for scarce floor labour.", kind: "verified" },
      { text: "Family-restaurant demand concentrates into weekend and holiday peaks, so waitlist and reservation contact spikes precisely when store staff are least available.", kind: "verified" },
      { text: "Customers who cannot get through by phone during peak simply go elsewhere, so unanswered reservation contact is direct revenue loss rather than a service inconvenience.", kind: "inference" },
      { text: "A chain that has already automated seating and ordering has an internal precedent for automating the conversation that precedes the visit.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Kura Sushi has demonstrated genuine appetite and competence in deploying store automation, which means it will engage technically, but its systems are procured and integrated rather than engineered from scratch. The right framing is a store-communications package that extends its existing automation strategy to the pre-visit and hiring conversation.",
    whyNotBuild:
      "Its automation programme is about physical store systems - belts, counters, panels, seating. Japanese conversational speech, keigo generation, telephony and evaluation are a completely different engineering domain. Buying that layer and integrating it into the reservation and rostering systems it already runs is faster and cheaper than extending its store-systems team into voice.",
    workflows: [
      {
        name: "Reservation and waitlist inquiry handling at peak",
        friction: "Weekend callers asking about wait times, group bookings and seating cannot get through because store staff are seating and serving, so parties go elsewhere.",
        outcome: "Wait times, availability and bookings answered instantly from live seating and queue data, converting peak-hour calls into seated parties.",
        channels: ["Voice", "LINE", "Mobile app", "Web"],
        systems: ["Reservation and queue system", "Store seating status", "Store master data"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Part-time applicant screening and interview scheduling",
        friction: "Applicants wait for a store manager who is on the floor during the peaks when applications arrive, and are lost to employers who respond faster.",
        outcome: "Immediate screening on availability and eligibility with an interview booked into the store's calendar, cutting funnel loss.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Recruitment system", "Store rostering", "Interview scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Store equipment and operational support",
        friction: "Automated plate counters, belts and ordering panels are the store's productivity backbone, and a fault during a weekend peak has immediate revenue consequence while support is thin.",
        outcome: "Guided troubleshooting and automatic technician dispatch at any hour, minimising downtime on the systems the labour model depends on.",
        channels: ["Voice", "Store system", "LINE"],
        systems: ["Equipment maintenance and dispatch", "Store systems monitoring", "Parts inventory"],
        value: 2,
        complexity: 3,
      },
    ],
    existing: {
      has: [
        "Automated plate counting, self check-in and table ordering systems across stores",
        "A reservation and queue app used by customers before visiting",
        "A LINE official account used for campaigns and customer notices",
        "Store-level telephone handling for reservations and inquiries",
      ],
      gaps: [
        "Peak-hour reservation calls go unanswered because staff are on the floor",
        "Applicants wait on manager availability during exactly the busiest periods",
        "Equipment faults during weekend peaks have no immediate support path",
        "Nothing captures the demand that is lost when a call goes unanswered",
      ],
    },
    risks: [
      "Allergen and food-content questions must be answered from controlled menu data with escalation, given the safety consequence in a sushi format.",
      "APPI applies to applicant data and to reservation contact information.",
      "Equipment guidance must escalate to technicians rather than instruct crew on systems whose mishandling risks food-safety or mechanical harm.",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 4,
      automationRate: 0.6,
      basis: "Seller assumptions from store count, peak reservation demand and applicant volumes; validate with Kura Sushi call abandonment at peak and recruitment funnel data in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling reservation, wait-time and group-booking inquiries at peak hours for one regional store cluster, grounded in live queue and seating data.",
    expansion: [
      "Add part-time applicant screening and interview scheduling across the same cluster",
      "Extend to store equipment troubleshooting and technician dispatch",
      "Roll out nationally with lost-demand measurement on previously unanswered peak calls",
    ],
    stakeholders: [
      "Head of Store Operations",
      "Head of Human Resources / Crew Recruitment",
      "Head of Information Systems / Store Technology",
      "Head of Marketing and Reservations",
      "Head of Quality and Food Safety",
    ],
    discovery: [
      "How much reservation and waitlist traffic bypasses the app and lands on store telephones?",
      "What is the call abandonment rate at weekend peak, and is it measured at all?",
      "How many part-time applications arrive per store per month, and what is the time to first contact?",
      "What is the average revenue impact of a store-systems fault during a weekend peak?",
    ],
    flowTemplate: "appointments",
    scenario: "A family calling at Sunday lunchtime learns the current wait, joins the queue remotely and arrives as their table comes free, instead of hanging up.",
  },

  "yoshinoya-holdings": {
    operatingContext:
      "Yoshinoya Holdings operates the Yoshinoya gyudon chain of well over a thousand restaurants plus the Hanamaru Udon business and related formats, running a quick-service model on thin margins with very small crews per store and long trading hours. Gyudon is a low-price, high-frequency category where a few yen of cost per transaction is strategically significant, which means the company scrutinises operating expense with unusual severity and has limited capacity to absorb rising part-time wages. Its stores are concentrated near stations, offices and roadsides serving a mostly domestic, price-sensitive customer base, with app coupons and takeout playing a growing role. Crew recruitment is continuous and difficult in exactly the urban locations where its stores generate the most revenue and where competing employers are most numerous.",
    strategicPressure: [
      { text: "Yoshinoya operates over a thousand quick-service restaurants on thin category margins with very small crews, making part-time wage inflation a direct threat to store profitability.", kind: "verified" },
      { text: "Gyudon is a price-led, high-frequency category, so the company cannot pass labour cost increases through to customers without volume consequences.", kind: "inference" },
      { text: "Urban station-adjacent stores compete for part-time crew with every other retail and food employer in the same neighbourhood, making speed of hiring response a real differentiator.", kind: "inference" },
      { text: "A cost-focused operator with no software bench will judge the proposal purely on labour minutes removed per yen spent, so the pilot must be small, bounded and measurable.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Yoshinoya is a restaurant operator with vendor-delivered store and back-office systems and no engineering organisation. Its cost discipline makes fixed-cost technology development implausible and packaged capability at a known price the only fundable option.",
    whyNotBuild:
      "A thin-margin quick-service operator cannot carry the fixed cost of building speech, keigo generation, telephony, recruitment orchestration and evaluation. Its investment bar demands payback in labour minutes within quarters, which only a deployable bought capability can meet.",
    workflows: [
      {
        name: "Part-time applicant screening and interview scheduling",
        friction: "Applications arrive to individual stores where a two- or three-person crew is serving a lunch rush, so callbacks happen late and applicants take other jobs.",
        outcome: "Applicants engaged within minutes and booked into a store interview slot, raising the share of applications that convert to a first shift.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Recruitment system", "Store rostering", "Interview scheduling"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Store-to-headquarters operational support",
        friction: "Store managers call headquarters about equipment faults, supply shortfalls, systems and procedure questions, and wait because support is centralised and thin against a large store count.",
        outcome: "Grounded operational answers at any hour with equipment triage and automatic technician dispatch, cutting store downtime and manager waiting.",
        channels: ["Voice", "LINE", "Store system"],
        systems: ["Operations manuals", "Equipment maintenance and dispatch", "Supply ordering system"],
        value: 3,
        complexity: 2,
      },
      {
        name: "Customer feedback, takeout and store information handling",
        friction: "Customer calls about store hours, takeout orders, allergens and complaints reach store telephones during service, interrupting a crew of two or three.",
        outcome: "Store and menu questions answered without touching crew, with complaints captured in structured form and routed to customer service with full context.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Store master data", "Menu and allergen data", "Customer feedback system"],
        value: 2,
        complexity: 1,
      },
    ],
    existing: {
      has: [
        "A brand app with coupons and takeout ordering",
        "A LINE official account used for campaigns and offers",
        "Centralised headquarters support functions for a large store network",
        "Store-level telephone handling for customers and headquarters contact",
      ],
      gaps: [
        "Applicants wait on crew availability during exactly the busiest service periods",
        "No support capacity for stores outside headquarters hours",
        "Customer calls interrupt crews of two or three during service",
        "Applicant drop-off and no-show rates are not systematically measured",
      ],
    },
    risks: [
      "Recruitment questioning must stay within Japanese labour-law limits, requiring approved question sets and guardian consent handling for under-age applicants.",
      "Allergen and food-content answers carry safety consequence and must be grounded in controlled menu data.",
      "A cost-focused buyer will require a measured baseline before and after, so instrumentation must be part of the pilot rather than an afterthought.",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 3.8,
      automationRate: 0.6,
      basis: "Seller assumptions from store count, crew turnover and store contact rates; validate with Yoshinoya applicant volumes, no-show rates and store call measurement in discovery.",
    },
    pilotScope:
      "A Japanese-language voice and LINE agent handling part-time applicant screening, interview booking and reminder calls for one urban store cluster, with explicit measurement of application-to-first-shift conversion before and after.",
    expansion: [
      "Add store-to-headquarters operational support with equipment triage and dispatch",
      "Extend to customer store-information, takeout and feedback handling",
      "Roll out across Hanamaru Udon and other group formats",
    ],
    stakeholders: [
      "Head of Human Resources / Crew Recruitment",
      "Head of Store Operations, Yoshinoya",
      "Head of Group Business Planning",
      "Head of Information Systems",
      "Head of Quality and Food Safety",
    ],
    discovery: [
      "What are the current applicant no-show and drop-off rates between application, interview and first shift?",
      "How many applications arrive per store per month, and who handles them today?",
      "How many calls reach store telephones during lunch and dinner peaks?",
      "What payback period would clear the company's investment bar for an operating expense of this kind?",
    ],
    flowTemplate: "employee-desk",
    scenario: "A Yoshinoya store manager working the lunch rush finds three screened applicants already booked into Thursday interview slots when the peak ends.",
  },
};
