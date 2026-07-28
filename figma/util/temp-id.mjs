/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Singleton temp-ID counter shared across the entire module graph.
 *
 * Figma temp IDs (e.g. `"temp-1"`) are only valid within the single POST
 * request that declares them.  A process-wide counter guarantees that every
 * collection plan in a push run gets a globally unique ID, so cross-collection
 * VARIABLE_ALIAS mode values never collide — without any ID generator being
 * passed around as a parameter.
 *
 * Because Node.js caches modules, any file that imports {@link nextTempId}
 * shares the same counter automatically.
 *
 * @returns {string} The next temp ID, e.g. `"temp-1"`, `"temp-2"`, …
 *
 * @example
 * import { nextTempId } from '../util/temp-id.mjs';
 * const colId = nextTempId(); // "temp-1"
 * const modeId = nextTempId(); // "temp-2"
 */
let _n = 0;
export const nextTempId = () => `temp-${++_n}`;
