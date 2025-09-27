import type { Context } from 'hono';
import { inject, injectable } from 'inversify';
import { z } from 'zod';

import { route } from '../../../../common/infrastructure/http/decorator/route';
import { validateQueryParams } from '../../../../common/infrastructure/http/validator/decorator/validateQueryParams';
import { uuidsPipe } from '../../../../common/infrastructure/http/validator/pipe/uuidsPipe';
import { UserService, UserServiceSymbol } from '../../../application/UserService';
import { User } from '../../../domain/model/User';

const findUserControllerQuerySchema: z.ZodType = z.object({
  ids: uuidsPipe,
});

@injectable()
export class FindUserController {
  public constructor(@inject(UserServiceSymbol) private readonly userService: UserService) {}
  @route({
    method: 'GET',
    path: '/users',
    version: 'v1',
  })
  @validateQueryParams(findUserControllerQuerySchema)
  public async handleUsers(_: Context): Promise<User[]> {
    return this.userService.getAll();
  }
}
