import { randomUUID } from 'node:crypto';

import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({
  tableName: 'users',
})
export class UserMikroOrm {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id: string = randomUUID();

  @Property({ name: 'name' })
  name!: string;
}
