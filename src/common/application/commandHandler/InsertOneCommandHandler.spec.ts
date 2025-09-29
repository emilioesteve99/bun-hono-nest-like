import { afterAll, beforeAll, describe, expect, it, Mocked, vi } from 'vitest';

import { InsertOneCommandHandler } from './InsertOneCommandHandler';
import { InsertOneAdapter } from '../../domain/adapter/InsertOneAdapter';
import { AnyEntity } from '../../domain/model/AnyEntity';
import { Command } from '../model/Command';

describe('InsertOneCommandHandler', () => {
  let insertOneAdapterMock: Mocked<InsertOneAdapter<Command, AnyEntity>>;
  let insertOneCommandHandler: InsertOneCommandHandler<Command, AnyEntity>;

  beforeAll(() => {
    insertOneAdapterMock = {
      insertOne: vi.fn(),
    };

    insertOneCommandHandler = new InsertOneCommandHandler(insertOneAdapterMock);
  });

  describe('.execute()', () => {
    describe('when called', () => {
      let commandFixture: Command;
      let anyEntityFixture: AnyEntity;
      let result: unknown;

      beforeAll(async () => {
        commandFixture = {};
        anyEntityFixture = {};

        insertOneAdapterMock.insertOne.mockResolvedValueOnce(anyEntityFixture);

        result = await insertOneCommandHandler.execute(commandFixture);
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call insertOneAdapter.insertOne()', () => {
        expect(insertOneAdapterMock.insertOne).toHaveBeenCalledTimes(1);
        expect(insertOneAdapterMock.insertOne).toHaveBeenCalledWith(commandFixture);
      });

      it('should return AnyEntity', () => {
        expect(result).toEqual(anyEntityFixture);
      });
    });
  });
});
