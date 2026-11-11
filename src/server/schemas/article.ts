import { z } from 'zod';

export const listArticlesSchema = z.object({
  q: z.string().trim().max(80).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(24).default(6),
  sort: z.enum(['newest', 'popular']).default('newest'),
});

export const suggestArticlesSchema = z.object({
  q: z.string().trim().min(1).max(80),
});

export const articleSlugSchema = z.object({
  slug: z.string().trim().min(1).max(120),
});

export const createArticleSchema = z.object({
  title: z.string().trim().min(3).max(120),
  destination: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80).optional(),
  excerpt: z.string().trim().min(20).max(280),
  story: z.array(z.string().trim().min(1).max(4000)).min(2).max(20),
  imageUrl: z.url().max(500),
  imageAlt: z.string().trim().min(5).max(160),
  imageCredit: z.string().trim().max(160).optional(),
  tags: z.array(z.string().trim().min(1).max(24)).max(8).default([]),
  readMinutes: z.number().int().min(1).max(60).default(4),
  published: z.boolean().default(true),
});

export const favoriteParamsSchema = z.object({
  id: z.string().trim().min(1).max(40),
});

export const visitorHeaderSchema = z.object({
  'x-visitor-id': z.uuid(),
});

export type ListArticlesInput = z.infer<typeof listArticlesSchema>;
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type ArticleSlugInput = z.infer<typeof articleSlugSchema>;
export type VisitorHeader = z.infer<typeof visitorHeaderSchema>;
