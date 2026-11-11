"use client";

import { HeartIcon } from "@/components/heart-icon";
import { useFavorite } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  articleId: string;
  initialCount: number;
  className?: string;
};

/** Inline save control used on the article page. */
export function FavoriteButton({
  articleId,
  initialCount,
  className,
}: FavoriteButtonProps) {
  const { favorited, count, pending, toggle } = useFavorite(
    articleId,
    initialCount,
  );

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from saved hints" : "Save this hint"}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm transition-colors",
        favorited
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary",
        pending && "opacity-70",
        className,
      )}
    >
      <HeartIcon filled={favorited} />
      <span>{favorited ? "Saved" : "Save hint"}</span>
      <span className="text-muted-foreground text-xs tabular-nums">
        {count}
      </span>
    </button>
  );
}
