/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

module.exports = {
  '*.{js,json,ts}': 'eslint',
  '*.{css,scss,sass}': 'stylelint',
  '*': 'prettier -l --ignore-unknown',
};
