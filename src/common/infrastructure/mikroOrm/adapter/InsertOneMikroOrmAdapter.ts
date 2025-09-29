import { AnyEntity, EntityManager, EntityRepository, RequiredEntityData } from '@mikro-orm/core';
import { injectable } from 'inversify';

import { InsertOneAdapter } from '../../../domain/adapter/InsertOneAdapter';
import type { ConverterAsync } from '../../../domain/converter/ConverterAsync';
import { HttpException } from '../../http/exception/HttpException';
import { PostgreSqlErrorType } from '../../pg/model/PostgreSqlErrorType';
import { isPostgreSqlErrorWithErrorType } from '../../pg/utils/isPostgreSqlErrorWithErrorType';
import { entityManagerContext } from '../context/EntityManagerContext';

@injectable()
export class InsertOneMikroOrmAdapter<TCommand, TModelDb extends AnyEntity, TModel>
  implements InsertOneAdapter<TCommand, TModel>
{
  public constructor(
    private readonly entityClass: new () => TModelDb,
    private readonly insertOneCommandToInsertOneQueryMikroOrmConverterAsync: ConverterAsync<
      TCommand,
      RequiredEntityData<TModelDb>
    >,
    private readonly modelDbToModelConverterAsync: ConverterAsync<TModelDb, TModel>,
  ) {}

  public async insertOne(command: TCommand): Promise<TModel> {
    const insertOneQueryMikroOrm: RequiredEntityData<TModelDb> =
      await this.insertOneCommandToInsertOneQueryMikroOrmConverterAsync.convert(command);

    const entityManager: EntityManager = entityManagerContext.getEntityManager();
    const repository: EntityRepository<TModelDb> = entityManager.getRepository(this.entityClass);

    const modelDb: TModelDb = repository.create(insertOneQueryMikroOrm);

    try {
      await entityManager.persistAndFlush(modelDb);
    } catch (error: unknown) {
      if (isPostgreSqlErrorWithErrorType(error, [PostgreSqlErrorType.FOREIGN_KEY_VIOLATION])) {
        throw new HttpException(409, { message: 'Foreign key violation' });
      } else if (isPostgreSqlErrorWithErrorType(error, [PostgreSqlErrorType.UNIQUE_VIOLATION])) {
        throw new HttpException(409, { message: 'Duplicated entity' });
      } else {
        throw error;
      }
    }

    return this.modelDbToModelConverterAsync.convert(modelDb);
  }
}
