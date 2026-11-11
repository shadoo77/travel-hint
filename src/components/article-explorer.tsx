"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArticleGrid } from "@/components/article-grid";
import { AutocompleteSearch } from "@/components/autocomplete-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { articlesInfiniteQueryOptions } from "@/queries/articles";

type ArticleExplorerProps = {
  initialQuery: string;
};

export function ArticleExplorer({ initialQuery }: ArticleExplorerProps) {
  const [query, setQuery] = useState(initialQuery);

  const debouncedQuery = useDebouncedValue(query, 280);
  const term = debouncedQuery.trim();

  const {
    data,
    isPending,
    isFetching,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    ...articlesInfiniteQueryOptions({ q: term }),
    // Keep the previous grid on screen while the next term loads instead of
    // flashing a skeleton; `isFetching` drives the dimming below.
    placeholderData: keepPreviousData,
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const isLoading = isFetching && !isFetchingNextPage;
  const isEmpty = !isFetching && !isError && items.length === 0;

  // Keep the URL shareable without triggering a server round-trip per keystroke.
  useEffect(() => {
    const url = new URL(window.location.href);

    if (term) {
      url.searchParams.set("q", term);
    } else {
      url.searchParams.delete("q");
    }

    window.history.replaceState(window.history.state, "", url);
  }, [term]);

  return (
    <section id="hints" className="scroll-mt-28">
      <div className="max-w-2xl">
        <AutocompleteSearch value={query} onValueChange={setQuery} />
        <p className="text-muted-foreground mt-2.5 pl-1 text-xs">
          Try “Lisbon”, “markets”, “dawn”, or press{" "}
          <kbd className="border-border bg-muted rounded border px-1 py-0.5 text-[0.65rem]">
            /
          </kbd>
        </p>
      </div>

      <div className="border-border/70 mt-12 mb-7 flex flex-wrap items-end justify-between gap-4 border-b pb-4">
        <h2 className="font-heading text-2xl tracking-[-0.01em] sm:text-3xl">
          {term ? "Matching hints" : "Fresh from the notebook"}
        </h2>

        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          <span aria-live="polite">
            {isLoading
              ? "Searching…"
              : `${total} ${total === 1 ? "hint" : "hints"}`}
          </span>
          {term ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="border-border bg-card text-foreground hover:border-primary/40 hover:text-primary inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors"
            >
              “{term}”
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
              <span className="sr-only">Clear filter</span>
            </button>
          ) : null}
        </div>
      </div>

      {isError ? (
        <div className="border-destructive/25 bg-destructive/5 rounded-2xl border p-8 text-center">
          <p className="font-heading text-xl">That search didn’t land.</p>
          <p className="text-muted-foreground mt-1.5 text-sm">
            The notebook is still here — give it another try.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="bg-primary text-primary-foreground mt-5 inline-flex rounded-full px-5 py-2 text-sm transition-opacity hover:opacity-90"
          >
            Retry
          </button>
        </div>
      ) : null}

      {isEmpty && !isError ? (
        <div className="border-border bg-card/60 rounded-2xl border p-10 text-center">
          <p className="font-heading text-2xl">No hints for “{term}” yet.</p>
          <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
            We only write about places we have actually wandered. Try a country,
            a food, or a feeling.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="border-border hover:border-primary/40 hover:text-primary mt-5 inline-flex rounded-full border px-5 py-2 text-sm transition-colors"
          >
            Show all hints
          </button>
        </div>
      ) : null}

      {isPending ? <GridSkeleton /> : null}

      {items.length > 0 ? (
        <div
          aria-busy={isLoading}
          className={isLoading ? "opacity-50 transition-opacity" : undefined}
        >
          <ArticleGrid articles={items} priorityCount={2} />
        </div>
      ) : null}

      {hasNextPage && !isError ? (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage || isLoading}
            className="border-border bg-card hover:border-primary/40 hover:text-primary inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFetchingNextPage ? "Loading…" : "Load more hints"}
          </button>
        </div>
      ) : null}
    </section>
  );
}

function GridSkeleton() {
  return (
    <ul
      className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <li key={index} className="animate-pulse">
          <div className="bg-muted aspect-4/5 rounded-[1.25rem]" />
          <div className="bg-muted mt-4 h-5 w-4/5 rounded" />
          <div className="bg-muted mt-2 h-4 w-full rounded" />
          <div className="bg-muted mt-2 h-4 w-2/3 rounded" />
        </li>
      ))}
    </ul>
  );
}
