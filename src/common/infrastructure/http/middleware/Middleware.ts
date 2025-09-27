import { Context, Next } from 'hono';

export interface Middleware {
  use(c: Context, next: Next): Promise<void>;
  get path(): string;
}
