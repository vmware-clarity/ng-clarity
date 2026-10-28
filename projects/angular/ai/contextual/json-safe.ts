/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { attempt } from './attempt';
import { truncate } from './dom/text';

export const STATE_DEPTH = 3;

export const ROUTE_DATA_DEPTH = 2;

export const REGION_DEPTH = 10;

/** Text and list budgets applied while reducing a value. */
export interface JsonSafeLimits {
  maxTextLength: number;
  maxItemsPerCollection: number;
}

/**
 * Reduces a value to its JSON-serializable subset, at most `depth` levels deep, with strings and arrays
 * cut to `limits` when given. Empty arrays and objects are dropped unless `keepEmpty` is set, and so is
 * a reference back to a value being reduced, so a `parent` pointer cannot copy the tree it points into.
 */
export function jsonSafe(value: unknown, depth: number, keepEmpty = false, limits?: JsonSafeLimits): unknown {
  return reduced(value, depth, keepEmpty, limits, new Set());
}

function reduced(
  value: unknown,
  depth: number,
  keepEmpty: boolean,
  limits: JsonSafeLimits | undefined,
  ancestors: Set<object>
): unknown {
  if (typeof value === 'string') {
    return limits ? truncate(value, limits.maxTextLength) : value;
  }
  if (value === null || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (depth <= 0 || typeof value !== 'object' || ancestors.has(value)) {
    return undefined;
  }
  ancestors.add(value);
  try {
    if (Array.isArray(value)) {
      const items = value
        .slice(0, limits?.maxItemsPerCollection)
        .map(item => reduced(item, depth - 1, keepEmpty, limits, ancestors))
        .filter(item => item !== undefined);
      return items.length || keepEmpty ? items : undefined;
    }
    if (!isPlainObject(value)) {
      return undefined;
    }
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
      // A throwing getter costs its own key, not the whole value.
      const entry = attempt(() => (value as Record<string, unknown>)[key], undefined);
      const serializable = reduced(entry, depth - 1, keepEmpty, limits, ancestors);
      if (serializable !== undefined) {
        defineOwn(result, key, serializable);
      }
    }
    return Object.keys(result).length || keepEmpty ? result : undefined;
  } finally {
    ancestors.delete(value);
  }
}

/** An object literal, `Object.create(null)` or one from another window (a frame); not a class instance. */
function isPlainObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || Object.getPrototypeOf(prototype) === null;
}

/** `JSON.stringify(value)` for comparing snapshots, or `null` when the value cannot be serialised. */
export function serialize(value: unknown): string | null {
  return attempt(() => JSON.stringify(value ?? null), null);
}

/** Defined rather than assigned: an own `__proto__` key from `JSON.parse` would otherwise set the prototype. */
export function defineOwn(target: object, key: string, value: unknown): void {
  Object.defineProperty(target, key, { value, enumerable: true, writable: true, configurable: true });
}
