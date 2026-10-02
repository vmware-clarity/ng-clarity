/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { jsonSafe } from './json-safe';

describe('jsonSafe', () => {
  it('copies an own __proto__ key as data, leaving the result a plain object', () => {
    const parsed = JSON.parse('{"__proto__": {"polluted": true}, "name": "Ada"}');

    const safe = jsonSafe(parsed, 3) as Record<string, unknown>;

    expect(Object.getPrototypeOf(safe)).toBe(Object.prototype);
    expect(Object.keys(safe)).toEqual(['__proto__', 'name']);
    expect(JSON.stringify(safe)).toBe('{"__proto__":{"polluted":true},"name":"Ada"}');
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });

  it('drops functions, class instances and anything deeper than asked', () => {
    expect(jsonSafe({ a: 1, f: () => 1, d: new Date(0), deep: { deeper: { deepest: 1 } } }, 2)).toEqual({ a: 1 });
  });
});
