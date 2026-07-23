/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { SimpleVar, Var } from './var';

const testValue = 'value for testing';
const newTestValue = 'yet another value for testing';

interface NestedType {
  a: {
    b: string;
  };
}

describe('simple-var.spec', () => {
  it("test 'value' setter and getter", () => {
    const v = Var.of<string>();
    expect(v).toBeDefined();
    expect(v.value).toBeUndefined();

    v.value = testValue;
    expect(v.value).toEqual(testValue);
  });

  it("test 'isSet 'getter", () => {
    const v = <SimpleVar<string>>Var.of<string>();
    expect(v.isSet).toBeFalsy();

    v.value = testValue;
    expect(v.isSet).toBeTruthy();
  });

  it('value$ emits when value is set', () => {
    const v = Var.of<string>() as SimpleVar<string>;

    let result: any;
    const sub = v.value$.subscribe(val => (result = val));
    expect(result).toBeUndefined();

    // Set the 'value' and verify emitted value.
    v.value = testValue;
    expect(v.value).toEqual(testValue);
    expect(result).toEqual(testValue);

    // Set another value
    v.value = newTestValue;
    expect(v.value).toEqual(newTestValue);
    expect(result).toEqual(newTestValue);

    sub.unsubscribe();
  });

  it('value$ emits when nested object value is changed', () => {
    const v = Var.of<NestedType>() as SimpleVar<NestedType>;

    let result: string | undefined;
    const sub = v.value$.subscribe(val => (result = val.a.b));
    expect(result).toBeUndefined();

    // Set the 'value' and verify emitted value.
    v.value = { a: { b: testValue } };
    expect(result).toEqual(testValue);

    // Set nested property with another value
    v.value.a.b = newTestValue;
    v.updateValueIfDirty();
    expect(result).toEqual(newTestValue);
    sub.unsubscribe();
  });
});
