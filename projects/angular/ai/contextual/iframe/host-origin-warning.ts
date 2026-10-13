/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isDevMode } from '@angular/core';

let warned = false;

/**
 * In development, says once on the console that a request without `hostOrigin` trusts
 * whichever page embeds the frame: any site that can embed it can answer with a context
 * of its own making, and steer what consumes it.
 */
export function warnNoHostOrigin(): void {
  if (!warned && isDevMode()) {
    warned = true;
    console.warn(
      'clrRequestHostContext: no hostOrigin was given, so the context is accepted from whichever page embeds this ' +
        'frame. Pass the origin of the application expected to host it.'
    );
  }
}

/** Lets the next request without `hostOrigin` warn again. For specs only; not exported from the package. */
export function resetNoHostOriginWarning(): void {
  warned = false;
}
