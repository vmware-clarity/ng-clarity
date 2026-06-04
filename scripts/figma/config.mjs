/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Configuration loading for the Figma token publisher.
 *
 * Reads figma-tokens.config.json and derives the normalized lookup structures
 * (exclusions, scope rules, code-syntax templates) consumed by the token rules.
 */

import fs from 'node:fs';

const DEFAULT_CODE_SYNTAX = { WEB: 'var(${name})', ANDROID: '@clr/${kebab}', iOS: 'Clarity.${camel}' };

/**
 * @typedef {Object} FigmaTokensConfig
 * @property {string[]} exclusionPatterns Lowercased substrings for simple matching.
 * @property {Set<string>} exclusionExact Lowercased exact token names to exclude.
 * @property {Array<{pattern: string, scopes: string[]}>} scopeRules Ordered scope rules; first match wins.
 * @property {Record<string, string>} codeSyntaxTemplates Platform → template string.
 */

/**
 * Load and normalize the token publisher configuration.
 *
 * @param {string} configPath Absolute path to figma-tokens.config.json.
 * @returns {FigmaTokensConfig}
 */
export function loadConfig(configPath) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const exclusionPatterns = (config.exclusions?.patterns ?? []).map(p => p.toLowerCase());
  const exclusionExact = new Set((config.exclusions?.exact ?? []).map(n => n.toLowerCase()));
  const scopeRules = config.scopeRules ?? [];

  const codeSyntaxTemplates = (() => {
    const raw = config.codeSyntax ?? DEFAULT_CODE_SYNTAX;
    // Strip _comment and other non-platform keys
    return Object.fromEntries(Object.entries(raw).filter(([k]) => !k.startsWith('_')));
  })();

  return { exclusionPatterns, exclusionExact, scopeRules, codeSyntaxTemplates };
}
