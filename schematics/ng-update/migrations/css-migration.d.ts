import { Rule } from '@angular-devkit/schematics';
export declare const CSS_MIGRATION_CANDIDATES: readonly string[];
export declare const CSS_MIGRATION_INLINE_CANDIDATES: readonly string[];
export declare function transformInlineStyles(text: string): string;
export declare function migrateCssProperties(): Rule;
