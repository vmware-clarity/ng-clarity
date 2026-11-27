/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isDevMode } from '@angular/core';

let warned = false;

/** Warns once in development: without `hostOrigin`, any site embedding the frame can answer with its own context. */
export function warnNoHostOrigin(): void {
  if (!warned && isDevMode()) {
    warned = true;
    console.warn(
      'clrRequestHostContext: no hostOrigin was given, so the context is accepted from whichever page embeds this ' +
        'frame. Pass the origin of the application expected to host it.'
    );
  }
}

/** For specs only; not exported from the package. */
export function resetNoHostOriginWarning(): void {
  warned = false;
}
