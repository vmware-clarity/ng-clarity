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
    {
      // a same-file const without a <style>
      code: "const tpl = '<b></b>';\nconst meta = { render: () => ({ template: tpl }) };",
    },
    {
      // the parameter shadows the module-level const, so the const is not what is rendered
      code: ["const tpl = '<style>.x {}</style>';", 'const meta = { render: tpl => ({ template: tpl }) };'].join('\n'),
    },
    {
      // imports are not followed
      code: "import { tpl } from './template';\nconst meta = { render: () => ({ template: tpl }) };",
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
    {
      // the template held in a same-file const
      code: "const tpl = '<style>.x{}</style><b></b>';\nconst meta = { render: () => ({ template: tpl }) };",
      output: null,
      errors: [{ message: MESSAGE, line: 2, column: 43 }],
    },
    {
      // a template literal, declared after its use
      code: [
        'const meta = { render: () => ({ template: tpl }) };',
        'const tpl = `',
        '  <style>.x {}</style>',
        '  <b></b>',
        '`;',
      ].join('\n'),
      output: null,
      errors: [{ message: MESSAGE, line: 1, column: 43 }],
    },
  ],
});

console.log('storybook-no-inline-style: ok');
