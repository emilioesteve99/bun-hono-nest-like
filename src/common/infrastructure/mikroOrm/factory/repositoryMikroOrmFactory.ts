import { EntityManager } from '@mikro-orm/core/EntityManager';
import { EntityName } from '@mikro-orm/core/typings';

export function repositoryMikroOrmFactory(em: EntityManager, entity: EntityName<object>) {
  return em.getRepository(entity);
}
