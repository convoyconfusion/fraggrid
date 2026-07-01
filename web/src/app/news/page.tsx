import { getArticles } from "@/lib/data";
import { ArticleCard } from "@/components/article-card";

export const metadata = { title: "News — FRAGGRID" };

export default async function NewsIndexPage() {
  const articles = await getArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-text">News</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
