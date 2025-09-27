import { z } from 'zod';

import { convertZodErrorToHTTPException } from './convertZodErrorToHTTPException';

export function validateZodSchema(schema: z.ZodType, data: unknown): unknown {
  const validation: z.ZodSafeParseResult<unknown> = schema.safeParse(data);
  if (!Boolean(validation.success)) {
    throw convertZodErrorToHTTPException(validation.error as z.ZodError);
  }

  return validation.data;
}
