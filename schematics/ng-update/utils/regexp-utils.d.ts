/** Escapes all regex special characters in a literal string. */
export declare function escapeRegExp(str: string): string;
/**
 * Builds a regex that matches the literal string only at whole-identifier
 * boundaries (\b), preventing partial matches inside longer names.
 * The `g` flag is set so the regex can be reused with lastIndex reset.
 */
export declare function wordBoundaryRegex(literal: string): RegExp;
/**
 * Builds a regex that matches the literal string only when it is NOT
 * immediately followed by a hyphen or word character.
 * Used for CSS custom properties to prevent `--clr-foo` from matching
 * inside `--clr-foo-extra`.
 * The `g` flag is set so the regex can be reused with lastIndex reset.
 */
export declare function prefixNegativeLookaheadRegex(literal: string): RegExp;
