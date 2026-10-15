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
const COMMENT_REGEX = /\/\*[\s\S]*?\*\//g;
const DECLARATION_REGEX = /^(--[\w-]+)\s*:\s*([\s\S]+)$/;

/**
 * The exact `hsl(<h>deg, <s>%, <l>%)` shape `Color.hsl` emits, and so the only one
 * `generateCSS` produces. Anything else (missing units, extra components, `turn`,
 * `none`, malformed numbers) is rejected rather than guessed at.
 */
const NUMBER = String.raw`-?\d+(?:\.\d+)?(?:e[-+]?\d+)?`;
const GENERATED_HSL_REGEX = new RegExp(String.raw`^hsl\(\s*(${NUMBER})deg,\s*(${NUMBER})%,\s*(${NUMBER})%\s*\)$`, 'i');

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

/** Result of `validateGeneratedCSS`. */
export interface ThemeCssValidation {
  /** `true` when the CSS can be imported as is. */
  valid: boolean;
  /** Theme-block declarations that aren't in the shape `generateCSS` emits, as written. */
  malformedDeclarations: string[];
}

interface ThemeDeclaration {
  theme: 'light' | 'dark';
  /** Group in `TOKEN_KEYS`, or `undefined` when the token isn't a theme color. */
  group: string | undefined;
  tokenName: string;
  value: string;
  /** The declaration as written (comments stripped, whitespace trimmed). */
  source: string;
  /** `true` when the declaration is in the shape `generateCSS` emits. */
  wellFormed: boolean;
}

/**
 * Reverses `generateCSS` — parses previously generated theme-override CSS back into a
 * `CdsThemeStructure`, grouped exactly like `colorStruct` (one `Color[]` per token group,
 * per theme), so callers can apply it the same way they'd apply any other color group.
 * Only reads the `[cds-theme~='light'|'dark'] { --token: hsl(...); }` blocks `generateCSS`
 * emits; the shared `[cds-theme] { ... }` alias-override block and the warning-text-override
 * line (whose values are `var(...)` references, not HSL) are ignored. A token that isn't a
 * recognized theme color (i.e. not present in `TOKEN_KEYS`) is skipped, and so is any
 * declaration `validateGeneratedCSS` reports as malformed.
 */
export function parseGeneratedCSS(css: string): CdsThemeStructure {
  const result: CdsThemeStructure = { light: {}, dark: {} };

  for (const declaration of readThemeDeclarations(css)) {
    if (!declaration.group || !declaration.wellFormed) {
      continue;
    }

    (result[declaration.theme][declaration.group] ??= []).push(new Color(declaration.tokenName, declaration.value));
  }

  return result;
}

/**
 * Checks that `css` is something `generateCSS` could have produced, before it's imported.
 * It's malformed when a theme color in a `[cds-theme~='light'|'dark']` block, or any `hsl()`
 * value there, isn't in the exact `hsl(<h>deg, <s>%, <l>%)` shape (saturation and lightness
 * within 0–100), or when a block holds anything other than a custom-property declaration.
 * CSS with no recognized theme color at all (including `generateCSS`'s output for an
 * unchanged theme) is rejected too, since importing it would only reset the colors.
 */
export function validateGeneratedCSS(css: string): ThemeCssValidation {
  const malformedDeclarations: string[] = [];
  let recognizedTokens = 0;

  for (const declaration of readThemeDeclarations(css)) {
    if (!declaration.wellFormed) {
      malformedDeclarations.push(declaration.source);
    } else if (declaration.group) {
      recognizedTokens++;
    }
  }

  const valid = !malformedDeclarations.length && recognizedTokens > 0;

  return { valid, malformedDeclarations };
}

function readThemeDeclarations(css: string): ThemeDeclaration[] {
  const declarations: ThemeDeclaration[] = [];

  for (const blockMatch of css.matchAll(THEME_BLOCK_REGEX)) {
    const theme = blockMatch[1] as 'light' | 'dark';
    const body = blockMatch[2].replace(COMMENT_REGEX, '');

    for (const rawDeclaration of body.split(';')) {
      const source = rawDeclaration.trim();

      if (!source) {
        continue;
      }

      const [, tokenName = '', value = ''] = source.match(DECLARATION_REGEX) ?? [];
      const group = TOKEN_TO_GROUP[tokenName];
      const trimmedValue = value.trim();
      const checked = !tokenName || !!group || /^hsl\(/i.test(trimmedValue);

      declarations.push({
        theme,
        group,
        tokenName,
        value: trimmedValue,
        source,
        wellFormed: !checked || isGeneratedHsl(trimmedValue),
      });
    }
  }

  return declarations;
}

function isGeneratedHsl(value: string): boolean {
  const match = value.match(GENERATED_HSL_REGEX);

  if (!match) {
    return false;
  }

  const [h, s, l] = match.slice(1).map(Number);

  return Number.isFinite(h) && s >= 0 && s <= 100 && l >= 0 && l <= 100;
}
