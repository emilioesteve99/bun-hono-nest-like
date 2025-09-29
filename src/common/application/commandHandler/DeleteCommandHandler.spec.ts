import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { DeleteCommandHandler } from './DeleteCommandHandler';
import { DeleteAdapter } from '../../domain/adapter/DeleteAdapter';
import { Command } from '../model/Command';

describe('DeleteCommandHandler', () => {
  let deleteAdapterMock: DeleteAdapter<Command>;
  let deleteCommandHandler: DeleteCommandHandler<Command>;

  beforeAll(() => {
    deleteAdapterMock = { delete: vi.fn().mockResolvedValue(undefined) };
    deleteCommandHandler = new DeleteCommandHandler(deleteAdapterMock);
  });

  describe('.execute()', () => {
    describe('when called', () => {
      let commandFixture: Command;

      beforeAll(async () => {
        commandFixture = {};

        await deleteCommandHandler.execute(commandFixture);
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call deleteAdapter.delete()', () => {
        expect(deleteAdapterMock.delete).toHaveBeenCalledTimes(1);
        expect(deleteAdapterMock.delete).toHaveBeenCalledWith(commandFixture);
      });
    });
  });
});
