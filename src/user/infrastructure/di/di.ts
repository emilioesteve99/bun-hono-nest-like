import { Provider } from '../../../common/infrastructure/di/Provider';
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

const commandHandlers: Provider[] = [UserInsertOneCommandHandler];

const controllers: Provider[] = [FindUserController, InsertOneUserController];

const queryHandlers: Provider[] = [UserFindQueryHandler];

export const userProviders: Provider[] = [
  ...commandHandlers,
  ...controllers,
  ...queryHandlers,
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
