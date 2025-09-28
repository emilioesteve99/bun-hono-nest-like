import { MikroORM } from '@mikro-orm/core';

import { GlobalContainer } from './GlobalContainer';
import { Provider } from './Provider';
import { userProviders } from '../../../user/infrastructure/di/di';
import { CommandBus } from '../../application/bus/CommandBus';
import { QueryBus } from '../../application/bus/QueryBus';
import { logger, LoggerSymbol } from '../../application/logger/Logger';
import { DatabaseConfig, DatabaseConfigLoader, DatabaseConfigSymbol } from '../config/DatabaseConfig';
import { AppErrorFilter, AppErrorFilterSymbol } from '../http/errorFilter/AppErrorFilter';
import { AuthInterceptor } from '../http/interceptor/AuthInterceptor';
import { EntityManagerMiddleware } from '../http/middleware/EntityManagerMiddleware';
import { entityManagerFactory, GlobalEntityManagerSymbol } from '../mikroOrm/factory/entityManagerFactory';
import { MikroOrmSymbol, setUpMikroOrm } from '../mikroOrm/factory/setUpMikroOrm';

const commonProviders: Provider[] = [
  {
    provide: LoggerSymbol,
    useValue: logger,
  },
  {
    provide: AppErrorFilterSymbol,
    useClass: AppErrorFilter,
  },
  QueryBus,
  CommandBus,
  AuthInterceptor,
  {
    inject: [DatabaseConfigSymbol],
    provide: MikroOrmSymbol,
    useResolvedValue: async (databaseConfig: DatabaseConfig) => {
      return setUpMikroOrm(databaseConfig);
    },
  },
  {
    inject: [MikroOrmSymbol],
    provide: GlobalEntityManagerSymbol,
    useResolvedValue: (orm: MikroORM) => {
      return entityManagerFactory(orm);
    },
  },
  EntityManagerMiddleware,
  {
    provide: DatabaseConfigSymbol,
    useResolvedValue: () => {
      return new DatabaseConfigLoader().getAll();
    },
  },
];

const di: GlobalContainer = new GlobalContainer({
  autobind: true,
});

di.bindMany([...commonProviders, ...userProviders]);

export { di };
