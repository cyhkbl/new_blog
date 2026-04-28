import { getAllArticles } from "@/lib/articles";
import ArticleList from "@/components/ArticleList";

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold text-[var(--text-primary)]">
        我的文章
      </h1>
      <ArticleList articles={articles} />
    </div>
  );
}
