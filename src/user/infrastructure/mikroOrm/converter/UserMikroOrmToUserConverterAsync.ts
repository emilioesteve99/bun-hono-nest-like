import { injectable } from 'inversify';

import type { ConverterAsync } from '../../../../common/domain/converter/ConverterAsync';
import { User } from '../../../domain/model/User';
import { UserMikroOrm } from '../model/UserMikroOrm';

export const UserMikroOrmToUserConverterAsyncSymbol: symbol = Symbol.for('UserMikroOrmToUserConverterAsync');
@injectable()
export class UserMikroOrmToUserConverterAsync implements ConverterAsync {
  public async convert(input: UserMikroOrm): Promise<User> {
    const user: User = {
      id: input.id,
      name: input.name,
    };

    return user;
  }
}
