import { Command } from '../../application/model/Command';

export interface UpdateOneAdapter<TCommand extends Command, TContext = void> {
  updateOne(command: TCommand, context: TContext): Promise<void>;
}
