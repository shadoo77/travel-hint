"use client";

import Image from "next/image";
import Link from "next/link";
import { HeartIcon } from "@/components/heart-icon";
import { useFavorite } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";
import type { ArticleCard as ArticleCardData } from "@/server/services/articles";

type ArticleCardProps = {
  article: ArticleCardData;
  /** Above-the-fold cards load eagerly. */
  priority?: boolean;
};

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const { favorited, count, pending, toggle } = useFavorite(
    article.id,
    article.favoriteCount,
  );

  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/articles/${article.slug}`}
        className="flex flex-col focus-visible:outline-none"
        aria-label={article.title}
      >
        <div className="bg-muted relative aspect-[4/5] overflow-hidden rounded-[1.25rem] ring-1 ring-black/5">
          <Image
            src={article.imageUrl}
            alt={article.imageAlt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/15"
          />
          <span className="bg-background/85 text-foreground absolute top-3 left-3 rounded-full px-2.5 py-1 text-[0.65rem] font-medium tracking-[0.14em] uppercase backdrop-blur">
            {article.destination.name}
          </span>
          <p className="text-shadow-card absolute bottom-3 left-3 text-[0.7rem] font-medium tracking-[0.18em] text-white/85 uppercase">
            {article.destination.country}
          </p>
        </div>

        <div className="mt-4 flex flex-1 flex-col">
          <h3 className="font-heading decoration-primary/40 group-hover:text-primary text-[1.35rem] leading-[1.15] tracking-[-0.01em] text-balance decoration-1 underline-offset-4 transition-colors group-hover:underline">
            {article.title}
          </h3>
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
            {article.excerpt}
          </p>

          <div className="text-muted-foreground mt-4 flex items-center justify-between gap-3 text-[0.7rem] tracking-[0.1em] uppercase">
            <span>{article.readMinutes} min read</span>
            <span className="flex items-center gap-1.5">
              <HeartIcon filled={favorited} className="size-3.5" />
              <span className="tabular-nums">{count}</span>
              <span className="sr-only">saves</span>
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={(event) => {
          // The card is a link; the heart must not navigate.
          event.preventDefault();
          event.stopPropagation();
          void toggle();
        }}
        aria-pressed={favorited}
        aria-label={favorited ? "Remove from saved hints" : "Save this hint"}
        title={favorited ? "Remove from saved hints" : "Save this hint"}
        className={cn(
          "bg-background/85 text-foreground hover:bg-background absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full shadow-sm backdrop-blur transition-colors",
          favorited && "text-primary",
          pending && "opacity-70",
        )}
      >
        <HeartIcon filled={favorited} className="size-4" />
      </button>
    </article>
  );
}
