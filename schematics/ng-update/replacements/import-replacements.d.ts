/**
 * TypeScript import path and symbol replacements for v18 migration.
 *
 * Each entry maps an old import to its replacement. The migration will update
 * both the import specifier and optionally rename the imported symbol.
 */
export interface ImportReplacement {
    readonly oldModule: string;
    readonly newModule: string;
    readonly oldSymbol: string;
    readonly newSymbol: string;
}
export declare const IMPORT_REPLACEMENTS: readonly ImportReplacement[];
