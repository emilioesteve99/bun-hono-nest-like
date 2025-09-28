import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/core/EntityManager';

export const EntityManagerSymbol: symbol = Symbol.for('EntityManager');
export function entityManagerFactory(orm: MikroORM): EntityManager {
  return orm.em;
}
