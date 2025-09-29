import { afterAll, beforeAll, describe, expect, it, Mocked, vi } from 'vitest';

import { InsertManyCommandHandler } from './InsertManyCommandHandler';
import { InsertManyAdapter } from '../../domain/adapter/InsertManyAdapter';
import { AnyEntity } from '../../domain/model/AnyEntity';
import { Command } from '../model/Command';

describe('InsertManyCommandHandler', () => {
  let insertManyAdapterMock: Mocked<InsertManyAdapter<Command, AnyEntity>>;
  let insertManyCommandHandler: InsertManyCommandHandler<Command, AnyEntity>;

  beforeAll(() => {
    insertManyAdapterMock = {
      insertMany: vi.fn(),
    };

    insertManyCommandHandler = new InsertManyCommandHandler(insertManyAdapterMock);
  });

  describe('.execute()', () => {
    describe('when called', () => {
      let commandFixture: Command;
      let anyEntityArrayFixture: AnyEntity[];
      let result: unknown;

      beforeAll(async () => {
        commandFixture = {};
        anyEntityArrayFixture = [{}];

        insertManyAdapterMock.insertMany.mockResolvedValueOnce(anyEntityArrayFixture);

        result = await insertManyCommandHandler.execute(commandFixture);
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call insertManyAdapter.insertMany()', () => {
        expect(insertManyAdapterMock.insertMany).toHaveBeenCalledTimes(1);
        expect(insertManyAdapterMock.insertMany).toHaveBeenCalledWith(commandFixture);
      });

      it('should return AnyEntity[]', () => {
        expect(result).toEqual(anyEntityArrayFixture);
      });
    });
  });
});
