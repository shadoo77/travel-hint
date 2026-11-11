import { createMiddleware } from 'hono/factory';
import { HttpError } from '../http-error';

/**
 * Guards write endpoints when `ADMIN_TOKEN` is configured. Unset means the
 * project is running locally/seed-only, so the routes stay open.
 */
export const requireAdmin = createMiddleware(async (c, next) => {
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken) {
    await next();
    return;
  }

  const authorization = c.req.header('authorization');

  if (authorization !== `Bearer ${adminToken}`) {
    throw new HttpError(401, 'UNAUTHORIZED', 'Invalid or missing admin token');
  }

  await next();
});
