import { Config } from '../model/Config';

export interface GetConfigAdapter {
  get<K extends keyof Config>(key: K): Config[K];
}
