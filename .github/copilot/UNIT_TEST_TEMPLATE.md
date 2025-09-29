# Unit Test Template and Requirements

## Mandatory Requirements

- The test file must be placed next to the file it tests, with the `.spec.ts` suffix.
- Use Vitest as the test runner.
- Mock all external dependencies, libraries, imported files, and object-type parameters using the approach shown in the example (with `vi.mock` and `Mocked<T>` for typing), to verify call counts and arguments.
- When mocking dependencies, always type them using `Mocked<T>` (from Vitest) where `T` is the interface or class being mocked, as shown in the example.
- Every call to functions or methods from libraries, imported files, or object-type parameters must be tested.
- All logical branches in the code must be covered by tests, including those triggered by different input states or dependency responses.
- All relevant error branches must be tested, including cases where dependencies return undefined or throw.
- If a dependency can be called multiple times in a logic branch, each call should be tested and verified (using call count and argument checks).
- If the class has internal state (e.g., a cache), its behavior should be tested by executing the public method multiple times and verifying the state and its effects, but without accessing private methods or properties directly.
- Tests must not use or access private methods or properties.
- When a logical branch depends on a parameter passed to the method or function under test, there must be a preceding `describe` block before the `when called` that explains the condition, e.g., `when called and ...`, followed by its corresponding `it` blocks.
- Group tests by class/method using `describe`.
- Clean up mocks and state with `afterAll` or `afterEach`.
- Use `expect` to define the expected behavior.
- Cover the main and relevant cases of the method/class.
- The test must be readable, maintainable, and easy to extend.
- If the method has side effects, explicitly check them.
- If the handler returns a value, the test name for return values should follow the convention: `should return {return type of handler}` (or the specific type returned by the handler).
- Do not include comments in the tests unless strictly necessary.
- Respect line spacing to clearly separate mocks, fixtures, and function/method calls.
- If dependencies have generics, use a type that satisfies the generic constraint, even if it is the basic type from which the generic extends.
- The afterAll block for cleaning up mocks (e.g., vi.clearAllMocks()) must be placed inside each `describe('when called ...')` block, immediately after its corresponding beforeAll, to ensure proper isolation and cleanup between logic branches.

- Always add a blank line between the definition of fixtures and the mocking of dependencies, and another blank line between the mocking of dependencies and the calls to methods or functions. This improves readability and maintains a clear structure in the test.

## Example Unit Test (returns value, advanced logic)

```typescript
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
  let queryBus: QueryBus;

  beforeAll(() => {
    queryHandlerMock = {
      execute: vi.fn(),
    };

    queryBus = new QueryBus();
  });

  describe('.execute()', () => {
    describe('when called and handler is not cached and queryHandlerName is undefined', () => {
      let queryFixture: QueryTest;
      let result: unknown;

      beforeAll(async () => {
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
      let queryFixture: QueryTest;
      let queryHandlerOutput: AnyEntity;
      let result: unknown;

      beforeAll(async () => {
        queryFixture = new QueryTest();
        queryHandlerOutput = {};

        (queryHandlersByQueryType as Mocked<Map<string, string>>).get.mockReturnValueOnce(QueryTest.name);
        (di as Mocked<GlobalContainer>).get.mockReturnValueOnce(queryHandlerMock);
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
      let queryFixture: QueryTest;
      let queryHandlerOutput: AnyEntity;
      let result: unknown;

      beforeAll(async () => {
        queryFixture = new QueryTest();
        queryHandlerOutput = {};

        (queryHandlersByQueryType as Mocked<Map<string, string>>).get
          .mockReturnValueOnce(QueryTest.name)
          .mockReturnValueOnce(undefined);
        (di as Mocked<GlobalContainer>).get.mockReturnValueOnce(queryHandlerMock);
        queryHandlerMock.execute.mockResolvedValueOnce(queryHandlerOutput).mockResolvedValueOnce(queryHandlerOutput);

        // To test the cache, we call it twice
        await queryBus.execute(queryFixture);
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
```

## Best Practices Checklist

- [x] The test is next to the file it tests and uses the `.spec.ts` suffix
- [x] All external dependencies, libraries, and object-type parameters are mocked
- [x] All relevant calls and their arguments are tested
- [x] All valid logic branches and error branches in the code are covered
- [x] Multiple calls to dependencies are tested and verified
- [x] Internal state (e.g., cache) is tested by executing the public method multiple times
- [x] Tests are grouped by condition and method using `describe`
- [x] Mocks are cleaned up with `afterAll` or `afterEach`
- [x] Expectations are clear and precise
- [x] Main and error cases are covered if applicable
- [x] If the handler returns a value, the test name for return values follows the convention: `should return {return type of handler}`
- [x] No comments are included unless strictly necessary
- [x] Line spacing is respected to separate mocks, fixtures, and function/method calls
- [x] Generic dependencies use a type that satisfies the generic constraint
