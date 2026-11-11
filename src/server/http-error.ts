import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

/** Every error response shares this shape: `{ error: { code, message, details? } }`. */
export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

/** Throw from any handler or middleware; `errorHandler` turns it into JSON. */
export class HttpError extends Error {
  readonly status: ContentfulStatusCode;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: ContentfulStatusCode,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function errorHandler(error: Error, c: Context) {
  if (error instanceof HttpError) {
    return c.json<ApiErrorBody>(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details === undefined ? {} : { details: error.details }),
        },
      },
      error.status,
    );
  }

  console.error('[api] unhandled error', error);

  return c.json<ApiErrorBody>(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong on our side.',
      },
    },
    500,
  );
}

export function notFoundHandler(c: Context) {
  return c.json<ApiErrorBody>(
    {
      error: {
        code: 'NOT_FOUND',
        message: `No route matches ${c.req.method} ${c.req.path}.`,
      },
    },
    404,
  );
}
