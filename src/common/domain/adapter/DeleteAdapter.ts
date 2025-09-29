import { Command } from '../../application/model/Command';

export interface DeleteAdapter<TCommand extends Command> {
  delete(command: TCommand): Promise<void>;
}
