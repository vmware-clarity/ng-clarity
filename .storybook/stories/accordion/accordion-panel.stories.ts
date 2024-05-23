/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAccordionModule, ClrAccordionPanel } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, Story } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

const template = `
    <clr-accordion>
      <clr-accordion-panel
        [clrAccordionPanelOpen]="clrAccordionPanelOpen"
        [clrAccordionPanelDisabled]="clrAccordionPanelDisabled"
        (clrAccordionPanelOpenChange)="clrAccordionPanelOpenChange($event)"
      >
        <clr-accordion-title>{{ title }}</clr-accordion-title>
        <clr-accordion-content>{{ content }}</clr-accordion-content>
      </clr-accordion-panel>
    </clr-accordion>
  `;

export default {
  title: 'Accordion/Accordion Panel',
  component: ClrAccordionPanel,
  argTypes: {
    // outputs
    clrAccordionPanelOpenChange: { control: { disable: true } },
    title: { description: 'Rendered within the `<clr-accordion-title>` element' },
    content: { description: 'Rendered within the `<clr-accordion-content>` element' },
    // methods
    togglePanel: { control: { disable: true } },
    collapsePanelOnAnimationDone: { control: { disable: true }, table: { disable: true } },
    getAccordionContentId: { control: { disable: true }, table: { disable: true } },
    getAccordionHeaderId: { control: { disable: true }, table: { disable: true } },
    getPanelStateClasses: { control: { disable: true }, table: { disable: true } },
  },
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrAccordionModule],
    }),
  ],
  args: {
    // outputs
    clrAccordionPanelOpenChange: action('clrAccordionPanelOpenChange'),
    // story helpers
    title: 'Title',
    content: 'Hello World!',
    clrAccordionPanelDisabled: false,
    clrAccordionPanelOpen: false,
  },
};

export const PanelClosed: Story = args => ({
  template,
  props: args,
});

export const PanelOpened: Story = PanelClosed.bind({});
PanelOpened.args = {
  ...PanelClosed.args,
  clrAccordionPanelOpen: true,
};

export const PanelClosedDisabled: Story = PanelClosed.bind({});
PanelClosedDisabled.args = {
  ...PanelClosed.args,
  clrAccordionPanelDisabled: true,
};

export const PanelOpenedDisabled: Story = PanelOpened.bind({});
PanelOpenedDisabled.args = {
  ...PanelOpened.args,
  clrAccordionPanelDisabled: true,
};
