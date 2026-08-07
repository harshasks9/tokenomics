import type { Archetype, Insight } from "../schema";

// Cross-company synthesis. Five products that can be built once and sold into
// several of these ten accounts, chosen at the intersection of market size,
// economic value, agentic suitability and repeatability — not by frequency.
// Every archetype is traceable to ranked use cases in at least three companies.

export const ARCHETYPES: Archetype[] = [
  {
    id: "failure-interception",
    name: "Failure Interception",
    color: "#1A73E8",
    promise:
      "The moment a transaction breaks, the agent repairs it and tells the customer what it did — before the customer discovers there was a problem.",
    trigger:
      "An operating signal says a committed transaction cannot complete as promised: an unfillable line in a picked basket, a debit with no matching credit, an airline schedule change against a live PNR, a device that has stopped announcing payments, a margin shortfall against a square-off deadline.",
    workflow: [
      "Detect the break from the operating signal rather than from an inbound complaint.",
      "Reconstruct what actually failed and which leg is still recoverable, reading the order, the ledger and the counterparty status.",
      "Reason over this specific person's history, value and tolerance to rank two or three remedies that would genuinely work for them.",
      "Reach them in their own language with a decision to make, not a status code, inside the window where a choice still exists.",
      "Execute the chosen remedy in the system of record — substitute, reissue, re-provision, cure, hold or credit — and reset the promise.",
      "Chase the counterparty to closure and come back unprompted when the money or the confirmation lands.",
    ],
    channels: ["Outbound voice", "WhatsApp", "In-app chat", "Push", "SMS"],
    systems: [
      "Order and transaction management",
      "Inventory or supplier inventory APIs",
      "Payments, refunds and credits ledger",
      "Dispute and chargeback rails",
      "Policy and entitlement library",
      "Case management",
    ],
    kpis: [
      "Failures resolved before the customer makes contact",
      "Time from break to confirmed alternative",
      "Credit and goodwill cost per thousand transactions",
      "Retention of customers who hit a failure",
    ],
    econ: "both",
    cx: "Kavita has eight people arriving at nine and a Blinkit basket that includes paneer the picker cannot find. At 7:41 her phone offers the same brand in a 400g pack from the store two kilometres further out, four minutes later than promised, with the difference already credited. She taps yes, and the evening never becomes a problem.",
    whyNow:
      "The hard part was never the message, it was the judgement in the twenty seconds before it. A model can now hold a live inventory read, a carrier reaccommodation policy, a customer's substitution history and a refund rule in one context and choose an action — then call the systems that execute it. Two things made that deployable rather than demonstrable: reliable tool use across systems that were never designed to be orchestrated together, and evaluation harnesses that let a risk team grade the agent's decisions against outcomes before granting it write access.",
    applies: {
      eternal: "strong",
      swiggy: "medium",
      phonepe: "strong",
      paytm: "strong",
      meesho: "strong",
      nykaa: "low",
      makemytrip: "strong",
      rapido: "medium",
      groww: "medium",
      "urban-company": "medium",
    },
  },
  {
    id: "earnings-adjudication",
    name: "Earnings Adjudication",
    color: "#188038",
    promise:
      "When a merchant, seller or partner believes they have been short-paid, the agent reconstructs the money line by line in their language and corrects it on the call.",
    trigger:
      "An earnings, settlement or payout dispute is raised on any channel — or the platform detects a payout that falls outside that person's own recent range, including the first time a deduction, penalty or EMI recovery is applied.",
    workflow: [
      "Pick up the dispute, or detect the anomalous payout before the person notices it.",
      "Reconstruct the disputed period line by line: orders completed, fees, commissions, deductions, penalties, incentive tiers, clawbacks, holds.",
      "Explain the delta as arithmetic they can check against their own till or ledger, in their language, not as a policy statement.",
      "Where the platform is wrong, issue the correction inside a hard authority ceiling and confirm the revised amount and the date it lands.",
      "Where they are wrong but close, state precisely what would have qualified them, turning a grievance into a behaviour instruction.",
      "Escalate above the ceiling, on any systemic pattern, or on any sign of hardship — with the full reconstruction already attached.",
    ],
    channels: ["Outbound and inbound voice", "WhatsApp", "Partner or merchant app"],
    systems: [
      "Settlement and payout ledger",
      "Commission, fee and subscription billing",
      "Incentive and penalty engines",
      "Lending EMI recovery records",
      "Credit note and claims workflow",
      "Human escalation queue",
    ],
    kpis: [
      "Disputes closed without a human touch",
      "Repeat contacts on the same dispute",
      "Corrections found proactively versus raised",
      "Churn among those who raised a dispute",
    ],
    econ: "cost",
    cx: "Suresh has paid his daily fee, worked eleven hours, and Thursday came out ₹340 short of what he counted. The voice on the line walks him through the day ride by ride in Kannada, finds an incentive tier he actually qualified for, and credits ₹280 while he is still parked outside the metro station. He does not spend the evening on a driver group deciding the platform cheats him.",
    whyNow:
      "This has always been a reasoning task over structured records, and models are now dependable at that: reading a settlement batch and narrating it as arithmetic rather than reciting a policy line. What changed is the delivery. Speech recognition and synthesis in Indian languages crossed the point where a merchant in Bareilly or a captain in Hubballi will stay on the call and follow the numbers, and function calling into a payout ledger under a hard authority ceiling turns the explanation into a correction. Full-call recording and structured logs are what make finance willing to grant that ceiling at all.",
    applies: {
      eternal: "low",
      swiggy: "strong",
      phonepe: "medium",
      paytm: "strong",
      meesho: "strong",
      nykaa: "medium",
      makemytrip: "low",
      rapido: "strong",
      groww: "medium",
      "urban-company": "strong",
    },
  },
  {
    id: "first-transaction-activation",
    name: "First-Transaction Activation",
    color: "#D97706",
    promise:
      "Takes every paid-for signup that stalled short of its first productive transaction, finds the one thing actually blocking it, and finishes the job.",
    trigger:
      "A funnel stall: a rejected document, an abandoned training module, a failed bank or KYC verification, a live account with no first transaction, or a first transaction with no repeat.",
    workflow: [
      "Watch the funnel per person rather than per cohort, and fire on the stall rather than on a drip schedule.",
      "Read the actual machine reason for the stall — the KRA rejection code, the penny-drop failure, the unmounted QR — not the generic pending status.",
      "Call in their language and fix that specific artefact: re-shoot the document, verify it is legible and unexpired before resubmitting, re-trigger the verification.",
      "Complete the compliance step properly — training with a comprehension check, KYC evidence, vehicle or category eligibility under the rules in force in that state.",
      "Stay through the first transaction and explain honestly what they will earn or pay.",
      "Hand to a field or compliance human only where a physical visit or a genuine document inconsistency is the remaining blocker, and book the slot.",
    ],
    channels: ["Outbound voice", "WhatsApp", "Multimodal document capture", "Partner or merchant app", "IVR"],
    systems: [
      "Onboarding and KYC pipeline",
      "Document verification and OCR",
      "Training and certification records",
      "Bank and settlement account verification",
      "Eligibility and permit rules by geography",
      "Field sales CRM and territory routing",
    ],
    kpis: [
      "Signup to first-transaction conversion",
      "Median days from signup to first transaction",
      "Cost per activated partner or merchant",
      "Field visits avoided per activation",
    ],
    econ: "revenue",
    cx: "Imran uploaded his licence and RC four days ago and the app still says pending. On the fifth morning his phone rings, a voice in Bhojpuri tells him the expiry date is cut off the corner of the photo, waits while he retakes it, checks it is readable, and books him onto tomorrow's training slot. He takes his first fare on Thursday instead of never.",
    whyNow:
      "Acquisition at this scale has always outrun the ability to call anyone back. Two capabilities close that gap. Speech that works in the languages of tier-2 and tier-3 India makes an outbound call something the person will actually complete rather than abandon. Document understanding lets the agent check a photograph is legible, correctly cropped and unexpired before it is submitted — turning the rejection loop that kills these funnels into a single guided attempt. Neither existed as a reliable API two years ago.",
    applies: {
      eternal: "medium",
      swiggy: "medium",
      phonepe: "strong",
      paytm: "medium",
      meesho: "strong",
      nykaa: "low",
      makemytrip: "low",
      rapido: "strong",
      groww: "strong",
      "urban-company": "strong",
    },
  },
  {
    id: "visual-diagnosis",
    name: "Visual Diagnosis",
    color: "#7C3AED",
    promise:
      "The customer or seller shows the agent the actual problem, and the agent commits to an answer — a bound price, a named regimen, an attributed cause — before anyone travels or ships.",
    trigger:
      "A photograph or short video arrives: a leaking fitting, an appliance making a new noise, bare skin in daylight, forty saris on a bedroom floor, a returned parcel, a batch code on a bottle.",
    workflow: [
      "Take the image the person already has on their phone, in the channel they already use.",
      "Classify what is in it — fault class and asset, undertone and concern, the item received against the listing it was sold as.",
      "Ask the two or three disambiguating questions a trained dispatcher or advisor would ask before committing to anything.",
      "Reason over catalogue, pricing, skill certification and live stock to produce a firm, bound answer rather than a range.",
      "Execute it: book the certified professional in a slot long enough for the real job, place the basket, correct the listing, approve the rework.",
      "Say plainly when the image is not enough, and route to a paid inspection, a store advisor or a human instead of guessing.",
    ],
    channels: ["Multimodal photo and video capture", "WhatsApp", "In-app", "Voice follow-up"],
    systems: [
      "Vision classification for fault, asset and attribute",
      "Catalogue, pricing and taxonomy",
      "Skill certification and availability graph",
      "Inventory and parts availability",
      "Purchase, return and loyalty history",
      "Booking, checkout and dispatch",
    ],
    kpis: [
      "Jobs completed at quoted scope and price",
      "Basket size and consultation-to-purchase conversion",
      "Return and rework rate attributable to description error",
      "Wasted travel hours per hundred jobs",
    ],
    econ: "both",
    cx: "Meera films thirty seconds of her air conditioner making a noise it did not make last summer. Before anyone leaves a depot she has a fixed price, a written scope with the exclusions spelled out, and a slot with a technician who arrives carrying the right gas and a spare capacitor — rather than a stranger at her door explaining why the job now costs more than she booked.",
    whyNow:
      "This is the archetype that simply did not exist. Reading undertone from a daylight photograph, identifying an appliance generation and fault class from a shaky video, or comparing a received garment against its catalogue imagery used to mean a bespoke vision model per category, trained on labelled data nobody had. General multimodal models now do it zero-shot, well enough to bound a price and book a certified skill against it — and, critically, they can also say the image is inconclusive, which is what makes committing to a quote commercially safe.",
    applies: {
      eternal: "low",
      swiggy: "low",
      phonepe: "medium",
      paytm: "low",
      meesho: "strong",
      nykaa: "strong",
      makemytrip: "low",
      rapido: "medium",
      groww: "medium",
      "urban-company": "strong",
    },
  },
  {
    id: "lapse-rescue",
    name: "Lapse Rescue",
    color: "#C2185B",
    promise:
      "Works out why a recurring relationship stopped paying off for this particular person, fixes that one thing inside a margin budget, and completes it — instead of firing a discount at everyone.",
    trigger:
      "A renewal window opening, a modelled depletion date passing, a failed or expiring mandate, points about to lapse, or an order cadence that has drifted below what this account's own demand signal predicts.",
    workflow: [
      "Compute whether the relationship is still working for them: realised saving against fee, depletion against last purchase, mandate health against the next debit.",
      "Diagnose why it stopped paying off — wrong vertical mix, a service failure that killed the habit, an expired instrument, a product that did not deliver.",
      "Pick the single intervention most likely to restore value for that person, sized inside a margin budget rather than a blanket offer.",
      "Open the conversation with their own numbers, and handle the actual objection rather than restating the benefit.",
      "Execute in the system of record: switch tier, re-register the mandate, apply expiring points, place the reorder, complete the renewal.",
      "Log the reason and stop when the answer is genuinely no, so the next contact is not a repeat.",
    ],
    channels: ["WhatsApp", "Outbound voice", "In-app", "Email", "Push"],
    systems: [
      "Subscription, membership and policy administration",
      "Mandate and autopay rails",
      "Purchase, consumption and cross-vertical history",
      "Loyalty ledger and tier engine",
      "Offer and margin budgeting engine",
      "Payments and credits",
    ],
    kpis: [
      "Renewal and reinstatement rate on at-risk cohorts",
      "Discount cost per relationship saved",
      "Recurring value retained per cohort",
      "Share of members active in two or more services",
    ],
    econ: "revenue",
    cx: "Anil's ₹2,000 SIP failed on the 5th because his salary now lands on the 7th, and the app told him only that the instalment could not be processed. That evening a call in Marathi asks whether the 8th would suit him better, moves the debit inside the permitted window, and confirms when it goes through. The habit he took two years to build does not quietly end over a date.",
    whyNow:
      "Retention has been a segmentation exercise because nobody could afford to reason about one person at a time. A model can now read a sparse, messy behavioural history — four verticals, an eighteen-month gap, one bad delivery, a fee against a realised saving — and pick the single intervention that would change this person's mind, then argue for it and execute it in a billing or mandate system. The commercial unlock is not the conversation, it is that the agent spends a budget it can be held to, and the counterfactual is measurable against a holdout on the same renewal date.",
    applies: {
      eternal: "strong",
      swiggy: "strong",
      phonepe: "strong",
      paytm: "medium",
      meesho: "low",
      nykaa: "strong",
      makemytrip: "medium",
      rapido: "low",
      groww: "strong",
      "urban-company": "low",
    },
  },
];

export const INSIGHTS: Insight[] = [
  {
    stat: "25 of 50",
    label: "Half the value is not the customer",
    detail:
      "Fourteen of the fifty use cases serve merchants and sellers, eight serve delivery and service partners, three serve internal teams — the supply side is where the unattended margin sits, and where nobody is calling.",
  },
  {
    stat: "38 of 50",
    label: "Revenue, not deflection",
    detail:
      "Eighteen create revenue outright and twenty do both; only twelve are pure cost reduction, which is precisely the half of the market already crowded with support automation these companies have built themselves.",
  },
  {
    stat: "45 of 50",
    label: "Spoken Indian languages, not chat",
    detail:
      "Voice is a required channel in forty-five of the fifty, because the merchant, the captain and the first-time buyer on the other end of these workflows will not read an English help article.",
  },
  {
    stat: "10 of 10",
    label: "Permission is the constraint, not capability",
    detail:
      "Every use case scoring maximum on agentic suitability scores three or below on ease of deployment — the blocker is write access to money, inventory and regulated records, not model quality.",
  },
];
