import { z } from 'zod';

export const helloQuerySchema = z.object({
  name: z.string().trim().min(1).max(64).optional(),
});

export type HelloQuery = z.infer<typeof helloQuerySchema>;
