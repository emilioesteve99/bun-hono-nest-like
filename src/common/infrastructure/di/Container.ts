import { Container, Newable } from 'inversify';

import { setUpUserModule } from '../../../user/infrastructure/di/di';
import { logger, LoggerSymbol } from '../../application/logger/Logger';
import { AppErrorFilter, AppErrorFilterSymbol } from '../http/errorFilter/AppErrorFilter';
import {
  ZodErrorToHTTPExceptionConverter,
  ZodErrorToHTTPExceptionConverterSymbol,
} from '../http/validator/converter/ZodErrorToHTTPExceptionConverter';

export type ClassProvider = Newable;
export type NamedClassProvider = {
  provide: symbol | string;
  useClass: Newable;
};
export type NamedValueProvider = {
  provide: symbol | string;
  useValue: unknown;
};
export type Provider = ClassProvider | NamedClassProvider | NamedValueProvider;

export class GlobalContainer extends Container {
  public bindMany(providers: Provider[]): void {
    for (const provider of providers) {
      if (
        // Check if provider is a class
        typeof provider === 'function' &&
        Boolean(provider.prototype) &&
        Object.prototype.hasOwnProperty.call(provider.prototype, 'constructor')
      ) {
        this.bind(provider.name).to(provider);
      } else if ((provider as NamedClassProvider).useClass !== undefined) {
        this.bind((provider as NamedClassProvider).provide).to((provider as NamedClassProvider).useClass);
      } else if ((provider as NamedValueProvider).useValue !== undefined) {
        this.bind((provider as NamedValueProvider).provide).toConstantValue((provider as NamedValueProvider).useValue);
      } else {
        throw new Error('Provider must have either useClass or useValue defined');
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
    {
      provide: ZodErrorToHTTPExceptionConverterSymbol,
      useClass: ZodErrorToHTTPExceptionConverter,
    },
  ];

  container.bindMany(providers);

  setUpUserModule(container);

  return container;
}

const container: GlobalContainer = new GlobalContainer();

setUpDI(container);

export { container };
