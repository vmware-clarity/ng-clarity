/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAccordionModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Accordion/Nested Accordion',
  argTypes: {
    // story helpers
    openIndex: { control: { disable: true }, table: { disable: true } },
    nestedOpenIndex: { control: { disable: true }, table: { disable: true } },
    createArray: { control: { disable: true }, table: { disable: true } },
    panelCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrAccordionModule],
    }),
  ],
  args: {
    // story helpers
    openIndex: undefined,
    nestedOpenIndex: undefined,
    createArray: n => new Array(n),
    panelCount: 4,
  },
};

const template = `
  <clr-accordion>
    <clr-accordion-panel
      *ngFor="let _ of createArray(panelCount); let i = index"
      [clrAccordionPanelOpen]="openIndex === i"
      [clrAccordionPanelHeadingEnabled]="clrAccordionPanelHeadingEnabled"
      [clrAccordionPanelHeadingLevel]="clrAccordionPanelHeadingLevel"
    >
      <clr-accordion-title>Parent Title {{ i + 1 }}</clr-accordion-title>
      <clr-accordion-content>
        <clr-accordion>
          <clr-accordion-panel
            [clrAccordionPanelOpen]="nestedOpenIndex === i"
            [clrAccordionPanelHeadingEnabled]="clrNestedAccordionPanelHeadingEnabled"
            [clrAccordionPanelHeadingLevel]="clrNestedAccordionPanelHeadingLevel"
          >
            <clr-accordion-title>Nested Title</clr-accordion-title>
            <clr-accordion-content>Nested content</clr-accordion-content>
          </clr-accordion-panel>
        </clr-accordion>
      </clr-accordion-content>
    </clr-accordion-panel>
  </clr-accordion>
`;

const NestedAccordionTemplate: StoryFn = args => ({
  template,
  props: args,
});

export const Closed: StoryObj = {
  render: NestedAccordionTemplate,
};

export const Opened: StoryObj = {
  render: NestedAccordionTemplate,
  args: {
    openIndex: 0,
    nestedOpenIndex: 0,
  },
};
