import { RequiredEntityData } from '@mikro-orm/core';
import { injectable } from 'inversify';

import type { ConverterAsync } from '../../../../common/domain/converter/ConverterAsync';
import { UserInsertOneCommand } from '../../../domain/command/UserInsertOneCommand';
import { UserMikroOrm } from '../model/UserMikroOrm';

export const UserInsertOneCommandToUserInsertOneQueryMikroOrmConverterAsyncSymbol: symbol = Symbol.for(
  'UserInsertOneCommandToUserInsertOneQueryMikroOrmConverterAsync',
);
@injectable()
export class UserInsertOneCommandToUserInsertOneQueryMikroOrmConverterAsync
  implements ConverterAsync<UserInsertOneCommand, RequiredEntityData<UserMikroOrm>>
{
  public async convert(input: UserInsertOneCommand): Promise<RequiredEntityData<UserMikroOrm>> {
    const userInsertOneQueryMikroOrm: RequiredEntityData<UserMikroOrm> = {
      name: input.name,
    };

    return userInsertOneQueryMikroOrm;
  }
}
