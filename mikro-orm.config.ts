import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { DatabaseConfig, DatabaseConfigLoader } from './src/common/infrastructure/config/DatabaseConfig';

const databaseConfig: DatabaseConfig = new DatabaseConfigLoader().getAll();

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
