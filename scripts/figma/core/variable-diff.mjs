/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Pure change-detection helpers for Figma variables.
 *
 * These functions compare an existing Figma variable against a desired new
 * state and produce structured diff output.  They have no side effects and
 * perform no network I/O — they are extracted from `planner.mjs` so they can
 * be reviewed and tested in isolation.
 */

/**
 * Deep-equal comparison for two Figma variable values.
 * Handles COLOR ({r,g,b,a}), FLOAT/STRING (primitives), and VARIABLE_ALIAS ({type,id}).
 *
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
function figmaValuesEqual(a, b) {
  if (a === b) {
    return true;
  }

  // FLOAT: compare after rounding to 6 decimal places so minor precision
  // differences between what Figma stores and what we compute don't trigger spurious updates.
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.round(a * 1e6) === Math.round(b * 1e6);
  }

  // Guard against null before typeof object checks — typeof null === 'object'.
  if (a === null || b === null) {
    return false;
  }

  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  if (a.type === 'VARIABLE_ALIAS') {
    return b.type === 'VARIABLE_ALIAS' && a.id === b.id;
  }

  // COLOR { r, g, b, a }
  if ('r' in a) {
    return (
      'r' in b &&
      Math.abs(a.r - b.r) < 1e-2 &&
      Math.abs(a.g - b.g) < 1e-2 &&
      Math.abs(a.b - b.b) < 1e-2 &&
      Math.abs(a.a - b.a) < 1e-2
    );
  }

  return false;
}

// Figma silently converts FONT_WEIGHT → FONT_STYLE in stored variables.
const normalizeScope = s => (s === 'FONT_WEIGHT' ? 'FONT_STYLE' : s);

/**
 * Format a single Figma variable value for human-readable display.
 *
 * @param {unknown} value
 * @param {Map<string, string>} reverseIdMap  Figma variable ID → CSS variable name.
 * @returns {string}
 */
function formatFigmaValue(value, reverseIdMap) {
  if (value === null) {
    return '(none)';
  }
  if (typeof value === 'number') {
    return String(parseFloat(value.toFixed(6)));
  }
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (typeof value !== 'object') {
    return String(value);
  }
  if (value.type === 'VARIABLE_ALIAS') {
    const cssName = reverseIdMap.get(value.id);
    return cssName ? `→ ${cssName}` : `→ ${value.id}`;
  }
  if ('r' in value) {
    const r = Math.round(value.r * 255)
      .toString(16)
      .padStart(2, '0');
    const g = Math.round(value.g * 255)
      .toString(16)
      .padStart(2, '0');
    const b = Math.round(value.b * 255)
      .toString(16)
      .padStart(2, '0');
    if (Math.abs(value.a - 1) < 1e-5) {
      return `#${r}${g}${b}`;
    }
    return `rgba(${Math.round(value.r * 255)}, ${Math.round(value.g * 255)}, ${Math.round(value.b * 255)}, ${value.a.toFixed(3)})`;
  }
  return JSON.stringify(value);
}

/**
 * Enumerate the specific fields that differ between an existing Figma variable and
 * the desired new state.  Each entry has a human-readable `field` label and
 * formatted `from` / `to` strings.
 *
 * @param {{ scopes?: string[], codeSyntax?: Record<string,string>, description?: string, hiddenFromPublishing?: boolean, valuesByMode?: Record<string,unknown> }} existingVar
 * @param {{ scopes: string[], codeSyntax: Record<string,string>, description: string, hiddenFromPublishing: boolean, newModeValues: Array<{modeId: string, value: unknown}>, modeIdToName: Map<string,string>, reverseIdMap: Map<string,string> }} next
 * @returns {import('./planner.mjs').FieldChange[]}
 */
export function detectChanges(
  existingVar,
  { scopes, codeSyntax, description, hiddenFromPublishing, newModeValues, modeIdToName, reverseIdMap }
) {
  const changes = [];

  if ((existingVar.hiddenFromPublishing ?? false) !== (hiddenFromPublishing ?? false)) {
    changes.push({
      field: 'hiddenFromPublishing',
      from: String(existingVar.hiddenFromPublishing ?? false),
      to: String(hiddenFromPublishing ?? false),
    });
  }

  const existingScopes = (existingVar.scopes ?? []).map(normalizeScope);
  const normalizedScopes = scopes.map(normalizeScope);
  if (existingScopes.length !== normalizedScopes.length || !normalizedScopes.every(s => existingScopes.includes(s))) {
    changes.push({
      field: 'scopes',
      from: existingScopes.join(' | ') || '(none)',
      to: normalizedScopes.join(' | ') || '(none)',
    });
  }

  const existingSyntax = existingVar.codeSyntax ?? {};
  for (const [k, v] of Object.entries(codeSyntax)) {
    if (existingSyntax[k] !== v) {
      changes.push({ field: `codeSyntax.${k}`, from: existingSyntax[k] ?? '(none)', to: v });
    }
  }
  for (const k of Object.keys(existingSyntax)) {
    if (!(k in codeSyntax)) {
      changes.push({ field: `codeSyntax.${k}`, from: existingSyntax[k], to: '(removed)' });
    }
  }

  if ((existingVar.description ?? '') !== description) {
    changes.push({ field: 'description', from: existingVar.description || '(none)', to: description });
  }

  const existingValues = existingVar.valuesByMode ?? {};
  for (const { modeId, value } of newModeValues) {
    if (!figmaValuesEqual(existingValues[modeId], value)) {
      changes.push({
        field: `value[${modeIdToName.get(modeId) ?? modeId}]`,
        from: formatFigmaValue(existingValues[modeId], reverseIdMap),
        to: formatFigmaValue(value, reverseIdMap),
      });
    }
  }

  return changes;
}

/**
 * Returns true if any field (hiddenFromPublishing, scopes, codeSyntax, description, or any mode value)
 * differs from the existing Figma variable — i.e. the variable needs an UPDATE push.
 *
 * @param {{ scopes?: string[], codeSyntax?: Record<string,string>, description?: string, hiddenFromPublishing?: boolean, valuesByMode?: Record<string,unknown> }} existingVar
 * @param {{ scopes: string[], codeSyntax: Record<string,string>, description: string, hiddenFromPublishing: boolean, newModeValues: Array<{modeId: string, value: unknown}> }} next
 * @returns {boolean}
 */
export function hasVariableChanged(existingVar, next) {
  return detectChanges(existingVar, { ...next, modeIdToName: new Map(), reverseIdMap: new Map() }).length > 0;
}

/**
 * Build a reverse lookup from Figma variable ID → CSS variable name using idMap.
 *
 * @param {import('./id-map.mjs').IdMap} idMap
 * @returns {Map<string, string>}
 */
export function buildReverseIdMap(idMap) {
  const m = new Map();
  for (const [name, id] of idMap.entries()) {
    m.set(id, name);
  }
  return m;
}
