/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const js = require('@eslint/js');
const globals = require('globals');
const { globalIgnores } = require('eslint/config');
const json = require('@eslint/json').default;

// TypeScript
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

// Plugins
const importPlugin = require('eslint-plugin-import');
const jasminePlugin = require('eslint-plugin-jasmine');
const unusedImports = require('eslint-plugin-unused-imports');
const decoratorPosition = require('eslint-plugin-decorator-position');
const licenseHeader = require('eslint-plugin-license-header');
// Your custom rules plugin (kept as-is)
const ngClarityRules = require('eslint-plugin-ng-clarity-eslint-rules');

// Local member ordering config (kept as-is)
const memberOrderingConfig = require('./.eslintrc-member-ordering');

module.exports = [
  // Base JS/recommended + globals
  {
    files: ['**/*.{js,cjs,mjs}'],
    ...js.configs.recommended,
  },

  // Global defaults (apply to all files unless overridden)
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jasmine,
      },
    },
    plugins: {
      import: importPlugin,
      'license-header': licenseHeader,
      json,
    },
    rules: {
      curly: 'error',
      eqeqeq: 'error',
      'no-var': 'error',
      // 'no-irregular-whitespace': ['error', { skipTemplates: true }],
      'license-header/header': ['error', './.license-header.js'],
    },
  },

  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jasmine,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      jasmine: jasminePlugin,
      'unused-imports': unusedImports,
      'decorator-position': decoratorPosition,
      'ng-clarity-eslint-rules': ngClarityRules,
      'license-header': licenseHeader,
      import: importPlugin,
    },
    rules: {
      // @typescript-eslint
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
      '@typescript-eslint/member-ordering': ['error', memberOrderingConfig],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/parameter-properties': ['error', { prefer: 'parameter-property' }],

      // General
      curly: 'error',
      eqeqeq: 'error',
      'grouped-accessor-pairs': ['error', 'getBeforeSet'],
      'no-irregular-whitespace': ['error', { skipTemplates: true }],

      // import plugin
      'import/no-absolute-path': 'error',
      'import/no-useless-path-segments': 'error',
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [
            ['builtin', 'external'],
            ['parent', 'sibling'],
          ],
          'newlines-between': 'always',
        },
      ],

      // Sorting (let import/order handle grouping; this one only sorts within groups)
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],

      // Unused imports
      'unused-imports/no-unused-imports': 'error',

      // Decorators
      'decorator-position/decorator-position': 'error',

      // Jasmine
      'jasmine/no-focused-tests': 'error',

      // Custom rules
      'ng-clarity-eslint-rules/no-parameter-property-this-in-constructor': 'error',

      // License header still applies here (in case TS files are linted standalone)
      'license-header/header': ['error', './.license-header.js'],
    },
  },
  // JSON files (keep behavior: disable license header there)
  {
    files: ['**/*.json'],
    ignores: ['**/package-lock.json'],
    language: 'json/json',
    ...json.configs['recommended'],
    rules: {
      ...json.configs['recommended'].rules,
      'license-header/header': 'off',
    },
  },

  globalIgnores([
    '!**/.*',
    '.angular',
    '**/node_modules',
    'dist',
    'projects/angular/clarity.api.md',
    '.storybook/preview.js',
    'documentation.json',
  ]),
];
