import { z } from 'zod';

export const uuidsPipe: z.ZodOptional<z.ZodPipe> = z
  .string()
  .transform((value: string) => value.split(','))
  .pipe(z.uuid().trim().array())
  .optional();
