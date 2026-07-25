# Gemini Enterprise Communications — GTM Strategy & Microsite

Live at **voice.aitokenomics.app** (route `/voice` in this repo, subdomain via `src/proxy.ts` + `vercel.json`).

- `/voice` — external customer experience (outcome-led)
- `/voice/{financial-services|retail|telecom|education|gcc}` — vertical microsites with presentation mode (15/30/60 min), speaker notes, seller personalization, and per-vertical ROI calculators
- `/voice/internal` — internal GTM command centre: account qualifier, GECX decision tree, capability swimlanes, 11-stage sales motion, solution packages, partner model, pilot factory, objection handling

All structured strategy content lives in `data.ts` (single source of truth for both experiences).

---

## 1. Executive recommendation

**Strategic thesis.** Gemini Enterprise Agent Platform should become the intelligence and orchestration layer underpinning enterprise inbound and outbound communications — not a voice bot, not a contact-centre product. Every interaction (customer, employee, student, citizen) can be understood, reasoned over, acted on, governed, measured, and improved by agents running in the customer's Google Cloud tenant.

**Category recommendation: "Agentic Communications Layer."**
- *Compelling*: names the shift enterprises are already making (bots → agents that act) and the architectural posture (a layer over existing channels/systems, not a replacement suite).
- *Understandable*: "communications" is a budget line executives own; "layer" signals no rip-and-replace.
- *Broad enough*: covers inbound, outbound, voice, messaging, email, employee-facing, and analytics without implying a CCaaS.
- *Defensible*: differentiation = in-tenant deployment + governance + language breadth + cross-system action — the combination point vendors and CCaaS players don't package.
- *GECX-safe*: a "layer" composes with a contact-centre suite instead of competing with it.
- Rejected alternatives: "Enterprise Interaction Intelligence" (sounds like analytics), "AI Communications Operating Layer" (jargon), "Agentic Engagement Platform" (collides with CES/GECX naming).

**Why Google Cloud can win.** (1) Full stack: Gemini models + Chirp speech + real-time voice + enterprise search + agent platform + data/identity/observability in one governed tenant. (2) Regulated-industry wedge: models, state, telemetry stay inside the customer's cloud perimeter — most voice-AI startups can't offer this. (3) Language breadth incl. Indic languages at consumer-product quality. (4) Partner leverage: the implementation gap (telephony, channels, compliance, connectors) becomes repeatable partner IP rather than Google services engagements. (5) Consumption flywheel: every contained interaction is model+speech+search+data consumption.

**Priority verticals & lighthouse use cases.**
| Vertical | Lighthouse | Fastest to production |
|---|---|---|
| Financial Services | Early-bucket collections | Lead qualification |
| Retail & eCommerce | WISMO + delivery coordination | Abandoned-cart recovery |
| Telecom | Plan/billing/balance support | Recharge reminders & collections |
| Education | Admissions inquiry & nurture | Application completion follow-up |
| GCC | IT service desk L0/L1 | HR support |

**GTM recommendation.** Partner-led delivery on a productized four-level hierarchy (platform → communications implementation layer → industry agent packs → customer deployment). Sell through an 11-stage gated motion anchored on one lighthouse use case and an 8–12 week measured pilot. Internal command centre gives sellers qualification, GECX routing, and evidence-checked copy.

**GECX relationship.** GECX leads contact-centre modernization; Gemini Enterprise leads communications embedded in enterprise workflows; joint motion when both are in play. Codified in a capability map (18 capabilities with single-owner assignment) and an interactive decision tree. Non-negotiables: never position as CC replacement; escalations always land in the customer's existing CC stack.

**Partner model.** Google owns platform/models/blueprints; partners own telephony, channels, languages, industry packs, and production ops; customers own policies, systems, and escalation teams. Candidate partners (voice-AI specialists such as hello.ai, Tilicho, QCentric; GSIs; regional SIs) are *unvalidated* — certification before any customer-facing claim.

**Immediate decisions required.** (1) Confirm category naming with product marketing. (2) Ratify GECX rules of engagement with the GECX GTM team. (3) Select 2–3 launch partners per region and fund certification. (4) Approve pilot-factory funding policy: per-vertical evidence-based (central ~$250K partner funding **not** assumed — build the case after two customer-funded pilots per vertical). (5) Nominate 5–10 lighthouse accounts per vertical.

---

## 2. Key assumptions & findings (evidence table)

| Claim | Evidence | Source | Confidence | Implication |
|---|---|---|---|---|
| Assisted contact costs ~7× self-service ($13.50 vs $1.84 median) | Gartner cost benchmark doc, 2024 | gartner.com/en/documents/5164231 | Verified | Core economics pitch; supersedes the older $8.01/$0.10 (2019) figure |
| Agentic AI resolves 80% of common service issues by 2029, −30% opex | Gartner press release, Mar 2025 | gartner.com newsroom | Verified | "Why now" anchor |
| Conversational AI cuts agent labor cost $80B in 2026; 1-in-10 interactions automated | Gartner press release, Aug 2022 | gartner.com newsroom | Verified | Market-timing proof |
| Conversational AI market $11.6B (2024) → $41.4B (2030), 23.7% CAGR | Grand View Research 2025 | grandviewresearch.com | Verified | TAM directional |
| AI voice agents market $2.5B (2025) → $35.2B (2033), 39% CAGR | Grand View Research | grandviewresearch.com | Verified | Voice-specific growth |
| Contact-centre software ~$48B + outsourcing ~$117B (2025) | Emergen Research; Market Data Forecast | respective sites | Estimate (2nd-tier firms; derived combination) | SAM framing — attribute explicitly |
| Digital-first collections: 20–25% NPL reduction; gen-AI collections up to −40% opex, +10% recoveries | McKinsey collections research | mckinsey.com | Verified | BFSI lighthouse justification |
| India: 900M+ internet users 2025, 98% consume Indic-language content | IAMAI–Kantar via IBEF, Jan 2025 | ibef.org | Verified | Language wedge |
| India GCC market $64.6B FY24, 1,700+ centres, 1.9M employees → ~$100B by 2030 | NASSCOM–Zinnov GCC Landscape | nasscom.in / zinnov.com | Verified | GCC vertical sizing |
| OTT business messaging $3.6B (2025) → $9.8B (2029); RCS traffic +50% in 2025 | Juniper Research | juniperresearch.com | Verified | Channel strategy |
| Voice-AI funding surge: Sierra $10B val (Sep 2025) → ~$950M raise (May 2026); ElevenLabs $11B val, $330M+ ARR; Decagon $4.5B; India cumulative $117M (Sarvam ~$54M, Gnani ₹56cr→₹160cr rev) | CNBC, TechCrunch, Tracxn, Business Standard | various | Verified | Category heat; partner/acquirer landscape |
| 78% of students choose the first institution to respond | LeadSquared / vendor funnel studies | leadsquared.com | Estimate (vendor benchmark) | Education speed-to-lead pitch — label as vendor data |
| ~70% cart abandonment | Baymard Institute meta-analysis | baymard.com | Verified | Retail outreach case |
| Collections "3–7× contact rate via AI" | vendor blogs only | — | **Not found** — do not cite | Removed from all copy |
| Partner capabilities of hello.ai / Tilicho / QCentric | none gathered | — | **Unvalidated** | No partner named on customer-facing pages |

Hypotheses requiring customer validation: per-account containment rates; complaint-rate parity vs human baselines; in-tenant deployment as a purchase-deciding criterion (directionally supported by regulated-industry behavior, not quantified); WISMO share of contacts per retailer.

**Gemini stack references (verified):** Gemini Enterprise launched Oct 9 2025 ($30/user/mo Enterprise, $21 Business); Customer Engagement Suite (Conversational Agents, CCaaS, Agent Assist, Conversational Insights); Chirp 3 HD voices + Instant Custom Voice (Mar 2025); Gemini Live API for real-time voice.

---

## 3. Product hierarchy (productized offering)

1. **Level 1 — Platform**: Gemini Enterprise Agent Platform (reasoning, orchestration, governance, evaluation) + Gemini models, Chirp speech, Live API, enterprise search, security/identity/observability. *Google-owned.*
2. **Level 2 — Communications implementation layer**: reusable services for channels, telephony, identity, state, routing, escalation, compliance, observability, language, evaluation, integration. *Partner-built on Google blueprints; reusable IP.*
3. **Level 3 — Industry agent packs**: Collections, Inbound Service, Outbound Lead, Employee/Student Support, Agent Assist & Conversation Intelligence — preconfigured instructions, workflows, connectors, policies, eval datasets, dashboards. *Partner-commercialized, Google-certified.*
4. **Level 4 — Customer deployment**: business rules, offer matrices, data, processes, experience design. *Customer-owned.*

**Minimum viable offering** (before scaled selling): reference architecture, per-vertical demo, deployment templates, security blueprint, evaluation framework, pricing + ROI model (formulas public, no outcome guarantees), partner delivery model, pilot methodology, production-readiness checklist, seller qualification guide, objection handling, success metrics. The microsite implements the seller-facing halves of this list.

**Commercial model recommendation**: consumption-led platform pricing + partner implementation fees, with per-completed-interaction framing for business buyers; committed-consumption agreements at standardization stage; **no outcome-based guarantees** until ≥3 production references per pack.

---

## 4. Architecture (as encoded in the site's interactive explorer)

Five layers with explicit ownership: Channels (partner-integrated) → Agentic Communications Layer (GE Agent Platform: intent, orchestration, state, policy, model routing, handoff) → Intelligence Foundation (Gemini, Chirp STT/TTS, Live API, search/grounding, evaluation) → Enterprise Systems & Actions (customer-owned, partner-connected) → Trust & Operations (IAM, residency/VPC-SC, 100% audit logging, continuous eval, cost controls, human escalation).

Interaction lifecycle (8 steps): Contact → Identify → Understand → Reason → Act → Escalate → Record → Improve.

---

## 5. Pilot factory

8–12 weeks, four phases (Frame / Build / Prove / Decide), one narrowly-scoped use case, baseline before build, production-like traffic before verdict, human fallback throughout, explicit success thresholds and cost guardrails, go/no-go with named ownership after pilot. Central partner funding decided on evidence, not assumed.

## 6. Ninety-day plan

- **Wk 1–2 (Strategy & validation)**: ratify category + GECX RoE (owner: GTM lead; gate: GECX sign-off); validate 3 partner candidates (partner lead); nominate lighthouse accounts (sales leads).
- **Wk 3–4 (Architecture & partners)**: publish reference architecture + security blueprint (product/CE); sign 2 launch partners incl. certification plan (partner lead; gate: certification criteria agreed).
- **Wk 5–8 (Prototype & lighthouse pack)**: build Collections + Inbound Service packs with partner on demo tenant (partner + CE; gate: eval harness passing on golden set); seller enablement on command centre (GTM).
- **Wk 9–12 (Pilot & launch)**: first two customer pilots in-flight (BFSI collections, GCC IT desk) (account teams; gate: baselines captured before build); seller launch with qualification tool; pilot-funding business case from real pilot economics (gate: funding decision).

Success metrics: 2 pilots live, 2 certified partners, 10 qualified accounts ≥60 score, zero GECX escalation conflicts, first consumption ramp forecast.

## 7. Open questions

1. Official product naming/trademark for the proposition (this site uses "Gemini Enterprise Communications" as a working name).
2. GECX co-sell attribution mechanics (revenue/consumption split) — needs GTM finance ruling.
3. Which partner(s) get Level-2 implementation-layer IP rights vs per-pack certification only.
4. India-first vs multi-region launch sequencing.
5. Whether employee/student support packs price per-seat (Gemini Enterprise seats) or per-interaction — affects Education/GCC motion materially.

## 8. Build notes

- Palette follows repo Google-style tokens; Inter; Tailwind v4; framer-motion; lucide-react.
- ROI calculators show all formulas and mark defaults as modelling assumptions — no unsupported savings claims anywhere in copy.
- Internal metrics (seat activation, consumption) appear **only** on `/voice/internal`.
- `robots: noindex` set for the whole `/voice` tree.
