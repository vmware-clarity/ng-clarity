import { readonlyPlugin } from 'cem-plugin-readonly';

export default {
  globs: ['**/*.ts'],
  exclude: [
    '**/*.hold',
    '**/*.spec.ts',
    '**/*.performance.ts',
    '**/*.a11y.ts',
    '**/*.d.ts',
    '**/*.stories.ts',
    '**/*.story.ts',
    '**/test/**',
    '**/demo/**',
  ],
  outdir: '../../../dist/@cds/core',
  litelement: true,
  plugins: [readonlyPlugin(), tsExtensionPlugin(), orderElements()],
};

export function tsExtensionPlugin() {
  return {
    name: 'ts-extensions',
    packageLinkPhase({ customElementsManifest }) {
      customElementsManifest.modules = JSON.parse(
        JSON.stringify(customElementsManifest.modules).replace(/\.ts"/g, '.js"')
      );
    },
  };
}

export function orderElements() {
  return {
    name: 'order-elements',
    packageLinkPhase({ customElementsManifest }) {
      customElementsManifest.modules.sort((a, b) => (a.path < b.path ? -1 : 1));
    },
  };
}
