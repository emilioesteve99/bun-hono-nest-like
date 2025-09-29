import { describe, expect, it } from 'vitest';

import { commandHandler, commandHandlersByCommandType } from './commandHandler';

class TestCommand {}

@commandHandler(TestCommand)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestCommandHandler {}

describe('@commandHandler()', () => {
  describe('when a handler is decorated', () => {
    it('should register the handler in commandHandlersByCommandType', () => {
      expect(commandHandlersByCommandType.get('TestCommand')).toBe('TestCommandHandler');
    });
  });
});
