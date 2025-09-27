import { Context, Hono, Next } from 'hono';

import { di } from '../../di/di';
import { RouteOptions, routeOptionsMap } from '../decorator/route';
import { AppErrorFilterSymbol, ErrorFilter } from '../errorFilter/AppErrorFilter';
import { Middleware } from '../middleware/Middleware';
import { BodyOptions, bodyOptionsMapByClassAndMethod } from '../validator/decorator/validateBody';
import { PathParamsOptions, pathParamsOptionsMapByClassAndMethod } from '../validator/decorator/validatePathParams';
import { QueryParamsOptions, queryParamsOptionsMapByClassAndMethod } from '../validator/decorator/validateQueryParams';
import { validateZodSchema } from '../validator/utils/validateZodSchema';

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
      const controller: any = di.get(controllerName);
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
          const args: unknown[] = [c];
          const key: string = `${controller.constructor.name}_${methodName}`;
          const queryParamsOptions: QueryParamsOptions | undefined = queryParamsOptionsMapByClassAndMethod.get(key);
          if (queryParamsOptions !== undefined) {
            args[queryParamsOptions.parameterIndex] = validateZodSchema(queryParamsOptions.schema, c.req.query());
          }

          const pathParamsOptions: PathParamsOptions | undefined = pathParamsOptionsMapByClassAndMethod.get(key);
          if (pathParamsOptions !== undefined) {
            args[pathParamsOptions.parameterIndex] = validateZodSchema(pathParamsOptions.schema, c.req.param());
          }

          const bodyOptions: BodyOptions | undefined = bodyOptionsMapByClassAndMethod.get(key);
          if (bodyOptions !== undefined) {
            args[bodyOptions.parameterIndex] = validateZodSchema(bodyOptions.schema, await c.req.json());
          }

          const response: unknown = await controller[methodName](...args);
          return c.json(response);
        });
      }
    }
  }

  public static setUpMiddlewares(options: RouterSetUpMiddlewaresOptions) {
    for (const identifier of options.middlewareIdentifiers) {
      const middleware: Middleware = di.get(identifier);
      options.app.use(middleware.path, async (c: Context, next: Next) => {
        await middleware.use(c, next);
      });
    }
  }

  public static setUpErrorFilters(options: RouterSetUpErrorFilterOptions) {
    const errorFilter: ErrorFilter = di.get(AppErrorFilterSymbol);
    options.app.onError((error: Error, c: Context) => {
      return errorFilter.filter(error, c);
    });
  }
}
