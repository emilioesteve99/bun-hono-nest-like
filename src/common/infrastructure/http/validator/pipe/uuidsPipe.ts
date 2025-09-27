import { z } from 'zod';

export const uuidsPipe: z.ZodOptional<z.ZodPipe> = z
  .string()
  .transform((val: string) => val.split(','))
  .pipe(z.array(z.uuid({ version: 'v4' })).min(1))
  .optional();
