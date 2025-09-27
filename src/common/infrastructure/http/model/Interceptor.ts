import type { Context } from 'hono';

export interface Interceptor {
  intercept(c: Context): Promise<void>;
}
