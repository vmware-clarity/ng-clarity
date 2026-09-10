import { Rule } from '@angular-devkit/schematics';
export declare const IMPORT_MIGRATION_CANDIDATES: readonly string[];
export declare function transformImports(text: string): string;
export declare function migrateImports(): Rule;
