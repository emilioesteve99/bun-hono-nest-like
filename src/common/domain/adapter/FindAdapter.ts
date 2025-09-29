import { Query } from '../../application/model/Query';
import { AnyEntity } from '../model/AnyEntity';

export interface FindAdapter<TQuery extends Query, TModel extends AnyEntity> {
  find(query: TQuery): Promise<TModel[]>;
}
