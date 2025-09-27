import { randomUUID } from 'node:crypto';

import { Context } from 'hono';
import { injectable } from 'inversify';

import { AUTH_USER_KEY } from '../model/CommonHttpConstants';
import { Interceptor } from '../model/Interceptor';
import { UserJwt } from '../model/UserJwt';

@injectable()
export class AuthInterceptor implements Interceptor {
  public async intercept(c: Context): Promise<void> {
    const userJwt: UserJwt = {
      id: randomUUID(),
    };
    c.set(AUTH_USER_KEY, userJwt);
  }
}
