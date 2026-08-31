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

import postcss from 'postcss';

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
 * Extracts custom property declarations per selector from compiled CSS.
 * Returns a Map<selectorString, Map<propName, value>>.
 *
 * Only scans rules at the root of the stylesheet — declarations nested inside
 * at-rules (@media, @keyframes, …) are not collected, matching how this tool
 * has always worked: none of the SELECTORS above ever appear inside one in the
 * compiled Clarity stylesheet.
 *
 * @param {string} css
 * @returns {Map<string, Map<string, string>>}
 */
export function parseCssBlocks(css) {
  const blocks = new Map();
  const root = postcss.parse(css);

  root.each(node => {
    if (node.type !== 'rule') {
      return;
    }

    // Normalize whitespace so a selector the compiler wrapped across multiple
    // lines still matches the single-line SELECTORS constants below.
    const selector = node.selector.replace(/\s+/g, ' ').trim();

    for (const decl of node.nodes) {
      const value = decl.type === 'decl' ? decl.value.trim() : '';
      if (decl.type !== 'decl' || !decl.prop.startsWith('--') || !value) {
        continue;
      }
      if (!blocks.has(selector)) {
        blocks.set(selector, new Map());
      }
      blocks.get(selector).set(decl.prop, value);
    }
  });

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
