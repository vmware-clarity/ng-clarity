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
/**
 * SCSS/Sass mixin names that have been removed in v18.
 * Any `@include <name>(...)` call will be commented out with a TODO note.
 */
export declare const REMOVED_SCSS_MIXINS: readonly string[];
