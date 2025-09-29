import { BindToFluentSyntax } from 'inversify';
import { afterAll, beforeAll, describe, expect, it, Mocked, vi } from 'vitest';

import { GlobalContainer } from './GlobalContainer';
import { ClassProvider, NamedClassProvider, NamedValueProvider, ResolvedValueProvider } from './Provider';

class TestClass {}

describe('GlobalContainer', () => {
  let container: GlobalContainer;

  beforeAll(() => {
    container = new GlobalContainer();
  });

  describe('.bindMany', () => {
    let useClassProvider: ClassProvider;
    let namedClassProvider: NamedClassProvider;
    let useValueProvider: NamedValueProvider;
    let useResolvedValueProvider: ResolvedValueProvider;
    let bindToFluentSyntaxMock: Mocked<BindToFluentSyntax<any>>;

    beforeAll(() => {
      namedClassProvider = { provide: 'TestClass', useClass: TestClass };
      useClassProvider = TestClass;
      useValueProvider = { provide: 'TestValue', useValue: 42 };
      useResolvedValueProvider = {
        inject: ['dep1', 'dep2'],
        provide: 'TestResolved',
        useResolvedValue: vi.fn(),
      };

      bindToFluentSyntaxMock = {
        inSingletonScope: vi.fn().mockReturnThis(),
        to: vi.fn().mockReturnThis(),
        toConstantValue: vi.fn().mockReturnThis(),
        toResolvedValue: vi.fn().mockReturnThis(),
      } as unknown as Mocked<BindToFluentSyntax<any>>;
      vi.spyOn(container, 'bind').mockImplementation(() => bindToFluentSyntaxMock as any);

      container.bindMany([useClassProvider, namedClassProvider, useValueProvider, useResolvedValueProvider]);
    });

    afterAll(() => {
      vi.clearAllMocks();
    });

    it('should call .bind()', () => {
      expect(container.bind).toHaveBeenCalledTimes(4);
      expect(container.bind).toHaveBeenNthCalledWith(1, useClassProvider.name);
      expect(container.bind).toHaveBeenNthCalledWith(2, namedClassProvider.provide);
      expect(container.bind).toHaveBeenNthCalledWith(3, useValueProvider.provide);
      expect(container.bind).toHaveBeenNthCalledWith(4, useResolvedValueProvider.provide);
    });

    it('should call .to() for class providers', () => {
      expect(bindToFluentSyntaxMock.to).toHaveBeenCalledTimes(2);
      expect(bindToFluentSyntaxMock.to).toHaveBeenNthCalledWith(1, useClassProvider);
      expect(bindToFluentSyntaxMock.to).toHaveBeenNthCalledWith(2, namedClassProvider.useClass);
    });

    it('should call .toConstantValue() for value providers', () => {
      expect(bindToFluentSyntaxMock.toConstantValue).toHaveBeenCalledTimes(1);
      expect(bindToFluentSyntaxMock.toConstantValue).toHaveBeenCalledWith(useValueProvider.useValue);
    });

    it('should call .toResolvedValue() for resolved value providers', () => {
      expect(bindToFluentSyntaxMock.toResolvedValue).toHaveBeenCalledTimes(1);
      const callArgs: unknown[] = bindToFluentSyntaxMock.toResolvedValue.mock.calls[0] as unknown[];
      expect(typeof callArgs[0]).toBe('function');
      expect(callArgs[1]).toEqual(useResolvedValueProvider.inject);
    });
  });
});
