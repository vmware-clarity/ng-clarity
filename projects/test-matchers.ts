/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { expect } from 'vitest';

/** Reject object shape differences that Jasmine checked but Vitest's loose equality ignores. */
export function sameObjectShape(actual: unknown, expected: unknown): false | undefined {
  if (
    Object.prototype.toString.call(actual) !== '[object Object]' ||
    Object.prototype.toString.call(expected) !== '[object Object]'
  ) {
    return undefined;
  }

  const actualConstructor = (actual as { constructor: unknown }).constructor;
  const expectedConstructor = (expected as { constructor: unknown }).constructor;
  if (
    actualConstructor !== expectedConstructor &&
    typeof actualConstructor === 'function' &&
    typeof expectedConstructor === 'function' &&
    actual instanceof actualConstructor &&
    expected instanceof expectedConstructor &&
    !(actualConstructor instanceof actualConstructor && expectedConstructor instanceof expectedConstructor)
  ) {
    return false;
  }

  const keys = (value: object) =>
    Reflect.ownKeys(value).filter(key => Object.prototype.propertyIsEnumerable.call(value, key));
  const actualKeys = keys(actual as object);
  const expectedKeys = keys(expected as object);
  if (
    actualKeys.length !== expectedKeys.length ||
    actualKeys.some(key => !Object.prototype.hasOwnProperty.call(expected, key))
  ) {
    return false;
  }
  return undefined;
}

/** Preserve the error type and exact message checks of Jasmine's toThrowError. */
export function errorLike(message?: string): ReturnType<typeof expect.any> {
  return {
    asymmetricMatch(actual: unknown): boolean {
      if (!actual) {
        return false;
      }
      const error = actual as { message?: unknown; stack?: unknown };
      const isError = actual instanceof Error || (typeof error.message === 'string' && typeof error.stack === 'string');
      return isError && (message === undefined || error.message === message);
    },
    toString: () => 'ErrorLike',
    toAsymmetricMatcher: () => (message === undefined ? 'ErrorLike' : `ErrorLike(${JSON.stringify(message)})`),
  };
}
