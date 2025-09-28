import { Schema } from 'convict';

import { Config } from './Config';
import { databaseSchema } from './databaseSchema';

export const configSchema: Schema<Config> = {
  database: databaseSchema,
};
