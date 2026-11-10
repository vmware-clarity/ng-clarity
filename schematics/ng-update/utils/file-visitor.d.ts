import { Tree } from '@angular-devkit/schematics';
/**
 * Visits all files in the tree matching a glob-like pattern.
 * Supports simple extension matching: '**\/*.ts', '**\/*.html', '**\/*.{css,scss,sass,less}'
 *
 * Skips generated/build directories and .d.ts declaration files for performance.
 */
export declare function visitFiles(tree: Tree, pattern: string, callback: (filePath: string) => void): void;
