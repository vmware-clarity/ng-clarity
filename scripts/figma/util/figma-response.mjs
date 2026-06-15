/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Helpers for parsing the Figma Variables REST API response shape.
 *
 * The `Object.values(response.meta?.variableCollections ?? {})` pattern
 * appears in multiple callers; centralising it here prevents drift if the
 * response shape ever changes.
 */

/**
 * Extract collections, variables, and modes from a Figma `/variables/local`
 * GET response into flat arrays.
 *
 * @param {Object} response Raw Figma API response.
 * @returns {{ collections: any[], vars: any[], modes: Array<{modeId: string, name: string, collectionId: string}> }}
 */
export function parseFigmaVarsResponse(response) {
  const collections = Object.values(response.meta?.variableCollections ?? {});
  const vars = Object.values(response.meta?.variables ?? {});
  const modes = collections.flatMap(c => c.modes.map(m => ({ ...m, collectionId: c.id })));
  return { collections, vars, modes };
}

/**
 * Build name-keyed lookup Maps from flat collection and variable arrays.
 *
 * @param {any[]} collections
 * @param {any[]} vars
 * @returns {{ collByName: Map<string, any>, varByName: Map<string, any> }}
 */
export function buildLookupMaps(collections, vars) {
  return {
    collByName: new Map(collections.map(c => [c.name, c])),
    varByName: new Map(vars.map(v => [v.name, v])),
  };
}
