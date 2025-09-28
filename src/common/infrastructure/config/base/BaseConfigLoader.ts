import path from 'path';

import convict from 'convict';

export abstract class BaseConfigLoader<T> {
  protected config: convict.Config<T>;

  protected constructor(schema: convict.Schema<T>) {
    this.config = convict<T>(schema);
    this.loadConfiguration();
  }

  private loadConfiguration(): void {
    // Validate the configuration with defaults
    this.config.validate({ allowed: 'strict' });

    // Load configuration from environment.json file
    const environmentJsonPath: string = path.join(process.cwd(), 'environment.json');
    try {
      this.config.loadFile(environmentJsonPath);
      this.config.validate({ allowed: 'strict' });
    } catch (err: unknown) {
      throw err;
    }
  }

  public get<K extends keyof T>(key: K): T[K] {
    return this.config.get(key) as T[K];
  }

  public getAll(): T {
    return this.config.getProperties();
  }
}
