/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAccordion, ClrAccordionModule, ClrAccordionPanel } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { AccordionStorybookComponent } from './accordion.storybook.component';

export default {
  title: 'Accordion/Accordion',
  component: ClrAccordion,
  subcomponents: [ClrAccordionPanel],
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrAccordionModule, AccordionStorybookComponent],
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
  render: (args: AccordionStorybookComponent) => ({
    props: {
      ...args,
    },
    template: `
      <storybook-accordion ${argsToTemplate(args)}></storybook-accordion>
    `,
  }),
};

export const Default: StoryObj = {};

export const SinglePanelOpened: StoryObj = {
  args: {
    openIndices: [true, false, false, false],
  },
};

export const MultiplePanelsOpened: StoryObj = {
  args: {
    clrAccordionMultiPanel: true,
    openIndices: [true, true, false, false],
  },
};

export const WithPanelDescriptions: StoryObj = {
  args: {
    showDescriptions: true,
  },
};

export const AlignmentTest: StoryObj = {
  args: {
    showDescriptions: true,
    alignmentTest: true,
  },
};

export const Nested: StoryObj = {
  storyName: 'Visual Testing/Accordion/Nested',
  args: {
    showNestedAccordion: true,
  },
};
