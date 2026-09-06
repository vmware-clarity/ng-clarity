/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Color } from './color';
import { TOKEN_KEYS } from './presets';
import { CdsThemeStructure } from './types';

const THEME_BLOCK_REGEX = /\[cds-theme~=['"](light|dark)['"]\]\s*\{([^}]*)\}/g;
const TOKEN_DECLARATION_REGEX = /(--[\w-]+)\s*:\s*(hsl\([^);]*\))\s*;/g;

/** Reverse lookup from a CSS custom property name to the `TOKEN_KEYS` group it belongs to. */
const TOKEN_TO_GROUP: Record<string, string> = {};
for (const [group, tokens] of Object.entries(TOKEN_KEYS)) {
  if (group === 'baseTokens') {
    continue;
  }

  for (const token of tokens) {
    TOKEN_TO_GROUP[token] = group;
  }
}

/**
 * Reverses `generateCSS` — parses previously generated theme-override CSS back into a
 * `CdsThemeStructure`, grouped exactly like `colorStruct` (one `Color[]` per token group,
 * per theme), so callers can apply it the same way they'd apply any other color group.
 * Only reads the `[cds-theme~='light'|'dark'] { --token: hsl(...); }` blocks `generateCSS`
 * emits; the shared `[cds-theme] { ... }` alias-override block (whose values are `var(...)`
 * references, not literal HSL) and the warning-text-override line are ignored, since
 * neither matches the `hsl(...)` declaration pattern. A token that isn't a recognized
 * theme color (i.e. not present in `TOKEN_KEYS`) is skipped.
 */
export function parseGeneratedCSS(css: string): CdsThemeStructure {
  const result: CdsThemeStructure = { light: {}, dark: {} };

  for (const blockMatch of css.matchAll(THEME_BLOCK_REGEX)) {
    const theme = blockMatch[1] as 'light' | 'dark';
    const body = blockMatch[2];

    for (const tokenMatch of body.matchAll(TOKEN_DECLARATION_REGEX)) {
      const [, tokenName, hslValue] = tokenMatch;
      const group = TOKEN_TO_GROUP[tokenName];

      if (!group) {
        continue;
      }

      (result[theme][group] ??= []).push(new Color(tokenName, hslValue));
    }
  }

  return result;
}
