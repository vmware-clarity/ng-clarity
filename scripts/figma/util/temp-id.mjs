/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { randomUUID } from 'node:crypto';

/**
 * Generate a Figma temp ID.
 *
 * Figma temp IDs (e.g. `"temp-<uuid>"`) are only valid within the single POST
 * request that declares them; Figma only requires each one to be unique
 * within that request. Built on `crypto.randomUUID()` so uniqueness doesn't
 * depend on any shared counter state — no ID generator needs to be passed
 * around as a parameter, and nothing needs resetting between runs (e.g. tests).
 *
 * @returns {string} The next temp ID, e.g. `"temp-3fa85f64-5717-4562-b3fc-2c963f66afa6"`.
 *
 * @example
 * import { nextTempId } from '../util/temp-id.mjs';
 * const colId = nextTempId();
 * const modeId = nextTempId();
 */
export const nextTempId = () => `temp-${randomUUID()}`;
