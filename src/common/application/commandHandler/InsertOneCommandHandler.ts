import { injectable } from 'inversify';

import { CommandHandler } from './CommandHandler';
import { InsertOneAdapter } from '../../domain/adapter/InsertOneAdapter';
import { Command } from '../model/Command';

@injectable()
export class InsertOneCommandHandler<TCommand extends Command, TModel> implements CommandHandler<TCommand, TModel> {
  public constructor(private readonly insertOneAdapter: InsertOneAdapter<TCommand, TModel>) {}

  public async execute(command: TCommand): Promise<TModel> {
    return this.insertOneAdapter.insertOne(command);
  }
}
