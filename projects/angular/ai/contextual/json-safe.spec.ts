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

  it('keeps empty arrays and objects only when asked', () => {
    expect(jsonSafe({ list: [], map: {}, n: 0 }, 3)).toEqual({ n: 0 });
    expect(jsonSafe({ list: [], map: {}, n: 0 }, 3, true)).toEqual({ list: [], map: {}, n: 0 });
  });

  it('cuts strings and lists to the limits', () => {
    const limits = { maxTextLength: 5, maxItemsPerCollection: 2 };

    expect(jsonSafe({ text: 'abcdefgh', list: [1, 2, 3, 4] }, 3, false, limits)).toEqual({
      text: 'abcd…',
      list: [1, 2],
    });
  });

  it('drops a reference back to a value being reduced, but not a value seen twice side by side', () => {
    const shared = { id: 1 };
    const node: Record<string, unknown> = { name: 'root', left: shared, right: shared };
    node['self'] = node;

    expect(jsonSafe(node, 5)).toEqual({ name: 'root', left: { id: 1 }, right: { id: 1 } });
  });

  it('loses only the key whose getter throws', () => {
    const value = {
      name: 'Ada',
      get broken(): string {
        throw new Error('boom');
      },
    };

    expect(jsonSafe(value, 3)).toEqual({ name: 'Ada' });
  });

  it('keeps plain objects from another window and without a prototype', () => {
    const frame = document.createElement('iframe');
    document.body.appendChild(frame);
    try {
      const foreign = new (frame.contentWindow as Window & typeof globalThis).Object() as Record<string, unknown>;
      foreign['id'] = 7;
      const bare = Object.assign(Object.create(null), { id: 8 });

      expect(jsonSafe({ foreign, bare }, 3)).toEqual({ foreign: { id: 7 }, bare: { id: 8 } });
    } finally {
      frame.remove();
    }
  });
});
