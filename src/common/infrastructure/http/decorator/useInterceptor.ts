import { Newable } from 'inversify';

export const interceptorsByControllerAndMethodMap: Map<string, Newable[]> = new Map();
export function useInterceptor(...interceptors: Newable[]) {
  return function (target: object, propertyKey: string | symbol, _descriptor: PropertyDescriptor) {
    const controllerName: string = target.constructor.name;
    const methodName: string = propertyKey.toString();
    const key: string = `${controllerName}_${methodName}`;
    interceptorsByControllerAndMethodMap.set(key, interceptors);
  };
}
