import { createFactory } from 'hono/factory';

/**
 * Hono's recommended escape hatch for "controllers": `factory.createHandlers()`
 * returns a typed tuple, so spreading it into `app.get(path, ...handlers)` keeps
 * `c.req.param()` and `c.req.valid()` inferred.
 *
 * @see https://hono.dev/docs/guides/best-practices
 */
export const factory = createFactory();
