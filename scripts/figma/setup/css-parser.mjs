/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * CSS parsing for the compiled clr-ui stylesheet.
 *
 * Extracts custom-property declarations per selector and resolves the canonical
 * mode buckets (root / dark / compact), merging the shorthand dual-selector
 * blocks that apply to both modes equally.
 */

// Canonical selectors we care about.
// The "bare" DARK / COMPACT forms (without :where(:root,:host) prefix) are the
// primary sources for mode overrides in the compiled Clarity stylesheet.
export const SELECTORS = {
  ROOT: ':where(:root, :host)',
  DARK: '[cds-theme~=dark]',
  COMPACT: '[clr-density=compact]',
  get BOTH_THEME() {
    return `${this.ROOT}, ${this.ROOT} [cds-theme]`;
  },
  get BOTH_DENSITY() {
    return `${this.ROOT}, ${this.ROOT} [clr-density]`;
  },
};

/**
 * Fast line-scanner CSS parser: extracts custom property declarations per selector.
 * Returns a Map<selectorString, Map<propName, value>>.
 *
 * Assumes compiled SCSS output where:
 * - Each custom property declaration occupies exactly one line: `  --name: value;`
 * - Selector lines end with `{`
 * - Block endings are `}` lines
 * This is always true for output from `sass` / `csso`.
 *
 * @param {string} css
 * @returns {Map<string, Map<string, string>>}
 */
export function parseCssBlocks(css) {
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

/**
 * Parsed CSS variable maps, keyed by mode name.
 * Keys match the `CssModeSource` union used in `config.mjs` and `figma-tokens.config.json`.
 *
 * @typedef {{ root: Map<string, string>, dark: Map<string, string>, compact: Map<string, string> }} ModeVars
 */

/**
 * Resolve the canonical per-mode variable maps from parsed CSS blocks.
 *
 * Merges the shorthand dual-selector blocks (which apply to both modes equally)
 * into the base buckets without overwriting mode-specific declarations.
 *
 * @param {Map<string, Map<string, string>>} allBlocks
 * @returns {ModeVars}
 */
export function resolveModeVars(allBlocks) {
  const root = allBlocks.get(SELECTORS.ROOT) ?? new Map();
  // Primary dark overrides live in the bare [cds-theme~=dark] block (235 props).
  const dark = new Map(allBlocks.get(SELECTORS.DARK) ?? []);

  // Compact overrides live in [clr-density=compact].
  const compact = new Map(allBlocks.get(SELECTORS.COMPACT) ?? []);

  // Merge shorthand dual-selector blocks (these apply to both modes equally).
  // Only fills gaps — never overwrites mode-specific declarations.
  const bothTheme = allBlocks.get(SELECTORS.BOTH_THEME) ?? new Map();
  const bothDensity = allBlocks.get(SELECTORS.BOTH_DENSITY) ?? new Map();

  for (const [k, v] of bothTheme) {
    if (!root.has(k)) {
      root.set(k, v);
    }
    if (!dark.has(k)) {
      dark.set(k, v);
    }
  }
  for (const [k, v] of bothDensity) {
    if (!root.has(k)) {
      root.set(k, v);
    }
    if (!compact.has(k)) {
      compact.set(k, v);
    }
  }

  return { root, dark, compact };
}
