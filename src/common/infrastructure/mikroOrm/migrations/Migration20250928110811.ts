import { Migration } from '@mikro-orm/migrations';

export class Migration20250928110811 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "users" ("id" uuid not null, "name" varchar(255) not null, constraint "users_pkey" primary key ("id"));`);
  }

}
