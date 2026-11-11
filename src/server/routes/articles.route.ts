import { Hono } from 'hono';
import {
  createArticleHandlers,
  favoriteArticleHandlers,
  getArticleHandlers,
  listArticleHandlers,
  suggestArticleHandlers,
  unfavoriteArticleHandlers,
} from '../controllers/articles.controller';
import { requireAdmin } from '../middleware/require-admin';

export const articleRoutes = new Hono()
  // Keep `/suggestions` ahead of `/:slug` so it is not swallowed by the param route.
  .get('/suggestions', ...suggestArticleHandlers)
  .get('/', ...listArticleHandlers)
  .get('/:slug', ...getArticleHandlers)
  .post('/', requireAdmin, ...createArticleHandlers)
  .post('/:id/favorite', ...favoriteArticleHandlers)
  .delete('/:id/favorite', ...unfavoriteArticleHandlers);
