import { Rule } from '@angular-devkit/schematics';
export declare const TEMPLATE_MIGRATION_HTML_CANDIDATES: readonly string[];
export declare const TEMPLATE_MIGRATION_INLINE_CANDIDATES: readonly string[];
export declare function transformInlineTemplates(text: string): string;
export declare function migrateTemplates(): Rule;
export declare function applyHtmlTransforms(text: string): string;
