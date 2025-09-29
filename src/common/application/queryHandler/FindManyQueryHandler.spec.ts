import { afterAll, beforeAll, describe, expect, it, Mocked, vi } from 'vitest';

import { FindManyQueryHandler } from './FindManyQueryHandler';
import { FindAdapter } from '../../domain/adapter/FindAdapter';
import { AnyEntity } from '../../domain/model/AnyEntity';
import { Query } from '../model/Query';

describe('FindManyQueryHandler', () => {
  let findAdapterMock: Mocked<FindAdapter<Query, AnyEntity>>;
  let findManyQueryHandler: FindManyQueryHandler<Query, AnyEntity>;

  beforeAll(() => {
    findAdapterMock = {
      find: vi.fn(),
    };
    findManyQueryHandler = new FindManyQueryHandler(findAdapterMock);
  });

  describe('.execute()', () => {
    describe('when called', () => {
      let queryFixture: Query;
      let result: AnyEntity[];
      let anyEntityArrayFixture: AnyEntity[];

      beforeAll(async () => {
        queryFixture = {} as Query;
        anyEntityArrayFixture = [{}];
        findAdapterMock.find.mockResolvedValueOnce(anyEntityArrayFixture);
        result = await findManyQueryHandler.execute(queryFixture);
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call findAdapter.find()', () => {
        expect(findAdapterMock.find).toHaveBeenCalledTimes(1);
        expect(findAdapterMock.find).toHaveBeenCalledWith(queryFixture);
      });

      it('should return AnyEntity[]', () => {
        expect(result).toEqual(anyEntityArrayFixture);
      });
    });
  });
});
