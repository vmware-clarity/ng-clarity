/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Executes the per-collection Figma Variables API push loop.
 *
 * This module owns all the network I/O for a push run: it iterates over
 * every collection, calls `buildCollectionPlan` for each one, posts the
 * payload to the Figma API (splitting into batches when needed), and refreshes
 * the idMap from a GET after each POST so that cross-collection VARIABLE_ALIAS
 * mode values always carry real Figma IDs rather than stale temp IDs.
 *
 * After all collections are pushed it removes the "Mode 1" default mode that
 * Figma silently injects whenever a new collection is created.
 */

import { buildCollectionPlan, populateIdMapFromExisting } from '../core/planner.mjs';
import { createIdMap } from '../core/id-map.mjs';
import { parseFigmaVarsResponse, buildLookupMaps } from '../util/figma-response.mjs';

/** Maximum variables per Figma POST request. */
const BATCH = 500;

/**
 * Push all collections to the Figma Variables API, one collection per POST.
 *
 * Figma temp IDs are only valid within the single POST request that declares
 * them.  Sending multiple collections in one batched POST means batch 2+
 * carry stale temp IDs that Figma no longer recognises.  The fix: push each
 * collection in its own POST, then GET the current variable list and refresh
 * idMap with real Figma IDs before planning the next collection.
 *
 * @param {Object} params
 * @param {ReturnType<import('./figma-client.mjs').createFigmaClient>} params.figma
 * @param {string} params.effectiveFileKey  Figma file key (or branch key).
 * @param {import('../core/collections.mjs').CollectionDef[]} params.collectionDefs
 * @param {string} params.collectionSuffix  Branch isolation suffix (e.g. " [dev]").
 * @param {any[]} params.existingCollections  Initial list from the pre-push GET.
 * @param {any[]} params.existingVars         Initial list from the pre-push GET.
 * @param {Array<{modeId: string, name: string, collectionId: string}>} params.existingModes
 * @param {ReturnType<import('../core/token-rules.mjs').createTokenRules>} params.rules
 * @param {((name: string) => string | undefined) | null} params.varLookup
 * @returns {Promise<{
 *   totalNew: number,
 *   totalUpdate: number,
 *   totalSkipped: number,
 *   totalDeleted: number,
 *   totalModeValues: number,
 *   diffReport: Array<{ collectionName: string, diff: import('../core/planner.mjs').DiffEntry[] }>,
 * }>}
 */
export async function executePush({
  figma,
  effectiveFileKey,
  collectionDefs,
  collectionSuffix,
  existingCollections,
  existingVars,
  existingModes,
  rules,
  varLookup,
}) {
  const idMap = createIdMap();
  populateIdMapFromExisting(existingVars, idMap);

  // Mutable lookup Maps rebuilt from each GET response so subsequent
  // collections always see the latest authoritative Figma state.
  const {
    collByName: existingCollByName,
    varByName: existingVarByName,
    varsByColId: initialVarsByColId,
  } = buildLookupMaps(existingCollections, existingVars);
  // varsByColId is a per-collection variable map that survives re-assignment;
  // declared as let so it can be replaced wholesale after each push.
  let varsByColId = initialVarsByColId;

  let totalNew = 0;
  let totalUpdate = 0;
  let totalSkipped = 0;
  let totalDeleted = 0;
  let totalModeValues = 0;

  /** @type {Array<{ collectionName: string, diff: import('../core/planner.mjs').DiffEntry[] }>} */
  const diffReport = [];

  for (const colDef of collectionDefs) {
    console.log(`\n  📦  Collection: "${colDef.name}"`);

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

    totalNew += colPlan.stats.new;
    totalUpdate += colPlan.stats.update;
    totalSkipped += colPlan.stats.skipped;
    totalDeleted += colPlan.deletedVarIds.size;
    totalModeValues += colPlan.payloadModeValues.length;
    diffReport.push({ collectionName: colDef.name + collectionSuffix, diff: colPlan.diff });

    // ── Type-mismatch deletions (must precede recreations) ──────────────────
    const deleteVars = colPlan.payloadVars.filter(v => v.action === 'DELETE');
    if (deleteVars.length > 0) {
      console.log(`    🗑️   Deleting ${deleteVars.length} type-mismatched variable(s)…`);
      await figma.post(`/files/${effectiveFileKey}/variables`, {
        variableCollections: [],
        variableModes: [],
        variables: deleteVars,
        variableModeValues: [],
      });
    }

    // ── Push this collection in batches ─────────────────────────────────────
    // Each collection is kept in a single POST whenever possible (< BATCH vars).
    // If a collection exceeds BATCH variables it is split, but the collection
    // and modes are always included in the first batch so Figma can resolve IDs.
    const createUpdateVars = colPlan.payloadVars.filter(v => v.action !== 'DELETE');

    for (let i = 0; i < Math.max(createUpdateVars.length, 1); i += BATCH) {
      const slice = createUpdateVars.slice(i, i + BATCH);
      const sliceIds = new Set(slice.map(v => v.id));
      const sliceMV = colPlan.payloadModeValues.filter(mv => sliceIds.has(mv.variableId));
      console.log(
        `    📤  Batch ${Math.floor(i / BATCH) + 1}: ${slice.length} var(s), ${sliceMV.length} mode value(s)`
      );
      await figma.post(`/files/${effectiveFileKey}/variables`, {
        variableCollections: i === 0 ? colPlan.payloadCollections : [],
        variableModes: i === 0 ? colPlan.payloadModes : [],
        variables: slice,
        variableModeValues: sliceMV,
      });
    }

    // ── Refresh idMap with real Figma IDs ───────────────────────────────────
    // Any temp IDs assigned during this collection's plan are now resolved to
    // real Figma IDs.  The next collection's VARIABLE_ALIAS mode values will
    // therefore carry real IDs rather than stale temp IDs.
    console.log(`    🔄  Syncing variable IDs…`);
    const fresh = await figma.get(`/files/${effectiveFileKey}/variables/local`);
    const { collections: freshCollections, vars: freshVars, modes: freshModes } = parseFigmaVarsResponse(fresh);

    populateIdMapFromExisting(freshVars, idMap);

    existingCollByName.clear();
    for (const c of freshCollections) {
      existingCollByName.set(c.name, c);
    }

    existingVarByName.clear();
    for (const v of freshVars) {
      existingVarByName.set(v.name, v);
    }

    existingModes.length = 0;
    existingModes.push(...freshModes);

    ({ varsByColId } = buildLookupMaps(freshCollections, freshVars));
  }

  // ── Remove Figma's auto-created "Mode 1" from the collections we just pushed ─
  // Figma silently appends a default "Mode 1" whenever a collection is created,
  // even when we supply our own named modes in the same request.  Only target
  // collections from this push run to avoid touching unrelated collections.
  const pushedCollectionIds = new Set(
    collectionDefs.map(def => existingCollByName.get(def.name + collectionSuffix)?.id).filter(Boolean)
  );
  const defaultModes = existingModes.filter(m => m.name === 'Mode 1' && pushedCollectionIds.has(m.collectionId));
  if (defaultModes.length > 0) {
    console.log(`\n  🧹  Removing ${defaultModes.length} auto-created "Mode 1" mode(s)…`);
    await figma.post(`/files/${effectiveFileKey}/variables`, {
      variableCollections: [],
      variableModes: defaultModes.map(m => ({ action: 'DELETE', id: m.modeId, variableCollectionId: m.collectionId })),
      variables: [],
      variableModeValues: [],
    });
  }

  return { totalNew, totalUpdate, totalSkipped, totalDeleted, totalModeValues, diffReport };
}
