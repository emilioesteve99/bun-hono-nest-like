import { injectable } from 'inversify';

import { CommandHandler } from './CommandHandler';
import { UpdateOneAdapter } from '../../domain/adapter/UpdateOneAdapter';
import { Command } from '../model/Command';

@injectable()
export class UpdateOneCommandHandler<TCommand extends Command> implements CommandHandler<TCommand> {
  public constructor(private readonly updateOneAdapter: UpdateOneAdapter<TCommand>) {}

  public async execute(command: TCommand): Promise<void> {
    await this.updateOneAdapter.updateOne(command);
  }
}
