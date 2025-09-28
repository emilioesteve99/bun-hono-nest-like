import { injectable } from 'inversify';

import { QueryHandler } from './QueryHandler';
import { CountAdapter } from '../../domain/adapter/CountAdapter';
import { Query } from '../model/Query';

@injectable()
export class CountQueryHandler<TQuery extends Query> implements QueryHandler<TQuery, number> {
  public constructor(private readonly countAdapter: CountAdapter<TQuery>) {}

  public async execute(query: TQuery): Promise<number> {
    return this.countAdapter.count(query);
  }
}
