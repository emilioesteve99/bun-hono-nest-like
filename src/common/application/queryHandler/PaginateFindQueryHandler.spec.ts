import { afterAll, beforeAll, describe, expect, it, Mocked, vi } from 'vitest';

import { PaginateFindQueryHandler } from './PaginateFindQueryHandler';
import { PaginateFindAdapter } from '../../domain/adapter/PaginateFindAdapter';
import { AnyEntity } from '../../domain/model/AnyEntity';
import { Pagination } from '../../domain/model/Pagination';
import { Query } from '../model/Query';

describe('PaginateFindQueryHandler', () => {
  let paginateFindAdapterMock: Mocked<PaginateFindAdapter<Query, AnyEntity>>;
  let paginateFindQueryHandler: PaginateFindQueryHandler<Query, AnyEntity>;

  beforeAll(() => {
    paginateFindAdapterMock = {
      paginateFind: vi.fn(),
    };
    paginateFindQueryHandler = new PaginateFindQueryHandler(paginateFindAdapterMock);
  });

  describe('.execute()', () => {
    describe('when called', () => {
      let queryFixture: Query;
      let result: Pagination<AnyEntity>;
      let paginationFixture: Pagination<AnyEntity>;

      beforeAll(async () => {
        queryFixture = {} as Query;
        paginationFixture = { items: [], total: 0 };
        paginateFindAdapterMock.paginateFind.mockResolvedValueOnce(paginationFixture);
        result = await paginateFindQueryHandler.execute(queryFixture);
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call paginateFindAdapter.paginateFind()', () => {
        expect(paginateFindAdapterMock.paginateFind).toHaveBeenCalledTimes(1);
        expect(paginateFindAdapterMock.paginateFind).toHaveBeenCalledWith(queryFixture);
      });

      it('should return Pagination<AnyEntity>', () => {
        expect(result).toEqual(paginationFixture);
      });
    });
  });
});
