/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { parseRoutes, renderReference } from './references.js';

const ROOT = process.env.CLARITY_REPO_ROOT ?? process.cwd();
const ROUTES = 'projects/website/src/app/documentation/documentation-routes.ts';
const OUT_DIR = 'docs/clarity-ai/components';

const routesContent = await readFile(join(ROOT, ROUTES), 'utf8');
const routes = parseRoutes(routesContent);
await mkdir(join(ROOT, OUT_DIR), { recursive: true });

const generated: string[] = [];
const skipped: string[] = [];
for (const { name, folder } of routes) {
  const markdown = await renderReference(ROOT, name, folder);
  if (!markdown) {
    skipped.push(name);
    continue;
  }
  await writeFile(join(ROOT, OUT_DIR, `${name}.md`), markdown, 'utf8');
  generated.push(name);
}

const index = [
  '# Clarity component reference (generated)',
  '',
  'One distilled file per component, generated from the live demos. Regenerate with `npm run generate:references`.',
  'The `clarity` skill loads the relevant file on demand instead of searching the demos every time.',
  '',
  ...generated.sort().map(name => `- [${name}](./${name}.md)`),
  '',
].join('\n');
await writeFile(join(ROOT, OUT_DIR, 'index.md'), index, 'utf8');

console.log(`Generated ${generated.length} component references -> ${OUT_DIR}`);
if (skipped.length > 0) {
  console.log(`Skipped ${skipped.length} routes with no demo folder: ${skipped.join(', ')}`);
}
