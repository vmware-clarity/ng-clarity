/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export const STATE_DEPTH = 3;

export const ROUTE_DATA_DEPTH = 2;

export const REGION_DEPTH = 10;

/**
 * Reduces a value to its JSON-serializable subset, at most `depth` levels deep.
 * Empty arrays and objects are dropped unless `keepEmpty` is set.
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
        defineOwn(result, key, serializable);
      }
    }
    return Object.keys(result).length || keepEmpty ? result : undefined;
  }
  return undefined;
}

/** Defined rather than assigned: an own `__proto__` key from `JSON.parse` would otherwise set the prototype. */
export function defineOwn(target: object, key: string, value: unknown): void {
  Object.defineProperty(target, key, { value, enumerable: true, writable: true, configurable: true });
}
