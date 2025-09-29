import { injectable } from 'inversify';

import { di } from '../../infrastructure/di/di';
import { queryHandlersByQueryType } from '../decorator/queryHandler';
import { Query } from '../model/Query';
import { QueryHandler } from '../queryHandler/QueryHandler';

@injectable()
export class QueryBus {
  private readonly handlersCache: Map<string, QueryHandler<unknown, unknown>> = new Map();

  public async execute<TQuery extends Query = Query, TResult = unknown>(query: TQuery): Promise<TResult> {
    const queryName: string = query.constructor.name;
    const cachedHandler: QueryHandler<TQuery, TResult> | undefined = this.handlersCache.get(queryName) as QueryHandler<
      TQuery,
      TResult
    >;
    if (cachedHandler !== undefined) {
      return cachedHandler.execute(query);
    }

    const queryHandlerName: string | undefined = queryHandlersByQueryType.get(queryName);
    if (queryHandlerName === undefined) {
      throw new Error(`QueryHandler not found for query: ${queryName}`);
    }

    const queryHandler: QueryHandler<TQuery, TResult> = di.get(queryHandlerName);
    this.handlersCache.set(queryName, queryHandler);
    return queryHandler.execute(query);
  }
}
