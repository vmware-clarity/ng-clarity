/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAccordionModule, ClrAccordionPanel } from '@clr/angular';
import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';

import { AccordionPanelStorybookComponent } from './accordion-panel.storybook.component';

/**
 * The args drive `<storybook-accordion-panel>`. The three `ClrAccordionPanel` methods are not args -- they
 * are picked up in `argTypes` only so the controls table generated from `component: ClrAccordionPanel` can
 * hide them, so they are named here to keep `argTypes` type-checked.
 */
type AccordionPanelArgs = AccordionPanelStorybookComponent &
  Pick<ClrAccordionPanel, 'togglePanel' | 'collapsePanelOnAnimationDone' | 'getPanelStateClasses'>;

const meta: Meta<AccordionPanelArgs> = {
  title: 'Accordion/Accordion Panel',
  component: ClrAccordionPanel,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrAccordionModule, AccordionPanelStorybookComponent],
    }),
  ],
  argTypes: {
    title: { description: 'Rendered within the `<clr-accordion-title>` element' },
    content: { description: 'Rendered within the `<clr-accordion-content>` element' },
    // methods
    togglePanel: { control: { disable: true } },
    ...hideControls('collapsePanelOnAnimationDone', 'getPanelStateClasses'),
  },
  args: {
    // story helpers
    title: 'Title',
    content: 'Hello World!',
    clrAccordionPanelDisabled: false,
    clrAccordionPanelOpen: false,
  },
  render: args => ({
    props: {
      ...args,
    },
    template: `
      <storybook-accordion-panel ${argsToTemplate(args)}></storybook-accordion-panel>
    `,
  }),
};

export default meta;

type Story = StoryObj<AccordionPanelArgs>;

export const PanelClosed: Story = {
  args: {
    clrAccordionPanelOpen: false,
  },
};

export const PanelOpened: Story = {
  args: {
    clrAccordionPanelOpen: true,
  },
};

export const PanelClosedDisabled: Story = {
  args: {
    clrAccordionPanelOpen: false,
    clrAccordionPanelDisabled: true,
  },
};

export const PanelOpenedDisabled: Story = {
  args: {
    clrAccordionPanelOpen: true,
    clrAccordionPanelDisabled: true,
  },
};
