import { Query } from '../../application/model/Query';

export interface CountAdapter<TQuery extends Query> {
  count(query: TQuery): Promise<number>;
}
