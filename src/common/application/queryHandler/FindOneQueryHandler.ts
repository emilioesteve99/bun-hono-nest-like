import { injectable } from 'inversify';

import { QueryHandler } from './QueryHandler';
import { FindOneAdapter } from '../../domain/adapter/FindOneAdapter';
import { Query } from '../model/Query';

@injectable()
export class FindOneQueryHandler<TQuery extends Query, TModel> implements QueryHandler<TQuery, TModel | undefined> {
  public constructor(private readonly findOneAdapter: FindOneAdapter<TQuery, TModel>) {}

  public async execute(query: TQuery): Promise<TModel | undefined> {
    return this.findOneAdapter.findOne(query);
  }
}
