/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

module.exports = {
  extends: ['stylelint-config-recommended-scss', 'stylelint-config-standard'],
  defaultSeverity: 'error',
  plugins: ['stylelint-scss', 'stylelint-plugin-license-header'],
  rules: {
    'nesting-selector-no-missing-scoping-root': null,
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
    'no-invalid-position-at-import-rule': null,
    'plugin/license-header': [true, { license: './.license-header.js' }],
    'scss/at-extend-no-missing-placeholder': null,
    'scss/at-import-no-partial-leading-underscore': null,
    'scss/at-import-partial-extension': null,
    'scss/comment-no-empty': null,
    'scss/no-global-function-names': null,
    'scss/operator-no-newline-after': null,
    'scss/operator-no-unspaced': null,
    'scss/load-partial-extension': null,
    'function-name-case': null,
    'media-query-no-invalid': null,
    'custom-property-pattern': null,
    'no-invalid-position-declaration': null,
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['/^clr-/', '/^cds-/', '_'],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'function',
          'if',
          'else',
          'each',
          'include',
          'mixin',
          'error',
          'return',
          'use',
          'for',
          'extend',
          'forward',
          'at-root',
        ],
      },
    ],
    'annotation-no-unknown': [
      true,
      {
        ignoreAnnotations: ['default'],
      },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['/^ng-deep/'],
      },
    ],
    'selector-class-pattern': [
      '^(?:[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:--[a-z0-9]+(?:-[a-z0-9]+)*)*|[a-z][a-z0-9]*(?:[A-Z][a-z0-9]+)+)$',
    ],
    'selector-id-pattern': [
      '^(?:[a-z][a-z0-9]*(?:-[a-z0-9]+)*|[a-z][a-z0-9]*(?:[A-Z][a-z0-9]+)+)$',
      {
        message: 'Expected id selector to be kebab-case or camelCase (e.g. main-nav or mainNav)',
        resolveNestedSelectors: true,
      },
    ],
    'value-keyword-case': ['lower', { ignoreProperties: ['/^--/', 'font-family'], ignoreFunctions: ['var'] }],
    'at-rule-empty-line-before': [
      'always',
      { ignoreAtRules: ['else'], except: ['after-same-name'], ignore: ['after-comment', 'inside-block'] },
    ],
  },
};
