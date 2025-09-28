import { EntityManager } from '@mikro-orm/core';
import { Context, Next } from 'hono';
import { inject, injectable } from 'inversify';

import { Middleware } from './Middleware';
import { entityManagerContext } from '../../mikroOrm/context/EntityManagerContext';
import { GlobalEntityManagerSymbol } from '../../mikroOrm/factory/entityManagerFactory';
import { middleware } from '../decorator/middleware';

@middleware()
@injectable()
export class EntityManagerMiddleware implements Middleware {
  public constructor(
    @inject(GlobalEntityManagerSymbol)
    private readonly globalEntityManager: EntityManager,
  ) {}

  public async use(c: Context, next: Next): Promise<void> {
    const requestEntityManager: EntityManager = this.globalEntityManager.fork();
    return entityManagerContext.run(requestEntityManager, async () => {
      await next();
    });
  }

  public get path(): string {
    return '/*';
  }
}
