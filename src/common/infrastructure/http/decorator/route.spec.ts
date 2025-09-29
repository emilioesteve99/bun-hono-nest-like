import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { route, routeOptionsByControllerAndMethodMap } from './route';
import { HttpMethod } from '../model/HttpMethod';

class TestController {
  @route({ method: HttpMethod.GET, path: '/test', version: 'v1' })
  public testRoute() {}
}

describe('@route()', () => {
  let controller: TestController;

  beforeAll(() => {
    controller = new TestController();
  });

  afterAll(() => {
    routeOptionsByControllerAndMethodMap.clear();
  });

  it('should register the route in routeOptionsByControllerAndMethodMap', () => {
    const key: string = `${controller.constructor.name}_testRoute`;
    expect(routeOptionsByControllerAndMethodMap.has(key)).toBe(true);
    expect(routeOptionsByControllerAndMethodMap.get(key)).toEqual({
      method: HttpMethod.GET,
      path: '/test',
      version: 'v1',
    });
  });
});
