import path from 'path';

import convict from 'convict';
import { injectable } from 'inversify';

import { GetConfigAdapter } from './GetConfigAdapter';
import { Config } from '../model/Config';

@injectable()
export class GetConfigConvictAdapter implements GetConfigAdapter {
  private config!: convict.Config<Config>;

  public loadConfiguration(schema: convict.Schema<Config>): void {
    this.config = convict<Config>(schema);
    this.config.validate({ allowed: 'strict' });

    const environmentJsonPath: string = path.join(process.cwd(), 'environment.json');

    try {
      this.config.loadFile(environmentJsonPath);
      this.config.validate({ allowed: 'strict' });
    } catch (error) {
      throw new Error(`Error loading configuration: ${(error as Error).message}`);
    }
  }

  public get<K extends keyof Config>(key: K): Config[K] {
    return this.config.get(key) as Config[K];
  }

  public getAll(): Config {
    return this.config.getProperties();
  }
}
