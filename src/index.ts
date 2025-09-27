import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';

import { Router } from './common/infrastructure/http/router/Router';

const app: Hono = new Hono();

Router.setUpRoutes({
  app,
});

showRoutes(app, {
  verbose: true,
});

Router.setUpErrorFilters({
  app,
});

Bun.serve({
  development: true,
  fetch: app.fetch,
  hostname: '0.0.0.0',
  port: 4000,
});
