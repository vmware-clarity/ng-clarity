/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormControl, FormGroup } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { renderNestedComponent } from '../../helpers/nesting-components';

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
  'icon',
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
  'toggle',
  'tooltip',
  'timeline',
  'tree-view',
  'wizard',
];

const stepperFormGroup = new FormGroup({
  step1: new FormGroup({
    value: new FormControl(undefined),
  }),
  step2: new FormGroup({
    value: new FormControl(undefined),
  }),
});

export default {
  title: 'Accordion/Nested Components',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClarityModule],
    }),
  ],
  argTypes: {
    // story helpers
    form: { control: { disable: true }, table: { disable: true }, mapping: { ['form-mapping-key']: stepperFormGroup } },
  },
  args: {
    // story helpers
    form: 'form-mapping-key',
  },
};

const nestedComponents = renderNestedComponent(nestedComponentNames);

const template = `
  <clr-accordion>
    <clr-accordion-panel [clrAccordionPanelOpen]="true">
      <clr-accordion-title>Short Title</clr-accordion-title>
      <clr-accordion-content>${nestedComponents}</clr-accordion-content>
    </clr-accordion-panel>
    <clr-accordion-panel>
      <clr-accordion-title>Accrodion Title</clr-accordion-title>
      <clr-accordion-content>Content</clr-accordion-content>
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
