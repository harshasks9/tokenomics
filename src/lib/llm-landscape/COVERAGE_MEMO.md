# Coverage memo — LLM Landscape dataset, Phase 1

Snapshot date: **2026-08-22**. Companion to `public/llm-landscape/models.json`
(173 records: 24 Tier-1, 20 Tier-2, 129 Tier-3 stubs; 55 workload-keyed Google
mappings; 295 graded claims). This memo is the honest-gaps document the brief
requires: what was cut, what could not be verified, where sources conflict, and
what to re-check before this data faces a customer.

## 1. Method, and one global evidence caveat

Research ran as nine parallel agents (per vendor cluster) under a written
evidence contract, plus a coordinator gap-fill pass. Two environment
constraints shaped sourcing quality and you should know them before trusting
any single citation:

- **Full-page fetches were blocked for most of the web** by the sandbox's
  egress proxy. Pages read in full: GitHub/raw (vendor READMEs, LICENSE files,
  LiteLLM's pricing catalog, Google's python-genai changelog),
  platform.claude.com (model docs, deprecations), cloud.google.com (3.1 Pro
  blog, Distributed Cloud page), PyPI. **Everything else — including all press
  and practitioner citations — is search-result-snippet evidence**: the URL is
  real and appeared in results this session, the claim matches the
  snippet/summary, but the full page was not read. Treat quoted figures from
  press/SEO domains at snippet confidence.
- **A shared 200-call search budget ran out mid-run** for most agents; the
  coordinator re-sourced the worst casualties (ElevenLabs slice, gpt-oss
  reception, GPT-4o context, Veo weaknesses, Google voice-cloning status,
  image-arena state). Remaining casualties are listed in §3.

Machine-readable sources stood in where docs were blocked: LiteLLM's pricing
catalog is the source for most current Google pricing/context/deprecation
metadata (it mirrors Google's pricing pages), and vendor GitHub READMEs are
the primary source for Chinese-vendor specs and dates.

## 2. Scope: what was cut and why

Caps bound, as designed (24/24 Tier-1, 20/20 Tier-2). Named cuts:

- **Cohere Command family, Amazon Nova, NVIDIA Nemotron, Falcon, Baidu Ernie,
  Tencent Hunyuan, MiniMax/Hailuo, Inflection** — none passed the inclusion
  test (no capability-first, no forced repricing, no workload-default moment
  at the quality bar of what's in).
- **Microsoft Phi-4** — the "small model on synthetic data" proof point; cut
  at the Tier-3 boundary when caps bound. Cheap to add as a stub in revision
  if you want Microsoft represented.
- **Midjourney** — Tier-3 stubs only (v5/v7): culturally huge, but no API era
  until late, no enterprise posture, benchmark-free by choice.
- **Whisper, DALL·E line, GPT-4 Turbo/4.5/4.1, o-series minors, Runway, Kling,
  Wan (open video), Seedance** — Tier-3 stubs for lineage/continuity.
- Tier-promotion recommendations from research agents, **declined for caps**,
  for your review: gpt-5-6-sol→T1 (agent argued it's the reigning flagship;
  I kept GPT-5.5 as the T1 repricing landmark), claude-opus-4-8→T2,
  claude-mythos-5→T2, glm-5→T2, kimi-k2-thinking→T2, qwen3-8→T2,
  nano-banana-pro→T2, gpt-image-2→T2, gemini-3-flash→T2, muse-glimmer→T1,
  mistral-large-3→T1, gemini-omni-flash→T2, gpt-4-turbo→T2. Each is one line
  in the data today; promoting any means demoting something.

Roster corrections made during research (sweep assumptions that were wrong):
"Qwen 4 Coder" does not exist (aggregator-data artifact; replaced by the real
Qwen3.6-35B-A3B), "Veo 4" does not exist (content-mill vaporware; Gemini Omni
Flash is the actual successor lane), GPT-5.6 "Sol" is a tier name
(Luna/Terra/Sol), and the "Opus 4.8/GPT-5.5 tied on SWE-bench" claim from one
2026 roundup did not survive verification (the real near-tie is Opus 5 vs
GPT-5.6 Sol, a generation later).

## 3. Fields that are null (or absent) because they could not be verified

Everything below was attempted and deliberately left null rather than
recalled from training memory:

- `gemini-embedding-001.released` — GA date and the "MTEB multilingual #1"
  claim could not be URL-verified (blocked domains + budget); record carries
  LiteLLM-sourced price/dims/deprecation instead.
- Output-token limits for most pre-2026 models (o1, GPT-5.5, Qwen3, R1, V4,
  Gemini 1.5 Pro, all video models) — never appeared in an encountered source.
- All Anthropic/OpenAI/Google parameter counts — undisclosed; no rumor numbers
  repeated anywhere in the dataset.
- GPT-4/4o-era absolute API prices — not re-encountered; omitted from claims.
- Veo/Flow cumulative-usage stats; Runway pricing ("not obtained", not "not
  published"); Lyria 3 pricing; Vertex batch discount % (commonly cited 50%,
  not confirmable this session — not stated anywhere in the data).
- Enterprise compliance specifics (FedRAMP level, CMEK/VPC-SC details,
  indemnification terms — Google and rivals alike): mapping rows stay
  qualitative and name capability areas only. **Verify certifications from
  primary compliance docs before quoting to a customer.**
- xAI government-deal figures, SuperGrok pricing, OpenRouter usage rankings,
  Kimi K2's modified-MIT attribution thresholds, R1's early-2025 serving
  instability, ElevenLabs enterprise-contract details — all omitted entirely
  rather than cited from memory.
- Tier-3 stub dates resting on training knowledge (flagged in stub notes):
  ~15 pre-mid-2025 dates (allowed by the brief) plus three post-mid-2025 weak
  spots called out by the agent: deepseek-v3-1 (month), deepseek-v3-2-exp,
  qwen3-max. grok-4-fast's date is similarly unverified-this-session.

## 4. Source conflicts, and the side taken

- **Dates recorded at month precision because sources split**: Mistral Large 3
  (Dec 2 vs Dec 4, 2025), Gemini 2.0 Flash experimental (Dec 11 vs 13, 2024),
  Veo 3.1 (mid-Oct 2025), Gemini 3.6 Flash (July 21 single-source).
- **Gemini 3.1 Pro release**: Feb 19 (consumer announce, taken) vs Feb 20
  (Cloud blog, noted). **Gemini 2.5 shutdown**: Oct 16 (community) vs Oct 20
  (LiteLLM) — recorded as "mid-Oct 2026".
- **Sora shutdown economics**: ~$1M/day burn vs "$8–12M/month" (~3x apart) —
  both sides in `disputed`; dates are solid, dollars are press reconstructions.
- **GLM-5.2 size**: 744B (vendor repo, taken) vs 753B (press). **Kimi K3
  license**: "Kimi K3 License" (repo, taken) vs "modified MIT" (press).
- **Qwen3.8-2.4T license**: custom revenue-gated license (HF metadata via
  aggregators, taken for weights) vs Apache-2.0 (code repo only).
- **V4's SWE-bench 80.6%** is vendor-run and was awaiting independent proof at
  GA+9 days; a circulating 96.4% figure was judged SEO conflation and used
  only as evidence of number-laundering (in `disputed`).
- **Aug-2026 image-arena leadership**: gpt-image-2 led LMArena's blind votes
  (Elo 1386, July) while Nano Banana 2 topped Artificial Analysis at launch —
  left contested in records and mappings; **do not claim "#1" for either
  without checking lmarena.ai on the day you present**.
- **GPT-4o's API end-of-life** has three conflicting narratives (no-changes
  messaging vs Nov-2025 snapshot kill notice vs Feb-2026 404 reports) —
  recorded as retired, with the nuance in `disputed`.
- Benchmark aggregator variance (e.g. Opus 5 SWE-V 96.0 vs 97.0; Opus 4.5's
  80.9% vs Opus 4.6's later 80.8% on different aggregator snapshots) is
  recorded as ranges or attributed per-source, never averaged.

## 5. Mapping-layer notes (google_equivalents)

- Rows were authored centrally by the coordinator against a verified
  current-stack sheet (`gemini-3.1-pro-preview` $2/$12, Flash line 3.5→3.7,
  Veo 3.1 $0.40/s, Nano Banana line, Live/TTS previews, gemini-embedding-001/2,
  Gemma 3/4, GDC air-gapped, Gemini CLI free tier). Rationale/confidence prose
  is analyst voice by design; graded claims live in the records.
- `google_model` is a display-name string, not a dataset id (several targets
  are API SKUs below record granularity). Post-review, these could be
  normalized to `{label, model_id?}` if the UI wants links.
- **5 rows set `google_model: null`** (Stable Diffusion, FLUX, Llama 3.1 405B,
  DeepSeek V4 self-host, Qwen3.6 local coding): all are the same structural
  gap — Google ships no open weights above Gemma's ~31B and none at all for
  image generation. **4 more rows recommend staying put in as many words**
  (Claude Opus 5 and GPT-5.6 Sol for capability-first agentic coding, Mistral
  Large 3 for hard EU sovereignty, ElevenLabs for cloned-voice products).
  Confidence distribution: 22 high / 18 medium / 15 low.
- Recurring, sourced `where_google_loses` themes you should expect customers
  to raise: model-lifecycle churn (2.0 Flash's 3.5-month hard shutdown;
  flagships living on `-preview` ids), the 2M-context regression since 1.5
  Pro, Deep Think being subscription-gated, computer-use still on a 2.5-era
  preview model, and 3.5 Pro's three missed GA dates.

## 6. Known dataset limitations & open design questions for the checkpoint

1. **§6 comparison-view dimensions**: the §3 schema has no per-dimension
   rating structure, and inventing 9-axis ratings × 44 records without
   sources would violate the evidence rules. Phase-2 proposal: derive
   comparison cells from known_for/weaknesses/google_equivalents, adding an
   optional `dimension_notes` block only where a sourced claim exists, and
   rendering "not assessed" elsewhere. Decision needed at this checkpoint.
2. Pricing is deliberately not a schema field (fastest-moving, most
   confabulated); it appears only inside dated, sourced claim text.
3. Two stub-status deviations from the enum, both honest: `grok-5`
   ("announced", unreleased) and `gemini-3-5-pro` (announced, preview-only).
   An "announced" status value may be worth adding to the schema.
4. `market_reputation` prose occasionally carries community folklore without
   a claims-array citation (e.g. Stable Diffusion's hands/text-garbling era);
   flagged by the agent, kept as narrative. Strike if you want zero unsourced
   prose.
5. 2026 records lean more on press/SEO snippets than pre-2026 records
   (which had Wikipedia/vendor-doc density). Single-source 2026 facts are
   flagged inside records/notes: Omni Flash's $0.10/s and 720p specs,
   Grok 4.5's "trained on Cursor data", Grok 4.6's pricing, Nano Banana 2's
   exact day, seedance-2's whole stub.
6. The H1-2026 "government gating" pattern (GPT-5.6's clearance-delayed GA,
   GPT-5.5-Cyber's vetted program, Fable/Mythos export-control suspension,
   Mythos 5's approved-orgs model) recurs across three vendors' records; the
   timeline UI may deserve an annotation layer for it.
7. Agent notes files (per-vendor unverified-item inventories, ~85KB) are
   preserved in the session workspace and can be committed on request; this
   memo carries every item that affects buyer-facing use.

## 7. Self-check against the definition of done

| Check | Result |
|---|---|
| Every numeric field sourced or null | **Pass** — validator enforces context/claim sourcing; nulls inventoried in §3; stub-date exceptions flagged in §3 |
| Every claim carries evidence_grade | **Pass** — 295/295 (129 vendor-claim, 97 practitioner-consensus, 28 independent-eval, 21 measured-benchmark, 20 analyst-inference) |
| Every Tier-1 model ≥1 non-vendor weakness | **Pass** — validator-enforced (24/24) |
| Every google_equivalents entry has non-empty where_google_loses | **Pass** — 55/55 rows |
| ≥3 mappings recommend against Google or null | **Pass** — 5 null + 4 explicit stay-put |
| No composite/overall score anywhere | **Pass** — none exist; validator greps for score-shaped keys |
| Family lineage renders for ≥6 families | **Pass** — 25 families with ≥2 members via predecessor_id |
| Tier-1 count within 18–24 | **Pass** — 24 (Tier-2 at 20/20) |
| Coverage memo lists unverified fields and conflicts | **Pass** — this document, §3–§5 |

Validator: `0 errors, 1 warning` (the warning is gemini-embedding-001's
honestly-null release date, which the UI should render as "not published").
