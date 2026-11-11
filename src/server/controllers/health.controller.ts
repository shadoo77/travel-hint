import { prisma } from '../db';
import { factory } from '../factory';

export const healthHandlers = factory.createHandlers(async (c) => {
  await prisma.$queryRaw`SELECT 1`;

  return c.json({ ok: true });
});
