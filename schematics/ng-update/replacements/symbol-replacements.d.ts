/**
 * TypeScript symbol renames for v18 migration.
 *
 * These are applied across all .ts files after import path updates.
 */
export interface SymbolReplacement {
    readonly old: string;
    readonly new: string;
    readonly context?: string;
}
export declare const SYMBOL_REPLACEMENTS: readonly SymbolReplacement[];
