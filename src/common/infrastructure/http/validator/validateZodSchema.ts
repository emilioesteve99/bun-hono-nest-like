import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

import { ZodErrorToHTTPExceptionConverterSymbol } from './converter/ZodErrorToHTTPExceptionConverter';
import { Converter } from '../../../model/Converter';
import { container } from '../../di/Container';

export function validateZodSchema(
  schema: z.ZodType,
  data: unknown,
  zodErrorToHTTPExceptionConverter?: Converter<z.ZodError, HTTPException>,
) {
  const validation: z.ZodSafeParseResult<unknown> = schema.safeParse(data);
  if (!Boolean(validation.success)) {
    if (zodErrorToHTTPExceptionConverter === undefined) {
      zodErrorToHTTPExceptionConverter = container.get(ZodErrorToHTTPExceptionConverterSymbol);
    }

    throw zodErrorToHTTPExceptionConverter!.convert(validation.error as z.ZodError);
  }
}
