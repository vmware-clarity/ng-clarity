/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { build } from 'esbuild';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { rollup } from 'rollup';
import { minify } from 'terser';
import webpack from 'webpack';

// Bundles the built package with esbuild (Angular CLI), Rollup and webpack to make sure unused icon shapes are
// tree-shaken. Needs `npm run _build:angular` first.
const iconEntryPoint = resolve('dist/clr-angular/fesm2022/clr-angular-icon.mjs');
const isExternal = id => /^(@angular|rxjs|tslib)(\/|$)/.test(id);

// [name, svg strings] of every shape source. The internal `test` and `tmpl` placeholders have no SVG markup.
const shapes = Object.values(import.meta.glob('./shapes/*.ts', { eager: true }))
  .flatMap(shapeModule => Object.values(shapeModule).filter(Array.isArray))
  .map(([name, shape]) => [name, Object.values(shape)])
  .filter(([, svgs]) => svgs.some(svg => svg.includes('<')));

const bundlers = {
  async esbuild(entry) {
    const result = await build({
      stdin: { contents: entry, resolveDir: process.cwd() },
      bundle: true,
      minify: true,
      format: 'esm',
      external: ['@angular/*', 'rxjs', 'tslib'],
      write: false,
      logLevel: 'silent',
    });
    return result.outputFiles[0].text;
  },
  async rollup(entry) {
    const bundle = await rollup({
      input: 'entry',
      external: isExternal,
      plugins: [
        { name: 'entry', resolveId: id => (id === 'entry' ? id : null), load: id => (id === 'entry' ? entry : null) },
      ],
      onwarn: () => {},
    });
    const { output } = await bundle.generate({ format: 'es' });
    return (await minify(output[0].code, { module: true })).code;
  },
  async webpack(entry) {
    const dir = mkdtempSync(join(tmpdir(), 'clr-icon-tree-shaking-'));
    writeFileSync(join(dir, 'entry.js'), entry);
    try {
      await new Promise((resolvePromise, reject) =>
        webpack(
          {
            mode: 'production',
            context: dir,
            entry: './entry.js',
            output: { path: dir, filename: 'bundle.js', module: true },
            experiments: { outputModule: true },
            externalsType: 'module',
            externals: [({ request }, callback) => (isExternal(request) ? callback(null, request) : callback())],
          },
          (error, stats) =>
            error || stats.hasErrors() ? reject(error ?? stats.toString('errors-only')) : resolvePromise()
        )
      );
      return readFileSync(join(dir, 'bundle.js'), 'utf8');
    } finally {
      rmSync(dir, { recursive: true });
    }
  },
};

function bundledShapeNames(code) {
  return shapes.filter(([, svgs]) => svgs.every(svg => code.includes(svg))).map(([name]) => name);
}

describe.each(Object.entries(bundlers))('icon tree-shaking with %s', (_, bundle) => {
  it('bundles only the imported icon shapes', async () => {
    expect(existsSync(iconEntryPoint), `${iconEntryPoint} not found, build clr-angular first`).toBe(true);

    const imports = `import { ClarityIcons, homeIcon } from '${iconEntryPoint}';`;
    const withoutIcons = await bundle(`${imports} ClarityIcons.addIcons();`);
    const withHomeIcon = await bundle(`${imports} ClarityIcons.addIcons(homeIcon);`);
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
