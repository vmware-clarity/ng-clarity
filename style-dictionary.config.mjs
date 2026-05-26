/**
 * Style Dictionary v4 configuration — Figma SSOT pipeline
 *
 * Builds two SCSS partials from DTCG token files:
 *   projects/angular/styles/core/tokens/_figma-tokens.light.scss  →  :root { --cds-figma-* }
 *   projects/angular/styles/core/tokens/_figma-tokens.dark.scss   →  [cds-theme~='dark'] { --cds-figma-* }
 *
 * Both files are @forward-ed from global.scss and enter the SCSS build pipeline automatically.
 *
 * Usage:
 *   node style-dictionary.config.mjs
 *   npm run figma:build
 */

import StyleDictionary from 'style-dictionary';

// ─── Custom transforms ────────────────────────────────────────────────────────
//
// Vendor namespaces stripped from the leading token path segment before the
// platform `prefix` is prepended. This avoids redundant prefixes like
// --cds-figma-cds-global-color-blue-500 → --cds-figma-global-color-blue-500
const STRIP_LEADING_SEGMENTS = new Set(['cds', 'clr']);


/**
 * clarity/name/trim-vendor-prefix
 *
 * Strips the leading `cds` or `clr` path segment so the platform `prefix`
 * doesn't double up, e.g.:
 *   cds/global/color/blue/500  →  global-color-blue-500  →  --cds-figma-global-color-blue-500
 *   clr/base/typography/…      →  base-typography-…      →  --cds-figma-base-typography-…
 *   primary/body-text          →  primary-body-text       →  --cds-figma-primary-body-text
 */
StyleDictionary.registerTransform({
  name: 'clarity/name/trim-vendor-prefix',
  type: 'name',
  filter: () => true,
  // SD v4 passes (token, config) — config.prefix holds the platform prefix value.
  transform(token, config) {
    const path = [...token.path];
    // Strip the leading vendor namespace so the prefix doesn't double up:
    // cds/global/color/blue/500 → global-color-blue-500 → --cds-figma-global-color-blue-500
    if (STRIP_LEADING_SEGMENTS.has(path[0])) path.shift();
    return [config?.prefix, ...path].filter(Boolean).join('-');
  },
});

/**
 * clarity/value/passthrough-dimension
 *
 * SD's built-in `css` transformGroup includes `size/rem` which converts
 * any px dimension to rem. This library uses absolute `px` and `calc()` values
 * from the CDS density scale, so we override that with a no-op passthrough.
 */
StyleDictionary.registerTransform({
  name: 'clarity/value/passthrough-dimension',
  type: 'value',
  filter: token => (token.$type ?? token.type) === 'dimension',
  transform: token => token.$value ?? token.value,
});

/**
 * clarity/value/font-family
 *
 * Wraps font family names that contain spaces in double quotes so the output
 * is valid CSS (`"Metropolis", "Avenir Next", sans-serif`).
 */
StyleDictionary.registerTransform({
  name: 'clarity/value/font-family',
  type: 'value',
  filter: token => (token.$type ?? token.type) === 'fontFamily',
  transform(token) {
    const raw = token.$value ?? token.value;
    if (typeof raw !== 'string') return raw;
    return raw
      .split(',')
      .map(f => {
        const trimmed = f.trim();
        // Only quote if not already quoted and contains a space
        if (!trimmed.startsWith('"') && !trimmed.startsWith("'") && trimmed.includes(' ')) {
          return `"${trimmed}"`;
        }
        return trimmed;
      })
      .join(', ');
  },
});

/**
 * clarity/value/color-passthrough
 *
 * SD's built-in `color/css` transform can try to re-parse HSL strings with
 * the `deg` suffix (e.g. `hsl(198deg 100% 48%)`). This passthrough keeps the
 * exact string produced by figma-extract.mjs without normalisation.
 */
StyleDictionary.registerTransform({
  name: 'clarity/value/color-passthrough',
  type: 'value',
  filter: token => (token.$type ?? token.type) === 'color',
  transform: token => token.$value ?? token.value,
});

// ─── Custom transform group: clarity/css ──────────────────────────────────────

StyleDictionary.registerTransformGroup({
  name: 'clarity/css',
  transforms: [
    'attribute/cti',                       // adds category/type/item metadata
    'clarity/name/trim-vendor-prefix',     // strips leading cds/clr namespace segment
    'clarity/value/color-passthrough',     // keep HSL strings verbatim
    'clarity/value/passthrough-dimension', // keep px/calc values verbatim (skip size/rem)
    'clarity/value/font-family',           // quote font names with spaces
    'time/seconds',                        // duration values
  ],
});

// ─── Shared platform builder ──────────────────────────────────────────────────

// SCSS partials so they can be @forward-ed directly from global.scss
const OUTPUT_DIR = 'projects/angular/styles/core/tokens/';

/**
 * @param {string} destination  e.g. "_figma-tokens.light.scss"
 * @param {string} selector     e.g. ":root" or "[cds-theme~='dark']"
 */
function cssPlatform(destination, selector) {
  return {
    transformGroup: 'clarity/css',
    prefix: 'cds-figma',
    buildPath: OUTPUT_DIR,
    files: [
      {
        destination,
        format: 'css/variables',
        options: {
          selector,
          // Keep {alias.references} as var(--cds-figma-*) instead of resolving
          outputReferences: true,
          usesDtcg: true,
        },
      },
    ],
  };
}

// ─── Build: Light tokens ─────────────────────────────────────────────────────

const sdLight = new StyleDictionary({
  source: ['tokens/global/**/*.json', 'tokens/themes/light.json'],
  usesDtcg: true,
  log: { verbosity: 'default' },
  platforms: {
    cssLight: cssPlatform('_figma-tokens.light.scss', ':root'),
  },
});

// ─── Build: Dark tokens ──────────────────────────────────────────────────────

const sdDark = new StyleDictionary({
  source: ['tokens/global/**/*.json', 'tokens/themes/dark.json'],
  usesDtcg: true,
  log: { verbosity: 'default' },
  platforms: {
    cssDark: cssPlatform('_figma-tokens.dark.scss', "[cds-theme~='dark']"),
  },
});

// ─── Post-build cleanup ───────────────────────────────────────────────────────
//
// Style Dictionary emits literal DTCG alias strings (e.g. `{path.to.token}`)
// when a cross-collection reference can't be resolved at build time. These are
// invalid CSS values and must be stripped before the file is used.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function stripUnresolvedAliases(filePath) {
  if (!existsSync(filePath)) return;
  const original = readFileSync(filePath, 'utf-8');
  // Remove any line whose value is still a DTCG reference like `{some.path};`
  const cleaned = original
    .split('\n')
    .filter(line => !/:\s*\{[^}]+\};/.test(line))
    .join('\n');
  const removed = (original.match(/:\s*\{[^}]+\};/g) ?? []).length;
  if (removed > 0) {
    writeFileSync(filePath, cleaned, 'utf-8');
    console.log(`  🧹  Stripped ${removed} unresolved alias line(s) from ${filePath.split('/').pop()}`);
  }
}

// ─── Run ─────────────────────────────────────────────────────────────────────

try {
  await sdLight.buildAllPlatforms();
  const lightPath = join(__dirname, OUTPUT_DIR, '_figma-tokens.light.scss');
  stripUnresolvedAliases(lightPath);
  console.log('✅  Light → ' + OUTPUT_DIR + '_figma-tokens.light.scss');
} catch (err) {
  console.warn('⚠  Light build skipped:', err.message);
}

try {
  await sdDark.buildAllPlatforms();
  const darkPath = join(__dirname, OUTPUT_DIR, '_figma-tokens.dark.scss');
  stripUnresolvedAliases(darkPath);
  console.log('✅  Dark  → ' + OUTPUT_DIR + '_figma-tokens.dark.scss');
} catch (err) {
  console.warn('⚠  Dark build skipped:', err.message);
}
