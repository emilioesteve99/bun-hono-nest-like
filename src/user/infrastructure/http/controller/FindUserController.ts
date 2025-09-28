import type { Context } from 'hono';
import { injectable } from 'inversify';
import { z } from 'zod';

import { QueryBus } from '../../../../common/application/bus/QueryBus';
import { requestUser } from '../../../../common/infrastructure/http/decorator/requestUser';
import { route } from '../../../../common/infrastructure/http/decorator/route';
import { useInterceptor } from '../../../../common/infrastructure/http/decorator/useInterceptor';
import { AuthInterceptor } from '../../../../common/infrastructure/http/interceptor/AuthInterceptor';
import { HttpMethod } from '../../../../common/infrastructure/http/model/HttpMethod';
import type { UserJwt } from '../../../../common/infrastructure/http/model/UserJwt';
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
    method: HttpMethod.GET,
    path: '/users',
    version: 'v1',
  })
  @useInterceptor(AuthInterceptor)
  public async find(
    _c: Context,
    @validateQueryParams(findUserQueryParamsSchema) _queryParams: FindUserQueryParams,
    @requestUser() _user: UserJwt,
  ): Promise<User[]> {
    return this.queryBus.execute(new UserFindQuery());
  }
}
