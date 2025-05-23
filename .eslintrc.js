/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const memberOrderingConfig = require('./.eslintrc-member-ordering');

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jasmine: true,
  },
  extends: ['eslint:recommended', 'plugin:json/recommended-with-comments', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    ecmaVersion: 9,
  },
  plugins: ['import', 'license-header'],
  rules: {
    curly: 'error',
    eqeqeq: 'error',
    'no-var': 'error',
    'no-irregular-whitespace': ['error', { skipTemplates: true }],
    'license-header/header': ['error', './.license-header.js'],
  },
  overrides: [
    {
      files: ['**/*.ts'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
      plugins: [
        'license-header',
        '@typescript-eslint',
        'jasmine',
        'unused-imports',
        'decorator-position',
        'ng-clarity-eslint-rules',
      ],
      rules: {
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'no-public',
          },
        ],
        '@typescript-eslint/member-ordering': ['error', memberOrderingConfig],
        '@typescript-eslint/no-explicit-any': 'off', // Would LOVE to turn this on
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/no-useless-constructor': 'error',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/parameter-properties': ['error', { prefer: 'parameter-property' }],
        curly: 'error',
        'decorator-position/decorator-position': 'error',
        eqeqeq: 'error',
        'grouped-accessor-pairs': ['error', 'getBeforeSet'],
        'import/no-absolute-path': ['error'],
        'import/no-useless-path-segments': ['error'],
        'import/order': [
          'error',
          {
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
            groups: [
              ['builtin', 'external'],
              ['parent', 'sibling'],
            ],
            'newlines-between': 'always',
          },
        ],
        'jasmine/no-focused-tests': 'error',
        'no-irregular-whitespace': ['error', { skipTemplates: true }],
        'sort-imports': [
          'error',
          {
            ignoreCase: true,
            ignoreDeclarationSort: true,
          },
        ],
        'unused-imports/no-unused-imports-ts': 'error',

        // custom eslint-rules
        'ng-clarity-eslint-rules/no-parameter-property-this-in-constructor': 'error',
      },
    },
    {
      files: ['**/*.json'],
      rules: {
        'license-header/header': 'off',
      },
    },
  ],
};
