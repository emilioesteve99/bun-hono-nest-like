import { EntityManager } from '@mikro-orm/core/EntityManager';

import { GlobalContainer, Provider } from '../../../common/infrastructure/di/di';
import { EntityManagerSymbol } from '../../../common/infrastructure/mikroOrm/factory/entityManagerFactory';
import { repositoryMikroOrmFactory } from '../../../common/infrastructure/mikroOrm/factory/repositoryMikroOrmFactory';
import { UserInsertOneCommandHandler } from '../../application/commandHandler/UserInsertOneCommandHandler';
import { UserFindQueryHandler } from '../../application/queryHandler/UserFindQueryHandler';
import { FindUserController } from '../http/controller/FindUserController';
import { InsertOneUserController } from '../http/controller/InsertOneUserController';
import {
  InsertOneUserMikroOrmAdapter,
  InsertOneUserMikroOrmAdapterSymbol,
} from '../mikroOrm/adapter/InsertOneUserMikroOrmAdapter';
import {
  UserInsertOneCommandToUserInsertOneQueryMikroOrmConverterAsync,
  UserInsertOneCommandToUserInsertOneQueryMikroOrmConverterAsyncSymbol,
} from '../mikroOrm/converter/UserInsertOneCommandToUserInsertOneQueryMikroOrmConverterAsync';
import {
  UserMikroOrmToUserConverterAsync,
  UserMikroOrmToUserConverterAsyncSymbol,
} from '../mikroOrm/converter/UserMikroOrmToUserConverterAsync';
import { UserMikroOrm } from '../mikroOrm/model/UserMikroOrm';
import { UserMikroOrmRepositorySymbol } from '../mikroOrm/model/UserMikroOrmConstants';

export function setUpUserModule(container: GlobalContainer): void {
  const commandHandlers: Provider[] = [UserInsertOneCommandHandler];

  const controllers: Provider[] = [FindUserController, InsertOneUserController];

  const queryHandlers: Provider[] = [UserFindQueryHandler];

  const providers: Provider[] = [
    {
      inject: [EntityManagerSymbol],
      provide: UserMikroOrmRepositorySymbol,
      useFactory: (em: EntityManager) => {
        return repositoryMikroOrmFactory(em, UserMikroOrm);
      },
    },
    {
      provide: UserMikroOrmToUserConverterAsyncSymbol,
      useClass: UserMikroOrmToUserConverterAsync,
    },
    {
      provide: UserInsertOneCommandToUserInsertOneQueryMikroOrmConverterAsyncSymbol,
      useClass: UserInsertOneCommandToUserInsertOneQueryMikroOrmConverterAsync,
    },
    {
      provide: InsertOneUserMikroOrmAdapterSymbol,
      useClass: InsertOneUserMikroOrmAdapter,
    },
  ];

  container.bindMany([...commandHandlers, ...controllers, ...queryHandlers, ...providers]);
}
