/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDateInput, ClrDatepickerModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Datepicker/Datepicker',
  component: ClrDateInput,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDatepickerModule],
    }),
  ],
  argTypes: {
    // inputs
    clrDate: { control: { type: 'date' } },
    max: { control: { type: 'date' } },
    min: { control: { type: 'date' } },
    // outputs
    clrDateChange: { control: { disable: true } },
    // methods
    onValueChange: { control: { disable: true }, table: { disable: true } },
    setFocusStates: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    // story helpers
    getDateObject: { control: { disable: true }, table: { disable: true } },
    getDateString: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    disabled: false,
    placeholder: '',
    id: '',
    // outputs
    clrDateChange: action('clrDateChange'),
    // story helpers
    getDateObject: date => {
      try {
        return date && new Date(date).toISOString();
      } catch {
        return undefined;
      }
    },
    getDateString: date => date && new Date(date).toISOString().split('T')[0],
  },
};

const DatePickerTemplate: StoryFn = args => ({
  template: `
    <clr-date-container>
      <label>Date</label>
      <input
        #date
        type="date"
        [id]="id"
        [clrDate]="getDateObject(date.value || clrDate)"
        [min]="getDateString(min)"
        [max]="getDateString(max)"
        [disabled]="disabled"
        [placeholder]="placeholder"
        (clrDateChange)="clrDateChange($event)"
        autocomplete="off"
      />
    </clr-date-container>
  `,
  props: { ...args },
});

export const Datepicker: StoryObj = {
  render: DatePickerTemplate,
};

export const DefaultDate: StoryObj = {
  render: DatePickerTemplate,
  args: {
    clrDate: '2022-01-01 00:00:00.000',
  },
};

export const Disabled: StoryObj = {
  render: DatePickerTemplate,
  args: {
    disabled: true,
  },
};

export const MinDate: StoryObj = {
  render: DatePickerTemplate,
  args: {
    min: Date.now() - 2592000000,
  },
};

export const MaxDate: StoryObj = {
  render: DatePickerTemplate,
  args: {
    max: Date.now() + 2592000000,
  },
};
