/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAccordionModule, ClrAccordionPanel } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { AccordionPanelStorybookComponent } from './accordion-panel.storybook.component';

export default {
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
    collapsePanelOnAnimationDone: { control: { disable: true }, table: { disable: true } },
    getAccordionContentId: { control: { disable: true }, table: { disable: true } },
    getAccordionHeaderId: { control: { disable: true }, table: { disable: true } },
    getPanelStateClasses: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    title: 'Title',
    content: 'Hello World!',
    clrAccordionPanelDisabled: false,
    clrAccordionPanelOpen: false,
  },
  render: (args: AccordionPanelStorybookComponent) => ({
    props: {
      ...args,
    },
    template: `
      <storybook-accordion-panel ${argsToTemplate(args)}></storybook-accordion-panel>
    `,
  }),
};

export const PanelClosed: StoryObj = {
  args: {
    clrAccordionPanelOpen: false,
  },
};

export const PanelOpened: StoryObj = {
  args: {
    clrAccordionPanelOpen: true,
  },
};

export const PanelClosedDisabled: StoryObj = {
  args: {
    clrAccordionPanelOpen: false,
    clrAccordionPanelDisabled: true,
  },
};

export const PanelOpenedDisabled: StoryObj = {
  args: {
    clrAccordionPanelOpen: true,
    clrAccordionPanelDisabled: true,
  },
};
