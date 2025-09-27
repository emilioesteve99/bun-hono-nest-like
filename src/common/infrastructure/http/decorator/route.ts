import { HttpMethod } from '../model/HttpMethod';

export interface RouteOptions {
  path: string;
  method: HttpMethod;
  version: `v${number}`;
}

export const routeOptionsMap: Map<string, Map<string, RouteOptions>> = new Map<string, Map<string, RouteOptions>>();
export function route(options: RouteOptions) {
  return function (target: object, propertyKey: string | symbol, _descriptor: PropertyDescriptor) {
    const controllerName: string = target.constructor.name;
    const methodName: string = propertyKey.toString();
    const firstLevelValue: Map<string, RouteOptions> | undefined = routeOptionsMap.get(controllerName);

    if (!firstLevelValue) {
      const routeOptionsByMethod: Map<string, RouteOptions> = new Map<string, RouteOptions>();
      routeOptionsByMethod.set(methodName, options);
      routeOptionsMap.set(controllerName, routeOptionsByMethod);
    } else {
      firstLevelValue.set(methodName, options);
    }
  };
}
