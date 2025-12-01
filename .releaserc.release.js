/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const baseReleaseConfig = require('./.releaserc.base.js');

module.exports = {
  ...baseReleaseConfig,
  plugins: [
    ...baseReleaseConfig.plugins,
    './scripts/semantic-release-add-peer-dependency.js',
    '@semantic-release/github',
    [
      '@amanda-mitchell/semantic-release-npm-multiple',
      {
        registries: {
          angular: {
            npmPublish: true,
            pkgRoot: './dist/clr-angular',
          },
          ui: {
            npmPublish: true,
            pkgRoot: './dist/clr-ui',
          },
          addons: {
            npmPublish: true,
            pkgRoot: './dist/clr-addons',
          },
        },
      },
    ],
  ],
};
