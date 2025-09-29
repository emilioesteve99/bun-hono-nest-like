import { Command } from '../../application/model/Command';
import { Query } from '../../application/model/Query';
import { Pagination } from '../model/Pagination';

export interface PaginateFindAdapter<TQuery extends Query, TModel extends Command> {
  paginateFind(query: TQuery): Promise<Pagination<TModel>>;
}
