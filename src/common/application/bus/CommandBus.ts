import { injectable } from 'inversify';

import { di } from '../../infrastructure/di/di';
import { CommandHandler } from '../commandHandler/CommandHandler';
import { commandHandlersByCommandType } from '../decorator/commandHandler';
import { Command } from '../model/Command';

@injectable()
export class CommandBus {
  private readonly handlersCache: Map<string, CommandHandler<unknown, unknown>> = new Map();

  public async execute<TCommand extends Command = Command, TResult = unknown>(command: TCommand): Promise<TResult> {
    const commandName: string = command.constructor.name;
    const cachedHandler: CommandHandler<TCommand, TResult> | undefined = this.handlersCache.get(
      commandName,
    ) as CommandHandler<TCommand, TResult>;
    if (cachedHandler !== undefined) {
      return cachedHandler.execute(command);
    }

    const commandHandlerName: string | undefined = commandHandlersByCommandType.get(commandName);
    if (commandHandlerName === undefined) {
      throw new Error(`CommandHandler not found for command: ${commandName}`);
    }

    const commandHandler: CommandHandler<TCommand, TResult> = di.get(commandHandlerName);
    this.handlersCache.set(commandName, commandHandler);
    return commandHandler.execute(command);
  }
}
