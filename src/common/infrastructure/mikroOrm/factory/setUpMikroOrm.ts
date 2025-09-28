import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { DatabaseConfig } from '../../config/DatabaseConfig';

export const MikroOrmSymbol: symbol = Symbol.for('MikroOrm');

export async function setUpMikroOrm(databaseConfig: DatabaseConfig): Promise<MikroORM> {
  return MikroORM.init({
    connect: true,
    dbName: databaseConfig.database,
    driver: PostgreSqlDriver,
    entities: ['../../../../**/infrastructure/mikroOrm/model/*MikroOrm.ts'],
    entitiesTs: ['../../../../**/infrastructure/mikroOrm/model/*MikroOrm.ts'],
    forceUndefined: true,
    forceUtcTimezone: true,
    host: databaseConfig.host,
    password: databaseConfig.password,
    pool: {
      max: 10,
      min: 1,
    },
    port: databaseConfig.port,
    user: databaseConfig.user,
  });
}
