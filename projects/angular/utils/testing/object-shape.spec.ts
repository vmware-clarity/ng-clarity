/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

class Model {
  value: unknown = undefined;
}

class OtherModel {
  value: unknown = undefined;
}

describe('Object equality compatibility', () => {
  it('distinguishes an undefined own property from a missing property', () => {
    expect({ value: undefined }).not.toEqual({});
    expect({}).not.toEqual({ value: undefined });
  });

  it('distinguishes class instances from plain objects and different classes', () => {
    expect(new Model()).not.toEqual({ value: undefined });
    expect(new Model()).not.toEqual(new OtherModel());
    expect(new Model()).toEqual(new Model());
  });

  it('checks class identity inside nested arrays and objects', () => {
    expect({ changes: [new Model()] }).not.toEqual({ changes: [{ value: undefined }] });
  });

  it('checks object shapes in mock arguments', () => {
    const callback = vi.fn();
    callback({ value: undefined });
    expect(callback).not.toHaveBeenCalledWith(new Model());
    expect(callback).not.toHaveBeenCalledWith({});
    expect(callback).toHaveBeenCalledWith({ value: undefined });
  });

  it('still compares values after accepting matching object shapes', () => {
    expect({ value: 1 }).not.toEqual({ value: 2 });
    expect({ value: 1 }).toEqual({ value: 1 });
  });

  it('preserves sparse array equality', () => {
    expect(Array(1)).toEqual([undefined]);
  });

  it('preserves intentionally partial object matching', () => {
    expect({ value: 1, extra: undefined }).toEqual(expect.objectContaining({ value: 1 }));
  });

  it('checks enumerable symbol properties and ignores nonenumerable properties', () => {
    const key = Symbol('key');
    expect({ [key]: undefined }).not.toEqual({});
    expect(Object.defineProperty({}, 'hidden', { value: 1 })).toEqual({});
  });
});
