import { Container } from 'inversify';

import { Provider } from './di';

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
