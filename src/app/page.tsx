import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ArticleExplorer } from "@/components/article-explorer";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { getQueryClient } from "@/lib/query-client";
import {
  ARTICLES_PAGE_SIZE,
  articlesInfiniteQueryOptions,
} from "@/queries/articles";
import { prisma } from "@/server/db";
import { listArticles } from "@/server/services/articles";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (rawQuery ?? "").trim().slice(0, 80);

  const [list, hintCount, cityCount] = await Promise.all([
    listArticles({ q: query, limit: ARTICLES_PAGE_SIZE, sort: "newest" }),
    prisma.article.count({ where: { published: true } }),
    prisma.destination.count(),
  ]);

  // Seed the cache with the server result instead of prefetching through HTTP:
  // the queryFn talks to the browser-only RPC client, but this render already
  // has the data. `staleTime` keeps the client from refetching on mount.
  const queryClient = getQueryClient();
  queryClient.setQueryData(
    articlesInfiniteQueryOptions({ q: query }).queryKey,
    { pages: [list], pageParams: [1] },
  );

  return (
    <>
      <Hero hintCount={hintCount} cityCount={cityCount} />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ArticleExplorer initialQuery={query} />
      </HydrationBoundary>

      <Reveal className="mt-24">
        <section
          id="how"
          className="border-border bg-card/60 scroll-mt-28 rounded-[1.75rem] border p-8 sm:p-10"
        >
          <p className="text-muted-foreground text-[0.68rem] font-medium tracking-[0.3em] uppercase">
            How it works
          </p>
          <div className="mt-7 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {[
              {
                step: "01",
                title: "Pick a city, not a checklist",
                body: "Every hint starts with one place and one honest observation instead of a top-ten list.",
              },
              {
                step: "02",
                title: "Steal one habit",
                body: "Ride the ferry, cross at a walking pace, order what the next table is having. Small things, actually doable.",
              },
              {
                step: "03",
                title: "Leave the rest",
                body: "No queue is worth your whole morning. Save the hint, wander, and let the city surprise you.",
              },
            ].map((item) => (
              <div key={item.step} className="border-border/70 border-t pt-4">
                <span className="font-heading text-primary text-sm tabular-nums">
                  {item.step}
                </span>
                <h3 className="font-heading mt-2 text-xl leading-snug">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </>
  );
}
