/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ThemeType } from '@clr/angular';

import { Color } from './color';
import { TOKEN_KEYS } from './presets';
import { CdsThemeStructure } from './types';

const THEME_BLOCK_REGEX = /\[cds-theme~=['"](light|dark)['"]\]\s*\{([^}]*)\}/g;
const COMMENT_REGEX = /\/\*[\s\S]*?\*\//g;
const DECLARATION_REGEX = /^(--[\w-]+)\s*:\s*([\s\S]+)$/;

/**
 * Accepted `hsl()` shapes: the hue in degrees (`deg` optional), then saturation and
 * lightness in `%`, separated either all by commas or all by whitespace — e.g.
 * `hsl(281deg, 50%, 20%)` (what `Color.hsl` emits), `hsl(281, 50%, 20%)` or
 * `hsl(281 50% 20%)`. Anything else (other units, extra components, `none`, mixed
 * separators, malformed numbers) is rejected rather than guessed at.
 */
const NUMBER = String.raw`-?\d+(?:\.\d+)?(?:e[-+]?\d+)?`;
const HUE = String.raw`(${NUMBER})(?:deg)?`;
const PERCENT = String.raw`(${NUMBER})%`;
const HSL_REGEX = new RegExp(
  String.raw`^hsl\(\s*(?:${HUE},\s*${PERCENT},\s*${PERCENT}|${HUE}\s+${PERCENT}\s+${PERCENT})\s*\)$`,
  'i'
);

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
  /** Theme-block declarations that aren't in an accepted shape (see `HSL_REGEX`), as written. */
  malformedDeclarations: string[];
  /** Themes whose `[cds-theme~='light'|'dark']` block appears more than once. */
  duplicateThemeBlocks: ThemeType[];
  /** Tokens declared more than once for the same theme, listed once each. */
  duplicateTokens: { theme: ThemeType; tokenName: string }[];
}

interface ThemeDeclaration {
  theme: ThemeType;
  /** Group in `TOKEN_KEYS`, or `undefined` when the token isn't a theme color. */
  group: string | undefined;
  tokenName: string;
  value: string;
  /** The declaration as written (comments stripped, whitespace trimmed). */
  source: string;
  /** `true` when the declaration is in an accepted shape (see `HSL_REGEX`). */
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
 * Checks that `css` can be imported, before it's applied. It's malformed when a theme color
 * in a `[cds-theme~='light'|'dark']` block, or any `hsl()` value there, isn't in an accepted
 * `hsl()` shape (see `HSL_REGEX`; saturation and lightness within 0–100), or when a block
 * holds anything other than a custom-property declaration. Each theme block may appear only
 * once, and each token only once per theme; repeats are reported and make the CSS invalid.
 * CSS with no recognized theme color at all (including `generateCSS`'s output for an
 * unchanged theme) is rejected too, since importing it would only reset the colors.
 */
export function validateGeneratedCSS(css: string): ThemeCssValidation {
  const malformedDeclarations: string[] = [];
  const duplicateThemeBlocks: ThemeType[] = [];
  const duplicateTokens: ThemeCssValidation['duplicateTokens'] = [];
  const seenThemes = new Set<ThemeType>();
  const seenTokens = { light: new Set<string>(), dark: new Set<string>() };
  let recognizedTokens = 0;

  for (const blockMatch of css.matchAll(THEME_BLOCK_REGEX)) {
    const theme = blockMatch[1] as ThemeType;

    if (seenThemes.has(theme) && !duplicateThemeBlocks.includes(theme)) {
      duplicateThemeBlocks.push(theme);
    }

    seenThemes.add(theme);
  }

  for (const declaration of readThemeDeclarations(css)) {
    const { theme, tokenName } = declaration;

    if (tokenName && seenTokens[theme].has(tokenName)) {
      if (!duplicateTokens.some(d => d.theme === theme && d.tokenName === tokenName)) {
        duplicateTokens.push({ theme, tokenName });
      }
    } else if (tokenName) {
      seenTokens[theme].add(tokenName);
    }

    if (!declaration.wellFormed) {
      malformedDeclarations.push(declaration.source);
    } else if (declaration.group) {
      recognizedTokens++;
    }
  }

  const valid =
    !malformedDeclarations.length && !duplicateThemeBlocks.length && !duplicateTokens.length && recognizedTokens > 0;

  return { valid, malformedDeclarations, duplicateThemeBlocks, duplicateTokens };
}

function readThemeDeclarations(css: string): ThemeDeclaration[] {
  const declarations: ThemeDeclaration[] = [];

  for (const blockMatch of css.matchAll(THEME_BLOCK_REGEX)) {
    const theme = blockMatch[1] as ThemeType;
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
        wellFormed: !checked || isAcceptedHsl(trimmedValue),
      });
    }
  }

  return declarations;
}

function isAcceptedHsl(value: string): boolean {
  const match = value.match(HSL_REGEX);

  if (!match) {
    return false;
  }

  // Only one of the two alternatives in `HSL_REGEX` matched, so its three groups are the defined ones.
  const [h, s, l] = match
    .slice(1)
    .filter(group => group !== undefined)
    .map(Number);

  return Number.isFinite(h) && s >= 0 && s <= 100 && l >= 0 && l <= 100;
}
