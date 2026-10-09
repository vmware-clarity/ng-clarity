/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * The entry a table itself defines for `key`, or `undefined`.
 *
 * Roles, tag names and input types come from page markup, and a plain object also answers
 * to the names it inherits: `role="constructor"` or `role="hasOwnProperty"` would otherwise
 * look up a function of `Object.prototype`.
 */
export function ownEntry<T>(table: Readonly<Record<string, T>>, key: string): T | undefined {
  return Object.hasOwn(table, key) ? table[key] : undefined;
}
