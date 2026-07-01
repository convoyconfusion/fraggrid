import { notFound } from "next/navigation";
import { GAME_ORDER, GAMES, isGameSlug } from "@/lib/games";
import { getArticles, getGameData } from "@/lib/data";
import { MatchCard } from "@/components/match-card";
import { StandingsTable } from "@/components/standings-table";
import { ArticleCard } from "@/components/article-card";

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
  const [data, news] = await Promise.all([getGameData(slug), getArticles(slug)]);
  const matches = [...data.matches.running, ...data.matches.upcoming];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: game.accent }} />
            <h1 className="text-2xl font-bold text-text">{game.name}</h1>
          </div>
          <p className="mt-1 text-sm text-text-muted">
            {game.platform} ·{" "}
            {game.dataSource === "pandascore"
              ? "Live data via PandaScore"
              : "Stats entered manually by our team"}
          </p>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold text-text">Live &amp; upcoming matches</h2>
        {matches.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} accent={game.accent} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No scheduled matches right now.</p>
        )}
      </section>

      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text">Standings</h2>
          {data.standingsContext && (
            <span className="text-xs text-text-muted">{data.standingsContext}</span>
          )}
        </div>
        <StandingsTable rows={data.standings} columns={game.standingsColumns} accent={game.accent} />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold text-text">Teams</h2>
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
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-text">{game.shortName} news</h2>
        {news.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No articles yet.</p>
        )}
      </section>
    </div>
  );
}
