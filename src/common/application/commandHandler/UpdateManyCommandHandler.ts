import { injectable } from 'inversify';

import { CommandHandler } from './CommandHandler';
import { UpdateManyAdapter } from '../../domain/adapter/UpdateManyAdapter';
import { Command } from '../model/Command';

@injectable()
export class UpdateManyCommandHandler<TCommand extends Command> implements CommandHandler<TCommand> {
  public constructor(private readonly updateAdapter: UpdateManyAdapter<TCommand>) {}

  public async execute(command: TCommand): Promise<void> {
    await this.updateAdapter.updateMany(command);
  }
}
