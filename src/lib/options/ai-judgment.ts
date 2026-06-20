import { defaultJudgment } from "./scoring";
import type { CandidateInput, JudgmentScores } from "./types";

const JUDGMENT_PROMPT = `You score cash-secured-put screener candidates. Return ONLY strict JSON with these keys:
{"moat":1-5,"competitive_vs_ai":1-5,"p_drawdown_temporary":1-5,"downside_event_risk":1-5,"drawdown_class":"temporary_impairment|cyclical|structural_decline|value_trap|governance_or_balance_sheet","thesis":"one sentence"}
Use integer or half-point scores only. Be skeptical: a big drawdown is not itself bullish. This is screening context only, not investment advice.`;

function normalizeHalfPoint(value: unknown) {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return 3;
  return Math.min(5, Math.max(1, Math.round(numeric * 2) / 2));
}

async function callAnthropic(model: string, input: CandidateInput) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 500,
      temperature: 0,
      system: JUDGMENT_PROMPT,
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            ticker: input.profile.ticker,
            name: input.profile.name,
            sector: input.profile.sector,
            price: input.profile.price,
            yearHigh: input.profile.yearHigh,
            marketCap: input.profile.marketCap,
            fundamentals: input.fundamentals,
          }),
        },
      ],
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Anthropic ${model} failed: ${response.status}`);
  }
  const payload = await response.json();
  const text = payload?.content?.find?.((part: { type: string }) => part.type === "text")?.text;
  if (!text) throw new Error("Anthropic response did not include text content");
  return JSON.parse(text);
}

export async function getJudgment(input: CandidateInput, enabled: boolean): Promise<JudgmentScores> {
  if (!enabled || !process.env.ANTHROPIC_API_KEY) return defaultJudgment();
  try {
    let parsed: Record<string, unknown>;
    try {
      parsed = await callAnthropic("claude-sonnet-4-6", input);
    } catch {
      parsed = await callAnthropic("claude-haiku-4-5", input);
    }
    return {
      scores: {
        moat: normalizeHalfPoint(parsed.moat),
        competitive_vs_ai: normalizeHalfPoint(parsed.competitive_vs_ai),
        p_drawdown_temporary: normalizeHalfPoint(parsed.p_drawdown_temporary),
        downside_event_risk: normalizeHalfPoint(parsed.downside_event_risk),
      },
      drawdownClass: String(parsed.drawdown_class ?? "temporary_impairment") as JudgmentScores["drawdownClass"],
      thesis: String(parsed.thesis ?? "AI judgment returned no thesis."),
      flag: "judgment=ai",
      source: "anthropic",
    };
  } catch {
    return {
      ...defaultJudgment(),
      flag: "judgment=neutral(ai error)",
      source: "fallback",
      thesis: "AI judgment failed, so neutral review scores were used.",
    };
  }
}
