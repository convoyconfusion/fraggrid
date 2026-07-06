import { notFound } from "next/navigation";
import Link from "next/link";
import { GAMES, isGameSlug } from "@/lib/games";
import { getTournament } from "@/lib/data";
import { PlayerStatsTable } from "@/components/player-stats-table";
import { Reveal } from "@/components/reveal";
import { CursorGlow } from "@/components/cursor-glow";

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ game: string; slug: string }>;
}) {
  const { game: gameSlug, slug: tournamentSlug } = await params;
  if (!isGameSlug(gameSlug)) notFound();

  const game = GAMES[gameSlug];
  const tournament = await getTournament(gameSlug, tournamentSlug);
  if (!tournament) notFound();

  const dateRange = [tournament.startDate, tournament.endDate]
    .filter(Boolean)
    .map((d) => new Date(d as string).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }))
    .join(" – ");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="relative mb-4 text-sm">
        <Link href={`/${gameSlug}`} className="text-text-muted hover:text-text">
          ← {game.shortName}
        </Link>
      </div>

      <header className="relative mb-10">
        <CursorGlow />
        <div className="relative z-10 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: game.accent }} />
          <h1 className="text-fluid-3xl font-bold text-text">{tournament.name}</h1>
        </div>
        <div className="relative z-10 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
          {dateRange && <span>{dateRange}</span>}
          {tournament.prizePool && (
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-live-red" />
              Prize pool: <span className="font-mono text-text">{tournament.prizePool}</span>
            </span>
          )}
        </div>
      </header>

      <Reveal as="section">
        <h2 className="text-fluid-2xl mb-4 font-bold text-text">Player stats</h2>
        {tournament.playerStats.length > 0 ? (
          <PlayerStatsTable rows={tournament.playerStats} accent={game.accent} />
        ) : (
          <p className="text-sm text-text-muted">No player stats entered for this tournament yet.</p>
        )}
      </Reveal>
    </div>
  );
}
