import type { Context } from 'hono';
import { z } from 'zod';

type ValidationResult = { success: boolean; error?: unknown };

/**
 * Shared @hono/zod-validator hook so every validation failure has the same shape:
 * { error: { code, message, details } }
 */
export function validationHook(result: ValidationResult, c: Context) {
  if (result.success) {
    return;
  }

  return c.json(
    {
      error: {
        code: 'VALIDATION_ERROR' as const,
        message: 'Request validation failed',
        details: z.flattenError(result.error as z.ZodError),
      },
    },
    400,
  );
}
