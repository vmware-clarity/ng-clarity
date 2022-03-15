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
