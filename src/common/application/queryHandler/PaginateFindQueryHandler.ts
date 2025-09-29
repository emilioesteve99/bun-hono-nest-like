import { injectable } from 'inversify';

import { QueryHandler } from './QueryHandler';
import { PaginateFindAdapter } from '../../domain/adapter/PaginateFindAdapter';
import { Pagination } from '../../domain/model/Pagination';
import { Query } from '../model/Query';

@injectable()
export class PaginateFindQueryHandler<TQuery extends Query, TModel>
  implements QueryHandler<TQuery, Pagination<TModel>>
{
  public constructor(private readonly paginateFindAdapter: PaginateFindAdapter<TQuery, TModel>) {}

  public async execute(query: TQuery): Promise<Pagination<TModel>> {
    return this.paginateFindAdapter.paginateFind(query);
  }
}
