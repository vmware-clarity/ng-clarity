/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAccordion, ClrAccordionModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-accordion [clrAccordionMultiPanel]="clrAccordionMultiPanel">
      <clr-accordion-panel
        *ngFor="let _ of createArray(panelCount); let i = index"
        [clrAccordionPanelOpen]="!!openIndices[i]"
      >
        <clr-accordion-title>{{title}} {{i}}</clr-accordion-title>
        <clr-accordion-content>{{content}} {{i}}</clr-accordion-content>
      </clr-accordion-panel>
    </clr-accordion>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Accordion/Accordion',
  component: ClrAccordion,
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

const variants: Parameters[] = [
  {
    clrAccordionMultiPanel: false,
    panelCount: 4,
    openIndices: [],
  },
  {
    clrAccordionMultiPanel: false,
    panelCount: 4,
    openIndices: [true],
  },
  {
    clrAccordionMultiPanel: false,
    panelCount: 4,
    openIndices: [false, false, false, true],
  },
  {
    clrAccordionMultiPanel: true,
    panelCount: 4,
    openIndices: [false, true, true, false],
  },
  {
    clrAccordionMultiPanel: true,
    panelCount: 4,
    openIndices: [true, true, true, true],
  },
];

setupStorybook(ClrAccordionModule, defaultStory, defaultParameters, variants);
