/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAccordionModule, ClrAccordionPanel } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
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
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Accordion/Accordion Panel',
  component: ClrAccordionPanel,
  argTypes: {
    // outputs
    clrAccordionPanelOpenChange: { control: { disable: true } },
    // methods
    togglePanel: { control: { disable: true } },
    collapsePanelOnAnimationDone: { control: { disable: true }, table: { disable: true } },
    getAccordionContentId: { control: { disable: true }, table: { disable: true } },
    getAccordionHeaderId: { control: { disable: true }, table: { disable: true } },
    getPanelStateClasses: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrAccordionPanelOpenChange: action('clrAccordionPanelOpenChange'),
    // story helpers
    title: 'Title',
    content: 'Hello World!',
  },
};

const variants: Parameters[] = [
  {
    clrAccordionPanelOpen: false,
    clrAccordionPanelDisabled: false,
  },
  {
    clrAccordionPanelOpen: false,
    clrAccordionPanelDisabled: true,
  },
  {
    clrAccordionPanelOpen: true,
    clrAccordionPanelDisabled: false,
  },
  {
    clrAccordionPanelOpen: true,
    clrAccordionPanelDisabled: true,
  },
];

setupStorybook(ClrAccordionModule, defaultStory, defaultParameters, variants);
