/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Builds the human-readable, per-collection extract view of the push plan.
 *
 * Used by `--extract` mode to serialize the planned tokens (alongside the raw
 * Figma payload semantics) to a JSON file without making any API calls.
 */

/**
 * @param {Object} params
 * @param {import('./collections.mjs').CollectionDef[]} params.collectionDefs
 * @param {string} params.collectionSuffix
 * @param {Object} params.plan Output of {@link import('./planner.mjs').buildPushPlan}.
 * @param {Array<{modeId: string, name: string, collectionId: string}>} params.existingModes
 * @param {string | null} params.branchName
 * @param {string} params.source Relative path of the CSS source file.
 * @returns {Object} Serializable extract document.
 */
export function buildExtractView({ collectionDefs, collectionSuffix, plan, existingModes, branchName, source }) {
  const { payloadCollections, payloadModes, payloadVars, payloadModeValues, existingCollByName, stats } = plan;

  // Build a human-readable per-collection view alongside the raw Figma payload
  const modeIdToName = new Map();
  for (const m of payloadModes) {
    modeIdToName.set(m.id, m.name);
  }
  // For existing modes (not in payloadModes) we need a lookup from existingModes
  for (const em of existingModes) {
    modeIdToName.set(em.modeId, em.name);
  }

  const collectionView = collectionDefs.map(colDef => {
    const existingCol = existingCollByName.get(colDef.name + collectionSuffix);
    const colId = existingCol
      ? existingCol.id
      : (payloadCollections.find(c => c.name === colDef.name + collectionSuffix)?.id ?? '?');

    // Resolve mode IDs once at the collection level so variable loops can reuse them.
    const modes = colDef.modes.map(modeName => {
      const modeEntry = payloadModes.find(m => m.variableCollectionId === colId && m.name === modeName);
      const existingModeObj = existingModes.find(m => m.collectionId === colId && m.name === modeName);
      return { id: modeEntry?.id ?? existingModeObj?.modeId ?? null, name: modeName };
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
        const cssName = v.description?.startsWith('Alias of: ')
          ? v.description.slice('Alias of: '.length)
          : '--' + v.name.replace(/\//g, '-');
        return {
          id: v.id,
          figmaPath: v.name,
          cssVar: cssName,
          resolvedType: v.resolvedType,
          scopes: v.scopes,
          codeSyntax: v.codeSyntax,
          description: v.description,
          values: valuesByMode,
        };
      });

    return {
      id: colId,
      name: colDef.name + collectionSuffix,
      modes,
      variableCount: variables.length,
      variables,
    };
  });

  return {
    generated: new Date().toISOString(),
    source,
    branch: branchName ?? null,
    summary: {
      collections: collectionDefs.length,
      totalVariables: stats.new + stats.update,
      skipped: stats.skipped,
      totalModeValues: payloadModeValues.length,
    },
    collections: collectionView,
  };
}
