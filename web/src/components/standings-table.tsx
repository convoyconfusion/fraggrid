import type { StandingRow } from "@/lib/types";

export function StandingsTable({
  rows,
  columns,
  accent,
}: {
  rows: StandingRow[];
  columns: [string, string, string];
  accent: string;
}) {
  return (
    <div className="card-clip overflow-hidden border border-border bg-surface">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-muted">
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Team</th>
            <th className="px-4 py-3 text-right font-medium">{columns[0]}</th>
            <th className="px-4 py-3 text-right font-medium">{columns[1]}</th>
            <th className="px-4 py-3 text-right font-medium">{columns[2]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.rank}
              className="border-b border-border/60 last:border-0 hover:bg-surface-2"
            >
              <td className="px-4 py-3 font-mono text-text-muted">{row.rank}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: row.rank <= 3 ? accent : "var(--border)" }}
                  />
                  <span className="font-medium text-text">{row.team}</span>
                  <span className="text-xs text-text-muted">{row.acronym}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-mono">{row.w ?? "—"}</td>
              <td className="px-4 py-3 text-right font-mono">{row.l ?? "—"}</td>
              <td className="px-4 py-3 text-right font-mono">{row.rd ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
