/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAccordion, ClrAccordionModule, ClrAccordionPanel } from '@clr/angular';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

import { AccordionStorybookComponent } from './accordion.storybook.component';

/**
 * The args drive `<storybook-accordion>`, so the args type is that component: its `@Input()`s carry the
 * `clr*` names the story binds. `ClrAccordion` itself cannot be used here -- it declares the input as
 * `@Input('clrAccordionMultiPanel') multiPanel`, so `clrAccordionMultiPanel` is not a property of the class.
 */
type AccordionArgs = AccordionStorybookComponent;

const meta: Meta<AccordionArgs> = {
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
    ...hideControls('openIndices'),
    panelCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // inputs
    clrAccordionMultiPanel: false,
    // story helpers
    openIndices: [],
    panelCount: 4,
    title: 'Title',
    content: 'Hello World!',
    showDescriptions: false,
    alignmentTest: false,
    clrAccordionPanelDisabled: false,
  },
  render: args => ({
    props: {
      ...args,
    },
    template: `
      <storybook-accordion ${argsToTemplate(args)}></storybook-accordion>
    `,
  }),
};

export default meta;

type Story = StoryObj<AccordionArgs>;

export const Default: Story = {};

export const FirstPanelOpened: Story = {
  args: {
    openIndices: [true, false, false, false],
  },
};

export const SecondPanelOpened: Story = {
  args: {
    openIndices: [false, true, false, false],
  },
};

export const MultiplePanelsOpened: Story = {
  args: {
    clrAccordionMultiPanel: true,
    openIndices: [true, true, false, false],
  },
};

export const WithPanelDescriptions: Story = {
  args: {
    showDescriptions: true,
  },
};

export const AlignmentTest: Story = {
  args: {
    showDescriptions: true,
    alignmentTest: true,
  },
};

export const SinglePanelOpened: Story = {
  args: {
    panelCount: 1,
    openIndices: [true],
  },
};

export const SinglePanelClosed: Story = {
  args: {
    panelCount: 1,
    openIndices: [false],
  },
};

export const SinglePanelOpenedDisabled: Story = {
  args: {
    panelCount: 1,
    openIndices: [true],
    clrAccordionPanelDisabled: true,
  },
};

export const SinglePanelClosedDisabled: Story = {
  args: {
    panelCount: 1,
    openIndices: [false],
    clrAccordionPanelDisabled: true,
  },
};
