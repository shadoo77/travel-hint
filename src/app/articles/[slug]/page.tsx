import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/article-grid";
import { FavoriteButton } from "@/components/favorite-button";
import { Reveal } from "@/components/reveal";
import {
  getArticleBySlug,
  getRelatedArticles,
} from "@/server/services/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Hint not found" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      images: [{ url: article.imageUrl, alt: article.imageAlt }],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = await getRelatedArticles(article.id, article.destinationId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [article.imageUrl],
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    articleSection: article.destination.name,
    keywords: article.tags.join(", "),
    publisher: { "@type": "Organization", name: "Trav Hint" },
  };

  return (
    <article className="pt-8 pb-4">
      <script
        type="application/ld+json"
        // JSON.stringify output is safe here: the payload is our own database content.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav aria-label="Breadcrumb" className="text-sm">
        <Link
          href="/#hints"
          className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 6l-6 6 6 6" />
          </svg>
          All hints
        </Link>
      </nav>

      <header className="mt-8 max-w-3xl">
        <p className="text-primary text-[0.68rem] font-medium tracking-[0.28em] uppercase">
          {article.destination.name} · {article.destination.country}
        </p>
        <h1 className="font-heading mt-4 text-[2.4rem] leading-[0.98] tracking-[-0.02em] text-balance sm:text-5xl lg:text-6xl">
          {article.title}
        </h1>
        <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-relaxed text-pretty">
          {article.excerpt}
        </p>

        <div className="text-muted-foreground mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
          <span className="tracking-[0.12em] uppercase">
            {article.readMinutes} min read
          </span>
          <span
            aria-hidden="true"
            className="bg-border hidden size-1 rounded-full sm:block"
          />
          <time dateTime={article.createdAt.toISOString()}>
            {dateFormatter.format(article.createdAt)}
          </time>
          <FavoriteButton
            articleId={article.id}
            initialCount={article.favoriteCount}
            className="ml-auto"
          />
        </div>
      </header>

      <figure className="mt-10">
        <div className="bg-muted relative aspect-[16/10] overflow-hidden rounded-[1.5rem] ring-1 ring-black/5 sm:aspect-[2/1]">
          <Image
            src={article.imageUrl}
            alt={article.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="text-muted-foreground mt-2.5 flex justify-between gap-4 text-xs">
          <span>{article.imageAlt}</span>
          {article.imageCredit ? (
            <span className="shrink-0">{article.imageCredit}</span>
          ) : null}
        </figcaption>
      </figure>

      <div className="mx-auto mt-12 max-w-2xl">
        <div className="space-y-6 text-[1.06rem] leading-[1.78] text-pretty">
          {article.story.map((paragraph, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? "first-letter:font-heading first-letter:text-primary first-letter:float-left first-letter:mt-1 first-letter:mr-2.5 first-letter:text-6xl first-letter:leading-[0.8]"
                  : undefined
              }
            >
              {paragraph}
            </p>
          ))}
        </div>

        {article.tags.length > 0 ? (
          <ul className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <li
                key={tag}
                className="border-border bg-card text-muted-foreground rounded-full border px-3 py-1 text-xs tracking-[0.08em] uppercase"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {related.length > 0 ? (
        <section className="border-border/70 mt-20 border-t pt-10">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="font-heading text-2xl tracking-[-0.01em] sm:text-3xl">
                Keep wandering
              </h2>
              <Link
                href="/#hints"
                className="text-muted-foreground hover:text-primary text-sm underline-offset-4 hover:underline"
              >
                All hints
              </Link>
            </div>
          </Reveal>
          <ArticleGrid articles={related} />
        </section>
      ) : null}
    </article>
  );
}
