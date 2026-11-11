import { Hono } from 'hono';
import { helloHandlers } from '../controllers/hello.controller';

export const helloRoutes = new Hono().get('/', ...helloHandlers);
