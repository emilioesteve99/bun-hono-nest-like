import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { GetConfigConvictAdapter } from './src/common/infrastructure/config/adapter/GetConfigConvictAdapter';
import { configSchema } from './src/common/infrastructure/config/model/configSchema';
import { DatabaseConfig } from './src/common/infrastructure/config/model/DatabaseConfig';

const getConfigConvictAdapter: GetConfigConvictAdapter = new GetConfigConvictAdapter();
getConfigConvictAdapter.loadConfiguration(configSchema);
const databaseConfig: DatabaseConfig = getConfigConvictAdapter.get('database');

export default {
  driver: PostgreSqlDriver,
  host: databaseConfig.host,
  port: databaseConfig.port,
  user: databaseConfig.user,
  password: databaseConfig.password,
  dbName: databaseConfig.database,
  entities: ['./src/**/infrastructure/mikroOrm/model/*MikroOrm.ts'],
  entitiesTs: ['./src/**/infrastructure/mikroOrm/model/*MikroOrm.ts'],
  migrations: {
    path: './src/common/infrastructure/mikroOrm/migrations',
    pattern: /^[\w-]+\d+\.(ts|js)$/,
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: false,
    safe: false,
    emit: 'ts',
  },
};
