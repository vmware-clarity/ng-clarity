#!/usr/bin/env node

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Figma token publisher for ng-clarity.
 *
 * Reads dist/clr-ui/clr-ui.css (the compiled output of `npm run _build:ui`),
 * applies scope/exclusion rules from figma-tokens.config.json, and publishes
 * all CSS custom properties as Figma variables via the Figma Variables REST API.
 *
 * Usage:
 *   node --env-file=.env.figma scripts/figma-push.mjs [options]
 *
 * Options:
 *   --dry-run              Parse and plan the push but make no API calls.
 *   --extract [file]       Write the parsed token plan to a JSON file instead
 *                          of pushing. No Figma credentials required.
 *                          Defaults to: figma-tokens.extract.json
 *   --branch <name>        Dev branch name; isolates tokens from production.
 *                          With FIGMA_BRANCH_MODE=branch: targets a Figma branch.
 *                          With FIGMA_BRANCH_MODE=collection (default): suffixes
 *                          collection names with " [<branch>]".
 *
 * Required env vars (set in .env.figma) — not needed for --extract:
 *   FIGMA_TOKEN        Personal access token with file_variables:read/write.
 *   FIGMA_FILE_KEY     Figma file key (last path segment of the file URL).
 *
 * Optional env vars:
 *   FIGMA_BRANCH_MODE  "branch" | "collection" (default: "collection")
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── CLI arguments (parsed before env validation) ────────────────────────────

const DRY_RUN = process.argv.includes('--dry-run');

const extractIdx = process.argv.indexOf('--extract');
const EXTRACT_MODE = extractIdx !== -1;
const EXTRACT_FILE = (() => {
  if (!EXTRACT_MODE) {
    return null;
  }
  const next = process.argv[extractIdx + 1];
  return next && !next.startsWith('--') ? next : 'figma-tokens.extract.json';
})();

const branchIdx = process.argv.indexOf('--branch');
const BRANCH_NAME = branchIdx !== -1 ? process.argv[branchIdx + 1] : undefined;

// ─── Environment ─────────────────────────────────────────────────────────────

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const RAW_FILE_KEY = process.env.FIGMA_FILE_KEY ?? '';
const FIGMA_BRANCH_MODE = process.env.FIGMA_BRANCH_MODE ?? 'collection';

if (!EXTRACT_MODE && (!FIGMA_TOKEN || !RAW_FILE_KEY)) {
  console.error('❌  FIGMA_TOKEN and FIGMA_FILE_KEY must be set (e.g. via .env.figma).');
  console.error('    Tip: to inspect tokens without credentials, run: node scripts/figma-push.mjs --extract');
  process.exit(1);
}

// Accept full Figma URLs: extract the key from the path segment after /file/ or /design/
const FIGMA_FILE_KEY = RAW_FILE_KEY.replace(/^https?:\/\/.*?\/(?:file|design)\/([A-Za-z0-9_-]+).*/, '$1');

// ─── Config ──────────────────────────────────────────────────────────────────

const CONFIG_PATH = path.join(ROOT, 'figma-tokens.config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

/** @type {string[]} Glob-style patterns → exact lowercase substrings for simple matching */
const EXCLUSION_PATTERNS = (config.exclusions?.patterns ?? []).map(p => p.toLowerCase());
const EXCLUSION_EXACT = new Set((config.exclusions?.exact ?? []).map(n => n.toLowerCase()));

/** @type {Array<{pattern: string, scopes: string[]}>} */
const SCOPE_RULES = config.scopeRules ?? [];

const CODE_SYNTAX_TEMPLATES = (() => {
  const raw = config.codeSyntax ?? { WEB: 'var(${name})', ANDROID: '@clr/${kebab}', iOS: 'Clarity.${camel}' };
  // Strip _comment and other non-platform keys
  return Object.fromEntries(Object.entries(raw).filter(([k]) => !k.startsWith('_')));
})();

// ─── Figma API helpers ────────────────────────────────────────────────────────

const FIGMA_API = 'https://api.figma.com/v1';

async function figmaGet(endpoint) {
  const res = await fetch(`${FIGMA_API}${endpoint}`, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GET ${endpoint} → ${res.status}: ${body}`);
  }
  return res.json();
}

async function figmaPost(endpoint, body) {
  const res = await fetch(`${FIGMA_API}${endpoint}`, {
    method: 'POST',
    headers: { 'X-Figma-Token': FIGMA_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`POST ${endpoint} → ${res.status}: ${text}`);
  }
  return JSON.parse(text);
}

// ─── CSS parser ──────────────────────────────────────────────────────────────

const CSS_FILE = path.join(ROOT, 'dist', 'clr-ui', 'clr-ui.css');

if (!fs.existsSync(CSS_FILE)) {
  console.error(`❌  ${CSS_FILE} not found. Run: npm run _build:ui`);
  process.exit(1);
}

const cssText = fs.readFileSync(CSS_FILE, 'utf8');

/**
 * Fast line-scanner CSS parser: extracts custom property declarations per selector.
 * Returns a Map<selectorString, Map<propName, value>>.
 *
 * Assumes compiled SCSS output where:
 * - Each custom property declaration occupies exactly one line: `  --name: value;`
 * - Selector lines end with `{`
 * - Block endings are `}` lines
 * This is always true for output from `sass` / `csso`.
 */
function parseCssBlocks(css) {
  const blocks = new Map();
  const lines = css.split('\n');
  let currentSelector = '';
  let selectorBuffer = '';
  let depth = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('/*') || line.startsWith('*') || line.startsWith('//')) {
      continue;
    }

    // Track brace depth for @rule skipping
    const opens = (line.match(/\{/g) ?? []).length;
    const closes = (line.match(/\}/g) ?? []).length;

    if (line.endsWith('{')) {
      depth += opens - closes;
      if (depth === 1) {
        // Top-level rule block opening
        selectorBuffer += (selectorBuffer ? ' ' : '') + line.slice(0, -1).trim();
        currentSelector = selectorBuffer.replace(/\s+/g, ' ').trim();
        selectorBuffer = '';
      } else {
        // Nested block (e.g. @keyframes) — accumulate selector parts
        selectorBuffer += ' ' + line.slice(0, -1).trim();
      }
      continue;
    }

    if (line === '}' || line.startsWith('}')) {
      depth -= closes - opens;
      if (depth < 0) {
        depth = 0;
      }
      if (depth === 0) {
        currentSelector = '';
      }
      continue;
    }

    // Custom property declaration inside a top-level block
    if (depth === 1 && line.startsWith('--') && line.includes(':')) {
      const colonIdx = line.indexOf(':');
      const name = line.slice(0, colonIdx).trim();
      // Value: everything after ':' up to (but not including) ';'
      let value = line.slice(colonIdx + 1).trim();
      if (value.endsWith(';')) {
        value = value.slice(0, -1).trim();
      }
      if (!name.startsWith('--') || !value) {
        continue;
      }
      if (!blocks.has(currentSelector)) {
        blocks.set(currentSelector, new Map());
      }
      blocks.get(currentSelector).set(name, value);
      continue;
    }

    // Multi-line selector accumulation (comma-separated selectors across lines)
    if (depth === 0 && line && !line.startsWith('@') && !line.startsWith('}')) {
      selectorBuffer += (selectorBuffer ? ' ' : '') + line;
    }
  }

  return blocks;
}

const allBlocks = parseCssBlocks(cssText);

// Canonical selectors we care about
const SEL_ROOT = ':where(:root, :host)';
const SEL_DARK = ':where(:root, :host) [cds-theme~=dark]';
const SEL_COMPACT = ':where(:root, :host) [clr-density]';
const SEL_BOTH_THEME = ':where(:root, :host), :where(:root, :host) [cds-theme]';
const SEL_BOTH_DENSITY = ':where(:root, :host), :where(:root, :host) [clr-density]';

const rootVars = allBlocks.get(SEL_ROOT) ?? new Map();
const darkVars = allBlocks.get(SEL_DARK) ?? new Map();
const compactVars = allBlocks.get(SEL_COMPACT) ?? new Map();
// Merge shorthand dual-selector blocks (these apply to both modes equally)
const bothThemeVars = allBlocks.get(SEL_BOTH_THEME) ?? new Map();
const bothDensityVars = allBlocks.get(SEL_BOTH_DENSITY) ?? new Map();
for (const [k, v] of bothThemeVars) {
  if (!rootVars.has(k)) {
    rootVars.set(k, v);
  }
  if (!darkVars.has(k)) {
    darkVars.set(k, v);
  }
}
for (const [k, v] of bothDensityVars) {
  if (!rootVars.has(k)) {
    rootVars.set(k, v);
  }
  if (!compactVars.has(k)) {
    compactVars.set(k, v);
  }
}

// ─── Collection definitions ───────────────────────────────────────────────────

/**
 * Each entry defines one Figma variable collection.
 * `filter(name)` → true if the token belongs here.
 * `modes` lists the mode names; index 0 = default/base.
 * `source(modeIndex)` returns the Map of variable values for that mode.
 */
const COLLECTION_DEFS = [
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

// ─── Exclusion + scope helpers ────────────────────────────────────────────────

function isExcluded(name) {
  const lower = name.toLowerCase();
  if (EXCLUSION_EXACT.has(lower)) {
    return true;
  }
  return EXCLUSION_PATTERNS.some(p => lower.includes(p));
}

/**
 * Map a token name to Figma variable scopes using the config scope rules.
 * Rules are tested in order; first match wins. Falls back to ALL_SCOPES.
 */
function resolveFigmaScopes(name) {
  for (const rule of SCOPE_RULES) {
    const pattern = rule.pattern.replace(/\*/g, '.*').replace(/\?/g, '.');
    if (new RegExp(pattern, 'i').test(name)) {
      return rule.scopes;
    }
  }
  return ['ALL_SCOPES'];
}

/**
 * Produce the Figma codeSyntax object for a token.
 * Templates support: ${name}, ${kebab}, ${camel}
 */
function buildCodeSyntax(name) {
  const kebab = name.replace(/^--/, '').replace(/-+/g, '-');
  // camelCase: -letter → uppercase letter; -digit → just the digit (no hyphen)
  const camel = kebab.replace(/-([a-zA-Z0-9])/g, (_, c) => c.toUpperCase());
  const expand = tpl =>
    tpl
      .replace(/\$\{name\}/g, name)
      .replace(/\$\{kebab\}/g, kebab)
      .replace(/\$\{camel\}/g, camel);

  const syntax = {};
  for (const [platform, tpl] of Object.entries(CODE_SYNTAX_TEMPLATES)) {
    syntax[platform] = expand(tpl);
  }
  return syntax;
}

// ─── Value converters ─────────────────────────────────────────────────────────

/** hsl(H deg S% L%) or hsl(H, S%, L%) → Figma {r,g,b,a} (0-1 floats) */
function hslToFigmaColor(value) {
  let m = value.match(/hsl\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%(?:\s*[,/]\s*([\d.]+%?))?\s*\)/);
  if (!m) {
    return null;
  }
  let h = parseFloat(m[1]) / 360;
  let s = parseFloat(m[2]) / 100;
  let l = parseFloat(m[3]) / 100;
  const a = m[4] !== undefined ? (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4])) : 1;
  // HLS to RGB
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hue2rgb = (p, q, t) => {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    };
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 1e6) / 1e6, g: Math.round(g * 1e6) / 1e6, b: Math.round(b * 1e6) / 1e6, a };
}

/** rgb(R G B) or rgb(R, G, B) → Figma {r,g,b,a} */
function rgbToFigmaColor(value) {
  const m = value.match(/rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)/);
  if (!m) {
    return null;
  }
  const a = m[4] !== undefined ? (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4])) : 1;
  return { r: parseFloat(m[1]) / 255, g: parseFloat(m[2]) / 255, b: parseFloat(m[3]) / 255, a };
}

/** #rrggbb / #rgb → Figma {r,g,b,a} */
function hexToFigmaColor(value) {
  let hex = value.replace('#', '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  if (hex.length < 6) {
    return null;
  }
  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
    a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
  };
}

/** Resolve calc(N * 1rem / var(--cds-global-base)) → px number (base = 20) */
function resolveCalcToPx(value) {
  // calc(N * 1rem / var(--cds-global-base)) at default base 20 → N px
  let m = value.match(/calc\(\s*([\d.]+)\s*\*\s*1rem\s*\/\s*var\(--cds-global-base\)\s*\)/);
  if (m) {
    return parseFloat(m[1]);
  }
  // calc(N * 1px)
  m = value.match(/calc\(\s*([\d.]+)\s*\*\s*1px\s*\)/);
  if (m) {
    return parseFloat(m[1]);
  }
  return null;
}

/** Returns {type, value} where value is the raw Figma API value payload. */
function resolveValue(rawValue, idMap) {
  const v = rawValue.trim();

  // VARIABLE_ALIAS: var(--token-name)
  const aliasMatch = v.match(/^var\((--[a-zA-Z0-9-]+)\)$/);
  if (aliasMatch) {
    const refName = aliasMatch[1];
    const refId = idMap.get(refName);
    if (refId) {
      return { type: 'ALIAS', figmaValue: { type: 'VARIABLE_ALIAS', id: refId } };
    }
    // If the referenced var isn't in our idMap, fall through to string
  }

  // COLOR
  const color = hslToFigmaColor(v) ?? rgbToFigmaColor(v) ?? hexToFigmaColor(v);
  if (color) {
    return { type: 'COLOR', figmaValue: color };
  }

  // FLOAT: Npx
  const px = v.match(/^([\d.]+)px$/);
  if (px) {
    return { type: 'FLOAT', figmaValue: parseFloat(px[1]) };
  }

  // FLOAT: bare number (font weights, opacity, line-height)
  const bare = v.match(/^([\d.]+)$/);
  if (bare) {
    return { type: 'FLOAT', figmaValue: parseFloat(bare[1]) };
  }

  // FLOAT: N%  (e.g. border-radius: 50% → 50)
  const pct = v.match(/^([\d.]+)%$/);
  if (pct) {
    return { type: 'FLOAT', figmaValue: parseFloat(pct[1]) };
  }

  // FLOAT: calc expression
  const calcPx = resolveCalcToPx(v);
  if (calcPx !== null) {
    return { type: 'FLOAT', figmaValue: calcPx };
  }

  // STRING fallback
  return { type: 'STRING', figmaValue: v };
}

/** Infer resolvedType when creating a new variable (no existing type to check). */
// function inferType(name, value, idMap) {
//   // If it's an alias, look up the referenced type from idMap metadata
//   const aliasMatch = value.trim().match(/^var\((--[a-zA-Z0-9-]+)\)$/);
//   if (aliasMatch) {
//     const refId = idMap.get(aliasMatch[1]);
//     if (refId) {return idMap.getMeta(refId)?.type ?? 'STRING';}
//   }
//   const resolved = resolveValue(value, idMap);
//   return resolved.type === 'ALIAS' ? 'STRING' : resolved.type;
// }

// ─── Enhanced idMap with metadata ────────────────────────────────────────────

function createIdMap() {
  const nameToId = new Map();
  const idMeta = new Map();
  return {
    get: name => nameToId.get(name),
    set: (name, id, meta) => {
      nameToId.set(name, id);
      if (meta) {
        idMeta.set(id, meta);
      }
    },
    has: name => nameToId.has(name),
    getMeta: id => idMeta.get(id),
    entries: () => nameToId.entries(),
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function push() {
  console.log(
    `\n🎨  Figma token push — file: ${FIGMA_FILE_KEY}${BRANCH_NAME ? ` [branch: ${BRANCH_NAME}]` : ''}${DRY_RUN ? ' (DRY RUN)' : ''}\n`
  );

  // ── Fetch existing Figma variables ──────────────────────────────────────────
  let existingCollections = [];
  let existingVars = [];
  let existingModes = [];
  let effectiveFileKey = FIGMA_FILE_KEY;

  if (!DRY_RUN && !EXTRACT_MODE) {
    console.log('⬇️   Fetching existing Figma variables…');
    const existing = await figmaGet(`/files/${FIGMA_FILE_KEY}/variables/local`);
    existingCollections = Object.values(existing.meta?.variableCollections ?? {});
    existingModes = Object.values(existing.meta?.variableCollections ?? {}).flatMap(c =>
      c.modes.map(m => ({ ...m, collectionId: c.id }))
    );
    existingVars = Object.values(existing.meta?.variables ?? {});
  }

  // ── Branch isolation ────────────────────────────────────────────────────────
  let collectionSuffix = '';
  if (BRANCH_NAME) {
    if (FIGMA_BRANCH_MODE === 'branch' && !DRY_RUN) {
      // Target the Figma branch file key
      const branches = await figmaGet(`/files/${FIGMA_FILE_KEY}/branches`);
      const branch = branches.branches?.find(b => b.name.toLowerCase().includes(BRANCH_NAME.toLowerCase()));
      if (branch) {
        effectiveFileKey = branch.key;
        console.log(`🌿  Targeting Figma branch: ${branch.name} (${branch.key})`);
      } else {
        console.warn(`⚠️   No Figma branch found matching "${BRANCH_NAME}". Using collection suffix instead.`);
        collectionSuffix = ` [${BRANCH_NAME}]`;
      }
    } else {
      collectionSuffix = ` [${BRANCH_NAME}]`;
    }
  }

  // ── Build payload ───────────────────────────────────────────────────────────
  const idMap = createIdMap();
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

  for (const colDef of COLLECTION_DEFS) {
    const colName = colDef.name + collectionSuffix;
    const existingCol = existingCollByName.get(colName);
    const colId = existingCol ? existingCol.id : tempId();
    const isNewCol = !existingCol;

    if (isNewCol) {
      payloadCollections.push({ action: 'CREATE', id: colId, name: colName });
    }

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

    // Collect all variable names that belong to this collection (from base mode source)
    const baseSource = colDef.source(0);
    const tokenNames = [...baseSource.keys()].filter(n => colDef.filter(n) && !isExcluded(n));

    for (const cssName of tokenNames) {
      const figmaName = cssName.replace(/^--/, '').replace(/-/g, '/');
      const scopes = resolveFigmaScopes(cssName);
      const codeSyntax = buildCodeSyntax(cssName);

      const baseValue = baseSource.get(cssName) ?? '';
      const baseResolved = resolveValue(baseValue, idMap);

      // Skip tokens whose value is a complex multi-value string (calc chains, etc.)
      if (baseResolved.type === 'STRING' && baseValue.includes('var(') && baseValue.includes(',')) {
        statsSkipped++;
        continue;
      }

      const resolvedType =
        baseResolved.type === 'ALIAS'
          ? (idMap.getMeta(idMap.get(baseValue.match(/var\((--[^)]+)\)/)?.[1]))?.type ?? 'STRING')
          : baseResolved.type;

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
        const resolved = resolveValue(rawValue, idMap);
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

  // ── Stats ───────────────────────────────────────────────────────────────────
  console.log(`📊  Token plan:`);
  console.log(`    Collections : ${COLLECTION_DEFS.length}`);
  console.log(`    New vars    : ${statsNew}`);
  console.log(`    Updated vars: ${statsUpdate}`);
  console.log(`    Skipped     : ${statsSkipped}  (complex multi-value strings)`);
  console.log(`    Deletions   : ${deletedVarIds.size}  (type corrections)`);
  console.log(`    Mode values : ${payloadModeValues.length}`);

  if (DRY_RUN) {
    console.log('\n✅  Dry run complete — no changes made to Figma.\n');
    return;
  }

  // ── Extract to file ─────────────────────────────────────────────────────────
  if (EXTRACT_MODE) {
    // Build a human-readable per-collection view alongside the raw Figma payload
    const modeIdToName = new Map();
    for (const m of payloadModes) {
      modeIdToName.set(m.id, m.name);
    }

    // For existing modes (not in payloadModes) we need a lookup from existingModes
    for (const em of existingModes) {
      modeIdToName.set(em.modeId, em.name);
    }

    const collectionView = COLLECTION_DEFS.map(colDef => {
      const existingCol = existingCollByName.get(colDef.name + collectionSuffix);
      const colId = existingCol
        ? existingCol.id
        : (payloadCollections.find(c => c.name === colDef.name + collectionSuffix)?.id ?? '?');

      const modeNames = colDef.modes;
      const variables = payloadVars
        .filter(v => v.variableCollectionId === colId && v.action !== 'DELETE')
        .map(v => {
          const varModeValues = payloadModeValues.filter(mv => mv.variableId === v.id);
          const valuesByMode = {};
          for (let mi = 0; mi < modeNames.length; mi++) {
            const modeEntry = payloadModes.find(m => m.variableCollectionId === colId && m.name === modeNames[mi]);
            // Also check existingModes for this collection
            const existingModeObj = existingModes.find(m => m.collectionId === colId && m.name === modeNames[mi]);
            const modeId = modeEntry?.id ?? existingModeObj?.modeId;
            const mv = varModeValues.find(mv => mv.modeId === modeId);
            if (mv) {
              valuesByMode[modeNames[mi]] = mv.value;
            }
          }
          const cssName = '--' + v.name.replace(/\//g, '-');
          return {
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
        name: colDef.name + collectionSuffix,
        modes: modeNames,
        variableCount: variables.length,
        variables,
      };
    });

    const output = {
      generated: new Date().toISOString(),
      source: path.relative(ROOT, CSS_FILE),
      branch: BRANCH_NAME ?? null,
      summary: {
        collections: COLLECTION_DEFS.length,
        totalVariables: statsNew + statsUpdate,
        skipped: statsSkipped,
        totalModeValues: payloadModeValues.length,
      },
      collections: collectionView,
    };

    const outPath = path.resolve(ROOT, EXTRACT_FILE);
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
    console.log(`\n💾  Extracted ${statsNew + statsUpdate} tokens → ${path.relative(ROOT, outPath)}\n`);
    return;
  }

  // ── Split into batches to stay under Figma's 500-item limit per request ──────
  const BATCH = 500;
  async function batchedPush(label, allVars, allModeValues) {
    for (let i = 0; i < allVars.length; i += BATCH) {
      const slice = allVars.slice(i, i + BATCH);
      // Include mode values for the vars in this slice
      const sliceIds = new Set(slice.map(v => v.id));
      const sliceMV = allModeValues.filter(mv => sliceIds.has(mv.variableId));
      console.log(
        `  📤  ${label} batch ${Math.floor(i / BATCH) + 1}: ${slice.length} vars, ${sliceMV.length} mode values`
      );
      await figmaPost(`/files/${effectiveFileKey}/variables`, {
        variableCollections: i === 0 ? payloadCollections : [],
        variableModes: i === 0 ? payloadModes : [],
        variables: slice,
        variableModeValues: sliceMV,
      });
    }
  }

  console.log('\n⬆️   Pushing to Figma…');
  // First push: collections + modes + all create/update vars
  const createUpdateVars = payloadVars.filter(v => v.action !== 'DELETE');
  const deleteVars = payloadVars.filter(v => v.action === 'DELETE');

  if (deleteVars.length > 0) {
    console.log(`  🗑️   Deleting ${deleteVars.length} type-mismatched variables first…`);
    await figmaPost(`/files/${effectiveFileKey}/variables`, {
      variableCollections: [],
      variableModes: [],
      variables: deleteVars,
      variableModeValues: [],
    });
  }

  await batchedPush('Push', createUpdateVars, payloadModeValues);

  console.log(`\n✅  Done! ${statsNew + statsUpdate} tokens published to Figma.\n`);
}

push().catch(err => {
  console.error('❌ ', err.message);
  process.exit(1);
});
