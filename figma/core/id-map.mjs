/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Name → Figma variable id map with per-id metadata.
 *
 * Tracks the mapping from CSS variable name to Figma variable id (so alias chains
 * resolve) alongside the resolved type metadata used during type inference.
 */

/**
 * @typedef {Object} IdMap
 * @property {(name: string) => string | undefined} get
 * @property {(name: string, id: string, meta?: { type: string }) => void} set
 * @property {(name: string) => boolean} has
 * @property {(id: string) => { type: string } | undefined} getMeta
 * @property {() => IterableIterator<[string, string]>} entries
 */

/**
 * Create an empty id map.
 *
 * @returns {IdMap}
 */
export function createIdMap() {
  const nameToId = new Map();
  const idMeta = new Map();
  return {
    get: name => nameToId.get(name),
    set: (name, id, meta) => {
      nameToId.set(name, id);
      if (meta) {
        idMeta.set(id, meta);
      }
    },
    has: name => nameToId.has(name),
    getMeta: id => idMeta.get(id),
    entries: () => nameToId.entries(),
  };
}
