import { injectable } from 'inversify';

import { queryHandler } from '../../../common/application/decorator/queryHandler';
import { QueryHandler } from '../../../common/application/queryHandler/QueryHandler';
import { User } from '../../domain/model/User';
import { UserFindQuery } from '../../domain/query/UserFindQuery';

@injectable()
@queryHandler(UserFindQuery)
export class UserFindQueryHandler implements QueryHandler<UserFindQuery, User[]> {
  public async execute(_query: UserFindQuery): Promise<User[]> {
    return []; // Placeholder return value
  }
}
