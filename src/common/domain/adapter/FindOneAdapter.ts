import { Query } from '../../application/model/Query';
import { AnyEntity } from '../model/AnyEntity';

export interface FindOneAdapter<TQuery extends Query, TModel extends AnyEntity> {
  findOne(query: TQuery): Promise<TModel | undefined>;
}
