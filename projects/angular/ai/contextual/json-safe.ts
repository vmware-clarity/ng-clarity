/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Reduces a value to its JSON-serializable subset, dropping functions, class instances
 * and anything nested deeper than `depth`. Used wherever application data — route
 * configuration, a form control's value or errors — is put into a snapshot or a result,
 * where only plain values belong and a component reference or a factory would be useless
 * and potentially huge.
 */
export function jsonSafe(value: unknown, depth: number): unknown {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (depth <= 0) {
    return undefined;
  }
  if (Array.isArray(value)) {
    const items = value.map(item => jsonSafe(item, depth - 1)).filter(item => item !== undefined);
    return items.length ? items : undefined;
  }
  if (typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      const serializable = jsonSafe(entry, depth - 1);
      if (serializable !== undefined) {
        result[key] = serializable;
      }
    }
    return Object.keys(result).length ? result : undefined;
  }
  return undefined;
}
