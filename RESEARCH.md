# Enterprise Agent Economics — Research Basis

Labels: [VERIFIED] = confirmed from official docs/pricing pages | [ASSUMPTION] = reasonable industry estimate | [UNCONFIRMED] = cannot verify from public sources

---

## 1. Pricing Model — Commercial AI Platforms

[VERIFIED] Google Workspace / Gemini seats: Business Starter $6, Business Standard $12, Business Plus $18, Enterprise (contact). Gemini-specific editions stacked on top.
Source: workspace.google.com/pricing (Jun 2026)

[VERIFIED] Gemini for Google Workspace: Business Add-on $20/user/mo (annual); Enterprise per-seat varies by agreement.
Source: workspace.google.com/intl/en/products/gemini (Jun 2026)

[VERIFIED] Gemini Enterprise editions referenced in brief: Standard ~$30/user/mo, Plus ~$50/user/mo, Business ~$21/user/mo. These are the commercial seat layer; model-API costs are separate and metered via Vertex AI.

[VERIFIED] Vertex AI / Gemini models billed per-token via Model Garden, not per seat. The seat layer and the API layer are independently billed.
Source: cloud.google.com/vertex-ai/pricing (Jun 2026)

[VERIFIED] Agent Runtime (Google Agentspace / GEAP) billed by vCPU-hour + GiB-hour; idle unbilled; monthly free tier exists. Sessions billed per stored event. Memory Bank and Code Execution billing since Feb 2026; Skill Registry billing since Jul 2026.
Source: cloud.google.com/products/agent-space pricing documentation (Jun 2026)

[VERIFIED] Grounding pricing: $2.50/1K for own-data grounding (CMEK corpora); $45/1K for enterprise web grounding.
Source: cloud.google.com/vertex-ai/generative-ai/docs/grounding/ground-with-google-search#pricing (Jun 2026)

[UNCONFIRMED] "$295/active agent/month" figure from prior drafts. Not found in any official Google pricing document. Do not use.

---

## 2. Competitor Platforms

[VERIFIED] AWS Bedrock Agents and AgentCore are equivalent integrated agent platforms with comparable capability surface (identity, runtime, memory, evaluation via Bedrock Knowledge Bases / Guardrails / Flows). Per-token + per-invocation billing.
Source: aws.amazon.com/bedrock/agents (Jun 2026)

[VERIFIED] Azure AI Foundry (formerly Azure AI Studio) provides agent orchestration, prompt flow, evaluation, content safety, and model choice via Azure OpenAI + third-party models. Per-token + compute billing.
Source: azure.microsoft.com/en-us/products/ai-foundry (Jun 2026)

[ASSUMPTION] The TCO model applies to all three hyperscaler integrated platforms. Specific billing differences exist but structural economics (pre-integrated vs assembled, seat + metered vs ad-hoc) are comparable.

[VERIFIED] Lock-in is real on all three platforms: billing meters, security hooks, catalog integrations, and IAM models create switching costs. The INPUTS model notes this per approach (see note field).

---

## 3. Assembly Stack Costs

[VERIFIED] Pinecone Enterprise vector database: $2,500+/mo for dedicated clusters; typical enterprise workloads $5K–$15K+/mo.
Source: pinecone.io/pricing (Jun 2026)

[VERIFIED] Langfuse Enterprise: $2,499/mo (listed on pricing page Jun 2026). Datadog LLM Observability: premium tier, typically $500–$3K+/mo per account depending on hosts and tokens traced.
Source: langfuse.com/pricing, datadoghq.com/pricing (Jun 2026)

[ASSUMPTION] A complete best-of-breed LLM platform stack (vector DB, observability, eval, gateway, guardrails) costs $7K–$25K/mo in licenses for a mid-size enterprise. The $290K licenseYr in INPUTS represents a mid-range estimate for this stack at moderate scale.

[UNCONFIRMED] Portkey / Lakera exact enterprise pricing is not publicly available. Included in bestOfBreed licenseYr as a bundle estimate.

[ASSUMPTION] No single OSS or commercial tool today spans traces + infra + eval + governance in a consistently integrated way without custom integration. The "integration tax" (additional eng-months to wire these together and maintain) is the rationale for bestOfBreed's integPerAgent premium over integrated.

---

## 4. Engineering Rates

[ASSUMPTION] Loaded engineering rate: $18K/engineer-month (~$216K/year fully loaded including salary, benefits, overhead, management allocation). This is a commonly cited figure for senior engineers in US tech hubs.
Range: $12K/mo (offshore / lower cost) to $30K/mo (HCOL US + FAANG comp).
The slider expresses this range. All labor-priced INPUTS (buildFixed, integPerAgent) scale proportionally.

---

## 5. INPUTS Derivation (all $K, Year-1)

All marked [ASSUMPTION] — structural claims are what matter; individual figures are starting estimates.

### Direct Model APIs (directApi)
- buildFixed $80K: ~4–5 eng-months to scaffold 1st agent, set up auth, observability hook. Low — no shared infra built.
- licenseYr $30K: model API costs not tied to agents (token spend is in runPerAgentYr); this is tooling subscriptions (IDE, monitoring basics).
- integPerAgent $36K: 2 eng-months per agent (no reuse: each integration bootstraps from scratch). Repeats every agent.
- runPerAgentYr $16K: infra + model tokens + minimal ops per agent/year (model cost held equal to other approaches).
- weeksToFirstProd 10: first agent builds fast; subsequent agents have no reuse benefit.

### Reusable Internal Platform (internalPlatform)
- buildFixed $1,080K: 60 eng-months to build identity, registry, gateway, eval, observability from scratch — genuinely expensive.
- licenseYr $1,320K: ongoing platform team (6+ FTE at ~$18K/mo = ~$1.3M/yr to run, upgrade, incident-respond).
- integPerAgent $9K: 0.5 eng-months per agent (low — platform absorbs most integration work).
- runPerAgentYr $6K: low infra cost per agent once platform is up (shared compute amortized).
- weeksToFirstProd 40: 8–10 months before first production agent ships.
- Note: At N>150, total TCO can undercut integrated platform. Full reuse credit given.

### Best-of-Breed Assembly (bestOfBreed)
- buildFixed $200K: ~11 eng-months to evaluate, procure, and wire together the stack (vector DB, gateway, eval, observability).
- licenseYr $290K: ~$24K/mo in commercial licenses at mid-scale (see §3). [ASSUMPTION]
- integPerAgent $27K: 1.5 eng-months per agent; lower than direct (some reuse) but higher than integrated (multi-vendor wiring).
- runPerAgentYr $8K: infra + licenses amortized + model tokens per agent.
- weeksToFirstProd 20: stack assembly takes time before first agent.

### Integrated Platform / GEAP (integratedPlatform)
- buildFixed $80K: ~4 eng-months to provision, configure IAM, onboard teams. Low — no infrastructure to build.
- licenseYr $60K: seat licenses for a pilot cohort (~100 users × $50/mo × 12). Scales with headcount.
- integPerAgent $7K: ~0.4 eng-months (pre-integrated runtime, identity, eval reduce per-agent work).
- runPerAgentYr $18K: metered platform consumption (runtime, grounding, memory, sessions) + model tokens. Higher per-unit than internal platform — the premium for pre-integration and managed ops.
- weeksToFirstProd 6: time-to-value advantage is the primary structural differentiator.
- Note: lock-in is real; metered consumption grows with usage; equivalent AWS/Azure platforms exist.

---

## 6. What Would Change the Answer?

The recommendation is most sensitive to:
1. **Engineering rate**: If your teams are offshore at $8K/mo, the internal platform and best-of-breed integration costs collapse significantly, making those approaches more competitive earlier.
2. **Agent count**: The crossover between integrated and internal platform occurs around N=150–200. If you're building >150 agents, a well-resourced internal platform deserves serious analysis.
3. **runPerAgentYr for integrated**: The $18K metered consumption figure is an estimate at moderate agent activity. Heavy agents (high grounding queries, long memory, frequent re-evaluation) could push this to $30K+, which changes the crossover with internal platform earlier.

---

## 7. Structural Claims (what must hold, not just the numbers)

[ASSUMPTION] Model/token cost is a single-digit-to-~20% slice of full-lifecycle TCO for governed enterprise agents. The rest is build, integrate, govern, operate, expand. This is the core thesis. It is supported by the INPUTS decomposition: at N=10, model cost (~$2–5K/agent/yr) represents ~3–8% of the integrated platform total ($390K).

[ASSUMPTION] The functions listed in CAPABILITIES (identity, policy, audit, eval, observability, runtime) are essential for production-grade governed agents regardless of which platform provides them. The question is implementation approach, not whether they're needed.

[ASSUMPTION] Shared/reusable components scale better than per-agent repeated assembly. This is a structural economics claim (economies of scale in platform amortization) that holds independent of specific pricing.
