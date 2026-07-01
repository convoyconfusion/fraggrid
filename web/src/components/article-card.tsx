import Link from "next/link";
import type { Article } from "@/lib/types";
import { GAMES } from "@/lib/games";

export function ArticleCard({ article }: { article: Article }) {
  const gameMeta = article.game !== "editorial" ? GAMES[article.game] : null;

  return (
    <Link
      href={`/news/${article.slug}`}
      className="card-clip-sm group block border border-border bg-surface p-4 transition hover:bg-surface-2"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: gameMeta?.accent ?? "var(--text-muted)" }}
        />
        <span style={{ color: gameMeta?.accent ?? "var(--text-muted)" }}>
          {gameMeta?.shortName ?? "Editorial"}
        </span>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-text group-hover:underline">
        {article.title}
      </h3>
      <p className="mt-1 text-sm text-text-muted line-clamp-2">{article.dek}</p>
      <p className="mt-3 text-xs text-text-muted">
        {article.author} ·{" "}
        {new Date(article.publishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </p>
    </Link>
  );
}
