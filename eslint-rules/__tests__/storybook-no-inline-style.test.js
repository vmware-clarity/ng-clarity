/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const rule = require('../storybook-no-inline-style');
const { ruleTester } = require('./rule-tester');

const MESSAGE =
  'No inline `<style>` in a story template. Use `withStyles(css)` from `@storybook-helpers/decorators`, or `styles:` on a `*.storybook.component.ts`.';

ruleTester.run('storybook-no-inline-style', rule, {
  valid: [
    {
      code: 'const meta = { render: () => ({ template: `<clr-accordion></clr-accordion>` }) };',
    },
    {
      code: 'const meta = { render: () => ({ template: `<div style="color: red"></div>` }) };',
    },
    {
      code: 'const styles = `<style>.highlight { color: red; }</style>`;',
    },
  ],
  invalid: [
    {
      code: [
        'const meta = {',
        '  render: () => ({',
        '    template: `',
        '      <style>',
        '        .highlight { color: red; }',
        '      </style>',
        '      <clr-accordion></clr-accordion>',
        '    `,',
        '  }),',
        '};',
      ].join('\n'),
      errors: [{ message: MESSAGE }],
    },
    {
      code: "const component = { template: '<style>.a { color: red; }</style>' };",
      errors: [{ message: MESSAGE }],
    },
  ],
});

console.log('storybook-no-inline-style: ok');
