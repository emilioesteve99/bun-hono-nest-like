import { AnyEntity, EntityManager, EntityRepository, RequiredEntityData } from '@mikro-orm/core';
import { HTTPException } from 'hono/http-exception';
import { injectable } from 'inversify';

import { InsertOneAdapter } from '../../../domain/adapter/InsertOneAdapter';
import type { ConverterAsync } from '../../../domain/converter/ConverterAsync';
import { PostgreSqlErrorType } from '../../pg/model/PostgreSqlErrorType';
import { isPostgreSqlErrorWithErrorType } from '../../pg/utils/isPostgreSqlErrorWithErrorType';

@injectable()
export class InsertOneMikroOrmAdapter<TCommand, TModelDb extends AnyEntity, TModel>
  implements InsertOneAdapter<TCommand, TModel>
{
  public constructor(
    private readonly entityRepository: EntityRepository<TModelDb>,
    private readonly insertOneCommandToInsertOneQueryMikroOrmConverterAsync: ConverterAsync<
      TCommand,
      RequiredEntityData<TModelDb>
    >,
    private readonly modelDbToModelConverterAsync: ConverterAsync<TModelDb, TModel>,
  ) {}

  public async insertOne(command: TCommand): Promise<TModel> {
    const insertOneQueryMikroOrm: RequiredEntityData<TModelDb> =
      await this.insertOneCommandToInsertOneQueryMikroOrmConverterAsync.convert(command);

    const modelDb: TModelDb = this.entityRepository.create(insertOneQueryMikroOrm);

    const entityManager: EntityManager = this.entityRepository.getEntityManager();

    try {
      await entityManager.persistAndFlush(modelDb);
    } catch (error: unknown) {
      if (isPostgreSqlErrorWithErrorType(error, [PostgreSqlErrorType.FOREIGN_KEY_VIOLATION])) {
        throw new HTTPException(409, { message: 'Foreign key violation' });
      } else if (isPostgreSqlErrorWithErrorType(error, [PostgreSqlErrorType.UNIQUE_VIOLATION])) {
        throw new HTTPException(409, { message: 'Duplicated entity' });
      } else {
        throw error;
      }
    }

    const model: TModel = await this.modelDbToModelConverterAsync.convert(modelDb);

    return model;
  }
}
