/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Figma variable collection definitions.
 *
 * Maps the parsed CSS tokens into the set of Figma collections, each describing
 * which tokens belong to it, its mode names, and the value source per mode.
 */

/**
 * @typedef {Object} CollectionDef
 * @property {string} name Collection display name.
 * @property {(name: string) => boolean} filter True if the token belongs here.
 * @property {string[]} modes Mode names; index 0 = default/base.
 * @property {(modeIndex: number) => Map<string, string>} source Variable values for a mode.
 */

/**
 * Build the collection definitions bound to the resolved per-mode variable maps.
 *
 * @param {{ rootVars: Map<string, string>, darkVars: Map<string, string>, compactVars: Map<string, string> }} modeVars
 * @returns {CollectionDef[]}
 */
export function buildCollectionDefs({ rootVars, darkVars, compactVars }) {
  return [
    {
      name: 'CDS Global Colors',
      filter: n => /^--cds-global-color-/.test(n),
      modes: ['Value'],
      source: () => rootVars,
    },
    {
      name: 'CDS Global Space',
      filter: n => /^--cds-global-(space|layout)-/.test(n),
      modes: ['Value'],
      source: () => rootVars,
    },
    {
      name: 'CDS Theme',
      filter: n => /^--cds-alias-/.test(n),
      modes: ['Light', 'Dark'],
      source: idx => (idx === 0 ? rootVars : darkVars),
    },
    {
      name: 'CLR Density',
      filter: n => /^--clr-base-/.test(n),
      modes: ['Regular', 'Compact'],
      source: idx => (idx === 0 ? rootVars : compactVars),
    },
    {
      name: 'CLR Component',
      // Everything else with --clr- that didn't match the density filter
      filter: n => /^--clr-/.test(n) && !/^--clr-base-/.test(n),
      modes: ['Value'],
      source: () => rootVars,
    },
  ];
}
