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

const nestedComponentNames = [
  'accordion',
  'alert',
  'badge',
  'button',
  'button-group',
  'card',
  'checkbox',
  'combobox',
  'datagrid',
  'datalist',
  'date-picker',
  'dropdown',
  'file-picker',
  'icon button',
  'input',
  'label',
  'list',
  'modal',
  'password',
  'progress-bar',
  'radio',
  'range',
  'select',
  'signpost',
  'side-panel',
  'stack-view',
  'stepper',
  'spinner',
  'table',
  'textarea',
  'timeline',
  'toggle',
  'tooltip',
  'timeline',
  'tree-view',
  'wizard',
];

const nesting = nestingComponents
  .filter(comp => nestedComponentNames.includes(comp.name))
  .map(a => `<div><h5>${a.name}</h5>${a.template}</div>`)
  .join('<hr/>');

const template = `
  <clr-accordion>
    <clr-accordion-panel [clrAccordionPanelOpen]="true">
      <clr-accordion-title>Parent Title</clr-accordion-title>
      <clr-accordion-content>${nesting}</clr-accordion-content>
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
