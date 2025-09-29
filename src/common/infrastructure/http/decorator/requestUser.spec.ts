import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { requestUser, requestUserMapByClassAndMethod } from './requestUser';

class TestController {
  public testMethod(@requestUser() _user: any) {}
}

describe('@requestUser()', () => {
  let controller: TestController;

  beforeAll(() => {
    controller = new TestController();
  });

  afterAll(() => {
    requestUserMapByClassAndMethod.clear();
  });

  it('should register key in requestUserMapByClassAndMethod', () => {
    const key: string = `${controller.constructor.name}_testMethod`;
    expect(requestUserMapByClassAndMethod.has(key)).toBe(true);
    expect(requestUserMapByClassAndMethod.get(key)).toEqual({ parameterIndex: 0 });
  });
});
