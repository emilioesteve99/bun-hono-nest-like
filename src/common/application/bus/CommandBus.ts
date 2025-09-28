import { injectable } from 'inversify';

import { di } from '../../infrastructure/di/di';
import { CommandHandler } from '../commandHandler/CommandHandler';
import { commandHandlersByCommandType } from '../decorator/commandHandler';
import { Command } from '../model/Command';

@injectable()
export class CommandBus {
  public async execute<TCommand extends Command = Command, TResult = unknown>(command: TCommand): Promise<TResult> {
    const commandName: string = command.constructor.name;
    const commandHandlerName: string | undefined = commandHandlersByCommandType.get(commandName);
    if (commandHandlerName === undefined) {
      throw new Error(`CommandHandler not found for command: ${commandName}`);
    }

    const commandHandler: CommandHandler<TCommand, TResult> = await di.getAsync(commandHandlerName);
    return commandHandler.execute(command);
  }
}
