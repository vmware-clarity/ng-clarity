/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const commitLintConfig = require('@commitlint/config-conventional');

// Merging what @commitlint/config-convensional has with our new two types of commit
const types = ['a11y', 'release'].concat(commitLintConfig.rules['type-enum'][2]);

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always'],
    'type-enum': [2, 'always', types],
    'header-max-length': [2, 'always', 100],
  },
};
