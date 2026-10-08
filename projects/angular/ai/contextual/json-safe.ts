/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** How deep a component's state, or a form control's value or errors, is kept. */
export const STATE_DEPTH = 3;

/** How deep a route's data is kept: a route says what it is in a level or two. */
export const ROUTE_DATA_DEPTH = 2;

/**
 * How deep an annotation a provider contributes is copied, counting the annotation
 * itself: its state keeps several levels of whatever the application describes.
 */
export const REGION_DEPTH = 10;

/**
 * Reduces a value to its JSON-serializable subset, dropping functions, class instances
 * and anything nested deeper than `depth`. Used wherever application data — route
 * configuration, a form control's value or errors — is put into a snapshot or a result,
 * where only plain values belong and a component reference or a factory would be useless
 * and potentially huge.
 *
 * Empty arrays and objects are dropped unless `keepEmpty` is set, which is what a
 * reported value needs: an empty selection is `[]`, not "nothing to say".
 */
export function jsonSafe(value: unknown, depth: number, keepEmpty = false): unknown {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (depth <= 0) {
    return undefined;
  }
  if (Array.isArray(value)) {
    const items = value.map(item => jsonSafe(item, depth - 1, keepEmpty)).filter(item => item !== undefined);
    return items.length || keepEmpty ? items : undefined;
  }
  if (typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      const serializable = jsonSafe(entry, depth - 1, keepEmpty);
      if (serializable !== undefined) {
        // Defined rather than assigned: an own `__proto__` key, which `JSON.parse` can
        // produce, would otherwise set the result's prototype instead of copying the key.
        Object.defineProperty(result, key, {
          value: serializable,
          enumerable: true,
          writable: true,
          configurable: true,
        });
      }
    }
    return Object.keys(result).length || keepEmpty ? result : undefined;
  }
  return undefined;
}
