# Deliverable 6 — Customer examples library

*Canonical data: `../data/examples.ts` (15 case studies) and `../data/incidents.ts`
(14 cautionary tales), fully sourced in `research/research-examples.md`. Rendered at
`/governance/examples` with lens/industry filters. Confidence labels: **strong** =
governance mechanics publicly documented; **directional** = real deployment, thinner
public detail — presented as direction of travel.*

## Six patterns the best-governed deployments share

1. **One governed front door** — Goldman Sachs, Walmart, JPMorgan, TELUS, Highmark.
2. **Sensitive data never meets the model raw** — Wells Fargo tokenization; healthcare
   de-identification.
3. **Evals before rollout, evals forever** — Morgan Stanley, Deutsche Bank, Commerzbank.
4. **Humans accountable at the decision point** — HCA, Nevada DETR, NHS scribes.
5. **Constrained blast radius** — Wendy's menu fencing; Fargo's intent-only LLM.
6. **Governance as the paved road** — USAF NIPRGPT→GenAI.mil, Moderna, Macquarie.

## The library (one line each)

**Google Cloud lens (9):**
- **Wells Fargo** [strong] — 245M+ assistant interactions with zero PII to the LLM:
  on-device STT → internal tokenization → Gemini for intent only → deterministic core.
- **Deutsche Bank** [strong] — DB Lumina research agent: published eval regime
  (citation precision/recall, git-pinned baselines), prompts logged to BigQuery.
- **Commerzbank** [strong] — advisory-call compliance protocols where the eval service
  selects the summary *and emits the explanation* — the audit artifact.
- **HCA Healthcare** [strong] — Nurse Handoff split-screen UI: review *is* the workflow.
- **Highmark Health** [strong] — 14,000+ governed users behind one platform; usage
  telemetry as governance data.
- **State of Nevada DETR** [strong] — appeals RAG on a closed legal corpus, human
  referee decides, standing governance committee; publicly scrutinized (say so).
- **TELUS** [strong] — Fuel iX guardrail control plane over Gemini/Claude/others;
  world-first ISO 31700-1 privacy certification; governance became a product.
- **Wendy's** [strong] — FreshAI fenced to the menu with confidence-based human
  handoff: 86% autonomous, ~99% with assists.
- **Macquarie Bank** [directional] — bank-wide Gemini Enterprise with 99% mandatory
  training completion first.

**Market lens (6):**
- **Morgan Stanley** [strong] — the evals-first rollout; >98% advisor-team adoption.
- **JPMorganChase** [strong] — LLM Suite for ~200k employees under the independent
  model-risk function (10-K documented).
- **Goldman Sachs & Walmart** [strong] — the central multi-model gateway pattern at
  firmwide/1.5M-associate scale.
- **Moderna** [strong] — shadow use converted into 750+ governed GPTs via sanctioned
  platform → training → controlled proliferation.
- **US Air Force** [strong] — NIPRGPT sandbox out-competed shadow AI, then
  institutionalized as GenAI.mil.
- **NHS England** [strong] — sector-wide governance rails for ambient scribes
  (DCB0129/0160, Clinical Safety Officer, clinician responsibility).

## Cautionary tales (14, each mapped to the control that would have caught it)

Samsung/ChatGPT (2023) · EchoLeak CVE-2025-32711 (2025) · Air Canada (2024) · Replit
agent DB deletion (2025) · GTG-1002 espionage (2025) · Chevrolet $1 Tahoe (2023) · NYC
MyCity (2024) · Grok prompt change (2025) · Bartz v. Anthropic $1.5B (2025) · Mobley v.
Workday (2025) · McHire/Paradox.ai (2025) · Slack AI injection research (2024) ·
fabricated-citation sanctions wave (2023–26) · Klarna quality reversal (2025).

**Editorial rule:** every example must teach a mechanism (Situation → Challenge →
Controls → Architecture → Outcome). Known thin spots are flagged in the research brief
(e.g., HSBC 2026 partnership is announced intent; Snap's current safety configuration is
inferred) and either excluded or labeled directional.
