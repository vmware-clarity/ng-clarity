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
  },
  extends: ['eslint:recommended', 'plugin:json/recommended-with-comments', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    ecmaVersion: 11,
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
      plugins: ['license-header', '@typescript-eslint', 'unused-imports', 'decorator-position'],
      rules: {
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'no-public',
          },
        ],
        '@typescript-eslint/member-ordering': ['error', memberOrderingConfig],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/no-require-imports': 'off',
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
        'no-irregular-whitespace': [
          'error',
          {
            skipTemplates: true,
          },
        ],
        'sort-imports': [
          'error',
          {
            ignoreCase: true,
            ignoreDeclarationSort: true,
          },
        ],
        'unused-imports/no-unused-imports': 'error',
      },
    },
    {
      files: [
        '**/*.json',
        './src/app/documentation/demos/forms/ng/*.ts',
        './src/app/documentation/demos/combobox/states.ts',
        './src/app/documentation/demos/tree-view/boolean-selection-tree/permissions.ts',
        './src/app/documentation/demos/tree-view/tree-view-dynamic/organization.ts',
        './src/app/documentation/demos/tree-view/utils/files.ts',
        './src/app/documentation/demos/tree-view/tree-node-routing/album.component.ts',
        './src/app/documentation/demos/tree-view/tree-node-routing/albums.ts',
        './src/app/documentation/demos/tree-view/tree-node-routing/app.routes.ts',
        './src/app/documentation/demos/tree-view/selection-tree/groceries.ts',
        './src/app/documentation/demos/tree-view/lazy-loading-selection-tree/grocery-items.component.ts',
        './src/app/documentation/demos/tree-view/lazy-loading-selection-tree/grocery-models.ts',
        './src/app/documentation/demos/vertical-nav/routes/stackblitz-examples/**',
        './stackblitz-example-template/**',
      ],
      rules: {
        'license-header/header': 'off',
      },
    },
  ],
};
