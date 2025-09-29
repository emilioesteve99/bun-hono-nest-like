import { afterAll, beforeAll, describe, expect, it, Mocked, vi } from 'vitest';

import { CommandBus } from './CommandBus';
import { di } from '../../infrastructure/di/di';
import { GlobalContainer } from '../../infrastructure/di/GlobalContainer';
import { CommandHandler } from '../commandHandler/CommandHandler';
import { commandHandlersByCommandType } from '../decorator/commandHandler';
import { Command } from '../model/Command';

vi.mock('../../infrastructure/di/di', () => ({
  di: {
    get: vi.fn(),
  },
}));

vi.mock('../decorator/commandHandler', () => ({
  commandHandlersByCommandType: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

class CommandTest implements Command {}

describe('CommandBus', () => {
  let commandHandlerMock: Mocked<CommandHandler<Command, object>>;

  beforeAll(() => {
    commandHandlerMock = {
      execute: vi.fn(),
    };
  });

  describe('.execute()', () => {
    describe('when called and handler is not cached and commandHandlerName is undefined', () => {
      let commandBus: CommandBus;
      let commandFixture: CommandTest;
      let result: unknown;

      beforeAll(async () => {
        commandBus = new CommandBus();
        commandFixture = new CommandTest();

        (commandHandlersByCommandType as Mocked<Map<string, string>>).get.mockReturnValueOnce(undefined);

        try {
          result = await commandBus.execute(commandFixture);
        } catch (err) {
          result = err;
        }
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call commandHandlersByCommandType.get()', () => {
        expect(commandHandlersByCommandType.get).toHaveBeenCalledTimes(1);
        expect(commandHandlersByCommandType.get).toHaveBeenCalledWith('CommandTest');
      });

      it('should throw an error', () => {
        expect(result).toBeInstanceOf(Error);
        expect((result as Error).message).toBe('CommandHandler not found for command: CommandTest');
      });
    });

    describe('when called and handler is not cached', () => {
      let commandBus: CommandBus;
      let commandFixture: CommandTest;
      let handlerOutput: object;
      let result: unknown;

      beforeAll(async () => {
        commandBus = new CommandBus();
        commandFixture = new CommandTest();
        handlerOutput = {};

        (commandHandlersByCommandType as Mocked<Map<string, string>>).get.mockReturnValueOnce(CommandTest.name);
        (di.get as any).mockReturnValueOnce(commandHandlerMock);
        commandHandlerMock.execute.mockResolvedValueOnce(handlerOutput);

        result = await commandBus.execute(commandFixture);
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call di.get()', () => {
        expect(di.get).toHaveBeenCalledTimes(1);
        expect(di.get).toHaveBeenCalledWith('CommandTest');
      });

      it('should call commandHandler.execute()', () => {
        expect(commandHandlerMock.execute).toHaveBeenCalledTimes(1);
        expect(commandHandlerMock.execute).toHaveBeenCalledWith(commandFixture);
      });

      it('should return object', () => {
        expect(result).toStrictEqual(handlerOutput);
      });
    });

    describe('when called and handler is cached', () => {
      let commandBus: CommandBus;
      let commandFixture: CommandTest;
      let handlerOutput: object;
      let result: unknown;

      beforeAll(async () => {
        commandBus = new CommandBus();
        commandFixture = new CommandTest();
        handlerOutput = {};

        (commandHandlersByCommandType as Mocked<Map<string, string>>).get.mockReturnValueOnce(CommandTest.name);
        (di.get as Mocked<GlobalContainer>).mockReturnValueOnce(commandHandlerMock);
        commandHandlerMock.execute.mockResolvedValueOnce(handlerOutput).mockResolvedValueOnce(handlerOutput);

        await commandBus.execute(commandFixture);
        result = await commandBus.execute(commandFixture);
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call di.get() only once even after two execute calls', () => {
        expect(di.get).toHaveBeenCalledTimes(1);
        expect(di.get).toHaveBeenCalledWith('CommandTest');
      });

      it('should call commandHandler.execute() twice', () => {
        expect(commandHandlerMock.execute).toHaveBeenCalledTimes(2);
        expect(commandHandlerMock.execute).toHaveBeenNthCalledWith(1, commandFixture);
        expect(commandHandlerMock.execute).toHaveBeenNthCalledWith(2, commandFixture);
      });

      it('should return object', () => {
        expect(result).toStrictEqual(handlerOutput);
      });
    });
  });
});
