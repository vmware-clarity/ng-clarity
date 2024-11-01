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
    >
      <clr-accordion-title>Parent Title {{ i + 1 }}</clr-accordion-title>
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
`;

const nestedComponentsTemplate = `
  <clr-accordion>
    <clr-accordion-panel>
      <clr-accordion-title>Parent Title {{ i + 1 }}</clr-accordion-title>
      <clr-accordion-content>
        TEST
        <!--        <clr-accordion>-->
        <!--          <clr-alert>Alert</clr-alert>-->
        <!--          <clr-badge></clr-badge>-->
        <!--          <clr-button>Alert</clr-button>-->
        <!--          <clr-button-group>Alert</clr-button-group>-->
        <!--          <clr-card>Alert</clr-card>-->
        <!--          <clr-checkbox-wrapper>Alert</clr-checkbox-wrapper>-->
        <!--          <clr-combobox>Alert</clr-combobox>-->
        <!--          <clr-datagrid>Alert</clr-datagrid>-->
        <!--          <clr-datalist-container>Alert</clr-datalist-container>-->
        <!--          <clr-datapicker>Alert</clr-datapicker>-->
        <!--          <clr-dropdown>Alert</clr-dropdown>-->
        <!--          <clr-file-input-container>Alert</clr-file-input-container>-->
        <!--          <clr-icon>Alert</clr-icon>-->
        <!--          <clr-input-container>Alert</clr-input-container>-->
        <!--          <clr-label>Alert</clr-label>-->
        <!--          <clr-list>Alert</clr-list>-->
        <!--          <clr-modal>Alert</clr-modal>-->
        <!--          <clr-password-container>Alert</clr-password-container>-->
        <!--          <clr-progress-bar>Alert</clr-progress-bar>-->
        <!--          <clr-radio-container>Alert</clr-radio-container>-->
        <!--          <clr-range-containerAlert</clr-range-container>-->
        <!--          <clr-select-container>Alert</clr-select-container>-->
        <!--          <clr-signpost>Alert</clr-radio-container>-->
        <!--          <clr-spinner>Alert</clr-radio-container>-->
        <!--          <clr-table>Alert</clr-radio-container>-->
        <!--          <clr-textarea-container>Alert</clr-radio-container>-->
        <!--          <clr-timeline>Alert</clr-radio-container>-->
        <!--          <clr-toggle-wrapper>Alert</clr-radio-container>-->
        <!--          <clr-tooltip>Alert</clr-radio-container>-->
        <!--          <clr-timeline>Alert</clr-radio-container>-->
        <!--          <clr-tree>Alert</clr-radio-container>-->
        <!--          <clr-wizard>Alert</clr-radio-container>-->
        <!--        </clr-accordion>-->
      </clr-accordion-content>
    </clr-accordion-panel>
  </clr-accordion>
`;

const NestedAccordionTemplate: StoryFn = args => ({
  template,
  props: args,
});

const NestedComponentsAccordionTemplate: StoryFn = args => ({
  nestedComponentsTemplate,
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

export const Nstd: StoryObj = {
  render: NestedComponentsAccordionTemplate,
};
