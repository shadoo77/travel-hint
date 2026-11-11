import { zValidator } from '@hono/zod-validator';
import { factory } from '../factory';
import { validationHook } from '../middleware/validation';
import { helloQuerySchema } from '../schemas/hello';

export const helloHandlers = factory.createHandlers(
  zValidator('query', helloQuerySchema, validationHook),
  (c) => {
    const { name } = c.req.valid('query');

    return c.json({
      message: name ? `Hello, ${name} from Hono!` : 'Hello from Hono!',
    });
  },
);
