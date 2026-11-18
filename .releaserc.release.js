/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
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
    // @semantic-release/npm once per published package; they share the registry and its authentication.
    ['@semantic-release/npm', { pkgRoot: './dist/clr-angular' }],
    ['@semantic-release/npm', { pkgRoot: './dist/clr-ui' }],
    ['@semantic-release/npm', { pkgRoot: './dist/clr-addons' }],
  ],
};
