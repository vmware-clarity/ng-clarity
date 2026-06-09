/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Builds runtime Figma collection definitions from the config-driven
 * CollectionConfig array loaded by config.mjs.
 *
 * All structural knowledge (which CSS prefixes belong where, which modes exist,
 * which CSS variable map backs each mode) now lives in figma-tokens.config.json
 * rather than being hardcoded here. This module is a pure translator between
 * the config shape and the CollectionDef shape consumed by the planner.
 */

/**
 * @typedef {Object} CollectionDef
 * @property {string} name Collection display name.
 * @property {(name: string) => boolean} filter True if the token belongs here.
 * @property {string[]} modes Mode names; index 0 = default/base.
 * @property {(modeIndex: number) => Map<string, string>} source Variable values for a mode.
 * @property {Map<string, string> | undefined} [humanReadableEntries]
 *   Present only on humanReadable collections. Maps CSS variable name → display name.
 *   When present the planner iterates this map instead of the CSS source.
 */

/** @type {Record<import('./config.mjs').CssModeSource, keyof ModeVars>} */
const SOURCE_KEY = { root: 'rootVars', dark: 'darkVars', compact: 'compactVars' };

/**
 * @typedef {{ rootVars: Map<string, string>, darkVars: Map<string, string>, compactVars: Map<string, string> }} ModeVars
 */

/**
 * Translate the config-driven collection definitions into the CollectionDef
 * objects required by the planner.
 *
 * Each collection's `filter` uses prefix matching:
 *   - A token is included if it starts with any entry in `filter.include` (OR).
 *   - A token is excluded if it starts with any entry in `filter.exclude` (OR).
 *
 * Collections marked `humanReadable: true` in the config get a `humanReadableEntries`
 * map attached to their def. Their filter always returns false (no CSS tokens are
 * scanned directly); the planner populates them from the entries map instead.
 *
 * Each mode's `source` key maps to the matching parsed CSS variable map.
 *
 * @param {import('./config.mjs').CollectionConfig[]} collectionConfigs
 * @param {ModeVars} modeVars
 * @param {Record<string, string>} [humanReadableMap]
 *   The top-level `humanReadable` map from the config (display name → CSS var name).
 * @returns {CollectionDef[]}
 */
export function buildCollectionDefs(collectionConfigs, modeVars, humanReadableMap = {}) {
  return collectionConfigs.map(({ name, filter, modes, humanReadable }) => {
    /** @type {CollectionDef} */
    const def = {
      name,
      filter: cssName =>
        filter.include.some(p => cssName.startsWith(p)) && !filter.exclude.some(p => cssName.startsWith(p)),
      modes: modes.map(m => m.name),
      source: idx => modeVars[SOURCE_KEY[modes[idx].source]],
    };

    if (humanReadable) {
      def.humanReadableEntries = new Map(Object.entries(humanReadableMap));
    }

    return def;
  });
}
