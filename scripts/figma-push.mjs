#!/usr/bin/env node
/**
 * clr-ui.css → Figma Variables
 *
 * Parses the pre-built dist/clr-ui/clr-ui.css (run `npm run _build:ui` first)
 * and upserts ALL CSS custom properties into the Figma Variables REST API.
 *
 * Collections created / updated:
 *   "CDS Global Colors"  –  --cds-global-color-*       COLOR  "Value"
 *   "CDS Global Space"   –  --cds-global-space-*        FLOAT  "Value"
 *                           --cds-global-layout-space-*
 *   "CDS Theme"          –  --cds-alias-*              mixed  "Light" / "Dark"
 *   "CLR Density"        –  --clr-base-*               FLOAT  "Regular" / "Compact"
 *   "CLR Component"      –  all other --clr-*          mixed  "Value"
 *
 * Source contexts parsed from the CSS:
 *   :where(:root, :host) [+ [clr-density] | [cds-theme] variants] → "base"
 *   [cds-theme~=dark]                                              → "dark"
 *   [clr-density=compact]                                          → "compact"
 *
 * Env (via --env-file=.env.figma):
 *   FIGMA_TOKEN     – PAT with files:write scope
 *   FIGMA_FILE_KEY  – file key or full Figma URL
 *
 * Usage:
 *   npm run _build:ui   (if not already built)
 *   npm run figma:push
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT     = join(__dirname, '..');
const CSS_FILE = join(ROOT, 'dist/clr-ui/clr-ui.css');

// ─── Env ─────────────────────────────────────────────────────────────────────

const FIGMA_TOKEN       = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY_RAW = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY_RAW) {
  console.error('❌  FIGMA_TOKEN and FIGMA_FILE_KEY required (load via --env-file=.env.figma).');
  process.exit(1);
}
if (!existsSync(CSS_FILE)) {
  console.error(`❌  Built CSS not found: ${CSS_FILE}\n   Run: npm run _build:ui`);
  process.exit(1);
}

const keyMatch = FIGMA_FILE_KEY_RAW.match(/figma\.com\/(?:design|file)\/([a-zA-Z0-9]+)/);
const FILE_KEY  = keyMatch ? keyMatch[1] : FIGMA_FILE_KEY_RAW;

// ─── CSS calc static resolution ───────────────────────────────────────────────
//
// At the default CDS scale (--cds-global-base: 20, all scale multipliers = 1):
//   1rem = 20px  (HTML font-size = 20/16 × 100% = 125%)
//
//   calc(N * var(--cds-internal-scale-[123]))  → N px
//   calc(N * 1rem / var(--cds-global-base))    → N px   (baselinePx mixin output)

function resolveCalc(v) {
  // calc(N * var(--cds-internal-scale-[123]))
  let m = v.match(/^calc\(\s*([\d.]+)\s*\*\s*var\(--cds-internal-scale-[123]\)\s*\)$/i);
  if (m) return parseFloat(m[1]);

  // calc(N * 1rem / var(--cds-global-base))  — compiled baselinePx(N)
  m = v.match(/^calc\(\s*([\d.]+)\s*\*\s*1rem\s*\/\s*var\(--cds-global-base\)\s*\)$/i);
  if (m) return parseFloat(m[1]);

  return null;
}

// ─── CSS value → Figma typed value ───────────────────────────────────────────

function hslToFigma(h, s, l, a = 1) {
  const sn = s / 100, ln = l / 100;
  const k = n => (n + h / 30) % 12;
  const c = sn * Math.min(ln, 1 - ln);
  const f = n => ln - c * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const r = x => Math.round(x * 1000) / 1000;
  return { r: r(f(0)), g: r(f(8)), b: r(f(4)), a };
}

function hexToFigma(hex) {
  const h = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;
  const n = parseInt(h.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255, a: 1 };
}

/**
 * Parse a CSS value string into a Figma-typed value descriptor.
 * Returns: { type:'COLOR'|'FLOAT'|'STRING'|'ALIAS', value?:*, variableName?:string }
 * or null if the value cannot be represented.
 */
function parseCssValue(raw) {
  if (!raw) return null;
  const v = raw.trim().replace(/\s*!important\s*$/, '');

  // CSS custom property alias: var(--prop-name)
  const varM = v.match(/^var\(--([\w-]+)\)$/);
  if (varM) return { type: 'ALIAS', variableName: varM[1] };

  // HSL: hsl(Hdeg S% L%) or hsl(Hdeg S% L% / A%)
  const hslM = v.match(/^hsl\(\s*([\d.]+)deg\s+([\d.]+)%\s+([\d.]+)%(?:\s*\/\s*([\d.]+)%)?\s*\)$/i);
  if (hslM) {
    const [, h, s, l, a] = hslM;
    return { type: 'COLOR', value: hslToFigma(+h, +s, +l, a !== undefined ? +a / 100 : 1) };
  }

  // Hex: #rgb or #rrggbb
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v))
    return { type: 'COLOR', value: hexToFigma(v) };

  // calc() — statically resolve
  if (v.startsWith('calc(')) {
    const px = resolveCalc(v);
    return px !== null ? { type: 'FLOAT', value: px } : null;
  }

  // Pixel value
  const pxM = v.match(/^([\d.]+)px$/);
  if (pxM) return { type: 'FLOAT', value: parseFloat(pxM[1]) };

  // Percentage: 50% → FLOAT 50 (border-radius etc.)
  const pctM = v.match(/^([\d.]+)%$/);
  if (pctM) return { type: 'FLOAT', value: parseFloat(pctM[1]) };

  // Bare number: font-weight, base value, grid cols
  if (/^[\d.]+$/.test(v)) return { type: 'FLOAT', value: parseFloat(v) };

  // Non-empty string (font-family, outline, etc.)
  if (v && !v.includes('calc(') && !v.includes('var('))
    return { type: 'STRING', value: v.replace(/^['"]|['"]$/g, '') };

  return null; // complex multi-value or unresolvable calc
}

// ─── CSS file parser ──────────────────────────────────────────────────────────

/**
 * Classify a CSS selector string into a token context.
 * Returns 'base' | 'dark' | 'compact' | null.
 */
function classifySelector(sel) {
  // Dark theme override
  if (/\[cds-theme~=.?dark.?\]/.test(sel)) return 'dark';
  // Compact density override
  if (/\[clr-density=.?compact.?\]/.test(sel)) return 'compact';
  // Root / host base — covers :where(:root,:host) variants, plain :root, :host
  if (/:where\s*\(\s*:root/.test(sel) || /^:root\s*$/.test(sel)) return 'base';
  return null;
}

/**
 * Parse the compiled CSS file and return three Maps of CSS custom properties.
 *
 * @returns {{ base: Map<string,string>, dark: Map<string,string>, compact: Map<string,string> }}
 */
function parseCssFile(filePath) {
  const lines    = readFileSync(filePath, 'utf-8').split('\n');
  const result   = { base: new Map(), dark: new Map(), compact: new Map() };
  let selectorBuf = '';
  let depth       = 0;
  let ctx         = null;

  for (const raw of lines) {
    const line = raw.trim();

    // Skip blank lines and comments (standalone)
    if (!line || line.startsWith('/*') || line.startsWith('*') || line === '*/') continue;

    const opens  = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;

    if (depth === 0) {
      // Outside any block — accumulate selector text
      if (opens > 0) {
        // This line starts (and possibly ends) a block
        const beforeBrace = line.slice(0, line.indexOf('{')).trim();
        selectorBuf += (selectorBuf ? ' ' : '') + beforeBrace;
        ctx    = classifySelector(selectorBuf);
        depth += opens - closes;
        selectorBuf = '';
        if (depth <= 0) { ctx = null; depth = 0; }
      } else {
        // Pure selector line (multi-line selector)
        selectorBuf += (selectorBuf ? ' ' : '') + line;
      }
    } else {
      // Inside a block
      depth += opens - closes;

      if (depth <= 0) {
        // Block closed
        depth = 0; ctx = null;
        continue;
      }

      // Only extract top-level custom properties (depth === 1)
      if (depth === 1 && ctx && result[ctx]) {
        const propM = line.match(/^(-{2}[\w-]+)\s*:\s*(.+?)(?:\s*;.*)?$/);
        if (propM) {
          const val = propM[2].trim().replace(/;.*$/, '').replace(/\s*!important\s*$/, '').trim();
          if (val) result[ctx].set(propM[1], val);
        }
      }
    }
  }

  return result;
}

// ─── Collection definitions ───────────────────────────────────────────────────

const COLLECTIONS = [
  {
    name: 'CDS Global Colors',
    modes: ['Value'],
    prefixFilter: /^--cds-global-color-/,
    baseCtx: 'base',
  },
  {
    name: 'CDS Global Space',
    modes: ['Value'],
    prefixFilter: /^--cds-global-(space-\d+$|layout-space-)/,
    baseCtx: 'base',
  },
  {
    name: 'CDS Theme',
    modes: ['Light', 'Dark'],
    prefixFilter: /^--cds-alias-/,
    baseCtx: 'base',
    altCtx:  'dark',
  },
  {
    name: 'CLR Density',
    modes: ['Regular', 'Compact'],
    prefixFilter: /^--clr-base-/,
    baseCtx: 'base',
    altCtx:  'compact',
  },
  {
    name: 'CLR Component',
    modes: ['Value'],
    // All --clr-* that are NOT --clr-base-* (those go into CLR Density)
    prefixFilter: /^--clr-(?!base-)/,
    baseCtx: 'base',
  },
];

// ─── Static fallbacks ─────────────────────────────────────────────────────────
// Used ONLY when an alias reference hasn't been registered in idMap yet.
// This happens for CDS layout-space tokens (processed 2nd) that reference
// CLR Density variables (processed 4th) on the very first push.
// On subsequent runs idMap will contain them → VARIABLE_ALIAS is used instead.
const STATIC_FALLBACKS = new Map([
  ['--clr-base-layout-space-0',   0], ['--clr-base-layout-space-4xs', 1],
  ['--clr-base-layout-space-3xs', 2], ['--clr-base-layout-space-2xs', 4],
  ['--clr-base-layout-space-xs',  8], ['--clr-base-layout-space-s',  12],
  ['--clr-base-layout-space-m',  16], ['--clr-base-layout-space-l',  24],
  ['--clr-base-layout-space-xl', 32], ['--clr-base-layout-space-2xl',40],
  ['--clr-base-layout-space-3xl',48], ['--clr-base-layout-space-4xl',64],
  ['--clr-base-layout-space-5xl',96],
]);

// ─── Figma API ────────────────────────────────────────────────────────────────

const FIGMA_BASE = 'https://api.figma.com/v1';

async function figmaGet(path) {
  const res = await fetch(`${FIGMA_BASE}${path}`, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function figmaPost(path, body) {
  const res = await fetch(`${FIGMA_BASE}${path}`, {
    method: 'POST',
    headers: { 'X-Figma-Token': FIGMA_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(`POST ${path} → ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

// ─── Value & type helpers ─────────────────────────────────────────────────────

function toFigmaModeValue(parsed, idMap) {
  if (!parsed) return null;
  switch (parsed.type) {
    case 'COLOR':  return parsed.value;
    case 'FLOAT':  return parsed.value;
    case 'STRING': return parsed.value;
    case 'ALIAS': {
      const refName = `--${parsed.variableName}`;
      const refId = idMap.get(refName);
      if (refId) return { type: 'VARIABLE_ALIAS', id: refId };
      const fallback = STATIC_FALLBACKS.get(refName);
      return fallback !== undefined ? fallback : null;
    }
  }
  return null;
}

function inferType(parsed, baseVars, idMap, getVarType) {
  if (!parsed) return 'STRING';
  if (parsed.type !== 'ALIAS') {
    return parsed.type === 'COLOR' ? 'COLOR' : parsed.type === 'FLOAT' ? 'FLOAT' : 'STRING';
  }
  const refName = `--${parsed.variableName}`;
  if (STATIC_FALLBACKS.has(refName)) return 'FLOAT';

  const refId = idMap?.get(refName);
  if (refId) { const t = getVarType?.(refId); if (t) return t; }

  // Recurse one level for intra-collection chains
  const refRaw = baseVars?.get(refName);
  if (refRaw) {
    const refP = parseCssValue(refRaw);
    if (!refP) return 'STRING';
    if (refP.type !== 'ALIAS') return refP.type === 'COLOR' ? 'COLOR' : refP.type === 'FLOAT' ? 'FLOAT' : 'STRING';
    return inferType(refP, baseVars, idMap, getVarType);
  }

  return 'COLOR'; // unresolved alias — most are color references
}

// ─── ID counter ───────────────────────────────────────────────────────────────

let _id = 0;
const newId = (pfx = 'NEW') => `${pfx}_${++_id}`;

// ─── Main ─────────────────────────────────────────────────────────────────────

async function push() {
  // ── Parse CSS file ──────────────────────────────────────────────────────────
  console.log(`\n🎨  Parsing ${CSS_FILE.replace(ROOT, '.')}…`);
  const css = parseCssFile(CSS_FILE);
  console.log(`   base: ${css.base.size}  dark: ${css.dark.size}  compact: ${css.compact.size}`);

  // ── Fetch existing Figma variables ──────────────────────────────────────────
  console.log(`\n📡  Fetching existing Figma variables (file: ${FILE_KEY})…`);
  const existing = await figmaGet(`/files/${FILE_KEY}/variables/local`);
  const existingCols = existing.meta?.variableCollections ?? {};
  const existingVars = existing.meta?.variables ?? {};

  const collByName = new Map(Object.values(existingCols).map(c => [c.name, c]));
  // Map cssName ("--cds-global-color-blue-700") → Figma variable ID
  const varNameToId = new Map(
    Object.values(existingVars).map(v => [`--${v.name.replace(/\//g, '-')}`, v.id])
  );
  const existingVarTypes = new Map(Object.values(existingVars).map(v => [v.id, v.resolvedType]));

  console.log(`   ${Object.keys(existingCols).length} collections, ${Object.keys(existingVars).length} variables\n`);

  // Deletion pass: collect all wrongly-typed variables that need delete+recreate.
  // Figma validates name uniqueness across the ENTIRE payload before applying DELETEs,
  // so we must send deletions as a separate API call FIRST.
  const deletionPayload = {
    variableCollections: [],
    variableModes:       [],
    variables:           [],
    variableModeValues:  [],
  };

  const payload = {
    variableCollections: [],
    variableModes:       [],
    variables:           [],
    variableModeValues:  [],
  };

  const idMap      = new Map(varNameToId);  // cssName → figmaId (real or temp)
  const tempTypes  = new Map();             // tempId  → resolvedType
  const getVarType = id => existingVarTypes.get(id) ?? tempTypes.get(id);

  let stats = { total: 0, created: 0, updated: 0, skipped: 0 };

  for (const col of COLLECTIONS) {
    // ── Collection & mode IDs ────────────────────────────────────────────────
    const existingCol = collByName.get(col.name);
    let collId;
    const modeIds = {};

    if (existingCol) {
      collId = existingCol.id;
      for (const m of existingCol.modes) modeIds[m.name] = m.modeId;
      // Rename "Mode 1" → expected first mode name if still at Figma default
      const def = existingCol.modes.find(m => m.name === 'Mode 1');
      if (def && col.modes[0] !== 'Mode 1') {
        payload.variableModes.push({ action: 'UPDATE', id: def.modeId, name: col.modes[0], variableCollectionId: collId });
        modeIds[col.modes[0]] = def.modeId;
        delete modeIds['Mode 1'];
      }
    } else {
      collId = newId('COL');
      const initModeId = newId('MODE');
      payload.variableCollections.push({ action: 'CREATE', id: collId, name: col.name, initialModeId: initModeId });
      payload.variableModes.push({ action: 'UPDATE', id: initModeId, name: col.modes[0], variableCollectionId: collId });
      modeIds[col.modes[0]] = initModeId;
    }

    for (const modeName of col.modes) {
      if (!modeIds[modeName]) {
        const id = newId('MODE');
        payload.variableModes.push({ action: 'CREATE', id, name: modeName, variableCollectionId: collId });
        modeIds[modeName] = id;
      }
    }

    // ── Extract tokens from CSS contexts ─────────────────────────────────────
    const baseVars = new Map(
      [...css[col.baseCtx]].filter(([k]) => col.prefixFilter.test(k))
    );
    const altVars = col.altCtx
      ? new Map([...css[col.altCtx]].filter(([k]) => col.prefixFilter.test(k)))
      : new Map();

    const baseModeId = modeIds[col.modes[0]];
    const altModeId  = col.modes[1] ? modeIds[col.modes[1]] : null;

    console.log(`📦  "${col.name}"  base:${baseVars.size}  ${col.modes[1] ? col.modes[1]+':' : ''}${altVars.size > 0 ? altVars.size : ''}`);

    // ── Pre-register only parseable variables (no dangling temp IDs) ─────────
    for (const [cssName, rawVal] of baseVars) {
      if (!idMap.has(cssName) && parseCssValue(rawVal) !== null) {
        const tid = newId('VAR');
        idMap.set(cssName, tid);
      }
    }

    // ── Build payload entries ────────────────────────────────────────────────
    for (const [cssName, rawBase] of baseVars) {
      const parsedBase = parseCssValue(rawBase);
      if (!parsedBase) { stats.skipped++; continue; }

      // Convert --clr-foo-bar → clr/foo/bar, filtering empty segments created
      // by double-dashes in property names like --clr-foo--bar.
      const figmaName  = cssName.replace(/^--/, '').split('-').filter(Boolean).join('/');
      const existingId = varNameToId.get(cssName);
      const varId      = existingId ?? idMap.get(cssName);
      const isNew      = !existingId;

      if (!varId) { stats.skipped++; continue; }

      const resolvedType = inferType(parsedBase, baseVars, idMap, getVarType);

      // Figma resolvedType is IMMUTABLE after creation. If an existing variable was
      // created with the wrong type (COLOR fallback for unresolved aliases), we must
      // DELETE the old one and CREATE a fresh one to get the correct type.
      const existingType = existingVarTypes.get(varId);
      const typeConflict = !isNew && existingType && existingType !== resolvedType;

      let effectiveId = varId;
      if (typeConflict) {
        deletionPayload.variables.push({ action: 'DELETE', id: varId });
        effectiveId = newId('VAR');
        // Re-point idMap so downstream collections alias the new ID.
        idMap.set(cssName, effectiveId);
        stats.created++;
        stats.updated--;
      }

      // Always register inferred type so downstream inferType() uses corrected value.
      tempTypes.set(effectiveId, resolvedType);

      payload.variables.push({
        action: isNew || typeConflict ? 'CREATE' : 'UPDATE',
        id: effectiveId,
        name: figmaName,
        variableCollectionId: collId,
        ...(isNew || typeConflict ? { resolvedType } : {}),
      });

      const baseVal = toFigmaModeValue(parsedBase, idMap);
      if (baseVal !== null)
        payload.variableModeValues.push({ variableId: effectiveId, modeId: baseModeId, value: baseVal });

      if (altModeId) {
        const rawAlt    = altVars.get(cssName);
        const parsedAlt = rawAlt ? parseCssValue(rawAlt) : parsedBase;
        const altVal    = toFigmaModeValue(parsedAlt ?? parsedBase, idMap);
        if (altVal !== null)
          payload.variableModeValues.push({ variableId: effectiveId, modeId: altModeId, value: altVal });
      }

      if (!typeConflict) isNew ? stats.created++ : stats.updated++;
      stats.total++;
    }
  }

  console.log(`\n📊  ${stats.total} tokens  (${stats.created} new, ${stats.updated} updates, ${stats.skipped} skipped)`);
  console.log(`   ${payload.variables.length} variable entries, ${payload.variableModeValues.length} mode values`);
  if (deletionPayload.variables.length > 0)
    console.log(`   ${deletionPayload.variables.length} type-correction deletions (wrong COLOR→FLOAT)`);

  if (payload.variables.length === 0) { console.log('\nℹ  Nothing to push.'); return; }

  if (deletionPayload.variables.length > 0) {
    console.log(`\n🗑  Deleting ${deletionPayload.variables.length} wrongly-typed variables…`);
    await figmaPost(`/files/${FILE_KEY}/variables`, deletionPayload);
    console.log('   ✓ Deletion complete');
  }

  console.log('\n🚀  Pushing to Figma…');
  const result = await figmaPost(`/files/${FILE_KEY}/variables`, payload);
  console.log('✅  Push complete!');

  const errors = result.meta?.errors;
  if (errors?.length) {
    console.warn('\n⚠  Figma reported errors:');
    for (const e of errors) console.warn(`   ${e.message ?? JSON.stringify(e)}`);
  }
}

try {
  await push();
} catch (err) {
  console.error('\n❌  Push failed:', err.message);
  process.exit(1);
}
