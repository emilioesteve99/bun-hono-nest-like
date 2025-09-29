import { afterAll, beforeAll, describe, expect, it, Mocked, vi } from 'vitest';

import { UpdateOneCommandHandler } from './UpdateOneCommandHandler';
import { UpdateOneAdapter } from '../../domain/adapter/UpdateOneAdapter';
import { Command } from '../model/Command';

describe('UpdateOneCommandHandler', () => {
  let updateOneAdapterMock: Mocked<UpdateOneAdapter<Command>>;
  let updateOneCommandHandler: UpdateOneCommandHandler<Command>;

  beforeAll(() => {
    updateOneAdapterMock = {
      updateOne: vi.fn(),
    };

    updateOneCommandHandler = new UpdateOneCommandHandler(updateOneAdapterMock);
  });

  describe('.execute()', () => {
    describe('when called', () => {
      let commandFixture: Command;

      beforeAll(async () => {
        commandFixture = {};

        await updateOneCommandHandler.execute(commandFixture);
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call updateOneAdapter.updateOne()', () => {
        expect(updateOneAdapterMock.updateOne).toHaveBeenCalledTimes(1);
        expect(updateOneAdapterMock.updateOne).toHaveBeenCalledWith(commandFixture);
      });
    });
  });
});
