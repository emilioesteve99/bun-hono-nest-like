import { EntityRepository, RequiredEntityData } from '@mikro-orm/core';
import { inject, injectable } from 'inversify';

import type { ConverterAsync } from '../../../../common/domain/converter/ConverterAsync';
import { InsertOneMikroOrmAdapter } from '../../../../common/infrastructure/mikroOrm/adapter/InsertOneMikroOrmAdapter';
import { UserInsertOneCommand } from '../../../domain/command/UserInsertOneCommand';
import { User } from '../../../domain/model/User';
import { UserInsertOneCommandToUserInsertOneQueryMikroOrmConverterAsyncSymbol } from '../converter/UserInsertOneCommandToUserInsertOneQueryMikroOrmConverterAsync';
import { UserMikroOrmToUserConverterAsyncSymbol } from '../converter/UserMikroOrmToUserConverterAsync';
import { UserMikroOrm } from '../model/UserMikroOrm';
import { UserMikroOrmRepositorySymbol } from '../model/UserMikroOrmConstants';

export const InsertOneUserMikroOrmAdapterSymbol: symbol = Symbol.for('InsertOneUserMikroOrmAdapter');
@injectable()
export class InsertOneUserMikroOrmAdapter extends InsertOneMikroOrmAdapter<UserInsertOneCommand, UserMikroOrm, User> {
  public constructor(
    @inject(UserMikroOrmRepositorySymbol)
    userMikroOrmRepository: EntityRepository<UserMikroOrm>,
    @inject(UserInsertOneCommandToUserInsertOneQueryMikroOrmConverterAsyncSymbol)
    userInsertOneCommandToUserInsertOneQueryMikroOrmConverterAsync: ConverterAsync<
      UserInsertOneCommand,
      RequiredEntityData<UserMikroOrm>
    >,
    @inject(UserMikroOrmToUserConverterAsyncSymbol)
    userMikroOrmToUserConverterAsync: ConverterAsync<UserMikroOrm, User>,
  ) {
    super(
      userMikroOrmRepository,
      userInsertOneCommandToUserInsertOneQueryMikroOrmConverterAsync,
      userMikroOrmToUserConverterAsync,
    );
  }
}
