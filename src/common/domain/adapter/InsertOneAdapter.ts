import { Command } from '../../application/model/Command';
import { AnyEntity } from '../model/AnyEntity';

export interface InsertOneAdapter<TCommand extends Command, TModel extends AnyEntity, TContext = void> {
  insertOne(command: TCommand, context: TContext): Promise<TModel>;
}
