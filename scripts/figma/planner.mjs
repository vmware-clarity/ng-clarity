/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Builds the Figma Variables API payload (the "push plan") by diffing the parsed
 * CSS tokens against the existing Figma variables/collections/modes.
 *
 * Pure with respect to the network: produces the create/update/delete payload
 * arrays and statistics; the actual API calls live in the orchestrator.
 */

import { inferType, resolveValue } from './value-converters.mjs';

/**
 * @param {Object} params
 * @param {import('./collections.mjs').CollectionDef[]} params.collectionDefs
 * @param {string} params.collectionSuffix Branch isolation suffix (e.g. " [dev]").
 * @param {Array<{id: string, name: string}>} params.existingCollections
 * @param {Array<{modeId: string, name: string, collectionId: string}>} params.existingModes
 * @param {Array<{id: string, name: string, resolvedType: string}>} params.existingVars
 * @param {import('./id-map.mjs').IdMap} params.idMap
 * @param {import('./token-rules.mjs').createTokenRules extends (...a: any) => infer R ? R : never} params.rules
 * @param {((name: string) => string | undefined) | null} [params.varLookup]
 *   Full CSS variable map lookup (e.g. `rootVars.get.bind(rootVars)`) used to
 *   recursively resolve calc expressions that reference CSS custom properties.
 * @returns {{
 *   payloadCollections: any[],
 *   payloadModes: any[],
 *   payloadVars: any[],
 *   deletedVarIds: Set<string>,
 *   stats: { new: number, update: number, skipped: number },
 *   existingCollByName: Map<string, any>,
 * }}
 */
export function buildPushPlan({
  collectionDefs,
  collectionSuffix,
  existingCollections,
  existingModes,
  existingVars,
  idMap,
  rules,
  varLookup = null,
}) {
  const { isExcluded, resolveFigmaScopes, buildCodeSyntax } = rules;

  const tempIdCounter = { n: 0 };
  const tempId = () => `temp-${++tempIdCounter.n}`;

  /** Map from existing collection name → collection object */
  const existingCollByName = new Map(existingCollections.map(c => [c.name, c]));
  /** Map from "collectionId/modeName" → modeId */
  const existingModeKey = (colId, modeName) =>
    existingModes.find(m => m.collectionId === colId && m.name === modeName)?.modeId;
  /** Map from variableName → variable */
  const existingVarByName = new Map(existingVars.map(v => [v.name, v]));

  // Pre-populate idMap from existing Figma variables (so alias chains resolve)
  for (const v of existingVars) {
    const cssName = '--' + v.name.replace(/\//g, '-');
    idMap.set(cssName, v.id, { type: v.resolvedType });
  }

  const payloadCollections = [];
  const payloadModes = [];
  const payloadVars = [];
  const payloadModeValues = [];
  const deletedVarIds = new Set();

  let statsNew = 0;
  let statsUpdate = 0;
  let statsSkipped = 0;

  for (const colDef of collectionDefs) {
    const colName = colDef.name + collectionSuffix;
    const existingCol = existingCollByName.get(colName);
    const colId = existingCol ? existingCol.id : tempId();
    const isNewCol = !existingCol;

    payloadCollections.push(
      isNewCol ? { action: 'CREATE', id: colId, name: colName } : { action: 'UPDATE', id: colId, name: colName }
    );

    // Ensure modes exist
    const modeIds = [];
    for (let mi = 0; mi < colDef.modes.length; mi++) {
      const modeName = colDef.modes[mi];
      const existingModeId = existingCol ? existingModeKey(existingCol.id, modeName) : undefined;

      if (existingModeId) {
        modeIds.push(existingModeId);
      } else if (isNewCol && mi === 0) {
        // For new collections, Figma auto-creates one mode ("Mode 1") — we rename it
        const autoModeId = tempId();
        modeIds.push(autoModeId);
        payloadModes.push({
          action: 'CREATE',
          id: autoModeId,
          name: modeName,
          variableCollectionId: colId,
        });
      } else {
        const newModeId = tempId();
        modeIds.push(newModeId);
        payloadModes.push({
          action: 'CREATE',
          id: newModeId,
          name: modeName,
          variableCollectionId: colId,
        });
      }
    }

    if (colDef.humanReadableEntries) {
      // Human-readable alias collection: each entry creates a VARIABLE_ALIAS
      // that points to the corresponding already-published semantic token.
      // The Figma variable name is the display name; the value is a VARIABLE_ALIAS.
      for (const [cssName, displayName] of colDef.humanReadableEntries) {
        if (isExcluded(cssName)) {
          continue;
        }

        const refId = idMap.get(cssName);
        if (!refId) {
          continue; // Referenced token not yet in idMap; skip
        }

        const figmaName = displayName;
        const scopes = resolveFigmaScopes(cssName);
        const codeSyntax = buildCodeSyntax(cssName);
        const resolvedType = idMap.getMeta(refId)?.type ?? 'STRING';
        const aliasValue = { type: 'VARIABLE_ALIAS', id: refId };

        const existingVar = existingVarByName.get(figmaName);

        // Fix type-mismatched variables: delete + recreate
        if (existingVar && existingVar.resolvedType !== resolvedType) {
          deletedVarIds.add(existingVar.id);
          payloadVars.push({ action: 'DELETE', id: existingVar.id });
        }

        const varId = existingVar && !deletedVarIds.has(existingVar.id) ? existingVar.id : tempId();

        if (existingVar && !deletedVarIds.has(existingVar.id)) {
          payloadVars.push({
            action: 'UPDATE',
            id: varId,
            name: figmaName,
            variableCollectionId: colId,
            scopes,
            codeSyntax,
            description: `Alias of: ${cssName}`,
          });
          statsUpdate++;
        } else {
          payloadVars.push({
            action: 'CREATE',
            id: varId,
            name: figmaName,
            variableCollectionId: colId,
            resolvedType,
            scopes,
            codeSyntax,
            description: `Alias of: ${cssName}`,
          });
          statsNew++;
        }

        // All modes share the same VARIABLE_ALIAS value
        for (let mi = 0; mi < colDef.modes.length; mi++) {
          payloadModeValues.push({
            variableId: varId,
            modeId: modeIds[mi],
            value: aliasValue,
          });
        }
      }
    } else {
      // Regular collection: scan the CSS source and emit one variable per token.
      const baseSource = colDef.source(0);
      const tokenNames = [...baseSource.keys()].filter(n => colDef.filter(n) && !isExcluded(n));

      for (const cssName of tokenNames) {
        const figmaName = cssName.replace(/^--/, '').replace(/-/g, '/');
        const scopes = resolveFigmaScopes(cssName);
        const codeSyntax = buildCodeSyntax(cssName);

        const baseValue = baseSource.get(cssName) ?? '';
        const baseResolved = resolveValue(baseValue, idMap, varLookup, cssName);

        // Skip tokens whose value is a complex multi-value string (calc chains, etc.)
        if (baseResolved.type === 'STRING' && baseValue.includes('var(') && baseValue.includes(',')) {
          statsSkipped++;
          continue;
        }

        const resolvedType = inferType(cssName, baseValue, idMap, varLookup).type;

        const existingVar = existingVarByName.get(figmaName);

        // Fix type-mismatched variables: delete + recreate
        if (existingVar && existingVar.resolvedType !== resolvedType) {
          deletedVarIds.add(existingVar.id);
          payloadVars.push({ action: 'DELETE', id: existingVar.id });
        }

        const varId = existingVar && !deletedVarIds.has(existingVar.id) ? existingVar.id : tempId();
        idMap.set(cssName, varId, { type: resolvedType });

        if (existingVar && !deletedVarIds.has(existingVar.id)) {
          payloadVars.push({
            action: 'UPDATE',
            id: varId,
            name: figmaName,
            variableCollectionId: colId,
            scopes,
            codeSyntax,
            description: `CSS: ${cssName}`,
          });
          statsUpdate++;
        } else {
          payloadVars.push({
            action: 'CREATE',
            id: varId,
            name: figmaName,
            variableCollectionId: colId,
            resolvedType,
            scopes,
            codeSyntax,
            description: `CSS: ${cssName}`,
          });
          statsNew++;
        }

        // Mode values
        for (let mi = 0; mi < colDef.modes.length; mi++) {
          const modeSource = colDef.source(mi);
          const rawValue = modeSource.get(cssName) ?? baseValue;
          const resolved = resolveValue(rawValue, idMap, varLookup, cssName);
          if (resolved.type === 'STRING' && rawValue.includes('var(') && rawValue.includes(',')) {
            continue;
          }
          payloadModeValues.push({
            variableId: varId,
            modeId: modeIds[mi],
            value: resolved.figmaValue,
          });
        }
      }
    }
  }

  return {
    payloadCollections,
    payloadModes,
    payloadVars,
    payloadModeValues,
    deletedVarIds,
    stats: { new: statsNew, update: statsUpdate, skipped: statsSkipped },
    existingCollByName,
  };
}
