/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** `fn()`, or `fallback` when it throws: page content and application callbacks must not break a snapshot. */
export function attempt<T, F>(fn: () => T, fallback: F): T | F {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export const TIMED_OUT = Symbol('timed out');

/** `promise`, or {@link TIMED_OUT} when it has not settled after `timeoutMs`. */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | typeof TIMED_OUT> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<typeof TIMED_OUT>(resolve => (timer = setTimeout(() => resolve(TIMED_OUT), timeoutMs)));
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
