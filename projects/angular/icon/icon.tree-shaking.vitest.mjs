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

// [name, svg strings] of every shape source. The internal `test` and `tmpl` placeholders have no SVG markup.
const shapes = Object.values(import.meta.glob('./shapes/*.ts', { eager: true }))
  .flatMap(shapeModule => Object.values(shapeModule).filter(Array.isArray))
  .map(([name, shape]) => [name, Object.values(shape)])
  .filter(([, svgs]) => svgs.some(svg => svg.includes('<')));

async function bundle(code) {
  const result = await build({
    stdin: {
      contents: `import { ClarityIcons, homeIcon } from '${iconEntryPoint}'; ${code}`,
      resolveDir: process.cwd(),
    },
    bundle: true,
    minify: true,
    format: 'esm',
    external: ['@angular/*', 'rxjs', 'tslib'],
    write: false,
    logLevel: 'silent',
  });
  return result.outputFiles[0].text;
}

function bundledShapeNames(code) {
  return shapes.filter(([, svgs]) => svgs.every(svg => code.includes(svg))).map(([name]) => name);
}

describe('icon tree-shaking', () => {
  it('bundles only the imported icon shapes', async () => {
    expect(existsSync(iconEntryPoint), `${iconEntryPoint} not found, build clr-angular first`).toBe(true);

    const withoutIcons = await bundle('ClarityIcons.addIcons();');
    const withHomeIcon = await bundle('ClarityIcons.addIcons(homeIcon);');
    const [, homeSvgs] = shapes.find(([name]) => name === 'home');

    // The icon service always registers the unknown icon.
    expect(bundledShapeNames(withoutIcons)).toEqual(['unknown']);
    expect(bundledShapeNames(withHomeIcon)).toEqual(['home', 'unknown']);
    // Importing an icon grows the bundle by its SVG plus a few bytes to register it.
    const homeIconSize = homeSvgs.join('').length;
    expect(withHomeIcon.length - withoutIcons.length).toBeGreaterThanOrEqual(homeIconSize);
    expect(withHomeIcon.length - withoutIcons.length).toBeLessThan(homeIconSize + 200);
  });
});
