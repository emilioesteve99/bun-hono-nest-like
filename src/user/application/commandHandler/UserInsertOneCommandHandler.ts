import { inject, injectable } from 'inversify';

import { CommandHandler } from '../../../common/application/commandHandler/CommandHandler';
import { commandHandler } from '../../../common/application/decorator/commandHandler';
import type { InsertOneAdapter } from '../../../common/domain/adapter/InsertOneAdapter';
import { UserInsertOneCommand } from '../../domain/command/UserInsertOneCommand';
import { User } from '../../domain/model/User';
import { InsertOneUserMikroOrmAdapterSymbol } from '../../infrastructure/mikroOrm/adapter/InsertOneUserMikroOrmAdapter';

@injectable()
@commandHandler(UserInsertOneCommand)
export class UserInsertOneCommandHandler implements CommandHandler<UserInsertOneCommand, User> {
  public constructor(
    @inject(InsertOneUserMikroOrmAdapterSymbol)
    private readonly userInsertOneMikroOrmAdapter: InsertOneAdapter<UserInsertOneCommand, User>,
  ) {}

  public async execute(command: UserInsertOneCommand): Promise<User> {
    return this.userInsertOneMikroOrmAdapter.insertOne(command);
  }
}
