/**
 * CSS custom property renames and removals for v18 migration.
 *
 * Applied to .scss, .css, and inline template styles.
 */
export interface CssReplacement {
    readonly old: string;
    readonly new: string;
}
export declare const CSS_PROPERTY_REPLACEMENTS: readonly CssReplacement[];
export declare const CSS_SELECTOR_REPLACEMENTS: readonly CssReplacement[];
export declare const CSS_ATTRIBUTE_REPLACEMENTS: readonly CssReplacement[];
