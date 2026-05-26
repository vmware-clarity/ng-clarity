#!/usr/bin/env node
/**
 * Pre-build token sanitiser
 *
 * Walks all JSON files under tokens/ and:
 *  1. Strips leading `$` from non-metadata keys (DTCG reserves $ for $value, $type, etc.)
 *  2. Removes keys whose names become empty strings after sanitisation
 *  3. Rewrites files in-place
 *
 * Run before `style-dictionary build` when token sources may contain $-prefixed names,
 * e.g. if a Figma variable is named "$brand-primary".
 *
 * Usage:
 *   node scripts/clean-tokens.mjs [--dir tokens]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// DTCG metadata keys that legitimately start with $
const DTCG_RESERVED = new Set(['$value', '$type', '$description', '$extensions', '$deprecated']);

// Directory to scan (default: tokens/)
const args = process.argv.slice(2);
const dirArgIdx = args.indexOf('--dir');
const tokensDir = join(ROOT, dirArgIdx !== -1 ? args[dirArgIdx + 1] : 'tokens');

let filesProcessed = 0;
let keysRenamed = 0;

/**
 * Recursively sanitise all keys in a DTCG token tree.
 * @param {unknown} node
 * @returns {unknown}
 */
function sanitise(node) {
  if (Array.isArray(node)) {
    return node.map(sanitise);
  }

  if (node !== null && typeof node === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      // Keep DTCG reserved keys as-is
      if (DTCG_RESERVED.has(key)) {
        out[key] = sanitise(value);
        continue;
      }

      // Strip leading $ from non-reserved keys
      const cleanKey = key.startsWith('$') ? key.slice(1) : key;

      if (!cleanKey) {
        console.warn(`  ⚠  Skipping key "${key}" — empty after sanitisation`);
        continue;
      }

      if (cleanKey !== key) {
        keysRenamed++;
      }

      out[cleanKey] = sanitise(value);
    }
    return out;
  }

  return node;
}

/**
 * Recursively collect all .json files under a directory.
 * @param {string} dir
 * @returns {string[]}
 */
function collectJsonFiles(dir) {
  const results = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        results.push(...collectJsonFiles(full));
      } else if (extname(entry) === '.json') {
        results.push(full);
      }
    }
  } catch {
    // Directory may not exist yet (first run before extraction)
  }
  return results;
}

const files = collectJsonFiles(tokensDir);

if (files.length === 0) {
  console.log(`ℹ  No JSON files found under ${tokensDir} — nothing to clean.`);
  process.exit(0);
}

for (const filePath of files) {
  let raw;
  try {
    raw = readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`❌  Could not read ${filePath}: ${err.message}`);
    continue;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(`❌  Invalid JSON in ${filePath}: ${err.message}`);
    continue;
  }

  const cleaned = sanitise(parsed);
  const output = JSON.stringify(cleaned, null, 2) + '\n';

  if (output !== raw) {
    writeFileSync(filePath, output, 'utf-8');
    console.log(`🧹  Cleaned: ${filePath.replace(ROOT + '/', '')}`);
  }

  filesProcessed++;
}

console.log(`\n✅  Processed ${filesProcessed} file(s), renamed ${keysRenamed} key(s).`);
