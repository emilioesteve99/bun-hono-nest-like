import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

export interface MikroOrmClientOptions {
  host: string;
  dbName: string;
  user: string;
  password: string;
  port: number;
}

export const MikroOrmSymbol: symbol = Symbol.for('MikroOrm');

export async function setUpMikroOrm(options: MikroOrmClientOptions): Promise<MikroORM> {
  return MikroORM.init({
    connect: true,
    dbName: options.dbName,
    driver: PostgreSqlDriver,
    entities: ['../../../../**/infrastructure/mikroOrm/model/*MikroOrm.ts'],
    entitiesTs: ['../../../../**/infrastructure/mikroOrm/model/*MikroOrm.ts'],
    forceUndefined: true,
    forceUtcTimezone: true,
    host: options.host,
    password: options.password,
    pool: {
      max: 10,
      min: 1,
    },
    port: 5432,
    user: options.user,
  });
}
