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
export declare const HEADER_CLASS_REPLACEMENTS: readonly TemplateReplacement[];
