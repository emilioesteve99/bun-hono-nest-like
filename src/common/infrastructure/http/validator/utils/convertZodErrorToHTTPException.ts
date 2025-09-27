import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

export function convertZodErrorToHTTPException(input: z.ZodError): HTTPException {
  const issue: z.ZodIssue = input.issues[0]!;
  const message: string = `Field ${issue.path[0] as string}: ${issue!.message}`;
  return new HTTPException(400, { message });
}
