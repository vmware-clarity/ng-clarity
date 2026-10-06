/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Points the demo and website applications at the built `dist/` packages instead of the library sources, so they
 * compile against the libraries the way an application consuming the published packages does. It is used in
 * pr-build.yml to build the applications with a newer Angular version than the libraries were built with.
 *
 * Only the application tsconfigs are changed. The unit tests and storybook keep resolving the library sources through
 * the root tsconfig: they import library internals by relative path, and mixing those with `dist/` would load two
 * copies of the same classes.
 */

const fs = require('fs');

const applicationTsconfigs = {
  'projects/demo/tsconfig.json': '../..',
  'projects/website/tsconfig.app.json': '../..',
};

for (const [tsconfigPath, rootPath] of Object.entries(applicationTsconfigs)) {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

  tsconfig.compilerOptions = {
    ...tsconfig.compilerOptions,
    paths: {
      '@clr/angular': [`${rootPath}/dist/clr-angular`],
      '@clr/angular/*': [`${rootPath}/dist/clr-angular/*`],
      '@clr/addons': [`${rootPath}/dist/clr-addons`],
      '@clr/addons/*': [`${rootPath}/dist/clr-addons/*`],
    },
  };

  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\n');
}
