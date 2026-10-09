/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * A URL without its query string and fragment, which routinely carry tenant and record
 * identifiers and occasionally credentials, for consumers that may see where a page is
 * but not everything its address encodes.
 */
export function stripQueryAndFragment(url: string): string {
  return url.split(/[?#]/)[0];
}
