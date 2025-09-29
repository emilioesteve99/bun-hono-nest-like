import { Command } from '../../application/model/Command';

export interface UpdateManyAdapter<TCommand extends Command, TContext = void> {
  updateMany(command: TCommand, context: TContext): Promise<void>;
}
