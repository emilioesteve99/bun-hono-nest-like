import { injectable } from 'inversify';

import { QueryHandler } from './QueryHandler';
import { FindAdapter } from '../../domain/adapter/FindAdapter';
import { Query } from '../model/Query';

@injectable()
export class FindManyQueryHandler<TQuery extends Query, TModel> implements QueryHandler<TQuery, TModel[]> {
  public constructor(private readonly findAdapter: FindAdapter<TQuery, TModel>) {}

  public async execute(query: TQuery): Promise<TModel[]> {
    return this.findAdapter.find(query);
  }
}
