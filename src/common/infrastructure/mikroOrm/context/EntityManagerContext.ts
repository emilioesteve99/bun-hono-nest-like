import { AsyncLocalStorage } from 'async_hooks';

import { EntityManager } from '@mikro-orm/core';

class EntityManagerContext {
  private static instance: EntityManagerContext;
  private readonly asyncLocalStorage: AsyncLocalStorage<EntityManager>;

  private constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage<EntityManager>();
  }

  public static getInstance(): EntityManagerContext {
    if (EntityManagerContext.instance === undefined) {
      EntityManagerContext.instance = new EntityManagerContext();
    }

    return EntityManagerContext.instance;
  }

  public run<T>(entityManager: EntityManager, callback: () => T): T {
    return this.asyncLocalStorage.run(entityManager, callback);
  }

  public getEntityManager(): EntityManager {
    const entityManager: EntityManager | undefined = this.asyncLocalStorage.getStore();
    if (entityManager === undefined) {
      throw new Error('EntityManager not found in context. Make sure the request is within an EntityManager context.');
    }

    return entityManager;
  }
}

export const entityManagerContext: EntityManagerContext = EntityManagerContext.getInstance();
