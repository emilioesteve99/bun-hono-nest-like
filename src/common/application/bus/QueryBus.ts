import { injectable } from 'inversify';

import { di } from '../../infrastructure/di/di';
import { queryHandlersByCommandType } from '../decorator/queryHandler';
import { Query } from '../model/Query';
import { QueryHandler } from '../queryHandler/QueryHandler';

@injectable()
export class QueryBus {
  public async execute<TQuery extends Query = Query, TResult = unknown>(query: TQuery): Promise<TResult> {
    const queryName: string = query.constructor.name;
    const queryHandlerName: string | undefined = queryHandlersByCommandType.get(queryName);
    if (queryHandlerName === undefined) {
      throw new Error(`QueryHandler not found for query: ${queryName}`);
    }

    const queryHandler: QueryHandler<TQuery, TResult> = di.get(queryHandlerName);
    return queryHandler.execute(query);
  }
}
