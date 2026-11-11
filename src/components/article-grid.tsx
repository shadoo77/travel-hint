import { ArticleCard } from "@/components/article-card";
import { Reveal } from "@/components/reveal";
import type { ArticleCard as ArticleCardData } from "@/server/services/articles";

type ArticleGridProps = {
  articles: ArticleCardData[];
  /** Keep the very first render snappy (hero image above the fold). */
  priorityCount?: number;
};

export function ArticleGrid({ articles, priorityCount = 0 }: ArticleGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-7">
      {articles.map((article, index) => (
        <li key={article.id}>
          <Reveal delay={Math.min(index * 0.06, 0.24)}>
            <ArticleCard article={article} priority={index < priorityCount} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
