import { z } from 'zod';

import { HttpException } from '../../exception/HttpException';

export function convertZodErrorToHTTPException(input: z.ZodError): HttpException {
  const issue: z.core.$ZodIssue = input.issues[0]!;
  const message: string = `Field ${issue.path[0] as string}: ${issue!.message}`;
  return new HttpException(400, { message });
}
