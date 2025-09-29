import { MikroORM } from '@mikro-orm/core';

import { GlobalContainer } from './GlobalContainer';
import { Provider } from './Provider';
import { CommandBus } from '../../application/bus/CommandBus';
import { QueryBus } from '../../application/bus/QueryBus';
import { logger, LoggerSymbol } from '../../application/logger/logger';
import { GetConfigConvictAdapter } from '../config/adapter/GetConfigConvictAdapter';
import { configSchema } from '../config/model/configSchema';
import { DatabaseConfig, DatabaseConfigSymbol } from '../config/model/DatabaseConfig';
import { AppErrorFilter, AppErrorFilterSymbol } from '../http/errorFilter/AppErrorFilter';
import { AuthInterceptor } from '../http/interceptor/AuthInterceptor';
import { entityManagerFactory, GlobalEntityManagerSymbol } from '../mikroOrm/factory/entityManagerFactory';
import { MikroOrmSymbol, setUpMikroOrm } from '../mikroOrm/factory/setUpMikroOrm';

export const commonProviders: Provider[] = [
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
  {
    provide: DatabaseConfigSymbol,
    useResolvedValue: () => {
      const getConfigAdapter: GetConfigConvictAdapter = new GetConfigConvictAdapter();
      getConfigAdapter.loadConfiguration(configSchema);
      return getConfigAdapter.get('database');
    },
  },
];

const di: GlobalContainer = new GlobalContainer({
  autobind: true,
});

export { di };
