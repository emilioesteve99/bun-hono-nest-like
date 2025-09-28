import { injectable } from 'inversify';

import { CommandHandler } from './CommandHandler';
import { InsertManyAdapter } from '../../domain/adapter/InsertManyAdapter';
import { Command } from '../model/Command';

@injectable()
export class InsertManyCommandHandler<TCommand extends Command, TModel> implements CommandHandler<TCommand, TModel[]> {
  public constructor(private readonly insertAdapter: InsertManyAdapter<TCommand, TModel>) {}

  public async execute(command: TCommand): Promise<TModel[]> {
    return this.insertAdapter.insertMany(command);
  }
}
