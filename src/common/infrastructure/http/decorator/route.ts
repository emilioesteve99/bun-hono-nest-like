import { HttpMethod } from '../model/HttpMethod';

export interface RouteOptions {
  path: string;
  method: HttpMethod;
  version: `v${number}`;
}

export const routeOptionsByControllerAndMethodMap: Map<string, RouteOptions> = new Map();
export function route(options: RouteOptions) {
  return function (target: object, propertyKey: string | symbol, _descriptor: PropertyDescriptor) {
    const controllerName: string = target.constructor.name;
    const methodName: string = propertyKey.toString();
    const key: string = `${controllerName}_${methodName}`;
    routeOptionsByControllerAndMethodMap.set(key, options);
  };
}
