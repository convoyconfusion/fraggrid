import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getArticle, getArticles } from "@/lib/data";
import { GAMES } from "@/lib/games";
import { Reveal } from "@/components/reveal";
import { CursorGlow } from "@/components/cursor-glow";

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    h2: ({ children }) => <h2 className="text-fluid-2xl mb-3 mt-8 font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="text-fluid-lg mb-2 mt-6 font-bold">{children}</h3>,
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
      <div className="relative">
        <CursorGlow />
        <div className="relative z-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: gameMeta?.accent ?? "var(--text-muted)" }}
          />
          <span style={{ color: gameMeta?.accent ?? "var(--text-muted)" }}>
            {gameMeta?.shortName ?? "Editorial"}
          </span>
        </div>

        <h1 className="text-fluid-3xl relative z-10 mt-3 font-bold text-text">{article.title}</h1>
        <p className="text-fluid-lg relative z-10 mt-2 text-text-muted">{article.dek}</p>
        <p className="relative z-10 mt-4 text-sm text-text-muted">
          {article.author} ·{" "}
          {new Date(article.publishedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <Reveal className="mt-8 border-t border-border pt-8 text-text">
        <PortableText value={article.body} components={portableTextComponents} />
      </Reveal>
    </article>
  );
}
