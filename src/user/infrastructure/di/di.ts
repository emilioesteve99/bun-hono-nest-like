import { GlobalContainer, Provider } from '../../../common/infrastructure/di/Container';
import { UserService, UserServiceSymbol } from '../../application/UserService';
import { FindUserController } from '../http/controller/FindUserController';

export function setUpUserModule(container: GlobalContainer): void {
  const providers: Provider[] = [
    {
      provide: UserServiceSymbol,
      useClass: UserService,
    },
    FindUserController,
  ];

  container.bindMany(providers);
}
