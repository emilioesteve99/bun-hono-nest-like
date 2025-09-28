import { Hono } from 'hono';
import { showRoutes } from 'hono/dev';

import { commonProviders, di } from './common/infrastructure/di/di';
import { Router } from './common/infrastructure/http/router/Router';
import { userProviders } from './user/infrastructure/di/di';

async function main() {
  di.bindMany([...commonProviders, ...userProviders]);

  const app: Hono = new Hono();

  Router.setUpRoutes(app);

  showRoutes(app, {
    verbose: true,
  });

  Router.setUpErrorFilters(app);

  Bun.serve({
    development: true,
    fetch: app.fetch,
    hostname: '0.0.0.0',
    port: 4001,
  });
}

// eslint-disable-next-line no-console
main().catch(console.error);
