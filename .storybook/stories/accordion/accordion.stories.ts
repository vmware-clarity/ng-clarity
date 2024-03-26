/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAccordion, ClrAccordionModule } from '@clr/angular';
import { moduleMetadata, Story } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Accordion/Accordion',
  component: ClrAccordion,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrAccordionModule],
    }),
  ],
  argTypes: {
    // inputs
    clrAccordionMultiPanel: { defaultValue: false, control: { type: 'boolean' } },
    // story helpers
    openIndices: { control: { disable: true }, table: { disable: true } },
    createArray: { control: { disable: true }, table: { disable: true } },
    panelCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // story helpers
    openIndices: [],
    createArray: n => new Array(n),
    panelCount: 4,
    title: 'Title',
    content: 'Hello World!',
  },
};

const template = `
  <clr-accordion [clrAccordionMultiPanel]="clrAccordionMultiPanel">
    <clr-accordion-panel
      *ngFor="let _ of createArray(panelCount); let i = index"
      [clrAccordionPanelOpen]="!!openIndices[i]"
    >
      <clr-accordion-title>{{ title }} {{ i + 1 }}</clr-accordion-title>
      <clr-accordion-content>{{ content }} {{ i + 1 }}</clr-accordion-content>
    </clr-accordion-panel>
  </clr-accordion>
`;

export const Initial: Story = args => ({
  template,
  props: args,
});

export const SinglePanelOpened: Story = Initial.bind({});
SinglePanelOpened.args = {
  ...Initial.args,
  openIndices: [true, false, false, false],
};

export const MultiplePanelsOpened: Story = Initial.bind({});
MultiplePanelsOpened.argTypes = {
  ...Initial.argTypes,
  clrAccordionMultiPanel: { defaultValue: true, control: { disable: true } },
};
MultiplePanelsOpened.args = {
  ...Initial.args,
  openIndices: [true, true, false, false],
};
