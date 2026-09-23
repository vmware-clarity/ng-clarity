/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const rule = require('../storybook-no-component-decorator');
const { ruleTester } = require('./rule-tester');

const MESSAGE =
  'No `@Component` in a story file. Move the component into a sibling `*.storybook.component.ts` and import it.';

ruleTester.run('storybook-no-component-decorator', rule, {
  valid: [
    {
      code: "import { AccordionStorybookComponent } from './accordion.storybook.component';",
    },
    {
      code: ['class Example {', '  @Input() clrDisabled = false;', '}'].join('\n'),
    },
  ],
  invalid: [
    {
      code: ["@Component({ selector: 'storybook-accordion', template: '<div></div>' })", 'class Example {}'].join('\n'),
      errors: [{ message: MESSAGE }],
    },
    {
      code: ['@Component', 'class Example {}'].join('\n'),
      errors: [{ message: MESSAGE }],
    },
  ],
});

console.log('storybook-no-component-decorator: ok');
