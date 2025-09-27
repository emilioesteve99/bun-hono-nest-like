import { Context, Hono, Next } from 'hono';

import { container } from '../../di/Container';
import { RouteOptions, routeOptionsMap } from '../decorator/route';
import { AppErrorFilterSymbol, ErrorFilter } from '../errorFilter/AppErrorFilter';
import { Middleware } from '../middleware/Middleware';

export interface RouterSetUpRoutesOptions {
  app: Hono;
}

export interface RouterSetUpMiddlewaresOptions {
  app: Hono;
  middlewareIdentifiers: (string | symbol)[];
}

export interface RouterSetUpErrorFilterOptions {
  app: Hono;
}
export class Router {
  public static setUpRoutes(options: RouterSetUpRoutesOptions) {
    for (const controllerName of routeOptionsMap.keys()) {
      console.log('Set up routes');
      const controller: any = container.get(controllerName);
      const controllerRouteOptions: Map<string, RouteOptions> | undefined = routeOptionsMap.get(
        controller.constructor.name,
      );
      if (controllerRouteOptions === undefined) {
        throw new Error(`Controller route options for ${controller.constructor.name} not found`);
      }

      for (const [methodName, routeOptions] of controllerRouteOptions) {
        const honoAppMethod: 'get' | 'post' | 'put' | 'delete' | 'patch' = routeOptions.method.toLowerCase() as
          | 'get'
          | 'post'
          | 'put'
          | 'delete'
          | 'patch';
        const finalPath: string = `/${routeOptions.version}${routeOptions.path}`.replaceAll('//', '/');
        options.app[honoAppMethod](finalPath, async (c: Context) => {
          const response: unknown = await controller[methodName](c);
          return c.json(response);
        });
      }
    }
  }

  public static setUpMiddlewares(options: RouterSetUpMiddlewaresOptions) {
    for (const identifier of options.middlewareIdentifiers) {
      const middleware: Middleware = container.get(identifier);
      options.app.use(middleware.path, async (c: Context, next: Next) => {
        await middleware.use(c, next);
      });
    }
  }

  public static setUpErrorFilters(options: RouterSetUpErrorFilterOptions) {
    const errorFilter: ErrorFilter = container.get(AppErrorFilterSymbol);
    options.app.onError((error: Error, c: Context) => {
      return errorFilter.filter(error, c);
    });
  }
}
