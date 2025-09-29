import { Command } from '../../application/model/Command';
import { AnyEntity } from '../model/AnyEntity';

export interface InsertManyAdapter<TCommand extends Command, TModel extends AnyEntity, TContext = void> {
  insertMany(command: TCommand, context: TContext): Promise<TModel[]>;
}
