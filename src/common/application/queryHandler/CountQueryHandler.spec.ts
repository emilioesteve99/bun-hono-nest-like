import { afterAll, beforeAll, describe, expect, it, Mocked, vi } from 'vitest';

import { CountQueryHandler } from './CountQueryHandler';
import { CountAdapter } from '../../domain/adapter/CountAdapter';
import { Query } from '../model/Query';

describe('CountQueryHandler', () => {
  let countAdapterMock: Mocked<CountAdapter<Query>>;
  let countQueryHandler: CountQueryHandler<Query>;

  beforeAll(() => {
    countAdapterMock = {
      count: vi.fn(),
    };
    countQueryHandler = new CountQueryHandler(countAdapterMock);
  });

  describe('.execute()', () => {
    describe('when called', () => {
      let queryFixture: Query;
      let result: number;

      beforeAll(async () => {
        queryFixture = {} as Query;
        countAdapterMock.count.mockResolvedValueOnce(42);
        result = await countQueryHandler.execute(queryFixture);
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call countAdapter.count()', () => {
        expect(countAdapterMock.count).toHaveBeenCalledTimes(1);
        expect(countAdapterMock.count).toHaveBeenCalledWith(queryFixture);
      });

      it('should return number', () => {
        expect(result).toBe(42);
      });
    });
  });
});
