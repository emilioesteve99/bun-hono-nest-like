import { Context, Hono, Next } from 'hono';
import { Newable } from 'inversify';

import { di } from '../../di/di';
import { middlewares } from '../decorator/middleware';
import { requestUserMapByClassAndMethod, RequestUserOptions } from '../decorator/requestUser';
import { RouteOptions, routeOptionsByControllerAndMethodMap } from '../decorator/route';
import { interceptorsByControllerAndMethodMap } from '../decorator/useInterceptor';
import { AppErrorFilterSymbol, ErrorFilter } from '../errorFilter/AppErrorFilter';
import { Middleware } from '../middleware/Middleware';
import { AUTH_USER_KEY } from '../model/CommonHttpConstants';
import { Interceptor } from '../model/Interceptor';
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
    for (const key of routeOptionsByControllerAndMethodMap.keys()) {
      const routeOptions: RouteOptions | undefined = routeOptionsByControllerAndMethodMap.get(key);
      const [controllerName, method] = key.split('_') as [string, string];
      if (routeOptions === undefined) {
        throw new Error(`Controller route options for ${controllerName} not found`);
      }

      const controller: any = di.get(controllerName);
      const honoAppMethod: 'get' | 'post' | 'put' | 'delete' | 'patch' = routeOptions.method.toLowerCase() as
        | 'get'
        | 'post'
        | 'put'
        | 'delete'
        | 'patch';
      const finalPath: string = `/${routeOptions.version}${routeOptions.path}`.replaceAll('//', '/');
      options.app[honoAppMethod](finalPath, async (c: Context) => {
        const interceptors: Newable[] | undefined = interceptorsByControllerAndMethodMap.get(key);
        if (interceptors !== undefined) {
          for (const interceptor of interceptors) {
            const interceptorInstance: Interceptor = di.get(interceptor.name);
            // eslint-disable-next-line no-await-in-loop
            await interceptorInstance.intercept(c);
          }
        }

        const args: unknown[] = [c];
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

        const requestUserOptions: RequestUserOptions | undefined = requestUserMapByClassAndMethod.get(key);
        if (requestUserOptions !== undefined) {
          args[requestUserOptions.parameterIndex] = c.get(AUTH_USER_KEY);
        }

        const response: unknown = await controller[method](...args);
        return c.json(response);
      });
    }
  }

  public static async setUpMiddlewares(options: RouterSetUpRoutesOptions) {
    for (const middlewareIdentifier of middlewares) {
      const middleware: Middleware = await di.getAsync(middlewareIdentifier);
      options.app.use(middleware.path, async (c: Context, next: Next) => {
        return middleware.use(c, next);
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
