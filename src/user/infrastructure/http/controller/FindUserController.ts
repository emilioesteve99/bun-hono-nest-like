import type { Context } from 'hono';
import { injectable } from 'inversify';
import { z } from 'zod';

import { QueryBus } from '../../../../common/application/cqrs/bus/QueryBus';
import { route } from '../../../../common/infrastructure/http/decorator/route';
import { validateQueryParams } from '../../../../common/infrastructure/http/validator/decorator/validateQueryParams';
import { uuidsPipe } from '../../../../common/infrastructure/http/validator/pipe/uuidsPipe';
import { User } from '../../../domain/model/User';
import { UserFindQuery } from '../../../domain/query/UserFindQuery';

const findUserQueryParamsSchema: z.ZodType = z.object({
  ids: uuidsPipe,
});

type FindUserQueryParams = {
  ids?: string[];
};

@injectable()
export class FindUserController {
  public constructor(private readonly queryBus: QueryBus) {}
  @route({
    method: 'GET',
    path: '/users',
    version: 'v1',
  })
  public async findAll(
    _c: Context,
    @validateQueryParams(findUserQueryParamsSchema) _queryParams: FindUserQueryParams,
  ): Promise<User[]> {
    return this.queryBus.execute(new UserFindQuery());
  }
}
