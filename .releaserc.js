/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

module.exports = {
  branches: ['main', '+([0-9]).x', { name: 'beta', prerelease: true }, { name: 'next', prerelease: true }],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          { breaking: true, release: 'major' },
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'chore', release: false },
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
        },
      },
    ],
    '@semantic-release/release-notes-generator',
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
        },
      },
    ],
  ],
};
