/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

module.exports = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'avoid',
  overrides: [
    {
      // Shared examples are shown as code on the website. Match the width and whitespace handling of the website's
      // code examples (projects/website/scripts/format-code-examples.js).
      files: 'projects/examples/**/*.{html,ts,scss}',
      options: {
        printWidth: 104,
        htmlWhitespaceSensitivity: 'ignore',
      },
    },
  ],
};
