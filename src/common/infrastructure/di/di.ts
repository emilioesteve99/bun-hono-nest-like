import { MikroORM } from '@mikro-orm/core';
import { Container, Newable } from 'inversify';

import { setUpUserModule } from '../../../user/infrastructure/di/di';
import { CommandBus } from '../../application/bus/CommandBus';
import { QueryBus } from '../../application/bus/QueryBus';
import { logger, LoggerSymbol } from '../../application/logger/Logger';
import { DatabaseConfig, DatabaseConfigLoader, DatabaseConfigSymbol } from '../config/DatabaseConfig';
import { AppErrorFilter, AppErrorFilterSymbol } from '../http/errorFilter/AppErrorFilter';
import { AuthInterceptor } from '../http/interceptor/AuthInterceptor';
import { EntityManagerMiddleware } from '../http/middleware/EntityManagerMiddleware';
import { entityManagerFactory, GlobalEntityManagerSymbol } from '../mikroOrm/factory/entityManagerFactory';
import { MikroOrmSymbol, setUpMikroOrm } from '../mikroOrm/factory/setUpMikroOrm';

export type ClassProvider = Newable;

export type NamedClassProvider = {
  provide: symbol | string;
  useClass: Newable;
};

export type NamedValueProvider = {
  provide: symbol | string;
  useValue: unknown;
};

export type ResolvedValueProvider = {
  provide: symbol | string;
  useResolvedValue: (...args: any[]) => any;
  inject?: (string | symbol | Newable)[];
};

export type Provider = ClassProvider | NamedClassProvider | NamedValueProvider | ResolvedValueProvider;

export class GlobalContainer extends Container {
  public bindMany(providers: Provider[]): void {
    for (const provider of providers) {
      if (typeof provider === 'function' && Boolean(provider.prototype?.constructor)) {
        this.bind(provider.name).to(provider).inSingletonScope();
        continue;
      }

      if ('useClass' in provider) {
        this.bind(provider.provide).to(provider.useClass).inSingletonScope();
        continue;
      }

      if ('useValue' in provider) {
        this.bind(provider.provide).toConstantValue(provider.useValue);
        continue;
      }

      if ('useResolvedValue' in provider) {
        this.bind(provider.provide)
          .toResolvedValue(
            async (...injections: any[]) => provider.useResolvedValue(...injections),
            provider.inject ?? [],
          )
          .inSingletonScope();
      }
    }
  }
}

export function setUpDI(container: GlobalContainer): Container {
  const providers: Provider[] = [
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

  container.bindMany(providers);

  setUpUserModule(container);

  return container;
}

const di: GlobalContainer = new GlobalContainer({
  autobind: true,
});

setUpDI(di);

export { di };
