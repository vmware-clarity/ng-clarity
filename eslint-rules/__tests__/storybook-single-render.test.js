/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const rule = require('../storybook-single-render');
const { ruleTester } = require('./rule-tester');

const MULTIPLE_RENDERS_MESSAGE =
  'Only one `render` is allowed per story file, and it belongs in `meta`. Hoist it, or keep the outlier and justify it with a `// render-override: <reason>` comment.';
const MISSING_OVERRIDE_COMMENT_MESSAGE =
  'A story-level `render` must be preceded by a `// render-override: <reason>` comment on the line above.';

ruleTester.run('storybook-single-render', rule, {
  valid: [
    {
      code: [
        'const meta = { render: args => ({ props: args }) };',
        'export default meta;',
        'export const Default: Story = {};',
      ].join('\n'),
    },
    {
      code: ['export default { render: args => ({ props: args }) };', 'export const Default: Story = {};'].join('\n'),
    },
    {
      code: [
        'const meta = { render: args => ({ props: args }) };',
        'export default meta;',
        'export const Odd: Story = {',
        '  // render-override: the wrapper needs its own host element',
        '  render: args => ({ props: args }),',
        '};',
      ].join('\n'),
    },
    {
      code: 'const notAStory = { rendered: true };',
    },
  ],
  invalid: [
    {
      code: [
        'const meta = { render: args => ({ props: args }) };',
        'export default meta;',
        'export const Odd: Story = { render: args => ({ props: args }) };',
      ].join('\n'),
      errors: [{ message: MULTIPLE_RENDERS_MESSAGE }],
    },
    {
      code: 'export const Odd: Story = { render: args => ({ props: args }) };',
      errors: [{ message: MISSING_OVERRIDE_COMMENT_MESSAGE }],
    },
    {
      code: [
        'const meta = { render: args => ({ props: args }) };',
        'export default meta;',
        'export const A: Story = { render: args => ({ props: args }) };',
        'export const B: Story = { render: args => ({ props: args }) };',
      ].join('\n'),
      errors: [{ message: MULTIPLE_RENDERS_MESSAGE }, { message: MULTIPLE_RENDERS_MESSAGE }],
    },
    {
      code: [
        'const meta = { render: args => ({ props: args }) };',
        'export default meta;',
        'export const Odd: Story = {',
        '  // render-override: reason lives too far away',
        '',
        '  render: args => ({ props: args }),',
        '};',
      ].join('\n'),
      errors: [{ message: MULTIPLE_RENDERS_MESSAGE }],
    },
    {
      // an override comment with no reason is not a justification
      code: ['export const Odd: Story = {', '  // render-override:', '  render: args => ({ props: args }),', '};'].join(
        '\n'
      ),
      errors: [{ message: MISSING_OVERRIDE_COMMENT_MESSAGE }],
    },
    {
      // the justification must be a line comment
      code: [
        'export const Odd: Story = {',
        '  /* render-override: x */',
        '  render: args => ({ props: args }),',
        '};',
      ].join('\n'),
      errors: [{ message: MISSING_OVERRIDE_COMMENT_MESSAGE }],
    },
  ],
});

console.log('storybook-single-render: ok');
