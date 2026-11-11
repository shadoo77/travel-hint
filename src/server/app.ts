import { Hono } from 'hono';
import { errorHandler, notFoundHandler } from './http-error';
import { articleRoutes } from './routes/articles.route';
import { healthRoutes } from './routes/health.route';
import { helloRoutes } from './routes/hello.route';

/**
 * Composed app. Keep every mount chained: `hc<AppType>` only sees routes that
 * are part of the returned type, and a non-chained `app.get()` erases them.
 */
export const app = new Hono()
  .basePath('/api')
  .route('/hello', helloRoutes)
  .route('/db', healthRoutes)
  .route('/articles', articleRoutes)
  .onError(errorHandler)
  .notFound(notFoundHandler);

/** End-to-end types for the client (`hc<AppType>`). */
export type AppType = typeof app;
