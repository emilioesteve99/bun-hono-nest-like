import { z } from 'zod';

export interface PathParamsOptions {
  schema: z.ZodType;
  parameterIndex: number;
}

export const pathParamsOptionsMapByClassAndMethod: Map<string, PathParamsOptions> = new Map();

export function validatePathParams(schema: z.ZodType) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    pathParamsOptionsMapByClassAndMethod.set(`${target.constructor.name}_${propertyKey}`, { parameterIndex, schema });
  };
}
