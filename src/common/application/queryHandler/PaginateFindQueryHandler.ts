import { Injectable } from '@nestjs/common';
import { IQuery, IQueryHandler } from '@nestjs/cqrs';

import { PaginateFindAdapter } from '../../domain/adapter/PaginateFindAdapter';
import { Pagination } from '../../domain/model/Pagination';

@Injectable()
export class PaginateFindQueryHandler<TQuery extends IQuery, TModel>
  implements IQueryHandler<TQuery, Pagination<TModel>>
{
  public constructor(private readonly paginateFindAdapter: PaginateFindAdapter<TQuery, TModel>) {}

  public async execute(query: TQuery): Promise<Pagination<TModel>> {
    return this.paginateFindAdapter.paginateFind(query);
  }
}
