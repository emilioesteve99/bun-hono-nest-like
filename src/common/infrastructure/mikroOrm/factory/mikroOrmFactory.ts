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

export async function mikroOrmFactory(options: MikroOrmClientOptions): Promise<MikroORM> {
  console.log('A');
  const orm: MikroORM = await MikroORM.init({
    driver: PostgreSqlDriver,
    connect: true,
    dbName: options.dbName,
    entities: ['./dist/*/infrastructure/mikroOrm/model/!(AnyEntity)*.js'],
    entitiesTs: ['./src/*/infrastructure/mikroOrm/model/!(AnyEntity)*.ts'],
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
  console.log('B');
  return orm;
}
