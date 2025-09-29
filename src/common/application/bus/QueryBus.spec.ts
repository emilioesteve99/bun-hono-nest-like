import { afterAll, beforeAll, describe, expect, it, Mocked, vi } from 'vitest';

import { QueryBus } from './QueryBus';
import { AnyEntity } from '../../domain/model/AnyEntity';
import { di } from '../../infrastructure/di/di';
import { GlobalContainer } from '../../infrastructure/di/GlobalContainer';
import { queryHandlersByQueryType } from '../decorator/queryHandler';
import { Query } from '../model/Query';
import { QueryHandler } from '../queryHandler/QueryHandler';

vi.mock('../../infrastructure/di/di', () => ({
  di: {
    get: vi.fn(),
  },
}));

vi.mock('../decorator/queryHandler', () => ({
  queryHandlersByQueryType: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

class QueryTest implements Query {}

describe('QueryBus', () => {
  let queryHandlerMock: Mocked<QueryHandler<Query, AnyEntity>>;

  beforeAll(() => {
    queryHandlerMock = {
      execute: vi.fn(),
    };
  });

  describe('.execute()', () => {
    describe('when called and handler is not cached and queryHandlerName is undefined', () => {
      let queryBus: QueryBus;
      let queryFixture: QueryTest;
      let result: unknown;

      beforeAll(async () => {
        queryBus = new QueryBus();
        queryFixture = new QueryTest();

        (queryHandlersByQueryType as Mocked<Map<string, string>>).get.mockReturnValueOnce(undefined);

        try {
          result = await queryBus.execute(queryFixture);
        } catch (err) {
          result = err;
        }
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call queryHandlersByQueryType.get()', () => {
        expect(queryHandlersByQueryType.get).toHaveBeenCalledTimes(1);
        expect(queryHandlersByQueryType.get).toHaveBeenCalledWith('QueryTest');
      });

      it('should throw an error', () => {
        expect(result).toBeInstanceOf(Error);
        expect((result as Error).message).toBe('QueryHandler not found for query: QueryTest');
      });
    });

    describe('when called and handler is not cached', () => {
      let queryBus: QueryBus;
      let queryFixture: QueryTest;
      let queryHandlerOutput: AnyEntity;
      let result: unknown;

      beforeAll(async () => {
        queryBus = new QueryBus();
        queryFixture = new QueryTest();
        queryHandlerOutput = {};

        (queryHandlersByQueryType as Mocked<Map<string, string>>).get.mockReturnValueOnce(QueryTest.name);
        (di.get as Mocked<GlobalContainer>).mockReturnValueOnce(queryHandlerMock);
        queryHandlerMock.execute.mockResolvedValueOnce(queryHandlerOutput);

        result = await queryBus.execute(queryFixture);
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call di.get()', () => {
        expect(di.get).toHaveBeenCalledTimes(1);
        expect(di.get).toHaveBeenCalledWith('QueryTest');
      });

      it('should call queryHandler.execute()', () => {
        expect(queryHandlerMock.execute).toHaveBeenCalledTimes(1);
        expect(queryHandlerMock.execute).toHaveBeenCalledWith(queryFixture);
      });

      it('should return an object', () => {
        expect(result).toStrictEqual(queryHandlerOutput);
      });
    });

    describe('when called and handler is cached', () => {
      let queryBus: QueryBus;
      let queryFixture: QueryTest;
      let queryHandlerOutput: AnyEntity;
      let result: unknown;

      beforeAll(async () => {
        queryBus = new QueryBus();
        queryFixture = new QueryTest();
        queryHandlerOutput = {};

        (queryHandlersByQueryType as Mocked<Map<string, string>>).get.mockReturnValueOnce(QueryTest.name);
        (di.get as Mocked<GlobalContainer>).mockReturnValueOnce(queryHandlerMock);
        queryHandlerMock.execute.mockResolvedValueOnce(queryHandlerOutput).mockResolvedValueOnce(queryHandlerOutput);

        await queryBus.execute(queryFixture);
        result = await queryBus.execute(queryFixture);
      });

      afterAll(() => {
        vi.clearAllMocks();
      });

      it('should call di.get() only once even after two execute calls', () => {
        expect(di.get).toHaveBeenCalledTimes(1);
        expect(di.get).toHaveBeenCalledWith('QueryTest');
      });

      it('should call queryHandler.execute() twice', () => {
        expect(queryHandlerMock.execute).toHaveBeenCalledTimes(2);
        expect(queryHandlerMock.execute).toHaveBeenNthCalledWith(1, queryFixture);
        expect(queryHandlerMock.execute).toHaveBeenNthCalledWith(2, queryFixture);
      });

      it('should return an object', () => {
        expect(result).toStrictEqual(queryHandlerOutput);
      });
    });
  });
});
