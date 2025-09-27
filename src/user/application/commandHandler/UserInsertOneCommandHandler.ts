import { injectable } from 'inversify';

import { CommandHandler } from '../../../common/application/cqrs/commandHandler/CommandHandler';
import { commandHandler } from '../../../common/application/cqrs/decorator/commandHandler';
import { UserInsertOneCommand } from '../../domain/command/UserInsertOneCommand';
import { User } from '../../domain/model/User';

@injectable()
@commandHandler(UserInsertOneCommand)
export class UserInsertOneCommandHandler implements CommandHandler<UserInsertOneCommand, User> {
  public async execute(command: UserInsertOneCommand): Promise<User> {
    const user: User = {
      id: '1',
      name: 'John Doe',
    };
    return user;
  }
}
