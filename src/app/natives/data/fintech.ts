import type { Company } from "../schema";

export const COMPANIES_FINTECH: Company[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // PhonePe — consumer UPI scale, monetised through distribution
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "phonepe",
    name: "PhonePe Limited",
    shortName: "PhonePe",
    category: "Consumer UPI & financial-services distribution",
    group: "fintech",
    color: "#5F259F",
    oneLiner:
      "India's largest UPI app by transaction volume, monetising a near-free payments rail by distributing lending, insurance and broking to the same consumer and merchant base.",
    whyTop10:
      "No other Indian company sits on this many consumer money-movement events per day. UPI P2M carries almost no merchant discount rate, so PhonePe's economics depend on converting payment moments into distribution outcomes — and every one of those conversions is a conversation. It is also the only company on this list whose interaction quality is a regulated market-share question: NPCI's proposed 30% cap makes retention, not acquisition, the strategic problem.",
    snapshot: [
      { label: "UPI volume share", value: "46.85% as of 30 Sep 2025 (DRHP), against a proposed 30% NPCI cap", kind: "fact" },
      { label: "FY26 operating revenue", value: "₹7,920.5 Cr, up 11.5% YoY — a sharp deceleration from FY25's 40%", kind: "fact" },
      { label: "FY26 net loss", value: "₹2,792 Cr, widened 62% on employee, marketing and ESOP costs plus goodwill impairment", kind: "fact" },
      { label: "Registered merchants", value: "Over 5 crore accepting merchants (company disclosure, Apr 2026)", kind: "fact" },
      { label: "Lending distribution", value: "₹14,270 Cr facilitated across 56 lending partners as of Sep 2025", kind: "fact" },
    ],
    whyItMatters:
      "PhonePe's FY26 tells the whole story: payments revenue barely grew while the lending subsidiary more than doubled. The rail is mature; the monetisation is a distribution business bolted onto it. That makes the communications layer the actual P&L. Three things follow. First, at roughly half of national UPI volume PhonePe is the remitter-side app on an enormous share of every failed or stuck payment in India, most of which are not its fault and all of which are its brand problem — and with an NPCI market-share cap hanging over it, a lost user is not replaceable at will. Second, five crore merchants were signed up far faster than they were activated, and an inactive QR earns nothing and cross-sells nothing. Third, insurance revenue was almost flat year on year while lending doubled, which says the harder, more regulated, more conversation-dependent product is the one that has not scaled. Every one of those is an agent problem, not a notification problem.",
    context: [
      {
        text: "FY26 operating revenue rose 11.5% to ₹7,920.5 Cr while net loss widened 62% to ₹2,792 Cr, driven by higher employee, marketing and ESOP costs, a ₹684.7 Cr goodwill impairment, and a ₹364.7 Cr loss from discontinued operations after the Pincode hyperlocal commerce app was shut down.",
        kind: "fact",
        source: 0,
      },
      {
        text: "Within FY26, the lending subsidiary more than doubled revenue to ₹945 Cr and wealth broking doubled to ₹108 Cr, while insurance grew only to ₹191 Cr from ₹180 Cr. In the DRHP, insurance was reported bundled with lending rather than as a standalone vertical — read by analysts as a sign it has not scaled to plan.",
        kind: "fact",
        source: 0,
      },
      {
        text: "The DRHP discloses UPI volume market share of 46.85% as of 30 September 2025 against NPCI's proposed 30% third-party app cap, whose compliance deadline has been extended to 31 December 2026. It is listed as a principal risk factor.",
        kind: "fact",
        source: 1,
      },
      {
        text: "SEBI cleared the IPO in January 2026 as a 100% offer for sale, but PhonePe deferred the listing in March 2026 citing market volatility, saying it would resume once conditions stabilise. A pre-listing company is unusually sensitive to the cost line and to any narrative about churn.",
        kind: "fact",
        source: 2,
      },
      {
        text: "PhonePe has already shipped merchant-facing AI: SmartPages, an AI payment-page creator inside the payment gateway dashboard, and an AI-powered integration layer built for coding assistants that aims to cut merchant integration from weeks to minutes. The internal appetite for AI in merchant workflows is established — it has simply not yet been pointed at conversations.",
        kind: "fact",
        source: 4,
      },
      {
        text: "With UPI person-to-merchant payments effectively zero-MDR, the marginal rupee per user comes from attaching a loan, a policy or a broking account to an existing payment relationship. That reframes the communications job from answering questions about payments to completing distribution outcomes inside regulated boundaries — which is precisely the work a scripted IVR or a push notification cannot do.",
        kind: "inference",
      },
    ],
    sources: [
      {
        label: "Outlook Business — PhonePe FY26: ₹2,792 Cr loss, revenue up 11%, lending and wealth grow",
        url: "https://www.outlookbusiness.com/corporate/phonepe-fy26-losses-rs-2792-cr-revenue-rises-11-pc-lending-wealth-insurance-grow-ipo-plans",
      },
      {
        label: "Finshots — Breaking down the PhonePe DRHP",
        url: "https://finshots.in/archive/breaking-down-the-phonepe-drhp/",
      },
      {
        label: "Business Standard — PhonePe defers IPO plans amid market volatility",
        url: "https://www.business-standard.com/markets/ipo/phonepe-defers-ipo-plans-amid-west-asia-crisis-market-volatility-126031600596_1.html",
      },
      {
        label: "Inc42 — How PhonePe makes money: UPI, loans, merchants and more",
        url: "https://inc42.com/features/how-phonepe-makes-money-upi-loans-merchants-more/",
      },
      {
        label: "PhonePe press — AI-powered integration layer for merchants",
        url: "https://www.phonepe.com/press/phonepe-introduces-ai-powered-integration-layer-for-merchants/",
      },
    ],
    useCases: [
      {
        id: "phonepe-stuck-payment-recovery",
        rank: 1,
        name: "Stuck-payment resolution agent — works the dispute before the customer complains",
        audience: "customer",
        lifecycle: "service",
        econ: "cost",
        current:
          "A UPI payment shows as debited but the beneficiary is not credited. The customer waits, retries, then floods the app's help section, social media and the bank's helpline. Today the app can show a status string but cannot tell the customer which leg is stuck, cannot say when the reversal will land, and cannot act on the customer's behalf across the remitter bank, the beneficiary bank and NPCI's dispute rails. The customer experiences a bank's failure as PhonePe's failure.",
        agentic:
          "The agent watches for a payment that is debited with no confirmed credit and no auto-reversal, and starts before the customer does. It reasons over which leg failed, the applicable auto-reversal cycle, and whether the RBI turnaround-time window has been breached. It raises and tracks the chargeback or dispute with the correct counterparty, reaches the customer on their preferred channel with a specific expected-credit window rather than a status code, updates them unprompted when the batch clears, and where the TAT was breached it files the compensation claim on the customer's behalf instead of waiting for them to know it exists. If the beneficiary bank stalls, it escalates with the full evidence trail already assembled.",
        trigger:
          "Debit confirmed with no matching credit confirmation past the expected settlement window, or a customer-initiated dispute on a transaction the agent has already been tracking.",
        systems: [
          "UPI switch and transaction ledger",
          "NPCI dispute and chargeback rails (URCS / UDIR)",
          "Partner bank status APIs",
          "Customer support case management",
          "Notification and messaging platform",
        ],
        channels: ["In-app chat", "WhatsApp", "Voice (regional languages)", "Push and SMS"],
        outcomes: [
          "Inbound contacts per failed transaction",
          "Time to confirmed reversal and TAT-breach incidence",
          "30-day retention of users who experienced a failure",
        ],
        whyThisCompany:
          "At roughly 46% of national UPI volume, PhonePe is the remitter-side app on a very large share of India's stuck payments — the majority caused at a bank it does not control. With an NPCI market-share cap forcing it to defend rather than acquire share, the recovery experience after a failure is one of the few levers that changes whether a user opens PhonePe or a rival next time. This is also the workflow most constrained by write access: raising disputes and claiming compensation touches money movement and bank rails.",
        scores: { economic: 5, volume: 5, suitability: 5, ease: 2, differentiation: 2 },
      },
      {
        id: "phonepe-merchant-first-90-days",
        rank: 2,
        name: "First-90-days merchant activation agent — from QR delivered to second transaction",
        audience: "merchant",
        lifecycle: "onboard",
        econ: "both",
        current:
          "Merchants are signed up in enormous numbers by field distribution, then left to a generic drip of SMS and app nudges. A shop that never takes a first payment, or takes one and stops, is usually stuck on something specific and unglamorous: the settlement bank account failed penny-drop verification, the QR was never mounted at the counter, the owner cannot find the merchant app, or a rival's field agent got there with a device first. Nobody calls, because calling five crore merchants is not a staffing plan.",
        agentic:
          "For every newly onboarded merchant the agent runs an activation loop keyed to that merchant's own behaviour. It reasons over which step actually broke — KYC document mismatch, unverified settlement account, no transaction despite an active QR, or a first transaction with no repeat — and takes the corresponding action: re-collecting or re-submitting the specific KYC artefact, re-triggering bank account verification, walking the owner through mounting and testing the QR with a one-rupee test payment on a voice call in their language, and where the transaction profile justifies it, closing the SmartSpeaker subscription so audio confirmation removes the trust gap. It hands to a field executive only when a physical visit is genuinely the remaining blocker, and books the slot.",
        trigger:
          "Merchant onboarded with no first transaction inside the expected window, KYC or settlement-account verification stalled, or first transaction with no repeat activity.",
        systems: [
          "Merchant onboarding and KYC platform",
          "Settlement account verification",
          "Merchant transaction telemetry",
          "SmartSpeaker / device subscription and fulfilment",
          "Field-sales CRM and territory routing",
        ],
        channels: ["Voice (regional languages)", "WhatsApp", "Merchant app", "SMS"],
        outcomes: [
          "Share of onboarded merchants reaching a second transaction",
          "KYC and settlement-verification completion rate",
          "Field visits avoided per activated merchant",
        ],
        whyThisCompany:
          "PhonePe's merchant story is acquisition depth — over five crore accepting merchants, heavily weighted to small tier-2 and tier-3 shops reached by field distribution. Breadth of that kind creates a long tail that no human team can call, and an inactive merchant is worth nothing on payments and cannot be cross-sold a loan. The regulated constraint is real: KYC completion has prescribed evidence standards, so the agent collects and validates but the acceptance decision stays with the compliance system.",
        scores: { economic: 3, volume: 4, suitability: 4, ease: 3, differentiation: 3 },
      },
      {
        id: "phonepe-merchant-working-capital",
        rank: 3,
        name: "Merchant working-capital agent — offer, explain and complete, without crossing the LSP line",
        audience: "merchant",
        lifecycle: "upsell",
        econ: "revenue",
        current:
          "PhonePe acts as a lending service provider, using settlement and transaction data to identify eligible merchant borrowers for its partner lenders. Eligibility is surfaced as a banner in the merchant app. Most small merchants do not act on a banner: they do not understand which of several partner offers applies, they cannot compare a flat fee to a reducing-balance rate, and they abandon at the document and mandate steps. The offers expire silently.",
        agentic:
          "When a merchant's own settlement pattern signals a working-capital need — a restock cycle, a seasonal spike, a receipts dip after a good run — the agent opens a conversation in the merchant's language using the merchant's own numbers. It explains the specific partner offers side by side including the total cost in rupees, answers objections, collects and validates the remaining documents, completes bank verification and the repayment mandate, and hands a complete, decision-ready file to the partner lender. It states clearly that PhonePe is the distributor and the lender decides, presents the Key Facts Statement, never quotes an approval it cannot honour, and stops and escalates the moment the merchant asks a question that amounts to credit advice.",
        trigger:
          "Pre-qualified offer generated for a merchant, or a settlement-pattern signal indicating a working-capital gap while an unexpired offer exists.",
        systems: [
          "Merchant settlement and transaction history",
          "Lending partner APIs and offer engine",
          "KYC and document vault",
          "Mandate / auto-debit setup",
          "Consent and audit log",
        ],
        channels: ["Voice (regional languages)", "WhatsApp", "Merchant app"],
        outcomes: [
          "Offer-to-disbursal conversion on pre-qualified merchants",
          "Drop-off at document and mandate steps",
          "Distribution fee revenue per active merchant",
        ],
        whyThisCompany:
          "Lending is the only PhonePe line that is genuinely compounding — the lending subsidiary more than doubled revenue in FY26 while payments grew 11%. With ₹14,270 Cr facilitated across 56 lending partners, the constraint is not supply of credit or of eligible merchants; it is that nobody has the conversation. The RBI Digital Lending Directions bound this tightly: as an LSP, PhonePe can source, explain and collect documents, but sanction, pricing and the KFS sit with the lender, and every interaction has to be consented and logged. That regulatory ceiling is exactly why ease is scored low here.",
        scores: { economic: 4, volume: 3, suitability: 3, ease: 2, differentiation: 4 },
      },
      {
        id: "phonepe-insurance-renewal-claims",
        rank: 4,
        name: "Policy lapse-rescue and claim-intimation agent for distributed insurance",
        audience: "customer",
        lifecycle: "retain",
        econ: "revenue",
        current:
          "A motor or health policy sold through PhonePe comes up for renewal, or the customer has an incident and needs to claim. Renewal today is a reminder notification and a payment link; if the customer has a question — did my no-claim bonus carry over, is my existing condition covered, why is the premium higher — there is nobody to ask, so they let it lapse or renew elsewhere. On claims, the customer is handed to the insurer and PhonePe disappears from the moment that actually forms the relationship.",
        agentic:
          "Ahead of renewal the agent contacts the customer, reads back what they are actually covered for, answers factual questions about the policy wording and the premium change, resolves the specific blocker — an expired card on the mandate, a vehicle or address detail that must be updated, a nominee change — and completes the renewal through UPI Autopay. On a claim event it takes the intimation, checks the claim against the policy's documented requirements, tells the customer exactly which documents are missing, collects them over WhatsApp including photographs, files the intimation with the insurer and then chases status on the customer's behalf until settlement. It states facts about the policy the customer holds and never recommends a product or comments on suitability, and hands to a licensed human the instant the conversation turns to advice.",
        trigger:
          "Renewal window opening, a failed renewal mandate, or a customer-reported claim event.",
        systems: [
          "Insurance policy administration and insurer APIs",
          "Claims intimation workflow",
          "UPI Autopay / mandate management",
          "Document capture and validation",
          "Licensed-advisor escalation queue",
        ],
        channels: ["WhatsApp (document capture)", "Voice", "In-app", "Email"],
        outcomes: [
          "Renewal persistency on distributed policies",
          "Claim intimation-to-settlement cycle time",
          "Repeat purchase rate on insurance attach",
        ],
        whyThisCompany:
          "Insurance is the visible gap in PhonePe's distribution thesis — ₹191 Cr in FY26 against ₹180 Cr the year before, while lending doubled and broking doubled. Insurance underperforms precisely because it is the product that cannot be sold by banner: it needs a conversation at renewal and a competent hand at claim time, and PhonePe has never had a channel that could do either at consumer scale. IRDAI advice boundaries cap how far autonomy can go, which holds ease down, but the same boundaries are why the deterministic parts — reading back cover, chasing documents, completing renewal — are so well suited to an agent.",
        scores: { economic: 3, volume: 2, suitability: 4, ease: 2, differentiation: 4 },
      },
      {
        id: "phonepe-fraud-interdiction-callback",
        rank: 5,
        name: "Scam-in-progress interdiction agent — verified callback that never becomes the attack",
        audience: "customer",
        lifecycle: "transact",
        econ: "cost",
        current:
          "Risk models flag a suspicious outbound payment — a first-time payee, a velocity spike, a beneficiary VPA associated with mule activity. The system either blocks silently, which infuriates a legitimate customer mid-payment, or lets it through and deals with a fraud report and a police complaint days later. There is no real-time human conversation available at this volume, and the conversation itself is dangerous: a badly designed verification call is indistinguishable from the scam it is trying to stop.",
        agentic:
          "On a high-risk signal the agent reaches the payer inside the intervention window, on a channel and with an identity the customer can independently verify in the app. It never asks for a PIN, OTP, card number or any credential — verification runs through an in-app challenge the customer initiates themselves, so the interaction is structurally useless to an impersonator. It asks the questions that actually break a scam script: who asked you to make this payment, did someone call you first, were you told to keep this confidential. Based on the answers it either releases the payment immediately, places a hold, or — where money has already moved — files the fraud report with the beneficiary bank and the national cybercrime portal on the customer's behalf inside the golden hour, and follows up with the outcome.",
        trigger:
          "Real-time risk score breach on an outbound payment, or a mule-linked beneficiary detected on a completed transfer inside the recall window.",
        systems: [
          "Real-time fraud and risk engine",
          "Payment hold / release controls",
          "Beneficiary and mule-account intelligence",
          "Bank fraud-reporting and recall rails",
          "Cybercrime reporting integration",
        ],
        channels: ["Voice (verified callback)", "In-app challenge", "Push"],
        outcomes: [
          "Value of fraud prevented before settlement",
          "False-positive intervention rate on legitimate payments",
          "Recovery rate on reports filed inside the golden hour",
        ],
        whyThisCompany:
          "Share of UPI volume translates directly into share of India's UPI scam surface, and PhonePe carries the largest one. It is also the account where a verification-callback agent is most dangerous to get wrong: teaching half of India that PhonePe calls to verify payments hands scammers a script unless the identity model is inverted so the customer verifies the agent. That combination of huge exposure, write access to hold live payments, and a genuinely novel trust design is why this scores lowest on ease and highest on differentiation.",
        scores: { economic: 4, volume: 3, suitability: 4, ease: 1, differentiation: 4 },
      },
    ],
    openers: [
      "At roughly 46% of UPI volume you are the remitter-side app on a very large share of every debited-but-not-credited complaint in India — and most of them are stuck at a bank you do not control. We think an agent that works the dispute and calls the customer before they complain turns your single biggest support cost into the reason they do not try Google Pay next week.",
      "Your FY26 said payments grew 11% and lending doubled. That means the next rupee comes from a conversation, not a QR scan — and right now you are having that conversation with a push notification.",
      "You have signed up merchants far faster than you have activated them. We would put an agent on the first ninety days of every new merchant and measure it on second transaction, not on onboarding completion — because an inactive QR earns nothing and cannot be cross-sold a loan.",
    ],
    discovery: [
      "In a typical month, how many customer contacts trace back to a payment that failed at someone else's bank — and what does each of those contacts cost you today across chat, voice and social escalation?",
      "Of the merchants onboarded last quarter, what share reached a second transaction, and who — if anyone — actually speaks to the ones that did not?",
      "Where is the line today between what an automated system may do on its own and what needs a human sign-off — specifically, could an agent raise a chargeback, complete an insurance renewal, or place a hold on a live payment without a person in the loop?",
    ],
    pilot: {
      workflow:
        "Stuck-payment resolution on a single high-volume failure class — debited-but-not-credited on P2M transactions — running proactive outbound before the customer contacts support, with dispute filing and TAT-breach compensation claims in the loop.",
      weeks: "10 weeks",
      why: "It is the highest-volume, most measurable workflow in the account, and it can be proven on a read-mostly footprint: the agent detects, explains and communicates from day one, while write access to the dispute rails is enabled for a controlled cohort. Success is unambiguous — inbound contacts per failure, time to confirmed reversal, and 30-day retention of users who hit a failure — all measurable inside the pilot window against a holdout, which matters for a company that has to show cost discipline before it lists.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Paytm / One97 Communications — merchant-first, device-subscription economics
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "paytm",
    name: "One97 Communications (Paytm)",
    shortName: "Paytm",
    category: "Merchant payments, devices & distribution",
    group: "fintech",
    color: "#00BAF2",
    oneLiner:
      "A merchant-first payments company that monetises a subscription hardware estate — Soundbox and card machines — and distributes credit and wealth products for partner lenders without holding the loans itself.",
    whyTop10:
      "Paytm is the only company on this list whose core revenue is a recurring per-device subscription billed monthly to one and a half crore small merchants. That converts communications from a support cost into a revenue-retention system: a silent device is a subscription in dispute, a settlement question is a churn trigger, and a bounced EMI is a distribution fee that never arrives. Coming out of the Payments Bank restructuring into its first full profitable year, it also has the sharpest cost discipline of any account here — and management has already said out loud that AI is a revenue multiplier, not just a cost lever.",
    snapshot: [
      { label: "Subscription merchants", value: "1.51 crore paying merchants including devices, up 22% YoY (Q4 FY26)", kind: "fact" },
      { label: "Q1 FY27 revenue", value: "₹2,448 Cr, up 28% YoY, with record EBITDA of ₹203 Cr", kind: "fact" },
      { label: "Merchant GMV", value: "₹7.1 lakh crore in Q1 FY27, up 31% YoY", kind: "fact" },
      { label: "Financial services distribution", value: "₹2,594 Cr in FY26, up 52%; over half of merchant loans to repeat borrowers", kind: "fact" },
      { label: "Monthly transacting users", value: "About 80 million, up from 74 million a year earlier", kind: "fact" },
    ],
    whyItMatters:
      "Paytm's P&L is unusual in Indian fintech: a large slice of it is a subscription billed per device per month, which means revenue quality is a function of whether a Soundbox in a shop in Bareilly is working today and whether its owner believes the settlement that landed in his account is correct. Those two questions — my device is silent, my money is short — are the two conversations that decide churn, and both are today handled by a mix of call queues and field executives walking streets where rival banks and fintechs are pitching cheaper subscriptions door to door. On the other side of the business, Paytm distributes credit it does not underwrite, so the entire value of that line sits in conversations that RBI's Digital Lending Directions tightly constrain: when you may call, how you must identify yourself, what you may say, and who you may never discuss the debt with. Management has built a proprietary Indic-language model and is already using it for acquisition, collections and retention. The gap is not language — it is action. Today the model talks; it does not re-provision a SIM, credit a subscription day, reconstruct a settlement batch, or re-present a mandate.",
    context: [
      {
        text: "Q1 FY27 operating revenue rose 28% YoY to ₹2,448 Cr with record EBITDA of ₹203 Cr (up 182%) and PAT of ₹220 Cr, following FY26 — the company's first full year of profit — where revenue grew 22% to ₹8,437 Cr.",
        kind: "fact",
        source: 0,
      },
      {
        text: "Subscription merchants including devices reached 1.51 crore in Q4 FY26, up 22% YoY with 27 lakh net additions, while standalone subscription revenue per device has seen a modest YoY decline. Growth is coming from device count, not from price.",
        kind: "fact",
        source: 1,
      },
      {
        text: "Financial services is distribution-only: loans sit on partner balance sheets, the largest lending partner shifted from DLG to non-DLG disbursals, and more than half of merchant loan disbursements now go to repeat borrowers. Distribution revenue grew 52% in FY26 to ₹2,594 Cr.",
        kind: "fact",
        source: 1,
      },
      {
        text: "Management has described Paytm as an AI-first organisation, citing a proprietary roughly 4-billion-parameter Indian-language model used for merchant acquisition, collections and retention with plans to commercialise it externally, and has attributed part of its employee-cost reduction to AI-driven productivity.",
        kind: "fact",
        source: 3,
      },
      {
        text: "The merchant base is actively contested on the street: banks and rival fintechs deploy field agents to pitch cheaper subscriptions and switch merchants, while Paytm's own executives work the same streets to retain them. Retention is a doorstep fight, not a pricing page.",
        kind: "fact",
        source: 4,
      },
      {
        text: "RBI's Digital Lending Directions (issued May 2025) and recovery-agent norms bound any collections contact: outreach only between 8am and 7pm, mandatory self-identification and disclosure of the lender being represented, no discussion of the debt with family, employers or third parties, and full recording. Draft Responsible Business Conduct provisions extend this further from July 2026. An autonomous collections agent is therefore a compliance artefact first and a conversation second.",
        kind: "fact",
        source: 2,
      },
    ],
    sources: [
      {
        label: "Paytm Investor Relations — Q1 FY2027 earnings release",
        url: "https://paytm.com/document/ir/financial-results/fy2026-27/Paytm_Earning-Release_Q1-FY-2027_INR.pdf",
      },
      {
        label: "Paytm — Q4 FY2026 earnings release",
        url: "https://www.medianama.com/wp-content/uploads/2026/05/Paytm_Earnings-Release_Q4_FY-2026_Final.pdf",
      },
      {
        label: "Paytm blog — Q4 FY26 earnings call: AI-led growth, payments momentum and profitability",
        url: "https://paytm.com/blog/investor-relations/key-takeaways-from-our-q4fy26-earnings-call/",
      },
      {
        label: "MediaNama — Key takeaways from Paytm's Q1 FY27 earnings call",
        url: "https://www.medianama.com/2026/07/223-wallet-licence-paytm-q1-fy27-earnings/",
      },
      {
        label: "Inc42 — Banks and fintechs battle for Paytm's merchant base with cheaper subscriptions",
        url: "https://inc42.com/buzz/paytm-crisis-chaos-on-streets-as-banks-fintechs-lure-merchants-with-cheaper-subscriptions/",
      },
    ],
    useCases: [
      {
        id: "paytm-silent-device-selfheal",
        rank: 1,
        name: "Silent-Soundbox agent — detect the dead device, fix it on the call, credit the downtime",
        audience: "merchant",
        lifecycle: "retain",
        econ: "both",
        current:
          "A subscribed Soundbox stops announcing payments. The cause is usually mundane — SIM data lapsed, battery flat, unplugged during a power cut, speaker fault, or the merchant quietly started using a rival's device. Today the platform finds out when the merchant calls to dispute the monthly subscription, or when a field executive happens to visit, or when the subscription simply lapses. In the meantime the merchant is telling customers to pay some other way, which is the moment a competitor's field agent is most likely to win the shop.",
        agentic:
          "The agent watches each device against that merchant's own announcement pattern rather than a global threshold, so a Tuesday-quiet tailor and a genuinely dead device are not confused. When a real gap appears it calls the merchant in their language, runs guided diagnostics conversationally — is the light on, does it charge, do you hear a beep on a test payment it triggers itself — and takes the remedy: re-provision the SIM over the air, push a firmware update, re-pair the device to the correct merchant ID, or replace it. It credits the subscription for the downtime days without the merchant having to argue for it, and dispatches a field executive with the diagnosis already attached only when remote remedies are exhausted, booking a slot the merchant confirms. If the diagnosis is that the merchant is now using another device, it routes to a retention offer rather than a repair.",
        trigger:
          "Device announcement or heartbeat gap against the merchant's own baseline, a failed OTA check-in, or a subscription-debit dispute raised by the merchant.",
        systems: [
          "Device telemetry and fleet management",
          "SIM / connectivity provisioning",
          "Subscription billing and credits",
          "Field service dispatch and inventory",
          "Merchant CRM and retention offers",
        ],
        channels: ["Voice (regional languages)", "WhatsApp", "Merchant app", "IVR callback"],
        outcomes: [
          "Device downtime days per thousand active devices",
          "Subscription churn and involuntary lapse rate",
          "Truck rolls avoided per fault resolved",
        ],
        whyThisCompany:
          "No other company here bills one and a half crore individual devices every month. A silent device is not a support ticket — it is a subscription that will be disputed, a merchant who has stopped defaulting to Paytm at the counter, and an open door for the bank rep who is already on that street. Because growth is coming from device count while revenue per device drifts down, protecting the installed base is worth more than any single acquisition campaign, and it is a workflow no consumer-first competitor has the fleet telemetry to copy.",
        scores: { economic: 5, volume: 5, suitability: 5, ease: 3, differentiation: 5 },
      },
      {
        id: "paytm-settlement-shortfall",
        rank: 2,
        name: "Settlement-shortfall agent — reconstruct the batch, line by line, in the merchant's language",
        audience: "merchant",
        lifecycle: "service",
        econ: "cost",
        current:
          "A merchant compares the day's sales on the Soundbox to the amount in the bank account and finds a gap. The gap is almost always explainable — a cycle cut-off, MDR on card and wallet legs, the monthly device subscription, a loan EMI recovered from settlement, a hold against a disputed transaction, or a bank-side delay — but no single screen assembles that explanation, and small merchants do not read settlement reports. So they call, escalate, and conclude they are being shortchanged. Trust, once lost on this question, is what makes the competitor's pitch land.",
        agentic:
          "The agent reconstructs the specific settlement batch the merchant is asking about and narrates it as arithmetic the merchant can check against their own till: this many transactions cleared in this cycle, these moved to tomorrow's, this much is subscription, this much is the EMI the lender recovered, this much is held against a chargeback and returns on this date. It answers follow-ups on the merchant's own numbers rather than reading policy. Where the reconciliation genuinely does not balance, it raises the recon case, tracks it to credit, and comes back to the merchant with the outcome unprompted rather than leaving them to chase.",
        trigger:
          "Merchant query about a settlement amount, or a proactive signal where settlement to a merchant deviates materially from their own expected pattern — including EMI or hold deductions applied for the first time.",
        systems: [
          "Settlement and reconciliation ledger",
          "MDR and fee engine",
          "Subscription billing",
          "Lending partner EMI recovery records",
          "Dispute holds and chargeback ledger",
        ],
        channels: ["WhatsApp", "Voice (regional languages)", "Merchant app"],
        outcomes: [
          "Settlement queries per thousand merchants",
          "Repeat-contact rate on the same settlement question",
          "Churn among merchants who raised a settlement dispute",
        ],
        whyThisCompany:
          "Paytm deducts more from a merchant's settlement than a pure payments competitor does — device subscription and, for merchant borrowers, the partner lender's EMI both come out of the same flow. That makes the settlement line genuinely harder to read here than anywhere else, and it makes the explanation a retention asset rather than a support script. The constraint is that resolving a genuine shortfall means issuing a credit against the ledger, which is a real write into money movement and keeps ease low.",
        scores: { economic: 4, volume: 5, suitability: 4, ease: 2, differentiation: 3 },
      },
      {
        id: "paytm-merchant-loan-prebounce",
        rank: 3,
        name: "Pre-bounce repayment agent for distributed merchant loans, inside RBI recovery norms",
        audience: "merchant",
        lifecycle: "collect",
        econ: "both",
        current:
          "A merchant borrower's EMI is recovered from daily settlement or an auto-debit mandate. When receipts dip — a slow week, a festival lull, a shop shut for a family event — the debit bounces, bounce charges apply, the account slips a bucket, and a tele-calling queue picks it up days later. By then the conversation is adversarial and the merchant has often already stopped routing payments through Paytm to avoid the recovery. A good repeat borrower gets lost over a cash-flow timing problem.",
        agentic:
          "The agent watches settlement inflow against the upcoming EMI and intervenes before the debit is presented, not after it fails. It contacts the merchant strictly inside the 8am-to-7pm window, identifies itself at the start of the call as an agent acting for Paytm on behalf of the named lender, states the amount and date, and offers only the options the lender has pre-approved — part payment, a date shift within policy, or splitting recovery across the next few days of settlement. It executes the chosen option across the mandate and settlement systems and confirms in writing. It never discusses the loan with anyone other than the borrower or guarantor, never threatens or implies consequence beyond the documented terms, records the full interaction, and hands to a human immediately on any hardship, dispute or distress cue.",
        trigger:
          "Projected settlement inflow falling short of a scheduled EMI inside the pre-debit window, or a first bounce on a borrower with a clean prior history.",
        systems: [
          "Merchant settlement forecasting",
          "Lending partner loan management systems",
          "Mandate / auto-debit orchestration",
          "Consent, calling-window and recording compliance layer",
          "Human collections escalation queue",
        ],
        channels: ["Voice (regional languages, recorded)", "WhatsApp", "Merchant app"],
        outcomes: [
          "First-bounce rate on merchant loan EMIs",
          "Repeat-borrower retention and re-disbursal rate",
          "Recovery cost per account touched",
        ],
        whyThisCompany:
          "Paytm's lending economics depend on repeat borrowers — more than half of merchant loan disbursements now go to them — so the objective is not to chase defaulters but to stop a good borrower from bouncing at all. Paytm is uniquely able to do this because it sees the merchant's daily receipts before the lender sees the failed debit. It is also the hardest thing on this list to deploy: RBI's Digital Lending Directions and recovery-agent norms constrain timing, identification, disclosure, third-party contact and recording, the lender of record must approve every option the agent may offer, and accountability for agent conduct sits with the regulated entity. Ease is a 1 for good reason.",
        scores: { economic: 4, volume: 3, suitability: 3, ease: 1, differentiation: 4 },
      },
      {
        id: "paytm-device-tier-upgrade",
        rank: 4,
        name: "Device-tier upgrade agent — sell the card machine the merchant's own data says they need",
        audience: "merchant",
        lifecycle: "upsell",
        econ: "revenue",
        current:
          "Moving a merchant up the device stack — basic Soundbox to card-accepting Soundbox to a full card machine — is done by field sales on route plans and quotas, so the pitch reaches whoever is on the route this month rather than whoever is ready. The strongest buying signals sit unread in the data: repeated high-ticket attempts that fail on UPI limits, customers walking out, a rising share of transactions at a size where cards matter. Meanwhile a rival agent is standing in the shop quoting a cheaper monthly rental.",
        agentic:
          "The agent detects the signal in the merchant's own transaction mix and opens the conversation with it — you turned away this many payments above the UPI limit last month, here is what that was worth. It quantifies the upgrade in the merchant's own rupees rather than in feature lists, handles the price objection against the specific competing offer the merchant names, completes the paperless upgrade including the revised subscription mandate and any KYC delta, schedules delivery and installation, and calls back after the first week to confirm the device is actually being used rather than sitting in a drawer.",
        trigger:
          "Transaction-mix signal indicating unmet card or high-ticket demand, a competitor-switch risk flag, or the end of an existing device commitment period.",
        systems: [
          "Merchant transaction analytics",
          "Device catalogue, pricing and inventory",
          "Subscription mandate management",
          "KYC delta checks",
          "Fulfilment and installation scheduling",
        ],
        channels: ["Voice (regional languages)", "WhatsApp", "Merchant app"],
        outcomes: [
          "Upgrade conversion rate on signalled merchants",
          "Subscription revenue per device",
          "Post-upgrade activation within 7 days",
        ],
        whyThisCompany:
          "Subscription revenue per device has drifted down even as device count grows, so mix is the lever the market will price. Paytm is one of very few players that can see, per merchant, the demand its current device is failing to capture — and it is fighting for exactly those merchants against door-to-door discounting. This is a revenue-generating agent, not a cost-saving one, which is precisely the framing management has taken publicly on AI.",
        scores: { economic: 4, volume: 3, suitability: 4, ease: 3, differentiation: 4 },
      },
      {
        id: "paytm-mandate-failure-rescue",
        rank: 5,
        name: "Recurring-mandate rescue agent — fix the auto-debit before the retry burns the customer",
        audience: "customer",
        lifecycle: "transact",
        econ: "both",
        current:
          "Recurring UPI Autopay and e-mandate debits fail for boring reasons: insufficient balance on the debit date, an expired instrument, a revoked or paused mandate, or a bank-side decline. The customer usually learns about it from a bounce charge or, on a credit product, from a bureau consequence weeks later. The platform retries mechanically and, if it fails again, the subscription, EMI or premium simply stops — taking the distribution fee with it.",
        agentic:
          "Ahead of the debit date the agent identifies mandates likely to fail and contacts the customer with the specific consequence in plain terms — this EMI will bounce on Thursday, the charge is this, and it will show on your credit record. It then fixes the actual cause: prompting a top-up while holding the retry, re-authorising an expired or paused mandate, switching the mandate to a funded account, or scheduling the re-presentment to a date the customer confirms works. Where the product is distributed credit, it stays inside what the lender permits, states clearly which lender the mandate belongs to, and hands off rather than negotiating terms it cannot set.",
        trigger:
          "Predicted or actual mandate debit failure inside the retry window, or a mandate approaching expiry or revocation.",
        systems: [
          "Mandate and UPI Autopay registry",
          "Balance and instrument status signals",
          "Retry / re-presentment scheduler",
          "Partner lender and biller APIs",
          "Consent and notification log",
        ],
        channels: ["Push and SMS", "WhatsApp", "In-app", "Voice"],
        outcomes: [
          "Mandate success rate on first re-presentment",
          "Bounce charges incurred per thousand active mandates",
          "Retention of recurring credit and subscription relationships",
        ],
        whyThisCompany:
          "Paytm sits on both sides of this: it hosts the mandate as a payments platform and earns the distribution fee on the underlying credit or subscription, so it can see the failure coming and knows exactly what the consequence is worth. That said, this is the workflow every payments platform and lender in the country will automate over the next two years — the advantage is timing and execution quality, not defensibility, which is why differentiation is scored low.",
        scores: { economic: 3, volume: 4, suitability: 4, ease: 2, differentiation: 2 },
      },
    ],
    openers: [
      "You bill one and a half crore devices every month. Every hour a Soundbox is silent is a subscription you will end up arguing about and an opening line for the bank rep standing in that shop. We think most of those faults can be diagnosed and fixed on a phone call in the merchant's language, not with a truck roll.",
      "Your merchants do not really dispute your MDR — they dispute the number that landed in their bank account. You deduct more from settlement than anyone else does, because the device subscription and the lender's EMI both come out of it. An agent that can reconstruct that batch line by line, in Bhojpuri, removes the single most common reason a merchant switches.",
      "You have already built a four-billion-parameter Indic model and pointed it at acquisition, collections and retention. The gap is action: today it talks. It does not re-provision a SIM, credit a downtime day, or move an EMI date inside what the lender has approved.",
    ],
    discovery: [
      "Across the device estate, how many merchant-initiated contacts a month are about a silent device or a settlement amount — and what does the mix look like between call centre, field visit and quiet churn you only see in the billing file?",
      "When a device fault is diagnosed remotely today, what can the system actually do on its own — re-provision connectivity, push firmware, issue a subscription credit — versus what needs a person or a field visit?",
      "On distributed lending, what has the lender of record pre-approved an outbound agent to offer a merchant before an EMI bounces, and what would it take to widen that envelope inside the RBI recovery norms?",
    ],
    pilot: {
      workflow:
        "Silent-device detection and remote self-heal across one region's Soundbox estate: baseline-aware fault detection, outbound diagnostic call in local languages, over-the-air SIM and firmware remediation, automatic downtime credit, and diagnosed dispatch only where remote fixes fail.",
      weeks: "8 weeks",
      why: "The signal is already in fleet telemetry, the fix is mostly remote, and the economics are directly attributable — downtime days, truck rolls avoided, and subscription churn against a matched control region. It also proves the harder capability the rest of the roadmap needs: an agent that reasons over a merchant's own history, holds a conversation in the merchant's language, and completes an action across billing and provisioning systems rather than logging a ticket.",
    },
  },
];
