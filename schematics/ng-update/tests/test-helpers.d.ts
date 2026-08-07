import { HostTree, SchematicContext } from '@angular-devkit/schematics';
export declare function createContext(): SchematicContext;
/** Runs all three migration phases against an in-memory tree (mirrors index.ts). */
export declare function runMigrations(tree: HostTree): HostTree;
/** Applies all pure TypeScript transforms in sequence (mirrors the unified pass in index.ts). */
export declare function applyTsTransforms(text: string): string;
