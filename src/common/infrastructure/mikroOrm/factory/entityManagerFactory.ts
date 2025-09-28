import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/core/EntityManager';

export const GlobalEntityManagerSymbol: symbol = Symbol.for('GlobalEntityManagerSymbol');
export function entityManagerFactory(orm: MikroORM): EntityManager {
  return orm.em;
}
