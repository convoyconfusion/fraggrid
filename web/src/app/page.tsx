import Link from "next/link";
import { GAME_ORDER, GAMES } from "@/lib/games";
import { getAllGameData, getLatestArticles } from "@/lib/data";
import { MatchCard } from "@/components/match-card";
import { ArticleCard } from "@/components/article-card";
import { Reveal } from "@/components/reveal";
import { CursorGlow } from "@/components/cursor-glow";

export default async function HomePage() {
  const [allGames, news] = await Promise.all([getAllGameData(), getLatestArticles(3)]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="relative mb-14">
        <CursorGlow />
        <h1 className="relative z-10 text-fluid-3xl font-bold tracking-tight text-text">
          Live stats and rankings, across four games.
        </h1>
        <p className="text-fluid-base relative z-10 mt-3 max-w-2xl text-text-muted">
          CS2 and Valorant update automatically once a day. BGMI and PUBG Mobile
          are curated by our team until a reliable live data feed exists for those titles.
        </p>
      </section>

      <Reveal as="section" className="mb-14">
        <SectionHeading title="Live & upcoming" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GAME_ORDER.map((slug) => {
            const game = GAMES[slug];
            const data = allGames[slug];
            const match = data.matches.running[0] ?? data.matches.upcoming[0];
            return (
              <div key={slug}>
                <Link
                  href={`/${slug}`}
                  className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-muted hover:text-text"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: game.accent }} />
                  {game.shortName}
                </Link>
                {match ? (
                  <MatchCard match={match} accent={game.accent} />
                ) : (
                  <p className="card-clip-sm border border-border bg-surface p-4 text-sm text-text-muted">
                    No scheduled matches right now.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Reveal>

      <Reveal as="section" className="mb-14">
        <SectionHeading title="Top teams" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GAME_ORDER.map((slug) => {
            const game = GAMES[slug];
            const data = allGames[slug];
            return (
              <div key={slug} className="card-clip-sm border border-border bg-surface p-4">
                <Link
                  href={`/${slug}`}
                  className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide hover:underline"
                  style={{ color: game.accent }}
                >
                  {game.shortName}
                </Link>
                <ol className="space-y-2 text-sm">
                  {data.standings.slice(0, 5).map((row) => (
                    <li key={row.rank} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-text">
                        <span className="w-4 font-mono text-xs text-text-muted">{row.rank}</span>
                        {row.team}
                      </span>
                      <span className="font-mono text-xs text-text-muted">{row.acronym}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </Reveal>

      <Reveal as="section">
        <SectionHeading title="Latest news" href="/news" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}

function SectionHeading({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-fluid-2xl font-bold text-text">{title}</h2>
      {href && (
        <Link href={href} className="text-sm font-medium text-text-muted hover:text-text">
          View all →
        </Link>
      )}
    </div>
  );
}
