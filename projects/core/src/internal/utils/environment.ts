/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isNil } from '../utils/identity.js';

export function isBrowser(win = window) {
  return !isNil(win);
}

export function isJestTest() {
  return (globalThis as any)?.process?.env?.JEST_WORKER_ID !== undefined;
}

export function isJsdomTest() {
  // This is to avoid breaking existing usage: prior to the addition of this function, isJestTest()
  // was used to determine whether the execution environment was a test using Jsdom.
  if (isJestTest()) {
    return true;
  }
  return (globalThis as any)?.process?.env?.NODE_ENV === 'test' && navigator?.userAgent?.includes('jsdom');
}
