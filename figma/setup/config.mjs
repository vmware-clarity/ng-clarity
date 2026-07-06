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
import path from 'node:path';
import Ajv from 'ajv';

const DEFAULT_CODE_SYNTAX = { WEB: 'var(${name})' };
const SCHEMA_FILENAME = 'figma-tokens.config.schema.json';

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
 * @property {boolean} hiddenFromPublishing When true, the collection and all its variables
 *   are hidden from publishing. Defaults to false.
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

/**
 * Validate the raw parsed config against figma-tokens.config.schema.json (the
 * same schema referenced by the config's own "$schema" for editor tooling).
 * Covers required fields, types, enums (e.g. mode.source), and the
 * humanReadable value "--" pattern — everything the schema can express as a
 * single JSON Schema constraint.
 *
 * @param {Object} config
 * @param {string} configPath Used to locate the schema file alongside the config.
 */
function validateAgainstSchema(config, configPath) {
  const schemaPath = path.join(path.dirname(configPath), SCHEMA_FILENAME);
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const validate = new Ajv({ allErrors: true }).compile(schema);

  if (!validate(config)) {
    const details = validate.errors.map(e => `  ${e.instancePath || '(root)'} ${e.message}`).join('\n');
    throw new Error(`figma-tokens.config.json failed schema validation:\n${details}`);
  }
}

/**
 * Resolve `{ "$ref": "key" }` markers within a filter.include/exclude array by
 * splicing in the named top-level config array they point to. Plain string
 * entries pass through unchanged, so one list can mix literals with shared
 * refs (e.g. a collection-specific prefix alongside a prefix list reused by
 * several collections).
 *
 * @param {Array<string | { $ref: string }>} [entries]
 * @param {Object} config Parsed figma-tokens.config.json, used to look up ref targets.
 * @returns {string[]}
 */
function resolveReference(entries, config) {
  return (entries ?? []).flatMap(entry => {
    if (entry && typeof entry === 'object' && '$ref' in entry) {
      const referenced = config[entry.$ref];
      if (!Array.isArray(referenced)) {
        throw new Error(`$ref "${entry.$ref}" must point to a top-level array in figma-tokens.config.json`);
      }
      return referenced;
    }
    return entry;
  });
}

/**
 * Load and normalize the token publisher configuration.
 *
 * @param {string} configPath Absolute path to figma-tokens.config.json.
 * @returns {FigmaTokensConfig}
 */
export function loadConfig(configPath) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  validateAgainstSchema(config, configPath);

  const collections = (config.collections ?? []).map((col, i) => {
    const isHumanReadable = col.humanReadable && typeof col.humanReadable === 'object';

    // Structural checks (required fields, types, mode.source enum, the
    // humanReadable "--" value pattern, …) are covered by the schema above.
    // This one is cross-field and stays here: the schema can't cleanly say
    // "filter.include must be non-empty unless humanReadable is present".
    if (!isHumanReadable && col.filter.include.length === 0) {
      throw new Error(`collections[${i}] ("${col.name}"): filter.include must be a non-empty array`);
    }

    // Strip _comment and other meta keys (schema validation already confirmed
    // every remaining value matches the "--" CSS custom-property pattern).
    let humanReadable;
    if (isHumanReadable) {
      humanReadable = /** @type {Record<string, string>} */ (
        Object.fromEntries(Object.entries(col.humanReadable).filter(([k]) => !k.startsWith('_')))
      );
    }

    // Splice in any { "$ref": "..." } entries so callers only ever see plain
    // prefix strings — see e.g. "typographyColorPrefixes" in the config.
    const include = resolveReference(col.filter.include, config);
    const exclude = resolveReference(col.filter.exclude, config);

    return /** @type {CollectionConfig} */ ({
      name: col.name,
      hiddenFromPublishing: col.hiddenFromPublishing ?? false,
      filter: { include, exclude },
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
