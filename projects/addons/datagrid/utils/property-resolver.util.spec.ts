/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { getNestedProperty } from './property-resolver.util';

describe('getNestedProperty', () => {
  it('should return invalid for null/undefined item', () => {
    expect(getNestedProperty(null, 'a.b')).toEqual({ value: undefined, isValid: false });
    expect(getNestedProperty(undefined, 'a.b')).toEqual({ value: undefined, isValid: false });
  });

  it('should return invalid for empty/null propertyPath', () => {
    const item = { a: 1 };
    expect(getNestedProperty(item, '')).toEqual({ value: undefined, isValid: false });
    expect(getNestedProperty(item, null as any)).toEqual({ value: undefined, isValid: false });
  });

  it('should resolve a top-level property', () => {
    const item = { a: 1 };
    expect(getNestedProperty(item, 'a')).toEqual({ value: 1, isValid: true });
  });

  it('should resolve a nested property', () => {
    const item = { a: { b: { c: 'test' } } };
    expect(getNestedProperty(item, 'a.b.c')).toEqual({ value: 'test', isValid: true });
  });

  it('should correctly resolve falsy values if the path is valid', () => {
    const item = {
      emptyString: '',
      zero: 0,
      boolFalse: false,
      nullVal: null,
      undefinedVal: undefined,
    };
    expect(getNestedProperty(item, 'emptyString')).toEqual({ value: '', isValid: true });
    expect(getNestedProperty(item, 'zero')).toEqual({ value: 0, isValid: true });
    expect(getNestedProperty(item, 'boolFalse')).toEqual({ value: false, isValid: true });
    expect(getNestedProperty(item, 'nullVal')).toEqual({ value: null, isValid: true });
    expect(getNestedProperty(item, 'undefinedVal')).toEqual({ value: undefined, isValid: true });
  });

  it('should return invalid if a top-level property does not exist', () => {
    const item = { a: 1 };
    expect(getNestedProperty(item, 'b')).toEqual({ value: undefined, isValid: false });
  });

  it('should return invalid if a nested property does not exist', () => {
    const item = { a: { b: 1 } };
    expect(getNestedProperty(item, 'a.c')).toEqual({ value: undefined, isValid: false });
    expect(getNestedProperty(item, 'a.b.c')).toEqual({ value: undefined, isValid: false });
  });

  it('should return invalid if an intermediate property is null or undefined', () => {
    const item1 = { a: null };
    expect(getNestedProperty(item1, 'a.b')).toEqual({ value: undefined, isValid: false });

    const item2 = { a: undefined };
    expect(getNestedProperty(item2, 'a.b')).toEqual({ value: undefined, isValid: false });
  });

  it('should return invalid if an intermediate property is a primitive', () => {
    const item = { a: 'string' };
    expect(getNestedProperty(item, 'a.b')).toEqual({ value: undefined, isValid: false });
  });

  it('should resolve properties on the prototype chain', () => {
    class Parent {
      get id() {
        return 'parent-id';
      }
    }
    class Child extends Parent {
      name = 'child';
    }
    const item = new Child();

    expect(getNestedProperty(item, 'name')).toEqual({ value: 'child', isValid: true });
    expect(getNestedProperty(item, 'id')).toEqual({ value: 'parent-id', isValid: true });
  });
});
