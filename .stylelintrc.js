/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

module.exports = {
  extends: ['stylelint-config-recommended-scss', 'stylelint-config-prettier'],
  defaultSeverity: 'error',
  plugins: ['stylelint-scss', 'stylelint-plugin-license-header'],
  rules: {
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
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['/^clr-/', '/^cds-/', '_'],
      },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['/^ng-deep/'],
      },
    ],
  },
};
