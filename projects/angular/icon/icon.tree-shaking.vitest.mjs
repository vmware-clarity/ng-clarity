/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { build } from 'esbuild';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Bundles the built package the way the Angular CLI does (esbuild) to make sure unused icon shapes are tree-shaken.
// Needs `npm run _build:angular` first.
const iconEntryPoint = resolve('dist/clr-angular/fesm2022/clr-angular-icon.mjs');

describe('icon tree-shaking', () => {
  it('bundles only the imported icon shapes', async () => {
    expect(existsSync(iconEntryPoint), `${iconEntryPoint} not found, build clr-angular first`).toBe(true);

    const result = await build({
      stdin: {
        contents: `import { ClarityIcons, homeIcon } from '${iconEntryPoint}'; ClarityIcons.addIcons(homeIcon);`,
        resolveDir: process.cwd(),
      },
      bundle: true,
      minify: true,
      format: 'esm',
      external: ['@angular/*', 'rxjs', 'tslib'],
      write: false,
      logLevel: 'silent',
    });
    const bundle = result.outputFiles[0].text;

    expect(bundle).toContain('"home"');
    expect(bundle).not.toContain('"cog"');
    // About 23 kB with tree-shaking, about 1 MB when every shape is kept.
    expect(bundle.length).toBeLessThan(100_000);
  });
});
