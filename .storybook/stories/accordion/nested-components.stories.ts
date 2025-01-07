/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { nestingComponents } from '../../helpers/nesting-components';

function getForm({ firstStepControlValue = undefined }: { firstStepControlValue?: string } = {}) {
  const controls: { [key: string]: AbstractControl } = {};

  for (let i = 0; i < 100; i++) {
    controls[`step${i + 1}`] = new FormGroup({
      value: new FormControl(i === 0 ? firstStepControlValue : undefined),
    });
  }

  return new FormGroup(controls);
}

export default {
  title: 'Accordion/Nested Components',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClarityModule],
    }),
  ],
  argTypes: {
    // story helpers
    form: { control: { disable: true }, table: { disable: true }, mapping: { ['form-mapping-key']: getForm() } },
  },
  args: {
    // story helpers
    form: 'form-mapping-key',
  },
};

const template = `
  <clr-accordion>
    <clr-accordion-panel [clrAccordionPanelOpen]="true">
      <clr-accordion-title>Parent Title</clr-accordion-title>
      <clr-accordion-content>
        ${nestingComponents.map(a => a.template).join('<br />')}

        <clr-input-container>
          <label>Input</label>
          <input clrInput placeholder="No label, wrapper" name="two" />
        </clr-input-container>
        <br />
        <clr-textarea-container>
          <label>Textarea</label>
          <textarea clrTextarea></textarea>
        </clr-textarea-container>
      </clr-accordion-content>
    </clr-accordion-panel>
  </clr-accordion>
`;

const NestedComponentsTemplate: StoryFn = args => ({
  template,
  props: args,
});

export const NestedComponents: StoryObj = {
  render: NestedComponentsTemplate,
};
