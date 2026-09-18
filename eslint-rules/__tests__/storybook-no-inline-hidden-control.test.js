/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const rule = require('../storybook-no-inline-hidden-control');
const { ruleTester } = require('./rule-tester');

const MESSAGE =
  "Don't hand-write `{ control: { disable: true }, table: { disable: true } }`. Use `...hideControls('<argName>')` from `@storybook-helpers/arg-types`.";

ruleTester.run('storybook-no-inline-hidden-control', rule, {
  valid: [
    {
      code: "const meta = { argTypes: { ...hideControls('openIndices') } };",
    },
    {
      // control-only entries keep their docs-table row, so they are not the same thing
      code: 'const meta = { argTypes: { clrWizardOnNext: { control: { disable: true } } } };',
    },
    {
      code: 'const meta = { argTypes: { openIndices: { control: { disable: true }, table: { disable: false } } } };',
    },
    {
      code: "const meta = { argTypes: { openIndices: { control: { disable: true }, table: { disable: true }, name: 'x' } } };",
    },
  ],
  invalid: [
    {
      code: 'const meta = { argTypes: { openIndices: { control: { disable: true }, table: { disable: true } } } };',
      output: "const meta = { argTypes: { ...hideControls('openIndices') } };",
      errors: [{ message: MESSAGE }],
    },
    {
      code: [
        'const meta = {',
        '  argTypes: {',
        '    openIndices: { control: { disable: true }, table: { disable: true } },',
        '    createArray: { table: { disable: true }, control: { disable: true } },',
        '  },',
        '};',
      ].join('\n'),
      output: [
        'const meta = {',
        '  argTypes: {',
        "    ...hideControls('openIndices'),",
        "    ...hideControls('createArray'),",
        '  },',
        '};',
      ].join('\n'),
      errors: [{ message: MESSAGE }, { message: MESSAGE }],
    },
    {
      code: "const meta = { argTypes: { 'data-test': { control: { disable: true }, table: { disable: true } } } };",
      output: "const meta = { argTypes: { ...hideControls('data-test') } };",
      errors: [{ message: MESSAGE }],
    },
    {
      // not an argTypes entry: reported, but not fixable
      code: 'const hidden = { control: { disable: true }, table: { disable: true } };',
      output: null,
      errors: [{ message: MESSAGE }],
    },
    {
      // a comment inside the entry would be dropped by the fix, so the fix is withheld
      code: [
        'const meta = {',
        '  argTypes: {',
        '    // story helper',
        '    openIndices: { control: { disable: true }, /* keep */ table: { disable: true } },',
        '  },',
        '};',
      ].join('\n'),
      output: null,
      errors: [{ message: MESSAGE }],
    },
  ],
});

console.log('storybook-no-inline-hidden-control: ok');
