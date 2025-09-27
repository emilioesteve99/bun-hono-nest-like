import { GlobalContainer, Provider } from '../../../common/infrastructure/di/di';
import { UserInsertOneCommandHandler } from '../../application/commandHandler/UserInsertOneCommandHandler';
import { UserFindQueryHandler } from '../../application/queryHandler/UserFindQueryHandler';
import { FindUserController } from '../http/controller/FindUserController';
import { InsertOneUserController } from '../http/controller/InsertOneUserController';

export function setUpUserModule(container: GlobalContainer): void {
  const commandHandlers: Provider[] = [UserInsertOneCommandHandler];

  const controllers: Provider[] = [FindUserController, InsertOneUserController];

  const queryHandlers: Provider[] = [UserFindQueryHandler];

  const providers: Provider[] = [];

  container.bindMany([...commandHandlers, ...controllers, ...queryHandlers, ...providers]);
}
