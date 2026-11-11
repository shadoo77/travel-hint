import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { api, unwrap } from "@/lib/api";

export const ARTICLES_PAGE_SIZE = 6;

export type ListArticlesFilters = { q: string };

export const articleKeys = {
  all: ["articles"] as const,
  list: (filters: ListArticlesFilters) =>
    [...articleKeys.all, "list", filters] as const,
  suggestions: (q: string) => [...articleKeys.all, "suggestions", q] as const,
};

/** Success payloads straight from the routes, so the client cannot drift. */
type SuggestionsResponse = InferResponseType<
  typeof api.articles.suggestions.$get,
  200
>;

export type ArticleListResponse = InferResponseType<
  typeof api.articles.$get,
  200
>;
export type ArticleSuggestion = SuggestionsResponse["suggestions"][number];

export const articlesInfiniteQueryOptions = (filters: ListArticlesFilters) =>
  infiniteQueryOptions({
    queryKey: articleKeys.list(filters),
    queryFn: async ({ pageParam, signal }) =>
      unwrap<ArticleListResponse>(
        await api.articles.$get(
          {
            query: {
              page: String(pageParam),
              limit: String(ARTICLES_PAGE_SIZE),
              sort: "newest",
              ...(filters.q ? { q: filters.q } : {}),
            },
          },
          { init: { signal } },
        ),
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    staleTime: 30_000,
  });

export const articleSuggestionsQueryOptions = (q: string) =>
  queryOptions({
    queryKey: articleKeys.suggestions(q),
    queryFn: async ({ signal }) =>
      (
        await unwrap<SuggestionsResponse>(
          await api.articles.suggestions.$get(
            { query: { q } },
            { init: { signal } },
          ),
        )
      ).suggestions,
    staleTime: 60_000,
  });
