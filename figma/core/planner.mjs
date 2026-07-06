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
 * @typedef {{ action: 'create' | 'update' | 'deprecate', name: string, type: string, prevType?: string, changes?: FieldChange[] }} DiffEntry
 * Describes a single variable change for the human-readable diff output.
 *   create    — variable did not exist; it is being created.
 *   update    — variable already existed and at least one field differs.
 *               `changes` lists every field that was modified.
 *   deprecate — variable existed with a different type; the old variable is
 *               renamed to `<name>_deprecated` for Figma users to review, and
 *               a new variable with the correct type is created.
 *               `prevType` carries the old type.
 */

/**
 * Resolve the Figma variable ID for a token, queuing a rename-to-deprecated when
 * the existing variable has a different type (Figma does not allow in-place type
 * changes).  The old variable is renamed to `<figmaName>_deprecated` so Figma
 * users can review and clean it up; a new variable with the correct type is
 * created under the original name.
 *
 * This is the shared ID-assignment step used by both the regular-collection
 * pass 1 (which defers payload construction until mode values are known) and
 * {@link planVariableCreateOrUpdate} (which also pushes the payload immediately).
 *
 * @param {Object} p
 * @param {string} p.figmaName
 * @param {string} p.resolvedType
 * @param {Map<string, any>} p.existingVarByName
 * @param {Set<string>} p.deprecatedVarIds  Mutated: receives the old ID on type mismatch so pass 2 does not re-process it.
 * @param {any[]} p.payloadVars          Mutated: receives the rename UPDATE entry on type mismatch.
 * @returns {{ varId: string, isUpdate: boolean, isRetype: boolean, existingVar: any, prevType: string|undefined }}
 */
function resolveVariableId({ figmaName, resolvedType, existingVarByName, deprecatedVarIds, payloadVars }) {
  const existingVar = existingVarByName.get(figmaName);
  const prevType = existingVar?.resolvedType;
  const isRetype = !!(existingVar && prevType !== resolvedType);

  if (isRetype) {
    deprecatedVarIds.add(existingVar.id);
    payloadVars.push({
      action: 'UPDATE',
      id: existingVar.id,
      name: `${figmaName}_deprecated`,
      variableCollectionId: existingVar.variableCollectionId,
    });
  }

  const isUpdate = !!(existingVar && !deprecatedVarIds.has(existingVar.id));
  const varId = isUpdate ? existingVar.id : nextTempId();

  return { varId, isUpdate, isRetype, existingVar, prevType };
}

/**
 * Per-collection context threaded through the variable-planning helpers below
 * instead of repeating the same handful of arguments for every variable in
 * the collection — every field here is constant for the whole collection.
 *
 * @typedef {Object} CollectionPlanContext
 * @property {string} colId
 * @property {boolean} hiddenFromPublishing
 * @property {any[]} payloadVars   Mutated: receives CREATE/UPDATE entries.
 * @property {DiffEntry[]} diff    Mutated: receives one entry per planned variable.
 * @property {{ new: number, update: number, skipped: number }} stats  Mutated: `new`/`update` incremented.
 * @property {Map<string, string>} modeIdToName
 * @property {Map<string, string>} reverseIdMap
 * @property {Map<string, any>} existingVarByName  Only read by {@link planVariableCreateOrUpdate}.
 * @property {Set<string>} deprecatedVarIds        Only written by {@link planVariableCreateOrUpdate} (via {@link resolveVariableId}) on retype.
 */

/**
 * Build and push the CREATE/UPDATE payload entry for a variable whose ID has
 * already been resolved via {@link resolveVariableId}, then record its diff
 * entry (computing `changes` via {@link detectChanges} when it's an update)
 * and bump `ctx.stats.new`/`ctx.stats.update` accordingly.
 *
 * Shared by {@link planVariableCreateOrUpdate} (human-readable branch, which
 * resolves and builds in the same step) and the regular-collection pass 2
 * (which resolves in pass 1 and only builds the payload here, once mode
 * values are known). `resolvedType` is always included in the payload, even
 * for UPDATE: Figma variable types are immutable, so a genuine UPDATE never
 * actually changes it — a real retype always forces `isUpdate: false` (see
 * {@link resolveVariableId}) and goes through the CREATE branch instead.
 *
 * @param {CollectionPlanContext} ctx
 * @param {Object} variable
 * @param {string} variable.figmaName  Figma-path variable name (slash-separated or display name).
 * @param {string} variable.resolvedType  Figma variable type ('COLOR' | 'FLOAT' | 'STRING').
 * @param {string[]} variable.scopes
 * @param {Record<string, string>} variable.codeSyntax
 * @param {string} variable.description
 * @param {string} variable.varId
 * @param {boolean} variable.isUpdate
 * @param {boolean} variable.isRetype
 * @param {string|undefined} variable.prevType
 * @param {any} variable.existingVar  Pre-existing Figma variable object; only read when `isUpdate`.
 * @param {Array<{modeId: string, value: any}>} variable.newModeValues  Only read when `isUpdate`.
 * @returns {string} varId
 */
function pushVariablePayload(ctx, variable) {
  const { colId, hiddenFromPublishing, payloadVars, diff, stats, modeIdToName, reverseIdMap } = ctx;
  const {
    figmaName,
    resolvedType,
    scopes,
    codeSyntax,
    description,
    varId,
    isUpdate,
    isRetype,
    prevType,
    existingVar,
    newModeValues,
  } = variable;

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

  const diffEntry = isRetype
    ? { action: 'deprecate', name: figmaName, type: resolvedType, prevType }
    : { action: isUpdate ? 'update' : 'create', name: figmaName, type: resolvedType };

  if (isUpdate) {
    stats.update++;
    diffEntry.changes = detectChanges(existingVar, {
      scopes,
      codeSyntax,
      description,
      hiddenFromPublishing,
      newModeValues,
      modeIdToName,
      reverseIdMap,
    });
  } else {
    stats.new++;
  }
  diff.push(diffEntry);

  return varId;
}

/**
 * Plan a single variable: resolve its ID via {@link resolveVariableId} and emit
 * a CREATE or UPDATE payload entry via {@link pushVariablePayload}.
 *
 * Used by the human-readable branch where mode values are known upfront
 * and no two-pass approach is needed.
 *
 * @param {CollectionPlanContext} ctx
 * @param {Object} variable
 * @param {string} variable.figmaName  Figma-path variable name (slash-separated or display name).
 * @param {string} variable.resolvedType  Figma variable type ('COLOR' | 'FLOAT' | 'STRING').
 * @param {string[]} variable.scopes
 * @param {Record<string, string>} variable.codeSyntax
 * @param {string} variable.description
 * @param {Array<{modeId: string, value: any}>} variable.newModeValues  Only read when the variable already exists.
 * @returns {string} varId
 */
function planVariableCreateOrUpdate(ctx, variable) {
  const { figmaName, resolvedType } = variable;
  const { varId, isUpdate, isRetype, existingVar, prevType } = resolveVariableId({
    figmaName,
    resolvedType,
    existingVarByName: ctx.existingVarByName,
    deprecatedVarIds: ctx.deprecatedVarIds,
    payloadVars: ctx.payloadVars,
  });

  return pushVariablePayload(ctx, { ...variable, varId, isUpdate, isRetype, existingVar, prevType });
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
 *   deprecatedVarIds: Set<string>,
 *   stats: { new: number, update: number, skipped: number },
 *   diff: DiffEntry[],
 * }}
 */
export function buildCollectionPlan({
  colDef,
  existingCollByName,
  existingModes,
  existingVarByName,
  varsByColId = new Map(),
  idMap,
  rules,
  varLookup = null,
}) {
  const { hiddenFromPublishing } = colDef;

  /** Map from "collectionId/modeName" → modeId */
  const existingModeKey = (colId, modeName) =>
    existingModes.find(m => m.collectionId === colId && m.name === modeName)?.modeId;

  const payloadCollections = [];
  const payloadModes = [];

  const colName = colDef.name;
  const existingCol = existingCollByName.get(colName);
  const colId = existingCol ? existingCol.id : nextTempId();
  const isNewCol = !existingCol;

  payloadCollections.push({
    action: isNewCol ? 'CREATE' : 'UPDATE',
    id: colId,
    name: colName,
    hiddenFromPublishing,
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

  const branchArgs = {
    colDef,
    colId,
    modeIds,
    hiddenFromPublishing,
    idMap,
    rules,
    varLookup,
    existingVarByName,
    varsByColId,
  };
  const { payloadVars, payloadModeValues, deprecatedVarIds, stats, diff } = colDef.humanReadableEntries
    ? planHumanReadableCollection(branchArgs)
    : planRegularCollection(branchArgs);

  return { payloadCollections, payloadModes, payloadVars, payloadModeValues, deprecatedVarIds, stats, diff };
}

/**
 * Plan a human-readable alias collection: each entry creates a VARIABLE_ALIAS
 * that points to the corresponding already-published semantic token. The
 * Figma variable name is the display name; the value is a VARIABLE_ALIAS.
 *
 * @param {Object} p
 * @param {import('./collections.mjs').CollectionDef} p.colDef
 * @param {string} p.colId
 * @param {string[]} p.modeIds
 * @param {boolean} p.hiddenFromPublishing
 * @param {import('./id-map.mjs').IdMap} p.idMap
 * @param {import('./token-rules.mjs').createTokenRules extends (...a: any) => infer R ? R : never} p.rules
 * @param {Map<string, Map<string, any>>} p.varsByColId
 * @returns {{ payloadVars: any[], payloadModeValues: any[], deprecatedVarIds: Set<string>, stats: { new: number, update: number, skipped: number }, diff: DiffEntry[] }}
 */
function planHumanReadableCollection({ colDef, colId, modeIds, hiddenFromPublishing, idMap, rules, varsByColId }) {
  const { isExcluded, resolveFigmaScopes, buildCodeSyntax } = rules;
  const payloadVars = [];
  const payloadModeValues = [];
  const deprecatedVarIds = new Set();
  /** @type {DiffEntry[]} */
  const diff = [];
  const stats = { new: 0, update: 0, skipped: 0 };

  // Scope variable lookups to this collection so that identical display names
  // in sibling humanReadable collections don't collide.
  // varsByColId is keyed by collection ID and preserves every variable
  // independently — unlike the global existingVarByName map which stores
  // only the last variable per name (last-write-wins across collections).
  const colVarByName = varsByColId.get(colId) ?? new Map();

  /** @type {CollectionPlanContext} */
  const ctx = {
    colId,
    hiddenFromPublishing,
    payloadVars,
    diff,
    stats,
    modeIdToName: new Map(modeIds.map((id, i) => [id, colDef.modes[i]])),
    reverseIdMap: buildReverseIdMap(idMap),
    existingVarByName: colVarByName,
    deprecatedVarIds,
  };

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
      stats.skipped++;
      continue;
    }

    const scopes = resolveFigmaScopes(cssName);
    const codeSyntax = buildCodeSyntax(cssName);
    const resolvedType = idMap.getMeta(refId)?.type ?? 'STRING';
    const aliasValue = { type: 'VARIABLE_ALIAS', id: refId };
    const description = `Alias of: ${cssName}`;
    // All modes share the same VARIABLE_ALIAS value.
    const newModeValues = modeIds.map(modeId => ({ modeId, value: aliasValue }));

    // Skip if the variable already exists with the same type and identical values.
    const existingHrVar = colVarByName.get(displayName);
    if (
      existingHrVar &&
      existingHrVar.resolvedType === resolvedType &&
      !hasVariableChanged(existingHrVar, { scopes, codeSyntax, description, hiddenFromPublishing, newModeValues })
    ) {
      continue;
    }

    const varId = planVariableCreateOrUpdate(ctx, {
      figmaName: displayName,
      resolvedType,
      scopes,
      codeSyntax,
      description,
      newModeValues,
    });

    for (let mi = 0; mi < colDef.modes.length; mi++) {
      payloadModeValues.push({ variableId: varId, modeId: modeIds[mi], value: aliasValue });
    }
  }

  return { payloadVars, payloadModeValues, deprecatedVarIds, stats, diff };
}

/**
 * Plan a regular collection: scan the CSS source and emit one variable per token.
 *
 * Two passes are required so that intra-collection VARIABLE_ALIAS chains
 * resolve correctly regardless of CSS Map iteration order.  If token A's
 * dark-mode value is var(--token-B) and B happens to appear later in the
 * CSS Map, B won't be in idMap when A's mode values are resolved in a single
 * pass — resolveValue falls through to STRING and Figma rejects the push with
 * a type-mismatch error.  Pass 1 populates idMap for every token in the
 * collection first; pass 2 resolves mode values against the complete map.
 *
 * @param {Object} p
 * @param {import('./collections.mjs').CollectionDef} p.colDef
 * @param {string} p.colId
 * @param {string[]} p.modeIds
 * @param {boolean} p.hiddenFromPublishing
 * @param {import('./id-map.mjs').IdMap} p.idMap
 * @param {import('./token-rules.mjs').createTokenRules extends (...a: any) => infer R ? R : never} p.rules
 * @param {((name: string) => string | undefined) | null} p.varLookup
 * @param {Map<string, any>} p.existingVarByName
 * @returns {{ payloadVars: any[], payloadModeValues: any[], deprecatedVarIds: Set<string>, stats: { new: number, update: number, skipped: number }, diff: DiffEntry[] }}
 */
function planRegularCollection({
  colDef,
  colId,
  modeIds,
  hiddenFromPublishing,
  idMap,
  rules,
  varLookup,
  existingVarByName,
}) {
  const { isExcluded, resolveFigmaScopes, buildCodeSyntax } = rules;
  const payloadVars = [];
  const payloadModeValues = [];
  const deprecatedVarIds = new Set();
  /** @type {DiffEntry[]} */
  const diff = [];
  const stats = { new: 0, update: 0, skipped: 0 };

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
      stats.skipped++;
      continue;
    }

    const resolvedType = inferType(cssName, baseValue, idMap, varLookup).type;
    // Delegate DELETE-queueing, isRetype, isUpdate, and varId resolution to the
    // shared helper — payload construction is deferred to pass 2.
    const { varId, isUpdate, isRetype, existingVar, prevType } = resolveVariableId({
      figmaName,
      resolvedType,
      existingVarByName,
      deprecatedVarIds,
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
  /** @type {CollectionPlanContext} */
  const ctx = {
    colId,
    hiddenFromPublishing,
    payloadVars,
    diff,
    stats,
    modeIdToName: new Map(modeIds.map((id, i) => [id, colDef.modes[i]])),
    // Built after pass 1 so that temp IDs for this collection's new variables are included.
    reverseIdMap: buildReverseIdMap(idMap),
    existingVarByName,
    deprecatedVarIds,
  };

  for (const tokenEntry of tokenEntries) {
    // const { cssName, baseValue, isUpdate, existingVar, scopes, codeSyntax } = tokenEntry;
    const description = `CSS: ${tokenEntry.cssName}`;

    // Compute new mode values now that all intra-collection tokens are in idMap.
    const newModeValues = [];
    for (let mi = 0; mi < colDef.modes.length; mi++) {
      const modeSource = colDef.source(mi);
      const rawValue = modeSource.get(tokenEntry.cssName) ?? tokenEntry.baseValue;
      const resolved = resolveValue(rawValue, idMap, varLookup, tokenEntry.cssName);
      if (resolved.type === 'STRING' && rawValue.includes('var(') && rawValue.includes(',')) {
        continue;
      }
      newModeValues.push({ modeId: modeIds[mi], value: resolved.figmaValue });
    }

    // For existing (non-deprecated) variables, skip if nothing actually changed.
    if (
      tokenEntry.isUpdate &&
      !hasVariableChanged(tokenEntry.existingVar, {
        scopes: tokenEntry.scopes,
        codeSyntax: tokenEntry.codeSyntax,
        description,
        hiddenFromPublishing,
        newModeValues,
      })
    ) {
      continue;
    }

    // Push variable payload — tokenEntry already carries figmaName, resolvedType,
    // scopes, codeSyntax, varId, isUpdate, isRetype, prevType, existingVar; only
    // description and newModeValues are pass-2-specific additions.
    pushVariablePayload(ctx, { ...tokenEntry, description, newModeValues });

    // Push mode values.
    for (const { modeId, value } of newModeValues) {
      payloadModeValues.push({ variableId: tokenEntry.varId, modeId, value });
    }
  }

  return { payloadVars, payloadModeValues, deprecatedVarIds, stats, diff };
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
 *   deprecatedVarIds: Set<string>,
 *   stats: { new: number, update: number, skipped: number },
 *   existingCollByName: Map<string, any>,
 * }}
 */
export function buildPushPlan({
  collectionDefs,
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
  const deprecatedVarIds = new Set();
  let statsNew = 0;
  let statsUpdate = 0;
  let statsSkipped = 0;

  for (const colDef of collectionDefs) {
    const colPlan = buildCollectionPlan({
      colDef,
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
    for (const id of colPlan.deprecatedVarIds) {
      deprecatedVarIds.add(id);
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
    deprecatedVarIds,
    stats: { new: statsNew, update: statsUpdate, skipped: statsSkipped },
    existingCollByName,
  };
}
