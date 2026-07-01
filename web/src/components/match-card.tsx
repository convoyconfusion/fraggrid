import type { Match } from "@/lib/types";

function formatKickoff(iso: string | null) {
  if (!iso) return "TBD";
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MatchCard({ match, accent }: { match: Match; accent: string }) {
  const isLive = match.status === "running";

  return (
    <div className="card-clip-sm border border-border bg-surface p-4">
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span className="truncate">
          {match.league}
          {match.tournament ? ` · ${match.tournament}` : ""}
        </span>
        {isLive ? (
          <span className="flex items-center gap-1 font-semibold text-live-red">
            <span className="h-1.5 w-1.5 rounded-full bg-live-red" />
            LIVE
          </span>
        ) : (
          <span>{formatKickoff(match.scheduledAt)}</span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <TeamRow name={match.teamA.name} acronym={match.teamA.acronym} />
        <div
          className="min-w-[3.5rem] rounded px-2 py-1 text-center font-mono text-lg font-semibold"
          style={{ color: isLive ? accent : "var(--text-muted)" }}
        >
          {match.scoreA} – {match.scoreB}
        </div>
        <TeamRow name={match.teamB.name} acronym={match.teamB.acronym} align="right" />
      </div>

      {match.bestOf && (
        <p className="mt-2 text-right text-xs text-text-muted">Bo{match.bestOf}</p>
      )}
    </div>
  );
}

function TeamRow({
  name,
  acronym,
  align = "left",
}: {
  name: string;
  acronym: string;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex flex-1 items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-2 text-xs font-bold">
        {acronym.slice(0, 3)}
      </span>
      <span className="truncate text-sm font-medium text-text">{name}</span>
    </div>
  );
}
