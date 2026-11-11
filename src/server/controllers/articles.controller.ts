import { zValidator } from '@hono/zod-validator';
import { factory } from '../factory';
import { HttpError } from '../http-error';
import { validationHook } from '../middleware/validation';
import {
  articleSlugSchema,
  createArticleSchema,
  favoriteParamsSchema,
  listArticlesSchema,
  suggestArticlesSchema,
  visitorHeaderSchema,
} from '../schemas/article';
import * as articlesService from '../services/articles';

export const listArticleHandlers = factory.createHandlers(
  zValidator('query', listArticlesSchema, validationHook),
  async (c) => {
    const { q, page, limit, sort } = c.req.valid('query');

    return c.json(await articlesService.listArticles({ q, page, limit, sort }));
  },
);

export const suggestArticleHandlers = factory.createHandlers(
  zValidator('query', suggestArticlesSchema, validationHook),
  async (c) => {
    const { q } = c.req.valid('query');

    return c.json({ suggestions: await articlesService.suggestArticles(q) });
  },
);

export const getArticleHandlers = factory.createHandlers(
  zValidator('param', articleSlugSchema, validationHook),
  async (c) => {
    const { slug } = c.req.valid('param');
    const article = await articlesService.getArticleBySlug(slug);

    if (!article) {
      throw new HttpError(404, 'NOT_FOUND', 'Article not found');
    }

    const related = await articlesService.getRelatedArticles(
      article.id,
      article.destinationId,
    );

    return c.json({ item: article, related });
  },
);

export const createArticleHandlers = factory.createHandlers(
  zValidator('json', createArticleSchema, validationHook),
  async (c) => {
    const input = c.req.valid('json');
    const article = await articlesService.createArticle(input);

    return c.json({ item: article }, 201);
  },
);

export const favoriteArticleHandlers = factory.createHandlers(
  zValidator('param', favoriteParamsSchema, validationHook),
  zValidator('header', visitorHeaderSchema, validationHook),
  async (c) => {
    const { id } = c.req.valid('param');
    const { 'x-visitor-id': visitorId } = c.req.valid('header');
    const result = await articlesService.setFavorite(id, visitorId, true);

    if (!result) {
      throw new HttpError(404, 'NOT_FOUND', 'Article not found');
    }

    return c.json(result);
  },
);

export const unfavoriteArticleHandlers = factory.createHandlers(
  zValidator('param', favoriteParamsSchema, validationHook),
  zValidator('header', visitorHeaderSchema, validationHook),
  async (c) => {
    const { id } = c.req.valid('param');
    const { 'x-visitor-id': visitorId } = c.req.valid('header');
    const result = await articlesService.setFavorite(id, visitorId, false);

    if (!result) {
      throw new HttpError(404, 'NOT_FOUND', 'Article not found');
    }

    return c.json(result);
  },
);
