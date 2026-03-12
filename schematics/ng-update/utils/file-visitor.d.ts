import { Tree } from '@angular-devkit/schematics';
/**
 * Visits all files in the tree matching a glob-like pattern.
 * Supports simple extension matching: '**\/*.ts', '**\/*.html', '**\/*.{css,scss,sass,less}'
 */
export declare function visitFiles(tree: Tree, pattern: string, callback: (filePath: string) => void): void;
