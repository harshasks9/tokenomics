import type { ReverseSolve, SolveRow } from "@/lib/deal-check/engine";

const show = (row: SolveRow, v: number | boolean | null): string => {
  if (v === null) return "—";
  if (typeof v === "boolean") return v ? "yes" : "no";
  const r = row.unit === "month" ? v.toFixed(0) : Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2);
  return row.unit.startsWith("$") ? `$${r}M${row.unit.slice(2)}` : `${r}${row.unit ? " " + row.unit : ""}`;
};

export default function SolveTable({ solve }: { solve: ReverseSolve }) {
  return (
    <div className="dc-tablewrap">
      <table className="dc-table">
        <thead>
          <tr><th>Lever</th><th>Now</th><th>Google wins at</th><th style={{ textAlign: "left" }}>Why</th></tr>
        </thead>
        <tbody>
          {solve.rows.map((row) => (
            <tr key={row.key} className={solve.smallest && solve.smallest.key === row.key ? "best" : undefined}>
              <td>{row.label}{solve.smallest && solve.smallest.key === row.key ? " · smallest change" : ""}</td>
              <td>{row.mode === "info" ? show(row, row.current) : show(row, row.current)}</td>
              <td>{show(row, row.value)}{row.dpm ? " (DPM)" : ""}</td>
              <td className="why">{row.why}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
