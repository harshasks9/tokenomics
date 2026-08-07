import type { Company } from "../schema";

export const COMPANIES_INVESTING_SERVICES: Company[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // GROWW — Billionbrains Garage Ventures
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "groww",
    name: "Billionbrains Garage Ventures (Groww)",
    shortName: "Groww",
    category: "Retail broking & investing",
    group: "investing",
    color: "#00D09C",
    oneLiner:
      "India's largest retail broker by active clients, built as a mobile-first execution platform that took a direct mutual fund audience into equities, derivatives, margin trading, commodities and wealth products.",
    whyTop10:
      "No other Indian consumer platform runs this many financially consequential conversations under this much regulatory constraint. Groww is now the largest broker in the country by active NSE clients, most of its users are outside the top six cities and a large share are first-time investors, and every conversation it has sits inside SEBI boundaries that forbid recommending a security. That combination - enormous volume, high stakes, hard limits on what may be said - is precisely where an agent that completes process rather than gives opinions creates disproportionate value.",
    snapshot: [
      { label: "Active NSE clients", value: "~12.75 mn (Feb 2026)", kind: "fact" },
      { label: "Broking market share", value: "28.7% vs Zerodha 15.0% (Jun 2026)", kind: "fact" },
      { label: "Transacting users", value: "22.4 mn, +24% YoY (Q1 FY27)", kind: "fact" },
      { label: "Q1 FY27 revenue / PAT", value: "₹1,501 cr / ₹735 cr", kind: "fact" },
      { label: "Users outside top-6 cities", value: "84% of transacting users", kind: "fact" },
    ],
    whyItMatters:
      "Groww's communications problem is not that people ask questions - it is that millions of financially inexperienced people hit hard, time-boxed, rule-driven events they have never seen before: a margin shortfall with a square-off deadline, a bounced SIP mandate, a rights entitlement appearing in a demat account, a KYC rejection they cannot decode, a derivatives segment that regulation has repeatedly reshaped. Each of those is a process with a correct answer and a completion path, and none of them requires an opinion about a security. The commercial ground here is process autonomy, not portfolio autonomy: an agent that explains what happened to this specific client's position, verifies identity, and finishes the transaction-adjacent task before a deadline passes. The advice boundary is not a footnote on this account - it is the design brief.",
    context: [
      {
        text: "Groww's November 2025 IPO raised roughly ₹6,630 crore (about $748 million), the largest Indian fintech listing of the year, and the shares closed their debut around 29% above the ₹100 issue price.",
        kind: "fact",
        source: 0,
      },
      {
        text: "Q1 FY27 revenue from operations reached ₹1,501 crore, up 66% year on year, with profit after tax of ₹735 crore and an EBITDA margin above 64%. The margin trading facility book grew from ₹1,036 crore to ₹3,775 crore over the same period, and MTF plus commodity derivatives were credited as the main drivers of the mix shift.",
        kind: "fact",
        source: 4,
      },
      {
        text: "Per its FY26 annual report, 84% of Groww's transacting users sit outside India's top six cities and the platform reaches roughly 97% of the country's PIN codes - a distribution profile that makes vernacular, low-literacy-tolerant communication a structural requirement rather than a nice-to-have.",
        kind: "fact",
        source: 3,
      },
      {
        text: "F&O penetration on Groww fell to about 10% of customers in the March 2026 quarter from 18% in November 2024 following SEBI's derivatives tightening, with the CFO noting that new customers increasingly arrive through mutual funds and ETFs rather than direct equity or derivatives.",
        kind: "fact",
        source: 1,
      },
      {
        text: "At its Groww Next 2026 showcase the company launched six AI-enabled products including the GR-1 research assistant, and stated explicitly that intelligence on Groww is assistive, not autonomous - technology should augment investor judgement, not replace it.",
        kind: "fact",
        source: 2,
      },
      {
        text: "That 'assistive, not autonomous' position is the exact design constraint for an agentic programme here. The moment an agent names a security to buy or sell it is giving investment advice under SEBI's framework and needs a registered adviser behind it. But margin cures, mandate repair, KYC completion, corporate-action explanation and suitability checkpoints are process, not advice - and process is where autonomy is both legal and unclaimed. Sizing the mix is a discovery question, not something to assume.",
        kind: "inference",
      },
    ],
    sources: [
      {
        label: "TechCrunch - Groww raises nearly $750M in IPO as India's retail investing boom continues",
        url: "https://techcrunch.com/2025/11/12/groww-raises-nearly-750m-in-ipo-as-indias-retail-investing-boom-continues/",
      },
      {
        label: "MediaNama - Groww F&O user share drops to 10% after stricter SEBI rules (Q4 FY26)",
        url: "https://www.medianama.com/2026/05/223-groww-q4-fy26-fo-user-share-decline-customer-shift-mutual-funds-etfs/",
      },
      {
        label: "Business Standard - Groww builds AI-powered platform across trading, wealth and fixed income",
        url: "https://www.business-standard.com/companies/news/groww-builds-ai-powered-platform-across-trading-wealth-and-fixed-income-126022800536_1.html",
      },
      {
        label: "Business Today - 84% of Groww users are outside the top six cities",
        url: "https://www.businesstoday.in/personal-finance/investment/story/indias-investing-story-is-now-in-small-towns-84-of-groww-users-are-outside-top-6-cities-546340-2026-07-31",
      },
      {
        label: "Business Standard - Groww jumps after Q1 FY27 PAT rises 94% YoY",
        url: "https://www.business-standard.com/markets/capital-market-news/groww-jumps-after-q1-pat-rises-94-yoy-126071500618_1.html",
      },
    ],
    useCases: [
      {
        id: "groww-margin-cure",
        rank: 1,
        name: "Margin shortfall cure and pledge-deadline agent",
        audience: "customer",
        lifecycle: "collect",
        econ: "both",
        current:
          "A client with a leveraged position falls into margin shortfall and receives a templated SMS and an email with a number in it. Most first-time MTF users have never seen a margin call, do not know that pledged holdings can cover it, do not know the square-off cut-off, and do not act. The risk desk squares off positions at the deadline, the client loses money they did not expect to lose, files a complaint, and often stops using the leverage product entirely.",
        agentic:
          "On shortfall detection the agent pulls the client's actual ledger, free cash, pledged and unpledged holdings and collateral haircuts, then calls or messages in the client's language with the specific rupee gap and the specific remedies available to that account: transfer funds now, pledge named holdings the client already owns, or reduce exposure. It executes the funding path the client chooses - generating the collateral pledge request and OTP flow, confirming the depository acknowledgement, re-running the margin computation and confirming the shortfall is cured - and re-contacts before the cut-off if it is not. It never selects which security to sell and never tells the client whether to hold or exit; where the client asks 'what should I do with my position', it states the boundary and offers the arithmetic instead.",
        trigger:
          "Risk engine flags an end-of-day or intraday margin shortfall, a collateral haircut revision, or an approaching pledge/repledge confirmation deadline on an MTF or derivatives position.",
        systems: [
          "Risk and margin engine",
          "Client ledger and back office (RMS)",
          "Depository pledge/repledge rails (CDSL/NSDL)",
          "Payment and UPI collection rails",
          "Compliance call-recording and consent archive",
        ],
        channels: ["Outbound voice (vernacular)", "WhatsApp", "In-app", "SMS fallback"],
        outcomes: [
          "Share of shortfalls cured before square-off cut-off",
          "Forced square-off value and resulting client complaints",
          "MTF book retention and repeat leverage usage after a first margin event",
        ],
        whyThisCompany:
          "Groww grew its MTF book roughly 3.6x year on year onto a base that is 84% non-metro and heavily first-time. That is the largest concentration of leveraged investors in India who have never experienced a margin call, and the cure window is hours. The boundary is explicit and must be built in: the agent may compute the gap, explain the mechanics, and complete a funding or pledge action the client authorises, but it must not recommend which security to liquidate or whether to stay in the trade - that is investment advice under SEBI's framework and requires a registered adviser.",
        scores: { economic: 5, volume: 4, suitability: 4, ease: 2, differentiation: 4 },
      },
      {
        id: "groww-mandate-recovery",
        rank: 2,
        name: "Broken SIP mandate diagnosis and reinstatement agent",
        audience: "customer",
        lifecycle: "retain",
        econ: "revenue",
        current:
          "A monthly SIP debit fails. The investor gets a generic 'your SIP instalment could not be processed' notification that does not distinguish an insufficient balance from an expired e-NACH mandate, a changed bank account, a bank-side outage or a deliberate stop. Nobody calls. After two or three consecutive failures the SIP is treated as discontinued, and a recurring, high-margin, low-cost-to-serve relationship silently disappears.",
        agentic:
          "The agent reads the actual failure reason code from the mandate and payment rails, classifies it, and reaches the investor the same day in their language. Insufficient balance becomes an offer to re-present on a date the investor names, and the agent reschedules the debit inside the permitted window. An expired or bank-changed mandate becomes a guided replacement - the agent creates a fresh UPI-autopay or e-NACH mandate, walks the authentication, and confirms activation. A genuine intent to stop is honoured on the spot, the SIP is paused rather than cancelled where the investor prefers, and the reason is logged. It never argues that the investor should keep investing on market grounds.",
        trigger:
          "Mandate debit failure or rejection code received; mandate nearing expiry; second consecutive missed instalment on an active SIP.",
        systems: [
          "SIP and order management system",
          "e-NACH / UPI-autopay mandate rails and bank response codes",
          "RTA and AMC records",
          "CRM and consent/DND registry",
        ],
        channels: ["WhatsApp", "Outbound voice (vernacular)", "In-app", "Email"],
        outcomes: [
          "Recovered SIPs per 100 failed debits",
          "SIP discontinuation ratio and mandate re-registration rate",
          "Recurring inflow retained per cohort",
        ],
        whyThisCompany:
          "With F&O penetration down to roughly a tenth of customers, the SIP is now Groww's acquisition and retention engine, and industry SIP stoppage ratios have been running at extreme levels through 2026. A large share of those stops are mechanical failures, not decisions - and a mechanical failure is exactly the kind of thing an agent can diagnose from a response code and repair end to end. Crucially, this is entirely inside the line: reinstating a mandate the investor already chose is process, whereas persuading them to invest would not be.",
        scores: { economic: 4, volume: 5, suitability: 4, ease: 3, differentiation: 3 },
      },
      {
        id: "groww-kyc-activation",
        rank: 3,
        name: "Stalled KYC and first-trade activation recovery agent",
        audience: "customer",
        lifecycle: "acquire",
        econ: "revenue",
        current:
          "A tier-2 or tier-3 applicant starts an account opening and stalls: PAN name mismatch against the KRA record, an illegible address proof, a video IPV that fails on lighting or background noise, a bank account whose name does not match, a missing nominee declaration, a signature that will not pass. The application sits in a rejected or pending bucket, the applicant does not understand the rejection language, and the acquisition spend is written off. Those who do get through often never place a first trade or first SIP.",
        agentic:
          "The agent picks up the stalled application, reads the precise rejection reason from the KRA/CKYC and depository responses, and calls the applicant in their language. It is multimodal on the fix: it asks the applicant to photograph the document, checks legibility, crop and expiry before anything is submitted, and re-runs the video IPV with live coaching rather than a failed attempt and a retry link. It resubmits to the KRA, tracks the acknowledgement, confirms the depository account is live, and then completes activation - guiding the first mandate or first order placement without naming any instrument, and handing off to a human where identity documents are genuinely inconsistent or fraud signals appear.",
        trigger:
          "Application abandoned mid-flow, KRA/CKYC rejection code received, IPV failure, or account opened but zero activity after a defined window.",
        systems: [
          "Onboarding and KYC workflow",
          "KRA / CKYC and PAN verification services",
          "Depository account opening (DP back office)",
          "Bank penny-drop and name-match services",
          "AML/fraud screening",
        ],
        channels: ["Outbound voice (vernacular)", "WhatsApp", "Multimodal document capture", "In-app"],
        outcomes: [
          "Stalled applications converted to funded, activated accounts",
          "KYC rejection re-work cycles per approved account",
          "Cost per activated client versus paid acquisition",
        ],
        whyThisCompany:
          "Groww's growth now comes from PIN codes where documentation is messier and English rejection copy is useless - 84% of transacting users are already outside the top six cities. Every abandoned application is fully paid-for demand that failed on a fixable technicality. The advice boundary is easy to respect here because nothing in the workflow touches instrument selection; the agent's job ends at 'your account is live and you can place your first order', never at what that order should be.",
        scores: { economic: 3, volume: 4, suitability: 5, ease: 3, differentiation: 3 },
      },
      {
        id: "groww-fno-suitability",
        rank: 4,
        name: "Derivatives suitability and risk-disclosure checkpoint agent",
        audience: "customer",
        lifecycle: "onboard",
        econ: "both",
        current:
          "Enabling the F&O segment is largely a form: upload an income or net-worth proof, tick a risk disclosure, done. The applicant rarely reads the disclosure, frequently misunderstands what upfront option premium collection, a roughly ₹15 lakh notional contract, physical settlement or the revised margin and STT regime actually mean for their capital, and the broker holds a consent record that is technically compliant and substantively hollow.",
        agentic:
          "The agent runs the activation as an actual conversation. It reads the submitted income proof and checks internal consistency, then explains - in the applicant's language, against their own account balance - what one lot now costs, what happens on expiry if a position is not squared off, what upfront premium collection removed, and what the revised STT and margin regime does to a small book. It asks comprehension-check questions and requires correct answers, not a checkbox. It then either completes the segment activation and files a time-stamped, recorded consent trail, or holds the activation and routes the applicant to a human where answers indicate the product is being misunderstood. It never expresses a view on any strategy, index or contract.",
        trigger:
          "Client requests derivatives or commodity segment activation, submits an income proof, or approaches a regulatory threshold that requires refreshed suitability documentation.",
        systems: [
          "Segment activation and client master (UCC)",
          "Income proof verification / document intelligence",
          "Compliance consent and call-recording archive",
          "Exchange contract master (lot sizes, notional, margins)",
        ],
        channels: ["Outbound and inbound voice", "In-app", "Multimodal document capture", "WhatsApp"],
        outcomes: [
          "Documented comprehension rate at segment activation",
          "Complaint and dispute rate on derivatives losses",
          "Regulatory examination findings on suitability records",
        ],
        whyThisCompany:
          "SEBI's own research has found that roughly nine in ten individual derivatives traders lose money, with aggregate individual losses widening sharply, and the regulator has spent 2024-2026 raising contract sizes, mandating upfront premium collection and revising margins and STT. Groww sits at the centre of that scrutiny as the largest retail broker with the youngest, most first-time base. This is the one use case where the agent's value is partly defensive: it turns a compliance formality into a defensible, auditable record. It is also the hardest to deploy - an agent gating a regulated segment activation needs write access to the client master plus a compliance sign-off that does not exist yet, and the boundary is absolute: explain the mechanics, never the trade.",
        scores: { economic: 3, volume: 3, suitability: 4, ease: 1, differentiation: 5 },
      },
      {
        id: "groww-corporate-action",
        rank: 5,
        name: "Corporate action, settlement and tax-statement resolution agent",
        audience: "customer",
        lifecycle: "service",
        econ: "cost",
        current:
          "A first-time investor sees 100 shares become 500 after a split, an unfamiliar rights entitlement appear in their demat, a dividend that did not arrive, a buyback window they did not understand, an F&O position that went to physical delivery, or a capital gains statement they cannot reconcile at filing time. They open a ticket. A human reads the same registrar and depository data the investor could not interpret and writes it back in English.",
        agentic:
          "The agent reads the client's actual holdings, the corporate action master, the registrar record and the settlement calendar, and explains what happened to this specific position - in this client's language, with their own numbers. Where the event needs an action it completes it: submits a buyback or rights application on the client's instruction, initiates a dividend revalidation with the registrar, regenerates or emails a capital gains and STT statement for the requested period, or raises a records correction where the demat and registrar disagree. Anything ambiguous about entitlement or tax treatment beyond the statement is escalated rather than guessed.",
        trigger:
          "Corporate action record date affecting a client's holding, a settlement or physical-delivery event, a dividend credit failure, or an inbound query about a statement or a changed holding quantity.",
        systems: [
          "Depository holdings and demat records",
          "Corporate action master and RTA interfaces",
          "Back office settlement and contract notes",
          "Tax/capital gains statement generation",
        ],
        channels: ["In-app chat", "WhatsApp", "Email", "Inbound voice"],
        outcomes: [
          "Cost per corporate-action and statement contact",
          "Repeat contacts on the same event",
          "Filing-season contact spike absorbed without added headcount",
        ],
        whyThisCompany:
          "This is the highest-frequency contact class Groww has and it scales linearly with a client base of over 12 million active NSE users, most of whom are meeting these events for the first time. It is deliberately ranked last: every competitor will automate corporate-action explanation, the workflow is more read-and-explain than reason-and-act, and it changes cost rather than competitive position. It earns its place on sheer volume and on the fact that it is genuinely low-risk under SEBI - explaining what already happened to a holding is not advice.",
        scores: { economic: 2, volume: 5, suitability: 3, ease: 4, differentiation: 2 },
      },
    ],
    openers: [
      "You grew the MTF book roughly 3.6x in a year onto a base that is 84% non-metro and mostly first-time. That is the largest pool of leveraged investors in India who have never seen a margin call - and today that conversation is an SMS and a square-off. What is it worth if every one of them got a call in their own language that walked their own pledged holdings and closed the gap before the cut-off?",
      "F&O is down to about a tenth of your customers and new users are arriving through SIPs and ETFs. So the SIP is now your acquisition engine - while industry stoppage ratios are running at record levels. A large share of those stops are a failed mandate, not a decision. Who calls those people back the same day, and what would it be worth if something did it automatically?",
      "You said at Groww Next that intelligence here is assistive, not autonomous, and on advice we completely agree. But KYC completion, mandate repair, margin cures and corporate actions are not advice - they are process. That is where we would put real autonomy, and it is the part none of your competitors are touching.",
    ],
    discovery: [
      "In a typical month, how does your contact mix split between pure process - stalled KYC, failed mandates, margin shortfalls, corporate actions, statements - and anything that genuinely needs human judgement, and what does that mix cost you in support and risk-desk headcount today?",
      "Which of these systems can something already write to rather than only read from - the KRA and depository stack, the risk and margin engine, the mandate and UPI-autopay rails, the client master for segment activation - and what does the compliance sign-off path look like for giving an automated agent that write access?",
      "If an agent could cure a margin shortfall or reinstate a broken SIP mandate end to end with no human touch, what is that worth per case to you - and how much autonomy would your risk and compliance committee actually approve before it insists a person presses the button?",
    ],
    pilot: {
      workflow:
        "Broken SIP mandate diagnosis and reinstatement, run end to end on failed debits in three vernacular languages, with a holdout cohort on the existing notification-only journey.",
      weeks: "8-10",
      why: "It is the cleanest first move on this account: the highest-volume recoverable event, zero advice surface so compliance can approve it quickly, a single unambiguous success metric (mandate reinstated and next instalment collected), and a measurable rupee value per recovered SIP. It also proves the vernacular voice and mandate-rail integrations that the higher-value margin cure agent depends on, without asking risk to hand over the margin engine on day one.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // URBAN COMPANY
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "urban-company",
    name: "Urban Company Limited",
    shortName: "Urban Company",
    category: "Home services marketplace",
    group: "services",
    color: "#6528F7",
    oneLiner:
      "India's largest home-services marketplace, matching consumers to a trained, company-certified network of service professionals across cleaning, beauty, appliance repair and plumbing - and increasingly selling its own products and on-demand domestic help alongside them.",
    whyTop10:
      "Urban Company is the only listed Indian consumer platform where the product is a trained human being who physically arrives at your door at an agreed time and performs work whose scope is not fully known until they get there. Every one of the tens of millions of orders it fulfils a year carries an address, a time window, a skill requirement, a price that can move on arrival, and a quality outcome that can be disputed afterwards. Communication is not overhead on top of the business - scheduling, arrival, scope, rework and partner earnings are the business.",
    snapshot: [
      { label: "Orders (Q1 FY27)", value: "13.2 mn, +79% YoY", kind: "fact" },
      { label: "Net transaction value (Q1 FY27)", value: "₹1,465 cr, +42% YoY", kind: "fact" },
      { label: "Annual transacting users", value: "~8.2 mn, +21% YoY", kind: "fact" },
      { label: "Partner net monthly earnings", value: "₹28,322 average (9M FY26)", kind: "fact" },
      { label: "InstaHelp adj. EBITDA (Q1 FY27)", value: "-₹132 cr", kind: "fact" },
    ],
    whyItMatters:
      "Three things go wrong in a home-services order and all three are communication problems. First, scope: the customer books a category, the professional arrives and the job is bigger, smaller or different, and the price renegotiation at the door poisons the order. Second, time: a job runs long, a professional is delayed, a customer is not home - and the rest of that day's schedule collapses across two sides of the marketplace, taking the partner's earnings with it. Third, aftermath: the work is disputed, and someone has to decide between a rework, a refund and a penalty on a person whose monthly income depends on that decision. Urban Company already runs an AI layer that answers a majority of partner support queries. The gap between that and an agent is action - something that can reassign a job, rebuild a partner's day, correct a payout line, and quote a scope from a photograph before anyone travels.",
    context: [
      {
        text: "Q1 FY27 revenue from operations rose 44% year on year to ₹528 crore and net transaction value 42% to ₹1,465 crore, on 13.2 million orders in the quarter - up 79% year on year. Annual transacting users grew about 21% to roughly 8.2 million, with more than one million new users added in a single quarter for the first time.",
        kind: "fact",
        source: 2,
      },
      {
        text: "The consolidated net loss widened to about ₹92 crore from a small profit a year earlier, entirely on the InstaHelp build-out: excluding InstaHelp the business delivered roughly ₹67 crore of adjusted EBITDA, more than double the prior year, while InstaHelp alone posted an adjusted EBITDA loss of about ₹132 crore.",
        kind: "fact",
        source: 0,
      },
      {
        text: "Across 9M FY26 the average active service partner took home ₹28,322 net per month for about 91 hours on the platform including travel - roughly ₹313 an hour net - with the top 5% clearing ₹51,673. These are earnings-dependent workers for whom a single disputed penalty or a lost afternoon is materially significant.",
        kind: "fact",
        source: 1,
      },
      {
        text: "After partner protests in 2021 Urban Company capped its commission at 25%, down from the 30-35% range, and capped monthly penalties per partner, as part of a published 12-point partner programme. Partner earnings and penalty fairness have been a live public and reputational issue for the company ever since, and it now publishes a partner earnings index.",
        kind: "fact",
        source: 3,
      },
      {
        text: "Management has said AI already sits underneath quality checks, partner support, demand forecasting and fraud detection, and that a majority of partner support queries are handled through AI today - alongside heavy internal GenAI use in engineering and marketing.",
        kind: "fact",
        source: 0,
      },
      {
        text: "That existing layer answers questions; it does not complete outcomes. The differentiated opening is agentic action across the dispatch, catalogue, pricing and payout systems - and the single strongest unclaimed opening is multimodal, because the customer can already photograph the exact problem before anyone is dispatched. Volumes and unit costs behind these workflows are not public and must be sized in discovery.",
        kind: "inference",
      },
    ],
    sources: [
      {
        label: "Urban Company - Q1 FY27 earnings conference call transcript (31 July 2026)",
        url: "https://uc-investor-reports.s3.ap-southeast-1.amazonaws.com/Q1_FY27_Earnings_Conference_Call_Transcript.pdf",
      },
      {
        label: "Urban Company Investor Relations - Service Partners Earnings Index, 9M FY26",
        url: "https://investorrelations.urbancompany.com/announcements-and-highlights/service-partners-earnings-index-9m-fy26",
      },
      {
        label: "Business Standard - Urban Company spurts after Q1 revenue rises 44% YoY",
        url: "https://www.business-standard.com/markets/capital-market-news/urban-company-spurts-after-q1-revenue-rises-44-yoy-126080300283_1.html",
      },
      {
        label: "Business & Human Rights Resource Centre - Urban Company reduces commission cap in 12-point agenda following protests",
        url: "https://www.business-humanrights.org/en/latest-news/india-urban-company-reduces-commission-cap-in-12-point-agenda-following-protests/",
      },
      {
        label: "Inc42 - Why InstaHelp isn't helping Urban Company's finances",
        url: "https://inc42.com/features/why-instahelp-isnt-helping-urban-companys-finances/",
      },
    ],
    useCases: [
      {
        id: "uc-photo-scope-quote",
        rank: 1,
        name: "Photograph-to-scope job quoting and skill-matched booking agent",
        audience: "customer",
        lifecycle: "convert",
        econ: "both",
        current:
          "A customer with a leaking pipe, a stained sofa or an air conditioner that will not cool picks a category from a menu and guesses which service it maps to. The professional travels, opens the job, and finds it is a different or larger job than booked. Now there is a price conversation at the doorstep between a customer who feels upsold and a professional who is paid for the booked service. The order gets cancelled, downgraded, rescheduled for the right skill-set or parts, or completed badly - and the professional absorbs the travel time for nothing.",
        agentic:
          "The customer sends photographs or a short video of the actual problem on WhatsApp or in-app. The agent identifies the fault class and the asset - the make and rough vintage of the appliance, the fabric and stain type, the pipe fitting and mounting - asks the two or three disambiguating questions a good dispatcher would ask, and reasons over the city catalogue, current pricing and known parts availability. It returns a firm price or a tight quoted band with the scope written down and what is excluded, and then books the professional who actually holds that skill certification, in a slot long enough for the real job, with the parts or consumables reserved. If the photos are inconclusive it says so and books a paid inspection rather than pretending to a quote.",
        trigger:
          "Customer opens a booking flow and uploads an image or video, or sends a photo of a problem into the WhatsApp channel without a booking.",
        systems: [
          "Service catalogue and city-level pricing engine",
          "Partner skill certification and availability graph",
          "Vision/multimodal fault and asset classification",
          "Parts and consumables inventory",
          "Booking and dispatch",
        ],
        channels: ["Multimodal photo/video capture", "WhatsApp", "In-app", "Voice follow-up"],
        outcomes: [
          "Share of jobs completed at quoted scope and price, without doorstep renegotiation",
          "Cancellation and reschedule rate after professional arrival",
          "Wasted partner travel hours per hundred jobs, and first-visit resolution rate",
        ],
        whyThisCompany:
          "Urban Company fulfilled 13.2 million orders in a single quarter with growth of 79%, and the failure mode that scales fastest with that volume is the scope surprise at the door - because it destroys value on both sides simultaneously: a refund or discount for the customer, unpaid travel for the partner, a wrong-skill dispatch for the platform, and a rating hit for someone who did nothing wrong. Urban Company is one of the few Indian platforms where the customer can literally show the agent the problem before anyone is dispatched, and where the company controls the catalogue, the pricing and the certified skill graph needed to act on what it sees. A competitor cannot copy this without the same certified supply.",
        scores: { economic: 5, volume: 4, suitability: 5, ease: 3, differentiation: 5 },
      },
      {
        id: "uc-day-recovery",
        rank: 2,
        name: "Live day-recovery agent for partner schedules and slot reassignment",
        audience: "partner",
        lifecycle: "transact",
        econ: "both",
        current:
          "A job overruns, a professional's vehicle breaks down, a customer is not home, or traffic collapses. Today this cascades: the partner calls or messages the next customers themselves, the platform notifies late or not at all, downstream jobs get cancelled, and the professional loses the rest of the day's earnings on a day they had already committed. Someone in operations manually reassigns what they can catch.",
        agentic:
          "The agent detects the overrun or disruption from job telemetry and location, then re-plans the whole remaining day rather than one booking. It negotiates a new window with each affected customer in their language and gets an actual answer rather than sending a notification, reassigns jobs it cannot save to the nearest professional who holds the right certification and carries the right kit, and - this is the part that matters to supply - backfills the incumbent partner's now-empty slots from waitlisted and flexible demand in that micro-market so the day is not simply lost. It applies the cancellation-fee and travel-compensation policy itself, tells the partner what they will now be paid, and confirms it in writing. Any dispute the partner raises about safety, a customer's behaviour or the compensation decision goes to a human, not into a loop with the agent.",
        trigger:
          "Job overrun beyond expected duration, partner check-in anomaly or location stall, customer no-show at the door, or a same-day cancellation that opens a gap in an assigned schedule.",
        systems: [
          "Dispatch, slotting and routing",
          "Partner app telemetry and geolocation",
          "Customer booking and notification stack",
          "Cancellation and compensation policy engine",
          "Partner payout ledger",
        ],
        channels: ["Outbound voice (vernacular)", "WhatsApp", "Partner app push", "Customer app"],
        outcomes: [
          "Recovered partner earning hours per disrupted day",
          "Downstream cancellations caused by an upstream overrun",
          "On-time arrival rate and same-day rebooking acceptance",
        ],
        whyThisCompany:
          "The average partner is on the platform around 91 hours a month including travel and nets roughly ₹313 an hour - so an hour lost to a cascade is real money out of a real person's month, and it is simultaneously lost NTV for Urban Company. At 13.2 million orders a quarter this cannot be run by a manual operations desk. It is genuinely two-sided, which is why it sits second: it needs write access to dispatch and to the payout ledger, and it must be built so that safety and harassment escalations route straight to a human within a fixed SLA rather than being handled conversationally.",
        scores: { economic: 4, volume: 5, suitability: 4, ease: 2, differentiation: 4 },
      },
      {
        id: "uc-instahelp-activation",
        rank: 3,
        name: "InstaHelp supply onboarding and first-90-day activation agent",
        audience: "partner",
        lifecycle: "onboard",
        econ: "revenue",
        current:
          "Urban Company is onboarding domestic-help partners at speed to densify InstaHelp micro-markets. A large share sign up and never activate: background verification stalls on a document, a training slot is missed, the assigned zone is too far to travel to profitably, or a competitor recruiter reaches them first with a different earnings promise. The chase is manual, the reasons for drop-off are discovered late, and the acquisition cost is paid twice.",
        agentic:
          "The agent works the signed-up-but-inactive partner as a case. It chases and re-captures verification documents multimodally - asking for a photo, checking legibility and validity before submission rather than after a rejection - books a training slot at the nearest centre and confirms attendance, and explains the earnings model concretely and honestly against what a competitor recruiter has told them, using the platform's own published earnings data rather than a pitch. It then monitors the first 90 days for the real drop-off signals - no slots accepted, long dead travel, ratings sliding, availability set to almost nothing - diagnoses the cause and fixes it: re-zone to a closer micro-market, book a targeted re-training module, adjust the availability pattern, or flag genuine distress to a human.",
        trigger:
          "Partner registers but does not complete verification, misses a training slot, or crosses a defined inactivity or declining-utilisation threshold inside the first 90 days.",
        systems: [
          "Partner onboarding and background verification",
          "Training centre scheduling and NSDC certification records",
          "Micro-market supply density and demand forecasting",
          "Partner app availability and utilisation data",
          "Partner earnings ledger",
        ],
        channels: ["Outbound voice (vernacular)", "WhatsApp", "Multimodal document capture", "Partner app"],
        outcomes: [
          "Registered-to-first-job conversion and time to first job",
          "90-day partner retention and utilisation per active partner",
          "Supply onboarding cost per productive partner in a micro-market",
        ],
        whyThisCompany:
          "InstaHelp is running an adjusted EBITDA loss of roughly ₹132 crore a quarter, and management has been explicit that a meaningful part of that is supply onboarding and densification spend that should compress as density deepens. Competitors are recruiting from exactly the same labour pool in exactly the same micro-markets, so every partner who signs up and never activates is money handed to a rival. This is a partner-side revenue use case, not a cost one - and it must be built with dignity as a constraint: honest earnings information, no pressure tactics on people in financial distress, and a human on the line the moment safety, harassment or hardship comes up.",
        scores: { economic: 4, volume: 3, suitability: 4, ease: 3, differentiation: 4 },
      },
      {
        id: "uc-rework-adjudication",
        rank: 4,
        name: "Evidence-based rework and quality-dispute adjudication agent",
        audience: "customer",
        lifecycle: "service",
        econ: "cost",
        current:
          "After the professional leaves, the customer reports streaks after a deep clean, an air conditioner still not cooling, a botched treatment, a fitting that leaked again. A support agent takes a description, applies a rules table, and lands somewhere between a full refund, a free rework and a rejection - then a penalty may be applied to the professional. Decisions are inconsistent, the customer feels unheard, and the professional often has no idea why their earnings were docked.",
        agentic:
          "The agent asks for photo or video evidence and compares it against the pre-service images, the service checklist the professional completed, the job duration and the warranty window for that category. It reasons over the professional's own history rather than treating them as anonymous, then decides and executes: book a rework - deliberately with the same professional where they are not at fault, so their earnings are protected and the customer gets continuity - issue a partial refund, or decline with a reason the customer can actually follow. It then explains the outcome to the professional, including any penalty, before they discover it in their payout. Where the evidence is genuinely ambiguous, or where the complaint concerns conduct rather than quality, it does not adjudicate - it routes to a human.",
        trigger:
          "Post-service complaint raised inside the warranty window, a low rating with a written reason, or a repeat booking in the same category at the same address within days.",
        systems: [
          "Service checklist and job completion records",
          "Vision comparison of pre- and post-service imagery",
          "Refund, warranty and rework policy engine",
          "Partner quality score and penalty ledger",
          "Payments and refunds",
        ],
        channels: ["Multimodal photo/video capture", "WhatsApp", "In-app", "Partner app"],
        outcomes: [
          "Cost per quality dispute and refund leakage on ambiguous claims",
          "Rework resolution time and repeat-complaint rate",
          "Partner appeals against penalties, and partner-perceived fairness",
        ],
        whyThisCompany:
          "Urban Company's entire promise is that a company-certified professional does the job properly, so a quality dispute attacks the brand claim itself - and unlike a marketplace shipping a product, the platform cannot simply refund and move on, because a penalty decision lands on a worker's monthly income. Ranked fourth deliberately: this is high volume and real money, but rework adjudication is the workflow every services competitor will also automate, so it improves cost and consistency rather than changing competitive position. The dignity constraint is non-negotiable - conduct, harassment and safety allegations must never be adjudicated by an agent.",
        scores: { economic: 3, volume: 5, suitability: 4, ease: 3, differentiation: 3 },
      },
      {
        id: "uc-payout-transparency",
        rank: 5,
        name: "Line-by-line partner payout, commission and penalty resolution agent",
        audience: "partner",
        lifecycle: "retain",
        econ: "cost",
        current:
          "A professional's weekly payout is lower than they expected. The gap could be a commission slab, consumables and product cost charged against the job, a penalty for a late arrival or a cancellation, a missed incentive tier, a refund clawback, or a genuine error. Today they call or message support, wait, and often receive a summary rather than an itemised explanation. Unexplained earnings deltas are the single most corrosive issue in this business - they have driven public protests and continue to shape how the company is written about.",
        agentic:
          "The agent reconstructs the payout line by line from the job ledger, commission slab, consumables charged, penalty ledger, incentive tier progress and any clawback, and explains the exact rupee delta against what the partner expected, in their language, on the partner app or a voice call. Where it finds a penalty applied against policy, a missing incentive the partner in fact qualified for, or a consumable charged on a job that did not use it, it does not just explain - it raises and completes the correction and confirms the revised amount and date. Where the partner is in earnings distress, alleges harassment or an unsafe customer, or disputes a decision after the correction path is exhausted, the agent stops and hands to a named human within a fixed SLA.",
        trigger:
          "Partner opens a payout query, a payout falls outside their recent range by a defined margin, or a penalty or clawback is applied to a partner's ledger.",
        systems: [
          "Partner payout and settlement ledger",
          "Commission slab and incentive engine",
          "Penalty and quality-score records",
          "Consumables and product cost allocation",
          "Partner grievance and escalation workflow",
        ],
        channels: ["Partner app", "WhatsApp", "Outbound and inbound voice (vernacular)"],
        outcomes: [
          "Payout queries resolved without a human touch, and time to resolution",
          "Corrections found proactively versus raised by the partner",
          "Partner churn among those who raised an earnings dispute",
        ],
        whyThisCompany:
          "Urban Company publishes a partner earnings index precisely because this number is contested in public: average net in-hand of ₹28,322 a month across roughly 91 hours, with a commission cap and penalty caps that exist because partners protested for them in 2021. Getting the explanation right is a retention and reputation issue, not a support-cost issue. It is ranked last because it needs write access to the payout ledger - the hardest permission in the company to obtain - and because the agent must be scoped narrowly by design: it explains and corrects arithmetic, and it explicitly does not negotiate, adjudicate conduct, or handle a worker in hardship without a human.",
        scores: { economic: 3, volume: 4, suitability: 4, ease: 2, differentiation: 4 },
      },
    ],
    openers: [
      "You did 13.2 million orders last quarter, up 79%, and the thing that most reliably turns a good order into a bad one is the scope surprise at the door. Your customer can already photograph the leak or the stain. If they got a firm price and the right certified skill-set booked before anybody travelled, what does that do to your cancellation, rework and wasted-travel lines?",
      "Your partners net around ₹28,000 a month across roughly 91 hours including travel. When a job overruns at eleven in the morning, who rebuilds the rest of that person's day - and how fast? Every hour you fail to recover is their income and your NTV, and at your order volume that cannot be an operations desk with a phone.",
      "InstaHelp lost about ₹132 crore at adjusted EBITDA last quarter, and management says a chunk of that is supply onboarding and densification. Some share of the partners you paid to acquire signed up and never took a job. What would it be worth if chasing verification, booking training and saving the first ninety days were an agent's job rather than a recruiter's callback list?",
    ],
    discovery: [
      "Of the orders you fulfilled last quarter, what share hit a scope change at the door, a same-day reschedule, or a post-service rework - and what does each of those actually cost you once you add the refund, the wasted partner travel and the rating damage?",
      "Which of your systems can something write to today rather than only read from - dispatch and slotting, the pricing catalogue, the partner payout and penalty ledger, the training-slot calendar - and where does a human still have to press the button before a customer or a partner is affected?",
      "If an agent could re-sequence a partner's remaining day autonomously, or settle a payout dispute line by line and issue the correction itself, where exactly would you draw the line and insist a human takes over - and what evidence would you need before you trusted it with a decision that changes someone's earnings?",
    ],
    pilot: {
      workflow:
        "Photograph-to-scope quoting and skill-matched booking for appliance repair and deep cleaning in two cities, with the quoted scope and price binding, measured against the standard menu-booking flow.",
      weeks: "10-12",
      why: "It is the one workflow here that is both the highest-value and genuinely unclaimed, and it is measurable inside a quarter on metrics the company already tracks: jobs completed at quoted scope, doorstep renegotiations, post-arrival cancellations and wasted partner travel. Two categories and two cities is enough to build a real fault-and-asset classification set without touching the payout ledger, and it needs only the catalogue, pricing and skill graph - the least contested system access in the company. It also produces the pre-service image corpus that the rework adjudication agent later depends on.",
    },
  },
];
