// Deep analysis blocks for the Indonesia / Philippines / Vietnam qualified
// profiles, second half of the array (index 50 to end). Same evidence
// discipline as deep pitches: no fabricated financials, quotes, dates or URLs;
// strategic pressure is confidence-labeled.

import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_ID_PH_VN_B: Record<string, ProfileAnalysis> = {
  "pru-life-uk": {
    operatingContext:
      "Pru Life UK is Prudential plc's Philippine life insurance subsidiary, distributing protection, health riders and variable unit-linked products almost entirely through a very large, geographically dispersed tied agency force rather than through branches. Its customers are mass-affluent and emerging-middle-class Filipino families, plus a meaningful overseas Filipino worker segment who buy policies for dependents at home and service them from Dubai, Hong Kong or Riyadh. Day-to-day contact runs through the agent first, a Manila-based customer hotline second, and a self-service portal and app third, which means the company effectively operates two service desks: one for policyholders and one for its own agents chasing commissions, licensing and submission status. Because the agency is the distribution moat, agent responsiveness is a commercial variable, not just a support cost.",
    strategicPressure: [
      { text: "Pru Life UK is a country unit of Prudential plc, whose Asia strategy is built around agency productivity and health-and-protection growth rather than country-level platform engineering.", kind: "verified" },
      { text: "The Philippine life market is a two-horse fight at the top with Sun Life, so persistency and claims experience are competitive differentiators rather than back-office metrics.", kind: "inference" },
      { text: "A very large agency force generates a support load that scales linearly with recruitment, so every productivity push adds hotline cost unless agent queries are automated.", kind: "inference" },
      { text: "OFW policyholders paying from abroad create out-of-hours servicing demand that a Manila business-hours hotline structurally cannot cover.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The Philippine entity is a distribution and underwriting business operating under Prudential group technology governance; its engineering headcount is oriented to integration and channel enablement, not to building speech, dialogue and evaluation infrastructure. Historic pattern for Prudential country units is to adopt group-selected or group-approved platforms and localize them.",
    whyNotBuild:
      "Building this stack means owning Tagalog and Taglish speech recognition with insurance vocabulary, telephony carrier integration, policy-system orchestration, and an evaluation regime that satisfies Insurance Commission conduct expectations. No Philippine life insurer has that team, and Prudential group would not fund a country-level build of a capability it expects to source regionally. The right to win is a governed, auditable conversation layer that plugs into the policy admin system and produces a complete transcript-and-decision record for every interaction.",
    workflows: [
      {
        name: "Claims intake and proactive status",
        friction: "Claimants and beneficiaries phone the hotline repeatedly for status because the only status signal is a human reading the same screen; documents bounce on format and the claimant learns days later.",
        outcome: "Structured FNOL with in-conversation document capture and pushed status at every stage, collapsing status-call volume and shortening cycle time.",
        channels: ["Voice", "WhatsApp", "Viber", "Web chat"],
        systems: ["Policy administration", "Claims management", "Document management", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Agent support desk",
        friction: "Agents call or message the head-office support line for submission status, commission queries and licensing renewals; peak volumes land at month-end and campaign close, exactly when agents should be selling.",
        outcome: "Agents self-serve submission, commission and licensing answers in Tagalog or English at any hour, with only exceptions reaching a human.",
        channels: ["Voice", "Viber", "Agent portal chat"],
        systems: ["Agency management system", "Commission engine", "Licensing records", "New business pipeline"],
        value: 2, complexity: 2,
      },
      {
        name: "Premium persistency outreach",
        friction: "Lapse-risk policies get a generic SMS blast and, for the larger cases, a call from whoever has capacity; the actual reason for non-payment is never captured.",
        outcome: "Two-way, policy-aware conversations before the grace period ends, with in-channel payment and the lapse reason recorded for underwriting and agency feedback.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration", "Billing and collections", "Payment gateway", "CRM"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A policyholder self-service portal and mobile app for statements, fund values and basic policy details",
        "A Manila-based customer hotline handling policy servicing and claims queries",
        "An agent portal for submission tracking, commission statements and product material",
        "Email and social-messaging service channels used heavily by younger policyholders",
      ],
      gaps: [
        "Claimants cannot complete a claim end-to-end conversationally, including document submission and validation",
        "Beneficiaries with no digital account have no authenticated self-service path at all",
        "Agents cannot get a definitive commission or licensing answer outside office hours",
        "OFW policyholders in Gulf and East Asian time zones have no live channel in their waking hours",
      ],
    },
    risks: [
      "Insurance Commission conduct expectations on how policy and claims information is communicated, including suitability and disclosure requirements that must bound anything an agent says",
      "The Philippine Data Privacy Act and NPC registration obligations covering health and financial data used in claims conversations, including consent for recording and cross-border processing",
      "Tagalog-English code-switching with insurance terminology is a genuine speech-quality risk and must be benchmarked on real recorded calls before any production claim",
    ],
    economics: {
      volumeMonthly: 320000,
      costPerInteraction: 1.3,
      automationRate: 0.5,
      basis: "Seller assumptions for a large Philippine life insurer combining policyholder servicing and agent support; validate actual contact volumes, blended cost per contact and the policyholder-versus-agent split in discovery.",
    },
    pilotScope:
      "Automate claims intake and proactive claim-status conversations on voice and Viber for one product family, with document capture in-channel and adjuster decisions remaining human.",
    expansion: [
      "Add the agent support desk covering submission status, commission and licensing queries",
      "Add persistency and premium-reminder outreach with in-channel payment",
      "Extend to OFW-hour coverage and to bancassurance-sourced policyholders across all products",
    ],
    stakeholders: [
      "Chief Customer Officer",
      "Head of Claims",
      "Chief Agency Officer",
      "Chief Information Officer",
      "Data Protection Officer",
    ],
    discovery: [
      "What share of your claims-related contacts are pure status checks rather than new information?",
      "How many inbound contacts come from agents rather than policyholders, and who funds that desk?",
      "What does a lapse cost you in first-year commission clawback, and how many lapses get a real conversation today?",
      "Which policy and claims actions can be executed by an authenticated non-human channel under your current Insurance Commission interpretation?",
    ],
    flowTemplate: "claims",
    scenario: "A beneficiary in Cebu files a death claim on Viber at 9pm, uploads the documents in-chat, and gets pushed status at every stage instead of calling the hotline weekly.",
  },

  "axa-philippines": {
    operatingContext:
      "AXA Philippines is a joint venture between AXA and GT Capital that sells life, health and general insurance, with bancassurance through the Metrobank branch network as its distribution backbone alongside a tied agency. The general insurance side adds motor and property cover, which is a fundamentally different servicing rhythm from life: high-frequency, event-driven, and emotionally charged at the moment of loss. Customers reach it through a call centre, a policyholder app and portal, branch bancassurance staff, and increasingly messaging channels, while motor claims pull in a third population of repair shops and surveyors. The result is a contact mix where a minority of policies generate a majority of the conversations.",
    strategicPressure: [
      { text: "The company is structurally a joint venture between a global insurer and a Philippine conglomerate, which means technology decisions carry two sets of governance expectations.", kind: "verified" },
      { text: "Motor claims status is the single most repetitive inbound driver for any composite insurer, and the Philippine market's repair-shop fragmentation makes status genuinely hard to answer.", kind: "inference" },
      { text: "Bancassurance-sourced policyholders often have no relationship with the insurer after purchase, so servicing contacts land cold with no context on either side.", kind: "inference" },
      { text: "Typhoon and flood seasons create property and motor claim surges that a fixed contact-centre roster cannot absorb without service collapse.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A JV insurer runs a lean local technology function focused on core policy and claims systems and channel integration. Neither parent's Philippine operation has a speech or conversational-AI engineering base, and AXA group technology standards push country units toward approved platforms rather than local builds.",
    whyNotBuild:
      "The hard parts are Tagalog motor-claims speech understanding, live orchestration across policy, claims and repair-network systems, and an evidence trail strong enough for regulator and reinsurer scrutiny. Assembling that from open components would take a JV insurer years and would still leave evaluation unsolved. The win is a claims-grade conversation layer with policy-bounded actions and 100 percent logged interactions.",
    workflows: [
      {
        name: "Motor FNOL and claim status",
        friction: "Loss notification is phone-only and queues behind routine service calls; afterwards the claimant calls weekly for status because the repair shop, surveyor and insurer never share one view.",
        outcome: "Structured FNOL in any channel with photos captured in-conversation, plus automatic status pushes at survey, approval and release stages.",
        channels: ["Voice", "Viber", "WhatsApp", "App"],
        systems: ["General insurance policy system", "Claims management", "Repair-shop network records", "Document management"],
        value: 3, complexity: 3,
      },
      {
        name: "Bancassurance policyholder onboarding",
        friction: "Customers who bought through a Metrobank branch do not know who to contact, cannot register for the portal, and call the branch instead, which routes them back to the insurer.",
        outcome: "Guided post-sale activation in the customer's channel, covering policy explanation, portal registration and free-look confirmation with full audit logging.",
        channels: ["Voice", "SMS", "Viber"],
        systems: ["Policy administration", "Bancassurance sales records", "Identity and portal registration", "CRM"],
        value: 2, complexity: 2,
      },
      {
        name: "Renewal and premium conversations",
        friction: "Motor renewals are chased by outbound callers working a spreadsheet during office hours, so working customers are simply never reached and the policy lapses to a competitor.",
        outcome: "Timed, two-way renewal conversations with quote explanation and in-channel payment, and human handoff for anything requiring underwriting judgement.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Policy administration", "Rating engine", "Payment gateway", "CRM"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A policyholder mobile app and web portal covering policy details, premium payment and basic claim submission",
        "A customer hotline handling life and general insurance servicing",
        "Bancassurance servicing through Metrobank branch staff for policies sold in-branch",
        "Messaging and social service channels used for simple queries and claim follow-ups",
      ],
      gaps: [
        "Claimants cannot get a live, grounded answer on where a motor claim actually stands",
        "Property and motor claim surges during weather events have no elastic capacity",
        "Bancassurance customers have no guided path from purchase to an activated servicing relationship",
        "Renewal conversations happen only for customers who answer a daytime call",
      ],
    },
    risks: [
      "Insurance Commission rules on claims handling, disclosure and complaint management that constrain what an automated channel may state about coverage or settlement",
      "The Philippine Data Privacy Act applied to accident photos, medical documents and vehicle data captured in-conversation, including retention and consent",
      "Dual-parent governance: AXA group technology standards and GT Capital conglomerate procurement may impose different vendor, hosting and audit requirements",
    ],
    economics: {
      volumeMonthly: 240000,
      costPerInteraction: 1.25,
      automationRate: 0.45,
      basis: "Seller assumptions for a composite Philippine insurer where motor claims dominate contact volume; validate claim frequency, contacts per claim and blended contact cost in discovery.",
    },
    pilotScope:
      "Automate motor claim FNOL and status conversations on voice and Viber for private-car policies, with survey and settlement decisions retained by human adjusters.",
    expansion: [
      "Add motor and property renewal conversations with in-channel payment",
      "Add bancassurance post-sale onboarding and free-look confirmation",
      "Extend to life policy servicing and to weather-event surge handling across all lines",
    ],
    stakeholders: [
      "Chief Operations Officer",
      "Head of General Insurance Claims",
      "Head of Bancassurance",
      "Chief Technology Officer",
      "Data Protection Officer",
    ],
    discovery: [
      "How many contacts does an average motor claim generate from FNOL to release, and what fraction are pure status?",
      "During a major typhoon, how far above baseline does claims contact volume go and how do you staff for it?",
      "Which parent's technology standards actually govern a customer-facing platform decision here?",
      "What proportion of bancassurance-sourced policyholders ever register on your servicing channels?",
    ],
    flowTemplate: "claims",
    scenario: "A driver rear-ended on EDSA files FNOL on Viber with photos in three minutes, then gets automatic updates at survey, approval and release instead of calling the hotline every week.",
  },

  "medicard": {
    operatingContext:
      "Medicard Philippines is one of the country's established health maintenance organizations, covering members almost entirely through corporate accounts and operating its own free-standing clinics alongside an accredited hospital and doctor network. Its daily operating reality is authorization: a member who needs care requests a letter of authorization, and the HMO must verify eligibility, benefit limits, provider accreditation and coverage rules before care proceeds. That means the contact centre is not a complaints desk but a real-time gatekeeping function sitting between a sick member and a clinic reception counter. Members reach it by hotline, by clinic staff calling on their behalf, and through app and portal channels, while corporate HR administrators form a second audience querying enrollment, utilization and billing.",
    strategicPressure: [
      { text: "The Philippine HMO model makes letter-of-authorization issuance a real-time, phone-bound bottleneck between the member and the point of care.", kind: "verified" },
      { text: "Rising medical cost inflation compresses HMO margins, which puts direct pressure on servicing cost per member rather than on premium growth.", kind: "inference" },
      { text: "Contact volume is violently seasonal, concentrating at corporate enrollment cycles and respiratory-illness peaks, which a fixed hotline roster cannot match.", kind: "inference" },
      { text: "Corporate HR administrators increasingly compare HMOs on member service responsiveness at renewal, making hotline experience a retention variable.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A mid-size HMO's technology function exists to run the membership, claims and provider systems, not to build conversational infrastructure. There is no public signal of speech or dialogue engineering capability, and the economics of a build never work at this member scale.",
    whyNotBuild:
      "LOA automation requires Tagalog speech quality on medical vocabulary, live orchestration across membership, benefit and provider-accreditation systems, strict policy bounding so no agent ever grants coverage it should not, and an evaluation regime that proves it. That is four specialist disciplines an HMO does not staff. The right to win is a governed authorization conversation that acts inside the HMO's own systems and logs every decision.",
    workflows: [
      {
        name: "LOA request and issuance",
        friction: "Members and clinic front desks phone in for authorization and wait in queue while an agent checks eligibility, benefit balance and provider accreditation across separate screens; peak-hour queues delay care.",
        outcome: "Authenticated members obtain a valid LOA conversationally within policy, with edge cases and clinical exclusions routed to a human reviewer with full context.",
        channels: ["Voice", "Viber", "App", "Web chat"],
        systems: ["Membership and eligibility system", "Benefit and utilization records", "Provider accreditation database", "LOA issuance system"],
        value: 3, complexity: 3,
      },
      {
        name: "Coverage and provider-network navigation",
        friction: "Members ask which nearby hospital or specialist is accredited and what their remaining benefit is, and get inconsistent answers depending on which agent picks up.",
        outcome: "Grounded, cited answers on accredited providers, coverage rules and remaining limits in the member's language, any hour.",
        channels: ["Voice", "Viber", "App", "Web chat"],
        systems: ["Provider accreditation database", "Benefit plan rules", "Utilization records", "Clinic scheduling"],
        value: 2, complexity: 2,
      },
      {
        name: "Corporate HR administrator desk",
        friction: "HR administrators email or call account managers for enrollment changes, member lists and utilization questions, and wait days for answers that exist in systems already.",
        outcome: "Self-service administrator conversations for enrollment status, member additions and utilization summaries, with account managers freed for renewal conversations.",
        channels: ["Voice", "Email", "Web chat"],
        systems: ["Corporate account records", "Enrollment system", "Utilization reporting", "Billing"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A member hotline that handles LOA requests and coverage questions",
        "A member app and web portal showing plan details, benefit balances and accredited providers",
        "Free-standing Medicard clinics whose front desks handle authorization on the member's behalf",
        "Corporate account managers serving HR administrators for enrollment and billing",
      ],
      gaps: [
        "Members cannot obtain a routine LOA end-to-end without a human, even for clearly in-policy cases",
        "Nobody can get an authoritative accredited-provider answer outside hotline hours",
        "Clinic front desks queue on the same hotline as members, competing with them for capacity",
        "HR administrators have no self-service path for enrollment and utilization questions",
      ],
    },
    risks: [
      "The Philippine Data Privacy Act treats health information as sensitive personal information, so any conversational handling of diagnosis, procedure or utilization data needs explicit consent, tight retention and a documented lawful basis",
      "Insurance Commission oversight of HMOs constrains what an automated channel may assert about coverage; wrongly granting or denying an authorization is a member-harm event, not a service-metric miss",
      "Medical terminology in Tagalog and Taglish is a hard speech-recognition case and must be benchmarked against recorded LOA calls before production",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 1.1,
      automationRate: 0.5,
      basis: "Seller assumptions for a major Philippine HMO where authorization requests dominate contact volume; validate LOA request counts, current digital-LOA share and cost per authorization in discovery.",
    },
    pilotScope:
      "Automate outpatient consultation LOA requests and accredited-provider lookups on voice and Viber for a defined set of corporate accounts, with all clinical exclusions and non-standard cases escalated to human reviewers.",
    expansion: [
      "Extend LOA automation to diagnostics and specialist referrals",
      "Add the corporate HR administrator desk for enrollment and utilization queries",
      "Add clinic-side authorization support and proactive utilization notifications to members",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Customer Service / Member Services",
      "Medical Director",
      "Chief Information Officer",
      "Data Protection Officer",
    ],
    discovery: [
      "What proportion of LOA requests are routine and in-policy versus requiring clinical judgement?",
      "Can your LOA issuance system accept an authenticated API call, or does issuance require a human in the system today?",
      "How much of your hotline volume comes from clinic front desks rather than members?",
      "What does a delayed authorization cost you in member complaints and corporate-account renewal risk?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A member at a clinic reception counter in Makati gets an outpatient LOA issued conversationally in ninety seconds instead of holding on the hotline while the queue builds behind her.",
  },

  "maxicare": {
    operatingContext:
      "Maxicare is the largest health maintenance organization in the Philippines, covering millions of members predominantly through corporate group plans, with a growing individual and small-business book alongside its own primary-care clinic footprint. Its entire member experience turns on authorization and access: proving eligibility, finding an accredited provider, issuing a letter of authorization, and settling with the hospital afterwards. Contact arrives from members by hotline, app and messaging, from accredited hospital and clinic admitting desks verifying coverage, and from corporate HR administrators managing enrollment. Volume concentrates brutally at corporate enrollment cycles and illness seasons, when the same fixed hotline roster must absorb multiples of baseline demand.",
    strategicPressure: [
      { text: "Maxicare operates at the largest member scale in the Philippine HMO market, which makes per-member servicing cost a direct margin lever.", kind: "verified" },
      { text: "Medical cost inflation across the Philippine private healthcare system compresses HMO underwriting margins and pushes cost attention to operations.", kind: "inference" },
      { text: "Authorization latency is the member-visible failure mode of an HMO, and it happens exactly when the member is sick and standing at an admitting desk.", kind: "inference" },
      { text: "Corporate renewal decisions are increasingly influenced by member service complaints reaching HR, making hotline performance a revenue-retention issue.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Scale makes the business case obvious and the build case worse: Maxicare's technology organization is sized to run membership, claims and provider platforms at national scale, not to develop speech recognition, dialogue orchestration and evaluation tooling. At this volume, packaged agentic automation pays back on authorization workflow alone.",
    whyNotBuild:
      "Nobody builds a Tagalog medical-authorization voice stack as a side project. It requires speech quality on clinical vocabulary, real-time integration with eligibility, benefit and accreditation systems, hard policy bounding so authorizations are never granted outside plan rules, and continuous evaluation to prove correctness to regulators and corporate clients. The right to win is exactly that combination delivered as a governed layer over Maxicare's existing systems.",
    workflows: [
      {
        name: "LOA issuance at scale",
        friction: "Authorization requests queue on the hotline during peak hours while a member sits at an admitting desk; agents check eligibility, benefit balance and accreditation across multiple systems for cases that are overwhelmingly routine.",
        outcome: "Routine authorizations issued conversationally within policy in under two minutes, with clinical and exception cases routed to human reviewers with full context.",
        channels: ["Voice", "Viber", "App", "Web chat"],
        systems: ["Membership and eligibility", "Benefit and utilization records", "Provider accreditation", "LOA issuance system"],
        value: 3, complexity: 3,
      },
      {
        name: "Provider-network and benefit navigation",
        friction: "Members ask which nearby hospital, clinic or specialist is accredited and what is still covered; answers vary by agent and are unavailable outside hotline hours.",
        outcome: "Grounded, consistent answers on accreditation, coverage and remaining limits in Tagalog or English, twenty-four hours a day.",
        channels: ["Voice", "Viber", "App", "Web chat"],
        systems: ["Provider accreditation database", "Plan rules engine", "Utilization records", "Clinic scheduling"],
        value: 2, complexity: 2,
      },
      {
        name: "Enrollment-season surge handling",
        friction: "Corporate enrollment cycles multiply contact volume from members and HR administrators, melting hold times and pushing complaints into renewal conversations.",
        outcome: "Elastic capacity absorbs the surge with card status, enrollment confirmation and plan-detail queries handled conversationally, protecting the human team for genuine exceptions.",
        channels: ["Voice", "Viber", "Email", "Web chat"],
        systems: ["Enrollment system", "Corporate account records", "Card issuance", "CRM"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A member app and portal showing plan coverage, benefit balance and accredited providers",
        "A national member hotline handling authorization requests and coverage queries",
        "Maxicare primary-care clinics whose front desks handle member access directly",
        "Corporate account teams supporting HR administrators through enrollment and renewal",
      ],
      gaps: [
        "Members still cannot complete a routine authorization end-to-end without a human agent",
        "Hospital admitting desks verifying coverage compete with members for the same hotline capacity",
        "Enrollment-season and illness-season surges have no elastic capacity, only longer queues",
        "There is no proactive communication when a benefit limit is nearly exhausted or a provider leaves the network",
      ],
    },
    risks: [
      "Health information is sensitive personal information under the Philippine Data Privacy Act, requiring explicit consent, minimized retention and a documented lawful basis for every conversational touchpoint",
      "Insurance Commission supervision of HMOs means an incorrectly granted or denied authorization is a compliance and member-harm event; policy bounding and human review of clinical cases are non-negotiable",
      "Clinical and pharmaceutical terminology spoken in Taglish is a demanding speech case that must be benchmarked on recorded authorization calls before any production rollout",
    ],
    economics: {
      volumeMonthly: 1400000,
      costPerInteraction: 1.0,
      automationRate: 0.55,
      basis: "Seller assumptions for the largest Philippine HMO with member, provider-desk and HR-administrator contact combined; validate authorization request volumes, current digital-LOA adoption and cost per contact in discovery.",
    },
    pilotScope:
      "Automate outpatient and diagnostic LOA issuance plus accredited-provider lookup on voice and Viber for a defined member segment, with every clinical exception routed to a human reviewer.",
    expansion: [
      "Extend authorization automation to inpatient pre-approval workflows with human clinical sign-off",
      "Add the hospital and clinic admitting-desk verification channel as a separate authenticated flow",
      "Add corporate HR administrator self-service and proactive benefit-utilization notifications",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Chief Customer Experience Officer",
      "Head of Healthcare Delivery / Medical Director",
      "Chief Information Officer",
      "Data Protection Officer",
    ],
    discovery: [
      "What share of authorization requests could be granted automatically under your existing plan rules with no clinical judgement?",
      "How does hold time behave during enrollment season compared with a normal week?",
      "Does your LOA system expose an API that an authenticated agent could call, and who owns that decision?",
      "How often do member service complaints surface in corporate renewal negotiations?",
    ],
    flowTemplate: "claims",
    scenario: "A member standing at a hospital admitting desk in Quezon City gets her LOA issued conversationally in ninety seconds instead of joining a twenty-minute hotline queue while admissions waits.",
  },

  "intellicare": {
    operatingContext:
      "Intellicare, operated by Asalus Corporation, is a corporate-focused Philippine HMO whose members come almost entirely through employer group plans rather than individual purchase. Its servicing pattern mirrors the industry: authorization requests, eligibility verification and accredited-provider lookups arrive continuously from members, while a parallel stream of enrollment, billing and utilization questions arrives from the HR administrators who actually buy and renew the plans. Because the corporate channel dominates, service quality is measured twice, once by the member at the point of care and once by the HR administrator at renewal. Contact runs mainly through the hotline and email, with app and portal channels handling lookups but not completing transactions.",
    strategicPressure: [
      { text: "Intellicare's book is concentrated in corporate group plans, which makes HR-administrator satisfaction as commercially important as member satisfaction.", kind: "verified" },
      { text: "As a mid-size HMO competing against larger rivals on service, it cannot outspend them on headcount and must find capacity through automation.", kind: "inference" },
      { text: "Medical cost inflation and utilization growth squeeze margins across the Philippine HMO sector, pushing operating-cost scrutiny onto the contact centre.", kind: "inference" },
      { text: "Enrollment-cycle surges concentrate administrator and member demand into narrow windows that a fixed roster handles by queueing, not by scaling.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A mid-size HMO has neither the engineering base nor the volume economics to justify building conversational infrastructure; its technology spend goes to membership, claims and provider systems. The realistic path is buying proven automation and integrating it, ideally following the pattern larger competitors validate first.",
    whyNotBuild:
      "Speech quality on Tagalog medical vocabulary, live orchestration across eligibility and accreditation systems, policy bounding that prevents an incorrect authorization, and continuous evaluation are four capabilities Intellicare would have to acquire from scratch. No HMO of this size will. The right to win is packaged, governed authorization and administrator automation with a payback provable inside a single enrollment cycle.",
    workflows: [
      {
        name: "Member LOA and eligibility",
        friction: "Members and clinic desks call for authorization and eligibility confirmation and wait in queue while an agent reconciles benefit balances and accreditation manually.",
        outcome: "In-policy authorizations and eligibility confirmations completed conversationally, with clinical and exception cases escalated with full context.",
        channels: ["Voice", "Viber", "Web chat"],
        systems: ["Membership and eligibility", "Benefit records", "Provider accreditation", "LOA issuance"],
        value: 3, complexity: 3,
      },
      {
        name: "HR administrator support",
        friction: "Corporate HR administrators email account managers for enrollment status, member additions and deletions, and utilization reports, then wait days for answers that already exist in systems.",
        outcome: "Administrators self-serve enrollment status, member movements and utilization summaries in-channel, with account managers redeployed to renewal and consultative work.",
        channels: ["Voice", "Email", "Web chat"],
        systems: ["Corporate account records", "Enrollment system", "Utilization reporting", "Billing"],
        value: 3, complexity: 2,
      },
      {
        name: "Enrollment-cycle onboarding",
        friction: "New member cohorts arrive with card, coverage and provider questions at the same moment every cycle, and the answers are delivered one phone call at a time.",
        outcome: "Proactive onboarding conversations explain coverage, card status and how to use the network, suppressing the predictable inbound wave.",
        channels: ["Voice", "SMS", "Viber", "Email"],
        systems: ["Enrollment system", "Card issuance", "Plan rules", "CRM"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: [
        "A member hotline handling authorization, eligibility and coverage queries",
        "A member portal and app for plan details and accredited-provider lookup",
        "Dedicated corporate account managers serving HR administrators",
        "Email as the primary channel for corporate enrollment and billing correspondence",
      ],
      gaps: [
        "Members cannot complete an authorization without a human, even for clearly in-policy outpatient cases",
        "HR administrators have no self-service route for enrollment changes or utilization data",
        "New-cohort onboarding is reactive, so every enrollment cycle produces the same predictable inbound wave",
        "No channel is available outside business hours for members needing care access",
      ],
    },
    risks: [
      "The Philippine Data Privacy Act classifies health data as sensitive personal information; conversational handling of diagnosis, utilization and member data requires explicit consent and strict retention",
      "Insurance Commission oversight of HMO conduct means authorization decisions must stay inside documented plan rules, with clinical judgement reserved for qualified humans",
      "Corporate clients may impose their own data-handling and audit requirements on any vendor touching employee health data, adding a second approval layer beyond the HMO's own",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 1.05,
      automationRate: 0.5,
      basis: "Seller assumptions for a corporate-focused Philippine HMO combining member authorization traffic and HR-administrator queries; validate contact volumes, administrator-versus-member split and cost per contact in discovery.",
    },
    pilotScope:
      "Automate outpatient LOA and eligibility conversations on voice and Viber for members of the largest corporate accounts, with clinical exceptions escalated to human reviewers.",
    expansion: [
      "Add the HR administrator desk covering enrollment status, member movements and utilization summaries",
      "Add proactive enrollment-cycle onboarding conversations for new member cohorts",
      "Extend to diagnostics and specialist referral authorization with human clinical sign-off",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Member Services",
      "Head of Corporate Accounts",
      "Chief Information Officer",
      "Data Protection Officer",
    ],
    discovery: [
      "What share of your inbound contacts come from HR administrators rather than members?",
      "How many authorization requests per month, and what fraction need genuine clinical review?",
      "How much does contact volume rise during enrollment cycles, and how do you staff for it today?",
      "Do your largest corporate clients impose data-handling requirements on your vendors?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An HR administrator at a BPO client confirms twelve new hire enrollments and pulls a utilization summary in one conversation instead of waiting two days for an account manager's email.",
  },

  "puregold": {
    operatingContext:
      "Puregold Price Club runs a nationwide grocery and hypermarket chain aimed at value-conscious Filipino households, but its most distinctive asset is the Tindahan ni Aling Puring programme, which enrolls hundreds of thousands of sari-sari store owners and micro-retailers as members who buy wholesale from Puregold stores and resell in their neighbourhoods. That makes Puregold simultaneously a consumer grocer and a B2B supplier to a vast, informal, phone-and-text-first micro-entrepreneur network. Consumer contact is loyalty, pricing and increasingly e-commerce order support; partner contact is stock availability, promo pricing, points and bulk-order coordination, largely handled today by store staff, field coordinators and SMS. The partner base is the strategic layer, because those members drive basket size and repeat volume in a thin-margin business.",
    strategicPressure: [
      { text: "The Tindahan ni Aling Puring programme is a defining part of Puregold's model, tying a large sari-sari store membership base to its stores.", kind: "verified" },
      { text: "Grocery retail margins are thin enough that any customer-service investment must justify itself in basket size or labour substitution, not in experience scores.", kind: "inference" },
      { text: "Sari-sari partners are phone and messaging natives with limited app adoption, so servicing them digitally means conversational channels rather than portals.", kind: "inference" },
      { text: "Competition from convenience formats and quick-commerce for the same neighbourhood spend raises the value of keeping micro-retail partners loyal and well-supplied.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Puregold is an operations-and-real-estate business whose technology function runs merchandising, POS and supply chain. There is no signal of conversational or speech engineering capability, and a cost-disciplined grocer buys packaged tools with a direct operating payback.",
    whyNotBuild:
      "Serving a micro-retailer network conversationally means Tagalog and regional-language voice quality on product and pricing vocabulary, real-time inventory and promo grounding, member identity resolution for people with no app, and evaluation to keep pricing statements accurate. A grocer will never build that. The right to win is a partner-facing conversational channel grounded in live merchandising and loyalty systems.",
    workflows: [
      {
        name: "Sari-sari partner ordering support",
        friction: "Partners call or text the store to ask what is in stock and at what wholesale price, and get answers only when a staff member has time to walk the aisle; wasted trips are common.",
        outcome: "Partners get live stock and promo answers and place or reserve bulk orders conversationally, raising basket size and reducing wasted store trips.",
        channels: ["Voice", "SMS", "Viber", "Messenger"],
        systems: ["Inventory and merchandising system", "Loyalty and membership records", "Promo and pricing engine", "Store operations"],
        value: 3, complexity: 2,
      },
      {
        name: "Loyalty and membership servicing",
        friction: "Members ask about points, rebate eligibility and membership renewal at the customer service counter or by phone, and the answer depends on which staff member is asked.",
        outcome: "Consistent, grounded loyalty answers and renewals handled conversationally, freeing counter staff for in-store service.",
        channels: ["Voice", "SMS", "Viber"],
        systems: ["Loyalty and membership records", "POS transaction history", "Promo engine", "CRM"],
        value: 2, complexity: 1,
      },
      {
        name: "E-commerce and delivery order support",
        friction: "Online grocery orders generate substitution, missing-item and delivery-window issues that land on a small support team, and customers chase status with repeat calls.",
        outcome: "Order status, substitution approval and delivery rescheduling handled in-conversation with live order data, with goodwill above a threshold escalated for approval.",
        channels: ["Voice", "Viber", "Messenger", "Web chat"],
        systems: ["Order management", "Delivery and fulfilment", "Payments", "Inventory"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "The Tindahan ni Aling Puring membership programme with card-based identification at store level",
        "Store-level customer service counters handling loyalty, returns and partner queries",
        "An online grocery ordering and delivery channel with a supporting help desk",
        "SMS and social-messaging channels used for promo announcements and member communication",
      ],
      gaps: [
        "Partners cannot check live stock or wholesale pricing before travelling to a store",
        "There is no authenticated conversational channel that recognizes a member and their purchase history",
        "Bulk orders cannot be reserved or placed outside store hours",
        "Online order exceptions such as substitutions require a human callback rather than an in-conversation decision",
      ],
    },
    risks: [
      "The Philippine Data Privacy Act applies to member purchase histories and partner business data used to personalize conversations, requiring consent and clear retention rules",
      "Price and promotion statements made conversationally must match in-store reality or they become consumer-protection exposure under DTI rules; grounding must be live, not cached",
      "Regional-language reality outside Metro Manila means Cebuano and other languages appear in partner conversations and must be covered or explicitly scoped out",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 0.8,
      automationRate: 0.55,
      basis: "Seller assumptions covering partner-member and consumer contact for a national Philippine grocery chain; validate current partner-support volumes, channel mix and store-labour cost absorbed by these queries in discovery.",
    },
    pilotScope:
      "Automate sari-sari partner stock, wholesale-price and bulk-order reservation conversations on voice and Viber for stores in one region, grounded in live inventory and promo data.",
    expansion: [
      "Add loyalty and membership servicing including points, rebates and renewals",
      "Add online grocery order-status, substitution and delivery-rescheduling conversations",
      "Extend to regional languages and to proactive promo and restock notifications for partners",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Marketing / Loyalty Programme Owner",
      "Head of Store Operations",
      "Chief Information Officer",
      "Head of E-commerce",
    ],
    discovery: [
      "How do Aling Puring partners find out what is in stock before they travel to a store today?",
      "What is the labour cost absorbed by store staff answering partner and loyalty queries?",
      "Can your merchandising system expose live stock and wholesale pricing to an external conversational channel?",
      "How much basket-size upside would you expect if partners could reserve bulk orders in advance?",
    ],
    flowTemplate: "dealer-support",
    scenario: "A sari-sari owner in Bulacan checks stock and wholesale pricing on Viber at 6am, reserves a bulk order, and collects it without a wasted trip.",
  },

  "sm-retail": {
    operatingContext:
      "SM Retail is the SM group's retail operating arm, running The SM Store department stores alongside SM Supermarket, SM Hypermarket and Savemore grocery formats in malls and standalone sites nationwide. Its customers are mainstream Filipino households across income tiers, reached through physical stores, an e-commerce and personal-shopper service, and the SMAC loyalty programme that ties purchases across formats to a single member identity. Conversational demand comes from order status and delivery scheduling on the online side, SMAC points and card servicing, gift registry and gift card queries, and store-level product availability questions. Because the brands sit under one retail arm but operate distinct systems, a customer's question often crosses formats while the support structure does not.",
    strategicPressure: [
      { text: "SM Retail spans department store and grocery formats under one group, giving it national retail scale in the Philippines.", kind: "verified" },
      { text: "The SMAC loyalty programme creates a single member identity across formats, which is the natural anchor for authenticated conversational servicing.", kind: "inference" },
      { text: "Online grocery and personal-shopper services generate exception-heavy contact per order that physical retail never produced, and the support model has not scaled with it.", kind: "inference" },
      { text: "Quick-commerce and marketplace competitors set customer expectations for delivery-issue resolution that a store-anchored retailer struggles to meet by phone.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. SM's retail organization is a merchandising and store-operations business; group technology decisions run through shared services and established vendor frameworks. There is no public evidence of conversational-AI engineering inside the retail arm, and the scale argument favours buying capability that works across formats.",
    whyNotBuild:
      "The requirement is Tagalog and English conversational quality over retail vocabulary, live grounding in order management, loyalty and inventory systems that differ by format, and the ability to execute reschedules and goodwill within policy. A retailer will not staff speech, orchestration and evaluation teams to do that. The right to win is one conversational layer that spans formats where the underlying systems do not.",
    workflows: [
      {
        name: "Order status and delivery scheduling",
        friction: "Online grocery and department-store orders generate where-is-my-order calls; agents check the order system and a separate delivery feed, and rescheduling requires a callback from the fulfilment team.",
        outcome: "Live order truth and in-conversation rescheduling or address correction, with proactive notification when a delivery is at risk.",
        channels: ["Voice", "Viber", "Messenger", "Web chat"],
        systems: ["Order management", "Delivery and fulfilment", "Store inventory", "Payments"],
        value: 3, complexity: 2,
      },
      {
        name: "SMAC loyalty servicing",
        friction: "Members ask about points balances, missing points from a transaction, card replacement and renewal, and get inconsistent answers at counters or by phone.",
        outcome: "Authenticated loyalty conversations resolving balances, missing-point claims and renewals directly, with counters freed for selling.",
        channels: ["Voice", "Viber", "App", "Web chat"],
        systems: ["Loyalty platform", "POS transaction history", "Card issuance", "CRM"],
        value: 2, complexity: 2,
      },
      {
        name: "Product availability and store queries",
        friction: "Customers phone individual stores to ask whether an item is in stock, and staff must physically check; calls are often unanswered at peak trading hours.",
        outcome: "Grounded availability answers across nearby branches with reservation where supported, deflecting store-phone load entirely.",
        channels: ["Voice", "Viber", "Messenger"],
        systems: ["Store inventory", "Merchandising system", "Store operations", "Promo engine"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "The SMAC loyalty programme with a single member identity across SM retail formats",
        "An e-commerce and personal-shopper ordering service with delivery and pickup options",
        "Store-level customer service counters handling returns, loyalty and gift services",
        "Social messaging and hotline channels for order and general customer queries",
      ],
      gaps: [
        "Customers cannot reschedule a delivery or correct an address inside a conversation",
        "Product availability at a specific branch cannot be confirmed without someone physically checking",
        "Loyalty and order histories are not joined in a single authenticated servicing conversation",
        "Peak-season and mall-sale surges have no elastic contact capacity",
      ],
    },
    risks: [
      "The Philippine Data Privacy Act governs loyalty purchase histories and delivery addresses used to personalize conversations, requiring consent and minimization",
      "DTI consumer-protection rules on pricing, promotions and refund handling mean conversational statements about price or return eligibility must be grounded in live policy, not model recall",
      "Format-level system fragmentation across department store, supermarket and hypermarket operations is the main delivery risk and must be scoped before any cross-format promise",
    ],
    economics: {
      volumeMonthly: 1800000,
      costPerInteraction: 0.85,
      automationRate: 0.6,
      basis: "Seller assumptions for a national multi-format Philippine retailer combining order support, loyalty servicing and store queries; validate contact volumes by format, channel mix and blended cost per contact in discovery.",
    },
    pilotScope:
      "Automate online order-status and delivery-rescheduling conversations on Viber and voice for the e-commerce and personal-shopper service in Metro Manila, grounded in live order and fulfilment data.",
    expansion: [
      "Add SMAC loyalty servicing including points, missing-transaction claims and card renewals",
      "Add store product-availability and reservation conversations across nearby branches",
      "Extend to all formats nationwide with proactive delivery-exception notifications",
    ],
    stakeholders: [
      "President / Chief Operating Officer, SM Retail",
      "Head of E-commerce and Omnichannel",
      "Head of Customer Experience",
      "Chief Information Officer / Group IT",
      "Loyalty Programme Head",
    ],
    discovery: [
      "Are CX platform decisions made at SM Retail or at SM Investments group level?",
      "How many contacts does an average online grocery order generate, and what share are delivery exceptions?",
      "Can a conversational channel write a reschedule back into your fulfilment system, or is that human-only today?",
      "How much store-staff time goes to answering phone queries about product availability?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A customer whose SM Supermarket delivery slot is slipping gets a Viber message before she calls, reschedules to the evening in two taps, and never reaches the hotline.",
  },

  "mercury-drug": {
    operatingContext:
      "Mercury Drug is the dominant pharmacy retailer in the Philippines, operating over a thousand branches nationwide with a store network that functions as the country's default access point for prescription and over-the-counter medicine. Its customers span the full population, with a disproportionately senior and chronically-ill base whose interactions carry statutory discount entitlements for senior citizens and persons with disability. Contact today is overwhelmingly store-level and phone-based: customers ring individual branches to ask whether a specific medicine is in stock, what it costs after discount, and whether it can be delivered, while the Suki loyalty card ties repeat purchases to a member identity. Delivery flows through the company's own ordering channels and third-party platforms, adding order-status and substitution conversations to an operation built for counter service.",
    strategicPressure: [
      { text: "Mercury Drug operates the largest pharmacy store network in the Philippines, making branch-level phone traffic a distributed and largely unmeasured cost.", kind: "verified" },
      { text: "Philippine law mandates senior citizen and PWD discounts on medicine, so eligibility and pricing questions are a permanent, high-frequency conversation type.", kind: "verified" },
      { text: "Medicine availability is inherently branch-specific, so a question that a central hotline cannot answer today is exactly the question customers ask most.", kind: "inference" },
      { text: "Competition from newer pharmacy chains and quick-commerce delivery raises the cost of a customer travelling to a branch and finding the item out of stock.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Mercury Drug is a famously conservative, family-controlled retail operator whose technology investment centres on POS, inventory and supply chain. There is no signal of software-platform engineering, and its culture points to buying a proven, low-risk capability rather than developing one.",
    whyNotBuild:
      "A pharmacy availability agent needs Tagalog and regional-language speech accurate on drug names, live branch-level inventory grounding, correct application of statutory discount rules, and hard guardrails preventing anything resembling clinical advice. That combination of speech, orchestration and evaluation is not something a retailer builds. The right to win is a governed conversational layer that answers branch-specific availability truthfully and never crosses into pharmacist territory.",
    workflows: [
      {
        name: "Medicine availability and branch routing",
        friction: "Customers call branches directly and often get no answer at peak hours; when they do, staff must leave the counter to check the shelf, and the caller still travels blind to a second branch if it is out of stock.",
        outcome: "Live branch-level availability answers with nearby-branch alternatives and reservation where supported, cutting wasted trips and branch phone load.",
        channels: ["Voice", "Viber", "Messenger", "SMS"],
        systems: ["Branch inventory", "Product master and pricing", "Store operations", "Reservation or click-and-collect"],
        value: 3, complexity: 2,
      },
      {
        name: "Delivery order support",
        friction: "Delivery orders generate substitution, partial-fulfilment and status questions that a small central team handles by phone, while aggregator-sourced orders add a second, disconnected flow.",
        outcome: "Order status, substitution decisions and delivery rescheduling resolved in-conversation against live order data, with refunds above a threshold escalated for approval.",
        channels: ["Voice", "Viber", "Messenger", "Web chat"],
        systems: ["Order management", "Delivery dispatch", "Payments", "Branch inventory"],
        value: 2, complexity: 2,
      },
      {
        name: "Discount eligibility and loyalty queries",
        friction: "Senior citizen and PWD discount questions, booklet requirements and Suki points balances are answered inconsistently across a thousand branches, generating disputes at the counter.",
        outcome: "Consistent, grounded answers on statutory discount entitlement, required documentation and loyalty balances before the customer reaches the counter.",
        channels: ["Voice", "Viber", "SMS"],
        systems: ["Loyalty records", "Pricing and discount rules", "POS transaction history", "Customer records"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: [
        "A nationwide branch network where store staff answer customer phone calls directly",
        "The Suki loyalty card programme linking repeat purchases to a member identity",
        "A delivery and ordering service operated alongside third-party delivery platforms",
        "Social-messaging and hotline channels used for general customer queries and complaints",
      ],
      gaps: [
        "Customers cannot confirm whether a specific medicine is available at a specific branch without calling and waiting",
        "There is no reliable way to find the nearest branch that actually has the item in stock",
        "Delivery order exceptions such as substitutions require a human callback",
        "Statutory discount and documentation questions are resolved only at the counter, after the customer has travelled",
      ],
    },
    risks: [
      "FDA and pharmacy-practice rules mean an automated channel must never give clinical or dosage advice; every clinical question must route to a licensed pharmacist, with hard guardrails and logging",
      "The Philippine Data Privacy Act treats prescription and health-related purchase data as sensitive personal information, constraining what may be stored, recalled or discussed conversationally",
      "Statutory senior citizen and PWD discount rules must be applied exactly; a wrong discount statement is a regulatory and reputational exposure, not a service defect",
    ],
    economics: {
      volumeMonthly: 2200000,
      costPerInteraction: 0.7,
      automationRate: 0.6,
      basis: "Seller assumptions covering branch-level phone traffic plus central delivery and loyalty contacts for a national Philippine pharmacy chain; validate branch call volumes, staff time absorbed and delivery contact rates in discovery.",
    },
    pilotScope:
      "Automate medicine availability and nearest-branch routing conversations on voice and Viber for branches in one region, grounded in live branch inventory, with all clinical questions routed to a pharmacist.",
    expansion: [
      "Add delivery order status, substitution and rescheduling conversations",
      "Add statutory discount eligibility and Suki loyalty servicing",
      "Extend nationwide with regional-language coverage and proactive restock notifications for chronic-medicine customers",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Store Operations",
      "Chief Pharmacist / Regulatory Affairs Head",
      "Head of Information Technology",
      "Head of Marketing and Loyalty",
    ],
    discovery: [
      "How many phone calls per day does a typical branch take, and how much staff time do they consume?",
      "Can your inventory system expose branch-level stock to an external channel in near real time?",
      "What share of customers who visit a branch for a specific medicine leave without it?",
      "How do you want clinical questions handled so that no automated channel ever crosses into pharmacist advice?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A caregiver in Caloocan asks on Viber which nearby Mercury Drug branch has her father's maintenance medicine, gets a live answer with the senior discount explained, and reserves it before travelling.",
  },

  "manila-water": {
    operatingContext:
      "Manila Water is the concessionaire for the east zone of Metro Manila, supplying piped water and wastewater services to millions of households and businesses across Quezon City, Marikina, Pasig, Makati, Taguig and surrounding areas under a regulated concession. Its customer relationship is defined by the monthly bill and by service continuity: the two things customers contact it about are a bill they believe is wrong and water that has stopped flowing. Contact arrives through a hotline, a mobile app and portal, social media, and business centres, with volume spiking sharply during supply interruptions, main repairs and dry-season rationing. Because service obligations are regulated, response and resolution performance is not just a customer metric but a concession commitment.",
    strategicPressure: [
      { text: "Manila Water operates under a regulated concession with service obligations, so customer-service performance is tied to regulatory commitments rather than discretionary standards.", kind: "verified" },
      { text: "Supply interruptions and dry-season constraints have repeatedly produced service events in Metro Manila that generate concentrated call surges.", kind: "verified" },
      { text: "Billing disputes are the dominant steady-state contact driver for any metered utility, and each one requires meter, consumption-history and payment context a single agent must assemble manually.", kind: "inference" },
      { text: "During an interruption, the value of proactive outbound notification is higher than any inbound improvement, because the call is avoidable rather than shortenable.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A regulated water utility invests in network infrastructure, treatment and metering; its IT organization runs billing, GIS and work-management systems. Utilities of this type consistently procure customer-service technology under structured tenders rather than building conversational platforms.",
    whyNotBuild:
      "Interruption and billing conversations require Tagalog voice quality, live grounding in the billing and outage systems, the ability to raise a service order into work management, and elastic capacity that appears only during events. No utility staffs speech and orchestration engineers for that. The right to win is a proactive and inbound conversation layer that absorbs event surges and writes verified service requests into the utility's own systems.",
    workflows: [
      {
        name: "Proactive interruption notification and status",
        friction: "When a main breaks or a scheduled interruption starts, affected customers find out by losing water and then all call at once; the hotline melts and the same status is read out thousands of times.",
        outcome: "Affected accounts are notified proactively by area with expected restoration, and inbound status questions are answered from the live outage record, suppressing the surge.",
        channels: ["Voice", "SMS", "Viber", "Messenger"],
        systems: ["Outage and network management", "Customer and account records", "GIS / service-area mapping", "Work management"],
        value: 3, complexity: 2,
      },
      {
        name: "Billing dispute and consumption explanation",
        friction: "A customer with a high bill queues on the hotline while an agent pulls meter readings, consumption history and payment records from separate screens, then usually raises a ticket for a re-read anyway.",
        outcome: "Consumption history explained conversationally with the actual readings, and a re-read or investigation raised into work management inside the same conversation.",
        channels: ["Voice", "Viber", "App", "Web chat"],
        systems: ["Billing system", "Meter reading records", "Payment and collections", "Work management"],
        value: 3, complexity: 2,
      },
      {
        name: "Leak reporting and service requests",
        friction: "Leak reports and no-water complaints arrive by phone and social media with vague location descriptions, and re-contacts pile up because the reporter never learns whether a crew was dispatched.",
        outcome: "Structured leak and service reports with location captured accurately, dispatched into work management, and status pushed back to the reporter automatically.",
        channels: ["Voice", "Viber", "Messenger", "App"],
        systems: ["Work management", "GIS", "Customer records", "Field crew dispatch"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer hotline and business centres for billing, service and account transactions",
        "A mobile app and web portal for bill viewing, payment and service announcements",
        "Social media channels used heavily during interruptions for advisories and complaints",
        "SMS advisories for scheduled service interruptions in affected areas",
      ],
      gaps: [
        "Customers cannot get an account-specific interruption answer, only area-level advisories",
        "Billing disputes cannot be resolved in one conversation because re-reads require a separate ticket and callback",
        "Leak reports do not produce a tracked status the reporter can follow",
        "Interruption events have no elastic contact capacity, so hold times collapse exactly when trust is most at risk",
      ],
    },
    risks: [
      "Concession service obligations and regulatory oversight mean commitments stated conversationally about restoration times or bill adjustments carry regulatory weight and must be grounded in system data",
      "The Philippine Data Privacy Act governs account, address and consumption data used in conversations, including consent for proactive outbound notification",
      "Interruption events create extreme, unpredictable concurrency; capacity behaviour under a ten-times surge must be proven in a controlled test before it is relied upon in a real event",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.9,
      automationRate: 0.6,
      basis: "Seller assumptions for a Metro Manila water concessionaire combining steady-state billing traffic and event-driven surges; validate baseline and peak contact volumes, cost per contact and current outbound advisory reach in discovery.",
    },
    pilotScope:
      "Automate proactive interruption notification and inbound interruption-status conversations for one business area, with live outage grounding and human escalation for compensation or safety issues.",
    expansion: [
      "Add billing dispute and consumption explanation with re-read requests raised into work management",
      "Add leak reporting and service-request intake with tracked status back to the reporter",
      "Extend to the full concession area with new-connection and application-status conversations",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Customer Service / Customer Experience",
      "Head of Corporate Communications",
      "Chief Information Officer",
      "Regulatory Affairs Head",
    ],
    discovery: [
      "During a major interruption, how many multiples of baseline does contact volume reach and what happens to hold time?",
      "What share of billing contacts end in a re-read request that requires a separate ticket today?",
      "Can your work management system accept a service order raised by an authenticated conversational channel?",
      "Which service commitments in the concession could be evidenced by conversation-level logs?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A household in Marikina losing pressure at 6am gets a Viber notice with the cause and restoration estimate before dialling, and reports a street leak with the location captured correctly.",
  },

  "maynilad": {
    operatingContext:
      "Maynilad Water Services is the west-zone concessionaire for Metro Manila, serving the larger of the two capital customer bases across Caloocan, Manila, Quezon City west, Las Pinas, Paranaque, Cavite and adjacent areas, backed by Metro Pacific and DMCI interests. Its customer conversations are the utility staples with a harder edge: supply interruptions and low-pressure events in a service area with well-documented distribution constraints, billing disputes on metered consumption, leak reports, and new-connection applications. Contact runs through a hotline, business centres, a mobile app and portal, and social media, where interruption advisories are effectively broadcast and complaints are public. Because the west zone has historically carried more service-continuity issues, event-driven volume is a structural feature rather than an occasional exception.",
    strategicPressure: [
      { text: "Maynilad serves the west zone of Metro Manila under a regulated concession with defined service obligations to its regulator.", kind: "verified" },
      { text: "The west zone has a documented history of supply interruption and service-continuity events that generate concentrated contact surges.", kind: "verified" },
      { text: "Public complaint visibility on social media raises the reputational cost of a melted hotline during an interruption above its operational cost.", kind: "inference" },
      { text: "Capital priorities in network and non-revenue-water programmes leave customer-service technology competing for a small share of investment, favouring packaged solutions with clear payback.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Maynilad is an infrastructure operator whose technology spend concentrates on billing, metering, GIS and work management. Its owners' portfolio companies consistently procure customer-facing technology under structured vendor arrangements rather than developing platforms internally.",
    whyNotBuild:
      "The capability needed is Tagalog conversational quality across utility vocabulary, live outage and billing grounding, work-order creation, and elastic surge capacity that is idle most of the month. Building that is a multi-year programme with no strategic return for a water utility. The right to win is proactive and inbound conversation capacity that turns interruption events from a service collapse into a managed communication.",
    workflows: [
      {
        name: "Interruption status and proactive advisories",
        friction: "Interruptions trigger simultaneous calls and social-media complaints; area-level advisories do not answer the account-level question, so customers call anyway and wait.",
        outcome: "Affected accounts notified proactively with cause and restoration estimate, and inbound status answered from the live outage record, collapsing the surge.",
        channels: ["Voice", "SMS", "Viber", "Messenger"],
        systems: ["Outage and network management", "Customer account records", "GIS / service-area mapping", "Work management"],
        value: 3, complexity: 2,
      },
      {
        name: "Leak report intake and crew-dispatch handoff",
        friction: "Leak reports arrive with vague locations across phone and social channels, get transcribed by hand into work orders, and the reporter never hears whether anyone came.",
        outcome: "Structured leak reports with precise location captured, written into work management as a dispatchable order, with automatic status back to the reporter.",
        channels: ["Voice", "Viber", "Messenger", "App"],
        systems: ["Work management", "GIS", "Field crew dispatch", "Customer records"],
        value: 3, complexity: 2,
      },
      {
        name: "Billing and payment conversations",
        friction: "High-bill disputes, payment arrangements and disconnection-notice questions all require an agent to assemble meter, consumption and payment history manually before saying anything useful.",
        outcome: "Consumption explained from actual readings, payment arrangements offered within an approved matrix, and re-reads raised in-conversation.",
        channels: ["Voice", "Viber", "App", "Web chat"],
        systems: ["Billing system", "Meter reading records", "Payments and collections", "Work management"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer hotline and business centres handling billing, service and connection transactions",
        "A mobile app and web portal for bills, payment and service advisories",
        "Active social media channels used for interruption advisories and complaint handling",
        "SMS advisory broadcasts to affected service areas ahead of scheduled interruptions",
      ],
      gaps: [
        "No account-specific interruption answer exists, only area-level advisories that customers distrust",
        "Leak reports produce no trackable status for the person who reported them",
        "Payment arrangements require a business-centre visit or a long hotline call",
        "Contact capacity is fixed while interruption demand is extremely peaked",
      ],
    },
    risks: [
      "Regulatory service obligations mean restoration times and bill adjustments stated conversationally carry commitment weight and must be grounded in system data, never estimated by the model",
      "The Philippine Data Privacy Act governs account, address and consumption data used in conversations and consent for proactive outbound advisories",
      "Extreme concurrency during interruption events must be load-proven before an event is relied upon; a failure during a real interruption is worse than the status quo",
    ],
    economics: {
      volumeMonthly: 1200000,
      costPerInteraction: 0.85,
      automationRate: 0.6,
      basis: "Seller assumptions for the larger Metro Manila water concession combining steady-state billing traffic and heavy event-driven surges; validate baseline and peak volumes, cost per contact and advisory reach in discovery.",
    },
    pilotScope:
      "Automate leak-report intake and interruption-status conversations on voice and Viber for two business areas, writing dispatchable work orders and pushing status back to the reporter.",
    expansion: [
      "Add proactive account-level interruption notification with restoration estimates",
      "Add billing dispute, re-read and payment-arrangement conversations",
      "Extend to the full west-zone service area including new-connection application status",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Customer Experience",
      "Head of Network Operations / Water Distribution",
      "Chief Information Officer",
      "Head of Corporate Communications",
    ],
    discovery: [
      "How many contacts does a single major interruption generate, and across which channels?",
      "What proportion of leak reports currently result in a dispatch the reporter is told about?",
      "Is your hotline outsourced today, and what does the contract allow you to change?",
      "Can work orders be created programmatically from an authenticated conversational channel?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A resident in Las Pinas reports a burst street main on Viber with the location pinned, gets a work-order reference, and receives restoration updates without calling again.",
  },

  "aboitizpower": {
    operatingContext:
      "AboitizPower is the power arm of the Aboitiz group, combining a large generation portfolio with distribution utilities that serve retail customers outside Metro Manila, including Visayan Electric in Cebu and Davao Light in Mindanao. Those distribution units carry the customer relationship: hundreds of thousands of household and business accounts each, billed monthly, calling about outages, bill amounts, disconnection notices and new connections. Critically, those customers speak Cebuano, Hiligaynon and other regional languages as their first language, while centralized support tooling and scripts are typically built for English and Tagalog. Contact arrives by hotline, business offices, social media and increasingly messaging, with weather events and typhoon season driving outage-reporting surges across island grids.",
    strategicPressure: [
      { text: "AboitizPower's distribution utilities, including Visayan Electric and Davao Light, serve large retail customer bases outside Metro Manila.", kind: "verified" },
      { text: "Regional-language customers in Cebu and Davao are poorly served by English and Tagalog support scripts, which is a service-quality gap no amount of headcount fixes.", kind: "inference" },
      { text: "Typhoon and weather-driven outages on island grids create concentrated, unpredictable reporting surges that fixed hotline capacity cannot absorb.", kind: "verified" },
      { text: "ERC regulation of distribution utilities ties customer-service performance to regulatory reporting, making resolution evidence valuable beyond CX metrics.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Buy-led. Aboitiz allocates capital with visible discipline toward generation and network assets; the distribution utilities run billing, outage management and metering systems supplied by vendors. There is no evidence of conversational or speech engineering capability inside the power group.",
    whyNotBuild:
      "The differentiating requirement is Cebuano and Hiligaynon voice quality on utility vocabulary, which almost nothing in the market handles well, combined with live outage-management grounding and work-order creation. A power company cannot build speech models for Philippine regional languages. The right to win is exactly that language coverage delivered as a governed layer over the utility's outage and billing systems.",
    workflows: [
      {
        name: "Outage reporting in regional languages",
        friction: "Customers report outages by phone in Cebuano to agents working from English and Tagalog scripts; during storm events the hotline saturates and reports are lost or duplicated.",
        outcome: "Outage reports captured accurately in the customer's own language, deduplicated against known outages, and written into outage management with restoration status pushed back.",
        channels: ["Voice", "SMS", "Messenger", "Viber"],
        systems: ["Outage management system", "Customer and account records", "GIS / feeder mapping", "Field crew dispatch"],
        value: 3, complexity: 2,
      },
      {
        name: "Billing and disconnection conversations",
        friction: "High-bill queries and disconnection notices drive business-office queues and hotline calls; agents assemble consumption history, payment records and arrears manually before they can explain anything.",
        outcome: "Consumption explained from actual meter data, payment arrangements offered within an approved matrix, and re-read requests raised in-conversation.",
        channels: ["Voice", "Messenger", "SMS", "Web chat"],
        systems: ["Billing system", "Meter data", "Payments and collections", "Credit and collections policy"],
        value: 3, complexity: 2,
      },
      {
        name: "New connection and service application status",
        friction: "Applicants for new connections and load changes visit business offices repeatedly to ask where their application stands, because there is no status channel at all.",
        outcome: "Application status answered conversationally at any hour, with document requirements explained and missing items chased proactively.",
        channels: ["Voice", "Messenger", "SMS"],
        systems: ["Customer service application system", "Work management", "Document records", "Inspection scheduling"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Distribution-utility hotlines and business offices for billing, outage and connection transactions",
        "Utility mobile apps and portals for bill viewing and payment in the larger distribution units",
        "Social media pages used for outage advisories and customer complaints",
        "SMS advisory broadcasts for scheduled maintenance interruptions",
      ],
      gaps: [
        "Customers cannot report an outage or get restoration status in Cebuano through an automated channel",
        "Storm-event reporting surges have no elastic capacity and produce duplicated, unstructured reports",
        "Payment arrangements and re-read requests still require a business-office visit or a long call",
        "New-connection applicants have no self-service status channel",
      ],
    },
    risks: [
      "Energy Regulatory Commission rules on distribution-utility customer service, disconnection notice periods and complaint handling constrain what an automated channel may commit to",
      "The Philippine Data Privacy Act governs account, address and consumption data used conversationally, including consent for proactive outage notification",
      "Cebuano and Hiligaynon speech quality on electrical and billing vocabulary is the single biggest technical risk and must be benchmarked on recorded calls from the target utility before commitment",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 0.8,
      automationRate: 0.55,
      basis: "Seller assumptions aggregating retail contact across AboitizPower distribution utilities including storm-driven surges; validate per-utility contact volumes, language mix and cost per contact in discovery.",
    },
    pilotScope:
      "Automate Cebuano-language outage reporting and restoration-status conversations for one distribution utility, writing deduplicated reports into outage management with crew dispatch remaining human-controlled.",
    expansion: [
      "Add billing, high-bill and payment-arrangement conversations for the same utility",
      "Extend to a second distribution utility with its own regional language",
      "Add new-connection application status and proactive planned-outage notification group-wide",
    ],
    stakeholders: [
      "President, Distribution Business",
      "Head of Customer Service, distribution utility",
      "Head of Network Operations",
      "Chief Information Officer, AboitizPower",
      "Regulatory Affairs Head",
    ],
    discovery: [
      "Is CX technology decided per distribution utility or centrally at AboitizPower?",
      "What share of outage reports during a storm event are duplicates of an already-known outage?",
      "What proportion of your customers would prefer to be served in Cebuano rather than English or Tagalog?",
      "Can your outage management system accept structured reports from an external authenticated channel?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A household in Cebu reports a feeder outage in Cebuano at 11pm, learns it is already known with a restoration estimate, and gets a restoration confirmation without ever reaching a human.",
  },

  "dito-telecommunity": {
    operatingContext:
      "DITO Telecommunity is the Philippines' third mobile network operator, backed by the Udenna group with China Telecom as technology partner, and it has been buying subscribers aggressively with price-led prepaid offers since launch. Its base is overwhelmingly prepaid, price-sensitive, and acquired through retail SIM sales and digital channels, which makes activation, load and promo registration the dominant service events rather than complex postpaid billing. Support runs through an app, a hotline, social media and retail partners, and coverage complaints are structurally elevated because the network is younger and thinner than the incumbents'. Every subscriber added multiplies these routine, low-value conversations while ARPU stays low enough that a human call can exceed a month of revenue.",
    strategicPressure: [
      { text: "DITO entered as the third Philippine mobile operator with a network build backed by China Telecom and Udenna group investment.", kind: "verified" },
      { text: "Heavy network capital expenditure leaves limited appetite for parallel investment in customer-service platform development.", kind: "inference" },
      { text: "Prepaid ARPU in the Philippine market is low enough that any human-handled contact destroys the economics of the account it serves.", kind: "inference" },
      { text: "As a challenger, service experience is one of the few levers available against incumbents' coverage advantage, making cheap high-quality support strategically valuable.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. DITO has genuine technical capability in network engineering and a technology partner in China Telecom, so it is not helpless, but its scarce engineering attention goes to network and BSS. Conversational service at low cost per contact is precisely the kind of capability a challenger sources from a partner to reach incumbent-grade CX economics quickly.",
    whyNotBuild:
      "Building would mean diverting engineering from network rollout to Tagalog speech, dialogue orchestration and evaluation, and would still take longer than the competitive window allows. China Telecom's platform preferences may cover parts of the stack but not Philippine-language conversational quality. The right to win is fast, low cost-per-contact automation that scales with subscriber acquisition rather than with headcount.",
    workflows: [
      {
        name: "Activation and SIM registration support",
        friction: "New subscribers hit activation and SIM-registration problems at the retail counter or at home, and the hotline queue at launch-promo peaks makes abandonment common; a failed activation is a lost subscriber.",
        outcome: "Guided activation and registration troubleshooting in Tagalog or English at any hour, with device and network checks resolved in-conversation and only genuine faults escalated.",
        channels: ["Voice", "Messenger", "Viber", "App", "SMS"],
        systems: ["Subscriber provisioning", "SIM registration records", "Network status", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Load, promo and data-package conversations",
        friction: "Subscribers call or message about remaining data, promo eligibility and how to register a package; these are high-frequency, low-value contacts that a human channel cannot serve profitably.",
        outcome: "Balance, promo registration and package changes completed in-conversation with in-channel top-up, at a cost per contact compatible with prepaid ARPU.",
        channels: ["Voice", "Messenger", "Viber", "SMS", "App"],
        systems: ["Prepaid billing and balance", "Promo catalogue", "Payment and top-up", "Subscriber records"],
        value: 3, complexity: 2,
      },
      {
        name: "Coverage complaint triage",
        friction: "Coverage and speed complaints arrive without location or device detail, get logged as generic tickets, and the subscriber is never told what happened, so they complain again or churn.",
        outcome: "Structured complaint capture with location and device context, checked against known network events, with feedback to the subscriber and clean data to network planning.",
        channels: ["Voice", "Messenger", "App", "Social"],
        systems: ["Network fault and performance systems", "Subscriber records", "Ticketing", "Coverage mapping"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: [
        "A self-care mobile app for balance, promo registration and account management",
        "A customer hotline and social-media support channels",
        "Retail SIM and load distribution partners who handle first-line subscriber questions",
        "SMS-based service notifications and promo communication to the prepaid base",
      ],
      gaps: [
        "Subscribers who fail activation cannot get guided troubleshooting outside hotline hours",
        "App non-users, a large share of a price-led prepaid base, have no conversational self-service path",
        "Coverage complaints produce no feedback loop to the subscriber",
        "Support cost per contact is incompatible with prepaid ARPU at the scale the growth plan implies",
      ],
    },
    risks: [
      "The SIM Registration Act imposes identity-verification obligations, so any conversational handling of registration data must meet NTC and data-privacy requirements on identity documents",
      "The Philippine Data Privacy Act and NTC consumer rules govern subscriber data, recorded calls and outbound contact, including restrictions on unsolicited marketing",
      "China Telecom's platform preferences and any group technology standards may constrain vendor selection and hosting, and must be surfaced early",
    ],
    economics: {
      volumeMonthly: 3500000,
      costPerInteraction: 0.6,
      automationRate: 0.65,
      basis: "Seller assumptions for a challenger Philippine mobile operator with a large prepaid base; validate actual contact volumes per subscriber, channel mix and current cost per contact in discovery.",
    },
    pilotScope:
      "Automate activation, SIM-registration troubleshooting and load or promo conversations on voice and Messenger for the prepaid base, with in-channel top-up and network faults escalated to operations.",
    expansion: [
      "Add coverage-complaint triage with structured capture feeding network planning",
      "Add retention and win-back conversations for lapsing prepaid subscribers",
      "Extend to home broadband and postpaid servicing as those bases grow",
    ],
    stakeholders: [
      "Chief Commercial Officer",
      "Head of Customer Experience",
      "Chief Technology Officer",
      "Head of Digital Channels",
      "Data Protection Officer",
    ],
    discovery: [
      "What is your fully loaded cost per human-handled contact against prepaid ARPU today?",
      "What share of new SIM activations fail on first attempt and require support?",
      "Does China Telecom bring platform preferences that would constrain a CX vendor decision?",
      "How many contacts per subscriber per month do you take, and where does that number go as you scale?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A new DITO subscriber whose SIM fails to activate gets guided troubleshooting on Messenger at midnight, completes registration, and loads a data promo without ever reaching the hotline.",
  },

  "2go-group": {
    operatingContext:
      "2GO Group is an SM-backed integrated shipping and logistics operator that runs passenger ferry services between Philippine islands alongside a nationwide freight, sea-air and parcel business. Its passenger customers are travellers moving between Manila, Cebu, Iloilo, Cagayan de Oro and other ports, many booking through travel agents, ticketing offices and its own online channel, while its logistics customers are shippers and consignees tracking cargo. The defining operational fact is weather: typhoons and storm signals force sailing cancellations and rescheduling with little notice, and the resulting rebooking demand hits ticketing offices and the hotline simultaneously. Cargo customers add a steady stream of tracking, delivery and documentation queries in Tagalog, Cebuano and English.",
    strategicPressure: [
      { text: "2GO operates passenger ferries and nationwide freight services across the Philippine archipelago, exposing both businesses to weather-driven disruption.", kind: "verified" },
      { text: "Typhoon-season sailing suspensions produce concentrated rebooking and refund demand that a fixed ticketing and hotline capacity cannot absorb.", kind: "verified" },
      { text: "Passenger ferry customers skew toward price-sensitive travellers who book late and often lack app familiarity, making voice and messaging the practical channels.", kind: "inference" },
      { text: "Cargo tracking questions are answerable from operational systems but reach customers only through a human, making them pure avoidable cost.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. 2GO is an asset-heavy shipping operator whose capital and management attention go to vessels, terminals and fleet utilization. Its IT function runs booking, cargo and terminal systems; there is no signal of conversational engineering capability.",
    whyNotBuild:
      "Disruption handling needs elastic capacity that exists only during storm events, plus Tagalog and Cebuano speech quality, live sailing and booking grounding, and the ability to execute a rebooking within fare rules. A shipping company will not build speech and orchestration for a capability it needs in bursts. The right to win is surge-absorbing, policy-bounded rebooking that plugs into the reservation system.",
    workflows: [
      {
        name: "Weather-disruption rebooking",
        friction: "When sailings are suspended, passengers converge on ticketing offices and the hotline at once; rebooking options are read out one by one and many passengers simply lose their trip.",
        outcome: "Affected passengers notified proactively with live alternative sailings offered and rebooking confirmed in-conversation within fare rules.",
        channels: ["Voice", "SMS", "Messenger", "Viber"],
        systems: ["Passenger reservation system", "Sailing schedule and port operations", "Payments and refunds", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Sailing schedule and booking inquiries",
        friction: "Schedule, fare and baggage questions dominate routine contact and are answered by ticketing staff who could be selling, with inconsistent answers across offices.",
        outcome: "Grounded schedule, fare and baggage answers in three languages at any hour, with booking handoff to the reservation channel.",
        channels: ["Voice", "Messenger", "Viber", "Web chat"],
        systems: ["Sailing schedule", "Fare and inventory", "Reservation system", "Terminal operations"],
        value: 2, complexity: 2,
      },
      {
        name: "Cargo tracking and delivery coordination",
        friction: "Shippers and consignees call for cargo status and delivery timing; staff check terminal and delivery systems manually, and failed deliveries are discovered only when the consignee complains.",
        outcome: "Live cargo status and delivery-window coordination handled conversationally, with proactive notification when a shipment is delayed or ready for collection.",
        channels: ["Voice", "SMS", "Viber", "Web chat"],
        systems: ["Cargo and freight management", "Terminal operations", "Last-mile delivery", "Billing"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "An online booking channel and ticketing offices for passenger reservations",
        "A customer hotline covering passenger and cargo queries",
        "Social media channels used for sailing advisories during weather disruptions",
        "A cargo tracking facility for shippers and consignees on the freight side",
      ],
      gaps: [
        "Passengers cannot rebook a cancelled sailing without reaching a human",
        "There is no proactive account-level notification when a specific booking is affected",
        "Cargo status questions require a person to look up multiple operational systems",
        "Disruption surges have no elastic capacity, so service collapses exactly during storm season",
      ],
    },
    risks: [
      "MARINA and Philippine consumer-protection rules on passenger rights, refunds and rebooking constrain what an automated channel may offer; fare-rule bounding must be exact",
      "The Philippine Data Privacy Act governs passenger manifests, contact details and consignee data used conversationally, including consent for proactive messaging",
      "Reservation-system integration depth is the make-or-break dependency; if rebooking cannot be written back, the workflow degrades to advisory only",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 0.9,
      automationRate: 0.5,
      basis: "Seller assumptions combining passenger and cargo contact for a Philippine shipping and logistics operator with heavy seasonal peaks; validate baseline and storm-season volumes and cost per contact in discovery.",
    },
    pilotScope:
      "Automate disruption notification and sailing-status conversations on SMS and Messenger for passengers on two major routes, with rebooking executed in the reservation system where fare rules permit.",
    expansion: [
      "Add full self-service rebooking and refund-status conversations across all passenger routes",
      "Add cargo tracking and delivery-window coordination for freight customers",
      "Extend to Cebuano and other regional languages with proactive collection-ready notifications",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Passenger Business",
      "Head of Logistics / Freight",
      "Chief Information Officer",
      "Head of Customer Experience",
    ],
    discovery: [
      "When a storm signal suspends sailings, how many passengers need rebooking and how long does the queue run?",
      "Can your reservation system accept a rebooking written by an authenticated external channel?",
      "What share of cargo contacts are pure status checks answerable from your own systems?",
      "How do you currently reach passengers who booked through a travel agent rather than directly?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A family booked on a suspended Manila-Cebu sailing gets an SMS with two alternative departures and rebooks in one exchange instead of queueing at the pier ticketing office.",
  },

  "lbc-express": {
    operatingContext:
      "LBC Express is one of the most recognized Filipino courier and remittance brands, running a large domestic branch network for parcels, documents and money transfer, plus an international operation serving overseas Filipino workers who send balikbayan boxes and remittances home. Its most distinctive flow is the balikbayan box: a sea-freight consignment sent from Dubai, Hong Kong, Singapore, Italy or North America that takes weeks to arrive, generating anxious tracking questions from a sender abroad and a recipient at home in different time zones. Domestic parcel and cargo customers add standard where-is-my-order traffic, while remittance customers ask about payout status and claim requirements. Contact reaches branches, a hotline, social media and messaging, with most enquiries answerable from operational systems but only through a human today.",
    strategicPressure: [
      { text: "LBC operates both a courier network and a remittance business serving overseas Filipino workers and their families.", kind: "verified" },
      { text: "Sea-freight balikbayan boxes have long transit times with sparse tracking events, which structurally generates repeat status contacts from two parties per shipment.", kind: "inference" },
      { text: "Senders abroad contact during their waking hours in Gulf, East Asian and North American time zones, which a Manila business-hours support model cannot cover.", kind: "inference" },
      { text: "Competition from digital remittance players and newer couriers raises the cost of a poor tracking experience on the brand's core emotional promise.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. LBC is an operations-led, family-rooted logistics and financial-services business whose technology spend goes to branch systems, tracking and remittance platforms. There is no evidence of speech or conversational engineering capability, and the workload is a textbook packaged-automation case.",
    whyNotBuild:
      "The requirement is multi-time-zone, multi-language conversational coverage grounded in live shipment and remittance systems, with authentication strong enough for financial queries. Building that means speech, orchestration, identity and evaluation work no courier will staff. The right to win is a single conversational layer serving sender and recipient across time zones from the same shipment record.",
    workflows: [
      {
        name: "Balikbayan box tracking across time zones",
        friction: "Senders abroad and recipients at home both chase the same shipment; sea-freight tracking events are sparse, so agents repeat the same non-answer and the customer calls again next week.",
        outcome: "Both parties get grounded status with realistic transit expectations in their own hours and language, plus proactive updates at each real milestone.",
        channels: ["Voice", "Viber", "Messenger", "WhatsApp", "SMS"],
        systems: ["Shipment tracking", "International freight consolidation records", "Customs status", "Customer records"],
        value: 3, complexity: 2,
      },
      {
        name: "Domestic parcel delivery coordination",
        friction: "Failed deliveries and address problems are discovered only when the rider fails; rescheduling requires a branch call and the parcel often returns to origin.",
        outcome: "Proactive delivery-window confirmation and in-conversation rescheduling or address correction, cutting failed deliveries and return-to-origin cost.",
        channels: ["Voice", "SMS", "Viber", "Messenger"],
        systems: ["Parcel tracking", "Last-mile dispatch", "Branch operations", "Payments and COD"],
        value: 3, complexity: 2,
      },
      {
        name: "Remittance payout status and requirements",
        friction: "Recipients ask whether money has arrived, which branch can pay it out and what identification is needed; wrong answers mean a wasted trip to a branch by someone who may have travelled far.",
        outcome: "Authenticated payout status, branch availability and documentation requirements answered conversationally before the recipient travels.",
        channels: ["Voice", "Viber", "SMS", "Messenger"],
        systems: ["Remittance platform", "Branch network and cash availability", "KYC and identity records", "Compliance screening"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: [
        "Online and app-based shipment tracking for domestic and international consignments",
        "A large branch network where staff handle tracking, remittance payout and customer queries in person",
        "A customer hotline plus active social-messaging channels used for tracking complaints",
        "SMS notifications for certain shipment and remittance events",
      ],
      gaps: [
        "Senders abroad have no live support channel during their own waking hours",
        "Sea-freight tracking gaps are never explained, so customers interpret silence as a lost box",
        "Failed deliveries cannot be rescheduled in-conversation before the parcel returns to origin",
        "Remittance recipients cannot confirm payout readiness and documentation before travelling to a branch",
      ],
    },
    risks: [
      "Remittance conversations fall under BSP rules for money service businesses, including KYC, anti-money-laundering screening and strict authentication before any account-specific disclosure",
      "The Philippine Data Privacy Act plus foreign privacy regimes apply because senders are physically abroad, raising cross-border data-handling questions for international conversations",
      "Customs and international freight status data is often coarse and delayed; over-promising precision conversationally would worsen trust rather than improve it",
    ],
    economics: {
      volumeMonthly: 1600000,
      costPerInteraction: 0.85,
      automationRate: 0.6,
      basis: "Seller assumptions combining domestic parcel, international balikbayan and remittance contact for a large Philippine courier; validate contact volumes per shipment, international-versus-domestic split and cost per contact in discovery.",
    },
    pilotScope:
      "Automate balikbayan box tracking conversations on Viber and voice for shipments originating in two overseas corridors, serving both sender and recipient with proactive milestone updates.",
    expansion: [
      "Add domestic parcel delivery-window confirmation and in-conversation rescheduling",
      "Add authenticated remittance payout status and documentation guidance",
      "Extend to all overseas corridors with local-hour coverage and regional Philippine languages",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of International Business",
      "Head of Money Transfer / Remittance",
      "Chief Information Officer",
      "Head of Customer Experience",
    ],
    discovery: [
      "How many tracking contacts does a single balikbayan box generate across sender and recipient?",
      "What is your return-to-origin rate on domestic parcels and what does each cost you?",
      "What authentication standard would compliance require before an automated channel discloses remittance status?",
      "Which overseas corridors generate the most inbound contact outside Philippine business hours?",
    ],
    flowTemplate: "order-logistics",
    scenario: "An OFW in Dubai and her mother in Iloilo both track the same balikbayan box on Viber in their own hours, and get a real milestone update at consolidation, sailing and customs release.",
  },

  "golden-arches": {
    operatingContext:
      "Golden Arches Development Corporation is the master franchisee operating McDonald's in the Philippines, running hundreds of restaurants across company-operated and sub-franchised formats with dine-in, drive-thru, takeout and a substantial McDelivery business. Delivery reaches customers through its own app and delivery hotline as well as third-party aggregator platforms, which means order problems arrive through multiple channels with different data behind them. The customer conversations that matter are delivery-order issues: missing items, late or undelivered orders, wrong orders and refund requests, all concentrated in narrow meal-time peaks. Store feedback, promo questions and party-booking enquiries add a steady secondary load, while operating standards and brand rules come from the global McDonald's system.",
    strategicPressure: [
      { text: "Golden Arches operates McDonald's in the Philippines as master franchisee, which means customer-facing technology must fit within McDonald's global system standards.", kind: "verified" },
      { text: "McDelivery is a material part of the business and generates order-exception contacts at a rate dine-in never produced.", kind: "inference" },
      { text: "Contact volume is compressed into lunch and dinner peaks, so average staffing is either wasteful or inadequate but never right.", kind: "inference" },
      { text: "Aggregator-sourced orders split the customer relationship and the data, making a consistent resolution experience hard to deliver.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A franchisee's capital goes to restaurants and equipment, and its technology choices operate within the franchisor's approved architecture. Golden Arches integrates and deploys technology; it does not build customer-facing platforms.",
    whyNotBuild:
      "Resolving a delivery complaint conversationally requires live order grounding, refund authority bounded by policy, Tagalog and Taglish conversational quality, and evaluation to keep goodwill spend controlled. No restaurant operator builds that, and the franchisor would not approve a bespoke local build anyway. The right to win is packaged, policy-bounded order resolution that integrates with the delivery stack the franchisor already sanctions.",
    workflows: [
      {
        name: "Delivery order issue resolution",
        friction: "Missing-item, late-order and wrong-order complaints arrive at peak by hotline, app and social; agents check the order system, contact the store, and refunds require supervisor approval, so the customer waits through a hungry hour.",
        outcome: "Order verified against live data, resolution applied within an approved goodwill matrix in-conversation, and exceptions escalated with full context.",
        channels: ["Voice", "App", "Messenger", "Viber"],
        systems: ["Order management", "Delivery dispatch", "Payments and refunds", "Store operations"],
        value: 3, complexity: 2,
      },
      {
        name: "Delivery hotline order-taking support",
        friction: "The delivery hotline still takes orders by voice at peak, with hold times and abandoned orders exactly when demand is highest.",
        outcome: "Order capture and menu, promo and store-availability questions handled conversationally at peak with orders passed cleanly to the fulfilment system.",
        channels: ["Voice", "Messenger", "App"],
        systems: ["Menu and promo catalogue", "Store availability", "Order management", "Payments"],
        value: 2, complexity: 2,
      },
      {
        name: "Store feedback and complaint intake",
        friction: "Restaurant-level complaints arrive across social media, feedback forms and calls, get triaged manually, and patterns per store surface only in periodic reports.",
        outcome: "Structured complaint capture routed to the right restaurant with severity classification, and per-store defect patterns surfaced to operations weekly.",
        channels: ["Voice", "Messenger", "Web form", "Social"],
        systems: ["Customer feedback system", "Store operations", "Quality and compliance records", "CRM"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: [
        "A McDelivery mobile app and website with order tracking",
        "A delivery hotline that still takes and services orders by voice",
        "Third-party aggregator platforms carrying a share of delivery orders and their own support flows",
        "Social media and feedback channels for restaurant-level complaints",
      ],
      gaps: [
        "Customers cannot get a refund or goodwill resolution decided inside the first conversation",
        "Peak-hour contact capacity does not flex with the meal-time demand curve",
        "Aggregator-sourced order issues cannot be resolved by the brand's own channel",
        "Complaint patterns per restaurant are not surfaced quickly enough to change operations",
      ],
    },
    risks: [
      "McDonald's global system standards govern customer-facing technology, data handling and brand voice, so franchisor approval is a gating dependency for any deployment",
      "The Philippine Data Privacy Act applies to order histories, delivery addresses and payment references used in conversations",
      "DTI consumer-protection rules on refunds and advertised promotions mean conversational statements about price, promo eligibility and refunds must be grounded in live policy",
    ],
    economics: {
      volumeMonthly: 1400000,
      costPerInteraction: 0.75,
      automationRate: 0.6,
      basis: "Seller assumptions for a large Philippine QSR delivery operation with peaked demand; validate delivery order volumes, contact rate per order and current cost per contact in discovery.",
    },
    pilotScope:
      "Automate McDelivery order-issue resolution on voice and Messenger for orders placed through the brand's own channels, with goodwill and refunds bounded by an approved matrix and exceptions escalated.",
    expansion: [
      "Add delivery hotline order-taking and menu or promo conversations at peak",
      "Add structured store feedback and complaint intake with per-restaurant pattern reporting",
      "Extend to aggregator-sourced order issues where platform data sharing allows",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Delivery / Off-Premise Business",
      "Head of Customer Experience",
      "Chief Information Officer",
      "Head of Marketing",
    ],
    discovery: [
      "What share of delivery orders generate a customer contact, and what does each cost you fully loaded?",
      "What refund or goodwill authority could an automated channel exercise without supervisor approval?",
      "What does McDonald's global system require before you deploy a customer-facing AI vendor?",
      "How much of your delivery volume comes through aggregators versus your own app and hotline?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A customer in Pasig whose McDelivery order arrived without the fries gets it verified against the order record and a refund applied in one Messenger exchange, at 8pm on a Friday.",
  },

  "shakeys-pizza": {
    operatingContext:
      "Shakey's Pizza Asia Ventures is a listed Philippine restaurant group operating the Shakey's pizza chain alongside Potato Corner and Peri-Peri Charcoal Chicken, combining full-service restaurants, kiosks and a meaningful delivery and carryout business. Its delivery orders come through a hotline, its own app and website, and aggregator platforms, with the SuperCard loyalty programme tying repeat customers to a member identity and discount entitlements. Conversational demand concentrates in evening and weekend peaks: order-taking on the hotline, delivery issue resolution, loyalty and voucher questions, and party or bulk-order enquiries that are commercially valuable but handled ad hoc. Because the group spans multiple brands with different ordering paths, the customer's route to a resolution depends on which brand they ordered from.",
    strategicPressure: [
      { text: "Shakey's Pizza Asia Ventures operates multiple restaurant brands including Shakey's, Potato Corner and Peri-Peri in the Philippines.", kind: "verified" },
      { text: "A meaningful share of delivery orders in this segment still arrives by phone, making hotline capacity a direct revenue constraint at peak.", kind: "inference" },
      { text: "The SuperCard loyalty programme creates an identity anchor that could authenticate conversational servicing but is currently used mainly at point of sale.", kind: "inference" },
      { text: "Aggregator dependence erodes margin, so shifting orders back to owned channels has direct economic value if those channels can absorb the volume.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A listed restaurant operator's capital goes to store rollout and brand acquisition; technology spend is on POS, ordering and loyalty systems from vendors. There is no software-engineering culture capable of building conversational infrastructure.",
    whyNotBuild:
      "Hotline order-taking automation demands Tagalog and Taglish voice quality on menu vocabulary, live store and menu availability grounding, loyalty recognition and payment handling, plus evaluation to catch order errors before they reach a kitchen. A restaurant group will never staff that. The right to win is packaged order-taking and issue-resolution automation with proven peak-hour behaviour.",
    workflows: [
      {
        name: "Hotline order-taking with loyalty recognition",
        friction: "Evening peak calls queue or abandon; each order is transcribed by a human who must check store availability and apply loyalty discounts manually, and errors reach the kitchen.",
        outcome: "Orders captured conversationally with the caller recognized by number, loyalty entitlements applied automatically, and the order written cleanly into the ordering system.",
        channels: ["Voice", "Messenger", "Viber"],
        systems: ["Order management", "Menu and store availability", "Loyalty platform", "Payments"],
        value: 3, complexity: 2,
      },
      {
        name: "Delivery issue resolution",
        friction: "Late, missing-item and wrong-order complaints hit at peak; resolution needs a store call and supervisor approval for any goodwill, so the customer waits or gives up and posts publicly.",
        outcome: "Order verified against live data with resolution applied inside an approved goodwill matrix, and exceptions escalated with the full transcript.",
        channels: ["Voice", "Messenger", "App", "Social"],
        systems: ["Order management", "Delivery dispatch", "Payments and refunds", "Store operations"],
        value: 3, complexity: 2,
      },
      {
        name: "Party and bulk-order enquiries",
        friction: "Group bookings, party packages and bulk orders arrive by phone and social and are handled by whoever answers, so pricing and availability answers are inconsistent and leads leak.",
        outcome: "Qualified party and bulk enquiries captured with requirements, priced from the approved catalogue, and booked or routed to the right restaurant with full context.",
        channels: ["Voice", "Messenger", "Web chat"],
        systems: ["Catering and party package catalogue", "Store capacity and reservations", "CRM", "Payments"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A delivery hotline and brand ordering apps and websites",
        "The SuperCard loyalty programme with member identity and discount entitlements",
        "Aggregator platform presence carrying a share of delivery volume",
        "Social media pages used for order complaints and promo communication",
      ],
      gaps: [
        "Peak-hour hotline capacity constrains orders the business could otherwise take",
        "Loyalty entitlements are not recognized automatically in phone and messaging conversations",
        "Delivery complaints cannot be resolved with a goodwill decision inside the first contact",
        "Party and bulk enquiries have no structured capture, so leads are lost to whoever answers",
      ],
    },
    risks: [
      "DTI consumer-protection and advertising rules mean conversationally quoted prices, promo eligibility and delivery commitments must match live system truth",
      "The Philippine Data Privacy Act governs loyalty member data, order histories and delivery addresses used in conversations",
      "Menu, price and availability differ by store and brand; ungrounded answers would create order failures at the kitchen, so live integration is a hard prerequisite rather than a phase-two nicety",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 0.8,
      automationRate: 0.55,
      basis: "Seller assumptions for a multi-brand Philippine restaurant group with hotline and delivery contact; validate the share of orders still arriving by phone, peak abandonment rate and cost per contact in discovery.",
    },
    pilotScope:
      "Automate evening-peak hotline order-taking for the Shakey's brand in Metro Manila with loyalty recognition and live store availability, escalating any non-standard order to a human.",
    expansion: [
      "Add delivery issue resolution with a bounded goodwill matrix across brands",
      "Add party and bulk-order enquiry capture and booking",
      "Extend to Potato Corner and Peri-Peri ordering and to proactive loyalty and promo conversations",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Delivery and Digital Channels",
      "Brand General Manager, Shakey's",
      "Chief Information Officer",
      "Head of Marketing / Loyalty",
    ],
    discovery: [
      "What share of delivery orders still arrives by phone, and what is your peak-hour abandonment rate?",
      "What is the average value of an order lost to an unanswered call at 7pm on a Friday?",
      "Can your ordering system accept an order written by an authenticated conversational channel?",
      "Is customer care centralized across brands or run separately by each?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A customer calling the Shakey's hotline at Friday peak is recognized by number, gets her SuperCard discount applied automatically, and completes the order without ever hearing hold music.",
  },

  "maxs-group": {
    operatingContext:
      "Max's Group operates a portfolio of Filipino casual-dining and quick-service brands including Max's Restaurant, Pancake House and Yellow Cab, spanning company-operated restaurants and a franchise network across the Philippines and selected overseas markets. Its customer base is family-oriented dine-in traffic plus a delivery and takeout business that has grown into a material channel, with Max's carrying a distinctive occasion business of party trays, fiesta bundles and celebration bookings. Conversations therefore split three ways: delivery order issues, party and bulk-order enquiries that are genuinely revenue-generating, and franchisee support queries about supply, marketing and operational standards. Contact arrives at brand hotlines, social pages, aggregator platforms and individual restaurants, with no single front door.",
    strategicPressure: [
      { text: "Max's Group operates multiple Filipino restaurant brands including Max's Restaurant, Pancake House and Yellow Cab through company-operated and franchised outlets.", kind: "verified" },
      { text: "Party and bulk-order enquiries are high-value conversations handled by whoever answers the phone, which makes conversion dependent on staffing luck.", kind: "inference" },
      { text: "Franchisees form a second support audience whose queries compete with customers for the same limited head-office attention.", kind: "inference" },
      { text: "Brand-fragmented ordering paths mean a customer problem routes differently depending on which brand they used, producing inconsistent experience across one group.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Restaurant groups allocate capital to store rollout, brand investment and supply chain; their technology function integrates POS, ordering and loyalty vendors. There is no engineering base for conversational platform development.",
    whyNotBuild:
      "Occasion-order capture and delivery resolution need Tagalog conversational quality, live menu and capacity grounding across brands, policy-bounded goodwill, and franchisee entitlement awareness. That is a platform problem, not a restaurant problem. The right to win is one conversational front door that works across brands where the underlying ordering systems do not.",
    workflows: [
      {
        name: "Party and bulk-order capture",
        friction: "Celebration and party-tray enquiries come by phone and social message and are handled ad hoc; pricing, lead time and store capacity answers vary, and enquiries that arrive after hours are simply lost.",
        outcome: "Structured occasion-order capture with grounded pricing and lead times, capacity checked against the right restaurant, and confirmed bookings written into the system at any hour.",
        channels: ["Voice", "Messenger", "Viber", "Web chat"],
        systems: ["Catering and party package catalogue", "Store capacity and reservations", "Order management", "Payments"],
        value: 3, complexity: 2,
      },
      {
        name: "Delivery order support",
        friction: "Missing items, late deliveries and wrong orders across three brands land in different places; resolution requires calling the restaurant and getting approval for any refund.",
        outcome: "One front door verifies the order against live data and resolves within an approved goodwill matrix regardless of brand, escalating exceptions with context.",
        channels: ["Voice", "Messenger", "App", "Social"],
        systems: ["Order management", "Delivery dispatch", "Payments and refunds", "Restaurant operations"],
        value: 2, complexity: 2,
      },
      {
        name: "Franchisee support desk",
        friction: "Franchisees phone and email head office about supply orders, marketing collateral, operating standards and system issues, and answers depend on which manager is reachable.",
        outcome: "Franchisees self-serve supply status, standards and marketing questions in-channel, with commercial exceptions escalated to franchise managers with full context.",
        channels: ["Voice", "Viber", "Email", "Web chat"],
        systems: ["Franchise management records", "Supply chain and ordering", "Marketing asset library", "Operations standards documentation"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Brand-level delivery hotlines and ordering websites or apps",
        "Aggregator platform presence carrying a significant share of delivery volume",
        "Social media pages per brand used for orders, complaints and promos",
        "A franchise support function serving franchisees by phone and email",
      ],
      gaps: [
        "Party and bulk-order enquiries received outside business hours are not captured at all",
        "There is no single conversational front door across the brand portfolio",
        "Delivery goodwill decisions cannot be made inside the first contact",
        "Franchisees have no self-service route for routine supply and standards questions",
      ],
    },
    risks: [
      "DTI consumer-protection rules require that conversationally quoted prices, promo terms and delivery commitments match live system truth across every brand",
      "The Philippine Data Privacy Act applies to customer order histories, delivery addresses and franchisee business data handled conversationally",
      "Franchise agreements may constrain what a head-office channel can commit on behalf of a franchised restaurant, so authority boundaries must be defined before launch",
    ],
    economics: {
      volumeMonthly: 300000,
      costPerInteraction: 0.8,
      automationRate: 0.5,
      basis: "Seller assumptions for a multi-brand Philippine restaurant group combining consumer and franchisee contact; validate order and enquiry volumes by brand and current cost per contact in discovery.",
    },
    pilotScope:
      "Automate party and bulk-order enquiry capture for Max's Restaurant on voice and Messenger, with grounded pricing, live store capacity checks and confirmed bookings written into the ordering system.",
    expansion: [
      "Add delivery order support with a bounded goodwill matrix across all three brands",
      "Add the franchisee support desk for supply, marketing and standards queries",
      "Extend to proactive occasion marketing and reservation conversations for peak seasons",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Delivery and Digital",
      "Head of Franchise Operations",
      "Chief Information Officer",
      "Brand Marketing Head",
    ],
    discovery: [
      "How many party and bulk enquiries arrive per month, and what share convert today?",
      "Is customer care centralized across Max's, Pancake House and Yellow Cab or run per brand?",
      "What authority does head office have to resolve an issue at a franchised restaurant?",
      "How many franchisee support contacts per month could be answered from existing systems?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A customer planning a birthday calls Max's at 9pm, gets party-tray pricing and lead times grounded in the live catalogue, and has the order confirmed at her nearest branch.",
  },

  "ayala-land": {
    operatingContext:
      "Ayala Land is the Philippines' premier property developer, selling residential product across a deliberate brand ladder from Ayala Land Premier through Alveo, Avida and Amaia, alongside estates, malls, offices and hotels. Residential buyers commit to long amortization schedules measured in years, and a substantial share are overseas Filipino workers purchasing from Dubai, Singapore, Hong Kong or North America and paying from abroad. That produces a conversational relationship that starts with a lead enquiry where response speed determines conversion, continues through reservation and documentation, and then runs for a decade of amortization queries, statement requests, turnover scheduling and property-management service requests. Contact today runs through sales agents and brokers, brand hotlines, buyer portals and property-management desks, with the buyer experiencing several disconnected front doors.",
    strategicPressure: [
      { text: "Ayala Land sells residential product across multiple brand tiers with long amortization periods and a significant overseas Filipino buyer base.", kind: "verified" },
      { text: "Speed to first response is the dominant controllable variable in residential lead conversion, and most enquiries arrive outside the hours when brokers respond.", kind: "inference" },
      { text: "Overseas buyers transact and query in time zones a Manila sales and servicing organization does not cover, making conversion and servicing structurally leaky.", kind: "inference" },
      { text: "Post-sale amortization, turnover and property-management contacts accumulate for years per unit sold, so servicing load grows with cumulative sales rather than annual sales.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. The Ayala group has real technology capability and a history of serious digital investment, so this is not a helpless buyer. But customer-conversation platforms sit outside the developer's core competence in land, design and construction, and Ayala Land's pattern is to deliver customer-facing capability with technology partners rather than building it inside the property business.",
    whyNotBuild:
      "Even a capable group would have to assemble Tagalog and English speech quality, multi-time-zone orchestration, integration across sales, collections and property-management systems, and an evaluation regime that keeps pricing and availability statements accurate under consumer-protection scrutiny. That is a platform programme with no strategic return for a developer. The right to win is partner-delivered conversational capacity that turns a fragmented buyer journey into one instrumented thread.",
    workflows: [
      {
        name: "Speed-to-lead qualification",
        friction: "Enquiries from portals, campaigns and walk-ins land in broker inboxes and spreadsheets; response takes hours or days, arrives in Manila office hours, and overseas buyers are effectively unserved.",
        outcome: "Every enquiry engaged within minutes in the buyer's language and time zone, qualified on a structured rubric, with hot leads routed live to a seller and the rest nurtured automatically.",
        channels: ["Voice", "WhatsApp", "Viber", "Messenger", "Web chat"],
        systems: ["CRM and lead management", "Inventory and pricing", "Broker and agent assignment", "Marketing automation"],
        value: 3, complexity: 2,
      },
      {
        name: "Amortization and account servicing",
        friction: "Buyers ask about outstanding balances, payment schedules, statements of account and penalty computations; each answer requires a human pulling from collections systems during office hours only.",
        outcome: "Authenticated buyers get balance, schedule and statement answers in-conversation at any hour, with payment links and arrangement requests routed within policy.",
        channels: ["Voice", "Viber", "WhatsApp", "Portal chat"],
        systems: ["Buyer accounts and collections", "Payment gateway", "Document generation", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Turnover scheduling and resident service requests",
        friction: "Turnover appointments, punchlist follow-ups and post-turnover maintenance requests are coordinated by phone and email per project, so status is opaque and follow-through inconsistent.",
        outcome: "Turnover slots booked conversationally, punchlist items logged and tracked, and property-management service requests raised with status pushed back to the resident.",
        channels: ["Voice", "Viber", "WhatsApp", "App"],
        systems: ["Turnover and handover scheduling", "Property management work orders", "Buyer records", "Facilities dispatch"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: [
        "Brand websites and lead-capture forms feeding a broker and in-house sales network",
        "A buyer portal and app for statements of account and payment",
        "Property-management offices and hotlines serving residents in completed estates",
        "Active social and messaging channels used by brokers for buyer communication",
      ],
      gaps: [
        "Enquiries received outside office hours or from overseas time zones get no immediate qualified response",
        "Buyers cannot get an authenticated amortization or penalty answer conversationally",
        "Turnover and punchlist status is not visible to the buyer without chasing a coordinator",
        "Lead handling quality varies by broker with no consistent qualification rubric or measurement",
      ],
    },
    risks: [
      "DHSUD and consumer-protection rules governing real-estate selling, disclosure and reservation terms constrain what an automated channel may state about price, availability and buyer obligations",
      "The Philippine Data Privacy Act applies to buyer financial data and overseas contact details, with cross-border considerations for OFW buyers served abroad",
      "Brokers are commercially incentivized owners of the buyer relationship, so any automated engagement must be designed with, not around, the broker network or it will be bypassed",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 1.1,
      automationRate: 0.5,
      basis: "Seller assumptions combining lead-stage enquiries and post-sale servicing across Ayala Land residential brands; validate monthly lead volume, cumulative buyer servicing contacts and cost per contact in discovery.",
    },
    pilotScope:
      "Automate speed-to-lead engagement and qualification for one residential brand across WhatsApp, Viber and voice, covering overseas buyer time zones, with qualified leads handed live to sellers.",
    expansion: [
      "Add authenticated amortization and statement-of-account servicing for existing buyers",
      "Add turnover scheduling and punchlist tracking for projects reaching handover",
      "Extend to property-management service requests across completed estates and to all residential brands",
    ],
    stakeholders: [
      "Head of Residential Business",
      "Chief Marketing Officer / Head of Sales",
      "Head of Customer Experience",
      "Chief Information Officer / Group Digital Head",
      "Head of Property Management",
    ],
    discovery: [
      "What is your median time to first meaningful response on an inbound residential enquiry?",
      "How much of your buyer base pays from overseas, and how do you serve their time zones today?",
      "Is lead handling centralized or does each residential brand run its own funnel?",
      "How many post-sale servicing contacts does a single unit generate across its amortization period?",
    ],
    flowTemplate: "lead-sales",
    scenario: "An OFW nurse in Dubai enquiring about an Avida unit at 2am Manila time is engaged in minutes on WhatsApp, qualified on budget and timeline, and booked onto a seller's calendar in her own evening.",
  },

  "sm-prime": {
    operatingContext:
      "SM Prime Holdings is the Philippines' largest mall operator, running dozens of SM Supermalls nationwide plus a China portfolio, and it also houses SMDC, one of the country's highest-volume residential developers selling compact condominium units to mass-market and overseas Filipino buyers. The mall business generates tenant-facing conversations about lease, billing, fit-out and operations alongside shopper enquiries about hours, events, parking and services. The residential business generates a far heavier and more sustained load: reservation processing, amortization and statement queries, documentation chasing, and turnover scheduling stretched across years per unit, much of it from buyers working abroad. Contact runs through mall administration offices, SMDC sales agents and buyer-care hotlines, and social channels, with the buyer relationship spread across sales, collections and property management.",
    strategicPressure: [
      { text: "SM Prime operates the largest Philippine mall portfolio and, through SMDC, one of the highest-volume residential development pipelines in the country.", kind: "verified" },
      { text: "SMDC's high unit volume means post-sale servicing contacts accumulate faster than for premium developers with fewer, larger units.", kind: "inference" },
      { text: "A significant share of SMDC buyers are overseas Filipino workers paying amortizations from abroad, creating time-zone-mismatched servicing demand.", kind: "inference" },
      { text: "Amortization delinquency and documentation delays are servicing problems that become cash-collection problems if conversations do not happen on time.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. SM Prime is a scale-first operator of malls and residential projects; its technology function runs leasing, property and buyer-account systems, and group procurement favours established vendors. There is no signal of conversational-platform engineering inside the property business.",
    whyNotBuild:
      "Buyer servicing at SMDC volumes needs authenticated conversational access to collections and documentation systems, multi-time-zone coverage, Tagalog and English quality, and policy-bounded payment arrangements. Building that would compete with a construction pipeline for capital and attention. The right to win is packaged automation that lifts collection-relevant conversations and turnover coordination off a stretched buyer-care team.",
    workflows: [
      {
        name: "Amortization and statement conversations",
        friction: "Buyers call buyer care for outstanding balances, due dates, penalty computations and statements of account; the queue is long, overseas buyers cannot reach it in their hours, and missed conversations become missed payments.",
        outcome: "Authenticated buyers get balance, schedule and penalty answers any hour with in-channel payment links, and arrangement requests routed within an approved matrix.",
        channels: ["Voice", "Viber", "WhatsApp", "Portal chat"],
        systems: ["Buyer accounts and collections", "Payment gateway", "Document generation", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Documentation chasing and reservation completion",
        friction: "Reservations stall on missing documents nobody chases systematically, so units sit unconverted and buyers assume everything is fine until a deadline passes.",
        outcome: "Outstanding documents chased proactively in-channel with requirements explained, and completion status visible to both buyer and sales team.",
        channels: ["Voice", "Viber", "WhatsApp", "Email"],
        systems: ["Sales and reservation system", "Document management", "Credit and eligibility checks", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Turnover scheduling and mall tenant queries",
        friction: "Turnover appointments are coordinated per project by phone, while mall tenants separately chase administration offices for billing, fit-out and operations questions, both with no tracked status.",
        outcome: "Turnover slots booked conversationally with preparation guidance, and tenant queries answered or raised as tracked work items with status pushed back.",
        channels: ["Voice", "Viber", "Email", "Web chat"],
        systems: ["Turnover scheduling", "Property and facilities management", "Tenant billing and leasing records", "Work orders"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "An SMDC buyer portal and hotline for statements of account and payment",
        "A large sales agent and broker network handling buyer communication",
        "Mall administration offices serving tenants for leasing, billing and operations",
        "Social media and messaging channels used for shopper and buyer enquiries",
      ],
      gaps: [
        "Overseas buyers cannot reach an authenticated servicing channel during their waking hours",
        "Missing reservation documents are not chased systematically, so conversions leak silently",
        "Payment arrangements require a human conversation that many delinquent buyers never have",
        "Turnover and tenant service requests produce no tracked status the requester can follow",
      ],
    },
    risks: [
      "DHSUD rules and the Maceda Law govern buyer rights, notices and cancellation in Philippine residential sales, so anything an automated channel says about arrears, penalties or cancellation carries legal weight",
      "The Philippine Data Privacy Act applies to buyer financial and identity data, with cross-border handling considerations for OFW buyers contacted abroad",
      "Collections-adjacent outbound contact must respect consumer-protection expectations on frequency, timing and tone; hardship signals must route to humans",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 0.95,
      automationRate: 0.55,
      basis: "Seller assumptions combining SMDC buyer servicing and mall tenant contact; validate active buyer-account counts, monthly servicing contacts and cost per contact in discovery.",
    },
    pilotScope:
      "Automate SMDC amortization, statement and payment-reminder conversations on Viber and voice for a defined project cohort including overseas time zones, with hardship cases routed to human specialists.",
    expansion: [
      "Add reservation documentation chasing and completion tracking for new sales",
      "Add turnover scheduling with preparation guidance and punchlist logging",
      "Extend to mall tenant service and billing queries across the SM Supermalls portfolio",
    ],
    stakeholders: [
      "President, SMDC / Head of Residential",
      "Head of Buyer Care / Customer Experience",
      "Head of Credit and Collections",
      "Chief Information Officer, SM Prime",
      "Head of Mall Operations",
    ],
    discovery: [
      "How is CX ownership split between SM Prime malls and SMDC residential?",
      "What share of your buyer base pays amortizations from overseas, and how do you reach them?",
      "How many reservations lapse each month because documentation was never completed?",
      "What payment-arrangement authority could an automated channel exercise under Maceda Law constraints?",
    ],
    flowTemplate: "collections",
    scenario: "An SMDC buyer working in Riyadh gets an amortization reminder on WhatsApp in her own evening, sees the exact penalty computation, and pays in-channel before the unit falls into arrears.",
  },

  "st-lukes-medical-center": {
    operatingContext:
      "St. Luke's Medical Center is the Philippines' flagship private hospital group, operating tertiary campuses in Quezon City and Bonifacio Global City with a large consultant physician community, advanced diagnostics and a substantial executive check-up business. Its patients span affluent domestic families, corporate accounts sending employees for annual physical examinations, HMO-covered members, and medical-tourism patients from overseas. Booking an appointment typically means reaching a specific doctor's clinic secretary by phone during clinic hours, which is the single most-cited friction point in Philippine private healthcare; check-up packages, diagnostics scheduling and HMO letter-of-authorization coordination pile on top. Contact arrives at hospital hotlines, individual clinic lines, a patient app or portal, and increasingly messaging channels.",
    strategicPressure: [
      { text: "St. Luke's operates two tertiary campuses in Metro Manila serving domestic, corporate and medical-tourism patients.", kind: "verified" },
      { text: "Appointment access in Philippine private hospitals is mediated by individual physician secretaries, which fragments scheduling and makes centralized automation genuinely hard.", kind: "inference" },
      { text: "HMO coverage verification sits between the patient and the appointment, so booking and authorization are one journey handled by two disconnected organizations.", kind: "inference" },
      { text: "Executive check-up and corporate wellness programmes create predictable seasonal booking waves that phone-based scheduling handles by queueing.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A premier hospital invests in clinical technology, imaging and hospital information systems; patient-experience software is procured. There is no signal of speech or conversational engineering capability, and clinical governance makes an unproven internal build unattractive.",
    whyNotBuild:
      "Appointment automation here requires live grounding in scheduling systems that physicians partly control, HMO coverage pre-verification across external payers, Tagalog and English quality on medical vocabulary, and hard guardrails preventing anything resembling clinical advice. Hospitals do not build that. The right to win is a governed booking and coordination layer that respects physician-controlled schedules and never crosses the clinical line.",
    workflows: [
      {
        name: "Appointment booking with HMO pre-verification",
        friction: "Patients call individual clinic lines during clinic hours, often unanswered, then separately confirm HMO coverage with their provider; many give up or arrive without a valid LOA.",
        outcome: "Slots offered from live schedules with HMO coverage pre-verified in the same conversation, so the patient arrives with the appointment and the authorization in place.",
        channels: ["Voice", "Viber", "App", "Web chat"],
        systems: ["Hospital scheduling system", "Physician clinic calendars", "HMO eligibility interfaces", "Patient records"],
        value: 3, complexity: 3,
      },
      {
        name: "Executive check-up and diagnostics coordination",
        friction: "Check-up package bookings require explaining inclusions, fasting and preparation requirements, and sequencing multiple diagnostics; this is done by phone, repeatedly, and preparation failures waste slots.",
        outcome: "Package inclusions explained, sequenced diagnostics booked, and preparation instructions delivered proactively with confirmation before the visit.",
        channels: ["Voice", "Viber", "SMS", "Email"],
        systems: ["Scheduling system", "Diagnostics and laboratory systems", "Package catalogue", "Corporate account records"],
        value: 3, complexity: 2,
      },
      {
        name: "Reminders, rescheduling and no-show reduction",
        friction: "Reminders are inconsistent, rescheduling means another call into another queue, and unused specialist slots are pure lost capacity.",
        outcome: "Timed reminders with one-tap reschedule, freed slots offered to waiting patients, and no-show patterns measured by clinic.",
        channels: ["Voice", "SMS", "Viber", "App"],
        systems: ["Scheduling system", "Patient records", "Physician calendars", "Notification services"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A hospital hotline and individual physician clinic lines for appointment booking",
        "A patient portal and app covering results access and some scheduling functions",
        "Corporate and executive check-up programme coordinators serving employer accounts",
        "Messaging and social channels used for general enquiries and package questions",
      ],
      gaps: [
        "Patients cannot book a specialist consultation end-to-end without reaching a clinic secretary in clinic hours",
        "HMO coverage cannot be verified in the same conversation as the booking",
        "Check-up preparation instructions are inconsistently delivered, so slots are wasted on unprepared patients",
        "There is no reliable reminder and rescheduling loop, so no-shows go unmeasured and unaddressed",
      ],
    },
    risks: [
      "The Philippine Data Privacy Act treats medical information as sensitive personal information, requiring explicit consent, tight retention and a documented lawful basis for any conversational handling",
      "Clinical safety governance requires hard guardrails: an automated channel must never triage, advise or interpret results, and every clinical signal must route to qualified staff",
      "Physician-controlled clinic schedules are the core integration risk; if consultant secretaries retain manual control of slots, automation degrades to request-taking rather than booking",
    ],
    economics: {
      volumeMonthly: 260000,
      costPerInteraction: 1.2,
      automationRate: 0.5,
      basis: "Seller assumptions for a two-campus Philippine tertiary hospital group combining appointment, diagnostics and check-up contact; validate call volumes across hospital and clinic lines and cost per contact in discovery.",
    },
    pilotScope:
      "Automate appointment booking and reminders for the executive check-up and diagnostics business on voice and Viber, with HMO coverage pre-verification where payer interfaces allow and all clinical questions escalated.",
    expansion: [
      "Extend booking to specialist consultations where physician calendars can be exposed",
      "Add reminder, rescheduling and freed-slot reallocation across both campuses",
      "Add corporate wellness account coordination and multilingual support for medical-tourism patients",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Medical Director",
      "Head of Patient Experience / Customer Service",
      "Chief Information Officer",
      "Data Protection Officer",
    ],
    discovery: [
      "What proportion of specialist appointments are booked through the hospital system versus directly with clinic secretaries?",
      "Can your scheduling system expose live slot availability to an authenticated external channel?",
      "What is your no-show rate for diagnostics and check-up appointments, and what does a wasted slot cost?",
      "Which HMOs can verify coverage electronically today, and which still require a phone call?",
    ],
    flowTemplate: "appointments",
    scenario: "A corporate patient books an executive check-up on Viber, has her HMO coverage pre-verified in the same conversation, and receives fasting instructions the night before instead of arriving unprepared.",
  },

  "acb-vietnam": {
    operatingContext:
      "ACB is one of Vietnam's leading private joint-stock commercial banks, built on a retail and SME franchise with a large card portfolio, deposit base and branch network concentrated in Ho Chi Minh City and the southern provinces. Its customers are urban salaried households, small business owners and an expanding mass-affluent segment, served through the ACB ONE mobile app, a 24/7 call centre, branches and a Zalo Official Account, since Zalo rather than WhatsApp is the default messaging channel for Vietnamese consumers. Contact concentrates on card servicing, transaction disputes, account queries and loan repayment questions, all delivered in Vietnamese with heavy regional accent variation between north and south. The bank has invested visibly in digital channels, which has shifted simple transactions to the app while leaving the harder, conversation-shaped problems on the call centre.",
    strategicPressure: [
      { text: "ACB is one of Vietnam's largest private retail banks with a substantial card and SME franchise and a sustained digital-banking investment programme.", kind: "verified" },
      { text: "Digital migration removes the easy transactions from the call centre and leaves a residue of complex, high-handle-time conversations, so cost per contact rises even as volume falls.", kind: "inference" },
      { text: "Vietnamese banking competition on retail deposits and cards makes servicing responsiveness a real acquisition and retention variable rather than a back-office metric.", kind: "inference" },
      { text: "SBV expectations on data handling and customer authentication constrain how far an automated channel can go without explicit supervisory comfort.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. ACB has genuine digital-channel investment and internal delivery capability, so it will not accept a black-box product, but it has no track record of building speech, dialogue orchestration or evaluation infrastructure. The realistic motion is partner-delivered conversational capability integrated into channels ACB continues to own.",
    whyNotBuild:
      "Vietnamese speech quality across northern and southern accents on banking vocabulary, telephony integration, live core-banking and card-system orchestration, and an evaluation regime an SBV examiner would accept are four separate specialisms. A bank that has chosen to invest in customer-facing apps will not redirect that team into speech research. The right to win is a governed conversation layer with complete interaction logging and policy-bounded actions inside ACB's own systems.",
    workflows: [
      {
        name: "Card servicing and dispute intake",
        friction: "Cardholders call to block a card, query a transaction or raise a dispute; identity is re-verified from scratch, the agent checks card and core systems separately, and disputes are logged for a back-office queue with no visible status.",
        outcome: "Identity resolved once, blocks and limit changes executed in-conversation within policy, disputes captured in structured form with status pushed proactively.",
        channels: ["Voice", "Zalo", "App", "Web chat"],
        systems: ["Card management system", "Core banking", "Dispute and chargeback workflow", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Account and transaction queries",
        friction: "Balance, transfer status, fee and statement questions dominate call volume; each requires an agent to authenticate and look up, and demand peaks at salary and holiday periods.",
        outcome: "Authenticated account and transaction answers delivered conversationally in Vietnamese any hour, with only exceptions reaching a human.",
        channels: ["Voice", "Zalo", "App", "Web chat"],
        systems: ["Core banking", "Payment and transfer systems", "Fee and product rules", "Customer records"],
        value: 3, complexity: 2,
      },
      {
        name: "Loan servicing and early-stage repayment reminders",
        friction: "Repayment reminders go out as generic SMS; genuine conversations about a missed instalment happen only when a collector has capacity, and the reason for non-payment is never captured.",
        outcome: "Policy-timed, two-way repayment conversations with live outstanding amounts, in-channel payment, and hardship signals routed to specialists.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Loan management system", "Collections workflow", "Payment gateway", "CRM"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "The ACB ONE mobile banking app covering transfers, payments and card controls",
        "A 24/7 call centre handling card, account and loan servicing",
        "A Zalo Official Account used for notifications and basic customer interaction",
        "Branch network and ATM channels for transactions requiring physical presence",
      ],
      gaps: [
        "Customers cannot complete a dispute end-to-end conversationally with visible status afterwards",
        "Zalo is used for broadcast and simple queries rather than authenticated transactional servicing",
        "Repayment conversations reach only the fraction of borrowers a collections team can call",
        "Call-centre context does not carry across from app or Zalo interactions, so customers repeat themselves",
      ],
    },
    risks: [
      "State Bank of Vietnam regulations on customer authentication, electronic banking transactions and data handling govern what an automated channel may execute without additional verification",
      "Vietnam's Personal Data Protection Decree and cybersecurity law impose consent, localization and cross-border transfer requirements that shape hosting and model-processing architecture",
      "Northern and southern Vietnamese accent variation on financial vocabulary is a genuine speech-quality risk and must be benchmarked on the bank's own recorded calls before production",
    ],
    economics: {
      volumeMonthly: 2200000,
      costPerInteraction: 0.8,
      automationRate: 0.55,
      basis: "Seller assumptions for a leading Vietnamese private retail bank across card, account and loan servicing; validate actual contact volumes, channel mix and blended cost per contact in discovery.",
    },
    pilotScope:
      "Automate card servicing and dispute intake on voice and Zalo for the retail cardholder base, with blocks and limit changes executed within policy and dispute adjudication remaining human.",
    expansion: [
      "Add authenticated account and transaction query handling across voice, Zalo and app",
      "Add early-stage repayment reminder conversations with in-channel payment",
      "Extend to SME banking servicing and to proactive fraud-alert confirmation conversations",
    ],
    stakeholders: [
      "Head of Retail Banking",
      "Head of Customer Service / Contact Centre",
      "Chief Digital Officer",
      "Chief Information Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What share of call-centre volume is card-related, and how much of it is status or dispute follow-up?",
      "What authentication does SBV guidance require before an automated channel can execute a card block or limit change?",
      "How is your Zalo Official Account used today, and can it carry authenticated transactions?",
      "What is your handle time and cost per contact now that simple transactions have moved to the app?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An ACB cardholder in Ho Chi Minh City spots an unrecognized transaction, blocks the card on Zalo in under a minute, and files the dispute in the same thread with status pushed automatically.",
  },

  "sacombank": {
    operatingContext:
      "Sacombank is one of Vietnam's larger private joint-stock banks, distinguished by an unusually extensive branch and transaction-office network reaching well beyond the major cities into provincial Vietnam. Its customer base is mass retail and small business, skewing older and more branch-dependent than the digital-first challengers, with a large deposit book and growing card and consumer-loan portfolios. Because the branch is still the default service venue for much of this base, routine servicing that other banks have digitized still consumes teller and customer-service time, and the call centre carries the overflow. The bank spent years working through a restructuring programme, which constrained discretionary technology investment and left modernization to be delivered in stages through vendors.",
    strategicPressure: [
      { text: "Sacombank operates one of the largest branch networks among Vietnam's private banks, extending into provincial markets.", kind: "verified" },
      { text: "A long restructuring period constrained discretionary technology investment and left the bank behind digital-first competitors on servicing automation.", kind: "inference" },
      { text: "A branch-dependent customer base means routine servicing lands on the most expensive channel the bank operates.", kind: "inference" },
      { text: "As restructuring concludes, cost-to-serve improvement is one of the clearest levers available to restore competitive profitability.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Years of restructuring left limited internal platform-engineering capacity, and the bank's modernization pattern has been vendor-delivered. Conversational capability at this scale is a purchase decision with a cost-to-serve business case, not an engineering project.",
    whyNotBuild:
      "Vietnamese speech across provincial accents, telephony and core-banking integration, policy-bounded transaction execution, and SBV-acceptable evaluation and logging are capabilities Sacombank has no path to building. The right to win is a packaged conversational layer that moves branch-bound routine servicing to voice and Zalo with an auditable record for every interaction.",
    workflows: [
      {
        name: "Routine servicing deflection from branches",
        friction: "Customers visit branches or call for balance, statement, card status and fee questions; tellers spend time on queries that carry no revenue, and provincial branches queue at month-end.",
        outcome: "Authenticated routine servicing completed conversationally in Vietnamese, freeing branch staff for sales and complex transactions.",
        channels: ["Voice", "Zalo", "App", "Web chat"],
        systems: ["Core banking", "Card management", "Statement and document generation", "Customer records"],
        value: 3, complexity: 2,
      },
      {
        name: "Card activation and lifecycle conversations",
        friction: "New card activation, PIN issues, blocks and limit questions are handled by the call centre with full re-authentication each time, and after-hours demand is unserved.",
        outcome: "Card lifecycle actions executed within policy at any hour with identity resolved once and every action logged.",
        channels: ["Voice", "Zalo", "App", "SMS"],
        systems: ["Card management system", "Core banking", "Authentication services", "CRM"],
        value: 2, complexity: 2,
      },
      {
        name: "Loan repayment reminders and arrangement intake",
        friction: "Repayment follow-up is SMS-broadcast plus manual calls; provincial borrowers are hard to reach in office hours and the reason for a missed payment is never recorded.",
        outcome: "Timed two-way repayment conversations with live balances, in-channel payment, and hardship or dispute signals escalated to human collectors with context.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Loan management", "Collections workflow", "Payment gateway", "Customer records"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mobile banking app and internet banking covering transfers and payments",
        "A national call centre supporting card and account servicing",
        "An extensive branch and transaction-office network acting as the default service venue",
        "A Zalo Official Account used for announcements and simple customer interaction",
      ],
      gaps: [
        "Provincial customers still travel to a branch for servicing that needs no physical presence",
        "There is no authenticated conversational channel that can execute account or card actions",
        "Repayment conversations depend entirely on collector calling capacity",
        "After-hours servicing demand is effectively unserved outside app self-service",
      ],
    },
    risks: [
      "State Bank of Vietnam rules on electronic banking, customer authentication and transaction execution set the boundary for what an automated channel may do without additional verification",
      "Vietnam's Personal Data Protection Decree and cybersecurity law impose consent, data-localization and cross-border processing constraints on any conversational platform touching customer data",
      "Provincial accent diversity in Vietnamese is a real speech-recognition risk for a branch network reaching beyond the major cities and must be benchmarked before rollout",
    ],
    economics: {
      volumeMonthly: 1800000,
      costPerInteraction: 0.7,
      automationRate: 0.55,
      basis: "Seller assumptions for a large branch-heavy Vietnamese private bank; validate call-centre volumes, branch servicing traffic that could be deflected and cost per contact in discovery.",
    },
    pilotScope:
      "Automate routine account and card servicing conversations on voice and Zalo for retail customers in two provinces, with all balance-affecting transactions bounded by policy and logged.",
    expansion: [
      "Add card activation and lifecycle actions with in-conversation execution",
      "Add early-stage repayment reminder and arrangement conversations",
      "Extend nationwide including SME servicing and proactive branch-queue deflection",
    ],
    stakeholders: [
      "Head of Retail Banking",
      "Head of Contact Centre / Customer Service",
      "Head of Branch Operations",
      "Chief Information Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What proportion of branch visits are for transactions that require no physical presence?",
      "What is your post-restructuring technology budget cycle and who sponsors CX modernization?",
      "Can your core banking and card systems expose authenticated actions to an external conversational channel?",
      "How does contact volume differ between Ho Chi Minh City and provincial branches?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Sacombank customer in Can Tho checks her card status and requests a statement on Zalo in two minutes instead of taking a morning off to visit the transaction office.",
  },

  "vib": {
    operatingContext:
      "VIB is a retail-focused Vietnamese joint-stock bank that has built its growth story on consumer lending, particularly credit cards and mortgages, with the MyVIB app as its digital flagship and a deliberately lean physical footprint relative to the older incumbents. Cards are the centre of gravity: VIB has pushed card issuance hard, and a card portfolio generates more customer conversations per account than any other retail banking product, spanning activation, transaction queries, disputes, instalment conversion, limit changes and early-stage delinquency. Its customers are urban, salaried, app-comfortable Vietnamese consumers who nonetheless call when something goes wrong with money. Servicing runs through the app, a call centre, a Zalo Official Account and a comparatively small branch network.",
    strategicPressure: [
      { text: "VIB has pursued aggressive credit card issuance and consumer lending growth as its core retail strategy.", kind: "verified" },
      { text: "Card portfolios generate the highest servicing contact rate per account in retail banking, so card growth converts directly into contact-centre load.", kind: "inference" },
      { text: "A lean branch footprint means the contact centre and digital channels absorb servicing that branch-heavy competitors spread across offices.", kind: "inference" },
      { text: "Consumer credit growth in Vietnam brings delinquency management to the foreground, making early-stage collections conversations a portfolio-quality lever.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. VIB's competitive model is fast consumer growth on a lean cost base, with technology delivered through the app and vendor platforms. Diverting engineering into conversational infrastructure would work against the operating model that defines the bank.",
    whyNotBuild:
      "Card lifecycle automation needs Vietnamese speech quality on financial vocabulary, card-system and core-banking orchestration, hard policy bounding on limit and instalment actions, collections conduct guardrails, and continuous evaluation. Building that is a multi-year distraction from card and mortgage growth. The right to win is packaged card-lifecycle automation that scales servicing with issuance instead of with headcount.",
    workflows: [
      {
        name: "Card activation and servicing",
        friction: "Newly issued cards generate activation, PIN and first-transaction problems; each is a full call with re-authentication, and unactivated cards are dead revenue.",
        outcome: "Activation and card controls completed conversationally with identity resolved once, and activation nudges sent proactively to dormant new cards.",
        channels: ["Voice", "Zalo", "App", "SMS"],
        systems: ["Card management system", "Core banking", "Authentication services", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Transaction disputes and instalment conversion",
        friction: "Disputes are logged for a back-office queue with no visible status, while instalment conversion requests require an agent to explain terms and process manually, so many eligible customers never convert.",
        outcome: "Structured dispute capture with proactive status, and eligible instalment conversions offered and executed in-conversation within approved terms.",
        channels: ["Voice", "Zalo", "App"],
        systems: ["Card management", "Dispute and chargeback workflow", "Instalment product rules", "Core banking"],
        value: 3, complexity: 3,
      },
      {
        name: "Early-stage card collections",
        friction: "Delinquent card accounts get dialler bursts during office hours with low contact rates; offers depend on which collector connects, and promises to pay are noted with no automatic follow-up.",
        outcome: "Policy-timed multi-channel outreach with live dues, restructuring offers only from the approved matrix, in-channel payment, and hardship routed to specialists.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Collections system", "Card management", "Payment gateway", "Policy and offer matrix"],
        value: 3, complexity: 3,
      },
    ],
    existing: {
      has: [
        "The MyVIB mobile app with card controls, transactions and product applications",
        "A call centre handling card and account servicing",
        "A Zalo Official Account used for notifications and customer interaction",
        "SMS alerting for transactions and repayment reminders",
      ],
      gaps: [
        "Dispute status is invisible to the customer after filing, driving repeat calls",
        "Eligible instalment conversions are not proactively offered in-conversation",
        "Early-stage delinquency is worked only as far as dialler capacity allows",
        "There is no authenticated Zalo servicing path for card actions, only notifications",
      ],
    },
    risks: [
      "State Bank of Vietnam regulations on consumer lending conduct, debt collection practices and customer authentication set hard limits on automated outreach timing, frequency and content",
      "Vietnam's Personal Data Protection Decree and decrees restricting unsolicited calls and messages govern outbound contact, consent capture and data localization",
      "Collections conversations carry conduct risk; hardship and vulnerability signals must route to trained humans with complete transcripts, and every offer must come from an approved matrix",
    ],
    economics: {
      volumeMonthly: 1300000,
      costPerInteraction: 0.85,
      automationRate: 0.55,
      basis: "Seller assumptions for a card-led Vietnamese retail bank across servicing and early-stage collections; validate card portfolio size, contacts per card per month and cost per contact in discovery.",
    },
    pilotScope:
      "Automate card activation, controls and dispute intake on voice and Zalo for the credit card portfolio, with disputes adjudicated by humans and every action logged.",
    expansion: [
      "Add instalment conversion offers and execution within approved product terms",
      "Add early-stage card collections with policy-timed multi-channel outreach",
      "Extend to mortgage servicing conversations and proactive fraud-alert confirmation",
    ],
    stakeholders: [
      "Head of Retail Banking",
      "Head of Cards",
      "Head of Collections",
      "Head of Contact Centre",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How many servicing contacts does an active credit card generate per month?",
      "What share of newly issued cards remain unactivated after thirty days?",
      "What contact rate does your dialler achieve on early-bucket card delinquency today?",
      "What debt-collection conduct constraints apply to automated outreach under current SBV expectations?",
    ],
    flowTemplate: "collections",
    scenario: "A VIB cardholder one payment behind is reached on Zalo in the evening, sees her exact dues, converts the balance to an approved instalment plan, and pays in-channel without a collector call.",
  },

  "tpbank": {
    operatingContext:
      "TPBank is Vietnam's most visibly digital-forward mid-size bank, best known for the LiveBank network of 24/7 self-service kiosks that perform account opening, card issuance and cash transactions with remote assistance, alongside an app-first acquisition model. Its customers skew young, urban and digitally confident, and the bank has deliberately built a brand around unattended, always-available banking rather than branch relationships. That makes it culturally ready for agentic service in a way most Vietnamese banks are not, but it also means TPBank has internal digital teams with opinions and existing self-service investments. Servicing runs across the app, LiveBank kiosks with video assistance, a call centre, and a Zalo Official Account.",
    strategicPressure: [
      { text: "TPBank operates the LiveBank 24/7 self-service kiosk network, one of the most distinctive unattended-banking deployments in Vietnam.", kind: "verified" },
      { text: "A bank that already runs unattended banking has organizational permission for automated customer interaction that most peers lack.", kind: "inference" },
      { text: "Existing in-house digital investment raises the bar: a packaged suite competes with capability the bank believes it already has.", kind: "inference" },
      { text: "Vietnamese-language voice quality, rather than dialogue design, is the specific gap an unattended-banking bank cannot close on its own.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Co-build. TPBank has real in-house digital delivery capability and a self-service estate it is proud of, so a full packaged replacement is a hard sell. The credible motion is co-building Vietnamese-language voice and conversational capabilities on top of what TPBank already runs, selling models, speech and orchestration rather than a finished product.",
    whyNotBuild:
      "TPBank can build dialogue flows and channel integration; what it cannot build is production-grade Vietnamese speech recognition and synthesis, telephony-grade latency handling, and a rigorous evaluation harness for conversational quality. Those are research-and-infrastructure problems, not application problems. The right to win is supplying exactly those layers and letting TPBank keep ownership of the experience.",
    workflows: [
      {
        name: "Voice servicing layered onto LiveBank journeys",
        friction: "LiveBank kiosk sessions escalate to remote human assistants for anything unusual, which caps concurrency and creates waiting at peak; the same customers then call the contact centre for follow-up.",
        outcome: "Voice-based assistance handles routine kiosk escalations conversationally in Vietnamese, reserving human assistants for genuine exceptions and identity-sensitive steps.",
        channels: ["Voice", "Kiosk video/audio", "Zalo", "App"],
        systems: ["LiveBank kiosk platform", "Core banking", "Identity and eKYC services", "Contact centre platform"],
        value: 3, complexity: 3,
      },
      {
        name: "App and account servicing conversations",
        friction: "App users who hit a problem drop to the call centre, where context from the app session is lost and the customer re-explains from the beginning.",
        outcome: "Conversational servicing carries app context through, resolving account, card and transfer questions without restarting the story.",
        channels: ["Voice", "Zalo", "App chat"],
        systems: ["Core banking", "Card management", "Digital channel session data", "CRM"],
        value: 2, complexity: 2,
      },
      {
        name: "Onboarding drop-off recovery",
        friction: "Digital account and card applications stall at document or verification steps, and nobody reaches out, so the applicant simply never returns.",
        outcome: "Timely conversational outreach explains the exact blocking step, guides completion, and escalates verification exceptions to a human.",
        channels: ["Voice", "Zalo", "SMS", "App"],
        systems: ["Onboarding and eKYC workflow", "Document management", "Core banking", "CRM"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "The LiveBank 24/7 self-service kiosk network with remote human assistance",
        "A digitally mature mobile banking app used as the primary acquisition channel",
        "A contact centre supporting card, account and digital-channel issues",
        "A Zalo Official Account integrated into customer communication",
      ],
      gaps: [
        "Kiosk escalations still require a human assistant, capping concurrency at peak",
        "Context does not carry between app, kiosk and call-centre interactions",
        "Onboarding drop-offs receive no proactive conversational recovery",
        "There is no production-grade Vietnamese voice layer to make unattended channels genuinely conversational",
      ],
    },
    risks: [
      "State Bank of Vietnam requirements on eKYC, customer authentication and transaction execution govern which steps may be automated and which need verified human or biometric confirmation",
      "Vietnam's Personal Data Protection Decree and cybersecurity law impose consent, localization and cross-border transfer constraints on speech data and conversation logs",
      "Existing in-house capability creates a political risk: any proposal must position as augmenting TPBank's own platform rather than replacing what its digital teams have built",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.75,
      automationRate: 0.55,
      basis: "Seller assumptions for a digitally mature mid-size Vietnamese bank across kiosk, app and call-centre contact; validate kiosk escalation rates, contact-centre volumes and cost per contact in discovery.",
    },
    pilotScope:
      "Co-build a Vietnamese voice assistance layer for LiveBank kiosk escalations and contact-centre overflow on one journey, measured against current human-assist handling time and concurrency limits.",
    expansion: [
      "Extend voice assistance across the full LiveBank journey set",
      "Add onboarding drop-off recovery conversations on Zalo and voice",
      "Add context-carrying servicing across app, kiosk and contact centre",
    ],
    stakeholders: [
      "Chief Digital Officer",
      "Head of LiveBank / Self-Service Channels",
      "Head of Contact Centre",
      "Chief Technology Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "What share of LiveBank sessions escalate to a remote assistant, and what caps your concurrency?",
      "What conversational capability have your internal teams already shipped, and how is it performing?",
      "Where does your Vietnamese speech stack fall short today on accent or banking vocabulary?",
      "What proportion of digital onboarding applications stall before completion?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A customer at a LiveBank kiosk at 11pm gets a Vietnamese voice assistant that completes her card reissue request instead of waiting for a remote human assistant to free up.",
  },

  "hdbank": {
    operatingContext:
      "HDBank is a Sovico-group commercial bank combining a retail and SME banking franchise with HD Saison, its consumer-finance joint venture that lends at point of sale through thousands of retail and motorbike-dealer locations across Vietnam. HD Saison's business model is small-ticket instalment lending to mass-market borrowers, which generates two enormous conversational workloads: origination verification calls confirming employment, address and intent before disbursement, and repayment follow-up across a portfolio where small balances mean collection economics are unforgiving. Those borrowers are provincial, often outside the banking mainstream, and reachable mainly by voice and Zalo rather than app. The bank side adds conventional retail servicing, while the group's ownership ties it to a portfolio that includes aviation and property rather than technology.",
    strategicPressure: [
      { text: "HDBank operates HD Saison, a consumer-finance business lending at point of sale through a large network of retail and dealer locations in Vietnam.", kind: "verified" },
      { text: "Small-ticket instalment lending makes cost per collection contact a direct determinant of portfolio profitability, unlike in mainstream banking.", kind: "inference" },
      { text: "Origination verification calls are a mandatory, high-volume, scripted workload that scales one-for-one with loan applications.", kind: "inference" },
      { text: "Consumer-finance delinquency cycles in Vietnam make early-bucket contact coverage a portfolio-quality lever that dialler capacity currently limits.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Sovico's portfolio strengths are aviation, banking and property, not software engineering; HDBank and HD Saison procure operational technology. Consumer-finance economics reward buying automation with a measurable cost-per-contact payback rather than funding a platform build.",
    whyNotBuild:
      "Verification and collections at HD Saison volumes require Vietnamese speech quality across provincial accents, dialler and telephony integration, loan-system orchestration, conduct-compliant collections bounding, and evaluation of every conversation. A consumer-finance lender will never staff that. The right to win is automation whose payback is visible in cost per verified application and early-bucket contact coverage.",
    workflows: [
      {
        name: "Origination verification calls",
        friction: "Every application triggers scripted verification calls to the borrower and references; agents work call lists in office hours, applicants are unreachable at work, and disbursement slips while the customer waits at a dealer counter.",
        outcome: "Verification conversations completed within minutes of application at any hour, with structured answers written back and only inconsistencies escalated to underwriters.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Loan origination system", "Credit decisioning", "Customer records", "Dealer point-of-sale integration"],
        value: 3, complexity: 2,
      },
      {
        name: "Early-bucket collections",
        friction: "Missed instalments trigger dialler bursts with low contact rates; small balances mean each human call erodes the margin on the loan, and promises to pay are recorded without follow-up.",
        outcome: "Policy-timed multi-channel repayment conversations with live dues, in-channel payment, restructuring only within the approved matrix and hardship routed to specialists.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Loan management", "Collections workflow", "Payment gateway", "Offer and restructuring matrix"],
        value: 3, complexity: 3,
      },
      {
        name: "Bank retail servicing",
        friction: "HDBank retail customers call for balance, card, transfer and fee queries; volumes peak at salary and holiday periods against fixed contact-centre capacity.",
        outcome: "Authenticated retail servicing handled conversationally in Vietnamese with in-policy actions executed and exceptions escalated.",
        channels: ["Voice", "Zalo", "App", "Web chat"],
        systems: ["Core banking", "Card management", "Payment systems", "CRM"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "HD Saison point-of-sale lending presence across retail and dealer locations nationwide",
        "Outbound call-centre operations for origination verification and collections",
        "HDBank mobile banking app and a retail contact centre",
        "Zalo Official Accounts used for customer notification and interaction",
      ],
      gaps: [
        "Verification calls happen only in office hours, delaying disbursement at the point of sale",
        "Early-bucket collections coverage is capped by dialler and agent capacity, not by portfolio need",
        "Borrowers cannot self-serve outstanding balances and payment options conversationally",
        "Reasons for non-payment are not captured in structured form for portfolio management",
      ],
    },
    risks: [
      "State Bank of Vietnam consumer-finance regulations and debt-collection conduct rules constrain contact timing, frequency and permissible content; automated outreach must be provably compliant",
      "Vietnam's decrees restricting unsolicited calls and messages plus the Personal Data Protection Decree govern consent, contact windows and data localization for outbound campaigns",
      "Provincial Vietnamese accents and low-literacy borrower segments make speech quality and conversational simplicity a delivery risk that must be tested with real portfolio calls",
    ],
    economics: {
      volumeMonthly: 2000000,
      costPerInteraction: 0.6,
      automationRate: 0.6,
      basis: "Seller assumptions dominated by HD Saison verification and collections contact plus bank retail servicing; validate application volumes, verification calls per application and early-bucket contact economics in discovery.",
    },
    pilotScope:
      "Automate HD Saison origination verification conversations on voice and Zalo for one product line, targeting time-to-disbursement and cost per verified application, with all credit decisions human.",
    expansion: [
      "Add early-bucket collections outreach with in-channel payment and approved restructuring offers",
      "Extend verification automation across all consumer-finance products and dealer channels",
      "Add HDBank retail servicing conversations across voice, Zalo and app",
    ],
    stakeholders: [
      "Chief Executive, HD Saison",
      "Head of Collections",
      "Head of Credit Operations",
      "Chief Information Officer, HDBank",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How many verification calls does one HD Saison application generate, and what is the current cost per verified application?",
      "What early-bucket contact coverage do you achieve today versus what the portfolio needs?",
      "Is HD Saison's CX technology decided separately from the bank's?",
      "What collection-contact windows and frequencies does your compliance function permit for automated outreach?",
    ],
    flowTemplate: "collections",
    scenario: "A motorbike buyer at a dealer in Dong Nai completes HD Saison verification by voice within four minutes of applying, and the loan disburses before he leaves the shop.",
  },

  "shb": {
    operatingContext:
      "SHB is one of Vietnam's larger private joint-stock banks by assets, historically weighted toward corporate and project lending with a broad branch network built around that business, and now pushing to grow a retail franchise in cards, deposits and consumer lending. That pivot changes the servicing profile: corporate relationships are managed by relationship managers, while retail customers arrive in volume with small, repetitive, unscheduled questions that require a contact-centre capability the bank has not historically needed. Its customers span provincial and urban Vietnam, served through branches, a mobile app, a call centre and a Zalo Official Account. The gap between retail ambition and service infrastructure is the operating tension.",
    strategicPressure: [
      { text: "SHB is among Vietnam's larger private banks by assets with a corporate-lending heritage and a broad branch network.", kind: "verified" },
      { text: "A retail pivot adds servicing volume with a completely different shape from corporate relationship banking, which existing infrastructure was not designed for.", kind: "inference" },
      { text: "The bank has no visible platform-engineering track record, so any customer-experience capability will be sourced rather than built.", kind: "inference" },
      { text: "Retail growth targets will outpace contact-centre hiring, making automation the only way to hold service levels while the book grows.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. SHB's institutional strengths are lending and balance-sheet management, not software. Retail servicing capability at the pace its growth plan implies has to be purchased and integrated, not developed.",
    whyNotBuild:
      "Retail conversational servicing requires Vietnamese speech quality, core-banking and card orchestration, policy-bounded action execution and SBV-acceptable logging. A bank building a retail franchise from a corporate base will not simultaneously build a conversational platform. The right to win is fast-to-deploy servicing automation that lets the retail book grow without proportional contact-centre hiring.",
    workflows: [
      {
        name: "Retail account servicing deflection",
        friction: "New retail customers call and visit branches for balance, statement, fee and card-status questions; branch staff trained for corporate relationships handle them slowly and inconsistently.",
        outcome: "Authenticated retail servicing handled conversationally in Vietnamese with consistent answers and in-policy actions executed directly.",
        channels: ["Voice", "Zalo", "App", "Web chat"],
        systems: ["Core banking", "Card management", "Statement generation", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Product and eligibility enquiries",
        friction: "Prospective customers asking about deposit rates, card eligibility and loan requirements get answers that vary by branch, and enquiries outside office hours are lost entirely.",
        outcome: "Grounded, consistent product and eligibility answers any hour, with qualified prospects routed to relationship managers with structured context.",
        channels: ["Voice", "Zalo", "Web chat"],
        systems: ["Product catalogue and rates", "Eligibility rules", "CRM and lead management", "Branch assignment"],
        value: 2, complexity: 2,
      },
      {
        name: "Repayment reminders and arrangement intake",
        friction: "Consumer-loan repayment follow-up is broadcast SMS plus ad hoc calls; borrowers who want to arrange a payment have no easy route to do so.",
        outcome: "Two-way repayment conversations with live balances, in-channel payment and arrangement requests captured within an approved matrix.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Loan management", "Collections workflow", "Payment gateway", "Customer records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A mobile banking app and internet banking for retail transactions",
        "A branch network built for corporate and provincial coverage",
        "A contact centre handling card and account queries",
        "A Zalo Official Account used for notifications and simple interaction",
      ],
      gaps: [
        "Retail servicing quality varies widely because branch staff are oriented to corporate relationships",
        "Prospective retail customers get no response outside office hours",
        "There is no authenticated conversational channel that can execute account or card actions",
        "Repayment arrangements require reaching a human who may never call back",
      ],
    },
    risks: [
      "State Bank of Vietnam rules on electronic banking, authentication and consumer lending conduct define the boundary of automated action and outbound contact",
      "Vietnam's Personal Data Protection Decree and cybersecurity law impose consent, localization and cross-border processing requirements on conversation data",
      "A corporate-heritage organization may lack retail CX ownership entirely, so executive sponsorship and success metrics must be established before any deployment",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.7,
      automationRate: 0.55,
      basis: "Seller assumptions for a Vietnamese bank scaling a retail franchise from a corporate base; validate current retail contact volumes, growth projections and cost per contact in discovery.",
    },
    pilotScope:
      "Automate retail account and card servicing conversations on voice and Zalo for the consumer segment in two provinces, with in-policy actions executed and everything else escalated.",
    expansion: [
      "Add product and eligibility enquiry handling with qualified handoff to relationship managers",
      "Add repayment reminder and arrangement conversations for consumer loans",
      "Extend nationwide with proactive onboarding and activation nudges for new retail customers",
    ],
    stakeholders: [
      "Head of Retail Banking",
      "Head of Contact Centre",
      "Head of Digital Banking",
      "Chief Information Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "How fast is retail contact volume growing relative to your contact-centre headcount plan?",
      "Who owns retail customer experience as a P&L-relevant metric today?",
      "Can your core banking system expose authenticated servicing actions to an external channel?",
      "How much branch time currently goes to retail queries that need no branch?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A new SHB retail customer in Hai Phong resolves a card fee query on Zalo in ninety seconds instead of queueing at a branch built for corporate clients.",
  },

  "msb": {
    operatingContext:
      "MSB is a mid-size Vietnamese joint-stock bank, rebranded from Maritime Bank, that has focused on digital onboarding, retail deposits and SME banking as its growth path rather than competing on branch density. Its acquisition model leans on digital account and card applications, which means a meaningful share of its customer relationships begin as an online funnel rather than a branch conversation, and that funnel leaks at document upload, eKYC verification and first-use activation. Its customers are urban salaried consumers and small business owners served through the app, a contact centre, a modest branch network and a Zalo Official Account. Because its scale is mid-tier, every point of onboarding completion and servicing efficiency matters more than it would at a larger bank.",
    strategicPressure: [
      { text: "MSB rebranded from Maritime Bank and has positioned digital onboarding and SME banking as core growth engines.", kind: "verified" },
      { text: "Digital acquisition funnels leak at verification and activation steps, and unrecovered drop-offs are the cheapest customers a bank will ever fail to win.", kind: "inference" },
      { text: "A mid-size bank cannot justify a conversational platform build when the volumes never amortize the investment.", kind: "inference" },
      { text: "SME customers need conversational answers on limits, fees and documentation that self-service portals answer poorly.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. MSB's technology function is sized to run digital channels and core systems, not to develop speech and dialogue infrastructure. At its scale, packaged automation with a clear onboarding-conversion payback is the only rational path.",
    whyNotBuild:
      "Recovering onboarding drop-offs conversationally needs Vietnamese speech and messaging quality, live visibility into eKYC and document workflow state, and compliant handling of identity data mid-funnel. A mid-size bank has no route to building that. The right to win is drop-off recovery automation whose value shows up directly in funnel completion.",
    workflows: [
      {
        name: "Onboarding drop-off recovery",
        friction: "Digital account and card applications stall at document quality, eKYC verification or activation; nobody contacts the applicant, and the application quietly expires.",
        outcome: "Timely outreach explains the exact blocking step, guides re-submission in-channel, and escalates verification exceptions to a human with full context.",
        channels: ["Voice", "Zalo", "SMS", "App"],
        systems: ["Onboarding and eKYC workflow", "Document management", "Core banking", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Account and card servicing",
        friction: "Routine balance, fee, card status and transfer questions occupy the contact centre and branch staff, with no coverage outside office hours for a digitally acquired base that expects it.",
        outcome: "Authenticated servicing handled conversationally in Vietnamese any hour, with in-policy actions executed directly.",
        channels: ["Voice", "Zalo", "App", "Web chat"],
        systems: ["Core banking", "Card management", "Payment systems", "Customer records"],
        value: 2, complexity: 2,
      },
      {
        name: "SME credit and documentation queries",
        friction: "Small business customers ask about facility limits, documentation requirements and application status, and depend on a relationship manager who is often unavailable.",
        outcome: "Grounded answers on requirements and application status delivered conversationally, with relationship managers freed for genuine credit conversations.",
        channels: ["Voice", "Zalo", "Email", "Web chat"],
        systems: ["SME lending workflow", "Document management", "Core banking", "CRM"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A digital onboarding journey with eKYC for account and card applications",
        "A mobile banking app serving retail and SME customers",
        "A contact centre supporting account, card and application queries",
        "A Zalo Official Account used for customer notifications",
      ],
      gaps: [
        "Applicants who stall mid-funnel receive no proactive conversational recovery",
        "There is no authenticated servicing channel available outside contact-centre hours",
        "SME customers cannot get application status without reaching their relationship manager",
        "Reasons for onboarding abandonment are not captured, so the funnel is never fixed upstream",
      ],
    },
    risks: [
      "State Bank of Vietnam eKYC and authentication requirements determine which onboarding steps may be assisted conversationally and which need verified human or biometric confirmation",
      "Vietnam's Personal Data Protection Decree governs identity documents and biometric data handled during onboarding conversations, including localization and retention",
      "Decrees restricting unsolicited calls and messages constrain outbound recovery contact, so consent capture at application time must be designed in from the start",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 0.7,
      automationRate: 0.55,
      basis: "Seller assumptions for a mid-size Vietnamese bank with digital acquisition and retail plus SME servicing; validate application volumes, drop-off rates and cost per contact in discovery.",
    },
    pilotScope:
      "Automate digital onboarding drop-off recovery on Zalo and voice for account and card applications, measured against funnel completion rate, with verification exceptions escalated to humans.",
    expansion: [
      "Add authenticated account and card servicing conversations across voice and Zalo",
      "Add SME documentation and application-status conversations",
      "Extend to activation and first-use nudges for newly onboarded customers",
    ],
    stakeholders: [
      "Head of Retail Banking",
      "Head of Digital Banking",
      "Head of SME Banking",
      "Chief Information Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "Where exactly does your digital onboarding funnel leak, and what completion rate do you see today?",
      "Do you capture contact consent at application start in a form that permits automated outreach?",
      "What eKYC steps must remain human-verified under current SBV expectations?",
      "How many SME contacts per month are pure status or documentation questions?",
    ],
    flowTemplate: "onboarding",
    scenario: "An applicant whose MSB account opening stalled on a blurry ID photo gets a Zalo message that hour explaining exactly what to re-upload, and completes onboarding the same evening.",
  },

  "ocb-vietnam": {
    operatingContext:
      "OCB is a mid-size Vietnamese joint-stock commercial bank with Aozora Bank of Japan as a strategic shareholder, and its modernization story has centred on OMNI, the digital banking channel it positions as its flagship customer experience. Its business mixes retail deposits and consumer lending with SME banking, served through a moderate branch network, the OMNI app and web channel, a contact centre and a Zalo Official Account. The pattern that matters commercially is that OMNI itself was delivered on a vendor platform rather than built from scratch, which tells you exactly how the bank acquires customer-facing capability. Servicing demand is growing with the consumer book while the contact centre remains conventionally staffed.",
    strategicPressure: [
      { text: "OCB has Aozora Bank as a Japanese strategic shareholder and positions its OMNI digital channel as the centrepiece of its modernization.", kind: "verified" },
      { text: "OMNI was delivered on a vendor platform, establishing a clear precedent that customer-facing capability at OCB is procured rather than built.", kind: "inference" },
      { text: "Consumer-book growth is adding servicing contacts faster than a conventionally staffed contact centre can absorb them.", kind: "inference" },
      { text: "A Japanese strategic shareholder typically brings governance expectations on vendor selection, audit and data handling that lengthen but do not block procurement.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The OMNI precedent is the strongest available evidence: OCB acquires digital capability through vendors and integrates it. There is no platform-engineering base for conversational infrastructure, and mid-tier scale never justifies one.",
    whyNotBuild:
      "Vietnamese conversational quality, telephony integration, core-banking orchestration and evaluation are four capabilities OCB has consistently chosen to source. The right to win is a conversational layer that extends OMNI into voice and Zalo rather than competing with it, with every action logged for SBV scrutiny.",
    workflows: [
      {
        name: "In-app and in-channel support for OMNI",
        friction: "OMNI users who hit a problem fall out to the contact centre, where session context is lost and the customer re-explains; simple questions consume full agent handle time.",
        outcome: "Conversational support inside OMNI and on Zalo carries session context, resolves account and transaction questions, and escalates with a complete transcript.",
        channels: ["App chat", "Zalo", "Voice", "Web chat"],
        systems: ["OMNI digital platform", "Core banking", "Card management", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Loan servicing and repayment conversations",
        friction: "Borrowers ask about outstanding balances, schedules and early settlement; answers require an agent, and repayment reminders are broadcast rather than conversational.",
        outcome: "Live balance and schedule answers with in-channel payment, and two-way reminder conversations that capture the reason when a payment is missed.",
        channels: ["Voice", "Zalo", "SMS", "App"],
        systems: ["Loan management", "Collections workflow", "Payment gateway", "Core banking"],
        value: 3, complexity: 2,
      },
      {
        name: "Product enquiry and application status",
        friction: "Prospects asking about rates, eligibility and application progress get inconsistent branch answers, and after-hours enquiries go unanswered.",
        outcome: "Grounded product answers and authenticated application status any hour, with qualified leads routed to branches or relationship managers.",
        channels: ["Voice", "Zalo", "Web chat"],
        systems: ["Product catalogue and rates", "Loan origination workflow", "CRM and lead management", "Branch assignment"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "The OMNI digital banking app and web channel as the flagship customer experience",
        "A contact centre supporting account, card and loan queries",
        "A branch network for account opening and complex transactions",
        "A Zalo Official Account used for notifications and basic servicing",
      ],
      gaps: [
        "OMNI session context does not carry into the contact centre, so customers repeat themselves",
        "There is no authenticated conversational servicing outside contact-centre hours",
        "Repayment reminders are one-way broadcasts that capture no borrower response",
        "Application status requires a call or branch visit rather than a self-service conversation",
      ],
    },
    risks: [
      "State Bank of Vietnam regulations on electronic banking, authentication and consumer lending conduct define what an automated channel may execute and how outreach may be conducted",
      "Vietnam's Personal Data Protection Decree and cybersecurity law require consent, data localization consideration and controlled cross-border processing for conversation and voice data",
      "The strategic shareholder's governance standards may add vendor due-diligence and audit requirements that must be planned into the procurement timeline",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 0.7,
      automationRate: 0.55,
      basis: "Seller assumptions for a mid-size Vietnamese bank with a vendor-delivered digital channel; validate contact-centre volumes, OMNI support escalation rates and cost per contact in discovery.",
    },
    pilotScope:
      "Automate authenticated account and loan servicing conversations on Zalo and voice for OMNI customers, carrying session context into escalations, with in-policy actions executed.",
    expansion: [
      "Add repayment reminder and arrangement conversations with in-channel payment",
      "Add product enquiry and application-status handling with lead routing",
      "Extend to SME servicing and proactive onboarding activation nudges",
    ],
    stakeholders: [
      "Head of Retail Banking",
      "Head of Digital Banking / OMNI Programme Owner",
      "Head of Contact Centre",
      "Chief Information Officer",
      "Chief Compliance Officer",
    ],
    discovery: [
      "Which vendors are already attached to the OMNI programme and how would a conversational layer fit their scope?",
      "What share of contact-centre volume originates from customers who were already in OMNI?",
      "What does Aozora's governance require in vendor due diligence for customer-facing systems?",
      "How is repayment follow-up conducted today and what contact coverage does it achieve?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An OMNI user whose transfer failed asks in the app at 10pm, gets the reason from live core-banking data, and completes the transfer without a call the next morning.",
  },

  "bao-viet": {
    operatingContext:
      "Bao Viet Holdings is Vietnam's largest domestic insurance group, spanning life and non-life underwriting with a nationwide agency force and branch network reaching provincial markets that foreign insurers serve thinly. Its non-life book carries motor and health cover with the high claim frequency that implies, while the life book carries long-duration policies requiring premium collection, servicing and persistency management across millions of customers. The company's state-linked heritage shows in its systems: established core platforms, branch-mediated processes, and a servicing model where the agent or the branch is the customer's route to almost everything. Contact arrives by hotline, branch visit, agent and increasingly Zalo, overwhelmingly in Vietnamese.",
    strategicPressure: [
      { text: "Bao Viet is Vietnam's largest domestic insurer with both life and non-life operations and a nationwide agency and branch footprint.", kind: "verified" },
      { text: "Motor and health claims generate the highest contact frequency in insurance, and claims status is the dominant inbound driver for any composite insurer.", kind: "inference" },
      { text: "Legacy core systems and branch-mediated processes mean information that exists in systems reaches customers only through a person.", kind: "inference" },
      { text: "Competition from foreign insurers with better digital servicing puts pressure on a domestic incumbent's traditional service model, particularly with younger urban customers.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A state-linked insurance incumbent modernizes through procurement, with technology decisions running through structured vendor processes. There is no evidence of conversational or speech engineering capability, and the organizational model does not produce one.",
    whyNotBuild:
      "Claims and policy conversations at national scale require Vietnamese speech quality across provincial accents, integration with legacy policy and claims cores, strict bounding on anything said about coverage, and full audit logging. That is beyond what an insurance incumbent builds. The right to win is a governed conversation layer over legacy systems that produces a complete record for every customer interaction.",
    workflows: [
      {
        name: "Motor claims FNOL and status",
        friction: "Claim notification is phone or branch-based and queues behind routine service; afterwards the claimant calls repeatedly because survey, repair and settlement stages are visible only internally.",
        outcome: "Structured FNOL with photos captured in-conversation and automatic status pushes at survey, approval and settlement, collapsing status-call volume.",
        channels: ["Voice", "Zalo", "SMS", "Web chat"],
        systems: ["Non-life policy system", "Claims management", "Garage and survey network records", "Document management"],
        value: 3, complexity: 3,
      },
      {
        name: "Policy servicing and premium collection",
        friction: "Premium due dates, policy details and change requests are handled by agents and branches; when an agent leaves, the customer has no reliable route to service the policy at all.",
        outcome: "Authenticated policy servicing and premium conversations with in-channel payment, independent of whether the original agent is still active.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Life and non-life policy administration", "Billing and collections", "Payment gateway", "Agency records"],
        value: 3, complexity: 2,
      },
      {
        name: "Health claim reimbursement guidance",
        friction: "Health claim reimbursements bounce on missing or wrongly formatted documents, and claimants learn only after days of waiting, then resubmit blind.",
        outcome: "Document requirements explained and checked conversationally at submission, with a tracked checklist and guided re-submission.",
        channels: ["Voice", "Zalo", "Web chat"],
        systems: ["Health claims workflow", "Document management", "Policy administration", "Provider network records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A national customer hotline covering life and non-life servicing",
        "A nationwide agency force and branch network as the primary customer interface",
        "Customer portal and app channels for policy information and some claim submission",
        "A Zalo Official Account used for notifications and simple customer interaction",
      ],
      gaps: [
        "Claimants cannot see or be told where a claim actually stands without calling",
        "Customers whose agent has left have no reliable servicing route",
        "Document rejection in health claims is discovered days later rather than at submission",
        "Provincial customers depend on branch hours for servicing that needs no branch",
      ],
    },
    risks: [
      "Ministry of Finance insurance supervision and Vietnamese insurance law govern claims handling, disclosure and complaint management, bounding what an automated channel may state about coverage or settlement",
      "Vietnam's Personal Data Protection Decree treats health and claims data with heightened sensitivity, requiring consent, localization consideration and controlled retention",
      "Legacy core-system integration is the main delivery risk; if claims status cannot be read in near real time, the proactive-status workflow collapses to advisory messaging",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.7,
      automationRate: 0.5,
      basis: "Seller assumptions for Vietnam's largest domestic insurer across life and non-life servicing and claims; validate claim frequency, contacts per claim and cost per contact in discovery.",
    },
    pilotScope:
      "Automate motor claim FNOL and proactive status conversations on voice and Zalo for private-car policies in two provinces, with survey and settlement decisions retained by human adjusters.",
    expansion: [
      "Add health claim document guidance and reimbursement-status conversations",
      "Add life policy servicing and premium collection conversations with in-channel payment",
      "Extend nationwide including agent-support conversations and renewal outreach",
    ],
    stakeholders: [
      "Deputy General Director, Operations",
      "Head of Claims, non-life",
      "Head of Customer Service",
      "Chief Information Officer",
      "Head of Legal and Compliance",
    ],
    discovery: [
      "How many contacts does an average motor claim generate from notification to settlement?",
      "Can your claims system expose stage changes to an external channel in near real time?",
      "What happens to a policyholder's servicing route when their agent leaves the company?",
      "How does state-linked procurement govern a customer-facing technology decision here?",
    ],
    flowTemplate: "claims",
    scenario: "A driver in Da Nang files a motor claim on Zalo with photos at the roadside, then receives automatic updates at survey, approval and payment instead of calling the hotline weekly.",
  },

  "prudential-vietnam": {
    operatingContext:
      "Prudential Vietnam is one of the country's largest foreign life insurers, distributing through a tied agency force and bank partnerships across a market where life penetration is still low but growing. It operates in the aftermath of the 2023 bancassurance mis-selling controversy, which damaged consumer trust across the Vietnamese life sector and triggered materially tighter conduct scrutiny of how policies are sold and confirmed. That has made post-sale conduct processes such as welcome calls, needs-confirmation and free-look period confirmation into regulated, evidence-producing workflows rather than courtesy touches. Customers are served in Vietnamese through agents, a hotline, a customer portal and app, and Zalo, with claims and persistency conversations forming the ongoing servicing load.",
    strategicPressure: [
      { text: "Vietnam's life insurance sector went through a widely reported bancassurance mis-selling crisis in 2023 that damaged consumer trust and tightened conduct scrutiny.", kind: "verified" },
      { text: "Post-sale confirmation conversations became compliance evidence, which means they must be consistent, complete and fully recorded rather than delegated to whoever is available.", kind: "inference" },
      { text: "Doing conduct-critical calls manually at scale is expensive and inconsistent, and inconsistency is precisely what the regulator is looking for.", kind: "inference" },
      { text: "Trust repair makes transparent claims and servicing communication commercially valuable, not just compliant.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Prudential country units implement group-aligned platforms and localize them; the Vietnam entity's technology function integrates rather than builds. Conduct-critical conversational workflows are exactly the kind of capability sourced from a vendor with an auditable evaluation story.",
    whyNotBuild:
      "The requirement is Vietnamese speech quality, scripted-but-natural conduct conversations, complete recording and transcript retention, and evaluation evidence a regulator would accept. Building that locally would take longer than the compliance window and would still lack independent evaluation credibility. The right to win is policy-bounded, fully logged conversations that produce the evidence trail the conduct environment now demands.",
    workflows: [
      {
        name: "Regulated welcome and free-look confirmation",
        friction: "Welcome and free-look confirmation calls are made manually by staff working lists in office hours; coverage is incomplete, wording varies by caller, and evidencing the conversation is a manual retrieval exercise.",
        outcome: "Every new policyholder receives a consistent, scripted confirmation conversation in Vietnamese with complete recording, transcript and structured outcome written to the policy record.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Policy administration", "New business pipeline", "Recording and archive", "Compliance case management"],
        value: 3, complexity: 2,
      },
      {
        name: "Claims status and transparency",
        friction: "Claimants call repeatedly for status because claim progress is visible only internally, and in a low-trust environment silence reads as evasion.",
        outcome: "Proactive stage-by-stage claim updates with clear explanation of what is outstanding, and human handling for assessment decisions.",
        channels: ["Voice", "Zalo", "SMS", "App"],
        systems: ["Claims management", "Policy administration", "Document management", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Persistency and premium conversations",
        friction: "Lapse-risk policies get generic reminders; genuine conversations about affordability or misunderstanding happen only if an agent chooses to call, and the reason is never recorded.",
        outcome: "Two-way, policy-aware conversations before grace expiry with in-channel payment and the lapse reason captured for conduct and product feedback.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Policy administration", "Billing and collections", "Payment gateway", "CRM"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer portal and mobile app for policy details, payments and claim submission",
        "A Vietnamese-language customer hotline for policy servicing and claims",
        "A Zalo Official Account used for notifications and customer interaction",
        "A tied agency force plus bank partner channels handling most customer contact",
      ],
      gaps: [
        "Conduct-critical confirmation calls are not delivered consistently or evidenced automatically",
        "Claimants have no proactive status channel, so silence drives repeat calls in a low-trust market",
        "Lapse conversations reach only the customers an agent chooses to call",
        "Bank-channel policyholders often have no direct servicing relationship with the insurer at all",
      ],
    },
    risks: [
      "Vietnamese insurance conduct regulation following the bancassurance controversy imposes requirements on how policies are confirmed and how customer understanding is evidenced; automated conversations must meet those requirements exactly",
      "Vietnam's Personal Data Protection Decree and decrees restricting unsolicited calls govern outbound contact, consent, recording and data localization for conversation and voice data",
      "Positioning risk: in a trust-repair context, automation must be presented as consistency and evidence rather than cost reduction, or it becomes a reputational liability",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 0.85,
      automationRate: 0.5,
      basis: "Seller assumptions for a large foreign life insurer in Vietnam combining conduct calls, claims and persistency contact; validate new-business volumes, confirmation-call coverage and cost per contact in discovery.",
    },
    pilotScope:
      "Automate regulated welcome and free-look confirmation conversations in Vietnamese for one distribution channel, with complete recording, transcript retention and structured outcomes written to the policy record.",
    expansion: [
      "Add proactive claims-status conversations across all claim types",
      "Add persistency and premium-reminder conversations with in-channel payment",
      "Extend to bank-channel policyholders and to complaint intake with conduct-grade logging",
    ],
    stakeholders: [
      "Chief Customer Officer",
      "Chief Compliance Officer",
      "Head of Claims",
      "Head of Distribution / Bancassurance",
      "Chief Information Officer",
    ],
    discovery: [
      "What proportion of new policies receive a completed welcome and free-look confirmation call today?",
      "How is the content of those conversations evidenced when a regulator or complaint requires it?",
      "What conduct requirements would an automated confirmation conversation have to satisfy?",
      "How many claims contacts are pure status checks that a proactive update would remove?",
    ],
    flowTemplate: "onboarding",
    scenario: "A new policyholder in Hanoi receives a consistent Vietnamese free-look confirmation conversation within 48 hours of issuance, fully recorded and written back to the policy record as compliance evidence.",
  },

  "manulife-vietnam": {
    operatingContext:
      "Manulife Vietnam is among the largest foreign life insurers in the country, distributing through a tied agency force and bank partnerships, with a substantial in-force book built over years of rapid market growth. Its bancassurance channel was at the centre of the Vietnamese life sector's 2023 mis-selling controversy, which turned complaint handling, policy-understanding confirmation and claims transparency into board-level concerns rather than operational metrics. The practical consequence is that every customer conversation is now potential evidence: what was said, when, by whom, and whether the customer understood. Servicing runs in Vietnamese through agents, a hotline, a customer app and portal, and Zalo, with persistency management and complaint intake carrying disproportionate strategic weight.",
    strategicPressure: [
      { text: "The Vietnamese life insurance market experienced a widely reported bancassurance mis-selling crisis in 2023 in which Manulife's bank channel featured prominently.", kind: "verified" },
      { text: "Complaint handling and policy-understanding evidence became board-level requirements rather than service metrics, which changes what a conversation must produce.", kind: "inference" },
      { text: "Persistency deteriorates when trust is damaged, so lapse management became a revenue-protection priority as well as a conduct one.", kind: "inference" },
      { text: "Manulife Asia's regional operating model deploys selected platforms per country rather than funding country-level engineering builds.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. The Vietnam entity operates within Manulife Asia's regional technology model, implementing and localizing chosen platforms. Its local technology function integrates policy, claims and channel systems; it does not develop conversational infrastructure.",
    whyNotBuild:
      "Conduct-grade conversations need Vietnamese speech quality, tightly bounded scripting, complete recording and transcript retention, and independent evaluation evidence. Building that locally would be slower than the compliance timetable and would lack the audit credibility the situation demands. The right to win is fully logged, policy-bounded conversation delivery with 100 percent evaluation coverage.",
    workflows: [
      {
        name: "Persistency and lapse-prevention outreach",
        friction: "Lapse-risk policies get generic reminders and, at best, an agent call; in a post-crisis market many lapses are driven by misunderstanding that nobody surfaces before the policy dies.",
        outcome: "Two-way, policy-aware conversations before grace expiry that explain the product, capture the real reason, offer in-channel payment, and route conduct concerns to specialists.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Policy administration", "Billing and collections", "Payment gateway", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Complaint intake with audit logging",
        friction: "Complaints arrive across agents, hotline, branches and social channels in unstructured form; classification depends on who receives them, and evidencing handling for the regulator is a manual reconstruction.",
        outcome: "Structured complaint intake in any channel with consistent classification, complete transcript retention, and automatic routing to conduct specialists with severity flags.",
        channels: ["Voice", "Zalo", "Web chat", "Email"],
        systems: ["Complaint and conduct case management", "Policy administration", "Recording and archive", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Claims servicing and status transparency",
        friction: "Claimants call repeatedly because progress is visible only internally, and in a low-trust environment every unexplained delay compounds the reputational problem.",
        outcome: "Proactive stage updates with clear explanation of outstanding requirements, and human ownership of all assessment decisions.",
        channels: ["Voice", "Zalo", "App", "SMS"],
        systems: ["Claims management", "Policy administration", "Document management", "CRM"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer app and portal for policy details, premium payment and claim submission",
        "A Vietnamese-language hotline for policy servicing, claims and complaints",
        "A Zalo Official Account used for customer notification and interaction",
        "A tied agency force and bank partner channels handling most sales-side contact",
      ],
      gaps: [
        "Lapse conversations reach only policyholders an agent chooses to call",
        "Complaint intake is unstructured and inconsistently classified across channels",
        "Claimants have no proactive status channel, so silence is interpreted as evasion",
        "There is no automatic, evidence-grade record of what customers were told at each servicing touchpoint",
      ],
    },
    risks: [
      "Post-crisis Vietnamese insurance conduct regulation imposes requirements on customer communication, complaint handling and evidence of policyholder understanding that automated conversations must satisfy exactly",
      "Vietnam's Personal Data Protection Decree and decrees restricting unsolicited calls govern outbound contact, consent, recording and localization of voice and conversation data",
      "Reputational positioning risk: in a trust-repair context automation must be framed as consistency and auditability, not cost reduction, or it will be read as the insurer avoiding customers",
    ],
    economics: {
      volumeMonthly: 600000,
      costPerInteraction: 0.85,
      automationRate: 0.45,
      basis: "Seller assumptions for a large foreign life insurer in Vietnam covering persistency, complaint and claims contact; validate in-force policy count, lapse volumes and cost per contact in discovery.",
    },
    pilotScope:
      "Automate persistency outreach for one lapse-risk cohort on voice and Zalo, capturing the reason for non-payment in structured form with conduct concerns routed to specialists and every conversation recorded.",
    expansion: [
      "Add structured complaint intake with consistent classification and conduct-grade logging",
      "Add proactive claims-status conversations across claim types",
      "Extend to bank-channel policyholders and post-sale understanding confirmation",
    ],
    stakeholders: [
      "Chief Customer Officer",
      "Chief Compliance Officer",
      "Head of Customer Service / Operations",
      "Head of Claims",
      "Chief Information Officer",
    ],
    discovery: [
      "What share of lapses are preceded by any two-way conversation with the policyholder?",
      "How do you evidence today what a customer was told during a servicing call?",
      "How are complaints classified when they arrive through an agent rather than the hotline?",
      "What does Manulife Asia's regional technology model allow the Vietnam entity to procure locally?",
    ],
    flowTemplate: "retention",
    scenario: "A policyholder in Hai Duong about to lapse is reached on Zalo, explains she misunderstood the premium schedule, gets it clarified and pays in-channel, with the whole exchange logged as conduct evidence.",
  },

  "dai-ichi-life-vietnam": {
    operatingContext:
      "Dai-ichi Life Vietnam is the Vietnamese subsidiary of the Japanese insurer, one of the longest-established foreign life companies in the market, built on a large tied agency force distributing protection and savings products across urban and provincial Vietnam. Its in-force book is substantial and long-duration, which makes premium collection, policy servicing and claims the recurring operational load rather than new-business support. Because distribution is agency-led, the customer's default route to service is their agent, and when that agent becomes inactive the relationship degrades to a hotline the customer may never have used. Contact is overwhelmingly Vietnamese-language through agents, the hotline, a customer portal and Zalo, and governance runs to Tokyo headquarters standards.",
    strategicPressure: [
      { text: "Dai-ichi Life Vietnam is a long-established Japanese-owned life insurer with one of the country's larger agency forces.", kind: "verified" },
      { text: "A large in-force book with recurring premiums makes collection and persistency the dominant, permanently recurring conversational workload.", kind: "inference" },
      { text: "Agency-mediated servicing breaks down when agents become inactive, orphaning policyholders who then lapse silently.", kind: "inference" },
      { text: "Post-2023 conduct scrutiny across the Vietnamese life sector raises the value of consistent, recorded customer communication for every insurer, not only those directly implicated.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Japanese-owned country units operate under headquarters technology governance and are disciplined platform buyers; the Vietnam entity's technology function localizes and integrates. There is no local engineering base for conversational infrastructure.",
    whyNotBuild:
      "Premium and servicing conversations at this book size need Vietnamese speech quality across provincial accents, policy-system orchestration, in-channel payment, and evidence-grade logging acceptable to both the regulator and Tokyo. A country subsidiary will not build any of that. The right to win is packaged automation with an auditable record that satisfies headquarters governance.",
    workflows: [
      {
        name: "Premium reminder and collection conversations",
        friction: "Premium due reminders are broadcast SMS supplemented by agent calls; agents prioritize new business, so renewal conversations happen unevenly and lapses accumulate quietly.",
        outcome: "Policy-aware, two-way reminder conversations before grace expiry with live amounts, in-channel payment, and the reason captured when payment is not made.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Policy administration", "Billing and collections", "Payment gateway", "Agency records"],
        value: 3, complexity: 2,
      },
      {
        name: "Orphan-policy servicing",
        friction: "Policyholders whose agent has left have no working service route; they call a hotline they have never used, are re-authenticated from scratch, and often give up.",
        outcome: "Authenticated policy servicing available directly to every policyholder regardless of agent status, covering details, changes and payment.",
        channels: ["Voice", "Zalo", "Portal chat"],
        systems: ["Policy administration", "Agency assignment records", "Customer identity", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Claims intake and status",
        friction: "Claims are submitted through agents or branches with documents that bounce on completeness; claimants then call repeatedly because status exists only internally.",
        outcome: "Structured claim intake with document checking in-conversation and proactive status at every stage, with assessment decisions retained by humans.",
        channels: ["Voice", "Zalo", "Web chat"],
        systems: ["Claims management", "Policy administration", "Document management", "CRM"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A tied agency force serving as the primary customer service route",
        "A Vietnamese-language customer hotline for policy and claims servicing",
        "A customer portal and app for policy details and premium payment",
        "A Zalo Official Account used for notifications and reminders",
      ],
      gaps: [
        "Policyholders with inactive agents have no reliable servicing relationship",
        "Premium reminders are one-way and capture no response or reason for non-payment",
        "Claim document completeness is checked only after submission, causing avoidable rework",
        "There is no consistent recorded evidence of what policyholders were told during servicing",
      ],
    },
    risks: [
      "Vietnamese insurance regulation and post-2023 conduct expectations govern how policy and claims information may be communicated and evidenced",
      "Vietnam's Personal Data Protection Decree and decrees restricting unsolicited calls govern outbound premium reminders, consent capture, recording and data localization",
      "Tokyo headquarters approval processes for customer-facing AI will lengthen procurement and impose audit, security and model-governance documentation requirements",
    ],
    economics: {
      volumeMonthly: 500000,
      costPerInteraction: 0.8,
      automationRate: 0.5,
      basis: "Seller assumptions for a large agency-led life insurer in Vietnam dominated by premium and servicing contact; validate in-force policy count, premium reminder volumes and cost per contact in discovery.",
    },
    pilotScope:
      "Automate premium reminder and collection conversations on voice and Zalo for one policy cohort, with in-channel payment and structured capture of non-payment reasons.",
    expansion: [
      "Add orphan-policy servicing so every policyholder has a direct authenticated route",
      "Add claim intake with in-conversation document checking and proactive status",
      "Extend to agent-support conversations and provincial-accent coverage nationwide",
    ],
    stakeholders: [
      "Deputy General Director, Operations",
      "Head of Customer Service",
      "Head of Agency",
      "Chief Information Officer",
      "Head of Compliance",
    ],
    discovery: [
      "How many in-force policies currently have no active servicing agent?",
      "What lapse rate do you see among orphan policies compared with agent-served ones?",
      "What does Tokyo require before approving a customer-facing AI vendor?",
      "How are premium reminders delivered today and what response rate do they achieve?",
    ],
    flowTemplate: "collections",
    scenario: "A policyholder in Nghe An whose agent left the company gets a Vietnamese premium reminder on Zalo, sees the exact amount due, and pays in-channel instead of lapsing unnoticed.",
  },

  "aia-vietnam": {
    operatingContext:
      "AIA Vietnam is the local life operation of AIA Group, distributing through a tied agency force and exclusive bank partnerships, with a product mix weighted toward protection and health cover and a wellness proposition that adds ongoing engagement beyond the policy itself. Its servicing load comes from claims, particularly health and medical reimbursements, alongside policy changes, premium collection and wellness-programme interaction. Customers are urban and increasingly digital, served through a customer app, a Vietnamese hotline, agents and Zalo. As an AIA country unit it works within a regional technology model that standardizes platform choices across markets, which makes the entry point as much a regional conversation as a local one.",
    strategicPressure: [
      { text: "AIA Vietnam distributes through agency and exclusive bancassurance partnerships as an AIA Group country operation.", kind: "verified" },
      { text: "Health and medical claims generate higher contact frequency than pure protection products, concentrating servicing load on claims workflows.", kind: "inference" },
      { text: "AIA's regional technology standardization means a local platform decision can be preempted by a group commitment, which is the primary qualification risk.", kind: "inference" },
      { text: "Sector-wide conduct scrutiny after the 2023 bancassurance controversy raises the value of consistent, recorded servicing conversations for every Vietnamese life insurer.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. AIA standardizes technology regionally and country units implement group-selected platforms; the Vietnam entity has no mandate or capability to build conversational infrastructure. The motion is buy-led if and only if the regional door is open.",
    whyNotBuild:
      "Claims and wellness conversations require Vietnamese speech quality, claims-system orchestration, health-data handling under Vietnamese privacy rules, and evaluation evidence. A country unit inside a regionally standardized group will never build these. The right to win is a deployment that fits AIA's regional governance while solving a specifically Vietnamese language and channel problem.",
    workflows: [
      {
        name: "Health claim status and reimbursement guidance",
        friction: "Medical reimbursement claims bounce on missing receipts or documentation; claimants learn days later and call repeatedly for status that exists only internally.",
        outcome: "Document requirements checked at submission, guided re-submission in-channel, and proactive status pushes at every assessment stage.",
        channels: ["Voice", "Zalo", "App", "Web chat"],
        systems: ["Claims management", "Policy administration", "Document management", "Provider network records"],
        value: 3, complexity: 2,
      },
      {
        name: "Policy servicing and change requests",
        friction: "Beneficiary changes, address updates, premium method changes and policy detail questions route through agents or a hotline queue, with paperwork and callbacks for routine items.",
        outcome: "Authenticated policy servicing completed conversationally within policy, with anything requiring underwriting or signature routed to a human with context.",
        channels: ["Voice", "Zalo", "App"],
        systems: ["Policy administration", "Customer identity", "Document generation", "CRM"],
        value: 2, complexity: 2,
      },
      {
        name: "Wellness programme engagement",
        friction: "Wellness and health-programme participation depends on app engagement; customers who lapse out of the app get no conversational nudge and the proposition quietly stops delivering value.",
        outcome: "Conversational engagement on programme status, benefits and rewards in Zalo and voice, bringing non-app users back into the proposition.",
        channels: ["Zalo", "Voice", "App", "SMS"],
        systems: ["Wellness programme platform", "Policy administration", "Rewards and benefits records", "CRM"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A customer mobile app covering policy details, claims submission and wellness programme features",
        "A Vietnamese-language customer hotline for policy servicing and claims",
        "A tied agency force plus exclusive bank partner channels",
        "A Zalo Official Account used for customer notification and interaction",
      ],
      gaps: [
        "Claim document problems are discovered after submission rather than during it",
        "Claim status is not pushed proactively, so status calls dominate inbound volume",
        "Non-app users are effectively excluded from the wellness proposition",
        "Bank-channel policyholders often lack a direct servicing relationship with the insurer",
      ],
    },
    risks: [
      "Vietnam's Personal Data Protection Decree treats health and medical claim data with heightened sensitivity, requiring explicit consent, controlled retention and localization consideration",
      "Vietnamese insurance conduct regulation constrains what an automated channel may state about coverage, exclusions and claim outcomes",
      "AIA Group regional platform commitments may preempt a local decision entirely, so the regional technology relationship must be mapped before serious local investment",
    ],
    economics: {
      volumeMonthly: 380000,
      costPerInteraction: 0.85,
      automationRate: 0.5,
      basis: "Seller assumptions for a foreign life insurer in Vietnam with a health-weighted book; validate claim volumes, contacts per claim and cost per contact in discovery.",
    },
    pilotScope:
      "Automate health claim status and document-guidance conversations on Zalo and voice for medical reimbursement claims, with all assessment decisions retained by human assessors.",
    expansion: [
      "Add authenticated policy servicing and change requests within policy limits",
      "Add wellness programme engagement conversations for non-app users",
      "Extend to bank-channel policyholder servicing and premium collection",
    ],
    stakeholders: [
      "Chief Customer Officer",
      "Head of Claims",
      "Head of Operations",
      "Chief Technology Officer",
      "Head of Compliance",
    ],
    discovery: [
      "What share of medical reimbursement claims require at least one document re-submission?",
      "What regional AIA platform commitments already cover conversational or contact-centre capability?",
      "How many claim contacts are pure status checks a proactive update would eliminate?",
      "What proportion of your policyholders never use the app at all?",
    ],
    flowTemplate: "claims",
    scenario: "A member in Ho Chi Minh City submitting a hospital reimbursement on Zalo is told immediately that one receipt is missing, re-uploads it in the same thread, and tracks assessment without calling.",
  },

  "saigon-coop": {
    operatingContext:
      "Saigon Co.op is Vietnam's largest domestic grocery retailer, operating the Co.opmart supermarket network alongside Co.opXtra hypermarkets, Co.op Food convenience stores and an online ordering channel, with a cooperative heritage and strong presence in Ho Chi Minh City and the southern provinces. Its customers are mainstream Vietnamese households buying fresh food and daily goods, with a large membership base tied to a loyalty programme that anchors repeat purchase. Online grocery, accelerated by pandemic-era habits, brought a contact profile the chain never had before: substitution decisions, missing items, delivery-window changes and refund requests, all time-sensitive because the goods are perishable. Contact today runs through store hotlines, a central customer line, Zalo and Facebook, with Zalo the practical default for Vietnamese consumers.",
    strategicPressure: [
      { text: "Saigon Co.op operates the Co.opmart network as Vietnam's largest domestic grocery retailer with multiple store formats and an online channel.", kind: "verified" },
      { text: "Online grocery generates exception-heavy contacts per order that a store-anchored support model was never designed to absorb.", kind: "inference" },
      { text: "Competition from modern-trade rivals and quick-commerce platforms puts direct pressure on service responsiveness and delivery reliability.", kind: "inference" },
      { text: "A cooperative-rooted organization has thin technology staffing, so capability must be bought and operated with vendor support.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Saigon Co.op is a retail operating organization with a cooperative governance structure and no software-engineering culture. Its technology comes from vendors, and conversational automation would follow the same path.",
    whyNotBuild:
      "Grocery service conversations need Vietnamese speech quality, live grounding in order, inventory and delivery systems, substitution decision logic bounded by policy, and refund authority controls. A grocer will not build speech and orchestration. The right to win is packaged automation that resolves perishable-order exceptions inside the delivery window.",
    workflows: [
      {
        name: "Delivery order issue resolution",
        friction: "Missing items, substitutions and late deliveries are reported by phone and Zalo; staff check the order and call the store, and refunds need supervisor approval, while the customer waits with a meal to cook.",
        outcome: "Order verified against live data with substitution confirmation, redelivery or refund applied within an approved matrix in-conversation.",
        channels: ["Zalo", "Voice", "App", "Web chat"],
        systems: ["Order management", "Store inventory", "Delivery dispatch", "Payments and refunds"],
        value: 3, complexity: 2,
      },
      {
        name: "Loyalty and membership servicing",
        friction: "Members ask about points, member pricing, missing transaction credits and card renewals at store service counters or by phone, with inconsistent answers across stores.",
        outcome: "Authenticated loyalty conversations resolving balances, missing-point claims and renewals directly, freeing counter staff for in-store service.",
        channels: ["Zalo", "Voice", "App"],
        systems: ["Loyalty platform", "POS transaction history", "Member records", "Promo engine"],
        value: 2, complexity: 1,
      },
      {
        name: "Promotion and product availability queries",
        friction: "Customers call stores to ask whether a promotion applies and whether an item is in stock; staff must check physically and calls go unanswered at trading peaks.",
        outcome: "Grounded promo terms and store-level availability answers with nearby-store alternatives, deflecting store phone load entirely.",
        channels: ["Zalo", "Voice", "Web chat"],
        systems: ["Promo and pricing engine", "Store inventory", "Merchandising system", "Store operations"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "An online grocery ordering channel with home delivery from Co.opmart stores",
        "A loyalty membership programme covering a large base of Vietnamese households",
        "Store-level customer service counters and hotlines handling most enquiries",
        "A Zalo Official Account and social pages used for promotions and customer messages",
      ],
      gaps: [
        "Customers cannot get an order exception resolved inside the delivery window without a human",
        "Substitution decisions require a call rather than an in-conversation confirmation",
        "Store-level stock and promo answers depend on staff physically checking",
        "Loyalty questions are answered inconsistently across stores and formats",
      ],
    },
    risks: [
      "Vietnam's Personal Data Protection Decree governs member purchase histories, delivery addresses and contact data used to personalize conversations, including consent and localization",
      "Consumer-protection rules on advertised promotions and pricing mean conversational statements about promo eligibility and price must be grounded in live system data",
      "Perishable-goods service failures carry food-safety and reputational sensitivity; refund and redelivery authority must be bounded and every decision logged",
    ],
    economics: {
      volumeMonthly: 900000,
      costPerInteraction: 0.55,
      automationRate: 0.6,
      basis: "Seller assumptions for Vietnam's largest domestic grocery retailer combining online order support, loyalty and store queries; validate online order volumes, contacts per order and cost per contact in discovery.",
    },
    pilotScope:
      "Automate online grocery order-issue resolution on Zalo and voice for Ho Chi Minh City stores, including substitution confirmation and refunds within an approved matrix.",
    expansion: [
      "Add loyalty and membership servicing including points and missing-transaction claims",
      "Add promotion and store-level availability conversations across formats",
      "Extend nationwide with proactive delivery-exception notification",
    ],
    stakeholders: [
      "Deputy General Director, Operations",
      "Head of E-commerce / Online Channel",
      "Head of Marketing and Loyalty",
      "Head of Information Technology",
      "Head of Store Operations",
    ],
    discovery: [
      "How many contacts does an average online grocery order generate, and what share are substitutions?",
      "What refund and redelivery authority could an automated channel exercise without supervisor sign-off?",
      "Can your order and inventory systems expose live data to an external conversational channel?",
      "How much store-staff time goes to answering phone queries about stock and promotions?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A Co.opmart online shopper in District 7 whose fish is out of stock approves a substitution on Zalo before the driver leaves, instead of discovering the gap at the door.",
  },

  "fpt-retail-long-chau": {
    operatingContext:
      "FPT Retail is FPT Corporation's consumer retail arm, running the FPT Shop electronics chain and, far more consequentially now, the Long Chau pharmacy network which has grown past a thousand stores to become Vietnam's leading pharmacy retailer. Long Chau has extended beyond dispensing into vaccination centres, which turns it into an appointment-driven healthcare operator with scheduling, recall and reminder obligations rather than a pure retailer. Its customers are mainstream Vietnamese households buying prescription and over-the-counter medicine, chronic-condition patients on repeat therapy, and families booking vaccination courses with multi-dose schedules. Contact runs through store staff, a hotline, an app and Zalo, and the volume is enormous because medicine and vaccination questions are frequent, specific and time-sensitive.",
    strategicPressure: [
      { text: "Long Chau has grown into Vietnam's largest pharmacy chain by store count and has expanded into vaccination services, under FPT Retail.", kind: "verified" },
      { text: "Vaccination courses with multi-dose schedules create recall and reminder obligations that pure retail operations never had.", kind: "inference" },
      { text: "FPT Corporation has substantial in-house AI and software engineering capability, which changes the sale from a packaged product to a co-build.", kind: "verified" },
      { text: "Chronic-medication customers represent predictable repeat demand that proactive refill conversations could materially increase.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Co-build. Long Chau sits inside FPT, a genuine software and AI engineering group with its own model and platform ambitions. Selling a packaged suite into that environment is unrealistic; the credible motion is co-building on models, speech infrastructure and orchestration where FPT's teams want acceleration rather than replacement.",
    whyNotBuild:
      "FPT can build applications and integrations, and will. What is harder for any national engineering group is production-grade Vietnamese speech at telephony latency across provincial accents with pharmaceutical vocabulary, plus a rigorous evaluation harness for clinical-adjacent conversations. The right to win is supplying those layers and the governance framework, not the customer experience itself.",
    workflows: [
      {
        name: "Vaccination appointment booking and dose recall",
        friction: "Vaccination bookings and multi-dose follow-ups are handled by store staff and hotline; missed second and third doses are discovered only when nobody arrives, and recall depends on manual lists.",
        outcome: "Appointments booked conversationally against live centre capacity, with automatic dose-schedule recall and one-tap rescheduling.",
        channels: ["Zalo", "Voice", "App", "SMS"],
        systems: ["Vaccination scheduling system", "Patient and immunization records", "Store and centre capacity", "Notification services"],
        value: 3, complexity: 3,
      },
      {
        name: "Medicine availability and store routing",
        friction: "Customers call stores to ask whether a specific medicine is stocked; staff leave the counter to check, calls go unanswered at peak, and customers travel to stores that do not have the item.",
        outcome: "Live store-level availability with nearby alternatives and reservation, cutting wasted trips and store phone load.",
        channels: ["Zalo", "Voice", "App"],
        systems: ["Store inventory", "Product master and pricing", "Reservation and click-and-collect", "Store operations"],
        value: 3, complexity: 2,
      },
      {
        name: "Chronic-medication refill reminders",
        friction: "Repeat-therapy customers are not proactively reminded, so refills lapse and revenue leaks to whichever pharmacy is nearest when they finally remember.",
        outcome: "Timed refill conversations based on purchase history, with reservation or delivery arranged in-channel and pharmacist escalation for clinical questions.",
        channels: ["Zalo", "Voice", "SMS"],
        systems: ["Purchase history", "Store inventory", "Delivery and fulfilment", "Customer records"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A Long Chau mobile app and online ordering channel with delivery",
        "Store-level pharmacist and staff service across a network of over a thousand pharmacies",
        "Vaccination centres with an appointment booking capability",
        "A Zalo Official Account and hotline used for orders, bookings and enquiries",
      ],
      gaps: [
        "Customers cannot confirm store-level medicine availability without a phone call that often goes unanswered",
        "Multi-dose vaccination recall depends on manual follow-up rather than automated conversation",
        "Chronic-medication customers receive no proactive refill contact",
        "Clinical questions arriving in digital channels have no structured route to a pharmacist",
      ],
    },
    risks: [
      "Vietnamese pharmacy and health regulation requires that clinical advice come from qualified pharmacists; automated channels must never advise on dosage or indication and every clinical signal must escalate",
      "Vietnam's Personal Data Protection Decree treats prescription and immunization records as sensitive data, requiring consent, controlled retention and localization consideration",
      "FPT's internal AI teams may already own parts of this roadmap, so scope must be negotiated explicitly to avoid competing with the customer's own engineering agenda",
    ],
    economics: {
      volumeMonthly: 2500000,
      costPerInteraction: 0.55,
      automationRate: 0.6,
      basis: "Seller assumptions for Vietnam's largest pharmacy chain including store phone traffic, vaccination bookings and refill contact; validate store call volumes, booking volumes and cost per contact in discovery.",
    },
    pilotScope:
      "Co-build Vietnamese voice and Zalo automation for vaccination appointment booking and dose recall across vaccination centres in one city, with clinical questions escalated to pharmacists.",
    expansion: [
      "Add store-level medicine availability and reservation conversations",
      "Add chronic-medication refill reminder conversations based on purchase history",
      "Extend to FPT Shop electronics service and warranty conversations across the retail group",
    ],
    stakeholders: [
      "Chief Executive Officer, FPT Retail",
      "Head of Long Chau Pharmacy Chain",
      "Head of Vaccination Services",
      "Chief Technology Officer / FPT AI leadership",
      "Head of Customer Experience",
    ],
    discovery: [
      "What conversational tooling have FPT's internal AI teams already shipped for Long Chau, and where do they want help?",
      "What is your completion rate on multi-dose vaccination courses, and how is recall handled today?",
      "How many phone calls does a typical Long Chau store take per day, and how much staff time do they consume?",
      "Where does your current Vietnamese speech stack fall short on pharmaceutical vocabulary and provincial accents?",
    ],
    flowTemplate: "appointments",
    scenario: "A parent in Da Nang books her child's second vaccine dose on Zalo, gets a reminder three days before with directions and preparation notes, and reschedules in one tap when work intervenes.",
  },

  "pnj": {
    operatingContext:
      "PNJ is Vietnam's leading jewelry manufacturer and retailer, operating hundreds of stores nationwide under a vertically integrated model that spans design, manufacturing and retail, with gold and gem jewelry as the core product. Its business is intensely seasonal around Tet and the God of Wealth day in the first lunar month, when gold buying spikes and stores and hotlines are overwhelmed within hours. Jewelry is a high-consideration purchase, so conversations start well before the sale: price and design enquiries, custom-order status, availability across stores, and after-sale buyback, exchange and warranty questions that recur for years. Contact runs through stores, a hotline, Zalo and Facebook, with Zalo the practical default channel for Vietnamese consumers.",
    strategicPressure: [
      { text: "PNJ is Vietnam's largest jewelry retailer with a nationwide store network and a vertically integrated manufacturing operation.", kind: "verified" },
      { text: "Gold-buying seasonality around Tet and God of Wealth day creates extreme, predictable demand spikes that fixed store and hotline capacity cannot absorb.", kind: "verified" },
      { text: "High-consideration purchases mean pre-sale conversation quality directly determines conversion, and those conversations often start outside store hours.", kind: "inference" },
      { text: "Buyback and exchange enquiries tie customers back to PNJ years after purchase, making after-sale conversation a retention asset rather than a cost.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. PNJ is a manufacturer and retailer whose investment goes into design, production and store expansion; its technology is procured. There is no engineering base for conversational infrastructure and no strategic reason to create one.",
    whyNotBuild:
      "Jewelry conversations need Vietnamese speech quality, live grounding in fluctuating gold pricing and store-level inventory, custom-order workflow visibility, and surge capacity that matters only a few days a year. No jewelry retailer builds that. The right to win is elastic, grounded conversational capacity that turns Tet spikes from a service failure into a selling opportunity.",
    workflows: [
      {
        name: "Custom-order status and collection",
        friction: "Customers who commission or resize a piece call stores for progress; staff check with the workshop and call back, and the customer chases repeatedly through a multi-week wait.",
        outcome: "Live custom-order status delivered conversationally with proactive updates at each production stage and collection scheduling in-channel.",
        channels: ["Zalo", "Voice", "SMS"],
        systems: ["Custom order and workshop tracking", "Store operations", "Customer records", "CRM"],
        value: 2, complexity: 2,
      },
      {
        name: "Price, buyback and availability enquiries",
        friction: "Gold price, buyback terms and product availability questions spike enormously on auspicious buying days; hotlines and stores saturate and customers who cannot get through simply go elsewhere.",
        outcome: "Grounded pricing, buyback policy and store-level availability answers with elastic capacity through peak days, and appointment booking for high-value visits.",
        channels: ["Zalo", "Voice", "Web chat"],
        systems: ["Gold pricing feed", "Product and store inventory", "Buyback policy rules", "Appointment scheduling"],
        value: 3, complexity: 2,
      },
      {
        name: "After-sale service and warranty",
        friction: "Cleaning, resizing, repair and warranty questions are handled at store counters, so customers travel to ask what is possible and what it costs before deciding anything.",
        outcome: "Service options, timelines and pricing answered conversationally with store appointments booked, reducing wasted visits and counter load.",
        channels: ["Zalo", "Voice", "Web chat"],
        systems: ["Service and repair workflow", "Warranty records", "Store capacity", "Customer purchase history"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: [
        "A nationwide store network with counter staff handling most customer conversations",
        "An online store and mobile app for browsing and purchase",
        "A Zalo Official Account and social pages used for promotions and customer enquiries",
        "A customer hotline for product, pricing and service questions",
      ],
      gaps: [
        "Customers cannot get an authoritative gold price and buyback answer outside store hours",
        "Custom-order progress requires chasing a store which chases the workshop",
        "Peak buying days have no elastic contact capacity, so demand is lost rather than queued",
        "Store-level product availability cannot be confirmed before travelling",
      ],
    },
    risks: [
      "Gold trading in Vietnam is subject to State Bank of Vietnam oversight, and any conversational statement about gold pricing or buyback terms must be grounded in live authorized data rather than model recall",
      "Vietnam's Personal Data Protection Decree governs customer purchase histories and contact data used to personalize high-value jewelry conversations",
      "Extreme concurrency on auspicious buying days must be load-proven in advance; a failure on God of Wealth day would be worse than not deploying at all",
    ],
    economics: {
      volumeMonthly: 350000,
      costPerInteraction: 0.7,
      automationRate: 0.5,
      basis: "Seller assumptions for a national Vietnamese jewelry retailer with extreme seasonal peaks; validate baseline and peak-day contact volumes, channel mix and cost per contact in discovery.",
    },
    pilotScope:
      "Automate pricing, availability and buyback-policy conversations on Zalo and voice ahead of a peak buying season, with appointment booking for high-value store visits.",
    expansion: [
      "Add custom-order status tracking with proactive production-stage updates",
      "Add after-sale service, repair and warranty conversations with store appointment booking",
      "Extend to proactive occasion marketing and loyalty conversations across the store network",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Retail Operations",
      "Chief Marketing Officer",
      "Head of Information Technology",
      "Head of Customer Service",
    ],
    discovery: [
      "How many contacts do you take on God of Wealth day versus an average day, and how many go unanswered?",
      "What share of sales conversations begin on Zalo or the hotline rather than in-store?",
      "Can live gold pricing and store-level inventory be exposed to an external conversational channel?",
      "How long does a custom order take, and how many times does a customer chase it?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A customer in Hanoi asks on Zalo at 6am on God of Wealth day for today's gold price and which nearby PNJ store has the ring in her size, and books a store appointment before the queue forms.",
  },

  "golden-gate-group": {
    operatingContext:
      "Golden Gate Group is Vietnam's largest restaurant company, running hundreds of outlets across hotpot, barbecue and casual-dining brands including Kichi-Kichi, Gogi House, Manwah and others, concentrated in Hanoi and Ho Chi Minh City with a growing provincial footprint. Its formats are reservation-dependent in a way most restaurant groups are not: hotpot and barbecue dining is a group occasion booked in advance, so table availability, party size and timing are the core commercial conversation. Bookings arrive by phone to individual outlets, through Zalo and Facebook messages, through the group's own app and website, and via walk-in waitlists that peak brutally on weekends and holidays. Because each brand and outlet handles bookings semi-independently, a customer's experience depends on which outlet answers the phone.",
    strategicPressure: [
      { text: "Golden Gate operates hundreds of outlets across multiple hotpot and barbecue brands, making it Vietnam's largest restaurant group.", kind: "verified" },
      { text: "Group-occasion dining formats make advance reservation the central customer conversation rather than an optional convenience.", kind: "inference" },
      { text: "Reservation demand peaks in narrow evening and holiday windows when outlet staff are least able to answer phones.", kind: "inference" },
      { text: "Unanswered booking enquiries convert directly into lost covers, so contact capacity is a revenue constraint rather than a service metric.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A restaurant group's capital goes into outlets, kitchens and brand development; technology is procured for POS, reservation and delivery. There is no software-engineering base and no reason to build one.",
    whyNotBuild:
      "Reservation automation needs Vietnamese speech quality in noisy conditions, live table-inventory grounding across brands and outlets, waitlist logic, and peak-hour concurrency. Building that competes with opening restaurants. The right to win is packaged booking automation whose value is measurable in captured covers on a Saturday night.",
    workflows: [
      {
        name: "Reservation booking across brands",
        friction: "Booking calls hit outlets at exactly the hour staff are seating guests; many go unanswered, availability is checked manually, and a customer who cannot reach one brand simply books a competitor.",
        outcome: "Reservations captured conversationally against live table availability across brands and nearby outlets, at any hour, with confirmations and reminders.",
        channels: ["Zalo", "Voice", "App", "Web chat"],
        systems: ["Reservation and table management", "Outlet capacity", "Brand and menu catalogue", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Waitlist and no-show management",
        friction: "Weekend waitlists are managed on paper at the door, no-shows hold tables that could have been sold, and there is no reminder loop for confirmed bookings.",
        outcome: "Waitlist positions communicated conversationally with confirmation prompts and one-tap release, and cancelled tables offered to waiting customers automatically.",
        channels: ["Zalo", "SMS", "Voice"],
        systems: ["Table management", "Waitlist system", "Customer records", "Notification services"],
        value: 3, complexity: 2,
      },
      {
        name: "Group events and private bookings",
        friction: "Company parties, birthdays and large group bookings are high-value enquiries handled ad hoc by whoever answers, with inconsistent pricing and menu answers and no follow-up on unclosed enquiries.",
        outcome: "Structured event enquiry capture with grounded package pricing and capacity checks, booked or routed to an outlet manager with full context.",
        channels: ["Zalo", "Voice", "Web chat", "Email"],
        systems: ["Event package catalogue", "Outlet capacity", "Reservation system", "CRM"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Outlet-level phone booking handled by restaurant staff",
        "Brand websites, a group app and delivery channels for ordering",
        "Zalo Official Accounts and Facebook pages used for promotions and booking messages",
        "A loyalty and membership programme linking diners across brands",
      ],
      gaps: [
        "Booking calls at peak go unanswered, converting directly into lost covers",
        "There is no consistent conversational booking path across brands and outlets",
        "No-show and waitlist management is manual with no confirmation loop",
        "High-value group event enquiries are handled inconsistently and often never followed up",
      ],
    },
    risks: [
      "Vietnam's Personal Data Protection Decree governs diner contact details, booking histories and loyalty data used conversationally, including consent for reminders and marketing",
      "Decrees restricting unsolicited calls and messages constrain proactive reminder and promotional outreach, so consent capture at booking is essential",
      "Menu, price and availability differ by brand and outlet; ungrounded answers would create seating failures at the door, so live reservation-system integration is a prerequisite",
    ],
    economics: {
      volumeMonthly: 450000,
      costPerInteraction: 0.5,
      automationRate: 0.6,
      basis: "Seller assumptions for Vietnam's largest restaurant group covering reservation, waitlist and event contact; validate booking volumes, unanswered-call rates at peak and average cover value in discovery.",
    },
    pilotScope:
      "Automate reservation booking and confirmation on Zalo and voice for one brand in Hanoi, grounded in live table availability, with peak-hour capture rate as the primary measure.",
    expansion: [
      "Add waitlist management, no-show confirmation and released-table reallocation",
      "Add group event and private booking enquiry capture with package pricing",
      "Extend across all brands and cities with proactive occasion and loyalty conversations",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Brand Director",
      "Head of Marketing / Loyalty",
      "Head of Information Technology",
      "Head of Restaurant Operations",
    ],
    discovery: [
      "What proportion of booking calls at Friday and Saturday peak go unanswered?",
      "What reservation system do outlets use, and can it expose live table availability?",
      "What is your no-show rate on confirmed bookings and what does an empty table cost you?",
      "How many group event enquiries arrive per month and what share convert today?",
    ],
    flowTemplate: "appointments",
    scenario: "A group of six booking Kichi-Kichi for Saturday evening reserves on Zalo at 11pm against live table availability, and gets a confirmation prompt that frees the table when plans change.",
  },

  "highlands-coffee": {
    operatingContext:
      "Highlands Coffee is Vietnam's largest coffee chain by store count, with a dense urban footprint in Ho Chi Minh City, Hanoi and provincial cities, majority-owned by Jollibee Foods Corporation but operated from Vietnam with a distinctly local brand identity. Its business is high-frequency, low-ticket daily purchase, increasingly mediated by an app with ordering, payment and loyalty, plus delivery through aggregator platforms and its own channels. That mix produces a specific contact profile: app order failures, payment and loyalty point disputes, delivery issues, and store-level questions about hours, locations and promotions, all at high volume and low individual value. Contact arrives on Zalo, Facebook, the app and a hotline, in Vietnamese with some English for expatriate and tourist customers.",
    strategicPressure: [
      { text: "Highlands Coffee operates the largest coffee chain footprint in Vietnam and is majority-owned by Jollibee Foods Corporation.", kind: "verified" },
      { text: "App-mediated ordering and loyalty shifts customer problems from the counter to digital support, where no equivalent capacity was built.", kind: "inference" },
      { text: "Low ticket value means any human-handled contact costs more than the transaction it concerns, making automation an economic necessity rather than an efficiency play.", kind: "inference" },
      { text: "Jollibee group ownership may route significant technology decisions through Manila, which is the primary qualification question.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A coffee chain operator invests in stores, supply chain and brand; technology is procured for POS, app and loyalty. There is no engineering base for conversational infrastructure at either the local or group level for this category of capability.",
    whyNotBuild:
      "Resolving app order and loyalty problems conversationally needs Vietnamese speech and messaging quality, live order and loyalty grounding, and bounded refund authority. A chain operator will not build that for a product costing a couple of dollars. The right to win is automation whose cost per contact is compatible with a coffee-sized transaction.",
    workflows: [
      {
        name: "App order and payment issue resolution",
        friction: "Orders that fail after payment, or arrive wrong, are reported on Zalo and the hotline; agents check the order and payment systems and refunds need approval, so the customer waits days over a small amount.",
        outcome: "Order and payment state verified conversationally with refunds or credits applied within an approved matrix immediately.",
        channels: ["Zalo", "App chat", "Voice", "Messenger"],
        systems: ["Order management", "Payment gateway", "Loyalty platform", "Store operations"],
        value: 3, complexity: 2,
      },
      {
        name: "Loyalty points and voucher servicing",
        friction: "Missing points, expired vouchers and tier questions generate constant low-value contacts that consume full agent handle time each.",
        outcome: "Authenticated loyalty answers and missing-point corrections handled in-conversation with consistent policy application.",
        channels: ["Zalo", "App chat", "Voice"],
        systems: ["Loyalty platform", "POS and order history", "Voucher and promo engine", "Customer records"],
        value: 2, complexity: 1,
      },
      {
        name: "Store information and delivery queries",
        friction: "Questions about store hours, locations, seating, promotions and delivery availability arrive constantly across social channels and are answered manually or not at all.",
        outcome: "Grounded store, promo and delivery answers instantly in Vietnamese or English, deflecting the entire routine layer of contact.",
        channels: ["Zalo", "Messenger", "Voice", "Web chat"],
        systems: ["Store directory and hours", "Promo engine", "Delivery coverage data", "Order management"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: [
        "A mobile app with ordering, payment and loyalty features",
        "A Zalo Official Account and Facebook page used for promotions and customer messages",
        "Delivery through aggregator platforms and the brand's own channels",
        "A customer hotline and email for complaints and order issues",
      ],
      gaps: [
        "Small-value refunds require human approval and take days, which costs more than the refund",
        "Loyalty point corrections cannot be made inside a conversation",
        "Routine store and promo questions consume human attention at high volume",
        "No consistent English coverage for expatriate and tourist customers in urban stores",
      ],
    },
    risks: [
      "Vietnam's Personal Data Protection Decree governs loyalty, order and payment reference data used conversationally, including consent and localization considerations",
      "Consumer-protection rules on promotions and pricing require that conversationally stated promo terms match live system truth",
      "Jollibee group technology governance may route platform decisions through Manila, extending the approval path and possibly imposing group vendor standards",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 0.5,
      automationRate: 0.65,
      basis: "Seller assumptions for Vietnam's largest coffee chain with app-mediated ordering and loyalty; validate app order volumes, contact rate per order and cost per contact in discovery.",
    },
    pilotScope:
      "Automate app order, payment and loyalty issue resolution on Zalo and in-app chat with refunds and point corrections bounded by an approved matrix.",
    expansion: [
      "Add store information, promotion and delivery-coverage conversations",
      "Add proactive order-failure detection and outreach before the customer complains",
      "Extend to English coverage and to aggregator-sourced order issues where data sharing allows",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Head of Digital and App",
      "Head of Marketing / Loyalty",
      "Head of Information Technology",
      "Head of Customer Service",
    ],
    discovery: [
      "What does a human-handled contact cost you against the value of a typical order?",
      "How many app orders fail after payment each month, and how are refunds handled today?",
      "Does Jollibee group ownership route technology decisions through Manila?",
      "What share of your customer contacts are pure store-information questions?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A customer whose Highlands app order was charged but never made gets it verified and refunded on Zalo within two minutes, instead of waiting three days for a hotline callback.",
  },

  "bamboo-airways": {
    operatingContext:
      "Bamboo Airways is a private Vietnamese carrier that expanded rapidly, then went through a substantial restructuring that shrank its fleet and network to a focused domestic operation with a small international presence. The result is an airline running lean in every function, including customer service, while still carrying the full customer-communication burden that aviation imposes: bookings, changes, baggage questions, and above all disruption. Every delay, cancellation or schedule change floods a small service organization with rebooking and refund demands, and refund processing for a restructured carrier carries additional customer anxiety and scrutiny. Contact arrives by hotline, website and app, ticket offices, agents and Zalo, mostly in Vietnamese with English for international routes.",
    strategicPressure: [
      { text: "Bamboo Airways went through a significant restructuring that reduced its fleet and route network to a more focused operation.", kind: "verified" },
      { text: "A restructured carrier has neither the capital nor the engineering capacity for platform builds, making cost-per-contact reduction one of the few viable CX investments.", kind: "inference" },
      { text: "Refund-status enquiries are unusually sensitive for a carrier that has restructured, because customers actively worry about whether money will be returned.", kind: "inference" },
      { text: "Disruption events on a lean network cause proportionally larger service collapses than at carriers with spare capacity and larger contact centres.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. Post-restructuring, capital discipline is absolute and technology capacity is minimal. Any customer-service capability must be purchased with a payback measured in months and no meaningful implementation burden on internal teams.",
    whyNotBuild:
      "Disruption handling requires elastic capacity, live reservation-system grounding, fare-rule-bounded rebooking, and Vietnamese and English conversational quality. A lean airline cannot assemble that. The right to win is surge-absorbing rebooking and refund-status automation that costs less per contact than the hotline it replaces.",
    workflows: [
      {
        name: "Disruption rebooking",
        friction: "A cancellation or long delay produces simultaneous demand from every affected passenger; the hotline saturates within minutes and rebooking options are read out one passenger at a time.",
        outcome: "Affected passengers notified proactively with live alternative flights offered and rebooking confirmed in-conversation within fare rules.",
        channels: ["Zalo", "Voice", "SMS", "App"],
        systems: ["Passenger service system / reservations", "Flight schedule and inventory", "Notification services", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Refund status transparency",
        friction: "Refund requests disappear into a queue with no visible status; anxious passengers call repeatedly, and each call costs money without moving the refund forward.",
        outcome: "Live refund status from the payments pipeline delivered proactively at each stage, removing the repeat-call cycle entirely.",
        channels: ["Zalo", "Voice", "SMS", "Email"],
        systems: ["Refund and payments pipeline", "Reservation system", "Finance and settlement records", "CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Booking servicing and ancillary sales",
        friction: "Baggage allowance, seat selection, name correction and change-fee questions occupy the hotline; ancillary upsell opportunities are missed because nobody has time to offer them.",
        outcome: "Booking questions answered and changes executed within fare rules, with relevant ancillaries offered conversationally and paid in-channel.",
        channels: ["Zalo", "Voice", "App", "Web chat"],
        systems: ["Reservation system", "Fare and ancillary rules", "Payment gateway", "Customer records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A booking website and mobile app with online check-in",
        "A customer hotline and ticket offices for reservations and changes",
        "A Zalo Official Account and social pages used for advisories and customer messages",
        "Travel agent and OTA distribution carrying a share of bookings",
      ],
      gaps: [
        "Passengers cannot self-rebook a disrupted flight conversationally",
        "Refund status is invisible, driving anxious repeat contact from a customer base already sensitive about it",
        "Disruption events have no elastic contact capacity for a lean service organization",
        "Passengers who booked through agents or OTAs have no direct servicing route",
      ],
    },
    risks: [
      "Civil Aviation Authority of Vietnam rules on passenger rights, delay compensation and refund timelines constrain what an automated channel may commit to; fare and regulatory rules must bound every offer",
      "Vietnam's Personal Data Protection Decree governs passenger contact details and booking data used in conversations, with consent required for proactive messaging",
      "Post-restructuring financial capacity is the primary commercial risk; the commercial model must be usage-based with a payback the airline can evidence quickly",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 0.8,
      automationRate: 0.55,
      basis: "Seller assumptions for a lean domestic Vietnamese carrier with disruption-driven peaks; validate passenger volumes, contacts per disruption event and current cost per contact in discovery.",
    },
    pilotScope:
      "Automate disruption notification, rebooking and refund-status conversations on Zalo and voice for domestic routes, with rebooking written into the reservation system where fare rules permit.",
    expansion: [
      "Add booking servicing, baggage and seat-selection conversations with in-channel payment",
      "Add ancillary offers within the servicing conversation",
      "Extend to international routes with English coverage and agent-booked passenger servicing",
    ],
    stakeholders: [
      "Chief Commercial Officer",
      "Head of Customer Service",
      "Head of Revenue / Ancillary",
      "Chief Information Officer",
      "Head of Ground Operations",
    ],
    discovery: [
      "How many contacts does a single cancellation generate, and how long does the hotline stay saturated?",
      "What is your current refund processing time and how many status calls does each refund generate?",
      "Can your reservation system accept a rebooking from an authenticated external channel?",
      "What commercial model would fit your post-restructuring capital constraints?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "Passengers on a cancelled Hanoi-Da Nang flight get a Zalo message with two alternative departures and rebook in one exchange, while the hotline stays reachable for the cases that need a human.",
  },

  "saigontourist": {
    operatingContext:
      "Saigontourist Group is a state-owned tourism and hospitality conglomerate operating hotels, resorts, restaurants, and one of Vietnam's largest travel and tour operations, with assets concentrated in Ho Chi Minh City and across the country's major destinations. Its customers span domestic Vietnamese leisure and corporate travellers, inbound international tourists, and MICE and group business booked through corporate and agency channels. As inbound tourism recovers, the language mix has broadened well beyond Vietnamese and English into Korean, Chinese and other source markets, while booking and enquiry channels remain heavily phone, email and agent-mediated. As a state enterprise, technology is procured through tender processes and decisions are distributed across subsidiaries rather than centralized.",
    strategicPressure: [
      { text: "Saigontourist Group is a state-owned tourism conglomerate operating hotels, restaurants and travel services across Vietnam.", kind: "verified" },
      { text: "Inbound tourism recovery has broadened the language mix toward Korean and Chinese source markets that Vietnamese and English staffing cannot cover.", kind: "inference" },
      { text: "Booking and enquiry handling remains phone and email heavy, so response speed depends on staff availability rather than on demand.", kind: "inference" },
      { text: "State-enterprise procurement means the realistic entry point is a single subsidiary pilot rather than a group-wide decision.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A state hospitality conglomerate procures customer-facing technology through tenders; its subsidiaries operate hotels and tours, not software. There is no engineering capability or mandate to build conversational platforms.",
    whyNotBuild:
      "Multilingual booking conversations require speech and language quality across Vietnamese, English, Korean and Mandarin, live grounding in property and tour inventory, and orchestration across subsidiary systems. No hospitality operator builds that. The right to win is multilingual conversational capacity that captures enquiries the current staffing model simply loses.",
    workflows: [
      {
        name: "Multilingual booking and enquiry handling",
        friction: "Hotel and tour enquiries arrive by phone and email in several languages; responses depend on which staff member is available and which languages they speak, and after-hours enquiries wait until morning.",
        outcome: "Enquiries engaged immediately in the customer's language with grounded availability and pricing, and bookings confirmed or routed to reservations with full context.",
        channels: ["Voice", "Zalo", "Web chat", "Email"],
        systems: ["Property management / reservation system", "Tour inventory and pricing", "CRM", "Payment gateway"],
        value: 3, complexity: 2,
      },
      {
        name: "Itinerary changes and pre-arrival coordination",
        friction: "Tour customers requesting itinerary changes, transfer timings or special requirements phone the operator repeatedly, and confirmations arrive by email if at all.",
        outcome: "Change requests captured and confirmed conversationally against live tour operations, with pre-arrival information delivered proactively in the traveller's language.",
        channels: ["Voice", "Zalo", "Email", "SMS"],
        systems: ["Tour operations system", "Transfer and transport scheduling", "Guest records", "Notification services"],
        value: 2, complexity: 2,
      },
      {
        name: "Group and MICE enquiry capture",
        friction: "Corporate group, event and MICE enquiries are high-value and handled by sales staff during office hours; enquiries arriving outside those hours or in unsupported languages are effectively lost.",
        outcome: "Structured group enquiry capture with requirements, dates and capacity checked, routed to the right property or sales team with a complete brief.",
        channels: ["Voice", "Email", "Web chat", "Zalo"],
        systems: ["Sales and event management", "Property capacity and function space", "CRM", "Pricing rules"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Hotel and tour booking websites and reservation desks across subsidiary properties",
        "Phone and email enquiry handling by property and tour operation staff",
        "Travel agency and OTA distribution carrying international bookings",
        "Zalo and social channels used for domestic customer communication",
      ],
      gaps: [
        "Enquiries in Korean or Mandarin depend on whether a language-capable staff member is on shift",
        "After-hours enquiries receive no response until the next working day",
        "Itinerary change requests produce no tracked confirmation the traveller can rely on",
        "High-value group and MICE enquiries arriving outside office hours are lost entirely",
      ],
    },
    risks: [
      "State-enterprise procurement rules require tender processes and multi-level approval, which lengthens the sales cycle and constrains contracting flexibility",
      "Vietnam's Personal Data Protection Decree governs guest and traveller data, with additional care needed for international visitors whose home-jurisdiction expectations differ",
      "Korean and Mandarin conversational quality in a hospitality context must be benchmarked properly; a poor experience with international guests damages the brand more than no automation at all",
    ],
    economics: {
      volumeMonthly: 200000,
      costPerInteraction: 0.9,
      automationRate: 0.5,
      basis: "Seller assumptions across hotel, restaurant and tour enquiry contact for a Vietnamese state tourism group; validate enquiry volumes by subsidiary, language mix and cost per enquiry in discovery.",
    },
    pilotScope:
      "Automate multilingual hotel booking and enquiry handling for one flagship property across voice and web chat in Vietnamese, English, Korean and Mandarin, with reservations confirmed or routed with full context.",
    expansion: [
      "Add tour itinerary change handling and proactive pre-arrival coordination",
      "Add group and MICE enquiry capture with capacity checks and sales routing",
      "Extend across additional properties and the travel services subsidiary",
    ],
    stakeholders: [
      "Deputy General Director, Group",
      "General Manager, flagship property",
      "Head of Travel Services / Tour Operations",
      "Head of Information Technology",
      "Head of Sales and Marketing",
    ],
    discovery: [
      "Which subsidiary would pilot first and who signs off on a technology procurement there?",
      "What share of enquiries arrive in Korean or Mandarin, and how are they handled today?",
      "How many enquiries arrive outside office hours and what happens to them?",
      "Can your property management and tour systems expose live availability to an external channel?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A Korean traveller enquiring about a Saigontourist resort at midnight Seoul time is answered in Korean within a minute with live availability and a held booking, instead of an email reply two days later.",
  },

  "viettel-post": {
    operatingContext:
      "Viettel Post is the listed logistics arm of the Viettel group, operating one of Vietnam's largest parcel delivery networks with nationwide coverage built on post offices, delivery hubs and a large courier workforce. Its volume comes overwhelmingly from e-commerce: marketplace sellers, social-commerce merchants and platform orders, which means the company serves two customer populations at once, the merchant who shipped and the recipient who is waiting. Cash-on-delivery remains a significant payment mode in Vietnamese e-commerce, which adds a whole class of conversations about amounts, collection and settlement that pure prepaid markets do not have. Contact concentrates on where-is-my-parcel enquiries, failed-delivery rescheduling and COD questions, arriving through a hotline, Zalo, the app and courier phone calls, with brutal volume spikes at platform sale events.",
    strategicPressure: [
      { text: "Viettel Post is the listed logistics arm of the Viettel group and carries heavy e-commerce parcel volume across Vietnam.", kind: "verified" },
      { text: "Cash-on-delivery prevalence in Vietnamese e-commerce adds settlement and amount-confirmation conversations that markets without COD never generate.", kind: "verified" },
      { text: "Platform sale events produce order-of-magnitude volume spikes that fixed contact capacity absorbs only by degrading service.", kind: "inference" },
      { text: "Failed deliveries are the largest avoidable cost in last-mile logistics, and most are preventable with a single successful conversation before the attempt.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. The Viettel group has genuine technology depth, but Viettel Post operates as a logistics business that takes capabilities from partners and group units rather than building courier CX platforms itself. The qualification question is whether a group technology unit claims conversational AI as its territory.",
    whyNotBuild:
      "Even with group engineering nearby, recipient-side delivery coordination needs Vietnamese speech quality across provincial accents at high concurrency, live grounding in tracking and dispatch systems, and COD-safe conversation design. Viettel Post's own teams are focused on network and operations optimization. The right to win is recipient-facing conversational capacity that converts failed deliveries into successful first attempts.",
    workflows: [
      {
        name: "Delivery coordination and failed-attempt prevention",
        friction: "Couriers phone recipients individually before delivery; unanswered calls become failed attempts, and rescheduling requires the recipient to call the hotline and explain everything again.",
        outcome: "Recipients confirm delivery windows and addresses conversationally before the attempt, with reschedules written into dispatch and failed deliveries materially reduced.",
        channels: ["Zalo", "Voice", "SMS"],
        systems: ["Parcel tracking", "Last-mile dispatch and routing", "Recipient records", "Hub operations"],
        value: 3, complexity: 2,
      },
      {
        name: "WISMO and tracking enquiries",
        friction: "Where-is-my-parcel questions from both merchants and recipients dominate contact volume and spike at sale events; each is answerable from systems but only through a human today.",
        outcome: "Live parcel status delivered conversationally to both parties in Vietnamese, with exception explanations rather than raw scan codes.",
        channels: ["Zalo", "Voice", "App", "Web chat"],
        systems: ["Parcel tracking", "Hub and transit scan data", "Merchant records", "Exception management"],
        value: 3, complexity: 2,
      },
      {
        name: "COD amount confirmation and settlement queries",
        friction: "Recipients dispute or query COD amounts at the door, and merchants chase settlement timing; both flows land on the hotline with no self-service path.",
        outcome: "COD amounts confirmed with the recipient before the courier arrives, and merchant settlement status answered conversationally from live finance data.",
        channels: ["Zalo", "Voice", "SMS", "Merchant portal chat"],
        systems: ["COD and settlement records", "Parcel tracking", "Merchant accounts", "Finance systems"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: [
        "Online and app-based parcel tracking for merchants and recipients",
        "A courier workforce that calls recipients directly before delivery attempts",
        "A customer hotline and Zalo Official Account for tracking and delivery issues",
        "A merchant portal for shipment creation, tracking and COD settlement visibility",
      ],
      gaps: [
        "Recipients who miss a courier call have no easy conversational route to reschedule",
        "Tracking status is exposed as raw scan events rather than an explained answer",
        "COD amounts are confirmed only at the door, where disputes cause failed deliveries",
        "Sale-event volume spikes have no elastic contact capacity",
      ],
    },
    risks: [
      "Vietnam's Personal Data Protection Decree governs recipient contact details, addresses and COD amounts handled conversationally, with consent required for proactive contact",
      "Decrees restricting unsolicited calls and messages constrain proactive delivery outreach, so consent and contact-window design must be handled at shipment creation",
      "Group politics: if a Viettel technology unit claims conversational AI internally, the deal shifts from a sale to a partnership negotiation and must be qualified early",
    ],
    economics: {
      volumeMonthly: 3000000,
      costPerInteraction: 0.5,
      automationRate: 0.65,
      basis: "Seller assumptions for a national Vietnamese e-commerce courier including recipient and merchant contact; validate parcel volumes, contacts per parcel and failed-delivery rates in discovery.",
    },
    pilotScope:
      "Automate pre-delivery confirmation and failed-attempt rescheduling on Zalo and voice for two metropolitan delivery hubs, measured on first-attempt success rate.",
    expansion: [
      "Add WISMO and exception-explanation conversations for recipients and merchants",
      "Add COD amount confirmation before the delivery attempt and merchant settlement queries",
      "Extend nationwide with sale-event surge capacity and provincial accent coverage",
    ],
    stakeholders: [
      "Chief Executive Officer, Viettel Post",
      "Head of Last-Mile Operations",
      "Head of Customer Service",
      "Chief Technology Officer",
      "Head of Merchant / E-commerce Business",
    ],
    discovery: [
      "What is your first-attempt delivery success rate, and what does each failed attempt cost you?",
      "How many contacts does a single parcel generate across recipient and merchant?",
      "Do Viettel group technology units claim conversational AI as their scope?",
      "How does contact volume behave during a major platform sale event?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A recipient in Bien Hoa confirms an evening delivery window on Zalo the morning before, so the courier arrives once instead of failing twice and returning the parcel.",
  },

  "vnpost": {
    operatingContext:
      "Vietnam Post is the state postal operator, running the country's widest physical delivery and service network with post offices reaching every commune, which gives it a role no private courier has: it carries e-commerce parcels, delivers public administration documents and results, and distributes financial and insurance services in areas where other institutions are absent. Its customers are therefore disproportionately rural, older and less digitally engaged than those of e-commerce-native carriers, and for many of them a phone call in Vietnamese is the only realistic service channel. Contact covers parcel tracking, delivery problems, public-service document status, postal financial services and general enquiries, handled through post office counters, a hotline and, increasingly, Zalo. Being a state enterprise, technology arrives through procurement cycles and often under national digital-government programmes.",
    strategicPressure: [
      { text: "Vietnam Post operates the country's widest delivery and service network, reaching commune level and carrying public administration services alongside parcels.", kind: "verified" },
      { text: "Its customer base skews rural and less digital, so voice in Vietnamese is the default channel rather than an alternative to apps.", kind: "inference" },
      { text: "National digital-government programmes create policy tailwind and budget justification for modernizing citizen-facing service channels.", kind: "inference" },
      { text: "E-commerce parcel competition from private carriers pressures VNPost on service responsiveness where it cannot compete on cost structure.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A state postal enterprise is a canonical platform buyer: it operates a vast physical network and procures technology through state processes. There is no engineering capability or mandate for building conversational infrastructure.",
    whyNotBuild:
      "Serving a rural, voice-first population needs Vietnamese speech quality across strong provincial accents, live grounding in tracking and public-service systems, and simple conversational design for low-digital-literacy users. That combination is a specialist capability. The right to win is voice-first service that works for the customers other carriers cannot serve digitally at all.",
    workflows: [
      {
        name: "Parcel tracking and delivery-issue voice conversations",
        friction: "Rural recipients call post offices or the hotline to ask where a parcel is; staff look up scan events and read codes, and rescheduling means another call and another explanation.",
        outcome: "Live parcel status explained conversationally in Vietnamese with rescheduling and redirection captured directly into delivery operations.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Parcel tracking", "Delivery operations", "Post office network records", "Recipient records"],
        value: 3, complexity: 2,
      },
      {
        name: "Public administration document status",
        friction: "Citizens waiting on administrative documents delivered through the postal network have no status channel and repeatedly visit or call post offices to ask.",
        outcome: "Document dispatch and delivery status answered conversationally, with collection instructions and identity requirements explained before the citizen travels.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Public service delivery records", "Parcel tracking", "Post office operations", "Identity verification rules"],
        value: 3, complexity: 3,
      },
      {
        name: "Postal financial and insurance service enquiries",
        friction: "Enquiries about postal financial products, insurance distribution and payment services depend on counter staff, so answers vary by office and require a visit.",
        outcome: "Grounded product, requirement and status answers delivered conversationally, with transactions routed to the nearest post office with the needed capability.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Financial services records", "Product and requirement rules", "Post office capability directory", "Customer records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A nationwide post office network reaching commune level as the primary service venue",
        "Online and app-based parcel tracking",
        "A customer hotline covering parcel, financial and public-service enquiries",
        "A Zalo Official Account used for notifications and simple customer interaction",
      ],
      gaps: [
        "Rural customers must call or visit a post office for information that exists in systems",
        "Public administration document status is not available to citizens conversationally",
        "Delivery rescheduling requires reaching a human who may be serving a counter queue",
        "There is no voice-first self-service designed for low-digital-literacy customers",
      ],
    },
    risks: [
      "State-enterprise procurement processes and budget cycles govern acquisition, and any public-service integration adds government approval layers",
      "Vietnam's Personal Data Protection Decree and rules on citizen data used in public-administration delivery impose strict consent, localization and access-control requirements",
      "Strong provincial accent diversity across a commune-level network is a real speech-quality risk and must be benchmarked on recordings from target provinces",
    ],
    economics: {
      volumeMonthly: 2400000,
      costPerInteraction: 0.45,
      automationRate: 0.6,
      basis: "Seller assumptions for Vietnam's state postal operator across parcel, public-service and financial-service contact; validate hotline and post office enquiry volumes and cost per contact in discovery.",
    },
    pilotScope:
      "Automate parcel tracking and delivery-issue voice conversations in Vietnamese for two provinces, with rescheduling written into delivery operations and status explained rather than read as scan codes.",
    expansion: [
      "Add public administration document dispatch and collection status conversations",
      "Add postal financial and insurance product enquiry handling with office routing",
      "Extend nationwide with provincial accent coverage and proactive delivery notifications",
    ],
    stakeholders: [
      "Deputy General Director, Operations",
      "Head of Customer Service",
      "Head of Public Service Delivery",
      "Head of Information Technology",
      "Head of Postal Financial Services",
    ],
    discovery: [
      "How many enquiries do post office counters absorb that could be handled by phone?",
      "Which national digital-government programmes could fund or mandate this modernization?",
      "Can public-service delivery status be exposed to a citizen-facing conversational channel?",
      "What accent coverage would you need before a provincial rollout is credible?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A farmer in Son La calls VNPost, hears in plain Vietnamese where his parcel is and when it will arrive, and reschedules delivery to a market day without visiting the post office.",
  },

  "ghtk": {
    operatingContext:
      "GHTK, Giao Hang Tiet Kiem, is a homegrown Vietnamese last-mile carrier built specifically around the social-commerce and small-seller economy, serving merchants who sell on Facebook, Zalo and marketplaces rather than large enterprise shippers. It operates a technology-led model with its own routing, seller tooling and operational automation, and has a culture of building internally rather than buying. Its parcel flows are dominated by cash-on-delivery and by recipients who need active coordination, since social-commerce buyers often order impulsively and are unreliable at the door. Contact concentrates on the recipient side, delivery coordination, address correction and COD confirmation, plus merchant-side queries about pickup, status and settlement, at very high volume and low unit value.",
    strategicPressure: [
      { text: "GHTK is a Vietnamese-owned last-mile carrier built around social-commerce sellers with a technology-led operating model and its own seller tooling.", kind: "verified" },
      { text: "Social-commerce parcels with cash-on-delivery have higher failed-attempt rates than marketplace-fulfilled orders, making recipient coordination the core cost problem.", kind: "inference" },
      { text: "A build-first culture means a packaged suite is a poor fit, while specific capability gaps are a credible entry point.", kind: "inference" },
      { text: "Vietnamese voice AI at courier concurrency is a capability gap even a strong internal engineering team is unlikely to close alone.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Co-build. GHTK automates internally by instinct and has the engineering culture to prove it, so selling a finished conversational product would fail. The realistic motion is supplying Vietnamese speech, model and orchestration infrastructure for a recipient-coordination capability GHTK builds the experience around.",
    whyNotBuild:
      "GHTK can build the application logic, and will. What is genuinely hard is production Vietnamese speech recognition and synthesis at telephony latency across provincial accents and noisy delivery environments, plus an evaluation harness to keep quality stable at millions of calls. That is infrastructure, not application, and it is where a partner adds value without threatening the customer's engineering identity.",
    workflows: [
      {
        name: "Recipient delivery coordination by voice",
        friction: "Couriers call every recipient individually before delivery; the calls are short, repetitive and enormous in aggregate, and unanswered ones become failed attempts and return-to-origin cost.",
        outcome: "Automated Vietnamese voice coordination confirms availability, address and COD amount before the courier routes, lifting first-attempt success without adding courier call time.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Routing and dispatch", "Parcel tracking", "COD records", "Recipient contact data"],
        value: 3, complexity: 3,
      },
      {
        name: "Address correction and redelivery",
        friction: "Social-commerce orders frequently carry incomplete or wrong addresses; correcting them means a courier call or a hotline conversation, and many parcels cycle through repeated attempts.",
        outcome: "Address problems detected and corrected conversationally before dispatch, with corrected data written back into routing.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Address and geocoding services", "Routing and dispatch", "Parcel records", "Merchant order data"],
        value: 3, complexity: 3,
      },
      {
        name: "Merchant pickup and settlement queries",
        friction: "Small sellers ask when pickup will happen, where a parcel is and when COD will settle; these arrive constantly through Zalo and the seller app at volumes disproportionate to their value.",
        outcome: "Merchant queries answered conversationally from live operational and settlement data, freeing support staff for genuine exceptions.",
        channels: ["Zalo", "Voice", "Seller app chat"],
        systems: ["Pickup scheduling", "Parcel tracking", "COD settlement records", "Merchant accounts"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A seller-facing app and tooling for shipment creation, tracking and settlement",
        "In-house routing and operational automation built by internal engineering teams",
        "Courier-initiated phone contact with recipients before delivery attempts",
        "Zalo and app-based support channels for merchants and recipients",
      ],
      gaps: [
        "Recipient coordination still depends on individual courier phone calls at enormous aggregate cost",
        "There is no production Vietnamese voice layer capable of handling delivery coordination at courier concurrency",
        "Address problems are discovered during the attempt rather than before dispatch",
        "Merchant support volume scales with seller count rather than with genuine exceptions",
      ],
    },
    risks: [
      "Vietnam's Personal Data Protection Decree governs recipient contact data, addresses and COD amounts used conversationally, with consent needed for automated outbound calls",
      "Decrees restricting unsolicited calls constrain automated outbound contact, so the legal basis must sit in the delivery relationship rather than in marketing consent",
      "Cultural and commercial risk: any proposal must be framed as infrastructure that accelerates GHTK's own build, not as a product that replaces its engineering",
    ],
    economics: {
      volumeMonthly: 3500000,
      costPerInteraction: 0.4,
      automationRate: 0.65,
      basis: "Seller assumptions for a high-volume Vietnamese last-mile carrier where courier-recipient calls dominate; validate parcel volumes, courier call minutes per parcel and failed-attempt rates in discovery.",
    },
    pilotScope:
      "Co-build a Vietnamese voice coordination layer for pre-delivery recipient confirmation in one city, measured against first-attempt success rate and courier call minutes saved.",
    expansion: [
      "Add address correction and redelivery conversations written back into routing",
      "Add merchant pickup, tracking and settlement query handling",
      "Extend to provincial accent coverage and to COD amount confirmation at national volume",
    ],
    stakeholders: [
      "Chief Technology Officer",
      "Head of Last-Mile Operations",
      "Head of Product / Seller Platform",
      "Head of Customer Support",
      "Head of Data / AI",
    ],
    discovery: [
      "How many courier-to-recipient call minutes do you spend per thousand parcels?",
      "What first-attempt success rate do you achieve, and what is the marginal cost of a second attempt?",
      "Where does your current Vietnamese speech capability fall short at delivery-environment noise and accent range?",
      "What would your engineering team want to own versus source in a recipient-voice capability?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A GHTK recipient in Thu Duc confirms by automated Vietnamese voice call that she will be home after 6pm and that the COD amount is right, so the courier routes once and collects cleanly.",
  },

  "evn": {
    operatingContext:
      "EVN, Vietnam Electricity, is the state-owned power utility that supplies electricity to essentially the entire country through regional power corporations covering the north, centre, south, Hanoi and Ho Chi Minh City, each operating its own customer care centre. Its customer relationship spans tens of millions of connections, from urban apartments to rural households and industrial users, with monthly billing, metering and connection services as the recurring touchpoints. The conversations are enormous in volume and highly standardized: billing amount queries, outage reports and restoration times, payment confirmation, new connection applications and meter-related requests, essentially all in Vietnamese with strong regional accent variation. Contact arrives through regional care-centre hotlines, an app and web portal, Zalo, and increasingly payment intermediaries, with weather and heat-wave events driving concentrated demand.",
    strategicPressure: [
      { text: "EVN supplies electricity nationwide through regional power corporations that each operate established customer care centres.", kind: "verified" },
      { text: "Tens of millions of customer connections make even a small per-contact cost reduction a nationally significant number.", kind: "inference" },
      { text: "Outage and heat-wave events produce concentrated call surges that fixed care-centre capacity absorbs only by queueing.", kind: "inference" },
      { text: "National digital-transformation policy for state enterprises provides political cover and budget justification for customer-service modernization.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. EVN's care centres are operational units inside a state power monopoly; technology is procured through state channels and delivered by vendors. There is no platform-engineering capability oriented to conversational AI, and the organizational model would not produce one.",
    whyNotBuild:
      "Utility conversations at national scale need Vietnamese speech quality across northern, central and southern accents, live billing and outage grounding, work-order creation, and surge capacity that appears during events. That is a specialist stack no utility builds. The right to win is elastic, grounded conversational capacity deployed regionally and standardized nationally, with every interaction logged.",
    workflows: [
      {
        name: "Outage reporting and restoration status",
        friction: "Outages trigger simultaneous calls to a regional care centre; reports are duplicated, restoration estimates are read out repeatedly, and the queue melts exactly when customers are most anxious.",
        outcome: "Reports captured and deduplicated against known outages, restoration estimates delivered from live outage data, and proactive notification to affected customers.",
        channels: ["Voice", "Zalo", "SMS", "App"],
        systems: ["Outage management", "Customer and connection records", "GIS and feeder mapping", "Field crew dispatch"],
        value: 3, complexity: 2,
      },
      {
        name: "Billing queries and payment conversations",
        friction: "High-bill queries and payment confirmations dominate steady-state volume; agents assemble meter readings, consumption history and payment records manually for each caller.",
        outcome: "Consumption explained from actual meter data with comparison to prior periods, payment status confirmed, and meter re-read requests raised in-conversation.",
        channels: ["Voice", "Zalo", "App", "Web chat"],
        systems: ["Billing system", "Metering data", "Payment and collection records", "Work management"],
        value: 3, complexity: 2,
      },
      {
        name: "New connection and service requests",
        friction: "Connection applications, capacity changes and meter relocation requests require office visits and produce repeated status enquiries because there is no self-service status channel.",
        outcome: "Requirements explained, applications tracked and status answered conversationally, with inspection scheduling coordinated in-channel.",
        channels: ["Voice", "Zalo", "Web chat"],
        systems: ["Customer service application system", "Work management", "Inspection scheduling", "Document records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Regional power corporation customer care centres with established hotlines",
        "A customer app and web portal for bill viewing, payment and outage information",
        "Zalo Official Accounts used for billing notifications and outage advisories",
        "Payment intermediaries and bank channels handling much of bill settlement",
      ],
      gaps: [
        "Outage reports are duplicated and unstructured during major events",
        "Customers cannot get a connection-specific restoration answer, only area advisories",
        "Billing explanations require an agent to assemble data manually",
        "New connection applicants have no self-service status channel and revisit offices to ask",
      ],
    },
    risks: [
      "State-enterprise procurement rules and regional-corporation autonomy shape the entry point; a national decision is slower than a regional pilot and the difference must be qualified early",
      "Vietnam's Personal Data Protection Decree and cybersecurity law govern customer, address and consumption data, with data-localization considerations for a critical-infrastructure operator",
      "Northern, central and southern accent variation across a national footprint is a genuine speech-quality risk and must be benchmarked per region before rollout commitments",
    ],
    economics: {
      volumeMonthly: 6000000,
      costPerInteraction: 0.5,
      automationRate: 0.65,
      basis: "Seller assumptions aggregating regional care-centre contact across EVN's national customer base; validate per-corporation contact volumes, event surge multiples and cost per contact in discovery.",
    },
    pilotScope:
      "Automate outage reporting and billing-query conversations for one regional power corporation on voice and Zalo, grounded in live outage and billing data, with crew dispatch remaining human-controlled.",
    expansion: [
      "Add proactive connection-level outage notification with restoration estimates",
      "Add new connection application status and inspection scheduling",
      "Standardize and extend across all regional power corporations with per-region accent coverage",
    ],
    stakeholders: [
      "Deputy General Director, Customer Service",
      "Director, regional power corporation",
      "Head of Customer Care Centre",
      "Head of Information Technology",
      "Head of Network Operations",
    ],
    discovery: [
      "Is the entry point EVN centrally or a regional power corporation pilot?",
      "During a major outage, how many multiples of baseline does your care centre receive?",
      "Can outage management and billing systems expose live data to an external conversational channel?",
      "What share of reports during an event are duplicates of an already-known outage?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A household in Hanoi reporting an outage at 8pm learns it is already known with a restoration estimate, and receives confirmation when power returns without ever waiting in a queue.",
  },

  "vnpt-vinaphone": {
    operatingContext:
      "VNPT is Vietnam's state telecommunications group, and VinaPhone is its mobile brand, one of the country's three major carriers with tens of millions of subscribers alongside fixed broadband, IPTV and a substantial digital-government services business serving ministries and provinces. Its consumer base is predominantly prepaid, price-sensitive and distributed across urban and rural Vietnam, with data-package registration, balance queries and service-quality complaints as the daily contact reality. Broadband and IPTV add household-level fault and installation conversations with a different rhythm and higher handle time. Contact runs through a hotline, retail shops, an app, and Zalo, and as a state group VNPT operates under continuous policy pressure to modernize public-facing service quality.",
    strategicPressure: [
      { text: "VNPT operates the VinaPhone mobile brand as one of Vietnam's three major carriers alongside fixed broadband and digital-government services.", kind: "verified" },
      { text: "Prepaid ARPU makes human-handled routine contact economically irrational at carrier volumes, which is the core cost argument.", kind: "inference" },
      { text: "State ownership brings policy pressure to modernize citizen and customer-facing service, creating sponsorship for CX investment.", kind: "inference" },
      { text: "VNPT's internal software units may claim conversational AI scope, which is the main qualification risk for a partner-delivered approach.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. VNPT has internal technology units and a software services business, so it is not a naive buyer, but advanced Vietnamese conversational AI at carrier quality is an area where the group partners rather than builds. The motion is partnership with clearly delineated scope against internal units.",
    whyNotBuild:
      "Carrier-grade conversational service needs Vietnamese speech quality at national accent range, telephony and BSS integration, high concurrency, and continuous evaluation. VNPT's internal units build enterprise software and digital-government systems, not speech infrastructure. The right to win is supplying the conversational and speech layer while VNPT retains the channel and customer relationship.",
    workflows: [
      {
        name: "Prepaid balance, package and top-up conversations",
        friction: "Balance, data-package and promo registration questions arrive in enormous volume; each human-handled call costs more than the subscriber generates in a month, and IVR trees serve them poorly.",
        outcome: "Balance, package registration and top-up completed conversationally in Vietnamese with in-channel payment, at a cost compatible with prepaid ARPU.",
        channels: ["Voice", "Zalo", "App", "SMS"],
        systems: ["Prepaid billing and balance", "Package and promo catalogue", "Payment and top-up", "Subscriber records"],
        value: 3, complexity: 2,
      },
      {
        name: "Broadband and IPTV fault handling",
        friction: "Household broadband faults require diagnostic questions, appointment scheduling and technician dispatch; calls are long, appointments are missed, and status is opaque afterwards.",
        outcome: "Guided diagnostics resolve simple faults in-conversation, technician visits are scheduled against live capacity, and status is pushed until closure.",
        channels: ["Voice", "Zalo", "App"],
        systems: ["Network fault management", "Field service scheduling", "Subscriber and service records", "Ticketing"],
        value: 3, complexity: 3,
      },
      {
        name: "Billing and postpaid account queries",
        friction: "Postpaid bill explanations, plan changes and payment confirmations occupy agents with lookups across billing and product systems, peaking at billing cycles.",
        outcome: "Authenticated bill explanations, plan comparisons and payment confirmations delivered conversationally with in-policy changes executed directly.",
        channels: ["Voice", "Zalo", "App", "Web chat"],
        systems: ["Postpaid billing", "Product catalogue", "Payment systems", "CRM"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "A self-care mobile app for balance, packages and account management",
        "A national customer hotline and retail shop network",
        "A Zalo Official Account used for notifications and customer interaction",
        "SMS-based service and package registration channels for the prepaid base",
      ],
      gaps: [
        "Routine prepaid queries are handled by IVR trees or expensive human agents with nothing in between",
        "Broadband fault handling requires long human calls with no guided self-diagnosis",
        "Appointment scheduling for technician visits is not conversational and no-shows are common",
        "Service-quality complaints produce no feedback loop back to the subscriber",
      ],
    },
    risks: [
      "Ministry of Information and Communications regulation and SIM registration rules govern subscriber identity handling and what may be executed without verified identity",
      "Vietnam's Personal Data Protection Decree and cybersecurity law impose consent, localization and cross-border processing requirements on subscriber and voice data for a critical-infrastructure operator",
      "Internal VNPT software units may claim overlapping scope, so partnership boundaries must be agreed before commercial engagement or the deal stalls in group politics",
    ],
    economics: {
      volumeMonthly: 5000000,
      costPerInteraction: 0.45,
      automationRate: 0.65,
      basis: "Seller assumptions for a major Vietnamese carrier across prepaid, postpaid and broadband contact; validate contact volumes per subscriber, channel mix and current cost per contact in discovery.",
    },
    pilotScope:
      "Automate prepaid balance, data-package and top-up conversations on voice and Zalo for the VinaPhone subscriber base in two provinces, with in-channel payment and clear escalation to human agents.",
    expansion: [
      "Add broadband and IPTV guided fault diagnosis with technician scheduling",
      "Add postpaid billing explanation and plan-change conversations",
      "Extend nationwide with regional accent coverage and proactive service-quality follow-up",
    ],
    stakeholders: [
      "Deputy General Director, VNPT VinaPhone",
      "Head of Customer Service",
      "Head of Digital Channels",
      "Chief Technology Officer",
      "Head of Broadband Services",
    ],
    discovery: [
      "What is your fully loaded cost per human-handled contact against prepaid ARPU?",
      "Which internal VNPT units would need to agree scope on a conversational AI decision?",
      "What share of broadband fault calls could be resolved by guided self-diagnosis?",
      "How does your current IVR perform on containment and what do customers do when it fails?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A VinaPhone prepaid subscriber in Thanh Hoa checks her remaining data, registers a new package and tops up on Zalo in ninety seconds, without touching an IVR menu.",
  },

  "mobifone": {
    operatingContext:
      "MobiFone is a state-owned mobile carrier and one of Vietnam's big three operators, historically strong in urban markets and premium segments but under sustained commercial pressure from Viettel's scale and network reach, with equitization long discussed and repeatedly deferred. Its base is largely prepaid with a postpaid and enterprise layer, and its service load is the classic carrier mix: balance and package queries, promo registration, service-quality complaints and churn-risk conversations as subscribers weigh switching under mobile number portability. Contact runs through a hotline, retail shops, an app and Zalo. Because MobiFone's internal technology base is thinner than Viettel's and its cost pressure is greater, partner-delivered automation is the realistic route to competitive service economics.",
    strategicPressure: [
      { text: "MobiFone is a state-owned carrier among Vietnam's big three, competing against Viettel's larger scale and network footprint.", kind: "verified" },
      { text: "Mobile number portability makes churn a live, continuous risk that requires timely conversations rather than monthly campaign cycles.", kind: "inference" },
      { text: "A thinner internal technology base than its main competitor makes partner-delivered capability the practical path to service modernization.", kind: "inference" },
      { text: "Long-discussed equitization creates uncertainty in decision authority that must be mapped before pursuing a large platform commitment.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. MobiFone has operational technology capability but not conversational-AI engineering depth, and its competitive position argues for buying speed rather than funding a build. The realistic motion is partner delivery with MobiFone owning the customer channel and commercial logic.",
    whyNotBuild:
      "Retention and package conversations at carrier scale require Vietnamese speech quality, real-time subscriber and usage grounding, offer bounding within approved economics, and continuous evaluation. Building that while under commercial pressure from a larger rival is not a realistic allocation of scarce capability. The right to win is fast partner-delivered automation that lifts contact coverage on the at-risk base.",
    workflows: [
      {
        name: "Retention and churn-risk conversations",
        friction: "Churn models run periodically and the at-risk base far exceeds outbound calling capacity; SMS blasts offer the same thing to everyone and the actual reason for leaving is never captured.",
        outcome: "Timely two-way conversations with at-risk subscribers in Vietnamese, offers bounded by approved economics, churn reasons captured, and high-value saves routed to specialists.",
        channels: ["Voice", "Zalo", "SMS", "App"],
        systems: ["Churn scoring and analytics", "Subscriber and usage records", "Offer and retention matrix", "CRM"],
        value: 3, complexity: 3,
      },
      {
        name: "Package upsell and balance conversations",
        friction: "Package, balance and promo questions arrive in huge volume; human handling exceeds the value of the account and IVR containment is poor, so upsell opportunities pass unnoticed.",
        outcome: "Balance and package conversations completed with in-channel top-up and relevant package offers grounded in actual usage patterns.",
        channels: ["Voice", "Zalo", "App", "SMS"],
        systems: ["Prepaid billing and balance", "Usage analytics", "Package catalogue", "Payment and top-up"],
        value: 3, complexity: 2,
      },
      {
        name: "Service-quality complaint handling",
        friction: "Coverage and speed complaints are logged as generic tickets with no location or device context, and the subscriber never hears the outcome, so dissatisfaction compounds into churn.",
        outcome: "Structured complaint capture checked against known network events, with feedback to the subscriber and clean data to network planning.",
        channels: ["Voice", "Zalo", "App"],
        systems: ["Network fault and performance systems", "Subscriber records", "Ticketing", "Coverage data"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: [
        "A self-care mobile app for balance, packages and account management",
        "A national hotline and retail shop network",
        "A Zalo Official Account used for notifications and promotions",
        "SMS-based package registration and campaign channels",
      ],
      gaps: [
        "The at-risk base is far larger than outbound retention capacity can reach",
        "Churn reasons are never captured in structured form, so retention offers stay generic",
        "Package offers are not grounded in the subscriber's actual usage",
        "Service-quality complaints produce no feedback to the subscriber who raised them",
      ],
    },
    risks: [
      "Ministry of Information and Communications rules on subscriber identity and SIM registration constrain what may be executed without verified identity",
      "Vietnam's decrees restricting unsolicited calls and messages directly govern retention and upsell outreach, making consent capture and contact-window control mandatory",
      "Equitization uncertainty may destabilize decision authority and investment approval, so sponsorship and budget provenance must be confirmed early",
    ],
    economics: {
      volumeMonthly: 3500000,
      costPerInteraction: 0.45,
      automationRate: 0.6,
      basis: "Seller assumptions for a major Vietnamese carrier across servicing, retention and complaint contact; validate subscriber base, at-risk cohort size and cost per contact in discovery.",
    },
    pilotScope:
      "Automate retention conversations for one at-risk prepaid cohort on voice and Zalo, with offers bounded by an approved matrix, churn reasons captured, and high-value saves handed to specialists.",
    expansion: [
      "Add balance, package and usage-grounded upsell conversations with in-channel top-up",
      "Add structured service-quality complaint capture with subscriber feedback",
      "Extend to postpaid and enterprise servicing with nationwide accent coverage",
    ],
    stakeholders: [
      "Deputy General Director, Commercial",
      "Head of Customer Retention",
      "Head of Customer Service",
      "Chief Technology Officer",
      "Head of Digital Channels",
    ],
    discovery: [
      "What proportion of your at-risk base gets an actual conversation before they port out?",
      "What is your fully loaded cost per human-handled contact against prepaid ARPU?",
      "How does equitization status affect authority to approve a platform investment?",
      "What offer authority could an automated channel exercise inside your retention economics?",
    ],
    flowTemplate: "retention",
    scenario: "A MobiFone subscriber whose usage collapsed after a coverage complaint is reached on Zalo within days, explains the real problem, and accepts a targeted package instead of porting to a rival.",
  },

  "vinmec": {
    operatingContext:
      "Vinmec is Vingroup's private hospital and clinic system, positioned at the premium end of Vietnamese healthcare with international-standard facilities in Hanoi, Ho Chi Minh City, Nha Trang, Da Nang and other major cities, serving affluent domestic families, expatriates and corporate health programmes. Its patient journeys are appointment-driven and package-oriented: specialist consultations, executive and general health check-up packages, maternity programmes and paediatrics, all of which involve scheduling, preparation instructions and follow-up rather than walk-in care. Because the proposition is premium, service responsiveness is part of what patients are paying for, and the expatriate segment requires English alongside Vietnamese. Contact runs through hospital hotlines, a patient app, Zalo and corporate account coordinators.",
    strategicPressure: [
      { text: "Vinmec operates a network of premium private hospitals and clinics in Vietnam's major cities under Vingroup.", kind: "verified" },
      { text: "A premium positioning makes booking friction and unreturned calls disproportionately damaging, since responsiveness is part of the paid proposition.", kind: "inference" },
      { text: "Health check-up packages and maternity programmes are scheduling-heavy products where preparation failures waste both slots and patient goodwill.", kind: "inference" },
      { text: "Expatriate and international patients require reliable English service that depends today on which staff member answers.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Vingroup has technology affiliates and would not accept an opaque product, but Vinmec operationally takes patient-communication capabilities from partners rather than building them; its own investment goes into clinical capability and facilities.",
    whyNotBuild:
      "Patient-facing conversation needs Vietnamese and English speech quality on medical vocabulary, live scheduling integration across physician calendars, hard clinical guardrails, and privacy handling for health data. Hospitals do not build this, and Vingroup's technology arms are not focused on patient communication. The right to win is a governed booking and coordination layer that never crosses into clinical advice.",
    workflows: [
      {
        name: "Appointment and check-up package booking",
        friction: "Patients call hospital lines during business hours to book consultations and check-up packages; explaining package inclusions and finding slots across departments takes long calls, and after-hours enquiries wait.",
        outcome: "Slots offered from live schedules with package inclusions explained in Vietnamese or English, and bookings confirmed at any hour.",
        channels: ["Voice", "Zalo", "App", "Web chat"],
        systems: ["Hospital scheduling system", "Physician and department calendars", "Package catalogue", "Patient records"],
        value: 3, complexity: 3,
      },
      {
        name: "Pre-visit preparation and reminders",
        friction: "Fasting, documentation and preparation instructions are given verbally or by SMS and frequently missed, so patients arrive unprepared and premium slots are wasted.",
        outcome: "Preparation guidance delivered proactively with confirmation, plus reminders with one-tap rescheduling that free unused slots.",
        channels: ["Zalo", "SMS", "Voice", "App"],
        systems: ["Scheduling system", "Package and procedure requirements", "Patient records", "Notification services"],
        value: 2, complexity: 2,
      },
      {
        name: "Corporate health programme coordination",
        friction: "Corporate clients booking employee check-up programmes coordinate through account managers and spreadsheets, with employee scheduling handled one phone call at a time.",
        outcome: "Employees self-schedule within their corporate programme conversationally, with completion tracked and reported back to the corporate client automatically.",
        channels: ["Zalo", "Voice", "Email", "Web chat"],
        systems: ["Corporate programme records", "Scheduling system", "Package entitlements", "Reporting"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Hospital hotlines and department reception desks for appointment booking",
        "A patient app and portal for records, results and some scheduling",
        "Corporate account coordinators managing employee health programmes",
        "A Zalo Official Account used for patient communication and reminders",
      ],
      gaps: [
        "Patients cannot book a specialist or package appointment outside business hours",
        "English-language service depends on which staff member answers the phone",
        "Preparation instructions are inconsistently delivered, so slots are wasted on unprepared patients",
        "Corporate programme employees are scheduled manually rather than self-serving",
      ],
    },
    risks: [
      "Vietnam's Personal Data Protection Decree treats health data with heightened sensitivity, requiring explicit consent, controlled retention and localization consideration for any conversational handling",
      "Clinical safety governance requires that an automated channel never triage, advise or interpret results; every clinical signal must escalate to qualified staff with hard guardrails",
      "Vingroup affiliate technology mandates could redirect the decision, so the group technology relationship must be mapped before serious investment",
    ],
    economics: {
      volumeMonthly: 250000,
      costPerInteraction: 0.95,
      automationRate: 0.5,
      basis: "Seller assumptions for a premium Vietnamese private hospital network across appointment, package and corporate programme contact; validate booking volumes, no-show rates and cost per contact in discovery.",
    },
    pilotScope:
      "Automate health check-up package booking and preparation guidance in Vietnamese and English for two hospitals, with live schedule grounding and all clinical questions escalated to staff.",
    expansion: [
      "Extend booking to specialist consultations where department calendars can be exposed",
      "Add reminder, rescheduling and freed-slot reallocation across the network",
      "Add corporate health programme self-scheduling with completion reporting",
    ],
    stakeholders: [
      "Chief Executive Officer, Vinmec",
      "Medical Director",
      "Head of Patient Experience",
      "Head of Information Technology",
      "Head of Corporate Health Services",
    ],
    discovery: [
      "Can your scheduling system expose live slot availability to an authenticated external channel?",
      "What proportion of check-up appointments are wasted because the patient arrived unprepared?",
      "How is English-language patient service staffed today across your hospitals?",
      "Do Vingroup technology affiliates hold any mandate over patient-facing systems?",
    ],
    flowTemplate: "appointments",
    scenario: "An expatriate patient books a Vinmec executive check-up in English on Zalo at 10pm, receives fasting instructions the night before, and arrives prepared for a slot that would otherwise have been wasted.",
  },

  "hoan-my": {
    operatingContext:
      "Hoan My Medical Corporation is one of Vietnam's largest private hospital groups, operating a network of hospitals and clinics concentrated in southern and central Vietnam and serving the mass-affluent segment rather than the premium expatriate market. Its patient volumes are high and its price points accessible, which means throughput and scheduling efficiency matter more than concierge service: appointment booking, queue management on busy outpatient days, and coordination with health insurance and social insurance coverage are the operational realities. Patients contact hospitals by phone and increasingly Zalo, with front-desk staff absorbing enormous call volumes while simultaneously serving physical queues. As a private-equity-held group, investment decisions are made against clear payback expectations.",
    strategicPressure: [
      { text: "Hoan My operates one of Vietnam's largest private hospital and clinic networks, concentrated in the south and centre of the country.", kind: "verified" },
      { text: "High outpatient throughput at accessible price points makes scheduling efficiency and no-show reduction directly margin-relevant.", kind: "inference" },
      { text: "Front-desk staff answering phones while managing physical queues means both channels degrade at peak simultaneously.", kind: "inference" },
      { text: "Private-equity ownership imposes clear payback expectations, favouring investments with measurable operational returns over experience projects.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A private hospital group invests in clinical capacity, equipment and facilities; its IT function runs hospital information and scheduling systems. There is no engineering base for conversational infrastructure, and ownership expects purchased solutions with provable returns.",
    whyNotBuild:
      "Appointment automation needs Vietnamese speech quality on medical vocabulary across southern and central accents, live HIS scheduling integration, insurance coverage checking, and clinical guardrails. A hospital group will not build this. The right to win is booking and reminder automation whose payback shows in filled slots and reduced no-shows.",
    workflows: [
      {
        name: "Appointment booking and department routing",
        friction: "Patients call hospital numbers that ring at a busy front desk; many calls go unanswered, and callers who get through wait while staff check department schedules manually.",
        outcome: "Appointments booked conversationally against live schedules with the right department identified from the patient's description, at any hour.",
        channels: ["Voice", "Zalo", "Web chat"],
        systems: ["Hospital information system", "Department scheduling", "Patient records", "Doctor rosters"],
        value: 3, complexity: 3,
      },
      {
        name: "Reminders and no-show reduction",
        friction: "Reminders are inconsistent or absent, no-shows waste outpatient capacity on busy days, and rescheduling means another unanswered phone call.",
        outcome: "Timed reminders with one-tap reschedule, released slots offered to waiting patients, and no-show rates measured by department.",
        channels: ["Zalo", "SMS", "Voice"],
        systems: ["Scheduling system", "Patient records", "Notification services", "Waitlist management"],
        value: 3, complexity: 2,
      },
      {
        name: "Insurance coverage and cost enquiries",
        friction: "Patients ask what their health or social insurance covers and what they will pay out of pocket; answers require staff to check coverage rules and price lists, and wrong answers cause disputes at discharge.",
        outcome: "Grounded coverage and cost-estimate answers delivered conversationally before the visit, reducing billing disputes and no-shows driven by cost uncertainty.",
        channels: ["Voice", "Zalo", "Web chat"],
        systems: ["Insurance coverage rules", "Service price list", "Patient records", "Billing system"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: [
        "Hospital phone lines and front-desk reception handling appointment booking",
        "A patient app or portal at some hospitals for appointments and results",
        "Zalo Official Accounts used for hospital announcements and patient messaging",
        "Corporate and insurance partnerships handling covered patient flows",
      ],
      gaps: [
        "A large share of booking calls go unanswered at peak because front desks are serving physical queues",
        "There is no reliable reminder and rescheduling loop, so no-shows go unaddressed",
        "Patients cannot get a cost or coverage estimate before arriving",
        "Booking is unavailable outside working hours despite demand from working patients",
      ],
    },
    risks: [
      "Vietnam's Personal Data Protection Decree treats medical records and patient data as highly sensitive, requiring explicit consent, minimized retention and localization consideration",
      "Clinical safety governance requires hard guardrails so an automated channel never triages, advises or interprets symptoms; every clinical signal escalates to qualified staff",
      "Hospital information system integration readiness varies across a multi-site group and is the primary delivery risk; without live schedule access the workflow degrades to request-taking",
    ],
    economics: {
      volumeMonthly: 400000,
      costPerInteraction: 0.6,
      automationRate: 0.55,
      basis: "Seller assumptions for a large Vietnamese private hospital group with high outpatient throughput; validate call volumes per hospital, unanswered-call rates and no-show rates in discovery.",
    },
    pilotScope:
      "Automate outpatient appointment booking and reminder conversations on Zalo and voice for two hospitals, grounded in live department schedules, with all clinical questions escalated.",
    expansion: [
      "Add released-slot reallocation and waitlist management across departments",
      "Add insurance coverage and cost-estimate conversations before visits",
      "Extend network-wide with central and southern accent coverage",
    ],
    stakeholders: [
      "Chief Operating Officer",
      "Hospital Director",
      "Head of Patient Services",
      "Head of Information Technology",
      "Chief Financial Officer",
    ],
    discovery: [
      "What share of inbound booking calls go unanswered at your busiest hospitals?",
      "What is your outpatient no-show rate and what does an empty consultation slot cost?",
      "Is your hospital information system integration-ready across all sites or only some?",
      "How often do billing disputes arise from coverage expectations set before the visit?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient in Da Nang books a Hoan My outpatient appointment on Zalo at 9pm, gets a reminder with the estimated out-of-pocket cost, and reschedules in one tap instead of not turning up.",
  },

  "fv-hospital": {
    operatingContext:
      "FV Hospital is a prominent international-standard private hospital in Ho Chi Minh City, owned by Singapore's Thomson Medical Group, serving a distinctive patient mix of affluent Vietnamese families, the city's substantial expatriate community, and regional medical-tourism patients. Its French heritage and international accreditation shape both its clinical positioning and its language reality: Vietnamese, English and French all appear in patient communication, and international patients bring foreign insurance arrangements that require pre-authorization coordination rather than simple billing. As a single-campus hospital, its scale is modest but its per-patient value is high and its service expectations are correspondingly demanding. Contact runs through hospital hotlines, department lines, a website and Zalo, with international patients often making contact before they arrive in the country.",
    strategicPressure: [
      { text: "FV Hospital is an international-standard private hospital in Ho Chi Minh City owned by Thomson Medical Group, serving Vietnamese, expatriate and medical-tourism patients.", kind: "verified" },
      { text: "A trilingual patient base means language coverage depends on individual staff availability rather than on a system, which is fragile at any scale.", kind: "inference" },
      { text: "International insurance pre-authorization is a coordination workload with no domestic equivalent and directly gates whether a patient proceeds.", kind: "inference" },
      { text: "Medical-tourism enquiries arrive from other time zones and convert only if answered while the patient is still deciding.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Buy-led. A single-campus hospital has no route to building software platforms; its investment is clinical. Thomson Medical group governance would push toward standardized purchased solutions rather than a local build.",
    whyNotBuild:
      "Trilingual medical conversation quality, live scheduling integration, international insurance coordination and clinical guardrails are far outside a hospital's capability. The right to win is multilingual booking and coordination that captures international enquiries the current staffing model loses.",
    workflows: [
      {
        name: "Multilingual appointment booking",
        friction: "Appointment requests arrive in Vietnamese, English and French by phone and web; whether a caller gets served in their language depends on who is on shift, and international enquiries arrive outside local hours.",
        outcome: "Appointments booked from live schedules in the patient's language at any hour, with international enquiries engaged while the patient is still deciding.",
        channels: ["Voice", "Zalo", "Web chat", "Email"],
        systems: ["Hospital scheduling system", "Physician calendars", "Patient records", "Service catalogue"],
        value: 3, complexity: 3,
      },
      {
        name: "International insurance coordination",
        friction: "Expatriate and medical-tourism patients need pre-authorization from foreign insurers; coordination is manual, slow and opaque, and patients cannot tell whether they are covered until close to the procedure.",
        outcome: "Coverage requirements explained, documentation collected in-conversation, and authorization status tracked and pushed to the patient at each stage.",
        channels: ["Voice", "Email", "Zalo", "Web chat"],
        systems: ["International insurance coordination records", "Patient records", "Document management", "Billing and estimates"],
        value: 3, complexity: 3,
      },
      {
        name: "Pre-visit guidance and preparation",
        friction: "Preparation instructions, documentation requirements and directions are delivered verbally or by email and frequently missed, particularly by patients travelling from abroad.",
        outcome: "Structured pre-visit guidance in the patient's language with confirmation, plus reminders and one-tap rescheduling.",
        channels: ["Zalo", "Email", "SMS", "Voice"],
        systems: ["Scheduling system", "Procedure requirement records", "Patient records", "Notification services"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Hospital hotlines and department reception desks for appointment booking",
        "A multilingual website with service information and enquiry forms",
        "An international patient coordination function for insurance and medical-tourism cases",
        "Zalo and email channels used for patient communication",
      ],
      gaps: [
        "Language coverage depends on which staff member answers rather than on a system",
        "International enquiries outside Vietnamese business hours receive no immediate response",
        "Insurance pre-authorization status is opaque to the patient until late in the process",
        "Pre-visit preparation is inconsistently delivered, particularly to patients travelling from abroad",
      ],
    },
    risks: [
      "Vietnam's Personal Data Protection Decree governs medical records and patient data, with additional complexity where international patients' home-jurisdiction privacy expectations apply",
      "Clinical safety governance requires hard guardrails preventing any triage, advice or result interpretation by an automated channel",
      "Thomson Medical group technology standardization plans could preempt a local decision, so group-level intent must be established before pursuing a single-hospital deployment",
    ],
    economics: {
      volumeMonthly: 90000,
      costPerInteraction: 1.3,
      automationRate: 0.45,
      basis: "Seller assumptions for a single-campus international private hospital in Vietnam with high per-patient value; validate enquiry and booking volumes, language mix and cost per contact in discovery.",
    },
    pilotScope:
      "Automate multilingual appointment booking and pre-visit guidance in Vietnamese, English and French across voice and web chat, with live schedule grounding and all clinical questions escalated.",
    expansion: [
      "Add international insurance pre-authorization coordination with tracked status",
      "Add reminder, rescheduling and freed-slot reallocation",
      "Extend to medical-tourism enquiry capture across source-market time zones",
    ],
    stakeholders: [
      "Chief Executive Officer",
      "Medical Director",
      "Head of International Patient Services",
      "Head of Information Technology",
      "Head of Finance / Insurance Relations",
    ],
    discovery: [
      "How are French and English enquiries staffed today, and what happens when nobody suitable is available?",
      "How long does international insurance pre-authorization take and how many patient contacts does it generate?",
      "What are Thomson Medical's group technology standardization plans for patient-facing systems?",
      "How many medical-tourism enquiries arrive outside Vietnamese business hours?",
    ],
    flowTemplate: "appointments",
    scenario: "A French expatriate books an FV Hospital consultation in French on the website at 11pm, gets insurance documentation requirements explained, and arrives with pre-authorization already in progress.",
  },

  "vinhomes": {
    operatingContext:
      "Vinhomes is Vietnam's largest residential developer, building mega-township projects such as Ocean Park, Smart City and Grand Park that house hundreds of thousands of residents, combined with a continuous sales pipeline of new phases and products. That creates two very different conversational businesses under one roof: a sales funnel where buyer enquiries arrive constantly and speed of qualified response determines conversion, and a resident-services operation where tens of thousands of households raise maintenance requests, ask about management fees, book amenities and coordinate handover. Residents in a Vinhomes township interact with property management far more frequently than a buyer ever interacts with a developer, and those interactions run through management offices, hotlines, resident apps and Zalo groups. Language is Vietnamese with English for expatriate residents in the flagship townships.",
    strategicPressure: [
      { text: "Vinhomes develops and operates mega-township projects housing very large resident populations alongside a continuous residential sales pipeline.", kind: "verified" },
      { text: "Resident-service contact volume scales with cumulative units delivered, so it grows relentlessly regardless of the sales cycle.", kind: "inference" },
      { text: "Handover periods concentrate enormous coordination demand into short windows as thousands of units transfer to residents simultaneously.", kind: "inference" },
      { text: "Management-fee and service-quality disputes in large townships are reputational risks that spread quickly through resident messaging groups.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Partner-led. Vingroup has technology arms and Vinhomes would not accept an opaque product, but resident-communication platforms are delivered with partners rather than built by the developer, whose capability is in land, construction and township operations.",
    whyNotBuild:
      "Resident service at township scale needs Vietnamese conversational quality, live integration with property-management work orders, billing and amenity systems, and elastic capacity during handover waves. A developer will not build that stack. The right to win is a partner-delivered conversation layer that turns resident requests into tracked work orders with visible status.",
    workflows: [
      {
        name: "Resident service requests and maintenance",
        friction: "Residents report faults, request maintenance and raise complaints through management offices, hotlines and Zalo groups; requests are transcribed manually, status is invisible, and unresolved items resurface publicly in resident groups.",
        outcome: "Structured service requests raised directly into property-management work orders with tracked status pushed back to the resident until closure.",
        channels: ["Zalo", "Voice", "Resident app", "Web chat"],
        systems: ["Property management work orders", "Facilities and technician dispatch", "Resident records", "Building systems"],
        value: 3, complexity: 2,
      },
      {
        name: "Handover scheduling and punchlist coordination",
        friction: "Handover waves concentrate thousands of appointments, inspections and punchlist items into weeks; coordination is by phone and spreadsheet, and defect follow-up is inconsistent.",
        outcome: "Handover appointments booked conversationally with preparation guidance, punchlist items logged and tracked, and defect rectification status pushed to the buyer.",
        channels: ["Zalo", "Voice", "SMS", "App"],
        systems: ["Handover scheduling", "Defect and punchlist management", "Buyer records", "Contractor coordination"],
        value: 3, complexity: 3,
      },
      {
        name: "Buyer enquiry qualification",
        friction: "Sales enquiries from campaigns, portals and walk-ins land with agents and are followed up unevenly; enquiries arriving at night or from overseas buyers often go cold before anyone responds.",
        outcome: "Every enquiry engaged within minutes in Vietnamese or English, qualified on a structured rubric, and routed live to a seller with full context.",
        channels: ["Zalo", "Voice", "Web chat", "Messenger"],
        systems: ["CRM and lead management", "Inventory and pricing", "Agent assignment", "Marketing automation"],
        value: 3, complexity: 2,
      },
    ],
    existing: {
      has: [
        "Property management offices and hotlines in each township",
        "A resident app or portal for fees, notices and some service requests",
        "Zalo Official Accounts and resident Zalo groups used heavily for community communication",
        "A sales agent and brokerage network handling buyer enquiries and site visits",
      ],
      gaps: [
        "Service requests raised in Zalo groups and by phone produce no tracked work order the resident can follow",
        "Handover waves overwhelm coordination capacity with no elastic support",
        "Buyer enquiries arriving outside office hours frequently go cold",
        "Management-fee and amenity questions are answered inconsistently across townships",
      ],
    },
    risks: [
      "Vietnam's Personal Data Protection Decree governs resident and buyer contact data, unit records and payment information used conversationally, including consent for proactive outreach",
      "Vietnamese real-estate and consumer regulation constrains what may be stated about pricing, handover commitments and buyer obligations, so sales conversations must be grounded and bounded",
      "Ownership boundaries between Vinhomes and any Vingroup property-service affiliate must be resolved before deployment, or the initiative will stall between two organizations",
    ],
    economics: {
      volumeMonthly: 700000,
      costPerInteraction: 0.6,
      automationRate: 0.6,
      basis: "Seller assumptions combining township resident services and residential sales enquiry contact; validate resident household counts, service-request volumes and monthly lead volumes in discovery.",
    },
    pilotScope:
      "Automate resident service-request intake and status tracking on Zalo and voice for one mega-township, raising structured work orders into property management with status pushed until closure.",
    expansion: [
      "Add handover scheduling and punchlist coordination for the next delivery wave",
      "Add management-fee, amenity booking and community notice conversations",
      "Extend to buyer enquiry qualification across residential sales with English coverage",
    ],
    stakeholders: [
      "Head of Property Management Services",
      "Head of Customer Experience",
      "Head of Sales / Commercial Director",
      "Chief Information Officer",
      "Head of Handover and Project Delivery",
    ],
    discovery: [
      "Is property-management CX owned by Vinhomes or a Vingroup service affiliate?",
      "How many service requests per thousand households do you receive each month, and how many are tracked to closure?",
      "How does coordination capacity behave during a handover wave?",
      "What is your median response time to a residential sales enquiry received at night?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A resident in Vinhomes Ocean Park reports a water leak on Zalo at 10pm, gets a work-order reference immediately, and is told when the technician is coming instead of posting into a resident group.",
  },
};
