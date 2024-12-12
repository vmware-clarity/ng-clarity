/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAccordion, ClrAccordionModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

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
    // story helpers
    openIndices: { control: { disable: true }, table: { disable: true } },
    createArray: { control: { disable: true }, table: { disable: true } },
    panelCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // inputs
    clrAccordionMultiPanel: false,
    // story helpers
    openIndices: [],
    createArray: n => new Array(n),
    panelCount: 4,
    title: 'Title',
    content: 'Hello World!',
    showDescriptions: false,
    alignmentTest: false,
  },
};

const template = `
  <clr-accordion [clrAccordionMultiPanel]="clrAccordionMultiPanel">
    <clr-accordion-panel
      *ngFor="let _ of createArray(panelCount); let i = index"
      [clrAccordionPanelOpen]="!!openIndices[i]"
      [clrAccordionPanelHeadingEnabled]="clrAccordionPanelHeadingEnabled"
      [clrAccordionPanelHeadingLevel]="clrAccordionPanelHeadingLevel"
    >
      <clr-accordion-title>
        {{ title }} {{ i + 1 }} {{ alignmentTest && i === 2 ? '(alignment test)' : '' }}
      </clr-accordion-title>
      <clr-accordion-description *ngIf="showDescriptions">Panel {{ i + 1 }} description.</clr-accordion-description>
      <clr-accordion-content>{{ content }} {{ i + 1 }}</clr-accordion-content>
    </clr-accordion-panel>
  </clr-accordion>
`;

const AccordionTemplate: StoryFn = args => ({
  template,
  props: args,
});

export const Initial: StoryObj = {
  render: AccordionTemplate,
};

export const SinglePanelOpened: StoryObj = {
  render: AccordionTemplate,
  args: {
    openIndices: [true, false, false, false],
  },
};

export const MultiplePanelsOpened: StoryObj = {
  render: AccordionTemplate,
  args: {
    clrAccordionMultiPanel: true,
    openIndices: [true, true, false, false],
  },
};

export const WithPanelDescriptions: StoryObj = {
  render: AccordionTemplate,
  args: {
    showDescriptions: true,
  },
};

export const AlignmentTest: StoryObj = {
  render: AccordionTemplate,
  args: {
    showDescriptions: true,
    alignmentTest: true,
  },
};
