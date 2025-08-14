import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import styles from 'rollup-plugin-styles';
import { terser } from 'rollup-plugin-terser';
import { join } from 'path';
import {
  packageCheck,
  webComponentAnalyer,
  createPackageModuleMetadata,
  createLibraryEntryPoints,
  litSass,
  globalStyles,
  esmCache,
} from './rollup.utils.js';

const config = {
  baseDir: './projects/core/src',
  outDir: join('dist', '@cds', 'core'), // rollup will fail on Windows if we don't normalize path deliminters
  assets: ['./README.md'],
  modules: {
    entryPoints: ['./projects/core/src/**/index.ts', './projects/core/src/**/register.ts'],
    sideEffects: ['./projects/core/src/**/register.ts', './projects/core/src/polyfills/*.ts'],
  },
  styles: [
    { input: './projects/core/src/styles/global.scss', output: './dist/@cds/core/global.css' },
    './projects/core/src/styles/module.layout.scss',
    './projects/core/src/styles/module.reset.scss',
    './projects/core/src/styles/module.typography.scss',
    './projects/core/src/styles/theme.dark.scss',
    './projects/core/src/styles/theme.low-motion.scss',
    './projects/core/src/styles/theme.high-contrast.scss',
  ],
  package: {
    exports: [
      { input: './projects/core/styles/module.tokens.css', output: './projects/core/styles/module.tokens.min.css' },
      './icon/shapes/*',
      './icon/icon.service.js',
      './tokens/tokens.js',
      './tokens/tokens.d.ts',
      './tokens/tokens.json',
      './tokens/tokens.scss',
    ],
  },
};

const prod = !process.env.ROLLUP_WATCH;

export default [
  ...globalStyles(config),
  {
    external: [/^tslib/, /^ramda/, /^@lit/, /^lit/, /^lit-html/, /^lit-element/, /^@cds\/core/],
    input: 'library-entry-points',
    treeshake: false,
    preserveEntrySignatures: 'strict',
    output: {
      preserveModules: true,
      dir: config.outDir,
      format: 'esm',
      sourcemap: prod,
      // https://github.com/vmware/clarity/issues/6695
      sourcemapExcludeSources: false,
      minifyInternalExports: prod,
    },
    plugins: [
      createLibraryEntryPoints(config.modules.entryPoints),
      styles({ mode: 'emit' }),
      litSass(),
      nodeResolve(),
      typescript({ outDir: './dist/@cds/core', tsconfig: './projects/core/tsconfig.lib.json' }),
      copy({
        copyOnce: true,
        targets: [
          {
            src: './projects/core/package.lib.json',
            rename: 'package.json',
            dest: config.outDir,
            transform: p => createPackageModuleMetadata(p, config),
          },
          ...config.assets.map(src => ({ src, dest: config.outDir })),
        ],
      }),
      !prod ? esmCache(config.outDir) : [],
      prod ? minifyHTML() : [],
      prod
        ? terser({ ecma: 2020, module: true, format: { comments: false }, compress: { passes: 2, unsafe: true } })
        : [],
      prod
        ? replace({
            preventAssignment: false,
            values: {
              'super(...arguments),': 'super(...arguments);',
              'super(),': 'super();',
            }, // safari 15.1 bug with minification optimization
          })
        : [],
      prod ? webComponentAnalyer(config.outDir) : [],
      prod ? packageCheck(config.outDir) : [],
      del({
        targets: ['./dist/@cds/core/**/assets', './dist/@cds/core/**/.tsbuildinfo', './dist/@cds/core/**/_virtual'],
        hook: 'writeBundle',
      }),
    ],
  },
];



