import { injectable } from 'inversify';

import { CommandHandler } from './CommandHandler';
import { DeleteAdapter } from '../../domain/adapter/DeleteAdapter';
import { Command } from '../model/Command';

@injectable()
export class DeleteCommandHandler<TCommand extends Command> implements CommandHandler<TCommand> {
  public constructor(private readonly deleteAdapter: DeleteAdapter<TCommand>) {}

  public async execute(command: TCommand): Promise<void> {
    await this.deleteAdapter.delete(command);
  }
}
