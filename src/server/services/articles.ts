import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/server/db';
import type { CreateArticleInput } from '@/server/schemas/article';

export const articleCardSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  imageUrl: true,
  imageAlt: true,
  readMinutes: true,
  tags: true,
  favoriteCount: true,
  destination: {
    select: { slug: true, name: true, country: true },
  },
} satisfies Prisma.ArticleSelect;

export type ArticleCard = Prisma.ArticleGetPayload<{ select: typeof articleCardSelect }>;

export type ListArticlesOptions = {
  q?: string;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'popular';
};

export type ArticleListResult = {
  items: ArticleCard[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

/** Strip accents, collapse anything non-alphanumeric into single dashes. */
export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function listArticles({
  q,
  page = 1,
  limit = 6,
  sort = 'newest',
}: ListArticlesOptions = {}): Promise<ArticleListResult> {
  const term = q?.trim();
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(24, Math.max(1, limit));

  const where: Prisma.ArticleWhereInput = {
    published: true,
    ...(term
      ? {
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { excerpt: { contains: term, mode: 'insensitive' } },
            { destination: { is: { name: { contains: term, mode: 'insensitive' } } } },
            { destination: { is: { country: { contains: term, mode: 'insensitive' } } } },
            { tags: { has: term.toLowerCase() } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.ArticleOrderByWithRelationInput[] =
    sort === 'popular'
      ? [{ favoriteCount: 'desc' }, { createdAt: 'desc' }]
      : [{ createdAt: 'desc' }];

  const [total, items] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy,
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
      select: articleCardSelect,
    }),
  ]);

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit,
    hasMore: safePage * safeLimit < total,
  };
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, published: true },
    include: { destination: true },
  });
}

export async function getRelatedArticles(articleId: string, destinationId: string, take = 3) {
  const sameDestination = await prisma.article.findMany({
    where: { published: true, destinationId, id: { not: articleId } },
    orderBy: { createdAt: 'desc' },
    take,
    select: articleCardSelect,
  });

  if (sameDestination.length >= take) {
    return sameDestination;
  }

  // Only one hint per city so far: top up with the latest hints from elsewhere.
  const fallback = await prisma.article.findMany({
    where: {
      published: true,
      destinationId: { not: destinationId },
      id: { notIn: [articleId, ...sameDestination.map((item) => item.id)] },
    },
    orderBy: { createdAt: 'desc' },
    take: take - sameDestination.length,
    select: articleCardSelect,
  });

  return [...sameDestination, ...fallback];
}

export type Suggestion = {
  type: 'destination' | 'article';
  label: string;
  sublabel: string;
  value: string;
  slug: string;
};

export async function suggestArticles(q: string): Promise<Suggestion[]> {
  const term = q.trim();

  if (!term) {
    return [];
  }

  const [destinations, articles] = await Promise.all([
    prisma.destination.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { country: { contains: term, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
      take: 4,
      select: { slug: true, name: true, country: true },
    }),
    prisma.article.findMany({
      where: { published: true, title: { contains: term, mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { slug: true, title: true, destination: { select: { name: true } } },
    }),
  ]);

  return [
    ...destinations.map((destination) => ({
      type: 'destination' as const,
      label: destination.name,
      sublabel: destination.country,
      value: destination.name,
      slug: destination.slug,
    })),
    ...articles.map((article) => ({
      type: 'article' as const,
      label: article.title,
      sublabel: article.destination.name,
      value: article.title,
      slug: article.slug,
    })),
  ];
}

async function uniqueArticleSlug(base: string): Promise<string> {
  const root = base || 'hint';
  let slug = root;
  let suffix = 2;

  while (await prisma.article.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${root}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function createArticle(input: CreateArticleInput) {
  const destinationSlug = slugify(input.destination) || 'somewhere';

  const destination = await prisma.destination.upsert({
    where: { slug: destinationSlug },
    create: {
      slug: destinationSlug,
      name: input.destination,
      country: input.country ?? 'Unknown',
      imageUrl: input.imageUrl,
    },
    update: input.country ? { country: input.country } : {},
  });

  const slug = await uniqueArticleSlug(slugify(input.title));

  return prisma.article.create({
    data: {
      slug,
      title: input.title,
      excerpt: input.excerpt,
      story: input.story,
      imageUrl: input.imageUrl,
      imageAlt: input.imageAlt,
      imageCredit: input.imageCredit,
      readMinutes: input.readMinutes,
      tags: input.tags,
      published: input.published,
      destinationId: destination.id,
    },
    include: { destination: true },
  });
}

export type FavoriteResult = { favorited: boolean; favoriteCount: number } | null;

export async function setFavorite(
  articleId: string,
  visitorId: string,
  favorited: boolean,
): Promise<FavoriteResult> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true },
  });

  if (!article) {
    return null;
  }

  return prisma.$transaction(async (tx) => {
    if (favorited) {
      await tx.favorite.upsert({
        where: { articleId_visitorId: { articleId, visitorId } },
        create: { articleId, visitorId },
        update: {},
      });
    } else {
      await tx.favorite.deleteMany({ where: { articleId, visitorId } });
    }

    const favoriteCount = await tx.favorite.count({ where: { articleId } });

    await tx.article.update({
      where: { id: articleId },
      data: { favoriteCount },
    });

    return { favorited, favoriteCount };
  });
}
