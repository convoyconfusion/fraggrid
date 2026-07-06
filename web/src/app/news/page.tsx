import { getArticles } from "@/lib/data";
import { ArticleCard } from "@/components/article-card";
import { Reveal } from "@/components/reveal";
import { CursorGlow } from "@/components/cursor-glow";

export const metadata = { title: "News — FRAGGRID" };

export default async function NewsIndexPage() {
  const articles = await getArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="relative mb-8">
        <CursorGlow />
        <h1 className="text-fluid-2xl relative z-10 font-bold text-text">News</h1>
      </div>
      <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </Reveal>
    </div>
  );
}
