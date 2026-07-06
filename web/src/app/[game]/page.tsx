import Link from "next/link";
import { notFound } from "next/navigation";
import { GAME_ORDER, GAMES, isGameSlug } from "@/lib/games";
import { getArticles, getGameData, getTournaments } from "@/lib/data";
import { MatchCard } from "@/components/match-card";
import { StandingsTable } from "@/components/standings-table";
import { ArticleCard } from "@/components/article-card";
import { Reveal } from "@/components/reveal";
import { CursorGlow } from "@/components/cursor-glow";

export function generateStaticParams() {
  return GAME_ORDER.map((game) => ({ game }));
}

export default async function GameHubPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game: slug } = await params;
  if (!isGameSlug(slug)) notFound();

  const game = GAMES[slug];
  const [data, news, tournaments] = await Promise.all([
    getGameData(slug),
    getArticles(slug),
    getTournaments(slug),
  ]);
  const matches = [...data.matches.running, ...data.matches.upcoming];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="relative mb-10 flex flex-wrap items-center justify-between gap-3">
        <CursorGlow />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: game.accent }} />
            <h1 className="text-fluid-2xl font-bold text-text">{game.name}</h1>
          </div>
          <p className="text-fluid-base mt-1 text-text-muted">
            {game.platform} ·{" "}
            {game.dataSource === "pandascore"
              ? "Live data via PandaScore"
              : "Stats entered manually by our team"}
          </p>
        </div>
      </header>

      <Reveal as="section" className="mb-12">
        <h2 className="text-fluid-2xl mb-4 font-bold text-text">Live &amp; upcoming matches</h2>
        {matches.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} accent={game.accent} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No scheduled matches right now.</p>
        )}
      </Reveal>

      <Reveal as="section" className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-fluid-2xl font-bold text-text">Standings</h2>
          {data.standingsContext && (
            <span className="text-xs text-text-muted">{data.standingsContext}</span>
          )}
        </div>
        <StandingsTable rows={data.standings} columns={game.standingsColumns} accent={game.accent} />
      </Reveal>

      {tournaments.length > 0 && (
        <Reveal as="section" className="mb-12">
          <h2 className="text-fluid-2xl mb-4 font-bold text-text">Tournaments</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((t) => (
              <Link
                key={t.slug}
                href={`/${slug}/tournaments/${t.slug}`}
                className="card-clip-sm block border border-border bg-surface p-4 transition hover:bg-surface-2"
              >
                <p className="font-medium text-text">{t.name}</p>
                {t.prizePool && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-live-red" />
                    <span className="font-mono">{t.prizePool}</span>
                  </p>
                )}
              </Link>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal as="section" className="mb-12">
        <h2 className="text-fluid-2xl mb-4 font-bold text-text">Teams</h2>
        <div className="flex flex-wrap gap-2">
          {data.teams.map((team) => (
            <span
              key={team.acronym}
              className="card-clip-sm flex items-center gap-2 border border-border bg-surface px-3 py-2 text-sm"
            >
              <span className="font-mono text-xs text-text-muted">{team.region}</span>
              {team.name}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal as="section">
        <h2 className="text-fluid-2xl mb-4 font-bold text-text">{game.shortName} news</h2>
        {news.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No articles yet.</p>
        )}
      </Reveal>
    </div>
  );
}
