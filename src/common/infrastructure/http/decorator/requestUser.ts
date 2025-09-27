export interface RequestUserOptions {
  parameterIndex: number;
}

export const requestUserMapByClassAndMethod: Map<string, RequestUserOptions> = new Map();

export function requestUser() {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    requestUserMapByClassAndMethod.set(`${target.constructor.name}_${propertyKey}`, { parameterIndex });
  };
}
