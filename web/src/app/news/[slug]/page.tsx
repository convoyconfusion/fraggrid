import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getArticle, getArticles } from "@/lib/data";
import { GAMES } from "@/lib/games";

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    h2: ({ children }) => <h2 className="mb-3 mt-8 text-xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-2 mt-6 text-lg font-bold">{children}</h3>,
  },
};

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const gameMeta = article.game !== "editorial" ? GAMES[article.game] : null;

  return (
    <article className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: gameMeta?.accent ?? "var(--text-muted)" }}
        />
        <span style={{ color: gameMeta?.accent ?? "var(--text-muted)" }}>
          {gameMeta?.shortName ?? "Editorial"}
        </span>
      </div>

      <h1 className="mt-3 text-3xl font-bold text-text">{article.title}</h1>
      <p className="mt-2 text-lg text-text-muted">{article.dek}</p>
      <p className="mt-4 text-sm text-text-muted">
        {article.author} ·{" "}
        {new Date(article.publishedAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      <div className="mt-8 border-t border-border pt-8 text-text">
        <PortableText value={article.body} components={portableTextComponents} />
      </div>
    </article>
  );
}
