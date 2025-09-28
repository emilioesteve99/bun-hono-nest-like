import { Newable } from 'inversify';

export type ClassProvider = Newable;

export type NamedClassProvider = {
  provide: symbol | string;
  useClass: Newable;
};

export type NamedValueProvider = {
  provide: symbol | string;
  useValue: unknown;
};

export type ResolvedValueProvider = {
  provide: symbol | string;
  useResolvedValue: (...args: any[]) => any;
  inject?: (string | symbol | Newable)[];
};

export type Provider = ClassProvider | NamedClassProvider | NamedValueProvider | ResolvedValueProvider;
