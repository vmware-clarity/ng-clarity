/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** Escapes all regex special characters in a literal string. */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds a regex that matches the literal string only at whole-identifier
 * boundaries (\b), preventing partial matches inside longer names.
 * The `g` flag is set so the regex can be reused with lastIndex reset.
 */
export function wordBoundaryRegex(literal: string): RegExp {
  return new RegExp(`\\b${escapeRegExp(literal)}\\b`, 'g');
}

/**
 * Builds a regex that matches the literal string only when it is NOT
 * immediately followed by a hyphen or word character.
 * Used for CSS custom properties to prevent `--clr-foo` from matching
 * inside `--clr-foo-extra`.
 * The `g` flag is set so the regex can be reused with lastIndex reset.
 */
export function prefixNegativeLookaheadRegex(literal: string): RegExp {
  return new RegExp(`${escapeRegExp(literal)}(?![-\\w])`, 'g');
}
