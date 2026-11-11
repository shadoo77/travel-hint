import { Hono } from 'hono';
import { healthHandlers } from '../controllers/health.controller';

export const healthRoutes = new Hono().get('/health', ...healthHandlers);
