import { z } from 'zod';

export interface QueryParamsOptions {
  schema: z.ZodType;
  parameterIndex: number;
}

export const queryParamsOptionsMapByClassAndMethod: Map<string, QueryParamsOptions> = new Map();

export function validateQueryParams(schema: z.ZodType) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    queryParamsOptionsMapByClassAndMethod.set(`${target.constructor.name}_${propertyKey}`, { parameterIndex, schema });
  };
}
