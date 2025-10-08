/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const base = require('./.releaserc.base.js');

// Extract @semantic-release/commit-analyzer options from base
let analyzerOpts = {};
if (Array.isArray(base.plugins)) {
  const analyzer = base.plugins.find(p => Array.isArray(p) && p[0] === '@semantic-release/commit-analyzer');
  if (analyzer && analyzer[1]) {
    analyzerOpts = { ...analyzer[1] };
  }
}

const mergedRules = [...(analyzerOpts.releaseRules || []), { type: 'build', release: 'patch' }];

module.exports = {
  branches: [{ name: 'no-tags', prerelease: true }],
  dryRun: false,
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        ...analyzerOpts,
        releaseRules: mergedRules,
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
        tarballDir: false,
      },
    ],
  ],
};
