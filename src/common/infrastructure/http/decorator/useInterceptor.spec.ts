import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { interceptorsByControllerAndMethodMap, useInterceptor } from './useInterceptor';

class InterceptorA {}
class InterceptorB {}

class TestController {
  @useInterceptor(InterceptorA, InterceptorB)
  public testIntercepted() {}
}

describe('@useInterceptor()', () => {
  let controller: TestController;

  beforeAll(() => {
    controller = new TestController();
  });

  afterAll(() => {
    interceptorsByControllerAndMethodMap.clear();
  });

  it('should register key on interceptorsByControllerAndMethodMap', () => {
    const key: string = `${controller.constructor.name}_testIntercepted`;
    expect(interceptorsByControllerAndMethodMap.has(key)).toBe(true);
    expect(interceptorsByControllerAndMethodMap.get(key)).toEqual([InterceptorA, InterceptorB]);
  });
});
