/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { defineOwn } from './json-safe';

/** Most state keys one publisher can mark public. */
const MAX_PUBLIC_KEYS = 64;

/**
 * Picks the state an untrusted caller may see from what application code published: only the keys its
 * `publicKeys` lists, so a key nobody marked stays private. Anything left out marks the state `withheld`.
 */
export function publicState(
  published: Record<string, unknown>,
  state: Record<string, unknown>
): Record<string, unknown> {
  const listed = published['publicKeys'];
  // `redacted` only ever hides more, so it is honoured whether or not it is listed.
  const keys = new Set(['redacted', ...(Array.isArray(listed) ? listed.slice(0, MAX_PUBLIC_KEYS) : [])]);
  const shared: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(state)) {
    if (keys.has(key)) {
      defineOwn(shared, key, value);
    } else {
      shared['withheld'] = true;
    }
  }
  return shared;
}
