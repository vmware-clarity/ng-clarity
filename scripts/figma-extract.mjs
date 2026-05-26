#!/usr/bin/env node
/**
 * Figma Variables → DTCG Token Files
 *
 * Calls GET /v1/files/:file_key/variables/local, normalises the response to the
 * W3C Design Tokens Community Group (DTCG) draft spec and writes split JSON files:
 *
 *   tokens/global/colors.json
 *   tokens/global/spacing.json
 *   tokens/global/typography.json
 *   tokens/global/misc.json      ← unrecognised collections land here
 *   tokens/themes/light.json
 *   tokens/themes/dark.json
 *
 * Environment variables (load via --env-file=.env.figma):
 *   FIGMA_TOKEN    – personal access token with File Content (read) scope
 *   FIGMA_FILE_KEY – the key from the Figma file URL, or the full URL
 *
 * Usage:
 *   node --env-file=.env.figma scripts/figma-extract.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── Config ──────────────────────────────────────────────────────────────────

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
  console.error('❌  FIGMA_TOKEN and FIGMA_FILE_KEY environment variables are required.');
  console.error('    Set them in .env.figma and run: node --env-file=.env.figma scripts/figma-extract.mjs');
  process.exit(1);
}

// Accept a full Figma URL as the file key and extract just the key segment.
// https://www.figma.com/design/<KEY>/...  or  https://www.figma.com/file/<KEY>/...
const fileKeyMatch = FIGMA_FILE_KEY.match(/figma\.com\/(?:design|file)\/([a-zA-Z0-9]+)/);
const FILE_KEY = fileKeyMatch ? fileKeyMatch[1] : FIGMA_FILE_KEY;

// ─── Collection → category mapping ───────────────────────────────────────────
//
// Maps a substring of the collection name OR a substring of the variable name
// to one of the global/* output buckets.
//
// Checked in ORDER — first match wins. Keep more-specific patterns first.
// 'size' is intentionally omitted: it appears in both spacing AND font-size paths,
// so category is determined by 'font'/'typography' (which appear first) instead.
//
const COLLECTION_CATEGORY_MAP = [
  // keyword          → bucket
  ['color',           'colors'],
  ['colour',          'colors'],
  ['palette',         'colors'],
  ['typography',      'typography'],
  ['type',            'typography'],
  ['font',            'typography'],
  ['spacing',         'spacing'],
  ['space',           'spacing'],
  ['density',         'spacing'],
  ['scale',           'spacing'],
];

// ─── Mode detection ───────────────────────────────────────────────────────────
//
// Given a list of modes, returns the modeId for the "light/base" and "dark"
// modes using a priority-based substring search.
// This correctly handles all mode name conventions observed in the Clarity file:
//   Light / Dark
//   Light Theme / Dark Theme
//   Value (single-mode)
//   Clarity v.18 - Regular / Clarity v.18 - Compact  (density, no dark)
//   🚨 Clarity v.17 🚨 / Clarity v.18 - Regular …  (deprecated first)

const LIGHT_PRIORITIES = ['light', 'value', 'default', 'base', 'regular'];

function findLightModeId(modes) {
  for (const keyword of LIGHT_PRIORITIES) {
    const m = modes.find(m => m.name.toLowerCase().includes(keyword));
    if (m) return m.modeId;
  }
  return modes[0]?.modeId; // absolute last resort
}

function findDarkModeId(modes) {
  return modes.find(m => m.name.toLowerCase().includes('dark'))?.modeId;
}

// ─── Value helpers ────────────────────────────────────────────────────────────

/** Convert Figma's {r,g,b,a} (0–1 floats) to a modern CSS hsl() string. */
function figmaColorToCss({ r, g, b, a }) {
  const rn = r, gn = g, bn = b;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      default: h = ((rn - gn) / d + 4) / 6;
    }
  }
  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);
  if (a !== undefined && a < 0.999) {
    return `hsl(${hDeg}deg ${sPct}% ${lPct}% / ${Math.round(a * 100)}%)`;
  }
  return `hsl(${hDeg}deg ${sPct}% ${lPct}%)`;
}

/**
 * Map a Figma variable's resolvedType + name to a DTCG $type string.
 * https://design-tokens.github.io/community-group/format/#types
 */
function dtcgType(resolvedType, variableName) {
  const n = variableName.toLowerCase();
  switch (resolvedType) {
    case 'COLOR':
      return 'color';
    case 'FLOAT': {
      // Font weight: contains 'weight' but NOT in a spacing context
      if (/\bweight\b|\/weight\/|font.weight/.test(n)) return 'fontWeight';
      // Opacity: unitless 0–1 number
      if (/opacity/.test(n)) return 'number';
      // Everything else (font-size, spacing, border-width, etc.) is a dimension (px)
      return 'dimension';
    }
    case 'STRING':
      if (/font.family|fontfamily/.test(n)) return 'fontFamily';
      return 'string';
    case 'BOOLEAN':
      return 'boolean';
    default:
      return 'other';
  }
}

/** Format a Figma FLOAT value as the correct DTCG/CSS value string. */
function formatFloat(value, type) {
  switch (type) {
    case 'dimension': return `${value}px`;
    case 'fontWeight': return String(Math.round(value)); // no unit
    case 'number':     return value;
    default:           return value;
  }
}

// ─── Path helpers ─────────────────────────────────────────────────────────────

/**
 * Convert a Figma variable name like "cds/alias/typography/font/size/4"
 * into a DTCG token path array: ["cds", "alias", "typography", "font", "size", "4"]
 * Strips leading $ (reserved in DTCG), collapses spaces, removes invalid chars.
 */
function variableNameToPath(name) {
  return name
    .split('/')
    .map(seg =>
      seg.trim()
        .replace(/^\$+/, '')    // strip leading $ (reserved in DTCG)
        .replace(/^\-+/, '')    // strip leading -- (e.g. Figma names like "--cds-alias-status-info")
        .replace(/\s+/g, '-')   // spaces → hyphens
        .replace(/[^\w-]/g, '') // remove remaining invalid chars
        .toLowerCase()
    )
    .filter(Boolean);
}

function setDeep(obj, pathArr, value) {
  let cur = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const k = pathArr[i];
    if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  cur[pathArr[pathArr.length - 1]] = value;
}

// ─── Category detection ───────────────────────────────────────────────────────

function detectCategory(collectionName, variableName) {
  const cn = collectionName.toLowerCase();
  const vn = variableName.toLowerCase();
  for (const [keyword, category] of COLLECTION_CATEGORY_MAP) {
    if (cn.includes(keyword) || vn.includes(keyword)) return category;
  }
  return 'misc'; // unrecognised → global/misc.json
}

// ─── Alias resolution ─────────────────────────────────────────────────────────

function buildAliasMap(variables) {
  const map = new Map();
  for (const [id, variable] of Object.entries(variables)) {
    map.set(id, variableNameToPath(variable.name).join('.'));
  }
  return map;
}

function resolveValue(modeValue, resolvedType, variableName, aliasMap) {
  if (modeValue && typeof modeValue === 'object' && modeValue.type === 'VARIABLE_ALIAS') {
    const path = aliasMap.get(modeValue.id);
    return path ? `{${path}}` : null;
  }
  if (resolvedType === 'COLOR' && modeValue && typeof modeValue === 'object') {
    return figmaColorToCss(modeValue);
  }
  if (resolvedType === 'FLOAT' && typeof modeValue === 'number') {
    return formatFloat(modeValue, dtcgType(resolvedType, variableName));
  }
  return modeValue ?? null;
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchVariables() {
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`;
  console.log(`📡  Fetching https://api.figma.com/v1/files/${FILE_KEY}/variables/local`);
  const res = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.error) throw new Error(`Figma API error: ${JSON.stringify(data)}`);
  return data.meta;
}

// ─── Main transform ───────────────────────────────────────────────────────────

function buildTokenTrees(meta) {
  const { variableCollections, variables } = meta;
  const aliasMap = buildAliasMap(variables);

  const trees = {
    'global/colors':     {},
    'global/spacing':    {},
    'global/typography': {},
    'global/misc':       {},
    'themes/light':      {},
    'themes/dark':       {},
  };

  // Print collection summary to help users tune COLLECTION_CATEGORY_MAP
  console.log('\n📋  Collections:');
  for (const col of Object.values(variableCollections)) {
    const modeNames = col.modes.map(m => m.name).join(' / ');
    const sampleName = col.variableIds[0] ? variables[col.variableIds[0]]?.name : '—';
    const category = detectCategory(col.name, sampleName ?? '');
    const lightId  = findLightModeId(col.modes);
    const darkId   = findDarkModeId(col.modes);
    const lightName = col.modes.find(m => m.modeId === lightId)?.name ?? '—';
    const darkName  = darkId ? (col.modes.find(m => m.modeId === darkId)?.name ?? '—') : 'none';
    console.log(`  "${col.name}" → ${category}  |  base: "${lightName}"  dark: "${darkName}"  (${col.variableIds.length} vars)`);
  }
  console.log();

  for (const col of Object.values(variableCollections)) {
    const lightModeId = findLightModeId(col.modes);
    const darkModeId  = findDarkModeId(col.modes);
    const isThemeable = darkModeId !== undefined;

    for (const varId of col.variableIds) {
      const variable = variables[varId];
      if (!variable || variable.hiddenFromPublishing) continue;

      const pathArr = variableNameToPath(variable.name);
      if (!pathArr.length) continue;

      const type     = dtcgType(variable.resolvedType, variable.name);
      const category = detectCategory(col.name, variable.name);

      const makeToken = value => ({
        $value: value,
        $type: type,
        ...(variable.description ? { $description: variable.description } : {}),
      });

      // Light / base mode value
      if (lightModeId !== undefined && variable.valuesByMode[lightModeId] !== undefined) {
        const value = resolveValue(variable.valuesByMode[lightModeId], variable.resolvedType, variable.name, aliasMap);
        if (value !== null) {
          // Theme-split collections → themes/light only (avoids duplicate in global)
          if (isThemeable) {
            setDeep(trees['themes/light'], pathArr, makeToken(value));
          } else {
            // Single-mode → appropriate global bucket
            const bucketKey = `global/${category}`;
            const target = trees[bucketKey] ?? trees['global/misc'];
            setDeep(target, pathArr, makeToken(value));
          }
        }
      }

      // Dark mode override
      if (darkModeId !== undefined && variable.valuesByMode[darkModeId] !== undefined) {
        const value = resolveValue(variable.valuesByMode[darkModeId], variable.resolvedType, variable.name, aliasMap);
        if (value !== null) {
          setDeep(trees['themes/dark'], pathArr, makeToken(value));
        }
      }
    }
  }

  return trees;
}

// ─── Write output ─────────────────────────────────────────────────────────────

function writeTokenFiles(trees) {
  let written = 0;
  for (const [bucketPath, tree] of Object.entries(trees)) {
    if (!Object.keys(tree).length) continue;
    const filePath = join(ROOT, 'tokens', `${bucketPath}.json`);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, JSON.stringify(tree, null, 2) + '\n', 'utf-8');
    console.log(`✅  tokens/${bucketPath}.json`);
    written++;
  }
  if (!written) console.log('ℹ  No tokens written — all buckets were empty.');
}

// ─── Entry point ─────────────────────────────────────────────────────────────

(async () => {
  try {
    const meta = await fetchVariables();
    const totalVars = Object.keys(meta.variables).length;
    const totalCols = Object.keys(meta.variableCollections).length;
    console.log(`📦  ${totalVars} variables in ${totalCols} collections`);
    const trees = buildTokenTrees(meta);
    writeTokenFiles(trees);
    console.log('\n🎉  Extraction complete.');
  } catch (err) {
    console.error('\n❌  Extraction failed:', err.message);
    process.exit(1);
  }
})();
