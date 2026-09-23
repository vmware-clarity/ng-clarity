/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Shared RuleTester for the Storybook story rules. The repo has no JS test runner wired up for
// `eslint-rules/`, so these tests are plain node scripts: `node eslint-rules/__tests__/index.js`.
const { RuleTester } = require('eslint');
const tsParser = require('@typescript-eslint/parser');

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
});

module.exports = { ruleTester };
