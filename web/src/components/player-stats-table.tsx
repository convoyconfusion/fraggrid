import type { PlayerStatRow } from "@/lib/types";

export function PlayerStatsTable({ rows, accent }: { rows: PlayerStatRow[]; accent: string }) {
  const extraLabels: string[] = [];
  for (const row of rows) {
    for (const stat of row.extraStats) {
      if (!extraLabels.includes(stat.label)) extraLabels.push(stat.label);
    }
  }

  return (
    <div className="card-clip overflow-x-auto border border-border bg-surface">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-text-muted">
            <th className="px-4 py-3 font-medium">Player</th>
            <th className="px-4 py-3 font-medium">Team</th>
            <th className="px-4 py-3 text-right font-medium">K</th>
            <th className="px-4 py-3 text-right font-medium">D</th>
            <th className="px-4 py-3 text-right font-medium">A</th>
            <th className="px-4 py-3 text-right font-medium">K/D</th>
            <th className="px-4 py-3 text-right font-medium">MVPs</th>
            {extraLabels.map((label) => (
              <th key={label} className="px-4 py-3 text-right font-medium">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`${row.player}-${i}`} className="border-b border-border/60 last:border-0 hover:bg-surface-2">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                  <span className="font-medium text-text">{row.player}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-text-muted">{row.team ?? "—"}</td>
              <td className="px-4 py-3 text-right font-mono">{row.kills ?? "—"}</td>
              <td className="px-4 py-3 text-right font-mono">{row.deaths ?? "—"}</td>
              <td className="px-4 py-3 text-right font-mono">{row.assists ?? "—"}</td>
              <td className="px-4 py-3 text-right font-mono">{row.kd ?? "—"}</td>
              <td className="px-4 py-3 text-right font-mono">{row.mvps ?? "—"}</td>
              {extraLabels.map((label) => (
                <td key={label} className="px-4 py-3 text-right font-mono">
                  {row.extraStats.find((s) => s.label === label)?.value ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
