import { describe, expect, it } from 'vitest';

import { queryHandler, queryHandlersByQueryType } from './queryHandler';

class TestQuery {}

@queryHandler(TestQuery)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestQueryHandler {}

describe('queryHandler decorator', () => {
  describe('when a handler is decorated', () => {
    it('should register the handler in queryHandlersByQueryType', () => {
      expect(queryHandlersByQueryType.get('TestQuery')).toBe('TestQueryHandler');
    });
  });
});
