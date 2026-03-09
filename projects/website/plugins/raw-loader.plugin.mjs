/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Esbuild plugin that emulates Webpack's `raw-loader`.
 *
 * Intercepts `require('raw-loader!./file')` and `require('!raw-loader!./file')` imports
 * and returns the file content as a default-exported string. This lets the website render
 * source code examples without changing the original Webpack-era import syntax.
 *
 * Copyright headers are automatically stripped so they don't appear in code examples.
 *
 * Configured in `angular.json` → `clr-website` → `architect.build.options.plugins`
 * via the `@angular-builders/custom-esbuild:application` builder.
 */

import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../..');

const PLUGIN_NAME = 'raw-loader';

/** Matches the `raw-loader!` or `!raw-loader!` prefix in require() paths. */
const RAW_LOADER_PREFIX = /^!?raw-loader!/;

/**
 * Query-string suffix appended to resolved paths to tag them for onLoad.
 * Needed because `@angular-builders/custom-esbuild` does not reliably
 * forward custom namespaces to onLoad callbacks on its own.
 */
const LOADER_SUFFIX = '?raw-loader';

/** Extensions tried when an import omits the file extension. */
const EXTENSIONS = ['.ts', '.js', '.html', '.scss', '.css', '.json'];

/**
 * Canonical copyright headers loaded from the repo-root license-header files.
 * Matched with `startsWith` for exact, reliable stripping.
 */
const COPYRIGHT_HEADERS = [
  readFileSync(resolve(REPO_ROOT, '.license-header.js'), 'utf-8'),
  readFileSync(resolve(REPO_ROOT, '.license-header.html'), 'utf-8'),
];

function stripCopyrightHeader(content) {
  for (const header of COPYRIGHT_HEADERS) {
    if (content.startsWith(header)) {
      return content.slice(header.length).trim();
    }
  }
  return content.trim();
}

/** Resolves a path, appending common extensions when the bare path doesn't exist. */
function resolveFile(basePath) {
  if (existsSync(basePath)) {
    return basePath;
  }
  for (const ext of EXTENSIONS) {
    const candidate = basePath + ext;
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

export default {
  name: PLUGIN_NAME,

  setup(build) {
    /**
     * onResolve: called when esbuild encounters a `require('raw-loader!...')` import.
     * Strips the `raw-loader!` prefix, locates the real file on disk, and tags
     * the resolved path so the onLoad callback below can pick it up.
     */
    build.onResolve({ filter: RAW_LOADER_PREFIX }, args => {
      const relativePath = args.path.replace(RAW_LOADER_PREFIX, '');
      const absolutePath = resolve(dirname(args.importer), relativePath);
      const resolved = resolveFile(absolutePath);

      if (!resolved) {
        return {
          errors: [{ text: `${PLUGIN_NAME}: could not resolve ${absolutePath} (tried ${EXTENSIONS.join(', ')})` }],
        };
      }

      return { path: resolved + LOADER_SUFFIX, namespace: PLUGIN_NAME };
    });

    /**
     * onLoad: called for paths tagged by onResolve above.
     * Reads the file, strips the copyright header, and returns a JS module
     * that default-exports the file content as a string.
     */
    build.onLoad({ filter: /\?raw-loader$/, namespace: PLUGIN_NAME }, async args => {
      const filePath = args.path.replace(LOADER_SUFFIX, '');
      const content = stripCopyrightHeader(await readFile(filePath, 'utf-8'));

      return {
        contents: `export default ${JSON.stringify(content)};`,
        loader: 'js',
        watchFiles: [filePath],
      };
    });
  },
};
