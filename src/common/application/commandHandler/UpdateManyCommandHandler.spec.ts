import { afterAll, beforeAll, describe, expect, it, Mocked, vi } from 'vitest';

import { UpdateManyCommandHandler } from './UpdateManyCommandHandler';
import { UpdateManyAdapter } from '../../domain/adapter/UpdateManyAdapter';
import { Command } from '../model/Command';

describe('UpdateManyCommandHandler', () => {
  let updateManyAdapterMock: Mocked<UpdateManyAdapter<Command>>;
  let updateManyCommandHandler: UpdateManyCommandHandler<Command>;

  beforeAll(() => {
    updateManyAdapterMock = {
      updateMany: vi.fn(),
    };

    updateManyCommandHandler = new UpdateManyCommandHandler(updateManyAdapterMock);
  });

  describe('.execute()', () => {
    describe('when called', () => {
      let commandFixture: Command;

      beforeAll(async () => {
        commandFixture = {};

        await updateManyCommandHandler.execute(commandFixture);
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call updateManyAdapter.updateMany()', () => {
        expect(updateManyAdapterMock.updateMany).toHaveBeenCalledTimes(1);
        expect(updateManyAdapterMock.updateMany).toHaveBeenCalledWith(commandFixture);
      });
    });
  });
});
