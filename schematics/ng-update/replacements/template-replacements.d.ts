/**
 * HTML template replacements for v18 migration.
 *
 * Covers Angular output renames, attribute binding changes, and selector updates.
 */
export interface TemplateReplacement {
    readonly old: string;
    readonly new: string;
    readonly context?: string;
}
export declare const TEMPLATE_OUTPUT_REPLACEMENTS: readonly TemplateReplacement[];
export declare const TEMPLATE_ATTRIBUTE_REPLACEMENTS: readonly TemplateReplacement[];
export declare const TEMPLATE_INPUT_REPLACEMENTS: readonly TemplateReplacement[];
/**
 * Substrings that trigger the clr-datagrid–scoped migration pass (see template-migration).
 * `clrDgItemsTrackBy` alone can appear on clr-dg-items (unchanged); the pass no-ops without `<clr-datagrid`.
 */
export declare const TEMPLATE_DATAGRID_MIGRATION_CANDIDATES: readonly string[];
export declare const HEADER_CLASS_REPLACEMENTS: readonly TemplateReplacement[];
