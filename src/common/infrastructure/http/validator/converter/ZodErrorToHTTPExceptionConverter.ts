import { HTTPException } from 'hono/http-exception';
import { injectable } from 'inversify';
import { z } from 'zod';

import { Converter } from '../../../../model/Converter';

export const ZodErrorToHTTPExceptionConverterSymbol: symbol = Symbol.for('ZodErrorToHTTPExceptionConverter');

@injectable()
export class ZodErrorToHTTPExceptionConverter implements Converter<z.ZodError, HTTPException> {
  public convert(input: z.ZodError): HTTPException {
    const issue: z.ZodIssue = input.issues[0]!;
    const message: string = `Field ${issue.path[0] as string}: ${issue!.message}`;
    return new HTTPException(400, { message });
  }
}
