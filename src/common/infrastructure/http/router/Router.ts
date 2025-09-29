import { EntityManager } from '@mikro-orm/core';
import { Context, Hono } from 'hono';
import { Newable } from 'inversify';

import { di } from '../../di/di';
import { entityManagerContext } from '../../mikroOrm/context/EntityManagerContext';
import { GlobalEntityManagerSymbol } from '../../mikroOrm/factory/entityManagerFactory';
import { requestUserMapByClassAndMethod, RequestUserOptions } from '../decorator/requestUser';
import { RouteOptions, routeOptionsByControllerAndMethodMap } from '../decorator/route';
import { interceptorsByControllerAndMethodMap } from '../decorator/useInterceptor';
import { AppErrorFilterSymbol, ErrorFilter } from '../errorFilter/AppErrorFilter';
import { AUTH_USER_KEY } from '../model/CommonHttpConstants';
import { Interceptor } from '../model/Interceptor';
import { BodyOptions, bodyOptionsMapByClassAndMethod } from '../validator/decorator/validateBody';
import { PathParamsOptions, pathParamsOptionsMapByClassAndMethod } from '../validator/decorator/validatePathParams';
import { QueryParamsOptions, queryParamsOptionsMapByClassAndMethod } from '../validator/decorator/validateQueryParams';
import { validateZodSchema } from '../validator/utils/validateZodSchema';

export class Router {
  public static setUpRoutes(app: Hono) {
    for (const key of routeOptionsByControllerAndMethodMap.keys()) {
      const routeOptions: RouteOptions | undefined = routeOptionsByControllerAndMethodMap.get(key);
      const [controllerName, method] = key.split('_') as [string, string];
      if (routeOptions === undefined) {
        throw new Error(`Controller route options for ${controllerName} not found`);
      }

      const controller: { [method: string]: (...args: unknown[]) => Promise<unknown> } = di.get(controllerName);
      const honoAppMethod: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'all' =
        routeOptions.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'all';
      const finalPath: string = `/${routeOptions.version}${routeOptions.path}`.replaceAll('//', '/');
      app[honoAppMethod](finalPath, async (c: Context) => {
        return this.setRouteHandler(c, key, controller, method);
      });
    }
  }

  private static async setRouteHandler(
    c: Context,
    controllerAndMethodKey: string,
    controller: { [method: string]: (...args: unknown[]) => Promise<unknown> },
    method: string,
  ) {
    const globalEntityManager: EntityManager = di.get(GlobalEntityManagerSymbol);
    const requestEntityManager: EntityManager = globalEntityManager.fork();
    return entityManagerContext.run(requestEntityManager, async () => {
      await this.setRouteInterceptors(c, controllerAndMethodKey);
      const args: unknown[] = await this.getHandlerArgs(c, controllerAndMethodKey);
      const response: unknown = await controller[method]!(...args);
      return c.json(response);
    });
  }

  private static async setRouteInterceptors(c: Context, controllerAndMethodKey: string) {
    const interceptors: Newable[] | undefined = interceptorsByControllerAndMethodMap.get(controllerAndMethodKey);
    if (interceptors !== undefined) {
      const promises: Promise<void>[] = [];
      for (const interceptor of interceptors) {
        const interceptorInstance: Interceptor = di.get(interceptor.name);
        promises.push(interceptorInstance.intercept(c));
      }

      await Promise.all(promises);
    }
  }

  private static async getHandlerArgs(c: Context, controllerAndMethodKey: string): Promise<unknown[]> {
    const args: unknown[] = [c];
    const queryParamsOptions: QueryParamsOptions | undefined =
      queryParamsOptionsMapByClassAndMethod.get(controllerAndMethodKey);
    if (queryParamsOptions !== undefined) {
      args[queryParamsOptions.parameterIndex] = validateZodSchema(queryParamsOptions.schema, c.req.query());
    }

    const pathParamsOptions: PathParamsOptions | undefined =
      pathParamsOptionsMapByClassAndMethod.get(controllerAndMethodKey);
    if (pathParamsOptions !== undefined) {
      args[pathParamsOptions.parameterIndex] = validateZodSchema(pathParamsOptions.schema, c.req.param());
    }

    const bodyOptions: BodyOptions | undefined = bodyOptionsMapByClassAndMethod.get(controllerAndMethodKey);
    if (bodyOptions !== undefined) {
      args[bodyOptions.parameterIndex] = validateZodSchema(bodyOptions.schema, await c.req.json());
    }

    const requestUserOptions: RequestUserOptions | undefined =
      requestUserMapByClassAndMethod.get(controllerAndMethodKey);
    if (requestUserOptions !== undefined) {
      args[requestUserOptions.parameterIndex] = c.get(AUTH_USER_KEY);
    }

    return args;
  }

  public static setUpErrorFilters(app: Hono) {
    const errorFilter: ErrorFilter = di.get(AppErrorFilterSymbol);
    app.onError((error: Error, c: Context) => {
      return errorFilter.filter(error, c);
    });
  }
}
