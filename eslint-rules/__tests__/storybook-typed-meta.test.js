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
const UNTYPED_META_DECLARATION_MESSAGE =
  'The default-exported story meta must be a constant declared in this file and typed `Meta<TArgs>`: `const meta: Meta<TArgs> = {…};` or `const meta = {…} satisfies Meta<TArgs>;`.';
const WRONG_STORY_TYPE_MESSAGE =
  'Story exports must be typed with the file-local `Story` type (or `StoryObj<TArgs>`), e.g. `export const Default: Story = {};`.';

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
    {
      // Storybook's recommended CSF3 form
      code: [
        "const meta = { title: 'Components/Accordion' } satisfies Meta<AccordionArgs>;",
        'export default meta;',
      ].join('\n'),
    },
    {
      // the meta declared after other statements, and a non-story default export is not a meta
      code: [
        'const meta: Meta<AccordionArgs> = {};',
        'type Story = StoryObj<AccordionArgs>;',
        'export const Default: Story = {};',
        'export default meta;',
      ].join('\n'),
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
    {
      // an untyped meta constant: nothing checks the args
      code: "const meta = { title: 'Components/Badge' };\nexport default meta;",
      output: null,
      errors: [{ message: UNTYPED_META_DECLARATION_MESSAGE, line: 2, column: 16 }],
    },
    {
      // a cast is not a type check
      code: "const meta = { title: 'Components/Badge' } as Meta<BadgeArgs>;\nexport default meta;",
      output: null,
      errors: [{ message: UNTYPED_META_DECLARATION_MESSAGE }],
    },
    {
      // annotated, but not with Meta
      code: 'const meta: Record<string, unknown> = {};\nexport default meta;',
      output: null,
      errors: [{ message: UNTYPED_META_DECLARATION_MESSAGE }],
    },
    {
      // declared in another file: this rule cannot see its type
      code: "import meta from './shared-meta';\nexport default meta;",
      output: null,
      errors: [{ message: UNTYPED_META_DECLARATION_MESSAGE }],
    },
    {
      // `satisfies Meta` without a type argument is reported once, by the type-argument check
      code: 'const meta = {} satisfies Meta;\nexport default meta;',
      output: null,
      errors: [{ message: UNTYPED_META_MESSAGE }],
    },
    {
      // wrapping the literal does not make `export default {` acceptable
      code: "export default { title: 'Components/Accordion' } satisfies Meta<AccordionArgs>;",
      output: null,
      errors: [{ message: EXPORT_DEFAULT_MESSAGE }],
    },
    {
      code: 'export const A: any = {};',
      output: null,
      errors: [{ message: WRONG_STORY_TYPE_MESSAGE, line: 1, column: 15 }],
    },
    {
      code: 'export const A: Meta<AccordionArgs> = {};',
      output: null,
      errors: [{ message: WRONG_STORY_TYPE_MESSAGE }],
    },
  ],
});

console.log('storybook-typed-meta: ok');
