import type { Context } from 'hono';
import { injectable } from 'inversify';
import { z } from 'zod';

import { CommandBus } from '../../../../common/application/cqrs/bus/CommandBus';
import { route } from '../../../../common/infrastructure/http/decorator/route';
import { HttpMethod } from '../../../../common/infrastructure/http/model/HttpMethod';
import { validateBody } from '../../../../common/infrastructure/http/validator/decorator/validateBody';
import { UserInsertOneCommand } from '../../../domain/command/UserInsertOneCommand';
import { User } from '../../../domain/model/User';

export const insertOneUserBodySchema: z.ZodType = z.object({
  name: z.string().min(1).max(100),
});

export interface InsertOneUserBody {
  name: string;
}

@injectable()
export class InsertOneUserController {
  public constructor(private readonly commandBus: CommandBus) {}

  @route({
    method: HttpMethod.POST,
    path: '/users',
    version: 'v1',
  })
  public async insertOne(_c: Context, @validateBody(insertOneUserBodySchema) _body: InsertOneUserBody): Promise<User> {
    const user: User = await this.commandBus.execute(new UserInsertOneCommand());
    return user;
  }
}
