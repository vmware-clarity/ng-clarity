/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAccordionModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-accordion>
      <clr-accordion-panel
        *ngFor="let _ of createArray(panelCount); let i = index"
        [clrAccordionPanelOpen]="openIndex === i"
      >
        <clr-accordion-title>Parent Title {{i + 1}}</clr-accordion-title>
        <clr-accordion-content>
          <clr-accordion>
            <clr-accordion-panel [clrAccordionPanelOpen]="nestedOpenIndex === i">
              <clr-accordion-title>Nested Title</clr-accordion-title>
              <clr-accordion-content>Nested content</clr-accordion-content>
            </clr-accordion-panel>
          </clr-accordion>
        </clr-accordion-content>
      </clr-accordion-panel>
    </clr-accordion>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Accordion/Nested Accordion',
  argTypes: {
    // story helpers
    openIndex: { control: { disable: true }, table: { disable: true } },
    nestedOpenIndex: { control: { disable: true }, table: { disable: true } },
    createArray: { control: { disable: true }, table: { disable: true } },
    panelCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // story helpers
    openIndex: undefined,
    nestedOpenIndex: undefined,
    createArray: n => new Array(n),
    panelCount: 4,
  },
};

const variants: Parameters[] = [
  {
    openIndex: 0,
  },
  {
    openIndex: 0,
    nestedOpenIndex: 0,
  },
];

setupStorybook(ClrAccordionModule, defaultStory, defaultParameters, variants);
