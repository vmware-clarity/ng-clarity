/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const rule = require('../storybook-typed-meta');
const { ruleTester } = require('./rule-tester');

const EXPORT_DEFAULT_MESSAGE =
  'Story meta must be a typed constant: `const meta: Meta<TArgs> = {…}; export default meta;`. Never `export default {`.';
const UNTYPED_META_MESSAGE = 'Meta must have a type argument, e.g. `Meta<AccordionArgs>`.';
const UNTYPED_STORY_OBJ_MESSAGE = 'StoryObj must have a type argument, e.g. `type Story = StoryObj<AccordionArgs>;`.';
const UNANNOTATED_STORY_MESSAGE =
  'Story exports must be annotated with the file-local `Story` type, e.g. `export const Default: Story = {};`.';

ruleTester.run('storybook-typed-meta', rule, {
  valid: [
    {
      code: [
        "const meta: Meta<AccordionArgs> = { title: 'Components/Accordion' };",
        'export default meta;',
        'type Story = StoryObj<AccordionArgs>;',
        'export const Default: Story = {};',
      ].join('\n'),
    },
    {
      code: 'export type AccordionArgs = { panelCount: number };',
    },
    {
      code: 'export function helper() {}',
    },
    {
      code: 'export const Default: StoryObj<AccordionArgs> = {};',
    },
  ],
  invalid: [
    {
      code: "export default { title: 'Components/Accordion' };",
      errors: [{ message: EXPORT_DEFAULT_MESSAGE }],
    },
    {
      code: 'const meta: Meta = {};\nexport default meta;',
      errors: [{ message: UNTYPED_META_MESSAGE }],
    },
    {
      code: 'export const Default: StoryObj = {};',
      errors: [{ message: UNTYPED_STORY_OBJ_MESSAGE }],
    },
    {
      code: 'export const Default = {};',
      errors: [{ message: UNANNOTATED_STORY_MESSAGE }],
    },
    {
      code: [
        "export default { title: 'Components/Accordion' };",
        'export const Default: StoryObj = {};',
        'export const Disabled = {};',
      ].join('\n'),
      errors: [
        { message: EXPORT_DEFAULT_MESSAGE },
        { message: UNTYPED_STORY_OBJ_MESSAGE },
        { message: UNANNOTATED_STORY_MESSAGE },
      ],
    },
  ],
});

console.log('storybook-typed-meta: ok');
