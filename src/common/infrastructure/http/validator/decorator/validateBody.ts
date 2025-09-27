import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import { Converter } from '../../../../model/Converter';
import { validateZodSchema } from '../validateZodSchema';

export function validateBody(schema: z.ZodType) {
  return function (_target: unknown, _property: string, descriptor: PropertyDescriptor) {
    const originalMethod: (c: Context) => Promise<unknown> = descriptor.value;
    const zodErrorToHTTPExceptionConverter: Converter<z.ZodError, HTTPException> | undefined = undefined;

    descriptor.value = async function (c: Context): Promise<unknown> {
      validateZodSchema(schema, await c.req.json(), zodErrorToHTTPExceptionConverter);
      return originalMethod.apply(this, [c]);
    };

    return descriptor;
  };
}
