import { afterAll, beforeAll, describe, expect, it, Mocked, vi } from 'vitest';

import { FindOneQueryHandler } from './FindOneQueryHandler';
import { FindOneAdapter } from '../../domain/adapter/FindOneAdapter';
import { AnyEntity } from '../../domain/model/AnyEntity';
import { Query } from '../model/Query';

describe('FindOneQueryHandler', () => {
  let findOneAdapterMock: Mocked<FindOneAdapter<Query, AnyEntity>>;
  let findOneQueryHandler: FindOneQueryHandler<Query, AnyEntity>;

  beforeAll(() => {
    findOneAdapterMock = {
      findOne: vi.fn(),
    };
    findOneQueryHandler = new FindOneQueryHandler(findOneAdapterMock);
  });

  describe('.execute()', () => {
    describe('when called', () => {
      let queryFixture: Query;
      let result: AnyEntity | undefined;
      let anyEntityFixture: AnyEntity;

      beforeAll(async () => {
        queryFixture = {} as Query;
        anyEntityFixture = {};
        findOneAdapterMock.findOne.mockResolvedValueOnce(anyEntityFixture);
        result = await findOneQueryHandler.execute(queryFixture);
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call findOneAdapter.findOne()', () => {
        expect(findOneAdapterMock.findOne).toHaveBeenCalledTimes(1);
        expect(findOneAdapterMock.findOne).toHaveBeenCalledWith(queryFixture);
      });

      it('should return AnyEntity | undefined', () => {
        expect(result).toEqual(anyEntityFixture);
      });
    });
  });
});
