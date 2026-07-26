# Gemini Enterprise Frontline — GTM Strategy & Microsite

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

**Partner model (v3).** Tilicho Labs is the named communications, voice-AI, and implementation layer: one-time fee for solution design/integration/deployment, usage-based platform consumption (indicative ~$0.15/call-minute, usage only — not fully loaded), and optional managed services. Google Cloud owns Gemini intelligence, grounding, workflow agents, orchestration, enterprise actions, security/governance, data/analytics, and evaluation. Customers own data, systems of record, business rules, regulatory decisions, approvals, and escalation operations. Tilicho capability coverage is validated during implementation — unconfirmed capabilities are never presented as production-ready. No other underlying platform or vendor dependency appears in GTM content (see restricted appendix).

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
| Tilicho Labs platform capability coverage | directionally scoped; per-capability confirmation pending | restricted technical appendix | **Validate during implementation** | Capabilities listed as "provides or orchestrates"; none presented as production-ready without confirmation |

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

1. Official product naming/trademark for the proposition (this site uses "Gemini Enterprise Frontline" as a working name).
2. GECX co-sell attribution mechanics (revenue/consumption split) — needs GTM finance ruling.
3. Which partner(s) get Level-2 implementation-layer IP rights vs per-pack certification only.
4. India-first vs multi-region launch sequencing.
5. Whether employee/student support packs price per-seat (Gemini Enterprise seats) or per-interaction — affects Education/GCC motion materially.

## 8. v2 additions (July 2026): flow storytelling + Solution Builder

**Information architecture changes**
- Vertical microsites gained two sections: **"Watch the transformation"** (animated conventional→agentic flow player) and **"Operating-model comparison"** (13 dimensions × conventional / point-solution / agentic).
- Internal experience gained `/voice/internal/builder` — the modular Solution Builder — linked from the internal nav and hero CTA.

**Component inventory (new)**
- `flows.ts` — data: `FLOWS` (5 vertical scenarios × conventional + agentic steps with actor/channel/wait/pain/approval and 3-perspective narratives), `OPERATING_MODELS` (13 comparison rows), `FLOW_SOURCES` (provenance list).
- `flow.tsx` — `FlowStory` (play/pause, step controls, auto-transform from conventional to agentic at end of playback, customer/employee/systems perspective switcher, metrics toggle with per-metric provenance chips, side-by-side compare mode, sources disclosure), `FlowContext` (GEAP/GECX/partner/human-oversight roles + impact + value drivers + differentiators), `OperatingModelCompare` (desktop table / mobile accordion).
- `internal/builder/builder-data.ts` — data + engine: 11 channels (integrations, complexity, effort, dependencies, consumption drivers, availability warnings), 27 capabilities in 8 modules (core vs optional, owner = google/gecx/partner/joint, benefit levers), 5 industry default profiles, editable rate card, and pure functions `computeEffort`, `computeTco`, `computeRoiModel`, `computeRecommendation`, `applyScenario`.
- `internal/builder/page.tsx` — profile form, channel cards, capability chips, live generated architecture with ownership lanes + dependency warnings, 3-scenario TCO (one-time stack, variable breakdown, by-channel/by-capability), value-by-lever ROI with provenance labels (customer input / benchmark / assumption / system estimate), rule-based recommendation, exports.

**Data model / provenance rule** — every quantified value in flows and builder carries a kind: `benchmark` (cited), `assumption` (editable default), `platform` (capability fact), or provenance: `customer | benchmark | assumption | estimate`. Rendering always shows the label.

**Exports** — Customer proposal renders in a preview modal and prints to PDF via a print stylesheet (`#proposal-doc` visibility isolation); it carries the customer's name and auto-excludes internal content (pursuit routing, GECX logic, warnings, margins, confidence). Internal opportunity brief copies as markdown incl. all internal fields. Autosave to localStorage + up to 10 named snapshots (version history).

**Build sequence (as implemented)** — flows data → flow components → vertical wiring → builder data/engine → builder page → internal links → README/QA → build → browser verification → deploy via git push to main.

**QA checklist (v2)**
- [x] `npm run build` passes; all `/voice` routes render
- [x] Flow player: play/pause, stepping, perspective switch, compare mode, transform-at-end
- [x] Metrics and sources disclose provenance on every number
- [x] Builder: industry switch reloads defaults; core capabilities locked; warnings react to residency/timeline/RCS/video/CC selections
- [x] TCO/ROI recompute live; scenario toggle affects both; rate card edits flow through
- [x] Proposal preview strips internal content; print isolates the document; customer name propagates
- [x] Autosave/restore + snapshots survive reload (same browser)
- [x] No fixed pricing presented as fact; disclaimers on all money figures

## 9. v3 redesign (July 2026): AI-native experience, cinematic flows, guided builder, Tilicho Labs model

**Visual direction.** Dark "deep-space" AI-native system for hero surfaces and the flow cinema (`#0B1220` radial gradients, faint grid overlays, glow accents `#8AB4F8`/`#4FD1C5`), light editorial content sections retained for readability in live customer conversations. No SaaS pricing cards, no generic gradients, no decorative motion — every animation communicates a process change.

**UX architecture changes**
- Home: dark hero with a live **interaction-stream animation** (inbound chips → glowing agent-layer card crediting Gemini Enterprise Agent Platform × Tilicho Labs → resolved-outcome chips), nav anchored to Why / Solutions / Industries / Architecture / Economics / Trust / Workshop.
- New **"How you'd buy it"** section (`economics.tsx`): commercial model as four integrated components (1 · Tilicho implementation & integration, 2 · usage-based communications, 3 · Google Cloud consumption, 4 · optional managed services) with a fully interactive economics model (volume, duration, use case, languages, channels, integrations, automation, escalation, usage rate, human cost — all provenance-labeled). Explicit disclosure that the ~$0.15/call-min rate is usage-only, not fully loaded.
- New **"One integrated solution. Three clear owners."** tri-panel (Tilicho Labs / Google Cloud / Customer) above the layer explorer.
- Vertical microsites: step-player replaced by **`cinema.tsx` FlowCinema** — an auto-looping cinematic race (14s loop) where the conventional token stalls, backtracks (repeated context), and drags to the end while the agentic token flows through and resolves at ~58% of the loop ("Resolved — waiting on the old world…"). Pause & explore: clicking any node freezes the loop and opens that step with customer/employee/systems narratives. Metrics strip with provenance chips and sources disclosure retained beneath the canvas.
- Builder: rebuilt as a **guided, outcome-led wizard** — six questions (industry, outcome, use case, channels, volume, systems) → one "Generate the recommended solution" action → composed solution (Tilicho capabilities, Google Cloud components, customer integrations), headline economics, cost breakdown with per-line provenance, pilot structure, expansion roadmap, warnings, value levers. Everything else moved behind **Advanced settings** (operating assumptions + 15-entry rate card).

**Commercial / TCO model (v3)** — One-time: discovery & design, Tilicho integration & deployment fee (base + per-channel), customer-system integrations (per system), industry workflow configuration (+ per extra language), security & compliance setup, testing & evaluation, production readiness, change management %. Recurring: Tilicho platform usage (voice minutes × rate + message-side), carrier/telephony (explicitly billed separately), Google Cloud consumption per interaction, managed service (% of usage with floor), retained human operations (escalations × handle share × human cost). Outputs: monthly + annual run rate, cost per interaction and per resolved, 3-yr TCO, gross/net annual benefit, payback, 3-yr ROI, NPV, three scenarios. Provenance taxonomy: contracted (indicative) / customer / Tilicho estimate / benchmark / seller assumption / system estimate — rendered on every line item.

**Persona review outcomes (pre-ship pass)**
- *CEO*: hero now leads with outcome ("Every conversation. One intelligent layer."), race animation communicates the change in <15 seconds without reading; pricing framed as investment/payback, not tiers. Removed: capability walls of chips from the default builder view.
- *CIO*: three-owner architecture with explicit IP boundaries; in-tenant intelligence stated precisely (Gemini/state/logs — not the comms plane); capability-validation caveat on the Tilicho layer.
- *COO*: economics model exposes retained human operations and escalation cost rather than pretending automation is total; cost per resolved interaction is first-class.
- *Seller*: builder is six questions and one button; warnings translate to "check before proposing"; proposal export is one click and customer-safe.
- *Specialist*: full rate card and operating assumptions preserved under Advanced; TCO line items map 1:1 to the delivery model for scoping conversations.

**QA checklist (v3)**
- [x] Build passes; all routes render; no console errors
- [x] Cinema loops seamlessly, pauses on click, node exploration works on all 5 verticals; reduced text density — story readable without labels
- [x] $0.15/call-min never presented as fully loaded (disclosures on economics section, builder breakdown, and proposal)
- [x] No underlying third-party platform/vendor brand anywhere in site, builder, exports, or diagrams (grep-verified); Tilicho Labs positioned as integrated solution+implementation partner, not a point product
- [x] Guided builder: 6 questions drive the full recommendation; advanced panel edits flow through TCO/ROI live; scenarios affect both cost and value
- [x] Proposal strips internal content (pursuit, warnings, GECX, provenance labels) and carries customer name; print isolation works
- [x] Provenance labels present on every quantified line in economics, TCO, and value levers
- [x] Mobile: hero stream hidden below lg (text-first), comparison table degrades to accordion, cinema canvas scales, builder chips wrap

## 10. v4 (July 2026): rename + APJ Top-100 account-based experience

**Rename.** The proposition is now **Gemini Enterprise Frontline** ("Every conversation, one intelligent frontline") — sits on top of Gemini Enterprise Agent Platform; more enterprise-appealing than "Communications," which read as a product category rather than a value promise.

**APJ account experience** (`/voice/accounts`):
- **Universe**: 100 organizations across India (40), Indonesia (13), Philippines (8), Vietnam (7), Thailand (8), Malaysia (5), SEA-regional (4), Japan (6), Korea (5), ANZ (4) — a **clearly-labeled research-based priority universe from public information, NOT an authoritative top-GCP-customer list** (disclaimer rendered on the dashboard and every account page). Data authored by five parallel research agents against a strict schema (`accounts/shared.ts`), each entry confidence-tagged: Public fact / Reasoned inference / Seller hypothesis — validate.
- **Dashboard**: topline stats (tier mix, implementation pipeline, package mix, avg channels), interactive value×readiness prioritization matrix (hover-to-identify, click-through), package-allocation rationale, repeatable-pattern analysis (top workflow templates + language coverage), market/tier/search filters.
- **Account pages** (`/voice/accounts/[slug]`): personalized hero (operating-model-specific headline, proposition, entry use case, outcome, package chip) · research section with per-bullet confidence chips + publicly-reported GCP relevance only where known + validation checklist · ranked opportunity map (value/complexity/speed dots, channels, friction) · account-bound cinematic flow (13 parameterized templates: collections, inbound-service, order-logistics, lead-sales, billing-recharge, claims, admissions, appointments, employee-desk, retention, onboarding, dealer-support, travel-disruption) · recommended solution (Tilicho channels / Google intelligence / customer systems / trust+languages) · editable business case (volume, cost, automation sliders with provenance flags) · package recommendation with account-specific rationale, includes/excludes, recurring-cost note ("no unlimited usage") · six persona messages · tier rationale with 30/60/90 plan for Tier 1 · one specific next-step CTA.
- **Packages**: Launch $50K (≤3 channels, 1 workflow, 8–10 wks) / Scale $100K (4–6 channels, 2–3 workflows, 10–14 wks) / Transform $200K (7–10 channels, multi-BU, 14–20 wks) — implementation/integration only; Tilicho usage, Google Cloud consumption, telephony, managed ops always billed separately.

## 11. Restricted technical appendix (internal / legal / procurement only — not GTM content)

Underlying technology dependencies are consolidated under the Tilicho Labs partnership umbrella in all GTM material. Any constituent platform, API vendor, or subcontracted technology powering the Tilicho Labs communications layer must be documented here (and in contract schedules) only: current constituent-vendor list, API dependency inventory, per-capability confirmation status, and data-flow attestations are maintained by the partner team and are intentionally excluded from this repository's GTM pages. Earlier candidate-partner shortlists referenced in v1 planning are superseded by this structure.

## 11. Build notes

- Palette follows repo Google-style tokens; Inter; Tailwind v4; framer-motion; lucide-react.
- ROI calculators show all formulas and mark defaults as modelling assumptions — no unsupported savings claims anywhere in copy.
- Internal metrics (seat activation, consumption) appear **only** on `/voice/internal`.
- `robots: noindex` set for the whole `/voice` tree.
