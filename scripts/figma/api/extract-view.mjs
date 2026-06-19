/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { figmaNameToCssName } from '../util/naming.mjs';
/**
 * Description prefix written by planner.mjs for human-readable alias variables.
 * Kept here as a constant so a format change in planner.mjs produces an obvious
 * compile-time (or grep-time) failure rather than a silent wrong cssVar output.
 */
export const ALIAS_DESCRIPTION_PREFIX = 'Alias of: ';

/**
 * Builds the human-readable, per-collection extract view of the push plan.
 *
 * Used by `--extract` mode to serialize the planned tokens (alongside the raw
 * Figma payload semantics) to a JSON file without making any API calls.
 */

/**
 * @param {Object} params
 * @param {import('./collections.mjs').CollectionDef[]} params.collectionDefs
 * @param {Object} params.plan Output of {@link import('./planner.mjs').buildPushPlan}.
 * @param {Array<{modeId: string, name: string, collectionId: string}>} params.existingModes
 * @param {string} params.source Relative path of the CSS source file.
 * @returns {Object} Serializable extract document.
 */
export function buildExtractView({ collectionDefs, plan, existingModes, source }) {
  const { payloadCollections, payloadModes, payloadVars, payloadModeValues, existingCollByName, stats } = plan;

  const collectionView = collectionDefs.map(colDef => {
    const existingCol = existingCollByName.get(colDef.name);
    const colId = existingCol ? existingCol.id : (payloadCollections.find(c => c.name === colDef.name)?.id ?? '?');

    // Resolve mode IDs once at the collection level so variable loops can reuse them.
    const modes = colDef.modes.map(modeName => {
      const modeEntry = payloadModes.find(m => m.variableCollectionId === colId && m.name === modeName);
      const existingModeObj = existingModes.find(m => m.collectionId === colId && m.name === modeName);
      return {
        id: modeEntry?.id ?? existingModeObj?.modeId ?? null,
        name: modeName,
      };
    });

    const variables = payloadVars
      .filter(v => v.variableCollectionId === colId && v.action !== 'DELETE')
      .map(v => {
        const varModeValues = payloadModeValues.filter(mv => mv.variableId === v.id);
        const valuesByMode = {};
        for (const mode of modes) {
          const mv = varModeValues.find(mv => mv.modeId === mode.id);
          if (mv) {
            valuesByMode[mode.name] = mv.value;
          }
        }
        // Human-readable alias variables store the source CSS var in the description
        // ("Alias of: --cds-…"); regular variables derive it from the Figma path.
        const cssVar = v.description?.startsWith(ALIAS_DESCRIPTION_PREFIX)
          ? v.description.slice(ALIAS_DESCRIPTION_PREFIX.length)
          : figmaNameToCssName(v.name);

        return {
          id: v.id,
          figmaName: v.name,
          cssVar,
          resolvedType: v.resolvedType,
          scopes: v.scopes,
          codeSyntax: v.codeSyntax,
          description: v.description,
          values: valuesByMode,
        };
      });

    return {
      id: colId,
      name: colDef.name,
      modes,
      variableCount: variables.length,
      variables,
    };
  });

  return {
    generated: new Date().toISOString(),
    source,
    summary: {
      collections: collectionDefs.length,
      totalVariables: stats.new + stats.update,
      skipped: stats.skipped,
      totalModeValues: payloadModeValues.length,
    },
    collections: collectionView,
  };
}
