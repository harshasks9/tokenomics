import { FSP_BRACKET, TIER_LADDER } from "@/lib/offers/content";

const COLOUR = {
  gold: "var(--gold)",
  blue: "var(--blue)",
  green: "var(--green)",
} as const;

const WIDTH = 660;
const ROW_H = 44;
const TOP = 44;
const LABEL_W = 210;
const BAR_MAX = 330;

/**
 * The ladder as a diagram: bar length is proportional to the multiplier, so
 * 1.8x really is 3.6× the length of 0.5x. Prose sits in HTML beneath it rather
 * than inside a foreignObject.
 */
export default function TierLadder() {
  const height = TOP + TIER_LADDER.length * ROW_H + 8;

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${WIDTH} ${height}`}
          width={WIDTH}
          height={height}
          role="img"
          aria-label="Serving-tier price ladder: Priority PayGo at 1.8x; Standard PayGo and Provisioned Throughput at 1.0x, PT only at 100 percent utilization; Flex, Batch, Off-peak and Deferred at 0.5x of Standard PayGo. An FSP commitment bracket spans all rungs at minus 10 percent for a one-year term or minus 20 percent for three years."
          style={{ display: "block", maxWidth: "none" }}
        >
          <title>Serving-tier price ladder with the FSP bracket</title>

          {/* FSP bracket spanning every rung */}
          <g>
            <line
              x1={LABEL_W}
              x2={LABEL_W + BAR_MAX}
              y1={26}
              y2={26}
              stroke="var(--fsp)"
              strokeWidth={1}
            />
            <line x1={LABEL_W} x2={LABEL_W} y1={26} y2={34} stroke="var(--fsp)" strokeWidth={1} />
            <line
              x1={LABEL_W + BAR_MAX}
              x2={LABEL_W + BAR_MAX}
              y1={26}
              y2={34}
              stroke="var(--fsp)"
              strokeWidth={1}
            />
            <text x={LABEL_W} y={12} fontSize={11} fill="var(--fsp)" className="o-mono">
              FSP
            </text>
            <text x={LABEL_W} y={22} fontSize={9.5} fill="var(--ink-faint)" className="o-mono">
              −10% (1Y) / −20% (3Y) · monthly · dollar-fungible
            </text>
          </g>

          {TIER_LADDER.map((rung, index) => {
            const y = TOP + index * ROW_H;
            const barW = Math.max(rung.weight * BAR_MAX, 4);
            return (
              <g key={rung.id}>
                <text x={0} y={y + 11} fontSize={12} fill="var(--ink)">
                  {rung.name}
                </text>
                <rect
                  x={LABEL_W}
                  y={y}
                  width={barW}
                  height={15}
                  fill={COLOUR[rung.colour]}
                  opacity={0.26}
                />
                <rect
                  x={LABEL_W}
                  y={y}
                  width={barW}
                  height={2}
                  fill={COLOUR[rung.colour]}
                />
                <text
                  x={LABEL_W + barW + 10}
                  y={y + 12}
                  fontSize={11.5}
                  fill={COLOUR[rung.colour]}
                  className="o-mono"
                >
                  {rung.multiplier}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <dl className="mt-5 grid gap-3.5 sm:grid-cols-2">
        {TIER_LADDER.map((rung) => (
          <div key={rung.id}>
            <dt className="flex items-baseline gap-2">
              <span
                aria-hidden="true"
                style={{
                  width: 8,
                  height: 8,
                  background: COLOUR[rung.colour],
                  display: "inline-block",
                }}
              />
              <span className="text-[12.5px]" style={{ color: "var(--ink)" }}>
                {rung.name}
              </span>
              <span className="o-mono o-faint text-[10px]">{rung.status}</span>
            </dt>
            <dd className="o-faint mt-1 pl-4 text-[11.5px] leading-[1.6]">
              {rung.blurb}
            </dd>
          </div>
        ))}
      </dl>

      <p className="o-mono o-faint mt-4 text-[10px] leading-[1.6]">
        {FSP_BRACKET.detail}
      </p>
    </div>
  );
}
