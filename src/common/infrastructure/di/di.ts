import { MikroORM } from '@mikro-orm/core';
import { Container, Newable } from 'inversify';

import { setUpUserModule } from '../../../user/infrastructure/di/di';
import { CommandBus } from '../../application/bus/CommandBus';
import { QueryBus } from '../../application/bus/QueryBus';
import { logger, LoggerSymbol } from '../../application/logger/Logger';
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
      if (
        // Check if provider is a class
        typeof provider === 'function' &&
        Boolean(provider.prototype) &&
        Object.prototype.hasOwnProperty.call(provider.prototype, 'constructor')
      ) {
        this.bind(provider.name).to(provider).inSingletonScope();
      } else if ((provider as NamedClassProvider).useClass !== undefined) {
        this.bind((provider as NamedClassProvider).provide)
          .to((provider as NamedClassProvider).useClass)
          .inSingletonScope();
      } else if ((provider as NamedValueProvider).useValue !== undefined) {
        this.bind((provider as NamedValueProvider).provide).toConstantValue((provider as NamedValueProvider).useValue);
      } else if ((provider as ResolvedValueProvider).useResolvedValue !== undefined) {
        const factoryProvider: ResolvedValueProvider = provider as ResolvedValueProvider;
        this.bind(factoryProvider.provide)
          .toResolvedValue(async (...injections: any[]) => {
            return factoryProvider.useResolvedValue(...injections);
          }, factoryProvider.inject ?? [])
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
      provide: MikroOrmSymbol,
      useResolvedValue: async () => {
        const mikroOrm: MikroORM = await setUpMikroOrm({
          dbName: 'database',
          host: 'pg',
          password: 'prueba',
          port: 5432,
          user: 'user',
        });
        return mikroOrm;
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
