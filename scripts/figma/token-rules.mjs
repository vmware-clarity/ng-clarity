/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Token-level rules derived from configuration: exclusions, Figma scopes, and
 * the per-platform codeSyntax mapping.
 *
 * Exposed as a factory bound to a loaded config so the rest of the pipeline can
 * call simple predicates/mappers without re-threading config everywhere.
 */

/**
 * Create the token rule helpers bound to a loaded config.
 *
 * @param {import('./config.mjs').FigmaTokensConfig} config
 * @returns {{
 *   isExcluded: (name: string) => boolean,
 *   resolveFigmaScopes: (name: string) => string[],
 *   buildCodeSyntax: (name: string) => Record<string, string>,
 * }}
 */
export function createTokenRules({ exclusionPatterns, exclusionExact, scopeRules, codeSyntaxTemplates }) {
  /**
   * @param {string} name
   * @returns {boolean}
   */
  function isExcluded(name) {
    const lower = name.toLowerCase();
    if (exclusionExact.has(lower)) {
      return true;
    }
    return exclusionPatterns.some(p => lower.includes(p));
  }

  /**
   * Map a token name to Figma variable scopes using the config scope rules.
   * Rules are tested in order; first match wins. Falls back to ALL_SCOPES.
   *
   * @param {string} name
   * @returns {string[]}
   */
  function resolveFigmaScopes(name) {
    for (const rule of scopeRules) {
      const pattern = rule.pattern.replace(/\*/g, '.*').replace(/\?/g, '.');
      if (new RegExp(pattern, 'i').test(name)) {
        return rule.scopes;
      }
    }
    return ['ALL_SCOPES'];
  }

  /**
   * Produce the Figma codeSyntax object for a token.
   * Templates support: ${name}, ${kebab}, ${camel}
   *
   * @param {string} name
   * @returns {Record<string, string>}
   */
  function buildCodeSyntax(name) {
    const kebab = name.replace(/^--/, '').replace(/-+/g, '-');
    // camelCase: -letter → uppercase letter; -digit → just the digit (no hyphen)
    const camel = kebab.replace(/-([a-zA-Z0-9])/g, (_, c) => c.toUpperCase());
    const expand = tpl =>
      tpl
        .replace(/\$\{name\}/g, name)
        .replace(/\$\{kebab\}/g, kebab)
        .replace(/\$\{camel\}/g, camel);

    const syntax = {};
    for (const [platform, tpl] of Object.entries(codeSyntaxTemplates)) {
      syntax[platform] = expand(tpl);
    }
    return syntax;
  }

  return { isExcluded, resolveFigmaScopes, buildCodeSyntax };
}
