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
 * @typedef {'root' | 'dark' | 'compact'} CssModeSource
 * Identifies which parsed CSS variable map a collection mode reads from.
 */

/**
 * @typedef {Object} CollectionModeConfig
 * @property {string} name Mode display name shown in Figma.
 * @property {CssModeSource} source Which CSS variable map to use for this mode.
 */

/**
 * @typedef {Object} CollectionFilterConfig
 * @property {string[]} include CSS variable name prefixes; a token must start with at least one (OR).
 * @property {string[]} [exclude] CSS variable name prefixes; a token must not start with any (OR).
 */

/**
 * @typedef {Object} CollectionConfig
 * @property {string} name Collection display name shown in Figma.
 * @property {CollectionFilterConfig} filter Which CSS tokens belong to this collection.
 * @property {CollectionModeConfig[]} modes Mode list; index 0 is the default/base mode.
 * @property {Record<string, string>} [humanReadable] When present this collection is populated
 *   from these entries (display name → CSS var) rather than CSS token scanning.
 *   CSS `filter.include` may be empty for such collections.
 */

/**
 * @typedef {Object} FigmaTokensConfig
 * @property {CollectionConfig[]} collections Ordered collection definitions.
 * @property {string[]} exclusionPatterns Lowercased substrings for simple matching.
 * @property {Set<string>} exclusionExact Lowercased exact token names to exclude.
 * @property {Array<{pattern: string, scopes: string[]}>} scopeRules Ordered scope rules; first match wins.
 * @property {Record<string, string>} codeSyntaxTemplates Platform → template string.
 */

const VALID_SOURCES = new Set(['root', 'dark', 'compact']);

/**
 * Load and normalize the token publisher configuration.
 *
 * @param {string} configPath Absolute path to figma-tokens.config.json.
 * @returns {FigmaTokensConfig}
 */
export function loadConfig(configPath) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const collections = (config.collections ?? []).map((col, i) => {
    if (!col.name) {
      throw new Error(`collections[${i}]: "name" is required`);
    }

    const isHumanReadable = col.humanReadable && typeof col.humanReadable === 'object';

    if (!isHumanReadable && (!Array.isArray(col.filter?.include) || col.filter.include.length === 0)) {
      throw new Error(`collections[${i}] ("${col.name}"): filter.include must be a non-empty array`);
    }

    if (!Array.isArray(col.modes) || col.modes.length === 0) {
      throw new Error(`collections[${i}] ("${col.name}"): modes must be a non-empty array`);
    }

    for (const mode of col.modes) {
      if (!VALID_SOURCES.has(mode.source)) {
        throw new Error(
          `collections[${i}] ("${col.name}") mode "${mode.name}": source must be one of ${[...VALID_SOURCES].join(', ')}`
        );
      }
    }

    // Strip _comment and other meta keys, then validate values are CSS custom properties.
    let humanReadable;
    if (isHumanReadable) {
      humanReadable = /** @type {Record<string, string>} */ (
        Object.fromEntries(Object.entries(col.humanReadable).filter(([k]) => !k.startsWith('_')))
      );

      // Values are CSS custom-property names; a typo without the "--" prefix would
      // silently produce zero aliases, so fail loudly instead.
      for (const [displayName, cssVar] of Object.entries(humanReadable)) {
        if (!cssVar.startsWith('--')) {
          throw new Error(
            `collections[${i}] ("${col.name}") humanReadable["${displayName}"] value "${cssVar}" must start with "--" (CSS custom property name).`
          );
        }
      }
    }

    return /** @type {CollectionConfig} */ ({
      name: col.name,
      filter: { include: col.filter.include, exclude: col.filter.exclude ?? [] },
      modes: col.modes.map(m => ({ name: m.name, source: m.source })),
      ...(humanReadable ? { humanReadable } : {}),
    });
  });

  const exclusionPatterns = (config.exclusions?.patterns ?? []).map(p => p.toLowerCase());
  const exclusionExact = new Set((config.exclusions?.exact ?? []).map(n => n.toLowerCase()));
  const scopeRules = config.scopeRules ?? [];

  const codeSyntaxTemplates = (() => {
    const raw = config.codeSyntax ?? DEFAULT_CODE_SYNTAX;
    // Strip _comment and other non-platform keys
    return Object.fromEntries(Object.entries(raw).filter(([k]) => !k.startsWith('_')));
  })();

  return { collections, exclusionPatterns, exclusionExact, scopeRules, codeSyntaxTemplates };
}
