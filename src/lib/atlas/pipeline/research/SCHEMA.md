# AI Intelligence Atlas — research output schema (thinker agents)

Research cutoff: 2026-10-11. Today is 2026-10-11. Nothing after the cutoff.

Write ONE JSON file (UTF-8, valid JSON, no comments) with this shape:

{
  "agent": "<your batch name>",
  "thinkers": [ Thinker, ... ],
  "evidence": [ Evidence, ... ],      // shared list for all your thinkers; ids are global-unique strings
  "assertions": [ Assertion, ... ],
  "relations": [ Relation, ... ],
  "gaps": [ "free-text notes on what you could not verify / source limitations" ]
}

## Thinker
{
  "id": "kebab-case-name",            // e.g. "sam-altman" (use the ids given in your brief exactly)
  "name": "Sam Altman",
  "cohort": "builders" | "researchers" | "investors",
  "roles": [ { "org": "OpenAI", "title": "CEO", "from": "2019", "to": null } ],   // years or YYYY-MM
  "bio": "1–2 factual sentences (who they are, why they matter to AI).",
  "selection": {                      // 1–5 each, with a one-line justification for each
    "influence": [4, "why"],          // intellectual influence on AI development
    "foresight": [3, "why"],          // accuracy/originality of historical predictions (provisional)
    "allocation": [5, "why"],         // ability to steer technology or capital
    "contribution": [5, "why"],       // contribution to architecture or commercialization
    "corpus": [4, "why"],             // breadth/consistency/quality of documented public thinking
    "future": [5, "why"]              // influence over the future ecosystem
  },
  "mentalModel": [                    // how their thinking evolved; one entry per period they were publicly active in
    { "period": "p2012" | "p2017" | "p2020" | "p2022" | "p2024" | "p2025" | "p2026",
      "summary": "What they believed AT THAT TIME (not hindsight), 1–3 sentences.",
      "evidenceIds": ["ev-..."] }
  ],
  "reversals": [ { "date": "YYYY-MM", "from": "...", "to": "...", "trigger": "what changed their mind", "evidenceIds": [...] } ],
  "corpusNotes": "Source limitations for this person (e.g. few dated predictions, mostly corporate messaging)."
}

Periods: p2012 = 2012–2016 deep learning practical; p2017 = 2017–2019 transformers/pretraining;
p2020 = 2020–2021 scaling laws/foundation models; p2022 = 2022–2023 generative AI mass adoption;
p2024 = 2024 multimodal/open-weight/infra; p2025 = 2025 reasoning/inference scaling/agents;
p2026 = Jan 1 – Oct 11 2026.

## Evidence
{
  "id": "ev-<thinker-short>-<n>",     // e.g. "ev-altman-3"; outcome evidence: "ev-out-<topic>-<n>"
  "url": "https://...",               // MUST be a real URL you saw in search results or fetched. Never construct/guess URLs.
  "title": "Title of the source",
  "publisher": "e.g. OpenAI blog, Lex Fridman Podcast, NYT, arXiv",
  "date": "YYYY-MM-DD" | "YYYY-MM",   // original publication date of the statement (verify it!)
  "speaker": "thinker id, or 'outcome' for outcome sources, or the org/author name",
  "type": "paper" | "interview" | "talk" | "essay" | "letter" | "earnings" | "filing" | "testimony" | "social" | "book" | "announcement" | "news" | "data",
  "primary": true | false,            // primary = the person's own words/acts; secondary = reporting/analysis
  "passage": "Exact quote (≤ 40 words) ONLY if you saw it verbatim in a fetched page or search snippet; otherwise a precise paraphrase.",
  "verbatim": true | false,           // true only when passage is an exact quote you actually saw
  "verification": "fetched" | "snippet" | "recalled",
      // fetched = you opened the page and saw it; snippet = seen in search results text;
      // recalled = from your background knowledge, NOT re-confirmed this session (allowed but must be honest; give your best real URL only if confident it exists, otherwise url = "")
  "note": "context needed to read the passage fairly (what question was asked, conditional framing, etc.)"
}

## Assertion  (5–10 per thinker, the CONSEQUENTIAL ones; fewer if evidence is thin — say so in gaps)
{
  "id": "as-<thinker-short>-<n>",
  "thinkerId": "sam-altman",
  "date": "YYYY-MM-DD" | "YYYY-MM",   // first documented date
  "claim": "Faithful quote or precise paraphrase.",
  "claimIsQuote": true | false,
  "kind": "prediction" | "opinion" | "aspiration" | "conditional" | "action",
      // prediction = explicit testable forecast; opinion = view about how things are/work;
      // aspiration = goal/mission statement; conditional = "if X then Y"; action = strategic decision implying a belief
  "category": "technical" | "economic" | "market" | "adoption" | "governance",
  "layers": [ layer ids ],            // energy, semis, cloud, data, architecture, training, inference, models, platforms, agents, apps, distribution, economics, society
  "topics": [ topic ids ],            // scaling, architecture, post-training, reasoning, data, open-weights, infra-cycle, commoditization, hyperscalers, agents, coding, app-moats, enterprise-roi, labor, agi-timelines, safety, value-accrual
  "assumptions": [ "conditions necessary for the claim to be correct" ],
  "predictedOutcome": "Specific testable implication. Do NOT invent numbers that were not stated.",
  "horizon": "free text e.g. 'by 2025', 'within 5 years of 2016', 'open-ended'",
  "horizonDate": "YYYY" | null,       // year the claim becomes evaluable; null if open-ended
  "contextAtTime": "What evidence/consensus was available when they said it (avoid hindsight).",
  "evidenceIds": ["ev-..."],          // sources for the CLAIM
  "outcome": "What had actually happened by 2026-10-11 (facts only).",
  "outcomeEvidenceIds": ["ev-out-..."],   // independent source(s) for the outcome where possible
  "verdict": "correct" | "partial" | "incorrect" | "unresolved",
      // unresolved if the horizon has not passed or it is not falsifiable yet. Don't confuse disagreement with falsification.
  "timing": "early" | "on-time" | "late" | "premature" | "n/a",
  "verdictRationale": "1–3 sentences: why this verdict, judged on info available when said.",
  "confidence": "high" | "medium" | "low",   // confidence in evidence + interpretation
  "originality": 1-5,                 // 5 = strongly contrarian/novel at the time; 1 = restating consensus
  "causal": 1-5 | null,               // right for the right reasons? 5 = mechanism correct; null if unresolved
  "specificity": 1-5,                 // 5 = precise & falsifiable; 1 = vague
  "evolution": "Whether/when they revised this view, or 'no revision found'."
}

## Relation (person ↔ person or person ↔ idea, documented)
{
  "id": "rel-<n>",
  "from": "thinker id",
  "to": "thinker id" | "org:<name>" | "tech:<name>",
  "type": "influenced_by" | "agrees_with" | "challenges" | "contradicts" | "invested_in" | "built" | "changed_position",
  "date": "YYYY" | "YYYY-MM",
  "note": "What exactly the relationship is (e.g. LeCun publicly disputed Hinton's existential-risk view in 2023).",
  "evidenceIds": ["ev-..."],
  "inferred": true | false            // true if not directly documented
}

## Rules (non-negotiable)
- Never fabricate quotes, dates, URLs or numbers. If unsure, mark verification "recalled", lower confidence, and note it in gaps.
- Verify original dates. Preserve context (conditional statements stay conditional).
- Distinguish personal predictions from corporate marketing; an investment is NOT proof of a personal belief.
- Distinguish benchmark gains from realized economic outcomes.
- Deadlines not yet reached (after 2026-10-11) → verdict "unresolved".
- Include at least one reversal or evolution note per thinker where one exists; show disagreements with other thinkers as relations.
- Prefer primary sources (papers, interviews, talks, essays, letters, earnings calls, testimony). Use secondary only for context/outcomes.
