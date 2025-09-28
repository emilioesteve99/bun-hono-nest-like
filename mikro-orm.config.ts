import { PostgreSqlDriver } from '@mikro-orm/postgresql';

export default {
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'prueba',
  dbName: process.env.DB_NAME || 'database',
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
