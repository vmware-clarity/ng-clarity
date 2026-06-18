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
import { detectChanges, hasVariableChanged, buildReverseIdMap } from './variable-diff.mjs';
import { cssNameToFigmaName, figmaNameToCssName } from '../util/naming.mjs';
import { buildLookupMaps } from '../util/figma-response.mjs';
import { nextTempId } from '../util/temp-id.mjs';

/**
 * @typedef {{ field: string, from: string, to: string }} FieldChange
 * Describes a single field that changed within a variable update.
 *   field — human-readable field path, e.g. "value[Light]", "scopes", "codeSyntax.WEB"
 *   from  — formatted previous value
 *   to    — formatted new value
 */

/**
 * @typedef {{ action: 'create' | 'update' | 'retype', name: string, type: string, prevType?: string, changes?: FieldChange[] }} DiffEntry
 * Describes a single variable change for the human-readable diff output.
 *   create  — variable did not exist; it is being created.
 *   update  — variable already existed and at least one field differs.
 *             `changes` lists every field that was modified.
 *   retype  — variable existed with a different type; it was deleted and will
 *             be recreated.  `prevType` carries the old type.
 */

/**
 * Resolve the Figma variable ID for a token, queuing a DELETE when the existing
 * variable has a different type (Figma does not allow in-place type changes).
 *
 * This is the shared ID-assignment step used by both the regular-collection
 * pass 1 (which defers payload construction until mode values are known) and
 * {@link planVariableCreateOrUpdate} (which also pushes the payload immediately).
 *
 * @param {Object} p
 * @param {string} p.figmaName
 * @param {string} p.resolvedType
 * @param {Map<string, any>} p.existingVarByName
 * @param {Set<string>} p.deletedVarIds  Mutated: receives the deleted ID on type mismatch.
 * @param {any[]} p.payloadVars          Mutated: receives the DELETE entry on type mismatch.
 * @returns {{ varId: string, isUpdate: boolean, isRetype: boolean, existingVar: any, prevType: string|undefined }}
 */
function resolveVariableId({ figmaName, resolvedType, existingVarByName, deletedVarIds, payloadVars }) {
  const existingVar = existingVarByName.get(figmaName);
  const prevType = existingVar?.resolvedType;
  const isRetype = !!(existingVar && prevType !== resolvedType);

  if (isRetype) {
    deletedVarIds.add(existingVar.id);
    payloadVars.push({ action: 'DELETE', id: existingVar.id });
  }

  const isUpdate = !!(existingVar && !deletedVarIds.has(existingVar.id));
  const varId = isUpdate ? existingVar.id : nextTempId();

  return { varId, isUpdate, isRetype, existingVar, prevType };
}

/**
 * Plan a single variable: emit a CREATE or UPDATE payload entry using
 * {@link resolveVariableId} for the ID-assignment step.
 *
 * Used by the human-readable branch where mode values are known upfront
 * and no two-pass approach is needed.
 *
 * @param {Object} p
 * @param {string} p.figmaName  Figma-path variable name (slash-separated or display name).
 * @param {string} p.colId      Collection ID (real or temp).
 * @param {string} p.resolvedType  Figma variable type ('COLOR' | 'FLOAT' | 'STRING').
 * @param {string[]} p.scopes
 * @param {Record<string, string>} p.codeSyntax
 * @param {string} p.description
 * @param {boolean} p.hiddenFromPublishing
 * @param {Map<string, any>} p.existingVarByName
 * @param {Set<string>} p.deletedVarIds  Mutated: receives the deleted ID if applicable.
 * @param {any[]} p.payloadVars          Mutated: receives the DELETE + CREATE/UPDATE entry.
 * @returns {{ varId: string, isUpdate: boolean, diffEntry: DiffEntry }}
 */
function planVariableCreateOrUpdate({
  figmaName,
  colId,
  resolvedType,
  scopes,
  codeSyntax,
  description,
  hiddenFromPublishing,
  existingVarByName,
  deletedVarIds,
  payloadVars,
}) {
  const { varId, isUpdate, isRetype, prevType } = resolveVariableId({
    figmaName,
    resolvedType,
    existingVarByName,
    deletedVarIds,
    payloadVars,
  });

  payloadVars.push({
    action: isUpdate ? 'UPDATE' : 'CREATE',
    id: varId,
    name: figmaName,
    variableCollectionId: colId,
    resolvedType,
    scopes,
    codeSyntax,
    description,
    hiddenFromPublishing,
  });

  /** @type {DiffEntry} */
  const diffEntry = isRetype
    ? { action: 'retype', name: figmaName, type: resolvedType, prevType }
    : { action: isUpdate ? 'update' : 'create', name: figmaName, type: resolvedType };

  return { varId, isUpdate, diffEntry };
}

/**
 * Pre-populate idMap from existing Figma variables so that alias chains can be
 * resolved before any new variables are processed.
 *
 * This should be called once before the first {@link buildCollectionPlan} call.
 * After each collection is pushed and a fresh GET is made, call this again with
 * the updated variable list to replace temp IDs with real Figma IDs.
 *
 * @param {Array<{id: string, name: string, resolvedType: string}>} existingVars
 * @param {import('./id-map.mjs').IdMap} idMap
 */
export function populateIdMapFromExisting(existingVars, idMap) {
  for (const v of existingVars) {
    idMap.set(figmaNameToCssName(v.name), v.id, { type: v.resolvedType });
  }
}

/**
 * Builds the Figma Variables API payload for a **single** collection.
 *
 * The caller is responsible for:
 *   1. Pre-populating idMap with all pre-existing Figma variables before the
 *      first call (via {@link populateIdMapFromExisting}).
 *   2. After each collection push, fetching the current Figma variable list and
 *      calling {@link populateIdMapFromExisting} again so that subsequent
 *      collections' VARIABLE_ALIAS mode values reference real Figma IDs instead
 *      of temp IDs (which are only valid within the single POST request that
 *      created them).
 *
 * idMap is mutated in place: every variable processed by this function is
 * registered in idMap so intra-collection and cross-collection alias chains
 * resolve correctly.
 *
 * @param {Object} params
 * @param {import('./collections.mjs').CollectionDef} params.colDef
 * @param {string} params.collectionSuffix Branch isolation suffix (e.g. " [dev]").
 * @param {Map<string, any>} params.existingCollByName Map from collection name → Figma collection object.
 * @param {Array<{modeId: string, name: string, collectionId: string}>} params.existingModes
 * @param {Map<string, any>} params.existingVarByName Map from Figma variable name → variable object (globally unique names only; used by regular collections).
 * @param {Map<string, Map<string, any>>} params.varsByColId Per-collection variable map used by humanReadable collections to avoid name-collision with sibling collections.
 * @param {import('./id-map.mjs').IdMap} params.idMap Mutated in place.
 * @param {import('./token-rules.mjs').createTokenRules extends (...a: any) => infer R ? R : never} params.rules
 * @param {((name: string) => string | undefined) | null} [params.varLookup]
 * @returns {{
 *   payloadCollections: any[],
 *   payloadModes: any[],
 *   payloadVars: any[],
 *   payloadModeValues: any[],
 *   deletedVarIds: Set<string>,
 *   stats: { new: number, update: number, skipped: number },
 *   diff: DiffEntry[],
 * }}
 */
export function buildCollectionPlan({
  colDef,
  collectionSuffix,
  existingCollByName,
  existingModes,
  existingVarByName,
  varsByColId = new Map(),
  idMap,
  rules,
  varLookup = null,
}) {
  const { isExcluded, resolveFigmaScopes, buildCodeSyntax } = rules;

  /** Map from "collectionId/modeName" → modeId */
  const existingModeKey = (colId, modeName) =>
    existingModes.find(m => m.collectionId === colId && m.name === modeName)?.modeId;

  const payloadCollections = [];
  const payloadModes = [];
  const payloadVars = [];
  const payloadModeValues = [];
  const deletedVarIds = new Set();
  /** @type {DiffEntry[]} */
  const diff = [];

  let statsNew = 0;
  let statsUpdate = 0;
  let statsSkipped = 0;

  const colName = colDef.name + collectionSuffix;
  const existingCol = existingCollByName.get(colName);
  const colId = existingCol ? existingCol.id : nextTempId();
  const isNewCol = !existingCol;

  payloadCollections.push({
    action: isNewCol ? 'CREATE' : 'UPDATE',
    id: colId,
    name: colName,
    hiddenFromPublishing: colDef.hiddenFromPublishing,
  });

  // Ensure modes exist
  const modeIds = [];
  for (let mi = 0; mi < colDef.modes.length; mi++) {
    const modeName = colDef.modes[mi];
    const existingModeId = existingCol ? existingModeKey(existingCol.id, modeName) : undefined;

    if (existingModeId) {
      modeIds.push(existingModeId);
    } else {
      const newModeId = nextTempId();
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
    const modeIdToName = new Map(modeIds.map((id, i) => [id, colDef.modes[i]]));
    const reverseIdMap = buildReverseIdMap(idMap);

    // Scope variable lookups to this collection so that identical display names
    // in sibling humanReadable collections don't collide.
    // varsByColId is keyed by collection ID and preserves every variable
    // independently — unlike the global existingVarByName map which stores
    // only the last variable per name (last-write-wins across collections).
    const colVarByName = varsByColId.get(colId) ?? new Map();

    for (const [displayName, cssName] of colDef.humanReadableEntries) {
      if (isExcluded(cssName)) {
        continue;
      }

      const refId = idMap.get(cssName);
      if (!refId) {
        // Referenced token is not in idMap — usually a typo in the config or a
        // token that was excluded/never published.  Warn loudly so the empty
        // alias is not silently swallowed (which makes the whole collection
        // look "ignored"), and count it as skipped.
        console.warn(`    ⚠️   humanReadable "${displayName}" → ${cssName}: referenced token not found; skipping.`);
        statsSkipped++;
        continue;
      }

      const scopes = resolveFigmaScopes(cssName);
      const codeSyntax = buildCodeSyntax(cssName);
      const resolvedType = idMap.getMeta(refId)?.type ?? 'STRING';
      const aliasValue = { type: 'VARIABLE_ALIAS', id: refId };
      const description = `Alias of: ${cssName}`;

      // Skip if the variable already exists with the same type and identical values.
      const existingHrVar = colVarByName.get(displayName);
      if (existingHrVar && existingHrVar.resolvedType === resolvedType) {
        const newModeValues = modeIds.map(modeId => ({ modeId, value: aliasValue }));
        if (
          !hasVariableChanged(existingHrVar, {
            scopes,
            codeSyntax,
            description,
            hiddenFromPublishing: colDef.hiddenFromPublishing,
            newModeValues,
          })
        ) {
          continue;
        }
      }

      const { varId, isUpdate, diffEntry } = planVariableCreateOrUpdate({
        figmaName: displayName,
        colId,
        resolvedType,
        scopes,
        codeSyntax,
        description,
        hiddenFromPublishing: colDef.hiddenFromPublishing,
        existingVarByName: colVarByName,
        deletedVarIds,
        payloadVars,
      });

      if (isUpdate) {
        statsUpdate++;
        const newModeValues = modeIds.map(modeId => ({ modeId, value: aliasValue }));
        diffEntry.changes = detectChanges(existingHrVar, {
          scopes,
          codeSyntax,
          description,
          hiddenFromPublishing: colDef.hiddenFromPublishing,
          newModeValues,
          modeIdToName,
          reverseIdMap,
        });
      } else {
        statsNew++;
      }

      diff.push(diffEntry);

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
    //
    // Two passes are required so that intra-collection VARIABLE_ALIAS chains
    // resolve correctly regardless of CSS Map iteration order.  If token A's
    // dark-mode value is var(--token-B) and B happens to appear later in the
    // CSS Map, B won't be in idMap when A's mode values are resolved in a
    // single pass — resolveValue falls through to STRING and Figma rejects the
    // push with a type-mismatch error.  Pass 1 populates idMap for every token
    // in the collection first; pass 2 resolves mode values against the complete map.
    const baseSource = colDef.source(0);
    const tokenNames = [...baseSource.keys()].filter(n => colDef.filter(n) && !isExcluded(n));

    // ── Pass 1: assign IDs and populate idMap only ─────────────────────────
    // Payload pushes are deferred to pass 2 so that mode values — which require
    // a complete intra-collection idMap — are available for change detection
    // before deciding whether an UPDATE is actually necessary.
    /** @type {Array<{ cssName: string, figmaName: string, varId: string, baseValue: string, isUpdate: boolean, isRetype: boolean, existingVar: any, scopes: string[], codeSyntax: Record<string,string>, resolvedType: string, prevType: string|undefined }>} */
    const tokenEntries = [];

    for (const cssName of tokenNames) {
      const figmaName = cssNameToFigmaName(cssName);
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
      // Delegate DELETE-queueing, isRetype, isUpdate, and varId resolution to the
      // shared helper — payload construction is deferred to pass 2.
      const { varId, isUpdate, isRetype, existingVar, prevType } = resolveVariableId({
        figmaName,
        resolvedType,
        existingVarByName,
        deletedVarIds,
        payloadVars,
      });

      idMap.set(cssName, varId, { type: resolvedType });
      tokenEntries.push({
        cssName,
        figmaName,
        varId,
        baseValue,
        isUpdate,
        isRetype,
        existingVar,
        scopes,
        codeSyntax,
        resolvedType,
        prevType,
      });
    }

    // ── Pass 2: compute mode values, skip unchanged, push payloads ──────────
    const modeIdToName = new Map(modeIds.map((id, i) => [id, colDef.modes[i]]));
    // Built after pass 1 so that temp IDs for this collection's new variables are included.
    const reverseIdMap = buildReverseIdMap(idMap);

    for (const {
      cssName,
      figmaName,
      varId,
      baseValue,
      isUpdate,
      isRetype,
      existingVar,
      scopes,
      codeSyntax,
      resolvedType,
      prevType,
    } of tokenEntries) {
      const description = `CSS: ${cssName}`;

      // Compute new mode values now that all intra-collection tokens are in idMap.
      const newModeValues = [];
      for (let mi = 0; mi < colDef.modes.length; mi++) {
        const modeSource = colDef.source(mi);
        const rawValue = modeSource.get(cssName) ?? baseValue;
        const resolved = resolveValue(rawValue, idMap, varLookup, cssName);
        if (resolved.type === 'STRING' && rawValue.includes('var(') && rawValue.includes(',')) {
          continue;
        }
        newModeValues.push({ modeId: modeIds[mi], value: resolved.figmaValue });
      }

      // For existing (non-retyped) variables, skip if nothing actually changed.
      if (
        isUpdate &&
        !hasVariableChanged(existingVar, {
          scopes,
          codeSyntax,
          description,
          hiddenFromPublishing: colDef.hiddenFromPublishing,
          newModeValues,
        })
      ) {
        continue;
      }

      // Push variable payload.
      if (isUpdate) {
        payloadVars.push({
          action: 'UPDATE',
          id: varId,
          name: figmaName,
          variableCollectionId: colId,
          scopes,
          codeSyntax,
          description,
          hiddenFromPublishing: colDef.hiddenFromPublishing,
        });
        statsUpdate++;
        const changes = detectChanges(existingVar, {
          scopes,
          codeSyntax,
          description,
          hiddenFromPublishing: colDef.hiddenFromPublishing,
          newModeValues,
          modeIdToName,
          reverseIdMap,
        });
        diff.push({ action: 'update', name: figmaName, type: resolvedType, changes });
      } else {
        payloadVars.push({
          action: 'CREATE',
          id: varId,
          name: figmaName,
          variableCollectionId: colId,
          resolvedType,
          scopes,
          codeSyntax,
          description,
          hiddenFromPublishing: colDef.hiddenFromPublishing,
        });
        statsNew++;
        diff.push(
          isRetype
            ? { action: 'retype', name: figmaName, type: resolvedType, prevType }
            : { action: 'create', name: figmaName, type: resolvedType }
        );
      }

      // Push mode values.
      for (const { modeId, value } of newModeValues) {
        payloadModeValues.push({ variableId: varId, modeId, value });
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
    diff,
  };
}

/**
 * Builds the complete Figma Variables API payload for **all** collections in one shot.
 *
 * Intended for dry-run and extract modes where no Figma API calls are made and
 * temp IDs never need to be resolved to real ones.
 *
 * For push mode use {@link buildCollectionPlan} per collection and refresh idMap
 * from a GET response between each push so that cross-collection VARIABLE_ALIAS
 * values always carry real Figma IDs.
 *
 * @param {Object} params
 * @param {import('./collections.mjs').CollectionDef[]} params.collectionDefs
 * @param {string} params.collectionSuffix Branch isolation suffix (e.g. " [dev]").
 * @param {Array<{id: string, name: string}>} params.existingCollections
 * @param {Array<{modeId: string, name: string, collectionId: string}>} params.existingModes
 * @param {Array<{id: string, name: string, resolvedType: string}>} params.existingVars
 * @param {import('./id-map.mjs').IdMap} params.idMap
 * @param {import('./token-rules.mjs').createTokenRules extends (...a: any) => infer R ? R : never} params.rules
 * @param {((name: string) => string | undefined) | null} [params.varLookup]
 * @returns {{
 *   payloadCollections: any[],
 *   payloadModes: any[],
 *   payloadVars: any[],
 *   payloadModeValues: any[],
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
  const {
    collByName: existingCollByName,
    varByName: existingVarByName,
    varsByColId,
  } = buildLookupMaps(existingCollections, existingVars);

  populateIdMapFromExisting(existingVars, idMap);

  const payloadCollections = [];
  const payloadModes = [];
  const payloadVars = [];
  const payloadModeValues = [];
  const deletedVarIds = new Set();
  let statsNew = 0;
  let statsUpdate = 0;
  let statsSkipped = 0;

  for (const colDef of collectionDefs) {
    const colPlan = buildCollectionPlan({
      colDef,
      collectionSuffix,
      existingCollByName,
      existingModes,
      existingVarByName,
      varsByColId,
      idMap,
      rules,
      varLookup,
    });

    payloadCollections.push(...colPlan.payloadCollections);
    payloadModes.push(...colPlan.payloadModes);
    payloadVars.push(...colPlan.payloadVars);
    payloadModeValues.push(...colPlan.payloadModeValues);
    for (const id of colPlan.deletedVarIds) {
      deletedVarIds.add(id);
    }

    statsNew += colPlan.stats.new;
    statsUpdate += colPlan.stats.update;
    statsSkipped += colPlan.stats.skipped;
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
