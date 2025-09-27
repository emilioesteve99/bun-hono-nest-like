import { z } from 'zod';

export interface BodyOptions {
  schema: z.ZodType;
  parameterIndex: number;
}

export const bodyOptionsMapByClassAndMethod: Map<string, BodyOptions> = new Map();

export function validateBody(schema: z.ZodType) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    bodyOptionsMapByClassAndMethod.set(`${target.constructor.name}_${propertyKey}`, { parameterIndex, schema });
  };
}
