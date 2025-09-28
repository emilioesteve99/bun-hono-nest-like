import { Schema } from 'convict';

import { DatabaseConfig } from './DatabaseConfig';

export const databaseSchema: Schema<DatabaseConfig> = {
  database: {
    default: 'postgres',
    doc: 'Database name',
    env: 'DB_NAME',
    format: String,
  },
  host: {
    default: 'localhost',
    doc: 'Database host',
    env: 'DB_HOST',
    format: String,
  },
  password: {
    default: 'postgres',
    doc: 'Database password',
    env: 'DB_PASSWORD',
    format: String,
    sensitive: true,
  },
  port: {
    default: 5432,
    doc: 'Database port',
    env: 'DB_PORT',
    format: 'port',
  },
  user: {
    default: 'postgres',
    doc: 'Database user',
    env: 'DB_USER',
    format: String,
  },
};
